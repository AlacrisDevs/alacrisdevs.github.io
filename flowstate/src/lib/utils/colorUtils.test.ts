import { describe, it, expect } from 'vitest';
import {
    hexToRgb,
    rgbToHex,
    rgbToHsl,
    hslToRgb,
    rgbToHsv,
    hsvToRgb,
    hexToHsl,
    hslToHex,
    parseColor,
    formatRgb,
    formatHsl,
    getLuminance,
    getContrastRatio,
    getContrastRatioFromHex,
    getContrastRating,
    getContrastingTextColor,
    lightenColor,
    darkenColor,
    colorWithOpacity,
    randomColor,
    randomContrastSafePalette,
    type RGB,
    type HSL
} from './colorUtils';

describe('Color Conversions', () => {
    describe('hexToRgb', () => {
        it('should convert hex to RGB correctly', () => {
            expect(hexToRgb('#000000')).toEqual({ r: 0, g: 0, b: 0 });
            expect(hexToRgb('#FFFFFF')).toEqual({ r: 255, g: 255, b: 255 });
            expect(hexToRgb('#FF0000')).toEqual({ r: 255, g: 0, b: 0 });
            expect(hexToRgb('#00FF00')).toEqual({ r: 0, g: 255, b: 0 });
            expect(hexToRgb('#0000FF')).toEqual({ r: 0, g: 0, b: 255 });
            expect(hexToRgb('#00A3E0')).toEqual({ r: 0, g: 163, b: 224 });
        });

        it('should handle hex without # prefix', () => {
            expect(hexToRgb('FF0000')).toEqual({ r: 255, g: 0, b: 0 });
        });

        it('should handle lowercase hex', () => {
            expect(hexToRgb('#ff0000')).toEqual({ r: 255, g: 0, b: 0 });
        });

        it('should return null for invalid hex', () => {
            expect(hexToRgb('#GGG')).toBeNull();
            expect(hexToRgb('invalid')).toBeNull();
            expect(hexToRgb('#12')).toBeNull();
        });
    });

    describe('rgbToHex', () => {
        it('should convert RGB to hex correctly', () => {
            expect(rgbToHex(0, 0, 0)).toBe('#000000');
            expect(rgbToHex(255, 255, 255)).toBe('#ffffff');
            expect(rgbToHex(255, 0, 0)).toBe('#ff0000');
            expect(rgbToHex(0, 255, 0)).toBe('#00ff00');
            expect(rgbToHex(0, 0, 255)).toBe('#0000ff');
        });

        it('should handle decimal values by rounding', () => {
            expect(rgbToHex(127.4, 127.6, 128)).toBe('#7f8080');
        });
    });

    describe('rgbToHsl', () => {
        it('should convert RGB to HSL correctly', () => {
            expect(rgbToHsl(255, 0, 0)).toEqual({ h: 0, s: 100, l: 50 });
            expect(rgbToHsl(0, 255, 0)).toEqual({ h: 120, s: 100, l: 50 });
            expect(rgbToHsl(0, 0, 255)).toEqual({ h: 240, s: 100, l: 50 });
            expect(rgbToHsl(0, 0, 0)).toEqual({ h: 0, s: 0, l: 0 });
            expect(rgbToHsl(255, 255, 255)).toEqual({ h: 0, s: 0, l: 100 });
        });

        it('should handle grayscale colors', () => {
            const gray = rgbToHsl(128, 128, 128);
            expect(gray.s).toBe(0);
            expect(gray.l).toBe(50);
        });
    });

    describe('hslToRgb', () => {
        it('should convert HSL to RGB correctly', () => {
            expect(hslToRgb(0, 100, 50)).toEqual({ r: 255, g: 0, b: 0 });
            expect(hslToRgb(120, 100, 50)).toEqual({ r: 0, g: 255, b: 0 });
            expect(hslToRgb(240, 100, 50)).toEqual({ r: 0, g: 0, b: 255 });
        });

        it('should handle grayscale (saturation = 0)', () => {
            expect(hslToRgb(0, 0, 50)).toEqual({ r: 128, g: 128, b: 128 });
        });
    });

    describe('rgbToHsv', () => {
        it('should convert RGB to HSV correctly', () => {
            expect(rgbToHsv(255, 0, 0)).toEqual({ h: 0, s: 100, v: 100 });
            expect(rgbToHsv(0, 255, 0)).toEqual({ h: 120, s: 100, v: 100 });
            expect(rgbToHsv(0, 0, 255)).toEqual({ h: 240, s: 100, v: 100 });
        });
    });

    describe('hsvToRgb', () => {
        it('should convert HSV to RGB correctly', () => {
            expect(hsvToRgb(0, 100, 100)).toEqual({ r: 255, g: 0, b: 0 });
            expect(hsvToRgb(120, 100, 100)).toEqual({ r: 0, g: 255, b: 0 });
            expect(hsvToRgb(240, 100, 100)).toEqual({ r: 0, g: 0, b: 255 });
        });
    });

    describe('hexToHsl', () => {
        it('should convert hex to HSL correctly', () => {
            expect(hexToHsl('#FF0000')).toEqual({ h: 0, s: 100, l: 50 });
            expect(hexToHsl('#00FF00')).toEqual({ h: 120, s: 100, l: 50 });
        });

        it('should return null for invalid hex', () => {
            expect(hexToHsl('invalid')).toBeNull();
        });
    });

    describe('hslToHex', () => {
        it('should convert HSL to hex correctly', () => {
            expect(hslToHex(0, 100, 50)).toBe('#ff0000');
            expect(hslToHex(120, 100, 50)).toBe('#00ff00');
            expect(hslToHex(240, 100, 50)).toBe('#0000ff');
        });
    });

    describe('round-trip conversions', () => {
        it('should maintain color fidelity through hex->rgb->hex conversion', () => {
            const testColors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#00FFFF', '#FF00FF'];
            testColors.forEach(hex => {
                const rgb = hexToRgb(hex);
                expect(rgb).not.toBeNull();
                if (rgb) {
                    const result = rgbToHex(rgb.r, rgb.g, rgb.b);
                    expect(result.toUpperCase()).toBe(hex);
                }
            });
        });

        it('should maintain color fidelity through rgb->hsl->rgb conversion', () => {
            const testRgb: RGB[] = [
                { r: 255, g: 0, b: 0 },
                { r: 0, g: 255, b: 0 },
                { r: 0, g: 0, b: 255 }
            ];
            testRgb.forEach(rgb => {
                const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
                const result = hslToRgb(hsl.h, hsl.s, hsl.l);
                expect(result.r).toBeCloseTo(rgb.r, 0);
                expect(result.g).toBeCloseTo(rgb.g, 0);
                expect(result.b).toBeCloseTo(rgb.b, 0);
            });
        });
    });
});

describe('Color Parsing', () => {
    describe('parseColor', () => {
        it('should parse hex colors', () => {
            const result = parseColor('#FF0000');
            expect(result).not.toBeNull();
            expect(result?.hex).toBe('#FF0000');
            expect(result?.rgb).toEqual({ r: 255, g: 0, b: 0 });
        });

        it('should parse rgb colors', () => {
            const result = parseColor('rgb(255, 0, 0)');
            expect(result).not.toBeNull();
            expect(result?.hex).toBe('#ff0000');
            expect(result?.rgb).toEqual({ r: 255, g: 0, b: 0 });
        });

        it('should parse rgba colors', () => {
            const result = parseColor('rgba(255, 0, 0, 0.5)');
            expect(result).not.toBeNull();
            expect(result?.hex).toBe('#ff0000');
        });

        it('should parse hsl colors', () => {
            const result = parseColor('hsl(0, 100%, 50%)');
            expect(result).not.toBeNull();
            expect(result?.rgb).toEqual({ r: 255, g: 0, b: 0 });
        });

        it('should return null for invalid colors', () => {
            expect(parseColor('invalid')).toBeNull();
        });
    });

    describe('formatRgb', () => {
        it('should format RGB correctly', () => {
            expect(formatRgb({ r: 255, g: 0, b: 0 })).toBe('rgb(255, 0, 0)');
            expect(formatRgb({ r: 0, g: 128, b: 255 })).toBe('rgb(0, 128, 255)');
        });
    });

    describe('formatHsl', () => {
        it('should format HSL correctly', () => {
            expect(formatHsl({ h: 0, s: 100, l: 50 })).toBe('hsl(0, 100%, 50%)');
            expect(formatHsl({ h: 240, s: 50, l: 75 })).toBe('hsl(240, 50%, 75%)');
        });
    });
});

describe('WCAG Contrast Calculations', () => {
    describe('getLuminance', () => {
        it('should calculate relative luminance correctly', () => {
            expect(getLuminance(0, 0, 0)).toBeCloseTo(0, 4);
            expect(getLuminance(255, 255, 255)).toBeCloseTo(1, 4);
        });

        it('should handle the sRGB linearization threshold', () => {
            const lowValue = getLuminance(10, 10, 10);
            const highValue = getLuminance(100, 100, 100);
            expect(lowValue).toBeLessThan(highValue);
        });
    });

    describe('getContrastRatio', () => {
        it('should return 21:1 for black on white', () => {
            const black: RGB = { r: 0, g: 0, b: 0 };
            const white: RGB = { r: 255, g: 255, b: 255 };
            expect(getContrastRatio(black, white)).toBeCloseTo(21, 0);
        });

        it('should return 1:1 for identical colors', () => {
            const color: RGB = { r: 128, g: 128, b: 128 };
            expect(getContrastRatio(color, color)).toBeCloseTo(1, 2);
        });

        it('should be symmetric', () => {
            const color1: RGB = { r: 0, g: 100, b: 200 };
            const color2: RGB = { r: 255, g: 200, b: 100 };
            expect(getContrastRatio(color1, color2)).toBeCloseTo(getContrastRatio(color2, color1), 5);
        });
    });

    describe('getContrastRatioFromHex', () => {
        it('should calculate contrast ratio from hex colors', () => {
            expect(getContrastRatioFromHex('#000000', '#FFFFFF')).toBeCloseTo(21, 0);
            expect(getContrastRatioFromHex('#FFFFFF', '#000000')).toBeCloseTo(21, 0);
        });

        it('should return 1 for invalid hex colors', () => {
            expect(getContrastRatioFromHex('invalid', '#FFFFFF')).toBe(1);
            expect(getContrastRatioFromHex('#000000', 'invalid')).toBe(1);
        });
    });

    describe('getContrastRating', () => {
        it('should return AAA for ratio >= 7', () => {
            const result = getContrastRating(7);
            expect(result.label).toBe('AAA');
            expect(result.color).toBe('#22c55e');
        });

        it('should return AA for ratio >= 4.5', () => {
            const result = getContrastRating(4.5);
            expect(result.label).toBe('AA');
        });

        it('should return AA Large for ratio >= 3', () => {
            const result = getContrastRating(3);
            expect(result.label).toBe('AA Large');
            expect(result.color).toBe('#eab308');
        });

        it('should return Fail for ratio < 3', () => {
            const result = getContrastRating(2);
            expect(result.label).toBe('Fail');
            expect(result.color).toBe('#ef4444');
        });
    });

    describe('getContrastingTextColor', () => {
        it('should return light color on dark background', () => {
            const result = getContrastingTextColor('#0A121F', '#FFFFFF', '#000000');
            expect(result).toBe('#FFFFFF');
        });

        it('should return dark color on light background', () => {
            const result = getContrastingTextColor('#FFFFFF', '#FFFFFF', '#000000');
            expect(result).toBe('#000000');
        });

        it('should handle mid-tone backgrounds', () => {
            const result = getContrastingTextColor('#808080', '#FFFFFF', '#000000');
            expect(['#FFFFFF', '#000000']).toContain(result);
        });

        it('should return light color for invalid background', () => {
            const result = getContrastingTextColor('invalid', '#FFFFFF', '#000000');
            expect(result).toBe('#FFFFFF');
        });
    });
});

describe('Color Manipulation', () => {
    describe('lightenColor', () => {
        it('should lighten a color by mixing with white', () => {
            const result = lightenColor('#000000', 0.5);
            expect(hexToRgb(result)).toEqual({ r: 128, g: 128, b: 128 });
        });

        it('should not change white', () => {
            const result = lightenColor('#FFFFFF', 0.5);
            expect(result.toUpperCase()).toBe('#FFFFFF');
        });

        it('should return original for invalid hex', () => {
            expect(lightenColor('invalid', 0.5)).toBe('invalid');
        });
    });

    describe('darkenColor', () => {
        it('should darken a color by mixing with black', () => {
            const result = darkenColor('#FFFFFF', 0.5);
            expect(hexToRgb(result)).toEqual({ r: 128, g: 128, b: 128 });
        });

        it('should not change black', () => {
            const result = darkenColor('#000000', 0.5);
            expect(result).toBe('#000000');
        });

        it('should return original for invalid hex', () => {
            expect(darkenColor('invalid', 0.5)).toBe('invalid');
        });
    });

    describe('colorWithOpacity', () => {
        it('should return rgba string with opacity', () => {
            expect(colorWithOpacity('#FF0000', 0.5)).toBe('rgba(255, 0, 0, 0.5)');
            expect(colorWithOpacity('#00FF00', 0.75)).toBe('rgba(0, 255, 0, 0.75)');
        });

        it('should return original for invalid hex', () => {
            expect(colorWithOpacity('invalid', 0.5)).toBe('invalid');
        });
    });
});

describe('Color Generation', () => {
    describe('randomColor', () => {
        it('should return a valid hex color', () => {
            const color = randomColor();
            expect(color).toMatch(/^#[0-9a-f]{6}$/);
        });

        it('should return different colors on multiple calls', () => {
            const colors = new Set(Array.from({ length: 10 }, () => randomColor()));
            expect(colors.size).toBeGreaterThan(1);
        });
    });

    describe('randomContrastSafePalette', () => {
        it('should generate a palette with text and background', () => {
            const palette = randomContrastSafePalette('dark');
            expect(palette).toHaveProperty('primary');
            expect(palette).toHaveProperty('accent');
            expect(palette).toHaveProperty('text');
            expect(palette).toHaveProperty('background');
        });

        it('should generate dark mode palette with light text on dark background', () => {
            const palette = randomContrastSafePalette('dark');
            const textLuminance = getLuminance(
                ...(Object.values(hexToRgb(palette.text)!) as [number, number, number])
            );
            const bgLuminance = getLuminance(
                ...(Object.values(hexToRgb(palette.background)!) as [number, number, number])
            );
            expect(textLuminance).toBeGreaterThan(bgLuminance);
        });

        it('should generate light mode palette with dark text on light background', () => {
            const palette = randomContrastSafePalette('light');
            const textLuminance = getLuminance(
                ...(Object.values(hexToRgb(palette.text)!) as [number, number, number])
            );
            const bgLuminance = getLuminance(
                ...(Object.values(hexToRgb(palette.background)!) as [number, number, number])
            );
            expect(textLuminance).toBeLessThan(bgLuminance);
        });

        it('should generate primary color with minimum contrast against background', () => {
            const palette = randomContrastSafePalette('dark');
            const contrast = getContrastRatioFromHex(palette.primary, palette.background);
            expect(contrast).toBeGreaterThanOrEqual(2.5);
        });
    });
});
