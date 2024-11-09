<script setup lang="ts">
const props = defineProps<{
    imageSrc: string,
    cardName: string,
    cardDescription: string
}>()
</script>

<template>
    <div class="w-64 flex-col justify-center items-start gap-4 inline-flex">
        <img class="w-64 h-64 object-cover object-center relative" :src="imageSrc" :alt="cardName" />
        <h3 class="text-white">{{ props.cardName }}</h3>
        <p>{{ props.cardDescription }}</p>
    </div>
</template>