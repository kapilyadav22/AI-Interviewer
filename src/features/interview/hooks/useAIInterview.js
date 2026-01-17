import { useState, useEffect, useRef, useCallback } from "react";
import { GeminiService } from "../../../shared/services/gemini";
import { OpenAIService } from "../../../shared/services/openai";
import { GrokService } from "../../../shared/services/grok";
import { SpeechService } from "../../../shared/services/speech";

export function useAIInterview({
  resume,
  jobDesc,
  difficulty,
  focusArea,
  company,
  navigate,
}) {
  const [aiService, setAiService] = useState(null);
  const [speech, setSpeech] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [showAuthWarning, setShowAuthWarning] = useState(false);
  const [speechStats, setSpeechStats] = useState({
    totalWords: 0,
    speakingTime: 0,
    fillerWords: 0,
  });

  const speechStartTime = useRef(null);

  // Initialize AI and Speech Services
  useEffect(() => {
    const provider = localStorage.getItem("ai_provider") || "gemini";
    const apiKey = localStorage.getItem(`${provider}_api_key`);

    if (!resume) {
      if (navigate) navigate("/setup");
      return;
    }

    if (!apiKey) {
      setShowAuthWarning(true);
      return;
    }

    let service;
    if (provider === "openai") {
      service = new OpenAIService(apiKey);
    } else if (provider === "grok") {
      service = new GrokService(apiKey);
    } else {
      service = new GeminiService(apiKey);
    }

    const speechSvc = new SpeechService();
    setAiService(service);
    setSpeech(speechSvc);

    const context = `
      You are a professional technical interviewer conducting a ${difficulty} level interview.
      ${
        company
          ? `You are currently representing ${company.title}. Follow these internal guidelines: ${company.systemInstruction}`
          : ""
      }
      Focus Area: ${focusArea}
      Candidate Resume: ${resume}
      ${jobDesc ? `Job Description: ${jobDesc}` : ""}
      
      Instructions:
      1. Start by introducing yourself${
        company ? ` as an interviewer from ${company.title}` : ""
      } and asking the first question.
      2. Keep your responses concise (under 3 sentences) to keep the conversation flowing.
      3. Ask one question at a time.
      4. Tailor your questions to the "${difficulty}" level and "${focusArea}" focus.
      5. If the focus is "System Design", ask about architecture, scalability, and trade-offs.
      6. If the focus is "Data Structures", ask algorithmic problems.
      7. If the focus is "Behavioral", ask STAR method questions.
    `;

    service
      .startChat(context)
      .then(async () => {
        try {
          const intro = await service.sendMessage("Start the interview.");
          setMessages((prev) => [...prev, { role: "ai", text: intro }]);
          speechSvc.speak(intro, () => setIsAiSpeaking(false));
          setIsAiSpeaking(true);
        } catch (error) {
          setMessages((prev) => [
            ...prev,
            {
              role: "ai",
              text: `Error: ${error.message}. Please check your API key.`,
            },
          ]);
        }
      })
      .catch(() => {
        setMessages((prev) => [
          ...prev,
          {
            role: "ai",
            text: "Failed to initialize interview. Please check your API key and try again.",
          },
        ]);
      });

    return () => {
      speechSvc.cancelSpeech();
      speechSvc.stopListening();
    };
  }, [difficulty, focusArea, jobDesc, resume, company, navigate]);

  const addMessage = useCallback((role, text) => {
    setMessages((prev) => [...prev, { role, text }]);
  }, []);

  const handleStartListening = useCallback(() => {
    if (!speech) return;
    setIsListening(true);
    speechStartTime.current = Date.now();
    speech.startListening(
      (text) => setTranscript(text),
      () => setIsListening(false),
    );
  }, [speech]);

  const handleStopListening = useCallback(async () => {
    if (!speech) return;
    setIsListening(false);
    speech.stopListening();

    if (transcript) {
      // Update stats
      const duration = (Date.now() - speechStartTime.current) / 1000;
      const words = transcript.trim().split(/\s+/).length;
      const fillers = (
        transcript.match(/\b(um|uh|like|you know|sort of|kind of)\b/gi) || []
      ).length;

      setSpeechStats((prev) => ({
        totalWords: prev.totalWords + words,
        speakingTime: prev.speakingTime + duration,
        fillerWords: prev.fillerWords + fillers,
      }));

      addMessage("user", transcript);
      setTranscript("");

      try {
        const response = await aiService.sendMessage(transcript);
        addMessage("ai", response);
        setIsAiSpeaking(true);
        speech.speak(response, () => setIsAiSpeaking(false));
      } catch (error) {
        addMessage("ai", `Error: ${error.message}. Please try again.`);
      }
    }
  }, [speech, transcript, aiService, addMessage]);

  return {
    aiService,
    speech,
    messages,
    setMessages,
    addMessage,
    isAiSpeaking,
    setIsAiSpeaking,
    isListening,
    transcript,
    setTranscript,
    speechStats,
    showAuthWarning,
    setShowAuthWarning,
    handleStartListening,
    handleStopListening,
  };
}
