import { Navigate, Route, Routes } from 'react-router-dom';
import Sidebar from '../components/Common/Sidebar';
import Navbar from '../components/Common/Navbar';
import Dashboard from '../pages/Dashboard';
import ChatPage from '../pages/ChatPage';
import QuizPage from '../pages/QuizPage';
import VivaPage from '../pages/VivaPage';


export default function AppRoutes() {
    return (
        <div className="flex h-screen overflow-hidden bg-transparent text-slate-900 dark:text-slate-100">
            <Sidebar />
            <div className="flex flex-1 flex-col overflow-hidden">
                <Navbar />
                <main className="flex-1 overflow-y-auto p-5 md:p-7">
                    <div className="mx-auto max-w-5xl">
                        <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/chat" element={<ChatPage />} />
                            <Route path="/quiz" element={<QuizPage />} />
                            <Route path="/viva" element={<VivaPage />} />

                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </div>
                </main>
            </div>
        </div>
    );
}
