import { useEffect, useState } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
    startOnLoad: false,
    theme: 'dark',
    securityLevel: 'loose',
    themeVariables: {
        darkMode: true,
        background: '#0f172a',
        primaryColor: '#06b6d4',
        primaryTextColor: '#e2e8f0',
        lineColor: '#475569',
        secondaryColor: '#1e293b',
        tertiaryColor: '#1e293b',
    },
});

export default function MermaidViewer({ chart, isLoading }) {
    const [svg, setSvg] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;
        setError(null);
        setSvg('');

        const render = async () => {
            if (!chart) return;
            const id = `diagram-${Math.random().toString(36).slice(2, 9)}`;
            try {
                const { svg: rendered } = await mermaid.render(id, chart);
                if (isMounted) setSvg(rendered);
            } catch (err) {
                console.error('Mermaid render error:', err);
                if (isMounted) setError('Diagram syntax error — raw code shown below.');
                const badEl = document.getElementById(id);
                if (badEl) badEl.remove();
            }
        };
        render();
        return () => { isMounted = false; };
    }, [chart]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-slate-300 dark:border-slate-300/40 dark:border-slate-700/40 bg-slate-50 dark:bg-slate-50/30 dark:bg-slate-900/30 py-16">
                <span className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-500/30 border-t-cyan-500" />
                <p className="text-sm text-slate-600 dark:text-slate-400">Generating diagram…</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-3 rounded-xl border border-red-500/20 bg-red-950/20 p-4 fade-in">
                <div className="flex items-center gap-2 text-sm font-semibold text-red-400">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {error}
                </div>
                <pre className="overflow-x-auto rounded-lg bg-slate-100 dark:bg-slate-950 p-3 text-xs text-slate-600 dark:text-slate-400 font-mono leading-relaxed">{chart}</pre>
            </div>
        );
    }

    return (
        <div className="flex justify-center rounded-xl border border-slate-300 dark:border-slate-300/40 dark:border-slate-700/40 bg-slate-50 dark:bg-slate-50/30 dark:bg-slate-900/30 p-6 overflow-x-auto fade-in">
            {svg ? (
                <div className="w-full flex justify-center" dangerouslySetInnerHTML={{ __html: svg }} />
            ) : (
                <div className="flex flex-col items-center justify-center gap-3 py-10 text-slate-500">
                    <svg className="h-10 w-10 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                    <p className="text-sm">Your diagram will appear here</p>
                </div>
            )}
        </div>
    );
}
