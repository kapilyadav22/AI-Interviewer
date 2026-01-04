import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Mic, MessageSquare, Sparkles, 
    TrendingUp, Target, Clock,
    RefreshCw, ChevronRight, Award,
    CheckCircle2, AlertCircle, Quote,
    ArrowLeft, Send, Zap
} from 'lucide-react';
import { Layout } from '../../../shared/components/Layout';
import { Button } from '../../../shared/components/Button';
import { Card } from '../../../shared/components/Card';
import { GeminiService } from '../../../shared/services/gemini';
import { useToast } from '../../../shared/context/ToastContext';
import { config } from '../../../config';
import { cn } from '../../../shared/utils/cn';
import { Tooltip } from '../../../shared/components/Tooltip';

import { useNavigate } from 'react-router-dom';
import { SpeechService } from '../../../shared/services/speech';

export const PitchCoach = () => {
    const [gameState, setGameState] = useState('input'); // input, analysis
    const [pitch, setPitch] = useState('');
    const [role, setRole] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysis, setAnalysis] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [speech] = useState(new SpeechService());
    const { showToast } = useToast();
    
    const toggleRecording = () => {
        if (isRecording) {
            speech.stopListening();
            setIsRecording(false);
        } else {
            setIsRecording(true);
            speech.startListening(
                (text) => setPitch(prev => prev + (prev ? ' ' : '') + text),
                (err) => {
                    // DEBUG: console.error("Speech recognition error:", err);
                    setIsRecording(false);
                }
            );
        }
    };

    const handleAnalyze = async () => {
        if (!pitch.trim() || !role.trim()) return;
        
        setIsAnalyzing(true);
        try {
            const gemini = new GeminiService(config.geminiApiKey);
            const result = await gemini.analyzePitch(pitch, role);
            if (result) {
                setAnalysis(result);
                setGameState('analysis');
                showToast("Pitch analyzed successfully!", "success");
            }
        } catch (error) {
            showToast(error.message, "error");
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <Layout>
            <div className="max-w-6xl mx-auto py-12 px-4">
                <AnimatePresence mode="wait">
                    {gameState === 'input' ? (
                        <motion.div
                            key="input"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="max-w-2xl mx-auto"
                        >
                            <div className="text-center mb-12">
                                <div className="inline-flex items-center justify-center p-4 bg-indigo-100 dark:bg-indigo-900/30 rounded-3xl mb-6 text-indigo-600 dark:text-indigo-400 shadow-xl shadow-indigo-50 dark:shadow-none">
                                    <Sparkles size={40} />
                                </div>
                                <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight uppercase">Elevator Pitch Coach</h1>
                                <p className="text-slate-500 dark:text-slate-400 text-lg font-medium leading-relaxed">
                                    Master the first 2 minutes. We'll analyze your "Tell me about yourself" opener and turn it into a high-impact "Platinum Version."
                                </p>
                            </div>

                            <Card className="p-8 md:p-10 rounded-[2.5rem] border-slate-200 dark:border-slate-700 shadow-2xl space-y-8 dark:bg-slate-800">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                        <Target size={14} /> target position
                                    </label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. Senior Frontend Engineer..." 
                                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border-transparent focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-indigo-50 dark:focus:ring-indigo-900/20 focus:border-indigo-500 outline-none font-bold transition-all text-lg text-slate-900 dark:text-white placeholder:text-slate-400"
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                            <Quote size={14} /> your pitch
                                        </label>
                                        <button 
                                            onClick={toggleRecording}
                                            className={cn(
                                                "flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
                                                isRecording 
                                                    ? "bg-red-100 text-red-600 animate-pulse" 
                                                    : "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600"
                                            )}
                                        >
                                            <Mic size={14} /> {isRecording ? "Stop Recording" : "Record Voice"}
                                        </button>
                                    </div>
                                    <textarea 
                                        placeholder="Tell us about yourself... or hit Record to speak!" 
                                        className="w-full h-64 px-8 py-6 rounded-[2rem] bg-slate-50 dark:bg-slate-900 border-transparent focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-indigo-50 dark:focus:ring-indigo-900/20 focus:border-indigo-500 outline-none font-medium transition-all text-lg leading-relaxed resize-none text-slate-900 dark:text-white placeholder:text-slate-400"
                                        value={pitch}
                                        onChange={(e) => setPitch(e.target.value)}
                                    />
                                </div>

                                <Button 
                                    onClick={handleAnalyze}
                                    disabled={isAnalyzing || !pitch.trim() || !role.trim()}
                                    className="w-full h-16 rounded-[1.5rem] bg-indigo-600 hover:bg-indigo-700 text-xl font-black shadow-xl shadow-indigo-100 flex items-center justify-center gap-4"
                                >
                                    {isAnalyzing ? (
                                        <><RefreshCw size={24} className="animate-spin" /> ANALYZING PITCH...</>
                                    ) : (
                                        <>GET PLATINUM FEEDBACK <ChevronRight size={24} /></>
                                    )}
                                </Button>
                            </Card>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="analysis"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="max-w-5xl mx-auto space-y-10"
                        >
                            <div className="flex items-center justify-between">
                                <button 
                                    onClick={() => setGameState('input')}
                                    className="flex items-center text-slate-400 hover:text-slate-600 transition-colors font-bold uppercase text-[10px] tracking-widest"
                                >
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Edit Pitch
                                </button>
                                <div className="px-6 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full font-black text-xs uppercase tracking-widest">
                                    Target: {role}
                                </div>
                            </div>

                            {/* Scores */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <ScoreCard icon={<Target size={20}/>} label="Impact" val={analysis.scores.impact} color="indigo" />
                                <ScoreCard icon={<Clock size={20}/>} label="Conciseness" val={analysis.scores.conciseness} color="blue" />
                                <ScoreCard icon={<Zap size={20}/>} label="Hook Factor" val={analysis.scores.hook} color="amber" />
                            </div>

                            {/* Comparison */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                                <div className="flex flex-col">
                                    <h3 className="text-slate-400 font-black uppercase text-[10px] tracking-widest mb-4 flex items-center gap-2">
                                        <Quote size={16} /> ORIGINAL DRAFT
                                    </h3>
                                    <div className="flex-1 p-8 rounded-[2.5rem] bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-medium text-lg leading-relaxed italic">
                                        "{pitch}"
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <h3 className="text-indigo-600 dark:text-indigo-400 font-black uppercase text-[10px] tracking-widest mb-4 flex items-center gap-2">
                                        <Sparkles size={16} /> PLATINUM VERSION
                                    </h3>
                                    <div className="flex-1 p-8 rounded-[2.5rem] bg-indigo-900 border border-indigo-800 text-white font-bold text-xl leading-relaxed shadow-2xl relative overflow-hidden group">
                                        <div className="absolute -right-4 -top-4 text-white/5 group-hover:scale-110 transition-transform duration-700">
                                            <Award size={200} />
                                        </div>
                                        <div className="relative z-10">
                                            {analysis.platinum_version}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Feedback & Analysis */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <Card className="lg:col-span-2 p-10 rounded-[2.5rem] border-slate-200 dark:border-slate-700 dark:bg-slate-800">
                                    <h3 className="text-slate-400 dark:text-slate-500 font-black uppercase text-[10px] tracking-widest mb-8 flex items-center gap-2">
                                        <MessageSquare size={18} /> Strategic Feedback
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="space-y-4">
                                            <h4 className="text-emerald-600 font-black text-xs uppercase flex items-center gap-2">
                                                <CheckCircle2 size={16} /> What works well
                                            </h4>
                                            <ul className="space-y-3">
                                                {analysis.feedback.positives.map((p, i) => (
                                                    <li key={i} className="flex gap-3 text-slate-600 dark:text-slate-300 font-medium">
                                                        <span className="text-emerald-500 mt-1">•</span> {p}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="space-y-4">
                                            <h4 className="text-amber-600 font-black text-xs uppercase flex items-center gap-2">
                                                <AlertCircle size={16} /> Areas to fix
                                            </h4>
                                            <ul className="space-y-3">
                                                {analysis.feedback.improvements.map((p, i) => (
                                                    <li key={i} className="flex gap-3 text-slate-600 dark:text-slate-300 font-medium">
                                                        <span className="text-amber-500 mt-1">•</span> {p}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </Card>

                                <Card className="p-10 rounded-[2.5rem] bg-slate-900 text-white border-transparent shadow-xl">
                                    <h3 className="text-indigo-400 font-black uppercase text-[10px] tracking-widest mb-6 flex items-center gap-2">
                                        <Award size={18} /> WHY IT'S STRONGER
                                    </h3>
                                    <p className="text-slate-300 font-medium leading-relaxed italic">
                                        {analysis.analysis}
                                    </p>
                                    <div className="mt-8 pt-8 border-t border-white/10">
                                        <Tooltip content="Permanent Save" position="top">
                                            <Button 
                                                className="w-full bg-indigo-600 hover:bg-indigo-700 font-bold"
                                                onClick={() => {
                                                    const vault = JSON.parse(localStorage.getItem('nextoffer_ai_vault') || '[]');
                                                    const newItem = {
                                                        id: Date.now(),
                                                        type: 'Pitch',
                                                        title: `Pitch for ${role}`,
                                                        content: analysis.platinum_version,
                                                        date: new Date().toISOString()
                                                    };
                                                    localStorage.setItem('nextoffer_ai_vault', JSON.stringify([newItem, ...vault]));
                                                    showToast('Saved to Vault!', 'success');
                                                }}
                                            >
                                                Save This Pitch
                                            </Button>
                                        </Tooltip>
                                    </div>
                                </Card>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </Layout>
    );
};

const ScoreCard = ({ icon, label, val, color }) => {
    const colors = {
        indigo: "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800",
        blue: "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800",
        amber: "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800",
    };
    return (
        <Card className={cn("p-8 text-center space-y-4 rounded-[2rem] border-b-8 shadow-sm dark:bg-slate-800", colors[color])}>
            <div className="flex items-center justify-center gap-2 font-black uppercase text-[10px] tracking-widest opacity-60">
                {icon} {label}
            </div>
            <div className="text-5xl font-black">{val}<span className="text-lg opacity-40">/10</span></div>
            <div className="w-full bg-current/10 h-1.5 rounded-full overflow-hidden">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${val * 10}%` }}
                    className="h-full bg-current rounded-full"
                />
            </div>
        </Card>
    );
};
