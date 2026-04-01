# 西瓜视频播放器（HTML5）

一款带解析器、能节省流量的HTML5视频播放器

- [官网地址](https://h5player.bytedance.com/)



## 基础配置

**安装依赖**

```
pnpm add xgplayer@3.0.23 --filter @apps/xgplayer
```



## 最小使用

```vue
<template>
  <div>
    <h2>Vue3 xgplayer 简单播放示例</h2>
    <!-- 播放器容器 -->
    <div ref="playerContainer"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import Player from 'xgplayer'
import 'xgplayer/dist/index.min.css';


// DOM 容器
const playerContainer = ref<HTMLDivElement | null>(null)
let player: Player | null = null

// 公网视频 URL
const videoUrl = 'https://vjs.zencdn.net/v/oceans.mp4'

onMounted(() => {
  if (playerContainer.value) {
    player = new Player({
      el: playerContainer.value,       // DOM 容器
      url: videoUrl,                   // 视频地址
      type: 'normal',                  // MP4
      autoplay: false,                 // 不自动播放
      width: 800,
      height: 450,
      poster: 'https://github.surmon.me/images/poster/oceans.png', // 封面
    })

    // 事件监听
    player.on('play', () => console.log('播放开始'))
    player.on('pause', () => console.log('暂停'))
    player.on('ended', () => console.log('播放结束'))
  }
})

onBeforeUnmount(() => {
  if (player) {
    player.destroy()
    player = null
  }
})
</script>

<style scoped>
</style>
```

## 自定义控制条（控制条位置 / 大小）

```ts
player = new Player({
  el: playerContainer.value,
  url: videoUrl,
  type: 'normal',
  width: 800,
  height: 450,
  poster: 'https://github.surmon.me/images/poster/oceans.png',
  controls: true,        // 显示控制条
  playbackRate: [0.5, 1, 1.5, 2], // 可调速
})
```

* `controls`：是否显示控制条
* `playbackRate`：可设置播放倍速选项

