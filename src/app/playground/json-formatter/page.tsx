'use client';

import { useState, useEffect, useMemo } from 'react';
import ToolLayout from '@/components/playground/ToolLayout';
import CopyButton from '@/components/playground/CopyButton';
import { AlertCircle, Check } from 'lucide-react';
import { saveToStorage, loadFromStorage, STORAGE_KEYS } from '@/lib/playground/localStorage';
import type { JSONFormatterState } from '@/lib/playground/types';

const DEFAULT_JSON = `{
  "name": "John Doe",
  "age": 30,
  "email": "john@example.com",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "country": "USA"
  },
  "hobbies": ["reading", "coding", "gaming"]
}`;

export default function JSONFormatterPage() {
    const [state, setState] = useState<JSONFormatterState>(() =>
        loadFromStorage(STORAGE_KEYS.JSON_FORMATTER, {
            input: DEFAULT_JSON,
            indent: 2,
        })
    );
    const [output, setOutput] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isValid, setIsValid] = useState(false);

    // Save to localStorage
    useEffect(() => {
        saveToStorage(STORAGE_KEYS.JSON_FORMATTER, state);
    }, [state]);

    // Validate JSON on input change
    useEffect(() => {
        try {
            JSON.parse(state.input);
            setError(null);
            setIsValid(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Invalid JSON');
            setIsValid(false);
        }
    }, [state.input]);

    const handleBeautify = () => {
        try {
            const parsed = JSON.parse(state.input);
            const formatted = JSON.stringify(parsed, null, state.indent);
            setOutput(formatted);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Invalid JSON');
        }
    };

    const handleMinify = () => {
        try {
            const parsed = JSON.parse(state.input);
            const minified = JSON.stringify(parsed);
            setOutput(minified);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Invalid JSON');
        }
    };

    const handleReset = () => {
        setState({ input: DEFAULT_JSON, indent: 2 });
        setOutput('');
        setError(null);
    };

    const stats = useMemo(() => {
        const inputSize = new Blob([state.input]).size;
        const outputSize = output ? new Blob([output]).size : 0;
        const savings = inputSize - outputSize;
        const savingsPercent = inputSize > 0 ? ((savings / inputSize) * 100).toFixed(1) : '0';

        return {
            inputSize,
            outputSize,
            savings,
            savingsPercent,
        };
    }, [state.input, output]);

    return (
        <ToolLayout
            title="JSON Formatter"
            description="Validate, beautify, and minify JSON with syntax highlighting"
        >
            <div className="space-y-4">
                {/* Controls */}
                <div className="card p-4 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            {/* Validation Status */}
                            <div className="flex items-center gap-2">
                                {isValid ? (
                                    <>
                                        <Check className="w-5 h-5 text-green-500" />
                                        <span className="text-sm font-medium text-green-500">Valid JSON</span>
                                    </>
                                ) : (
                                    <>
                                        <AlertCircle className="w-5 h-5 text-red-500" />
                                        <span className="text-sm font-medium text-red-500">Invalid JSON</span>
                                    </>
                                )}
                            </div>

                            {/* Indent Selector */}
                            <div className="flex items-center gap-2">
                                <label className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                                    Indent:
                                </label>
                                <select
                                    value={state.indent}
                                    onChange={(e) => setState((prev) => ({ ...prev, indent: Number(e.target.value) }))}
                                    className="px-3 py-1 bg-light-elevated dark:bg-dark-elevated border border-light-border dark:border-dark-border rounded-lg text-sm text-light-text-primary dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-light-accent-primary dark:focus:ring-dark-accent-primary"
                                >
                                    <option value={2}>2 spaces</option>
                                    <option value={4}>4 spaces</option>
                                    <option value={8}>Tab</option>
                                </select>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2">
                            <button onClick={handleBeautify} className="btn-primary" disabled={!isValid}>
                                Beautify
                            </button>
                            <button onClick={handleMinify} className="btn-secondary" disabled={!isValid}>
                                Minify
                            </button>
                            <button onClick={handleReset} className="btn-secondary">
                                Reset
                            </button>
                        </div>
                    </div>

                    {/* Error Display */}
                    {error && (
                        <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-red-500">JSON Error</p>
                                <p className="text-sm text-red-400 mt-1">{error}</p>
                            </div>
                        </div>
                    )}

                    {/* Stats */}
                    {output && (
                        <div className="flex items-center gap-6 text-sm text-light-text-secondary dark:text-dark-text-secondary">
                            <span>Input: {stats.inputSize} bytes</span>
                            <span>Output: {stats.outputSize} bytes</span>
                            {stats.savings !== 0 && (
                                <span className={stats.savings > 0 ? 'text-green-500' : 'text-red-500'}>
                                    {stats.savings > 0 ? '↓' : '↑'} {Math.abs(stats.savings)} bytes ({stats.savingsPercent}%)
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* Input and Output */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Input */}
                    <div className="card p-4 space-y-2">
                        <label className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                            JSON Input
                        </label>
                        <textarea
                            value={state.input}
                            onChange={(e) => setState((prev) => ({ ...prev, input: e.target.value }))}
                            className="w-full h-[500px] px-3 py-2 bg-light-elevated dark:bg-dark-elevated border border-light-border dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-light-accent-primary dark:focus:ring-dark-accent-primary text-light-text-primary dark:text-dark-text-primary font-mono text-sm resize-none"
                            placeholder="Paste your JSON here"
                        />
                    </div>

                    {/* Output */}
                    <div className="card p-4 space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                                Formatted Output
                            </label>
                            {output && <CopyButton text={output} />}
                        </div>
                        <div className="relative">
                            <pre className="w-full h-[500px] px-3 py-2 bg-light-elevated dark:bg-dark-elevated border border-light-border dark:border-dark-border rounded-lg overflow-auto text-light-text-primary dark:text-dark-text-primary font-mono text-sm">
                                {output || 'Click Beautify or Minify to see output'}
                            </pre>
                        </div>
                    </div>
                </div>
            </div>
        </ToolLayout>
    );
}
