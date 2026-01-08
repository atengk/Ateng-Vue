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