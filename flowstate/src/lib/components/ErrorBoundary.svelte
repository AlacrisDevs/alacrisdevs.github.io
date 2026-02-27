<!-- src/lib/components/ErrorBoundary.svelte -->
<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { toastStore } from '../stores/toastStore.svelte';
    import { reportError } from '../utils/errorReporting';

    interface Props {
        onError?: (error: Error) => void;
        children?: any;
    }

    let { onError: onErrorCallback, children }: Props = $props();
    let hasError = $state(false);
    let error = $state<Error | null>(null);
    let errorContainer: HTMLElement;

    function resetError() {
        hasError = false;
        error = null;
    }

    // Set up error boundary using DOM error events
    onMount(() => {
        const handleError = (event: ErrorEvent) => {
            // Prevent default error handling
            event.preventDefault();

            hasError = true;
            const err = event.error || new Error(event.message);
            error = err;

            // Report error for tracking
            reportError(err, {
                type: 'javascript_error',
                source: 'error_boundary'
            });

            // Show user-friendly error message
            toastStore.error('Something went wrong. Please try again.');

            // Call custom error handler if provided
            if (onErrorCallback) {
                onErrorCallback(err);
            }
        };

        const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
            // Prevent default unhandled promise rejection handling
            event.preventDefault();

            hasError = true;
            const reason = event.reason;
            error = reason instanceof Error ? reason : new Error(String(reason));

            // Report error for tracking
            reportError(error, {
                type: 'unhandled_promise_rejection',
                source: 'error_boundary',
                originalReason: reason
            });

            // Show user-friendly error message
            toastStore.error('Something went wrong. Please try again.');

            // Call custom error handler if provided
            if (onErrorCallback) {
                onErrorCallback(error);
            }
        };

        // Add error event listeners
        window.addEventListener('error', handleError);
        window.addEventListener('unhandledrejection', handleUnhandledRejection);

        // Cleanup function
        onDestroy(() => {
            window.removeEventListener('error', handleError);
            window.removeEventListener('unhandledrejection', handleUnhandledRejection);
        });
    });

    // Expose a method to manually trigger error state
    export function triggerError(err: Error) {
        hasError = true;
        error = err;
        console.error('Error manually triggered by boundary:', err);

        // Show user-friendly error message
        toastStore.error('Something went wrong. Please try again.');

            // Call custom error handler if provided
            if (onErrorCallback && error) {
                onErrorCallback(error);
            }
    }
</script>

{#if hasError}
    <div class="error-boundary p-4 border border-red-500 bg-red-50 rounded" bind:this={errorContainer}>
        <h3 class="text-red-800 font-semibold">Something went wrong</h3>
        <p class="text-red-600 text-sm mt-1">
            An unexpected error occurred. Please refresh the page or try again.
        </p>
        {#if import.meta.env.DEV}
            <details class="mt-2">
                <summary class="text-red-700 cursor-pointer">Error details (dev only)</summary>
                <pre class="text-xs mt-1 p-2 bg-red-100 rounded overflow-auto">{error?.stack || error?.message}</pre>
            </details>
        {/if}
        <button
            class="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
            onclick={resetError}
        >
            Try Again
        </button>
    </div>
{:else}
    <slot />
{/if}