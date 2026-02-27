// src/lib/utils/buttonValidation.ts
// Zod schemas for button configuration validation

import { z } from 'zod';

export const ButtonSizeSchema = z.object({
    paddingX: z.string(),
    paddingY: z.string(),
    minWidth: z.string(),
    borderRadius: z.string(),
    textTransform: z.enum(['none', 'uppercase', 'lowercase', 'capitalize']),
    animation: z.enum(['none', 'fade', 'scale', 'both']),
    transitionDuration: z.string()
});

export const ButtonVariantSchema = z.object({
    bgColor: z.string(),
    textColor: z.string(),
    borderColor: z.string(),
    borderWidth: z.string(),
    borderStyle: z.enum(['none', 'solid', 'bottom']),
    borderPosition: z.enum(['inside', 'center', 'outside']),
    hoverBgColor: z.string(),
    hoverTextColor: z.string(),
    hoverBorderColor: z.string(),
    activeBgColor: z.string(),
    activeTextColor: z.string(),
    activeBorderColor: z.string(),
    disabledBgColor: z.string(),
    disabledTextColor: z.string(),
    disabledBorderColor: z.string(),
    disabledOpacity: z.string()
});

export const DesignTokensSchema = z.object({
    // ... other fields would go here
    buttons: z.object({
        large: ButtonSizeSchema,
        medium: ButtonSizeSchema,
        small: ButtonSizeSchema
    }),
    buttonVariants: z.object({
        primary: ButtonVariantSchema,
        secondary: ButtonVariantSchema,
        tertiary: ButtonVariantSchema
    })
});

export type ButtonSizeTokens = z.infer<typeof ButtonSizeSchema>;
export type ButtonVariantTokens = z.infer<typeof ButtonVariantSchema>;