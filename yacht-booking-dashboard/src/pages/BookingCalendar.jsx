// ===== BOOKING CALENDAR PAGE =====
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { STATUS_CONFIG } from '../config/app.config';
import { MonthYearPicker } from '../components/common';
import {
    THAI_MONTHS,
    THAI_DAYS_SHORT,
    THAI_DAYS_FULL,
    formatDateThai,
    toDateString,
    isToday,
    isPast,
    getDaysInMonth,
    getFirstDayOfMonth
} from '../utils/date.utils';

export default function BookingCalendar({ yachts, bookings, getBookingsForDate }) {
    const navigate = useNavigate();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [popup, setPopup] = useState({ date: null, bookings: [], position: 'bottom' });
    const [showMonthPicker, setShowMonthPicker] = useState(false);

    // Ref for dropdown container (trigger + popup)
    const dropdownRef = useRef(null);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowMonthPicker(false);
            }
        };

        if (showMonthPicker) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showMonthPicker]);

    // Generate calendar days
    const generateCalendarDays = () => {
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);
        const days = [];

        const prevMonthDays = getDaysInMonth(year, month - 1);
        for (let i = firstDay - 1; i >= 0; i--) {
            days.push({ day: prevMonthDays - i, date: new Date(year, month - 1, prevMonthDays - i), isCurrentMonth: false });
        }

        for (let day = 1; day <= daysInMonth; day++) {
            days.push({ day, date: new Date(year, month, day), isCurrentMonth: true });
        }

        const remaining = 42 - days.length;
        for (let day = 1; day <= remaining; day++) {
            days.push({ day, date: new Date(year, month + 1, day), isCurrentMonth: false });
        }

        return days;
    };

    const handleDayClick = (date, event) => {
        if (popup.date?.toDateString() === date.toDateString()) {
            setPopup({ date: null, bookings: [], position: 'bottom' });
            return;
        }

        const rect = event.currentTarget.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const position = spaceBelow < 300 ? 'top' : 'bottom';

        const dayBookings = getBookingsForDate(date).filter(b => b.status !== 'CANCELLED');
        setPopup({ date, bookings: dayBookings, position });
    };

    const handleDoubleClick = (date, e) => {
        e.stopPropagation();
        navigate(`/day/${toDateString(date)}`);
    };

    const closePopup = () => setPopup({ date: null, bookings: [], position: 'bottom' });

    const changeMonth = (offset) => {
        setCurrentDate(new Date(year, month + offset, 1));
        closePopup();
    };

    const handleDateSelect = (date) => {
        setCurrentDate(date);
        setShowMonthPicker(false);
        closePopup();
    };

    const calendarDays = generateCalendarDays();

    return (
        <div className="space-y-6">
            {popup.date && <div className="fixed inset-0 z-10" onClick={closePopup} />}

            {/* Header */}
            <div className="flex items-center justify-between relative z-20">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">ปฏิทินจอง</h2>
                    <p className="text-sm text-slate-500">คลิก 1 ครั้ง = ดูย่อ • ดับเบิลคลิก = ดูเต็ม</p>
                </div>
                <button onClick={() => { setCurrentDate(new Date()); closePopup(); }} className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition">
                    วันนี้
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
                {/* Month/Year Navigation */}
                <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-2xl relative z-30">
                    <button onClick={() => changeMonth(-1)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/20 text-white hover:bg-white/30 transition">◀</button>

                    {/* Dropdown container - ref wraps both trigger and popup */}
                    <div ref={dropdownRef} className="relative">
                        <button
                            onClick={() => setShowMonthPicker(prev => !prev)}
                            className="text-center px-4 py-1 rounded-lg hover:bg-white/20 transition-colors cursor-pointer"
                        >
                            <h3 className="text-xl font-bold text-white">{THAI_MONTHS[month]}</h3>
                            <p className="text-blue-100 text-sm">{year + 543} ▼</p>
                        </button>

                        {/* Dropdown popup */}
                        {showMonthPicker && (
                            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50">
                                <MonthYearPicker
                                    currentDate={currentDate}
                                    onDateChange={handleDateSelect}
                                />
                            </div>
                        )}
                    </div>

                    <button onClick={() => changeMonth(1)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/20 text-white hover:bg-white/30 transition">▶</button>
                </div>

                {/* Day Headers */}
                <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-100 relative z-20">
                    {THAI_DAYS_SHORT.map((day, i) => (
                        <div key={day} className={`py-3 text-center text-sm font-semibold ${i === 0 ? 'text-red-500' : i === 6 ? 'text-blue-500' : 'text-slate-600'}`}>
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 relative">
                    {calendarDays.map((item, index) => {
                        const dayBookings = getBookingsForDate(item.date);
                        const activeBookings = dayBookings.filter(b => b.status !== 'CANCELLED');
                        const todayCheck = isToday(item.date);
                        const past = isPast(item.date);
                        const isSelected = popup.date?.toDateString() === item.date.toDateString();

                        const yachtGroups = {};
                        activeBookings.forEach(b => {
                            if (!yachtGroups[b.yachtId]) yachtGroups[b.yachtId] = { name: b.yachtName, bookings: [] };
                            yachtGroups[b.yachtId].bookings.push(b);
                        });

                        const totalBookings = activeBookings.length;
                        const overflow = totalBookings > 2;

                        const hasOverride = yachts.some(y => y.dateOverrides && y.dateOverrides[toDateString(item.date)]);

                        return (
                            <div
                                key={index}
                                className={`relative min-h-[110px] p-2 border-b border-r border-slate-100 transition-all select-none z-20
                                    ${!item.isCurrentMonth ? 'bg-slate-50/50' : 'bg-white'}
                                    ${item.isCurrentMonth && !past ? 'cursor-pointer hover:bg-blue-50/30' : ''}
                                    ${past ? 'opacity-50' : ''}
                                    ${todayCheck ? 'bg-blue-50/70' : ''}
                                    ${hasOverride && !todayCheck && !isSelected ? 'bg-purple-50/60' : ''}
                                    ${isSelected ? 'bg-blue-50 ring-2 ring-inset ring-blue-500 z-30' : ''}`}
                                onClick={(e) => handleDayClick(item.date, e)}
                                onDoubleClick={(e) => handleDoubleClick(item.date, e)}
                            >
                                <div className={`w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium mb-1
                                    ${todayCheck ? 'bg-blue-600 text-white' : ''}
                                    ${hasOverride && !todayCheck ? 'bg-purple-100 text-purple-700 font-bold ring-1 ring-purple-300' : ''}
                                    ${!item.isCurrentMonth ? 'text-slate-400' : 'text-slate-700'}
                                    ${index % 7 === 0 && item.isCurrentMonth && !todayCheck ? 'text-red-500' : ''}
                                    ${index % 7 === 6 && item.isCurrentMonth && !todayCheck ? 'text-blue-500' : ''}`}>
                                    {item.day}
                                </div>

                                {item.isCurrentMonth && (
                                    <div className="space-y-0.5 pointer-events-none">
                                        {Object.values(yachtGroups).slice(0, 2).map((group, gi) => (
                                            <div key={gi} className="text-[10px] leading-tight">
                                                <div className="font-semibold text-slate-600 truncate">🚤 {group.name}</div>
                                                {group.bookings.slice(0, 2).map(b => (
                                                    <div key={b.id} className={`pl-2 truncate ${STATUS_CONFIG[b.status].textColor}`}>
                                                        {b.slotStart} {b.customerName.split(' ')[0]}
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                        {overflow && (
                                            <div className="text-[10px] text-blue-600 font-medium bg-blue-50 rounded px-1 w-fit">+{totalBookings - 2} รายการ...</div>
                                        )}
                                    </div>
                                )}

                                {/* Booking Popup */}
                                {isSelected && (
                                    <div
                                        className="absolute z-50 bg-white rounded-2xl shadow-xl w-80 border border-slate-200"
                                        style={{
                                            left: (index % 7) > 3 ? 'auto' : '50%',
                                            right: (index % 7) > 3 ? '50%' : 'auto',
                                            top: popup.position === 'bottom' ? '80%' : 'auto',
                                            bottom: popup.position === 'top' ? '80%' : 'auto',
                                            transform: (index % 7) > 3 ? 'translate(10%, 10px)' : 'translate(-10%, 10px)'
                                        }}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-2xl">
                                            <div>
                                                <p className="text-xs opacity-90">{THAI_DAYS_FULL[item.date.getDay()]}</p>
                                                <p className="font-bold">{formatDateThai(item.date)}</p>
                                            </div>
                                            <button onClick={() => navigate(`/day/${toDateString(item.date)}`)} className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-medium transition">
                                                ดูเต็ม →
                                            </button>
                                        </div>

                                        <div className="p-4 max-h-[300px] overflow-y-auto">
                                            {popup.bookings.length === 0 ? (
                                                <div className="text-center py-4">
                                                    <p className="text-4xl mb-2">📅</p>
                                                    <p className="text-slate-500 text-sm">วันนี้ว่างครับ</p>
                                                    {!isPast(item.date) && (
                                                        <button onClick={() => navigate(`/day/${toDateString(item.date)}`)} className="mt-3 w-full py-2 bg-blue-50 text-blue-600 rounded-xl text-sm font-medium hover:bg-blue-100 transition">
                                                            + จองเลย
                                                        </button>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="space-y-2">
                                                    {popup.bookings.map(book => (
                                                        <div key={book.id} className={`p-3 rounded-xl border ${STATUS_CONFIG[book.status].borderColor} ${STATUS_CONFIG[book.status].bgLight}`}>
                                                            <div className="flex justify-between items-start mb-1">
                                                                <span className="font-semibold text-slate-900 text-sm">{book.customerName}</span>
                                                                <span className={`px-1.5 py-0.5 rounded text-[10px] ${STATUS_CONFIG[book.status].bgLight} ${STATUS_CONFIG[book.status].textColor}`}>
                                                                    {STATUS_CONFIG[book.status].icon} {STATUS_CONFIG[book.status].label}
                                                                </span>
                                                            </div>
                                                            <div className="text-xs text-slate-500 space-y-0.5">
                                                                <p>🚤 {book.yachtName}</p>
                                                                <p>⏰ {book.slotStart}-{book.slotEnd} ({book.slotLabel})</p>
                                                                <p>📞 {book.phone}</p>
                                                                <p>📧 {book.email}</p>
                                                                <p className="font-mono text-blue-600">ID: {book.rewardId}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 justify-center p-4 bg-white rounded-2xl border border-slate-100">
                {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                    <div key={key} className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${config.color}`} />
                        <span className="text-sm text-slate-600">{config.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
