"""Cached embedding helpers for OSMentor AI."""

from __future__ import annotations

from functools import lru_cache

from backend.app.config.settings import get_settings
from rag_pipeline.embeddings import EmbeddingService


@lru_cache(maxsize=1)
def get_embedding_service() -> EmbeddingService:
    settings = get_settings()
    return EmbeddingService(model_name=settings.embedding_model_name)
