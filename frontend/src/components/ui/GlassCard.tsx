"use client";

import { cn } from "@/lib/utils";
import { HTMLMotionProps, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useState } from "react";

interface GlassCardProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode;
    className?: string;
    interactive?: boolean;
}

export function GlassCard({ children, className, interactive = true, ...props }: GlassCardProps) {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), { stiffness: 150, damping: 20 });
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), { stiffness: 150, damping: 20 });

    function onMouseMove(event: React.MouseEvent<HTMLDivElement>) {
        if (!interactive) return;
        const rect = event.currentTarget.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        mouseX.set(x);
        mouseY.set(y);
    }

    function onMouseLeave() {
        mouseX.set(0);
        mouseY.set(0);
    }

    return (
        <motion.div
            className={cn(
                "group relative rounded-[2.5rem] p-8 backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-[var(--color-glass-border)] bg-[var(--color-glass-bg)] overflow-hidden glass-transition",
                interactive && "perspective-card",
                className
            )}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            style={interactive ? { rotateX, rotateY, transformStyle: "preserve-3d" } : {}}
            {...props}
        >
            {/* Top Shine */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent z-20" />

            {/* Subtle Grid Pattern Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0"
                style={{
                    backgroundImage: `radial-gradient(var(--foreground) 0.5px, transparent 0.5px)`,
                    backgroundSize: '24px 24px'
                }}
            />

            {/* Dynamic Spotlight Effect */}
            <motion.div
                className="absolute inset-0 z-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-1000"
                style={{
                    background: useTransform(
                        [mouseX, mouseY],
                        ([x, y]) => `radial-gradient(600px circle at ${(x as number + 0.5) * 100}% ${(y as number + 0.5) * 100}%, var(--primary), transparent)`
                    ),
                    opacity: 0.05
                }}
            />

            <div className="relative z-10 h-full">
                {children}
            </div>
        </motion.div>
    );
}
