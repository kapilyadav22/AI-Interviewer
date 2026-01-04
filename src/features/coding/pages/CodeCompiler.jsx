import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Layout } from '../../../shared/components/Layout';
import { Card, CardHeader, CardBody } from '../../../shared/components/Card';
import { Button } from '../../../shared/components/Button';
import { Play, Loader2, Terminal, Code2, Bot, ChevronDown } from 'lucide-react';
import { LANGUAGES, DEFAULT_CODE, executeCode } from '../../../shared/services/compiler';
import Split from 'react-split';
import { useToast } from '../../../shared/context/ToastContext';

export const CodeCompiler = () => {
    const [language, setLanguage] = useState('cpp');
    const [code, setCode] = useState(DEFAULT_CODE['cpp']);
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { showToast } = useToast();

    // Show shortcut notification on mount
    useEffect(() => {
        const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
        const shortcut = isMac ? '⌘ + Enter' : 'Ctrl + Enter';
        showToast(`Tip: Use ${shortcut} to run code instantly`, 'info');
    }, []);

    const handleLanguageChange = (e) => {
        const newLang = e.target.value;
        setLanguage(newLang);
        setCode(DEFAULT_CODE[newLang]);
        setOutput('');
        setError(null);
    };

    const handleRun = async () => {
        if (loading) return;
        setLoading(true);
        setError(null);
        setOutput('');
        try {
            const result = await executeCode(LANGUAGES[language], code, input);
            if (result.run.stderr) {
                setError(result.run.stderr);
            }
            setOutput(result.run.stdout);
        } catch (err) {
            setError(err.message || 'Failed to execute code');
        } finally {
            setLoading(false);
        }
    };

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                handleRun();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleRun]);

    return (
        <Layout hideFooter>
            <div className="h-[calc(100vh-4rem)] flex flex-col p-2 md:p-4 max-w-[1920px] mx-auto w-full bg-slate-50 dark:bg-slate-950 overflow-hidden">
                <Card className="flex-1 flex flex-col overflow-hidden shadow-2xl border-slate-200 dark:border-slate-800 rounded-3xl">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between px-6 py-4 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 gap-4 shrink-0">
                        <div className="flex items-center gap-4">
                            <div className="bg-primary-600 p-2.5 rounded-2xl shadow-lg shadow-primary-500/20">
                                <Code2 className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-lg font-black text-slate-900 dark:text-white tracking-tight uppercase italic">NextOffer IDE</h1>
                                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest leading-none mt-1">v1.0 Compiler</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <div className="relative group">
                                <select
                                    value={language}
                                    onChange={handleLanguageChange}
                                    className="appearance-none pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-black text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-4 focus:ring-primary-500/10 transition-all cursor-pointer hover:border-primary-500"
                                >
                                    {Object.keys(LANGUAGES).map((key) => (
                                        <option key={key} value={key}>
                                            {LANGUAGES[key].label}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                                    <Bot size={16} />
                                </div>
                                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none transition-transform group-hover:translate-y-px">
                                    <ChevronDown size={16} />
                                </div>
                            </div>
                            
                            <Button 
                                onClick={handleRun} 
                                disabled={loading} 
                                className="bg-primary-600 hover:bg-primary-700 font-black h-11 px-8 rounded-2xl shadow-xl shadow-primary-500/20 active:scale-95 transition-all group"
                            >
                                {loading ? (
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                ) : (
                                    <Play className="w-4 h-4 mr-2 fill-current group-hover:scale-110 transition-transform" />
                                )}
                                {loading ? 'Compiling' : 'Run'}
                            </Button>
                        </div>
                    </div>

                    <div className="flex-1 min-h-0 bg-slate-50 dark:bg-slate-900 relative">
                        <Split
                            className="flex h-full flex-col md:flex-row"
                            sizes={window.innerWidth < 768 ? [100, 0] : [65, 35]}
                            minSize={window.innerWidth < 768 ? 0 : 300}
                            gutterSize={window.innerWidth < 768 ? 0 : 8}
                            gutterAlign="center"
                            direction={window.innerWidth < 768 ? "vertical" : "horizontal"}
                            cursor={window.innerWidth < 768 ? "row-resize" : "col-resize"}
                        >
                            <div className="h-full flex flex-col bg-white dark:bg-[#1e1e1e]">
                                <div className="flex items-center px-4 py-2 border-b border-slate-100 dark:border-[#333] bg-slate-50/50 dark:bg-[#252526] justify-between">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Editor</span>
                                    <span className="text-[10px] font-black text-primary-500 uppercase tracking-widest">Main.cpp</span>
                                </div>
                                <Editor
                                    height="100%"
                                    language={language === 'c' || language === 'cpp' ? 'cpp' : language}
                                    value={code}
                                    onChange={(value) => setCode(value)}
                                    theme="vs-dark"
                                    options={{
                                        minimap: { enabled: false },
                                        fontSize: 15,
                                        scrollBeyondLastLine: false,
                                        padding: { top: 20, bottom: 20 },
                                        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                                        lineNumbers: 'on',
                                        renderLineHighlight: 'all',
                                        automaticLayout: true,
                                        cursorSmoothCaretAnimation: 'on',
                                        smoothScrolling: true,
                                        roundedSelection: true,
                                    }}
                                />
                            </div>

                            <div className="h-full flex flex-col bg-[#1e1e1e] border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800">
                                <Split
                                    className="flex flex-col h-full"
                                    sizes={[30, 70]}
                                    minSize={100}
                                    gutterSize={8}
                                    gutterAlign="center"
                                    direction="vertical"
                                    cursor="row-resize"
                                    dragInterval={1}
                                >
                                    <div className="flex flex-col h-full bg-[#1e1e1e]">
                                        <div className="flex items-center px-6 py-3 border-b border-[#333] bg-[#252526]">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Standard Input</span>
                                        </div>
                                        <textarea
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            className="flex-1 w-full bg-[#1e1e1e] text-slate-300 p-6 resize-none focus:outline-none font-mono text-sm leading-relaxed"
                                            placeholder="Enter stdin here..."
                                        />
                                    </div>

                                    <div className="flex flex-col h-full bg-black/20">
                                        <div className="flex items-center justify-between px-6 py-3 border-b border-[#333] bg-[#252526]">
                                            <div className="flex items-center gap-3">
                                                <Terminal className="w-4 h-4 text-emerald-500" />
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Console Output</span>
                                            </div>
                                            {error && (
                                                <div className="flex items-center gap-2 text-red-400">
                                                    <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest font-mono">STDOUT</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 p-6 overflow-auto font-mono text-sm whitespace-pre-wrap leading-relaxed">
                                            {error ? (
                                                <div className="text-red-400 animate-in fade-in slide-in-from-top-1">{error}</div>
                                            ) : output ? (
                                                <div className="text-emerald-400 animate-in fade-in slide-in-from-top-1">{output}</div>
                                            ) : (
                                                <div className="text-slate-600 dark:text-slate-700 italic select-none font-medium">~/ Waiting for execution...</div>
                                            )}
                                        </div>
                                    </div>
                                </Split>
                            </div>
                        </Split>
                    </div>
                </Card>
            </div>
        </Layout>
    );
};
