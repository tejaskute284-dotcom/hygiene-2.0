"use client";

import { useState, useEffect } from "react";
import { medicationsApi } from "@/lib/api";
import { Loader2, Plus, Pill, Activity, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { PillCabinet } from "@/components/dashboard/PillCabinet";
import { MedicationSwiper } from "@/components/dashboard/MedicationSwiper";
import { motion, AnimatePresence } from "framer-motion";

export default function MedicationsPage() {
    const [medications, setMedications] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        amount: '1',
        unit: 'pill',
        form: 'tablet',
        frequency: 'daily',
        time: '09:00'
    });

    const fetchMedications = async () => {
        try {
            const data = await medicationsApi.getAll(true) as any[];
            setMedications(data);
        } catch (error) {
            console.error("Failed to fetch medications:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMedications();
    }, []);

    const handleAddMedication = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        const newMed = {
            name: formData.name,
            dosage: {
                amount: parseInt(formData.amount),
                unit: formData.unit,
                form: formData.form
            },
            schedule: {
                frequency: formData.frequency,
                times: [formData.time],
                startDate: new Date().toISOString()
            },
            inventory: {
                currentQuantity: 30,
                refillThreshold: 5,
                autoRefill: false
            }
        };

        try {
            await medicationsApi.create(newMed);
            fetchMedications();
            setIsAdding(false);
            setFormData({ name: '', amount: '1', unit: 'pill', form: 'tablet', frequency: 'daily', time: '09:00' });
        } catch (error) {
            console.error("Failed to add medication:", error);
        }
    };

    const handleDeleteMedication = async (id: string) => {
        if (!confirm("Are you sure you want to delete this medication?")) return;
        try {
            await medicationsApi.delete(id);
            fetchMedications();
        } catch (error) {
            console.error("Failed to delete medication:", error);
        }
    };

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-[60vh]">
                    <Loader2 className="w-12 h-12 animate-spin text-primary" />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-6 duration-1000">

                {/* Header Section */}
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                    <div>
                        <h1 className="text-section mb-3">Medication Cabinet</h1>
                        <p className="text-subhead max-w-lg">
                            Manage your daily prescriptions and health protocols with high-fidelity tracking.
                        </p>
                    </div>
                    <Button onClick={() => setIsAdding(true)} variant="primary" className="gap-3 shadow-primary/20">
                        <Plus size={20} /> <span className="font-black uppercase tracking-widest text-xs">Register Protocol</span>
                    </Button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-4">
                        <MedicationSwiper medications={medications} onUpdate={fetchMedications} />
                    </div>
                    <div className="lg:col-span-8">
                        <PillCabinet medications={medications} onAdd={() => setIsAdding(true)} onDelete={handleDeleteMedication} />
                    </div>
                </div>

                <GlassCard variant="clay" className="!p-10 group transition-all duration-500">
                    <div className="flex items-center gap-5 mb-10">
                        <div className="p-4 rounded-2xl bg-white shadow-clay text-primary transition-all duration-500">
                            <Activity className="w-8 h-8" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-900 tracking-tight">Adherence Logs</h2>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Historical dose compliance</p>
                        </div>
                    </div>

                    <div className="h-64 border-2 border-dashed border-slate-100 rounded-[2.5rem] flex flex-col items-center justify-center gap-6 bg-slate-50/50 group-hover:bg-white transition-colors duration-500">
                        <div className="p-6 bg-white rounded-full shadow-clay text-primary/30">
                            <Pill className="w-12 h-12" />
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-black text-slate-900 uppercase tracking-widest">Awaiting Data Points</p>
                            <p className="text-[10px] font-bold text-slate-400 mt-2 max-w-[240px]">Detailed logs will initialize as you acknowledge dose protocols.</p>
                        </div>
                    </div>
                </GlassCard>
            </div>

            {/* Modal Overlay */}
            <AnimatePresence>
                {isAdding && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-[12px]">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                            className="w-full max-w-xl"
                        >
                            <GlassCard variant="clay" className="!p-10 shadow-2xl relative overflow-visible">
                                <button
                                    onClick={() => setIsAdding(false)}
                                    className="absolute -top-4 -right-4 p-3 bg-white border border-slate-100 rounded-full shadow-clay hover:bg-sky-50 hover:text-primary transition-all z-20"
                                >
                                    <X className="w-5 h-5" />
                                </button>

                                <div className="text-center mb-10">
                                    <h2 className="text-2xl font-black uppercase tracking-tighter text-slate-900">New Protocol</h2>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mt-1">Register Medication Entry</p>
                                </div>

                                <form onSubmit={handleAddMedication} className="space-y-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">MEDICATION NAME</label>
                                        <input
                                            required
                                            className="w-full bg-sky-50/50 border-none rounded-2xl py-5 px-8 font-bold text-slate-900 outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-slate-300 shadow-clay"
                                            placeholder="e.g. Paracetamol"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">QUANTITY</label>
                                            <input
                                                required
                                                type="number"
                                                className="w-full bg-sky-50/50 border-none rounded-2xl py-5 px-8 font-bold text-slate-900 outline-none focus:ring-4 focus:ring-primary/10 transition-all shadow-clay"
                                                value={formData.amount}
                                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">SYNC TIME</label>
                                            <input
                                                required
                                                type="time"
                                                className="w-full bg-sky-50/50 border-none rounded-2xl py-5 px-8 font-bold text-slate-900 outline-none focus:ring-4 focus:ring-primary/10 transition-all shadow-clay"
                                                value={formData.time}
                                                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">UNIT TYPE</label>
                                            <select
                                                className="w-full bg-slate-50 border-none rounded-2xl py-5 px-8 font-bold text-slate-900 outline-none focus:ring-4 focus:ring-primary/10 transition-all appearance-none"
                                                value={formData.unit}
                                                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                            >
                                                <option value="pill">Pill</option>
                                                <option value="mg">mg</option>
                                                <option value="ml">ml</option>
                                                <option value="tabs">Tabs</option>
                                            </select>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">FREQUENCY</label>
                                            <select
                                                className="w-full bg-slate-50 border-none rounded-2xl py-5 px-8 font-bold text-slate-900 outline-none focus:ring-4 focus:ring-primary/10 transition-all appearance-none"
                                                value={formData.frequency}
                                                onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                                            >
                                                <option value="daily">Daily</option>
                                                <option value="weekly">Weekly</option>
                                                <option value="as_needed">As Needed</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 pt-6">
                                        <Button type="button" variant="secondary" className="flex-1 py-5 rounded-2xl font-black uppercase tracking-widest text-xs" onClick={() => setIsAdding(false)}>CANCEL</Button>
                                        <Button type="submit" variant="primary" className="flex-1 py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20">SYNC PROTOCOL</Button>
                                    </div>
                                </form>
                            </GlassCard>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </DashboardLayout>
    );
}

