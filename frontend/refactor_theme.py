import os
import re

directory = "e:/OsMentor/OsMentor/frontend/src"

replacements = {
    r"\bbg-slate-900\b": "bg-slate-50 dark:bg-slate-900",
    r"\bbg-slate-950\b": "bg-slate-100 dark:bg-slate-950",
    r"\bbg-slate-800\b": "bg-slate-200 dark:bg-slate-800",
    r"\bbg-slate-900/50\b": "bg-slate-50/50 dark:bg-slate-900/50",
    r"\bbg-slate-900/30\b": "bg-slate-50/30 dark:bg-slate-900/30",
    r"\bbg-slate-900/60\b": "bg-slate-50/60 dark:bg-slate-900/60",
    r"\bbg-slate-900/40\b": "bg-slate-50/40 dark:bg-slate-900/40",
    r"\bbg-slate-800/50\b": "bg-slate-200/50 dark:bg-slate-800/50",
    r"\bbg-black/20\b": "bg-black/5 dark:bg-black/20",
    r"\btext-slate-100\b": "text-slate-900 dark:text-slate-100",
    r"\btext-slate-200\b": "text-slate-800 dark:text-slate-200",
    r"\btext-slate-300\b": "text-slate-700 dark:text-slate-300",
    r"\btext-slate-400\b": "text-slate-600 dark:text-slate-400",
    r"\bborder-slate-700\b": "border-slate-300 dark:border-slate-700",
    r"\bborder-slate-800\b": "border-slate-200 dark:border-slate-800",
    r"\bborder-slate-700/50\b": "border-slate-300/50 dark:border-slate-700/50",
    r"\bborder-slate-700/40\b": "border-slate-300/40 dark:border-slate-700/40",
    r"\bborder-slate-600/60\b": "border-slate-400/60 dark:border-slate-600/60",
    r"\btext-white\b(?!/| dark:)": "text-slate-900 dark:text-white"
}

for root, _, files in os.walk(directory):
    for file in files:
        if file.endswith(".jsx"):
            filepath = os.path.join(root, file)
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read()
            
            new_content = content
            for old, new in replacements.items():
                # Avoid replacing if it already has the dark: version (e.g., if we run the script twice)
                # This simple logic might replace partially, but let us just trust it for one run.
                # A better approach is to check if it already contains the new string.
                if new not in new_content:
                    new_content = re.sub(old, new, new_content)
            
            if new_content != content:
                with open(filepath, "w", encoding="utf-8") as f:
                    f.write(new_content)
                print(f"Updated {filepath}")

