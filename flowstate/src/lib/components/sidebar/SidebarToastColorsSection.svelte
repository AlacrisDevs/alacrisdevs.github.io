<script lang="ts">
    import { designTokens } from "../../stores/designTokens.svelte";
    import ColorPicker from "../ColorPicker.svelte";
    import SidebarSection from "../SidebarSection.svelte";
    import Checkbox from "../Checkbox.svelte";
    import * as m from "$lib/paraglide/messages/_index.js";

    const tokens = $derived(designTokens.tokens);
    const isDark = $derived(tokens.themeMode === "dark");
</script>

{#if tokens.enableToasts}
    <SidebarSection title={m.toast_settings()} defaultOpen={false}>
        <div class="space-y-6">
            <!-- Show headings toggle -->
            <Checkbox
                checked={tokens.enableToastHeadings}
                onchange={(checked) =>
                    (designTokens.tokens.enableToastHeadings = checked)}
                label={m.show_toast_headings()}
            />

            <!-- Toast Colors -->
            <div class="space-y-3">
                <span
                    class="text-[14px] font-medium {isDark
                        ? 'text-white/40'
                        : 'text-black/40'}">{m.toast_colors()}</span
                >
                <ColorPicker
                    value={tokens.colors.info}
                    label={m.info()}
                    locked={tokens.lockedColors.info}
                    onLockToggle={() =>
                        designTokens.toggleToastColorLock("info")}
                    onchange={(v) => designTokens.updateColor("info", v)}
                />
                <ColorPicker
                    value={tokens.colors.success}
                    label={m.success()}
                    locked={tokens.lockedColors.success}
                    onLockToggle={() =>
                        designTokens.toggleToastColorLock("success")}
                    onchange={(v) => designTokens.updateColor("success", v)}
                />
                <ColorPicker
                    value={tokens.colors.warning}
                    label={m.warning()}
                    locked={tokens.lockedColors.warning}
                    onLockToggle={() =>
                        designTokens.toggleToastColorLock("warning")}
                    onchange={(v) => designTokens.updateColor("warning", v)}
                />
                <ColorPicker
                    value={tokens.colors.error}
                    label={m.error()}
                    locked={tokens.lockedColors.error}
                    onLockToggle={() =>
                        designTokens.toggleToastColorLock("error")}
                    onchange={(v) => designTokens.updateColor("error", v)}
                />
            </div>
        </div>
    </SidebarSection>
{/if}
