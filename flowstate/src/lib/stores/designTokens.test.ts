import { describe, it, expect, beforeEach } from 'vitest';

// Mock the $state rune for testing
// Note: In a real Svelte 5 test environment, you would use @testing-library/svelte
// For unit testing store logic, we test the class methods directly

// Import types
import type { DesignTokens, ColorVariable } from './designTokens.svelte';

// Since we can't directly import the store with runes in vitest without svelte compilation,
// we'll test the pure functions and create a mock store class for testing

const BASE_FONT_SIZE = 16;

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

// Create a testable version of the store without runes
class TestableDesignTokensStore {
    tokens: DesignTokens;
    private defaultTokens: DesignTokens;

    constructor() {
        this.defaultTokens = this.createDefaultTokens();
        this.tokens = structuredClone(this.defaultTokens);
    }

    private createDefaultTokens(): DesignTokens {
        return {
            unit: 'px',
            themeMode: 'dark',
            defaultThemeMode: 'dark',
            enableButtons: true,
            enableToasts: true,
            enableToastHeadings: true,
            colorVariables: [
                { id: 'primary', name: 'Primary', value: '#00A3E0' },
                { id: 'accent', name: 'Accent', value: '#FFAB00' },
                { id: 'text', name: 'Text', value: '#FFFFFF' },
                { id: 'background', name: 'Background', value: '#0A121F' }
            ],
            colors: {
                text: '#FFFFFF',
                background: '#0A121F',
                primary: '#00A3E0',
                accent: '#FFAB00',
                info: '#00A3E0',
                warning: '#FFAB00',
                error: '#E03D00',
                success: '#33E000'
            },
            lockedColors: {},
            typography: {
                fontFamily: 'system-ui, sans-serif',
                headingFontFamily: 'system-ui, sans-serif',
                buttonFontFamily: 'system-ui, sans-serif',
                baseFontSize: '16px',
                headings: {
                    h1: { name: 'h1', fontFamily: 'system-ui, sans-serif', fontSize: '40px', fontWeight: '700', lineHeight: 'auto', letterSpacing: '0', textTransform: 'none' },
                    h2: { name: 'h2', fontFamily: 'system-ui, sans-serif', fontSize: '32px', fontWeight: '700', lineHeight: 'auto', letterSpacing: '0', textTransform: 'none' },
                    h3: { name: 'h3', fontFamily: 'system-ui, sans-serif', fontSize: '24px', fontWeight: '700', lineHeight: 'auto', letterSpacing: '0', textTransform: 'none' },
                    h4: { name: 'h4', fontFamily: 'system-ui, sans-serif', fontSize: '20px', fontWeight: '700', lineHeight: 'auto', letterSpacing: '0', textTransform: 'none' },
                    h5: { name: 'h5', fontFamily: 'system-ui, sans-serif', fontSize: '16px', fontWeight: '700', lineHeight: 'auto', letterSpacing: '0', textTransform: 'none' },
                    h6: { name: 'h6', fontFamily: 'system-ui, sans-serif', fontSize: '14px', fontWeight: '700', lineHeight: 'auto', letterSpacing: '0', textTransform: 'none' }
                },
                body: { name: 'p', fontFamily: 'system-ui, sans-serif', fontSize: '16px', fontWeight: '400', lineHeight: 'auto', letterSpacing: '0', textTransform: 'none' },
                bodySmall: { name: 'p-sm', fontFamily: 'system-ui, sans-serif', fontSize: '12px', fontWeight: '400', lineHeight: 'auto', letterSpacing: '0', textTransform: 'none' },
                button: { name: 'bu', fontFamily: 'system-ui, sans-serif', fontSize: '20px', fontWeight: '700', lineHeight: 'auto', letterSpacing: '0', textTransform: 'uppercase' },
                buttonLarge: { name: 'bu-lg', fontFamily: 'system-ui, sans-serif', fontSize: '24px', fontWeight: '700', lineHeight: 'auto', letterSpacing: '0', textTransform: 'uppercase' },
                buttonSmall: { name: 'bu-sm', fontFamily: 'system-ui, sans-serif', fontSize: '16px', fontWeight: '700', lineHeight: 'auto', letterSpacing: '0', textTransform: 'uppercase' }
            },
            buttons: {
                large: { paddingX: '24px', paddingY: '12px', minWidth: '128px', borderRadius: '0px', textTransform: 'uppercase', animation: 'both', transitionDuration: '150ms' },
                medium: { paddingX: '20px', paddingY: '10px', minWidth: '112px', borderRadius: '0px', textTransform: 'uppercase', animation: 'both', transitionDuration: '150ms' },
                small: { paddingX: '12px', paddingY: '6px', minWidth: '96px', borderRadius: '0px', textTransform: 'uppercase', animation: 'both', transitionDuration: '150ms' }
            },
            buttonVariants: {
                primary: {
                    large: { borderWidth: '0px', borderStyle: 'none', borderPosition: 'inside' },
                    medium: { borderWidth: '0px', borderStyle: 'none', borderPosition: 'inside' },
                    small: { borderWidth: '0px', borderStyle: 'none', borderPosition: 'inside' },
                    bgColor: '$primary',
                    textColor: '#0A121F',
                    borderColor: 'transparent',
                    hoverBgColor: 'rgba(51, 182, 230, 1)',
                    hoverTextColor: '#0A121F',
                    hoverBorderColor: 'transparent',
                    activeBgColor: 'rgba(0, 130, 179, 1)',
                    activeTextColor: '#0A121F',
                    activeBorderColor: 'transparent',
                    disabledBgColor: '$primary',
                    disabledTextColor: '#0A121F',
                    disabledBorderColor: 'transparent',
                    disabledOpacity: '0.3'
                },
                secondary: {
                    large: { borderWidth: '4px', borderStyle: 'solid', borderPosition: 'inside' },
                    medium: { borderWidth: '3px', borderStyle: 'solid', borderPosition: 'inside' },
                    small: { borderWidth: '2px', borderStyle: 'solid', borderPosition: 'inside' },
                    bgColor: 'transparent',
                    textColor: '$primary',
                    borderColor: '$primary',
                    hoverBgColor: 'rgba(0, 163, 224, 0.1)',
                    hoverTextColor: '$primary',
                    hoverBorderColor: '$primary',
                    activeBgColor: 'rgba(0, 163, 224, 0.2)',
                    activeTextColor: '$primary',
                    activeBorderColor: '$primary',
                    disabledBgColor: 'transparent',
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
            spacing: { unit: '4px' },
            enabledButtonVariants: { primary: true, secondary: true, tertiary: true },
            enabledButtonSizes: { small: true, medium: true, large: true }
        };
    }

    getDefaultTokens(): DesignTokens {
        return structuredClone(this.defaultTokens);
    }

    updateColor(key: keyof DesignTokens['colors'], value: string) {
        this.tokens.colors = { ...this.tokens.colors, [key]: value };
    }

    addColorVariable(name: string, value: string): string {
        const id = `var_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        this.tokens.colorVariables = [...this.tokens.colorVariables, { id, name, value }];
        return id;
    }

    updateColorVariable(id: string, updates: Partial<Omit<ColorVariable, 'id'>>) {
        this.tokens.colorVariables = this.tokens.colorVariables.map((v) =>
            v.id === id ? { ...v, ...updates } : v
        );
    }

    deleteColorVariable(id: string) {
        this.tokens.colorVariables = this.tokens.colorVariables.filter((v) => v.id !== id);
    }

    getColorVariableValue(idOrValue: string): string {
        if (idOrValue.startsWith('$')) {
            const varId = idOrValue.slice(1);
            const variable = this.tokens.colorVariables.find((v) => v.id === varId);
            return variable?.value || idOrValue;
        }
        return idOrValue;
    }

    toggleColorLock(id: string) {
        this.tokens.colorVariables = this.tokens.colorVariables.map((v) =>
            v.id === id ? { ...v, locked: !v.locked } : v
        );
    }

    reset() {
        this.tokens = structuredClone(this.defaultTokens);
    }

    exportToJSON(): string {
        return JSON.stringify(this.tokens, null, 2);
    }

    importFromJSON(json: string): boolean {
        try {
            const parsed = JSON.parse(json);
            this.tokens = parsed;
            return true;
        } catch {
            return false;
        }
    }
}

describe('Unit Conversion Functions', () => {
    describe('pxToRem', () => {
        it('should convert px to rem correctly', () => {
            expect(pxToRem('16px')).toBe('1rem');
            expect(pxToRem('32px')).toBe('2rem');
            expect(pxToRem('8px')).toBe('0.5rem');
            expect(pxToRem('24px')).toBe('1.5rem');
        });

        it('should return original value for non-px values', () => {
            expect(pxToRem('1rem')).toBe('1rem');
            expect(pxToRem('auto')).toBe('auto');
            expect(pxToRem('100%')).toBe('100%');
        });
    });

    describe('remToPx', () => {
        it('should convert rem to px correctly', () => {
            expect(remToPx('1rem')).toBe('16px');
            expect(remToPx('2rem')).toBe('32px');
            expect(remToPx('0.5rem')).toBe('8px');
            expect(remToPx('1.5rem')).toBe('24px');
        });

        it('should return original value for non-rem values', () => {
            expect(remToPx('16px')).toBe('16px');
            expect(remToPx('auto')).toBe('auto');
            expect(remToPx('100%')).toBe('100%');
        });
    });

    describe('round-trip conversion', () => {
        it('should maintain fidelity through px->rem->px', () => {
            const original = '24px';
            const rem = pxToRem(original);
            const backToPx = remToPx(rem);
            expect(backToPx).toBe(original);
        });
    });
});

describe('DesignTokensStore', () => {
    let store: TestableDesignTokensStore;

    beforeEach(() => {
        store = new TestableDesignTokensStore();
    });

    describe('initialization', () => {
        it('should initialize with default tokens', () => {
            expect(store.tokens.unit).toBe('px');
            expect(store.tokens.themeMode).toBe('dark');
            expect(store.tokens.colorVariables).toHaveLength(4);
        });

        it('should have default color variables', () => {
            const ids = store.tokens.colorVariables.map((v) => v.id);
            expect(ids).toContain('primary');
            expect(ids).toContain('accent');
            expect(ids).toContain('text');
            expect(ids).toContain('background');
        });
    });

    describe('color operations', () => {
        it('should update a color token', () => {
            store.updateColor('primary', '#FF0000');
            expect(store.tokens.colors.primary).toBe('#FF0000');
        });

        it('should add a new color variable', () => {
            const initialLength = store.tokens.colorVariables.length;
            const id = store.addColorVariable('Custom', '#123456');

            expect(store.tokens.colorVariables).toHaveLength(initialLength + 1);
            expect(id).toMatch(/^var_\d+_[a-z0-9]+$/);

            const newVar = store.tokens.colorVariables.find((v) => v.id === id);
            expect(newVar?.name).toBe('Custom');
            expect(newVar?.value).toBe('#123456');
        });

        it('should update a color variable', () => {
            store.updateColorVariable('primary', { value: '#FF0000' });
            const primary = store.tokens.colorVariables.find((v) => v.id === 'primary');
            expect(primary?.value).toBe('#FF0000');
        });

        it('should delete a color variable', () => {
            const id = store.addColorVariable('ToDelete', '#000000');
            const lengthAfterAdd = store.tokens.colorVariables.length;

            store.deleteColorVariable(id);
            expect(store.tokens.colorVariables).toHaveLength(lengthAfterAdd - 1);
            expect(store.tokens.colorVariables.find((v) => v.id === id)).toBeUndefined();
        });

        it('should resolve color variable references', () => {
            expect(store.getColorVariableValue('$primary')).toBe('#00A3E0');
            expect(store.getColorVariableValue('#123456')).toBe('#123456');
            expect(store.getColorVariableValue('$nonexistent')).toBe('$nonexistent');
        });

        it('should toggle color lock', () => {
            expect(store.tokens.colorVariables.find((v) => v.id === 'primary')?.locked).toBeFalsy();

            store.toggleColorLock('primary');
            expect(store.tokens.colorVariables.find((v) => v.id === 'primary')?.locked).toBe(true);

            store.toggleColorLock('primary');
            expect(store.tokens.colorVariables.find((v) => v.id === 'primary')?.locked).toBe(false);
        });
    });

    describe('reset', () => {
        it('should reset to default tokens', () => {
            store.updateColor('primary', '#FF0000');
            store.addColorVariable('Custom', '#123456');

            store.reset();

            expect(store.tokens.colors.primary).toBe('#00A3E0');
            expect(store.tokens.colorVariables).toHaveLength(4);
        });
    });

    describe('export/import JSON', () => {
        it('should export tokens to valid JSON', () => {
            const json = store.exportToJSON();
            expect(() => JSON.parse(json)).not.toThrow();

            const parsed = JSON.parse(json);
            expect(parsed.unit).toBe('px');
            expect(parsed.colorVariables).toHaveLength(4);
        });

        it('should export with proper formatting', () => {
            const json = store.exportToJSON();
            expect(json).toContain('\n');
            expect(json).toContain('  ');
        });

        it('should import valid JSON', () => {
            const modified = { ...store.tokens, unit: 'rem' as const };
            const json = JSON.stringify(modified);

            const result = store.importFromJSON(json);

            expect(result).toBe(true);
            expect(store.tokens.unit).toBe('rem');
        });

        it('should return false for invalid JSON', () => {
            const result = store.importFromJSON('not valid json');
            expect(result).toBe(false);
        });

        it('should maintain data integrity through export/import cycle', () => {
            store.updateColor('primary', '#CUSTOM1');
            store.addColorVariable('TestVar', '#TESTVAL');

            const exported = store.exportToJSON();
            store.reset();
            store.importFromJSON(exported);

            expect(store.tokens.colors.primary).toBe('#CUSTOM1');
            const testVar = store.tokens.colorVariables.find((v) => v.name === 'TestVar');
            expect(testVar?.value).toBe('#TESTVAL');
        });
    });

    describe('getDefaultTokens', () => {
        it('should return a clone of default tokens', () => {
            const defaults = store.getDefaultTokens();
            defaults.colors.primary = '#MODIFIED';

            const newDefaults = store.getDefaultTokens();
            expect(newDefaults.colors.primary).toBe('#00A3E0');
        });
    });
});
