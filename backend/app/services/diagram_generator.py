"""Diagram generation helpers powered by Ollama."""

from __future__ import annotations

import logging
import re

from app.services.generation import OllamaAnswerGenerator

logger = logging.getLogger(__name__)

DIAGRAM_TYPE_DESCRIPTIONS = {
    "process_state": "process state transition diagram (stateDiagram-v2) showing all 5 process states and all valid transitions",
    "scheduling_flow": "CPU scheduling flow diagram (flowchart LR) showing queues, scheduler, CPU, and I/O",
    "deadlock_graph": "resource allocation / deadlock graph (graph LR) showing processes requesting and holding resources",
    "paging_segmentation": "memory management address translation diagram (flowchart TD) showing logical to physical address translation",
}


def _sanitize_mermaid(text: str) -> str:
    """Strip markdown fences, fix common Mermaid syntax issues, and return raw code."""
    text = text.strip()

    # Remove markdown fences
    match = re.search(r"```(?:mermaid)?\s*\n?(.*?)\n?```", text, re.DOTALL)
    if match:
        text = match.group(1).strip()

    # If no fences, find where Mermaid starts
    for keyword in ("stateDiagram", "flowchart", "graph ", "sequenceDiagram", "classDiagram"):
        idx = text.find(keyword)
        if idx != -1:
            text = text[idx:].strip()
            break

    lines = []
    for line in text.splitlines():
        # Remove inline comments that Mermaid can't render
        line = re.sub(r"\s*//.*$", "", line)
        # Fix invalid label arrow endings: -->|label|> to -->|label|
        line = re.sub(r"-->\s*\|([^|]+)\|\s*>", r"-->|\1|", line)

        # Fix unquoted parentheses in node labels: A[label (extra)] -> A["label (extra)"]
        # Only fix if not already quoted
        def quote_bracket_content(m: re.Match) -> str:
            bracket, inner, close = m.group(1), m.group(2), m.group(3)
            if inner.startswith('"') and inner.endswith('"'):
                return f"{bracket}{inner}{close}"
            if "(" in inner or ")" in inner or "/" in inner or ":" in inner:
                inner = inner.replace('"', "'")
                return f'{bracket}"{inner}"{close}'
            return m.group(0)

        line = re.sub(r"(\[)([^\[\]]+)(\])", quote_bracket_content, line)
        lines.append(line)

    return "\n".join(lines).strip()


class DiagramService:
    def __init__(self) -> None:
        self._generator = OllamaAnswerGenerator()

    def generate(self, diagram_type: str, topic: str, context: str | None = None) -> str:
        description = DIAGRAM_TYPE_DESCRIPTIONS.get(
            diagram_type,
            "flowchart diagram illustrating the concept",
        )

        # Pick the right Mermaid directive based on type
        type_hints = {
            "process_state": "stateDiagram-v2",
            "scheduling_flow": "flowchart LR",
            "deadlock_graph": "graph LR",
            "paging_segmentation": "flowchart TD",
        }
        directive = type_hints.get(diagram_type, "flowchart TD")

        system_prompt = (
            "You are a Mermaid.js v10 diagram expert. Your ONLY job is to produce valid, renderable Mermaid syntax. "
            "STRICT RULES — break any of these and the diagram will fail to render:\n"
            f"1. Start the diagram with exactly: `{directive}` on the very first line. Nothing before it.\n"
            "2. Output ONLY raw Mermaid code. NO markdown fences (no ```), NO explanations, NO comments.\n"
            "3. Node IDs must be short alphanumeric strings with no spaces: use P1, CPU, RQ, IO, etc.\n"
            "4. Node labels with spaces, parentheses, colons, or special characters MUST be wrapped in double quotes.\n"
            '   CORRECT:   P1["Process (Running)"]  or  B{"CPU Scheduler"}\n'
            "   WRONG:     P1[Process (Running)]    or  B{CPU Scheduler}\n"
            "5. Arrow syntax: use `-->` for flowcharts. For labels, use `-->|label|` ONLY.\n"
            "   NEVER use `-->|label|>` or add an extra `>` at the end. That is invalid syntax.\n"
            "6. For stateDiagram-v2: states are bare words, transitions use `-->` with a colon label: `Ready --> Running : dispatch`.\n"
            "7. Make the diagram detailed (8-12 nodes minimum) and specific to the requested OS topic.\n"
            "8. Do NOT include numbered lists, English prose, or any text outside the diagram syntax."
        )

        context_block = f"Use the following verified context from the textbooks for grounding:\n{context}\n\n" if context else ""
        user_prompt = (
            f"{context_block}"
            f"Generate a {description} about the OS topic: '{topic}'.\n"
            f"The diagram MUST start with `{directive}` on line 1.\n"
            f"Include at least 8 nodes/states with meaningful OS-specific labels.\n"
            f"Output ONLY the raw Mermaid code — absolutely nothing else."
        )

        mermaid = self._generator.generate_structured(system_prompt, user_prompt)
        mermaid = _sanitize_mermaid(mermaid)

        if not mermaid or len(mermaid) < 20:
            logger.warning("Ollama returned empty diagram, using fallback for %s", diagram_type)
            return self._fallback(diagram_type, topic)

        # Ensure it starts with a valid directive; if not, prepend fallback
        if not any(mermaid.startswith(k) for k in ("stateDiagram", "flowchart", "graph ", "sequenceDiagram", "classDiagram")):
            logger.warning("Diagram did not start with valid directive, using fallback for %s", diagram_type)
            return self._fallback(diagram_type, topic)

        return mermaid

    @staticmethod
    def _fallback(diagram_type: str, topic: str) -> str:
        if diagram_type == "process_state":
            return (
                "stateDiagram-v2\n"
                "    [*] --> New\n"
                '    New --> Ready : "admitted to ready queue"\n'
                '    Ready --> Running : "scheduler dispatch"\n'
                '    Running --> Waiting : "I/O or event wait"\n'
                '    Waiting --> Ready : "I/O or event completion"\n'
                '    Running --> Ready : "interrupt / preempt"\n'
                '    Running --> Terminated : "process exits"\n'
                "    Terminated --> [*]\n"
            )
        if diagram_type == "scheduling_flow":
            return (
                "flowchart LR\n"
                '    NP["New Process"] --> RQ["Ready Queue"]\n'
                '    RQ --> CS{"CPU Scheduler"}\n'
                '    CS -->|"dispatch"| CPU["CPU Running"]\n'
                '    CPU -->|"I/O request"| IWQ["I/O Wait Queue"]\n'
                '    IWQ -->|"I/O complete"| RQ\n'
                '    CPU -->|"time quantum expired"| RQ\n'
                '    CPU -->|"process exits"| TERM["Terminated"]\n'
            )
        if diagram_type == "deadlock_graph":
            return (
                "graph LR\n"
                '    P1(("Process P1")) -->|"requests"| R1[/"Resource R1"/]\n'
                '    R1 -->|"held by"| P2(("Process P2"))\n'
                '    P2 -->|"requests"| R2[/"Resource R2"/]\n'
                '    R2 -->|"held by"| P1\n'
            )
        return (
            "flowchart TD\n"
            '    LA["Logical Address (Page#, Offset)"] --> MMU{"MMU"}\n'
            '    MMU --> PT["Page Table Lookup"]\n'
            '    PT -->|"valid bit = 1"| PFN["Physical Frame Number"]\n'
            '    PT -->|"valid bit = 0"| PF["Page Fault Handler"]\n'
            '    PF --> DISK["Load from Disk"]\n'
            '    DISK --> PT\n'
            '    PFN --> PA["Physical Address = Frame + Offset"]\n'
            '    PA --> MEM["Physical Memory Access"]\n'
        )


def get_diagram_service() -> DiagramService:
    return DiagramService()
