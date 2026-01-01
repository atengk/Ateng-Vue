# videojs-player

适用于@vuejs (3) 和 React 的@videojs播放器组件。

- [官网地址](https://github.surmon.me/videojs-player)



## 基础配置

**安装依赖**

```
pnpm add video.js @videojs-player/vue --filter @apps/videojs-player
```

**全局注册**

```typescript
import { createApp } from 'vue'
import App from './App.vue'

// 引入 Video.js 样式
import 'video.js/dist/video-js.css';

// 引入插件
import VueVideoPlayer from '@videojs-player/vue';

const app = createApp(App);

// 安装插件（全局组件 VideoPlayer 可用）
app.use(VueVideoPlayer);

app.mount('#app')
```

**配置类型**

添加以下内容

```typescript
// src/vite-env.d.ts
declare module '*.vue' {
    import type { DefineComponent } from 'vue'
    const component: DefineComponent<Record<string, unknown>, {}, any>
    export default component
}
```



## 最小示例

```vue
<template>
  <div class="video-container">
    <!-- video-player 即为组件 -->
    <VideoPlayer
        src="https://vjs.zencdn.net/v/oceans.mp4"
        poster="https://github.surmon.me/images/poster/oceans.png"
        :controls="true"
        :loop="false"
        :fluid="true"
        :autoplay="false"
        :volume="0.8"
        @play="onPlay"
        @pause="onPause"
        @ended="onEnded"
    />
  </div>
</template>

<script setup>

function onPlay() {
  console.log("开始播放");
}

function onPause() {
  console.log("暂停播放");
}

function onEnded() {
  console.log("播放结束");
}
</script>
```

## 动态切换视频源

场景：列表点不同视频、详情页切换清晰度

```vue
<template>
  <div class="video-container">
    <VideoPlayer
      :src="currentSrc"
      :controls="true"
      :fluid="true"
    />

    <div class="actions">
      <button @click="changeVideo(0)">视频一</button>
      <button @click="changeVideo(1)">视频二</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const sources = [
  'https://vjs.zencdn.net/v/oceans.mp4',
  'https://vjs.zencdn.net/v/oceans.webm'
]

const currentSrc = ref(sources[0])

function changeVideo(index) {
  currentSrc.value = sources[index]
}
</script>
```

## HLS（m3u8）播放

场景：直播 / 点播流媒体

```vue
<template>
  <VideoPlayer
    src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
    :controls="true"
    :fluid="true"
    :autoplay="false"
  />
</template>

<script setup>
</script>
```

## 获取 player 实例

场景：你要 **主动控制播放 / 暂停 / 跳转 / 销毁**

```vue
<template>
  <VideoPlayer
      src="https://vjs.zencdn.net/v/oceans.mp4"
      :controls="true"
      @mounted="onMountedPlayer"
  />

  <div class="actions">
    <button @click="play">播放</button>
    <button @click="pause">暂停</button>
    <button @click="seek">跳到 10 秒</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 用来存 video.js 的实例
const videoJsPlayer = ref(null)

function onMountedPlayer({ player }) {
  // 官方事件返回的 player 就是 video.js 实例
  videoJsPlayer.value = player
}

// 操作方法
function play() {
  videoJsPlayer.value?.play()
}

function pause() {
  videoJsPlayer.value?.pause()
}

function seek() {
  videoJsPlayer.value?.currentTime(10)
}
</script>
```

## 断点续播

场景

- 页面离开再回来
- 从上次播放位置继续

核心思路

- `timeupdate` → 存时间
- `mounted` → 恢复时间

```vue
<template>
  <VideoPlayer
      src="https://vjs.zencdn.net/v/oceans.mp4"
      :controls="true"
      @mounted="onMountedPlayer"
  />
</template>

<script setup>

const STORAGE_KEY = 'video_progress_demo'

function onMountedPlayer({ player }) {
  // 恢复进度
  const savedTime = Number(localStorage.getItem(STORAGE_KEY))
  if (savedTime > 0) {
    player.currentTime(savedTime)
  }

  // 监听播放进度
  player.on('timeupdate', () => {
    const current = Math.floor(player.currentTime())
    localStorage.setItem(STORAGE_KEY, current)
  })
}
</script>
```



## 播放完成驱动业务状态

场景

- 看完视频才能「下一步」
- 视频完成后解锁按钮

```vue
<template>
  <VideoPlayer
    src="https://vjs.zencdn.net/v/oceans.mp4"
    :controls="true"
    @ended="onEnded"
  />

  <button :disabled="!finished">
    下一步
  </button>
</template>

<script setup>
import { ref } from 'vue'

const finished = ref(false)

function onEnded() {
  finished.value = true
}
</script>
```



## 路由切换销毁

场景

- 切路由
- 关页面
- 防止声音还在

```vue
<template>
  <VideoPlayer
    src="https://vjs.zencdn.net/v/oceans.mp4"
    :controls="true"
    @mounted="onMountedPlayer"
  />
</template>

<script setup>
import { ref, onBeforeUnmount } from 'vue'

const player = ref(null)

function onMountedPlayer({ player: p }) {
  player.value = p
}

onBeforeUnmount(() => {
  if (player.value) {
    player.value.dispose()
    player.value = null
  }
})
</script>
```



## 多实例互斥播放

场景

- 列表视频
- 多卡片视频

核心

- 维护一个「当前播放实例」

```vue
<template>
  <div
      v-for="(src, index) in videos"
      :key="index"
      style="margin-bottom: 16px"
  >
    <VideoPlayer
        :src="src"
        :controls="true"
        @mounted="onMountedPlayer"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const videos = [
  'https://vjs.zencdn.net/v/oceans.mp4',
  'https://vjs.zencdn.net/v/oceans.webm'
]

// 所有实例
const players = ref([])

// 当前正在播放的实例
let currentPlayingPlayer = null

function onMountedPlayer({ player }) {
  players.value.push(player)

  // 监听 video.js 原生 play 事件
  player.on('play', () => {
    if (
        currentPlayingPlayer &&
        currentPlayingPlayer !== player
    ) {
      currentPlayingPlayer.pause()
    }
    currentPlayingPlayer = player
  })
}
</script>
```



## 错误处理

场景

- 视频源失效
- 网络异常
- m3u8 加载失败

```vue
<template>
  <VideoPlayer
    src="https://invalid-url/demo.m3u8"
    :controls="true"
    @error="onError"
  />

  <p v-if="errorMsg" style="color:red">
    {{ errorMsg }}
  </p>
</template>

<script setup>
import { ref } from 'vue'

const errorMsg = ref('')

function onError(_, error) {
  console.error('播放错误:', error)
  errorMsg.value = '视频加载失败，请稍后再试'
}
</script>
```

## 自动播放（静音）

> **现代浏览器规则：**
>
> - ❌ 有声音的自动播放 **一定会被拦截**
> - ✅ **静音（muted）才允许自动播放**

所以：

> **自动播放 = `autoplay + muted`**

这是浏览器策略，不是库的问题。

```vue
<template>
  <VideoPlayer
      src="https://vjs.zencdn.net/v/oceans.mp4"
      :autoplay="true"
      :muted="true"
      :controls="true"
      @mounted="onMountedPlayer"
  />
</template>

<script setup>

function onMountedPlayer({ player }) {
  // 保底：某些浏览器 autoplay 仍可能失败
  player.muted(true)
  player.play().catch(() => {
    console.warn('自动播放被浏览器拦截')
  })
}
</script>
```

## 多个视频同时自动播放

```vue
<template>
  <div
      v-for="(src, index) in videos"
      :key="index"
      style="margin-bottom: 16px"
  >
    <VideoPlayer
        :src="src"
        :autoplay="true"
        :muted="true"
        :controls="true"
        @mounted="onMountedPlayer"
    />
  </div>
</template>

<script setup>

const videos = [
  'https://vjs.zencdn.net/v/oceans.mp4',
  'https://vjs.zencdn.net/v/oceans.webm'
]

function onMountedPlayer({ player }) {
  // 保证静音（浏览器允许自动播放）
  player.muted(true)

  // 每个实例自己播放，不互斥
  player.play().catch(() => {
    console.warn('该视频自动播放被浏览器拦截')
  })
}
</script>
```

## 内置倍速菜单

- 控制条里会自动出现 **倍速选择菜单**
- 用户可手动切换
- 不需要你自己做 UI

```vue
<template>
  <VideoPlayer
    src="https://vjs.zencdn.net/v/oceans.mp4"
    :controls="true"
    @mounted="onMountedPlayer"
  />
</template>

<script setup>

function onMountedPlayer({ player }) {
  // 设置可用的倍速选项
  player.playbackRates([0.5, 1, 1.25, 1.5, 2])
}
</script>
```

## 代码控制倍速（业务驱动）

```vue
<template>
  <VideoPlayer
    src="https://vjs.zencdn.net/v/oceans.mp4"
    :controls="true"
    @mounted="onMountedPlayer"
  />

  <div style="margin-top: 8px">
    <button @click="setRate(1)">1x</button>
    <button @click="setRate(1.5)">1.5x</button>
    <button @click="setRate(2)">2x</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const playerRef = ref(null)

function onMountedPlayer({ player }) {
  playerRef.value = player
}

function setRate(rate) {
  playerRef.value?.playbackRate(rate)
}
</script>
```

## 设置高宽

```vue
<template>
  <VideoPlayer
    src="https://vjs.zencdn.net/v/oceans.mp4"
    :controls="true"
    style="width: 800px; height: 450px"
  />
</template>

<script setup>
</script>
```

## 指定宽高 + 响应式容器

```vue
<template>
  <div class="video-container">
    <VideoPlayer
      src="https://vjs.zencdn.net/v/oceans.mp4"
      :controls="true"
      :fluid="true"
    />
  </div>
</template>

<style scoped>
.video-container {
  width: 100%;           /* 父容器宽度自适应 */
  max-width: 900px;      /* 最大宽度 */
  aspect-ratio: 16/9;    /* 保持 16:9 高宽比 */
}
</style>

<script setup>
</script>
```

