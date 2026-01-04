import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Code2, Network, Zap, BookOpen, 
    ChevronRight, ArrowLeft, Terminal,
    Layers, Cpu, Database, Info,
    CheckCircle2, Square, Layout as LayoutIcon
} from 'lucide-react';
import { Layout } from '../../../shared/components/Layout';
import { ROADMAP_CATEGORIES } from '../../../shared/data/roadmapData';
import { cn } from '../../../shared/utils/cn';

const ICON_MAP = {
    Code2: Code2,
    Network: Network,
    Zap: Zap
};

export const Roadmaps = () => {
    const [selectedCategory, setSelectedCategory] = useState(null);

    return (
        <Layout>
            <div className="max-w-6xl mx-auto py-12 px-4">
                <AnimatePresence mode="wait">
                    {!selectedCategory ? (
                        <motion.div
                            key="grid"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <div className="text-center mb-16">
                                <div className="inline-flex items-center justify-center p-3 bg-primary-100 rounded-2xl mb-4 text-primary-600">
                                    <BookOpen size={32} />
                                </div>
                                <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">INTERVIEW MASTERY ROADMAPS</h1>
                                <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg font-medium">
                                    Advanced "Must-Know" technical blueprints for the final push before your interview.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {Object.values(ROADMAP_CATEGORIES).map((cat) => {
                                    const Icon = ICON_MAP[cat.icon];
                                    return (
                                        <motion.div
                                            key={cat.id}
                                            whileHover={{ y: -8, scale: 1.02 }}
                                            onClick={() => setSelectedCategory(cat)}
                                            className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-2xl hover:border-primary-200 dark:hover:border-primary-800 cursor-pointer transition-all flex flex-col group relative overflow-hidden"
                                        >
                                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform dark:invert">
                                                <Icon size={120} />
                                            </div>
                                            <div className="mb-6 w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-300 group-hover:bg-primary-50 dark:group-hover:bg-primary-900/30 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                                <Icon size={28} />
                                            </div>
                                            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">{cat.title}</h3>
                                            <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-6">
                                                {cat.description}
                                            </p>
                                            <div className="mt-auto flex items-center text-primary-600 font-bold uppercase text-xs tracking-widest gap-2">
                                                EXplore Blueprints
                                                <ChevronRight size={16} />
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="detail"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <button 
                                onClick={() => setSelectedCategory(null)}
                                className="flex items-center text-slate-400 hover:text-slate-600 mb-8 transition-colors font-bold uppercase text-xs tracking-widest"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Library
                            </button>

                            <div className="flex items-center gap-6 mb-12">
                                <div className="w-20 h-20 rounded-3xl bg-primary-600 flex items-center justify-center text-white shadow-xl shadow-primary-100 dark:shadow-none">
                                    {React.createElement(ICON_MAP[selectedCategory.icon], { size: 36 })}
                                </div>
                                <div>
                                    <h2 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{selectedCategory.title}</h2>
                                    <p className="text-slate-500 dark:text-slate-400 font-bold">{selectedCategory.items.length} ADVANCED BLUEPRINTS</p>
                                </div>
                            </div>

                            <div className="space-y-8">
                                {selectedCategory.items.map((item, idx) => (
                                    <div key={idx} className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                                        <div className="p-8 md:p-12">
                                            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                                                <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{item.title}</h3>
                                                <span className={cn(
                                                    "px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest",
                                                    item.difficulty === 'Hard' ? "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400" :
                                                    item.difficulty === 'Medium' ? "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" :
                                                    "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                                                )}>
                                                    {item.difficulty}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                                <div className="space-y-8">
                                                    <div>
                                                        <h4 className="flex items-center gap-2 text-slate-400 dark:text-slate-500 text-[10px] uppercase font-black tracking-widest mb-3">
                                                            <Info size={14} /> The Problem
                                                        </h4>
                                                        <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed font-medium">
                                                            {item.description}
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <h4 className="flex items-center gap-2 text-slate-400 dark:text-slate-500 text-[10px] uppercase font-black tracking-widest mb-3">
                                                            <Layers size={14} /> The Logic
                                                        </h4>
                                                        <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed font-bold bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-700">
                                                            {item.logic}
                                                        </p>
                                                    </div>

                                                    {item.components && (
                                                        <div>
                                                            <h4 className="flex items-center gap-2 text-slate-400 dark:text-slate-500 text-[10px] uppercase font-black tracking-widest mb-3">
                                                                <Database size={14} /> Core Components
                                                            </h4>
                                                            <div className="flex flex-wrap gap-2">
                                                                {item.components.map((c, i) => (
                                                                    <span key={i} className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-bold">
                                                                        {c}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {item.tradeoffs && (
                                                        <div className="p-6 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-100 dark:border-amber-900/30">
                                                            <h4 className="text-amber-800 dark:text-amber-500 text-[10px] uppercase font-black tracking-widest mb-2">Trade-offs</h4>
                                                            <p className="text-amber-700 dark:text-amber-400 font-bold">{item.tradeoffs}</p>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="space-y-6">
                                                    {item.code ? (
                                                        <div className="rounded-3xl overflow-hidden shadow-2xl bg-[#1e1e1e]">
                                                            <div className="px-6 py-4 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
                                                                <div className="flex gap-1.5">
                                                                    <div className="w-3 h-3 rounded-full bg-red-500" />
                                                                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                                                                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                                                                </div>
                                                                <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Logic Blueprint</span>
                                                            </div>
                                                            <pre className="p-8 text-sm font-medium text-emerald-400 overflow-x-auto leading-relaxed">
                                                                <code>{item.code}</code>
                                                            </pre>
                                                        </div>
                                                    ) : (
                                                        <div className="h-full flex items-center justify-center border-4 border-dashed border-slate-100 dark:border-slate-700 rounded-[2rem] p-12 text-center">
                                                            <div className="space-y-4">
                                                                <div className="w-20 h-20 bg-slate-50 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto text-slate-200 dark:text-slate-500">
                                                                    <Cpu size={40} />
                                                                </div>
                                                                <p className="text-slate-400 dark:text-slate-500 font-bold uppercase text-xs tracking-widest">Architectural Blueprint</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </Layout>
    );
};
