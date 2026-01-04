import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Send, Users, Building2, Briefcase, 
    Copy, Check, Sparkles, MessageCircle,
    Mail, ArrowLeft, RefreshCw, ChevronRight,
    Search, Target, FileText, Bookmark, Zap,
    Mic, MicOff, Volume2, VolumeX
} from 'lucide-react';
import { Layout } from '../../../shared/components/Layout';
import { Button } from '../../../shared/components/Button';
import { Card } from '../../../shared/components/Card';
import { GeminiService } from '../../../shared/services/gemini';
import { SpeechService } from '../../../shared/services/speech';
import { useToast } from '../../../shared/context/ToastContext';
import { cn } from '../../../shared/utils/cn';
import { Tooltip } from '../../../shared/components/Tooltip';

export const ReferralEngine = () => {
    const [gameState, setGameState] = useState('input'); // input, templates
    const [formData, setFormData] = useState({
        role: '',
        company: '',
        targetType: 'Recruiter',
        resumeSummary: '',
        context: 'Direct Job Application'
    });
    const [isGenerating, setIsGenerating] = useState(false);
    const [templates, setTemplates] = useState([]);
    const [copiedId, setCopiedId] = useState(null);
    const [isListening, setIsListening] = useState(false);
    const [speakingId, setSpeakingId] = useState(null);
    const speechServiceRef = useRef(null);
    const { showToast } = useToast();

    useEffect(() => {
        speechServiceRef.current = new SpeechService();
        return () => {
            speechServiceRef.current?.cancelSpeech();
            speechServiceRef.current?.stopListening();
        };
    }, []);

    const toggleListening = () => {
        if (isListening) {
            speechServiceRef.current.stopListening();
            setIsListening(false);
        } else {
            setIsListening(true);
            speechServiceRef.current.startListening(
                (text) => {
                    setFormData(prev => ({
                        ...prev,
                        resumeSummary: prev.resumeSummary ? `${prev.resumeSummary} ${text}` : text
                    }));
                    setIsListening(false);
                    showToast("Voice captured!", "success");
                },
                (error) => {
                    // DEBUG: console.error("Speech error:", error);
                    setIsListening(false);
                    showToast("Failed to listen. Please try again.", "error");
                }
            );
        }
    };

    const toggleSpeech = (text, id) => {
        if (speakingId === id) {
            speechServiceRef.current.cancelSpeech();
            setSpeakingId(null);
        } else {
            setSpeakingId(id);
            speechServiceRef.current.speak(text, () => setSpeakingId(null));
        }
    };

    const handleGenerate = async () => {
        if (!formData.role || !formData.company || !formData.resumeSummary) {
            showToast("Please fill in all required fields.", "error");
            return;
        }
        
        setIsGenerating(true);
        try {
            const gemini = new GeminiService();
            const result = await gemini.generateReferralDrafts(formData); // Keeping original service call as it aligns with 'templates' state
            
            if (result && result.templates) {
                setTemplates(result.templates);
                setGameState('templates');
                showToast("Referral templates generated!", "success");
            } else {
                showToast("Failed to generate templates. Please try again.", "error");
            }
        } catch (error) {
            // DEBUG: console.error("Error generating referral templates:", error);
            showToast(error.message || "An unexpected error occurred.", "error");
        } finally {
            setIsGenerating(false);
        }
    };

    const copyToClipboard = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
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
                            className="max-w-3xl mx-auto"
                        >
                            <div className="text-center mb-12">
                                <div className="inline-flex items-center justify-center p-4 bg-emerald-100 rounded-3xl mb-6 text-emerald-600 shadow-xl shadow-emerald-50">
                                    <Users size={40} />
                                </div>
                                <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight uppercase">Referral Engine</h1>
                                <p className="text-slate-500 dark:text-slate-400 text-lg font-medium leading-relaxed">
                                    Turn your readiness into an interview. Generate high-conversion outreach messages for LinkedIn, Email, and referrals.
                                </p>
                            </div>

                            <Card className="p-8 md:p-12 rounded-[2.5rem] border-slate-200 dark:border-slate-800 shadow-2xl space-y-10 dark:bg-slate-800">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-2">
                                            <Briefcase size={14} /> target role
                                        </label>
                                        <input 
                                            type="text" 
                                            placeholder="e.g. Senior Backend Engineer" 
                                            className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border-transparent focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-emerald-50 dark:focus:ring-emerald-900/30 focus:border-emerald-500 outline-none font-bold transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                            value={formData.role}
                                            onChange={(e) => setFormData({...formData, role: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-2">
                                            <Building2 size={14} /> company
                                        </label>
                                        <input 
                                            type="text" 
                                            placeholder="e.g. OpenAI, Stripe..." 
                                            className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border-transparent focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-emerald-50 dark:focus:ring-emerald-900/30 focus:border-emerald-500 outline-none font-bold transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                            value={formData.company}
                                            onChange={(e) => setFormData({...formData, company: e.target.value})}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-2">
                                        <Target size={14} /> who are you messaging?
                                    </label>
                                    <div className="grid grid-cols-3 gap-4">
                                        {['Recruiter', 'Hiring Manager', 'Company Alumni'].map((type) => (
                                            <button
                                                key={type}
                                                onClick={() => setFormData({...formData, targetType: type})}
                                                className={cn(
                                                    "py-3 rounded-xl border-2 font-black text-xs uppercase tracking-tight transition-all",
                                                    formData.targetType === type 
                                                        ? "bg-slate-900 dark:bg-emerald-600 border-slate-900 dark:border-emerald-600 text-white shadow-lg" 
                                                        : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:border-slate-200 dark:hover:border-slate-600"
                                                )}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-2">
                                            <FileText size={14} /> your key achievements (for AI tailoring)
                                        </label>
                                        <button
                                            onClick={toggleListening}
                                            className={cn(
                                                "flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
                                                isListening 
                                                    ? "bg-red-500 text-white animate-pulse" 
                                                    : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400"
                                            )}
                                        >
                                            {isListening ? <MicOff size={12} /> : <Mic size={12} />}
                                            {isListening ? "Listening..." : "Dictate"}
                                        </button>
                                    </div>
                                    <textarea 
                                        placeholder="e.g. 5+ years React exp, led migration to microservices, improved performance by 40%..." 
                                        className="w-full h-40 px-8 py-6 rounded-[2rem] bg-slate-50 dark:bg-slate-900 border-transparent focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-emerald-50 dark:focus:ring-emerald-900/30 focus:border-emerald-500 outline-none font-medium transition-all text-lg leading-relaxed resize-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                        value={formData.resumeSummary}
                                        onChange={(e) => setFormData({...formData, resumeSummary: e.target.value})}
                                    />
                                </div>

                                <Button 
                                    onClick={handleGenerate}
                                    disabled={isGenerating || !formData.role || !formData.company || !formData.resumeSummary}
                                    className="w-full h-16 rounded-[1.5rem] bg-emerald-600 hover:bg-emerald-700 text-xl font-black shadow-xl shadow-emerald-100 flex items-center justify-center gap-4"
                                >
                                    {isGenerating ? (
                                        <><RefreshCw size={24} className="animate-spin" /> CRAFTING TEMPLATES...</>
                                    ) : (
                                        <>GENERATE OUTREACH PACK <ChevronRight size={24} /></>
                                    )}
                                </Button>
                            </Card>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="templates"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="max-w-5xl mx-auto space-y-10"
                        >
                            <div className="flex items-center justify-between">
                                <button 
                                    onClick={() => setGameState('input')}
                                    className="flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors font-bold uppercase text-[10px] tracking-widest"
                                >
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Change Target
                                </button>
                                <div className="px-6 py-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full font-black text-xs uppercase tracking-widest">
                                    Target: {formData.company} • {formData.targetType}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {templates.map((tpl) => (
                                    <motion.div
                                        key={tpl.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex flex-col"
                                    >
                                        <Card className="flex-1 p-8 rounded-[2.5rem] border-slate-200 dark:border-slate-700 shadow-xl flex flex-col group hover:border-emerald-200 dark:hover:border-emerald-800 transition-colors dark:bg-slate-800">
                                            <div className="flex items-center justify-between mb-6">
                                                <div className="flex gap-2">
                                                    <Tooltip content={tpl.id === 1 ? "LinkedIn Format" : tpl.id === 2 ? "Email Format" : "Quick Ping"} position="top">
                                                        <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-300 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/20 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                                            {tpl.id === 1 ? <MessageCircle size={20} /> : tpl.id === 2 ? <Mail size={20} /> : <Zap size={20} />}
                                                        </div>
                                                    </Tooltip>

                                                    {tpl.id === 2 && (
                                                        <Tooltip content="Open in Gmail" position="top">
                                                            <button
                                                                onClick={() => {
                                                                    const subject = encodeURIComponent(`${formData.role} Role at ${formData.company}`);
                                                                    const body = encodeURIComponent(tpl.body);
                                                                    window.open(`https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=&su=${subject}&body=${body}`, '_blank');
                                                                }}
                                                                className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-700 text-slate-400 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 flex items-center justify-center transition-colors"
                                                            >
                                                                <Mail size={20} />
                                                            </button>
                                                        </Tooltip>
                                                    )}

                                                    <Tooltip content={speakingId === tpl.id ? "Stop Reading" : "Read Aloud"} position="top">
                                                        <button
                                                            onClick={() => toggleSpeech(tpl.body, tpl.id)}
                                                            className={cn(
                                                                "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                                                                speakingId === tpl.id 
                                                                    ? "bg-primary-500 text-white" 
                                                                    : "bg-slate-50 dark:bg-slate-700 text-slate-400 dark:text-slate-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600"
                                                            )}
                                                        >
                                                            {speakingId === tpl.id ? <VolumeX size={20} className="animate-pulse" /> : <Volume2 size={20} />}
                                                        </button>
                                                    </Tooltip>
                                                </div>
                                            </div>
                                            <h3 className="font-black text-slate-900 dark:text-white uppercase text-xs tracking-widest mb-4">{tpl.title}</h3>
                                            <div className="flex-1 bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl p-6 text-slate-600 dark:text-slate-300 font-medium text-sm leading-relaxed border border-slate-50 dark:border-slate-700/50">
                                                {tpl.body}
                                            </div>
                                            <div className="mt-6 flex gap-2">
                                                <Button 
                                                    variant="outline" 
                                                    size="sm" 
                                                    className="flex-1 rounded-xl border-emerald-100 text-emerald-600 hover:bg-emerald-50 font-bold"
                                                    onClick={() => copyToClipboard(tpl.body, tpl.id)}
                                                >
                                                    {copiedId === tpl.id ? "COPIED!" : "COPY"}
                                                </Button>
                                                <Tooltip content="Save to Vault" position="left">
                                                    <Button 
                                                        variant="ghost" 
                                                        size="sm" 
                                                        className="rounded-xl border border-slate-100 text-slate-400 hover:text-emerald-600 hover:border-emerald-200 transition-all px-3"
                                                        onClick={() => {
                                                            const vault = JSON.parse(localStorage.getItem('nextoffer_ai_vault') || '[]');
                                                            const newItem = {
                                                                id: Date.now() + tpl.id,
                                                                type: 'Referral',
                                                                title: `${tpl.title} for ${formData.company}`,
                                                                content: tpl.body,
                                                                date: new Date().toISOString()
                                                            };
                                                            localStorage.setItem('nextoffer_ai_vault', JSON.stringify([newItem, ...vault]));
                                                            showToast('Saved to Vault!', 'success');
                                                        }}
                                                    >
                                                        <Bookmark size={16} />
                                                    </Button>
                                                </Tooltip>
                                            </div>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white flex items-center justify-between shadow-2xl overflow-hidden relative">
                                <div className="absolute -right-20 -bottom-20 text-white/5 rotate-12">
                                    <Sparkles size={300} />
                                </div>
                                <div className="relative z-10 space-y-2">
                                    <h4 className="text-xl font-black uppercase tracking-tight">Need a custom spin?</h4>
                                    <p className="text-slate-400 font-medium">Request a specific tone or mention special common grounds.</p>
                                </div>
                                <Button 
                                    onClick={handleGenerate}
                                    className="relative z-10 bg-white text-slate-900 hover:bg-slate-100 font-black px-8 rounded-xl"
                                >
                                    RE-GENERATE PACK
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </Layout>
    );
};
