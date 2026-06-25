export default function CitationCard({ citation }) {
    return (
        <article className="rounded-lg border border-slate-300 dark:border-slate-300/40 dark:border-slate-700/40 bg-slate-200 dark:bg-slate-800/30 p-3 text-xs transition-all hover:border-indigo-500/30 hover:bg-slate-200 dark:bg-slate-200/50 dark:bg-slate-800/50">
            <div className="flex items-start gap-2">
                <svg className="mt-0.5 h-3 w-3 shrink-0 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-indigo-300">{citation.source}</p>
                    <p className="mt-0.5 text-slate-500">Page {citation.page}</p>
                    {citation.excerpt && (
                        <p className="mt-1.5 line-clamp-2 text-slate-600 dark:text-slate-400 leading-relaxed">{citation.excerpt}</p>
                    )}
                </div>
            </div>
        </article>
    );
}
