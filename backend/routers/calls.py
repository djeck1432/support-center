"""REST endpoints for call management and dashboard statistics."""

from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from database import get_db
from models import Call, CallMessage
from schemas import CallCreate, CallDetailOut, CallOut, DashboardStats

router = APIRouter(prefix="/api/calls", tags=["calls"])


@router.get("/", response_model=list[CallOut])
async def list_calls(
    status: str | None = None,
    db: AsyncSession = Depends(get_db),
) -> list[Call]:
    """List all calls, optionally filtered by status."""
    stmt = select(Call).order_by(Call.started_at.desc())
    if status:
        stmt = stmt.where(Call.status == status)
    result = await db.execute(stmt)
    return list(result.scalars().all())


@router.post("/", response_model=CallOut, status_code=201)
async def create_call(
    payload: CallCreate,
    db: AsyncSession = Depends(get_db),
) -> Call:
    """Start a new call with a given phone number."""
    call = Call(phone_number=payload.phone_number, status="active")
    db.add(call)
    await db.commit()
    await db.refresh(call)
    return call


@router.get("/dashboard", response_model=DashboardStats)
async def dashboard_stats(db: AsyncSession = Depends(get_db)) -> DashboardStats:
    """Return aggregate dashboard statistics."""
    today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)

    total_today = await db.scalar(
        select(func.count(Call.id)).where(Call.started_at >= today_start)
    ) or 0

    active = await db.scalar(
        select(func.count(Call.id)).where(Call.status == "active")
    ) or 0

    completed = await db.scalar(
        select(func.count(Call.id)).where(Call.status == "completed")
    ) or 0

    avg_q = select(
        func.avg(
            func.julianday(Call.ended_at) - func.julianday(Call.started_at)
        )
    ).where(Call.ended_at.isnot(None))
    avg_days = await db.scalar(avg_q)
    avg_seconds = (avg_days or 0) * 86400

    unresolved = await db.scalar(
        select(func.count(CallMessage.id)).where(CallMessage.is_unresolved == True)  # noqa: E712
    ) or 0

    return DashboardStats(
        total_calls_today=total_today,
        active_calls=active,
        completed_calls=completed,
        avg_duration_seconds=round(avg_seconds, 1),
        unresolved_count=unresolved,
    )


@router.get("/unresolved", response_model=list[CallDetailOut])
async def unresolved_calls(db: AsyncSession = Depends(get_db)) -> list[Call]:
    """Return calls that contain at least one unresolved message."""
    stmt = (
        select(Call)
        .join(CallMessage)
        .where(CallMessage.is_unresolved == True)  # noqa: E712
        .options(selectinload(Call.messages))
        .distinct()
        .order_by(Call.started_at.desc())
    )
    result = await db.execute(stmt)
    return list(result.scalars().all())


@router.get("/{call_id}", response_model=CallDetailOut)
async def get_call(call_id: int, db: AsyncSession = Depends(get_db)) -> Call:
    """Get a single call with its full message transcript."""
    stmt = (
        select(Call)
        .where(Call.id == call_id)
        .options(selectinload(Call.messages))
    )
    result = await db.execute(stmt)
    call = result.scalar_one_or_none()
    if not call:
        raise HTTPException(status_code=404, detail="Call not found")
    return call


@router.patch("/{call_id}/end", response_model=CallOut)
async def end_call(call_id: int, db: AsyncSession = Depends(get_db)) -> Call:
    """End an active call."""
    call = await db.get(Call, call_id)
    if not call:
        raise HTTPException(status_code=404, detail="Call not found")
    call.status = "completed"
    call.ended_at = datetime.utcnow()

    msg_result = await db.execute(
        select(CallMessage).where(
            CallMessage.call_id == call_id,
            CallMessage.is_unresolved == True,  # noqa: E712
        )
    )
    if msg_result.scalars().first():
        call.is_resolved = False

    await db.commit()
    await db.refresh(call)
    return call
