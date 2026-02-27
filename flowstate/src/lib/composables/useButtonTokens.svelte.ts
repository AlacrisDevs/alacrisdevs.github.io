// src/lib/composables/useButtonTokens.svelte.ts
// Composable for button token management
import { designTokens } from '../stores/designTokens.svelte';

export function useButtonTokens() {
    const tokens = $derived(designTokens.tokens);

    // Button getters
    const getButtonSize = (size: 'large' | 'medium' | 'small') => tokens.buttons[size];
    const getButtonVariant = (variant: 'primary' | 'secondary' | 'tertiary') => tokens.buttonVariants[variant];
    const isButtonVariantEnabled = (variant: 'primary' | 'secondary' | 'tertiary') => tokens.enabledButtonVariants[variant];
    const isButtonSizeEnabled = (size: 'small' | 'medium' | 'large') => tokens.enabledButtonSizes[size];
    const areButtonsEnabled = () => tokens.enableButtons;

    // Button setters
    const updateButtonSize = (size: 'large' | 'medium' | 'small', updates: Parameters<typeof designTokens.updateButton>[1]) => {
        designTokens.updateButton(size, updates);
    };

    const updateButtonVariant = (variant: 'primary' | 'secondary' | 'tertiary', updates: Parameters<typeof designTokens.updateButtonVariant>[1]) => {
        designTokens.updateButtonVariant(variant, updates);
    };

    const toggleButtonVariant = (variant: 'primary' | 'secondary' | 'tertiary', enabled: boolean) => {
        designTokens.toggleButtonVariant(variant, enabled);
    };

    const toggleButtonSize = (size: 'small' | 'medium' | 'large', enabled: boolean) => {
        designTokens.toggleButtonSize(size, enabled);
    };

    const toggleButtons = (enabled: boolean) => {
        designTokens.toggleButtons(enabled);
    };

    return {
        // Reactive tokens
        tokens: $derived(tokens),

        // Getters
        getButtonSize,
        getButtonVariant,
        isButtonVariantEnabled,
        isButtonSizeEnabled,
        areButtonsEnabled,

        // Setters
        updateButtonSize,
        updateButtonVariant,
        toggleButtonVariant,
        toggleButtonSize,
        toggleButtons
    };
}