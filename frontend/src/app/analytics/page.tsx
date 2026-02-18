"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { ShieldCheck, Activity, Brain, Fingerprint, Lock, ShieldAlert, Cpu, Sparkles, Zap, Shield } from "lucide-react";
import { motion } from "framer-motion";

import { useThemeStore } from "@/lib/store";
import { useEffect, useState } from "react";

export default function AnalyticsPage() {
    const { accessibilityMode, timeOfDay } = useThemeStore();
    const [auditIndex, setAuditIndex] = useState(0);

    const statusMap = {
        morning: "Neural Sync: Morning Protocol",
        day: "Neural Sync: Active State",
        evening: "Neural Sync: Evening Descent",
        night: "Neural Sync: Rest Mode"
    };

    const metricsByMode = {
        simple: [
            { label: "Safety Status", value: "Secure", status: "Active", icon: <ShieldCheck className="text-green-500" /> },
            { label: "Protocols", value: "Locked", status: "Verified", icon: <Lock className="text-blue-500" /> },
        ],
        standard: [
            { label: "Data Encryption", value: "100%", status: "Active", icon: <Lock className="text-green-500" /> },
            { label: "Trust Score", value: "98/100", status: "Optimal", icon: <Fingerprint className="text-blue-500" /> },
            { label: "2FA Status", value: "Enabled", status: "Verified", icon: <ShieldCheck className="text-[var(--primary)]" /> },
        ],
        power: [
            { label: "Entropy Level", value: "0.004", status: "Stable", icon: <Brain className="text-purple-500" /> },
            { label: "Registry Sync", value: "99.9%", status: "Live", icon: <Activity className="text-[#00E5FF]" /> },
            { label: "Node Health", value: "94ms", status: "Nominal", icon: <Cpu size={24} className="text-orange-500" /> },
        ]
    };

    const currentMetrics = metricsByMode[accessibilityMode as keyof typeof metricsByMode] || metricsByMode.standard;

    useEffect(() => {
        const interval = setInterval(() => {
            setAuditIndex(prev => (prev + 1) % 50);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <DashboardLayout>
            <div className="space-y-8">
                {/* Synthetic Page Header - Matches Image Requirement */}
                <div className="flex flex-col xl:flex-row items-start xl:items-end justify-between gap-12 pt-4 relative z-10">
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-white/5 text-[#00E5FF] rounded-2xl border border-[#00E5FF]/30 shadow-xl backdrop-blur-xl">
                                <Activity size={20} className="animate-pulse" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#00E5FF]">{statusMap[timeOfDay as keyof typeof statusMap]}</span>
                                <span className="text-[8px] font-bold uppercase tracking-widest opacity-40">Registry Hub: Synchronized</span>
                            </div>
                        </div>
                        <h1 className="text-8xl font-black tracking-tighter uppercase leading-[0.8] mb-2 text-[var(--foreground)]">
                            Health & <br /><span className="text-gradient">Security Analytics</span>
                        </h1>
                        <p className="text-neutral-400 font-bold max-w-2xl text-2xl leading-relaxed">
                            Real-time analysis of your <span className="text-[#00E5FF]">Neural Pulse</span> and defensive integrity.
                        </p>
                    </div>

                    <div className="flex items-center gap-8 p-8 bg-white/5 rounded-[3rem] border border-white/10 backdrop-blur-3xl shadow-2xl">
                        <div className="flex flex-col items-center gap-2 text-center">
                            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-[var(--secondary)]">Vault</span>
                            <div className="px-4 py-2 bg-green-500/10 rounded-xl border border-green-500/20 flex items-center gap-2">
                                <Lock size={12} className="text-green-500" />
                                <span className="text-[10px] font-black uppercase text-green-500">Secure</span>
                            </div>
                        </div>
                        <div className="h-10 w-[1px] bg-white/10" />
                        <div className="flex flex-col items-center gap-2 text-center">
                            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-[var(--secondary)]">Core</span>
                            <div className="px-4 py-2 bg-[#00E5FF]/10 rounded-xl border border-[#00E5FF]/20 flex items-center gap-2">
                                <Cpu size={12} className="text-[#00E5FF]" />
                                <span className="text-[10px] font-black uppercase text-[#00E5FF]">Optimal</span>
                            </div>
                        </div>
                        <div className="h-10 w-[1px] bg-white/10" />
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-[var(--secondary)]">Sync Node</span>
                            <Zap size={18} className="text-[#00E5FF]" />
                        </div>
                    </div>
                </div>

                {/* Security Overview Row - Dynamic Grid */}
                <div className={`grid grid-cols-1 md:grid-cols-${currentMetrics.length} gap-6`}>
                    {currentMetrics.map((metric, i) => (
                        <GlassCard key={i} className="flex flex-col gap-6 relative group overflow-hidden border-none shadow-2xl bg-[#0c0e14]/50 backdrop-blur-3xl">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--primary)]/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000" />
                            <div className="p-5 bg-white/5 rounded-[2.5rem] w-fit border border-white/5 shadow-xl">
                                {metric.icon}
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-[var(--secondary)] uppercase tracking-[0.4em] mb-2">{metric.label}</p>
                                <div className="flex items-baseline gap-3">
                                    <h4 className="text-5xl font-black tracking-tighter text-[var(--foreground)]">{metric.value}</h4>
                                    <span className="text-[10px] font-black text-green-500 uppercase flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_10px_#4ade80]" />
                                        {metric.status}
                                    </span>
                                </div>
                            </div>
                        </GlassCard>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <GlassCard className="min-h-[400px] flex flex-col">
                        <div className="flex items-center justify-between mb-10">
                            <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
                                <div className="p-2 bg-red-500/10 rounded-xl text-red-500"><Activity size={20} /></div>
                                Biometric Trends
                            </h3>
                            <div className="flex gap-2">
                                <span className="px-3 py-1 bg-[var(--muted)] rounded-full text-[10px] font-black uppercase text-[var(--secondary)]">Real-time</span>
                            </div>
                        </div>

                        <div className="flex-1 flex items-end gap-1 px-2 mb-6 h-48">
                            {[40, 70, 45, 90, 65, 80, 50, 60, 85, 40, 75, 55, 65, 45, 95, 70, 80, 50].map((h, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ height: 0 }}
                                    animate={{ height: `${h}%` }}
                                    transition={{ delay: i * 0.03, type: "spring", stiffness: 100 }}
                                    className="flex-1 min-w-[4px] bg-gradient-to-t from-[var(--primary)] via-[var(--accent)] to-white/40 rounded-full opacity-60 hover:opacity-100 transition-opacity cursor-pointer group/bar relative"
                                >
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[var(--foreground)] text-[var(--background)] px-2 py-1 rounded-md text-[8px] font-black opacity-0 group-hover/bar:opacity-100 transition-opacity">
                                        {h}%
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="grid grid-cols-3 gap-4 border-t border-[var(--color-glass-border)] pt-8">
                            {[
                                { label: "Avg Heart Rate", val: "72", unit: "BPM", color: "text-red-500" },
                                { label: "Sleep Depth", val: "84", unit: "%", color: "text-blue-500" },
                                { label: "Stress Level", val: "Low", unit: "", color: "text-green-500" }
                            ].map((stat, i) => (
                                <div key={i} className="text-center">
                                    <p className="text-[8px] font-black text-[var(--secondary)] uppercase tracking-widest mb-1">{stat.label}</p>
                                    <p className="text-2xl font-black tracking-tighter text-[var(--foreground)]">
                                        {stat.val} <span className="text-[10px] opacity-40">{stat.unit}</span>
                                    </p>
                                </div>
                            ))}
                        </div>
                    </GlassCard>

                    <GlassCard className="relative overflow-hidden group">
                        <div className="absolute -top-12 -right-12 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-1000 rotate-12">
                            <ShieldAlert size={260} />
                        </div>

                        <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-3 mb-10">
                            <div className="p-2 bg-purple-500/10 rounded-xl text-purple-500"><Brain size={20} /></div>
                            Security Purpose Audit
                        </h3>

                        <div className="space-y-4 relative z-10">
                            {[
                                { title: "HIPAA Compliance", desc: "Verified audit complete. Data is segmented and encrypted at rest.", color: "green", icon: <ShieldCheck size={16} /> },
                                { title: "Access Control", desc: "Two-Step Authentication active for 100% of sensitive operations.", color: "blue", icon: <Fingerprint size={16} /> },
                                { title: "Empathetic Proxy", desc: "AI monitors for health anomalies without local data persistence.", color: "purple", icon: <Brain size={16} /> },
                                { title: "Threat Vector", desc: "No infiltration detected in the last 2,400 synchronization cycles.", color: "cyan", icon: <Lock size={16} /> }
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 + (i * 0.1) }}
                                    className="p-5 rounded-[2.5rem] bg-white/5 border border-white/5 hover:bg-white/10 transition-all group/item"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className="text-[#00E5FF] opacity-50 group-hover/item:opacity-100 transition-opacity">
                                                {item.icon}
                                            </div>
                                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white">{item.title}</p>
                                        </div>
                                        <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-[#00E5FF] shadow-[0_0_10px_#00E5FF]'}`} />
                                    </div>
                                    <p className="text-[11px] font-medium text-neutral-400 leading-relaxed pl-7">{item.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </GlassCard>
                </div>
            </div>
        </DashboardLayout>
    );
}
