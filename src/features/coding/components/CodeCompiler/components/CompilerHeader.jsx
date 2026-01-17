import { memo } from "react";
import {
  Code2,
  ChevronDown,
  Timer,
  Pause,
  Play,
  RotateCcw,
  Save,
  Loader2,
  Sidebar,
  SquareTerminal,
  Eye,
  Minimize,
  Maximize,
} from "../../../../../shared/components/Icons";
import { Button } from "../../../../../shared/components/Button";
import { CardHeader } from "../../../../../shared/components/Card";
import { LANGUAGES } from "../../../../../shared/services/compiler";

export const CompilerHeader = memo(function CompilerHeader({
  language,
  handleLanguageChange,
  timerRunning,
  timerSeconds,
  handleStartStopTimer,
  handleResetTimer,
  handleSaveFile,
  handleRunCode,
  isRunning,
  showFileExplorer,
  setShowFileExplorer,
  showConsole,
  setShowConsole,
  showPreview,
  setShowPreview,
  isFullscreen,
  toggleFullscreen,
}) {
  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <CardHeader className="py-3 px-4 border-b flex flex-row items-center justify-between shrink-0 bg-white dark:bg-[#1e1e1e]">
      <div className="flex items-center gap-2">
        <div className="p-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
          <Code2 className="w-5 h-5 text-primary-600 dark:text-primary-400" />
        </div>
        <h1 className="font-bold text-slate-800 dark:text-slate-100 text-lg mr-2">
          Code Compiler
        </h1>

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1" />

        <div className="relative">
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="appearance-none bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg pl-3 pr-8 py-1.5 text-sm font-medium focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-sm"
          >
            {Object.entries(LANGUAGES).map(([key, lang]) => (
              <option key={key} value={key}>
                {lang.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>

        {language !== "react" && (
          <>
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1" />

            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg px-2 py-1">
              <Timer
                className={`w-4 h-4 ${timerRunning ? "text-emerald-500" : "text-slate-400"}`}
              />
              <span
                className={`font-mono text-sm font-bold min-w-[50px] ${timerRunning ? "text-emerald-600 dark:text-emerald-400" : "text-slate-600 dark:text-slate-300"}`}
              >
                {formatTimer(timerSeconds)}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleStartStopTimer}
                className="h-6 w-6 p-0"
                title={timerRunning ? "Pause Timer" : "Start Timer"}
              >
                {timerRunning ? (
                  <Pause className="w-3.5 h-3.5 text-amber-500" />
                ) : (
                  <Play className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetTimer}
                className="h-6 w-6 p-0"
                title="Reset Timer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              </Button>
            </div>

            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1" />

            <Button
              variant="ghost"
              size="sm"
              onClick={handleSaveFile}
              className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              title="Save File (Ctrl+S)"
            >
              <Save className="w-4 h-4" />
            </Button>

            <Button
              onClick={handleRunCode}
              disabled={isRunning}
              size="sm"
              className="min-w-[100px] font-semibold"
            >
              {isRunning ? (
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
              ) : (
                <Play className="fill-current mr-2 h-4 w-4" />
              )}
              {isRunning ? "Running..." : "Run Code"}
            </Button>
          </>
        )}
      </div>

      <div className="flex items-center gap-2">
        {language === "react" && (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFileExplorer(!showFileExplorer)}
              className={
                showFileExplorer
                  ? "bg-slate-100 dark:bg-slate-800"
                  : "text-slate-400"
              }
              title="Toggle Explorer"
            >
              <Sidebar className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowConsole(!showConsole)}
              className={
                showConsole
                  ? "bg-slate-100 dark:bg-slate-800"
                  : "text-slate-400"
              }
              title="Toggle Console"
            >
              <SquareTerminal className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
              className={
                showPreview
                  ? "bg-slate-100 dark:bg-slate-800"
                  : "text-slate-400"
              }
              title="Toggle Preview"
            >
              <Eye className="w-4 h-4" />
            </Button>
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1" />
          </>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={toggleFullscreen}
          className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          title="Toggle Fullscreen"
        >
          {isFullscreen ? (
            <Minimize className="w-4 h-4" />
          ) : (
            <Maximize className="w-4 h-4" />
          )}
        </Button>
      </div>
    </CardHeader>
  );
});
