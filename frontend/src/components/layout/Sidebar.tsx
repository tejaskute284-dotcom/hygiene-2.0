"use client";

import { motion } from "framer-motion";
import {
    LayoutDashboard,
    Pill,
    Calendar,
    Activity,
    Settings,
    Menu,
    X
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/" },
    { icon: Pill, label: "Medications", href: "/medications" },
    { icon: Calendar, label: "Appointments", href: "/appointments" },
    { icon: Activity, label: "Analytics", href: "/analytics" },
    { icon: Settings, label: "Settings", href: "/settings" },
];

export function Sidebar() {
    const [isOpen, setIsOpen] = useState(true);
    const pathname = usePathname();

    return (
        <>
            {/* Mobile Toggle */}
            <button
                className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--color-glass-border)] backdrop-blur-md"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X /> : <Menu />}
            </button>

            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{
                    width: isOpen ? 280 : 80,
                    x: isOpen ? 0 : 0
                }}
                className={cn(
                    "fixed lg:relative inset-y-0 left-0 z-40 flex flex-col h-screen",
                    "bg-[var(--glass-bg)] border-r border-[var(--color-glass-border)] backdrop-blur-xl transition-all duration-300",
                    !isOpen && "items-center" // Center icons when collapsed
                )}
            >
                {/* Logo Area */}
                <div className="h-20 flex items-center justify-center border-b border-[var(--color-glass-border)]">
                    {isOpen ? (
                        <motion.h1
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--primary)] to-[var(--accent)]"
                        >
                            IHMS
                        </motion.h1>
                    ) : (
                        <span className="text-2xl font-bold text-[var(--primary)]">I</span>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-8 px-4 space-y-2 overflow-y-auto">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link key={item.href} href={item.href} className="block group">
                                <div
                                    className={cn(
                                        "flex items-center p-3 rounded-xl transition-all duration-200",
                                        isActive
                                            ? "bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/20"
                                            : "hover:bg-[var(--muted)] text-[var(--secondary)] group-hover:text-[var(--primary)]",
                                        !isOpen && "justify-center"
                                    )}
                                >
                                    <item.icon className={cn("w-6 h-6", isActive ? "text-white" : "", !isOpen ? "" : "mr-3")} />

                                    {isOpen && (
                                        <motion.span
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="font-medium"
                                        >
                                            {item.label}
                                        </motion.span>
                                    )}
                                </div>
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer / Toggle (Desktop) */}
                <div className="p-4 border-t border-[var(--color-glass-border)] hidden lg:flex justify-end">
                    <button onClick={() => setIsOpen(!isOpen)} className="p-2 hover:bg-[var(--muted)] rounded-lg text-[var(--secondary)]">
                        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </motion.aside>
        </>
    );
}
