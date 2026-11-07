<script setup>
import { withBase } from 'vitepress'
import { onMounted, ref } from 'vue'
import mediumZoom from 'medium-zoom'
import sizes from 'virtual:image-sizes'

const props = defineProps({
    src: String,
    // Pass loading="eager" for an image at the top of a page
    loading: { type: String, default: 'lazy' }
})

const size = sizes[props.src] || []

const imgRef = ref(null)

onMounted(() => {
    mediumZoom(imgRef.value, { background: 'var(--vp-c-bg)' });
})
</script>

<template>
    <img ref="imgRef" :src="withBase(src)" :width="size[0]" :height="size[1]" :loading="loading" decoding="async">
</template>

<style>
.medium-zoom-overlay {
    z-index: 120;
}
.medium-zoom-image {
    z-index: 121;
}
</style>