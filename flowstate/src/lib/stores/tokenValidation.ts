// src/lib/stores/tokenValidation.ts
// Pure validation functions for design tokens

import type { ColorVariable, TypographyToken, ButtonSizeTokens, ButtonVariantTokens } from './designTokens.svelte';

export function validateHexColor(value: string): boolean {
    // Accept hex colors (#RRGGBB) or rgba colors (rgba(r,g,b,a))
    return /^#[0-9A-F]{6}$/i.test(value) ||
           /^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(?:,\s*[0-9]*\.?[0-9]+\s*)?\)$/i.test(value);
}

export function validateColorVariable(variable: Partial<ColorVariable>): boolean {
    return !!variable.id && !!variable.name && validateHexColor(variable.value || '');
}

export function validateTypographyToken(token: Partial<TypographyToken>): boolean {
    return !!token.name && !!token.fontFamily && !!token.fontSize && !!token.fontWeight;
}

export function validateButtonSizeTokens(tokens: Partial<ButtonSizeTokens>): boolean {
    return typeof tokens.paddingX === 'string' && typeof tokens.paddingY === 'string';
}

export function validateButtonVariantTokens(tokens: Partial<ButtonVariantTokens>): boolean {
    return typeof tokens.bgColor === 'string';
}