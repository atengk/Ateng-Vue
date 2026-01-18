# TailwindCSS

只需书写 HTML 代码，无需书写 CSS，即可快速构建美观的网站。

- [官网地址](https://www.tailwindcss.cn/)



## 基础配置

**安装 TailwindCSS**

```bash
pnpm add -D tailwindcss@4.1.18 @tailwindcss/vite@4.1.18
```

**修改 `vite.config.ts`**

```ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
    plugins: [
        vue(),
        tailwindcss(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        }
    }
});
```

**创建 `tailwind.config.js`**

```js
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

------

**创建 `src/assets/tailwind.css`**

```
@import "tailwindcss";
```

------

**在 `main.ts` 中引入**

```
import '@/assets/tailwind.css'
```



## 使用示例

```vue
<script setup lang="ts">
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-zinc-900">
    <div class="p-6 rounded-xl bg-white text-black shadow-lg">
      <h1 class="text-2xl font-bold text-blue-600">
        Tailwind v4 已生效
      </h1>
      <p class="mt-2 text-gray-500">
        Vue3 + TypeScript + TailwindCSS v4
      </p>
      <button
        class="mt-4 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
      >
        测试按钮
      </button>
    </div>
  </div>
</template>
```

如果这个页面能正常显示深色背景、白卡片、蓝色按钮，说明已完全跑通。

![image-20260118091419332](./assets/image-20260118091419332.png)



## 基础样式能力

### 盒模型：margin、padding、width、height

这个示例只演示 TailwindCSS 中最核心、最基础的“盒模型”能力：
通过类名直接控制元素的 **宽度（width）**、**高度（height）**、**内边距（padding）**、**外边距（margin）**，完全不写任何一行 CSS。

```vue
<script setup lang="ts">
</script>

<template>
  <!-- 页面容器 -->
  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <!-- 外层盒子：用于演示 margin / padding -->
    <div class="bg-red-200 p-4 m-8">
      <!-- 内层盒子：用于演示 width / height / padding -->
      <div class="w-64 h-40 p-4 bg-blue-500 text-white">
        Tailwind 盒模型示例
      </div>
    </div>
  </div>
</template>
```

---

参数说明：

| 类名             | 所属元素 | 对应 CSS 概念    | 作用说明                                 |
| ---------------- | -------- | ---------------- | ---------------------------------------- |
| `min-h-screen`   | 页面容器 | min-height       | 页面最小高度为浏览器视口高度             |
| `bg-gray-100`    | 页面容器 | background-color | 设置页面背景为浅灰色                     |
| `flex`           | 页面容器 | display: flex    | 使用 Flex 布局                           |
| `items-center`   | 页面容器 | align-items      | 垂直居中子元素                           |
| `justify-center` | 页面容器 | justify-content  | 水平居中子元素                           |
| `bg-red-200`     | 外层盒子 | background-color | 红色背景，用于观察外边距与内边距         |
| `p-4`            | 外层盒子 | padding          | 内边距，控制红色区域与蓝色盒子的距离     |
| `m-8`            | 外层盒子 | margin           | 外边距，控制红色盒子与页面其它内容的距离 |
| `w-64`           | 内层盒子 | width            | 固定宽度                                 |
| `h-40`           | 内层盒子 | height           | 固定高度                                 |
| `p-4`            | 内层盒子 | padding          | 内边距，控制文字与蓝色边框的距离         |
| `bg-blue-500`    | 内层盒子 | background-color | 蓝色背景                                 |
| `text-white`     | 内层盒子 | color            | 文字颜色为白色                           |

---

一、基础样式能力

1. 盒模型：margin、padding、width、height
2. 布局：flex、grid、inline、block、hidden
3. 对齐：justify、items、content、place
4. 字体：font-size、font-weight、line-height、font-family
5. 文字颜色、背景色
6. 圆角、边框、阴影
7. 不透明度、显示/隐藏
8. 光标、选中状态

二、交互与状态
9. hover / focus / active / disabled
10. transition / duration / ease
11. transform（scale、rotate、translate）
12. animation（基础动画）

三、响应式与模式切换
13. 响应式断点（sm / md / lg / xl 等）
14. Dark Mode
15. 打印样式（print 变体）
16. 方向性（ltr / rtl）

四、布局增强
17. Sticky / Fixed / Absolute 定位
18. Z-index 分层
19. Overflow 滚动控制
20. Aspect-ratio
21. Container Query

五、状态派生机制
22. group 机制
23. peer 机制
24. data-* 属性驱动样式
25. aria-* 属性驱动样式

六、样式组织能力
26. @layer 分层（base / components / utilities）
27. @apply 组合样式
28. 自定义组件类（语义化 class）

七、主题与设计系统
29. 主题变量（CSS Variables / @theme）
30. 颜色系统定制
31. 间距体系定制
32. 字体系统定制
33. 圆角、阴影、动画体系定制

八、工程化能力
34. 按需扫描与 Tree Shaking
35. 构建期样式生成
36. 类名冲突消解
37. 多主题切换
38. 设计 Token 化

九、动态与组件结合

39. 动态 class 组合
40. 组件样式函数化
41. 样式枚举与类型约束
42. 样式继承与扩展

十、企业级进阶

43. 设计系统抽象
44. UI 规范与 Tailwind 对齐
45. Tailwind 与组件库共存策略
46. Tailwind + Design Tokens 架构
47. Tailwind 作为样式层标准化方案

