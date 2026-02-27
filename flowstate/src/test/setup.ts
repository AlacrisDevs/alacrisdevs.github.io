// src/test/setup.ts
import { vi } from 'vitest';

// Mock SvelteKit modules
vi.mock('$app/environment', () => ({
    browser: true,
    dev: true,
}));

vi.mock('$app/stores', () => ({
    page: {
        subscribe: vi.fn(),
        set: vi.fn(),
    },
    navigating: {
        subscribe: vi.fn(),
    },
    updated: {
        check: vi.fn(),
    },
}));

// Mock localStorage
Object.defineProperty(window, 'localStorage', {
    value: {
        getItem: vi.fn(() => null),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
    },
    writable: true,
});

// Mock navigator.clipboard
Object.defineProperty(navigator, 'clipboard', {
    value: {
        writeText: vi.fn().mockResolvedValue(undefined),
        readText: vi.fn().mockResolvedValue(''),
    },
    writable: true,
});