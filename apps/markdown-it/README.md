# markdown-it

Markdown 解析器，做得对。 100% CommonMark 支持、扩展、语法插件和高速

- [官网地址](https://github.com/markdown-it/markdown-it)



## 基础配置

**安装依赖**

```
pnpm add markdown-it@14.1.0 @types/markdown-it highlight.js@11.11.1 github-markdown-css
```

**全局makedown样式**

`src/main.ts`

```ts
import 'github-markdown-css/github-markdown-light.css'
```

**创建工具类**

```ts
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'

export const md = new MarkdownIt({
    html: true,
    linkify: true,
    breaks: true,
    highlight(code, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return hljs.highlight(code, { language: lang }).value
            } catch (e) {
                /* ignore */
            }
        }
        // 自动识别
        return hljs.highlightAuto(code).value
    }
})

export function renderMarkdown(content: string): string {
    return md.render(content || '')
}
```



## 最简示例

```vue
<template>
  <div class="app">
    <h1>Markdown 渲染示例</h1>

    <textarea
        v-model="source"
        class="editor"
        placeholder="请输入 Markdown 内容..."
    />

    <h2>预览</h2>
    <div class="markdown-body" v-html="html" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { renderMarkdown } from '@/utils/markdown'

const source = ref(`# Hello Markdown

## 列表
- Vue 3
- TypeScript
- markdown-it

## 代码
\`\`\`ts
function hello(name: string): string {
  return 'Hello ' + name
}
\`\`\`
`)

const html = computed(() => renderMarkdown(source.value))
</script>

<style>
.app {
  max-width: 900px;
  margin: 24px auto;
  font-family: Arial, Helvetica, sans-serif;
}

.editor {
  width: 100%;
  height: 160px;
  padding: 12px;
  box-sizing: border-box;
  font-family: Consolas, monospace;
}

.markdown-body {
  margin-top: 16px;
  padding: 16px;
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
}

/* 代码高亮补充样式 */
.markdown-body pre {
  padding: 12px;
  overflow: auto;
  border-radius: 6px;
}
</style>
```



## 流式输出

### 封装 useMarkdownStream

`src/composables/useMarkdownStream.ts`

```ts
import { ref } from 'vue'
import { renderMarkdown } from '@/utils/markdown'

/**
 * Markdown 流式渲染 composable
 */
export function useMarkdownStream(options?: {
    throttleMs?: number
    autoScroll?: boolean
}) {
    const source = ref('')
    const html = ref('')

    const throttleMs = options?.throttleMs ?? 50
    const autoScroll = options?.autoScroll ?? true

    let buffer = ''
    let timer: number | null = null

    /**
     * 启动节流渲染
     */
    function start() {
        stop()
        timer = window.setInterval(() => {
            if (!buffer) return
            source.value += buffer
            buffer = ''
            html.value = renderMarkdown(source.value)
            if (autoScroll) scrollToBottom()
        }, throttleMs)
    }

    /**
     * 停止流式
     */
    function stop() {
        if (timer) {
            clearInterval(timer)
            timer = null
        }
    }

    /**
     * 重置内容
     */
    function reset() {
        source.value = ''
        html.value = ''
        buffer = ''
    }

    /**
     * 追加流式内容
     */
    function append(chunk: string) {
        buffer += chunk
    }

    /**
     * 滚动到底部（ChatGPT 风格）
     */
    function scrollToBottom() {
        requestAnimationFrame(() => {
            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: 'smooth'
            })
        })
    }

    return {
        source,
        html,
        start,
        stop,
        reset,
        append
    }
}
```

### App.vue

```vue
<template>
  <div class="app">
    <h1>AI Markdown 流式输出</h1>

    <button @click="startStream">开始输出</button>

    <div
        class="markdown-body"
        v-html="html"
        ref="containerRef"
    />
  </div>
</template>

<script setup lang="ts">
import { onUnmounted } from 'vue'
import { useMarkdownStream } from '@/composables/useMarkdownStream'

const {
  html,
  start,
  stop,
  reset,
  append
} = useMarkdownStream({
  throttleMs: 60,
  autoScroll: true
})

const chunks = [
  '# ChatGPT 风格流式 Markdown\n\n',
  '这是一个 **逐步输出** 的示例。\n\n',
  '## 特性\n\n',
  '- 自动滚动\n',
  '- 流式渲染\n',
  '- 节流优化\n\n',
  '## 代码示例\n\n',
  '```ts\n',
  'function greet(name: string) {\n',
  '  return `Hello ${name}`\n',
  '}\n',
  '```\n\n',
  '输出完成 ✅'
]

function startStream() {
  reset()
  start()

  let index = 0
  const timer = setInterval(() => {
    const chunk = chunks[index]
    if (chunk === undefined) {
      clearInterval(timer)
      stop()
      return
    }

    append(chunk)
    index++
  }, 200)
}

onUnmounted(() => {
  stop()
})
</script>

<style>
.app {
  max-width: 900px;
  margin: 24px auto;
  font-family: system-ui, -apple-system, BlinkMacSystemFont;
}

button {
  margin-bottom: 12px;
  padding: 6px 12px;
}

.markdown-body {
  padding: 16px;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  min-height: 300px;
}

</style>
```

![image-20260106104953144](./C:/Program Files/JetBrains/WebStorm 2025.2/assets/image-20260106104953144.png)

## 代码块复制按钮

### 封装复制工具函数

`src/utils/enhanceCodeBlocks`

```ts
export function enhanceCodeBlocks(container: HTMLElement): void {
    const pres = container.querySelectorAll('pre')

    pres.forEach((pre) => {
        if (pre.classList.contains('code-enhanced')) {
            return
        }

        const code = pre.querySelector('code')
        if (!code) {
            return
        }

        pre.classList.add('code-enhanced')

        const langClass = [...code.classList].find(c => c.startsWith('language-'))
        const lang = langClass ? langClass.replace('language-', '') : 'text'

        const wrapper = document.createElement('div')
        wrapper.className = 'code-wrapper'

        const header = document.createElement('div')
        header.className = 'code-header'

        header.innerHTML = `
      <span class="code-lang">${lang}</span>
      <button class="code-copy">复制</button>
    `

        const copyBtn = header.querySelector('.code-copy') as HTMLButtonElement
        copyBtn.onclick = async () => {
            await navigator.clipboard.writeText(code.textContent || '')
            copyBtn.textContent = '已复制'
            setTimeout(() => (copyBtn.textContent = '复制'), 1200)
        }

        pre.parentNode?.insertBefore(wrapper, pre)
        wrapper.appendChild(header)
        wrapper.appendChild(pre)
    })
}
```

### 创建样式

`src/styles/markdown.css`

```css
.code-wrapper {
    margin: 16px 0;
    border-radius: 8px;
    overflow: hidden;
    background: #f6f8fa;
}

.code-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 12px;
    font-size: 12px;
    background: #f0f2f5;
    border-bottom: 1px solid #e5e7eb;
}

.code-lang {
    font-weight: 600;
    color: #57606a;
    text-transform: lowercase;
}

.code-copy {
    border: none;
    background: transparent;
    cursor: pointer;
    color: #0969da;
}

.code-copy:hover {
    text-decoration: underline;
}

.code-wrapper pre {
    margin: 0;
    padding: 12px;
    background: transparent;
}
```

### 全局引用

`src/main.ts`

```ts
import 'github-markdown-css/github-markdown-light.css'
import '@/styles/markdown.css'
```

### App.vue

```vue
<template>
  <div class="app">
    <h1>AI Markdown 流式输出</h1>

    <button @click="startStream">开始输出</button>

    <div
        class="markdown-body"
        v-html="html"
        ref="containerRef"
    />
  </div>
</template>

<script setup lang="ts">
import { onUnmounted, ref, watch, nextTick } from 'vue'
import { useMarkdownStream } from '@/composables/useMarkdownStream'
import {enhanceCodeBlocks} from "@/utils/enhanceCodeBlock";

/* =======================
 * Markdown 流式核心
 * ======================= */
const {
  html,
  start,
  stop,
  reset,
  append
} = useMarkdownStream({
  throttleMs: 100,
  autoScroll: true
})

/* =======================
 * DOM 引用
 * ======================= */
const containerRef = ref<HTMLElement | null>(null)

/* =======================
 * 监听 Markdown 渲染
 * ======================= */
watch(
    () => html.value,
    async () => {
      await nextTick()
      if (containerRef.value) {
        enhanceCodeBlocks(containerRef.value)
      }
    },
    { immediate: true }
)

/* =======================
 * 模拟流式输出
 * ======================= */
const chunks = [
  '# ChatGPT 风格流式 Markdown\n\n',
  '这是一个 **逐步输出** 的示例。\n\n',
  '## 特性\n\n',
  '- 自动滚动\n',
  '- 流式渲染\n',
  '- 节流优化\n\n',
  '## 代码示例\n\n',
  '```ts\n',
  'function greet(name: string) {\n',
  '  return `Hello ${name}`\n',
  '}\n',
  '```\n\n',
  '输出完成 ✅'
]

function startStream() {
  reset()
  start()

  let index = 0
  const timer = setInterval(() => {
    const chunk = chunks[index]
    if (chunk === undefined) {
      clearInterval(timer)
      stop()
      return
    }

    append(chunk)
    index++
  }, 200)
}

onUnmounted(() => {
  stop()
})
</script>

<style>
.app {
  max-width: 900px;
  margin: 24px auto;
  font-family: system-ui, -apple-system, BlinkMacSystemFont;
}

button {
  margin-bottom: 12px;
  padding: 6px 12px;
}

.markdown-body {
  padding: 16px;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  min-height: 300px;
}

</style>
```



## 代码块复制按钮

### 封装复制工具函数

`src/utils/enhanceCodeBlocks`

```ts
export function enhanceCodeBlocks(container: HTMLElement): void {
    const pres = container.querySelectorAll('pre')

    pres.forEach((pre) => {
        if (pre.classList.contains('code-enhanced')) {
            return
        }

        const code = pre.querySelector('code')
        if (!code) {
            return
        }

        pre.classList.add('code-enhanced')

        const langClass = [...code.classList].find(c => c.startsWith('language-'))
        const lang = langClass ? langClass.replace('language-', '') : 'text'

        const wrapper = document.createElement('div')
        wrapper.className = 'code-wrapper'

        const header = document.createElement('div')
        header.className = 'code-header'

        header.innerHTML = `
      <span class="code-lang">${lang}</span>
      <button class="code-copy">复制</button>
    `

        const copyBtn = header.querySelector('.code-copy') as HTMLButtonElement
        copyBtn.onclick = async () => {
            await navigator.clipboard.writeText(code.textContent || '')
            copyBtn.textContent = '已复制'
            setTimeout(() => (copyBtn.textContent = '复制'), 1200)
        }

        pre.parentNode?.insertBefore(wrapper, pre)
        wrapper.appendChild(header)
        wrapper.appendChild(pre)
    })
}
```

### 创建样式

`src/styles/markdown.css`

```css
.code-wrapper {
    margin: 16px 0;
    border-radius: 8px;
    overflow: hidden;
    background: #f6f8fa;
}

.code-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 12px;
    font-size: 12px;
    background: #f0f2f5;
    border-bottom: 1px solid #e5e7eb;
}

.code-lang {
    font-weight: 600;
    color: #57606a;
    text-transform: lowercase;
}

.code-copy {
    border: none;
    background: transparent;
    cursor: pointer;
    color: #0969da;
}

.code-copy:hover {
    text-decoration: underline;
}

.code-wrapper pre {
    margin: 0;
    padding: 12px;
    background: transparent;
}
```

### 全局引用

`src/main.ts`

```ts
import 'github-markdown-css/github-markdown-light.css'
import '@/styles/markdown.css'
```

### App.vue

```vue
<template>
  <div class="app">
    <h1>AI Markdown 流式输出</h1>

    <button @click="startStream">开始输出</button>

    <div
        class="markdown-body"
        v-html="html"
        ref="containerRef"
    />
  </div>
</template>

<script setup lang="ts">
import { onUnmounted, ref, watch, nextTick } from 'vue'
import { useMarkdownStream } from '@/composables/useMarkdownStream'
import {enhanceCodeBlocks} from "@/utils/enhanceCodeBlock";

/* =======================
 * Markdown 流式核心
 * ======================= */
const {
  html,
  start,
  stop,
  reset,
  append
} = useMarkdownStream({
  throttleMs: 100,
  autoScroll: true
})

/* =======================
 * DOM 引用
 * ======================= */
const containerRef = ref<HTMLElement | null>(null)

/* =======================
 * 监听 Markdown 渲染
 * ======================= */
watch(
    () => html.value,
    async () => {
      await nextTick()
      if (containerRef.value) {
        enhanceCodeBlocks(containerRef.value)
      }
    },
    { immediate: true }
)

/* =======================
 * 模拟流式输出
 * ======================= */
const chunks = [
  '# ChatGPT 风格流式 Markdown\n\n',
  '这是一个 **逐步输出** 的示例。\n\n',
  '## 特性\n\n',
  '- 自动滚动\n',
  '- 流式渲染\n',
  '- 节流优化\n\n',
  '## 代码示例\n\n',
  '```ts\n',
  'function greet(name: string) {\n',
  '  return `Hello ${name}`\n',
  '}\n',
  '```\n\n',
  '输出完成 ✅'
]

function startStream() {
  reset()
  start()

  let index = 0
  const timer = setInterval(() => {
    const chunk = chunks[index]
    if (chunk === undefined) {
      clearInterval(timer)
      stop()
      return
    }

    append(chunk)
    index++
  }, 200)
}

onUnmounted(() => {
  stop()
})
</script>

<style>
.app {
  max-width: 900px;
  margin: 24px auto;
  font-family: system-ui, -apple-system, BlinkMacSystemFont;
}

button {
  margin-bottom: 12px;
  padding: 6px 12px;
}

.markdown-body {
  padding: 16px;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  min-height: 300px;
}

</style>
```

