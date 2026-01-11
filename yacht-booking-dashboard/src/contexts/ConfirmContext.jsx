// ===== CONFIRM DIALOG COMPONENT =====
// Soft-coded confirmation dialog to replace browser confirm()
import { useState, createContext, useContext, useCallback } from 'react';

// Context
const ConfirmContext = createContext(null);

export function useConfirm() {
    const context = useContext(ConfirmContext);
    if (!context) {
        throw new Error('useConfirm must be used within ConfirmProvider');
    }
    return context;
}

// Provider
export function ConfirmProvider({ children }) {
    const [dialog, setDialog] = useState({
        isOpen: false,
        title: '',
        message: '',
        confirmText: 'ยืนยัน',
        cancelText: 'ยกเลิก',
        type: 'danger', // 'danger', 'warning', 'info'
        onConfirm: null,
        onCancel: null
    });

    const confirm = useCallback((options) => {
        return new Promise((resolve) => {
            setDialog({
                isOpen: true,
                title: options.title || 'ยืนยันการดำเนินการ',
                message: options.message || 'คุณต้องการดำเนินการต่อหรือไม่?',
                confirmText: options.confirmText || 'ยืนยัน',
                cancelText: options.cancelText || 'ยกเลิก',
                type: options.type || 'danger',
                onConfirm: () => {
                    setDialog(d => ({ ...d, isOpen: false }));
                    resolve(true);
                },
                onCancel: () => {
                    setDialog(d => ({ ...d, isOpen: false }));
                    resolve(false);
                }
            });
        });
    }, []);

    const typeConfig = {
        danger: {
            icon: '⚠️',
            buttonBg: 'bg-red-600 hover:bg-red-700',
            iconBg: 'bg-red-100',
            iconText: 'text-red-600'
        },
        warning: {
            icon: '⚡',
            buttonBg: 'bg-amber-600 hover:bg-amber-700',
            iconBg: 'bg-amber-100',
            iconText: 'text-amber-600'
        },
        info: {
            icon: '💡',
            buttonBg: 'bg-blue-600 hover:bg-blue-700',
            iconBg: 'bg-blue-100',
            iconText: 'text-blue-600'
        }
    };

    const config = typeConfig[dialog.type] || typeConfig.danger;

    return (
        <ConfirmContext.Provider value={confirm}>
            {children}

            {/* Dialog Modal */}
            {dialog.isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={dialog.onCancel}
                    />

                    {/* Dialog */}
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm animate-in zoom-in-95 duration-200">
                        <div className="p-6 text-center">
                            {/* Icon */}
                            <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${config.iconBg} flex items-center justify-center`}>
                                <span className="text-3xl">{config.icon}</span>
                            </div>

                            {/* Title */}
                            <h3 className="text-lg font-bold text-slate-900 mb-2">
                                {dialog.title}
                            </h3>

                            {/* Message */}
                            <p className="text-sm text-slate-600 mb-6">
                                {dialog.message}
                            </p>

                            {/* Buttons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={dialog.onCancel}
                                    className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition"
                                >
                                    {dialog.cancelText}
                                </button>
                                <button
                                    onClick={dialog.onConfirm}
                                    className={`flex-1 px-4 py-2.5 text-white rounded-xl font-medium transition ${config.buttonBg}`}
                                >
                                    {dialog.confirmText}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </ConfirmContext.Provider>
    );
}
