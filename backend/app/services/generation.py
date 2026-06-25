"""Ollama answer generation helpers for OSMentor AI."""

from __future__ import annotations

import logging

from langchain_core.messages import HumanMessage, SystemMessage

from backend.app.core.llm import get_llm

logger = logging.getLogger(__name__)


class OllamaAnswerGenerator:
    """Generate grounded answers using local Ollama model."""

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
            logger.error("Ollama connection failed: %s", exc)
            return "Ollama is not running. Start it with: ollama serve"

    def generate_creative(self, system_prompt: str, user_prompt: str) -> str:
        """Higher temperature generation for diverse quiz/viva/diagram content."""
        try:
            response = self._creative_llm.invoke([
                SystemMessage(content=system_prompt),
                HumanMessage(content=user_prompt),
            ])
            return str(response.content).strip() if response.content else ""
        except Exception as exc:
            logger.error("Ollama connection failed: %s", exc)
            return "Ollama is not running. Start it with: ollama serve"

    def generate_structured(self, system_prompt: str, user_prompt: str) -> str:
        """Low temperature generation for strict structured JSON/Mermaid formats."""
        try:
            response = self._structured_llm.invoke([
                SystemMessage(content=system_prompt),
                HumanMessage(content=user_prompt),
            ])
            return str(response.content).strip() if response.content else ""
        except Exception as exc:
            logger.error("Ollama connection failed: %s", exc)
            return "Ollama is not running. Start it with: ollama serve"

