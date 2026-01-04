import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Brain, Sparkles, ChevronRight, 
    RefreshCw, CheckCircle2, HelpCircle,
    Trophy, Zap, AlertCircle, Copy, Check,
    Cpu, Coffee, Code2, Terminal
} from 'lucide-react';
import { Button } from './Button';
import { Card } from './Card';
import { GeminiService } from '../services/gemini';
import { useToast } from '../context/ToastContext';
import { config } from '../../config';
import { cn } from '../utils/cn';
import ReactMarkdown from 'react-markdown';

export const BrainTeaser = ({ teaser: propTeaser, loading: propLoading }) => {
    const [teaser, setTeaser] = useState(propTeaser || null);
    const [isLoading, setIsLoading] = useState(propLoading !== undefined ? propLoading : true);
    const [showAnswer, setShowAnswer] = useState(false);
    const [hasSolved, setHasSolved] = useState(false);
    const [selectedTopic, setSelectedTopic] = useState('General');
    const { showToast } = useToast();

    const TOPICS = [
        { id: 'General', label: 'General', icon: Brain },
        { id: 'JavaScript', label: 'JS/TS', icon: Zap },
        { id: 'React', label: 'React', icon: Sparkles },
        { id: 'Python', label: 'Python', icon: HelpCircle },
        { id: 'AI/ML', label: 'AI/ML', icon: Cpu },
        { id: 'Java', label: 'Java', icon: Coffee },
        { id: 'C/C++', label: 'C/C++', icon: Terminal },
        { id: 'System Design', label: 'Systems', icon: Brain },
    ];

    const fetchTeaser = async (topic = selectedTopic) => {
        setIsLoading(true);
        setShowAnswer(false);
        setHasSolved(false);
        
        try {
            const gemini = new GeminiService(config.geminiApiKey);
            const result = await gemini.getDailyTeaser(topic === 'General' ? 'Software Engineering' : topic);
            
            if (result) {
                setTeaser(result);
                // We only store the "Daily" one if it's general, otherwise it's on-demand
                if (topic === 'General' && !propTeaser) {
                    localStorage.setItem('nextoffer_ai_daily_teaser', JSON.stringify({
                        ...result,
                        date: new Date().toDateString()
                    }));
                }
            }
        } catch (error) {
            showToast("Failed to wake up the brain. Check your API key.", "warning");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (propTeaser) {
            setTeaser(propTeaser);
            setIsLoading(false);
            return;
        }

        const stored = localStorage.getItem('nextoffer_ai_daily_teaser');
        if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed.date === new Date().toDateString()) {
                setTeaser(parsed);
                setIsLoading(false);
                return;
            }
        }
        fetchTeaser();
    }, [propTeaser]);

    const MarkdownComponents = {
        code({ node, inline, className, children, ...props }) {
            const [copied, setCopied] = useState(false);
            const content = String(children).replace(/\n$/, '');

            const handleCopy = () => {
                navigator.clipboard.writeText(content);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            };

            if (inline) {
                return (
                    <code className="px-1.5 py-0.5 bg-white/10 rounded text-amber-400 font-mono text-xs" {...props}>
                        {children}
                    </code>
                );
            }

            return (
                <div className="relative group/code my-4">
                    <div className="absolute right-3 top-3 z-20 opacity-0 group-hover/code:opacity-100 transition-opacity">
                        <button
                            onClick={handleCopy}
                            className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-slate-400 hover:text-white transition-colors border border-white/5 backdrop-blur-sm"
                            title="Copy code"
                        >
                            {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                        </button>
                    </div>
                    <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#0f172a]/50 backdrop-blur-sm">
                        <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/5">
                            <div className="flex gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
                            </div>
                        </div>
                        <pre className="p-4 overflow-x-auto font-mono text-sm leading-relaxed text-slate-300">
                            <code {...props}>{children}</code>
                        </pre>
                    </div>
                </div>
            );
        },
        p({ children }) {
            return <p className="mb-4 last:mb-0 leading-relaxed">{children}</p>;
        }
    };

    if (isLoading) {
        return (
            <Card className="p-8 h-full bg-slate-900 border-transparent flex flex-col items-center justify-center text-center space-y-4">
                <RefreshCw size={40} className="text-primary-500 animate-spin" />
                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Waking up the brain...</p>
            </Card>
        );
    }

    if (!teaser) {
        return (
            <Card className="p-8 h-full bg-slate-900 border-transparent flex flex-col items-center justify-center text-center space-y-4">
                <AlertCircle size={40} className="text-red-500" />
                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Failed to load teaser.</p>
                <Button onClick={fetchTeaser} size="sm" variant="outline" className="text-white border-white/20">Retry</Button>
            </Card>
        );
    }

    return (
        <Card className="p-8 h-full bg-slate-900 border-transparent overflow-hidden relative group">
            {/* Background Decor */}
            <div className="absolute -right-10 -top-10 text-white/5 rotate-12 group-hover:scale-110 transition-transform duration-700">
                <Brain size={240} />
            </div>

            <div className="relative z-10 h-full flex flex-col">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex flex-wrap gap-2">
                        {TOPICS.map((topic) => {
                            const Icon = topic.icon;
                            return (
                                <button
                                    key={topic.id}
                                    onClick={() => {
                                        setSelectedTopic(topic.id);
                                        fetchTeaser(topic.id);
                                    }}
                                    className={cn(
                                        "px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-all outline-none",
                                        selectedTopic === topic.id 
                                            ? "bg-primary-500 text-white shadow-lg shadow-primary-500/30" 
                                            : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-300"
                                    )}
                                >
                                    <Icon size={12} className={cn(selectedTopic === topic.id ? "fill-current" : "")} />
                                    {topic.label}
                                </button>
                            );
                        })}
                    </div>
                    <div className={cn(
                        "hidden sm:block text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md",
                        teaser.difficulty === 'Hard' ? "text-red-400 bg-red-400/10" :
                        teaser.difficulty === 'Medium' ? "text-amber-400 bg-amber-400/10" : "text-emerald-400 bg-emerald-400/10"
                    )}>
                        {teaser.difficulty}
                    </div>
                </div>

                <div className="flex-1 space-y-6">
                    <div className="space-y-4">
                        <div className="text-white text-lg font-bold leading-relaxed tracking-tight prose prose-invert max-w-none">
                            <ReactMarkdown components={MarkdownComponents}>
                                {teaser.question}
                            </ReactMarkdown>
                        </div>
                        <div className="flex gap-4">
                            <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                                <HelpCircle size={14} /> {teaser.type}
                            </span>
                        </div>
                    </div>

                    <AnimatePresence>
                        {showAnswer && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-6 bg-white/5 rounded-2xl border border-white/10 space-y-4"
                            >
                                <div className="flex items-center gap-2 text-emerald-400 font-black text-[10px] uppercase tracking-widest">
                                    <CheckCircle2 size={16} /> The Answer
                                </div>
                                <div className="text-slate-300 font-medium leading-relaxed prose prose-invert max-w-none">
                                    <ReactMarkdown components={MarkdownComponents}>
                                        {teaser.answer}
                                    </ReactMarkdown>
                                </div>
                                <div className="pt-4 border-t border-white/5">
                                    <div className="text-slate-500 text-sm italic leading-relaxed prose prose-invert max-w-none">
                                        <ReactMarkdown components={MarkdownComponents}>
                                            {teaser.explanation}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                    {!showAnswer ? (
                        <Button 
                            onClick={() => {
                                setShowAnswer(true);
                                setHasSolved(true);
                                // Tracking for Dashboard
                                const currentMastery = parseInt(localStorage.getItem('nextoffer_ai_logic_mastery') || '5');
                                localStorage.setItem('nextoffer_ai_logic_mastery', JSON.stringify(Math.min(10, currentMastery + 0.5)));
                            }}
                            className="bg-primary-600 hover:bg-primary-700 font-black text-xs uppercase tracking-widest px-8 rounded-xl h-12"
                        >
                            Reveal Answer <ChevronRight size={18} />
                        </Button>
                    ) : (
                        <div className="flex items-center gap-3 text-emerald-400 font-black text-xs uppercase tracking-widest">
                            <Trophy size={18} /> Mastered Today
                        </div>
                    )}
                    <button 
                        onClick={fetchTeaser}
                        className="p-3 text-slate-500 hover:text-white transition-colors"
                        title="New Teaser"
                    >
                        <RefreshCw size={18} />
                    </button>
                </div>
            </div>
        </Card>
    );
};
