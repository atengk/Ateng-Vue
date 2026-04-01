<template>
  <div>
    <h3>签名板 - 高级功能</h3>
    <div class="canvas-wrapper">
      <canvas ref="canvasRef" class="signature-canvas"></canvas>
    </div>

    <div class="controls">
      <button @click="clear">清除</button>
      <button @click="undo">撤销</button>
      <button @click="save">保存 (Base64)</button>
      <button @click="saveBlob">保存 (Blob)</button>
      <button @click="loadSample">加载示例签名</button>
      <label>
        颜色: <input type="color" v-model="color"/>
      </label>
      <label>
        粗细: <input type="range" min="1" max="10" v-model.number="lineWidth"/>
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import SignaturePad from 'signature_pad'

const canvasRef = ref<HTMLCanvasElement | null>(null)
let signaturePad: SignaturePad | null = null

// 笔颜色和粗细
const color = ref('#000000')
const lineWidth = ref(2)

// 调整 canvas 尺寸（响应式 + 高 DPI）
const resizeCanvas = () => {
  if (!canvasRef.value) return
  const canvas = canvasRef.value
  const ratio = Math.max(window.devicePixelRatio || 1, 1)
  canvas.width = canvas.offsetWidth * ratio
  canvas.height = canvas.offsetHeight * ratio
  const ctx = canvas.getContext('2d')
  ctx?.scale(ratio, ratio)
  signaturePad?.clear()
}

onMounted(() => {
  if (canvasRef.value) {
    signaturePad = new SignaturePad(canvasRef.value, {
      penColor: color.value,
      minWidth: lineWidth.value,
      maxWidth: lineWidth.value,
      velocityFilterWeight: 0.7, // 平滑曲线
    })
  }

  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)
})

onUnmounted(() => window.removeEventListener('resize', resizeCanvas))

// 动态更新笔属性
watch([color, lineWidth], () => {
  if (!signaturePad) return
  signaturePad.penColor = color.value
  signaturePad.minWidth = lineWidth.value
  signaturePad.maxWidth = lineWidth.value
})

// 清除签名
const clear = () => signaturePad?.clear()

// 撤销
const undo = () => {
  if (!signaturePad) return
  const data = signaturePad.toData()
  if (data.length) {
    data.pop()
    signaturePad.fromData(data)
  }
}

// 保存 Base64
const save = () => {
  if (!signaturePad || signaturePad.isEmpty()) {
    alert('签名为空')
    return
  }
  const dataUrl = signaturePad.toDataURL('image/png')
  console.log('Base64:', dataUrl)
}

// 保存 Blob
const saveBlob = () => {
  if (!signaturePad || signaturePad.isEmpty()) {
    alert('签名为空')
    return
  }
  canvasRef.value?.toBlob(blob => {
    if (blob) {
      console.log('Blob 对象:', blob)
      // 可直接上传 FormData
      // const formData = new FormData()
      // formData.append('file', blob, 'signature.png')
    }
  }, 'image/png')
}

// 加载已有签名（示例 Base64）
const loadSample = () => {
  if (!signaturePad) return
  const sampleBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...'
  signaturePad.fromDataURL(sampleBase64)
}
</script>

<style scoped>
.canvas-wrapper {
  width: 100%;
  max-width: 500px;
  height: 300px;
  border: 1px solid #ccc;
}
.signature-canvas {
  width: 100%;
  height: 100%;
  touch-action: none; /* 移动设备避免滚动冲突 */
}
.controls {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}
</style>