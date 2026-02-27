// src/lib/stores/settingsStore.test.ts
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

describe('settingsStore', () => {
    let settingsStore: any;

    beforeEach(() => {
        // Reset mocks
        vi.clearAllMocks();
    });

    it('should initialize with default settings', async () => {
        const module = await import('./settingsStore.svelte');
        settingsStore = module.settingsStore;

        expect(settingsStore.settings).toEqual({
            language: 'en',
            unit: 'px',
            themeSpecificLocks: true
        });
    });

    it('should save settings to localStorage', async () => {
        const module = await import('./settingsStore.svelte');
        settingsStore = module.settingsStore;

        settingsStore.setLanguage('et');
        expect(window.localStorage.setItem).toHaveBeenCalledWith(
            'design-system-settings',
            JSON.stringify({ language: 'et', unit: 'px', themeSpecificLocks: true })
        );
    });

    it('should provide getter methods', async () => {
        const module = await import('./settingsStore.svelte');
        settingsStore = module.settingsStore;

        expect(settingsStore.language).toBe('en');
        expect(settingsStore.unit).toBe('px');
        expect(settingsStore.themeSpecificLocks).toBe(true);
    });

    it('should update settings', async () => {
        const module = await import('./settingsStore.svelte');
        settingsStore = module.settingsStore;

        settingsStore.setUnit('rem');
        expect(settingsStore.unit).toBe('rem');

        settingsStore.setThemeSpecificLocks(false);
        expect(settingsStore.themeSpecificLocks).toBe(false);
    });
});