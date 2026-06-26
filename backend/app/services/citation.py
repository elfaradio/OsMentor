"""Citation helpers for OSMentor AI."""

from __future__ import annotations

from collections import OrderedDict
from typing import Any

from backend.app.models.response_models import Citation


class CitationBuilder:
    """Build deduplicated citations from ranked retrieval results."""

    def build(self, chunks: list[dict[str, Any]], max_citations: int = 5) -> list[Citation]:
        unique: "OrderedDict[tuple[str, int], Citation]" = OrderedDict()

        for chunk in chunks:
            source = str(chunk.get("source", "unknown.pdf"))
            page = int(chunk.get("page", 0))
            if page < 1:
                continue

            key = (source, page)
            excerpt = str(chunk.get("text") or chunk.get("content") or "").strip()
            unique.setdefault(
                key,
                Citation(
                    source=source,
                    page=page,
                    chunk_id=str(chunk.get("chunk_id")) if chunk.get(
                        "chunk_id") else None,
                    excerpt=excerpt[:240] or None,
                ),
            )

            if len(unique) >= max_citations:
                break

        return list(unique.values())
