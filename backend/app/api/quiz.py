"""Quiz API routes."""

from __future__ import annotations

from fastapi import APIRouter

from backend.app.models.request_models import QuizGenerateRequest, QuizSubmitRequest
from backend.app.models.response_models import QuizGenerateResponse, QuizItem, QuizSubmitResponse
from backend.app.services.quiz_generator import get_quiz_service

router = APIRouter(prefix="/quiz", tags=["quiz"])


@router.post("/generate", response_model=QuizGenerateResponse)
async def generate_quiz(request: QuizGenerateRequest) -> QuizGenerateResponse:
    service = get_quiz_service()
    mcq = [QuizItem(**item) for item in service.generate_mcq(request.topic, request.difficulty, request.mcq_count)]
    short_questions = [
        QuizItem(**item) for item in service.generate_short_questions(request.topic, request.difficulty, request.short_count)
    ]
    return QuizGenerateResponse(
        topic=request.topic,
        difficulty=request.difficulty,
        mcq=mcq,
        short_questions=short_questions,
    )


@router.post("/submit", response_model=QuizSubmitResponse)
async def submit_quiz(request: QuizSubmitRequest) -> QuizSubmitResponse:
    service = get_quiz_service()
    payload = service.evaluate_submission(request.answers, request.answer_key)
    return QuizSubmitResponse(**payload)
