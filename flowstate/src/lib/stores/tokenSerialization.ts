// src/lib/stores/tokenSerialization.ts
// Serialization and hydration logic for design tokens

import type { DesignTokens } from './designTokens.svelte';

export function exportTokensToJSON(tokens: DesignTokens): string {
    return JSON.stringify(tokens, null, 2);
}

export function importTokensFromJSON(json: string): DesignTokens | null {
    try {
        const parsed = JSON.parse(json);
        // Basic validation - could be expanded
        if (typeof parsed === 'object' && parsed !== null) {
            return parsed as DesignTokens;
        }
        return null;
    } catch {
        return null;
    }
}

export function hydrateTokensFromPartial(tokens: DesignTokens, partial: Partial<DesignTokens>): DesignTokens {
    // Merge typography with fallbacks for new fields
    const mergedTypography = {
        ...tokens.typography,
        ...partial.typography,
        // Ensure new fields have defaults if missing from old saved data
        buttonFontFamily: partial.typography?.buttonFontFamily || tokens.typography.buttonFontFamily,
        headings: {
            ...tokens.typography.headings,
            ...partial.typography?.headings
        }
    };

    return {
        ...tokens,
        ...partial,
        // Deep merge nested objects
        colors: { ...tokens.colors, ...partial.colors },
        typography: mergedTypography,
        buttons: { ...tokens.buttons, ...partial.buttons },
        buttonVariants: {
            ...tokens.buttonVariants,
            ...partial.buttonVariants
        },
        colorVariables: partial.colorVariables || tokens.colorVariables,
        lockedColors: { ...tokens.lockedColors, ...partial.lockedColors },
        enabledButtonVariants: { ...tokens.enabledButtonVariants, ...partial.enabledButtonVariants },
        enabledButtonSizes: { ...tokens.enabledButtonSizes, ...partial.enabledButtonSizes }
    };
}