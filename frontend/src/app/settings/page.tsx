"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Shield, Lock, Bell, User as UserIcon, Eye, Smartphone, Zap, Loader2, Link as LinkIcon, AlertTriangle, Activity, X, ChevronRight, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { usersApi } from "@/lib/api";
import { useThemeStore } from "@/lib/store";

type Tab = 'Profile' | 'Security' | 'Notifications' | 'Accessibility' | 'Connected Apps';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<Tab>('Profile');
    const [is2FAEnabled, setIs2FAEnabled] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [profile, setProfile] = useState<any>(null);
    const { accessibilityMode, setAccessibilityMode } = useThemeStore();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await usersApi.getProfile() as any;
                setProfile(data);
                setIs2FAEnabled(data.isTwoFactorEnabled);
            } catch (error) {
                console.error("Failed to fetch profile:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleUpdateSettings = async (updates: any) => {
        setIsSaving(true);
        try {
            await usersApi.updateSettings(updates);
            if (profile) {
                setProfile({ ...profile, ...updates });
            }
        } catch (error) {
            console.error("Failed to update settings:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleModeChange = async (mode: 'simple' | 'standard' | 'power') => {
        setAccessibilityMode(mode);
        await handleUpdateSettings({ uiMode: mode });
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
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                    <div>
                        <h1 className="text-section mb-3">System Nexus</h1>
                        <p className="text-subhead max-w-lg">
                            Configure your health intelligence environment and security protocols.
                        </p>
                    </div>
                    {isSaving && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center gap-2 text-primary font-black bg-primary/10 px-8 py-4 rounded-2xl border border-primary/20 shadow-clay"
                        >
                            <Loader2 className="w-4 h-4 animate-spin" />
                            SYNCING PROTOCOLS...
                        </motion.div>
                    )}
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <nav className="lg:col-span-3 space-y-6">
                        {(['Profile', 'Security', 'Notifications', 'Accessibility', 'Connected Apps'] as Tab[]).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`w-full flex items-center justify-between px-8 py-6 rounded-[2rem] font-black uppercase tracking-widest text-[10px] transition-all duration-300 relative group overflow-hidden ${activeTab === tab
                                    ? 'text-primary bg-white shadow-clay'
                                    : 'text-slate-400 hover:bg-white/50 hover:shadow-clay/50'
                                    }`}
                            >
                                <span className="relative z-10">{tab}</span>
                                {activeTab === tab && <ChevronRight className="w-4 h-4 relative z-10" />}
                                {activeTab === tab && (
                                    <motion.div
                                        layoutId="active-tab-indicator"
                                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-10 bg-primary rounded-full shadow-clay"
                                    />
                                )}
                            </button>
                        ))}
                    </nav>

                    {/* Content Area */}
                    <section className="lg:col-span-9">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.98, y: -10 }}
                                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                className="space-y-10"
                            >
                                {activeTab === 'Profile' && (
                                    <div className="space-y-10">
                                        <GlassCard variant="clay" className="!p-10">
                                            <div className="flex flex-col md:flex-row items-center gap-12">
                                                <div className="relative">
                                                    <div className="w-44 h-44 rounded-[3.5rem] bg-gradient-to-tr from-primary to-emerald-400 flex items-center justify-center text-white text-6xl font-black shadow-clay ring-[15px] ring-sky-50 transition-transform hover:scale-105 duration-500">
                                                        {profile?.firstName?.[0]}{profile?.lastName?.[0]}
                                                    </div>
                                                    <button className="absolute -bottom-2 -right-2 p-5 bg-white border border-white rounded-[2rem] shadow-clay text-primary hover:scale-110 transition-transform">
                                                        <Activity className="w-7 h-7" />
                                                    </button>
                                                </div>
                                                <div className="flex-1 text-center md:text-left">
                                                    <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-2">{profile?.firstName} {profile?.lastName}</h3>
                                                    <p className="text-sm font-bold text-slate-400 mb-8">{profile?.email}</p>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                        <div className="bg-sky-50/30 p-6 rounded-[2rem] border border-white shadow-clay">
                                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Primary Region</p>
                                                            <p className="text-xs font-black text-slate-900">{profile?.timezone || 'GMT -5 (EST)'}</p>
                                                        </div>
                                                        <div className="bg-emerald-50/30 p-6 rounded-[2rem] border border-white shadow-clay">
                                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Native Language</p>
                                                            <p className="text-xs font-black text-slate-900">English (Digital Standard)</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </GlassCard>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                            <GlassCard className="!p-10 group hover:border-primary/20 transition-all">
                                                <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-8">Identity Interface</h4>
                                                <div className="space-y-8">
                                                    <div className="space-y-3">
                                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">FIRST NAME</label>
                                                        <input defaultValue={profile?.firstName} className="w-full bg-sky-50/50 border-none rounded-2xl py-5 px-8 font-bold text-slate-900 outline-none focus:ring-4 focus:ring-primary/10 transition-all shadow-clay" />
                                                    </div>
                                                    <div className="space-y-3">
                                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">LAST NAME</label>
                                                        <input defaultValue={profile?.lastName} className="w-full bg-sky-50/50 border-none rounded-2xl py-5 px-8 font-bold text-slate-900 outline-none focus:ring-4 focus:ring-primary/10 transition-all shadow-clay" />
                                                    </div>
                                                    <Button variant="primary" className="w-full shadow-primary/20">UPDATE PROFILE</Button>
                                                </div>
                                            </GlassCard>
                                            <GlassCard className="!p-10 group hover:border-secondary/20 transition-all">
                                                <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-8">Neuro-Security</h4>
                                                <div className="space-y-8">
                                                    <div className="space-y-3">
                                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">SYNCED PHONE</label>
                                                        <input defaultValue={profile?.phone || "NOT INITIALIZED"} className="w-full bg-slate-50 border-none rounded-2xl py-5 px-8 font-bold text-slate-300 outline-none focus:ring-4 focus:ring-primary/10 transition-all" />
                                                    </div>
                                                    <div className="p-6 bg-secondary/5 rounded-[2rem] border border-secondary/10 flex items-center gap-6">
                                                        <div className="p-3 bg-white rounded-2xl shadow-clay text-secondary">
                                                            <Shield className="w-6 h-6" />
                                                        </div>
                                                        <p className="text-[10px] font-bold text-secondary/80 leading-relaxed uppercase tracking-widest">Medical data is encrypted via 256-bit Synapse Protocol.</p>
                                                    </div>
                                                </div>
                                            </GlassCard>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'Security' && (
                                    <div className="space-y-10">
                                        <GlassCard variant="clay" className="relative overflow-hidden !p-12 group">
                                            <Shield className="absolute top-[-40px] right-[-40px] w-80 h-80 opacity-[0.03] rotate-12 text-primary group-hover:opacity-[0.05] transition-opacity duration-1000" />
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 mb-16 relative z-10">
                                                <div>
                                                    <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Security Nexus</h3>
                                                    <p className="text-sm font-medium text-slate-400 max-w-md">Autonomous biometric and multi-factor shielding protocols.</p>
                                                </div>
                                                <div className="px-8 py-3 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-white shadow-clay inline-flex items-center gap-3">
                                                    <CheckCircle2 className="w-4 h-4" /> LINK OPTIMAL
                                                </div>
                                            </div>

                                            <div className="space-y-6 relative z-10">
                                                <div className="flex items-center justify-between p-10 bg-sky-50/30 rounded-[2.5rem] border border-white shadow-clay transition-all duration-500">
                                                    <div className="flex gap-8">
                                                        <div className="p-5 bg-white text-emerald-500 rounded-2xl h-fit shadow-clay">
                                                            <Smartphone className="w-7 h-7" />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-lg font-black text-slate-900">Neural MFA</h4>
                                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Requires biometric hash for every lifecycle sync.</p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => setIs2FAEnabled(!is2FAEnabled)}
                                                        className={`w-20 h-10 rounded-full p-2 transition-all duration-500 shadow-inner ${is2FAEnabled ? 'bg-emerald-400' : 'bg-slate-200'}`}
                                                    >
                                                        <motion.div
                                                            animate={{ x: is2FAEnabled ? 40 : 0 }}
                                                            className="w-6 h-6 bg-white rounded-full shadow-clay"
                                                        />
                                                    </button>
                                                </div>

                                                <div className="flex items-center justify-between p-10 bg-sky-50/30 rounded-[2.5rem] border border-white shadow-clay transition-all duration-500">
                                                    <div className="flex gap-8">
                                                        <div className="p-5 bg-white text-primary rounded-2xl h-fit shadow-clay">
                                                            <Lock className="w-7 h-7" />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-lg font-black text-slate-900">Quantum Keys</h4>
                                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Automatic rotation enabled. Last cycle: 48h ago.</p>
                                                        </div>
                                                    </div>
                                                    <Button variant="outline" className="font-black text-[10px] uppercase tracking-widest py-4 px-8 rounded-2xl border-white shadow-clay bg-white/50">INITIATE ROTATION</Button>
                                                </div>
                                            </div>
                                        </GlassCard>

                                        <GlassCard className="!p-10 border-primary/5">
                                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-10">ACCESS STREAM</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {[
                                                    { device: 'Neural iPhone 15', location: 'Metropolis, USA', time: 'ACTIVE NOW', current: true },
                                                    { device: 'Windows Nexus Hub', location: 'London, UK', time: '3 CYCLES AGO', current: false },
                                                ].map((session, i) => (
                                                    <div key={i} className="flex items-center justify-between p-8 bg-slate-50/50 rounded-[2rem] border border-primary/5 group hover:bg-white hover:shadow-clay transition-all duration-500">
                                                        <div className="flex gap-6">
                                                            <div className="p-4 bg-white rounded-2xl shadow-clay">
                                                                <Smartphone size={24} className="text-primary" />
                                                            </div>
                                                            <div>
                                                                <p className="font-black text-slate-900 text-sm">{session.device}</p>
                                                                <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mt-1">{session.location}</p>
                                                            </div>
                                                        </div>
                                                        <span className={`text-[8px] font-black uppercase tracking-widest ${session.current ? 'text-green-500' : 'text-slate-300'}`}>
                                                            {session.time}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </GlassCard>
                                    </div>
                                )}

                                {activeTab === 'Accessibility' && (
                                    <div className="space-y-10">
                                        <GlassCard variant="clay" className="!p-12">
                                            <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Display Architecture</h3>
                                            <p className="text-sm font-medium text-slate-400 mb-16">Interface scaling optimized for high-fidelity cognitive stability.</p>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                                                {(['simple', 'standard', 'power'] as const).map((mode) => (
                                                    <button
                                                        key={mode}
                                                        onClick={() => handleModeChange(mode)}
                                                        className={`p-10 rounded-[2.5rem] border-2 transition-all text-left space-y-8 group relative overflow-hidden ${accessibilityMode === mode
                                                            ? 'border-primary bg-sky-50 shadow-inner'
                                                            : 'border-transparent bg-white shadow-clay'
                                                            }`}
                                                    >
                                                        <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-transform group-hover:scale-110 ${accessibilityMode === mode ? 'bg-primary text-white shadow-clay' : 'bg-sky-50 text-primary shadow-inner border border-white'
                                                            }`}>
                                                            {mode === 'simple' ? <Zap size={28} /> : mode === 'standard' ? <UserIcon size={28} /> : <Zap size={28} />}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-black uppercase tracking-[0.2em] text-[10px] mb-3 text-slate-900">{mode} Protocol</h4>
                                                            <p className="text-[11px] font-bold leading-relaxed text-slate-500">
                                                                {mode === 'simple' && 'High contrast, minimal clutter focus.'}
                                                                {mode === 'standard' && 'Standard healthcare OS balance.'}
                                                                {mode === 'power' && 'Dense neural data visualization.'}
                                                            </p>
                                                        </div>
                                                        {accessibilityMode === mode && (
                                                            <motion.div layoutId="mode-check" className="absolute top-6 right-6 text-primary">
                                                                <CheckCircle2 size={24} />
                                                            </motion.div>
                                                        )}
                                                    </button>
                                                ))}
                                            </div>

                                            <div className="pt-16 border-t border-slate-100/50 text-center">
                                                <h4 className="font-black mb-10 uppercase text-[10px] tracking-[0.3em] text-slate-400">INTERFACE SYNTHESIS</h4>
                                                <div className="inline-flex p-12 bg-white rounded-[4rem] border border-white shadow-clay">
                                                    <ThemeToggle />
                                                </div>
                                            </div>
                                        </GlassCard>
                                    </div>
                                )}

                                {activeTab === 'Notifications' && (
                                    <div className="space-y-10">
                                        <GlassCard variant="clay" className="!p-12">
                                            <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-12">Alert Matrix</h3>
                                            <div className="space-y-6">
                                                {[
                                                    { title: 'Medication Adherence', desc: 'Real-time cabinet life-cycle alerts.', color: 'from-sky-400 to-primary' },
                                                    { title: 'Clinical Life-Cycle', desc: 'Pre-visit and post-visit data sync.', color: 'from-emerald-400 to-emerald-600' },
                                                    { title: 'Biometric Delta Reports', desc: 'Critical alerts for vital drift.', color: 'from-amber-400 to-amber-600' },
                                                    { title: 'Neural Shield Alerts', desc: 'Real-time identity access monitoring.', color: 'from-slate-400 to-slate-600' },
                                                ].map((item, i) => (
                                                    <div key={i} className="flex items-center justify-between p-10 bg-white rounded-[2.5rem] shadow-clay border-2 border-white/50 group hover:shadow-inner transition-all duration-500 cursor-pointer">
                                                        <div className="flex-1">
                                                            <h4 className="text-lg font-black text-slate-900 mb-1">{item.title}</h4>
                                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.desc}</p>
                                                        </div>
                                                        <div className={`w-16 h-8 rounded-full bg-gradient-to-r ${item.color} p-1.5 shadow-clay group-hover:scale-110 transition-transform`}>
                                                            <div className="w-5 h-5 bg-white rounded-full ml-auto shadow-sm" />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </GlassCard>
                                        <GlassCard variant="clay" className="bg-gradient-to-br from-primary to-sky-400 text-white border-none !p-16 shadow-2xl shadow-primary/30 relative overflow-hidden group">
                                            <Smartphone className="absolute bottom-[-60px] right-[-60px] w-96 h-96 opacity-10 -rotate-12 group-hover:scale-110 transition-transform duration-1000" />
                                            <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
                                                <div className="p-8 bg-white/20 rounded-[2.5rem] backdrop-blur-xl shadow-clay border border-white/20">
                                                    <Smartphone size={48} className="text-white" />
                                                </div>
                                                <div className="flex-1 text-center md:text-left">
                                                    <h4 className="text-3xl font-black uppercase tracking-tight mb-3">Sync to Mobile</h4>
                                                    <p className="text-lg opacity-90 font-black">Get critical biometric alerts directly on your neural link.</p>
                                                </div>
                                                <Button variant="ghost" className="text-white border-2 border-white/40 hover:bg-white/10 text-xs font-black uppercase tracking-widest py-6 px-12 rounded-[2rem] backdrop-blur-md shadow-clay">ACTIVATE LINK</Button>
                                            </div>
                                        </GlassCard>
                                    </div>
                                )}

                                {activeTab === 'Connected Apps' && (
                                    <div className="space-y-10">
                                        <GlassCard variant="clay" className="!p-12">
                                            <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Neural Bridges</h3>
                                            <p className="text-sm font-medium text-slate-400 mb-16">Authorized health intelligence ecosystem integrations.</p>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                {[
                                                    { name: 'Synapse Mobile', status: 'ACTIVE SYNC', icon: <Smartphone className="text-sky-500" /> },
                                                    { name: 'Neural Watch OS', status: 'LATENT', icon: <Activity className="text-slate-400" /> },
                                                    { name: 'Atlas Health', status: 'ACTIVE SYNC', icon: <Activity className="text-emerald-500" /> },
                                                    { name: 'Legacy Link', status: 'LATENT', icon: <LinkIcon className="text-slate-400" /> },
                                                ].map((app, i) => (
                                                    <div key={i} className="p-10 bg-white rounded-[3rem] shadow-clay border-2 border-white/50 flex items-center justify-between group transition-all duration-500">
                                                        <div className="flex items-center gap-8">
                                                            <div className="p-5 bg-sky-50 rounded-2xl text-primary shadow-inner border border-white">
                                                                <LinkIcon size={28} />
                                                            </div>
                                                            <div>
                                                                <h4 className="text-lg font-black text-slate-900">{app.name}</h4>
                                                                <p className={`text-[9px] font-black uppercase tracking-[0.2em] mt-1 ${app.status === 'ACTIVE SYNC' ? 'text-emerald-500' : 'text-slate-300'}`}>
                                                                    {app.status}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <Button variant="clay" size="sm" className="font-black text-[9px] uppercase tracking-widest py-3 shadow-clay opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                                                            {app.status === 'ACTIVE SYNC' ? 'SYNC' : 'LINK'}
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        </GlassCard>

                                        <GlassCard variant="clay" className="flex flex-col items-center justify-center !p-20 text-center space-y-10 group transition-all duration-1000 bg-emerald-50/20">
                                            <div className="p-8 bg-white rounded-full text-emerald-500 shadow-clay group-hover:scale-110 transition-transform">
                                                <Zap size={56} />
                                            </div>
                                            <div>
                                                <h4 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Request Architecture</h4>
                                                <p className="text-sm font-medium text-slate-400 max-w-sm mx-auto leading-relaxed uppercase tracking-widest">Help us expand the Synapse Neural Network.</p>
                                            </div>
                                            <Button variant="clay" className="px-16 shadow-clay">INITIATE REQUEST</Button>
                                        </GlassCard>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </section>
                </div>
            </div>
        </DashboardLayout>
    );
}
