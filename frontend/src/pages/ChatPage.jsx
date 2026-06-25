import { useState } from 'react';
import ChatInput from '../components/Chat/ChatInput';
import ChatWindow from '../components/Chat/ChatWindow';
import { chat } from '../services/ragService';

export default function ChatPage() {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: "Hello! I'm OSMentor AI, your Operating Systems tutor. Ask me anything about processes, memory management, scheduling, deadlocks, file systems, or any other OS concept — I'll give you a detailed, textbook-grounded answer!" },
    ]);
    const [loading, setLoading] = useState(false);

    const onSend = async (question) => {
        setMessages((prev) => [...prev, { role: 'user', content: question }]);
        setLoading(true);
        try {
            const response = await chat(question);
            setMessages((prev) => [...prev, { role: 'assistant', content: response.answer }]);
        } catch {
            setMessages((prev) => [...prev, { role: 'assistant', content: "I'm having trouble connecting to the server. Please check your backend is running and try again." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-4 h-full fade-in">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div
                    className="flex h-9 w-9 items-center justify-center rounded-xl"
                    style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', boxShadow: '0 0 16px rgba(99,102,241,0.25)' }}
                >
                    <svg className="h-4.5 w-4.5 text-slate-900 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ width: '1.125rem', height: '1.125rem' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                </div>
                <div>
                    <h2 className="text-2xl font-bold gradient-text tracking-tight">AI Chat</h2>
                    <p className="text-sm text-slate-500 mt-0.5">Powered by RAG with your OS textbooks</p>
                </div>
            </div>
            <ChatWindow messages={messages} isLoading={loading} />
            <ChatInput onSend={onSend} disabled={loading} />
        </div>
    );
}
