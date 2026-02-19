"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { PillCabinet } from "@/components/dashboard/PillCabinet";
import { MedicationSwiper } from "@/components/dashboard/MedicationSwiper";
import { useState, useEffect } from "react";
import { medicationsApi } from "@/lib/api";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";

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
            alert("Backend failed to add medication: " + (error as Error).message);
        }
    };

    const handleDeleteMedication = async (id: string) => {
        if (!confirm("Are you sure you want to delete this medication?")) return;
        try {
            await medicationsApi.delete(id);
            fetchMedications();
        } catch (error) {
            console.error("Failed to delete medication:", error);
            alert("Failed to delete medication: " + (error as Error).message);
        }
    };

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-screen -mt-24">
                    <Loader2 className="w-12 h-12 animate-spin text-[var(--primary)]" />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto space-y-8 pb-20">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-black tracking-tight mb-2">Medications</h1>
                        <p className="text-[var(--secondary)] font-medium">Track and manage your daily prescriptions and supplements.</p>
                    </div>
                    <Button onClick={() => setIsAdding(true)} className="flex items-center gap-2 py-6 px-8 rounded-2xl shadow-xl shadow-[var(--primary)]/20">
                        <Plus size={20} />
                        ADD MEDICATION
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                        <MedicationSwiper medications={medications} onUpdate={fetchMedications} />
                    </div>
                    <div className="lg:col-span-2">
                        <PillCabinet medications={medications} onAdd={() => setIsAdding(true)} onDelete={handleDeleteMedication} />
                    </div>
                </div>

                <GlassCard>
                    <h2 className="text-xl font-black mb-6 uppercase">Medication History</h2>
                    <div className="space-y-4 text-[var(--secondary)]">
                        <div className="h-48 border-2 border-dashed border-[var(--color-glass-border)] rounded-3xl flex flex-col items-center justify-center gap-4 bg-[var(--muted)]/20">
                            <div className="p-4 bg-[var(--muted)]/50 rounded-full">
                                <Activity size={32} className="opacity-50" />
                            </div>
                            <p className="font-bold text-sm">Detailed logs of your adherence will appear here.</p>
                        </div>
                    </div>
                </GlassCard>
            </div>

            {/* Add Medication Modal */}
            {isAdding && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full max-w-lg"
                    >
                        <GlassCard className="!p-8 shadow-2xl">
                            <h2 className="text-2xl font-black mb-6 uppercase text-center">New Medication</h2>
                            <form onSubmit={handleAddMedication} className="space-y-6">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-[var(--secondary)]">Medication Name</label>
                                    <input
                                        required
                                        className="w-full bg-[var(--muted)]/50 border-none rounded-xl py-4 px-5 font-bold outline-none focus:ring-2 focus:ring-[var(--primary)] text-lg"
                                        placeholder="e.g. Paracetamol"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-[var(--secondary)]">Dosage Amount</label>
                                        <input
                                            required
                                            type="number"
                                            className="w-full bg-[var(--muted)]/50 border-none rounded-xl py-4 px-5 font-bold outline-none focus:ring-2 focus:ring-[var(--primary)]"
                                            value={formData.amount}
                                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-[var(--secondary)]">Time (AM/PM)</label>
                                        <input
                                            required
                                            type="time"
                                            className="w-full bg-[var(--muted)]/50 border-none rounded-xl py-4 px-5 font-bold outline-none focus:ring-2 focus:ring-[var(--primary)]"
                                            value={formData.time}
                                            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-[var(--secondary)]">Unit</label>
                                        <select
                                            className="w-full bg-[var(--muted)]/50 border-none rounded-xl py-4 px-5 font-bold outline-none focus:ring-2 focus:ring-[var(--primary)]"
                                            value={formData.unit}
                                            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                        >
                                            <option value="pill">Pill</option>
                                            <option value="mg">mg</option>
                                            <option value="ml">ml</option>
                                            <option value="tabs">Tabs</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-[var(--secondary)]">Frequency</label>
                                        <select
                                            className="w-full bg-[var(--muted)]/50 border-none rounded-xl py-4 px-5 font-bold outline-none focus:ring-2 focus:ring-[var(--primary)]"
                                            value={formData.frequency}
                                            onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                                        >
                                            <option value="daily">Daily</option>
                                            <option value="weekly">Weekly</option>
                                            <option value="as_needed">As Needed</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <Button type="button" variant="secondary" className="flex-1 py-4 rounded-xl font-black" onClick={() => setIsAdding(false)}>CANCEL</Button>
                                    <Button type="submit" className="flex-1 py-4 rounded-xl font-black shadow-lg shadow-[var(--primary)]/20">ADD TO CABINET</Button>
                                </div>
                            </form>
                        </GlassCard>
                    </motion.div>
                </div>
            )}
        </DashboardLayout>
    );
}

import { motion } from "framer-motion";
import { Activity } from "lucide-react";

