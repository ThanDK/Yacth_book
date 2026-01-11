// ===== BOOKING UTILITIES =====
import { APP_CONFIG, DEFAULT_VALUES } from '../config/app.config';
import { toDateString } from './date.utils';

// ... existing code ...

/**
 * Generate next booking ID
 * @param {number} currentCount - Current booking count
 * @returns {string}
 */
export const generateBookingId = (currentCount) => {
    const year = new Date().getFullYear();
    const count = currentCount + 1;
    return `${APP_CONFIG.bookingIdPrefix}-${year}-${count.toString().padStart(4, '0')}`;
};

/**
 * Get time slots for a yacht on a specific date
 * Returns date-specific overrides if exists, otherwise returns default time slots
 * @param {Object} yacht - Yacht object
 * @param {Date} date - The date to get slots for
 * @returns {Array} Time slots for that date
 */
export const getSlotsForDate = (yacht, date) => {
    if (!yacht) return [];

    const dateStr = toDateString(date);

    // Check if yacht has date-specific overrides for this date
    if (yacht.dateOverrides && yacht.dateOverrides[dateStr]) {
        return yacht.dateOverrides[dateStr];
    }

    // Return default time slots
    return yacht.timeSlots || [];
};

/**
 * Check if a slot is booked on a specific date
 * @param {Array} bookings - All bookings
 * @param {string} yachtId 
 * @param {Date} date 
 * @param {string} slotId 
 * @returns {boolean}
 */
export const isSlotBooked = (bookings, yachtId, date, slotId) => {
    const dateStr = toDateString(date);
    return bookings.some(b =>
        b.yachtId === yachtId &&
        toDateString(b.serviceDate) === dateStr &&
        b.slotId === slotId &&
        b.status !== 'CANCELLED'
    );
};

/**
 * Get bookings for a specific date
 * @param {Array} bookings - All bookings
 * @param {Date} date 
 * @returns {Array}
 */
export const getBookingsForDate = (bookings, date) => {
    if (!date) return [];
    const dateStr = toDateString(date);
    return bookings
        .filter(b => toDateString(b.serviceDate) === dateStr)
        .sort((a, b) => a.slotStart.localeCompare(b.slotStart));
};

/**
 * Get available slots for yacht on date
 * @param {Array} bookings - All bookings
 * @param {Object} yacht 
 * @param {Date} date 
 * @returns {Array}
 */
export const getAvailableSlots = (bookings, yacht, date) => {
    if (!yacht || !yacht.timeSlots) return [];
    return yacht.timeSlots.filter(slot => !isSlotBooked(bookings, yacht.id, date, slot.id));
};

/**
 * Create a new booking object with all required fields
 * @param {Object} formData - Form data
 * @param {Object} yacht - Yacht object
 * @param {Object} slot - Time slot object
 * @param {string} bookingId - Generated booking ID
 * @returns {Object}
 */
export const createBookingObject = (formData, yacht, slot, bookingId) => {
    return {
        id: Date.now().toString(),
        bookingId,
        // Yacht & slot info
        yachtId: yacht.id,
        yachtName: yacht.name,
        slotId: slot.id,
        slotLabel: slot.label,
        slotStart: slot.start,
        slotEnd: slot.end,
        // Dates
        createdAt: formData.createdAt || new Date(),
        serviceDate: formData.serviceDate || new Date(),
        // Customer info
        customerName: formData.customerName || '',
        phone: formData.phone || '',
        email: formData.email || '',
        // Voucher fields
        rewardId: formData.rewardId || '',
        tokenTxTime: formData.tokenTxTime || '',
        // Status - use config default
        status: formData.status || DEFAULT_VALUES.booking.status,
        emailSent: formData.emailSent || DEFAULT_VALUES.booking.emailSent,
        notes: formData.notes || '',
        cancelReason: null,
        updatedAt: new Date()
    };
};
