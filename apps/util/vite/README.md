# Vite

## Vite 概述

Vite 是面向现代前端项目的开发服务器与构建工具，适用于 Vue 3、React、Svelte 等现代框架项目。在 TypeScript + Vue 3 项目中，Vite 通常承担本地开发启动、模块加载、热更新、环境变量处理、静态资源处理、生产构建等职责。官方文档说明，Vite 在开发阶段基于浏览器原生 ESM 按需加载源码模块，并通过依赖预构建提升冷启动和页面加载速度。([vitejs](https://vite.dev/guide/why.html))

### Vite 的定位

Vite 的核心定位不是单纯替代某一个打包器，而是为现代 Web 应用提供一套更快、更轻量、更贴近原生浏览器能力的前端工程工具链。它在开发阶段更像一个增强型开发服务器，按浏览器请求实时转换源码；在生产阶段则负责生成可部署的优化产物。官方文档将 Vite 的设计目标描述为重新思考开发阶段代码服务方式，而不是只在传统打包流程上做增量优化。([vitejs](https://vite.dev/guide/why.html))

在 Vue 3 + TypeScript 项目中，Vite 通常位于前端工程的底层工具层，负责连接源码、框架插件、TypeScript 转译、CSS 处理、静态资源处理、环境变量、代理配置和生产构建。业务开发人员主要通过 `vite.config.ts`、`.env`、`tsconfig.json`、`src` 目录和 npm scripts 与 Vite 交互。

Vite 的定位可以概括为三点：

| 定位             | 说明                                                         |
| ---------------- | ------------------------------------------------------------ |
| 开发服务器       | 本地开发时提供快速启动、模块按需加载、热模块替换、代理转发等能力 |
| 构建工具         | 生产构建时对代码、样式、静态资源进行打包、压缩、分包和产物输出 |
| 前端工程基础设施 | 通过插件体系连接 Vue、TypeScript、CSS 预处理器、环境变量、静态资源和部署流程 |

对于 TypeScript Vue3 项目，Vite 并不负责完整的类型检查。官方文档说明，Vite 对 `.ts` 文件主要执行转译，不在转换流程中执行类型检查；类型检查通常交给 IDE、`vue-tsc` 或单独的 `tsc --noEmit` 流程处理。([vitejs](https://cn.vite.dev/guide/features.html))

### Vite 的核心特性

Vite 的核心特性主要围绕“开发快、配置轻、生态兼容、生产构建可控”展开。它利用现代浏览器原生 ESM 能力，在开发阶段避免每次启动都预先打包整个应用，从而提升大型项目的启动速度和热更新体验。官方文档说明，Vite 会将较少变化的依赖进行预构建，而将频繁变化的源码模块通过原生 ESM 按需提供给浏览器。([vitejs](https://vite.dev/guide/why.html))

| 特性                | 说明                                                         |
| ------------------- | ------------------------------------------------------------ |
| 快速冷启动          | 开发服务器启动时不需要先完整打包整个项目，而是按需转换源码模块 |
| 原生 ESM 开发模式   | 浏览器按模块请求源码，Vite 根据请求实时转换并返回可执行代码  |
| 热模块替换 HMR      | 修改 Vue 组件、样式或模块后，尽量只更新变更模块，减少整页刷新 |
| 依赖预构建          | 对第三方依赖进行预构建，并将 CommonJS / UMD 转换为 ESM，提高加载效率 |
| TypeScript 开箱即用 | 支持直接导入 `.ts` 文件，但默认只做转译，不做完整类型检查    |
| Vue 3 插件支持      | 通过官方 Vue 插件支持 Vue SFC、模板编译、组件热更新等能力    |
| CSS 与静态资源处理  | 支持 CSS 导入、CSS Modules、PostCSS、Sass/Less、图片和字体资源处理 |
| 环境变量与模式      | 支持 `.env`、`.env.development`、`.env.production` 等多环境配置 |
| 插件机制            | 基于插件扩展能力，可接入 Vue、压缩、自动导入、组件按需加载、Mock、产物分析等工具 |
| 生产构建优化        | 生产环境输出经过打包、压缩、分包和资源处理后的静态产物       |

在 Vue 3 项目中，Vite 的 HMR 体验通常比较明显。官方文档说明，Vite 提供基于原生 ESM 的 HMR API，并且内置了面向 Vue 单文件组件的 HMR 集成；通过 `create-vite` 创建项目时，所选模板通常已经预配置好相关能力。([vitejs](https://cn.vite.dev/guide/features.html))

对于 TypeScript 项目，Vite 的关键点是“快速转译”和“类型检查分离”。这意味着开发服务器可以保持较快响应，而严格类型检查可以放到 IDE、`vue-tsc --noEmit`、CI 流水线或构建前置脚本中执行。官方文档也建议将类型检查、ESLint 等静态分析与 Vite 的转换管道分离，以避免影响速度优势。([vitejs](https://cn.vite.dev/guide/features.html))

### Vite 与传统构建工具的区别

Vite 与传统构建工具的主要区别在于开发阶段的处理方式。传统构建工具通常采用 bundle-based dev server 模式，即启动开发服务器前需要先分析入口、构建依赖图并打包应用；项目越大，冷启动和重新构建成本越高。Vite 则在开发阶段采用基于原生 ESM 的按需服务模式，浏览器请求哪个模块，Vite 再转换并返回对应模块。([vitejs](https://vite.dev/guide/why.html))

| 对比项       | 传统构建工具                     | Vite                                                         |
| ------------ | -------------------------------- | ------------------------------------------------------------ |
| 开发启动方式 | 启动前通常需要先打包应用         | 启动时不完整打包源码，按需提供模块                           |
| 模块加载方式 | 开发阶段多依赖打包后的 bundle    | 开发阶段利用浏览器原生 ESM 加载模块                          |
| 热更新方式   | 变更后可能触发较大的重新构建范围 | 基于模块边界进行更精确的 HMR 更新                            |
| 大型项目体验 | 项目变大后启动和更新可能明显变慢 | 源码按需转换，启动速度与项目规模关联较小                     |
| 依赖处理     | 通常与业务源码一起进入打包流程   | 依赖单独预构建，源码按需加载                                 |
| 生产构建     | 生成生产 bundle                  | 同样会生成生产 bundle，因为生产环境仍需要优化网络请求和资源体积 |

需要注意的是，Vite 并不是完全不打包。它只是在开发阶段尽量避免对整个源码进行预打包，从而提升开发反馈速度；生产环境仍然需要打包，因为线上直接使用大量未打包的 ESM 模块会带来过多网络请求和性能问题。官方文档也明确说明，未打包的 ESM 适合开发阶段，但生产发布仍然需要构建优化。([vitejs](https://vite.dev/guide/why.html))

在实际 TypeScript Vue3 项目中，可以将这种区别理解为：开发阶段，Vite 更关注“让代码尽快跑起来、改动尽快反馈”；构建阶段，Vite 更关注“生成适合部署的静态资源”。因此，Vite 既提升了日常开发体验，也保留了生产构建所需的优化能力。

## 项目初始化

项目初始化用于创建一个基础可运行的 Vite + Vue 3 + TypeScript 项目。Vite 官方推荐通过 `create-vite` 脚手架快速生成项目模板，生成后再根据团队规范补充路由、状态管理、请求封装、UI 组件库、代码规范和环境配置。你上传的目录中，这一部分位于 `Vite 概述` 之后，主要用于说明项目从创建到启动的基础流程。 当前 Vite 文档中的脚手架命令支持 npm、yarn、pnpm、Bun、Deno 等方式，并且可以通过 `--template` 直接指定模板。([vitejs](https://vite.dev/guide/))

### 使用 create-vite 创建项目

`create-vite` 是 Vite 官方提供的项目初始化工具，用于根据指定框架模板快速生成基础项目结构。对于企业前端项目，通常建议在初始化阶段就明确项目名称、包管理器、框架类型和是否使用 TypeScript，避免后续再手动迁移模板。

使用 npm 创建项目：

```bash
# 创建 Vite 项目，命令执行后根据提示选择框架和语言
npm create vite@latest
```

使用 pnpm 创建项目：

```bash
# 使用 pnpm 创建 Vite 项目
pnpm create vite
```

也可以在命令中直接指定项目名称和模板，减少交互式选择步骤：

```bash
# npm 方式创建 Vue 3 + TypeScript 项目
npm create vite@latest vite-vue3-ts-demo -- --template vue-ts

# pnpm 方式创建 Vue 3 + TypeScript 项目
pnpm create vite vite-vue3-ts-demo --template vue-ts
```

其中 `vite-vue3-ts-demo` 是项目目录名称，`vue-ts` 表示使用 Vue 3 + TypeScript 模板。官方文档列出的模板包含 `vue`、`vue-ts`、`react`、`react-ts`、`vanilla`、`vanilla-ts` 等常见预设。([vitejs](https://vite.dev/guide/))

创建完成后进入项目目录并安装依赖：

```bash
# 进入项目目录
cd vite-vue3-ts-demo

# 安装项目依赖
pnpm install
```

如果团队统一使用 npm，也可以执行：

```bash
# 进入项目目录
cd vite-vue3-ts-demo

# 安装项目依赖
npm install
```

需要注意的是，Vite 对 Node.js 版本有要求。当前官方文档说明，Vite 需要 Node.js `20.19+` 或 `22.12+`，部分模板还可能要求更高版本。实际项目中应在 `README.md`、`.nvmrc` 或 `package.json` 的 `engines` 字段中固定团队使用的 Node.js 版本。([vitejs](https://vite.dev/guide/))

### 选择 TypeScript Vue3 模板

在初始化 Vite 项目时，选择 Vue 和 TypeScript 模板后，项目会默认包含 Vue 单文件组件、TypeScript 配置、Vite 配置和基础启动脚本。对于中后台管理系统、数据看板、组件库、业务前台等项目，建议优先使用 `vue-ts` 模板，而不是先创建普通 Vue 模板再手动引入 TypeScript。

交互式创建时通常选择以下内容：

```text
Project name: vite-vue3-ts-demo
Select a framework: Vue
Select a variant: TypeScript
```

非交互式创建时直接使用模板参数：

```bash
# 直接使用 Vue 3 + TypeScript 模板创建项目
pnpm create vite vite-vue3-ts-demo --template vue-ts
```

生成后的基础项目通常包含以下能力：

| 能力            | 说明                                     |
| --------------- | ---------------------------------------- |
| Vue 3           | 使用 Vue 3 作为前端框架                  |
| TypeScript      | 支持 `.ts` 和 `<script setup lang="ts">` |
| Vite Dev Server | 提供本地开发服务器和热更新               |
| Vue SFC         | 支持 `.vue` 单文件组件                   |
| 基础构建脚本    | 提供开发、构建、预览等命令               |

需要区分的是，Vite 对 TypeScript 默认主要执行转译，不负责完整类型检查。也就是说，开发服务器可以直接处理 `.ts` 文件，但严格类型校验通常需要配合 `vue-tsc` 或 IDE 完成。Vite 官方文档也说明，客户端类型通常通过 `vite/client` 提供，用于支持静态资源导入、`import.meta.env`、HMR 等类型声明。([vitejs](https://vite.dev/guide/features.html))

在 Vue 3 项目中，推荐保留或补充 `env.d.ts` 文件：

```typescript
/// <reference types="vite/client" />
```

该声明文件用于让 TypeScript 识别 Vite 注入的客户端类型，例如 `import.meta.env`、静态资源导入、HMR API 等。后续如果项目中扩展自定义环境变量类型，也可以在该文件中补充声明。

### 项目启动与基础命令

Vite 项目创建完成后，常用命令通常维护在 `package.json` 的 `scripts` 中。官方脚手架生成的基础命令通常包括 `dev`、`build` 和 `preview`，分别用于启动开发服务器、构建生产产物和本地预览生产构建结果。([vitejs](https://vite.dev/guide/))

`package.json` 中的基础脚本通常如下：

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc -b && vite build",
    "preview": "vite preview"
  }
}
```

其中 `dev` 用于本地开发，`build` 用于生产构建，`preview` 用于预览构建后的产物。对于 TypeScript Vue3 项目，建议在构建命令中加入 `vue-tsc`，这样可以在打包前执行类型检查，避免类型错误进入生产构建流程。

启动本地开发服务器：

```bash
# 启动开发服务器
pnpm dev
```

默认情况下，Vite 开发服务器通常会在本地端口启动。官方文档示例中，手动运行 Vite 时 `index.html` 会被服务在 `http://localhost:5173`。实际端口可能会因为配置或端口占用发生变化。 ([vitejs](https://vite.dev/guide/))

执行生产构建：

```bash
# 执行类型检查并生成生产构建产物
pnpm build
```

本地预览生产构建结果：

```bash
# 预览 dist 目录中的构建产物
pnpm preview
```

开发阶段也可以通过命令行参数临时指定端口或自动打开浏览器：

```bash
# 指定端口启动
pnpm dev -- --port 3000

# 启动后自动打开浏览器
pnpm dev -- --open
```

这里的 `--` 用于将后续参数传递给 Vite CLI。项目中更推荐将稳定配置写入 `vite.config.ts`，将临时调试参数放到命令行中使用。

## Vite 项目结构

项目结构用于说明 Vite 项目中各目录和文件的职责。理解项目结构后，才能明确页面组件、入口文件、静态资源、环境变量、构建配置和公共资源应该放在哪里。Vite 项目与一些传统构建工具项目不同，`index.html` 位于项目根目录，并且会被 Vite 当作应用入口和模块图的一部分处理。([vitejs](https://vite.dev/guide/))

### 根目录文件说明

使用 `vue-ts` 模板创建项目后，基础目录结构通常如下：

```text
vite-vue3-ts-demo
├── public
│   └── vite.svg
├── src
│   ├── assets
│   │   └── vue.svg
│   ├── components
│   │   └── HelloWorld.vue
│   ├── App.vue
│   ├── main.ts
│   └── style.css
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
└── env.d.ts
```

常见根目录文件说明如下：

| 文件或目录           | 作用                                                  |
| -------------------- | ----------------------------------------------------- |
| `index.html`         | 应用 HTML 入口，Vite 会从这里解析入口脚本             |
| `package.json`       | 项目依赖、脚本命令、包管理信息                        |
| `vite.config.ts`     | Vite 主配置文件                                       |
| `tsconfig.json`      | TypeScript 基础配置入口                               |
| `tsconfig.app.json`  | 应用源码相关 TypeScript 配置                          |
| `tsconfig.node.json` | Node 环境相关 TypeScript 配置，通常用于 Vite 配置文件 |
| `env.d.ts`           | Vite 客户端类型声明                                   |
| `public`             | 不经过构建转换、原样复制的公共静态资源目录            |
| `src`                | 业务源码目录，包含入口文件、组件、页面、样式、资源等  |

实际企业项目通常会在 `src` 下继续扩展以下目录：

```text
src
├── api
├── assets
├── components
├── config
├── directives
├── hooks
├── layouts
├── router
├── stores
├── styles
├── types
├── utils
├── views
├── App.vue
└── main.ts
```

这些目录不是 Vite 强制要求的，而是业务工程实践中的常见组织方式。Vite 只关心模块是否能被入口文件正确引用，以及对应资源是否能被插件、解析器和构建流程正确处理。

### public 目录使用

`public` 目录用于存放不需要被源码导入、不需要文件名哈希、需要保持原始文件名或希望通过根路径直接访问的静态资源。Vite 官方文档说明，`public` 下的资源在开发阶段会通过根路径 `/` 提供访问，构建时会原样复制到输出目录根部。([vitejs](https://vite.dev/guide/assets.html))

适合放入 `public` 的资源包括：

| 资源                 | 示例                            | 说明                   |
| -------------------- | ------------------------------- | ---------------------- |
| 网站图标             | `public/favicon.ico`            | 需要固定文件名         |
| robots 文件          | `public/robots.txt`             | 搜索引擎爬取规则       |
| 第三方验证文件       | `public/verify.txt`             | 平台验证时要求固定路径 |
| 不参与打包的静态文件 | `public/download/template.xlsx` | 希望原样提供下载       |

访问 `public` 目录中的资源时，应使用根路径：

```html
<link rel="icon" href="/favicon.ico" />
```

如果文件位于：

```text
public/images/logo.png
```

访问路径应写为：

```html
<img src="/images/logo.png" alt="Logo" />
```

需要注意，不要写成 `/public/images/logo.png`。Vite 官方文档明确说明，`public/icon.png` 应该在源码中通过 `/icon.png` 访问。([vitejs](https://vite.dev/guide/assets.html))

一般情况下，业务图片、组件图片、字体、样式中引用的资源更推荐放在 `src/assets` 中并通过 `import` 或 CSS `url()` 引入。Vite 会将这些资源纳入构建图，生产构建时可以生成带哈希的文件名，并由构建流程统一处理。([vitejs](https://vite.dev/guide/assets.html))

### src 目录与入口文件

`src` 目录用于存放项目源码。对于 Vue 3 + TypeScript 项目，最重要的入口文件通常是 `src/main.ts`，它负责创建 Vue 应用实例、挂载根组件，并引入路由、状态管理、UI 组件库、全局样式等基础能力。

基础入口文件通常如下：

```typescript
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

// 创建 Vue 应用实例，并挂载到 index.html 中的 #app 节点
createApp(App).mount('#app')
```

如果项目引入 Vue Router、Pinia、Element Plus，可以逐步扩展入口文件：

```typescript
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import App from './App.vue'
import router from './router'
import { pinia } from './stores'
import './styles/index.scss'

// 创建应用实例
const app = createApp(App)

// 注册全局插件
app.use(router)
app.use(pinia)
app.use(ElementPlus)

// 挂载根组件
app.mount('#app')
```

`src/main.ts` 与 `index.html` 通过 `<script type="module">` 关联。也就是说，浏览器先加载根目录下的 `index.html`，再由 HTML 中的模块脚本加载 `src/main.ts`，最终完成 Vue 应用挂载。

### index.html 的作用

在 Vite 项目中，`index.html` 不是放在 `public` 目录中的普通静态文件，而是位于项目根目录的应用入口。官方文档说明，Vite 在开发阶段是一个服务器，`index.html` 是应用入口；同时，Vite 会将 `index.html` 视为源码和模块图的一部分，并解析其中引用的模块脚本。([vitejs](https://vite.dev/guide/))

典型的 `index.html` 如下：

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite Vue3 TypeScript</title>
  </head>
  <body>
    <div id="app"></div>

    <!-- Vite 会从这里加载 Vue 应用入口文件 -->
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

其中 `#app` 是 Vue 应用挂载节点，`/src/main.ts` 是应用入口文件。Vite 会处理 `<script type="module">` 引用的源码模块，也会处理 HTML 中符合规则的静态资源引用，例如图片、样式、模块脚本等。官方功能文档说明，HTML 文件中的 `<script type="module" src>`、`<link href>`、`<img src>` 等资源会作为应用的一部分被处理和构建。([vitejs](https://vite.dev/guide/features.html))

在单页应用中，一般只需要一个根目录 `index.html`。如果是多页应用，也可以使用多个 HTML 入口，例如：

```text
index.html
admin.html
mobile.html
```

Vite 支持多 HTML 入口，但普通 Vue 3 后台管理系统通常使用 Vue Router 实现前端路由，不需要创建多个 HTML 文件。

## Vite 配置文件

Vite 配置文件用于集中定义开发服务器、路径别名、插件、构建输出、代理、环境变量加载、依赖优化等工程能力。对于 TypeScript Vue3 项目，配置文件通常使用 `vite.config.ts`，并通过 `defineConfig` 获得更好的类型提示。官方文档说明，Vite 支持 TypeScript 配置文件，也可以通过 `defineConfig` 帮助 IDE 提供配置智能提示。([vitejs](https://vite.dev/config/))

### vite.config.ts 基础结构

`vite.config.ts` 位于项目根目录，是 Vite 项目的核心配置文件。基础 Vue 3 + TypeScript 项目通常至少需要配置 Vue 插件和路径别名。

文件位置：`vite.config.ts`

```typescript
import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// Vite 主配置文件
export default defineConfig({
  // 注册 Vite 插件
  plugins: [vue()],

  resolve: {
    alias: {
      // 配置 @ 指向 src 目录，便于业务代码中使用 @/xxx 导入模块
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  server: {
    // 本地开发端口
    port: 5173,

    // 启动后是否自动打开浏览器
    open: true,
  },
})
```

上面的配置完成了三个基础能力：启用 Vue 单文件组件支持、配置 `@` 路径别名、指定开发服务器端口。路径别名中的值建议使用绝对路径，Vite 官方配置文档也说明，配置文件系统路径别名时应使用绝对路径，避免相对路径不会被自动解析成文件系统路径的问题。([vitejs](https://vite.dev/config/shared-options.html))

配置别名后，业务代码中可以这样导入组件或工具函数：

```typescript
import UserList from '@/views/user/UserList.vue'
import { request } from '@/utils/request'
```

如果使用 TypeScript，还需要同步配置 `tsconfig.app.json`，否则 Vite 可以识别别名，但 TypeScript 或 IDE 可能无法正确识别。

文件位置：`tsconfig.app.json`

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

### defineConfig 使用

`defineConfig` 是 Vite 提供的配置辅助函数，它本身不会改变配置运行逻辑，主要作用是提供类型推导和 IDE 智能提示。使用 `defineConfig` 后，编辑器可以识别 `server`、`plugins`、`resolve`、`build` 等配置项，减少手写配置时的错误。官方文档也推荐使用 `defineConfig` 来获得更好的类型提示。([vitejs](https://vite.dev/config/))

基础写法如下：

```typescript
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 5173,
  },
})
```

当配置需要根据命令或环境模式动态变化时，可以导出一个函数。Vite 官方文档说明，配置函数可以根据 `command`、`mode`、`isSsrBuild`、`isPreview` 等信息返回不同配置，其中开发阶段的 `command` 是 `serve`，构建阶段的 `command` 是 `build`。([vitejs](https://vite.dev/config/))

文件位置：`vite.config.ts`

```typescript
import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import { defineConfig, loadEnv } from 'vite'

// 根据不同命令和模式动态返回 Vite 配置
export default defineConfig(({ command, mode }) => {
  // 手动加载 .env 文件，便于在 vite.config.ts 中读取环境变量
  const env = loadEnv(mode, process.cwd(), '')

  const isBuild = command === 'build'

  return {
    plugins: [vue()],

    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },

    server: {
      port: Number(env.VITE_PORT || 5173),
      open: !isBuild,
    },

    build: {
      // 构建生产包时生成 sourcemap，通常只建议测试环境或排查问题时开启
      sourcemap: mode !== 'production',
    },
  }
})
```

需要注意，`.env` 文件中的变量不会在 Vite 配置文件刚开始执行时自动注入到 `process.env`。如果配置文件本身需要使用 `.env` 中的值，例如端口、代理地址、是否启用插件等，应使用 `loadEnv` 手动加载。官方文档对此有明确说明。([vitejs](https://vite.dev/config/))

### 插件配置方式

Vite 插件用于扩展框架支持、构建处理、资源转换、开发服务器能力和生产构建能力。Vue 3 项目最常见的插件是 `@vitejs/plugin-vue`，用于支持 Vue 单文件组件。Vite 官方文档说明，插件需要安装到项目依赖中，并加入配置文件的 `plugins` 数组。([vitejs](https://vite.dev/guide/using-plugins.html))

基础插件配置如下：

```typescript
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    // 启用 Vue 3 单文件组件支持
    vue(),
  ],
})
```

当项目中插件较多时，可以按照功能进行分组。例如自动导入、组件按需引入、压缩、构建分析等插件都可以放入 `plugins` 数组。

示例配置如下：

```typescript
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production'

  return {
    plugins: [
      // Vue 单文件组件支持
      vue(),

      // 可以根据环境条件启用插件
      isProduction && {
        name: 'build-info-plugin',
        apply: 'build',
        closeBundle() {
          console.log('生产构建完成')
        },
      },
    ],
  }
})
```

Vite 的 `plugins` 数组会忽略 falsy 值，也支持插件数组展开。官方文档说明，插件默认会同时作用于开发和构建阶段，如果只希望插件在 `serve` 或 `build` 阶段生效，可以使用 `apply` 字段；如果需要控制插件顺序，可以使用 `enforce: 'pre'` 或 `enforce: 'post'`。([vitejs](https://vite.dev/guide/using-plugins.html))

常见插件配置思路如下：

| 插件类型     | 使用场景                     |
| ------------ | ---------------------------- |
| 框架插件     | 支持 Vue、React 等框架语法   |
| 自动导入插件 | 自动导入 Vue API、组件库 API |
| 组件按需插件 | 自动注册或按需引入组件       |
| 压缩插件     | 构建后压缩 gzip、brotli      |
| 分析插件     | 分析构建产物体积             |
| Mock 插件    | 本地开发模拟后端接口         |

插件越多，构建链路越复杂。建议只引入确实需要的插件，并明确插件作用阶段，避免开发阶段和构建阶段出现不可预期的差异。

### 配置文件拆分方式

当项目规模较小时，一个 `vite.config.ts` 就足够维护全部配置。随着项目增加代理、插件、构建优化、环境差异和多模式配置，单文件会逐渐变得臃肿。此时可以将插件配置、代理配置、构建配置、路径处理等拆分到独立文件中，再由 `vite.config.ts` 统一组合。

推荐拆分结构如下：

```text
vite-vue3-ts-demo
├── vite
│   ├── build.ts
│   ├── plugins.ts
│   └── proxy.ts
├── vite.config.ts
└── package.json
```

`plugins.ts` 用于维护插件配置。

文件位置：`vite/plugins.ts`

```typescript
import vue from '@vitejs/plugin-vue'
import type { PluginOption } from 'vite'

// 创建 Vite 插件列表
export function createVitePlugins(): PluginOption[] {
  return [
    // Vue 3 单文件组件支持
    vue(),
  ]
}
```

`proxy.ts` 用于维护开发环境接口代理配置。

文件位置：`vite/proxy.ts`

```typescript
import type { ProxyOptions } from 'vite'

// 创建开发服务器代理配置
export function createViteProxy(): Record<string, string | ProxyOptions> {
  return {
    '/api': {
      // 后端接口地址，实际项目建议从环境变量读取
      target: 'http://localhost:8080',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, ''),
    },
  }
}
```

`build.ts` 用于维护构建配置。

文件位置：`vite/build.ts`

```typescript
import type { BuildOptions } from 'vite'

// 创建生产构建配置
export function createViteBuild(): BuildOptions {
  return {
    // 构建输出目录
    outDir: 'dist',

    // 静态资源输出目录
    assetsDir: 'assets',

    // 生产环境一般关闭 sourcemap，避免暴露源码结构
    sourcemap: false,
  }
}
```

最后在 `vite.config.ts` 中统一组合配置。

文件位置：`vite.config.ts`

```typescript
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'

import { createViteBuild } from './vite/build'
import { createVitePlugins } from './vite/plugins'
import { createViteProxy } from './vite/proxy'

// Vite 主配置入口，组合插件、代理、构建和路径别名配置
export default defineConfig({
  plugins: createVitePlugins(),

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  server: {
    port: 5173,
    open: true,
    proxy: createViteProxy(),
  },

  build: createViteBuild(),
})
```

这种拆分方式适合中大型前端项目。`vite.config.ts` 保持为配置入口，具体配置按职责下沉到 `vite` 目录中，后续新增插件、代理规则和构建策略时不会造成主配置文件过度膨胀。

需要注意，配置文件拆分后，所有被 `vite.config.ts` 引入的文件都会参与配置加载流程。当前 Vite 文档说明，默认会对配置文件进行加载处理；如果在 monorepo 或复杂 TypeScript 配置场景下遇到配置加载问题，可以关注官方文档中的 `--configLoader` 相关说明。([vitejs](https://vite.dev/config/))

## 开发服务器

开发服务器用于支撑本地开发阶段的页面访问、源码转换、模块加载、接口代理和热更新。本文档这一部分延续你上传的 Vite 目录结构，重点说明 Vue3 + TypeScript 项目中开发服务器的常用配置。 Vite 的 `vite` 命令会在当前目录启动开发服务器，`vite dev` 和 `vite serve` 都是它的别名；开发服务器支持 `--host`、`--port`、`--open`、`--strictPort`、`--mode` 等常用参数。([vitejs](https://vite.dev/guide/cli.html))

### dev server 启动流程

`dev server` 是 Vite 在开发阶段的核心能力。执行 `pnpm dev` 或 `npm run dev` 后，包管理器会读取 `package.json` 中的 `scripts.dev`，再执行 `vite` 命令启动本地开发服务器。

文件位置：`package.json`

```json
{
  "scripts": {
    "dev": "vite",
    "dev:test": "vite --mode test",
    "dev:local": "vite --host 0.0.0.0 --port 5173 --open"
  }
}
```

开发服务器的基础启动链路可以理解为：

```text
pnpm dev
  ↓
读取 package.json scripts.dev
  ↓
执行 vite 命令
  ↓
加载 vite.config.ts
  ↓
根据 mode 加载 .env 文件
  ↓
启动 Vite Dev Server
  ↓
浏览器访问 index.html
  ↓
加载 /src/main.ts
  ↓
按需请求 Vue、TypeScript、CSS、静态资源等模块
  ↓
源码变更后触发 HMR 热更新
```

与生产构建不同，开发阶段不会先将整个应用完整打包成一个生产 bundle，而是根据浏览器请求按需转换源码模块。这样可以提升启动速度和修改反馈速度。开发服务器相关配置主要写在 `vite.config.ts` 的 `server` 节点中，Vite 官方文档也说明 `server` 配置项默认只作用于开发阶段。([vitejs](https://vite.dev/config/server-options.html))

下面是一个适合 Vue3 + TypeScript 项目的基础开发服务器配置。

文件位置：`vite.config.ts`

```typescript
import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// Vite 开发服务器基础配置
export default defineConfig({
  plugins: [vue()],

  resolve: {
    alias: {
      // 配置 @ 指向 src，便于业务代码中使用 @/xxx
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  server: {
    // 开发服务器监听地址
    host: 'localhost',

    // 开发服务器端口
    port: 5173,

    // 启动后自动打开浏览器
    open: true,

    // 端口被占用时是否直接退出
    strictPort: false,
  },
})
```

### host 与 port 配置

`host` 用于控制开发服务器监听的地址，`port` 用于控制开发服务器监听的端口。Vite 官方文档中，`server.host` 默认值为 `'localhost'`，设置为 `0.0.0.0` 或 `true` 时会监听所有地址，包括局域网地址；`server.port` 默认值为 `5173`。([vitejs](https://vite.dev/config/server-options.html))

常见配置如下：

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// 配置开发服务器访问地址和端口
export default defineConfig({
  plugins: [vue()],

  server: {
    // 仅允许本机访问
    host: 'localhost',

    // 固定开发端口
    port: 5173,
  },
})
```

如果需要让同一局域网内的其他设备访问，例如手机调试、平板调试、同事联调，可以将 `host` 设置为 `0.0.0.0` 或 `true`：

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// 允许局域网设备访问开发服务器
export default defineConfig({
  plugins: [vue()],

  server: {
    // 监听所有网络地址，便于局域网访问
    host: '0.0.0.0',

    // 固定访问端口
    port: 5173,
  },
})
```

也可以通过命令行临时指定：

```bash
# 允许局域网访问，并指定端口
pnpm dev -- --host 0.0.0.0 --port 5173
```

需要注意，监听 `0.0.0.0` 只是让 Vite 开发服务器绑定所有地址，实际访问时仍然需要使用当前机器的局域网 IP，例如：

```text
http://192.168.1.100:5173
```

如果项目运行在 WSL2、Docker、虚拟机或公司内网环境中，还需要额外确认网络转发、防火墙、端口映射等设置。Vite 官方文档也提示，在 WSL2 中仅设置 `host: true` 并不一定足以让局域网访问开发服务器。([vitejs](https://vite.dev/config/server-options.html))

### open 自动打开浏览器

`server.open` 用于控制开发服务器启动后是否自动打开浏览器。该配置可以是布尔值，也可以是一个路径字符串。Vite 官方文档说明，当 `open` 是字符串时，该字符串会作为打开地址的 pathname；也可以通过 `BROWSER`、`BROWSER_ARGS` 环境变量控制浏览器和启动参数。([vitejs](https://vite.dev/config/server-options.html))

启动后自动打开首页：

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// 启动开发服务器后自动打开浏览器首页
export default defineConfig({
  plugins: [vue()],

  server: {
    port: 5173,
    open: true,
  },
})
```

启动后自动打开指定路径：

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// 启动后自动打开指定业务页面
export default defineConfig({
  plugins: [vue()],

  server: {
    port: 5173,

    // 自动打开指定路由或 HTML 路径
    open: '/dashboard',
  },
})
```

命令行方式如下：

```bash
# 启动后自动打开浏览器
pnpm dev -- --open

# 启动后打开指定路径
pnpm dev -- --open /dashboard
```

在 Vue Router 的 history 模式下，`open: '/dashboard'` 通常表示浏览器打开 `http://localhost:5173/dashboard`。如果项目尚未配置前端路由兜底，或者部署环境未配置 history fallback，刷新该地址可能会出现 404。开发阶段由 Vite 处理，一般不会影响本地单页应用访问。

### strictPort 端口占用处理

`strictPort` 用于控制端口被占用时 Vite 的处理策略。Vite 官方文档说明，如果指定端口已经被占用，默认情况下 Vite 会自动尝试下一个可用端口；当 `server.strictPort` 设置为 `true` 时，端口被占用会直接退出，而不是自动切换端口。([vitejs](https://vite.dev/config/server-options.html))

默认行为示例：

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// 端口被占用时允许 Vite 自动寻找下一个可用端口
export default defineConfig({
  plugins: [vue()],

  server: {
    port: 5173,
    strictPort: false,
  },
})
```

如果 `5173` 被占用，Vite 可能会自动使用 `5174`、`5175` 等后续端口。这个行为对个人开发比较方便，但在接口回调、OAuth 登录、固定代理、移动端调试、自动化测试等场景中可能不稳定。

固定端口配置如下：

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// 端口被占用时直接退出，避免开发地址被静默切换
export default defineConfig({
  plugins: [vue()],

  server: {
    port: 5173,
    strictPort: true,
  },
})
```

命令行方式如下：

```bash
# 端口被占用时直接退出
pnpm dev -- --port 5173 --strictPort
```

企业项目中更推荐开启 `strictPort`，尤其是当前端地址需要被后端回调、第三方登录平台、网关白名单、移动端 WebView 或自动化脚本固定引用时。这样可以尽早发现端口冲突，而不是让项目悄悄切换到另一个端口。

## 模块解析

模块解析用于控制 Vite 如何根据 `import` 路径找到对应文件、依赖或静态资源。对于 Vue3 + TypeScript 项目，模块解析最常用的配置包括路径别名、文件扩展名、`import.meta` 和静态资源导入。

### 路径别名配置

路径别名用于简化模块导入路径，避免在业务代码中出现大量 `../../../`。Vite 通过 `resolve.alias` 配置别名，该配置会替换 `import` 或 `require` 语句中的匹配路径。官方文档说明，配置文件系统路径别名时应使用绝对路径，相对路径不会被自动解析成文件系统路径。([vitejs](https://vite.dev/config/shared-options.html))

文件位置：`vite.config.ts`

```typescript
import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// 配置路径别名
export default defineConfig({
  plugins: [vue()],

  resolve: {
    alias: {
      // @ 指向 src 目录
      '@': fileURLToPath(new URL('./src', import.meta.url)),

      // 可选：为常用目录配置更细粒度别名
      '@views': fileURLToPath(new URL('./src/views', import.meta.url)),
      '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
      '@utils': fileURLToPath(new URL('./src/utils', import.meta.url)),
    },
  },
})
```

业务代码中可以这样使用：

```typescript
import UserList from '@/views/user/UserList.vue'
import BaseTable from '@components/BaseTable.vue'
import { formatDateTime } from '@utils/date'
```

TypeScript 项目还需要同步配置 `tsconfig.app.json`，否则 Vite 能运行，但 IDE 或 TypeScript 类型检查可能无法识别别名。

文件位置：`tsconfig.app.json`

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@views/*": ["src/views/*"],
      "@components/*": ["src/components/*"],
      "@utils/*": ["src/utils/*"]
    }
  }
}
```

建议团队统一只使用少量稳定别名，例如 `@`、`@components`、`@utils`。别名过多会增加项目理解成本，也可能造成模块导入风格不一致。

### 文件扩展名解析

文件扩展名解析用于控制导入模块时，如果没有写文件扩展名，Vite 会按什么顺序尝试查找文件。Vite 官方文档说明，`resolve.extensions` 默认包含 `.mjs`、`.js`、`.mts`、`.ts`、`.jsx`、`.tsx`、`.json`；同时，官方不推荐对自定义导入类型省略扩展名，例如 `.vue`，因为这可能影响 IDE 和类型支持。([vitejs](https://vite.dev/config/shared-options.html))

默认情况下，可以这样导入 TypeScript 文件：

```typescript
// 实际文件：src/utils/request.ts
import { request } from '@/utils/request'
```

但 Vue 单文件组件建议保留 `.vue` 后缀：

```typescript
// 推荐写法
import UserList from '@/views/user/UserList.vue'

// 不推荐为了省略 .vue 而修改 resolve.extensions
import UserList from '@/views/user/UserList'
```

如果确实需要扩展解析规则，可以在 `vite.config.ts` 中配置：

```typescript
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// 自定义省略扩展名时的解析顺序
export default defineConfig({
  plugins: [vue()],

  resolve: {
    extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json'],
  },
})
```

不建议为了省略 `.vue` 写成如下配置：

```typescript
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// 不推荐：将 .vue 加入 extensions 可能影响 IDE 和类型支持
export default defineConfig({
  plugins: [vue()],

  resolve: {
    extensions: ['.vue', '.ts', '.js', '.json'],
  },
})
```

在 Vue3 + TypeScript 项目中，推荐规则是：`.ts`、`.tsx`、`.js`、`.json` 可以按默认规则省略扩展名；`.vue` 组件导入时显式保留 `.vue` 后缀。

### import.meta 使用

`import.meta` 是 ESM 模块中的元信息对象。Vite 在此基础上扩展了 `import.meta.env`，用于暴露环境变量、运行模式、基础路径和开发生产状态。Vite 官方文档说明，`import.meta.env` 中的常量在开发阶段作为全局变量提供，在构建阶段会被静态替换，以便进行 tree-shaking。([vitejs](https://vite.dev/guide/env-and-mode.html))

常见内置字段包括：

| 字段                       | 说明                                                         |
| -------------------------- | ------------------------------------------------------------ |
| `import.meta.env.MODE`     | 当前运行模式，例如 `development`、`production`、`test`、`staging` |
| `import.meta.env.BASE_URL` | 应用基础路径，由 `base` 配置决定                             |
| `import.meta.env.DEV`      | 是否为开发环境                                               |
| `import.meta.env.PROD`     | 是否为生产环境                                               |
| `import.meta.env.SSR`      | 是否运行在服务端渲染环境                                     |

使用示例：

```typescript
// 根据开发环境输出调试日志
if (import.meta.env.DEV) {
  console.log('当前处于开发环境')
}

// 获取当前模式
const mode = import.meta.env.MODE

// 获取基础路径
const baseUrl = import.meta.env.BASE_URL
```

也可以通过 `import.meta.url` 处理相对当前模块的资源 URL。Vite 官方文档说明，`new URL(url, import.meta.url)` 是原生 ESM 能力，开发阶段浏览器可以直接处理；生产构建时，Vite 会在可静态分析的情况下进行必要转换，以保证构建后的资源路径仍然正确。([vitejs](https://vite.dev/guide/assets.html))

```typescript
// 获取相对当前模块的图片地址
const logoUrl = new URL('../assets/images/logo.png', import.meta.url).href
```

在 Vue 组件中可以这样使用：

```vue
<template>
  <img :src="logoUrl" alt="Logo" />
</template>

<script setup lang="ts">
// 获取静态资源最终访问地址
const logoUrl = new URL('@/assets/images/logo.png', import.meta.url).href
</script>
```

如果资源路径完全动态，例如 `new URL(imagePath, import.meta.url)`，Vite 可能无法在构建阶段静态分析并转换资源路径。动态资源建议使用明确的映射关系或 `import.meta.glob` 管理。

### 静态资源导入

Vite 支持将静态资源作为模块导入。官方文档说明，导入静态资源会返回解析后的公开 URL；开发阶段可能是源码路径，生产构建后会变成带哈希的构建资源路径。CSS 中的 `url()` 也会按类似方式处理，Vue 插件还会将 Vue SFC 模板中的资源引用自动转换为导入。([vitejs](https://vite.dev/guide/assets.html))

在 TypeScript 中导入图片：

```typescript
import logoUrl from '@/assets/images/logo.png'

// logoUrl 是图片最终访问地址
console.log(logoUrl)
```

在 Vue 组件中使用：

```vue
<template>
  <div class="logo-box">
    <img :src="logoUrl" alt="Logo" />
  </div>
</template>

<script setup lang="ts">
import logoUrl from '@/assets/images/logo.png'
</script>

<style scoped>
.logo-box {
  display: flex;
  align-items: center;
}
</style>
```

在 CSS 或 Sass 中使用：

```scss
.login-page {
  min-height: 100vh;
  background-image: url('@/assets/images/login-bg.png');
  background-size: cover;
  background-position: center;
}
```

静态资源也支持特殊查询参数，例如 `?url`、`?raw`、`?inline`、`?no-inline`、`?worker` 等。Vite 官方文档说明，`?url` 可以显式按 URL 导入，`?raw` 可以将资源作为字符串导入，`?worker` 可以将脚本作为 Web Worker 导入。([vitejs](https://vite.dev/guide/assets.html))

```typescript
// 按 URL 导入资源
import fileUrl from './file.txt?url'

// 按字符串导入文本内容
import rawText from './content.md?raw'

// 按 Worker 导入脚本
import DemoWorker from './demo.worker.ts?worker'

const worker = new DemoWorker()
```

需要区分 `src/assets` 和 `public`：

| 存放位置     | 处理方式                       | 访问方式                | 适用场景                            |
| ------------ | ------------------------------ | ----------------------- | ----------------------------------- |
| `src/assets` | 参与构建、可哈希、可被插件处理 | `import` 或 CSS `url()` | 业务图片、字体、组件资源            |
| `public`     | 原样复制到输出目录根部         | `/xxx` 根路径访问       | favicon、robots.txt、固定文件名资源 |

官方文档建议，除非明确需要 `public` 提供的固定路径或固定文件名能力，一般优先通过导入方式处理资源。([vitejs](https://vite.dev/guide/assets.html))

## 环境变量

环境变量用于在不同运行环境中切换接口地址、应用标题、开关配置、构建参数等内容。Vite 通过 `.env` 文件和 `mode` 机制加载环境变量，并通过 `import.meta.env` 暴露给客户端源码。对于 Vue3 + TypeScript 项目，环境变量通常用于配置接口基础路径、应用名称、上传地址、是否启用 Mock、是否显示调试信息等。

### .env 文件规则

Vite 使用 `.env` 文件加载环境变量。官方文档说明，Vite 会从环境目录中加载 `.env`、`.env.local`、`.env.[mode]`、`.env.[mode].local`；其中 `.local` 文件通常用于本地私有配置，应该被 Git 忽略。([vitejs](https://vite.dev/guide/env-and-mode.html))

常见文件如下：

```text
.env
.env.local
.env.development
.env.development.local
.env.test
.env.staging
.env.production
.env.production.local
```

各文件职责如下：

| 文件               | 加载场景               | 是否建议提交 Git |
| ------------------ | ---------------------- | ---------------- |
| `.env`             | 所有模式都会加载       | 可以提交         |
| `.env.local`       | 所有模式都会加载       | 不建议提交       |
| `.env.development` | `development` 模式加载 | 可以提交         |
| `.env.test`        | `test` 模式加载        | 可以提交         |
| `.env.staging`     | `staging` 模式加载     | 可以提交         |
| `.env.production`  | `production` 模式加载  | 可以提交         |
| `.env.*.local`     | 指定模式加载，本地私有 | 不建议提交       |

基础环境变量示例：

文件位置：`.env`

```properties
# 应用标题
VITE_APP_TITLE=后台管理系统

# 默认接口前缀
VITE_API_BASE_URL=/api

# 是否启用 Mock
VITE_USE_MOCK=false
```

开发环境变量示例：

文件位置：`.env.development`

```properties
# 开发环境接口地址
VITE_API_BASE_URL=/api

# 开发环境启用调试信息
VITE_SHOW_DEBUG=true
```

生产环境变量示例：

文件位置：`.env.production`

```properties
# 生产环境接口地址
VITE_API_BASE_URL=https://api.example.com

# 生产环境关闭调试信息
VITE_SHOW_DEBUG=false
```

需要注意，`.env` 文件会在 Vite 启动时加载。官方文档说明，修改 `.env` 文件后需要重启开发服务器才会生效。([vitejs](https://vite.dev/guide/env-and-mode.html))

### 环境模式 mode

`mode` 表示 Vite 当前运行模式。默认情况下，开发服务器 `dev` 命令运行在 `development` 模式，`build` 命令运行在 `production` 模式。官方文档说明，可以通过 `--mode` 参数覆盖命令默认使用的模式，例如 `vite build --mode staging` 会加载 `.env.staging`。([vitejs](https://vite.dev/guide/env-and-mode.html))

常用脚本配置如下：

文件位置：`package.json`

```json
{
  "scripts": {
    "dev": "vite",
    "dev:test": "vite --mode test",
    "dev:staging": "vite --mode staging",
    "build": "vue-tsc -b && vite build",
    "build:test": "vue-tsc -b && vite build --mode test",
    "build:staging": "vue-tsc -b && vite build --mode staging",
    "build:prod": "vue-tsc -b && vite build --mode production",
    "preview": "vite preview"
  }
}
```

不同命令对应的环境文件示例：

```text
pnpm dev
  -> mode = development
  -> 加载 .env + .env.local + .env.development + .env.development.local

pnpm build
  -> mode = production
  -> 加载 .env + .env.local + .env.production + .env.production.local

pnpm build:staging
  -> mode = staging
  -> 加载 .env + .env.local + .env.staging + .env.staging.local
```

需要区分 `mode` 和 `NODE_ENV`。Vite 官方文档明确说明，`NODE_ENV` 和模式是两个不同概念；例如 `vite build --mode development` 的构建模式是 `development`，但 `NODE_ENV` 仍可能是 `production`。([vitejs](https://vite.dev/guide/env-and-mode.html))

在应用代码中读取当前模式：

```typescript
const mode = import.meta.env.MODE

if (mode === 'staging') {
  console.log('当前是预发布环境')
}
```

在 `vite.config.ts` 中读取模式并加载环境变量：

```typescript
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

// 根据 mode 加载环境变量并生成配置
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [vue()],

    server: {
      port: Number(env.VITE_PORT || 5173),
      open: env.VITE_OPEN === 'true',
    },
  }
})
```

### VITE_ 前缀规则

Vite 为了避免意外暴露敏感信息，默认只会将以 `VITE_` 开头的环境变量暴露给客户端源码。官方文档说明，`VITE_` 前缀变量会在打包后暴露到客户端代码中，而未使用该前缀的变量不会通过 `import.meta.env` 暴露给客户端。([vitejs](https://vite.dev/guide/env-and-mode.html))

示例：

文件位置：`.env`

```properties
# 会暴露给客户端
VITE_APP_TITLE=后台管理系统

# 会暴露给客户端
VITE_API_BASE_URL=/api

# 不会暴露给客户端
DB_PASSWORD=123456

# 不会暴露给客户端
SERVER_SECRET_KEY=abcdefg
```

在前端代码中读取：

```typescript
console.log(import.meta.env.VITE_APP_TITLE)
console.log(import.meta.env.VITE_API_BASE_URL)

// 读取不到，结果通常是 undefined
console.log(import.meta.env.DB_PASSWORD)
```

环境变量读取后都是字符串。官方文档也提示，数字和布尔值类型在 `.env` 中声明后，解析到客户端时仍然是字符串，需要在代码中自行转换。([vitejs](https://vite.dev/guide/env-and-mode.html))

```typescript
const useMock = import.meta.env.VITE_USE_MOCK === 'true'
const timeout = Number(import.meta.env.VITE_REQUEST_TIMEOUT || 10000)
```

不要把敏感信息写入 `VITE_` 开头的变量中，例如数据库密码、服务端密钥、私有 Token、云厂商 SecretKey 等。Vite 官方文档明确说明，`VITE_*` 变量会在构建时进入客户端源码，不应该包含敏感信息。([vitejs](https://vite.dev/guide/env-and-mode.html))

### import.meta.env 使用

`import.meta.env` 是业务代码读取 Vite 环境变量的主要入口。它既包含 Vite 内置字段，也包含符合前缀规则的自定义环境变量。官方文档说明，Vite 默认已经为 `import.meta.env` 提供类型定义，如果需要让自定义 `VITE_` 变量获得 TypeScript 智能提示，可以扩展 `ImportMetaEnv` 类型。([vitejs](https://vite.dev/guide/env-and-mode.html))

推荐在 `env.d.ts` 或 `src/vite-env.d.ts` 中声明自定义环境变量类型：

文件位置：`env.d.ts`

```typescript
/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 应用标题 */
  readonly VITE_APP_TITLE: string

  /** 接口基础地址 */
  readonly VITE_API_BASE_URL: string

  /** 是否启用 Mock */
  readonly VITE_USE_MOCK: string

  /** 请求超时时间 */
  readonly VITE_REQUEST_TIMEOUT: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

封装环境变量读取工具可以减少业务代码中重复的类型转换。

文件位置：`src/config/env.ts`

```typescript
// 统一封装 Vite 环境变量读取逻辑
export const appEnv = {
  /** 应用标题 */
  title: import.meta.env.VITE_APP_TITLE,

  /** 当前运行模式 */
  mode: import.meta.env.MODE,

  /** 接口基础地址 */
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL,

  /** 是否开发环境 */
  isDev: import.meta.env.DEV,

  /** 是否生产环境 */
  isProd: import.meta.env.PROD,

  /** 是否启用 Mock */
  useMock: import.meta.env.VITE_USE_MOCK === 'true',

  /** 请求超时时间 */
  requestTimeout: Number(import.meta.env.VITE_REQUEST_TIMEOUT || 10000),
}
```

在 Axios 请求封装中使用：

```typescript
import axios from 'axios'

import { appEnv } from '@/config/env'

// 创建 Axios 实例，统一使用环境变量中的接口基础地址
export const request = axios.create({
  baseURL: appEnv.apiBaseUrl,
  timeout: appEnv.requestTimeout,
})
```

在页面或组件中使用：

```vue
<template>
  <div class="p-4">
    <h1>{{ appTitle }}</h1>
    <p>当前模式：{{ mode }}</p>
  </div>
</template>

<script setup lang="ts">
import { appEnv } from '@/config/env'

const appTitle = appEnv.title
const mode = appEnv.mode
</script>
```

HTML 中也可以使用环境变量常量替换。Vite 官方文档说明，`import.meta.env` 中的属性可以在 HTML 中通过 `%CONST_NAME%` 语法使用，例如 `%MODE%` 或 `%VITE_API_URL%`。([vitejs](https://vite.dev/guide/env-and-mode.html))

文件位置：`index.html`

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <title>%VITE_APP_TITLE%</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

实际项目中建议只在 HTML 中放应用标题、基础描述、少量构建时常量。复杂逻辑仍应放在 TypeScript 代码中处理，避免 HTML 模板承担过多环境判断逻辑。



## 代理配置

代理配置用于解决本地开发阶段前端页面与后端接口之间的跨域访问问题。Vite 的代理只作用于开发服务器阶段，生产环境不会自动继承该代理规则；生产部署时通常需要由 Nginx、网关、后端 CORS 或部署平台单独处理接口转发。Vite 官方文档说明，`server.proxy` 用于配置开发服务器的自定义代理规则，请求路径匹配到代理规则后，请求会被转发到指定目标地址，并且不会再经过 Vite 的普通模块转换流程。([vitejs](https://vite.dev/config/server-options.html))

### server.proxy 基础用法

`server.proxy` 写在 `vite.config.ts` 的 `server` 配置项中，类型是 `Record<string, string | ProxyOptions>`。对象的 key 表示要匹配的请求前缀，value 可以是目标地址字符串，也可以是包含 `target`、`changeOrigin`、`rewrite`、`ws` 等选项的配置对象。Vite 官方文档说明，请求路径以该 key 开头时会被代理到对应目标地址；如果 key 以 `^` 开头，则会被当作正则表达式处理。([vitejs](https://vite.dev/config/server-options.html))

基础代理配置如下。

文件位置：`vite.config.ts`

```typescript
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// 配置开发服务器代理规则
export default defineConfig({
  plugins: [vue()],

  server: {
    proxy: {
      // 简写方式：http://localhost:5173/mock/user -> http://localhost:8080/mock/user
      '/mock': 'http://localhost:8080',

      // 对象方式：适合配置路径重写、请求头来源、WebSocket 等能力
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
```

在上面的配置中，浏览器实际请求的是前端开发服务器地址：

```text
http://localhost:5173/api/user/list
```

Vite 开发服务器会将请求代理到后端服务：

```text
http://localhost:8080/user/list
```

代理配置只影响本地开发环境。生产环境打包后的代码不会携带 `server.proxy` 能力，因此生产环境应通过 Nginx、后端网关或云平台路由规则配置接口转发。

### 后端接口代理

后端接口代理是前端开发中最常见的代理场景。前端项目一般使用相对路径访问接口，例如 `/api/user/list`，由 Vite 在开发阶段转发到真实后端地址。这样可以避免浏览器跨域限制，也可以让前端请求路径在开发环境和生产环境中保持一致。

推荐将接口前缀写入环境变量。

文件位置：`.env.development`

```properties
# 开发环境接口代理前缀
VITE_API_BASE_URL=/api

# 本地后端服务地址，只在 vite.config.ts 中使用
VITE_API_PROXY_TARGET=http://localhost:8080
```

在 Vite 配置文件中读取环境变量并生成代理配置。

文件位置：`vite.config.ts`

```typescript
import vue from '@vitejs/plugin-vue'
import { defineConfig, loadEnv } from 'vite'

// 根据环境变量配置后端接口代理
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [vue()],

    server: {
      proxy: {
        [env.VITE_API_BASE_URL || '/api']: {
          target: env.VITE_API_PROXY_TARGET || 'http://localhost:8080',
          changeOrigin: true,
          rewrite: (path) => path.replace(new RegExp(`^${env.VITE_API_BASE_URL || '/api'}`), ''),
        },
      },
    },
  }
})
```

前端请求封装中继续使用同一个接口前缀。

文件位置：`src/utils/request.ts`

```typescript
import axios from 'axios'

// 创建 Axios 请求实例，开发环境通过 Vite 代理转发到后端
export const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
})
```

页面或业务模块中调用接口。

文件位置：`src/api/user.ts`

```typescript
import { request } from '@/utils/request'

export interface UserInfo {
  id: number
  username: string
  nickname: string
}

// 查询用户列表
export function listUser() {
  return request.get<UserInfo[]>('/user/list')
}
```

最终请求链路如下：

```text
前端代码请求：/api/user/list
  ↓
Vite Dev Server：http://localhost:5173/api/user/list
  ↓
server.proxy 匹配 /api
  ↓
rewrite 去掉 /api
  ↓
后端接口：http://localhost:8080/user/list
```

这种方式的优点是前端业务代码只关心统一的接口前缀，不需要在每个接口中写完整后端地址。后端地址发生变化时，只需要调整 `.env.development` 或代理配置。

### rewrite 路径重写

`rewrite` 用于修改代理转发前的请求路径。最常见的场景是前端统一使用 `/api` 作为代理前缀，但后端接口本身并不包含 `/api`。Vite 官方代理示例中也使用 `rewrite: (path) => path.replace(/^\/api/, '')` 将 `/api` 前缀移除后再转发到目标服务。([vitejs](https://vite.dev/config/server-options.html))

基础写法如下。

文件位置：`vite.config.ts`

```typescript
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// 使用 rewrite 移除接口代理前缀
export default defineConfig({
  plugins: [vue()],

  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,

        // /api/user/list -> /user/list
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
```

不同后端接口路径设计下，`rewrite` 的处理方式不同：

| 前端请求           | rewrite 后路径 | 后端实际接收                        |
| ------------------ | -------------- | ----------------------------------- |
| `/api/user/list`   | `/user/list`   | `http://localhost:8080/user/list`   |
| `/api/system/menu` | `/system/menu` | `http://localhost:8080/system/menu` |
| `/api/auth/login`  | `/auth/login`  | `http://localhost:8080/auth/login`  |

如果后端接口本身也带有 `/api` 前缀，则不需要 rewrite：

```typescript
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// 后端接口本身包含 /api 前缀时，不需要路径重写
export default defineConfig({
  plugins: [vue()],

  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
```

此时请求链路如下：

```text
前端请求：/api/user/list
  ↓
代理转发：http://localhost:8080/api/user/list
```

实际项目中应先确认后端接口是否带统一前缀，再决定是否配置 `rewrite`。错误的路径重写通常会导致接口返回 404。

### changeOrigin 配置

`changeOrigin` 用于控制代理请求时是否修改请求头中的 `Origin` 和 `Host` 等来源信息。开发阶段代理到不同域名或不同端口的后端服务时，通常建议设置为 `true`。Vite 官方代理示例中也将 `changeOrigin` 与 `target`、`rewrite` 一起使用，用于常见接口代理场景。([vitejs](https://vite.dev/config/server-options.html))

常见配置如下。

文件位置：`vite.config.ts`

```typescript
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// 配置 changeOrigin，避免后端根据 Host 或 Origin 判断时出现问题
export default defineConfig({
  plugins: [vue()],

  server: {
    proxy: {
      '/api': {
        target: 'http://dev-api.example.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
```

`changeOrigin` 的常见使用建议如下：

| 配置                  | 适用场景                                           |
| --------------------- | -------------------------------------------------- |
| `changeOrigin: true`  | 代理到独立后端域名、测试环境域名、不同端口服务     |
| `changeOrigin: false` | 后端需要保留原始 Host 信息，或本地特殊调试场景     |
| 不配置                | 默认行为依赖底层代理库，不建议在团队项目中含糊处理 |

如果后端根据 `Host`、`Origin`、网关路由或虚拟主机识别请求来源，`changeOrigin: true` 通常可以减少本地联调问题。对于 WebSocket 代理，还需要额外配置 `ws: true`：

```typescript
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// 配置接口代理和 WebSocket 代理
export default defineConfig({
  plugins: [vue()],

  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },

      '/socket.io': {
        target: 'ws://localhost:8080',
        ws: true,
        changeOrigin: true,
      },
    },
  },
})
```

生产环境中不要依赖 Vite 的 `server.proxy`。如果生产部署后仍然需要 `/api` 转发，应在 Nginx 或网关层配置对应规则。

## CSS 处理

CSS 处理用于说明 Vite 如何加载普通 CSS、CSS Modules、Sass/Less/Stylus 等预处理器，以及如何应用 PostCSS 配置。Vite 官方文档说明，导入 `.css` 文件会通过 `<style>` 标签注入页面，并且支持 HMR；同时，Vite 默认支持 CSS `@import` 内联、CSS 路径别名以及 `url()` 路径自动重写。([vitejs](https://vite.dev/guide/features.html))

### CSS 文件导入

在 Vite 项目中，可以直接在 TypeScript、Vue 组件或入口文件中导入 CSS 文件。导入后的样式会在开发阶段注入页面，并且支持热更新。([vitejs](https://vite.dev/guide/features.html))

全局样式通常在 `src/main.ts` 中导入。

文件位置：`src/main.ts`

```typescript
import { createApp } from 'vue'

import App from './App.vue'
import './styles/index.css'

// 创建并挂载 Vue 应用
createApp(App).mount('#app')
```

全局样式文件如下。

文件位置：`src/styles/index.css`

```css
/* 全局基础样式 */
html,
body,
#app {
  width: 100%;
  min-height: 100%;
  margin: 0;
}

/* 全局盒模型 */
* {
  box-sizing: border-box;
}
```

也可以在 Vue 单文件组件中使用局部样式。

文件位置：`src/views/home/HomeView.vue`

```vue
<template>
  <main class="home-page">
    <h1 class="home-title">Vite Vue3 TypeScript</h1>
  </main>
</template>

<script setup lang="ts">
// 当前页面暂无业务逻辑
</script>

<style scoped>
.home-page {
  padding: 24px;
}

.home-title {
  font-size: 24px;
  font-weight: 600;
}
</style>
```

如果样式是全局基础样式、重置样式、主题变量、组件库覆盖样式，建议放在 `src/styles` 并由 `main.ts` 统一导入。如果样式只服务于某个组件，建议放在该 `.vue` 文件的 `<style scoped>` 中，减少全局污染。

### CSS Modules

CSS Modules 用于在组件中实现样式类名的局部作用域隔离。Vite 官方文档说明，任何以 `.module.css` 结尾的 CSS 文件都会被识别为 CSS Modules，导入该文件会返回一个模块对象；CSS Modules 的行为可以通过 `css.modules` 配置项调整。([vitejs](https://vite.dev/guide/features.html))

创建 CSS Modules 文件。

文件位置：`src/components/user/UserCard.module.css`

```css
/* 用户卡片容器 */
.card {
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

/* 用户名称 */
.username {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}
```

在 Vue 组件中导入并使用。

文件位置：`src/components/user/UserCard.vue`

```vue
<template>
  <section :class="styles.card">
    <h3 :class="styles.username">{{ username }}</h3>
  </section>
</template>

<script setup lang="ts">
import styles from './UserCard.module.css'

defineProps<{
  username: string
}>()
</script>
```

如果项目使用 Sass，也可以将 CSS Modules 与预处理器结合，例如 `style.module.scss`。Vite 官方文档说明，CSS Modules 可以与预处理器组合使用，只需要在扩展名前添加 `.module`。([vitejs](https://vite.dev/guide/features.html))

文件位置：`src/components/user/UserCard.module.scss`

```scss
/* 用户卡片容器 */
.card {
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;

  .username {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
  }
}
```

如果需要统一 CSS Modules 的类名命名规则，可以在 `vite.config.ts` 中配置 `css.modules`。

文件位置：`vite.config.ts`

```typescript
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// 配置 CSS Modules 命名规则
export default defineConfig({
  plugins: [vue()],

  css: {
    modules: {
      // 将 kebab-case 类名转换为 camelCase，只暴露 camelCase 形式
      localsConvention: 'camelCaseOnly',

      // 开发环境便于调试，生产环境可以根据需要改得更短
      generateScopedName: '[name]__[local]___[hash:base64:5]',
    },
  },
})
```

CSS Modules 适合封装通用组件、复杂局部样式、避免类名冲突的业务组件。页面级全局布局、主题变量和组件库覆盖样式通常不建议使用 CSS Modules。

### CSS 预处理器配置

Vite 内置支持 `.scss`、`.sass`、`.less`、`.styl`、`.stylus` 等 CSS 预处理器文件，但需要安装对应预处理器依赖，不需要额外安装 Vite 专用插件。官方文档说明，如果使用 Vue 单文件组件，对应的 `<style lang="scss">`、`<style lang="less">` 等也会自动启用。([vitejs](https://vite.dev/guide/features.html))

以 Sass 为例，安装依赖：

```bash
# 安装 Sass 预处理器
pnpm add -D sass-embedded
```

如果团队使用传统 `sass` 包，也可以安装：

```bash
# 安装 Sass 预处理器
pnpm add -D sass
```

在 Vue 组件中使用 Sass：

文件位置：`src/views/dashboard/DashboardView.vue`

```vue
<template>
  <section class="dashboard-page">
    <h1 class="dashboard-page__title">数据看板</h1>
  </section>
</template>

<script setup lang="ts">
// 当前页面暂无业务逻辑
</script>

<style scoped lang="scss">
.dashboard-page {
  padding: 24px;

  &__title {
    margin: 0;
    font-size: 24px;
    font-weight: 600;
  }
}
</style>
```

如果项目需要全局注入 Sass 变量、mixin 或函数，可以通过 `css.preprocessorOptions` 配置。这样每个 Sass 文件都可以直接使用公共变量，而不需要在每个组件里重复 `@use`。

文件位置：`vite.config.ts`

```typescript
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// 配置 Sass 全局样式资源
export default defineConfig({
  plugins: [vue()],

  css: {
    preprocessorOptions: {
      scss: {
        // 为每个 scss 文件自动注入公共变量和 mixin
        additionalData: `@use "@/styles/variables.scss" as *;`,
      },
    },
  },
})
```

公共变量文件如下。

文件位置：`src/styles/variables.scss`

```scss
/* 主题主色 */
$primary-color: #2563eb;

/* 页面间距 */
$page-padding: 24px;

/* 通用圆角 */
$border-radius-base: 8px;
```

组件中可以直接使用变量。

文件位置：`src/components/base/BasePanel.vue`

```vue
<template>
  <section class="base-panel">
    <slot />
  </section>
</template>

<script setup lang="ts">
// 基础面板组件
</script>

<style scoped lang="scss">
.base-panel {
  padding: $page-padding;
  border-radius: $border-radius-base;
  border: 1px solid #e5e7eb;
}
</style>
```

需要注意，`additionalData` 会注入到每个相关样式文件中，因此适合放变量、mixin、函数，不适合放会生成实际 CSS 的普通样式规则，否则可能导致重复输出。

### PostCSS 配置

PostCSS 用于在 CSS 构建链路中执行额外转换，例如自动添加浏览器前缀、支持未来 CSS 语法、处理嵌套语法等。Vite 官方文档说明，如果项目中存在有效的 PostCSS 配置文件，例如 `postcss.config.js`，Vite 会自动将其应用到所有导入的 CSS 中；CSS 压缩会在 PostCSS 处理之后执行。([vitejs](https://vite.dev/guide/features.html))

安装常见 PostCSS 插件：

```bash
# 安装 PostCSS、Autoprefixer 和 CSS 嵌套插件
pnpm add -D postcss autoprefixer postcss-nesting
```

PostCSS 配置文件如下。

文件位置：`postcss.config.js`

```javascript
/**
 * PostCSS 配置
 */
export default {
  plugins: {
    // 支持 CSS 嵌套语法
    'postcss-nesting': {},

    // 根据 browserslist 自动添加浏览器前缀
    autoprefixer: {},
  },
}
```

也可以在 `package.json` 中配置浏览器兼容范围。

文件位置：`package.json`

```json
{
  "browserslist": [
    "last 2 versions",
    "> 1%",
    "not dead"
  ]
}
```

使用 CSS 嵌套语法示例：

文件位置：`src/styles/button.css`

```css
/* 按钮基础样式 */
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: 0.85;
  }
}
```

PostCSS 适合处理标准 CSS 的工程化增强。对于 Sass 变量、mixin、函数等能力，应使用 Sass；对于浏览器兼容前缀、未来 CSS 语法转换、CSS 规范草案能力，则更适合交给 PostCSS 插件处理。

## 静态资源处理

静态资源处理用于说明 Vite 如何处理图片、字体、公共资源和自定义资源类型。Vite 官方文档说明，导入静态资源时会返回解析后的公开 URL；开发环境中可能是源码路径，生产构建后会变成构建产物中的资源路径。CSS `url()`、Vue SFC 模板中的资源引用也会被相应处理。([vitejs](https://vite.dev/guide/assets.html))

### 图片资源处理

图片资源一般建议放在 `src/assets` 下，并通过 `import`、CSS `url()` 或 Vue 模板引用。通过源码导入的资源会参与 Vite 构建流程，生产构建时可以生成带哈希的文件名，便于缓存控制。Vite 官方文档说明，常见图片、媒体和字体类型会被自动识别为资源，导入后会返回资源 URL。([vitejs](https://vite.dev/guide/assets.html))

在 TypeScript 中导入图片：

文件位置：`src/config/logo.ts`

```typescript
import logoUrl from '@/assets/images/logo.png'

// 导出应用 Logo 地址
export const appLogoUrl = logoUrl
```

在 Vue 组件中使用图片：

文件位置：`src/components/app/AppLogo.vue`

```vue
<template>
  <img class="app-logo" :src="appLogoUrl" alt="应用 Logo" />
</template>

<script setup lang="ts">
import { appLogoUrl } from '@/config/logo'
</script>

<style scoped>
.app-logo {
  width: 120px;
  height: auto;
}
</style>
```

在 CSS 中通过 `url()` 引用图片：

文件位置：`src/styles/login.css`

```css
/* 登录页背景图 */
.login-page {
  min-height: 100vh;
  background-image: url('@/assets/images/login-bg.png');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}
```

也可以使用 `new URL()` 获取相对当前模块的资源路径。Vite 官方文档说明，`new URL(url, import.meta.url)` 是原生 ESM 能力，适合从 JavaScript 模块中解析静态资源地址。([vitejs](https://vite.dev/guide/assets.html))

```typescript
// 获取相对当前模块的图片地址
export const getImageUrl = (name: string) => {
  return new URL(`../assets/images/${name}`, import.meta.url).href
}
```

动态图片路径需要谨慎处理。如果图片名称完全来自接口或用户输入，构建阶段可能无法静态分析资源依赖。更稳妥的方式是使用明确映射。

```typescript
import avatarDefault from '@/assets/images/avatar-default.png'
import avatarAdmin from '@/assets/images/avatar-admin.png'
import avatarGuest from '@/assets/images/avatar-guest.png'

// 使用明确映射管理可选图片资源
const avatarMap: Record<string, string> = {
  default: avatarDefault,
  admin: avatarAdmin,
  guest: avatarGuest,
}

export function getAvatarUrl(type: string) {
  return avatarMap[type] || avatarMap.default
}
```

### 字体资源处理

字体资源可以放在 `src/assets/fonts` 中，并通过 CSS `@font-face` 引入。字体文件属于静态资源，Vite 会按照资源处理规则解析路径并参与构建。官方文档说明，常见字体文件类型会被自动识别为资源，也可以通过 `assetsInclude` 扩展自定义资源类型。([vitejs](https://vite.dev/guide/assets.html))

推荐目录结构如下：

```text
src
└── assets
    └── fonts
        ├── DingTalk-JinBuTi.woff2
        └── iconfont.woff2
```

字体声明文件如下。

文件位置：`src/styles/fonts.css`

```css
/* 钉钉进步体 */
@font-face {
  font-family: 'DingTalkJinBuTi';
  src: url('@/assets/fonts/DingTalk-JinBuTi.woff2') format('woff2');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

/* 图标字体 */
@font-face {
  font-family: 'AppIconFont';
  src: url('@/assets/fonts/iconfont.woff2') format('woff2');
  font-weight: normal;
  font-style: normal;
  font-display: block;
}
```

在全局样式入口中导入字体文件。

文件位置：`src/styles/index.css`

```css
/* 引入字体声明 */
@import './fonts.css';

/* 应用基础字体 */
body {
  font-family:
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    sans-serif;
}

/* 标题使用自定义字体 */
.app-title {
  font-family: 'DingTalkJinBuTi', sans-serif;
}
```

最后在 `src/main.ts` 中导入全局样式入口。

文件位置：`src/main.ts`

```typescript
import { createApp } from 'vue'

import App from './App.vue'
import './styles/index.css'

// 挂载 Vue 应用
createApp(App).mount('#app')
```

如果字体文件由设计平台或第三方图标平台生成，建议统一放在 `src/assets/fonts`，并通过版本管理记录来源。字体文件体积较大时，应优先使用 `woff2`，并避免引入未使用的完整字体包。

### public 资源访问

`public` 目录用于存放不希望经过源码导入、不需要哈希文件名、必须保持固定访问路径的资源。Vite 官方文档说明，`public` 目录下的资源在开发阶段会通过根路径 `/` 提供访问，生产构建时会原样复制到 `dist` 根目录；引用时应使用根绝对路径，例如 `public/icon.png` 应写成 `/icon.png`。([vitejs](https://vite.dev/guide/assets.html))

适合放入 `public` 的资源包括：

| 资源                 | 示例                                | 原因                   |
| -------------------- | ----------------------------------- | ---------------------- |
| 网站图标             | `public/favicon.ico`                | 浏览器按固定路径访问   |
| `robots.txt`         | `public/robots.txt`                 | 搜索引擎需要固定文件名 |
| 第三方验证文件       | `public/verify.txt`                 | 平台要求固定路径       |
| 下载模板             | `public/templates/import-user.xlsx` | 希望保持固定文件名     |
| 不参与构建的静态文件 | `public/config/app-config.json`     | 需要原样复制           |

目录示例：

```text
public
├── favicon.ico
├── robots.txt
├── verify.txt
└── templates
    └── import-user.xlsx
```

在 `index.html` 中访问 `public` 资源：

文件位置：`index.html`

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite Vue3 TypeScript</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

在业务代码中提供下载地址：

```typescript
// public/templates/import-user.xlsx 会在开发和构建后通过 /templates/import-user.xlsx 访问
export const userImportTemplateUrl = '/templates/import-user.xlsx'
```

在 Vue 组件中使用：

```vue
<template>
  <a :href="templateUrl" download="用户导入模板.xlsx">下载导入模板</a>
</template>

<script setup lang="ts">
import { userImportTemplateUrl } from '@/config/template'

const templateUrl = userImportTemplateUrl
</script>
```

选择 `src/assets` 还是 `public` 时，可以按下面规则判断：

| 场景                                    | 推荐位置     |
| --------------------------------------- | ------------ |
| 组件、页面、样式中引用的图片和字体      | `src/assets` |
| 需要参与构建、哈希、缓存优化的资源      | `src/assets` |
| 必须保持固定文件名的资源                | `public`     |
| 不想先 import、希望直接根路径访问的资源 | `public`     |
| 第三方平台校验文件、robots、favicon     | `public`     |

除非明确需要 `public` 的固定路径能力，否则一般更推荐通过 `src/assets` 导入资源。Vite 官方文档也建议优先使用导入方式，只有在需要 `public` 目录提供的特性时再使用 `public`。([vitejs](https://vite.dev/guide/assets.html))

### assetsInclude 配置

`assetsInclude` 用于扩展 Vite 对静态资源类型的识别范围。默认情况下，Vite 已经能识别常见图片、媒体和字体文件；当项目需要导入特殊资源格式，例如 `.gltf`、`.glb`、`.wasm?url`、自定义地图文件、模型文件等，可以通过 `assetsInclude` 告诉 Vite 将这些文件当作静态资源处理。Vite 官方文档说明，`assetsInclude` 可以指定额外的 picomatch 模式，被匹配的文件从 JavaScript 导入时会返回解析后的 URL 字符串。([vitejs](https://vite.dev/config/shared-options.html))

基础配置如下。

文件位置：`vite.config.ts`

```typescript
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// 扩展静态资源识别类型
export default defineConfig({
  plugins: [vue()],

  assetsInclude: [
    // 3D 模型文件
    '**/*.gltf',
    '**/*.glb',

    // 自定义地图或二进制资源
    '**/*.geojson',
    '**/*.bin',
  ],
})
```

配置后，可以在业务代码中直接导入这些资源。

文件位置：`src/views/model/modelAssets.ts`

```typescript
import sceneModelUrl from '@/assets/models/scene.gltf'
import mapDataUrl from '@/assets/maps/china.geojson'

// 导出特殊静态资源访问地址
export const modelAssets = {
  sceneModelUrl,
  mapDataUrl,
}
```

在组件中使用：

文件位置：`src/views/model/ModelPreview.vue`

```vue
<template>
  <section class="model-preview">
    <p>模型地址：{{ modelAssets.sceneModelUrl }}</p>
    <p>地图数据地址：{{ modelAssets.mapDataUrl }}</p>
  </section>
</template>

<script setup lang="ts">
import { modelAssets } from './modelAssets'
</script>

<style scoped>
.model-preview {
  padding: 16px;
}
</style>
```

如果 TypeScript 无法识别这些自定义资源模块，需要补充类型声明。

文件位置：`env.d.ts`

```typescript
/// <reference types="vite/client" />

declare module '*.gltf' {
  const src: string
  export default src
}

declare module '*.glb' {
  const src: string
  export default src
}

declare module '*.geojson' {
  const src: string
  export default src
}
```

`assetsInclude` 只负责告诉 Vite “这些文件应该按静态资源处理”。如果某类资源需要被转换成 JavaScript 对象、Vue 组件、压缩产物或特殊运行时代码，就不适合只使用 `assetsInclude`，而应考虑使用专门的 Vite 插件或自定义插件处理。



## 插件机制

插件机制用于扩展 Vite 的能力，例如支持 Vue 单文件组件、JSX、旧浏览器兼容、自动导入、组件按需加载、Mock、压缩、构建分析等。Vite 插件基于 Rollup 插件接口，并在此基础上增加了一些 Vite 专属选项，因此既可以使用 Vite 插件，也可以在兼容场景下使用 Rollup 插件。([vitejs](https://vite.dev/guide/using-plugins.html))

### Vite 插件作用

Vite 插件的主要作用是参与项目的开发服务器和构建流程。插件可以处理源码转换、模块解析、HTML 转换、虚拟模块、HMR、开发服务器中间件、构建输出等逻辑。对于 Vue3 + TypeScript 项目，最基础的插件是 `@vitejs/plugin-vue`，它负责让 Vite 正确处理 `.vue` 单文件组件。([vitejs](https://vite.dev/plugins/))

常见插件作用如下：

| 插件作用 | 典型场景                                 |
| -------- | ---------------------------------------- |
| 框架支持 | Vue SFC、Vue JSX、React Fast Refresh     |
| 开发增强 | Mock 接口、自动打开调试工具、开发期检查  |
| 代码转换 | SVG 转组件、Markdown 转组件、虚拟模块    |
| 自动导入 | 自动导入 Vue API、组件库 API、业务 hooks |
| 组件处理 | 自动注册组件、按需引入组件库样式         |
| 构建优化 | gzip/brotli 压缩、产物分析、兼容旧浏览器 |
| 环境控制 | 只在开发环境或生产构建中启用某些插件     |

基础插件配置如下。

文件位置：`vite.config.ts`

```typescript
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// 配置 Vue 插件，让 Vite 支持 Vue 3 单文件组件
export default defineConfig({
  plugins: [
    vue(),
  ],
})
```

插件一般放在 `plugins` 数组中。Vite 官方文档说明，插件需要先安装到项目依赖中，然后在 `vite.config` 的 `plugins` 数组中注册；`plugins` 也支持插件预设和数组扁平化，同时 falsy 值会被忽略，这可以用于按环境启用或禁用插件。([vitejs](https://vite.dev/guide/using-plugins.html))

### 官方插件使用

官方插件通常用于支持核心框架或关键构建能力。对于 Vue3 + TypeScript 项目，最常用的是 `@vitejs/plugin-vue`；如果项目使用 Vue JSX，则可以补充 `@vitejs/plugin-vue-jsx`；如果需要兼容旧浏览器，可以考虑 `@vitejs/plugin-legacy`。Vite 官方插件列表中明确列出了 Vue 3 SFC、Vue 3 JSX、React、RSC 和 legacy 等插件。([vitejs](https://vite.dev/plugins/))

安装 Vue 官方插件：

```bash
# 安装 Vue 3 单文件组件支持插件
pnpm add -D @vitejs/plugin-vue
```

在 `vite.config.ts` 中启用：

```typescript
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// 使用官方 Vue 插件
export default defineConfig({
  plugins: [
    // 支持 .vue 单文件组件、模板编译和 HMR
    vue(),
  ],
})
```

如果项目需要 Vue JSX，可以安装并配置 `@vitejs/plugin-vue-jsx`：

```bash
# 安装 Vue JSX 支持插件
pnpm add -D @vitejs/plugin-vue-jsx
```

文件位置：`vite.config.ts`

```typescript
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { defineConfig } from 'vite'

// 同时启用 Vue SFC 和 Vue JSX 支持
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
  ],
})
```

如果生产构建需要兼容旧浏览器，可以使用 `@vitejs/plugin-legacy`。Vite 官方文档在插件使用示例中也以 `@vitejs/plugin-legacy` 作为官方插件示例。([vitejs](https://vite.dev/guide/using-plugins.html))

```bash
# 安装旧浏览器兼容插件
pnpm add -D @vitejs/plugin-legacy
```

文件位置：`vite.config.ts`

```typescript
import legacy from '@vitejs/plugin-legacy'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// 生产构建时提供旧浏览器兼容能力
export default defineConfig({
  plugins: [
    vue(),

    legacy({
      // 根据项目兼容性要求配置目标浏览器
      targets: ['defaults', 'not IE 11'],
    }),
  ],
})
```

官方插件优先用于框架级能力，社区插件更适合处理工程增强能力。项目中不建议为了简单功能堆叠过多插件，应优先确认 Vite 内置能力是否已经支持对应场景。

### 社区插件使用

社区插件用于补充 Vite 默认能力之外的工程化需求。Vite 官方文档建议，在寻找 Vite 插件或兼容 Rollup 插件之前，先查看 Vite 功能文档，因为很多在传统 Rollup 项目中需要插件处理的能力，在 Vite 中已经内置支持；社区插件可以通过 Vite Plugin Registry 查找。([vitejs](https://vite.dev/guide/using-plugins.html))

常见社区插件场景如下：

| 插件场景     | 说明                                        |
| ------------ | ------------------------------------------- |
| 自动导入     | 自动导入 Vue、Vue Router、Pinia、业务 hooks |
| 组件自动注册 | 自动扫描并注册 `src/components` 下的组件    |
| SVG 处理     | 将 SVG 作为 Vue 组件使用                    |
| Mock 数据    | 本地开发模拟后端接口                        |
| 构建压缩     | 生成 gzip 或 brotli 文件                    |
| 产物分析     | 分析构建后 JS、CSS、资源体积                |

下面以自动导入和组件自动注册为例。先安装插件：

```bash
# 安装自动导入和组件自动注册插件
pnpm add -D unplugin-auto-import unplugin-vue-components
```

配置插件：

文件位置：`vite.config.ts`

```typescript
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'

// 配置社区插件：自动导入 Vue API 和自动注册组件
export default defineConfig({
  plugins: [
    vue(),

    AutoImport({
      // 自动导入 Vue、Vue Router、Pinia 中常用 API
      imports: ['vue', 'vue-router', 'pinia'],

      // 生成自动导入类型声明文件
      dts: 'src/types/auto-imports.d.ts',
    }),

    Components({
      // 自动扫描组件目录
      dirs: ['src/components'],

      // 生成组件类型声明文件
      dts: 'src/types/components.d.ts',
    }),
  ],
})
```

配置后，组件中可以直接使用常见 Vue API，而不需要每次手动导入：

文件位置：`src/views/demo/DemoView.vue`

```vue
<template>
  <section class="p-4">
    <h1>{{ title }}</h1>
    <BaseButton @click="handleClick">点击</BaseButton>
  </section>
</template>

<script setup lang="ts">
// ref 由自动导入插件处理，BaseButton 由组件自动注册插件处理
const title = ref('Vite 插件示例')

function handleClick() {
  title.value = '已点击'
}
</script>
```

社区插件需要关注维护状态、版本兼容性、构建影响和团队可理解性。对于核心链路插件，例如自动导入、组件自动注册、Mock、压缩插件，应统一配置在 `vite/plugins.ts` 中，避免散落在主配置文件中。

### 插件执行顺序

插件执行顺序会影响源码转换、模块解析和构建结果。Vite 官方文档说明，可以通过 `enforce` 控制插件位置：`pre` 表示在 Vite 核心插件之前调用，默认插件在 Vite 核心插件之后调用，`post` 表示在 Vite 构建插件之后调用。插件还可以通过 `apply` 限定只在 `serve` 或 `build` 阶段生效。([vitejs](https://vite.dev/guide/using-plugins.html))

基础执行顺序可以理解为：

```text
enforce: 'pre'
  ↓
Vite 核心插件
  ↓
普通插件
  ↓
Vite 构建插件
  ↓
enforce: 'post'
```

使用 `enforce` 控制执行顺序：

文件位置：`vite.config.ts`

```typescript
import vue from '@vitejs/plugin-vue'
import { defineConfig, type PluginOption } from 'vite'

// 一个示例插件，用于在普通插件之前执行
function prePlugin(): PluginOption {
  return {
    name: 'demo-pre-plugin',
    enforce: 'pre',
    transform(code, id) {
      if (id.endsWith('.ts')) {
        // 这里只做演示，实际项目应避免无意义转换
        return code
      }
    },
  }
}

// 一个示例插件，用于在构建阶段执行
function buildOnlyPlugin(): PluginOption {
  return {
    name: 'demo-build-only-plugin',
    apply: 'build',
    closeBundle() {
      console.log('构建产物生成完成')
    },
  }
}

export default defineConfig({
  plugins: [
    prePlugin(),
    vue(),
    buildOnlyPlugin(),
  ],
})
```

`apply` 用于限制插件的运行阶段：

| apply 配置       | 作用                   |
| ---------------- | ---------------------- |
| 不配置           | 开发和构建阶段都执行   |
| `apply: 'serve'` | 只在开发服务器阶段执行 |
| `apply: 'build'` | 只在生产构建阶段执行   |

开发专用插件示例：

```typescript
import vue from '@vitejs/plugin-vue'
import { defineConfig, type PluginOption } from 'vite'

// 只在开发阶段输出请求调试信息
function devLoggerPlugin(): PluginOption {
  return {
    name: 'dev-logger-plugin',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        console.log(`开发请求：${req.url}`)
        next()
      })
    },
  }
}

export default defineConfig({
  plugins: [
    vue(),
    devLoggerPlugin(),
  ],
})
```

一般项目中，不建议随意使用 `enforce` 调整顺序。只有当插件必须在 Vue 编译前处理源码、必须在构建结束后处理产物、或与 Rollup 插件兼容性有关时，才需要显式设置执行顺序。

## 依赖预构建

依赖预构建用于优化开发阶段的依赖加载性能和依赖格式兼容性。首次运行 `vite` 时，Vite 会自动对项目依赖进行预构建；这个过程默认自动、透明地执行。Vite 官方文档说明，依赖预构建主要服务两个目标：将 CommonJS / UMD 依赖转换为 ESM，以及把内部模块很多的 ESM 依赖合并成更少的模块，以减少浏览器请求数量。([vitejs](https://vite.dev/guide/dep-pre-bundling.html))

### optimizeDeps 作用

`optimizeDeps` 用于配置开发阶段的依赖优化行为。依赖预构建只作用于开发模式，生产构建阶段不使用这个开发期依赖优化器。Vite 官方文档说明，预构建会在首次运行时执行，如果没有缓存，Vite 会扫描源码中的裸模块导入，也就是从 `node_modules` 解析的依赖导入，并以这些依赖作为预构建入口。([vitejs](https://vite.dev/guide/dep-pre-bundling.html))

典型的裸模块导入如下：

```typescript
import axios from 'axios'
import { createPinia } from 'pinia'
import { createRouter } from 'vue-router'
```

浏览器原生 ESM 不能直接识别 `axios`、`pinia` 这类裸模块导入，因此 Vite 会将它们解析并重写成浏览器可访问的 URL，同时对依赖执行预构建。Vite 功能文档也说明，Vite 会检测裸模块导入，进行预构建并将导入重写为有效 URL。([vitejs](https://vite.dev/guide/features.html))

基础配置示例：

文件位置：`vite.config.ts`

```typescript
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// 配置依赖预构建
export default defineConfig({
  plugins: [vue()],

  optimizeDeps: {
    // 显式预构建常用依赖
    include: ['axios', 'pinia', 'vue-router'],

    // 排除不希望被预构建的依赖
    exclude: [],
  },
})
```

一般项目不需要手动配置 `optimizeDeps`，Vite 自动扫描已经可以覆盖多数场景。只有在依赖无法被初始扫描发现、monorepo 软链接依赖、依赖包含大量深层导入、或启动后频繁触发重新预构建时，才需要手动调整。

### include 与 exclude 配置

`optimizeDeps.include` 用于强制某些依赖进入预构建，`optimizeDeps.exclude` 用于排除某些依赖。Vite 官方文档说明，默认情况下，不在 `node_modules` 中的 linked packages 不会被预构建，可以通过 `include` 强制预构建；如果排除了一个 ESM 依赖，但它内部包含 CommonJS 依赖，则应将嵌套 CommonJS 依赖加入 `include`。([vitejs](https://vite.dev/config/dep-optimization-options.html))

适合加入 `include` 的场景：

| 场景                         | 说明                             |
| ---------------------------- | -------------------------------- |
| 启动后才被插件转换出来的依赖 | Vite 初始扫描无法发现            |
| monorepo linked package      | 本地软链接包需要按依赖方式预构建 |
| CommonJS 依赖                | 开发阶段需要转换为 ESM           |
| 大量深层导入的依赖           | 避免浏览器发出过多请求           |
| 频繁触发重新预构建的依赖     | 启动阶段显式纳入优化             |

配置示例：

文件位置：`vite.config.ts`

```typescript
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// 使用 include 和 exclude 调整依赖预构建
export default defineConfig({
  plugins: [vue()],

  optimizeDeps: {
    include: [
      // 常用请求库
      'axios',

      // Vue 状态管理和路由
      'pinia',
      'vue-router',

      // 示例：linked package 或插件转换后才出现的依赖
      '@company/shared-ui',
    ],

    exclude: [
      // 示例：本身已经是较小 ESM 模块，且希望浏览器直接加载
      '@company/tiny-esm-utils',
    ],
  },
})
```

如果依赖存在嵌套 CommonJS 依赖，可以使用 `>` 语法：

```typescript
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// 处理被排除 ESM 依赖中的嵌套 CommonJS 依赖
export default defineConfig({
  plugins: [vue()],

  optimizeDeps: {
    include: [
      // esm-dep 内部依赖 cjs-dep 时，可以显式包含嵌套依赖
      'esm-dep > cjs-dep',
    ],
  },
})
```

对于存在大量深层导入的库，也可以使用尾部 glob 模式一次性包含深层导入。Vite 官方文档将该能力标注为实验性，用于避免每次出现新的深层导入时都触发重新预构建。([vitejs](https://vite.dev/config/dep-optimization-options.html))

```typescript
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// 预构建某个库中的深层组件导入
export default defineConfig({
  plugins: [vue()],

  optimizeDeps: {
    include: [
      'my-lib/components/**/*.vue',
    ],
  },
})
```

实际项目中，`include` 和 `exclude` 不宜提前过度配置。建议先使用默认行为，只有当启动日志、浏览器请求或依赖兼容性暴露出问题时，再针对性配置。

### 预构建缓存

Vite 会缓存预构建后的依赖，避免每次启动都重复执行依赖优化。官方文档说明，文件系统缓存默认位于 `node_modules/.vite`，Vite 会根据包管理器 lockfile 内容、patches 目录修改时间、相关 Vite 配置字段和 `NODE_ENV` 等信息判断是否需要重新预构建。([vitejs](https://vite.dev/guide/dep-pre-bundling.html))

缓存目录示例：

```text
node_modules
└── .vite
    └── deps
        ├── axios.js
        ├── pinia.js
        ├── vue.js
        └── vue-router.js
```

常见触发重新预构建的情况：

| 触发条件                                                | 说明                   |
| ------------------------------------------------------- | ---------------------- |
| 修改 `pnpm-lock.yaml`、`package-lock.json`、`yarn.lock` | 依赖版本发生变化       |
| 修改 `vite.config.ts` 中相关配置                        | 依赖优化配置可能变化   |
| 修改 patches 目录                                       | 依赖补丁发生变化       |
| 修改 `NODE_ENV`                                         | 环境值变化影响优化结果 |
| 使用 `--force` 启动                                     | 强制忽略已有缓存       |

强制重新预构建可以使用命令行参数：

```bash
# 忽略已有预构建缓存，强制重新优化依赖
pnpm dev -- --force
```

也可以删除缓存目录：

```bash
# 删除 Vite 依赖预构建缓存
rm -rf node_modules/.vite

# 重新启动开发服务器
pnpm dev
```

Vite 还会对已解析的依赖请求设置强缓存 HTTP 头，以提升开发阶段页面刷新性能。官方文档说明，如果调试依赖源码或本地修改依赖，需要临时关闭浏览器 Network 缓存、使用 `--force` 重启开发服务器并重新加载页面。([vitejs](https://vite.dev/guide/dep-pre-bundling.html))

### 依赖更新处理

当项目新增、升级或删除依赖后，可能需要处理依赖预构建缓存。多数情况下，Vite 会根据 lockfile 变化自动重新预构建，但在 monorepo、本地 linked package、patch-package、手动修改 `node_modules` 或调试依赖源码时，缓存可能导致页面仍然使用旧依赖结果。

新增依赖后：

```bash
# 安装新依赖
pnpm add axios

# 正常启动，Vite 通常会自动发现并预构建
pnpm dev
```

升级依赖后：

```bash
# 升级指定依赖
pnpm up axios

# 重新启动开发服务器
pnpm dev
```

如果页面仍然表现异常，可以强制刷新预构建：

```bash
# 强制 Vite 重新预构建依赖
pnpm dev -- --force
```

如果使用 monorepo linked package，修改 linked package 后也可能需要强制重启。Vite 官方文档说明，在 linked dependency 变更后，可以使用 `--force` 重启开发服务器使变更生效。([vitejs](https://vite.dev/guide/dep-pre-bundling.html))

推荐排查顺序如下：

```text
依赖变更后页面异常
  ↓
确认 package.json 和 lockfile 是否正确
  ↓
重启 dev server
  ↓
使用 pnpm dev -- --force
  ↓
删除 node_modules/.vite
  ↓
必要时删除 node_modules 后重新 install
```

不要一遇到依赖问题就删除整个 `node_modules`。多数预构建问题只需要 `--force` 或删除 `node_modules/.vite` 即可。

## TypeScript 支持

Vite 对 TypeScript 提供开箱即用支持，可以直接导入 `.ts` 文件，也可以在 Vue 单文件组件中使用 `<script setup lang="ts">`。但 Vite 的 TypeScript 支持重点是快速转译，而不是完整类型检查。官方文档明确说明，Vite 只对 `.ts` 文件执行转译，不执行类型检查，类型检查应由 IDE 或构建流程处理。([vitejs](https://vite.dev/guide/features.html))

### Vite 中的 TypeScript 编译

Vite 在开发阶段会将 TypeScript 快速转译为浏览器可执行的 JavaScript。转译是按文件执行的，符合 Vite 按需编译模型；而完整类型检查需要理解整个模块图，这会影响开发服务器速度。因此，Vite 将“转译”和“类型检查”分离。([vitejs](https://vite.dev/guide/features.html))

基础 TypeScript 文件示例：

文件位置：`src/utils/date.ts`

```typescript
// 格式化日期时间
export function formatDateTime(value: string | number | Date): string {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  const hour = `${date.getHours()}`.padStart(2, '0')
  const minute = `${date.getMinutes()}`.padStart(2, '0')
  const second = `${date.getSeconds()}`.padStart(2, '0')

  return `${year}-${month}-${day} ${hour}:${minute}:${second}`
}
```

在 Vue 组件中使用 TypeScript：

文件位置：`src/views/user/UserView.vue`

```vue
<template>
  <section class="p-4">
    <h1>{{ pageTitle }}</h1>
    <p>当前用户：{{ userInfo.nickname }}</p>
  </section>
</template>

<script setup lang="ts">
interface UserInfo {
  id: number
  username: string
  nickname: string
}

const pageTitle = '用户详情'

const userInfo: UserInfo = {
  id: 1,
  username: 'admin',
  nickname: '管理员',
}
</script>
```

Vite 当前文档还说明，TypeScript 转译使用 Oxc Transformer，HMR 更新可以保持较快反馈；并建议使用 `import type`、`export type` 这类类型专用导入导出语法，避免类型导入被错误地当作运行时代码处理。([vitejs](https://vite.dev/guide/features.html))

推荐写法：

```typescript
import type { RouteRecordRaw } from 'vue-router'

// 路由配置
export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/views/home/HomeView.vue'),
  },
]
```

不推荐将类型导入和运行时导入混在一起：

```typescript
import { type RouteRecordRaw, createRouter, createWebHistory } from 'vue-router'
```

上面的写法在语法上可用，但团队项目中更推荐将类型导入单独写成 `import type`，语义更清晰，也更利于构建工具处理。

### 类型检查与构建的关系

Vite 默认不做类型检查，所以即使代码存在 TypeScript 类型错误，开发服务器仍可能正常启动，甚至 `vite build` 本身也可能继续执行源码转译。官方文档建议在生产构建时额外运行 `tsc --noEmit`，开发阶段如果需要 IDE 之外的类型反馈，可以单独运行 `tsc --noEmit --watch`，或使用 `vite-plugin-checker` 在浏览器中报告类型错误。([vitejs](https://vite.dev/guide/features.html))

对于 Vue3 + TypeScript 项目，通常使用 `vue-tsc` 做类型检查：

```bash
# 安装 Vue TypeScript 类型检查工具
pnpm add -D vue-tsc
```

推荐脚本配置如下。

文件位置：`package.json`

```json
{
  "scripts": {
    "dev": "vite",
    "type-check": "vue-tsc --noEmit",
    "type-check:watch": "vue-tsc --noEmit --watch",
    "build": "vue-tsc --noEmit && vite build",
    "preview": "vite preview"
  }
}
```

构建流程建议如下：

```text
pnpm build
  ↓
vue-tsc --noEmit
  ↓
执行 TypeScript 和 Vue SFC 类型检查
  ↓
类型检查通过
  ↓
vite build
  ↓
生成生产构建产物
```

开发阶段可以单独开一个终端运行监听类型检查：

```bash
# 开发阶段持续监听类型错误
pnpm type-check:watch
```

如果团队希望类型错误直接显示在浏览器页面或终端中，可以使用检查类插件。例如：

```bash
# 安装开发期检查插件
pnpm add -D vite-plugin-checker
```

文件位置：`vite.config.ts`

```typescript
import vue from '@vitejs/plugin-vue'
import checker from 'vite-plugin-checker'
import { defineConfig } from 'vite'

// 开发阶段集成 TypeScript / Vue 类型检查
export default defineConfig({
  plugins: [
    vue(),

    checker({
      vueTsc: true,
    }),
  ],
})
```

需要注意，类型检查越严格，反馈链路越重。推荐将 Vite 的快速转译能力和独立类型检查能力分开使用：开发服务器负责快速反馈，`vue-tsc` 或 CI 流水线负责质量兜底。

### env.d.ts 类型声明

`env.d.ts` 用于声明 Vite 客户端类型和项目自定义全局类型。Vite 官方文档说明，Vite 默认类型主要用于 Node.js API；如果要为客户端代码补充 Vite 环境类型，可以在 `tsconfig.json` 的 `compilerOptions.types` 中加入 `vite/client`，也可以创建声明文件并使用三斜线指令 `/// <reference types="vite/client" />`。`vite/client` 会提供静态资源导入、`import.meta.env` 常量和 HMR API 的类型。([vitejs](https://vite.dev/guide/features.html))

基础声明文件如下。

文件位置：`env.d.ts`

```typescript
/// <reference types="vite/client" />
```

如果项目需要声明自定义环境变量，可以扩展 `ImportMetaEnv`：

文件位置：`env.d.ts`

```typescript
/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 应用标题 */
  readonly VITE_APP_TITLE: string

  /** 接口基础地址 */
  readonly VITE_API_BASE_URL: string

  /** 请求超时时间 */
  readonly VITE_REQUEST_TIMEOUT: string

  /** 是否启用 Mock */
  readonly VITE_USE_MOCK: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

如果项目引入了特殊静态资源类型，也可以在 `env.d.ts` 中补充模块声明：

```typescript
/// <reference types="vite/client" />

declare module '*.svg?component' {
  import type { DefineComponent } from 'vue'

  const component: DefineComponent
  export default component
}

declare module '*.md?raw' {
  const content: string
  export default content
}
```

在业务代码中读取环境变量时，就可以获得类型提示：

文件位置：`src/config/env.ts`

```typescript
// 统一封装环境变量，避免业务代码到处直接读取 import.meta.env
export const appEnv = {
  title: import.meta.env.VITE_APP_TITLE,
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
  requestTimeout: Number(import.meta.env.VITE_REQUEST_TIMEOUT || 10000),
  useMock: import.meta.env.VITE_USE_MOCK === 'true',
}
```

`env.d.ts` 一般放在项目根目录或 `src` 目录下。关键是确保它被 TypeScript 配置的 `include` 范围覆盖，否则声明不会生效。

### 路径别名类型同步

路径别名需要同时让 Vite 和 TypeScript 识别。仅配置 `vite.config.ts` 的 `resolve.alias`，可以让开发服务器和构建流程识别别名；但如果 TypeScript 配置中没有同步 `paths`，IDE、`vue-tsc` 或类型检查可能会报找不到模块。Vite 配置文档说明，`resolve.alias` 用于定义导入别名；文件系统路径别名应使用绝对路径。([vitejs](https://vite.dev/config/shared-options.html))

Vite 侧配置如下。

文件位置：`vite.config.ts`

```typescript
import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// 配置 Vite 模块路径别名
export default defineConfig({
  plugins: [vue()],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@views': fileURLToPath(new URL('./src/views', import.meta.url)),
      '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
      '@utils': fileURLToPath(new URL('./src/utils', import.meta.url)),
    },
  },
})
```

TypeScript 侧配置如下。

文件位置：`tsconfig.app.json`

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@views/*": ["src/views/*"],
      "@components/*": ["src/components/*"],
      "@utils/*": ["src/utils/*"]
    }
  },
  "include": [
    "env.d.ts",
    "src/**/*.ts",
    "src/**/*.tsx",
    "src/**/*.vue"
  ]
}
```

使用方式如下：

```typescript
import UserList from '@views/user/UserList.vue'
import BaseTable from '@components/BaseTable.vue'
import { request } from '@utils/request'
```

当前 Vite 配置中也提供了 `resolve.tsconfigPaths` 选项，可以让 Vite 使用 `tsconfig.json` 中的 `paths` 解析导入；官方配置文档说明该选项默认值为 `false`，开启后会使用 TypeScript 的 `paths` 配置进行导入解析。([vitejs](https://vite.dev/config/shared-options.html))

使用方式如下：

文件位置：`vite.config.ts`

```typescript
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// 开启 tsconfig paths 解析
export default defineConfig({
  plugins: [vue()],

  resolve: {
    // 使用 tsconfig.json 中的 paths 配置解析导入路径
    tsconfigPaths: true,
  },
})
```

如果团队使用较新的 Vite 版本，并且希望减少重复配置，可以采用 `resolve.tsconfigPaths: true`；如果项目需要兼容旧版本 Vite 或希望别名更显式，可以继续手动维护 `resolve.alias` 和 `tsconfig.app.json` 的 `paths`。无论采用哪种方式，都要保证 Vite 运行时解析、TypeScript 类型检查和 IDE 路径提示三者一致。



## 构建配置

构建配置用于控制 Vite 在生产构建阶段如何生成最终部署产物。开发阶段主要关注启动速度和热更新，构建阶段则关注浏览器兼容性、资源体积、文件目录、缓存命中、Source Map、代码压缩和部署适配。Vite 官方构建配置文档说明，除特殊说明外，`build` 下的配置项只作用于构建阶段。([vitejs](https://vite.dev/config/build-options))

### build 基础配置

`build` 是 Vite 生产构建的核心配置节点，常用于配置输出目录、静态资源目录、Source Map、压缩方式、目标浏览器、资源内联阈值、CSS 拆分和构建报告等能力。

基础配置如下。

文件位置：`vite.config.ts`

```typescript
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// 配置 Vite 生产构建基础参数
export default defineConfig({
  plugins: [vue()],

  build: {
    // 构建输出目录
    outDir: 'dist',

    // 构建产物中的静态资源目录
    assetsDir: 'assets',

    // 生产环境默认不生成 sourcemap，避免暴露源码结构
    sourcemap: false,

    // 开启代码压缩
    minify: true,

    // 构建前清空输出目录
    emptyOutDir: true,

    // 小于该阈值的静态资源会被内联为 base64
    assetsInlineLimit: 4096,

    // chunk 超过指定体积时输出警告，单位是 KB
    chunkSizeWarningLimit: 1000,
  },
})
```

常用构建配置项如下：

| 配置项                  | 说明                   | 常用值                           |
| ----------------------- | ---------------------- | -------------------------------- |
| `outDir`                | 构建输出目录           | `dist`、`dist-test`、`dist-prod` |
| `assetsDir`             | 静态资源输出子目录     | `assets`、`static`               |
| `sourcemap`             | 是否生成 Source Map    | `false`、`true`、`hidden`        |
| `minify`                | 是否压缩产物           | `true`、`false`、`'terser'`      |
| `emptyOutDir`           | 构建前是否清空输出目录 | `true`                           |
| `assetsInlineLimit`     | 小资源内联阈值         | `4096`                           |
| `chunkSizeWarningLimit` | chunk 体积警告阈值     | `500`、`1000`、`1500`            |

构建命令通常配置在 `package.json` 中：

文件位置：`package.json`

```json
{
  "scripts": {
    "build": "vue-tsc --noEmit && vite build",
    "build:test": "vue-tsc --noEmit && vite build --mode test",
    "build:staging": "vue-tsc --noEmit && vite build --mode staging",
    "build:prod": "vue-tsc --noEmit && vite build --mode production"
  }
}
```

对于 TypeScript Vue3 项目，建议构建前先执行 `vue-tsc --noEmit`，再执行 `vite build`。这样可以避免只完成代码转译，却把类型错误带入生产产物。

### outDir 输出目录

`outDir` 用于指定生产构建产物的输出目录，默认值是 `dist`，该路径相对于项目根目录。Vite 官方文档说明，`build.outDir` 用于指定构建输出目录。([vitejs](https://vite.dev/config/build-options))

基础配置如下。

文件位置：`vite.config.ts`

```typescript
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// 配置构建输出目录
export default defineConfig({
  plugins: [vue()],

  build: {
    outDir: 'dist',
  },
})
```

执行构建后，目录通常如下：

```text
dist
├── assets
│   ├── index-Ca1A2b3c.js
│   ├── index-Bd4E5f6g.css
│   └── logo-Dh7I8j9k.png
├── favicon.ico
└── index.html
```

如果不同环境需要输出到不同目录，可以根据 `mode` 动态配置：

文件位置：`vite.config.ts`

```typescript
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// 根据构建模式输出到不同目录
export default defineConfig(({ mode }) => {
  return {
    plugins: [vue()],

    build: {
      outDir: `dist-${mode}`,
      emptyOutDir: true,
    },
  }
})
```

执行不同命令后输出目录如下：

```text
pnpm build:test
  -> dist-test

pnpm build:staging
  -> dist-staging

pnpm build:prod
  -> dist-production
```

实际企业项目中，更常见的做法是统一输出到 `dist`，再由 CI/CD 根据环境把产物上传到不同服务器、对象存储或容器镜像中。只有在本地需要同时保留多个环境构建结果时，才建议按环境拆分 `outDir`。

### assetsDir 静态资源目录

`assetsDir` 用于指定构建产物中静态资源的输出子目录，默认值是 `assets`。该目录相对于 `build.outDir`，不适用于库模式。Vite 官方文档说明，`build.assetsDir` 会指定生成资源嵌套到 `outDir` 下的哪个目录。([vitejs](https://vite.dev/config/build-options))

基础配置如下。

文件位置：`vite.config.ts`

```typescript
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// 配置构建后的静态资源目录
export default defineConfig({
  plugins: [vue()],

  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
})
```

构建后的目录示例：

```text
dist
├── assets
│   ├── index-Ca1A2b3c.js
│   ├── index-Bd4E5f6g.css
│   ├── user-Dh7I8j9k.js
│   └── logo-Kl0M1n2o.png
└── index.html
```

如果团队部署规范要求静态资源统一放到 `static` 目录，可以这样配置：

```typescript
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// 将构建后的静态资源输出到 static 目录
export default defineConfig({
  plugins: [vue()],

  build: {
    outDir: 'dist',
    assetsDir: 'static',
  },
})
```

构建后的目录会变为：

```text
dist
├── static
│   ├── index-Ca1A2b3c.js
│   ├── index-Bd4E5f6g.css
│   └── logo-Kl0M1n2o.png
└── index.html
```

`assetsDir` 只控制构建产物中的资源目录，不会改变源码中的资源存放位置。源码仍建议按业务放在 `src/assets`、`src/styles`、`src/views` 等目录中。

### sourcemap 配置

`sourcemap` 用于控制生产构建时是否生成 Source Map。Source Map 可以帮助定位线上报错对应的源码位置，但也可能暴露源码结构、变量名和业务逻辑。Vite 官方文档说明，`build.sourcemap` 支持 `boolean`、`'inline'`、`'hidden'`，默认值是 `false`；`true` 会生成单独 sourcemap 文件，`inline` 会把 sourcemap 以内联 data URI 形式写入产物，`hidden` 会生成 sourcemap 文件但不在产物中写入对应注释。([vitejs](https://vite.dev/config/build-options))

常见配置如下。

文件位置：`vite.config.ts`

```typescript
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// 根据环境模式控制 sourcemap
export default defineConfig(({ mode }) => {
  return {
    plugins: [vue()],

    build: {
      // 测试和预发环境生成 sourcemap，生产环境关闭
      sourcemap: mode === 'test' || mode === 'staging',
    },
  }
})
```

不同取值说明：

| 配置       | 说明                                       | 适用场景                       |
| ---------- | ------------------------------------------ | ------------------------------ |
| `false`    | 不生成 Source Map                          | 生产环境默认推荐               |
| `true`     | 生成独立 `.map` 文件，并在产物中关联       | 测试环境、预发环境             |
| `'inline'` | Source Map 内联到产物文件中                | 本地调试，不建议线上使用       |
| `'hidden'` | 生成 `.map` 文件，但不在产物中添加引用注释 | 线上错误监控平台上传 sourcemap |

如果项目接入 Sentry、前端监控平台或私有错误追踪系统，可以使用 `hidden`，构建后把 `.map` 文件上传到监控平台，但不要直接对公网暴露。

```typescript
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// 生产环境生成隐藏 sourcemap，便于上传到错误监控平台
export default defineConfig({
  plugins: [vue()],

  build: {
    sourcemap: 'hidden',
  },
})
```

### minify 压缩配置

`minify` 用于控制生产构建时是否压缩 JavaScript 产物。当前 Vite 官方文档中，`build.minify` 支持 `boolean | 'oxc' | 'terser' | 'esbuild'`，客户端构建默认使用 `'oxc'`，SSR 构建默认是 `false`；同时，`'esbuild'` 压缩方式已被标记为将来移除的废弃选项。([vitejs](https://vite.dev/config/build-options)) 如果项目仍使用 Vite 6，默认压缩器是 `esbuild`，并且 `minify` 支持 `false | 'terser' | 'esbuild'`。([vitejs](https://v6.vite.dev/config/build-options))

基础配置如下。

文件位置：`vite.config.ts`

```typescript
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// 配置生产构建压缩策略
export default defineConfig({
  plugins: [vue()],

  build: {
    // 使用默认压缩策略
    minify: true,
  },
})
```

如果需要关闭压缩，通常只建议在排查构建问题时临时使用：

```typescript
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// 临时关闭构建压缩，便于排查产物问题
export default defineConfig({
  plugins: [vue()],

  build: {
    minify: false,
  },
})
```

如果项目需要更细粒度的压缩控制，可以使用 `terser`。使用前需要安装依赖：

```bash
# 安装 terser，用于自定义压缩配置
pnpm add -D terser
```

配置示例：

文件位置：`vite.config.ts`

```typescript
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// 使用 terser 自定义生产压缩策略
export default defineConfig({
  plugins: [vue()],

  build: {
    minify: 'terser',

    terserOptions: {
      compress: {
        // 生产构建时移除 console
        drop_console: true,

        // 生产构建时移除 debugger
        drop_debugger: true,
      },
      format: {
        // 不保留注释
        comments: false,
      },
    },
  },
})
```

一般后台管理系统和普通业务前端项目优先使用默认压缩策略。只有在需要移除 `console`、保留特定注释、兼容特殊运行环境或对压缩产物有明确要求时，再切换到 `terser`。

## Rollup 配置扩展

Rollup 配置扩展用于在 Vite 默认构建能力之外，进一步控制入口、分包、外部依赖、输出文件名、全局变量映射等底层打包行为。需要注意版本差异：在 Vite 6 文档中，`build.rollupOptions` 用于直接自定义底层 Rollup 打包配置；而当前 Vite 8 文档中，`build.rollupOptions` 已标记为 `build.rolldownOptions` 的废弃别名，推荐使用 `build.rolldownOptions`。下面内容按你文档标题继续使用 `build.rollupOptions` 说明，同时保留迁移提示。([vitejs](https://v6.vite.dev/config/build-options))

### build.rollupOptions 使用

`build.rollupOptions` 常用于扩展构建入口、输出规则、外部依赖和分包策略。在普通 Vue3 单页应用中，多数项目不需要大量修改该配置；只有在多页面应用、微前端、CDN 外链依赖、构建产物命名规范或性能优化场景中，才需要显式配置。

基础配置如下。

文件位置：`vite.config.ts`

```typescript
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// 扩展底层构建配置
export default defineConfig({
  plugins: [vue()],

  build: {
    rollupOptions: {
      output: {
        // 入口 JS 文件命名规则
        entryFileNames: 'assets/js/[name]-[hash].js',

        // 动态导入 chunk 文件命名规则
        chunkFileNames: 'assets/js/[name]-[hash].js',

        // 静态资源文件命名规则
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
  },
})
```

如果使用 Vite 8 或后续版本，并且项目已经切换到底层 Rolldown 配置，推荐写成：

```typescript
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// Vite 8 推荐使用 rolldownOptions 扩展底层构建配置
export default defineConfig({
  plugins: [vue()],

  build: {
    rolldownOptions: {
      output: {
        entryFileNames: 'assets/js/[name]-[hash].js',
        chunkFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
  },
})
```

如果你的项目当前使用的是 Vite 5、Vite 6 或 Vite 7，继续使用 `build.rollupOptions` 更符合已有生态文档和配置习惯；如果新项目使用 Vite 8，则应优先参考 `build.rolldownOptions`。

### manualChunks 分包配置

`manualChunks` 用于手动控制构建产物中的 chunk 拆分策略。合理分包可以提升浏览器缓存命中率，避免业务代码变更导致大型第三方依赖 chunk 频繁失效。对于 Vue3 项目，常见做法是把 Vue 生态、UI 组件库、图表库、工具库拆成相对稳定的独立 chunk。

基础分包配置如下。

文件位置：`vite.config.ts`

```typescript
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// 配置手动分包策略
export default defineConfig({
  plugins: [vue()],

  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vue 生态相关依赖
          vue: ['vue', 'vue-router', 'pinia'],

          // UI 组件库
          elementPlus: ['element-plus'],

          // 请求和工具库
          vendor: ['axios', 'dayjs'],
        },
      },
    },
  },
})
```

也可以按依赖路径动态分包：

```typescript
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// 根据 node_modules 路径动态拆分第三方依赖
export default defineConfig({
  plugins: [vue()],

  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('element-plus')) {
              return 'element-plus'
            }

            if (id.includes('echarts')) {
              return 'echarts'
            }

            if (id.includes('vue') || id.includes('pinia') || id.includes('vue-router')) {
              return 'vue'
            }

            return 'vendor'
          }
        },
      },
    },
  },
})
```

分包不是越细越好。过度拆分会增加请求数量，过度合并会降低缓存命中率。常见建议是：稳定且体积较大的第三方库单独拆分，业务模块依赖路由懒加载自然拆分，普通小工具库不必强行拆太细。

配合 Vue Router 懒加载，可以进一步拆分业务页面：

文件位置：`src/router/index.ts`

```typescript
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

// 路由懒加载会生成独立业务 chunk
const routes: RouteRecordRaw[] = [
  {
    path: '/dashboard',
    component: () => import('@/views/dashboard/DashboardView.vue'),
  },
  {
    path: '/user',
    component: () => import('@/views/user/UserList.vue'),
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
```

### external 外部依赖配置

`external` 用于将某些依赖排除在构建产物之外。被 external 的依赖不会打包进最终 JS，需要由运行环境或外部 CDN 提供。该配置常见于组件库、SDK、微前端、低代码平台或有统一 CDN 资源管理的项目。

普通业务系统一般不建议随意 external 核心依赖。因为一旦将 `vue`、`vue-router`、`pinia` 等依赖外置，就必须保证生产页面中提前加载对应全局变量，否则应用会直接运行失败。

示例：将 Vue 外置并通过 CDN 提供。

文件位置：`vite.config.ts`

```typescript
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// 将 vue 外置，不打包进构建产物
export default defineConfig({
  plugins: [vue()],

  build: {
    rollupOptions: {
      external: ['vue'],

      output: {
        globals: {
          // UMD/IIFE 场景下将 vue 映射到全局变量 Vue
          vue: 'Vue',
        },
      },
    },
  },
})
```

同时需要在 `index.html` 中引入外部 Vue 文件：

文件位置：`index.html`

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <title>Vite Vue3 TypeScript</title>

    <!-- 生产环境需要自行保证外部依赖可访问 -->
    <script src="https://unpkg.com/vue@3/dist/vue.global.prod.js"></script>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

更常见的业务项目做法是不 external Vue，而是让 Vite 正常打包依赖。只有当团队有统一 CDN、资源版本锁定、失败降级和灰度策略时，才建议外置依赖。

组件库项目中 external 更常见，例如不把 `vue` 打入组件库产物：

```typescript
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// 组件库构建时外置 vue
export default defineConfig({
  plugins: [vue()],

  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'AtengUI',
      fileName: 'ateng-ui',
    },

    rollupOptions: {
      external: ['vue'],

      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
})
```

### output 输出配置

`output` 用于控制构建产物的输出格式、文件命名、全局变量、分包策略等。对于普通 Vue3 SPA 项目，最常用的是配置 `entryFileNames`、`chunkFileNames`、`assetFileNames` 和 `manualChunks`。

推荐输出配置如下。

文件位置：`vite.config.ts`

```typescript
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// 配置构建产物输出规则
export default defineConfig({
  plugins: [vue()],

  build: {
    outDir: 'dist',
    assetsDir: 'assets',

    rollupOptions: {
      output: {
        // 入口文件输出到 assets/js
        entryFileNames: 'assets/js/[name]-[hash].js',

        // 异步 chunk 输出到 assets/js
        chunkFileNames: 'assets/js/[name]-[hash].js',

        // 资源文件按扩展名输出到不同目录
        assetFileNames: (assetInfo) => {
          const name = assetInfo.names?.[0] || assetInfo.name || ''

          if (/\.(css)$/.test(name)) {
            return 'assets/css/[name]-[hash][extname]'
          }

          if (/\.(png|jpe?g|gif|svg|webp|avif)$/.test(name)) {
            return 'assets/images/[name]-[hash][extname]'
          }

          if (/\.(woff2?|ttf|otf|eot)$/.test(name)) {
            return 'assets/fonts/[name]-[hash][extname]'
          }

          return 'assets/[ext]/[name]-[hash][extname]'
        },
      },
    },
  },
})
```

构建后目录可能如下：

```text
dist
├── assets
│   ├── css
│   │   └── index-Bd4E5f6g.css
│   ├── fonts
│   │   └── iconfont-Hi7J8k9l.woff2
│   ├── images
│   │   └── logo-Kl0M1n2o.png
│   └── js
│       ├── index-Ca1A2b3c.js
│       ├── vue-Qr4S5t6u.js
│       └── vendor-Xy7Z8a9b.js
└── index.html
```

需要注意，输出命名规则不能只追求目录美观。生产部署中更重要的是文件带 hash、缓存策略正确、静态服务器能正确访问、`base` 路径配置正确、CDN 回源规则正确。

## 多环境构建

多环境构建用于针对不同部署环境生成不同配置的前端产物，例如开发环境、测试环境、预发环境和生产环境。Vite 通过 `mode` 和 `.env.[mode]` 文件实现环境区分。官方文档说明，默认情况下，`dev` 命令运行在 `development` 模式，`build` 命令运行在 `production` 模式，也可以通过 `--mode` 参数覆盖默认模式；Vite 会加载 `.env`、`.env.local`、`.env.[mode]`、`.env.[mode].local` 等文件，并且模式专属文件优先级高于通用文件。([vitejs](https://vite.dev/guide/env-and-mode))

### development 环境

`development` 环境用于本地开发。它通常连接本地后端、开发环境网关或 Mock 服务，打开调试日志，开启 sourcemap，并保留较高的开发反馈速度。

环境变量文件如下。

文件位置：`.env.development`

```properties
# 应用标题
VITE_APP_TITLE=后台管理系统-开发环境

# 接口代理前缀
VITE_API_BASE_URL=/api

# 后端代理目标地址，只在 vite.config.ts 中使用
VITE_API_PROXY_TARGET=http://localhost:8080

# 是否开启 Mock
VITE_USE_MOCK=true

# 是否显示调试信息
VITE_SHOW_DEBUG=true
```

启动脚本如下。

文件位置：`package.json`

```json
{
  "scripts": {
    "dev": "vite --mode development"
  }
}
```

开发环境 Vite 配置示例：

文件位置：`vite.config.ts`

```typescript
import vue from '@vitejs/plugin-vue'
import { defineConfig, loadEnv } from 'vite'

// 根据 development 环境变量配置开发服务器
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [vue()],

    server: {
      port: 5173,
      open: true,
      proxy: {
        [env.VITE_API_BASE_URL || '/api']: {
          target: env.VITE_API_PROXY_TARGET || 'http://localhost:8080',
          changeOrigin: true,
          rewrite: (path) => path.replace(new RegExp(`^${env.VITE_API_BASE_URL || '/api'}`), ''),
        },
      },
    },

    build: {
      sourcemap: true,
      minify: false,
    },
  }
})
```

虽然 `development` 环境也可以执行构建，但一般只用于本地调试，不作为正式发布产物。

### test 环境

`test` 环境用于测试人员、自动化测试或联调环境。它通常连接测试后端接口，保留 sourcemap，开启部分调试能力，但构建流程应尽量接近生产环境。

环境变量文件如下。

文件位置：`.env.test`

```properties
# 应用标题
VITE_APP_TITLE=后台管理系统-测试环境

# 测试环境接口地址
VITE_API_BASE_URL=https://test-api.example.com

# 是否开启 Mock
VITE_USE_MOCK=false

# 是否显示调试信息
VITE_SHOW_DEBUG=true
```

构建脚本如下。

文件位置：`package.json`

```json
{
  "scripts": {
    "build:test": "vue-tsc --noEmit && vite build --mode test"
  }
}
```

测试环境构建配置：

文件位置：`vite.config.ts`

```typescript
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// 根据 mode 控制测试环境构建策略
export default defineConfig(({ mode }) => {
  return {
    plugins: [vue()],

    build: {
      outDir: mode === 'test' ? 'dist-test' : 'dist',
      sourcemap: mode === 'test',
      minify: mode !== 'development',
    },
  }
})
```

测试环境建议保留 Source Map，便于测试阶段快速定位问题。接口地址一般直接指向测试网关或测试后端域名，不依赖 Vite 的开发代理。

### staging 环境

`staging` 环境通常表示预发布环境，也可以称为 UAT、灰度环境或准生产环境。它应尽量接近生产环境，包括接口地址、静态资源路径、压缩策略、权限配置、监控配置和部署方式。与生产环境的区别通常只在接口域名、应用标题、监控环境标识和灰度开关。

环境变量文件如下。

文件位置：`.env.staging`

```properties
# 应用标题
VITE_APP_TITLE=后台管理系统-预发布环境

# 预发布接口地址
VITE_API_BASE_URL=https://staging-api.example.com

# 静态资源基础路径
VITE_PUBLIC_BASE=/admin/

# 是否开启 Mock
VITE_USE_MOCK=false

# 是否显示调试信息
VITE_SHOW_DEBUG=false
```

构建脚本如下。

文件位置：`package.json`

```json
{
  "scripts": {
    "build:staging": "vue-tsc --noEmit && vite build --mode staging"
  }
}
```

预发布环境配置示例：

文件位置：`vite.config.ts`

```typescript
import vue from '@vitejs/plugin-vue'
import { defineConfig, loadEnv } from 'vite'

// 根据 staging 环境变量生成预发布构建配置
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [vue()],

    // 部署到非域名根路径时，需要配置 base
    base: env.VITE_PUBLIC_BASE || '/',

    build: {
      outDir: 'dist-staging',
      assetsDir: 'assets',

      // 预发布环境可以生成 sourcemap，便于上线前排查问题
      sourcemap: true,

      // 预发布环境保持与生产一致的压缩策略
      minify: true,
    },
  }
})
```

预发布环境的核心要求是“尽可能接近生产”。如果测试环境存在 Mock、调试按钮、宽松权限或特殊代理，预发布环境应尽量关闭这些开发便利功能，避免发布前验证失真。

### production 环境

`production` 环境用于正式线上发布。它应关闭 Mock 和调试信息，使用正式接口地址，开启压缩，谨慎处理 sourcemap，并确保 `base`、资源路径、缓存策略和部署目录与线上环境一致。Vite 官方文档明确说明，`VITE_*` 变量会在构建时打入客户端源码，不应包含 API key 等敏感信息。([vitejs](https://vite.dev/guide/env-and-mode))

生产环境变量文件如下。

文件位置：`.env.production`

```properties
# 应用标题
VITE_APP_TITLE=后台管理系统

# 生产接口地址
VITE_API_BASE_URL=https://api.example.com

# 静态资源基础路径
VITE_PUBLIC_BASE=/admin/

# 是否开启 Mock
VITE_USE_MOCK=false

# 是否显示调试信息
VITE_SHOW_DEBUG=false
```

构建脚本如下。

文件位置：`package.json`

```json
{
  "scripts": {
    "build:prod": "vue-tsc --noEmit && vite build --mode production",
    "preview": "vite preview"
  }
}
```

生产环境 Vite 配置如下。

文件位置：`vite.config.ts`

```typescript
import vue from '@vitejs/plugin-vue'
import { defineConfig, loadEnv } from 'vite'

// 生产环境构建配置
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [vue()],

    base: env.VITE_PUBLIC_BASE || '/',

    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      emptyOutDir: true,

      // 生产环境默认关闭 sourcemap
      sourcemap: false,

      // 生产环境开启压缩
      minify: true,

      rollupOptions: {
        output: {
          manualChunks: {
            vue: ['vue', 'vue-router', 'pinia'],
            vendor: ['axios'],
          },
        },
      },
    },
  }
})
```

构建完成后可以先本地预览：

```bash
# 生成生产构建产物
pnpm build:prod

# 本地预览构建结果
pnpm preview
```

多环境构建的推荐管理方式如下：

| 环境        | 命令                 | 环境文件           | 典型用途         |
| ----------- | -------------------- | ------------------ | ---------------- |
| development | `pnpm dev`           | `.env.development` | 本地开发         |
| test        | `pnpm build:test`    | `.env.test`        | 测试部署         |
| staging     | `pnpm build:staging` | `.env.staging`     | 预发布、灰度验证 |
| production  | `pnpm build:prod`    | `.env.production`  | 正式生产发布     |

需要特别注意，`mode` 和 `NODE_ENV` 不是同一个概念。Vite 官方文档说明，`vite build --mode staging` 会让 `import.meta.env.MODE` 等于 `staging`，但构建命令默认仍是生产构建语义；如果要判断当前业务环境，应优先读取 `import.meta.env.MODE` 或自定义 `VITE_APP_ENV`，不要只依赖 `NODE_ENV`。([vitejs](https://vite.dev/guide/env-and-mode))



## 性能优化

性能优化用于提升 Vite 项目的开发体验和生产访问体验。开发阶段重点关注启动速度、页面首次加载速度、HMR 响应速度和依赖预构建稳定性；生产阶段重点关注构建体积、代码分包、资源压缩、缓存命中率和构建产物可分析性。Vite 官方性能文档也指出，随着项目规模增长，性能问题可能体现在开发服务器启动慢、页面加载慢、构建慢等方面。([vitejs](https://vite.dev/guide/performance.html))

### 依赖预构建优化

依赖预构建优化主要用于提升开发阶段的依赖加载速度和依赖格式兼容性。Vite 会在开发阶段对第三方依赖进行预构建，主要目标是将 CommonJS / UMD 依赖转换为 ESM，并把内部模块较多的依赖合并成较少的模块，减少浏览器请求数量。([vitejs](https://vite.dev/guide/dep-pre-bundling.html))

在大多数项目中，Vite 默认预构建行为已经足够，不需要手动配置。只有在启动后频繁出现重新预构建、依赖无法被自动扫描发现、monorepo 本地包未被正确处理、第三方库深层导入过多等场景中，才需要配置 `optimizeDeps`。

文件位置：`vite.config.ts`

```typescript
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// 配置开发阶段依赖预构建，减少启动后反复重新优化依赖
export default defineConfig({
  plugins: [vue()],

  optimizeDeps: {
    include: [
      // 常用 Vue 生态依赖
      'vue',
      'vue-router',
      'pinia',

      // 常用请求库
      'axios',

      // 如果项目中使用 Element Plus，可显式纳入预构建
      'element-plus',
    ],

    exclude: [
      // 示例：本地调试源码包时，可临时排除某些依赖
    ],
  },
})
```

如果项目中存在大量深层导入，例如组件库、图标库、工具库中按路径导入，可以将常用入口显式加入 `include`，减少开发过程中反复触发依赖扫描和预构建的概率。

文件位置：`vite.config.ts`

```typescript
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// 对深层导入较多的依赖进行预构建优化
export default defineConfig({
  plugins: [vue()],

  optimizeDeps: {
    include: [
      'lodash-es',
      'dayjs',
      'echarts/core',
      'echarts/charts',
      'echarts/components',
      'echarts/renderers',
    ],
  },
})
```

当依赖升级后仍然出现旧代码、模块解析异常或浏览器缓存异常时，可以强制重新预构建：

```bash
# 强制 Vite 忽略已有预构建缓存并重新优化依赖
pnpm dev -- --force
```

也可以删除 Vite 缓存目录后重新启动：

```bash
# 删除 Vite 依赖预构建缓存
rm -rf node_modules/.vite

# 重新启动开发服务器
pnpm dev
```

依赖预构建优化不应过度配置。推荐先观察实际启动日志和浏览器请求，再针对明显问题配置 `include` 或 `exclude`。配置过多反而可能增加维护成本，并掩盖依赖本身的兼容性问题。

### 代码分包优化

代码分包优化用于减少首屏加载体积，提高浏览器缓存命中率。对于 Vue3 单页应用，常见分包策略包括路由懒加载、第三方依赖拆分、图表库拆分、组件库拆分和业务模块拆分。

路由懒加载是最基础、收益最稳定的分包方式。页面组件通过动态 `import()` 引入后，构建时会被拆成独立 chunk，用户访问对应路由时再加载对应页面代码。

文件位置：`src/router/index.ts`

```typescript
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

// 使用路由懒加载拆分业务页面代码
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/dashboard',
    component: () => import('@/views/dashboard/DashboardView.vue'),
  },
  {
    path: '/user',
    component: () => import('@/views/user/UserList.vue'),
  },
  {
    path: '/system/menu',
    component: () => import('@/views/system/menu/MenuList.vue'),
  },
]

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})
```

对于大型后台项目，可以通过 `manualChunks` 将稳定依赖拆分出来。Vite 构建配置中的静态资源、Source Map、CSS 拆分、压缩和 chunk 警告阈值都可以通过 `build` 相关选项控制；其中 `build.chunkSizeWarningLimit` 用于设置 chunk 体积警告阈值。([vitejs](https://vite.dev/config/build-options.html))

文件位置：`vite.config.ts`

```typescript
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// 配置生产构建分包策略，提升浏览器缓存命中率
export default defineConfig({
  plugins: [vue()],

  build: {
    chunkSizeWarningLimit: 1000,

    rollupOptions: {
      output: {
        manualChunks: {
          // Vue 生态依赖相对稳定，单独拆分
          vue: ['vue', 'vue-router', 'pinia'],

          // UI 组件库体积通常较大，单独拆分
          elementPlus: ['element-plus'],

          // 图表库体积较大，建议单独拆分
          echarts: ['echarts'],

          // 通用第三方依赖
          vendor: ['axios', 'dayjs'],
        },
      },
    },
  },
})
```

也可以根据模块路径动态拆分：

文件位置：`vite.config.ts`

```typescript
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// 根据依赖路径动态拆分 node_modules 中的第三方库
export default defineConfig({
  plugins: [vue()],

  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            return
          }

          if (id.includes('element-plus')) {
            return 'element-plus'
          }

          if (id.includes('echarts')) {
            return 'echarts'
          }

          if (id.includes('vue') || id.includes('pinia') || id.includes('vue-router')) {
            return 'vue'
          }

          return 'vendor'
        },
      },
    },
  },
})
```

代码分包需要控制粒度。拆得太粗会导致首屏资源过大，拆得太细会增加请求数量和调度成本。通常建议：业务页面靠路由懒加载拆分，稳定且体积大的第三方库单独拆分，小型工具库合入 `vendor` 即可。

### 资源压缩优化

资源压缩优化用于减少生产构建产物体积，提高网络传输效率。Vite 生产构建默认会进行压缩；当前 Vite 构建配置中，`build.minify` 可用于控制 JS 压缩方式，`build.cssMinify` 可单独控制 CSS 压缩方式，`build.sourcemap` 可控制是否生成生产 Source Map。([vitejs](https://vite.dev/config/build-options.html))

基础压缩配置如下。

文件位置：`vite.config.ts`

```typescript
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// 配置生产环境资源压缩策略
export default defineConfig(({ mode }) => {
  const isProd = mode === 'production'

  return {
    plugins: [vue()],

    build: {
      // 生产环境开启压缩，开发调试构建可关闭
      minify: isProd,

      // 生产环境关闭 sourcemap，避免暴露源码结构
      sourcemap: !isProd,

      // 小于 4 KiB 的资源内联为 base64，减少额外请求
      assetsInlineLimit: 4096,
    },
  }
})
```

`assetsInlineLimit` 用于控制小资源内联阈值，默认值是 `4096`，即小于 4 KiB 的导入资源会被内联为 base64 URL，以减少额外 HTTP 请求；设置为 `0` 可以关闭资源内联。([vitejs](https://vite.dev/config/build-options.html))

如果需要更细粒度地移除生产环境 `console` 和 `debugger`，可以使用 `terser`。

先安装依赖：

```bash
# 安装 terser，用于自定义生产压缩规则
pnpm add -D terser
```

配置自定义压缩规则：

文件位置：`vite.config.ts`

```typescript
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// 使用 terser 移除生产环境 console 和 debugger
export default defineConfig({
  plugins: [vue()],

  build: {
    minify: 'terser',

    terserOptions: {
      compress: {
        // 生产构建移除 console
        drop_console: true,

        // 生产构建移除 debugger
        drop_debugger: true,
      },
      format: {
        // 不保留注释
        comments: false,
      },
    },
  },
})
```

如果需要生成 gzip 或 brotli 预压缩文件，一般使用 Nginx 在线压缩，或者通过构建插件生成 `.gz`、`.br` 文件。对于普通后台系统，优先在 Nginx 层开启 gzip；对于高访问量静态站点或 CDN 部署，可以在构建阶段生成预压缩资源并由服务器按请求头返回对应版本。

### 构建产物分析

构建产物分析用于查看最终包体积构成，定位大依赖、大页面、大资源和重复打包问题。常见分析目标包括：哪个依赖体积最大、是否把图表库完整打入首屏、是否存在重复依赖、业务 chunk 是否过大、图片或字体资源是否异常。

可以使用 `rollup-plugin-visualizer` 分析构建产物。

安装插件：

```bash
# 安装构建产物可视化分析插件
pnpm add -D rollup-plugin-visualizer
```

配置分析插件：

文件位置：`vite.config.ts`

```typescript
import vue from '@vitejs/plugin-vue'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'

// 根据环境变量控制是否生成构建产物分析报告
export default defineConfig(({ mode }) => {
  const enableAnalyze = mode === 'analyze'

  return {
    plugins: [
      vue(),

      enableAnalyze &&
        visualizer({
          // 分析报告输出路径
          filename: 'dist/stats.html',

          // 构建完成后自动打开报告
          open: true,

          // 显示 gzip 后体积
          gzipSize: true,

          // 显示 brotli 后体积
          brotliSize: true,
        }),
    ],
  }
})
```

补充分析命令：

文件位置：`package.json`

```json
{
  "scripts": {
    "build": "vue-tsc --noEmit && vite build",
    "build:analyze": "vue-tsc --noEmit && vite build --mode analyze"
  }
}
```

执行分析：

```bash
# 构建并生成产物体积分析报告
pnpm build:analyze
```

分析报告中重点关注以下内容：

| 检查项           | 说明               | 优化方向                           |
| ---------------- | ------------------ | ---------------------------------- |
| `vue` chunk 过大 | Vue 生态包体积异常 | 检查是否误打入无关依赖             |
| `vendor` 过大    | 第三方库过多       | 拆分图表库、编辑器、富文本等大依赖 |
| 页面 chunk 过大  | 单页面依赖太重     | 拆分组件、延迟加载非首屏模块       |
| 图片字体过大     | 静态资源未压缩     | 使用 webp、woff2、图片压缩         |
| 重复依赖         | 多版本依赖并存     | 统一依赖版本，检查 lockfile        |

构建产物分析不应只看单个文件大小，还要结合首屏路由、缓存策略、加载顺序和用户实际访问路径判断。后台系统通常更关注首屏登录页、首页看板、常用列表页和图表页面的加载体积。

## 预览与部署

预览与部署用于说明构建完成后如何验证和发布 Vite 静态产物。Vite 项目默认构建输出目录是 `dist`，构建完成后可以将 `dist` 部署到任意静态资源服务器、Nginx、对象存储、CDN、Netlify、Vercel、Cloudflare Pages 等平台。Vite 官方静态部署文档说明，默认构建输出会放在 `dist`，并且可以部署到任意静态站点平台。([vitejs](https://vite.dev/guide/static-deploy.html))

### vite preview 使用

`vite preview` 用于在本地启动一个静态 Web 服务器，预览生产构建后的 `dist` 目录。它不是开发服务器，也不是生产服务器，只用于本地检查构建产物是否能正常运行。Vite 官方文档明确说明，`vite preview` 只用于本地预览构建结果，不应作为生产服务器使用；默认会在本地启动静态服务器服务 `dist` 文件。([vitejs](https://vite.dev/guide/static-deploy.html))

常用脚本如下。

文件位置：`package.json`

```json
{
  "scripts": {
    "build": "vue-tsc --noEmit && vite build",
    "preview": "vite preview",
    "preview:host": "vite preview --host 0.0.0.0 --port 4173"
  }
}
```

本地预览流程如下：

```bash
# 先生成生产构建产物
pnpm build

# 再本地预览 dist 目录
pnpm preview
```

指定预览端口：

```bash
# 使用指定端口预览构建结果
pnpm preview -- --port 8080
```

预览阶段重点检查：

| 检查项           | 说明                                     |
| ---------------- | ---------------------------------------- |
| 页面是否正常打开 | 确认 `index.html`、JS、CSS 加载正常      |
| 路由刷新是否正常 | history 模式下刷新子路由是否 404         |
| 静态资源是否正常 | 图片、字体、图标、下载模板是否能访问     |
| 接口地址是否正确 | 是否仍然错误访问本地代理地址             |
| 环境变量是否正确 | 标题、接口地址、开关配置是否符合目标环境 |
| 控制台是否报错   | 检查资源 404、跨域、运行时报错           |

`vite preview` 不会模拟 Nginx、CDN、对象存储、网关、HTTPS、缓存头等生产环境细节，所以只能作为发布前的基础验证，不能替代正式环境部署测试。

### base 路径配置

`base` 用于配置应用在开发和生产环境中的公共基础路径。Vite 官方配置文档说明，`base` 默认值是 `/`，可以设置为绝对 URL 路径、完整 URL 或 `./` 等形式；当项目部署在非域名根路径时，应配置正确的 `base`。([vitejs](https://vite.dev/config/shared-options.html))

部署在域名根路径时：

```text
https://example.com/
```

配置如下：

文件位置：`vite.config.ts`

```typescript
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// 应用部署在域名根路径时使用默认 base
export default defineConfig({
  plugins: [vue()],
  base: '/',
})
```

部署在子路径时：

```text
https://example.com/admin/
```

配置如下：

文件位置：`vite.config.ts`

```typescript
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// 应用部署在 /admin/ 子路径下
export default defineConfig({
  plugins: [vue()],
  base: '/admin/',
})
```

如果不同环境部署路径不同，可以通过环境变量控制：

文件位置：`.env.production`

```properties
# 生产环境部署路径
VITE_PUBLIC_BASE=/admin/
```

文件位置：`vite.config.ts`

```typescript
import vue from '@vitejs/plugin-vue'
import { defineConfig, loadEnv } from 'vite'

// 根据环境变量配置应用公共基础路径
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [vue()],
    base: env.VITE_PUBLIC_BASE || '/',
  }
})
```

Vue Router 也应同步使用相同基础路径：

文件位置：`src/router/index.ts`

```typescript
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

// 路由历史模式使用 Vite 注入的 BASE_URL，避免部署子路径后路由异常
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/views/home/HomeView.vue'),
  },
]

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})
```

如果 `base` 配错，最常见的问题是 `index.html` 可以访问，但 JS、CSS、图片资源 404。部署到 `/admin/` 时，`base` 通常应配置为 `/admin/`，并确保 Nginx 或静态服务器也按同一路径提供资源。

### 静态部署方式

Vite 构建后的产物是静态文件，通常包括 `index.html`、JS、CSS、图片、字体和 `public` 目录复制过来的文件。官方部署文档说明，运行构建命令后，默认可以将 `dist` 目录部署到任意静态站点平台。([vitejs](https://vite.dev/guide/static-deploy.html))

基础部署流程如下：

```bash
# 安装依赖
pnpm install

# 执行类型检查并构建
pnpm build

# 查看构建产物
ls -la dist
```

构建产物结构通常如下：

```text
dist
├── assets
│   ├── index-Ca1A2b3c.js
│   ├── index-Bd4E5f6g.css
│   └── logo-Dh7I8j9k.png
├── favicon.ico
└── index.html
```

常见部署方式如下：

| 部署方式       | 说明                                              |
| -------------- | ------------------------------------------------- |
| Nginx          | 将 `dist` 放到服务器目录，由 Nginx 提供静态访问   |
| Docker + Nginx | 将 `dist` 打进镜像，适合容器化部署                |
| 对象存储 + CDN | 将 `dist` 上传到 OSS/S3/COS，再通过 CDN 加速      |
| 平台托管       | 使用 Vercel、Netlify、Cloudflare Pages 等静态平台 |
| 后端集成       | 将 `dist` 放入后端静态资源目录，由后端服务托管    |

Docker + Nginx 部署示例。

文件位置：`Dockerfile`

```dockerfile
# 使用 Nginx 承载 Vite 静态构建产物
FROM nginx:1.27-alpine

# 删除默认站点配置
RUN rm -f /etc/nginx/conf.d/default.conf

# 拷贝 Nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 拷贝构建产物到 Nginx 静态目录
COPY dist /usr/share/nginx/html

# 暴露 HTTP 端口
EXPOSE 80
```

Nginx 配置如下。

文件位置：`nginx.conf`

```nginx
server {
    listen 80;
    server_name _;

    root /usr/share/nginx/html;
    index index.html;

    # Vue Router history 模式兜底
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存
    location /assets/ {
        try_files $uri =404;
        expires 30d;
        add_header Cache-Control "public, max-age=2592000, immutable";
    }
}
```

构建并运行镜像：

```bash
# 构建前端静态资源
pnpm build

# 构建 Docker 镜像
docker build -t vite-vue3-ts-demo:latest .

# 运行容器
docker run -d --name vite-vue3-ts-demo -p 8080:80 vite-vue3-ts-demo:latest
```

访问地址：

```text
http://localhost:8080
```

如果项目部署到子路径，例如 `/admin/`，需要同时调整 `base` 和 Nginx `location`，不能只改其中一处。

### Nginx 部署注意事项

Nginx 部署 Vite 项目时，最常见的问题是子路由刷新 404、资源路径 404、接口代理路径错误、缓存策略不合理。对于 Vue Router history 模式，必须配置 `try_files` 回退到 `index.html`，否则访问 `/user/list` 这类前端路由时，Nginx 会尝试查找真实文件路径并返回 404。

部署在根路径时：

文件位置：`/etc/nginx/conf.d/admin.conf`

```nginx
server {
    listen 80;
    server_name example.com;

    root /usr/share/nginx/html;
    index index.html;

    # 前端路由 history 模式兜底
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 接口代理到后端服务
    location /api/ {
        proxy_pass http://backend-server:8080/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # 静态资源缓存
    location /assets/ {
        try_files $uri =404;
        expires 30d;
        add_header Cache-Control "public, max-age=2592000, immutable";
    }
}
```

部署在 `/admin/` 子路径时：

文件位置：`/etc/nginx/conf.d/admin.conf`

```nginx
server {
    listen 80;
    server_name example.com;

    # 前端项目部署在 /admin/ 子路径
    location /admin/ {
        alias /usr/share/nginx/html/;
        index index.html;

        # 子路径部署时，需要回退到 /admin/index.html
        try_files $uri $uri/ /admin/index.html;
    }

    # 静态资源路径，与 Vite base=/admin/ 对应
    location /admin/assets/ {
        alias /usr/share/nginx/html/assets/;
        try_files $uri =404;
        expires 30d;
        add_header Cache-Control "public, max-age=2592000, immutable";
    }

    # 后端接口代理
    location /api/ {
        proxy_pass http://backend-server:8080/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

重新加载 Nginx：

```bash
# 检查 Nginx 配置是否正确
nginx -t

# 重新加载 Nginx 配置
nginx -s reload
```

部署检查清单：

| 检查项      | 正确表现                                          |
| ----------- | ------------------------------------------------- |
| 首页访问    | `/` 或 `/admin/` 能正常打开                       |
| 子路由刷新  | `/user/list` 或 `/admin/user/list` 刷新不 404     |
| JS/CSS 资源 | `assets` 资源返回 200                             |
| 接口请求    | `/api` 能正确代理到后端                           |
| 缓存策略    | 带 hash 的资源可以长缓存，`index.html` 不应强缓存 |
| base 配置   | 与部署路径完全一致                                |

`index.html` 通常不建议设置强缓存，因为它引用的 JS/CSS 文件名会随构建 hash 变化。如果 `index.html` 被浏览器或 CDN 长时间缓存，用户可能一直加载旧版本入口文件。

## 常见问题

常见问题用于记录 Vite + Vue3 + TypeScript 项目中高频故障的表现、原因和排查方式。排查时建议先确认问题发生在开发阶段还是生产构建后，因为开发服务器代理、模块转换和生产静态部署是两套不同机制。

### 环境变量不生效

环境变量不生效通常表现为 `import.meta.env.VITE_XXX` 读取不到值、构建后仍然访问旧接口地址、修改 `.env` 后页面没有变化、不同模式加载了错误的环境文件。Vite 官方文档说明，只有以 `VITE_` 开头的变量会暴露给客户端源码；`.env` 文件修改后需要重启开发服务器。([vitejs](https://vite.dev/guide/env-and-mode.html))

常见原因如下：

| 原因                     | 说明                    | 处理方式                 |
| ------------------------ | ----------------------- | ------------------------ |
| 未使用 `VITE_` 前缀      | 客户端代码无法读取      | 改为 `VITE_API_BASE_URL` |
| 修改 `.env` 后未重启     | Vite 启动时加载环境变量 | 重启 `pnpm dev`          |
| 使用了错误 mode          | 命令没有指定目标模式    | 使用 `--mode test`       |
| 变量名拼写错误           | `.env` 与代码不一致     | 统一变量名               |
| 把服务端密钥写进前端变量 | `VITE_*` 会进入客户端   | 敏感信息放后端           |

错误示例：

文件位置：`.env.development`

```properties
# 错误：没有 VITE_ 前缀，客户端无法通过 import.meta.env 读取
API_BASE_URL=/api
```

正确示例：

文件位置：`.env.development`

```properties
# 正确：客户端可读取
VITE_API_BASE_URL=/api
```

业务代码读取：

文件位置：`src/config/env.ts`

```typescript
// 统一读取 Vite 环境变量
export const appEnv = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
  mode: import.meta.env.MODE,
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
}
```

检查当前模式：

```bash
# 使用 test 模式启动开发服务器
pnpm dev -- --mode test

# 使用 staging 模式执行构建
pnpm build -- --mode staging
```

如果 `vite.config.ts` 中需要读取 `.env`，必须使用 `loadEnv`：

文件位置：`vite.config.ts`

```typescript
import vue from '@vitejs/plugin-vue'
import { defineConfig, loadEnv } from 'vite'

// 在 Vite 配置文件中手动加载环境变量
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [vue()],

    server: {
      port: Number(env.VITE_PORT || 5173),
    },
  }
})
```

排查顺序建议：

```text
确认变量是否以 VITE_ 开头
  ↓
确认 .env 文件名是否匹配当前 mode
  ↓
确认修改后是否重启 dev server
  ↓
确认 import.meta.env 中变量名是否拼写正确
  ↓
确认 vite.config.ts 是否使用 loadEnv 读取
```

### 路径别名不生效

路径别名不生效通常表现为页面运行时报找不到模块、IDE 标红、`vue-tsc` 类型检查失败、开发服务器能跑但编辑器无法跳转。根因通常是 Vite 和 TypeScript 只配置了一边，没有保持一致。Vite 的 `resolve.alias` 用于运行时和构建时模块解析；TypeScript 的 `compilerOptions.paths` 用于 IDE 和类型检查。Vite 配置文档也提醒，文件系统路径别名应使用绝对路径。([vitejs](https://vite.dev/config/shared-options.html))

Vite 配置如下。

文件位置：`vite.config.ts`

```typescript
import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// 配置 Vite 路径别名
export default defineConfig({
  plugins: [vue()],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@views': fileURLToPath(new URL('./src/views', import.meta.url)),
      '@utils': fileURLToPath(new URL('./src/utils', import.meta.url)),
    },
  },
})
```

TypeScript 配置如下。

文件位置：`tsconfig.app.json`

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@views/*": ["src/views/*"],
      "@utils/*": ["src/utils/*"]
    }
  },
  "include": [
    "env.d.ts",
    "src/**/*.ts",
    "src/**/*.tsx",
    "src/**/*.vue"
  ]
}
```

正确导入示例：

```typescript
import UserList from '@views/user/UserList.vue'
import { request } from '@utils/request'
```

常见错误：

```typescript
// 错误：别名未配置 @views 时会解析失败
import UserList from '@views/user/UserList.vue'

// 错误：Vue 组件导入不建议省略 .vue 后缀
import UserList from '@/views/user/UserList'
```

排查顺序建议：

```text
确认 vite.config.ts 中 resolve.alias 是否存在
  ↓
确认别名路径是否是绝对路径
  ↓
确认 tsconfig.app.json 中 paths 是否同步
  ↓
确认 include 是否包含 .vue、.ts 文件
  ↓
重启 IDE TypeScript Server
  ↓
重启 Vite dev server
```

如果使用新版本 Vite，也可以考虑使用 `resolve.tsconfigPaths: true` 让 Vite 读取 TypeScript paths 配置；但团队项目中仍建议明确约定一种别名维护方式，避免同时使用多套规则造成歧义。

### 代理请求失败

代理请求失败通常表现为接口 404、跨域错误、请求仍然打到前端服务器、路径被重复拼接、后端没有收到请求。需要先明确一点：`server.proxy` 只在 Vite 开发服务器阶段生效，生产环境不会生效。Vite 官方文档说明，`server.proxy` 是开发服务器代理规则，请求路径匹配后会被代理到目标地址，并且不会再经过 Vite 转换。([vitejs](https://vite.dev/config/server-options.html))

基础代理配置如下。

文件位置：`vite.config.ts`

```typescript
import vue from '@vitejs/plugin-vue'
import { defineConfig, loadEnv } from 'vite'

// 配置开发环境接口代理
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [vue()],

    server: {
      proxy: {
        [env.VITE_API_BASE_URL || '/api']: {
          target: env.VITE_API_PROXY_TARGET || 'http://localhost:8080',
          changeOrigin: true,
          rewrite: (path) => path.replace(new RegExp(`^${env.VITE_API_BASE_URL || '/api'}`), ''),
        },
      },
    },
  }
})
```

环境变量配置：

文件位置：`.env.development`

```properties
# 前端请求前缀
VITE_API_BASE_URL=/api

# 后端服务地址
VITE_API_PROXY_TARGET=http://localhost:8080
```

Axios 配置：

文件位置：`src/utils/request.ts`

```typescript
import axios from 'axios'

// 开发环境请求 /api，由 Vite proxy 转发到后端服务
export const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
})
```

请求链路应为：

```text
前端代码：request.get('/user/list')
  ↓
浏览器请求：http://localhost:5173/api/user/list
  ↓
Vite 代理匹配：/api
  ↓
rewrite 移除：/api
  ↓
后端接收：http://localhost:8080/user/list
```

常见错误和处理方式：

| 问题                               | 原因                         | 处理                               |
| ---------------------------------- | ---------------------------- | ---------------------------------- |
| 浏览器显示 CORS                    | 请求绕过了 Vite dev server   | 确认请求地址是否是 `/api` 相对路径 |
| 后端收到 `/api/user/list`          | 不该保留 `/api` 却没 rewrite | 添加 `rewrite`                     |
| 后端收到 `/user/list` 但返回 404   | 后端实际需要 `/api`          | 删除 `rewrite`                     |
| 请求打到 `localhost:5173` 返回 404 | proxy key 不匹配             | 检查 `VITE_API_BASE_URL`           |
| 生产环境代理无效                   | `server.proxy` 只作用于开发  | 在 Nginx 或网关配置代理            |
| WebSocket 不通                     | 没有配置 `ws: true`          | 为 WebSocket 路径补充代理          |

如果项目部署在非根路径，并且使用了非相对 `base`，代理 key 也要注意与基础路径关系。Vite 官方文档说明，使用非相对 `base` 时，代理 key 需要加上对应 `base` 前缀。([vitejs](https://vite.dev/config/server-options.html))

### 打包后资源路径错误

打包后资源路径错误通常表现为生产环境首页空白、JS/CSS 404、图片或字体 404、部署到子目录后资源仍从域名根路径加载。最常见原因是 `base` 配置与实际部署路径不一致。Vite 官方文档说明，`base` 是应用在开发或生产服务时的公共基础路径，部署到子路径时需要设置对应路径。([vitejs](https://vite.dev/config/shared-options.html))

部署路径和 `base` 对应关系如下：

| 实际访问地址                     | base 配置                |
| -------------------------------- | ------------------------ |
| `https://example.com/`           | `/`                      |
| `https://example.com/admin/`     | `/admin/`                |
| `https://cdn.example.com/admin/` | `/admin/` 或完整 CDN URL |
| 嵌入式相对路径部署               | `./`                     |

部署在 `/admin/` 时，配置如下：

文件位置：`.env.production`

```properties
# 生产环境公共路径
VITE_PUBLIC_BASE=/admin/
```

文件位置：`vite.config.ts`

```typescript
import vue from '@vitejs/plugin-vue'
import { defineConfig, loadEnv } from 'vite'

// 根据部署路径配置 Vite base
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [vue()],
    base: env.VITE_PUBLIC_BASE || '/',
  }
})
```

Vue Router 同步配置：

文件位置：`src/router/index.ts`

```typescript
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

// 路由 base 与 Vite base 保持一致
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/views/home/HomeView.vue'),
  },
]

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})
```

Nginx 子路径部署配置：

文件位置：`/etc/nginx/conf.d/admin.conf`

```nginx
server {
    listen 80;
    server_name example.com;

    location /admin/ {
        alias /usr/share/nginx/html/;
        index index.html;
        try_files $uri $uri/ /admin/index.html;
    }

    location /admin/assets/ {
        alias /usr/share/nginx/html/assets/;
        try_files $uri =404;
        expires 30d;
        add_header Cache-Control "public, max-age=2592000, immutable";
    }
}
```

排查顺序建议：

```text
打开浏览器 Network
  ↓
查看 404 的 JS/CSS/图片路径
  ↓
确认资源请求是否带正确子路径
  ↓
检查 vite.config.ts 的 base
  ↓
检查 Vue Router history base
  ↓
检查 Nginx location / alias / try_files
  ↓
重新构建并部署 dist
```

如果只是 `index.html` 能访问，但 `/assets/index-xxx.js` 404，优先检查 `base` 和 Nginx 静态资源目录。如果刷新 `/admin/user/list` 404，优先检查 Nginx `try_files` 和 Vue Router history 模式配置。
