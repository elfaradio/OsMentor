"""Embedding pipeline for OSMentor AI."""

from __future__ import annotations

import logging
from functools import lru_cache
from pathlib import Path
from typing import Sequence

from langchain_huggingface import HuggingFaceEmbeddings
from pydantic import BaseModel, Field

logger = logging.getLogger(__name__)


class EmbeddedChunk(BaseModel):
    """Chunk payload paired with its embedding vector."""

    chunk_id: str = Field(..., min_length=1)
    source: str = Field(..., min_length=1)
    page: int = Field(..., ge=1)
    content: str = Field(default="")
    embedding: list[float] = Field(default_factory=list)


class EmbeddingService:
    """Sentence-transformer-backed embedding service with batch support."""

    def __init__(self, model_name: str = "BAAI/bge-small-en-v1.5") -> None:
        self.model_name = model_name
        self._embedder = HuggingFaceEmbeddings(
            model_name=model_name,
            model_kwargs={"device": "cpu"},
            encode_kwargs={"normalize_embeddings": True},
        )

    def embed_documents(self, texts: Sequence[str], batch_size: int = 32) -> list[list[float]]:
        embeddings: list[list[float]] = []
        for start in range(0, len(texts), batch_size):
            batch = list(texts[start: start + batch_size])
            if not batch:
                continue
            embeddings.extend(self._embedder.embed_documents(batch))
        return embeddings

    def embed_query(self, text: str) -> list[float]:
        return self._embedder.embed_query(text)


@lru_cache(maxsize=8)
def get_embedding_service(model_name: str = "BAAI/bge-small-en-v1.5") -> EmbeddingService:
    return EmbeddingService(model_name=model_name)


def embed_chunks(chunks: Sequence[dict], batch_size: int = 32, model_name: str = "BAAI/bge-small-en-v1.5") -> list[dict]:
    """Generate embeddings for chunk dictionaries in batches."""

    service = get_embedding_service(model_name=model_name)
    chunk_texts = [str(chunk.get("content", "")) for chunk in chunks]
    chunk_embeddings = service.embed_documents(
        chunk_texts, batch_size=batch_size)

    embedded_chunks: list[dict] = []
    for chunk, embedding in zip(chunks, chunk_embeddings, strict=True):
        embedded_chunks.append(
            EmbeddedChunk(
                chunk_id=str(chunk.get("chunk_id", "")),
                source=str(chunk.get("source", "unknown.pdf")),
                page=int(chunk.get("page", 1)),
                content=str(chunk.get("content", "")),
                embedding=list(embedding),
            ).model_dump()
        )

    return embedded_chunks


def load_chunks_from_file(chunk_file: Path) -> list[dict]:
    import json

    return json.loads(chunk_file.read_text(encoding="utf-8"))


def main() -> None:
    """CLI entry point for embedding generation."""

    logging.basicConfig(
        level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")
    logger.info(
        "Embedding pipeline is library-driven. Import embed_chunks() to process chunk JSON files.")


if __name__ == "__main__":
    main()
