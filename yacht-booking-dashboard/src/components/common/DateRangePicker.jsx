// ===== DATE RANGE PICKER COMPONENT =====
// With month/year picker views for fast navigation
import { useState, useRef, useEffect } from 'react';

// Simple date helper functions
const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();
const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
};
const isSameDay = (d1, d2) => {
    if (!d1 || !d2) return false;
    return d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();
};
const isToday = (date) => isSameDay(date, new Date());
const isInRange = (day, from, to) => {
    if (!from || !to) return false;
    const d = day.getTime();
    return d > from.getTime() && d < to.getTime();
};

const WEEKDAYS = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];
const MONTHS = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
const MONTHS_FULL = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];

export default function DateRangePicker({
    range = { from: null, to: null },
    onRangeChange,
    mode = 'range', // 'range' | 'single'
    placeholder = 'เลือกช่วงวันที่',
    className = ''
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [pickerView, setPickerView] = useState('days'); // 'days' | 'months' | 'years'
    const containerRef = useRef(null);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
                setPickerView('days');
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleDayClick = (day) => {
        if (mode === 'single') {
            onRangeChange({ from: day, to: day });
            setIsOpen(false);
            return;
        }

        // Range mode
        if (!range.from || (range.from && range.to)) {
            onRangeChange({ from: day, to: null });
        } else {
            if (day >= range.from) {
                onRangeChange({ from: range.from, to: day });
                setIsOpen(false);
            } else {
                onRangeChange({ from: day, to: null });
            }
        }
    };

    const navigateMonth = (direction) => {
        if (pickerView === 'days') {
            setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + direction, 1));
        } else if (pickerView === 'months') {
            setCurrentMonth(prev => new Date(prev.getFullYear() + direction, prev.getMonth(), 1));
        } else if (pickerView === 'years') {
            setCurrentMonth(prev => new Date(prev.getFullYear() + (direction * 12), prev.getMonth(), 1));
        }
    };

    const handleTitleClick = () => {
        if (pickerView === 'days') setPickerView('months');
        else if (pickerView === 'months') setPickerView('years');
    };

    const handleMonthSelect = (monthIndex) => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), monthIndex, 1));
        setPickerView('days');
    };

    const handleYearSelect = (year) => {
        setCurrentMonth(new Date(year, currentMonth.getMonth(), 1));
        setPickerView('months');
    };

    const clearSelection = (e) => {
        e.stopPropagation();
        onRangeChange({ from: null, to: null });
    };

    // Generate calendar days
    const generateDays = () => {
        const days = [];
        const daysInMonth = getDaysInMonth(currentMonth);
        const firstDay = getFirstDayOfMonth(currentMonth);

        for (let i = 0; i < firstDay; i++) {
            days.push({ date: null, isPadding: true });
        }

        for (let d = 1; d <= daysInMonth; d++) {
            days.push({
                date: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), d),
                isPadding: false
            });
        }

        return days;
    };

    // Generate year grid (12 years)
    const generateYears = () => {
        const currentYear = currentMonth.getFullYear();
        const startYear = currentYear - (currentYear % 12);
        return Array.from({ length: 12 }, (_, i) => startYear + i);
    };

    const days = generateDays();
    const years = generateYears();
    const today = new Date();

    const displayText = range.from && range.to
        ? `${formatDate(range.from)} - ${formatDate(range.to)}`
        : range.from
            ? `${formatDate(range.from)} - ?`
            : placeholder;

    // Header title based on view
    let headerTitle = `${MONTHS_FULL[currentMonth.getMonth()]} ${currentMonth.getFullYear() + 543}`;
    if (pickerView === 'months') headerTitle = `${currentMonth.getFullYear() + 543}`;
    if (pickerView === 'years') headerTitle = `${years[0] + 543} - ${years[11] + 543}`;

    return (
        <div ref={containerRef} className={`relative ${className}`}>
            {/* Trigger Button */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center justify-between px-4 py-2.5 bg-white border rounded-xl cursor-pointer transition-all ${isOpen ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-200 hover:border-slate-300'
                    }`}
            >
                <div className="flex items-center gap-2">
                    <span className="text-slate-400">📅</span>
                    <span className={range.from ? 'text-slate-900' : 'text-slate-400'}>
                        {displayText}
                    </span>
                </div>
                {range.from && (
                    <button onClick={clearSelection} className="ml-2 text-slate-400 hover:text-slate-600">✕</button>
                )}
            </div>

            {/* Dropdown Calendar */}
            {isOpen && (
                <div className="absolute top-full left-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-4 min-w-[300px]">
                    {/* Header - Clickable to change view */}
                    <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-100">
                        <button
                            onClick={() => navigateMonth(-1)}
                            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                        >
                            ◀
                        </button>
                        <button
                            onClick={handleTitleClick}
                            className="font-bold text-slate-700 px-3 py-1 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        >
                            {headerTitle}
                        </button>
                        <button
                            onClick={() => navigateMonth(1)}
                            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                        >
                            ▶
                        </button>
                    </div>

                    {/* DAYS VIEW */}
                    {pickerView === 'days' && (
                        <>
                            <div className="grid grid-cols-7 gap-1 mb-2">
                                {WEEKDAYS.map(day => (
                                    <div key={day} className="text-center text-xs font-medium text-slate-400 py-1">{day}</div>
                                ))}
                            </div>

                            <div className="grid grid-cols-7 gap-1">
                                {days.map((day, i) => {
                                    if (day.isPadding) return <div key={i} className="h-9" />;

                                    const isStart = range.from && isSameDay(day.date, range.from);
                                    const isEnd = range.to && isSameDay(day.date, range.to);
                                    const inRange = isInRange(day.date, range.from, range.to);
                                    const isTodayDate = isToday(day.date);

                                    return (
                                        <button
                                            key={i}
                                            onClick={() => handleDayClick(day.date)}
                                            className={`h-9 w-full text-sm font-medium rounded-lg transition-all
                                                ${isStart || isEnd ? 'bg-blue-600 text-white'
                                                    : inRange ? 'bg-blue-100 text-blue-700'
                                                        : isTodayDate ? 'border-2 border-emerald-400 text-slate-700'
                                                            : 'text-slate-700 hover:bg-slate-100'}
                                            `}
                                        >
                                            {day.date.getDate()}
                                        </button>
                                    );
                                })}
                            </div>
                        </>
                    )}

                    {/* MONTHS VIEW */}
                    {pickerView === 'months' && (
                        <div className="grid grid-cols-3 gap-2">
                            {MONTHS.map((month, index) => {
                                const isCurrentMonth = currentMonth.getMonth() === index;
                                const isTodayMonth = today.getMonth() === index && today.getFullYear() === currentMonth.getFullYear();
                                return (
                                    <button
                                        key={month}
                                        onClick={() => handleMonthSelect(index)}
                                        className={`py-3 px-2 text-sm font-medium rounded-lg transition-all
                                            ${isCurrentMonth ? 'bg-blue-600 text-white'
                                                : isTodayMonth ? 'border-2 border-emerald-400 text-slate-700'
                                                    : 'text-slate-700 hover:bg-slate-100'}
                                        `}
                                    >
                                        {month}
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {/* YEARS VIEW */}
                    {pickerView === 'years' && (
                        <div className="grid grid-cols-3 gap-2">
                            {years.map(year => {
                                const isCurrentYear = currentMonth.getFullYear() === year;
                                const isTodayYear = today.getFullYear() === year;
                                return (
                                    <button
                                        key={year}
                                        onClick={() => handleYearSelect(year)}
                                        className={`py-3 px-2 text-sm font-medium rounded-lg transition-all
                                            ${isCurrentYear ? 'bg-blue-600 text-white'
                                                : isTodayYear ? 'border-2 border-emerald-400 text-slate-700'
                                                    : 'text-slate-700 hover:bg-slate-100'}
                                        `}
                                    >
                                        {year + 543}
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {/* Quick Actions - Only in days view */}
                    {pickerView === 'days' && (
                        <>
                            <div className="flex gap-2 mt-3 pt-3 border-t border-slate-100">
                                <button
                                    onClick={() => {
                                        const today = new Date();
                                        onRangeChange({ from: today, to: today });
                                        setIsOpen(false);
                                    }}
                                    className="flex-1 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200"
                                >
                                    วันนี้
                                </button>
                                <button
                                    onClick={() => {
                                        const today = new Date();
                                        const weekAgo = new Date(today);
                                        weekAgo.setDate(today.getDate() - 7);
                                        onRangeChange({ from: weekAgo, to: today });
                                        setIsOpen(false);
                                    }}
                                    className="flex-1 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200"
                                >
                                    7 วัน
                                </button>
                                <button
                                    onClick={() => {
                                        const today = new Date();
                                        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
                                        onRangeChange({ from: monthStart, to: today });
                                        setIsOpen(false);
                                    }}
                                    className="flex-1 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200"
                                >
                                    เดือนนี้
                                </button>
                            </div>

                            {mode === 'range' && (
                                <p className="text-xs text-center text-slate-400 mt-2">
                                    {range.from && !range.to ? 'เลือกวันสิ้นสุด' : 'เลือกวันเริ่มต้น'}
                                </p>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
