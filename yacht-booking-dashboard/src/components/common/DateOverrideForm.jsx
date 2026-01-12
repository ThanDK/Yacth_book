// ===== DATE OVERRIDE FORM COMPONENT =====
// Reusable form for managing date-specific time slots
import { useState, useEffect } from 'react';
import { DEFAULT_VALUES } from '../../config/app.config';
import { formatDateThai } from '../../utils/date.utils';
import { useToast } from '../../contexts/ToastContext';

export default function DateOverrideForm({ yacht, initialDate = '', onSubmit, onCancel, isDateLocked = false }) {
    const toast = useToast();
    const [overrideDate, setOverrideDate] = useState(initialDate);
    const [overrideSlots, setOverrideSlots] = useState([]);
    const [newSlot, setNewSlot] = useState({
        start: DEFAULT_VALUES.slot.startTime,
        end: DEFAULT_VALUES.slot.endTime,
        label: ''
    });

    // Set initial date when provided (for editing)
    useEffect(() => {
        if (initialDate) {
            setOverrideDate(initialDate);
        }
    }, [initialDate]);

    // Load existing override when date changes
    useEffect(() => {
        if (yacht?.dateOverrides?.[overrideDate]) {
            setOverrideSlots([...yacht.dateOverrides[overrideDate]]);
        } else {
            setOverrideSlots([]);
        }
    }, [overrideDate, yacht]);

    const addSlot = () => {
        if (!newSlot.start || !newSlot.end) return;
        if (newSlot.start >= newSlot.end) return;

        const slot = {
            id: `override-${Date.now()}`,
            start: newSlot.start,
            end: newSlot.end,
            label: newSlot.label || `${newSlot.start}-${newSlot.end}`
        };

        setOverrideSlots(prev => [...prev, slot].sort((a, b) => a.start.localeCompare(b.start)));
        setNewSlot({
            start: DEFAULT_VALUES.slot.startTime,
            end: DEFAULT_VALUES.slot.endTime,
            label: ''
        });
    };

    const removeSlot = (slotId) => {
        setOverrideSlots(prev => prev.filter(s => s.id !== slotId));
    };

    const handleSubmit = () => {
        if (!overrideDate) {
            toast.warning('กรุณาเลือกวันที่');
            return;
        }

        const newOverrides = { ...(yacht?.dateOverrides || {}) };

        if (overrideSlots.length === 0) {
            delete newOverrides[overrideDate];
        } else {
            newOverrides[overrideDate] = overrideSlots;
        }

        onSubmit({ dateOverrides: newOverrides });
    };

    return (
        <div className="space-y-5">
            <p className="text-sm text-slate-600">
                กำหนดรอบเวลาสำหรับวันที่เฉพาะ (จะใช้แทนรอบปกติในวันนั้น)
            </p>

            {/* Date Picker */}
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    เลือกวันที่ <span className="text-red-500">*</span>
                </label>
                <input
                    type="date"
                    value={overrideDate}
                    onChange={(e) => setOverrideDate(e.target.value)}
                    disabled={isDateLocked}
                    className={`w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${isDateLocked ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : ''}`}
                />
            </div>

            {overrideDate && (
                <>
                    {/* Add Slot */}
                    <div className="p-4 bg-purple-50 rounded-xl">
                        <p className="text-xs font-bold text-purple-600 mb-3">
                            เพิ่มรอบเวลาสำหรับ {formatDateThai(new Date(overrideDate))}
                        </p>
                        <div className="grid grid-cols-3 gap-2 mb-2">
                            <div>
                                <label className="block text-xs text-slate-500 mb-1">เริ่ม</label>
                                <input
                                    type="time"
                                    value={newSlot.start}
                                    onChange={(e) => setNewSlot(prev => ({ ...prev, start: e.target.value }))}
                                    className="w-full px-3 py-2 border border-purple-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-slate-500 mb-1">สิ้นสุด</label>
                                <input
                                    type="time"
                                    value={newSlot.end}
                                    onChange={(e) => setNewSlot(prev => ({ ...prev, end: e.target.value }))}
                                    className="w-full px-3 py-2 border border-purple-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-slate-500 mb-1">ชื่อรอบ</label>
                                <input
                                    type="text"
                                    value={newSlot.label}
                                    onChange={(e) => setNewSlot(prev => ({ ...prev, label: e.target.value }))}
                                    className="w-full px-3 py-2 border border-purple-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="รอบพิเศษ"
                                />
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={addSlot}
                            className="w-full py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
                        >
                            ➕ เพิ่มรอบ
                        </button>
                    </div>

                    {/* Slots List */}
                    <div className="space-y-2">
                        {overrideSlots.length > 0 ? (
                            overrideSlots.map(slot => (
                                <div key={slot.id} className="flex items-center justify-between p-3 bg-purple-50 rounded-xl">
                                    <div>
                                        <span className="font-semibold text-purple-700">{slot.start} - {slot.end}</span>
                                        {slot.label && <span className="text-purple-500 text-sm ml-2">({slot.label})</span>}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeSlot(slot.id)}
                                        className="text-red-500 hover:text-red-700 text-lg"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-slate-400 text-center py-4">
                                ยังไม่มีรอบเวลา (จะใช้รอบปกติ)
                            </p>
                        )}
                    </div>
                </>
            )}

            {/* Submit */}
            <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-medium hover:bg-slate-50 transition-colors"
                >
                    ยกเลิก
                </button>
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!overrideDate}
                    className="flex-1 px-4 py-2.5 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    💾 บันทึก
                </button>
            </div>
        </div>
    );
}
