import React from 'react';
import { useScheduler } from '../../hooks/useScheduler';
import { getProcessColor } from '../../utils/scheduler/helpers';

export default function ProcessTable() {
    const {
        processes,
        setProcesses,
        addProcess,
        deleteProcess,
        generateRandom,
        simulationState,
        validationError,
    } = useScheduler();

    const handleFieldChange = (id, field, val) => {
        const value = val === '' ? '' : parseInt(val);
        const updated = processes.map((p) => {
            if (p.id === id) {
                return { ...p, [field]: value };
            }
            return p;
        });
        setProcesses(updated);
    };

    const handleAdd = () => {
        // Find next process number
        let maxNum = 0;
        processes.forEach((p) => {
            const match = String(p.id).match(/^P(\d+)$/);
            if (match) {
                maxNum = Math.max(maxNum, parseInt(match[1]));
            }
        });
        const nextId = `P${maxNum + 1}`;
        const nextIndex = processes.length;

        addProcess({
            id: nextId,
            arrivalTime: 0,
            burstTime: 5,
            priority: 1,
            remainingTime: 5,
            completionTime: 0,
            waitingTime: 0,
            turnaroundTime: 0,
            responseTime: -1,
            state: 'not_arrived',
            color: getProcessColor(nextIndex),
        });
    };

    const handleClearAll = () => {
        setProcesses([]);
    };

    const handleReset = () => {
        generateRandom(5);
    };

    return (
        <div className="space-y-4">
            {/* Validation Error Message */}
            {validationError && (
                <div 
                    className="flex items-center gap-2.5 rounded-lg px-4 py-2.5 text-xs text-rose-400"
                    style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.18)' }}
                >
                    <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>{validationError}</span>
                </div>
            )}

            {/* Scrollable Container */}
            <div className="overflow-x-auto rounded-lg border border-slate-800/80 bg-slate-950/40">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th className="w-16">Color</th>
                            <th className="w-20">PID</th>
                            <th>Arrival Time</th>
                            <th>Burst Time</th>
                            <th>Priority</th>
                            <th className="w-16 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {processes.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center py-6 text-slate-500 italic">
                                    No processes added. Click "+ Add Process" or "Generate Random".
                                </td>
                            </tr>
                        ) : (
                            processes.map((p) => (
                                <tr key={p.id} className="transition-colors hover:bg-slate-900/30">
                                    <td className="align-middle py-2 pl-4">
                                        <div
                                            className="h-3.5 w-3.5 rounded-full border border-slate-700/60 shadow-sm"
                                            style={{ backgroundColor: p.color, boxShadow: `0 0 6px ${p.color}40` }}
                                        />
                                    </td>
                                    <td className="align-middle py-2 font-mono font-semibold text-slate-300">
                                        {p.id}
                                    </td>
                                    <td className="align-middle py-2">
                                        <input
                                            type="number"
                                            min="0"
                                            className="input-field py-1 px-2 text-xs font-mono w-24 bg-slate-950/70 border-slate-800/60"
                                            value={p.arrivalTime}
                                            onChange={(e) => handleFieldChange(p.id, 'arrivalTime', e.target.value)}
                                            disabled={simulationState === 'running'}
                                        />
                                    </td>
                                    <td className="align-middle py-2">
                                        <input
                                            type="number"
                                            min="1"
                                            className="input-field py-1 px-2 text-xs font-mono w-24 bg-slate-950/70 border-slate-800/60"
                                            value={p.burstTime}
                                            onChange={(e) => handleFieldChange(p.id, 'burstTime', e.target.value)}
                                            disabled={simulationState === 'running'}
                                        />
                                    </td>
                                    <td className="align-middle py-2">
                                        <input
                                            type="number"
                                            min="0"
                                            className="input-field py-1 px-2 text-xs font-mono w-24 bg-slate-950/70 border-slate-800/60"
                                            value={p.priority}
                                            onChange={(e) => handleFieldChange(p.id, 'priority', e.target.value)}
                                            disabled={simulationState === 'running'}
                                        />
                                    </td>
                                    <td className="align-middle py-2 text-center">
                                        <button
                                            type="button"
                                            className="text-slate-500 hover:text-rose-400 p-1.5 rounded-md hover:bg-rose-500/10 transition-colors"
                                            onClick={() => deleteProcess(p.id)}
                                            disabled={simulationState === 'running'}
                                            title="Delete process"
                                        >
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
                <button
                    type="button"
                    className="btn-primary py-2 px-3 text-xs"
                    onClick={handleAdd}
                    disabled={simulationState === 'running'}
                >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Add Process
                </button>

                <button
                    type="button"
                    className="btn-secondary py-2 px-3 text-xs"
                    onClick={handleReset}
                    disabled={simulationState === 'running'}
                >
                    Reset List
                </button>

                <button
                    type="button"
                    className="btn-secondary py-2 px-3 text-xs text-rose-500 hover:text-rose-400 border-rose-950 hover:bg-rose-950/20"
                    onClick={handleClearAll}
                    disabled={simulationState === 'running'}
                >
                    Clear All
                </button>
            </div>
        </div>
    );
}
