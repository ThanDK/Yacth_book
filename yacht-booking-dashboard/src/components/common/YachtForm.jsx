// ===== YACHT FORM COMPONENT =====
// Reusable form for adding/editing yacht
import { useState, useEffect } from 'react';
import { DEFAULT_VALUES } from '../../config/app.config';

export default function YachtForm({ yacht, onSubmit, onCancel }) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        capacity: DEFAULT_VALUES.yacht.capacity,
        timeSlots: []
    });
    const [newSlot, setNewSlot] = useState({
        start: DEFAULT_VALUES.slot.startTime,
        end: DEFAULT_VALUES.slot.endTime,
        label: ''
    });
    const [error, setError] = useState('');

    // Initialize form when yacht changes
    useEffect(() => {
        if (yacht) {
            setFormData({
                name: yacht.name || '',
                description: yacht.description || '',
                capacity: yacht.capacity || DEFAULT_VALUES.yacht.capacity,
                timeSlots: [...(yacht.timeSlots || [])]
            });
        } else {
            setFormData({
                name: '',
                description: '',
                capacity: DEFAULT_VALUES.yacht.capacity,
                timeSlots: []
            });
        }
        setError('');
    }, [yacht]);

    const addTimeSlot = () => {
        if (!newSlot.start || !newSlot.end) {
            setError('กรุณาใส่เวลาเริ่มและสิ้นสุด');
            return;
        }
        if (newSlot.start >= newSlot.end) {
            setError('เวลาสิ้นสุดต้องมากกว่าเวลาเริ่ม');
            return;
        }

        const slot = {
            id: `slot-${Date.now()}`,
            start: newSlot.start,
            end: newSlot.end,
            label: newSlot.label || `${newSlot.start}-${newSlot.end}`
        };

        setFormData(prev => ({
            ...prev,
            timeSlots: [...prev.timeSlots, slot].sort((a, b) => a.start.localeCompare(b.start))
        }));
        setNewSlot({
            start: DEFAULT_VALUES.slot.startTime,
            end: DEFAULT_VALUES.slot.endTime,
            label: ''
        });
        setError('');
    };

    const removeTimeSlot = (slotId) => {
        setFormData(prev => ({
            ...prev,
            timeSlots: prev.timeSlots.filter(s => s.id !== slotId)
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            setError('กรุณาใส่ชื่อเรือ');
            return;
        }
        if (formData.timeSlots.length === 0) {
            setError('กรุณาเพิ่มรอบเวลาอย่างน้อย 1 รอบ');
            return;
        }
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
                    ⚠️ {error}
                </div>
            )}

            {/* Name */}
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    ชื่อเรือ <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="เช่น Blue Ocean"
                />
            </div>

            {/* Description */}
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">รายละเอียด</label>
                <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={2}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    placeholder="เช่น เรือยอร์ชหรู 20 ที่นั่ง"
                />
            </div>

            {/* Capacity */}
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">จำนวนที่นั่ง</label>
                <input
                    type="number"
                    min="1"
                    max="100"
                    value={formData.capacity}
                    onChange={(e) => setFormData(prev => ({ ...prev, capacity: parseInt(e.target.value) || 1 }))}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
            </div>

            {/* Time Slots */}
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                    รอบเวลาปกติ <span className="text-red-500">*</span>
                </label>

                {/* Add new slot */}
                <div className="p-4 bg-slate-50 rounded-xl mb-3">
                    <div className="grid grid-cols-3 gap-2 mb-2">
                        <div>
                            <label className="block text-xs text-slate-500 mb-1">เริ่ม</label>
                            <input
                                type="time"
                                value={newSlot.start}
                                onChange={(e) => setNewSlot(prev => ({ ...prev, start: e.target.value }))}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-slate-500 mb-1">สิ้นสุด</label>
                            <input
                                type="time"
                                value={newSlot.end}
                                onChange={(e) => setNewSlot(prev => ({ ...prev, end: e.target.value }))}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-slate-500 mb-1">ชื่อรอบ</label>
                            <input
                                type="text"
                                value={newSlot.label}
                                onChange={(e) => setNewSlot(prev => ({ ...prev, label: e.target.value }))}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="รอบเช้า"
                            />
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={addTimeSlot}
                        className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                        ➕ เพิ่มรอบ
                    </button>
                </div>

                {/* Current slots */}
                <div className="space-y-2">
                    {formData.timeSlots.map(slot => (
                        <div key={slot.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                            <div>
                                <span className="font-semibold text-blue-700">{slot.start} - {slot.end}</span>
                                {slot.label && <span className="text-blue-500 text-sm ml-2">({slot.label})</span>}
                            </div>
                            <button
                                type="button"
                                onClick={() => removeTimeSlot(slot.id)}
                                className="text-red-500 hover:text-red-700 text-lg"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                    {formData.timeSlots.length === 0 && (
                        <p className="text-sm text-slate-400 text-center py-4">ยังไม่มีรอบเวลา</p>
                    )}
                </div>
            </div>

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
                    type="submit"
                    className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 shadow-lg transition-all"
                >
                    💾 {yacht ? 'บันทึก' : 'เพิ่มเรือ'}
                </button>
            </div>
        </form>
    );
}
