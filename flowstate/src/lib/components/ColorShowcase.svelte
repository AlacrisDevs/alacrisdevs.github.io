<script lang="ts">
    import { designTokens } from "../stores/designTokens.svelte";
    import {
        getContrastRatio,
        getContrastRating,
        parseColor,
        blendColors,
        hexToRgb,
        rgbToHex,
    } from "../utils/colorUtils";
    import * as m from "$lib/paraglide/messages/_index.js";

    const tokens = $derived(designTokens.tokens);
    const isDark = $derived(tokens.themeMode === "dark");
    const textColor = $derived(
        tokens.colorVariables.find((v) => v.id === "text")?.value || "#000000",
    );
    const bgColor = $derived(
        tokens.colorVariables.find((v) => v.id === "background")?.value ||
            "#0A121F",
    );
    const bgRgb = $derived(hexToRgb(bgColor) || { r: 10, g: 18, b: 31 });
    const textRgb = $derived(hexToRgb(textColor) || { r: 255, g: 255, b: 255 });

    // Helper to get translated label for core colors
    function getTranslatedLabel(id: string, name: string): string {
        if (id === "primary") return m.primary();
        if (id === "accent") return m.accent();
        if (id === "text") return m.text();
        if (id === "background") return m.background();
        return name;
    }

    // Use colorVariables from designTokens as theme colors
    const themeColors = $derived(
        tokens.colorVariables.map((v) => ({
            key: v.id,
            label: getTranslatedLabel(v.id, v.name),
            value: v.value,
        })),
    );

    const toastColors = $derived([
        { key: "info", label: m.info(), value: tokens.colors.info },
        { key: "success", label: m.success(), value: tokens.colors.success },
        { key: "warning", label: m.warning(), value: tokens.colors.warning },
        { key: "error", label: m.error(), value: tokens.colors.error },
    ]);

    // Get the effective RGB after alpha blending with background
    function getBlendedRgb(colorValue: string) {
        const parsed = parseColor(colorValue);
        if (!parsed) return bgRgb;
        return parsed.alpha < 1
            ? blendColors(parsed.rgb, bgRgb, parsed.alpha)
            : parsed.rgb;
    }

    function getContrast(colorValue: string) {
        const blendedRgb = getBlendedRgb(colorValue);
        const bgContrast = getContrastRatio(blendedRgb, bgRgb);
        const textContrast = getContrastRatio(blendedRgb, textRgb);
        return { bg: bgContrast, text: textContrast };
    }

    // Get best text color for a swatch, accounting for alpha blending
    function getSwatchTextColor(colorValue: string): string {
        const blendedRgb = getBlendedRgb(colorValue);
        const white = { r: 255, g: 255, b: 255 };
        const black = { r: 0, g: 0, b: 0 };
        const contrastWithWhite = getContrastRatio(blendedRgb, white);
        const contrastWithBlack = getContrastRatio(blendedRgb, black);
        return contrastWithWhite > contrastWithBlack ? "#FFFFFF" : "#000000";
    }
</script>

<div
    class="color-showcase"
    style="color: {textColor}; font-family: {tokens.typography.fontFamily}"
>
    <h2
        class="mb-4"
        style="font-family: {tokens.typography.headings.h3
            .fontFamily}; font-size: {tokens.typography.headings.h3
            .fontSize}; font-weight: {tokens.typography.headings.h3
            .fontWeight}; color: {textColor}"
    >
        {m.colors()}
    </h2>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Theme Colors -->
        <div>
            <div
                class="mb-2"
                style="font-family: {tokens.typography.body
                    .fontFamily}; font-size: {tokens.typography.body
                    .fontSize}; font-weight: 500; color: {textColor}; opacity: 0.7"
            >
                {m.theme_colors()}
            </div>
            <div class="space-y-2">
                {#each themeColors as color}
                    {@const contrast = getContrast(color.value)}
                    {@const bgRating = getContrastRating(contrast.bg, isDark)}
                    <div class="flex items-center gap-3">
                        <div
                            class="w-10 h-10 rounded shrink-0 flex items-center justify-center text-xs font-bold"
                            style="background-color: {color.value}; color: {getSwatchTextColor(
                                color.value,
                            )}; border: 1px solid {textColor}20"
                        >
                            Aa
                        </div>
                        <div class="flex-1 min-w-0">
                            <div
                                class="truncate"
                                style="font-family: {tokens.typography.body
                                    .fontFamily}; font-size: {tokens.typography
                                    .body.fontSize}; font-weight: {tokens
                                    .typography.body
                                    .fontWeight}; color: {textColor}"
                            >
                                {color.label}
                            </div>
                            <div
                                class="truncate"
                                style="font-family: {tokens.typography.body
                                    .fontFamily}; font-size: {tokens.typography
                                    .body
                                    .fontSize}; color: {textColor}; opacity: 0.7"
                            >
                                {color.value}
                            </div>
                        </div>
                        {#if color.key !== "background"}
                            <div class="flex items-center gap-2 shrink-0">
                                <span
                                    style="font-family: {tokens.typography.body
                                        .fontFamily}; font-size: {tokens
                                        .typography.body
                                        .fontSize}; color: {textColor}; opacity: 0.6"
                                >
                                    {contrast.bg % 1 === 0
                                        ? contrast.bg
                                        : contrast.bg.toFixed(1)}:1
                                </span>
                                <span
                                    class="px-2 py-0.5 text-xs font-medium"
                                    style="background-color: {bgRating.color}20; color: {bgRating.color}"
                                >
                                    {bgRating.label}
                                </span>
                            </div>
                        {/if}
                    </div>
                {/each}
            </div>
        </div>

        <!-- Toast Colors -->
        {#if tokens.enableToasts}
            <div>
                <div
                    class="mb-2"
                    style="font-family: {tokens.typography.bodySmall
                        .fontFamily}; font-size: {tokens.typography.bodySmall
                        .fontSize}; font-weight: 500; color: {textColor}; opacity: 0.7"
                >
                    {m.toast_colors()}
                </div>
                <div class="space-y-2">
                    {#each toastColors as color}
                        {@const contrast = getContrast(color.value)}
                        {@const bgRating = getContrastRating(
                            contrast.bg,
                            isDark,
                        )}
                        <div class="flex items-center gap-3">
                            <div
                                class="w-10 h-10 rounded shrink-0 flex items-center justify-center text-xs font-bold"
                                style="background-color: {color.value}; color: {getSwatchTextColor(
                                    color.value,
                                )}; border: 1px solid {textColor}20"
                            >
                                Aa
                            </div>
                            <div class="flex-1 min-w-0">
                                <div
                                    class="truncate"
                                    style="font-family: {tokens.typography.body
                                        .fontFamily}; font-size: {tokens
                                        .typography.body
                                        .fontSize}; font-weight: {tokens
                                        .typography.body
                                        .fontWeight}; color: {textColor}"
                                >
                                    {color.label}
                                </div>
                                <div
                                    class="truncate"
                                    style="font-family: {tokens.typography.body
                                        .fontFamily}; font-size: {tokens
                                        .typography.body
                                        .fontSize}; color: {textColor}; opacity: 0.7"
                                >
                                    {color.value}
                                </div>
                            </div>
                            <div class="flex items-center gap-2 shrink-0">
                                <span
                                    style="font-family: {tokens.typography.body
                                        .fontFamily}; font-size: {tokens
                                        .typography.body
                                        .fontSize}; color: {textColor}; opacity: 0.6"
                                >
                                    {contrast.bg % 1 === 0
                                        ? contrast.bg
                                        : contrast.bg.toFixed(1)}:1
                                </span>
                                <span
                                    class="px-2 py-0.5 text-xs font-medium"
                                    style="background-color: {bgRating.color}20; color: {bgRating.color}"
                                >
                                    {bgRating.label}
                                </span>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
        {/if}
    </div>
</div>
