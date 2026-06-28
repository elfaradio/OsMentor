import { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';

export default function ChatWindow({ messages, isLoading, userPhotoURL, userDisplayName }) {
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    return (
        <section
            className="flex flex-col rounded-xl overflow-hidden"
            style={{
                background: 'rgba(10,17,32,0.6)',
                border: '1px solid rgba(51,65,85,0.4)',
                backdropFilter: 'blur(16px)',
                minHeight: '420px',
                maxHeight: '65vh',
            }}
        >
            {/* Header bar */}
            <div
                className="flex items-center gap-2 px-4 py-2.5 shrink-0"
                style={{ borderBottom: '1px solid rgba(51,65,85,0.35)', background: 'rgba(15,23,42,0.5)' }}
            >
                <div className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#ef4444', opacity: 0.6 }} />
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#f59e0b', opacity: 0.6 }} />
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#22c55e', opacity: 0.6 }} />
                </div>
                <span className="text-[11px] font-medium text-slate-500 ml-1">OSMentor Chat</span>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => (
                    <MessageBubble
                        key={`${message.role}-${index}`}
                        role={message.role}
                        content={message.content}
                        userPhotoURL={userPhotoURL}
                        userDisplayName={userDisplayName}
                    />
                ))}

                {isLoading && (
                    <div className="flex items-end gap-2.5 fade-in">
                        <div
                            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
                            style={{ background: 'linear-gradient(135deg,#1e293b,#334155)', border: '1px solid rgba(51,65,85,0.6)' }}
                        >
                            <svg className="h-3.5 w-3.5 text-slate-600 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                        </div>
                        <div
                            className="rounded-2xl rounded-bl-sm px-4 py-3"
                            style={{ background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(51,65,85,0.4)' }}
                        >
                            <div className="flex items-center gap-1.5">
                                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-400" style={{ animationDelay: '0ms' }} />
                                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-400" style={{ animationDelay: '150ms' }} />
                                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-400" style={{ animationDelay: '300ms' }} />
                                <span className="ml-1 text-xs text-slate-500">Thinking…</span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={bottomRef} />
            </div>
        </section>
    );
}
