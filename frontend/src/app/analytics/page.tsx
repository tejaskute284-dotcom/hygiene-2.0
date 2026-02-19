"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import {
    ShieldCheck, Activity, Brain, Fingerprint,
    Lock, Cpu, Sparkles, Zap, ShieldAlert
} from "lucide-react";
import { motion } from "framer-motion";
import { useThemeStore } from "@/lib/store";
import { useEffect, useState } from "react";

export default function AnalyticsPage() {
    const { accessibilityMode, timeOfDay } = useThemeStore();
    const [auditIndex, setAuditIndex] = useState(0);

    const statusMap: Record<string, string> = {
        morning: "Morning Health Report",
        day: "Live Health Analytics",
        evening: "Evening Summary",
        night: "Night Mode · Rest Data",
    };

    // Metric cards — no hardcoded colours on the icons
    const metricsByMode: Record<string, { label: string; value: string; status: string; icon: string; colour: string }[]> = {
        simple: [
            { label: "Safety Status", value: "Secure", status: "Active", icon: "shield-check", colour: "green" },
            { label: "Protocols", value: "Locked", status: "Verified", icon: "lock", colour: "blue" },
        ],
        standard: [
            { label: "Data Encryption", value: "100%", status: "Active", icon: "lock", colour: "green" },
            { label: "Trust Score", value: "98/100", status: "Optimal", icon: "fingerprint", colour: "blue" },
            { label: "2FA Status", value: "Enabled", status: "Verified", icon: "shield-check", colour: "green" },
        ],
        power: [
            { label: "Entropy Level", value: "0.004", status: "Stable", icon: "brain", colour: "purple" },
            { label: "Registry Sync", value: "99.9%", status: "Live", icon: "activity", colour: "blue" },
            { label: "Node Health", value: "94ms", status: "Nominal", icon: "cpu", colour: "amber" },
        ],
    };

    const iconMap: Record<string, React.ReactNode> = {
        "shield-check": <ShieldCheck size={22} />,
        lock: <Lock size={22} />,
        fingerprint: <Fingerprint size={22} />,
        brain: <Brain size={22} />,
        activity: <Activity size={22} />,
        cpu: <Cpu size={22} />,
    };

    // Theme-safe colour classes — work in both light and dark
    const colourMap: Record<string, { bg: string; text: string; border: string }> = {
        green: { bg: "bg-green-100  dark:bg-green-900/30", text: "text-green-600  dark:text-green-400", border: "border-green-200  dark:border-green-700/50" },
        blue: { bg: "bg-sky-100    dark:bg-sky-900/30", text: "text-sky-600    dark:text-sky-400", border: "border-sky-200    dark:border-sky-700/50" },
        purple: { bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-600 dark:text-purple-400", border: "border-purple-200 dark:border-purple-700/50" },
        amber: { bg: "bg-amber-100  dark:bg-amber-900/30", text: "text-amber-600  dark:text-amber-400", border: "border-amber-200  dark:border-amber-700/50" },
    };

    const currentMetrics = metricsByMode[accessibilityMode] ?? metricsByMode.standard;

    useEffect(() => {
        const interval = setInterval(() => setAuditIndex(prev => (prev + 1) % 50), 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <DashboardLayout>
            <div className="space-y-8 pb-10">

                {/* ── Page Header ─────────────────────────────── */}
                <div className="flex flex-col xl:flex-row items-start xl:items-end justify-between gap-6 pt-4">
                    <div className="space-y-3">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--primary-light)] [box-shadow:var(--clay-shadow-sm)]">
                            <Activity size={13} className="text-[var(--primary)]" />
                            <span className="text-[11px] font-bold text-[var(--primary-dark)] tracking-wide">
                                {statusMap[timeOfDay]}
                            </span>
                        </div>
                        <h1 className="text-5xl font-black tracking-tight leading-tight text-[var(--foreground)]">
                            Health &amp; <span className="text-gradient">Analytics</span>
                        </h1>
                        <p className="text-[var(--foreground-muted)] font-medium max-w-xl text-base leading-relaxed">
                            Real-time analysis of your biometric trends and health security integrity.
                        </p>
                    </div>

                    {/* Summary pill row */}
                    <div className="flex items-center gap-4 p-4 bg-[var(--surface)] rounded-[1.75rem] border border-[var(--clay-border)] [box-shadow:var(--clay-shadow-md)]">
                        <div className="flex items-center gap-2 px-3 py-2 bg-green-100 dark:bg-green-900/30 rounded-2xl border border-green-200 dark:border-green-700/40">
                            <Lock size={13} className="text-green-600 dark:text-green-400" />
                            <span className="text-[10px] font-bold text-green-700 dark:text-green-300 uppercase tracking-wider">Vault Secure</span>
                        </div>
                        <div className="w-[1px] h-8 bg-[var(--clay-border)]" />
                        <div className="flex items-center gap-2 px-3 py-2 bg-sky-100 dark:bg-sky-900/30 rounded-2xl border border-sky-200 dark:border-sky-700/40">
                            <Cpu size={13} className="text-sky-600 dark:text-sky-400" />
                            <span className="text-[10px] font-bold text-sky-700 dark:text-sky-300 uppercase tracking-wider">Core Optimal</span>
                        </div>
                        <div className="w-[1px] h-8 bg-[var(--clay-border)]" />
                        <div className="flex items-center gap-2">
                            <Zap size={14} className="text-[var(--primary)]" />
                            <span className="text-[10px] font-bold text-[var(--foreground-muted)] uppercase tracking-wider">Live Sync</span>
                        </div>
                    </div>
                </div>

                {/* ── Metric Cards ─────────────────────────────── */}
                <div className={`grid grid-cols-1 md:grid-cols-${currentMetrics.length} gap-5`}>
                    {currentMetrics.map((metric, i) => {
                        const c = colourMap[metric.colour];
                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.08 }}
                            >
                                <GlassCard variant="elevated" className="!p-6 flex flex-col gap-4">
                                    {/* Icon */}
                                    <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center flex-shrink-0 ${c.bg} ${c.text} ${c.border}`}>
                                        {iconMap[metric.icon]}
                                    </div>

                                    {/* Label + value */}
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold text-[var(--foreground-muted)] uppercase tracking-widest">
                                            {metric.label}
                                        </p>
                                        <h4 className="text-4xl font-black tracking-tighter text-[var(--foreground)] leading-none">
                                            {metric.value}
                                        </h4>
                                    </div>

                                    {/* Status badge */}
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.6)]" />
                                        <span className="text-[10px] font-bold text-green-600 dark:text-green-400 uppercase tracking-widest">
                                            {metric.status}
                                        </span>
                                    </div>
                                </GlassCard>
                            </motion.div>
                        );
                    })}
                </div>

                {/* ── Bottom Grid: Chart + Audit ───────────────── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Biometric Trends Chart */}
                    <GlassCard className="!p-6 flex flex-col gap-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-700/40 flex items-center justify-center">
                                    <Activity size={16} className="text-red-500 dark:text-red-400" />
                                </div>
                                <h3 className="text-base font-black text-[var(--foreground)] tracking-tight">
                                    Biometric Trends
                                </h3>
                            </div>
                            <span className="px-3 py-1 bg-[var(--muted)] rounded-full text-[10px] font-bold text-[var(--foreground-muted)] uppercase tracking-wider">
                                Real-time
                            </span>
                        </div>

                        {/* Bar Chart */}
                        <div className="flex items-end gap-1 h-40">
                            {[40, 70, 45, 90, 65, 80, 50, 60, 85, 40, 75, 55, 65, 45, 95, 70, 80, 50].map((h, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ height: 0 }}
                                    animate={{ height: `${h}%` }}
                                    transition={{ delay: i * 0.03, type: "spring", stiffness: 120 }}
                                    className="flex-1 min-w-[4px] rounded-full bg-gradient-to-t from-[var(--primary)] to-[var(--secondary)] opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
                                    style={{ boxShadow: "inset 0 1px 2px rgba(255,255,255,0.3)" }}
                                />
                            ))}
                        </div>

                        {/* Stats row */}
                        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[var(--clay-border)]">
                            {[
                                { label: "Avg Heart Rate", val: "72", unit: "BPM", colour: "text-red-500" },
                                { label: "Sleep Depth", val: "84", unit: "%", colour: "text-sky-500" },
                                { label: "Stress Level", val: "Low", unit: "", colour: "text-green-500" },
                            ].map((stat, i) => (
                                <div key={i} className="text-center">
                                    <p className="text-[9px] font-bold text-[var(--foreground-muted)] uppercase tracking-widest mb-1">
                                        {stat.label}
                                    </p>
                                    <p className={`text-xl font-black tracking-tighter ${stat.colour}`}>
                                        {stat.val}
                                        {stat.unit && <span className="text-[10px] font-medium text-[var(--foreground-muted)] ml-0.5">{stat.unit}</span>}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </GlassCard>

                    {/* Security Audit */}
                    <GlassCard className="!p-6 flex flex-col gap-5">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-700/40 flex items-center justify-center">
                                <Brain size={16} className="text-purple-600 dark:text-purple-400" />
                            </div>
                            <h3 className="text-base font-black text-[var(--foreground)] tracking-tight">
                                Security Audit
                            </h3>
                        </div>

                        <div className="space-y-3">
                            {[
                                { title: "HIPAA Compliance", desc: "Verified audit complete. Data segmented and encrypted at rest.", status: "pass", icon: <ShieldCheck size={15} /> },
                                { title: "Access Control", desc: "Two-Step Authentication active for 100% of sensitive operations.", status: "pass", icon: <Fingerprint size={15} /> },
                                { title: "Empathetic Proxy", desc: "AI monitors health anomalies without local data persistence.", status: "pass", icon: <Brain size={15} /> },
                                { title: "Threat Vector", desc: "No infiltration detected in the last 2,400 synchronization cycles.", status: "pass", icon: <Lock size={15} /> },
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: 16 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.15 + i * 0.08 }}
                                    className="flex items-start gap-3 p-4 rounded-2xl bg-[var(--muted)] border border-[var(--clay-border)] [box-shadow:inset_0_1px_3px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.70)]"
                                >
                                    <div className="w-7 h-7 rounded-xl bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-700/40 flex items-center justify-center flex-shrink-0 text-green-600 dark:text-green-400">
                                        {item.icon}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[11px] font-black text-[var(--foreground)] uppercase tracking-wide mb-0.5">
                                            {item.title}
                                        </p>
                                        <p className="text-[11px] text-[var(--foreground-muted)] leading-snug">
                                            {item.desc}
                                        </p>
                                    </div>
                                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse mt-1.5 flex-shrink-0 shadow-[0_0_8px_rgba(74,222,128,0.6)]" />
                                </motion.div>
                            ))}
                        </div>
                    </GlassCard>
                </div>

            </div>
        </DashboardLayout>
    );
}
