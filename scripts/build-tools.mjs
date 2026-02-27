import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { cp, mkdir, rm } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');

const tools = ['audio-visualizer', 'flowstate'];

function normalizeBasePath(basePath) {
	if (!basePath || basePath === '/') {
		return '';
	}

	return `/${basePath.replace(/^\/+|\/+$/g, '')}`;
}

function run(command, args, options = {}) {
	return new Promise((resolve, reject) => {
		const child = spawn(command, args, {
			cwd: options.cwd,
			env: options.env,
			stdio: 'inherit',
			shell: true
		});

		child.on('error', reject);
		child.on('close', (code) => {
			if (code === 0) {
				resolve();
				return;
			}

			reject(
				new Error(
					`Command failed (${code}): ${command} ${args.join(' ')}`
				)
			);
		});
	});
}

async function buildTool(toolName, basePath) {
	const toolDir = path.join(repoRoot, toolName);
	const toolBuildDir = path.join(toolDir, 'build');
	const targetDir = path.join(repoRoot, 'static', 'tools', toolName, 'app');
	const adapterStaticPkg = path.join(
		toolDir,
		'node_modules',
		'@sveltejs',
		'adapter-static',
		'package.json'
	);
	const scopedBasePath = `${basePath}/tools/${toolName}/app`.replace(/\/+/g, '/');

	if (!existsSync(path.join(toolDir, 'node_modules'))) {
		console.log(`[tools] Installing dependencies for ${toolName}...`);
		await run('npm', ['ci'], { cwd: toolDir, env: process.env });
	}

	if (!existsSync(adapterStaticPkg)) {
		console.log(`[tools] Installing @sveltejs/adapter-static for ${toolName}...`);
		await run('npm', ['install', '--no-save', '-D', '@sveltejs/adapter-static'], {
			cwd: toolDir,
			env: process.env
		});
	}

	console.log(`[tools] Building ${toolName} (BASE_PATH='${scopedBasePath}')...`);
	// Use the tool's local vite binary to avoid npm/npx resolution issues
	const viteBin = path.join(toolDir, 'node_modules', '.bin', 'vite');
	await run(viteBin, ['build'], {
		cwd: toolDir,
		env: {
			...process.env,
			BASE_PATH: scopedBasePath
		}
	});

	await rm(targetDir, { recursive: true, force: true });
	await mkdir(path.dirname(targetDir), { recursive: true });
	await cp(toolBuildDir, targetDir, { recursive: true });
	console.log(`[tools] Copied ${toolName} build output to static/tools/${toolName}/app`);
}

async function main() {
	const basePath = normalizeBasePath(process.env.SITE_BASE_PATH || process.env.BASE_PATH || '');
	const legacyStaticToolsDir = path.join(repoRoot, 'static', 'tools');

	// Cleanup legacy output location so stale files cannot shadow /tools routes.
	await rm(legacyStaticToolsDir, { recursive: true, force: true });

	for (const toolName of tools) {
		await buildTool(toolName, basePath);
	}
}

main().catch((error) => {
	console.error('[tools] Build failed');
	console.error(error);
	process.exit(1);
});
