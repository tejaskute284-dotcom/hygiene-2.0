import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

interface RequestOptions extends RequestInit {
    requiresAuth?: boolean;
}

async function apiRequest<T>(
    endpoint: string,
    options: RequestOptions = {}
): Promise<T> {
    const { requiresAuth = true, ...fetchOptions } = options;

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(fetchOptions.headers as Record<string, string>),
    };

    if (requiresAuth) {
        const token = Cookies.get('access_token') || localStorage.getItem('access_token');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        } else {
            console.warn(`Request to ${endpoint} requires authentication but no token was found.`);
            throw new Error('Unauthorized');
        }
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...fetchOptions,
        headers,
    });

    if (!response.ok) {
        if (response.status === 401) {
            // Token expired or invalid
            // import('@/lib/auth-actions').then(m => m.logout());
            throw new Error('Unauthorized');
        }
        const error = await response.json().catch(() => ({ message: 'Request failed' }));
        throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
}

// Auth API
export const authApi = {
    login: (email: string, password: string) =>
        apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
            requiresAuth: false,
        }),

    register: (data: any) =>
        apiRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify(data),
            requiresAuth: false,
        }),

    refresh: (refreshToken: string) =>
        apiRequest('/auth/refresh', {
            method: 'POST',
            body: JSON.stringify({ refreshToken }),
            requiresAuth: false,
        }),
};

// Users API
export const usersApi = {
    getProfile: () => apiRequest('/users/profile', { method: 'GET' }),

    updateProfile: (data: any) =>
        apiRequest('/users/profile', {
            method: 'PATCH',
            body: JSON.stringify(data),
        }),

    updateSettings: (settings: any) =>
        apiRequest('/users/settings', {
            method: 'PATCH',
            body: JSON.stringify(settings),
        }),

    changePassword: (currentPassword: string, newPassword: string) =>
        apiRequest('/users/change-password', {
            method: 'POST',
            body: JSON.stringify({ currentPassword, newPassword }),
        }),

    deleteAccount: () =>
        apiRequest('/users/account', {
            method: 'DELETE',
        }),
};

// Medications API
export const medicationsApi = {
    getAll: (active?: boolean) => {
        const query = active !== undefined ? `?active=${active}` : '';
        return apiRequest(`/medications${query}`, { method: 'GET' });
    },

    getOne: (id: string) => apiRequest(`/medications/${id}`, { method: 'GET' }),

    create: (data: any) =>
        apiRequest('/medications', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    update: (id: string, data: any) =>
        apiRequest(`/medications/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        }),

    delete: (id: string) =>
        apiRequest(`/medications/${id}`, {
            method: 'DELETE',
        }),

    logMedication: (data: any) =>
        apiRequest('/medications/log', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    getAdherenceRate: (startDate: string, endDate: string) =>
        apiRequest(
            `/medications/adherence/rate?startDate=${startDate}&endDate=${endDate}`,
            { method: 'GET' }
        ),
};

// Appointments API
export const appointmentsApi = {
    getAll: (status?: string) => {
        const query = status ? `?status=${status}` : '';
        return apiRequest(`/appointments${query}`, { method: 'GET' });
    },

    getUpcoming: (limit?: number) => {
        const query = limit ? `?limit=${limit}` : '';
        return apiRequest(`/appointments/upcoming${query}`, { method: 'GET' });
    },

    getOne: (id: string) => apiRequest(`/appointments/${id}`, { method: 'GET' }),

    create: (data: any) =>
        apiRequest('/appointments', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    update: (id: string, data: any) =>
        apiRequest(`/appointments/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        }),

    updateStatus: (id: string, status: string) =>
        apiRequest(`/appointments/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status }),
        }),

    delete: (id: string) =>
        apiRequest(`/appointments/${id}`, {
            method: 'DELETE',
        }),
};

// Daily Schedule API
export const dailyScheduleApi = {
    getAll: () => apiRequest('/daily-schedule', { method: 'GET' }),

    create: (data: any) =>
        apiRequest('/daily-schedule', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    update: (id: string, data: any) =>
        apiRequest(`/daily-schedule/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        }),

    delete: (id: string) =>
        apiRequest(`/daily-schedule/${id}`, {
            method: 'DELETE',
        }),
};

export default {
    auth: authApi,
    users: usersApi,
    medications: medicationsApi,
    appointments: appointmentsApi,
    dailySchedule: dailyScheduleApi,
};
