// ===== SAVED USER SERVICE =====
import { API_CONFIG } from './api.config';

const BASE_URL = `${API_CONFIG.BASE_URL}/saved-users`;

export const savedUserService = {
    getAll: async (type = null) => {
        const params = type ? `?type=${type}` : '';
        const response = await fetch(`${BASE_URL}${params}`);
        if (!response.ok) throw new Error('Failed to fetch users');
        return response.json();
    },

    getById: async (id) => {
        const response = await fetch(`${BASE_URL}/${id}`);
        if (!response.ok) throw new Error('Failed to fetch user');
        return response.json();
    },

    create: async (data) => {
        const response = await fetch(BASE_URL, {
            method: 'POST',
            headers: API_CONFIG.HEADERS,
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to create user');
        return response.json();
    },

    update: async (id, data) => {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: 'PATCH',
            headers: API_CONFIG.HEADERS,
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to update user');
        return response.json();
    },

    delete: async (id) => {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete user');
        return true;
    }
};
