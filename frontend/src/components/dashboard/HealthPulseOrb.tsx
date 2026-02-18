"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { motion } from "framer-motion";
import { ShieldCheck, Zap, Activity, Target, Cpu } from "lucide-react";

export function HealthPulseOrb() {
    return (
        <GlassCard className="flex flex-col items-center justify-between min-h-[500px] relative overflow-hidden group border-none shadow-[0_50px_100px_rgba(0,0,0,0.1)] !p-0">
            {/* Artistic Background Emitter */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,229,255,0.05),transparent_70%)]" />

            {/* Scan Line Animation */}
            <div className="scan-line !opacity-10 pointer-events-none" />

            {/* Visual Header */}
            <div className="p-8 w-full flex items-center justify-between z-20">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <Cpu size={14} className="text-[#00E5FF]" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#00E5FF]">Core Matrix</span>
                    </div>
                    <h3 className="text-xl font-black uppercase tracking-tighter text-[var(--foreground)]">Bio Pulse</h3>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 rounded-xl border border-green-500/20">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-green-600">Sync Active</span>
                </div>
            </div>

            {/* Pulsing Core System */}
            <div className="relative w-72 h-72 flex items-center justify-center">
                {/* Orbital Rings - Advanced */}
                {[...Array(4)].map((_, i) => (
                    <motion.div
                        key={i}
                        className={`absolute inset-0 rounded-full border ${i % 2 === 0 ? 'border-[#00E5FF]/20' : 'border-black/5'}`}
                        style={{ padding: i * 12 }}
                        animate={{
                            rotate: i % 2 === 0 ? 360 : -360,
                            scale: [1, 1.02, 1],
                        }}
                        transition={{
                            rotate: { duration: 20 + i * 10, repeat: Infinity, ease: "linear" },
                            scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                        }}
                    >
                        {i === 0 && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#00E5FF] shadow-[0_0_15px_#00E5FF]" />}
                    </motion.div>
                ))}

                {/* The "Pulse" Core - High End */}
                <motion.div
                    className="w-44 h-44 rounded-full relative z-10 flex items-center justify-center overflow-hidden bg-[var(--background)] ring-[12px] ring-white/5 border border-white/5"
                    animate={{
                        boxShadow: [
                            "0 0 60px rgba(0,229,255,0.1)",
                            "0 0 100px rgba(0,229,255,0.3)",
                            "0 0 60px rgba(0,229,255,0.1)"
                        ]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                >
                    {/* Interior Data Streams */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-white/5" />
                    <motion.div
                        className="absolute inset-0 opacity-20"
                        style={{ backgroundImage: 'radial-gradient(#00E5FF 1px, transparent 1px)', backgroundSize: '16px 16px' }}
                        animate={{ y: [0, -16] }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />

                    <div className="relative z-20 text-[var(--foreground)] text-center">
                        <div className="flex items-center justify-center mb-2">
                            <Target size={18} className="text-[#00E5FF] animate-pulse" />
                        </div>
                        <motion.div
                            className="flex flex-col items-center"
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        >
                            <span className="text-7xl font-black tracking-tighter block leading-none text-[var(--foreground)]">
                                98
                            </span>
                            <span className="text-[9px] font-black uppercase tracking-[0.5em] text-[#00E5FF] mt-1">Stability</span>
                        </motion.div>
                    </div>

                    {/* Scanning Shine */}
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-t from-transparent via-[#00E5FF]/10 to-transparent"
                        animate={{ top: ['-100%', '100%'] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    />
                </motion.div>

                {/* Ambient Glow Emitter */}
                <div className="absolute inset-0 rounded-full bg-[#00E5FF]/5 blur-[100px] pointer-events-none" />
            </div>

            {/* Bottom Insight Area */}
            <div className="w-full p-8 pt-0 z-10 space-y-8">
                <div className="h-[1px] w-full bg-black/5" />

                <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-1">
                        <div className="text-[8px] font-black uppercase tracking-[0.3em] text-neutral-400">Biological Flux</div>
                        <div className="text-xl font-black tracking-tighter uppercase">Optimal</div>
                    </div>
                    <div className="space-y-1 text-right">
                        <div className="text-[8px] font-black uppercase tracking-[0.3em] text-neutral-400">Sync Rate</div>
                        <div className="text-xl font-black tracking-tighter uppercase text-[#00E5FF]">1.4ms</div>
                    </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-[#00E5FF]">
                            <Activity size={16} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]">Deep Pulse Tracking</span>
                    </div>
                    <ShieldCheck size={18} className="text-[#00E5FF]" />
                </div>
            </div>
        </GlassCard>
    );
}
