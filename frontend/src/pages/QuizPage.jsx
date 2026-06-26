import { useMemo, useState } from 'react';
import QuizCard from '../components/Quiz/QuizCard';
import QuizGenerator from '../components/Quiz/QuizGenerator';
import { generateQuiz, submitQuiz } from '../services/ragService';

function ScoreBadge({ score }) {
    const cls = score >= 70 ? 'score-high' : score >= 40 ? 'score-mid' : 'score-low';
    return (
        <div className={`score-badge ${cls}`}>
            {score}%
        </div>
    );
}

export default function QuizPage() {
    const [quiz, setQuiz] = useState(null);
    const [answers, setAnswers] = useState({});
    const [result, setResult] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const items = useMemo(() => (quiz ? [...quiz.mcq, ...quiz.short_questions] : []), [quiz]);

    const handleGenerate = async (payload) => {
        setIsGenerating(true);
        setError(null);
        setResult(null);
        setQuiz(null);
        setAnswers({});
        try {
            const response = await generateQuiz(payload);
            setQuiz(response);
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to generate quiz. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const answerList = items.map((_, i) => answers[i] || '');
            const key = items.map((item) => item.answer);
            const response = await submitQuiz({ answers: answerList, answer_key: key });
            setResult(response);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to submit quiz. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const answeredCount = Object.values(answers).filter(Boolean).length;

    return (
        <div className="space-y-6 fade-in">
            {/* Page header */}
            <div className="flex items-center gap-3">
                <div
                    className="flex h-9 w-9 items-center justify-center rounded-xl"
                    style={{ background: 'linear-gradient(135deg,#7c3aed,#9333ea)', boxShadow: '0 0 16px rgba(139,92,246,0.25)' }}
                >
                    <svg className="h-4.5 w-4.5 text-slate-900 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ width: '1.125rem', height: '1.125rem' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
                <div>
                    <h2 className="text-2xl font-bold gradient-text tracking-tight">Quiz Mode</h2>
                    <p className="text-sm text-slate-500 mt-0.5">AI-generated MCQ and short answer questions with instant feedback.</p>
                </div>
            </div>

            <QuizGenerator onGenerate={handleGenerate} isLoading={isGenerating} />

            {error && (
                <div className="rounded-lg border border-red-500/20 bg-red-950/30 px-4 py-3 text-sm text-red-400 fade-in">
                    {error}
                </div>
            )}

            {isGenerating && (
                <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-slate-300 dark:border-slate-300/40 dark:border-slate-700/40 bg-slate-50 dark:bg-slate-50/30 dark:bg-slate-900/30 py-20 fade-in">
                    <span className="h-10 w-10 animate-spin rounded-full border-2 border-cyan-500/30 border-t-cyan-500" />
                    <p className="text-sm text-slate-600 dark:text-slate-400">Generating your quiz…</p>
                    <p className="text-xs text-slate-600">This may take a few seconds</p>
                </div>
            )}

            {/* Result card */}
            {result && (
                <div className="glass-panel p-6 fade-in">
                    <div className="flex items-start gap-5">
                        <ScoreBadge score={result.score} />
                        <div className="flex-1">
                            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                                {result.score >= 70 ? '🎉 Great job!' : result.score >= 40 ? '📚 Keep studying!' : '💪 Keep practicing!'}
                            </p>
                            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{result.feedback}</p>
                        </div>
                    </div>
                    <hr className="divider" />
                    <button
                        onClick={() => { setResult(null); setQuiz(null); setAnswers({}); }}
                        className="btn-secondary text-sm"
                    >
                        Try Another Quiz
                    </button>
                </div>
            )}

            {/* Quiz questions */}
            {items.length > 0 && !isGenerating && (
                <div className="space-y-3 stagger">
                    {items.map((item, index) => (
                        <div key={index} className="fade-in">
                            <QuizCard
                                item={item}
                                index={index}
                                answer={answers[index]}
                                onChange={(value) => setAnswers((prev) => ({ ...prev, [index]: value }))}
                                showAnswer={!!result}
                            />
                        </div>
                    ))}

                    <div className="pt-2 flex items-center justify-between">
                        <p className="text-sm text-slate-500">
                            {answeredCount} / {items.length} answered
                        </p>
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting || answeredCount === 0}
                            className="btn-primary flex items-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                    Evaluating…
                                </>
                            ) : (
                                <>
                                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Submit Quiz
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
