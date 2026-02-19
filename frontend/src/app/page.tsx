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
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);

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
      console.error("Failed to add task:", error);
    }
  };

  const handleScan = () => {
    if (isScanning) return;
    setIsScanning(true);
    setScanComplete(false);

    // Simulate biometric analysis
    setTimeout(() => {
      setIsScanning(false);
      setScanComplete(true);
      // Reset complete state after 2s
      setTimeout(() => setScanComplete(false), 2000);
    }, 3000);
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
      {/* Soft medical background blobs */}
      <div className="aurora-bg">
        <div className="aurora-orb w-[700px] h-[700px] bg-[var(--primary-light)] top-[-200px] left-[-150px] opacity-60" />
        <div className="aurora-orb w-[500px] h-[500px] bg-[var(--secondary-light)] bottom-[-150px] right-[-100px] opacity-50" />
      </div>

      <div className="max-w-[1800px] mx-auto space-y-12 px-6 sm:px-12 pb-20">

        {/* Header Greeting */}
        <div className="flex flex-col xl:flex-row items-start xl:items-end justify-between gap-8 pt-8 relative z-10">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--primary-light)] rounded-full [box-shadow:var(--clay-shadow-sm)]">
              <Sparkles size={14} className="text-[var(--primary)]" />
              <span className="text-[11px] font-bold text-[var(--primary-dark)] tracking-wide">Synapse Care OS · Active</span>
            </div>
            <h1 className="text-6xl font-black tracking-tight leading-tight text-[var(--foreground)]">
              Good morning, <br /><span className="text-gradient">{user?.firstName || 'Doctor'}</span>
            </h1>
            <p className="text-[var(--foreground-muted)] font-medium max-w-xl text-lg leading-relaxed">
              {medications.length > 0 ? `You have ${medications.length} active medication${medications.length > 1 ? 's' : ''} today.` : 'All medication protocols are clear for today.'} Your vitals are within normal parameters.
            </p>
          </div>

          {/* Health Status Card */}
          <div className="flex items-center gap-5 p-5 bg-white rounded-[1.75rem] border border-[var(--clay-border)] [box-shadow:var(--clay-shadow-md)]">
            <div className="flex flex-col items-center gap-1">
              <span className="text-[9px] font-bold uppercase tracking-widest text-[var(--foreground-muted)]">Status</span>
              <div className="w-3 h-3 rounded-full bg-[var(--success)] shadow-[0_0_12px_rgba(16,185,129,0.6)]" />
            </div>
            <div className="w-[1px] h-10 bg-[var(--clay-border)]" />
            <div className="space-y-0.5">
              <div className="text-[9px] font-bold uppercase tracking-widest text-[var(--foreground-muted)]">Health Score</div>
              <div className="text-lg font-black text-[var(--primary-dark)]">98.4%</div>
            </div>
            <div className="w-[1px] h-10 bg-[var(--clay-border)]" />
            <div className="space-y-0.5">
              <div className="text-[9px] font-bold uppercase tracking-widest text-[var(--foreground-muted)]">Medications</div>
              <div className="text-lg font-black text-[var(--secondary)]">{medications.length} Active</div>
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
            {/* Biometric Scan — Interactive */}
            <motion.button
              onClick={handleScan}
              whileHover={{ y: -4, scale: 1.01 }}
              whileTap={{ scale: 0.98, y: 0 }}
              disabled={isScanning}
              className={`w-full p-6 bg-white rounded-[2rem] border border-[var(--clay-border)] text-left relative overflow-hidden [box-shadow:var(--clay-shadow-md)] hover:[box-shadow:var(--clay-shadow-lg)] transition-all duration-300 ${isScanning ? 'cursor-wait' : ''}`}
            >
              <div className="absolute right-4 bottom-4 opacity-[0.07]">
                <Fingerprint size={100} className={`text-[var(--primary)] ${isScanning ? 'animate-pulse' : ''}`} />
              </div>
              <div className="relative z-10 space-y-3">
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${isScanning ? 'bg-amber-100 text-amber-700' : scanComplete ? 'bg-green-100 text-green-700' : 'bg-[var(--secondary-light)]'}`}>
                  {isScanning ? <Loader2 size={10} className="animate-spin" /> : scanComplete ? <ShieldAlert size={10} className="text-green-600" /> : <Zap size={10} className="text-[var(--secondary)]" />}
                  <span className={`text-[9px] font-bold uppercase tracking-widest ${isScanning ? 'text-amber-700' : scanComplete ? 'text-green-700' : 'text-[var(--secondary-dark)]'}`}>
                    {isScanning ? 'Analyzing...' : scanComplete ? 'Scan Complete' : 'Biometric Auth'}
                  </span>
                </div>
                <h3 className="text-2xl font-black tracking-tight leading-tight text-[var(--foreground)]">
                  {isScanning ? 'Scanning Vitals' : scanComplete ? 'Vitals Normal' : 'Run Biometric\nHealth Scan'}
                </h3>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-[var(--muted)] rounded-full overflow-hidden [box-shadow:inset_0_1px_3px_rgba(0,0,0,0.08)]">
                    <motion.div
                      className="h-full bg-[var(--primary)] rounded-full"
                      animate={{ width: isScanning ? ['0%', '100%'] : scanComplete ? '100%' : '0%' }}
                      transition={isScanning ? { duration: 2, repeat: Infinity } : { duration: 0.5 }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-[var(--primary)]">
                    {isScanning ? 'SCANNING...' : scanComplete ? 'DONE' : 'READY'}
                  </span>
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

