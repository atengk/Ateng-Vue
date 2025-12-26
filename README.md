# 创建工程项目



## 基础环境

### 软件版本

- nodejs: v22.21.1

- npm: 10.9.4

- pnpm: 10.26.0


### 配置国内镜像源

在操作系统上配置以下环境变量

```
NPM_CONFIG_REGISTRY=https://registry.npmmirror.com
NODEJS_ORG_MIRROR=https://npmmirror.com/mirrors/node
```

- NPM_CONFIG_REGISTRY：设置 npm（Node.js 包管理器）使用的包注册表（registry）地址
- NODEJS_ORG_MIRROR：设置 Node.js 二进制文件（安装包、源码、nvm 等工具下载 Node.js 版本时）的镜像地址

### 安装 pnpm

```
npm i -g pnpm
pnpm -v
```

## 创建工程

创建工程骨架

```
Ateng-Vue/
├── apps/                 # 应用层
│   └── web/              # 主前端应用
├── packages/             # 公共包（核心能力）
│   ├── core/             # 权限、路由、store
│   ├── request/          # axios 封装
│   ├── utils/            # 工具库
│   └── types/            # 全局类型
├── internal/             # 内部工程工具
│   └── eslint-config/
├── scripts/              # 构建 / 发布脚本
├── pnpm-workspace.yaml
├── package.json
└── tsconfig.base.json
```

package.json

```
{
  "name": "ateng-vue",
  "private": true,
  "packageManager": "pnpm@10.26.0",
  "scripts": {
    "dev": "pnpm -C apps/web dev",
    "build": "pnpm -C apps/web build"
  }
}
```

pnpm-workspace.yaml

```
packages:
  - apps/*
  - packages/*
  - internal/*

ignoredBuiltDependencies:
  - esbuild
```

tsconfig.base.json

```
{
  "compilerOptions": {
    /* ====== 基础 ====== */
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "Node",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "preserve",

    /* ====== 严格性 ====== */
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noFallthroughCasesInSwitch": true,

    /* ====== 工程化 ====== */
    "baseUrl": ".",
    "paths": {
      "@apps/*": ["apps/*"],
      "@packages/*": ["packages/*"],
      "@internal/*": ["internal/*"]
    },

    /* ====== 构建体验 ====== */
    "useDefineForClassFields": true,
    "isolatedModules": true,
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "skipLibCheck": true,

    /* ====== 输出 ====== */
    "sourceMap": true,
    "noEmit": false
  },
  "exclude": [
    "node_modules",
    "dist",
    "**/dist",
    "**/node_modules"
  ]
}

```

## 创建应用

### 初始化 Vite + Vue3 + TS

```
pnpm dlx create-vite@7.1.3 apps/web --template vue-ts
pnpm install --filter ./apps/web
```

### 修改配置文件

-  tsconfig.json（extends）

```
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "types": ["vite/client"],
    "paths": {}
  },
  "references": [
    { "path": "./tsconfig.node.json" },
    { "path": "./tsconfig.app.json" },
  ],
  "include": ["src"]
}
```

-  tsconfig.app.json

```
{
  "extends": "@vue/tsconfig/tsconfig.dom.json",
  "compilerOptions": {
    "rootDirs": ["src"],
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    },
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",

    /* linting / 严格性 */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["src/**/*.ts", "src/**/*.tsx", "src/**/*.vue"]
}
```

- tsconfig.node.json

```
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
    "target": "ES2023",
    "lib": ["ES2023"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["vite.config.ts"]
}
```

-  vite.config.ts（alias）

```
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    }
  }
});

```

-  package.json（private）

修改 name 为 @apps/web

```
{
  "name": "@apps/web",
  // ...
}
```

修改 scripts 部分，添加test环境的启动脚本

```
"scripts": {
    "dev": "vite",
    "build": "vue-tsc -b && vite build",
    "preview": "vite preview",
    "dev:test": "vite --mode test",
    "build:test": "vite build --mode test"
  }
```

- env.d.ts

```
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string;
  readonly VITE_API_BASE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

-  .env*

.env

```
VITE_APP_NAME=Ateng Admin
```

.env.development

```
VITE_API_BASE=http://localhost:8080
```

.env.test

```
VITE_API_BASE=http://api.ateng.local:8080
```

.env.production

```
VITE_API_BASE=https://api.example.com
```



## 使用应用

### 安装全部依赖（推荐首次使用）

适用于**首次拉取项目**或需要**初始化整个工作区**的场景：

```bash
pnpm install
```

该命令会安装仓库中所有应用和公共包的依赖。

---

### 仅安装指定应用依赖

如果你只需要开发某一个应用（例如 `@apps/web`），可以使用过滤安装，速度更快：

```bash
pnpm install --filter @apps/web
```

适用于：

* 只维护某个子应用
* 不想安装完整仓库依赖
* 本地快速调试某个模块

---

### 小提示

* **首次启动项目**：建议先执行一次 `pnpm install`
* **日常开发单个应用**：使用 `--filter` 更高效
* 若依赖异常，可尝试 `pnpm install --force`

---

