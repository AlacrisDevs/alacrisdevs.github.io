<script lang="ts">
    import { presetsStore } from "../stores/presetsStore.svelte";
    import { designTokens } from "../stores/designTokens.svelte";
    import { toastStore } from "../stores/toastStore.svelte";
    import ButtonPrimary from "./ButtonPrimary.svelte";
    import ButtonSecondary from "./ButtonSecondary.svelte";
    import * as m from "$lib/paraglide/messages/_index.js";

    const isDark = $derived(designTokens.tokens.themeMode === "dark");
    const presets = $derived(presetsStore.presets);
    const activePresetId = $derived(presetsStore.activePresetId);

    // Dialog refs - using native HTML dialog element
    let saveDialogRef = $state<HTMLDialogElement | null>(null);
    let renameDialogRef = $state<HTMLDialogElement | null>(null);
    let confirmDialogRef = $state<HTMLDialogElement | null>(null);

    // Form state
    let editingPresetId = $state<string | null>(null);
    let editingPresetName = $state("");
    let fileInput: HTMLInputElement | undefined = $state();

    // Open dialogs
    function openSaveDialog() {
        saveDialogRef?.showModal();
    }

    function openRenameDialog(id: string, name: string) {
        editingPresetId = id;
        editingPresetName = name;
        renameDialogRef?.showModal();
    }

    function openConfirmDialog() {
        confirmDialogRef?.showModal();
    }

    // Handle save preset form submit
    function handleSaveSubmit(e: SubmitEvent) {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        const name = (formData.get("presetName") as string)?.trim();

        if (!name) {
            toastStore.error("Please enter a preset name");
            return;
        }

        try {
            const result = presetsStore.saveCurrentAsPreset(name);
            if (result) {
                toastStore.success(`Preset "${name}" saved`);
                form.reset();
                saveDialogRef?.close();
            } else {
                toastStore.error("Failed to save preset - unknown error");
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            console.error("Preset save error:", err);
            toastStore.error(`Failed to save preset: ${message}`);
        }
    }

    // Handle rename form submit
    function handleRenameSubmit(e: SubmitEvent) {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        const name = (formData.get("presetName") as string)?.trim();

        if (!name || !editingPresetId) {
            toastStore.error("Please enter a name");
            return;
        }

        try {
            presetsStore.renamePreset(editingPresetId, name);
            toastStore.success("Preset renamed");
            editingPresetId = null;
            editingPresetName = "";
            form.reset();
            renameDialogRef?.close();
        } catch (err) {
            toastStore.error("Failed to rename preset");
        }
    }

    function handleLoad(id: string) {
        try {
            presetsStore.loadPreset(id);
        } catch (err) {
            toastStore.error("Failed to load preset");
        }
    }

    function handleUpdate(id: string) {
        if (presetsStore.isDefaultPreset(id)) {
            openConfirmDialog();
        } else {
            try {
                presetsStore.updatePreset(id);
                toastStore.success("Preset updated");
            } catch (err) {
                toastStore.error("Failed to update preset");
            }
        }
    }

    function confirmUpdateDefault() {
        try {
            presetsStore.updatePreset("default");
            toastStore.success("Default preset updated");
            confirmDialogRef?.close();
        } catch (err) {
            toastStore.error("Failed to update default preset");
        }
    }

    function handleDelete(id: string) {
        if (presetsStore.isDefaultPreset(id)) return;
        if (confirm("Delete this preset?")) {
            try {
                presetsStore.deletePreset(id);
                toastStore.success("Preset deleted");
            } catch (err) {
                toastStore.error("Failed to delete preset");
            }
        }
    }

    function handleImport() {
        fileInput?.click();
    }

    function onFileSelected(e: Event) {
        const target = e.target as HTMLInputElement;
        const file = target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                try {
                    const json = reader.result as string;
                    presetsStore.importPreset(json);
                    toastStore.success("Preset imported");
                } catch (err) {
                    toastStore.error("Failed to import preset");
                }
            };
            reader.onerror = () => {
                toastStore.error("Failed to read file");
            };
            reader.readAsText(file);
        }
        // Reset input so same file can be selected again
        target.value = "";
    }

    // Handle backdrop click to close dialog
    function handleDialogClick(
        e: MouseEvent,
        dialog: HTMLDialogElement | null,
    ) {
        if (e.target === dialog) {
            dialog?.close();
        }
    }
</script>

<div class="preset-manager">
    <div class="flex items-center gap-2 mb-3">
        <ButtonPrimary onclick={openSaveDialog}>
            + {m.new_preset()}
        </ButtonPrimary>
        <ButtonSecondary onclick={handleImport}>
            {m.import()}
        </ButtonSecondary>
    </div>

    <input
        type="file"
        accept=".json"
        class="hidden"
        bind:this={fileInput}
        onchange={onFileSelected}
    />

    {#if presets.length === 0}
        <div
            class="text-center py-6 text-[14px] {isDark
                ? 'text-white/40'
                : 'text-black/40'}"
        >
            {m.no_presets()}
        </div>
    {:else}
        <div class="space-y-2">
            {#each presets as preset}
                {@const isDefault = presetsStore.isDefaultPreset(preset.id)}
                {@const isActive = activePresetId === preset.id}
                <div class="flex items-center gap-1">
                    <button
                        class="flex-1 py-2 px-3 text-left text-[14px] truncate {isActive
                            ? isDark
                                ? 'bg-white/15 text-white'
                                : 'bg-black/15 text-black'
                            : isDark
                              ? 'bg-white/5 text-white/70 hover:bg-white/10'
                              : 'bg-black/5 text-black/70 hover:bg-black/10'}"
                        onclick={() => handleLoad(preset.id)}
                    >
                        {preset.name}
                    </button>
                    {#if isDefault}
                        <div
                            class="w-8 h-8 shrink-0 flex items-center justify-center"
                        >
                            <span
                                class="material-icons text-[16px] {isDark
                                    ? 'text-white/30'
                                    : 'text-black/30'}">lock</span
                            >
                        </div>
                    {:else}
                        <button
                            type="button"
                            class="w-8 h-8 shrink-0 flex items-center justify-center text-[14px] {isDark
                                ? 'bg-white/5 text-white/60 hover:bg-white/10'
                                : 'bg-black/5 text-black/60 hover:bg-black/10'}"
                            onclick={() => handleUpdate(preset.id)}
                            title={m.save_to_preset()}
                            ><span class="material-icons text-[16px]">save</span
                            ></button
                        >
                        <button
                            type="button"
                            class="w-8 h-8 shrink-0 flex items-center justify-center text-[14px] {isDark
                                ? 'bg-white/5 text-white/40 hover:text-red-400 hover:bg-red-500/10'
                                : 'bg-black/5 text-black/40 hover:text-red-400 hover:bg-red-500/10'}"
                            onclick={() => handleDelete(preset.id)}
                            title={m.delete_preset()}
                            ><span class="material-icons text-[16px]"
                                >delete</span
                            ></button
                        >
                    {/if}
                </div>
            {/each}
        </div>
    {/if}
</div>

<!-- Save Dialog - Native HTML Dialog -->
<dialog
    bind:this={saveDialogRef}
    class="modal-dialog"
    onclick={(e) => handleDialogClick(e, saveDialogRef)}
>
    <form
        class="p-4 w-80 {isDark ? 'bg-[#0A121F]' : 'bg-white'}"
        onsubmit={handleSaveSubmit}
    >
        <h3
            class="text-[14px] font-medium mb-3 {isDark
                ? 'text-white'
                : 'text-black'}"
        >
            {m.save_preset()}
        </h3>
        <input
            name="presetName"
            type="text"
            required
            placeholder={m.preset_name()}
            class="w-full h-8 px-3 text-[14px] mb-3 focus:outline-none {isDark
                ? 'bg-white/5 text-white placeholder:text-white/30 focus:bg-white/10'
                : 'bg-black/5 text-black placeholder:text-black/30 focus:bg-black/10'}"
        />
        <div class="flex gap-2">
            <button
                type="button"
                class="flex-1 h-8 text-[14px] {isDark
                    ? 'bg-white/5 text-white/50 hover:text-white hover:bg-white/10'
                    : 'bg-black/5 text-black/50 hover:text-black hover:bg-black/10'}"
                onclick={() => saveDialogRef?.close()}>{m.cancel()}</button
            >
            <button
                type="submit"
                class="flex-1 h-8 text-[14px] {isDark
                    ? 'bg-white/10 text-white hover:bg-white/15'
                    : 'bg-black/10 text-black hover:bg-black/15'}"
                >{m.save()}</button
            >
        </div>
    </form>
</dialog>

<!-- Rename Dialog - Native HTML Dialog -->
<dialog
    bind:this={renameDialogRef}
    class="modal-dialog"
    onclick={(e) => handleDialogClick(e, renameDialogRef)}
>
    <form
        class="p-4 w-80 {isDark ? 'bg-[#0A121F]' : 'bg-white'}"
        onsubmit={handleRenameSubmit}
    >
        <h3
            class="text-[14px] font-medium mb-3 {isDark
                ? 'text-white'
                : 'text-black'}"
        >
            {m.rename_preset()}
        </h3>
        <input
            name="presetName"
            type="text"
            required
            value={editingPresetName}
            placeholder={m.preset_name()}
            class="w-full h-8 px-3 text-[14px] mb-3 focus:outline-none {isDark
                ? 'bg-white/5 text-white placeholder:text-white/30 focus:bg-white/10'
                : 'bg-black/5 text-black placeholder:text-black/30 focus:bg-black/10'}"
        />
        <div class="flex gap-2">
            <button
                type="button"
                class="flex-1 h-8 text-[14px] {isDark
                    ? 'bg-white/5 text-white/50 hover:text-white hover:bg-white/10'
                    : 'bg-black/5 text-black/50 hover:text-black hover:bg-black/10'}"
                onclick={() => renameDialogRef?.close()}>{m.cancel()}</button
            >
            <button
                type="submit"
                class="flex-1 h-8 text-[14px] {isDark
                    ? 'bg-white/10 text-white hover:bg-white/15'
                    : 'bg-black/10 text-black hover:bg-black/15'}"
                >{m.save()}</button
            >
        </div>
    </form>
</dialog>

<!-- Confirm Default Update Dialog - Native HTML Dialog -->
<dialog
    bind:this={confirmDialogRef}
    class="modal-dialog"
    onclick={(e) => handleDialogClick(e, confirmDialogRef)}
>
    <div class="p-4 w-80 {isDark ? 'bg-[#0A121F]' : 'bg-white'}">
        <h3
            class="text-[14px] font-medium mb-3 {isDark
                ? 'text-white'
                : 'text-black'}"
        >
            Update Default Preset
        </h3>
        <p
            class="text-[14px] mb-4 {isDark
                ? 'text-white/60'
                : 'text-black/60'}"
        >
            Are you sure you want to overwrite the default preset with your
            current settings? This will change the initial state for all new
            projects.
        </p>
        <div class="flex gap-2">
            <button
                type="button"
                class="flex-1 h-8 text-[14px] {isDark
                    ? 'bg-white/5 text-white/50 hover:text-white hover:bg-white/10'
                    : 'bg-black/5 text-black/50 hover:text-black hover:bg-black/10'}"
                onclick={() => confirmDialogRef?.close()}>{m.cancel()}</button
            >
            <button
                type="button"
                class="flex-1 h-8 text-[14px] {isDark
                    ? 'bg-white/10 text-white hover:bg-white/15'
                    : 'bg-black/10 text-black hover:bg-black/15'}"
                onclick={confirmUpdateDefault}>Update</button
            >
        </div>
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
