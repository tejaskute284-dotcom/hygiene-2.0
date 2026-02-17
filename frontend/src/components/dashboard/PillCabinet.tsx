"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { motion } from "framer-motion";
import { Pill, Plus, Trash2 } from "lucide-react";

interface PillCabinetProps {
    medications: any[];
    onAdd?: () => void;
    onDelete?: (id: string) => void;
}

export function PillCabinet({ medications = [], onAdd, onDelete }: PillCabinetProps) {
    return (
        <GlassCard className="h-full">
            <div className="flex items-center justify-between mb-8 border-b border-[var(--color-glass-border)] pb-4">
                <div>
                    <h3 className="text-xl font-black uppercase tracking-tight">Medication Cabinet</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[var(--secondary)]">Inventory management</p>
                </div>
                <button className="bg-red-500/10 text-red-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">Stock Alerts</button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {medications.map((med, index) => (
                    <motion.div
                        key={med.id}
                        className="group relative aspect-[3/4] rounded-2xl bg-[var(--muted)]/50 border border-[var(--color-glass-border)] p-3 flex flex-col items-center justify-end hover:shadow-2xl transition-all cursor-pointer overflow-hidden"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ y: -10, transition: { type: "spring", stiffness: 400, damping: 10 } }}
                        transition={{ delay: index * 0.05 }}
                    >
                        {/* 3D Shelf Shadow */}
                        <div className="absolute inset-x-0 bottom-0 h-4 bg-black/5 blur-[4px]" />

                        {/* Bottle/Pill Visual */}
                        <div className="flex-1 w-full flex items-center justify-center relative z-10">
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: (index * 0.05) + 0.1 }}
                                className={`w-14 h-20 rounded-xl bg-primary/20 shadow-lg border border-white/40 flex items-center justify-center relative group-hover:rotate-6 transition-transform`}
                            >
                                <div className="absolute top-0 w-10 h-3 bg-white/50 rounded-b-md" />
                                <Pill className="text-[var(--primary)] w-8 h-8 rotate-45 opacity-50" />
                                <div className="absolute bottom-2 left-2 right-2 h-6 bg-white/90 text-[8px] flex flex-col items-center justify-center font-bold text-black border-y border-black/10">
                                    <span className="leading-none">RX-{med.id?.slice(0, 4)}</span>
                                    <span className="leading-none scale-75 uppercase">Secure</span>
                                </div>
                            </motion.div>
                        </div>

                        {/* Info Overlay */}
                        <div className="w-full mt-3 text-center z-10">
                            <p className="font-bold text-sm tracking-tight truncate">{med.name}</p>
                            <p className="text-[10px] text-[var(--secondary)] font-bold uppercase leading-none">
                                {med.dosage?.amount} {med.dosage?.unit}
                            </p>
                            <p className="text-[10px] text-[var(--primary)] font-black uppercase mt-1">
                                Left: {med.inventory?.currentQuantity || 0}
                            </p>
                        </div>

                        {/* Low Stock Warning */}
                        {med.inventory?.currentQuantity < med.inventory?.refillThreshold && (
                            <div className="absolute top-3 right-3 flex items-center gap-1">
                                <span className="text-[10px] font-black text-red-500 mr-1">LOW</span>
                                <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping absolute opacity-75" />
                                <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                            </div>
                        )}

                        {/* Status Indicator */}
                        <div className={`absolute top-3 left-3 w-2 h-2 rounded-full ${med.isActive ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500'}`} />

                        {/* Delete Button */}
                        {onDelete && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(med.id);
                                }}
                                className="absolute top-2 left-8 p-1.5 opacity-0 group-hover:opacity-100 bg-red-500 text-white rounded-lg transition-all hover:bg-red-600 z-20"
                            >
                                <Trash2 size={12} />
                            </button>
                        )}
                    </motion.div>
                ))}

                <motion.div
                    onClick={onAdd}
                    className="aspect-[3/4] rounded-2xl border-4 border-dashed border-[var(--color-glass-border)] flex flex-col items-center justify-center text-[var(--secondary)] hover:bg-[var(--muted)]/50 cursor-pointer transition-all"
                    whileHover={{ scale: 1.05 }}
                >
                    <Plus size={32} className="font-black" />
                    <span className="text-[10px] font-black uppercase mt-1">Add Medicine</span>
                </motion.div>
            </div>
        </GlassCard>
    );
}

