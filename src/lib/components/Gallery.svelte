<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { m } from "$lib/paraglide/messages.js";
    import { browser } from "$app/environment";
    import type { GalleryMetaByDate } from "$lib/data/gallery";
    import { galleryMetaByDate as enMeta } from "$lib/data/gallery.en";
    import { galleryMetaByDate as etMeta } from "$lib/data/gallery.et";

    const modules = import.meta.glob(
        "../assets/images/gallery/*.{jpg,jpeg,png,webp,gif}",
        { eager: true, import: "default" },
    ) as Record<string, string>;

    type Img = {
        src: string;
        file: string;
        title: string;
        description: string;
        date: string;
        alt: string;
    };

    function formatDateFromFilename(file: string): string {
        const base = file.replace(/\.[^.]+$/, "");
        const m = base.match(/^(\d{4})(\d{2})(\d{2})/);
        if (!m) return "";
        const [, y, mo, d] = m;
        const l = detectLocale();
        return l === "et" ? `${d}.${mo}.${y}` : `${mo}/${d}/${y}`;
    }

    let currentMetaByDate: GalleryMetaByDate = enMeta;

    function detectLocale(): "en" | "et" {
        if (browser) {
            const lang = (
                document.documentElement.getAttribute("lang") || ""
            ).toLowerCase();
            if (lang.startsWith("et")) return "et";
        }
        return "en";
    }

    $: currentMetaByDate = detectLocale() === "et" ? etMeta : enMeta;

    function formatQuoted(title: string): string {
        const l = detectLocale();
        return l === "et" ? `„${title}“` : `“${title}”`;
    }

    $: images = Object.entries(modules)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([path, src]) => {
            const file = path.split("/").pop() || "";
            const base = file.replace(/\.[^.]+$/, "");
            const mfn = base.match(/^(\d{4})(\d{2})(\d{2})(?:_(\d+))?$/);
            const dateKey = mfn ? `${mfn[1]}${mfn[2]}${mfn[3]}` : "";
            const variant = mfn && mfn[4] ? parseInt(mfn[4], 10) : 1;
            const date = formatDateFromFilename(file);
            const meta = currentMetaByDate[dateKey]?.[variant];
            const originalTitle = meta?.title ?? "(unnamed)";
            let rawTitle = originalTitle;
            let description = meta?.description ?? "";
            if (!description && rawTitle.includes("|")) {
                const [left, right] = rawTitle.split("|");
                rawTitle = (left || "").trim() || "(unnamed)";
                description = (right || "").trim();
            }
            const title = rawTitle;
            const alt = meta?.description
                ? `${meta?.title ?? "(unnamed)"} | ${meta.description}`
                : originalTitle;
            return { src, file, title, description, date, alt };
        });

    // Lightbox state
    let open = false;
    let index = 0;
    // Loading states
    let imgLoaded: boolean[] = [];
    let fullLoaded = false;

    function openAt(i: number) {
        index = i;
        open = true;
        fullLoaded = false;
        lockScroll();
    }
    function close() {
        open = false;
        unlockScroll();
    }
    function next() {
        if (index < images.length - 1) index += 1;
    }
    function prev() {
        if (index > 0) index -= 1;
    }

    function onBackdrop(e: MouseEvent) {
        // close only if background clicked (not image area)
        if (e.target === e.currentTarget) close();
    }

    // Keyboard navigation
    function handleKey(e: KeyboardEvent) {
        if (!open) return;
        if (e.key === "Escape") close();
        else if (e.key === "ArrowRight") next();
        else if (e.key === "ArrowLeft") prev();
    }

    function lockScroll() {
        if (browser) document.body.style.overflow = "hidden";
    }
    function unlockScroll() {
        if (browser) document.body.style.overflow = "";
    }

    onMount(() => {
        if (browser) window.addEventListener("keydown", handleKey);
    });
    onDestroy(() => {
        if (browser) window.removeEventListener("keydown", handleKey);
        unlockScroll();
    });

    // Initialize per-thumbnail loaded flags ONLY when images length changes
    $: if (images && imgLoaded.length !== images.length) {
        imgLoaded = images.map(() => false);
    }

    function markThumbLoaded(i: number) {
        // Ensure Svelte notices the change by reassigning the array
        imgLoaded[i] = true;
        imgLoaded = [...imgLoaded];
    }

    // Action: if image is already loaded from cache, mark it as loaded immediately
    function thumbReady(node: HTMLImageElement, i: number) {
        let idx = i;
        const done = () => markThumbLoaded(idx);
        if (node.complete) done();
        node.addEventListener("load", done);
        node.addEventListener("error", done);
        const t = setTimeout(done, 3000); // fail-safe
        return {
            update(newI: number) {
                idx = newI;
                if (node.complete) done();
            },
            destroy() {
                node.removeEventListener("load", done);
                node.removeEventListener("error", done);
                clearTimeout(t);
            },
        };
    }

    function fullReady(node: HTMLImageElement) {
        if (node.complete) fullLoaded = true;
        return {};
    }

    // Reset full image loader ONLY when index actually changes while open
    let lastIndex = -1;
    $: if (open && index !== lastIndex) {
        fullLoaded = false;
        lastIndex = index;
    }
</script>

<!-- Grid -->
<div class="w-full">
    <h2 class="h2 text-center text-white mb-8">{m.memories_heading()}</h2>
    <div
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
    >
        {#each images as img, i (img.src)}
            <button
                class="group relative aspect-[4/3] overflow-hidden rounded-lg bg-tertiary/10 hover:bg-tertiary/20 transition"
                on:click={() => openAt(i)}
                aria-label={`Open image ${i + 1}`}
                aria-busy={!imgLoaded[i]}
            >
                <!-- Shimmer placeholder -->
                {#if !imgLoaded[i]}
                    <div
                        class="absolute inset-0 shimmer rounded-lg pointer-events-none z-0"
                        aria-hidden="true"
                    ></div>
                {/if}
                <img
                    src={img.src}
                    alt={img.alt}
                    loading="lazy"
                    decoding="async"
                    fetchpriority="low"
                    class="relative z-10 h-full w-full object-cover transition-opacity duration-300 ease-out"
                    class:opacity-0={!imgLoaded[i]}
                    class:opacity-100={imgLoaded[i]}
                    use:thumbReady={i}
                    on:load={() => markThumbLoaded(i)}
                    on:error={() => markThumbLoaded(i)}
                />
                <div
                    class="absolute inset-0 ring-1 ring-white/10 rounded-lg"
                ></div>
            </button>
        {/each}
    </div>
</div>

<!-- Lightbox -->
{#if open}
    <div
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop"
        role="dialog"
        aria-modal="true"
        aria-label={images[index]?.title}
        tabindex="0"
        on:keydown={(e) => {
            if (e.key === "Escape") close();
            if (e.key === "Enter") close();
        }}
        on:click={onBackdrop}
    >
        <!-- Close button -->
        <button
            class="absolute top-4 right-4 z-20 text-white/90 hover:text-white bg-black/30 hover:bg-black/40 rounded-full p-2"
            aria-label="Close"
            on:click={close}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="w-6 h-6"
                ><path
                    fill-rule="evenodd"
                    d="M6.225 4.811a1 1 0 0 1 1.414 0L12 9.172l4.361-4.361a1 1 0 1 1 1.414 1.414L13.414 10.586l4.361 4.361a1 1 0 0 1-1.414 1.414L12 12l-4.361 4.361a1 1 0 0 1-1.414-1.414l4.361-4.361-4.361-4.361a1 1 0 0 1 0-1.414Z"
                    clip-rule="evenodd"
                /></svg
            >
        </button>

        <!-- Image container with caption anchored to bottom -->
        <div
            class="max-w-[95vw] w-full h-[85vh] flex flex-col justify-between items-center"
        >
            <div
                class="flex-1 flex items-center justify-center min-h-0 relative w-full z-0"
                aria-busy={!fullLoaded}
            >
                <img
                    src={images[index].src}
                    alt={images[index].alt}
                    loading="eager"
                    decoding="async"
                    fetchpriority="high"
                    class="block max-w-full max-h-full object-contain rounded-lg transition-opacity duration-300 ease-out"
                    class:opacity-0={!fullLoaded}
                    class:opacity-100={fullLoaded}
                    use:fullReady
                    on:load={() => (fullLoaded = true)}
                    on:error={() => (fullLoaded = true)}
                />
                <!-- Prev/Next inside image container so they center to the image area -->
                <button
                    class="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 text-white/90 hover:text-white bg-black/30 hover:bg-black/40 rounded-full p-2 disabled:opacity-40"
                    aria-label="Previous image"
                    on:click|stopPropagation={prev}
                    disabled={index === 0}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        class="w-7 h-7"
                        ><path
                            fill-rule="evenodd"
                            d="M15.78 4.72a.75.75 0 0 1 0 1.06L9.56 12l6.22 6.22a.75.75 0 0 1-1.06 1.06l-6.75-6.75a.75.75 0 0 1 0-1.06l6.75-6.75a.75.75 0 0 1 1.06 0Z"
                            clip-rule="evenodd"
                        /></svg
                    >
                </button>
                <button
                    class="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 text-white/90 hover:text-white bg-black/30 hover:bg-black/40 rounded-full p-2 disabled:opacity-40"
                    aria-label="Next image"
                    on:click|stopPropagation={next}
                    disabled={index === images.length - 1}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        class="w-7 h-7"
                        ><path
                            fill-rule="evenodd"
                            d="M8.22 19.28a.75.75 0 0 1 0-1.06L14.44 12 8.22 5.78a.75.75 0 0 1 1.06-1.06l6.75 6.75a.75.75 0 0 1 0 1.06l-6.75 6.75a.75.75 0 0 1-1.06 0Z"
                            clip-rule="evenodd"
                        /></svg
                    >
                </button>
            </div>
            <div class="mt-4 text-center px-3 max-w-[95vw] z-10">
                <div class="quote break-words italic">
                    {formatQuoted(images[index].title)}
                </div>
                {#if images[index].description}
                    <h4 class="h4 break-words mt-1">
                        {images[index].description}
                    </h4>
                {/if}
                {#if images[index].date}
                    <p class="quote mt-1">{images[index].date}</p>
                {/if}
            </div>
        </div>
    </div>
{/if}

<style>
    .backdrop {
        background-color: rgba(10, 18, 31, 0.75);
        backdrop-filter: blur(10px);
    }
    .shimmer {
        background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.08) 0%,
            rgba(255, 255, 255, 0.18) 50%,
            rgba(255, 255, 255, 0.08) 100%
        );
        background-size: 200% 100%;
        animation: shimmer 1.2s infinite;
    }
    @keyframes shimmer {
        0% {
            background-position: 200% 0;
        }
        100% {
            background-position: -200% 0;
        }
    }
</style>
