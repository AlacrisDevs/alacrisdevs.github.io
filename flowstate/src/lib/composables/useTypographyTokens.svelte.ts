// src/lib/composables/useTypographyTokens.svelte.ts
// Composable for typography token management
import { designTokens } from '../stores/designTokens.svelte';

export function useTypographyTokens() {
    const tokens = $derived(designTokens.tokens);

    // Typography getters
    const getFontFamily = () => tokens.typography.fontFamily;
    const getHeadingFontFamily = () => tokens.typography.headingFontFamily;
    const getButtonFontFamily = () => tokens.typography.buttonFontFamily;
    const getBaseFontSize = () => tokens.typography.baseFontSize;
    const getHeading = (key: keyof typeof tokens.typography.headings) => tokens.typography.headings[key];
    const getBody = () => tokens.typography.body;
    const getBodySmall = () => tokens.typography.bodySmall;
    const getButtonLarge = () => tokens.typography.buttonLarge;
    const getButton = () => tokens.typography.button;
    const getButtonSmall = () => tokens.typography.buttonSmall;

    // Typography setters
    const setFontFamily = (value: string) => {
        designTokens.updateTypography('fontFamily', value);
    };

    const setHeadingFontFamily = (value: string) => {
        designTokens.updateTypography('headingFontFamily', value);
    };

    const setButtonFontFamily = (value: string) => {
        designTokens.updateTypography('buttonFontFamily', value);
    };

    const setBaseFontSize = (value: string) => {
        designTokens.updateTypography('baseFontSize', value);
    };

    const updateHeading = (key: keyof typeof tokens.typography.headings, updates: Parameters<typeof designTokens.updateHeading>[1]) => {
        designTokens.updateHeading(key, updates);
    };

    const updateBody = (updates: Parameters<typeof designTokens.updateBody>[0]) => {
        designTokens.updateBody(updates);
    };

    const updateBodySmall = (updates: Parameters<typeof designTokens.updateBodySmall>[0]) => {
        designTokens.updateBodySmall(updates);
    };

    const updateButtonLargeTypography = (updates: Parameters<typeof designTokens.updateButtonLargeTypography>[0]) => {
        designTokens.updateButtonLargeTypography(updates);
    };

    const updateButtonTypography = (updates: Parameters<typeof designTokens.updateButtonTypography>[0]) => {
        designTokens.updateButtonTypography(updates);
    };

    const updateButtonSmallTypography = (updates: Parameters<typeof designTokens.updateButtonSmallTypography>[0]) => {
        designTokens.updateButtonSmallTypography(updates);
    };

    return {
        // Reactive tokens
        tokens: $derived(tokens),

        // Getters
        getFontFamily,
        getHeadingFontFamily,
        getButtonFontFamily,
        getBaseFontSize,
        getHeading,
        getBody,
        getBodySmall,
        getButtonLarge,
        getButton,
        getButtonSmall,

        // Setters
        setFontFamily,
        setHeadingFontFamily,
        setButtonFontFamily,
        setBaseFontSize,
        updateHeading,
        updateBody,
        updateBodySmall,
        updateButtonLargeTypography,
        updateButtonTypography,
        updateButtonSmallTypography
    };
}