"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { motion, AnimatePresence } from "framer-motion";
import { Pill, Plus, Trash2, ShieldAlert, Thermometer, Droplets, Database, Fingerprint } from "lucide-react";

interface PillCabinetProps {
    medications: any[];
    onAdd?: () => void;
    onDelete?: (id: string) => void;
}

export function PillCabinet({ medications = [], onAdd, onDelete }: PillCabinetProps) {
    return (
        <GlassCard className="h-full relative overflow-hidden group/cabinet !p-0">
            {/* Environmental Header */}
            <div className="p-8 border-b border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 bg-white/5 backdrop-blur-3xl">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <Database size={14} className="text-[#00E5FF]" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#00E5FF]">Registry Store</span>
                    </div>
                    <h3 className="text-3xl font-black uppercase tracking-tighter text-[var(--foreground)]">Pharmacy Cabinet</h3>
                </div>

                <div className="flex items-center gap-6 p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-xl">
                    <div className="flex items-center gap-3 pr-6 border-r border-white/10">
                        <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400">
                            <Thermometer size={14} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[7px] font-black uppercase tracking-widest text-[var(--secondary)]">Temp</span>
                            <span className="text-[10px] font-black tracking-tighter text-[var(--foreground)]">24°C</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                            <Droplets size={14} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[7px] font-black uppercase tracking-widest text-[var(--secondary)]">Humidity</span>
                            <span className="text-[10px] font-black tracking-tighter text-[var(--foreground)]">42% RH</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
                    <AnimatePresence mode="popLayout">
                        {medications.map((med, index) => (
                            <motion.div
                                key={med.id}
                                layout
                                className="group relative h-[320px] rounded-[3rem] bg-white/5 border border-white/10 shadow-2xl p-6 flex flex-col items-center hover:shadow-[0_40px_80px_rgba(0,229,255,0.05)] transition-all cursor-pointer overflow-hidden hover:border-[#00E5FF]/30 backdrop-blur-xl"
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ delay: index * 0.05, duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
                            >
                                {/* Scan Line on Hover */}
                                <div className="absolute inset-x-0 h-[2px] bg-[#00E5FF] opacity-0 group-hover:opacity-20 top-0 group-hover:top-full transition-all duration-[2000ms] ease-linear pointer-events-none" />

                                {/* Header Stats */}
                                <div className="w-full flex justify-between items-center mb-6 z-20">
                                    <div className={`w-2 h-2 rounded-full ${med.isActive ? 'bg-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.5)]' : 'bg-red-500'}`} />
                                    {onDelete && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onDelete(med.id); }}
                                            className="p-2 opacity-0 group-hover:opacity-100 text-neutral-300 hover:text-red-500 transition-all hover:scale-110"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>

                                {/* Abstract 3D Visualization */}
                                <div className="flex-1 w-full flex items-center justify-center relative">
                                    <motion.div
                                        className="relative"
                                        whileHover={{ y: -10 }}
                                    >
                                        {/* Outer Glass Container */}
                                        <div className="w-16 h-28 rounded-[1.5rem] bg-[var(--background)] border border-white/20 shadow-inner backdrop-blur-lg flex items-center justify-center p-2">
                                            {/* Filling Indicator */}
                                            <div
                                                className="absolute bottom-1 inset-x-1 bg-[#00E5FF]/10 rounded-[1.2rem] transition-all duration-1000 group-hover:bg-[#00E5FF]/20"
                                                style={{ height: `${(med.inventory?.currentQuantity / (med.inventory?.maxQuantity || 60)) * 100}%`, maxHeight: '95%' }}
                                            />
                                            {/* Brand Logo in Bottle */}
                                            <div className="relative z-10 p-3 rounded-full bg-white/5 backdrop-blur-md border border-white/10">
                                                <Pill size={20} className="text-[#00E5FF] drop-shadow-lg" />
                                            </div>
                                        </div>
                                        {/* Reflection Mask */}
                                        <div className="absolute inset-0 bg-gradient-to-tr from-white/40 via-transparent to-transparent pointer-events-none rounded-[2rem]" />
                                    </motion.div>

                                    {/* Shadow under bottle */}
                                    <div className="absolute bottom-8 w-12 h-2 bg-[var(--background)]/5 blur-md rounded-full group-hover:w-16 transition-all duration-500" />
                                </div>

                                {/* Detailed Textual Info */}
                                <div className="w-full text-center space-y-2 pt-4 border-t border-white/5 bg-transparent">
                                    <div className="space-y-1">
                                        <h4 className="font-black text-xs uppercase tracking-tight truncate text-[var(--foreground)]">{med.name}</h4>
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="px-2 py-0.5 bg-white/5 rounded-md text-[7px] font-black uppercase tracking-widest text-[var(--secondary)] border border-white/5">
                                                {med.dosage?.amount} {med.dosage?.unit}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-center gap-4">
                                        <div className="space-y-0.5">
                                            <div className="text-[7px] font-black uppercase tracking-widest text-[var(--secondary)]">Remaining</div>
                                            <div className={`text-xs font-black tracking-tighter ${med.inventory?.currentQuantity < med.inventory?.refillThreshold ? 'text-red-500' : 'text-[var(--foreground)]'}`}>
                                                {med.inventory?.currentQuantity} UNITS
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Automated Refill Badge */}
                                <div className="absolute inset-x-0 bottom-0 py-1.5 bg-[var(--foreground)] flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Fingerprint size={10} className="text-[var(--background)]" />
                                    <span className="text-[7px] font-black text-[var(--background)] uppercase tracking-[0.3em]">SECURE ACCESS ENABLED</span>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    <motion.button
                        whileHover={{ scale: 1.02, y: -5 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onAdd}
                        className="h-[320px] rounded-[3rem] border border-[#00E5FF]/30 bg-white/5 flex flex-col items-center justify-center gap-6 group transition-all relative overflow-hidden backdrop-blur-3xl shadow-2xl"
                    >
                        {/* Pulse effect */}
                        <div className="absolute inset-0 bg-[#00E5FF]/5 animate-pulse group-hover:bg-[#00E5FF]/10" />

                        <div className="relative">
                            <div className="w-20 h-20 rounded-full bg-[#00E5FF] flex items-center justify-center shadow-[0_0_40px_rgba(0,229,255,0.4)] transition-transform duration-500 group-hover:scale-110">
                                <Plus size={36} strokeWidth={3} className="text-black" />
                            </div>
                            <div className="absolute -inset-4 bg-[#00E5FF]/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>

                        <div className="text-center relative z-10 space-y-2">
                            <span className="text-sm font-black uppercase tracking-[0.5em] block text-[#00E5FF]">Register Protocol</span>
                            <span className="text-[9px] font-bold opacity-40 uppercase tracking-widest block text-[var(--secondary)]">Add Medication to Vault</span>
                        </div>
                    </motion.button>
                </div>
            </div>

            {/* Footer Insights */}
            <div className="px-8 py-6 bg-white/5 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Database size={16} className="text-[var(--secondary)]" />
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--secondary)]">Vault synchronized via Ledger Hub</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span className="text-[9px] font-black uppercase text-[var(--secondary)]">Stable</span>
                </div>
            </div>
        </GlassCard>
    );
}

