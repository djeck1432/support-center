"""Load and manage support scripts from the database."""

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from models import SupportScript


async def get_all_scripts(db: AsyncSession) -> list[SupportScript]:
    """Return all support scripts."""
    result = await db.execute(select(SupportScript).order_by(SupportScript.id))
    return list(result.scalars().all())


async def get_script_by_id(db: AsyncSession, script_id: int) -> SupportScript | None:
    """Return a single script by ID."""
    return await db.get(SupportScript, script_id)


def build_scripts_context(scripts: list[SupportScript]) -> str:
    """Format all scripts into a single context string for the AI prompt."""
    parts: list[str] = []
    for s in scripts:
        parts.append(
            f"[Script ID: {s.id}] Category: {s.category} | Title: {s.title}\n"
            f"Keywords: {s.keywords}\n"
            f"---\n{s.script_text}\n"
        )
    return "\n\n".join(parts)
