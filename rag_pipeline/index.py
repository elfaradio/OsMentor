"""End-to-end indexing pipeline for OSMentor AI.

This command ingests PDFs from data/raw, writes extracted page JSON to
data/extracted, chunks the extracted pages into data/chunks, generates
embeddings, and persists the indexed chunks into ChromaDB.
"""

from __future__ import annotations

import argparse
import json
import logging
from pathlib import Path

from backend.app.config.settings import get_settings
from rag_pipeline.bm25 import build_bm25_index
from rag_pipeline.chunking import chunk_extracted_data
from rag_pipeline.embeddings import embed_chunks, load_chunks_from_file
from rag_pipeline.ingest import ingest_pdfs
from vector_db.chroma_manager import ChromaManager

logger = logging.getLogger(__name__)


def _configure_logging(level: str) -> None:
    logging.basicConfig(
        level=getattr(logging, level.upper(), logging.INFO),
        format="%(asctime)s %(levelname)s %(name)s: %(message)s",
    )


def _parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Run the OSMentor AI indexing pipeline.")
    parser.add_argument("--batch-size", type=int,
                        default=32, help="Embedding batch size.")
    parser.add_argument("--chunk-size", type=int, default=850,
                        help="Chunk size for text splitting.")
    parser.add_argument("--chunk-overlap", type=int, default=120,
                        help="Chunk overlap for text splitting.")
    parser.add_argument("--input-dir", type=Path, default=None,
                        help="Override the PDF input directory.")
    parser.add_argument("--skip-ingest", action="store_true",
                        help="Skip PDF extraction and reuse existing extracted JSON.")
    parser.add_argument("--skip-chunking", action="store_true",
                        help="Skip chunk generation and reuse existing chunk JSON.")
    parser.add_argument("--skip-embed", action="store_true",
                        help="Skip embedding generation and reuse existing chunk JSON.")
    parser.add_argument("--rebuild", action="store_true",
                        help="Rebuild indexes from scratch by clearing vector stores first.")
    return parser.parse_args()


def run_indexing_pipeline(
    *,
    input_dir: Path | None = None,
    batch_size: int = 32,
    chunk_size: int = 850,
    chunk_overlap: int = 120,
    skip_ingest: bool = False,
    skip_chunking: bool = False,
    skip_embed: bool = False,
    rebuild: bool = False,
) -> dict[str, int]:
    """Run ingestion, chunking, embeddings, and Chroma persistence."""

    settings = get_settings()
    settings.ensure_directories()

    if rebuild:
        logger.info("Clearing existing BM25 and Chroma indexes for full rebuild")
        build_bm25_index([])
        ChromaManager(
            persist_directory=settings.chroma_directory,
            collection_name=settings.chroma_collection_name,
        ).reset_collection()

    if not skip_ingest:
        logger.info("Starting PDF ingestion")
        ingest_pdfs(input_dir=input_dir,
                    output_dir=settings.extracted_directory)

    if not skip_chunking:
        logger.info("Starting chunk generation")
        chunk_extracted_data(
            extracted_dir=settings.extracted_directory,
            output_dir=settings.chunks_directory,
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
        )

    chunk_files = sorted(settings.chunks_directory.glob("*_chunks.json"))
    if not chunk_files:
        logger.warning("No chunk files found in %s", settings.chunks_directory)
        return {"documents": 0, "chunks": 0, "embedded_chunks": 0}

    chunk_records: list[dict] = []
    for chunk_file in chunk_files:
        chunk_records.extend(load_chunks_from_file(chunk_file))

    if not chunk_records:
        logger.warning(
            "Chunk files were present but no chunk records could be loaded")
        return {"documents": len(chunk_files), "chunks": 0, "embedded_chunks": 0}

    embedded_chunks = chunk_records
    if not skip_embed:
        logger.info("Starting embedding generation for %d chunks",
                    len(chunk_records))
        embedded_chunks = embed_chunks(
            chunk_records, batch_size=batch_size, model_name=settings.embedding_model_name)

    logger.info("Building BM25 sparse index for %d chunks", len(chunk_records))
    build_bm25_index(chunk_records)

    chroma_manager = ChromaManager(
        persist_directory=settings.chroma_directory,
        collection_name=settings.chroma_collection_name,
    )
    chroma_manager.upsert_chunks(embedded_chunks)

    return {
        "documents": len(chunk_files),
        "chunks": len(chunk_records),
        "embedded_chunks": len(embedded_chunks),
    }


def main() -> None:
    args = _parse_args()
    settings = get_settings()
    _configure_logging(settings.log_level)

    summary = run_indexing_pipeline(
        input_dir=args.input_dir,
        batch_size=args.batch_size,
        chunk_size=args.chunk_size,
        chunk_overlap=args.chunk_overlap,
        skip_ingest=args.skip_ingest,
        skip_chunking=args.skip_chunking,
        skip_embed=args.skip_embed,
        rebuild=args.rebuild,
    )

    logger.info("Indexing complete: %s", json.dumps(summary, indent=2))


if __name__ == "__main__":
    main()
