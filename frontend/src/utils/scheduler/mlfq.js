import { PROCESS_STATES } from './types';

export const solveMLFQ = (inputProcesses) => {
    let processes = inputProcesses.map(p => ({
        ...p,
        remainingTime: p.burstTime,
        responseTime: -1,
        state: PROCESS_STATES.NOT_ARRIVED
    })).sort((a, b) => a.arrivalTime - b.arrivalTime);

    let t = 0;
    let q1 = []; // RR, Q = 2
    let q2 = []; // RR, Q = 4
    let q3 = []; // FCFS
    let completedQueue = [];
    let cpuProcess = null;
    let cpuQueueType = null; // 'q1', 'q2', or 'q3'
    let currentQuantumLeft = 0;
    let ganttBlocks = [];
    let frames = [];

    let enqueued = new Set();

    while (completedQueue.length < processes.length || cpuProcess) {
        // 1. Enqueue new arrivals into Q1
        const arrivals = processes.filter(p => p.arrivalTime === t);
        arrivals.forEach(p => {
            if (!enqueued.has(p.id)) {
                p.state = PROCESS_STATES.READY;
                q1.push(p);
                enqueued.add(p.id);
            }
        });

        // 2. Preemption Checks (Strict priority: Q1 > Q2 > Q3)
        if (cpuProcess) {
            if (cpuQueueType === 'q3' && (q1.length > 0 || q2.length > 0)) {
                // Preempt Q3 process, put back to front of Q3
                cpuProcess.state = PROCESS_STATES.READY;
                q3.unshift(cpuProcess);
                cpuProcess = null;
                cpuQueueType = null;
            } else if (cpuQueueType === 'q2' && q1.length > 0) {
                // Preempt Q2 process, put back to front of Q2
                cpuProcess.state = PROCESS_STATES.READY;
                q2.unshift(cpuProcess);
                cpuProcess = null;
                cpuQueueType = null;
            }
        }

        // 3. Schedule next process
        if (!cpuProcess) {
            if (q1.length > 0) {
                cpuProcess = q1.shift();
                cpuProcess.state = PROCESS_STATES.RUNNING;
                cpuQueueType = 'q1';
                currentQuantumLeft = 2;
                if (cpuProcess.responseTime === -1) {
                    cpuProcess.responseTime = t - cpuProcess.arrivalTime;
                }
            } else if (q2.length > 0) {
                cpuProcess = q2.shift();
                cpuProcess.state = PROCESS_STATES.RUNNING;
                cpuQueueType = 'q2';
                currentQuantumLeft = 4;
                if (cpuProcess.responseTime === -1) {
                    cpuProcess.responseTime = t - cpuProcess.arrivalTime;
                }
            } else if (q3.length > 0) {
                cpuProcess = q3.shift();
                cpuProcess.state = PROCESS_STATES.RUNNING;
                cpuQueueType = 'q3';
                currentQuantumLeft = Infinity;
                if (cpuProcess.responseTime === -1) {
                    cpuProcess.responseTime = t - cpuProcess.arrivalTime;
                }
            }
        }

        // 4. Record frame
        frames.push({
            currentTime: t,
            cpuProcess: cpuProcess ? { ...cpuProcess } : null,
            cpuQueueType,
            q1: q1.map(p => ({ ...p })),
            q2: q2.map(p => ({ ...p })),
            q3: q3.map(p => ({ ...p })),
            readyQueue: [...q1, ...q2, ...q3].map(p => ({ ...p })), // Flat ready queue fallback
            completedQueue: completedQueue.map(p => ({ ...p })),
            processes: processes.map(p => {
                const active = cpuProcess && p.id === cpuProcess.id ? cpuProcess : p;
                const completed = completedQueue.find(c => c.id === p.id);
                return completed ? { ...completed } : { ...active };
            }),
            ganttBlocks: ganttBlocks.map(b => ({ ...b }))
        });

        // 5. Execute 1 tick
        if (cpuProcess) {
            let lastBlock = ganttBlocks[ganttBlocks.length - 1];
            if (lastBlock && lastBlock.id === cpuProcess.id && lastBlock.end === t) {
                lastBlock.end = t + 1;
            } else {
                ganttBlocks.push({
                    id: cpuProcess.id,
                    start: t,
                    end: t + 1,
                    color: cpuProcess.color
                });
            }

            cpuProcess.remainingTime -= 1;
            if (cpuQueueType !== 'q3') {
                currentQuantumLeft -= 1;
            }

            if (cpuProcess.remainingTime === 0) {
                cpuProcess.state = PROCESS_STATES.COMPLETED;
                cpuProcess.completionTime = t + 1;
                cpuProcess.turnaroundTime = cpuProcess.completionTime - cpuProcess.arrivalTime;
                cpuProcess.waitingTime = cpuProcess.turnaroundTime - cpuProcess.burstTime;
                completedQueue.push(cpuProcess);
                cpuProcess = null;
                cpuQueueType = null;
            } else if (currentQuantumLeft === 0) {
                // Quantum expired
                cpuProcess.state = PROCESS_STATES.READY;
                
                // Enqueue any arrivals at t+1 to Q1 first
                const nextTickArrivals = processes.filter(p => p.arrivalTime === t + 1);
                nextTickArrivals.forEach(p => {
                    if (!enqueued.has(p.id)) {
                        p.state = PROCESS_STATES.READY;
                        q1.push(p);
                        enqueued.add(p.id);
                    }
                });

                // Demote process
                if (cpuQueueType === 'q1') {
                    q2.push(cpuProcess);
                } else if (cpuQueueType === 'q2') {
                    q3.push(cpuProcess);
                }
                
                cpuProcess = null;
                cpuQueueType = null;
            }
        } else {
            let lastBlock = ganttBlocks[ganttBlocks.length - 1];
            if (lastBlock && lastBlock.id === 'idle' && lastBlock.end === t) {
                lastBlock.end = t + 1;
            } else {
                ganttBlocks.push({
                    id: 'idle',
                    start: t,
                    end: t + 1,
                    color: '#475569'
                });
            }
        }

        t++;
    }

    frames.push({
        currentTime: t,
        cpuProcess: null,
        q1: [],
        q2: [],
        q3: [],
        readyQueue: [],
        completedQueue: completedQueue.map(p => ({ ...p })),
        processes: completedQueue.map(p => ({ ...p })),
        ganttBlocks: ganttBlocks.map(b => ({ ...b }))
    });

    return {
        processes: completedQueue.sort((a, b) => a.id.localeCompare(b.id)),
        frames
    };
};
