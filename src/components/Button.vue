<script setup lang="ts">
const props = defineProps<{
    buttonText: string
}>()
</script>

<template>
    <button class="min-h-12 max-h-12 px-8 bg-dark border-dark text-white button-text border-4 box-border rounded-[4rem] 
    justify-start items-center gap-4 inline-flex transition-colors duration-100 
    hover:bg-blue hover:border-blue focus:bg-white focus:border-white focus:text-black">
        {{ props.buttonText }}
    </button>
</template>