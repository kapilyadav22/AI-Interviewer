import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Clock, X, Play, Pause, RotateCcw, Square, Bell } from 'lucide-react';
import { cn } from '../utils/cn';

export const Pomodoro = ({ open, onClose }) => {
    const DEFAULT_SECONDS = 25 * 60;
    const [timeLeft, setTimeLeft] = useState(DEFAULT_SECONDS);
    const [running, setRunning] = useState(false);
    const [mode, setMode] = useState('focus'); // focus, break
    const intervalRef = useRef(null);

    // Persist timer state even when modal is closed
    useEffect(() => {
        if (running) {
            intervalRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        setRunning(false);
                        playNotification();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            clearInterval(intervalRef.current);
        }
        return () => clearInterval(intervalRef.current);
    }, [running]);

    const playNotification = () => {
        try {
            const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
            audio.play();
        } catch (e) {
            console.warn("Audio play failed");
        }
    };

    const toggleTimer = () => setRunning(!running);
    
    const reset = () => {
        setRunning(false);
        setTimeLeft(mode === 'focus' ? DEFAULT_SECONDS : 5 * 60);
    };

    const switchMode = (newMode) => {
        setMode(newMode);
        setRunning(false);
        setTimeLeft(newMode === 'focus' ? DEFAULT_SECONDS : 5 * 60);
    };

    const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
    const seconds = String(timeLeft % 60).padStart(2, '0');

    if (!open) return null;

    const modalContent = (
        <div 
            className="fixed inset-0 z-[9999] flex items-start justify-center bg-slate-900/60 backdrop-blur-sm overflow-y-auto pt-10 pb-10 sm:items-center sm:pt-0 sm:pb-0 transition-all duration-300 animate-in fade-in"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="bg-white dark:bg-slate-900 w-full max-w-sm mx-4 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transform animate-in zoom-in-95 duration-300 my-auto">
                {/* Header */}
                <div className="px-8 py-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-xl">
                            <Clock size={20} />
                        </div>
                        <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-sm">Pomodoro</h3>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-10 text-center space-y-10">
                    {/* Mode Toggles */}
                    <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl w-full max-w-[240px] mx-auto">
                        <button 
                            onClick={() => switchMode('focus')}
                            className={cn(
                                "flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all",
                                mode === 'focus' ? "bg-white dark:bg-slate-700 text-primary-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                            )}
                        >
                            Focus
                        </button>
                        <button 
                            onClick={() => switchMode('break')}
                            className={cn(
                                "flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all",
                                mode === 'break' ? "bg-white dark:bg-slate-700 text-emerald-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                            )}
                        >
                            Break
                        </button>
                    </div>

                    {/* Timer Circle/Display */}
                    <div className="relative inline-flex flex-col items-center justify-center h-48 w-48 rounded-full border-8 border-slate-50 dark:border-slate-800">
                        <div className="text-6xl font-black text-slate-900 dark:text-white tracking-tighter tabular-nums mb-1">
                            {minutes}:{seconds}
                        </div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                            {mode === 'focus' ? 'Stay Focused' : 'Take a Break'}
                        </div>
                        
                        {/* Progress ring - purely aesthetic since we aren't doing heavy SVG here, but adding a nice accent */}
                        <div className={cn(
                            "absolute inset-0 rounded-full border-2 border-transparent transition-all duration-1000",
                            running ? (mode === 'focus' ? "border-t-primary-500 border-r-primary-500 animate-spin-slow" : "border-t-emerald-500 border-r-emerald-500 animate-spin-slow") : "opacity-0"
                        )} />
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-center gap-4">
                        <button 
                            onClick={reset}
                            className="p-4 bg-slate-50 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-2xl transition-all"
                            title="Reset"
                        >
                            <RotateCcw size={20} />
                        </button>

                        <button 
                            onClick={toggleTimer}
                            className={cn(
                                "flex items-center gap-3 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl transition-all active:scale-95",
                                running 
                                    ? "bg-yellow-500 hover:bg-yellow-600 text-white shadow-yellow-200 dark:shadow-none" 
                                    : "bg-primary-600 hover:bg-primary-700 text-white shadow-primary-200 dark:shadow-none"
                            )}
                        >
                            {running ? (
                                <><Pause size={20} fill="currentColor" /> Pause</>
                            ) : (
                                <><Play size={20} fill="currentColor" /> {timeLeft === DEFAULT_SECONDS ? 'Start' : 'Resume'}</>
                            )}
                        </button>

                        {!running && timeLeft < (mode === 'focus' ? DEFAULT_SECONDS : 5 * 60) && (
                           <button 
                               onClick={() => switchMode(mode)}
                               className="p-4 bg-slate-50 dark:bg-slate-800 text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                               title="Stop & Reset"
                           >
                               <Square size={20} fill="currentColor" />
                           </button>
                        )}
                    </div>

                    <div className="flex items-center justify-center gap-2 text-slate-400 font-medium text-xs">
                        <Bell size={14} />
                        Sound notifications enabled
                    </div>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
};

export default Pomodoro;

