<script lang="ts">
	import { designTokens } from "../stores/designTokens.svelte";
	import {
		getContrastingTextColor,
		getContrastRatioFromHex,
		lightenColor,
		darkenColor,
		colorWithOpacity,
	} from "../utils/colorUtils";

	type ButtonVariant = "primary" | "secondary" | "tertiary";
	type ButtonSize = "large" | "medium" | "small";
	type ButtonState = "default" | "hover" | "active" | "disabled";

	interface Props {
		variant?: ButtonVariant;
		size?: ButtonSize;
		fixedState?: ButtonState;
		disabled?: boolean;
		label?: string;
		onclick?: () => void;
	}

	let {
		variant = "primary",
		size = "large",
		fixedState,
		disabled = false,
		label = "Button",
		onclick,
	}: Props = $props();

	let interactiveState = $state<ButtonState>("default");
	const effectiveState = $derived(
		fixedState ?? (disabled ? "disabled" : interactiveState),
	);

	// All styling is now fully reactive
	const tokens = $derived(designTokens.tokens);
	const btnTokens = $derived(tokens.buttons[size]);
	const variantTokens = $derived(tokens.buttonVariants[variant]);
	const variantSizeTokens = $derived(variantTokens[size]);
	const typoTokens = $derived(
		size === "large"
			? tokens.typography.buttonLarge
			: size === "medium"
				? tokens.typography.button
				: tokens.typography.buttonSmall,
	);
	const primaryColor = $derived(
		tokens.colorVariables.find((v) => v.id === "primary")?.value ||
			"#00A3E0",
	);

	function resolveColor(color: string): string {
		if (color.startsWith("$")) {
			const varId = color.slice(1);
			return (
				tokens.colorVariables.find((v) => v.id === varId)?.value ||
				color
			);
		}
		return color;
	}

	const stateColors = $derived.by(() => {
		const v = variantTokens;

		if (variant === "primary") {
			return {
				default: { bg: resolveColor(v.bgColor), border: "transparent" },
				hover: { bg: resolveColor(v.hoverBgColor), border: "transparent" },
				active: { bg: resolveColor(v.activeBgColor), border: "transparent" },
				disabled: { bg: resolveColor(v.disabledBgColor), border: "transparent" }
			};
		}

		if (variant === "secondary") {
			return {
				default: { bg: resolveColor(v.bgColor), border: resolveColor(v.borderColor) },
				hover: { bg: resolveColor(v.hoverBgColor), border: resolveColor(v.hoverBorderColor) },
				active: { bg: resolveColor(v.activeBgColor), border: resolveColor(v.activeBorderColor) },
				disabled: { bg: resolveColor(v.disabledBgColor), border: resolveColor(v.disabledBorderColor) }
			};
		}

		// Tertiary
		return {
			default: { bg: resolveColor(v.bgColor), border: "transparent" },
			hover: { bg: resolveColor(v.hoverBgColor), border: "transparent" },
			active: { bg: resolveColor(v.activeBgColor), border: "transparent" },
			disabled: { bg: resolveColor(v.disabledBgColor), border: "transparent" }
		};
	});

	function getTextColor(bgColor: string): string {
		const resolved = resolveColor(bgColor);
		if (resolved === "transparent" || resolved.startsWith("rgba")) {
			const pageBg =
				tokens.colorVariables.find((v) => v.id === "background")
					?.value || tokens.colors.background;
			return getContrastingTextColor(
				pageBg,
				tokens.colors.text,
				tokens.colors.background,
			);
		}
		return getContrastingTextColor(
			resolved,
			tokens.colors.text,
			tokens.colors.background,
		);
	}

	function getBorderStyle(color: string): string {
		const bw = variantSizeTokens.borderWidth;
		const bs = variantSizeTokens.borderStyle;
		const bp = variantSizeTokens.borderPosition;
		if (bs === "none" || bw === "0px") return "border: none;";
		if (bp === "inside") {
			return bs === "bottom"
				? `border: none; box-shadow: inset 0 -${bw} 0 0 ${color};`
				: `border: none; box-shadow: inset 0 0 0 ${bw} ${color};`;
		}
		if (bs === "bottom")
			return `border: none; border-bottom: ${bw} solid ${color};`;
		return `border: ${bw} solid ${color};`;
	}

	const baseStyles = $derived(`
		font-family: ${typoTokens.fontFamily};
		font-weight: ${typoTokens.fontWeight};
		font-size: ${typoTokens.fontSize};
		text-transform: ${typoTokens.textTransform};
		min-width: ${variantSizeTokens.borderStyle === "bottom" ? "auto" : btnTokens.minWidth};
		padding: ${variantSizeTokens.borderStyle === "bottom" ? "0" : `${btnTokens.paddingY} ${btnTokens.paddingX}`};
		border-radius: ${btnTokens.borderRadius};
		transition: background-color 150ms ease, color 150ms ease;
	`);

	const currentColors = $derived(
		stateColors[effectiveState] || stateColors.default,
	);

	// For primary buttons, determine uniform text color based on default state
	const textColor = $derived.by(() => {
		const v = variantTokens;
		// Use text color based on current state
		switch (effectiveState) {
			case "disabled":
				return resolveColor(v.disabledTextColor);
			case "active":
				return resolveColor(v.activeTextColor);
			case "hover":
				return resolveColor(v.hoverTextColor);
			default:
				return resolveColor(v.textColor);
		}
	});

	const variantStyles = $derived(`
		background-color: ${currentColors.bg};
		color: ${textColor};
		${getBorderStyle(currentColors.border)}
		${effectiveState === "disabled" ? `opacity: ${variantTokens.disabledOpacity};` : ""}
	`);

	function handleMouseEnter() {
		if (!disabled && !fixedState) interactiveState = "hover";
	}

	function handleMouseLeave() {
		if (!disabled && !fixedState) interactiveState = "default";
	}

	function handleMouseDown() {
		if (!disabled && !fixedState) interactiveState = "active";
	}

	function handleMouseUp() {
		if (!disabled && !fixedState) interactiveState = "hover";
	}

	function handleClick() {
		if (!disabled && onclick) onclick();
	}
</script>

<button
	style="{baseStyles} {variantStyles}"
	disabled={disabled || fixedState === "disabled"}
	onclick={handleClick}
	onmouseenter={handleMouseEnter}
	onmouseleave={handleMouseLeave}
	onmousedown={handleMouseDown}
	onmouseup={handleMouseUp}
	class="inline-flex items-center justify-center whitespace-nowrap {fixedState
		? ''
		: 'cursor-pointer'}"
>
	{label}
</button>
