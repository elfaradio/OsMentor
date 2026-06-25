"""Diagram API routes."""

from __future__ import annotations

from fastapi import APIRouter

from backend.app.models.request_models import ComparisonRequest, DiagramRequest
from backend.app.models.response_models import ComparisonResponse, DiagramResponse
from backend.app.services.comparison_generator import get_comparison_service
from backend.app.services.diagram_generator import get_diagram_service

router = APIRouter(prefix="/study-tools", tags=["study-tools"])


@router.post("/compare", response_model=ComparisonResponse)
async def compare_concepts(request: ComparisonRequest) -> ComparisonResponse:
    service = get_comparison_service()
    payload = service.compare(request.concept_a, request.concept_b)
    return ComparisonResponse(**payload)


@router.post("/diagram", response_model=DiagramResponse)
async def generate_diagram(request: DiagramRequest) -> DiagramResponse:
    service = get_diagram_service()
    mermaid = service.generate(request.diagram_type, request.topic)
    return DiagramResponse(diagram_type=request.diagram_type, mermaid=mermaid)
