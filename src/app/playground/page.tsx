'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Code2, Search, GitCompare, Braces, Palette, Sparkles, Moon, Sun } from 'lucide-react';
import { PLAYGROUND_TOOLS } from '@/lib/playground/constants';

const iconMap = {
    Code2,
    Search,
    GitCompare,
    Braces,
    Palette,
};

export default function PlaygroundPage() {
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
            <header className="glass-effect sticky top-0 z-50 animate-fade-in">
                <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 sm:gap-4">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-light-accent-primary to-light-accent-tertiary dark:from-dark-accent-primary dark:to-dark-accent-tertiary flex items-center justify-center shadow-lg">
                                    <span className="text-white dark:text-dark-bg font-bold text-lg sm:text-xl">T</span>
                                </div>
                                <div>
                                    <h1 className="text-xl sm:text-2xl font-bold gradient-text">TOONIFY</h1>
                                    <p className="text-[10px] sm:text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                                        Developer Playground
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Link href="/" className="btn-secondary text-xs sm:text-sm">
                                TOON Converter
                            </Link>
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

            {/* Main Content */}
            <main className="flex-1 container mx-auto px-4 sm:px-6 py-8 sm:py-12">
                {/* Hero Section */}
                <div className="text-center mb-8 sm:mb-12 space-y-3 sm:space-y-4 animate-slide-up">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-light-accent-primary/10 dark:bg-dark-accent-primary/10 border border-light-accent-primary/20 dark:border-dark-accent-primary/20">
                        <Sparkles className="w-4 h-4 text-light-accent-primary dark:text-dark-accent-primary" />
                        <span className="text-sm font-medium text-light-accent-primary dark:text-dark-accent-primary">
                            Interactive Coding Tools
                        </span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-light-text-primary dark:text-dark-text-primary">
                        Developer Playground
                    </h2>
                    <p className="text-base sm:text-lg text-light-text-secondary dark:text-dark-text-secondary max-w-2xl mx-auto">
                        A collection of powerful, browser-based tools for developers. No backend, no sign-up, just pure frontend magic.
                    </p>
                </div>

                {/* Tools Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
                    {PLAYGROUND_TOOLS.map((tool, index) => {
                        const Icon = iconMap[tool.icon as keyof typeof iconMap];

                        return (
                            <Link
                                key={tool.id}
                                href={tool.path}
                                className="card p-6 hover:scale-105 transition-all duration-300 group cursor-pointer animate-slide-up"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="flex flex-col h-full">
                                    {/* Icon */}
                                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-light-accent-primary to-light-accent-tertiary dark:from-dark-accent-primary dark:to-dark-accent-tertiary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                                        <Icon className="w-6 h-6 text-white dark:text-dark-bg" />
                                    </div>

                                    {/* Content */}
                                    <h3 className="text-lg sm:text-xl font-bold text-light-text-primary dark:text-dark-text-primary mb-2 group-hover:text-light-accent-primary dark:group-hover:text-dark-accent-primary transition-colors">
                                        {tool.name}
                                    </h3>
                                    <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary flex-1 mb-4">
                                        {tool.description}
                                    </p>

                                    {/* Launch Button */}
                                    <div className="flex items-center gap-2 text-sm font-medium text-light-accent-primary dark:text-dark-accent-primary group-hover:gap-3 transition-all">
                                        <span>Launch Tool</span>
                                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* Info Section */}
                <div className="mt-12 sm:mt-16 card p-6 sm:p-8 max-w-4xl mx-auto animate-slide-up" style={{ animationDelay: '500ms' }}>
                    <h3 className="text-xl sm:text-2xl font-bold text-light-text-primary dark:text-dark-text-primary mb-4">
                        Why Use the Playground?
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base">
                        <div className="space-y-2">
                            <h4 className="font-semibold text-light-accent-primary dark:text-dark-accent-primary">
                                ⚡ Lightning Fast
                            </h4>
                            <p className="text-light-text-secondary dark:text-dark-text-secondary">
                                Everything runs in your browser. No server delays, no waiting.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-semibold text-light-accent-primary dark:text-dark-accent-primary">
                                🔒 Privacy First
                            </h4>
                            <p className="text-light-text-secondary dark:text-dark-text-secondary">
                                Your code never leaves your machine. 100% client-side processing.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-semibold text-light-accent-primary dark:text-dark-accent-primary">
                                💾 Auto-Save
                            </h4>
                            <p className="text-light-text-secondary dark:text-dark-text-secondary">
                                Your work is automatically saved to localStorage. Pick up where you left off.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-semibold text-light-accent-primary dark:text-dark-accent-primary">
                                🎨 Beautiful UI
                            </h4>
                            <p className="text-light-text-secondary dark:text-dark-text-secondary">
                                Modern, responsive design with smooth animations and dark mode.
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-light-border dark:border-dark-border py-4 sm:py-6">
                <div className="container mx-auto px-4 sm:px-6 text-center">
                    <p className="text-xs sm:text-sm text-light-text-tertiary dark:text-dark-text-tertiary">
                        All tools run entirely in your browser. No data is sent to any server.
                    </p>
                </div>
            </footer>
        </div>
    );
}
