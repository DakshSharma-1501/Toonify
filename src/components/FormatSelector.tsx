'use client';

import type { InputFormat } from '@/types';

interface FormatSelectorProps {
    format: InputFormat;
    detectedFormat: InputFormat;
    onChange: (format: InputFormat) => void;
}

const formats: { value: InputFormat; label: string }[] = [
    { value: 'auto', label: 'Auto-detect' },
    { value: 'json', label: 'JSON' },
    { value: 'yaml', label: 'YAML' },
    { value: 'html', label: 'HTML' },
    { value: 'react', label: 'React/JSX' },
    { value: 'text', label: 'Plain Text' },
];

export default function FormatSelector({
    format,
    detectedFormat,
    onChange,
}: FormatSelectorProps) {
    return (
        <div className="card p-4 space-y-3">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-light-text-secondary dark:text-dark-text-secondary uppercase tracking-wide">
                    Input Format
                </h3>
                {format === 'auto' && detectedFormat !== 'auto' && (
                    <span className="text-xs px-2 py-1 rounded-full bg-light-accent-primary/10 dark:bg-dark-accent-primary/10 text-light-accent-primary dark:text-dark-accent-primary font-medium">
                        Detected: {detectedFormat.toUpperCase()}
                    </span>
                )}
            </div>

            <div className="flex flex-wrap gap-2">
                {formats.map((f) => (
                    <button
                        key={f.value}
                        onClick={() => onChange(f.value)}
                        className={`
              px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
              ${format === f.value
                                ? 'bg-light-accent-primary dark:bg-dark-accent-primary text-white dark:text-dark-bg shadow-lg'
                                : 'bg-light-elevated dark:bg-dark-elevated text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-border dark:hover:bg-dark-border'
                            }
            `}
                    >
                        {f.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
