import { API_CONFIG } from './api.config';
import { toDateString } from '../utils/date.utils';

/**
 * Helper function to extract error message from API response
 * @param {Response} response - Fetch response object
 * @param {string} defaultMessage - Default message if extraction fails
 * @returns {Promise<string>} Error message
 */
const extractErrorMessage = async (response, defaultMessage) => {
    try {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            const errorData = await response.json();
            return errorData.message || errorData.error || defaultMessage;
        }
        return defaultMessage;
    } catch {
        return defaultMessage;
    }
};

/**
 * Helper function to safely parse date strings (prevents timezone shift)
 * @param {string} dateStr - Date string in YYYY-MM-DD format
 * @returns {Date} Date object in local timezone
 */
export const parseDateSafe = (dateStr) => {
    if (!dateStr) return null;
    // Parse as local date, not UTC
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
};

export const bookingService = {
    getAll: async () => {
        const response = await fetch(`${API_CONFIG.BASE_URL}/bookings`);
        if (!response.ok) {
            const message = await extractErrorMessage(response, 'Failed to fetch bookings');
            throw new Error(message);
        }
        return response.json();
    },

    getById: async (id) => {
        const response = await fetch(`${API_CONFIG.BASE_URL}/bookings/${id}`);
        if (!response.ok) {
            const message = await extractErrorMessage(response, 'Failed to fetch booking');
            throw new Error(message);
        }
        return response.json();
    },

    create: async (bookingData) => {
        // Ensure date format is correct for API (YYYY-MM-DD string)
        const payload = { ...bookingData };
        if (payload.serviceDate instanceof Date) {
            payload.serviceDate = toDateString(payload.serviceDate);
        }

        // Ensure boolean fields are proper booleans
        if ('emailSent' in payload) {
            payload.emailSent = payload.emailSent === true;
        }

        const response = await fetch(`${API_CONFIG.BASE_URL}/bookings`, {
            method: 'POST',
            headers: API_CONFIG.HEADERS,
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const message = await extractErrorMessage(response, 'Failed to create booking');
            throw new Error(message);
        }
        return response.json();
    },

    update: async (id, updates) => {
        // Ensure date format is correct for API
        const payload = { ...updates };
        if (payload.serviceDate instanceof Date) {
            payload.serviceDate = toDateString(payload.serviceDate);
        }

        // Ensure boolean fields are proper booleans
        if ('emailSent' in payload) {
            payload.emailSent = payload.emailSent === true;
        }

        const response = await fetch(`${API_CONFIG.BASE_URL}/bookings/${id}`, {
            method: 'PATCH',
            headers: API_CONFIG.HEADERS,
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const message = await extractErrorMessage(response, 'Failed to update booking');
            throw new Error(message);
        }
        return response.json();
    },

    delete: async (id) => {
        const response = await fetch(`${API_CONFIG.BASE_URL}/bookings/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const message = await extractErrorMessage(response, 'Failed to delete booking');
            throw new Error(message);
        }
        return true;
    }
};
