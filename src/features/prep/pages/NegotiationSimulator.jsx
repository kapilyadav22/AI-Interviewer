import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    DollarSign, Briefcase, Building2, 
    MessageSquare, Send, ArrowLeft, 
    LineChart, ShieldCheck, Zap,
    TrendingUp, Award, AlertCircle,
    ChevronRight, RefreshCw, Sparkles,
    Mic, Volume2, Bookmark
} from 'lucide-react';
import { Layout } from '../../../shared/components/Layout';
import { Button } from '../../../shared/components/Button';
import { Card, CardHeader, CardBody } from '../../../shared/components/Card';
import { GeminiService } from '../../../shared/services/gemini';
import { useToast } from '../../../shared/context/ToastContext';
import { config } from '../../../config';
import { cn } from '../../../shared/utils/cn';
import { Tooltip } from '../../../shared/components/Tooltip';
import { SpeechService } from '../../../shared/services/speech';

export const NegotiationSimulator = () => {
    const [gameState, setGameState] = useState('setup'); // setup, chatting, feedback
    const [offerData, setOfferData] = useState({
        company: '',
        role: '',
        base: '',
        equity: '',
        signon: ''
    });
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisError, setAnalysisError] = useState(false);
    const [analysis, setAnalysis] = useState(null);
    const [aiService, setAiService] = useState(null);
    const [speechService] = useState(new SpeechService());
    const [isListening, setIsListening] = useState(false);
    const [isAiSpeaking, setIsAiSpeaking] = useState(false);
    const { showToast } = useToast();
    const chatEndRef = useRef(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleStart = async () => {
        if (!offerData.company || !offerData.role || !offerData.base) return;
        
        try {
            const gemini = new GeminiService(config.geminiApiKey);
            setAiService(gemini);
            
            await gemini.startNegotiationChat(offerData);
            
            // Get initial greeting from Alex
            setIsTyping(true);
            setGameState('chatting'); // Move here to ensure service started
            const result = await gemini.chat.sendMessage("Hello Alex, I'd like to discuss the offer.");
            const text = await result.response.text();
            setMessages([{ role: 'ai', text }]);
            
            // Speak initial greeting
            setIsAiSpeaking(true);
            speechService.speak(text, () => setIsAiSpeaking(false));
        } catch (error) {
            showToast("Failed to start negotiation. Check your API key.", "error");
        } finally {
            setIsTyping(false);
        }
    };

    const toggleListening = () => {
        if (isListening) {
            speechService.stopListening();
            setIsListening(false);
        } else {
            speechService.startListening(
                (text) => {
                    setInput(text);
                    setIsListening(false);
                },
                (err) => {
                    // DEBUG: console.error("Speech Error:", err);
                    setIsListening(false);
                }
            );
            setIsListening(true);
        }
    };

    const handleSend = async () => {
        if (!input.trim() || isTyping) return;
        
        const userMsg = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        
        setIsTyping(true);
        try {
            const result = await aiService.chat.sendMessage(userMsg);
            const text = await result.response.text();
            setMessages(prev => [...prev, { role: 'ai', text }]);
            
            // Speak AI response
            setIsAiSpeaking(true);
            speechService.speak(text, () => setIsAiSpeaking(false));
        } catch (error) {
            // DEBUG: console.error("Chat error:", error);
            showToast("Connection lost. Please check your API key and try again.", "error");
        } finally {
            setIsTyping(false);
        }
    };

    const handleFinish = async () => {
        setIsAnalyzing(true);
        setAnalysisError(false);
        try {
            const history = messages.map(m => `${m.role === 'ai' ? 'Recruiter' : 'Candidate'}: ${m.text}`).join('\n');
            const result = await aiService.analyzeNegotiation(history);
            setAnalysis(result);
            setGameState('feedback');

            // Save to stats for Dashboard
            const outcomes = JSON.parse(localStorage.getItem('nextoffer_ai_negotiation_outcomes') || '[]');
            outcomes.push({
                date: new Date().toISOString(),
                score: result.scores.tone,
                leverage: result.scores.leverage_usage
            });
            localStorage.setItem('nextoffer_ai_negotiation_outcomes', JSON.stringify(outcomes));
            showToast("Analysis complete!", "success");
        } catch (error) {
            // DEBUG: console.error("Analysis Error:", error);
            setAnalysisError(true);
            showToast("AI Analysis failed. You can still save your raw transcript.", "error");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleSaveFallback = () => {
        const vault = JSON.parse(localStorage.getItem('nextoffer_ai_vault') || '[]');
        const newItem = {
            id: Date.now(),
            type: 'Negotiation (Raw)',
            title: `Negotiation with ${offerData.company} (Transcript Only)`,
            content: `--- FULL TRANSCRIPT (Analysis Failed) ---\n${messages.map(m => `${m.role === 'ai' ? 'Recruiter' : 'You'}: ${m.text}`).join('\n')}`,
            date: new Date().toISOString()
        };
        localStorage.setItem('nextoffer_ai_vault', JSON.stringify([newItem, ...vault]));
        showToast('Transcript saved to Vault!', 'success');
        setGameState('setup');
    };

    return (
        <Layout>
            <div className="max-w-6xl mx-auto py-12 px-4">
                <AnimatePresence mode="wait">
                    {gameState === 'setup' && (
                        <motion.div
                            key="setup"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="max-w-2xl mx-auto"
                        >
                            <div className="text-center mb-12">
                                <div className="inline-flex items-center justify-center p-4 bg-emerald-100 dark:bg-emerald-900/30 rounded-3xl mb-6 text-emerald-600 dark:text-emerald-400 shadow-xl shadow-emerald-50 dark:shadow-none">
                                    <DollarSign size={40} />
                                </div>
                                <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">THE OFFER NEGOTIATOR</h1>
                                <p className="text-slate-500 dark:text-slate-400 text-lg font-medium leading-relaxed">
                                    Practice the most high-stakes conversation of your career. Roleplay with an AI recruiter to maximize your compensation.
                                </p>
                            </div>

                            <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden">
                                <div className="p-8 md:p-12 space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-2">
                                                <Building2 size={14} /> Company Name
                                            </label>
                                            <input 
                                                type="text" 
                                                placeholder="e.g. Google, Stripe..." 
                                                className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border-transparent focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-emerald-50 dark:focus:ring-emerald-900/20 focus:border-emerald-500 outline-none font-bold transition-all text-slate-900 dark:text-white"
                                                value={offerData.company}
                                                onChange={(e) => setOfferData({...offerData, company: e.target.value})}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-2">
                                                <Briefcase size={14} /> Job Title
                                            </label>
                                            <input 
                                                type="text" 
                                                placeholder="e.g. Senior Software Engineer" 
                                                className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border-transparent focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-emerald-50 dark:focus:ring-emerald-900/20 focus:border-emerald-500 outline-none font-bold transition-all text-slate-900 dark:text-white"
                                                value={offerData.role}
                                                onChange={(e) => setOfferData({...offerData, role: e.target.value})}
                                            />
                                        </div>
                                    </div>

                                    <div className="p-8 bg-slate-900 dark:bg-black rounded-[2rem] text-white">
                                        <h3 className="text-xs font-black uppercase tracking-widest text-emerald-400 mb-6 flex items-center gap-2">
                                            <TrendingUp size={16} /> Initial Offer Terms
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] uppercase font-bold text-slate-400">Base Salary ($)</label>
                                                <input 
                                                    type="number" 
                                                    placeholder="150000" 
                                                    className="w-full bg-white/10 border-transparent rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500 font-black text-xl"
                                                    value={offerData.base}
                                                    onChange={(e) => setOfferData({...offerData, base: e.target.value})}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] uppercase font-bold text-slate-400">Equity/RSUs</label>
                                                <input 
                                                    type="text" 
                                                    placeholder="200k / 4yrs" 
                                                    className="w-full bg-white/10 border-transparent rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500 font-black text-xl"
                                                    value={offerData.equity}
                                                    onChange={(e) => setOfferData({...offerData, equity: e.target.value})}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] uppercase font-bold text-slate-400">Sign-on ($)</label>
                                                <input 
                                                    type="number" 
                                                    placeholder="25000" 
                                                    className="w-full bg-white/10 border-transparent rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500 font-black text-xl"
                                                    value={offerData.signon}
                                                    onChange={(e) => setOfferData({...offerData, signon: e.target.value})}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <Button 
                                        onClick={handleStart}
                                        className="w-full h-16 rounded-[1.5rem] bg-emerald-600 hover:bg-emerald-700 text-xl font-black shadow-xl shadow-emerald-100 flex items-center justify-center gap-4"
                                    >
                                        ENTER THE NEGOTIATION <ChevronRight size={24} />
                                    </Button>
                                    <p className="text-center text-slate-400 text-xs font-medium">
                                        Alex, your Hiring Manager, is ready to discuss these terms with you.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {gameState === 'chatting' && (
                        <motion.div
                            key="chatting"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="max-w-4xl mx-auto h-[80vh] flex flex-col group"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-900 dark:bg-white flex items-center justify-center text-white dark:text-slate-900 shadow-lg">
                                        <Building2 size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-tight">{offerData.company} • Hiring Discussion</h3>
                                        <p className="text-xs text-emerald-600 font-bold flex items-center gap-1.5 ring-1 ring-emerald-100 px-2 py-0.5 rounded-full w-fit">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" /> Live Negotiation
                                        </p>
                                    </div>
                                </div>
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={handleFinish} 
                                    disabled={isAnalyzing || messages.length === 0}
                                    className="border-red-200 text-red-600 hover:bg-red-50 font-bold px-6 shadow-sm disabled:opacity-50"
                                >
                                    {isAnalyzing ? "Analysing..." : "End Session & Review"}
                                </Button>
                            </div>

                            <div className="flex-1 bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden flex flex-col">
                                <div className="flex-1 p-8 overflow-y-auto space-y-8 bg-slate-50/50 dark:bg-slate-900/50">
                                    {messages.map((m, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: m.role === 'ai' ? -10 : 10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className={cn(
                                                "max-w-[80%] flex items-start gap-4",
                                                m.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                                            )}
                                        >
                                            <div className={cn(
                                                "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-black",
                                                m.role === 'ai' ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900" : "bg-emerald-600 text-white"
                                            )}>
                                                {m.role === 'ai' ? 'HM' : 'YOU'}
                                            </div>
                                            <div className={cn(
                                                "px-6 py-4 rounded-[1.5rem] shadow-sm text-lg leading-relaxed font-medium",
                                                m.role === 'ai' 
                                                    ? "bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-600 rounded-tl-none" 
                                                    : "bg-emerald-600 text-white rounded-tr-none"
                                            )}>
                                                {m.text}
                                            </div>
                                        </motion.div>
                                    ))}
                                    {isTyping && (
                                        <div className="flex items-center gap-3 text-slate-400 italic text-sm px-14">
                                            <RefreshCw size={16} className="animate-spin" /> Alex is thinking...
                                        </div>
                                    )}
                                    {isAnalyzing && (
                                        <div className="flex flex-col items-center justify-center p-12 bg-white/50 dark:bg-slate-800/50 rounded-[2rem] border-2 border-dashed border-emerald-200 dark:border-emerald-800 animate-pulse">
                                            <Sparkles className="text-emerald-500 mb-4" size={40} />
                                            <p className="font-black text-slate-900 dark:text-white uppercase tracking-widest">Generating Your Report...</p>
                                            <p className="text-xs text-slate-400 font-bold mt-2">Alex is reviewing your leverage and tone.</p>
                                        </div>
                                    )}
                                    {analysisError && (
                                        <div className="flex flex-col items-center justify-center p-8 bg-red-50 dark:bg-red-900/10 rounded-[2rem] border border-red-100 dark:border-red-900/30 text-center">
                                            <AlertCircle className="text-red-500 mb-4" size={40} />
                                            <h4 className="font-black text-red-900 dark:text-red-400 uppercase tracking-widest mb-2">Analysis Failed</h4>
                                            <p className="text-sm text-red-600 dark:text-red-300 font-bold mb-6 max-w-sm">We couldn't generate the AI report, likely due to an API key issue. Save your transcript below to keep your work.</p>
                                            <div className="flex gap-4">
                                                <Button onClick={handleSaveFallback} className="bg-slate-900 hover:bg-black text-white px-8 font-black">
                                                    SAVE TRANSCRIPT & QUIT
                                                </Button>
                                                <Button variant="outline" onClick={handleFinish} className="border-red-200 text-red-600 hover:bg-red-50">
                                                    RETRY
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                    <div ref={chatEndRef} />
                                </div>

                                <div className="p-6 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700">
                                    <div className="flex gap-4 items-center">
                                        <div className="flex-1 relative">
                                            <input 
                                                type="text" 
                                                value={input}
                                                onChange={(e) => setInput(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                                disabled={isTyping}
                                                placeholder="Write your response... (e.g. 'I'm excited, but I was hoping for more base salary...')"
                                                className="w-full px-8 py-4 pr-16 rounded-2xl bg-slate-50 dark:bg-slate-900 border-transparent focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-emerald-50 dark:focus:ring-emerald-900/20 focus:border-emerald-500 outline-none font-medium transition-all text-slate-900 dark:text-white"
                                            />
                                            <button 
                                                onClick={toggleListening}
                                                className={cn(
                                                    "absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all",
                                                    isListening ? "bg-red-500 text-white animate-pulse" : "text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
                                                )}
                                            >
                                                <Mic size={20} />
                                            </button>
                                        </div>
                                        <button 
                                            onClick={handleSend}
                                            disabled={isTyping || !input.trim()}
                                            className="w-16 h-16 rounded-2xl bg-emerald-600 text-white flex items-center justify-center hover:bg-emerald-700 disabled:opacity-50 disabled:grayscale transition-all shadow-lg shadow-emerald-100"
                                        >
                                            <Send size={24} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {gameState === 'feedback' && analysis && (
                        <motion.div
                            key="feedback"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="max-w-4xl mx-auto space-y-8"
                        >
                            <div className="flex justify-between items-center">
                                <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">NEGOTIATION REPORT</h2>
                                <div className="flex gap-4">
                                    <Tooltip content="Save to Vault" position="left">
                                        <Button 
                                            variant="outline"
                                            onClick={() => {
                                                const vault = JSON.parse(localStorage.getItem('nextoffer_ai_vault') || '[]');
                                                const chatHistory = messages.join('\n');
                                                const newItem = {
                                                    id: Date.now(),
                                                    type: 'Negotiation',
                                                    title: `Negotiation with ${offerData.company}`,
                                                    content: `Outcome: ${analysis.outcome}\n\nFinal Terms: ${analysis.final_terms}\n\nFeedback: ${analysis.feedback}\n\n--- FULL TRANSCRIPT ---\n${messages.map(m => `${m.role === 'ai' ? 'Recruiter' : 'You'}: ${m.text}`).join('\n')}`,
                                                    date: new Date().toISOString()
                                                };
                                                localStorage.setItem('nextoffer_ai_vault', JSON.stringify([newItem, ...vault]));
                                                showToast('Saved to Vault!', 'success');
                                            }} 
                                            className="font-bold border-amber-200 text-amber-600 hover:bg-amber-50"
                                        >
                                            <Bookmark size={18} className="mr-2" /> Save to Vault
                                        </Button>
                                    </Tooltip>
                                    <Button variant="secondary" onClick={() => setGameState('setup')} className="font-bold">
                                        Practice Again
                                    </Button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <ScoreCard label="Outcome" val={analysis.outcome} color="emerald" icon={<Award size={20}/>} />
                                <ScoreCard label="Negotiation Tone" val={`${analysis.scores.tone}/10`} color="blue" icon={<MessageSquare size={20}/>} />
                                <ScoreCard label="Leverage Usage" val={`${analysis.scores.leverage_usage}/10`} color="amber" icon={<Zap size={20}/>} />
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <Card className="border-slate-900 bg-slate-900 dark:bg-black text-white p-8 rounded-[2.5rem] shadow-2xl">
                                    <h3 className="text-emerald-400 font-black uppercase text-xs tracking-widest mb-6 flex items-center gap-2">
                                        <Sparkles size={18} /> Final Terms Summary
                                    </h3>
                                    <div className="text-xl font-bold leading-relaxed opacity-90 italic">
                                        "{analysis.final_terms}"
                                    </div>
                                </Card>

                                <Card className="p-8 rounded-[2.5rem] border-slate-200 dark:border-slate-700 dark:bg-slate-800">
                                    <h3 className="text-slate-400 dark:text-slate-500 font-black uppercase text-[10px] tracking-widest mb-6 flex items-center gap-2">
                                        <ShieldCheck size={18} className="text-emerald-600 dark:text-emerald-400" /> Professional Feedback
                                    </h3>
                                    <p className="text-slate-700 dark:text-slate-300 font-medium leading-[1.8]">
                                        {analysis.feedback}
                                    </p>
                                </Card>
                            </div>

                            <Card className="bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800 p-8 rounded-[2.5rem]">
                                <h3 className="text-emerald-800 dark:text-emerald-300 font-black uppercase text-xs tracking-widest mb-6">Expert Negotiation Tips for You</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {analysis.negotiation_tips.map((tip, i) => (
                                        <div key={i} className="flex items-start gap-3 bg-white/50 dark:bg-slate-800/50 p-4 rounded-2xl border border-emerald-100/50 dark:border-emerald-800/50">
                                            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 font-bold">
                                                {i + 1}
                                            </div>
                                            <p className="text-emerald-900 dark:text-emerald-100 font-bold text-sm leading-relaxed">{tip}</p>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </Layout>
    );
};

const ScoreCard = ({ label, val, color, icon }) => {
    const colors = {
        emerald: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
        blue: "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
        amber: "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    };
    return (
        <Card className={cn("p-6 text-center space-y-2 border-b-8 shadow-sm", colors[color])}>
            <div className="flex items-center justify-center gap-2 font-black uppercase text-[10px] tracking-widest mb-2 opacity-60">
                {icon} {label}
            </div>
            <div className="text-2xl font-black">{val}</div>
        </Card>
    );
};
