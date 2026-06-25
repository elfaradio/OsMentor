"""Text chunking pipeline for OSMentor AI."""

from __future__ import annotations

import json
import logging
import re
from pathlib import Path
from typing import Any
from uuid import uuid4

from pydantic import BaseModel, Field

from rag_pipeline.metadata import normalize_text

logger = logging.getLogger(__name__)
NON_CONTENT_PATTERNS = (
    "preface",
    "index",
    "glossary",
    "table of contents",
    "contents",
    "further reading",
)


class ChunkRecord(BaseModel):
    """Structured representation of a chunk generated from a PDF page."""

    chunk_id: str = Field(..., min_length=1)
    source: str = Field(..., min_length=1)
    page: int = Field(..., ge=1)
    content: str = Field(default="")
    token_count: int = Field(default=0, ge=0)
    section_type: str | None = None


def _project_root() -> Path:
    return Path(__file__).resolve().parents[1]


def _extracted_dir() -> Path:
    return _project_root() / "data" / "extracted"


def _chunks_dir() -> Path:
    return _project_root() / "data" / "chunks"


def _load_extracted_pages(extracted_dir: Path | None = None) -> list[dict[str, Any]]:
    directory = extracted_dir or _extracted_dir()
    pages: list[dict[str, Any]] = []

    for json_file in sorted(directory.glob("*.json")):
        content = json.loads(json_file.read_text(encoding="utf-8"))
        if isinstance(content, list):
            pages.extend(item for item in content if isinstance(item, dict))

    return pages


def _normalize_whitespace(text: str) -> str:
    return re.sub(r"\s+", " ", normalize_text(text)).strip()


def _detect_section_type(text: str) -> str | None:
    lowered = text.strip().lower()
    if lowered.startswith("chapter "):
        return "chapter"
    if lowered.startswith("section "):
        return "section"
    if lowered.endswith(":") and len(lowered.split()) <= 8:
        return "heading"
    return None


def _is_non_content_page(text: str) -> bool:
    lowered = text.lower()
    header = " ".join(lowered.split()[:25])
    if any(pattern in header for pattern in NON_CONTENT_PATTERNS):
        return True
    if lowered.count("...") >= 4 and ("chapter" in lowered or "contents" in lowered):
        return True
    return False


def _semantic_chunks(text: str, chunk_size: int, chunk_overlap: int) -> list[str]:
    paragraphs = [part.strip() for part in re.split(r"\n{2,}", text) if part.strip()]
    if not paragraphs:
        paragraphs = [text]

    chunks: list[str] = []
    current: list[str] = []
    current_words = 0

    for paragraph in paragraphs:
        paragraph_words = len(paragraph.split())
        if current and current_words + paragraph_words > chunk_size:
            chunk_text = " ".join(current).strip()
            if chunk_text:
                chunks.append(chunk_text)

            overlap_words = chunk_text.split()[-chunk_overlap:] if chunk_overlap > 0 else []
            current = [" ".join(overlap_words)] if overlap_words else []
            current_words = len(overlap_words)

        current.append(paragraph)
        current_words += paragraph_words

    if current:
        chunk_text = " ".join(current).strip()
        if chunk_text:
            chunks.append(chunk_text)

    return chunks


def chunk_pages(pages: list[dict[str, Any]], chunk_size: int = 850, chunk_overlap: int = 120, allow_non_content: bool = False) -> list[ChunkRecord]:
    """Split extracted pages into semantic-like overlapping chunks and deduplicate."""

    chunks: list[ChunkRecord] = []
    seen_content_hashes: set[str] = set()

    for page in pages:
        raw_text = str(page.get("text", ""))
        if not allow_non_content and _is_non_content_page(raw_text):
            continue
        text = _normalize_whitespace(raw_text)
        if not text:
            continue

        source = str(page.get("source", "unknown.pdf"))
        page_number = int(page.get("page", 1))
        for piece in _semantic_chunks(text, chunk_size=chunk_size, chunk_overlap=chunk_overlap):
            cleaned_piece = _normalize_whitespace(piece)
            if len(cleaned_piece) < 25:
                continue
            content_hash = normalize_text(cleaned_piece).lower()
            if content_hash in seen_content_hashes:
                continue
            seen_content_hashes.add(content_hash)
            chunks.append(
                ChunkRecord(
                    chunk_id=str(uuid4()),
                    source=source,
                    page=page_number,
                    content=cleaned_piece,
                    token_count=len(cleaned_piece.split()),
                    section_type=_detect_section_type(cleaned_piece),
                )
            )

    return chunks


def chunk_extracted_data(
    extracted_dir: Path | None = None,
    output_dir: Path | None = None,
    chunk_size: int = 850,
    chunk_overlap: int = 120,
) -> list[dict[str, Any]]:
    """Load extracted page JSON, chunk it, and persist chunk artifacts."""

    pages = _load_extracted_pages(extracted_dir)
    chunks = chunk_pages(pages, chunk_size=chunk_size, chunk_overlap=chunk_overlap)

    chunks_dir = output_dir or _chunks_dir()
    chunks_dir.mkdir(parents=True, exist_ok=True)

    grouped: dict[str, list[dict[str, Any]]] = {}
    for chunk in chunks:
        grouped.setdefault(Path(chunk.source).stem, []
                           ).append(chunk.model_dump())

    for stem, payload in grouped.items():
        output_path = chunks_dir / f"{stem}_chunks.json"
        output_path.write_text(json.dumps(
            payload, indent=2, ensure_ascii=False), encoding="utf-8")
        logger.info("Saved chunks to %s", output_path)

    return [chunk.model_dump() for chunk in chunks]


def main() -> None:
    """CLI entry point for chunking."""

    logging.basicConfig(
        level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")
    chunk_extracted_data()


if __name__ == "__main__":
    main()
