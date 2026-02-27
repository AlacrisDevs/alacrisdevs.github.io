<!-- src/lib/components/PerformanceMonitor.svelte -->
<script lang="ts">
    import { usePerformanceMonitoring } from '../utils/performance';

    let { getMetrics, getAverageDuration, clearMetrics } = usePerformanceMonitoring();
    let isVisible = $state(false);
    let selectedOperation = $state<string>('');

    // Only show in development
    const isDev = import.meta.env.DEV;

    if (!isDev) {
        // Component renders nothing in production
        // Performance monitoring is still active but UI is hidden
    }

    function formatDuration(ms: number): string {
        return `${ms.toFixed(2)}ms`;
    }

    function getOperationMetrics(operation: string) {
        return getMetrics().filter(m => m.operation === operation);
    }
</script>

{#if isDev}
    <div class="performance-monitor fixed bottom-4 right-4 z-50">
        <button
            onclick={() => isVisible = !isVisible}
            class="bg-gray-800 text-white px-3 py-2 rounded-lg text-sm hover:bg-gray-700 transition-colors"
            title="Performance Monitor (Dev Only)"
        >
            📊
        </button>

        {#if isVisible}
            <div class="absolute bottom-full right-0 mb-2 bg-white border border-gray-300 rounded-lg shadow-lg p-4 min-w-80 max-h-96 overflow-auto">
                <div class="flex justify-between items-center mb-3">
                    <h3 class="font-semibold text-gray-800">Performance Monitor</h3>
                    <button
                        onclick={clearMetrics}
                        class="text-xs text-gray-500 hover:text-gray-700"
                    >
                        Clear
                    </button>
                </div>

                <div class="space-y-3">
                    <!-- Operation selector -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            Operation
                        </label>
                        <select
                            bind:value={selectedOperation}
                            class="w-full text-sm border border-gray-300 rounded px-2 py-1"
                        >
                            <option value="">All Operations</option>
                            {#each [...new Set(getMetrics().map(m => m.operation))].sort() as operation}
                                <option value={operation}>{operation}</option>
                            {/each}
                        </select>
                    </div>

                    <!-- Metrics display -->
                    <div class="space-y-2">
                        {#if selectedOperation}
                            {@const operationMetrics = getOperationMetrics(selectedOperation)}
                            {@const avgDuration = getAverageDuration(selectedOperation)}
                            <div class="bg-gray-50 p-3 rounded">
                                <div class="font-medium text-gray-800 mb-1">
                                    {selectedOperation}
                                </div>
                                <div class="text-sm text-gray-600 space-y-1">
                                    <div>Total calls: {operationMetrics.length}</div>
                                    <div>Average duration: {formatDuration(avgDuration)}</div>
                                    <div>Last call: {operationMetrics.length > 0 ? formatDuration(operationMetrics[operationMetrics.length - 1].duration || 0) : 'N/A'}</div>
                                </div>
                            </div>
                        {:else}
                            {@const operations = [...new Set(getMetrics().map(m => m.operation))]}
                            {#each operations.sort() as operation}
                                {@const avgDuration = getAverageDuration(operation)}
                                {@const count = getOperationMetrics(operation).length}
                                <div class="flex justify-between items-center py-1 border-b border-gray-100 last:border-b-0">
                                    <span class="text-sm text-gray-700">{operation}</span>
                                    <div class="text-right text-xs text-gray-500">
                                        <div>{count} calls</div>
                                        <div>{formatDuration(avgDuration)}</div>
                                    </div>
                                </div>
                            {/each}
                        {/if}
                    </div>

                    {#if getMetrics().length === 0}
                        <div class="text-center text-gray-500 text-sm py-4">
                            No performance metrics recorded yet
                        </div>
                    {/if}
                </div>
            </div>
        {/if}
    </div>
{/if}

<style>
    .performance-monitor {
        font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
</style>