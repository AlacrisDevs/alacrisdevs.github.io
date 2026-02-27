// src/lib/utils/colorUtils.ts
// Main color utilities - imports from core and advanced modules

// Core functions (always loaded)
export * from './colorUtilsCore';

// Advanced functions (can be tree-shaken if not used)
// Note: Import specific functions to avoid conflicts
export {
    rgbToHsv,
    hsvToRgb,
    hexToHsl,
    hslToHex,
    formatRgb,
    formatHsl,
    lightenColor,
    darkenColor,
    colorWithOpacity
} from './colorUtilsAdvanced';