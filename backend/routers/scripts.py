"""REST endpoints for support script management."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from models import SupportScript
from schemas import SupportScriptCreate, SupportScriptOut, SupportScriptUpdate

router = APIRouter(prefix="/api/scripts", tags=["scripts"])


@router.get("/", response_model=list[SupportScriptOut])
async def list_scripts(db: AsyncSession = Depends(get_db)) -> list[SupportScript]:
    """Return all support scripts."""
    result = await db.execute(select(SupportScript).order_by(SupportScript.id))
    return list(result.scalars().all())


@router.get("/{script_id}", response_model=SupportScriptOut)
async def get_script(
    script_id: int, db: AsyncSession = Depends(get_db)
) -> SupportScript:
    """Return a single support script by ID."""
    script = await db.get(SupportScript, script_id)
    if not script:
        raise HTTPException(status_code=404, detail="Script not found")
    return script


@router.post("/", response_model=SupportScriptOut, status_code=201)
async def create_script(
    payload: SupportScriptCreate, db: AsyncSession = Depends(get_db)
) -> SupportScript:
    """Create a new support script."""
    script = SupportScript(**payload.model_dump())
    db.add(script)
    await db.commit()
    await db.refresh(script)
    return script


@router.put("/{script_id}", response_model=SupportScriptOut)
async def update_script(
    script_id: int,
    payload: SupportScriptUpdate,
    db: AsyncSession = Depends(get_db),
) -> SupportScript:
    """Update an existing support script."""
    script = await db.get(SupportScript, script_id)
    if not script:
        raise HTTPException(status_code=404, detail="Script not found")

    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(script, field, value)

    await db.commit()
    await db.refresh(script)
    return script


@router.delete("/{script_id}", status_code=204)
async def delete_script(
    script_id: int, db: AsyncSession = Depends(get_db)
) -> None:
    """Delete a support script."""
    script = await db.get(SupportScript, script_id)
    if not script:
        raise HTTPException(status_code=404, detail="Script not found")
    await db.delete(script)
    await db.commit()
