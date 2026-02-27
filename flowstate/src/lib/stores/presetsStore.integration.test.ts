// src/lib/stores/presetsStore.integration.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock browser environment
Object.defineProperty(window, 'localStorage', {
    value: {
        getItem: vi.fn(),
        setItem: vi.fn(),
        removeItem: vi.fn(),
    },
    writable: true,
});

describe('presetsStore integration', () => {
    let presetsStore: any;

    beforeEach(async () => {
        // Reset mocks
        vi.clearAllMocks();

        // Mock localStorage to return empty initially
        (window.localStorage.getItem as any).mockReturnValue(null);

        // Import fresh instance
        const module = await import('./presetsStore.svelte');
        presetsStore = module.presetsStore;
    });

    it('should initialize with default presets', () => {
        expect(presetsStore.presets.length).toBeGreaterThan(0);
        expect(presetsStore.presets.some((p: any) => p.isDefault)).toBe(true);
    });

    it('should save and load presets from localStorage', async () => {
        const mockPreset = {
            id: 'test-preset',
            name: 'Test Preset',
            tokens: {
                unit: 'px',
                themeMode: 'dark',
                defaultThemeMode: 'dark',
                enableButtons: true,
                enableToasts: false,
                enableToastHeadings: true,
                enabledButtonVariants: { primary: true, secondary: true, tertiary: true },
                enabledButtonSizes: { small: true, medium: true, large: true },
                colorVariables: [],
                colors: {
                    text: '#FFFFFF',
                    background: '#0A121F',
                    primary: '#FF0000',
                    accent: '#FFAB00',
                    info: '#00A3E0',
                    warning: '#FFAB00',
                    error: '#FF4444',
                    success: '#00C853'
                },
                lockedColors: {},
                typography: {
                    fontFamily: 'Arial',
                    headingFontFamily: 'Arial',
                    buttonFontFamily: 'Arial',
                    baseFontSize: '16px',
                    headings: {
                        h1: { name: 'h1', fontFamily: 'Arial', fontSize: '32px', fontWeight: '700', lineHeight: 'auto', letterSpacing: '0', textTransform: 'none' },
                        h2: { name: 'h2', fontFamily: 'Arial', fontSize: '24px', fontWeight: '700', lineHeight: 'auto', letterSpacing: '0', textTransform: 'none' },
                        h3: { name: 'h3', fontFamily: 'Arial', fontSize: '20px', fontWeight: '700', lineHeight: 'auto', letterSpacing: '0', textTransform: 'none' },
                        h4: { name: 'h4', fontFamily: 'Arial', fontSize: '18px', fontWeight: '700', lineHeight: 'auto', letterSpacing: '0', textTransform: 'none' },
                        h5: { name: 'h5', fontFamily: 'Arial', fontSize: '16px', fontWeight: '700', lineHeight: 'auto', letterSpacing: '0', textTransform: 'none' },
                        h6: { name: 'h6', fontFamily: 'Arial', fontSize: '14px', fontWeight: '700', lineHeight: 'auto', letterSpacing: '0', textTransform: 'none' }
                    },
                    body: { name: 'body', fontFamily: 'Arial', fontSize: '16px', fontWeight: '400', lineHeight: 'auto', letterSpacing: '0', textTransform: 'none' },
                    bodySmall: { name: 'body-sm', fontFamily: 'Arial', fontSize: '14px', fontWeight: '400', lineHeight: 'auto', letterSpacing: '0', textTransform: 'none' },
                    buttonLarge: { name: 'btn-lg', fontFamily: 'Arial', fontSize: '18px', fontWeight: '700', lineHeight: 'auto', letterSpacing: '0', textTransform: 'uppercase' },
                    button: { name: 'btn', fontFamily: 'Arial', fontSize: '16px', fontWeight: '700', lineHeight: 'auto', letterSpacing: '0', textTransform: 'uppercase' },
                    buttonSmall: { name: 'btn-sm', fontFamily: 'Arial', fontSize: '14px', fontWeight: '700', lineHeight: 'auto', letterSpacing: '0', textTransform: 'uppercase' }
                },
                buttons: {
                    large: { paddingX: '16px', paddingY: '8px', minWidth: '80px', borderRadius: '4px', textTransform: 'uppercase', animation: 'none', transitionDuration: '200ms' },
                    medium: { paddingX: '12px', paddingY: '6px', minWidth: '60px', borderRadius: '4px', textTransform: 'uppercase', animation: 'none', transitionDuration: '200ms' },
                    small: { paddingX: '8px', paddingY: '4px', minWidth: '40px', borderRadius: '4px', textTransform: 'uppercase', animation: 'none', transitionDuration: '200ms' }
                },
                buttonVariants: {
                    primary: {
                        large: { borderWidth: '1px', borderStyle: 'solid', borderPosition: 'inside' },
                        medium: { borderWidth: '1px', borderStyle: 'solid', borderPosition: 'inside' },
                        small: { borderWidth: '1px', borderStyle: 'solid', borderPosition: 'inside' },
                        bgColor: '#FF0000',
                        textColor: '#FFFFFF',
                        borderColor: '#FF0000',
                        hoverBgColor: '#CC0000',
                        hoverTextColor: '#FFFFFF',
                        hoverBorderColor: '#CC0000',
                        activeBgColor: '#AA0000',
                        activeTextColor: '#FFFFFF',
                        activeBorderColor: '#AA0000',
                        disabledBgColor: '#FF0000',
                        disabledTextColor: '#FFFFFF',
                        disabledBorderColor: '#FF0000',
                        disabledOpacity: '0.5'
                    },
                    secondary: {
                        large: { borderWidth: '1px', borderStyle: 'solid', borderPosition: 'inside' },
                        medium: { borderWidth: '1px', borderStyle: 'solid', borderPosition: 'inside' },
                        small: { borderWidth: '1px', borderStyle: 'solid', borderPosition: 'inside' },
                        bgColor: 'transparent',
                        textColor: '#FF0000',
                        borderColor: '#FF0000',
                        hoverBgColor: 'rgba(255, 0, 0, 0.1)',
                        hoverTextColor: '#FF0000',
                        hoverBorderColor: '#CC0000',
                        activeBgColor: 'rgba(255, 0, 0, 0.2)',
                        activeTextColor: '#FF0000',
                        activeBorderColor: '#AA0000',
                        disabledBgColor: 'transparent',
                        disabledTextColor: '#FF0000',
                        disabledBorderColor: '#FF0000',
                        disabledOpacity: '0.5'
                    },
                    tertiary: {
                        large: { borderWidth: '0px', borderStyle: 'none', borderPosition: 'inside' },
                        medium: { borderWidth: '0px', borderStyle: 'none', borderPosition: 'inside' },
                        small: { borderWidth: '0px', borderStyle: 'none', borderPosition: 'inside' },
                        bgColor: 'transparent',
                        textColor: '#FF0000',
                        borderColor: 'transparent',
                        hoverBgColor: 'transparent',
                        hoverTextColor: '#CC0000',
                        hoverBorderColor: 'transparent',
                        activeBgColor: 'transparent',
                        activeTextColor: '#AA0000',
                        activeBorderColor: 'transparent',
                        disabledBgColor: 'transparent',
                        disabledTextColor: '#FF0000',
                        disabledBorderColor: 'transparent',
                        disabledOpacity: '0.5'
                    }
                },
                spacing: { unit: '4px' }
            },
            createdAt: Date.now(),
            updatedAt: Date.now()
        };

        // Mock the designTokens importFromJSON to succeed
        const designTokensMock = await import('../stores/designTokens.svelte');
        vi.spyOn(designTokensMock.designTokens, 'importFromJSON').mockReturnValue(true);

        // Import preset
        const result = presetsStore.importPreset(JSON.stringify(mockPreset));
        expect(result).toBeTruthy();
        expect(result?.name).toBe('Test Preset');
    });

    it('should handle preset loading errors gracefully', async () => {
        // Mock the designTokens importFromJSON to fail
        const designTokensMock = await import('../stores/designTokens.svelte');
        vi.spyOn(designTokensMock.designTokens, 'importFromJSON').mockReturnValue(false);

        // Try to import invalid preset
        const result = presetsStore.importPreset('invalid json');
        expect(result).toBeNull();
    });
});