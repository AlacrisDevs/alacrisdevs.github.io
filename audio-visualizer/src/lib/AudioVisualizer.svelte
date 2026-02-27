<script lang="ts">
  import { onMount, onDestroy } from "svelte";

  let {
    colors = { primary: "#00d4ff", secondary: "#ff006e" },
    logoUrl = "",
    isListening = $bindable(false),
    audioSource = "mic",
    vizMode = "circular",
    barCount = 48,
    sensitivity = 1.0,
    smoothing = 0.82,
    bassEmphasis = 0.25,
    particlesEnabled = true,
    particleDensity = 1.0,
    shakeAmount = 1.0,
    zoomIntensity = 1.0,
    glowIntensity = 0.6,
    logoSpin = false,
    logoSpinSpeed = 5,
    particleImage = "",
    particleSize = 1.0,
    particleRotation = 0,
    fileCurrentTime = $bindable(0),
    fileDuration = $bindable(0),
    filePlaying = $bindable(false),
    fileName = $bindable(""),
  } = $props();

  const DEFAULT_SIZE = 250;
  const LINE_LIFT = 8;
  const FREQ_RANGE = 0.07;
  const INV_255 = 1 / 255;
  const SMOOTH_FACTOR = 0.45;
  const SCALE_SMOOTH = 0.15;
  const MIN_SCALE = 1.0;
  const MAX_SCALE = 1.35;
  const MAX_PARTICLES = 600;
  const CANVAS_PAD = 2.5;

  interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    decay: number;
    radius: number;
    angle: number;
    spin: number;
  }

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  let animationId: number | undefined;
  let audioContext: AudioContext | null = null;
  let analyser: AnalyserNode | null = null;
  let currentStream: MediaStream | null = null;
  let audioElement: HTMLAudioElement | null = null;
  let audioSourceNode: MediaElementAudioSourceNode | null = null;
  let dataArray = new Uint8Array(128);
  let bufferLength = 128;

  let size = $state(DEFAULT_SIZE);
  let centerX = DEFAULT_SIZE / 2;
  let centerY = DEFAULT_SIZE / 2;
  let baseRadius = $state(DEFAULT_SIZE * 0.25);

  let cosValues = new Float32Array(barCount);
  let sinValues = new Float32Array(barCount);
  let smoothedValues = new Float32Array(Math.ceil(barCount / 2));
  let smoothedScale = MIN_SCALE;
  let smoothedLoudness = 0;
  let visualizerWrapper: HTMLDivElement;
  let blobPhase = 0;

  // Particle image cache
  let pImg: HTMLImageElement | null = $state(null);
  $effect(() => {
    if (particleImage) {
      const img = new Image();
      img.src = particleImage;
      pImg = img;
    } else {
      pImg = null;
    }
  });

  // Particle system
  let particles: Particle[] = [];

  // Recalculate angles when barCount changes
  let prevBarCount = barCount;
  $effect(() => {
    const totalBars = barCount;
    const halfBars = Math.ceil(totalBars / 2);
    cosValues = new Float32Array(totalBars);
    sinValues = new Float32Array(totalBars);
    smoothedValues = new Float32Array(halfBars);
    precalculateAngles();
    prevBarCount = barCount;
  });

  // Update analyser smoothing
  $effect(() => {
    if (analyser) {
      analyser.smoothingTimeConstant = smoothing;
    }
  });

  // Clear particles when viz mode changes
  let prevVizMode = vizMode;
  $effect(() => {
    if (vizMode !== prevVizMode) {
      particles = [];
      prevVizMode = vizMode;
    }
  });

  function spawnParticles(loudness: number) {
    if (!particlesEnabled) return;
    const count = Math.floor(loudness * 8 * particleDensity);
    const maxP = Math.floor(MAX_PARTICLES * particleDensity);

    for (let j = 0; j < count; j++) {
      if (particles.length >= maxP) break;

      let p: Particle;
      switch (vizMode) {
        case "bars": {
          const halfBars = Math.ceil(barCount / 2);
          const cw = canvas ? canvas.width : window.innerWidth;
          const ch = canvas ? canvas.height : window.innerHeight;
          const totalWidth = cw;
          const barGap = 3;
          const barWidth = Math.max(
            2,
            (totalWidth - (halfBars - 1) * barGap) / halfBars,
          );
          const bottomY = ch;
          const idx = Math.floor(Math.random() * halfBars);
          const val = (smoothedValues[idx] || 0) * INV_255;
          const h = Math.max(2, val * ch * 0.7);
          const x = idx * (barWidth + barGap) + barWidth * Math.random();
          p = {
            x,
            y: bottomY - h,
            vx: (Math.random() - 0.5) * 2,
            vy: -(1.5 + Math.random() * 4 * loudness),
            life: 1.0,
            decay: 0.008 + Math.random() * 0.02,
            radius: (2 + Math.random() * 5) * particleSize,
            angle: 0,
            spin: 0,
          };
          break;
        }
        case "wave": {
          const halfBars = Math.ceil(barCount / 2);
          const cw = canvas ? canvas.width : window.innerWidth;
          const ch = canvas ? canvas.height : window.innerHeight;
          const totalWidth = cw;
          const maxAmp = ch * 0.3;
          const midY = ch * 0.5;
          const t = Math.random();
          const idx = Math.floor(t * (halfBars - 1));
          const val = (smoothedValues[idx] || 0) * INV_255;
          const x = t * totalWidth;
          const y = midY - val * maxAmp;
          p = {
            x,
            y,
            vx: (Math.random() - 0.5) * 1.5,
            vy: -(0.8 + Math.random() * 3 * loudness),
            life: 1.0,
            decay: 0.006 + Math.random() * 0.012,
            radius: (2 + Math.random() * 4) * particleSize,
            angle: 0,
            spin: 0,
          };
          break;
        }
        case "blob": {
          const angle = Math.random() * Math.PI * 2;
          const halfBars = Math.ceil(barCount / 2);
          const freqIdx =
            Math.floor(((((angle / (Math.PI * 2)) % 1) + 1) % 1) * halfBars) %
            halfBars;
          const val = (smoothedValues[freqIdx] || 0) * INV_255;
          const maxDeform = size * 0.2;
          const r = baseRadius + val * maxDeform + Math.random() * 10;
          const tangent = angle + Math.PI / 2;
          const speed = 1 + Math.random() * 3 * loudness;
          p = {
            x: centerX + Math.cos(angle) * r,
            y: centerY + Math.sin(angle) * r,
            vx: Math.cos(tangent) * speed + Math.cos(angle) * speed * 0.3,
            vy: Math.sin(tangent) * speed + Math.sin(angle) * speed * 0.3,
            life: 1.0,
            decay: 0.006 + Math.random() * 0.015,
            radius: (2 + Math.random() * 6) * particleSize,
            angle: 0,
            spin: 0,
          };
          break;
        }
        case "circular":
        default: {
          const angle = Math.random() * Math.PI * 2;
          const spawnR = baseRadius * 0.7 + Math.random() * baseRadius * 0.3;
          const speed = 1.5 + Math.random() * 5 * loudness;
          p = {
            x: centerX + Math.cos(angle) * spawnR,
            y: centerY + Math.sin(angle) * spawnR,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 1.0,
            decay: 0.005 + Math.random() * 0.015,
            radius: (3 + Math.random() * 7) * particleSize,
            angle: 0,
            spin: 0,
          };
          break;
        }
      }
      p.angle = Math.random() * Math.PI * 2;
      p.spin = (Math.random() - 0.5) * 2;
      particles.push(p);
    }
  }

  function updateAndDrawParticles() {
    if (!particlesEnabled) return;
    const useSecondary = vizMode === "blob" || vizMode === "wave";
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (vizMode === "bars") p.vy += 0.04;
      if (vizMode === "blob") {
        p.vx *= 0.995;
        p.vy *= 0.995;
      }
      p.angle += p.spin * particleRotation * 0.1;
      p.life -= p.decay;
      if (p.life <= 0) {
        particles[i] = particles[particles.length - 1];
        particles.pop();
        continue;
      }
      if (pImg && pImg.complete) {
        const sz = p.radius * p.life * 3;
        ctx.globalAlpha = p.life;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.drawImage(pImg, -sz / 2, -sz / 2, sz, sz);
        ctx.restore();
        ctx.globalAlpha = 1;
      } else {
        const alpha = Math.floor(p.life * 200)
          .toString(16)
          .padStart(2, "0");
        const color =
          useSecondary && Math.random() > 0.5
            ? colors.secondary
            : colors.primary;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * p.life, 0, Math.PI * 2);
        ctx.fillStyle = color + alpha;
        ctx.fill();
      }
    }
  }

  function precalculateAngles() {
    const totalBars = barCount;
    const halfBars = Math.ceil(totalBars / 2);
    const angleStep = Math.PI / halfBars;
    const halfStep = angleStep / 2;
    for (let i = 0; i < halfBars; i++) {
      const rightAngle = -Math.PI / 2 + halfStep + i * angleStep;
      cosValues[i] = Math.cos(rightAngle);
      sinValues[i] = Math.sin(rightAngle);
      if (halfBars + i < totalBars) {
        const leftAngle = -Math.PI / 2 - halfStep - i * angleStep;
        cosValues[halfBars + i] = Math.cos(leftAngle);
        sinValues[halfBars + i] = Math.sin(leftAngle);
      }
    }
  }

  async function initAudio() {
    audioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    if (audioContext.state === "suspended") {
      await audioContext.resume();
    }
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 8192;
    analyser.smoothingTimeConstant = smoothing;
    bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);

    let stream;

    if (audioSource === "file" && audioElement) {
      audioSourceNode = audioContext.createMediaElementSource(audioElement);
      audioSourceNode.connect(analyser);
      analyser.connect(audioContext.destination);
      audioElement.play();
      isListening = true;
      return;
    } else if (audioSource === "tab") {
      stream = await navigator.mediaDevices.getDisplayMedia({
        video: { width: 1, height: 1, frameRate: 1 },
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
          systemAudio: "include",
        } as MediaTrackConstraints,
      });
      const audioTracks = stream.getAudioTracks();
      if (audioTracks.length === 0) {
        stream.getTracks().forEach((t) => t.stop());
        throw new Error(
          'No audio captured. Make sure to check "Share tab audio" in the sharing dialog.',
        );
      }
      stream.getVideoTracks().forEach((t) => t.stop());
      stream.addEventListener("inactive", () => stopListening());
      audioTracks.forEach((track) =>
        track.addEventListener("ended", () => stopListening()),
      );
    } else {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });
    }

    currentStream = stream;
    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);
    isListening = true;
  }

  function getProcessedData() {
    const totalBars = barCount;
    const halfBars = Math.ceil(totalBars / 2);
    const usableBins = (bufferLength * FREQ_RANGE) | 0;
    let sum = 0;
    for (let i = 0; i < halfBars; i++) {
      const t = i / (halfBars - 1 || 1);
      const binIdx = Math.min(usableBins - 1, (t * (usableBins - 1)) | 0);
      const lo = Math.max(0, binIdx - 1);
      const hi = Math.min(usableBins - 1, binIdx + 1);
      const raw =
        ((dataArray[lo] || 0) +
          (dataArray[binIdx] || 0) +
          (dataArray[hi] || 0)) /
        3;
      const normalized = Math.min(1, (raw * sensitivity) / 255);
      const curved = Math.pow(normalized, 8);
      const bassBoost = (1 - t) * bassEmphasis * normalized * 0.3;
      const spiked = Math.min(1, curved + bassBoost) * 255;
      smoothedValues[i] += (spiked - smoothedValues[i]) * SMOOTH_FACTOR;
    }
    for (let pass = 0; pass < 2; pass++) {
      for (let i = 1; i < halfBars - 1; i++) {
        smoothedValues[i] =
          smoothedValues[i - 1] * 0.1 +
          smoothedValues[i] * 0.8 +
          smoothedValues[i + 1] * 0.1;
      }
    }
    for (let i = 0; i < halfBars; i++) sum += smoothedValues[i];
    const avgLoudness = (sum / halfBars) * INV_255;
    smoothedLoudness += (avgLoudness - smoothedLoudness) * 0.2;
    return { halfBars, totalBars, sum };
  }

  function applyWrapperEffects() {
    const shakeIntensity = 12 * shakeAmount;
    const zoom = isFinite(zoomIntensity) ? zoomIntensity : 1.0;
    const targetScale =
      MIN_SCALE + smoothedLoudness * (MAX_SCALE - MIN_SCALE) * zoom;
    smoothedScale += (targetScale - smoothedScale) * SCALE_SMOOTH;
    const shakeX = (Math.random() - 0.5) * shakeIntensity * smoothedLoudness;
    const shakeY = (Math.random() - 0.5) * shakeIntensity * smoothedLoudness;
    const bloom = 1 + smoothedLoudness * glowIntensity;
    if (visualizerWrapper) {
      const isFullViewport = vizMode === "bars" || vizMode === "wave";
      if (isFullViewport) {
        visualizerWrapper.style.transform = "none";
      } else {
        visualizerWrapper.style.transform = `scale(${smoothedScale}) translate(${shakeX}px, ${shakeY}px)`;
      }
      visualizerWrapper.style.filter = `brightness(${bloom})`;
    }
  }

  function drawCircular(halfBars: number, totalBars: number) {
    const maxBarHeight = size * 0.25;
    const barHeights = new Float32Array(totalBars);
    for (let i = 0; i < totalBars; i++) {
      const dataIdx = i < halfBars ? i : i - halfBars;
      barHeights[i] =
        baseRadius + 5 + smoothedValues[dataIdx] * maxBarHeight * INV_255;
    }
    const outerPoints = [];
    for (let i = 0; i < halfBars; i++) {
      const r = barHeights[i] + LINE_LIFT;
      outerPoints.push({
        x: centerX + cosValues[i] * r,
        y: centerY + sinValues[i] * r,
      });
    }
    for (let i = totalBars - 1; i >= halfBars; i--) {
      const r = barHeights[i] + LINE_LIFT;
      outerPoints.push({
        x: centerX + cosValues[i] * r,
        y: centerY + sinValues[i] * r,
      });
    }
    const len = outerPoints.length;
    ctx.beginPath();
    ctx.moveTo(outerPoints[0].x, outerPoints[0].y);
    for (let i = 0; i < len; i++) {
      const curr = outerPoints[i];
      const next = outerPoints[(i + 1) % len];
      const mx = (curr.x + next.x) / 2;
      const my = (curr.y + next.y) / 2;
      ctx.quadraticCurveTo(curr.x, curr.y, mx, my);
    }
    ctx.closePath();
    ctx.moveTo(centerX + baseRadius, centerY);
    ctx.arc(centerX, centerY, baseRadius, 0, Math.PI * 2, true);
    const grad = ctx.createRadialGradient(
      centerX,
      centerY,
      baseRadius,
      centerX,
      centerY,
      size * 0.48,
    );
    grad.addColorStop(0, colors.secondary);
    grad.addColorStop(1, colors.primary);
    ctx.fillStyle = grad;
    ctx.fill("evenodd");
  }

  function drawBars(halfBars: number) {
    const totalBarsToShow = halfBars;
    const barGap = 3;
    const totalWidth = canvas.width;
    const barWidth = Math.max(
      2,
      (totalWidth - (totalBarsToShow - 1) * barGap) / totalBarsToShow,
    );
    const maxBarHeight = canvas.height * 0.7;
    const startX = 0;
    const bottomY = canvas.height;
    const grad = ctx.createLinearGradient(
      0,
      bottomY - maxBarHeight,
      0,
      bottomY,
    );
    grad.addColorStop(0, colors.primary);
    grad.addColorStop(1, colors.secondary);
    ctx.fillStyle = grad;
    for (let i = 0; i < totalBarsToShow; i++) {
      const val = smoothedValues[i] * INV_255;
      const h = Math.max(2, val * maxBarHeight);
      const x = startX + i * (barWidth + barGap);
      const radius = Math.min(barWidth / 2, 4);
      ctx.beginPath();
      ctx.moveTo(x + radius, bottomY - h);
      ctx.lineTo(x + barWidth - radius, bottomY - h);
      ctx.quadraticCurveTo(
        x + barWidth,
        bottomY - h,
        x + barWidth,
        bottomY - h + radius,
      );
      ctx.lineTo(x + barWidth, bottomY);
      ctx.lineTo(x, bottomY);
      ctx.lineTo(x, bottomY - h + radius);
      ctx.quadraticCurveTo(x, bottomY - h, x + radius, bottomY - h);
      ctx.closePath();
      ctx.fill();
    }
  }

  function drawWave(halfBars: number) {
    const totalWidth = canvas.width;
    const maxAmp = canvas.height * 0.3;
    const startX = 0;
    const midY = canvas.height * 0.5;
    ctx.beginPath();
    ctx.moveTo(startX, midY);
    for (let i = 0; i < halfBars; i++) {
      const t = i / (halfBars - 1);
      const x = startX + t * totalWidth;
      const val = smoothedValues[i] * INV_255;
      const y = midY - val * maxAmp;
      if (i === 0) ctx.moveTo(x, y);
      else {
        const prevT = (i - 1) / (halfBars - 1);
        const prevX = startX + prevT * totalWidth;
        const cpx = (prevX + x) / 2;
        ctx.quadraticCurveTo(
          prevX,
          midY - smoothedValues[i - 1] * INV_255 * maxAmp,
          cpx,
          (midY - smoothedValues[i - 1] * INV_255 * maxAmp + y) / 2,
        );
      }
    }
    ctx.lineTo(startX + totalWidth, midY);
    ctx.lineTo(startX, midY);
    ctx.closePath();
    const grad = ctx.createLinearGradient(0, midY - maxAmp, 0, midY);
    grad.addColorStop(0, colors.primary + "cc");
    grad.addColorStop(1, colors.primary + "11");
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.beginPath();
    for (let i = 0; i < halfBars; i++) {
      const t = i / (halfBars - 1);
      const x = startX + t * totalWidth;
      const val = smoothedValues[i] * INV_255;
      const y = midY - val * maxAmp;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = colors.primary;
    ctx.lineWidth = 2.5;
    ctx.shadowColor = colors.primary;
    ctx.shadowBlur = 10 * glowIntensity;
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.beginPath();
    for (let i = 0; i < halfBars; i++) {
      const t = i / (halfBars - 1);
      const x = startX + t * totalWidth;
      const val = smoothedValues[i] * INV_255;
      const y = midY + val * maxAmp * 0.6;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.lineTo(startX + totalWidth, midY);
    ctx.lineTo(startX, midY);
    ctx.closePath();
    const grad2 = ctx.createLinearGradient(0, midY, 0, midY + maxAmp * 0.6);
    grad2.addColorStop(0, colors.secondary + "11");
    grad2.addColorStop(1, colors.secondary + "88");
    ctx.fillStyle = grad2;
    ctx.fill();
    ctx.beginPath();
    for (let i = 0; i < halfBars; i++) {
      const t = i / (halfBars - 1);
      const x = startX + t * totalWidth;
      const val = smoothedValues[i] * INV_255;
      const y = midY + val * maxAmp * 0.6;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = colors.secondary;
    ctx.lineWidth = 2;
    ctx.shadowColor = colors.secondary;
    ctx.shadowBlur = 8 * glowIntensity;
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  function drawBlob(halfBars: number) {
    blobPhase += 0.008;
    const points = 64;
    const maxDeform = size * 0.2;
    ctx.beginPath();
    for (let i = 0; i <= points; i++) {
      const angle = (i / points) * Math.PI * 2;
      const freqIdx = Math.floor((i / points) * halfBars) % halfBars;
      const val = smoothedValues[freqIdx] * INV_255;
      const noise =
        Math.sin(angle * 3 + blobPhase) * 0.3 +
        Math.sin(angle * 5 - blobPhase * 1.3) * 0.2 +
        Math.sin(angle * 7 + blobPhase * 0.7) * 0.1;
      const r = baseRadius + val * maxDeform + noise * maxDeform * 0.3;
      const x = centerX + Math.cos(angle) * r;
      const y = centerY + Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    const grad = ctx.createRadialGradient(
      centerX,
      centerY,
      0,
      centerX,
      centerY,
      baseRadius + maxDeform,
    );
    grad.addColorStop(0, colors.secondary + "dd");
    grad.addColorStop(0.5, colors.primary + "88");
    grad.addColorStop(1, colors.primary + "22");
    ctx.fillStyle = grad;
    ctx.shadowColor = colors.primary;
    ctx.shadowBlur = 20 * glowIntensity;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.arc(centerX, centerY, baseRadius * 0.95, 0, Math.PI * 2);
    const innerGrad = ctx.createRadialGradient(
      centerX,
      centerY,
      0,
      centerX,
      centerY,
      baseRadius,
    );
    innerGrad.addColorStop(0, colors.secondary + "44");
    innerGrad.addColorStop(1, colors.secondary + "00");
    ctx.fillStyle = innerGrad;
    ctx.fill();
  }

  function draw() {
    if (!ctx) return;
    const useFullViewport = vizMode === "bars" || vizMode === "wave";
    const cw = useFullViewport
      ? window.innerWidth
      : Math.ceil(size * CANVAS_PAD);
    const ch = useFullViewport
      ? window.innerHeight
      : Math.ceil(size * CANVAS_PAD);
    if (canvas.width !== cw || canvas.height !== ch) {
      canvas.width = cw;
      canvas.height = ch;
    }
    ctx.clearRect(0, 0, cw, ch);
    if (analyser) {
      analyser.getByteFrequencyData(dataArray);
    }
    if (useFullViewport) {
      centerX = cw / 2;
      centerY = ch / 2;
    } else {
      const offset = (cw - size) / 2;
      centerX = offset + size / 2;
      centerY = offset + size / 2;
    }
    const { halfBars, totalBars } = getProcessedData();
    applyWrapperEffects();
    spawnParticles(smoothedLoudness);
    switch (vizMode) {
      case "bars":
        drawBars(halfBars);
        break;
      case "wave":
        drawWave(halfBars);
        break;
      case "blob":
        drawBlob(halfBars);
        break;
      case "circular":
      default:
        drawCircular(halfBars, totalBars);
        break;
    }
    updateAndDrawParticles();
    animationId = requestAnimationFrame(draw);
  }

  function updateSize() {
    size = Math.min(window.innerWidth, window.innerHeight) * 0.65;
    baseRadius = size * 0.25;
  }

  export async function startListening() {
    try {
      await initAudio();
      draw();
    } catch (err) {
      console.error("Failed to start audio:", err);
      alert(
        (err as Error).message ||
          "Failed to start audio. Check browser permissions.",
      );
      if (audioContext) {
        audioContext.close().catch(() => {});
        audioContext = null;
      }
      isListening = false;
    }
  }

  export function stopListening() {
    if (animationId) cancelAnimationFrame(animationId);
    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;
    }
    if (currentStream) {
      currentStream.getTracks().forEach((t) => t.stop());
      currentStream = null;
    }
    if (audioContext) {
      audioContext.close();
      audioContext = null;
    }
    audioSourceNode = null;
    isListening = false;
    dataArray = new Uint8Array(bufferLength);
    draw();
  }

  export function setAudioFile(file: File) {
    if (audioElement) {
      audioElement.pause();
      URL.revokeObjectURL(audioElement.src);
    }
    audioElement = new Audio();
    audioElement.crossOrigin = "anonymous";
    audioElement.src = URL.createObjectURL(file);
    audioElement.loop = true;
    fileName = file.name;
    filePlaying = false;
    fileCurrentTime = 0;
    fileDuration = 0;
    audioElement.addEventListener("loadedmetadata", () => {
      fileDuration = audioElement!.duration;
    });
    audioElement.addEventListener("timeupdate", () => {
      fileCurrentTime = audioElement!.currentTime;
    });
    audioElement.addEventListener("play", () => {
      filePlaying = true;
    });
    audioElement.addEventListener("pause", () => {
      filePlaying = false;
    });
  }

  export function pauseAudio() {
    if (audioElement) audioElement.pause();
  }

  export function resumeAudio() {
    if (audioElement) audioElement.play();
  }

  export function seekAudio(time: number) {
    if (audioElement) audioElement.currentTime = time;
  }

  export function takeScreenshot() {
    if (!canvas) return null;
    return canvas.toDataURL("image/png");
  }

  onMount(() => {
    ctx = canvas.getContext("2d")!;
    precalculateAngles();
    updateSize();
    window.addEventListener("resize", updateSize);
    draw();
  });

  onDestroy(() => {
    if (animationId) cancelAnimationFrame(animationId);
    if (audioContext) audioContext.close();
    window.removeEventListener("resize", updateSize);
  });
</script>

<div class="visualizer-container">
  <div class="visualizer-wrapper" bind:this={visualizerWrapper}>
    <canvas
      bind:this={canvas}
      width={Math.ceil(size * CANVAS_PAD)}
      height={Math.ceil(size * CANVAS_PAD)}
    ></canvas>
    {#if logoUrl}
      <div
        class="logo-container"
        class:spinning={logoSpin}
        style="width: {baseRadius * 2}px; height: {baseRadius *
          2}px; --spin-duration: {Math.max(0.5, 20 / logoSpinSpeed)}s"
      >
        <img src={logoUrl} alt="Logo" />
      </div>
    {/if}
  </div>
</div>

<style>
  .visualizer-container {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .visualizer-wrapper {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: transform 0.05s linear;
    will-change: transform;
    z-index: 5;
  }
  canvas {
    display: block;
  }
  .logo-container {
    position: absolute;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: radial-gradient(
      circle,
      rgba(20, 20, 30, 0.95),
      rgba(10, 10, 15, 0.98)
    );
    border: none;
    overflow: hidden;
    z-index: 6;
  }
  .logo-container img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .logo-container.spinning {
    animation: logo-spin var(--spin-duration, 4s) linear infinite;
  }
  @keyframes -global-logo-spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>
