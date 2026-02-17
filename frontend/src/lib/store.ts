import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ThemeState, TimeOfDay, AccessibilityMode, ThemeMode } from './types';

export interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    time: string;
    read: boolean;
}

interface NotificationState {
    notifications: Notification[];
    addNotification: (notif: Omit<Notification, 'id' | 'time' | 'read'>) => void;
    markAsRead: (id: string) => void;
    clearAll: () => void;
}

export const useThemeStore = create<ThemeState>()(
    persist(
        (set) => ({
            timeOfDay: 'day',
            accessibilityMode: 'standard',
            themeMode: 'light',
            setTimeOfDay: (time: TimeOfDay) => set({ timeOfDay: time }),
            setAccessibilityMode: (mode: AccessibilityMode) => set({ accessibilityMode: mode }),
            setThemeMode: (mode: ThemeMode) => set({ themeMode: mode }),
        }),
        { name: 'ihms-theme-storage' }
    )
);

export const useNotificationStore = create<NotificationState>()((set) => ({
    notifications: [
        { id: '1', title: 'Medication Reminder', message: 'Time for your Vitamin D3', type: 'info', time: '2 mins ago', read: false },
        { id: '2', title: 'System Secure', message: 'Military-grade encryption is active.', type: 'success', time: '1 hour ago', read: true },
    ],
    addNotification: (notif) => set((state) => ({
        notifications: [
            { ...notif, id: Math.random().toString(), time: 'Just now', read: false },
            ...state.notifications
        ].slice(0, 10)
    })),
    markAsRead: (id) => set((state) => ({
        notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
    })),
    clearAll: () => set({ notifications: [] })
}));
