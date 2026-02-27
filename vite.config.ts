import { paraglideVitePlugin } from '@inlang/paraglide-js';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, type PluginOption } from 'vite';

const toolAppRoots = new Set(['/tools/audio-visualizer/app/', '/tools/flowstate/app/']);

function toolsAppIndexRewritePlugin(): PluginOption {
	return {
		name: 'tools-app-index-rewrite',
		configureServer(server) {
			server.middlewares.use((req, _res, next) => {
				const request = req as { url?: string };

				if (!request.url) {
					next();
					return;
				}

				const [pathname, query] = request.url.split('?');
				if (toolAppRoots.has(pathname)) {
					request.url = `${pathname}index.html${query ? `?${query}` : ''}`;
				}

				next();
			});
		}
	};
}

export default defineConfig({
	plugins: [
		toolsAppIndexRewritePlugin(),
		tailwindcss(),
		sveltekit(),
		paraglideVitePlugin({
			project: './project.inlang',
			outdir: './src/lib/paraglide'
		})
	]
});
