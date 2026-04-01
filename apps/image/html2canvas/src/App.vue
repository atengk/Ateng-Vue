<template>
  <div>
    <div ref="exportRef" class="export-box">
      <h2>隐藏元素导出（无闪烁）</h2>
      <p>这段会导出</p>
      <p class="no-export">这段不会导出</p>
    </div>

    <button @click="exportImage">导出图片</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import html2canvas from 'html2canvas'

const exportRef = ref<HTMLElement | null>(null)

const exportImage = async () => {
  const sourceEl = exportRef.value
  if (!sourceEl) return

  /** 克隆节点 */
  const clone = sourceEl.cloneNode(true) as HTMLElement

  /** 在克隆节点中隐藏元素 */
  const hiddenEl = clone.querySelector('.no-export') as HTMLElement
  if (hiddenEl) {
    hiddenEl.style.display = 'none'
  }

  /** 放到屏幕外 */
  clone.style.position = 'fixed'
  clone.style.left = '-99999px'
  clone.style.top = '0'
  clone.style.zIndex = '-1'

  document.body.appendChild(clone)

  /** 截图 */
  const canvas = await html2canvas(clone, {
    scale: window.devicePixelRatio,
    backgroundColor: '#ffffff'
  })

  /** 清理 */
  document.body.removeChild(clone)

  /** 下载 */
  const link = document.createElement('a')
  link.href = canvas.toDataURL('image/png')
  link.download = '隐藏元素.png'
  link.click()
}
</script>

<style scoped>
.export-box {
  width: 400px;
  padding: 20px;
  border: 1px solid #dcdfe6;
  background: #fff;
}

.no-export {
  color: red;
}
</style>
