import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/* ── tiny helpers ───────────────────────────────────────────────────────── */
function EyeIcon({ open }) {
    return open ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
    ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
        </svg>
    );
}

function Spinner() {
    return (
        <svg className="h-4 w-4 animate-spin text-white" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
    );
}

/* ── Google logo SVG ─────────────────────────────────────────────────────── */
function GoogleLogo() {
    return (
        <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
    );
}

/* ── Phone flag helper ───────────────────────────────────────────────────── */
function PhoneInput({ value, onChange }) {
    return (
        <div style={{ display: 'flex', gap: '0.625rem' }}>
            <div
                className="input-field"
                style={{ width: '90px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', cursor: 'default' }}
            >
                <span className="text-xs">🌍</span>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>+</span>
            </div>
            <input
                id="auth-phone"
                type="tel"
                className="input-field"
                placeholder="e.g. 15551234567"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                autoComplete="tel"
            />
        </div>
    );
}

const TABS = ['sign-in', 'sign-up'];

export default function AuthPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { signInWithGoogle, signInWithEmail, signUpWithEmail, sendPhoneOTP, currentUser } = useAuth();

    // Where to go after successful login (default: landing page)
    const from = location.state?.from || '/';

    // Redirect if already authenticated
    useEffect(() => {
        if (currentUser) navigate(from, { replace: true });
    }, [currentUser, navigate, from]);

    // Read initial tab from location state (for example, if user clicked 'Get Started')
    const [tab, setTab] = useState(() => location.state?.tab || 'sign-in');
    const [method, setMethod] = useState('email');       // 'email' | 'phone'
    const [phoneStep, setPhoneStep] = useState(1);       // 1=enter number, 2=enter OTP
    const [confirmResult, setConfirmResult] = useState(null);

    // form fields
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    const recaptchaContainerRef = useRef(null);

    function switchTab(t) {
        setTab(t);
        setError('');
        setSuccessMsg('');
        setPhoneStep(1);
    }

    function friendlyError(code) {
        const map = {
            'auth/user-not-found': 'No account found with this email.',
            'auth/wrong-password': 'Incorrect password.',
            'auth/invalid-credential': 'Invalid email or password.',
            'auth/email-already-in-use': 'This email is already registered. Try signing in.',
            'auth/weak-password': 'Password must be at least 6 characters.',
            'auth/invalid-phone-number': 'Please enter a valid phone number with country code.',
            'auth/too-many-requests': 'Too many attempts. Please try again later.',
            'auth/invalid-verification-code': 'Invalid OTP code. Please try again.',
            'auth/popup-closed-by-user': 'Google sign-in was cancelled.',
        };
        return map[code] || 'Something went wrong. Please try again.';
    }

    async function handleGoogle() {
        setError(''); setLoading(true);
        try {
            await signInWithGoogle();
            navigate(from, { replace: true });
        } catch (e) {
            setError(friendlyError(e.code));
        } finally { setLoading(false); }
    }

    async function handleEmailSubmit(e) {
        e.preventDefault();
        setError(''); setLoading(true);
        try {
            if (tab === 'sign-up') {
                await signUpWithEmail(email, password, name);
                setSuccessMsg('Account created! Welcome to OsMentor.');
            } else {
                await signInWithEmail(email, password);
            }
            navigate(from, { replace: true });
        } catch (err) {
            setError(friendlyError(err.code));
        } finally { setLoading(false); }
    }

    async function handleSendOTP(e) {
        e.preventDefault();
        setError(''); setLoading(true);
        try {
            const result = await sendPhoneOTP(phone.startsWith('+') ? phone : `+${phone}`, 'recaptcha-container');
            setConfirmResult(result);
            setPhoneStep(2);
        } catch (err) {
            setError(friendlyError(err.code));
        } finally { setLoading(false); }
    }

    async function handleVerifyOTP(e) {
        e.preventDefault();
        setError(''); setLoading(true);
        try {
            await confirmResult.confirm(otp);
            navigate(from, { replace: true });
        } catch (err) {
            setError(friendlyError(err.code));
        } finally { setLoading(false); }
    }

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            background: '#020817',
            position: 'relative',
            overflow: 'hidden',
        }}>
            {/* Ambient glow blobs */}
            <div style={{
                position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
                background: `
                    radial-gradient(ellipse 70% 60% at 15% -5%, rgba(6,182,212,0.1) 0%, transparent 55%),
                    radial-gradient(ellipse 70% 60% at 85% 95%, rgba(99,102,241,0.1) 0%, transparent 55%),
                    radial-gradient(ellipse 50% 40% at 60% 40%, rgba(168,85,247,0.04) 0%, transparent 50%)
                `,
            }} />

            {/* Invisible reCAPTCHA container */}
            <div id="recaptcha-container" ref={recaptchaContainerRef} />

            {/* Card - Upgraded Glassmorphism */}
            <div className="glass-panel p-8 w-full max-w-[420px] relative z-10 transition-all duration-300"
                 style={{
                     background: 'rgba(15, 23, 42, 0.45)',
                     backdropFilter: 'blur(20px)',
                     WebkitBackdropFilter: 'blur(20px)',
                     border: '1px solid rgba(51, 65, 85, 0.35)',
                     boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.03)'
                 }}>

                {/* ── Branding ── */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <Link to="/" style={{ display: 'inline-flex', textDecoration: 'none' }} className="group">
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            width: '3rem', height: '3rem', borderRadius: '0.875rem', marginBottom: '0.875rem',
                            background: 'linear-gradient(135deg,#0891b2,#6366f1)',
                            boxShadow: '0 0 24px rgba(6,182,212,0.25)',
                        }} className="transition-transform duration-200 group-hover:scale-105">
                            <svg fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2.5} style={{ width: '1.25rem', height: '1.25rem' }}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                        </div>
                    </Link>
                    <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.025em' }} className="gradient-text">
                        OSMentor AI
                    </h1>
                    <p style={{ margin: '0.35rem 0 0', fontSize: '0.8125rem', color: '#64748b', fontWeight: 500 }}>
                        Your textbook-grounded study companion
                    </p>
                </div>

                {/* ── Tab switcher ── */}
                <div style={{
                    display: 'flex', background: 'rgba(2,8,23,0.7)',
                    border: '1px solid rgba(51,65,85,0.5)', borderRadius: '0.75rem',
                    padding: '0.25rem', marginBottom: '1.5rem',
                }}>
                    {TABS.map((t) => (
                        <button
                            key={t}
                            id={`auth-tab-${t}`}
                            onClick={() => switchTab(t)}
                            style={{
                                flex: 1, padding: '0.55rem', border: 'none', cursor: 'pointer',
                                borderRadius: '0.5rem', fontSize: '0.8125rem', fontWeight: 700,
                                transition: 'all 0.2s ease-in-out',
                                background: tab === t ? 'linear-gradient(135deg,#0891b2,#6366f1)' : 'transparent',
                                color: tab === t ? '#fff' : '#64748b',
                                boxShadow: tab === t ? '0 4px 12px rgba(6,182,212,0.2)' : 'none',
                            }}
                        >
                            {t === 'sign-in' ? 'Sign In' : 'Sign Up'}
                        </button>
                    ))}
                </div>

                {/* ── Method switcher (Email / Phone) ── */}
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    {['email', 'phone'].map((m) => (
                        <button
                            key={m}
                            id={`auth-method-${m}`}
                            onClick={() => { setMethod(m); setError(''); setPhoneStep(1); }}
                            style={{
                                flex: 1, padding: '0.5rem', border: '1px solid',
                                borderColor: method === m ? 'rgba(6,182,212,0.45)' : 'rgba(51,65,85,0.4)',
                                borderRadius: '0.5rem', cursor: 'pointer',
                                background: method === m ? 'rgba(6,182,212,0.06)' : 'transparent',
                                color: method === m ? '#22d3ee' : '#64748b',
                                fontSize: '0.75rem', fontWeight: 700,
                                transition: 'all 0.18s ease-in-out',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem',
                            }}
                        >
                            {m === 'email' ? (
                                <>
                                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    Email
                                </>
                            ) : (
                                <>
                                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                    Phone OTP
                                </>
                            )}
                        </button>
                    ))}
                </div>

                {/* ── Error / success banner ── */}
                {error && (
                    <div style={{
                        marginBottom: '1.25rem', padding: '0.75rem 1rem',
                        background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.18)',
                        borderRadius: '0.5rem', fontSize: '0.8125rem', color: '#f87171',
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                    }} className="fade-in">
                        <svg style={{ flexShrink: 0, width: '1rem', height: '1rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span className="font-medium">{error}</span>
                    </div>
                )}
                {successMsg && (
                    <div style={{
                        marginBottom: '1.25rem', padding: '0.75rem 1rem',
                        background: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.18)',
                        borderRadius: '0.5rem', fontSize: '0.8125rem', color: '#4ade80',
                    }} className="fade-in">
                        <span className="font-medium">{successMsg}</span>
                    </div>
                )}

                {/* ══════════ EMAIL FORM ══════════ */}
                {method === 'email' && (
                    <form id="auth-email-form" onSubmit={handleEmailSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {tab === 'sign-up' && (
                            <div>
                                <label className="field-label" htmlFor="auth-name">Full Name</label>
                                <input
                                    id="auth-name"
                                    type="text"
                                    className="input-field"
                                    placeholder="Your name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    autoComplete="name"
                                />
                            </div>
                        )}
                        <div>
                            <label className="field-label" htmlFor="auth-email">Email Address</label>
                            <input
                                id="auth-email"
                                type="email"
                                className="input-field"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoComplete="email"
                            />
                        </div>
                        <div>
                            <label className="field-label" htmlFor="auth-password">Password</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    id="auth-password"
                                    type={showPassword ? 'text' : 'password'}
                                    className="input-field"
                                    placeholder="Min. 6 characters"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={6}
                                    autoComplete={tab === 'sign-up' ? 'new-password' : 'current-password'}
                                    style={{ paddingRight: '2.5rem' }}
                                />
                                <button
                                    type="button"
                                    id="auth-toggle-password"
                                    onClick={() => setShowPassword((v) => !v)}
                                    style={{
                                        position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)',
                                        background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    <EyeIcon open={showPassword} />
                                </button>
                            </div>
                        </div>

                        <button
                            id="auth-email-submit"
                            type="submit"
                            className="btn-primary flex items-center justify-center gap-2"
                            style={{ width: '100%', padding: '0.7rem', fontSize: '0.875rem', marginTop: '0.5rem' }}
                            disabled={loading}
                        >
                            {loading ? <Spinner /> : null}
                            <span>{tab === 'sign-in' ? 'Sign In' : 'Create Account'}</span>
                        </button>
                    </form>
                )}

                {/* ══════════ PHONE OTP FORM ══════════ */}
                {method === 'phone' && (
                    <form
                        id={phoneStep === 1 ? 'auth-phone-form' : 'auth-otp-form'}
                        onSubmit={phoneStep === 1 ? handleSendOTP : handleVerifyOTP}
                        style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                    >
                        {phoneStep === 1 ? (
                            <div>
                                <label className="field-label" htmlFor="auth-phone">Phone Number (with country code)</label>
                                <PhoneInput value={phone} onChange={setPhone} />
                                <p style={{ marginTop: '0.5rem', fontSize: '0.7rem', color: '#475569', lineHeight: 1.4 }}>
                                    Enter full number (e.g. 15551234567 for US +1)
                                </p>
                            </div>
                        ) : (
                            <div>
                                <label className="field-label" htmlFor="auth-otp">Enter OTP</label>
                                <p style={{ fontSize: '0.775rem', color: '#64748b', marginBottom: '0.75rem' }}>
                                    We sent a 6-digit code to <strong style={{ color: '#cbd5e1' }}>+{phone}</strong>
                                </p>
                                <input
                                    id="auth-otp"
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]{6}"
                                    maxLength={6}
                                    className="input-field"
                                    placeholder="6-digit OTP"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                    autoComplete="one-time-code"
                                    style={{ letterSpacing: '0.25em', fontSize: '1.2rem', textAlign: 'center', fontWeight: 'bold' }}
                                    autoFocus
                                />
                                <button
                                    type="button"
                                    id="auth-back-to-phone"
                                    onClick={() => { setPhoneStep(1); setOtp(''); setError(''); }}
                                    style={{
                                        marginTop: '0.625rem', background: 'none', border: 'none',
                                        color: '#64748b', fontSize: '0.75rem', cursor: 'pointer', padding: 0,
                                        fontWeight: 500, transition: 'color 0.18s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = '#94a3b8'}
                                    onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}
                                >
                                    ← Change phone number
                                </button>
                            </div>
                        )}

                        <button
                            id={phoneStep === 1 ? 'auth-send-otp' : 'auth-verify-otp'}
                            type="submit"
                            className="btn-primary flex items-center justify-center gap-2"
                            style={{ width: '100%', padding: '0.7rem', fontSize: '0.875rem' }}
                            disabled={loading}
                        >
                            {loading ? <Spinner /> : null}
                            <span>{phoneStep === 1 ? 'Send OTP' : 'Verify & Sign In'}</span>
                        </button>
                    </form>
                )}

                {/* ── Divider ── */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '1.5rem 0 1.25rem' }}>
                    <div style={{ flex: 1, height: '1px', background: 'rgba(51,65,85,0.35)' }} />
                    <span style={{ fontSize: '0.7rem', color: '#475569', fontWeight: 600, whiteSpace: 'nowrap', textTransform: 'uppercase', letterSpacing: '0.05em' }}>or continue with</span>
                    <div style={{ flex: 1, height: '1px', background: 'rgba(51,65,85,0.35)' }} />
                </div>

                {/* ── Google button ── */}
                <button
                    id="auth-google-btn"
                    onClick={handleGoogle}
                    disabled={loading}
                    style={{
                        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.625rem',
                        padding: '0.65rem', borderRadius: '0.5rem', cursor: 'pointer',
                        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                        color: '#cbd5e1', fontSize: '0.8125rem', fontWeight: 700,
                        transition: 'all 0.2s ease-in-out',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                        e.currentTarget.style.transform = 'translateY(0px)';
                        e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
                    }}
                >
                    <GoogleLogo />
                    Continue with Google
                </button>

                {/* ── Footer hint ── */}
                <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.775rem', color: '#64748b', fontWeight: 500 }}>
                    {tab === 'sign-in' ? "Don't have an account? " : 'Already have an account? '}
                    <button
                        type="button"
                        id="auth-switch-tab"
                        onClick={() => switchTab(tab === 'sign-in' ? 'sign-up' : 'sign-in')}
                        style={{ background: 'none', border: 'none', color: '#22d3ee', cursor: 'pointer', fontSize: 'inherit', fontWeight: 700, padding: 0 }}
                    >
                        {tab === 'sign-in' ? 'Create one' : 'Sign in'}
                    </button>
                </p>
            </div>
        </div>
    );
}
