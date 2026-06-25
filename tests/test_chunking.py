from __future__ import annotations

from rag_pipeline.chunking import chunk_pages


def test_chunk_pages_adds_metadata_and_normalizes_whitespace() -> None:
    pages = [
        {"source": "silberschatz.pdf", "page": 12,
            "text": "Chapter 1:\n\nProcess   management is important."}
    ]

    chunks = chunk_pages(pages, chunk_size=20, chunk_overlap=5)

    assert chunks
    assert chunks[0].source == "silberschatz.pdf"
    assert chunks[0].page == 12
    assert chunks[0].token_count > 0
    assert "  " not in chunks[0].content
