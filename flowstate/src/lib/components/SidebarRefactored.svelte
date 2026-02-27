<script lang="ts">
    import { designTokens } from "../stores/designTokens.svelte";
    import { historyStore } from "../stores/historyStore.svelte";
    import SidebarSection from "./SidebarSection.svelte";
    import PresetManager from "./PresetManager.svelte";
    import ThemeSwitcher from "./ThemeSwitcher.svelte";
    import Settings from "./Settings.svelte";
    import {
        SidebarColorsSection,
        SidebarToastColorsSection,
        SidebarTypographySection,
        SidebarButtonsSection,
        SidebarExportSection,
    } from "./sidebar/index";
    import * as m from "$lib/paraglide/messages/_index.js";
    import { onMount } from "svelte";

    interface Props {
        onToggle?: () => void;
        headerHeight?: number;
    }

    let { onToggle, headerHeight = $bindable(72) }: Props = $props();

    const tokens = $derived(designTokens.tokens);
    const isDirty = $derived(designTokens.isDirty);
    const isDark = $derived(tokens.themeMode === "dark");
    const canUndo = $derived(historyStore.canUndo);
    const canRedo = $derived(historyStore.canRedo);

    // Time ago tracking with reactive updates
    let now = $state(Date.now());
    let headerElement: HTMLElement | null = $state(null);

    onMount(() => {
        const interval = setInterval(() => {
            now = Date.now();
        }, 1000);
        return () => clearInterval(interval);
    });

    $effect(() => {
        if (headerElement) {
            headerHeight = headerElement.offsetHeight;
        }
    });

    function getTimeAgo(timestamp: number): string {
        const seconds = Math.floor((now - timestamp) / 1000);
        if (seconds < 5) return m.just_now();
        if (seconds < 60) return m.seconds_ago({ count: seconds });
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return m.minutes_ago({ count: minutes });
        const hours = Math.floor(minutes / 60);
        return m.hours_ago({ count: hours });
    }

    const lastSavedText = $derived(
        getTimeAgo(designTokens.getLastSavedTimestamp()),
    );
</script>

<aside
    class="w-80 h-full flex flex-col shrink-0"
    style="background-color: var(--sidebar-bg); box-shadow: -4px 0 12px rgba(0, 0, 0, 0.15);"
>
    <!-- Header -->
    <header
        bind:this={headerElement}
        class="px-4 py-3"
        style="background-color: var(--sidebar-header-bg)"
    >
        <!-- Row 1: Title + Buttons -->
        <div class="flex items-center justify-between">
            <span
                class="text-[16px] font-bold {isDark
                    ? 'text-white/90'
                    : 'text-black/90'}">{m.design_system()}</span
            >
            <div class="flex items-center gap-1">
                <!-- Undo/Redo -->
                <button
                    class="w-8 h-8 flex items-center justify-center {canUndo
                        ? isDark
                            ? 'text-white/60 hover:bg-white/10'
                            : 'text-black/60 hover:bg-black/10'
                        : isDark
                          ? 'text-white/20'
                          : 'text-black/20'}"
                    onclick={() => historyStore.undo()}
                    disabled={!canUndo}
                    title="Undo (Ctrl+Z)"
                >
                    <span class="material-icons text-[18px]">undo</span>
                </button>
                <button
                    class="w-8 h-8 flex items-center justify-center {canRedo
                        ? isDark
                            ? 'text-white/60 hover:bg-white/10'
                            : 'text-black/60 hover:bg-black/10'
                        : isDark
                          ? 'text-white/20'
                          : 'text-black/20'}"
                    onclick={() => historyStore.redo()}
                    disabled={!canRedo}
                    title="Redo (Ctrl+Y)"
                >
                    <span class="material-icons text-[18px]">redo</span>
                </button>
                <ThemeSwitcher />
                <Settings />
                {#if onToggle}
                    <button
                        class="w-8 h-8 flex items-center justify-center hover:bg-black/10 {isDark
                            ? 'text-white/60 hover:bg-white/10'
                            : 'text-black/60'}"
                        onclick={onToggle}
                        title={m.hide_sidebar()}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <path d="m11 17-5-5 5-5" /><path
                                d="m18 17-5-5 5-5"
                            />
                        </svg>
                    </button>
                {/if}
            </div>
        </div>
        <!-- Row 2: Last saved + Unsaved badge (fixed height) -->
        <div class="flex items-center justify-between mt-2 h-6">
            <span
                class="text-[14px] {isDark ? 'text-white/40' : 'text-black/40'}"
                >{m.last_saved()}: {lastSavedText}</span
            >
            {#if isDirty}
                <span
                    class="px-2 py-0.5 text-[14px] font-medium"
                    style="background-color: #eab30820; color: #eab308"
                    >{m.unsaved_changes()}</span
                >
            {/if}
        </div>
    </header>

    <!-- Scrollable Content -->
    <div class="flex-1 overflow-y-auto">
        <SidebarSection title={m.presets()}>
            <PresetManager />
        </SidebarSection>

        <SidebarColorsSection />
        <SidebarToastColorsSection />
        <SidebarTypographySection />
        <SidebarButtonsSection />
    </div>

    <!-- Export Section -->
    <SidebarExportSection />
</aside>
