import React, { useState, useEffect } from 'react';
import { Tldraw, useEditor } from 'tldraw';
import { GeminiService } from '../../../shared/services/gemini';
import { useToast } from '../../../shared/context/ToastContext';
import { config } from '../../../config';
import { Loader2, BrainCircuit, Eraser, Bookmark } from 'lucide-react';
import 'tldraw/tldraw.css';

const GEMINI_API_KEY = config.geminiApiKey;
const geminiService = new GeminiService(GEMINI_API_KEY);

// Wrapper component to access the editor instance
function WhiteboardControls({ onCritique, isLoading, setIsLoading, critique, setCritique, showCritique, setShowCritique }) {
    const editor = useEditor();
    const { showToast } = useToast();

    const handleCritique = async () => {
        if (!editor) return;

        const shapeIds = Array.from(editor.getCurrentPageShapeIds());
        if (shapeIds.length === 0) {
            onCritique("Please draw a system architecture first!");
            return;
        }

        setIsLoading(true);
        setShowCritique(true);
        setCritique("");

        try {
            // Get the SVG of the current shapes
            const svg = await editor.getSvg(shapeIds, {
                padding: 32,
                background: true,
            });

            if (!svg) throw new Error("Could not generate SVG");

            // Convert SVG to Data URL via Canvas
            const svgString = new XMLSerializer().serializeToString(svg);
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
            const url = URL.createObjectURL(svgBlob);

            img.onload = async () => {
                canvas.width = img.width * 2; // High res
                canvas.height = img.height * 2;
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.scale(2, 2);
                ctx.drawImage(img, 0, 0);
                
                const base64Image = canvas.toDataURL('image/png').split(',')[1];
                URL.revokeObjectURL(url);

                const response = await geminiService.analyzeArchitecture(base64Image, "System Design Scalability & Reliability");
                onCritique(response);
                setIsLoading(false);
            };
            img.src = url;

        } catch (error) {
            // DEBUG: console.error("Error exporting whiteboard:", error);
            showToast("Failed to analyze whiteboard. Please check your API key.", "error");
            onCritique("Failed to analyze whiteboard.");
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="absolute top-4 right-4 z-[200] flex gap-2 pointer-events-auto">
                <button
                    onClick={() => {
                        editor.selectAll();
                        editor.deleteShapes(editor.getSelectedShapeIds());
                    }}
                    className="bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-800 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 flex items-center gap-2 transition-all"
                    title="Clear Board"
                >
                    <Eraser size={18} />
                    <span className="hidden sm:inline">Clear</span>
                </button>
                <button
                    onClick={handleCritique}
                    disabled={isLoading}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-md flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? <Loader2 className="animate-spin" size={18} /> : <BrainCircuit size={18} />}
                    <span>{isLoading ? "Analyzing..." : "Get AI Critique"}</span>
                </button>
            </div>

            {/* Save to Vault Shortcut */}
            {critique && !isLoading && (
                <div className="absolute top-20 right-4 z-[200] pointer-events-auto">
                    <button
                        onClick={() => {
                            const vault = JSON.parse(localStorage.getItem('nextoffer_ai_vault') || '[]');
                            const newItem = {
                                id: Date.now(),
                                type: 'Architecture',
                                title: `Architecture Audit ${new Date().toLocaleTimeString()}`,
                                content: critique,
                                date: new Date().toISOString()
                            };
                            localStorage.setItem('nextoffer_ai_vault', JSON.stringify([newItem, ...vault]));
                            showToast("Architecture Audit saved to Vault!", "success");
                        }}
                        className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg shadow-md flex items-center gap-2 transition-all"
                    >
                        <Bookmark size={18} />
                        <span>Save Audit</span>
                    </button>
                </div>
            )}

            {/* Critique Overlay */}
            {showCritique && (
                <div className="absolute bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-t border-gray-200 dark:border-slate-700 shadow-lg p-6 max-h-[40vh] overflow-y-auto z-[200] transition-transform duration-300 ease-in-out pointer-events-auto">
                    <div className="max-w-4xl mx-auto relative">
                        <button
                            onClick={() => setShowCritique(false)}
                            className="absolute top-0 right-0 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                            ✕
                        </button>
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2 flex items-center gap-2">
                            <BrainCircuit className="text-indigo-600 dark:text-indigo-400" size={20} />
                            AI Architect Feedback
                        </h3>
                        {isLoading ? (
                            <div className="space-y-2 animate-pulse">
                                <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-3/4"></div>
                                <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/2"></div>
                                <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-5/6"></div>
                            </div>
                        ) : (
                            <div className="prose prose-sm max-w-none text-gray-700 dark:text-gray-300 dark:prose-invert">
                                <ReactMarkdown>{critique}</ReactMarkdown>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

import ReactMarkdown from 'react-markdown';

export function Whiteboard() {
    const [critique, setCritique] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showCritique, setShowCritique] = useState(false);

    useEffect(() => {
        geminiService.startChat(`
      You are a Senior System Architect and Interviewer.
      Your goal is to critique system design diagrams drawn by the candidate.
      Focus on:
      1. Scalability (Load balancers, caching, partitioning)
      2. Reliability (Redundancy, failover)
      3. Data Consistency vs Availability (CAP theorem)
      4. Technology choices (SQL vs NoSQL, Message Queues)
      
      Be constructive but rigorous. Point out single points of failure or bottlenecks.
    `);
    }, []);

    const handleCritiqueResponse = async (text) => {
        setCritique(text);
        setShowCritique(true);
    };

    return (
        <div className="w-full h-full relative">
            <Tldraw persistenceKey="mockmate-whiteboard">
                <WhiteboardControls
                    onCritique={handleCritiqueResponse}
                    isLoading={isLoading}
                    setIsLoading={setIsLoading}
                    critique={critique}
                    setCritique={setCritique}
                    showCritique={showCritique}
                    setShowCritique={setShowCritique}
                />
            </Tldraw>
        </div>
    );
}
