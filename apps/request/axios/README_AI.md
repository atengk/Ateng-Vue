# Axios

Axios 是前端项目中负责 HTTP 通信的核心请求库。在 Vue3 与 TypeScript 项目中，Axios 通常不会直接散落在页面组件中使用，而是作为统一请求模块进行封装，用于处理请求实例、基础配置、Token 注入、响应解包、异常处理、类型约束以及业务 API 模块拆分。

通过统一封装 Axios，可以减少接口调用代码的重复度，提升请求行为的一致性，并让页面组件更加专注于视图渲染、交互逻辑和业务状态管理。

## 模块概述

Axios 请求模块属于前端工程中的基础设施模块，主要负责前端与后端服务之间的数据通信。它位于页面组件、业务状态管理和后端接口之间，对上层屏蔽 HTTP 请求细节，对下层统一管理接口访问规范。

在实际项目中，请求模块通常包含以下内容：

1. Axios 实例创建与基础配置。
2. 请求地址、超时时间、请求头等公共配置。
3. 请求拦截器，用于 Token 注入、参数处理、请求日志记录。
4. 响应拦截器，用于响应数据解包、业务状态码判断、异常提示、登录失效处理。
5. TypeScript 类型封装，用于约束请求参数、响应数据和接口返回值。
6. API 文件拆分，用于按业务模块组织接口方法。
7. 与 Vue3 页面、组合式函数、Pinia 状态管理模块协同使用。

合理的 Axios 模块封装可以让项目中的接口调用具备统一入口、统一规范、统一错误处理和统一类型提示，避免每个页面重复处理请求配置和异常逻辑。

### Axios 在项目中的定位

Axios 在 Vue3 前端项目中通常定位为“请求基础层”，它不直接承载具体业务逻辑，而是为业务模块提供稳定、统一、可扩展的 HTTP 调用能力。

在项目分层中，Axios 请求模块一般位于以下位置：

```text
src
├── api              # 按业务模块拆分的接口方法
├── utils
│   └── request.ts   # Axios 实例与拦截器封装
├── stores           # Pinia 状态管理
├── views            # 页面组件
└── components       # 通用组件
```

从调用关系上看，页面组件不建议直接调用原生 `axios.get()` 或 `axios.post()`，而是应该通过业务 API 模块间接调用：

```text
Vue 页面 / 组件
        ↓
业务 API 方法
        ↓
统一 Axios 请求实例
        ↓
后端接口服务
```

这种设计可以带来以下好处：

1. 页面代码更清晰
   页面只关心业务行为，例如查询列表、提交表单、删除数据，不需要关心请求头、状态码、Token、异常提示等底层细节。
2. 请求行为更统一
   所有接口请求都经过同一个 Axios 实例，可以统一配置 `baseURL`、`timeout`、请求头、响应处理和错误处理。
3. 类型提示更完整
   通过 TypeScript 泛型封装接口返回值，可以让页面调用接口时获得明确的数据结构提示，减少字段拼写错误和类型不确定问题。
4. 后期维护更方便
   当后端响应结构、鉴权方式、错误码规则发生变化时，只需要调整请求封装层，不需要逐个修改页面组件。
5. 便于扩展多服务请求
   如果项目后续存在多个后端服务，例如业务服务、文件服务、认证服务，也可以基于 Axios 创建多个请求实例进行隔离管理。

在项目中，Axios 不应该只是一个简单的 HTTP 工具，而应该作为前端工程请求规范的承载层，统一管理所有与接口通信相关的公共能力。

### 请求模块职责边界

请求模块的职责边界需要清晰定义。它应该负责“通用请求能力”和“跨接口公共逻辑”，但不应该承载具体页面业务逻辑。

请求模块适合负责以下内容：

1. 创建 Axios 请求实例。
2. 配置统一的 `baseURL`、`timeout`、`headers`。
3. 在请求拦截器中注入 Token。
4. 对请求参数进行统一处理，例如去除空字符串、追加公共参数等。
5. 在响应拦截器中统一解包响应数据。
6. 处理 HTTP 状态码异常，例如 `401`、`403`、`404`、`500`。
7. 处理业务状态码异常，例如后端返回 `code !== 200`。
8. 处理登录失效逻辑，例如清理 Token、跳转登录页。
9. 输出必要的请求日志，方便开发环境调试。
10. 提供统一的 TypeScript 响应类型。

请求模块不建议负责以下内容：

1. 不处理具体页面的业务判断
   例如“用户是否可以点击某个按钮”“列表为空时展示什么文案”等逻辑，应放在页面组件或业务组合函数中。
2. 不直接维护页面状态
   例如表格数据、弹窗状态、表单字段、分页参数等，应由 Vue 组件、组合式函数或 Pinia 管理。
3. 不直接耦合具体组件库
   请求模块可以调用全局消息提示，但不应与具体页面组件结构强绑定。
4. 不编写具体业务流程
   例如“创建订单后刷新订单列表并打开详情弹窗”，这类流程应放在页面或业务 service 中，而不是 Axios 封装层。
5. 不混合所有业务接口
   Axios 实例负责通用请求能力，具体接口方法应拆分到 `src/api` 下的不同业务文件中。

推荐的职责划分如下：

| 层级                   | 主要职责                       | 示例                             |
| ---------------------- | ------------------------------ | -------------------------------- |
| `utils/request.ts`     | 请求实例、拦截器、统一异常处理 | Token 注入、响应解包、登录失效   |
| `api/user.ts`          | 用户模块接口定义               | 查询用户列表、创建用户、删除用户 |
| `stores/user.ts`       | 用户相关状态管理               | 当前用户信息、权限、登录状态     |
| `views/user/index.vue` | 页面交互和渲染                 | 表格展示、搜索、分页、表单提交   |
| `types/api.ts`         | 通用请求类型                   | `ApiResult<T>`、分页响应类型     |

整体原则是：Axios 请求模块只解决“怎么稳定、规范地发请求”，具体业务模块负责“请求什么接口”，页面组件负责“拿到数据后如何展示和交互”。这样可以让请求层保持稳定、通用和可复用，也能避免基础模块被业务逻辑污染。



## 环境与依赖

本节主要说明 Axios 请求模块在 Vue3 + TypeScript 项目中的基础环境、依赖安装方式、类型支持方式以及推荐的项目目录规划。请求模块属于项目基础设施，建议在业务开发前先完成统一封装，避免后续页面中直接散落使用原生 Axios。

### Axios 依赖安装

Axios 是独立的 HTTP 请求库，不依赖 Vue 本身。在 Vue3 项目中可以直接通过包管理器安装，并在请求封装文件中统一引入。

在项目根目录执行以下命令安装 Axios：

```bash
# 使用 npm 安装 Axios
npm install axios

# 或使用 pnpm 安装 Axios
pnpm add axios

# 或使用 yarn 安装 Axios
yarn add axios
```

如果项目使用 Vite 创建，通常不需要额外安装 Axios 的类型声明包，因为 Axios 已经内置 TypeScript 类型支持。

安装完成后，可以在 `package.json` 中看到类似依赖：

```json
{
  "dependencies": {
    "axios": "^1.x.x",
    "vue": "^3.x.x"
  }
}
```

这里不建议在多个业务文件中直接引入 `axios` 进行请求调用，而是应该在 `src/utils/request.ts` 中创建统一实例，再由 `src/api` 下的业务接口文件调用该实例。

### TypeScript 类型支持

TypeScript 类型支持主要用于约束接口响应结构、请求参数结构以及业务数据结构。合理的类型设计可以让接口调用具备更好的代码提示和编译期检查能力。

通常项目中的后端响应会有统一格式，例如：

```json
{
  "code": 200,
  "message": "操作成功",
  "data": {}
}
```

因此前端可以先定义一个通用响应类型。

通用接口响应类型定义在 `src/types/api.ts`，用于约束后端统一返回结构、分页结构和常见请求参数。

文件位置：`src/types/api.ts`

```typescript
/**
 * 后端统一响应结构
 */
export interface ApiResult<T = unknown> {
  /** 业务状态码 */
  code: number

  /** 响应消息 */
  message: string

  /** 响应数据 */
  data: T

  /** 服务端时间戳，可根据后端实际结构保留或删除 */
  timestamp?: number
}

/**
 * 分页响应结构
 */
export interface PageResult<T = unknown> {
  /** 当前页数据 */
  records: T[]

  /** 总条数 */
  total: number

  /** 当前页码 */
  current: number

  /** 每页条数 */
  size: number
}

/**
 * 通用分页查询参数
 */
export interface PageQuery {
  /** 当前页码 */
  current: number

  /** 每页条数 */
  size: number
}

/**
 * 通用 ID 参数
 */
export interface IdParam {
  /** 数据 ID */
  id: string | number
}
```

业务接口可以基于通用类型继续扩展，例如用户列表接口：

```typescript
import type { PageQuery } from '@/types/api'

/**
 * 用户查询参数
 */
export interface UserQuery extends PageQuery {
  /** 用户名称 */
  username?: string

  /** 手机号 */
  phone?: string

  /** 状态 */
  status?: number
}

/**
 * 用户列表项
 */
export interface UserItem {
  /** 用户 ID */
  id: number

  /** 用户名 */
  username: string

  /** 昵称 */
  nickname: string

  /** 手机号 */
  phone: string

  /** 状态 */
  status: number

  /** 创建时间 */
  createTime: string
}
```

这种方式可以保证 API 调用时的入参和返回值都有明确类型，减少接口字段变化带来的隐性错误。

### Vue3 项目目录规划

Axios 请求模块建议与业务 API、类型定义、环境配置分层管理。目录规划的核心原则是：请求实例只负责通用请求能力，业务 API 文件只负责具体接口定义，页面组件只负责调用接口并处理展示逻辑。

推荐目录结构如下：

```text
src
├── api
│   ├── user.ts              # 用户模块接口
│   ├── role.ts              # 角色模块接口
│   └── system.ts            # 系统模块接口
├── types
│   ├── api.ts               # 通用接口响应类型
│   └── user.ts              # 用户模块类型
├── utils
│   └── request.ts           # Axios 实例与拦截器封装
├── stores
│   └── user.ts              # 用户状态管理
├── views
│   └── user
│       └── index.vue        # 用户页面
├── router
│   └── index.ts             # 路由配置
└── main.ts                  # 应用入口
```

目录职责建议如下：

| 目录或文件             | 职责                                                  |
| ---------------------- | ----------------------------------------------------- |
| `src/utils/request.ts` | 创建 Axios 实例，配置请求拦截器、响应拦截器、异常处理 |
| `src/api/*.ts`         | 按业务模块封装接口方法                                |
| `src/types/api.ts`     | 定义通用接口类型，例如统一响应、分页响应              |
| `src/types/*.ts`       | 定义具体业务模块类型                                  |
| `src/views/**/*.vue`   | 页面中调用 API 方法，不直接调用 Axios                 |
| `src/stores/*.ts`      | 维护跨页面共享状态，例如用户信息、权限、Token         |

在实际开发中，不建议将所有接口都写在一个 `api.ts` 文件中。随着业务增长，单文件会变得难以维护。更推荐按业务域拆分，例如 `user.ts`、`order.ts`、`file.ts`、`auth.ts`。

## 基础封装

基础封装主要完成 Axios 实例创建、公共配置、超时时间设置和请求地址统一管理。这一层封装是后续请求拦截器、响应拦截器、业务 API 方法的基础。

### Axios 实例创建

Axios 实例创建建议放在 `src/utils/request.ts` 中，项目中所有业务接口都通过这个实例发起请求。这样可以保证请求行为统一，避免不同页面各自维护请求配置。

下面代码用于创建统一的 Axios 实例，并配置基础请求地址、超时时间和默认请求头。

文件位置：`src/utils/request.ts`

```typescript
import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig
} from 'axios'
import type { ApiResult } from '@/types/api'

/**
 * 创建 Axios 请求实例
 */
const request: AxiosInstance = axios.create({
  // 接口基础地址，优先读取环境变量
  baseURL: import.meta.env.VITE_API_BASE_URL,

  // 请求超时时间，单位毫秒
  timeout: 10000,

  // 默认请求头
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
})

/**
 * 请求拦截器
 */
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 后续可在这里统一注入 Token、处理请求参数、记录请求日志
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

/**
 * 响应拦截器
 */
request.interceptors.response.use(
  (response: AxiosResponse<ApiResult>) => {
    // 后续可在这里统一处理业务状态码和响应数据解包
    return response
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default request
export type { AxiosRequestConfig }
```

业务 API 文件中不再直接使用原生 `axios`，而是统一引入该请求实例：

```typescript
import request from '@/utils/request'

export function getUserInfo() {
  return request.get('/user/info')
}
```

这种封装方式可以保证后续新增 Token、错误提示、登录失效处理时，只需要修改 `request.ts`，不需要逐个修改页面或接口文件。

### 基础配置项

Axios 实例的基础配置项用于定义所有请求都需要遵循的公共规则。常见配置包括 `baseURL`、`timeout`、`headers`、`withCredentials` 等。

推荐配置如下：

```typescript
const request = axios.create({
  // 后端接口基础路径
  baseURL: import.meta.env.VITE_API_BASE_URL,

  // 请求超时时间
  timeout: 10000,

  // 是否跨域携带 Cookie，根据项目认证方式决定是否开启
  withCredentials: false,

  // 默认请求头
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
})
```

常用配置项说明：

| 配置项             | 说明            | 建议                                           |
| ------------------ | --------------- | ---------------------------------------------- |
| `baseURL`          | 请求基础地址    | 从 Vite 环境变量读取                           |
| `timeout`          | 请求超时时间    | 一般设置为 `10000` 到 `30000` 毫秒             |
| `headers`          | 默认请求头      | JSON 接口使用 `application/json;charset=utf-8` |
| `withCredentials`  | 是否携带 Cookie | 使用 Cookie 鉴权时开启                         |
| `responseType`     | 响应数据类型    | 文件下载时可设置为 `blob`                      |
| `paramsSerializer` | GET 参数序列化  | 参数格式复杂时再配置                           |

如果项目中存在多个后端服务，不建议在一个 Axios 实例中通过大量条件判断处理。可以创建多个实例，例如：

```typescript
// 业务接口实例
export const serviceRequest = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000
})

// 文件服务实例
export const fileRequest = axios.create({
  baseURL: import.meta.env.VITE_FILE_BASE_URL,
  timeout: 30000
})
```

多实例适用于以下场景：

1. 业务接口和文件接口的基础地址不同。
2. 不同服务的超时时间不同。
3. 不同服务的请求头或鉴权方式不同。
4. 某些服务不需要统一响应解包。

普通后台管理系统通常一个实例即可满足需求；复杂项目再考虑多实例拆分。

### 请求超时时间配置

请求超时时间用于避免接口长时间无响应导致页面一直等待。Axios 的 `timeout` 单位是毫秒，例如 `10000` 表示 10 秒。

一般业务接口可以设置为 10 秒：

```typescript
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000
})
```

如果接口涉及文件上传、文件下载、数据导入导出等耗时操作，可以单独覆盖请求超时时间：

```typescript
import request from '@/utils/request'

/**
 * 导出用户数据
 */
export function exportUser() {
  return request.get('/user/export', {
    responseType: 'blob',

    // 文件导出可能耗时较长，单独设置 60 秒超时
    timeout: 60000
  })
}
```

也可以在 API 方法中对特殊接口单独配置：

```typescript
import request from '@/utils/request'

/**
 * 上传文件
 */
export function uploadFile(file: File) {
  const formData = new FormData()
  formData.append('file', file)

  return request.post('/file/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },

    // 上传接口根据文件大小适当延长超时时间
    timeout: 120000
  })
}
```

超时时间建议按接口类型区分：

| 接口类型           | 建议超时时间             |
| ------------------ | ------------------------ |
| 普通查询接口       | `10000` 毫秒             |
| 表单提交接口       | `10000` 到 `15000` 毫秒  |
| 文件上传接口       | `60000` 到 `120000` 毫秒 |
| 文件下载接口       | `60000` 到 `120000` 毫秒 |
| 大数据导入导出接口 | 根据业务情况单独设置     |

超时时间不建议设置过短，否则弱网环境下容易误判请求失败；也不建议设置过长，否则后端异常时用户等待时间过久。

### 请求地址统一管理

请求地址统一管理主要依赖 Vite 环境变量。不同环境使用不同的接口基础地址，例如开发环境、测试环境和生产环境。

推荐在项目根目录创建以下环境文件：

```text
.env.development
.env.test
.env.production
```

开发环境配置文件用于本地开发时访问后端服务。

文件位置：`.env.development`

```properties
# 当前运行环境
VITE_APP_ENV=development

# 后端接口基础地址
VITE_API_BASE_URL=/api
```

测试环境配置文件用于连接测试环境后端服务。

文件位置：`.env.test`

```properties
# 当前运行环境
VITE_APP_ENV=test

# 测试环境后端接口地址
VITE_API_BASE_URL=https://test-api.example.com
```

生产环境配置文件用于连接正式环境后端服务。

文件位置：`.env.production`

```properties
# 当前运行环境
VITE_APP_ENV=production

# 生产环境后端接口地址
VITE_API_BASE_URL=https://api.example.com
```

在 Axios 实例中统一读取环境变量：

```typescript
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
})
```

如果开发环境使用 `/api` 作为代理前缀，需要在 Vite 中配置代理。

下面配置用于将本地 `/api` 请求代理到后端服务，避免浏览器跨域问题。

文件位置：`vite.config.ts`

```typescript
import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())

  return {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      proxy: {
        '/api': {
          // 后端服务地址
          target: env.VITE_PROXY_TARGET || 'http://localhost:8080',

          // 是否修改请求源
          changeOrigin: true,

          // 去掉 /api 前缀后转发到后端
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    }
  }
})
```

对应的开发环境配置可以补充代理目标地址：

```properties
# 当前运行环境
VITE_APP_ENV=development

# 前端请求统一使用 /api 前缀
VITE_API_BASE_URL=/api

# Vite 本地代理目标地址
VITE_PROXY_TARGET=http://localhost:8080
```

这种方式下，前端代码中只需要写业务接口路径：

```typescript
request.get('/user/list')
```

开发环境实际请求路径为：

```text
http://localhost:5173/api/user/list
```

经过 Vite 代理后转发到：

```text
http://localhost:8080/user/list
```

生产环境则直接根据 `.env.production` 中的 `VITE_API_BASE_URL` 请求正式接口地址。

请求地址统一管理的核心原则是：业务代码不硬编码完整后端地址，统一通过环境变量和 Axios 实例控制接口基础路径。这样可以保证同一套前端代码在开发、测试、生产环境之间平滑切换。



## 请求拦截器

请求拦截器用于在请求真正发送到后端之前统一处理请求配置。常见场景包括 Token 注入、请求参数清理、公共请求头追加、请求日志输出等。

请求拦截器适合处理“所有接口都需要遵循的公共规则”，不建议在这里写具体业务判断。例如，是否允许提交某个表单、是否刷新某个页面列表，这些逻辑应该放在页面组件或业务函数中。

### Token 注入

Token 注入用于在每次请求前自动读取本地登录凭证，并写入请求头。这样业务 API 文件不需要每次手动传递 Token，页面组件也不需要关心认证请求头的细节。

通常 Token 会保存在 `localStorage`、`sessionStorage` 或 Pinia 持久化状态中。对于普通后台管理系统，可以先使用 `localStorage` 进行统一封装。

下面代码用于统一管理 Token 的读取、写入和删除。

文件位置：`src/utils/auth.ts`

```typescript
const TOKEN_KEY = 'ACCESS_TOKEN'

/**
 * 获取 Token
 */
export function getToken(): string {
  return localStorage.getItem(TOKEN_KEY) || ''
}

/**
 * 设置 Token
 */
export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

/**
 * 删除 Token
 */
export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}
```

在 Axios 请求拦截器中读取 Token，并注入到 `Authorization` 请求头中。

文件位置：`src/utils/request.ts`

```typescript
import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig
} from 'axios'
import { getToken } from '@/utils/auth'
import type { ApiResult } from '@/types/api'

const request: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
})

request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken()

    if (token) {
      // 根据后端认证规则决定是否使用 Bearer 前缀
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

request.interceptors.response.use(
  (response: AxiosResponse<ApiResult>) => {
    return response
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default request
```

如果后端要求的请求头不是 `Authorization`，而是自定义字段，例如 `X-Access-Token`，可以调整为：

```typescript
config.headers['X-Access-Token'] = token
```

Token 注入建议只放在请求拦截器中统一处理，避免业务接口文件重复写请求头。

### 请求参数处理

请求参数处理用于在请求发送前对 `params` 或 `data` 做统一清理。常见处理包括移除空字符串、移除 `null`、移除 `undefined`、统一处理字符串前后空格等。

需要注意的是，请求参数处理不能过度侵入业务。某些接口可能需要保留空字符串或 `null` 作为有效业务值，因此建议默认只对 GET 查询参数做轻量清理，POST 请求体是否清理应根据项目规范决定。

下面代码用于递归移除对象中的空字符串、`null` 和 `undefined`，同时避免处理 `File`、`Blob`、`FormData` 等特殊对象。

文件位置：`src/utils/request-helper.ts`

```typescript
/**
 * 判断是否为普通对象
 */
function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Object.prototype.toString.call(value) === '[object Object]'
}

/**
 * 判断是否为空值
 */
function isEmptyValue(value: unknown): boolean {
  return value === '' || value === null || value === undefined
}

/**
 * 清理对象中的空值
 */
export function removeEmptyValue<T>(value: T): T {
  if (Array.isArray(value)) {
    return value
      .map((item) => removeEmptyValue(item))
      .filter((item) => !isEmptyValue(item)) as T
  }

  if (!isPlainObject(value)) {
    return value
  }

  const result: Record<string, unknown> = {}

  Object.entries(value).forEach(([key, item]) => {
    if (isEmptyValue(item)) {
      return
    }

    result[key] = isPlainObject(item) || Array.isArray(item)
      ? removeEmptyValue(item)
      : item
  })

  return result as T
}
```

在请求拦截器中对 GET 请求的 `params` 进行统一清理。

文件位置：`src/utils/request.ts`

```typescript
import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig
} from 'axios'
import { getToken } from '@/utils/auth'
import { removeEmptyValue } from '@/utils/request-helper'
import type { ApiResult } from '@/types/api'

const request: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
})

request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken()

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    if (config.params) {
      // 清理 GET 查询参数中的空字符串、null、undefined
      config.params = removeEmptyValue(config.params)
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

request.interceptors.response.use(
  (response: AxiosResponse<ApiResult>) => {
    return response
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default request
```

例如页面中传入以下查询参数：

```typescript
const params = {
  current: 1,
  size: 10,
  username: '',
  phone: undefined,
  status: 1
}
```

经过请求拦截器处理后，实际发送到后端的查询参数为：

```typescript
{
  current: 1,
  size: 10,
  status: 1
}
```

这种处理可以减少后端接收到无意义空参数的情况，也可以降低查询条件误判的概率。

### 请求日志记录

请求日志记录用于开发环境调试接口调用情况，例如请求方法、请求地址、请求参数和请求耗时。日志不建议在生产环境大量输出，否则可能暴露敏感信息，也会影响控制台可读性。

可以在请求拦截器中记录请求开始时间，在响应拦截器中计算请求耗时。

下面代码用于在开发环境输出请求日志，并记录请求开始时间。

文件位置：`src/utils/request.ts`

```typescript
import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig
} from 'axios'
import { getToken } from '@/utils/auth'
import { removeEmptyValue } from '@/utils/request-helper'
import type { ApiResult } from '@/types/api'

interface RequestConfig extends InternalAxiosRequestConfig {
  metadata?: {
    startTime: number
  }
}

const request: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
})

request.interceptors.request.use(
  (config: RequestConfig) => {
    const token = getToken()

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    if (config.params) {
      config.params = removeEmptyValue(config.params)
    }

    config.metadata = {
      startTime: Date.now()
    }

    if (import.meta.env.DEV) {
      console.info('[请求发送]', {
        method: config.method?.toUpperCase(),
        url: config.url,
        params: config.params,
        data: config.data
      })
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

request.interceptors.response.use(
  (response: AxiosResponse<ApiResult>) => {
    const config = response.config as RequestConfig
    const duration = config.metadata?.startTime
      ? Date.now() - config.metadata.startTime
      : 0

    if (import.meta.env.DEV) {
      console.info('[请求成功]', {
        method: config.method?.toUpperCase(),
        url: config.url,
        duration: `${duration}ms`,
        response: response.data
      })
    }

    return response
  },
  (error) => {
    const config = error.config as RequestConfig | undefined
    const duration = config?.metadata?.startTime
      ? Date.now() - config.metadata.startTime
      : 0

    if (import.meta.env.DEV) {
      console.error('[请求失败]', {
        method: config?.method?.toUpperCase(),
        url: config?.url,
        duration: `${duration}ms`,
        message: error.message
      })
    }

    return Promise.reject(error)
  }
)

export default request
```

请求日志建议遵循以下规则：

| 场景     | 建议                                  |
| -------- | ------------------------------------- |
| 开发环境 | 可以输出请求参数、响应数据、耗时      |
| 测试环境 | 可根据需要开启部分日志                |
| 生产环境 | 默认关闭详细日志                      |
| 敏感字段 | 不输出密码、Token、身份证号等敏感信息 |
| 文件上传 | 不输出完整文件对象内容                |

如果项目对日志有更高要求，可以封装独立的 `logger.ts`，在开发环境输出到控制台，在生产环境对接前端监控平台。

## 响应拦截器

响应拦截器用于在接口响应返回页面之前统一处理响应结构、业务状态码、HTTP 异常、登录失效等逻辑。它是 Axios 封装中最关键的部分之一。

响应拦截器需要明确区分两类异常：一类是 HTTP 协议层异常，例如 `401`、`404`、`500`；另一类是业务层异常，例如 HTTP 状态为 `200`，但后端返回 `code !== 200`。

### 响应数据统一解包

后端通常会返回统一结构，例如：

```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "id": 1,
    "username": "admin"
  }
}
```

页面组件通常真正关心的是 `data` 字段，而不是完整的响应对象。因此可以在响应拦截器中统一解包，让业务 API 调用直接拿到业务数据。

下面代码用于在响应成功时判断业务状态码，并返回真正的业务数据。

文件位置：`src/utils/request.ts`

```typescript
import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig
} from 'axios'
import { ElMessage } from 'element-plus'
import { getToken } from '@/utils/auth'
import { removeEmptyValue } from '@/utils/request-helper'
import type { ApiResult } from '@/types/api'

const SUCCESS_CODE = 200

const request: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
})

request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken()

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    if (config.params) {
      config.params = removeEmptyValue(config.params)
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

request.interceptors.response.use(
  (response: AxiosResponse<ApiResult>) => {
    const result = response.data

    if (result.code === SUCCESS_CODE) {
      return result.data
    }

    ElMessage.error(result.message || '接口请求失败')
    return Promise.reject(result)
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default request
```

使用这种方式后，业务 API 方法返回的是后端 `data` 字段。

```typescript
import request from '@/utils/request'
import type { UserInfo } from '@/types/user'

/**
 * 获取当前用户信息
 */
export function getUserInfo(): Promise<UserInfo> {
  return request.get('/user/info')
}
```

页面中调用时可以直接拿到 `UserInfo`：

```typescript
const userInfo = await getUserInfo()
console.log(userInfo.username)
```

这种方式可以减少页面中重复写 `res.data.data` 或 `res.data` 的情况。

### 业务状态码处理

业务状态码由后端接口响应体中的 `code` 字段表示。即使 HTTP 状态码是 `200`，也可能存在业务失败，例如参数错误、权限不足、数据不存在、登录失效等。

常见业务状态码可以统一维护在常量中。

文件位置：`src/constants/http-code.ts`

```typescript
/**
 * 业务状态码
 */
export const BusinessCode = {
  SUCCESS: 200,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  ERROR: 500
} as const

/**
 * HTTP 状态码
 */
export const HttpStatusCode = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
} as const
```

响应拦截器中根据业务状态码进行统一处理。

文件位置：`src/utils/request.ts`

```typescript
import axios, { type AxiosInstance, type AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'
import { BusinessCode } from '@/constants/http-code'
import type { ApiResult } from '@/types/api'

const request: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
})

request.interceptors.response.use(
  (response: AxiosResponse<ApiResult>) => {
    const result = response.data

    switch (result.code) {
      case BusinessCode.SUCCESS:
        return result.data

      case BusinessCode.UNAUTHORIZED:
        ElMessage.error(result.message || '登录状态已失效，请重新登录')
        return Promise.reject(result)

      case BusinessCode.FORBIDDEN:
        ElMessage.error(result.message || '没有操作权限')
        return Promise.reject(result)

      default:
        ElMessage.error(result.message || '业务处理失败')
        return Promise.reject(result)
    }
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default request
```

业务状态码处理建议遵循以下原则：

| 类型       | 处理方式                 |
| ---------- | ------------------------ |
| 成功状态码 | 直接返回业务数据         |
| 登录失效   | 清理登录状态并跳转登录页 |
| 权限不足   | 提示无权限，通常不跳转   |
| 参数错误   | 提示后端返回的错误消息   |
| 系统异常   | 提示通用错误消息         |
| 未知状态码 | 统一按业务失败处理       |

业务状态码的具体数值应以后端接口规范为准。前端不应自行假设过多状态码含义，应与后端保持一致。

### HTTP 异常处理

HTTP 异常是指请求没有正常拿到成功响应，常见情况包括网络错误、接口超时、服务端异常、接口不存在、认证失败等。

Axios 的异常对象中通常包含 `response`、`request`、`message` 等信息：

| 字段             | 说明                                    |
| ---------------- | --------------------------------------- |
| `error.response` | 后端有响应，但 HTTP 状态码不是成功状态  |
| `error.request`  | 请求已发出，但没有收到响应              |
| `error.message`  | Axios 或浏览器产生的错误信息            |
| `error.code`     | 错误编码，例如超时可能是 `ECONNABORTED` |

可以封装统一的 HTTP 异常消息方法。

文件位置：`src/utils/http-error.ts`

```typescript
import { HttpStatusCode } from '@/constants/http-code'

/**
 * 获取 HTTP 异常提示
 */
export function getHttpErrorMessage(status?: number): string {
  switch (status) {
    case HttpStatusCode.UNAUTHORIZED:
      return '登录状态已失效，请重新登录'
    case HttpStatusCode.FORBIDDEN:
      return '没有操作权限'
    case HttpStatusCode.NOT_FOUND:
      return '请求接口不存在'
    case HttpStatusCode.INTERNAL_SERVER_ERROR:
      return '服务器内部异常'
    default:
      return '网络异常，请稍后重试'
  }
}
```

在响应拦截器的异常回调中统一处理 HTTP 异常。

文件位置：`src/utils/request.ts`

```typescript
import axios, { type AxiosError, type AxiosInstance, type AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'
import { getHttpErrorMessage } from '@/utils/http-error'
import type { ApiResult } from '@/types/api'

const request: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
})

request.interceptors.response.use(
  (response: AxiosResponse<ApiResult>) => {
    const result = response.data

    if (result.code === 200) {
      return result.data
    }

    ElMessage.error(result.message || '接口请求失败')
    return Promise.reject(result)
  },
  (error: AxiosError<ApiResult>) => {
    if (error.code === 'ECONNABORTED') {
      ElMessage.error('请求超时，请稍后重试')
      return Promise.reject(error)
    }

    const status = error.response?.status
    const message = error.response?.data?.message || getHttpErrorMessage(status)

    ElMessage.error(message)

    return Promise.reject(error)
  }
)

export default request
```

HTTP 异常处理建议放在响应拦截器中统一处理，页面只需要在必要时捕获异常，例如关闭 Loading、回滚状态、阻止后续流程等。

### 登录失效处理

登录失效通常有两种来源：一种是 HTTP 状态码返回 `401`，另一种是 HTTP 状态码为 `200`，但业务响应体中的 `code` 表示未登录或 Token 过期。

登录失效处理一般包括以下步骤：

1. 删除本地 Token。
2. 清理用户状态。
3. 提示用户重新登录。
4. 跳转到登录页。
5. 携带当前页面地址，便于登录后回跳。

如果项目使用 Vue Router，可以将路由实例引入请求模块中。

文件位置：`src/router/index.ts`

```typescript
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/login/index.vue')
    }
  ]
})

export default router
```

下面代码用于封装登录失效处理逻辑，避免多个地方重复清理状态和跳转。

文件位置：`src/utils/auth-handler.ts`

```typescript
import { ElMessage } from 'element-plus'
import router from '@/router'
import { removeToken } from '@/utils/auth'

let isRedirecting = false

/**
 * 处理登录失效
 */
export function handleUnauthorized(message = '登录状态已失效，请重新登录'): void {
  removeToken()

  if (isRedirecting) {
    return
  }

  isRedirecting = true
  ElMessage.error(message)

  const currentPath = router.currentRoute.value.fullPath

  router
    .replace({
      path: '/login',
      query: {
        redirect: currentPath
      }
    })
    .finally(() => {
      isRedirecting = false
    })
}
```

在响应拦截器中同时处理业务 `401` 和 HTTP `401`。

文件位置：`src/utils/request.ts`

```typescript
import axios, { type AxiosError, type AxiosInstance, type AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'
import { BusinessCode, HttpStatusCode } from '@/constants/http-code'
import { handleUnauthorized } from '@/utils/auth-handler'
import { getHttpErrorMessage } from '@/utils/http-error'
import type { ApiResult } from '@/types/api'

const request: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
})

request.interceptors.response.use(
  (response: AxiosResponse<ApiResult>) => {
    const result = response.data

    if (result.code === BusinessCode.SUCCESS) {
      return result.data
    }

    if (result.code === BusinessCode.UNAUTHORIZED) {
      handleUnauthorized(result.message)
      return Promise.reject(result)
    }

    ElMessage.error(result.message || '接口请求失败')
    return Promise.reject(result)
  },
  (error: AxiosError<ApiResult>) => {
    const status = error.response?.status

    if (status === HttpStatusCode.UNAUTHORIZED) {
      handleUnauthorized(error.response?.data?.message)
      return Promise.reject(error)
    }

    if (error.code === 'ECONNABORTED') {
      ElMessage.error('请求超时，请稍后重试')
      return Promise.reject(error)
    }

    ElMessage.error(error.response?.data?.message || getHttpErrorMessage(status))
    return Promise.reject(error)
  }
)

export default request
```

登录失效处理需要注意避免重复跳转。如果多个接口同时返回 `401`，可能导致多次弹出提示或重复跳转登录页，因此示例中通过 `isRedirecting` 做了简单防抖控制。

## 类型设计

类型设计用于约束请求参数、响应结果和业务数据结构。Vue3 + TypeScript 项目中，Axios 封装不应只追求能发请求，还应该让接口调用具备明确的类型提示。

类型设计建议分为三层：通用响应类型、请求参数类型、接口返回值类型。

### 通用响应类型

通用响应类型用于描述后端统一响应结构。一般包括业务状态码、提示消息、业务数据和可选扩展字段。

文件位置：`src/types/api.ts`

```typescript
/**
 * 后端统一响应结构
 */
export interface ApiResult<T = unknown> {
  /** 业务状态码 */
  code: number

  /** 响应消息 */
  message: string

  /** 响应数据 */
  data: T

  /** 服务端时间戳 */
  timestamp?: number

  /** 请求链路 ID，便于问题排查 */
  traceId?: string
}

/**
 * 分页响应结构
 */
export interface PageResult<T = unknown> {
  /** 当前页数据 */
  records: T[]

  /** 总条数 */
  total: number

  /** 当前页码 */
  current: number

  /** 每页条数 */
  size: number

  /** 总页数 */
  pages?: number
}

/**
 * 无返回数据类型
 */
export type EmptyResult = null | undefined | Record<string, never>
```

如果响应拦截器已经统一返回 `result.data`，那么业务 API 方法通常不需要返回 `ApiResult<T>`，而是直接返回 `Promise<T>`。

```typescript
import request from '@/utils/request'
import type { UserInfo } from '@/types/user'

/**
 * 获取当前用户信息
 */
export function getUserInfo(): Promise<UserInfo> {
  return request.get('/user/info')
}
```

如果某些接口需要完整响应结构，例如需要读取 `traceId` 或 `message`，可以单独提供不解包的请求方法，或者在请求配置中增加自定义开关。普通业务接口不建议混用多种返回结构，否则页面调用会变得不统一。

### 请求参数类型

请求参数类型用于约束接口入参，常见类型包括分页查询参数、详情查询参数、创建参数、更新参数、删除参数等。

通用请求参数可以放在 `src/types/api.ts` 中。

文件位置：`src/types/api.ts`

```typescript
/**
 * 分页查询参数
 */
export interface PageQuery {
  /** 当前页码 */
  current: number

  /** 每页条数 */
  size: number
}

/**
 * 通用 ID 参数
 */
export interface IdParam {
  /** 数据 ID */
  id: string | number
}

/**
 * 通用批量 ID 参数
 */
export interface IdsParam {
  /** 数据 ID 集合 */
  ids: Array<string | number>
}

/**
 * 排序参数
 */
export interface SortQuery {
  /** 排序字段 */
  sortField?: string

  /** 排序方式 */
  sortOrder?: 'asc' | 'desc'
}
```

业务模块参数建议独立放在对应业务类型文件中。

文件位置：`src/types/user.ts`

```typescript
import type { PageQuery, SortQuery } from '@/types/api'

/**
 * 用户分页查询参数
 */
export interface UserPageQuery extends PageQuery, SortQuery {
  /** 用户名 */
  username?: string

  /** 昵称 */
  nickname?: string

  /** 手机号 */
  phone?: string

  /** 用户状态 */
  status?: number
}

/**
 * 用户创建参数
 */
export interface UserCreateParam {
  /** 用户名 */
  username: string

  /** 昵称 */
  nickname: string

  /** 手机号 */
  phone?: string

  /** 密码 */
  password: string

  /** 角色 ID 集合 */
  roleIds: number[]
}

/**
 * 用户更新参数
 */
export interface UserUpdateParam {
  /** 用户 ID */
  id: number

  /** 昵称 */
  nickname: string

  /** 手机号 */
  phone?: string

  /** 用户状态 */
  status: number

  /** 角色 ID 集合 */
  roleIds: number[]
}
```

请求参数类型建议遵循以下规范：

| 类型     | 命名建议         | 示例              |
| -------- | ---------------- | ----------------- |
| 查询参数 | `XxxQuery`       | `UserPageQuery`   |
| 创建参数 | `XxxCreateParam` | `UserCreateParam` |
| 更新参数 | `XxxUpdateParam` | `UserUpdateParam` |
| 删除参数 | `XxxDeleteParam` | `UserDeleteParam` |
| 导入参数 | `XxxImportParam` | `UserImportParam` |
| 导出参数 | `XxxExportQuery` | `UserExportQuery` |

不要直接在 API 方法中大量使用内联类型，否则多个页面复用接口时不方便维护。

不推荐：

```typescript
export function pageUser(params: { current: number; size: number; username?: string }) {
  return request.get('/user/page', { params })
}
```

推荐：

```typescript
import type { UserPageQuery } from '@/types/user'

export function pageUser(params: UserPageQuery) {
  return request.get('/user/page', { params })
}
```

### 接口返回值类型

接口返回值类型用于描述后端 `data` 字段中的具体业务数据。它通常与页面展示、表单回显、详情展示、下拉选项等场景直接相关。

业务返回值类型建议与请求参数类型放在同一个业务类型文件中，便于维护。

文件位置：`src/types/user.ts`

```typescript
/**
 * 用户列表项
 */
export interface UserItem {
  /** 用户 ID */
  id: number

  /** 用户名 */
  username: string

  /** 昵称 */
  nickname: string

  /** 手机号 */
  phone: string

  /** 用户状态 */
  status: number

  /** 创建时间 */
  createTime: string
}

/**
 * 用户详情
 */
export interface UserDetail {
  /** 用户 ID */
  id: number

  /** 用户名 */
  username: string

  /** 昵称 */
  nickname: string

  /** 手机号 */
  phone: string

  /** 邮箱 */
  email?: string

  /** 用户状态 */
  status: number

  /** 角色 ID 集合 */
  roleIds: number[]

  /** 创建时间 */
  createTime: string

  /** 更新时间 */
  updateTime: string
}

/**
 * 用户选项
 */
export interface UserOption {
  /** 用户 ID */
  id: number

  /** 用户昵称 */
  nickname: string
}
```

业务 API 文件中使用请求参数类型和返回值类型组合接口方法。

文件位置：`src/api/user.ts`

```typescript
import request from '@/utils/request'
import type { EmptyResult, PageResult } from '@/types/api'
import type {
  UserCreateParam,
  UserDetail,
  UserItem,
  UserOption,
  UserPageQuery,
  UserUpdateParam
} from '@/types/user'

/**
 * 分页查询用户
 */
export function pageUser(params: UserPageQuery): Promise<PageResult<UserItem>> {
  return request.get('/user/page', { params })
}

/**
 * 查询用户详情
 */
export function getUserDetail(id: number): Promise<UserDetail> {
  return request.get(`/user/${id}`)
}

/**
 * 创建用户
 */
export function createUser(data: UserCreateParam): Promise<EmptyResult> {
  return request.post('/user', data)
}

/**
 * 更新用户
 */
export function updateUser(data: UserUpdateParam): Promise<EmptyResult> {
  return request.put('/user', data)
}

/**
 * 删除用户
 */
export function deleteUser(id: number): Promise<EmptyResult> {
  return request.delete(`/user/${id}`)
}

/**
 * 查询用户选项
 */
export function listUserOption(): Promise<UserOption[]> {
  return request.get('/user/options')
}
```

页面中调用时可以获得明确的类型提示。

文件位置：`src/views/user/index.vue`

```vue
<template>
  <el-card>
    <el-table :data="userList" border>
      <el-table-column prop="username" label="用户名" />
      <el-table-column prop="nickname" label="昵称" />
      <el-table-column prop="phone" label="手机号" />
      <el-table-column prop="createTime" label="创建时间" />
    </el-table>
  </el-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { pageUser } from '@/api/user'
import type { UserItem, UserPageQuery } from '@/types/user'

const userList = ref<UserItem[]>([])

const queryParams = ref<UserPageQuery>({
  current: 1,
  size: 10,
  username: undefined,
  status: undefined
})

/**
 * 加载用户列表
 */
async function loadUserList() {
  try {
    const result = await pageUser(queryParams.value)
    userList.value = result.records
  } catch (error) {
    ElMessage.error('加载用户列表失败')
  }
}

onMounted(() => {
  loadUserList()
})
</script>
```

接口返回值类型建议遵循以下原则：

| 场景     | 命名建议         | 示例             |
| -------- | ---------------- | ---------------- |
| 列表项   | `XxxItem`        | `UserItem`       |
| 详情数据 | `XxxDetail`      | `UserDetail`     |
| 下拉选项 | `XxxOption`      | `UserOption`     |
| 统计结果 | `XxxStatistics`  | `UserStatistics` |
| 登录返回 | `XxxLoginResult` | `LoginResult`    |

类型设计的核心目标是让接口调用方清楚知道“传什么参数”和“返回什么数据”。对于 Vue3 + TypeScript 项目，良好的类型定义可以明显降低接口联调和后期维护成本。



## API 模块拆分

API 模块拆分用于将具体业务接口从 Axios 基础封装中分离出来。Axios 实例只负责通用请求能力，业务 API 文件负责声明具体接口方法，例如用户接口、角色接口、菜单接口、文件接口等。

合理的 API 模块拆分可以避免接口方法集中堆积在单个文件中，也能让页面调用关系更加清晰。

### 按业务模块拆分接口

在 Vue3 项目中，推荐将 API 文件放在 `src/api` 目录下，并按照业务域进行拆分。每个业务模块维护自己的接口方法，类型定义放在 `src/types` 中。

推荐目录结构如下：

```text
src
├── api
│   ├── auth.ts              # 登录、退出、刷新 Token
│   ├── user.ts              # 用户管理接口
│   ├── role.ts              # 角色管理接口
│   ├── menu.ts              # 菜单管理接口
│   └── file.ts              # 文件上传下载接口
├── types
│   ├── api.ts               # 通用接口类型
│   ├── auth.ts              # 认证模块类型
│   ├── user.ts              # 用户模块类型
│   ├── role.ts              # 角色模块类型
│   └── file.ts              # 文件模块类型
└── utils
    └── request.ts           # Axios 统一请求实例
```

业务 API 文件只做接口声明，不处理页面状态、不处理表格数据、不控制弹窗、不编写复杂业务流程。

用户模块接口示例：

文件位置：`src/api/user.ts`

下面代码按用户业务模块封装分页查询、详情、创建、更新、删除和选项查询接口。

```typescript
import request from '@/utils/request'
import type { EmptyResult, PageResult } from '@/types/api'
import type {
  UserCreateParam,
  UserDetail,
  UserItem,
  UserOption,
  UserPageQuery,
  UserUpdateParam
} from '@/types/user'

/**
 * 分页查询用户
 */
export function pageUser(params: UserPageQuery): Promise<PageResult<UserItem>> {
  return request.get('/user/page', { params })
}

/**
 * 查询用户详情
 */
export function getUserDetail(id: number): Promise<UserDetail> {
  return request.get(`/user/${id}`)
}

/**
 * 创建用户
 */
export function createUser(data: UserCreateParam): Promise<EmptyResult> {
  return request.post('/user', data)
}

/**
 * 更新用户
 */
export function updateUser(data: UserUpdateParam): Promise<EmptyResult> {
  return request.put('/user', data)
}

/**
 * 删除用户
 */
export function deleteUser(id: number): Promise<EmptyResult> {
  return request.delete(`/user/${id}`)
}

/**
 * 查询用户选项
 */
export function listUserOption(): Promise<UserOption[]> {
  return request.get('/user/options')
}
```

角色模块接口示例：

文件位置：`src/api/role.ts`

下面代码按角色业务模块封装角色分页、角色详情和角色选项接口。

```typescript
import request from '@/utils/request'
import type { EmptyResult, PageResult } from '@/types/api'
import type {
  RoleCreateParam,
  RoleDetail,
  RoleItem,
  RoleOption,
  RolePageQuery,
  RoleUpdateParam
} from '@/types/role'

/**
 * 分页查询角色
 */
export function pageRole(params: RolePageQuery): Promise<PageResult<RoleItem>> {
  return request.get('/role/page', { params })
}

/**
 * 查询角色详情
 */
export function getRoleDetail(id: number): Promise<RoleDetail> {
  return request.get(`/role/${id}`)
}

/**
 * 创建角色
 */
export function createRole(data: RoleCreateParam): Promise<EmptyResult> {
  return request.post('/role', data)
}

/**
 * 更新角色
 */
export function updateRole(data: RoleUpdateParam): Promise<EmptyResult> {
  return request.put('/role', data)
}

/**
 * 删除角色
 */
export function deleteRole(id: number): Promise<EmptyResult> {
  return request.delete(`/role/${id}`)
}

/**
 * 查询角色选项
 */
export function listRoleOption(): Promise<RoleOption[]> {
  return request.get('/role/options')
}
```

拆分后的页面调用会更加明确，例如用户页面只引入 `@/api/user`，角色页面只引入 `@/api/role`，避免不同业务接口互相混杂。

### 接口方法命名规范

接口方法命名应该体现接口动作和业务对象，避免命名过于模糊。推荐使用动词 + 业务名的形式，例如 `pageUser`、`getUserDetail`、`createUser`、`updateUser`、`deleteUser`。

常见命名建议如下：

| 场景     | 命名格式         | 示例              |
| -------- | ---------------- | ----------------- |
| 分页查询 | `pageXxx`        | `pageUser`        |
| 列表查询 | `listXxx`        | `listUserOption`  |
| 详情查询 | `getXxxDetail`   | `getUserDetail`   |
| 创建数据 | `createXxx`      | `createUser`      |
| 更新数据 | `updateXxx`      | `updateUser`      |
| 删除数据 | `deleteXxx`      | `deleteUser`      |
| 批量删除 | `batchDeleteXxx` | `batchDeleteUser` |
| 导入数据 | `importXxx`      | `importUser`      |
| 导出数据 | `exportXxx`      | `exportUser`      |
| 启用数据 | `enableXxx`      | `enableUser`      |
| 禁用数据 | `disableXxx`     | `disableUser`     |

不推荐使用以下命名：

```typescript
// 命名过于模糊
export function query(params: unknown) {}

// 无法看出业务含义
export function getData() {}

// 无法看出是新增还是修改
export function submit(data: unknown) {}

// 与业务对象无关
export function requestList(params: unknown) {}
```

推荐命名方式：

```typescript
// 能看出是用户分页查询
export function pageUser(params: UserPageQuery) {}

// 能看出是创建用户
export function createUser(data: UserCreateParam) {}

// 能看出是更新用户
export function updateUser(data: UserUpdateParam) {}
```

接口方法命名应保持同一项目内风格一致。对于后台管理系统，建议以资源对象为核心进行命名，而不是以页面名称命名。

### GET 与 POST 请求封装

GET 请求通常用于查询数据，请求参数放在 `params` 中。POST 请求通常用于新增、提交、复杂查询、上传等场景，请求体放在 `data` 中。

GET 请求封装示例：

文件位置：`src/api/user.ts`

下面代码展示 GET 查询参数、路径参数和无参数查询三种常见写法。

```typescript
import request from '@/utils/request'
import type { PageResult } from '@/types/api'
import type { UserDetail, UserItem, UserOption, UserPageQuery } from '@/types/user'

/**
 * 分页查询用户
 */
export function pageUser(params: UserPageQuery): Promise<PageResult<UserItem>> {
  return request.get('/user/page', { params })
}

/**
 * 查询用户详情
 */
export function getUserDetail(id: number): Promise<UserDetail> {
  return request.get(`/user/${id}`)
}

/**
 * 查询用户选项
 */
export function listUserOption(): Promise<UserOption[]> {
  return request.get('/user/options')
}
```

POST 请求封装示例：

文件位置：`src/api/user.ts`

下面代码展示 POST 创建、POST 复杂查询和 POST 批量操作三种常见写法。

```typescript
import request from '@/utils/request'
import type { EmptyResult, PageResult } from '@/types/api'
import type {
  UserBatchDeleteParam,
  UserCreateParam,
  UserItem,
  UserSeniorQuery
} from '@/types/user'

/**
 * 创建用户
 */
export function createUser(data: UserCreateParam): Promise<EmptyResult> {
  return request.post('/user', data)
}

/**
 * 高级查询用户
 */
export function seniorQueryUser(data: UserSeniorQuery): Promise<PageResult<UserItem>> {
  return request.post('/user/senior-query', data)
}

/**
 * 批量删除用户
 */
export function batchDeleteUser(data: UserBatchDeleteParam): Promise<EmptyResult> {
  return request.post('/user/batch-delete', data)
}
```

GET 与 POST 的使用建议如下：

| 请求方式 | 适用场景                     | 参数位置            |
| -------- | ---------------------------- | ------------------- |
| GET      | 简单查询、详情查询、选项查询 | `params` 或路径参数 |
| POST     | 新增数据、复杂查询、批量操作 | `data`              |
| PUT      | 更新完整对象                 | `data`              |
| PATCH    | 局部更新对象                 | `data`              |
| DELETE   | 删除数据                     | 路径参数或 `data`   |

如果后端规范允许，复杂查询建议使用 POST，避免 GET URL 过长，也能更清晰地传递嵌套查询条件。

## Vue3 中的使用方式

Vue3 页面中不建议直接使用 Axios 实例，而是调用 `src/api` 中封装好的业务接口方法。页面组件只负责维护查询参数、Loading 状态、表格数据、表单数据和交互行为。

这种方式可以让页面逻辑与请求封装解耦，便于后期调整请求拦截器、错误处理和接口地址。

### 在组合式 API 中调用

在组合式 API 中调用接口时，通常使用 `ref`、`reactive`、`onMounted` 和 `async/await` 组织页面逻辑。

文件位置：`src/views/user/index.vue`

下面代码展示在 Vue3 组合式 API 中调用用户分页接口，并维护查询参数、表格数据和分页总数。

```vue
<template>
  <el-card>
    <el-form :model="queryParams" inline>
      <el-form-item label="用户名">
        <el-input v-model="queryParams.username" placeholder="请输入用户名" clearable />
      </el-form-item>

      <el-form-item label="状态">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
          <el-option label="启用" :value="1" />
          <el-option label="禁用" :value="0" />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="userList" border>
      <el-table-column prop="username" label="用户名" />
      <el-table-column prop="nickname" label="昵称" />
      <el-table-column prop="phone" label="手机号" />
      <el-table-column prop="createTime" label="创建时间" />
    </el-table>

    <el-pagination
      v-model:current-page="queryParams.current"
      v-model:page-size="queryParams.size"
      :total="total"
      layout="total, sizes, prev, pager, next, jumper"
      @current-change="loadUserList"
      @size-change="loadUserList"
    />
  </el-card>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { pageUser } from '@/api/user'
import type { UserItem, UserPageQuery } from '@/types/user'

const loading = ref(false)
const total = ref(0)
const userList = ref<UserItem[]>([])

const queryParams = reactive<UserPageQuery>({
  current: 1,
  size: 10,
  username: undefined,
  status: undefined
})

/**
 * 加载用户列表
 */
async function loadUserList() {
  loading.value = true

  try {
    const result = await pageUser(queryParams)
    userList.value = result.records
    total.value = result.total
  } finally {
    loading.value = false
  }
}

/**
 * 查询用户
 */
function handleSearch() {
  queryParams.current = 1
  loadUserList()
}

/**
 * 重置查询条件
 */
function handleReset() {
  queryParams.current = 1
  queryParams.username = undefined
  queryParams.status = undefined
  loadUserList()
}

onMounted(() => {
  loadUserList()
})
</script>
```

这种写法中，页面只调用 `pageUser`，不直接接触 Axios 实例，也不关心 Token、响应解包、HTTP 异常等底层逻辑。

### 页面加载请求

页面加载请求通常放在 `onMounted` 中执行，适合初始化列表、详情、下拉选项等数据。对于多个接口并行加载的场景，可以使用 `Promise.all`。

文件位置：`src/views/user/form.vue`

下面代码展示页面初始化时并行加载用户详情和角色选项。

```vue
<template>
  <el-card>
    <el-form v-loading="loading" :model="formData" label-width="100px">
      <el-form-item label="用户名">
        <el-input v-model="formData.username" disabled />
      </el-form-item>

      <el-form-item label="昵称">
        <el-input v-model="formData.nickname" />
      </el-form-item>

      <el-form-item label="角色">
        <el-select v-model="formData.roleIds" multiple placeholder="请选择角色">
          <el-option
            v-for="role in roleOptions"
            :key="role.id"
            :label="role.name"
            :value="role.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { getUserDetail } from '@/api/user'
import { listRoleOption } from '@/api/role'
import type { RoleOption } from '@/types/role'
import type { UserDetail } from '@/types/user'

const props = defineProps<{
  userId: number
}>()

const loading = ref(false)
const roleOptions = ref<RoleOption[]>([])

const formData = reactive<UserDetail>({
  id: 0,
  username: '',
  nickname: '',
  phone: '',
  email: undefined,
  status: 1,
  roleIds: [],
  createTime: '',
  updateTime: ''
})

/**
 * 初始化页面数据
 */
async function initPageData() {
  loading.value = true

  try {
    const [userDetail, roles] = await Promise.all([
      getUserDetail(props.userId),
      listRoleOption()
    ])

    Object.assign(formData, userDetail)
    roleOptions.value = roles
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  initPageData()
})
</script>
```

页面加载请求需要注意 Loading 状态关闭。建议使用 `try...finally`，确保请求成功或失败时都能恢复页面状态。

### 表单提交请求

表单提交请求通常需要先进行表单校验，再调用 API 方法，成功后提示用户，并执行关闭弹窗、刷新列表、跳转页面等后续动作。

文件位置：`src/views/user/components/UserFormDialog.vue`

下面代码展示新增和编辑共用一个表单弹窗，根据是否存在 `id` 判断调用创建接口或更新接口。

```vue
<template>
  <el-dialog
    v-model="visible"
    :title="formData.id ? '编辑用户' : '新增用户'"
    width="520px"
    @close="handleClose"
  >
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="90px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="formData.username" :disabled="Boolean(formData.id)" />
      </el-form-item>

      <el-form-item label="昵称" prop="nickname">
        <el-input v-model="formData.nickname" />
      </el-form-item>

      <el-form-item label="手机号" prop="phone">
        <el-input v-model="formData.phone" />
      </el-form-item>

      <el-form-item v-if="!formData.id" label="密码" prop="password">
        <el-input v-model="formData.password" type="password" show-password />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" :loading="submitLoading" @click="handleSubmit">
        保存
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { createUser, updateUser } from '@/api/user'
import type { UserCreateParam, UserUpdateParam } from '@/types/user'

const emit = defineEmits<{
  success: []
}>()

const visible = ref(false)
const submitLoading = ref(false)
const formRef = ref<FormInstance>()

const formData = reactive<UserCreateParam & Partial<UserUpdateParam>>({
  id: undefined,
  username: '',
  nickname: '',
  phone: '',
  password: '',
  roleIds: []
})

const rules: FormRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

/**
 * 打开弹窗
 */
function open(data?: Partial<UserUpdateParam>) {
  visible.value = true

  if (data) {
    Object.assign(formData, data)
  }
}

/**
 * 提交表单
 */
async function handleSubmit() {
  if (!formRef.value) {
    return
  }

  await formRef.value.validate()

  submitLoading.value = true

  try {
    if (formData.id) {
      await updateUser(formData as UserUpdateParam)
      ElMessage.success('更新成功')
    } else {
      await createUser(formData as UserCreateParam)
      ElMessage.success('创建成功')
    }

    emit('success')
    handleClose()
  } finally {
    submitLoading.value = false
  }
}

/**
 * 关闭弹窗
 */
function handleClose() {
  visible.value = false
  formRef.value?.resetFields()
}

defineExpose({
  open
})
</script>
```

表单提交请求建议遵循以下流程：

1. 表单校验通过后再请求接口。
2. 提交按钮使用独立的 `submitLoading`。
3. 成功后显示成功提示。
4. 成功后通知父组件刷新列表。
5. 请求完成后恢复按钮状态。
6. 不在表单组件中直接操作父组件表格数据。

### 请求状态管理

请求状态管理用于维护 Loading、列表数据、分页数据、错误状态、空数据状态等。简单页面可以在组件内直接管理，多个页面复用的请求逻辑可以抽离为组合式函数。

文件位置：`src/composables/useTableRequest.ts`

下面代码封装通用表格请求逻辑，适合后台管理系统中的分页列表页面复用。

```typescript
import { reactive, ref } from 'vue'
import type { PageResult } from '@/types/api'

export interface TableQuery {
  current: number
  size: number
  [key: string]: unknown
}

export interface UseTableRequestOptions<T, Q extends TableQuery> {
  queryParams: Q
  requestApi: (params: Q) => Promise<PageResult<T>>
}

/**
 * 使用表格分页请求
 */
export function useTableRequest<T, Q extends TableQuery>(
  options: UseTableRequestOptions<T, Q>
) {
  const loading = ref(false)
  const total = ref(0)
  const tableData = ref<T[]>([])
  const queryParams = reactive(options.queryParams) as Q

  /**
   * 加载表格数据
   */
  async function loadData() {
    loading.value = true

    try {
      const result = await options.requestApi(queryParams)
      tableData.value = result.records
      total.value = result.total
    } finally {
      loading.value = false
    }
  }

  /**
   * 查询数据
   */
  function search() {
    queryParams.current = 1
    loadData()
  }

  /**
   * 重置分页并重新加载
   */
  function reload() {
    queryParams.current = 1
    loadData()
  }

  return {
    loading,
    total,
    tableData,
    queryParams,
    loadData,
    search,
    reload
  }
}
```

页面中使用组合式函数：

文件位置：`src/views/user/index.vue`

下面代码展示如何复用 `useTableRequest` 管理用户列表请求状态。

```vue
<template>
  <el-card>
    <el-button type="primary" @click="search">查询</el-button>

    <el-table v-loading="loading" :data="tableData" border>
      <el-table-column prop="username" label="用户名" />
      <el-table-column prop="nickname" label="昵称" />
    </el-table>

    <el-pagination
      v-model:current-page="queryParams.current"
      v-model:page-size="queryParams.size"
      :total="total"
      layout="total, sizes, prev, pager, next"
      @current-change="loadData"
      @size-change="loadData"
    />
  </el-card>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { pageUser } from '@/api/user'
import { useTableRequest } from '@/composables/useTableRequest'
import type { UserItem, UserPageQuery } from '@/types/user'

const {
  loading,
  total,
  tableData,
  queryParams,
  loadData,
  search
} = useTableRequest<UserItem, UserPageQuery>({
  queryParams: {
    current: 1,
    size: 10,
    username: undefined,
    status: undefined
  },
  requestApi: pageUser
})

onMounted(() => {
  loadData()
})
</script>
```

对于多个页面都存在分页查询、刷新、重置、Loading 控制的情况，抽离组合式函数可以减少重复代码。对于一次性页面，直接在页面内维护状态即可，不需要过度封装。

## 错误提示与交互

错误提示与交互用于提升接口异常时的用户体验。Axios 响应拦截器可以处理全局错误，但页面仍然需要根据业务场景处理局部错误，例如表单字段错误、Loading 关闭、按钮禁用、重试操作等。

错误处理需要区分全局异常和局部异常。全局异常由请求模块统一处理，局部异常由页面组件根据业务场景处理。

### 全局错误提示

全局错误提示适合处理大部分接口异常，例如网络异常、请求超时、服务端异常、权限不足、登录失效等。这类异常可以放在 Axios 响应拦截器中统一处理。

文件位置：`src/utils/error-message.ts`

下面代码根据 HTTP 状态码和 Axios 错误编码生成统一错误提示。

```typescript
import type { AxiosError } from 'axios'
import type { ApiResult } from '@/types/api'

/**
 * 获取请求错误提示
 */
export function getRequestErrorMessage(error: AxiosError<ApiResult>): string {
  if (error.code === 'ECONNABORTED') {
    return '请求超时，请稍后重试'
  }

  if (!error.response) {
    return '网络连接异常，请检查网络'
  }

  const responseMessage = error.response.data?.message

  if (responseMessage) {
    return responseMessage
  }

  switch (error.response.status) {
    case 400:
      return '请求参数错误'
    case 401:
      return '登录状态已失效，请重新登录'
    case 403:
      return '没有操作权限'
    case 404:
      return '请求接口不存在'
    case 500:
      return '服务器内部异常'
    default:
      return '请求失败，请稍后重试'
  }
}
```

在响应拦截器中使用统一错误提示：

文件位置：`src/utils/request.ts`

下面代码在 Axios 响应异常时统一显示错误消息，并将异常继续抛给页面处理局部状态。

```typescript
import axios, { type AxiosError, type AxiosInstance, type AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'
import { getRequestErrorMessage } from '@/utils/error-message'
import type { ApiResult } from '@/types/api'

const request: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
})

request.interceptors.response.use(
  (response: AxiosResponse<ApiResult>) => {
    const result = response.data

    if (result.code === 200) {
      return result.data
    }

    ElMessage.error(result.message || '业务处理失败')
    return Promise.reject(result)
  },
  (error: AxiosError<ApiResult>) => {
    ElMessage.error(getRequestErrorMessage(error))
    return Promise.reject(error)
  }
)

export default request
```

全局错误提示适合兜底，但不应该替代所有局部交互。例如表单字段错误需要回显到对应字段，列表加载失败可能需要展示空状态或重试按钮。

### 表单错误回显

表单错误回显通常用于后端参数校验失败的场景。例如用户名重复、手机号格式错误、字段不能为空等。如果后端返回字段级错误，前端可以将错误信息回显到对应表单项。

推荐后端返回类似结构：

```json
{
  "code": 400,
  "message": "参数校验失败",
  "data": {
    "username": "用户名已存在",
    "phone": "手机号格式不正确"
  }
}
```

前端可以定义字段错误类型：

文件位置：`src/types/api.ts`

下面代码定义表单字段错误结构，用于承接后端字段级校验结果。

```typescript
/**
 * 表单字段错误
 */
export type FormFieldErrors = Record<string, string>
```

在表单页面中捕获接口异常，并将字段错误显示到表单项中。

文件位置：`src/views/user/components/UserFormDialog.vue`

下面代码展示如何将后端返回的字段错误回显到 Element Plus 表单中。

```vue
<template>
  <el-dialog v-model="visible" title="新增用户" width="520px">
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="90px">
      <el-form-item
        label="用户名"
        prop="username"
        :error="fieldErrors.username"
      >
        <el-input v-model="formData.username" />
      </el-form-item>

      <el-form-item
        label="手机号"
        prop="phone"
        :error="fieldErrors.phone"
      >
        <el-input v-model="formData.phone" />
      </el-form-item>

      <el-form-item label="密码" prop="password">
        <el-input v-model="formData.password" type="password" show-password />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :loading="submitLoading" @click="handleSubmit">
        保存
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { AxiosError } from 'axios'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { createUser } from '@/api/user'
import type { ApiResult, FormFieldErrors } from '@/types/api'
import type { UserCreateParam } from '@/types/user'

const visible = ref(false)
const submitLoading = ref(false)
const formRef = ref<FormInstance>()

const fieldErrors = reactive<FormFieldErrors>({})

const formData = reactive<UserCreateParam>({
  username: '',
  nickname: '',
  phone: '',
  password: '',
  roleIds: []
})

const rules: FormRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

/**
 * 清空字段错误
 */
function clearFieldErrors() {
  Object.keys(fieldErrors).forEach((key) => {
    delete fieldErrors[key]
  })
}

/**
 * 提交表单
 */
async function handleSubmit() {
  if (!formRef.value) {
    return
  }

  clearFieldErrors()
  await formRef.value.validate()

  submitLoading.value = true

  try {
    await createUser(formData)
    ElMessage.success('创建成功')
    visible.value = false
  } catch (error) {
    const axiosError = error as AxiosError<ApiResult<FormFieldErrors>>
    const errors = axiosError.response?.data?.data

    if (errors) {
      Object.assign(fieldErrors, errors)
    }
  } finally {
    submitLoading.value = false
  }
}
</script>
```

表单错误回显需要前后端约定字段名一致。例如后端返回 `username`，前端表单项的 `prop` 也应为 `username`。如果字段名不一致，需要在前端做字段映射。

### Loading 状态控制

Loading 状态控制用于避免用户在请求过程中重复点击、误操作或误认为页面无响应。常见 Loading 包括页面 Loading、表格 Loading、按钮 Loading、局部区域 Loading。

简单页面可以在组件中手动维护 Loading：

```typescript
const loading = ref(false)

async function loadData() {
  loading.value = true

  try {
    const result = await pageUser(queryParams)
    tableData.value = result.records
  } finally {
    loading.value = false
  }
}
```

表单提交按钮建议使用独立 Loading，避免用户重复提交。

```typescript
const submitLoading = ref(false)

async function handleSubmit() {
  submitLoading.value = true

  try {
    await createUser(formData)
    ElMessage.success('保存成功')
  } finally {
    submitLoading.value = false
  }
}
```

如果多个请求需要统一控制全屏 Loading，可以封装请求计数器，避免多个并发请求时某个请求先结束就提前关闭 Loading。

文件位置：`src/utils/loading.ts`

下面代码使用请求计数器管理全屏 Loading，适合需要全局 Loading 的项目。

```typescript
import { ElLoading, type LoadingInstance } from 'element-plus'

let loadingInstance: LoadingInstance | null = null
let requestCount = 0

/**
 * 显示全屏 Loading
 */
export function showGlobalLoading(): void {
  requestCount += 1

  if (!loadingInstance) {
    loadingInstance = ElLoading.service({
      lock: true,
      text: '加载中...',
      background: 'rgba(0, 0, 0, 0.35)'
    })
  }
}

/**
 * 隐藏全屏 Loading
 */
export function hideGlobalLoading(): void {
  requestCount = Math.max(requestCount - 1, 0)

  if (requestCount === 0 && loadingInstance) {
    loadingInstance.close()
    loadingInstance = null
  }
}

/**
 * 重置全屏 Loading
 */
export function resetGlobalLoading(): void {
  requestCount = 0

  if (loadingInstance) {
    loadingInstance.close()
    loadingInstance = null
  }
}
```

在请求拦截器和响应拦截器中接入全局 Loading：

文件位置：`src/utils/request.ts`

下面代码通过自定义请求配置控制是否显示全局 Loading。

```typescript
import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig
} from 'axios'
import { hideGlobalLoading, showGlobalLoading } from '@/utils/loading'
import type { ApiResult } from '@/types/api'

interface RequestConfig extends InternalAxiosRequestConfig {
  showLoading?: boolean
}

const request: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
})

request.interceptors.request.use(
  (config: RequestConfig) => {
    if (config.showLoading) {
      showGlobalLoading()
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

request.interceptors.response.use(
  (response: AxiosResponse<ApiResult>) => {
    const config = response.config as RequestConfig

    if (config.showLoading) {
      hideGlobalLoading()
    }

    const result = response.data

    if (result.code === 200) {
      return result.data
    }

    return Promise.reject(result)
  },
  (error: AxiosError<ApiResult>) => {
    const config = error.config as RequestConfig | undefined

    if (config?.showLoading) {
      hideGlobalLoading()
    }

    return Promise.reject(error)
  }
)

export default request
```

调用接口时按需开启全局 Loading：

```typescript
import request from '@/utils/request'
import type { UserDetail } from '@/types/user'

/**
 * 查询用户详情并显示全局 Loading
 */
export function getUserDetailWithLoading(id: number): Promise<UserDetail> {
  return request.get(`/user/${id}`, {
    showLoading: true
  })
}
```

如果 TypeScript 提示 `showLoading` 不是 Axios 原生配置项，需要扩展 Axios 类型。

文件位置：`src/types/axios.d.ts`

下面代码扩展 Axios 请求配置类型，使自定义的 `showLoading` 配置可以被 TypeScript 正确识别。

```typescript
import 'axios'

declare module 'axios' {
  export interface AxiosRequestConfig {
    /** 是否显示全局 Loading */
    showLoading?: boolean
  }

  export interface InternalAxiosRequestConfig {
    /** 是否显示全局 Loading */
    showLoading?: boolean
  }
}
```

Loading 使用建议如下：

| 场景         | 建议                               |
| ------------ | ---------------------------------- |
| 表格查询     | 使用表格区域 Loading               |
| 表单提交     | 使用按钮 Loading                   |
| 页面初始化   | 使用页面局部 Loading               |
| 重要全局操作 | 可使用全屏 Loading                 |
| 多个并发请求 | 使用请求计数器控制 Loading         |
| 普通后台接口 | 不建议所有请求默认开启全屏 Loading |

Loading 状态控制的核心原则是：请求开始时开启，请求结束时关闭，并且必须通过 `finally` 或响应拦截器兜底关闭，避免接口异常导致页面一直处于加载状态。



## 开发规范

开发规范用于统一 Axios 请求模块、业务 API 文件、类型声明和调试日志的写法。请求模块一旦在项目中形成公共基础设施，后续业务页面会长期依赖它，因此需要提前约定命名、封装方式、类型边界和调试方式，避免不同开发人员写出风格不一致的接口代码。

### 接口文件命名规范

接口文件建议按照业务模块拆分，并使用小写中划线或小写单词命名。对于后台管理系统，接口文件通常放在 `src/api` 目录下，类型文件放在 `src/types` 目录下，两者按业务模块保持一一对应。

推荐目录结构如下：

```text
src
├── api
│   ├── auth.ts              # 登录、退出、刷新 Token
│   ├── user.ts              # 用户管理接口
│   ├── role.ts              # 角色管理接口
│   ├── menu.ts              # 菜单管理接口
│   ├── dict.ts              # 字典管理接口
│   └── system-config.ts     # 系统配置接口
├── types
│   ├── api.ts               # 通用接口类型
│   ├── auth.ts              # 登录认证类型
│   ├── user.ts              # 用户模块类型
│   ├── role.ts              # 角色模块类型
│   ├── menu.ts              # 菜单模块类型
│   └── system-config.ts     # 系统配置类型
└── utils
    ├── request.ts           # Axios 请求实例
    ├── auth.ts              # Token 操作
    └── error-message.ts     # 错误消息处理
```

接口文件命名建议如下：

| 类型           | 命名方式   | 示例                                   |
| -------------- | ---------- | -------------------------------------- |
| 单业务模块     | 小写单词   | `user.ts`、`role.ts`                   |
| 多单词业务模块 | 小写中划线 | `system-config.ts`、`operation-log.ts` |
| 通用请求实例   | 固定命名   | `request.ts`                           |
| 通用接口类型   | 固定命名   | `api.ts`                               |
| 认证工具       | 固定命名   | `auth.ts`                              |

不建议使用以下命名：

```text
api.ts                 # 所有接口都堆在一个文件中
userApi.ts             # api 目录下重复出现 Api 后缀，意义不大
requestUser.ts         # 命名不符合业务模块习惯
allRequest.ts          # 无法体现业务边界
systemConfigApi.ts     # 命名过长且风格不统一
```

推荐使用以下命名：

```text
src/api/user.ts
src/api/role.ts
src/api/system-config.ts

src/types/user.ts
src/types/role.ts
src/types/system-config.ts
```

接口文件的核心要求是：一个文件只维护一个业务域的接口，不跨模块混写，不在 API 文件中处理页面状态，不在页面组件中直接拼接大量请求细节。

### 请求方法封装规范

请求方法封装应保持“入参明确、返回值明确、方法名明确”。每个接口方法都应该声明参数类型和返回值类型，避免直接使用 `any`。

推荐写法如下：

```typescript
import request from '@/utils/request'
import type { EmptyResult, PageResult } from '@/types/api'
import type {
  UserCreateParam,
  UserDetail,
  UserItem,
  UserPageQuery,
  UserUpdateParam
} from '@/types/user'

/**
 * 分页查询用户
 */
export function pageUser(params: UserPageQuery): Promise<PageResult<UserItem>> {
  return request.get('/user/page', { params })
}

/**
 * 查询用户详情
 */
export function getUserDetail(id: number): Promise<UserDetail> {
  return request.get(`/user/${id}`)
}

/**
 * 创建用户
 */
export function createUser(data: UserCreateParam): Promise<EmptyResult> {
  return request.post('/user', data)
}

/**
 * 更新用户
 */
export function updateUser(data: UserUpdateParam): Promise<EmptyResult> {
  return request.put('/user', data)
}

/**
 * 删除用户
 */
export function deleteUser(id: number): Promise<EmptyResult> {
  return request.delete(`/user/${id}`)
}
```

不推荐写法如下：

```typescript
// 不推荐：缺少参数类型和返回值类型
export function getList(params: any) {
  return request.get('/user/page', { params })
}

// 不推荐：方法名无法体现业务含义
export function submit(data: any) {
  return request.post('/user', data)
}

// 不推荐：页面直接使用原生 request 拼接复杂逻辑
request.post('/user', {
  username: form.username,
  password: form.password
})
```

请求方法封装建议遵循以下规则：

| 规则                   | 说明                                              |
| ---------------------- | ------------------------------------------------- |
| 方法名使用动词开头     | 例如 `pageUser`、`createUser`、`updateUser`       |
| 参数必须有类型         | 查询参数、创建参数、更新参数都应声明接口类型      |
| 返回值必须有类型       | 返回 `Promise<T>`，不要依赖 TypeScript 自动推断   |
| 不在 API 文件中处理 UI | 不调用弹窗、Loading、路由跳转等页面逻辑           |
| 不在 API 文件中吞异常  | 异常应继续抛出，由调用方决定局部处理方式          |
| 不在页面中直接写 URL   | 页面调用业务 API 方法，不直接调用 `request.get()` |

如果某个接口需要特殊配置，例如文件下载、上传进度、单独超时时间，可以在 API 方法中通过 Axios 配置显式声明。

下面代码用于封装文件导出接口，单独设置响应类型和超时时间。

```typescript
import request from '@/utils/request'

/**
 * 导出用户数据
 */
export function exportUser(params: UserPageQuery): Promise<Blob> {
  return request.get('/user/export', {
    params,
    responseType: 'blob',
    timeout: 60000
  })
}
```

下面代码用于封装文件上传接口，使用 `FormData` 提交文件。

```typescript
import request from '@/utils/request'
import type { FileUploadResult } from '@/types/file'

/**
 * 上传文件
 */
export function uploadFile(file: File): Promise<FileUploadResult> {
  const formData = new FormData()
  formData.append('file', file)

  return request.post('/file/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    timeout: 120000
  })
}
```

请求方法应该足够简单，复杂的业务流程应放在页面、组合式函数或业务 service 中，而不是堆在 API 文件里。

### 类型声明规范

类型声明用于保证接口调用的入参、返回值和页面数据具备明确结构。推荐将通用类型放在 `src/types/api.ts`，业务类型放在对应模块文件中，例如 `src/types/user.ts`、`src/types/role.ts`。

通用类型建议如下：

```typescript
/**
 * 后端统一响应结构
 */
export interface ApiResult<T = unknown> {
  /** 业务状态码 */
  code: number

  /** 响应消息 */
  message: string

  /** 响应数据 */
  data: T

  /** 请求链路 ID */
  traceId?: string

  /** 服务端时间戳 */
  timestamp?: number
}

/**
 * 分页查询参数
 */
export interface PageQuery {
  /** 当前页码 */
  current: number

  /** 每页条数 */
  size: number
}

/**
 * 分页响应结构
 */
export interface PageResult<T = unknown> {
  /** 当前页数据 */
  records: T[]

  /** 总条数 */
  total: number

  /** 当前页码 */
  current: number

  /** 每页条数 */
  size: number
}

/**
 * 空响应结果
 */
export type EmptyResult = null | undefined | Record<string, never>

/**
 * 表单字段错误
 */
export type FormFieldErrors = Record<string, string>
```

业务模块类型建议按照请求参数和响应数据分组声明。

```typescript
import type { PageQuery } from '@/types/api'

/**
 * 用户分页查询参数
 */
export interface UserPageQuery extends PageQuery {
  /** 用户名 */
  username?: string

  /** 手机号 */
  phone?: string

  /** 用户状态 */
  status?: number
}

/**
 * 用户创建参数
 */
export interface UserCreateParam {
  /** 用户名 */
  username: string

  /** 昵称 */
  nickname: string

  /** 手机号 */
  phone?: string

  /** 密码 */
  password: string

  /** 角色 ID 集合 */
  roleIds: number[]
}

/**
 * 用户更新参数
 */
export interface UserUpdateParam {
  /** 用户 ID */
  id: number

  /** 昵称 */
  nickname: string

  /** 手机号 */
  phone?: string

  /** 用户状态 */
  status: number

  /** 角色 ID 集合 */
  roleIds: number[]
}

/**
 * 用户列表项
 */
export interface UserItem {
  /** 用户 ID */
  id: number

  /** 用户名 */
  username: string

  /** 昵称 */
  nickname: string

  /** 手机号 */
  phone: string

  /** 用户状态 */
  status: number

  /** 创建时间 */
  createTime: string
}

/**
 * 用户详情
 */
export interface UserDetail extends UserItem {
  /** 邮箱 */
  email?: string

  /** 角色 ID 集合 */
  roleIds: number[]

  /** 更新时间 */
  updateTime: string
}
```

类型命名建议如下：

| 场景         | 命名             | 示例              |
| ------------ | ---------------- | ----------------- |
| 分页查询参数 | `XxxPageQuery`   | `UserPageQuery`   |
| 普通查询参数 | `XxxQuery`       | `RoleQuery`       |
| 创建参数     | `XxxCreateParam` | `UserCreateParam` |
| 更新参数     | `XxxUpdateParam` | `UserUpdateParam` |
| 列表项       | `XxxItem`        | `UserItem`        |
| 详情         | `XxxDetail`      | `UserDetail`      |
| 下拉选项     | `XxxOption`      | `RoleOption`      |
| 返回结果     | `XxxResult`      | `LoginResult`     |

类型声明不建议使用 `any`。如果接口返回结构暂时不明确，可以先使用 `unknown`，后续联调稳定后再补充具体类型。

```typescript
// 不推荐
export function getUserInfo(): Promise<any> {
  return request.get('/user/info')
}

// 过渡期可接受
export function getUserInfo(): Promise<unknown> {
  return request.get('/user/info')
}

// 推荐
export function getUserInfo(): Promise<UserDetail> {
  return request.get('/user/info')
}
```

### 日志与调试规范

日志与调试规范用于帮助开发人员定位请求问题。Axios 请求日志建议只在开发环境输出，生产环境默认关闭详细日志，避免泄露接口参数、Token、用户隐私数据等敏感信息。

可以封装统一日志工具，在开发环境输出请求和响应信息。

下面代码封装前端调试日志，只在开发环境打印信息。

文件位置：`src/utils/logger.ts`

```typescript
/**
 * 请求日志信息
 */
interface RequestLogInfo {
  /** 请求方法 */
  method?: string

  /** 请求地址 */
  url?: string

  /** 查询参数 */
  params?: unknown

  /** 请求体 */
  data?: unknown

  /** 响应数据 */
  response?: unknown

  /** 请求耗时 */
  duration?: string

  /** 错误消息 */
  message?: string
}

/**
 * 打印请求发送日志
 */
export function logRequest(info: RequestLogInfo): void {
  if (!import.meta.env.DEV) {
    return
  }

  console.info('[请求发送]', info)
}

/**
 * 打印请求成功日志
 */
export function logResponse(info: RequestLogInfo): void {
  if (!import.meta.env.DEV) {
    return
  }

  console.info('[请求成功]', info)
}

/**
 * 打印请求失败日志
 */
export function logRequestError(info: RequestLogInfo): void {
  if (!import.meta.env.DEV) {
    return
  }

  console.error('[请求失败]', info)
}
```

下面代码在 Axios 拦截器中接入请求日志和请求耗时统计。

文件位置：`src/utils/request.ts`

```typescript
import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig
} from 'axios'
import { logRequest, logRequestError, logResponse } from '@/utils/logger'
import type { ApiResult } from '@/types/api'

interface RequestConfig extends InternalAxiosRequestConfig {
  metadata?: {
    startTime: number
  }
}

const request: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
})

request.interceptors.request.use(
  (config: RequestConfig) => {
    config.metadata = {
      startTime: Date.now()
    }

    logRequest({
      method: config.method?.toUpperCase(),
      url: config.url,
      params: config.params,
      data: config.data
    })

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

request.interceptors.response.use(
  (response: AxiosResponse<ApiResult>) => {
    const config = response.config as RequestConfig
    const duration = config.metadata?.startTime
      ? `${Date.now() - config.metadata.startTime}ms`
      : undefined

    logResponse({
      method: config.method?.toUpperCase(),
      url: config.url,
      duration,
      response: response.data
    })

    return response.data.data
  },
  (error: AxiosError<ApiResult>) => {
    const config = error.config as RequestConfig | undefined
    const duration = config?.metadata?.startTime
      ? `${Date.now() - config.metadata.startTime}ms`
      : undefined

    logRequestError({
      method: config?.method?.toUpperCase(),
      url: config?.url,
      duration,
      message: error.message
    })

    return Promise.reject(error)
  }
)

export default request
```

日志输出建议遵循以下规则：

| 规则                       | 说明                                    |
| -------------------------- | --------------------------------------- |
| 开发环境输出               | 使用 `import.meta.env.DEV` 控制         |
| 生产环境关闭               | 默认不输出详细请求日志                  |
| 不输出敏感信息             | Token、密码、身份证号、手机号等需要脱敏 |
| 记录请求耗时               | 便于定位慢接口                          |
| 失败日志保留地址和方法     | 便于快速定位异常接口                    |
| 文件上传不打印完整文件对象 | 避免控制台过大和敏感信息泄露            |

如果项目接入前端监控平台，可以在请求失败时上报接口地址、状态码、耗时、错误消息和 traceId，但仍然需要避免上传敏感字段。

## 测试与验证

测试与验证用于确认 Axios 封装是否符合预期。重点验证内容包括正常请求是否能返回业务数据、异常请求是否能统一提示、Token 失效是否能跳转登录页、TypeScript 类型是否能正确约束接口调用。

Axios 请求模块属于基础能力，建议在项目早期完成验证，避免后续业务页面大量接入后再调整返回结构。

### 正常请求验证

正常请求验证用于确认接口可以成功发送、Token 可以正常注入、响应数据可以正确解包、页面可以拿到预期业务数据。

可以先准备一个简单接口，例如当前用户信息接口：

```typescript
import request from '@/utils/request'
import type { UserDetail } from '@/types/user'

/**
 * 获取当前用户信息
 */
export function getUserInfo(): Promise<UserDetail> {
  return request.get('/user/info')
}
```

在页面或临时调试组件中调用：

```vue
<template>
  <el-card>
    <el-button type="primary" :loading="loading" @click="loadUserInfo">
      获取用户信息
    </el-button>

    <pre v-if="userInfo">{{ userInfo }}</pre>
  </el-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { getUserInfo } from '@/api/user'
import type { UserDetail } from '@/types/user'

const loading = ref(false)
const userInfo = ref<UserDetail>()

/**
 * 加载当前用户信息
 */
async function loadUserInfo() {
  loading.value = true

  try {
    userInfo.value = await getUserInfo()
    ElMessage.success('请求成功')
  } finally {
    loading.value = false
  }
}
</script>
```

验证点如下：

| 验证项   | 预期结果                                     |
| -------- | -------------------------------------------- |
| 请求地址 | 浏览器 Network 中请求地址正确                |
| 请求方法 | GET、POST 等方法符合后端接口要求             |
| Token    | Request Headers 中存在认证字段               |
| 响应解包 | 页面拿到的是业务 `data`，不是完整 Axios 响应 |
| Loading  | 请求完成后 Loading 正常关闭                  |
| 日志     | 开发环境控制台能看到请求日志                 |

如果页面中拿到的是完整的 `{ code, message, data }`，说明响应拦截器没有正确解包；如果拿到的是 Axios 的完整响应对象，说明拦截器返回值或 API 类型声明需要检查。

### 异常请求验证

异常请求验证用于确认网络异常、HTTP 异常、业务异常和超时异常是否能被统一处理。可以通过错误地址、后端模拟异常、浏览器断网、降低超时时间等方式验证。

可以添加一个临时测试接口：

```typescript
import request from '@/utils/request'

/**
 * 请求不存在的接口
 */
export function requestNotFound(): Promise<unknown> {
  return request.get('/not-exist-api')
}

/**
 * 请求超时接口
 */
export function requestTimeout(): Promise<unknown> {
  return request.get('/mock/timeout', {
    timeout: 1000
  })
}
```

在页面中触发异常请求：

```typescript
import { requestNotFound, requestTimeout } from '@/api/test'

/**
 * 验证 404 异常
 */
async function testNotFound() {
  try {
    await requestNotFound()
  } catch (error) {
    console.error('404 异常已捕获', error)
  }
}

/**
 * 验证超时异常
 */
async function testTimeout() {
  try {
    await requestTimeout()
  } catch (error) {
    console.error('超时异常已捕获', error)
  }
}
```

异常验证建议覆盖以下场景：

| 异常类型     | 验证方式                     | 预期结果                   |
| ------------ | ---------------------------- | -------------------------- |
| 业务失败     | 后端返回 `code !== 200`      | 页面提示后端返回的错误消息 |
| 401 未认证   | 后端返回 HTTP 401 或业务 401 | 清理 Token 并跳转登录页    |
| 403 无权限   | 后端返回 403                 | 提示没有操作权限           |
| 404 不存在   | 请求不存在接口               | 提示请求接口不存在         |
| 500 服务异常 | 后端模拟异常                 | 提示服务器内部异常         |
| 请求超时     | 设置较短 `timeout`           | 提示请求超时               |
| 网络断开     | 浏览器 DevTools 模拟 Offline | 提示网络连接异常           |

异常请求验证时需要确认两个结果：第一，用户能看到合理提示；第二，异常仍然通过 `Promise.reject` 抛出，使页面可以在 `finally` 中关闭 Loading。

### Token 失效验证

Token 失效验证用于确认登录过期时系统可以正确清理登录状态，并跳转到登录页。这个流程通常由响应拦截器统一处理。

常见验证方式有三种：

1. 手动删除或篡改本地 Token。
2. 使用已过期 Token 调用接口。
3. 后端临时返回 HTTP 401 或业务状态码 401。

可以在浏览器控制台中手动修改 Token：

```javascript
// 删除 Token
localStorage.removeItem('ACCESS_TOKEN')

// 设置错误 Token
localStorage.setItem('ACCESS_TOKEN', 'invalid-token')
```

然后刷新页面或调用需要登录的接口，预期结果如下：

| 验证项        | 预期结果                                  |
| ------------- | ----------------------------------------- |
| 本地 Token    | 登录失效后被删除                          |
| 用户状态      | Pinia 中用户信息被清理                    |
| 页面跳转      | 自动跳转到 `/login`                       |
| redirect 参数 | 登录地址携带原页面地址                    |
| 错误提示      | 显示“登录状态已失效，请重新登录”          |
| 重复请求      | 多个接口同时 401 时不重复弹窗、不重复跳转 |

如果项目使用 Pinia 管理用户信息，登录失效处理建议同时清理用户状态。

下面代码用于在登录失效时清理 Token 和用户状态，并跳转登录页。

```typescript
import { ElMessage } from 'element-plus'
import router from '@/router'
import { removeToken } from '@/utils/auth'
import { useUserStore } from '@/stores/user'

let isRedirecting = false

/**
 * 处理登录失效
 */
export function handleUnauthorized(message = '登录状态已失效，请重新登录'): void {
  removeToken()

  const userStore = useUserStore()
  userStore.clearUserInfo()

  if (isRedirecting) {
    return
  }

  isRedirecting = true
  ElMessage.error(message)

  const currentPath = router.currentRoute.value.fullPath

  router
    .replace({
      path: '/login',
      query: {
        redirect: currentPath
      }
    })
    .finally(() => {
      isRedirecting = false
    })
}
```

Token 失效验证时需要特别关注重复跳转问题。后台管理系统页面初始化时经常会同时请求用户信息、菜单、权限、字典等多个接口，如果这些接口同时返回 401，就可能触发多次提示和多次路由跳转，因此需要使用 `isRedirecting` 或类似状态进行控制。

### 类型检查验证

类型检查验证用于确认 API 方法、请求参数、响应数据和页面调用之间的类型约束是否生效。Vue3 + TypeScript 项目中，建议通过 `vue-tsc` 执行完整类型检查。

如果项目还没有安装 `vue-tsc`，可以安装开发依赖：

```bash
pnpm add -D vue-tsc

# 或
npm install -D vue-tsc
```

在 `package.json` 中添加类型检查脚本：

```json
{
  "scripts": {
    "type-check": "vue-tsc --noEmit",
    "build": "vue-tsc --noEmit && vite build"
  }
}
```

执行类型检查：

```bash
pnpm type-check

# 或
npm run type-check
```

类型检查建议覆盖以下内容：

| 验证项         | 示例                                     |
| -------------- | ---------------------------------------- |
| 请求参数类型   | `pageUser()` 必须传入 `UserPageQuery`    |
| 返回值类型     | `pageUser()` 返回 `PageResult<UserItem>` |
| 字段访问       | 访问不存在字段时应报错                   |
| 表单参数       | 创建和更新参数不能混用                   |
| 空值处理       | 可选字段需要处理 `undefined`             |
| Axios 扩展配置 | `showLoading` 等自定义配置不应报错       |

示例：错误的请求参数应该被 TypeScript 识别。

```typescript
import { pageUser } from '@/api/user'

// 应报错：缺少 current 和 size
pageUser({
  username: 'admin'
})

// 应报错：status 类型不正确
pageUser({
  current: 1,
  size: 10,
  status: 'enabled'
})
```

示例：错误的返回字段访问也应该被 TypeScript 识别。

```typescript
import { pageUser } from '@/api/user'

async function loadData() {
  const result = await pageUser({
    current: 1,
    size: 10
  })

  // 正确：records 是分页数据字段
  console.log(result.records)

  // 应报错：假设 PageResult 中不存在 list 字段
  console.log(result.list)
}
```

如果项目扩展了 Axios 自定义配置，例如 `showLoading`、`skipErrorMessage`，需要通过声明合并补充类型。

```typescript
import 'axios'

declare module 'axios' {
  export interface AxiosRequestConfig {
    /** 是否显示全局 Loading */
    showLoading?: boolean

    /** 是否跳过全局错误提示 */
    skipErrorMessage?: boolean
  }

  export interface InternalAxiosRequestConfig {
    /** 是否显示全局 Loading */
    showLoading?: boolean

    /** 是否跳过全局错误提示 */
    skipErrorMessage?: boolean
  }
}
```

类型检查通过后，说明 Axios 封装、API 方法、业务类型和页面调用之间的基础类型链路是完整的。后续新增接口时，应保持同样的类型约束，不建议为了快速联调长期使用 `any`。
