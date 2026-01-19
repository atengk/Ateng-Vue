# UnoCSS

UnoCSS是即时原子CSS引擎，设计为灵活和可扩展。核心是不固执己见的，所有CSS实用程序都是通过预设提供的。

- [官网地址](xxx/)



## 基础配置

**安装依赖**

```
pnpm add unocss@66.6.0
```

**在 Vite 中接入 UnoCSS**

`vite.config.ts`

```ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import UnoCSS from 'unocss/vite';

export default defineConfig({
    plugins: [
        vue(),
        UnoCSS(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        }
    }
});
```

**创建 UnoCSS 配置文件**

根目录新建：`uno.config.ts`

```ts
import { defineConfig, presetUno, presetAttributify, presetIcons } from 'unocss';

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons(),
  ],
});
```

这三个 preset 是最常用组合：

| preset            | 作用                          |
| ----------------- | ----------------------------- |
| presetUno         | Tailwind 风格原子类           |
| presetAttributify | 属性写法，如 `text="red-500"` |
| presetIcons       | 图标支持                      |

**引入 UnoCSS 样式入口**

在 main.ts 中引入：

```ts
import { createApp } from 'vue';
import App from './App.vue';

import 'uno.css';

createApp(App).mount('#app');
```



## 最简示例

```vue
<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold text-blue-600 mb-4">
      UnoCSS with Vue3 + TypeScript
    </h1>

    <div class="flex gap-4">
      <div class="w-32 h-32 bg-red-400 rounded-lg"></div>
      <div class="w-32 h-32 bg-green-400 rounded-lg"></div>
      <div class="w-32 h-32 bg-blue-400 rounded-lg"></div>
    </div>
  </div>
</template>
```

![image-20260119154011247](./assets/image-20260119154011247.png)

## 一、基础原子能力

### 布局与盒模型

- `flex`、`grid`、`inline-flex`
- `flex-row`、`flex-col`
- `items-center`、`justify-between`
- `block`、`inline-block`、`hidden`

### 间距

- `p-*`、`px-*`、`py-*`
- `m-*`、`mx-*`、`my-*`
- `gap-*`

### 尺寸

- `w-*`、`h-*`
- `min-w-*`、`max-w-*`
- `min-h-*`、`max-h-*`

### 字体

- `text-*`
- `font-bold`、`font-medium`
- `leading-*`、`tracking-*`

### 颜色

- `text-red-500`
- `bg-blue-600`
- `border-gray-300`

### 边框与阴影

- `border`、`border-*`
- `rounded-*`
- `shadow-*`

------

## 二、交互状态控制

### Hover

- `hover:bg-*`
- `hover:text-*`
- `hover:shadow-*`

### Focus

- `focus:outline-none`
- `focus:ring-*`

### Active

- `active:scale-*`
- `active:opacity-*`

### Disabled

- `disabled:opacity-*`
- `disabled:cursor-not-allowed`

### 过渡动画

- `transition`
- `duration-*`
- `ease-in-out`

------

## 三、响应式系统

### 断点前缀

- `sm:*`
- `md:*`
- `lg:*`
- `xl:*`

### 常见场景

- 移动端列布局 / PC 端行布局
- 小屏隐藏 / 大屏显示
- 不同屏幕字号适配

------

## 四、Attributify 属性化模式

### 基础写法

- `p="4"`
- `m="2"`
- `text="red-500 xl"`
- `bg="gray-100"`

### 布局属性化

- `flex="~ col"`
- `grid="~ cols-3 gap-4"`

### 组合使用

- 模板更干净
- 适合复杂表单与后台页面

------

## 五、图标系统（preset-icons）

### Iconify 图标

- `i-mdi-home`
- `i-mdi-account`
- `i-carbon-search`

### 图标控制能力

- 颜色控制
- 大小控制
- 旋转与动画
- 与文字自然对齐

------

## 六、Shortcuts（语义化类名）

### 基础概念

- 把多个原子类合成一个业务类名

### 常见业务类

- `btn-primary`
- `btn-secondary`
- `card`
- `page-container`
- `form-item`

### 使用价值

- 统一样式规范
- 降低模板复杂度
- 强化项目结构感

------

## 七、Rules（自定义原子规则）

### 使用场景

- 设计稿有非标准尺寸
- 业务需要语义化原子类
- 特殊布局需求

### 常见语义

- `safe-top`
- `nav-height`
- `content-full`
- `header-offset-*`

------

## 八、主题系统（Design Token）

### 颜色体系

- 主色
- 成功色
- 警告色
- 错误色

### 尺寸体系

- 间距规范
- 圆角规范
- 字号规范

### 字体体系

- 主字体
- 标题字体
- 等宽字体

------

## 九、暗黑模式

### 模式前缀

- `dark:*`

### 常见用法

- `dark:bg-black`
- `dark:text-white`
- `dark:border-gray-700`

### 切换策略

- 跟随系统
- 手动切换
- 持久化存储

------

## 十、动画系统

### 内置动画

- `animate-spin`
- `animate-pulse`
- `animate-bounce`

### 过渡动画

- 弹窗出现消失
- 折叠展开
- 悬浮反馈

------

## 十一、与组件库混用策略

### 角色分工

- UnoCSS：布局 + 间距 + 结构
- 组件库：交互 + 复杂 UI

### 常见组合点

- 页面容器
- 弹窗 padding
- 表单项间距
- 表格外层布局

------

## 十二、工程级能力

### 构建特性

- 按需生成 CSS
- 零冗余样式
- 构建速度快

### 开发体验

- Vite 极速热更新
- 类名即样式
- 无需维护巨大 CSS 文件