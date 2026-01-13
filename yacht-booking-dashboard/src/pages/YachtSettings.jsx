// ===== YACHT SETTINGS PAGE =====
import { useState } from 'react';
import { formatDateThai } from '../utils/date.utils';
import { Modal, YachtForm, DateOverrideForm } from '../components/common';
import { UI_TEXT } from '../config/app.config';
import { useToast } from '../contexts/ToastContext';
import { useConfirm } from '../contexts/ConfirmContext';

export default function YachtSettings({ yachts, bookings, addYacht, updateYacht, deleteYacht }) {
    const { success, error } = useToast();
    const confirm = useConfirm();
    // Yacht modal state
    const [isYachtModalOpen, setIsYachtModalOpen] = useState(false);
    const [editingYacht, setEditingYacht] = useState(null);

    // Override modal state
    const [isOverrideModalOpen, setIsOverrideModalOpen] = useState(false);
    const [overrideYacht, setOverrideYacht] = useState(null);
    const [editingOverrideDate, setEditingOverrideDate] = useState('');

    // ===== YACHT CRUD =====
    const openAddYacht = () => {
        setEditingYacht(null);
        setIsYachtModalOpen(true);
    };

    const openEditYacht = (yacht) => {
        setEditingYacht(yacht);
        setIsYachtModalOpen(true);
    };

    const handleYachtSubmit = (formData) => {
        if (editingYacht) {
            updateYacht(editingYacht.id, formData);
        } else {
            addYacht(formData);
        }
        setIsYachtModalOpen(false);
    };

    const handleDelete = async (id, yachtName) => {
        const confirmed = await confirm({
            title: UI_TEXT.deleteYacht,
            message: UI_TEXT.confirmDeleteYacht.replace('{name}', yachtName),
            confirmText: UI_TEXT.delete,
            cancelText: UI_TEXT.cancel,
            type: 'danger'
        });

        if (confirmed) {
            const result = await deleteYacht(id);
            if (result && !result.success) {
                error(result.message);
            }
        }
    };

    const getActiveBookingCount = (yachtId) => {
        return bookings.filter(b => b.yachtId === yachtId && !['CANCELLED', 'USED'].includes(b.status)).length;
    };

    // ===== DATE OVERRIDE =====
    const openAddOverride = (yacht) => {
        setOverrideYacht(yacht);
        setEditingOverrideDate('');
        setIsOverrideModalOpen(true);
    };

    const openEditOverride = (yacht, dateStr) => {
        setOverrideYacht(yacht);
        setEditingOverrideDate(dateStr);
        setIsOverrideModalOpen(true);
    };

    const handleOverrideSubmit = (updates) => {
        updateYacht(overrideYacht.id, updates);
        setIsOverrideModalOpen(false);
        // Alert replaced by toast in hook or explicitly here if needed. 
        // Hook `updateYacht` has generic success message. 
        // If we want specific message for override:
        // Actually hook already says "แก้ไขข้อมูลเรือสำเร็จ". That covers it.
    };

    const removeOverride = (yachtId, dateStr) => {
        const yacht = yachts.find(y => y.id === yachtId);
        if (!yacht) return;

        const newOverrides = { ...yacht.dateOverrides };
        delete newOverrides[dateStr];
        updateYacht(yachtId, { dateOverrides: newOverrides });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">{UI_TEXT.settingsTitle}</h2>
                    <p className="text-slate-500 text-sm mt-1">{UI_TEXT.settingsSubtitle}</p>
                </div>
                <button
                    onClick={openAddYacht}
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl font-medium text-sm hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2"
                >
                    <span>➕</span> {UI_TEXT.addYacht}
                </button>
            </div>

            {/* Yacht Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {yachts.map(yacht => (
                    <div
                        key={yacht.id}
                        className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lg hover:shadow-slate-200/50 transition-all"
                    >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${yacht.yachtType === 'FRACTIONAL'
                                    ? 'bg-gradient-to-br from-purple-100 to-indigo-100'
                                    : 'bg-gradient-to-br from-blue-100 to-indigo-100'
                                    }`}>
                                    <span className="text-2xl">{yacht.yachtType === 'FRACTIONAL' ? '🔒' : '🚤'}</span>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold text-slate-900">{yacht.name}</h3>
                                        {yacht.yachtType === 'FRACTIONAL' && (
                                            <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                                                Fractional
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-500">{yacht.capacity} {UI_TEXT.capacity}</p>
                                </div>
                            </div>
                            <div className="flex gap-1">
                                <button onClick={() => openEditYacht(yacht)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="แก้ไข">
                                    ✏️
                                </button>
                                <button onClick={() => openAddOverride(yacht)} className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors" title="เพิ่มรอบพิเศษ">
                                    📅
                                </button>
                                <button onClick={() => handleDelete(yacht.id, yacht.name)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="ลบ">
                                    🗑️
                                </button>
                            </div>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-slate-600 mb-4">{yacht.description}</p>

                        {/* Default Time Slots */}
                        <div className="space-y-2 mb-4">
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{UI_TEXT.regularSlots}</p>
                            <div className="flex flex-wrap gap-2">
                                {yacht.timeSlots.map(slot => (
                                    <div
                                        key={slot.id}
                                        className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium"
                                    >
                                        <span className="font-semibold">{slot.start}-{slot.end}</span>
                                        {slot.label && <span className="text-blue-500 ml-1">({slot.label})</span>}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Date Overrides - Clickable to edit */}
                        {yacht.dateOverrides && Object.keys(yacht.dateOverrides).length > 0 && (
                            <div className="space-y-2 mb-4">
                                <p className="text-xs font-medium text-purple-600 uppercase tracking-wide">📅 {UI_TEXT.dateOverrides} ({UI_TEXT.clickToEdit})</p>
                                <div className="space-y-1">
                                    {Object.entries(yacht.dateOverrides).map(([dateStr, slots]) => (
                                        <div
                                            key={dateStr}
                                            className="flex items-center justify-between p-2 bg-purple-50 rounded-lg cursor-pointer hover:bg-purple-100 transition"
                                            onClick={() => openEditOverride(yacht, dateStr)}
                                        >
                                            <div>
                                                <span className="text-xs font-bold text-purple-700">{formatDateThai(new Date(dateStr))}</span>
                                                <span className="text-xs text-purple-500 ml-2">({slots.length} {UI_TEXT.slot})</span>
                                            </div>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); removeOverride(yacht.id, dateStr); }}
                                                className="text-red-400 hover:text-red-600 text-sm"
                                                title="ลบรอบพิเศษ"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Stats */}
                        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${yacht.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                {yacht.isActive ? `🟢 ${UI_TEXT.active}` : `🔴 ${UI_TEXT.inactive}`}
                            </span>
                            <span className="text-xs text-slate-500">
                                {getActiveBookingCount(yacht.id)} {UI_TEXT.bookingCount}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {yachts.length === 0 && (
                <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
                    <span className="text-6xl block mb-4">🚤</span>
                    <p className="text-slate-500 mb-4">{UI_TEXT.noYachts}</p>
                    <button onClick={openAddYacht} className="px-4 py-2 bg-blue-600 text-white rounded-xl font-medium text-sm hover:bg-blue-700 transition-colors">
                        {UI_TEXT.addFirstYacht}
                    </button>
                </div>
            )}

            {/* ===== YACHT EDIT MODAL ===== */}
            <Modal
                isOpen={isYachtModalOpen}
                onClose={() => setIsYachtModalOpen(false)}
                title={editingYacht ? `✏️ ${UI_TEXT.editYacht}` : `➕ ${UI_TEXT.addYacht}`}
                subtitle={editingYacht?.name || ''}
            >
                <YachtForm
                    yacht={editingYacht}
                    onSubmit={handleYachtSubmit}
                    onCancel={() => setIsYachtModalOpen(false)}
                />
            </Modal>

            {/* ===== DATE OVERRIDE MODAL ===== */}
            <Modal
                isOpen={isOverrideModalOpen}
                onClose={() => setIsOverrideModalOpen(false)}
                title={editingOverrideDate ? `✏️ ${UI_TEXT.edit} ${UI_TEXT.dateOverrides}` : `📅 ${UI_TEXT.addOverride}`}
                subtitle={overrideYacht?.name || ''}
            >
                <DateOverrideForm
                    yacht={overrideYacht}
                    initialDate={editingOverrideDate}
                    onSubmit={handleOverrideSubmit}
                    onCancel={() => setIsOverrideModalOpen(false)}
                />
            </Modal>
        </div>
    );
}
