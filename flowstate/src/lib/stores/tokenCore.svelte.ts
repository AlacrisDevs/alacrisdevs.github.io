// src/lib/stores/tokenCore.svelte.ts
// Core design tokens store with basic state management

import { settingsStore } from './settingsStore.svelte';
import { toastStore } from './toastStore.svelte';
import type { DesignTokens, ColorVariable, TypographyToken, ButtonSizeTokens, ButtonVariantTokens } from './designTokens.svelte';
import { validateHexColor } from './tokenValidation';
import { exportTokensToJSON, importTokensFromJSON, hydrateTokensFromPartial } from './tokenSerialization';
import { withPerformanceMonitoring } from '../utils/performance';
import { lightenColor, darkenColor, colorWithOpacity } from '../utils/colorUtils';

// Unit conversion utilities
const BASE_FONT_SIZE = 16; // 1rem = 16px

function pxToRem(value: string): string {
    const match = value.match(/^([\d.]+)px$/);
    if (match) {
        const px = parseFloat(match[1]);
        const rem = px / BASE_FONT_SIZE;
        return `${rem}rem`;
    }
    return value;
}

function remToPx(value: string): string {
    const match = value.match(/^([\d.]+)rem$/);
    if (match) {
        const rem = parseFloat(match[1]);
        const px = rem * BASE_FONT_SIZE;
        return `${px}px`;
    }
    return value;
}

function convertUnit(value: string, toUnit: 'px' | 'rem'): string {
    if (toUnit === 'rem') {
        return pxToRem(value);
    } else {
        return remToPx(value);
    }
}

export class TokenCoreStore {
    tokens = $state<DesignTokens>(structuredClone(defaultTokens));

    constructor() {
        // Initialize with defaults
    }

    getDefaultTokens(): DesignTokens {
        return structuredClone(defaultTokens);
    }

    private triggerUpdate() {
        this.tokens = { ...this.tokens };
    }

    // Color methods
    updateColor = withPerformanceMonitoring('updateColor', (key: keyof DesignTokens['colors'], value: string) => {
        if (!validateHexColor(value)) {
            toastStore.error(`Invalid color format for ${key}`);
            return;
        }
        this.tokens.colors = { ...this.tokens.colors, [key]: value.toUpperCase() };
    });

    // Color Variable Methods
    addColorVariable(name: string, value: string): string {
        if (!validateHexColor(value)) {
            toastStore.error('Invalid color format');
            return '';
        }
        const id = `var_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        this.tokens.colorVariables = [
            ...this.tokens.colorVariables,
            { id, name, value: value.toUpperCase() }
        ];
        return id;
    }

    updateColorVariable(id: string, updates: Partial<Omit<ColorVariable, 'id'>>) {
        if (updates.value && !validateHexColor(updates.value)) {
            toastStore.error('Invalid color format');
            return;
        }
        if (updates.value) {
            updates.value = updates.value.toUpperCase();
        }
        this.tokens.colorVariables = this.tokens.colorVariables.map(v =>
            v.id === id ? { ...v, ...updates } : v
        );
    }

    deleteColorVariable(id: string) {
        this.tokens.colorVariables = this.tokens.colorVariables.filter(v => v.id !== id);
    }

    getColorVariableValue(idOrValue: string): string {
        if (idOrValue.startsWith('$')) {
            const varId = idOrValue.slice(1);
            const variable = this.tokens.colorVariables.find(v => v.id === varId);
            return variable?.value || idOrValue;
        }
        return idOrValue;
    }

    // Lock methods
    toggleColorLock(id: string) {
        const key = settingsStore.themeSpecificLocks
            ? `${this.tokens.themeMode}:${id}`
            : id;
        this.tokens = {
            ...this.tokens,
            lockedColors: {
                ...this.tokens.lockedColors,
                [key]: !this.tokens.lockedColors[key]
            }
        };
    }

    isColorLocked(id: string): boolean {
        const key = settingsStore.themeSpecificLocks
            ? `${this.tokens.themeMode}:${id}`
            : id;
        return this.tokens.lockedColors[key] || false;
    }

    toggleToastColorLock(colorKey: string) {
        const key = settingsStore.themeSpecificLocks
            ? `${this.tokens.themeMode}:${colorKey}`
            : colorKey;
        this.tokens = {
            ...this.tokens,
            lockedColors: {
                ...this.tokens.lockedColors,
                [key]: !this.tokens.lockedColors[key]
            }
        };
    }

    isToastColorLocked(colorKey: string): boolean {
        const key = settingsStore.themeSpecificLocks
            ? `${this.tokens.themeMode}:${colorKey}`
            : colorKey;
        return this.tokens.lockedColors[key] || false;
    }

    // Feature toggles
    toggleButtons(enabled: boolean) {
        this.tokens = { ...this.tokens, enableButtons: enabled };
    }

    toggleToasts(enabled: boolean) {
        this.tokens = { ...this.tokens, enableToasts: enabled };
    }

    // Typography methods
    updateTypography(key: keyof DesignTokens['typography'], value: string) {
        if (key === 'fontFamily') {
            const newTypography = { ...this.tokens.typography };
            newTypography.fontFamily = value;
            newTypography.body = { ...newTypography.body, fontFamily: value };
            newTypography.bodySmall = { ...newTypography.bodySmall, fontFamily: value };
            this.tokens.typography = newTypography;
        } else if (key === 'headingFontFamily') {
            const newTypography = { ...this.tokens.typography };
            newTypography.headingFontFamily = value;
            newTypography.headings = {
                h1: { ...newTypography.headings.h1, fontFamily: value },
                h2: { ...newTypography.headings.h2, fontFamily: value },
                h3: { ...newTypography.headings.h3, fontFamily: value },
                h4: { ...newTypography.headings.h4, fontFamily: value },
                h5: { ...newTypography.headings.h5, fontFamily: value },
                h6: { ...newTypography.headings.h6, fontFamily: value },
            };
            this.tokens.typography = newTypography;
        } else if (key === 'buttonFontFamily') {
            const newTypography = { ...this.tokens.typography };
            newTypography.buttonFontFamily = value;
            newTypography.button = { ...newTypography.button, fontFamily: value };
            newTypography.buttonLarge = { ...newTypography.buttonLarge, fontFamily: value };
            newTypography.buttonSmall = { ...newTypography.buttonSmall, fontFamily: value };
            this.tokens.typography = newTypography;
        } else if (key === 'baseFontSize') {
            this.tokens.typography = { ...this.tokens.typography, baseFontSize: value };
        }
    }

    // Heading and body updates
    updateHeading(key: keyof DesignTokens['typography']['headings'], updates: Partial<TypographyToken>) {
        this.tokens.typography = {
            ...this.tokens.typography,
            headings: {
                ...this.tokens.typography.headings,
                [key]: { ...this.tokens.typography.headings[key], ...updates }
            }
        };
    }

    updateBody(updates: Partial<TypographyToken>) {
        this.tokens.typography = {
            ...this.tokens.typography,
            body: { ...this.tokens.typography.body, ...updates }
        };
    }

    updateBodySmall(updates: Partial<TypographyToken>) {
        this.tokens.typography = {
            ...this.tokens.typography,
            bodySmall: { ...this.tokens.typography.bodySmall, ...updates }
        };
    }

    updateButtonLargeTypography(updates: Partial<TypographyToken>) {
        this.tokens.typography = {
            ...this.tokens.typography,
            buttonLarge: { ...this.tokens.typography.buttonLarge, ...updates }
        };
    }

    updateButtonTypography(updates: Partial<TypographyToken>) {
        this.tokens.typography = {
            ...this.tokens.typography,
            button: { ...this.tokens.typography.button, ...updates }
        };
    }

    updateButtonSmallTypography(updates: Partial<TypographyToken>) {
        this.tokens.typography = {
            ...this.tokens.typography,
            buttonSmall: { ...this.tokens.typography.buttonSmall, ...updates }
        };
    }

    // Button methods
    updateButton(size: 'large' | 'medium' | 'small', updates: Partial<ButtonSizeTokens>) {
        this.tokens.buttons = {
            ...this.tokens.buttons,
            [size]: { ...this.tokens.buttons[size], ...updates }
        };
    }

    updateButtonVariant(variant: 'primary' | 'secondary' | 'tertiary', updates: Partial<ButtonVariantTokens>) {
        const currentVariant = this.tokens.buttonVariants[variant];
        const updatedVariant = { ...currentVariant, ...updates };

        // If bgColor is being updated manually, generate appropriate hover/active/disabled colors
        if (updates.bgColor !== undefined) {
            const baseColor = updates.bgColor;

            // For primary buttons: hover +20% brightness, active -20% darker
            if (variant === 'primary') {
                updatedVariant.hoverBgColor = lightenColor(baseColor, 0.2);
                updatedVariant.activeBgColor = darkenColor(baseColor, 0.2);
                updatedVariant.disabledBgColor = colorWithOpacity(baseColor, 0.5);
            }
            // For secondary buttons: default 10% opacity, hover 20%, active 30%
            else if (variant === 'secondary') {
                updatedVariant.bgColor = colorWithOpacity(baseColor, 0.1);
                updatedVariant.hoverBgColor = colorWithOpacity(baseColor, 0.2);
                updatedVariant.activeBgColor = colorWithOpacity(baseColor, 0.3);
                updatedVariant.disabledBgColor = colorWithOpacity(baseColor, 0.1);
            }
            // For tertiary buttons: default 10% opacity, hover 20%, active 30%
            else {
                updatedVariant.bgColor = colorWithOpacity(baseColor, 0.1);
                updatedVariant.hoverBgColor = colorWithOpacity(baseColor, 0.2);
                updatedVariant.activeBgColor = colorWithOpacity(baseColor, 0.3);
                updatedVariant.disabledBgColor = colorWithOpacity(baseColor, 0.1);
            }
        }

        // If borderColor is being updated manually, update border state colors too
        if (updates.borderColor !== undefined && variant === 'secondary') {
            const baseBorderColor = updates.borderColor;
            updatedVariant.hoverBorderColor = lightenColor(baseBorderColor, 0.1);
            updatedVariant.activeBorderColor = darkenColor(baseBorderColor, 0.1);
            updatedVariant.disabledBorderColor = colorWithOpacity(baseBorderColor, 0.3);
        }

        // If textColor is being updated manually, update text state colors too
        if (updates.textColor !== undefined) {
            updatedVariant.hoverTextColor = updates.textColor;
            updatedVariant.activeTextColor = updates.textColor;
            updatedVariant.disabledTextColor = colorWithOpacity(updates.textColor, 0.5);
        }

        this.tokens.buttonVariants = {
            ...this.tokens.buttonVariants,
            [variant]: updatedVariant
        };
    }

    // Unit conversion
    setUnit(unit: 'px' | 'rem') {
        if (this.tokens.unit === unit) return;

        const convert = (value: string) => convertUnit(value, unit);

        // Convert typography values
        const newTypography = {
            ...this.tokens.typography,
            baseFontSize: convert(this.tokens.typography.baseFontSize),
            headings: {
                h1: { ...this.tokens.typography.headings.h1, fontSize: convert(this.tokens.typography.headings.h1.fontSize) },
                h2: { ...this.tokens.typography.headings.h2, fontSize: convert(this.tokens.typography.headings.h2.fontSize) },
                h3: { ...this.tokens.typography.headings.h3, fontSize: convert(this.tokens.typography.headings.h3.fontSize) },
                h4: { ...this.tokens.typography.headings.h4, fontSize: convert(this.tokens.typography.headings.h4.fontSize) },
                h5: { ...this.tokens.typography.headings.h5, fontSize: convert(this.tokens.typography.headings.h5.fontSize) },
                h6: { ...this.tokens.typography.headings.h6, fontSize: convert(this.tokens.typography.headings.h6.fontSize) },
            },
            body: { ...this.tokens.typography.body, fontSize: convert(this.tokens.typography.body.fontSize) },
            bodySmall: { ...this.tokens.typography.bodySmall, fontSize: convert(this.tokens.typography.bodySmall.fontSize) },
            button: { ...this.tokens.typography.button, fontSize: convert(this.tokens.typography.button.fontSize) },
            buttonSmall: { ...this.tokens.typography.buttonSmall, fontSize: convert(this.tokens.typography.buttonSmall.fontSize) },
        };

        // Convert button values
        const newButtons = {
            large: {
                ...this.tokens.buttons.large,
                paddingX: convert(this.tokens.buttons.large.paddingX),
                paddingY: convert(this.tokens.buttons.large.paddingY),
                minWidth: convert(this.tokens.buttons.large.minWidth),
                borderRadius: convert(this.tokens.buttons.large.borderRadius),
            },
            medium: {
                ...this.tokens.buttons.medium,
                paddingX: convert(this.tokens.buttons.medium.paddingX),
                paddingY: convert(this.tokens.buttons.medium.paddingY),
                minWidth: convert(this.tokens.buttons.medium.minWidth),
                borderRadius: convert(this.tokens.buttons.medium.borderRadius),
            },
            small: {
                ...this.tokens.buttons.small,
                paddingX: convert(this.tokens.buttons.small.paddingX),
                paddingY: convert(this.tokens.buttons.small.paddingY),
                minWidth: convert(this.tokens.buttons.small.minWidth),
                borderRadius: convert(this.tokens.buttons.small.borderRadius),
            }
        };

        // Convert button variant border widths
        const newButtonVariants = {
            primary: {
                ...this.tokens.buttonVariants.primary,
                large: { ...this.tokens.buttonVariants.primary.large, borderWidth: convert(this.tokens.buttonVariants.primary.large.borderWidth) },
                medium: { ...this.tokens.buttonVariants.primary.medium, borderWidth: convert(this.tokens.buttonVariants.primary.medium.borderWidth) },
                small: { ...this.tokens.buttonVariants.primary.small, borderWidth: convert(this.tokens.buttonVariants.primary.small.borderWidth) },
            },
            secondary: {
                ...this.tokens.buttonVariants.secondary,
                large: { ...this.tokens.buttonVariants.secondary.large, borderWidth: convert(this.tokens.buttonVariants.secondary.large.borderWidth) },
                medium: { ...this.tokens.buttonVariants.secondary.medium, borderWidth: convert(this.tokens.buttonVariants.secondary.medium.borderWidth) },
                small: { ...this.tokens.buttonVariants.secondary.small, borderWidth: convert(this.tokens.buttonVariants.secondary.small.borderWidth) },
            },
            tertiary: {
                ...this.tokens.buttonVariants.tertiary,
                large: { ...this.tokens.buttonVariants.tertiary.large, borderWidth: convert(this.tokens.buttonVariants.tertiary.large.borderWidth) },
                medium: { ...this.tokens.buttonVariants.tertiary.medium, borderWidth: convert(this.tokens.buttonVariants.tertiary.medium.borderWidth) },
                small: { ...this.tokens.buttonVariants.tertiary.small, borderWidth: convert(this.tokens.buttonVariants.tertiary.small.borderWidth) },
            }
        };

        // Convert spacing
        const newSpacing = {
            unit: convert(this.tokens.spacing.unit)
        };

        this.tokens = {
            ...this.tokens,
            unit,
            typography: newTypography,
            buttons: newButtons,
            buttonVariants: newButtonVariants,
            spacing: newSpacing
        };
    }

    // Theme methods
    setThemeMode(mode: 'light' | 'dark') {
        this.tokens = {
            ...this.tokens,
            themeMode: mode
        };
    }

    setDefaultThemeMode(mode: 'light' | 'dark') {
        this.tokens = {
            ...this.tokens,
            defaultThemeMode: mode
        };
    }

    // Button toggles
    toggleButtonVariant(variant: 'primary' | 'secondary' | 'tertiary', enabled: boolean) {
        this.tokens = {
            ...this.tokens,
            enabledButtonVariants: {
                ...this.tokens.enabledButtonVariants,
                [variant]: enabled
            }
        };
    }

    toggleButtonSize(size: 'small' | 'medium' | 'large', enabled: boolean) {
        this.tokens = {
            ...this.tokens,
            enabledButtonSizes: {
                ...this.tokens.enabledButtonSizes,
                [size]: enabled
            }
        };
    }

    // Reset and serialization
    reset = withPerformanceMonitoring('reset', () => {
        this.tokens = structuredClone(defaultTokens);
        this.lastSavedState = JSON.stringify(this.tokens);
    });

    exportToJSON = withPerformanceMonitoring('exportToJSON', () => {
        return exportTokensToJSON(this.tokens);
    });

    importFromJSON = withPerformanceMonitoring('importFromJSON', (json: string) => {
        const parsed = importTokensFromJSON(json);
        if (parsed) {
            this.tokens = parsed;
            return true;
        }
        return false;
    });

    hydrateFromPartial(partial: Partial<DesignTokens>) {
        this.tokens = hydrateTokensFromPartial(this.tokens, partial);
    }

    // Dirty state tracking
    lastSavedState = $state<string>(JSON.stringify(defaultTokens));
    lastSavedTimestamp = $state<number>(Date.now());

    get isDirty(): boolean {
        return JSON.stringify(this.tokens) !== this.lastSavedState;
    }

    markAsSaved() {
        this.lastSavedState = JSON.stringify(this.tokens);
        this.lastSavedTimestamp = Date.now();
    }

    getLastSavedTimestamp(): number {
        return this.lastSavedTimestamp;
    }
}

// Default tokens (moved here for completeness)
const defaultTokens: DesignTokens = {
    unit: 'px',
    themeMode: 'dark',
    defaultThemeMode: 'dark',
    enableButtons: true,
    enableToasts: false,
    enableToastHeadings: true,
    enabledButtonVariants: {
        primary: true,
        secondary: true,
        tertiary: true,
    },
    enabledButtonSizes: {
        small: true,
        medium: true,
        large: true,
    },
    colorVariables: [
        { id: 'primary', name: 'Primary', value: '#00A3E0' },
        { id: 'accent', name: 'Accent', value: '#FFAB00' },
        { id: 'text', name: 'Text', value: '#FFFFFF' },
        { id: 'background', name: 'Background', value: '#0A121F' },
    ],
    colors: {
        text: '#FFFFFF',
        background: '#0A121F',
        primary: '#00A3E0',
        accent: '#FFAB00',
        info: '#00A3E0',
        warning: '#FFAB00',
        error: '#FF4444',
        success: '#00C853'
    },
    lockedColors: {},
    typography: {
        fontFamily: 'Inter, sans-serif',
        headingFontFamily: 'Spline Sans Mono, monospace',
        buttonFontFamily: 'Spline Sans Mono, monospace',
        baseFontSize: '16px',
        headings: {
            h1: { name: 'h1', fontFamily: 'Spline Sans Mono, monospace', fontSize: '40px', fontWeight: '700', lineHeight: 'auto', letterSpacing: '0', textTransform: 'none' },
            h2: { name: 'h2', fontFamily: 'Spline Sans Mono, monospace', fontSize: '32px', fontWeight: '700', lineHeight: 'auto', letterSpacing: '0', textTransform: 'none' },
            h3: { name: 'h3', fontFamily: 'Spline Sans Mono, monospace', fontSize: '24px', fontWeight: '700', lineHeight: 'auto', letterSpacing: '0', textTransform: 'none' },
            h4: { name: 'h4', fontFamily: 'Spline Sans Mono, monospace', fontSize: '20px', fontWeight: '700', lineHeight: 'auto', letterSpacing: '0', textTransform: 'none' },
            h5: { name: 'h5', fontFamily: 'Spline Sans Mono, monospace', fontSize: '16px', fontWeight: '700', lineHeight: 'auto', letterSpacing: '0', textTransform: 'none' },
            h6: { name: 'h6', fontFamily: 'Spline Sans Mono, monospace', fontSize: '14px', fontWeight: '700', lineHeight: 'auto', letterSpacing: '0', textTransform: 'none' }
        },
        body: { name: 'p', fontFamily: 'Inter, sans-serif', fontSize: '16px', fontWeight: '400', lineHeight: 'auto', letterSpacing: '0', textTransform: 'none' },
        bodySmall: { name: 'p-sm', fontFamily: 'Inter, sans-serif', fontSize: '14px', fontWeight: '400', lineHeight: 'auto', letterSpacing: '0', textTransform: 'none' },
        buttonLarge: { name: 'bu-lg', fontFamily: 'Spline Sans Mono, monospace', fontSize: '20px', fontWeight: '700', lineHeight: 'auto', letterSpacing: '0', textTransform: 'uppercase' },
        button: { name: 'bu', fontFamily: 'Spline Sans Mono, monospace', fontSize: '16px', fontWeight: '700', lineHeight: 'auto', letterSpacing: '0', textTransform: 'uppercase' },
        buttonSmall: { name: 'bu-sm', fontFamily: 'Spline Sans Mono, monospace', fontSize: '14px', fontWeight: '700', lineHeight: 'auto', letterSpacing: '0', textTransform: 'uppercase' }
    },
    buttons: {
        large: {
            paddingX: '24px',
            paddingY: '12px',
            minWidth: '128px',
            borderRadius: '0px',
            textTransform: 'uppercase',
            animation: 'both',
            transitionDuration: '150ms'
        },
        medium: {
            paddingX: '16px',
            paddingY: '8px',
            minWidth: '96px',
            borderRadius: '0px',
            textTransform: 'uppercase',
            animation: 'both',
            transitionDuration: '150ms'
        },
        small: {
            paddingX: '12px',
            paddingY: '6px',
            minWidth: '64px',
            borderRadius: '0px',
            textTransform: 'uppercase',
            animation: 'both',
            transitionDuration: '150ms'
        }
    },
    buttonVariants: {
        primary: {
            large: { borderWidth: '0px', borderStyle: 'none', borderPosition: 'inside' },
            medium: { borderWidth: '0px', borderStyle: 'none', borderPosition: 'inside' },
            small: { borderWidth: '0px', borderStyle: 'none', borderPosition: 'inside' },
            bgColor: '$primary',
            textColor: '$background',
            borderColor: 'transparent',
            hoverBgColor: '#33B5E6',
            hoverTextColor: '$background',
            hoverBorderColor: 'transparent',
            activeBgColor: '#0082B3',
            activeTextColor: '$background',
            activeBorderColor: 'transparent',
            disabledBgColor: 'rgba(0, 163, 224, 0.5)',
            disabledTextColor: '$background',
            disabledBorderColor: 'transparent',
            disabledOpacity: '0.3'
        },
        secondary: {
            large: { borderWidth: '4px', borderStyle: 'solid', borderPosition: 'inside' },
            medium: { borderWidth: '4px', borderStyle: 'solid', borderPosition: 'inside' },
            small: { borderWidth: '3px', borderStyle: 'solid', borderPosition: 'inside' },
            bgColor: 'rgba(0, 163, 224, 0.1)',
            textColor: '$primary',
            borderColor: '$primary',
            hoverBgColor: 'rgba(0, 163, 224, 0.2)',
            hoverTextColor: '$primary',
            hoverBorderColor: '$primary',
            activeBgColor: 'rgba(0, 163, 224, 0.3)',
            activeTextColor: '$primary',
            activeBorderColor: '$primary',
            disabledBgColor: 'rgba(0, 163, 224, 0.1)',
            disabledTextColor: '$primary',
            disabledBorderColor: '$primary',
            disabledOpacity: '0.3'
        },
        tertiary: {
            large: { borderWidth: '0px', borderStyle: 'none', borderPosition: 'inside' },
            medium: { borderWidth: '0px', borderStyle: 'none', borderPosition: 'inside' },
            small: { borderWidth: '0px', borderStyle: 'none', borderPosition: 'inside' },
            bgColor: 'rgba(0, 163, 224, 0.1)',
            textColor: '$primary',
            borderColor: 'transparent',
            hoverBgColor: 'rgba(0, 163, 224, 0.2)',
            hoverTextColor: '$primary',
            hoverBorderColor: 'transparent',
            activeBgColor: 'rgba(0, 163, 224, 0.3)',
            activeTextColor: '$primary',
            activeBorderColor: 'transparent',
            disabledBgColor: 'rgba(0, 163, 224, 0.1)',
            disabledTextColor: '$primary',
            disabledBorderColor: 'transparent',
            disabledOpacity: '0.3'
        }
    },
    spacing: {
        unit: '4px'
    }
};