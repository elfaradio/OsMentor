"""Sparse BM25 indexing and retrieval utilities for OSMentor AI."""

from __future__ import annotations

import json
import logging
import math
import re
from collections import Counter
from functools import lru_cache
from pathlib import Path
from typing import Any

logger = logging.getLogger(__name__)

TOKEN_PATTERN = re.compile(r"[a-z0-9]+")

STOP_WORDS = {
    "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "aren", "t", "as", "at",
    "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", "can", "cannot", "could", "couldn",
    "did", "didn", "do", "does", "doesn", "doing", "don", "down", "during", "each", "few", "for", "from", "further",
    "had", "hadn", "has", "hasn", "have", "haven", "having", "he", "hed", "hell", "hes", "her", "here", "heres",
    "hers", "herself", "him", "himself", "his", "how", "hows", "i", "id", "ill", "im", "ive", "if", "in", "into",
    "is", "isn", "it", "its", "itself", "lets", "me", "more", "most", "mustn", "my", "myself", "no", "nor", "not",
    "of", "off", "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves", "out", "over", "own",
    "same", "shan", "she", "shed", "shell", "shes", "should", "shouldn", "so", "some", "such", "than", "that",
    "thats", "the", "their", "theirs", "them", "themselves", "then", "there", "theres", "these", "they", "theyd",
    "theyll", "theyre", "theyve", "this", "those", "through", "to", "too", "under", "until", "up", "very", "was",
    "wasn", "we", "wed", "well", "were", "weve", "weren", "what", "whats", "when", "whens", "where", "wheres",
    "which", "while", "who", "whos", "whom", "why", "whys", "with", "would", "wouldn", "you", "youd", "youll",
    "youre", "youve", "your", "yours", "yourself", "yourselves"
}


def tokenize(text: str) -> list[str]:
    tokens = TOKEN_PATTERN.findall(text.lower())
    return [t for t in tokens if t not in STOP_WORDS]


def _project_root() -> Path:
    return Path(__file__).resolve().parents[1]


def _index_path() -> Path:
    directory = _project_root() / "vector_db" / "bm25"
    directory.mkdir(parents=True, exist_ok=True)
    return directory / "bm25_index.json"


class BM25Index:
    """Minimal BM25 index persisted as JSON for local retrieval quality."""

    def __init__(self, documents: list[dict[str, Any]]) -> None:
        self.documents = documents
        self.tokenized_documents = [
            tokenize(doc.get("content", "")) for doc in documents]
        self.document_frequencies: Counter[str] = Counter()
        for tokens in self.tokenized_documents:
            self.document_frequencies.update(set(tokens))
        self.document_count = len(self.tokenized_documents)
        self.average_document_length = (
            sum(len(tokens)
                for tokens in self.tokenized_documents) / self.document_count
            if self.document_count
            else 0.0
        )
        self.k1 = 1.5
        self.b = 0.75

    def to_dict(self) -> dict[str, Any]:
        return {"documents": self.documents}

    @classmethod
    def from_dict(cls, payload: dict[str, Any]) -> "BM25Index":
        return cls(documents=list(payload.get("documents", [])))

    def save(self, path: Path | None = None) -> None:
        target = path or _index_path()
        target.write_text(json.dumps(self.to_dict(), indent=2,
                          ensure_ascii=False), encoding="utf-8")

    @classmethod
    def load(cls, path: Path | None = None) -> "BM25Index | None":
        target = path or _index_path()
        if not target.exists():
            return None
        payload = json.loads(target.read_text(encoding="utf-8"))
        return cls.from_dict(payload)

    def _idf(self, term: str) -> float:
        df = self.document_frequencies.get(term, 0)
        if not df:
            return 0.0
        return math.log(1 + (self.document_count - df + 0.5) / (df + 0.5))

    def score(self, query: str, document_index: int) -> float:
        query_tokens = tokenize(query)
        if not query_tokens or document_index >= len(self.tokenized_documents):
            return 0.0

        document_tokens = self.tokenized_documents[document_index]
        if not document_tokens:
            return 0.0

        frequencies = Counter(document_tokens)
        document_length = len(document_tokens)
        score = 0.0

        for term in query_tokens:
            tf = frequencies.get(term, 0)
            if not tf:
                continue
            idf = self._idf(term)
            denominator = tf + self.k1 * \
                (1 - self.b + self.b * (document_length /
                 (self.average_document_length or 1.0)))
            score += idf * (tf * (self.k1 + 1)) / denominator

        return score

    def search(self, query: str, top_k: int = 5) -> list[dict[str, Any]]:
        scores = [self.score(query, index)
                  for index in range(len(self.documents))]
        ranked = sorted(enumerate(scores),
                        key=lambda item: item[1], reverse=True)[:top_k]

        results: list[dict[str, Any]] = []
        for index, score in ranked:
            document = dict(self.documents[index])
            document["bm25_score"] = float(score)
            results.append(document)
        return results


def build_bm25_index(documents: list[dict[str, Any]], path: Path | None = None) -> BM25Index:
    index = BM25Index(documents)
    index.save(path)
    return index


@lru_cache(maxsize=4)
def load_bm25_index(path: str | None = None) -> BM25Index | None:
    target = Path(path) if path else _index_path()
    return BM25Index.load(target)
