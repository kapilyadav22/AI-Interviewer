import { useState, useCallback } from "react";
import { useGeminiAction } from "../../../shared/hooks/useGeminiAction";
import { SpeechService } from "../../../shared/services/speech";
import { config } from "../../../config";

export function useResumeOptimizer({ showToast, setShowAuthWarning }) {
  const [resumeText, setResumeText] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [listeningTo, setListeningTo] = useState(null);

  const [speech] = useState(() => new SpeechService());

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
            if (target === "resume") {
              setResumeText((prev) => prev + (prev ? " " : "") + text);
            } else {
              setJobDesc((prev) => prev + (prev ? " " : "") + text);
            }
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

  const { execute, loading } = useGeminiAction(setShowAuthWarning);

  const handleAnalyze = useCallback(async () => {
    if (!resumeText) {
      showToast("Please provide resume text or upload a PDF.", "warning");
      return;
    }

    await execute((service) => service.optimizeResume(resumeText, jobDesc), {
      onSuccess: (result) => setAnalysis(result),
    });
  }, [resumeText, jobDesc, execute, showToast]);

  const handlePdfUpload = useCallback(
    async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      if (file.type !== "application/pdf") {
        showToast("Please upload a PDF file.", "warning");
        return;
      }

      try {
        // Dynamic import to keep bundle size low if not used
        const { extractTextFromPdf } =
          await import("../../../shared/utils/pdf");
        const text = await extractTextFromPdf(file);
        setResumeText(text);
      } catch {
        showToast("Failed to read PDF.", "error");
      }
    },
    [showToast],
  );

  return {
    resumeText,
    setResumeText,
    jobDesc,
    setJobDesc,
    analysis,
    loading,
    isListening,
    listeningTo,
    toggleDictation,
    handleAnalyze,
    handlePdfUpload,
  };
}
