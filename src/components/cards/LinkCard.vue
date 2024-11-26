<script setup lang="ts">
const props = defineProps<{
    cardUrl: string,
    imageSrc: string,
    cardName: string,
    cardDescription: string
}>()
</script>

<template>
    <div class="w-32 xl:w-64 sm:w-32 h-full flex-col justify-between items-start gap-4 flex">
        <a class="flex-col gap-4 flex" :href="cardUrl">
            <img class="w-32 xl:w-64 sm:w-32 h-32 xl:h-64 sm:h-32 object-cover object-center" :src="imageSrc"
                :alt="cardName" />
            <h3>{{ props.cardName }}</h3>
        </a>
        <p>{{ props.cardDescription }}</p>
    </div>
</template>