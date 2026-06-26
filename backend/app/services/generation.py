"""Answer generation helpers for OSMentor AI.

Supports both Groq (fast, free) and Ollama (local) via the LLM provider factory.
"""

from __future__ import annotations

import logging

from langchain_core.messages import HumanMessage, SystemMessage

from app.core.llm import get_llm

logger = logging.getLogger(__name__)


class AnswerGenerator:
    """Generate grounded answers using the configured LLM provider."""

    def __init__(self) -> None:
        self._llm = get_llm(temperature=0.2)
        self._creative_llm = get_llm(temperature=0.8)
        self._structured_llm = get_llm(temperature=0.1)

    def generate(self, system_prompt: str, user_prompt: str) -> str:
        try:
            response = self._llm.invoke([
                SystemMessage(content=system_prompt),
                HumanMessage(content=user_prompt),
            ])
            answer_text = str(response.content).strip() if response.content else ""
            if not answer_text:
                return "I couldn't find this information in the knowledge base."
            return answer_text
        except Exception as exc:
            logger.error("LLM generation failed: %s", exc)
            return (
                "The AI service is unavailable. "
                "Check your LLM_PROVIDER setting and API key in .env"
            )

    def generate_creative(self, system_prompt: str, user_prompt: str) -> str:
        """Higher temperature generation for diverse quiz/viva/diagram content."""
        try:
            response = self._creative_llm.invoke([
                SystemMessage(content=system_prompt),
                HumanMessage(content=user_prompt),
            ])
            return str(response.content).strip() if response.content else ""
        except Exception as exc:
            logger.error("LLM creative generation failed: %s", exc)
            return ""

    def generate_structured(self, system_prompt: str, user_prompt: str) -> str:
        """Low temperature generation for strict structured JSON/Mermaid formats."""
        try:
            response = self._structured_llm.invoke([
                SystemMessage(content=system_prompt),
                HumanMessage(content=user_prompt),
            ])
            return str(response.content).strip() if response.content else ""
        except Exception as exc:
            logger.error("LLM structured generation failed: %s", exc)
            return ""


# Backwards-compatible alias
OllamaAnswerGenerator = AnswerGenerator
