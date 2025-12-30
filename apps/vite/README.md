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

