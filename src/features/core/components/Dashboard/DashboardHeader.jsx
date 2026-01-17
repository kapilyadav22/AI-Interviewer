import { memo } from "react";
import { Sparkles } from "../../../../shared/components/Icons";

export const DashboardHeader = memo(function DashboardHeader({
  membershipType = "Elite",
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
          Dashboard
        </h1>
        <p className="text-slate-500 dark:text-slate-300 font-medium">
          Holistic Career Readiness & Analytics
        </p>
      </div>
      <div className="flex gap-4">
        <div className="px-6 py-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-800 flex items-center gap-3">
          <Sparkles
            className="text-emerald-600 dark:text-emerald-400"
            size={20}
          />
          <span className="text-emerald-800 dark:text-emerald-300 font-black text-sm uppercase tracking-widest">
            {membershipType} Member
          </span>
        </div>
      </div>
    </div>
  );
});
