<script setup lang="ts">
const props = defineProps<{
    imageSrc: string,
    cardName: string
}>()
</script>

<template>
    <div class="w-64 aspect-video flex-col justify-center items-start gap-4 inline-flex">
        <img class="w-64 aspect-video object-cover object-center relative" :src="imageSrc" :alt="cardName" />
    </div>
</template>