<script setup lang="ts">
import 'canvas-drawing-editor'

function getCanvas() {
  const editor = document.querySelector('canvas-drawing-editor')
  return (editor as any)?.shadowRoot?.querySelector('canvas') || null
}

function downloadPng() {
  const canvas = getCanvas()
  if (!canvas) return

  const url = canvas.toDataURL('image/png')
  const a = document.createElement('a')
  a.href = url
  a.download = 'my-canvas.png'
  a.click()
}

function downloadJpg(quality = 0.9) {
  const canvas = getCanvas()
  if (!canvas) return

  const url = canvas.toDataURL('image/jpeg', quality)

  const a = document.createElement('a')
  a.href = url
  a.download = 'canvas.jpg'
  a.click()
}

function downloadBlob() {
  const canvas = getCanvas()
  if (!canvas) return

  canvas.toBlob((blob) => {
    if (!blob) return

    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'canvas.png'
    a.click()

    URL.revokeObjectURL(url)
  })
}


</script>

<template>
  <div>
    <button @click="downloadPng">自定义下载 PNG</button>

    <canvas-drawing-editor
        :tool-config="JSON.stringify({ download: false })"
        style="width: 100%; height: 600px"
    />
  </div>
</template>
