from __future__ import annotations

from pathlib import Path

from rag_pipeline.ingest import extract_pdf_pages


def test_extract_pdf_pages_reads_the_textbook() -> None:
    pdf_path = Path("data/raw/silberschatz.pdf")

    pages = extract_pdf_pages(pdf_path)

    assert len(pages) > 1000
    assert pages[0].source == pdf_path.name
    assert pages[0].page == 1
    assert any(page.text.strip() for page in pages[:25])
