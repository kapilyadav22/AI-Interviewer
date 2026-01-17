import { memo } from "react";
import {
  Loader2,
  Maximize2,
  Minimize2,
} from "../../../../shared/components/Icons";
import { cn } from "../../../../shared/utils/cn";
import { Card } from "../../../../shared/components/Card";
import { Button } from "../../../../shared/components/Button";
import { CodeEditor } from "../../../coding/components/CodeEditor";
import { Whiteboard } from "../../../whiteboard/components/Whiteboard";

export const TabbedInterface = memo(function TabbedInterface({
  activeTab,
  setActiveTab,
  messages,
  isAiSpeaking,
  messagesEndRef,
  code,
  setCode,
  handleCodeSubmit,
  theme,
  isFullPage,
  toggleFullPage,
}) {
  return (
    <Card className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center border-b border-slate-100 dark:border-slate-700">
        <div className="flex flex-1">
          <TabButton
            label="Transcript"
            isActive={activeTab === "transcript"}
            onClick={() => setActiveTab("transcript")}
          />
          <TabButton
            label="Code Editor"
            isActive={activeTab === "code"}
            onClick={() => setActiveTab("code")}
            className="border-l border-slate-100 dark:border-slate-700"
          />
          <TabButton
            label="Whiteboard"
            isActive={activeTab === "whiteboard"}
            onClick={() => setActiveTab("whiteboard")}
            className="border-l border-slate-100 dark:border-slate-700"
          />
        </div>

        <div className="px-3 border-l border-slate-100 dark:border-slate-700">
          <Button
            variant="ghost"
            size="sm"
            className="w-8 h-8 p-0 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
            onClick={toggleFullPage}
            title={isFullPage ? "Exit Fullscreen" : "Maximize Workspace"}
          >
            {isFullPage ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative">
        <div
          className={cn(
            "absolute inset-0 flex flex-col transition-opacity duration-200",
            activeTab === "transcript"
              ? "opacity-100 z-10"
              : "opacity-0 z-0 pointer-events-none",
          )}
        >
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={cn(
                  "p-3 rounded-lg text-sm max-w-[85%]",
                  msg.role === "user"
                    ? "bg-primary-50 text-primary-900 ml-auto"
                    : "bg-slate-100 text-slate-800 mr-auto",
                )}
              >
                <p className="font-medium text-xs mb-1 opacity-70 uppercase">
                  {msg.role === "user" ? "You" : "Interviewer"}
                </p>
                {msg.text}
              </div>
            ))}
            {isAiSpeaking && (
              <div className="flex items-center space-x-2 text-slate-400 text-sm p-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>AI is speaking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div
          className={cn(
            "absolute inset-0 transition-opacity duration-200 bg-[#1e1e1e]",
            activeTab === "code"
              ? "opacity-100 z-10"
              : "opacity-0 z-0 pointer-events-none",
          )}
        >
          <CodeEditor
            code={code}
            onChange={setCode}
            onSubmit={handleCodeSubmit}
            theme={theme}
          />
        </div>

        <div
          className={cn(
            "absolute inset-0 transition-opacity duration-200 bg-white",
            activeTab === "whiteboard"
              ? "opacity-100 z-10"
              : "opacity-0 z-0 pointer-events-none",
          )}
        >
          <Whiteboard />
        </div>
      </div>
    </Card>
  );
});

const TabButton = ({ label, isActive, onClick, className }) => (
  <button
    className={cn(
      "flex-1 py-3 text-sm font-medium transition-colors",
      isActive
        ? "text-primary-600 border-b-2 border-primary-600 bg-primary-50/50 dark:bg-primary-900/20"
        : "text-slate-500 dark:text-slate-300 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800",
      className,
    )}
    onClick={onClick}
  >
    {label}
  </button>
);
