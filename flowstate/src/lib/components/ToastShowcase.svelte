<script lang="ts">
    import { designTokens } from "../stores/designTokens.svelte";
    import Toast from "./Toast.svelte";
    import * as m from "$lib/paraglide/messages/_index.js";

    const tokens = $derived(designTokens.tokens);
    const textColor = $derived(
        tokens.colorVariables.find((v) => v.id === "text")?.value || "#000000",
    );
    const variants = ["success", "info", "warning", "error"] as const;

    let activeToast = $state<(typeof variants)[number] | null>(null);

    function showToast(variant: (typeof variants)[number]) {
        activeToast = variant;
        if (variant === "success") {
            setTimeout(() => {
                if (activeToast === "success") activeToast = null;
            }, 5000);
        }
    }

    function dismissToast() {
        activeToast = null;
    }

    function getVariantLabel(variant: string) {
        switch (variant) {
            case "success":
                return m.success();
            case "info":
                return m.info();
            case "warning":
                return m.warning();
            case "error":
                return m.error();
            default:
                return variant;
        }
    }
</script>

<div
    class="toast-showcase"
    style="color: {textColor}; font-family: {tokens.typography.fontFamily}"
>
    <h2
        class="mb-4"
        style="font-family: {tokens.typography.headings.h3
            .fontFamily}; font-size: {tokens.typography.headings.h3
            .fontSize}; font-weight: {tokens.typography.headings.h3
            .fontWeight}; color: {textColor}"
    >
        {m.toasts()}
    </h2>

    <div class="space-y-3">
        {#each variants as variant}
            <button
                type="button"
                class="w-full text-left cursor-pointer hover:opacity-90 transition-opacity"
                onclick={() => showToast(variant)}
            >
                <Toast {variant} onclose={() => {}} />
            </button>
        {/each}
    </div>
</div>

{#if activeToast}
    <div class="fixed top-4 right-4 z-50 animate-slide-in">
        <Toast variant={activeToast} onclose={dismissToast} />
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
        animation: slide-in 0.3s ease-out;
    }
</style>
