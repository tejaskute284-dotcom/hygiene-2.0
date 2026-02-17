"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Lock, Mail, ArrowRight, Fingerprint, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { login, verify2FA, setSession } from "@/lib/auth-actions";
import { useRouter } from "next/navigation";

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
        <div className="min-h-screen flex items-center justify-center bg-[var(--background)] relative overflow-hidden">
            {/* Dynamic Background Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--primary)] opacity-10 blur-[100px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500 opacity-10 blur-[100px] rounded-full" />

            <motion.div
                initial={false}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md px-6 relative z-10"
            >
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center p-4 bg-[var(--muted)] rounded-3xl mb-4 text-[var(--primary)] shadow-2xl shadow-[var(--primary)]/10">
                        <Shield size={40} />
                    </div>
                    <h1 className="text-3xl font-black tracking-tight">Synapse Care OS</h1>
                    <p className="text-[var(--secondary)] mt-2 font-medium">Secure Identity & Health Intelligence</p>
                </div>

                <GlassCard className="p-8 border-[var(--color-glass-border)] ring-1 ring-white/10">
                    <AnimatePresence mode="wait">
                        {stage === "login" ? (
                            <motion.form
                                key="login-stage"
                                initial={false}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                onSubmit={handleLogin}
                                className="space-y-6"
                            >
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-[var(--secondary)]">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--secondary)]" size={18} />
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-[var(--muted)] border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-[var(--primary)] transition-all font-medium outline-none"
                                            placeholder="tejas@synapse.care"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-[var(--secondary)]">Secure Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--secondary)]" size={18} />
                                        <input
                                            type="password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full bg-[var(--muted)] border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-[var(--primary)] transition-all font-medium outline-none"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="flex items-center gap-2 p-3 bg-red-500/10 text-red-500 rounded-xl border border-red-500/20 text-sm font-bold"
                                    >
                                        <AlertCircle size={16} />
                                        {error}
                                    </motion.div>
                                )}

                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-6 rounded-2xl text-lg font-black tracking-wide shadow-xl shadow-[var(--primary)]/20 active:scale-95 transition-transform"
                                >
                                    {loading ? <Loader2 className="animate-spin" /> : <>Sign In <ArrowRight className="ml-2" size={20} /></>}
                                </Button>
                            </motion.form>
                        ) : (
                            <motion.form
                                key="2fa-stage"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                onSubmit={handleVerify2FA}
                                className="space-y-6"
                            >
                                <div className="text-center space-y-2 mb-4">
                                    <div className="inline-flex p-3 bg-blue-500/10 text-blue-500 rounded-2xl mb-2">
                                        <Fingerprint size={32} />
                                    </div>
                                    <h3 className="text-xl font-black">Two-Step Verification</h3>
                                    <p className="text-sm text-[var(--secondary)] font-medium"> Enter the 6-digit code from your authenticator app.</p>
                                </div>

                                <input
                                    type="text"
                                    required
                                    autoFocus
                                    maxLength={6}
                                    value={twoFacCode}
                                    onChange={(e) => setTwoFacCode(e.target.value.replace(/\D/g, ""))}
                                    className="w-full bg-[var(--muted)] border-none rounded-3xl py-6 text-center text-4xl font-black tracking-[0.5em] focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                                    placeholder="000000"
                                />

                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="flex items-center gap-2 p-3 bg-red-500/10 text-red-500 rounded-xl border border-red-500/20 text-sm font-bold"
                                    >
                                        <AlertCircle size={16} />
                                        {error}
                                    </motion.div>
                                )}

                                <Button
                                    type="submit"
                                    disabled={loading || twoFacCode.length !== 6}
                                    className="w-full py-6 rounded-2xl text-lg font-black tracking-wide bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-500/20"
                                >
                                    {loading ? <Loader2 className="animate-spin" /> : "Verify Identity"}
                                </Button>

                                <button
                                    type="button"
                                    onClick={() => setStage("login")}
                                    className="w-full text-xs font-black uppercase tracking-widest text-[var(--secondary)] hover:text-[var(--foreground)] transition-colors"
                                >
                                    Back to Sign In
                                </button>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </GlassCard>

                <p className="text-center mt-8 text-xs text-[var(--secondary)] font-medium">
                    Protected by AES-256 Multi-Layer Encryption & HIPAA Compliant Tunneling.
                </p>
            </motion.div>
        </div>
    );
}
