import React from 'react';
import { useScheduler } from '../../hooks/useScheduler';
import { ALGORITHMS } from '../../utils/scheduler/types';

export default function AlgorithmSelector() {
    const { algorithm, setAlgorithm, quantum, setQuantum, simulationState } = useScheduler();

    const isQuantumRequired = algorithm === ALGORITHMS.ROUND_ROBIN || algorithm === ALGORITHMS.MLQ;

    return (
        <div className="space-y-4">
            <div>
                <label className="field-label" htmlFor="algo-select">Scheduling Algorithm</label>
                <select
                    id="algo-select"
                    className="input-field"
                    value={algorithm}
                    onChange={(e) => setAlgorithm(e.target.value)}
                    disabled={simulationState === 'running'}
                >
                    <option value={ALGORITHMS.FCFS}>First Come, First Served (FCFS)</option>
                    <option value={ALGORITHMS.SJF}>Shortest Job First (SJF) [Non-Preemptive]</option>
                    <option value={ALGORITHMS.SRTF}>Shortest Remaining Time First (SRTF)</option>
                    <option value={ALGORITHMS.PRIORITY}>Priority [Non-Preemptive]</option>
                    <option value={ALGORITHMS.PRIORITY_PREEMPTIVE}>Priority [Preemptive]</option>
                    <option value={ALGORITHMS.ROUND_ROBIN}>Round Robin (RR)</option>
                    <option value={ALGORITHMS.HRRN}>Highest Response Ratio Next (HRRN)</option>
                    <option value={ALGORITHMS.MLQ}>Multilevel Queue (MLQ)</option>
                    <option value={ALGORITHMS.MLFQ}>Multilevel Feedback Queue (MLFQ)</option>
                </select>
            </div>

            {isQuantumRequired && (
                <div className="fade-in">
                    <label className="field-label" htmlFor="quantum-input">Time Quantum</label>
                    <input
                        id="quantum-input"
                        type="number"
                        min="1"
                        className="input-field"
                        value={quantum}
                        onChange={(e) => setQuantum(Math.max(1, parseInt(e.target.value) || 1))}
                        disabled={simulationState === 'running'}
                        placeholder="Enter quantum (e.g. 2)"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">
                        {algorithm === ALGORITHMS.MLQ 
                            ? 'Time quantum applies to the high-priority queue (Queue 1).' 
                            : 'Process time slice interval before preemption.'}
                    </p>
                </div>
            )}
        </div>
    );
}
