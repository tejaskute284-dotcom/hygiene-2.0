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
    Cpu,
    Zap,
    Fingerprint,
    ShieldAlert
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/" },
    { icon: Pill, label: "Pharmacy", href: "/medications" },
    { icon: Calendar, label: "Clinical", href: "/appointments" },
    { icon: Activity, label: "Analytics", href: "/analytics" },
    { icon: Settings, label: "Registry", href: "/settings" },
];

export function Sidebar() {
    const [isOpen, setIsOpen] = useState(true);
    const pathname = usePathname();

    return (
        <>
            {/* Mobile Toggle */}
            <button
                className="lg:hidden fixed top-6 left-6 z-50 p-4 rounded-2xl bg-[#080a0f] text-white shadow-2xl border border-white/5"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{
                    width: isOpen ? 320 : 100,
                }}
                className={cn(
                    "fixed lg:relative inset-y-0 left-0 z-40 flex flex-col h-screen",
                    "bg-[#080a0f] border-r border-white/5 backdrop-blur-3xl transition-all duration-700 ease-[0.2,0.8,0.2,1]",
                    !isOpen && "items-center"
                )}
            >
                {/* Tech Background Effects - More Refined */}
                <div className="absolute inset-0 opacity-5 pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#00E5FF]/5 via-transparent to-[#00E5FF]/2 opacity-20 pointer-events-none" />

                {/* Logo Area */}
                <div className="h-32 flex items-center px-10 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00E5FF]/20 to-transparent" />

                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#00E5FF] flex items-center justify-center shadow-[0_0_30px_rgba(0,229,255,0.4)]">
                            <Cpu className="text-black" size={24} strokeWidth={2.5} />
                        </div>
                        {isOpen && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex flex-col"
                            >
                                <h1 className="text-xl font-black uppercase tracking-tighter text-white">Neural Core</h1>
                                <span className="text-[8px] font-black uppercase tracking-[0.4em] text-[#00E5FF]">System OS V2</span>
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-10 px-6 space-y-4 overflow-y-auto custom-scrollbar relative z-10">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link key={item.href} href={item.href} className="block group">
                                <motion.div
                                    whileHover={{ x: 5 }}
                                    className={cn(
                                        "flex items-center p-4 rounded-[1.5rem] transition-all duration-500 relative overflow-hidden",
                                        isActive
                                            ? "bg-white text-black shadow-[0_20px_40px_rgba(255,255,255,0.1)]"
                                            : "text-neutral-500 hover:text-white"
                                    )}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="active-indicator"
                                            className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[#00E5FF] rounded-r-full shadow-[0_0_15px_#00E5FF]"
                                        />
                                    )}

                                    <item.icon className={cn("w-6 h-6", isActive ? "text-black" : "group-hover:text-[#00E5FF] transition-colors", !isOpen ? "" : "mr-4")} />

                                    {isOpen && (
                                        <div className="flex flex-col">
                                            <span className="text-xs font-black uppercase tracking-widest leading-none">
                                                {item.label}
                                            </span>
                                            <span className="text-[7px] font-bold uppercase tracking-widest opacity-40 mt-1">
                                                Protocol Active
                                            </span>
                                        </div>
                                    )}
                                </motion.div>
                            </Link>
                        );
                    })}
                </nav>

                {/* System Pulse Widget */}
                {isOpen ? (
                    <div className="p-8 m-6 rounded-[2.5rem] bg-white/5 border border-white/5 space-y-4 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#00E5FF]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Zap size={12} className="text-[#00E5FF]" />
                                <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white">System Pulse</span>
                            </div>
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]" />
                        </div>

                        <div className="space-y-3">
                            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-[#00E5FF]"
                                    animate={{ width: ["10%", "98%"] }}
                                    transition={{ duration: 4, repeat: Infinity }}
                                />
                            </div>
                            <div className="flex justify-between text-[8px] font-black uppercase tracking-widest opacity-40">
                                <span>Stability</span>
                                <span className="text-white">98.4%</span>
                            </div>
                        </div>

                        <button className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-2xl flex items-center justify-center gap-2 transition-all group/btn">
                            <Fingerprint size={12} className="text-[#00E5FF]" />
                            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white">Secure Auth</span>
                        </button>
                    </div>
                ) : (
                    <div className="pb-10">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-neutral-500 hover:text-[#00E5FF] transition-colors cursor-pointer">
                            <ShieldAlert size={20} />
                        </div>
                    </div>
                )}

                {/* Collapse Toggle */}
                <div className="p-6 border-t border-white/5 hidden lg:flex justify-center">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="w-10 h-10 flex items-center justify-center hover:bg-white/5 rounded-xl text-neutral-500 transition-all hover:rotate-180"
                    >
                        {isOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </motion.aside>
        </>
    );
}
