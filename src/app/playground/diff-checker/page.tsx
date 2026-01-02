'use client';

import { useState, useEffect, useMemo } from 'react';
import * as Diff from 'diff';
import ToolLayout from '@/components/playground/ToolLayout';
import CopyButton from '@/components/playground/CopyButton';
import { saveToStorage, loadFromStorage, STORAGE_KEYS } from '@/lib/playground/localStorage';
import type { DiffCheckerState } from '@/lib/playground/types';

const DEFAULT_ORIGINAL = `function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i].price;
  }
  return total;
}`;

const DEFAULT_MODIFIED = `function calculateTotal(items) {
  return items.reduce((total, item) => {
    return total + item.price;
  }, 0);
}`;

export default function DiffCheckerPage() {
    const [state, setState] = useState<DiffCheckerState>(() =>
        loadFromStorage(STORAGE_KEYS.DIFF_CHECKER, {
            original: DEFAULT_ORIGINAL,
            modified: DEFAULT_MODIFIED,
        })
    );

    // Save to localStorage
    useEffect(() => {
        saveToStorage(STORAGE_KEYS.DIFF_CHECKER, state);
    }, [state]);

    // Compute diff
    const diffResult = useMemo(() => {
        const changes = Diff.diffLines(state.original, state.modified);
        return changes;
    }, [state.original, state.modified]);

    // Generate diff text for copying
    const diffText = useMemo(() => {
        return diffResult
            .map((change) => {
                const prefix = change.added ? '+ ' : change.removed ? '- ' : '  ';
                return change.value
                    .split('\n')
                    .filter((line) => line)
                    .map((line) => prefix + line)
                    .join('\n');
            })
            .join('\n');
    }, [diffResult]);

    const handleReset = () => {
        setState({
            original: DEFAULT_ORIGINAL,
            modified: DEFAULT_MODIFIED,
        });
    };

    const stats = useMemo(() => {
        const added = diffResult.filter((c) => c.added).reduce((sum, c) => sum + (c.count || 0), 0);
        const removed = diffResult.filter((c) => c.removed).reduce((sum, c) => sum + (c.count || 0), 0);
        const unchanged = diffResult.filter((c) => !c.added && !c.removed).reduce((sum, c) => sum + (c.count || 0), 0);
        return { added, removed, unchanged };
    }, [diffResult]);

    return (
        <ToolLayout
            title="Diff Checker"
            description="Compare two text blocks and see differences highlighted"
        >
            <div className="space-y-4">
                {/* Stats Bar */}
                <div className="card p-4 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <span className="text-light-text-secondary dark:text-dark-text-secondary">
                                Added: <span className="font-semibold text-green-500">{stats.added}</span> lines
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <span className="text-light-text-secondary dark:text-dark-text-secondary">
                                Removed: <span className="font-semibold text-red-500">{stats.removed}</span> lines
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                            <span className="text-light-text-secondary dark:text-dark-text-secondary">
                                Unchanged: <span className="font-semibold">{stats.unchanged}</span> lines
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={handleReset} className="btn-secondary">
                            Reset
                        </button>
                        <CopyButton text={diffText} />
                    </div>
                </div>

                {/* Input Textareas */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="card p-4 space-y-2">
                        <label className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                            Original
                        </label>
                        <textarea
                            value={state.original}
                            onChange={(e) => setState((prev) => ({ ...prev, original: e.target.value }))}
                            className="w-full h-[300px] px-3 py-2 bg-light-elevated dark:bg-dark-elevated border border-light-border dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-light-accent-primary dark:focus:ring-dark-accent-primary text-light-text-primary dark:text-dark-text-primary font-mono text-sm resize-none"
                            placeholder="Enter original text"
                        />
                    </div>

                    <div className="card p-4 space-y-2">
                        <label className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                            Modified
                        </label>
                        <textarea
                            value={state.modified}
                            onChange={(e) => setState((prev) => ({ ...prev, modified: e.target.value }))}
                            className="w-full h-[300px] px-3 py-2 bg-light-elevated dark:bg-dark-elevated border border-light-border dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-light-accent-primary dark:focus:ring-dark-accent-primary text-light-text-primary dark:text-dark-text-primary font-mono text-sm resize-none"
                            placeholder="Enter modified text"
                        />
                    </div>
                </div>

                {/* Diff Output */}
                <div className="card p-4 space-y-2">
                    <label className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                        Diff Output
                    </label>
                    <div className="bg-light-elevated dark:bg-dark-elevated border border-light-border dark:border-dark-border rounded-lg overflow-hidden">
                        <div className="max-h-[400px] overflow-auto font-mono text-sm">
                            {diffResult.map((change, index) => {
                                const lines = change.value.split('\n').filter((line) => line);

                                return lines.map((line, lineIndex) => {
                                    let bgColor = '';
                                    let textColor = '';
                                    let prefix = '  ';

                                    if (change.added) {
                                        bgColor = 'bg-green-500/10 dark:bg-green-500/20';
                                        textColor = 'text-green-700 dark:text-green-300';
                                        prefix = '+ ';
                                    } else if (change.removed) {
                                        bgColor = 'bg-red-500/10 dark:bg-red-500/20';
                                        textColor = 'text-red-700 dark:text-red-300';
                                        prefix = '- ';
                                    } else {
                                        textColor = 'text-light-text-secondary dark:text-dark-text-secondary';
                                    }

                                    return (
                                        <div
                                            key={`${index}-${lineIndex}`}
                                            className={`px-4 py-1 ${bgColor} ${textColor} whitespace-pre`}
                                        >
                                            <span className="select-none opacity-50">{prefix}</span>
                                            {line}
                                        </div>
                                    );
                                });
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </ToolLayout>
    );
}
