// Color utility functions for conversion between formats

export interface RGB {
    r: number;
    g: number;
    b: number;
}

export interface HSL {
    h: number;
    s: number;
    l: number;
}



export function hexToRgb(hex: string): RGB | null {
    // Handle both 6-char (#RRGGBB) and 8-char (#RRGGBBAA) hex codes
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i.exec(hex);
    return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        }
        : null;
}

export function rgbToHex(r: number, g: number, b: number): string {
    return '#' + [r, g, b].map(x => {
        const hex = Math.round(x).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('');
}

export function rgbToHsl(r: number, g: number, b: number): HSL {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
            case r:
                h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
                break;
            case g:
                h = ((b - r) / d + 2) / 6;
                break;
            case b:
                h = ((r - g) / d + 4) / 6;
                break;
        }
    }

    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
    };
}

export function hslToRgb(h: number, s: number, l: number): RGB {
    h /= 360;
    s /= 100;
    l /= 100;

    let r, g, b;

    if (s === 0) {
        r = g = b = l;
    } else {
        const hue2rgb = (p: number, q: number, t: number) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}





export function parseColor(color: string): { hex: string; rgb: RGB; hsl: HSL; alpha: number } | null {
    let hex = color;
    let alpha = 1;

    // Handle rgb/rgba
    const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    if (rgbMatch) {
        const r = parseInt(rgbMatch[1]);
        const g = parseInt(rgbMatch[2]);
        const b = parseInt(rgbMatch[3]);
        if (rgbMatch[4]) alpha = parseFloat(rgbMatch[4]);
        hex = rgbToHex(r, g, b);
    }

    // Handle hsl/hsla
    const hslMatch = color.match(/hsla?\((\d+),\s*(\d+)%?,\s*(\d+)%?(?:,\s*([\d.]+))?\)/);
    if (hslMatch) {
        const h = parseInt(hslMatch[1]);
        const s = parseInt(hslMatch[2]);
        const l = parseInt(hslMatch[3]);
        if (hslMatch[4]) alpha = parseFloat(hslMatch[4]);
        const rgb = hslToRgb(h, s, l);
        hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    }

    // Handle 8-char hex with alpha (#RRGGBBAA)
    const hex8Match = color.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
    if (hex8Match) {
        hex = `#${hex8Match[1]}${hex8Match[2]}${hex8Match[3]}`;
        alpha = parseInt(hex8Match[4], 16) / 255;
    }

    const rgb = hexToRgb(hex);
    if (!rgb) return null;

    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

    return { hex, rgb, hsl, alpha };
}

// Blend a foreground color with alpha over a background color
export function blendColors(fg: RGB, bg: RGB, alpha: number): RGB {
    return {
        r: Math.round(fg.r * alpha + bg.r * (1 - alpha)),
        g: Math.round(fg.g * alpha + bg.g * (1 - alpha)),
        b: Math.round(fg.b * alpha + bg.b * (1 - alpha))
    };
}



// Calculate relative luminance for WCAG contrast
export function getLuminance(r: number, g: number, b: number): number {
    const [rs, gs, bs] = [r, g, b].map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

// Calculate contrast ratio between two RGB colors
export function getContrastRatio(color1: RGB, color2: RGB): number {
    const l1 = getLuminance(color1.r, color1.g, color1.b);
    const l2 = getLuminance(color2.r, color2.g, color2.b);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
}

// Calculate contrast ratio between two color strings (supports hex, rgb, rgba, hsl, hsla)
export function getContrastRatioFromHex(color1: string, color2: string): number {
    const parsed1 = parseColor(color1);
    const parsed2 = parseColor(color2);
    if (!parsed1 || !parsed2) return 1;
    return getContrastRatio(parsed1.rgb, parsed2.rgb);
}

// Get WCAG contrast rating label and colors (dark mode and light mode variants)
export function getContrastRating(ratio: number, isDark: boolean = true): { label: string; color: string } {
    if (ratio >= 7) return { label: 'AAA', color: isDark ? '#22c55e' : '#15803d' };
    if (ratio >= 4.5) return { label: 'AA', color: isDark ? '#22c55e' : '#15803d' };
    if (ratio >= 3) return { label: 'AA Large', color: isDark ? '#eab308' : '#a16207' };
    return { label: 'Fail', color: isDark ? '#ef4444' : '#dc2626' };
}

// Get best text color (light or dark) for a given background
export function getContrastingTextColor(bgColor: string, lightColor: string, darkColor: string): string {
    const bgParsed = parseColor(bgColor);
    const light = hexToRgb(lightColor.startsWith('#') ? lightColor : '#FFFFFF');
    const dark = hexToRgb(darkColor.startsWith('#') ? darkColor : '#000000');

    if (!bgParsed || !light || !dark) return lightColor;

    const contrastWithLight = getContrastRatio(bgParsed.rgb, light);
    const contrastWithDark = getContrastRatio(bgParsed.rgb, dark);

    return contrastWithLight > contrastWithDark ? lightColor : darkColor;
}

// Lighten a color by mixing with white (amount 0-1)


// Darken a color by mixing with black (amount 0-1)
export function darkenColor(hex: string, amount: number): string {
    const rgb = hexToRgb(hex);
    if (!rgb) return hex;

    const r = Math.round(rgb.r * (1 - amount));
    const g = Math.round(rgb.g * (1 - amount));
    const b = Math.round(rgb.b * (1 - amount));

    return rgbToHex(r, g, b);
}

// Get color as rgba with opacity
export function colorWithOpacity(hex: string, opacity: number): string {
    const rgb = hexToRgb(hex);
    if (!rgb) return hex;
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
}

// Generate a random hex color
export function randomColor(): string {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return rgbToHex(r, g, b);
}

// Generate a random color palette with contrast-safe text and background
export function randomContrastSafePalette(mode: 'light' | 'dark' = 'dark'): {
    primary: string;
    accent: string;
    text: string;
    background: string;
} {
    const isDarkMode = mode === 'dark';

    let text: string;
    let background: string;

    if (isDarkMode) {
        // Dark mode: light text on dark background
        background = rgbToHex(
            Math.floor(Math.random() * 40),
            Math.floor(Math.random() * 40),
            Math.floor(Math.random() * 50)
        );
        text = rgbToHex(
            220 + Math.floor(Math.random() * 35),
            220 + Math.floor(Math.random() * 35),
            220 + Math.floor(Math.random() * 35)
        );
    } else {
        // Light mode: dark text on light background
        background = rgbToHex(
            230 + Math.floor(Math.random() * 25),
            230 + Math.floor(Math.random() * 25),
            230 + Math.floor(Math.random() * 25)
        );
        text = rgbToHex(
            Math.floor(Math.random() * 50),
            Math.floor(Math.random() * 50),
            Math.floor(Math.random() * 50)
        );
    }

    // Generate primary with good contrast
    let primary = randomColor();
    let attempts = 0;
    const minContrast = 3.0;
    while (getContrastRatioFromHex(primary, background) < minContrast && attempts < 20) {
        primary = randomColor();
        attempts++;
    }

    // Generate accent color with good contrast against background
    let accent = randomColor();
    attempts = 0;
    while (getContrastRatioFromHex(accent, background) < minContrast && attempts < 20) {
        accent = randomColor();
        attempts++;
    }
    // If still not good contrast, adjust brightness
    if (getContrastRatioFromHex(accent, background) < minContrast) {
        const accentRgb = hexToRgb(accent);
        if (accentRgb) {
            if (isDarkMode) {
                accent = rgbToHex(
                    Math.min(255, accentRgb.r + 100),
                    Math.min(255, accentRgb.g + 100),
                    Math.min(255, accentRgb.b + 100)
                );
            } else {
                accent = rgbToHex(
                    Math.max(0, accentRgb.r - 100),
                    Math.max(0, accentRgb.g - 100),
                    Math.max(0, accentRgb.b - 100)
                );
            }
        }
    }

    return { primary, accent, text, background };
}

// Generate a random color with at least AA Large contrast (3.0) against a background
export function randomContrastSafeColor(backgroundColor: string, minContrast: number = 3.0): string {
    let color = randomColor();
    let attempts = 0;

    while (getContrastRatioFromHex(color, backgroundColor) < minContrast && attempts < 30) {
        color = randomColor();
        attempts++;
    }

    // If still not good contrast, adjust brightness
    if (getContrastRatioFromHex(color, backgroundColor) < minContrast) {
        const colorRgb = hexToRgb(color);
        const bgRgb = hexToRgb(backgroundColor);
        if (colorRgb && bgRgb) {
            const bgLuminance = getLuminance(bgRgb.r, bgRgb.g, bgRgb.b);
            // If background is dark, lighten the color; if light, darken it
            if (bgLuminance < 0.5) {
                color = rgbToHex(
                    Math.min(255, colorRgb.r + 120),
                    Math.min(255, colorRgb.g + 120),
                    Math.min(255, colorRgb.b + 120)
                );
            } else {
                color = rgbToHex(
                    Math.max(0, colorRgb.r - 120),
                    Math.max(0, colorRgb.g - 120),
                    Math.max(0, colorRgb.b - 120)
                );
            }
        }
    }

    return color;
}
