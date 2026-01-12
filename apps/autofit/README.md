# autofit.js

`autofit.js` 是一个轻量、简单的 **前端大屏/窗口自适应工具**，按设计稿尺寸全局缩放页面。

调用仅需一行代码，即可适配设置分辨率以下的所有屏幕，无需任何其他辅助。

- [官网地址](https://auto-plugin.github.io/autofit.js/)



## 基础配置

**安装依赖**

```
pnpm add autofit.js@3.2.8
```

**使用示例**

在你主要布局组件（如 App.vue）或者路由挂载完成之后进行初始化。

```vue
<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import autofit from 'autofit.js'

onMounted(() => {
  // 初始化 autofit
  autofit.init({
    el: '#screen',      // 需要自适应的根元素（推荐使用 id）
    dw: 1920,           // 设计稿宽度
    dh: 1080,           // 设计稿高度
    resize: true,       // 是否监听窗口 resize
  })
})

onUnmounted(() => {
  // 避免切换页面时重复监听
  autofit.off()
})
</script>

<template>
  <div id="screen">
    <!-- 内容 -->
    <h1>我是阿腾</h1>
  </div>
</template>
```

## 使用示例

```vue
<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import autofit from 'autofit.js'

onMounted(() => {
  autofit.init({
    el: '#screen',
    dw: 1920,
    dh: 1080,
    resize: true,
  })
})

onUnmounted(() => {
  autofit.off()
})
</script>

<template>
  <div id="screen" class="screen">
    <div class="header">
      Autofit 全屏适配示例（100% + 1920×1080 比例）
    </div>

    <div class="content">
      <div class="box left">
        左侧模块<br />
        设计宽 400
      </div>
      <div class="box center">
        中间模块<br />
        设计宽 800
      </div>
      <div class="box right">
        右侧模块<br />
        设计宽 400
      </div>
    </div>

    <div class="footer">
      当前页面已自动充满屏幕并按比例缩放
    </div>
  </div>
</template>

<style scoped>
/* 官网推荐写法：宽高 100%，不再写死 1920 × 1080 */
.screen {
  width: 100%;
  height: 100%;
  background: #020617;
  color: #fff;
  overflow: hidden;
  position: fixed;
  inset: 0;
}

/* 以下尺寸全部按设计稿 1920×1080 的像素写 */
.header {
  height: 80px;
  line-height: 80px;
  text-align: center;
  font-size: 28px;
  background: #0f172a;
}

.content {
  display: flex;
  justify-content: space-between;
  padding: 40px;
  height: calc(100% - 200px);
  box-sizing: border-box;
}

.box {
  height: 600px;
  border-radius: 12px;
  text-align: center;
  font-size: 20px;
  padding-top: 40px;
  box-sizing: border-box;
}

.left {
  width: 400px;
  background: #1d4ed8;
}

.center {
  width: 800px;
  background: #0284c7;
}

.right {
  width: 400px;
  background: #0ea5e9;
}

.footer {
  height: 120px;
  line-height: 120px;
  text-align: center;
  background: #0f172a;
  font-size: 18px;
}
</style>
```



