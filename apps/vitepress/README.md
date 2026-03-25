# VitePress

**VitePress** 是由 Vue.js 团队打造的一款**静态站点生成器（SSG）**，基于 Vite 和 Vue 3。

👉 核心定位：**写文档 / 博客 / 技术站点（极致轻量 + 超快）**

- 官网地址：[链接](https://vitejs.cn/vitepress/)



## 基础配置

**初始化项目**

```
pnpm dlx create-vite@7.1.3 my-docs --template vue-ts
cd my-docs
```

**安装 vitepress**

```
pnpm add -D vitepress@1.6.4
```

**初始化 docs**

```
pnpm vitepress init
```

交互日志

```
┌  Welcome to VitePress!
│
◇  Where should VitePress initialize the config?
│  ./docs
│
◇  Site title:
│  阿腾网站
│
◇  Site description:
│  阿腾网站描述
│
◇  Theme:
│  Default Theme
│
◇  Use TypeScript for config and theme files?
│  Yes
│
◇  Add VitePress npm scripts to package.json?
│  Yes
│
└  Done! Now run pnpm run docs:dev and start writing.
```

会自动生成：

```
.
├─ docs
│  ├─ .vitepress
│  │  └─ config.js
│  ├─ api-examples.md
│  ├─ markdown-examples.md
│  └─ index.md
└─ package.json
```

**启动项目**

```
pnpm run docs:dev
```

![image-20260325162753669](./assets/image-20260325162753669.png)