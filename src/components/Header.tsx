'use client';

import { useState, useEffect } from 'react';
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
            <div className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo and Title */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-light-accent-primary to-light-accent-tertiary dark:from-dark-accent-primary dark:to-dark-accent-tertiary flex items-center justify-center shadow-lg">
                                <span className="text-white dark:text-dark-bg font-bold text-xl">T</span>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold gradient-text">TOONIFY</h1>
                                <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                                    Token-Oriented Notation
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="btn-secondary !p-2.5 group"
                        aria-label="Toggle theme"
                    >
                        {isDark ? (
                            <Sun className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                        ) : (
                            <Moon className="w-5 h-5 group-hover:-rotate-180 transition-transform duration-500" />
                        )}
                    </button>
                </div>
            </div>
        </header>
    );
}
