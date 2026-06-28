import { Navigate, Route, Routes } from 'react-router-dom';
import Sidebar from '../components/Common/Sidebar';
import Navbar from '../components/Common/Navbar';
import ProtectedRoute from '../components/Common/ProtectedRoute';
import LandingPage from '../pages/LandingPage';
import AuthPage from '../pages/AuthPage';
import Dashboard from '../pages/Dashboard';
import ChatPage from '../pages/ChatPage';
import QuizPage from '../pages/QuizPage';
import VivaPage from '../pages/VivaPage';

/* App shell shared by all protected pages */
function AppShell({ children }) {
    return (
        <div className="flex h-screen overflow-hidden bg-transparent text-slate-900 dark:text-slate-100">
            <Sidebar />
            <div className="flex flex-1 flex-col overflow-hidden">
                <Navbar />
                <main className="flex-1 overflow-y-auto p-5 md:p-7">
                    <div className="mx-auto max-w-5xl">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}

function Protected({ children }) {
    return (
        <ProtectedRoute>
            <AppShell>{children}</AppShell>
        </ProtectedRoute>
    );
}

export default function AppRoutes() {
    return (
        <Routes>
            {/* Public routes */}
            <Route path="/"      element={<LandingPage />} />
            <Route path="/auth"  element={<AuthPage />} />

            {/* Protected app routes */}
            <Route path="/app"   element={<Protected><Dashboard /></Protected>} />
            <Route path="/chat"  element={<Protected><ChatPage /></Protected>} />
            <Route path="/quiz"  element={<Protected><QuizPage /></Protected>} />
            <Route path="/viva"  element={<Protected><VivaPage /></Protected>} />

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

