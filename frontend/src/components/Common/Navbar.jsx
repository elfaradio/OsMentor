import { useLocation } from 'react-router-dom';

const PAGE_META = {
    '/':         { title: 'Study Tools',  description: 'Compare OS concepts and visualize them with AI-generated diagrams', emoji: '📚' },
    '/chat':     { title: 'AI Chat',      description: 'Ask anything about Operating Systems — powered by textbook RAG', emoji: '💬' },
    '/quiz':     { title: 'Quiz Mode',    description: 'Test your knowledge with AI-generated MCQ and short answer questions', emoji: '📝' },
    '/viva':     { title: 'Viva Mode',    description: 'Practice oral examination questions with instant AI feedback', emoji: '🎤' },

};

export default function Navbar() {
    const { pathname } = useLocation();
    const meta = PAGE_META[pathname] || PAGE_META['/'];

    return (
        <header
            className="sticky top-0 z-10 flex items-center justify-between px-6 py-3"
            style={{
                background: 'rgba(2,8,23,0.85)',
                backdropFilter: 'blur(16px)',
                borderBottom: '1px solid rgba(51,65,85,0.35)',
            }}
        >
            <div className="flex items-center gap-3 min-w-0">
                <span className="text-lg leading-none" role="img" aria-label={meta.title}>{meta.emoji}</span>
                <div className="min-w-0">
                    <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-tight truncate">{meta.title}</h2>
                    <p className="text-[11px] text-slate-500 leading-tight mt-0.5 hidden sm:block truncate">{meta.description}</p>
                </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
                {/* Model badge */}
                <div
                    className="hidden sm:flex items-center gap-1.5 rounded-lg px-2.5 py-1.5"
                    style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(51,65,85,0.4)' }}
                >
                    <svg className="h-3 w-3 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400">llama3.2</span>
                </div>

                {/* Live status */}
                <div
                    className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5"
                    style={{ background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.18)' }}
                >
                    <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-400">Live</span>
                </div>
            </div>
        </header>
    );
}
