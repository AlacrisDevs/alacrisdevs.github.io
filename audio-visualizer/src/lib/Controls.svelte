<script lang="ts">
  import * as m from "$lib/paraglide/messages.js";
  import { getLocale, setLocale, locales } from "$lib/paraglide/runtime.js";

  interface Props {
    selectedPreset?: string;
    logoUrl?: string;
    title?: string;
    subtitle?: string;
    bgImage?: string;
    bgColor?: string;
    vignette?: boolean;
    audioSource?: string;
    customPrimary?: string;
    customSecondary?: string;
    useCustomColors?: boolean;
    isListening?: boolean;
    colorPresets?: Record<
      string,
      { name: string; primary: string; secondary: string }
    >;
    onToggle?: () => void;
    fileCurrentTime?: number;
    fileDuration?: number;
    filePlaying?: boolean;
    fileName?: string;
    vizMode?: string;
    barCount?: number;
    sensitivity?: number;
    smoothing?: number;
    bassEmphasis?: number;
    particlesEnabled?: boolean;
    particleDensity?: number;
    shakeAmount?: number;
    zoomIntensity?: number;
    glowIntensity?: number;
    logoSpin?: boolean;
    logoSpinSpeed?: number;
    particleImage?: string;
    particleSize?: number;
    particleRotation?: number;
    titlePosition?: string;
    savedThemes?: any[];
    onscreenshot?: () => void;
    onfullscreen?: () => void;
    onreset?: () => void;
    onaudiofile?: (file: File) => void;
    onfilepause?: () => void;
    onfileresume?: () => void;
    onfileseek?: (time: number) => void;
    onthemeschanged?: (themes: any[]) => void;
  }

  let {
    selectedPreset = $bindable("cyanPink"),
    logoUrl = $bindable(""),
    title = $bindable("Audio Visualizer"),
    subtitle = $bindable(""),
    bgImage = $bindable(""),
    bgColor = $bindable("#0a0a0a"),
    vignette = $bindable(true),
    audioSource = $bindable("mic"),
    customPrimary = $bindable("#00d4ff"),
    customSecondary = $bindable("#ff006e"),
    useCustomColors = $bindable(false),
    isListening = false,
    colorPresets = {},
    onToggle = () => {},
    fileCurrentTime = 0,
    fileDuration = 0,
    filePlaying = false,
    fileName = "",
    vizMode = $bindable("circular"),
    barCount = $bindable(48),
    sensitivity = $bindable(1.0),
    smoothing = $bindable(0.82),
    bassEmphasis = $bindable(0.25),
    particlesEnabled = $bindable(true),
    particleDensity = $bindable(1.0),
    shakeAmount = $bindable(1.0),
    zoomIntensity = $bindable(1.0),
    glowIntensity = $bindable(0.6),
    logoSpin = $bindable(false),
    logoSpinSpeed = $bindable(5),
    particleImage = $bindable(""),
    particleSize = $bindable(1.0),
    particleRotation = $bindable(0),
    titlePosition = $bindable("top"),
    savedThemes = $bindable<any[]>([]),
    onscreenshot = () => {},
    onfullscreen = () => {},
    onreset = () => {},
    onaudiofile = (_file: File) => {},
    onfilepause = () => {},
    onfileresume = () => {},
    onfileseek = (_time: number) => {},
    onthemeschanged = (_themes: any[]) => {},
  }: Props = $props();

  let fileInput: HTMLInputElement | null = $state(null);
  let bgFileInput: HTMLInputElement | null = $state(null);
  let audioFileInput: HTMLInputElement | null = $state(null);
  let particleImgInput: HTMLInputElement | null = $state(null);
  let themeFileInput: HTMLInputElement | null = $state(null);
  let dragOver = $state(false);
  let newThemeName = $state("");

  // Browser detection
  const isFirefox =
    typeof navigator !== "undefined" && /Firefox/.test(navigator.userAgent);
  const supportsTabAudio = !isFirefox;

  const vizModeKeys = ["circular", "bars", "wave", "blob"];
  function vizModeName(key: string) {
    switch (key) {
      case "circular":
        return m.circular();
      case "bars":
        return m.bars();
      case "wave":
        return m.wave();
      case "blob":
        return m.blob();
      default:
        return key;
    }
  }

  function readFileAsDataUrl(file: File, callback: (result: string) => void) {
    const reader = new FileReader();
    reader.onload = (e) => callback(e.target!.result as string);
    reader.readAsDataURL(file);
  }

  function formatTime(seconds: number) {
    if (!seconds || !isFinite(seconds)) return "0:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec.toString().padStart(2, "0")}`;
  }

  function handleFileUpload(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) readFileAsDataUrl(file, (url) => (logoUrl = url));
  }
  function handleParticleImgUpload(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) readFileAsDataUrl(file, (url) => (particleImage = url));
  }
  function handleBgUpload(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) readFileAsDataUrl(file, (url) => (bgImage = url));
  }
  function handleAudioFile(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file && file.type.startsWith("audio/")) {
      audioSource = "file";
      onaudiofile(file);
    }
  }
  function handleDrop(e: DragEvent) {
    e.preventDefault();
    dragOver = false;
    const file = e.dataTransfer?.files[0];
    if (file && file.type.startsWith("audio/")) {
      audioSource = "file";
      onaudiofile(file);
    }
  }
  function handleDragOver(e: DragEvent) {
    e.preventDefault();
    dragOver = true;
  }

  function clearLogo() {
    logoUrl = "";
    if (fileInput) fileInput.value = "";
  }
  function clearBg() {
    bgImage = "";
    if (bgFileInput) bgFileInput.value = "";
  }

  function selectPreset(key: string) {
    selectedPreset = key;
    useCustomColors = false;
  }
  function activateCustom() {
    useCustomColors = true;
  }

  function handleSeek(e: Event) {
    onfileseek(parseFloat((e.target as HTMLInputElement).value));
  }
  function toggleFilePlayback() {
    if (filePlaying) onfilepause();
    else onfileresume();
  }

  function saveTheme() {
    if (!newThemeName.trim()) return;
    const theme = {
      name: newThemeName.trim(),
      id: Date.now(),
      selectedPreset,
      logoUrl,
      title,
      subtitle,
      bgImage,
      bgColor,
      customPrimary,
      customSecondary,
      useCustomColors,
      vignette,
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
    savedThemes = [...savedThemes, theme];
    newThemeName = "";
    onthemeschanged(savedThemes);
  }

  function loadTheme(theme: any) {
    selectedPreset = theme.selectedPreset ?? selectedPreset;
    logoUrl = theme.logoUrl ?? logoUrl;
    title = theme.title ?? title;
    subtitle = theme.subtitle ?? subtitle;
    bgImage = theme.bgImage ?? bgImage;
    bgColor = theme.bgColor ?? bgColor;
    customPrimary = theme.customPrimary ?? customPrimary;
    customSecondary = theme.customSecondary ?? customSecondary;
    useCustomColors = theme.useCustomColors ?? useCustomColors;
    vignette = theme.vignette ?? vignette;
    vizMode = theme.vizMode ?? vizMode;
    barCount = theme.barCount ?? barCount;
    sensitivity = theme.sensitivity ?? sensitivity;
    smoothing = theme.smoothing ?? smoothing;
    bassEmphasis = theme.bassEmphasis ?? bassEmphasis;
    particlesEnabled = theme.particlesEnabled ?? particlesEnabled;
    particleDensity = theme.particleDensity ?? particleDensity;
    shakeAmount = theme.shakeAmount ?? shakeAmount;
    zoomIntensity = theme.zoomIntensity ?? zoomIntensity;
    glowIntensity = theme.glowIntensity ?? glowIntensity;
    logoSpin = theme.logoSpin ?? logoSpin;
    logoSpinSpeed = theme.logoSpinSpeed ?? logoSpinSpeed;
    particleImage = theme.particleImage ?? particleImage;
    particleSize = theme.particleSize ?? particleSize;
    particleRotation = theme.particleRotation ?? particleRotation;
    titlePosition = theme.titlePosition ?? titlePosition;
  }

  function deleteTheme(id: number) {
    savedThemes = savedThemes.filter((t) => t.id !== id);
    onthemeschanged(savedThemes);
  }

  function exportTheme(theme: any) {
    const data = JSON.stringify(theme, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = `${theme.name.replace(/[^a-zA-Z0-9_-]/g, "_")}.vslzr`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  }

  function handleThemeImport(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const theme = JSON.parse(ev.target!.result as string);
        if (!theme.name) theme.name = file.name.replace(/\.vslzr$/, "");
        theme.id = Date.now();
        savedThemes = [...savedThemes, theme];
        onthemeschanged(savedThemes);
      } catch {
        alert("Invalid theme file.");
      }
    };
    reader.readAsText(file);
    (e.target as HTMLInputElement).value = "";
  }
</script>

<div class="flex flex-col gap-5">
  <!-- ═══════════ LANGUAGE SWITCHER ═══════════ -->
  <div class="flex justify-end gap-1">
    {#each locales as locale}
      <button
        class="px-2 py-1 rounded text-[11px] font-medium uppercase transition-all {getLocale() ===
        locale
          ? 'bg-white/15 text-white border border-white/20'
          : 'bg-white/5 text-zinc-500 border border-transparent hover:bg-white/10 hover:text-zinc-300'}"
        onclick={() => setLocale(locale)}>{locale}</button
      >
    {/each}
  </div>

  <!-- ═══════════ AUDIO SOURCE ═══════════ -->
  <section>
    <h3
      class="text-[11px] font-medium uppercase tracking-wider text-zinc-500 mb-3"
    >
      {m.audio_source()}
    </h3>

    <button
      class="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all
        {isListening
        ? 'bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30'
        : 'bg-white/10 border border-white/20 text-white hover:bg-white/15'}"
      onclick={onToggle}
    >
      {#if isListening}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="currentColor"
          ><rect x="6" y="6" width="12" height="12" rx="2" /></svg
        >
        {m.stop()}
      {:else}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          ><path
            d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"
          /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line
            x1="12"
            y1="19"
            x2="12"
            y2="23"
          /><line x1="8" y1="23" x2="16" y2="23" /></svg
        >
        {m.start()}
      {/if}
    </button>

    <div class="flex mt-3 rounded-lg overflow-hidden border border-white/15">
      <button
        class="flex-1 py-2 text-xs transition-all {audioSource === 'mic'
          ? 'bg-white/15 text-white'
          : 'bg-white/5 text-zinc-500 hover:bg-white/10'}"
        onclick={() => (audioSource = "mic")}>{m.mic()}</button
      >
      {#if supportsTabAudio}
        <button
          class="flex-1 py-2 text-xs border-l border-white/15 transition-all {audioSource ===
          'tab'
            ? 'bg-white/15 text-white'
            : 'bg-white/5 text-zinc-500 hover:bg-white/10'}"
          onclick={() => (audioSource = "tab")}>{m.tab()}</button
        >
      {/if}
      <button
        class="flex-1 py-2 text-xs border-l border-white/15 transition-all {audioSource ===
        'file'
          ? 'bg-white/15 text-white'
          : 'bg-white/5 text-zinc-500 hover:bg-white/10'}"
        onclick={() => audioFileInput?.click()}>{m.file()}</button
      >
    </div>

    <input
      type="file"
      accept="audio/*"
      onchange={handleAudioFile}
      bind:this={audioFileInput}
      class="hidden"
    />

    {#if audioSource === "tab"}
      <p class="mt-2 text-[11px] leading-relaxed text-zinc-500">
        {m.tab_hint()}
        <strong class="text-zinc-400">"{m.tab_hint_bold()}"</strong>.
      </p>
    {/if}

    {#if audioSource === "file"}
      <div
        role="region"
        aria-label="Drop audio file"
        class="mt-3 py-3 border border-dashed rounded-lg text-center text-[11px] transition-all
          {dragOver
          ? 'border-cyan-400 text-cyan-400 bg-cyan-400/5'
          : 'border-white/15 text-zinc-600'}"
        ondrop={handleDrop}
        ondragover={handleDragOver}
        ondragleave={() => (dragOver = false)}
      >
        {m.drop_audio()}
      </div>

      {#if fileName}
        <div class="mt-3 p-3 bg-white/[0.04] border border-white/10 rounded-lg">
          <div
            class="flex items-center gap-2 text-zinc-400 text-xs mb-2 overflow-hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              ><path d="M9 18V5l12-2v13" /><circle
                cx="6"
                cy="18"
                r="3"
              /><circle cx="18" cy="16" r="3" /></svg
            >
            <span class="truncate">{fileName}</span>
          </div>
          <div class="flex items-center gap-2">
            <button
              class="flex items-center justify-center w-7 h-7 shrink-0 rounded-full bg-white/10 border border-white/20 text-white transition-all hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed"
              onclick={toggleFilePlayback}
              disabled={!isListening}
            >
              {#if filePlaying}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  ><rect x="6" y="4" width="4" height="16" /><rect
                    x="14"
                    y="4"
                    width="4"
                    height="16"
                  /></svg
                >
              {:else}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  ><polygon points="5 3 19 12 5 21 5 3" /></svg
                >
              {/if}
            </button>
            <span
              class="text-[10px] font-mono text-zinc-600 shrink-0 min-w-[32px] text-center"
              >{formatTime(fileCurrentTime)}</span
            >
            <input
              type="range"
              class="seek-slider flex-1 min-w-0"
              min="0"
              max={fileDuration || 0}
              step="0.1"
              value={fileCurrentTime}
              oninput={handleSeek}
              disabled={!isListening}
            />
            <span
              class="text-[10px] font-mono text-zinc-600 shrink-0 min-w-[32px] text-center"
              >{formatTime(fileDuration)}</span
            >
          </div>
          {#if !isListening}
            <p class="mt-2 text-[11px] text-zinc-500">{m.file_loaded()}</p>
          {/if}
        </div>
      {/if}
    {/if}
  </section>

  <!-- ═══════════ VISUALIZATION ═══════════ -->
  <section>
    <h3
      class="text-[11px] font-medium uppercase tracking-wider text-zinc-500 mb-3"
    >
      {m.visualization()}
    </h3>
    <div class="flex rounded-lg overflow-hidden border border-white/15">
      {#each vizModeKeys as key, i}
        <button
          class="flex-1 py-2 text-xs transition-all {i > 0
            ? 'border-l border-white/15'
            : ''} {vizMode === key
            ? 'bg-white/15 text-white'
            : 'bg-white/5 text-zinc-500 hover:bg-white/10'}"
          onclick={() => (vizMode = key)}>{vizModeName(key)}</button
        >
      {/each}
    </div>
    <div class="mt-3">
      <div class="flex justify-between text-[11px] text-zinc-500 mb-1">
        <span>{m.bars_count()}</span><span class="font-mono text-zinc-400"
          >{barCount}</span
        >
      </div>
      <input
        type="range"
        class="slider w-full"
        min="16"
        max="96"
        step="2"
        bind:value={barCount}
      />
    </div>
  </section>

  <!-- ═══════════ COLORS ═══════════ -->
  <section>
    <h3
      class="text-[11px] font-medium uppercase tracking-wider text-zinc-500 mb-3"
    >
      {m.colors()}
    </h3>
    <div class="flex flex-wrap gap-1.5">
      {#each Object.entries(colorPresets) as [key, preset]}
        <button
          class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] transition-all {selectedPreset ===
            key && !useCustomColors
            ? 'border border-[var(--pc)] text-white shadow-[0_0_10px_var(--pc)]'
            : 'bg-white/5 border border-white/10 text-zinc-500 hover:bg-white/10 hover:text-white'}"
          style="--pc: {preset.primary}"
          onclick={() => selectPreset(key)}
        >
          <span
            class="w-3 h-3 rounded-full shrink-0"
            style="background: linear-gradient(135deg, {preset.primary}, {preset.secondary ||
              preset.primary})"
          ></span>
          {preset.name}
        </button>
      {/each}
    </div>
    <div class="flex flex-col gap-2 mt-3">
      <div class="flex items-center gap-2">
        <span class="text-[11px] text-zinc-500 w-12">{m.primary()}</span>
        <input
          type="color"
          bind:value={customPrimary}
          oninput={activateCustom}
          class="w-7 h-6 border-none rounded cursor-pointer bg-transparent"
        />
        <input
          type="text"
          bind:value={customPrimary}
          oninput={activateCustom}
          placeholder="#00d4ff"
          class="w-20 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-[11px] font-mono focus:outline-none focus:border-white/40"
        />
      </div>
      <div class="flex items-center gap-2">
        <span class="text-[11px] text-zinc-500 w-12">{m.secondary()}</span>
        <input
          type="color"
          bind:value={customSecondary}
          oninput={activateCustom}
          class="w-7 h-6 border-none rounded cursor-pointer bg-transparent"
        />
        <input
          type="text"
          bind:value={customSecondary}
          oninput={activateCustom}
          placeholder="#ff006e"
          class="w-20 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-[11px] font-mono focus:outline-none focus:border-white/40"
        />
      </div>
    </div>
  </section>

  <!-- ═══════════ EFFECTS ═══════════ -->
  <section>
    <h3
      class="text-[11px] font-medium uppercase tracking-wider text-zinc-500 mb-3"
    >
      {m.effects()}
    </h3>
    <div class="flex flex-col gap-2.5">
      <div>
        <div class="flex justify-between text-[11px] text-zinc-500 mb-1">
          <span>{m.shake()}</span><span class="font-mono text-zinc-400"
            >{shakeAmount.toFixed(1)}</span
          >
        </div>
        <input
          type="range"
          class="slider w-full"
          min="0.0"
          max="3.0"
          step="0.1"
          bind:value={shakeAmount}
        />
      </div>
      <div>
        <div class="flex justify-between text-[11px] text-zinc-500 mb-1">
          <span>{m.zoom()}</span><span class="font-mono text-zinc-400"
            >{zoomIntensity.toFixed(1)}</span
          >
        </div>
        <input
          type="range"
          class="slider w-full"
          min="0.0"
          max="3.0"
          step="0.1"
          bind:value={zoomIntensity}
        />
      </div>
      <div>
        <div class="flex justify-between text-[11px] text-zinc-500 mb-1">
          <span>{m.glow()}</span><span class="font-mono text-zinc-400"
            >{glowIntensity.toFixed(1)}</span
          >
        </div>
        <input
          type="range"
          class="slider w-full"
          min="0.0"
          max="2.0"
          step="0.1"
          bind:value={glowIntensity}
        />
      </div>
    </div>
  </section>

  <!-- ═══════════ REACTIVITY ═══════════ -->
  <section>
    <h3
      class="text-[11px] font-medium uppercase tracking-wider text-zinc-500 mb-3"
    >
      {m.reactivity()}
    </h3>
    <div class="flex flex-col gap-2.5">
      <div>
        <div class="flex justify-between text-[11px] text-zinc-500 mb-1">
          <span>{m.sensitivity()}</span><span class="font-mono text-zinc-400"
            >{sensitivity.toFixed(1)}</span
          >
        </div>
        <input
          type="range"
          class="slider w-full"
          min="0.2"
          max="3.0"
          step="0.1"
          bind:value={sensitivity}
        />
      </div>
      <div>
        <div class="flex justify-between text-[11px] text-zinc-500 mb-1">
          <span>{m.smoothing()}</span><span class="font-mono text-zinc-400"
            >{smoothing.toFixed(2)}</span
          >
        </div>
        <input
          type="range"
          class="slider w-full"
          min="0.0"
          max="0.99"
          step="0.01"
          bind:value={smoothing}
        />
      </div>
      <div>
        <div class="flex justify-between text-[11px] text-zinc-500 mb-1">
          <span>{m.bass_emphasis()}</span><span class="font-mono text-zinc-400"
            >{bassEmphasis.toFixed(2)}</span
          >
        </div>
        <input
          type="range"
          class="slider w-full"
          min="0.0"
          max="2.0"
          step="0.05"
          bind:value={bassEmphasis}
        />
      </div>
    </div>
  </section>

  <!-- ═══════════ PARTICLES ═══════════ -->
  <section>
    <h3
      class="text-[11px] font-medium uppercase tracking-wider text-zinc-500 mb-3"
    >
      {m.particles()}
    </h3>
    <label class="flex items-center gap-2 text-zinc-400 text-xs cursor-pointer">
      <input
        type="checkbox"
        bind:checked={particlesEnabled}
        class="accent-cyan-400"
      />
      {m.enable_particles()}
    </label>
    {#if particlesEnabled}
      <div class="flex flex-col gap-2.5 mt-3">
        <div>
          <div class="flex justify-between text-[11px] text-zinc-500 mb-1">
            <span>{m.density()}</span><span class="font-mono text-zinc-400"
              >{particleDensity.toFixed(1)}</span
            >
          </div>
          <input
            type="range"
            class="slider w-full"
            min="0.1"
            max="3.0"
            step="0.1"
            bind:value={particleDensity}
          />
        </div>
        <div>
          <div class="flex justify-between text-[11px] text-zinc-500 mb-1">
            <span>{m.size()}</span><span class="font-mono text-zinc-400"
              >{particleSize.toFixed(1)}</span
            >
          </div>
          <input
            type="range"
            class="slider w-full"
            min="0.3"
            max="5.0"
            step="0.1"
            bind:value={particleSize}
          />
        </div>
        <div>
          <div class="flex justify-between text-[11px] text-zinc-500 mb-1">
            <span>{m.rotation()}</span><span class="font-mono text-zinc-400"
              >{particleRotation.toFixed(1)}</span
            >
          </div>
          <input
            type="range"
            class="slider w-full"
            min="0"
            max="10"
            step="0.5"
            bind:value={particleRotation}
          />
        </div>
        <div class="flex items-center gap-2">
          <input
            type="file"
            accept="image/*"
            onchange={handleParticleImgUpload}
            bind:this={particleImgInput}
            class="hidden"
            id="particle-img-upload"
          />
          <label
            for="particle-img-upload"
            class="px-3 py-1.5 bg-white/10 border border-white/20 rounded-lg text-white text-xs cursor-pointer hover:bg-white/15 transition-all"
            >{m.image()}</label
          >
          {#if particleImage}
            <img
              src={particleImage}
              alt="particle"
              class="w-6 h-6 object-cover rounded"
            />
            <button
              class="px-2 py-1 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-[11px] hover:bg-red-500/20 transition-all"
              onclick={() => (particleImage = "")}>{m.clear()}</button
            >
          {/if}
        </div>
      </div>
    {/if}
  </section>

  <!-- ═══════════ BRANDING ═══════════ -->
  <section>
    <h3
      class="text-[11px] font-medium uppercase tracking-wider text-zinc-500 mb-3"
    >
      {m.branding()}
    </h3>
    <div class="flex flex-col gap-2">
      <input
        type="text"
        bind:value={title}
        placeholder={m.title_placeholder()}
        class="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-xs placeholder-zinc-600 focus:outline-none focus:border-white/40"
      />
      <input
        type="text"
        bind:value={subtitle}
        placeholder={m.subtitle_placeholder()}
        class="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-xs placeholder-zinc-600 focus:outline-none focus:border-white/40"
      />
    </div>
    <div class="mt-3">
      <div class="text-[11px] text-zinc-500 mb-2">{m.position()}</div>
      <div class="inline-flex flex-col gap-0.5">
        {#each [["top-left", "top", "top-right"], ["left", "center", "right"], ["bottom-left", "bottom", "bottom-right"]] as row}
          <div class="flex gap-0.5">
            {#each row as pos}
              <button
                class="w-[52px] h-7 rounded text-[10px] transition-all {titlePosition ===
                pos
                  ? 'bg-cyan-500/15 border border-cyan-500/40 text-cyan-400'
                  : 'bg-white/[0.06] border border-white/[0.12] text-zinc-500 hover:bg-white/10 hover:text-zinc-300'}"
                onclick={() => (titlePosition = pos)}
                >{pos === "center"
                  ? "\u25C9"
                  : pos === "top"
                    ? "\u2191"
                    : pos === "bottom"
                      ? "\u2193"
                      : pos === "left"
                        ? "\u2190"
                        : pos === "right"
                          ? "\u2192"
                          : pos === "top-left"
                            ? "\u2196"
                            : pos === "top-right"
                              ? "\u2197"
                              : pos === "bottom-left"
                                ? "\u2199"
                                : "\u2198"}</button
              >
            {/each}
          </div>
        {/each}
      </div>
    </div>
    <div class="flex items-center gap-2 mt-3">
      <input
        type="file"
        accept="image/*"
        onchange={handleFileUpload}
        bind:this={fileInput}
        class="hidden"
        id="logo-upload"
      />
      <label
        for="logo-upload"
        class="px-3 py-1.5 bg-white/10 border border-white/20 rounded-lg text-white text-xs cursor-pointer hover:bg-white/15 transition-all"
        >{m.logo()}</label
      >
      {#if logoUrl}
        <button
          class="px-2 py-1 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-[11px] hover:bg-red-500/20 transition-all"
          onclick={clearLogo}>{m.clear()}</button
        >
      {/if}
    </div>
    {#if logoUrl}
      <label
        class="flex items-center gap-2 mt-2 text-zinc-400 text-xs cursor-pointer"
      >
        <input
          type="checkbox"
          bind:checked={logoSpin}
          class="accent-cyan-400"
        />
        {m.spin_logo()}
      </label>
      {#if logoSpin}
        <div class="mt-2">
          <div class="flex justify-between text-[11px] text-zinc-500 mb-1">
            <span>{m.speed()}</span><span class="font-mono text-zinc-400"
              >{logoSpinSpeed.toFixed(1)}</span
            >
          </div>
          <input
            type="range"
            class="slider w-full"
            min="0.5"
            max="20"
            step="0.5"
            bind:value={logoSpinSpeed}
          />
        </div>
      {/if}
    {/if}
  </section>

  <!-- ═══════════ BACKGROUND ═══════════ -->
  <section>
    <h3
      class="text-[11px] font-medium uppercase tracking-wider text-zinc-500 mb-3"
    >
      {m.background()}
    </h3>
    <div class="flex items-center gap-2">
      <input
        type="file"
        accept="image/*"
        onchange={handleBgUpload}
        bind:this={bgFileInput}
        class="hidden"
        id="bg-upload"
      />
      <label
        for="bg-upload"
        class="px-3 py-1.5 bg-white/10 border border-white/20 rounded-lg text-white text-xs cursor-pointer hover:bg-white/15 transition-all"
        >{m.image()}</label
      >
      {#if bgImage}
        <button
          class="px-2 py-1 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-[11px] hover:bg-red-500/20 transition-all"
          onclick={clearBg}>{m.clear()}</button
        >
      {/if}
      <input
        type="color"
        bind:value={bgColor}
        title="Background Color"
        class="w-8 h-7 border-none rounded cursor-pointer bg-transparent ml-auto"
      />
    </div>
    <label
      class="flex items-center gap-2 mt-2 text-zinc-400 text-xs cursor-pointer"
    >
      <input type="checkbox" bind:checked={vignette} class="accent-cyan-400" />
      {m.vignette()}
    </label>
  </section>

  <!-- ═══════════ THEMES ═══════════ -->
  <section>
    <h3
      class="text-[11px] font-medium uppercase tracking-wider text-zinc-500 mb-3"
    >
      {m.themes()}
    </h3>
    <div class="flex gap-2">
      <input
        type="text"
        bind:value={newThemeName}
        placeholder={m.theme_name_placeholder()}
        class="flex-1 min-w-0 px-3 py-1.5 bg-white/10 border border-white/20 rounded-lg text-white text-xs placeholder-zinc-600 focus:outline-none focus:border-white/40"
      />
      <button
        class="px-3 py-1.5 bg-cyan-500/20 border border-cyan-500/40 rounded-lg text-cyan-400 text-xs hover:bg-cyan-500/30 transition-all disabled:opacity-30"
        onclick={saveTheme}
        disabled={!newThemeName.trim()}>{m.save()}</button
      >
    </div>
    <div class="flex gap-2 mt-2">
      <input
        type="file"
        accept=".vslzr"
        onchange={handleThemeImport}
        bind:this={themeFileInput}
        class="hidden"
      />
      <button
        class="flex-1 px-3 py-1.5 bg-white/[0.06] border border-white/15 rounded-lg text-zinc-400 text-xs hover:bg-white/10 hover:text-white transition-all"
        onclick={() => themeFileInput?.click()}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          class="inline -mt-0.5 mr-1"
          ><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline
            points="17 8 12 3 7 8"
          /><line x1="12" y1="3" x2="12" y2="15" /></svg
        >{m.import_theme()} (.vslzr)
      </button>
    </div>
    {#if savedThemes.length > 0}
      <div class="flex flex-col gap-1.5 mt-3">
        {#each savedThemes as theme (theme.id)}
          <div class="flex items-center gap-2 group">
            <button
              class="flex-1 text-left px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-zinc-400 text-xs hover:bg-white/10 hover:text-white transition-all truncate"
              onclick={() => loadTheme(theme)}>{theme.name}</button
            >
            <button
              class="px-2 py-1.5 text-zinc-500 hover:text-cyan-400 text-xs transition-all opacity-0 group-hover:opacity-100"
              onclick={() => exportTheme(theme)}
              title={m.export_theme()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                ><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline
                  points="7 10 12 15 17 10"
                /><line x1="12" y1="15" x2="12" y2="3" /></svg
              >
            </button>
            <button
              class="px-2 py-1.5 text-red-400/60 hover:text-red-400 text-xs transition-all opacity-0 group-hover:opacity-100"
              onclick={() => deleteTheme(theme.id)}>✕</button
            >
          </div>
        {/each}
      </div>
    {/if}
  </section>

  <!-- ═══════════ ACTIONS ═══════════ -->
  <section>
    <h3
      class="text-[11px] font-medium uppercase tracking-wider text-zinc-500 mb-3"
    >
      {m.actions()}
    </h3>
    <div class="flex flex-wrap gap-2">
      <button
        class="flex items-center gap-1.5 px-3 py-2 bg-white/[0.08] border border-white/15 rounded-lg text-zinc-400 text-xs hover:bg-white/15 hover:text-white transition-all"
        onclick={onscreenshot}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          ><path
            d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"
          /><circle cx="12" cy="13" r="4" /></svg
        >
        {m.screenshot()}
      </button>
      <button
        class="flex items-center gap-1.5 px-3 py-2 bg-white/[0.08] border border-white/15 rounded-lg text-zinc-400 text-xs hover:bg-white/15 hover:text-white transition-all"
        onclick={onfullscreen}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          ><path
            d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"
          /></svg
        >
        {m.fullscreen()}
      </button>
      <button
        class="flex items-center gap-1.5 px-3 py-2 bg-red-500/[0.08] border border-red-500/30 rounded-lg text-red-400 text-xs hover:bg-red-500/15 transition-all"
        onclick={onreset}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          ><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path
            d="M3 3v5h5"
          /></svg
        >
        {m.reset()}
      </button>
    </div>
  </section>

  <div
    class="pt-3 border-t border-white/[0.08] text-center text-[10px] text-zinc-600 leading-relaxed"
  >
    <kbd
      class="px-1.5 py-0.5 bg-white/[0.08] border border-white/10 rounded text-zinc-500 font-mono text-[10px]"
      >Space</kbd
    >
    {m.play_stop()}
    <kbd
      class="ml-2 px-1.5 py-0.5 bg-white/[0.08] border border-white/10 rounded text-zinc-500 font-mono text-[10px]"
      >F</kbd
    >
    {m.fullscreen()}
    <kbd
      class="ml-2 px-1.5 py-0.5 bg-white/[0.08] border border-white/10 rounded text-zinc-500 font-mono text-[10px]"
      >H</kbd
    >
    {m.hide()}
  </div>
</div>

<style>
  .slider {
    height: 4px;
    -webkit-appearance: none;
    appearance: none;
    background: rgba(255, 255, 255, 0.15);
    border-radius: 2px;
    outline: none;
    cursor: pointer;
  }
  .slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #22d3ee;
    cursor: pointer;
    border: none;
  }
  .slider::-moz-range-thumb {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #22d3ee;
    cursor: pointer;
    border: none;
  }
  .seek-slider {
    height: 4px;
    -webkit-appearance: none;
    appearance: none;
    background: rgba(255, 255, 255, 0.15);
    border-radius: 2px;
    outline: none;
    cursor: pointer;
  }
  .seek-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #22d3ee;
    cursor: pointer;
    border: none;
  }
  .seek-slider::-moz-range-thumb {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #22d3ee;
    cursor: pointer;
    border: none;
  }
  .seek-slider:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
</style>
