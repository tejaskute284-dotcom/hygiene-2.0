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
        <GlassCard variant="clay" className="h-full min-h-[450px] flex flex-col relative overflow-hidden group">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-800">Pharmacy Cabinet</h3>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mt-1">Medical Inventory Management</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="bg-white px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-primary transition-all shadow-clay border border-white">
                        Stock Analysis
                    </button>
                    <div className="p-3 bg-emerald-50 text-emerald-500 rounded-2xl shadow-clay border border-white">
                        <Pill size={18} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {medications.map((med, index) => (
                    <motion.div
                        key={med.id}
                        className="group relative aspect-[4/5] rounded-[2rem] bg-white shadow-clay border-2 border-white p-4 flex flex-col items-center justify-between transition-all cursor-pointer overflow-hidden"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ y: -12, transition: { type: "spring", stiffness: 300, damping: 15 } }}
                        transition={{ delay: index * 0.05 }}
                    >
                        {/* Decorative Gradient */}
                        <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-sky-50/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                        {/* Top corner indicator */}
                        <div className="absolute top-4 left-4 flex items-center gap-1.5 px-2 py-1 bg-white/80 rounded-full border border-white shadow-clay backdrop-blur-sm z-20">
                            <div className={`w-1.5 h-1.5 rounded-full ${med.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                            <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">{med.isActive ? 'Live' : 'Off'}</span>
                        </div>

                        {/* Bottle/Pill Visual */}
                        <div className="flex-1 w-full flex items-center justify-center relative z-10 pt-4">
                            <motion.div
                                className={`w-16 h-24 rounded-[1.25rem] bg-white shadow-clay border border-sky-50 flex flex-col items-center justify-center relative group-hover:rotate-6 transition-transform duration-500`}
                            >
                                <div className="absolute top-0 w-full h-4 bg-sky-100/50 rounded-b-lg border-b border-sky-200/20" />
                                <Pill className="text-primary w-8 h-8 rotate-45 opacity-20 group-hover:opacity-40 transition-opacity" />

                                <div className="mt-2 w-10 h-1 bg-slate-100 rounded-full" />

                                <div className="absolute bottom-3 inset-x-2 h-8 bg-sky-50/50 rounded-lg flex flex-col items-center justify-center font-black text-slate-400 border border-white/50">
                                    <span className="text-[6px] uppercase tracking-tighter">PHARMA-OS</span>
                                    <span className="text-[8px] leading-tight text-primary">#{med.id?.slice(-4).toUpperCase()}</span>
                                </div>
                            </motion.div>
                        </div>

                        {/* Info Section */}
                        <div className="w-full text-center z-10 space-y-1">
                            <p className="font-black text-xs text-slate-800 tracking-tight truncate px-2">{med.name}</p>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest bg-slate-50 rounded-full py-1 mx-4">
                                {med.dosage?.amount} {med.dosage?.unit}
                            </p>
                            <div className="flex items-center justify-center gap-2 mt-2">
                                <span className={`text-[8px] font-black uppercase tracking-widest ${med.inventory?.currentQuantity < med.inventory?.refillThreshold ? 'text-amber-500' : 'text-emerald-500'}`}>
                                    Qty: {med.inventory?.currentQuantity || 0}
                                </span>
                            </div>
                        </div>

                        {/* Low Stock Warning */}
                        {med.inventory?.currentQuantity < med.inventory?.refillThreshold && (
                            <div className="absolute top-3 right-3 flex items-center gap-1">
                                <span className="text-[10px] font-black text-amber-500 mr-1">LOW</span>
                                <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping absolute opacity-75" />
                                <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                            </div>
                        )}

                        {/* Status Indicator */}
                        <div className={`absolute top-3 left-3 w-2 h-2 rounded-full ${med.isActive ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-slate-400'}`} />

                        {/* Delete Button */}
                        {onDelete && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(med.id);
                                }}
                                className="absolute top-2 left-8 p-1.5 opacity-0 group-hover:opacity-100 bg-slate-200 text-slate-700 rounded-lg transition-all hover:bg-slate-300 z-20"
                            >
                                <Trash2 size={12} />
                            </button>
                        )}
                    </motion.div>
                ))}

                <motion.div
                    onClick={onAdd}
                    className="aspect-[4/5] rounded-[2rem] border-4 border-dashed border-slate-100 flex flex-col items-center justify-center text-slate-300 hover:text-primary hover:border-primary/20 hover:bg-sky-50/30 cursor-pointer transition-all shadow-inner group"
                    whileHover={{ scale: 1.02 }}
                >
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-3 group-hover:bg-white group-hover:shadow-clay transition-all shadow-inner">
                        <Plus size={24} className="font-black" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Add Entry</span>
                </motion.div>
            </div>
        </GlassCard>
    );
}

