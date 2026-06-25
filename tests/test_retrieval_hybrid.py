from __future__ import annotations

import rag_pipeline.retriever as retriever_module


class FakeEmbedder:
    def embed_query(self, text: str) -> list[float]:
        return [1.0, 0.0]


class FakeChroma:
    def query(self, query_embedding: list[float], top_k: int = 5):
        return [
            {"text": "Paging is memory management.", "source": "silberschatz.pdf",
                "page": 20, "chunk_id": "a", "distance": 0.1, "dense_score": 0.9},
            {"text": "A process is a running program.", "source": "silberschatz.pdf",
                "page": 10, "chunk_id": "b", "distance": 0.2, "dense_score": 0.8},
        ]


class FakeBM25:
    def search(self, query: str, top_k: int = 5):
        return [
            {"text": "Paging is memory management.", "source": "silberschatz.pdf",
                "page": 20, "chunk_id": "a", "bm25_score": 2.0},
            {"text": "Deadlock is a problem.", "source": "silberschatz.pdf",
                "page": 30, "chunk_id": "c", "bm25_score": 1.5},
        ]


class FakeReranker:
    def score(self, query: str, candidates):
        return sorted(candidates, key=lambda item: item["hybrid_score"], reverse=True)


def test_retriever_returns_top_k(monkeypatch) -> None:
    monkeypatch.setattr(retriever_module, "get_embedding_service",
                        lambda model_name=None: FakeEmbedder())
    monkeypatch.setattr(retriever_module, "get_chroma_manager",
                        lambda persist_directory, collection_name: FakeChroma())
    monkeypatch.setattr(retriever_module, "load_bm25_index",
                        lambda path=None: FakeBM25())
    monkeypatch.setattr(retriever_module, "get_reranker_service",
                        lambda model_name=None: FakeReranker())

    service = retriever_module.RetrieverService()
    results = service.retrieve("What is paging?", top_k=1)

    assert len(results) == 1
    assert results[0]["chunk_id"] == "a"
