import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "../../../shared/components/Layout";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
} from "../../../shared/components/Card";
import { Input } from "../../../shared/components/Input";
import { Button } from "../../../shared/components/Button";
import {
  Key,
  FileText,
  Briefcase,
  Upload,
  Loader2,
  Bot,
  Clock,
  Mic,
  MicOff,
} from "../../../shared/components/Icons";
import { extractTextFromPdf } from "../../../shared/utils/pdf";
import { SpeechService } from "../../../shared/services/speech";
import { useToast } from "../../../shared/context/ToastContext";
import { cn } from "../../../shared/utils/cn";
import { config } from "../../../config";

export const Setup = () => {
  const navigate = useNavigate();
  const [provider, setProvider] = useState("gemini"); // 'gemini', 'openai', or 'grok'
  const [apiKey, setApiKey] = useState(
    localStorage.getItem("gemini_api_key") || config.geminiApiKey || "",
  );
  const [resume, setResume] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [duration, setDuration] = useState(30);
  const [difficulty, setDifficulty] = useState("Mid-Level");
  const [focusArea, setFocusArea] = useState("General");
  const [loading, setLoading] = useState(false);
  const [parsingPdf, setParsingPdf] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [listeningTo, setListeningTo] = useState(null); // 'resume' or 'jobDesc'
  const [speech] = useState(new SpeechService());
  const { showToast } = useToast();

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
      setResume(text);
    } catch {
      showToast(
        "Failed to read PDF. Please try pasting the text instead.",
        "error",
      );
    } finally {
      setParsingPdf(false);
    }
  };

  const toggleDictation = (target) => {
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
            setResume((prev) => prev + (prev ? " " : "") + text);
          } else {
            setJobDesc((prev) => prev + (prev ? " " : "") + text);
          }
        },
        () => {
          // DEBUG: console.error("Dictation error:", err);
          setIsListening(false);
          setListeningTo(null);
        },
      );
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!apiKey || !resume) return;

    setLoading(true);
    // Store in localStorage
    localStorage.setItem("ai_provider", provider);
    localStorage.setItem(`${provider}_api_key`, apiKey);

    // Navigate to interview with state
    navigate("/interview", {
      state: {
        resume,
        jobDesc,
        duration,
        difficulty,
        focusArea,
      },
    });
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Setup Your Interview
            </h2>
            <p className="text-slate-500 dark:text-slate-400">
              Configure your session details below.
            </p>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardBody className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-slate-900 dark:text-white font-medium">
                  <Bot className="w-5 h-5 text-primary-500" />
                  <h3>AI Provider</h3>
                </div>
                <select
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  value={provider}
                  onChange={(e) => {
                    const newProvider = e.target.value;
                    setProvider(newProvider);
                    if (newProvider === "gemini") {
                      setApiKey(
                        localStorage.getItem("gemini_api_key") ||
                          config.geminiApiKey ||
                          "",
                      );
                    } else {
                      setApiKey("");
                    }
                  }}
                >
                  <option value="gemini">Google Gemini</option>
                  <option value="openai">OpenAI (ChatGPT)</option>
                  <option value="grok">xAI Grok</option>
                </select>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-slate-900 dark:text-white font-medium">
                  <Key className="w-5 h-5 text-primary-500" />
                  <h3>
                    {provider === "gemini"
                      ? "Gemini"
                      : provider === "grok"
                        ? "Grok"
                        : "OpenAI"}{" "}
                    API Key
                  </h3>
                </div>
                <Input
                  type="password"
                  placeholder={`Enter your ${
                    provider === "gemini"
                      ? "Gemini"
                      : provider === "grok"
                        ? "Grok"
                        : "OpenAI"
                  } API Key`}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  required
                  className="font-mono bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-slate-300 dark:border-slate-700 placeholder-slate-400 dark:placeholder-slate-500"
                />
                <p className="text-xs text-slate-500">
                  Your key is stored locally in your browser and used only for
                  this session.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-slate-900 dark:text-white font-medium">
                    <Briefcase className="w-5 h-5 text-primary-500" />
                    <h3>Difficulty Level</h3>
                  </div>
                  <select
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                  >
                    <option value="Junior">Junior</option>
                    <option value="Mid-Level">Mid-Level</option>
                    <option value="Senior">Senior</option>
                    <option value="Lead">Lead / Staff</option>
                  </select>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-slate-900 dark:text-white font-medium">
                    <Clock className="w-5 h-5 text-primary-500" />
                    <h3>Focus Area</h3>
                  </div>
                  <select
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    value={focusArea}
                    onChange={(e) => setFocusArea(e.target.value)}
                  >
                    <option value="General">General</option>
                    <option value="Data Structures & Algorithms">
                      Data Structures & Algorithms
                    </option>
                    <option value="System Design">System Design</option>
                    <option value="Frontend (React)">Frontend (React)</option>
                    <option value="Backend (Node.js)">Backend (Node.js)</option>
                    <option value="Behavioral">Behavioral (Soft Skills)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between text-slate-900 dark:text-white font-medium">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-primary-500" />
                    <h3>Resume / Experience</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => toggleDictation("resume")}
                      className={cn(
                        "transition-all duration-300",
                        isListening && listeningTo === "resume"
                          ? "bg-red-50 text-red-600 border-red-200 animate-pulse"
                          : "",
                      )}
                    >
                      {isListening && listeningTo === "resume" ? (
                        <MicOff className="w-4 h-4 mr-2" />
                      ) : (
                        <Mic className="w-4 h-4 mr-2" />
                      )}
                      {isListening && listeningTo === "resume"
                        ? "Stop"
                        : "Dictate"}
                    </Button>
                    <div className="relative">
                      <input
                        type="file"
                        accept=".pdf"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={handlePdfUpload}
                        disabled={parsingPdf}
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        disabled={parsingPdf}
                      >
                        {parsingPdf ? (
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                          <Upload className="w-4 h-4 mr-2" />
                        )}
                        {parsingPdf ? "Parsing..." : "Upload PDF"}
                      </Button>
                    </div>
                  </div>
                </div>
                <textarea
                  className="w-full h-40 px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all resize-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                  placeholder="Paste your resume text here or upload a PDF..."
                  value={resume}
                  onChange={(e) => setResume(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between text-slate-900 dark:text-white font-medium">
                  <div className="flex items-center space-x-2">
                    <Briefcase className="w-5 h-5 text-primary-500" />
                    <h3>Job Description (Optional)</h3>
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => toggleDictation("jobDesc")}
                    className={cn(
                      "transition-all duration-300",
                      isListening && listeningTo === "jobDesc"
                        ? "bg-red-50 text-red-600 border-red-200 animate-pulse"
                        : "",
                    )}
                  >
                    {isListening && listeningTo === "jobDesc" ? (
                      <MicOff className="w-4 h-4 mr-2" />
                    ) : (
                      <Mic className="w-4 h-4 mr-2" />
                    )}
                    {isListening && listeningTo === "jobDesc"
                      ? "Stop"
                      : "Dictate"}
                  </Button>
                </div>
                <textarea
                  className="w-full h-32 px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all resize-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                  placeholder="Paste the job description you are applying for..."
                  value={jobDesc}
                  onChange={(e) => setJobDesc(e.target.value)}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-slate-900 dark:text-white font-medium">
                  <Clock className="w-5 h-5 text-primary-500" />
                  <h3>Interview Duration</h3>
                </div>
                <select
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                >
                  <option value={15}>15 Minutes</option>
                  <option value={30}>30 Minutes</option>
                  <option value={45}>45 Minutes</option>
                  <option value={60}>60 Minutes</option>
                </select>
              </div>
            </CardBody>
            <CardFooter className="flex justify-end">
              <Button
                type="submit"
                size="lg"
                isLoading={loading}
                disabled={!apiKey || !resume || parsingPdf}
              >
                Start Interview
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </Layout>
  );
};
