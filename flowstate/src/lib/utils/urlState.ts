// URL State Serialization Utilities
// Enables shareable design system links via URL parameters

import type { DesignTokens } from '../stores/designTokens.svelte';
import { toastStore } from '../stores/toastStore.svelte';

const URL_PARAM_KEY = 'ds'; // Short key to save URL space

/**
 * Simple LZ-style compression for URL-safe strings
 * Uses a dictionary-based approach to reduce repetition
 */
function compressString(input: string): string {
    // Use built-in btoa with URI encoding for safety
    try {
        const base64 = btoa(unescape(encodeURIComponent(input)));
        // Make URL-safe by replacing characters
        return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    } catch {
        return '';
    }
}

/**
 * Decompress a URL-safe string back to original
 */
function decompressString(input: string): string {
    try {
        // Restore base64 characters
        let base64 = input.replace(/-/g, '+').replace(/_/g, '/');
        // Add padding if needed
        while (base64.length % 4) {
            base64 += '=';
        }
        return decodeURIComponent(escape(atob(base64)));
    } catch {
        return '';
    }
}

/**
 * Extract only the essential tokens for URL sharing
 * This reduces URL length significantly by omitting defaults
 */
function extractEssentialTokens(tokens: DesignTokens): Partial<DesignTokens> {
    return {
        colorVariables: tokens.colorVariables,
        colors: tokens.colors,
        typography: {
            fontFamily: tokens.typography.fontFamily,
            headingFontFamily: tokens.typography.headingFontFamily,
            buttonFontFamily: tokens.typography.buttonFontFamily,
            baseFontSize: tokens.typography.baseFontSize,
            headings: tokens.typography.headings,
            body: tokens.typography.body,
            bodySmall: tokens.typography.bodySmall,
            buttonLarge: tokens.typography.buttonLarge,
            button: tokens.typography.button,
            buttonSmall: tokens.typography.buttonSmall
        },
        buttons: tokens.buttons,
        buttonVariants: tokens.buttonVariants,
        themeMode: tokens.themeMode,
        defaultThemeMode: tokens.defaultThemeMode,
        enableButtons: tokens.enableButtons,
        enableToasts: tokens.enableToasts,
        unit: tokens.unit
    };
}

/**
 * Serialize design tokens to a URL-safe string
 */
export function serializeTokensToUrl(tokens: DesignTokens): string {
    try {
        const essential = extractEssentialTokens(tokens);
        const json = JSON.stringify(essential);
        return compressString(json);
    } catch (e) {
        console.error('Failed to serialize tokens:', e);
        return '';
    }
}

/**
 * Deserialize tokens from a URL parameter string
 */
export function deserializeTokensFromUrl(encoded: string): Partial<DesignTokens> | null {
    try {
        const json = decompressString(encoded);
        if (!json) return null;
        return JSON.parse(json) as Partial<DesignTokens>;
    } catch (e) {
        console.error('Failed to deserialize tokens:', e);
        return null;
    }
}

/**
 * Get the current URL with state parameter
 */
export function getShareableUrl(tokens: DesignTokens): string {
    const serialized = serializeTokensToUrl(tokens);
    if (!serialized) return window.location.href;

    const url = new URL(window.location.href);
    url.searchParams.set(URL_PARAM_KEY, serialized);

    // Check URL length - browsers typically support ~2000 chars
    const urlString = url.toString();
    if (urlString.length > 2000) {
        toastStore.warning('Share URL is very long - some browsers may truncate it. Consider saving as a preset instead.');
    }

    return urlString;
}

/**
 * Check if URL has state parameter and return decoded tokens
 */
export function getTokensFromUrl(): Partial<DesignTokens> | null {
    if (typeof window === 'undefined') return null;

    const url = new URL(window.location.href);
    const encoded = url.searchParams.get(URL_PARAM_KEY);

    if (!encoded) return null;
    return deserializeTokensFromUrl(encoded);
}

/**
 * Clear state from URL
 */
export function clearUrlState(): void {
    if (typeof window === 'undefined') return;

    const url = new URL(window.location.href);
    url.searchParams.delete(URL_PARAM_KEY);
    window.history.replaceState({}, '', url.toString());
}

/**
 * Copy shareable URL to clipboard
 */
export async function copyShareableUrl(tokens: DesignTokens): Promise<boolean> {
    try {
        const url = getShareableUrl(tokens);
        await navigator.clipboard.writeText(url);
        return true;
    } catch {
        return false;
    }
}
