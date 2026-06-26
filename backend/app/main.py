"""FastAPI entrypoint for OSMentor AI."""

from __future__ import annotations

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.chat import router as chat_router
from app.api.diagrams import router as study_tools_router
from app.api.quiz import router as quiz_router
from app.api.viva import router as viva_router
from app.config.settings import get_settings

settings = get_settings()
settings.ensure_directories()

logging.basicConfig(level=settings.log_level.upper(),
                    format="%(asctime)s %(levelname)s %(name)s: %(message)s")
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("OSMentor AI backend started (provider: %s)", settings.llm_provider)
    yield
    logger.info("OSMentor AI backend shutting down")


app = FastAPI(title=settings.app_name, version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.parsed_cors_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router)
app.include_router(quiz_router)
app.include_router(viva_router)
app.include_router(study_tools_router)


@app.get("/")
async def root() -> dict[str, str]:
    return {"message": "OSMentor AI API is running.", "provider": settings.llm_provider}


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok", "provider": settings.llm_provider}
