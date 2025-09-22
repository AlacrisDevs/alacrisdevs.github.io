<script lang="ts">
    import { setLocale } from "$lib/paraglide/runtime";
    import { m } from "$lib/paraglide/messages.js";
    import Button from "$lib/components/Button.svelte";
    import Card from "$lib/components/Card.svelte";
    import Carousel from "$lib/components/Carousel.svelte";
    import favicon from "$lib/assets/icons/favicon.svg";
    import enFlag from "$lib/assets/icons/en.svg";
    import etFlag from "$lib/assets/icons/et.svg";
    import heroImg from "$lib/assets/images/hero.png";
    import headerImg from "$lib/assets/images/header.jpg";

    let mobileMenuOpen = false;

    function toggleMobileMenu() {
        mobileMenuOpen = !mobileMenuOpen;
    }

    function closeMobileMenu() {
        mobileMenuOpen = false;
    }

    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
</script>

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
                <img src={favicon} alt="AlacrisDevs Logo" class="w-10 h-10" />
            </button>

            <!-- Desktop Navigation -->
            <div class="hidden md:flex items-center gap-1">
                <div class="flex items-baseline">
                    <Button variant="tertiary" href="#about">{m.nav_about()}</Button>
                    <Button variant="tertiary" href="#projects">{m.nav_projects()}</Button
                    >
                    <Button variant="tertiary" href="#events">{m.nav_events()}</Button>
                    <Button variant="tertiary" href="#collaborations"
                        >{m.nav_collaborations()}</Button
                    >
                    <Button variant="tertiary" href="#gallery">{m.nav_gallery()}</Button>
                </div>
                <Button variant="primary" href="#contact">{m.nav_contact()}</Button>
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

    <!-- Mobile Menu Overlay -->
    {#if mobileMenuOpen}
        <div
            class="fixed inset-0 bg-secondary/50 z-40 md:hidden"
            on:click={closeMobileMenu}
            on:keydown={(e) => e.key === "Escape" && closeMobileMenu()}
            role="button"
            tabindex="-1"
            aria-label="Close mobile menu"
        ></div>

        <!-- Mobile Menu Content -->
        <div class="fixed inset-0 z-50 md:hidden">
            <div
                class="flex flex-col items-center justify-center h-full bg-secondary/50 backdrop-blur-sm"
            >
                <div class="flex flex-col items-center gap-2">
                    <Button
                        variant="tertiary"
                        href="#about"
                        on:click={closeMobileMenu}>About</Button
                    >
                    <Button
                        variant="tertiary"
                        href="#projects"
                        on:click={closeMobileMenu}>Projects</Button
                    >
                    <Button
                        variant="tertiary"
                        href="#events"
                        on:click={closeMobileMenu}>Events</Button
                    >
                    <Button
                        variant="tertiary"
                        href="#collaborations"
                        on:click={closeMobileMenu}>Collaborations</Button
                    >
                    <Button
                        variant="tertiary"
                        href="#gallery"
                        on:click={closeMobileMenu}>Gallery</Button
                    >
                    <Button
                        variant="primary"
                        href="#contact"
                        on:click={closeMobileMenu}>Contact</Button
                    >

                    <!-- Mobile Language Switcher -->
                    <div class="flex items-center">
                        <button
                            class="p-2 hover:opacity-80 transition-opacity"
                            on:click={() => {
                                setLocale("en");
                                closeMobileMenu();
                            }}
                            aria-label="Switch to English"
                        >
                            <img src={enFlag} alt="English" class="w-8 h-8" />
                        </button>
                        <button
                            class="p-2 hover:opacity-80 transition-opacity"
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
            </div>
        </div>
    {/if}
</nav>

<!-- Main Content -->
<main class="pt-20">
    <!-- Hero Section -->
    <section
        id="hero"
        class="relative flex items-end gap-16 px-[15%] py-0 w-full bg-cover bg-center bg-no-repeat"
        style={`background-image: url('${headerImg}');`}
    >
        <!-- Overlay -->
        <div class="absolute inset-0 bg-[#0A121F]/90"></div>
        <!-- Text section -->
        <div
            class="z-10 flex flex-col justify-center items-center md:items-start gap-4 self-stretch py-16 md:py-24 w-full md:w-1/2"
        >
            <h1 class="h1 text-white text-center md:text-left">{m.hero_title()}</h1>
            <p class="lead text-white/80 text-center md:text-left">{m.hero_lead()}</p>
        </div>

        <!-- Second section with image -->
        <div class="z-10 flex flex-col items-start pt-16 w-1/2 md:block hidden">
            <img
                src={heroImg}
                alt="AlacrisDevs"
                class="block max-w-full h-auto"
            />
        </div>
    </section>

    <!-- About Section -->
    <section
        id="about"
        class="flex flex-col lg:flex-row items-center gap-16 px-[10%] py-0 w-full"
    >
        <!-- Carousel -->
        <div class="w-full lg:w-1/2 order-2 lg:order-none">
            <div class="flex flex-col items-start py-16 w-full">
                <Carousel />
            </div>
        </div>

        <!-- Text section -->
        <div
            class="flex flex-col justify-center items-center lg:items-start gap-4 py-16 self-stretch w-full lg:w-1/2 order-1 lg:order-none"
        >
            <h2 class="h2 text-white text-center lg:text-left">{m.about_title()}</h2>
            <p class="p text-white/80 text-center lg:text-left whitespace-pre-line">{m.about_body()}</p>
        </div>
    </section>

    <!-- Games Section -->
    <section id="projects" class="py-20 bg-secondary">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 class="h2 text-center text-white mb-12">My games and ongoing projects</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card
                    imageSrc="https://via.placeholder.com/274x128/0D5C8E/FFFFFF?text=Packet+Tracers"
                    imageAlt="Packet Tracers"
                    title="Packet Tracers"
                    description="Defend your network from the impending viral invasion!"
                    href="#"
                />
                <Card
                    imageSrc="https://via.placeholder.com/274x128/1A1A1A/FFFFFF?text=Lux+Mundi"
                    imageAlt="Lux Mundi"
                    title="Lux Mundi"
                    description="A visually soothing time‑killer sandbox made in 4 days."
                    href="#"
                />
                <Card
                    imageSrc="https://via.placeholder.com/274x128/BD2A2E/FFFFFF?text=Dichotomia"
                    imageAlt="Dichotomia [GGJ Latvia 2022]"
                    title="Dichotomia [GGJ Latvia 2022]"
                    description="Fight your inner demon, Jekyll. Fight it."
                    href="#"
                />
                <Card
                    imageSrc="https://via.placeholder.com/274x128/F2C94C/111111?text=At+World's+End"
                    imageAlt="At World's End"
                    title="At World's End"
                    description="[Currently in the works – fight against time]"
                    href="#"
                />
            </div>
        </div>
    </section>

    <!-- Events Section -->
    <section id="events" class="py-20 bg-tertiary/10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 class="h2 text-center text-white mb-12">Events I'm organizing</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card
                    imageSrc="https://via.placeholder.com/274x128/6C5CE7/FFFFFF?text=TalTech+GameCamp"
                    imageAlt="TalTech GameCamp"
                    title="TalTech GameCamp"
                    description="Estonia’s biggest educational game development event/competition."
                    href="#"
                />
                <Card
                    imageSrc="https://via.placeholder.com/274x128/0F172A/FFFFFF?text=GameDev+Guild"
                    imageAlt="GameDev Guild"
                    title="GameDev Guild"
                    description="A casual meetup for Estonian gamedevs to showcase projects."
                    href="#"
                />
            </div>
        </div>
    </section>

    <!-- Collaborations Section -->
    <section id="collaborations" class="py-20 bg-secondary">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 class="h2 text-center text-white mb-12">Organizations and brands I've worked with</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card
                    imageSrc="https://via.placeholder.com/274x128/111827/FFFFFF?text=TalTech"
                    imageAlt="TalTech School of IT"
                    title="TalTech School of IT"
                    description="TalTech School of Information Technologies prepares specialists with bachelor’s, master’s and doctoral degrees in one of the fastest developing fields of science and technology, which is Information and Communication Technology."
                    href="#"
                />
                <Card
                    imageSrc="https://via.placeholder.com/274x128/1E293B/FFFFFF?text=GameDev+Estonia"
                    imageAlt="GameDev Estonia"
                    title="GameDev Estonia"
                    description="GameDev Estonia is a non‑profit organization dedicated to fostering and coordinating the growth of the Estonian video game industry."
                    href="#"
                />
                <Card
                    imageSrc="https://via.placeholder.com/274x128/0F172A/FFFFFF?text=VKM"
                    imageAlt="LVLup! Video Game Museum"
                    title="LVLup! Video Game Museum"
                    description="LVLup! Video Game Museum is an interactive video game museum located in Tallinn, Estonia, that focuses on the history and evolution of video games."
                    href="#"
                />
                <Card
                    imageSrc="https://via.placeholder.com/274x128/22C55E/111111?text=EKA"
                    imageAlt="Estonian Academy of Arts"
                    title="Estonian Academy of Arts"
                    description="The Estonian Academy of Arts is the only public university in Estonia providing higher education in art, design, architecture, media, art history and conservation‑restoration."
                    href="#"
                />
            </div>
        </div>
    </section>

    <!-- Gallery Section -->
    <section id="gallery" class="py-20 bg-tertiary/10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 class="h2 text-center text-white mb-12">Gallery</h2>
            <div class="max-w-4xl mx-auto">
                <p class="p text-center text-white/80 mb-8">
                    Visual showcase of your work, behind-the-scenes moments, and
                    creative process.
                </p>
                <!-- Gallery grid will go here -->
                <div
                    class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                >
                    <div
                        class="bg-tertiary/20 aspect-square rounded-lg flex items-center justify-center"
                    >
                        <p class="small text-white/60">Image Placeholder</p>
                    </div>
                    <div
                        class="bg-tertiary/20 aspect-square rounded-lg flex items-center justify-center"
                    >
                        <p class="small text-white/60">Image Placeholder</p>
                    </div>
                    <div
                        class="bg-tertiary/20 aspect-square rounded-lg flex items-center justify-center"
                    >
                        <p class="small text-white/60">Image Placeholder</p>
                    </div>
                    <div
                        class="bg-tertiary/20 aspect-square rounded-lg flex items-center justify-center"
                    >
                        <p class="small text-white/60">Image Placeholder</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="py-20 bg-secondary">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 class="h2 text-center text-white mb-12">Get In Touch</h2>
            <div class="max-w-2xl mx-auto">
                <p class="p text-center text-white/80 mb-8">
                    Ready to work together? Let's start a conversation.
                </p>
                <form class="space-y-6">
                    <div>
                        <label
                            for="name"
                            class="block text-sm font-medium text-white mb-2"
                            >Name</label
                        >
                        <input
                            type="text"
                            id="name"
                            class="w-full px-4 py-3 bg-tertiary/10 border border-tertiary/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Your name"
                        />
                    </div>
                    <div>
                        <label
                            for="email"
                            class="block text-sm font-medium text-white mb-2"
                            >Email</label
                        >
                        <input
                            type="email"
                            id="email"
                            class="w-full px-4 py-3 bg-tertiary/10 border border-tertiary/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="your.email@example.com"
                        />
                    </div>
                    <div>
                        <label
                            for="message"
                            class="block text-sm font-medium text-white mb-2"
                            >Message</label
                        >
                        <textarea
                            id="message"
                            rows="4"
                            class="w-full px-4 py-3 bg-tertiary/10 border border-tertiary/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Your message"
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        class="w-full button bg-primary px-6 py-4 rounded-lg hover:opacity-90 transition-opacity"
                    >
                        Send Message
                    </button>
                </form>
            </div>
        </div>
    </section>
</main>

<!-- Footer -->
<footer class="bg-black py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
            <p class="small text-white/60">
                © 2024 Portfolio. All rights reserved.
            </p>
        </div>
    </div>
</footer>
