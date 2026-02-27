<script lang="ts">
    import { designTokens } from "../../stores/designTokens.svelte";
    import FontPicker from "../FontPicker.svelte";
    import InputField from "../InputField.svelte";
    import SelectField from "../SelectField.svelte";
    import SidebarSection from "../SidebarSection.svelte";
    import * as m from "$lib/paraglide/messages/_index.js";

    const tokens = $derived(designTokens.tokens);
    const isDark = $derived(tokens.themeMode === "dark");

    const fontWeightOptions = [
        { value: "400", label: "400" },
        { value: "500", label: "500" },
        { value: "600", label: "600" },
        { value: "700", label: "700" },
    ];

    const textTransformOptions = [
        { value: "none", label: "-" },
        { value: "uppercase", label: "ABC" },
        { value: "lowercase", label: "abc" },
        { value: "capitalize", label: "Abc" },
    ];
</script>

<SidebarSection title={m.typography()}>
    <div class="space-y-6">
        <!-- Fonts -->
        <div class="space-y-3">
            <div>
                <div
                    class="text-[14px] mb-2 {isDark
                        ? 'text-white/40'
                        : 'text-black/40'}"
                >
                    {m.heading_font()}
                </div>
                <FontPicker
                    value={tokens.typography.headingFontFamily
                        .split(",")[0]
                        .trim()}
                    onchange={(v) =>
                        designTokens.updateTypography(
                            "headingFontFamily",
                            `${v}, sans-serif`,
                        )}
                />
            </div>
            <div>
                <div
                    class="text-[14px] mb-2 {isDark
                        ? 'text-white/40'
                        : 'text-black/40'}"
                >
                    {m.body_font()}
                </div>
                <FontPicker
                    value={tokens.typography.fontFamily.split(",")[0].trim()}
                    onchange={(v) =>
                        designTokens.updateTypography(
                            "fontFamily",
                            `${v}, sans-serif`,
                        )}
                />
            </div>
            <div>
                <div
                    class="text-[14px] mb-2 {isDark
                        ? 'text-white/40'
                        : 'text-black/40'}"
                >
                    {m.button_font()}
                </div>
                <FontPicker
                    value={tokens.typography.buttonFontFamily
                        .split(",")[0]
                        .trim()}
                    onchange={(v) =>
                        designTokens.updateTypography(
                            "buttonFontFamily",
                            `${v}, sans-serif`,
                        )}
                />
            </div>
        </div>

        <!-- Headings -->
        <div>
            <div
                class="text-[14px] mb-2 {isDark
                    ? 'text-white/40'
                    : 'text-black/40'}"
            >
                {m.headings()}
            </div>
            <!-- Column Headers -->
            <div class="flex items-center gap-2 mb-1">
                <span class="w-8 shrink-0"></span>
                <span
                    class="flex-1 text-[14px] {isDark
                        ? 'text-white/30'
                        : 'text-black/30'}">Size</span
                >
                <span
                    class="flex-1 text-[14px] {isDark
                        ? 'text-white/30'
                        : 'text-black/30'}">Weight</span
                >
                <span
                    class="flex-1 text-[14px] {isDark
                        ? 'text-white/30'
                        : 'text-black/30'}">Case</span
                >
            </div>
            <div class="space-y-2">
                {#each ["h1", "h2", "h3", "h4", "h5", "h6"] as heading}
                    {@const h =
                        tokens.typography.headings[
                            heading as keyof typeof tokens.typography.headings
                        ]}
                    <div class="flex items-center gap-2">
                        <span
                            class="text-[14px] w-8 shrink-0 {isDark
                                ? 'text-white/50'
                                : 'text-black/50'}"
                            >{heading.toUpperCase()}</span
                        >
                        <div class="flex-1">
                            <InputField
                                type="number"
                                value={parseFloat(h.fontSize)}
                                suffix="px"
                                onchange={(v) =>
                                    designTokens.updateHeading(heading as any, {
                                        fontSize: v + 'px',
                                    })}
                            />
                        </div>
                        <div class="flex-1">
                            <SelectField
                                value={h.fontWeight}
                                options={fontWeightOptions}
                                onchange={(v) =>
                                    designTokens.updateHeading(heading as any, {
                                        fontWeight: v,
                                    })}
                            />
                        </div>
                        <div class="flex-1">
                            <SelectField
                                value={h.textTransform}
                                options={textTransformOptions}
                                onchange={(v) =>
                                    designTokens.updateHeading(heading as any, {
                                        textTransform: v as any,
                                    })}
                            />
                        </div>
                    </div>
                {/each}
            </div>
        </div>

        <!-- Body -->
        <div>
            <div
                class="text-[14px] mb-2 {isDark
                    ? 'text-white/40'
                    : 'text-black/40'}"
            >
                {m.body()}
            </div>
            <!-- Column Headers -->
            <div class="flex items-center gap-2 mb-1">
                <span class="w-8 shrink-0"></span>
                <span
                    class="flex-1 text-[14px] {isDark
                        ? 'text-white/30'
                        : 'text-black/30'}">Size</span
                >
                <span
                    class="flex-1 text-[14px] {isDark
                        ? 'text-white/30'
                        : 'text-black/30'}">Weight</span
                >
                <span
                    class="flex-1 text-[14px] {isDark
                        ? 'text-white/30'
                        : 'text-black/30'}">Case</span
                >
            </div>
            <div class="space-y-2">
                    <div class="flex items-center gap-2">
                        <span
                            class="text-[14px] w-8 shrink-0 {isDark
                                ? 'text-white/50'
                                : 'text-black/50'}">p</span
                        >
                        <div class="flex-1">
                            <InputField
                                type="number"
                                value={parseFloat(tokens.typography.body.fontSize)}
                                suffix="px"
                                onchange={(v) =>
                                    designTokens.updateBody({ fontSize: v + 'px' })}
                            />
                        </div>
                    <div class="flex-1">
                        <SelectField
                            value={tokens.typography.body.fontWeight}
                            options={fontWeightOptions}
                            onchange={(v) =>
                                designTokens.updateBody({ fontWeight: v })}
                        />
                    </div>
                    <div class="flex-1">
                        <SelectField
                            value={tokens.typography.body.textTransform}
                            options={textTransformOptions}
                            onchange={(v) =>
                                designTokens.updateBody({
                                    textTransform: v as any,
                                })}
                        />
                    </div>
                </div>
                    <div class="flex items-center gap-2">
                        <span
                            class="text-[14px] w-8 shrink-0 {isDark
                                ? 'text-white/50'
                                : 'text-black/50'}">p-sm</span
                        >
                        <div class="flex-1">
                            <InputField
                                type="number"
                                value={parseFloat(tokens.typography.bodySmall.fontSize)}
                                suffix="px"
                                onchange={(v) =>
                                    designTokens.updateBodySmall({ fontSize: v + 'px' })}
                            />
                        </div>
                    <div class="flex-1">
                        <SelectField
                            value={tokens.typography.bodySmall.fontWeight}
                            options={fontWeightOptions}
                            onchange={(v) =>
                                designTokens.updateBodySmall({ fontWeight: v })}
                        />
                    </div>
                    <div class="flex-1">
                        <SelectField
                            value={tokens.typography.bodySmall.textTransform}
                            options={textTransformOptions}
                            onchange={(v) =>
                                designTokens.updateBodySmall({
                                    textTransform: v as any,
                                })}
                        />
                    </div>
                </div>
            </div>
        </div>

        <!-- Button Text - only show if buttons enabled -->
        {#if tokens.enableButtons}
            <div>
                <div
                    class="text-[14px] mb-2 {isDark
                        ? 'text-white/40'
                        : 'text-black/40'}"
                >
                    {m.button_text()}
                </div>
                <!-- Column Headers -->
                <div class="flex items-center gap-2 mb-1">
                    <span class="w-10 shrink-0"></span>
                    <span
                        class="flex-1 text-[14px] {isDark
                            ? 'text-white/30'
                            : 'text-black/30'}">Size</span
                    >
                    <span
                        class="flex-1 text-[14px] {isDark
                            ? 'text-white/30'
                            : 'text-black/30'}">Weight</span
                    >
                    <span
                        class="flex-1 text-[14px] {isDark
                            ? 'text-white/30'
                            : 'text-black/30'}">Case</span
                    >
                </div>
                <div class="space-y-2">
                    <div class="flex items-center gap-2">
                        <span
                            class="text-[14px] w-10 shrink-0 {isDark
                                ? 'text-white/50'
                                : 'text-black/50'}">btn-sm</span
                        >
                        <div class="flex-1">
                            <InputField
                                type="number"
                                value={parseFloat(tokens.typography.buttonSmall.fontSize)}
                                suffix="px"
                                onchange={(v) =>
                                    designTokens.updateButtonSmallTypography({
                                        fontSize: v + 'px',
                                    })}
                            />
                        </div>
                        <div class="flex-1">
                            <SelectField
                                value={tokens.typography.buttonSmall.fontWeight}
                                options={fontWeightOptions}
                                onchange={(v) =>
                                    designTokens.updateButtonSmallTypography({
                                        fontWeight: v,
                                    })}
                            />
                        </div>
                        <div class="flex-1">
                            <SelectField
                                value={tokens.typography.buttonSmall
                                    .textTransform}
                                options={textTransformOptions}
                                onchange={(v) =>
                                    designTokens.updateButtonSmallTypography({
                                        textTransform: v as any,
                                    })}
                            />
                        </div>
                    </div>
                    <div class="flex items-center gap-2">
                        <span
                            class="text-[14px] w-10 shrink-0 {isDark
                                ? 'text-white/50'
                                : 'text-black/50'}">btn-md</span
                        >
                        <div class="flex-1">
                            <InputField
                                type="number"
                                value={parseFloat(tokens.typography.button.fontSize)}
                                suffix="px"
                                onchange={(v) =>
                                    designTokens.updateButtonTypography({
                                        fontSize: v + 'px',
                                    })}
                            />
                        </div>
                        <div class="flex-1">
                            <SelectField
                                value={tokens.typography.button.fontWeight}
                                options={fontWeightOptions}
                                onchange={(v) =>
                                    designTokens.updateButtonTypography({
                                        fontWeight: v,
                                    })}
                            />
                        </div>
                        <div class="flex-1">
                            <SelectField
                                value={tokens.typography.button.textTransform}
                                options={textTransformOptions}
                                onchange={(v) =>
                                    designTokens.updateButtonTypography({
                                        textTransform: v as any,
                                    })}
                            />
                        </div>
                    </div>
                    <div class="flex items-center gap-2">
                        <span
                            class="text-[14px] w-10 shrink-0 {isDark
                                ? 'text-white/50'
                                : 'text-black/50'}">btn-lg</span
                        >
                        <div class="flex-1">
                            <InputField
                                type="number"
                                value={parseFloat(tokens.typography.buttonLarge.fontSize)}
                                suffix="px"
                                onchange={(v) =>
                                    designTokens.updateButtonLargeTypography({
                                        fontSize: v + 'px',
                                    })}
                            />
                        </div>
                        <div class="flex-1">
                            <SelectField
                                value={tokens.typography.buttonLarge.fontWeight}
                                options={fontWeightOptions}
                                onchange={(v) =>
                                    designTokens.updateButtonLargeTypography({
                                        fontWeight: v,
                                    })}
                            />
                        </div>
                        <div class="flex-1">
                            <SelectField
                                value={tokens.typography.buttonLarge
                                    .textTransform}
                                options={textTransformOptions}
                                onchange={(v) =>
                                    designTokens.updateButtonLargeTypography({
                                        textTransform: v as any,
                                    })}
                            />
                        </div>
                    </div>
                </div>
            </div>
        {/if}
    </div>
</SidebarSection>
