// ===== DATE UTILITIES =====

export const THAI_MONTHS = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน',
    'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม',
    'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
];

export const THAI_DAYS_SHORT = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];
export const THAI_DAYS_FULL = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];

/**
 * Format date to Thai Buddhist calendar string
 * @param {Date|string} date 
 * @param {boolean} showTime - Whether to show time
 * @returns {string}
 */
export const formatDateThai = (date, showTime = false) => {
    if (!date) return '-';
    const d = new Date(date);
    const dateStr = `${d.getDate()} ${THAI_MONTHS[d.getMonth()]} ${d.getFullYear() + 543}`;

    if (showTime) {
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        return `${dateStr} ${hours}:${minutes}`;
    }

    return dateStr;
};

/**
 * Format date to short Thai format
 * @param {Date|string} date 
 * @returns {string}
 */
export const formatDateShort = (date) => {
    if (!date) return '-';
    const d = new Date(date);
    return `${d.getDate()} ${THAI_MONTHS[d.getMonth()].substring(0, 3)}`;
};

/**
 * Get date string in YYYY-MM-DD format (LOCAL timezone, not UTC)
 * @param {Date} date 
 * @returns {string}
 */
export const toDateString = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

/**
 * Check if date is today
 * @param {Date} date 
 * @returns {boolean}
 */
export const isToday = (date) => {
    return date?.toDateString() === new Date().toDateString();
};

/**
 * Check if date is in the past
 * @param {Date} date 
 * @returns {boolean}
 */
export const isPast = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
};

/**
 * Get days in month
 * @param {number} year 
 * @param {number} month 
 * @returns {number}
 */
export const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
};

/**
 * Get first day of month (0 = Sunday)
 * @param {number} year 
 * @param {number} month 
 * @returns {number}
 */
export const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
};
