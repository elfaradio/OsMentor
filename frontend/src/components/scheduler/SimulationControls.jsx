import React, { useState } from 'react';
import { useScheduler } from '../../hooks/useScheduler';
import AlgorithmSelector from './AlgorithmSelector';
import SpeedController from './SpeedController';

export default function SimulationControls() {
    const {
        simulationState,
        play,
        pause,
        stepForward,
        resetSimulation,
        generateRandom,
        validationError,
    } = useScheduler();

    const [randomCount, setRandomCount] = useState(5);

    return (
        <div className="space-y-6">
            {/* Algorithm Selector */}
            <AlgorithmSelector />

            <div className="divider" />

            {/* Simulation Speed */}
            <SpeedController />

            {/* Playback Buttons */}
            <div>
                <label className="field-label">Controls</label>
                <div className="grid grid-cols-2 gap-2 mb-2">
                    {simulationState === 'running' ? (
                        <button
                            type="button"
                            className="btn-secondary flex items-center justify-center gap-1.5"
                            onClick={pause}
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Pause
                        </button>
                    ) : (
                        <button
                            type="button"
                            className="btn-primary flex items-center justify-center gap-1.5"
                            onClick={play}
                            disabled={!!validationError}
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {simulationState === 'finished' ? 'Replay' : 'Play'}
                        </button>
                    )}

                    <button
                        type="button"
                        className="btn-secondary flex items-center justify-center gap-1.5"
                        onClick={stepForward}
                        disabled={simulationState === 'finished' || !!validationError}
                        title="Step Forward (1 tick)"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                        </svg>
                        Step
                    </button>
                </div>

                <button
                    type="button"
                    className="btn-secondary w-full flex items-center justify-center gap-1.5"
                    onClick={resetSimulation}
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18.2" />
                    </svg>
                    Reset Simulation
                </button>
            </div>

            <div className="divider" />

            {/* Random Generator in Controls */}
            <div>
                <label className="field-label">Random Process Generator</label>
                <div className="flex items-center gap-2">
                    <select
                        className="input-field py-1.5 text-xs w-24"
                        value={randomCount}
                        onChange={(e) => setRandomCount(Number(e.target.value))}
                        disabled={simulationState === 'running'}
                    >
                        <option value={5}>5 Processes</option>
                        <option value={10}>10 Processes</option>
                        <option value={15}>15 Processes</option>
                        <option value={20}>20 Processes</option>
                    </select>
                    <button
                        type="button"
                        className="btn-secondary text-xs flex-1 py-2"
                        onClick={() => generateRandom(randomCount)}
                        disabled={simulationState === 'running'}
                    >
                        Generate Random
                    </button>
                </div>
            </div>
        </div>
    );
}
