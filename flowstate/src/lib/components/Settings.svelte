<script lang="ts">
    import { settingsStore } from "../stores/settingsStore.svelte";
    import { useSettings } from "../composables/useSettings.svelte";
    import { getLocale, setLocale } from "$lib/paraglide/runtime.js";
    import Checkbox from "./Checkbox.svelte";
    import * as m from "$lib/paraglide/messages/_index.js";

    const { isDark, setUnit, setThemeSpecificLocks } = useSettings();
    const currentLang = $derived(getLocale());

    let dialogRef = $state<HTMLDialogElement | null>(null);

    function openSettings() {
        dialogRef?.showModal();
    }

    function closeSettings() {
        dialogRef?.close();
    }

    function handleDialogClick(e: MouseEvent) {
        if (e.target === dialogRef) {
            closeSettings();
        }
    }

    function handleLanguageChange(lang: string) {
        settingsStore.setLanguage(lang);
        setLocale(lang as "en" | "et");
    }

    function handleUnitChange(unit: "px" | "rem") {
        settingsStore.setUnit(unit);
        setUnit(unit);
    }

    function handleThemeSpecificLocksChange(e: Event) {
        const target = e.target as HTMLInputElement;
        settingsStore.setThemeSpecificLocks(target.checked);
    }
</script>

<button
    class="w-8 h-8 flex items-center justify-center {isDark
        ? 'text-white/60 hover:text-white hover:bg-white/10'
        : 'text-black/60 hover:text-black hover:bg-black/10'}"
    onclick={openSettings}
    title={m.settings()}
>
    <span class="material-icons text-[18px]">settings</span>
</button>

<dialog bind:this={dialogRef} class="modal-dialog" onclick={handleDialogClick}>
    <div class="p-4 w-80 {isDark ? 'bg-[#0A121F]' : 'bg-white'}">
        <h3
            class="text-[14px] font-medium mb-4 {isDark
                ? 'text-white'
                : 'text-black'}"
        >
            {m.settings()}
        </h3>

        <!-- Language -->
        <div class="mb-4">
            <span
                class="block text-[12px] mb-2 {isDark
                    ? 'text-white/60'
                    : 'text-black/60'}"
            >
                {m.language()}
            </span>
            <div class="flex gap-1">
                <button
                    class="flex-1 h-8 text-[14px] {currentLang === 'en'
                        ? isDark
                            ? 'bg-white/15 text-white'
                            : 'bg-black/15 text-black'
                        : isDark
                          ? 'bg-white/5 text-white/60 hover:bg-white/10'
                          : 'bg-black/5 text-black/60 hover:bg-black/10'}"
                    onclick={() => handleLanguageChange("en")}
                >
                    English
                </button>
                <button
                    class="flex-1 h-8 text-[14px] {currentLang === 'et'
                        ? isDark
                            ? 'bg-white/15 text-white'
                            : 'bg-black/15 text-black'
                        : isDark
                          ? 'bg-white/5 text-white/60 hover:bg-white/10'
                          : 'bg-black/5 text-black/60 hover:bg-black/10'}"
                    onclick={() => handleLanguageChange("et")}
                >
                    Eesti
                </button>
            </div>
        </div>

        <!-- Unit -->
        <div class="mb-4">
            <span
                class="block text-[12px] mb-2 {isDark
                    ? 'text-white/60'
                    : 'text-black/60'}"
            >
                {m.size_unit()}
            </span>
            <div class="flex gap-1">
                <button
                    class="flex-1 h-8 text-[14px] {settingsStore.unit === 'px'
                        ? isDark
                            ? 'bg-white/15 text-white'
                            : 'bg-black/15 text-black'
                        : isDark
                          ? 'bg-white/5 text-white/60 hover:bg-white/10'
                          : 'bg-black/5 text-black/60 hover:bg-black/10'}"
                    onclick={() => handleUnitChange("px")}
                >
                    px
                </button>
                <button
                    class="flex-1 h-8 text-[14px] {settingsStore.unit === 'rem'
                        ? isDark
                            ? 'bg-white/15 text-white'
                            : 'bg-black/15 text-black'
                        : isDark
                          ? 'bg-white/5 text-white/60 hover:bg-white/10'
                          : 'bg-black/5 text-black/60 hover:bg-black/10'}"
                    onclick={() => handleUnitChange("rem")}
                >
                    rem
                </button>
            </div>
        </div>

        <!-- Theme-specific color locks -->
        <div class="mb-4">
            <label class="flex items-center gap-2 cursor-pointer">
                <input
                    type="checkbox"
                    checked={settingsStore.themeSpecificLocks}
                    onchange={handleThemeSpecificLocksChange}
                    class="w-4 h-4 accent-current"
                />
                <span
                    class="text-[14px] {isDark
                        ? 'text-white/80'
                        : 'text-black/80'}"
                >
                    {m.theme_specific_locks()}
                </span>
            </label>
            <p
                class="text-[12px] mt-1 {isDark
                    ? 'text-white/40'
                    : 'text-black/40'}"
            >
                {m.theme_specific_locks_description()}
            </p>
        </div>

        <!-- Close button -->
        <button
            type="button"
            class="w-full h-8 text-[14px] {isDark
                ? 'bg-white/10 text-white hover:bg-white/15'
                : 'bg-black/10 text-black hover:bg-black/15'}"
            onclick={closeSettings}
        >
            {m.close()}
        </button>
    </div>
</dialog>

<style>
    .modal-dialog {
        padding: 0;
        border: none;
        background: transparent;
        max-width: none;
        max-height: none;
        margin: auto;
        position: fixed;
        inset: 0;
        width: fit-content;
        height: fit-content;
    }
    .modal-dialog::backdrop {
        background: rgba(0, 0, 0, 0.7);
    }
</style>
