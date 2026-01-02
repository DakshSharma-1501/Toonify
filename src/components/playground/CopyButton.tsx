'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface CopyButtonProps {
    text: string;
    className?: string;
}

export default function CopyButton({ text, className = '' }: CopyButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error('Failed to copy:', error);
        }
    };

    return (
        <button
            onClick={handleCopy}
            className={`btn-secondary flex items-center gap-2 ${className}`}
            disabled={copied}
        >
            {copied ? (
                <>
                    <Check className="w-4 h-4" />
                    Copied!
                </>
            ) : (
                <>
                    <Copy className="w-4 h-4" />
                    Copy
                </>
            )}
        </button>
    );
}
