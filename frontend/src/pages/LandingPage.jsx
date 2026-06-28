import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const FEATURES = [
    {
        icon: (
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ width: '1.25rem', height: '1.25rem' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
        ),
        color: 'from-cyan-500 to-sky-500',
        glow: 'rgba(6,182,212,0.3)',
        title: 'Concept Comparison',
        desc: 'Compare any two OS concepts side-by-side in a structured table — paging vs segmentation, threads vs processes, and more.',
        chip: 'Study Tools',
        chipColor: '#22d3ee',
    },
    {
        icon: (
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ width: '1.25rem', height: '1.25rem' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
        ),
        color: 'from-violet-500 to-indigo-500',
        glow: 'rgba(139,92,246,0.3)',
        title: 'AI Diagram Generator',
        desc: 'Generate beautiful Mermaid diagrams from any OS topic — flowcharts, sequence diagrams, state machines — instantly.',
        chip: 'Study Tools',
        chipColor: '#818cf8',
    },
    {
        icon: (
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ width: '1.25rem', height: '1.25rem' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
        ),
        color: 'from-indigo-500 to-violet-500',
        glow: 'rgba(99,102,241,0.3)',
        title: 'AI Chat Tutor',
        desc: 'Ask any OS question and get detailed, textbook-grounded answers powered by RAG — your always-available tutor.',
        chip: 'AI Chat',
        chipColor: '#a78bfa',
    },
    {
        icon: (
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ width: '1.25rem', height: '1.25rem' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        ),
        color: 'from-violet-500 to-purple-600',
        glow: 'rgba(139,92,246,0.3)',
        title: 'Quiz Mode',
        desc: 'Test yourself with AI-generated MCQ and short-answer questions. Instant feedback and detailed explanations.',
        chip: 'Quiz',
        chipColor: '#c084fc',
    },
    {
        icon: (
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ width: '1.25rem', height: '1.25rem' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
        ),
        color: 'from-emerald-500 to-teal-500',
        glow: 'rgba(16,185,129,0.3)',
        title: 'Viva Practice',
        desc: 'Simulate oral exams with AI-generated viva questions. Get scored and receive model answers for every response.',
        chip: 'Viva',
        chipColor: '#34d399',
    },
    {
        icon: (
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ width: '1.25rem', height: '1.25rem' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
            </svg>
        ),
        color: 'from-amber-500 to-orange-500',
        glow: 'rgba(245,158,11,0.3)',
        title: 'Textbook RAG',
        desc: 'Every answer is grounded in your actual OS textbook via a retrieval-augmented pipeline — no hallucinations.',
        chip: 'Powered by',
        chipColor: '#fbbf24',
    },
];

const TECH_STACK = [
    { label: 'FastAPI', color: '#22d3ee' },
    { label: 'React', color: '#818cf8' },
    { label: 'Groq AI', color: '#a78bfa' },
    { label: 'ChromaDB', color: '#34d399' },
    { label: 'LangChain', color: '#fb923c' },
    { label: 'Firebase', color: '#fbbf24' },
];

export default function LandingPage() {
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    function handleCTA() {
        if (currentUser) {
            navigate('/app');
        } else {
            navigate('/auth');
        }
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: '#020817',
            color: '#e2e8f0',
            fontFamily: "'Inter', system-ui, sans-serif",
            overflowX: 'hidden',
        }}>
            {/* Ambient blobs */}
            <div style={{
                position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
                background: `
                    radial-gradient(ellipse 80% 60% at 5% 0%,   rgba(6,182,212,0.10) 0%, transparent 55%),
                    radial-gradient(ellipse 60% 50% at 95% 90%,  rgba(99,102,241,0.10) 0%, transparent 55%),
                    radial-gradient(ellipse 50% 40% at 55% 50%,  rgba(168,85,247,0.05) 0%, transparent 50%)
                `,
            }} />

            {/* ── Navbar ─────────────────────────────────────────────────────── */}
            <nav style={{
                position: 'sticky', top: 0, zIndex: 50,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0 2rem', height: '3.5rem',
                background: 'rgba(2,8,23,0.85)',
                backdropFilter: 'blur(16px)',
                borderBottom: '1px solid rgba(51,65,85,0.35)',
            }}>
                {/* Logo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                    <div style={{
                        width: '2rem', height: '2rem', borderRadius: '0.5rem',
                        background: 'linear-gradient(135deg,#0891b2,#6366f1)',
                        boxShadow: '0 0 16px rgba(6,182,212,0.3)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <svg fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2.5} style={{ width: '1rem', height: '1rem' }}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                    </div>
                    <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#f1f5f9', letterSpacing: '-0.01em' }}>OSMentor AI</span>
                </div>

                {/* Nav actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {currentUser ? (
                        <>
                            <span style={{ fontSize: '0.8125rem', color: '#64748b' }}>
                                {currentUser.displayName || currentUser.email?.split('@')[0]}
                            </span>
                            <button
                                id="landing-go-to-app"
                                onClick={() => navigate('/app')}
                                style={{
                                    padding: '0.4rem 1rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer',
                                    background: 'linear-gradient(135deg,#0891b2,#6366f1)',
                                    color: '#fff', fontSize: '0.8125rem', fontWeight: 600,
                                    boxShadow: '0 2px 12px rgba(6,182,212,0.25)',
                                }}
                            >
                                Go to App →
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                id="landing-signin-nav"
                                onClick={() => navigate('/auth')}
                                style={{
                                    padding: '0.4rem 0.875rem', borderRadius: '0.5rem', cursor: 'pointer',
                                    background: 'transparent', border: '1px solid rgba(51,65,85,0.6)',
                                    color: '#94a3b8', fontSize: '0.8125rem', fontWeight: 500,
                                    transition: 'border-color 0.18s, color 0.18s',
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)'; e.currentTarget.style.color = '#e2e8f0'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(51,65,85,0.6)'; e.currentTarget.style.color = '#94a3b8'; }}
                            >
                                Sign In
                            </button>
                            <button
                                id="landing-signup-nav"
                                onClick={() => navigate('/auth')}
                                style={{
                                    padding: '0.4rem 1rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer',
                                    background: 'linear-gradient(135deg,#0891b2,#6366f1)',
                                    color: '#fff', fontSize: '0.8125rem', fontWeight: 600,
                                    boxShadow: '0 2px 12px rgba(6,182,212,0.25)',
                                }}
                            >
                                Get Started
                            </button>
                        </>
                    )}
                </div>
            </nav>

            <div style={{ position: 'relative', zIndex: 1 }}>

                {/* ── Hero ───────────────────────────────────────────────────── */}
                <section style={{ textAlign: 'center', padding: '6rem 1.5rem 5rem', maxWidth: '56rem', margin: '0 auto' }}>
                    {/* Badge */}
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                        padding: '0.3rem 0.875rem', borderRadius: '99px', marginBottom: '2rem',
                        background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.25)',
                        fontSize: '0.75rem', fontWeight: 600, color: '#22d3ee', letterSpacing: '0.04em',
                        animation: 'fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) both',
                    }}>
                        <span style={{ width: '0.4rem', height: '0.4rem', borderRadius: '50%', background: '#22d3ee', boxShadow: '0 0 6px #22d3ee' }} />
                        AI-Powered Operating Systems Tutor
                    </div>

                    {/* Heading */}
                    <h1 style={{
                        fontSize: 'clamp(2.25rem, 5vw, 3.75rem)', fontWeight: 800,
                        lineHeight: 1.1, letterSpacing: '-0.03em', margin: '0 0 1.5rem',
                        animation: 'fadeUp 0.6s 0.08s cubic-bezier(0.16,1,0.3,1) both',
                    }}>
                        <span style={{ color: '#f1f5f9' }}>Master OS Concepts</span>
                        <br />
                        <span style={{
                            background: 'linear-gradient(135deg, #22d3ee 0%, #818cf8 55%, #c084fc 100%)',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                        }}>
                            with Your AI Mentor
                        </span>
                    </h1>

                    {/* Sub */}
                    <p style={{
                        fontSize: 'clamp(1rem, 2vw, 1.125rem)', color: '#64748b', lineHeight: 1.7,
                        maxWidth: '38rem', margin: '0 auto 2.5rem',
                        animation: 'fadeUp 0.6s 0.16s cubic-bezier(0.16,1,0.3,1) both',
                    }}>
                        OSMentor combines Retrieval-Augmented Generation with your textbook to give you accurate, explainable answers — compare concepts, generate diagrams, take quizzes, and practice viva exams.
                    </p>

                    {/* CTA buttons */}
                    <div style={{
                        display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap',
                        animation: 'fadeUp 0.6s 0.22s cubic-bezier(0.16,1,0.3,1) both',
                    }}>
                        <button
                            id="landing-hero-cta"
                            onClick={handleCTA}
                            style={{
                                padding: '0.75rem 2rem', borderRadius: '0.625rem', border: 'none', cursor: 'pointer',
                                background: 'linear-gradient(135deg,#0891b2,#6366f1)',
                                color: '#fff', fontSize: '0.9375rem', fontWeight: 700,
                                boxShadow: '0 4px 24px rgba(6,182,212,0.35), 0 2px 8px rgba(99,102,241,0.25)',
                                transition: 'transform 0.14s, box-shadow 0.18s',
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(6,182,212,0.45)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 24px rgba(6,182,212,0.35), 0 2px 8px rgba(99,102,241,0.25)'; }}
                        >
                            {currentUser ? '→ Open App' : '🚀 Get Started Free'}
                        </button>
                        <button
                            id="landing-learn-more"
                            onClick={() => document.getElementById('features-section').scrollIntoView({ behavior: 'smooth' })}
                            style={{
                                padding: '0.75rem 1.75rem', borderRadius: '0.625rem', cursor: 'pointer',
                                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                                color: '#94a3b8', fontSize: '0.9375rem', fontWeight: 600,
                                transition: 'background 0.18s, color 0.18s',
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#e2e8f0'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#94a3b8'; }}
                        >
                            Learn More ↓
                        </button>
                    </div>
                </section>

                {/* ── Stats strip ────────────────────────────────────────────── */}
                <section style={{
                    display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '0',
                    borderTop: '1px solid rgba(51,65,85,0.35)', borderBottom: '1px solid rgba(51,65,85,0.35)',
                    background: 'rgba(15,23,42,0.5)', marginBottom: '5rem',
                }}>
                    {[
                        { value: '5+', label: 'AI Study Modes' },
                        { value: 'RAG', label: 'Textbook-Grounded' },
                        { value: '⚡', label: 'Groq-Powered' },
                        { value: '100%', label: 'Free to Use' },
                    ].map((stat, i) => (
                        <div key={i} style={{
                            padding: '1.5rem 3rem', textAlign: 'center', flexShrink: 0,
                            borderRight: i < 3 ? '1px solid rgba(51,65,85,0.3)' : 'none',
                        }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.02em' }}>{stat.value}</div>
                            <div style={{ fontSize: '0.75rem', color: '#475569', fontWeight: 500, marginTop: '0.2rem' }}>{stat.label}</div>
                        </div>
                    ))}
                </section>

                {/* ── Features ───────────────────────────────────────────────── */}
                <section id="features-section" style={{ padding: '0 1.5rem 5rem', maxWidth: '72rem', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', color: '#22d3ee', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                            Everything you need
                        </p>
                        <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.025em', margin: 0 }}>
                            Five powerful study tools
                        </h2>
                        <p style={{ color: '#64748b', marginTop: '0.75rem', fontSize: '1rem' }}>
                            All grounded in your actual Operating Systems textbook.
                        </p>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: '1rem',
                    }}>
                        {FEATURES.map((f, i) => (
                            <div
                                key={i}
                                style={{
                                    padding: '1.5rem',
                                    background: 'rgba(15,23,42,0.6)',
                                    border: '1px solid rgba(51,65,85,0.4)',
                                    borderRadius: '1rem',
                                    backdropFilter: 'blur(12px)',
                                    transition: 'border-color 0.2s, transform 0.2s, box-shadow 0.2s',
                                    cursor: 'default',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)';
                                    e.currentTarget.style.transform = 'translateY(-3px)';
                                    e.currentTarget.style.boxShadow = `0 12px 40px ${f.glow}`;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = 'rgba(51,65,85,0.4)';
                                    e.currentTarget.style.transform = '';
                                    e.currentTarget.style.boxShadow = '';
                                }}
                            >
                                {/* Icon + chip */}
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                    <div style={{
                                        width: '2.5rem', height: '2.5rem', borderRadius: '0.625rem', flexShrink: 0,
                                        background: `linear-gradient(135deg, ${f.color.replace('from-', '').replace(' to-', ', ')})`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        boxShadow: `0 4px 16px ${f.glow}`,
                                        color: 'white',
                                    }}>
                                        {f.icon}
                                    </div>
                                    <span style={{
                                        fontSize: '0.6875rem', fontWeight: 600, padding: '0.2rem 0.5rem',
                                        borderRadius: '0.3rem', border: `1px solid ${f.chipColor}33`,
                                        background: `${f.chipColor}14`, color: f.chipColor,
                                        letterSpacing: '0.04em',
                                    }}>
                                        {f.chip}
                                    </span>
                                </div>
                                <h3 style={{ margin: '0 0 0.5rem', fontSize: '1rem', fontWeight: 700, color: '#f1f5f9' }}>{f.title}</h3>
                                <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b', lineHeight: 1.65 }}>{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── Tech stack ─────────────────────────────────────────────── */}
                <section style={{
                    padding: '3rem 1.5rem',
                    background: 'rgba(15,23,42,0.4)',
                    borderTop: '1px solid rgba(51,65,85,0.3)',
                    borderBottom: '1px solid rgba(51,65,85,0.3)',
                    textAlign: 'center', marginBottom: '5rem',
                }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', color: '#475569', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
                        Built with
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '0.625rem' }}>
                        {TECH_STACK.map((t) => (
                            <span key={t.label} style={{
                                padding: '0.3rem 0.75rem', borderRadius: '0.375rem', fontSize: '0.8125rem', fontWeight: 600,
                                border: `1px solid ${t.color}33`, background: `${t.color}12`, color: t.color,
                                letterSpacing: '0.03em',
                            }}>
                                {t.label}
                            </span>
                        ))}
                    </div>
                </section>

                {/* ── Final CTA ──────────────────────────────────────────────── */}
                <section style={{ textAlign: 'center', padding: '0 1.5rem 6rem', maxWidth: '40rem', margin: '0 auto' }}>
                    <div style={{
                        padding: '3rem 2rem',
                        background: 'rgba(15,23,42,0.7)',
                        border: '1px solid rgba(99,102,241,0.2)',
                        borderRadius: '1.25rem',
                        backdropFilter: 'blur(16px)',
                        boxShadow: '0 0 60px rgba(99,102,241,0.08)',
                    }}>
                        <h2 style={{ margin: '0 0 0.75rem', fontSize: '1.75rem', fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.02em' }}>
                            Ready to ace your OS exam?
                        </h2>
                        <p style={{ margin: '0 0 2rem', color: '#64748b', fontSize: '0.9375rem', lineHeight: 1.6 }}>
                            Sign up for free and get instant access to all study tools. No credit card required.
                        </p>
                        <button
                            id="landing-final-cta"
                            onClick={handleCTA}
                            style={{
                                padding: '0.8rem 2.5rem', borderRadius: '0.625rem', border: 'none', cursor: 'pointer',
                                background: 'linear-gradient(135deg,#0891b2,#6366f1)',
                                color: '#fff', fontSize: '1rem', fontWeight: 700,
                                boxShadow: '0 4px 24px rgba(6,182,212,0.35)',
                                transition: 'transform 0.14s, box-shadow 0.18s',
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.transform = ''; }}
                        >
                            {currentUser ? '→ Open App' : '🚀 Start Learning Free'}
                        </button>
                    </div>
                </section>

                {/* ── Footer ─────────────────────────────────────────────────── */}
                <footer style={{
                    borderTop: '1px solid rgba(51,65,85,0.3)',
                    padding: '1.5rem',
                    textAlign: 'center',
                    fontSize: '0.75rem',
                    color: '#334155',
                }}>
                    © {new Date().getFullYear()} OSMentor AI · Built with FastAPI, React & Groq
                </footer>
            </div>

            <style>{`
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
