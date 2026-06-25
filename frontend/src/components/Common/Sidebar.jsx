import { NavLink } from 'react-router-dom';

const links = [
    {
        to: '/',
        label: 'Study Tools',
        desc: 'Compare & diagram',
        icon: (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
        ),
        color: 'from-cyan-500 to-sky-500',
        glow: 'rgba(6,182,212,0.35)',
    },
    {
        to: '/chat',
        label: 'AI Chat',
        desc: 'Ask the tutor',
        icon: (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
        ),
        color: 'from-indigo-500 to-violet-500',
        glow: 'rgba(99,102,241,0.35)',
    },
    {
        to: '/quiz',
        label: 'Quiz Mode',
        desc: 'MCQ & short answer',
        icon: (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        ),
        color: 'from-violet-500 to-purple-600',
        glow: 'rgba(139,92,246,0.35)',
    },
    {
        to: '/viva',
        label: 'Viva Mode',
        desc: 'Oral exam practice',
        icon: (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
        ),
        color: 'from-emerald-500 to-teal-500',
        glow: 'rgba(16,185,129,0.35)',
    },

];

export default function Sidebar() {
    return (
        <aside
            className="hidden w-64 shrink-0 md:flex md:flex-col"
            style={{
                background: 'rgba(2,8,23,0.92)',
                backdropFilter: 'blur(20px)',
                borderRight: '1px solid rgba(51,65,85,0.4)',
            }}
        >
            {/* ── Logo ────────────────────────────────── */}
            <div className="px-5 pt-6 pb-5">
                <div className="flex items-center gap-3">
                    <div
                        className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                        style={{ background: 'linear-gradient(135deg,#0891b2,#6366f1)', boxShadow: '0 0 20px rgba(6,182,212,0.3)' }}
                    >
                        <svg className="h-4.5 w-4.5 text-slate-900 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} style={{ width: '1.125rem', height: '1.125rem' }}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight leading-none">OSMentor AI</h1>
                        <p className="text-[10px] text-slate-500 mt-0.5 leading-none">Operating Systems Tutor</p>
                    </div>
                </div>
            </div>

            {/* ── Section label ───────────────────────── */}
            <div className="px-5 mb-2">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-600">Navigation</p>
            </div>

            {/* ── Nav links ───────────────────────────── */}
            <nav className="flex-1 px-3 space-y-0.5">
                {links.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        end={link.to === '/'}
                        className={({ isActive }) =>
                            `group relative flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 ${
                                isActive
                                    ? 'text-slate-900 dark:text-white'
                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:text-slate-200'
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                {isActive && (
                                    <span
                                        className="absolute inset-0 rounded-xl opacity-100"
                                        style={{
                                            background: 'rgba(51,65,85,0.45)',
                                            border: '1px solid rgba(71,85,105,0.4)',
                                        }}
                                    />
                                )}
                                {!isActive && (
                                    <span
                                        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                        style={{ background: 'rgba(30,41,59,0.5)' }}
                                    />
                                )}

                                {/* Icon bubble */}
                                <span
                                    className={`relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all duration-200 ${
                                        isActive
                                            ? `bg-gradient-to-br ${link.color}`
                                            : 'bg-slate-200 dark:bg-slate-800/60 group-hover:bg-slate-700/60'
                                    }`}
                                    style={isActive ? { boxShadow: `0 0 12px ${link.glow}` } : {}}
                                >
                                    {link.icon}
                                </span>

                                <div className="relative z-10 min-w-0">
                                    <p className="text-sm font-medium leading-none">{link.label}</p>
                                    <p className="text-[10px] text-slate-500 group-hover:text-slate-600 dark:text-slate-400 transition-colors mt-0.5 leading-none">{link.desc}</p>
                                </div>

                                {isActive && (
                                    <span className="relative z-10 ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* ── Footer card ─────────────────────────── */}
            <div className="p-4 mt-2">
                <div
                    className="rounded-xl p-3 space-y-2"
                    style={{ background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(51,65,85,0.35)' }}
                >
                    <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                        </span>
                        <p className="text-[11px] font-semibold text-emerald-400">Backend Online</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] text-slate-600">Powered by</p>
                        <div className="flex flex-wrap gap-1">
                            <span className="chip chip-cyan">Ollama</span>
                            <span className="chip chip-indigo">ChromaDB</span>
                            <span className="chip chip-indigo" style={{ color: '#a78bfa', borderColor: 'rgba(167,139,250,0.2)', background: 'rgba(167,139,250,0.1)' }}>RAG</span>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}
