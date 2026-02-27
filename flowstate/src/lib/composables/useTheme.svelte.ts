// src/lib/composables/useTheme.svelte.ts
// Composable for theme-related functionality
import { designTokens } from '../stores/designTokens.svelte';

export function useTheme() {
    const isDark = $derived(designTokens.tokens.themeMode === "dark");
    const themeMode = $derived(designTokens.tokens.themeMode);

    return {
        isDark,
        themeMode
    };
}