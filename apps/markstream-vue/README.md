# markstream-vue

为 Vue 3 提供快速、适合流媒体播放的 Markdown 渲染——渐进式 Mermaid、流式差异代码块和针对大型文档优化的实时预览。

- [官网地址](https://markstream-vue.simonhe.me/)



## 基础配置

**安装依赖**

```
pnpm add markstream-vue
```

**全局引入样式**

`src/main.ts`

```
import 'markstream-vue/index.css'
```



## 安装所有功能

如果你希望启用所有可选支持（代码高亮、实时代码块、Mermaid、数学公式等），可以一次性安装：

**安装依赖**

```
pnpm add shiki markstream-vue stream-markdown stream-monaco mermaid katex
```

**全局引入样式**

`src/main.ts`

```ts
import 'markstream-vue/index.css'
import 'katex/dist/katex.min.css'
```

**启用加载器**

`src/main.ts`

```ts
import { enableKatex, enableMermaid } from 'markstream-vue'

enableMermaid()
enableKatex()
```

- `enableMermaid()` → 自动注册 Mermaid 渲染
- `enableKatex()` → 自动注册数学公式 inline/block 节点



## 最简示例

```vue
<script setup lang="ts">
import MarkdownRender from 'markstream-vue'

const md = `# Hello World\n\n这是 **加粗** 的文本。`
</script>

<template>
  <MarkdownRender :content="md" />
</template>
```



## 流式渲染

```vue
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
```

