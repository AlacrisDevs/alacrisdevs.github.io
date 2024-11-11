<script setup lang="ts">
import { ref } from 'vue';
import { galleryList } from '../lists/GalleryData.js';
const props = defineProps({
    index: {
        type: Number,
        required: true,
    },
    imageSrc: {
        type: String,
        required: true,
    },
    cardName: {
        type: String,
        required: true,
    },
});

const isOverlayOpen = ref(false);
const currentImageIndex = ref(props.index);
const images = ref(galleryList);

const toggleOverlay = () => {
    isOverlayOpen.value = !isOverlayOpen.value;
    setupScrollLock();
    currentImageIndex.value = props.index;
};

const setupScrollLock = () => {
    document.body.style.overflow = isOverlayOpen.value ? 'hidden' : '';
};

const showNextImage = () => {
    if (currentImageIndex.value < images.value.length) {
        currentImageIndex.value++;
    }
};

const showPreviousImage = () => {
    if (currentImageIndex.value > 0) {
        currentImageIndex.value--;
    }
};
</script>

<template>
    <button @click.prevent="toggleOverlay"
        class="w-32 xl:w-64 sm:w-32 aspect-video flex-col justify-center items-start gap-4 inline-flex">
        <img class="w-32 xl:w-64 sm:w-32 aspect-video object-cover object-center relative" :src="imageSrc"
            :alt="cardName" />
    </button>
    <div v-if="isOverlayOpen"
        class="fixed inset-0 px-8 xl:px-32 py-16 bg-dark bg-opacity-95 z-[1] flex flex-col items-center justify-center gap-8 opacity-0 transition-opacity duration-200 ease-in-out"
        :class="[isOverlayOpen ? 'opacity-100 transition-opacity duration-200 ease-in-out' : 'opacity-0 transition-opacity duration-200 ease-in-out']">
        <img class="w-auto h-1/3 xl:h-3/4 lg:h-1/2 md:h-2/5 sm:h-1/3 aspect-auto relative"
            :src="galleryList[currentImageIndex].src" :alt="galleryList[currentImageIndex].name" />

        <h3 class="text-light">{{ galleryList[currentImageIndex].name }}</h3>

        <button @click.prevent="toggleOverlay" class="p-2 absolute top-24 right-6 z-[2]">
            <svg class="w-8 xl:w-16 h-8 xl:h-16" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" >
                <g fill="none" stroke="#E9F2FF" stroke-width="4">
                    <line x1="5" y1="5" x2="27" y2="27" />
                    <line x1="5" y1="27" x2="27" y2="5" />
                </g>
            </svg>
        </button>

        <button v-if="currentImageIndex > 0" @click.prevent="showPreviousImage" class="p-2 absolute left-6 z-[2]">
            <svg class="w-8 xl:w-16 h-8 xl:h-16" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 5L10 16L21 27" stroke="#E9F2FF" stroke-width="4" />
            </svg>
        </button>

        <button v-if="currentImageIndex < galleryList.length - 1" @click.prevent="showNextImage"
            class="p-2 absolute right-6 z-[2]">
            <svg class="w-8 xl:w-16 h-8 xl:h-16" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 27L21 16L10 5" stroke="#E9F2FF" stroke-width="4" />
            </svg>
        </button>
    </div>
</template>