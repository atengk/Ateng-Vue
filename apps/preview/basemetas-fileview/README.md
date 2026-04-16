# BaseMetas Fileview

在线文件预览解决方案
支持在线预览超过200种文件，API调用简单快捷，支持独立部署，开源免费。

- [官网地址](https://fileview.basemetas.cn/)

- [服务部署](https://atengk.github.io/Ateng-Linux/work/docker/service/basemetas-fileview/README)



## 基础配置

**安装依赖**

```
pnpm add @vueuse/core@14.1.0 js-base64@3.7.8
```



## 创建组合式函数 useFileview.ts

```ts
// src/composables/useFileview.ts
import { useClipboard, useStorage } from '@vueuse/core'
import { Base64 } from 'js-base64'

export type FileviewMode = 'normal' | 'embed'
export type FileviewSourceType = 'query' | 'data' | 'path'

export interface FileviewPreviewParams {
  url?: string
  path?: string
  fileName: string
  displayName?: string
  watermark?: string
  mode?: FileviewMode
}

export interface RecentPreviewItem {
  title: string
  url: string
  createdAt: string
}

const DEFAULT_BASE_URL = import.meta.env.VITE_FILEVIEW_BASE_URL ?? 'http://192.168.1.12:40045'
const RECENT_KEY = 'fileview:recent-preview'

function removeTrailingSlash(value: string): string {
  return value.replace(/\/+$/, '')
}

function appendIfNotEmpty(search: URLSearchParams, key: string, value?: string) {
  if (value !== undefined && value !== null && value !== '') {
    search.set(key, value)
  }
}

function requireValue(value: string | undefined, message: string): string {
  if (!value) {
    throw new Error(message)
  }
  return value
}

export function useFileview(baseUrl: string = DEFAULT_BASE_URL) {
  const recent = useStorage<RecentPreviewItem[]>(RECENT_KEY, [])
  const { copy, copied, isSupported } = useClipboard()

  const normalizedBaseUrl = removeTrailingSlash(baseUrl)
  const previewEntry = `${normalizedBaseUrl}/preview/view`

  function buildPreviewUrl(type: FileviewSourceType, params: FileviewPreviewParams): string {
    if (type === 'data') {
      const payload: Record<string, string> = {
        fileName: requireValue(params.fileName, 'data 模式必须提供 fileName'),
      }

      appendIfNotEmpty(new URLSearchParams(), 'noop', undefined)

      if (params.url) {
        payload.url = params.url
      }
      if (params.displayName) {
        payload.displayName = params.displayName
      }
      if (params.watermark) {
        payload.watermark = params.watermark
      }
      if (params.mode) {
        payload.mode = params.mode
      }

      return `${previewEntry}?data=${encodeURIComponent(Base64.encode(JSON.stringify(payload)))}`
    }

    const search = new URLSearchParams()

    if (type === 'path') {
      appendIfNotEmpty(search, 'path', requireValue(params.path, 'path 模式必须提供 path'))
    } else {
      appendIfNotEmpty(search, 'url', requireValue(params.url, 'query 模式必须提供 url'))
    }

    appendIfNotEmpty(search, 'fileName', params.fileName)
    appendIfNotEmpty(search, 'displayName', params.displayName)
    appendIfNotEmpty(search, 'watermark', params.watermark)
    appendIfNotEmpty(search, 'mode', params.mode)

    return `${previewEntry}?${search.toString()}`
  }

  function openPreview(url: string) {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  async function copyPreviewUrl(url: string) {
    await copy(url)
  }

  function pushRecent(title: string, url: string) {
    recent.value = [
      {
        title,
        url,
        createdAt: new Date().toISOString(),
      },
      ...recent.value,
    ].slice(0, 10)
  }

  return {
    recent,
    copied,
    isSupported,
    buildPreviewUrl,
    openPreview,
    copyPreviewUrl,
    pushRecent,
  }
}
```

## query 预览

```vue
<!-- src/components/FileviewRemoteQueryDemo.vue -->
<template>
  <section class="panel">
    <h2>远程文件 query 预览</h2>

    <div class="grid">
      <label>
        文件地址
        <input v-model="form.url" type="text" />
      </label>

      <label>
        文件名
        <input v-model="form.fileName" type="text" />
      </label>

      <label>
        展示名称
        <input v-model="form.displayName" type="text" />
      </label>
    </div>

    <div class="actions">
      <button type="button" @click="openCurrent">打开预览</button>
      <button type="button" @click="copyCurrent">复制链接</button>
      <span v-if="copied" class="tip">已复制</span>
    </div>

    <textarea class="url-box" :value="previewUrl" readonly />
  </section>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import { useFileview } from '@/composables/useFileview'

const { buildPreviewUrl, openPreview, copyPreviewUrl, copied } = useFileview()

const form = reactive({
  url: 'https://example.com/files/demo.docx',
  fileName: 'demo.docx',
  displayName: '网络示例文档',
})

const previewUrl = computed(() =>
  buildPreviewUrl('query', {
    url: form.url,
    fileName: form.fileName,
    displayName: form.displayName,
  }),
)

function openCurrent() {
  openPreview(previewUrl.value)
}

async function copyCurrent() {
  await copyPreviewUrl(previewUrl.value)
}
</script>

<style scoped>
.panel {
  padding: 16px;
  border: 1px solid #dcdcdc;
  border-radius: 14px;
}
.grid {
  display: grid;
  gap: 12px;
  grid-template-columns: 1fr;
}
label {
  display: grid;
  gap: 6px;
}
input,
textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #dcdcdc;
  border-radius: 10px;
  box-sizing: border-box;
}
.actions {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 14px 0;
}
.url-box {
  min-height: 110px;
  font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
}
.tip {
  font-size: 12px;
  color: #0a7;
}
</style>
```

##  `data` base64 传参预览

```vue
<!-- src/components/FileviewRemoteDataDemo.vue -->
<template>
  <section class="panel">
    <h2>远程文件 data 预览</h2>

    <div class="grid">
      <label>
        文件地址
        <input v-model="form.url" type="text" />
      </label>

      <label>
        文件名
        <input v-model="form.fileName" type="text" />
      </label>

      <label>
        展示名称
        <input v-model="form.displayName" type="text" />
      </label>

      <label>
        水印
        <textarea v-model="form.watermark" rows="3" />
      </label>
    </div>

    <div class="actions">
      <button type="button" @click="openCurrent">打开预览</button>
      <button type="button" @click="copyCurrent">复制链接</button>
    </div>

    <textarea class="url-box" :value="previewUrl" readonly />
  </section>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import { useFileview } from '@/composables/useFileview'

const { buildPreviewUrl, openPreview, copyPreviewUrl } = useFileview()

const form = reactive({
  url: 'https://example.com/files/demo.docx',
  fileName: 'demo.docx',
  displayName: '隐藏参数示例',
  watermark: 'BaseMetas Fileview\nPreview',
})

const previewUrl = computed(() =>
  buildPreviewUrl('data', {
    url: form.url,
    fileName: form.fileName,
    displayName: form.displayName,
    watermark: form.watermark,
  }),
)

function openCurrent() {
  openPreview(previewUrl.value)
}

async function copyCurrent() {
  await copyPreviewUrl(previewUrl.value)
}
</script>

<style scoped>
.panel {
  padding: 16px;
  border: 1px solid #dcdcdc;
  border-radius: 14px;
}
.grid {
  display: grid;
  gap: 12px;
}
label {
  display: grid;
  gap: 6px;
}
input,
textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #dcdcdc;
  border-radius: 10px;
  box-sizing: border-box;
}
.actions {
  display: flex;
  gap: 12px;
  margin: 14px 0;
}
.url-box {
  min-height: 120px;
  font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
}
</style>
```

## 本地文件预览

```vue
<!-- src/components/FileviewLocalPathDemo.vue -->
<template>
  <section class="panel">
    <h2>本地文件 path 预览</h2>

    <div class="grid">
      <label>
        服务器本地路径
        <input v-model="form.path" type="text" />
      </label>

      <label>
        文件名
        <input v-model="form.fileName" type="text" />
      </label>

      <label>
        展示名称
        <input v-model="form.displayName" type="text" />
      </label>
    </div>

    <div class="actions">
      <button type="button" @click="openCurrent">打开预览</button>
      <button type="button" @click="copyCurrent">复制链接</button>
    </div>

    <textarea class="url-box" :value="previewUrl" readonly />
  </section>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import { useFileview } from '@/composables/useFileview'

const { buildPreviewUrl, openPreview, copyPreviewUrl } = useFileview()

const form = reactive({
  path: '/opt/myfiles/demo.docx',
  fileName: 'demo.docx',
  displayName: '服务器本地文档',
})

const previewUrl = computed(() =>
  buildPreviewUrl('path', {
    path: form.path,
    fileName: form.fileName,
    displayName: form.displayName,
  }),
)

function openCurrent() {
  openPreview(previewUrl.value)
}

async function copyCurrent() {
  await copyPreviewUrl(previewUrl.value)
}
</script>

<style scoped>
.panel {
  padding: 16px;
  border: 1px solid #dcdcdc;
  border-radius: 14px;
}
.grid {
  display: grid;
  gap: 12px;
}
label {
  display: grid;
  gap: 6px;
}
input,
textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #dcdcdc;
  border-radius: 10px;
  box-sizing: border-box;
}
.actions {
  display: flex;
  gap: 12px;
  margin: 14px 0;
}
.url-box {
  min-height: 120px;
  font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
}
</style>
```

## 嵌入式预览

```vue
<!-- src/components/FileviewEmbedPanel.vue -->
<template>
  <section ref="panelRef" class="panel">
    <div class="header">
      <h2>嵌入式预览</h2>
      <div class="actions">
        <button type="button" @click="toggleFullscreen">
          {{ isFullscreen ? '退出全屏' : '全屏' }}
        </button>
        <button type="button" @click="openCurrent">新窗口打开</button>
      </div>
    </div>

    <div class="grid">
      <label>
        文件地址
        <input v-model="form.url" type="text" />
      </label>

      <label>
        文件名
        <input v-model="form.fileName" type="text" />
      </label>

      <label>
        展示名称
        <input v-model="form.displayName" type="text" />
      </label>
    </div>

    <div class="iframe-wrap" :style="{ height: iframeHeight + 'px' }">
      <iframe :src="iframeSrc" title="fileview-embed" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useFullscreen, useWindowSize } from '@vueuse/core'
import { useFileview } from '@/composables/useFileview'

const panelRef = ref<HTMLElement | null>(null)
const { isFullscreen, toggle } = useFullscreen(panelRef)
const { height } = useWindowSize()
const { buildPreviewUrl, openPreview } = useFileview()

const form = reactive({
  url: 'https://example.com/files/demo.pdf',
  fileName: 'demo.pdf',
  displayName: '区域嵌入预览',
})

const iframeSrc = computed(() =>
  buildPreviewUrl('query', {
    url: form.url,
    fileName: form.fileName,
    displayName: form.displayName,
    mode: 'embed',
  }),
)

const iframeHeight = computed(() => Math.max(height.value - 220, 380))

function toggleFullscreen() {
  toggle()
}

function openCurrent() {
  openPreview(iframeSrc.value)
}
</script>

<style scoped>
.panel {
  padding: 16px;
  border: 1px solid #dcdcdc;
  border-radius: 14px;
}
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.actions {
  display: flex;
  gap: 12px;
}
.grid {
  display: grid;
  gap: 12px;
  margin: 14px 0;
}
label {
  display: grid;
  gap: 6px;
}
input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #dcdcdc;
  border-radius: 10px;
  box-sizing: border-box;
}
.iframe-wrap {
  width: 100%;
  border: 1px solid #e8e8e8;
  border-radius: 12px;
  overflow: hidden;
}
iframe {
  width: 100%;
  height: 100%;
  border: 0;
}
</style>
```

## 预览工作台

```vue
<!-- src/components/FileviewWorkbench.vue -->
<template>
  <section class="panel">
    <h2>预览工作台</h2>

    <div class="grid">
      <label>
        来源类型
        <select v-model="form.type">
          <option value="query">query</option>
          <option value="data">data</option>
          <option value="path">path</option>
        </select>
      </label>

      <label v-if="form.type !== 'path'">
        文件地址
        <input v-model="form.url" type="text" />
      </label>

      <label v-else>
        服务器本地路径
        <input v-model="form.path" type="text" />
      </label>

      <label>
        文件名
        <input v-model="form.fileName" type="text" />
      </label>

      <label>
        展示名称
        <input v-model="form.displayName" type="text" />
      </label>

      <label>
        水印
        <textarea v-model="form.watermark" rows="3" />
      </label>

      <label>
        显示模式
        <select v-model="form.mode">
          <option value="normal">normal</option>
          <option value="embed">embed</option>
        </select>
      </label>
    </div>

    <div class="actions">
      <button type="button" @click="openCurrent">打开预览</button>
      <button type="button" @click="copyCurrent">复制链接</button>
      <span v-if="copied" class="tip">已复制</span>
    </div>

    <textarea class="url-box" :value="previewUrl" readonly />

    <div class="recent">
      <h3>最近预览</h3>
      <div v-if="recent.length === 0" class="empty">暂无记录</div>
      <ul v-else>
        <li v-for="item in recent" :key="item.createdAt">
          <button type="button" class="recent-link" @click="openStored(item.url)">
            {{ item.title }}
          </button>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStorage } from '@vueuse/core'
import { useFileview, type FileviewMode, type FileviewSourceType } from '@/composables/useFileview'

interface WorkbenchForm {
  type: FileviewSourceType
  url: string
  path: string
  fileName: string
  displayName: string
  watermark: string
  mode: FileviewMode
}

const { buildPreviewUrl, openPreview, copyPreviewUrl, pushRecent, recent, copied } = useFileview()

const form = useStorage<WorkbenchForm>('fileview:workbench-form', {
  type: 'query',
  url: 'https://example.com/files/demo.docx',
  path: '/opt/myfiles/demo.docx',
  fileName: 'demo.docx',
  displayName: '工作台示例文档',
  watermark: 'BaseMetas Fileview\nWorkbench',
  mode: 'normal',
})

const previewUrl = computed(() => {
  const value = form.value

  if (value.type === 'path') {
    return buildPreviewUrl('path', {
      path: value.path,
      fileName: value.fileName,
      displayName: value.displayName,
      watermark: value.watermark,
      mode: value.mode,
    })
  }

  if (value.type === 'data') {
    return buildPreviewUrl('data', {
      url: value.url,
      fileName: value.fileName,
      displayName: value.displayName,
      watermark: value.watermark,
      mode: value.mode,
    })
  }

  return buildPreviewUrl('query', {
    url: value.url,
    fileName: value.fileName,
    displayName: value.displayName,
    watermark: value.watermark,
    mode: value.mode,
  })
})

function openCurrent() {
  const title = form.value.displayName || form.value.fileName
  pushRecent(title, previewUrl.value)
  openPreview(previewUrl.value)
}

async function copyCurrent() {
  await copyPreviewUrl(previewUrl.value)
}

function openStored(url: string) {
  openPreview(url)
}
</script>

<style scoped>
.panel {
  padding: 16px;
  border: 1px solid #dcdcdc;
  border-radius: 14px;
}
.grid {
  display: grid;
  gap: 12px;
}
label {
  display: grid;
  gap: 6px;
}
input,
select,
textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #dcdcdc;
  border-radius: 10px;
  box-sizing: border-box;
}
.actions {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 14px 0;
}
.tip {
  font-size: 12px;
  color: #0a7;
}
.url-box {
  min-height: 120px;
  font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
}
.recent {
  margin-top: 18px;
}
.empty {
  color: #888;
}
ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
li + li {
  margin-top: 8px;
}
.recent-link {
  width: 100%;
  text-align: left;
}
</style>
```

## 弹窗预览

```vue
<!-- src/components/FileviewModalPreview.vue -->
<template>
  <section class="panel">
    <h2>模态弹窗预览</h2>

    <div class="grid">
      <label>
        文件地址
        <input v-model="form.url" type="text" />
      </label>

      <label>
        文件名
        <input v-model="form.fileName" type="text" />
      </label>

      <label>
        展示名称
        <input v-model="form.displayName" type="text" />
      </label>
    </div>

    <div class="actions">
      <button @click="openModal">弹窗预览</button>
    </div>

    <!-- Modal -->
    <Teleport to="body">
      <div v-if="visible" class="modal-mask" @click.self="closeModal">
        <div ref="modalRef" class="modal-container">
          <div class="modal-header">
            <span>{{ form.displayName || form.fileName }}</span>
            <button @click="closeModal">关闭</button>
          </div>

          <div class="modal-body">
            <iframe
                v-if="iframeUrl"
                :src="iframeUrl"
                frameborder="0"
            />
          </div>
        </div>
      </div>
    </Teleport>
  </section>
</template>

<script setup lang="ts">
import { reactive, ref, computed, watch } from 'vue'
import { useFullscreen } from '@vueuse/core'
import { useFileview } from '@/composables/useFileview'

const { buildPreviewUrl } = useFileview()

const visible = ref(false)
const modalRef = ref<HTMLElement | null>(null)
const { toggle: toggleFullscreen } = useFullscreen(modalRef)

const form = reactive({
  url: 'https://example.com/files/demo.pdf',
  fileName: 'demo.pdf',
  displayName: '弹窗预览示例',
})

const iframeUrl = ref('')

const previewUrl = computed(() =>
    buildPreviewUrl('query', {
      url: form.url,
      fileName: form.fileName,
      displayName: form.displayName,
      mode: 'embed',
    }),
)

/**
 * 打开弹窗并加载预览
 */
function openModal() {
  visible.value = true
  iframeUrl.value = previewUrl.value
}

/**
 * 关闭弹窗并销毁 iframe
 */
function closeModal() {
  visible.value = false
  iframeUrl.value = ''
}

/**
 * 如果参数变化，实时刷新 iframe
 */
watch(previewUrl, (val) => {
  if (visible.value) {
    iframeUrl.value = val
  }
})
</script>

<style scoped>
.panel {
  padding: 16px;
  border: 1px solid #dcdcdc;
  border-radius: 14px;
}

.grid {
  display: grid;
  gap: 12px;
}

label {
  display: grid;
  gap: 6px;
}

input {
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
}

.actions {
  margin-top: 12px;
}

/* Modal 样式 */
.modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-container {
  width: 90%;
  height: 90%;
  background: #fff;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  border-bottom: 1px solid #eee;
}

.modal-body {
  flex: 1;
}

iframe {
  width: 100%;
  height: 100%;
}
</style>
```

