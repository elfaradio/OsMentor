export default function MessageBubble({ role, content }) {
    const isUser = role === 'user';
    return (
        <div className={`flex items-end gap-2.5 fade-in ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
            {/* Avatar */}
            <div
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
                style={
                    isUser
                        ? { background: 'linear-gradient(135deg,#0891b2,#6366f1)', color: '#fff' }
                        : { background: 'linear-gradient(135deg,#1e293b,#334155)', color: '#94a3b8', border: '1px solid rgba(51,65,85,0.6)' }
                }
            >
                {isUser ? 'U' : (
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                )}
            </div>

            {/* Bubble */}
            <div
                className={`max-w-[78%] rounded-2xl px-4 py-3 ${isUser ? 'rounded-br-sm' : 'rounded-bl-sm'}`}
                style={
                    isUser
                        ? {
                            background: 'linear-gradient(135deg, #0891b2 0%, #4f46e5 100%)',
                            color: '#fff',
                            boxShadow: '0 4px 16px rgba(8,145,178,0.2)',
                            fontSize: '0.875rem',
                            lineHeight: '1.6',
                          }
                        : {
                            background: 'rgba(30,41,59,0.8)',
                            border: '1px solid rgba(51,65,85,0.45)',
                            color: '#cbd5e1',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
                          }
                }
            >
                {isUser ? (
                    <p style={{ fontSize: '0.875rem', lineHeight: '1.6', margin: 0 }}>{content}</p>
                ) : (
                    <p className="prose-answer" style={{ margin: 0 }}>{content}</p>
                )}
            </div>
        </div>
    );
}
