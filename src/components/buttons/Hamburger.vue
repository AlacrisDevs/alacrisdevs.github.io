<template>
    <button class="w-[32px] h-[32px] flex flex-col justify-between items-center relative">
        <div :class="[
            'w-[32px] h-1 bg-light transition-all duration-200 ease-in-out',
            isOpen ? 'rotate-45 translate-y-[14px]' : ''
        ]"></div>
        <div :class="[
            'w-[32px] h-1 bg-light transition-all duration-200 ease-in-out',
            isOpen ? 'opacity-0' : ''
        ]"></div>
        <div :class="[
            'w-[32px] h-1 bg-light transition-all duration-200 ease-in-out',
            isOpen ? '-rotate-45 -translate-y-[14px]' : ''
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