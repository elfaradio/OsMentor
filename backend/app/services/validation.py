"""Topic validation service for OSMentor AI to ensure questions/comparisons are grounded in OS concepts."""

import json
import logging
import re

from backend.app.services.generation import AnswerGenerator
from backend.app.services.retrieval import get_retrieval_service

logger = logging.getLogger(__name__)


def validate_os_topic(topic: str) -> tuple[bool, str, list[dict]]:
    """Validate if a topic/concept is a valid Operating Systems topic.

    Returns:
        (is_valid, error_message, retrieved_chunks)
    """
    topic_clean = topic.strip()
    if not topic_clean:
        return False, "Topic cannot be empty.", []

    # 1. Retrieve candidates from our vector db/index
    try:
        retriever = get_retrieval_service()
        chunks = retriever.retrieve(topic_clean, top_k=4)
    except Exception as e:
        logger.warning("Retrieval failed during validation: %s", e)
        chunks = []

    # 2. Ask the LLM if it's a valid Operating Systems concept
    # We provide the retrieved context so it can check against the textbooks
    context_str = ""
    if chunks:
        context_str = "\n".join([f"- {c.get('text', '')[:300]}" for c in chunks])

    system_prompt = (
        "You are an expert Operating Systems professor. "
        "Your task is to validate if the given topic is a valid, recognized concept in Operating Systems. "
        "You must return ONLY a JSON object with keys: "
        '"valid" (boolean) and "reason" (string, explaining why if invalid, or empty if valid). '
        "Do NOT output markdown code blocks, do NOT output explanations. ONLY raw JSON."
    )

    user_prompt = (
        f"Topic to check: '{topic_clean}'\n\n"
        f"Retrieved Context from textbooks (if any):\n{context_str}\n\n"
        f"Is '{topic_clean}' a recognized concept/topic in Operating Systems? "
        f"Answer in JSON format: "
        f'{{"valid": true, "reason": ""}} or {{"valid": false, "reason": "Explain why it is not a valid OS concept."}}'
    )

    try:
        generator = AnswerGenerator()
        response = generator.generate_structured(system_prompt, user_prompt).strip()
        # strip markdown blocks if model generated them
        match = re.search(r"({.*})", response, re.DOTALL)
        if match:
            response = match.group(1)
        parsed = json.loads(response)
        if isinstance(parsed, dict):
            valid = bool(parsed.get("valid", True))
            reason = str(parsed.get("reason") or f"'{topic_clean}' is not a valid Operating Systems concept.")
            return valid, reason, chunks
    except Exception as e:
        logger.warning("LLM topic validation failed: %s", e)

    # Heuristic fallback if LLM/parsing fails
    non_os_words = {"football", "soccer", "cricket", "basketball", "farhad", "darthfarhad", "movie", "song", "food", "play", "game"}
    words = {w.lower() for w in re.findall(r"[a-zA-Z]+", topic_clean)}
    if words.intersection(non_os_words):
        return False, f"'{topic_clean}' is not a valid Operating Systems concept.", []

    return True, "", chunks
