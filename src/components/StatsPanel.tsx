'use client';

import { TrendingDown, Hash, Zap } from 'lucide-react';

interface StatsPanelProps {
    inputTokens: number;
    outputTokens: number;
}

export default function StatsPanel({ inputTokens, outputTokens }: StatsPanelProps) {
    const savings = inputTokens - outputTokens;
    const savingsPercentage = inputTokens > 0 ? Math.round((savings / inputTokens) * 100) : 0;

    return (
        <div className="card p-4">
            <h3 className="text-sm font-semibold text-light-text-secondary dark:text-dark-text-secondary uppercase tracking-wide mb-4">
                Token Analysis
            </h3>

            <div className="grid grid-cols-3 gap-4">
                {/* Input Tokens */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-light-text-tertiary dark:text-dark-text-tertiary">
                        <Hash className="w-4 h-4" />
                        <span className="text-xs font-medium">Input</span>
                    </div>
                    <p className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary">
                        {inputTokens.toLocaleString()}
                    </p>
                </div>

                {/* Output Tokens */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-light-text-tertiary dark:text-dark-text-tertiary">
                        <Zap className="w-4 h-4" />
                        <span className="text-xs font-medium">Output</span>
                    </div>
                    <p className="text-2xl font-bold text-light-accent-primary dark:text-dark-accent-primary">
                        {outputTokens.toLocaleString()}
                    </p>
                </div>

                {/* Savings */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-light-text-tertiary dark:text-dark-text-tertiary">
                        <TrendingDown className="w-4 h-4" />
                        <span className="text-xs font-medium">Savings</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <p className="text-2xl font-bold text-green-500">
                            {savingsPercentage}%
                        </p>
                        {savings > 0 && (
                            <span className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                                (-{savings.toLocaleString()})
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            {inputTokens > 0 && (
                <div className="mt-4 space-y-2">
                    <div className="h-2 bg-light-elevated dark:bg-dark-elevated rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-light-accent-primary to-green-500 dark:from-dark-accent-primary dark:to-green-400 transition-all duration-500 rounded-full"
                            style={{ width: `${100 - savingsPercentage}%` }}
                        />
                    </div>
                    <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary text-center">
                        TOON uses {100 - savingsPercentage}% of original tokens
                    </p>
                </div>
            )}
        </div>
    );
}
