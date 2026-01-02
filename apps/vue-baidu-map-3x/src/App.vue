<template>
  <baidu-map
      class="map"
      :center="{ lng: 116.404, lat: 39.915 }"
      :zoom="14"
      @mousemove="syncPolyline"
      @click="paintPolyline"
      @rightclick="newPolyline"
  >
    <bm-control>
      <button @click.stop="toggle">
        {{ polyline.editing ? '停止绘制' : '开始绘制' }}
      </button>
    </bm-control>

    <bm-polyline
        v-for="(path, index) in polyline.paths"
        :key="index"
        :path="path"
    />
  </baidu-map>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { getConfig } from 'vue-baidu-map-3x'

type Point = {
  lng: number
  lat: number
}

const config = getConfig()

const polyline = ref<{
  editing: boolean
  paths: Point[][]
}>({
  editing: false,
  paths: []
})

const toggle = () => {
  polyline.value.editing = !polyline.value.editing
}

const getPoint = (e: any): Point => {
  return config.type === 'WebGL' ? e.latlng : e.point
}

const paintPolyline = (e: any) => {
  if (!polyline.value.editing) return

  if (!polyline.value.paths.length) {
    polyline.value.paths.push([])
  }

  polyline.value.paths.at(-1)!.push(getPoint(e))
}

const syncPolyline = (e: any) => {
  if (!polyline.value.editing) return
  if (!polyline.value.paths.length) return

  const path = polyline.value.paths.at(-1)!
  if (!path.length) return

  if (path.length === 1) {
    path.push(getPoint(e))
  }

  path[path.length - 1] = getPoint(e)
}

const newPolyline = () => {
  if (!polyline.value.editing) return

  if (!polyline.value.paths.length) {
    polyline.value.paths.push([])
  }

  const path = polyline.value.paths.at(-1)!
  path.pop()

  if (path.length) {
    polyline.value.paths.push([])
  }
}
</script>

<style scoped>
.map {
  width: 100%;
  height: 400px;
}
</style>
