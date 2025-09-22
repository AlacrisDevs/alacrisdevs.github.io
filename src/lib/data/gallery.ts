// Gallery metadata types
export type GalleryMeta = {
    title?: string;
    description?: string;
};

// Metadata grouped by date (YYYYMMDD) and variant number
// Used by locale-specific files (gallery.en.ts, gallery.et.ts)
export type GalleryMetaByDate = Record<string, Record<number, GalleryMeta>>;
