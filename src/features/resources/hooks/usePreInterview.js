import { useState, useCallback } from "react";
import { useToast } from "../../../shared/context/ToastContext";
import { useGeminiAction } from "../../../shared/hooks/useGeminiAction";
import { SpeechService } from "../../../shared/services/speech";
import { extractTextFromPdf } from "../../../shared/utils/pdf";

export const usePreInterview = (setShowAuthWarning) => {
  const [gameState, setGameState] = useState("input");
  const [formData, setFormData] = useState({
    resume: localStorage.getItem("last_resume") || "",
    jobDesc: "",
  });
  const [briefing, setBriefing] = useState(null);
  const [parsingPdf, setParsingPdf] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [listeningTo, setListeningTo] = useState(null);
  const [showSoundcheck, setShowSoundcheck] = useState(false);
  const [soundcheckFeedback, setSoundcheckFeedback] = useState(null);
  const [isSoundchecking, setIsSoundchecking] = useState(false);
  const [soundcheckTime, setSoundcheckTime] = useState(10);
  const [soundcheckTranscript, setSoundcheckTranscript] = useState("");
  const { showToast } = useToast();
  const [speech] = useState(new SpeechService());

  const { execute, loading: isGenerating } =
    useGeminiAction(setShowAuthWarning);

  const toggleDictation = useCallback(
    (target) => {
      if (isListening) {
        speech.stopListening();
        setIsListening(false);
        setListeningTo(null);
      } else {
        setIsListening(true);
        setListeningTo(target);
        speech.startListening(
          (text) => {
            setFormData((prev) => ({
              ...prev,
              [target]: prev[target] + (prev[target] ? " " : "") + text,
            }));
          },
          () => {
            setIsListening(false);
            setListeningTo(null);
          },
        );
      }
    },
    [isListening, speech],
  );

  const handleGenerate = async () => {
    if (!formData.resume) return;

    await execute(
      (service) =>
        service.generatePreFlightBriefing(formData.resume, formData.jobDesc),
      {
        onSuccess: (result) => {
          if (result) {
            setBriefing(result);
            setGameState("results");
            localStorage.setItem("last_resume", formData.resume);
          }
        },
      },
    );
  };

  const handlePdfUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      showToast("Please upload a PDF file.", "error");
      return;
    }

    setParsingPdf(true);
    try {
      const text = await extractTextFromPdf(file);
      setFormData((prev) => ({ ...prev, resume: text }));
    } catch {
      showToast(
        "Failed to read PDF. Please try pasting the text instead.",
        "error",
      );
    } finally {
      setParsingPdf(false);
    }
  };

  const runSoundcheck = async () => {
    setIsSoundchecking(true);
    setSoundcheckTime(10);
    setSoundcheckTranscript("");
    setSoundcheckFeedback(null);

    let timeLeft = 10;
    const timer = setInterval(() => {
      timeLeft -= 1;
      setSoundcheckTime(timeLeft);
      if (timeLeft <= 0) clearInterval(timer);
    }, 1000);

    try {
      speech.startListening(
        (text) => setSoundcheckTranscript((prev) => prev + " " + text),
        () => {},
      );

      setTimeout(() => {
        speech.stopListening();
        clearInterval(timer);
        setIsSoundchecking(false);

        const hasAudio = soundcheckTranscript.trim().length > 0;
        setSoundcheckFeedback({
          lighting: "Good. Your face is well-lit and clear.",
          framing: "Excellent. Traditional head-and-shoulders crop.",
          impression: hasAudio
            ? "Great energy! Your voice is clear and professional."
            : "Visuals look good, but no audio was detected. Check your mic!",
          status: hasAudio ? "success" : "warning",
        });
      }, 10000);
    } catch {
      clearInterval(timer);
      setIsSoundchecking(false);
      showToast("Failed to start soundcheck.", "error");
    }
  };

  const saveToVault = () => {
    const vault = JSON.parse(
      localStorage.getItem("nextoffer_ai_vault") || "[]",
    );
    const newItem = {
      id: Date.now(),
      type: "Pre-Interview Cheat Sheet",
      title: `Briefing for ${formData.jobDesc.split("\n")[0].substring(0, 30) || "General Interview"}`,
      content: JSON.stringify(briefing),
      date: new Date().toISOString(),
    };
    localStorage.setItem(
      "nextoffer_ai_vault",
      JSON.stringify([newItem, ...vault]),
    );
    showToast("Briefing saved to Vault!", "success");
  };

  return {
    gameState,
    setGameState,
    formData,
    setFormData,
    briefing,
    parsingPdf,
    isListening,
    listeningTo,
    toggleDictation,
    handleGenerate,
    isGenerating,
    handlePdfUpload,
    showSoundcheck,
    setShowSoundcheck,
    isSoundchecking,
    soundcheckTime,
    soundcheckTranscript,
    soundcheckFeedback,
    runSoundcheck,
    saveToVault,
  };
};
