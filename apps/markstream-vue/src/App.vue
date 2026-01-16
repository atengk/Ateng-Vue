<script setup lang="ts">
import { ref } from 'vue'
import MarkdownRender from 'markstream-vue'

const content = ref('')  // 用于流式追加 Markdown 内容

// 模拟逐字符流入（典型 AI/SSE 模式）
const fullText = `
# 欢迎使用 markstream-vue 🌊

这是一个 **实时流式渲染 Markdown** 的示例！

- 支持标题
- 支持列表
- 支持代码块

\`\`\`js
console.log('hello world')
\`\`\`
`

// 逐字符追加内容
let idx = 0
const timer = setInterval(() => {
  if (idx < fullText.length) {
    content.value += fullText[idx]
    idx++
  } else {
    clearInterval(timer)
  }
}, 50)
</script>

<template>
  <div>
    <!-- 传入实时变化的 content -->
    <MarkdownRender :content="content" />
  </div>
</template>
