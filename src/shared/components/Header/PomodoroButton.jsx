import { memo } from "react";
import { Clock, Pause, Play } from "../Icons";
import { cn } from "../../utils/cn";

const DEFAULT_FOCUS_TIME = 25 * 60;
const DEFAULT_BREAK_TIME = 5 * 60;

export const formatPomodoroTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};

export const PomodoroButton = memo(function PomodoroButton({
  timeLeft,
  timerRunning,
  pomodoroMode,
  onClick,
}) {
  const isDefaultTime =
    timeLeft ===
    (pomodoroMode === "focus" ? DEFAULT_FOCUS_TIME : DEFAULT_BREAK_TIME);

  return (
    <button
      onClick={onClick}
      className={cn(
        "hidden md:flex items-center gap-2 uppercase text-xs px-3 py-2 rounded-full font-bold tracking-wider transition-all",
        timerRunning
          ? "bg-primary-600 text-white shadow-lg shadow-primary-200 dark:shadow-none animate-pulse"
          : "bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-primary-900/50",
      )}
      title="Open Pomodoro"
    >
      {timerRunning ? (
        <>
          <Clock className="w-3.5 h-3.5" />
          <span>{formatPomodoroTime(timeLeft)}</span>
        </>
      ) : isDefaultTime ? (
        "Pomodoro"
      ) : (
        formatPomodoroTime(timeLeft)
      )}
    </button>
  );
});
