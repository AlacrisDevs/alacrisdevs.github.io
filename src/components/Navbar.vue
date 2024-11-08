<script setup lang="ts">
import Button from './Button.vue';
import Hamburger from './Hamburger.vue';

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
    <div class="w-full px-8 xl:px-32 py-4 bg-dark shadow justify-between items-center flex">
        <div class="justify-center items-center gap-4 flex">
            <div class="w-[32px] h-[32px]">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g id="Logo">
                        <path id="path15"
                            d="M32 0L20.8 5.59997L24.5883 13.1765L32 10V0ZM8 12L0 16L4.79999 18.4L8 12ZM28.1818 20.3636L32 28V22L28.1818 20.3636Z"
                            fill="#006CFF" />
                        <path id="path1" d="M16 0L0 32H10L16 18L22 32H32L16 0Z" fill="#E9F2FF" />
                    </g>
                </svg>
            </div>
            <h1>AlacrisDevs</h1>
        </div>
        <div class="w-min justify-end items-center gap-8 flex">
            <Button class="hidden xl:block" button-text="About" @click="scrollToId('who-am-i')" />
            <Button class="hidden xl:block" button-text="Projects" @click="scrollToId('projects')" />
            <Button class="hidden xl:block" button-text="Gallery" @click="scrollToId('gallery')" />
            <Button class="hidden xl:block" button-text="Contact" @click="scrollToId('contact')" />
            <Hamburger class="block xl:hidden" />
        </div>
    </div>
</template>
