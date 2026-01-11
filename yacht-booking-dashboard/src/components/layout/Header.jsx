// ===== HEADER COMPONENT =====
import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { APP_CONFIG, NAV_ITEMS } from '../../config/app.config';

export default function Header({ calendarMode, onModeChange }) {
    const [showModeDropdown, setShowModeDropdown] = useState(false);

    const navLinkClass = ({ isActive }) =>
        `px-4 py-2 rounded-xl text-sm font-medium transition-all ${isActive
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
            : 'text-slate-600 hover:bg-slate-100'
        }`;

    const modeConfig = {
        regular: { label: '🚤 Regular', color: 'bg-blue-600', textColor: 'text-blue-600' },
        fractional: { label: '🔒 Fractional', color: 'bg-purple-600', textColor: 'text-purple-600' }
    };

    const currentMode = modeConfig[calendarMode || 'regular'];

    return (
        <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                            <span className="text-xl">{APP_CONFIG.logo}</span>
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-slate-900">{APP_CONFIG.name}</h1>
                            <p className="text-xs text-slate-500">{APP_CONFIG.subtitle}</p>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex gap-1 bg-slate-100 p-1 rounded-xl items-center">
                        {/* Regular Nav Items */}
                        {NAV_ITEMS.map(item => (
                            <NavLink key={item.path} to={item.path} className={navLinkClass}>
                                {item.icon} {item.label}
                            </NavLink>
                        ))}

                        {/* Divider */}
                        <div className="w-px h-6 bg-slate-300 mx-1" />

                        {/* Saved Users */}
                        <NavLink to="/users" className={navLinkClass}>
                            👥 Users
                        </NavLink>

                        {/* Divider */}
                        <div className="w-px h-6 bg-slate-300 mx-1" />

                        {/* Calendar Mode Toggle */}
                        <div className="relative">
                            <button
                                onClick={() => setShowModeDropdown(!showModeDropdown)}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all text-white ${calendarMode === 'fractional' ? 'bg-purple-600' : 'bg-blue-600'
                                    }`}
                            >
                                {currentMode.label} ▼
                            </button>

                            {showModeDropdown && (
                                <>
                                    <div
                                        className="fixed inset-0 z-40"
                                        onClick={() => setShowModeDropdown(false)}
                                    />
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                                        <button
                                            onClick={() => { onModeChange('regular'); setShowModeDropdown(false); }}
                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 ${calendarMode === 'regular' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-slate-600'
                                                }`}
                                        >
                                            🚤 Regular Yachts
                                        </button>
                                        <button
                                            onClick={() => { onModeChange('fractional'); setShowModeDropdown(false); }}
                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 ${calendarMode === 'fractional' ? 'bg-purple-50 text-purple-600 font-medium' : 'text-slate-600'
                                                }`}
                                        >
                                            🔒 Fractional Yachts
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </nav>
                </div>
            </div>
        </header>
    );
}
