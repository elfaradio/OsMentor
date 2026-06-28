import React from 'react';
import { useScheduler } from '../../hooks/useScheduler';

export default function SpeedController() {
    const { speed, setSpeed } = useScheduler();

    return (
        <div>
            <label className="field-label">Simulation Speed</label>
            <div className="grid grid-cols-4 gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
                {[0.5, 1, 2, 4].map((s) => (
                    <button
                        key={s}
                        type="button"
                        className={`py-1 text-xs font-semibold rounded-md transition-all ${
                            speed === s
                                ? 'bg-gradient-to-r from-cyan-500 to-sky-500 text-white shadow-md shadow-cyan-500/25'
                                : 'text-slate-400 hover:text-slate-200'
                        }`}
                        onClick={() => setSpeed(s)}
                    >
                        {s}x
                    </button>
                ))}
            </div>
        </div>
    );
}
