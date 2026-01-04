import React, { useState } from 'react';
import { Layout } from '../../../shared/components/Layout';
import { Card, CardHeader, CardBody } from '../../../shared/components/Card';
import { Button } from '../../../shared/components/Button';
import { Input } from '../../../shared/components/Input';
import { Loader2, Save, Upload, FileText, Briefcase, Mic, MicOff } from 'lucide-react';
import { GeminiService } from '../../../shared/services/gemini';
import { config } from '../../../config';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../../shared/context/ToastContext';
import { SpeechService } from '../../../shared/services/speech';
import { cn } from '../../../shared/utils/cn';

export const ResumeOptimizer = () => {
    const { showToast } = useToast();
    const [resumeText, setResumeText] = useState('');
    const [jobDesc, setJobDesc] = useState('');
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [listeningTo, setListeningTo] = useState(null);
    const [speech] = useState(new SpeechService());
    const navigate = useNavigate();

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
                    if (target === 'resume') {
                        setResumeText(prev => prev + (prev ? ' ' : '') + text);
                    } else {
                        setJobDesc(prev => prev + (prev ? ' ' : '') + text);
                    }
                },
                (err) => {
                    // DEBUG: console.error("Dictation error:", err);
                    setIsListening(false);
                    setListeningTo(null);
                }
            );
        }
    };

    const handleAnalyze = async () => {
        if (!resumeText) {
            showToast('Please provide resume text or upload a PDF.', "warning");
            return;
        }
        setLoading(true);
        try {
            const service = new GeminiService(config.geminiApiKey);
            const result = await service.optimizeResume(resumeText, jobDesc);
            setAnalysis(result);
        } catch (e) {
            // DEBUG: console.error('Resume optimization error:', e);
            const msg = e.message.toLowerCase();
            if (msg.includes('quota') || msg.includes('limit') || msg.includes('429')) {
                showToast('API quota exceeded. Please try again later.', "warning");
            } else {
                showToast('Analysis failed. Please check your data and try again.', "error");
            }
        } finally {
            setLoading(false);
        }
    };

    const handlePdfUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.type !== 'application/pdf') {
            showToast('Please upload a PDF file.', "warning");
            return;
        }
        // Reuse existing utility to extract text
        const { extractTextFromPdf } = await import('../../../shared/utils/pdf');
        try {
            const text = await extractTextFromPdf(file);
            setResumeText(text);
        } catch (err) {
            showToast('Failed to read PDF.', "error");
        }
    };

    return (
        <Layout>
            <div className="max-w-3xl mx-auto space-y-8">
                <Card>
                    <CardHeader>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Resume Optimizer</h2>
                        <p className="text-slate-600 dark:text-slate-300">Upload your resume and a job description to get a score, strengths, weaknesses, and concrete bullet‑point suggestions.</p>
                    </CardHeader>
                    <CardBody className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <FileText className="w-5 h-5 text-primary-500" />
                                <h3 className="font-medium text-slate-900 dark:text-white uppercase tracking-wider text-xs font-black">Resume</h3>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => toggleDictation('resume')}
                                    className={cn(
                                        "transition-all duration-300 rounded-xl font-bold border-indigo-200 text-indigo-600",
                                        isListening && listeningTo === 'resume' ? "bg-red-50 text-red-600 border-red-200 animate-pulse" : ""
                                    )}
                                >
                                    {isListening && listeningTo === 'resume' ? <MicOff className="w-4 h-4 mr-2" /> : <Mic className="w-4 h-4 mr-2" />}
                                    {isListening && listeningTo === 'resume' ? 'STOP' : 'DICTATE'}
                                </Button>
                                <input id="pdfUpload" type="file" accept=".pdf" className="hidden" onChange={handlePdfUpload} disabled={loading} />
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => document.getElementById('pdfUpload').click()} 
                                    disabled={loading}
                                    className="border-emerald-500 text-emerald-600 hover:bg-emerald-50 rounded-xl font-bold"
                                >
                                    {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Upload className="w-4 h-4 mr-2" />}
                                    UPLOAD PDF
                                </Button>
                            </div>
                        </div>
                        <textarea
                            className="w-full h-40 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all resize-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 font-medium"
                            placeholder="Paste your resume text here or upload a PDF..."
                            value={resumeText}
                            onChange={(e) => setResumeText(e.target.value)}
                        />

                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Briefcase className="w-5 h-5 text-primary-500" />
                                <h3 className="font-medium text-slate-900 dark:text-white uppercase tracking-wider text-xs font-black">Job Description (optional)</h3>
                            </div>
                            <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                onClick={() => toggleDictation('jobDesc')}
                                className={cn(
                                    "transition-all duration-300 rounded-xl font-bold border-indigo-200 text-indigo-600",
                                    isListening && listeningTo === 'jobDesc' ? "bg-red-50 text-red-600 border-red-200 animate-pulse" : ""
                                )}
                            >
                                {isListening && listeningTo === 'jobDesc' ? <MicOff className="w-4 h-4 mr-2" /> : <Mic className="w-4 h-4 mr-2" />}
                                {isListening && listeningTo === 'jobDesc' ? 'STOP' : 'DICTATE'}
                            </Button>
                        </div>
                        <textarea
                            className="w-full h-24 px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all resize-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                            placeholder="Paste the job description you are targeting..."
                            value={jobDesc}
                            onChange={(e) => setJobDesc(e.target.value)}
                        />

                        <Button onClick={handleAnalyze} disabled={loading} className="w-full">
                            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-2 mr-2" />}
                            {loading ? 'Analyzing...' : 'Optimize Resume'}
                        </Button>

                        {analysis && (
                            <div className="mt-6 space-y-4 text-slate-900 dark:text-slate-300">
                                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Analysis Result</h3>
                                <p><strong>Score:</strong> {analysis.score ?? 'N/A'}</p>
                                <p><strong>Strengths:</strong> {analysis.strengths?.join(', ')}</p>
                                <p><strong>Weaknesses:</strong> {analysis.weaknesses?.join(', ')}</p>
                                <div>
                                    <h4 className="font-medium text-slate-900 dark:text-white">Suggestions</h4>
                                    <ul className="list-disc list-inside space-y-2">
                                        {analysis.suggestions?.map((s, i) => (
                                            <li key={i}>
                                                <p><strong className="text-slate-900 dark:text-white">Original:</strong> {s.original}</p>
                                                <p><strong className="text-slate-900 dark:text-white">Improved:</strong> {s.improved}</p>
                                                <p><em className="text-slate-600 dark:text-slate-400">{s.reason}</em></p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}
                    </CardBody>
                </Card>
            </div>
        </Layout>
    );
};
