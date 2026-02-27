<script lang="ts">
    import Button from "./Button.svelte";
    import { designTokens } from "../stores/designTokens.svelte";
    import { editingContext } from "../stores/editingContext.svelte";
    import * as m from "$lib/paraglide/messages/_index.js";

    const allVariants = ["primary", "secondary", "tertiary"] as const;
    const states = ["default", "hover", "active", "disabled"] as const;
    // Show smallest to largest
    const allSizes = ["small", "medium", "large"] as const;

    const tokens = $derived(designTokens.tokens);

    // Filter variants and sizes based on enabled settings
    const variants = $derived(
        allVariants.filter((v) => tokens.enabledButtonVariants[v]),
    );
    const sizes = $derived(
        allSizes.filter((s) => tokens.enabledButtonSizes[s]),
    );

    const stateLabels = $derived({
        default: m.default_state(),
        hover: m.hover_state(),
        active: m.active_state(),
        disabled: m.disabled_state(),
    });

    const variantLabels = $derived({
        primary: m.primary(),
        secondary: m.secondary(),
        tertiary: m.tertiary(),
    });

    const sizeLabels = $derived({
        small: m.small(),
        medium: "Medium",
        large: m.large(),
    });

    const textColor = $derived(
        tokens.colorVariables.find((v) => v.id === "text")?.value || "#000000",
    );
    const accentColor = $derived(
        tokens.colorVariables.find((v) => v.id === "accent")?.value ||
            "#00A3E0",
    );

    function handleVariantClick(
        variant: (typeof variants)[number],
        size: (typeof sizes)[number],
    ) {
        editingContext.setButtonContext(variant, size);
        // Scroll to sidebar buttons section
        const buttonsSection =
            document.querySelector(
                '.sidebar-section:has(button:contains("Primary"))',
            ) || document.getElementById("buttons-section");
        if (buttonsSection) {
            buttonsSection.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    }
</script>

<div
    class="button-showcase"
    style="color: {textColor}; font-family: {tokens.typography.fontFamily}"
>
    <h2
        class="mb-4"
        style="font-family: {tokens.typography.headings.h3
            .fontFamily}; font-size: {tokens.typography.headings.h3
            .fontSize}; font-weight: {tokens.typography.headings.h3
            .fontWeight}; color: {textColor}"
    >
        {m.buttons()}
    </h2>

    {#each sizes as size, i}
        <div class="mb-6">
            <h3
                class="mb-3 uppercase"
                style="font-family: {tokens.typography.body
                    .fontFamily}; font-size: {tokens.typography.body
                    .fontSize}; color: {textColor}; opacity: 0.5"
            >
                {sizeLabels[size]}
            </h3>
            <div class="flex flex-col gap-4">
                <!-- Header row with variant labels -->
                <div class="flex flex-wrap items-center gap-4">
                    <div class="w-20 shrink-0"></div>
                    {#each variants as variant}
                        <button
                            class="flex-1 min-w-[120px] text-center flex items-center justify-center cursor-pointer underline"
                            style="font-family: {tokens.typography.body
                                .fontFamily}; font-size: {tokens.typography.body
                                .fontSize}; color: {accentColor}; background: none; border: none;"
                            onclick={() => handleVariantClick(variant, size)}
                            title="Edit {variantLabels[variant]} button"
                        >
                            {variantLabels[variant]}
                        </button>
                    {/each}
                </div>
                <!-- Button rows -->
                {#each states as state}
                    <div class="flex flex-wrap items-center gap-4">
                        <span
                            class="w-20 shrink-0"
                            style="font-family: {tokens.typography.body
                                .fontFamily}; font-size: {tokens.typography.body
                                .fontSize}; color: {textColor}; opacity: 0.5"
                            >{stateLabels[state]}</span
                        >
                        {#each variants as variant}
                            <div
                                class="flex-1 min-w-[120px] flex items-center justify-center"
                            >
                                <Button
                                    {variant}
                                    {size}
                                    fixedState={state}
                                    label={m.button_label()}
                                />
                            </div>
                        {/each}
                    </div>
                {/each}
            </div>
        </div>
        {#if i < sizes.length - 1}
            <hr class="mb-6" style="border-color: {textColor}10" />
        {/if}
    {/each}
</div>
