"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { Check, Pill, Clock, Stethoscope, Plus, X, Trash2, Zap, ArrowRight, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";

interface JourneyStep {
    id: string | number;
    time: string;
    label: string;
    status: 'completed' | 'current' | 'upcoming';
    type: 'med' | 'apt' | 'check' | 'task';
    rawId?: string;
}

interface JourneyTimelineProps {
    medications?: any[];
    appointments?: any[];
    dailySchedule?: any[];
    onAddTask?: (task: any) => void;
    onDeleteTask?: (id: string) => void;
}

export function JourneyTimeline({ medications = [], appointments = [], dailySchedule = [], onAddTask, onDeleteTask }: JourneyTimelineProps) {
    const [isAdding, setIsAdding] = useState(false);
    const [newTask, setNewTask] = useState({ title: '', time: '09:00' });

    const journey = useMemo(() => {
        const steps: JourneyStep[] = [];
        const now = new Date();
        const currentHour = now.getHours();

        // Add Medications to Journey
        medications.forEach((med, idx) => {
            const times = med.schedule?.times || [];
            times.forEach((time: string, tIdx: number) => {
                let hour = parseInt(time.split(':')[0]);
                if (time.toLowerCase().includes('pm') && hour < 12) hour += 12;
                if (time.toLowerCase().includes('am') && hour === 12) hour = 0;

                const status = hour < currentHour ? 'completed' :
                    hour === currentHour ? 'current' : 'upcoming';

                steps.push({
                    id: `med-${med.id}-${tIdx}`,
                    time,
                    label: `Take ${med.name}`,
                    status,
                    type: 'med'
                });
            });
        });

        // Add Appointments to Journey
        appointments.forEach((apt) => {
            const aptDate = new Date(apt.scheduledAt);
            const isToday = aptDate.toDateString() === now.toDateString();

            if (isToday) {
                const aptHour = aptDate.getHours();
                const status = aptHour < currentHour ? 'completed' :
                    aptHour === currentHour ? 'current' : 'upcoming';

                steps.push({
                    id: `apt-${apt.id}`,
                    time: aptDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    label: `Meeting with ${apt.provider?.name || 'Doctor'}`,
                    status,
                    type: 'apt'
                });
            }
        });

        // Add Daily Schedule Items
        dailySchedule.forEach((item) => {
            const [hourStr] = item.time.split(':');
            const hour = parseInt(hourStr);
            const status = hour < currentHour ? 'completed' :
                hour === currentHour ? 'current' : 'upcoming';

            steps.push({
                id: `task-${item.id}`,
                rawId: item.id,
                time: item.time.slice(0, 5),
                label: item.title,
                status,
                type: 'task'
            });
        });

        // Simple check steps if empty
        if (steps.length === 0) {
            steps.push({
                id: 'check-1',
                time: '08:00',
                label: 'Morning Hydration',
                status: 8 < currentHour ? 'completed' : 8 === currentHour ? 'current' : 'upcoming',
                type: 'check'
            });
        }

        // Sort by time
        return steps.sort((a, b) => {
            const timeA = a.time.match(/(\d+):(\d+)/);
            const timeB = b.time.match(/(\d+):(\d+)/);
            if (!timeA || !timeB) return 0;
            const hourA = parseInt(timeA[1]) + (a.time.toLowerCase().includes('pm') ? 12 : 0);
            const hourB = parseInt(timeB[1]) + (b.time.toLowerCase().includes('pm') ? 12 : 0);
            return hourA - hourB;
        });
    }, [medications, appointments, dailySchedule]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (onAddTask) {
            onAddTask(newTask);
            setIsAdding(false);
            setNewTask({ title: '', time: '09:00' });
        }
    };

    return (
        <>
            <GlassCard className="h-full min-h-[500px] !p-0 overflow-visible">
                <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/5 backdrop-blur-3xl rounded-t-[2.5rem]">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Zap size={14} className="text-[#00E5FF]" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#00E5FF]">Neural Flow</span>
                        </div>
                        <h3 className="text-2xl font-black uppercase tracking-tighter text-[var(--foreground)]">Daily Journey</h3>
                    </div>
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={() => setIsAdding(true)}
                        className="gap-2 shadow-[0_0_20px_rgba(0,229,255,0.2)]"
                    >
                        <Plus size={16} strokeWidth={3} />
                        Add Protocol
                    </Button>
                </div>

                <div className="p-8 relative">
                    {/* Progress Line */}
                    <div className="absolute left-[3.25rem] top-8 bottom-8 w-[2px] bg-gradient-to-b from-[#00E5FF]/40 via-[#00E5FF]/10 to-transparent pointer-events-none" />

                    <div className="space-y-8 relative">
                        {journey.map((step, index) => (
                            <motion.div
                                key={step.id}
                                className="group/item flex items-start gap-8"
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1, duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
                            >
                                {/* Indicator Plate */}
                                <div className="relative flex flex-col items-center">
                                    <motion.div
                                        whileHover={{ scale: 1.15 }}
                                        className={`
                                            z-10 w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-700
                                            ${step.status === 'completed'
                                                ? 'bg-white/5 border-white/5 text-[var(--secondary)] backdrop-blur-md'
                                                : step.status === 'current'
                                                    ? 'bg-[var(--primary)] border-[var(--primary)] text-black shadow-[0_0_30px_#00E5FF] scale-110'
                                                    : 'bg-white/5 border-white/10 text-[var(--secondary)] group-hover/item:border-[#00E5FF]/50 backdrop-blur-md'
                                            }
                                        `}>
                                        {step.status === 'completed' ? <Check size={20} strokeWidth={3} /> :
                                            step.status === 'current' ? <Zap size={20} className="animate-pulse" /> :
                                                step.type === 'med' ? <Pill size={18} /> :
                                                    step.type === 'apt' ? <Stethoscope size={18} /> : <div className="w-1.5 h-1.5 rounded-full bg-current" />}
                                    </motion.div>

                                    {step.status === 'current' && (
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-[#00E5FF]/10 rounded-full blur-xl animate-pulse -z-10" />
                                    )}
                                </div>

                                {/* Content Plate */}
                                <div className="flex-1 pt-1 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full ${step.status === 'completed' ? 'bg-white/5 text-[var(--secondary)]' :
                                                step.status === 'current' ? 'bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/30' : 'bg-white/5 text-[var(--foreground)] border border-white/5'
                                                }`}>
                                                {step.time}
                                            </span>
                                            {step.type === 'apt' && (
                                                <div className="flex items-center gap-1.5 text-[9px] font-black uppercase text-blue-500 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                                                    <Stethoscope size={10} /> Clinical
                                                </div>
                                            )}
                                        </div>

                                        {step.type === 'task' && onDeleteTask && (
                                            <button
                                                onClick={() => onDeleteTask(step.rawId!)}
                                                className="opacity-0 group-hover/item:opacity-100 p-2 hover:bg-neutral-100 rounded-xl transition-all text-neutral-400 hover:text-red-500"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        )}
                                    </div>

                                    <h4 className={`text-base font-black tracking-tight leading-none uppercase ${step.status === 'completed' ? 'text-[var(--secondary)] line-through' : 'text-[var(--foreground)]'
                                        }`}>
                                        {step.label}
                                    </h4>

                                    {step.status === 'current' && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="flex items-center gap-2 text-[10px] font-bold text-[var(--primary)] uppercase tracking-widest"
                                        >
                                            In Progress <ArrowRight size={10} />
                                        </motion.div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Footer Insight */}
                <div className="p-6 bg-white/5 rounded-b-[2.5rem] border-t border-white/5 backdrop-blur-3xl">
                    <div className="flex items-center gap-4 text-neutral-500">
                        <Calendar size={18} className="text-[#00E5FF]/40" />
                        <p className="text-[10px] font-black uppercase tracking-widest">Schedule synchronized via Cloud Registry</p>
                    </div>
                </div>
            </GlassCard>

            <AnimatePresence>
                {isAdding && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsAdding(false)}
                            className="absolute inset-0 bg-black/40 backdrop-blur-2xl"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 40 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 40 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="w-full max-w-xl bg-[var(--background)] border border-white/10 rounded-[3rem] p-12 shadow-[0_40px_100px_rgba(0,0,0,0.5)] relative z-10 backdrop-blur-3xl"
                        >
                            <div className="absolute top-0 right-0 p-8">
                                <button onClick={() => setIsAdding(false)} className="w-12 h-12 rounded-full hover:bg-white/5 flex items-center justify-center transition-colors text-[var(--foreground)]">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="space-y-2 mb-10">
                                <div className="flex items-center gap-2 text-[#00E5FF]">
                                    <Calendar size={16} />
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Protocol Entry</span>
                                </div>
                                <h2 className="text-4xl font-black uppercase tracking-tighter text-[var(--foreground)]">Add Journey Step</h2>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 ml-2">Objective Description</label>
                                    <input
                                        required
                                        autoFocus
                                        type="text"
                                        placeholder="E.g. NEURAL SYRIUM INJECTION"
                                        value={newTask.title}
                                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                        className="w-full bg-white/5 border-2 border-transparent focus:border-[#00E5FF]/50 rounded-[1.5rem] px-8 py-6 outline-none transition-all font-black uppercase tracking-tight text-xl text-[var(--foreground)] placeholder:text-neutral-500/30"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 ml-2">Temporal Marker</label>
                                    <input
                                        required
                                        type="time"
                                        value={newTask.time}
                                        onChange={(e) => setNewTask({ ...newTask, time: e.target.value })}
                                        className="w-full bg-white/5 border-2 border-transparent focus:border-[#00E5FF]/50 rounded-[1.5rem] px-8 py-6 outline-none transition-all font-black text-xl text-[var(--foreground)]"
                                    />
                                </div>

                                <Button type="submit" className="w-full py-8 text-sm tracking-[0.2em]">Commit to Timeline</Button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}

