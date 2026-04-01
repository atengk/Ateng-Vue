# snapDOM

**SnapDOM** 是新一代的 **DOM 捕获引擎（DOM Capture Engine）**——超高速、模块化、可扩展。
它可以将任意 DOM 子树转换为自包含的结构，并导出为 SVG、PNG、JPG、WebP、Canvas、Blob，或通过插件系统生成 **任何自定义格式**。

SnapDOM 会保留样式、字体、背景图像、伪元素、Shadow DOM 等所有视觉特性，并通过可扩展的架构实现强大的灵活性和最高级别的捕获质量。

- 完整的 DOM 捕获
- 内嵌样式、伪元素和字体
- 导出为 SVG、PNG、JPG、WebP、`canvas` 或 Blob
- ⚡ 超快速度，无依赖
- 100% 基于标准 Web API
- 支持同源 `iframe`
- 支持 CSS counter() 和 CSS counters()
- 支持 `...` 文本截断（line-clamp）

- [官网地址](https://github.com/zumerlab/snapdom/blob/HEAD/README_CN.md)



## 基础配置

**安装依赖**

```
pnpm add @zumer/snapdom@2.0.1
```



## 最基础 —— 截图指定 div 并展示

📌 **目标**

- 捕获一个 `div`
- 转成 PNG
- 页面中直接展示

```vue
<template>
  <div class="page">
    <h2>SnapDOM 基础示例</h2>

    <!-- 截图目标 -->
    <div ref="targetRef" class="card">
      <h3>这是要截图的区域</h3>
      <p>当前时间：{{ now }}</p>
    </div>

    <button @click="handleCapture">生成图片</button>

    <div v-if="imgSrc" class="result">
      <h3>截图结果</h3>
      <img :src="imgSrc" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { snapdom } from '@zumer/snapdom'

const targetRef = ref<HTMLElement | null>(null)
const imgSrc = ref<string>('')

const now = new Date().toLocaleString()

const handleCapture = async () => {
  if (!targetRef.value) return

  const result = await snapdom(targetRef.value)
  const img = await result.toPng()

  imgSrc.value = img.src
}
</script>

<style scoped>
.page {
  padding: 20px;
}
.card {
  padding: 16px;
  border: 1px solid #409eff;
  background: #fff;
  margin-bottom: 16px;
}
.result img {
  max-width: 100%;
  border: 1px solid #ddd;
}
</style>
```

✅ 适合：**第一次接触 snapDOM**

------

## 提高分辨率 + 背景色

📌 **目标**

- 设置 `scale`
- 设置 `backgroundColor`
- 输出更清晰图片

```vue
<template>
  <div class="page">
    <h2>SnapDOM 高清截图</h2>

    <div ref="targetRef" class="poster">
      <h1>活动海报</h1>
      <p>Vue3 + snapDOM</p>
    </div>

    <button @click="capture">生成高清 PNG</button>

    <img v-if="imgSrc" :src="imgSrc" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { snapdom } from '@zumer/snapdom'

const targetRef = ref<HTMLElement | null>(null)
const imgSrc = ref('')

const capture = async () => {
  if (!targetRef.value) return

  const result = await snapdom(targetRef.value, {
    scale: 3,
    backgroundColor: '#f5f7fa'
  })

  const img = await result.toPng()
  imgSrc.value = img.src
}
</script>

<style scoped>
.poster {
  width: 300px;
  padding: 24px;
  background: linear-gradient(135deg, #409eff, #67c23a);
  color: #fff;
  text-align: center;
  border-radius: 8px;
}
img {
  margin-top: 16px;
  max-width: 100%;
}
</style>
```

✅ 适合：**海报 / 分享图**

------

## 导出并自动下载图片

📌 **目标**

- 生成图片
- 直接下载到本地
- 通过文件名后缀决定格式，snapDOM 会自动识别格式

```vue
<template>
  <div>
    <div ref="target" class="box">
      <h3>订单信息</h3>
      <p>订单号：NO20260103</p>
      <p>金额：¥199.00</p>
    </div>

    <button @click="download('png')">下载 PNG</button>
    <button @click="download('jpg')">下载 JPG</button>
    <button @click="download('webp')">下载 WEBP</button>
    <button @click="download('svg')">下载 SVG</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { snapdom } from '@zumer/snapdom'

const target = ref<HTMLElement | null>(null)

const download = async (format: 'png' | 'jpg' | 'webp' | 'svg') => {
  if (!target.value) return

  await snapdom.download(target.value, {
    // @ts-ignore
    format,              // 指定导出格式
    filename: `order-${format}`,
    backgroundColor: '#fff'  // 对 JPG / WEBP 有背景色
  })
}
</script>

<style scoped>
.box {
  border: 1px solid #ccc;
  padding: 16px;
  margin-bottom: 12px;
}
</style>
```

✅ 适合：**账单 / 凭证 / 报表导出**

------

## 生成 Blob，用于上传

📌 **目标**

- 生成 `Blob`
- 模拟上传（打印 size）

```vue
<template>
  <div class="page">
    <h2>SnapDOM 生成 Blob</h2>

    <div ref="targetRef" class="content">
      <h3>用户信息</h3>
      <p>姓名：Tony</p>
      <p>角色：管理员</p>
    </div>

    <button @click="createBlob">生成 Blob</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { snapdom } from '@zumer/snapdom'

const targetRef = ref<HTMLElement | null>(null)

const createBlob = async () => {
  if (!targetRef.value) return
  // 默认 svg 格式
  const blob = await snapdom.toBlob(targetRef.value, {
    scale: 2
  })
  /*const blob = await snapdom.toBlob(targetRef.value, {
    type: 'png',
    scale: 2
  })*/

  console.log('Blob size:', blob.size)
  console.log('Blob type:', blob.type)
}
</script>

<style scoped>
.content {
  padding: 20px;
  background: #fafafa;
  border-radius: 6px;
}
</style>
```

✅ 适合：**上传服务器 / OSS / API 接口**

------

## 超出范围列表截图截图

```vue
<template>
  <div class="page">
    <h2>SnapDOM 正确的超长列表截图</h2>

    <!-- 外层：只负责滚动（不截图） -->
    <div class="table-scroll">
      <!-- 内层：真正的截图目标 -->
      <div ref="targetRef" class="table-content">
        <div class="row header">
          <span>ID</span>
          <span>模块名称</span>
          <span>状态</span>
        </div>

        <div
            class="row"
            v-for="item in list"
            :key="item.id"
        >
          <span>{{ item.id }}</span>
          <span>{{ item.name }}</span>
          <span>{{ item.status }}</span>
        </div>
      </div>
    </div>

    <button @click="download">下载完整列表 PNG</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { snapdom } from '@zumer/snapdom'

interface Item {
  id: number
  name: string
  status: string
}

const targetRef = ref<HTMLElement | null>(null)

const list: Item[] = Array.from({ length: 50 }).map((_, i) => ({
  id: i + 1,
  name: `模块-${i + 1}`,
  status: i % 2 ? '启用' : '禁用'
}))

const download = async () => {
  if (!targetRef.value) return

  await snapdom.download(targetRef.value, {
    type: 'png',
    scale: 2,
    backgroundColor: '#ffffff',
    filename: 'module-list.png'
  })
}
</script>

<style scoped>
.page {
  padding: 20px;
}

/* 👇 只给用户看的滚动容器 */
.table-scroll {
  width: 420px;
  height: 260px;
  overflow-y: auto;
  border: 1px solid #dcdfe6;
}

/* 👇 真正用于截图的内容层 */
.table-content {
  background: #ffffff;
}

/* 表格行 */
.row {
  display: grid;
  grid-template-columns: 60px 1fr 80px;
  padding: 8px 12px;
  border-bottom: 1px solid #ebeef5;
}

.header {
  background: #f5f7fa;
  font-weight: bold;
}
</style>
```

✅ 适合：**报表 / 管理后台导出**

