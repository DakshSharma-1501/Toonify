'use client';

import { useState } from 'react';
import { GitMerge, Check, X } from 'lucide-react';
import type { MergeConflict } from '@/lib/playground/types';

interface MergeConflictResolverProps {
    conflicts: MergeConflict[];
    onResolve: (conflictId: string, resolution: MergeConflict) => void;
    onResolveAll: () => void;
    onAutoMerge?: () => void;
}

export default function MergeConflictResolver({
    conflicts,
    onResolve,
    onResolveAll,
    onAutoMerge,
}: MergeConflictResolverProps) {
    const [customResolutions, setCustomResolutions] = useState<{
        [key: string]: string;
    }>({});

    if (conflicts.length === 0) {
        return null;
    }

    const handleResolve = (
        conflict: MergeConflict,
        resolution: 'left' | 'right' | 'both' | 'custom'
    ) => {
        let resolved = '';

        if (resolution === 'left') {
            resolved = conflict.original;
        } else if (resolution === 'right') {
            resolved = conflict.modified;
        } else if (resolution === 'both') {
            resolved = `${conflict.original}\n${conflict.modified}`;
        } else if (resolution === 'custom') {
            resolved = customResolutions[conflict.id] || '';
        }

        onResolve(conflict.id, {
            ...conflict,
            resolution,
            resolved,
        });
    };

    const handleAutoMerge = () => {
        // Intelligent auto-merge: prefer modified (right) for most cases
        // This simulates accepting incoming changes in a merge scenario
        conflicts.forEach((conflict) => {
            if (!conflict.resolution) {
                handleResolve(conflict, 'right');
            }
        });
        // Trigger the callback after a short delay to allow state updates
        setTimeout(() => {
            if (onAutoMerge) {
                onAutoMerge();
            }
        }, 100);
    };

    return (
        <div className="card p-4 space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <GitMerge className="w-5 h-5 text-yellow-500" />
                    <h3 className="font-semibold text-light-text-primary dark:text-dark-text-primary">
                        Merge Conflicts Detected
                    </h3>
                    <span className="px-2 py-1 text-xs rounded-full bg-yellow-500/20 text-yellow-700 dark:text-yellow-300">
                        {conflicts.length} conflict{conflicts.length !== 1 ? 's' : ''}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleAutoMerge}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm font-medium"
                        title="Automatically resolve all conflicts by accepting modified (right) version"
                    >
                        <GitMerge className="w-4 h-4" />
                        Auto Merge
                    </button>
                    {conflicts.every((c) => c.resolution) && (
                        <button
                            onClick={onResolveAll}
                            className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors text-sm font-medium"
                        >
                            <Check className="w-4 h-4" />
                            Apply All Resolutions
                        </button>
                    )}
                </div>
            </div>

            <div className="space-y-4">
                {conflicts.map((conflict, index) => (
                    <div
                        key={conflict.id}
                        className="border border-yellow-500/30 rounded-lg p-4 bg-yellow-500/5"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                                Conflict #{index + 1} (Lines {conflict.startLine + 1}-
                                {conflict.endLine + 1})
                            </span>
                            {conflict.resolution && (
                                <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                                    <Check className="w-3 h-3" />
                                    Resolved
                                </span>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-3">
                            {/* Original (Left) */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary">
                                        Original (Left)
                                    </label>
                                    <button
                                        onClick={() => handleResolve(conflict, 'left')}
                                        className={`px-2 py-1 text-xs rounded transition-colors ${conflict.resolution === 'left'
                                            ? 'bg-green-500 text-white'
                                            : 'bg-light-elevated dark:bg-dark-elevated hover:bg-light-border dark:hover:bg-dark-border'
                                            }`}
                                    >
                                        Accept
                                    </button>
                                </div>
                                <div className="bg-red-500/10 border border-red-500/30 rounded p-2 font-mono text-xs text-red-700 dark:text-red-300 whitespace-pre-wrap max-h-32 overflow-auto">
                                    {conflict.original}
                                </div>
                            </div>

                            {/* Modified (Right) */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary">
                                        Modified (Right)
                                    </label>
                                    <button
                                        onClick={() => handleResolve(conflict, 'right')}
                                        className={`px-2 py-1 text-xs rounded transition-colors ${conflict.resolution === 'right'
                                            ? 'bg-green-500 text-white'
                                            : 'bg-light-elevated dark:bg-dark-elevated hover:bg-light-border dark:hover:bg-dark-border'
                                            }`}
                                    >
                                        Accept
                                    </button>
                                </div>
                                <div className="bg-green-500/10 border border-green-500/30 rounded p-2 font-mono text-xs text-green-700 dark:text-green-300 whitespace-pre-wrap max-h-32 overflow-auto">
                                    {conflict.modified}
                                </div>
                            </div>
                        </div>

                        {/* Additional Options */}
                        <div className="flex items-center gap-2 pt-3 border-t border-light-border dark:border-dark-border">
                            <button
                                onClick={() => handleResolve(conflict, 'both')}
                                className={`px-3 py-1.5 text-xs rounded transition-colors ${conflict.resolution === 'both'
                                    ? 'bg-green-500 text-white'
                                    : 'bg-light-elevated dark:bg-dark-elevated hover:bg-light-border dark:hover:bg-dark-border'
                                    }`}
                            >
                                Accept Both
                            </button>

                            <div className="flex-1 flex items-center gap-2">
                                <input
                                    type="text"
                                    placeholder="Custom resolution..."
                                    value={customResolutions[conflict.id] || ''}
                                    onChange={(e) =>
                                        setCustomResolutions({
                                            ...customResolutions,
                                            [conflict.id]: e.target.value,
                                        })
                                    }
                                    className="flex-1 px-3 py-1.5 bg-light-elevated dark:bg-dark-elevated border border-light-border dark:border-dark-border rounded text-xs focus:outline-none focus:ring-2 focus:ring-light-accent-primary dark:focus:ring-dark-accent-primary"
                                />
                                <button
                                    onClick={() => handleResolve(conflict, 'custom')}
                                    disabled={!customResolutions[conflict.id]}
                                    className={`px-3 py-1.5 text-xs rounded transition-colors ${conflict.resolution === 'custom'
                                        ? 'bg-green-500 text-white'
                                        : 'bg-light-elevated dark:bg-dark-elevated hover:bg-light-border dark:hover:bg-dark-border disabled:opacity-50 disabled:cursor-not-allowed'
                                        }`}
                                >
                                    Use Custom
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
