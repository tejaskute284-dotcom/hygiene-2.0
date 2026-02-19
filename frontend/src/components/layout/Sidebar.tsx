"use client";

import { motion } from "framer-motion";
import {
    LayoutDashboard,
    Pill,
    Calendar,
    Activity,
    Settings,
    Menu,
    X,
    ChevronLeft,
    ChevronRight,
    CircleDashed
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
                className="lg:hidden fixed top-6 left-6 z-50 p-4 rounded-2xl bg-white/80 border border-white/20 backdrop-blur-xl shadow-clay"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{
                    width: isOpen ? 300 : 100,
                }}
                className={cn(
                    "fixed lg:relative inset-y-0 left-0 z-40 flex flex-col h-screen",
                    "bg-white/40 border-r border-white/20 backdrop-blur-[32px] transition-all duration-500 ease-[0.16, 1, 0.3, 1]",
                    !isOpen && "items-center"
                )}
            >
                {/* Logo Area */}
                <div className="h-32 flex items-center px-10 relative">
                    <Link href="/" className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white shadow-clay transform group-hover:rotate-12 transition-transform duration-500 font-black text-xl">
                            S
                        </div>
                        {isOpen && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex flex-col"
                            >
                                <h1 className="text-xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
                                    SYNAPSE
                                </h1>
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Care OS</span>
                            </motion.div>
                        )}
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-4 px-6 space-y-3 overflow-y-auto custom-scrollbar">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link key={item.href} href={item.href} className="block group">
                                <div
                                    className={cn(
                                        "flex items-center p-4 rounded-2xl transition-all duration-500 relative",
                                        isActive
                                            ? "bg-white/80 text-primary shadow-clay border border-white/20"
                                            : "hover:bg-primary/5 text-slate-500 hover:text-primary",
                                        !isOpen && "justify-center"
                                    )}
                                >
                                    <item.icon className={cn("w-6 h-6", isActive ? "text-primary transition-transform duration-500" : "opacity-70 group-hover:opacity-100 transition-all")} />

                                    {isOpen && (
                                        <motion.span
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className={cn(
                                                "ml-4 font-bold text-sm tracking-tight",
                                                isActive ? "text-primary" : "text-slate-500"
                                            )}
                                        >
                                            {item.label}
                                        </motion.span>
                                    )}

                                    {isActive && (
                                        <motion.div
                                            layoutId="sidebar-active-pill"
                                            className="absolute left-[-24px] top-1/2 -translate-y-1/2 w-2 h-8 bg-primary rounded-full shadow-clay"
                                        />
                                    )}
                                </div>
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer / Toggle (Desktop) */}
                <div className="p-8 border-t border-white/10 hidden lg:flex justify-between items-center bg-white/5">
                    {isOpen && (
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-500">
                                JD
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-slate-900">Dr. Tejas</span>
                                <span className="text-[10px] font-black uppercase text-primary tracking-widest">Admin</span>
                            </div>
                        </div>
                    )}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="p-3 hover:bg-white/50 rounded-2xl text-slate-400 hover:text-primary transition-all shadow-sm hover:shadow-clay border border-transparent hover:border-white/20"
                    >
                        {isOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                    </button>
                </div>
            </motion.aside>
        </>
    );
}
