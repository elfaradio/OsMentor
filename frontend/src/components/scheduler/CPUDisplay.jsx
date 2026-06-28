import React from 'react';
import { useScheduler } from '../../hooks/useScheduler';

export default function CPUDisplay() {
    const { cpuProcess, cpuQueueType, currentTime } = useScheduler();

    const percentage = cpuProcess
        ? ((cpuProcess.burstTime - cpuProcess.remainingTime) / cpuProcess.burstTime) * 100
        : 0;

    return (
        <div className="flex flex-col items-center justify-center p-4 border border-slate-800 rounded-xl bg-slate-950/60 shadow-inner h-full min-w-48 relative overflow-hidden">
            {/* Background glowing effect when active */}
            {cpuProcess && (
                <div
                    className="absolute inset-0 opacity-5 blur-2xl transition-all duration-300"
                    style={{ backgroundColor: cpuProcess.color }}
                />
            )}

            <div className="flex items-center gap-2 mb-4">
                <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">CPU State</span>
                <span className="text-[10px] font-mono text-slate-600 bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5">
                    Tick: {currentTime}
                </span>
            </div>

            {cpuProcess ? (
                <div className="w-full flex flex-col items-center text-center animate-fade-in space-y-3.5">
                    {/* Process bubble */}
                    <div
                        className="flex items-center justify-center h-20 w-20 rounded-full border border-slate-700/60 shadow-lg text-slate-900 font-bold text-2xl relative transition-transform duration-200 transform scale-105"
                        style={{
                            background: `linear-gradient(135deg, ${cpuProcess.color}d0 0%, ${cpuProcess.color}ff 100%)`,
                            boxShadow: `0 0 25px ${cpuProcess.color}5c`,
                            textShadow: '0 1px 2px rgba(0,0,0,0.2)'
                        }}
                    >
                        <span className="font-mono text-white leading-none">{cpuProcess.id}</span>
                    </div>

                    <div className="space-y-1">
                        <span className="chip chip-cyan text-[10px]">Running</span>
                        {cpuQueueType && (
                            <span 
                                className="ml-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded border font-mono"
                                style={{
                                    borderColor: cpuQueueType === 'q1' ? 'rgba(34,211,238,0.2)' : cpuQueueType === 'q2' ? 'rgba(129,140,248,0.2)' : 'rgba(74,222,128,0.2)',
                                    color: cpuQueueType === 'q1' ? '#22d3ee' : cpuQueueType === 'q2' ? '#818cf8' : '#4ade80',
                                    background: 'rgba(15,23,42,0.6)'
                                }}
                            >
                                Queue: {cpuQueueType.toUpperCase()}
                            </span>
                        )}
                    </div>

                    {/* Progress details */}
                    <div className="w-full space-y-1 px-2">
                        <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                            <span>Progress</span>
                            <span>{cpuProcess.burstTime - cpuProcess.remainingTime} / {cpuProcess.burstTime} BT</span>
                        </div>
                        {/* Progress Bar Container */}
                        <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                            <div
                                className="h-full rounded-full transition-all duration-300"
                                style={{
                                    width: `${percentage}%`,
                                    backgroundColor: cpuProcess.color
                                }}
                            />
                        </div>
                    </div>

                    {/* Meta info */}
                    <div className="grid grid-cols-2 gap-3 w-full border-t border-slate-900 pt-3 text-[10px] text-slate-400">
                        <div className="text-left">
                            <span className="text-[9px] text-slate-600 block">PRIORITY</span>
                            <span className="font-semibold text-slate-300 font-mono">{cpuProcess.priority}</span>
                        </div>
                        <div className="text-right">
                            <span className="text-[9px] text-slate-600 block">REMAINING</span>
                            <span className="font-semibold text-slate-300 font-mono">{cpuProcess.remainingTime}s</span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-6 text-slate-600 space-y-3.5 select-none">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full border border-slate-800 bg-slate-900/40 shadow-inner">
                        <svg className="h-6 w-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <div className="space-y-0.5 text-center">
                        <p className="text-sm font-semibold text-slate-500">CPU IDLE</p>
                        <p className="text-[10px] text-slate-700">Waiting for processes...</p>
                    </div>
                </div>
            )}
        </div>
    );
}
