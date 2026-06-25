from __future__ import annotations

from rag_pipeline.evaluation import build_evaluation_index, evaluate_rag_cases


def test_rag_pipeline_returns_grounded_answers_and_citations() -> None:
    index, _documents = build_evaluation_index()

    evaluation = evaluate_rag_cases(index)

    assert evaluation["summary"]["answer_relevance"] >= 0.25
    assert evaluation["summary"]["citation_accuracy"] >= 0.2
    assert evaluation["cases"][0]["answer"]
    assert evaluation["cases"][0]["citations"]
