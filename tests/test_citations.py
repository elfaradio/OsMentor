from __future__ import annotations

from backend.app.services.citation import CitationBuilder
from rag_pipeline.evaluation import build_evaluation_index, evaluate_retrieval_cases


def test_citations_track_the_retrieved_pages() -> None:
    index, _documents = build_evaluation_index()
    retrieval_eval = evaluate_retrieval_cases(index)

    first_case = retrieval_eval["cases"][0]
    citation_builder = CitationBuilder()
    citations = citation_builder.build(
        first_case["retrieved_chunks"], max_citations=5)

    assert citations
    assert citations[0].source == "silberschatz.pdf"
    assert all(citation.page >= 1 for citation in citations)
    assert citations[0].chunk_id
    assert citations[0].excerpt
