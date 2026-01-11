// ===== SAVED USERS PAGE =====
// Simple CRUD for pre-saved customer details
import { useState, useEffect } from 'react';
import { savedUserService } from '../../services';
import { useToast } from '../../contexts/ToastContext';
import { useConfirm } from '../../contexts/ConfirmContext';
import { Modal } from '../../components/common';
import { USER_TYPE_CONFIG } from '../../config/app.config';

export default function SavedUsers() {
    const toast = useToast();
    const confirm = useConfirm();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        userType: 'REGULAR',
        notes: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const data = await savedUserService.getAll();
            setUsers(data);
        } catch (error) {
            toast.error('โหลดข้อมูลล้มเหลว');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingUser) {
                await savedUserService.update(editingUser.id, formData);
                toast.success('อัพเดทสำเร็จ');
            } else {
                await savedUserService.create(formData);
                toast.success('เพิ่มผู้ใช้สำเร็จ');
            }
            fetchData();
            closeModal();
        } catch (error) {
            toast.error('บันทึกล้มเหลว');
        }
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setFormData({
            name: user.name,
            email: user.email,
            phone: user.phone,
            userType: user.userType,
            notes: user.notes || ''
        });
        setShowModal(true);
    };

    const handleDelete = async (id, userName) => {
        const confirmed = await confirm({
            title: 'ลบผู้ใช้',
            message: `ต้องการลบ "${userName}" หรือไม่?`,
            confirmText: 'ลบ',
            cancelText: 'ยกเลิก',
            type: 'danger'
        });
        if (!confirmed) return;

        try {
            await savedUserService.delete(id);
            toast.success('ลบสำเร็จ');
            fetchData();
        } catch (error) {
            toast.error('ลบล้มเหลว');
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingUser(null);
        setFormData({ name: '', email: '', phone: '', userType: 'REGULAR', notes: '' });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">👥 Saved Users</h2>
                    <p className="text-sm text-slate-500">Pre-saved customer info for quick booking</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium shadow-lg shadow-blue-500/30"
                >
                    + Add User
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl p-4 border border-slate-200">
                    <p className="text-sm text-slate-500">Total Users</p>
                    <p className="text-2xl font-bold text-slate-900">{users.length}</p>
                </div>
                <div className="bg-white rounded-2xl p-4 border border-slate-200">
                    <p className="text-sm text-slate-500">🚤 Regular</p>
                    <p className="text-2xl font-bold text-blue-600">{users.filter(u => u.userType === 'REGULAR').length}</p>
                </div>
                <div className="bg-white rounded-2xl p-4 border border-slate-200">
                    <p className="text-sm text-slate-500">🔒 Fractional</p>
                    <p className="text-2xl font-bold text-purple-600">{users.filter(u => u.userType === 'FRACTIONAL').length}</p>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">รหัส</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">ชื่อ</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">ติดต่อ</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">ประเภท</th>
                            <th className="text-right px-6 py-4 text-sm font-semibold text-slate-600">จัดการ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="text-center py-12 text-slate-500">
                                    <p className="text-4xl mb-2">👥</p>
                                    <p>No saved users yet</p>
                                </td>
                            </tr>
                        ) : (
                            users.map(user => (
                                <tr key={user.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition">
                                    <td className="px-6 py-4">
                                        <span className="font-mono text-sm text-blue-600">{user.userId}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="font-medium text-slate-900">{user.name}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm text-slate-600">{user.phone}</p>
                                        <p className="text-sm text-slate-400">{user.email}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-lg text-sm font-medium ${USER_TYPE_CONFIG[user.userType]?.bgLight} ${USER_TYPE_CONFIG[user.userType]?.textColor}`}>
                                            {USER_TYPE_CONFIG[user.userType]?.icon} {USER_TYPE_CONFIG[user.userType]?.label}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleEdit(user)}
                                            className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition mr-2"
                                        >
                                            แก้ไข
                                        </button>
                                        <button
                                            onClick={() => handleDelete(user.id, user.name)}
                                            className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
                                        >
                                            ลบ
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            <Modal isOpen={showModal} onClose={closeModal} title={editingUser ? 'Edit User' : 'Add User'}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">ชื่อ</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">เบอร์โทร</label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">อีเมล</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">ประเภท</label>
                        <div className="flex gap-4">
                            <label className={`flex-1 flex items-center justify-center gap-2 p-3 border-2 rounded-xl cursor-pointer transition ${formData.userType === 'REGULAR' ? 'border-blue-500 bg-blue-50' : 'border-slate-200'
                                }`}>
                                <input
                                    type="radio"
                                    value="REGULAR"
                                    checked={formData.userType === 'REGULAR'}
                                    onChange={(e) => setFormData({ ...formData, userType: e.target.value })}
                                    className="hidden"
                                />
                                🚤 Regular
                            </label>
                            <label className={`flex-1 flex items-center justify-center gap-2 p-3 border-2 rounded-xl cursor-pointer transition ${formData.userType === 'FRACTIONAL' ? 'border-purple-500 bg-purple-50' : 'border-slate-200'
                                }`}>
                                <input
                                    type="radio"
                                    value="FRACTIONAL"
                                    checked={formData.userType === 'FRACTIONAL'}
                                    onChange={(e) => setFormData({ ...formData, userType: e.target.value })}
                                    className="hidden"
                                />
                                🔒 Fractional
                            </label>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">หมายเหตุ</label>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                            rows="2"
                        />
                    </div>
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50"
                        >
                            ยกเลิก
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                        >
                            {editingUser ? 'บันทึก' : 'เพิ่ม'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
