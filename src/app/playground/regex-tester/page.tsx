'use client';

import { useState, useEffect, useMemo } from 'react';
import ToolLayout from '@/components/playground/ToolLayout';
import CopyButton from '@/components/playground/CopyButton';
import { AlertCircle, Hash } from 'lucide-react';
import { saveToStorage, loadFromStorage, STORAGE_KEYS } from '@/lib/playground/localStorage';
import type { RegexTesterState } from '@/lib/playground/types';

const DEFAULT_PATTERN = '\\b\\w+@\\w+\\.\\w+\\b';
const DEFAULT_TEST_STRING = `Contact us at:
support@example.com
sales@company.org
info@test.co.uk

Invalid emails:
@invalid.com
test@
incomplete@domain`;

export default function RegexTesterPage() {
    const [state, setState] = useState<RegexTesterState>(() =>
        loadFromStorage(STORAGE_KEYS.REGEX_TESTER, {
            pattern: DEFAULT_PATTERN,
            flags: { g: true, i: false, m: false, s: false, u: false, y: false },
            testString: DEFAULT_TEST_STRING,
        })
    );
    const [error, setError] = useState<string | null>(null);

    // Save to localStorage
    useEffect(() => {
        saveToStorage(STORAGE_KEYS.REGEX_TESTER, state);
    }, [state]);

    // Build regex and find matches
    const { regex, matches, highlightedText } = useMemo(() => {
        try {
            const flagString = Object.entries(state.flags)
                .filter(([_, enabled]) => enabled)
                .map(([flag]) => flag)
                .join('');

            const regex = new RegExp(state.pattern, flagString);
            setError(null);

            // Find all matches
            const matches: Array<{ value: string; index: number }> = [];
            let match;

            if (state.flags.g) {
                while ((match = regex.exec(state.testString)) !== null) {
                    matches.push({ value: match[0], index: match.index });
                }
            } else {
                match = regex.exec(state.testString);
                if (match) {
                    matches.push({ value: match[0], index: match.index });
                }
            }

            // Create highlighted text
            let highlighted = '';
            let lastIndex = 0;

            matches.forEach((match, i) => {
                highlighted += escapeHtml(state.testString.slice(lastIndex, match.index));
                highlighted += `<mark class="bg-yellow-400/30 dark:bg-yellow-500/30 text-yellow-900 dark:text-yellow-200 px-1 rounded">${escapeHtml(
                    match.value
                )}</mark>`;
                lastIndex = match.index + match.value.length;
            });
            highlighted += escapeHtml(state.testString.slice(lastIndex));

            return { regex, matches, highlightedText: highlighted };
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Invalid regex pattern');
            return { regex: null, matches: [], highlightedText: escapeHtml(state.testString) };
        }
    }, [state.pattern, state.flags, state.testString]);

    const handleFlagToggle = (flag: keyof RegexTesterState['flags']) => {
        setState((prev) => ({
            ...prev,
            flags: { ...prev.flags, [flag]: !prev.flags[flag] },
        }));
    };

    const handleReset = () => {
        setState({
            pattern: DEFAULT_PATTERN,
            flags: { g: true, i: false, m: false, s: false, u: false, y: false },
            testString: DEFAULT_TEST_STRING,
        });
    };

    return (
        <ToolLayout
            title="Regex Tester"
            description="Test regular expressions with real-time match highlighting"
        >
            <div className="space-y-4">
                {/* Regex Input */}
                <div className="card p-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
                            Regular Expression Pattern
                        </label>
                        <div className="flex gap-2">
                            <div className="flex-1 relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-light-text-tertiary dark:text-dark-text-tertiary">
                                    /
                                </span>
                                <input
                                    type="text"
                                    value={state.pattern}
                                    onChange={(e) => setState((prev) => ({ ...prev, pattern: e.target.value }))}
                                    className="w-full px-8 py-2 bg-light-elevated dark:bg-dark-elevated border border-light-border dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-light-accent-primary dark:focus:ring-dark-accent-primary text-light-text-primary dark:text-dark-text-primary font-mono"
                                    placeholder="Enter regex pattern"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-light-text-tertiary dark:text-dark-text-tertiary">
                                    /
                                </span>
                            </div>
                            <CopyButton text={state.pattern} />
                        </div>
                        {error && (
                            <div className="mt-2 flex items-start gap-2 text-sm text-red-500">
                                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}
                    </div>

                    {/* Flags */}
                    <div>
                        <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
                            Flags
                        </label>
                        <div className="flex flex-wrap gap-3">
                            {Object.entries(state.flags).map(([flag, enabled]) => (
                                <label
                                    key={flag}
                                    className="flex items-center gap-2 cursor-pointer group"
                                >
                                    <input
                                        type="checkbox"
                                        checked={enabled}
                                        onChange={() => handleFlagToggle(flag as keyof RegexTesterState['flags'])}
                                        className="w-4 h-4 rounded border-light-border dark:border-dark-border text-light-accent-primary dark:text-dark-accent-primary focus:ring-2 focus:ring-light-accent-primary dark:focus:ring-dark-accent-primary"
                                    />
                                    <span className="text-sm font-mono text-light-text-secondary dark:text-dark-text-secondary group-hover:text-light-text-primary dark:group-hover:text-dark-text-primary">
                                        {flag}
                                    </span>
                                    <span className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                                        {getFlagDescription(flag)}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Match Count */}
                    <div className="flex items-center gap-2 text-sm">
                        <Hash className="w-4 h-4 text-light-accent-primary dark:text-dark-accent-primary" />
                        <span className="font-medium text-light-text-primary dark:text-dark-text-primary">
                            {matches.length} {matches.length === 1 ? 'match' : 'matches'} found
                        </span>
                    </div>
                </div>

                {/* Test String */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Input */}
                    <div className="card p-4 space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                                Test String
                            </label>
                            <button onClick={handleReset} className="btn-secondary text-xs">
                                Reset
                            </button>
                        </div>
                        <textarea
                            value={state.testString}
                            onChange={(e) => setState((prev) => ({ ...prev, testString: e.target.value }))}
                            className="w-full h-[400px] px-3 py-2 bg-light-elevated dark:bg-dark-elevated border border-light-border dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-light-accent-primary dark:focus:ring-dark-accent-primary text-light-text-primary dark:text-dark-text-primary font-mono text-sm resize-none"
                            placeholder="Enter text to test against the regex pattern"
                        />
                    </div>

                    {/* Highlighted Output */}
                    <div className="card p-4 space-y-2">
                        <label className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                            Matches Highlighted
                        </label>
                        <div
                            className="w-full h-[400px] px-3 py-2 bg-light-elevated dark:bg-dark-elevated border border-light-border dark:border-dark-border rounded-lg overflow-auto text-light-text-primary dark:text-dark-text-primary font-mono text-sm whitespace-pre-wrap break-words"
                            dangerouslySetInnerHTML={{ __html: highlightedText }}
                        />
                    </div>
                </div>
            </div>
        </ToolLayout>
    );
}

function getFlagDescription(flag: string): string {
    const descriptions: Record<string, string> = {
        g: 'global',
        i: 'case-insensitive',
        m: 'multiline',
        s: 'dotAll',
        u: 'unicode',
        y: 'sticky',
    };
    return descriptions[flag] || '';
}

function escapeHtml(text: string): string {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
