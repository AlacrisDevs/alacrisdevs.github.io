<script setup lang="ts">
const props = defineProps<{
    imageSrc: string,
    cardName: string,
    cardDescription: string
}>()
</script>

<template>
    <div class="w-64 h-full flex-col justify-start items-start gap-4 flex">
        <img class="w-64 h-64 object-cover object-center" :src="imageSrc" :alt="cardName" />
        <h3 class="text-light">{{ props.cardName }}</h3>
        <p>{{ props.cardDescription }}</p>
    </div>
</template>