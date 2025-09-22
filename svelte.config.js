import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const basePath = process.env.BASE_PATH || '';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter({
			// Use explicit defaults and keep SPA fallback for GitHub Pages deep links
			pages: 'build',
			assets: 'build',
			fallback: '200.html',
			precompress: false,
			strict: true
		}),
		paths: {
			base: basePath
		},
		prerender: {
			// Avoid build failures if the crawler hits asset URLs (e.g., favicons)
			handleHttpError: ({ path, status }) => {
				if (
					path.startsWith('/favicon/') ||
					path.endsWith('.png') ||
					path.endsWith('.svg') ||
					path.endsWith('.ico') ||
					path.endsWith('.webmanifest') ||
					status === 404
				) {
					return;
				}
				// Re-throw other errors to surface real issues
				throw new Error(`Prerender error at ${path} (status ${status})`);
			}
		}
	}
};

export default config;
