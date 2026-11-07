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
    // medium-zoom zooms a copy of the image. A lazy copy stays blank in
    // Safari and Firefox, so switch to eager before the copy is made.
    mediumZoom(imgRef.value, { background: 'var(--vp-c-bg)' })
        .on('open', (event) => { event.target.loading = 'eager' });
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