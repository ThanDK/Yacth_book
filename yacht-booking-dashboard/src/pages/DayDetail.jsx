// ===== DAY DETAIL PAGE =====
import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { STATUS_CONFIG, UI_TEXT } from '../config/app.config';
import { THAI_DAYS_FULL, formatDateThai } from '../utils/date.utils';
import { getSlotsForDate } from '../utils/booking.utils';
// ADDED: Import YachtForm
import { BookingDetailModal, DateOverrideForm, YachtForm, Modal } from '../components/common';
import { useToast } from '../contexts/ToastContext';
import { savedUserService } from '../services';

export default function DayDetail({ yachts, addBooking, updateBooking, deleteBooking, updateYacht, getBookingsForDate, isSlotBooked, calendarMode }) {
    const { dateStr } = useParams();
    const navigate = useNavigate();
    const toast = useToast();
    const selectedDate = useMemo(() => new Date(dateStr), [dateStr]);

    const [showModal, setShowModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);

    // ADDED: State for Schedule Override Modal
    const [showOverrideModal, setShowOverrideModal] = useState(false);
    const [overrideYacht, setOverrideYacht] = useState(null);

    // ADDED: State for Default Schedule Modal
    const [showYachtModal, setShowYachtModal] = useState(false);
    const [editingYacht, setEditingYacht] = useState(null);

    const [selectedSlot, setSelectedSlot] = useState(null);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [savedUsers, setSavedUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState('');

    // Fetch saved users
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const users = await savedUserService.getAll();
                setSavedUsers(users);
            } catch (err) {
                console.error('Failed to fetch saved users:', err);
            }
        };
        fetchUsers();
    }, []);

    // Form state for new booking
    const [form, setForm] = useState({
        bookingDate: '',
        serviceDate: '',
        customerName: '',
        phone: '',
        email: '',
        rewardId: '',
        emailSent: false,
        tokenTxTime: '',
        notes: ''
    });
    const [errors, setErrors] = useState({});

    const dayBookings = useMemo(() => getBookingsForDate(selectedDate), [getBookingsForDate, selectedDate]);
    const activeBookings = useMemo(() => dayBookings.filter(b => !['CANCELLED'].includes(b.status)), [dayBookings]);

    // Filter active yachts. If in fractional mode, this should probably filter by type too, 
    // but the parent component passes pre-filtered yachts based on mode.
    // We double check simply to be safe or just use `yachts` prop directly.
    const activeYachts = yachts.filter(y => y.isActive);

    // Check if slot is available for swap (excluding current booking)
    const checkSlotAvailable = (yachtId, date, slotId, currentBookingId) => {
        // Use reusable logic from hook
        return !isSlotBooked(yachtId, date, slotId);
    };

    // Handle user selection - auto-fill form
    const handleUserSelect = (userId) => {
        setSelectedUserId(userId);
        if (!userId) return;

        const user = savedUsers.find(u => u.id === userId);
        if (user) {
            setForm(prev => ({
                ...prev,
                customerName: user.name,
                phone: user.phone,
                email: user.email || ''
            }));
        }
    };

    // Open modal for new booking
    const openNewBooking = (yacht, slot) => {
        setSelectedSlot({ yacht, slot });
        setSelectedUserId('');
        const now = new Date();
        // Adjust to local timezone ISO string for input
        const pad = (n) => String(n).padStart(2, '0');
        const dateTimeStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;

        setForm({
            bookingDate: dateTimeStr,
            serviceDate: selectedDate.toISOString().split('T')[0],
            customerName: '',
            phone: '',

            email: '',
            rewardId: '',
            emailSent: false,
            tokenTxTime: '',
            notes: ''
        });
        setErrors({});
        setShowModal(true);
    };

    // ADDED: Open schedule override modal
    const openOverrideModal = (yacht) => {
        setOverrideYacht(yacht);
        setShowOverrideModal(true);
    };

    // ADDED: Open default schedule modal
    const openYachtModal = (yacht) => {
        setEditingYacht(yacht);
        setShowYachtModal(true);
    };

    // ADDED: Handle schedule override submit
    const handleOverrideSubmit = (updates) => {
        if (overrideYacht) {
            updateYacht(overrideYacht.id, updates);
            setShowOverrideModal(false);
            setOverrideYacht(null);
        }
    };

    // ADDED: Handle default schedule submit
    const handleYachtSubmit = (updates) => {
        if (editingYacht) {
            updateYacht(editingYacht.id, updates);
            setShowYachtModal(false);
            setEditingYacht(null);
        }
    };

    // Validation
    const validate = () => {
        const e = {};
        if (!form.customerName.trim()) e.customerName = 'กรุณากรอกชื่อ';
        if (!form.phone.trim()) e.phone = 'กรุณากรอกเบอร์โทร';
        if (!form.rewardId.trim()) e.rewardId = 'กรุณากรอก Reward ID';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    // Submit new booking
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;

        const serviceDateObj = new Date(form.serviceDate);
        if (isSlotBooked(selectedSlot.yacht.id, serviceDateObj, selectedSlot.slot.id)) {
            toast.warning('รอบนี้ถูกจองแล้ว!');
            return;
        }

        addBooking(
            {
                customerName: form.customerName,
                phone: form.phone,
                email: form.email,
                rewardId: form.rewardId,
                emailSent: form.emailSent,
                tokenTxTime: form.tokenTxTime,
                notes: form.notes,
                createdAt: new Date(form.bookingDate),
                serviceDate: serviceDateObj,
                status: 'PENDING'
            },
            selectedSlot.yacht,
            selectedSlot.slot
        );

        setShowModal(false);
        // Toast is handled by addBooking in useBookingState
    };

    // View booking detail
    const openDetail = (booking) => {
        setSelectedBooking(booking);
        setShowDetailModal(true);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <button onClick={() => navigate('/')} className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition">←</button>
                <div>
                    <p className="text-sm text-slate-500">{THAI_DAYS_FULL[selectedDate.getDay()]}</p>
                    <h2 className="text-2xl font-bold text-slate-900">{formatDateThai(selectedDate)}</h2>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl p-4 border border-slate-200 text-center shadow-sm">
                    <p className="text-3xl font-bold text-blue-600">{activeBookings.length}</p>
                    <p className="text-sm text-slate-500">{UI_TEXT.totalBookings}</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-200 text-center shadow-sm">
                    <p className="text-3xl font-bold text-amber-500">{activeBookings.filter(b => ['PENDING', 'PROCESSING'].includes(b.status)).length}</p>
                    <p className="text-sm text-slate-500">{UI_TEXT.pendingQueue}</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-200 text-center shadow-sm">
                    <p className="text-3xl font-bold text-emerald-500">{activeBookings.filter(b => b.status === 'CONFIRMED').length}</p>
                    <p className="text-sm text-slate-500">{UI_TEXT.confirmed}</p>
                </div>
            </div>

            {/* Yacht Slots */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="px-4 sm:px-6 py-4 bg-slate-50 border-b border-slate-200">
                    <h3 className="font-bold text-slate-800">{UI_TEXT.yachtSchedule}</h3>
                </div>

                {activeYachts.map(yacht => {
                    // Get slots for this date (uses dateOverrides if exists)
                    const slotsForDate = getSlotsForDate(yacht, selectedDate);
                    const dateStr = selectedDate.toISOString().split('T')[0];
                    const hasOverride = yacht.dateOverrides && yacht.dateOverrides[dateStr];

                    return (
                        <div key={yacht.id} className="border-b border-slate-100 last:border-0">
                            <div className="px-4 sm:px-6 py-3 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
                                <div className="flex items-center gap-2">
                                    <span className="text-xl">🚤</span>
                                    <span className="font-semibold text-slate-700">{yacht.name}</span>
                                    <span className="text-xs text-slate-400">({slotsForDate.length} รอบ)</span>
                                    {hasOverride && <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-600 rounded-full">📅 ตารางเฉพาะวัน</span>}
                                </div>
                                <div className="flex items-center gap-2 self-start sm:self-auto">
                                    {/* ADDED: Button to manage default schedule */}
                                    <button
                                        onClick={() => openYachtModal(yacht)}
                                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition text-xs flex items-center gap-1"
                                        title={UI_TEXT.editRegularSchedule}
                                    >
                                        <span>🕓</span> {UI_TEXT.regularSchedule}
                                    </button>
                                    {/* ADDED: Button to manage schedule */}
                                    <button
                                        onClick={() => openOverrideModal(yacht)}
                                        className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition text-xs flex items-center gap-1"
                                        title={UI_TEXT.manageDailySchedule}
                                    >
                                        <span>📅</span> {UI_TEXT.dailySchedule}
                                    </button>
                                </div>
                            </div>
                            <div className="p-4 sm:px-6 sm:py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {slotsForDate.map(slot => {
                                    const booking = dayBookings.find(b => b.yachtId === yacht.id && b.slotId === slot.id && b.status !== 'CANCELLED');

                                    if (booking) {
                                        return (
                                            <div key={slot.id} onClick={() => openDetail(booking)} className={`p-4 rounded-xl border cursor-pointer hover:shadow-md transition ${STATUS_CONFIG[booking.status].bgLight} ${STATUS_CONFIG[booking.status].borderColor}`}>
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <p className="font-bold text-slate-900">{booking.customerName}</p>
                                                        <p className="text-xs text-slate-600 font-mono">ID: {booking.rewardId}</p>
                                                        <p className="text-xs text-slate-400 mt-0.5">🕒 {UI_TEXT.booked} {formatDateThai(booking.createdAt, true)}</p>
                                                    </div>
                                                    <span className="text-xl">{STATUS_CONFIG[booking.status].icon}</span>
                                                </div>
                                                <div className="pt-2 border-t border-slate-200/50 text-xs text-slate-500 flex justify-between">
                                                    <span>{slot.start}-{slot.end}</span>
                                                    <span>{slot.label}</span>
                                                </div>
                                            </div>
                                        );
                                    }

                                    return (
                                        <div key={slot.id} onClick={() => openNewBooking(yacht, slot)} className="h-20 sm:h-24 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition text-slate-400 hover:text-blue-500">
                                            <span className="text-xl sm:text-2xl font-light">+</span>
                                            <span className="text-xs font-medium">{slot.start}-{slot.end}</span>
                                        </div>
                                    );
                                })}

                                {/* SHOW ORPHANED BOOKINGS (Bookings that don't match any slot anymore) */}
                                {dayBookings
                                    .filter(b => b.yachtId === yacht.id && b.status !== 'CANCELLED' && !slotsForDate.some(s => s.id === b.slotId))
                                    .map(booking => (
                                        <div key={booking.id} onClick={() => openDetail(booking)} className={`p-4 rounded-xl border-2 border-dashed cursor-pointer hover:shadow-md transition bg-red-50 border-red-200`}>
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <div className="flex items-center gap-1.5 mb-1">
                                                        <span className="text-[10px] px-1.5 py-0.5 bg-red-100 text-red-600 rounded font-bold">{UI_TEXT.reschedule}</span>
                                                        <p className="font-bold text-slate-900">{booking.customerName}</p>
                                                    </div>
                                                    <p className="text-xs text-slate-600 font-mono">ID: {booking.rewardId}</p>
                                                    <p className="text-xs text-slate-400 mt-0.5">🕒 จอง: {formatDateThai(booking.createdAt, true)}</p>
                                                </div>
                                                <span className="text-xl">{STATUS_CONFIG[booking.status].icon}</span>
                                            </div>
                                            <div className="pt-2 border-t border-red-100 text-xs text-red-500 flex justify-between italic">
                                                <span>{UI_TEXT.originalSlot}: {booking.slotStart || '?'}-{booking.slotEnd || '?'}</span>
                                                <span>{UI_TEXT.slotMissing}</span>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* NEW BOOKING MODAL */}
            {showModal && selectedSlot && (
                <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-2xl flex justify-between items-center sticky top-0 z-10">
                            <div>
                                <h3 className="font-bold text-lg">{UI_TEXT.newBookingTitle}</h3>
                                <p className="text-sm opacity-90">{selectedSlot.yacht.name} • {selectedSlot.slot.start}-{selectedSlot.slot.end}</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="text-white/80 hover:text-white text-2xl">×</button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
                            {/* Dates */}
                            <div className="grid grid-cols-1 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">{UI_TEXT.bookingDateTime}</label>
                                    <input
                                        type="datetime-local"
                                        value={form.bookingDate}
                                        onChange={e => setForm(f => ({ ...f, bookingDate: e.target.value }))}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">{UI_TEXT.lockedServiceDate}</label>
                                    <input
                                        type="date"
                                        value={form.serviceDate}
                                        disabled
                                        className="w-full px-3 py-2 border border-slate-200 bg-slate-100 text-slate-500 rounded-lg text-sm cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            {/* Select Saved User */}
                            <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                                <label className="block text-xs font-bold text-purple-700 mb-2">
                                    {UI_TEXT.selectSavedUser}
                                </label>
                                <select
                                    value={selectedUserId}
                                    onChange={(e) => handleUserSelect(e.target.value)}
                                    className="w-full px-3 py-2 border border-purple-300 rounded-lg bg-white"
                                >
                                    <option value="">{UI_TEXT.fillNew}</option>
                                    <optgroup label="🔒 Fractional Users">
                                        {savedUsers.filter(u => u.userType === 'FRACTIONAL').map(user => (
                                            <option key={user.id} value={user.id}>
                                                {user.name} ({user.phone})
                                            </option>
                                        ))}
                                    </optgroup>
                                    <optgroup label="🚤 Regular Users">
                                        {savedUsers.filter(u => u.userType === 'REGULAR').map(user => (
                                            <option key={user.id} value={user.id}>
                                                {user.name} ({user.phone})
                                            </option>
                                        ))}
                                    </optgroup>
                                </select>
                            </div>

                            {/* Customer Name */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">{UI_TEXT.customerName} <span className="text-red-500">*</span></label>
                                <input type="text" value={form.customerName} onChange={e => setForm(f => ({ ...f, customerName: e.target.value }))} placeholder="ชื่อลูกค้า" className={`w-full px-3 py-2 border rounded-lg ${errors.customerName ? 'border-red-500' : 'border-slate-300'}`} />
                            </div>

                            {/* Phone & Email */}
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">{UI_TEXT.phone} <span className="text-red-500">*</span></label>
                                    <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="08x-xxx-xxxx" className={`w-full px-3 py-2 border rounded-lg ${errors.phone ? 'border-red-500' : 'border-slate-300'}`} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">{UI_TEXT.email}</label>
                                    <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="email@example.com" className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
                                </div>
                            </div>

                            {/* Reward ID & Token Time */}
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">{UI_TEXT.rewardId} <span className="text-red-500">*</span></label>
                                    <input type="text" value={form.rewardId} onChange={e => setForm(f => ({ ...f, rewardId: e.target.value }))} placeholder="Token ID" className={`w-full px-3 py-2 border rounded-lg font-mono ${errors.rewardId ? 'border-red-500' : 'border-slate-300'}`} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">{UI_TEXT.tokenTime}</label>
                                    <input type="time" value={form.tokenTxTime} onChange={e => setForm(f => ({ ...f, tokenTxTime: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
                                </div>
                            </div>

                            {/* Email Checkbox */}
                            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
                                <input type="checkbox" id="emailSent" checked={form.emailSent} onChange={e => setForm(f => ({ ...f, emailSent: e.target.checked }))} className="w-5 h-5 text-blue-600 rounded" />
                                <label htmlFor="emailSent" className="text-sm font-bold text-slate-700 cursor-pointer">{UI_TEXT.emailConfirm}</label>
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-3 pt-4 border-t border-slate-100">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border border-slate-300 text-slate-600 rounded-xl hover:bg-slate-50 font-medium">{UI_TEXT.cancel}</button>
                                <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium shadow-lg">{UI_TEXT.save}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* BOOKING DETAIL MODAL */}
            <BookingDetailModal
                isOpen={showDetailModal && !!selectedBooking}
                onClose={() => setShowDetailModal(false)}
                booking={selectedBooking}
                yachts={yachts}
                onUpdateBooking={updateBooking}
                onDeleteBooking={deleteBooking}
                onCheckSlotAvailable={checkSlotAvailable}
            />

            {/* ADDED: ALLOW OVERRIDE SCHEDULE FROM DAY DETAIL */}
            <Modal
                isOpen={showOverrideModal}
                onClose={() => setShowOverrideModal(false)}
                title={UI_TEXT.manageTodaySchedule}
                subtitle={`${overrideYacht?.name || ''} - ${formatDateThai(selectedDate)}`}
            >
                <DateOverrideForm
                    yacht={overrideYacht}
                    initialDate={dateStr}
                    isDateLocked={true}
                    onSubmit={handleOverrideSubmit}
                    onCancel={() => setShowOverrideModal(false)}
                />
            </Modal>

            {/* ADDED: YACHT EDIT MODAL (FOR DEFAULT SLOTS) */}
            <Modal
                isOpen={showYachtModal}
                onClose={() => setShowYachtModal(false)}
                title={UI_TEXT.editRegularSchedule}
                subtitle={editingYacht?.name || ''}
            >
                <YachtForm
                    yacht={editingYacht}
                    onSubmit={handleYachtSubmit}
                    onCancel={() => setShowYachtModal(false)}
                />
            </Modal>
        </div>
    );
}
