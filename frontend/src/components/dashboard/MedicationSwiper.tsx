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
        <GlassCard variant="clay" className="h-full min-h-[450px] flex flex-col relative overflow-hidden group">
            <div className="flex items-center justify-between mb-8 z-20">
                <div>
                    <h3 className="text-xl font-black uppercase tracking-tight text-slate-800">Daily Regimen</h3>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-1">Pending Actions</p>
                </div>
                <div className="flex items-center gap-2 bg-white/50 px-4 py-2 rounded-2xl shadow-clay border border-white">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                        {pendingMeds.length} Remaining
                    </span>
                </div>
            </div>

            <div className="flex-1 relative flex items-center justify-center">
                {/* Action Indicators */}
                <motion.div style={{ opacity: skipOpacity }} className="absolute left-4 z-10 flex flex-col items-center text-slate-400 font-bold">
                    <X size={48} />
                    <span className="text-[10px] font-black uppercase tracking-widest mt-2">SKIP</span>
                </motion.div>
                <motion.div style={{ opacity: takeOpacity }} className="absolute right-4 z-10 flex flex-col items-center text-emerald-500 font-bold">
                    <Check size={48} />
                    <span className="text-[10px] font-black uppercase tracking-widest mt-2">TAKE</span>
                </motion.div>

                <AnimatePresence mode="popLayout">
                    {pendingMeds.length > 0 ? (
                        pendingMeds.map((med, index) => {
                            if (index !== 0) return null;

                            return (
                                <motion.div
                                    key={med.id}
                                    style={{ x, rotate, opacity }}
                                    className="absolute w-full max-w-[340px] aspect-[4/5] bg-white rounded-[3rem] shadow-clay border-2 border-white flex flex-col items-center justify-between p-10 cursor-grab active:cursor-grabbing z-20 overflow-hidden"
                                    drag="x"
                                    dragConstraints={{ left: 0, right: 0 }}
                                    onDragEnd={(e, info) => handleDragEnd(e, info, med.id)}
                                    whileDrag={{ scale: 1.05 }}
                                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                                    animate={{ scale: 1, opacity: 1, y: 0 }}
                                    exit={{
                                        x: x.get() > 0 ? 600 : -600,
                                        opacity: 0,
                                        scale: 0.5,
                                        transition: { duration: 0.4, ease: "circIn" }
                                    }}
                                >
                                    {/* Decorative background element */}
                                    <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-sky-50 to-transparent -z-10 opacity-50" />

                                    <div className="w-full flex flex-col items-center">
                                        <div className={`w-32 h-32 rounded-[2.5rem] bg-white flex items-center justify-center mb-8 shadow-clay relative border-2 border-sky-50 transition-transform group-hover:scale-110 duration-500`}>
                                            <Pill size={56} className="text-primary" />
                                            <motion.div
                                                className="absolute inset-0 rounded-[2.5rem] border-4 border-primary/5"
                                                animate={{ scale: [1, 1.15, 1], opacity: [0, 0.4, 0] }}
                                                transition={{ duration: 3, repeat: Infinity }}
                                            />
                                        </div>

                                        <h4 className="text-4xl font-black mb-3 text-center text-slate-900 tracking-tighter leading-tight">{med.name}</h4>
                                        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full border border-emerald-100/50">
                                            <span className="text-[11px] font-black uppercase tracking-[0.1em]">
                                                {med.dosage?.amount} {med.dosage?.unit} • {med.schedule?.times?.[0]}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="w-full">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="bg-sky-50/50 px-10 py-8 rounded-[3rem] shadow-clay border border-white flex flex-col items-center justify-center text-primary font-black uppercase tracking-[0.2em] scale-90">
                                                <span className="text-[12px] mb-1">Swipe</span>
                                                <div className="flex items-center gap-3">
                                                    <ArrowLeft size={16} className="opacity-30" />
                                                    <span className="text-[14px]">To</span>
                                                    <ArrowRight size={16} className="opacity-30" />
                                                </div>
                                                <span className="text-[12px] mt-1">Decide</span>
                                            </div>
                                            <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.3em]">Synapse Care Protocol</p>
                                        </div>
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
                            <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full border-2 border-white shadow-clay flex items-center justify-center mx-auto mb-6">
                                <Check size={40} />
                            </div>
                            <h4 className="text-2xl font-black uppercase tracking-tighter text-slate-900">All Done!</h4>
                            <p className="text-secondary font-black text-[10px] uppercase tracking-[0.2em] mt-2">Enjoy your day.</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </GlassCard>
    );
}

