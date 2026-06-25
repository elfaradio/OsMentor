export default function QuestionCard({ question, index, isActive }) {
    return (
        <div
            className={`rounded-xl border px-4 py-3 text-sm transition-all duration-200 ${
                isActive
                    ? 'border-cyan-500/40 bg-cyan-500/10 shadow-lg shadow-cyan-500/5'
                    : 'border-slate-300 dark:border-slate-300/50 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-50/40 dark:bg-slate-900/40 hover:border-slate-400/60 dark:border-slate-600/60 hover:bg-slate-200 dark:bg-slate-200/50 dark:bg-slate-800/50'
            }`}
        >
            <div className="flex items-start gap-3">
                <span
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold ring-1 transition-all ${
                        isActive
                            ? 'bg-cyan-500/20 text-cyan-400 ring-cyan-500/40'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-500 ring-slate-700/50'
                    }`}
                >
                    {index + 1}
                </span>
                <span className={`leading-relaxed transition-colors ${isActive ? 'text-cyan-200' : 'text-slate-700 dark:text-slate-300'}`}>
                    {question}
                </span>
                {isActive && (
                    <span className="ml-auto shrink-0 rounded-full bg-cyan-500/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-cyan-400">
                        Active
                    </span>
                )}
            </div>
        </div>
    );
}
