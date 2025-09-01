import { useState, useEffect } from 'react';

export const useTimer = (initialSeconds: number, isRunning: boolean) => {
    const [seconds, setSeconds] = useState(initialSeconds);

    useEffect(() => {
        if (isRunning) {
            setSeconds(initialSeconds); // Reset on start
            const interval = setInterval(() => {
                setSeconds(prev => (prev > 0 ? prev - 1 : 0));
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [initialSeconds, isRunning]);

    const formatTime = (time: number): string =>
        `${Math.floor(time / 60)}:${(time % 60).toString().padStart(2, '0')}`;

    return { time: seconds, formattedTime: formatTime(seconds) };
};