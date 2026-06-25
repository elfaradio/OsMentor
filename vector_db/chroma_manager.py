"""Persistent ChromaDB manager for OSMentor AI."""

from __future__ import annotations

import logging
from functools import lru_cache
from pathlib import Path
from typing import Any, Sequence

import chromadb

logger = logging.getLogger(__name__)


class ChromaManager:
    """Create and query a persistent Chroma collection."""

    def __init__(self, persist_directory: Path, collection_name: str = "osmentor_chunks") -> None:
        self.persist_directory = persist_directory
        self.collection_name = collection_name
        self.persist_directory.mkdir(parents=True, exist_ok=True)
        self.client = chromadb.PersistentClient(
            path=str(self.persist_directory))
        self.collection = self.client.get_or_create_collection(
            name=collection_name,
            metadata={"hnsw:space": "cosine"},
        )

    def upsert_chunks(self, chunks: Sequence[dict[str, Any]]) -> None:
        """Store chunk text, embeddings, and metadata in Chroma."""

        if not chunks:
            logger.info("No chunks provided for upsert")
            return

        ids = [str(chunk["chunk_id"]) for chunk in chunks]
        documents = [str(chunk["content"]) for chunk in chunks]
        embeddings = [list(chunk["embedding"]) for chunk in chunks]
        metadatas = [
            {
                "source": str(chunk["source"]),
                "page": int(chunk["page"]),
                "chunk_id": str(chunk["chunk_id"]),
                "section_type": str(chunk.get("section_type") or ""),
                "token_count": int(chunk.get("token_count") or 0),
            }
            for chunk in chunks
        ]

        self.collection.upsert(ids=ids, documents=documents,
                               embeddings=embeddings, metadatas=metadatas)
        logger.info("Upserted %d chunks into Chroma collection '%s'",
                    len(chunks), self.collection_name)

    def query(self, query_embedding: list[float], top_k: int = 5) -> list[dict[str, Any]]:
        """Query the collection using a precomputed embedding vector."""

        results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=top_k,
            include=["documents", "metadatas", "distances"],
        )

        ids = results.get("ids", [[]])[0]
        documents = results.get("documents", [[]])[0]
        metadatas = results.get("metadatas", [[]])[0]
        distances = results.get("distances", [[]])[0]

        chunks: list[dict[str, Any]] = []
        for chunk_id, document, metadata, distance in zip(ids, documents, metadatas, distances, strict=False):
            chunks.append(
                {
                    "chunk_id": chunk_id,
                    "text": document,
                    "source": metadata.get("source", "unknown.pdf") if metadata else "unknown.pdf",
                    "page": metadata.get("page", 0) if metadata else 0,
                    "section_type": metadata.get("section_type") if metadata else None,
                    "token_count": metadata.get("token_count") if metadata else None,
                    "dense_score": 1.0 / (1.0 + float(distance)),
                    "distance": float(distance),
                }
            )
        return chunks

    def reset_collection(self) -> None:
        """Delete and recreate the configured collection."""
        try:
            self.client.delete_collection(self.collection_name)
        except Exception:
            logger.info("Collection '%s' did not exist yet", self.collection_name)
        self.collection = self.client.get_or_create_collection(
            name=self.collection_name,
            metadata={"hnsw:space": "cosine"},
        )
        logger.info("Reset Chroma collection '%s'", self.collection_name)


@lru_cache(maxsize=4)
def get_chroma_manager(persist_directory: str, collection_name: str) -> ChromaManager:
    return ChromaManager(persist_directory=Path(persist_directory), collection_name=collection_name)
