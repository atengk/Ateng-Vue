<template>
  <div ref="containerRef" class="map"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { loadAMap } from '@/utils/amap'

const containerRef = ref<HTMLDivElement | null>(null)
let map: any = null

onMounted(async () => {
  const AMap = await loadAMap()

  map = new AMap.Map(containerRef.value!, {
    zoom: 12,
    center: [106.55, 29.56]
  })

  AMap.plugin(['AMap.Driving'], () => {
    const driving = new AMap.Driving({
      map
    })

    driving.search(
        [106.55, 29.56],
        [106.60, 29.58]
    )
  })
})

onUnmounted(() => {
  map?.destroy()
})
</script>

<style scoped>
.map {
  width: 100%;
  height: 100vh;
}
</style>