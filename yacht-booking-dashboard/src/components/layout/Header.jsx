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
            <div className="max-w-7xl mx-auto px-2 sm:px-6 py-3">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                            <span className="text-lg sm:text-xl">{APP_CONFIG.logo}</span>
                        </div>
                        <div>
                            <h1 className="text-sm sm:text-lg font-bold text-slate-900 leading-tight">{APP_CONFIG.name}</h1>
                            <p className="text-[10px] sm:text-xs text-slate-500 hidden sm:block">{APP_CONFIG.subtitle}</p>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex gap-1 bg-slate-100 p-1 rounded-xl items-center">
                        {/* Regular Nav Items */}
                        {NAV_ITEMS.map(item => (
                            <NavLink key={item.path} to={item.path} className={({ isActive }) =>
                                `px-2 sm:px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${isActive
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                                    : 'text-slate-600 hover:bg-slate-100'
                                }`}>
                                {item.icon} <span className="hidden md:inline">{item.label}</span>
                            </NavLink>
                        ))}

                        {/* Divider */}
                        <div className="w-px h-6 bg-slate-300 mx-1 hidden sm:block" />

                        {/* Saved Users */}
                        <NavLink to="/users" className={({ isActive }) =>
                            `px-2 sm:px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${isActive
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                                : 'text-slate-600 hover:bg-slate-100'
                            }`}>
                            <span>👥</span> <span className="hidden md:inline">Users</span>
                        </NavLink>

                        {/* Divider */}
                        <div className="w-px h-6 bg-slate-300 mx-1 hidden sm:block" />

                        {/* Calendar Mode Toggle */}
                        <div className="relative">
                            <button
                                onClick={() => setShowModeDropdown(!showModeDropdown)}
                                className={`px-2 sm:px-4 py-2 rounded-xl text-sm font-medium transition-all text-white flex items-center gap-1 ${calendarMode === 'fractional' ? 'bg-purple-600' : 'bg-blue-600'
                                    }`}
                            >
                                <span className="hidden sm:inline">{currentMode.label}</span>
                                <span className="sm:hidden">{calendarMode === 'fractional' ? '🔒' : '🚤'}</span>
                                <span className="text-xs">▼</span>
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
