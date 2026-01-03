# DPlayer

🍭哇，好棒的HTML5弹幕视频播放器

- [官网地址](https://dplayer.diygod.dev/zh/guide.html)



## 基础配置

**安装依赖**

```
pnpm add dplayer@1.27.1
```

**创建ts类型声明**

```ts
// src/types/dplayer.d.ts
declare module 'dplayer' {
    const DPlayer: any
    export default DPlayer
}
```



## 最基础的用法

在 `App.vue` 直接初始化一个最简单的播放器：

```vue
<template>
  <div id="dplayer"></div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import DPlayer from 'dplayer';

onMounted(() => {
  const dp = new DPlayer({
    container: document.getElementById('dplayer') as HTMLElement,
    video: {
      url: 'https://example.com/demo.mp4',
      type: 'auto',
    },
  });

  console.log(dp); // 控制台查看实例
});
</script>

<style>
#dplayer {
  width: 100%;
  height: 360px;
}
</style>
```

说明：

* 使用 `<script setup lang="ts">` + `onMounted` 生命周期创建 DPlayer 实例。
* 最简单配置：container + video.url。
* DPlayer 可播放多种格式和自适应类型。([dplayer.diygod.dev][1])

---

## 带更多参数和控件配置（主题色／自动播放／循环）

如果你想加更多配置项：

```vue
<template>
  <div id="dplayer"></div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import DPlayer from 'dplayer';

onMounted(() => {
  const player = new DPlayer({
    container: document.getElementById('dplayer') as HTMLElement,
    autoplay: false,         // 自动播放
    theme: '#0093ff',        // 主题色
    loop: true,              // 循环播放
    hotkey: true,            // 支持键盘控制
    playbackSpeed: [0.5,1,1.5,2,3],
    video: {
      url: 'https://vjs.zencdn.net/v/oceans.mp4',
      pic: 'https://github.surmon.me/images/poster/oceans.png', // 封面图
      type: 'auto',
    },
  });

  // 示例 API 调用
  setTimeout(() => player.play(), 1000);
});
</script>
```

此示例加了许多常用选项，如主题色、循环、倍速等。([dplayer.diygod.dev][1])

---

## 使用 ref 操作 DPlayer 实例xxxx

如果想通过模板引用播放器实例，可这样写：

```vue
<template>
  <div class="page">
    <div ref="containerRef" class="player"></div>

    <div class="controls">
      <button @click="play">播放</button>
      <button @click="pause">暂停</button>
      <button @click="toggle">切换</button>

      <button @click="seek(10)">+10s</button>
      <button @click="seek(-10)">-10s</button>

      <button @click="setSpeed(0.5)">0.5x</button>
      <button @click="setSpeed(1)">1x</button>
      <button @click="setSpeed(2)">2x</button>

      <button @click="volume(0.3)">音量30%</button>
      <button @click="volume(1)">音量100%</button>

      <button @click="browserFullscreen">浏览器全屏</button>
      <button @click="toggleWebFullscreen">
        {{ webFullscreen ? '退出网页全屏' : '网页全屏' }}
      </button>
    </div>

    <div class="info">
      ⏱ {{ currentTime }} / {{ duration }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import DPlayer from 'dplayer'

const containerRef = ref<HTMLDivElement | null>(null)
const dp = ref<DPlayer | null>(null)

const currentTime = ref('0.0')
const duration = ref('0.0')

const webFullscreen = ref(false)

onMounted(() => {
  dp.value = new DPlayer({
    container: containerRef.value!,
    theme: '#409eff',
    hotkey: true,
    video: {
      url: 'https://vjs.zencdn.net/v/oceans.mp4'
    }
  })

  dp.value.on('timeupdate', () => {
    if (!dp.value) return
    currentTime.value = dp.value.video.currentTime.toFixed(1)
    duration.value = dp.value.video.duration.toFixed(1)
  })

  window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  dp.value?.destroy()
})

/* ---------------- 播放控制 ---------------- */

function play() {
  dp.value?.video.play()
}

function pause() {
  dp.value?.video.pause()
}

function toggle() {
  if (!dp.value) return
  const video = dp.value.video
  video.paused ? video.play() : video.pause()
}

function seek(seconds: number) {
  if (!dp.value) return
  dp.value.seek(dp.value.video.currentTime + seconds)
}

function setSpeed(speed: number) {
  dp.value?.speed(speed)
}

function volume(v: number) {
  dp.value?.volume(v, true)
}

/* ---------------- 全屏控制 ---------------- */

/** 浏览器原生全屏（真正全屏） */
function browserFullscreen() {
  const el = containerRef.value
  if (!el) return

  if (document.fullscreenElement) {
    document.exitFullscreen()
  } else {
    el.requestFullscreen()
  }
}

/** 网页全屏（可控、稳定） */
function toggleWebFullscreen() {
  webFullscreen.value = !webFullscreen.value

  containerRef.value?.classList.toggle(
      'web-fullscreen',
      webFullscreen.value
  )

  dp.value?.resize()
}

/** ESC 退出网页全屏 */
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && webFullscreen.value) {
    webFullscreen.value = false
    containerRef.value?.classList.remove('web-fullscreen')
    dp.value?.resize()
  }
}
</script>

<style scoped>
.player {
  width: 100%;
  height: 360px;
}

.controls {
  margin-top: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.info {
  margin-top: 8px;
  font-size: 14px;
  color: #666;
}

/* 网页全屏样式（完全自主可控） */
.web-fullscreen {
  position: fixed !important;
  inset: 0;
  width: 100vw !important;
  height: 100vh !important;
  z-index: 9999;
  background: #000;
}
</style>
```

这样在模板或其它方法中就能控制播放器。([dplayer.diygod.dev][1])

---

## 播放 HLS（m3u8）或自定义类型

播放 m3u8 需要用 `customType` 或加载 `hls.js`：

```bash
pnpm add hls.js
```

```vue
<template>
  <div id="dplayer"></div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import DPlayer from 'dplayer';
import Hls from 'hls.js';

onMounted(() => {
  new DPlayer({
    container: document.getElementById('dplayer') as HTMLElement,
    video: {
      url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
      type: 'customHls',
      customType: {
        customHls(video: any) {
          const hls = new Hls();
          hls.loadSource(video.src);
          hls.attachMedia(video);
        },
      },
    },
  });
});
</script>
```

这个写法让 DPlayer 能播放 HLS（`.m3u8`）格式。([dplayer.diygod.dev][1])

---

## 弹幕示例（弹幕不显示）

### 后端

```java
package local.ateng.java.config.controller;

import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/danmaku/v3")
@CrossOrigin
public class DanmakuController {

    private final List<List<Object>> danmakuStore = new ArrayList<>();


    /**
     * 拉取弹幕
     */
    @GetMapping("/")
    public Map<String, Object> list() {
        Map<String, Object> result = new HashMap<>();
        result.put("code", 0);
        result.put("data", danmakuStore);
        return result;
    }

    /**
     * 发送弹幕
     */
    @PostMapping("/")
    public Map<String, Object> send(@RequestBody Object obj) {
        danmakuStore.add(Collections.singletonList(obj));

        return Collections.singletonMap("code", 0);
    }
}
```

### 前端

```vue
<template>
  <div>
    <div
        ref="containerRef"
        style="width: 100%; height: 360px; background: black"
    ></div>

    <div style="margin-top: 12px">
      <button @click="play">播放</button>
      <button @click="sendDanmaku">发送弹幕</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import DPlayer from 'dplayer'

const containerRef = ref<HTMLDivElement | null>(null)
const dp = ref<DPlayer | null>(null)

onMounted(async () => {
  await nextTick()

  dp.value = new DPlayer({
    container: containerRef.value!,
    video: {
      url: 'https://vjs.zencdn.net/v/oceans.mp4',
    },
    danmaku: {
      id: 'demo', // ⚠️ 必须和后端 id 一致
      api: 'http://localhost:12342/danmaku/',
    },
  })

  console.log('DPlayer ready', dp.value)
})

onBeforeUnmount(() => {
  dp.value?.destroy()
})

function play() {
  dp.value?.video.play()
}

/**
 * 正确的弹幕发送方式（v3）
 */
function sendDanmaku() {
  if (!dp.value) return

  dp.value.danmaku.send({
    text: '这条弹幕一定能看到',
    color: 0xffffff,
    type: 0, // 0: 滚动
  })
}
</script>
```

