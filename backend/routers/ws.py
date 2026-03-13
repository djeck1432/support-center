"""WebSocket endpoint for real-time call communication."""

import json
from datetime import datetime

from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect
from sqlalchemy.ext.asyncio import AsyncSession

from database import async_session
from models import Call, CallMessage
from services.ai_service import analyze_and_respond

router = APIRouter()


@router.websocket("/ws/call/{call_id}")
async def call_websocket(websocket: WebSocket, call_id: int) -> None:
    """Handle real-time call communication.

    Client sends: {"text": "transcribed customer speech"}
    Server responds: {"response": "...", "matched_script_id": ..., "confidence": ..., "is_unresolved": ...}
    """
    await websocket.accept()

    conversation_history: list[dict[str, str]] = []

    try:
        while True:
            raw = await websocket.receive_text()
            data = json.loads(raw)
            customer_text = data.get("text", "").strip()

            if not customer_text:
                await websocket.send_json({"error": "Empty text received"})
                continue

            async with async_session() as db:
                db.add(CallMessage(
                    call_id=call_id,
                    role="customer",
                    content=customer_text,
                    timestamp=datetime.utcnow(),
                ))
                await db.commit()

                conversation_history.append({"role": "user", "content": customer_text})

                ai_result = await analyze_and_respond(
                    db=db,
                    customer_text=customer_text,
                    conversation_history=conversation_history,
                )

                ai_message = CallMessage(
                    call_id=call_id,
                    role="ai",
                    content=ai_result["response"],
                    timestamp=datetime.utcnow(),
                    is_unresolved=ai_result["is_unresolved"],
                    matched_script_id=ai_result.get("matched_script_id"),
                )
                db.add(ai_message)

                if ai_result["is_unresolved"]:
                    call = await db.get(Call, call_id)
                    if call:
                        call.is_resolved = False

                await db.commit()

            conversation_history.append({"role": "assistant", "content": ai_result["response"]})

            await websocket.send_json({
                "response": ai_result["response"],
                "matched_script_id": ai_result.get("matched_script_id"),
                "matched_script_title": ai_result.get("matched_script_title"),
                "confidence": ai_result["confidence"],
                "is_unresolved": ai_result["is_unresolved"],
            })

    except WebSocketDisconnect:
        pass
    except Exception as exc:
        try:
            await websocket.send_json({"error": str(exc)})
        except Exception:
            pass
