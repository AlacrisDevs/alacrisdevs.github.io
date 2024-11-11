<script setup lang="ts">
import { designList } from '../lists/DesignsData.js';
const props = defineProps<{
    imageSrc: string,
    cardName: string,
    cardDescription: string
}>()
</script>

<template>
    <div class="w-32 xl:w-64 sm:w-32 h-full flex-col justify-start items-start gap-4 flex">
        <img class="w-32 xl:w-64 sm:w-32 h-32 xl:h-64 sm:h-32 object-cover object-center text-white" :src="imageSrc" :alt="cardName" />
        <h3 class="text-light">{{ props.cardName }}</h3>
        <p>{{ props.cardDescription }}</p>
    </div>
</template>