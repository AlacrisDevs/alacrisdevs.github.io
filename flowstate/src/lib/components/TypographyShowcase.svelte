<script lang="ts">
    import { designTokens } from "../stores/designTokens.svelte";
    import * as m from "$lib/paraglide/messages/_index.js";

    const tokens = $derived(designTokens.tokens);
    const textColor = $derived(
        tokens.colorVariables.find((v) => v.id === "text")?.value || "#000000",
    );

    const typographyStyles = $derived([
        { key: "h1", style: tokens.typography.headings.h1 },
        { key: "h2", style: tokens.typography.headings.h2 },
        { key: "h3", style: tokens.typography.headings.h3 },
        { key: "h4", style: tokens.typography.headings.h4 },
        { key: "h5", style: tokens.typography.headings.h5 },
        { key: "h6", style: tokens.typography.headings.h6 },
        { key: "p", style: tokens.typography.body },
        { key: "p-sm", style: tokens.typography.bodySmall },
        ...(tokens.enableButtons
            ? [
                  { key: "btn-sm", style: tokens.typography.buttonSmall },
                  { key: "btn-md", style: tokens.typography.button },
                  { key: "btn-lg", style: tokens.typography.buttonLarge },
              ]
            : []),
    ]);

    function getFontName(fontFamily: string) {
        return fontFamily.split(",")[0].trim();
    }

    const accentColor = $derived(
        tokens.colorVariables.find((v) => v.id === "accent")?.value ||
            "#FFAB00",
    );
    const warningColor = $derived(
        tokens.colorVariables.find((v) => v.id === "warning")?.value ||
            "#FFAB00",
    );
    const successColor = $derived(
        tokens.colorVariables.find((v) => v.id === "success")?.value ||
            "#00C853",
    );

    const textFormattingElements = $derived([
        { tag: "a", label: m.link_text() },
        { tag: "b", label: m.bold_text() },
        { tag: "strong", label: m.strong_text() },
        { tag: "i", label: m.italic_text() },
        { tag: "em", label: m.emphasized_text() },
        { tag: "mark", label: m.marked_text() },
        { tag: "small", label: m.small_text() },
        { tag: "del", label: m.deleted_text() },
        { tag: "ins", label: m.inserted_text() },
        { tag: "sub", label: m.subscript_text() },
        { tag: "sup", label: m.superscript_text() },
    ]);
</script>

<div
    class="typography-showcase"
    style="color: {textColor}; font-family: {tokens.typography.fontFamily}"
>
    <h2
        class="mb-4"
        style="font-family: {tokens.typography.headings.h3
            .fontFamily}; font-size: {tokens.typography.headings.h3
            .fontSize}; font-weight: {tokens.typography.headings.h3
            .fontWeight}; color: {textColor}"
    >
        {m.typography()}
    </h2>

    <!-- Header row -->
    <div
        class="flex flex-wrap items-center gap-x-4 gap-y-1 py-2 mb-1"
        style="border-bottom: 1px solid {textColor}20"
    >
        <div class="w-20 shrink-0">
            <span
                class="uppercase"
                style="font-family: {tokens.typography.body
                    .fontFamily}; font-size: {tokens.typography.body
                    .fontSize}; font-weight: 600; color: {textColor}; opacity: 0.5"
                >{m.type_column()}</span
            >
        </div>
        <div class="w-28 shrink-0">
            <span
                style="font-family: {tokens.typography.body
                    .fontFamily}; font-size: {tokens.typography.body
                    .fontSize}; font-weight: 600; color: {textColor}; opacity: 0.5"
                >{m.size_weight_column()}</span
            >
        </div>
        <div class="flex-1 min-w-0">
            <span
                style="font-family: {tokens.typography.body
                    .fontFamily}; font-size: {tokens.typography.body
                    .fontSize}; font-weight: 600; color: {textColor}; opacity: 0.5"
                >{m.sample_column()}</span
            >
        </div>
        <div class="w-full sm:w-auto">
            <span
                style="font-family: {tokens.typography.body
                    .fontFamily}; font-size: {tokens.typography.body
                    .fontSize}; font-weight: 600; color: {textColor}; opacity: 0.5"
                >{m.font_column()}</span
            >
        </div>
    </div>

    <div class="space-y-2">
        {#each typographyStyles as item}
            <div
                class="flex flex-wrap items-center gap-x-4 gap-y-1 py-2"
                style="border-bottom: 1px solid {textColor}10"
            >
                <div class="w-20 shrink-0">
                    <span
                        class="uppercase"
                        style="font-family: {tokens.typography.body
                            .fontFamily}; font-size: {tokens.typography.body
                            .fontSize}; font-weight: 500; color: {textColor}; opacity: 0.6"
                        >{item.key}</span
                    >
                </div>
                <div class="w-28 shrink-0">
                    <span
                        style="font-family: {tokens.typography.body
                            .fontFamily}; font-size: {tokens.typography.body
                            .fontSize}; color: {textColor}; opacity: 0.7"
                        >{item.style.fontSize} / {item.style.fontWeight}</span
                    >
                </div>
                <div class="flex-1 min-w-0 overflow-hidden">
                    <span
                        class="block truncate"
                        style="font-family: {item.style
                            .fontFamily}; font-size: {item.style
                            .fontSize}; font-weight: {item.style
                            .fontWeight}; text-transform: {item.style
                            .textTransform}; color: {textColor}; line-height: 1.3;"
                    >
                        {m.lorem_ipsum()}
                    </span>
                </div>
                <div class="w-full sm:w-auto">
                    <span
                        style="font-family: {tokens.typography.body
                            .fontFamily}; font-size: {tokens.typography.body
                            .fontSize}; color: {textColor}; opacity: 0.5"
                        >{getFontName(item.style.fontFamily)}</span
                    >
                </div>
            </div>
        {/each}
    </div>

    <h3
        class="mt-6 mb-3"
        style="font-family: {tokens.typography.headings.h4
            .fontFamily}; font-size: {tokens.typography.headings.h4
            .fontSize}; font-weight: {tokens.typography.headings.h4
            .fontWeight}; color: {textColor}"
    >
        {m.text_formatting()}
    </h3>

    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {#each textFormattingElements as element}
            <div
                class="p-3 rounded"
                style="background-color: {textColor}08; border: 1px solid {textColor}10"
            >
                <div
                    class="mb-1"
                    style="font-family: {tokens.typography.body
                        .fontFamily}; font-size: {tokens.typography.body
                        .fontSize}; color: {textColor}; opacity: 0.5"
                >
                    &lt;{element.tag}&gt;
                </div>
                <div
                    style="font-family: {tokens.typography.body
                        .fontFamily}; font-size: {tokens.typography.body
                        .fontSize}; color: {textColor}"
                >
                    {#if element.tag === "a"}
                        <span
                            role="link"
                            tabindex="0"
                            style="color: {accentColor}; text-decoration: underline; cursor: pointer"
                            >{element.label}</span
                        >
                    {:else if element.tag === "b"}
                        <b>{element.label}</b>
                    {:else if element.tag === "strong"}
                        <strong>{element.label}</strong>
                    {:else if element.tag === "i"}
                        <i>{element.label}</i>
                    {:else if element.tag === "em"}
                        <em>{element.label}</em>
                    {:else if element.tag === "mark"}
                        <mark
                            style="background-color: {warningColor}40; color: {textColor}; padding: 0 0.25em; border-radius: 2px"
                            >{element.label}</mark
                        >
                    {:else if element.tag === "small"}
                        <small>{element.label}</small>
                    {:else if element.tag === "del"}
                        <del>{element.label}</del>
                    {:else if element.tag === "ins"}
                        <ins
                            style="text-decoration: underline; color: {successColor}"
                            >{element.label}</ins
                        >
                    {:else if element.tag === "sub"}
                        Text<sub>{element.label}</sub>
                    {:else if element.tag === "sup"}
                        Text<sup>{element.label}</sup>
                    {/if}
                </div>
            </div>
        {/each}
    </div>
</div>
