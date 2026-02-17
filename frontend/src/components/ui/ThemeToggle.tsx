"use client";

import { Moon, Sun } from "lucide-react";
import { useThemeStore } from "@/lib/store";

export function ThemeToggle() {
    const { themeMode, setThemeMode } = useThemeStore();

    const toggleTheme = async () => {
        const newMode = themeMode === 'light' ? 'dark' : 'light';
        setThemeMode(newMode);
        try {
            const { usersApi } = await import('@/lib/api');
            await usersApi.updateSettings({ uiMode: newMode });
        } catch (error) {
            console.error("Failed to persist theme preference:", error);
        }
    };

    return (
        <button
            onClick={toggleTheme}
            className="relative inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-glass-bg border border-glass-border backdrop-blur-md hover:scale-105 transition-all duration-300"
            aria-label={`Switch to ${themeMode === 'light' ? 'dark' : 'light'} mode`}
        >
            <div className="relative w-12 h-6 bg-muted rounded-full transition-colors">
                <div
                    className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-primary transition-transform duration-300 flex items-center justify-center ${themeMode === 'dark' ? 'translate-x-6' : 'translate-x-0'
                        }`}
                >
                    {themeMode === 'light' ? (
                        <Sun className="w-3 h-3 text-white" />
                    ) : (
                        <Moon className="w-3 h-3 text-white" />
                    )}
                </div>
            </div>
            <span className="text-sm font-medium text-foreground">
                {themeMode === 'light' ? 'Light' : 'Dark'} Mode
            </span>
        </button>
    );
}
