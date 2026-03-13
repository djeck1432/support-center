"""FastAPI application entry point."""

import os
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

from database import init_db  # noqa: E402
from routers import calls, scripts, ws  # noqa: E402
from scripts.seed_scripts import seed  # noqa: E402

_initialized = False


async def _ensure_ready() -> None:
    """Initialize DB and seed scripts (safe to call multiple times)."""
    global _initialized
    if not _initialized:
        await init_db()
        await seed()
        _initialized = True


@asynccontextmanager
async def lifespan(app: FastAPI):
    await _ensure_ready()
    yield


app = FastAPI(title="Call Center API", version="1.0.0", lifespan=lifespan)


@app.middleware("http")
async def ensure_db_middleware(request: Request, call_next):
    """Fallback for serverless envs where lifespan events may not fire."""
    await _ensure_ready()
    return await call_next(request)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(calls.router)
app.include_router(scripts.router)
app.include_router(ws.router)


@app.get("/api/health")
async def health():
    return {"status": "ok"}
