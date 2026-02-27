<!-- src/lib/components/ButtonSecondary.svelte -->
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
        ? 'bg-white/5 text-white/70 hover:bg-white/10'
        : 'bg-black/5 text-black/70 hover:bg-black/10'} {className}"
    {onclick}
    {disabled}
>
    <slot />
</button>