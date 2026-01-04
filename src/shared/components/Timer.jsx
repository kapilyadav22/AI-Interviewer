import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { cn } from '../utils/cn';

export const Timer = ({ durationMinutes, onComplete }) => {
    const [timeLeft, setTimeLeft] = useState(durationMinutes * 60);

    useEffect(() => {
        if (timeLeft <= 0) {
            onComplete?.();
            return;
        }

        const interval = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timeLeft, onComplete]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    const isLowTime = timeLeft < 300; // Less than 5 minutes

    return (
        <div className={cn(
            "flex items-center space-x-2 px-3 py-1.5 rounded-lg font-mono font-medium transition-colors",
            isLowTime ? "bg-red-100 text-red-600 animate-pulse" : "bg-slate-100 text-slate-600"
        )}>
            <Clock className="w-4 h-4" />
            <span>
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
        </div>
    );
};
