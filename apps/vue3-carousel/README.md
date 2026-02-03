# Vue 3 Carousel

灵活、响应迅速且高度可定制的 Vue 轮播组件，几乎可以满足您的所有使用场景

- [官网地址](https://github.com/ismail9k/vue3-carousel)



## 基础配置

**安装依赖**

```
pnpm add vue3-carousel@0.17.0
```



## 使用示例

```vue
<script setup lang="ts">
// 引入 CSS
import 'vue3-carousel/dist/carousel.css'

// 从包里按需导入组件
import { Carousel, Slide, Navigation, Pagination } from 'vue3-carousel'
</script>

<template>
  <Carousel :items-to-show="1" wrap-around>
    <Slide v-for="n in 5" :key="n">
      <div class="slide-content">Slide {{ n }}</div>
    </Slide>

    <!-- 插件 slot（可选）：左右箭头与分页 -->
    <template #addons>
      <Navigation />
      <Pagination />
    </template>
  </Carousel>
</template>

<style scoped>
.slide-content {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  background: #eee;
}
</style>
```

## 自动播放 + 悬停暂停（最常见 Banner）

**使用场景**：官网首页 Banner、活动轮播

```vue
<script setup lang="ts">
import 'vue3-carousel/dist/carousel.css'
import { Carousel, Slide } from 'vue3-carousel'
</script>

<template>
  <Carousel
    :items-to-show="1"
    :autoplay="3000"
    :pause-autoplay-on-hover="true"
    wrap-around
  >
    <Slide v-for="n in 4" :key="n">
      <div class="slide">Banner {{ n }}</div>
    </Slide>
  </Carousel>
</template>

<style scoped>
.slide {
  height: 240px;
  background: #409eff;
  color: #fff;
  font-size: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
```

✅ 常用参数说明

- `autoplay="3000"`：3 秒轮播一次
- `pause-autoplay-on-hover`：鼠标悬停暂停
- `wrap-around`：循环播放

------

## 多图展示（商品 / 卡片列表）

**使用场景**：商品列表、推荐位、卡片横向滚动

```vue
<script setup lang="ts">
import 'vue3-carousel/dist/carousel.css'
import { Carousel, Slide } from 'vue3-carousel'
</script>

<template>
  <Carousel
    :items-to-show="4"
    :gap="16"
    wrap-around
  >
    <Slide v-for="n in 10" :key="n">
      <div class="card">商品 {{ n }}</div>
    </Slide>
  </Carousel>
</template>

<style scoped>
.card {
  height: 120px;
  background: #f5f7fa;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
```

👉 **重点参数**

- `items-to-show`：一屏显示几个
- `gap`：slide 之间的间距（非常常用）

------

## 响应式断点（PC / Pad / Mobile）

**使用场景**：PC 显示 4 个，手机显示 1 个

```vue
<script setup lang="ts">
import 'vue3-carousel/dist/carousel.css'
import { Carousel, Slide } from 'vue3-carousel'

const breakpoints = {
  0: {
    itemsToShow: 1
  },
  768: {
    itemsToShow: 2
  },
  1200: {
    itemsToShow: 4
  }
}
</script>

<template>
  <Carousel
    :breakpoints="breakpoints"
    :gap="12"
    wrap-around
  >
    <Slide v-for="n in 8" :key="n">
      <div class="slide">Item {{ n }}</div>
    </Slide>
  </Carousel>
</template>
```

✅ **这是生产环境非常常见的一种写法**

------

## 自定义上一页 / 下一页（不用内置 Navigation）

**使用场景**：UI 需要和设计稿完全一致

```vue
<script setup lang="ts">
import 'vue3-carousel/dist/carousel.css'
import { Carousel, Slide } from 'vue3-carousel'
import { ref } from 'vue'

const carouselRef = ref()
</script>

<template>
  <div class="wrapper">
    <button @click="carouselRef?.prev()">上一页</button>

    <Carousel ref="carouselRef" :items-to-show="1">
      <Slide v-for="n in 5" :key="n">
        <div class="slide">Slide {{ n }}</div>
      </Slide>
    </Carousel>

    <button @click="carouselRef?.next()">下一页</button>
  </div>
</template>
```

📌 可调用的方法：

- `prev()`
- `next()`
- `slideTo(index)`

------

## 图片轮播（真实项目 90% 场景）

```vue
<script setup lang="ts">
import 'vue3-carousel/dist/carousel.css'
import { Carousel, Slide, Pagination } from 'vue3-carousel'

const images = [
  'https://picsum.photos/800/300?1',
  'https://picsum.photos/800/300?2',
  'https://picsum.photos/800/300?3'
]
</script>

<template>
  <Carousel :autoplay="4000" wrap-around>
    <Slide v-for="(img, index) in images" :key="index">
      <img :src="img" class="img" />
    </Slide>

    <template #addons>
      <Pagination />
    </template>
  </Carousel>
</template>

<style scoped>
.img {
  width: 100%;
  height: 300px;
  object-fit: cover;
}
</style>
```

------

## 垂直轮播（公告 / 消息滚动）

```vue
<script setup lang="ts">
import 'vue3-carousel/dist/carousel.css'
import { Carousel, Slide } from 'vue3-carousel'
</script>

<template>
  <Carousel
      dir="ttb"
      :items-to-show="1"
      :autoplay="2000"
      :height="500"
      wrap-around
  >
    <Slide v-for="n in 5" :key="n">
      <div class="notice">公告 {{ n }}</div>
    </Slide>
  </Carousel>
</template>

<style scoped>
.notice {
  height: 500px;
  display: flex;
  align-items: center;
  padding-left: 12px;
  background: #fdf6ec;
}
</style>
```

------

