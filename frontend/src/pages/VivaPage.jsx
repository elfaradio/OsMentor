import { useState } from 'react';
import VivaMode from '../components/Viva/VivaMode';
import { evaluateVivaAnswer, generateVivaQuestions } from '../services/ragService';

export default function VivaPage() {
    const [topic, setTopic] = useState('CPU Scheduling');
    const [difficulty, setDifficulty] = useState('medium');
    const [questions, setQuestions] = useState([]);
    const [evaluation, setEvaluation] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isEvaluating, setIsEvaluating] = useState(false);
    const [error, setError] = useState(null);

    const handleGenerate = async () => {
        if (!topic.trim()) return;
        setIsGenerating(true);
        setError(null);
        setQuestions([]);
        setEvaluation(null);
        try {
            const response = await generateVivaQuestions({ topic: topic.trim(), difficulty, count: 3 });
            setQuestions(response.questions);
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to generate viva questions. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleEvaluate = async (question, studentAnswer) => {
        if (!question || !studentAnswer.trim()) return;
        setIsEvaluating(true);
        setEvaluation(null);
        try {
            const response = await evaluateVivaAnswer({ question, student_answer: studentAnswer, topic });
            setEvaluation(response);
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to evaluate answer. Please try again.');
        } finally {
            setIsEvaluating(false);
        }
    };

    const DIFFICULTIES = ['easy', 'medium', 'hard'];
    const difficultyColors = { easy: 'text-emerald-400', medium: 'text-amber-400', hard: 'text-red-400' };

    return (
        <div className="space-y-6 fade-in">
            {/* Page header */}
            <div>
                <h2 className="text-2xl font-bold gradient-text">Viva Mode</h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Practice oral examination questions and get instant AI feedback on your answers.</p>
            </div>

            {/* Controls */}
            <section className="glass-panel p-5">
                <div className="flex flex-wrap items-end gap-3">
                    <div className="flex-1 min-w-[200px] space-y-1">
                        <label className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">Topic</label>
                        <input
                            className="input-field"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="e.g. CPU Scheduling, Memory Management…"
                            disabled={isGenerating}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">Difficulty</label>
                        <div className="flex gap-1 rounded-lg border border-slate-300 dark:border-slate-300/50 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-50/60 dark:bg-slate-900/60 p-1">
                            {DIFFICULTIES.map((d) => (
                                <button
                                    key={d}
                                    type="button"
                                    disabled={isGenerating}
                                    onClick={() => setDifficulty(d)}
                                    className={`rounded-md px-3 py-1.5 text-xs font-semibold capitalize transition-all ${
                                        difficulty === d
                                            ? `bg-slate-700 ${difficultyColors[d]}`
                                            : 'text-slate-500 hover:text-slate-700 dark:text-slate-300'
                                    }`}
                                >
                                    {d}
                                </button>
                            ))}
                        </div>
                    </div>
                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className="btn-primary flex items-center gap-2 whitespace-nowrap"
                    >
                        {isGenerating ? (
                            <>
                                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                Generating…
                            </>
                        ) : (
                            <>
                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                Generate Questions
                            </>
                        )}
                    </button>
                </div>
            </section>

            {error && (
                <div className="rounded-lg border border-red-500/20 bg-red-950/30 px-4 py-3 text-sm text-red-400 fade-in">
                    {error}
                </div>
            )}

            {/* Loading skeleton */}
            {isGenerating && (
                <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-slate-300 dark:border-slate-300/40 dark:border-slate-700/40 bg-slate-50 dark:bg-slate-50/30 dark:bg-slate-900/30 py-20 fade-in">
                    <span className="h-10 w-10 animate-spin rounded-full border-2 border-cyan-500/30 border-t-cyan-500" />
                    <p className="text-sm text-slate-600 dark:text-slate-400">Generating viva questions…</p>
                    <p className="text-xs text-slate-600">This may take a few seconds</p>
                </div>
            )}

            {!isGenerating && questions.length > 0 && (
                <VivaMode
                    questions={questions}
                    onEvaluate={handleEvaluate}
                    evaluation={evaluation}
                    isEvaluating={isEvaluating}
                />
            )}
        </div>
    );
}
