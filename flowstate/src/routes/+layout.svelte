<script lang="ts">
	import { page } from "$app/state";
	import { locales, localizeHref } from "$lib/paraglide/runtime";
	import "./layout.css";
	import favicon from "$lib/assets/favicon.svg";
	import ToastContainer from "$lib/components/ToastContainer.svelte";
	import LoadingScreen from "$lib/components/LoadingScreen.svelte";
	import { designTokens } from "$lib/stores/designTokens.svelte";

	let { children } = $props();
	const isDark = $derived(designTokens.tokens.themeMode === "dark");

	$effect(() => {
		if (typeof document !== "undefined") {
			document.documentElement.classList.toggle("dark", isDark);
		}
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<LoadingScreen />
{@render children()}
<ToastContainer />
<div style="display:none">
	{#each locales as locale}
		<a href={localizeHref(page.url.pathname, { locale })}>
			{locale}
		</a>
	{/each}
</div>
