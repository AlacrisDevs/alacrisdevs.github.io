<script lang="ts">
    import { onMount, onDestroy, tick } from "svelte";

    // Load all images in the carousel directory (relative path; Vite glob doesn't resolve aliases)
    const modules = import.meta.glob(
        "../assets/images/carousel/*.{jpg,jpeg,png,webp,gif}",
        { eager: true, import: "default" },
    ) as Record<string, string>;

    // Deterministic order by filename
    let images: string[] = Object.entries(modules)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([, v]) => v);

    // Index state
    let index = 0;
    $: currentIndex = images.length
        ? ((index % images.length) + images.length) % images.length
        : 0;

    // Autoplay
    const intervalMs = 5000;
    let timer: ReturnType<typeof setInterval> | undefined;
    function resetTimer() {
        if (timer) clearInterval(timer);
        if (images.length > 1) timer = setInterval(next, intervalMs);
    }

    function goTo(i: number) {
        if (images.length === 0) return;
        transitioning = true;
        index = (i + images.length) % images.length;
        resetTimer();
    }

    // Track transition state to allow instant wrap without sweeping
    let transitioning = true;
    async function next() {
        if (images.length === 0) return;
        if (index === images.length - 1) {
            transitioning = false;
            await tick();
            index = 0; // snap
            await tick();
            requestAnimationFrame(() => (transitioning = true));
        } else {
            transitioning = true;
            index = index + 1;
        }
    }

    async function prev() {
        if (images.length === 0) return;
        if (index === 0) {
            transitioning = false;
            await tick();
            index = images.length - 1; // snap
            await tick();
            requestAnimationFrame(() => (transitioning = true));
        } else {
            transitioning = true;
            index = index - 1;
        }
    }

    onMount(() => {
        resetTimer();
    });
    onDestroy(() => {
        if (timer) clearInterval(timer);
    });

    // Swipe support
    let touchStartX = 0;
    let touchStartY = 0;
    let touchActive = false;
    const SWIPE_THRESHOLD = 40; // px

    // Lazy-load states for slides
    let loaded: boolean[] = [];
    function markLoaded(i: number) {
        loaded[i] = true;
        // reassign to notify Svelte
        loaded = [...loaded];
    }
    function imgReady(node: HTMLImageElement, i: number) {
        let idx = i;
        const done = () => markLoaded(idx);
        if (node.complete) done();
        node.addEventListener('load', done);
        node.addEventListener('error', done);
        const t = setTimeout(done, 3000);
        return {
            update(newI: number) {
                idx = newI;
                if (node.complete) done();
            },
            destroy() {
                node.removeEventListener('load', done);
                node.removeEventListener('error', done);
                clearTimeout(t);
            }
        };
    }
    // initialize on images change
    $: if (images && loaded.length !== images.length) {
        loaded = images.map(() => false);
    }
</script>

<div class="relative w-full overflow-hidden rounded-lg aspect-[16/9] carousel">
    <!-- Slides wrapper -->
    <div
        class={`flex ${transitioning ? "transition-transform duration-1000 ease-in-out" : ""}`}
        style={`transform: translateX(-${index * 100}%);`}
        aria-live="polite"
        on:touchstart={(e) => {
            const t = e.touches?.[0];
            if (!t) return;
            touchActive = true;
            touchStartX = t.clientX;
            touchStartY = t.clientY;
            if (timer) clearInterval(timer);
        }}
        on:touchmove={(e) => {
            if (!touchActive) return;
            const t = e.touches?.[0];
            if (!t) return;
            const dx = t.clientX - touchStartX;
            const dy = Math.abs(t.clientY - touchStartY);
            if (Math.abs(dx) > dy && Math.abs(dx) > 10) {
                // horizontal gesture; touch-action: pan-y avoids preventDefault
            }
        }}
        on:touchend={(e) => {
            if (!touchActive) return;
            touchActive = false;
            const t = e.changedTouches?.[0];
            if (!t) {
                resetTimer();
                return;
            }
            const dx = t.clientX - touchStartX;
            if (Math.abs(dx) > SWIPE_THRESHOLD) {
                if (dx < 0) next();
                else prev();
            }
            resetTimer();
        }}
    >
        {#if images.length === 0}
            <div
                class="w-full aspect-[16/9] bg-tertiary/20 flex items-center justify-center"
            >
                <span class="small text-white/60">No images found</span>
            </div>
        {:else}
            {#each images as src, i}
                <div class="slide relative w-full flex-shrink-0">
                    {#if !loaded[i]}
                        <div class="absolute inset-0 shimmer" aria-hidden="true"></div>
                    {/if}
                    <img
                        {src}
                        alt={`Carousel image ${i + 1} of ${images.length}`}
                        width="1600"
                        height="900"
                        loading={i === 0 ? "eager" : "lazy"}
                        decoding="async"
                        fetchpriority={i === currentIndex ? "high" : "low"}
                        class:opacity-0={!loaded[i]}
                        class:opacity-100={loaded[i]}
                        class="block w-full h-full object-cover transition-opacity duration-300 ease-out"
                        use:imgReady={i}
                        on:load={() => markLoaded(i)}
                        on:error={() => markLoaded(i)}
                    />
                </div>
            {/each}
        {/if}
    </div>

    <!-- Bullets -->
    {#if images.length > 1}
        <div
            class="absolute inset-x-0 bottom-4 flex justify-center items-center gap-2 z-10"
        >
            {#each images as _src, i}
                <button
                    class={`bullet-btn h-3.5 w-3.5 rounded-full transition-all duration-1000 ease-in-out bg-transparent no-tap-highlight`}
                    aria-label={`Go to image ${i + 1}`}
                    aria-current={i === currentIndex ? "true" : "false"}
                    on:click={() => goTo(i)}
                    on:focus={(e) =>
                        (e.currentTarget as HTMLButtonElement).blur()}
                >
                    <span
                        class="bullet-inner block h-full w-full rounded-full"
                        style={`background-color: ${i === currentIndex ? "#006cff" : "#ffffff"}; transform: scale(${i === currentIndex ? 1 : 0.4});`}
                    ></span>
                </button>
            {/each}
        </div>
    {/if}
</div>

<style>
    /* Ensure images don't shrink weirdly in flex */
    .slide img {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    /* Shimmer placeholder */
    .shimmer {
        background: linear-gradient(90deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.18) 50%, rgba(255,255,255,0.08) 100%);
        background-size: 200% 100%;
        animation: shimmer 1.2s infinite;
    }
    @keyframes shimmer {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
    }
    /* Bullet inner dot with strong, scalable shadow and smooth transitions */
    .bullet-inner {
        box-shadow:
            0 8px 36px rgba(10, 18, 31, 0.85),
            0 0 0 2px rgba(10, 18, 31, 0.45);
        transition:
            background-color 1s ease-in-out,
            transform 1s ease-in-out;
        will-change: background-color, transform;
    }
    /* Remove tap highlights on mobile */
    .no-tap-highlight {
        -webkit-tap-highlight-color: transparent;
    }
    /* Allow vertical page scroll but handle horizontal swipes */
    .carousel {
        touch-action: pan-y;
        user-select: none;
    }
    /* Hard-disable focus ring/outline for bullet buttons across browsers */
    .bullet-btn {
        outline: none !important;
        box-shadow: none !important;
        -webkit-appearance: none;
        appearance: none;
    }
    .bullet-btn:focus,
    .bullet-btn:focus-visible,
    .bullet-btn:active {
        outline: none !important;
        box-shadow: none !important;
    }
    .bullet-btn::-moz-focus-inner {
        border: 0;
    }
</style>
