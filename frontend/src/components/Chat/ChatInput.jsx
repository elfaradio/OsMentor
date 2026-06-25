import { useState } from 'react';

const SUGGESTIONS = [
    'What is a process?',
    'Explain deadlock prevention',
    'How does paging work?',
    'Compare mutex and semaphore',
];

export default function ChatInput({ onSend, disabled }) {
    const [value, setValue] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(true);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!value.trim() || disabled) return;
        setShowSuggestions(false);
        onSend(value.trim());
        setValue('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const handleSuggestion = (s) => {
        setShowSuggestions(false);
        onSend(s);
    };

    return (
        <div className="space-y-2">
            {/* Quick suggestions */}
            {showSuggestions && (
                <div className="flex flex-wrap gap-1.5 fade-in">
                    {SUGGESTIONS.map((s) => (
                        <button
                            key={s}
                            type="button"
                            onClick={() => handleSuggestion(s)}
                            disabled={disabled}
                            className="text-xs px-2.5 py-1 rounded-lg transition-all"
                            style={{
                                background: 'rgba(15,23,42,0.7)',
                                border: '1px solid rgba(51,65,85,0.5)',
                                color: '#64748b',
                                cursor: 'pointer',
                            }}
                            onMouseEnter={(e) => { e.target.style.color = '#22d3ee'; e.target.style.borderColor = 'rgba(34,211,238,0.3)'; }}
                            onMouseLeave={(e) => { e.target.style.color = '#64748b'; e.target.style.borderColor = 'rgba(51,65,85,0.5)'; }}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            )}

            {/* Input form */}
            <form
                onSubmit={handleSubmit}
                className="flex items-end gap-3 rounded-xl p-3"
                style={{
                    background: 'rgba(15,23,42,0.7)',
                    border: '1px solid rgba(51,65,85,0.45)',
                    backdropFilter: 'blur(12px)',
                }}
            >
                <textarea
                    rows={1}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about processes, scheduling, memory, deadlocks… (Enter to send)"
                    disabled={disabled}
                    className="flex-1 resize-none bg-transparent border-none outline-none text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-600 min-h-[24px] max-h-[120px] overflow-y-auto leading-relaxed"
                    onInput={(e) => {
                        e.target.style.height = 'auto';
                        e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                    }}
                />
                <button
                    type="submit"
                    disabled={disabled || !value.trim()}
                    className="btn-primary shrink-0 h-9 w-9 rounded-lg p-0 flex items-center justify-center"
                >
                    {disabled ? (
                        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    ) : (
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    )}
                </button>
            </form>
            <p className="text-[10px] text-slate-600 text-center">Shift+Enter for new line · Enter to send</p>
        </div>
    );
}
