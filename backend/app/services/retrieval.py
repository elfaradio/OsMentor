"""Retrieval service façade for OSMentor AI."""

from __future__ import annotations

from functools import lru_cache
from typing import Any

from app.config.settings import Settings, get_settings
from rag_pipeline.retriever import HybridRetriever


class RetrievalService:
    """Application-layer retrieval service using hybrid search."""

    def __init__(self, settings: Settings | None = None) -> None:
        self.settings = settings or get_settings()
        self._retriever = HybridRetriever(settings=self.settings)

    def retrieve(self, query: str, top_k: int = 5) -> list[dict[str, Any]]:
        return self._retriever.retrieve(query=query, top_k=top_k)


@lru_cache(maxsize=1)
def get_retrieval_service() -> RetrievalService:
    return RetrievalService()
