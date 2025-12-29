# Vite

### Vite 是什么 & 在项目中负责什么

- 开发阶段的角色（Dev Server）
- 构建阶段的角色（Build Tool）
- 与 webpack 的核心差异（只需认知层面）

------

## 项目基础配置（vite.config.ts）

### 基础配置结构

- `defineConfig`
- 环境区分（dev / build）
- TypeScript 配置支持

### 项目根路径与构建输出

- `root`
- `base`
- `build.outDir`
- `build.assetsDir`

------

## 开发服务器配置（server）

### 本地开发服务

- `server.port`
- `server.host`
- `server.open`
- `server.strictPort`

### 代理配置（高频）

- `server.proxy`
  - 基础代理
  - 多环境代理
  - rewrite 使用

------

## 路径别名（resolve）

### 别名配置

- `resolve.alias`
- `@` 指向 `src`
- 多别名拆分（@assets / @views / @components）

### 与 tsconfig.json 同步

- `paths` 对齐问题
- 为什么必须保持一致

------

## 环境变量（env）

### 环境文件

- `.env`
- `.env.development`
- `.env.production`

### 环境变量规则

- `import.meta.env`
- `VITE_` 前缀限制
- 常用变量示例（API_BASE_URL 等）

------

## package.json scripts

### Vite 内置命令

### 多环境与 mode

### scripts 与 env 关系

### scripts 常用参数

### scripts 与包管理器

### 跨平台与工程化约束



## 插件体系（plugins）

### Vue 插件

- `@vitejs/plugin-vue`
- `<script setup>` 支持

### 常见实用插件（认知级）

- 自动导入（Auto Import）
- 组件自动注册
- SVG 图标处理
- Mock 数据插件

------

## CSS 相关配置

### CSS 预处理器

- SCSS / Less
- `css.preprocessorOptions`

### 全局样式注入（高频）

- 全局变量
- 主题变量
- mixins

### CSS Modules（了解）

- 使用场景
- 与 scoped 的区别

------

## 静态资源处理（assets）

### 静态资源引入方式

- `src/assets`
- `public` 目录

### URL 处理规则

- 图片、字体
- base64 内联阈值

------

## 构建配置（build）

### 构建基础参数

- `target`
- `sourcemap`
- `minify`

### 构建优化认知

- chunk 拆分
- vendor 拆包
- 构建体积分析（认知即可）

------

## 依赖优化（optimizeDeps）

### 依赖预构建

- 什么是预构建
- 常见使用场景

### exclude / include

- 解决依赖报错
- 兼容老库

------

## 模块热更新（HMR）

### HMR 基础认知

- 默认行为
- Vue SFC 的 HMR 特点

### HMR 异常排查思路（了解）

------

## 多环境与模式（mode）

### mode 的概念

- `development`
- `production`
- 自定义 mode

### mode 与 env 的关系

------

## Vite 与项目工程化协作

### 与 ESLint / Prettier

- Vite 本身不负责什么
- 插件配合方式

### 与 Vue Router / Pinia

- Vite 不侵入业务结构
- 只负责构建与运行

------

## 常见问题与认知误区（总结性）

### 新手常见坑

- base 配置导致资源 404
- 代理不生效
- env 变量 undefined

### 企业项目中 Vite 的边界

- 不写业务逻辑
- 不替代框架能力

------

