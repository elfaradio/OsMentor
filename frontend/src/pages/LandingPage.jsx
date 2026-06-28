import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const FEATURES = [
    {
        icon: (
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ width: '1.25rem', height: '1.25rem' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
        ),
        color: 'from-cyan-500 to-sky-500',
        glow: 'rgba(6,182,212,0.25)',
        title: 'Concept Comparison',
        desc: 'Compare any two OS concepts side-by-side in a structured table — paging vs segmentation, threads vs processes, and more.',
        chip: 'Study Tools',
        chipColor: '#22d3ee',
        path: '/app',
    },
    {
        icon: (
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ width: '1.25rem', height: '1.25rem' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
        ),
        color: 'from-violet-500 to-indigo-500',
        glow: 'rgba(139,92,246,0.25)',
        title: 'AI Diagram Generator',
        desc: 'Generate beautiful Mermaid diagrams from any OS topic — flowcharts, sequence diagrams, state machines — instantly.',
        chip: 'Study Tools',
        chipColor: '#818cf8',
        path: '/app',
    },
    {
        icon: (
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ width: '1.25rem', height: '1.25rem' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
        ),
        color: 'from-indigo-500 to-violet-500',
        glow: 'rgba(99,102,241,0.25)',
        title: 'AI Chat Tutor',
        desc: 'Ask any OS question and get detailed, textbook-grounded answers powered by RAG — your always-available tutor.',
        chip: 'AI Chat',
        chipColor: '#a78bfa',
        path: '/chat',
    },
    {
        icon: (
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ width: '1.25rem', height: '1.25rem' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        ),
        color: 'from-violet-500 to-purple-600',
        glow: 'rgba(139,92,246,0.25)',
        title: 'Quiz Mode',
        desc: 'Test yourself with AI-generated MCQ and short-answer questions. Instant feedback and detailed explanations.',
        chip: 'Quiz',
        chipColor: '#c084fc',
        path: '/quiz',
    },
    {
        icon: (
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ width: '1.25rem', height: '1.25rem' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
        ),
        color: 'from-emerald-500 to-teal-500',
        glow: 'rgba(16,185,129,0.25)',
        title: 'Viva Practice',
        desc: 'Simulate oral exams with AI-generated viva questions. Get scored and receive model answers for every response.',
        chip: 'Viva',
        chipColor: '#34d399',
        path: '/viva',
    },
    {
        icon: (
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ width: '1.25rem', height: '1.25rem' }}>
                <rect width="16" height="16" x="4" y="4" rx="2" />
                <rect width="6" height="6" x="9" y="9" rx="1" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 15h3M1 9h3M1 15h3" />
            </svg>
        ),
        color: 'from-rose-500 to-pink-500',
        glow: 'rgba(244,63,94,0.25)',
        title: 'Visualize Scheduling',
        desc: 'Interactively simulate CPU Scheduling Algorithms in real time. Explore FCFS, SJF, Round Robin, Priority Scheduling, animated Gantt Charts, Ready Queue, CPU execution and performance statistics.',
        chip: 'Scheduling',
        chipColor: '#fb7185',
        path: '/scheduler',
    },
    {
        icon: (
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ width: '1.25rem', height: '1.25rem' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
            </svg>
        ),
        color: 'from-amber-500 to-orange-500',
        glow: 'rgba(245,158,11,0.25)',
        title: 'Textbook RAG',
        desc: 'Every answer is grounded in your actual OS textbook via a retrieval-augmented pipeline — no hallucinations.',
        chip: 'Powered by',
        chipColor: '#fbbf24',
        path: '/chat',
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

/* ── Animated Number Counter Component ───────────────────────────────────── */
function AnimatedNumber({ value, suffix = '', duration = 1200 }) {
    const [count, setCount] = useState(0);
    const [visible, setVisible] = useState(false);
    const elementRef = useRef(null);

    useEffect(() => {
        const currentRef = elementRef.current;
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setVisible(true);
                observer.disconnect();
            }
        }, { threshold: 0.1 });

        if (currentRef) {
            observer.observe(currentRef);
        }
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!visible) return;
        let startTime = null;
        const end = parseInt(value);
        if (isNaN(end)) return;

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            setCount(Math.floor(progress * end));
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        requestAnimationFrame(animate);
    }, [visible, value, duration]);

    const endNum = parseInt(value);
    return (
        <span ref={elementRef} className="transition-all duration-200">
            {isNaN(endNum) ? (
                <span className="opacity-0 animate-fade-in" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
                    {value}
                </span>
            ) : (
                `${count}${suffix}`
            )}
        </span>
    );
}

export default function LandingPage() {
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    function handleGetStarted() {
        if (currentUser) {
            navigate('/app');
        } else {
            navigate('/auth', { state: { tab: 'sign-up' } });
        }
    }

    const handleCardClick = (path) => {
        if (currentUser) {
            navigate(path);
        } else {
            navigate('/auth', { state: { from: path } });
        }
    };

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
                    radial-gradient(ellipse 90% 70% at 5% 0%,   rgba(6,182,212,0.08) 0%, transparent 55%),
                    radial-gradient(ellipse 70% 60% at 95% 90%,  rgba(99,102,241,0.08) 0%, transparent 55%),
                    radial-gradient(ellipse 50% 40% at 55% 50%,  rgba(168,85,247,0.03) 0%, transparent 50%)
                `,
            }} />

            {/* ── Navbar ─────────────────────────────────────────────────────── */}
            <nav style={{
                position: 'sticky', top: 0, zIndex: 50,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0 2rem', height: '3.75rem',
                background: 'rgba(2,8,23,0.8)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderBottom: '1px solid rgba(51,65,85,0.3)',
            }}>
                {/* Clickable Logo */}
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none' }} className="group">
                    <div style={{
                        width: '2rem', height: '2rem', borderRadius: '0.5rem',
                        background: 'linear-gradient(135deg,#0891b2,#6366f1)',
                        boxShadow: '0 0 16px rgba(6,182,212,0.3)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }} className="transition-transform duration-250 group-hover:scale-105">
                        <svg fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2.5} style={{ width: '1rem', height: '1rem' }}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                    </div>
                    <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#f8fafc', letterSpacing: '-0.015em' }} className="transition-colors group-hover:text-cyan-400">
                        OSMentor AI
                    </span>
                </Link>

                {/* Nav actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {currentUser ? (
                        <>
                            <span className="hidden sm:inline" style={{ fontSize: '0.8125rem', color: '#64748b', fontWeight: 500 }}>
                                {currentUser.displayName || currentUser.email?.split('@')[0]}
                            </span>
                            <button
                                id="landing-go-to-app"
                                onClick={() => navigate('/app')}
                                className="btn-primary py-1.5 px-4 text-xs"
                                style={{ borderRadius: '0.5rem', height: '1.95rem' }}
                            >
                                Go to App →
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                id="landing-signin-nav"
                                onClick={() => navigate('/auth')}
                                className="btn-secondary py-1 px-3.5 text-xs font-semibold"
                                style={{ borderRadius: '0.5rem', height: '1.95rem' }}
                            >
                                Sign In
                            </button>
                            <button
                                id="landing-signup-nav"
                                onClick={handleGetStarted}
                                className="btn-primary py-1 px-4 text-xs font-semibold"
                                style={{ borderRadius: '0.5rem', height: '1.95rem' }}
                            >
                                Get Started
                            </button>
                        </>
                    )}
                </div>
            </nav>

            <div style={{ position: 'relative', zIndex: 1 }}>

                {/* ── Hero ───────────────────────────────────────────────────── */}
                <section style={{ textAlign: 'center', padding: '7rem 1.5rem 6rem', maxWidth: '58rem', margin: '0 auto' }} className="space-y-6">
                    {/* Badge */}
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                        padding: '0.35rem 1rem', borderRadius: '99px',
                        background: 'rgba(6,182,212,0.06)', border: '1px solid rgba(6,182,212,0.22)',
                        fontSize: '0.75rem', fontWeight: 700, color: '#22d3ee', letterSpacing: '0.05em',
                        animation: 'fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) both',
                        textTransform: 'uppercase'
                    }}>
                        <span style={{ width: '0.4rem', height: '0.4rem', borderRadius: '50%', background: '#22d3ee', boxShadow: '0 0 8px #22d3ee' }} className="animate-pulse" />
                        AI-Powered Operating Systems Tutor
                    </div>

                    {/* Heading */}
                    <h1 style={{
                        fontSize: 'clamp(2.5rem, 6vw, 4.25rem)', fontWeight: 900,
                        lineHeight: 1.05, letterSpacing: '-0.035em', margin: '0',
                        animation: 'fadeUp 0.7s 0.06s cubic-bezier(0.16,1,0.3,1) both',
                    }}>
                        <span style={{ color: '#f8fafc' }}>Master Operating Systems</span>
                        <br />
                        <span style={{
                            background: 'linear-gradient(135deg, #22d3ee 0%, #6366f1 45%, #a78bfa 100%)',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                        }}>
                            with RAG-Powered AI
                        </span>
                    </h1>

                    {/* Subtext */}
                    <p style={{
                        fontSize: 'clamp(1rem, 2vw, 1.125rem)', color: '#94a3b8', lineHeight: 1.7,
                        maxWidth: '38rem', margin: '0 auto',
                        animation: 'fadeUp 0.7s 0.12s cubic-bezier(0.16,1,0.3,1) both',
                    }}>
                        OSMentor bridges the gap between text book theory and real-world visualization. Run CPU simulators, generate diagrams, take oral practice tests, and ask our RAG assistant tutor anything.
                    </p>

                    {/* CTA buttons */}
                    <div style={{
                        display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap',
                        animation: 'fadeUp 0.7s 0.18s cubic-bezier(0.16,1,0.3,1) both',
                    }}>
                        <button
                            id="landing-hero-cta"
                            onClick={handleGetStarted}
                            className="btn-primary text-sm font-bold"
                            style={{
                                padding: '0.75rem 2rem', borderRadius: '0.625rem',
                                boxShadow: '0 4px 20px rgba(6,182,212,0.3), 0 2px 8px rgba(99,102,241,0.2)',
                                transition: 'all 0.2s ease-in-out'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(6,182,212,0.45)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 20px rgba(6,182,212,0.3), 0 2px 8px rgba(99,102,241,0.2)'; }}
                        >
                            {currentUser ? '→ Open Dashboard' : '🚀 Get Started Free'}
                        </button>
                        <button
                            id="landing-learn-more"
                            onClick={() => document.getElementById('features-section').scrollIntoView({ behavior: 'smooth' })}
                            className="btn-secondary text-sm font-semibold"
                            style={{
                                padding: '0.75rem 1.75rem', borderRadius: '0.625rem',
                                transition: 'all 0.2s ease-in-out'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.transform = ''; }}
                        >
                            Learn More ↓
                        </button>
                    </div>
                </section>

                {/* ── Stats strip ────────────────────────────────────────────── */}
                <section style={{
                    display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '0',
                    borderTop: '1px solid rgba(51,65,85,0.25)', borderBottom: '1px solid rgba(51,65,85,0.25)',
                    background: 'rgba(15,23,42,0.45)', marginBottom: '6rem',
                }} className="slide-up">
                    {[
                        { value: '7', label: 'AI Study Modes', suffix: '+' },
                        { value: 'RAG', label: 'Textbook-Grounded', suffix: '' },
                        { value: '10', label: 'CPU Algorithms', suffix: '+' },
                        { value: '100', label: 'Free and Open', suffix: '%' },
                    ].map((stat, i) => (
                        <div key={i} style={{
                            padding: '1.75rem 3.5rem', textAlign: 'center', flexShrink: 0,
                            borderRight: i < 3 ? '1px solid rgba(51,65,85,0.25)' : 'none',
                        }} className="w-1/2 sm:w-auto">
                            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em' }} className="font-mono">
                                <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#475569', fontWeight: 600, marginTop: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </section>

                {/* ── Features ───────────────────────────────────────────────── */}
                <section id="features-section" style={{ padding: '0 1.5rem 6rem', maxWidth: '72rem', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '4.5rem' }} className="fade-in">
                        <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em', color: '#22d3ee', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                            Features & Tools
                        </p>
                        <h2 style={{ fontSize: 'clamp(2rem, 5vw, 2.75rem)', fontWeight: 900, color: '#f8fafc', letterSpacing: '-0.03em', margin: 0 }}>
                            Explore Seven Powerful Study Tools
                        </h2>
                        <p style={{ color: '#64748b', marginTop: '0.85rem', fontSize: '1rem', maxWidth: '32rem', margin: '0.85rem auto 0' }}>
                            Interactive simulators, visual diagrams, and RAG tutor explanations directly aligned with your curriculum.
                        </p>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                        gap: '1.25rem',
                    }}>
                        {FEATURES.map((f, i) => (
                            <div
                                key={i}
                                onClick={() => handleCardClick(f.path)}
                                style={{
                                    padding: '1.75rem',
                                    background: 'rgba(15,23,42,0.45)',
                                    border: '1px solid rgba(51,65,85,0.3)',
                                    borderRadius: '1.125rem',
                                    backdropFilter: 'blur(16px)',
                                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                                    cursor: 'pointer',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                                className="group hover:-translate-y-1 hover:border-slate-700/80 shadow-md"
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.boxShadow = `0 15px 35px ${f.glow}`;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.boxShadow = '';
                                }}
                            >
                                {/* Glowing light beam under icon */}
                                <div
                                    className="absolute -top-10 -left-10 h-28 w-28 rounded-full blur-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"
                                    style={{ backgroundColor: f.chipColor }}
                                />

                                {/* Icon + chip */}
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                                    <div style={{
                                        width: '2.75rem', height: '2.75rem', borderRadius: '0.75rem', flexShrink: 0,
                                        background: `linear-gradient(135deg, ${f.color.replace('from-', '').replace(' to-', ', ')})`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        boxShadow: `0 4px 16px ${f.glow}`,
                                        color: 'white',
                                    }} className="transition-transform duration-300 group-hover:scale-110">
                                        {f.icon}
                                    </div>
                                    <span style={{
                                        fontSize: '0.6875rem', fontWeight: 700, padding: '0.2rem 0.55rem',
                                        borderRadius: '0.375rem', border: `1px solid ${f.chipColor}2d`,
                                        background: `${f.chipColor}0f`, color: f.chipColor,
                                        letterSpacing: '0.05em',
                                    }}>
                                        {f.chip}
                                    </span>
                                </div>
                                <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.01em' }} className="group-hover:text-cyan-400 transition-colors">
                                    {f.title}
                                </h3>
                                <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.65 }}>
                                    {f.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── Tech stack ─────────────────────────────────────────────── */}
                <section style={{
                    padding: '3.5rem 1.5rem',
                    background: 'rgba(15,23,42,0.3)',
                    borderTop: '1px solid rgba(51,65,85,0.2)',
                    borderBottom: '1px solid rgba(51,65,85,0.2)',
                    textAlign: 'center', marginBottom: '6rem',
                }} className="slide-up">
                    <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em', color: '#475569', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
                        Architected With
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                        {TECH_STACK.map((t) => (
                            <span key={t.label} style={{
                                padding: '0.35rem 0.85rem', borderRadius: '0.5rem', fontSize: '0.8125rem', fontWeight: 700,
                                border: `1px solid ${t.color}2b`, background: `${t.color}0a`, color: t.color,
                                letterSpacing: '0.04em',
                            }}>
                                {t.label}
                            </span>
                        ))}
                    </div>
                </section>

                {/* ── Final CTA ──────────────────────────────────────────────── */}
                <section style={{ textAlign: 'center', padding: '0 1.5rem 6.5rem', maxWidth: '44rem', margin: '0 auto' }}>
                    <div style={{
                        padding: '3.5rem 2.5rem',
                        background: 'rgba(15,23,42,0.45)',
                        border: '1px solid rgba(99,102,241,0.2)',
                        borderRadius: '1.25rem',
                        backdropFilter: 'blur(20px)',
                        boxShadow: '0 0 50px rgba(99,102,241,0.06)',
                    }} className="scale-in">
                        <h2 style={{ margin: '0 0 0.85rem', fontSize: '1.875rem', fontWeight: 900, color: '#f8fafc', letterSpacing: '-0.025em' }}>
                            Ready to master Operating Systems?
                        </h2>
                        <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.6, maxWidth: '30rem', margin: '0 auto 2rem' }}>
                            Start learning with AI-powered tutoring, scheduling simulations, quizzes, viva practice, and textbook-grounded explanations.
                        </p>
                        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <button
                                id="landing-final-cta"
                                onClick={handleGetStarted}
                                className="btn-primary text-sm font-bold"
                                style={{
                                    padding: '0.75rem 2.25rem', borderRadius: '0.625rem',
                                    boxShadow: '0 4px 20px rgba(6,182,212,0.3)',
                                    transition: 'all 0.2s ease-in-out'
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.transform = ''; }}
                            >
                                {currentUser ? '→ Open App' : '🚀 Get Started Free'}
                            </button>
                            <button
                                type="button"
                                onClick={() => document.getElementById('features-section').scrollIntoView({ behavior: 'smooth' })}
                                className="btn-secondary text-sm font-semibold"
                                style={{
                                    padding: '0.75rem 1.75rem', borderRadius: '0.625rem',
                                    transition: 'all 0.2s ease-in-out'
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.transform = ''; }}
                            >
                                Explore Features
                            </button>
                        </div>
                    </div>
                </section>

                {/* ── Footer ─────────────────────────────────────────────────── */}
                <footer style={{
                    borderTop: '1px solid rgba(51,65,85,0.2)',
                    background: 'rgba(2,8,23,0.6)',
                    padding: '4rem 2rem 3rem',
                    color: '#94a3b8',
                }}>
                    <div style={{ maxWidth: '72rem', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '3rem', justifyContent: 'space-between' }}>
                        <div style={{ flex: '1 1 250px', spaceY: '1rem' }} className="space-y-3">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <div style={{
                                    width: '1.75rem', height: '1.75rem', borderRadius: '0.375rem',
                                    background: 'linear-gradient(135deg,#0891b2,#6366f1)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <svg fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2.5} style={{ width: '0.85rem', height: '0.85rem' }}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                    </svg>
                                </div>
                                <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#f8fafc', letterSpacing: '-0.01em' }}>OSMentor AI</span>
                            </div>
                            <p style={{ fontSize: '0.8rem', color: '#475569', lineHeight: 1.5, maxWidth: '280px' }}>
                                Interactive learning companion to master OS concepts with RAG-textbook assistance and simulators.
                            </p>
                            <p style={{ fontSize: '0.75rem', color: '#334155' }}>
                                Version 1.1.0 · Powered by Groq AI & ChromaDB
                            </p>
                        </div>

                        {/* Quick links columns */}
                        <div style={{ display: 'flex', gap: '3.5rem', flexWrap: 'wrap' }}>
                            <div className="space-y-2">
                                <h4 style={{ fontSize: '0.75rem', fontWeight: 800, color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Study Tools</h4>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.8rem' }} className="space-y-1.5">
                                    <li><button onClick={() => handleCardClick('/app')} style={{ background: 'none', border: 'none', padding: 0, color: '#64748b', cursor: 'pointer' }} className="hover:text-cyan-400 transition-colors">Concept Compare</button></li>
                                    <li><button onClick={() => handleCardClick('/app')} style={{ background: 'none', border: 'none', padding: 0, color: '#64748b', cursor: 'pointer' }} className="hover:text-cyan-400 transition-colors">AI Diagrams</button></li>
                                    <li><button onClick={() => handleCardClick('/scheduler')} style={{ background: 'none', border: 'none', padding: 0, color: '#64748b', cursor: 'pointer' }} className="hover:text-cyan-400 transition-colors">Scheduling Visualizer</button></li>
                                </ul>
                            </div>

                            <div className="space-y-2">
                                <h4 style={{ fontSize: '0.75rem', fontWeight: 800, color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Practice Modes</h4>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.8rem' }} className="space-y-1.5">
                                    <li><button onClick={() => handleCardClick('/chat')} style={{ background: 'none', border: 'none', padding: 0, color: '#64748b', cursor: 'pointer' }} className="hover:text-cyan-400 transition-colors">AI Chat Tutor</button></li>
                                    <li><button onClick={() => handleCardClick('/quiz')} style={{ background: 'none', border: 'none', padding: 0, color: '#64748b', cursor: 'pointer' }} className="hover:text-cyan-400 transition-colors">Quiz Mode</button></li>
                                    <li><button onClick={() => handleCardClick('/viva')} style={{ background: 'none', border: 'none', padding: 0, color: '#64748b', cursor: 'pointer' }} className="hover:text-cyan-400 transition-colors">Viva Practice</button></li>
                                </ul>
                            </div>

                            <div className="space-y-2">
                                <h4 style={{ fontSize: '0.75rem', fontWeight: 800, color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Resources</h4>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.8rem' }} className="space-y-1.5">
                                    <li><a href="https://github.com" target="_blank" rel="noreferrer" style={{ color: '#64748b', textDecoration: 'none' }} className="hover:text-cyan-400 transition-colors">GitHub Repo</a></li>
                                    <li><a href="#" style={{ color: '#64748b', textDecoration: 'none' }} className="hover:text-cyan-400 transition-colors">Documentation</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div style={{
                        maxWidth: '72rem', margin: '3rem auto 0', pt: '1.5rem',
                        borderTop: '1px solid rgba(51,65,85,0.15)', textAlign: 'center',
                        fontSize: '0.75rem', color: '#334155'
                    }}>
                        © {new Date().getFullYear()} OSMentor AI. All rights reserved. Registered OS Tutor.
                    </div>
                </footer>
            </div>

            <style>{`
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(18px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }
                .animate-fade-in {
                    animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
                }
                .scale-in {
                    animation: scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
                }
                @keyframes scaleIn {
                    from { opacity: 0; transform: scale(0.97); }
                    to   { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </div>
    );
}
