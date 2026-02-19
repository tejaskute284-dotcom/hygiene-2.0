"use client";

import { cn } from "@/lib/utils";
import { HTMLMotionProps, motion } from "framer-motion";

interface GlassCardProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode;
    className?: string;
    interactive?: boolean;
    variant?: "default" | "elevated" | "flat";
}

export function GlassCard({
    children,
    className,
    interactive = true,
    variant = "default",
    ...props
}: GlassCardProps) {

    const variants = {
        // Standard clay card — white in light, dark green surface in dark
        default: cn(
            "rounded-[2rem] overflow-hidden p-8",
            "bg-[var(--surface)]",
            "[box-shadow:var(--clay-shadow-md)]",
            "border border-[var(--clay-border)]",
        ),

        // More pronounced elevation
        elevated: cn(
            "rounded-[2.5rem] overflow-hidden p-8",
            "bg-[var(--surface)]",
            "[box-shadow:var(--clay-shadow-lg)]",
            "border border-[var(--clay-border)]",
        ),

        // Flat / inset — for nested content, no padding override
        flat: cn(
            "rounded-[1.25rem] overflow-hidden",
            "bg-[var(--muted)]",
            "[box-shadow:inset_0_2px_6px_rgba(0,0,0,0.06),inset_0_1px_2px_rgba(255,255,255,0.60)]",
            "border border-[var(--clay-border)]",
        ),
    };

    return (
        <motion.div
            className={cn(
                "relative glass-transition",
                variants[variant],
                interactive && [
                    "hover:-translate-y-1",
                    // Hover shadow — slightly stronger version of the variant shadow
                    variant === "flat"
                        ? ""
                        : "[&:hover]:[box-shadow:var(--clay-shadow-lg)]",
                ],
                className
            )}
            transition={{ duration: 0.2 }}
            {...props}
        >
            {/*
                Top edge highlight — the claymorphism "puffy" shine.
                Visible in light mode (white line on white card = subtle).
                In dark mode we use a slightly brighter rgba so it's still perceptible.
            */}
            <div
                className="absolute top-0 left-0 right-0 h-[1px] z-10 pointer-events-none"
                style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)" }}
            />

            {/* Very subtle dot-grid texture for depth */}
            <div
                className="absolute inset-0 pointer-events-none z-0 opacity-[0.03]"
                style={{
                    backgroundImage: "radial-gradient(var(--foreground) 0.5px, transparent 0.5px)",
                    backgroundSize: "22px 22px",
                }}
            />

            <div className="relative z-10 h-full">
                {children}
            </div>
        </motion.div>
    );
}
