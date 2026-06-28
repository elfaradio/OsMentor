import React, { useRef, useEffect } from 'react';
import { useScheduler } from '../../hooks/useScheduler';

export default function Timeline() {
    const { currentTime, ganttBlocks } = useScheduler();
    const containerRef = useRef(null);

    // Scale factor: 40px per second tick (must match GanttChart)
    const tickWidth = 40;

    // Find the total execution time
    const totalTime = ganttBlocks.length > 0 
        ? ganttBlocks[ganttBlocks.length - 1].end 
        : 10; // Default fallback to 10 ticks

    const ticks = [];
    for (let i = 0; i <= totalTime; i++) {
        ticks.push(i);
    }

    // Auto-scroll the timeline container to keep the cursor in view
    useEffect(() => {
        if (containerRef.current) {
            const cursorPosition = currentTime * tickWidth;
            const container = containerRef.current;
            const containerWidth = container.clientWidth;
            const scrollLeft = container.scrollLeft;

            if (cursorPosition > scrollLeft + containerWidth - 100) {
                container.scrollTo({
                    left: cursorPosition - containerWidth + 150,
                    behavior: 'smooth'
                });
            } else if (cursorPosition < scrollLeft + 50) {
                container.scrollTo({
                    left: Math.max(0, cursorPosition - 50),
                    behavior: 'smooth'
                });
            }
        }
    }, [currentTime]);

    return (
        <div className="w-full">
            <div className="rounded-lg bg-slate-950/30 p-4 border border-slate-900">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Simulation Timeline</span>
                    <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-900/60 rounded px-2 py-0.5 font-bold">
                        Time: {currentTime}s
                    </span>
                </div>

                {/* Horizontal Timeline Area */}
                <div 
                    ref={containerRef}
                    className="overflow-x-auto pb-4 pt-2 relative scrollbar-thin select-none"
                >
                    <div 
                        className="relative min-w-full h-12"
                        style={{ width: `${totalTime * tickWidth + 60}px` }}
                    >
                        {/* The horizontal ruler line */}
                        <div className="absolute top-6 left-4 right-4 h-0.5 bg-slate-800" />

                        {/* Ticks and labels */}
                        {ticks.map((tick) => {
                            const leftPosition = tick * tickWidth + 16; // Add left offset
                            const isCurrent = tick === currentTime;

                            return (
                                <div
                                    key={tick}
                                    className="absolute flex flex-col items-center top-3 transition-colors duration-200"
                                    style={{ left: `${leftPosition}px`, transform: 'translateX(-50%)' }}
                                >
                                    {/* Tick marker */}
                                    <div 
                                        className={`w-0.5 transition-all duration-200 ${
                                            isCurrent 
                                                ? 'h-4 bg-cyan-400 shadow shadow-cyan-400' 
                                                : tick % 5 === 0 
                                                    ? 'h-3 bg-slate-600' 
                                                    : 'h-1.5 bg-slate-700'
                                        }`}
                                    />
                                    {/* Tick label */}
                                    <span 
                                        className={`text-[10px] font-mono mt-1 font-medium transition-all duration-200 ${
                                            isCurrent ? 'text-cyan-400 font-bold text-xs scale-110' : 'text-slate-600'
                                        }`}
                                    >
                                        {tick}
                                    </span>
                                </div>
                            );
                        })}

                        {/* Sliding vertical time cursor */}
                        {ganttBlocks.length > 0 && (
                            <div
                                className="absolute top-0 bottom-0 w-0.5 bg-cyan-500 z-10 transition-all duration-300 ease-out"
                                style={{
                                    left: `${currentTime * tickWidth + 16}px`,
                                    boxShadow: '0 0 10px rgba(6,182,212,0.8), 0 0 20px rgba(6,182,212,0.4)'
                                }}
                            >
                                {/* Cursor indicator flag */}
                                <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 bg-cyan-500 text-slate-950 text-[9px] font-mono font-bold px-1 py-0.5 rounded shadow-md whitespace-nowrap">
                                    t = {currentTime}s
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
