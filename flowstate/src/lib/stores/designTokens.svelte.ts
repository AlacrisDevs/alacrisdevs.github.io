// Design tokens store using Svelte 5 runes - types and exports
import { TokenCoreStore } from './tokenCore.svelte';

export interface ColorToken {
    name: string;
    value: string;
}

export interface ColorVariable {
    id: string;
    name: string;
    value: string;
    locked?: boolean;
}

export interface TypographyToken {
    name: string;
    fontFamily: string;
    fontSize: string;
    fontWeight: string;
    lineHeight: string;
    letterSpacing: string;
    textTransform: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
}

export interface ButtonSizeTokens {
    paddingX: string;
    paddingY: string;
    minWidth: string;
    borderRadius: string;
    textTransform: string;
    animation: 'none' | 'fade' | 'scale' | 'both';
    transitionDuration: string;
}

export interface ButtonVariantTokens {
    // Layout per size (flattened)
    large: {
        borderWidth: string;
        borderStyle: 'none' | 'solid' | 'bottom';
        borderPosition: 'inside' | 'center' | 'outside';
    };
    medium: {
        borderWidth: string;
        borderStyle: 'none' | 'solid' | 'bottom';
        borderPosition: 'inside' | 'center' | 'outside';
    };
    small: {
        borderWidth: string;
        borderStyle: 'none' | 'solid' | 'bottom';
        borderPosition: 'inside' | 'center' | 'outside';
    };
    // Colors per state (simplified, no override flags)
    bgColor: string;
    textColor: string;
    borderColor: string;
    hoverBgColor: string;
    hoverTextColor: string;
    hoverBorderColor: string;
    activeBgColor: string;
    activeTextColor: string;
    activeBorderColor: string;
    disabledBgColor: string;
    disabledTextColor: string;
    disabledBorderColor: string;
    disabledOpacity: string;
}

export type ThemeMode = 'light' | 'dark';

export interface DesignTokens {
    unit: 'px' | 'rem';
    themeMode: ThemeMode;
    defaultThemeMode: ThemeMode;
    enableButtons: boolean;
    enableToasts: boolean;
    enableToastHeadings: boolean;
    enabledButtonVariants: {
        primary: boolean;
        secondary: boolean;
        tertiary: boolean;
    };
    enabledButtonSizes: {
        small: boolean;
        medium: boolean;
        large: boolean;
    };
    colorVariables: ColorVariable[];
    colors: {
        text: string;
        background: string;
        primary: string;
        accent: string;
        // Toast colors
        info: string;
        warning: string;
        error: string;
        success: string;
    };
    lockedColors: Record<string, boolean>;
    typography: {
        fontFamily: string;
        headingFontFamily: string;
        buttonFontFamily: string;
        baseFontSize: string;
        headings: {
            h1: TypographyToken;
            h2: TypographyToken;
            h3: TypographyToken;
            h4: TypographyToken;
            h5: TypographyToken;
            h6: TypographyToken;
        };
        body: TypographyToken;
        bodySmall: TypographyToken;
        buttonLarge: TypographyToken;
        button: TypographyToken;
        buttonSmall: TypographyToken;
    };
    buttons: {
        large: ButtonSizeTokens;
        medium: ButtonSizeTokens;
        small: ButtonSizeTokens;
    };
    buttonVariants: {
        primary: ButtonVariantTokens;
        secondary: ButtonVariantTokens;
        tertiary: ButtonVariantTokens;
    };
    spacing: {
        unit: string;
    };
}

export const designTokens = new TokenCoreStore();
