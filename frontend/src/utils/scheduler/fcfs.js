import { PROCESS_STATES } from './types';

export const solveFCFS = (inputProcesses) => {
    // Clone inputs
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
    let ganttBlocks = [];
    let frames = [];

    // Run tick by tick
    while (completedQueue.length < processes.length || cpuProcess) {
        // 1. Identify newly arrived processes at time t
        const arrivals = processes.filter(p => p.arrivalTime === t);
        arrivals.forEach(p => {
            p.state = PROCESS_STATES.READY;
            readyQueue.push(p);
        });

        // 2. If CPU is idle, schedule the first process from ready queue
        if (!cpuProcess && readyQueue.length > 0) {
            cpuProcess = readyQueue.shift();
            cpuProcess.state = PROCESS_STATES.RUNNING;
            if (cpuProcess.responseTime === -1) {
                cpuProcess.responseTime = t - cpuProcess.arrivalTime;
            }
        }

        // 3. Record snapshot of the state at time t
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

        // 4. Execute for 1 tick (time interval [t, t+1))
        if (cpuProcess) {
            // Update Gantt blocks
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
            if (cpuProcess.remainingTime === 0) {
                cpuProcess.state = PROCESS_STATES.COMPLETED;
                cpuProcess.completionTime = t + 1;
                cpuProcess.turnaroundTime = cpuProcess.completionTime - cpuProcess.arrivalTime;
                cpuProcess.waitingTime = cpuProcess.turnaroundTime - cpuProcess.burstTime;
                completedQueue.push(cpuProcess);
                cpuProcess = null;
            }
        } else {
            // Idle time: create an idle Gantt block if needed
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

    // Add final finished frame at time t
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
