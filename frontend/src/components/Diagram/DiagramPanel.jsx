import { useState } from 'react';
import MermaidViewer from './MermaidViewer';

const DIAGRAM_TYPES = [
    { 
        value: 'process_state', 
        label: 'Process State', 
        desc: 'Lifecycle stages of a process (Ready, Running, Waiting, etc.)',
        icon: (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H17" />
            </svg>
        )
    },
    { 
        value: 'scheduling_flow', 
        label: 'Scheduling Flow', 
        desc: 'CPU scheduler routing processes between queues and CPU',
        icon: (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
        )
    },
    { 
        value: 'deadlock_graph', 
        label: 'Deadlock Graph', 
        desc: 'Resource Allocation Graph showing circular wait conditions',
        icon: (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
        )
    },
    { 
        value: 'paging_segmentation', 
        label: 'Memory Mapping', 
        desc: 'Logical address to physical address mappings in RAM',
        icon: (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
            </svg>
        )
    },
];

export default function DiagramPanel({ onGenerate, chart, isLoading, error }) {
    const [diagramType, setDiagramType] = useState('process_state');
    const [topic, setTopic] = useState('Operating Systems');

    return (
        <section className="glass-panel p-6 space-y-6">
            <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10 ring-1 ring-indigo-500/30">
                    <svg className="h-4.5 w-4.5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                </div>
                <div>
                    <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Interactive Diagram Generator</h3>
                    <p className="text-xs text-slate-500">Choose a diagram type, enter your target OS concept, and click Generate.</p>
                </div>
            </div>

            {/* Visual Diagram Selector Cards */}
            <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Select Diagram Type</label>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {DIAGRAM_TYPES.map((d) => (
                        <button
                            key={d.value}
                            type="button"
                            onClick={() => setDiagramType(d.value)}
                            className={`group relative text-left p-4 rounded-xl border transition-all duration-300 ${
                                diagramType === d.value
                                    ? 'bg-indigo-600/10 border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.15)] ring-1 ring-indigo-500/30'
                                    : 'bg-slate-900/30 border-slate-700/50 hover:border-slate-600 hover:bg-slate-900/40'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg transition-colors ${
                                    diagramType === d.value 
                                        ? 'bg-indigo-500 text-white' 
                                        : 'bg-slate-800 text-slate-400 group-hover:text-slate-200'
                                }`}>
                                    {d.icon}
                                </div>
                                <div>
                                    <h4 className={`text-sm font-semibold transition-colors ${
                                        diagramType === d.value ? 'text-indigo-400' : 'text-slate-200'
                                    }`}>
                                        {d.label}
                                    </h4>
                                </div>
                            </div>
                            <p className="mt-2.5 text-xs text-slate-400 leading-normal line-clamp-2">
                                {d.desc}
                            </p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Concept Input and Generate Action */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <div className="flex-1 space-y-1">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Concept / Topic</label>
                    <input
                        className="input-field"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="e.g. CPU Scheduling, Inverted Page Table, Deadlock..."
                    />
                </div>
                <div className="flex items-end min-w-[160px]">
                    <button
                        className="btn-primary flex items-center gap-2 w-full justify-center py-2.5 transition-all duration-200 active:scale-[0.98]"
                        disabled={isLoading}
                        onClick={() => onGenerate({ diagram_type: diagramType, topic })}
                    >
                        {isLoading ? (
                            <>
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                Generating…
                            </>
                        ) : (
                            <>
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                Generate Diagram
                            </>
                        )}
                    </button>
                </div>
            </div>

            {error && (
                <div className="rounded-lg border border-red-500/20 bg-red-950/30 px-4 py-3 text-sm text-red-400 fade-in">
                    {error}
                </div>
            )}

            {(chart || isLoading) && (
                <div className="fade-in">
                    <MermaidViewer chart={chart} isLoading={isLoading} />
                </div>
            )}
        </section>
    );
}
