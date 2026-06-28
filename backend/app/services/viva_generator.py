"""Viva generation helpers for OSMentor AI."""

from __future__ import annotations

import json
import logging
import re

from backend.app.services.generation import OllamaAnswerGenerator

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
        logger.warning("Failed to parse viva JSON: %s", text[:200])
        return None


class VivaService:
    """Generate viva questions and evaluate student answers using Ollama."""

    def __init__(self) -> None:
        self._generator = OllamaAnswerGenerator()

    def generate_questions(self, topic: str, difficulty: str, count: int, context: str | None = None) -> list[dict[str, object]]:
        difficulty_guidance = {
            "easy": "factual recall and basic definitions (suitable for first-year students)",
            "medium": "conceptual understanding, trade-offs, and how mechanisms work internally",
            "hard": "advanced analysis, edge cases, design decisions, and comparison with alternatives",
        }.get(difficulty, "conceptual understanding")

        system_prompt = (
            "You are an expert Operating Systems professor conducting a viva voce examination. "
            "Generate unique, varied viva questions that test deep understanding. "
            "Each question must be distinctly different — no repetitive patterns. "
            "Return ONLY a JSON array of question strings, with no extra text or markdown."
        )
        
        import random
        salt = random.randint(10000, 99999)
        context_block = f"Use the following verified context from the textbooks for grounding:\n{context}\n\n" if context else ""
        user_prompt = (
            f"{context_block}"
            f"Generate exactly {count} viva questions about '{topic}' in Operating Systems.\n"
            f"Difficulty: {difficulty} — focus on {difficulty_guidance}.\n"
            f"Requirements:\n"
            f"- Each question must be genuinely different (different angle, depth, or aspect of {topic})\n"
            f"- Mix question types: 'explain', 'compare', 'what happens when', 'how does X relate to Y', 'design a'\n"
            f"- Questions should be open-ended and require thoughtful answers\n"
            f"- Be specific to {topic}, not generic OS questions\n"
            f"Randomizer seed: {salt}\n"
            f"Return a JSON array of exactly {count} question strings."
        )

        response = self._generator.generate_creative(system_prompt, user_prompt)
        parsed = _parse_json(response)

        if isinstance(parsed, dict):
            # Extract questions if wrapped in a dict
            for key in ["questions", "viva", "items", "results"]:
                if key in parsed and isinstance(parsed[key], list):
                    parsed = parsed[key]
                    break

        normalized_questions = []
        if isinstance(parsed, list):
            for item in parsed:
                q_text = ""
                if isinstance(item, dict):
                    q_text = str(item.get("question", item.get("text", ""))).strip()
                elif isinstance(item, str):
                    item_str = item.strip()
                    # Try parsing as JSON first
                    try:
                        loaded = json.loads(item_str)
                        if isinstance(loaded, dict):
                            q_text = str(loaded.get("question", loaded.get("text", ""))).strip()
                        else:
                            q_text = str(loaded).strip()
                    except Exception:
                        # Try parsing as Python literal dict fallback (e.g. if single quotes are used)
                        if item_str.startswith("{") and item_str.endswith("}"):
                            try:
                                import ast
                                loaded = ast.literal_eval(item_str)
                                if isinstance(loaded, dict):
                                    q_text = str(loaded.get("question", loaded.get("text", ""))).strip()
                            except Exception:
                                pass
                        if not q_text:
                            q_text = item_str

                if q_text:
                    normalized_questions.append(q_text)

        if not normalized_questions:
            logger.warning("Falling back to template viva questions for topic: %s", topic)
            normalized_questions = self._fallback(topic, difficulty, count)

        # Build list of dicts with sequential IDs starting from 1
        return [
            {"id": idx + 1, "question": q}
            for idx, q in enumerate(normalized_questions[:count])
        ]

    def evaluate_answer(self, question: str, student_answer: str, topic: str) -> dict[str, object]:
        system_prompt = (
            "You are a strict but fair Operating Systems professor evaluating a viva answer. "
            "Assess the answer for: technical accuracy, depth of understanding, use of examples, clarity. "
            "Return ONLY a JSON object with no extra text. "
            'Keys: "score" (integer 0-100), "feedback" (2-3 sentences), '
            '"strengths" (array of 1-3 strings), "improvements" (array of 1-3 strings).'
        )
        user_prompt = (
            f"Topic: {topic}\n"
            f"Question: {question}\n"
            f"Student Answer: {student_answer}\n\n"
            f"Evaluate this viva answer. Consider:\n"
            f"- Is the answer technically correct?\n"
            f"- Does it show understanding beyond memorization?\n"
            f"- Are there concrete examples or analogies?\n"
            f"- Is the explanation clear and well-structured?\n"
            f"Return a JSON object with: score (0-100), feedback, strengths (list), improvements (list)."
        )

        response = self._generator.generate_structured(system_prompt, user_prompt)
        parsed = _parse_json(response)

        try:
            if isinstance(parsed, dict) and "score" in parsed and "feedback" in parsed:
                return {
                    "score": float(min(max(parsed.get("score", 0), 0), 100)),
                    "feedback": str(parsed.get("feedback", "")),
                    "strengths": [str(s) for s in parsed.get("strengths", [])],
                    "improvements": [str(i) for i in parsed.get("improvements", [])],
                }
        except (ValueError, TypeError):
            logger.warning("Failed to validate viva evaluation JSON, using heuristic fallback")

        # Heuristic fallback if Gemini doesn't return valid JSON
        answer = student_answer.strip().lower()
        topic_tokens = {t for t in topic.lower().split() if len(t) > 2}
        has_topic = any(t in answer for t in topic_tokens) if topic_tokens else False
        word_count = len(student_answer.split())
        length_score = min(word_count / 80.0, 1.0) * 45.0
        relevance_score = 35.0 if has_topic else 10.0
        structure_score = 20.0 if any(p in student_answer for p in [".", ",", ";"]) else 8.0
        score = round(min(length_score + relevance_score + structure_score, 100.0), 2)

        strengths = []
        improvements = []
        if has_topic:
            strengths.append("Your response references the topic correctly.")
        else:
            improvements.append("Directly reference the asked concept.")
        if word_count >= 40:
            strengths.append("Good answer depth and detail.")
        else:
            improvements.append("Expand your answer with more detail and examples.")

        return {
            "score": score,
            "feedback": f"Your answer scored {score}/100 on relevance, depth, and clarity for the question about {topic}.",
            "strengths": strengths,
            "improvements": improvements,
        }

    @staticmethod
    def _fallback(topic: str, difficulty: str, count: int) -> list[str]:
        all_questions = [
            f"Explain the fundamental mechanism of {topic} and why it is essential in modern operating systems.",
            f"What are the key trade-offs involved in implementing {topic}? Give a real-world example.",
            f"How does {topic} interact with other OS components such as the scheduler or memory manager?",
            f"Describe a scenario where {topic} could fail or become a bottleneck. How would you fix it?",
            f"Compare the performance implications of {topic} with an alternative approach.",
            f"How would you design a more efficient version of {topic} for a multicore system?",
            f"What role does {topic} play in ensuring OS correctness and safety?",
        ]
        if difficulty == "easy":
            return all_questions[:count]
        elif difficulty == "hard":
            return all_questions[3:3 + count]
        return all_questions[1:1 + count]


def get_viva_service() -> VivaService:
    return VivaService()
