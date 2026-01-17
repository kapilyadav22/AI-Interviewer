import { useState, useEffect, useRef, useCallback } from "react";

const DEFAULT_FOCUS_TIME = 25 * 60;
const DEFAULT_BREAK_TIME = 5 * 60;

export function usePomodoroTimer() {
  const [timeLeft, setTimeLeft] = useState(DEFAULT_FOCUS_TIME);
  const [timerRunning, setTimerRunning] = useState(false);
  const [pomodoroMode, setPomodoroMode] = useState("focus");
  const pomodoroIntervalRef = useRef(null);

  useEffect(() => {
    if (timerRunning) {
      pomodoroIntervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setTimerRunning(false);
            try {
              new Audio(
                "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3",
              ).play();
            } catch {}
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(pomodoroIntervalRef.current);
    }
    return () => clearInterval(pomodoroIntervalRef.current);
  }, [timerRunning]);

  const toggle = useCallback(() => setTimerRunning((prev) => !prev), []);

  const reset = useCallback(() => {
    setTimerRunning(false);
    setTimeLeft(
      pomodoroMode === "focus" ? DEFAULT_FOCUS_TIME : DEFAULT_BREAK_TIME,
    );
  }, [pomodoroMode]);

  const switchMode = useCallback((newMode) => {
    setPomodoroMode(newMode);
    setTimerRunning(false);
    setTimeLeft(newMode === "focus" ? DEFAULT_FOCUS_TIME : DEFAULT_BREAK_TIME);
  }, []);

  const stop = useCallback(() => {
    setTimerRunning(false);
  }, []);

  return {
    timeLeft,
    timerRunning,
    pomodoroMode,
    toggle,
    reset,
    switchMode,
    stop,
  };
}
