<script setup lang="ts">
import { ref, computed } from 'vue'

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
})

const emit = defineEmits(['open-overlay'])
const imageLoadingError = ref(false)

const computedImageSrc = computed(() => {
    if (imageLoadingError.value || !props.imageSrc.trim()) {
        return '/something_wrong.png'
    }
    return props.imageSrc
})

const handleClick = () => {
    emit('open-overlay', props.index)
}

const handleImageError = () => {
    imageLoadingError.value = true
}
</script>

<template>
    <button @click="handleClick"
        class="shadow-card relative flex h-full max-h-56 w-full flex-col items-center justify-center">
        <img class="aspect-video h-full w-full object-cover" :src="computedImageSrc" :alt="cardName"
            @error="handleImageError" />
    </button>
</template>
