import React from 'react';
import { useScheduler } from '../../hooks/useScheduler';
import { ALGORITHMS } from '../../utils/scheduler/types';

export default function ReadyQueue() {
    const { readyQueue, algorithm, q1, q2, q3 } = useScheduler();

    const isMLQ = algorithm === ALGORITHMS.MLQ;
    const isMLFQ = algorithm === ALGORITHMS.MLFQ;

    // Helper to render process card inside a queue
    const renderProcessItem = (p) => (
        <div
            key={p.id}
            className="flex flex-col items-center justify-center h-12 w-12 rounded-lg border border-slate-700/60 shadow-sm shrink-0 select-none animate-fade-in relative group"
            style={{
                background: `linear-gradient(135deg, rgba(15,23,42,0.8) 0%, rgba(30,41,59,0.7) 100%)`,
                borderLeft: `3px solid ${p.color}`,
                boxShadow: `0 0 10px ${p.color}1c`
            }}
        >
            <span className="text-xs font-mono font-bold text-slate-200">{p.id}</span>
            <span className="text-[9px] font-mono text-slate-500 mt-0.5">Rem: {p.remainingTime}</span>

            {/* Hover Tooltip */}
            <div className="absolute bottom-full mb-1.5 hidden group-hover:flex flex-col bg-slate-900 border border-slate-700/70 p-2 rounded shadow-xl text-[10px] w-28 z-20 pointer-events-none">
                <p className="font-semibold text-slate-200 font-mono">{p.id}</p>
                <p className="text-slate-400">Arrival: {p.arrivalTime}</p>
                <p className="text-slate-400">Burst: {p.burstTime}</p>
                <p className="text-slate-400">Priority: {p.priority}</p>
            </div>
        </div>
    );

    if (isMLQ) {
        return (
            <div className="space-y-3 flex-1 min-w-0">
                {/* Queue 1 */}
                <div className="rounded-lg bg-slate-950/30 p-2 border border-slate-900">
                    <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-bold text-cyan-400 tracking-wider uppercase">Queue 1 (High Priority - RR, Q=2)</span>
                        <span className="text-[9px] text-slate-600 font-mono">Count: {q1.length}</span>
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto min-h-14 py-1 scrollbar-thin">
                        {q1.length === 0 ? (
                            <span className="text-xs text-slate-600 italic py-2 pl-1">Queue empty</span>
                        ) : (
                            q1.map(renderProcessItem)
                        )}
                    </div>
                </div>

                {/* Queue 2 */}
                <div className="rounded-lg bg-slate-950/30 p-2 border border-slate-900">
                    <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-bold text-indigo-400 tracking-wider uppercase">Queue 2 (Low Priority - FCFS)</span>
                        <span className="text-[9px] text-slate-600 font-mono">Count: {q2.length}</span>
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto min-h-14 py-1 scrollbar-thin">
                        {q2.length === 0 ? (
                            <span className="text-xs text-slate-600 italic py-2 pl-1">Queue empty</span>
                        ) : (
                            q2.map(renderProcessItem)
                        )}
                    </div>
                </div>
            </div>
        );
    }

    if (isMLFQ) {
        return (
            <div className="space-y-3 flex-1 min-w-0">
                {/* Q1 */}
                <div className="rounded-lg bg-slate-950/30 p-2 border border-slate-900">
                    <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-bold text-cyan-400 tracking-wider uppercase">Q1 (High - RR, Q=2)</span>
                        <span className="text-[9px] text-slate-600 font-mono">Count: {q1.length}</span>
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto min-h-14 py-1 scrollbar-thin">
                        {q1.length === 0 ? (
                            <span className="text-xs text-slate-600 italic py-2 pl-1">Queue empty</span>
                        ) : (
                            q1.map(renderProcessItem)
                        )}
                    </div>
                </div>

                {/* Q2 */}
                <div className="rounded-lg bg-slate-950/30 p-2 border border-slate-900">
                    <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-bold text-indigo-400 tracking-wider uppercase">Q2 (Medium - RR, Q=4)</span>
                        <span className="text-[9px] text-slate-600 font-mono">Count: {q2.length}</span>
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto min-h-14 py-1 scrollbar-thin">
                        {q2.length === 0 ? (
                            <span className="text-xs text-slate-600 italic py-2 pl-1">Queue empty</span>
                        ) : (
                            q2.map(renderProcessItem)
                        )}
                    </div>
                </div>

                {/* Q3 */}
                <div className="rounded-lg bg-slate-950/30 p-2 border border-slate-900">
                    <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-bold text-emerald-400 tracking-wider uppercase">Q3 (Low - FCFS)</span>
                        <span className="text-[9px] text-slate-600 font-mono">Count: {q3.length}</span>
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto min-h-14 py-1 scrollbar-thin">
                        {q3.length === 0 ? (
                            <span className="text-xs text-slate-600 italic py-2 pl-1">Queue empty</span>
                        ) : (
                            q3.map(renderProcessItem)
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // Default Single Ready Queue
    return (
        <div className="flex-1 min-w-0">
            <div className="rounded-lg bg-slate-950/30 p-3 border border-slate-900 h-full flex flex-col justify-center">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Ready Queue (FIFO order)</span>
                    <span className="text-[9px] text-slate-600 font-mono">Waiting: {readyQueue.length}</span>
                </div>
                <div className="flex items-center gap-2.5 overflow-x-auto min-h-16 py-1.5 scrollbar-thin">
                    {readyQueue.length === 0 ? (
                        <span className="text-xs text-slate-600 italic py-2 pl-1">No processes in ready queue</span>
                    ) : (
                        readyQueue.map(renderProcessItem)
                    )}
                </div>
            </div>
        </div>
    );
}
