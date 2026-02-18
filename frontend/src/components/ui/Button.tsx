"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { useThemeStore } from "@/lib/store";
import { motion, HTMLMotionProps } from "framer-motion";

interface ButtonProps extends HTMLMotionProps<"button"> {
    variant?: "primary" | "secondary" | "outline" | "ghost";
    size?: "sm" | "md" | "lg" | "icon";
    children?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
        const { accessibilityMode } = useThemeStore();

        const baseStyles = "inline-flex items-center justify-center rounded-[1.25rem] font-black uppercase tracking-[0.1em] transition-all duration-500 focus:outline-none focus:ring-4 focus:ring-[var(--primary)]/20 disabled:opacity-50 disabled:pointer-events-none relative overflow-hidden group";

        const variants = {
            primary: "bg-[var(--primary)] text-black font-black shadow-[0_15px_40px_rgba(0,229,255,0.2)] hover:shadow-[0_20px_50px_rgba(0,229,255,0.4)] border border-white/20",
            secondary: "bg-white/5 text-[var(--foreground)] border border-white/10 hover:bg-white/10 shadow-xl backdrop-blur-xl",
            outline: "border border-white/20 text-[var(--foreground)] hover:bg-white/5 active:scale-95 backdrop-blur-md",
            ghost: "hover:bg-white/5 text-[var(--foreground)] active:opacity-70",
        };

        const sizes = {
            sm: "h-10 px-6 text-[10px]",
            md: "h-14 px-10 text-[11px]",
            lg: "h-18 px-14 text-[13px]",
            icon: "h-12 w-12",
        };

        return (
            <motion.button
                ref={ref}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                data-mode={accessibilityMode}
                className={cn(baseStyles, variants[variant], sizes[size], className)}
                {...props}
            >
                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="relative z-10">{children}</span>
            </motion.button>
        );
    }
);

Button.displayName = "Button";

export { Button };
