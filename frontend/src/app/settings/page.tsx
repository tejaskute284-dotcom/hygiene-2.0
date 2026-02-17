"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Shield, Lock, Bell, User as UserIcon, Eye, Smartphone, Zap, Loader2, Link as LinkIcon, AlertTriangle, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { usersApi } from "@/lib/api";
import { useThemeStore } from "@/lib/store";

type Tab = 'Profile' | 'Security' | 'Notifications' | 'Accessibility' | 'Connected Apps';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<Tab>('Profile');
    const [is2FAEnabled, setIs2FAEnabled] = useState(false);
    const [show2FASetup, setShow2FASetup] = useState(false);
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
            <div className="max-w-6xl mx-auto space-y-8 pb-20">
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-black tracking-tight mb-2">Settings</h1>
                        <p className="text-[var(--secondary)] font-medium">Manage your security, notifications, and accessibility preferences.</p>
                    </div>
                    {isSaving && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-2 text-[var(--primary)] text-sm font-bold bg-[var(--primary)]/10 px-4 py-2 rounded-full border border-[var(--primary)]/20"
                        >
                            <Loader2 className="w-4 h-4 animate-spin" />
                            SYNCING...
                        </motion.div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Navigation Sidebar */}
                    <div className="lg:col-span-1 space-y-2">
                        {(['Profile', 'Security', 'Notifications', 'Accessibility', 'Connected Apps'] as Tab[]).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`w-full text-left px-5 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all duration-300 relative overflow-hidden group ${activeTab === tab
                                    ? 'text-white bg-[var(--primary)] shadow-xl shadow-[var(--primary)]/20'
                                    : 'text-[var(--secondary)] hover:bg-[var(--muted)]/50'
                                    }`}
                            >
                                <span className="relative z-10">{tab}</span>
                                {activeTab === tab && (
                                    <motion.div
                                        layoutId="active-tab-bg"
                                        className="absolute inset-0 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)]"
                                    />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Content Area */}
                    <div className="lg:col-span-3">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-6"
                            >
                                {activeTab === 'Profile' && (
                                    <div className="space-y-6">
                                        <GlassCard className="flex flex-col md:flex-row items-center gap-8 p-10">
                                            <div className="relative group">
                                                <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-[var(--primary)] to-[var(--accent)] flex items-center justify-center text-white text-4xl font-bold shadow-2xl ring-8 ring-[var(--primary)]/10">
                                                    {profile?.firstName?.[0]}{profile?.lastName?.[0]}
                                                </div>
                                                <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border border-gray-100 text-[var(--primary)] hover:scale-110 transition-transform">
                                                    <Smartphone size={16} />
                                                </button>
                                            </div>
                                            <div className="flex-1 text-center md:text-left space-y-4">
                                                <div>
                                                    <h3 className="text-3xl font-black tracking-tight">{profile?.firstName} {profile?.lastName}</h3>
                                                    <p className="text-[var(--secondary)] font-medium">{profile?.email}</p>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="bg-[var(--muted)]/50 p-4 rounded-2xl">
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--secondary)] mb-1">Timezone</p>
                                                        <p className="text-sm font-bold">{profile?.timezone || 'GMT -5 (EST)'}</p>
                                                    </div>
                                                    <div className="bg-[var(--muted)]/50 p-4 rounded-2xl">
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--secondary)] mb-1">Language</p>
                                                        <p className="text-sm font-bold">English (US)</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </GlassCard>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <GlassCard>
                                                <h4 className="text-lg font-black mb-4 uppercase tracking-tighter">Identity Details</h4>
                                                <div className="space-y-4">
                                                    <div className="space-y-1">
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-[var(--secondary)]">First Name</label>
                                                        <input defaultValue={profile?.firstName} className="w-full bg-[var(--muted)]/50 border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-[var(--primary)] font-bold" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-[var(--secondary)]">Last Name</label>
                                                        <input defaultValue={profile?.lastName} className="w-full bg-[var(--muted)]/50 border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-[var(--primary)] font-bold" />
                                                    </div>
                                                </div>
                                            </GlassCard>
                                            <GlassCard>
                                                <h4 className="text-lg font-black mb-4 uppercase tracking-tighter">Contact Preferences</h4>
                                                <div className="space-y-4">
                                                    <div className="space-y-1">
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-[var(--secondary)]">Phone Number</label>
                                                        <input defaultValue={profile?.phone || "Not Set"} className="w-full bg-[var(--muted)]/50 border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-[var(--primary)] font-bold text-[var(--secondary)]" />
                                                    </div>
                                                    <Button className="w-full py-4 rounded-xl mt-2 font-black">SAVE CHANGES</Button>
                                                </div>
                                            </GlassCard>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'Security' && (
                                    <div className="space-y-6">
                                        <GlassCard className="relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                                <Shield size={120} />
                                            </div>
                                            <div className="flex items-center justify-between mb-8">
                                                <div>
                                                    <h3 className="text-2xl font-black tracking-tight mb-2">Security Hub</h3>
                                                    <p className="text-[var(--secondary)] font-medium">Protect your health data with biometric & logic-based controls.</p>
                                                </div>
                                                <div className="px-4 py-2 bg-green-500/10 text-green-500 rounded-full text-[10px] font-black uppercase border border-green-500/20">
                                                    System Secure
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between p-6 bg-[var(--muted)]/50 rounded-3xl border border-[var(--color-glass-border)]">
                                                    <div className="flex gap-4">
                                                        <div className="p-3 bg-blue-500/10 text-blue-500 rounded-2xl h-fit">
                                                            <Smartphone size={24} />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold">Two-Step Authentication</h4>
                                                            <p className="text-xs text-[var(--secondary)] mt-1">Requires a secure 6-digit code for every login attempt.</p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => setIs2FAEnabled(!is2FAEnabled)}
                                                        className={`w-14 h-8 rounded-full p-1 transition-colors ${is2FAEnabled ? 'bg-green-500' : 'bg-gray-300'}`}
                                                    >
                                                        <motion.div animate={{ x: is2FAEnabled ? 24 : 0 }} className="w-6 h-6 bg-white rounded-full shadow-lg" />
                                                    </button>
                                                </div>

                                                <div className="flex items-center justify-between p-6 bg-[var(--muted)]/50 rounded-3xl border border-[var(--color-glass-border)]">
                                                    <div className="flex gap-4">
                                                        <div className="p-3 bg-purple-500/10 text-purple-500 rounded-2xl h-fit">
                                                            <Lock size={24} />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold">Password Management</h4>
                                                            <p className="text-xs text-[var(--secondary)] mt-1">Last changed 2 months ago. Use a strong, unique password.</p>
                                                        </div>
                                                    </div>
                                                    <Button variant="ghost" className="font-black text-[10px] uppercase">Update</Button>
                                                </div>
                                            </div>
                                        </GlassCard>

                                        <GlassCard>
                                            <h4 className="text-lg font-black mb-6 uppercase tracking-tighter">Login Activity</h4>
                                            <div className="space-y-4">
                                                {[
                                                    { device: 'iPhone 15 Pro', location: 'New York, USA', time: 'Active Now', current: true },
                                                    { device: 'Windows Desktop', location: 'London, UK', time: '2 days ago', current: false },
                                                ].map((session, i) => (
                                                    <div key={i} className="flex items-center justify-between p-4 bg-[var(--muted)]/30 rounded-2xl">
                                                        <div className="flex gap-4">
                                                            <div className="p-2 bg-white rounded-xl shadow-sm">
                                                                <Smartphone size={20} className="text-[var(--secondary)]" />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-bold">{session.device}</p>
                                                                <p className="text-[10px] text-[var(--secondary)] font-medium uppercase">{session.location}</p>
                                                            </div>
                                                        </div>
                                                        <span className={`text-[10px] font-black uppercase ${session.current ? 'text-green-500' : 'text-[var(--secondary)]'}`}>
                                                            {session.time}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </GlassCard>
                                    </div>
                                )}

                                {activeTab === 'Accessibility' && (
                                    <div className="space-y-6">
                                        <GlassCard>
                                            <h3 className="text-2xl font-black mb-2">Display & Interaction</h3>
                                            <p className="text-[var(--secondary)] font-medium mb-8 text-sm">Adaptive interface scaling based on your cognitive and visual needs.</p>

                                            <div className="space-y-8">
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    {(['simple', 'standard', 'power'] as const).map((mode) => (
                                                        <button
                                                            key={mode}
                                                            onClick={() => handleModeChange(mode)}
                                                            className={`p-6 rounded-3xl border-2 transition-all text-left space-y-3 ${accessibilityMode === mode
                                                                ? 'border-[var(--primary)] bg-[var(--primary)]/5 ring-4 ring-[var(--primary)]/10'
                                                                : 'border-[var(--color-glass-border)] hover:border-[var(--secondary)]'
                                                                }`}
                                                        >
                                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${accessibilityMode === mode ? 'bg-[var(--primary)] text-white' : 'bg-[var(--muted)] text-[var(--secondary)]'
                                                                }`}>
                                                                {mode === 'simple' ? <Zap size={20} /> : mode === 'standard' ? <UserIcon size={20} /> : <Zap size={20} />}
                                                            </div>
                                                            <h4 className="font-black uppercase tracking-widest text-xs">{mode}</h4>
                                                            <p className="text-[10px] text-[var(--secondary)] leading-relaxed">
                                                                {mode === 'simple' && 'High contrast, simplified navigation for maximum focus.'}
                                                                {mode === 'standard' && 'Balanced experience with standard interactive elements.'}
                                                                {mode === 'power' && 'Dense data visualization for power users.'}
                                                            </p>
                                                        </button>
                                                    ))}
                                                </div>

                                                <div className="pt-6 border-t border-[var(--color-glass-border)]">
                                                    <h4 className="font-black mb-4 uppercase text-xs tracking-widest">Theme Synthesis</h4>
                                                    <div className="flex justify-center p-8 bg-[var(--muted)]/20 rounded-3xl">
                                                        <ThemeToggle />
                                                    </div>
                                                </div>
                                            </div>
                                        </GlassCard>
                                    </div>
                                )}

                                {activeTab === 'Notifications' && (
                                    <div className="space-y-6">
                                        <GlassCard>
                                            <h3 className="text-2xl font-black mb-6">Proactive Alerts</h3>
                                            <div className="space-y-2">
                                                {[
                                                    { title: 'Medication Reminders', desc: 'Push notifications when it is time for your meds.', color: 'text-blue-500' },
                                                    { title: 'Appointment Alerts', desc: 'Reminders 24 hours before your scheduled visit.', color: 'text-purple-500' },
                                                    { title: 'Health Stability Reports', desc: 'Weekly summary of your health stability score.', color: 'text-green-500' },
                                                    { title: 'Security Logins', desc: 'Real-time alerts for login attempts on new devices.', color: 'text-orange-500' },
                                                ].map((item, i) => (
                                                    <div key={i} className="flex items-center justify-between p-5 hover:bg-[var(--muted)]/30 rounded-2xl transition-colors">
                                                        <div className="flex-1">
                                                            <h4 className="font-bold mb-1">{item.title}</h4>
                                                            <p className="text-xs text-[var(--secondary)]">{item.desc}</p>
                                                        </div>
                                                        <div className="w-12 h-6 rounded-full bg-green-500 p-1">
                                                            <div className="w-4 h-4 bg-white rounded-full ml-auto" />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </GlassCard>
                                        <GlassCard className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-none shadow-blue-500/30">
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-white/20 rounded-2xl h-fit">
                                                    <Smartphone size={24} />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-black text-lg uppercase tracking-tight">Sync to Mobile</h4>
                                                    <p className="text-sm opacity-80 mt-1 font-medium">Get critical alerts directly on your smartphone with our iOS/Android app.</p>
                                                </div>
                                                <Button variant="ghost" className="text-white hover:bg-white/10 font-black">GET APP</Button>
                                            </div>
                                        </GlassCard>
                                    </div>
                                )}

                                {activeTab === 'Connected Apps' && (
                                    <div className="space-y-6">
                                        <GlassCard>
                                            <h3 className="text-2xl font-black mb-2">Integrations</h3>
                                            <p className="text-[var(--secondary)] font-medium mb-8 text-sm">Grant Synapse Care access to your existing health ecosystem.</p>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {[
                                                    { name: 'Apple Health', status: 'Connected', icon: <Smartphone className="text-red-500" /> },
                                                    { name: 'Google Fit', status: 'Disconnected', icon: <Smartphone className="text-blue-500" /> },
                                                    { name: 'MyFitnessPal', status: 'Connected', icon: <Activity className="text-blue-400" /> },
                                                    { name: 'Withings Scale', status: 'Disconnected', icon: <Smartphone className="text-gray-500" /> },
                                                ].map((app, i) => (
                                                    <div key={i} className="p-6 bg-[var(--muted)]/30 rounded-3xl border border-[var(--color-glass-border)] flex items-center justify-between group hover:bg-[var(--primary)]/5 transition-colors">
                                                        <div className="flex items-center gap-4">
                                                            <div className="p-3 bg-white rounded-2xl shadow-sm text-[var(--primary)]">
                                                                <LinkIcon size={20} />
                                                            </div>
                                                            <div>
                                                                <h4 className="font-bold">{app.name}</h4>
                                                                <p className={`text-[10px] font-black uppercase tracking-widest ${app.status === 'Connected' ? 'text-green-500' : 'text-[var(--secondary)]'}`}>
                                                                    {app.status}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <Button variant="ghost" size="sm" className="font-black text-[10px] uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                                                            {app.status === 'Connected' ? 'MANAGE' : 'CONNECT'}
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        </GlassCard>

                                        <GlassCard className="border-dashed border-2 flex flex-col items-center justify-center p-12 text-center space-y-4">
                                            <div className="p-4 bg-[var(--muted)] rounded-full text-[var(--secondary)]">
                                                <Zap size={32} />
                                            </div>
                                            <div>
                                                <h4 className="font-black text-lg">Suggest an Integration</h4>
                                                <p className="text-sm text-[var(--secondary)] max-w-sm">We are constantly expanding our ecosystem. Tell us which medical devices or apps you want to connect.</p>
                                            </div>
                                            <Button variant="outline" className="px-8 rounded-full font-black">SEND REQUEST</Button>
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


