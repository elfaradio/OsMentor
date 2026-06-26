"""Diagram and comparison API routes with input validation and RAG grounding."""

from __future__ import annotations

import logging

from fastapi import APIRouter, HTTPException
from fastapi.concurrency import run_in_threadpool

from backend.app.models.request_models import ComparisonRequest, DiagramRequest
from backend.app.models.response_models import ComparisonResponse, DiagramResponse
from backend.app.services.comparison_generator import get_comparison_service
from backend.app.services.diagram_generator import get_diagram_service
from backend.app.services.validation import validate_os_topic

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/study-tools", tags=["study-tools"])


@router.post("/compare", response_model=ComparisonResponse)
async def compare_concepts(request: ComparisonRequest) -> ComparisonResponse:
    try:
        # Validate Concept A
        valid_a, reason_a, chunks_a = await run_in_threadpool(validate_os_topic, request.concept_a)
        if not valid_a:
            raise HTTPException(status_code=400, detail=f"Concept '{request.concept_a}' validation failed: {reason_a}")

        # Validate Concept B
        valid_b, reason_b, chunks_b = await run_in_threadpool(validate_os_topic, request.concept_b)
        if not valid_b:
            raise HTTPException(status_code=400, detail=f"Concept '{request.concept_b}' validation failed: {reason_b}")

        service = get_comparison_service()

        # Combine retrieved RAG contexts for both concepts
        context = ""
        combined_chunks = chunks_a + chunks_b
        if combined_chunks:
            context = "\n\n".join([c.get("text", "") for c in combined_chunks])

        payload = await run_in_threadpool(service.compare, request.concept_a, request.concept_b, context=context)
        return ComparisonResponse(**payload)
    except HTTPException:
        raise
    except Exception as exc:
        logger.exception("Failed to compare concepts")
        raise HTTPException(status_code=500, detail="Unable to compare concepts at this time.") from exc


@router.post("/diagram", response_model=DiagramResponse)
async def generate_diagram(request: DiagramRequest) -> DiagramResponse:
    try:
        # Validate Topic
        valid, reason, chunks = await run_in_threadpool(validate_os_topic, request.topic)
        if not valid:
            raise HTTPException(status_code=400, detail=f"Topic '{request.topic}' validation failed: {reason}")

        service = get_diagram_service()

        # Build context block from RAG chunks to ground the diagram generator
        context = ""
        if chunks:
            context = "\n\n".join([c.get("text", "") for c in chunks])

        mermaid = await run_in_threadpool(service.generate, request.diagram_type, request.topic, context=context)
        return DiagramResponse(diagram_type=request.diagram_type, mermaid=mermaid)
    except HTTPException:
        raise
    except Exception as exc:
        logger.exception("Failed to generate diagram")
        raise HTTPException(status_code=500, detail="Unable to generate diagram at this time.") from exc
