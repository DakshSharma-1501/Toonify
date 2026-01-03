'use client';

import {
    ChevronUp,
    ChevronDown,
    ArrowLeftRight,
    Download,
    FileText,
    Code,
    GitMerge,
} from 'lucide-react';
import type { ViewMode } from '@/lib/playground/types';

interface DiffToolbarProps {
    viewMode: ViewMode;
    onViewModeChange: (mode: ViewMode) => void;
    onNavigateNext: () => void;
    onNavigatePrev: () => void;
    onSwap: () => void;
    onExportUnified: () => void;
    onExportHTML: () => void;
    onExportPatch: () => void;
    hasNext: boolean;
    hasPrev: boolean;
    conflictCount?: number;
    onMergeConflicts?: () => void;
}

export default function DiffToolbar({
    viewMode,
    onViewModeChange,
    onNavigateNext,
    onNavigatePrev,
    onSwap,
    onExportUnified,
    onExportHTML,
    onExportPatch,
    hasNext,
    hasPrev,
    conflictCount = 0,
    onMergeConflicts,
}: DiffToolbarProps) {
    return (
        <div className="flex flex-wrap items-center justify-between gap-4">
            {/* View Mode Selector */}
            <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary">
                    View:
                </span>
                <div className="flex items-center gap-1 p-1 bg-light-elevated dark:bg-dark-elevated rounded-lg border border-light-border dark:border-dark-border">
                    <button
                        onClick={() => onViewModeChange('side-by-side')}
                        className={`px-3 py-1 text-xs rounded transition-all ${viewMode === 'side-by-side'
                            ? 'bg-light-accent-primary dark:bg-dark-accent-primary text-white'
                            : 'text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-border/50 dark:hover:bg-dark-border/50'
                            }`}
                    >
                        Side by Side
                    </button>
                    <button
                        onClick={() => onViewModeChange('unified')}
                        className={`px-3 py-1 text-xs rounded transition-all ${viewMode === 'unified'
                            ? 'bg-light-accent-primary dark:bg-dark-accent-primary text-white'
                            : 'text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-border/50 dark:hover:bg-dark-border/50'
                            }`}
                    >
                        Unified
                    </button>
                    <button
                        onClick={() => onViewModeChange('split')}
                        className={`px-3 py-1 text-xs rounded transition-all ${viewMode === 'split'
                            ? 'bg-light-accent-primary dark:bg-dark-accent-primary text-white'
                            : 'text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-border/50 dark:hover:bg-dark-border/50'
                            }`}
                    >
                        Split
                    </button>
                </div>
            </div>

            {/* Navigation & Actions */}
            <div className="flex items-center gap-2">
                {/* Navigation */}
                <div className="flex items-center gap-1">
                    <button
                        onClick={onNavigatePrev}
                        disabled={!hasPrev}
                        className="p-2 rounded-lg bg-light-elevated dark:bg-dark-elevated border border-light-border dark:border-dark-border hover:bg-light-border/50 dark:hover:bg-dark-border/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        title="Previous difference"
                    >
                        <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                        onClick={onNavigateNext}
                        disabled={!hasNext}
                        className="p-2 rounded-lg bg-light-elevated dark:bg-dark-elevated border border-light-border dark:border-dark-border hover:bg-light-border/50 dark:hover:bg-dark-border/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        title="Next difference"
                    >
                        <ChevronDown className="w-4 h-4" />
                    </button>
                </div>

                {/* Swap */}
                <button
                    onClick={onSwap}
                    className="p-2 rounded-lg bg-light-elevated dark:bg-dark-elevated border border-light-border dark:border-dark-border hover:bg-light-border/50 dark:hover:bg-dark-border/50 transition-all"
                    title="Swap original and modified"
                >
                    <ArrowLeftRight className="w-4 h-4" />
                </button>

                {/* Merge Conflicts Button */}
                {conflictCount > 0 && onMergeConflicts && (
                    <button
                        onClick={onMergeConflicts}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white transition-all text-sm font-medium"
                        title="Resolve merge conflicts"
                    >
                        <GitMerge className="w-4 h-4" />
                        Merge Conflicts ({conflictCount})
                    </button>
                )}

                {/* Export Dropdown */}
                <div className="relative group">
                    <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-light-elevated dark:bg-dark-elevated border border-light-border dark:border-dark-border hover:bg-light-border/50 dark:hover:bg-dark-border/50 transition-all text-sm">
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                    <div className="absolute right-0 top-full mt-1 w-48 bg-light-elevated dark:bg-dark-elevated border border-light-border dark:border-dark-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                        <button
                            onClick={onExportUnified}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-left hover:bg-light-border/50 dark:hover:bg-dark-border/50 first:rounded-t-lg"
                        >
                            <FileText className="w-4 h-4" />
                            Unified Diff
                        </button>
                        <button
                            onClick={onExportPatch}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-left hover:bg-light-border/50 dark:hover:bg-dark-border/50"
                        >
                            <Code className="w-4 h-4" />
                            Patch File
                        </button>
                        <button
                            onClick={onExportHTML}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-left hover:bg-light-border/50 dark:hover:bg-dark-border/50 last:rounded-b-lg"
                        >
                            <FileText className="w-4 h-4" />
                            HTML
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
