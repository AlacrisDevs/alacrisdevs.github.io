// src/lib/composables/useSettings.svelte.ts
// Composable for settings management
import { settingsStore } from '../stores/settingsStore.svelte';
import { designTokens } from '../stores/designTokens.svelte';

export function useSettings() {
    const settings = $derived(settingsStore.settings);
    const isDark = $derived(designTokens.tokens.themeMode === "dark");

    const setLanguage = (lang: string) => {
        settingsStore.setLanguage(lang);
    };

    const setUnit = (unit: "px" | "rem") => {
        settingsStore.setUnit(unit);
        designTokens.setUnit(unit);
    };

    const setThemeSpecificLocks = (enabled: boolean) => {
        settingsStore.setThemeSpecificLocks(enabled);
    };

    return {
        settings,
        isDark,
        setLanguage,
        setUnit,
        setThemeSpecificLocks
    };
}