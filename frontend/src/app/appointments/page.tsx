"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { Calendar, Clock, MapPin, Loader2, Plus, Trash2, Video, Users, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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

    useEffect(() => {
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
        }
    };

    const handleDeleteAppointment = async (id: string) => {
        if (!confirm("Are you sure you want to delete this appointment?")) return;
        try {
            await appointmentsApi.delete(id);
            setAppointments(appointments.filter(a => a.id !== id));
        } catch (error) {
            console.error("Failed to delete appointment:", error);
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
            <div className="max-w-7xl mx-auto space-y-12 pb-20 px-4 sm:px-8">
                {/* Hero section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-[var(--accent)] text-white rounded-xl shadow-lg ring-4 ring-[var(--accent)]/10">
                                <Calendar size={20} />
                            </div>
                            <span className="text-xs font-black uppercase tracking-[0.3em] text-[var(--accent)]">Scheduling HUB</span>
                        </div>
                        <h1 className="text-5xl font-black tracking-tighter uppercase leading-none">Medical Consults</h1>
                        <p className="text-[var(--secondary)] font-medium max-w-xl text-lg">
                            Manage your clinical visits, tele-health consultations, and professional health meetings in one unified interface.
                        </p>
                    </div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                            onClick={() => setIsAdding(true)}
                            className="flex items-center gap-3 py-7 px-10 rounded-[2rem] shadow-2xl shadow-[var(--primary)]/30 text-sm font-black uppercase tracking-widest bg-gradient-to-r from-[var(--primary)] to-[var(--accent)]"
                        >
                            <Plus size={24} strokeWidth={3} />
                            Schedule New Visit
                        </Button>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence mode="popLayout">
                        {appointments.map((apt, index) => (
                            <motion.div
                                key={apt.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <GlassCard className="group relative overflow-hidden h-full border-none shadow-[0_20px_40px_rgba(0,0,0,0.05)] hover:shadow-[0_40px_80px_rgba(0,0,0,0.08)] transition-all duration-500">
                                    <div className="absolute top-0 right-0 p-6 flex flex-col items-end gap-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteAppointment(apt.id);
                                            }}
                                            className="p-2 opacity-0 group-hover:opacity-100 bg-red-500 text-white rounded-xl transition-all shadow-xl shadow-red-500/20 hover:scale-110"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                        <div className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest shadow-sm ${apt.status === 'scheduled' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                                            {apt.status}
                                        </div>
                                    </div>

                                    <div className="flex flex-col h-full">
                                        <div className="mb-8">
                                            <div className="w-16 h-16 rounded-3xl bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] mb-6 group-hover:scale-110 transition-transform duration-500">
                                                {apt.type.toLowerCase().includes('checkup') ? <Users size={32} /> :
                                                    apt.type.toLowerCase().includes('tele') ? <Video size={32} /> : <Calendar size={32} />}
                                            </div>
                                            <h3 className="text-2xl font-black tracking-tight mb-1 group-hover:text-[var(--primary)] transition-colors uppercase truncate">{apt.provider?.name || "Dr. Medical Professional"}</h3>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--secondary)] opacity-60">{apt.type}</p>
                                        </div>

                                        <div className="space-y-4 mt-auto">
                                            <div className="flex items-center gap-4 p-4 bg-[var(--muted)]/50 rounded-2xl border border-white/40">
                                                <div className="p-2 bg-white rounded-xl shadow-sm"><Clock size={16} className="text-[var(--primary)]" /></div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-black">{new Date(apt.scheduledAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                                    <span className="text-[10px] font-bold text-[var(--secondary)]">{new Date(apt.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 p-4 bg-[var(--muted)]/50 rounded-2xl border border-white/40">
                                                <div className="p-2 bg-white rounded-xl shadow-sm"><MapPin size={16} className="text-[var(--primary)]" /></div>
                                                <span className="text-xs font-black truncate">{apt.provider?.address?.city || 'Virtual Hub'}, {apt.provider?.address?.state || 'Global'}</span>
                                            </div>
                                        </div>

                                        <button className="w-full mt-8 py-4 bg-[var(--primary)] text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl opacity-0 group-hover:opacity-100 transition-all shadow-xl shadow-[var(--primary)]/20 hover:scale-[1.02] transform">
                                            Prepare for Visit
                                        </button>
                                    </div>
                                </GlassCard>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsAdding(true)}
                        className="border-[3px] border-dashed border-[var(--color-glass-border)] rounded-[2.5rem] p-10 flex flex-col items-center justify-center min-h-[350px] gap-6 hover:bg-white hover:border-[var(--primary)] transition-all group relative overflow-hidden shadow-sm"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="w-20 h-20 rounded-full bg-[var(--muted)] flex items-center justify-center group-hover:bg-[var(--primary)]/10 transition-colors duration-500">
                            <Plus size={40} className="text-[var(--secondary)] group-hover:text-[var(--primary)] group-hover:rotate-90 transition-all duration-500" strokeWidth={3} />
                        </div>
                        <div className="text-center relative z-10">
                            <p className="text-sm font-black uppercase tracking-widest text-[var(--secondary)] group-hover:text-[var(--primary)]">Schedule Consult</p>
                            <p className="text-[10px] font-medium text-[var(--secondary)] opacity-50 mt-1 uppercase tracking-tighter">Add to medical registry</p>
                        </div>
                    </motion.button>
                </div>
            </div>

            {/* Add Appointment Modal */}
            <AnimatePresence>
                {isAdding && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            className="w-full max-w-xl"
                        >
                            <GlassCard className="!p-10 shadow-3xl border-white/50 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8">
                                    <button
                                        onClick={() => setIsAdding(false)}
                                        className="p-3 bg-[var(--muted)] hover:bg-red-500 hover:text-white rounded-2xl transition-all"
                                    >
                                        <Plus size={20} className="rotate-45" />
                                    </button>
                                </div>

                                <div className="mb-10 text-center">
                                    <h2 className="text-4xl font-black tracking-tighter uppercase mb-2">Schedule Registry</h2>
                                    <p className="text-xs font-black uppercase tracking-widest text-[var(--secondary)]">Securing professional consult</p>
                                </div>

                                <form onSubmit={handleAddAppointment} className="space-y-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-[var(--secondary)]">Attending Professional</label>
                                        <div className="relative">
                                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--primary)]"><Users size={20} /></div>
                                            <input
                                                required
                                                className="w-full bg-[var(--muted)]/50 border-2 border-transparent focus:border-[var(--primary)] rounded-2xl py-5 pl-16 pr-6 font-black outline-none transition-all text-lg shadow-inner placeholder:text-[var(--secondary)]/30"
                                                placeholder="e.g. DR. ANDERSON"
                                                value={formData.providerName}
                                                onChange={(e) => setFormData({ ...formData, providerName: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-[var(--secondary)]">Service Date</label>
                                            <input
                                                required
                                                type="date"
                                                className="w-full bg-[var(--muted)]/50 border-2 border-transparent focus:border-[var(--primary)] rounded-2xl py-5 px-6 font-black outline-none transition-all shadow-inner"
                                                value={formData.date}
                                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-[var(--secondary)]">Service Time</label>
                                            <input
                                                required
                                                type="time"
                                                className="w-full bg-[var(--muted)]/50 border-2 border-transparent focus:border-[var(--primary)] rounded-2xl py-5 px-6 font-black outline-none transition-all shadow-inner"
                                                value={formData.time}
                                                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-[var(--secondary)]">Consult Type / Reason</label>
                                        <input
                                            required
                                            className="w-full bg-[var(--muted)]/50 border-2 border-transparent focus:border-[var(--primary)] rounded-2xl py-5 px-6 font-black outline-none transition-all shadow-inner placeholder:text-[var(--secondary)]/30"
                                            placeholder="e.g. ANNUAL HEALTH AUDIT"
                                            value={formData.type}
                                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        />
                                    </div>

                                    <div className="flex gap-4 mt-10">
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            className="flex-1 py-5 rounded-2xl font-black uppercase tracking-widest border-none text-[var(--secondary)] hover:bg-black/5"
                                            onClick={() => setIsAdding(false)}
                                        >
                                            CANCEL
                                        </Button>
                                        <Button
                                            type="submit"
                                            className="flex-1 py-5 rounded-2xl font-black uppercase tracking-widest shadow-2xl shadow-[var(--primary)]/30 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white"
                                        >
                                            CONFIRM SCHEDULE
                                        </Button>
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

