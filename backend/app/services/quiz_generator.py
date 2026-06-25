"""Quiz generation helpers powered by Gemini."""

from __future__ import annotations

import json
import logging
import re

from backend.app.services.generation import OllamaAnswerGenerator

logger = logging.getLogger(__name__)


def _parse_json_from_response(text: str) -> list | dict | None:
    """Extract JSON from an Ollama response that may include markdown fences."""
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
        logger.warning("Failed to parse JSON from Ollama quiz response: %s", text[:200])
        return None


class QuizService:
    """Generate and evaluate quiz content using Ollama."""

    def __init__(self) -> None:
        self._generator = OllamaAnswerGenerator()

    def generate_mcq(self, topic: str, difficulty: str, count: int) -> list[dict[str, object]]:
        difficulty_guidance = {
            "easy": "factual recall and basic definitions",
            "medium": "conceptual understanding and how mechanisms work internally",
            "hard": "advanced analysis, edge cases, and design decisions",
        }.get(difficulty, "conceptual understanding")

        system_prompt = (
            "You are an Operating Systems quiz generator. Generate unique multiple choice questions. "
            "Return ONLY a JSON array with no additional text. Each item must have: "
            '"question" (string), "type" (always "mcq"), "options" (array of exactly 4 strings), '
            '"answer" (string, must exactly match one of the options).'
        )
        user_prompt = (
            f"Generate {count} unique, non-repetitive multiple choice questions about '{topic}' in Operating Systems.\n"
            f"Difficulty level: {difficulty} — focus on {difficulty_guidance}.\n"
            f"Return a JSON array with exactly {count} items."
        )
        response = self._generator.generate_structured(system_prompt, user_prompt)
        parsed = _parse_json_from_response(response)
        
        if isinstance(parsed, dict):
            # If wrapped in a dictionary object, extract the array
            for key in ["questions", "quiz", "mcqs", "items", "results"]:
                if key in parsed and isinstance(parsed[key], list):
                    parsed = parsed[key]
                    break
        
        if isinstance(parsed, list):
            mcq_items = []
            for item in parsed:
                if isinstance(item, dict) and "question" in item and "options" in item and "answer" in item:
                    mcq_items.append({
                        "question": str(item.get("question", "")),
                        "type": "mcq",
                        "options": [str(opt) for opt in item.get("options", [])][:4],
                        "answer": str(item.get("answer", "")),
                    })
            if len(mcq_items) >= count:
                return mcq_items[:count]
            if mcq_items:
                return mcq_items
                
        # Fallback to template if parsing completely fails
        return self._fallback_mcq(topic, difficulty, count)

    def generate_short_questions(self, topic: str, difficulty: str, count: int) -> list[dict[str, object]]:
        system_prompt = (
            "You are an Operating Systems quiz generator. Generate unique short answer questions. "
            "Return ONLY a JSON array with no additional text. Each item must have: "
            '"question" (string), "type" (always "short"), "options" (always empty array []), '
            '"answer" (string, a model answer in 2-4 sentences).'
        )
        user_prompt = (
            f"Generate exactly {count} distinct short answer questions about '{topic}' in Operating Systems.\n"
            f"Difficulty level: {difficulty}.\n"
            f"Questions should require conceptual explanations, not just definitions.\n"
            f"Return a JSON array with exactly {count} items."
        )
        response = self._generator.generate_structured(system_prompt, user_prompt)
        parsed = _parse_json_from_response(response)
        
        if isinstance(parsed, dict):
            # If wrapped in a dictionary object, extract the array
            for key in ["questions", "quiz", "items", "results", "short_questions"]:
                if key in parsed and isinstance(parsed[key], list):
                    parsed = parsed[key]
                    break
        
        if isinstance(parsed, list):
            short_items = []
            for item in parsed:
                if isinstance(item, dict) and "question" in item and "answer" in item:
                    short_items.append({
                        "question": str(item.get("question", "")),
                        "type": "short",
                        "options": [],
                        "answer": str(item.get("answer", "")),
                    })
            if len(short_items) >= count:
                return short_items[:count]
            if short_items:
                return short_items
                
        return self._fallback_short(topic, difficulty, count)

    def evaluate_submission(self, answers: list[str], answer_key: list[str]) -> dict[str, object]:
        total = min(len(answers), len(answer_key))
        if total == 0:
            return {"score": 0.0, "correct": 0, "total": 0, "feedback": "No answers were submitted."}
            
        correct = 0
        for answer, expected in zip(answers[:total], answer_key[:total], strict=False):
            ans_clean = answer.strip().lower()
            exp_clean = expected.strip().lower()
            # If the expected answer is very long (short question), do a basic semantic check using keywords
            if len(exp_clean.split()) > 10:
                exp_tokens = {token for token in exp_clean.split() if len(token) > 3}
                match_count = sum(1 for token in exp_tokens if token in ans_clean)
                if match_count >= len(exp_tokens) * 0.3:  # Accept if 30% of significant words match
                    correct += 1
            # Otherwise exact string match for MCQ
            elif ans_clean == exp_clean:
                correct += 1
                
        score = round((correct / total) * 100.0, 2)
        feedback = f"You answered {correct}/{total} correctly."
        
        # Add dynamic feedback from Gemini based on score
        system_prompt = (
            "You are an Operating Systems tutor giving brief encouragement. "
            "Write exactly ONE short, supportive sentence."
        )
        user_prompt = f"The student scored {score}% on an OS quiz. Give them a 1-sentence supportive feedback based on their score."
        encouragement = self._generator.generate_creative(system_prompt, user_prompt)
        
        return {"score": score, "correct": correct, "total": total, "feedback": f"{feedback} {encouragement}"}

    @staticmethod
    def _fallback_mcq(topic: str, difficulty: str, count: int) -> list[dict[str, object]]:
        items: list[dict[str, object]] = []
        for idx in range(1, count + 1):
            question = f"[{difficulty.upper()}] {topic}: MCQ {idx} - choose the best statement."
            options = [
                f"{topic} improves system reliability under controlled scheduling.",
                f"{topic} is unrelated to resource management.",
                f"{topic} only applies to hardware interrupts.",
                f"{topic} cannot be measured in OS performance.",
            ]
            items.append({"question": question, "type": "mcq", "options": options, "answer": options[0]})
        return items

    @staticmethod
    def _fallback_short(topic: str, difficulty: str, count: int) -> list[dict[str, object]]:
        items: list[dict[str, object]] = []
        for idx in range(1, count + 1):
            items.append({
                "question": f"[{difficulty.upper()}] {topic}: short question {idx} - explain in 2-4 lines.",
                "type": "short",
                "options": [],
                "answer": f"A strong answer should explain {topic} with one practical OS example.",
            })
        return items


def get_quiz_service() -> QuizService:
    return QuizService()
