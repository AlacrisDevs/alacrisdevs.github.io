<script lang="ts">
    import { designTokens } from "../../stores/designTokens.svelte";
    import { presetsStore } from "../../stores/presetsStore.svelte";
    import { toastStore } from "../../stores/toastStore.svelte";
    import {
        exportToTailwindCSS,
        exportToTailwindConfig,
        downloadFile,
    } from "../../utils/exportTailwind";
    import { copyShareableUrl } from "../../utils/urlState";
    import * as m from "$lib/paraglide/messages/_index.js";

    const tokens = $derived(designTokens.tokens);
    const isDark = $derived(tokens.themeMode === "dark");

    function handleExportCSS() {
        const css = exportToTailwindCSS(tokens);
        downloadFile(css, "design-system.css");
    }

    function handleExportConfig() {
        const config = exportToTailwindConfig(tokens);
        downloadFile(config, "tailwind.config.js");
    }

    function handleExportJSON() {
        const json = designTokens.exportToJSON();
        downloadFile(json, "design-tokens.json");
    }

    async function handleCopyLink() {
        const success = await copyShareableUrl(tokens);
        if (success) {
            toastStore.success(m.link_copied());
        } else {
            toastStore.error(m.link_copy_failed());
        }
    }

    function handleReset() {
        const isDirty = designTokens.isDirty;
        const message = isDirty
            ? "⚠️ You have unsaved changes!\n\nReset all design tokens to defaults? This will clear all saved presets and your current work."
            : "Reset all design tokens to defaults? This will clear all saved presets.";

        if (confirm(message)) {
            presetsStore.resetToDefaults();
            // Clear autosave
            localStorage.removeItem("designTokens_autosave");
            toastStore.info(m.reset_complete());
        }
    }
</script>

<footer class="px-4 py-4 space-y-3 {isDark ? 'bg-[#0A121F]' : 'bg-[#E8EDF5]'}">
    <!-- Share -->
    <button
        class="w-full py-2 text-[14px] {isDark
            ? 'bg-white/10 text-white hover:bg-white/15'
            : 'bg-black/10 text-black hover:bg-black/15'}"
        onclick={handleCopyLink}>{m.share_link()}</button
    >

    <!-- Export -->
    <div class="flex gap-1">
        <button
            class="flex-1 py-2 text-[14px] {isDark
                ? 'bg-white/5 text-white/70 hover:bg-white/10'
                : 'bg-black/5 text-black/70 hover:bg-black/10'}"
            onclick={handleExportCSS}>{m.css()}</button
        >
        <button
            class="flex-1 py-2 text-[14px] {isDark
                ? 'bg-white/5 text-white/70 hover:bg-white/10'
                : 'bg-black/5 text-black/70 hover:bg-black/10'}"
            onclick={handleExportConfig}>{m.config()}</button
        >
        <button
            class="flex-1 py-2 text-[14px] {isDark
                ? 'bg-white/5 text-white/70 hover:bg-white/10'
                : 'bg-black/5 text-black/70 hover:bg-black/10'}"
            onclick={handleExportJSON}>{m.json()}</button
        >
    </div>

    <!-- Reset -->
    <button
        class="w-full py-2 text-[14px] hover:text-red-400 hover:bg-red-500/10 {isDark
            ? 'text-white/40'
            : 'text-black/40'}"
        onclick={handleReset}>{m.reset()}</button
    >
</footer>
