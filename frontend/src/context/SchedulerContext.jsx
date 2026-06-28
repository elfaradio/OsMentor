import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { ALGORITHMS } from '../utils/scheduler/types';
import { generateRandomProcesses, validateProcesses } from '../utils/scheduler/helpers';
import { runSimulation } from '../utils/scheduler/frameGenerator';
import { calculateStatistics } from '../utils/scheduler/statistics';

export const SchedulerContext = createContext();

export const SchedulerProvider = ({ children }) => {
    // Input States
    const [algorithm, setAlgorithm] = useState(ALGORITHMS.FCFS);
    const [quantum, setQuantum] = useState(2);
    const [speed, setSpeed] = useState(1); // 0.5, 1, 2, 4
    
    // Processes State (Initialize with 5 random processes)
    const [processes, setProcesses] = useState(() => generateRandomProcesses(5));
    
    // Simulation Execution States
    const [simulationState, setSimulationState] = useState('idle'); // 'idle' | 'running' | 'paused' | 'finished'
    const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
    const [validationError, setValidationError] = useState(null);

    // Run the scheduler simulation to generate all frames
    const simulationResult = useMemo(() => {
        const error = validateProcesses(processes);
        if (error) {
            setValidationError(error);
            return { processes: [], frames: [] };
        }
        setValidationError(null);
        try {
            return runSimulation(algorithm, processes, quantum);
        } catch (e) {
            console.error('Error during simulation run: ', e);
            setValidationError('An unexpected error occurred during simulation.');
            return { processes: [], frames: [] };
        }
    }, [algorithm, processes, quantum]);

    const { frames } = simulationResult;

    // Derived states for the current animation frame
    const currentFrame = useMemo(() => {
        if (!frames || frames.length === 0) return null;
        if (currentFrameIndex >= frames.length) {
            return frames[frames.length - 1];
        }
        return frames[currentFrameIndex];
    }, [frames, currentFrameIndex]);

    const currentTime = currentFrame ? currentFrame.currentTime : 0;
    const cpuProcess = currentFrame ? currentFrame.cpuProcess : null;
    const readyQueue = currentFrame ? currentFrame.readyQueue : [];
    const completedQueue = currentFrame ? currentFrame.completedQueue : [];
    const ganttBlocks = currentFrame ? currentFrame.ganttBlocks : [];
    const currentProcesses = currentFrame ? currentFrame.processes : processes;
    const cpuQueueType = currentFrame ? currentFrame.cpuQueueType : null;
    const q1 = currentFrame ? currentFrame.q1 : [];
    const q2 = currentFrame ? currentFrame.q2 : [];
    const q3 = currentFrame ? currentFrame.q3 : [];

    // Calculate live statistics for the current frame
    const liveStatistics = useMemo(() => {
        return calculateStatistics(currentProcesses, ganttBlocks);
    }, [currentProcesses, ganttBlocks]);

    // Timer logic for running the simulation
    useEffect(() => {
        let intervalId = null;

        if (simulationState === 'running') {
            const stepDuration = 1000 / speed;
            intervalId = setInterval(() => {
                setCurrentFrameIndex((prevIndex) => {
                    if (prevIndex + 1 >= frames.length) {
                        setSimulationState('finished');
                        clearInterval(intervalId);
                        return prevIndex;
                    }
                    return prevIndex + 1;
                });
            }, stepDuration);
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [simulationState, speed, frames.length]);

    // Actions
    const play = useCallback(() => {
        if (validationError) return;
        if (simulationState === 'finished') {
            setCurrentFrameIndex(0);
        }
        setSimulationState('running');
    }, [validationError, simulationState]);

    const pause = useCallback(() => {
        setSimulationState('paused');
    }, []);

    const stepForward = useCallback(() => {
        if (validationError) return;
        setSimulationState('paused');
        setCurrentFrameIndex((prevIndex) => {
            if (prevIndex + 1 >= frames.length) {
                setSimulationState('finished');
                return prevIndex;
            }
            return prevIndex + 1;
        });
    }, [frames.length, validationError]);

    const resetSimulation = useCallback(() => {
        setCurrentFrameIndex(0);
        setSimulationState('idle');
    }, []);

    const updateProcesses = useCallback((newProcesses) => {
        resetSimulation();
        setProcesses(newProcesses);
    }, [resetSimulation]);

    const addProcess = useCallback((process) => {
        resetSimulation();
        setProcesses((prev) => {
            const list = [...prev, process];
            return list.sort((a, b) => a.arrivalTime - b.arrivalTime);
        });
    }, [resetSimulation]);

    const deleteProcess = useCallback((id) => {
        resetSimulation();
        setProcesses((prev) => prev.filter((p) => p.id !== id));
    }, [resetSimulation]);

    const generateRandom = useCallback((count) => {
        resetSimulation();
        const rand = generateRandomProcesses(count);
        setProcesses(rand);
    }, [resetSimulation]);

    const value = {
        algorithm,
        setAlgorithm,
        quantum,
        setQuantum,
        speed,
        setSpeed,
        processes,
        setProcesses: updateProcesses,
        addProcess,
        deleteProcess,
        generateRandom,
        
        simulationState,
        currentFrameIndex,
        totalFrames: frames.length,
        currentTime,
        cpuProcess,
        readyQueue,
        completedQueue,
        ganttBlocks,
        currentProcesses,
        cpuQueueType,
        q1,
        q2,
        q3,
        liveStatistics,
        validationError,
        setValidationError,
        
        play,
        pause,
        stepForward,
        resetSimulation,
    };

    return (
        <SchedulerContext.Provider value={value}>
            {children}
        </SchedulerContext.Provider>
    );
};
