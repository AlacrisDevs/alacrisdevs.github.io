<script lang="ts">
    import { toastStore, type ToastVariant } from "../stores/toastStore.svelte";
    import { designTokens } from "../stores/designTokens.svelte";
    import Toast from "./Toast.svelte";
    import {
        parseColor,
        blendColors,
        getContrastRatio,
        hexToRgb,
    } from "../utils/colorUtils";

    const toasts = $derived(toastStore.toasts);
    const tokens = $derived(designTokens.tokens);
    const useDesignSystemToasts = $derived(tokens.enableToasts);
    const pageBgColor = $derived(
        tokens.colorVariables.find((v) => v.id === "background")?.value ||
            "#0A121F",
    );
    const pageBgRgb = $derived(
        hexToRgb(pageBgColor) || { r: 10, g: 18, b: 31 },
    );

    // Fallback styles when design system toasts are not enabled
    const getVariantStyles = (variant: ToastVariant): string => {
        const colors: Record<ToastVariant, string> = {
            info: tokens.colors.info,
            success: tokens.colors.success,
            warning: tokens.colors.warning,
            error: tokens.colors.error,
        };
        return `background-color: ${colors[variant]}; color: ${getTextColor(colors[variant])};`;
    };

    const getTextColor = (bgColor: string): string => {
        const parsed = parseColor(bgColor);
        if (!parsed) return "#FFFFFF";

        const blendedRgb =
            parsed.alpha < 1
                ? blendColors(parsed.rgb, pageBgRgb, parsed.alpha)
                : parsed.rgb;

        const white = { r: 255, g: 255, b: 255 };
        const black = { r: 0, g: 0, b: 0 };
        const contrastWithWhite = getContrastRatio(blendedRgb, white);
        const contrastWithBlack = getContrastRatio(blendedRgb, black);
        return contrastWithWhite > contrastWithBlack ? "#FFFFFF" : "#000000";
    };

    const getIcon = (variant: ToastVariant): string => {
        const icons: Record<ToastVariant, string> = {
            info: "info",
            success: "check_circle",
            warning: "warning",
            error: "error",
        };
        return icons[variant];
    };
</script>

{#if toasts.length > 0}
    <div
        class="fixed bottom-4 right-4 z-[9999] flex flex-col gap-3 w-full max-w-[512px]"
    >
        {#each toasts as toast (toast.id)}
            {#if useDesignSystemToasts}
                <!-- Use design system Toast component -->
                <div class="shadow-xl animate-slide-in">
                    <Toast
                        variant={toast.variant}
                        message={toast.message}
                        onclose={() => toastStore.dismiss(toast.id)}
                    />
                </div>
            {:else}
                <!-- Fallback toast design -->
                <div
                    class="p-4 shadow-xl flex items-start gap-4 animate-slide-in"
                    style={getVariantStyles(toast.variant)}
                    role="alert"
                >
                    <span
                        class="material-icons shrink-0"
                        style="font-size: 28px;">{getIcon(toast.variant)}</span
                    >
                    <span
                        class="flex-1 text-base font-medium"
                        style="font-family: {tokens.typography.fontFamily};"
                        >{toast.message}</span
                    >
                    <button
                        class="shrink-0 opacity-60 hover:opacity-100 transition-opacity flex items-center justify-center"
                        onclick={() => toastStore.dismiss(toast.id)}
                        aria-label="Dismiss"
                    >
                        <span class="material-icons" style="font-size: 20px;"
                            >close</span
                        >
                    </button>
                </div>
            {/if}
        {/each}
    </div>
{/if}

<style>
    @keyframes slide-in {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    .animate-slide-in {
        animation: slide-in 0.2s ease-out;
    }
</style>
