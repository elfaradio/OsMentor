// Define the process model fields and states for the CPU Scheduler

/**
 * @typedef {Object} Process
 * @property {string|number} id - Unique identifier (e.g., 'P1', 'P2')
 * @property {number} arrivalTime - Time the process enters the system (>= 0)
 * @property {number} burstTime - Total CPU execution time required (> 0)
 * @property {number} priority - Priority value (lower value = higher priority, >= 0)
 * @property {number} remainingTime - Time left to complete execution
 * @property {number} completionTime - Time when execution finished
 * @property {number} waitingTime - Total time spent waiting in ready queue (TAT - BT)
 * @property {number} turnaroundTime - Total time from arrival to completion (CT - AT)
 * @property {number} responseTime - Time from arrival to first execution start
 * @property {'not_arrived'|'ready'|'running'|'completed'} state - Current state
 * @property {string} color - Hex or HSL color string for UI visualization
 */

export const PROCESS_STATES = {
    NOT_ARRIVED: 'not_arrived',
    READY: 'ready',
    RUNNING: 'running',
    COMPLETED: 'completed',
};

export const ALGORITHMS = {
    FCFS: 'fcfs',
    SJF: 'sjf',
    SRTF: 'srtf',
    PRIORITY: 'priority',
    PRIORITY_PREEMPTIVE: 'priorityPreemptive',
    ROUND_ROBIN: 'roundRobin',
    HRRN: 'hrrn',
    MLQ: 'mlq',
    MLFQ: 'mlfq',
};
