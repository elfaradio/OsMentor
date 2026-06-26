"""LLM provider factory for OSMentor AI.

Supports:
  - Groq  (fast, free-tier, recommended) — set LLM_PROVIDER=groq in .env
  - Ollama (local, slower)               — set LLM_PROVIDER=ollama in .env
"""

from __future__ import annotations

import logging

from langchain_core.language_models.chat_models import BaseChatModel

logger = logging.getLogger(__name__)


def get_llm(temperature: float = 0.3) -> BaseChatModel:
    from app.config.settings import get_settings
    settings = get_settings()
    provider = settings.llm_provider.strip().lower()

    if provider == "groq":
        return _get_groq_llm(temperature)
    else:
        return _get_ollama_llm(temperature)


def _get_groq_llm(temperature: float) -> BaseChatModel:
    """Return a ChatGroq LLM instance (free, fast, cloud-based)."""
    try:
        from langchain_groq import ChatGroq
        from app.config.settings import get_settings
        settings = get_settings()

        if not settings.groq_api_key or settings.groq_api_key == "your_groq_api_key_here":
            logger.error(
                "GROQ_API_KEY is not set! Get a free key at https://console.groq.com/keys "
                "and add it to your .env file as GROQ_API_KEY=your_key_here"
            )
            raise ValueError("GROQ_API_KEY not configured.")

        return ChatGroq(
            api_key=settings.groq_api_key,
            model=settings.groq_model_name,
            temperature=temperature,
        )
    except ImportError:
        logger.error("langchain-groq not installed. Run: pip install langchain-groq")
        raise


def _get_ollama_llm(temperature: float) -> BaseChatModel:
    """Return a ChatOllama LLM instance (local, slower)."""
    from langchain_ollama import ChatOllama
    from app.config.settings import get_settings
    settings = get_settings()

    return ChatOllama(
        model=settings.ollama_model_name,
        base_url=settings.ollama_base_url,
        temperature=temperature,
    )
