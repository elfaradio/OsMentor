"""Concept comparison helpers for OSMentor AI."""

from __future__ import annotations

import json
import logging
import re

from app.services.generation import OllamaAnswerGenerator

logger = logging.getLogger(__name__)


def _parse_json(text: str) -> list | dict | None:
    text = text.strip()
    match = re.search(r"```(?:json)?\s*\n?(.*?)\n?```", text, re.DOTALL)
    if match:
        text = match.group(1).strip()
    
    # Locate first brace/bracket and last brace/bracket
    start_idx = -1
    end_idx = -1
    
    first_bracket = text.find("[")
    first_brace = text.find("{")
    
    if first_bracket != -1 and (first_brace == -1 or first_bracket < first_brace):
        start_idx = first_bracket
        end_idx = text.rfind("]")
    elif first_brace != -1:
        start_idx = first_brace
        end_idx = text.rfind("}")
        
    if start_idx != -1 and end_idx != -1 and end_idx > start_idx:
        text = text[start_idx:end_idx+1]
        
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        logger.warning("Failed to parse JSON from comparison response: %s", text[:200])
        return None


class ComparisonService:
    """Create structured comparison rows between two concepts using Ollama."""

    def __init__(self) -> None:
        self._generator = OllamaAnswerGenerator()

    def compare(self, concept_a: str, concept_b: str, context: str | None = None) -> dict[str, object]:
        system_prompt = (
            "You are an expert Operating Systems professor. "
            "Generate a detailed, accurate comparison table between two OS concepts. "
            "Return ONLY a JSON object with no extra text. "
            'The object must have keys: "title" (string), "concept_a" (string), "concept_b" (string), '
            '"rows" (array of objects, each with "aspect", "concept_a", "concept_b" string fields). '
            "Use 6-8 meaningful aspects such as Definition, Mechanism, Fragmentation, Performance, "
            "Address Translation, Use Cases, Advantages, Disadvantages. "
            "Each cell must contain a specific, factual, detailed explanation — NOT a generic placeholder."
        )
        
        import random
        salt = random.randint(10000, 99999)
        context_block = f"Use the following verified context from the textbooks for grounding:\n{context}\n\n" if context else ""
        user_prompt = (
            f"{context_block}"
            f"Compare '{concept_a}' and '{concept_b}' in Operating Systems.\n"
            f"Provide 7 distinct aspects. Be specific and technical.\n"
            f"Randomizer seed: {salt}\n"
            f'Return a JSON object with keys: title, concept_a, concept_b, rows.\n'
            f'Each row: {{"aspect": "...", "concept_a": "...", "concept_b": "..."}}'
        )

        response = self._generator.generate_creative(system_prompt, user_prompt)
        parsed = _parse_json(response)

        if isinstance(parsed, dict) and "rows" in parsed:
            rows = [
                {
                    "aspect": str(row.get("aspect", "")),
                    "concept_a": str(row.get("concept_a", "")),
                    "concept_b": str(row.get("concept_b", "")),
                }
                for row in parsed.get("rows", [])
                if row.get("aspect") and row.get("concept_a") and row.get("concept_b")
            ]
            if rows:
                return {
                    "title": parsed.get("title", f"{concept_a} vs {concept_b}"),
                    "concept_a": concept_a,
                    "concept_b": concept_b,
                    "rows": rows,
                }

        logger.warning("Falling back to template comparison for %s vs %s", concept_a, concept_b)
        return self._fallback(concept_a, concept_b)

    @staticmethod
    def _fallback(concept_a: str, concept_b: str) -> dict[str, object]:
        rows = [
            {"aspect": "Definition", "concept_a": f"{concept_a} is a key operating systems concept.", "concept_b": f"{concept_b} is a related operating systems concept."},
            {"aspect": "Mechanism", "concept_a": f"Execution behavior specific to {concept_a}.", "concept_b": f"Execution behavior specific to {concept_b}."},
            {"aspect": "Resource Allocation", "concept_a": f"How resources are managed in {concept_a}.", "concept_b": f"How resources are managed in {concept_b}."},
            {"aspect": "Performance Overhead", "concept_a": f"Typical latency/throughput constraints of {concept_a}.", "concept_b": f"Typical latency/throughput constraints of {concept_b}."},
            {"aspect": "Key Advantages", "concept_a": f"Primary benefit of implementing {concept_a}.", "concept_b": f"Primary benefit of implementing {concept_b}."},
        ]
        return {"title": f"{concept_a} vs {concept_b}", "concept_a": concept_a, "concept_b": concept_b, "rows": rows}


def get_comparison_service() -> ComparisonService:
    return ComparisonService()
