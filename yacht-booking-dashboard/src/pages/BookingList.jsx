// ===== BOOKING LIST PAGE =====
import { useState, useMemo } from 'react';
import { STATUS_CONFIG, UI_TEXT } from '../config/app.config';
import { formatDateThai, toDateString } from '../utils/date.utils';
import { getSlotsForDate } from '../utils/booking.utils';
import { exportBookingsToExcel } from '../utils/export.utils';
import { StatusBadge, BookingDetailModal, DateRangePicker } from '../components/common';
import { useBookingFilter } from '../hooks/useBookingFilter';

export default function BookingList({ bookings, yachts, updateBooking, deleteBooking }) {
    const {
        search, setSearch,
        statusFilter, setStatusFilter,
        yachtFilter, setYachtFilter,
        filteredBookings: filtered
    } = useBookingFilter(bookings);

    // Date range filter state
    const [dateRange, setDateRange] = useState({ from: null, to: null });
    const [dateFilterType, setDateFilterType] = useState('SERVICE_DATE'); // 'SERVICE_DATE' or 'BOOKING_DATE'
    const [selectedBooking, setSelectedBooking] = useState(null);

    // Apply date range filter on top of other filters
    const dateFilteredBookings = useMemo(() => filtered.filter(b => {
        if (!dateRange.from) return true;

        const targetDate = dateFilterType === 'SERVICE_DATE' ? b.serviceDate : b.createdAt;
        const dateObj = new Date(targetDate);
        const dateOnly = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
        const fromDate = new Date(dateRange.from.getFullYear(), dateRange.from.getMonth(), dateRange.from.getDate());

        if (dateRange.to) {
            const toDate = new Date(dateRange.to.getFullYear(), dateRange.to.getMonth(), dateRange.to.getDate());
            return dateOnly >= fromDate && dateOnly <= toDate;
        }
        return dateOnly.getTime() === fromDate.getTime();
    }), [filtered, dateRange, dateFilterType]);

    // Check if slot is available for swap
    const checkSlotAvailable = (yachtId, date, slotId, currentBookingId) => {
        const dateStr = toDateString(new Date(date));
        return !bookings.some(b =>
            b.id !== currentBookingId &&
            b.yachtId === yachtId &&
            toDateString(b.serviceDate) === dateStr &&
            b.slotId === slotId &&
            b.status !== 'CANCELLED'
        );
    };

    // Export with date range info
    const handleExport = () => {
        if (dateFilteredBookings.length === 0) {
            return;
        }
        exportBookingsToExcel(dateFilteredBookings);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">{UI_TEXT.allBookings}</h2>
                    <p className="text-slate-500 text-sm">{UI_TEXT.manageBookings} ({dateFilteredBookings.length} {UI_TEXT.bookingCount})</p>
                </div>
                <button
                    onClick={handleExport}
                    disabled={dateFilteredBookings.length === 0}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    📄 {UI_TEXT.export}
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col lg:flex-row gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
                {/* Search */}
                <div className="flex-1">
                    <label className="block text-xs font-medium text-slate-500 mb-1">{UI_TEXT.searchLabel}</label>
                    <input
                        type="text"
                        placeholder={UI_TEXT.searchPlaceholder}
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Date Range Picker */}
                <div className="lg:w-auto flex gap-2">
                    <div className="w-32">
                        <label className="block text-xs font-medium text-slate-500 mb-1">{UI_TEXT.dateType}</label>
                        <select
                            value={dateFilterType}
                            onChange={e => setDateFilterType(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                        >
                            <option value="SERVICE_DATE">{UI_TEXT.serviceDateType}</option>
                            <option value="BOOKING_DATE">{UI_TEXT.bookingDateType}</option>
                        </select>
                    </div>
                    <div className="lg:w-64">
                        <label className="block text-xs font-medium text-slate-500 mb-1">{UI_TEXT.dateRange}</label>
                        <DateRangePicker
                            range={dateRange}
                            onRangeChange={setDateRange}
                            placeholder={UI_TEXT.allDays}
                        />
                    </div>
                </div>

                {/* Status Filter */}
                <div className="sm:w-40">
                    <label className="block text-xs font-medium text-slate-500 mb-1">{UI_TEXT.statusLabel}</label>
                    <select
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    >
                        <option value="ALL">{UI_TEXT.allStatuses}</option>
                        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                            <option key={key} value={key}>{cfg.icon} {cfg.label}</option>
                        ))}
                    </select>
                </div>

                {/* Yacht Filter */}
                <div className="sm:w-40">
                    <label className="block text-xs font-medium text-slate-500 mb-1">{UI_TEXT.yachtLabel}</label>
                    <select
                        value={yachtFilter}
                        onChange={e => setYachtFilter(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    >
                        <option value="ALL">{UI_TEXT.allYachts}</option>
                        {yachts.map(y => (<option key={y.id} value={y.id}>{y.name}</option>))}
                    </select>
                </div>
            </div>

            {/* Active Filters Summary */}
            {(dateRange.from || statusFilter !== 'ALL' || yachtFilter !== 'ALL' || search) && (
                <div className="flex flex-wrap items-center gap-2 text-sm">
                    <span className="text-slate-500">{UI_TEXT.activeFilters}</span>
                    {dateRange.from && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                            {dateFilterType === 'SERVICE_DATE' ? `📅 ${UI_TEXT.applied}` : `📝 ${UI_TEXT.booked}`} {formatDateThai(dateRange.from)}
                            {dateRange.to && dateRange.to.getTime() !== dateRange.from.getTime() && (
                                <> - {formatDateThai(dateRange.to)}</>
                            )}
                            <button onClick={() => setDateRange({ from: null, to: null })} className="ml-1 hover:text-blue-900">✕</button>
                        </span>
                    )}
                    {statusFilter !== 'ALL' && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full">
                            {STATUS_CONFIG[statusFilter]?.icon} {STATUS_CONFIG[statusFilter]?.label}
                            <button onClick={() => setStatusFilter('ALL')} className="ml-1 hover:text-purple-900">✕</button>
                        </span>
                    )}
                    {yachtFilter !== 'ALL' && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full">
                            🚤 {yachts.find(y => y.id === yachtFilter)?.name}
                            <button onClick={() => setYachtFilter('ALL')} className="ml-1 hover:text-orange-900">✕</button>
                        </span>
                    )}
                    {search && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-700 rounded-full">
                            🔍 "{search}"
                            <button onClick={() => setSearch('')} className="ml-1 hover:text-slate-900">✕</button>
                        </span>
                    )}
                </div>
            )}

            {/* Booking Table (Scrollable on mobile) */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[1000px]"> {/* Added min-w to force scroll on small screens if needed */}
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase">
                                <th className="px-4 py-4">ID</th>
                                <th className="px-4 py-4">{UI_TEXT.customerInfo}</th>
                                <th className="px-4 py-4">{UI_TEXT.rewardId} / {UI_TEXT.tokenTime}</th>
                                <th className="px-4 py-4">{UI_TEXT.yachtLabel} / {UI_TEXT.serviceDateType}</th>
                                <th className="px-4 py-4 text-center">{UI_TEXT.statusLabel}</th>
                                <th className="px-4 py-4 text-center">Email</th>
                                <th className="px-4 py-4 text-right">จัดการ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {dateFilteredBookings.map(booking => {
                                const yacht = yachts.find(y => y.id === booking.yachtId);
                                const slots = yacht ? getSlotsForDate(yacht, new Date(booking.serviceDate)) : [];
                                const isOrphaned = !slots.some(s => s.id === booking.slotId);

                                return (
                                    <tr key={booking.id} className={`hover:bg-slate-50/50 ${isOrphaned ? 'bg-red-50 hover:bg-red-100/50' : ''}`}>
                                        <td className="px-4 py-4 font-mono text-xs text-slate-500">
                                            {booking.bookingId}
                                            <div className="mt-1 text-[10px] text-slate-400">
                                                {UI_TEXT.booked} {formatDateThai(booking.createdAt)}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <p className="font-medium text-slate-900">{booking.customerName}</p>
                                            <p className="text-xs text-slate-500">{booking.phone}</p>
                                            {booking.email && <p className="text-xs text-blue-500">{booking.email}</p>}
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className="inline-block px-2 py-1 bg-blue-50 rounded text-xs font-mono font-medium text-blue-600">{booking.rewardId || '-'}</span>
                                            {booking.tokenTxTime && <p className="text-[10px] text-slate-400 mt-1">Tx: {booking.tokenTxTime}</p>}
                                        </td>
                                        <td className="px-4 py-4">
                                            <p className="text-sm font-medium text-slate-700">{booking.yachtName}</p>
                                            <p className="text-xs text-slate-500">{UI_TEXT.applied} {formatDateThai(booking.serviceDate)}</p>
                                            <p className="text-xs text-slate-500">เวลา: {booking.slotStart}-{booking.slotEnd}</p>
                                            {isOrphaned && (
                                                <span className="inline-flex items-center gap-1 mt-1 px-1.5 py-0.5 bg-red-100 text-red-600 text-[10px] rounded border border-red-200">
                                                    {UI_TEXT.slotNotFound}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-4 text-center">
                                            <StatusBadge status={booking.status} size="sm" />
                                        </td>
                                        <td className="px-4 py-4 text-center">
                                            <button
                                                onClick={() => updateBooking(booking.id, { emailSent: !booking.emailSent })}
                                                className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto transition ${booking.emailSent ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                                                title={booking.emailSent ? UI_TEXT.emailSent : UI_TEXT.emailNotSent}
                                            >
                                                {booking.emailSent ? '🟢' : '⚪'}
                                            </button>
                                        </td>
                                        <td className="px-4 py-4 text-right">
                                            <button onClick={() => setSelectedBooking(booking)} className="text-blue-600 hover:text-blue-800 text-sm font-medium">รายละเอียด</button>
                                        </td>
                                    </tr>
                                );
                            })}
                            {dateFilteredBookings.length === 0 && (
                                <tr><td colSpan="7" className="px-6 py-12 text-center text-slate-400">{UI_TEXT.noBookings}</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* BOOKING DETAIL MODAL - Using reusable component */}
            <BookingDetailModal
                isOpen={!!selectedBooking}
                onClose={() => setSelectedBooking(null)}
                booking={selectedBooking}
                yachts={yachts}
                onUpdateBooking={updateBooking}
                onDeleteBooking={deleteBooking}
                onCheckSlotAvailable={checkSlotAvailable}
            />
        </div>
    );
}
