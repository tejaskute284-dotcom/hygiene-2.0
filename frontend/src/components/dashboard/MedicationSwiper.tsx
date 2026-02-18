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
    // Only show active medications
    const pendingMeds = medications.filter(m => m.isActive);

    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-15, 15]);
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
        } else if (info.offset.x < -100) {
            console.log("Skipped medication", id);
        }
        x.set(0);
    };

    return (
        <GlassCard className="h-full min-h-[600px] flex flex-col relative overflow-visible !p-0">
            {/* Neural Meta Header */}
            <div className="p-8 pb-4 flex items-center justify-between z-20">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <Target size={14} className="text-[#00E5FF]" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#00E5FF]">Registry Task</span>
                    </div>
                    <h3 className="text-2xl font-black uppercase tracking-tighter text-[var(--foreground)]">Queue Protocol</h3>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-[8px] font-black text-neutral-500 uppercase tracking-widest mb-1">Pending</span>
                    <div className="w-10 h-10 rounded-xl bg-white/5 text-[#00E5FF] flex items-center justify-center font-black text-base border border-[#00E5FF]/20 shadow-2xl backdrop-blur-xl">
                        {pendingMeds.length}
                    </div>
                </div>
            </div>

            <div className="flex-1 relative flex items-center justify-center p-6 pt-0">
                {/* Action Indicators - Enhanced */}
                <motion.div style={{ opacity: skipOpacity }} className="absolute left-6 z-10 flex flex-col items-center text-red-500 font-black text-[9px] tracking-[0.3em] pointer-events-none">
                    <div className="w-20 h-20 rounded-full border-2 border-red-500/20 bg-red-500/5 backdrop-blur-md flex items-center justify-center mb-3 shadow-[0_0_30px_rgba(239,68,68,0.1)]">
                        <X size={40} />
                    </div>
                    <span>ABORT</span>
                </motion.div>

                <motion.div style={{ opacity: takeOpacity }} className="absolute right-6 z-10 flex flex-col items-center text-[#00E5FF] font-black text-[9px] tracking-[0.3em] pointer-events-none">
                    <div className="w-20 h-20 rounded-full border-2 border-[#00E5FF]/20 bg-[#00E5FF]/5 backdrop-blur-md flex items-center justify-center mb-3 shadow-[0_0_30px_rgba(0,229,255,0.1)]">
                        <Check size={40} />
                    </div>
                    <span>EXECUTE</span>
                </motion.div>

                <AnimatePresence mode="popLayout">
                    {pendingMeds.length > 0 ? (
                        pendingMeds.map((med, index) => {
                            if (index !== 0) return null;

                            return (
                                <motion.div
                                    key={med.id}
                                    style={{ x, rotate, opacity }}
                                    className="absolute w-full h-[480px] bg-[var(--background)] rounded-[4rem] shadow-[0_40px_100px_rgba(0,0,0,0.3)] flex flex-col px-8 py-10 cursor-grab active:cursor-grabbing z-20 overflow-hidden text-[var(--foreground)] border border-white/10 backdrop-blur-3xl"
                                    drag="x"
                                    dragConstraints={{ left: 0, right: 0 }}
                                    onDragEnd={(e, info) => handleDragEnd(e, info, med.id)}
                                    whileDrag={{ scale: 1.05 }}
                                    initial={{ scale: 0.9, opacity: 0, y: 60 }}
                                    animate={{ scale: 1, opacity: 1, y: 0 }}
                                    exit={{
                                        x: x.get() > 0 ? 800 : -800,
                                        opacity: 0,
                                        scale: 0.6,
                                        transition: { duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }
                                    }}
                                >
                                    {/* Tech Elements */}
                                    <div className="scan-line !opacity-20" />
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,229,255,0.15),transparent_70%)]" />

                                    {/* Header Section */}
                                    <div className="flex justify-between items-start mb-12 relative z-10">
                                        <div className="p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-xl shadow-xl">
                                            <Pill size={28} strokeWidth={2} className="text-[#00E5FF]" />
                                        </div>
                                        <div className="text-right">
                                            <div className="text-[9px] font-black uppercase tracking-[0.2em] text-[#00E5FF]/60 mb-1">Dosage Spec</div>
                                            <div className="text-xl font-black uppercase text-[var(--foreground)] tracking-tighter truncate max-w-[120px]">{med.dosage?.amount} {med.dosage?.unit}</div>
                                        </div>
                                    </div>

                                    {/* Identity Section - Scaled Down Name */}
                                    <div className="flex-1 flex flex-col justify-center space-y-4 relative z-10 py-4">
                                        <span className="text-[9px] font-black uppercase tracking-[0.4em] text-[#00E5FF]">Target Identification</span>
                                        <h4 className="text-5xl font-black uppercase tracking-tighter leading-[0.85] text-[var(--foreground)]">
                                            {med.name}
                                        </h4>
                                    </div>

                                    {/* Tech Metadata */}
                                    <div className="flex items-center gap-6 mb-8 relative z-10">
                                        <div className="h-[1px] flex-1 bg-gradient-to-r from-[#00E5FF]/40 to-transparent" />
                                        <span className="text-[8px] font-mono text-neutral-500 uppercase tracking-widest">Registry: {med.id.slice(0, 12)}</span>
                                    </div>

                                    {/* Bottom Status Hint */}
                                    <div className="mt-auto pt-6 flex flex-col items-center gap-6 relative z-10">
                                        <div className="flex items-center gap-10">
                                            <motion.div
                                                animate={{ x: [-8, 0, -8], opacity: [0.3, 1, 0.3] }}
                                                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                                            >
                                                <ArrowLeft size={20} className="text-red-500/40" />
                                            </motion.div>

                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center relative group shadow-2xl backdrop-blur-3xl">
                                                    <Fingerprint size={28} className="text-[#00E5FF] group-hover:scale-110 transition-transform" />
                                                    <div className="absolute inset-0 bg-[#00E5FF]/10 animate-pulse rounded-2xl" />
                                                </div>
                                                <span className="text-[8px] font-black uppercase tracking-[0.4em] text-[var(--secondary)]">Scan Authorized</span>
                                            </div>

                                            <motion.div
                                                animate={{ x: [8, 0, 8], opacity: [0.3, 1, 0.3] }}
                                                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                                            >
                                                <ArrowRight size={20} className="text-[#00E5FF]" />
                                            </motion.div>
                                        </div>
                                        <div className="w-full h-[4px] bg-white/5 rounded-full overflow-hidden relative">
                                            <motion.div
                                                className="absolute inset-0 bg-gradient-to-r from-red-500 via-[#00E5FF] to-green-500"
                                                style={{ x: useTransform(x, [-180, 180], [-320, 320]) }}
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
                            className="text-center space-y-8"
                        >
                            <div className="relative inline-block">
                                <motion.div
                                    className="absolute inset-0 bg-[#00E5FF]/20 rounded-full blur-3xl"
                                    animate={{ scale: [1, 1.8, 1], opacity: [0.2, 0.5, 0.2] }}
                                    transition={{ duration: 6, repeat: Infinity }}
                                />
                                <div className="relative w-32 h-32 bg-black text-[#00E5FF] rounded-[2.5rem] flex items-center justify-center shadow-[0_0_50px_rgba(0,229,255,0.2)] border border-[#00E5FF]/30">
                                    <ShieldCheck size={56} strokeWidth={1.5} />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <h4 className="text-4xl font-black uppercase tracking-tighter text-[var(--foreground)]">Registry Clear</h4>
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--secondary)]">All sequences successfully completed</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Neural Meta Footer */}
            <div className="p-8 bg-white/5 border-t border-white/5 rounded-b-[3rem] flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Zap size={16} className="text-[#00E5FF]" />
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--secondary)]">Real-time Sync Active</span>
                </div>
                <div className="text-[9px] font-mono text-[var(--secondary)]">CRC-32: OK</div>
            </div>
        </GlassCard>
    );
}

