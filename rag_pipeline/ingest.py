"""PDF ingestion pipeline for OSMentor AI.

Reads PDF textbooks, extracts text page-by-page with PyMuPDF, and persists
structured JSON artifacts under data/extracted/.
"""

from __future__ import annotations

import json
import logging
from pathlib import Path
from typing import Any

import fitz
from pydantic import BaseModel, Field

logger = logging.getLogger(__name__)


class ExtractedPage(BaseModel):
    """Structured representation of one extracted PDF page."""

    source: str = Field(..., min_length=1)
    page: int = Field(..., ge=1)
    text: str = Field(default="")


def _project_root() -> Path:
    return Path(__file__).resolve().parents[1]


def _candidate_input_dirs() -> list[Path]:
    root = _project_root()
    candidates = [root / "data" / "raw", root / "data" / "textbooks"]
    return [candidate for candidate in candidates if candidate.exists()]


def _output_dir() -> Path:
    return _project_root() / "data" / "extracted"


def extract_pdf_pages(pdf_path: Path) -> list[ExtractedPage]:
    """Extract text from a single PDF file page-by-page."""

    logger.info("Extracting PDF: %s", pdf_path)
    pages: list[ExtractedPage] = []

    with fitz.open(pdf_path) as document:
        for index, page in enumerate(document, start=1):
            text = page.get_text("text").strip()
            pages.append(
                ExtractedPage(
                    source=pdf_path.name,
                    page=index,
                    text=text,
                )
            )

    return pages


def ingest_pdfs(input_dir: Path | None = None, output_dir: Path | None = None) -> list[dict[str, Any]]:
    """Extract every PDF from the configured input directory and persist JSON."""

    extracted_dir = output_dir or _output_dir()
    extracted_dir.mkdir(parents=True, exist_ok=True)

    input_dirs = [
        input_dir] if input_dir is not None else _candidate_input_dirs()
    if not input_dirs:
        raise FileNotFoundError(
            "No PDF input directory found. Create data/raw/ and place PDF files there.")

    all_pages: list[dict[str, Any]] = []
    pdf_files: list[Path] = []

    for directory in input_dirs:
        pdf_files.extend(sorted(directory.rglob("*.pdf")))

    if not pdf_files:
        logger.warning("No PDF files found in: %s",
                       ", ".join(str(path) for path in input_dirs))
        return []

    for pdf_file in pdf_files:
        pages = extract_pdf_pages(pdf_file)
        payload = [page.model_dump() for page in pages]
        output_path = extracted_dir / f"{pdf_file.stem}.json"
        output_path.write_text(json.dumps(
            payload, indent=2, ensure_ascii=False), encoding="utf-8")
        all_pages.extend(payload)
        logger.info("Saved extracted pages to %s", output_path)

    return all_pages


def main() -> None:
    """CLI entry point for ingestion."""

    logging.basicConfig(
        level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")
    ingest_pdfs()


if __name__ == "__main__":
    main()
