// ===== EXPORT UTILITIES =====
import * as XLSX from 'xlsx';
import { STATUS_CONFIG } from '../config/app.config';
import { formatDateThai } from './date.utils';

/**
 * Export bookings to Excel
 * @param {Array} bookings - Bookings to export
 * @param {string} filename - Optional filename prefix
 */
export const exportBookingsToExcel = (bookings, filename = 'yacht_bookings') => {
    const data = bookings.map(b => ({
        'Booking ID': b.bookingId,
        'วันที่จอง': formatDateThai(b.createdAt),
        'วันใช้เรือ': formatDateThai(b.serviceDate),
        'เรือ': b.yachtName,
        'รอบ': `${b.slotStart}-${b.slotEnd}`,
        'ชื่อลูกค้า': b.customerName,
        'เบอร์': b.phone,
        'อีเมล': b.email || '-',
        'Reward ID': b.rewardId || '-',
        'เวลา Token เข้า': b.tokenTxTime || '-',
        'สถานะ': STATUS_CONFIG[b.status]?.label || b.status,
        'Email Confirm': b.emailSent ? 'ส่งแล้ว' : 'ยังไม่ส่ง',
        'หมายเหตุ': b.notes || '-',
        'เหตุผลยกเลิก': b.cancelReason || '-'
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Bookings');

    const dateStr = new Date().toISOString().split('T')[0];
    XLSX.writeFile(wb, `${filename}_${dateStr}.xlsx`);
};
