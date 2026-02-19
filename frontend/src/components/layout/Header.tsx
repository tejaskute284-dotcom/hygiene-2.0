"use client";

import { useThemeStore, useNotificationStore } from "@/lib/store";
import { Bell, User, Sparkles, LogOut, Activity, ShieldCheck, Cpu, Fingerprint } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { getUser, logout } from "@/lib/auth-actions";
import { useEffect, useState } from "react";

export function Header() {
    const { accessibilityMode, setAccessibilityMode, timeOfDay } = useThemeStore();
    const { notifications, markAsRead, clearAll, addNotification } = useNotificationStore();
    const [user, setUser] = useState<{ firstName: string; lastName: string } | null>(null);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

    useEffect(() => {
        setUser(getUser());
    }, []);

    const unreadCount = notifications.filter(n => !n.read).length;

    const greetingByTime = {
        morning: "Neural Sync: Morning Protocol",
        day: "Neural Sync: Active State",
        evening: "Neural Sync: Evening Descent",
        night: "Neural Sync: Rest Mode"
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
        <header className="h-28 px-12 flex items-center justify-between bg-transparent z-20 relative">
            <div className="flex items-center gap-10">
                <div className="flex flex-col">
                    <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-white/5 text-[#00E5FF] rounded-lg border border-[#00E5FF]/30 backdrop-blur-md">
                            <Activity size={12} className="animate-pulse" />
                        </div>
                        <h2 className="text-xl font-black tracking-tight uppercase">
                            {greetingByTime[timeOfDay]}
                        </h2>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-[8px] font-black uppercase tracking-[0.4em] text-[var(--secondary)]">
                            Subject: <span className="text-[var(--foreground)]">{(user?.firstName || "Guest").toUpperCase()}</span>
                        </span>
                        <div className="w-1 h-1 rounded-full bg-white/20" />
                        <span className="text-[8px] font-black uppercase tracking-[0.4em] text-[#00E5FF]">Registry Verified</span>
                    </div>
                </div>

                <div className="hidden xl:flex items-center gap-6 p-3 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-xl">
                    <button
                        onClick={() => addNotification({ title: "Vault Verified", message: "Military-grade encryption sequence verified.", type: "success" })}
                        className="flex items-center gap-2 px-3 border-r border-white/10 hover:bg-white/5 transition-all py-1 rounded-lg"
                    >
                        <ShieldCheck size={14} className="text-[#00E5FF]" />
                        <span className="text-[9px] font-black tracking-widest text-[var(--secondary)] uppercase">Vault Secure</span>
                    </button>
                    <button
                        onClick={() => addNotification({ title: "Core Stable", message: "All neural nodes operating at 99.9% efficiency.", type: "success" })}
                        className="flex items-center gap-2 px-3 hover:bg-white/5 transition-all py-1 rounded-lg"
                    >
                        <Cpu size={14} className="text-[#00E5FF]/60" />
                        <span className="text-[9px] font-black tracking-widest text-[var(--secondary)] uppercase">Core Optimal</span>
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-8">
                {/* Mode Switcher - Claymorphism */}
                <div className="p-1.5 flex rounded-[1.25rem] bg-[var(--surface)] border border-[var(--clay-border)] [box-shadow:var(--clay-shadow-sm)]">
                    {(['simple', 'standard', 'power'] as const).map((mode) => (
                        <button
                            key={mode}
                            onClick={() => handleModeChange(mode)}
                            className={`relative px-5 py-2 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${accessibilityMode === mode
                                ? 'text-white shadow-md'
                                : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]'
                                }`}
                        >
                            {accessibilityMode === mode && (
                                <motion.div
                                    layoutId="header-mode-pill"
                                    className="absolute inset-0 bg-[var(--secondary)] rounded-2xl z-0"
                                    transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                                />
                            )}
                            <span className="relative z-10">{mode}</span>
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-4 relative">
                    <div className="relative">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                                setIsNotificationsOpen(!isNotificationsOpen);
                                setIsUserMenuOpen(false);
                            }}
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center relative transition-all duration-500 ${isNotificationsOpen ? 'bg-[var(--primary)] text-black shadow-[0_0_30px_var(--glow-primary)]' : 'bg-[var(--muted)] text-[var(--foreground)] hover:bg-[var(--muted)] border border-[var(--glass-border)]'}`}
                        >
                            <Bell className={`w-5 h-5 ${!isNotificationsOpen && 'group-hover:rotate-12 transition-transform'}`} />
                            {unreadCount > 0 && (
                                <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-black animate-pulse" />
                            )}
                        </motion.button>

                        <AnimatePresence>
                            {isNotificationsOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 15, scale: 0.95 }}
                                    className="absolute top-16 right-0 w-96 bg-[var(--background)] border border-[var(--glass-border)] rounded-[2.5rem] shadow-2xl overflow-hidden z-50 backdrop-blur-3xl text-[var(--foreground)]"
                                >
                                    <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                                        <div className="flex items-center gap-2">
                                            <Sparkles size={14} className="text-[#00E5FF]" />
                                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em]">Neural Alerts</h3>
                                        </div>
                                        <button onClick={() => clearAll()} className="text-[9px] font-black uppercase text-neutral-500 hover:text-[#00E5FF] transition-colors">Abort All</button>
                                    </div>
                                    <div className="max-h-[480px] overflow-y-auto custom-scrollbar">
                                        {notifications.length === 0 ? (
                                            <div className="p-12 text-center opacity-30">
                                                <div className="w-16 h-16 rounded-full border-2 border-dashed border-white/10 mx-auto mb-4 flex items-center justify-center">
                                                    <ShieldCheck size={24} />
                                                </div>
                                                <p className="text-[9px] font-black uppercase tracking-[0.3em]">No Active Threats</p>
                                            </div>
                                        ) : (
                                            notifications.map((n) => (
                                                <div
                                                    key={n.id}
                                                    onClick={() => markAsRead(n.id)}
                                                    className={`p-6 border-b border-white/5 hover:bg-white/5 transition-all cursor-pointer relative group ${!n.read ? 'bg-[#00E5FF]/5' : ''}`}
                                                >
                                                    {!n.read && (
                                                        <motion.div
                                                            layoutId={`notif-glow-${n.id}`}
                                                            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-[#00E5FF] rounded-r-full shadow-[0_0_15px_#00E5FF]"
                                                        />
                                                    )}
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex items-center justify-between">
                                                            <p className="text-xs font-black tracking-tight uppercase group-hover:text-[#00E5FF] transition-colors">{n.title}</p>
                                                            <span className="text-[8px] font-black uppercase tracking-widest opacity-30">{n.time}</span>
                                                        </div>
                                                        <p className="text-[10px] text-[var(--secondary)] font-medium leading-relaxed">{n.message}</p>
                                                    </div>
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
                            className="w-12 h-12 rounded-2xl bg-[var(--primary)] flex items-center justify-center text-black font-black shadow-2xl cursor-pointer overflow-hidden relative border border-[var(--glass-border)]"
                        >
                            <User className="w-6 h-6" />
                            <div className="absolute inset-0 bg-black/5 opacity-0 hover:opacity-100 transition-opacity" />
                        </motion.div>

                        <AnimatePresence>
                            {isUserMenuOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 15, scale: 0.95 }}
                                    className="absolute top-16 right-0 w-64 bg-[var(--background)] border border-[var(--glass-border)] rounded-[2rem] shadow-2xl p-3 z-50 backdrop-blur-3xl text-[var(--foreground)]"
                                >
                                    <div className="p-5 border-b border-white/5 mb-2 flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-[#00E5FF]">
                                            <Fingerprint size={20} />
                                        </div>
                                        <div className="flex flex-col">
                                            <p className="text-[8px] font-black uppercase tracking-widest text-neutral-500">Authenticated</p>
                                            <p className="text-xs font-black truncate uppercase">{user?.firstName} {user?.lastName}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => logout()}
                                        className="w-full flex items-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-red-500 text-neutral-300 hover:text-white transition-all text-[9px] font-black uppercase tracking-[0.3em] group"
                                    >
                                        <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
                                        Terminate Session
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
