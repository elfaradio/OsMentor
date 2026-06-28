import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children }) {
    const { currentUser, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                height: '100vh', background: '#020817',
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        width: '3rem', height: '3rem', borderRadius: '0.875rem',
                        background: 'linear-gradient(135deg,#0891b2,#6366f1)',
                        boxShadow: '0 0 28px rgba(6,182,212,0.3)',
                        marginBottom: '1rem',
                        animation: 'pulse 1.5s ease-in-out infinite',
                    }}>
                        <svg fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2.5} style={{ width: '1.25rem', height: '1.25rem' }}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                    </div>
                    <p style={{ color: '#475569', fontSize: '0.8125rem', margin: 0 }}>Loading…</p>
                </div>
                <style>{`@keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.55; } }`}</style>
            </div>
        );
    }

    if (!currentUser) {
        return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
    }

    return children;
}
