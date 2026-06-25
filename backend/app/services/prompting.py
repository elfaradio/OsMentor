"""Prompt engineering helpers for the OSMentor AI tutor."""

from __future__ import annotations

from textwrap import shorten
from typing import Any


def build_context_block(chunks: list[dict[str, Any]]) -> str:
    sections: list[str] = []
    for index, chunk in enumerate(chunks, start=1):
        sections.append(
            f"--- Passage {index} ---\n"
            f"Text: {shorten(str(chunk.get('text', '')), width=800, placeholder='...')}"
        )
    return "\n\n".join(sections)


def build_answer_policy() -> str:
    return (
        "You are OSMentor, an expert Operating Systems tutor. "
        "Your goal is to provide comprehensive, accurate, and pedagogically clear answers. "
        "CRITICAL RULES — you MUST follow all of them:\n"
        "1. Use ONLY the provided passages to answer. Do not fabricate information.\n"
        "2. Synthesize information from multiple passages when they cover related aspects.\n"
        "3. Provide clear definitions, explain mechanisms, and give concrete examples from the text.\n"
        "4. Structure your answer with logical flow — define first, then explain, then give examples.\n"
        "5. If the passages do not contain enough information, say 'I couldn't find this information in the knowledge base.'\n"
        "6. Use technical OS terminology correctly and explain it when first introduced.\n"
        "7. Keep answers focused and directly relevant to the question asked.\n"
        "8. ABSOLUTE RULE: Do NOT mention passage numbers, evidence numbers, source names, or references of any kind. "
        "Do NOT use phrases like 'Passage 1', 'Evidence X', 'According to the source', 'Based on the context', or any citation. "
        "Write as if you already know the answer — give it as a direct, confident, clean explanation with no references."
    )
