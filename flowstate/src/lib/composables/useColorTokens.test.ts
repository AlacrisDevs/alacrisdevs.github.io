// src/lib/composables/useColorTokens.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useColorTokens } from './useColorTokens.svelte';

// Mock the designTokens store
vi.mock('../stores/designTokens.svelte', () => ({
    designTokens: {
        tokens: {
            colors: {
                primary: '#00A3E0',
                background: '#0A121F',
                text: '#FFFFFF',
                accent: '#FFAB00',
                info: '#00A3E0',
                warning: '#FFAB00',
                error: '#FF4444',
                success: '#00C853'
            },
            colorVariables: [
                { id: 'primary', name: 'Primary', value: '#00A3E0' },
                { id: 'background', name: 'Background', value: '#0A121F' }
            ],
            lockedColors: {}
        },
        getColorVariableValue: vi.fn((id) => {
            if (id === '$primary') return '#00A3E0';
            if (id === '$background') return '#0A121F';
            return id;
        }),
        toggleColorLock: vi.fn(),
        isColorLocked: vi.fn(() => false),
        toggleToastColorLock: vi.fn(),
        isToastColorLocked: vi.fn(() => false),
        addColorVariable: vi.fn(() => 'var_123'),
        updateColorVariable: vi.fn(),
        deleteColorVariable: vi.fn(),
        updateColor: vi.fn()
    }
}));

describe('useColorTokens', () => {
    let composable: ReturnType<typeof useColorTokens>;

    beforeEach(() => {
        composable = useColorTokens();
    });

    it('should return reactive tokens', () => {
        expect(composable.tokens).toBeDefined();
        expect(composable.tokens.colors.primary).toBe('#00A3E0');
    });

    it('should provide color getters', () => {
        expect(composable.getColorValue('primary')).toBe('#00A3E0');
        expect(composable.getPrimaryColor()).toBe('#00A3E0');
        expect(composable.getBackgroundColor()).toBe('#0A121F');
        expect(composable.getTextColor()).toBe('#FFFFFF');
    });

    it('should provide color variable getters', () => {
        expect(composable.getColorVariableValue('$primary')).toBe('#00A3E0');
        expect(composable.getColorVariableValue('$background')).toBe('#0A121F');
    });

    it('should provide lock management functions', () => {
        composable.toggleColorLock('primary');
        expect(composable.isColorLocked('primary')).toBe(false);

        composable.toggleToastColorLock('info');
        expect(composable.isToastColorLocked('info')).toBe(false);
    });

    it('should provide color variable management', () => {
        const id = composable.addColorVariable('Test', '#123456');
        expect(id).toBe('var_123');

        composable.updateColorVariable(id, { name: 'Updated' });
        composable.deleteColorVariable(id);
    });

    it('should provide color setters', () => {
        composable.setColor('primary', '#FF0000');
        // Verify the function was called (mock will handle verification)
    });
});