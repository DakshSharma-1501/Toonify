'use client';

import { useCallback, useState } from 'react';
import { Upload, File } from 'lucide-react';

interface FileUploaderProps {
    onFileLoad: (content: string, filename: string) => void;
    accept?: string;
    label?: string;
}

export default function FileUploader({
    onFileLoad,
    accept = '.txt,.js,.jsx,.ts,.tsx,.json,.md,.css,.html,.xml,.yaml,.yml',
    label = 'Upload File',
}: FileUploaderProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleFile = useCallback(
        (file: File) => {
            if (!file) return;

            setIsLoading(true);
            const reader = new FileReader();

            reader.onload = (e) => {
                const content = e.target?.result as string;
                onFileLoad(content, file.name);
                setIsLoading(false);
            };

            reader.onerror = () => {
                console.error('Error reading file');
                setIsLoading(false);
            };

            reader.readAsText(file);
        },
        [onFileLoad]
    );

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setIsDragging(false);

            const file = e.dataTransfer.files[0];
            if (file) {
                handleFile(file);
            }
        },
        [handleFile]
    );

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleFileInput = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) {
                handleFile(file);
            }
        },
        [handleFile]
    );

    return (
        <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`
                relative border-2 border-dashed rounded-lg p-3 transition-all
                ${isDragging
                    ? 'border-light-accent-primary dark:border-dark-accent-primary bg-light-accent-primary/10 dark:bg-dark-accent-primary/10'
                    : 'border-light-border dark:border-dark-border hover:border-light-accent-primary dark:hover:border-dark-accent-primary'
                }
                ${isLoading ? 'opacity-50 pointer-events-none' : ''}
            `}
        >
            <input
                type="file"
                accept={accept}
                onChange={handleFileInput}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={isLoading}
            />
            <div className="flex items-center gap-2 pointer-events-none">
                {isLoading ? (
                    <>
                        <div className="w-4 h-4 border-2 border-light-accent-primary dark:border-dark-accent-primary border-t-transparent rounded-full animate-spin" />
                        <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                            Loading...
                        </span>
                    </>
                ) : (
                    <>
                        <Upload className="w-4 h-4 text-light-text-secondary dark:text-dark-text-secondary" />
                        <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                            {label}
                        </span>
                    </>
                )}
            </div>
        </div>
    );
}
