from __future__ import annotations

from rag_pipeline.bm25 import BM25Index


def test_bm25_ranks_exact_term_matches_higher() -> None:
    documents = [
        {"chunk_id": "1", "source": "a.pdf", "page": 1,
            "content": "Paging uses pages and frames."},
        {"chunk_id": "2", "source": "b.pdf", "page": 2,
            "content": "A process is a running program."},
    ]

    index = BM25Index(documents)
    results = index.search("What is paging?", top_k=2)

    assert results[0]["chunk_id"] == "1"
    assert results[0]["bm25_score"] >= results[1]["bm25_score"]
