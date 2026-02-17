export type TimeOfDay = 'morning' | 'day' | 'evening' | 'night';
export type AccessibilityMode = 'simple' | 'standard' | 'power';
export type ThemeMode = 'light' | 'dark';

export interface ThemeState {
    timeOfDay: TimeOfDay;
    accessibilityMode: AccessibilityMode;
    themeMode: ThemeMode;
    setTimeOfDay: (time: TimeOfDay) => void;
    setAccessibilityMode: (mode: AccessibilityMode) => void;
    setThemeMode: (mode: ThemeMode) => void;
}
