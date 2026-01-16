<script setup lang="ts">
import { ref, onMounted } from 'vue'
import MarkdownRender from 'markstream-vue'

/**
 * 模拟一整段「大模型流式返回」的完整 Markdown
 * 覆盖：标题、列表、表格、代码、Mermaid、KaTeX、任务列表
 */
const fullMarkdown = `
# MarkStream-Vue 全功能测试 🚀

## 1. 普通文本
这是一个 **流式渲染 + 全功能 Markdown** 的综合测试。

---

## 2. 表格（GFM）
| Name | Age | Role |
|------|-----|------|
| Alice | 23 | Dev |
| Bob | 28 | QA |
| Tom | 32 | PM |

---

## 3. 任务列表
- [x] 支持 Markdown
- [x] 支持 流式输出
- [x] 支持 Mermaid
- [x] 支持 KaTeX
- [x] 支持 Monaco

---

## 4. 普通代码块（Shiki 高亮）
\`\`\`ts
export function hello(name: string): string {
  return \`Hello \${name}\`
}
\`\`\`

---

## 5. Monaco 交互代码块
\`\`\`monaco
function sum(a: number, b: number): number {
  return a + b
}
console.log(sum(1, 2))
\`\`\`

---

## 6. Mermaid 流程图
\`\`\`mermaid
graph TD
  A[开始] --> B{是否登录}
  B -->|是| C[进入首页]
  B -->|否| D[跳转登录]
\`\`\`

---

## 7. 数学公式（KaTeX）

行内公式：$E = mc^2$

块级公式：

$$
\\int_{0}^{\\infty} e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}
$$

---

## 8. 结束语
如果这些内容都能正常显示，说明你的 markstream-vue 全功能是 **完全 OK 的** 🎉
`

// 当前已经“流式输出”的内容
const streamContent = ref('')

// 模拟流式：逐字写入
function startStream() {
  streamContent.value = ''
  let index = 0

  const timer = setInterval(() => {
    streamContent.value += fullMarkdown[index]
    index++

    if (index >= fullMarkdown.length) {
      clearInterval(timer)
    }
  }, 20) // 20ms 一个字符，很像 LLM 输出
}

onMounted(() => {
  startStream()
})
</script>

<template>
  <div class="page">
    <h2>MarkStream-Vue 流式全功能渲染示例</h2>

    <!-- 渲染容器（固定在一个框里） -->
    <div class="markdown-box">
      <MarkdownRender
          :content="streamContent"
      />
    </div>

    <el-button type="primary" @click="startStream">
      重新开始流式渲染
    </el-button>
  </div>
</template>

<style scoped>
.page {
  padding: 20px;
}

/* 控制渲染只在一个“框”里 */
.markdown-box {
  width: 100%;
  max-width: 900px;
  height: 500px;
  overflow-y: auto;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  padding: 16px;
  background: #fafafa;
  margin-bottom: 16px;
}

/* 可选：更像聊天窗口 */
.markdown-box::-webkit-scrollbar {
  width: 6px;
}
.markdown-box::-webkit-scrollbar-thumb {
  background: #c0c4cc;
  border-radius: 3px;
}
</style>
