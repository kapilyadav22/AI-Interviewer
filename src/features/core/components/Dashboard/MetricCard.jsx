import { memo } from "react";
import { Card } from "../../../../shared/components/Card";
import { cn } from "../../../../shared/utils/cn";

const colorVariants = {
  indigo:
    "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-900/30",
  emerald:
    "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-900/30",
  red: "bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-900/30",
  blue: "bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/30",
  purple:
    "bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-900/30",
};

export const MetricCard = memo(function MetricCard({
  icon,
  label,
  value,
  color = "indigo",
}) {
  return (
    <Card
      className={cn(
        "p-6 rounded-[2rem] border transition-all hover:shadow-xl",
        colorVariants[color] || colorVariants.indigo,
      )}
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-white dark:bg-white/10 shadow-sm flex items-center justify-center">
          {icon}
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-300">
            {label}
          </p>
          <p className="text-xl font-black text-slate-900 dark:text-white">
            {value}
          </p>
        </div>
      </div>
    </Card>
  );
});
