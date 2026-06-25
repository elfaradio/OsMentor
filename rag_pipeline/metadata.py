"""Metadata and text normalization helpers for OSMentor AI."""

from __future__ import annotations

import re


def normalize_text(text: str) -> str:
    """Normalize extracted textbook text for chunking and sparse retrieval."""

    cleaned = text.replace("\u00ad", "")
    cleaned = cleaned.replace("-\n", "")
    cleaned = re.sub(r"\s+", " ", cleaned)
    return cleaned.strip()
