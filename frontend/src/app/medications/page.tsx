"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { PillCabinet } from "@/components/dashboard/PillCabinet";
import { MedicationSwiper } from "@/components/dashboard/MedicationSwiper";
import { useState, useEffect } from "react";
import { medicationsApi } from "@/lib/api";
import { Loader2, Plus, Activity, History, Info, Sparkles, ShieldCheck, Zap, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
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
                <div className="flex items-center justify-center h-screen -mt-24">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center gap-6"
                    >
                        <div className="relative">
                            <Loader2 className="w-16 h-16 animate-spin text-black opacity-10" />
                            <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-black" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Initializing Pharmacy Module...</span>
                    </motion.div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="max-w-[1600px] mx-auto space-y-16 pb-20 px-6 sm:px-12">
                {/* Hero section */}
                <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-10">
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-black text-white rounded-2xl flex items-center justify-center shadow-2xl">
                                <ShieldCheck size={20} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-black">Precision Care</span>
                                <span className="text-[8px] font-bold uppercase tracking-widest text-[#00E5FF]">System Active</span>
                            </div>
                        </div>
                        <h1 className="text-7xl font-black tracking-tighter uppercase leading-[0.8] max-w-2xl">
                            Pharmacy <br /><span className="text-[#00E5FF]">Registry</span>
                        </h1>
                        <p className="text-neutral-500 font-bold max-w-xl text-xl leading-relaxed">
                            Neural-synchronized inventory management for high-precision pharmacological adherence.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button
                            variant="primary"
                            size="lg"
                            onClick={() => setIsAdding(true)}
                            className="flex items-center gap-4 bg-[#00E5FF] text-black hover:bg-[#00D4EB] border-none"
                        >
                            <Plus size={20} strokeWidth={4} />
                            Add Spec
                        </Button>
                        <Button variant="secondary" size="lg" className="flex items-center gap-4">
                            <History size={18} />
                            Audit Logs
                        </Button>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Active Reminders Card */}
                    <div className="lg:col-span-4 xl:col-span-3">
                        <MedicationSwiper medications={medications} onUpdate={fetchMedications} />
                    </div>

                    {/* Full Cabinet Card */}
                    <div className="lg:col-span-8 xl:col-span-9">
                        <PillCabinet medications={medications} onAdd={() => setIsAdding(true)} onDelete={handleDeleteMedication} />
                    </div>
                </div>

                {/* Insight Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    <GlassCard className="md:col-span-2 relative overflow-hidden group !p-12">
                        <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-[#00E5FF]/5 to-transparent pointer-events-none" />
                        <div className="flex items-center justify-between mb-12">
                            <div>
                                <h2 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-4">
                                    <Sparkles size={28} className="text-[#00E5FF]" />
                                    Analytical Drift
                                </h2>
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400 mt-2">Historical Variance Data</p>
                            </div>
                            <Button variant="ghost" size="sm">Download Dataset</Button>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
                            {[
                                { label: 'Adherence', value: '98%', trend: '+2.1%' },
                                { label: 'Inventory', value: 'Optimal', trend: 'Stable' },
                                { label: 'Frequency', value: '3/Day', trend: 'Nominal' },
                                { label: 'Risk Level', value: 'Low', trend: '-15%' },
                            ].map((stat, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="text-[8px] font-black uppercase tracking-widest text-neutral-400">{stat.label}</div>
                                    <div className="text-2xl font-black uppercase tracking-tighter">{stat.value}</div>
                                    <div className="text-[9px] font-bold text-[#00E5FF]">{stat.trend}</div>
                                </div>
                            ))}
                        </div>
                    </GlassCard>

                    <GlassCard className="bg-black text-white border-none shadow-3xl flex flex-col justify-between overflow-hidden relative !p-12 group">
                        <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity">
                            <Zap size={60} />
                        </div>
                        <div className="relative z-10 space-y-6">
                            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-xl">
                                <Info size={24} className="text-[#00E5FF]" />
                            </div>
                            <div>
                                <h3 className="text-3xl font-black uppercase tracking-tighter leading-none mb-4">Neural <br />Optimizer</h3>
                                <p className="text-neutral-400 font-bold leading-relaxed text-sm">
                                    Your pharmacological matrix is currently at 98.4% efficiency. Schedule synchronization is optimal.
                                </p>
                            </div>
                        </div>
                        <Button className="mt-10 bg-[#00E5FF] text-black hover:bg-white border-none text-[10px]">Optimize Schedule</Button>
                    </GlassCard>
                </div>
            </div>

            {/* Add Medication Modal */}
            <AnimatePresence>
                {isAdding && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsAdding(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-3xl"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 50 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 50 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="w-full max-w-2xl bg-white rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.5)] relative z-10 overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-8">
                                <button
                                    onClick={() => setIsAdding(false)}
                                    className="w-12 h-12 bg-neutral-100 hover:bg-black hover:text-white rounded-full flex items-center justify-center transition-all"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="p-16">
                                <div className="mb-12">
                                    <div className="flex items-center gap-2 text-[#00E5FF] mb-2">
                                        <Sparkles size={16} />
                                        <span className="text-[10px] font-black uppercase tracking-[0.4em]">Protocol Creation</span>
                                    </div>
                                    <h2 className="text-5xl font-black tracking-tighter uppercase leading-none">Register RX</h2>
                                </div>

                                <form onSubmit={handleAddMedication} className="space-y-10">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400 ml-2">Compound Identification</label>
                                        <input
                                            required
                                            autoFocus
                                            className="w-full bg-neutral-50 border-2 border-transparent focus:border-black rounded-3xl py-8 px-10 font-black outline-none transition-all text-2xl uppercase tracking-tighter placeholder:opacity-20"
                                            placeholder="E.G. NEURAL ENHANCER"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400 ml-2">Dosage Unit</label>
                                            <select
                                                className="w-full bg-neutral-50 border-2 border-transparent focus:border-black rounded-2xl py-6 px-8 font-black outline-none transition-all uppercase text-xs tracking-widest appearance-none"
                                                value={formData.unit}
                                                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                            >
                                                <option value="pill">Pill</option>
                                                <option value="mg">mg</option>
                                                <option value="ml">ml</option>
                                                <option value="tabs">Tabs</option>
                                            </select>
                                        </div>

                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400 ml-2">Quantity</label>
                                            <input
                                                required
                                                type="number"
                                                className="w-full bg-neutral-50 border-2 border-transparent focus:border-black rounded-2xl py-6 px-8 font-black outline-none transition-all text-xl"
                                                value={formData.amount}
                                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400 ml-2">Temporal Pattern</label>
                                            <select
                                                className="w-full bg-neutral-50 border-2 border-transparent focus:border-black rounded-2xl py-6 px-8 font-black outline-none transition-all uppercase text-xs tracking-widest appearance-none"
                                                value={formData.frequency}
                                                onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                                            >
                                                <option value="daily">Daily Cycle</option>
                                                <option value="weekly">Weekly Rotation</option>
                                                <option value="as_needed">On Demand</option>
                                            </select>
                                        </div>

                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400 ml-2">Start Time</label>
                                            <input
                                                required
                                                type="time"
                                                className="w-full bg-neutral-50 border-2 border-transparent focus:border-black rounded-2xl py-6 px-8 font-black outline-none transition-all text-xl"
                                                value={formData.time}
                                                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full py-10 rounded-[2rem] font-black uppercase tracking-[0.3em] bg-black text-white hover:bg-[#00E5FF] hover:text-black transition-all text-sm"
                                    >
                                        Initialize Protocol
                                    </Button>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </DashboardLayout>
    );
}

