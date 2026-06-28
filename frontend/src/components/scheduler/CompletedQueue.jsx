import React from 'react';
import { useScheduler } from '../../hooks/useScheduler';

export default function CompletedQueue() {
    const { completedQueue } = useScheduler();

    return (
        <div className="w-full">
            <div className="rounded-lg bg-slate-950/30 p-3 border border-slate-900 min-h-24">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-emerald-500 tracking-wider uppercase">Completed Processes</span>
                    <span className="text-[9px] text-slate-600 font-mono">Count: {completedQueue.length}</span>
                </div>
                <div className="flex items-center gap-2.5 overflow-x-auto py-1 scrollbar-thin">
                    {completedQueue.length === 0 ? (
                        <span className="text-xs text-slate-600 italic py-4 pl-1">No completed processes yet</span>
                    ) : (
                        completedQueue.map((p) => (
                            <div
                                key={p.id}
                                className="flex flex-col p-2.5 rounded-lg border border-slate-800/80 bg-slate-950/70 w-32 shrink-0 animate-fade-in"
                                style={{ borderLeft: `3.5px solid ${p.color}` }}
                            >
                                <div className="flex items-center justify-between mb-1.5 border-b border-slate-900 pb-1">
                                    <span className="text-xs font-bold text-slate-200 font-mono">{p.id}</span>
                                    <span className="chip chip-green text-[8px] py-0 px-1">Done</span>
                                </div>
                                <div className="space-y-0.5 text-[10px] text-slate-400 font-mono">
                                    <div className="flex justify-between">
                                        <span className="text-slate-600">CT:</span>
                                        <span className="text-slate-300 font-semibold">{p.completionTime}s</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-600">TAT:</span>
                                        <span className="text-slate-300 font-semibold">{p.turnaroundTime}s</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-600">WT:</span>
                                        <span className="text-slate-300 font-semibold">{p.waitingTime}s</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-600">RT:</span>
                                        <span className="text-slate-300 font-semibold">{p.responseTime}s</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
