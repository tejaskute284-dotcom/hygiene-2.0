"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Mail, Lock, User, Calendar, ArrowRight, AlertCircle, Loader2, CheckCircle2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { register, setSession } from "@/lib/auth-actions";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        firstName: "",
        lastName: "",
        dateOfBirth: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        try {
            const res = await register({
                email: formData.email,
                password: formData.password,
                firstName: formData.firstName,
                lastName: formData.lastName,
                dateOfBirth: formData.dateOfBirth,
            });

            setSuccess(true);
            setTimeout(() => {
                setSession(res);
                router.push("/");
            }, 2000);
        } catch (err: any) {
            setError(err.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden font-sans py-20">
            {/* aurora background effects */}
            <div className="aurora-bg" />
            <div className="aurora-orb w-[600px] h-[600px] bg-primary/20 top-[-200px] left-[-100px]" />
            <div className="aurora-orb w-[500px] h-[500px] bg-secondary/20 bottom-[-100px] right-[-100px] animation-delay-2000" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-2xl px-6 relative z-10"
            >
                <div className="text-center mb-10">
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center justify-center p-6 bg-white rounded-[2rem] mb-6 text-primary shadow-clay border-2 border-white/50"
                    >
                        <Shield className="w-12 h-12" />
                    </motion.div>
                    <h1 className="text-section mb-2">Initialize Your Health ID</h1>
                    <p className="text-subhead font-medium">Create a secure Synapse Care account</p>
                </div>

                <GlassCard variant="clay" className="!p-10 shadow-2xl relative overflow-visible">
                    <div className="absolute -top-12 -left-12 w-24 h-24 bg-sky-100/50 rounded-full blur-2xl" />
                    <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-emerald-100/50 rounded-full blur-2xl" />
                    <AnimatePresence mode="wait">
                        {success ? (
                            <motion.div
                                key="success-stage"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-10 space-y-6"
                            >
                                <div className="inline-flex p-6 bg-emerald-500/10 text-emerald-500 rounded-full mb-4">
                                    <CheckCircle2 className="w-16 h-16" />
                                </div>
                                <h2 className="text-3xl font-black text-slate-900">Identity Established</h2>
                                <p className="text-slate-500">Your secure profile has been created. Syncing session...</p>
                                <Loader2 className="w-8 h-8 mx-auto animate-spin text-primary" />
                            </motion.div>
                        ) : (
                            <motion.form
                                key="register-form"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                onSubmit={handleRegister}
                                className="space-y-6"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black ml-2 text-slate-400 uppercase tracking-[0.2em]">First Name</label>
                                        <div className="relative group">
                                            <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={18} />
                                            <input
                                                name="firstName"
                                                required
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                className="w-full bg-sky-50/50 border-none rounded-2xl py-5 pl-14 pr-6 font-black outline-none focus:ring-4 focus:ring-primary/10 transition-all shadow-clay placeholder:text-slate-200"
                                                placeholder="Tejas"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black ml-2 text-slate-400 uppercase tracking-[0.2em]">Last Name</label>
                                        <div className="relative group">
                                            <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={18} />
                                            <input
                                                name="lastName"
                                                required
                                                value={formData.lastName}
                                                onChange={handleChange}
                                                className="w-full bg-sky-50/50 border-none rounded-2xl py-5 pl-14 pr-6 font-black outline-none focus:ring-4 focus:ring-primary/10 transition-all shadow-clay placeholder:text-slate-200"
                                                placeholder="Kute"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black ml-2 text-slate-400 uppercase tracking-[0.2em]">Email Address</label>
                                        <div className="relative group">
                                            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={18} />
                                            <input
                                                name="email"
                                                type="email"
                                                required
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="w-full bg-sky-50/50 border-none rounded-2xl py-5 pl-14 pr-6 font-black outline-none focus:ring-4 focus:ring-primary/10 transition-all shadow-clay placeholder:text-slate-200"
                                                placeholder="tejas@synapse.care"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black ml-2 text-slate-400 uppercase tracking-[0.2em]">Date of Birth</label>
                                        <div className="relative group">
                                            <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={18} />
                                            <input
                                                name="dateOfBirth"
                                                type="date"
                                                required
                                                value={formData.dateOfBirth}
                                                onChange={handleChange}
                                                className="w-full bg-sky-50/50 border-none rounded-2xl py-5 pl-14 pr-6 font-black outline-none focus:ring-4 focus:ring-primary/10 transition-all shadow-clay text-slate-600"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black ml-2 text-slate-400 uppercase tracking-[0.2em]">Secure Password</label>
                                    <div className="relative group">
                                        <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={18} />
                                        <input
                                            name="password"
                                            type="password"
                                            required
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="w-full bg-sky-50/50 border-none rounded-2xl py-5 pl-14 pr-6 font-black outline-none focus:ring-4 focus:ring-primary/10 transition-all shadow-clay placeholder:text-slate-200"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black ml-2 text-slate-400 uppercase tracking-[0.2em]">Confirm Password</label>
                                    <div className="relative group">
                                        <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={18} />
                                        <input
                                            name="confirmPassword"
                                            type="password"
                                            required
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            className="w-full bg-sky-50/50 border-none rounded-2xl py-5 pl-14 pr-6 font-black outline-none focus:ring-4 focus:ring-primary/10 transition-all shadow-clay placeholder:text-slate-200"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex items-center gap-3 p-5 bg-amber-50 text-amber-600 rounded-2xl border border-white shadow-clay text-sm font-black uppercase tracking-tight"
                                    >
                                        <AlertCircle size={20} />
                                        {error}
                                    </motion.div>
                                )}

                                <div className="flex flex-col gap-4 pt-4">
                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        variant="primary"
                                        className="w-full py-7 rounded-2xl text-lg shadow-primary/20 font-black uppercase tracking-widest"
                                    >
                                        {loading ? <Loader2 className="animate-spin" /> : <>Create Account <ArrowRight className="ml-2 w-5 h-5" /></>}
                                    </Button>

                                    <Link href="/login" className="w-full">
                                        <Button
                                            type="button"
                                            variant="clay"
                                            className="w-full py-7 rounded-2xl text-slate-400 hover:text-primary transition-all shadow-clay"
                                        >
                                            <ArrowLeft className="mr-2 w-4 h-4" /> Already have an ID? Sign In
                                        </Button>
                                    </Link>
                                </div>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </GlassCard>

                <p className="text-center mt-12 text-[10px] text-slate-500 dark:text-slate-500 font-bold uppercase tracking-[0.2em] opacity-60">
                    Protected by AES-256 Multi-Layer Encryption & HIPAA Compliant Tunneling
                </p>
            </motion.div>
        </div>
    );
}
