# v-scale-screen

大屏自适应容器组件，可用于大屏项目开发，实现屏幕自适应，可根据宽度自适应，高度自适应，和宽高等比例自适应，全屏自适应（会存在拉伸问题）

- [官网地址](https://github.com/Alfred-Skyblue/v-scale-screen/blob/v3.0/README.zh_CN.md)



## 基础配置

**安装依赖**

```
pnpm add v-scale-screen@2.3.0
```



## 最简示例

```vue
<script setup lang="ts">
import VScaleScreen from 'v-scale-screen'
</script>

<template>
  <!-- 大屏自适应容器 -->
  <v-scale-screen
      width="1920"
      height="1080"
      :auto-scale="true"
  >
    <div class="screen">
      <div class="header">
        v-scale-screen 全屏适配示例（1920 × 1080 设计稿）
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
        当前页面已通过 v-scale-screen 自动按比例缩放
      </div>
    </div>
  </v-scale-screen>
</template>

<style scoped>
/* 官网推荐写法：宽高 100%，不再写死 1920 × 1080 */
.screen {
  width: 100%;
  height: 100%;
  background: #a5ec19;
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
  background: #0d4de4;
}

.content {
  display: flex;
  justify-content: space-between;
  padding: 40px;
  height: calc(1080px - 80px - 120px);
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
  background: #b222dc;
  font-size: 18px;
}
</style>
```

## autoScale = false（关闭自适应）

```vue
<script setup lang="ts">
import VScaleScreen from 'v-scale-screen'
</script>

<template>
  <v-scale-screen
    width="1920"
    height="1080"
    :auto-scale="false"
  >
    <div class="screen">
      <div class="header">autoScale = false（不缩放）</div>
      <div class="content">
        <div class="box left">左</div>
        <div class="box center">中</div>
        <div class="box right">右</div>
      </div>
      <div class="footer">窗口小于 1920×1080 会溢出</div>
    </div>
  </v-scale-screen>
</template>

<style scoped>
.screen {
  width: 100%;
  height: 100%;
  background: #020617;
  color: #fff;
  position: fixed;
  inset: 0;
}
.header { height: 80px; line-height: 80px; background: #1e3a8a; text-align: center; }
.content {
  height: calc(1080px - 200px);
  display: flex;
  padding: 40px;
  box-sizing: border-box;
}
.box { height: 600px; border-radius: 12px; text-align: center; line-height: 600px; }
.left { width: 400px; background: #2563eb; }
.center { width: 800px; background: #0284c7; margin: 0 40px; }
.right { width: 400px; background: #0ea5e9; }
.footer { height: 120px; line-height: 120px; background: #7c3aed; text-align: center; }
</style>
```

------

## autoScale 轴向留白（只 X 轴留白）

```vue
<script setup lang="ts">
import VScaleScreen from 'v-scale-screen'
</script>

<template>
  <v-scale-screen
    width="1920"
    height="1080"
    :auto-scale="{ x: true, y: false }"
  >
    <div class="screen">
      <div class="header">autoScale = { x: true, y: false }</div>
      <div class="content">
        <div class="box left">左</div>
        <div class="box center">中</div>
        <div class="box right">右</div>
      </div>
      <div class="footer">左右可能留黑边，上下铺满</div>
    </div>
  </v-scale-screen>
</template>

<style scoped>
.screen {
  width: 100%;
  height: 100%;
  background: #020617;
  color: #fff;
  position: fixed;
  inset: 0;
}
.header { height: 80px; line-height: 80px; background: #0f766e; text-align: center; }
.content { height: calc(1080px - 200px); display: flex; padding: 40px; }
.box { height: 600px; line-height: 600px; border-radius: 12px; text-align: center; }
.left { width: 400px; background: #14b8a6; }
.center { width: 800px; background: #2dd4bf; margin: 0 40px; }
.right { width: 400px; background: #5eead4; }
.footer { height: 120px; line-height: 120px; background: #115e59; text-align: center; }
</style>
```

------

## delay（防抖 1 秒）

```vue
<script setup lang="ts">
import VScaleScreen from 'v-scale-screen'
</script>

<template>
  <v-scale-screen
    width="1920"
    height="1080"
    :delay="1000"
  >
    <div class="screen">
      <div class="header">delay = 1000ms（拖动窗口会延迟缩放）</div>
      <div class="content">
        <div class="box left">左</div>
        <div class="box center">中</div>
        <div class="box right">右</div>
      </div>
      <div class="footer">适合复杂大屏防抖</div>
    </div>
  </v-scale-screen>
</template>

<style scoped>
.screen { width: 100%; height: 100%; background: #020617; color: #fff; position: fixed; inset: 0; }
.header { height: 80px; line-height: 80px; background: #7c2d12; text-align: center; }
.content { height: calc(1080px - 200px); display: flex; padding: 40px; }
.box { height: 600px; line-height: 600px; border-radius: 12px; text-align: center; }
.left { width: 400px; background: #ea580c; }
.center { width: 800px; background: #f97316; margin: 0 40px; }
.right { width: 400px; background: #fb923c; }
.footer { height: 120px; line-height: 120px; background: #9a3412; text-align: center; }
</style>
```

------

## fullScreen（拉伸铺满）

```vue
<script setup lang="ts">
import VScaleScreen from 'v-scale-screen'
</script>

<template>
  <v-scale-screen
    width="1920"
    height="1080"
    :full-screen="true"
  >
    <div class="screen">
      <div class="header">fullScreen = true（会拉伸变形）</div>
      <div class="content">
        <div class="box left">左</div>
        <div class="box center">中</div>
        <div class="box right">右</div>
      </div>
      <div class="footer">不推荐生产使用</div>
    </div>
  </v-scale-screen>
</template>

<style scoped>
.screen { width: 100%; height: 100%; background: #020617; color: #fff; position: fixed; inset: 0; }
.header { height: 80px; line-height: 80px; background: #7f1d1d; text-align: center; }
.content { height: calc(1080px - 200px); display: flex; padding: 40px; }
.box { height: 600px; line-height: 600px; border-radius: 12px; text-align: center; }
.left { width: 400px; background: #dc2626; }
.center { width: 800px; background: #ef4444; margin: 0 40px; }
.right { width: 400px; background: #f87171; }
.footer { height: 120px; line-height: 120px; background: #991b1b; text-align: center; }
</style>
```

------

## boxStyle + wrapperStyle（舞台效果）

```vue
<script setup lang="ts">
import VScaleScreen from 'v-scale-screen'
</script>

<template>
  <v-scale-screen
    width="1920"
    height="1080"
    :box-style="{
      background: 'linear-gradient(to right, #020617, #0f172a)'
    }"
    :wrapper-style="{
      boxShadow: '0 0 40px rgba(0,0,0,.6)',
      borderRadius: '16px'
    }"
  >
    <div class="screen">
      <div class="header">舞台效果（boxStyle + wrapperStyle）</div>
      <div class="content">
        <div class="box left">左</div>
        <div class="box center">中</div>
        <div class="box right">右</div>
      </div>
      <div class="footer">商业大屏最常用视觉风格</div>
    </div>
  </v-scale-screen>
</template>

<style scoped>
.screen { width: 100%; height: 100%; background: #020617; color: #fff; }
.header { height: 80px; line-height: 80px; background: #1e293b; text-align: center; }
.content { height: calc(1080px - 200px); display: flex; padding: 40px; }
.box { height: 600px; line-height: 600px; border-radius: 12px; text-align: center; }
.left { width: 400px; background: #2563eb; }
.center { width: 800px; background: #0284c7; margin: 0 40px; }
.right { width: 400px; background: #0ea5e9; }
.footer { height: 120px; line-height: 120px; background: #1e293b; text-align: center; }
</style>
```

------

## bodyOverflowHidden = false（允许页面滚动）

```vue
<script setup lang="ts">
import VScaleScreen from 'v-scale-screen'
</script>

<template>
  <v-scale-screen
    width="1920"
    height="1080"
    :body-overflow-hidden="false"
  >
    <div class="screen">
      <div class="header">bodyOverflowHidden = false</div>
      <div class="content">
        <div class="box left">左</div>
        <div class="box center">中</div>
        <div class="box right">右</div>
      </div>
      <div class="footer">你现在可以滚动页面</div>
    </div>
  </v-scale-screen>
</template>

<style scoped>
.screen { width: 100%; height: 100%; background: #020617; color: #fff; }
.header { height: 80px; line-height: 80px; background: #4c1d95; text-align: center; }
.content { height: calc(1080px - 200px); display: flex; padding: 40px; }
.box { height: 600px; line-height: 600px; border-radius: 12px; text-align: center; }
.left { width: 400px; background: #7c3aed; }
.center { width: 800px; background: #8b5cf6; margin: 0 40px; }
.right { width: 400px; background: #a78bfa; }
.footer { height: 120px; line-height: 120px; background: #5b21b6; text-align: center; }
</style>
```

------

## 全局使用

```vue
<script setup lang="ts">
import VScaleScreen from 'v-scale-screen'
</script>

<template>
  <v-scale-screen
    width="1920"
    height="1080"
    :auto-scale="true"
    :delay="300"
    :box-style="{
      background: '#020617'
    }"
    :wrapper-style="{
      boxShadow: '0 0 30px rgba(0,0,0,.5)'
    }"
    :body-overflow-hidden="true"
  >
    <router-view />
  </v-scale-screen>
</template>
```

