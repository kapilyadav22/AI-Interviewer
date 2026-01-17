import { memo } from "react";
import { Link } from "react-router-dom";
import { Moon, Sun, Key, Clock, LayoutIcon, FileText } from "../Icons";
import { cn } from "../../utils/cn";
import { formatPomodoroTime } from "./PomodoroButton";

export const MobileMenu = memo(function MobileMenu({
  isOpen,
  user,
  practiceItems,
  resourceItems,
  theme,
  toggleTheme,
  timerRunning,
  timeLeft,
  onClose,
  onOpenApiKey,
  onOpenPomodoro,
}) {
  if (!isOpen) return null;

  return (
    <div className="lg:hidden border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 absolute top-16 left-0 w-full shadow-xl animate-in slide-in-from-top-4 duration-300">
      <div className="p-4 space-y-4 max-h-[80vh] overflow-y-auto">
        <div className="grid grid-cols-2 gap-2">
          {user && (
            <Link
              to="/dashboard"
              className="flex items-center gap-2 p-3 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl"
              onClick={onClose}
            >
              <LayoutIcon className="w-4 h-4" />
              Dashboard
            </Link>
          )}
          <Link
            to="/resume-optimizer"
            className="flex items-center gap-2 p-3 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl"
            onClick={onClose}
          >
            <FileText className="w-4 h-4" />
            Resume
          </Link>
        </div>

        <MobileMenuSection
          title="Practice"
          items={practiceItems}
          onClose={onClose}
        />
        <MobileMenuSection
          title="Resources"
          items={resourceItems}
          onClose={onClose}
        />

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-2">
          {user && (
            <Link
              to="/settings"
              className="flex items-center justify-center gap-2 p-3 text-sm font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl"
              onClick={onClose}
            >
              Settings
            </Link>
          )}
          <button
            onClick={() => {
              toggleTheme();
            }}
            className={cn(
              "flex items-center justify-center gap-2 p-3 text-sm font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-xl",
              !user && "col-span-3",
            )}
            title={theme === "light" ? "Dark Mode" : "Light Mode"}
          >
            {theme === "light" ? (
              <Moon className="w-4 h-4" />
            ) : (
              <Sun className="w-4 h-4" />
            )}
            {theme === "light" ? "Dark" : "Light"}
          </button>
          <button
            onClick={() => {
              onOpenApiKey();
              onClose();
            }}
            className="flex items-center justify-center gap-2 p-3 text-sm font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl"
          >
            <Key className="w-4 h-4" />
            API Key
          </button>
          <button
            onClick={() => {
              onOpenPomodoro();
              onClose();
            }}
            className={cn(
              "flex items-center justify-center gap-2 p-3 text-sm font-bold rounded-xl transition-all",
              timerRunning
                ? "bg-primary-600 text-white animate-pulse"
                : "bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400",
            )}
          >
            {timerRunning ? (
              <>
                <Clock className="w-4 h-4" />
                {formatPomodoroTime(timeLeft)}
              </>
            ) : (
              "Pomodoro"
            )}
          </button>
        </div>
      </div>
    </div>
  );
});

const MobileMenuSection = memo(function MobileMenuSection({
  title,
  items,
  onClose,
}) {
  return (
    <div>
      <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-3 mb-2">
        {title}
      </p>
      <div className="grid grid-cols-2 gap-1">
        {items.map((item, idx) => (
          <Link
            key={idx}
            to={item.to}
            className="flex items-center gap-2 p-3 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl"
            onClick={onClose}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
});
