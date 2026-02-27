// Font management store
export interface LoadedFont {
    family: string;
    source: 'google' | 'local' | 'system';
    variants: string[];
    url?: string;
}

// System/HTML default fonts
export const systemFonts = [
    'system-ui',
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Arial',
    'Helvetica',
    'sans-serif',
    'serif',
    'monospace',
    'Georgia',
    'Times New Roman',
    'Courier New',
    'Verdana',
    'Trebuchet MS',
    'Tahoma',
];

class FontStore {
    loadedFonts = $state<LoadedFont[]>([
        { family: 'system-ui', source: 'system', variants: ['400', '700'] }
    ]);

    googleFontsLoaded = $state<string[]>([]);

    async loadGoogleFont(family: string, variants: string[] = ['400', '700']) {
        if (this.googleFontsLoaded.includes(family)) return;

        const variantsStr = variants.join(';');
        const url = `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, '+')}:wght@${variantsStr}&display=swap`;

        const link = document.createElement('link');
        link.href = url;
        link.rel = 'stylesheet';
        document.head.appendChild(link);

        this.googleFontsLoaded.push(family);
        this.loadedFonts.push({
            family,
            source: 'google',
            variants,
            url
        });
    }

    async loadLocalFont(file: File): Promise<string | null> {
        try {
            const fontName = file.name.replace(/\.[^/.]+$/, '');
            const arrayBuffer = await file.arrayBuffer();
            const fontFace = new FontFace(fontName, arrayBuffer);
            await fontFace.load();
            document.fonts.add(fontFace);

            this.loadedFonts.push({
                family: fontName,
                source: 'local',
                variants: ['400']
            });

            return fontName;
        } catch (error) {
            console.error('Failed to load local font:', error);
            return null;
        }
    }

    getFontFamilies(): string[] {
        return this.loadedFonts.map(f => f.family);
    }
}

export const fontStore = new FontStore();

// Top 20 most popular Google Fonts
export const popularGoogleFonts = [
    'Roboto',
    'Open Sans',
    'Lato',
    'Montserrat',
    'Poppins',
    'Inter',
    'Roboto Condensed',
    'Oswald',
    'Raleway',
    'Nunito',
    'Roboto Mono',
    'Playfair Display',
    'Ubuntu',
    'Merriweather',
    'PT Sans',
    'Rubik',
    'Work Sans',
    'Fira Sans',
    'Quicksand',
    'DM Sans',
];

// Search Google Fonts API
export async function searchGoogleFonts(query: string): Promise<string[]> {
    if (!query || query.length < 2) return [];

    const apiKey = import.meta.env.VITE_GOOGLE_FONTS_API_KEY;

    if (!apiKey) {
        console.warn('Google Fonts API key not configured. Add VITE_GOOGLE_FONTS_API_KEY to your .env file.');
        return [query];
    }

    try {
        const response = await fetch(
            `https://www.googleapis.com/webfonts/v1/webfonts?key=${apiKey}&sort=popularity`
        );

        if (!response.ok) {
            // Fallback: just try to load the font directly
            return [query];
        }

        const data = await response.json();
        const fonts: string[] = data.items?.map((item: { family: string }) => item.family) || [];

        // Filter by search query
        const lowerQuery = query.toLowerCase();
        return fonts
            .filter((font: string) => font.toLowerCase().includes(lowerQuery))
            .slice(0, 20);
    } catch {
        // If API fails, return the query as-is so user can still try to load it
        return [query];
    }
}
