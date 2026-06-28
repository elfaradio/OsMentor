import { PROCESS_STATES } from './types';

export const solveRoundRobin = (inputProcesses, quantum = 2) => {
    let processes = inputProcesses.map(p => ({
        ...p,
        remainingTime: p.burstTime,
        responseTime: -1,
        state: PROCESS_STATES.NOT_ARRIVED
    })).sort((a, b) => a.arrivalTime - b.arrivalTime);

    let t = 0;
    let readyQueue = [];
    let completedQueue = [];
    let cpuProcess = null;
    let currentQuantumLeft = 0;
    let ganttBlocks = [];
    let frames = [];

    // A list of process IDs that have already been put in the readyQueue
    let enqueued = new Set();

    while (completedQueue.length < processes.length || cpuProcess) {
        // 1. Enqueue new arrivals at time t
        const arrivals = processes.filter(p => p.arrivalTime === t);
        arrivals.forEach(p => {
            if (!enqueued.has(p.id)) {
                p.state = PROCESS_STATES.READY;
                readyQueue.push(p);
                enqueued.add(p.id);
            }
        });

        // 2. Schedule next process if CPU is idle
        if (!cpuProcess && readyQueue.length > 0) {
            cpuProcess = readyQueue.shift();
            cpuProcess.state = PROCESS_STATES.RUNNING;
            currentQuantumLeft = quantum;
            if (cpuProcess.responseTime === -1) {
                cpuProcess.responseTime = t - cpuProcess.arrivalTime;
            }
        }

        // 3. Record frame
        frames.push({
            currentTime: t,
            cpuProcess: cpuProcess ? { ...cpuProcess } : null,
            readyQueue: readyQueue.map(p => ({ ...p })),
            completedQueue: completedQueue.map(p => ({ ...p })),
            processes: processes.map(p => {
                const active = cpuProcess && p.id === cpuProcess.id ? cpuProcess : p;
                const completed = completedQueue.find(c => c.id === p.id);
                return completed ? { ...completed } : { ...active };
            }),
            ganttBlocks: ganttBlocks.map(b => ({ ...b }))
        });

        // 4. Run execution for 1 tick [t, t+1)
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
            currentQuantumLeft -= 1;

            // Check if finished or quantum expired
            if (cpuProcess.remainingTime === 0) {
                cpuProcess.state = PROCESS_STATES.COMPLETED;
                cpuProcess.completionTime = t + 1;
                cpuProcess.turnaroundTime = cpuProcess.completionTime - cpuProcess.arrivalTime;
                cpuProcess.waitingTime = cpuProcess.turnaroundTime - cpuProcess.burstTime;
                completedQueue.push(cpuProcess);
                cpuProcess = null;
            } else if (currentQuantumLeft === 0) {
                cpuProcess.state = PROCESS_STATES.READY;
                
                // Add arrivals at t+1 first
                const nextTickArrivals = processes.filter(p => p.arrivalTime === t + 1);
                nextTickArrivals.forEach(p => {
                    if (!enqueued.has(p.id)) {
                        p.state = PROCESS_STATES.READY;
                        readyQueue.push(p);
                        enqueued.add(p.id);
                    }
                });
                
                // Push preempted process to the tail
                readyQueue.push(cpuProcess);
                cpuProcess = null;
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
