import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { cn } from "../utils/cn";

export const Timer = ({ durationMinutes, onComplete, variant = "classic" }) => {
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

  const baseStyles =
    "flex items-center space-x-2 px-3 py-1.5 rounded-full font-mono font-black transition-colors text-[10px] tracking-widest uppercase";

  const variantStyles =
    variant === "overlay"
      ? isLowTime
        ? "bg-red-500/90 text-white animate-pulse shadow-lg"
        : "bg-black/40 backdrop-blur-md text-white/90 border border-white/10 shadow-lg"
      : isLowTime
        ? "bg-red-100 text-red-600 animate-pulse"
        : "bg-slate-100 text-slate-600";

  return (
    <div className={cn(baseStyles, variantStyles)}>
      <Clock className="w-3.5 h-3.5" />
      <span>
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </span>
    </div>
  );
};
