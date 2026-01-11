// ===== MONTH/YEAR PICKER COMPONENT =====
// Clean, reusable dropdown picker for month and year selection
import { useState } from 'react';
import { THAI_MONTHS } from '../../utils/date.utils';

// Short month names for compact grid
const MONTHS_SHORT = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];

export default function MonthYearPicker({
    currentDate,
    onDateChange,
    showTodayButton = true,
    todayButtonText = 'กลับวันนี้'
}) {
    const [view, setView] = useState('months'); // 'months' | 'years'
    const [displayYear, setDisplayYear] = useState(currentDate.getFullYear());
    const today = new Date();

    // Generate years grid dynamically (12 years)
    const generateYears = () => {
        const startYear = displayYear - (displayYear % 12);
        return Array.from({ length: 12 }, (_, i) => startYear + i);
    };

    const handleMonthSelect = (monthIndex) => {
        onDateChange(new Date(displayYear, monthIndex, 1));
    };

    const handleYearSelect = (year) => {
        setDisplayYear(year);
        setView('months');
    };

    const navigateYears = (direction) => {
        setDisplayYear(prev => prev + (view === 'months' ? direction : direction * 12));
    };

    const years = generateYears();

    return (
        <div className="bg-white rounded-xl shadow-2xl border border-slate-200 min-w-[280px] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-2 bg-slate-50 border-b border-slate-100">
                <button
                    onClick={() => navigateYears(-1)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-200 transition"
                >
                    ◀
                </button>
                <button
                    onClick={() => setView(view === 'months' ? 'years' : 'months')}
                    className="font-bold text-slate-700 px-3 py-1 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition"
                >
                    {view === 'months' ? `${displayYear + 543}` : `${years[0] + 543} - ${years[11] + 543}`}
                </button>
                <button
                    onClick={() => navigateYears(1)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-200 transition"
                >
                    ▶
                </button>
            </div>

            {/* Content */}
            <div className="p-3">
                {view === 'months' ? (
                    <div className="grid grid-cols-3 gap-2">
                        {MONTHS_SHORT.map((monthName, index) => {
                            const isSelected = currentDate.getMonth() === index && currentDate.getFullYear() === displayYear;
                            const isTodayMonth = today.getMonth() === index && today.getFullYear() === displayYear;
                            return (
                                <button
                                    key={index}
                                    onClick={() => handleMonthSelect(index)}
                                    className={`py-2.5 px-2 text-sm font-medium rounded-lg transition-all
                                        ${isSelected ? 'bg-blue-600 text-white'
                                            : isTodayMonth ? 'border-2 border-emerald-400 text-slate-700'
                                                : 'text-slate-600 hover:bg-blue-50 hover:text-blue-600'}
                                    `}
                                >
                                    {monthName}
                                </button>
                            );
                        })}
                    </div>
                ) : (
                    <div className="grid grid-cols-3 gap-2">
                        {years.map(year => {
                            const isSelected = currentDate.getFullYear() === year;
                            const isTodayYear = today.getFullYear() === year;
                            return (
                                <button
                                    key={year}
                                    onClick={() => handleYearSelect(year)}
                                    className={`py-2.5 px-2 text-sm font-medium rounded-lg transition-all
                                        ${isSelected ? 'bg-blue-600 text-white'
                                            : isTodayYear ? 'border-2 border-emerald-400 text-slate-700'
                                                : 'text-slate-600 hover:bg-blue-50 hover:text-blue-600'}
                                    `}
                                >
                                    {year + 543}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Footer */}
            {showTodayButton && (
                <div className="px-3 pb-3">
                    <button
                        onClick={() => onDateChange(new Date())}
                        className="w-full py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
                    >
                        {todayButtonText}
                    </button>
                </div>
            )}
        </div>
    );
}
