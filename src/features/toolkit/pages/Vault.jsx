import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Bookmark, Trash2, ExternalLink, Filter, 
    Search, Folder, MessageSquare, Building2, 
    BrainCircuit, Sparkles, ChevronRight, Inbox,
    Save, Copy, Check, DollarSign, Send, Star
} from 'lucide-react';
import { Layout } from '../../../shared/components/Layout';
import { Card } from '../../../shared/components/Card';
import { Button } from '../../../shared/components/Button';
import { cn } from '../../../shared/utils/cn';

export const Vault = () => {
    const [items, setItems] = useState([]);
    const [filter, setFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [copiedId, setCopiedId] = useState(null);

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('nextoffer_ai_vault') || '[]');
        setItems(saved);
    }, []);

    const deleteItem = (id) => {
        const updated = items.filter(item => item.id !== id);
        setItems(updated);
        localStorage.setItem('nextoffer_ai_vault', JSON.stringify(updated));
    };

    const copyToClipboard = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

     const filteredItems = items.filter(item => {
        if (!item) return false;
        const matchesFilter = filter === 'All' || item.type === filter;
        const matchesSearch = 
            (item.title || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
            (item.content || '').toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const categories = ['All', 'Pitch', 'Referral', 'Negotiation', 'Behavioral', 'Architecture'];

    return (
        <Layout>
            <div className="max-w-6xl mx-auto py-12 px-4 space-y-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-amber-100 dark:border-amber-800/30">
                            <Bookmark size={12} className="fill-current" /> Platinum Storage
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight uppercase">The Vault</h1>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">Your library of AI-generated career assets.</p>
                    </div>
                    
                    <div className="flex items-center gap-4 bg-white dark:bg-slate-800 p-2 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input 
                                type="text"
                                placeholder="Search assets..."
                                className="pl-10 pr-4 py-2 w-64 rounded-xl border-transparent focus:ring-0 text-sm font-medium bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-2">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={cn(
                                "px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                                filter === cat 
                                    ? "bg-slate-900 dark:bg-primary-600 text-white shadow-lg" 
                                    : "bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-100 dark:border-slate-700"
                            )}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                {filteredItems.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <AnimatePresence mode="popLayout">
                            {filteredItems.map(item => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="group"
                                >
                                    <Card className="h-full flex flex-col p-8 rounded-[2.5rem] border-slate-200 dark:border-slate-700 hover:border-amber-200 dark:hover:border-amber-800 transition-colors bg-white dark:bg-slate-800 shadow-xl hover:shadow-2xl overflow-hidden relative">
                                        {/* Type Accent */}
                                        <div className={cn(
                                            "absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full opacity-5 group-hover:scale-150 transition-transform duration-700",
                                            item.type === 'Pitch' ? "bg-indigo-500" : 
                                            item.type === 'Architecture' ? "bg-blue-500" : 
                                            item.type === 'Referral' ? "bg-emerald-500" : 
                                            item.type === 'Negotiation' ? "bg-amber-500" : 
                                            item.type === 'Behavioral' ? "bg-purple-500" : "bg-slate-500"
                                        )} />

                                        <div className="flex items-center justify-between mb-6 relative z-10">
                                            <div className={cn(
                                                "w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg",
                                                item.type === 'Pitch' ? "bg-indigo-600 shadow-indigo-100 dark:shadow-indigo-900/20" : 
                                                item.type === 'Architecture' ? "bg-blue-600 shadow-blue-100 dark:shadow-blue-900/20" : 
                                                item.type === 'Referral' ? "bg-emerald-600 shadow-emerald-100 dark:shadow-emerald-900/20" : 
                                                item.type === 'Negotiation' ? "bg-amber-600 shadow-amber-100 dark:shadow-amber-900/20" : 
                                                item.type === 'Behavioral' ? "bg-purple-600 shadow-purple-100 dark:shadow-purple-900/20" : "bg-slate-600 shadow-slate-100 dark:shadow-slate-900/20"
                                            )}>
                                                {item.type === 'Pitch' ? <Sparkles size={24} /> : 
                                                 item.type === 'Architecture' ? <BrainCircuit size={24} /> : 
                                                 item.type === 'Referral' ? <Send size={24} /> : 
                                                 item.type === 'Negotiation' ? <DollarSign size={24} /> : 
                                                 item.type === 'Behavioral' ? <Star size={24} /> : <MessageSquare size={24} />}
                                            </div>
                                            <div className="flex gap-2">
                                                <button 
                                                    onClick={() => copyToClipboard(item.content, item.id)}
                                                    className="p-2 rounded-xl bg-slate-50 dark:bg-slate-700 text-slate-400 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                                                >
                                                    {copiedId === item.id ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
                                                </button>
                                                <button 
                                                    onClick={() => deleteItem(item.id)}
                                                    className="p-2 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>

                                        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 truncate relative z-10">{item.title}</h3>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-6">{item.type} • {new Date(item.date).toLocaleDateString()}</p>
                                        
                                        <div className="flex-1 overflow-y-auto text-slate-600 dark:text-slate-300 font-medium text-sm leading-relaxed mb-6 max-h-48 scrollbar-hide relative z-10">
                                            {item.content}
                                        </div>

                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            className="w-full rounded-xl border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300 group-hover:border-amber-200 dark:group-hover:border-amber-800 group-hover:text-amber-600 dark:group-hover:text-amber-400 font-bold hover:bg-slate-50 dark:hover:bg-slate-700"
                                            onClick={() => copyToClipboard(item.content, item.id)}
                                        >
                                            {copiedId === item.id ? "COPIED TO CLIPBOARD" : "COPY ASSET"}
                                        </Button>
                                    </Card>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <div className="py-24 flex flex-col items-center justify-center text-center space-y-6">
                        <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-300 dark:text-slate-600">
                            <Inbox size={48} />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase">The Vault is empty</h3>
                            <p className="text-slate-500 dark:text-slate-400 font-medium">Start practicing to save your high-impact AI responses here.</p>
                        </div>
                        <Link to="/setup">
                            <Button className="rounded-xl px-10 font-bold">PRACTICE NOW</Button>
                        </Link>
                    </div>
                )}
            </div>
        </Layout>
    );
};
