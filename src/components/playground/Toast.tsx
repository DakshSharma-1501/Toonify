'use client';

import { useEffect, useState } from 'react';

interface ToastProps {
    message: string;
    type?: 'success' | 'error' | 'info';
    duration?: number;
    onClose?: () => void;
}

export default function Toast({ message, type = 'success', duration = 2000, onClose }: ToastProps) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            onClose?.();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    if (!isVisible) return null;

    const bgColor = {
        success: 'bg-green-500/20 border-green-500',
        error: 'bg-red-500/20 border-red-500',
        info: 'bg-blue-500/20 border-blue-500',
    }[type];

    const textColor = {
        success: 'text-green-400',
        error: 'text-red-400',
        info: 'text-blue-400',
    }[type];

    return (
        <div className={`fixed bottom-6 right-6 card px-6 py-3 shadow-2xl animate-slide-up border ${bgColor} z-50`}>
            <p className={`text-sm font-medium ${textColor}`}>
                {message}
            </p>
        </div>
    );
}
