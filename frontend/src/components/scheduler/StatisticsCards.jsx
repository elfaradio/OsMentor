import React from 'react';
import { useScheduler } from '../../hooks/useScheduler';

export default function StatisticsCards() {
    const { liveStatistics } = useScheduler();

    const stats = [
        {
            title: 'Average Waiting Time',
            value: `${liveStatistics.avgWaitingTime}s`,
            desc: 'Average time processes wait in Ready Queue.',
            formula: 'AWT = ∑(WT) / N',
            color: 'text-cyan-400',
            glow: 'rgba(6,182,212,0.15)',
            icon: (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        },
        {
            title: 'Average Turnaround Time',
            value: `${liveStatistics.avgTurnaroundTime}s`,
            desc: 'Average total duration from arrival to completion.',
            formula: 'ATAT = ∑(TAT) / N',
            color: 'text-indigo-400',
            glow: 'rgba(99,102,241,0.15)',
            icon: (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            )
        },
        {
            title: 'Average Response Time',
            value: `${liveStatistics.avgResponseTime}s`,
            desc: 'Average time from arrival to first CPU allocation.',
            formula: 'ART = ∑(RT) / N',
            color: 'text-violet-400',
            glow: 'rgba(139,92,246,0.15)',
            icon: (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            )
        },
        {
            title: 'CPU Utilization',
            value: `${liveStatistics.cpuUtilization}%`,
            desc: 'Percentage of time the CPU is actively executing.',
            formula: 'Util = (Busy Time / Total Time) * 100',
            color: 'text-emerald-400',
            glow: 'rgba(16,185,129,0.15)',
            icon: (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
            )
        },
        {
            title: 'Throughput',
            value: `${liveStatistics.throughput} P/s`,
            desc: 'Number of completed processes per unit time.',
            formula: 'Throughput = Completed / Total Time',
            color: 'text-amber-400',
            glow: 'rgba(245,158,11,0.15)',
            icon: (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
            )
        },
        {
            title: 'Context Switches',
            value: liveStatistics.contextSwitches,
            desc: 'Number of process preemptions and transitions.',
            formula: 'Count of CPU Process Swaps',
            color: 'text-rose-400',
            glow: 'rgba(239,68,68,0.15)',
            icon: (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
            )
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.map((stat, index) => (
                <div
                    key={index}
                    className="glass-panel p-4 flex flex-col justify-between hover:scale-[1.01] transition-transform duration-200"
                    style={{
                        boxShadow: `0 4px 20px ${stat.glow}, inset 0 1px 0 rgba(255,255,255,0.03)`
                    }}
                >
                    <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">{stat.title}</span>
                            <span className={`text-2xl font-bold font-mono tracking-tight ${stat.color}`}>
                                {stat.value}
                            </span>
                        </div>
                        <span
                            className={`flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 border border-slate-800 ${stat.color}`}
                        >
                            {stat.icon}
                        </span>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-900 text-[10px] text-slate-400">
                        <p className="leading-relaxed">{stat.desc}</p>
                        <p className="text-slate-600 font-mono mt-1 text-[9px]">{stat.formula}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
