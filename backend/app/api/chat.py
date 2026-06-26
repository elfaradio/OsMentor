"""Chat API routes for OSMentor AI."""

from __future__ import annotations

import logging

from fastapi import APIRouter, HTTPException
from fastapi.concurrency import run_in_threadpool

from backend.app.models.request_models import ChatRequest
from backend.app.models.response_models import ChatResponse
from backend.app.services.factory import get_rag_service

logger = logging.getLogger(__name__)

router = APIRouter(tags=["chat"])


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest) -> ChatResponse:
    try:
        service = get_rag_service()
        return await run_in_threadpool(service.answer_question, request.question)
    except Exception as exc:  # pragma: no cover - defensive logging for runtime failures
        logger.exception("Failed to generate chat response")
        raise HTTPException(
            status_code=500, detail="Unable to generate answer at this time.") from exc
