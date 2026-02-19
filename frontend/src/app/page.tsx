"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { medicationsApi, usersApi, appointmentsApi, dailyScheduleApi } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Activity, Pill, Settings, Calendar, Bell, Plus, Loader2, Sparkles, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const router = useRouter();
  const [medications, setMedications] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [dailySchedule, setDailySchedule] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [medsData, userData, aptsData, scheduleData] = await Promise.all([
        medicationsApi.getAll(true),
        usersApi.getProfile(),
        appointmentsApi.getUpcoming(5),
        dailyScheduleApi.getAll()
      ]);

      setMedications((medsData as any[]) || []);
      setUser(userData);
      setAppointments((aptsData as any[]) || []);
      setDailySchedule((scheduleData as any[]) || []);
    } catch (error: any) {
      console.error("Dashboard error:", error.message);
      if (error.message === 'Unauthorized') {
        router.push('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-6 duration-1000">

        {/* Secondary Header / Quick Actions */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <h1 className="text-section mb-3">Health Pulse</h1>
            <p className="text-subhead max-w-lg">
              Comprehensive overview of your physiological stability and scheduled protocols.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" className="w-14 h-14 rounded-2xl">
              <Bell className="w-5 h-5" />
            </Button>
            <Button variant="primary" className="gap-3 py-6 px-10 rounded-2xl shadow-primary/20">
              <Plus className="w-5 h-5" />
              <span className="font-black uppercase tracking-widest text-xs">Initialize Log</span>
            </Button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* Health Pulse - Main Focus */}
          <div className="lg:col-span-8">
            <GlassCard variant="clay" className="h-full group !p-10">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-5">
                  <div className="p-5 rounded-2xl bg-white shadow-clay text-primary transition-all duration-500">
                    <Activity className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">Vitals Continuity</h2>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Real-time physiological stream</p>
                  </div>
                </div>
                <div className="flex items-end gap-2 px-6 py-3 bg-sky-50 rounded-2xl shadow-clay">
                  <span className="text-4xl font-black text-primary tracking-tighter">98</span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">BPM</span>
                </div>
              </div>

              {/* Enhanced Chart Visualization */}
              <div className="w-full h-[320px] bg-sky-50/30 rounded-[2.5rem] flex items-end gap-3 p-10 border border-white/40 shadow-clay relative overflow-hidden group/chart">
                <div className="absolute inset-x-0 bottom-0 h-full flex flex-col justify-between opacity-5 border-b border-slate-200">
                  <div className="w-full border-t border-slate-900" />
                  <div className="w-full border-t border-slate-900" />
                  <div className="w-full border-t border-slate-900" />
                </div>

                {[40, 70, 45, 90, 65, 80, 50, 85, 95, 60, 75, 55, 65, 80, 95].map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: i * 0.05, duration: 1, ease: "easeOut" }}
                    className="flex-1 bg-gradient-to-t from-primary/80 to-sky-400/80 rounded-t-xl group-hover/chart:from-primary group-hover/chart:to-sky-400 transition-all duration-500 shadow-sm relative z-10"
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-white/30 rounded-full" />
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Quick Actions & Stats */}
          <div className="lg:col-span-4 flex flex-col gap-8">

            {/* Medications Card */}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <GlassCard
                variant="clay"
                className="cursor-pointer group !p-8"
                onClick={() => router.push('/medications')}
              >
                <div className="flex items-center gap-6">
                  <div className="p-5 rounded-2xl bg-white shadow-clay text-secondary transition-all duration-500">
                    <Pill className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Medications</p>
                    <h3 className="text-xl font-black text-slate-900">{medications.length} Active Prescriptions</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                      <span className="text-[10px] font-black text-secondary uppercase tracking-widest">Adherence Optimal</span>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            {/* Appointments Card */}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <GlassCard
                variant="clay"
                className="cursor-pointer group !p-8"
                onClick={() => router.push('/appointments')}
              >
                <div className="flex items-center gap-6">
                  <div className="p-5 rounded-2xl bg-white shadow-clay text-accent transition-all duration-500">
                    <Calendar className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Schedule</p>
                    <h3 className="text-xl font-black text-slate-900">
                      {appointments.length > 0 ? `${appointments.length} Upcoming Visits` : 'Clinically Clear'}
                    </h3>
                    <p className="text-[10px] font-black text-accent uppercase tracking-widest mt-2">Next: Routine Review</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            {/* Insights Card */}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <GlassCard
                variant="clay"
                className="cursor-pointer group !p-8"
                onClick={() => router.push('/analytics')}
              >
                <div className="flex items-center gap-6">
                  <div className="p-5 rounded-2xl bg-white shadow-clay text-primary transition-all duration-500">
                    <Sparkles className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Intelligence</p>
                    <h3 className="text-xl font-black text-slate-900">Bio-Analysis</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                      <span className="text-[10px] font-black text-primary uppercase tracking-widest">Efficiency: 94%</span>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
