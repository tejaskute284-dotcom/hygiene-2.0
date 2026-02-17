"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { HealthPulseOrb } from "@/components/dashboard/HealthPulseOrb";
import { JourneyTimeline } from "@/components/dashboard/JourneyTimeline";
import { PillCabinet } from "@/components/dashboard/PillCabinet";
import { MedicationSwiper } from "@/components/dashboard/MedicationSwiper";
import { useState, useEffect } from "react";
import { medicationsApi, usersApi, appointmentsApi, dailyScheduleApi } from "@/lib/api";
import { Loader2 } from "lucide-react";

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
          <Loader2 className="w-12 h-12 animate-spin text-[var(--primary)]" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Animated Aurora Background Background */}
      <div className="aurora-bg">
        <div className="aurora-orb w-[600px] h-[600px] bg-[var(--primary)] top-[-200px] left-[-200px] opacity-20" />
        <div className="aurora-orb w-[500px] h-[500px] bg-[var(--accent)] bottom-[-100px] right-[-100px] opacity-10" style={{ animationName: 'float-delayed' }} />
        <div className="aurora-orb w-[400px] h-[400px] bg-purple-500 top-[20%] right-[10%] opacity-10" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        {/* Welcome Section */}
        <GlassCard className="col-span-full md:col-span-2">
          <h1 className="text-3xl font-black tracking-tighter mb-2 uppercase">Welcome back, {user?.firstName || 'Tejas'}.</h1>
          <p className="text-[var(--secondary)] font-medium">
            Your health overview looks great today. You have an adherence score of {medications.length > 0 ? '98%' : '---'}.
          </p>
        </GlassCard>

        {/* Health Pulse Orb */}
        <div className="col-span-1">
          <HealthPulseOrb />
        </div>

        {/* Medication Swiper (Main Action Area) */}
        <div className="col-span-1 lg:col-span-1 row-span-2">
          <MedicationSwiper medications={medications} onUpdate={fetchData} />
        </div>

        {/* Journey Timeline */}
        <div className="col-span-1 lg:col-span-1 lg:col-start-2">
          <JourneyTimeline
            medications={medications}
            appointments={appointments}
            dailySchedule={dailySchedule}
            onAddTask={handleAddTask}
            onDeleteTask={handleDeleteTask}
          />
        </div>

        {/* Pill Cabinet - ENABLED */}
        <div className="col-span-full lg:col-span-1 lg:col-start-3 lg:row-span-2">
          <PillCabinet medications={medications} onDelete={handleDeleteMedication} />
        </div>
      </div>
    </DashboardLayout>
  );
}

