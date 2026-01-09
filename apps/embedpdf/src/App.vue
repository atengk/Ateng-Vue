<script setup lang="ts">
import { ref, computed } from 'vue'
import { PDFViewer } from '@embedpdf/vue-pdf-viewer'

/**
 * PDF 列表（模拟业务数据）
 */
const pdfList = [
  {
    name: 'PDF A',
    url: 'https://snippet.embedpdf.com/ebook.pdf'
  },
  {
    name: 'PDF B',
    url: 'http://175.178.193.128:20033/kongyu/demo.pdf'
  }
]

/**
 * 当前 PDF 地址
 */
const pdfSrc = ref<string>(pdfList[0]?.url ?? '')

/**
 * Viewer 配置（响应式）
 */
const viewerConfig = computed(() => ({
  src: pdfSrc.value,
  theme: {
    preference: 'light'
  },
  i18n: {
    defaultLocale: 'zh-CN',
  },
  permissions: {
    annotation: false,
    download: false,
    print: false
  }
}))

/**
 * Viewer 样式
 */
const viewerStyle = {
  width: '100%',
  height: '100%'
}

/**
 * 切换 PDF
 */
function switchPdf(url: string) {
  pdfSrc.value = url
}
</script>

<template>
  <div class="page">
    <div class="toolbar">
      <button
          v-for="item in pdfList"
          :key="item.url"
          @click="switchPdf(item.url)"
      >
        {{ item.name }}
      </button>
    </div>

    <div class="toolbar">
      当前的文件地址：{{ pdfSrc }}
    </div>

    <PDFViewer
        :key="pdfSrc"
        :config="viewerConfig"
        :style="viewerStyle"
    />
  </div>
</template>

<style scoped>
.page {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.toolbar {
  padding: 8px;
  display: flex;
  gap: 8px;
  border-bottom: 1px solid #e5e7eb;
}

.toolbar button {
  padding: 4px 10px;
  cursor: pointer;
}

.page :deep(.epdf-viewer) {
  flex: 1;
}
</style>
