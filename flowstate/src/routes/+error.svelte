<script lang="ts">
    import { base } from "$app/paths";
    import { page } from "$app/state";
</script>

<div
    class="min-h-screen bg-[#0A121F] flex flex-col items-center justify-center p-8"
>
    <div class="text-center max-w-lg">
        <img
            src="https://http.cat/{page.status}"
            alt="HTTP {page.status}"
            class="w-full max-w-md mx-auto rounded-lg shadow-2xl mb-8"
        />
        <a
            href={`${base}/`}
            class="inline-block px-6 py-3 bg-white/10 text-white hover:bg-white/20 transition-colors"
        >
            Home
        </a>
    </div>
</div>
