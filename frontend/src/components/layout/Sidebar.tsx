"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    Pill,
    Calendar,
    Activity,
    Settings,
    Menu,
    X,
    HeartPulse,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/", description: "Overview" },
    { icon: Pill, label: "Pharmacy", href: "/medications", description: "Medications" },
    { icon: Calendar, label: "Clinical", href: "/appointments", description: "Appointments" },
    { icon: Activity, label: "Analytics", href: "/analytics", description: "Health Data" },
    { icon: Settings, label: "Registry", href: "/settings", description: "Settings" },
];

export function Sidebar() {
    const [isOpen, setIsOpen] = useState(true);
    const pathname = usePathname();

    return (
        <>
            {/* Mobile Toggle */}
            <button
                className="lg:hidden fixed top-5 left-5 z-50 p-3 rounded-2xl bg-white text-[var(--foreground)] border border-[var(--clay-border)] [box-shadow:var(--clay-shadow-md)]"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X size={18} /> : <Menu size={18} />}
            </button>

            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{ width: isOpen ? 260 : 84 }}
                transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
                className={cn(
                    "fixed lg:relative inset-y-0 left-0 z-40 flex flex-col h-screen",
                    "bg-white border-r border-[var(--clay-border)]",
                    "[box-shadow:4px_0_24px_rgba(34,197,94,0.08)]",
                    !isOpen && "items-center"
                )}
            >
                {/* Logo Area */}
                <div className="h-24 flex items-center px-5 border-b border-[var(--clay-border)]">
                    <div className="flex items-center gap-3 min-w-0">
                        {/* Logo mark */}
                        <div className="flex-shrink-0 w-11 h-11 rounded-2xl bg-[var(--primary)] flex items-center justify-center [box-shadow:0_4px_14px_rgba(34,197,94,0.35),_inset_0_2px_4px_rgba(255,255,255,0.40)]">
                            <HeartPulse className="text-white" size={22} strokeWidth={2.5} />
                        </div>
                        <AnimatePresence>
                            {isOpen && (
                                <motion.div
                                    initial={{ opacity: 0, x: -8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -8 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex flex-col min-w-0"
                                >
                                    <h1 className="text-base font-black tracking-tight text-[var(--foreground)] truncate">
                                        Synapse Care
                                    </h1>
                                    <span className="text-[10px] font-semibold text-[var(--primary)] tracking-widest uppercase">
                                        Health OS
                                    </span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link key={item.href} href={item.href} className="block">
                                <motion.div
                                    whileHover={{ x: isOpen ? 4 : 0 }}
                                    whileTap={{ scale: 0.97 }}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 relative",
                                        isActive
                                            ? "bg-[var(--primary)] text-white [box-shadow:0_6px_20px_rgba(34,197,94,0.30),_inset_0_2px_4px_rgba(255,255,255,0.30)]"
                                            : "text-[var(--foreground-muted)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]",
                                        !isOpen && "justify-center"
                                    )}
                                >
                                    <item.icon
                                        size={19}
                                        strokeWidth={isActive ? 2.5 : 2}
                                        className={cn(
                                            "flex-shrink-0",
                                            isActive ? "text-white" : "text-[var(--foreground-muted)]"
                                        )}
                                    />
                                    <AnimatePresence>
                                        {isOpen && (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="flex flex-col min-w-0"
                                            >
                                                <span className="text-sm font-bold leading-none truncate">
                                                    {item.label}
                                                </span>
                                                <span className={cn(
                                                    "text-[10px] mt-0.5 truncate",
                                                    isActive ? "text-white/70" : "text-[var(--foreground-muted)] opacity-60"
                                                )}>
                                                    {item.description}
                                                </span>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            </Link>
                        );
                    })}
                </nav>

                {/* Health Status Widget */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="mx-4 mb-4 p-4 rounded-2xl bg-[var(--primary-light)] border border-[var(--clay-border)] [box-shadow:inset_0_2px_6px_rgba(0,0,0,0.04),_inset_0_1px_2px_rgba(255,255,255,0.80)]"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-[var(--primary-dark)]">
                                        Health Status
                                    </span>
                                </div>
                                <span className="text-[10px] font-black text-[var(--primary-dark)]">98%</span>
                            </div>
                            <div className="w-full h-2 bg-white/60 rounded-full overflow-hidden [box-shadow:inset_0_1px_3px_rgba(0,0,0,0.10)]">
                                <motion.div
                                    className="h-full bg-[var(--primary)] rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: "98%" }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                />
                            </div>
                            <p className="text-[9px] text-[var(--primary-dark)] mt-2 font-medium">All vitals normal</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Collapse Toggle */}
                <div className="px-4 py-4 border-t border-[var(--clay-border)] hidden lg:flex">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className={cn(
                            "flex items-center justify-center w-full py-2.5 rounded-xl",
                            "text-[var(--foreground-muted)] hover:text-[var(--primary)] hover:bg-[var(--muted)]",
                            "transition-all duration-200 text-xs font-bold gap-1.5"
                        )}
                    >
                        {isOpen ? (
                            <><ChevronLeft size={16} /><span>Collapse</span></>
                        ) : (
                            <ChevronRight size={16} />
                        )}
                    </button>
                </div>
            </motion.aside>
        </>
    );
}
