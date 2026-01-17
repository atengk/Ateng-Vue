# screenfull

这是一个简单的 JavaScript全屏 API跨浏览器封装库，可让您将页面或任何元素切换到全屏模式。它能消除浏览器实现上的差异，让您无需为此操心。

- [官网地址](https://github.com/sindresorhus/screenfull)



## 基础配置

**安装依赖**

```
pnpm add screenfull@6.0.2
```



## 封装组合式函数

`src/composables/useFullscreen.ts`

```ts
import { ref, onMounted, onBeforeUnmount } from 'vue';
import screenfull from 'screenfull';

export function useFullscreen() {
    const isSupported = ref<boolean>(screenfull.isEnabled);
    const isFullscreen = ref<boolean>(false);

    const enter = (el?: HTMLElement) => {
        if (!screenfull.isEnabled) return;
        el ? screenfull.request(el) : screenfull.request();
    };

    const exit = () => {
        if (!screenfull.isEnabled) return;
        if (screenfull.isFullscreen) {
            screenfull.exit();
        }
    };

    const toggle = (el?: HTMLElement) => {
        if (!screenfull.isEnabled) return;
        el ? screenfull.toggle(el) : screenfull.toggle();
    };

    const onChange = () => {
        isFullscreen.value = screenfull.isFullscreen;
    };

    onMounted(() => {
        if (!screenfull.isEnabled) return;
        screenfull.on('change', onChange);
    });

    onBeforeUnmount(() => {
        if (!screenfull.isEnabled) return;
        screenfull.off('change', onChange);
    });

    return {
        isSupported,
        isFullscreen,
        enter,
        exit,
        toggle,
    };
}
```



## 整个页面全屏

```vue
<script setup lang="ts">
import { useFullscreen } from '@/composables/useFullscreen';

const { toggle, isFullscreen, isSupported } = useFullscreen();

const handleToggle = () => {
  toggle();
};
</script>

<template>
  <div>
    <button v-if="isSupported" @click="handleToggle">
      {{ isFullscreen ? '退出全屏' : '进入全屏' }}
    </button>
    <p v-else>当前浏览器不支持全屏</p>
  </div>
</template>
```

## 用 `toggle` 切换某个元素的全屏状态

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useFullscreen } from '@/composables/useFullscreen'

const panelRef = ref<HTMLElement>()
const { toggle } = useFullscreen()

const handleToggle = () => {
  if (panelRef.value) {
    toggle(panelRef.value)
  }
}
</script>

<template>
  <div>
    <!-- 这个按钮只负责“进入面板全屏” -->
    <button @click="handleToggle">
      面板全屏
    </button>

    <div
        ref="panelRef"
        style="
        margin-top:16px;
        height:150px;
        border:1px solid #333;
        background:#fff;
        display:flex;
        align-items:center;
        justify-content:center;
      "
    >
      一个可切换全屏的面板
    </div>
  </div>
</template>
```

------

## 指定某个区域全屏

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useFullscreen } from '@/composables/useFullscreen'

const boxRef = ref<HTMLElement>()
const { enter, exit, isFullscreen } = useFullscreen()

const handleEnter = () => {
  if (boxRef.value) {
    enter(boxRef.value)
  }
}

const handleExit = () => {
  exit()
}
</script>

<template>
  <div>
    <button @click="handleEnter">让下面这个区域全屏</button>

    <div ref="boxRef" class="fullscreen-box">
      我是要被全屏的容器

      <!-- 右上角感应区 -->
      <div v-show="isFullscreen" class="hover-zone">
        <button class="exit-btn" @click="handleExit">退出全屏</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fullscreen-box {
  position: relative;
  margin-top: 12px;
  height: 200px;
  background: #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 右上角感应区 */
.hover-zone {
  position: absolute;
  top: 0;
  right: 0;
  width: 60px;
  height: 60px;
}

/* 按钮默认隐藏 */
.exit-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
}

/* 只有全屏状态下 + 鼠标移入右上角区域才显示 */
.fullscreen-box:fullscreen .hover-zone:hover .exit-btn {
  opacity: 1;
  pointer-events: auto;
}
</style>
```

------

