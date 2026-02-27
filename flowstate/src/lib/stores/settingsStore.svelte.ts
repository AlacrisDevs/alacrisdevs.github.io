import { browser } from '$app/environment';
import { toastStore } from './toastStore.svelte';

const STORAGE_KEY = 'design-system-settings';

export type UnitType = 'px' | 'rem';

export interface Settings {
    language: string;
    unit: UnitType;
    themeSpecificLocks: boolean;
}

const DEFAULT_SETTINGS: Settings = {
    language: 'en',
    unit: 'px',
    themeSpecificLocks: true
};

class SettingsStore {
    settings = $state<Settings>(DEFAULT_SETTINGS);

    constructor() {
        if (browser) {
            this.loadFromStorage();
        }
    }

    private loadFromStorage() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                this.settings = { ...DEFAULT_SETTINGS, ...parsed };
            }
        } catch (e) {
            console.error('Failed to load settings:', e);
            toastStore.error('Failed to load settings from storage');
        }
    }

    private saveToStorage() {
        if (!browser) return;
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.settings));
        } catch (e) {
            console.error('Failed to save settings:', e);
            toastStore.error('Failed to save settings to storage');
        }
    }

    setLanguage(language: string) {
        this.settings.language = language;
        this.saveToStorage();
    }

    setUnit(unit: UnitType) {
        this.settings.unit = unit;
        this.saveToStorage();
    }

    setThemeSpecificLocks(enabled: boolean) {
        this.settings.themeSpecificLocks = enabled;
        this.saveToStorage();
    }

    get language() {
        return this.settings.language;
    }

    get unit() {
        return this.settings.unit;
    }

    get themeSpecificLocks() {
        return this.settings.themeSpecificLocks;
    }
}

export const settingsStore = new SettingsStore();
