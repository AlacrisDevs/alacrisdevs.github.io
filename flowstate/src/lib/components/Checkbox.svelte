<script lang="ts">
    import { useTheme } from "../composables/useTheme.svelte";

    interface Props {
        checked: boolean;
        onchange: (checked: boolean) => void;
        label?: string;
        disabled?: boolean;
    }

    let { checked, onchange, label, disabled = false }: Props = $props();

    const { isDark } = useTheme();

    function handleChange(e: Event) {
        const target = e.target as HTMLInputElement;
        onchange(target.checked);
    }
</script>

<label
    class="flex items-center gap-2 cursor-pointer {disabled
        ? 'opacity-50 cursor-not-allowed'
        : ''}"
>
    <input
        type="checkbox"
        {checked}
        {disabled}
        onchange={handleChange}
        class="w-4 h-4 accent-current"
    />
    {#if label}
        <span class="text-[14px] {isDark ? 'text-white/80' : 'text-black/80'}">
            {label}
        </span>
    {/if}
</label>
