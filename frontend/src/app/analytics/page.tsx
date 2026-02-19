"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { ShieldCheck, Activity, Brain, Fingerprint, Lock, ShieldAlert, Zap, Heart, TrendingUp, Sparkles, ShieldCheck as Verified } from "lucide-react";
import { motion } from "framer-motion";

export default function AnalyticsPage() {
    const securityMetrics = [
        {
            label: "Neural Encryption",
            value: "256-bit",
            status: "Maximum Security",
            icon: <Lock className="w-6 h-6 text-emerald-500" />,
            color: "emerald"
        },
        {
            label: "Digital Identity",
            value: "Verified",
            status: "Biometric Linked",
            icon: <Fingerprint className="w-6 h-6 text-sky-500" />,
            color: "sky"
        },
        {
            label: "System Integrity",
            value: "Optimal",
            status: "Pulse Active",
            icon: <Verified className="w-6 h-6 text-primary" />,
            color: "primary"
        },
    ];

    return (
        <DashboardLayout>
            <div className="space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-6 duration-1000">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div>
                        <h1 className="text-section mb-3">Health Intelligence</h1>
                        <p className="text-subhead max-w-lg">
                            Real-time monitoring of your physiological signals and medical data integrity.
                        </p>
                    </div>
                    <div className="flex items-center gap-4 p-2 bg-white/40 rounded-3xl border border-white/20 shadow-clay">
                        <div className="p-3 bg-primary/10 rounded-2xl">
                            <TrendingUp className="w-5 h-5 text-primary" />
                        </div>
                        <div className="pr-6">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Sync Status</p>
                            <p className="text-xs font-black text-slate-900">100% SECURE</p>
                        </div>
                    </div>
                </div>

                {/* Security Overview Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {securityMetrics.map((metric, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <GlassCard variant="clay" className="flex items-center gap-6 group !p-8 transition-all duration-500">
                                <div className={`p-5 rounded-2xl bg-white shadow-clay transition-all duration-500`}>
                                    {metric.icon}
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{metric.label}</p>
                                    <h4 className="text-2xl font-black text-slate-900 tracking-tighter">{metric.value}</h4>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-1.5 h-1.5 rounded-full ${metric.color === 'emerald' ? 'bg-emerald-500' : metric.color === 'sky' ? 'bg-sky-500' : 'bg-primary'} animate-pulse`} />
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{metric.status}</p>
                                    </div>
                                </div>
                            </GlassCard>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Biometric Chart */}
                    <GlassCard variant="clay" className="min-h-[400px] flex flex-col group !p-10">
                        <div className="flex justify-between items-start mb-10">
                            <div className="flex items-center gap-4">
                                <div className="p-4 bg-sky-50 text-sky-500 rounded-2xl shadow-clay">
                                    <Activity size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black tracking-tight text-slate-900">Vitals Continuity</h3>
                                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mt-1">24 Hour Physiological Log</p>
                                </div>
                            </div>
                            <div className="px-4 py-2 bg-emerald-50 rounded-xl shadow-clay">
                                <span className="text-xs font-black text-emerald-600 tracking-widest uppercase">Live Pulse</span>
                            </div>
                        </div>

                        <div className="flex-1 flex items-end gap-3 px-2 min-h-[200px] relative">
                            {/* Decorative Grid Lines */}
                            <div className="absolute inset-x-0 bottom-0 h-full flex flex-col justify-between opacity-5 border-b border-slate-200">
                                <div className="w-full border-t border-slate-900" />
                                <div className="w-full border-t border-slate-900" />
                                <div className="w-full border-t border-slate-900" />
                            </div>

                            {[40, 70, 45, 90, 65, 80, 50, 60, 85, 40, 75, 55, 65, 80, 95].map((h, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ height: 0 }}
                                    animate={{ height: `${h}%` }}
                                    transition={{ delay: i * 0.05, duration: 1, ease: "easeOut" }}
                                    className="flex-1 bg-gradient-to-t from-primary/80 to-sky-400/80 rounded-t-xl group-hover:from-primary group-hover:to-sky-400 transition-all duration-500 shadow-sm relative z-10"
                                >
                                    <div className="absolute top-0 left-0 w-full h-1 bg-white/30 rounded-full" />
                                </motion.div>
                            ))}
                        </div>

                        <div className="mt-10 grid grid-cols-3 gap-4 text-center border-t border-slate-100 pt-8">
                            <div className="space-y-1">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Avg Pulse</p>
                                <p className="text-lg font-black text-slate-900">72 <span className="text-[10px]">BPM</span></p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Oxygen Sat</p>
                                <p className="text-lg font-black text-slate-900">98 <span className="text-[10px]">%</span></p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Stress State</p>
                                <p className="text-lg font-black text-emerald-500 uppercase">CALM</p>
                            </div>
                        </div>
                    </GlassCard>

                    {/* Security Audit */}
                    <GlassCard variant="clay" className="relative overflow-hidden !p-10 group">
                        <div className="absolute top-[-30px] right-[-30px] p-8 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity duration-1000 text-primary">
                            <ShieldCheck size={280} />
                        </div>

                        <div className="flex items-center gap-4 mb-10 relative z-10">
                            <div className="p-4 bg-purple-50 text-purple-600 rounded-2xl shadow-sm">
                                <Brain size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black tracking-tight text-slate-900">Security Audit</h3>
                                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mt-1">Autonomous Protocol Review</p>
                            </div>
                        </div>

                        <div className="space-y-6 relative z-10">
                            <motion.div
                                whileHover={{ x: 5 }}
                                className="p-6 bg-emerald-50/50 rounded-3xl border border-emerald-100/50 group-hover:bg-emerald-50 group-hover:shadow-clay transition-all duration-500"
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-1.5 bg-emerald-500 rounded-lg text-white shadow-lg shadow-emerald-500/30">
                                        <Verified size={14} />
                                    </div>
                                    <p className="text-xs font-black text-emerald-700 uppercase tracking-widest">Regulatory Status</p>
                                </div>
                                <p className="text-sm font-bold text-slate-700 leading-relaxed">Verified HIPAA Compliance Audit. Data is segmented and AES-256 encrypted at rest.</p>
                            </motion.div>

                            <motion.div
                                whileHover={{ x: 5 }}
                                className="p-6 bg-sky-50/50 rounded-3xl border border-sky-100/50 group-hover:bg-sky-50 group-hover:shadow-clay transition-all duration-500"
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-1.5 bg-sky-500 rounded-lg text-white shadow-lg shadow-sky-500/30">
                                        <Lock size={14} />
                                    </div>
                                    <p className="text-xs font-black text-sky-700 uppercase tracking-widest">Neural Access</p>
                                </div>
                                <p className="text-sm font-bold text-slate-700 leading-relaxed">Neural identity link established. Zero-trust access control active for all clinical operations.</p>
                            </motion.div>

                            <motion.div
                                whileHover={{ x: 5 }}
                                className="p-6 bg-purple-50/50 rounded-3xl border border-purple-100/50 group-hover:bg-purple-50 group-hover:shadow-clay transition-all duration-500"
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-1.5 bg-purple-500 rounded-lg text-white shadow-lg shadow-purple-500/30">
                                        <Sparkles size={14} />
                                    </div>
                                    <p className="text-xs font-black text-purple-700 uppercase tracking-widest">Privacy Proxy</p>
                                </div>
                                <p className="text-sm font-bold text-slate-700 leading-relaxed">Empathic AI Proxy active. Background processing anonymizes local data snapshots before sync.</p>
                            </motion.div>
                        </div>
                    </GlassCard>
                </div>
            </div>
        </DashboardLayout>
    );
}
