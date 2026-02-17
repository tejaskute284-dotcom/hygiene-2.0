"use client";

import { cn } from "@/lib/utils";
import { HTMLMotionProps, motion } from "framer-motion";

interface GlassCardProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode;
    className?: string;
}

export function GlassCard({ children, className, ...props }: GlassCardProps) {
    return (
        <motion.div
            className={cn(
                "group relative rounded-[32px] p-8 backdrop-blur-xl shadow-2xl border border-[var(--color-glass-border)] bg-[var(--color-glass-bg)] overflow-hidden",
                className
            )}
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            transition={{ duration: 0.5 }}
            {...props}
        >
            {/* Inner Glow Shine Effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
            </div>

            <div className="relative z-10">
                {children}
            </div>
        </motion.div>
    );
}
