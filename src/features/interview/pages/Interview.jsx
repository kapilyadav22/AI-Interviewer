import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Split from "react-split";
import { Layout } from "../../../shared/components/Layout";
import { Timer } from "../../../shared/components/Timer";
import { useTheme } from "../../../shared/context/ThemeContext";
import { useToast } from "../../../shared/context/ToastContext";
import { ApiKeyModal } from "../../../shared/components/ApiKeyModal";
import { AuthWarningModal } from "../../../shared/components/AuthWarningModal";
import { cn } from "../../../shared/utils/cn";

// Modular Components & Hooks
import {
  ConfidenceMeter,
  VideoSection,
  ControlBar,
  TabbedInterface,
} from "../components/InterviewSession";
import { useAIInterview } from "../hooks/useAIInterview";
import { useInterviewMedia } from "../hooks/useInterviewMedia";
import { Button } from "../../../shared/components/Button";
import { Maximize2, Minimize2 } from "../../../shared/components/Icons";

export const Interview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { showToast } = useToast();

  const {
    resume,
    jobDesc,
    duration = 30,
    difficulty = "Mid-Level",
    focusArea = "General",
    company = null,
  } = location.state || {};

  const [activeTab, setActiveTab] = useState("transcript");
  const [code, setCode] = useState(
    '// Write your solution here\n\nfunction solution() {\n  return "Hello World";\n}\n\nconsole.log(solution());',
  );
  const [gettingHint, setGettingHint] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);

  const messagesEndRef = useRef(null);

  // Hook for AI Logic (Chat, Speech, Stats)
  const {
    aiService,
    speech,
    messages,
    addMessage,
    isAiSpeaking,
    setIsAiSpeaking,
    isListening,
    transcript,
    speechStats,
    showAuthWarning,
    setShowAuthWarning,
    handleStartListening,
    handleStopListening,
  } = useAIInterview({
    resume,
    jobDesc,
    difficulty,
    focusArea,
    company,
    navigate,
  });

  // Hook for Media Logic (Webcam, Screen Share, Recording)
  const {
    webcamEnabled,
    setWebcamEnabled,
    webcamRef,
    screenStream,
    isScreenSharing,
    startScreenShare,
    stopScreenShare,
    analyzeScreen,
    analyzingScreen,
    isRecording,
    startRecording,
    stopRecording,
    mediaBlobUrlRef,
    mimeTypeRef,
  } = useInterviewMedia({
    aiService,
    addMessage,
    setIsAiSpeaking,
    speech,
    showToast,
  });

  const mainContainerRef = useRef(null);
  const [isFullPage, setIsFullPage] = useState(false);

  useEffect(() => {
    const handleFsChange = () => setIsFullPage(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFsChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  const toggleFullPage = () => {
    if (!document.fullscreenElement) {
      mainContainerRef.current?.requestFullscreen();
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
    }
  };

  // Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleCodeSubmit = async (submittedCode, output) => {
    const message = `I have written some code:\n\n\`\`\`javascript\n${submittedCode}\n\`\`\`\n\nOutput:\n${output}`;
    addMessage("user", "Submitted code for review.");

    try {
      const response = await aiService.sendMessage(message);
      addMessage("ai", response);
      setIsAiSpeaking(true);
      speech.speak(response, () => setIsAiSpeaking(false));
    } catch (error) {
      addMessage("ai", `Error: ${error.message}. Please try again.`);
    }
  };

  const getHint = async () => {
    setGettingHint(true);
    try {
      const hint = await aiService.getShadowHint(messages, {
        difficulty,
        focusArea,
        resume,
      });
      addMessage("ai", `💡 HINT: ${hint}`);
      speech.speak(hint);
      showToast("Strategy hint received!", "success");
    } catch {
      showToast(
        "Failed to get hint. Please check your API key and try again.",
        "error",
      );
    } finally {
      setGettingHint(false);
    }
  };

  const handleEndInterview = async () => {
    let finalUrl = mediaBlobUrlRef.current;

    if (isRecording) {
      finalUrl = await stopRecording();
    }

    setTimeout(() => {
      if (screenStream) {
        screenStream.getTracks().forEach((track) => track.stop());
      }

      navigate("/feedback", {
        state: {
          messages,
          mediaBlobUrl: finalUrl,
          speechStats,
          mimeType: mimeTypeRef.current,
        },
      });
    }, 500);
  };

  return (
    <Layout>
      <AuthWarningModal
        open={showAuthWarning}
        onClose={() => setShowAuthWarning(false)}
        onConfigure={() => {
          setShowAuthWarning(false);
          setShowApiKeyModal(true);
        }}
      />
      <ApiKeyModal
        open={showApiKeyModal}
        onClose={() => setShowApiKeyModal(false)}
      />

      <div
        ref={mainContainerRef}
        className={cn(
          "h-[calc(100vh-8rem)] p-4 bg-slate-50 dark:bg-slate-900 transition-all",
          isFullPage && "h-screen p-6",
        )}
      >
        <Split
          className="flex h-full gap-4"
          direction="horizontal"
          sizes={[40, 60]}
          minSize={300}
          gutterSize={10}
        >
          <div className="flex flex-col h-full space-y-4 overflow-hidden">
            <ConfidenceMeter speechStats={speechStats} />

            <VideoSection
              webcamRef={webcamRef}
              webcamEnabled={webcamEnabled}
              isScreenSharing={isScreenSharing}
              screenStream={screenStream}
              isRecording={isRecording}
              transcript={transcript}
              onRecordingStart={startRecording}
              onWebcamError={() => showToast("Camera access failed.", "error")}
              timer={
                <Timer
                  durationMinutes={duration}
                  onComplete={handleEndInterview}
                  variant="overlay"
                />
              }
            />

            <ControlBar
              webcamEnabled={webcamEnabled}
              setWebcamEnabled={setWebcamEnabled}
              isScreenSharing={isScreenSharing}
              startScreenShare={startScreenShare}
              stopScreenShare={stopScreenShare}
              analyzeScreen={analyzeScreen}
              analyzingScreen={analyzingScreen}
              isListening={isListening}
              handleStartListening={handleStartListening}
              handleStopListening={handleStopListening}
              isAiSpeaking={isAiSpeaking}
              getHint={getHint}
              gettingHint={gettingHint}
              messagesCount={messages.length}
              onEndInterview={handleEndInterview}
            />
          </div>

          <div className="flex flex-col h-full overflow-hidden">
            <TabbedInterface
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              messages={messages}
              isAiSpeaking={isAiSpeaking}
              messagesEndRef={messagesEndRef}
              code={code}
              setCode={setCode}
              handleCodeSubmit={handleCodeSubmit}
              theme={theme}
              isFullPage={isFullPage}
              toggleFullPage={toggleFullPage}
            />
          </div>
        </Split>
      </div>
    </Layout>
  );
};
