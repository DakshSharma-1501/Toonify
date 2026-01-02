'use client';

import { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import ToolLayout from '@/components/playground/ToolLayout';
import CopyButton from '@/components/playground/CopyButton';
import Toast from '@/components/playground/Toast';
import { RotateCcw, Play } from 'lucide-react';
import { saveToStorage, loadFromStorage, STORAGE_KEYS } from '@/lib/playground/localStorage';
import { useDebouncedCallback } from '@/lib/playground/hooks';
import type { CodeEditorState } from '@/lib/playground/types';

const DEFAULT_HTML = `<div class="container">
  <h1>Hello, World!</h1>
  <p>Start coding to see live preview</p>
  <button id="btn">Click me!</button>
</div>`;

const DEFAULT_CSS = `.container {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  max-width: 600px;
  margin: 50px auto;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  color: white;
  text-align: center;
}

h1 {
  font-size: 2.5em;
  margin-bottom: 10px;
}

button {
  margin-top: 20px;
  padding: 12px 24px;
  font-size: 16px;
  background: white;
  color: #667eea;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: transform 0.2s;
}

button:hover {
  transform: scale(1.05);
}`;

const DEFAULT_JS = `document.getElementById('btn').addEventListener('click', () => {
  alert('Hello from the playground!');
});`;

export default function CodeEditorPage() {
    const [state, setState] = useState<CodeEditorState>(() =>
        loadFromStorage(STORAGE_KEYS.CODE_EDITOR, {
            html: DEFAULT_HTML,
            css: DEFAULT_CSS,
            javascript: DEFAULT_JS,
        })
    );
    const [activeTab, setActiveTab] = useState<'html' | 'css' | 'javascript'>('html');
    const [showToast, setShowToast] = useState(false);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    // Save to localStorage whenever state changes
    useEffect(() => {
        saveToStorage(STORAGE_KEYS.CODE_EDITOR, state);
    }, [state]);

    // Update preview with debounce
    const updatePreview = useDebouncedCallback(() => {
        console.log('updatePreview called');
        const iframe = iframeRef.current;
        if (!iframe) {
            console.error('Iframe ref is null');
            return;
        }

        console.log('Updating iframe via srcdoc...');
        const content = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        * { box-sizing: border-box; }
        body { 
            margin: 0; 
            padding: 20px; 
            background: transparent;
            min-height: 100vh;
        }
        ${state.css}
    </style>
</head>
<body>
    ${state.html}
    <script>
        // Wait for DOM to be fully loaded before executing user code
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                try {
                    ${state.javascript}
                } catch (error) {
                    console.error('JavaScript Error:', error);
                    document.body.innerHTML += '<div style="color: #ef4444; padding: 20px; background: #fee; border: 1px solid #ef4444; border-radius: 8px; margin-top: 20px;"><strong>Error:</strong> ' + error.message + '</div>';
                }
            });
        } else {
            // DOM is already loaded
            try {
                ${state.javascript}
            } catch (error) {
                console.error('JavaScript Error:', error);
                document.body.innerHTML += '<div style="color: #ef4444; padding: 20px; background: #fee; border: 1px solid #ef4444; border-radius: 8px; margin-top: 20px;"><strong>Error:</strong> ' + error.message + '</div>';
            }
        }
    </script>
</body>
</html>`;

        iframe.srcdoc = content;
        console.log('Iframe updated successfully via srcdoc');
    }, 300);

    // Initial load - trigger preview update
    useEffect(() => {
        // Trigger initial preview after a short delay to ensure iframe is ready
        const timer = setTimeout(() => {
            updatePreview();
        }, 100);

        return () => clearTimeout(timer);
    }, [updatePreview]);

    // Update preview when state changes
    useEffect(() => {
        updatePreview();
    }, [state.html, state.css, state.javascript, updatePreview]);

    const handleReset = () => {
        setState({
            html: DEFAULT_HTML,
            css: DEFAULT_CSS,
            javascript: DEFAULT_JS,
        });
        setShowToast(true);
    };

    const handleRun = () => {
        updatePreview();
        setShowToast(true);
    };

    const getCurrentCode = () => {
        return state[activeTab];
    };

    const tabs = [
        { id: 'html' as const, label: 'HTML', language: 'html' },
        { id: 'css' as const, label: 'CSS', language: 'css' },
        { id: 'javascript' as const, label: 'JavaScript', language: 'javascript' },
    ];

    // Keyboard shortcut: Ctrl+Enter to run
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                updatePreview();
                setShowToast(true);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [updatePreview]);

    return (
        <ToolLayout
            title="Live Code Editor"
            description="Write HTML, CSS, and JavaScript with instant live preview"
        >
            <div className="space-y-4">
                {/* Toolbar */}
                <div className="card p-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-sm text-light-text-secondary dark:text-dark-text-secondary">
                        <span className="hidden sm:inline">💡 Tip: Press</span>
                        <kbd className="px-2 py-1 bg-light-elevated dark:bg-dark-elevated rounded text-xs font-mono">
                            Ctrl+Enter
                        </kbd>
                        <span className="hidden sm:inline">to run</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={handleRun} className="btn-primary flex items-center gap-2">
                            <Play className="w-4 h-4" />
                            Run
                        </button>
                        <button onClick={handleReset} className="btn-secondary flex items-center gap-2">
                            <RotateCcw className="w-4 h-4" />
                            Reset
                        </button>
                        <CopyButton text={getCurrentCode()} />
                    </div>
                </div>

                {/* Editor and Preview */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[600px]">
                    {/* Editor Panel */}
                    <div className="card p-4 flex flex-col">
                        {/* Tabs */}
                        <div className="flex gap-2 mb-4 border-b border-light-border dark:border-dark-border">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-4 py-2 text-sm font-medium transition-colors relative ${activeTab === tab.id
                                        ? 'text-light-accent-primary dark:text-dark-accent-primary'
                                        : 'text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary'
                                        }`}
                                >
                                    {tab.label}
                                    {activeTab === tab.id && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-light-accent-primary dark:bg-dark-accent-primary" />
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Monaco Editor */}
                        <div className="flex-1 overflow-hidden rounded-lg border border-light-border dark:border-dark-border">
                            <Editor
                                height="100%"
                                language={tabs.find((t) => t.id === activeTab)?.language}
                                value={state[activeTab]}
                                onChange={(value) =>
                                    setState((prev) => ({ ...prev, [activeTab]: value || '' }))
                                }
                                theme="vs-dark"
                                options={{
                                    minimap: { enabled: false },
                                    fontSize: 14,
                                    lineNumbers: 'on',
                                    scrollBeyondLastLine: false,
                                    automaticLayout: true,
                                    tabSize: 2,
                                }}
                            />
                        </div>
                    </div>

                    {/* Preview Panel */}
                    <div className="card p-4 flex flex-col">
                        <h3 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary mb-4">
                            Live Preview
                        </h3>
                        <div className="flex-1 overflow-hidden rounded-lg border border-light-border dark:border-dark-border bg-[#0f1419] dark:bg-[#0f1419]">
                            <iframe
                                ref={iframeRef}
                                className="w-full h-full bg-[#0f1419]"
                                title="Preview"
                                sandbox="allow-scripts allow-same-origin allow-modals"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Toast */}
            {showToast && (
                <Toast
                    message="Code executed successfully!"
                    type="success"
                    onClose={() => setShowToast(false)}
                />
            )}
        </ToolLayout>
    );
}
