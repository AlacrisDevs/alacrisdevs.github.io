<script lang="ts">
    import type { Snippet } from "svelte";
    import { designTokens } from "../stores/designTokens.svelte";

    interface Props {
        title: string;
        children: Snippet;
        defaultOpen?: boolean;
    }

    let { title, children, defaultOpen = true }: Props = $props();
    let isOpen = $state(true);
    const isDark = $derived(designTokens.tokens.themeMode === "dark");
    $effect(() => {
        isOpen = defaultOpen;
    });
</script>

<section class="sidebar-section">
    <button
        class="w-full px-4 py-3 flex items-center justify-between text-left {isDark
            ? 'bg-white/5'
            : 'bg-black/5'}"
        onclick={() => (isOpen = !isOpen)}
    >
        <span
            class="text-[14px] font-medium uppercase tracking-wide {isDark
                ? 'text-white/60'
                : 'text-black/60'}">{title}</span
        >
        <span
            class="material-icons text-[20px] {isDark
                ? 'text-white/40'
                : 'text-black/40'}"
            >{isOpen ? "expand_less" : "expand_more"}</span
        >
    </button>
    {#if isOpen}
        <div class="px-4 py-4">
            {@render children()}
        </div>
    {/if}
</section>
