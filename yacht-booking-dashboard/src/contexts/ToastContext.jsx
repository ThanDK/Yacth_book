import { createContext, useContext, useState, useCallback, useRef } from 'react';
import { Toast } from '../components/common/Toast';

const ToastContext = createContext(null);

// Maximum number of toasts visible at once
const MAX_TOASTS = 3;
// Minimum time between same message toasts (ms)
const DEBOUNCE_TIME = 500;

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const lastToastRef = useRef({ message: '', time: 0 });

    const addToast = useCallback((message, type = 'info') => {
        const now = Date.now();

        // Debounce: prevent same message within DEBOUNCE_TIME
        if (
            lastToastRef.current.message === message &&
            now - lastToastRef.current.time < DEBOUNCE_TIME
        ) {
            return; // Skip duplicate toast
        }

        // Update last toast reference
        lastToastRef.current = { message, time: now };

        const id = now.toString() + Math.random().toString(36).slice(2, 5);

        setToasts(prev => {
            // Limit max toasts - remove oldest if at max
            const newToasts = prev.length >= MAX_TOASTS
                ? [...prev.slice(-MAX_TOASTS + 1), { id, message, type }]
                : [...prev, { id, message, type }];
            return newToasts;
        });

        // Auto remove after 3 seconds
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3000);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    // Clear all toasts
    const clearAll = useCallback(() => {
        setToasts([]);
    }, []);

    // Helper functions
    const toast = {
        success: (msg) => addToast(msg, 'success'),
        error: (msg) => addToast(msg, 'error'),
        info: (msg) => addToast(msg, 'info'),
        warning: (msg) => addToast(msg, 'warning'),
        clear: clearAll
    };

    return (
        <ToastContext.Provider value={toast}>
            {children}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
                {toasts.map(t => (
                    <div key={t.id} className="pointer-events-auto">
                        <Toast
                            message={t.message}
                            type={t.type}
                            onClose={() => removeToast(t.id)}
                        />
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}
