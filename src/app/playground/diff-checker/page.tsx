'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import * as Diff from 'diff';
import ToolLayout from '@/components/playground/ToolLayout';
import CopyButton from '@/components/playground/CopyButton';
import FileUploader from '@/components/playground/FileUploader';
import DiffToolbar from '@/components/playground/DiffToolbar';
import DiffSidebar from '@/components/playground/DiffSidebar';
import DiffViewer from '@/components/playground/DiffViewer';
import MergeConflictResolver from '@/components/playground/MergeConflictResolver';
import { saveToStorage, loadFromStorage, STORAGE_KEYS } from '@/lib/playground/localStorage';
import type { DiffCheckerState, MergeConflict, ViewMode, DiffOptions } from '@/lib/playground/types';
import {
    calculateDiffStats,
    detectMergeConflicts,
    resolveMergeConflict,
    generateUnifiedDiff,
    generatePatch,
    exportAsHTML,
    swapContent,
    findNextDifference,
    findPreviousDifference,
} from '@/lib/playground/diffUtils';

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

const DEFAULT_OPTIONS: DiffOptions = {
    ignoreWhitespace: false,
    caseSensitive: true,
    granularity: 'line',
    showLineNumbers: true,
    syntaxHighlight: false,
    language: 'javascript',
    collapseUnchanged: false,
};

export default function DiffCheckerPage() {
    const [state, setState] = useState<DiffCheckerState>({
        original: DEFAULT_ORIGINAL,
        modified: DEFAULT_MODIFIED,
        viewMode: 'side-by-side',
        options: DEFAULT_OPTIONS,
    });

    const [conflicts, setConflicts] = useState<MergeConflict[]>([]);
    const [currentDiffIndex, setCurrentDiffIndex] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);
    const [showMergedOutput, setShowMergedOutput] = useState(false);

    // Load from localStorage on mount (client-side only)
    useEffect(() => {
        const saved = loadFromStorage(STORAGE_KEYS.DIFF_CHECKER, {
            original: DEFAULT_ORIGINAL,
            modified: DEFAULT_MODIFIED,
            viewMode: 'side-by-side' as ViewMode,
            options: DEFAULT_OPTIONS,
        });

        setState({
            original: saved.original || DEFAULT_ORIGINAL,
            modified: saved.modified || DEFAULT_MODIFIED,
            viewMode: saved.viewMode || 'side-by-side',
            options: { ...DEFAULT_OPTIONS, ...saved.options },
        });
        setIsLoaded(true);
    }, []);

    // Save to localStorage
    useEffect(() => {
        if (isLoaded) {
            saveToStorage(STORAGE_KEYS.DIFF_CHECKER, state);
        }
    }, [state, isLoaded]);

    // Detect merge conflicts
    useEffect(() => {
        const detectedConflicts = detectMergeConflicts(state.original);
        setConflicts(detectedConflicts);
    }, [state.original]);

    // Compute diff
    const diffResult = useMemo(() => {
        let original = state.original;
        let modified = state.modified;

        if (state.options.ignoreWhitespace) {
            original = original.replace(/\s+/g, ' ').trim();
            modified = modified.replace(/\s+/g, ' ').trim();
        }

        if (!state.options.caseSensitive) {
            original = original.toLowerCase();
            modified = modified.toLowerCase();
        }

        return Diff.diffLines(original, modified);
    }, [state.original, state.modified, state.options.ignoreWhitespace, state.options.caseSensitive]);

    // Calculate statistics
    const stats = useMemo(() => {
        return calculateDiffStats(state.original, state.modified, state.options);
    }, [state.original, state.modified, state.options]);

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

    // Handlers
    const handleReset = useCallback(() => {
        setState({
            original: DEFAULT_ORIGINAL,
            modified: DEFAULT_MODIFIED,
            viewMode: 'side-by-side',
            options: DEFAULT_OPTIONS,
        });
    }, []);

    const handleSwap = useCallback(() => {
        const swapped = swapContent(state.original, state.modified);
        setState((prev) => ({
            ...prev,
            original: swapped.original,
            modified: swapped.modified,
        }));
    }, [state.original, state.modified]);

    const handleFileLoad = useCallback(
        (content: string, filename: string, side: 'original' | 'modified') => {
            setState((prev) => ({
                ...prev,
                [side]: content,
            }));
        },
        []
    );

    const handleOptionsChange = useCallback((options: Partial<DiffOptions>) => {
        setState((prev) => ({
            ...prev,
            options: { ...prev.options, ...options },
        }));
    }, []);

    const handleViewModeChange = useCallback((viewMode: ViewMode) => {
        setState((prev) => ({ ...prev, viewMode }));
    }, []);

    const handleNavigateNext = useCallback(() => {
        const next = findNextDifference(diffResult, currentDiffIndex);
        if (next !== -1) {
            setCurrentDiffIndex(next);
        }
    }, [diffResult, currentDiffIndex]);

    const handleNavigatePrev = useCallback(() => {
        const prev = findPreviousDifference(diffResult, currentDiffIndex);
        if (prev !== -1) {
            setCurrentDiffIndex(prev);
        }
    }, [diffResult, currentDiffIndex]);

    const handleExportUnified = useCallback(() => {
        const unified = generateUnifiedDiff(state.original, state.modified);
        navigator.clipboard.writeText(unified);
        // You could add a toast notification here
    }, [state.original, state.modified]);

    const handleExportPatch = useCallback(() => {
        const patch = generatePatch(state.original, state.modified);
        navigator.clipboard.writeText(patch);
    }, [state.original, state.modified]);

    const handleExportHTML = useCallback(() => {
        const html = exportAsHTML(state.original, state.modified, state.options);
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'diff-export.html';
        a.click();
        URL.revokeObjectURL(url);
    }, [state.original, state.modified, state.options]);

    const handleResolveConflict = useCallback(
        (conflictId: string, resolution: MergeConflict) => {
            setConflicts((prev) =>
                prev.map((c) => (c.id === conflictId ? resolution : c))
            );
        },
        []
    );

    const handleResolveAllConflicts = useCallback(() => {
        let resolved = state.original;
        conflicts.forEach((conflict) => {
            if (conflict.resolution) {
                resolved = resolveMergeConflict(resolved, conflict);
            }
        });
        setState((prev) => ({ ...prev, original: resolved }));
        setConflicts([]);
        setShowMergedOutput(true);
    }, [state.original, conflicts]);

    const handleAutoMerge = useCallback(() => {
        // After auto-merge resolves conflicts, apply them and show output
        handleResolveAllConflicts();
    }, [handleResolveAllConflicts]);

    const handleScrollToConflicts = useCallback(() => {
        // Scroll to merge conflicts section
        const conflictsElement = document.getElementById('merge-conflicts');
        if (conflictsElement) {
            conflictsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, []);

    const hasNext = useMemo(
        () => findNextDifference(diffResult, currentDiffIndex) !== -1,
        [diffResult, currentDiffIndex]
    );

    const hasPrev = useMemo(
        () => findPreviousDifference(diffResult, currentDiffIndex) !== -1,
        [diffResult, currentDiffIndex]
    );

    return (
        <ToolLayout
            title="Diff Checker"
            description="Compare two text blocks with advanced diff visualization and merge conflict resolution"
        >
            <div className="space-y-4">
                {/* Merge Conflicts */}
                <div id="merge-conflicts">
                    {conflicts.length > 0 && (
                        <MergeConflictResolver
                            conflicts={conflicts}
                            onResolve={handleResolveConflict}
                            onResolveAll={handleResolveAllConflicts}
                            onAutoMerge={handleAutoMerge}
                        />
                    )}
                </div>

                {/* Merged Output Display */}
                {showMergedOutput && conflicts.length === 0 && (
                    <div className="card p-4 space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                                ✅ Merged Output (Conflicts Resolved)
                            </label>
                            <button
                                onClick={() => setShowMergedOutput(false)}
                                className="text-xs text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary"
                            >
                                Hide
                            </button>
                        </div>
                        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                            <pre className="text-sm font-mono text-light-text-primary dark:text-dark-text-primary whitespace-pre-wrap">
                                {state.original}
                            </pre>
                        </div>
                    </div>
                )}

                {/* Stats Bar */}
                <div className="card p-4 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-6 text-sm flex-wrap">
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
                        <div className="flex items-center gap-2">
                            <span className="text-light-text-secondary dark:text-dark-text-secondary">
                                Similarity: <span className="font-semibold text-blue-500">{stats.similarity}%</span>
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

                {/* Toolbar */}
                <DiffToolbar
                    viewMode={state.viewMode}
                    onViewModeChange={handleViewModeChange}
                    onNavigateNext={handleNavigateNext}
                    onNavigatePrev={handleNavigatePrev}
                    onSwap={handleSwap}
                    onExportUnified={handleExportUnified}
                    onExportHTML={handleExportHTML}
                    onExportPatch={handleExportPatch}
                    hasNext={hasNext}
                    hasPrev={hasPrev}
                    conflictCount={conflicts.length}
                    onMergeConflicts={handleScrollToConflicts}
                />

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <DiffSidebar
                            options={state.options}
                            onOptionsChange={handleOptionsChange}
                        />
                    </div>

                    {/* Input & Output */}
                    <div className="lg:col-span-3 space-y-4">
                        {/* Input Textareas */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div className="card p-4 space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                                        Original
                                    </label>
                                    <FileUploader
                                        onFileLoad={(content, filename) =>
                                            handleFileLoad(content, filename, 'original')
                                        }
                                        label="Upload"
                                    />
                                </div>
                                <textarea
                                    value={state.original}
                                    onChange={(e) =>
                                        setState((prev) => ({
                                            ...prev,
                                            original: e.target.value,
                                        }))
                                    }
                                    className="w-full h-[300px] px-3 py-2 bg-light-elevated dark:bg-dark-elevated border border-light-border dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-light-accent-primary dark:focus:ring-dark-accent-primary text-light-text-primary dark:text-dark-text-primary font-mono text-sm resize-none"
                                    placeholder="Enter original text"
                                />
                            </div>

                            <div className="card p-4 space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                                        Modified
                                    </label>
                                    <FileUploader
                                        onFileLoad={(content, filename) =>
                                            handleFileLoad(content, filename, 'modified')
                                        }
                                        label="Upload"
                                    />
                                </div>
                                <textarea
                                    value={state.modified}
                                    onChange={(e) =>
                                        setState((prev) => ({
                                            ...prev,
                                            modified: e.target.value,
                                        }))
                                    }
                                    className="w-full h-[300px] px-3 py-2 bg-light-elevated dark:bg-dark-elevated border border-light-border dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-light-accent-primary dark:focus:ring-dark-accent-primary text-light-text-primary dark:text-dark-text-primary font-mono text-sm resize-none"
                                    placeholder="Enter modified text"
                                />
                            </div>
                        </div>

                        {/* Diff Output */}
                        <DiffViewer
                            original={state.original}
                            modified={state.modified}
                            viewMode={state.viewMode}
                            options={state.options}
                        />
                    </div>
                </div>
            </div>
        </ToolLayout>
    );
}
