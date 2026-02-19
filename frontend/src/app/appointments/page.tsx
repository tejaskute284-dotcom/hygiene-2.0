"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { Calendar, Clock, MapPin, Loader2, Plus, Trash2, X, ChevronRight, Stethoscope, Video, User, CheckCircle2 } from "lucide-react";
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
        type: 'General Checkup',
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
                specialty: "General Medicine",
                phone: "555-0000",
                address: { street: "123 Medical Plaza", city: "Healthy Springs", state: "CA", zip: "90210" }
            },
            scheduledAt,
            duration: 30,
            notes: formData.notes
        };

        try {
            const saved = await appointmentsApi.create(newApt);
            setAppointments([...appointments, saved]);
            setIsAdding(false);
            setFormData({ providerName: '', type: 'General Checkup', date: '', time: '', notes: '' });
        } catch (error) {
            console.error("Failed to add appointment:", error);
            alert("Backend failed to add appointment: " + (error as Error).message);
        }
    };

    const handleDeleteAppointment = async (id: string) => {
        if (!confirm("Are you sure you want to cancel this appointment?")) return;
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
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div>
                        <h1 className="text-section mb-3">Clinical Schedule</h1>
                        <p className="text-subhead max-w-lg">
                            Track your upcoming consultations and manage your clinical wellness journey.
                        </p>
                    </div>
                    <Button
                        onClick={() => setIsAdding(true)}
                        className="group shadow-primary/20 gap-3 transition-all active:scale-95"
                    >
                        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
                        <span className="font-black uppercase tracking-widest text-xs">Acknowledge New Visit</span>
                    </Button>
                </div>

                {/* Appointment Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {appointments.map((apt, index) => (
                        <motion.div
                            key={apt.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <GlassCard variant="clay" className="relative overflow-hidden group !p-8 transition-all duration-500">
                                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity text-primary">
                                    <Stethoscope size={80} className="rotate-12" />
                                </div>

                                <div className="flex justify-between items-start mb-8 relative z-10">
                                    <div className="w-14 h-14 rounded-2xl bg-white shadow-clay flex items-center justify-center text-primary transition-all duration-500">
                                        {apt.type.toLowerCase().includes('video') ? <Video size={24} /> : <Calendar size={24} />}
                                    </div>
                                    <div className="flex gap-2 items-center">
                                        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-clay ${apt.status === 'scheduled' ? 'bg-sky-50 text-primary border border-white/50' : 'bg-slate-50 text-slate-500 border border-white/50'}`}>
                                            {apt.status}
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteAppointment(apt.id);
                                            }}
                                            className="p-2.5 bg-white shadow-clay text-slate-400 hover:text-amber-500 rounded-xl transition-all duration-300"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-6 relative z-10">
                                    <div>
                                        <h3 className="text-xl font-black tracking-tight text-slate-900 mb-1 group-hover:text-primary transition-colors">{apt.provider?.name || "Unassigned Provider"}</h3>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">{apt.type}</span>
                                            <span className="w-1 h-1 rounded-full bg-slate-300" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{apt.provider?.specialty || "Specialist"}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-3 pt-4 border-t border-slate-100/50">
                                        <div className="flex items-center gap-4 text-sm font-bold text-slate-600">
                                            <div className="p-2 bg-sky-50 rounded-lg shadow-inner">
                                                <Clock size={16} className="text-primary" />
                                            </div>
                                            <span>{new Date(apt.scheduledAt).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })} • {new Date(apt.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm font-bold text-slate-600">
                                            <div className="p-2 bg-emerald-50 rounded-lg shadow-inner">
                                                <MapPin size={16} className="text-emerald-500" />
                                            </div>
                                            <span className="truncate">{apt.provider?.address?.city}, {apt.provider?.address?.state}</span>
                                        </div>
                                    </div>

                                    <Button variant="ghost" className="w-full mt-4 flex items-center justify-between group/btn py-4 bg-sky-50 shadow-clay hover:bg-white text-xs font-black uppercase tracking-widest text-slate-500 hover:text-primary transition-all">
                                        View Clinical Notes
                                        <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                    </Button>
                                </div>
                            </GlassCard>
                        </motion.div>
                    ))}

                    <motion.button
                        whileHover={{ scale: 1.02, y: -5 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsAdding(true)}
                        className="border-2 border-dashed border-slate-200 rounded-[2.5rem] p-12 flex flex-col items-center justify-center min-h-[360px] gap-6 group hover:border-primary/40 hover:bg-primary/5 transition-all duration-500 shadow-sm hover:shadow-clay"
                    >
                        <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-white group-hover:shadow-clay transition-all duration-500">
                            <Plus size={40} className="text-slate-300 group-hover:text-primary group-hover:rotate-90 transition-all duration-500" />
                        </div>
                        <div className="text-center">
                            <h4 className="font-black uppercase tracking-[0.2em] text-sm text-slate-400 group-hover:text-primary transition-colors">Initialize New Consult</h4>
                            <p className="text-[10px] font-bold text-slate-400/80 mt-2 max-w-[200px]">Secure clinical scheduling powered by Neural Link.</p>
                        </div>
                    </motion.button>
                </div>
            </div>

            {/* Add Appointment Modal */}
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
                                <div className="absolute top-[-50px] left-[-50px] w-40 h-40 bg-primary/5 rounded-full blur-3xl" />
                                <div className="flex justify-between items-center mb-10 relative z-10">
                                    <div>
                                        <h2 className="text-2xl font-black uppercase tracking-tighter text-slate-900">Neural Sync</h2>
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Initialize Appointment Protocol</p>
                                    </div>
                                    <button
                                        onClick={() => setIsAdding(false)}
                                        className="p-3 bg-white border border-slate-100 rounded-full shadow-clay text-slate-400 hover:text-amber-500 transition-all"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                <form onSubmit={handleAddAppointment} className="space-y-6 relative z-10">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] ml-2 text-slate-400 flex items-center gap-2">
                                            <User size={12} className="text-primary" /> Specialist / Provider
                                        </label>
                                        <input
                                            required
                                            className="w-full bg-sky-50/50 border-none rounded-2xl py-5 px-8 font-bold text-slate-900 outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-slate-300 shadow-clay"
                                            placeholder="e.g. Dr. Tejas Kute"
                                            value={formData.providerName}
                                            onChange={(e) => setFormData({ ...formData, providerName: e.target.value })}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2 text-left">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] ml-2 text-slate-400 flex items-center gap-2">
                                                <Calendar size={12} className="text-primary" /> Target Date
                                            </label>
                                            <input
                                                required
                                                type="date"
                                                className="w-full bg-sky-50/50 border-none rounded-2xl py-5 px-8 font-bold text-slate-900 outline-none focus:ring-4 focus:ring-primary/10 transition-all shadow-clay"
                                                value={formData.date}
                                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2 text-left">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] ml-2 text-slate-400 flex items-center gap-2">
                                                <Clock size={12} className="text-primary" /> Target Time
                                            </label>
                                            <input
                                                required
                                                type="time"
                                                className="w-full bg-sky-50/50 border-none rounded-2xl py-5 px-8 font-bold text-slate-900 outline-none focus:ring-4 focus:ring-primary/10 transition-all shadow-clay"
                                                value={formData.time}
                                                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] ml-2 text-slate-400 flex items-center gap-2">
                                            <Stethoscope size={12} className="text-primary" /> Nature of Consult
                                        </label>
                                        <input
                                            className="w-full bg-sky-50/50 border-none rounded-2xl py-5 px-8 font-bold text-slate-900 outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-slate-300 shadow-clay"
                                            placeholder="e.g. Heart Rate Review"
                                            value={formData.type}
                                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        />
                                    </div>

                                    <div className="flex gap-4 pt-8">
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            className="flex-1 py-5 rounded-2xl font-black uppercase tracking-widest text-xs"
                                            onClick={() => setIsAdding(false)}
                                        >
                                            ABORT
                                        </Button>
                                        <Button
                                            type="submit"
                                            className="flex-1 py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
                                        >
                                            <CheckCircle2 size={16} /> SYNC APPOINTMENT
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

