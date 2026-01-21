# VuePDF

VuePDF 是一个Vue 3的客户端组件，它允许你在项目中灵活地渲染 PDF 页面。

- [官网地址](https://github.com/TaTo30/vue-pdf)



## 基础配置

**安装依赖**

```
pnpm add @tato30/vue-pdf@1.11.5
```



## PDF 加载显示

```vue
<template>
  <div class="pdf-viewer">
    <VuePDF :pdf="pdf" class="pdf-full" />
  </div>
</template>

<script setup lang="ts">
import { VuePDF, usePDF } from '@tato30/vue-pdf'

// 官方示例 PDF
const PDF_URL =
    'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf'

// 直接解构 usePDF 返回的 pdf
const { pdf } = usePDF(PDF_URL)
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
```



## 分页

```vue
<template>
  <div class="pdf-wrapper">
    <!-- 工具栏 -->
    <div class="toolbar">
      <button :disabled="currentPage <= 1" @click="prevPage">上一页</button>
      <span>{{ currentPage }} / {{ pages }}</span>
      <button :disabled="currentPage >= pages" @click="nextPage">下一页</button>
    </div>

    <!-- PDF 显示区 -->
    <div class="pdf-viewer">
      <VuePDF
          :pdf="pdf"
          :page="currentPage"
          class="pdf-full"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { VuePDF, usePDF } from '@tato30/vue-pdf'

// 官方示例 PDF
const PDF_URL =
    'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf'

// usePDF 会返回 pdf 和 pages（总页数）
const { pdf, pages } = usePDF(PDF_URL)

// 当前页
const currentPage = ref(1)

/**
 * 上一页
 */
const prevPage = (): void => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

/**
 * 下一页
 */
const nextPage = (): void => {
  if (currentPage.value < pages.value) {
    currentPage.value++
  }
}
</script>

<style>
.pdf-wrapper {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-bottom: 1px solid #ddd;
  background: #f9f9f9;
}

.pdf-viewer {
  flex: 1;
  overflow: auto;
}

.pdf-full {
  width: 100%;
}
</style>
```



## 缩放

```vue
<template>
  <div class="pdf-wrapper">
    <!-- 工具栏 -->
    <div class="toolbar">
      <!-- 分页 -->
      <button :disabled="currentPage <= 1" @click="prevPage">上一页</button>
      <span>{{ currentPage }} / {{ pages }}</span>
      <button :disabled="currentPage >= pages" @click="nextPage">下一页</button>

      <!-- 缩放 -->
      <button @click="zoomOut">-</button>
      <span>{{ Math.round(scale * 100) }}%</span>
      <button @click="zoomIn">+</button>
      <button @click="resetZoom">重置</button>
    </div>

    <!-- PDF 显示区 -->
    <div class="pdf-viewer">
      <VuePDF
          :pdf="pdf"
          :page="currentPage"
          :scale="scale"
          class="pdf-full"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { VuePDF, usePDF } from '@tato30/vue-pdf'

// 官方示例 PDF
const PDF_URL =
    'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf'

const { pdf, pages } = usePDF(PDF_URL)

// 当前页
const currentPage = ref(1)

// 缩放比例
const scale = ref(1)

// 缩放步长、最小/最大值
const SCALE_STEP = 0.1
const SCALE_MIN = 0.5
const SCALE_MAX = 3

/**
 * 放大
 */
const zoomIn = (): void => {
  if (scale.value < SCALE_MAX) {
    scale.value = Math.min(SCALE_MAX, scale.value + SCALE_STEP)
  }
}

/**
 * 缩小
 */
const zoomOut = (): void => {
  if (scale.value > SCALE_MIN) {
    scale.value = Math.max(SCALE_MIN, scale.value - SCALE_STEP)
  }
}

/**
 * 重置缩放
 */
const resetZoom = (): void => {
  scale.value = 1
}

/**
 * 上一页
 */
const prevPage = (): void => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

/**
 * 下一页
 */
const nextPage = (): void => {
  if (currentPage.value < pages.value) {
    currentPage.value++
  }
}
</script>

<style>
.pdf-wrapper {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-bottom: 1px solid #ddd;
  background: #f9f9f9;
}

.pdf-viewer {
  flex: 1;
  overflow: auto;
}

.pdf-full {
  width: 100%;
}
</style>
```



## 自适应容器

```vue
<template>
  <div class="pdf-wrapper">
    <!-- 工具栏 -->
    <div class="toolbar">
      <!-- 分页 -->
      <button :disabled="currentPage <= 1" @click="prevPage">上一页</button>
      <span>{{ currentPage }} / {{ pages }}</span>
      <button :disabled="currentPage >= pages" @click="nextPage">下一页</button>

      <!-- 缩放 -->
      <button @click="zoomOut">-</button>
      <span>{{ Math.round(scale * 100) }}%</span>
      <button @click="zoomIn">+</button>
      <button @click="resetZoom">100%</button>

      <!-- 自适应 -->
      <button @click="fitWidth">适应宽度</button>
      <button @click="fitHeight">适应高度</button>
    </div>

    <!-- PDF 容器 -->
    <div ref="containerRef" class="pdf-viewer">
      <VuePDF
          :pdf="pdf"
          :page="currentPage"
          :scale="scale"
          class="pdf-canvas"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { VuePDF, usePDF } from '@tato30/vue-pdf'

const PDF_URL =
    'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf'

const { pdf, pages } = usePDF(PDF_URL)

// 分页
const currentPage = ref(1)

// 缩放
const scale = ref(1)
const SCALE_STEP = 0.1
const SCALE_MIN = 0.3
const SCALE_MAX = 4

// PDF 容器 DOM
const containerRef = ref<HTMLDivElement | null>(null)

/**
 * 放大
 */
const zoomIn = (): void => {
  scale.value = Math.min(SCALE_MAX, scale.value + SCALE_STEP)
}

/**
 * 缩小
 */
const zoomOut = (): void => {
  scale.value = Math.max(SCALE_MIN, scale.value - SCALE_STEP)
}

/**
 * 重置为 100%
 */
const resetZoom = (): void => {
  scale.value = 1
}

/**
 * 适应宽度
 * 原理：容器宽度 / PDF 页面真实宽度
 */
const fitWidth = async (): Promise<void> => {
  await nextTick()

  const container = containerRef.value
  if (!container) return

  const canvas = container.querySelector('canvas') as HTMLCanvasElement
  if (!canvas) return

  const containerWidth = container.clientWidth
  const pdfWidth = canvas.width

  scale.value = containerWidth / pdfWidth
}

/**
 * 适应高度
 * 原理：容器高度 / PDF 页面真实高度
 */
const fitHeight = async (): Promise<void> => {
  await nextTick()

  const container = containerRef.value
  if (!container) return

  const canvas = container.querySelector('canvas') as HTMLCanvasElement
  if (!canvas) return

  const containerHeight = container.clientHeight
  const pdfHeight = canvas.height

  scale.value = containerHeight / pdfHeight
}

/**
 * 上一页
 */
const prevPage = (): void => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

/**
 * 下一页
 */
const nextPage = (): void => {
  if (currentPage.value < pages.value) {
    currentPage.value++
  }
}
</script>

<style>
.pdf-wrapper {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-bottom: 1px solid #ddd;
  background: #f9f9f9;
}

.pdf-viewer {
  flex: 1;
  overflow: auto;
  position: relative;
}

/* 控制 PDF 宽度不溢出 */
.pdf-canvas {
  display: block;
  margin: 0 auto;
}
</style>
```



## 文本层（可选中复制）

```vue
<template>
  <div class="pdf-viewer">
    <VuePDF
        :pdf="pdf"
        text-layer
        class="pdf-full"
    />
  </div>
</template>

<script setup lang="ts">
import { VuePDF, usePDF } from '@tato30/vue-pdf'
import '@tato30/vue-pdf/style.css'

// 官方示例 PDF
const PDF_URL =
    'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf'

// 直接解构 usePDF 返回的 pdf
const { pdf } = usePDF(PDF_URL)
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
```



## 加载完成事件

```vue
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
```

