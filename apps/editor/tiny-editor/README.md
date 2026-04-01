# TinyEditor 富文本编辑器

TinyEditor 是一个基于 Quill 2.0 的富文本编辑器，在 Quill 基础上扩展了表格、图片、超链接、复制粘贴、插入表情、文件上传、@提醒、斜杆菜单等丰富的模块和格式，框架无关、兼容 Quill API、兼容 Quill 模块生态。

- [官网地址](https://github.com/opentiny/tiny-editor)



## 基础配置

**安装依赖**

```
pnpm add @opentiny/fluent-editor@4.0.0
```

**全局引入样式**

`src/main.ts`

```ts
import '@opentiny/fluent-editor/style.css'
```



## 最简示例

```vue
<template>
  <div class="container">
    <div ref="editorRef" class="editor"></div>

    <h3>内容</h3>
    <pre>{{ html }}</pre>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import FluentEditor from '@opentiny/fluent-editor'

/** 编辑器 DOM 引用 */
const editorRef = ref<HTMLDivElement | null>(null)

/** editor 实例 */
let editor: FluentEditor | null = null

/** HTML 内容 */
const html = ref('')

onMounted(() => {
  if (!editorRef.value) return

  editor = new FluentEditor(editorRef.value, {
    theme: 'snow',
    placeholder: '请输入内容',
    modules: {
      i18n: {
        lang: 'zh-CN'
      }
    }
  })

  // 监听 Quill 的 text-change 事件
  editor.on('text-change', () => {
    // 直接从 DOM 获取 HTML
    html.value = editor?.root?.innerHTML ?? ''
  })
})
</script>

<style scoped>
.container {
  padding: 20px;
}

.editor {
  height: 400px;
  margin-bottom: 16px;
}
</style>
```

## 常用配置

```vue
<template>
  <div class="container">
    <div ref="editorRef" class="editor"></div>

    <h3>内容</h3>
    <pre>{{ html }}</pre>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted, onUnmounted} from 'vue'
import FluentEditor from '@opentiny/fluent-editor'
import type {IEditorConfig, IEditorModules, ToolbarOptions} from '@opentiny/fluent-editor'

/** 编辑器 DOM 引用 */
const editorRef = ref<HTMLDivElement | null>(null)

/** editor 实例 */
let editor: FluentEditor | null = null

/** HTML 内容 */
const html = ref('')

/**
 * 常用工具栏配置
 */
const toolbarOptions: ToolbarOptions = {
  container: [
    // 文本样式
    ['bold', 'italic', 'underline', 'strike'],

    // 标题
    [{ header: [1, 2, 3, 4, false] }],

    // 字体大小 & 颜色
    [{ size: ['small', false, 'large', 'huge'] }],
    [{ color: [] }, { background: [] }],

    // 对齐方式
    [{ align: [] }],

    // 列表 & 缩进
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ indent: '-1' }, { indent: '+1' }],

    // 引用 & 代码
    ['blockquote', 'code-block'],

    // 链接
    ['link'],

    // 清除格式
    ['clean']
  ]
}

/**
 * 编辑器 modules 配置
 */
const editorModules: IEditorModules = {
  toolbar: toolbarOptions,
  i18n: {
    lang: 'zh-CN'
  }
}

/**
 * 编辑器基础配置
 * 这里只放 FluentEditor 构造函数真正支持的字段
 */
const editorOptions: IEditorConfig = {
  theme: 'snow',
  placeholder: '请输入内容',
  modules: editorModules
}

onMounted(() => {
  if (!editorRef.value) return

  editor = new FluentEditor(editorRef.value, editorOptions)

  // 监听 Quill 的 text-change 事件
  editor.on('text-change', () => {
    // 直接从 DOM 获取 HTML
    html.value = editor?.root?.innerHTML ?? ''
  })
})

onUnmounted(() => {
  editor = null
})
</script>

<style scoped>
.container {
  padding: 20px;
}

.editor {
  height: 400px;
  margin-bottom: 16px;
}
</style>
```

