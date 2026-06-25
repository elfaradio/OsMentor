"""Application settings for OSMentor AI."""

from __future__ import annotations

from functools import lru_cache
from pathlib import Path

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


PROJECT_ROOT = Path(__file__).resolve().parents[3]


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=str(
        PROJECT_ROOT / ".env"), env_file_encoding="utf-8", extra="ignore")

    app_name: str = "OSMentor AI"
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    log_level: str = "INFO"

    raw_pdf_directory: Path = Field(
        default_factory=lambda: PROJECT_ROOT / "data" / "raw")
    extracted_directory: Path = Field(
        default_factory=lambda: PROJECT_ROOT / "data" / "extracted")
    chunks_directory: Path = Field(
        default_factory=lambda: PROJECT_ROOT / "data" / "chunks")
    chroma_directory: Path = Field(
        default_factory=lambda: PROJECT_ROOT / "vector_db" / "chroma")
    chroma_collection_name: str = "osmentor_chunks"

    embedding_model_name: str = "BAAI/bge-small-en-v1.5"
    ollama_model_name: str = "llama3.2"
    ollama_base_url: str = "http://localhost:11434"
    reranker_model_name: str = "cross-encoder/ms-marco-MiniLM-L-6-v2"
    hybrid_dense_weight: float = 0.7
    hybrid_sparse_weight: float = 0.3
    retrieval_cache_ttl_seconds: int = 300
    retrieval_cache_maxsize: int = 256

    cors_origins: str = "http://localhost:5173"

    def parsed_cors_origins(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]

    def ensure_directories(self) -> None:
        for directory in (
                self.raw_pdf_directory,
                self.extracted_directory,
                self.chunks_directory,
                self.chroma_directory,
        ):
            directory.mkdir(parents=True, exist_ok=True)


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()
