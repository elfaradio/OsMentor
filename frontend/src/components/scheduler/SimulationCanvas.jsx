import React from 'react';
import CPUDisplay from './CPUDisplay';
import ReadyQueue from './ReadyQueue';
import CompletedQueue from './CompletedQueue';

export default function SimulationCanvas() {
    return (
        <div className="glass-panel p-5 space-y-5">
            <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-none">CPU Simulation Canvas</h3>
                <p className="text-[10px] text-slate-500 mt-1 leading-none">Live execution flow and queue state transitions</p>
            </div>

            {/* Layout Grid: CPU and Ready Queue side-by-side */}
            <div className="flex flex-col md:flex-row gap-5">
                {/* CPU Display Column */}
                <div className="md:w-1/3 min-w-48">
                    <CPUDisplay />
                </div>

                {/* Ready Queue Column */}
                <div className="flex-1 min-w-0">
                    <ReadyQueue />
                </div>
            </div>

            {/* Completed Queue row at the bottom */}
            <div className="w-full">
                <CompletedQueue />
            </div>
        </div>
    );
}
