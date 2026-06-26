"""Cached application service factories for OSMentor AI."""

from __future__ import annotations

from functools import lru_cache

from backend.app.services.rag_service import RAGService


@lru_cache(maxsize=1)
def get_rag_service() -> RAGService:
    return RAGService()
