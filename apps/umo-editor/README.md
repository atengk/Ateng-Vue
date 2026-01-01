# Umo Editor

基于 Vue3 和 TipTap 的本土化开源文档编辑器

- [官网文档](https://www.umodoc.com/)



## 基础配置

**安装依赖包**

```
pnpm add @umoteam/editor@9.0.1 --filter @apps/umo-editor
```

**注册插件**

```typescript
import { createApp } from 'vue'
import App from './App.vue'

import { useUmoEditor } from '@umoteam/editor'

const app = createApp(App)

app.use(useUmoEditor, {
})

app.mount('#app')
```



## 最小示例

```vue
<template>
  <umo-editor v-bind="options" />
  <div>
    {{htmlContent}}
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { UmoEditor } from '@umoteam/editor'

const htmlContent = ref('<p>这是从后端回显的内容</p>')

const options = ref({
  editorKey: 'demo',
  height: '600px', // 或 '50vh' / '600px'
  document: {
    title: '标题',
    placeholder: '请输入内容...',
    content: htmlContent.value
  },
  async onSave(content, page, document) {
    htmlContent.value = content.html
    return true
  }
})
</script>
```

## 文件上传

```vue
<template>
  <umo-editor v-bind="options" />
  <div>
    {{htmlContent}}
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { UmoEditor } from '@umoteam/editor'

const htmlContent = ref('<p>这是从后端回显的内容</p>')

const options = ref({
  editorKey: 'demo',
  height: '600px', // 或 '50vh' / '600px'
  document: {
    title: '标题',
    placeholder: '请输入内容...',
    content: htmlContent.value
  },
  async onSave(content, page, document) {
    htmlContent.value = content.html
    return true
  },
  async onFileUpload(file) {
    // 这里你应该上传到后端
    // 示例：假装已经上传成功

    return {
      url: URL.createObjectURL(file),
      name: file.name
    }
  }
})
</script>
```

