<script lang="ts">
    import { onMount } from "svelte";

    interface Props {
        open: boolean;
        title?: string;
        onclose: () => void;
        children?: import("svelte").Snippet;
    }

    let { open, title = "", onclose, children }: Props = $props();
    let dialogRef = $state<HTMLDialogElement | null>(null);

    $effect(() => {
        if (!dialogRef) return;
        if (open) {
            dialogRef.showModal();
        } else {
            dialogRef.close();
        }
    });

    function handleBackdropClick(e: MouseEvent) {
        if (e.target === dialogRef) {
            onclose();
        }
    }

    function handleKeydown(e: KeyboardEvent) {
        if (e.key === "Escape") {
            e.preventDefault();
            onclose();
        }
    }
</script>

<dialog
    bind:this={dialogRef}
    class="fixed inset-0 m-auto p-0 bg-transparent backdrop:bg-black/70 max-w-none max-h-none overflow-visible"
    onclick={handleBackdropClick}
    onkeydown={handleKeydown}
    oncancel={(e) => {
        e.preventDefault();
        onclose();
    }}
>
    <div class="bg-[#0A121F] p-4 w-80 text-white">
        {#if title}
            <h3 class="text-[14px] font-medium mb-3">{title}</h3>
        {/if}
        {#if children}
            {@render children()}
        {/if}
    </div>
</dialog>

<style>
    dialog::backdrop {
        background: rgba(0, 0, 0, 0.7);
    }
    dialog[open] {
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>
