"""Pydantic schemas for request/response validation."""

from datetime import datetime

from pydantic import BaseModel


class SupportScriptBase(BaseModel):
    category: str
    title: str
    keywords: str
    script_text: str


class SupportScriptCreate(SupportScriptBase):
    pass


class SupportScriptUpdate(BaseModel):
    category: str | None = None
    title: str | None = None
    keywords: str | None = None
    script_text: str | None = None


class SupportScriptOut(SupportScriptBase):
    id: int
    created_at: datetime

    model_config = {"from_attributes": True}


class CallMessageOut(BaseModel):
    id: int
    call_id: int
    role: str
    content: str
    timestamp: datetime
    is_unresolved: bool
    matched_script_id: int | None = None

    model_config = {"from_attributes": True}


class CallCreate(BaseModel):
    phone_number: str


class CallOut(BaseModel):
    id: int
    phone_number: str
    status: str
    started_at: datetime
    ended_at: datetime | None = None
    is_resolved: bool
    summary: str | None = None

    model_config = {"from_attributes": True}


class CallDetailOut(CallOut):
    messages: list[CallMessageOut] = []


class DashboardStats(BaseModel):
    total_calls_today: int
    active_calls: int
    completed_calls: int
    avg_duration_seconds: float
    unresolved_count: int


class AIResponse(BaseModel):
    response: str
    matched_script_id: int | None = None
    matched_script_title: str | None = None
    confidence: float
    is_unresolved: bool


class ChatMessageIn(BaseModel):
    text: str
    history: list[dict[str, str]] = []
