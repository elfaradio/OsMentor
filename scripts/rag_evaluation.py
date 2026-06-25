from __future__ import annotations
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from rag_pipeline.evaluation import save_evaluation_artifacts


def main() -> None:
    artifacts = save_evaluation_artifacts()
    print(json.dumps(
        {
            "report_path": str(artifacts["report_path"]),
            "json_path": str(artifacts["json_path"]),
            "summary": artifacts["summary"],
        },
        indent=2,
    ))


if __name__ == "__main__":
    main()
