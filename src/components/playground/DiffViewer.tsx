'use client';

import { useMemo } from 'react';
import * as Diff from 'diff';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { ViewMode, DiffOptions } from '@/lib/playground/types';
import { getCharacterDiff, getWordDiff } from '@/lib/playground/diffUtils';

interface DiffViewerProps {
    original: string;
    modified: string;
    viewMode: ViewMode;
    options: DiffOptions;
}

export default function DiffViewer({
    original,
    modified,
    viewMode,
    options,
}: DiffViewerProps) {
    // Prepare text based on options
    const { processedOriginal, processedModified } = useMemo(() => {
        let orig = original;
        let mod = modified;

        if (options.ignoreWhitespace) {
            orig = orig.replace(/\s+/g, ' ').trim();
            mod = mod.replace(/\s+/g, ' ').trim();
        }

        if (!options.caseSensitive) {
            orig = orig.toLowerCase();
            mod = mod.toLowerCase();
        }

        return { processedOriginal: orig, processedModified: mod };
    }, [original, modified, options.ignoreWhitespace, options.caseSensitive]);

    // Compute diff
    const diffResult = useMemo(() => {
        return Diff.diffLines(processedOriginal, processedModified);
    }, [processedOriginal, processedModified]);

    if (viewMode === 'side-by-side') {
        return (
            <SideBySideView
                diffResult={diffResult}
                original={original}
                modified={modified}
                options={options}
            />
        );
    } else if (viewMode === 'unified') {
        return <UnifiedView diffResult={diffResult} options={options} />;
    } else {
        return (
            <SplitView
                diffResult={diffResult}
                original={original}
                modified={modified}
                options={options}
            />
        );
    }
}

// Side-by-side view component
function SideBySideView({
    diffResult,
    original,
    modified,
    options,
}: {
    diffResult: Diff.Change[];
    original: string;
    modified: string;
    options: DiffOptions;
}) {
    const originalLines = original.split('\n');
    const modifiedLines = modified.split('\n');

    return (
        <div className="grid grid-cols-2 gap-4">
            {/* Original */}
            <div className="card p-4 space-y-2">
                <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                        Original
                    </label>
                    <span className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                        {originalLines.length} lines
                    </span>
                </div>
                <div className="bg-light-elevated dark:bg-dark-elevated border border-light-border dark:border-dark-border rounded-lg overflow-hidden">
                    <div className="max-h-[600px] overflow-auto font-mono text-sm">
                        {renderSideBySideLines(diffResult, 'original', options)}
                    </div>
                </div>
            </div>

            {/* Modified */}
            <div className="card p-4 space-y-2">
                <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                        Modified
                    </label>
                    <span className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                        {modifiedLines.length} lines
                    </span>
                </div>
                <div className="bg-light-elevated dark:bg-dark-elevated border border-light-border dark:border-dark-border rounded-lg overflow-hidden">
                    <div className="max-h-[600px] overflow-auto font-mono text-sm">
                        {renderSideBySideLines(diffResult, 'modified', options)}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Unified view component
function UnifiedView({
    diffResult,
    options,
}: {
    diffResult: Diff.Change[];
    options: DiffOptions;
}) {
    let lineNumber = 1;

    return (
        <div className="card p-4 space-y-2">
            <label className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                Unified Diff
            </label>
            <div className="bg-light-elevated dark:bg-dark-elevated border border-light-border dark:border-dark-border rounded-lg overflow-hidden">
                <div className="max-h-[600px] overflow-auto font-mono text-sm">
                    {diffResult.map((change, index) => {
                        const lines = change.value.split('\n').filter((line) => line);

                        return lines.map((line, lineIndex) => {
                            let bgColor = '';
                            let textColor = '';
                            let prefix = '  ';
                            let borderLeft = '';

                            if (change.added) {
                                bgColor = 'bg-green-500/10 dark:bg-green-500/20';
                                textColor = 'text-green-700 dark:text-green-300';
                                borderLeft = 'border-l-4 border-green-500';
                                prefix = '+ ';
                            } else if (change.removed) {
                                bgColor = 'bg-red-500/10 dark:bg-red-500/20';
                                textColor = 'text-red-700 dark:text-red-300';
                                borderLeft = 'border-l-4 border-red-500';
                                prefix = '- ';
                            } else {
                                textColor =
                                    'text-light-text-secondary dark:text-dark-text-secondary';
                            }

                            const currentLine = lineNumber;
                            if (!change.added && !change.removed) {
                                lineNumber++;
                            }

                            return (
                                <div
                                    key={`${index}-${lineIndex}`}
                                    className={`px-4 py-1 ${bgColor} ${textColor} ${borderLeft} whitespace-pre flex items-start gap-3`}
                                >
                                    {options.showLineNumbers && (
                                        <span className="select-none opacity-50 w-12 text-right flex-shrink-0">
                                            {!change.added && !change.removed
                                                ? currentLine
                                                : ''}
                                        </span>
                                    )}
                                    <span className="select-none opacity-50">{prefix}</span>
                                    <span className="flex-1">
                                        {renderLineWithHighlight(line, change, options)}
                                    </span>
                                </div>
                            );
                        });
                    })}
                </div>
            </div>
        </div>
    );
}

// Split view with character-level highlighting
function SplitView({
    diffResult,
    original,
    modified,
    options,
}: {
    diffResult: Diff.Change[];
    original: string;
    modified: string;
    options: DiffOptions;
}) {
    const originalLines = original.split('\n');
    const modifiedLines = modified.split('\n');

    // Build line-by-line comparison
    const comparison = buildLineComparison(diffResult);

    return (
        <div className="card p-4 space-y-2">
            <label className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                Split View (Character-level highlighting)
            </label>
            <div className="bg-light-elevated dark:bg-dark-elevated border border-light-border dark:border-dark-border rounded-lg overflow-hidden">
                <div className="max-h-[600px] overflow-auto">
                    <div className="grid grid-cols-2 divide-x divide-light-border dark:divide-dark-border">
                        {/* Original side */}
                        <div className="font-mono text-sm">
                            {comparison.map((item, idx) => (
                                <div
                                    key={`orig-${idx}`}
                                    className={`px-4 py-1 ${item.type === 'removed'
                                            ? 'bg-red-500/10 dark:bg-red-500/20'
                                            : item.type === 'modified'
                                                ? 'bg-yellow-500/10 dark:bg-yellow-500/20'
                                                : ''
                                        }`}
                                >
                                    {options.showLineNumbers && (
                                        <span className="select-none opacity-50 mr-3 inline-block w-12 text-right">
                                            {item.originalLine}
                                        </span>
                                    )}
                                    {item.originalContent && (
                                        <span
                                            className={
                                                item.type === 'removed' ||
                                                    item.type === 'modified'
                                                    ? 'text-red-700 dark:text-red-300'
                                                    : 'text-light-text-secondary dark:text-dark-text-secondary'
                                            }
                                        >
                                            {renderCharacterDiff(
                                                item.originalContent,
                                                item.modifiedContent || '',
                                                'removed',
                                                options
                                            )}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Modified side */}
                        <div className="font-mono text-sm">
                            {comparison.map((item, idx) => (
                                <div
                                    key={`mod-${idx}`}
                                    className={`px-4 py-1 ${item.type === 'added'
                                            ? 'bg-green-500/10 dark:bg-green-500/20'
                                            : item.type === 'modified'
                                                ? 'bg-yellow-500/10 dark:bg-yellow-500/20'
                                                : ''
                                        }`}
                                >
                                    {options.showLineNumbers && (
                                        <span className="select-none opacity-50 mr-3 inline-block w-12 text-right">
                                            {item.modifiedLine}
                                        </span>
                                    )}
                                    {item.modifiedContent && (
                                        <span
                                            className={
                                                item.type === 'added' ||
                                                    item.type === 'modified'
                                                    ? 'text-green-700 dark:text-green-300'
                                                    : 'text-light-text-secondary dark:text-dark-text-secondary'
                                            }
                                        >
                                            {renderCharacterDiff(
                                                item.originalContent || '',
                                                item.modifiedContent,
                                                'added',
                                                options
                                            )}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Helper functions
function renderSideBySideLines(
    diffResult: Diff.Change[],
    side: 'original' | 'modified',
    options: DiffOptions
) {
    let lineNumber = 1;

    return diffResult.map((change, index) => {
        const shouldShow =
            side === 'original' ? !change.added : !change.removed;

        if (!shouldShow) return null;

        const lines = change.value.split('\n').filter((line) => line);

        return lines.map((line, lineIndex) => {
            let bgColor = '';
            let textColor = '';

            if (change.added && side === 'modified') {
                bgColor = 'bg-green-500/10 dark:bg-green-500/20';
                textColor = 'text-green-700 dark:text-green-300';
            } else if (change.removed && side === 'original') {
                bgColor = 'bg-red-500/10 dark:bg-red-500/20';
                textColor = 'text-red-700 dark:text-red-300';
            } else {
                textColor = 'text-light-text-secondary dark:text-dark-text-secondary';
            }

            const currentLine = lineNumber++;

            return (
                <div
                    key={`${index}-${lineIndex}`}
                    className={`px-4 py-1 ${bgColor} ${textColor} whitespace-pre flex items-start gap-3`}
                >
                    {options.showLineNumbers && (
                        <span className="select-none opacity-50 w-12 text-right flex-shrink-0">
                            {currentLine}
                        </span>
                    )}
                    <span className="flex-1">
                        {renderLineWithHighlight(line, change, options)}
                    </span>
                </div>
            );
        });
    });
}

function renderLineWithHighlight(
    line: string,
    change: Diff.Change,
    options: DiffOptions
) {
    if (!options.syntaxHighlight || (!change.added && !change.removed)) {
        return line;
    }

    // For now, just return the line - syntax highlighting can be added later
    return line;
}

function renderCharacterDiff(
    original: string,
    modified: string,
    side: 'removed' | 'added',
    options: DiffOptions
) {
    if (options.granularity === 'line') {
        return side === 'removed' ? original : modified;
    }

    const diff =
        options.granularity === 'character'
            ? getCharacterDiff(original, modified)
            : getWordDiff(original, modified);

    return diff.map((part, idx) => {
        if (side === 'removed' && part.removed) {
            return (
                <span key={idx} className="bg-red-600/40 dark:bg-red-600/40">
                    {part.value}
                </span>
            );
        } else if (side === 'added' && part.added) {
            return (
                <span key={idx} className="bg-green-600/40 dark:bg-green-600/40">
                    {part.value}
                </span>
            );
        } else if (!part.added && !part.removed) {
            return <span key={idx}>{part.value}</span>;
        }
        return null;
    });
}

function buildLineComparison(diffResult: Diff.Change[]) {
    const comparison: Array<{
        type: 'added' | 'removed' | 'modified' | 'unchanged';
        originalLine?: number;
        modifiedLine?: number;
        originalContent?: string;
        modifiedContent?: string;
    }> = [];

    let originalLineNum = 1;
    let modifiedLineNum = 1;

    diffResult.forEach((change) => {
        const lines = change.value.split('\n').filter((l) => l);

        lines.forEach((line) => {
            if (change.added) {
                comparison.push({
                    type: 'added',
                    modifiedLine: modifiedLineNum++,
                    modifiedContent: line,
                });
            } else if (change.removed) {
                comparison.push({
                    type: 'removed',
                    originalLine: originalLineNum++,
                    originalContent: line,
                });
            } else {
                comparison.push({
                    type: 'unchanged',
                    originalLine: originalLineNum++,
                    modifiedLine: modifiedLineNum++,
                    originalContent: line,
                    modifiedContent: line,
                });
            }
        });
    });

    return comparison;
}
