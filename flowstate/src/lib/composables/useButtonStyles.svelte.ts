import { useButtonTokens } from './useButtonTokens.svelte';
import { useColorTokens } from './useColorTokens.svelte';
import { useTypographyTokens } from './useTypographyTokens.svelte';
import {
    getContrastingTextColor,
    getContrastRatioFromHex,
    lightenColor,
    darkenColor,
    colorWithOpacity
} from '../utils/colorUtils';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary';
export type ButtonSize = 'large' | 'medium' | 'small';
export type ButtonState = 'default' | 'hover' | 'active' | 'disabled';

export interface StateColors {
    bg: string;
    border: string;
}

export interface ComputedStateColors {
    default: StateColors;
    hover: StateColors;
    active: StateColors;
    disabled?: StateColors;
}

export interface ButtonStyleOptions {
    variant: ButtonVariant;
    size: ButtonSize;
    includeDisabled?: boolean;
}

/**
 * Svelte 5 rune-based composable for button styling logic.
 */
export function useButtonStyles(options: ButtonStyleOptions) {
    const { variant, size, includeDisabled = true } = options;

    const { tokens: buttonTokens } = useButtonTokens();
    const { tokens: colorTokens, getColorVariableValue } = useColorTokens();
    const { tokens: typographyTokens } = useTypographyTokens();

    const tokens = $derived(colorTokens); // Use colorTokens as main tokens for compatibility
    const btnTokens = $derived(buttonTokens.buttons[size]);
    const variantTokens = $derived(buttonTokens.buttonVariants[variant]);
    const variantSizeTokens = $derived(variantTokens[size]);
    const typoTokens = $derived(
        size === 'large' ? typographyTokens.typography.buttonLarge :
            size === 'medium' ? typographyTokens.typography.button :
                typographyTokens.typography.buttonSmall
    );

    const primaryColor = $derived.by(() => {
        return getColorVariableValue('$primary') || '#00A3E0';
    });

    const resolveColor = (color: string): string => {
        if (color.startsWith('$')) {
            return getColorVariableValue(color);
        }
        return color;
    };

    const computeStateColors = $derived.by((): ComputedStateColors => {
        const v: typeof variantTokens = variantTokens;
        const primary = primaryColor;

        if (variant === 'primary') {
            const base: ComputedStateColors = {
                default: {
                    bg: resolveColor(v.bgColor),
                    border: resolveColor(v.borderColor)
                },
                hover: {
                    bg: resolveColor(v.hoverBgColor),
                    border: resolveColor(v.hoverBorderColor)
                },
                active: {
                    bg: resolveColor(v.activeBgColor),
                    border: resolveColor(v.activeBorderColor)
                }
            };

            if (includeDisabled) {
                base.disabled = {
                    bg: resolveColor(v.disabledBgColor),
                    border: resolveColor(v.disabledBorderColor)
                };
            }

            return base;
        }

        if (variant === 'secondary') {
            const base: ComputedStateColors = {
                default: {
                    bg: resolveColor(v.bgColor),
                    border: resolveColor(v.borderColor)
                },
                hover: {
                    bg: resolveColor(v.hoverBgColor),
                    border: resolveColor(v.hoverBorderColor)
                },
                active: {
                    bg: resolveColor(v.activeBgColor),
                    border: resolveColor(v.activeBorderColor)
                }
            };

            if (includeDisabled) {
                base.disabled = {
                    bg: resolveColor(v.disabledBgColor),
                    border: resolveColor(v.disabledBorderColor)
                };
            }

            return base;
        }

        // tertiary
        const base: ComputedStateColors = {
            default: {
                bg: resolveColor(v.bgColor),
                border: resolveColor(v.borderColor)
            },
            hover: {
                bg: resolveColor(v.hoverBgColor),
                border: resolveColor(v.hoverBorderColor)
            },
            active: {
                bg: resolveColor(v.activeBgColor),
                border: resolveColor(v.activeBorderColor)
            }
        };

        if (includeDisabled) {
            base.disabled = {
                bg: resolveColor(v.disabledBgColor),
                border: resolveColor(v.disabledBorderColor)
            };
        }

        return base;
    });

    const primaryTextColor = $derived.by(() => {
        if (variant !== 'primary') return tokens.colors.text;

        const stateColors = computeStateColors;
        const lightColor = tokens.colors.text;
        const darkColor = tokens.colors.background;

        const backgrounds = [stateColors.default.bg, stateColors.hover.bg, stateColors.active.bg];

        if (includeDisabled && stateColors.disabled) {
            backgrounds.push(stateColors.disabled.bg);
        }

        let lightGoodCount = 0;
        let darkGoodCount = 0;

        for (const bg of backgrounds) {
            const resolved: string = resolveColor(bg);
            const lightContrast = getContrastRatioFromHex(resolved, lightColor);
            const darkContrast = getContrastRatioFromHex(resolved, darkColor);

            if (lightContrast >= 4.5) lightGoodCount++;
            if (darkContrast >= 4.5) darkGoodCount++;
        }

        const threshold = includeDisabled ? 3 : 2;
        if (darkGoodCount >= threshold) return darkColor;
        if (lightGoodCount >= threshold) return lightColor;

        return darkGoodCount > lightGoodCount ? darkColor : lightColor;
    });

    const getAutoTextColor = (bgColor: string): string => {
        const resolved = resolveColor(bgColor);

        if (variant === 'primary') {
            return primaryTextColor;
        }

        if (resolved === 'transparent' || resolved.startsWith('rgba')) {
            const pageBg = getColorVariableValue('$background');
            return getContrastingTextColor(pageBg, colorTokens.colors.text, colorTokens.colors.background);
        }

        return getContrastingTextColor(resolved, colorTokens.colors.text, colorTokens.colors.background);
    };

    const animationStyle = $derived.by(() => {
        const anim = btnTokens.animation;
        const duration = btnTokens.transitionDuration || '150ms';
        if (anim === 'none') return 'transition: none;';
        if (anim === 'fade')
            return `transition: opacity ${duration} ease, background-color ${duration} ease, border-color ${duration} ease, color ${duration} ease, box-shadow ${duration} ease;`;
        if (anim === 'scale') return `transition: transform ${duration} ease;`;
        return `transition: background-color ${duration} ease, color ${duration} ease, box-shadow ${duration} ease, opacity ${duration} ease;`;
    });

    const getBorderStyle = (color: string): string => {
        const bw = variantSizeTokens.borderWidth;
        const bs = variantSizeTokens.borderStyle;
        const bp = variantSizeTokens.borderPosition;

        if (bs === 'none' || bw === '0px') return 'border: none; box-sizing: border-box;';

        if (bp === 'inside') {
            if (bs === 'bottom') {
                return `border: none; box-shadow: inset 0 -${bw} 0 0 ${color}; box-sizing: border-box;`;
            }
            return `border: none; box-shadow: inset 0 0 0 ${bw} ${color}; box-sizing: border-box;`;
        }

        if (bs === 'bottom') {
            return `border: none; border-bottom: ${bw} solid ${color}; box-sizing: content-box;`;
        }
        return `border: ${bw} solid ${color}; box-sizing: ${bp === 'center' ? 'border-box' : 'content-box'};`;
    };

    const baseStyles = $derived(`
		font-family: ${typoTokens.fontFamily};
		font-weight: ${typoTokens.fontWeight};
		font-size: ${typoTokens.fontSize};
		text-transform: ${btnTokens.textTransform};
		min-width: ${variantSizeTokens.borderStyle === 'bottom' ? 'auto' : btnTokens.minWidth};
		padding: ${variantSizeTokens.borderStyle === 'bottom' ? '0' : `${btnTokens.paddingY} ${btnTokens.paddingX}`};
		border-radius: ${btnTokens.borderRadius};
		${animationStyle}
	`);

    const getStateStyles = (state: ButtonState): string => {
        const v: typeof variantTokens = variantTokens;
        const stateColors = computeStateColors;

        if (state === 'disabled' && stateColors.disabled) {
            const bgColor = stateColors.disabled.bg;
            const borderColor = stateColors.disabled.border;
            const textColor = resolveColor(v.disabledTextColor);
            return `
				background-color: ${bgColor};
				color: ${textColor};
				${getBorderStyle(borderColor)}
				opacity: ${v.disabledOpacity};
			`;
        }

        if (state === 'active') {
            const bgColor = stateColors.active.bg;
            const borderColor = stateColors.active.border;
            const textColor = resolveColor(v.activeTextColor);
            return `
				background-color: ${bgColor};
				color: ${textColor};
				${getBorderStyle(borderColor)}
			`;
        }

        if (state === 'hover') {
            const bgColor = stateColors.hover.bg;
            const borderColor = stateColors.hover.border;
            const textColor = resolveColor(v.hoverTextColor);
            return `
				background-color: ${bgColor};
				color: ${textColor};
				${getBorderStyle(borderColor)}
				cursor: pointer;
			`;
        }

        // default state
        const bgColor = stateColors.default.bg;
        const borderColor = stateColors.default.border;
        const textColor = resolveColor(v.textColor);
        return `
			background-color: ${bgColor};
			color: ${textColor};
			${getBorderStyle(borderColor)}
		`;
    };

    return {
        tokens: colorTokens,
        btnTokens,
        variantTokens,
        variantSizeTokens,
        typoTokens,
        primaryColor,
        computeStateColors,
        primaryTextColor,
        baseStyles,
        resolveColor,
        getAutoTextColor,
        getBorderStyle,
        getStateStyles
    };
}
