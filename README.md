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
    "noEmit": true
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
    "types": ["vite/client"]
  },
  "references": [
    { "path": "./tsconfig.node.json" },
    { "path": "./tsconfig.app.json" },
  ],
  "include": ["src"]
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


