import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PAGE_META = {
    '/app':      { title: 'Study Tools',  description: 'Compare OS concepts and visualize them with AI-generated diagrams', emoji: '📚' },
    '/chat':     { title: 'AI Chat',      description: 'Ask anything about Operating Systems — powered by textbook RAG', emoji: '💬' },
    '/quiz':     { title: 'Quiz Mode',    description: 'Test your knowledge with AI-generated MCQ and short answer questions', emoji: '📝' },
    '/viva':     { title: 'Viva Mode',    description: 'Practice oral examination questions with instant AI feedback', emoji: '🎤' },
    '/scheduler': { title: 'Visualize Scheduling', description: 'Interactive CPU scheduling simulator and algorithms visualiser', emoji: '⚡' },
};

export default function Navbar() {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const meta = PAGE_META[pathname] || PAGE_META['/app'];
    const { currentUser, signOut } = useAuth();

    const handleSignOut = async () => {
        // Navigate to home page first so ProtectedRoute doesn't redirect to /auth
        navigate('/');
        await signOut();
    };

    const avatarUrl = currentUser?.photoURL || null;
    const displayName = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User';
    const initials = displayName.slice(0, 2).toUpperCase();

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
                    <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400">Llama 3.1</span>
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

                {/* User avatar + sign-out */}
                {currentUser && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '0.25rem' }}>
                        {/* Avatar */}
                        <div
                            title={displayName}
                            style={{
                                width: '1.875rem', height: '1.875rem', borderRadius: '50%',
                                background: avatarUrl ? `url(${avatarUrl}) center/cover no-repeat` : 'linear-gradient(135deg,#0891b2,#6366f1)',
                                border: '1.5px solid rgba(99,102,241,0.45)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '0.6875rem', fontWeight: 700, color: '#fff',
                                flexShrink: 0, cursor: 'default',
                                boxShadow: '0 0 10px rgba(99,102,241,0.25)',
                            }}
                        >
                            {!avatarUrl && initials}
                        </div>

                        {/* Sign out */}
                        <button
                            id="navbar-signout-btn"
                            onClick={handleSignOut}
                            title="Sign out"
                            style={{
                                display: 'flex', alignItems: 'center', gap: '0.3rem',
                                background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)',
                                borderRadius: '0.5rem', padding: '0.3rem 0.6rem',
                                color: '#f87171', fontSize: '0.6875rem', fontWeight: 600,
                                cursor: 'pointer', transition: 'background 0.18s, border-color 0.18s',
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.14)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.07)'; }}
                        >
                            <svg style={{ width: '0.75rem', height: '0.75rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Sign out
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
}
