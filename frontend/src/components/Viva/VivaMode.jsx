import { useState } from 'react';
import QuestionCard from './QuestionCard';

export default function VivaMode({ questions, onEvaluate, evaluation, isEvaluating }) {
    const [selectedQuestion, setSelectedQuestion] = useState(questions[0] || '');
    const [answer, setAnswer] = useState('');

    const handleEvaluate = () => {
        onEvaluate(selectedQuestion, answer);
    };

    const scoreColor = evaluation
        ? evaluation.score >= 70 ? 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10'
        : evaluation.score >= 40 ? 'text-amber-400 border-amber-500/40 bg-amber-500/10'
        : 'text-red-400 border-red-500/40 bg-red-500/10'
        : '';

    return (
        <div className="space-y-5">
            {/* Question list */}
            <div className="space-y-2 stagger">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
                    Select a question to answer
                </p>
                {questions.map((question, index) => (
                    <button
                        key={question}
                        className="block w-full text-left"
                        onClick={() => { setSelectedQuestion(question); setAnswer(''); }}
                    >
                        <QuestionCard
                            question={question}
                            index={index}
                            isActive={selectedQuestion === question}
                        />
                    </button>
                ))}
            </div>

            {/* Answer section */}
            <div className="glass-panel p-5 space-y-4 fade-in">
                {selectedQuestion ? (
                    <div className="flex items-start gap-2 rounded-lg border border-cyan-500/20 bg-cyan-500/5 px-3 py-2.5">
                        <svg className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-sm text-cyan-300 leading-relaxed">{selectedQuestion}</p>
                    </div>
                ) : (
                    <p className="text-sm text-slate-500 italic">Select a question above to begin…</p>
                )}

                <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">Your Answer</label>
                    <textarea
                        className="input-field resize-none text-sm"
                        rows={5}
                        placeholder="Type your answer here… Be as detailed as possible for better feedback."
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                    />
                </div>

                <button
                    onClick={handleEvaluate}
                    disabled={isEvaluating || !selectedQuestion || !answer.trim()}
                    className="btn-primary flex items-center gap-2"
                >
                    {isEvaluating ? (
                        <>
                            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                            Evaluating…
                        </>
                    ) : (
                        <>
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Evaluate Answer
                        </>
                    )}
                </button>
            </div>

            {/* Evaluation result */}
            {evaluation && (
                <div className="glass-panel p-5 space-y-3 fade-in">
                    <div className="flex items-center gap-3">
                        <div className={`score-badge ${evaluation.score >= 70 ? 'score-high' : evaluation.score >= 40 ? 'score-mid' : 'score-low'}`}>
                            {evaluation.score}
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                                {evaluation.score >= 70 ? 'Excellent answer!' : evaluation.score >= 40 ? 'Good effort!' : 'Needs improvement'}
                            </p>
                            <p className="text-xs text-slate-500">Score out of 100</p>
                        </div>
                    </div>
                    <hr className="divider" />
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Feedback</p>
                        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{evaluation.feedback}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
