"""FastAPI application entry point."""

import os
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

from database import init_db  # noqa: E402
from routers import calls, scripts, ws  # noqa: E402
from scripts.seed_scripts import seed  # noqa: E402

_initialized = False


@asynccontextmanager
async def lifespan(app: FastAPI):
    global _initialized
    if not _initialized:
        await init_db()
        await seed()
        _initialized = True
    yield


app = FastAPI(title="Call Center API", version="1.0.0", lifespan=lifespan)

allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

vercel_url = os.getenv("VERCEL_URL")
if vercel_url:
    allowed_origins.append(f"https://{vercel_url}")

vercel_project = os.getenv("VERCEL_PROJECT_PRODUCTION_URL")
if vercel_project:
    allowed_origins.append(f"https://{vercel_project}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if os.getenv("VERCEL") else allowed_origins,
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
