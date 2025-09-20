<script lang="ts">
    import { setLocale } from "$lib/paraglide/runtime";
    import { m } from "$lib/paraglide/messages.js";
    import Button from "$lib/components/Button.svelte";
    import Card from "$lib/components/Card.svelte";
    import favicon from "$lib/assets/icons/favicon.svg";
    import enFlag from "$lib/assets/icons/en.svg";
    import etFlag from "$lib/assets/icons/et.svg";

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
<nav class="fixed top-0 left-0 right-0 bg-secondary/95 backdrop-blur-sm z-50">
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
                    <Button variant="tertiary" href="#about">About</Button>
                    <Button variant="tertiary" href="#projects">Projects</Button
                    >
                    <Button variant="tertiary" href="#events">Events</Button>
                    <Button variant="tertiary" href="#collaborations"
                        >Collaborations</Button
                    >
                    <Button variant="tertiary" href="#gallery">Gallery</Button>
                </div>
                <Button variant="primary" href="#contact">Contact</Button>
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
                <div class="flex flex-col items-center space-y-6">
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
                    <div class="flex items-center space-x-4 mt-8">
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
        class="min-h-screen bg-secondary flex items-center justify-center"
    >
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 class="h1 text-white mb-6">Welcome to My Portfolio</h1>
            <p class="lead text-white/80 mb-8 max-w-2xl mx-auto">
                I'm a passionate developer creating amazing digital experiences.
            </p>
            <div
                class="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
                <Button
                    variant="primary"
                    on:click={() => console.log("Get Started clicked")}
                >
                    Get Started
                </Button>
                <Button
                    variant="secondary"
                    on:click={() => console.log("Learn More clicked")}
                >
                    Learn More
                </Button>
            </div>
            <div class="mt-4">
                <Button variant="secondary" disabled={true}>
                    Disabled Secondary
                </Button>
            </div>
        </div>
    </section>

    <!-- About Section -->
    <section id="about" class="py-20 bg-tertiary/10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 class="h2 text-center text-white mb-12">About Me</h2>
            <div class="max-w-3xl mx-auto text-center">
                <p class="p text-white/80 mb-6">
                    This is where your about content will go. Tell your story,
                    share your passion, and let visitors know who you are.
                </p>
                <p class="p text-white/80">
                    Add more details about your background, skills, and what
                    drives you in your work.
                </p>
            </div>
        </div>
    </section>

    <!-- Projects Section -->
    <section id="projects" class="py-20 bg-secondary">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 class="h2 text-center text-white mb-12">Projects</h2>
            <div class="flex flex-col items-center gap-8">
                <!-- Project cards will go here -->
                <Card
                    imageSrc="https://via.placeholder.com/274x128/4A90E2/FFFFFF?text=Project+1"
                    imageAlt="Project 1 preview"
                    title="E-Commerce Platform"
                    description="A modern e-commerce platform built with React and Node.js, featuring real-time inventory management, secure payment processing, and responsive design. Includes admin dashboard, customer analytics, and mobile app integration."
                    href="#"
                />
                <Card
                    imageSrc="https://via.placeholder.com/274x128/7ED321/FFFFFF?text=Project+2"
                    imageAlt="Project 2 preview"
                    title="Task Management App"
                    description="Collaborative task management application with real-time updates, team collaboration features, and advanced project tracking. Built with modern web technologies and cloud infrastructure."
                    href="#"
                />
                <Card
                    imageSrc="https://via.placeholder.com/274x128/F5A623/FFFFFF?text=Project+3"
                    imageAlt="Project 3 preview"
                    title="Data Visualization Dashboard"
                    description="Interactive data visualization dashboard for business analytics, featuring custom charts, real-time data feeds, and export capabilities. Optimized for performance and user experience."
                    href="#"
                />
            </div>
        </div>
    </section>

    <!-- Events Section -->
    <section id="events" class="py-20 bg-tertiary/10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 class="h2 text-center text-white mb-12">Events</h2>
            <div class="max-w-4xl mx-auto">
                <p class="p text-center text-white/80 mb-8">
                    Share your speaking engagements, workshops, conferences, and
                    other professional events.
                </p>
                <!-- Event cards will go here -->
                <div class="space-y-6">
                    <div
                        class="bg-secondary/50 p-6 rounded-lg border border-tertiary/20"
                    >
                        <h3 class="h4 text-white mb-2">Event Title</h3>
                        <p class="small text-white/60 mb-2">Date & Location</p>
                        <p class="p text-white/80">
                            Event description will go here.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Collaborations Section -->
    <section id="collaborations" class="py-20 bg-secondary">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 class="h2 text-center text-white mb-12">Collaborations</h2>
            <div class="max-w-4xl mx-auto">
                <p class="p text-center text-white/80 mb-8">
                    Showcase your partnerships, team projects, and collaborative
                    work.
                </p>
                <!-- Collaboration cards will go here -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div
                        class="bg-tertiary/10 p-6 rounded-lg border border-tertiary/20"
                    >
                        <h3 class="h4 text-white mb-4">Collaboration Title</h3>
                        <p class="p text-white/80 mb-4">
                            Description of the collaboration.
                        </p>
                        <p class="small text-white/60">Partner/Organization</p>
                    </div>
                    <div
                        class="bg-tertiary/10 p-6 rounded-lg border border-tertiary/20"
                    >
                        <h3 class="h4 text-white mb-4">Collaboration Title</h3>
                        <p class="p text-white/80 mb-4">
                            Description of the collaboration.
                        </p>
                        <p class="small text-white/60">Partner/Organization</p>
                    </div>
                </div>
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
