# Audio Visualizer

A real-time audio visualizer built with SvelteKit, Canvas API, and Web Audio API. Capture audio from your microphone, browser tab, or a local file and watch it come to life with reactive visuals, particles, and customizable themes.

## Features

- **4 Visualization Modes** — Circular, Bars, Wave, and Blob
- **3 Audio Sources** — Microphone, Browser Tab (Chrome/Edge), and Local File
- **Particle System** — Configurable density, size, rotation, and custom particle images
- **Audio Reactivity** — Sensitivity, smoothing, and bass emphasis controls
- **Visual Effects** — Shake, zoom, and glow intensity sliders
- **Color Presets & Custom Colors** — 6 built-in presets or pick your own gradient
- **Branding** — Custom logo with optional spin, title, and subtitle with positioning
- **Background** — Custom image, color picker, and vignette toggle
- **Theme System** — Save, load, import, and export themes as `.vslzr` files
- **Screenshot Export** — Save the current visualization as a PNG
- **Fullscreen Mode** — Immersive fullscreen with keyboard shortcut
- **i18n** — English and Estonian via Paraglide.js
- **Persistent Settings** — All settings saved to localStorage

## Quick Start

```sh
# Clone the repo
git clone https://git.lapikud.ee/sass/audio-visualizer.git
cd audio-visualizer

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Keyboard Shortcuts

| Key | Action |
| --- | --- |
| `Space` | Play / Stop |
| `F` | Toggle Fullscreen |
| `H` | Hide / Show Sidebar |

## Build

```sh
npm run build
npm run preview
```

## Tech Stack

- **SvelteKit** + **Svelte 5** (runes)
- **Tailwind CSS v4**
- **Canvas API** + **Web Audio API**
- **Paraglide.js** for i18n
