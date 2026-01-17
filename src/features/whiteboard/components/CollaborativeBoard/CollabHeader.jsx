import { memo } from "react";
import { Share2, Copy, Maximize, Minimize } from "../../../../shared/components/Icons";
import { Button } from "../../../../shared/components/Button";
import { CardHeader } from "../../../../shared/components/Card";

export const CollabHeader = memo(function CollabHeader({
  status,
  roomId,
  copyLink,
  isFullscreen,
  toggleFullscreen,
}) {
  return (
    <CardHeader className="px-3 md:px-4 py-2 bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700 shrink-0">
      <div className="flex flex-row justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-1.5 rounded-xl shadow-lg shadow-indigo-500/20">
            <Share2 className="w-4 h-4 text-white" />
          </div>
          <div className="hidden sm:block min-w-0">
            <h2 className="text-sm font-black text-slate-900 dark:text-white tracking-tight leading-none uppercase italic">
              Canvas Studio
            </h2>
            <p className="text-[8px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-0.5 truncate">
              {status.includes("Connected") ? "Collaboration Active" : "Live"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <div
            className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
              status.includes("Connected") || status === "Online"
                ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800"
                : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800"
            }`}
          >
            {status}
          </div>

          <div className="flex items-center bg-slate-50 dark:bg-slate-900 rounded-xl pl-3 pr-1 py-0.5 border border-slate-200 dark:border-slate-700 min-w-0 max-w-[200px] md:max-w-none">
            <span className="hidden md:inline text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mr-2 shrink-0">
              ROOM:
            </span>
            <input
              type="text"
              readOnly
              value={roomId}
              className="bg-transparent border-none focus:ring-0 text-[10px] font-bold text-slate-600 dark:text-slate-300 w-16 md:w-24 px-0 truncate"
            />
            <Button
              variant="white"
              size="sm"
              onClick={copyLink}
              className="h-7 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg shadow-sm hover:shadow-md transition-all px-2 shrink-0 font-bold text-[10px]"
            >
              <Copy className="w-3 h-3 md:mr-1.5" />
              <span className="hidden md:inline">COPY LINK</span>
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={toggleFullscreen}
            className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 bg-slate-50 dark:bg-slate-900 h-8 w-8 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center p-0"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? (
              <Minimize className="w-4 h-4" />
            ) : (
              <Maximize className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </CardHeader>
  );
});
