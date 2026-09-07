# Alova.js

## 项目概述

Alova.js 是一个面向前端与服务端 JavaScript 应用的请求工具库，核心目标是提升 API 集成效率。它不只是封装 HTTP 请求，还提供请求状态管理、缓存、分页、表单提交、Token 认证、跨组件数据刷新等请求策略能力，适合在 Vue3 + TypeScript 项目中作为统一的接口请求层。官方文档将 alova 定位为用于高效集成 API 的请求工具，并强调其兼容常见 HTTP Client 与 UI Framework。([Alova.JS](https://alova.js.org/tutorial/getting-started/introduce))

### 技术选型

本项目在前端请求层中引入 Alova.js，配合 Vue3、TypeScript、Composition API 使用，用于统一管理接口定义、请求调用、响应处理、错误处理和请求状态。Alova 官方文档支持 Vue3、React、Svelte、Solid 等多种 UI 框架，并提供 `alova/client` 下的请求策略 Hook，用于处理页面请求、分页请求、表单提交、数据预取等场景。([Alova.JS](https://alova.js.org/tutorial/getting-started/introduce))

技术栈建议如下：

| 技术            | 用途                                                |
| --------------- | --------------------------------------------------- |
| Vue3            | 页面与组件开发基础框架                              |
| TypeScript      | 接口参数、响应结构、业务模型的类型约束              |
| Composition API | 在 `setup` 中组织请求逻辑、状态逻辑和业务逻辑       |
| Alova.js        | 统一封装 HTTP 请求、请求状态、缓存和请求策略        |
| `alova/fetch`   | 基于 Fetch API 的请求适配器，适合作为默认请求适配器 |
| Pinia           | 管理登录用户、Token、权限、全局业务状态             |
| Vue Router      | 页面路由、权限路由、登录失效跳转                    |
| Element Plus    | 表单、表格、分页、弹窗、消息提示等业务组件          |
| Vite            | Vue3 + TypeScript 项目构建工具                      |

在基础集成阶段，建议优先使用 `alova/fetch` 作为请求适配器。官方快速开始文档中，Alova 实例通过 `createAlova` 创建，并通过 `requestAdapter: adapterFetch()` 指定 Fetch 适配器，通过 `responded` 统一处理响应数据。([Alova.JS](https://alova.js.org/tutorial/getting-started/quick-start))

### 适用场景

Alova.js 适合用于中后台管理系统、业务运营平台、移动端 H5、数据看板、低代码后台、企业内部系统等存在大量接口调用的前端项目。相比只使用原生 `fetch` 或 Axios，Alova 更适合把请求封装成可复用的 Method 实例，并在组件中通过请求策略 Hook 统一处理加载状态、错误状态、响应数据和刷新动作。

典型适用场景包括：

| 场景             | 说明                                                       |
| ---------------- | ---------------------------------------------------------- |
| 普通页面数据加载 | 使用 `useRequest` 获取详情、配置、字典、用户信息等数据     |
| 查询列表与分页   | 使用分页请求策略管理页码、页大小、总数、列表刷新和条件查询 |
| 表单提交         | 统一处理新增、编辑、删除、提交中状态和防重复提交           |
| 条件筛选请求     | 监听搜索条件、Tab、状态切换等参数变化后重新请求数据        |
| 跨组件刷新       | 一个组件提交数据后，触发其他组件或页面列表刷新             |
| 响应缓存         | 对字典、配置、用户资料等低频变化数据进行缓存复用           |
| Token 认证       | 在请求前注入 Token，并在响应阶段处理登录失效或刷新 Token   |
| 接口类型管理     | 使用 TypeScript 约束请求参数、响应数据和业务模型           |

官方文档中，Alova 将复杂请求场景抽象为请求策略，例如监听请求、分页请求、Token 认证、表单提交、数据预取、无感数据交互等，适合减少重复模板代码并提升接口调用一致性。([Alova.JS](https://alova.js.org/tutorial/getting-started/introduce))

### 开发目标

本项目使用 Alova.js 的主要目标，是建立统一、类型安全、可维护的前端请求层，减少页面组件中分散的请求代码，使接口调用具备固定规范、统一入口和一致的错误处理方式。

具体目标如下：

| 目标          | 说明                                                         |
| ------------- | ------------------------------------------------------------ |
| 统一请求入口  | 所有接口请求通过统一 Alova 实例发起，集中配置 `baseURL`、请求头、响应处理和异常处理 |
| 统一 API 模块 | 按业务模块拆分 API 文件，例如用户、角色、菜单、字典、订单等模块 |
| 强化类型约束  | 使用 TypeScript 定义请求参数类型、响应数据类型和分页数据类型 |
| 简化页面状态  | 使用 Alova 请求 Hook 管理 `loading`、`data`、`error` 等状态，减少手动维护状态的代码 |
| 规范错误处理  | 区分业务错误、HTTP 错误、网络异常和登录失效，统一提示和日志输出 |
| 支持缓存复用  | 对稳定数据启用缓存，减少重复请求，提高页面响应速度           |
| 支持列表刷新  | 在新增、编辑、删除后，统一刷新列表或局部更新缓存数据         |
| 提升协作效率  | 通过统一封装规范，使前端接口代码更容易维护、复用和排查问题   |

最终效果是将接口请求从页面组件中抽离出来，形成“Alova 实例配置 + API Method 封装 + 页面 Hook 调用 + 统一错误处理”的开发模式。页面组件只关心业务参数、响应数据和交互逻辑，不直接处理底层请求细节。Alova 官方最佳实践中也提到，可通过 Method 实例、响应状态和缓存机制构建 Client-Server Interaction Layer，用于集中管理响应数据和跨组件刷新。([Alova.JS](https://alova.js.org/tutorial/project/best-practice/csil))



## 环境准备

本节用于说明在 Vue3 + TypeScript 项目中集成 Alova.js 前需要准备的依赖、类型配置和目录结构。Alova 官方 v3 文档中，基础安装只需要安装 `alova` 包，创建实例时可通过 `createAlova` 配合 `alova/fetch` 作为请求适配器。([Alova.JS](https://alova.js.org/tutorial/getting-started/quick-start))

### 依赖安装

项目建议使用 `pnpm` 管理依赖，保持安装速度和依赖结构稳定。如果项目已经由 Vite 创建，通常已包含 Vue3、TypeScript、Vite 等基础依赖，只需要额外安装 `alova`。

在项目根目录执行以下命令安装 Alova.js。

```bash
# 安装 Alova.js 核心包
pnpm add alova

# 如果项目还未安装 Pinia、Element Plus，可按需安装
pnpm add pinia element-plus

# TypeScript 类型校验工具，Vite Vue 项目通常已包含
pnpm add -D vue-tsc typescript
```

命令说明：`alova` 是请求核心库；`pinia` 可用于管理 Token、登录用户和权限状态；`element-plus` 可用于消息提示、弹窗确认、表格、分页和表单组件；`vue-tsc` 用于在构建前做 Vue 单文件组件的 TypeScript 类型校验。

建议在 `package.json` 中保留类型校验脚本，避免接口类型错误进入构建产物。

```json
{
  "scripts": {
    "dev": "vite",
    "type-check": "vue-tsc --noEmit",
    "build": "vue-tsc --noEmit && vite build",
    "preview": "vite preview"
  }
}
```

### TypeScript 配置

TypeScript 配置的目标是保证 API 参数、响应数据、业务模型和组件状态具备明确类型。请求层代码建议开启严格类型检查，避免接口字段拼写错误、响应结构不一致、空值未处理等问题。

下面配置用于项目根目录的 `tsconfig.app.json`，其中重点是开启严格模式、配置路径别名和引入 Vite 类型。

文件位置：`tsconfig.app.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    "moduleResolution": "Bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "preserve",
    "strict": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    },
    "types": ["vite/client"]
  },
  "include": ["src/**/*.ts", "src/**/*.tsx", "src/**/*.vue"]
}
```

如果项目需要通过环境变量配置接口地址，需要补充 Vite 环境变量类型声明。

文件位置：`src/types/env.d.ts`

```typescript
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_APP_TITLE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

开发环境接口地址建议放在 `.env.development` 中，生产环境放在 `.env.production` 中。

文件位置：`.env.development`

```properties
# 后端接口基础地址
VITE_API_BASE_URL=/api

# 应用标题
VITE_APP_TITLE=Alova Vue3 Demo
```

### Vue3 项目结构

项目结构建议将 Alova 实例、接口模块、公共类型、状态管理和页面组件分层放置。这样可以避免页面组件中直接拼接 URL、重复处理响应结构或分散维护 Token 注入逻辑。

推荐目录结构如下：

```text
src
├── api
│   ├── modules
│   │   ├── user.ts
│   │   ├── role.ts
│   │   └── menu.ts
│   └── index.ts
├── assets
├── components
├── router
│   └── index.ts
├── stores
│   ├── auth.ts
│   └── user.ts
├── types
│   ├── env.d.ts
│   ├── http.ts
│   └── user.ts
├── utils
│   ├── request
│   │   └── alova.ts
│   └── storage.ts
├── views
│   └── user
│       └── UserList.vue
├── App.vue
└── main.ts
```

目录职责建议如下：

| 目录                         | 职责                                                         |
| ---------------------------- | ------------------------------------------------------------ |
| `src/utils/request/alova.ts` | 创建 Alova 实例，配置请求适配器、拦截器、响应解析            |
| `src/api/modules`            | 按业务模块封装接口 Method 实例                               |
| `src/types`                  | 定义通用响应类型、分页类型、业务 DTO、VO                     |
| `src/stores`                 | 维护 Token、用户信息、权限数据等全局状态                     |
| `src/views`                  | 页面组件，只调用 API 模块和请求 Hook，不直接维护底层请求逻辑 |
| `src/components`             | 通用业务组件，可接收数据和事件，避免直接耦合具体 API         |

## Alova 基础集成

本节用于建立项目级 Alova 请求实例。Alova 的核心用法是先创建实例，再通过实例创建 Method；官方文档说明，`alovaInstance.Get(...)` 创建的是 Method 实例，该实例描述请求方法、URL、请求头、请求参数等信息，并可通过 `await`、`then` 或请求 Hook 发送请求。([Alova.JS](https://alova.js.org/tutorial/getting-started/basic/method))

### Alova 实例创建

Vue3 项目中需要为 Alova 实例设置 `statesHook: VueHook`，这样 `useRequest` 等请求策略才能创建 Vue 响应式状态。官方文档中，`statesHook` 用于告诉 Alova 当前 UI 框架如何创建状态，Vue3 场景使用 `alova/vue`。([Alova.JS](https://alova.js.org/tutorial/getting-started/basic/combine-framework))

下面代码创建全局 Alova 实例，统一配置基础地址、Vue 状态 Hook、Fetch 请求适配器、请求前处理和响应处理。

文件位置：`src/utils/request/alova.ts`

```typescript
import { createAlova } from 'alova';
import VueHook from 'alova/vue';
import adapterFetch from 'alova/fetch';
import { ElMessage } from 'element-plus';
import type { ApiResponse } from '@/types/http';

/**
 * 业务成功状态码
 */
const SUCCESS_CODE = 200;

/**
 * 登录失效状态码
 */
const UNAUTHORIZED_CODE = 401;

/**
 * 获取本地 Token
 */
const getAccessToken = () => {
  return localStorage.getItem('access_token') || '';
};

/**
 * 跳转登录页
 */
const redirectToLogin = () => {
  localStorage.removeItem('access_token');
  window.location.href = '/login';
};

/**
 * Alova 全局请求实例
 */
export const alovaInstance = createAlova({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  statesHook: VueHook,
  requestAdapter: adapterFetch(),

  beforeRequest(method) {
    const token = getAccessToken();

    method.config.headers = {
      ...method.config.headers,
      'Content-Type': 'application/json;charset=UTF-8'
    };

    if (token) {
      method.config.headers.Authorization = `Bearer ${token}`;
    }
  },

  responded: {
    async onSuccess(response) {
      if (!response.ok) {
        if (response.status === UNAUTHORIZED_CODE) {
          ElMessage.error('登录状态已失效，请重新登录');
          redirectToLogin();
        }

        throw new Error(`请求失败，HTTP 状态码：${response.status}`);
      }

      const result = (await response.json()) as ApiResponse<unknown>;

      if (result.code !== SUCCESS_CODE) {
        throw new Error(result.message || '业务处理失败');
      }

      return result.data;
    },

    onError(error) {
      const message = error instanceof Error ? error.message : '网络请求异常';
      ElMessage.error(message);
      console.error('[Alova 请求异常]', error);
    },

    onComplete() {
      // 这里可扩展全局 loading 关闭、请求埋点、链路日志等逻辑
    }
  }
});
```

### 请求适配器配置

本项目默认使用 `alova/fetch` 作为请求适配器。官方快速开始文档中推荐使用 `alova/fetch`，它基于 Fetch API 封装，创建实例时通过 `requestAdapter: adapterFetch()` 接入。([Alova.JS](https://alova.js.org/tutorial/getting-started/quick-start))

Fetch 适配器适合大多数中后台接口请求场景，例如 JSON 查询、新增、编辑、删除、分页查询等。如果项目涉及上传进度监听，需注意官方文档说明：受 Fetch API 限制，`alova/fetch` 不支持上传进度，上传进度场景可改用 XMLHttpRequest 或 Axios 适配器。([Alova.JS](https://alova.js.org/tutorial/getting-started/basic/method))

在 Method 实例中可以继续传入 Fetch 支持的配置，例如 `credentials`、`mode`、`cacheFor`、`timeout` 等。

```typescript
import { alovaInstance } from '@/utils/request/alova';

/**
 * 示例：携带 Fetch 配置的请求
 */
export const getCurrentUser = () => {
  return alovaInstance.Get('/system/user/current', {
    timeout: 10000,
    credentials: 'same-origin',
    cacheFor: 0
  });
};
```

### 响应数据结构约定

前后端需要约定统一响应结构。Alova 的全局响应拦截器可以统一解析响应数据，官方文档中 `responded` 可用于统一解析响应、处理错误和请求完成逻辑。([Alova.JS](https://alova.js.org/tutorial/getting-started/basic/global-interceptor))

建议后端统一返回如下结构：

```json
{
  "code": 200,
  "message": "操作成功",
  "data": {}
}
```

前端定义通用响应类型，所有 API 模块复用该类型。

文件位置：`src/types/http.ts`

```typescript
/**
 * 后端统一响应结构
 */
export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data: T;
}

/**
 * 分页查询参数
 */
export interface PageQuery {
  pageNum: number;
  pageSize: number;
}

/**
 * 分页响应结构
 */
export interface PageResult<T = unknown> {
  records: T[];
  total: number;
  pageNum: number;
  pageSize: number;
}

/**
 * 通用 ID 类型
 */
export type IdType = string | number;

/**
 * 通用删除参数
 */
export interface DeleteParams {
  id: IdType;
}
```

因为全局响应拦截器已经返回 `result.data`，所以业务 API 的泛型建议直接声明为 `data` 的实际类型，而不是声明为完整的 `ApiResponse<T>`。

```typescript
import { alovaInstance } from '@/utils/request/alova';
import type { PageResult } from '@/types/http';
import type { UserItem, UserPageQuery } from '@/types/user';

/**
 * 查询用户分页列表
 */
export const getUserPage = (params: UserPageQuery) => {
  return alovaInstance.Get<PageResult<UserItem>>('/system/user/page', {
    params
  });
};
```

### 全局请求配置

全局请求配置主要包括 `baseURL`、请求头、Token 注入、HTTP 错误处理、业务错误处理和登录失效处理。官方全局拦截器文档说明，`beforeRequest` 会在所有请求前触发，可统一修改请求参数；`responded` 可分别处理成功、失败和完成逻辑。([Alova.JS](https://alova.js.org/tutorial/getting-started/basic/global-interceptor))

建议的全局配置规则如下：

| 配置项          | 处理方式                                              |
| --------------- | ----------------------------------------------------- |
| `baseURL`       | 从 `VITE_API_BASE_URL` 读取，区分开发、测试、生产环境 |
| `Content-Type`  | 默认使用 `application/json;charset=UTF-8`             |
| `Authorization` | 从本地缓存或 Pinia 中读取 Token 后注入                |
| HTTP 错误       | 通过 `response.ok` 和 `response.status` 判断          |
| 业务错误        | 通过后端响应 `code` 判断                              |
| 登录失效        | 识别 `401` 或业务登录失效码，清理 Token 并跳转登录    |
| 异常提示        | 通过 Element Plus 的 `ElMessage` 统一提示             |
| 日志输出        | 开发环境输出请求异常，便于排查联调问题                |

如果项目更倾向于使用 Pinia 管理 Token，可以将 `getAccessToken` 替换为 Auth Store。

文件位置：`src/stores/auth.ts`

```typescript
import { defineStore } from 'pinia';

interface AuthState {
  accessToken: string;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    accessToken: localStorage.getItem('access_token') || ''
  }),

  actions: {
    setAccessToken(token: string) {
      this.accessToken = token;
      localStorage.setItem('access_token', token);
    },

    clearAccessToken() {
      this.accessToken = '';
      localStorage.removeItem('access_token');
    }
  }
});
```

## API 模块设计

API 模块设计的核心目标是让页面组件不直接拼接 URL，也不直接关心请求实例配置。页面只调用业务 API 方法，再结合 `useRequest`、`useWatcher`、`usePagination` 等请求策略处理状态。Alova 官方文档中，Method 实例用于描述请求类型、请求 URL、请求头、请求参数和请求行为，支持 GET、POST、PUT、DELETE、PATCH 等请求类型。([Alova.JS](https://alova.js.org/tutorial/getting-started/basic/method))

### 接口目录划分

接口目录建议按业务域划分，每个业务模块维护自己的接口方法。模块之间不要互相引用，公共类型放在 `src/types` 中。

推荐结构如下：

```text
src
├── api
│   ├── modules
│   │   ├── user.ts
│   │   ├── role.ts
│   │   ├── menu.ts
│   │   └── dict.ts
│   └── index.ts
├── types
│   ├── http.ts
│   ├── user.ts
│   ├── role.ts
│   └── menu.ts
└── utils
    └── request
        └── alova.ts
```

接口模块职责建议如下：

| 文件                      | 职责                                       |
| ------------------------- | ------------------------------------------ |
| `src/api/modules/user.ts` | 用户查询、新增、编辑、删除、详情、状态变更 |
| `src/api/modules/role.ts` | 角色查询、授权、角色菜单绑定               |
| `src/api/modules/menu.ts` | 菜单树、权限标识、路由菜单                 |
| `src/api/modules/dict.ts` | 字典类型、字典项、下拉选项                 |
| `src/api/index.ts`        | 统一导出各业务 API 模块                    |

统一导出文件可以减少页面中的导入路径分散问题。

文件位置：`src/api/index.ts`

```typescript
export * from './modules/user';
export * from './modules/role';
export * from './modules/menu';
export * from './modules/dict';
```

### Method 实例封装

Alova 中的 `Get`、`Post`、`Put`、`Delete` 等方法用于创建 Method 实例。官方文档说明，GET 使用 `alovaInstance.Get(url[, config])`，POST 使用 `alovaInstance.Post(url[, data[, config]])`，请求参数可通过 `params`、请求体、`headers` 等配置传入。([Alova.JS](https://alova.js.org/tutorial/getting-started/basic/method))

下面示例按用户模块封装常见 CRUD 接口。

文件位置：`src/api/modules/user.ts`

```typescript
import { alovaInstance } from '@/utils/request/alova';
import type { IdType, PageResult } from '@/types/http';
import type {
  UserCreateForm,
  UserDetail,
  UserItem,
  UserPageQuery,
  UserUpdateForm
} from '@/types/user';

/**
 * 查询用户分页列表
 */
export const getUserPage = (params: UserPageQuery) => {
  return alovaInstance.Get<PageResult<UserItem>>('/system/user/page', {
    params,
    cacheFor: 0
  });
};

/**
 * 查询用户详情
 */
export const getUserDetail = (id: IdType) => {
  return alovaInstance.Get<UserDetail>(`/system/user/${id}`, {
    cacheFor: 0
  });
};

/**
 * 新增用户
 */
export const createUser = (data: UserCreateForm) => {
  return alovaInstance.Post<boolean>('/system/user', data);
};

/**
 * 修改用户
 */
export const updateUser = (data: UserUpdateForm) => {
  return alovaInstance.Put<boolean>('/system/user', data);
};

/**
 * 删除用户
 */
export const deleteUser = (id: IdType) => {
  return alovaInstance.Delete<boolean>(`/system/user/${id}`);
};

/**
 * 修改用户状态
 */
export const updateUserStatus = (id: IdType, enabled: boolean) => {
  return alovaInstance.Patch<boolean>(`/system/user/${id}/status`, {
    enabled
  });
};
```

页面组件中不直接创建 URL，而是调用 API 方法并交给 `useRequest` 管理状态。官方文档中，`useRequest` 可以自动维护 `loading`、`data`、`error` 等响应式请求状态，并支持 `send`、`update` 等操作函数。([Alova.JS](https://alova.js.org/tutorial/getting-started/basic/combine-framework))

```typescript
import { reactive } from 'vue';
import { useRequest } from 'alova/client';
import { getUserPage } from '@/api';

const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  username: '',
  enabled: undefined
});

const {
  loading,
  data,
  error,
  send: reloadUserPage
} = useRequest(() => getUserPage(queryParams), {
  immediate: true,
  initialData: {
    records: [],
    total: 0,
    pageNum: 1,
    pageSize: 10
  }
});
```

### 请求参数类型定义

请求参数类型建议按接口用途拆分，不要使用一个大对象覆盖所有场景。查询参数、创建表单、编辑表单、状态修改参数应分别定义，便于页面表单校验和接口参数维护。

文件位置：`src/types/user.ts`

```typescript
import type { PageQuery } from '@/types/http';

/**
 * 用户分页查询参数
 */
export interface UserPageQuery extends PageQuery {
  username?: string;
  mobile?: string;
  enabled?: boolean;
}

/**
 * 新增用户表单
 */
export interface UserCreateForm {
  username: string;
  nickname: string;
  mobile?: string;
  email?: string;
  password: string;
  roleIds: Array<number | string>;
  enabled: boolean;
}

/**
 * 修改用户表单
 */
export interface UserUpdateForm {
  id: number | string;
  username: string;
  nickname: string;
  mobile?: string;
  email?: string;
  roleIds: Array<number | string>;
  enabled: boolean;
}

/**
 * 修改用户状态参数
 */
export interface UserStatusUpdateParam {
  id: number | string;
  enabled: boolean;
}
```

类型设计建议：

| 类型                    | 使用位置                         |
| ----------------------- | -------------------------------- |
| `UserPageQuery`         | 用户分页查询、条件筛选、列表刷新 |
| `UserCreateForm`        | 新增用户弹窗、表单提交           |
| `UserUpdateForm`        | 编辑用户弹窗、详情回显后提交     |
| `UserStatusUpdateParam` | 启用、停用、锁定等状态变更操作   |

### 响应数据类型定义

响应数据类型建议按照后端返回的 `data` 字段定义。由于全局 `responded.onSuccess` 已经返回 `result.data`，所以页面拿到的 `data` 就是业务数据本身，不再包含 `code`、`message` 外层结构。

文件位置：`src/types/user.ts`

```typescript
/**
 * 用户列表项
 */
export interface UserItem {
  id: number | string;
  username: string;
  nickname: string;
  mobile?: string;
  email?: string;
  enabled: boolean;
  createTime: string;
}

/**
 * 用户详情
 */
export interface UserDetail {
  id: number | string;
  username: string;
  nickname: string;
  mobile?: string;
  email?: string;
  enabled: boolean;
  roleIds: Array<number | string>;
  createTime: string;
  updateTime?: string;
}

/**
 * 用户下拉选项
 */
export interface UserOption {
  label: string;
  value: number | string;
}
```

列表接口返回分页结构时，API 泛型写法如下：

```typescript
import type { PageResult } from '@/types/http';
import type { UserItem } from '@/types/user';

type UserPageResult = PageResult<UserItem>;
```

详情接口返回单个对象时，API 泛型写法如下：

```typescript
import type { UserDetail } from '@/types/user';

type UserDetailResult = UserDetail;
```

这种设计可以让页面组件中的数据类型更加明确。例如分页列表中 `data.records` 自动推导为 `UserItem[]`，详情接口中 `data` 自动推导为 `UserDetail`。接口字段变更时，TypeScript 能在组件、表单、表格列和 API 调用处提前暴露类型问题。



## 请求状态管理

请求状态管理用于统一处理接口调用过程中的加载状态、错误状态、响应数据和手动刷新动作。Alova 官方文档中，`useRequest` 是常用请求策略之一，调用后默认会立即发送请求，并自动维护 `loading`、`data`、`error` 等响应式状态，适合页面初始化查询、详情加载、手动刷新等场景。([Alova.JS](https://alova.js.org/tutorial/getting-started/basic/combine-framework))

### useRequest 基础使用

`useRequest` 通常在 Vue3 页面组件的 `script setup` 顶层调用，不建议放在事件回调、条件判断或循环中。官方文档明确说明，`useRequest` 属于 Hook 使用方式，应在组件函数最外层调用；如果需要点击按钮后再请求，应设置 `immediate: false`，再通过 `send` 手动触发。([Alova.JS](https://alova.js.org/tutorial/getting-started/basic/combine-framework))

下面示例用于用户列表页面，展示如何通过 `useRequest` 查询分页数据。

文件位置：`src/views/user/UserList.vue`

```vue
<template>
  <div class="p-4">
    <el-card shadow="never">
      <template #header>
        <div class="flex items-center justify-between">
          <span>用户管理</span>
          <el-button type="primary" @click="handleRefresh">
            刷新
          </el-button>
        </div>
      </template>

      <el-form :inline="true" :model="queryParams">
        <el-form-item label="用户名">
          <el-input
            v-model="queryParams.username"
            clearable
            placeholder="请输入用户名"
            @keyup.enter="handleSearch"
          />
        </el-form-item>

        <el-form-item label="状态">
          <el-select
            v-model="queryParams.enabled"
            clearable
            placeholder="请选择状态"
            style="width: 160px"
          >
            <el-option label="启用" :value="true" />
            <el-option label="停用" :value="false" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :loading="loading" @click="handleSearch">
            查询
          </el-button>
          <el-button @click="handleReset">
            重置
          </el-button>
        </el-form-item>
      </el-form>

      <el-alert
        v-if="error"
        type="error"
        show-icon
        :closable="false"
        :title="error.message || '用户列表加载失败'"
        class="mb-4"
      />

      <el-table
        v-loading="loading"
        :data="data.records"
        row-key="id"
        border
      >
        <el-table-column prop="username" label="用户名" min-width="140" />
        <el-table-column prop="nickname" label="昵称" min-width="140" />
        <el-table-column prop="mobile" label="手机号" min-width="140" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.enabled ? 'success' : 'danger'">
              {{ row.enabled ? '启用' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="180" />
      </el-table>

      <div class="mt-4 flex justify-end">
        <el-pagination
          v-model:current-page="queryParams.pageNum"
          v-model:page-size="queryParams.pageSize"
          :total="data.total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleRefresh"
          @current-change="handleRefresh"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useRequest } from 'alova/client';
import { getUserPage } from '@/api';
import type { PageResult } from '@/types/http';
import type { UserItem, UserPageQuery } from '@/types/user';

const createInitialPageData = (): PageResult<UserItem> => ({
  records: [],
  total: 0,
  pageNum: 1,
  pageSize: 10
});

const queryParams = reactive<UserPageQuery>({
  pageNum: 1,
  pageSize: 10,
  username: '',
  enabled: undefined
});

const {
  loading,
  data,
  error,
  send: loadUserPage
} = useRequest(() => getUserPage(queryParams), {
  immediate: true,
  initialData: createInitialPageData()
});

const handleRefresh = () => {
  loadUserPage();
};

const handleSearch = () => {
  queryParams.pageNum = 1;
  loadUserPage();
};

const handleReset = () => {
  queryParams.pageNum = 1;
  queryParams.pageSize = 10;
  queryParams.username = '';
  queryParams.enabled = undefined;
  loadUserPage();
};
</script>
```

### 加载状态处理

加载状态主要用于按钮禁用、表格遮罩、详情骨架屏、提交按钮 loading 等位置。`useRequest` 返回的 `loading` 是响应式状态，在 Vue 模板中可以直接使用，在 `script setup` 逻辑中需要按 Vue 响应式对象的方式读取。官方文档示例也展示了通过 `loading` 控制视图加载状态。([Alova.JS](https://alova.js.org/tutorial/getting-started/basic/combine-framework))

常见处理方式如下：

```vue
<template>
  <el-button type="primary" :loading="loading" @click="loadUserPage">
    重新加载
  </el-button>

  <el-table
    v-loading="loading"
    :data="data.records"
    border
  >
    <el-table-column prop="username" label="用户名" />
  </el-table>
</template>
```

加载状态使用规范如下：

| 场景           | 建议处理                                                |
| -------------- | ------------------------------------------------------- |
| 页面初始化查询 | 使用 `v-loading` 或骨架屏                               |
| 查询按钮       | 绑定 `:loading="loading"`                               |
| 提交按钮       | 使用独立的提交请求 `loading`，避免和列表查询混用        |
| 删除按钮       | 删除请求建议使用独立 `useRequest`，避免影响列表 loading |
| 分页切换       | 复用列表查询 loading 即可                               |

### 错误状态处理

错误状态用于展示当前请求的失败原因。全局响应拦截器已经处理了通用错误提示，但页面级错误仍然有必要保留，尤其是列表、详情、图表等主要数据区域。`useRequest` 支持 `onError` 事件回调，官方文档中也说明可以通过 `onError` 获取错误信息和当前 Method 实例。([Alova.JS](https://alova.js.org/tutorial/getting-started/basic/combine-framework))

下面示例用于在页面内处理错误展示和日志输出。

```typescript
import { useRequest } from 'alova/client';
import { ElMessage } from 'element-plus';
import { getUserPage } from '@/api';

const {
  loading,
  data,
  error,
  send: loadUserPage,
  onError,
  onSuccess,
  onComplete
} = useRequest(() => getUserPage(queryParams), {
  immediate: true,
  initialData: createInitialPageData()
});

onSuccess(({ data }) => {
  console.debug('[用户列表] 查询成功', data);
});

onError(({ error }) => {
  ElMessage.error(error.message || '用户列表查询失败');
  console.error('[用户列表] 查询失败', error);
});

onComplete(({ status }) => {
  console.debug('[用户列表] 请求完成，状态：', status);
});
```

错误处理建议分为两层：

| 层级           | 职责                                               |
| -------------- | -------------------------------------------------- |
| 全局响应拦截器 | 处理 HTTP 错误、登录失效、统一业务错误提示         |
| 页面请求逻辑   | 处理当前页面的错误展示、空状态、重试按钮、业务日志 |

### 请求结果响应式绑定

请求结果响应式绑定用于将接口返回数据直接绑定到模板。列表场景建议通过 `initialData` 初始化为空分页结构，避免模板首次渲染时访问 `undefined.records` 报错。官方文档说明，`data` 在请求成功前默认是 `undefined`，列表场景通常需要通过 `initialData` 设置为数组或默认对象。([Alova.JS](https://alova.js.org/tutorial/client/strategy/use-request))

下面示例展示了分页结果的推荐初始化方式。

```typescript
import type { PageResult } from '@/types/http';
import type { UserItem } from '@/types/user';

const createInitialPageData = (): PageResult<UserItem> => ({
  records: [],
  total: 0,
  pageNum: 1,
  pageSize: 10
});

const { data } = useRequest(() => getUserPage(queryParams), {
  initialData: createInitialPageData()
});
```

模板中直接绑定 `data.records` 和 `data.total`。

```vue
<template>
  <el-table :data="data.records" border>
    <el-table-column prop="username" label="用户名" />
    <el-table-column prop="nickname" label="昵称" />
  </el-table>

  <el-pagination
    v-model:current-page="queryParams.pageNum"
    v-model:page-size="queryParams.pageSize"
    :total="data.total"
    layout="total, sizes, prev, pager, next"
    @size-change="loadUserPage"
    @current-change="loadUserPage"
  />
</template>
```

如果需要手动修改响应式数据，可以使用 `update`，也可以直接修改响应式数据。官方示例中提供了 `update({ data: ... })` 的方式用于手动更新请求结果。([Alova.JS](https://alova.js.org/tutorial/getting-started/basic/combine-framework))

```typescript
const {
  data,
  update
} = useRequest(() => getUserPage(queryParams), {
  initialData: createInitialPageData()
});

const removeRowFromTable = (id: string | number) => {
  update({
    data: {
      ...data.value,
      records: data.value.records.filter(item => item.id !== id),
      total: data.value.total - 1
    }
  });
};
```

## 表单与提交场景

表单与提交场景主要处理新增、编辑、删除、状态变更等写操作。Alova 可以通过 `useRequest` 手动提交，也可以通过 `useForm` 管理表单数据、提交状态、自动重置、草稿和多步骤表单。官方文档说明，`useForm` 专门用于表单提交，返回 `form`、`loading`、`send`、`updateForm`、`reset` 等能力，并且默认不会立即请求，需要调用 `send` 后才提交。([Alova.JS](https://alova.js.org/tutorial/client/strategy/use-form))

### 新增数据提交

新增数据提交建议使用 `immediate: false`，避免组件初始化时自动发起提交请求。提交前先进行表单校验，校验通过后调用 `send(formData)`，提交成功后关闭弹窗、重置表单并刷新列表。官方文档说明，`send` 会返回 Promise，适合在提交成功后继续执行刷新、提示等业务动作。([Alova.JS](https://alova.js.org/tutorial/getting-started/basic/combine-framework))

下面示例用于用户新增弹窗。

文件位置：`src/views/user/components/UserCreateDialog.vue`

```vue
<template>
  <el-dialog
    v-model="visible"
    title="新增用户"
    width="600px"
    destroy-on-close
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="90px"
    >
      <el-form-item label="用户名" prop="username">
        <el-input v-model="formData.username" placeholder="请输入用户名" />
      </el-form-item>

      <el-form-item label="昵称" prop="nickname">
        <el-input v-model="formData.nickname" placeholder="请输入昵称" />
      </el-form-item>

      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="formData.mobile" placeholder="请输入手机号" />
      </el-form-item>

      <el-form-item label="密码" prop="password">
        <el-input
          v-model="formData.password"
          type="password"
          show-password
          placeholder="请输入密码"
        />
      </el-form-item>

      <el-form-item label="状态" prop="enabled">
        <el-switch
          v-model="formData.enabled"
          active-text="启用"
          inactive-text="停用"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button :disabled="submitting" @click="handleCancel">
        取消
      </el-button>
      <el-button type="primary" :loading="submitting" @click="handleSubmit">
        保存
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRequest } from 'alova/client';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
import { createUser } from '@/api';
import type { UserCreateForm } from '@/types/user';

const emit = defineEmits<{
  success: [];
}>();

const visible = defineModel<boolean>('visible', {
  default: false
});

const formRef = ref<FormInstance>();

const createInitialForm = (): UserCreateForm => ({
  username: '',
  nickname: '',
  mobile: '',
  email: '',
  password: '',
  roleIds: [],
  enabled: true
});

const formData = reactive<UserCreateForm>(createInitialForm());

const formRules: FormRules<UserCreateForm> = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
};

const {
  loading: submitting,
  send: submitCreateUser
} = useRequest((data: UserCreateForm) => createUser(data), {
  immediate: false
});

const resetForm = () => {
  Object.assign(formData, createInitialForm());
  formRef.value?.clearValidate();
};

const handleCancel = () => {
  visible.value = false;
  resetForm();
};

const handleSubmit = async () => {
  await formRef.value?.validate();

  await submitCreateUser({ ...formData });

  ElMessage.success('新增用户成功');
  visible.value = false;
  resetForm();
  emit('success');
};
</script>
```

父页面调用新增弹窗时，只需要监听成功事件刷新列表。

```vue
<template>
  <el-button type="primary" @click="createDialogVisible = true">
    新增用户
  </el-button>

  <UserCreateDialog
    v-model:visible="createDialogVisible"
    @success="loadUserPage"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import UserCreateDialog from './components/UserCreateDialog.vue';

const createDialogVisible = ref(false);
</script>
```

### 编辑数据提交

编辑数据提交通常包含两个动作：先加载详情并回显表单，再提交修改。可以用一个 `useRequest` 查询详情，另一个 `useRequest` 提交编辑。官方文档说明，`useRequest` 的 `send` 可以手动触发请求并传入参数，参数可以被 Method Handler 接收，适合详情查询、删除、编辑提交等场景。([Alova.JS](https://alova.js.org/tutorial/client/strategy/use-request))

下面示例用于用户编辑弹窗。

文件位置：`src/views/user/components/UserEditDialog.vue`

```vue
<template>
  <el-dialog
    v-model="visible"
    title="编辑用户"
    width="600px"
    destroy-on-close
    @open="handleOpen"
  >
    <el-skeleton v-if="detailLoading" :rows="5" animated />

    <el-form
      v-else
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="90px"
    >
      <el-form-item label="用户名" prop="username">
        <el-input v-model="formData.username" disabled />
      </el-form-item>

      <el-form-item label="昵称" prop="nickname">
        <el-input v-model="formData.nickname" placeholder="请输入昵称" />
      </el-form-item>

      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="formData.mobile" placeholder="请输入手机号" />
      </el-form-item>

      <el-form-item label="邮箱" prop="email">
        <el-input v-model="formData.email" placeholder="请输入邮箱" />
      </el-form-item>

      <el-form-item label="状态" prop="enabled">
        <el-switch
          v-model="formData.enabled"
          active-text="启用"
          inactive-text="停用"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button :disabled="submitting" @click="visible = false">
        取消
      </el-button>
      <el-button
        type="primary"
        :loading="submitting"
        :disabled="detailLoading"
        @click="handleSubmit"
      >
        保存
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRequest } from 'alova/client';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
import { getUserDetail, updateUser } from '@/api';
import type { IdType } from '@/types/http';
import type { UserUpdateForm } from '@/types/user';

const props = defineProps<{
  userId?: IdType;
}>();

const emit = defineEmits<{
  success: [];
}>();

const visible = defineModel<boolean>('visible', {
  default: false
});

const formRef = ref<FormInstance>();

const createInitialForm = (): UserUpdateForm => ({
  id: '',
  username: '',
  nickname: '',
  mobile: '',
  email: '',
  roleIds: [],
  enabled: true
});

const formData = reactive<UserUpdateForm>(createInitialForm());

const formRules: FormRules<UserUpdateForm> = {
  nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }]
};

const {
  loading: detailLoading,
  send: loadUserDetail
} = useRequest((id: IdType) => getUserDetail(id), {
  immediate: false
});

const {
  loading: submitting,
  send: submitUpdateUser
} = useRequest((data: UserUpdateForm) => updateUser(data), {
  immediate: false
});

const handleOpen = async () => {
  if (!props.userId) {
    return;
  }

  const detail = await loadUserDetail(props.userId);

  Object.assign(formData, {
    id: detail.id,
    username: detail.username,
    nickname: detail.nickname,
    mobile: detail.mobile || '',
    email: detail.email || '',
    roleIds: detail.roleIds || [],
    enabled: detail.enabled
  });
};

const handleSubmit = async () => {
  await formRef.value?.validate();

  await submitUpdateUser({ ...formData });

  ElMessage.success('修改用户成功');
  visible.value = false;
  emit('success');
};
</script>
```

### 删除确认请求

删除操作必须先进行二次确认，避免误删。删除请求建议使用独立的 `useRequest`，并设置 `immediate: false`，用户确认后再调用 `send(id)`。删除成功后刷新列表或手动移除当前行。

下面示例用于列表页中的删除操作。

```typescript
import { useRequest } from 'alova/client';
import { ElMessage, ElMessageBox } from 'element-plus';
import { deleteUser } from '@/api';
import type { IdType } from '@/types/http';

const {
  loading: deleting,
  send: submitDeleteUser
} = useRequest((id: IdType) => deleteUser(id), {
  immediate: false
});

const handleDelete = async (id: IdType) => {
  await ElMessageBox.confirm(
    '确认删除该用户吗？删除后数据不可恢复。',
    '删除确认',
    {
      confirmButtonText: '确认删除',
      cancelButtonText: '取消',
      type: 'warning'
    }
  );

  await submitDeleteUser(id);

  ElMessage.success('删除用户成功');
  loadUserPage();
};
```

模板中可以将删除按钮和删除 loading 绑定起来。

```vue
<el-table-column label="操作" width="180" fixed="right">
  <template #default="{ row }">
    <el-button type="primary" link @click="handleEdit(row.id)">
      编辑
    </el-button>
    <el-button
      type="danger"
      link
      :loading="deleting"
      @click="handleDelete(row.id)"
    >
      删除
    </el-button>
  </template>
</el-table-column>
```

删除按钮的 loading 如果直接使用全局 `deleting`，多个删除按钮会同时显示 loading。更精确的做法是记录当前删除行 ID。

```typescript
import { ref } from 'vue';
import type { IdType } from '@/types/http';

const deletingId = ref<IdType>();

const handleDelete = async (id: IdType) => {
  await ElMessageBox.confirm('确认删除该用户吗？', '删除确认', {
    confirmButtonText: '确认删除',
    cancelButtonText: '取消',
    type: 'warning'
  });

  deletingId.value = id;

  try {
    await submitDeleteUser(id);
    ElMessage.success('删除用户成功');
    loadUserPage();
  } finally {
    deletingId.value = undefined;
  }
};
<el-button
  type="danger"
  link
  :loading="deletingId === row.id"
  @click="handleDelete(row.id)"
>
  删除
</el-button>
```

### 防重复提交处理

防重复提交主要用于新增、编辑、删除、状态切换等写操作。最直接的方式是使用 `loading` 状态禁用按钮；在事件函数中也可以通过 `if (loading.value) return` 做二次保护。`send` 支持重复手动触发请求，因此业务代码需要明确控制提交入口，避免用户快速点击导致重复请求。([Alova.JS](https://alova.js.org/tutorial/client/strategy/use-request))

下面示例用于提交按钮防重复点击。

```typescript
const handleSubmit = async () => {
  if (submitting.value) {
    return;
  }

  await formRef.value?.validate();

  await submitCreateUser({ ...formData });

  ElMessage.success('保存成功');
  visible.value = false;
  emit('success');
};
```

模板中同步禁用按钮。

```vue
<el-button
  type="primary"
  :loading="submitting"
  :disabled="submitting"
  @click="handleSubmit"
>
  保存
</el-button>
```

如果需要在多个提交场景中复用防重复逻辑，可以封装一个简单的提交锁。

文件位置：`src/composables/useSubmitLock.ts`

```typescript
import { ref } from 'vue';

export const useSubmitLock = () => {
  const locked = ref(false);

  const runWithLock = async <T>(task: () => Promise<T>) => {
    if (locked.value) {
      return undefined;
    }

    locked.value = true;

    try {
      return await task();
    } finally {
      locked.value = false;
    }
  };

  return {
    locked,
    runWithLock
  };
};
```

在表单组件中使用提交锁。

```typescript
import { useSubmitLock } from '@/composables/useSubmitLock';

const {
  locked,
  runWithLock
} = useSubmitLock();

const handleSubmit = () => {
  runWithLock(async () => {
    await formRef.value?.validate();
    await submitCreateUser({ ...formData });

    ElMessage.success('保存成功');
    visible.value = false;
    emit('success');
  });
};
<el-button
  type="primary"
  :loading="locked || submitting"
  :disabled="locked || submitting"
  @click="handleSubmit"
>
  保存
</el-button>
```

在实际项目中，按钮 loading、防重复提交锁、接口幂等设计应同时使用。前端防重复只能降低误操作概率，核心业务仍建议后端通过唯一业务号、幂等 Token、唯一索引或状态机校验保证数据一致性。



## 列表与分页场景

列表与分页场景用于处理后台管理系统中最常见的数据查询页面，例如用户列表、角色列表、订单列表、日志列表等。Alova 提供 `usePagination` 请求策略，适合分页、加载更多、页码切换、筛选条件变化、分页缓存、相邻页预加载和列表项操作等场景。官方文档说明，`usePagination` 可以管理分页状态、分页事件、页码和页大小变化后的自动请求、列表缓存、相邻页预加载、筛选条件监听以及搜索防抖。([Alova.JS](https://alova.js.org/tutorial/client/strategy/use-pagination/))

### 查询参数管理

查询参数建议拆分为分页参数和筛选参数。分页参数由 `usePagination` 内部维护，筛选参数由页面组件维护。当筛选参数变化时，可以通过 `watchingStates` 触发列表重新请求，避免手动写大量 `watch` 和 `loadList` 逻辑。

文件位置：`src/views/user/UserPage.vue`

```vue
<template>
  <div class="p-4">
    <el-card shadow="never">
      <el-form :inline="true">
        <el-form-item label="用户名">
          <el-input
            v-model="username"
            clearable
            placeholder="请输入用户名"
            @keyup.enter="handleSearch"
          />
        </el-form-item>

        <el-form-item label="状态">
          <el-select
            v-model="enabled"
            clearable
            placeholder="请选择状态"
            style="width: 160px"
          >
            <el-option label="启用" :value="true" />
            <el-option label="停用" :value="false" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :loading="loading" @click="handleSearch">
            查询
          </el-button>
          <el-button @click="handleReset">
            重置
          </el-button>
        </el-form-item>
      </el-form>

      <el-table
        v-loading="loading"
        :data="data"
        row-key="id"
        border
      >
        <el-table-column prop="username" label="用户名" min-width="140" />
        <el-table-column prop="nickname" label="昵称" min-width="140" />
        <el-table-column prop="mobile" label="手机号" min-width="140" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.enabled ? 'success' : 'danger'">
              {{ row.enabled ? '启用' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="180" />
      </el-table>

      <div class="mt-4 flex justify-end">
        <el-pagination
          v-model:current-page="page"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { usePagination } from 'alova/client';
import { getUserPage } from '@/api';
import type { PageResult } from '@/types/http';
import type { UserItem } from '@/types/user';

const username = ref('');
const enabled = ref<boolean>();

const {
  loading,
  data,
  page,
  pageSize,
  total,
  send: reloadUserPage
} = usePagination(
  (currentPage, currentPageSize) => {
    return getUserPage({
      pageNum: currentPage,
      pageSize: currentPageSize,
      username: username.value,
      enabled: enabled.value
    });
  },
  {
    initialPage: 1,
    initialPageSize: 10,
    initialData: {
      records: [],
      total: 0,
      pageNum: 1,
      pageSize: 10
    } as PageResult<UserItem>,
    data: response => response.records,
    total: response => response.total,
    watchingStates: [username, enabled],
    debounce: 300
  }
);

const handleSearch = () => {
  page.value = 1;
  reloadUserPage();
};

const handleReset = () => {
  username.value = '';
  enabled.value = undefined;
  page.value = 1;
  reloadUserPage();
};
</script>
```

这里将 `username` 和 `enabled` 定义为独立 `ref`，是为了让 `usePagination` 的 `watchingStates` 能明确监听筛选条件。官方文档中，`watchingStates` 用于监听筛选条件变化并重新请求，`debounce` 可用于请求防抖，适合搜索框、下拉筛选、Tab 切换等场景。([Alova.JS](https://alova.js.org/tutorial/client/strategy/use-pagination/))

### 分页接口封装

分页接口建议统一使用 `PageQuery` 和 `PageResult<T>` 类型，避免每个接口重复定义 `pageNum`、`pageSize`、`records`、`total` 等字段。后端如果字段名不同，例如返回 `list`、`rows`、`totalCount`，也建议在全局响应层或 API 模块中转换为统一分页结构。

文件位置：`src/types/http.ts`

```typescript
/**
 * 分页查询参数
 */
export interface PageQuery {
  pageNum: number;
  pageSize: number;
}

/**
 * 分页响应结构
 */
export interface PageResult<T = unknown> {
  records: T[];
  total: number;
  pageNum: number;
  pageSize: number;
}
```

文件位置：`src/types/user.ts`

```typescript
import type { PageQuery } from '@/types/http';

/**
 * 用户分页查询参数
 */
export interface UserPageQuery extends PageQuery {
  username?: string;
  mobile?: string;
  enabled?: boolean;
}

/**
 * 用户列表项
 */
export interface UserItem {
  id: number | string;
  username: string;
  nickname: string;
  mobile?: string;
  email?: string;
  enabled: boolean;
  createTime: string;
}
```

文件位置：`src/api/modules/user.ts`

```typescript
import { alovaInstance } from '@/utils/request/alova';
import type { PageResult } from '@/types/http';
import type { UserItem, UserPageQuery } from '@/types/user';

/**
 * 查询用户分页列表
 */
export const getUserPage = (params: UserPageQuery) => {
  return alovaInstance.Get<PageResult<UserItem>>('/system/user/page', {
    name: 'userPage',
    params,
    cacheFor: 0
  });
};
```

`name: 'userPage'` 不是必填项，但建议为核心列表接口设置稳定的 Method 名称。后续做缓存失效、快照匹配、跨组件刷新时，可以通过 Method 名称定位相关请求。

### 条件筛选请求

条件筛选请求有两种常用方式。简单列表可以使用按钮点击后手动请求；搜索框、状态筛选、Tab 切换等自动筛选场景，建议使用 `watchingStates` 或 `useWatcher`。

`usePagination` 的筛选方式如下：

```typescript
const username = ref('');
const enabled = ref<boolean>();

const {
  loading,
  data,
  page,
  pageSize,
  total
} = usePagination(
  (currentPage, currentPageSize) => {
    return getUserPage({
      pageNum: currentPage,
      pageSize: currentPageSize,
      username: username.value,
      enabled: enabled.value
    });
  },
  {
    initialPage: 1,
    initialPageSize: 10,
    initialData: {
      records: [],
      total: 0,
      pageNum: 1,
      pageSize: 10
    },
    data: response => response.records,
    total: response => response.total,
    watchingStates: [username, enabled],
    debounce: 300
  }
);
```

如果不是分页列表，只是条件变化后重新请求普通数据，可以使用 `useWatcher`。官方文档说明，`useWatcher` 适合分页、数据筛选、模糊搜索、Tab 切换等“状态变化后重新请求”的场景。([Alova.JS](https://alova.js.org/tutorial/client/strategy/use-watcher/))

```typescript
import { ref } from 'vue';
import { useWatcher } from 'alova/client';
import { getUserOptions } from '@/api';

const keyword = ref('');

const {
  loading,
  data,
  error
} = useWatcher(
  () => getUserOptions(keyword.value),
  [keyword],
  {
    initialData: [],
    debounce: 300
  }
);
```

筛选请求建议遵循以下规则：

| 场景           | 建议                                                     |
| -------------- | -------------------------------------------------------- |
| 点击查询按钮   | 手动设置 `page.value = 1` 后调用 `send`                  |
| 输入框模糊搜索 | 使用 `watchingStates` 或 `useWatcher`，并配置 `debounce` |
| 下拉状态筛选   | 使用 `watchingStates` 自动触发                           |
| Tab 切换筛选   | 使用 `watchingStates` 自动触发                           |
| 高级查询表单   | 点击查询按钮后手动触发，避免输入过程中频繁请求           |

### 列表刷新机制

列表刷新通常发生在新增、编辑、删除、启用、停用、导入、批量操作之后。刷新方式可以分为重新请求列表和局部更新列表两类。普通后台页面优先使用重新请求，逻辑简单且数据一致性更高；对交互体验要求较高的页面，可以使用 `usePagination` 提供的列表操作能力或手动更新当前列表。

新增、编辑成功后重新加载当前页：

```typescript
const handleSaveSuccess = () => {
  reloadUserPage();
};
```

删除成功后，如果当前页只剩一条数据，可以回退到上一页后重新加载。

```typescript
const handleDeleteSuccess = () => {
  if (data.value.length === 1 && page.value > 1) {
    page.value -= 1;
    return;
  }

  reloadUserPage();
};
```

状态变更成功后，可以直接刷新当前页。

```typescript
import { ElMessage } from 'element-plus';
import { useRequest } from 'alova/client';
import { updateUserStatus } from '@/api';
import type { IdType } from '@/types/http';

const {
  loading: statusChanging,
  send: submitUserStatus
} = useRequest(
  (id: IdType, enabled: boolean) => updateUserStatus(id, enabled),
  {
    immediate: false
  }
);

const handleStatusChange = async (id: IdType, enabled: boolean) => {
  await submitUserStatus(id, enabled);

  ElMessage.success(enabled ? '用户已启用' : '用户已停用');
  reloadUserPage();
};
```

## 缓存与数据更新

缓存与数据更新用于减少重复请求、提升页面响应速度，并在数据变更后保证缓存数据及时失效。Alova 的缓存可以按全局或单个 Method 实例配置；官方文档说明，GET 请求默认有 300000ms，也就是 5 分钟的内存缓存，也可以通过 `cacheFor` 自定义缓存时间或关闭缓存。([Alova.JS](https://alova.js.org/tutorial/cache/mode/))

### 缓存策略配置

缓存策略需要按接口数据变化频率配置，不能所有接口都缓存，也不能所有接口都关闭缓存。列表、详情、字典、权限、系统配置等接口的缓存策略应区别处理。

推荐策略如下：

| 接口类型                     | 建议缓存策略                             |
| ---------------------------- | ---------------------------------------- |
| 用户分页、订单分页、日志分页 | 默认关闭缓存，保证列表数据实时           |
| 字典数据、下拉选项、系统配置 | 开启较长时间缓存                         |
| 用户详情、角色详情           | 可设置短时间缓存，编辑成功后失效         |
| 当前登录用户信息             | 可缓存，但登录、退出、权限变化后必须清理 |
| 权限按钮、菜单路由           | 可缓存，刷新权限或重新登录后清理         |

文件位置：`src/api/modules/dict.ts`

```typescript
import { alovaInstance } from '@/utils/request/alova';

export interface DictOption {
  label: string;
  value: string | number;
}

/**
 * 查询字典选项
 */
export const getDictOptions = (dictType: string) => {
  return alovaInstance.Get<DictOption[]>('/system/dict/options', {
    name: 'dictOptions',
    params: {
      dictType
    },
    cacheFor: {
      mode: 'memory',
      expire: 10 * 60 * 1000
    }
  });
};
```

文件位置：`src/api/modules/user.ts`

```typescript
import { alovaInstance } from '@/utils/request/alova';
import type { IdType } from '@/types/http';
import type { UserDetail } from '@/types/user';

/**
 * 查询用户详情
 */
export const getUserDetail = (id: IdType) => {
  return alovaInstance.Get<UserDetail>(`/system/user/${id}`, {
    name: `userDetail-${id}`,
    cacheFor: 60 * 1000
  });
};
```

`cacheFor: 0` 表示不缓存，适合实时性要求较高的列表；`cacheFor: 60 * 1000` 表示缓存 1 分钟；`cacheFor: { mode: 'memory', expire: ... }` 可以显式声明内存缓存模式和过期时间。官方文档说明，内存缓存是默认缓存模式，刷新页面后客户端内存缓存会失效。([Alova.JS](https://alova.js.org/tutorial/cache/mode/))

### 自动缓存读取

自动缓存读取适用于短时间内重复访问同一接口的场景。只要 Method 实例的请求信息一致，并且缓存未过期，Alova 会优先返回缓存数据，减少重复请求。适合详情页返回列表后再次进入、字典下拉重复渲染、配置项多组件复用等场景。

示例：多个组件同时使用字典选项时，不需要每个组件都重复请求后端。

```typescript
import { useRequest } from 'alova/client';
import { getDictOptions } from '@/api';

const {
  loading,
  data: statusOptions
} = useRequest(() => getDictOptions('user_status'), {
  initialData: []
});
```

如果字典数据属于高稳定数据，可以适当延长缓存时间；如果字典数据在后台经常维护，则应缩短缓存时间，或在保存字典项后主动失效相关缓存。

### 手动刷新数据

手动刷新数据用于用户点击刷新按钮、表单提交成功后刷新列表、详情页重新加载最新数据等场景。如果接口未开启缓存，直接调用 `send` 即可。如果接口开启了缓存，刷新前建议先让缓存失效，再重新请求。

普通列表刷新：

```typescript
const handleRefresh = () => {
  reloadUserPage();
};
```

缓存详情刷新：

```typescript
import { invalidateCache } from 'alova';
import { getUserDetail } from '@/api';
import type { IdType } from '@/types/http';

const handleRefreshDetail = async (id: IdType) => {
  invalidateCache(getUserDetail(id));
  await loadUserDetail(id);
};
```

官方文档说明，`invalidateCache` 可以传入单个 Method 实例、Method 实例数组，也可以不传参数清理全部响应缓存；当自动缓存失效无法覆盖需求时，可以使用该函数手动失效缓存。([Alova.JS](https://alova.js.org/tutorial/cache/manually-invalidate))

### 数据失效与重新请求

数据失效主要发生在新增、编辑、删除、导入、批量更新等写操作之后。缓存失效可以使用手动方式，也可以使用自动失效规则。官方文档说明，自动失效可通过 `hitSource` 配置目标缓存和失效来源，当来源 Method 请求成功后，目标缓存会自动失效。([Alova.JS](https://alova.js.org/tutorial/cache/auto-invalidate/))

编辑用户后，手动失效用户详情缓存并刷新列表：

```typescript
import { invalidateCache } from 'alova';
import { updateUser, getUserDetail } from '@/api';
import type { IdType } from '@/types/http';
import type { UserUpdateForm } from '@/types/user';

const handleUpdateUser = async (formData: UserUpdateForm) => {
  await updateUser(formData);

  invalidateCache(getUserDetail(formData.id as IdType));
  reloadUserPage();
};
```

也可以给写操作 Method 设置稳定名称，再通过缓存 Method 的 `hitSource` 建立自动失效关系。

文件位置：`src/api/modules/user.ts`

```typescript
import { alovaInstance } from '@/utils/request/alova';
import type { IdType } from '@/types/http';
import type { UserDetail, UserUpdateForm } from '@/types/user';

/**
 * 查询用户详情，编辑用户成功后自动失效
 */
export const getUserDetail = (id: IdType) => {
  return alovaInstance.Get<UserDetail>(`/system/user/${id}`, {
    name: `userDetail-${id}`,
    cacheFor: 60 * 1000,
    hitSource: 'updateUser'
  });
};

/**
 * 修改用户
 */
export const updateUser = (data: UserUpdateForm) => {
  return alovaInstance.Put<boolean>('/system/user', data, {
    name: 'updateUser'
  });
};
```

缓存失效建议如下：

| 操作     | 建议处理                             |
| -------- | ------------------------------------ |
| 新增数据 | 刷新列表，必要时失效列表缓存         |
| 编辑数据 | 失效详情缓存，刷新列表               |
| 删除数据 | 失效详情缓存，刷新当前页或回退上一页 |
| 修改字典 | 失效字典选项缓存                     |
| 修改权限 | 清理权限、菜单、用户信息缓存         |
| 退出登录 | 清理 Token、用户信息、权限缓存       |

## 认证与权限处理

认证与权限处理用于统一维护登录、Token 注入、登录失效、用户信息、菜单权限和按钮权限。Alova 官方提供 Token authentication interceptor，可统一管理基于 Token 的登录、退出、Token 分配和 Token 刷新，并支持无感刷新；也支持通过 Method metadata 标记登录、登出、刷新 Token、游客请求等不同身份场景。([Alova.JS](https://alova.js.org/tutorial/client/strategy/token-authentication/))

### Token 注入

Token 注入可以使用两种方式。简单项目可以直接在 `beforeRequest` 中读取 Token 并写入请求头；需要无感刷新 Token 的项目，可以使用 Alova 官方的 Token authentication interceptor。

简单 Token 注入方式如下。

文件位置：`src/stores/auth.ts`

```typescript
import { defineStore } from 'pinia';

interface AuthState {
  accessToken: string;
  permissions: string[];
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    accessToken: localStorage.getItem('access_token') || '',
    permissions: []
  }),

  actions: {
    setAccessToken(token: string) {
      this.accessToken = token;
      localStorage.setItem('access_token', token);
    },

    setPermissions(permissions: string[]) {
      this.permissions = permissions;
    },

    clearAuth() {
      this.accessToken = '';
      this.permissions = [];
      localStorage.removeItem('access_token');
    }
  }
});
```

文件位置：`src/utils/request/alova.ts`

```typescript
import { createAlova } from 'alova';
import VueHook from 'alova/vue';
import adapterFetch from 'alova/fetch';
import { ElMessage } from 'element-plus';
import { useAuthStore } from '@/stores/auth';
import type { ApiResponse } from '@/types/http';

const SUCCESS_CODE = 200;
const UNAUTHORIZED_CODE = 401;

const redirectToLogin = () => {
  window.location.href = '/login';
};

export const alovaInstance = createAlova({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  statesHook: VueHook,
  requestAdapter: adapterFetch(),

  beforeRequest(method) {
    const authStore = useAuthStore();

    method.config.headers = {
      ...method.config.headers,
      'Content-Type': 'application/json;charset=UTF-8'
    };

    if (authStore.accessToken) {
      method.config.headers.Authorization = `Bearer ${authStore.accessToken}`;
    }
  },

  responded: {
    async onSuccess(response) {
      if (response.status === UNAUTHORIZED_CODE) {
        const authStore = useAuthStore();

        authStore.clearAuth();
        ElMessage.error('登录状态已失效，请重新登录');
        redirectToLogin();

        throw new Error('登录状态已失效');
      }

      if (!response.ok) {
        throw new Error(`请求失败，HTTP 状态码：${response.status}`);
      }

      const result = (await response.json()) as ApiResponse<unknown>;

      if (result.code !== SUCCESS_CODE) {
        throw new Error(result.message || '业务处理失败');
      }

      return result.data;
    },

    onError(error) {
      const message = error instanceof Error ? error.message : '网络请求异常';

      ElMessage.error(message);
      console.error('[Alova 请求异常]', error);
    }
  }
});
```

如果使用官方 Token 认证拦截器，可以通过 `assignToken` 统一分配 Token。官方文档说明，`assignToken` 会过滤游客请求和登录请求，并在请求前触发，适合集中维护认证代码。([Alova.JS](https://alova.js.org/tutorial/client/strategy/token-authentication/))

```typescript
import { createClientTokenAuthentication } from 'alova/client';

const { onAuthRequired, onResponseRefreshToken } = createClientTokenAuthentication({
  assignToken: method => {
    const token = localStorage.getItem('access_token');

    if (token) {
      method.config.headers.Authorization = `Bearer ${token}`;
    }
  }
});
```

### 登录失效处理

登录失效通常由 HTTP `401` 或后端业务码表示。当前项目建议在全局响应处理阶段统一识别登录失效，清理 Token、清理权限、跳转登录页，并阻止当前请求继续执行业务逻辑。

登录失效处理建议如下：

| 场景                      | 处理方式                             |
| ------------------------- | ------------------------------------ |
| HTTP `401`                | 清理登录状态并跳转登录页             |
| 后端业务码表示 Token 过期 | 在 `result.code` 判断后清理登录状态  |
| Refresh Token 失败        | 清理登录状态并跳转登录页             |
| 用户主动退出              | 调用退出接口后清理 Token、权限、缓存 |
| 多标签页登录失效          | 可监听 `storage` 事件同步退出状态    |

如果项目使用 Refresh Token，需要注意官方文档中的约束：刷新 Token 请求需要通过 metadata 标记为 `authRole: 'refreshToken'`；刷新失败时必须抛出错误，防止失败的 API 重试以及等待中的 API 继续请求。([Alova.JS](https://alova.js.org/tutorial/client/strategy/token-authentication/))

文件位置：`src/api/modules/auth.ts`

```typescript
import { alovaInstance } from '@/utils/request/alova';

export interface LoginParam {
  username: string;
  password: string;
}

export interface LoginResult {
  accessToken: string;
  refreshToken?: string;
  expireTime?: number;
}

/**
 * 登录
 */
export const login = (data: LoginParam) => {
  const method = alovaInstance.Post<LoginResult>('/auth/login', data);

  method.meta = {
    authRole: 'login'
  };

  return method;
};

/**
 * 刷新 Token
 */
export const refreshToken = () => {
  const method = alovaInstance.Post<LoginResult>('/auth/refresh-token');

  method.meta = {
    authRole: 'refreshToken'
  };

  return method;
};

/**
 * 退出登录
 */
export const logout = () => {
  const method = alovaInstance.Post<boolean>('/auth/logout');

  method.meta = {
    authRole: 'logout'
  };

  return method;
};
```

登录页面提交示例：

```typescript
import { useRequest } from 'alova/client';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import { login } from '@/api';
import { useAuthStore } from '@/stores/auth';
import type { LoginParam } from '@/api/modules/auth';

const router = useRouter();
const authStore = useAuthStore();

const {
  loading: loginLoading,
  send: submitLogin
} = useRequest((data: LoginParam) => login(data), {
  immediate: false
});

const handleLogin = async (formData: LoginParam) => {
  const result = await submitLogin(formData);

  authStore.setAccessToken(result.accessToken);

  ElMessage.success('登录成功');
  router.push('/');
};
```

### 权限接口调用

权限接口通常包括当前用户信息、菜单路由、按钮权限、角色权限等。建议登录成功后调用当前用户信息接口，再将权限标识写入 Pinia。页面组件和指令根据权限标识控制按钮显示。

文件位置：`src/types/auth.ts`

```typescript
export interface CurrentUserInfo {
  id: number | string;
  username: string;
  nickname: string;
  avatar?: string;
  roles: string[];
  permissions: string[];
}

export interface MenuRoute {
  id: number | string;
  parentId?: number | string;
  path: string;
  name: string;
  component?: string;
  redirect?: string;
  title: string;
  icon?: string;
  hidden?: boolean;
  children?: MenuRoute[];
}
```

文件位置：`src/api/modules/permission.ts`

```typescript
import { alovaInstance } from '@/utils/request/alova';
import type { CurrentUserInfo, MenuRoute } from '@/types/auth';

/**
 * 查询当前登录用户信息
 */
export const getCurrentUserInfo = () => {
  return alovaInstance.Get<CurrentUserInfo>('/auth/current-user', {
    name: 'currentUserInfo',
    cacheFor: 60 * 1000
  });
};

/**
 * 查询当前登录用户菜单
 */
export const getCurrentUserMenus = () => {
  return alovaInstance.Get<MenuRoute[]>('/auth/menus', {
    name: 'currentUserMenus',
    cacheFor: 60 * 1000
  });
};

/**
 * 查询当前登录用户权限标识
 */
export const getCurrentUserPermissions = () => {
  return alovaInstance.Get<string[]>('/auth/permissions', {
    name: 'currentUserPermissions',
    cacheFor: 60 * 1000
  });
};
```

文件位置：`src/stores/permission.ts`

```typescript
import { defineStore } from 'pinia';
import { getCurrentUserInfo, getCurrentUserMenus, getCurrentUserPermissions } from '@/api';
import type { CurrentUserInfo, MenuRoute } from '@/types/auth';

interface PermissionState {
  userInfo?: CurrentUserInfo;
  menus: MenuRoute[];
  permissions: string[];
}

export const usePermissionStore = defineStore('permission', {
  state: (): PermissionState => ({
    userInfo: undefined,
    menus: [],
    permissions: []
  }),

  getters: {
    hasPermission: state => {
      return (permission: string) => state.permissions.includes(permission);
    }
  },

  actions: {
    async loadPermissionData() {
      const [userInfo, menus, permissions] = await Promise.all([
        getCurrentUserInfo(),
        getCurrentUserMenus(),
        getCurrentUserPermissions()
      ]);

      this.userInfo = userInfo;
      this.menus = menus;
      this.permissions = permissions;
    },

    clearPermissionData() {
      this.userInfo = undefined;
      this.menus = [];
      this.permissions = [];
    }
  }
});
```

页面按钮权限判断示例：

```vue
<template>
  <el-button
    v-if="permissionStore.hasPermission('system:user:create')"
    type="primary"
    @click="handleCreate"
  >
    新增用户
  </el-button>

  <el-button
    v-if="permissionStore.hasPermission('system:user:update')"
    type="primary"
    link
    @click="handleEdit(row.id)"
  >
    编辑
  </el-button>

  <el-button
    v-if="permissionStore.hasPermission('system:user:delete')"
    type="danger"
    link
    @click="handleDelete(row.id)"
  >
    删除
  </el-button>
</template>

<script setup lang="ts">
import { usePermissionStore } from '@/stores/permission';

const permissionStore = usePermissionStore();

const handleCreate = () => {
  // 打开新增弹窗
};

const handleEdit = (id: number | string) => {
  // 打开编辑弹窗
};

const handleDelete = (id: number | string) => {
  // 执行删除确认
};
</script>
```

退出登录时，应同时清理认证状态、权限状态和缓存数据。

```typescript
import { invalidateCache } from 'alova';
import { useAuthStore } from '@/stores/auth';
import { usePermissionStore } from '@/stores/permission';
import { logout } from '@/api';

const handleLogout = async () => {
  const authStore = useAuthStore();
  const permissionStore = usePermissionStore();

  try {
    await logout();
  } finally {
    authStore.clearAuth();
    permissionStore.clearPermissionData();
    invalidateCache();

    window.location.href = '/login';
  }
};
```

认证和权限部分建议保持“接口请求层只负责请求与响应，Store 负责状态，路由守卫负责访问控制，页面负责按钮展示”的边界。这样登录失效、权限变更、菜单刷新、按钮控制和缓存清理都能保持清晰的职责划分。



## 错误处理与提示

错误处理与提示用于统一处理接口调用中的业务失败、HTTP 异常、网络异常、登录失效和页面级错误展示。Alova 官方文档说明，全局响应拦截器 `responded` 可用于统一解析响应、处理错误和处理请求完成逻辑；其中 `beforeRequest` 会在所有请求前触发，适合统一添加 Token、请求头等信息。([Alova.JS](https://alova.js.org/tutorial/getting-started/basic/global-interceptor/))

### 业务错误处理

业务错误是指后端接口正常返回 HTTP 响应，但业务状态码表示失败，例如参数校验失败、权限不足、数据不存在、状态不允许操作等。建议前后端统一响应结构，并在 Alova 全局 `responded.onSuccess` 中判断 `code`，业务失败时抛出标准错误对象。

建议后端统一返回结构如下：

```json
{
  "code": 200,
  "message": "操作成功",
  "data": {}
}
```

错误状态建议约定如下：

| 状态码 | 含义             | 前端处理              |
| ------ | ---------------- | --------------------- |
| `200`  | 操作成功         | 返回 `data`           |
| `400`  | 参数错误         | 提示业务消息          |
| `401`  | 未登录或登录失效 | 清理 Token 并跳转登录 |
| `403`  | 无权限           | 提示无权限            |
| `404`  | 数据不存在       | 提示资源不存在        |
| `500`  | 服务端异常       | 提示系统繁忙          |

下面定义统一请求错误类型，便于页面组件、日志模块和全局错误提示识别异常来源。

文件位置：`src/utils/request/http-error.ts`

```typescript
/**
 * 请求错误类型
 */
export type RequestErrorType = 'BUSINESS' | 'HTTP' | 'NETWORK' | 'UNKNOWN';

/**
 * 请求错误对象
 */
export class RequestError extends Error {
  type: RequestErrorType;
  code?: number;
  status?: number;
  raw?: unknown;

  constructor(message: string, options: {
    type: RequestErrorType;
    code?: number;
    status?: number;
    raw?: unknown;
  }) {
    super(message);
    this.name = 'RequestError';
    this.type = options.type;
    this.code = options.code;
    this.status = options.status;
    this.raw = options.raw;
  }
}
```

下面代码用于增强全局 Alova 实例，统一处理业务状态码、HTTP 状态码、静默错误和登录失效。

文件位置：`src/utils/request/alova.ts`

```typescript
import { createAlova } from 'alova';
import VueHook from 'alova/vue';
import adapterFetch from 'alova/fetch';
import { ElMessage } from 'element-plus';
import { useAuthStore } from '@/stores/auth';
import { RequestError } from '@/utils/request/http-error';
import type { ApiResponse } from '@/types/http';

const SUCCESS_CODE = 200;
const UNAUTHORIZED_CODE = 401;
const FORBIDDEN_CODE = 403;

interface RequestMeta {
  silent?: boolean;
  ignoreToken?: boolean;
  showSuccess?: boolean;
  successMessage?: string;
}

const getRequestMeta = (meta: unknown): RequestMeta => {
  return (meta || {}) as RequestMeta;
};

const showErrorMessage = (message: string, meta: RequestMeta) => {
  if (!meta.silent) {
    ElMessage.error(message);
  }
};

const redirectToLogin = () => {
  const authStore = useAuthStore();

  authStore.clearAuth();

  if (window.location.pathname !== '/login') {
    window.location.href = '/login';
  }
};

export const alovaInstance = createAlova({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  statesHook: VueHook,
  requestAdapter: adapterFetch(),

  beforeRequest(method) {
    const authStore = useAuthStore();
    const meta = getRequestMeta(method.meta);

    method.config.headers = {
      ...method.config.headers,
      'Content-Type': 'application/json;charset=UTF-8'
    };

    if (!meta.ignoreToken && authStore.accessToken) {
      method.config.headers.Authorization = `Bearer ${authStore.accessToken}`;
    }
  },

  responded: {
    async onSuccess(response, method) {
      const meta = getRequestMeta(method.meta);

      if (response.status === UNAUTHORIZED_CODE) {
        showErrorMessage('登录状态已失效，请重新登录', meta);
        redirectToLogin();

        throw new RequestError('登录状态已失效', {
          type: 'HTTP',
          status: response.status
        });
      }

      if (response.status === FORBIDDEN_CODE) {
        const message = '当前账号无操作权限';

        showErrorMessage(message, meta);

        throw new RequestError(message, {
          type: 'HTTP',
          status: response.status
        });
      }

      if (!response.ok) {
        const message = `请求失败，HTTP 状态码：${response.status}`;

        showErrorMessage(message, meta);

        throw new RequestError(message, {
          type: 'HTTP',
          status: response.status
        });
      }

      const result = (await response.json()) as ApiResponse<unknown>;

      if (result.code !== SUCCESS_CODE) {
        const message = result.message || '业务处理失败';

        showErrorMessage(message, meta);

        throw new RequestError(message, {
          type: 'BUSINESS',
          code: result.code,
          raw: result
        });
      }

      if (meta.showSuccess) {
        ElMessage.success(meta.successMessage || result.message || '操作成功');
      }

      return result.data;
    },

    onError(error, method) {
      const meta = getRequestMeta(method.meta);
      const message = error instanceof Error ? error.message : '网络请求异常';

      showErrorMessage(message, meta);

      console.error('[Alova 网络异常]', {
        url: method.url,
        type: method.type,
        error
      });

      throw new RequestError(message, {
        type: 'NETWORK',
        raw: error
      });
    },

    onComplete(method) {
      if (import.meta.env.DEV) {
        console.debug('[Alova 请求完成]', {
          url: method.url,
          type: method.type
        });
      }
    }
  }
});
```

需要注意，使用 `alova/fetch` 请求适配器时，官方文档说明由于 `window.fetch` 的特性，`responded.onError` 通常只会在连接超时或请求中断时触发；HTTP 状态码错误仍会进入 `onSuccess`，因此必须在 `onSuccess` 中检查 `response.ok` 或 `response.status`。同时，`onSuccess` 中抛出的错误不会再进入全局 `onError`，会交给调用方或请求 Hook 接收。([Alova.JS](https://alova.js.org/tutorial/getting-started/basic/global-interceptor/))

### HTTP 错误处理

HTTP 错误是指接口响应状态码不是成功状态，例如 `401`、`403`、`404`、`500`。这类错误建议在全局响应拦截器中处理，而不是分散在每个页面组件中。

HTTP 错误处理规则如下：

| HTTP 状态码 | 处理方式                 |
| ----------- | ------------------------ |
| `400`       | 提示请求参数错误         |
| `401`       | 清理登录状态并跳转登录页 |
| `403`       | 提示无权限               |
| `404`       | 提示接口或资源不存在     |
| `500`       | 提示系统繁忙             |
| 其他状态码  | 提示通用 HTTP 错误       |

如果某些接口不希望自动弹出错误提示，例如静默轮询、后台预加载、权限探测接口，可以通过 `meta.silent` 控制。

文件位置：`src/api/modules/user.ts`

```typescript
import { alovaInstance } from '@/utils/request/alova';
import type { UserDetail } from '@/types/user';
import type { IdType } from '@/types/http';

/**
 * 静默查询用户详情
 */
export const getUserDetailSilent = (id: IdType) => {
  return alovaInstance.Get<UserDetail>(`/system/user/${id}`, {
    meta: {
      silent: true
    }
  });
};
```

Alova 官方文档说明，Method Metadata 可用于给 Method 实例附加额外信息，并可在 `beforeRequest`、`responded.onSuccess`、`responded.onError` 等生命周期中读取，适合处理忽略 Token、下载请求、静默请求等差异化逻辑。([Alova.JS](https://alova.js.org/tutorial/getting-started/basic/method-metadata/))

### 统一消息提示

统一消息提示用于避免页面中重复编写 `ElMessage.error`、`ElMessage.success`、`ElMessage.warning`。建议全局错误提示放在 Alova 响应拦截器中；业务成功提示可以由页面决定，也可以通过 Method Metadata 控制。

下面示例通过 `meta.showSuccess` 控制保存成功后自动提示。

文件位置：`src/api/modules/user.ts`

```typescript
import { alovaInstance } from '@/utils/request/alova';
import type { UserCreateForm, UserUpdateForm } from '@/types/user';

/**
 * 新增用户
 */
export const createUser = (data: UserCreateForm) => {
  return alovaInstance.Post<boolean>('/system/user', data, {
    meta: {
      showSuccess: true,
      successMessage: '新增用户成功'
    }
  });
};

/**
 * 修改用户
 */
export const updateUser = (data: UserUpdateForm) => {
  return alovaInstance.Put<boolean>('/system/user', data, {
    meta: {
      showSuccess: true,
      successMessage: '修改用户成功'
    }
  });
};
```

页面中调用时，只保留业务流程，不再重复写成功提示。

```typescript
const handleSubmit = async () => {
  await formRef.value?.validate();

  await submitCreateUser({ ...formData });

  visible.value = false;
  emit('success');
};
```

消息提示建议遵循以下规则：

| 场景         | 建议                           |
| ------------ | ------------------------------ |
| 查询失败     | 全局提示，可在页面展示错误区域 |
| 新增成功     | 页面提示或 `meta.showSuccess`  |
| 编辑成功     | 页面提示或 `meta.showSuccess`  |
| 删除成功     | 页面提示，通常放在确认操作后   |
| 登录失效     | 全局提示并跳转登录             |
| 权限不足     | 全局提示                       |
| 静默请求失败 | 使用 `meta.silent` 禁用提示    |

### 请求异常日志

请求异常日志用于开发联调、测试排查和线上问题定位。前端不建议记录敏感字段，例如密码、Token、身份证号、手机号完整值等。开发环境可以输出完整请求上下文，生产环境建议接入前端监控平台或只输出必要字段。

文件位置：`src/utils/request/logger.ts`

```typescript
import { RequestError } from '@/utils/request/http-error';

interface RequestLogInfo {
  url: string;
  method: string;
  error: unknown;
  params?: unknown;
}

const maskSensitiveText = (text: string) => {
  return text
    .replace(/Bearer\s+[A-Za-z0-9._-]+/g, 'Bearer ***')
    .replace(/"password"\s*:\s*"[^"]*"/g, '"password":"***"')
    .replace(/"accessToken"\s*:\s*"[^"]*"/g, '"accessToken":"***"');
};

export const logRequestError = (info: RequestLogInfo) => {
  const errorMessage = info.error instanceof Error ? info.error.message : String(info.error);
  const errorType = info.error instanceof RequestError ? info.error.type : 'UNKNOWN';

  const logInfo = {
    url: info.url,
    method: info.method,
    errorType,
    errorMessage,
    params: info.params
  };

  const safeLogText = maskSensitiveText(JSON.stringify(logInfo));

  if (import.meta.env.DEV) {
    console.error('[接口请求异常]', JSON.parse(safeLogText));
    return;
  }

  // 生产环境可在这里接入 Sentry、前端日志平台或自研埋点接口
};
```

在全局响应拦截器中使用日志方法。

```typescript
import { logRequestError } from '@/utils/request/logger';

onError(error, method) {
  logRequestError({
    url: method.url,
    method: method.type,
    error
  });

  throw error;
}
```

日志记录建议至少包含接口地址、请求方法、错误类型、错误消息和触发时间。生产环境不要把完整 Token、密码、完整请求体直接输出到控制台或日志平台。

## 组件中的使用规范

组件中的使用规范用于明确页面组件、业务组件和 Composable 的职责边界。Alova 官方文档说明，`useRequest` 默认调用时会发送请求，设置 `immediate: false` 后可手动发送；Method 实例可以通过 `await`、`then`、`catch` 等方式发送，也可以交给请求 Hook 管理状态。([Alova.JS](https://alova.js.org/tutorial/client/strategy/use-request/))

### 页面组件调用规范

页面组件负责组织页面状态、查询条件、分页状态、弹窗状态和业务动作。页面组件可以直接调用 API 模块和 Alova 请求 Hook，但不应直接拼接底层请求地址，也不应在模板中写复杂请求逻辑。

页面组件建议遵循以下规则：

| 规则                            | 说明                                   |
| ------------------------------- | -------------------------------------- |
| API 统一从 `src/api` 导入       | 避免页面中直接写 URL                   |
| 查询条件集中定义                | 避免散落多个 `ref` 后难以维护          |
| 列表使用独立请求状态            | 不和新增、编辑、删除共用 loading       |
| 表单提交设置 `immediate: false` | 避免组件初始化时误提交                 |
| 新增、编辑、删除成功后刷新列表  | 保证页面数据一致                       |
| 页面只处理业务流程              | 不处理 Token 注入、HTTP 错误等底层逻辑 |

下面示例是页面组件的推荐调用方式。

文件位置：`src/views/user/UserPage.vue`

```vue
<template>
  <div class="p-4">
    <el-card shadow="never">
      <template #header>
        <div class="flex items-center justify-between">
          <span>用户管理</span>
          <el-button type="primary" @click="handleCreate">
            新增用户
          </el-button>
        </div>
      </template>

      <el-form :inline="true" :model="queryParams">
        <el-form-item label="用户名">
          <el-input
            v-model="queryParams.username"
            clearable
            placeholder="请输入用户名"
            @keyup.enter="handleSearch"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :loading="loading" @click="handleSearch">
            查询
          </el-button>
          <el-button @click="handleReset">
            重置
          </el-button>
        </el-form-item>
      </el-form>

      <el-table
        v-loading="loading"
        :data="data.records"
        row-key="id"
        border
      >
        <el-table-column prop="username" label="用户名" min-width="140" />
        <el-table-column prop="nickname" label="昵称" min-width="140" />
        <el-table-column prop="createTime" label="创建时间" min-width="180" />

        <el-table-column label="操作" width="160" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEdit(row.id)">
              编辑
            </el-button>
            <el-button type="danger" link @click="handleDelete(row.id)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <UserCreateDialog
        v-model:visible="createDialogVisible"
        @success="loadUserPage"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRequest } from 'alova/client';
import { ElMessageBox } from 'element-plus';
import { deleteUser, getUserPage } from '@/api';
import UserCreateDialog from './components/UserCreateDialog.vue';
import type { PageResult } from '@/types/http';
import type { UserItem, UserPageQuery } from '@/types/user';

const createInitialPageData = (): PageResult<UserItem> => ({
  records: [],
  total: 0,
  pageNum: 1,
  pageSize: 10
});

const createDialogVisible = ref(false);

const queryParams = reactive<UserPageQuery>({
  pageNum: 1,
  pageSize: 10,
  username: ''
});

const {
  loading,
  data,
  send: loadUserPage
} = useRequest(() => getUserPage(queryParams), {
  immediate: true,
  initialData: createInitialPageData()
});

const {
  send: submitDeleteUser
} = useRequest((id: number | string) => deleteUser(id), {
  immediate: false
});

const handleCreate = () => {
  createDialogVisible.value = true;
};

const handleEdit = (id: number | string) => {
  console.debug('[用户管理] 打开编辑弹窗', id);
};

const handleDelete = async (id: number | string) => {
  await ElMessageBox.confirm('确认删除该用户吗？', '删除确认', {
    confirmButtonText: '确认删除',
    cancelButtonText: '取消',
    type: 'warning'
  });

  await submitDeleteUser(id);
  loadUserPage();
};

const handleSearch = () => {
  queryParams.pageNum = 1;
  loadUserPage();
};

const handleReset = () => {
  queryParams.pageNum = 1;
  queryParams.username = '';
  loadUserPage();
};
</script>
```

### 业务组件调用规范

业务组件是指用户弹窗、角色选择器、字典下拉、文件上传、树形选择器等可复用组件。业务组件应尽量通过 `props` 接收外部参数，通过 `emit` 通知父组件刷新，不建议直接修改父页面状态。

业务组件建议分为两类：

| 类型           | 是否调用 API | 说明                         |
| -------------- | ------------ | ---------------------------- |
| 展示型业务组件 | 尽量不调用   | 只接收数据并展示             |
| 数据型业务组件 | 可以调用     | 如远程下拉、详情弹窗、选择器 |

远程用户选择器示例。

文件位置：`src/components/business/UserSelect.vue`

```vue
<template>
  <el-select
    v-model="modelValue"
    filterable
    remote
    clearable
    reserve-keyword
    :loading="loading"
    :remote-method="handleRemoteSearch"
    placeholder="请输入用户名搜索"
    style="width: 100%"
  >
    <el-option
      v-for="item in data"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
</template>

<script setup lang="ts">
import { useRequest } from 'alova/client';
import { getUserOptions } from '@/api';
import type { UserOption } from '@/types/user';

const modelValue = defineModel<string | number>();

const {
  loading,
  data,
  send: searchUsers
} = useRequest((keyword: string) => getUserOptions(keyword), {
  immediate: false,
  initialData: [] as UserOption[]
});

const handleRemoteSearch = (keyword: string) => {
  if (!keyword.trim()) {
    return;
  }

  searchUsers(keyword);
};
</script>
```

业务组件使用规范如下：

| 规则                      | 说明                                |
| ------------------------- | ----------------------------------- |
| 通过 `v-model` 暴露值     | 保持和 Element Plus 表单组件一致    |
| 通过 `props` 接收业务参数 | 例如角色类型、组织 ID、是否多选     |
| 通过 `emit` 通知业务动作  | 例如 `success`、`change`、`refresh` |
| 不直接依赖页面组件        | 避免组件只能在单一页面使用          |
| 内部请求设置初始值        | 避免模板访问空数据报错              |

### Composable 封装方式

Composable 用于封装可复用的请求逻辑和页面状态逻辑。适合封装列表查询、分页、提交锁、权限判断、字典选项、远程搜索等逻辑。Composable 不应直接依赖具体页面模板，也不应返回过多无关状态。

下面示例封装用户列表请求逻辑，页面组件只负责展示和事件绑定。

文件位置：`src/composables/user/useUserTable.ts`

```typescript
import { reactive } from 'vue';
import { useRequest } from 'alova/client';
import { getUserPage } from '@/api';
import type { PageResult } from '@/types/http';
import type { UserItem, UserPageQuery } from '@/types/user';

const createInitialPageData = (): PageResult<UserItem> => ({
  records: [],
  total: 0,
  pageNum: 1,
  pageSize: 10
});

export const useUserTable = () => {
  const queryParams = reactive<UserPageQuery>({
    pageNum: 1,
    pageSize: 10,
    username: '',
    mobile: '',
    enabled: undefined
  });

  const {
    loading,
    data,
    error,
    send: loadUserPage
  } = useRequest(() => getUserPage(queryParams), {
    immediate: true,
    initialData: createInitialPageData()
  });

  const search = () => {
    queryParams.pageNum = 1;
    loadUserPage();
  };

  const reset = () => {
    queryParams.pageNum = 1;
    queryParams.pageSize = 10;
    queryParams.username = '';
    queryParams.mobile = '';
    queryParams.enabled = undefined;
    loadUserPage();
  };

  const refresh = () => {
    loadUserPage();
  };

  return {
    queryParams,
    loading,
    data,
    error,
    search,
    reset,
    refresh
  };
};
```

页面组件中使用 Composable。

```vue
<script setup lang="ts">
import { useUserTable } from '@/composables/user/useUserTable';

const {
  queryParams,
  loading,
  data,
  search,
  reset,
  refresh
} = useUserTable();
</script>
```

Composable 封装建议如下：

| 场景                 | 是否建议封装     |
| -------------------- | ---------------- |
| 单个页面私有逻辑     | 不强制封装       |
| 多个页面重复列表逻辑 | 建议封装         |
| 多处使用的字典请求   | 建议封装         |
| 表单提交锁           | 建议封装         |
| 权限判断             | 建议封装         |
| 高度耦合页面交互     | 保留在页面组件中 |

## 开发验证

开发验证用于确认 Alova 请求层、接口模块、类型定义、Mock 数据和页面交互是否符合预期。验证流程建议覆盖接口联调、Mock 数据、类型检查、构建检查和常见问题排查。

### 接口联调

接口联调应先确认环境变量、代理配置、请求地址、请求头、响应结构和登录状态。Alova 的 Method 实例描述请求类型、请求 URL、请求头、请求参数等信息，并且可以像 Promise 一样通过 `await`、`then`、`catch`、`finally` 发送请求；因此联调时既可以在组件中通过 Hook 调用，也可以在调试代码中直接 `await` Method。([Alova.JS](https://alova.js.org/tutorial/getting-started/basic/method/))

开发环境建议配置 Vite 代理，避免浏览器跨域问题。

文件位置：`vite.config.ts`

```typescript
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },

  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '')
      }
    }
  }
});
```

接口联调检查项如下：

| 检查项              | 说明                               |
| ------------------- | ---------------------------------- |
| `VITE_API_BASE_URL` | 是否为 `/api` 或正确后端地址       |
| Vite 代理           | 是否转发到正确后端服务             |
| 请求路径            | API 模块中的路径是否和后端一致     |
| 请求方法            | GET、POST、PUT、DELETE 是否匹配    |
| 请求参数            | 查询参数、路径参数、请求体是否正确 |
| Token               | 是否写入 `Authorization` 请求头    |
| 响应结构            | 是否符合 `ApiResponse<T>`          |
| 业务状态码          | `code` 是否为约定成功状态码        |

联调时可以在浏览器控制台直接验证 Method 请求。

```typescript
import { getUserPage } from '@/api';

const result = await getUserPage({
  pageNum: 1,
  pageSize: 10,
  username: ''
});

console.log(result);
```

### Mock 数据验证

Mock 数据验证用于在后端接口未完成或接口不稳定时，提前验证页面渲染、表单校验、分页结构和异常分支。Mock 数据应尽量贴近后端最终响应结构，特别是分页字段、状态字段、时间字段和空数据场景。

建议先定义本地 Mock 数据构造函数。

文件位置：`src/mock/user.ts`

```typescript
import type { PageResult } from '@/types/http';
import type { UserItem, UserPageQuery } from '@/types/user';

const userList: UserItem[] = Array.from({ length: 35 }).map((_, index) => {
  const id = index + 1;

  return {
    id,
    username: `user_${id}`,
    nickname: `测试用户${id}`,
    mobile: `1380000${String(id).padStart(4, '0')}`,
    email: `user_${id}@example.com`,
    enabled: id % 2 === 0,
    createTime: '2026-05-21 10:00:00'
  };
});

export const mockUserPage = (query: UserPageQuery): PageResult<UserItem> => {
  const filteredList = userList.filter(item => {
    const matchUsername = query.username
      ? item.username.includes(query.username) || item.nickname.includes(query.username)
      : true;

    const matchEnabled = typeof query.enabled === 'boolean'
      ? item.enabled === query.enabled
      : true;

    return matchUsername && matchEnabled;
  });

  const start = (query.pageNum - 1) * query.pageSize;
  const end = start + query.pageSize;
  const records = filteredList.slice(start, end);

  return {
    records,
    total: filteredList.length,
    pageNum: query.pageNum,
    pageSize: query.pageSize
  };
};
```

在 API 模块中通过环境变量控制是否使用 Mock。

文件位置：`.env.development`

```properties
# 是否启用前端本地 Mock
VITE_USE_MOCK=true
```

文件位置：`src/types/env.d.ts`

```typescript
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_USE_MOCK: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

文件位置：`src/api/modules/user.ts`

```typescript
import { alovaInstance } from '@/utils/request/alova';
import { mockUserPage } from '@/mock/user';
import type { PageResult } from '@/types/http';
import type { UserItem, UserPageQuery } from '@/types/user';

const useMock = import.meta.env.VITE_USE_MOCK === 'true';

/**
 * 查询用户分页列表
 */
export const getUserPage = async (params: UserPageQuery): Promise<PageResult<UserItem>> => {
  if (useMock) {
    return mockUserPage(params);
  }

  return await alovaInstance.Get<PageResult<UserItem>>('/system/user/page', {
    params,
    cacheFor: 0
  });
};
```

这种写法适合早期页面验证，但正式项目中更建议使用统一 Mock 服务或接口模拟工具，避免 API 函数既返回 Method 实例又返回 Promise 导致调用方式不一致。若项目已经统一使用 `useRequest(() => getUserPage(params))`，则应保持 API 返回类型稳定，避免同一个 API 在 Mock 和真实环境中返回不同结构。

### 类型校验

类型校验用于提前发现接口字段变更、参数缺失、响应结构错误和组件绑定错误。Vue3 + TypeScript 项目建议在开发、提交和构建阶段都执行 `vue-tsc --noEmit`。

文件位置：`package.json`

```json
{
  "scripts": {
    "dev": "vite",
    "type-check": "vue-tsc --noEmit",
    "build": "vue-tsc --noEmit && vite build"
  }
}
```

执行类型校验命令：

```bash
pnpm type-check
```

执行构建验证命令：

```bash
pnpm build
```

类型校验重点关注以下内容：

| 检查项       | 示例                                           |
| ------------ | ---------------------------------------------- |
| 请求参数类型 | `UserPageQuery` 是否缺少 `pageNum`、`pageSize` |
| 响应数据类型 | `PageResult<UserItem>` 是否和后端字段一致      |
| 模板字段绑定 | `row.username`、`row.enabled` 是否存在         |
| 表单字段类型 | `UserCreateForm` 是否和表单字段一致            |
| 空值处理     | 可选字段是否做默认值或空值判断                 |
| API 返回值   | 是否错误地把 `ApiResponse<T>` 当作 `T` 使用    |

如果全局 `responded.onSuccess` 已经返回 `result.data`，API 泛型应写成业务数据类型，例如 `PageResult<UserItem>`，不要写成 `ApiResponse<PageResult<UserItem>>`。否则页面中的 `data.records` 类型会不匹配。

### 常见问题排查

常见问题排查用于快速定位开发中出现的请求未发出、Token 未携带、页面报空值、错误提示重复、缓存未刷新等问题。Alova 官方文档中也强调，`useRequest` 的 `data` 在请求成功前默认是 `undefined`，列表场景应通过 `initialData` 初始化为空数组或默认对象，避免视图渲染时报错。([Alova.JS](https://alova.js.org/tutorial/client/strategy/use-request/))

常见问题如下：

| 问题                    | 原因                                                   | 处理方式                             |
| ----------------------- | ------------------------------------------------------ | ------------------------------------ |
| 页面初始化就提交表单    | 提交请求未设置 `immediate: false`                      | 写操作必须设置 `immediate: false`    |
| 列表首次渲染报错        | `data` 初始值为 `undefined`                            | 使用 `initialData` 初始化分页结构    |
| HTTP 500 没进 `onError` | Fetch 适配器下 HTTP 错误进入 `onSuccess`               | 在 `onSuccess` 中判断 `response.ok`  |
| Token 没有携带          | `beforeRequest` 未读取 Store 或 `ignoreToken` 配置错误 | 检查请求头和 Method Metadata         |
| 错误提示重复            | 全局和页面都调用了 `ElMessage.error`                   | 页面只展示错误区域，提示交给全局处理 |
| 删除后列表没刷新        | 删除成功后未调用列表 `send`                            | 删除成功后调用 `loadUserPage()`      |
| 修改后详情仍是旧数据    | 详情接口启用了缓存                                     | 使用 `invalidateCache` 或强制请求    |
| 分页筛选后页码不对      | 筛选时未重置页码                                       | 查询前设置 `pageNum = 1`             |
| 生产环境接口地址错误    | 环境变量或构建配置错误                                 | 检查 `.env.production` 和部署代理    |
| 页面按钮无权限仍展示    | 权限 Store 未加载或权限码不一致                        | 检查权限接口返回和按钮权限标识       |

排查请求问题时，建议按以下顺序检查：

```text
1. 浏览器 Network 是否发出请求
2. 请求 URL 是否正确
3. 请求方法是否正确
4. Query 参数、路径参数、请求体是否正确
5. Authorization 是否携带
6. HTTP 状态码是否正常
7. 后端响应结构是否符合 ApiResponse<T>
8. responded.onSuccess 是否正确 return result.data
9. useRequest 是否设置 initialData
10. 页面是否重复处理错误提示
```

调试时可以临时开启请求日志。

```typescript
beforeRequest(method) {
  if (import.meta.env.DEV) {
    console.debug('[Alova 请求开始]', {
      url: method.url,
      type: method.type,
      params: method.config.params,
      data: method.data
    });
  }
}
```

最终建议是：全局拦截器负责统一请求头、响应解析、业务错误、HTTP 错误和登录失效；API 模块负责 Method 封装；页面组件负责业务流程；Composable 负责复用逻辑；开发验证阶段通过接口联调、Mock、类型校验和构建检查保证请求链路可用。
