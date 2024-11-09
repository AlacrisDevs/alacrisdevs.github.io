<template>
    <button class="w-[42px] h-[42px] flex flex-col justify-between items-center relative">
        <div :class="[
            'w-[42px] h-1 bg-white transition-all duration-200 ease-in-out',
            isOpen ? 'rotate-45 translate-y-[19px]' : ''
        ]"></div>
        <div :class="[
            'w-[42px] h-1 bg-white transition-all duration-200 ease-in-out',
            isOpen ? 'opacity-0' : ''
        ]"></div>
        <div :class="[
            'w-[42px] h-1 bg-white transition-all duration-200 ease-in-out',
            isOpen ? '-rotate-45 -translate-y-[19px]' : ''
        ]"></div>
    </button>
</template>

<script>
export default {
    props: {
        isOpen: {
            type: Boolean,
            default: false
        }
    }
};
</script>