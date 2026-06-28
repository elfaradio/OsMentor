import React, { useState } from 'react';
import { useScheduler } from '../../hooks/useScheduler';

export default function AIExplanationCard() {
    const { algorithm, processes, liveStatistics, ganttBlocks } = useScheduler();
    const [loading, setLoading] = useState(false);
    const [explanation, setExplanation] = useState(null);

    const handleExplainWithAI = () => {
        setLoading(true);
        setExplanation(null);

        // Prep the payload that would be sent to the OsMentor RAG backend endpoint
        const payload = {
            algorithm,
            inputProcesses: processes.map(p => ({
                id: p.id,
                arrivalTime: p.arrivalTime,
                burstTime: p.burstTime,
                priority: p.priority
            })),
            simulationResult: {
                statistics: liveStatistics,
                ganttBlocks: ganttBlocks
            }
        };

        // Log the payload to console to verify the clean hook integration point
        console.log('AI Explanation requested. Payload prepared for RAG backend:', payload);

        // Mock a 1.5s latency call to simulate the AI response
        setTimeout(() => {
            setLoading(false);
            setExplanation(
                `Here is the step-by-step scheduling analysis for **${algorithm.toUpperCase()}**:\n\n` +
                `1. **Process Arrivals**: Processes arrived at their respective times. The scheduling order was determined strictly based on the ${algorithm.toUpperCase()} policy rules.\n` +
                `2. **Context Switching**: There were **${liveStatistics.contextSwitches}** context switches during execution.\n` +
                `3. **Key Performance Metrics**: \n` +
                `   - Average Waiting Time (AWT) is **${liveStatistics.avgWaitingTime}s**.\n` +
                `   - CPU Utilization is **${liveStatistics.cpuUtilization}%**.\n\n` +
                `*(Note: This is a placeholder showing the backend integration hook payload. In production, this data is sent to the FastAPI RAG tutor to generate textbook-referenced reasoning.)*`
            );
        }, 1500);
    };

    return (
        <div className="glass-panel p-5 relative overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-3 mb-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-950/40 text-indigo-400 border border-indigo-900/60 shadow">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                </span>
                <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-none">Explain with AI</h3>
                    <p className="text-[10px] text-slate-500 mt-1 leading-none">RAG-powered textbook tutor analysis</p>
                </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Analyze the completed simulation and get a detailed pedagogical breakdown of the CPU scheduling decisions, starvation factors, and efficiency trade-offs.
            </p>

            {/* Action */}
            {!explanation && !loading && (
                <button
                    type="button"
                    className="btn-primary w-full py-2.5 flex items-center justify-center gap-2"
                    onClick={handleExplainWithAI}
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Explain scheduling decision
                </button>
            )}

            {/* Loading Shimmer */}
            {loading && (
                <div className="space-y-2 mt-2 animate-pulse">
                    <div className="h-3.5 bg-slate-800 rounded w-3/4 shimmer" />
                    <div className="h-3.5 bg-slate-800 rounded w-full shimmer" />
                    <div className="h-3.5 bg-slate-800 rounded w-5/6 shimmer" />
                </div>
            )}

            {/* Explanation Result */}
            {explanation && !loading && (
                <div className="mt-4 p-3 rounded-lg border border-slate-800 bg-slate-950/70 text-xs text-slate-300 space-y-3 animate-fade-in">
                    <div className="prose-answer font-sans whitespace-pre-line text-slate-300">
                        {explanation}
                    </div>
                    <button
                        type="button"
                        className="btn-ghost text-[10px] py-1 text-slate-400 hover:text-slate-200 mt-2"
                        onClick={() => setExplanation(null)}
                    >
                        Clear explanation
                    </button>
                </div>
            )}
        </div>
    );
}
