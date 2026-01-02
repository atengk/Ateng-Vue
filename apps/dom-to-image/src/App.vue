<template>
  <div>
    <div ref="captureRef" class="box">
      <h3>DOM to SVG</h3>
      <p>这是一个导出 SVG 的示例</p>
      <ul>
        <li v-for="item in list" :key="item">
          第 {{ item }} 项
        </li>
      </ul>
    </div>

    <button @click="exportSvg">导出 SVG</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import domtoimage from 'dom-to-image-more'

const captureRef = ref<HTMLElement | null>(null)

const list = ref<number[]>(
    Array.from({ length: 5 }, (_, i) => i + 1)
)

const exportSvg = async () => {
  if (!captureRef.value) {
    return
  }

  const dataUrl = await domtoimage.toSvg(captureRef.value, {
    bgcolor: '#ffffff'
  })

  const link = document.createElement('a')
  link.href = dataUrl
  link.download = 'export.svg'
  link.click()
}

</script>

<style scoped>
.box {
  width: 300px;
  padding: 16px;
  background-color: #ffffff;
  border: 1px solid #dcdfe6;
}

ul {
  padding-left: 16px;
}

li {
  line-height: 24px;
}
</style>