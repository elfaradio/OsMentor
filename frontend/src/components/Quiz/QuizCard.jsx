export default function QuizCard({ item, index, answer, onChange, showAnswer }) {
    const isMCQ = item.type === 'mcq';

    return (
        <article className="glass-panel p-5 transition-all hover:border-slate-400/60 dark:border-slate-600/60">
            <div className="flex items-start gap-3 mb-4">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-500/10 text-xs font-bold text-cyan-400 ring-1 ring-cyan-500/30">
                    {index + 1}
                </span>
                <h4 className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed">{item.question}</h4>
            </div>

            {isMCQ ? (
                <div className="ml-9 space-y-2">
                    {item.options.map((option) => {
                        const selected = answer === option;
                        const isCorrectOption = showAnswer && option === item.answer;
                        const isWrongSelected = showAnswer && selected && option !== item.answer;
                        
                        let labelClass = 'border-slate-300 dark:border-slate-300/40 dark:border-slate-700/40 bg-slate-200 dark:bg-slate-800/20 text-slate-600 dark:text-slate-400';
                        if (showAnswer) {
                            if (isCorrectOption) {
                                labelClass = 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300';
                            } else if (isWrongSelected) {
                                labelClass = 'border-red-500/40 bg-red-500/10 text-red-300';
                            }
                        } else {
                            if (selected) {
                                labelClass = 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300';
                            } else {
                                labelClass += ' hover:border-slate-400/60 dark:border-slate-600/60 hover:bg-slate-200 dark:bg-slate-800/40 hover:text-slate-700 dark:text-slate-300';
                            }
                        }

                        return (
                            <label
                                key={option}
                                className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 text-sm transition-all ${labelClass}`}
                            >
                                <span className={`h-4 w-4 shrink-0 rounded-full border-2 transition-all flex items-center justify-center ${
                                    selected ? (showAnswer ? (isCorrectOption ? 'border-emerald-400' : 'border-red-400') : 'border-cyan-400') : 'border-slate-600'
                                }`}>
                                    {selected && <span className={`h-2 w-2 rounded-full ${showAnswer ? (isCorrectOption ? 'bg-emerald-400' : 'bg-red-400') : 'bg-cyan-400'}`} />}
                                </span>
                                <input
                                    type="radio"
                                    className="sr-only"
                                    name={`quiz-${index}`}
                                    checked={selected}
                                    onChange={() => !showAnswer && onChange(option)}
                                    disabled={showAnswer}
                                />
                                {option}
                            </label>
                        );
                    })}
                </div>
            ) : (
                <div className="ml-9 space-y-4">
                    <textarea
                        className="input-field resize-none text-sm"
                        rows={3}
                        placeholder="Write your answer here…"
                        value={answer || ''}
                        onChange={(e) => !showAnswer && onChange(e.target.value)}
                        disabled={showAnswer}
                    />
                    {showAnswer && (
                        <div className="rounded-lg border border-emerald-500/20 bg-emerald-950/20 p-3 text-sm">
                            <span className="font-semibold text-emerald-400 block mb-1">Expected Answer:</span>
                            <span className="text-emerald-200">{item.answer}</span>
                        </div>
                    )}
                </div>
            )}
        </article>
    );
}
