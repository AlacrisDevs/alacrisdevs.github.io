<script lang="ts">
    import {
        hexToRgb,
        rgbToHex,
        rgbToHsl,
        hslToRgb,
        rgbToHsv,
        hsvToRgb,
        randomColor,
    } from "../utils/colorUtils";
    import { designTokens } from "../stores/designTokens.svelte";
    import * as m from "$lib/paraglide/messages/_index.js";

    interface Props {
        value: string;
        label?: string;
        showVariableLink?: boolean;
        locked?: boolean;
        editable?: boolean;
        onLockToggle?: () => void;
        onchange?: (value: string) => void;
        onLabelChange?: (name: string) => void;
    }

    let {
        value = "#000000",
        label = "Color",
        showVariableLink = false,
        locked = false,
        editable = false,
        onLockToggle,
        onchange,
        onLabelChange,
    }: Props = $props();

    const tokens = $derived(designTokens.tokens);
    const isDark = $derived(tokens.themeMode === "dark");

    // Check if current value is a variable reference
    const isVariable = $derived(value.startsWith("$"));
    const currentVarId = $derived(isVariable ? value.slice(1) : "");
    const resolvedValue = $derived(() => {
        if (isVariable) {
            const variable = tokens.colorVariables.find(
                (v) => v.id === currentVarId,
            );
            return variable?.value || "#000000";
        }
        return value;
    });

    function handleVariableSelect(varId: string) {
        if (varId) {
            onchange?.(`$${varId}`);
        }
    }

    function unlinkVariable() {
        onchange?.(resolvedValue());
    }

    type ColorMode = "HEX" | "RGB" | "HSL" | "HSB" | "CSS";

    let isOpen = $state(false);
    let colorMode = $state<ColorMode>("HEX");
    let pickerRef = $state<HTMLDivElement | null>(null);
    let satBrightRef = $state<HTMLDivElement | null>(null);
    let hueRef = $state<HTMLDivElement | null>(null);
    let alphaRef = $state<HTMLDivElement | null>(null);
    let hexInputRef = $state<HTMLInputElement | null>(null);
    let isDraggingSB = $state(false);
    let isDraggingHue = $state(false);
    let isDraggingAlpha = $state(false);

    function handleClickOutside(e: MouseEvent) {
        if (isOpen && pickerRef && !pickerRef.contains(e.target as Node)) {
            isOpen = false;
        }
    }

    // Parse incoming value for opacity (resolves variable references first)
    function parseColorWithAlpha(colorStr: string): {
        hex: string;
        alpha: number;
    } {
        // Resolve variable reference first
        let resolved = colorStr;
        if (colorStr.startsWith("$")) {
            const varId = colorStr.slice(1);
            const variable = tokens.colorVariables.find((v) => v.id === varId);
            resolved = variable?.value || "#000000";
        }

        const rgbaMatch = resolved.match(
            /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/,
        );
        if (rgbaMatch) {
            const hex = rgbToHex(
                parseInt(rgbaMatch[1]),
                parseInt(rgbaMatch[2]),
                parseInt(rgbaMatch[3]),
            );
            const alpha = rgbaMatch[4] ? parseFloat(rgbaMatch[4]) : 1;
            return { hex, alpha };
        }
        if (/^#[0-9A-Fa-f]{8}$/.test(resolved)) {
            const hex = resolved.slice(0, 7);
            const alpha = parseInt(resolved.slice(7, 9), 16) / 255;
            return { hex, alpha: Math.round(alpha * 100) / 100 };
        }
        if (/^#[0-9A-Fa-f]{6}$/.test(resolved)) {
            return { hex: resolved, alpha: 1 };
        }
        return { hex: "#000000", alpha: 1 };
    }

    const parsed = $derived(parseColorWithAlpha(value));
    const rgb = $derived(hexToRgb(parsed.hex) || { r: 0, g: 0, b: 0 });
    const hsv = $derived(rgbToHsv(rgb.r, rgb.g, rgb.b));
    const hsl = $derived(rgbToHsl(rgb.r, rgb.g, rgb.b));

    // Internal state for picker
    let hue = $state(0);
    let saturation = $state(100);
    let brightness = $state(100);
    let alpha = $state(100);

    // Sync from external value
    $effect(() => {
        hue = hsv.h;
        saturation = hsv.s;
        brightness = hsv.v;
        alpha = Math.round(parsed.alpha * 100);
    });

    // Computed colors
    const currentRgb = $derived(hsvToRgb(hue, saturation, brightness));
    const currentHex = $derived(
        rgbToHex(currentRgb.r, currentRgb.g, currentRgb.b),
    );
    const currentHsl = $derived(
        rgbToHsl(currentRgb.r, currentRgb.g, currentRgb.b),
    );
    const pureHueRgb = $derived(hsvToRgb(hue, 100, 100));
    const pureHueHex = $derived(
        rgbToHex(pureHueRgb.r, pureHueRgb.g, pureHueRgb.b),
    );

    function emitColor() {
        const a = alpha / 100;
        if (a < 1) {
            onchange?.(
                `rgba(${currentRgb.r}, ${currentRgb.g}, ${currentRgb.b}, ${a})`,
            );
        } else {
            onchange?.(currentHex);
        }
    }

    // Saturation/Brightness picker handlers
    function handleSBMouseDown(e: MouseEvent) {
        isDraggingSB = true;
        updateSB(e);
    }

    function updateSB(e: MouseEvent) {
        if (!satBrightRef) return;
        const rect = satBrightRef.getBoundingClientRect();
        const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
        const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));
        saturation = Math.round((x / rect.width) * 100);
        brightness = Math.round(100 - (y / rect.height) * 100);
        emitColor();
    }

    // Hue slider handlers
    function handleHueMouseDown(e: MouseEvent) {
        isDraggingHue = true;
        updateHue(e);
    }

    function updateHue(e: MouseEvent) {
        if (!hueRef) return;
        const rect = hueRef.getBoundingClientRect();
        const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
        hue = Math.round((x / rect.width) * 360);
        emitColor();
    }

    // Alpha slider handlers
    function handleAlphaMouseDown(e: MouseEvent) {
        isDraggingAlpha = true;
        updateAlpha(e);
    }

    function updateAlpha(e: MouseEvent) {
        if (!alphaRef) return;
        const rect = alphaRef.getBoundingClientRect();
        const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
        alpha = Math.round((x / rect.width) * 100);
        emitColor();
    }

    // Global mouse move/up handlers
    function handleMouseMove(e: MouseEvent) {
        if (isDraggingSB) updateSB(e);
        if (isDraggingHue) updateHue(e);
        if (isDraggingAlpha) updateAlpha(e);
    }

    function handleMouseUp() {
        isDraggingSB = false;
        isDraggingHue = false;
        isDraggingAlpha = false;
    }

    // Input handlers
    function handleHexInput(e: Event) {
        const target = e.target as HTMLInputElement;
        let hex = target.value;
        if (!hex.startsWith("#")) hex = "#" + hex;
        if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
            const newRgb = hexToRgb(hex);
            if (newRgb) {
                const newHsv = rgbToHsv(newRgb.r, newRgb.g, newRgb.b);
                hue = newHsv.h;
                saturation = newHsv.s;
                brightness = newHsv.v;
                emitColor();
            }
        }
    }

    function handleRgbInput(component: "r" | "g" | "b", val: number) {
        const newRgb = {
            ...currentRgb,
            [component]: Math.max(0, Math.min(255, val)),
        };
        const newHsv = rgbToHsv(newRgb.r, newRgb.g, newRgb.b);
        hue = newHsv.h;
        saturation = newHsv.s;
        brightness = newHsv.v;
        emitColor();
    }

    function handleHslInput(component: "h" | "s" | "l", val: number) {
        const newHsl = { ...currentHsl };
        if (component === "h") newHsl.h = Math.max(0, Math.min(360, val));
        else if (component === "s") newHsl.s = Math.max(0, Math.min(100, val));
        else newHsl.l = Math.max(0, Math.min(100, val));
        const newRgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
        const newHsv = rgbToHsv(newRgb.r, newRgb.g, newRgb.b);
        hue = newHsv.h;
        saturation = newHsv.s;
        brightness = newHsv.v;
        emitColor();
    }

    function handleHsbInput(component: "h" | "s" | "b", val: number) {
        if (component === "h") hue = Math.max(0, Math.min(360, val));
        else if (component === "s")
            saturation = Math.max(0, Math.min(100, val));
        else brightness = Math.max(0, Math.min(100, val));
        emitColor();
    }

    function handleAlphaInput(val: number) {
        alpha = Math.max(0, Math.min(100, val));
        emitColor();
    }

    function getCssString(): string {
        const a = alpha / 100;
        return `rgba(${currentRgb.r}, ${currentRgb.g}, ${currentRgb.b}, ${a})`;
    }

    function handleCssInput(e: Event) {
        const target = e.target as HTMLInputElement;
        const val = target.value.trim();

        // Try rgba first (most common for CSS mode)
        const rgbaMatch = val.match(
            /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/,
        );
        if (rgbaMatch) {
            const newRgb = {
                r: Math.min(255, Math.max(0, parseInt(rgbaMatch[1]))),
                g: Math.min(255, Math.max(0, parseInt(rgbaMatch[2]))),
                b: Math.min(255, Math.max(0, parseInt(rgbaMatch[3]))),
            };
            const newHsv = rgbToHsv(newRgb.r, newRgb.g, newRgb.b);
            hue = newHsv.h;
            saturation = newHsv.s;
            brightness = newHsv.v;
            alpha = rgbaMatch[4]
                ? Math.round(parseFloat(rgbaMatch[4]) * 100)
                : 100;
            emitColor();
            return;
        }

        // Try hex
        if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
            const newRgb = hexToRgb(val);
            if (newRgb) {
                const newHsv = rgbToHsv(newRgb.r, newRgb.g, newRgb.b);
                hue = newHsv.h;
                saturation = newHsv.s;
                brightness = newHsv.v;
                alpha = 100;
                emitColor();
            }
        }
    }

    const colorModes: ColorMode[] = ["HEX", "RGB", "HSL", "HSB", "CSS"];

    function handleRandomColor() {
        const newHex = randomColor();
        const newRgb = hexToRgb(newHex);
        if (newRgb) {
            const newHsv = rgbToHsv(newRgb.r, newRgb.g, newRgb.b);
            hue = newHsv.h;
            saturation = newHsv.s;
            brightness = newHsv.v;
            emitColor();
        }
    }

    function handleKeydown(e: KeyboardEvent) {
        if (e.key === "Escape" && isOpen) {
            isOpen = false;
        }
    }

    let copyFeedback = $state(false);
    async function copyHexToClipboard() {
        try {
            await navigator.clipboard.writeText(parsed.hex);
            copyFeedback = true;
            setTimeout(() => (copyFeedback = false), 1000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    }
</script>

<svelte:window
    onmousemove={handleMouseMove}
    onmouseup={handleMouseUp}
    onclick={handleClickOutside}
    onkeydown={handleKeydown}
/>

<div class="color-picker relative" bind:this={pickerRef}>
    <div class="flex items-center gap-1 mb-1">
        {#if editable && onLabelChange}
            <input
                type="text"
                value={label}
                onchange={(e) =>
                    onLabelChange((e.target as HTMLInputElement).value)}
                class="text-[14px] flex-1 bg-transparent focus:outline-none min-w-0 {isDark
                    ? 'text-white/50 focus:text-white'
                    : 'text-black/50 focus:text-black'}"
            />
        {:else}
            <span
                class="text-[14px] flex-1 {isDark
                    ? 'text-white/50'
                    : 'text-black/50'}">{label}</span
            >
        {/if}
        {#if showVariableLink && isVariable}
            <button
                type="button"
                class="text-[14px] {isDark
                    ? 'text-white/40 hover:text-white'
                    : 'text-black/40 hover:text-black'}"
                onclick={unlinkVariable}>Unlink</button
            >
        {/if}
    </div>

    {#if showVariableLink && isVariable}
        <!-- Variable Linked View -->
        <div class="flex items-center gap-2">
            <div class="w-8 h-8 shrink-0 swatch-checkered overflow-hidden">
                <div
                    class="w-full h-full"
                    style="background-color: {parsed.hex};"
                ></div>
            </div>
            <select
                class="flex-1 min-w-0 px-2 py-1.5 text-[14px] appearance-none cursor-pointer {isDark
                    ? 'bg-white/5 text-white'
                    : 'bg-black/5 text-black'}"
                style="background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22{isDark
                    ? 'rgba(255,255,255,0.4)'
                    : 'rgba(0,0,0,0.4)'}%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E'); background-repeat: no-repeat; background-position: right 6px center; background-size: 14px; padding-right: 24px;"
                value={currentVarId}
                onchange={(e) =>
                    handleVariableSelect((e.target as HTMLSelectElement).value)}
            >
                {#each tokens.colorVariables as variable}
                    <option
                        value={variable.id}
                        style="background-color: var(--sidebar-dropdown-bg)"
                        >{variable.name}</option
                    >
                {/each}
            </select>
        </div>
    {:else}
        <!-- Regular Color Picker View -->
        <div class="flex items-center gap-2">
            <!-- Color Swatch - opens picker -->
            <button
                type="button"
                class="relative w-8 h-8 shrink-0 overflow-hidden swatch-checkered cursor-pointer"
                style={locked ? "box-shadow: inset 0 0 0 2px #fbbf24;" : ""}
                onclick={() => {
                    isOpen = !isOpen;
                    if (isOpen) {
                        setTimeout(() => hexInputRef?.focus(), 50);
                    }
                }}
                aria-label="Open color picker"
            >
                <div
                    class="absolute inset-0"
                    style="background-color: rgba({currentRgb.r}, {currentRgb.g}, {currentRgb.b}, {alpha /
                        100});"
                ></div>
                {#if locked}
                    <div
                        class="absolute inset-0 flex items-center justify-center bg-black/40"
                    >
                        <span
                            class="material-icons text-white text-[14px]"
                            style="text-shadow: 0 0 3px rgba(0,0,0,0.8), 0 0 6px rgba(0,0,0,0.5);"
                            >lock</span
                        >
                    </div>
                {/if}
            </button>

            <!-- Hex Value - click to copy (full width) -->
            <button
                type="button"
                class="flex-1 min-w-0 h-8 px-3 text-[14px] font-mono text-left cursor-pointer flex items-center transition-colors {copyFeedback
                    ? isDark
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-green-600/20 text-green-700'
                    : isDark
                      ? 'bg-white/5 text-white hover:bg-white/10'
                      : 'bg-black/5 text-black hover:bg-black/10'}"
                onclick={copyHexToClipboard}
                title="Click to copy"
            >
                {copyFeedback ? m.copied() : parsed.hex.toUpperCase()}
            </button>

            <!-- Opacity -->
            <div class="relative w-16 shrink-0 h-8">
                <input
                    type="number"
                    value={alpha}
                    onchange={(e) =>
                        handleAlphaInput(
                            parseInt((e.target as HTMLInputElement).value) || 0,
                        )}
                    min="0"
                    max="100"
                    style="-moz-appearance: textfield; -webkit-appearance: none; appearance: none;"
                    class="w-full h-8 px-2 text-[14px] font-mono text-center pr-6 focus:outline-none {isDark
                        ? 'bg-white/5 text-white focus:bg-white/10'
                        : 'bg-black/5 text-black focus:bg-black/10'}"
                />
                <span
                    class="absolute right-2 top-0 h-8 flex items-center text-[14px] {isDark
                        ? 'text-white/40'
                        : 'text-black/40'}">%</span
                >
            </div>

            <!-- Lock Button -->
            {#if onLockToggle}
                <button
                    type="button"
                    class="w-8 h-8 shrink-0 flex items-center justify-center transition-colors {locked
                        ? isDark
                            ? 'bg-amber-500/30 text-amber-300'
                            : 'bg-amber-500/30 text-amber-700'
                        : isDark
                          ? 'bg-white/5 text-white/40 hover:bg-white/10'
                          : 'bg-black/5 text-black/40 hover:bg-black/10'}"
                    onclick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onLockToggle();
                        (e.currentTarget as HTMLButtonElement).blur();
                    }}
                    title={locked ? "Unlock color" : "Lock color"}
                >
                    <span class="material-icons text-[16px]"
                        >{locked ? "lock" : "lock_open"}</span
                    >
                </button>
            {/if}

            <!-- Variable Link (for button colors) -->
            {#if showVariableLink}
                <select
                    class="w-16 shrink-0 h-8 px-2 text-[14px] appearance-none cursor-pointer focus:outline-none {isDark
                        ? 'bg-white/5 text-white/60 hover:bg-white/10'
                        : 'bg-black/5 text-black/60 hover:bg-black/10'}"
                    style="background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22{isDark
                        ? 'rgba(255,255,255,0.4)'
                        : 'rgba(0,0,0,0.4)'}%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E'); background-repeat: no-repeat; background-position: right 4px center; background-size: 12px; padding-right: 18px;"
                    value=""
                    onchange={(e) =>
                        handleVariableSelect(
                            (e.target as HTMLSelectElement).value,
                        )}
                >
                    <option
                        value=""
                        style="background-color: var(--sidebar-dropdown-bg)"
                        >Link</option
                    >
                    {#each tokens.colorVariables as variable}
                        <option
                            value={variable.id}
                            style="background-color: var(--sidebar-dropdown-bg)"
                            >{variable.name}</option
                        >
                    {/each}
                </select>
            {/if}
        </div>
    {/if}

    <!-- Expanded Color Picker Panel -->
    {#if isOpen}
        <div
            class="absolute left-0 top-full mt-2 shadow-xl z-[99999] p-3 w-72 {isDark
                ? 'bg-[#0A121F]'
                : 'bg-white border border-black/10'}"
        >
            <!-- Saturation/Brightness Area -->
            <div
                bind:this={satBrightRef}
                class="relative w-full h-40 rounded cursor-crosshair mb-3"
                style="background: linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, {pureHueHex});"
                onmousedown={handleSBMouseDown}
                role="slider"
                aria-label="Saturation and brightness"
                aria-valuenow={Math.round(saturation)}
                tabindex="0"
            >
                <!-- Picker Circle -->
                <div
                    class="absolute w-4 h-4 border-2 border-white rounded-full shadow-md pointer-events-none"
                    style="left: {saturation}%; top: {100 -
                        brightness}%; transform: translate(-50%, -50%);"
                >
                    <div
                        class="absolute inset-0.5 rounded-full"
                        style="background-color: {currentHex};"
                    ></div>
                </div>
            </div>

            <!-- Hue Slider -->
            <div
                bind:this={hueRef}
                class="relative w-full h-3 rounded-full cursor-pointer mb-3 hue-gradient"
                onmousedown={handleHueMouseDown}
                role="slider"
                aria-label="Hue"
                aria-valuenow={Math.round(hue)}
                tabindex="0"
            >
                <div
                    class="absolute w-4 h-4 border-2 border-white rounded-full shadow-md pointer-events-none"
                    style="left: {(hue / 360) *
                        100}%; top: 50%; transform: translate(-50%, -50%); background-color: {pureHueHex};"
                ></div>
            </div>

            <!-- Alpha Slider -->
            <div
                bind:this={alphaRef}
                class="relative w-full h-3 rounded-full cursor-pointer mb-3 alpha-checkered overflow-hidden"
                onmousedown={handleAlphaMouseDown}
                role="slider"
                aria-label="Opacity"
                aria-valuenow={Math.round(alpha * 100)}
                tabindex="0"
            >
                <div
                    class="absolute inset-0 rounded-full"
                    style="background: linear-gradient(to right, transparent, {currentHex});"
                ></div>
                <div
                    class="absolute w-4 h-4 border-2 border-white rounded-full shadow-md pointer-events-none"
                    style="left: {alpha}%; top: 50%; transform: translate(-50%, -50%); background-color: rgba({currentRgb.r}, {currentRgb.g}, {currentRgb.b}, {alpha /
                        100});"
                ></div>
            </div>

            <!-- Color Mode Selector + Random Button -->
            <div class="flex gap-1 mb-2">
                {#each colorModes as mode}
                    <button
                        type="button"
                        class="flex-1 px-1 py-1.5 text-[14px] {colorMode ===
                        mode
                            ? isDark
                                ? 'bg-white/15 text-white'
                                : 'bg-black/15 text-black'
                            : isDark
                              ? 'bg-white/5 text-white/50 hover:bg-white/10'
                              : 'bg-black/5 text-black/50 hover:bg-black/10'}"
                        onclick={() => (colorMode = mode)}>{mode}</button
                    >
                {/each}
                <button
                    type="button"
                    class="px-2 py-1.5 text-[14px] {isDark
                        ? 'bg-white/5 text-white/50 hover:bg-white/10'
                        : 'bg-black/5 text-black/50 hover:bg-black/10'}"
                    onclick={handleRandomColor}
                    title="Random color"
                    ><span class="material-icons text-[16px]">casino</span
                    ></button
                >
            </div>

            <!-- Color Value Inputs -->
            <div class="flex gap-1">
                {#if colorMode === "HEX"}
                    <input
                        bind:this={hexInputRef}
                        type="text"
                        value={currentHex.toUpperCase()}
                        onchange={handleHexInput}
                        class="flex-1 px-2 py-1.5 text-[14px] font-mono text-center focus:outline-none uppercase {isDark
                            ? 'bg-white/5 text-white focus:bg-white/10'
                            : 'bg-black/5 text-black focus:bg-black/10'}"
                    />
                    <div class="relative w-16">
                        <input
                            type="number"
                            value={alpha}
                            onchange={(e) =>
                                handleAlphaInput(
                                    parseInt(
                                        (e.target as HTMLInputElement).value,
                                    ) || 0,
                                )}
                            min="0"
                            max="100"
                            class="w-full px-1 py-1.5 text-[14px] font-mono text-center pr-5 focus:outline-none {isDark
                                ? 'bg-white/5 text-white focus:bg-white/10'
                                : 'bg-black/5 text-black focus:bg-black/10'}"
                        />
                        <span
                            class="absolute right-1.5 top-1/2 -translate-y-1/2 text-[14px] {isDark
                                ? 'text-white/40'
                                : 'text-black/40'}">%</span
                        >
                    </div>
                {:else if colorMode === "RGB"}
                    <div class="flex-1 flex flex-col items-center">
                        <input
                            type="number"
                            value={currentRgb.r}
                            onchange={(e) =>
                                handleRgbInput(
                                    "r",
                                    parseInt(
                                        (e.target as HTMLInputElement).value,
                                    ) || 0,
                                )}
                            min="0"
                            max="255"
                            class="w-full px-1 py-1.5 text-[14px] font-mono text-center focus:outline-none {isDark
                                ? 'bg-white/5 text-white focus:bg-white/10'
                                : 'bg-black/5 text-black focus:bg-black/10'}"
                        />
                        <span
                            class="text-[14px] mt-0.5 {isDark
                                ? 'text-white/40'
                                : 'text-black/40'}">R</span
                        >
                    </div>
                    <div class="flex-1 flex flex-col items-center">
                        <input
                            type="number"
                            value={currentRgb.g}
                            onchange={(e) =>
                                handleRgbInput(
                                    "g",
                                    parseInt(
                                        (e.target as HTMLInputElement).value,
                                    ) || 0,
                                )}
                            min="0"
                            max="255"
                            class="w-full px-1 py-1.5 text-[14px] font-mono text-center focus:outline-none {isDark
                                ? 'bg-white/5 text-white focus:bg-white/10'
                                : 'bg-black/5 text-black focus:bg-black/10'}"
                        />
                        <span
                            class="text-[14px] mt-0.5 {isDark
                                ? 'text-white/40'
                                : 'text-black/40'}">G</span
                        >
                    </div>
                    <div class="flex-1 flex flex-col items-center">
                        <input
                            type="number"
                            value={currentRgb.b}
                            onchange={(e) =>
                                handleRgbInput(
                                    "b",
                                    parseInt(
                                        (e.target as HTMLInputElement).value,
                                    ) || 0,
                                )}
                            min="0"
                            max="255"
                            class="w-full px-1 py-1.5 text-[14px] font-mono text-center focus:outline-none {isDark
                                ? 'bg-white/5 text-white focus:bg-white/10'
                                : 'bg-black/5 text-black focus:bg-black/10'}"
                        />
                        <span
                            class="text-[14px] mt-0.5 {isDark
                                ? 'text-white/40'
                                : 'text-black/40'}">B</span
                        >
                    </div>
                    <div class="flex-1 flex flex-col items-center">
                        <input
                            type="number"
                            value={alpha}
                            onchange={(e) =>
                                handleAlphaInput(
                                    parseInt(
                                        (e.target as HTMLInputElement).value,
                                    ) || 0,
                                )}
                            min="0"
                            max="100"
                            class="w-full px-1 py-1.5 text-[14px] font-mono text-center focus:outline-none {isDark
                                ? 'bg-white/5 text-white focus:bg-white/10'
                                : 'bg-black/5 text-black focus:bg-black/10'}"
                        />
                        <span
                            class="text-[14px] mt-0.5 {isDark
                                ? 'text-white/40'
                                : 'text-black/40'}">A</span
                        >
                    </div>
                {:else if colorMode === "HSL"}
                    <div class="flex-1 flex flex-col items-center">
                        <input
                            type="number"
                            value={currentHsl.h}
                            onchange={(e) =>
                                handleHslInput(
                                    "h",
                                    parseInt(
                                        (e.target as HTMLInputElement).value,
                                    ) || 0,
                                )}
                            min="0"
                            max="360"
                            class="w-full px-1 py-1.5 text-[14px] font-mono text-center focus:outline-none {isDark
                                ? 'bg-white/5 text-white focus:bg-white/10'
                                : 'bg-black/5 text-black focus:bg-black/10'}"
                        />
                        <span
                            class="text-[14px] mt-0.5 {isDark
                                ? 'text-white/40'
                                : 'text-black/40'}">H</span
                        >
                    </div>
                    <div class="flex-1 flex flex-col items-center">
                        <input
                            type="number"
                            value={currentHsl.s}
                            onchange={(e) =>
                                handleHslInput(
                                    "s",
                                    parseInt(
                                        (e.target as HTMLInputElement).value,
                                    ) || 0,
                                )}
                            min="0"
                            max="100"
                            class="w-full px-1 py-1.5 text-[14px] font-mono text-center focus:outline-none {isDark
                                ? 'bg-white/5 text-white focus:bg-white/10'
                                : 'bg-black/5 text-black focus:bg-black/10'}"
                        />
                        <span
                            class="text-[14px] mt-0.5 {isDark
                                ? 'text-white/40'
                                : 'text-black/40'}">S</span
                        >
                    </div>
                    <div class="flex-1 flex flex-col items-center">
                        <input
                            type="number"
                            value={currentHsl.l}
                            onchange={(e) =>
                                handleHslInput(
                                    "l",
                                    parseInt(
                                        (e.target as HTMLInputElement).value,
                                    ) || 0,
                                )}
                            min="0"
                            max="100"
                            class="w-full px-1 py-1.5 text-[14px] font-mono text-center focus:outline-none {isDark
                                ? 'bg-white/5 text-white focus:bg-white/10'
                                : 'bg-black/5 text-black focus:bg-black/10'}"
                        />
                        <span
                            class="text-[14px] mt-0.5 {isDark
                                ? 'text-white/40'
                                : 'text-black/40'}">L</span
                        >
                    </div>
                    <div class="flex-1 flex flex-col items-center">
                        <input
                            type="number"
                            value={alpha}
                            onchange={(e) =>
                                handleAlphaInput(
                                    parseInt(
                                        (e.target as HTMLInputElement).value,
                                    ) || 0,
                                )}
                            min="0"
                            max="100"
                            class="w-full px-1 py-1.5 text-[14px] font-mono text-center focus:outline-none {isDark
                                ? 'bg-white/5 text-white focus:bg-white/10'
                                : 'bg-black/5 text-black focus:bg-black/10'}"
                        />
                        <span
                            class="text-[14px] mt-0.5 {isDark
                                ? 'text-white/40'
                                : 'text-black/40'}">A</span
                        >
                    </div>
                {:else if colorMode === "HSB"}
                    <div class="flex-1 flex flex-col items-center">
                        <input
                            type="number"
                            value={hue}
                            onchange={(e) =>
                                handleHsbInput(
                                    "h",
                                    parseInt(
                                        (e.target as HTMLInputElement).value,
                                    ) || 0,
                                )}
                            min="0"
                            max="360"
                            class="w-full px-1 py-1.5 text-[14px] font-mono text-center focus:outline-none {isDark
                                ? 'bg-white/5 text-white focus:bg-white/10'
                                : 'bg-black/5 text-black focus:bg-black/10'}"
                        />
                        <span
                            class="text-[14px] mt-0.5 {isDark
                                ? 'text-white/40'
                                : 'text-black/40'}">H</span
                        >
                    </div>
                    <div class="flex-1 flex flex-col items-center">
                        <input
                            type="number"
                            value={saturation}
                            onchange={(e) =>
                                handleHsbInput(
                                    "s",
                                    parseInt(
                                        (e.target as HTMLInputElement).value,
                                    ) || 0,
                                )}
                            min="0"
                            max="100"
                            class="w-full px-1 py-1.5 text-[14px] font-mono text-center focus:outline-none {isDark
                                ? 'bg-white/5 text-white focus:bg-white/10'
                                : 'bg-black/5 text-black focus:bg-black/10'}"
                        />
                        <span
                            class="text-[14px] mt-0.5 {isDark
                                ? 'text-white/40'
                                : 'text-black/40'}">S</span
                        >
                    </div>
                    <div class="flex-1 flex flex-col items-center">
                        <input
                            type="number"
                            value={brightness}
                            onchange={(e) =>
                                handleHsbInput(
                                    "b",
                                    parseInt(
                                        (e.target as HTMLInputElement).value,
                                    ) || 0,
                                )}
                            min="0"
                            max="100"
                            class="w-full px-1 py-1.5 text-[14px] font-mono text-center focus:outline-none {isDark
                                ? 'bg-white/5 text-white focus:bg-white/10'
                                : 'bg-black/5 text-black focus:bg-black/10'}"
                        />
                        <span
                            class="text-[14px] mt-0.5 {isDark
                                ? 'text-white/40'
                                : 'text-black/40'}">B</span
                        >
                    </div>
                    <div class="flex-1 flex flex-col items-center">
                        <input
                            type="number"
                            value={alpha}
                            onchange={(e) =>
                                handleAlphaInput(
                                    parseInt(
                                        (e.target as HTMLInputElement).value,
                                    ) || 0,
                                )}
                            min="0"
                            max="100"
                            class="w-full px-1 py-1.5 text-[14px] font-mono text-center focus:outline-none {isDark
                                ? 'bg-white/5 text-white focus:bg-white/10'
                                : 'bg-black/5 text-black focus:bg-black/10'}"
                        />
                        <span
                            class="text-[14px] mt-0.5 {isDark
                                ? 'text-white/40'
                                : 'text-black/40'}">A</span
                        >
                    </div>
                {:else if colorMode === "CSS"}
                    <input
                        type="text"
                        value={getCssString()}
                        onchange={handleCssInput}
                        class="flex-1 px-2 py-1.5 text-[14px] font-mono text-center focus:outline-none {isDark
                            ? 'bg-white/5 text-white focus:bg-white/10'
                            : 'bg-black/5 text-black focus:bg-black/10'}"
                    />
                {/if}
            </div>
        </div>
    {/if}
</div>

<style>
    .swatch-checkered {
        background-image: linear-gradient(45deg, #808080 25%, transparent 25%),
            linear-gradient(-45deg, #808080 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #808080 75%),
            linear-gradient(-45deg, transparent 75%, #808080 75%);
        background-size: 8px 8px;
        background-position:
            0 0,
            0 4px,
            4px -4px,
            -4px 0px;
        background-color: #fff;
    }

    .alpha-checkered {
        background-image: linear-gradient(45deg, #808080 25%, transparent 25%),
            linear-gradient(-45deg, #808080 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #808080 75%),
            linear-gradient(-45deg, transparent 75%, #808080 75%);
        background-size: 8px 8px;
        background-position:
            0 0,
            0 4px,
            4px -4px,
            -4px 0px;
        background-color: #fff;
    }

    .hue-gradient {
        background: linear-gradient(
            to right,
            #ff0000 0%,
            #ffff00 17%,
            #00ff00 33%,
            #00ffff 50%,
            #0000ff 67%,
            #ff00ff 83%,
            #ff0000 100%
        );
    }

    input[type="number"]::-webkit-outer-spin-button,
    input[type="number"]::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
    input[type="number"] {
        -moz-appearance: textfield;
        appearance: textfield;
    }
</style>
