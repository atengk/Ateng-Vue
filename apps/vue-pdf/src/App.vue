<template>
  <div class="pdf-viewer">
    <VuePDF
        :pdf="pdf"
        text-layer
        class="pdf-full"
        @loaded="handleLoaded"
        @textLoaded="handleTextLoaded"
    />
  </div>
</template>

<script setup lang="ts">
import { VuePDF, usePDF } from '@tato30/vue-pdf'
import '@tato30/vue-pdf/style.css'
import type { PageViewport } from 'pdfjs-dist/types/src/display/display_utils'

// 官方示例 PDF
const PDF_URL =
    'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf'

const { pdf, pages } = usePDF(PDF_URL)

/**
 * PDF 页面视口加载完成
 * 这是最核心的“加载完成事件”
 */
const handleLoaded = (viewport: PageViewport): void => {
  console.log('📄 PDF 已加载完成')
  console.log('当前页面宽高：', viewport.width, viewport.height)
  console.log('总页数：', pages.value)
}

/**
 * 文本层加载完成
 * 只有在开启 text-layer 时才会触发
 */
const handleTextLoaded = (): void => {
  console.log('📝 文本层加载完成，可选中复制已生效')
}
</script>

<style>
.pdf-viewer {
  width: 100%;
  height: 100vh;
  overflow: auto;
}

.pdf-full {
  width: 100%;
}
</style>
