# DOM to Image

使用 HTML5 Canvas 从 DOM 节点生成图像

- [官网地址](https://github.com/1904labs/dom-to-image-more)



## 基础配置

**安装依赖**

```
pnpm add dom-to-image-more@3.7.2
```

**创建ts类型声明**

```
// src/types/dom-to-image-more.d.ts
declare module 'dom-to-image-more' {
    const domtoimage: {
        toPng(node: HTMLElement, options?: any): Promise<string>
        toJpeg(node: HTMLElement, options?: any): Promise<string>
        toSvg(node: HTMLElement, options?: any): Promise<string>
        toBlob(node: HTMLElement, options?: any): Promise<Blob>
    }

    export default domtoimage
}
```



## DOM 转 PNG 并下载

适用场景

* 页面截图
* 简单卡片导出
* 不涉及外链图片 / 字体

```vue
<template>
  <div>
    <div ref="captureRef" class="box">
      <h3>Hello dom-to-image</h3>
      <p>这是一个最简单的示例</p>
    </div>

    <button @click="exportPng">导出 PNG</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import domtoimage from 'dom-to-image-more'

const captureRef = ref<HTMLElement | null>(null)

const exportPng = async () => {
  if (!captureRef.value) {
    return
  }

  const dataUrl = await domtoimage.toPng(captureRef.value, {
    bgcolor: '#ffffff'
  })

  const link = document.createElement('a')
  link.href = dataUrl
  link.download = 'simple.png'
  link.click()
}
</script>

<style scoped>
.box {
  width: 300px;
  padding: 16px;
  outline: 1px solid #ccc;
}
</style>
```

---

## 指定尺寸 + 背景色导出

适用场景

* 截图尺寸固定
* 避免透明背景
* 生成统一规格图片

```vue
<template>
  <div>
    <div ref="captureRef" class="box">
      <h3>Fixed Size</h3>
      <p>指定尺寸导出</p>
    </div>

    <button @click="exportPng">导出 PNG</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import domtoimage from 'dom-to-image-more'

const captureRef = ref<HTMLElement | null>(null)

const exportPng = async () => {
  if (!captureRef.value) {
    return
  }

  const dataUrl = await domtoimage.toPng(captureRef.value, {
    width: 400,
    height: 300,
    bgcolor: '#ffffff'
  })

  const link = document.createElement('a')
  link.href = dataUrl
  link.download = 'fixed-size.png'
  link.click()
}
</script>

<style scoped>
.box {
  width: 200px;
  padding: 16px;
  outline: 1px solid #409eff;
}
</style>
```

---

## 高清 PNG 导出（Scale 放大）

适用场景

* 海报生成
* 分享图片
* 解决图片模糊问题

```vue
<template>
  <div>
    <div ref="captureRef" class="poster">
      <h2>高清导出</h2>
      <p>使用 scale 放大</p>
    </div>

    <button @click="exportPng">导出高清 PNG</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import domtoimage from 'dom-to-image-more'

const captureRef = ref<HTMLElement | null>(null)

const exportPng = async () => {
  if (!captureRef.value) {
    return
  }

  const scale = 2
  const width = captureRef.value.offsetWidth
  const height = captureRef.value.offsetHeight

  const dataUrl = await domtoimage.toPng(captureRef.value, {
    width: width * scale,
    height: height * scale,
    style: {
      transform: `scale(${scale})`,
      transformOrigin: 'top left'
    },
    bgcolor: '#ffffff'
  })

  const link = document.createElement('a')
  link.href = dataUrl
  link.download = 'hd.png'
  link.click()
}
</script>

<style scoped>
.poster {
  width: 300px;
  padding: 20px;
  background: linear-gradient(135deg, #409eff, #67c23a);
  color: #fff;
}
</style>
```

---

## 导出为 JPEG（压缩体积）

适用场景

* 上传服务器
* 分享给第三方
* 不需要透明背景

```vue
<template>
  <div>
    <div ref="captureRef" class="box">
      <h3>JPEG 导出</h3>
      <p>体积更小</p>
    </div>

    <button @click="exportJpeg">导出 JPEG</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import domtoimage from 'dom-to-image-more'

const captureRef = ref<HTMLElement | null>(null)

const exportJpeg = async () => {
  if (!captureRef.value) {
    return
  }

  const dataUrl = await domtoimage.toJpeg(captureRef.value, {
    quality: 0.9,
    bgcolor: '#ffffff'
  })

  const link = document.createElement('a')
  link.href = dataUrl
  link.download = 'image.jpg'
  link.click()
}
</script>

<style scoped>
.box {
  width: 260px;
  padding: 16px;
  outline: 1px dashed #e6a23c;
}
</style>
```

---

## 过滤 DOM 节点导出

适用场景

* 页面展示与导出不一致
* 隐藏操作按钮

```vue
<template>
  <div>
    <div ref="captureRef" class="box">
      <h3>导出区域</h3>
      <p>这部分会被导出</p>
      <button data-ignore>操作按钮</button>
    </div>

    <button @click="exportPng">导出 PNG</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import domtoimage from 'dom-to-image-more'

const captureRef = ref<HTMLElement | null>(null)

const exportPng = async () => {
  if (!captureRef.value) {
    return
  }

  const dataUrl = await domtoimage.toPng(captureRef.value, {
    bgcolor: '#ffffff',
    filter: (node) => {
      if (node instanceof HTMLElement) {
        return !node.hasAttribute('data-ignore')
      }
      return true
    }
  })

  const link = document.createElement('a')
  link.href = dataUrl
  link.download = 'filtered.png'
  link.click()
}
</script>

<style scoped>
.box {
  width: 300px;
  padding: 16px;
  outline: 1px solid #f56c6c;
}
</style>
```

---

## 外链图片转 Base64 后导出

适用场景

* CDN 图片
* 避免跨域问题

```vue
<template>
  <div>
    <div ref="captureRef" class="box">
      <img :src="imgSrc" v-if="imgSrc" />
      <p>外链图片转 base64</p>
    </div>

    <button @click="exportPng">导出 PNG</button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import domtoimage from 'dom-to-image-more'

const captureRef = ref<HTMLElement | null>(null)
const imgSrc = ref('')

const loadImage = async () => {
  const res = await fetch('https://via.placeholder.com/150')
  const blob = await res.blob()

  const reader = new FileReader()
  reader.onloadend = () => {
    imgSrc.value = reader.result as string
  }
  reader.readAsDataURL(blob)
}

onMounted(() => {
  loadImage()
})

const exportPng = async () => {
  if (!captureRef.value) {
    return
  }

  const dataUrl = await domtoimage.toPng(captureRef.value, {
    bgcolor: '#ffffff'
  })

  const link = document.createElement('a')
  link.href = dataUrl
  link.download = 'base64.png'
  link.click()
}
</script>

<style scoped>
.box {
  width: 200px;
  padding: 12px;
  outline: 1px solid #909399;
}
img {
  width: 100%;
}
</style>
```

---

## 表格导出图片

适用场景

* 报表截图
* 数据表格分享
* 不需要导出 Excel，只要图片

```vue
<template>
  <div>
    <div ref="captureRef" class="table-wrapper">
      <table class="table">
        <thead>
          <tr>
            <th>姓名</th>
            <th>年龄</th>
            <th>城市</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in list" :key="item.name">
            <td>{{ item.name }}</td>
            <td>{{ item.age }}</td>
            <td>{{ item.city }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <button @click="exportPng">导出表格图片</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import domtoimage from 'dom-to-image-more'

interface Row {
  name: string
  age: number
  city: string
}

const list = ref<Row[]>([
  { name: '张三', age: 18, city: '北京' },
  { name: '李四', age: 22, city: '上海' },
  { name: '王五', age: 30, city: '广州' }
])

const captureRef = ref<HTMLElement | null>(null)

const exportPng = async () => {
  if (!captureRef.value) {
    return
  }

  const el = captureRef.value
  const fix = 2

  const dataUrl = await domtoimage.toPng(el, {
    width: el.offsetWidth + fix,
    height: el.offsetHeight + fix,
    bgcolor: '#ffffff'
  })

  const link = document.createElement('a')
  link.href = dataUrl
  link.download = 'table.png'
  link.click()
}
</script>

<style scoped>
.table-wrapper {
  display: inline-block;
  background-color: #ffffff;
}

.table {
  border-collapse: collapse;
  font-size: 14px;
}

.table th,
.table td {
  padding: 8px 12px;
  border: 1px solid #dcdfe6;
  text-align: left;
}

.table th {
  background-color: #f5f7fa;
}
</style>
```

---

## 长列表导出为一张长图

---

```vue
<template>
  <div>
    <!-- 只是页面展示用的可视窗口 -->
    <div class="viewport">
      <div ref="captureRef" class="list">
        <div
            v-for="item in list"
            :key="item"
            class="item"
        >
          第 {{ item }} 条数据
        </div>
      </div>
    </div>

    <button @click="exportLongImage">导出为一张长图</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import domtoimage from 'dom-to-image-more'

const captureRef = ref<HTMLElement | null>(null)

const list = ref<number[]>(
    Array.from({ length: 30 }, (_, i) => i + 1)
)

const exportLongImage = async () => {
  if (!captureRef.value) {
    return
  }

  const el = captureRef.value
  const fix = 2

  const dataUrl = await domtoimage.toPng(el, {
    width: el.offsetWidth + fix,
    height: el.scrollHeight + fix,
    bgcolor: '#ffffff'
  })

  const link = document.createElement('a')
  link.href = dataUrl
  link.download = 'long-image.png'
  link.click()
}
</script>

<style scoped>
.viewport {
  width: 300px;
  height: 240px;
  overflow-y: auto;
  border: 1px solid #dcdfe6;
  margin-bottom: 12px;
}

.list {
  background-color: #ffffff;
}

.item {
  padding: 12px;
  border-bottom: 1px solid #ebeef5;
  font-size: 14px;
}
</style>
```

---

## DOM 导出为 SVG

适用场景

- 矢量图导出（不失真）
- 超长内容（SVG 无 Canvas 高度限制）
- 二次编辑（Figma / Illustrator）
- 后端存储、再渲染

```
<template>
  <div>
    <div ref="captureRef" class="box">
      <h3>DOM to SVG</h3>
      <p>这是一个导出 SVG 的示例</p>
      <ul>
        <li v-for="item in list" :key="item">
          第 {{ item }} 项
        </li>
      </ul>
    </div>

    <button @click="exportSvg">导出 SVG</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import domtoimage from 'dom-to-image-more'

const captureRef = ref<HTMLElement | null>(null)

const list = ref<number[]>(
    Array.from({ length: 5 }, (_, i) => i + 1)
)

const exportSvg = async () => {
  if (!captureRef.value) {
    return
  }

  const dataUrl = await domtoimage.toSvg(captureRef.value, {
    bgcolor: '#ffffff'
  })

  const link = document.createElement('a')
  link.href = dataUrl
  link.download = 'export.svg'
  link.click()
}

</script>

<style scoped>
.box {
  width: 300px;
  padding: 16px;
  background-color: #ffffff;
  border: 1px solid #dcdfe6;
}

ul {
  padding-left: 16px;
}

li {
  line-height: 24px;
}
</style>
```

