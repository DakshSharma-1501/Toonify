'use client';

import { useState, useMemo, useCallback } from 'react';
import Header from '@/components/Header';
import EditorPanel from '@/components/EditorPanel';
import FormatSelector from '@/components/FormatSelector';
import StatsPanel from '@/components/StatsPanel';
import { toonConverter } from '@/lib/converters';
import type { InputFormat } from '@/types';

const EXAMPLE_JSON = `{
  "order": {
    "id": 1,
    "status": "paid",
    "items": [
      { "name": "Widget", "qty": 2 }
    ]
  }
}`;

const EXAMPLE_REACT = `function Login({ user }) {
  return (
    <button onClick={login}>
      Login {user.name}
    </button>
  );
}`;

export default function Home() {
    const [input, setInput] = useState(EXAMPLE_JSON);
    const [format, setFormat] = useState<InputFormat>('auto');
    const [copySuccess, setCopySuccess] = useState(false);

    // Memoize conversion result to avoid unnecessary recalculations
    const result = useMemo(() => {
        return toonConverter.convert(input, format);
    }, [input, format]);

    const handleCopy = useCallback(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    }, []);

    const loadExample = (example: 'json' | 'react') => {
        if (example === 'json') {
            setInput(EXAMPLE_JSON);
            setFormat('auto');
        } else {
            setInput(EXAMPLE_REACT);
            setFormat('auto');
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-light-bg dark:bg-dark-bg">
            <Header />

            <main className="flex-1 container mx-auto px-6 py-8 space-y-6">
                {/* Info Banner */}
                <div className="card p-6 space-y-3 animate-slide-up">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-2">
                            <h2 className="text-xl font-bold text-light-text-primary dark:text-dark-text-primary">
                                Convert code to Token-Oriented Notation
                            </h2>
                            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary leading-relaxed">
                                TOON exposes the <span className="font-semibold text-light-accent-primary dark:text-dark-accent-primary">intent</span> of your code in a format optimized for LLM reasoning.
                                It&apos;s a lossy abstraction that reduces token count while preserving semantic meaning.
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => loadExample('json')}
                                className="btn-secondary text-xs whitespace-nowrap"
                            >
                                Load JSON Example
                            </button>
                            <button
                                onClick={() => loadExample('react')}
                                className="btn-secondary text-xs whitespace-nowrap"
                            >
                                Load React Example
                            </button>
                        </div>
                    </div>
                </div>

                {/* Format Selector */}
                <FormatSelector
                    format={format}
                    detectedFormat={result.format}
                    onChange={setFormat}
                />

                {/* Editors */}
                <div className="grid lg:grid-cols-2 gap-6 h-[600px]">
                    <EditorPanel
                        title="Input"
                        value={input}
                        onChange={setInput}
                        language={result.format === 'react' ? 'typescript' : result.format}
                    />
                    <EditorPanel
                        title="TOON Output"
                        value={result.tokens}
                        language="plaintext"
                        readOnly
                        onCopy={handleCopy}
                    />
                </div>

                {/* Stats */}
                <StatsPanel
                    inputTokens={result.inputTokenEstimate}
                    outputTokens={result.tokenCount}
                />

                {/* Copy Success Toast */}
                {copySuccess && (
                    <div className="fixed bottom-6 right-6 card px-6 py-3 shadow-2xl animate-slide-up">
                        <p className="text-sm font-medium text-green-500">
                            ✓ Copied to clipboard!
                        </p>
                    </div>
                )}

                {/* Grammar Reference */}
                <div className="card p-6 space-y-4">
                    <h3 className="text-lg font-bold text-light-text-primary dark:text-dark-text-primary">
                        TOON Grammar Rules
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div className="space-y-2">
                            <h4 className="font-semibold text-light-accent-primary dark:text-dark-accent-primary">
                                Core Principles
                            </h4>
                            <ul className="space-y-1 text-light-text-secondary dark:text-dark-text-secondary list-disc list-inside">
                                <li>Uppercase keywords for semantic clarity</li>
                                <li>One semantic unit per line</li>
                                <li>Flattened hierarchy with indentation</li>
                                <li>Intent-focused, lossy abstraction</li>
                            </ul>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-semibold text-light-accent-primary dark:text-dark-accent-primary">
                                Use Cases
                            </h4>
                            <ul className="space-y-1 text-light-text-secondary dark:text-dark-text-secondary list-disc list-inside">
                                <li>LLM prompt optimization</li>
                                <li>Code summarization for AI</li>
                                <li>Semantic code search</li>
                                <li>Intent extraction for analysis</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-light-border dark:border-dark-border py-6">
                <div className="container mx-auto px-6 text-center">
                    <p className="text-sm text-light-text-tertiary dark:text-dark-text-tertiary">
                        TOONIFY is a frontend-only tool. All processing happens in your browser.
                    </p>
                </div>
            </footer>
        </div>
    );
}
