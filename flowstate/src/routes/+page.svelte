<script lang="ts">
    import { onMount } from "svelte";
    import { designTokens } from "$lib/stores/designTokens.svelte";
    import { presetsStore } from "$lib/stores/presetsStore.svelte";
    import { historyStore } from "$lib/stores/historyStore.svelte";
    import { toastStore } from "$lib/stores/toastStore.svelte";
    import ButtonShowcase from "$lib/components/ButtonShowcase.svelte";
    import TypographyShowcase from "$lib/components/TypographyShowcase.svelte";
    import ColorShowcase from "$lib/components/ColorShowcase.svelte";
    import ToastShowcase from "$lib/components/ToastShowcase.svelte";
    import Sidebar from "$lib/components/SidebarRefactored.svelte";
    import * as m from "$lib/paraglide/messages/_index.js";
    import {
        randomContrastSafePalette,
        randomColor,
        parseColor,
        blendColors,
        getContrastRatio,
        hexToRgb,
    } from "$lib/utils/colorUtils";
    import { getTokensFromUrl, clearUrlState } from "$lib/utils/urlState";

    const tokens = $derived(designTokens.tokens);
    let sidebarVisible = $state(true);
    let sidebarHeaderHeight = $state(72);
    let historyDebounce: ReturnType<typeof setTimeout> | null = null;

    // Track token changes for undo/redo (debounced)
    $effect(() => {
        // Access tokens to create dependency
        const _ = JSON.stringify(tokens);

        if (historyDebounce) clearTimeout(historyDebounce);
        historyDebounce = setTimeout(() => {
            historyStore.pushState();
        }, 500);
    });

    onMount(() => {
        const urlTokens = getTokensFromUrl();

        if (urlTokens) {
            // Hydrate from URL if shared link
            designTokens.hydrateFromPartial(urlTokens);
            toastStore.info("Design system loaded from shared link");
            clearUrlState();
        }
    });
    const bgColor = $derived(
        tokens.colorVariables.find((v) => v.id === "background")?.value ||
            "#0A121F",
    );
    const textColor = $derived(
        tokens.colorVariables.find((v) => v.id === "text")?.value || "#FFFFFF",
    );
    const primaryColor = $derived(
        tokens.colorVariables.find((v) => v.id === "primary")?.value ||
            "#00A3E0",
    );

    // Calculate contrast-based icon color for sidebar toggle button
    const toggleButtonIconColor = $derived(() => {
        const primaryRgb = hexToRgb(primaryColor);
        if (!primaryRgb) return "#FFFFFF";
        const white = { r: 255, g: 255, b: 255 };
        const black = { r: 0, g: 0, b: 0 };
        const contrastWithWhite = getContrastRatio(primaryRgb, white);
        const contrastWithBlack = getContrastRatio(primaryRgb, black);
        return contrastWithWhite > contrastWithBlack ? "#FFFFFF" : "#000000";
    });

    function handleKeydown(e: KeyboardEvent) {
        // Undo/Redo shortcuts
        if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
            e.preventDefault();
            historyStore.undo();
            return;
        }
        if (
            (e.ctrlKey || e.metaKey) &&
            (e.key === "y" || (e.key === "z" && e.shiftKey))
        ) {
            e.preventDefault();
            historyStore.redo();
            return;
        }

        if (e.code === "Space") {
            const target = e.target as HTMLElement;
            const isInteractive =
                target.tagName === "INPUT" ||
                target.tagName === "TEXTAREA" ||
                target.tagName === "BUTTON" ||
                target.tagName === "SELECT" ||
                target.isContentEditable;
            if (!isInteractive) {
                e.preventDefault();
                randomizeColors();
            }
        }
    }

    function randomizeColors() {
        const palette = randomContrastSafePalette(
            designTokens.tokens.themeMode,
        );
        const isLocked = (id: string) =>
            designTokens.tokens.colorVariables.find((v) => v.id === id)?.locked;
        const isToastLocked = (id: string) =>
            designTokens.tokens.lockedColors[id];

        if (!isLocked("primary")) {
            designTokens.updateColorVariable("primary", {
                value: palette.primary,
            });
        }
        if (!isLocked("accent")) {
            designTokens.updateColorVariable("accent", {
                value: palette.accent,
            });
        }
        if (!isLocked("text")) {
            designTokens.updateColorVariable("text", { value: palette.text });
        }
        if (!isLocked("background")) {
            designTokens.updateColorVariable("background", {
                value: palette.background,
            });
        }
        // Randomize toast colors (only if toasts are enabled)
        if (designTokens.tokens.enableToasts) {
            if (!isToastLocked("info")) {
                designTokens.updateColor("info", randomColor());
            }
            if (!isToastLocked("success")) {
                designTokens.updateColor("success", randomColor());
            }
            if (!isToastLocked("warning")) {
                designTokens.updateColor("warning", randomColor());
            }
            if (!isToastLocked("error")) {
                designTokens.updateColor("error", randomColor());
            }
        }
    }
</script>

<svelte:window onkeydown={handleKeydown} />

<svelte:head>
    <title>{m.design_system()}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossorigin="anonymous"
    />
    <link
        href="https://fonts.googleapis.com/css2?family=Spline+Sans+Mono:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=Roboto:wght@400;500;700&family=Open+Sans:wght@400;500;600;700&display=swap"
        rel="stylesheet"
    />
</svelte:head>

<div class="flex h-screen overflow-hidden" style="background-color: {bgColor}">
    <main
        class="flex-1 overflow-y-auto p-4 transition-all duration-300 ease-in-out"
        style="background-color: {bgColor}; color: {textColor}; font-family: {tokens
            .typography.fontFamily}"
    >
        <div class="max-w-4xl mx-auto space-y-6">
            <header>
                <h1
                    style="font-family: {tokens.typography.headings.h2
                        .fontFamily}; font-size: {tokens.typography.headings.h2
                        .fontSize}; font-weight: {tokens.typography.headings.h2
                        .fontWeight}; color: {textColor}"
                >
                    {m.style_guide()} - {presetsStore.activePresetName}
                </h1>
            </header>

            <section><ColorShowcase /></section>
            <hr style="border-color: {textColor}10" />
            <section><TypographyShowcase /></section>
            {#if tokens.enableButtons}
                <section><ButtonShowcase /></section>
            {/if}
            {#if tokens.enableToasts}
                <hr style="border-color: {textColor}10" />
                <section><ToastShowcase /></section>
            {/if}
        </div>
    </main>

    <!-- Sidebar with bookmark toggle -->
    <div
        class="relative h-full z-30 transition-[margin] duration-300 ease-in-out"
        style="margin-right: {sidebarVisible ? '0' : '-320px'};"
    >
        <!-- Bookmark toggle button - always visible, primary color themed, matches header height -->
        <button
            class="absolute top-0 -left-6 w-6 flex items-center justify-center z-40 transition-all"
            style="background-color: {primaryColor}; border-radius: 4px 0 0 4px; height: {sidebarHeaderHeight}px;"
            onclick={() => (sidebarVisible = !sidebarVisible)}
            title={sidebarVisible ? "Hide sidebar" : "Show sidebar"}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke={toggleButtonIconColor()}
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="transition-transform {sidebarVisible
                    ? ''
                    : 'rotate-180'}"
            >
                <path d="m9 18 6-6-6-6" />
            </svg>
        </button>

        <Sidebar bind:headerHeight={sidebarHeaderHeight} />
    </div>
</div>
