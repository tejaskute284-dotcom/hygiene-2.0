"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { Calendar, Clock, MapPin, Loader2, Plus, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { appointmentsApi } from "@/lib/api";
import { Button } from "@/components/ui/Button";

export default function AppointmentsPage() {
    const [appointments, setAppointments] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        providerName: '',
        type: 'Checkup',
        date: '',
        time: '',
        notes: ''
    });

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const data = await appointmentsApi.getAll() as any[];
                setAppointments(data);
            } catch (error) {
                console.error("Failed to fetch appointments:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAppointments();
    }, []);

    const handleAddAppointment = async (e: React.FormEvent) => {
        e.preventDefault();

        const scheduledAt = new Date(`${formData.date}T${formData.time}`).toISOString();

        const newApt = {
            type: formData.type,
            provider: {
                name: formData.providerName,
                specialty: "General",
                phone: "555-0000",
                address: { street: "Clinic Address", city: "City", state: "ST", zip: "00000" }
            },
            scheduledAt,
            duration: 30,
            notes: formData.notes
        };

        try {
            const saved = await appointmentsApi.create(newApt);
            setAppointments([...appointments, saved]);
            setIsAdding(false);
            setFormData({ providerName: '', type: 'Checkup', date: '', time: '', notes: '' });
        } catch (error) {
            console.error("Failed to add appointment:", error);
            alert("Backend failed to add appointment: " + (error as Error).message);
        }
    };

    const handleDeleteAppointment = async (id: string) => {
        if (!confirm("Are you sure you want to delete this appointment?")) return;
        try {
            await appointmentsApi.delete(id);
            setAppointments(appointments.filter(a => a.id !== id));
        } catch (error) {
            console.error("Failed to delete appointment:", error);
            alert("Failed to delete appointment: " + (error as Error).message);
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
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-black tracking-tight mb-2">Appointments</h1>
                        <p className="text-[var(--secondary)] font-medium">Manage your clinical visits and consultations.</p>
                    </div>
                    <Button onClick={() => setIsAdding(true)} className="flex items-center gap-2 py-6 px-8 rounded-2xl shadow-xl shadow-[var(--primary)]/20">
                        <Plus size={20} />
                        SCHEDULE NEW
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {appointments.map(apt => (
                        <GlassCard key={apt.id} className="group hover:border-[var(--primary)] transition-all duration-300">
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-3 bg-[var(--primary)]/10 text-[var(--primary)] rounded-2xl">
                                    <Calendar size={24} />
                                </div>
                                <div className="flex gap-2 items-center">
                                    <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${apt.status === 'scheduled' ? 'bg-green-500/10 text-green-500' : 'bg-gray-500/10 text-gray-500'}`}>
                                        {apt.status}
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteAppointment(apt.id);
                                        }}
                                        className="p-2 hover:bg-red-500/10 text-[var(--secondary)] hover:text-red-500 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-xl font-black tracking-tight group-hover:text-[var(--primary)] transition-colors">{apt.provider?.name || "Dr. Unknown"}</h3>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-[var(--secondary)]">{apt.type}</p>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-3 text-sm font-bold text-[var(--secondary)]">
                                        <Clock size={16} className="text-[var(--primary)]" />
                                        <span>{new Date(apt.scheduledAt).toLocaleDateString()} • {new Date(apt.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm font-bold text-[var(--secondary)]">
                                        <MapPin size={16} className="text-[var(--primary)]" />
                                        <span className="truncate">{apt.provider?.address?.city}, {apt.provider?.address?.state}</span>
                                    </div>
                                </div>
                            </div>
                        </GlassCard>
                    ))}

                    <button
                        onClick={() => setIsAdding(true)}
                        className="border-2 border-dashed border-[var(--color-glass-border)] rounded-3xl p-8 flex flex-col items-center justify-center min-h-[200px] gap-4 hover:bg-[var(--muted)]/30 hover:border-[var(--primary)] transition-all group"
                    >
                        <div className="w-16 h-16 rounded-full bg-[var(--muted)]/50 flex items-center justify-center group-hover:bg-[var(--primary)]/10 transition-colors">
                            <Plus size={32} className="text-[var(--secondary)] group-hover:text-[var(--primary)]" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-tighter text-[var(--secondary)]">Add New Consult</span>
                    </button>
                </div>
            </div>

            {/* Add Appointment Modal */}
            {isAdding && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full max-w-lg"
                    >
                        <GlassCard className="!p-8 shadow-2xl">
                            <h2 className="text-2xl font-black mb-6 uppercase">Schedule Appointment</h2>
                            <form onSubmit={handleAddAppointment} className="space-y-4">
                                <div className="space-y-1 text-left">
                                    <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-[var(--secondary)]">Doctor Name</label>
                                    <input
                                        required
                                        className="w-full bg-[var(--muted)]/50 border-none rounded-xl py-4 px-5 font-bold outline-none focus:ring-2 focus:ring-[var(--primary)]"
                                        placeholder="e.g. Dr. Tejas"
                                        value={formData.providerName}
                                        onChange={(e) => setFormData({ ...formData, providerName: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1 text-left">
                                        <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-[var(--secondary)]">Date</label>
                                        <input
                                            required
                                            type="date"
                                            className="w-full bg-[var(--muted)]/50 border-none rounded-xl py-4 px-5 font-bold outline-none focus:ring-2 focus:ring-[var(--primary)]"
                                            value={formData.date}
                                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-1 text-left">
                                        <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-[var(--secondary)]">Time</label>
                                        <input
                                            required
                                            type="time"
                                            className="w-full bg-[var(--muted)]/50 border-none rounded-xl py-4 px-5 font-bold outline-none focus:ring-2 focus:ring-[var(--primary)]"
                                            value={formData.time}
                                            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1 text-left">
                                    <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-[var(--secondary)]">Reason / Type</label>
                                    <input
                                        className="w-full bg-[var(--muted)]/50 border-none rounded-xl py-4 px-5 font-bold outline-none focus:ring-2 focus:ring-[var(--primary)]"
                                        placeholder="e.g. Heart Checkup"
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    />
                                </div>
                                <div className="flex gap-4 pt-4">
                                    <Button type="button" variant="secondary" className="flex-1 py-4 rounded-xl font-black" onClick={() => setIsAdding(false)}>CANCEL</Button>
                                    <Button type="submit" className="flex-1 py-4 rounded-xl font-black shadow-lg shadow-[var(--primary)]/20">SAVE APPOINTMENT</Button>
                                </div>
                            </form>
                        </GlassCard>
                    </motion.div>
                </div>
            )}
        </DashboardLayout>
    );
}

