import React from 'react';
import { SchedulerProvider } from '../context/SchedulerContext';
import SimulationControls from '../components/scheduler/SimulationControls';
import ProcessTable from '../components/scheduler/ProcessTable';
import SimulationCanvas from '../components/scheduler/SimulationCanvas';
import Timeline from '../components/scheduler/Timeline';
import GanttChart from '../components/scheduler/GanttChart';
import StatisticsCards from '../components/scheduler/StatisticsCards';
import AIExplanationCard from '../components/scheduler/AIExplanationCard';

function PageHeader() {
    return (
        <div className="fade-in">
            <div className="flex items-center gap-3 mb-1">
                <div
                    className="flex h-9 w-9 items-center justify-center rounded-xl"
                    style={{ background: 'linear-gradient(135deg,#0891b2,#0ea5e9)', boxShadow: '0 0 16px rgba(6,182,212,0.25)' }}
                >
                    {/* Inline CPU Icon */}
                    <svg className="h-4.5 w-4.5 text-slate-900 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ width: '1.125rem', height: '1.125rem' }}>
                        <rect width="16" height="16" x="4" y="4" rx="2" />
                        <rect width="6" height="6" x="9" y="9" rx="1" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 15h3M1 9h3M1 15h3" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold gradient-text tracking-tight">Visualize Scheduling Algorithms</h2>
            </div>
            <p className="text-sm text-slate-500 ml-12">Interactive CPU Scheduling Simulator. Customize processes, run simulations, and analyze metrics.</p>
        </div>
    );
}

export default function SchedulerPage() {
    return (
        <SchedulerProvider>
            <div className="space-y-6 fade-in pb-10">
                {/* Header */}
                <PageHeader />

                {/* Grid row 1: Controls & Process Table */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.8fr] gap-6 items-start">
                    {/* Card 1: Simulation Controls */}
                    <div className="glass-panel p-5">
                        <div className="flex items-center gap-2.5 mb-4">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-950/40 text-cyan-400 border border-cyan-900/60 shadow">
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                                </svg>
                            </span>
                            <div>
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-none">Simulation Controls</h3>
                                <p className="text-[10px] text-slate-500 mt-1 leading-none">Select algorithms and playback speeds</p>
                            </div>
                        </div>
                        <SimulationControls />
                    </div>

                    {/* Card 2: Process Table */}
                    <div className="glass-panel p-5">
                        <div className="flex items-center gap-2.5 mb-4">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-950/40 text-indigo-400 border border-indigo-900/60 shadow">
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </span>
                            <div>
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-none">Editable Process Table</h3>
                                <p className="text-[10px] text-slate-500 mt-1 leading-none">Manage workload parameters and burst times</p>
                            </div>
                        </div>
                        <ProcessTable />
                    </div>
                </div>

                {/* Card 3: CPU Simulation Canvas (queues & CPU bubble) */}
                <SimulationCanvas />

                {/* Card 4: Timeline */}
                <Timeline />

                {/* Card 5: Gantt Chart */}
                <GanttChart />

                {/* Card 6: Statistics Cards */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2.5">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-950/40 text-emerald-400 border border-emerald-900/60 shadow animate-pulse">
                            <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </span>
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-none">Performance Statistics</h3>
                            <p className="text-[10px] text-slate-500 mt-1 leading-none">Calculated execution efficiency indicators</p>
                        </div>
                    </div>
                    <StatisticsCards />
                </div>

                {/* Future AI integration point card */}
                <AIExplanationCard />
            </div>
        </SchedulerProvider>
    );
}
