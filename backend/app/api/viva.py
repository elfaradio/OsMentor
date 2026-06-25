"""Viva API routes."""

from __future__ import annotations

from fastapi import APIRouter

from backend.app.models.request_models import VivaEvaluationRequest, VivaQuestionRequest
from backend.app.models.response_models import VivaEvaluationResponse, VivaQuestionSetResponse
from backend.app.services.viva_generator import get_viva_service

router = APIRouter(prefix="/viva", tags=["viva"])


@router.post("/questions", response_model=VivaQuestionSetResponse)
async def generate_viva_questions(request: VivaQuestionRequest) -> VivaQuestionSetResponse:
    service = get_viva_service()
    questions = service.generate_questions(request.topic, request.difficulty, request.count)
    return VivaQuestionSetResponse(topic=request.topic, difficulty=request.difficulty, questions=questions)


@router.post("/evaluate", response_model=VivaEvaluationResponse)
async def evaluate_viva_answer(request: VivaEvaluationRequest) -> VivaEvaluationResponse:
    service = get_viva_service()
    payload = service.evaluate_answer(request.question, request.student_answer, request.topic)
    return VivaEvaluationResponse(**payload)
