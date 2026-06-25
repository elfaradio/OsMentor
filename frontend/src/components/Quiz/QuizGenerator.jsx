import { useState } from 'react';

const DIFFICULTIES = [
    { value: 'easy', label: 'Easy', color: 'text-emerald-400' },
    { value: 'medium', label: 'Medium', color: 'text-amber-400' },
    { value: 'hard', label: 'Hard', color: 'text-red-400' },
];

export default function QuizGenerator({ onGenerate, isLoading }) {
    const [topic, setTopic] = useState('Paging');
    const [difficulty, setDifficulty] = useState('medium');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!topic.trim()) return;
        onGenerate({ topic: topic.trim(), difficulty, mcq_count: 5, short_count: 2 });
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="glass-panel p-5"
        >
            <div className="flex flex-wrap items-end gap-3">
                <div className="flex-1 min-w-[180px] space-y-1">
                    <label className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">Topic</label>
                    <input
                        className="input-field"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="e.g. Deadlocks, Scheduling…"
                        disabled={isLoading}
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">Difficulty</label>
                    <div className="flex gap-1 rounded-lg border border-slate-300 dark:border-slate-300/50 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-50/60 dark:bg-slate-900/60 p-1">
                        {DIFFICULTIES.map((d) => (
                            <button
                                key={d.value}
                                type="button"
                                disabled={isLoading}
                                onClick={() => setDifficulty(d.value)}
                                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                                    difficulty === d.value
                                        ? `bg-slate-700 ${d.color}`
                                        : 'text-slate-500 hover:text-slate-700 dark:text-slate-300'
                                }`}
                            >
                                {d.label}
                            </button>
                        ))}
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-primary flex items-center gap-2 whitespace-nowrap"
                >
                    {isLoading ? (
                        <>
                            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                            Generating…
                        </>
                    ) : (
                        <>
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                            Generate Quiz
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
