import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  MessageSquare,
  Star,
  RefreshCw,
  Mic,
  MicOff,
  ArrowLeft,
  Lightbulb,
  Target,
  Zap,
  Sparkles,
  ChevronRight,
  Bookmark,
} from "../../../shared/components/Icons";
import { Layout } from "../../../shared/components/Layout";
import { Button } from "../../../shared/components/Button";
import { Card, CardHeader, CardBody } from "../../../shared/components/Card";
import { BEHAVIORAL_QUESTIONS } from "../../../shared/data/behavioralQuestions";
import { useGeminiAction } from "../../../shared/hooks/useGeminiAction";
import { cn } from "../../../shared/utils/cn";
import { useToast } from "../../../shared/context/ToastContext";
import { Tooltip } from "../../../shared/components/Tooltip";
import { SpeechService } from "../../../shared/services/speech";
import { ApiKeyModal } from "../../../shared/components/ApiKeyModal";
import { AuthWarningModal } from "../../../shared/components/AuthWarningModal";

export const BehavioralPrep = () => {
  const { showToast } = useToast();
  const [gameState, setGameState] = useState("selection");
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [responseText, setResponseText] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [showAuthWarning, setShowAuthWarning] = useState(false);
  const { execute, loading: isAnalyzing } = useGeminiAction(setShowAuthWarning);
  const [isListening, setIsListening] = useState(false);
  const [speech] = useState(new SpeechService());

  const handleQuestionSelect = (question) => {
    setSelectedQuestion(question);
    setGameState("practicing");
    setResponseText("");
    setAnalysis(null);
  };

  const handleAnalyze = async () => {
    if (!responseText.trim()) return;

    await execute(
      (service) =>
        service.analyzeStarResponse(selectedQuestion.question, responseText),
      {
        onSuccess: (result) => {
          setAnalysis(result);
          setGameState("feedback");
        },
      },
    );
  };

  const toggleListening = () => {
    if (isListening) {
      speech.stopListening();
      setIsListening(false);
    } else {
      setIsListening(true);
      speech.startListening(
        (text) => setResponseText((prev) => prev + (prev ? " " : "") + text),
        () => {
          // console.error("Dictation error:", err);
          setIsListening(false);
        },
      );
    }
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
      <div className="max-w-5xl mx-auto py-12 px-4">
        <AnimatePresence mode="wait">
          {gameState === "selection" && (
            <motion.div
              key="selection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-2xl mb-4 text-indigo-600 shadow-lg shadow-indigo-100 dark:shadow-none">
                  <Star size={32} />
                </div>
                <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">
                  STAR METHOD ANALYZER
                </h1>
                <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium">
                  Behavioral interviews are won through structure. Practice
                  common questions and get real-time AI feedback on your{" "}
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                    Situation, Task, Action, and Result
                  </span>
                  .
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {BEHAVIORAL_QUESTIONS.map((q) => (
                  <motion.div
                    key={q.id}
                    whileHover={{ y: -5, scale: 1.01 }}
                    onClick={() => handleQuestionSelect(q)}
                    className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl hover:border-indigo-200 dark:hover:border-indigo-800 cursor-pointer transition-all flex flex-col group"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[10px] uppercase font-black tracking-widest rounded-full">
                        {q.category}
                      </span>
                      <ChevronRight className="w-5 h-5 text-slate-300 dark:text-slate-600 group-hover:text-indigo-400" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 leading-snug flex-1">
                      "{q.question}"
                    </h3>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {gameState === "practicing" && (
            <motion.div
              key="practicing"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-3xl mx-auto"
            >
              <button
                onClick={() => setGameState("selection")}
                className="flex items-center text-slate-400 hover:text-slate-600 mb-8 transition-colors font-bold uppercase text-xs tracking-widest"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Questions
              </button>

              <div className="bg-indigo-600 rounded-3xl p-8 mb-8 text-white shadow-xl shadow-indigo-200 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <MessageSquare size={120} />
                </div>
                <span className="text-indigo-200 text-[10px] uppercase font-black tracking-widest mb-2 block">
                  Behavioral Challenge
                </span>
                <h2 className="text-2xl font-bold leading-relaxed relative z-10">
                  "{selectedQuestion.question}"
                </h2>
                <div className="mt-6 flex items-center gap-2 text-indigo-100 bg-indigo-500/30 p-3 rounded-xl inline-flex text-sm">
                  <Lightbulb size={18} className="text-yellow-300" />
                  <span>Tip: {selectedQuestion.tips}</span>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
                    Your Response
                  </span>
                  <button
                    onClick={toggleListening}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all",
                      isListening
                        ? "bg-red-50 text-red-600 border-red-200 animate-pulse"
                        : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-indigo-100 hover:text-indigo-600 dark:hover:bg-indigo-900/40 dark:hover:text-indigo-400",
                    )}
                  >
                    {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                    {isListening ? "Stop Listening..." : "Dictate Response"}
                  </button>
                </div>
                <textarea
                  className="w-full h-80 px-6 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-4 focus:ring-indigo-50 dark:focus:ring-indigo-900/20 focus:border-indigo-500 outline-none text-slate-700 dark:text-slate-200 text-lg leading-relaxed placeholder:text-slate-300 dark:placeholder:text-slate-600 transition-all font-medium"
                  placeholder="Structure your answer using Situation, Task, Action, and Result..."
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                />
                <Button
                  className="w-full h-14 rounded-2xl text-lg font-bold shadow-lg shadow-indigo-100"
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !responseText.trim()}
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="w-5 h-5 mr-3 animate-spin" />{" "}
                      Analyzing STAR Performance...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 mr-3" /> ANALYZE RESPONSE
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}

          {gameState === "feedback" && analysis && (
            <motion.div
              key="feedback"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setGameState("practicing")}
                  className="flex items-center text-slate-400 hover:text-slate-600 mb-8 transition-colors font-bold uppercase text-xs tracking-widest"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Refine Response
                </button>
                <div className="flex gap-4">
                  <ScoreBadge
                    label="Structure"
                    score={analysis.scores.structure}
                    color="indigo"
                  />
                  <ScoreBadge
                    label="Impact"
                    score={analysis.scores.impact}
                    color="emerald"
                  />
                  <ScoreBadge
                    label="Clarity"
                    score={analysis.scores.clarity}
                    color="amber"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <Card className="border-indigo-100 dark:border-indigo-900/50 bg-indigo-50/30 dark:bg-indigo-900/10 overflow-hidden">
                    <CardHeader className="bg-white dark:bg-slate-800 border-b border-indigo-50 dark:border-indigo-900/30">
                      <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                        <Target size={20} />
                        <h3 className="font-black uppercase tracking-widest text-sm">
                          STAR Breakdown
                        </h3>
                      </div>
                    </CardHeader>
                    <CardBody className="p-0">
                      <StarStep
                        label="S"
                        title="Situation"
                        content={analysis.star_breakdown.situation}
                      />
                      <StarStep
                        label="T"
                        title="Task"
                        content={analysis.star_breakdown.task}
                      />
                      <StarStep
                        label="A"
                        title="Action"
                        content={analysis.star_breakdown.action}
                      />
                      <StarStep
                        label="R"
                        title="Result"
                        content={analysis.star_breakdown.result}
                      />
                    </CardBody>
                  </Card>

                  <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-2xl">
                    <div className="flex items-center gap-2 mb-4 text-emerald-400">
                      <Sparkles size={20} />
                      <h3 className="font-black uppercase tracking-widest text-sm">
                        Coach's Feedback
                      </h3>
                    </div>
                    <p className="text-slate-300 leading-relaxed font-medium italic">
                      "{analysis.overall_feedback}"
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <Card className="border-emerald-100 dark:border-emerald-900/30">
                    <CardHeader className="bg-emerald-50/50 dark:bg-emerald-900/10 border-b border-emerald-100 dark:border-emerald-900/30 flex justify-between items-center">
                      <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                        <Zap size={20} />
                        <h3 className="font-black uppercase tracking-widest text-sm">
                          Improved Version
                        </h3>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-emerald-700 dark:text-emerald-400 font-bold"
                        onClick={() => {
                          setResponseText(analysis.improved_version);
                          setGameState("practicing");
                        }}
                      >
                        Use This
                      </Button>
                    </CardHeader>
                    <CardBody>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium whitespace-pre-wrap">
                        {analysis.improved_version}
                      </p>
                    </CardBody>
                  </Card>

                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant="secondary"
                      className="h-14 rounded-2xl font-bold uppercase tracking-widest"
                      onClick={() => setGameState("selection")}
                    >
                      Try Another
                    </Button>
                    <Tooltip content="Save to Vault" position="left">
                      <Button
                        variant="outline"
                        className="h-14 rounded-2xl font-bold uppercase tracking-widest border-amber-200 text-amber-600 hover:bg-amber-50"
                        onClick={() => {
                          const vault = JSON.parse(
                            localStorage.getItem("nextoffer_ai_vault") || "[]",
                          );
                          const newItem = {
                            id: Date.now(),
                            type: "Behavioral",
                            title: `STAR: ${selectedQuestion.question}`,
                            content: analysis.improved_version,
                            date: new Date().toISOString(),
                          };
                          localStorage.setItem(
                            "nextoffer_ai_vault",
                            JSON.stringify([newItem, ...vault]),
                          );
                          showToast("Saved to Vault!", "success");
                        }}
                      >
                        <Bookmark size={18} className="mr-2" /> Save to Vault
                      </Button>
                    </Tooltip>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
};

const StarStep = ({ label, title, content }) => (
  <div className="p-6 border-b border-indigo-50 dark:border-indigo-900/20 last:border-0 hover:bg-white dark:hover:bg-slate-800 transition-colors">
    <div className="flex gap-4">
      <div className="w-10 h-10 rounded-xl bg-indigo-600 dark:bg-indigo-500 text-white flex items-center justify-center font-black flex-shrink-0">
        {label}
      </div>
      <div>
        <h4 className="font-bold text-slate-900 dark:text-white mb-1">
          {title}
        </h4>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
          {content}
        </p>
      </div>
    </div>
  </div>
);

const ScoreBadge = ({ label, score, color }) => {
  const colors = {
    indigo:
      "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-900/30",
    emerald:
      "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-900/30",
    amber:
      "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-900/30",
  };

  return (
    <div
      className={cn(
        "px-4 py-3 rounded-2xl border flex flex-col items-center min-w-[100px]",
        colors[color],
      )}
    >
      <span className="text-[10px] uppercase font-black tracking-widest mb-1 opacity-70">
        {label}
      </span>
      <span className="text-2xl font-black">{score}/10</span>
    </div>
  );
};
