"""Quiz API routes with input validation and RAG grounding."""

from __future__ import annotations

import logging

from fastapi import APIRouter, HTTPException
from fastapi.concurrency import run_in_threadpool

from backend.app.models.request_models import QuizGenerateRequest, QuizSubmitRequest
from backend.app.models.response_models import QuizGenerateResponse, QuizItem, QuizSubmitResponse
from backend.app.services.quiz_generator import get_quiz_service
from backend.app.services.validation import validate_os_topic

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/quiz", tags=["quiz"])


@router.post("/generate", response_model=QuizGenerateResponse)
async def generate_quiz(request: QuizGenerateRequest) -> QuizGenerateResponse:
    try:
        # Validate that the topic is a recognized Operating Systems topic
        valid, error_reason, chunks = await run_in_threadpool(validate_os_topic, request.topic)
        if not valid:
            raise HTTPException(status_code=400, detail=error_reason)

        service = get_quiz_service()

        # Build context block from RAG chunks to ground the quiz generator
        context = ""
        if chunks:
            context = "\n\n".join([c.get("text", "") for c in chunks])

        def _generate():
            mcq = [QuizItem(**item) for item in service.generate_mcq(
                request.topic, request.difficulty, request.mcq_count, context=context)]
            short_questions = [QuizItem(**item) for item in service.generate_short_questions(
                request.topic, request.difficulty, request.short_count, context=context)]
            return mcq, short_questions

        mcq, short_questions = await run_in_threadpool(_generate)
        return QuizGenerateResponse(
            topic=request.topic,
            difficulty=request.difficulty,
            mcq=mcq,
            short_questions=short_questions,
        )
    except HTTPException:
        raise
    except Exception as exc:
        logger.exception("Failed to generate quiz")
        raise HTTPException(status_code=500, detail="Unable to generate quiz at this time.") from exc


@router.post("/submit", response_model=QuizSubmitResponse)
async def submit_quiz(request: QuizSubmitRequest) -> QuizSubmitResponse:
    try:
        service = get_quiz_service()
        payload = await run_in_threadpool(service.evaluate_submission, request.answers, request.answer_key)
        return QuizSubmitResponse(**payload)
    except Exception as exc:
        logger.exception("Failed to submit quiz")
        raise HTTPException(status_code=500, detail="Unable to evaluate quiz at this time.") from exc
