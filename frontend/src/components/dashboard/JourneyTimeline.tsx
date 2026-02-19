import { GlassCard } from "@/components/ui/GlassCard";
import { Check, Circle, Clock, Stethoscope, Plus, X, Trash2 } from "lucide-react";
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
            <GlassCard className="h-full min-h-[400px] relative group/journey">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-xl font-black uppercase tracking-tight">Today&apos;s Journey</h3>
                        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--secondary)]">Chronological Health Log</p>
                    </div>
                    <button
                        onClick={() => setIsAdding(true)}
                        className="w-8 h-8 rounded-full bg-[var(--primary)] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-[var(--primary)]/30"
                    >
                        <Plus size={16} strokeWidth={3} />
                    </button>
                </div>

                <div className="relative pl-6 space-y-10 before:absolute before:inset-0 before:left-[23px] before:w-[2px] before:bg-gradient-to-b before:from-[var(--primary)]/20 before:to-transparent before:h-[calc(100%-40px)]">
                    {journey.map((step, index) => (
                        <motion.div
                            key={step.id}
                            className="relative flex items-start gap-6 group/item"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            {/* Icon/Dot */}
                            <div className={`
                                z-10 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all duration-500
                                ${step.status === 'completed'
                                    ? 'bg-[var(--primary)] border-[var(--primary)] text-white scale-110 shadow-lg shadow-[var(--primary)]/30'
                                    : step.status === 'current'
                                        ? 'bg-white border-[var(--primary)] text-[var(--primary)] animate-pulse ring-4 ring-[var(--primary)]/20'
                                        : 'bg-[var(--background)] border-[var(--color-glass-border)] text-[var(--secondary)]'
                                }
                            `}>
                                {step.status === 'completed' ? <Check size={12} strokeWidth={4} /> :
                                    step.status === 'current' ? <Clock size={12} strokeWidth={3} /> :
                                        step.type === 'med' ? <Circle size={10} strokeWidth={3} /> :
                                            step.type === 'apt' ? <Stethoscope size={10} /> : <div className="w-1.5 h-1.5 rounded-full bg-current" />}
                            </div>

                            {/* Content */}
                            <div className={`flex-1 transition-opacity ${step.status === 'upcoming' ? 'opacity-40 group-hover/item:opacity-100' : ''}`}>
                                <div className="flex justify-between items-center mb-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-[var(--primary)]">{step.time}</span>
                                        {step.type === 'apt' && (
                                            <span className="text-[8px] font-black bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded-full uppercase">Consult</span>
                                        )}
                                        {step.type === 'task' && (
                                            <span className="text-[8px] font-black bg-purple-500/10 text-purple-500 px-2 py-0.5 rounded-full uppercase">Task</span>
                                        )}
                                    </div>
                                    {step.type === 'task' && onDeleteTask && (
                                        <button
                                            onClick={() => onDeleteTask(step.rawId!)}
                                            className="opacity-0 group-hover/item:opacity-100 p-1 hover:text-red-500 transition-all"
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                    )}
                                </div>
                                <p className={`text-sm font-black tracking-tight ${step.status === 'completed' ? 'text-[var(--secondary)] line-through' : 'text-[var(--foreground)]'}`}>
                                    {step.label}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </GlassCard>

            <AnimatePresence>
                {isAdding && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="w-full max-w-md bg-[var(--background)] border border-[var(--color-glass-border)] rounded-[40px] p-8 shadow-2xl overflow-hidden relative"
                        >
                            <div className="absolute top-0 right-0 p-6">
                                <button onClick={() => setIsAdding(false)} className="text-[var(--secondary)] hover:text-white transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <h2 className="text-3xl font-black mb-8 uppercase tracking-tighter">New Daily Event</h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[var(--secondary)] mb-2 block">Event Title</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="E.g. Morning Walk, Water Break"
                                        value={newTask.title}
                                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                        className="w-full bg-[var(--muted)]/50 border border-[var(--color-glass-border)] rounded-2xl px-6 py-4 focus:ring-2 focus:ring-[var(--primary)] outline-none transition-all font-bold"
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[var(--secondary)] mb-2 block">Time</label>
                                    <input
                                        required
                                        type="time"
                                        value={newTask.time}
                                        onChange={(e) => setNewTask({ ...newTask, time: e.target.value })}
                                        className="w-full bg-[var(--muted)]/50 border border-[var(--color-glass-border)] rounded-2xl px-6 py-4 focus:ring-2 focus:ring-[var(--primary)] outline-none transition-all font-bold"
                                    />
                                </div>

                                <Button type="submit" className="w-full py-6 rounded-2xl shadow-xl shadow-[var(--primary)]/20 font-black uppercase tracking-widest mt-4">
                                    Add to Journey
                                </Button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}

