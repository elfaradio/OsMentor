"""Hybrid retrieval pipeline for OSMentor AI."""

from __future__ import annotations

import hashlib
import logging
import re
from threading import Lock
from typing import Any

from backend.app.config.settings import Settings, get_settings
from rag_pipeline.bm25 import load_bm25_index
from rag_pipeline.embeddings import get_embedding_service
from rag_pipeline.reranker import get_reranker_service
from vector_db.chroma_manager import get_chroma_manager

logger = logging.getLogger(__name__)

_QUERY_CACHE: dict[str, list[dict[str, Any]]] = {}
_QUERY_CACHE_LOCK = Lock()
NON_CONTENT_MARKERS = ("preface", "index", "glossary", "table of contents", "further reading")


def _cache_key(query: str, top_k: int) -> str:
    normalized = " ".join(query.lower().split())
    return hashlib.sha256(f"{normalized}|{top_k}".encode("utf-8")).hexdigest()


class RetrieverService:
    """Hybrid retrieval over persistent ChromaDB and BM25 indexes."""

    def __init__(self, settings: Settings | None = None) -> None:
        self.settings = settings or get_settings()
        self.embedding_service = get_embedding_service(
            model_name=self.settings.embedding_model_name)
        self.chroma_manager = get_chroma_manager(
            persist_directory=str(self.settings.chroma_directory),
            collection_name=self.settings.chroma_collection_name,
        )
        self.bm25_index = load_bm25_index()
        self.reranker = get_reranker_service(
            model_name=self.settings.reranker_model_name)

    @staticmethod
    def _content_fingerprint(candidate: dict[str, Any]) -> str:
        text = str(candidate.get("text", "")).strip().lower()
        text = re.sub(r"\s+", " ", text)
        source = str(candidate.get("source", "unknown.pdf")).lower()
        page = int(candidate.get("page", 0))
        return hashlib.sha1(f"{source}|{page}|{text}".encode("utf-8")).hexdigest()

    @staticmethod
    def _is_non_content(candidate: dict[str, Any]) -> bool:
        text = str(candidate.get("text", "")).strip().lower()
        if not text:
            return True
        header = " ".join(text.split()[:20])
        return any(marker in header for marker in NON_CONTENT_MARKERS)

    def retrieve(self, query: str, top_k: int = 8) -> list[dict[str, Any]]:
        """Return hybrid-retrieved chunks for a user question."""

        key = _cache_key(query, top_k)
        with _QUERY_CACHE_LOCK:
            cached = _QUERY_CACHE.get(key)
        if cached is not None:
            return cached

        # Widen the candidate pool for better recall
        dense_candidate_count = max(top_k * 4, 20)
        sparse_candidate_count = max(top_k * 4, 20)

        query_embedding = self.embedding_service.embed_query(query)
        dense_results = self.chroma_manager.query(
            query_embedding=query_embedding, top_k=dense_candidate_count)
        sparse_results = self.bm25_index.search(
            query, top_k=sparse_candidate_count) if self.bm25_index else []

        merged: dict[str, dict[str, Any]] = {}
        seen_fingerprints: set[str] = set()

        def add_candidate(candidate: dict[str, Any]) -> None:
            if self._is_non_content(candidate):
                return
            fingerprint = self._content_fingerprint(candidate)
            if fingerprint in seen_fingerprints:
                return
            seen_fingerprints.add(fingerprint)
            chunk_id = str(candidate.get("chunk_id") or hashlib.sha1(
                f"{candidate.get('source')}|{candidate.get('page')}|{candidate.get('text')}".encode(
                    "utf-8")
            ).hexdigest())
            existing = merged.get(chunk_id, {})
            combined = dict(existing)
            for field, value in candidate.items():
                if field in {"dense_score", "bm25_score", "sparse_score", "hybrid_score"}:
                    existing_value = combined.get(field)
                    if existing_value not in (None, 0, 0.0) and value in (None, 0, 0.0):
                        continue
                combined[field] = value
            combined["chunk_id"] = chunk_id
            merged[chunk_id] = combined

        for candidate in dense_results:
            candidate = dict(candidate)
            candidate.setdefault("bm25_score", 0.0)
            candidate.setdefault("sparse_score", 0.0)
            add_candidate(candidate)

        for candidate in sparse_results:
            candidate = dict(candidate)
            candidate.setdefault("dense_score", 0.0)
            add_candidate(candidate)

        candidates = list(merged.values())
        for candidate in candidates:
            dense_score = float(candidate.get("dense_score", 0.0))
            sparse_score = float(candidate.get(
                "bm25_score", candidate.get("sparse_score", 0.0)))
            candidate["dense_score"] = dense_score
            candidate["sparse_score"] = sparse_score
            # Improved hybrid scoring with better BM25 normalization
            candidate["hybrid_score"] = (
                self.settings.hybrid_dense_weight * dense_score
                + self.settings.hybrid_sparse_weight *
                min(sparse_score, 8.0) / 8.0
            )

        candidates.sort(key=lambda item: item.get(
            "hybrid_score", 0.0), reverse=True)
        # Rerank a wider pool for better precision
        rerank_pool = max(top_k * 3, 15)
        reranked = self.reranker.score(query, candidates[:rerank_pool])
        final_results = reranked[:top_k]

        with _QUERY_CACHE_LOCK:
            _QUERY_CACHE[key] = final_results

        logger.info("Retrieved %d hybrid-reranked chunks for query",
                    len(final_results))
        return final_results


class HybridRetriever(RetrieverService):
    """Backwards-compatible alias for the hybrid retrieval service."""


def retrieve_chunks(query: str, top_k: int = 8) -> list[dict[str, Any]]:
    return RetrieverService().retrieve(query=query, top_k=top_k)
