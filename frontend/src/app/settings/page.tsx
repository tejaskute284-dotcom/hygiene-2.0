"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Shield, Lock, Bell, User as UserIcon, Eye, Smartphone, Zap, Loader2, Link as LinkIcon, AlertTriangle, Activity, Settings, Fingerprint, Globe, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { usersApi } from "@/lib/api";
import { useThemeStore } from "@/lib/store";

type Tab = 'Profile' | 'Security' | 'Notifications' | 'Accessibility' | 'Integrations';

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
                <div className="flex items-center justify-center h-screen -mt-24">
                    <Loader2 className="w-12 h-12 animate-spin text-[var(--primary)]" />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto space-y-12 pb-20 px-4 sm:px-8">
                {/* Hero Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-[var(--primary)] text-white rounded-xl shadow-lg ring-4 ring-[var(--primary)]/10">
                                <Settings size={20} />
                            </div>
                            <span className="text-xs font-black uppercase tracking-[0.3em] text-[var(--primary)]">Preference Engine</span>
                        </div>
                        <h1 className="text-5xl font-black tracking-tighter uppercase leading-none">System Config</h1>
                        <p className="text-[var(--secondary)] font-medium max-w-xl text-lg">
                            Fine-tune your cognitive experience, security protocols, and personal health registry access.
                        </p>
                    </div>

                    <AnimatePresence>
                        {isSaving && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="flex items-center gap-3 bg-[var(--primary)]/10 px-6 py-3 rounded-2xl border border-[var(--primary)]/20 shadow-lg"
                            >
                                <Loader2 className="w-4 h-4 animate-spin text-[var(--primary)]" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--primary)]">Syncing to Cloud</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                    {/* Advanced Sidebar Navigation */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-3">
                            {(['Profile', 'Security', 'Notifications', 'Accessibility', 'Integrations'] as Tab[]).map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`w-full group relative flex items-center gap-4 px-6 py-5 rounded-[2rem] transition-all duration-500 overflow-hidden ${activeTab === tab
                                            ? 'bg-white shadow-[0_20px_40px_rgba(0,0,0,0.08)] scale-105 z-10'
                                            : 'hover:bg-white/50'
                                        }`}
                                >
                                    {activeTab === tab && (
                                        <motion.div
                                            layoutId="active-indicator"
                                            className="absolute inset-y-2 left-2 w-1.5 bg-[var(--primary)] rounded-full"
                                        />
                                    )}
                                    <div className={`p-2 rounded-xl transition-colors ${activeTab === tab ? 'bg-[var(--primary)] text-white' : 'bg-[var(--muted)] text-[var(--secondary)] group-hover:bg-white'}`}>
                                        {tab === 'Profile' && <UserIcon size={18} />}
                                        {tab === 'Security' && <Shield size={18} />}
                                        {tab === 'Notifications' && <Bell size={18} />}
                                        {tab === 'Accessibility' && <Fingerprint size={18} />}
                                        {tab === 'Integrations' && <LinkIcon size={18} />}
                                    </div>
                                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${activeTab === tab ? 'text-[var(--foreground)]' : 'text-[var(--secondary)]'}`}>
                                        {tab}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Content Area Rendering */}
                    <div className="lg:col-span-3">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -30 }}
                                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                                className="space-y-8"
                            >
                                {activeTab === 'Profile' && (
                                    <div className="space-y-8">
                                        <GlassCard className="!p-10 border-none shadow-2xl relative overflow-hidden group">
                                            <div className="absolute -top-24 -right-24 w-64 h-64 bg-[var(--primary)]/5 rounded-full blur-3xl group-hover:bg-[var(--primary)]/10 transition-colors" />

                                            <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
                                                <div className="relative group/avatar">
                                                    <div className="w-40 h-40 rounded-[3rem] bg-gradient-to-tr from-[var(--primary)] to-[var(--accent)] flex items-center justify-center text-white text-5xl font-black shadow-2xl ring-[12px] ring-white">
                                                        {profile?.firstName?.[0]}{profile?.lastName?.[0]}
                                                    </div>
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        className="absolute -bottom-2 -right-2 p-4 bg-white rounded-2xl shadow-xl text-[var(--primary)] border border-black/5"
                                                    >
                                                        <Smartphone size={20} strokeWidth={3} />
                                                    </motion.button>
                                                </div>

                                                <div className="flex-1 text-center md:text-left space-y-6">
                                                    <div>
                                                        <h3 className="text-4xl font-black tracking-tighter uppercase mb-2">{profile?.firstName} {profile?.lastName}</h3>
                                                        <div className="flex items-center justify-center md:justify-start gap-4">
                                                            <div className="flex items-center gap-2 text-[var(--secondary)] font-bold text-sm">
                                                                <Mail size={14} />
                                                                {profile?.email}
                                                            </div>
                                                            <div className="w-1 h-1 bg-[var(--secondary)]/30 rounded-full" />
                                                            <div className="px-3 py-1 bg-blue-500/10 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-500/20">
                                                                Verified
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="bg-white/50 p-5 rounded-3xl border border-white">
                                                            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--secondary)] opacity-50 mb-2">Registry Zone</p>
                                                            <div className="flex items-center gap-3">
                                                                <Globe size={16} className="text-[var(--primary)]" />
                                                                <p className="text-sm font-black">{profile?.timezone || 'GMT -5 (EST)'}</p>
                                                            </div>
                                                        </div>
                                                        <div className="bg-white/50 p-5 rounded-3xl border border-white">
                                                            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--secondary)] opacity-50 mb-2">Protocol Language</p>
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-black text-blue-600">EN</div>
                                                                <p className="text-sm font-black">English (US)</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </GlassCard>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <GlassCard className="!p-8">
                                                <div className="flex items-center gap-3 mb-8">
                                                    <div className="w-10 h-10 rounded-xl bg-[var(--muted)] flex items-center justify-center text-[var(--secondary)]"><UserIcon size={20} /></div>
                                                    <h4 className="text-lg font-black uppercase tracking-tight">Personal Identity</h4>
                                                </div>
                                                <div className="space-y-6">
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-[var(--secondary)] ml-2">Display Name</label>
                                                        <input defaultValue={profile?.firstName + " " + profile?.lastName} className="w-full bg-[var(--muted)]/50 border-2 border-transparent focus:border-[var(--primary)] rounded-2xl py-5 px-6 font-black outline-none transition-all shadow-inner" />
                                                    </div>
                                                    <Button className="w-full py-6 rounded-2xl font-black uppercase tracking-widest bg-black text-white hover:scale-[1.02] transform transition-all">Update Identity</Button>
                                                </div>
                                            </GlassCard>

                                            <GlassCard className="!p-8">
                                                <div className="flex items-center gap-3 mb-8">
                                                    <div className="w-10 h-10 rounded-xl bg-[var(--muted)] flex items-center justify-center text-[var(--secondary)]"><Smartphone size={20} /></div>
                                                    <h4 className="text-lg font-black uppercase tracking-tight">Communication</h4>
                                                </div>
                                                <div className="space-y-6">
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-[var(--secondary)] ml-2">Protected Phone</label>
                                                        <input defaultValue={profile?.phone || "+1 (555) 000-0000"} className="w-full bg-[var(--muted)]/50 border-2 border-transparent focus:border-[var(--primary)] rounded-2xl py-5 px-6 font-black outline-none transition-all shadow-inner" />
                                                    </div>
                                                    <Button variant="secondary" className="w-full py-6 rounded-2xl font-black uppercase tracking-widest border-2">Set Primary Contact</Button>
                                                </div>
                                            </GlassCard>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'Security' && (
                                    <div className="space-y-8">
                                        <GlassCard className="relative overflow-hidden !p-12">
                                            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                                                <Shield size={200} />
                                            </div>

                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                                                <div className="max-w-md">
                                                    <h3 className="text-3xl font-black tracking-tighter uppercase mb-3">Health Security Vault</h3>
                                                    <p className="text-[var(--secondary)] font-medium text-lg leading-relaxed">
                                                        Toggle advanced cryptographic protections and biometric verification layers for your medical records.
                                                    </p>
                                                </div>
                                                <div className="px-6 py-3 bg-green-500 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-widest shadow-xl shadow-green-500/20">
                                                    High-Yield Security
                                                </div>
                                            </div>

                                            <div className="space-y-6">
                                                <div className="flex items-center justify-between p-8 bg-white/60 rounded-[2.5rem] border border-white shadow-sm hover:shadow-md transition-all group">
                                                    <div className="flex gap-6">
                                                        <div className="p-5 bg-blue-500/10 text-blue-500 rounded-3xl group-hover:bg-blue-500 group-hover:text-white transition-colors duration-500 shadow-lg shadow-blue-500/10 ring-8 ring-blue-500/5">
                                                            <Fingerprint size={32} strokeWidth={2.5} />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <h4 className="text-xl font-black uppercase tracking-tight">Biometric 2FA Protocol</h4>
                                                            <p className="text-sm text-[var(--secondary)] font-medium max-w-sm">Requires fingerprint or facial recognition for sensitive health exports.</p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => setIs2FAEnabled(!is2FAEnabled)}
                                                        className={`w-16 h-10 rounded-full p-1.5 transition-all duration-500 ${is2FAEnabled ? 'bg-green-500' : 'bg-gray-200'}`}
                                                    >
                                                        <motion.div
                                                            animate={{ x: is2FAEnabled ? 24 : 0 }}
                                                            className="w-7 h-7 bg-white rounded-full shadow-xl"
                                                        />
                                                    </button>
                                                </div>

                                                <div className="flex items-center justify-between p-8 bg-white/60 rounded-[2.5rem] border border-white shadow-sm hover:shadow-md transition-all group">
                                                    <div className="flex gap-6">
                                                        <div className="p-5 bg-purple-500/10 text-purple-500 rounded-3xl group-hover:bg-purple-500 group-hover:text-white transition-colors duration-500 shadow-lg shadow-purple-500/10 ring-8 ring-purple-500/5">
                                                            <Lock size={32} strokeWidth={2.5} />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <h4 className="text-xl font-black uppercase tracking-tight">Registry Password</h4>
                                                            <p className="text-sm text-[var(--secondary)] font-medium max-w-sm">Rotated 42 days ago. Using AES-256 equivalent complexity.</p>
                                                        </div>
                                                    </div>
                                                    <Button variant="outline" className="py-4 px-8 rounded-2xl font-black text-[10px] uppercase tracking-widest border-2">Cycle Key</Button>
                                                </div>
                                            </div>
                                        </GlassCard>

                                        <GlassCard className="!p-8">
                                            <div className="flex items-center justify-between mb-8">
                                                <h4 className="text-lg font-black uppercase tracking-tighter">Authorized Sessions</h4>
                                                <Button variant="ghost" className="text-red-500 font-black text-[10px] uppercase">Purge All Sessions</Button>
                                            </div>
                                            <div className="space-y-3">
                                                {[
                                                    { device: 'iPhone 15 Pro • iOS 17.4', location: 'MANHATTAN, NY', time: 'Active Now', current: true },
                                                    { device: 'Workstation Node • Chrome', location: 'LONDON, UK', time: '14:22 GMT', current: false },
                                                ].map((session, i) => (
                                                    <div key={i} className="flex items-center justify-between p-6 bg-[var(--muted)]/30 rounded-3xl border border-transparent hover:border-[var(--primary)]/10 transition-all">
                                                        <div className="flex gap-5">
                                                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[var(--secondary)] shadow-sm">
                                                                {session.device.includes('iPhone') ? <Smartphone size={24} /> : <Activity size={24} />}
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-black">{session.device}</p>
                                                                <p className="text-[10px] text-[var(--secondary)] font-black uppercase tracking-widest opacity-60 mt-0.5">{session.location}</p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${session.current ? 'text-green-500' : 'text-[var(--secondary)]'}`}>
                                                                {session.time}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </GlassCard>
                                    </div>
                                )}

                                {activeTab === 'Notifications' && (
                                    <div className="space-y-8">
                                        <GlassCard className="!p-12">
                                            <div className="mb-12">
                                                <h3 className="text-3xl font-black tracking-tighter uppercase mb-2">Intervention Alerts</h3>
                                                <p className="text-[var(--secondary)] font-medium text-lg">Define how and when our AI agent interrupts your day.</p>
                                            </div>

                                            <div className="grid gap-4">
                                                {[
                                                    { title: 'CRITICAL MEDICATION', desc: 'Interrupt all active modes for missed doses.', color: 'bg-blue-500' },
                                                    { title: 'CLINICAL REMINDERS', desc: 'Gentle nudges for upcoming appointments.', color: 'bg-purple-500' },
                                                    { title: 'STABILITY ANALYSIS', desc: 'Weekly reports on your health bio-stability.', color: 'bg-green-500' },
                                                    { title: 'SECURITY INTRUSIONS', desc: 'Real-time alert for unauthorized login signals.', color: 'bg-orange-500' },
                                                ].map((item, i) => (
                                                    <div key={i} className="flex items-center justify-between p-8 hover:bg-white rounded-[2.5rem] transition-all border-2 border-transparent hover:border-black/5 group">
                                                        <div className="flex gap-6">
                                                            <div className={`w-3 h-3 rounded-full mt-2 ${item.color.replace('bg-', 'text-').replace('500', '400')}`}>
                                                                <div className={`w-full h-full rounded-full animate-ping opacity-75 ${item.color}`} />
                                                            </div>
                                                            <div>
                                                                <h4 className="text-xl font-black tracking-tighter uppercase group-hover:text-[var(--primary)] transition-colors">{item.title}</h4>
                                                                <p className="text-sm text-[var(--secondary)] font-medium">{item.desc}</p>
                                                            </div>
                                                        </div>
                                                        <div className="w-14 h-8 rounded-full bg-green-500 p-1 cursor-pointer">
                                                            <div className="w-6 h-6 bg-white rounded-full ml-auto shadow-sm" />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </GlassCard>

                                        <GlassCard className="bg-gradient-to-br from-indigo-600 to-blue-800 text-white border-none shadow-2xl shadow-indigo-500/30 !p-12 relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none scale-150">
                                                <Smartphone size={200} />
                                            </div>
                                            <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                                                <div className="flex-1 space-y-4">
                                                    <h4 className="text-4xl font-black uppercase tracking-tighter leading-none">Sync to Mobile Core</h4>
                                                    <p className="text-lg opacity-80 font-medium max-w-lg">Get biometric push notifications and real-time intervention alerts on your companion hardware.</p>
                                                    <div className="flex gap-4 pt-4">
                                                        <Button className="bg-white text-indigo-600 hover:bg-neutral-100 font-black px-10 py-6 rounded-2xl tracking-widest uppercase text-xs">APP STORE</Button>
                                                        <Button variant="ghost" className="text-white hover:bg-white/10 font-black px-10 py-6 rounded-2xl tracking-widest uppercase text-xs border border-white/20">PLAY STORE</Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </GlassCard>
                                    </div>
                                )}

                                {activeTab === 'Accessibility' && (
                                    <div className="space-y-8">
                                        <GlassCard className="!p-12">
                                            <h3 className="text-3xl font-black tracking-tighter uppercase mb-2">Cognitive Scaling</h3>
                                            <p className="text-[var(--secondary)] font-medium text-lg mb-12">Adjust the density and complexity of the platform to match your current neural load.</p>

                                            <div className="space-y-12">
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                    {(['simple', 'standard', 'power'] as const).map((mode) => (
                                                        <button
                                                            key={mode}
                                                            onClick={() => handleModeChange(mode)}
                                                            className={`relative p-8 rounded-[2.5rem] border-2 transition-all duration-500 text-left space-y-5 overflow-hidden group ${accessibilityMode === mode
                                                                ? 'border-[var(--primary)] bg-white shadow-2xl scale-105 z-10'
                                                                : 'border-white bg-[var(--muted)]/30 hover:border-[var(--primary)]/20 hover:bg-white/50'
                                                                }`}
                                                        >
                                                            {accessibilityMode === mode && (
                                                                <motion.div
                                                                    layoutId="mode-glow"
                                                                    className="absolute top-0 right-0 p-4"
                                                                >
                                                                    <div className="w-2 h-2 rounded-full bg-[var(--primary)] shadow-[0_0_15px_var(--primary)]" />
                                                                </motion.div>
                                                            )}
                                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${accessibilityMode === mode ? 'bg-[var(--primary)] text-white shadow-xl shadow-[var(--primary)]/30 scale-110' : 'bg-white text-[var(--secondary)] shadow-sm'}`}>
                                                                {mode === 'simple' ? <Zap size={24} strokeWidth={2.5} /> : mode === 'standard' ? <Activity size={24} strokeWidth={2.5} /> : <Fingerprint size={24} strokeWidth={2.5} />}
                                                            </div>
                                                            <div>
                                                                <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-2">{mode} Profile</h4>
                                                                <p className="text-[10px] text-[var(--secondary)] font-medium leading-relaxed uppercase tracking-tighter opacity-70">
                                                                    {mode === 'simple' && 'High contrast, minimal density, focused UI.'}
                                                                    {mode === 'standard' && 'The default balanced ecosystem experience.'}
                                                                    {mode === 'power' && 'High-density data visualization & controls.'}
                                                                </p>
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>

                                                <div className="pt-12 border-t border-black/5 flex flex-col items-center">
                                                    <h4 className="text-[10px] font-black mb-8 uppercase tracking-[0.4em] text-[var(--secondary)]">Theme Synthesis</h4>
                                                    <div className="p-10 bg-white/50 rounded-[3rem] border-2 border-white shadow-xl">
                                                        <ThemeToggle />
                                                    </div>
                                                </div>
                                            </div>
                                        </GlassCard>
                                    </div>
                                )}

                                {activeTab === 'Integrations' && (
                                    <div className="space-y-8">
                                        <GlassCard className="!p-12">
                                            <h3 className="text-3xl font-black tracking-tighter uppercase mb-2">Connected Ecosystem</h3>
                                            <p className="text-[var(--secondary)] font-medium text-lg mb-12">Securely bridge your biometric hardware and third-party health databases.</p>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {[
                                                    { name: 'Apple Health', status: 'Connected', icon: <Smartphone className="text-red-500" /> },
                                                    { name: 'Google Fit', status: 'Standby', icon: <Globe className="text-blue-500" /> },
                                                    { name: 'MyFitnessPal', status: 'Connected', icon: <Activity className="text-blue-400" /> },
                                                    { name: 'Whoop Strap', status: 'Standby', icon: <Zap className="text-black" /> },
                                                ].map((app, i) => (
                                                    <div key={i} className="p-8 bg-white rounded-[2.5rem] border-2 border-transparent hover:border-[var(--primary)]/20 transition-all flex items-center justify-between group shadow-sm hover:shadow-xl">
                                                        <div className="flex items-center gap-6">
                                                            <div className="w-16 h-16 bg-[var(--muted)]/50 rounded-2xl flex items-center justify-center text-[var(--primary)] group-hover:bg-[var(--primary)]/10 transition-colors duration-500">
                                                                <LinkIcon size={24} strokeWidth={2.5} />
                                                            </div>
                                                            <div>
                                                                <h4 className="text-xl font-black tracking-tighter uppercase">{app.name}</h4>
                                                                <p className={`text-[10px] font-black uppercase tracking-widest mt-1 ${app.status === 'Connected' ? 'text-green-500' : 'text-[var(--secondary)] opacity-50'}`}>
                                                                    {app.status}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <Button variant="ghost" size="sm" className="font-black text-[10px] uppercase opacity-0 group-hover:opacity-100 transition-all bg-[var(--muted)] hover:bg-[var(--primary)] hover:text-white px-6 py-3 rounded-xl border border-black/5">
                                                            {app.status === 'Connected' ? 'Protocol' : 'Link'}
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        </GlassCard>

                                        <GlassCard className="border-dashed border-[3px] border-[var(--color-glass-border)] bg-transparent flex flex-col items-center justify-center p-20 text-center space-y-6 hover:bg-white/30 transition-all cursor-pointer group">
                                            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-[var(--secondary)] group-hover:scale-110 group-hover:text-[var(--primary)] transition-all duration-700 shadow-xl overflow-hidden relative">
                                                <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                                <Zap size={40} className="relative z-10" />
                                            </div>
                                            <div className="space-y-2">
                                                <h4 className="text-2xl font-black tracking-tighter uppercase">Request New Bridge</h4>
                                                <p className="text-sm text-[var(--secondary)] max-w-sm font-medium">Tell our AI research team which hardware or database integrations you need.</p>
                                            </div>
                                            <Button variant="outline" className="px-12 py-6 rounded-full font-black uppercase tracking-widest border-2">Submit Request</Button>
                                        </GlassCard>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}


