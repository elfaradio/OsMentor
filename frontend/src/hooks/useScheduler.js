import { useContext } from 'react';
import { SchedulerContext } from '../context/SchedulerContext';

export const useScheduler = () => {
    const context = useContext(SchedulerContext);
    if (!context) {
        throw new Error('useScheduler must be used within a SchedulerProvider');
    }
    return context;
};
