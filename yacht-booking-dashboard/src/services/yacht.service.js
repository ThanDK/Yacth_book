import { API_CONFIG } from './api.config';

export const yachtService = {
    getAll: async () => {
        const response = await fetch(`${API_CONFIG.BASE_URL}/yachts`);
        if (!response.ok) throw new Error('Failed to fetch yachts');
        return response.json();
    },

    getById: async (id) => {
        const response = await fetch(`${API_CONFIG.BASE_URL}/yachts/${id}`);
        if (!response.ok) throw new Error('Failed to fetch yacht');
        return response.json();
    },

    create: async (data) => {
        const response = await fetch(`${API_CONFIG.BASE_URL}/yachts`, {
            method: 'POST',
            headers: API_CONFIG.HEADERS,
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to create yacht');
        return response.json();
    },

    update: async (id, data) => {
        const response = await fetch(`${API_CONFIG.BASE_URL}/yachts/${id}`, {
            method: 'PATCH',
            headers: API_CONFIG.HEADERS,
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to update yacht');
        return response.json();
    },

    delete: async (id) => {
        const response = await fetch(`${API_CONFIG.BASE_URL}/yachts/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete yacht');
        return true;
    }
};
