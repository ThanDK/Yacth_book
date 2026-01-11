// ===== HEADER COMPONENT =====
import { NavLink } from 'react-router-dom';
import { APP_CONFIG, NAV_ITEMS } from '../../config/app.config';

export default function Header() {
    const navLinkClass = ({ isActive }) =>
        `px-4 py-2 rounded-xl text-sm font-medium transition-all ${isActive
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
            : 'text-slate-600 hover:bg-slate-100'
        }`;

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
                    <nav className="flex gap-1 bg-slate-100 p-1 rounded-xl">
                        {NAV_ITEMS.map(item => (
                            <NavLink key={item.path} to={item.path} className={navLinkClass}>
                                {item.icon} {item.label}
                            </NavLink>
                        ))}
                    </nav>
                </div>
            </div>
        </header>
    );
}
