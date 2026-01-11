// ===== BOOKING DETAIL MODAL COMPONENT =====
// Reusable modal for viewing/editing booking details
// Used in: DayDetail, BookingList
import { useState, useEffect } from 'react';
import { STATUS_CONFIG } from '../../config/app.config';
import { formatDateThai, toDateString } from '../../utils/date.utils';
import { getSlotsForDate } from '../../utils/booking.utils';
import { useToast } from '../../contexts/ToastContext';
import Modal from './Modal';
import StatusSelector from './StatusSelector';

export default function BookingDetailModal({
    isOpen,
    onClose,
    booking,
    yachts = [],
    onUpdateBooking,
    onCheckSlotAvailable = () => true
}) {
    // Edit form state
    const [editForm, setEditForm] = useState({});
    const [hasChanges, setHasChanges] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [localBooking, setLocalBooking] = useState(null);

    // Toast notifications
    const toast = useToast();

    // Get active yachts
    const activeYachts = yachts.filter(y => y.isActive);

    // Initialize form when booking changes
    useEffect(() => {
        if (booking) {
            setLocalBooking(booking);
            // Use toDateString for consistent date formatting (avoids timezone issues)
            const serviceDateStr = booking.serviceDate instanceof Date
                ? toDateString(booking.serviceDate)
                : booking.serviceDate;
            setEditForm({
                customerName: booking.customerName || '',
                phone: booking.phone || '',
                email: booking.email || '',
                rewardId: booking.rewardId || '',
                tokenTxTime: booking.tokenTxTime || '',
                notes: booking.notes || '',
                yachtId: booking.yachtId,
                slotId: booking.slotId,
                serviceDate: serviceDateStr
            });
            setHasChanges(false);
            setCancelReason('');
        }
    }, [booking]);

    // Get slots for selected yacht on selected date (FIXED: now respects dateOverrides)
    const getEditSlots = () => {
        const yacht = activeYachts.find(y => y.id === editForm.yachtId);
        if (!yacht) return [];

        // Use the utility that properly handles date overrides
        const selectedDate = editForm.serviceDate ? new Date(editForm.serviceDate) : new Date();
        return getSlotsForDate(yacht, selectedDate);
    };

    // Get yacht name by ID
    const getYachtName = (yachtId) => {
        return activeYachts.find(y => y.id === yachtId)?.name || '';
    };

    // Get slot info by ID (FIXED: now checks date overrides first)
    const getSlotInfo = (yachtId, slotId, dateStr) => {
        const yacht = activeYachts.find(y => y.id === yachtId);
        if (!yacht) return null;

        // Use the utility for consistent slot resolution
        const date = dateStr ? new Date(dateStr) : new Date();
        const slots = getSlotsForDate(yacht, date);
        return slots.find(s => s.id === slotId) || null;
    };

    // Handle edit form change
    const handleEditChange = (field, value) => {
        setEditForm(prev => {
            const updated = { ...prev, [field]: value };
            // If yacht changes, reset slot to first available
            if (field === 'yachtId') {
                const yacht = activeYachts.find(y => y.id === value);
                if (yacht && yacht.timeSlots?.length > 0) {
                    updated.slotId = yacht.timeSlots[0].id;
                }
            }
            return updated;
        });
        setHasChanges(true);
    };

    // Save all changes
    const saveAllChanges = () => {
        const yacht = activeYachts.find(y => y.id === editForm.yachtId);
        const slot = yacht?.timeSlots?.find(s => s.id === editForm.slotId);

        // Check if new slot is available (if changed)
        const slotChanged = editForm.yachtId !== localBooking.yachtId ||
            editForm.slotId !== localBooking.slotId ||
            editForm.serviceDate !== new Date(localBooking.serviceDate).toISOString().split('T')[0];

        if (slotChanged) {
            if (!onCheckSlotAvailable(editForm.yachtId, editForm.serviceDate, editForm.slotId, localBooking.id)) {
                toast.warning('รอบนี้ถูกจองแล้ว! กรุณาเลือกรอบอื่น');
                return;
            }
        }

        const updates = {
            customerName: editForm.customerName,
            phone: editForm.phone,
            email: editForm.email,
            rewardId: editForm.rewardId,
            tokenTxTime: editForm.tokenTxTime,
            notes: editForm.notes,
            yachtId: editForm.yachtId,
            yachtName: yacht?.name || '',
            slotId: editForm.slotId,
            slotLabel: slot?.label || '',
            slotStart: slot?.start || '',
            slotEnd: slot?.end || '',
            serviceDate: new Date(editForm.serviceDate)
        };

        onUpdateBooking(localBooking.id, updates);
        setLocalBooking(prev => ({ ...prev, ...updates }));
        setHasChanges(false);
        toast.success('บันทึกเรียบร้อย');
    };

    // Change status
    const changeStatus = (newStatus) => {
        if (newStatus === 'CANCELLED' && !cancelReason.trim()) {
            toast.warning('กรุณาระบุเหตุผลที่ยกเลิก');
            return;
        }
        const updates = { status: newStatus };
        if (newStatus === 'CANCELLED') updates.cancelReason = cancelReason;
        onUpdateBooking(localBooking.id, updates);
        setLocalBooking(prev => ({ ...prev, ...updates }));
        setCancelReason('');
    };

    // Toggle email status
    const toggleEmailStatus = () => {
        const newVal = !localBooking.emailSent;
        onUpdateBooking(localBooking.id, { emailSent: newVal });
        setLocalBooking(prev => ({ ...prev, emailSent: newVal }));
    };

    // Check if slot/yacht changed (use toDateString for consistent date comparison)
    const localServiceDateStr = localBooking ? toDateString(localBooking.serviceDate) : '';
    const isSlotChanged = localBooking && (
        editForm.yachtId !== localBooking.yachtId ||
        editForm.slotId !== localBooking.slotId ||
        editForm.serviceDate !== localServiceDateStr
    );

    // Generate swap message
    const getSwapMessage = () => {
        if (!isSlotChanged || !localBooking) return null;

        const fromSlot = getSlotInfo(localBooking.yachtId, localBooking.slotId, localServiceDateStr);
        const toSlot = getSlotInfo(editForm.yachtId, editForm.slotId, editForm.serviceDate);

        const fromText = `${localBooking.yachtName} ${fromSlot?.start || ''}-${fromSlot?.end || ''} (${formatDateThai(localBooking.serviceDate)})`;
        const toText = `${getYachtName(editForm.yachtId)} ${toSlot?.start || ''}-${toSlot?.end || ''} (${formatDateThai(new Date(editForm.serviceDate))})`;

        return (
            <div className="text-xs text-indigo-700 bg-indigo-100 px-3 py-2 rounded-lg">
                ⚠️ จะย้ายจาก <b>{fromText}</b> → <b>{toText}</b>
            </div>
        );
    };

    if (!localBooking) return null;

    const statusConfig = STATUS_CONFIG[localBooking.status] || STATUS_CONFIG.PENDING;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={localBooking.customerName}
            subtitle={localBooking.bookingId}
        >
            <div className="space-y-4">
                {/* 1️⃣ STATUS BANNER */}
                <div className={`flex items-center gap-4 p-4 rounded-xl border ${statusConfig.bgLight} ${statusConfig.borderColor}`}>
                    <span className="text-3xl">{statusConfig.icon}</span>
                    <p className={`font-bold text-lg ${statusConfig.textColor}`}>{statusConfig.label}</p>
                </div>

                {/* 2️⃣ STATUS CHANGE */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <p className="text-xs font-bold text-slate-600 uppercase mb-3">เปลี่ยนสถานะ</p>
                    <StatusSelector currentStatus={localBooking.status} onStatusChange={changeStatus} />
                </div>

                {/* 3️⃣ EMAIL CONFIRM */}
                <div
                    onClick={toggleEmailStatus}
                    className={`p-3 rounded-lg border cursor-pointer transition hover:opacity-80 ${localBooking.emailSent ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}
                >
                    <p className="text-xs font-bold">Email Confirm (คลิกเพื่อเปลี่ยน)</p>
                    <p className={`font-medium ${localBooking.emailSent ? 'text-emerald-600' : 'text-slate-400'}`}>
                        {localBooking.emailSent ? '🟢 ส่งแล้ว' : '⚪ ยังไม่ส่ง'}
                    </p>
                </div>

                {/* EDITABLE: Customer Info */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                    <p className="text-xs font-bold text-slate-500 uppercase">ข้อมูลลูกค้า</p>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs text-slate-400">ชื่อ-นามสกุล</label>
                            <input
                                type="text"
                                value={editForm.customerName || ''}
                                onChange={e => handleEditChange('customerName', e.target.value)}
                                className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded focus:border-blue-500 outline-none font-medium"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-slate-400">เบอร์โทร</label>
                            <input
                                type="tel"
                                value={editForm.phone || ''}
                                onChange={e => handleEditChange('phone', e.target.value)}
                                className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded focus:border-blue-500 outline-none"
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="text-xs text-slate-400">อีเมล</label>
                            <input
                                type="email"
                                value={editForm.email || ''}
                                onChange={e => handleEditChange('email', e.target.value)}
                                placeholder="ไม่มีอีเมล"
                                className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded focus:border-blue-500 outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* EDITABLE: Reward & Token */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                        <label className="text-xs text-blue-600 font-bold">Reward ID</label>
                        <input
                            type="text"
                            value={editForm.rewardId || ''}
                            onChange={e => handleEditChange('rewardId', e.target.value)}
                            className="w-full px-2 py-1 text-lg font-bold font-mono bg-transparent border-b border-blue-200 focus:border-blue-500 outline-none"
                        />
                    </div>
                    <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
                        <label className="text-xs text-amber-600 font-bold">เวลาเหรียญเข้า</label>
                        <input
                            type="time"
                            value={editForm.tokenTxTime || ''}
                            onChange={e => handleEditChange('tokenTxTime', e.target.value)}
                            className="w-full px-2 py-1 text-lg font-bold bg-transparent border-b border-amber-200 focus:border-amber-500 outline-none"
                        />
                    </div>
                </div>

                {/* SWAP YACHT & SLOT */}
                <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-200 space-y-3">
                    <p className="text-xs font-bold text-indigo-600 uppercase flex items-center gap-2">
                        🔄 เปลี่ยนเรือ / รอบ
                    </p>
                    <div>
                        <label className="text-xs text-slate-500">วันใช้เรือ</label>
                        <input
                            type="date"
                            value={editForm.serviceDate || ''}
                            onChange={e => handleEditChange('serviceDate', e.target.value)}
                            className="w-full px-3 py-2 border border-indigo-200 rounded-lg text-sm focus:border-indigo-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-slate-500">เลือกเรือ</label>
                        <select
                            value={editForm.yachtId || ''}
                            onChange={e => handleEditChange('yachtId', e.target.value)}
                            className="w-full px-3 py-2 border border-indigo-200 rounded-lg text-sm focus:border-indigo-500 outline-none font-medium"
                        >
                            {activeYachts.map(y => (
                                <option key={y.id} value={y.id}>🚤 {y.name} ({y.timeSlots?.length || 0} รอบ)</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="text-xs text-slate-500">เลือกรอบเวลา</label>
                        <select
                            value={editForm.slotId || ''}
                            onChange={e => handleEditChange('slotId', e.target.value)}
                            className="w-full px-3 py-2 border border-indigo-200 rounded-lg text-sm focus:border-indigo-500 outline-none font-medium"
                        >
                            {getEditSlots().map(s => {
                                const isBooked = !onCheckSlotAvailable(editForm.yachtId, editForm.serviceDate, s.id, localBooking.id);
                                return (
                                    <option key={s.id} value={s.id} disabled={isBooked}>
                                        {s.start}-{s.end} ({s.label}) {isBooked ? '❌ ถูกจองแล้ว' : '✅'}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                    {getSwapMessage()}
                </div>

                {/* Notes */}
                <div>
                    <label className="text-xs text-slate-500 font-bold">หมายเหตุ</label>
                    <textarea
                        value={editForm.notes || ''}
                        onChange={e => handleEditChange('notes', e.target.value)}
                        placeholder="หมายเหตุเพิ่มเติม..."
                        rows={2}
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:border-blue-500 outline-none resize-none"
                    />
                </div>

                {/* SAVE BUTTON */}
                {hasChanges && (
                    <button
                        onClick={saveAllChanges}
                        className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-lg"
                    >
                        💾 บันทึกการแก้ไข
                    </button>
                )}

                {/* Cancel Zone */}
                <div className="pt-4 border-t border-red-100">
                    <p className="text-sm font-bold text-red-600 mb-2">ยกเลิกการจอง:</p>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={cancelReason}
                            onChange={e => setCancelReason(e.target.value)}
                            placeholder="เหตุผลที่ยกเลิก..."
                            className="flex-1 px-3 py-2 border border-red-200 rounded-lg text-sm"
                        />
                        <button
                            onClick={() => changeStatus('CANCELLED')}
                            className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-medium hover:bg-red-100"
                        >
                            🔴 ยกเลิก
                        </button>
                    </div>
                </div>

                {localBooking.status === 'CANCELLED' && localBooking.cancelReason && (
                    <div className="p-3 bg-red-50 rounded-lg border border-red-100">
                        <p className="text-xs text-red-600 font-bold">เหตุผลที่ยกเลิก:</p>
                        <p className="text-sm text-red-800">{localBooking.cancelReason}</p>
                    </div>
                )}
            </div>
        </Modal>
    );
}
