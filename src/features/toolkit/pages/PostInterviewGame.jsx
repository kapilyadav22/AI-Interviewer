import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

import {
  Shield,
  Mail,
  Sparkles,
  ChevronRight,
  ArrowLeft,
  RefreshCw,
  Copy,
  Check,
  Bookmark,
  Target,
  Lightbulb,
  FileCheck,
  Send,
} from "../../../shared/components/Icons";
import { Layout } from "../../../shared/components/Layout";
import { Button } from "../../../shared/components/Button";
import { Card } from "../../../shared/components/Card";
import { useGeminiAction } from "../../../shared/hooks/useGeminiAction";
import { useToast } from "../../../shared/context/ToastContext";
import { cn } from "../../../shared/utils/cn";
import { ApiKeyModal } from "../../../shared/components/ApiKeyModal";
import { AuthWarningModal } from "../../../shared/components/AuthWarningModal";

export const PostInterviewGame = () => {
  const [gameState, setGameState] = useState("input");
  const [formData, setFormData] = useState({
    role: "",
    company: "",
    context: "Final Round",
  });
  const [data, setData] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [showAuthWarning, setShowAuthWarning] = useState(false);
  const { showToast } = useToast();
  const { execute, loading: isGenerating } =
    useGeminiAction(setShowAuthWarning);

  const handleGenerate = async () => {
    if (!formData.role || !formData.company) return;

    await execute(
      (service) =>
        service.generatePostInterviewKit(
          formData.role,
          formData.company,
          formData.context,
        ),
      {
        onSuccess: (result) => {
          if (result) {
            setData(result);
            setGameState("results");
          }
        },
      },
    );
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const saveToVault = (type, title, content) => {
    const vault = JSON.parse(
      localStorage.getItem("nextoffer_ai_vault") || "[]",
    );
    const newItem = {
      id: Date.now(),
      type,
      title,
      content,
      date: new Date().toISOString(),
    };
    localStorage.setItem(
      "nextoffer_ai_vault",
      JSON.stringify([newItem, ...vault]),
    );
    showToast("Saved to Vault!", "success");
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
      <div className="max-w-6xl mx-auto py-12 px-4">
        <AnimatePresence mode="wait">
          {gameState === "input" ? (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-3xl mx-auto"
            >
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center p-4 bg-amber-100 rounded-3xl mb-6 text-amber-600 shadow-xl shadow-amber-50">
                  <Shield size={40} />
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight uppercase">
                  Post-Interview Game
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-lg font-medium leading-relaxed">
                  Win the post-interview game. Generate high-impact questions to
                  ask and professional thank-you notes.
                </p>
              </div>

              <Card className="p-8 md:p-12 rounded-[2.5rem] border-slate-200 dark:border-slate-800 shadow-2xl space-y-10 dark:bg-slate-800">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-2">
                      Role
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Senior Frontend Engineer"
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border-transparent focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-amber-50 dark:focus:ring-amber-900/30 focus:border-amber-500 outline-none font-bold transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                      value={formData.role}
                      onChange={(e) =>
                        setFormData({ ...formData, role: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-2">
                      Company
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Apple, Meta..."
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border-transparent focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-amber-50 dark:focus:ring-amber-900/30 focus:border-amber-500 outline-none font-bold transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                      value={formData.company}
                      onChange={(e) =>
                        setFormData({ ...formData, company: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    Interview Stage
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {["First Round", "Final Round", "Executive Review"].map(
                      (stage) => (
                        <button
                          key={stage}
                          onClick={() =>
                            setFormData({ ...formData, context: stage })
                          }
                          className={cn(
                            "py-3 rounded-xl border-2 font-black text-xs uppercase tracking-tight transition-all",
                            formData.context === stage
                              ? "bg-slate-900 dark:bg-amber-600 border-slate-900 dark:border-amber-600 text-white shadow-lg"
                              : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:border-slate-200 dark:hover:border-slate-600",
                          )}
                        >
                          {stage}
                        </button>
                      ),
                    )}
                  </div>
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating || !formData.role || !formData.company}
                  className="w-full h-16 rounded-[1.5rem] bg-amber-600 hover:bg-amber-700 text-xl font-black shadow-xl shadow-amber-100 flex items-center justify-center gap-4"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw size={24} className="animate-spin" /> CRAFTING
                      YOUR MISSION...{" "}
                    </>
                  ) : (
                    <>
                      GENERATE POST-INTERVIEW KIT <ChevronRight size={24} />
                    </>
                  )}
                </Button>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-5xl mx-auto space-y-12"
            >
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setGameState("input")}
                  className="flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors font-bold uppercase text-[10px] tracking-widest"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Change Target
                </button>
                <div className="px-6 py-2 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full font-black text-xs uppercase tracking-widest border border-amber-100 dark:border-amber-800/30">
                  {formData.company} • {formData.role}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-8">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                      <Target size={20} />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
                      Reverse Interviewing
                    </h2>
                  </div>
                  {data.reverseQuestions.map((q, i) => (
                    <Card
                      key={i}
                      className="p-6 rounded-2xl border-slate-100 dark:border-slate-700 shadow-lg hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors space-y-4 dark:bg-slate-800"
                    >
                      <h3 className="font-black text-slate-800 dark:text-white text-lg leading-tight">
                        "{q.question}"
                      </h3>
                      <div className="flex items-start gap-2 text-slate-500 dark:text-slate-400 font-medium text-sm italic bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700/50">
                        <Lightbulb
                          size={16}
                          className="text-amber-500 flex-shrink-0 mt-0.5"
                        />
                        <p>Why this works: {q.why}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-indigo-600 hover:bg-indigo-50 font-bold justify-between"
                        onClick={() => copyToClipboard(q.question, `q-${i}`)}
                      >
                        {copiedId === `q-${i}` ? (
                          <Check size={16} />
                        ) : (
                          <Copy size={16} />
                        )}
                        {copiedId === `q-${i}` ? "COPIED" : "COPY QUESTION"}
                      </Button>
                    </Card>
                  ))}
                </div>

                <div className="space-y-10">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                        <Mail size={20} />
                      </div>
                      <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
                        Thank-You Note AI
                      </h2>
                    </div>
                    <Card className="p-8 rounded-[2.5rem] border-slate-200 dark:border-slate-700 shadow-xl space-y-6 relative overflow-hidden group dark:bg-slate-800">
                      <div className="absolute -right-10 -bottom-10 text-emerald-500/5 rotate-12 group-hover:scale-110 transition-transform duration-700">
                        <Send size={200} />
                      </div>
                      <div className="relative z-10 bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-6 text-slate-700 dark:text-slate-300 font-medium text-sm leading-relaxed border border-slate-100 dark:border-slate-700/50 whitespace-pre-wrap">
                        {data.thankYouDraft}
                      </div>
                      <div className="flex gap-3 relative z-10">
                        <Button
                          className="flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 font-black"
                          onClick={() =>
                            copyToClipboard(data.thankYouDraft, "thankyou")
                          }
                        >
                          {copiedId === "thankyou" ? "COPIED!" : "COPY DRAFT"}
                        </Button>
                        <Button
                          variant="outline"
                          className="rounded-xl border-amber-200 text-amber-600 hover:bg-amber-50"
                          onClick={() =>
                            saveToVault(
                              "Post-Interview",
                              `Thank You for ${formData.company}`,
                              data.thankYouDraft,
                            )
                          }
                        >
                          <Bookmark size={18} />
                        </Button>
                      </div>
                    </Card>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
                        <FileCheck size={20} />
                      </div>
                      <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
                        Talking Points
                      </h2>
                    </div>
                    <div className="space-y-4">
                      {data.talkingPoints.map((point, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm"
                        >
                          <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center font-black text-xs flex-shrink-0">
                            {i + 1}
                          </div>
                          <p className="text-slate-700 dark:text-slate-300 font-bold">
                            {point}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-10 bg-slate-900 rounded-[3rem] text-white flex items-center justify-between shadow-2xl relative overflow-hidden group">
                <div className="absolute -right-20 -bottom-20 text-white/5 rotate-12 group-hover:scale-110 transition-transform duration-700">
                  <Sparkles size={300} />
                </div>
                <div className="relative z-10 space-y-3">
                  <h4 className="text-3xl font-black uppercase tracking-tight italic">
                    Fortune favors the prepared.
                  </h4>
                  <p className="text-slate-400 font-medium max-w-lg">
                    These questions and notes are strategically designed to show
                    high intent and peak professional courtesy.
                  </p>
                </div>
                <Button
                  onClick={handleGenerate}
                  className="relative z-10 bg-white text-slate-900 hover:bg-slate-100 font-black px-10 h-14 rounded-2xl shadow-xl shadow-white/10"
                >
                  REFRESH KIT
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
};
