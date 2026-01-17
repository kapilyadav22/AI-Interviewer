import { memo } from "react";
import {
  Mic,
  Video,
  VideoOff,
  StopCircle,
  Monitor,
  MonitorOff,
  ScanEye,
  Loader2,
  Sparkles,
} from "../../../../shared/components/Icons";
import { Button } from "../../../../shared/components/Button";
import { cn } from "../../../../shared/utils/cn";

export const ControlBar = memo(function ControlBar({
  webcamEnabled,
  setWebcamEnabled,
  isScreenSharing,
  startScreenShare,
  stopScreenShare,
  analyzeScreen,
  analyzingScreen,
  isListening,
  handleStartListening,
  handleStopListening,
  isAiSpeaking,
  getHint,
  gettingHint,
  messagesCount,
  onEndInterview,
}) {
  const isGemini = localStorage.getItem("ai_provider") === "gemini";

  return (
    <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900/40 p-1 rounded-xl border border-slate-100 dark:border-slate-800 shrink-0">
          <Button
            variant={webcamEnabled ? "secondary" : "danger"}
            size="sm"
            className="rounded-lg w-9 h-9 p-0 flex items-center justify-center transition-all"
            onClick={() => setWebcamEnabled(!webcamEnabled)}
          >
            {webcamEnabled ? (
              <Video className="w-4 h-4 text-primary-600" />
            ) : (
              <VideoOff className="w-4 h-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-slate-500 dark:text-slate-400 font-bold px-3 h-9 rounded-lg hover:bg-white dark:hover:bg-slate-800 text-[9px] uppercase tracking-wider"
            onClick={startScreenShare}
            disabled={isScreenSharing}
          >
            <Monitor className="w-3.5 h-3.5 mr-1.5 text-indigo-500" />
            {isScreenSharing ? "Sharing" : "Share"}
          </Button>
        </div>

        <div className="flex-1 flex justify-center">
          <Button
            size="lg"
            variant={isListening ? "danger" : "primary"}
            className={cn(
              "rounded-full w-12 h-12 p-0 flex items-center justify-center shadow-lg transition-all transform shrink-0",
              isListening
                ? "scale-110 animate-pulse ring-4 ring-red-500/20"
                : "hover:scale-105 active:scale-95",
            )}
            onClick={isListening ? handleStopListening : handleStartListening}
            disabled={isAiSpeaking}
          >
            {isListening ? (
              <StopCircle className="w-6 h-6 fill-current" />
            ) : (
              <Mic className="w-6 h-6" />
            )}
          </Button>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            className="hidden sm:flex rounded-lg border-amber-200 text-amber-600 hover:bg-amber-50 h-9 px-3 font-black text-[9px] uppercase tracking-wide bg-amber-50/20"
            onClick={getHint}
            disabled={isAiSpeaking || messagesCount < 2 || gettingHint}
          >
            <Sparkles size={12} className="mr-1.5 text-amber-500" />
            Hint
          </Button>
          <Button
            variant="primary"
            className="bg-red-500 hover:bg-red-600 text-white font-black text-[9px] uppercase tracking-widest px-4 h-9 rounded-lg shadow-md shadow-red-500/10 active:scale-95 border-none"
            onClick={onEndInterview}
          >
            End Session
          </Button>
        </div>
      </div>
    </div>
  );
});
