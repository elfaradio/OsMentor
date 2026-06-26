"""RAG service layer for grounded OS question answering."""

from __future__ import annotations

import logging
from typing import Any

from app.config.settings import Settings, get_settings
from app.models.response_models import ChatResponse
from app.services.citation import CitationBuilder
from app.services.generation import OllamaAnswerGenerator
from app.services.prompting import build_answer_policy, build_context_block
from app.services.retrieval import RetrievalService, get_retrieval_service

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = build_answer_policy()


class RAGService:
    """Combine retrieval and Ollama generation for grounded answers."""

    def __init__(self, settings: Settings | None = None) -> None:
        self.settings = settings or get_settings()
        self.retriever: RetrievalService = get_retrieval_service()
        self.answer_generator = OllamaAnswerGenerator()
        self.citation_builder = CitationBuilder()

    @staticmethod
    def _select_evidence(chunks: list[dict[str, Any]], max_chunks: int = 8) -> list[dict[str, Any]]:
        selected = sorted(
            chunks,
            key=lambda item: (
                float(item.get("rerank_score", 0.0)),
                float(item.get("hybrid_score", 0.0)),
                float(item.get("dense_score", 0.0)),
            ),
            reverse=True,
        )[:max_chunks]
        return selected

    @staticmethod
    def _build_user_prompt(question: str, chunks: list[dict[str, Any]]) -> str:
        context = build_context_block(chunks)
        return (
            f"Retrieved Context:\n{context}\n\n"
            f"Question:\n{question}\n\n"
            "Answer the question thoroughly using the retrieved context. "
            "Synthesize information from multiple evidence chunks when relevant. "
            "Provide clear explanations with examples from the context where possible. "
            "If the context does not contain sufficient information, say so honestly. "
            "Do NOT include any citation brackets, evidence numbers, or references. Just provide a clean, plain answer."
        )

    def answer_question(self, question: str, top_k: int = 8) -> ChatResponse:
        """Return a grounded answer without citations for maximum relevance."""

        retrieved_chunks = self.retriever.retrieve(question, top_k=top_k)
        if not retrieved_chunks:
            return ChatResponse(
                answer="I couldn't find this information in the knowledge base.",
            )

        evidence_chunks = self._select_evidence(
            retrieved_chunks, max_chunks=top_k)
        prompt = self._build_user_prompt(question, evidence_chunks)

        logger.info("Generating grounded answer for question")
        answer_text = self.answer_generator.generate(SYSTEM_PROMPT, prompt)

        if not answer_text or "i couldn't find this information in the knowledge base" in answer_text.lower():
            answer_text = "I couldn't find this information in the knowledge base."

        citations = self.citation_builder.build(evidence_chunks)
        return ChatResponse(answer=answer_text, citations=citations)
