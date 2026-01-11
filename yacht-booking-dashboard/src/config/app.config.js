// ===== APP CONFIGURATION - SOFT CODED =====
// Change these values to configure the app

export const APP_CONFIG = {
    // App Info
    name: 'Yacht Booking',
    subtitle: 'Phuket Festival 2026',
    logo: '⛵',

    // API Settings (for future backend)
    apiBaseUrl: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',

    // Booking ID Prefix
    bookingIdPrefix: 'YB',

    // Date Settings
    yearOffset: 543, // Buddhist calendar offset
    locale: 'th-TH',

    // Pagination
    itemsPerPage: 20,

    // Features
    features: {
        enableEmailToggle: true,
        enableExcelExport: true,
        enableTokenCheck: true,
    }
};

// ===== DEFAULT VALUES =====
export const DEFAULT_VALUES = {
    yacht: {
        capacity: 20,
        isActive: true
    },
    slot: {
        startTime: '09:00',
        endTime: '11:00'
    },
    booking: {
        status: 'PENDING',
        emailSent: false
    }
};

// ===== UI TEXT - Easy to change all labels =====
export const UI_TEXT = {
    // Page titles
    calendar: 'ปฏิทิน',
    bookings: 'รายการจองทั้งหมด',
    settings: 'ตั้งค่าเรือ',

    // Buttons
    save: 'บันทึก',
    cancel: 'ยกเลิก',
    edit: 'แก้ไข',
    delete: 'ลบ',
    add: 'เพิ่ม',
    export: 'Export Excel',

    // Status actions
    changeStatus: 'เปลี่ยนสถานะ',
    cancelBooking: 'ยกเลิกการจอง',

    // Form labels
    customerName: 'ชื่อ-นามสกุล',
    phone: 'เบอร์โทร',
    email: 'อีเมล',
    rewardId: 'Reward ID',
    tokenTime: 'เวลาเหรียญเข้า',
    notes: 'หมายเหตุ',
    serviceDate: 'วันใช้เรือ',
    bookingDate: 'วันที่จอง',

    // Yacht
    yacht: 'เรือ',
    slot: 'รอบ',
    capacity: 'ที่นั่ง',

    // Messages
    confirmDelete: 'คุณต้องการลบหรือไม่?',
    saveSuccess: 'บันทึกเรียบร้อย!',
    slotBooked: 'รอบนี้ถูกจองแล้ว!',
    requireCancelReason: 'กรุณาระบุเหตุผลที่ยกเลิก',

    // Email
    emailSent: 'ส่งแล้ว',
    emailNotSent: 'ยังไม่ส่ง',
    emailConfirm: 'Email Confirm'
};

// ===== STATUS CONFIGURATION =====
export const STATUS_CONFIG = {
    PENDING: {
        label: 'รอดำเนินการ',
        color: 'bg-amber-500',
        textColor: 'text-amber-600',
        bgLight: 'bg-amber-50',
        borderColor: 'border-amber-200',
        icon: '🟡'
    },
    PROCESSING: {
        label: 'กำลังตรวจสอบ',
        color: 'bg-blue-500',
        textColor: 'text-blue-600',
        bgLight: 'bg-blue-50',
        borderColor: 'border-blue-200',
        icon: '🔵'
    },
    CONFIRMED: {
        label: 'ยืนยันแล้ว',
        color: 'bg-emerald-500',
        textColor: 'text-emerald-600',
        bgLight: 'bg-emerald-50',
        borderColor: 'border-emerald-200',
        icon: '🟢'
    },
    USED: {
        label: 'ใช้งานแล้ว',
        color: 'bg-slate-400',
        textColor: 'text-slate-500',
        bgLight: 'bg-slate-50',
        borderColor: 'border-slate-200',
        icon: '⚫'
    },
    NO_SHOW: {
        label: 'ไม่มา',
        color: 'bg-orange-500',
        textColor: 'text-orange-600',
        bgLight: 'bg-orange-50',
        borderColor: 'border-orange-200',
        icon: '🟠'
    },
    CANCELLED: {
        label: 'ยกเลิก',
        color: 'bg-red-500',
        textColor: 'text-red-600',
        bgLight: 'bg-red-50',
        borderColor: 'border-red-200',
        icon: '🔴'
    }
};

// ===== NAV ITEMS =====
export const NAV_ITEMS = [
    { path: '/', label: 'ปฏิทิน', icon: '📅' },
    { path: '/bookings', label: 'รายการ', icon: '📋' },
    { path: '/yachts', label: 'ตั้งค่า', icon: '⚙️' }
];

