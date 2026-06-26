import { useEffect, useState } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
    startOnLoad: false,
    theme: 'dark',
    securityLevel: 'loose',
    themeVariables: {
        darkMode: true,
        background: '#0f172a',
        primaryColor: '#6366f1', // Beautiful Indigo
        primaryTextColor: '#f8fafc',
        lineColor: '#64748b',
        secondaryColor: '#1e1b4b',
        tertiaryColor: '#1e293b',
    },
});

export default function MermaidViewer({ chart, isLoading }) {
    const [svg, setSvg] = useState('');
    const [error, setError] = useState(null);
    const [scale, setScale] = useState(1);
    const [copied, setCopied] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        let isMounted = true;
        setError(null);
        setSvg('');
        setScale(1);

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

    const handleCopy = () => {
        navigator.clipboard.writeText(chart);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        if (!svg) return;
        const blob = new Blob([svg], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `os-diagram-${Date.now()}.svg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const zoomIn = () => setScale(s => Math.min(s + 0.15, 3));
    const zoomOut = () => setScale(s => Math.max(s - 0.15, 0.4));
    const resetZoom = () => setScale(1);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-slate-300 dark:border-slate-300/40 dark:border-slate-700/40 bg-slate-50 dark:bg-slate-50/30 dark:bg-slate-900/30 py-16">
                <span className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-500/30 border-t-cyan-500" />
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Generating visual architecture diagram…</p>
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

    if (!svg) {
        return (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-500 border border-dashed border-slate-700 rounded-xl">
                <svg className="h-10 w-10 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
                <p className="text-sm">Your diagram will appear here</p>
            </div>
        );
    }

    const controlToolbar = (
        <div className="flex flex-wrap items-center gap-2 px-3 py-2 bg-slate-900/80 border border-slate-700/50 rounded-xl backdrop-blur-md shadow-lg select-none">
            {/* Zoom Controls */}
            <div className="flex items-center border-r border-slate-700/50 pr-2 mr-1 gap-1">
                <button onClick={zoomOut} title="Zoom Out" className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" /></svg>
                </button>
                <span className="text-xs font-semibold text-slate-300 w-12 text-center">{Math.round(scale * 100)}%</span>
                <button onClick={zoomIn} title="Zoom In" className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                </button>
                <button onClick={resetZoom} title="Reset Zoom" className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors text-xs font-bold px-2">
                    Reset
                </button>
            </div>

            {/* Utility Actions */}
            <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-all active:scale-[0.97]"
            >
                {copied ? (
                    <>
                        <svg className="h-3.5 w-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        <span className="text-emerald-400">Copied!</span>
                    </>
                ) : (
                    <>
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                        <span>Copy Code</span>
                    </>
                )}
            </button>

            <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-all active:scale-[0.97]"
            >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                <span>Download SVG</span>
            </button>

            <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-all active:scale-[0.97] ml-auto"
            >
                {isFullscreen ? (
                    <>
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        <span>Exit Fullscreen</span>
                    </>
                ) : (
                    <>
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 0h-4m4 0l-5 5" /></svg>
                        <span>Fullscreen</span>
                    </>
                )}
            </button>
        </div>
    );

    return (
        <>
            <div className="relative flex flex-col rounded-xl border border-slate-300 dark:border-slate-300/40 dark:border-slate-700/40 bg-slate-50 dark:bg-slate-50/30 dark:bg-slate-900/30 overflow-hidden fade-in shadow-inner">
                {/* Embedded Toolbar at Top */}
                <div className="p-3 border-b border-slate-300 dark:border-slate-700/40 bg-slate-100 dark:bg-slate-950/40 flex justify-center">
                    {controlToolbar}
                </div>

                {/* Canvas Container */}
                <div className="p-6 overflow-auto flex justify-center items-center min-h-[400px]">
                    <div 
                        className="mermaid-svg-container flex justify-center transform origin-center transition-transform duration-200 ease-out" 
                        style={{ transform: `scale(${scale})` }}
                        dangerouslySetInnerHTML={{ __html: svg }} 
                    />
                </div>
            </div>

            {/* Fullscreen Overlay Modal */}
            {isFullscreen && (
                <div className="fixed inset-0 z-50 bg-slate-950/98 backdrop-blur-md flex flex-col p-6 overflow-hidden fade-in">
                    {/* Header Controls */}
                    <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                        <div>
                            <h3 className="text-lg font-bold text-white">Visual Architecture Viewer</h3>
                            <p className="text-xs text-slate-400">Interact, zoom, or copy this operating systems architectural diagram</p>
                        </div>
                        <div className="flex gap-2">
                            {controlToolbar}
                            <button
                                onClick={() => setIsFullscreen(false)}
                                className="p-2 bg-red-600/10 hover:bg-red-600/25 border border-red-500/30 hover:border-red-500/50 text-red-400 hover:text-white rounded-xl transition-all"
                            >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Fullscreen Canvas Container */}
                    <div className="flex-1 overflow-auto flex justify-center items-center p-10 cursor-grab active:cursor-grabbing select-none">
                        <div 
                            className="transform origin-center transition-transform duration-200 ease-out"
                            style={{ transform: `scale(${scale * 1.3})` }}
                            dangerouslySetInnerHTML={{ __html: svg }}
                        />
                    </div>
                </div>
            )}
        </>
    );
}
