<script lang="ts">
    import { base } from "$app/paths";
    import { setLocale } from "$lib/paraglide/runtime";
    import { m } from "$lib/paraglide/messages.js";
    import Button from "$lib/components/Button.svelte";
    import Card from "$lib/components/Card.svelte";
    import enFlag from "$lib/assets/icons/en.svg";
    import etFlag from "$lib/assets/icons/et.svg";

    let mobileMenuOpen = false;

    function toggleMobileMenu() {
        mobileMenuOpen = !mobileMenuOpen;
    }

    function closeMobileMenu() {
        mobileMenuOpen = false;
    }

    $: if (mobileMenuOpen) {
        if (typeof document !== "undefined")
            document.body.style.overflow = "hidden";
    } else {
        if (typeof document !== "undefined") document.body.style.overflow = "";
    }

    const tools = [
        {
            title: "Audio Visualizer",
            description:
                "Realtime audio-reactive visual playground with presets and recording controls.",
            imageSrc: `${base}/images/tools/audio-visualizer-card.svg`,
            href: `${base}/tools/audio-visualizer/`,
        },
        {
            title: "FlowState",
            description:
                "Design token sandbox for building consistent color, typography, and UI systems.",
            imageSrc: `${base}/images/tools/flowstate-card.svg`,
            href: `${base}/tools/flowstate/`,
        },
    ];
</script>

<svelte:head>
    <title>Tools | Alacris Devs</title>
    <meta
        name="description"
        content="Interactive tools built by Alacris Devs: Audio Visualizer and FlowState"
    />
</svelte:head>

<nav class="fixed top-0 left-0 right-0 bg-[#0A121F]/75 backdrop-blur-sm z-50">
    <div class="w-full p-4">
        <div class="flex justify-between items-center h-12">
            <!-- Logo -->
            <a
                href={`${base}/`}
                class="flex-shrink-0 p-1 rounded hover:opacity-80 transition-opacity"
                aria-label="Back to homepage"
            >
                <img
                    src={`${base}/favicon/favicon.svg`}
                    alt="AlacrisDevs Logo"
                    class="w-10 h-10"
                />
            </a>

            <!-- Desktop Navigation -->
            <div class="hidden md:flex items-center gap-1">
                <div class="flex items-baseline">
                    <Button variant="tertiary" href={`${base}/#about`}
                        >{m.nav_about()}</Button
                    >
                    <Button variant="tertiary" href={`${base}/#projects`}
                        >{m.nav_projects()}</Button
                    >
                    <Button variant="tertiary" href={`${base}/#events`}
                        >{m.nav_events()}</Button
                    >
                    <Button variant="tertiary" href={`${base}/#collaborations`}
                        >{m.nav_collaborations()}</Button
                    >
                    <Button variant="tertiary" href={`${base}/#gallery`}
                        >{m.nav_gallery()}</Button
                    >
                </div>
                <Button variant="primary" href={`${base}/#contact`}
                    >{m.nav_contact()}</Button
                >
            </div>

            <!-- Desktop Language Switcher -->
            <div class="hidden md:flex items-center gap-1">
                <button
                    class="p-2 rounded hover:opacity-80 transition-opacity"
                    on:click={() => setLocale("en")}
                    aria-label="Switch to English"
                >
                    <img src={enFlag} alt="English" class="w-8 h-8" />
                </button>
                <button
                    class="p-2 rounded hover:opacity-80 transition-opacity"
                    on:click={() => setLocale("et")}
                    aria-label="Switch to Estonian"
                >
                    <img src={etFlag} alt="Estonian" class="w-8 h-8" />
                </button>
            </div>

            <!-- Mobile menu button -->
            <div class="md:hidden">
                <button
                    class="text-white hover:text-primary transition-colors p-2"
                    on:click={toggleMobileMenu}
                    aria-label="Toggle mobile menu"
                >
                    <svg
                        class="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    </svg>
                </button>
            </div>
        </div>
    </div>
</nav>

{#if mobileMenuOpen}
    <!-- Dim/blur backdrop covering entire viewport -->
    <div
        class="fixed inset-0 z-[200] md:hidden bg-[#0A121F]/85 backdrop-blur-md"
        on:click={closeMobileMenu}
        on:keydown={(e) => e.key === "Escape" && closeMobileMenu()}
        role="button"
        tabindex="-1"
        aria-label="Close mobile menu"
    ></div>

    <!-- Centered menu content -->
    <div
        class="fixed inset-0 z-[210] md:hidden flex items-center justify-center"
    >
        <nav aria-label="Mobile" class="w-[85%] max-w-sm">
            <div class="flex flex-col gap-3 items-center">
                <Button
                    variant="tertiary"
                    href={`${base}/#about`}
                    on:click={closeMobileMenu}>{m.nav_about()}</Button
                >
                <Button
                    variant="tertiary"
                    href={`${base}/#projects`}
                    on:click={closeMobileMenu}>{m.nav_projects()}</Button
                >
                <Button
                    variant="tertiary"
                    href={`${base}/#events`}
                    on:click={closeMobileMenu}>{m.nav_events()}</Button
                >
                <Button
                    variant="tertiary"
                    href={`${base}/#collaborations`}
                    on:click={closeMobileMenu}>{m.nav_collaborations()}</Button
                >
                <Button
                    variant="tertiary"
                    href={`${base}/#gallery`}
                    on:click={closeMobileMenu}>{m.nav_gallery()}</Button
                >
                <Button
                    variant="primary"
                    href={`${base}/#contact`}
                    on:click={closeMobileMenu}>{m.nav_contact()}</Button
                >
                <div class="h-px w-full bg-white/15 my-2"></div>
                <div class="flex items-center justify-center gap-4">
                    <button
                        class="p-2 rounded hover:opacity-80 transition-opacity"
                        on:click={() => {
                            setLocale("en");
                            closeMobileMenu();
                        }}
                        aria-label="Switch to English"
                    >
                        <img src={enFlag} alt="English" class="w-8 h-8" />
                    </button>
                    <button
                        class="p-2 rounded hover:opacity-80 transition-opacity"
                        on:click={() => {
                            setLocale("et");
                            closeMobileMenu();
                        }}
                        aria-label="Switch to Estonian"
                    >
                        <img src={etFlag} alt="Estonian" class="w-8 h-8" />
                    </button>
                </div>
            </div>
        </nav>
    </div>
{/if}

<main class="min-h-screen bg-secondary pt-28 pb-16">
    <section class="w-full px-[6%]">
        <div class="max-w-5xl mx-auto mb-10">
            <p class="small text-primary uppercase tracking-[0.16em] mb-3">
                Tools
            </p>
            <h1 class="h1 mb-5">Interactive tools and experiments</h1>
            <p class="lead text-white/80 max-w-3xl">
                These are standalone projects integrated into this portfolio.
                Pick one to open it in a dedicated subpage.
            </p>
        </div>

        <div class="grid grid-cols-1 xl:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {#each tools as tool}
                <Card
                    imageSrc={tool.imageSrc}
                    imageAlt={tool.title}
                    title={tool.title}
                    description={tool.description}
                    href={tool.href}
                />
            {/each}
        </div>
    </section>
</main>
