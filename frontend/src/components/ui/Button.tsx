import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { useThemeStore } from "@/lib/store";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost";
    size?: "sm" | "md" | "lg" | "icon";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", ...props }, ref) => {
        const { accessibilityMode } = useThemeStore();

        // Map accessibility modes to sizes if needed, but primarily handle via CSS variables or classes
        const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary)] disabled:opacity-50 disabled:pointer-events-none data-[mode=simple]:p-6 data-[mode=simple]:text-lg";

        const variants = {
            primary: "bg-gradient-to-tr from-[var(--primary)] to-[var(--accent)] text-white hover:brightness-110 shadow-lg shadow-[var(--primary)]/20 active:scale-95 transition-all duration-300",
            secondary: "bg-[var(--secondary)] text-white hover:opacity-90 active:scale-95 transition-all",
            outline: "border-2 border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white active:scale-95 transition-all",
            ghost: "hover:bg-[var(--muted)] text-[var(--foreground)] active:opacity-70 transition-all",
        };

        const sizes = {
            sm: "h-8 px-3 text-sm",
            md: "h-10 px-4 py-2",
            lg: "h-12 px-6 text-lg",
            icon: "h-10 w-10",
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
