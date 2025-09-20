<script lang="ts">
    export let imageSrc: string;
    export let imageAlt: string = "";
    export let title: string;
    export let description: string;
    export let href: string | undefined = undefined;
    export let target: string | undefined = undefined;

    function handleClick(event: MouseEvent) {
        if (href) {
            // Let the browser handle the navigation
            return;
        }
        // If no href, prevent default and dispatch click event
        event.preventDefault();
    }

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            if (href) {
                // Let the browser handle the navigation
                return;
            }
        }
    }
</script>

{#if href}
    <a {href} {target} class="card-container" on:click={handleClick}>
        <div class="card-image">
            <img src={imageSrc} alt={imageAlt} />
        </div>
        <div class="card-text-container">
            <div class="card-title-container">
                <h4 class="h4">{title}</h4>
            </div>
            <p class="p card-description">{description}</p>
        </div>
    </a>
{:else}
    <div
        class="card-container"
        role="button"
        tabindex="0"
        on:click={handleClick}
        on:keydown={handleKeydown}
    >
        <div class="card-image">
            <img src={imageSrc} alt={imageAlt} />
        </div>
        <div class="card-text-container">
            <div class="card-title-container">
                <h4 class="h4">{title}</h4>
            </div>
            <p class="p card-description">{description}</p>
        </div>
    </div>
{/if}
