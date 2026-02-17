"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { ShieldCheck, Activity, Brain, Fingerprint, Lock, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";

export default function AnalyticsPage() {
    const securityMetrics = [
        { label: "Data Encryption", value: "100%", status: "Active", icon: <Lock className="text-green-500" /> },
        { label: "Trust Score", value: "98/100", status: "Optimal", icon: <Fingerprint className="text-blue-500" /> },
        { label: "2FA Status", value: "Enabled", status: "Verified", icon: <ShieldCheck className="text-[var(--primary)]" /> },
    ];

    return (
        <DashboardLayout>
            <div className="space-y-8">
                <div>
                    <h1 className="text-4xl font-black tracking-tight mb-2">Health & Security Analytics</h1>
                    <p className="text-[var(--secondary)] font-medium">Monitoring your health pulse and defensive integrity.</p>
                </div>

                {/* Security Overview Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {securityMetrics.map((metric, i) => (
                        <GlassCard key={i} className="flex items-center gap-4">
                            <div className="p-4 bg-[var(--muted)] rounded-2xl">
                                {metric.icon}
                            </div>
                            <div>
                                <p className="text-xs font-bold text-[var(--secondary)] uppercase tracking-widest">{metric.label}</p>
                                <h4 className="text-2xl font-black">{metric.value}</h4>
                                <p className="text-[10px] font-black text-green-500 uppercase">{metric.status}</p>
                            </div>
                        </GlassCard>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <GlassCard className="min-h-[300px]">
                        <h3 className="text-lg font-black mb-6 flex items-center gap-2">
                            <Activity className="text-red-500" />
                            Biometric Trends
                        </h3>
                        <div className="h-48 flex items-end gap-2 px-4">
                            {[40, 70, 45, 90, 65, 80, 50, 60, 85, 40, 75, 55].map((h, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ height: 0 }}
                                    animate={{ height: `${h}%` }}
                                    transition={{ delay: i * 0.05 }}
                                    className="flex-1 bg-gradient-to-t from-[var(--primary)] to-blue-400 rounded-t-lg opacity-80"
                                />
                            ))}
                        </div>
                        <div className="mt-6 grid grid-cols-3 text-center border-t border-[var(--color-glass-border)] pt-4">
                            <div>
                                <p className="text-[10px] font-bold text-[var(--secondary)] uppercase">Avg Heart Rate</p>
                                <p className="font-black">72 BPM</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-[var(--secondary)] uppercase">Sleep Depth</p>
                                <p className="font-black">84%</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-[var(--secondary)] uppercase">Stress Level</p>
                                <p className="font-black text-green-500">Low</p>
                            </div>
                        </div>
                    </GlassCard>

                    <GlassCard className="relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <ShieldAlert size={150} />
                        </div>
                        <h3 className="text-lg font-black mb-6 flex items-center gap-2">
                            <Brain className="text-purple-500" />
                            Security Purpose Audit
                        </h3>
                        <div className="space-y-4">
                            <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-2xl border border-green-200 dark:border-green-800/30">
                                <p className="text-xs font-bold text-green-700 dark:text-green-400 uppercase mb-1">HIPAA Compliance</p>
                                <p className="text-sm">Verified audit complete. Data is segmented and encrypted at rest.</p>
                            </div>
                            <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-200 dark:border-blue-800/30">
                                <p className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase mb-1">Access Control</p>
                                <p className="text-sm">Two-Step Authentication active for 100% of sensitive operations.</p>
                            </div>
                            <div className="p-4 bg-purple-50 dark:bg-purple-900/10 rounded-2xl border border-purple-200 dark:border-purple-800/30">
                                <p className="text-xs font-bold text-purple-700 dark:text-purple-400 uppercase mb-1">Empathetic Proxy</p>
                                <p className="text-sm">AI monitors for health anomalies without local data persistence.</p>
                            </div>
                        </div>
                    </GlassCard>
                </div>
            </div>
        </DashboardLayout>
    );
}
