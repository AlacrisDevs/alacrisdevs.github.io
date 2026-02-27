# Sidebar Design System

## Overview
This document outlines the design system used for sidebar components in the FlowState application. The sidebar uses a consistent spacing, typography, and color system to ensure a cohesive user experience.

## Layout Hierarchy

### Spacing Scale
- **Section Spacing**: `space-y-6` (24px) - Used between major sections
- **Subsection Spacing**: `space-y-3` (12px) - Used between subsections within a section
- **Tight Spacing**: `space-y-2` (8px) - Used for closely related elements

### Typography Hierarchy
- **Section Labels**: `text-[14px] mb-2` with 40% opacity - Used for section headers
- **Column Headers**: `text-[14px]` with 30% opacity - Used for table column labels
- **Primary Text**: `text-[14px]` with 70% opacity - Used for main content and labels
- **Secondary Text**: `text-[14px]` with 30% opacity - Used for helper text and descriptions

## Color System

### Theme-Aware Colors
All sidebar components use dynamic colors based on the current theme mode (`isDark`):

#### Light Mode
- Background: Various shades of white/gray
- Text Primary: `text-black/70`
- Text Secondary: `text-black/40` (labels), `text-black/30` (column headers)
- Interactive Elements: `bg-black/5` to `bg-black/15` with hover states

#### Dark Mode
- Background: Various shades of dark blue/gray (`#0A121F`, `#0D1929`)
- Text Primary: `text-white/70`
- Text Secondary: `text-white/40` (labels), `text-white/30` (column headers)
- Interactive Elements: `bg-white/5` to `bg-white/15` with hover states

## Component Patterns

### Buttons

#### Primary Buttons (Selected State)
```css
/* Light Mode */
bg-black/15 text-black

/* Dark Mode */
bg-white/15 text-white
```

#### Secondary Buttons (Default State)
```css
/* Light Mode */
bg-black/5 text-black/70 hover:bg-black/10

/* Dark Mode */
bg-white/5 text-white/70 hover:bg-white/10
```

#### Tertiary Buttons (Inactive/Destructive)
```css
/* Light Mode */
bg-black/5 text-black/40 hover:bg-black/10

/* Dark Mode */
bg-white/5 text-white/40 hover:bg-white/10
```

### Layout Components

#### Flex Rows
- **Standard Gap**: `flex gap-2` - Used for form rows and component groups
- **Tight Gap**: `flex gap-1` - Used for button groups and selectors

#### Grid Layouts
- **2-Column Grid**: `grid grid-cols-2 gap-2` - Used for paired inputs and settings
- **3-Column Grid**: `grid grid-cols-3 gap-2` - Used for complex controls (position, width, style)

### Form Elements

#### Input Fields
- **Base Styling**: `w-full h-8 px-3 text-[14px] focus:outline-none`
- **Background**: Theme-aware with 5% opacity and focus states at 10% opacity

#### Select Fields
- **Consistent sizing** with input fields
- **Theme-aware styling** matching other form elements

### Icon Buttons
- **Delete Buttons**: `w-8 h-8 shrink-0 flex items-center justify-center hover:text-red-400 hover:bg-red-500/10`
- **Material Icons**: `text-[16px]` for consistent icon sizing

## CSS Classes (@apply Directives)

The following reusable CSS classes are available in `src/routes/layout.css`:

### Layout Classes
- `.sidebar-section-spacing` - `space-y-6`
- `.sidebar-subsection-spacing` - `space-y-3`
- `.sidebar-tight-spacing` - `space-y-2`

### Typography Classes
- `.sidebar-label` - `text-[14px] mb-2`
- `.sidebar-label-light` - `text-white/40`
- `.sidebar-label-dark` - `text-black/40`
- `.sidebar-text-primary-light` - `text-white/70`
- `.sidebar-text-primary-dark` - `text-black/70`
- `.sidebar-text-secondary-light` - `text-white/30`
- `.sidebar-text-secondary-dark` - `text-black/30`

### Button Classes
- `.sidebar-button-base` - `py-2 text-[14px]`
- `.sidebar-button-primary-light` - `bg-white/15 text-white`
- `.sidebar-button-primary-dark` - `bg-black/15 text-black`
- `.sidebar-button-secondary-light` - `bg-white/5 text-white/70 hover:bg-white/10`
- `.sidebar-button-secondary-dark` - `bg-black/5 text-black/70 hover:bg-black/10`

### Layout Classes
- `.sidebar-flex-row` - `flex gap-2`
- `.sidebar-flex-row-tight` - `flex gap-1`
- `.sidebar-grid-2` - `grid grid-cols-2 gap-2`
- `.sidebar-grid-3` - `grid grid-cols-3 gap-2`
- `.sidebar-column-headers` - `flex items-center gap-2 mb-1`

### Form Classes
- `.sidebar-input-base` - `w-full h-8 px-3 text-[14px] focus:outline-none`
- `.sidebar-input-light` - `bg-white/5 text-white placeholder:text-white/30 focus:bg-white/10`
- `.sidebar-input-dark` - `bg-black/5 text-black placeholder:text-black/30 focus:bg-black/10`

### Utility Classes
- `.sidebar-delete-button` - `w-8 h-8 shrink-0 flex items-center justify-center hover:text-red-400 hover:bg-red-500/10`
- `.sidebar-width-fixed-small` - `w-8 shrink-0`
- `.sidebar-width-fixed-medium` - `w-10 shrink-0`
- `.sidebar-width-flex` - `flex-1`
- `.sidebar-width-flex-min` - `flex-1 min-w-0`

## Usage Guidelines

### When to Use Each Spacing Level
- **section-spacing**: Between major functional areas (Colors, Typography, Buttons, etc.)
- **subsection-spacing**: Between related controls within a section (Fonts, Headings, Button variants)
- **tight-spacing**: For lists of similar items (color pickers, checkbox groups)

### Color Usage
- Always use theme-aware classes that check `isDark`
- Primary colors (70% opacity) for important labels and active states
- Secondary colors (40%/30% opacity) for labels and helper text
- Maintain contrast ratios for accessibility (AAA for primary text, AA for secondary)

### Button States
- **Primary**: Currently selected/active states
- **Secondary**: Default interactive states
- **Tertiary**: Inactive states or destructive actions

## Implementation Notes

### Theme Detection
All components use the `isDark` derived state:
```typescript
const isDark = $derived(tokens.themeMode === "dark");
```

### Responsive Design
- Sidebar components are designed for desktop use
- Fixed widths and heights ensure consistent layout
- Text sizes use pixel values for precise control

### Accessibility
- Color contrast meets WCAG guidelines
- Focus states are clearly visible
- Interactive elements have appropriate hover states
- Semantic HTML structure maintained

## Maintenance

When adding new sidebar components:
1. Use existing @apply classes for consistency
2. Follow the established spacing hierarchy
3. Implement theme-aware colors using the `isDark` pattern
4. Test in both light and dark modes
5. Update this documentation if new patterns are established