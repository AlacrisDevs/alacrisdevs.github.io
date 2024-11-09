<script setup lang="ts">
const props = defineProps<{
    cardUrl: string,
    imageSrc: string,
    cardName: string,
    cardDescription: string
}>()
</script>

<template>
    <div class="w-64 h-full flex-col justify-start items-start gap-4 flex">
        <a class="flex-col gap-4 flex" :href="cardUrl">
            <img class="w-64 h-64 object-cover object-center" :src="imageSrc"
                :alt="cardName" />
            <h3>{{ props.cardName }}</h3>
        </a>
        <p>{{ props.cardDescription }}</p>
    </div>
</template>