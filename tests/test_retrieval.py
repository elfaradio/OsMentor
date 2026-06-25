from __future__ import annotations

from rag_pipeline.evaluation import build_evaluation_index, evaluate_retrieval_cases


def test_retrieval_finds_relevant_textbook_pages() -> None:
    index, _documents = build_evaluation_index()

    evaluation = evaluate_retrieval_cases(index)

    assert evaluation["summary"]["retrieval_accuracy"] >= 0.7
    assert evaluation["summary"]["context_precision"] >= 0.5
    assert any(case["retrieval_hit"] for case in evaluation["cases"])
    assert any(not case["retrieval_hit"] for case in evaluation["cases"])
