# Marked

一款 Markdown 解析器和编译器，速度极快。

- [官网地址](https://marked.js.org/)



## 基础配置

**安装依赖**

```
pnpm add marked@17.0.1 highlight.js@11.11.1 github-markdown-css
```

**全局makedown样式**

`src/main.ts`

```ts
import 'github-markdown-css/github-markdown-light.css'
import 'highlight.js/styles/github.css'
```

## 最简示例

```vue
<template>
  <div class="markdown" v-html="html"></div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { marked } from 'marked'

const markdown = `
# Hello Marked

这是 **Markdown** 渲染示例。

- Vue 3
- TypeScript
- Marked
`

const html = computed(() => marked(markdown))
</script>

<style scoped>
.markdown {
  line-height: 1.6;
}
</style>
```

![image-20260108170940928](./assets/image-20260108170940928.png)

## 展示更多数据

```vue
<template>
  <div class="markdown-body" v-html="html"></div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { marked } from 'marked'

const markdown = `
# 表格示例

| 名称 | 年龄 | 职业 |
| ---- | ---- | ---- |
| 张三 | 18 | 前端 |
| 李四 | 20 | 后端 |

## 列表示例

- Vue3
- TypeScript
- Marked

## 引用示例

> 这是一段引用文字

## 代码示例

\`\`\`ts
const a: number = 1
\`\`\`
`

const html = computed(() => marked(markdown))
</script>

<style scoped>

</style>
```

## 代码高亮

```vue
<template>
  <div class="markdown-body" v-html="html"></div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {marked, type Tokens} from 'marked'
import hljs from 'highlight.js'

marked.use({
  gfm: true,
  breaks: true,
  walkTokens(token) {
    if (token.type !== 'code') {
      return
    }

    const codeToken = token as Tokens.Code
    const lang = codeToken.lang
    const code = codeToken.text

    if (lang && hljs.getLanguage(lang)) {
      codeToken.text = hljs.highlight(code, { language: lang }).value
      codeToken.escaped = true
      return
    }

    codeToken.text = hljs.highlightAuto(code).value
    codeToken.escaped = true
  }
})

const markdown = `
# Marked + highlight.js

## 表格

| 名称 | 技术 |
| ---- | ---- |
| 前端 | Vue3 |
| 后端 | Spring Boot |

## 代码高亮（TS）

\`\`\`ts
interface User {
  id: number
  name: string
}

const user: User = {
  id: 1,
  name: 'Ateng'
}
\`\`\`

## 代码高亮（Java）

\`\`\`java
public class Demo {
    public static void main(String[] args) {
        System.out.println("Hello Marked");
    }
}
\`\`\`
`

const html = computed(() => marked(markdown))
</script>
```



## 流式输出（代办）

```vue

```

