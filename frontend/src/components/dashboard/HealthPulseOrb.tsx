"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { motion } from "framer-motion";

export function HealthPulseOrb() {
    return (
        <GlassCard className="flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden group">
            {/* Background Atmosphere */}
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/20 via-transparent to-[var(--accent)]/10 opacity-50 pointer-events-none" />

            {/* Pulsing Core Container */}
            <div className="relative w-48 h-48 flex items-center justify-center">
                {/* Outer Rotating Rings */}
                {[0, 120, 240].map((deg, i) => (
                    <motion.div
                        key={i}
                        className="absolute inset-0 rounded-full border border-[var(--primary)]/20"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10 + i * 2, repeat: Infinity, ease: "linear" }}
                        style={{ rotate: deg }}
                    />
                ))}

                {/* Main Orb Core */}
                <motion.div
                    className="w-32 h-32 rounded-full bg-gradient-to-tr from-[var(--primary)] to-[var(--accent)] shadow-[0_0_60px_rgba(59,130,246,0.6)] flex items-center justify-center relative z-10 border-4 border-white/20"
                    animate={{
                        scale: [1, 1.08, 1],
                        boxShadow: [
                            "0 0 40px rgba(59,130,246,0.4)",
                            "0 0 70px rgba(59,130,246,0.7)",
                            "0 0 40px rgba(59,130,246,0.4)"
                        ]
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    <div className="text-white text-center">
                        <motion.span
                            className="text-5xl font-black tracking-tighter"
                            animate={{ opacity: [0.8, 1, 0.8] }}
                            transition={{ duration: 3, repeat: Infinity }}
                        >
                            98
                        </motion.span>
                        <span className="text-[10px] block font-black uppercase tracking-[0.2em] opacity-80 -mt-1">Pulse</span>
                    </div>
                </motion.div>

                {/* Dynamic Particles/Ripples */}
                {[...Array(2)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute inset-0 rounded-full border-2 border-[var(--primary)]/30"
                        animate={{
                            scale: [1, 1.8],
                            opacity: [0.6, 0],
                        }}
                        transition={{
                            duration: 3,
                            delay: i * 1.5,
                            repeat: Infinity,
                            ease: "easeOut"
                        }}
                    />
                ))}
            </div>

            <div className="mt-8 z-10 text-center">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--secondary)] mb-1">Status Report</h4>
                <p className="text-xl font-black text-[var(--foreground)] uppercase tracking-tight">Optimal Stability</p>
            </div>
        </GlassCard>
    );
}
