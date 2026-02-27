<script lang="ts">
    import {
        fontStore,
        popularGoogleFonts,
        searchGoogleFonts,
        systemFonts,
    } from "../stores/fontStore.svelte";
    import { designTokens } from "../stores/designTokens.svelte";

    interface Props {
        value: string;
        onchange?: (value: string) => void;
    }

    let { value = "system-ui", onchange }: Props = $props();
    const isDark = $derived(designTokens.tokens.themeMode === "dark");

    let isOpen = $state(false);
    let searchQuery = $state("");
    let isLoading = $state(false);
    let isSearching = $state(false);
    let searchResults = $state<string[]>([]);
    let fileInput: HTMLInputElement | undefined = $state();
    let searchTimeout: ReturnType<typeof setTimeout> | null = null;

    // Filter popular fonts when no search, or show search results
    const displayedGoogleFonts = $derived(
        searchQuery.length >= 2 ? searchResults : popularGoogleFonts,
    );

    const filteredSystemFonts = $derived(
        systemFonts.filter((font) =>
            font.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
    );

    const loadedFontFamilies = $derived(fontStore.getFontFamilies());

    // Debounced search
    function handleSearchInput(query: string) {
        searchQuery = query;
        if (searchTimeout) clearTimeout(searchTimeout);

        if (query.length >= 2) {
            isSearching = true;
            searchTimeout = setTimeout(async () => {
                searchResults = await searchGoogleFonts(query);
                isSearching = false;
            }, 300);
        } else {
            searchResults = [];
            isSearching = false;
        }
    }

    async function selectFont(font: string) {
        isLoading = true;
        await fontStore.loadGoogleFont(font);
        onchange?.(font);
        isLoading = false;
        isOpen = false;
        searchQuery = "";
    }

    async function handleFileUpload(e: Event) {
        const target = e.target as HTMLInputElement;
        const file = target.files?.[0];
        if (file) {
            isLoading = true;
            const fontName = await fontStore.loadLocalFont(file);
            if (fontName) {
                onchange?.(fontName);
            }
            isLoading = false;
        }
    }

    function triggerFileUpload() {
        fileInput?.click();
    }
</script>

<div class="font-picker relative">
    <button
        class="w-full px-2 py-1.5 text-left text-[14px] flex items-center justify-between focus:outline-none {isDark
            ? 'bg-white/5 text-white focus:bg-white/10'
            : 'bg-black/5 text-black focus:bg-black/10'}"
        onclick={() => (isOpen = !isOpen)}
    >
        <span class="truncate" style="font-family: {value}">{value}</span>
        <span class={isDark ? "text-white/40" : "text-black/40"}
            >{isOpen ? "−" : "+"}</span
        >
    </button>

    {#if isOpen}
        <div
            class="absolute top-full left-0 right-0 mt-1 shadow-xl z-50 max-h-80 overflow-hidden flex flex-col {isDark
                ? 'bg-[#0A121F]'
                : 'bg-[#E8EDF5]'}"
        >
            <div class="p-2">
                <input
                    type="text"
                    value={searchQuery}
                    oninput={(e) =>
                        handleSearchInput((e.target as HTMLInputElement).value)}
                    placeholder="Search Google Fonts..."
                    class="w-full px-2 py-1.5 text-[14px] focus:outline-none {isDark
                        ? 'bg-white/5 text-white placeholder:text-white/30 focus:bg-white/10'
                        : 'bg-black/5 text-black placeholder:text-black/30 focus:bg-black/10'}"
                />
            </div>

            <div class="overflow-y-auto flex-1">
                <!-- System Fonts -->
                {#if filteredSystemFonts.length > 0}
                    <div class="p-2">
                        <div
                            class="text-[14px] mb-1 {isDark
                                ? 'text-white/40'
                                : 'text-black/40'}"
                        >
                            System Fonts
                        </div>
                        {#each filteredSystemFonts as font}
                            <button
                                class="w-full px-2 py-1.5 text-left text-[14px] {isDark
                                    ? 'text-white hover:bg-white/10'
                                    : 'text-black hover:bg-black/10'} {value ===
                                font
                                    ? isDark
                                        ? 'bg-white/15'
                                        : 'bg-black/15'
                                    : ''}"
                                style="font-family: {font}"
                                onclick={() => {
                                    onchange?.(font);
                                    isOpen = false;
                                }}>{font}</button
                            >
                        {/each}
                    </div>
                {/if}

                <!-- Loaded Fonts -->
                {#if loadedFontFamilies.length > 0}
                    <div class="p-2">
                        <div
                            class="text-[14px] mb-1 {isDark
                                ? 'text-white/40'
                                : 'text-black/40'}"
                        >
                            Loaded
                        </div>
                        {#each loadedFontFamilies as font}
                            <button
                                class="w-full px-2 py-1.5 text-left text-[14px] {isDark
                                    ? 'text-white hover:bg-white/10'
                                    : 'text-black hover:bg-black/10'} {value ===
                                font
                                    ? isDark
                                        ? 'bg-white/15'
                                        : 'bg-black/15'
                                    : ''}"
                                style="font-family: {font}"
                                onclick={() => {
                                    onchange?.(font);
                                    isOpen = false;
                                }}>{font}</button
                            >
                        {/each}
                    </div>
                {/if}

                <!-- Google Fonts -->
                <div class="p-2">
                    <div
                        class="text-[14px] mb-1 {isDark
                            ? 'text-white/40'
                            : 'text-black/40'}"
                    >
                        {searchQuery.length >= 2 ? `Search Results` : "Popular"}
                        {#if isSearching}<span class="animate-pulse">...</span
                            >{/if}
                    </div>
                    {#each displayedGoogleFonts as font}
                        <button
                            class="w-full px-2 py-1.5 text-left text-[14px] flex items-center justify-between {isDark
                                ? 'text-white hover:bg-white/10'
                                : 'text-black hover:bg-black/10'}"
                            onclick={() => selectFont(font)}
                            disabled={isLoading}
                        >
                            <span>{font}</span>
                            {#if loadedFontFamilies.includes(font)}
                                <span
                                    class="material-icons text-[14px] {isDark
                                        ? 'text-white/60'
                                        : 'text-black/60'}">check</span
                                >
                            {/if}
                        </button>
                    {/each}
                </div>
            </div>

            <div class="p-2">
                <input
                    type="file"
                    accept=".ttf,.otf,.woff,.woff2"
                    onchange={handleFileUpload}
                    class="hidden"
                    bind:this={fileInput}
                />
                <button
                    class="w-full py-2 text-[14px] {isDark
                        ? 'bg-white/5 hover:bg-white/10 text-white/60'
                        : 'bg-black/5 hover:bg-black/10 text-black/60'}"
                    onclick={triggerFileUpload}>Upload Local Font</button
                >
            </div>
        </div>
    {/if}
</div>

{#if isLoading}
    <div class="mt-1 text-[14px] {isDark ? 'text-white/40' : 'text-black/40'}">
        Loading font...
    </div>
{/if}
