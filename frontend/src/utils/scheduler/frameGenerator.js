import { solveFCFS } from './fcfs';
import { solveSJF } from './sjf';
import { solveSRTF } from './srtf';
import { solvePriority } from './priority';
import { solvePriorityPreemptive } from './priorityPreemptive';
import { solveRoundRobin } from './roundRobin';
import { solveHRRN } from './hrrn';
import { solveMLQ } from './mlq';
import { solveMLFQ } from './mlfq';
import { ALGORITHMS } from './types';

export const runSimulation = (algorithm, processes, quantum) => {
    switch (algorithm) {
        case ALGORITHMS.FCFS:
            return solveFCFS(processes);
        case ALGORITHMS.SJF:
            return solveSJF(processes);
        case ALGORITHMS.SRTF:
            return solveSRTF(processes);
        case ALGORITHMS.PRIORITY:
            return solvePriority(processes);
        case ALGORITHMS.PRIORITY_PREEMPTIVE:
            return solvePriorityPreemptive(processes);
        case ALGORITHMS.ROUND_ROBIN:
            return solveRoundRobin(processes, quantum);
        case ALGORITHMS.HRRN:
            return solveHRRN(processes);
        case ALGORITHMS.MLQ:
            return solveMLQ(processes, quantum);
        case ALGORITHMS.MLFQ:
            return solveMLFQ(processes);
        default:
            return solveFCFS(processes);
    }
};
