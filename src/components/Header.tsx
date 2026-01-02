'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Moon, Sun } from 'lucide-react';

export default function Header() {
    const [isDark, setIsDark] = useState(true);

    useEffect(() => {
        // Check system preference on mount
        const isDarkMode = document.documentElement.classList.contains('dark');
        setIsDark(isDarkMode);
    }, []);

    const toggleTheme = () => {
        const newTheme = !isDark;
        setIsDark(newTheme);

        if (newTheme) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    return (
        <header className="glass-effect sticky top-0 z-50 animate-fade-in">
            <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
                <div className="flex items-center justify-between">
                    {/* Logo and Title */}
                    <div className="flex items-center gap-2 sm:gap-4">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-light-accent-primary to-light-accent-tertiary dark:from-dark-accent-primary dark:to-dark-accent-tertiary flex items-center justify-center shadow-lg">
                                <span className="text-white dark:text-dark-bg font-bold text-lg sm:text-xl">T</span>
                            </div>
                            <div>
                                <h1 className="text-xl sm:text-2xl font-bold gradient-text">TOONIFY</h1>
                                <p className="text-[10px] sm:text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                                    Token-Oriented Notation
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center gap-3">
                        <Link
                            href="/playground"
                            className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-light-elevated dark:bg-dark-elevated border border-light-border dark:border-dark-border hover:border-light-accent-primary dark:hover:border-dark-accent-primary transition-all duration-300 group shadow-sm hover:shadow-md"
                        >
                            <span className="text-light-text-primary dark:text-dark-text-primary group-hover:text-light-accent-primary dark:group-hover:text-dark-accent-primary transition-colors">
                                Playground
                            </span>
                            <span className="px-1.5 py-0.5 text-[10px] font-bold bg-gradient-to-r from-[#FF6B6B] to-[#FF8E53] text-white rounded uppercase tracking-wide animate-pulse shadow-lg shadow-[#FF6B6B]/50">
                                New
                            </span>
                        </Link>

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="btn-secondary !p-2 sm:!p-2.5 group"
                            aria-label="Toggle theme"
                        >
                            {isDark ? (
                                <Sun className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-180 transition-transform duration-500" />
                            ) : (
                                <Moon className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-rotate-180 transition-transform duration-500" />
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
