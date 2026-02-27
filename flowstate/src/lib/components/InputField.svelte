<script lang="ts">
    import { designTokens } from "../stores/designTokens.svelte";

    interface Props {
        value: string | number;
        label?: string;
        type?: "text" | "number";
        placeholder?: string;
        suffix?: string;
        min?: number;
        max?: number;
        step?: number;
        onchange?: (value: string | number) => void;
    }

    let {
        value,
        label = "",
        type = "text",
        placeholder = "",
        suffix = "",
        min,
        max,
        step,
        onchange,
    }: Props = $props();

    const isDark = $derived(designTokens.tokens.themeMode === "dark");

    function handleChange(e: Event) {
        const target = e.target as HTMLInputElement;
        if (type === "number") {
            const numValue = parseFloat(target.value);
            onchange?.(isNaN(numValue) ? 0 : numValue);
        } else {
            onchange?.(target.value);
        }
    }
</script>

<div class="input-field">
    <!-- svelte-ignore a11y_label_has_associated_control -->
    {#if label}
        <label
            class="block text-[14px] mb-1 {isDark
                ? 'text-white/40'
                : 'text-black/40'}">{label}</label
        >
    {/if}
    <div class="relative">
        <input
            {type}
            {value}
            {placeholder}
            {min}
            {max}
            {step}
            onchange={handleChange}
            oninput={handleChange}
            style="-moz-appearance: textfield; -webkit-appearance: none; appearance: none;"
            class="w-full px-3 py-2 text-[14px] font-mono focus:outline-none {suffix
                ? 'pr-8'
                : ''} {isDark
                ? 'bg-white/5 text-white focus:bg-white/10'
                : 'bg-black/5 text-black focus:bg-black/10'}"
        />
        {#if suffix}
            <span
                class="absolute right-2 top-1/2 -translate-y-1/2 text-[14px] {isDark
                    ? 'text-white/40'
                    : 'text-black/40'}">{suffix}</span
            >
        {/if}
    </div>
</div>


