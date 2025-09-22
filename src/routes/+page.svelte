<script lang="ts">
    import { onMount } from "svelte";
    import { setLocale } from "$lib/paraglide/runtime";
    import { base } from "$app/paths";
    import { m } from "$lib/paraglide/messages.js";
    import Button from "$lib/components/Button.svelte";
    import Card from "$lib/components/Card.svelte";
    import Carousel from "$lib/components/Carousel.svelte";
    import Gallery from "$lib/components/Gallery.svelte";
    import enFlag from "$lib/assets/icons/en.svg";
    import etFlag from "$lib/assets/icons/et.svg";
    import heroImg from "$lib/assets/images/hero.png";
    import headerImg from "$lib/assets/images/header.jpg";
    import contactImg from "$lib/assets/images/contact.jpg";

    import packetTracersImg from "$lib/assets/images/projects/packet_tracers.png";
    import luxMundiImg from "$lib/assets/images/projects/lux_mundi.png";
    import dichotomiaImg from "$lib/assets/images/projects/dichotomia.png";
    import atWorldsEndImg from "$lib/assets/images/projects/awe.png";
    import gamecampImg from "$lib/assets/images/events/taltech_gamecamp.jpg";
    import gamedevGuildImg from "$lib/assets/images/events/gamedev_guild.png";
    import taltechItImg from "$lib/assets/images/orgs/taltech_it.jpg";
    import gamedevEstoniaImg from "$lib/assets/images/orgs/gamedev_estonia.jpg";
    import lvlupImg from "$lib/assets/images/orgs/lvlup.png";
    import ekaImg from "$lib/assets/images/orgs/eka.png";

    let mobileMenuOpen = false;
    let headerLoaded = false;
    let heroLoaded = false;

    function toggleMobileMenu() {
        mobileMenuOpen = !mobileMenuOpen;
    }

    function closeMobileMenu() {
        mobileMenuOpen = false;
    }

    function handleContactSubmit(e: Event) {
        const form = e.currentTarget as HTMLFormElement;
        const formData = new FormData(form);
        const name = (formData.get("name") as string) || "";
        const email = (formData.get("email") as string) || "";
        const message = (formData.get("message") as string) || "";

        const subject = encodeURIComponent(
            `Portfolio Contact from ${name || "Website Visitor"}`,
        );
        const body = encodeURIComponent(
            `Name: ${name}\nEmail: ${email}\n\n${message}`,
        );
        window.location.href = `mailto:alacrisdevs@gmail.com?subject=${subject}&body=${body}`;
    }

    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    onMount(() => {
        const img = new Image();
        img.src = headerImg as string;
        const done = () => (headerLoaded = true);
        img.onload = done;
        img.onerror = done;
    });

    $: if (mobileMenuOpen) {
        if (typeof document !== "undefined")
            document.body.style.overflow = "hidden";
    } else {
        if (typeof document !== "undefined") document.body.style.overflow = "";
    }

    function heroReady(node: HTMLImageElement) {
        if (node.complete) heroLoaded = true;
        const onload = () => (heroLoaded = true);
        const onerror = () => (heroLoaded = true);
        node.addEventListener("load", onload);
        node.addEventListener("error", onerror);
        return {
            destroy() {
                node.removeEventListener("load", onload);
                node.removeEventListener("error", onerror);
            },
        };
    }
</script>

<svelte:head>
    <link rel="preload" as="image" href={headerImg} imagesrcset="" />
    <link rel="preload" as="image" href={heroImg} imagesrcset="" />
</svelte:head>

<!-- Navigation -->
<nav class="fixed top-0 left-0 right-0 bg-[#0A121F]/75 backdrop-blur-sm z-50">
    <div class="w-full p-4">
        <div class="flex justify-between items-center h-12">
            <!-- Logo -->
            <button
                class="flex-shrink-0 p-1 rounded hover:opacity-80 transition-opacity"
                on:click={scrollToTop}
                aria-label="Scroll to top"
            >
                <img
                    src={`${base}/favicon/favicon.svg`}
                    alt="AlacrisDevs Logo"
                    class="w-10 h-10"
                />
            </button>

            <!-- Desktop Navigation -->
            <div class="hidden md:flex items-center gap-1">
                <div class="flex items-baseline">
                    <Button variant="tertiary" href="#about"
                        >{m.nav_about()}</Button
                    >
                    <Button variant="tertiary" href="#projects"
                        >{m.nav_projects()}</Button
                    >
                    <Button variant="tertiary" href="#events"
                        >{m.nav_events()}</Button
                    >
                    <Button variant="tertiary" href="#collaborations"
                        >{m.nav_collaborations()}</Button
                    >
                    <Button variant="tertiary" href="#gallery"
                        >{m.nav_gallery()}</Button
                    >
                </div>
                <Button variant="primary" href="#contact"
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

    <!-- Mobile Menu Overlay (moved out of nav) -->
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
                    href="#about"
                    on:click={closeMobileMenu}>{m.nav_about()}</Button
                >
                <Button
                    variant="tertiary"
                    href="#projects"
                    on:click={closeMobileMenu}>{m.nav_projects()}</Button
                >
                <Button
                    variant="tertiary"
                    href="#events"
                    on:click={closeMobileMenu}>{m.nav_events()}</Button
                >
                <Button
                    variant="tertiary"
                    href="#collaborations"
                    on:click={closeMobileMenu}>{m.nav_collaborations()}</Button
                >
                <Button
                    variant="tertiary"
                    href="#gallery"
                    on:click={closeMobileMenu}>{m.nav_gallery()}</Button
                >
                <Button
                    variant="primary"
                    href="#contact"
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

<!-- Main Content -->
<main class="pt-20">
    <!-- Hero Section -->
    <section
        id="hero"
        class="relative z-0 overflow-hidden flex items-end gap-16 px-[15%] py-0 w-full bg-cover bg-center bg-no-repeat"
    >
        <div
            class="absolute inset-0 bg-center bg-cover opacity-0 transition-opacity duration-1000 ease-in-out"
            style={`background-image: url('${headerImg}');`}
            class:opacity-100={headerLoaded}
            aria-hidden="true"
        ></div>
        <div class="absolute inset-0 bg-[#0A121F]/90" aria-hidden="true"></div>
        <!-- Text section -->
        <div
            class="z-10 flex flex-col justify-center items-center md:items-start gap-4 self-stretch py-16 md:py-24 w-full md:w-1/2"
        >
            <h1 class="h1 text-white text-center md:text-left">
                {m.hero_title()}
            </h1>
            <p class="lead text-white/80 text-center md:text-left">
                {m.hero_lead()}
            </p>
        </div>

        <!-- Second section with image -->
        <div class="z-10 flex flex-col items-start pt-16 w-1/2 md:block hidden">
            <div class="w-full aspect-[16/10]">
                <img
                    src={heroImg}
                    alt="AlacrisDevs"
                    width="1600"
                    height="1000"
                    loading="eager"
                    decoding="sync"
                    fetchpriority="high"
                    class="relative z-0 block w-full h-full object-contain transition-all duration-[1000ms] ease-in-out"
                    class:opacity-0={!heroLoaded}
                    class:opacity-100={heroLoaded}
                    class:translate-y-6={!heroLoaded}
                    class:translate-y-0={heroLoaded}
                    use:heroReady
                />
            </div>
        </div>
    </section>

    <!-- About Section -->
    <section
        id="about"
        class="relative z-20 flex flex-col lg:flex-row items-center gap-16 px-[10%] py-0 w-full"
    >
        <!-- Carousel -->
        <div class="w-full lg:w-1/2 order-2 lg:order-none">
            <div class="flex flex-col items-start py-16 w-full">
                <Carousel />
            </div>
        </div>

        <div
            class="hidden lg:flex flex-col justify-center items-center lg:items-start gap-4 py-16 self-stretch w-full lg:w-1/2 order-1 lg:order-none"
        >
            <h2 class="h2 text-white text-center lg:text-left">
                {m.about_title()}
            </h2>
            <p
                class="p text-white/80 text-center lg:text-left whitespace-pre-line"
            >
                {m.about_body()}
            </p>
        </div>
    </section>

    <!-- Games Section -->
    <section id="projects" class="py-20 bg-secondary">
        <div class="w-full px-[6%]">
            <h2 class="h2 text-center text-white mb-12">
                {m.projects_heading()}
            </h2>
            <div
                class="grid grid-cols-2 md:grid-cols-1 xl:grid-cols-2 gap-6 max-w-3xl mx-auto xl:max-w-none"
            >
                <Card
                    imageSrc={packetTracersImg}
                    imageAlt={m.projects_packet_tracers_title()}
                    title={m.projects_packet_tracers_title()}
                    description={m.projects_packet_tracers_desc()}
                    href="https://alacrisdevs.itch.io/packet-tracers"
                    target="_blank"
                />
                <Card
                    imageSrc={luxMundiImg}
                    imageAlt={m.projects_lux_mundi_title()}
                    title={m.projects_lux_mundi_title()}
                    description={m.projects_lux_mundi_desc()}
                    href="https://alacrisdevs.itch.io/lux-mundi"
                    target="_blank"
                />
                <Card
                    imageSrc={dichotomiaImg}
                    imageAlt={m.projects_dichotomia_title()}
                    title={m.projects_dichotomia_title()}
                    description={m.projects_dichotomia_desc()}
                    href="https://alacrisdevs.itch.io/dichotomia"
                    target="_blank"
                />
                <Card
                    imageSrc={atWorldsEndImg}
                    imageAlt={m.projects_awe_title()}
                    title={m.projects_awe_title()}
                    description={m.projects_awe_desc()}
                    href="#"
                />
            </div>
        </div>
    </section>

    <!-- Events Section -->
    <section id="events" class="py-20 bg-tertiary/10">
        <div class="w-full px-[6%]">
            <h2 class="h2 text-center text-white mb-12">
                {m.events_heading()}
            </h2>
            <div
                class="grid grid-cols-2 md:grid-cols-1 xl:grid-cols-2 gap-6 max-w-3xl mx-auto xl:max-w-none"
            >
                <Card
                    imageSrc={gamecampImg}
                    imageAlt={m.events_gamecamp_title()}
                    title={m.events_gamecamp_title()}
                    description={m.events_gamecamp_desc()}
                    href="https://gamecamp.ituk.ee/"
                    target="_blank"
                />
                <Card
                    imageSrc={gamedevGuildImg}
                    imageAlt={m.events_guild_title()}
                    title={m.events_guild_title()}
                    description={m.events_guild_desc()}
                    href="https://www.linkedin.com/company/gamedev-guild"
                    target="_blank"
                />
            </div>
        </div>
    </section>

    <!-- Collaborations Section -->
    <section id="collaborations" class="py-20 bg-secondary">
        <div class="w-full px-[6%]">
            <h2 class="h2 text-center text-white mb-12">
                {m.orgs_heading()}
            </h2>
            <div
                class="grid grid-cols-2 md:grid-cols-1 xl:grid-cols-2 gap-6 max-w-3xl mx-auto xl:max-w-none"
            >
                <Card
                    imageSrc={taltechItImg}
                    imageAlt={m.orgs_taltech_title()}
                    title={m.orgs_taltech_title()}
                    description={m.orgs_taltech_desc()}
                    href="https://taltech.ee/en/school-of-information-technologies"
                    target="_blank"
                />
                <Card
                    imageSrc={gamedevEstoniaImg}
                    imageAlt={m.orgs_gde_title()}
                    title={m.orgs_gde_title()}
                    description={m.orgs_gde_desc()}
                    href="https://gamedevestonia.ee/"
                    target="_blank"
                />
                <Card
                    imageSrc={lvlupImg}
                    imageAlt={m.orgs_lvlup_title()}
                    title={m.orgs_lvlup_title()}
                    description={m.orgs_lvlup_desc()}
                    href="https://www.rara.ee/sundmused/interaktiivne-videomangude-muuseum-lvlup/"
                    target="_blank"
                />
                <Card
                    imageSrc={ekaImg}
                    imageAlt={m.orgs_eka_title()}
                    title={m.orgs_eka_title()}
                    description={m.orgs_eka_desc()}
                    href="https://www.artun.ee/et/avaleht/"
                    target="_blank"
                />
            </div>
        </div>
    </section>

    <!-- Gallery Section -->
    <section id="gallery" class="py-20 bg-tertiary/10">
        <div class="w-full px-[6%]">
            <Gallery />
        </div>
    </section>

    <!-- Contact Section -->
    <section
        id="contact"
        class="relative z-0 overflow-hidden py-20 bg-cover bg-center bg-no-repeat"
    >
        <div
            class="absolute inset-0 bg-center bg-cover"
            style={`background-image: url('${contactImg}');`}
            aria-hidden="true"
        ></div>
        <div class="absolute inset-0 bg-[#0A121F]/50" aria-hidden="true"></div>

        <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 class="h2 text-center text-white mb-4">
                {m.contact_heading()}
            </h2>
            <div class="flex justify-center mb-8">
                <a
                    href="mailto:alacrisdevs@gmail.com"
                    class="flex items-center gap-2 text-white hover:text-primary transition-colors"
                    aria-label="Email alacrisdevs@gmail.com"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        class="w-5 h-5"
                        ><path
                            d="M1.5 6.75A2.25 2.25 0 013.75 4.5h16.5a2.25 2.25 0 012.25 2.25v10.5A2.25 2.25 0 0120.25 19.5H3.75A2.25 2.25 0 011.5 17.25V6.75zm2.852-.75a.75.75 0 00-.602 1.2l6.398 8.254a1.5 1.5 0 002.404 0l6.398-8.254a.75.75 0 00-.602-1.2H4.352z"
                        /></svg
                    >
                    <span class="underline">alacrisdevs@gmail.com</span>
                </a>
            </div>
            <div class="max-w-2xl mx-auto">
                <form
                    class="space-y-6"
                    on:submit|preventDefault={handleContactSubmit}
                >
                    <div>
                        <label
                            for="name"
                            class="block text-sm font-medium text-white mb-2"
                            >{m.form_name_label()}</label
                        >
                        <input
                            type="text"
                            id="name"
                            name="name"
                            class="input-secondary"
                            placeholder={m.form_name_placeholder()}
                        />
                    </div>
                    <div>
                        <label
                            for="email"
                            class="block text-sm font-medium text-white mb-2"
                            >{m.form_email_label()}</label
                        >
                        <input
                            type="email"
                            id="email"
                            name="email"
                            class="input-secondary"
                            placeholder={m.form_email_placeholder()}
                        />
                    </div>
                    <div>
                        <label
                            for="message"
                            class="block text-sm font-medium text-white mb-2"
                            >{m.form_message_label()}</label
                        >
                        <textarea
                            id="message"
                            rows="4"
                            name="message"
                            class="input-secondary"
                            placeholder={m.form_message_placeholder()}
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        class="w-full button bg-primary px-6 py-4 rounded-lg hover:opacity-90 transition-opacity"
                    >
                        {m.form_submit()}
                    </button>
                </form>
            </div>
        </div>
    </section>
</main>

<!-- Footer -->
<footer class="bg-secondary py-10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col items-center gap-4">
            <p class="small text-white/80">© 2021-2025 AlacrisDevs</p>
            <div
                class="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 flex-wrap"
            >
                <a
                    href="https://www.linkedin.com/in/alacrisdevs"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="flex items-center gap-2 text-white hover:text-primary transition-colors"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        class="w-5 h-5"
                        ><path
                            d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM0 8h5v16H0V8zm7.5 0h4.8v2.2h.07c.67-1.2 2.3-2.46 4.73-2.46 5.05 0 5.98 3.33 5.98 7.66V24h-5v-7.6c0-1.81-.03-4.14-2.52-4.14-2.52 0-2.91 1.97-2.91 4v7.74h-5V8z"
                        /></svg
                    >
                    <span class="underline">@alacrisdevs</span>
                </a>
                <a
                    href="https://discord.com/invite/8JcX2NFJnq"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="flex items-center gap-2 text-white hover:text-primary transition-colors"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        class="w-5 h-5"
                        ><path
                            d="M20.317 4.369a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.211.375-.444.864-.608 1.249a18.27 18.27 0 00-5.49 0 12.26 12.26 0 00-.617-1.249.077.077 0 00-.079-.037c-1.67.285-3.3.77-4.885 1.515a.07.07 0 00-.032.027C.533 9.045-.32 13.58.099 18.057a.082.082 0 00.031.055 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.027c.461-.63.873-1.295 1.226-1.994a.076.076 0 00-.041-.106c-.662-.251-1.29-.558-1.879-.91a.077.077 0 01-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 01.077-.01c3.927 1.793 8.18 1.793 12.061 0a.074.074 0 01.078.01c.12.099.246.197.372.291a.077.077 0 01-.007.128 12.3 12.3 0 01-1.88.91.076.076 0 00-.04.106c.36.699.772 1.364 1.226 1.994a.077.077 0 00.084.027 19.9 19.9 0 005.993-3.03.082.082 0 00.031-.055c.5-5.177-.838-9.673-3.548-13.661a.061.061 0 00-.031-.027zM8.02 15.331c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419s2.173 1.086 2.157 2.419c0 1.334-.974 2.419-2.157 2.419zm7.995 0c-1.183 0-2.156-1.085-2.156-2.419 0-1.333.955-2.419 2.156-2.419 1.202 0 2.158 1.086 2.158 2.419 0 1.334-.956 2.419-2.158 2.419z"
                        /></svg
                    >
                    <span class="underline">@alacrisdevs</span>
                </a>
                <a
                    href="https://www.youtube.com/@alacrisdevs"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="flex items-center gap-2 text-white hover:text-primary transition-colors"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        class="w-5 h-5"
                        ><path
                            d="M23.5 6.186a3.001 3.001 0 00-2.116-2.121C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.384.565A3.001 3.001 0 00.5 6.186C0 8.08 0 12 0 12s0 3.92.5 5.814a3 3 0 002.116 2.121C4.5 20.5 12 20.5 12 20.5s7.5 0 9.384-.565a3 3 0 002.116-2.121C24 15.92 24 12 24 12s0-3.92-.5-5.814zM9.75 15.568V8.432L15.568 12 9.75 15.568z"
                        /></svg
                    >
                    <span class="underline">@alacrisdevs</span>
                </a>
            </div>
        </div>
    </div>
</footer>

<style>
    .translate-y-6 {
        transform: translateY(1.5rem);
    }
    .translate-y-0 {
        transform: translateY(0);
    }
</style>
