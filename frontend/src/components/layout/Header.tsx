"use client";

import { useThemeStore, useNotificationStore } from "@/lib/store";
import { Bell, User, Sparkles, LogOut } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { getUser, logout } from "@/lib/auth-actions";
import { useEffect, useState } from "react";

export function Header() {
    const { accessibilityMode, setAccessibilityMode, timeOfDay } = useThemeStore();
    const { notifications, markAsRead, clearAll } = useNotificationStore();
    const [user, setUser] = useState<{ firstName: string; lastName: string } | null>(null);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

    useEffect(() => {
        setUser(getUser());
    }, []);

    const unreadCount = notifications.filter(n => !n.read).length;

    const greetingByTime = {
        morning: "Good Morning",
        day: "Good Day",
        evening: "Good Evening",
        night: "Good Night"
    };

    const handleModeChange = async (mode: 'simple' | 'standard' | 'power') => {
        setAccessibilityMode(mode);
        try {
            const { usersApi } = await import('@/lib/api');
            await usersApi.updateSettings({ uiMode: mode });
        } catch (error) {
            console.error("Failed to persist accessibility preference:", error);
        }
    };

    return (
        <header className="h-24 px-8 flex items-center justify-between bg-transparent z-20 relative">
            <div className="flex flex-col">
                <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-black tracking-tight">
                        {greetingByTime[timeOfDay]}, {user?.firstName || "Guest"}
                    </h2>
                    <motion.div
                        animate={{ rotate: [0, 20, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <Sparkles className="w-5 h-5 text-[var(--primary)]" />
                    </motion.div>
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-[var(--secondary)]">
                    AI-Powered Personal Health Hub
                </span>
            </div>

            <div className="flex items-center gap-6">
                {/* Advanced Mode Switcher */}
                <div className="p-1 flex rounded-full bg-[var(--muted)]/50 backdrop-blur-md border border-[var(--color-glass-border)] shadow-inner">
                    {(['simple', 'standard', 'power'] as const).map((mode) => (
                        <button
                            key={mode}
                            onClick={() => handleModeChange(mode)}
                            className={`relative px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-tighter transition-all duration-300 ${accessibilityMode === mode
                                ? 'text-[var(--primary)]'
                                : 'text-[var(--secondary)] hover:text-[var(--foreground)]'
                                }`}
                        >
                            {accessibilityMode === mode && (
                                <motion.div
                                    layoutId="mode-pill"
                                    className="absolute inset-0 bg-white shadow-md rounded-full"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <span className="relative z-10">{mode}</span>
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-3 relative">
                    <div className="relative">
                        <Button
                            variant="ghost"
                            size="icon"
                            className={`rounded-2xl relative overflow-hidden group ${isNotificationsOpen ? 'bg-[var(--primary)] text-white' : 'bg-[var(--muted)]/50'}`}
                            onClick={() => {
                                setIsNotificationsOpen(!isNotificationsOpen);
                                setIsUserMenuOpen(false);
                            }}
                        >
                            <Bell className="w-5 h-5 transition-transform group-hover:rotate-12" />
                            {unreadCount > 0 && (
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[var(--background)] animate-pulse" />
                            )}
                        </Button>

                        <AnimatePresence>
                            {isNotificationsOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute top-16 right-0 w-80 bg-[var(--background)] border border-[var(--color-glass-border)] rounded-3xl shadow-2xl overflow-hidden z-50 backdrop-blur-xl"
                                >
                                    <div className="p-4 border-b border-[var(--color-glass-border)] flex justify-between items-center bg-[var(--muted)]/20">
                                        <h3 className="text-xs font-black uppercase tracking-widest">Recent Alerts</h3>
                                        <button onClick={() => clearAll()} className="text-[10px] font-black uppercase text-[var(--secondary)] hover:text-[var(--primary)]">Clear All</button>
                                    </div>
                                    <div className="max-h-[400px] overflow-y-auto">
                                        {notifications.length === 0 ? (
                                            <div className="p-8 text-center opacity-30">
                                                <p className="text-xs font-black uppercase tracking-widest">No notifications</p>
                                            </div>
                                        ) : (
                                            notifications.map((n) => (
                                                <div
                                                    key={n.id}
                                                    onClick={() => markAsRead(n.id)}
                                                    className={`p-4 border-b border-[var(--color-glass-border)] hover:bg-[var(--muted)]/30 transition-colors cursor-pointer relative ${!n.read ? 'bg-[var(--primary)]/5' : ''}`}
                                                >
                                                    {!n.read && <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1 h-8 bg-[var(--primary)] rounded-full" />}
                                                    <p className="text-sm font-black tracking-tight mb-1">{n.title}</p>
                                                    <p className="text-xs text-[var(--secondary)] font-medium mb-2">{n.message}</p>
                                                    <span className="text-[8px] font-black uppercase tracking-widest opacity-50">{n.time}</span>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="relative">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                                setIsUserMenuOpen(!isUserMenuOpen);
                                setIsNotificationsOpen(false);
                            }}
                            className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[var(--primary)] to-[var(--accent)] flex items-center justify-center text-white font-bold shadow-xl ring-4 ring-white/10 cursor-pointer overflow-hidden relative"
                        >
                            <User className="w-6 h-6" />
                            <div className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-100 transition-opacity" />
                        </motion.div>

                        <AnimatePresence>
                            {isUserMenuOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute top-16 right-0 w-48 bg-[var(--background)] border border-[var(--color-glass-border)] rounded-2xl shadow-2xl p-2 z-50 backdrop-blur-xl"
                                >
                                    <div className="p-3 border-b border-[var(--color-glass-border)] mb-2">
                                        <p className="text-xs font-black uppercase tracking-widest text-[var(--secondary)]">Connected as</p>
                                        <p className="text-sm font-bold truncate">{user?.firstName} {user?.lastName}</p>
                                    </div>
                                    <button
                                        onClick={() => logout()}
                                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-500/10 text-red-500 transition-colors text-sm font-black uppercase tracking-widest"
                                    >
                                        <LogOut size={16} />
                                        Sign Out
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </header>
    );
}
