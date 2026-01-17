import { memo } from "react";
import { motion } from "motion/react";
import { ScanEye } from "../../../../shared/components/Icons";
import { cn } from "../../../../shared/utils/cn";

export const ConfidenceMeter = memo(function ConfidenceMeter({ speechStats }) {
  const wpm = Math.round(
    speechStats.totalWords / (speechStats.speakingTime / 60) || 0,
  );

  const focusScore = Math.max(0, 100 - speechStats.fillerWords * 5);

  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl p-4 border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <ScanEye size={14} />
          </div>
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-300">
            Kapil AI
          </h3>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase">
              WPM
            </span>
            <span className="text-xs font-black text-slate-700 dark:text-slate-200 leading-none">
              {wpm}
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase">
              Focus
            </span>
            <span className="text-xs font-black text-slate-700 dark:text-slate-200 leading-none">
              {focusScore}%
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between items-center px-0.5">
          <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            Fluency
          </span>
          <span
            className={cn(
              "text-[9px] font-black uppercase",
              speechStats.fillerWords < 3
                ? "text-emerald-500"
                : "text-amber-500",
            )}
          >
            {speechStats.fillerWords > 0
              ? `${speechStats.fillerWords} fillers`
              : "Clear"}
          </span>
        </div>
        <div className="w-full h-1 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{
              width: `${Math.max(10, 100 - speechStats.fillerWords * 10)}%`,
            }}
            className={cn(
              "h-full rounded-full transition-all duration-1000",
              speechStats.fillerWords > 5 ? "bg-red-500" : "bg-emerald-500",
            )}
          />
        </div>
      </div>
    </div>
  );
});
