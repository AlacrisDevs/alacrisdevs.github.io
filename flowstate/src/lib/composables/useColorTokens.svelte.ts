// src/lib/composables/useColorTokens.svelte.ts
// Composable for color token management

import { designTokens } from '../stores/designTokens.svelte';
import { validateHexColor } from '../stores/tokenValidation';

/**
 * Composable for managing color tokens and variables
 *
 * Provides reactive access to color tokens, color variables, and color manipulation functions.
 * All operations are validated and provide user feedback for invalid inputs.
 *
 * @returns Object containing reactive tokens and color management functions
 *
 * @example
 * ```typescript
 * const { getPrimaryColor, setColor, addColorVariable } = useColorTokens();
 *
 * // Get current primary color
 * const primary = getPrimaryColor();
 *
 * // Update a color (validates hex format)
 * setColor('primary', '#FF5733');
 *
 * // Add a new color variable
 * const varId = addColorVariable('brand', '#00A3E0');
 * ```
 */
export function useColorTokens() {
    const tokens = $derived(designTokens.tokens);

    // Color getters
    /**
     * Get the value of a specific color token
     * @param key - The color token key (e.g., 'primary', 'background', 'text')
     * @returns The hex color value
     */
    const getColorValue = (key: keyof typeof tokens.colors) => tokens.colors[key];

    /**
     * Get the resolved value of a color variable or direct color
     * @param id - Variable ID (e.g., '$primary') or direct hex color
     * @returns The resolved hex color value
     */
    const getColorVariableValue = (id: string) => designTokens.getColorVariableValue(id);

    /**
     * Get the current primary color
     * @returns Primary color hex value
     */
    const getPrimaryColor = () => getColorValue('primary');

    /**
     * Get the current background color
     * @returns Background color hex value
     */
    const getBackgroundColor = () => getColorValue('background');

    /**
     * Get the current text color
     * @returns Text color hex value
     */
    const getTextColor = () => getColorValue('text');

    // Color setters with validation
    /**
     * Update a color token with validation
     * @param key - The color token key to update
     * @param value - New hex color value (must be valid hex format)
     * @throws Shows error toast if color format is invalid
     */
    const setColor = (key: keyof typeof tokens.colors, value: string) => {
        designTokens.updateColor(key, value);
    };

    /**
     * Add a new color variable
     * @param name - Display name for the variable
     * @param value - Hex color value (validated)
     * @returns The generated unique ID for the variable
     */
    const addColorVariable = (name: string, value: string) => {
        return designTokens.addColorVariable(name, value);
    };

    /**
     * Update an existing color variable
     * @param id - Variable ID to update
     * @param updates - Partial updates to apply
     */
    const updateColorVariable = (id: string, updates: Parameters<typeof designTokens.updateColorVariable>[1]) => {
        designTokens.updateColorVariable(id, updates);
    };

    /**
     * Delete a color variable
     * @param id - Variable ID to delete
     */
    const deleteColorVariable = (id: string) => {
        designTokens.deleteColorVariable(id);
    };

    // Lock management
    /**
     * Toggle the lock state of a color token or variable
     * @param id - Color token or variable ID to toggle
     */
    const toggleColorLock = (id: string) => {
        designTokens.toggleColorLock(id);
    };

    /**
     * Check if a color token or variable is locked
     * @param id - Color token or variable ID to check
     * @returns True if locked, false otherwise
     */
    const isColorLocked = (id: string) => {
        return designTokens.isColorLocked(id);
    };

    /**
     * Toggle the lock state of a toast color
     * @param colorKey - Toast color key to toggle
     */
    const toggleToastColorLock = (colorKey: string) => {
        designTokens.toggleToastColorLock(colorKey);
    };

    /**
     * Check if a toast color is locked
     * @param colorKey - Toast color key to check
     * @returns True if locked, false otherwise
     */
    const isToastColorLocked = (colorKey: string) => {
        return designTokens.isToastColorLocked(colorKey);
    };

    return {
        /**
         * Reactive reference to the current design tokens
         */
        tokens,

        // Getters
        getColorValue,
        getColorVariableValue,
        getPrimaryColor,
        getBackgroundColor,
        getTextColor,

        // Setters
        setColor,
        addColorVariable,
        updateColorVariable,
        deleteColorVariable,

        // Locks
        toggleColorLock,
        isColorLocked,
        toggleToastColorLock,
        isToastColorLocked
    };
}