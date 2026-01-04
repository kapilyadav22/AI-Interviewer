import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from '../../../shared/components/Layout';
import { Button } from '../../../shared/components/Button';
import { 
    Bug, Zap, Trophy, Timer, AlertCircle, 
    CheckCircle2, RefreshCw, ChevronRight,
    Terminal, Play, Search, Layout as LayoutIcon,
    Server, Brain, Shield, ArrowLeft
} from 'lucide-react';
import { BUG_DATA, BUG_CATEGORIES } from '../../../shared/data/bugHuntData';

const ICON_MAP = {
    Layout: LayoutIcon,
    Server: Server,
    Brain: Brain,
    Shield: Shield
};

export const BugHunt = () => {
    const [gameState, setGameState] = useState('welcome'); // welcome, selection, playing, result, finish
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [currentQuestions, setCurrentQuestions] = useState([]);
    const [currentLevel, setCurrentLevel] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedLine, setSelectedLine] = useState(null);
    const [timeLeft, setTimeLeft] = useState(30);
    const [isCorrect, setIsCorrect] = useState(null);
    const [showExplanation, setShowExplanation] = useState(false);

    const level = currentQuestions[currentLevel];

    // Shuffle helper
    const shuffleArray = (array) => {
        const newArr = [...array];
        for (let i = newArr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
        }
        return newArr;
    };

    const handleCategorySelect = (categoryId) => {
        setSelectedCategory(categoryId);
        const categoryData = BUG_DATA[categoryId] || [];
        const shuffled = shuffleArray(categoryData);
        // Take a "sprint" of 10 questions or total available
        setCurrentQuestions(shuffled.slice(0, 10));
        setGameState('playing');
        startGame(true);
    };

    const startGame = (resetLevel = false) => {
        if (resetLevel) {
            setCurrentLevel(0);
            setScore(0);
        }
        setGameState('playing');
        setTimeLeft(30);
        setSelectedLine(null);
        setIsCorrect(null);
        setShowExplanation(false);
    };

    // Timer logic
    useEffect(() => {
        let timer;
        if (gameState === 'playing' && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && gameState === 'playing') {
            setGameState('result');
            setIsCorrect(false);
        }
        return () => clearInterval(timer);
    }, [gameState, timeLeft]);

    const handleLineClick = (index) => {
        if (gameState !== 'playing') return;
        setSelectedLine(index);
        
        const correct = index === level.correctLine;
        setIsCorrect(correct);
        setGameState('result');
        setShowExplanation(true);
        
        if (correct) {
            setScore(prev => prev + (timeLeft * 10));
        }
    };

    const nextLevel = () => {
        if (currentLevel < currentQuestions.length - 1) {
            setCurrentLevel(prev => prev + 1);
            startGame(false);
        } else {
            setGameState('finish');
        }
    };

    const resetGame = () => {
        setGameState('welcome');
        setSelectedCategory(null);
        setCurrentQuestions([]);
        setCurrentLevel(0);
        setScore(0);
    };

    return (
        <Layout>
            <div className="max-w-6xl mx-auto py-12 px-4 min-h-[80vh] flex flex-col items-center">
                
                <AnimatePresence mode="wait">
                    {gameState === 'welcome' && (
                        <motion.div 
                            key="welcome"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8 text-center max-w-lg"
                        >
                            <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-6 text-primary-600 dark:text-primary-400">
                                <Bug size={40} className="animate-pulse" />
                            </div>
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4 italic uppercase tracking-tighter">BUG HUNT: ULTIMATE</h1>
                            <p className="text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                                Debug like a senior engineer! Choose your domain and fix critical production bugs under pressure. 
                                Featuring diverse challenges across the full stack.
                            </p>
                            <Button size="lg" className="w-full py-6 text-lg font-bold" onClick={() => setGameState('selection')}>
                                <Zap className="mr-2 h-5 w-5" /> CHOOSE YOUR STACK
                            </Button>
                        </motion.div>
                    )}

                    {gameState === 'selection' && (
                        <motion.div 
                            key="selection"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="w-full"
                        >
                            <div className="text-center mb-10">
                                <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2">PICK A SPRINT</h1>
                                <p className="text-slate-500 dark:text-slate-400">Each sprint consists of 10 randomized challenges.</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {Object.values(BUG_CATEGORIES).map(cat => {
                                    const Icon = ICON_MAP[cat.icon];
                                    return (
                                        <motion.div
                                            key={cat.id}
                                            whileHover={{ y: -5, scale: 1.02 }}
                                            onClick={() => handleCategorySelect(cat.id)}
                                            className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl hover:border-primary-200 dark:hover:border-primary-800 cursor-pointer transition-all flex flex-col items-center text-center group"
                                        >
                                            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-700 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary-50 dark:group-hover:bg-primary-900/30 transition-colors text-slate-400 dark:text-slate-500 group-hover:text-primary-600 dark:group-hover:text-primary-400">
                                                <Icon size={32} />
                                            </div>
                                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{cat.title}</h3>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 flex-grow">{cat.description}</p>
                                            <Button variant="ghost" className="w-full group-hover:bg-primary-600 group-hover:text-white border-primary-200 dark:border-primary-800 dark:text-slate-300">
                                                START MISSION
                                            </Button>
                                        </motion.div>
                                    );
                                })}
                            </div>
                            <button 
                                onClick={() => setGameState('welcome')}
                                className="mt-12 mx-auto flex items-center text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 font-medium"
                            >
                                <ArrowLeft size={16} className="mr-2" /> Back to Home
                            </button>
                        </motion.div>
                    )}

                    {(gameState === 'playing' || gameState === 'result') && level ? (
                        <motion.div 
                            key="game"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="w-full space-y-6"
                        >
                            {/* Header Stats */}
                            <div className="flex items-center justify-between bg-slate-900 text-white p-4 rounded-xl shadow-lg border-b-4 border-slate-700">
                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-2">
                                        <Trophy size={18} className="text-yellow-400" />
                                        <span className="font-mono text-xl">{score.toLocaleString().padStart(6, '0')}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Timer size={18} className={timeLeft < 10 ? "text-red-400 animate-pulse" : "text-blue-400"} />
                                        <span className={`font-mono text-xl ${timeLeft < 10 ? "text-red-400" : ""}`}>{timeLeft}s</span>
                                    </div>
                                </div>
                                <div className="hidden sm:block">
                                    <span className="bg-slate-800 px-3 py-1 rounded-full text-xs font-bold border border-slate-700 uppercase tracking-widest text-primary-400">
                                        {BUG_CATEGORIES[selectedCategory]?.title || selectedCategory}
                                    </span>
                                </div>
                                <div className="hidden lg:flex items-center gap-2 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
                                    <span className="text-[10px] text-slate-500 font-bold uppercase">Progress</span>
                                    <div className="w-24 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-primary-500" 
                                            style={{ width: `${((currentLevel + 1) / currentQuestions.length) * 100}%` }}
                                        />
                                    </div>
                                    <span className="text-[10px] font-mono text-slate-400">{currentLevel + 1}/{currentQuestions.length}</span>
                                </div>
                                <Button variant="ghost" size="sm" onClick={resetGame} className="text-slate-400 hover:text-white">
                                    <RefreshCw size={16} />
                                </Button>
                            </div>

                            {/* Level Description */}
                            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                                    <Search className="text-primary-500" /> {level.title}
                                </h2>
                                <p className="text-slate-600 dark:text-slate-300 italic">{level.description}</p>
                            </div>

                            {/* Code Editor Mockup */}
                            <div className="bg-[#1e1e1e] rounded-2xl overflow-hidden shadow-2xl border border-slate-800 group relative">
                                <div className="bg-[#252526] px-4 py-2 flex items-center justify-between border-b border-[#333]">
                                    <div className="flex items-center gap-2">
                                        <div className="flex gap-1.5 mr-4">
                                            <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                                            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                                            <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                                        </div>
                                        <Terminal size={14} className="text-slate-400" />
                                        <span className="text-xs text-slate-400 font-mono">
                                            {level.language}.{level.language === 'javascript' ? 'js' : level.language === 'python' ? 'py' : 'sql'}
                                        </span>
                                    </div>
                                    <Play size={14} className="text-green-500 opacity-50" />
                                </div>
                                <div className="p-6 font-mono text-sm sm:text-base overflow-x-auto">
                                    {level.code.map((line, idx) => (
                                        <motion.div 
                                            key={idx}
                                            whileHover={{ backgroundColor: gameState === 'playing' ? 'rgba(255,255,255,0.05)' : '' }}
                                            onClick={() => handleLineClick(idx)}
                                            className={`
                                                relative pl-12 py-1 cursor-pointer transition-colors flex items-center
                                                ${selectedLine === idx ? (isCorrect ? 'bg-green-500/20' : 'bg-red-500/20') : ''}
                                                ${gameState === 'result' && idx === level.correctLine ? 'bg-green-500/10' : ''}
                                            `}
                                        >
                                            <span className="absolute left-0 w-8 text-right pr-4 text-slate-600 select-none text-xs">
                                                {idx + 1}
                                            </span>
                                            <span className={`
                                                whitespace-pre
                                                ${gameState === 'result' && idx === level.correctLine ? 'text-green-400' : 'text-slate-300'}
                                                ${gameState === 'result' && selectedLine === idx && !isCorrect ? 'text-red-400 line-through' : ''}
                                            `}>
                                                {line}
                                            </span>
                                            {gameState === 'result' && idx === level.correctLine && (
                                                <CheckCircle2 size={16} className="ml-4 text-green-500 flex-shrink-0" />
                                            )}
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Results Overlay */}
                                <AnimatePresence>
                                    {gameState === 'result' && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="p-6 border-t border-slate-800 bg-[#252526]"
                                        >
                                            <div className={`flex items-start gap-4 p-4 rounded-xl mb-6 ${isCorrect ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
                                                {isCorrect ? (
                                                    <CheckCircle2 className="text-green-500 mt-1" />
                                                ) : (
                                                    <AlertCircle className="text-red-500 mt-1" />
                                                )}
                                                <div>
                                                    <h3 className={`font-bold mb-1 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                                                        {isCorrect ? 'CRITICAL BUG MITIGATED!' : 'PRODUCTION OUTAGE!'}
                                                    </h3>
                                                    <p className="text-slate-300 text-sm leading-relaxed">
                                                        {level.explanation}
                                                    </p>
                                                </div>
                                            </div>
                                            <Button onClick={nextLevel} className="w-full">
                                                {currentLevel < currentQuestions.length - 1 ? 'PROCEED TO NEXT SPRINT' : 'FINISH POST-MORTEM'} <ChevronRight className="ml-2 h-4 w-4" />
                                            </Button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    ) : null}

                    {gameState === 'finish' && (
                        <motion.div 
                            key="finish"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-12 text-center max-w-xl"
                        >
                            <div className="w-24 h-24 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-8 text-yellow-600 dark:text-yellow-400 shadow-inner">
                                <Trophy size={48} className="animate-bounce" />
                            </div>
                            <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2 italic">SENIOR ENGINEER</h1>
                            <p className="text-slate-500 dark:text-slate-400 uppercase tracking-widest text-sm font-bold mb-8">Performance Review Complete</p>
                            
                            <div className="grid grid-cols-2 gap-4 mb-10 text-left">
                                <div className="bg-slate-50 dark:bg-slate-700 p-6 rounded-3xl border border-slate-100 dark:border-slate-600">
                                    <div className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-black mb-1 tracking-widest">Final Tech-Score</div>
                                    <div className="text-4xl font-black text-slate-900 dark:text-white font-mono">{score.toLocaleString()}</div>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-700 p-6 rounded-3xl border border-slate-100 dark:border-slate-600">
                                    <div className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-black mb-1 tracking-widest">Bugs Neutralized</div>
                                    <div className="text-4xl font-black text-slate-900 dark:text-white font-mono">{currentQuestions.length}</div>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <Button size="lg" variant="secondary" className="flex-1" onClick={resetGame}>
                                    REPLAY
                                </Button>
                                <Button size="lg" className="flex-1" onClick={() => window.history.back()}>
                                    EXIT GAME
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </Layout>
    );
};
