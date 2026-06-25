"""Reranker pipeline for OSMentor AI."""

from __future__ import annotations

import logging
from functools import lru_cache
from typing import Any

from sentence_transformers import CrossEncoder

logger = logging.getLogger(__name__)


class RerankerService:
    """Cross-encoder reranker for candidate chunks."""

    def __init__(self, model_name: str = "cross-encoder/ms-marco-MiniLM-L-6-v2") -> None:
        self.model_name = model_name
        try:
            self._reranker = CrossEncoder(model_name)
        except Exception as exc:  # pragma: no cover - offline fallback
            logger.warning(
                "CrossEncoder model '%s' unavailable: %s", model_name, exc)
            self._reranker = None

    def score(self, query: str, candidates: list[dict[str, Any]]) -> list[dict[str, Any]]:
        if not candidates:
            return []

        if self._reranker is None:
            return self._lexical_score(query, candidates)

        pairs = [(query, candidate.get("text", ""))
                 for candidate in candidates]
        scores = self._reranker.predict(pairs).tolist()

        reranked: list[dict[str, Any]] = []
        for candidate, score in zip(candidates, scores, strict=True):
            updated = dict(candidate)
            updated["rerank_score"] = float(score)
            reranked.append(updated)

        reranked.sort(key=lambda item: item.get(
            "rerank_score", 0.0), reverse=True)
        return reranked

    @staticmethod
    def _lexical_score(query: str, candidates: list[dict[str, Any]]) -> list[dict[str, Any]]:
        from rag_pipeline.bm25 import tokenize
        query_terms = set(tokenize(query))
        scored: list[dict[str, Any]] = []
        for candidate in candidates:
            text = str(candidate.get("text") or candidate.get("content") or "")
            candidate_terms = set(tokenize(text))
            overlap = len(query_terms & candidate_terms)
            
            # Combine overlap with BM25/hybrid score to break ties and leverage TF-IDF
            bm25 = float(candidate.get("bm25_score", candidate.get("hybrid_score", candidate.get("sparse_score", 0.0))))
            rerank_score = float(overlap) + 0.01 * bm25
            
            updated = dict(candidate)
            updated["rerank_score"] = rerank_score
            scored.append(updated)
        scored.sort(key=lambda item: item.get("rerank_score", 0.0), reverse=True)
        return scored


@lru_cache(maxsize=4)
def get_reranker_service(model_name: str = "cross-encoder/ms-marco-MiniLM-L-6-v2") -> RerankerService:
    return RerankerService(model_name)
