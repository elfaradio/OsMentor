import { PROCESS_STATES } from './types';

// Generate a visually distinct color for each process
export const getProcessColor = (index) => {
    // Curated high-contrast aesthetic colors for dark mode (cyan, indigo, violet, emerald, amber, rose, sky, purple, teal, pink)
    const presetColors = [
        '#22d3ee', // Cyan
        '#818cf8', // Indigo
        '#a78bfa', // Violet
        '#34d399', // Emerald
        '#fbbf24', // Amber
        '#fb7185', // Rose
        '#38bdf8', // Sky
        '#c084fc', // Purple
        '#2dd4bf', // Teal
        '#f472b6', // Pink
        '#60a5fa', // Blue
        '#a3e635', // Lime
        '#fb923c', // Orange
        '#f87171', // Red
    ];
    if (index < presetColors.length) {
        return presetColors[index];
    }
    // Fallback dynamic HSL generation
    return `hsl(${(index * 137.5) % 360}, 75%, 60%)`;
};

// Generate random processes
export const generateRandomProcesses = (count = 5) => {
    const processes = [];
    for (let i = 0; i < count; i++) {
        const id = `P${i + 1}`;
        // Ensure at least one process starts at time 0
        const arrivalTime = i === 0 ? 0 : Math.floor(Math.random() * 10);
        const burstTime = Math.floor(Math.random() * 8) + 1; // 1 to 8
        const priority = Math.floor(Math.random() * 5) + 1; // 1 to 5

        processes.push({
            id,
            arrivalTime,
            burstTime,
            priority,
            remainingTime: burstTime,
            completionTime: 0,
            waitingTime: 0,
            turnaroundTime: 0,
            responseTime: -1, // -1 indicates not yet scheduled
            state: PROCESS_STATES.NOT_ARRIVED,
            color: getProcessColor(i),
        });
    }
    // Sort processes by arrival time initially for ease of use
    return processes.sort((a, b) => a.arrivalTime - b.arrivalTime);
};

// Validate processes inputs
export const validateProcesses = (processes) => {
    if (!processes || processes.length === 0) {
        return 'Please add at least one process to simulate.';
    }

    for (let i = 0; i < processes.length; i++) {
        const p = processes[i];
        if (p.arrivalTime === undefined || p.arrivalTime === null || p.arrivalTime === '' || isNaN(p.arrivalTime)) {
            return `Process ${p.id} has an invalid arrival time.`;
        }
        if (Number(p.arrivalTime) < 0) {
            return `Process ${p.id}: Arrival time must be >= 0.`;
        }
        if (p.burstTime === undefined || p.burstTime === null || p.burstTime === '' || isNaN(p.burstTime)) {
            return `Process ${p.id} has an invalid burst time.`;
        }
        if (Number(p.burstTime) <= 0) {
            return `Process ${p.id}: Burst time must be > 0.`;
        }
        if (p.priority === undefined || p.priority === null || p.priority === '' || isNaN(p.priority)) {
            return `Process ${p.id} has an invalid priority.`;
        }
        if (Number(p.priority) < 0) {
            return `Process ${p.id}: Priority must be >= 0.`;
        }
    }
    return null; // No errors
};
