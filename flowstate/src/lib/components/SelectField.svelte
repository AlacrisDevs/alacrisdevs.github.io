<script lang="ts">
    import { designTokens } from "../stores/designTokens.svelte";

    interface Props {
        value: string;
        label?: string;
        options: { value: string; label: string }[];
        onchange?: (value: string) => void;
    }

    let { value, label = "", options, onchange }: Props = $props();
    const isDark = $derived(designTokens.tokens.themeMode === "dark");

    function handleChange(e: Event) {
        const target = e.target as HTMLSelectElement;
        onchange?.(target.value);
    }
</script>

<div class="select-field">
    {#if label}
        <span
            class="block text-[14px] mb-1 {isDark
                ? 'text-white/40'
                : 'text-black/40'}">{label}</span
        >
    {/if}
    <select
        {value}
        onchange={handleChange}
        class="w-full px-3 py-2 text-[14px] appearance-none cursor-pointer font-mono focus:outline-none {isDark
            ? 'bg-white/5 text-white focus:bg-white/10'
            : 'bg-black/5 text-black focus:bg-black/10'}"
        style="background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22{isDark
            ? 'rgba(255,255,255,0.4)'
            : 'rgba(0,0,0,0.4)'}%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E'); background-repeat: no-repeat; background-position: right 6px center; background-size: 14px; padding-right: 28px;"
    >
        {#each options as option}
            <option
                value={option.value}
                style="background-color: {isDark ? '#0A121F' : '#FFFFFF'}"
                >{option.label}</option
            >
        {/each}
    </select>
</div>
