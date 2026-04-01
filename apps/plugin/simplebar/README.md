# SimplebarVue

自定义滚动条 vanilla javascript 库，具有原生滚动功能，简单、轻量级、易于使用且跨浏览器

- [官网地址](https://github.com/Grsmto/simplebar)



## 基础配置

**安装依赖**

```
pnpm add simplebar-vue simplebar
```

**全局配置**

`src/main.ts`

```ts
import { createApp } from 'vue'
import App from './App.vue'
import Simplebar from 'simplebar-vue'

// SimpleBar 样式
import 'simplebar-vue/dist/simplebar.min.css'

const app = createApp(App);
app.component('Simplebar', Simplebar)

app.mount('#app')
```



## 全屏使用

```vue
<template>
  <simplebar class="page-scroll">
    <div v-for="i in 500" :key="i" class="item">
      {{ i }} — Lorem ipsum dolor sit amet.
    </div>
  </simplebar>
</template>

<script setup lang="ts">
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden; /* 禁止默认滚动 */
}

.page-scroll {
  height: 100vh; /* 撑满整个视口 */
}
.item {
  padding: 4px 8px;
}
</style>
```



## 局部使用

```vue
<template>
  <div class="wrapper">

    <p>上面的内容</p>

    <simplebar class="mini-scroll">
      <div v-for="i in 200" :key="i">
        {{ i }} — Lorem ipsum dolor sit amet.
      </div>
    </simplebar>

    <p>下面的内容</p>

  </div>
</template>

<script setup lang="ts">
</script>

<style>
/* 自定义滚动容器 */
.mini-scroll {
  height: 200px;       /* ⭐ 必须设置固定高度或 max-height */
  max-width: 300px;    /* 可选：控制宽度 */
  border: 1px solid #ccc;
  padding: 8px;
}
</style>
```



## 横向滚动

```vue
<template>
  <div class="wrapper">

    <p>上面的内容</p>

    <simplebar class="mini-scroll-x">
      <div class="row">
        <div
            v-for="i in 20"
            :key="i"
            class="cell"
        >
          {{ i }}
        </div>
      </div>
    </simplebar>

    <p>下面的内容</p>

  </div>
</template>

<script setup lang="ts">
</script>

<style>
/* 自定义滚动容器（横向） */
.mini-scroll-x {
  max-width: 300px;
  border: 1px solid #ccc;
  padding: 8px;

  /* ⭐ 横向滚动关键属性 */
  overflow-x: auto;
  overflow-y: hidden; /* 可选，避免上下滚动条 */
}

/* 横向排列 */
.row {
  display: inline-flex; /* ⭐ 保证横向撑开 */
  gap: 8px;
}

.cell {
  flex: 0 0 auto; /* ⭐ 不换行，保持宽度 */
  width: 100px;
  height: 80px;
  background: #eee;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
}
</style>
```



## 滚动条颜色

```vue
<template>
  <div class="wrapper">

    <p>上面的内容</p>

    <simplebar class="mini-scroll">
      <div v-for="i in 200" :key="i">
        {{ i }} — Lorem ipsum dolor sit amet.
      </div>
    </simplebar>

    <p>下面的内容</p>

  </div>
</template>

<script setup lang="ts">
</script>

<style>
/* 自定义滚动容器 */
.mini-scroll {
  height: 200px;       /* ⭐ 必须设置固定高度或 max-height */
  max-width: 300px;    /* 可选：控制宽度 */
  border: 1px solid #ccc;
  padding: 8px;
}

/* SimpleBar 滚动条滑块颜色 */
.simplebar-scrollbar::before {
  background-color: red !important;
  transition: background-color .2s ease;
}

</style>
```

