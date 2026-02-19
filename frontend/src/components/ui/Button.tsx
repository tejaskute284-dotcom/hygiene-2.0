import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { useThemeStore } from "@/lib/store";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost" | "clay";
    size?: "sm" | "md" | "lg" | "icon";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", ...props }, ref) => {
        const { accessibilityMode } = useThemeStore();

        const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-95 cursor-pointer";

        const variants = {
            primary: "bg-primary text-white clay-button",
            secondary: "bg-secondary text-white clay-button",
            outline: "border-2 border-primary text-primary rounded-[var(--radius-2xl)] hover:bg-primary/5 transition-all focus:ring-primary",
            ghost: "hover:bg-muted text-foreground rounded-[var(--radius-2xl)]",
            clay: "bg-white text-primary shadow-clay border-2 border-white/50 hover:shadow-inner hover:translate-y-0.5 transition-all",
        };

        const sizes = {
            sm: "h-9 px-4 text-xs font-bold uppercase tracking-wider rounded-[var(--radius-xl)]",
            md: "h-12 px-8 text-sm font-black uppercase tracking-widest rounded-[var(--radius-2xl)]",
            lg: "h-16 px-10 text-base font-black uppercase tracking-widest rounded-[var(--radius-2xl)]",
            icon: "h-12 w-12 rounded-2xl",
        };

        return (
            <button
                ref={ref}
                data-mode={accessibilityMode}
                className={cn(baseStyles, variants[variant], sizes[size], className)}
                {...props}
            />
        );
    }
);

Button.displayName = "Button";

export { Button };
