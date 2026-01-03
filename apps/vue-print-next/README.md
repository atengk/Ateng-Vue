# Vue Print Next

基于 vue3-print-np 改造的 vue 打印库，使用 Typescript 重构，对 vue3 setup 有更好的支持，支持手动调用打印函数等。

- [官网地址](https://alexpang.cn/vue-print-next/docs/guide/what-is-vue-print-next.html)



## 基础配置

**安装依赖**

```
pnpm add vue-print-next@1.1.6
```

**全局引入插件**

```ts
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import { printPlugin } from 'vue-print-next'

const app = createApp(App)
app.use(printPlugin)
app.mount('#app')
```

## 打印整个页面（最简单）

```vue
<!-- App.vue -->
<template>
  <div>
    <h1>🍵 全页面打印示例</h1>
    <p>当前时间：{{ new Date().toLocaleString() }}</p>

    <!-- 直接打印整个页面 -->
    <button v-print>
      打印整个页面
    </button>
  </div>
</template>

<script setup lang="ts">
</script>

<style>
body {
  font-family: Arial, sans-serif;
}
</style>
```

🔹 点击按钮即可调用浏览器打印，包括页面上所有内容。([alexpang.cn](https://alexpang.cn/vue-print-next/docs/guide/getting-started.html?utm_source=chatgpt.com))

------

## 打印指定部分内容

```vue
<!-- App.vue -->
<template>
  <div>
    <h1>📄 局部打印示例</h1>

    <div id="print-section" class="print-box">
      <h3>需要打印的区域</h3>
      <p>这里的内容会被打印出来。</p>
      <ul>
        <li>第一条</li>
        <li>第二条</li>
        <li>第三条</li>
      </ul>
    </div>

    <!-- 只打印 #print-section 区域 -->
    <button v-print="'#print-section'">
      打印指定区域
    </button>
  </div>
</template>

<script setup lang="ts">
</script>

<style>
.print-box {
  padding: 10px;
  border: 1px dashed #666;
}
</style>
```

✅ 这里使用 `v-print="'#print-section'"` 来限制只打印指定的 DOM 元素。([GitHub](https://github.com/Alessandro-Pang/vue-print-next))

------

## 打印并忽略某些元素

```vue
<!-- App.vue -->
<template>
  <div>
    <h1>❌ 忽略元素打印</h1>

    <div id="invoice">
      <p>账单 ID: #A001</p>
      <p>总价: ¥1280</p>
      <span class="no-print">❗ 注意事项（不打印）</span>
      <p>谢谢惠顾！</p>
    </div>

    <button
      v-print="{
        el: '#invoice',
        noPrintSelector: '.no-print'
      }"
    >
      打印发票
    </button>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.no-print {
  color: red;
}
</style>
```

✨ 这里通过 `noPrintSelector` 参数指定某些 class 在打印时被忽略。([GitHub](https://github.com/Alessandro-Pang/vue-print-next))

------

## 使用 `ref` 和手动打印（组合 API）

```vue
<!-- App.vue -->
<template>
  <div>
    <h1>🛠 组合式 API 手动打印</h1>

    <div ref="printArea" class="print-box">
      <p>这是通过 ref 手动控制打印的内容。</p>
    </div>

    <button @click="printWithRef">
      手动打印
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { VuePrintNext } from 'vue-print-next'

const printArea = ref<HTMLElement | null>(null)

const printWithRef = () => {
  if (!printArea.value) return

  new VuePrintNext({
    el: printArea.value,
    preview: false,
  })
}
</script>

<style>
.print-box {
  padding: 14px;
  border: 1px solid #888;
}
</style>
```

🧠 使用 `VuePrintNext` 类可以手动传入 DOM（`el`），更灵活控制打印逻辑。([GitHub](https://github.com/Alessandro-Pang/vue-print-next))

------

## 高级打印：打印 URL 内容

```vue
<!-- App.vue -->
<template>
  <div>
    <h1>🌐 打印远程页面</h1>

    <button
      v-print="{
        url: 'https://example.com/print-content'
      }"
    >
      打印外部内容
    </button>
  </div>
</template>

<script setup lang="ts"></script>
```

✔ 通过设置 `url` 属性可以打印指定链接的页面内容。
⚠️ 注意：受限于同源策略，跨域 URL 可能不能直接打印。([GitHub](https://github.com/Alessandro-Pang/vue-print-next))

------

## 预览 + 额外 CSS 打印

```vue
<!-- App.vue -->
<template>
  <div>
    <h1>🎨 打印预览以及样式处理</h1>

    <div id="report-content">
      <h2>报表标题</h2>
      <p>报表内容...</p>
    </div>

    <button
      v-print="{
        el: '#report-content',
        preview: true,
      }"
    >
      打印预览
    </button>
  </div>
</template>

<script setup lang="ts"></script>
```

✨ 设置 `preview: true` 会先打开预览窗口，让用户确认。
可以通过 `extraCss` 添加打印特定样式表。([GitHub](https://github.com/Alessandro-Pang/vue-print-next))

------

## 长列表打印

```vue
<!-- App.vue -->
<template>
  <div>
    <h1>📃 长列表打印（CSS 方案）</h1>

    <div id="print-list" class="list">
      <div v-for="i in 50" :key="i" class="item">
        第 {{ i }} 条数据
      </div>
    </div>

    <button v-print="'#print-list'">
      打印 / 导出 PDF
    </button>
  </div>
</template>

<script setup lang="ts"></script>

<style>
.list {
  height: 200px;
  overflow-y: auto;
  border: 1px solid #ccc;
}

.item {
  padding: 8px;
  border-bottom: 1px dashed #ddd;
}

/* 🔥 打印时展开 */
@media print {
  .list {
    height: auto !important;
    overflow: visible !important;
  }
}
</style>
```

