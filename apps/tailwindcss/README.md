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

**创建 `tailwind.config.ts`**

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

### 布局：flex、grid、inline、block、hidden

这个示例演示 TailwindCSS 中最常用的几种布局方式：

- `flex`：弹性布局，适合一维排列（横向 / 纵向）
- `grid`：网格布局，适合二维结构
- `inline`：行内元素显示
- `block`：块级元素显示
- `hidden`：隐藏元素

通过一个页面同时对比这几种布局效果，直观看出它们的差异。

```vue
<script setup lang="ts">
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-6 space-y-8">

    <!-- Flex 布局 -->
    <div>
      <h2 class="mb-2 font-bold">Flex 布局</h2>
      <div class="flex gap-4">
        <div class="w-20 h-20 bg-blue-500 text-white flex items-center justify-center">1</div>
        <div class="w-20 h-20 bg-blue-500 text-white flex items-center justify-center">2</div>
        <div class="w-20 h-20 bg-blue-500 text-white flex items-center justify-center">3</div>
      </div>
    </div>

    <!-- Grid 布局 -->
    <div>
      <h2 class="mb-2 font-bold">Grid 布局</h2>
      <div class="grid grid-cols-3 gap-4">
        <div class="h-20 bg-green-500 text-white flex items-center justify-center">A</div>
        <div class="h-20 bg-green-500 text-white flex items-center justify-center">B</div>
        <div class="h-20 bg-green-500 text-white flex items-center justify-center">C</div>
        <div class="h-20 bg-green-500 text-white flex items-center justify-center">D</div>
        <div class="h-20 bg-green-500 text-white flex items-center justify-center">E</div>
        <div class="h-20 bg-green-500 text-white flex items-center justify-center">F</div>
      </div>
    </div>

    <!-- inline / block / hidden -->
    <div>
      <h2 class="mb-2 font-bold">inline / block / hidden</h2>

      <div class="space-y-2">
        <!-- inline -->
        <div>
          <span class="inline bg-purple-500 text-white px-2">inline 1</span>
          <span class="inline bg-purple-500 text-white px-2">inline 2</span>
          <span class="inline bg-purple-500 text-white px-2">inline 3</span>
        </div>

        <!-- block -->
        <div>
          <span class="block bg-orange-500 text-white px-2">block 1</span>
          <span class="block bg-orange-500 text-white px-2">block 2</span>
          <span class="block bg-orange-500 text-white px-2">block 3</span>
        </div>

        <!-- hidden -->
        <div>
          <span class="bg-red-500 text-white px-2">可见元素</span>
          <span class="hidden bg-red-500 text-white px-2">被 hidden 隐藏的元素</span>
        </div>
      </div>
    </div>

  </div>
</template>
```

------

参数说明：

| 类名             | 所属区域         | 对应 CSS 概念         | 作用说明                         |
| ---------------- | ---------------- | --------------------- | -------------------------------- |
| `flex`           | Flex 容器        | display: flex         | 启用 Flex 布局                   |
| `gap-4`          | Flex / Grid 容器 | gap                   | 子元素之间的间距                 |
| `grid`           | Grid 容器        | display: grid         | 启用 Grid 布局                   |
| `grid-cols-3`    | Grid 容器        | grid-template-columns | 定义为 3 列布局                  |
| `inline`         | 行内示例元素     | display: inline       | 元素按行内方式排列，不独占一行   |
| `block`          | 块级示例元素     | display: block        | 元素独占一行显示                 |
| `hidden`         | 隐藏示例元素     | display: none         | 元素不渲染，不占据任何空间       |
| `space-y-8`      | 页面容器         | row-gap               | 各个示例模块之间的垂直间距       |
| `p-6`            | 页面容器         | padding               | 页面内边距                       |
| `w-20 / h-20`    | Flex 子项        | width / height        | 固定子元素宽高，方便观察布局效果 |
| `h-20`           | Grid 子项        | height                | 固定高度，保持网格项一致         |
| `items-center`   | 子项内部布局     | align-items           | 子项内容垂直居中                 |
| `justify-center` | 子项内部布局     | justify-content       | 子项内容水平居中                 |

### 对齐：justify、items、content、place

这个示例演示 TailwindCSS 中控制“对齐”的四大核心能力：

- `justify-*`：主轴方向对齐方式（Flex / Grid 都适用）
- `items-*`：交叉轴方向对齐方式（Flex / Grid 都适用）
- `content-*`：多行内容整体在容器中的对齐方式（主要用于 Grid 或多行 Flex）
- `place-*`：同时设置 `align-items` 和 `justify-items` 的简写方式（主要用于 Grid）

通过一个页面把这四类对齐方式全部可视化出来。

```vue
<script setup lang="ts">
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-6 space-y-10">

    <!-- justify + items（Flex） -->
    <div>
      <h2 class="mb-2 font-bold">justify + items（Flex 对齐）</h2>
      <div class="flex justify-between items-center h-32 bg-blue-100 px-4">
        <div class="w-16 h-16 bg-blue-500 text-white flex items-center justify-center">A</div>
        <div class="w-16 h-16 bg-blue-500 text-white flex items-center justify-center">B</div>
        <div class="w-16 h-16 bg-blue-500 text-white flex items-center justify-center">C</div>
      </div>
    </div>

    <!-- content（Grid，多行内容整体对齐） -->
    <div>
      <h2 class="mb-2 font-bold">content（Grid 内容整体对齐）</h2>
      <div class="grid grid-cols-3 content-center h-40 bg-green-100 gap-2">
        <div class="h-12 bg-green-500 text-white flex items-center justify-center">1</div>
        <div class="h-12 bg-green-500 text-white flex items-center justify-center">2</div>
        <div class="h-12 bg-green-500 text-white flex items-center justify-center">3</div>
        <div class="h-12 bg-green-500 text-white flex items-center justify-center">4</div>
      </div>
    </div>

    <!-- place（Grid 简写对齐方式） -->
    <div>
      <h2 class="mb-2 font-bold">place（Grid 对齐简写）</h2>
      <div class="grid grid-cols-3 place-items-center h-40 bg-purple-100 gap-4">
        <div class="w-12 h-12 bg-purple-500 text-white">X</div>
        <div class="w-12 h-12 bg-purple-500 text-white">Y</div>
        <div class="w-12 h-12 bg-purple-500 text-white">Z</div>
      </div>
    </div>

  </div>
</template>
```

------

参数说明：

| 类名                 | 所属区域  | 对应 CSS 概念         | 作用说明                                            |
| -------------------- | --------- | --------------------- | --------------------------------------------------- |
| `justify-between`    | Flex 容器 | justify-content       | 子元素在主轴方向两端对齐，中间自动分配空间          |
| `items-center`       | Flex 容器 | align-items           | 子元素在交叉轴方向居中对齐                          |
| `content-center`     | Grid 容器 | align-content         | 多行网格整体在容器中居中                            |
| `place-items-center` | Grid 容器 | place-items           | 同时设置 `align-items` 和 `justify-items` 为 center |
| `h-32` / `h-40`      | 容器      | height                | 固定高度，方便观察对齐效果                          |
| `grid`               | Grid 容器 | display: grid         | 启用 Grid 布局                                      |
| `grid-cols-3`        | Grid 容器 | grid-template-columns | 定义 3 列网格                                       |
| `gap-2` / `gap-4`    | Grid 容器 | gap                   | 网格项之间的间距                                    |
| `flex`               | Flex 容器 | display: flex         | 启用 Flex 布局                                      |
| `bg-*-100`           | 容器      | background-color      | 区分不同示例区域的背景色                            |

------

### 字体：font-size、font-weight、line-height、font-family

这个示例只演示 TailwindCSS 中对“字体系统”的四个核心控制点：

- `font-size`：字体大小
- `font-weight`：字体粗细
- `line-height`：行高
- `font-family`：字体族

通过一个页面直观看出：同一段文字，在不同字体大小、粗细、行高、字体族下的视觉差异。

```vue
<script setup lang="ts">
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-8 space-y-8">
    <!-- 字体大小 -->
    <div>
      <h2 class="mb-2 font-bold">font-size（字体大小）</h2>
      <div class="space-y-1">
        <p class="text-sm">text-sm：较小字体</p>
        <p class="text-base">text-base：默认字体</p>
        <p class="text-lg">text-lg：较大字体</p>
        <p class="text-xl">text-xl：更大字体</p>
        <p class="text-2xl">text-2xl：标题级字体</p>
      </div>
    </div>

    <!-- 字体粗细 -->
    <div>
      <h2 class="mb-2 font-bold">font-weight（字体粗细）</h2>
      <div class="space-y-1">
        <p class="font-light">font-light：细体</p>
        <p class="font-normal">font-normal：正常</p>
        <p class="font-medium">font-medium：中等</p>
        <p class="font-semibold">font-semibold：半粗</p>
        <p class="font-bold">font-bold：加粗</p>
      </div>
    </div>

    <!-- 行高 -->
    <div>
      <h2 class="mb-2 font-bold">line-height（行高）</h2>
      <div class="space-y-4">
        <p class="leading-tight bg-white p-2">
          leading-tight：这是一段多行文本，用来演示紧凑的行高效果。  
          行与行之间的距离较小。
        </p>
        <p class="leading-normal bg-white p-2">
          leading-normal：这是一段多行文本，用来演示正常的行高效果。  
          这是最常见、最舒适的阅读行高。
        </p>
        <p class="leading-loose bg-white p-2">
          leading-loose：这是一段多行文本，用来演示宽松的行高效果。  
          行与行之间的距离明显变大。
        </p>
      </div>
    </div>

    <!-- 字体族 -->
    <div>
      <h2 class="mb-2 font-bold">font-family（字体族）</h2>
      <div class="space-y-1">
        <p class="font-sans">font-sans：无衬线字体（默认，UI 常用）</p>
        <p class="font-serif">font-serif：衬线字体（偏阅读风格）</p>
        <p class="font-mono">font-mono：等宽字体（代码风格）</p>
      </div>
    </div>
  </div>
</template>
```

------

参数说明：

| 类名                                                         | 所属分类 | 对应 CSS 概念    | 作用说明                         |
| ------------------------------------------------------------ | -------- | ---------------- | -------------------------------- |
| `text-sm` / `text-base` / `text-lg` / `text-xl` / `text-2xl` | 字体大小 | font-size        | 控制文字的大小层级               |
| `font-light`                                                 | 字体粗细 | font-weight      | 细字体                           |
| `font-normal`                                                | 字体粗细 | font-weight      | 默认粗细                         |
| `font-medium`                                                | 字体粗细 | font-weight      | 中等粗细                         |
| `font-semibold`                                              | 字体粗细 | font-weight      | 半粗体                           |
| `font-bold`                                                  | 字体粗细 | font-weight      | 加粗                             |
| `leading-tight`                                              | 行高     | line-height      | 紧凑行距                         |
| `leading-normal`                                             | 行高     | line-height      | 正常行距                         |
| `leading-loose`                                              | 行高     | line-height      | 宽松行距                         |
| `font-sans`                                                  | 字体族   | font-family      | 无衬线字体，适合 UI 界面         |
| `font-serif`                                                 | 字体族   | font-family      | 衬线字体，适合长文阅读           |
| `font-mono`                                                  | 字体族   | font-family      | 等宽字体，适合代码展示           |
| `space-y-*`                                                  | 布局辅助 | gap（纵向）      | 控制各行文字之间的垂直间距       |
| `bg-white`                                                   | 视觉辅助 | background-color | 用白底突出文字区域，方便观察行高 |

------

视觉理解总结：

- `text-*` 决定 **字有多大**
- `font-*` 决定 **字有多粗、用什么字体**
- `leading-*` 决定 **行与行之间有多疏或多密**

这三者组合起来，就是整个前端系统里“文字排版体系”的核心。

### 文字颜色、背景色

这个示例只演示 TailwindCSS 中对“颜色系统”的最基础控制能力：

- `text-*`：控制文字颜色
- `bg-*`：控制背景颜色

通过对比不同颜色组合，直观看出文字颜色与背景色在界面中的搭配效果，这是所有 UI 设计里最核心的一环。

```vue
<script setup lang="ts">
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-8 space-y-8">

    <!-- 文字颜色 -->
    <div>
      <h2 class="mb-2 font-bold">文字颜色（text-*）</h2>
      <div class="space-y-1">
        <p class="text-black">text-black：黑色文字</p>
        <p class="text-gray-500">text-gray-500：灰色文字</p>
        <p class="text-blue-600">text-blue-600：蓝色文字</p>
        <p class="text-green-600">text-green-600：绿色文字</p>
        <p class="text-red-600">text-red-600：红色文字</p>
      </div>
    </div>

    <!-- 背景颜色 -->
    <div>
      <h2 class="mb-2 font-bold">背景色（bg-*）</h2>
      <div class="grid grid-cols-3 gap-4">
        <div class="p-4 bg-blue-100">bg-blue-100</div>
        <div class="p-4 bg-green-100">bg-green-100</div>
        <div class="p-4 bg-yellow-100">bg-yellow-100</div>
        <div class="p-4 bg-red-100">bg-red-100</div>
        <div class="p-4 bg-purple-100">bg-purple-100</div>
        <div class="p-4 bg-zinc-200">bg-zinc-200</div>
      </div>
    </div>

    <!-- 文字颜色 + 背景色组合 -->
    <div>
      <h2 class="mb-2 font-bold">文字颜色 + 背景色组合</h2>
      <div class="space-y-2">
        <div class="p-3 bg-blue-500 text-white rounded">
          bg-blue-500 + text-white
        </div>
        <div class="p-3 bg-green-500 text-white rounded">
          bg-green-500 + text-white
        </div>
        <div class="p-3 bg-red-500 text-white rounded">
          bg-red-500 + text-white
        </div>
        <div class="p-3 bg-gray-800 text-gray-100 rounded">
          bg-gray-800 + text-gray-100
        </div>
      </div>
    </div>

  </div>
</template>
```

------

参数说明：

| 类名             | 所属分类 | 对应 CSS 概念    | 作用说明                         |
| ---------------- | -------- | ---------------- | -------------------------------- |
| `text-black`     | 文字颜色 | color            | 设置文字为黑色                   |
| `text-gray-500`  | 文字颜色 | color            | 设置文字为中灰色，常用于说明文本 |
| `text-blue-600`  | 文字颜色 | color            | 设置文字为蓝色，常用于强调或链接 |
| `text-green-600` | 文字颜色 | color            | 设置文字为绿色，常用于成功状态   |
| `text-red-600`   | 文字颜色 | color            | 设置文字为红色，常用于警告或错误 |
| `bg-blue-100`    | 背景色   | background-color | 浅蓝背景                         |
| `bg-green-100`   | 背景色   | background-color | 浅绿背景                         |
| `bg-yellow-100`  | 背景色   | background-color | 浅黄背景                         |
| `bg-red-100`     | 背景色   | background-color | 浅红背景                         |
| `bg-purple-100`  | 背景色   | background-color | 浅紫背景                         |
| `bg-zinc-200`    | 背景色   | background-color | 中性灰背景                       |
| `bg-blue-500`    | 背景色   | background-color | 标准蓝色主色调                   |
| `bg-green-500`   | 背景色   | background-color | 标准绿色主色调                   |
| `bg-red-500`     | 背景色   | background-color | 标准红色主色调                   |
| `bg-gray-800`    | 背景色   | background-color | 深色背景，常用于暗色主题         |
| `text-white`     | 文字颜色 | color            | 白色文字，常搭配深色背景         |
| `text-gray-100`  | 文字颜色 | color            | 浅灰文字，用于深色背景           |

------

视觉理解总结：

- `text-*` 决定 **字是什么颜色**
- `bg-*` 决定 **块是什么颜色**
- 两者组合决定了 **可读性、层级感和 UI 风格**

在实际项目中：

- 浅背景 + 深文字 → 适合阅读
- 深背景 + 浅文字 → 适合强调
- 高对比色 → 用于按钮、状态提示、重要操作

### 圆角、边框、阴影

这个示例演示 TailwindCSS 中用于控制“视觉立体感”的三大基础能力：

- `rounded-*`：控制圆角大小
- `border / border-*`：控制边框粗细与颜色
- `shadow-*`：控制阴影层级

它们共同决定了一个 UI 是“扁平的”还是“有层次感的”。

```vue
<script setup lang="ts">
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-8 space-y-8">

    <!-- 圆角 -->
    <div>
      <h2 class="mb-2 font-bold">圆角（rounded-*）</h2>
      <div class="flex gap-4">
        <div class="w-24 h-24 bg-blue-400 text-white flex items-center justify-center rounded">
          rounded
        </div>
        <div class="w-24 h-24 bg-blue-400 text-white flex items-center justify-center rounded-lg">
          rounded-lg
        </div>
        <div class="w-24 h-24 bg-blue-400 text-white flex items-center justify-center rounded-xl">
          rounded-xl
        </div>
        <div class="w-24 h-24 bg-blue-400 text-white flex items-center justify-center rounded-full">
          full
        </div>
      </div>
    </div>

    <!-- 边框 -->
    <div>
      <h2 class="mb-2 font-bold">边框（border-*）</h2>
      <div class="flex gap-4">
        <div class="w-24 h-24 bg-white border flex items-center justify-center">
          border
        </div>
        <div class="w-24 h-24 bg-white border-2 border-blue-500 flex items-center justify-center">
          border-2
        </div>
        <div class="w-24 h-24 bg-white border-4 border-red-500 flex items-center justify-center">
          border-4
        </div>
      </div>
    </div>

    <!-- 阴影 -->
    <div>
      <h2 class="mb-2 font-bold">阴影（shadow-*）</h2>
      <div class="flex gap-4">
        <div class="w-24 h-24 bg-white shadow-sm flex items-center justify-center">
          sm
        </div>
        <div class="w-24 h-24 bg-white shadow flex items-center justify-center">
          base
        </div>
        <div class="w-24 h-24 bg-white shadow-lg flex items-center justify-center">
          lg
        </div>
        <div class="w-24 h-24 bg-white shadow-2xl flex items-center justify-center">
          2xl
        </div>
      </div>
    </div>

    <!-- 组合效果 -->
    <div>
      <h2 class="mb-2 font-bold">圆角 + 边框 + 阴影组合</h2>
      <div class="p-6 bg-white rounded-xl border border-gray-200 shadow-lg">
        这是一个典型“卡片”UI：  
        使用圆角、边框和阴影共同构建层次感。
      </div>
    </div>

  </div>
</template>
```

------

参数说明：

| 类名              | 所属分类 | 对应 CSS 概念 | 作用说明                     |
| ----------------- | -------- | ------------- | ---------------------------- |
| `rounded`         | 圆角     | border-radius | 默认圆角                     |
| `rounded-lg`      | 圆角     | border-radius | 较大圆角                     |
| `rounded-xl`      | 圆角     | border-radius | 更大圆角                     |
| `rounded-full`    | 圆角     | border-radius | 完全圆形（常用于头像、标签） |
| `border`          | 边框     | border-width  | 默认 1px 边框                |
| `border-2`        | 边框     | border-width  | 2px 边框                     |
| `border-4`        | 边框     | border-width  | 4px 边框                     |
| `border-blue-500` | 边框     | border-color  | 边框颜色为蓝色               |
| `border-red-500`  | 边框     | border-color  | 边框颜色为红色               |
| `border-gray-200` | 边框     | border-color  | 浅灰色边框，常用于卡片分割   |
| `shadow-sm`       | 阴影     | box-shadow    | 轻微阴影                     |
| `shadow`          | 阴影     | box-shadow    | 默认阴影                     |
| `shadow-lg`       | 阴影     | box-shadow    | 明显阴影                     |
| `shadow-2xl`      | 阴影     | box-shadow    | 很强的阴影效果               |

------

视觉理解总结：

- `rounded-*` 决定 **形状是否柔和**
- `border-*` 决定 **边界是否清晰**
- `shadow-*` 决定 **层级是否立体**

在真实项目中最常见的组合就是：

```text
rounded + border + shadow
```

它直接等价于：

> “这是一个卡片 / 模块 / 可操作区域”

也是后台系统、管理系统、组件库中最常见的基础视觉单元。

### 不透明度、显示 / 隐藏

这个示例演示 TailwindCSS 中对“元素可见程度”和“是否渲染”的基础控制能力：

- `opacity-*`：控制元素的不透明度（看得见，但可能是半透明）
- `hidden`：完全隐藏元素（不占空间，相当于 `display: none`）
- `block / inline / inline-block`：控制元素显示方式
- `invisible`：元素不可见，但仍然占据布局空间

通过对比可以清楚区分：
**“看不见”** 和 **“不存在”** 在布局上的差别。

```vue
<script setup lang="ts">
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-8 space-y-10">

    <!-- 不透明度 -->
    <div>
      <h2 class="mb-2 font-bold">不透明度（opacity-*）</h2>
      <div class="flex gap-4">
        <div class="w-24 h-24 bg-blue-500 text-white flex items-center justify-center opacity-100">
          100%
        </div>
        <div class="w-24 h-24 bg-blue-500 text-white flex items-center justify-center opacity-75">
          75%
        </div>
        <div class="w-24 h-24 bg-blue-500 text-white flex items-center justify-center opacity-50">
          50%
        </div>
        <div class="w-24 h-24 bg-blue-500 text-white flex items-center justify-center opacity-25">
          25%
        </div>
      </div>
    </div>

    <!-- 显示 / 隐藏（hidden vs invisible） -->
    <div>
      <h2 class="mb-2 font-bold">显示 / 隐藏（hidden vs invisible）</h2>

      <div class="space-y-4">
        <!-- hidden：完全不占空间 -->
        <div class="flex gap-4 items-center">
          <div class="w-24 h-12 bg-green-500 text-white flex items-center justify-center">
            可见
          </div>
          <div class="hidden w-24 h-12 bg-green-500 text-white flex items-center justify-center">
            hidden
          </div>
          <div class="w-24 h-12 bg-green-500 text-white flex items-center justify-center">
            可见
          </div>
        </div>

        <!-- invisible：不可见但占空间 -->
        <div class="flex gap-4 items-center">
          <div class="w-24 h-12 bg-purple-500 text-white flex items-center justify-center">
            可见
          </div>
          <div class="invisible w-24 h-12 bg-purple-500 text-white flex items-center justify-center">
            invisible
          </div>
          <div class="w-24 h-12 bg-purple-500 text-white flex items-center justify-center">
            可见
          </div>
        </div>
      </div>
    </div>

    <!-- display 类型对比 -->
    <div>
      <h2 class="mb-2 font-bold">display 类型（block / inline / inline-block）</h2>

      <div class="space-y-4">
        <!-- block -->
        <div>
          <span class="block bg-blue-200 p-2">block 1</span>
          <span class="block bg-blue-200 p-2">block 2</span>
        </div>

        <!-- inline -->
        <div>
          <span class="inline bg-yellow-200 p-2">inline 1</span>
          <span class="inline bg-yellow-200 p-2">inline 2</span>
          <span class="inline bg-yellow-200 p-2">inline 3</span>
        </div>

        <!-- inline-block -->
        <div>
          <span class="inline-block bg-green-200 p-2 w-24 text-center">inline-block</span>
          <span class="inline-block bg-green-200 p-2 w-24 text-center">inline-block</span>
        </div>
      </div>
    </div>

  </div>
</template>
```

------

参数说明：

| 类名           | 所属分类 | 对应 CSS 概念         | 作用说明                       |
| -------------- | -------- | --------------------- | ------------------------------ |
| `opacity-100`  | 不透明度 | opacity               | 完全不透明                     |
| `opacity-75`   | 不透明度 | opacity               | 75% 不透明                     |
| `opacity-50`   | 不透明度 | opacity               | 半透明                         |
| `opacity-25`   | 不透明度 | opacity               | 非常透明                       |
| `hidden`       | 显示控制 | display: none         | 元素完全不渲染，不占任何空间   |
| `invisible`    | 显示控制 | visibility: hidden    | 元素不可见，但仍然占据布局空间 |
| `block`        | 显示类型 | display: block        | 块级元素，独占一行             |
| `inline`       | 显示类型 | display: inline       | 行内元素，不支持宽高           |
| `inline-block` | 显示类型 | display: inline-block | 行内排列，但可以设置宽高       |
| `w-* / h-*`    | 尺寸控制 | width / height        | 固定元素尺寸，方便观察布局效果 |
| `flex`         | 布局辅助 | display: flex         | 用于水平排列对比元素           |

------

视觉理解总结：

- `opacity-*`：
  元素仍然存在，只是“更透明”
- `hidden`：
  元素从页面结构中“消失”，布局会发生变化
- `invisible`：
  元素“看不见”，但“位置还在”，布局不变
- `block / inline / inline-block`：
  决定元素在文档流中的排列方式和是否可以设置宽高

这是 UI 交互中非常关键的一组能力，
例如：禁用按钮、遮罩层、占位加载骨架、动画渐隐渐显，都离不开它们。

### 光标、选中状态

这个示例演示 TailwindCSS 对“鼠标光标样式”和“文本选中状态”的控制能力：

- `cursor-*`：控制鼠标移到元素上时的光标形态
- `select-none / select-text / select-all`：控制文本是否可以被选中
- `selection:*`：控制文本被选中时的背景色和文字颜色

这些能力通常用于：
按钮交互、不可编辑区域、防止误选、定制选中高亮样式等。

```vue
<script setup lang="ts">
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-8 space-y-10">

    <!-- 光标样式 -->
    <div>
      <h2 class="mb-4 font-bold">光标样式（cursor-*）</h2>
      <div class="flex gap-4">
        <div class="px-4 py-2 bg-blue-500 text-white cursor-pointer rounded">
          cursor-pointer
        </div>
        <div class="px-4 py-2 bg-green-500 text-white cursor-default rounded">
          cursor-default
        </div>
        <div class="px-4 py-2 bg-yellow-500 text-white cursor-not-allowed rounded">
          cursor-not-allowed
        </div>
        <div class="px-4 py-2 bg-purple-500 text-white cursor-wait rounded">
          cursor-wait
        </div>
        <div class="px-4 py-2 bg-gray-500 text-white cursor-move rounded">
          cursor-move
        </div>
      </div>
    </div>

    <!-- 文本选中控制 -->
    <div>
      <h2 class="mb-4 font-bold">文本是否可选（select-*）</h2>
      <div class="space-y-3">
        <p class="p-2 bg-white rounded select-text">
          这段文字可以被选中（select-text）
        </p>
        <p class="p-2 bg-white rounded select-none">
          这段文字不能被选中（select-none）
        </p>
        <p class="p-2 bg-white rounded select-all">
          点击一次即可全选（select-all）
        </p>
      </div>
    </div>

    <!-- 选中状态样式 -->
    <div>
      <h2 class="mb-4 font-bold">选中状态样式（selection:*）</h2>
      <p
        class="p-4 bg-white rounded
               selection:bg-blue-500
               selection:text-white"
      >
        选中这段文字时，背景会变成蓝色，文字会变成白色。
        这是通过 TailwindCSS 的 selection: 变体控制的。
      </p>
    </div>

  </div>
</template>
```

------

参数说明：

| 类名                    | 所属分类 | 对应 CSS 概念                | 作用说明                   |
| ----------------------- | -------- | ---------------------------- | -------------------------- |
| `cursor-pointer`        | 光标     | cursor: pointer              | 鼠标变成“手型”，常用于按钮 |
| `cursor-default`        | 光标     | cursor: default              | 默认箭头光标               |
| `cursor-not-allowed`    | 光标     | cursor: not-allowed          | 禁止操作状态               |
| `cursor-wait`           | 光标     | cursor: wait                 | 表示加载或等待             |
| `cursor-move`           | 光标     | cursor: move                 | 表示可拖动                 |
| `select-text`           | 选中文本 | user-select: text            | 文本可以被选中             |
| `select-none`           | 选中文本 | user-select: none            | 文本不可被选中             |
| `select-all`            | 选中文本 | user-select: all             | 点击即可全选               |
| `selection:bg-blue-500` | 选中样式 | ::selection background-color | 选中时背景色               |
| `selection:text-white`  | 选中样式 | ::selection color            | 选中时文字颜色             |

------

理解要点：

- `cursor-*` 决定“这个区域能不能点、能不能拖、是不是禁用状态”
- `select-none` 常用于：按钮、图标、菜单项，防止误选文字
- `selection:*` 用于增强品牌感，让“文本选中颜色”与系统主题保持一致
- 光标 + 选中状态组合起来，就是**最基础的人机交互反馈系统**

---

## 交互与状态

### hover / focus / active / disabled

这个示例演示 TailwindCSS 中最重要的一组“交互状态”能力：

- `hover:*`：鼠标悬停时触发
- `focus:*`：元素获取焦点时触发（输入框、按钮、Tab 切换）
- `active:*`：鼠标按下瞬间触发
- `disabled:*`：元素被禁用时触发

它们构成了 Web UI 中最基础的“交互反馈体系”，
几乎所有按钮、表单、可点击区域，都依赖这套状态系统。

```vue
<script setup lang="ts">
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-10 space-y-10">

    <!-- hover / active -->
    <div>
      <h2 class="mb-4 font-bold">hover / active（按钮交互反馈）</h2>
      <button
        class="
          px-6 py-3 rounded text-white bg-blue-500
          hover:bg-blue-600
          active:bg-blue-700
          transition
        "
      >
        悬停 / 按下按钮
      </button>
    </div>

    <!-- focus -->
    <div>
      <h2 class="mb-4 font-bold">focus（输入框聚焦状态）</h2>
      <input
        type="text"
        placeholder="点击输入框观察 focus 状态"
        class="
          w-80 px-4 py-2 rounded border border-gray-300
          focus:outline-none
          focus:ring-2
          focus:ring-blue-500
          focus:border-blue-500
        "
      />
    </div>

    <!-- disabled -->
    <div>
      <h2 class="mb-4 font-bold">disabled（禁用状态）</h2>
      <button
        disabled
        class="
          px-6 py-3 rounded text-white bg-gray-400
          cursor-not-allowed
          disabled:opacity-50
        "
      >
        禁用按钮
      </button>
    </div>

  </div>
</template>
```

------

参数说明：

| 类名                    | 所属状态 | 对应 CSS 概念    | 作用说明               |
| ----------------------- | -------- | ---------------- | ---------------------- |
| `hover:bg-blue-600`     | hover    | :hover           | 鼠标悬停时改变背景色   |
| `active:bg-blue-700`    | active   | :active          | 鼠标按下瞬间改变背景色 |
| `focus:outline-none`    | focus    | :focus           | 移除默认聚焦轮廓       |
| `focus:ring-2`          | focus    | box-shadow       | 添加聚焦光圈效果       |
| `focus:ring-blue-500`   | focus    | box-shadow color | 设置聚焦光圈颜色       |
| `focus:border-blue-500` | focus    | border-color     | 聚焦时边框变色         |
| `disabled`              | disabled | HTML 属性        | 设置按钮不可用         |
| `disabled:opacity-50`   | disabled | :disabled        | 禁用状态下降低透明度   |
| `cursor-not-allowed`    | disabled | cursor           | 鼠标提示“不可操作”     |
| `transition`            | 动画辅助 | transition       | 让状态切换更平滑       |

------

理解层级：

- `hover` → “我可以点它”
- `focus` → “我正在操作它”
- `active` → “我正在按它”
- `disabled` → “它现在不可用”

这四个状态合在一起，就是任何一个合格 UI 组件（按钮、输入框、表单控件）的**最低交互标准配置**。

### transition / duration / ease

这个示例演示 TailwindCSS 中“动画过渡系统”的三大核心组成部分：

- `transition-*`：指定哪些属性参与过渡动画
- `duration-*`：指定动画持续时间
- `ease-*`：指定动画的加速/减速曲线

它们组合起来，就能让 UI 从“生硬跳变”升级为“丝滑过渡”。

```vue
<script setup lang="ts">
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-10 space-y-10">

    <!-- 基础过渡 -->
    <div>
      <h2 class="mb-4 font-bold">基础 transition</h2>
      <div
        class="
          w-40 h-20 bg-blue-500 text-white rounded
          flex items-center justify-center
          transition
          hover:bg-blue-700
        "
      >
        hover 我
      </div>
    </div>

    <!-- 不同 duration 对比 -->
    <div>
      <h2 class="mb-4 font-bold">duration（动画时间对比）</h2>
      <div class="flex gap-6">
        <div
          class="
            w-32 h-16 bg-green-500 text-white rounded
            flex items-center justify-center
            transition
            duration-100
            hover:scale-110
          "
        >
          100ms
        </div>
        <div
          class="
            w-32 h-16 bg-green-500 text-white rounded
            flex items-center justify-center
            transition
            duration-300
            hover:scale-110
          "
        >
          300ms
        </div>
        <div
          class="
            w-32 h-16 bg-green-500 text-white rounded
            flex items-center justify-center
            transition
            duration-700
            hover:scale-110
          "
        >
          700ms
        </div>
      </div>
    </div>

    <!-- 不同 ease 曲线对比 -->
    <div>
      <h2 class="mb-4 font-bold">ease（动画曲线对比）</h2>
      <div class="flex gap-6">
        <div
          class="
            w-32 h-16 bg-purple-500 text-white rounded
            flex items-center justify-center
            transition
            duration-500
            ease-linear
            hover:translate-x-10
          "
        >
          linear
        </div>
        <div
          class="
            w-32 h-16 bg-purple-500 text-white rounded
            flex items-center justify-center
            transition
            duration-500
            ease-in
            hover:translate-x-10
          "
        >
          ease-in
        </div>
        <div
          class="
            w-32 h-16 bg-purple-500 text-white rounded
            flex items-center justify-center
            transition
            duration-500
            ease-out
            hover:translate-x-10
          "
        >
          ease-out
        </div>
        <div
          class="
            w-32 h-16 bg-purple-500 text-white rounded
            flex items-center justify-center
            transition
            duration-500
            ease-in-out
            hover:translate-x-10
          "
        >
          ease-in-out
        </div>
      </div>
    </div>

  </div>
</template>
```

------

参数说明：

| 类名                   | 所属分类 | 对应 CSS 概念              | 作用说明                                      |
| ---------------------- | -------- | -------------------------- | --------------------------------------------- |
| `transition`           | 过渡     | transition-property        | 为常见属性启用过渡（颜色、transform、阴影等） |
| `transition-colors`    | 过渡     | transition-property        | 只对颜色变化生效                              |
| `transition-transform` | 过渡     | transition-property        | 只对 transform 生效                           |
| `duration-100`         | 时间     | transition-duration        | 动画 100ms                                    |
| `duration-300`         | 时间     | transition-duration        | 动画 300ms（最常用）                          |
| `duration-700`         | 时间     | transition-duration        | 动画 700ms（慢速动画）                        |
| `ease-linear`          | 曲线     | transition-timing-function | 匀速运动                                      |
| `ease-in`              | 曲线     | transition-timing-function | 先慢后快                                      |
| `ease-out`             | 曲线     | transition-timing-function | 先快后慢                                      |
| `ease-in-out`          | 曲线     | transition-timing-function | 先慢→快→慢                                    |
| `hover:scale-110`      | 触发方式 | transform: scale           | 悬停时放大                                    |
| `hover:translate-x-10` | 触发方式 | transform: translateX      | 悬停时水平移动                                |

------

直觉理解：

- `transition`：**告诉浏览器“这个变化要有动画”**
- `duration-*`：**动画跑多快**
- `ease-*`：**动画跑得“像不像自然运动”**

如果类比现实世界：

| 角色         | 类比           |
| ------------ | -------------- |
| `transition` | 打开“缓动开关” |
| `duration`   | 车速快慢       |
| `ease`       | 起步和刹车方式 |

这三件套，是 Tailwind 中一切动画体验的“底层基础设施”，
后面再加 `transform / opacity / shadow / color`，就能做出完整的动效系统。

### transform（scale / rotate / translate）

这个示例演示 TailwindCSS 中最核心的“几何变换”能力：

- `scale-*`：缩放（放大 / 缩小）
- `rotate-*`：旋转
- `translate-*`：位移（平移）

它们本质都是对 CSS `transform` 的封装，是动画、交互、卡片效果、按钮反馈的基础。

```vue
<script setup lang="ts">
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-10 space-y-12">

    <!-- scale 缩放 -->
    <div>
      <h2 class="mb-4 font-bold">scale（缩放）</h2>
      <div class="flex gap-6">
        <div
          class="
            w-24 h-24 bg-blue-500 text-white rounded
            flex items-center justify-center
            transition duration-300
            hover:scale-110
          "
        >
          放大
        </div>
        <div
          class="
            w-24 h-24 bg-blue-500 text-white rounded
            flex items-center justify-center
            transition duration-300
            hover:scale-75
          "
        >
          缩小
        </div>
      </div>
    </div>

    <!-- rotate 旋转 -->
    <div>
      <h2 class="mb-4 font-bold">rotate（旋转）</h2>
      <div class="flex gap-6">
        <div
          class="
            w-24 h-24 bg-green-500 text-white rounded
            flex items-center justify-center
            transition duration-300
            hover:rotate-12
          "
        >
          12°
        </div>
        <div
          class="
            w-24 h-24 bg-green-500 text-white rounded
            flex items-center justify-center
            transition duration-300
            hover:-rotate-12
          "
        >
          -12°
        </div>
      </div>
    </div>

    <!-- translate 位移 -->
    <div>
      <h2 class="mb-4 font-bold">translate（位移）</h2>
      <div class="flex gap-10">
        <div
          class="
            w-24 h-24 bg-purple-500 text-white rounded
            flex items-center justify-center
            transition duration-300
            hover:translate-x-6
          "
        >
          向右
        </div>
        <div
          class="
            w-24 h-24 bg-purple-500 text-white rounded
            flex items-center justify-center
            transition duration-300
            hover:-translate-x-6
          "
        >
          向左
        </div>
        <div
          class="
            w-24 h-24 bg-purple-500 text-white rounded
            flex items-center justify-center
            transition duration-300
            hover:translate-y-6
          "
        >
          向下
        </div>
        <div
          class="
            w-24 h-24 bg-purple-500 text-white rounded
            flex items-center justify-center
            transition duration-300
            hover:-translate-y-6
          "
        >
          向上
        </div>
      </div>
    </div>

  </div>
</template>
```

------

参数说明：

| 类名             | 所属分类 | 对应 CSS 概念               | 作用说明       |
| ---------------- | -------- | --------------------------- | -------------- |
| `scale-110`      | 缩放     | transform: scale(1.1)       | 放大到 110%    |
| `scale-75`       | 缩放     | transform: scale(0.75)      | 缩小到 75%     |
| `rotate-12`      | 旋转     | transform: rotate(12deg)    | 顺时针旋转 12° |
| `-rotate-12`     | 旋转     | transform: rotate(-12deg)   | 逆时针旋转 12° |
| `translate-x-6`  | 位移     | transform: translateX(...)  | 向右移动       |
| `-translate-x-6` | 位移     | transform: translateX(-...) | 向左移动       |
| `translate-y-6`  | 位移     | transform: translateY(...)  | 向下移动       |
| `-translate-y-6` | 位移     | transform: translateY(-...) | 向上移动       |
| `transition`     | 动画     | transition                  | 开启过渡动画   |
| `duration-300`   | 动画     | transition-duration         | 动画时长 300ms |

------

直觉理解：

| 能力        | 你在“移动什么”         |
| ----------- | ---------------------- |
| `scale`     | 大小（远近感、强调感） |
| `rotate`    | 方向（活泼、动态感）   |
| `translate` | 位置（位移、浮动感）   |

在真实项目里：

- `scale` 常用于：按钮 hover 放大、卡片强调
- `rotate` 常用于：图标旋转、加载状态
- `translate` 常用于：抽屉、弹窗、悬浮效果

这三者 + `transition / duration / ease`，就已经构成一个完整的**动画基础系统**。

### animation（基础动画）

这个示例演示 TailwindCSS 中内置的“基础动画类”：
它们不依赖 `hover`，页面加载后就会自动播放。

Tailwind 提供了一些开箱即用的动画：

- `animate-spin`：旋转
- `animate-ping`：雷达波纹
- `animate-pulse`：呼吸闪烁
- `animate-bounce`：弹跳

```vue
<script setup lang="ts">
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-10 space-y-12">

    <!-- animate-spin -->
    <div>
      <h2 class="mb-4 font-bold">animate-spin（旋转动画）</h2>
      <div class="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>

    <!-- animate-ping -->
    <div>
      <h2 class="mb-4 font-bold">animate-ping（波纹扩散）</h2>
      <div class="relative w-16 h-16">
        <span class="absolute inset-0 rounded-full bg-green-400 animate-ping"></span>
        <span class="relative inline-flex w-16 h-16 rounded-full bg-green-600"></span>
      </div>
    </div>

    <!-- animate-pulse -->
    <div>
      <h2 class="mb-4 font-bold">animate-pulse（呼吸闪烁）</h2>
      <div class="w-24 h-12 bg-purple-500 text-white rounded flex items-center justify-center animate-pulse">
        加载中
      </div>
    </div>

    <!-- animate-bounce -->
    <div>
      <h2 class="mb-4 font-bold">animate-bounce（弹跳动画）</h2>
      <div class="w-12 h-12 bg-yellow-500 rounded-full animate-bounce"></div>
    </div>

  </div>
</template>
```

------

参数说明：

| 类名                   | 所属分类 | 对应 CSS 概念         | 作用说明                 |
| ---------------------- | -------- | --------------------- | ------------------------ |
| `animate-spin`         | 动画     | keyframes + animation | 无限旋转，常用于 loading |
| `animate-ping`         | 动画     | keyframes + animation | 向外扩散并逐渐透明       |
| `animate-pulse`        | 动画     | keyframes + animation | 透明度与亮度周期变化     |
| `animate-bounce`       | 动画     | keyframes + animation | 上下弹跳效果             |
| `relative / absolute`  | 定位     | position              | 用于 ping 动画叠加定位   |
| `border-t-transparent` | 边框     | border-color          | 制作“转圈 loading”缺口   |

------

使用场景对照：

| 动画             | 常见用途                     |
| ---------------- | ---------------------------- |
| `animate-spin`   | Loading 图标、请求中状态     |
| `animate-ping`   | 新消息提示、在线状态、定位点 |
| `animate-pulse`  | 骨架屏、占位加载             |
| `animate-bounce` | 引导提示、强调入口           |

------

理解重点：

- `transition` 是“**状态变化时**的动画”
- `animation` 是“**自动循环播放**的动画”

一个是被动触发，一个是主动播放。
UI 中这两种动画配合使用，才是完整的动效体系。

## 响应式与模式切换

### 响应式断点（sm / md / lg / xl 等）

这个示例演示 TailwindCSS 中最核心的“响应式能力”：
通过在类名前加断点前缀，让同一个元素在不同屏幕尺寸下表现出不同样式，而不需要写任何媒体查询。

规则本质是：

> `断点:类名`
> 当屏幕宽度 ≥ 该断点时，类名才会生效

```vue
<script setup lang="ts">
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-6 space-y-8">

    <h1 class="text-xl font-bold">
      响应式断点示例（缩放浏览器窗口观察变化）
    </h1>

    <!-- 响应式盒子 -->
    <div
      class="
        w-full
        h-32
        flex items-center justify-center
        text-white font-bold
        bg-blue-500
        sm:bg-green-500
        md:bg-yellow-500
        lg:bg-purple-500
        xl:bg-red-500
      "
    >
      根据屏幕尺寸改变颜色
    </div>

    <!-- 响应式布局 -->
    <div
      class="
        grid grid-cols-1
        sm:grid-cols-2
        md:grid-cols-3
        lg:grid-cols-4
        gap-4
      "
    >
      <div class="bg-white p-4 rounded shadow">Card 1</div>
      <div class="bg-white p-4 rounded shadow">Card 2</div>
      <div class="bg-white p-4 rounded shadow">Card 3</div>
      <div class="bg-white p-4 rounded shadow">Card 4</div>
      <div class="bg-white p-4 rounded shadow">Card 5</div>
      <div class="bg-white p-4 rounded shadow">Card 6</div>
      <div class="bg-white p-4 rounded shadow">Card 7</div>
      <div class="bg-white p-4 rounded shadow">Card 8</div>
    </div>

  </div>
</template>
```

------

参数说明：

| 前缀   | 断点含义（默认值） | 对应 CSS 概念              | 作用说明           |
| ------ | ------------------ | -------------------------- | ------------------ |
| 无前缀 | `< 640px`          | 普通样式                   | 移动端（默认）     |
| `sm:`  | `≥ 640px`          | @media (min-width: 640px)  | 小屏设备、横屏手机 |
| `md:`  | `≥ 768px`          | @media (min-width: 768px)  | 平板               |
| `lg:`  | `≥ 1024px`         | @media (min-width: 1024px) | 笔记本             |
| `xl:`  | `≥ 1280px`         | @media (min-width: 1280px) | 大屏显示器         |
| `2xl:` | `≥ 1536px`         | @media (min-width: 1536px) | 超大屏             |

------

本示例中用到的响应式类说明：

| 类名               | 含义                 |
| ------------------ | -------------------- |
| `bg-blue-500`      | 默认背景色（手机端） |
| `sm:bg-green-500`  | ≥640px 时背景变绿    |
| `md:bg-yellow-500` | ≥768px 时背景变黄    |
| `lg:bg-purple-500` | ≥1024px 时背景变紫   |
| `xl:bg-red-500`    | ≥1280px 时背景变红   |
| `grid-cols-1`      | 默认一列             |
| `sm:grid-cols-2`   | 小屏两列             |
| `md:grid-cols-3`   | 中屏三列             |
| `lg:grid-cols-4`   | 大屏四列             |

------

理解模型（非常重要）：

Tailwind 是 **移动端优先（Mobile First）**：

```text
默认类        → 手机样式
sm:xxx        → 覆盖手机样式
md:xxx        → 覆盖 sm
lg:xxx        → 覆盖 md
xl:xxx        → 覆盖 lg
```

就像写：

```css
/* 手机 */
.box { background: blue; }

/* 平板 */
@media (min-width: 768px) {
  .box { background: yellow; }
}
```

但在 Tailwind 中变成：

```html
<div class="bg-blue-500 md:bg-yellow-500"></div>
```

这就是 Tailwind 响应式系统最强大的地方：
**把媒体查询“内联”进类名体系里，让布局逻辑一眼可读。**

### Dark Mode

这个示例演示 TailwindCSS 中的“暗黑模式”能力：
通过 `dark:` 前缀，在深色模式下自动切换样式，而不需要写任何额外 CSS。

前提：项目中已开启 Dark Mode（通常是 `class` 模式）：

```ts
// tailwind.config.ts
export default {
  darkMode: 'class',
}
```

当 `<html>` 或 `<body>` 上存在 `class="dark"` 时，所有 `dark:*` 类名才会生效。

```vue
<script setup lang="ts">
</script>

<template>
  <!-- 这里假设外层某处有 class="dark"，可以手动加在 html/body 上测试 -->
  <div
    class="
      min-h-screen
      bg-gray-100 text-gray-900
      dark:bg-gray-900 dark:text-gray-100
      flex items-center justify-center
      p-10
    "
  >
    <div
      class="
        w-80 p-6 rounded-xl shadow-lg
        bg-white text-gray-800
        dark:bg-gray-800 dark:text-gray-100
      "
    >
      <h2 class="text-xl font-bold mb-4">
        Dark Mode 示例
      </h2>

      <p class="mb-4 text-sm text-gray-600 dark:text-gray-300">
        在浅色模式和深色模式下，背景色与文字颜色会自动切换。
      </p>

      <button
        class="
          px-4 py-2 rounded
          bg-blue-500 text-white
          hover:bg-blue-600
          dark:bg-blue-400 dark:hover:bg-blue-500
          transition
        "
      >
        操作按钮
      </button>
    </div>
  </div>
</template>
```

------

参数说明：

| 类名                     | 所属分类         | 作用说明                         |
| ------------------------ | ---------------- | -------------------------------- |
| `dark:`                  | 模式前缀         | 当父级存在 `class="dark"` 时生效 |
| `bg-gray-100`            | 浅色模式         | 页面浅色背景                     |
| `dark:bg-gray-900`       | 深色模式         | 页面深色背景                     |
| `text-gray-900`          | 浅色模式         | 深色文字                         |
| `dark:text-gray-100`     | 深色模式         | 浅色文字                         |
| `bg-white`               | 浅色模式         | 卡片白色背景                     |
| `dark:bg-gray-800`       | 深色模式         | 卡片深灰背景                     |
| `text-gray-600`          | 浅色模式         | 次要文字颜色                     |
| `dark:text-gray-300`     | 深色模式         | 深色模式下的次要文字             |
| `dark:bg-blue-400`       | 深色模式         | 按钮在暗色下的主色               |
| `dark:hover:bg-blue-500` | 深色模式 + hover | 暗色模式下的悬停反馈             |

------

理解重点：

1. `dark:` 本质是一个“模式前缀”，就像 `hover:`、`md:` 一样

2. 不需要写两套组件，只需要在同一元素上写两套样式：

   ```text
   默认类 → 浅色模式
   dark:类 → 深色模式
   ```

3. Dark Mode 本质上是“主题切换”的基础设施：

```html
<html class="dark">
  <!-- 深色模式 -->
</html>

<html>
  <!-- 浅色模式 -->
</html>
```

------

直觉模型：

| 模式                | 你在做什么           |
| ------------------- | -------------------- |
| 普通类              | 定义“白天”的世界     |
| `dark:*`            | 定义“夜晚”的世界     |
| 切换 `class="dark"` | 在白天与黑夜之间切换 |

这也是 Tailwind 在主题系统上极其优雅的地方：
**模式不是一套新系统，只是类名前缀的又一种形态。**

### 打印样式（print 变体）

这个示例演示 TailwindCSS 中的 `print:` 变体：
它用于“仅在打印时生效”的样式控制，相当于 CSS 里的：

```css
@media print { ... }
```

典型用途：

- 隐藏按钮、菜单、导航栏
- 调整字体大小、颜色（打印通常用黑白）
- 去掉背景色和阴影，让打印更干净
- 调整布局宽度，适合 A4 纸

```vue
<script setup lang="ts">
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-8">

    <!-- 页面标题 -->
    <h1
      class="
        text-2xl font-bold mb-4
        print:text-black
      "
    >
      打印样式示例页面
    </h1>

    <!-- 工具栏（只在屏幕显示，打印时隐藏） -->
    <div
      class="
        mb-6 p-4 bg-blue-500 text-white rounded
        print:hidden
      "
    >
      这是操作工具栏（打印时会被隐藏）
    </div>

    <!-- 内容区域 -->
    <div
      class="
        bg-white p-6 rounded shadow
        print:bg-transparent
        print:shadow-none
        print:p-0
      "
    >
      <p
        class="
          text-gray-700
          print:text-black
        "
      >
        这是主要内容区域。  
        在屏幕上有背景色、阴影和内边距；  
        在打印时会变成纯白背景、无阴影、黑色文字，更适合纸张阅读。
      </p>

      <div class="mt-4 space-y-2">
        <p class="print:text-black">
          • 屏幕模式：适合阅读和交互
        </p>
        <p class="print:text-black">
          • 打印模式：适合纸张输出
        </p>
      </div>
    </div>

  </div>
</template>
```

------

参数说明：

| 类名                   | 所属分类 | 对应 CSS 概念 | 作用说明           |
| ---------------------- | -------- | ------------- | ------------------ |
| `print:`               | 媒体变体 | @media print  | 仅在打印时生效     |
| `print:hidden`         | 显示控制 | display: none | 打印时隐藏元素     |
| `print:text-black`     | 文字颜色 | color         | 打印时强制黑色文字 |
| `print:bg-transparent` | 背景     | background    | 打印时去掉背景色   |
| `print:shadow-none`    | 阴影     | box-shadow    | 打印时移除阴影     |
| `print:p-0`            | 间距     | padding       | 打印时去掉内边距   |

------

理解重点：

平时你写的是：

```text
普通类 → 屏幕样式
print:类 → 打印样式
```

就像：

```text
bg-white        → 屏幕
print:bg-none   → 打印
```

对比 Dark Mode：

| 维度     | 前缀          |
| -------- | ------------- |
| 深色模式 | `dark:`       |
| 响应式   | `sm:` / `md:` |
| 打印模式 | `print:`      |

它们本质完全一致：
**都是“条件生效”的类前缀，只是触发条件不同。**

------

真实项目中，`print:` 通常用于：

- 报表页面
- 发票、订单、合同
- 简历打印
- 后台系统“导出为纸质文件”的页面

这是很多人忽略、但在企业系统中非常重要的一块能力。

### 方向性（ltr / rtl）

这个示例演示 TailwindCSS 中对“文字与布局方向”的适配能力：

- `ltr:*`：仅在从左到右（Left To Right）模式下生效
- `rtl:*`：仅在从右到左（Right To Left）模式下生效

常用于多语言系统（如：阿拉伯语、希伯来语），
同一套组件在不同书写方向下，自动“镜像布局”。

> 方向由外层元素的 `dir` 属性控制：
>
> ```html
> <html dir="ltr">  <!-- 默认 -->
> <html dir="rtl">  <!-- 右到左 -->
> ```

```vue
<script setup lang="ts">
</script>

<template>
  <!-- 切换这里的 dir="ltr" / dir="rtl" 观察布局变化 -->
  <div
    dir="ltr"
    class="
      min-h-screen bg-gray-100 p-10 space-y-8
    "
  >
    <h1 class="text-xl font-bold">
      方向性示例（切换 dir 为 ltr / rtl 观察）
    </h1>

    <!-- 卡片示例 -->
    <div
      class="
        flex items-center gap-4
        p-4 bg-white rounded shadow
      "
    >
      <!-- 图标区域 -->
      <div
        class="
          w-12 h-12 bg-blue-500 text-white rounded
          flex items-center justify-center
          ltr:mr-4 rtl:ml-4
        "
      >
        图标
      </div>

      <!-- 文本区域 -->
      <div class="flex-1">
        <h2 class="font-bold">标题</h2>
        <p class="text-gray-600">
          在 LTR 模式下图标在左边，在 RTL 模式下图标在右边。
        </p>
      </div>
    </div>

    <!-- 对齐方式方向适配 -->
    <div
      class="
        p-4 bg-white rounded shadow
        text-left
        rtl:text-right
      "
    >
      文字在 LTR 时左对齐，在 RTL 时右对齐。
    </div>

    <!-- 位移方向适配 -->
    <div
      class="
        w-32 h-12 bg-green-500 text-white rounded
        flex items-center justify-center
        transition duration-300
        hover:ltr:translate-x-4
        hover:rtl:-translate-x-4
      "
    >
      Hover 移动方向
    </div>

  </div>
</template>
```

------

参数说明：

| 类名                       | 所属分类 | 对应 CSS 概念  | 作用说明          |
| -------------------------- | -------- | -------------- | ----------------- |
| `dir="ltr"`                | 方向声明 | direction: ltr | 从左到右书写方向  |
| `dir="rtl"`                | 方向声明 | direction: rtl | 从右到左书写方向  |
| `ltr:*`                    | 方向变体 | :dir(ltr)      | 仅在 LTR 模式生效 |
| `rtl:*`                    | 方向变体 | :dir(rtl)      | 仅在 RTL 模式生效 |
| `ltr:mr-4`                 | 间距方向 | margin-right   | LTR 时右外边距    |
| `rtl:ml-4`                 | 间距方向 | margin-left    | RTL 时左外边距    |
| `rtl:text-right`           | 文本对齐 | text-align     | RTL 时右对齐      |
| `hover:ltr:translate-x-4`  | 交互方向 | transform      | LTR 悬停向右移动  |
| `hover:rtl:-translate-x-4` | 交互方向 | transform      | RTL 悬停向左移动  |

------

理解模型：

在国际化 UI 中，你不能再假设：

> 左边 = 开始
> 右边 = 结束

而应该是：

| 抽象概念      | LTR 下 | RTL 下 |
| ------------- | ------ | ------ |
| 开始（start） | 左     | 右     |
| 结束（end）   | 右     | 左     |

`ltr:` / `rtl:` 的价值在于：
你只写一套组件，就能自然适配两种文化的阅读方向，而不用复制两套样式。

------

真实项目中常见用法：

- 菜单图标与文字位置自动镜像
- 输入框图标从左到右切换
- 抽屉、侧边栏从相反方向滑出
- 表单 label 与输入框顺序反转

这是做**国际化后台系统 / 多语言产品**时非常高级、也非常实用的一块能力。

## 布局增强

### Sticky / Fixed / Absolute 定位

这个示例演示 TailwindCSS 中三种最常见的“脱离普通文档流布局”的定位方式：

- `sticky`：在滚动到指定位置前是普通元素，到达阈值后“吸顶/吸边”
- `fixed`：相对于浏览器窗口固定，不随页面滚动
- `absolute`：相对于最近一个 `relative` 祖先元素定位

它们是做：
导航栏、悬浮按钮、吸顶标题、角标、气泡提示 的基础能力。

```vue
<script setup lang="ts">
</script>

<template>
  <div class="min-h-[200vh] bg-gray-100">

    <!-- Fixed：固定在右下角的按钮 -->
    <div
      class="
        fixed bottom-6 right-6
        w-14 h-14 rounded-full
        bg-blue-500 text-white
        flex items-center justify-center
        shadow-lg
      "
    >
      固定
    </div>

    <!-- Sticky：吸顶标题 -->
    <div
      class="
        sticky top-0
        bg-yellow-300
        p-4 font-bold
        z-10
      "
    >
      我是 Sticky 吸顶栏（滚动页面观察）
    </div>

    <!-- 普通内容，用来制造滚动 -->
    <div class="p-6 space-y-10">

      <p v-for="i in 5" :key="i" class="text-gray-700">
        这里是普通内容区域，用来撑高页面，方便你测试 sticky 和 fixed 的效果。
      </p>

      <!-- Relative + Absolute 组合 -->
      <div
        class="
          relative
          w-64 h-40
          bg-white
          rounded shadow
        "
      >
        <div class="p-4">
          父盒子（relative）
        </div>

        <!-- Absolute：相对父元素定位 -->
        <div
          class="
            absolute top-2 right-2
            px-2 py-1
            text-xs
            bg-red-500 text-white
            rounded
          "
        >
          角标
        </div>
      </div>

      <p v-for="i in 5" :key="'x' + i" class="text-gray-700">
        继续滚动页面，观察 fixed 按钮始终固定在右下角。
      </p>

    </div>
  </div>
</template>
```

------

参数说明：

| 类名        | 所属分类 | 对应 CSS 概念      | 作用说明                                 |
| ----------- | -------- | ------------------ | ---------------------------------------- |
| `fixed`     | 定位     | position: fixed    | 相对浏览器窗口固定，不随滚动             |
| `bottom-6`  | 定位偏移 | bottom             | 距离窗口底部                             |
| `right-6`   | 定位偏移 | right              | 距离窗口右侧                             |
| `sticky`    | 定位     | position: sticky   | 到达阈值后“粘住”                         |
| `top-0`     | 定位偏移 | top                | 触发吸顶的位置                           |
| `absolute`  | 定位     | position: absolute | 脱离文档流，基于最近的 relative 祖先定位 |
| `relative`  | 定位参照 | position: relative | 为 absolute 提供定位参考                 |
| `z-10`      | 层级     | z-index            | 防止 sticky 被内容覆盖                   |
| `shadow-lg` | 阴影     | box-shadow         | 强化悬浮层的“浮起感”                     |

------

直觉理解对比：

| 定位方式   | 参照物                   | 滚动时表现   | 常见用途                 |
| ---------- | ------------------------ | ------------ | ------------------------ |
| `absolute` | 最近的 `relative` 父元素 | 跟着父元素走 | 角标、气泡、图标定位     |
| `fixed`    | 浏览器窗口               | 永远不动     | 返回顶部按钮、客服悬浮窗 |
| `sticky`   | 先是自己，后是窗口       | 到点“吸住”   | 表头、分类栏、导航吸顶   |

------

一句话总结：

- `absolute` → **局部定位（在某个盒子里精确放东西）**
- `fixed` → **全局悬浮（页面级 UI）**
- `sticky` → **滚动增强（体验最好的吸顶方案）**

这三种定位，是所有中后台系统和内容型网站布局的“标配三件套”。

### Z-index 分层

这个示例演示 TailwindCSS 中“层级控制”的能力：
通过 `z-*` 类名来控制元素在 Z 轴上的前后顺序，也就是“谁盖在谁上面”。

在真实项目中，`z-index` 常用于：

- 弹窗 / 抽屉 / 遮罩层
- 下拉菜单
- 悬浮按钮
- Sticky / Fixed 元素防止被内容盖住

```vue
<script setup lang="ts">
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-10">

    <h2 class="mb-6 font-bold text-xl">
      Z-index 分层示例
    </h2>

    <!-- 容器，用于演示重叠 -->
    <div class="relative w-80 h-80 bg-white rounded shadow">

      <!-- 第一层 -->
      <div
        class="
          absolute top-6 left-6
          w-40 h-40
          bg-blue-500 text-white
          flex items-center justify-center
          z-10
        "
      >
        z-10
      </div>

      <!-- 第二层 -->
      <div
        class="
          absolute top-12 left-12
          w-40 h-40
          bg-green-500 text-white
          flex items-center justify-center
          z-20
        "
      >
        z-20
      </div>

      <!-- 第三层 -->
      <div
        class="
          absolute top-20 left-20
          w-40 h-40
          bg-red-500 text-white
          flex items-center justify-center
          z-30
        "
      >
        z-30
      </div>

    </div>

  </div>
</template>
```

------

参数说明：

| 类名             | 所属分类   | 对应 CSS 概念      | 作用说明                     |
| ---------------- | ---------- | ------------------ | ---------------------------- |
| `relative`       | 定位上下文 | position: relative | 作为 absolute 元素的定位参考 |
| `absolute`       | 定位       | position: absolute | 使盒子可以相互重叠           |
| `z-10`           | 层级       | z-index: 10        | 层级较低                     |
| `z-20`           | 层级       | z-index: 20        | 层级更高                     |
| `z-30`           | 层级       | z-index: 30        | 当前示例中最高层             |
| `top-* / left-*` | 定位偏移   | top / left         | 控制重叠位置                 |
| `bg-*`           | 背景色     | background-color   | 用不同颜色区分层级           |

Tailwind 默认提供常用层级值：

| 类名     | 对应 z-index |
| -------- | ------------ |
| `z-0`    | 0            |
| `z-10`   | 10           |
| `z-20`   | 20           |
| `z-30`   | 30           |
| `z-40`   | 40           |
| `z-50`   | 50           |
| `z-auto` | auto         |

------

理解重点：

1. **z-index 只有在定位元素上才生效**
   也就是必须配合：

   - `relative`
   - `absolute`
   - `fixed`
   - `sticky`

   之一使用。

2. 数字越大，层级越高：

   ```text
   z-10  <  z-20  <  z-30
   ```

3. 常见分层规范（项目里很实用）：

| 场景          | 推荐层级 |
| ------------- | -------- |
| 普通内容      | `z-0`    |
| Sticky 顶栏   | `z-10`   |
| 下拉菜单      | `z-20`   |
| 遮罩层        | `z-40`   |
| 弹窗 / 对话框 | `z-50`   |

------

直觉理解：

`z-index` 就像“透明胶片叠在一起”：

- 数字小 → 在下面
- 数字大 → 在上面

UI 是否“专业”，很大一部分取决于：

> 弹窗是不是永远在最上层？
> 遮罩是不是能盖住背景？
> 吸顶栏会不会被内容压住？

这些问题，全部都是 `z-index` 分层在解决。

### Overflow 滚动控制

这个示例演示 TailwindCSS 中对“内容溢出”和“滚动行为”的控制能力：

- `overflow-hidden`：超出部分直接裁剪
- `overflow-auto`：需要时自动出现滚动条
- `overflow-scroll`：始终显示滚动条
- `overflow-x-* / overflow-y-*`：只控制某一个方向
- 常用于：
  - 表格横向滚动
  - 弹窗内容区
  - 卡片内部滚动
  - 防止页面抖动

```vue
<script setup lang="ts">
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-10 space-y-10">

    <!-- overflow-hidden -->
    <div>
      <h2 class="mb-2 font-bold">overflow-hidden（裁剪溢出内容）</h2>
      <div class="w-48 h-24 bg-blue-200 overflow-hidden p-2">
        <div class="w-96 bg-blue-500 text-white p-2">
          这个内容宽度超过了父容器，但被 overflow-hidden 裁剪掉了，看不到完整内容。
        </div>
      </div>
    </div>

    <!-- overflow-auto -->
    <div>
      <h2 class="mb-2 font-bold">overflow-auto（需要时显示滚动条）</h2>
      <div class="w-48 h-24 bg-green-200 overflow-auto p-2">
        <div class="w-96 bg-green-500 text-white p-2">
          当内容超出容器时，会自动出现滚动条，可以滚动查看全部内容。
        </div>
      </div>
    </div>

    <!-- overflow-scroll -->
    <div>
      <h2 class="mb-2 font-bold">overflow-scroll（始终显示滚动条）</h2>
      <div class="w-48 h-24 bg-yellow-200 overflow-scroll p-2">
        <div class="w-40 bg-yellow-500 text-white p-2">
          即使内容不超出，也会强制显示滚动条。
        </div>
      </div>
    </div>

    <!-- 单方向滚动控制 -->
    <div>
      <h2 class="mb-2 font-bold">单方向滚动（overflow-x / overflow-y）</h2>
      <div class="w-48 h-24 bg-purple-200 overflow-x-auto overflow-y-hidden p-2">
        <div class="w-96 bg-purple-500 text-white p-2">
          这里只允许横向滚动，纵向内容被隐藏。
        </div>
      </div>
    </div>

  </div>
</template>
```

------

参数说明：

| 类名                | 所属分类 | 对应 CSS 概念      | 作用说明               |
| ------------------- | -------- | ------------------ | ---------------------- |
| `overflow-hidden`   | 溢出控制 | overflow: hidden   | 隐藏超出部分           |
| `overflow-auto`     | 溢出控制 | overflow: auto     | 需要时显示滚动条       |
| `overflow-scroll`   | 溢出控制 | overflow: scroll   | 始终显示滚动条         |
| `overflow-x-auto`   | 横向滚动 | overflow-x: auto   | 横向超出时滚动         |
| `overflow-y-auto`   | 纵向滚动 | overflow-y: auto   | 纵向超出时滚动         |
| `overflow-x-hidden` | 横向裁剪 | overflow-x: hidden | 隐藏横向溢出           |
| `overflow-y-hidden` | 纵向裁剪 | overflow-y: hidden | 隐藏纵向溢出           |
| `w-* / h-*`         | 尺寸     | width / height     | 制造“溢出”条件方便演示 |

------

理解重点：

1. Overflow 本质解决一个问题：
   **内容比容器大时怎么办？**

| 场景         | 推荐做法          |
| ------------ | ----------------- |
| 弹窗主体内容 | `overflow-auto`   |
| 表格横向溢出 | `overflow-x-auto` |
| 卡片装饰裁剪 | `overflow-hidden` |
| 固定滚动容器 | `overflow-scroll` |

1. 企业项目里最常见组合：

```html
<div class="h-full overflow-auto">
  <!-- 可滚动内容区域 -->
</div>
```

1. 与定位、Z-index 配合非常重要：

- 弹窗：`fixed + z-50 + overflow-auto`
- 抽屉：`fixed + overflow-y-auto`
- 表格容器：`relative + overflow-x-auto`

------

一句话总结：

> 定位决定“放哪”，
> Z-index 决定“盖谁”，
> Overflow 决定“多出来的内容怎么处理”。

### Aspect-ratio

这个示例演示 TailwindCSS 中的 **宽高比控制（Aspect Ratio）** 能力：
不需要手写 padding 技巧或 JS 计算，只通过类名就能让元素始终保持固定比例。

常见使用场景：

- 图片容器（16:9、1:1、4:3）
- 视频播放器
- 卡片封面
- Banner 轮播图

```vue
<script setup lang="ts">
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-10 space-y-10">

    <!-- 16:9 比例 -->
    <div>
      <h2 class="mb-2 font-bold">16:9 宽屏比例</h2>
      <div class="aspect-video bg-blue-500 flex items-center justify-center text-white">
        aspect-video (16:9)
      </div>
    </div>

    <!-- 1:1 正方形比例 -->
    <div>
      <h2 class="mb-2 font-bold">1:1 正方形比例</h2>
      <div class="aspect-square bg-green-500 flex items-center justify-center text-white">
        aspect-square (1:1)
      </div>
    </div>

    <!-- 自定义比例 4:3 -->
    <div>
      <h2 class="mb-2 font-bold">自定义比例 4:3</h2>
      <div class="aspect-[4/3] bg-purple-500 flex items-center justify-center text-white">
        aspect-[4/3]
      </div>
    </div>

    <!-- 图片容器常见用法 -->
    <div>
      <h2 class="mb-2 font-bold">图片容器常见用法</h2>
      <div class="w-64 aspect-video overflow-hidden rounded-lg shadow">
        <img
          src="https://picsum.photos/800/600"
          class="w-full h-full object-cover"
        />
      </div>
    </div>

  </div>
</template>
```

------

参数说明：

| 类名              | 所属分类 | 对应 CSS 概念        | 作用说明                         |
| ----------------- | -------- | -------------------- | -------------------------------- |
| `aspect-video`    | 宽高比   | aspect-ratio: 16 / 9 | 设置为常用视频比例               |
| `aspect-square`   | 宽高比   | aspect-ratio: 1 / 1  | 正方形容器                       |
| `aspect-[4/3]`    | 宽高比   | aspect-ratio: 4 / 3  | 任意自定义比例                   |
| `w-*`             | 尺寸     | width                | 只要给宽度，高度会按比例自动计算 |
| `object-cover`    | 图片适配 | object-fit: cover    | 图片铺满容器，裁剪多余部分       |
| `overflow-hidden` | 裁剪     | overflow: hidden     | 防止图片溢出容器                 |
| `rounded-lg`      | 圆角     | border-radius        | 常见图片卡片圆角                 |
| `shadow`          | 阴影     | box-shadow           | 卡片层次感                       |

------

理解重点：

1. Aspect-ratio 的核心价值是：

> 只管“比例”，不管“具体尺寸”。

你只要给：

```text
宽度 + aspect-ratio → 高度自动算出来
```

1. 传统写法（以前）：

- padding-top 百分比黑魔法
- JS 监听 resize
- CSS 复杂计算

Tailwind 直接一行解决：

```html
<div class="aspect-video"></div>
```

1. 项目中最常用的几个比例：

| 场景          | 推荐类名        |
| ------------- | --------------- |
| 视频          | `aspect-video`  |
| 头像 / 商品图 | `aspect-square` |
| 老式图片      | `aspect-[4/3]`  |
| 海报          | `aspect-[3/4]`  |
| 横幅          | `aspect-[21/9]` |

------

一句话总结：

> Aspect-ratio 是现代前端布局里“图片、视频、卡片容器”的刚需能力，
> 用 Tailwind 后，你只用记住一句：
> **比例写在类名里，尺寸交给浏览器算。**

### Container Query

这个示例演示 TailwindCSS 中的 **容器查询（Container Query）** 能力：
不再只根据“屏幕宽度”响应，而是根据“父容器自身宽度”来决定样式，非常适合组件化开发。

典型场景：

- 卡片组件在不同布局区域大小不一样
- 同一个组件在侧边栏 / 主内容区表现不同
- 微前端、嵌套布局中避免依赖全局断点

```vue
<script setup lang="ts">
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-10 space-y-10">

    <!-- 大容器 -->
    <div class="bg-white p-4 rounded shadow">
      <h2 class="mb-2 font-bold">大容器（宽）</h2>
      <div class="container-type-inline-size border p-4">
        <div
          class="
            bg-blue-500 text-white p-4 rounded
            @container (min-width: 400px):flex
            @container (min-width: 400px):items-center
            @container (min-width: 400px):gap-4
          "
        >
          <div class="w-16 h-16 bg-white/30 rounded"></div>
          <div>
            <div class="font-bold">卡片标题</div>
            <div class="text-sm">
              当容器宽度 ≥ 400px 时，这个卡片会变成横向布局。
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 小容器 -->
    <div class="bg-white p-4 rounded shadow w-64">
      <h2 class="mb-2 font-bold">小容器（窄）</h2>
      <div class="container-type-inline-size border p-4">
        <div
          class="
            bg-green-500 text-white p-4 rounded
            @container (min-width: 400px):flex
            @container (min-width: 400px):items-center
            @container (min-width: 400px):gap-4
          "
        >
          <div class="w-16 h-16 bg-white/30 rounded"></div>
          <div>
            <div class="font-bold">卡片标题</div>
            <div class="text-sm">
              容器宽度不足 400px，仍然保持纵向布局。
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
```

------

参数说明：

| 类名 / 语法                                  | 所属分类     | 对应 CSS 概念                | 作用说明                         |
| -------------------------------------------- | ------------ | ---------------------------- | -------------------------------- |
| `container-type-inline-size`                 | 容器声明     | container-type: inline-size  | 把当前元素声明为“可查询容器”     |
| `@container (min-width: 400px):flex`         | 容器查询变体 | @container + media-like 条件 | 当容器宽度 ≥ 400px 时启用 `flex` |
| `@container (min-width: 400px):items-center` | 对齐         | align-items                  | 横向布局时垂直居中               |
| `@container (min-width: 400px):gap-4`        | 间距         | gap                          | 横向排列子元素的间距             |
| `w-64`                                       | 尺寸         | width                        | 制造一个“窄容器”以对比效果       |
| `rounded`                                    | 圆角         | border-radius                | 卡片常用视觉样式                 |
| `shadow`                                     | 阴影         | box-shadow                   | 卡片层次感                       |

------

理解重点：

1. Container Query 和 Responsive 的本质区别：

| 对比项   | 响应式断点（sm/md/lg） | 容器查询（Container Query） |
| -------- | ---------------------- | --------------------------- |
| 依据     | 浏览器窗口宽度         | 父容器自身宽度              |
| 粒度     | 页面级                 | 组件级                      |
| 适合     | 页面布局               | 组件适配                    |
| 可复用性 | 较弱                   | 极强                        |

1. 思维转变：

以前你写的是：

> “当屏幕变宽时，我的组件该怎么变？”

现在你写的是：

> “当我的组件所在的容器变宽时，我该怎么变？”

1. 企业项目中常见套路：

```html
<!-- 组件外层 -->
<div class="container-type-inline-size">
  <!-- 组件内部 -->
  <div class="@container (min-width: 500px):grid @container (min-width: 500px):grid-cols-2">
    ...
  </div>
</div>
```

1. Container Query 是“组件库级别”的刚需：

- 设计系统
- 可拖拽布局
- 低代码平台
- 微前端子应用

------

一句话总结：

> 响应式是“跟着屏幕走”，
> 容器查询是“跟着自己住的房子走”。
> 在 Tailwind 里，它让组件第一次真正实现了**自适应自身环境**。

## 状态派生机制

### group 机制

这个示例演示 TailwindCSS 中最重要的**状态派生机制之一：`group`**。
它解决的问题是：

> **当父元素状态变化时，子元素如何跟着一起变化？**

比如：

- 卡片 hover 时，里面的文字变色
- 列表项 hover 时，按钮才显示
- 容器 focus 时，内部边框高亮

```vue
<script setup lang="ts">
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <!-- 父容器：声明为 group -->
    <div
      class="
        group
        w-64 p-6 bg-white rounded-lg shadow
        hover:bg-blue-500 transition
      "
    >
      <!-- 标题 -->
      <h3
        class="
          text-lg font-bold text-gray-800
          group-hover:text-white
          transition
        "
      >
        卡片标题
      </h3>

      <!-- 描述文字 -->
      <p
        class="
          mt-2 text-sm text-gray-500
          group-hover:text-blue-100
          transition
        "
      >
        当鼠标悬停在整张卡片上时，子元素会自动跟随变化。
      </p>

      <!-- 按钮 -->
      <button
        class="
          mt-4 px-3 py-1 rounded
          bg-blue-500 text-white
          opacity-0
          group-hover:opacity-100
          transition
        "
      >
        操作按钮
      </button>
    </div>
  </div>
</template>
```

------

参数说明：

| 类名                        | 所属元素 | 对应 CSS 概念             | 作用说明                    |
| --------------------------- | -------- | ------------------------- | --------------------------- |
| `group`                     | 父容器   | 状态分组标记              | 声明这是一个“状态源容器”    |
| `hover:bg-blue-500`         | 父容器   | :hover + background-color | 鼠标悬停时改变卡片背景      |
| `group-hover:text-white`    | 标题     | 父:hover → 子样式变化     | 当父容器 hover 时，标题变白 |
| `group-hover:text-blue-100` | 描述文字 | 父:hover → 子样式变化     | 文字颜色联动                |
| `group-hover:opacity-100`   | 按钮     | 父:hover → 子样式变化     | hover 才显示按钮            |
| `opacity-0`                 | 按钮     | opacity                   | 默认隐藏                    |
| `transition`                | 多处     | transition                | 平滑过渡动画                |
| `shadow`                    | 卡片     | box-shadow                | 卡片层次感                  |
| `rounded-lg`                | 卡片     | border-radius             | 圆角卡片                    |

------

理解重点：

1. `group` 本质是一个“状态广播器”：

```text
父元素状态变化  →  所有子元素可感知
```

子元素通过：

```text
group-hover:*
group-focus:*
group-active:*
```

来接收父元素状态。

1. 没有 `group` 时，你只能写：

```text
子元素只能响应“自己”的 hover
```

有了 `group` 后：

```text
子元素可以响应“父元素”的 hover
```

这是组件交互设计的分水岭。

1. 企业项目中最常见的几种组合：

| 场景                  | 常用写法                          |
| --------------------- | --------------------------------- |
| 卡片 hover 出现按钮   | `group + group-hover:opacity-100` |
| 列表项 hover 高亮文字 | `group + group-hover:text-*`      |
| 表单聚焦联动          | `group + group-focus-within:*`    |
| 菜单 hover 展开       | `group + group-hover:block`       |

1. 进阶写法（多个 group）：

```html
<div class="group">
  <div class="group-hover:bg-red-500">
    ...
  </div>
</div>
```

甚至可以命名 group（避免嵌套冲突）：

```html
<div class="group/card">
  <span class="group-hover/card:text-red-500"></span>
</div>
```

------

一句话总结：

> `group` 是 Tailwind 里“父子状态联动”的核心机制，
> 没有它，你只能做“单点交互”，
> 有了它，你才能做“整体交互组件”。

### peer 机制

如果说 `group` 是 **“父 → 子” 状态广播**，
那么 `peer` 就是 **“兄弟 → 兄弟” 状态派生**。

它解决的问题是：

> 一个元素状态变化时，另一个“同级元素”如何跟着变化？

典型场景：

- 输入框聚焦时，label 变色
- Checkbox 选中时，说明文字高亮
- 开关打开时，旁边状态文字变化
- 表单校验状态提示

```vue
<script setup lang="ts">
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <div class="bg-white p-6 rounded-lg shadow space-y-4 w-80">

      <!-- 输入框 + label 示例 -->
      <div>
        <input
          type="text"
          placeholder="请输入内容"
          class="
            peer
            w-full border border-gray-300 rounded px-3 py-2
            focus:outline-none focus:border-blue-500
          "
        />
        <p
          class="
            mt-1 text-sm text-gray-500
            peer-focus:text-blue-500
          "
        >
          当输入框获取焦点时，这段文字会变蓝
        </p>
      </div>

      <!-- checkbox 示例 -->
      <label class="flex items-center gap-2">
        <input type="checkbox" class="peer hidden" />
        <div
          class="
            w-4 h-4 border rounded
            peer-checked:bg-blue-500
            peer-checked:border-blue-500
          "
        ></div>
        <span
          class="
            text-gray-500
            peer-checked:text-blue-500
            peer-checked:font-bold
          "
        >
          勾选后文字高亮
        </span>
      </label>

    </div>
  </div>
</template>
```

------

参数说明：

| 类名                    | 所属元素   | 对应 CSS 概念 | 作用说明                 |
| ----------------------- | ---------- | ------------- | ------------------------ |
| `peer`                  | 状态源元素 | 状态标记      | 声明这是“状态源兄弟”     |
| `peer-focus:*`          | 兄弟元素   | :focus 派生   | 当 peer 聚焦时触发       |
| `peer-checked:*`        | 兄弟元素   | :checked 派生 | 当 peer 被选中时触发     |
| `peer-hover:*`          | 兄弟元素   | :hover 派生   | 当 peer hover 时触发     |
| `hidden`                | checkbox   | display: none | 隐藏原生控件，自定义样式 |
| `border`                | 自定义框   | border        | 模拟 checkbox 外观       |
| `focus:border-blue-500` | 输入框     | :focus        | 聚焦时高亮边框           |

------

理解重点：

1. peer 的工作模式：

```text
A 元素标记为 peer  
B 元素使用 peer-* 监听 A 的状态
```

结构示意：

```html
<input class="peer" />
<span class="peer-focus:text-blue-500"></span>
```

1. 与 group 的本质区别：

| 对比项       | group          | peer           |
| ------------ | -------------- | -------------- |
| 关系         | 父 → 子        | 兄弟 ↔ 兄弟    |
| 状态源       | 父元素         | 兄弟元素       |
| 常用场景     | 卡片整体 hover | 表单控件联动   |
| DOM 结构要求 | 子在父内       | 必须是同一父级 |

1. 企业级高频用法：

| 场景            | 推荐写法                    |
| --------------- | --------------------------- |
| 表单 label 高亮 | `peer + peer-focus:*`       |
| 错误提示显示    | `peer + peer-invalid:block` |
| 密码强度提示    | `peer + peer-input:*`       |
| Checkbox 自定义 | `peer-checked:*`            |

1. 命名 peer（复杂表单必备）：

```html
<input class="peer/email" />
<span class="peer-focus/email:text-red-500"></span>
```

避免多个 peer 冲突，非常适合大表单。

------

一句话总结：

> `group` 管“父子联动”，
> `peer` 管“兄弟联动”，
> 两个机制一配合，Tailwind 就具备了完整的**状态派生系统**。

### data-* 属性驱动样式

`data-*` 机制让样式不再只依赖 hover / focus / checked，
而是直接根据 **业务状态字段** 来切换样式，非常适合和 JS / Vue 状态配合。

一句话理解：

> JS 改数据 → DOM 上 data-* 变 → Tailwind 样式自动切换

典型场景：

- 当前选中状态（tab、菜单、步骤条）
- 加载中 / 成功 / 失败
- 开关开启 / 关闭
- 组件运行状态（active、inactive、disabled）
- 动画阶段控制

```vue
<script setup lang="ts">
import { ref } from 'vue'

const status = ref<'idle' | 'loading' | 'success'>('idle')

const toggleStatus = () => {
  if (status.value === 'idle') status.value = 'loading'
  else if (status.value === 'loading') status.value = 'success'
  else status.value = 'idle'
}
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <div
      class="
        w-64 p-6 rounded-lg shadow text-center transition
        bg-gray-300
        data-[status=loading]:bg-yellow-400
        data-[status=success]:bg-green-500
        data-[status=success]:text-white
      "
      :data-status="status"
    >
      <div class="font-bold mb-2">当前状态：{{ status }}</div>
      <button
        class="px-4 py-2 rounded bg-black text-white"
        @click="toggleStatus"
      >
        切换状态
      </button>
    </div>
  </div>
</template>
```

------

参数说明：

| 类名                                  | 所属元素 | 对应 CSS 概念 | 作用说明                          |
| ------------------------------------- | -------- | ------------- | --------------------------------- |
| `data-[status=loading]:bg-yellow-400` | 状态卡片 | 属性选择器    | 当 `data-status="loading"` 时生效 |
| `data-[status=success]:bg-green-500`  | 状态卡片 | 属性选择器    | 成功状态背景变绿                  |
| `data-[status=success]:text-white`    | 状态卡片 | 属性选择器    | 成功状态文字变白                  |
| `:data-status="status"`               | DOM 属性 | data-* 绑定   | Vue 动态控制 data 属性            |
| `transition`                          | 卡片     | transition    | 状态切换平滑过渡                  |

------

理解重点：

1. data-* 本质是 Tailwind 对 CSS 这种写法的封装：

```css
[data-status="success"] {
  background-color: green;
}
```

在 Tailwind 中写成：

```text
data-[status=success]:bg-green-500
```

1. 和传统状态类对比：

| 方式       | 写法                   | 特点               |
| ---------- | ---------------------- | ------------------ |
| class 控制 | `class="active"`       | 易冲突、语义不清   |
| data 控制  | `data-status="active"` | 语义强、可维护性高 |

1. 组合多状态非常优雅：

```html
<div
  class="
    data-[state=open]:bg-blue-500
    data-[state=closed]:bg-gray-300
    data-[level=warning]:border-red-500
  "
  data-state="open"
  data-level="warning"
></div>
```

1. 在组件库中极其常见：

- Radix UI
- Headless UI
- Shadcn UI

它们几乎全部用：

```text
data-state
data-active
data-disabled
data-open
```

来驱动样式。

1. 和 group / peer 的关系：

| 机制   | 驱动来源     |
| ------ | ------------ |
| group  | 父元素状态   |
| peer   | 兄弟元素状态 |
| data-* | 业务数据状态 |

------

一句话总结：

> `data-*` 是 Tailwind 和“业务状态”之间的桥梁，
> 它让样式第一次真正脱离“交互事件”，
> 直接由 **数据本身** 决定。

### aria-* 属性驱动样式

`aria-*` 是为**无障碍访问（Accessibility, a11y）**服务的标准属性，
Tailwind 可以直接根据这些属性派生样式，让你的 UI：

- 样式与语义同步
- 天然支持无障碍
- 非常适合组件库、按钮、开关、折叠面板、Tab 等组件

一句话理解：

> 组件对外说“我是什么状态”(aria)，
> Tailwind 负责把“这个状态长什么样”渲染出来。

```vue
<script setup lang="ts">
import { ref } from 'vue'

const expanded = ref(false)

const toggle = () => {
  expanded.value = !expanded.value
}
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <div class="w-72 bg-white p-6 rounded-lg shadow space-y-4">

      <!-- 按钮：状态源 -->
      <button
        class="
          w-full px-4 py-2 rounded transition
          bg-gray-300 text-gray-800
          aria-expanded:bg-blue-500
          aria-expanded:text-white
        "
        :aria-expanded="expanded"
        @click="toggle"
      >
        {{ expanded ? '收起内容' : '展开内容' }}
      </button>

      <!-- 内容区域 -->
      <div
        class="
          p-4 rounded bg-gray-100 transition
          aria-hidden:opacity-0
          aria-hidden:h-0
          overflow-hidden
        "
        :aria-hidden="!expanded"
      >
        这是被 aria-* 状态控制显示效果的内容区域。
      </div>

    </div>
  </div>
</template>
```

------

参数说明：

| 类名                        | 所属元素 | 对应 CSS 概念            | 作用说明             |
| --------------------------- | -------- | ------------------------ | -------------------- |
| `aria-expanded:bg-blue-500` | 按钮     | `[aria-expanded="true"]` | 当按钮展开时背景变蓝 |
| `aria-expanded:text-white`  | 按钮     | `[aria-expanded="true"]` | 展开状态下文字变白   |
| `:aria-expanded="expanded"` | 按钮     | ARIA 状态绑定            | Vue 状态 → aria 属性 |
| `aria-hidden:opacity-0`     | 内容区   | `[aria-hidden="true"]`   | 隐藏状态下透明       |
| `aria-hidden:h-0`           | 内容区   | 高度控制                 | 隐藏内容高度为 0     |
| `overflow-hidden`           | 内容区   | overflow                 | 防止内容溢出         |

------

理解重点：

1. aria-* 的本质是语义优先：

```text
aria 描述“是什么状态”
Tailwind 描述“这个状态长什么样”
```

例如：

```html
<button aria-expanded="true"></button>
```

Tailwind：

```text
aria-expanded:bg-blue-500
```

1. 常见 aria 变体对照表：

| aria 属性       | 典型组件            | Tailwind 写法              |
| --------------- | ------------------- | -------------------------- |
| `aria-expanded` | 折叠面板 / 下拉菜单 | `aria-expanded:*`          |
| `aria-checked`  | 开关 / 复选框       | `aria-checked:*`           |
| `aria-selected` | Tabs / 菜单项       | `aria-selected:*`          |
| `aria-disabled` | 禁用按钮            | `aria-disabled:opacity-50` |
| `aria-hidden`   | 隐藏区域            | `aria-hidden:hidden`       |

1. 和 data-* 的区别：

| 对比项                 | data-*   | aria-*         |
| ---------------------- | -------- | -------------- |
| 目的                   | 业务状态 | 无障碍语义状态 |
| 是否影响读屏           | 否       | 是             |
| 是否推荐在组件库中使用 | 推荐     | 强烈推荐       |
| 语义强度               | 中       | 非常强         |

1. 在现代组件库中的地位：

Radix UI、Shadcn UI、Headless UI 的样式结构基本是：

```text
aria-* + data-* + Tailwind
```

aria 负责“语义和无障碍”，
data 负责“业务状态”，
Tailwind 负责“外观”。

------

一句话总结：

> `data-*` 让样式“听业务的”，
> `aria-*` 让样式“听语义的”，
> 两者一起用，你的组件才是真正**专业级、可访问级、可维护级**。



