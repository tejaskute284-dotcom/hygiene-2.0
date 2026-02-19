"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { motion, AnimatePresence, PanInfo, useMotionValue, useTransform } from "framer-motion";
import { Check, X, Pill, ArrowLeft, ArrowRight } from "lucide-react";
import { medicationsApi } from "@/lib/api";

interface MedicationSwiperProps {
    medications: any[];
    onUpdate?: () => void;
}

export function MedicationSwiper({ medications = [], onUpdate }: MedicationSwiperProps) {
    // Only show active medications
    const pendingMeds = medications.filter(m => m.isActive);

    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-25, 25]);
    const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);
    const skipOpacity = useTransform(x, [-150, -50], [1, 0]);
    const takeOpacity = useTransform(x, [50, 150], [0, 1]);

    const handleDragEnd = async (event: any, info: PanInfo, id: string) => {
        if (info.offset.x > 100) {
            try {
                // Log taking medication
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
            // Just skip for now (could log a skip if backend supports it)
            console.log("Skipped medication", id);
        }
        x.set(0); // Reset x for next card animation
    };

    return (
        <GlassCard className="h-full min-h-[450px] flex flex-col relative overflow-hidden">
            <div className="flex items-center justify-between mb-4 z-20">
                <h3 className="text-lg font-semibold">Active Reminders</h3>
                <span className="text-xs font-bold px-2 py-1 rounded-full bg-[var(--primary)] text-white">
                    {pendingMeds.length} LEFT
                </span>
            </div>

            <div className="flex-1 relative flex items-center justify-center">
                {/* Action Indicators */}
                <motion.div style={{ opacity: skipOpacity }} className="absolute left-4 z-10 flex flex-col items-center text-red-500 font-bold">
                    <X size={48} />
                    <span>SKIP</span>
                </motion.div>
                <motion.div style={{ opacity: takeOpacity }} className="absolute right-4 z-10 flex flex-col items-center text-green-500 font-bold">
                    <Check size={48} />
                    <span>TAKE</span>
                </motion.div>

                <AnimatePresence mode="popLayout">
                    {pendingMeds.length > 0 ? (
                        pendingMeds.map((med, index) => {
                            if (index !== 0) return null;

                            return (
                                <motion.div
                                    key={med.id}
                                    style={{ x, rotate, opacity }}
                                    className="absolute w-full max-w-[320px] aspect-[3/4] bg-[var(--background)] rounded-3xl shadow-2xl border-2 border-[var(--color-glass-border)] flex flex-col items-center justify-center p-8 cursor-grab active:cursor-grabbing z-20"
                                    drag="x"
                                    dragConstraints={{ left: 0, right: 0 }}
                                    onDragEnd={(e, info) => handleDragEnd(e, info, med.id)}
                                    whileDrag={{ scale: 1.05 }}
                                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                                    animate={{ scale: 1, opacity: 1, y: 0 }}
                                    exit={{
                                        x: x.get() > 0 ? 500 : -500,
                                        opacity: 0,
                                        scale: 0.5,
                                        transition: { duration: 0.3 }
                                    }}
                                >
                                    <div className={`w-28 h-28 rounded-full bg-primary/20 flex items-center justify-center mb-8 shadow-xl relative`}>
                                        <Pill size={48} className="text-[var(--primary)]" />
                                        <motion.div
                                            className="absolute inset-0 rounded-full border-4 border-white/30"
                                            animate={{ scale: [1, 1.2, 1], opacity: [0, 0.5, 0] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        />
                                    </div>

                                    <h4 className="text-3xl font-black mb-2 text-center">{med.name}</h4>
                                    <p className="text-[var(--secondary)] text-lg mb-8 font-medium">
                                        {med.dosage?.amount} {med.dosage?.unit} • {med.schedule?.times?.[0]}
                                    </p>

                                    <div className="flex items-center gap-2 text-[var(--secondary)] text-xs font-bold uppercase tracking-widest">
                                        <ArrowLeft size={14} className="animate-pulse" />
                                        <span>Swipe to Decide</span>
                                        <ArrowRight size={14} className="animate-pulse" />
                                    </div>
                                </motion.div>
                            );
                        })
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center"
                        >
                            <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                                <Check size={40} />
                            </div>
                            <h4 className="text-2xl font-black">All Done!</h4>
                            <p className="text-[var(--secondary)] font-medium">Enjoy your day.</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </GlassCard>
    );
}

