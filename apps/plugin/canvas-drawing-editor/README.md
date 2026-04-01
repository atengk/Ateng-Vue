# Canvas Drawing Editor

一个强大的基于 Canvas 的画布编辑器 Web Component，**零依赖**，支持 **Vue 2/3**、**React**、**Angular** 和**原生 HTML**。

- [官网地址](https://github.com/typsusan-zzz/canvas-drawing-editor)



## 基础配置

**安装依赖**

```
pnpm add canvas-drawing-editor@2.3.0
```

**全集配置**

vite.config.ts：

```typescript
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  vue: {
    template: {
      compilerOptions: {
        // 让 Vue 识别 canvas-drawing-editor 自定义标签
        isCustomElement: tag => tag === 'canvas-drawing-editor'
      }
    }
  }
});
```



## 最基础：页面里直接渲染（能跑就行）

```vue
<template>
  <div style="height: 100%">
    <canvas-drawing-editor
      style="width: 100%; height: 600px"
    />
  </div>
</template>

<script setup lang="ts">
import 'canvas-drawing-editor'
</script>
```

你现在看到的效果 = **官网 demo**

---

## 标题 + 中文

```vue
<template>
  <canvas-drawing-editor
    title="基础画布"
    lang="zh"
    style="width: 100%; height: 600px"
  />
</template>

<script setup lang="ts">
import 'canvas-drawing-editor'
</script>
```

---

## 精简工具栏（最常用）

> ⚠️ 重点：**配置要是字符串**

```vue
<script setup lang="ts">
import 'canvas-drawing-editor'

const toolConfig = JSON.stringify({
  pencil: true,
  rectangle: true,
  circle: true,
  text: true,
  undo: true,
  redo: true,
  download: true,
  clear: true,
})
</script>

<template>
  <canvas-drawing-editor
    title="精简工具"
    :tool-config="toolConfig"
    style="width: 100%; height: 600px"
  />
</template>
```

---

## 监听画布变化（保存必备）

```vue
<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'
import 'canvas-drawing-editor'

function onEditorChange(e: any) {
  console.log('当前画布数据', e.detail)
}

onMounted(() => {
  window.addEventListener('editor-change', onEditorChange)
})

onBeforeUnmount(() => {
  window.removeEventListener('editor-change', onEditorChange)
})
</script>

<template>
  <canvas-drawing-editor
    title="监听变化"
    style="width: 100%; height: 600px"
  />
</template>
```

---

## 初始化数据（编辑 / 回显）

```vue
<script setup lang="ts">
import 'canvas-drawing-editor'

const initialData = JSON.stringify({
  objects: [
    {
      type: 'RECTANGLE',
      x: 80,
      y: 80,
      width: 160,
      height: 100,
      color: '#409eff',
    },
    {
      type: 'TEXT',
      x: 100,
      y: 220,
      text: 'Vue3 Canvas',
      fontSize: 22,
    },
  ],
})
</script>

<template>
  <canvas-drawing-editor
    title="初始化内容"
    :initial-data="initialData"
    style="width: 100%; height: 600px"
  />
</template>
```

---

## JSON 导入 / 导出（配置型页面）

```vue
<script setup lang="ts">
import 'canvas-drawing-editor'

const toolConfig = JSON.stringify({
  importJson: true,
  exportJson: true,
  download: true,
})
</script>

<template>
  <canvas-drawing-editor
    title="配置模板"
    :tool-config="toolConfig"
    style="width: 100%; height: 600px"
  />
</template>
```

---

## 只读预览页面（查看用）xxxx

```vue
<script setup lang="ts">
import 'canvas-drawing-editor'

const data = JSON.stringify({
  objects: [
    {
      type: 'CIRCLE',
      x: 200,
      y: 150,
      radius: 60,
      color: '#67c23a',
    },
  ],
})
</script>

<template>
  <canvas-drawing-editor
    readonly
    :initial-data="data"
    style="width: 100%; height: 400px"
  />
</template>
```

---

## 模板变量（证书 / 海报场景）

```vue
<script setup lang="ts">
import 'canvas-drawing-editor'

const initialData = JSON.stringify({
  objects: [
    {
      type: 'TEXT',
      x: 100,
      y: 120,
      text: '{{username}}',
      fontSize: 26,
      "hotzone": {
        "variableName": "name",
        "defaultValue": "User"
      }
    },
  ],
})

const hotzoneData = JSON.stringify({
  name: '张三',
})
</script>

<template>
  <canvas-drawing-editor
      title="模板变量"
      :initial-data="initialData"
      enable-hotzone="true"
      :hotzone-data="hotzoneData"
      style="width: 100%; height: 500px"
  />
</template>
```

---

## 自定义下载图片

```vue
<script setup lang="ts">
import 'canvas-drawing-editor'

function getCanvas() {
  const editor = document.querySelector('canvas-drawing-editor')
  return (editor as any)?.shadowRoot?.querySelector('canvas') || null
}

function downloadPng() {
  const canvas = getCanvas()
  if (!canvas) return

  const url = canvas.toDataURL('image/png')
  const a = document.createElement('a')
  a.href = url
  a.download = 'my-canvas.png'
  a.click()
}

function downloadJpg(quality = 0.9) {
  const canvas = getCanvas()
  if (!canvas) return

  const url = canvas.toDataURL('image/jpeg', quality)

  const a = document.createElement('a')
  a.href = url
  a.download = 'canvas.jpg'
  a.click()
}

function downloadBlob() {
  const canvas = getCanvas()
  if (!canvas) return

  canvas.toBlob((blob) => {
    if (!blob) return

    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'canvas.png'
    a.click()

    URL.revokeObjectURL(url)
  })
}


</script>

<template>
  <div>
    <button @click="downloadPng">自定义下载 PNG</button>

    <canvas-drawing-editor
        :tool-config="JSON.stringify({ download: false })"
        style="width: 100%; height: 600px"
    />
  </div>
</template>
```

