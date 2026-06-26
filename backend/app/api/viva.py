"""Viva API routes with input validation and RAG grounding."""

from __future__ import annotations

import logging

from fastapi import APIRouter, HTTPException
from fastapi.concurrency import run_in_threadpool

from backend.app.models.request_models import VivaEvaluationRequest, VivaQuestionRequest
from backend.app.models.response_models import VivaEvaluationResponse, VivaQuestionSetResponse
from backend.app.services.validation import validate_os_topic
from backend.app.services.viva_generator import get_viva_service

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/viva", tags=["viva"])


@router.post("/questions", response_model=VivaQuestionSetResponse)
async def generate_viva_questions(request: VivaQuestionRequest) -> VivaQuestionSetResponse:
    try:
        # Validate that the topic is a recognized Operating Systems topic
        valid, error_reason, chunks = await run_in_threadpool(validate_os_topic, request.topic)
        if not valid:
            raise HTTPException(status_code=400, detail=error_reason)

        service = get_viva_service()

        # Build context block from RAG chunks to ground the viva generator
        context = ""
        if chunks:
            context = "\n\n".join([c.get("text", "") for c in chunks])

        questions = await run_in_threadpool(
            service.generate_questions, request.topic, request.difficulty, request.count, context=context
        )
        return VivaQuestionSetResponse(
            topic=request.topic,
            difficulty=request.difficulty,
            questions=questions,
        )
    except HTTPException:
        raise
    except Exception as exc:
        logger.exception("Failed to generate viva questions")
        raise HTTPException(status_code=500, detail="Unable to generate viva questions at this time.") from exc


@router.post("/evaluate", response_model=VivaEvaluationResponse)
async def evaluate_viva_answer(request: VivaEvaluationRequest) -> VivaEvaluationResponse:
    try:
        service = get_viva_service()
        payload = await run_in_threadpool(
            service.evaluate_answer, request.question, request.student_answer, request.topic
        )
        return VivaEvaluationResponse(**payload)
    except Exception as exc:
        logger.exception("Failed to evaluate viva answer")
        raise HTTPException(status_code=500, detail="Unable to evaluate answer at this time.") from exc
