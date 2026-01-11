// ===== MODAL COMPONENT =====
export default function Modal({ isOpen, onClose, title, subtitle, children, footer }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl max-h-[90vh] flex flex-col">
                {/* Header - Fixed */}
                {(title || subtitle) && (
                    <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center rounded-t-2xl flex-shrink-0">
                        <div>
                            {title && <h3 className="font-bold text-lg text-slate-900">{title}</h3>}
                            {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
                        </div>
                        <button
                            onClick={onClose}
                            className="text-slate-400 hover:text-slate-600 text-2xl"
                        >
                            ×
                        </button>
                    </div>
                )}

                {/* Content - Scrollable with hidden scrollbar */}
                <div className="p-6 overflow-y-auto flex-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    <style>{`.modal-content::-webkit-scrollbar { display: none; }`}</style>
                    {children}
                </div>

                {/* Footer - Fixed */}
                {footer && (
                    <div className="px-6 py-4 bg-slate-50 rounded-b-2xl border-t border-slate-100 flex-shrink-0">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}
