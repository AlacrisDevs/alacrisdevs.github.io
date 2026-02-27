<script lang="ts">
    import { onMount } from "svelte";
    import * as m from "$lib/paraglide/messages/_index.js";

    let visible = $state(true);
    let fadeOut = $state(false);
    let progress = $state(0);
    let currentTextIndex = $state(0);

    // Random loading messages
    const loadingMessages = [
        "Preparing your design workspace...",
        "Loading color palettes...",
        "Setting up typography...",
        "Configuring components...",
        "Almost ready...",
        "Initializing design tokens...",
        "Loading presets...",
        "Setting up your environment...",
        "Finalizing setup..."
    ];

    // Rotate through messages
    let textInterval: ReturnType<typeof setInterval>;

    onMount(() => {
        // Animate progress bar
        const progressInterval = setInterval(() => {
            if (progress < 90) {
                progress += Math.random() * 15;
                if (progress > 90) progress = 90;
            }
        }, 200);

        // Rotate loading messages
        textInterval = setInterval(() => {
            currentTextIndex = (currentTextIndex + 1) % loadingMessages.length;
        }, 1500);

        // Start fade out after a longer delay to show the animations
        setTimeout(() => {
            progress = 100; // Complete the progress bar
            clearInterval(progressInterval);
            clearInterval(textInterval);

            fadeOut = true;
            // Remove from DOM after animation
            setTimeout(() => {
                visible = false;
            }, 500);
        }, 4000); // Show for longer to demonstrate the loading bar
    });
</script>

{#if visible}
    <div
        class="fixed inset-0 z-[999999] flex items-center justify-center bg-[#0A121F] transition-opacity duration-500"
        class:opacity-0={fadeOut}
    >
        <div class="flex flex-col items-center gap-4 sm:gap-6 w-full max-w-sm px-4 sm:px-8">
            <!-- Logo/Brand -->
            <div class="text-white text-xl sm:text-2xl font-bold tracking-wider" style="font-family: 'Spline Sans Mono', monospace;">
                FLOWSTATE
            </div>

            <!-- Loading Bar -->
            <div class="w-64 sm:w-80">
                <div class="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                    <div
                        class="h-full bg-gradient-to-r from-white to-[#00A3E0] rounded-full transition-all duration-300 ease-out"
                        style="width: {progress}%"
                    ></div>
                </div>
                <div class="text-center mt-2">
                    <span class="text-white/60 text-xs sm:text-sm font-medium">
                        {Math.round(progress)}%
                    </span>
                </div>
            </div>

            <!-- Changing Text -->
            <div class="text-center min-h-[2.5rem] sm:min-h-[3rem] flex items-center px-2">
                <p class="text-white/70 text-xs sm:text-sm leading-relaxed transition-opacity duration-300 text-center">
                    {loadingMessages[currentTextIndex]}
                </p>
            </div>
        </div>
    </div>
{/if}
