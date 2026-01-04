import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RotateCcw,
  CheckCircle,
  XCircle,
  LayoutGrid,
  Code,
  Server,
  Coffee,
  Zap,
  Award,
  TrendingUp,
  Info,
  History,
  Play,
  ArrowLeft,
  Trophy,
} from "lucide-react";
import { Layout } from "../../../shared/components/Layout";
import { Button } from "../../../shared/components/Button";
import { Card } from "../../../shared/components/Card";
import { flashcardsData } from "../../../shared/data/flashcardEntries/index";
import { cn } from "../../../shared/utils/cn";
import { URLS, STORAGE_KEYS } from "../../../shared/constants/urlConstants";

const CATEGORIES = [
  {
    id: "frontend",
    name: "Frontend",
    icon: <LayoutGrid />,
    color: "blue",
    desc: "React, CSS, HTML, DOM",
  },
  {
    id: "backend",
    name: "Backend",
    icon: <Server />,
    color: "emerald",
    desc: "Databases, API, Architecture",
  },
  {
    id: "javascript",
    name: "JavaScript",
    icon: <Code />,
    color: "amber",
    desc: "ES6+, Closures, Async/Await",
  },
  {
    id: "java",
    name: "Java",
    icon: <Coffee />,
    color: "red",
    desc: "Core Java, OOP, Threads",
  },
];

export const Flashcards = () => {
  const [gameState, setGameState] = useState("lobby"); // lobby, study, results
  const [category, setCategory] = useState(null);
  const [count, setCount] = useState(10);

  // Study State
  const [deck, setDeck] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [results, setResults] = useState([]); // { id, mastered: bool }

  // Leitner System / Mastery Stats
  const [mastery, setMastery] = useState({}); // { cardId: masteredLevel }

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.FLASHCARD_MASTERY);
    if (stored) setMastery(JSON.parse(stored));
  }, []);

  const saveMastery = (cardId, isMastered) => {
    const currentLevel = mastery[cardId] || 0;
    const newLevel = isMastered
      ? Math.min(currentLevel + 1, 5)
      : Math.max(currentLevel - 1, 0);
    const newMastery = { ...mastery, [cardId]: newLevel };
    setMastery(newMastery);
    localStorage.setItem(
      STORAGE_KEYS.FLASHCARD_MASTERY,
      JSON.stringify(newMastery)
    );
  };

  const startSession = () => {
    if (!category) return;

    const allCards = flashcardsData[category].map((c, i) => ({
      ...c,
      id: `${category}-${i}`,
    }));

    // Leitner Sort: Prioritize low mastery cards
    const sorted = [...allCards].sort(
      (a, b) => (mastery[a.id] || 0) - (mastery[b.id] || 0)
    );

    // Shuffle the selected slice for variety
    const selected = sorted
      .slice(0, Math.min(count, allCards.length))
      .sort(() => 0.5 - Math.random());

    setDeck(selected);
    setCurrentIndex(0);
    setResults([]);
    setIsFlipped(false);
    setGameState("study");
  };

  const handleNext = (isMastered) => {
    const currentCard = deck[currentIndex];
    saveMastery(currentCard.id, isMastered);
    setResults((prev) => [
      ...prev,
      { id: currentCard.id, mastered: isMastered },
    ]);

    setIsFlipped(false);
    if (currentIndex < deck.length - 1) {
      setTimeout(() => setCurrentIndex((prev) => prev + 1), 150);
    } else {
      setGameState("results");
    }
  };

  const stats = {
    known: results.filter((r) => r.mastered).length,
    total: deck.length,
    masteryLevel: Object.values(mastery).filter((v) => v >= 3).length,
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto py-12 px-4 h-full min-h-[80vh] flex flex-col">
        <AnimatePresence mode="wait">
          {gameState === "lobby" && (
            <motion.div
              key="lobby"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 dark:bg-slate-700 text-white font-black text-[10px] uppercase tracking-widest mb-4">
                  <Zap size={14} className="text-amber-400" /> Master
                  Fundamentals
                </div>
                <h1 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight uppercase leading-none">
                  Flashcard{" "}
                  <span className="text-primary-600 font-style-italic">
                    Dojo
                  </span>
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-lg font-bold max-w-2xl mx-auto">
                  Test your Technical Skills.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {CATEGORIES.map((cat) => {
                  const masteredCount = Object.keys(mastery).filter(
                    (k) => k.startsWith(cat.id) && mastery[k] >= 3
                  ).length;
                  const totalInCategory = flashcardsData[cat.id].length;

                  return (
                    <motion.div
                      key={cat.id}
                      whileHover={{ y: -8, scale: 1.02 }}
                      onClick={() => setCategory(cat.id)}
                      className={cn(
                        "p-8 rounded-[2rem] border-2 cursor-pointer transition-all relative overflow-hidden group",
                        category === cat.id
                          ? "bg-white dark:bg-slate-800 border-primary-600 dark:border-primary-500 shadow-2xl shadow-primary-100 dark:shadow-primary-900/20 ring-4 ring-primary-50 dark:ring-primary-900/30"
                          : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600 shadow-sm"
                      )}
                    >
                      <div
                        className={cn(
                          "w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg",
                          category === cat.id
                            ? "bg-primary-600 text-white"
                            : "bg-slate-50 dark:bg-slate-700 text-slate-400 dark:text-slate-300"
                        )}
                      >
                        {React.cloneElement(cat.icon, { size: 28 })}
                      </div>
                      <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tight">
                        {cat.name}
                      </h3>
                      <p className="text-slate-500 dark:text-slate-400 text-sm font-bold mb-6">
                        {cat.desc}
                      </p>

                      <div className="pt-4 border-t border-slate-50 dark:border-slate-700 flex items-center justify-between">
                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                          Mastery
                        </div>
                        <div className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                          {masteredCount}/{totalInCategory}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {category && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="max-w-lg mx-auto bg-slate-900 dark:bg-slate-800 p-10 rounded-[2.5rem] shadow-2xl text-white space-y-10"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-primary-400">
                      <span>Session Length</span>
                      <span>{count} Cards</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="30"
                      step="5"
                      value={count}
                      onChange={(e) => setCount(parseInt(e.target.value))}
                      className="w-full h-2 bg-white/10 rounded-full appearance-none accent-primary-500 cursor-pointer"
                    />
                  </div>
                  <Button
                    onClick={startSession}
                    className="w-full h-14 rounded-2xl text-lg font-black group"
                  >
                    START DOJO SESSION{" "}
                    <Play
                      size={20}
                      className="ml-2 fill-current group-hover:scale-110 transition-transform"
                    />
                  </Button>
                </motion.div>
              )}
            </motion.div>
          )}

          {gameState === "study" && (
            <motion.div
              key="study"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 flex flex-col gap-8 max-w-2xl mx-auto w-full"
            >
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setGameState("lobby")}
                  className="flex items-center text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors font-bold uppercase text-[10px] tracking-widest"
                >
                  <ArrowLeft size={16} className="mr-2" /> QUIT SESSION
                </button>
                <div className="text-center">
                  <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">
                    Session Progress
                  </div>
                  <div className="flex gap-1.5 justify-center">
                    {deck.map((_, i) => (
                      <div
                        key={i}
                        className={cn(
                          "w-12 h-1.5 rounded-full transition-all duration-500",
                          i < currentIndex
                            ? "bg-emerald-500"
                            : i === currentIndex
                            ? "bg-primary-600 dark:bg-primary-500 w-16 shadow-lg shadow-primary-100 dark:shadow-primary-900/30"
                            : "bg-slate-200 dark:bg-slate-700"
                        )}
                      />
                    ))}
                  </div>
                </div>
                <div className="w-24 text-right">
                  <span className="text-xl font-black text-slate-900 dark:text-white">
                    {currentIndex + 1}
                  </span>
                  <span className="text-sm font-bold text-slate-400 dark:text-slate-500">
                    {" "}
                    / {deck.length}
                  </span>
                </div>
              </div>

              <div className="flex-1 perspective-2000 relative min-h-[500px] flex items-center justify-center">
                <motion.div
                  key={currentIndex}
                  initial={{ x: 100, opacity: 0, rotate: 5 }}
                  animate={{ x: 0, opacity: 1, rotate: 0 }}
                  exit={{ x: -100, opacity: 0, rotate: -5 }}
                  transition={{ type: "spring", damping: 25, stiffness: 120 }}
                  className="w-full h-[500px] relative preserve-3d"
                >
                  <div
                    onClick={() => setIsFlipped(!isFlipped)}
                    className={cn(
                      "w-full h-full cursor-pointer transition-all duration-700 transform-style-3d relative group",
                      isFlipped ? "rotate-y-180" : ""
                    )}
                  >
                    {/* Physical Card Front */}
                    <div className="absolute inset-0 backface-hidden bg-[#fdfdfd] dark:bg-slate-800 rounded-[2.5rem] border-t-2 border-l-2 border-white/80 dark:border-slate-700/50 shadow-[0_20px_50px_rgba(0,0,0,0.1),0_10px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-12 flex flex-col items-center justify-center text-center overflow-hidden">
                      {/* Paper Texture Overlay */}
                      <div
                        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none mix-blend-multiply dark:mix-blend-overlay"
                        style={{
                          backgroundImage: `url('${URLS.ASSETS.PAPER_TEXTURE}')`,
                        }}
                      />

                      {/* Decorative lines like a index card */}
                      <div className="absolute top-16 left-0 right-0 h-[1px] bg-red-100/50 dark:bg-red-900/20" />
                      <div
                        className="absolute top-24 left-0 right-0 bottom-0 opacity-[0.4] dark:opacity-[0.1]"
                        style={{
                          background:
                            "linear-gradient(transparent 31px, #e2e8f0 31px)",
                          backgroundSize: "100% 32px",
                        }}
                      />

                      <div className="relative z-10 space-y-8 flex flex-col items-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white dark:bg-slate-700 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-300 shadow-sm border border-slate-100 dark:border-slate-600">
                          Mastery LVL {mastery[deck[currentIndex].id] || 0}
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-white leading-[1.15] tracking-tight max-w-sm">
                          {deck[currentIndex].q}
                        </h2>
                        <div className="pt-4 flex flex-col items-center gap-2">
                          <div className="w-12 h-1 bg-primary-500/20 rounded-full" />
                          <p className="text-slate-400 dark:text-slate-500 font-bold uppercase text-[9px] tracking-[0.2em] animate-pulse">
                            Touch to reveal
                          </p>
                        </div>
                      </div>

                      {/* Category Icon Watermark */}
                      <div className="absolute -bottom-10 -right-10 opacity-[0.03] dark:opacity-[0.08] transform -rotate-12 scale-[3]">
                        {CATEGORIES.find((c) => c.id === category)?.icon}
                      </div>
                    </div>

                    {/* Physical Card Back */}
                    <div className="absolute inset-0 backface-hidden bg-slate-900 dark:bg-slate-950 rounded-[2.5rem] p-12 flex flex-col items-center justify-center text-center rotate-y-180 text-white shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/5 overflow-hidden">
                      {/* Premium Gradient Background */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary-900/40 to-transparent opacity-50" />

                      <div className="relative z-10 space-y-10 flex flex-col items-center">
                        <div className="w-20 h-1 bg-primary-500/50 rounded-full" />
                        <p className="text-xl md:text-2xl font-medium leading-relaxed text-slate-200 antialiased max-w-sm">
                          {deck[currentIndex].a}
                        </p>
                        <div className="w-20 h-1 bg-primary-500/50 rounded-full" />
                      </div>

                      {/* Decorative Corner */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-bl-[100%] transition-all" />
                    </div>
                  </div>
                </motion.div>
              </div>

              <div
                className={cn(
                  "flex justify-center gap-6 transition-all duration-500",
                  isFlipped
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10 pointer-events-none"
                )}
              >
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext(false);
                  }}
                  className="px-12 h-16 rounded-3xl bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-900/10 hover:border-red-200 dark:hover:border-red-900/30 hover:text-red-600 dark:hover:text-red-400 font-black flex items-center gap-3 text-lg transition-all shadow-xl hover:shadow-red-900/10"
                >
                  <XCircle className="text-red-500" /> RE-STUDY
                </Button>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext(true);
                  }}
                  className="px-12 h-16 rounded-3xl bg-slate-900 dark:bg-primary-600 hover:bg-black dark:hover:bg-primary-700 text-white font-black flex items-center gap-3 text-lg transition-all shadow-2xl hover:scale-[1.02] active:scale-[0.98]"
                >
                  <CheckCircle className="text-emerald-400" /> MASTERED
                </Button>
              </div>
            </motion.div>
          )}

          {gameState === "results" && (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl mx-auto text-center space-y-12"
            >
              <div className="space-y-4">
                <div className="w-24 h-24 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-400 mx-auto shadow-xl shadow-primary-50 dark:shadow-none">
                  <Trophy size={48} />
                </div>
                <h2 className="text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  Dojo Session{" "}
                  <span className="text-primary-600 font-style-italic">
                    Ended
                  </span>
                </h2>
                <p className="text-slate-500 dark:text-slate-400 font-bold text-lg">
                  Great work! You've strengthened your technical muscle memory.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="p-10 rounded-[2.5rem] bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-xl">
                  <div className="text-5xl font-black text-emerald-600 dark:text-emerald-400 mb-2">
                    {stats.known}
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                    Mastered Today
                  </div>
                </div>
                <div className="p-10 rounded-[2.5rem] bg-slate-900 border border-slate-800 shadow-2xl text-white">
                  <div className="text-5xl font-black text-primary-400 mb-2">
                    {stats.masteryLevel}
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                    Total Pro Cards
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <Button
                  onClick={startSession}
                  className="h-16 rounded-2xl text-xl font-black"
                >
                  START NEW DRILL
                </Button>
                <Button
                  onClick={() => setGameState("lobby")}
                  variant="outline"
                  className="h-16 rounded-2xl text-xl font-black border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  BACK TO LOBBY
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
};
