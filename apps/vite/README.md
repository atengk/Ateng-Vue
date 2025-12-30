# Vite

## 了解 Vite

### Vite 是什么 & 在项目中负责什么

#### 开发阶段的角色（Dev Server）

在 **开发阶段**，Vite 的核心角色是一个**开发服务器（Dev Server）**，它的目标只有一个：

> **让你写代码 → 浏览器立刻看到结果**

它主要负责：

* 启动本地开发服务（`localhost:xxxx`）
* 按需加载模块（ESM）
* 提供极速热更新（HMR）
* 处理开发时的代理、别名、环境变量

关键认知点：

* **Vite 不会在开发阶段打包整个项目**
* 浏览器需要哪个模块，Vite 才即时处理哪个模块
* 启动速度与项目体量基本无关

一句话总结：

> **Vite 在开发阶段是“服务模块”，不是“打包项目”**

---

#### 构建阶段的角色（Build Tool）

在 **构建阶段**，Vite 才真正作为一个**构建工具（Build Tool）**存在。

它主要负责：

* 将源码打包成浏览器可直接运行的静态资源
* 代码压缩、Tree Shaking
* 资源重命名（hash）
* 拆分 chunk（vendor / 业务代码）

关键认知点：

* 构建阶段由 **Rollup** 完成（Vite 内部集成）
* 构建结果是 **纯静态文件**
* 构建速度依然快，但关注点变成 **产物质量**

一句话总结：

> **开发阶段靠 Vite 自己，构建阶段靠 Rollup**

---

#### 与 webpack 的核心差异（只需认知层面）

这里只需要记住**三个本质差异**，不用纠结细节：

**1️⃣ 开发模式不同**

* webpack：

  * 启动前先打包
  * 项目越大，启动越慢
* Vite：

  * 不打包，按需加载
  * 启动几乎秒开

**2️⃣ 模块机制不同**

* webpack：基于 bundle 的模块系统
* Vite：基于浏览器原生 **ESM**

**3️⃣ 心智模型不同**

* webpack：

  > “我先把一切准备好，再给你用”
* Vite：

  > “你要什么，我现在给你什么”

------

你这个提醒**完全正确**，也是我刚才确实**偏离了你的真实学习目标**的地方。
我们立刻纠正 👍

> **从这一章开始：每一章 = 认知 +「最小可用配置示例」**
> 不讲空话，不只讲概念。

下面我**重新给你这一章**，**补齐完整、可直接用的示例代码**，且**严格只覆盖你列的点**。

---

## 项目基础配置（vite.config.ts）

### 基础配置结构

#### `defineConfig` + 基础结构（示例）

这是一个**Vue3 + TS 项目中最标准、最常见的起始结构**：

```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()]
})
```

你现在需要建立的**最低认知**：

* `defineConfig`：提供类型提示（必须）
* `plugins`：Vue 项目必须注册 `plugin-vue`
* 这是 **所有 Vite 配置的“根壳”**

---

#### 环境区分（dev / build）配置示例

Vite 的配置文件**本身就支持区分运行阶段**：

```ts
export default defineConfig(({ command, mode }) => {
  const isDev = command === 'serve'
  const isBuild = command === 'build'

  return {
    plugins: [vue()],
    // 这里后续可以根据 isDev / isBuild 写不同配置
  }
})
```

此处你只需要记住：

* `command`

  * `serve` → 开发
  * `build` → 构建
* **同一个配置文件**
* **不同阶段行为不同**

---

#### TypeScript 配置支持（结论型）

```ts
vite.config.ts
```

本身就说明：

* Vite **原生支持 TS**
* 不需要额外 loader
* 类型由 Vite 提供

你只要做到：

* 用 `defineConfig`
* 用 TS 写配置
  就够了

---

### 项目根路径与构建输出

下面是**完整可用示例**，也是你后面所有章节的基础。

---

#### `root` / `base` / `build.outDir` / `build.assetsDir` 示例

```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],

  // 项目根目录
  root: process.cwd(),

  // 部署基础路径
  base: '/',

  build: {
    // 构建输出目录
    outDir: 'dist',

    // 静态资源目录
    assetsDir: 'assets'
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
})
```

---

### 每个配置项你现在该怎么理解（不讲废话版）

#### `root`

```ts
root: process.cwd()
```

* 指定项目运行根目录
* **99% 项目不需要改**
* 写不写都一样（明确即可）

---

#### `base`

```ts
base: '/'
```

* 决定**资源访问前缀**
* 开发环境一般是 `/`
* 非根路径部署（GitHub Pages）必须改

> 后面你之前遇到的 **404 问题，本质就和它有关**

---

#### `build.outDir`

```ts
outDir: 'dist'
```

* 构建后的最终目录
* 可以直接丢给 Nginx / 静态服务器

---

#### `build.assetsDir`

```ts
assetsDir: 'assets'
```

* 所有 JS / CSS / 图片的子目录
* **结构控制用**
* 基本不动

------

## 开发服务器配置（server）

### 本地开发服务

下面是一个**完整、可直接放进 `vite.config.ts` 使用的示例**，只包含你列的 4 个配置项。

```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],

  server: {
    // 本地开发端口
    port: 5173,

    // 监听地址
    host: '0.0.0.0',

    // 启动时自动打开浏览器
    open: true,

    // 端口被占用时直接报错
    strictPort: true
  }
})
```

---

#### `server.port`

```ts
port: 5173
```

* 指定本地开发端口
* 默认就是 `5173`
* 企业项目通常**固定端口，避免冲突**

---

#### `server.host`

```ts
host: '0.0.0.0'
```

* 允许通过 **IP / 局域网 / Docker** 访问
* 不仅限于 `localhost`
* 移动端调试、联调时必配

---

#### `server.open`

```ts
open: true
```

* 启动 dev server 时自动打开浏览器
* 纯体验项
* 对构建无任何影响

---

#### `server.strictPort`

```ts
strictPort: true
```

* 端口被占用时：

  * `true` → 直接失败
  * `false` → 自动换端口
* 企业项目**推荐 true**

  * 避免脚本 / 文档混乱

---

### 代理配置（高频）

下面是**真实项目中最常见的代理写法**，不是教学玩具版本。

---

#### 基础代理示例

```ts
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:12007',
      changeOrigin: true
    }
  }
}
```

这个配置表示：

* 浏览器请求 `/api/user/list`
* 实际转发到：

  ```
  http://localhost:12007/api/user/list
  ```
* 解决 **本地开发跨域问题**

---

#### rewrite 使用（高频）

当前端不希望后端看到 `/api` 前缀时：

```ts
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:12007',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '')
    }
  }
}
```

效果：

* 前端请求：

  ```
  /api/user/list
  ```
* 后端实际收到：

  ```
  /user/list
  ```

---

#### 多环境代理（实战写法）

通过 `mode` 区分不同后端地址：

```ts
export default defineConfig(({ mode }) => {
  const proxyTarget =
    mode === 'development'
      ? 'http://localhost:12007'
      : 'https://api.test.example.com'

  return {
    plugins: [vue()],
    server: {
      proxy: {
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    }
  }
})
```

你现在需要的**关键认知**：

* 代理只在 **开发阶段生效**
* 构建后不会再有 proxy
* 真正线上代理由 **Nginx / 网关** 负责

------

## 路径别名（resolve）

### 别名配置

#### `resolve.alias` 基础示例

这是 **Vue3 + Vite 项目中最常见、最标准的别名配置**：

```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
})
```

使用效果：

```ts
import HelloWorld from '@/components/HelloWorld.vue'
```

你现在只需要记住一句话：

> **`@` = src**

---

#### 多别名拆分（常见实战）

当项目变大时，常见做法是**按目录职责拆分别名**：

```ts
resolve: {
  alias: {
    '@': path.resolve(__dirname, 'src'),
    '@assets': path.resolve(__dirname, 'src/assets'),
    '@views': path.resolve(__dirname, 'src/views'),
    '@components': path.resolve(__dirname, 'src/components')
  }
}
```

对应使用示例：

```ts
import Logo from '@assets/logo.png'
import UserPage from '@views/user/index.vue'
import AppButton from '@components/AppButton.vue'
```

认知要点：

* 别名是 **构建期 & 开发期能力**
* 不影响运行时
* 是为了解决**相对路径地狱**

---

### 与 tsconfig.json 同步

这是**非常容易踩坑，但企业项目必须正确做的地方**。

---

#### `paths` 对齐示例（必须）

当你在 Vite 里配置了别名，**TypeScript 并不知道**，必须在 `tsconfig.json` 同步配置：

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@assets/*": ["src/assets/*"],
      "@views/*": ["src/views/*"],
      "@components/*": ["src/components/*"]
    }
  }
}
```

否则会出现：

* Vite 能跑
* IDE 报红
* TS 类型检查失败

---

#### 为什么必须保持一致

你需要理解的**本质原因**只有一个：

* Vite 的 `resolve.alias`

  * 负责 **打包 & 运行**
* TypeScript 的 `paths`

  * 负责 **类型检查 & 编辑器提示**

它们：

* **互不读取对方配置**
* 必须由你手动保持一致

一句话结论：

> **别名 = 配两份，少一份就会出问题**

------

## 环境变量（env）

### 环境文件

Vite 使用 **dotenv 约定式加载环境变量**，常见文件如下：

```text
.env
.env.development
.env.production
```

#### 各文件的作用（先给结论）

* `.env`

  * **所有环境都会加载**
* `.env.development`

  * 仅在开发环境加载
* `.env.production`

  * 仅在构建生产环境加载

加载顺序（你只需记住）：

```
.env
→ .env.[mode]
```

后加载的会覆盖前面的同名变量。

---

#### 示例：环境文件内容

`.env`

```env
VITE_APP_NAME=Ateng Admin
```

`.env.development`

```env
VITE_API_BASE_URL=http://localhost:12007
```

`.env.production`

```env
VITE_API_BASE_URL=https://api.example.com
```

---

### 环境变量规则

#### `import.meta.env` 的使用方式

在 **Vite 项目中访问环境变量**，统一通过：

```ts
import.meta.env
```

示例：

```ts
const baseUrl = import.meta.env.VITE_API_BASE_URL
```

注意点（非常重要）：

* ❌ 不能用 `process.env`
* ✅ 只能用 `import.meta.env`

---

#### `VITE_` 前缀限制（核心规则）

**只有以 `VITE_` 开头的变量**：

* 才会被注入到前端代码中
* 才能通过 `import.meta.env` 访问

例如：

```env
VITE_API_BASE_URL=http://localhost:12007
```

✅ 前端可访问

```env
API_SECRET=xxxx
```

❌ 前端不可访问

结论：

> **这是 Vite 的安全设计，不是限制你**

---

#### 常用变量示例（实战）

```env
VITE_API_BASE_URL=https://api.example.com
VITE_APP_NAME=Ateng Admin
VITE_APP_ENV=production
```

在代码中使用：

```ts
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
```

------

## 构建优化配置（esbuild）

Vite 内部使用 **esbuild** 作为快速编译和压缩工具，`esbuild` 选项可以在 `vite.config.ts` 的 `build` 或 `esbuild` 下进行配置。

---

### 基础示例

```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],

  esbuild: {
    // 构建时去掉 console、debugger 等
    drop: ['console', 'debugger'],

    // 标记为纯函数，可用于 Tree Shaking 去除调用
    pure: ['console.log']
  }
})
```

**生产示例**

```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ command, mode }) => {
  const isProd = command === 'build'

  return {
    plugins: [vue()],

    esbuild: {
      drop: isProd ? ['console', 'debugger'] : [],
      pure: isProd ? ['console.log'] : []
    }
  }
})
```

---

### 关键配置说明

#### `drop`

* 数组类型
* 可选值：`'console' | 'debugger'`
* 作用：构建时直接删除指定语句
* 企业项目常用：

  * `drop: ['console', 'debugger']` → 生产环境去掉日志和断点

---

#### `pure`

* 数组类型
* 用于标记“纯函数”调用
* 被标记的函数在构建时，如果结果没有被使用，会被直接移除
* 常见用法：

  ```ts
  pure: ['console.log']
  ```

  * 效果和 `drop: ['console']` 类似，但更灵活

---

### 使用场景

* **生产环境构建优化**

  * 去掉调试信息
  * 减少包体积
* **开发环境一般不需要配置**
* 配合 `build.minify` 使用效果最佳

---

## package.json scripts

### Vite 内置命令

Vite 提供的核心命令，通常在 `package.json` 中这样使用：

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

说明：

- `vite` 或 `vite dev` → 启动开发服务器
- `vite build` → 构建生产静态文件
- `vite preview` → 预览构建产物，模拟生产环境

企业级认知：

- **开发阶段用 `dev`**
- **构建阶段用 `build`**
- `preview` 仅用于测试构建效果，不是线上服务

------

### 多环境与 mode

可以在 scripts 中指定 mode，用于区分不同环境：

```json
{
  "scripts": {
    "dev": "vite --mode development",
    "dev:test": "vite --mode test",
    "build:prod": "vite build --mode production",
    "build:test": "vite build --mode test"
  }
}
```

Vite 根据 `--mode` 自动加载对应的 `.env.[mode]` 文件：

- `development` → `.env.development`
- `test` → `.env.test`
- `production` → `.env.production`

企业实践建议：

- 每个环境单独命令
- 避免手动修改 `.env` 文件

------

### scripts 与 env 关系

在代码中通过 `import.meta.env` 获取环境变量：

```ts
const apiUrl = import.meta.env.VITE_API_BASE_URL
```

结合 scripts：

```json
{
  "scripts": {
    "dev": "vite --mode development",
    "build:prod": "vite build --mode production"
  }
}
```

- `dev` → 使用 `.env.development`
- `build:prod` → 使用 `.env.production`

认知结论：

> scripts 决定 mode，mode 决定 env，env 决定运行时配置

------

### scripts 常用参数

常用命令行参数示例：

```json
{
  "scripts": {
    "dev": "vite --port 3000 --open --host",
    "build:prod": "vite build --sourcemap"
  }
}
```

参数说明：

| 参数          | 作用                 |
| ------------- | -------------------- |
| `--port`      | 指定开发端口         |
| `--open`      | 启动时自动打开浏览器 |
| `--host`      | 开放局域网访问       |
| `--sourcemap` | 生成 sourcemap 文件  |

------

### scripts 与包管理器

调用方式差异：

| 包管理器 | 调用          |
| -------- | ------------- |
| npm      | `npm run dev` |
| pnpm     | `pnpm dev`    |
| yarn     | `yarn dev`    |

企业实践：

- **推荐统一使用 pnpm**
- scripts 名称统一，避免多环境冲突

------

### 跨平台与工程化约束

1. Windows / macOS / Linux 跨平台差异：

   - 使用 `cross-env` 设置环境变量：

     ```json
     "scripts": {
       "build:test": "cross-env VITE_API_ENV=test vite build --mode test"
     }
     ```

2. 工程化约束：

   - scripts 是 **前端环境入口**
   - **禁止在代码里硬编码环境**
   - CI/CD 直接通过 scripts 执行构建

---

## 插件体系（plugins）

### Vue 插件

在 Vue3 + Vite 项目中，最核心的插件是 **`@vitejs/plugin-vue`**：

```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()]
})
```

#### 作用与认知

- 提供 **SFC（.vue 文件）解析能力**
- 支持 **`<script setup>` 语法**
- 让 Vue3 项目能被 Vite 正确编译和热更新

企业实践：

- **必须注册插件**，否则 Vue 文件无法运行
- `<script setup>` 不需要额外配置，插件已原生支持

------

### 常见实用插件（认知级）

#### 1. 自动导入（Auto Import）

作用：

- 自动导入 Vue / Pinia / Vue Router 等 API
- 免去重复 `import { ref, computed } from 'vue'`

示例：

```ts
import AutoImport from 'unplugin-auto-import/vite'

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      imports: ['vue', 'vue-router', 'pinia'],
      dts: 'src/auto-imports.d.ts'
    })
  ]
})
```

认知：

- 提升开发效率
- 必须生成 `dts` 文件，保证 TS 类型正确

------

#### 2. 组件自动注册

作用：

- 自动注册 `src/components` 下组件
- 免去每次手动 `import` / `components` 配置

示例：

```ts
import Components from 'unplugin-vue-components/vite'

export default defineConfig({
  plugins: [
    vue(),
    Components({
      dirs: ['src/components'],
      extensions: ['vue'],
      dts: 'src/components.d.ts'
    })
  ]
})
```

认知：

- 配合 TS 时需生成 `dts`
- 企业项目中，组件库或通用组件必配

------

#### 3. SVG 图标处理

作用：

- 将 SVG 转为 Vue 组件
- 支持按需使用

示例：

```ts
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'path'

export default defineConfig({
  plugins: [
    vue(),
    createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
      symbolId: 'icon-[name]'
    })
  ]
})
```

认知：

- 可以在模板中直接 `<svg-icon name="home" />`
- 减少手动 import SVG 的麻烦

------

#### 4. Mock 数据插件

作用：

- 开发阶段模拟接口数据
- 不依赖真实后端

示例：

```ts
import { viteMockServe } from 'vite-plugin-mock'

export default defineConfig({
  plugins: [
    vue(),
    viteMockServe({
      mockPath: 'mock',
      localEnabled: true
    })
  ]
})
```

认知：

- 本地开发阶段必备
- 上线时关闭或通过 `mode` 区分

------

## CSS 相关配置

### CSS 预处理器

Vite 内置对 **SCSS / Less / Stylus** 等预处理器支持，无需额外 loader，但可以通过 `css.preprocessorOptions` 配置全局变量或选项。

#### 示例：SCSS 配置

```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`
      },
      less: {
        javascriptEnabled: true
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
})
```

认知：

- `additionalData` 可以注入全局变量、mixins、函数
- 企业项目通常 **统一注入 theme / 变量**
- Less 需要 `javascriptEnabled: true` 才能用部分高级功能

------

### 全局样式注入（高频）

#### 全局变量 / 主题变量 / mixins 示例

```
src/styles/variables.scss
$primary-color: #409eff;
$font-size-base: 14px;

@mixin flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

在 `vite.config.ts` 通过 `additionalData` 注入：

```ts
scss: {
  additionalData: `@import "@/styles/variables.scss";`
}
```

使用示例：

```vue
<template>
  <div class="box">Hello</div>
</template>

<style lang="scss">
.box {
  color: $primary-color;
  @include flex-center;
  font-size: $font-size-base;
}
</style>
```

认知：

- 全局变量注入后，无需每个文件都手动 import
- mixins 可统一管理布局、主题样式

------

### CSS Modules（了解）

Vite 对 CSS Modules 支持开箱即用：

#### 使用场景

- 局部样式隔离
- 避免全局样式冲突
- 配合 TS 可获取类型提示

#### 示例

```vue
<template>
  <div :class="$style.box">Box</div>
</template>

<style module lang="scss">
.box {
  color: red;
  font-size: 16px;
}
</style>
```

- `$style` 对象中包含类名映射
- **与 `scoped` 区别**：
  - `scoped` → Vue SFC 局部样式，仅作用于当前组件
  - `module` → CSS Modules，生成哈希类名，可跨组件 import

认知结论：

- CSS Modules 更多用于 **复杂组件库 / 通用组件隔离样式**
- scoped 更适合单组件局部样式

------

## 静态资源处理（assets）

### 静态资源引入方式

Vite 支持两种常见方式管理静态资源：

#### 1. `src/assets`（模块化管理）

- 文件会被 Vite **打包处理**
- 支持 ES 模块方式引入

示例：

```ts
import logoUrl from '@/assets/logo.png'

const img = document.createElement('img')
img.src = logoUrl
document.body.appendChild(img)
```

Vue 模板中：

```vue
<template>
  <img :src="logo" alt="logo" />
</template>

<script setup lang="ts">
import logo from '@/assets/logo.png'
</script>
```

认知：

- 图片/字体/音视频等都可以放在 `src/assets`
- 构建时会 **自动处理路径、生成 hash**

------

#### 2. `public` 目录（原封不动）

- 放置不需要打包处理的资源
- 可以通过 **绝对路径** 访问

示例：

```
public/favicon.ico
```

Vue 中使用：

```vue
<img src="/favicon.ico" alt="favicon" />
```

认知：

- 适合**外部 CDN / 不希望 hash 的静态资源**
- 构建阶段直接原封不动复制到 `dist`

------

### URL 处理规则

Vite 对资源的处理遵循**模块导入规则 + 内联阈值**。

#### 图片、字体

- Vite 默认会根据文件大小进行处理
- 小于 `4kb` 的资源 → 内联为 base64
- 大于 `4kb` → 拷贝到 `assets` 目录并生成 hash 名

可通过 `vite.config.ts` 调整：

```ts
export default defineConfig({
  build: {
    assetsInlineLimit: 8192 // 8kb
  }
})
```

#### 使用示例

```ts
import smallIcon from '@/assets/icon-small.png' // < 4kb → base64
import largeImage from '@/assets/banner.jpg'    // > 4kb → hash 输出
```

- 内联图片不会生成额外文件
- 大文件会生成 `dist/assets/xxx.[hash].png`

------

## 构建配置（build）

### 构建基础参数

#### `target`

指定构建产物的浏览器兼容目标：

```ts
export default defineConfig({
  build: {
    target: 'es2015'
  }
})
```

- 常用值：
  - `esnext` → 最新浏览器，体积最小
  - `es2015` → 支持 IE11（需要额外 polyfill）
- 企业实践：
  - 如果只支持现代浏览器 → 使用 `esnext`
  - 如果需要兼容旧版浏览器 → `es2015`

------

#### `sourcemap`

是否生成 sourcemap，用于调试或线上分析：

```ts
export default defineConfig({
  build: {
    sourcemap: true
  }
})
```

- `true` → 生成 map 文件
- `false` → 不生成（默认）
- 企业实践：
  - **开发环境不需要生成**
  - 生产环境可根据需求生成，用于线上错误定位

------

#### `minify`

压缩方式，减少构建体积：

```ts
export default defineConfig({
  build: {
    minify: 'esbuild' // 默认快速压缩
    // minify: 'terser' // 高级压缩，可配置 drop console/debugger
  }
})
```

- `'esbuild'` → 默认，速度快
- `'terser'` → 支持更细粒度配置，例如去掉 console
- 企业实践：
  - 绝大部分项目用 `'esbuild'` 即可
  - 特殊优化才用 `'terser'`

------

### 构建优化认知

#### Chunk 拆分（按需打包）

- Vite 默认会对模块进行自动拆分
- 目标：减少单个 JS 包体积
- 示例（概念认知即可）：
  - 页面级组件 → 单独 chunk
  - 大型依赖 → 拆分到 `vendor` chunk

------

#### Vendor 拆包

- 第三方库（Vue / Pinia / Axios 等）单独打包
- 优势：
  - 浏览器缓存更高效
  - 更新业务代码时无需重新下载大型库

------

#### 构建体积分析（认知）

- 工具示例：`rollup-plugin-visualizer`
- 作用：
  - 查看每个依赖占用体积
  - 优化包体积和依赖加载
- 企业实践：
  - 定期分析依赖
  - 避免大文件被意外打入主 bundle

```ts
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    visualizer({ open: true })
  ]
})
```

------

## 依赖优化（optimizeDeps）

### 依赖预构建

#### 什么是预构建

- Vite 使用 **esbuild** 对依赖进行预构建
- 目的：
  - 将 **CommonJS / 大型依赖** 转为 **ESM**
  - 加快开发启动速度（HMR 更快）

企业认知：

- 开发阶段生效
- 只影响 dev server，不影响最终构建

#### 常见使用场景

- 第三方库报错或启动慢：
  - 例如 Vue3 + Ant Design Vue、Axios
- 解决依赖导入报错或 HMR 不生效

示例：

```ts
export default defineConfig({
  optimizeDeps: {
    include: ['lodash-es', 'axios']
  }
})
```

说明：

- `include` → 强制预构建某些依赖

------

### exclude / include

#### 解决依赖报错

- 有些老库使用 CommonJS / UMD，Vite 默认无法正确处理
- 可通过 `optimizeDeps.exclude` 排除，避免报错

示例：

```ts
export default defineConfig({
  optimizeDeps: {
    exclude: ['some-legacy-lib']
  }
})
```

- `exclude` → 不做预构建
- 适用于老库或者需要保留运行时特性

#### 兼容老库

- 某些库依赖 `process` / `global` 等 Node 全局对象
- 通过 `exclude` 或额外插件处理
- 企业实践：
  - 避免直接修改 node_modules
  - 优先尝试 `include` / `exclude` 解决

------

## 模块热更新（HMR）

### HMR 基础认知

- **默认行为**：
  - 开发阶段修改代码，浏览器自动更新，无需刷新
  - 减少开发等待时间
- **Vue SFC 的 HMR 特点**：
  - `<script setup>`、模板和样式的修改都会热更新
  - 状态（ref、reactive）会尽量保留
  - 不支持所有场景（如大幅度组件结构变化，可能需要刷新）

示例：无额外配置即可使用：

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()]
})
```

------

### HMR 异常排查思路（了解）

- 修改后页面不刷新或状态丢失：
  - 检查插件版本是否兼容 Vue3
  - 检查组件导出方式，确保使用 `<script setup>` 或 `export default`
- 依赖库更新不生效：
  - 可尝试清理缓存 `node_modules/.vite`
  - 配置 `optimizeDeps` 预构建依赖

认知结论：

- HMR 是 **开发加速工具**，不是生产功能
- 企业项目中，只需了解异常排查方法即可

------

## 多环境与模式（mode）

### mode 的概念

- **development** → 开发模式，dev server
- **production** → 构建生产环境
- **自定义 mode** → 可通过 `--mode xxx` 传入，加载 `.env.xxx` 文件

示例：

```json
{
  "scripts": {
    "dev:test": "vite --mode test",
    "build:prod": "vite build --mode production"
  }
}
```

------

### mode 与 env 的关系

- `mode` 决定 Vite 加载哪个 `.env.[mode]` 文件
- `.env` → 全局共享变量
- `.env.[mode]` → 针对特定环境覆盖全局变量

认知结论：

> mode = env 的入口，env = 运行时变量来源

------

## Vite 与项目工程化协作

### 与 ESLint / Prettier

- **Vite 本身不负责代码风格检查或格式化**
- 配合方式：
  - `vite-plugin-eslint` → 开发时自动检查
  - Prettier → 仅格式化，Vite 不调用

示例：

```ts
import eslintPlugin from 'vite-plugin-eslint'

export default defineConfig({
  plugins: [vue(), eslintPlugin()]
})
```

------

### 与 Vue Router / Pinia

- Vite **不侵入业务结构**
- 只负责：
  - 运行 dev server
  - 构建产物
- Vue Router / Pinia 配置与 Vite 无关
- 企业实践：
  - 目录结构、路由、状态管理完全由团队控制
  - Vite 仅提供工具链支持

------

## 常见问题与认知误区（总结性）

### 新手常见坑

1. **base 配置导致资源 404**
   - `base` 配置不正确 → 静态资源路径错误
   - 企业实践：生产环境一般设置 `/` 或 CDN 路径
2. **代理不生效**
   - 常见原因：
     - `server.proxy` 写错
     - 请求路径与 rewrite 不匹配
   - 企业实践：严格按照 `/api` 前缀和 rewrite 配置
3. **env 变量 undefined**
   - 忘记加 `VITE_` 前缀
   - 未正确设置 mode 或 scripts

------

### 企业项目中 Vite 的边界

- **不写业务逻辑**
- **不替代框架能力**：
  - Vue Router / Pinia / 状态管理
  - UI 组件库
- Vite 仅负责：
  - 开发服务器
  - 构建产物
  - 开发优化

认知结论：

> Vite 是**现代前端开发工具链核心**，不是框架或业务逻辑解决方案

------

