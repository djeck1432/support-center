"""OpenAI GPT integration for customer intent analysis and response generation."""

import json
import os

from dotenv import load_dotenv
from openai import AsyncOpenAI
from sqlalchemy.ext.asyncio import AsyncSession

from services.script_engine import build_scripts_context, get_all_scripts

load_dotenv()

_client: AsyncOpenAI | None = None


def _get_client() -> AsyncOpenAI:
    global _client
    if _client is None:
        _client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    return _client

SYSTEM_PROMPT = """You are an AI customer support agent for NetConnect, an internet service provider.
You have access to the following support scripts that guide your responses.

RULES:
1. Identify which script category best matches the customer's issue.
2. Follow the script's structure: greet, diagnose, troubleshoot, escalate if needed.
3. Be conversational — don't read the entire script at once. Ask one diagnostic question at a time.
4. Keep responses concise (2-4 sentences per turn).
5. If the customer's issue doesn't match any script, say so honestly and offer to connect them with a specialist.

IMPORTANT — Return your response as JSON with these fields:
{
  "response": "Your conversational response to the customer",
  "matched_script_id": <int or null>,
  "matched_script_title": "<title or null>",
  "confidence": <float 0.0 to 1.0>,
  "is_unresolved": <true if confidence < 0.5 or no script matches>
}

Support Scripts:
"""


async def analyze_and_respond(
    db: AsyncSession,
    customer_text: str,
    conversation_history: list[dict[str, str]] | None = None,
) -> dict:
    """Analyze customer text against support scripts and generate a response.

    Args:
        db: Database session for loading scripts.
        customer_text: The transcribed customer speech.
        conversation_history: Previous messages in the call for context.

    Returns:
        Dict with response, matched_script_id, confidence, is_unresolved.
    """
    scripts = await get_all_scripts(db)
    scripts_context = build_scripts_context(scripts)

    messages = [{"role": "system", "content": SYSTEM_PROMPT + scripts_context}]

    if conversation_history:
        messages.extend(conversation_history)

    messages.append({"role": "user", "content": customer_text})

    try:
        completion = await _get_client().chat.completions.create(
            model="gpt-4o-mini",
            messages=messages,
            temperature=0.4,
            max_tokens=500,
            response_format={"type": "json_object"},
        )

        raw = completion.choices[0].message.content or "{}"
        data = json.loads(raw)

        return {
            "response": data.get("response", "I'm sorry, could you please repeat that?"),
            "matched_script_id": data.get("matched_script_id"),
            "matched_script_title": data.get("matched_script_title"),
            "confidence": float(data.get("confidence", 0.0)),
            "is_unresolved": bool(data.get("is_unresolved", True)),
        }

    except Exception as exc:
        return {
            "response": (
                "I apologize, I'm having a technical difficulty. "
                "Let me connect you with a human agent."
            ),
            "matched_script_id": None,
            "matched_script_title": None,
            "confidence": 0.0,
            "is_unresolved": True,
            "error": str(exc),
        }
