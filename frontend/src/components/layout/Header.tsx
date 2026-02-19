"use client";

import { useThemeStore, useNotificationStore } from "@/lib/store";
import { Bell, User, Sparkles, LogOut, ChevronDown, Zap, Shield, Activity } from "lucide-react";
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
        <header className="h-32 px-12 flex items-center justify-between bg-transparent z-20 relative animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="flex flex-col">
                <div className="flex items-center gap-4">
                    <h2 className="text-3xl font-black tracking-tight text-slate-900">
                        {greetingByTime[timeOfDay]}, <span className="text-primary">{user?.firstName || "Guest"}</span>
                    </h2>
                    <motion.div
                        animate={{ rotate: [0, 20, 0], scale: [1, 1.1, 1] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="p-2 bg-primary/10 rounded-xl"
                    >
                        <Sparkles className="w-5 h-5 text-primary" />
                    </motion.div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-lg shadow-green-500/20" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                        AI Neural Link Active
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-8">
                {/* Advanced Mode Switcher */}
                <div className="p-1.5 flex rounded-2xl bg-white/40 backdrop-blur-xl border border-white/20 shadow-clay overflow-hidden relative group">
                    {(['simple', 'standard', 'power'] as const).map((mode) => (
                        <button
                            key={mode}
                            onClick={() => handleModeChange(mode)}
                            className={`relative px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 z-10 ${accessibilityMode === mode
                                ? 'text-primary'
                                : 'text-slate-400 hover:text-slate-600'
                                }`}
                        >
                            {accessibilityMode === mode && (
                                <motion.div
                                    layoutId="header-mode-pill"
                                    className="absolute inset-0 bg-white shadow-sm border border-white/10 rounded-xl"
                                    transition={{ type: "spring", bounce: 0.15, duration: 0.6 }}
                                />
                            )}
                            <span className="relative z-20">{mode}</span>
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-4 relative">
                    <div className="relative">
                        <Button
                            variant="ghost"
                            size="icon"
                            className={`w-14 h-14 rounded-2xl relative overflow-hidden group transition-all duration-500 ${isNotificationsOpen ? 'bg-primary text-white shadow-clay' : 'bg-white/40 border border-white/20'}`}
                            onClick={() => {
                                setIsNotificationsOpen(!isNotificationsOpen);
                                setIsUserMenuOpen(false);
                            }}
                        >
                            <Bell className="w-6 h-6 transition-transform group-hover:rotate-12" />
                            {unreadCount > 0 && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute top-4 right-4 w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-lg animate-pulse"
                                />
                            )}
                        </Button>

                        <AnimatePresence>
                            {isNotificationsOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 15, scale: 0.95 }}
                                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                    className="absolute top-20 right-0 w-[400px] bg-white/90 border border-white/20 rounded-[2.5rem] shadow-2xl overflow-hidden z-50 backdrop-blur-[32px] p-2"
                                >
                                    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-t-[2rem]">
                                        <div className="flex items-center gap-3">
                                            <Activity className="w-5 h-5 text-primary" />
                                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900">Health Alerts</h3>
                                        </div>
                                        <button
                                            onClick={() => clearAll()}
                                            className="text-[10px] font-black uppercase text-slate-400 hover:text-primary transition-colors"
                                        >
                                            Dismiss All
                                        </button>
                                    </div>
                                    <div className="max-h-[480px] overflow-y-auto custom-scrollbar p-2 space-y-2">
                                        {notifications.length === 0 ? (
                                            <div className="py-20 text-center space-y-4">
                                                <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto text-slate-300">
                                                    <Shield className="w-8 h-8" />
                                                </div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Your health environment is stable</p>
                                            </div>
                                        ) : (
                                            notifications.map((n) => (
                                                <div
                                                    key={n.id}
                                                    onClick={() => markAsRead(n.id)}
                                                    className={`p-6 rounded-2xl border border-transparent hover:border-white/20 hover:bg-white transition-all cursor-pointer relative group ${!n.read ? 'bg-primary/5' : 'bg-slate-50/30'}`}
                                                >
                                                    {!n.read && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-10 bg-primary rounded-r-full shadow-clay" />}
                                                    <div className="flex justify-between items-start mb-2">
                                                        <p className="font-bold text-slate-900 group-hover:text-primary transition-colors">{n.title}</p>
                                                        <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">{n.time}</span>
                                                    </div>
                                                    <p className="text-xs text-slate-500 font-medium leading-relaxed">{n.message}</p>
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
                            className="flex items-center gap-3 pl-2 pr-4 py-2 bg-white/40 border border-white/20 rounded-2xl cursor-pointer hover:bg-white transition-all shadow-sm hover:shadow-clay group"
                        >
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-black shadow-clay">
                                {user?.firstName?.[0]}
                            </div>
                            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-500 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                        </motion.div>

                        <AnimatePresence>
                            {isUserMenuOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 15, scale: 0.95 }}
                                    transition={{ duration: 0.4 }}
                                    className="absolute top-16 right-0 w-64 bg-white/90 border border-white/20 rounded-3xl shadow-2xl p-3 z-50 backdrop-blur-[32px]"
                                >
                                    <div className="p-4 border-b border-slate-100 mb-2">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Profile</p>
                                        <p className="text-sm font-black text-slate-900 truncate">{user?.firstName} {user?.lastName}</p>
                                    </div>
                                    <button
                                        onClick={() => logout()}
                                        className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-red-50 text-red-500 transition-all text-xs font-black uppercase tracking-widest"
                                    >
                                        <div className="p-2 bg-red-100 rounded-lg">
                                            <LogOut size={16} />
                                        </div>
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
