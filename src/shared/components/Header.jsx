import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bot, User, LogOut, ChevronDown, Menu, X, BookOpen, Bug, BrainCircuit, Trophy, Zap, Newspaper, DollarSign, Sparkles, Users, Bookmark, Shield, Camera, Layout as LayoutIcon, FileText, Key, Moon, Sun } from 'lucide-react';
import Pomodoro from './Pomodoro';
import ApiKeyModal from './ApiKeyModal';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { cn } from '../utils/cn';
import { config } from '../../config';

const NavDropdown = ({ title, items }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "flex items-center gap-1 text-sm font-medium px-3 py-2 rounded-md transition-colors",
                    isOpen ? "text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30" : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800"
                )}
            >
                {title}
                <ChevronDown className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")} />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    {items.map((item, index) => (
                        <Link
                            key={index}
                            to={item.to}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export const Header = () => {
    const [showPomodoro, setShowPomodoro] = useState(false);
    const [showApiKeyModal, setShowApiKeyModal] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { user, signOut } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        await signOut();
        navigate('/auth');
    };

    const practiceItems = [
        // { label: 'Mastery Roadmaps', to: '/roadmaps', icon: <BookOpen className="w-4 h-4 text-emerald-600" /> },
        { label: 'Flashcards', to: '/flashcards', icon: <Bookmark className="w-4 h-4 text-primary-600" /> },
        { label: 'Bug Hunt', to: '/bug-hunt', icon: <Bug className="w-4 h-4 text-red-500" /> },
        { label: 'Peer Interview', to: '/p2p', icon: <Users className="w-4 h-4 text-orange-500" /> },
        { label: 'Compiler', to: '/compiler', icon: <LayoutIcon className="w-4 h-4 text-slate-500" /> },
        { label: 'Whiteboard', to: '/collaborative-whiteboard', icon: <BrainCircuit className="w-4 h-4 text-indigo-500" /> },
    ];

    const resourceItems = [
        { label: 'Pre-Interview Cheat Sheet', to: '/pre-flight', icon: <Camera className="w-4 h-4 text-primary-600" /> },
        { label: 'Pitch Coach', to: '/pitch-coach', icon: <Sparkles className="w-4 h-4 text-indigo-600" /> },
        { label: 'Company Sprints', to: '/company-sprints', icon: <Trophy className="w-4 h-4 text-yellow-600" /> },
        { label: 'Behavioral Prep', to: '/behavioral-prep', icon: <Zap className="w-4 h-4 text-indigo-600" /> },
        { label: 'Offer Negotiator', to: '/negotiate', icon: <DollarSign className="w-4 h-4 text-emerald-600" /> },
        { label: 'Referral Engine', to: '/referral-engine', icon: <Users className="w-4 h-4 text-emerald-600" /> },
        { label: 'Post-Interview Game', to: '/survival-kit', icon: <Shield className="w-4 h-4 text-emerald-600" /> },
        { label: 'The Vault', to: '/vault', icon: <Bookmark className="w-4 h-4 text-amber-600" /> },
        // { label: 'Career Blogs', to: '/blogs', icon: <Newspaper className="w-4 h-4 text-primary-600" /> },
        
    ];

    return (
        <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center space-x-2 shrink-0">
                    <div className="p-1 rounded-lg">
                        <img src="/favicon.png" alt={config.appName} className="w-8 h-8" />
                    </div>
                    <span className="text-xl font-bold text-slate-900 dark:text-white hidden sm:block">{config.appName}</span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex items-center gap-2">
                    {user && (
                        <Link to="/dashboard" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-3 py-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                            Dashboard
                        </Link>
                    )}
                    <Link to="/resume-optimizer" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-3 py-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        Resume Optimizer
                    </Link>
                    
                    <NavDropdown title="Practice" items={practiceItems} />
                    <NavDropdown title="Resources" items={resourceItems} />

                    {user && (
                        <>
                            <Link to="/history" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-3 py-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                History
                            </Link>
                            <Link to="/settings" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-3 py-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                Settings
                            </Link>
                        </>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={toggleTheme}
                        className="hidden md:flex items-center justify-center p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
                    >
                        {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                    </button>
                    
                    <button
                        onClick={() => setShowApiKeyModal(true)}
                        className="hidden md:flex items-center gap-2 uppercase text-xs px-3 py-2 rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold tracking-wider transition-colors"
                        title="Set API Key"
                    >
                        <Key className="w-3 h-3" />
                        API Key
                    </button>
                    
                    <button
                        onClick={() => setShowPomodoro(true)}
                        className="hidden md:block uppercase text-xs px-3 py-2 rounded-full bg-primary-50 text-primary-700 hover:bg-primary-100 font-bold tracking-wider transition-colors"
                        title="Open Pomodoro"
                    >
                        Pomodoro
                    </button>

                    <div className="flex items-center gap-3">
                        {user ? (
                            <div className="flex items-center gap-3 border-l border-slate-200 pl-3">
                                <div className="hidden xl:block text-xs font-medium text-slate-500 truncate max-w-[150px]">
                                    {user.email}
                                </div>
                                <button
                                    onClick={handleSignOut}
                                    className="bg-slate-50 p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-600 border border-slate-200"
                                    title="Sign Out"
                                >
                                    <LogOut className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <Link to="/auth" className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-primary-700 transition-colors shadow-sm">
                                <User className="w-4 h-4" />
                                <span className="hidden sm:inline">Sign In</span>
                            </Link>
                        )}

                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="lg:hidden border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 absolute top-16 left-0 w-full shadow-xl animate-in slide-in-from-top-4 duration-300">
                    <div className="p-4 space-y-4 max-h-[80vh] overflow-y-auto">
                        <div className="grid grid-cols-2 gap-2">
                             {user && (
                                <Link to="/dashboard" className="flex items-center gap-2 p-3 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-xl" onClick={() => setMobileMenuOpen(false)}>
                                    <LayoutIcon className="w-4 h-4" />
                                    Dashboard
                                </Link>
                            )}
                            <Link to="/resume-optimizer" className="flex items-center gap-2 p-3 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-xl" onClick={() => setMobileMenuOpen(false)}>
                                <FileText className="w-4 h-4" />
                                Resume
                            </Link>
                        </div>
                        
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest px-3 mb-2">Practice</p>
                            <div className="grid grid-cols-2 gap-1">
                                {practiceItems.map((item, idx) => (
                                    <Link key={idx} to={item.to} className="flex items-center gap-2 p-3 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-xl" onClick={() => setMobileMenuOpen(false)}>
                                        {item.icon}
                                        {item.label}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest px-3 mb-2">Resources</p>
                            <div className="grid grid-cols-2 gap-1">
                                {resourceItems.map((item, idx) => (
                                    <Link key={idx} to={item.to} className="flex items-center gap-2 p-3 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-xl" onClick={() => setMobileMenuOpen(false)}>
                                        {item.icon}
                                        {item.label}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-2">
                             {user && (
                                <Link to="/settings" className="flex items-center justify-center gap-2 p-3 text-sm font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl" onClick={() => setMobileMenuOpen(false)}>
                                    Settings
                                </Link>
                             )}
                            <button 
                                onClick={() => { toggleTheme(); }} 
                                className={cn("flex items-center justify-center gap-2 p-3 text-sm font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-xl", !user && "col-span-3")}
                                title={theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                            >
                                {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                                {theme === 'light' ? 'Dark' : 'Light'}
                            </button>
                            <button 
                                onClick={() => { setShowApiKeyModal(true); setMobileMenuOpen(false); }} 
                                className="flex items-center justify-center gap-2 p-3 text-sm font-bold text-emerald-600 bg-emerald-50 rounded-xl"
                            >
                                <Key className="w-4 h-4" />
                                API Key
                            </button>
                            <button onClick={() => { setShowPomodoro(true); setMobileMenuOpen(false); }} className="flex items-center justify-center gap-2 p-3 text-sm font-bold text-primary-600 bg-primary-50 rounded-xl">
                                Pomodoro
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Pomodoro open={showPomodoro} onClose={() => setShowPomodoro(false)} />
            <ApiKeyModal open={showApiKeyModal} onClose={() => setShowApiKeyModal(false)} />
        </header>
    );
};
