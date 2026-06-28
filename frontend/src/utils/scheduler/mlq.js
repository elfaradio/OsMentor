import { PROCESS_STATES } from './types';

export const solveMLQ = (inputProcesses, quantum = 2) => {
    let processes = inputProcesses.map(p => ({
        ...p,
        remainingTime: p.burstTime,
        responseTime: -1,
        state: PROCESS_STATES.NOT_ARRIVED
    })).sort((a, b) => a.arrivalTime - b.arrivalTime);

    let t = 0;
    let q1 = []; // High Priority (Priority <= 2) - Round Robin
    let q2 = []; // Low Priority (Priority > 2) - FCFS
    let completedQueue = [];
    let cpuProcess = null;
    let cpuQueueType = null; // 'q1' or 'q2'
    let currentQuantumLeft = 0;
    let ganttBlocks = [];
    let frames = [];

    let enqueued = new Set();

    while (completedQueue.length < processes.length || cpuProcess) {
        // 1. Enqueue new arrivals
        const arrivals = processes.filter(p => p.arrivalTime === t);
        arrivals.forEach(p => {
            if (!enqueued.has(p.id)) {
                p.state = PROCESS_STATES.READY;
                if (p.priority <= 2) {
                    q1.push(p);
                } else {
                    q2.push(p);
                }
                enqueued.add(p.id);
            }
        });

        // 2. Preemption Check: High Priority (q1) strictly preempts Low Priority (q2)
        if (cpuProcess && cpuQueueType === 'q2' && q1.length > 0) {
            // Preempt the FCFS Q2 process
            cpuProcess.state = PROCESS_STATES.READY;
            // Put it back at the front of Q2 so it resumes first later
            q2.unshift(cpuProcess);
            cpuProcess = null;
            cpuQueueType = null;
        }

        // 3. Schedule next process
        if (!cpuProcess) {
            if (q1.length > 0) {
                cpuProcess = q1.shift();
                cpuProcess.state = PROCESS_STATES.RUNNING;
                cpuQueueType = 'q1';
                currentQuantumLeft = quantum;
                if (cpuProcess.responseTime === -1) {
                    cpuProcess.responseTime = t - cpuProcess.arrivalTime;
                }
            } else if (q2.length > 0) {
                cpuProcess = q2.shift();
                cpuProcess.state = PROCESS_STATES.RUNNING;
                cpuQueueType = 'q2';
                if (cpuProcess.responseTime === -1) {
                    cpuProcess.responseTime = t - cpuProcess.arrivalTime;
                }
            }
        }

        // 4. Record frame
        // Combine q1 and q2 into a single readyQueue representation for display, or show their distinct queues
        frames.push({
            currentTime: t,
            cpuProcess: cpuProcess ? { ...cpuProcess } : null,
            cpuQueueType,
            // We can attach specialized queue structures for multilevel display!
            q1: q1.map(p => ({ ...p })),
            q2: q2.map(p => ({ ...p })),
            readyQueue: [...q1, ...q2].map(p => ({ ...p })), // Flat ready queue fallback
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
            
            if (cpuQueueType === 'q1') {
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
            } else if (cpuQueueType === 'q1' && currentQuantumLeft === 0) {
                // Quantum expired for Q1
                cpuProcess.state = PROCESS_STATES.READY;
                
                // Add new arrivals at t+1 first
                const nextTickArrivals = processes.filter(p => p.arrivalTime === t + 1);
                nextTickArrivals.forEach(p => {
                    if (!enqueued.has(p.id)) {
                        p.state = PROCESS_STATES.READY;
                        if (p.priority <= 2) {
                            q1.push(p);
                        } else {
                            q2.push(p);
                        }
                        enqueued.add(p.id);
                    }
                });
                
                // Push Q1 process back to Q1
                q1.push(cpuProcess);
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
