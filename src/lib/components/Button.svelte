<script lang="ts">
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    export let variant: "primary" | "secondary" | "tertiary" = "primary";
    export let disabled: boolean = false;
    export let type: "button" | "submit" | "reset" = "button";
    export let href: string | undefined = undefined;
    export let target: string | undefined = undefined;

    let isPressed = false;

    function handleClick(event: MouseEvent) {
        if (disabled) {
            event.preventDefault();
            return;
        }
        dispatch("click", event);
    }

    function handleMouseDown() {
        if (!disabled) {
            isPressed = true;
        }
    }

    function handleMouseUp() {
        isPressed = false;
    }

    function handleMouseLeave() {
        isPressed = false;
    }

    // Convert text to title case
    function toTitleCase(text: string): string {
        return text.replace(
            /\w\S*/g,
            (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(),
        );
    }

    // Get button classes based on variant and state
    function getButtonClasses(): string {
        const baseClasses =
            "inline-flex items-center justify-center px-6 py-3 rounded font-urbanist font-semibold text-button transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-tertiary focus:ring-offset-2 focus:ring-offset-secondary focus-visible:outline-none box-border";

        switch (variant) {
            case "primary":
                return `${baseClasses} btn-primary text-white`;

            case "secondary":
                return `${baseClasses} btn-secondary`;

            case "tertiary":
                return `${baseClasses} btn-tertiary`;

            default:
                return baseClasses;
        }
    }
</script>

{#if href}
    <a
        {href}
        {target}
        class={getButtonClasses()}
        class:pointer-events-none={disabled}
        on:click={handleClick}
        on:mousedown={handleMouseDown}
        on:mouseup={handleMouseUp}
        on:mouseleave={handleMouseLeave}
    >
        <span
            class="relative z-10"
            class:text-underline={variant === "tertiary"}
        >
            <slot />
        </span>
    </a>
{:else}
    <button
        {type}
        class={getButtonClasses()}
        {disabled}
        on:click={handleClick}
        on:mousedown={handleMouseDown}
        on:mouseup={handleMouseUp}
        on:mouseleave={handleMouseLeave}
    >
        <span
            class="relative z-10"
            class:text-underline={variant === "tertiary"}
        >
            <slot />
        </span>
    </button>
{/if}
