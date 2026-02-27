// Presets management store
import { designTokens, type DesignTokens } from './designTokens.svelte';
import { toastStore } from './toastStore.svelte';
import { fontStore } from './fontStore.svelte';

export interface StylePreset {
    id: string;
    name: string;
    tokens: DesignTokens;
    createdAt: number;
    updatedAt: number;
    isDefault?: boolean;
}

const STORAGE_KEY = 'design-system-presets';
const DEFAULT_PRESET_ID = 'default';
const BASIC_HTML_PRESET_ID = 'basic-html';

class PresetsStore {
    presets = $state<StylePreset[]>([]);
    activePresetId = $state<string | null>(DEFAULT_PRESET_ID);

    constructor() {
        if (typeof window !== 'undefined') {
            this.loadFromStorage();
        }
    }

    private getDefaultPresetTokens(): DesignTokens {
        return designTokens.getDefaultTokens();
    }

    private getBasicHtmlTokens(): DesignTokens {
        const base = designTokens.getDefaultTokens();
        return {
            ...base,
            themeMode: 'light',
            defaultThemeMode: 'light',
            enabledButtonVariants: {
                primary: true,
                secondary: false,
                tertiary: false,
            },
            enabledButtonSizes: {
                small: false,
                medium: true,
                large: false,
            },
            colorVariables: [
                { id: 'primary', name: 'Primary', value: '#0000EE' },
                { id: 'accent', name: 'Accent', value: '#551A8B' },
                { id: 'text', name: 'Text', value: '#000000' },
                { id: 'background', name: 'Background', value: '#FFFFFF' },
            ],
            colors: {
                text: '#000000',
                background: '#FFFFFF',
                primary: '#0000EE',
                accent: '#551A8B',
                info: '#0000EE',
                warning: '#FF8C00',
                error: '#FF0000',
                success: '#008000'
            },
            typography: {
                fontFamily: 'Times New Roman, Times, serif',
                headingFontFamily: 'Times New Roman, Times, serif',
                buttonFontFamily: 'Times New Roman, Times, serif',
                baseFontSize: '16px',
                headings: {
                    h1: { name: 'h1', fontFamily: 'Times New Roman, Times, serif', fontSize: '32px', fontWeight: '700', lineHeight: 'auto', letterSpacing: '0', textTransform: 'none' },
                    h2: { name: 'h2', fontFamily: 'Times New Roman, Times, serif', fontSize: '24px', fontWeight: '700', lineHeight: 'auto', letterSpacing: '0', textTransform: 'none' },
                    h3: { name: 'h3', fontFamily: 'Times New Roman, Times, serif', fontSize: '19px', fontWeight: '700', lineHeight: 'auto', letterSpacing: '0', textTransform: 'none' },
                    h4: { name: 'h4', fontFamily: 'Times New Roman, Times, serif', fontSize: '16px', fontWeight: '700', lineHeight: 'auto', letterSpacing: '0', textTransform: 'none' },
                    h5: { name: 'h5', fontFamily: 'Times New Roman, Times, serif', fontSize: '13px', fontWeight: '700', lineHeight: 'auto', letterSpacing: '0', textTransform: 'none' },
                    h6: { name: 'h6', fontFamily: 'Times New Roman, Times, serif', fontSize: '11px', fontWeight: '700', lineHeight: 'auto', letterSpacing: '0', textTransform: 'none' }
                },
                body: { name: 'p', fontFamily: 'Times New Roman, Times, serif', fontSize: '16px', fontWeight: '400', lineHeight: 'auto', letterSpacing: '0', textTransform: 'none' },
                bodySmall: { name: 'p-sm', fontFamily: 'Times New Roman, Times, serif', fontSize: '13px', fontWeight: '400', lineHeight: 'auto', letterSpacing: '0', textTransform: 'none' },
                buttonLarge: { name: 'bu-lg', fontFamily: 'Times New Roman, Times, serif', fontSize: '16px', fontWeight: '400', lineHeight: 'auto', letterSpacing: '0', textTransform: 'none' },
                button: { name: 'bu', fontFamily: 'Times New Roman, Times, serif', fontSize: '13px', fontWeight: '400', lineHeight: 'auto', letterSpacing: '0', textTransform: 'none' },
                buttonSmall: { name: 'bu-sm', fontFamily: 'Times New Roman, Times, serif', fontSize: '11px', fontWeight: '400', lineHeight: 'auto', letterSpacing: '0', textTransform: 'none' }
            },
            buttons: {
                large: { paddingX: '8px', paddingY: '4px', minWidth: '0px', borderRadius: '0px', textTransform: 'none', animation: 'none', transitionDuration: '0ms' },
                medium: { paddingX: '6px', paddingY: '2px', minWidth: '0px', borderRadius: '0px', textTransform: 'none', animation: 'none', transitionDuration: '0ms' },
                small: { paddingX: '4px', paddingY: '1px', minWidth: '0px', borderRadius: '0px', textTransform: 'none', animation: 'none', transitionDuration: '0ms' }
            },
            buttonVariants: {
                primary: {
                    large: { borderWidth: '2px', borderStyle: 'solid', borderPosition: 'outside' },
                    medium: { borderWidth: '2px', borderStyle: 'solid', borderPosition: 'outside' },
                    small: { borderWidth: '2px', borderStyle: 'solid', borderPosition: 'outside' },
                    bgColor: '$primary',
                    textColor: '$background',
                    borderColor: '$text',
                    hoverBgColor: '$primary',
                    hoverTextColor: '$background',
                    hoverBorderColor: '$text',
                    activeBgColor: '$primary',
                    activeTextColor: '$background',
                    activeBorderColor: '$text',
                    disabledBgColor: '$primary',
                    disabledTextColor: '$background',
                    disabledBorderColor: '$text',
                    disabledOpacity: '0.5'
                },
                secondary: {
                    large: { borderWidth: '2px', borderStyle: 'solid', borderPosition: 'outside' },
                    medium: { borderWidth: '2px', borderStyle: 'solid', borderPosition: 'outside' },
                    small: { borderWidth: '2px', borderStyle: 'solid', borderPosition: 'outside' },
                    bgColor: 'transparent',
                    textColor: '$primary',
                    borderColor: '$primary',
                    hoverBgColor: 'transparent',
                    hoverTextColor: '$primary',
                    hoverBorderColor: '$primary',
                    activeBgColor: 'transparent',
                    activeTextColor: '$primary',
                    activeBorderColor: '$primary',
                    disabledBgColor: 'transparent',
                    disabledTextColor: '$primary',
                    disabledBorderColor: '$primary',
                    disabledOpacity: '0.5'
                },
                tertiary: {
                    large: { borderWidth: '0px', borderStyle: 'none', borderPosition: 'outside' },
                    medium: { borderWidth: '0px', borderStyle: 'none', borderPosition: 'outside' },
                    small: { borderWidth: '0px', borderStyle: 'none', borderPosition: 'outside' },
                    bgColor: 'transparent',
                    textColor: '$primary',
                    borderColor: 'transparent',
                    hoverBgColor: 'transparent',
                    hoverTextColor: '$primary',
                    hoverBorderColor: 'transparent',
                    activeBgColor: 'transparent',
                    activeTextColor: '$primary',
                    activeBorderColor: 'transparent',
                    disabledBgColor: 'transparent',
                    disabledTextColor: '$primary',
                    disabledBorderColor: 'transparent',
                    disabledOpacity: '0.3'
                }
            }
        };
    }

    private ensureDefaultPreset() {
        const existingDefaultIndex = this.presets.findIndex(p => p.id === DEFAULT_PRESET_ID);
        const existingBasicHtmlIndex = this.presets.findIndex(p => p.id === BASIC_HTML_PRESET_ID);
        const now = Date.now();

        if (existingDefaultIndex === -1) {
            const defaultPreset: StylePreset = {
                id: DEFAULT_PRESET_ID,
                name: 'Default',
                tokens: this.getDefaultPresetTokens(),
                createdAt: now,
                updatedAt: now,
                isDefault: true
            };
            this.presets = [defaultPreset, ...this.presets];
        } else {
            this.presets[existingDefaultIndex] = {
                ...this.presets[existingDefaultIndex],
                isDefault: true
            };
        }

        if (existingBasicHtmlIndex === -1) {
            const basicHtmlPreset: StylePreset = {
                id: BASIC_HTML_PRESET_ID,
                name: 'Basic HTML',
                tokens: this.getBasicHtmlTokens(),
                createdAt: now,
                updatedAt: now,
                isDefault: true
            };
            const defaultIdx = this.presets.findIndex(p => p.id === DEFAULT_PRESET_ID);
            this.presets.splice(defaultIdx + 1, 0, basicHtmlPreset);
        }
    }

    private loadFromStorage() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const data = JSON.parse(stored);
                this.presets = data.presets || [];
                this.activePresetId = data.activePresetId || DEFAULT_PRESET_ID;
            }
            this.ensureDefaultPreset();
            this.saveToStorage(); // Persist the updated default preset
            // Auto-load the active preset on startup (don't save during init)
            this.loadPreset(this.activePresetId || DEFAULT_PRESET_ID, false);
        } catch (e) {
            console.error('Failed to load presets:', e);
            toastStore.error('Failed to load presets from storage');
            this.ensureDefaultPreset();
            // Load defaults on error
            designTokens.reset();
        }
    }

    isDefaultPreset(id: string): boolean {
        return id === DEFAULT_PRESET_ID || id === BASIC_HTML_PRESET_ID;
    }

    private saveToStorage() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({
                presets: this.presets,
                activePresetId: this.activePresetId
            }));
        } catch (e) {
            console.error('Failed to save presets:', e);
            toastStore.error('Failed to save presets to storage');
        }
    }

    private generateId(): string {
        return `preset-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    saveCurrentAsPreset(name: string): StylePreset {
        const now = Date.now();
        // Use JSON parse/stringify to clone - structuredClone doesn't work with Svelte proxies
        const tokens = JSON.parse(JSON.stringify(designTokens.tokens));
        const preset: StylePreset = {
            id: this.generateId(),
            name,
            tokens,
            createdAt: now,
            updatedAt: now
        };
        this.presets = [...this.presets, preset];
        this.activePresetId = preset.id;
        this.saveToStorage();
        designTokens.markAsSaved(); // Mark as saved so isDirty resets
        return preset;
    }

    updatePreset(id: string, name?: string): boolean {
        const index = this.presets.findIndex(p => p.id === id);
        if (index === -1) return false;

        // Use JSON parse/stringify to clone - structuredClone doesn't work with Svelte proxies
        const tokens = JSON.parse(JSON.stringify(designTokens.tokens));
        this.presets[index] = {
            ...this.presets[index],
            name: name ?? this.presets[index].name,
            tokens,
            updatedAt: Date.now()
        };
        this.saveToStorage();
        designTokens.markAsSaved(); // Mark as saved so isDirty resets
        return true;
    }

    loadPreset(id: string, save: boolean = true): boolean {
        const preset = this.presets.find(p => p.id === id);
        if (!preset) return false;

        designTokens.importFromJSON(JSON.stringify(preset.tokens));
        designTokens.markAsSaved(); // Mark as saved so isDirty resets

        // Load any Google Fonts used in the preset
        this.loadFontsFromPreset(preset.tokens);

        this.activePresetId = id;
        if (save) this.saveToStorage();
        return true;
    }

    loadFontsFromPreset(tokens: any) {
        // Extract unique font families from the preset
        const fontFamilies = new Set<string>();

        // Check typography fonts
        if (tokens.typography) {
            Object.values(tokens.typography.headings || {}).forEach((heading: any) => {
                if (heading.fontFamily) fontFamilies.add(heading.fontFamily);
            });
            if (tokens.typography.body?.fontFamily) fontFamilies.add(tokens.typography.body.fontFamily);
            if (tokens.typography.bodySmall?.fontFamily) fontFamilies.add(tokens.typography.bodySmall.fontFamily);
            if (tokens.typography.button?.fontFamily) fontFamilies.add(tokens.typography.button.fontFamily);
            if (tokens.typography.buttonLarge?.fontFamily) fontFamilies.add(tokens.typography.buttonLarge.fontFamily);
            if (tokens.typography.buttonSmall?.fontFamily) fontFamilies.add(tokens.typography.buttonSmall.fontFamily);
        }

        // Load Google Fonts (skip system fonts and local fonts)
        fontFamilies.forEach(family => {
            if (family && !family.includes('system-ui') && !family.includes('sans-serif') &&
                !family.includes('serif') && !family.includes('monospace') &&
                !family.includes('Times New Roman')) {
                // Extract base font name (remove fallbacks)
                const baseFont = family.split(',')[0].trim();
                fontStore.loadGoogleFont(baseFont);
            }
        });
    }

    deletePreset(id: string): boolean {
        const index = this.presets.findIndex(p => p.id === id);
        if (index === -1) return false;

        this.presets = this.presets.filter(p => p.id !== id);
        if (this.activePresetId === id) {
            this.activePresetId = null;
        }
        this.saveToStorage();
        return true;
    }

    renamePreset(id: string, name: string): boolean {
        const index = this.presets.findIndex(p => p.id === id);
        if (index === -1) return false;

        this.presets[index] = {
            ...this.presets[index],
            name,
            updatedAt: Date.now()
        };
        this.saveToStorage();
        return true;
    }

    duplicatePreset(id: string): StylePreset | null {
        const preset = this.presets.find(p => p.id === id);
        if (!preset) return null;

        const now = Date.now();
        const newPreset: StylePreset = {
            id: this.generateId(),
            name: `${preset.name} (Copy)`,
            tokens: structuredClone(preset.tokens),
            createdAt: now,
            updatedAt: now
        };
        this.presets = [...this.presets, newPreset];
        this.saveToStorage();
        return newPreset;
    }

    exportPreset(id: string): string | null {
        const preset = this.presets.find(p => p.id === id);
        if (!preset) return null;
        return JSON.stringify(preset, null, 2);
    }

    importPreset(json: string): StylePreset | null {
        try {
            const data = JSON.parse(json);

            if (!data.tokens) {
                toastStore.error('Invalid preset: missing tokens data');
                return null;
            }

            const now = Date.now();
            const preset: StylePreset = {
                id: this.generateId(),
                name: data.name || 'Imported Preset',
                tokens: data.tokens,
                createdAt: now,
                updatedAt: now
            };
            this.presets = [...this.presets, preset];
            this.saveToStorage();
            toastStore.success(`Preset "${preset.name}" imported successfully`);
            return preset;
        } catch (e) {
            toastStore.error('Failed to import preset: invalid JSON format');
            return null;
        }
    }

    // Reset design tokens to defaults - keeps presets intact
    resetToDefaults() {
        this.activePresetId = DEFAULT_PRESET_ID;
        this.loadPreset(DEFAULT_PRESET_ID, false);
    }

    // Get the active preset name
    get activePresetName(): string {
        const preset = this.presets.find(p => p.id === this.activePresetId);
        return preset?.name || 'Default';
    }
}

export const presetsStore = new PresetsStore();
