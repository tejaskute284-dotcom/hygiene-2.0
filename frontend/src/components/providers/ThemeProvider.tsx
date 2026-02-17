"use client";

import { useEffect, useState } from "react";
import { useThemeStore } from "@/lib/store";
import { TimeOfDay } from "@/lib/types";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const { timeOfDay, setTimeOfDay, accessibilityMode, themeMode } = useThemeStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // Wrap state updates in a macrotask/timeout to avoid React Compiler warnings about synchronous updates in effects
        const timer = setTimeout(() => {
            setMounted(true);
        }, 0);

        const hour = new Date().getHours();
        let initialTime: TimeOfDay = 'day';

        if (hour >= 5 && hour < 12) initialTime = 'morning';
        else if (hour >= 12 && hour < 17) initialTime = 'day';
        else if (hour >= 17 && hour < 21) initialTime = 'evening';
        else initialTime = 'night';

        setTimeOfDay(initialTime);

        const interval = setInterval(() => {
            const currentHour = new Date().getHours();
            let newTime: TimeOfDay = 'day';

            if (currentHour >= 5 && currentHour < 12) newTime = 'morning';
            else if (currentHour >= 12 && currentHour < 17) newTime = 'day';
            else if (currentHour >= 17 && currentHour < 21) newTime = 'evening';
            else newTime = 'night';

            if (newTime !== timeOfDay) {
                setTimeOfDay(newTime);
            }
        }, 60000);

        return () => {
            clearTimeout(timer);
            clearInterval(interval);
        };
    }, [setTimeOfDay, timeOfDay]);

    useEffect(() => {
        document.documentElement.setAttribute("data-time", timeOfDay);
        document.documentElement.setAttribute("data-mode", accessibilityMode);
        document.documentElement.setAttribute("data-theme", themeMode);

        // Also set class for easier CSS targeting
        if (themeMode === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [timeOfDay, accessibilityMode, themeMode, mounted]);

    // Prevent flash by showing children but with initial class if needed
    return (
        <div className="transition-opacity duration-300">
            {children}
        </div>
    );
}
