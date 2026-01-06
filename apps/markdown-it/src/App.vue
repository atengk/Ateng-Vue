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