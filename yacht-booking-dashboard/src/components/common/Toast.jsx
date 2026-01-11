import { useEffect, useState } from 'react';

export function Toast({ message, type, onClose }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        requestAnimationFrame(() => setIsVisible(true));
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for exit animation
    };

    const styles = {
        success: {
            bg: 'bg-emerald-50',
            border: 'border-emerald-100',
            text: 'text-emerald-800',
            icon: '✅',
            bar: 'bg-emerald-500'
        },
        error: {
            bg: 'bg-red-50',
            border: 'border-red-100',
            text: 'text-red-800',
            icon: '❌',
            bar: 'bg-red-500'
        },
        warning: {
            bg: 'bg-amber-50',
            border: 'border-amber-100',
            text: 'text-amber-800',
            icon: '⚠️',
            bar: 'bg-amber-500'
        },
        info: {
            bg: 'bg-blue-50',
            border: 'border-blue-100',
            text: 'text-blue-800',
            icon: 'ℹ️',
            bar: 'bg-blue-500'
        }
    };

    const style = styles[type] || styles.info;

    return (
        <div
            className={`
                min-w-[300px] max-w-md p-4 rounded-xl shadow-lg border backdrop-blur-sm
                transition-all duration-300 ease-in-out transform
                ${style.bg} ${style.border}
                ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
            `}
        >
            <div className="flex items-start gap-3">
                <span className="text-xl">{style.icon}</span>
                <div className="flex-1 pt-0.5">
                    <p className={`text-sm font-medium ${style.text}`}>{message}</p>
                </div>
                <button
                    onClick={handleClose}
                    className={`p-1 rounded-lg hover:bg-black/5 ${style.text} transition-colors`}
                >
                    ✕
                </button>
            </div>
            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 h-1 w-full bg-black/5 overflow-hidden rounded-b-xl">
                <div className={`h-full ${style.bar} animate-[shrink_3s_linear_forwards]`} />
            </div>
        </div>
    );
}
