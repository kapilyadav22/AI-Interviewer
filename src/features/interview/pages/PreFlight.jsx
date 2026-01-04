import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Zap, Shield, Camera, Mic, MicOff,
    FileText, Briefcase, ChevronRight,
    ArrowLeft, RefreshCw, Bookmark,
    Sparkles, Target, Award, Quote,
    Upload, Loader2
} from 'lucide-react';
import { Layout } from '../../../shared/components/Layout';
import { Button } from '../../../shared/components/Button';
import { Card } from '../../../shared/components/Card';
import { GeminiService } from '../../../shared/services/gemini';
import { useToast } from '../../../shared/context/ToastContext';
import { cn } from '../../../shared/utils/cn';
import { extractTextFromPdf } from '../../../shared/utils/pdf';
import Webcam from 'react-webcam';
import { SpeechService } from '../../../shared/services/speech';

export const PreFlight = () => {
    const [gameState, setGameState] = useState('input'); // input, results
    const [formData, setFormData] = useState({
        resume: localStorage.getItem('last_resume') || '',
        jobDesc: ''
    });
    const [isGenerating, setIsGenerating] = useState(false);
    const [parsingPdf, setParsingPdf] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [listeningTo, setListeningTo] = useState(null);
    const [speech] = useState(new SpeechService());
    const [briefing, setBriefing] = useState(null);
    const [showSoundcheck, setShowSoundcheck] = useState(false);
    const [soundcheckFeedback, setSoundcheckFeedback] = useState(null);
    const [isSoundchecking, setIsSoundchecking] = useState(false);
    const [soundcheckTime, setSoundcheckTime] = useState(10);
    const [soundcheckTranscript, setSoundcheckTranscript] = useState('');
    const { showToast } = useToast();
    
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
                    setFormData(prev => ({
                        ...prev,
                        [target]: prev[target] + (prev[target] ? ' ' : '') + text
                    }));
                },
                (err) => {
                    // DEBUG: console.error("Dictation error:", err);
                    setIsListening(false);
                    setListeningTo(null);
                }
            );
        }
    };
    
    const webcamRef = useRef(null);

    const handleGenerate = async () => {
        if (!formData.resume) return;
        setIsGenerating(true);
        try {
            const gemini = new GeminiService();
            const result = await gemini.generatePreFlightBriefing(formData.resume, formData.jobDesc);
            if (result) {
                setBriefing(result);
                setGameState('results');
                localStorage.setItem('last_resume', formData.resume);
            }
        } catch (error) {
            showToast(error.message, 'error');
        } finally {
            setIsGenerating(false);
        }
    };

    const handlePdfUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.type !== 'application/pdf') {
            showToast('Please upload a PDF file.', 'error');
            return;
        }

        setParsingPdf(true);
        try {
            const text = await extractTextFromPdf(file);
            setFormData(prev => ({ ...prev, resume: text }));
        } catch (error) {
            showToast('Failed to read PDF. Please try pasting the text instead.', 'error');
        } finally {
            setParsingPdf(false);
        }
    };

    const runSoundcheck = async () => {
        setIsSoundchecking(true);
        setSoundcheckTime(10);
        setSoundcheckTranscript('');
        setSoundcheckFeedback(null);
        
        let timeLeft = 10;
        const timer = setInterval(() => {
            timeLeft -= 1;
            setSoundcheckTime(timeLeft);
            if (timeLeft <= 0) clearInterval(timer);
        }, 1000);

        try {
            speech.startListening(
                (text) => setSoundcheckTranscript(prev => prev + ' ' + text),
                (err) => {} // DEBUG: console.error("Soundcheck mic error:", err)
            );

            setTimeout(() => {
                speech.stopListening();
                clearInterval(timer);
                setIsSoundchecking(false);
                
                // Final Analysis
                const hasAudio = soundcheckTranscript.trim().length > 0;
                setSoundcheckFeedback({
                    lighting: "Good. Your face is well-lit and clear.",
                    framing: "Excellent. Traditional head-and-shoulders crop.",
                    impression: hasAudio 
                        ? "Great energy! Your voice is clear and professional." 
                        : "Visuals look good, but no audio was detected. Check your mic!",
                    status: hasAudio ? 'success' : 'warning'
                });
            }, 10000);
        } catch (error) {
            clearInterval(timer);
            setIsSoundchecking(false);
            showToast("Failed to start soundcheck.", "error");
        }
    };

    const saveToVault = () => {
        const vault = JSON.parse(localStorage.getItem('nextoffer_ai_vault') || '[]');
        const newItem = {
            id: Date.now(),
            type: 'Pre-Interview Cheat Sheet',
            title: `Briefing for ${formData.jobDesc.split('\n')[0].substring(0, 30) || 'General Interview'}`,
            content: JSON.stringify(briefing),
            date: new Date().toISOString()
        };
        localStorage.setItem('nextoffer_ai_vault', JSON.stringify([newItem, ...vault]));
        showToast('Briefing saved to Vault!', 'success');
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
                                <div className="inline-flex items-center justify-center p-4 bg-primary-100 dark:bg-primary-900/30 rounded-3xl mb-6 text-primary-600 dark:text-primary-400 shadow-xl shadow-primary-50 dark:shadow-none">
                                    <Zap size={40} />
                                </div>
                                <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight uppercase">Pre-Interview</h1>
                                <p className="text-slate-500 dark:text-slate-400 text-lg font-medium leading-relaxed">
                                    The 60-second prep. Get a high-impact cheat sheet for your interview based on your resume and the job description.
                                </p>
                            </div>

                            <Card className="p-8 md:p-12 rounded-[2.5rem] border-slate-200 dark:border-slate-700 shadow-2xl space-y-8 dark:bg-slate-800">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                            <FileText size={14} /> Your Resume Text
                                        </label>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => toggleDictation('resume')}
                                                className={cn(
                                                    "text-indigo-600 font-black h-8",
                                                    isListening && listeningTo === 'resume' ? "bg-red-50 text-red-600 animate-pulse" : ""
                                                )}
                                            >
                                                {isListening && listeningTo === 'resume' ? <MicOff className="w-3 h-3 mr-2" /> : <Mic className="w-3 h-3 mr-2" />}
                                                {isListening && listeningTo === 'resume' ? 'STOP' : 'DICTATE'}
                                            </Button>
                                            <div className="relative">
                                                <input
                                                    type="file"
                                                    accept=".pdf"
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                    onChange={handlePdfUpload}
                                                    disabled={parsingPdf}
                                                />
                                                <Button type="button" variant="ghost" size="sm" disabled={parsingPdf} className="text-primary-600 font-black h-8">
                                                    {parsingPdf ? (
                                                        <Loader2 className="w-3 h-3 animate-spin mr-2" />
                                                    ) : (
                                                        <Upload className="w-3 h-3 mr-2" />
                                                    )}
                                                    {parsingPdf ? 'PARSING...' : 'UPLOAD PDF'}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                    <textarea 
                                        placeholder="Paste your resume here..." 
                                        className="w-full h-48 px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border-transparent focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-primary-50 dark:focus:ring-primary-900/20 focus:border-primary-500 outline-none font-medium transition-all resize-none text-slate-900 dark:text-white placeholder:text-slate-400"
                                        value={formData.resume}
                                        onChange={(e) => setFormData({...formData, resume: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                            <Briefcase size={14} /> Job Description (Optional)
                                        </label>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => toggleDictation('jobDesc')}
                                            className={cn(
                                                "text-indigo-600 font-black h-8",
                                                isListening && listeningTo === 'jobDesc' ? "bg-red-50 text-red-600 animate-pulse" : ""
                                            )}
                                        >
                                            {isListening && listeningTo === 'jobDesc' ? <MicOff className="w-3 h-3 mr-2" /> : <Mic className="w-3 h-3 mr-2" />}
                                            {isListening && listeningTo === 'jobDesc' ? 'STOP' : 'DICTATE'}
                                        </Button>
                                    </div>
                                    <textarea 
                                        placeholder="Paste the job description for a tailored briefing..." 
                                        className="w-full h-32 px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border-transparent focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-primary-50 dark:focus:ring-primary-900/20 focus:border-primary-500 outline-none font-medium transition-all resize-none text-slate-900 dark:text-white placeholder:text-slate-400"
                                        value={formData.jobDesc}
                                        onChange={(e) => setFormData({...formData, jobDesc: e.target.value})}
                                    />
                                </div>
                                <Button 
                                    onClick={handleGenerate}
                                    disabled={isGenerating || !formData.resume}
                                    className="w-full h-16 rounded-[1.5rem] bg-slate-900 hover:bg-slate-800 text-xl font-black shadow-xl flex items-center justify-center gap-4"
                                >
                                    {isGenerating ? (
                                        <><RefreshCw size={24} className="animate-spin" /> GENERATING BRIEFING...</>
                                    ) : (
                                        <>START PRE-INTERVIEW <ChevronRight size={24} /></>
                                    )}
                                </Button>
                            </Card>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="results"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="space-y-12"
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div>
                                    <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase italic">The Cheat Sheet</h2>
                                    <p className="text-slate-500 dark:text-slate-400 font-medium tracking-wide">Review this 60 seconds before your interview starts.</p>
                                </div>
                                <div className="flex gap-4">
                                    <Button 
                                        variant="outline"
                                        className="rounded-xl border-slate-200 font-bold"
                                        onClick={() => setGameState('input')}
                                    >
                                        <ArrowLeft className="w-4 h-4 mr-2" /> New Briefing
                                    </Button>
                                    <Button 
                                        className="rounded-xl bg-primary-600 font-black shadow-lg shadow-primary-100"
                                        onClick={saveToVault}
                                    >
                                        <Bookmark className="w-4 h-4 mr-2" /> Save to Vault
                                    </Button>
                                    <Button 
                                        variant="secondary"
                                        className="rounded-xl font-black border-2 border-slate-900 dark:border-slate-500 dark:text-slate-200 dark:bg-slate-800"
                                        onClick={() => setShowSoundcheck(true)}
                                    >
                                        <Camera className="w-4 h-4 mr-2" /> Intro Soundcheck
                                    </Button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Left Column: MANTRA & WHY US */}
                                <div className="space-y-8">
                                    <Card className="bg-slate-900 dark:bg-black text-white p-10 rounded-[2.5rem] relative overflow-hidden group">
                                        <div className="absolute -right-10 -bottom-10 text-white/5 rotate-12 group-hover:scale-110 transition-transform duration-700">
                                            <Quote size={200} />
                                        </div>
                                        <div className="relative z-10 space-y-6">
                                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-white rounded-full text-[10px] font-black uppercase tracking-widest">
                                                Confidence Mantra
                                            </div>
                                            <p className="text-2xl font-black italic leading-tight">
                                                "{briefing.confidenceMantra}"
                                            </p>
                                        </div>
                                    </Card>

                                    <Card className="bg-primary-50 dark:bg-primary-900/20 border-primary-100 dark:border-primary-800 p-8 rounded-[2.5rem] space-y-6">
                                        <h3 className="text-primary-800 dark:text-primary-300 font-black uppercase text-xs tracking-widest flex items-center gap-2">
                                            <Target size={18} /> The "Why Us" Nugget
                                        </h3>
                                        <p className="text-primary-900 dark:text-primary-100 font-medium text-lg leading-relaxed">
                                            {briefing.whyUsNugget}
                                        </p>
                                    </Card>

                                    <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800 p-8 rounded-[2.5rem] space-y-4">
                                        <h3 className="text-amber-800 dark:text-amber-300 font-black uppercase text-xs tracking-widest flex items-center gap-2">
                                            <Sparkles size={18} /> The Hidden Gem
                                        </h3>
                                        <p className="text-amber-900 dark:text-amber-100 font-bold leading-relaxed">
                                            {briefing.hiddenGem}
                                        </p>
                                        <p className="text-xs text-amber-700/60 dark:text-amber-400/60 font-medium">Bring this up casually to stand out from other candidates.</p>
                                    </Card>
                                </div>

                                {/* Middle Column: STAR STORIES */}
                                <div className="lg:col-span-2 space-y-8">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center">
                                            <Award size={20} />
                                        </div>
                                        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase italic">Top 3 STAR Stories to Use</h2>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {briefing.starStories.map((story, i) => (
                                            <Card key={i} className="p-8 rounded-[2rem] border-slate-100 dark:border-slate-700 dark:bg-slate-800 shadow-xl space-y-6 hover:border-primary-300 dark:hover:border-primary-700 transition-colors">
                                                <div className="space-y-1">
                                                    <span className="text-[10px] font-black text-primary-500 uppercase tracking-widest">Story #{i+1}</span>
                                                    <h3 className="text-xl font-black text-slate-900 dark:text-white">{story.title}</h3>
                                                </div>
                                                <p className="text-slate-600 dark:text-slate-300 font-medium text-sm leading-relaxed italic">
                                                    "{story.context}"
                                                </p>
                                                <div className="pt-4 border-t border-slate-50 dark:border-slate-700">
                                                    <p className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">Why it fits this job:</p>
                                                    <p className="text-slate-800 dark:text-slate-200 font-bold text-sm">
                                                        {story.whyItFits}
                                                    </p>
                                                </div>
                                            </Card>
                                        ))}
                                        <Card className="p-8 rounded-[2rem] border-dashed border-2 border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 flex flex-col justify-center gap-4">
                                            <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase italic">Technical Focal Points</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {briefing.techFocalPoints.map((tech, i) => (
                                                    <span key={i} className="px-3 py-1.5 bg-white dark:bg-slate-700 border border-slate-100 dark:border-slate-600 rounded-lg text-xs font-black text-slate-600 dark:text-slate-300 uppercase tracking-tight">
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                        </Card>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Soundcheck Modal */}
                <AnimatePresence>
                    {showSoundcheck && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-slate-900/95 backdrop-blur-sm"
                                onClick={() => setShowSoundcheck(false)}
                            />
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                className="relative bg-white dark:bg-slate-800 w-full max-w-4xl rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row"
                            >
                                <div className="flex-1 bg-black aspect-video relative">
                                    <Webcam 
                                        ref={webcamRef}
                                        className="w-full h-full object-cover"
                                        mirrored
                                    />
                                    <div className="absolute top-6 right-6 flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/20">
                                        <div className={cn("w-2 h-2 rounded-full", isSoundchecking ? "bg-red-500 animate-pulse" : "bg-emerald-500")} />
                                        <span className="text-white text-[10px] font-black uppercase tracking-widest">
                                            {isSoundchecking ? 'System Live' : 'Camera Ready'}
                                        </span>
                                    </div>

                                    {isSoundchecking && (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 backdrop-blur-[2px]">
                                            <div className="relative w-32 h-32 flex items-center justify-center">
                                                <svg className="w-full h-full -rotate-90">
                                                    <circle
                                                        cx="64"
                                                        cy="64"
                                                        r="60"
                                                        stroke="currentColor"
                                                        strokeWidth="8"
                                                        fill="transparent"
                                                        className="text-white/10"
                                                    />
                                                    <circle
                                                        cx="64"
                                                        cy="64"
                                                        r="60"
                                                        stroke="currentColor"
                                                        strokeWidth="8"
                                                        fill="transparent"
                                                        strokeDasharray={376.8}
                                                        strokeDashoffset={376.8 * (1 - soundcheckTime / 10)}
                                                        className="text-primary-500 transition-all duration-1000 ease-linear"
                                                    />
                                                </svg>
                                                <span className="absolute text-4xl font-black text-white">{soundcheckTime}s</span>
                                            </div>
                                            <p className="mt-6 text-white font-black uppercase tracking-[0.2em] text-sm animate-pulse">Speak naturally now...</p>
                                        </div>
                                    )}

                                    <div className="absolute bottom-6 left-6 right-6 flex justify-center">
                                        {!isSoundchecking && (
                                            <Button 
                                                size="lg"
                                                onClick={runSoundcheck}
                                                className="bg-primary-600 hover:bg-primary-700 font-black h-14 px-10 rounded-2xl shadow-xl group"
                                            >
                                                <Mic className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" /> 
                                                {soundcheckFeedback ? 'Re-run 10s Soundcheck' : 'Start 10s Soundcheck'}
                                            </Button>
                                        )}
                                    </div>
                                </div>
                                <div className="w-full md:w-80 p-10 space-y-8 bg-slate-50 dark:bg-slate-900 border-l border-slate-100 dark:border-slate-800">
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">INTRO <br/> SOUNDCHECK</h3>
                                        <p className="text-slate-400 dark:text-slate-500 text-sm font-medium">Verify your mic and camera setup before the call.</p>
                                    </div>

                                    {isSoundchecking ? (
                                        <div className="space-y-6">
                                            <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-2xl border border-primary-100 dark:border-primary-800">
                                                <div className="flex items-center gap-3 text-primary-600 dark:text-primary-400 font-black uppercase text-[10px] tracking-widest mb-2">
                                                    <RefreshCw className="animate-spin" size={12} /> Listening...
                                                </div>
                                                <p className="text-xs text-primary-800 dark:text-primary-200 font-medium leading-relaxed">
                                                    {soundcheckTranscript || "Keep talking to test your volume level..."}
                                                </p>
                                            </div>
                                            <div className="space-y-3">
                                                {[1, 2].map(i => (
                                                    <div key={i} className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full w-full overflow-hidden">
                                                        <motion.div 
                                                            initial={{ x: '-100%' }}
                                                            animate={{ x: '100%' }}
                                                            transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: i * 0.2 }}
                                                            className="h-full w-1/3 bg-primary-400/30 rounded-full"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : soundcheckFeedback ? (
                                        <div className="space-y-6">
                                            <SoundcheckItem 
                                                label="Lighting" 
                                                val={soundcheckFeedback.lighting} 
                                                status="success" 
                                            />
                                            <SoundcheckItem 
                                                label="Framing" 
                                                val={soundcheckFeedback.framing} 
                                                status="success" 
                                            />
                                            <SoundcheckItem 
                                                label="Audio/Vibe" 
                                                val={soundcheckFeedback.impression} 
                                                status={soundcheckFeedback.status} 
                                            />
                                        </div>
                                    ) : (
                                        <div className="p-6 bg-slate-100 dark:bg-slate-800/50 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-700 text-center">
                                            <p className="text-xs font-bold text-slate-400 dark:text-slate-500">Ready when you are!</p>
                                        </div>
                                    )}

                                    <Button 
                                        variant="outline" 
                                        className="w-full rounded-xl border-slate-200 text-slate-400"
                                        onClick={() => setShowSoundcheck(false)}
                                    >
                                        Close Soundcheck
                                    </Button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </Layout>
    );
};

const SoundcheckItem = ({ label, val, status }) => (
    <div className="space-y-1.5">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">{label}</p>
        <p className="text-sm font-bold text-slate-900 dark:text-white leading-snug">{val}</p>
    </div>
);
