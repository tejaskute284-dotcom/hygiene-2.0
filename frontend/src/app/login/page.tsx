"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Lock, Mail, ArrowRight, Fingerprint, AlertCircle, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { login, verify2FA, setSession } from "@/lib/auth-actions";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
    const router = useRouter();
    const [stage, setStage] = useState<"login" | "2fa">("login");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [twoFacCode, setTwoFacCode] = useState("");
    const [tempUserId, setTempUserId] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await login(email, password);

            if (res.isTwoFactorRequired) {
                setTempUserId(res.userId!);
                setStage("2fa");
            } else {
                setSession({
                    accessToken: res.accessToken!,
                    refreshToken: res.refreshToken!,
                    user: res.user!,
                });
                router.push("/");
            }
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    const handleVerify2FA = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const auth = await verify2FA(tempUserId!, twoFacCode);
            setSession(auth);
            router.push("/");
        } catch (err: any) {
            setError(err.message || "Invalid security code");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden font-sans">
            {/* aurora background effects */}
            <div className="aurora-bg" />
            <div className="aurora-orb w-[600px] h-[600px] bg-primary/20 top-[-200px] left-[-100px]" />
            <div className="aurora-orb w-[500px] h-[500px] bg-secondary/20 bottom-[-100px] right-[-100px] animation-delay-2000" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-lg px-6 relative z-10"
            >
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center justify-center p-6 bg-white rounded-[2rem] mb-6 text-primary shadow-clay border-2 border-white/50"
                    >
                        <Shield className="w-12 h-12" />
                    </motion.div>
                    <h1 className="text-section mb-2">Synapse Care OS</h1>
                    <p className="text-subhead font-medium">Secure Identity & Health Intelligence</p>
                </div>

                <GlassCard variant="clay" className="!p-10 shadow-2xl relative overflow-visible">
                    <div className="absolute -top-12 -left-12 w-24 h-24 bg-sky-100/50 rounded-full blur-2xl" />
                    <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-emerald-100/50 rounded-full blur-2xl" />
                    <AnimatePresence mode="wait">
                        {stage === "login" ? (
                            <motion.form
                                key="login-stage"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.5, ease: "anticipate" }}
                                onSubmit={handleLogin}
                                className="space-y-8"
                            >
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black ml-2 text-slate-400 uppercase tracking-[0.2em]">EMAIL ADDRESS</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={20} />
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-sky-50/50 border-none rounded-2xl py-5 pl-16 pr-6 font-black outline-none focus:ring-4 focus:ring-primary/10 text-lg transition-all shadow-clay placeholder:text-slate-200"
                                            placeholder="tejas@synapse.care"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black ml-2 text-slate-400 uppercase tracking-[0.2em]">SECURE PASSWORD</label>
                                    <div className="relative group">
                                        <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={20} />
                                        <input
                                            type="password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full bg-sky-50/50 border-none rounded-2xl py-5 pl-16 pr-6 font-black outline-none focus:ring-4 focus:ring-primary/10 text-lg transition-all shadow-clay placeholder:text-slate-200"
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

                                <Button
                                    type="submit"
                                    disabled={loading}
                                    variant="primary"
                                    className="w-full py-7 rounded-2xl text-lg shadow-primary/20 font-black uppercase tracking-widest"
                                >
                                    {loading ? <Loader2 className="animate-spin" /> : <>Sign In <ArrowRight className="ml-2 w-5 h-5" /></>}
                                </Button>

                                <div className="text-center">
                                    <Link href="/register" className="text-xs font-bold tracking-widest text-slate-500 hover:text-primary transition-colors uppercase">
                                        New to IHMS? Create high-fidelity account
                                    </Link>
                                </div>
                            </motion.form>
                        ) : (
                            <motion.form
                                key="2fa-stage"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.5, ease: "anticipate" }}
                                onSubmit={handleVerify2FA}
                                className="space-y-10"
                            >
                                <div className="text-center space-y-3 mb-4">
                                    <div className="inline-flex p-6 bg-white text-emerald-500 rounded-[2rem] mb-4 shadow-clay border-2 border-white/50">
                                        <Fingerprint className="w-10 h-10" />
                                    </div>
                                    <h3 className="text-headline">Two-Step Verification</h3>
                                    <p className="text-subhead text-sm font-medium">Enter the 6-digit code from your authenticator app.</p>
                                </div>

                                <div className="relative">
                                    <input
                                        type="text"
                                        required
                                        autoFocus
                                        maxLength={6}
                                        value={twoFacCode}
                                        onChange={(e) => setTwoFacCode(e.target.value.replace(/\D/g, ""))}
                                        className="w-full bg-sky-50/50 border-none rounded-[2rem] py-8 text-center text-5xl font-black tracking-[0.4em] outline-none focus:ring-4 focus:ring-emerald-400/10 transition-all font-mono shadow-clay text-emerald-600 placeholder:text-slate-100"
                                        placeholder="000000"
                                    />
                                    {twoFacCode.length === 6 && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute right-8 top-1/2 -translate-y-1/2 text-emerald-500"
                                        >
                                            <CheckCircle2 className="w-10 h-10" />
                                        </motion.div>
                                    )}
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

                                <div className="space-y-4">
                                    <Button
                                        type="submit"
                                        disabled={loading || twoFacCode.length !== 6}
                                        variant="secondary"
                                        className="w-full py-7 rounded-2xl text-lg shadow-emerald-400/20 font-black uppercase tracking-widest bg-emerald-400 hover:bg-emerald-500"
                                    >
                                        {loading ? <Loader2 className="animate-spin" /> : "Verify Identity"}
                                    </Button>

                                    <button
                                        type="button"
                                        onClick={() => setStage("login")}
                                        className="w-full text-xs font-bold tracking-widest text-slate-500 hover:text-foreground transition-colors uppercase py-2"
                                    >
                                        Back to Sign In
                                    </button>
                                </div>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </GlassCard>

                <p className="text-center mt-12 text-[10px] text-slate-500 dark:text-slate-500 font-bold uppercase tracking-[0.2em] opacity-60">
                    Protected by AES-256 Multi-Layer Encryption & HIPAA Compliant Tunneling
                </p>
            </motion.div>
        </div >
    );
}
