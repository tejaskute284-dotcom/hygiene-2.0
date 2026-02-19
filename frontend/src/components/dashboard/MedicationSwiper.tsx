"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { motion, AnimatePresence, PanInfo, useMotionValue, useTransform } from "framer-motion";
import { Check, X, Pill, ArrowLeft, ArrowRight, Zap, Target, Fingerprint, ShieldCheck } from "lucide-react";
import { medicationsApi } from "@/lib/api";

interface MedicationSwiperProps {
    medications: any[];
    onUpdate?: () => void;
}

export function MedicationSwiper({ medications = [], onUpdate }: MedicationSwiperProps) {
    const pendingMeds = medications.filter(m => m.isActive);

    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-12, 12]);
    const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);
    const skipOpacity = useTransform(x, [-150, -50], [1, 0]);
    const takeOpacity = useTransform(x, [50, 150], [0, 1]);

    const handleDragEnd = async (event: any, info: PanInfo, id: string) => {
        if (info.offset.x > 100) {
            try {
                await medicationsApi.logMedication({
                    medicationId: id,
                    scheduledTime: new Date().toISOString(),
                    confirmationMethod: 'swipe'
                });
                if (onUpdate) onUpdate();
            } catch (error) {
                console.error("Failed to log medication:", error);
            }
        }
        x.set(0);
    };

    return (
        <GlassCard className="flex flex-col relative overflow-visible !p-0">
            {/* Header */}
            <div className="px-7 pt-7 pb-4 flex items-center justify-between">
                <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                        <Target size={12} className="text-[var(--primary)]" />
                        <span className="text-[9px] font-black uppercase tracking-[0.4em] text-[var(--primary)]">Queue Protocol</span>
                    </div>
                    <h3 className="text-xl font-black uppercase tracking-tighter text-[var(--foreground)]">Medications</h3>
                </div>
                <div className="flex flex-col items-end gap-0.5">
                    <span className="text-[8px] font-black text-[var(--secondary)] uppercase tracking-widest">Pending</span>
                    <div className="w-9 h-9 rounded-xl bg-[var(--glass-bg)] text-[var(--primary)] flex items-center justify-center font-black text-sm border border-[var(--glass-border)] backdrop-blur-xl">
                        {pendingMeds.length}
                    </div>
                </div>
            </div>

            {/* Card Arena */}
            <div className="relative flex items-center justify-center px-5 py-4" style={{ minHeight: 380 }}>
                {/* Swipe Indicators */}
                <motion.div style={{ opacity: skipOpacity }} className="absolute left-4 z-10 flex flex-col items-center gap-2 text-red-400 pointer-events-none">
                    <div className="w-14 h-14 rounded-full border-2 border-red-400/30 bg-red-400/10 flex items-center justify-center">
                        <X size={28} />
                    </div>
                    <span className="text-[8px] font-black uppercase tracking-[0.3em]">ABORT</span>
                </motion.div>

                <motion.div style={{ opacity: takeOpacity }} className="absolute right-4 z-10 flex flex-col items-center gap-2 text-[var(--primary)] pointer-events-none">
                    <div className="w-14 h-14 rounded-full border-2 border-[var(--primary)]/30 bg-[var(--primary)]/10 flex items-center justify-center">
                        <Check size={28} />
                    </div>
                    <span className="text-[8px] font-black uppercase tracking-[0.3em]">TAKE</span>
                </motion.div>

                <AnimatePresence mode="popLayout">
                    {pendingMeds.length > 0 ? (
                        pendingMeds.map((med, index) => {
                            if (index !== 0) return null;
                            return (
                                <motion.div
                                    key={med.id}
                                    className="w-full rounded-[2.5rem] cursor-grab active:cursor-grabbing z-20 overflow-hidden border border-[var(--glass-border)] backdrop-blur-3xl relative"
                                    style={{ x, rotate, opacity, background: "var(--glass-bg)" }}
                                    drag="x"
                                    dragConstraints={{ left: 0, right: 0 }}
                                    onDragEnd={(e, info) => handleDragEnd(e, info, med.id)}
                                    whileDrag={{ scale: 1.03 }}
                                    initial={{ scale: 0.9, opacity: 0, y: 30 }}
                                    animate={{ scale: 1, opacity: 1, y: 0 }}
                                    exit={{
                                        x: x.get() > 0 ? 600 : -600,
                                        opacity: 0,
                                        scale: 0.7,
                                        transition: { duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }
                                    }}
                                >
                                    {/* Radial glow top */}
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,var(--glow-primary),transparent_60%)] pointer-events-none" />
                                    <div className="scan-line !opacity-10" />

                                    <div className="relative z-10 p-7 flex flex-col gap-5">

                                        {/* Row 1: Pill icon + Dosage */}
                                        <div className="flex items-start justify-between">
                                            <div className="p-3 bg-[var(--glass-bg)] rounded-2xl border border-[var(--glass-border)] shadow-lg">
                                                <Pill size={24} strokeWidth={2} className="text-[var(--primary)]" />
                                            </div>
                                            <div className="text-right">
                                                <div className="text-[9px] font-black uppercase tracking-[0.25em] text-[var(--primary)] opacity-70 mb-0.5">Dosage Spec</div>
                                                <div className="text-2xl font-black uppercase text-[var(--foreground)] tracking-tighter leading-none">
                                                    {med.dosage?.amount} {med.dosage?.unit}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Row 2: Name */}
                                        <div className="space-y-1">
                                            <span className="text-[9px] font-black uppercase tracking-[0.45em] text-[var(--primary)]">Target Identification</span>
                                            <h4 className="text-4xl font-black uppercase tracking-tighter leading-[0.9] text-[var(--foreground)] break-words">
                                                {med.name}
                                            </h4>
                                        </div>

                                        {/* Row 3: Registry / divider */}
                                        <div className="flex items-center gap-3">
                                            <div className="h-[1px] flex-1 bg-gradient-to-r from-[var(--primary)]/30 to-transparent" />
                                            <span className="text-[8px] font-mono text-[var(--secondary)] uppercase tracking-widest">
                                                {med.id.slice(0, 12)}
                                            </span>
                                        </div>

                                        {/* Row 4: Fingerprint + arrows */}
                                        <div className="flex items-center justify-between pt-1">
                                            <motion.div
                                                animate={{ x: [-5, 0, -5], opacity: [0.4, 1, 0.4] }}
                                                transition={{ repeat: Infinity, duration: 2 }}
                                            >
                                                <ArrowLeft size={18} className="text-red-400/60" />
                                            </motion.div>

                                            <div className="flex flex-col items-center gap-2">
                                                <div className="w-12 h-12 rounded-2xl bg-[var(--glass-bg)] border border-[var(--glass-border)] flex items-center justify-center relative shadow-lg">
                                                    <Fingerprint size={24} className="text-[var(--primary)]" />
                                                    <div className="absolute inset-0 bg-[var(--primary)]/10 animate-pulse rounded-2xl" />
                                                </div>
                                                <span className="text-[7px] font-black uppercase tracking-[0.3em] text-[var(--secondary)]">Swipe to Act</span>
                                            </div>

                                            <motion.div
                                                animate={{ x: [5, 0, 5], opacity: [0.4, 1, 0.4] }}
                                                transition={{ repeat: Infinity, duration: 2 }}
                                            >
                                                <ArrowRight size={18} className="text-[var(--primary)]" />
                                            </motion.div>
                                        </div>

                                        {/* Row 5: Drag slider bar */}
                                        <div className="w-full h-[3px] bg-[var(--glass-bg)] rounded-full overflow-hidden">
                                            <motion.div
                                                className="absolute inset-0 h-full bg-gradient-to-r from-red-400 via-[var(--primary)] to-green-400"
                                                style={{ x: useTransform(x, [-180, 180], [-300, 300]) }}
                                            />
                                        </div>

                                    </div>
                                </motion.div>
                            );
                        })
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center gap-6 py-10 text-center"
                        >
                            <div className="relative">
                                <motion.div
                                    className="absolute inset-0 bg-[var(--primary)]/20 rounded-full blur-3xl"
                                    animate={{ scale: [1, 1.6, 1], opacity: [0.2, 0.5, 0.2] }}
                                    transition={{ duration: 5, repeat: Infinity }}
                                />
                                <div className="relative w-24 h-24 bg-[var(--glass-bg)] text-[var(--primary)] rounded-[2rem] flex items-center justify-center border border-[var(--glass-border)] shadow-xl">
                                    <ShieldCheck size={44} strokeWidth={1.5} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-3xl font-black uppercase tracking-tighter text-[var(--foreground)]">Registry Clear</h4>
                                <p className="text-[9px] font-black uppercase tracking-[0.35em] text-[var(--secondary)]">All sequences completed</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="px-7 py-4 bg-[var(--glass-bg)] border-t border-[var(--glass-border)] rounded-b-[2.5rem] flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Zap size={12} className="text-[var(--primary)]" />
                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-[var(--secondary)]">Real-time Sync</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-[8px] font-mono text-[var(--secondary)]">CRC-32: OK</span>
                </div>
            </div>
        </GlassCard>
    );
}
