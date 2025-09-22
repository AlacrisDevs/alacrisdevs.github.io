<script lang="ts">
    export let imageSrc: string;
    export let imageAlt: string;
    export let title: string;
    export let description: string;
    export let href: string | undefined = undefined;
    export let target: string | undefined = undefined;

    // Lazy-load state for this card's image
    let imgLoaded = false;

    function markLoaded() {
        imgLoaded = true;
    }

    // Action to handle cached images and provide a fail-safe timeout
    function imgReady(node: HTMLImageElement) {
        const done = () => (imgLoaded = true);
        if (node.complete) done();
        node.addEventListener("load", done);
        node.addEventListener("error", done);
        const t = setTimeout(done, 3000);
        return {
            destroy() {
                node.removeEventListener("load", done);
                node.removeEventListener("error", done);
                clearTimeout(t);
            },
        };
    }

    function handleClick(event: MouseEvent) {
        if (href) {
            // Let the browser handle the navigation
            return;
        }
        // If no href, prevent default and dispatch click event
        event.preventDefault();
    }

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            if (href) {
                // Let the browser handle the navigation
                return;
            }
        }
    }
</script>

{#if href}
    <a {href} {target} class="card-container" on:click={handleClick} aria-label={`${title} - ${description}`}>
        <div class="card-image">
            {#if !imgLoaded}
                <div class="absolute inset-0 shimmer pointer-events-none" aria-hidden="true"></div>
            {/if}
            <img
                src={imageSrc}
                alt={imageAlt || title}
                loading="lazy"
                decoding="async"
                fetchpriority="low"
                class:opacity-0={!imgLoaded}
                class:opacity-100={imgLoaded}
                class="block w-full h-auto transition-opacity duration-300 ease-out"
                use:imgReady
                on:load={markLoaded}
                on:error={markLoaded}
            />
        </div>
        <div class="card-text-container">
            <div class="card-title-container">
                <h4 class="h4">{title}</h4>
            </div>
            <p class="p card-description">{description}</p>
        </div>
    </a>
{:else}
    <div
        class="card-container"
        role="button"
        tabindex="0"
        on:click={handleClick}
        on:keydown={handleKeydown}
        aria-label={`${title} - ${description}`}
    >
        <div class="card-image">
            {#if !imgLoaded}
                <div class="absolute inset-0 shimmer pointer-events-none" aria-hidden="true"></div>
            {/if}
            <img
                src={imageSrc}
                alt={imageAlt || title}
                loading="lazy"
                decoding="async"
                fetchpriority="low"
                class:opacity-0={!imgLoaded}
                class:opacity-100={imgLoaded}
                class="block w-full h-auto transition-opacity duration-300 ease-out"
                use:imgReady
                on:load={markLoaded}
                on:error={markLoaded}
            />
        </div>
        <div class="card-text-container">
            <div class="card-title-container">
                <h4 class="h4">{title}</h4>
            </div>
            <p class="p card-description">{description}</p>
        </div>
    </div>
{/if}

<style>
    .shimmer {
        background: linear-gradient(90deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.18) 50%, rgba(255,255,255,0.08) 100%);
        background-size: 200% 100%;
        animation: shimmer 1.2s infinite;
    }
    @keyframes shimmer {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
    }
</style>
