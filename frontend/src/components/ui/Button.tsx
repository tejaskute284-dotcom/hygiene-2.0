"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

interface ButtonProps extends HTMLMotionProps<"button"> {
    variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
    size?: "sm" | "md" | "lg" | "icon" | "icon-sm";
    children?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", children, ...props }, ref) => {

        const baseStyles = [
            "inline-flex items-center justify-center gap-2",
            "font-bold tracking-wide",
            "transition-all duration-200 ease-out",
            "focus:outline-none focus-visible:ring-4 focus-visible:ring-[var(--primary)]/30",
            "disabled:opacity-50 disabled:pointer-events-none",
            "select-none cursor-pointer",
            "clay-btn",
        ].join(" ");

        const variants = {
            // Soft green — primary medical action (take med, confirm, save)
            primary: [
                "bg-[var(--primary)] text-white",
                "border border-[var(--primary-dark)]/30",
                "[box-shadow:0_6px_20px_rgba(34,197,94,0.25),_0_2px_6px_rgba(34,197,94,0.15),_inset_0_2px_4px_rgba(255,255,255,0.35)]",
                "hover:[box-shadow:0_10px_28px_rgba(34,197,94,0.30),_0_4px_10px_rgba(34,197,94,0.20),_inset_0_2px_4px_rgba(255,255,255,0.35)]",
                "active:[box-shadow:inset_0_3px_8px_rgba(0,0,0,0.15)] active:translate-y-[1px]",
            ].join(" "),

            // Sky blue — info/secondary actions (view, navigate, filter)
            secondary: [
                "bg-[var(--secondary)] text-white",
                "border border-[var(--secondary-dark)]/30",
                "[box-shadow:0_6px_20px_rgba(14,165,233,0.22),_0_2px_6px_rgba(14,165,233,0.12),_inset_0_2px_4px_rgba(255,255,255,0.35)]",
                "hover:[box-shadow:0_10px_28px_rgba(14,165,233,0.28),_0_4px_10px_rgba(14,165,233,0.18),_inset_0_2px_4px_rgba(255,255,255,0.35)]",
                "active:[box-shadow:inset_0_3px_8px_rgba(0,0,0,0.15)] active:translate-y-[1px]",
            ].join(" "),

            // Soft white clay — ghost/surface actions (cancel, close, back)
            ghost: [
                "bg-white text-[var(--foreground)]",
                "border border-[var(--clay-border)]",
                "[box-shadow:var(--clay-shadow-sm)]",
                "hover:[box-shadow:var(--clay-shadow-md)] hover:bg-[var(--muted)]",
                "active:[box-shadow:var(--clay-shadow-active)] active:translate-y-[1px]",
            ].join(" "),

            // Outlined variant
            outline: [
                "bg-transparent text-[var(--primary)]",
                "border-2 border-[var(--primary)]",
                "shadow-none",
                "hover:bg-[var(--primary-light)] hover:shadow-md",
                "active:scale-[0.98]",
            ].join(" "),

            // Red ONLY for genuine emergencies (delete, critical alert, abort)
            danger: [
                "bg-[var(--emergency)] text-white",
                "border border-red-600/30",
                "[box-shadow:0_6px_20px_rgba(239,68,68,0.22),_0_2px_6px_rgba(239,68,68,0.12),_inset_0_2px_4px_rgba(255,255,255,0.30)]",
                "hover:[box-shadow:0_10px_28px_rgba(239,68,68,0.30),_0_4px_10px_rgba(239,68,68,0.18),_inset_0_2px_4px_rgba(255,255,255,0.30)]",
                "active:[box-shadow:inset_0_3px_8px_rgba(0,0,0,0.15)] active:translate-y-[1px]",
            ].join(" "),
        };

        const sizes = {
            sm: "h-9 px-5 text-xs rounded-2xl",
            md: "h-11 px-7 text-sm rounded-[1.25rem]",
            lg: "h-14 px-10 text-base rounded-[1.5rem]",
            icon: "h-11 w-11 rounded-2xl",
            "icon-sm": "h-9 w-9 rounded-xl",
        };

        return (
            <motion.button
                ref={ref}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.97, y: 1 }}
                className={cn(baseStyles, variants[variant], sizes[size], className)}
                {...props}
            >
                {children}
            </motion.button>
        );
    }
);

Button.displayName = "Button";
export { Button };
