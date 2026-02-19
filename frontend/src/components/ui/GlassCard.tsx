"use client";

import { cn } from "@/lib/utils";
import { HTMLMotionProps, motion } from "framer-motion";

interface GlassCardProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode;
    className?: string;
    variant?: "glass" | "clay";
}

export function GlassCard({ children, className, variant = "glass", ...props }: GlassCardProps) {
    return (
        <motion.div
            className={cn(
                variant === "glass" ? "glass-card" : "clay-card",
                "group relative p-8 glass-transition overflow-hidden",
                className
            )}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -8, scale: 1.01 }}
            transition={{
                duration: 0.5,
                ease: [0.4, 0, 0.2, 1]
            }}
            {...props}
        >
            {/* Inner Glow Shine Effect - Refined */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
            </div>

            <div className="relative z-10">
                {children}
            </div>

            {/* Subtle bottom highlight */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </motion.div>
    );
}
