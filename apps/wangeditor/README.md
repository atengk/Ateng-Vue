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
import type { IDomEditor, IToolbarConfig } from '@wangeditor/editor'
import '@wangeditor/editor/dist/css/style.css'

/**
 * 富文本内容（HTML）
 */
const valueHtml = ref<string>('<p>Hello WangEditor</p>')

/**
 * Editor 实例引用
 */
const editorRef = shallowRef<IDomEditor | null>(null)

/**
 * 工具栏配置
 */
const toolbarConfig: Partial<IToolbarConfig> = {
  toolbarKeys: [
    'bold',
    'italic',
    'underline',
    'through',
    '|',
    'color',
    'bgColor',
    '|',
    'fontSize',
    'fontFamily',
    '|',
    'justifyLeft',
    'justifyCenter',
    'justifyRight',
    '|',
    'undo',
    'redo'
  ]
}

/**
 * 编辑器配置
 */
const editorConfig: Record<string, unknown> = {
  placeholder: '请输入内容...'
}

/**
 * 创建完成回调
 */
function handleCreated(editor: IDomEditor): void {
  editorRef.value = editor
}

/**
 * 组件卸载时销毁编辑器
 */
onBeforeUnmount(() => {
  editorRef.value?.destroy()
  editorRef.value = null
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
        @onCreated="handleCreated"
    />
  </div>
</template>
```

## 只读模式

```vue
<script setup lang="ts">
import { ref, shallowRef, onBeforeUnmount } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import type { IDomEditor, IToolbarConfig } from '@wangeditor/editor'
import '@wangeditor/editor/dist/css/style.css'

/**
 * 富文本内容（HTML）
 */
const valueHtml = ref<string>('<p>Hello WangEditor</p>')

/**
 * Editor 实例引用
 */
const editorRef = shallowRef<IDomEditor | null>(null)

/**
 * 工具栏配置
 */
const toolbarConfig: Partial<IToolbarConfig> = {}

/**
 * 编辑器配置
 */
const editorConfig: Record<string, unknown> = {
  placeholder: '请输入内容...',
  readOnly: true
}

/**
 * 创建完成回调
 */
function handleCreated(editor: IDomEditor): void {
  editorRef.value = editor
}

/**
 * 组件卸载时销毁编辑器
 */
onBeforeUnmount(() => {
  editorRef.value?.destroy()
  editorRef.value = null
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
        @onCreated="handleCreated"
    />
  </div>
</template>
```

## 极简工具栏

```vue
<script setup lang="ts">
import { ref, shallowRef, onBeforeUnmount } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import type { IDomEditor, IToolbarConfig } from '@wangeditor/editor'
import '@wangeditor/editor/dist/css/style.css'

/**
 * 富文本内容（HTML）
 */
const valueHtml = ref<string>('<p>Hello WangEditor</p>')

/**
 * Editor 实例引用
 */
const editorRef = shallowRef<IDomEditor | null>(null)

/**
 * 工具栏配置
 */
const toolbarConfig: Partial<IToolbarConfig> = {
  toolbarKeys: [
    'bold',
    'italic',
    'underline',
    '|',
    'undo',
    'redo'
  ]
}

/**
 * 编辑器配置
 */
const editorConfig: Record<string, unknown> = {
  placeholder: '请输入内容...'
}

/**
 * 创建完成回调
 */
function handleCreated(editor: IDomEditor): void {
  editorRef.value = editor
}

/**
 * 组件卸载时销毁编辑器
 */
onBeforeUnmount(() => {
  editorRef.value?.destroy()
  editorRef.value = null
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
        @onCreated="handleCreated"
    />
  </div>
</template>
```

## 监听内容变化

```vue
<script setup lang="ts">
import { ref, shallowRef, onBeforeUnmount } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import type { IDomEditor, IToolbarConfig } from '@wangeditor/editor'
import '@wangeditor/editor/dist/css/style.css'

/**
 * 富文本内容（HTML）
 */
const valueHtml = ref<string>('<p>Hello WangEditor</p>')

/**
 * Editor 实例引用
 */
const editorRef = shallowRef<IDomEditor | null>(null)

/**
 * 工具栏配置
 */
const toolbarConfig: Partial<IToolbarConfig> = {}

/**
 * 编辑器配置
 */
const editorConfig: Record<string, unknown> = {
  placeholder: '请输入内容...'
}

/**
 * 内容变更回调
 */
function handleChange(editor: IDomEditor): void {
  const html: string = editor.getHtml()
  const text: string = editor.getText()

  console.log('html:', html)
  console.log('text:', text)
}

/**
 * 创建完成回调
 */
function handleCreated(editor: IDomEditor): void {
  editorRef.value = editor
}

/**
 * 组件卸载时销毁编辑器
 */
onBeforeUnmount(() => {
  editorRef.value?.destroy()
  editorRef.value = null
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
        @onCreated="handleCreated"
        @onChange="handleChange"
    />
  </div>
</template>
```



## 上传图片

### 方式一（推荐）：使用后端上传接口 `server`

**editorConfig 中配置 uploadImage**

```
const editorConfig: Record<string, unknown> = {
  placeholder: '请输入内容...',
  MENU_CONF: {
    uploadImage: {
      server: '/api/upload/image',
      fieldName: 'file',

      // 单个文件大小限制（单位：字节）
      maxFileSize: 2 * 1024 * 1024,

      // 最多上传数量
      maxNumberOfFiles: 5,

      // 允许的图片类型
      allowedFileTypes: ['image/*'],

      // headers（如 token）
      headers: {
        Authorization: 'Bearer token'
      },

      // 超时
      timeout: 10 * 1000
    }
  }
}
```

------

**后端返回格式（⚠️ 非常重要）**

后端 **必须返回这个结构**（字段名固定）：

```
{
  "errno": 0,
  "data": {
    "url": "https://xxx.com/image.png"
  }
}
```

或多图：

```
{
  "errno": 0,
  "data": [
    { "url": "https://xxx.com/1.png" },
    { "url": "https://xxx.com/2.png" }
  ]
}
```

❌ 字段不一致 = 上传成功但编辑器报错
 这是很多人踩坑的地方。

### 方式二：`customUpload`（前端完全接管）

**适合：**

- OSS / COS / S3
- 统一 request 封装
- 特殊鉴权逻辑

------

**官方标准 customUpload 写法**

```
import type { UploadImageMenuConfig } from '@wangeditor/editor'

const editorConfig: Record<string, unknown> = {
  placeholder: '请输入内容...',
  MENU_CONF: {
    uploadImage: {
      customUpload(file: File, insertFn) {
        // 1. 构造 FormData
        const formData = new FormData()
        formData.append('file', file)

        // 2. 调用你自己的上传接口
        fetch('/api/upload/image', {
          method: 'POST',
          body: formData
        })
          .then(res => res.json())
          .then(res => {
            // 3. 插入图片
            insertFn(res.url)
          })
          .catch(() => {
            console.error('图片上传失败')
          })
      }
    } as UploadImageMenuConfig
  }
}
```

------

**`insertFn` 是什么？**

```
insertFn(
  src: string,
  alt?: string,
  href?: string
)
```

👉 它是 **编辑器唯一认可的插入方式**

## 上传视频

### 方式一：`server`（后端直传，最简单）

适用场景

* 普通后台系统
* 后端已提供上传接口
* 不需要前端参与鉴权 / 分片

---

1️⃣ editorConfig 配置（官方字段）

```ts
const editorConfig: Record<string, unknown> = {
  placeholder: '请输入内容...',
  MENU_CONF: {
    uploadVideo: {
      server: '/api/upload/video',
      fieldName: 'file',

      // 单文件大小限制（字节）
      maxFileSize: 50 * 1024 * 1024,

      // 最大上传数量
      maxNumberOfFiles: 1,

      // 允许的视频类型
      allowedFileTypes: ['video/*'],

      // 请求头（如 token）
      headers: {
        Authorization: 'Bearer token'
      },

      // 超时时间
      timeout: 15 * 1000
    }
  }
}
```

---

2️⃣ 后端返回格式（必须）

```json
{
  "errno": 0,
  "data": {
    "url": "https://cdn.xxx.com/video.mp4"
  }
}
```

或数组：

```json
{
  "errno": 0,
  "data": [
    { "url": "https://cdn.xxx.com/1.mp4" }
  ]
}
```

❗ **字段名固定：`errno` / `data.url`**

---

3️⃣ 工具栏记得加

```ts
const toolbarConfig = {
  toolbarKeys: ['uploadVideo']
}
```

---

### 方式二：`customUpload`（前端完全接管，企业常用）

适用场景

* OSS / COS / S3
* 自定义鉴权
* 统一 request 封装
* 进度控制

---

1️⃣ 定义最小插入函数类型（TS 关键）

```ts
type InsertVideoFn = (src: string, poster?: string) => void
```

---

2️⃣ 实现上传逻辑

```ts
function uploadVideo(file: File, insertFn: InsertVideoFn): void {
  const formData = new FormData()
  formData.append('file', file)

  fetch('/api/upload/video', {
    method: 'POST',
    body: formData
  })
    .then(res => res.json())
    .then(res => {
      // 假设返回 { url: string }
      insertFn(res.url)
    })
    .catch(() => {
      console.error('视频上传失败')
    })
}
```

---

3️⃣ editorConfig 配置

```ts
const editorConfig: Record<string, unknown> = {
  placeholder: '请输入内容...',
  MENU_CONF: {
    uploadVideo: {
      customUpload: uploadVideo
    }
  }
}
```

---

