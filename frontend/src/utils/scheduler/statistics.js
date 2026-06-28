// Calculate overall simulation statistics based on finished processes and gantt blocks
export const calculateStatistics = (processes, ganttBlocks) => {
    if (!processes || processes.length === 0) {
        return {
            avgWaitingTime: 0,
            avgTurnaroundTime: 0,
            avgResponseTime: 0,
            cpuUtilization: 0,
            throughput: 0,
            contextSwitches: 0,
        };
    }

    const n = processes.length;
    let totalWaitingTime = 0;
    let totalTurnaroundTime = 0;
    let totalResponseTime = 0;

    processes.forEach((p) => {
        totalWaitingTime += p.waitingTime || 0;
        totalTurnaroundTime += p.turnaroundTime || 0;
        totalResponseTime += p.responseTime >= 0 ? p.responseTime : 0;
    });

    const avgWaitingTime = (totalWaitingTime / n).toFixed(2);
    const avgTurnaroundTime = (totalTurnaroundTime / n).toFixed(2);
    const avgResponseTime = (totalResponseTime / n).toFixed(2);

    // Calculate total time from Gantt blocks
    let totalTime = 0;
    let idleTime = 0;

    ganttBlocks.forEach((block) => {
        const duration = block.end - block.start;
        totalTime += duration;
        if (block.id === 'idle') {
            idleTime += duration;
        }
    });

    const busyTime = totalTime - idleTime;
    const cpuUtilization = totalTime > 0 ? ((busyTime / totalTime) * 100).toFixed(2) : 0;
    const throughput = totalTime > 0 ? (n / totalTime).toFixed(3) : 0;

    // Calculate context switches (number of transitions between different actual processes)
    let contextSwitches = 0;
    let lastActiveProcess = null;

    for (let i = 0; i < ganttBlocks.length; i++) {
        const currentId = ganttBlocks[i].id;
        if (currentId !== 'idle') {
            if (lastActiveProcess !== null && lastActiveProcess !== currentId) {
                contextSwitches++;
            }
            lastActiveProcess = currentId;
        }
    }

    return {
        avgWaitingTime: Number(avgWaitingTime),
        avgTurnaroundTime: Number(avgTurnaroundTime),
        avgResponseTime: Number(avgResponseTime),
        cpuUtilization: Number(cpuUtilization),
        throughput: Number(throughput),
        contextSwitches,
    };
};
