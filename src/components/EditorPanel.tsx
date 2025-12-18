'use client';

import { useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import type { editor } from 'monaco-editor';

interface EditorPanelProps {
    value: string;
    onChange?: (value: string) => void;
    language?: string;
    readOnly?: boolean;
    title: string;
    onCopy?: () => void;
}

export default function EditorPanel({
    value,
    onChange,
    language = 'plaintext',
    readOnly = false,
    title,
    onCopy,
}: EditorPanelProps) {
    const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

    const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor) => {
        editorRef.current = editor;
    };

    const handleCopy = async () => {
        if (value) {
            await navigator.clipboard.writeText(value);
            onCopy?.();
        }
    };

    return (
        <div className="flex flex-col h-full card overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-light-border dark:border-dark-border bg-light-elevated dark:bg-dark-elevated">
                <h2 className="font-semibold text-sm text-light-text-secondary dark:text-dark-text-secondary uppercase tracking-wide">
                    {title}
                </h2>
                {readOnly && value && (
                    <button
                        onClick={handleCopy}
                        className="text-xs btn-secondary !py-1.5 !px-3 hover:scale-105"
                    >
                        Copy
                    </button>
                )}
            </div>

            {/* Editor */}
            <div className="flex-1 overflow-hidden">
                <Editor
                    height="100%"
                    language={language}
                    value={value}
                    onChange={(val) => onChange?.(val || '')}
                    onMount={handleEditorDidMount}
                    theme="vs-dark"
                    options={{
                        readOnly,
                        minimap: { enabled: false },
                        fontSize: 14,
                        lineNumbers: 'on',
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        tabSize: 2,
                        wordWrap: 'on',
                        padding: { top: 16, bottom: 16 },
                        fontFamily: 'Fira Code, monospace',
                        fontLigatures: true,
                        smoothScrolling: true,
                        cursorBlinking: 'smooth',
                        cursorSmoothCaretAnimation: 'on',
                        renderLineHighlight: 'all',
                        bracketPairColorization: {
                            enabled: true,
                        },
                    }}
                />
            </div>
        </div>
    );
}
