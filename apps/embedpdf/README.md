# EmbedPDF

通过完整、随时可用的界面将 PDF 文件嵌入您的网站的最简单方法。

- [官网地址](https://www.embedpdf.com/docs/vue/viewer/getting-started)



## 基础配置

**安装依赖**

```
pnpm add @embedpdf/vue-pdf-viewer@2.1.2
```



## 最简示例

```vue
<script setup lang="ts">
import { computed, ref } from 'vue'
import { PDFViewer } from '@embedpdf/vue-pdf-viewer'

/**
 * 当前 PDF 地址
 */
const pdfSrc = ref<string>('https://snippet.embedpdf.com/ebook.pdf')

/**
 * Viewer 配置
 */
const viewerConfig = computed(() => ({
  src: pdfSrc.value,
  theme: {
    preference: 'light'
  },
  i18n: {
    defaultLocale: 'zh-CN',
  }
}))

/**
 * Viewer 样式
 */
const viewerStyle = {
  width: '100%',
  height: '100%'
}
</script>

<template>
  <div class="page">
    <PDFViewer
        :config="viewerConfig"
        :style="viewerStyle"
    />
  </div>
</template>

<style scoped>
.page {
  height: 100vh;
}
</style>
```

![image-20260109153000228](./assets/image-20260109153000228.png)

## 动态切换 PDF

```vue
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
```

