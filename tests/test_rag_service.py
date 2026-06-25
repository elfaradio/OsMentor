from __future__ import annotations

from backend.app.models.response_models import Citation
from backend.app.services import rag_service as rag_module


class FakeRetriever:
    def retrieve(self, query: str, top_k: int = 5):
        return [
            {"text": "Paging divides memory into fixed-size pages.", "source": "silberschatz.pdf",
                "page": 320, "chunk_id": "chunk-1", "rerank_score": 0.9, "hybrid_score": 0.8},
            {"text": "Frames store pages in physical memory.", "source": "silberschatz.pdf",
                "page": 321, "chunk_id": "chunk-2", "rerank_score": 0.8, "hybrid_score": 0.7},
        ]


class FakeLLM:
    def generate(self, system_prompt: str, user_prompt: str) -> str:
        return "Paging divides logical memory into fixed-size pages."


def test_rag_service_builds_citations_and_answer(monkeypatch) -> None:
    monkeypatch.setattr(rag_module, "get_retrieval_service",
                        lambda: FakeRetriever())
    monkeypatch.setattr(rag_module, "GeminiAnswerGenerator",
                        lambda settings=None: FakeLLM())

    service = rag_module.RAGService()

    response = service.answer_question("What is paging?", top_k=2)

    assert response.answer.startswith("Paging divides")
    assert response.citations
    assert isinstance(response.citations[0], Citation)
    assert response.citations[0].source == "silberschatz.pdf"
