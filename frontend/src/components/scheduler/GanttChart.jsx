import React from 'react';
import { useScheduler } from '../../hooks/useScheduler';

export default function GanttChart() {
    const { ganttBlocks, totalFrames } = useScheduler();

    // Scale factor: 40px per second tick
    const tickWidth = 40;

    return (
        <div className="w-full">
            <div className="rounded-lg bg-slate-950/30 p-4 border border-slate-900">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Gantt Chart Visualization</span>
                    <span className="text-[9px] text-slate-600 font-mono">Blocks: {ganttBlocks.length}</span>
                </div>

                {/* Horizontal scroll wrapper */}
                <div className="overflow-x-auto pb-2 scrollbar-thin">
                    {ganttBlocks.length === 0 ? (
                        <div className="h-16 flex items-center justify-center text-xs text-slate-600 italic">
                            Simulation not started. Click "Play" or "Step" to run.
                        </div>
                    ) : (
                        <div className="relative min-w-full py-1">
                            {/* Gantt Blocks Container */}
                            <div className="flex items-center h-14 bg-slate-950/90 rounded-lg border border-slate-900 overflow-hidden relative shadow-inner">
                                {ganttBlocks.map((block, idx) => {
                                    const duration = block.end - block.start;
                                    const width = duration * tickWidth;

                                    return (
                                        <div
                                            key={`${block.id}-${block.start}-${idx}`}
                                            className="h-full flex flex-col justify-center items-center font-mono border-r border-slate-950/40 relative group shrink-0 transition-all duration-300"
                                            style={{
                                                width: `${width}px`,
                                                backgroundColor: block.color,
                                                color: block.id === 'idle' ? '#94a3b8' : '#fff'
                                            }}
                                        >
                                            {/* Process label */}
                                            <span className="text-xs font-bold font-sans">
                                                {block.id === 'idle' ? 'IDLE' : block.id}
                                            </span>
                                            {/* Duration label */}
                                            <span className="text-[8px] opacity-75 mt-0.5">
                                                {block.start} - {block.end}
                                            </span>

                                            {/* Block tooltip */}
                                            <div className="absolute bottom-full mb-1 hidden group-hover:block bg-slate-900 border border-slate-800 p-1.5 rounded shadow-xl text-[9px] text-slate-300 font-mono z-30 pointer-events-none whitespace-nowrap">
                                                <p className="font-semibold text-white">{block.id === 'idle' ? 'CPU Idle' : `Process ${block.id}`}</p>
                                                <p>Interval: {block.start}s - {block.end}s</p>
                                                <p>Duration: {duration}s</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
