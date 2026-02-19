import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        roles: string[];
    };
}

export interface LoginResponse {
    isTwoFactorRequired?: boolean;
    userId?: string;
    accessToken?: string;
    refreshToken?: string;
    user?: AuthResponse['user'];
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
    }

    return response.json();
};

export const register = async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
}): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
    }

    return response.json();
};

export const verify2FA = async (userId: string, code: string): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/2fa/authenticate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, code }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Invalid 2FA code');
    }

    return response.json();
};

export const setSession = (auth: AuthResponse) => {
    const options = { expires: 1, sameSite: 'lax' as const, path: '/' };
    Cookies.set('access_token', auth.accessToken, options);
    Cookies.set('refresh_token', auth.refreshToken, { ...options, expires: 7 });
    localStorage.setItem('access_token', auth.accessToken);
    localStorage.setItem('user', JSON.stringify(auth.user));
};

export const logout = () => {
    Cookies.remove('access_token', { path: '/' });
    Cookies.remove('refresh_token', { path: '/' });
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    window.location.href = '/login';
};

export const isAuthenticated = (): boolean => {
    return !!Cookies.get('access_token');
};

export const getUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};
