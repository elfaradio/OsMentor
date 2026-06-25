export default function Loader() {
    return (
        <div className="inline-flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
            <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
            <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-300 [animation-delay:120ms]" />
            <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-200 [animation-delay:240ms]" />
            <span>Thinking...</span>
        </div>
    );
}
