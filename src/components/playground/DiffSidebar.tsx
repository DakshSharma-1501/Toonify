'use client';

import { Settings } from 'lucide-react';
import type { DiffOptions } from '@/lib/playground/types';

interface DiffSidebarProps {
    options: DiffOptions;
    onOptionsChange: (options: Partial<DiffOptions>) => void;
}

const LANGUAGES = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'jsx', label: 'JSX' },
    { value: 'tsx', label: 'TSX' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
    { value: 'csharp', label: 'C#' },
    { value: 'go', label: 'Go' },
    { value: 'rust', label: 'Rust' },
    { value: 'html', label: 'HTML' },
    { value: 'css', label: 'CSS' },
    { value: 'json', label: 'JSON' },
    { value: 'yaml', label: 'YAML' },
    { value: 'markdown', label: 'Markdown' },
    { value: 'sql', label: 'SQL' },
    { value: 'bash', label: 'Bash' },
    { value: 'plaintext', label: 'Plain Text' },
];

export default function DiffSidebar({ options, onOptionsChange }: DiffSidebarProps) {
    return (
        <div className="card p-4 space-y-4">
            <div className="flex items-center gap-2 mb-4">
                <Settings className="w-5 h-5 text-light-accent-primary dark:text-dark-accent-primary" />
                <h3 className="font-semibold text-light-text-primary dark:text-dark-text-primary">
                    Options
                </h3>
            </div>

            {/* Diff Options */}
            <div className="space-y-3">
                <label className="flex items-center justify-between cursor-pointer group">
                    <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary group-hover:text-light-text-primary dark:group-hover:text-dark-text-primary transition-colors">
                        Ignore Whitespace
                    </span>
                    <input
                        type="checkbox"
                        checked={options.ignoreWhitespace}
                        onChange={(e) =>
                            onOptionsChange({ ignoreWhitespace: e.target.checked })
                        }
                        className="w-4 h-4 rounded border-light-border dark:border-dark-border bg-light-elevated dark:bg-dark-elevated checked:bg-light-accent-primary dark:checked:bg-dark-accent-primary focus:ring-2 focus:ring-light-accent-primary dark:focus:ring-dark-accent-primary"
                    />
                </label>

                <label className="flex items-center justify-between cursor-pointer group">
                    <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary group-hover:text-light-text-primary dark:group-hover:text-dark-text-primary transition-colors">
                        Case Sensitive
                    </span>
                    <input
                        type="checkbox"
                        checked={options.caseSensitive}
                        onChange={(e) =>
                            onOptionsChange({ caseSensitive: e.target.checked })
                        }
                        className="w-4 h-4 rounded border-light-border dark:border-dark-border bg-light-elevated dark:bg-dark-elevated checked:bg-light-accent-primary dark:checked:bg-dark-accent-primary focus:ring-2 focus:ring-light-accent-primary dark:focus:ring-dark-accent-primary"
                    />
                </label>

                <label className="flex items-center justify-between cursor-pointer group">
                    <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary group-hover:text-light-text-primary dark:group-hover:text-dark-text-primary transition-colors">
                        Show Line Numbers
                    </span>
                    <input
                        type="checkbox"
                        checked={options.showLineNumbers}
                        onChange={(e) =>
                            onOptionsChange({ showLineNumbers: e.target.checked })
                        }
                        className="w-4 h-4 rounded border-light-border dark:border-dark-border bg-light-elevated dark:bg-dark-elevated checked:bg-light-accent-primary dark:checked:bg-dark-accent-primary focus:ring-2 focus:ring-light-accent-primary dark:focus:ring-dark-accent-primary"
                    />
                </label>

                <label className="flex items-center justify-between cursor-pointer group">
                    <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary group-hover:text-light-text-primary dark:group-hover:text-dark-text-primary transition-colors">
                        Syntax Highlighting
                    </span>
                    <input
                        type="checkbox"
                        checked={options.syntaxHighlight}
                        onChange={(e) =>
                            onOptionsChange({ syntaxHighlight: e.target.checked })
                        }
                        className="w-4 h-4 rounded border-light-border dark:border-dark-border bg-light-elevated dark:bg-dark-elevated checked:bg-light-accent-primary dark:checked:bg-dark-accent-primary focus:ring-2 focus:ring-light-accent-primary dark:focus:ring-dark-accent-primary"
                    />
                </label>

                <label className="flex items-center justify-between cursor-pointer group">
                    <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary group-hover:text-light-text-primary dark:group-hover:text-dark-text-primary transition-colors">
                        Collapse Unchanged
                    </span>
                    <input
                        type="checkbox"
                        checked={options.collapseUnchanged}
                        onChange={(e) =>
                            onOptionsChange({ collapseUnchanged: e.target.checked })
                        }
                        className="w-4 h-4 rounded border-light-border dark:border-dark-border bg-light-elevated dark:bg-dark-elevated checked:bg-light-accent-primary dark:checked:bg-dark-accent-primary focus:ring-2 focus:ring-light-accent-primary dark:focus:ring-dark-accent-primary"
                    />
                </label>
            </div>

            {/* Granularity */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                    Diff Granularity
                </label>
                <div className="flex flex-col gap-2">
                    {(['line', 'word', 'character'] as const).map((level) => (
                        <label
                            key={level}
                            className="flex items-center gap-2 cursor-pointer group"
                        >
                            <input
                                type="radio"
                                name="granularity"
                                value={level}
                                checked={options.granularity === level}
                                onChange={(e) =>
                                    onOptionsChange({
                                        granularity: e.target.value as any,
                                    })
                                }
                                className="w-4 h-4 border-light-border dark:border-dark-border text-light-accent-primary dark:text-dark-accent-primary focus:ring-2 focus:ring-light-accent-primary dark:focus:ring-dark-accent-primary"
                            />
                            <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary group-hover:text-light-text-primary dark:group-hover:text-dark-text-primary transition-colors capitalize">
                                {level}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Language Selector */}
            {options.syntaxHighlight && (
                <div className="space-y-2">
                    <label className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                        Language
                    </label>
                    <select
                        value={options.language}
                        onChange={(e) => onOptionsChange({ language: e.target.value })}
                        className="w-full px-3 py-2 bg-light-elevated dark:bg-dark-elevated border border-light-border dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-light-accent-primary dark:focus:ring-dark-accent-primary text-light-text-primary dark:text-dark-text-primary text-sm"
                    >
                        {LANGUAGES.map((lang) => (
                            <option key={lang.value} value={lang.value}>
                                {lang.label}
                            </option>
                        ))}
                    </select>
                </div>
            )}
        </div>
    );
}
