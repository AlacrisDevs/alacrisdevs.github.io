<!-- src/lib/components/ButtonPrimary.svelte -->
<script lang="ts">
    import { designTokens } from "../stores/designTokens.svelte";

    interface Props {
        onclick?: () => void;
        disabled?: boolean;
        class?: string;
    }

    let { onclick, disabled = false, class: className = "" }: Props = $props();
    const isDark = $derived(designTokens.tokens.themeMode === "dark");
</script>

<button
    class="flex-1 py-2 text-[14px] {isDark
        ? 'bg-white/10 text-white hover:bg-white/15'
        : 'bg-black/10 text-black hover:bg-black/15'} {className}"
    {onclick}
    {disabled}
>
    <slot />
</button>