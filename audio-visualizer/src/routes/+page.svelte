<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { browser } from "$app/environment";
    import AudioVisualizer from "$lib/AudioVisualizer.svelte";
    import Controls from "$lib/Controls.svelte";

    const STORAGE_KEY = "ncs-visualizer-settings";
    const THEMES_KEY = "ncs-visualizer-themes";

    const defaults = {
        selectedPreset: "cyanPink",
        logoUrl: "",
        title: "Audio Visualizer",
        subtitle: "Now Playing",
        bgImage: "",
        bgColor: "#0a0a0a",
        customPrimary: "#00d4ff",
        customSecondary: "#ff006e",
        useCustomColors: false,
        sidebarOpen: true,
        vignette: true,
        audioSource: "mic",
        vizMode: "circular",
        barCount: 48,
        sensitivity: 1.0,
        smoothing: 0.82,
        bassEmphasis: 0.25,
        particlesEnabled: true,
        particleDensity: 1.0,
        shakeAmount: 1.0,
        zoomIntensity: 1.0,
        glowIntensity: 0.6,
        logoSpin: false,
        logoSpinSpeed: 5,
        particleImage: "",
        particleSize: 1.0,
        particleRotation: 0,
        titlePosition: "top",
    };

    function loadSettings() {
        if (!browser) return { ...defaults };
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? { ...defaults, ...JSON.parse(raw) } : { ...defaults };
        } catch {
            return { ...defaults };
        }
    }

    function loadThemes() {
        if (!browser) return [];
        try {
            const raw = localStorage.getItem(THEMES_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch {
            return [];
        }
    }

    const saved = loadSettings();

    let selectedPreset = $state(saved.selectedPreset);
    let logoUrl = $state(saved.logoUrl);
    let title = $state(saved.title);
    let subtitle = $state(saved.subtitle);
    let bgImage = $state(saved.bgImage);
    let bgColor = $state(saved.bgColor);
    let customPrimary = $state(saved.customPrimary);
    let customSecondary = $state(saved.customSecondary);
    let useCustomColors = $state(saved.useCustomColors);
    let isListening = $state(false);
    let sidebarOpen = $state(saved.sidebarOpen);
    let vignette = $state(saved.vignette);
    let audioSource = $state(saved.audioSource);
    let vizMode = $state(saved.vizMode);
    let barCount = $state(saved.barCount);
    let sensitivity = $state(saved.sensitivity);
    let smoothing = $state(saved.smoothing);
    let bassEmphasis = $state(saved.bassEmphasis);
    let particlesEnabled = $state(saved.particlesEnabled);
    let particleDensity = $state(saved.particleDensity);
    let shakeAmount = $state(saved.shakeAmount);
    let zoomIntensity = $state(saved.zoomIntensity);
    let glowIntensity = $state(saved.glowIntensity);
    let logoSpin = $state(saved.logoSpin);
    let logoSpinSpeed = $state(saved.logoSpinSpeed);
    let particleImage = $state(saved.particleImage);
    let particleSize = $state(saved.particleSize);
    let particleRotation = $state(saved.particleRotation);
    let titlePosition = $state(saved.titlePosition);
    let savedThemes = $state(loadThemes());
    let visualizerComponent: any = $state(null);
    let toggleHidden = $state(false);
    let hideTimer: ReturnType<typeof setTimeout>;

    let fileCurrentTime = $state(0);
    let fileDuration = $state(0);
    let filePlaying = $state(false);
    let fileName = $state("");

    function startHideTimer() {
        clearTimeout(hideTimer);
        if (!sidebarOpen) {
            hideTimer = setTimeout(() => {
                toggleHidden = true;
            }, 2000);
        }
    }

    function handleToggleClick() {
        sidebarOpen = !sidebarOpen;
        toggleHidden = false;
        clearTimeout(hideTimer);
        if (!sidebarOpen) startHideTimer();
    }

    $effect(() => {
        if (!sidebarOpen) {
            startHideTimer();
        } else {
            toggleHidden = false;
            clearTimeout(hideTimer);
        }
    });

    // Persist settings
    $effect(() => {
        if (!browser) return;
        const settings = {
            selectedPreset,
            logoUrl,
            title,
            subtitle,
            bgImage,
            bgColor,
            customPrimary,
            customSecondary,
            useCustomColors,
            sidebarOpen,
            vignette,
            audioSource,
            vizMode,
            barCount,
            sensitivity,
            smoothing,
            bassEmphasis,
            particlesEnabled,
            particleDensity,
            shakeAmount,
            zoomIntensity,
            glowIntensity,
            logoSpin,
            logoSpinSpeed,
            particleImage,
            particleSize,
            particleRotation,
            titlePosition,
        };
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
        } catch {}
    });

    function handleThemesChanged(themes: any[]) {
        savedThemes = themes;
        if (browser) {
            try {
                localStorage.setItem(THEMES_KEY, JSON.stringify(savedThemes));
            } catch {}
        }
    }

    function toggleListening() {
        if (isListening) {
            visualizerComponent?.stopListening();
        } else {
            visualizerComponent?.startListening();
        }
    }

    function handleScreenshot() {
        const dataUrl = visualizerComponent?.takeScreenshot();
        if (!dataUrl) return;
        const link = document.createElement("a");
        link.download = "visualizer-screenshot.png";
        link.href = dataUrl;
        link.click();
    }

    function handleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {});
        } else {
            document.exitFullscreen().catch(() => {});
        }
    }

    function handleReset() {
        selectedPreset = defaults.selectedPreset;
        logoUrl = defaults.logoUrl;
        title = defaults.title;
        subtitle = defaults.subtitle;
        bgImage = defaults.bgImage;
        bgColor = defaults.bgColor;
        customPrimary = defaults.customPrimary;
        customSecondary = defaults.customSecondary;
        useCustomColors = defaults.useCustomColors;
        vignette = defaults.vignette;
        audioSource = defaults.audioSource;
        vizMode = defaults.vizMode;
        barCount = defaults.barCount;
        sensitivity = defaults.sensitivity;
        smoothing = defaults.smoothing;
        bassEmphasis = defaults.bassEmphasis;
        particlesEnabled = defaults.particlesEnabled;
        particleDensity = defaults.particleDensity;
        shakeAmount = defaults.shakeAmount;
        zoomIntensity = defaults.zoomIntensity;
        glowIntensity = defaults.glowIntensity;
        logoSpin = defaults.logoSpin;
        logoSpinSpeed = defaults.logoSpinSpeed;
        particleImage = defaults.particleImage;
        particleSize = defaults.particleSize;
        particleRotation = defaults.particleRotation;
        titlePosition = defaults.titlePosition;
    }

    function handleAudioFile(file: File) {
        if (file && visualizerComponent) {
            if (isListening) visualizerComponent.stopListening();
            audioSource = "file";
            visualizerComponent.setAudioFile(file);
        }
    }

    function handleFilePause() {
        if (visualizerComponent) visualizerComponent.pauseAudio();
    }
    function handleFileResume() {
        if (visualizerComponent) visualizerComponent.resumeAudio();
    }
    function handleFileSeek(time: number) {
        if (visualizerComponent) visualizerComponent.seekAudio(time);
    }

    function handleKeydown(e: KeyboardEvent) {
        const target = e.target as HTMLElement;
        if (
            target.tagName === "INPUT" ||
            target.tagName === "TEXTAREA" ||
            target.isContentEditable
        )
            return;
        switch (e.code) {
            case "Space":
                e.preventDefault();
                toggleListening();
                break;
            case "KeyF":
                e.preventDefault();
                handleFullscreen();
                break;
            case "KeyH":
                e.preventDefault();
                handleToggleClick();
                break;
        }
    }

    onMount(() => {
        window.addEventListener("keydown", handleKeydown);
    });
    onDestroy(() => {
        window.removeEventListener("keydown", handleKeydown);
    });

    const colorPresets = {
        cyanPink: {
            name: "Cyan/Pink",
            primary: "#00d4ff",
            secondary: "#ff006e",
        },
        purpleOrange: {
            name: "Purple/Orange",
            primary: "#8b5cf6",
            secondary: "#f97316",
        },
        greenYellow: {
            name: "Green/Yellow",
            primary: "#22c55e",
            secondary: "#eab308",
        },
        pinkBlue: {
            name: "Pink/Blue",
            primary: "#ec4899",
            secondary: "#3b82f6",
        },
        redOrange: {
            name: "Red/Orange",
            primary: "#ef4444",
            secondary: "#f97316",
        },
        white: { name: "White", primary: "#ffffff", secondary: "#888888" },
    };

    let currentColors = $derived(
        useCustomColors
            ? { primary: customPrimary, secondary: customSecondary }
            : colorPresets[selectedPreset as keyof typeof colorPresets],
    );
</script>

<svelte:head>
    <title>{title}</title>
</svelte:head>

<main
    class="relative flex w-screen h-screen overflow-hidden select-none"
    style="background: {bgColor}"
>
    {#if bgImage}
        <div
            class="absolute inset-0 bg-cover bg-center z-0"
            style="background-image: url({bgImage})"
        ></div>
    {/if}
    {#if vignette}
        <div
            class="absolute inset-0 z-0"
            style="background: radial-gradient(ellipse at center, rgba(0,0,0,0.5) 0%, rgba(0,0,0,1) 100%)"
        ></div>
    {/if}

    <div class="absolute inset-0 flex items-center justify-center z-[1]">
        <AudioVisualizer
            bind:this={visualizerComponent}
            colors={currentColors}
            {logoUrl}
            {audioSource}
            {vizMode}
            {barCount}
            {sensitivity}
            {smoothing}
            {bassEmphasis}
            {particlesEnabled}
            {particleDensity}
            {shakeAmount}
            {zoomIntensity}
            {glowIntensity}
            {logoSpin}
            {logoSpinSpeed}
            {particleImage}
            {particleSize}
            {particleRotation}
            bind:isListening
            bind:fileCurrentTime
            bind:fileDuration
            bind:filePlaying
            bind:fileName
        />
    </div>

    <!-- Title overlay -->
    <div class="title-overlay title-{titlePosition}">
        <h1
            class="text-[clamp(1.4rem,3.5vw,3rem)] font-light tracking-[0.2em] uppercase m-0"
            style="color: {currentColors.primary}"
        >
            {title}
        </h1>
        <h2
            class="text-[clamp(1rem,2vw,1.8rem)] font-light tracking-[0.15em] mt-1 opacity-70 m-0"
            style="color: {currentColors.secondary}"
        >
            {subtitle}
        </h2>
    </div>

    <!-- Sidebar toggle -->
    <div
        role="region"
        aria-label="Sidebar toggle"
        class="fixed top-0 right-0 w-[50px] h-screen z-30 transition-opacity duration-500 {toggleHidden
            ? 'opacity-0 hover:opacity-100'
            : 'opacity-100'}"
        onmouseenter={() => {
            toggleHidden = false;
        }}
    >
        <button
            class="absolute top-1/2 -translate-y-1/2 bg-white/[0.08] border border-white/15 border-r-0 rounded-l-lg text-white py-3 px-1.5 cursor-pointer transition-all duration-300 hover:bg-white/15
        {sidebarOpen ? 'right-[320px]' : 'right-0'}"
            onclick={handleToggleClick}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
            >
                {#if sidebarOpen}
                    <path d="M15 18l-6-6 6-6" />
                {:else}
                    <path d="M9 18l6-6-6-6" />
                {/if}
            </svg>
        </button>
    </div>

    <!-- Sidebar -->
    <aside
        class="fixed top-0 w-[320px] h-screen bg-[rgba(10,10,15,0.92)] backdrop-blur-xl border-l border-white/10 z-20 overflow-y-auto transition-all duration-300 p-5 box-border
      {sidebarOpen ? 'right-0' : '-right-[320px]'}"
    >
        <Controls
            bind:selectedPreset
            bind:logoUrl
            bind:title
            bind:subtitle
            bind:bgImage
            bind:bgColor
            bind:vignette
            bind:audioSource
            bind:customPrimary
            bind:customSecondary
            bind:useCustomColors
            bind:vizMode
            bind:barCount
            bind:sensitivity
            bind:smoothing
            bind:bassEmphasis
            bind:particlesEnabled
            bind:particleDensity
            bind:shakeAmount
            bind:zoomIntensity
            bind:glowIntensity
            bind:logoSpin
            bind:logoSpinSpeed
            bind:particleImage
            bind:particleSize
            bind:particleRotation
            bind:titlePosition
            bind:savedThemes
            {isListening}
            {colorPresets}
            onToggle={toggleListening}
            onscreenshot={handleScreenshot}
            onfullscreen={handleFullscreen}
            onreset={handleReset}
            onaudiofile={handleAudioFile}
            onfilepause={handleFilePause}
            onfileresume={handleFileResume}
            onfileseek={handleFileSeek}
            onthemeschanged={handleThemesChanged}
            {fileCurrentTime}
            {fileDuration}
            {filePlaying}
            {fileName}
        />
    </aside>
</main>

<style>
    .title-overlay {
        position: absolute;
        z-index: 10;
        pointer-events: none;
        text-align: center;
        padding: 1.5rem 2.5rem;
        background: radial-gradient(
            ellipse at center,
            rgba(0, 0, 0, 0.7) 0%,
            rgba(0, 0, 0, 0.4) 50%,
            transparent 80%
        );
        text-shadow:
            0 2px 8px rgba(0, 0, 0, 1),
            0 0 30px rgba(0, 0, 0, 0.9);
    }
    .title-top {
        top: 0;
        left: 50%;
        transform: translateX(-50%);
    }
    .title-bottom {
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
    }
    .title-center {
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    .title-top-left {
        top: 0;
        left: 0;
        text-align: left;
    }
    .title-top-right {
        top: 0;
        right: 0;
        text-align: right;
    }
    .title-bottom-left {
        bottom: 0;
        left: 0;
        text-align: left;
    }
    .title-bottom-right {
        bottom: 0;
        right: 0;
        text-align: right;
    }
    .title-left {
        top: 50%;
        left: 0;
        transform: translateY(-50%);
        text-align: left;
    }
    .title-right {
        top: 50%;
        right: 0;
        transform: translateY(-50%);
        text-align: right;
    }
</style>
