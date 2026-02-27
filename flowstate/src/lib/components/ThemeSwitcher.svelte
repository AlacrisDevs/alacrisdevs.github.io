<script lang="ts">
    import { designTokens } from "../stores/designTokens.svelte";
    import {
        hexToRgb,
        rgbToHex,
        rgbToHsl,
        hslToRgb,
        getContrastRatioFromHex,
    } from "../utils/colorUtils";

    const themeMode = $derived(designTokens.tokens.themeMode);
    const defaultThemeMode = $derived(designTokens.tokens.defaultThemeMode);
    const isDefaultMode = $derived(themeMode === defaultThemeMode);

    // Store the original "default" colors when switching away
    let storedDefaultColors: Record<string, string> | null = $state(null);

    function createLightBackground(darkBg: string): string {
        const rgb = hexToRgb(darkBg) || { r: 10, g: 18, b: 31 };
        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
        // For neutral colors (low saturation), keep neutral
        if (hsl.s < 10) {
            const newRgb = hslToRgb(0, 0, 96);
            return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
        }
        // Create a very light tint with same hue
        const newRgb = hslToRgb(hsl.h, Math.min(hsl.s, 20), 96);
        return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    }

    function createDarkBackground(lightBg: string): string {
        const rgb = hexToRgb(lightBg) || { r: 245, g: 247, b: 250 };
        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
        // For neutral colors (low saturation), keep neutral
        if (hsl.s < 10) {
            const newRgb = hslToRgb(0, 0, 8);
            return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
        }
        // Create a very dark shade with same hue
        const newRgb = hslToRgb(hsl.h, Math.min(hsl.s + 30, 50), 8);
        return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    }

    function adjustBrandColorMinimally(
        hex: string,
        newBg: string,
        minContrast: number = 3.0,
    ): string {
        const currentContrast = getContrastRatioFromHex(hex, newBg);
        if (currentContrast >= minContrast) {
            return hex; // Already good contrast, keep original
        }

        const rgb = hexToRgb(hex) || { r: 0, g: 163, b: 224 };
        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
        const bgRgb = hexToRgb(newBg) || { r: 245, g: 247, b: 250 };
        const bgHsl = rgbToHsl(bgRgb.r, bgRgb.g, bgRgb.b);
        const isLightBg = bgHsl.l > 50;

        // Adjust lightness minimally to achieve contrast
        let testL = hsl.l;
        const step = isLightBg ? -2 : 2; // Darken for light bg, lighten for dark bg

        for (let i = 0; i < 50; i++) {
            testL = Math.max(5, Math.min(95, testL + step));
            const testRgb = hslToRgb(hsl.h, hsl.s, testL);
            const testHex = rgbToHex(testRgb.r, testRgb.g, testRgb.b);
            if (getContrastRatioFromHex(testHex, newBg) >= minContrast) {
                return testHex;
            }
        }

        // Fallback: return adjusted color even if contrast not fully met
        const finalRgb = hslToRgb(hsl.h, hsl.s, testL);
        return rgbToHex(finalRgb.r, finalRgb.g, finalRgb.b);
    }

    function toggleTheme() {
        const newMode = themeMode === "dark" ? "light" : "dark";
        const tokens = designTokens.tokens;

        // Get current colors
        const currentColors = {
            text:
                tokens.colorVariables.find((v) => v.id === "text")?.value ||
                "#FFFFFF",
            background:
                tokens.colorVariables.find((v) => v.id === "background")
                    ?.value || "#0A121F",
            primary:
                tokens.colorVariables.find((v) => v.id === "primary")?.value ||
                "#00A3E0",
            accent:
                tokens.colorVariables.find((v) => v.id === "accent")?.value ||
                "#FFAB00",
        };

        // If switching away from default mode, store the current (default) colors
        if (themeMode === defaultThemeMode) {
            storedDefaultColors = { ...currentColors };
        }

        // Helper to check if a color is locked
        const isLocked = (id: string) =>
            tokens.colorVariables.find((v) => v.id === id)?.locked;

        // If switching back to default mode, restore the stored colors (except locked ones)
        if (newMode === defaultThemeMode && storedDefaultColors) {
            if (!isLocked("text")) {
                designTokens.updateColorVariable("text", {
                    value: storedDefaultColors.text,
                });
            }
            if (!isLocked("background")) {
                designTokens.updateColorVariable("background", {
                    value: storedDefaultColors.background,
                });
            }
            if (!isLocked("primary")) {
                designTokens.updateColorVariable("primary", {
                    value: storedDefaultColors.primary,
                });
            }
            if (!isLocked("accent")) {
                designTokens.updateColorVariable("accent", {
                    value: storedDefaultColors.accent,
                });
            }
            designTokens.setThemeMode(newMode);
            return;
        }

        // Calculate new colors for the opposite mode
        const goingToLight = newMode === "light";

        let newBg: string;
        let newText: string;
        let newPrimary: string;
        let newAccent: string;

        if (goingToLight) {
            // Going to light mode
            newBg = createLightBackground(currentColors.background);
            newText = "#1a1a2e"; // Dark text for light mode
            newPrimary = adjustBrandColorMinimally(
                currentColors.primary,
                newBg,
                3.0,
            );
            newAccent = adjustBrandColorMinimally(
                currentColors.accent,
                newBg,
                3.0,
            );
        } else {
            // Going to dark mode
            newBg = createDarkBackground(currentColors.background);
            newText = "#FFFFFF"; // White text for dark mode
            newPrimary = adjustBrandColorMinimally(
                currentColors.primary,
                newBg,
                3.0,
            );
            newAccent = adjustBrandColorMinimally(
                currentColors.accent,
                newBg,
                3.0,
            );
        }

        // Apply all changes (skip locked colors)
        if (!isLocked("text")) {
            designTokens.updateColorVariable("text", { value: newText });
        }
        if (!isLocked("background")) {
            designTokens.updateColorVariable("background", { value: newBg });
        }
        if (!isLocked("primary")) {
            designTokens.updateColorVariable("primary", { value: newPrimary });
        }
        if (!isLocked("accent")) {
            designTokens.updateColorVariable("accent", { value: newAccent });
        }
        designTokens.setThemeMode(newMode);
    }
</script>

<button
    class="relative w-8 h-8 flex items-center justify-center {themeMode ===
    'dark'
        ? 'text-white/60 hover:bg-white/10'
        : 'text-black/60 hover:bg-black/10'}"
    onclick={toggleTheme}
    title="Switch to {themeMode === 'dark' ? 'light' : 'dark'} mode"
>
    {#if themeMode === "dark"}
        <span class="material-icons text-[20px]">light_mode</span>
    {:else}
        <span class="material-icons text-[20px]">dark_mode</span>
    {/if}
</button>
