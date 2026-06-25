"""Request models for the OSMentor AI API."""

from __future__ import annotations

from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    question: str = Field(..., min_length=1, max_length=4000)


class VivaQuestionRequest(BaseModel):
    topic: str = Field(..., min_length=1, max_length=200)
    difficulty: str = Field(default="medium", pattern="^(easy|medium|hard)$")
    count: int = Field(default=3, ge=1, le=10)


class VivaEvaluationRequest(BaseModel):
    question: str = Field(..., min_length=1, max_length=1000)
    student_answer: str = Field(..., min_length=1, max_length=4000)
    topic: str = Field(..., min_length=1, max_length=200)


class QuizGenerateRequest(BaseModel):
    topic: str = Field(..., min_length=1, max_length=200)
    difficulty: str = Field(default="medium", pattern="^(easy|medium|hard)$")
    mcq_count: int = Field(default=5, ge=1, le=20)
    short_count: int = Field(default=3, ge=0, le=20)


class QuizSubmitRequest(BaseModel):
    answers: list[str] = Field(default_factory=list)
    answer_key: list[str] = Field(default_factory=list)


class ComparisonRequest(BaseModel):
    concept_a: str = Field(..., min_length=1, max_length=200)
    concept_b: str = Field(..., min_length=1, max_length=200)


class DiagramRequest(BaseModel):
    diagram_type: str = Field(
        ..., pattern="^(process_state|scheduling_flow|deadlock_graph|paging_segmentation)$"
    )
    topic: str = Field(default="Operating Systems", min_length=1, max_length=200)
