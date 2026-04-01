# html2canvas

**JavaScript HTML 渲染器**

该脚本允许您直接在用户浏览器上截取网页或其部分内容的“屏幕截图”。由于截图基于 DOM，因此可能无法 100% 精确地还原网页的真实面貌，因为它并非实际截取屏幕截图，而是根据页面上的可用信息构建的。

- [官网地址](https://github.com/niklasvh/html2canvas)



## 基础配置

**安装依赖**

```
pnpm add html2canvas@1.4.1
```



## 最简示例

```vue
<template>
  <div>
    <!-- 要导出的区域 -->
    <div ref="exportRef" class="export-box">
      <h2>导出内容</h2>
      <p>这是需要导出成图片的 div</p>
    </div>

    <button @click="exportImage">
      导出为图片
    </button>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import html2canvas from 'html2canvas'

const exportRef = ref<HTMLElement | null>(null)

const exportImage = async () => {
  if (!exportRef.value) return

  const canvas = await html2canvas(exportRef.value, {
    scale: window.devicePixelRatio, // 提高清晰度
    useCORS: true,                  // 允许跨域图片
    backgroundColor: '#ffffff'      // 背景色（避免透明）
  })

  // 转成图片
  const imgUrl = canvas.toDataURL('image/png')

  // 下载
  const link = document.createElement('a')
  link.href = imgUrl
  link.download = '导出图片.png'
  link.click()
}
</script>
<style scoped>
.export-box {
  width: 400px;
  padding: 20px;
  border: 1px solid #dcdfe6;
  background: #fff;
}
</style>
```

## 高清导出（适合打印）

```vue
<template>
  <div>
    <div ref="exportRef" class="export-box">
      <h2>高清导出</h2>
      <p>scale = 3，适合打印</p>
    </div>

    <button @click="exportImage">导出高清图片</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import html2canvas from 'html2canvas'

const exportRef = ref<HTMLElement | null>(null)

const exportImage = async () => {
  if (!exportRef.value) return

  const canvas = await html2canvas(exportRef.value, {
    scale: 3,
    backgroundColor: '#ffffff'
  })

  const link = document.createElement('a')
  link.href = canvas.toDataURL('image/png', 1.0)
  link.download = '高清图片.png'
  link.click()
}
</script>

<style scoped>
.export-box {
  width: 400px;
  padding: 20px;
  border: 1px solid #dcdfe6;
  background: #fff;
}
</style>
```

------

## 生成图片并预览（不下载）

```vue
<template>
  <div>
    <div ref="exportRef" class="export-box">
      <h2>图片预览</h2>
      <p>生成后在页面展示</p>
    </div>

    <button @click="exportImage">生成预览</button>

    <img
      v-if="imgUrl"
      :src="imgUrl"
      class="preview-img"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import html2canvas from 'html2canvas'

const exportRef = ref<HTMLElement | null>(null)
const imgUrl = ref<string>('')

const exportImage = async () => {
  if (!exportRef.value) return

  const canvas = await html2canvas(exportRef.value, {
    backgroundColor: '#ffffff'
  })

  imgUrl.value = canvas.toDataURL('image/png')
}
</script>

<style scoped>
.export-box {
  width: 400px;
  padding: 20px;
  border: 1px solid #dcdfe6;
  background: #fff;
}

.preview-img {
  display: block;
  margin-top: 20px;
  width: 400px;
  border: 1px solid #ebeef5;
}
</style>
```

------

## 导出为 Blob（用于上传）

```vue
<template>
  <div>
    <div ref="exportRef" class="export-box">
      <h2>Blob 导出</h2>
      <p>适合上传到后端</p>
    </div>

    <button @click="exportImage">生成 Blob</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import html2canvas from 'html2canvas'

const exportRef = ref<HTMLElement | null>(null)

const exportImage = async () => {
  if (!exportRef.value) return

  const canvas = await html2canvas(exportRef.value)

  canvas.toBlob(blob => {
    if (!blob) return
    console.log('生成的 Blob：', blob)
    // axios.post('/upload', blob)
  }, 'image/png')
}
</script>

<style scoped>
.export-box {
  width: 400px;
  padding: 20px;
  border: 1px solid #dcdfe6;
  background: #fff;
}
</style>
```

------

## 导出包含滚动内容的完整 div

```vue
<template>
  <div>
    <div ref="exportRef" class="export-box scroll-box">
      <p v-for="i in 20" :key="i">第 {{ i }} 行内容</p>
    </div>

    <button @click="exportImage">导出完整内容</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import html2canvas from 'html2canvas'

const exportRef = ref<HTMLElement | null>(null)

const exportImage = async () => {
  const sourceEl = exportRef.value
  if (!sourceEl) return

  /** 克隆节点 */
  const clone = sourceEl.cloneNode(true) as HTMLElement

  /** 强制展开克隆节点 */
  clone.style.maxHeight = 'none'
  clone.style.overflow = 'visible'

  /** 放到屏幕外（关键） */
  clone.style.position = 'fixed'
  clone.style.left = '-99999px'
  clone.style.top = '0'
  clone.style.zIndex = '-1'

  document.body.appendChild(clone)

  /** 截图 */
  const canvas = await html2canvas(clone, {
    scale: window.devicePixelRatio,
    backgroundColor: '#ffffff'
  })

  /** 清理 DOM */
  document.body.removeChild(clone)

  /** 下载 */
  const link = document.createElement('a')
  link.href = canvas.toDataURL('image/png')
  link.download = '完整内容.png'
  link.click()
}
</script>

<style scoped>
.export-box {
  width: 400px;
  padding: 10px;
  border: 1px solid #dcdfe6;
  background: #fff;
}

.scroll-box {
  max-height: 200px;
  overflow-y: auto;
}
</style>
```

------

## 导出时隐藏某些元素

```vue
<template>
  <div>
    <div ref="exportRef" class="export-box">
      <h2>隐藏元素导出（无闪烁）</h2>
      <p>这段会导出</p>
      <p class="no-export">这段不会导出</p>
    </div>

    <button @click="exportImage">导出图片</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import html2canvas from 'html2canvas'

const exportRef = ref<HTMLElement | null>(null)

const exportImage = async () => {
  const sourceEl = exportRef.value
  if (!sourceEl) return

  /** 克隆节点 */
  const clone = sourceEl.cloneNode(true) as HTMLElement

  /** 在克隆节点中隐藏元素 */
  const hiddenEl = clone.querySelector('.no-export') as HTMLElement
  if (hiddenEl) {
    hiddenEl.style.display = 'none'
  }

  /** 放到屏幕外 */
  clone.style.position = 'fixed'
  clone.style.left = '-99999px'
  clone.style.top = '0'
  clone.style.zIndex = '-1'

  document.body.appendChild(clone)

  /** 截图 */
  const canvas = await html2canvas(clone, {
    scale: window.devicePixelRatio,
    backgroundColor: '#ffffff'
  })

  /** 清理 */
  document.body.removeChild(clone)

  /** 下载 */
  const link = document.createElement('a')
  link.href = canvas.toDataURL('image/png')
  link.download = '隐藏元素.png'
  link.click()
}
</script>

<style scoped>
.export-box {
  width: 400px;
  padding: 20px;
  border: 1px solid #dcdfe6;
  background: #fff;
}

.no-export {
  color: red;
}
</style>
```

------

