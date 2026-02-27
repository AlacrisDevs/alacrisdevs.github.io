<script lang="ts">
    import { base } from "$app/paths";

    const appPath = `${base}/tools/flowstate/app/`;
    let loading = $state(true);

    function handleIframeLoad() {
        loading = false;
    }
</script>

<svelte:head>
    <title>FlowState | Alacris Devs</title>
</svelte:head>

<main class="h-screen bg-secondary relative">
    {#if loading}
        <div
            class="absolute inset-0 z-10 flex items-center justify-center bg-secondary"
        >
            <div class="flex flex-col items-center gap-4">
                <div
                    class="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"
                ></div>
                <p class="text-white/60 text-sm">Loading FlowState...</p>
            </div>
        </div>
    {/if}
    <iframe
        src={appPath}
        title="FlowState"
        class="block w-full h-full border-0 bg-secondary"
        style="background-color: #0A121F;"
        allow="fullscreen; clipboard-write"
        loading="eager"
        allowfullscreen
        onload={handleIframeLoad}
    ></iframe>
</main>
