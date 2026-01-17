import { Header } from './Header';
import { Linkedin, Twitter, Github } from 'lucide-react';
import { config } from '../../config';

export const Layout = ({ children, hideFooter = false }) => {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
            <Header />
            <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col">
                {children}
            </main>
            {!hideFooter && (
                <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-6">
                    <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between text-slate-500 dark:text-slate-400 text-sm">
                        <p>© {new Date().getFullYear()} {config.appName}. All rights reserved.</p>
                        <div className="flex items-center space-x-4 mt-4 md:mt-0">
                            <a
                                href="https://www.linkedin.com/in/kapilyadav22/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-primary-600 transition-colors flex items-center space-x-1"
                            >
                                <Linkedin className="w-4 h-4" />
                                <span>LinkedIn</span>
                            </a>
                            <a
                                href="https://x.com/kapilyadav2210"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-primary-600 transition-colors flex items-center space-x-1"
                            >
                                <Twitter className="w-4 h-4" />
                                <span>X (Twitter)</span>
                            </a>
                            <a
                                href="https://github.com/kapilyadav22"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-primary-600 transition-colors flex items-center space-x-1"
                            >
                                <Github className="w-4 h-4" />
                                <span>GitHub</span>
                            </a>
                        </div>
                    </div>
                </footer>
            )}
        </div>
    );
};
