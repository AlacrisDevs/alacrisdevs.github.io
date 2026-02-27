// Export design tokens to Tailwind CSS format
import type { DesignTokens } from '../stores/designTokens.svelte';

export function exportToTailwindCSS(tokens: DesignTokens): string {
  const css = `/* Design System - Generated Tailwind CSS */
/* Add this to your tailwind.config.js or CSS file */

@theme {
  /* Theme Colors */
  --color-text: ${tokens.colors.text};
  --color-background: ${tokens.colors.background};
  --color-primary: ${tokens.colors.primary};
  --color-accent: ${tokens.colors.accent};

  /* Toast Colors */
  --color-info: ${tokens.colors.info};
  --color-success: ${tokens.colors.success};
  --color-warning: ${tokens.colors.warning};
  --color-error: ${tokens.colors.error};

  /* Typography */
  --font-family-base: ${tokens.typography.fontFamily};
  --font-family-heading: ${tokens.typography.headingFontFamily};
  --font-size-base: ${tokens.typography.baseFontSize};

  /* Heading Sizes */
  --font-size-h1: ${tokens.typography.headings.h1.fontSize};
  --font-size-h2: ${tokens.typography.headings.h2.fontSize};
  --font-size-h3: ${tokens.typography.headings.h3.fontSize};
  --font-size-h4: ${tokens.typography.headings.h4.fontSize};
  --font-size-h5: ${tokens.typography.headings.h5.fontSize};
  --font-size-h6: ${tokens.typography.headings.h6.fontSize};

  /* Button Tokens - Large */
  --btn-lg-padding-x: ${tokens.buttons.large.paddingX};
  --btn-lg-padding-y: ${tokens.buttons.large.paddingY};
  --btn-lg-min-width: ${tokens.buttons.large.minWidth};
  --btn-lg-border-radius: ${tokens.buttons.large.borderRadius};
  --btn-lg-font-size: ${tokens.typography.button.fontSize};

  /* Button Tokens - Small */
  --btn-sm-padding-x: ${tokens.buttons.small.paddingX};
  --btn-sm-padding-y: ${tokens.buttons.small.paddingY};
  --btn-sm-min-width: ${tokens.buttons.small.minWidth};
  --btn-sm-border-radius: ${tokens.buttons.small.borderRadius};
  --btn-sm-font-size: ${tokens.typography.buttonSmall.fontSize};
}

/* Base Styles */
:root {
  font-family: var(--font-family-base);
  font-size: var(--font-size-base);
  color: var(--color-text);
  background-color: var(--color-background);
}

/* Typography Classes */
.h1 {
  font-family: ${tokens.typography.headings.h1.fontFamily};
  font-size: ${tokens.typography.headings.h1.fontSize};
  font-weight: ${tokens.typography.headings.h1.fontWeight};
  line-height: ${tokens.typography.headings.h1.lineHeight};
  letter-spacing: ${tokens.typography.headings.h1.letterSpacing};
}

.h2 {
  font-family: ${tokens.typography.headings.h2.fontFamily};
  font-size: ${tokens.typography.headings.h2.fontSize};
  font-weight: ${tokens.typography.headings.h2.fontWeight};
  line-height: ${tokens.typography.headings.h2.lineHeight};
  letter-spacing: ${tokens.typography.headings.h2.letterSpacing};
}

.h3 {
  font-family: ${tokens.typography.headings.h3.fontFamily};
  font-size: ${tokens.typography.headings.h3.fontSize};
  font-weight: ${tokens.typography.headings.h3.fontWeight};
  line-height: ${tokens.typography.headings.h3.lineHeight};
  letter-spacing: ${tokens.typography.headings.h3.letterSpacing};
}

.h4 {
  font-family: ${tokens.typography.headings.h4.fontFamily};
  font-size: ${tokens.typography.headings.h4.fontSize};
  font-weight: ${tokens.typography.headings.h4.fontWeight};
  line-height: ${tokens.typography.headings.h4.lineHeight};
  letter-spacing: ${tokens.typography.headings.h4.letterSpacing};
}

.body {
  font-family: ${tokens.typography.body.fontFamily};
  font-size: ${tokens.typography.body.fontSize};
  font-weight: ${tokens.typography.body.fontWeight};
  line-height: ${tokens.typography.body.lineHeight};
  letter-spacing: ${tokens.typography.body.letterSpacing};
}

/* Button Base */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: ${tokens.typography.button.fontWeight};
  text-transform: ${tokens.buttons.large.textTransform};
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn:disabled {
  cursor: not-allowed;
  opacity: 0.4;
}

/* Button Sizes */
.btn-lg {
  padding: var(--btn-lg-padding-y) var(--btn-lg-padding-x);
  min-width: var(--btn-lg-min-width);
  font-size: var(--btn-lg-font-size);
  border-radius: var(--btn-lg-border-radius);
}

.btn-sm {
  padding: var(--btn-sm-padding-y) var(--btn-sm-padding-x);
  min-width: var(--btn-sm-min-width);
  font-size: var(--btn-sm-font-size);
  border-radius: var(--btn-sm-border-radius);
}

/* Primary Button */
.btn-primary {
  background-color: var(--color-primary);
  color: var(--color-background);
  border: none;
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(
    90deg,
    rgba(10, 18, 31, 0.2) 0%,
    rgba(10, 18, 31, 0.2) 100%
  ), var(--color-primary);
}

.btn-primary:active:not(:disabled) {
  background: linear-gradient(
    90deg,
    rgba(10, 18, 31, 0.5) 0%,
    rgba(10, 18, 31, 0.5) 100%
  ), var(--color-primary);
}

.btn-primary:disabled {
  background-color: var(--color-dark);
  color: var(--color-text);
}

/* Secondary Button */
.btn-secondary {
  background-color: transparent;
  color: var(--color-text);
  border: var(--btn-lg-border-width) solid var(--color-primary);
}

.btn-secondary.btn-sm {
  border-width: var(--btn-sm-border-width);
}

.btn-secondary:hover:not(:disabled) {
  background-color: rgba(255, 255, 255, 0.1);
}

.btn-secondary:active:not(:disabled) {
  background-color: rgba(10, 18, 31, 0.1);
  border-color: rgba(255, 255, 255, 0.4);
}

/* Tertiary Button */
.btn-tertiary {
  background-color: transparent;
  color: var(--color-text);
  border: none;
  border-bottom: var(--btn-lg-border-width) solid var(--color-text);
  padding-left: 0;
  padding-right: 0;
  min-width: auto;
}

.btn-tertiary.btn-sm {
  border-bottom-width: var(--btn-sm-border-width);
}

.btn-tertiary:hover:not(:disabled) {
  border-bottom-color: var(--color-primary);
}

.btn-tertiary:active:not(:disabled) {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}
`;

  return css;
}

export function exportToTailwindConfig(tokens: DesignTokens): string {
  return `// tailwind.config.js
export default {
  theme: {
    extend: {
      colors: {
        text: '${tokens.colors.text}',
        background: '${tokens.colors.background}',
        primary: '${tokens.colors.primary}',
        accent: '${tokens.colors.accent}',
        info: '${tokens.colors.info}',
        success: '${tokens.colors.success}',
        warning: '${tokens.colors.warning}',
        error: '${tokens.colors.error}',
      },
      fontFamily: {
        base: ['${tokens.typography.fontFamily.split(',')[0]}', 'sans-serif'],
        heading: ['${tokens.typography.headingFontFamily.split(',')[0]}', 'sans-serif'],
      },
      fontSize: {
        h1: '${tokens.typography.headings.h1.fontSize}',
        h2: '${tokens.typography.headings.h2.fontSize}',
        h3: '${tokens.typography.headings.h3.fontSize}',
        h4: '${tokens.typography.headings.h4.fontSize}',
        h5: '${tokens.typography.headings.h5.fontSize}',
        h6: '${tokens.typography.headings.h6.fontSize}',
        body: '${tokens.typography.body.fontSize}',
        button: '${tokens.typography.button.fontSize}',
        'button-sm': '${tokens.typography.buttonSmall.fontSize}',
        'btn-lg': '${tokens.typography.button.fontSize}',
        'btn-sm': '${tokens.typography.buttonSmall.fontSize}',
      },
      spacing: {
        'btn-lg-x': '${tokens.buttons.large.paddingX}',
        'btn-lg-y': '${tokens.buttons.large.paddingY}',
        'btn-sm-x': '${tokens.buttons.small.paddingX}',
        'btn-sm-y': '${tokens.buttons.small.paddingY}',
      },
      minWidth: {
        'btn-lg': '${tokens.buttons.large.minWidth}',
        'btn-sm': '${tokens.buttons.small.minWidth}',
      },
      borderWidth: {
        'btn-lg': '${tokens.buttonVariants.primary.large.borderWidth}',
        'btn-sm': '${tokens.buttonVariants.primary.small.borderWidth}',
      },
      borderRadius: {
        btn: '${tokens.buttons.large.borderRadius}',
      },
    },
  },
}`;
}

export function downloadFile(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
