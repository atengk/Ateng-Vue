# WangEditor v5

开源 Web 富文本编辑器，开箱即用，配置简单

- [官网地址](https://www.wangeditor.com/)



## 基础配置

**安装依赖**

```
pnpm add @wangeditor/editor@5.1.12 @wangeditor/editor-for-vue@5.1.12 --filter @apps/wangeditor
```

**添加类型声明文件**

```typescript
// src/types/wangeditor.d.ts
declare module '@wangeditor/editor-for-vue' {
  import type { Component } from 'vue'

  export const Editor: Component
  export const Toolbar: Component
}
```



## 最小示例

```vue
<script setup lang="ts">
import { ref, shallowRef, onBeforeUnmount } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import '@wangeditor/editor/dist/css/style.css'

const valueHtml = ref('<p>Hello WangEditor</p>')
const editorRef = shallowRef()

const toolbarConfig = {}
const editorConfig = {
  placeholder: '请输入内容...'
}

onBeforeUnmount(() => {
  if (editorRef.value) {
    editorRef.value.destroy()
  }
})
</script>

<template>
  <div style="border: 1px solid #ccc">
    <Toolbar
        :editor="editorRef"
        :defaultConfig="toolbarConfig"
        mode="default"
    />
    <Editor
        v-model="valueHtml"
        :defaultConfig="editorConfig"
        mode="default"
        style="height: 300px"
        @onCreated="editorRef = $event"
    />
  </div>
</template>
```

