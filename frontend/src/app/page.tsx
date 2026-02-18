"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { HealthPulseOrb } from "@/components/dashboard/HealthPulseOrb";
import { JourneyTimeline } from "@/components/dashboard/JourneyTimeline";
import { PillCabinet } from "@/components/dashboard/PillCabinet";
import { MedicationSwiper } from "@/components/dashboard/MedicationSwiper";
import { useState, useEffect } from "react";
import { medicationsApi, usersApi, appointmentsApi, dailyScheduleApi } from "@/lib/api";
import { Loader2, Sparkles, Zap, ShieldAlert, Fingerprint } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [medications, setMedications] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [dailySchedule, setDailySchedule] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [medsData, userData, aptsData, scheduleData] = await Promise.all([
        medicationsApi.getAll(true),
        usersApi.getProfile(),
        appointmentsApi.getAll(),
        dailyScheduleApi.getAll()
      ]);
      setMedications((medsData as any[]) || []);
      setUser(userData);
      setAppointments((aptsData as any[]) || []);
      setDailySchedule((scheduleData as any[]) || []);
    } catch (error: any) {
      console.error("Dashboard error:", error.message);
      if (error.message === "Unauthorized") {
        router.push("/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTask = async (task: any) => {
    try {
      await dailyScheduleApi.create(task);
      fetchData();
    } catch (error) {
      console.error("Failed to add task:", error);
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!confirm("Delete this event?")) return;
    try {
      await dailyScheduleApi.delete(id);
      fetchData();
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteMedication = async (id: string) => {
    if (!confirm("Delete this medication?")) return;
    try {
      await medicationsApi.delete(id);
      fetchData();
    } catch (error) {
      console.error("Failed to delete:", error);
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
              <Loader2 className="w-16 h-16 animate-spin text-[#00E5FF] opacity-20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Fingerprint className="w-8 h-8 text-[#00E5FF] shadow-[0_0_15px_#00E5FF]" />
              </div>
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 italic">Syncing Health Matrix...</span>
          </motion.div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Dynamic Background - More Vibrant */}
      <div className="aurora-bg">
        <div className="aurora-orb w-[800px] h-[800px] bg-[var(--primary)] top-[-300px] left-[-200px] opacity-[0.05]" />
        <div className="aurora-orb w-[600px] h-[600px] bg-[#8b5cf6] bottom-[-200px] right-[-100px] opacity-[0.04]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
      </div>

      <div className="max-w-[1800px] mx-auto space-y-12 px-6 sm:px-12 pb-20">

        {/* Header Greeting Section - Enhanced Glass */}
        <div className="flex flex-col xl:flex-row items-start xl:items-end justify-between gap-12 pt-8 relative z-10">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/5 text-[#00E5FF] rounded-2xl border border-[#00E5FF]/30 shadow-[0_0_20px_rgba(0,229,255,0.1)] backdrop-blur-xl">
                <Sparkles size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#00E5FF]">Neural Core V2.0</span>
                <span className="text-[8px] font-bold uppercase tracking-widest text-[var(--secondary)]">System Optimization: Stable</span>
              </div>
            </div>
            <h1 className="text-8xl font-black tracking-tighter uppercase leading-[0.8] text-[var(--foreground)]">
              Welcome, <br /><span className="text-gradient">{(user?.firstName || 'TEJAS').toUpperCase()}</span>
            </h1>
            <p className="text-[var(--secondary)] font-bold max-w-2xl text-2xl leading-relaxed">
              System analysis indicates a <span className="text-[#00E5FF]">{medications.length > 0 ? '98.4%' : '100%'} stability score</span>. Protocols are performing within optimal parameters.
            </p>
          </div>

          <div className="flex items-center gap-8 p-8 bg-white/5 rounded-[3rem] border border-white/10 backdrop-blur-3xl shadow-2xl">
            <div className="flex flex-col items-center gap-2">
              <span className="text-[8px] font-black uppercase tracking-[0.3em] text-[var(--secondary)]">Node</span>
              <div className="w-3 h-3 rounded-full bg-[#00E5FF] shadow-[0_0_20px_#00E5FF]" />
            </div>
            <div className="h-10 w-[1px] bg-white/10" />
            <div className="space-y-1">
              <div className="text-[8px] font-black uppercase tracking-[0.3em] text-[var(--secondary)]">Security State</div>
              <div className="text-sm font-black uppercase text-[var(--foreground)]">Registry Secure</div>
            </div>
            <div className="h-10 w-[1px] bg-white/10" />
            <div className="p-4 bg-white/5 text-[var(--foreground)] rounded-2xl border border-white/5 shadow-xl">
              <ShieldAlert size={20} className="text-red-500" />
            </div>
          </div>
        </div>

        {/* Action Grid: The Three Pillars */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10 pt-10">

          {/* Pillar 1: Queue Protocol */}
          <div className="flex flex-col space-y-10">
            <div className="flex-1">
              <MedicationSwiper medications={medications} onUpdate={fetchData} />
            </div>
          </div>

          {/* Pillar 2: Bio Analysis */}
          <div className="flex flex-col space-y-10">
            <div className="flex-1">
              <HealthPulseOrb />
            </div>
            {/* Proper Biometric Button */}
            <motion.button
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              className="w-full !p-8 bg-white/5 border border-[#00E5FF]/30 rounded-[3rem] group overflow-hidden shadow-2xl relative backdrop-blur-3xl text-left"
            >
              <div className="absolute right-[-20px] bottom-[-20px] p-4 opacity-5 group-hover:opacity-20 transition-all duration-700">
                <Fingerprint size={120} className="text-[#00E5FF]" />
              </div>

              {/* Scan Beam Effect */}
              <div className="absolute inset-x-0 h-[2px] bg-[#00E5FF]/30 top-0 group-hover:top-full transition-all duration-[2000ms] ease-linear pointer-events-none" />

              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] font-black uppercase tracking-[0.4em] text-[#00E5FF]">System Protocol</div>
                  <Zap size={16} className="text-[#00E5FF] animate-pulse" />
                </div>
                <h3 className="text-3xl font-black uppercase tracking-tighter leading-none text-[var(--foreground)]">Run Full <br />Biometric Scan</h3>
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-[#00E5FF]"
                      animate={{ width: ['0%', '100%'] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                  </div>
                  <span className="text-[10px] font-black text-[#00E5FF]">ACTIVE</span>
                </div>
              </div>
            </motion.button>
          </div>

          {/* Pillar 3: Neural Journey */}
          <div className="flex flex-col space-y-10">
            <div className="flex-1">
              <JourneyTimeline
                medications={medications}
                appointments={appointments}
                dailySchedule={dailySchedule}
                onAddTask={handleAddTask}
                onDeleteTask={handleDeleteTask}
              />
            </div>
          </div>

        </div>

        {/* Full Width Asset Pillar: Cabinet */}
        <div className="relative z-10">
          <PillCabinet medications={medications} onDelete={handleDeleteMedication} />
        </div>
      </div>
    </DashboardLayout>
  );
}

