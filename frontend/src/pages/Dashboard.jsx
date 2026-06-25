import { useState } from 'react';
import DiagramPanel from '../components/Diagram/DiagramPanel';
import { compareConcepts, generateDiagram } from '../services/ragService';

function PageHeader() {
    return (
        <div className="fade-in">
            <div className="flex items-center gap-3 mb-1">
                <div
                    className="flex h-9 w-9 items-center justify-center rounded-xl"
                    style={{ background: 'linear-gradient(135deg,#0891b2,#0ea5e9)', boxShadow: '0 0 16px rgba(6,182,212,0.25)' }}
                >
                    <svg className="h-4.5 w-4.5 text-slate-900 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ width: '1.125rem', height: '1.125rem' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold gradient-text tracking-tight">Study Tools</h2>
            </div>
            <p className="text-sm text-slate-500 ml-12">Compare OS concepts side-by-side and visualize them with AI-generated diagrams.</p>
        </div>
    );
}

export default function Dashboard() {
    const [conceptA, setConceptA] = useState('Paging');
    const [conceptB, setConceptB] = useState('Segmentation');
    const [comparison, setComparison] = useState(null);
    const [diagram, setDiagram] = useState('');
    const [isComparing, setIsComparing] = useState(false);
    const [isDiagramLoading, setIsDiagramLoading] = useState(false);
    const [compareError, setCompareError] = useState(null);

    const runCompare = async () => {
        if (!conceptA.trim() || !conceptB.trim()) return;
        setIsComparing(true);
        setCompareError(null);
        try {
            const response = await compareConcepts({ concept_a: conceptA.trim(), concept_b: conceptB.trim() });
            setComparison(response);
        } catch {
            setCompareError('Failed to compare concepts. Please try again.');
        } finally {
            setIsComparing(false);
        }
    };

    const runDiagram = async (payload) => {
        setIsDiagramLoading(true);
        setDiagram('');
        try {
            const response = await generateDiagram(payload);
            setDiagram(response.mermaid);
        } finally {
            setIsDiagramLoading(false);
        }
    };

    return (
        <div className="space-y-6 fade-in">
            <PageHeader />

            {/* ── Concept Comparison ─────────────────────── */}
            <section className="glass-panel p-6 space-y-5">
                {/* Section header */}
                <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)' }}>
                        <svg className="h-4 w-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Concept Comparison</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Enter two OS concepts to compare them in a structured table</p>
                    </div>
                </div>

                {/* Inputs */}
                <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
                    <div>
                        <label className="field-label">Concept A</label>
                        <input className="input-field" value={conceptA} onChange={(e) => setConceptA(e.target.value)} placeholder="e.g. Paging" />
                    </div>
                    <div>
                        <label className="field-label">Concept B</label>
                        <input className="input-field" value={conceptB} onChange={(e) => setConceptB(e.target.value)} placeholder="e.g. Segmentation" />
                    </div>
                    <div className="flex items-end">
                        <button onClick={runCompare} disabled={isComparing} className="btn-primary w-full justify-center gap-2">
                            {isComparing ? (
                                <>
                                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                    Comparing…
                                </>
                            ) : (
                                <>
                                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    Compare
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {compareError && (
                    <div className="rounded-lg border border-red-500/20 bg-red-950/30 px-4 py-3 text-sm text-red-400 fade-in">
                        {compareError}
                    </div>
                )}

                {isComparing && (
                    <div className="flex flex-col items-center gap-3 py-12 fade-in">
                        <span className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-500/30 border-t-cyan-500" />
                        <p className="text-sm text-slate-500">Generating comparison…</p>
                    </div>
                )}

                {comparison && !isComparing && (
                    <div className="fade-in overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(51,65,85,0.4)' }}>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th className="text-slate-500">Aspect</th>
                                    <th className="text-cyan-400">{comparison.concept_a}</th>
                                    <th className="text-indigo-400">{comparison.concept_b}</th>
                                </tr>
                            </thead>
                            <tbody className="stagger">
                                {comparison.rows.map((row, i) => (
                                    <tr
                                        key={row.aspect}
                                        className={`fade-in ${i % 2 !== 0 ? 'bg-slate-200 dark:bg-slate-800/10' : ''}`}
                                    >
                                        <td className="font-medium text-slate-800 dark:text-slate-200">{row.aspect}</td>
                                        <td>{row.concept_a}</td>
                                        <td>{row.concept_b}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            <DiagramPanel onGenerate={runDiagram} chart={diagram} isLoading={isDiagramLoading} />
        </div>
    );
}
