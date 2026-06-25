import { useState } from 'react';
import MermaidViewer from './MermaidViewer';

const DIAGRAM_TYPES = [
    { value: 'process_state', label: 'Process State' },
    { value: 'scheduling_flow', label: 'Scheduling Flow' },
    { value: 'deadlock_graph', label: 'Deadlock Graph' },
    { value: 'paging_segmentation', label: 'Paging & Segmentation' },
];

export default function DiagramPanel({ onGenerate, chart, isLoading }) {
    const [diagramType, setDiagramType] = useState('process_state');
    const [topic, setTopic] = useState('Operating Systems');

    return (
        <section className="glass-panel p-6 space-y-5">
            <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10 ring-1 ring-indigo-500/30">
                    <svg className="h-4 w-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                </div>
                <div>
                    <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Diagram Generator</h3>
                    <p className="text-xs text-slate-500">Generate Mermaid diagrams for any OS concept</p>
                </div>
            </div>

            <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
                <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">Diagram Type</label>
                    <select
                        className="input-field"
                        value={diagramType}
                        onChange={(e) => setDiagramType(e.target.value)}
                    >
                        {DIAGRAM_TYPES.map((d) => (
                            <option key={d.value} value={d.value}>{d.label}</option>
                        ))}
                    </select>
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">Topic</label>
                    <input
                        className="input-field"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="e.g. CPU Scheduling"
                    />
                </div>
                <div className="flex items-end">
                    <button
                        className="btn-primary flex items-center gap-2 w-full justify-center"
                        disabled={isLoading}
                        onClick={() => onGenerate({ diagram_type: diagramType, topic })}
                    >
                        {isLoading ? (
                            <>
                                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                Generating…
                            </>
                        ) : (
                            <>
                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Generate
                            </>
                        )}
                    </button>
                </div>
            </div>

            {(chart || isLoading) && (
                <div className="fade-in">
                    <MermaidViewer chart={chart} isLoading={isLoading} />
                </div>
            )}
        </section>
    );
}
