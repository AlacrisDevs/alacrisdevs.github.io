<script lang="ts">
    import { designTokens } from "../../stores/designTokens.svelte";
    import ColorPicker from "../ColorPicker.svelte";
    import SidebarSection from "../SidebarSection.svelte";
    import Checkbox from "../Checkbox.svelte";
    import {
        randomContrastSafePalette,
        randomContrastSafeColor,
        getContrastRatioFromHex,
    } from "../../utils/colorUtils";
    import * as m from "$lib/paraglide/messages/_index.js";

    const tokens = $derived(designTokens.tokens);
    const isDark = $derived(tokens.themeMode === "dark");

    // Get text and background colors for contrast calculation
    const textColorValue = $derived(
        tokens.colorVariables.find((v) => v.id === "text")?.value || "#FFFFFF",
    );
    const bgColorValue = $derived(
        tokens.colorVariables.find((v) => v.id === "background")?.value ||
            "#0A121F",
    );

    // Calculate contrast ratio between text and background
    const contrastRatio = $derived(
        getContrastRatioFromHex(textColorValue, bgColorValue),
    );

    // WCAG rating - derived from contrast ratio
    const contrastRating = $derived.by(() => {
        const ratio = contrastRatio;
        if (ratio >= 7)
            return { label: "AAA", class: "text-green-400 bg-green-400/20" };
        if (ratio >= 4.5)
            return { label: "AA", class: "text-green-400 bg-green-400/20" };
        if (ratio >= 3)
            return {
                label: "AA Large",
                class: "text-yellow-400 bg-yellow-400/20",
            };
        return { label: "Fail", class: "text-red-400 bg-red-400/20" };
    });

    let newVarName = $state("");
    let newVarColor = $state("#00A3E0");
    let isAddingVar = $state(false);

    function addNewColorVariable() {
        if (newVarName.trim()) {
            designTokens.addColorVariable(newVarName.trim(), newVarColor);
            newVarName = "";
            newVarColor = "#00A3E0";
            isAddingVar = false;
        }
    }

    function handleRandomizeColors() {
        const palette = randomContrastSafePalette(
            designTokens.tokens.themeMode,
        );

        // Core colors
        if (!designTokens.isColorLocked("primary")) {
            designTokens.updateColorVariable("primary", {
                value: palette.primary,
            });
        }
        if (!designTokens.isColorLocked("accent")) {
            designTokens.updateColorVariable("accent", {
                value: palette.accent,
            });
        }
        if (!designTokens.isColorLocked("text")) {
            designTokens.updateColorVariable("text", { value: palette.text });
        }
        if (!designTokens.isColorLocked("background")) {
            designTokens.updateColorVariable("background", {
                value: palette.background,
            });
        }

        // Custom variables - use contrast-safe colors against background
        const coreIds = ["primary", "accent", "text", "background"];
        for (const variable of designTokens.tokens.colorVariables) {
            if (
                !coreIds.includes(variable.id) &&
                !designTokens.isColorLocked(variable.id)
            ) {
                designTokens.updateColorVariable(variable.id, {
                    value: randomContrastSafeColor(palette.background),
                });
            }
        }

        // Toast colors - use contrast-safe colors against background
        if (designTokens.tokens.enableToasts) {
            if (!designTokens.isToastColorLocked("info")) {
                designTokens.updateColor(
                    "info",
                    randomContrastSafeColor(palette.background),
                );
            }
            if (!designTokens.isToastColorLocked("success")) {
                designTokens.updateColor(
                    "success",
                    randomContrastSafeColor(palette.background),
                );
            }
            if (!designTokens.isToastColorLocked("warning")) {
                designTokens.updateColor(
                    "warning",
                    randomContrastSafeColor(palette.background),
                );
            }
            if (!designTokens.isToastColorLocked("error")) {
                designTokens.updateColor(
                    "error",
                    randomContrastSafeColor(palette.background),
                );
            }
        }
    }
</script>

<SidebarSection title={m.theme_colors()}>
    <div class="space-y-6">
        <!-- Color Variables -->
        <div class="space-y-3">
            {#each tokens.colorVariables as variable, i}
                {@const isCore = [
                    "primary",
                    "accent",
                    "text",
                    "background",
                ].includes(variable.id)}
                {@const translatedLabel =
                    variable.id === "primary"
                        ? m.primary()
                        : variable.id === "accent"
                          ? m.accent()
                          : variable.id === "text"
                            ? m.text()
                            : variable.id === "background"
                              ? m.background()
                              : variable.name}
                <div class="flex gap-2 {isCore ? 'pr-10' : ''}">
                    <div class="flex-1 min-w-0">
                        <ColorPicker
                            value={variable.value}
                            label={translatedLabel}
                            locked={designTokens.isColorLocked(variable.id)}
                            editable={!isCore}
                            onLockToggle={() =>
                                designTokens.toggleColorLock(variable.id)}
                            onchange={(v) =>
                                designTokens.updateColorVariable(variable.id, {
                                    value: v,
                                })}
                            onLabelChange={!isCore
                                ? (name) =>
                                      designTokens.updateColorVariable(
                                          variable.id,
                                          { name },
                                      )
                                : undefined}
                        />
                    </div>
                    {#if !isCore}
                        <button
                            type="button"
                            class="w-8 h-8 shrink-0 flex items-center justify-center hover:text-red-400 hover:bg-red-500/10 self-end {isDark
                                ? 'bg-white/5 text-white/30'
                                : 'bg-black/5 text-black/30'}"
                            onclick={() =>
                                designTokens.deleteColorVariable(variable.id)}
                            ><span class="material-icons text-[16px]"
                                >delete</span
                            ></button
                        >
                    {/if}
                </div>
            {/each}
        </div>

        <!-- Add Variable -->
        {#if isAddingVar}
            <div class="space-y-3">
                <input
                    type="text"
                    bind:value={newVarName}
                    placeholder={m.variable_name()}
                    class="w-full h-8 px-3 text-[14px] focus:outline-none {isDark
                        ? 'bg-white/5 text-white placeholder:text-white/30 focus:bg-white/10'
                        : 'bg-black/5 text-black placeholder:text-black/30 focus:bg-black/10'}"
                />
                <div class="flex gap-2 items-center">
                    <ColorPicker
                        value={newVarColor}
                        label=""
                        onchange={(v) => (newVarColor = v)}
                    />
                </div>
                <div class="flex gap-2">
                    <button
                        type="button"
                        class="flex-1 h-8 text-[14px] {isDark
                            ? 'bg-white/10 text-white hover:bg-white/15'
                            : 'bg-black/10 text-black hover:bg-black/15'}"
                        onclick={addNewColorVariable}>{m.add()}</button
                    >
                    <button
                        type="button"
                        class="flex-1 h-8 text-[14px] {isDark
                            ? 'bg-white/5 text-white/50 hover:text-white hover:bg-white/10'
                            : 'bg-black/5 text-black/50 hover:text-black hover:bg-black/10'}"
                        onclick={() => (isAddingVar = false)}
                        >{m.cancel()}</button
                    >
                </div>
            </div>
        {:else}
            <div class="flex gap-2">
                <button
                    type="button"
                    class="flex-1 py-2 text-[14px] {isDark
                        ? 'bg-white/5 text-white/70 hover:bg-white/10'
                        : 'bg-black/5 text-black/70 hover:bg-black/10'}"
                    onclick={() => (isAddingVar = true)}
                    >{m.add_variable()}</button
                >
                <button
                    type="button"
                    class="flex-1 py-2 text-[14px] {isDark
                        ? 'bg-white/5 text-white/70 hover:bg-white/10'
                        : 'bg-black/5 text-black/70 hover:bg-black/10'}"
                    onclick={handleRandomizeColors}
                    title={m.randomize_colors()}>{m.randomize()}</button
                >
            </div>
        {/if}

        <!-- Options -->
        <div class="space-y-2 pt-4">
            <div class="flex items-center gap-3">
                <Checkbox
                    checked={tokens.defaultThemeMode === "dark"}
                    onchange={(checked) =>
                        designTokens.setDefaultThemeMode(
                            checked ? "dark" : "light",
                        )}
                    label={m.dark_mode_default()}
                />
                {#if tokens.themeMode !== tokens.defaultThemeMode}
                    <span
                        class="px-2 py-0.5 text-[14px] font-medium ml-auto"
                        style="background-color: #eab30820; color: #eab308"
                        >{m.previewing_mode({
                            mode:
                                tokens.themeMode === "light"
                                    ? m.theme_light()
                                    : m.theme_dark(),
                        })}</span
                    >
                {/if}
            </div>
            <Checkbox
                checked={tokens.enableButtons}
                onchange={(checked) => designTokens.toggleButtons(checked)}
                label={m.enable_buttons()}
            />
            <Checkbox
                checked={tokens.enableToasts}
                onchange={(checked) => designTokens.toggleToasts(checked)}
                label={m.enable_toasts()}
            />
        </div>
    </div>
</SidebarSection>
