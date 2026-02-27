<script lang="ts">
    import { designTokens } from "../../stores/designTokens.svelte";
    import { editingContext } from "../../stores/editingContext.svelte";
    import Button from "../Button.svelte";
    import ColorPicker from "../ColorPicker.svelte";
    import InputField from "../InputField.svelte";
    import SelectField from "../SelectField.svelte";
    import SidebarSection from "../SidebarSection.svelte";
    import Checkbox from "../Checkbox.svelte";
    import * as m from "$lib/paraglide/messages/_index.js";

    const tokens = $derived(designTokens.tokens);
    const isDark = $derived(tokens.themeMode === "dark");

    // Currently selected for editing - synced with editingContext
    let selectedButtonVariant = $derived(editingContext.buttonVariant);
    let selectedButtonSize = $derived(editingContext.buttonSize);

    // Click counter for feedback
    let clickCount = $state(0);

    function setVariant(variant: "primary" | "secondary" | "tertiary") {
        editingContext.setButtonContext(variant, editingContext.buttonSize);
    }

    function setSize(size: "large" | "medium" | "small") {
        editingContext.setButtonContext(editingContext.buttonVariant, size);
    }

    const selectedVariantTokens = $derived(
        tokens.buttonVariants[selectedButtonVariant],
    );
    const selectedSizeTokens = $derived(tokens.buttons[selectedButtonSize]);
    const selectedVariantSizeTokens = $derived(
        selectedVariantTokens[selectedButtonSize],
    );

    const borderStyleOptions = [
        { value: "none", label: "None" },
        { value: "solid", label: "Solid" },
        { value: "bottom", label: "Bottom" },
    ];

    const borderPositionOptions = [
        { value: "inside", label: "Inside" },
        { value: "center", label: "Center" },
        { value: "outside", label: "Outside" },
    ];

    const animationOptions = [
        { value: "none", label: "None" },
        { value: "fade", label: "Fade" },
        { value: "scale", label: "Scale" },
        { value: "both", label: "Both" },
    ];
</script>

{#if tokens.enableButtons}
    <SidebarSection title={m.buttons()}>
        <div class="space-y-6">
            <!-- Variant Selector -->
            <div>
                <div
                    class="text-[14px] mb-2 {isDark
                        ? 'text-white/40'
                        : 'text-black/40'}"
                >
                    {m.variant()}
                </div>
                <div class="flex gap-1">
                    {#each [{ value: "primary", label: m.primary() }, { value: "secondary", label: m.secondary() }, { value: "tertiary", label: m.tertiary() }].filter((opt) => tokens.enabledButtonVariants[opt.value as keyof typeof tokens.enabledButtonVariants]) as opt}
                        <button
                            class="flex-1 py-2 text-[14px] {selectedButtonVariant ===
                            opt.value
                                ? isDark
                                    ? 'bg-white/15 text-white'
                                    : 'bg-black/15 text-black'
                                : isDark
                                  ? 'bg-white/5 text-white/40 hover:bg-white/10'
                                  : 'bg-black/5 text-black/40 hover:bg-black/10'}"
                            onclick={() => setVariant(opt.value as any)}
                            >{opt.label}</button
                        >
                    {/each}
                </div>
            </div>

            <!-- Size Selector -->
            <div>
                <div
                    class="text-[14px] mb-2 {isDark
                        ? 'text-white/40'
                        : 'text-black/40'}"
                >
                    {m.size()}
                </div>
                <div class="flex gap-1">
                    {#each [{ value: "small", label: m.small() }, { value: "medium", label: m.medium() }, { value: "large", label: m.large() }].filter((opt) => tokens.enabledButtonSizes[opt.value as keyof typeof tokens.enabledButtonSizes]) as opt}
                        <button
                            class="flex-1 py-2 text-[14px] {selectedButtonSize ===
                            opt.value
                                ? isDark
                                    ? 'bg-white/15 text-white'
                                    : 'bg-black/15 text-black'
                                : isDark
                                  ? 'bg-white/5 text-white/40 hover:bg-white/10'
                                  : 'bg-black/5 text-black/40 hover:bg-black/10'}"
                            onclick={() => setSize(opt.value as any)}
                            >{opt.label}</button
                        >
                    {/each}
                </div>
            </div>

            <!-- Button Preview -->
            <div
                class="p-6 flex flex-col items-center justify-center gap-2"
                style="background-color: {tokens.colors.background}"
            >
                <Button
                    variant={selectedButtonVariant}
                    size={selectedButtonSize}
                    label={m.click_me()}
                    onclick={() => (clickCount += 1)}
                />
                <span class="text-[14px]" style="color: {tokens.colors.text}"
                    >{clickCount === 1
                        ? m.clicked_count({ count: clickCount })
                        : m.clicked_count_plural({ count: clickCount })}</span
                >
            </div>

            <!-- Enabled Variants & Sizes -->
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <div
                        class="text-[14px] mb-2 {isDark
                            ? 'text-white/40'
                            : 'text-black/40'}"
                    >
                        {m.variants()}
                    </div>
                    <div class="space-y-1">
                        {#each [{ key: "primary", label: m.primary() }, { key: "secondary", label: m.secondary() }, { key: "tertiary", label: m.tertiary() }] as opt}
                            <Checkbox
                                checked={tokens.enabledButtonVariants[
                                    opt.key as keyof typeof tokens.enabledButtonVariants
                                ]}
                                onchange={(checked) =>
                                    designTokens.toggleButtonVariant(
                                        opt.key as
                                            | "primary"
                                            | "secondary"
                                            | "tertiary",
                                        checked,
                                    )}
                                label={opt.label}
                            />
                        {/each}
                    </div>
                </div>
                <div>
                    <div
                        class="text-[14px] mb-2 {isDark
                            ? 'text-white/40'
                            : 'text-black/40'}"
                    >
                        {m.sizes()}
                    </div>
                    <div class="space-y-1">
                        {#each [{ key: "small", label: m.small() }, { key: "medium", label: m.medium() }, { key: "large", label: m.large() }] as opt}
                            <Checkbox
                                checked={tokens.enabledButtonSizes[
                                    opt.key as keyof typeof tokens.enabledButtonSizes
                                ]}
                                onchange={(checked) =>
                                    designTokens.toggleButtonSize(
                                        opt.key as "small" | "medium" | "large",
                                        checked,
                                    )}
                                label={opt.label}
                            />
                        {/each}
                    </div>
                </div>
            </div>

            <!-- Padding -->
            <div>
                <div
                    class="text-[14px] mb-2 {isDark
                        ? 'text-white/40'
                        : 'text-black/40'}"
                >
                    {m.padding()}
                </div>
                <div class="grid grid-cols-2 gap-2">
                    <InputField
                        type="number"
                        value={parseFloat(selectedSizeTokens.paddingX)}
                        label="X"
                        suffix="px"
                        onchange={(v) =>
                            designTokens.updateButton(selectedButtonSize, {
                                paddingX: v + 'px',
                            })}
                    />
                    <InputField
                        type="number"
                        value={parseFloat(selectedSizeTokens.paddingY)}
                        label="Y"
                        suffix="px"
                        onchange={(v) =>
                            designTokens.updateButton(selectedButtonSize, {
                                paddingY: v + 'px',
                            })}
                    />
                </div>
            </div>

            <!-- Fill -->
            <div>
                <div
                    class="text-[14px] mb-2 {isDark
                        ? 'text-white/40'
                        : 'text-black/40'}"
                >
                    {m.fill()}
                </div>
                <ColorPicker
                    value={selectedVariantTokens.bgColor}
                    label={m.background()}
                    showVariableLink={true}
                    onchange={(val) =>
                        designTokens.updateButtonVariant(
                            selectedButtonVariant,
                            { bgColor: val },
                        )}
                    locked={false}
                    editable={true}
                />
            </div>

            <!-- Text -->
            <div>
                <div
                    class="text-[14px] mb-2 {isDark
                        ? 'text-white/40'
                        : 'text-black/40'}"
                >
                    {m.text()}
                </div>
                <ColorPicker
                    value={selectedVariantTokens.textColor}
                    label={m.colors()}
                    showVariableLink={true}
                    onchange={(val) =>
                        designTokens.updateButtonVariant(
                            selectedButtonVariant,
                            { textColor: val },
                        )}
                />
            </div>

            <!-- Stroke -->
            <div>
                <div
                    class="text-[14px] mb-2 {isDark
                        ? 'text-white/40'
                        : 'text-black/40'}"
                >
                    {m.stroke()}
                </div>
                <ColorPicker
                    value={selectedVariantTokens.borderColor}
                    label={m.colors()}
                    showVariableLink={true}
                    onchange={(val) =>
                        designTokens.updateButtonVariant(
                            selectedButtonVariant,
                            { borderColor: val },
                        )}
                />
                <div class="grid grid-cols-3 gap-2 mt-2">
                    <SelectField
                        value={selectedVariantSizeTokens.borderPosition}
                        label={m.position()}
                        options={borderPositionOptions}
                        onchange={(v) =>
                            designTokens.updateButtonVariant(
                                selectedButtonVariant,
                                {
                                    [selectedButtonSize]: {
                                        ...selectedVariantSizeTokens,
                                        borderPosition: v as any,
                                    },
                                },
                            )}
                    />
                    <InputField
                        type="number"
                        value={parseFloat(selectedVariantSizeTokens.borderWidth)}
                        label={m.width()}
                        suffix="px"
                        onchange={(v) =>
                            designTokens.updateButtonVariant(
                                selectedButtonVariant,
                                {
                                    [selectedButtonSize]: {
                                        ...selectedVariantSizeTokens,
                                        borderWidth: v + 'px',
                                    },
                                },
                            )}
                    />
                    <SelectField
                        value={selectedVariantSizeTokens.borderStyle}
                        label={m.style()}
                        options={borderStyleOptions}
                        onchange={(v) =>
                            designTokens.updateButtonVariant(
                                selectedButtonVariant,
                                {
                                    [selectedButtonSize]: {
                                        ...selectedVariantSizeTokens,
                                        borderStyle: v as any,
                                    },
                                },
                            )}
                    />
                </div>
            </div>

            <!-- Layout -->
            <div>
                <div
                    class="text-[14px] mb-2 {isDark
                        ? 'text-white/40'
                        : 'text-black/40'}"
                >
                    {m.layout()}
                </div>
                <div class="grid grid-cols-2 gap-2">
                    <InputField
                        type="number"
                        value={parseFloat(selectedSizeTokens.minWidth)}
                        label={m.min_width()}
                        suffix="px"
                        onchange={(v) =>
                            designTokens.updateButton(selectedButtonSize, {
                                minWidth: v + 'px',
                            })}
                    />
                    <InputField
                        type="number"
                        value={parseFloat(selectedSizeTokens.borderRadius)}
                        label={m.radius()}
                        suffix="px"
                        onchange={(v) =>
                            designTokens.updateButton(selectedButtonSize, {
                                borderRadius: v + 'px',
                            })}
                    />
                </div>
            </div>

            <!-- Effects -->
            <div>
                <div
                    class="text-[14px] mb-2 {isDark
                        ? 'text-white/40'
                        : 'text-black/40'}"
                >
                    {m.effects()}
                </div>
                <div class="grid grid-cols-2 gap-2">
                    <SelectField
                        value={selectedSizeTokens.animation}
                        label={m.animation()}
                        options={animationOptions}
                        onchange={(v) =>
                            designTokens.updateButton(selectedButtonSize, {
                                animation: v as any,
                            })}
                    />
                    <InputField
                        type="number"
                        value={parseFloat(selectedSizeTokens.transitionDuration)}
                        label={m.duration()}
                        suffix="ms"
                        onchange={(v) =>
                            designTokens.updateButton(selectedButtonSize, {
                                transitionDuration: v + 'ms',
                            })}
                    />
                </div>
            </div>
        </div>
    </SidebarSection>
{/if}
