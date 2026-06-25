"""Response models for the OSMentor AI API."""

from __future__ import annotations

from pydantic import BaseModel, Field


class Citation(BaseModel):
    source: str
    page: int
    chunk_id: str | None = None
    excerpt: str | None = None


class ChatResponse(BaseModel):
    answer: str
    citations: list[Citation] = Field(default_factory=list)


class VivaQuestionSetResponse(BaseModel):
    topic: str
    difficulty: str
    questions: list[str] = Field(default_factory=list)


class VivaEvaluationResponse(BaseModel):
    score: float = Field(..., ge=0, le=100)
    feedback: str
    strengths: list[str] = Field(default_factory=list)
    improvements: list[str] = Field(default_factory=list)


class QuizItem(BaseModel):
    question: str
    type: str
    options: list[str] = Field(default_factory=list)
    answer: str


class QuizGenerateResponse(BaseModel):
    topic: str
    difficulty: str
    mcq: list[QuizItem] = Field(default_factory=list)
    short_questions: list[QuizItem] = Field(default_factory=list)


class QuizSubmitResponse(BaseModel):
    score: float = Field(..., ge=0, le=100)
    correct: int = Field(..., ge=0)
    total: int = Field(..., ge=0)
    feedback: str


class ComparisonRow(BaseModel):
    aspect: str
    concept_a: str
    concept_b: str


class ComparisonResponse(BaseModel):
    title: str
    concept_a: str
    concept_b: str
    rows: list[ComparisonRow] = Field(default_factory=list)


class DiagramResponse(BaseModel):
    diagram_type: str
    mermaid: str
