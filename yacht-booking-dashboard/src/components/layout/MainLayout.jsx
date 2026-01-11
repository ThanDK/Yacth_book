// ===== MAIN LAYOUT COMPONENT =====
import Header from './Header';

export default function MainLayout({ children, calendarMode, onModeChange }) {
    return (
        <div className="min-h-screen bg-slate-50">
            <Header calendarMode={calendarMode} onModeChange={onModeChange} />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
                {children}
            </main>
        </div>
    );
}
