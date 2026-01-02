'use client';

import { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Moon, Sun } from 'lucide-react';

interface ToolLayoutProps {
    title: string;
    description: string;
    children: ReactNode;
}

export default function ToolLayout({ title, description, children }: ToolLayoutProps) {
    const [isDark, setIsDark] = useState(true);

    useEffect(() => {
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
        <div className="min-h-screen flex flex-col bg-light-bg dark:bg-dark-bg">
            {/* Header */}
            <header className="glass-effect sticky top-0 z-50">
                <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <Link
                                href="/playground"
                                className="btn-secondary !p-2 sm:!p-2.5 group"
                                aria-label="Back to playground"
                            >
                                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" />
                            </Link>
                            <div>
                                <h1 className="text-xl sm:text-2xl font-bold gradient-text">{title}</h1>
                                <p className="text-xs sm:text-sm text-light-text-tertiary dark:text-dark-text-tertiary">
                                    {description}
                                </p>
                            </div>
                        </div>

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
            </header>

            {/* Main Content */}
            <main className="flex-1 container mx-auto px-4 sm:px-6 py-4 sm:py-8">
                {children}
            </main>
        </div>
    );
}
