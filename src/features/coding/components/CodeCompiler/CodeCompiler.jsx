import { useState, useRef, useEffect, useCallback } from "react";
import { Layout } from "../../../../shared/components/Layout";
import { Card, CardBody } from "../../../../shared/components/Card";
import { useToast } from "../../../../shared/context/ToastContext";

import { CompilerHeader, CompilerWorkspace } from "./components";
import { ReactWorkspace } from "./ReactEditor/ReactWorkspace";
import { useCompiler } from "../../hooks/useCompiler";

export const CodeCompiler = () => {
  const { showToast } = useToast();

  const {
    language,
    code,
    input,
    output,
    error,
    isRunning,
    timerRunning,
    timerSeconds,
    setLanguage,
    setCode,
    setInput,
    setOutput,
    setError,
    handleLanguageChange,
    handleRunCode,
    handleSaveFile,
    handleStartStopTimer,
    handleResetTimer,
  } = useCompiler({ showToast });

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showFileExplorer, setShowFileExplorer] = useState(true);
  const [showConsole, setShowConsole] = useState(true);
  const [showPreview, setShowPreview] = useState(true);

  const containerRef = useRef(null);

  const [dependencies] = useState({
    "lucide-react": "latest",
    motion: "latest",
  });

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(() => {
        setIsFullscreen(true); // Fallback
      });
    } else {
      document.exitFullscreen();
    }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const getHorizontalSizes = useCallback(() => {
    const panels = [showFileExplorer, true, showPreview];
    const activeCount = panels.filter(Boolean).length;

    if (activeCount === 1) return [100];
    if (activeCount === 2) {
      if (!showFileExplorer && showPreview) return [60, 40];
      if (showFileExplorer && !showPreview) return [20, 80];
      return [50, 50];
    }
    return [20, 40, 40];
  }, [showFileExplorer, showPreview]);

  return (
    <Layout hideFooter={isFullscreen}>
      <div
        ref={containerRef}
        className={`transition-all duration-300 w-full ${
          isFullscreen
            ? "fixed inset-0 z-50 bg-background h-screen"
            : "h-[calc(100vh-100px)] p-4 w-full mx-auto"
        }`}
      >
        <Card className="h-full flex flex-col border-0 md:border shadow-sm overflow-hidden bg-white dark:bg-[#1e1e1e]">
          <CompilerHeader
            language={language}
            handleLanguageChange={handleLanguageChange}
            timerRunning={timerRunning}
            timerSeconds={timerSeconds}
            handleStartStopTimer={handleStartStopTimer}
            handleResetTimer={handleResetTimer}
            handleSaveFile={handleSaveFile}
            handleRunCode={handleRunCode}
            isRunning={isRunning}
            showFileExplorer={showFileExplorer}
            setShowFileExplorer={setShowFileExplorer}
            showConsole={showConsole}
            setShowConsole={setShowConsole}
            showPreview={showPreview}
            setShowPreview={setShowPreview}
            isFullscreen={isFullscreen}
            toggleFullscreen={toggleFullscreen}
          />

          <CardBody className="p-0 flex-1 flex flex-col min-h-0 bg-[#1e1e1e]">
            {language === "react" ? (
              <ReactWorkspace
                dependencies={dependencies}
                getHorizontalSizes={getHorizontalSizes}
                showFileExplorer={showFileExplorer}
                showConsole={showConsole}
                showPreview={showPreview}
                showToast={showToast}
              />
            ) : (
              <CompilerWorkspace
                language={language}
                code={code}
                setCode={setCode}
                input={input}
                setInput={setInput}
                output={output}
                error={error}
              />
            )}
          </CardBody>
        </Card>
      </div>
    </Layout>
  );
};
