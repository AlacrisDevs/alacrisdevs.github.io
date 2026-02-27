<script lang="ts">
    import { designTokens } from "../stores/designTokens.svelte";
    import { getContrastingTextColor } from "../utils/colorUtils";
    import * as m from "$lib/paraglide/messages/_index.js";

    type ToastVariant = "success" | "warning" | "info" | "error";

    interface Props {
        variant?: ToastVariant;
        title?: string;
        message?: string;
        onclose?: () => void;
        showHeading?: boolean;
    }

    let {
        variant = "success",
        title = "",
        message = "",
        onclose,
        showHeading,
    }: Props = $props();

    const tokens = $derived(designTokens.tokens);
    const shouldShowHeading = $derived(
        showHeading ?? tokens.enableToastHeadings,
    );

    const variantConfig = $derived.by(() => {
        switch (variant) {
            case "success":
                return {
                    bg: tokens.colors.success,
                    title: title || m.toast_success_title(),
                    message: message || m.toast_success_message(),
                    icon: "check_circle",
                };
            case "warning":
                return {
                    bg: tokens.colors.warning,
                    title: title || m.toast_warning_title(),
                    message: message || m.toast_warning_message(),
                    icon: "warning",
                };
            case "info":
                return {
                    bg: tokens.colors.info,
                    title: title || m.toast_info_title(),
                    message: message || m.toast_info_message(),
                    icon: "info",
                };
            case "error":
                return {
                    bg: tokens.colors.error,
                    title: title || m.toast_error_title(),
                    message: message || m.toast_error_message(),
                    icon: "error",
                };
        }
    });

    const textColor = $derived(
        getContrastingTextColor(variantConfig.bg, "#FFFFFF", "#0A121F"),
    );
</script>

<div
    class="flex gap-4 items-start p-4 w-full max-w-[512px]"
    style="background-color: {variantConfig.bg}; color: {textColor}"
>
    <span class="material-icons shrink-0" style="font-size: 28px;">
        {variantConfig.icon}
    </span>
    <div class="flex-1 flex flex-col {shouldShowHeading ? 'gap-1' : ''}">
        {#if shouldShowHeading}
            <p
                class="text-lg font-bold uppercase"
                style="font-family: {tokens.typography.headingFontFamily}"
            >
                {variantConfig.title}
            </p>
        {/if}
        <p
            class="text-base font-medium"
            style="font-family: {tokens.typography.fontFamily}"
        >
            {variantConfig.message}
        </p>
    </div>
    {#if onclose}
        <button
            class="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
            onclick={onclose}
        >
            <span class="material-icons" style="font-size: 20px;">close</span>
        </button>
    {/if}
</div>
