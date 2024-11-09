<script setup lang="ts">
import { ref } from 'vue';
import Button from './buttons/Button.vue';
import ActiveButton from './buttons/ActiveButton.vue';
import Hamburger from './buttons/Hamburger.vue';

const isMenuOpen = ref(false);

function toggleMenu() {
    isMenuOpen.value = !isMenuOpen.value;
}

function scrollToId(id: string): void {
    const element = document.getElementById(id);
    element.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
}
</script>

<template>
    <div class="w-full px-8 xl:px-48 py-4 sticky top-0 z-[2] bg-dark shadow-2xl flex justify-between items-center">
        <div class="flex items-center gap-4">
            <div class="w-[32px] h-[32px]">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <g id="Logo">
                        <path id="path15"
                            d="M32 0L20.8 5.6L24.6 13.2L32 10V0ZM8 12L0 16L4.8 18.4L8 12ZM28.2 20.4L32 28V22L28.2 20.4Z"
                            fill="#006CFF" />
                        <path id="path1" d="M16 0L0 32H10L16 18L22 32H32L16 0Z" fill="#E9F2FF" />
                    </g>
                </svg>
            </div>
            <h1>AlacrisDevs</h1>
        </div>

        <div class="flex items-center gap-8">
            <Button class="hidden xl:block" button-text="About" @click.prevent="scrollToId('who-am-i')" />
            <Button class="hidden xl:block" button-text="Projects" @click.prevent="scrollToId('projects')" />
            <Button class="hidden xl:block" button-text="Gallery" @click.prevent="scrollToId('gallery')" />
            <ActiveButton class="hidden xl:block" button-text="Contact" @click.prevent="scrollToId('contact')" />
            <Hamburger :isOpen="isMenuOpen" @click.prevent="toggleMenu" class="block xl:hidden" />
        </div>
    </div>
    <div @click.prevent="toggleMenu" v-if="isMenuOpen"
        class="fixed inset-0 bg-dark bg-opacity-95 z-[1] flex flex-col items-center justify-center gap-8 transform transition-all duration-200 ease-in-out"
        :class="isMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'">
        <Button button-text="About" @click.prevent="{ scrollToId('who-am-i'); toggleMenu }" />
        <Button button-text="Projects" @click.prevent="{ scrollToId('projects'); toggleMenu }" />
        <Button button-text="Gallery" @click.prevent="{ scrollToId('gallery'); toggleMenu }" />
        <ActiveButton button-text="Contact" @click.prevent="{ scrollToId('contact'); toggleMenu }" />
    </div>
</template>
