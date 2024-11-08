<script setup lang="ts">
import Button from './Button.vue';

function scrollToId(id: string): void {
    const element = document.getElementById(id);

    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest'
        });
    } else {
        console.warn(`Element with id "${id}" not found.`);
    }
}

</script>

<template>
    <div class="w-full px-16 py-4 bg-dark shadow justify-between items-center inline-flex">
        <div class="self-stretch justify-start items-center gap-8 flex">
            <div class="w-[42px] h-[42px]">
                <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g id="Logo">
                        <path id="path15"
                            d="M42 0L27.3 7.34997L32.2721 17.2941L42 13.125V0ZM10.5 15.75L0 21L6.29998 24.15L10.5 15.75ZM36.9886 26.7273L42 36.75V28.875L36.9886 26.7273Z"
                            fill="#006CFF" />
                        <path id="path1" d="M21 0L0 42H13.125L21 23.625L28.875 42H42L21 0Z" fill="#E9F2FF" />
                    </g>
                </svg>
            </div>
            <h1>AlacrisDevs</h1>
        </div>
        <div class="self-stretch justify-start items-center gap-8 flex">
            <Button button-text="Who am I?" @click="scrollToId('who-am-i')" />
            <Button button-text="Projects" @click="scrollToId('projects')" />
            <Button button-text="Gallery" @click="scrollToId('gallery')" />
            <Button button-text="Contact" @click="scrollToId('contact')" />
        </div>
    </div>
</template>