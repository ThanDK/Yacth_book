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
    today: 'วันนี้',
    viewShort: 'คลิก 1 ครั้ง = ดูย่อ • ดับเบิลคลิก = ดูเต็ม',
    viewFull: 'ดูเต็ม →',
    bookNow: '+ จองเลย',
    emptyDay: 'วันนี้ว่าง',
    fractionalMode: 'แสดงเฉพาะเรือ Fractional • {count} ลำ',
    calendarTitle: 'ปฏิทินจอง',

    // Booking Details
    bookedAt: 'จองเมื่อ',
    customerInfo: 'ข้อมูลลูกค้า',
    additionalNotes: 'หมายเหตุเพิ่มเติม...',
    confirmDeleteBooking: 'ยืนยันลบการจอง',
    confirmDeleteBookingMsg: 'ต้องการลบการจองของ "{name}" หรือไม่? (ไม่สามารถกู้คืนได้)',
    deleteNow: 'ลบทันที',
    trashBooking: '🗑️ ลบข้อมูล (Trash)',
    cancelBooking: 'ยกเลิกการจอง:',
    cancelReason: 'เหตุผลที่ยกเลิก:',
    cancelReasonPlaceholder: 'เหตุผลที่ยกเลิก...',
    clickToChange: 'คลิกเพื่อเปลี่ยน',
    saveChanges: '💾 บันทึกการแก้ไข',
    swapYachtSlot: '🔄 เปลี่ยนเรือ / รอบ',
    serviceDate: '📅 วันที่เข้าใช้บริการ',
    selectYacht: 'เลือกเรือ',
    selectSlot: 'เลือกรอบเวลา',
    willSwap: '⚠️ จะย้ายจาก',

    // Booking List
    allBookings: 'รายการจองทั้งหมด',
    manageBookings: 'จัดการการจองและตรวจสอบสถานะ',
    searchLabel: 'ค้นหา',
    searchPlaceholder: 'ชื่อ, เบอร์, อีเมล, Reward ID...',
    dateType: 'ประเภทวันที่',
    serviceDateType: 'วันที่ใช้บริการ',
    bookingDateType: 'วันที่จอง',
    dateRange: 'ช่วงวันที่',
    allDays: 'ทุกวัน',
    statusLabel: 'สถานะ',
    allStatuses: 'ทั้งหมด',
    yachtLabel: 'เรือ',
    allYachts: 'ทุกลำ',
    activeFilters: 'ตัวกรองที่ใช้:',
    applied: 'ใช้:',
    booked: 'จอง:',
    noBookings: 'ไม่พบข้อมูลการจอง',
    details: 'รายละเอียด',
    slotNotFound: '⚠️ ไม่พบรอบเรือ',

    // Day Detail
    back: 'ย้อนกลับ',
    totalBookings: 'การจองทั้งหมด',
    pendingQueue: 'รอดำเนินการ',
    confirmed: 'ยืนยันแล้ว',
    yachtSchedule: 'ตารางรอบเรือ',
    editRegularSchedule: 'แก้ไขรอบเวลาปกติ',
    manageDailySchedule: 'จัดการตารางเดินเรือของวันนี้',
    dailySchedule: 'เฉพาะวัน',
    regularSchedule: 'รอบปกติ',
    reschedule: '⚠️ เลื่อน/เปลี่ยนรอบ',
    originalSlot: 'รอบเดิม',
    slotMissing: '(ไม่พบในตารางปัจจุบัน)',
    newBookingTitle: '📝 ลงข้อมูลการจอง',
    bookingDateTime: 'วัน-เวลาที่จอง',
    lockedServiceDate: 'วันใช้เรือ (ล็อคตามหน้าตาราง)',
    selectSavedUser: '👥 เลือกจากรายชื่อที่บันทึกไว้ (หรือกรอกใหม่)',
    fillNew: '-- กรอกข้อมูลใหม่ --',
    manageTodaySchedule: '📅 จัดการตารางเรือวันนี้',

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

    // Yacht Settings
    settingsTitle: 'ตั้งค่าเรือ',
    settingsSubtitle: 'จัดการข้อมูลเรือและรอบเวลา',
    addYacht: 'เพิ่มเรือ',
    editYacht: 'แก้ไขเรือ',
    deleteYacht: 'ลบเรือ',
    regularSlots: 'รอบเวลาปกติ',
    dateOverrides: 'ตารางเฉพาะวัน',
    clickToEdit: 'คลิกเพื่อแก้ไข',
    addOverride: 'เพิ่มรอบพิเศษ',
    noYachts: 'ยังไม่มีเรือในระบบ',
    addFirstYacht: 'เพิ่มเรือลำแรก',
    active: 'เปิดใช้งาน',
    inactive: 'ปิดใช้งาน',
    bookingCount: 'การจอง',

    // Messages
    confirmDelete: 'คุณต้องการลบหรือไม่?',
    confirmDeleteYacht: 'คุณต้องการลบ "{name}" หรือไม่?',
    saveSuccess: 'บันทึกเรียบร้อย!',
    slotBooked: 'รอบนี้ถูกจองแล้ว!',
    requireCancelReason: 'กรุณาระบุเหตุผลที่ยกเลิก',
    deleteSuccess: 'ลบเรียบร้อย',
    cannotDeleteYacht: 'ไม่สามารถลบได้ มีการจองที่ยังไม่เสร็จสิ้น',

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

// ===== SAVED USERS NAV =====
export const SAVED_USERS_PATH = '/users';

// ===== CALENDAR MODE CONFIGURATION =====
export const CALENDAR_MODE_CONFIG = {
    regular: {
        label: 'Regular',
        icon: '🚤',
        gradient: 'from-blue-600 to-indigo-600',
        bgLight: 'bg-blue-50',
        textColor: 'text-blue-600',
        hoverBg: 'hover:bg-blue-100',
        buttonBg: 'bg-blue-600',
        subtitleColor: 'text-blue-100'
    },
    fractional: {
        label: 'Fractional',
        icon: '🔒',
        gradient: 'from-purple-600 to-indigo-600',
        bgLight: 'bg-purple-50',
        textColor: 'text-purple-600',
        hoverBg: 'hover:bg-purple-100',
        buttonBg: 'bg-purple-600',
        subtitleColor: 'text-purple-100'
    }
};

// ===== USER TYPE CONFIGURATION =====
export const USER_TYPE_CONFIG = {
    REGULAR: {
        label: 'Regular',
        icon: '🚤',
        bgLight: 'bg-blue-50',
        textColor: 'text-blue-600'
    },
    FRACTIONAL: {
        label: 'Fractional',
        icon: '🔒',
        bgLight: 'bg-purple-50',
        textColor: 'text-purple-600'
    }
};
