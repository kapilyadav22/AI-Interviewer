import { useState, useRef, useEffect, useCallback } from "react";
import {
  executeCode,
  LANGUAGES,
  DEFAULT_CODE,
} from "../../../shared/services/compiler";

export function useCompiler({ showToast }) {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(DEFAULT_CODE.javascript);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);

  const timerIntervalRef = useRef(null);

  const handleLanguageChange = useCallback((newKey) => {
    const newLangConfig = LANGUAGES[newKey];
    if (!newLangConfig) return;
    setLanguage(newKey);
    setCode(DEFAULT_CODE[newKey]);
    setOutput("");
    setError(null);
  }, []);

  const handleRunCode = useCallback(async () => {
    setIsRunning(true);
    setError(null);
    setOutput("");
    try {
      const result = await executeCode(LANGUAGES[language], code, input);
      if (result.run.code === 0) {
        setOutput(result.run.output);
        showToast("Code executed successfully", "success");
      } else {
        setError(result.run.output || "Execution failed");
        showToast("Execution failed", "error");
      }
    } catch (err) {
      setError(err.message);
      showToast(err.message, "error");
    } finally {
      setIsRunning(false);
    }
  }, [language, code, input, showToast]);

  const getFilename = useCallback((lang) => {
    const map = {
      javascript: "main.js",
      python: "main.py",
      java: "Main.java",
      c: "main.c",
      cpp: "main.cpp",
      react: "App.js",
    };
    return map[lang] || "code";
  }, []);

  const handleSaveFile = useCallback(() => {
    const filename = getFilename(language);
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Saved as ${filename}`, "success");
  }, [language, code, getFilename, showToast]);

  // Timer Logic
  useEffect(() => {
    if (timerRunning) {
      timerIntervalRef.current = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    }
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [timerRunning]);

  const handleStartStopTimer = useCallback(() => {
    setTimerRunning((prev) => !prev);
  }, []);

  const handleResetTimer = useCallback(() => {
    setTimerRunning(false);
    setTimerSeconds(0);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (language === "react") return;

      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        if (!isRunning) {
          handleRunCode();
        }
      }

      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleSaveFile();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [language, isRunning, handleRunCode, handleSaveFile]);

  return {
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
  };
}
