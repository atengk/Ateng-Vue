# Axios

## 创建应用

按照首页工程化创建应用：apps/axios



## 基础配置

安装 axios 包

```
pnpm install axios@1.13.2 --filter @apps/axios
```

目录结构

```
src/
├─ api/                     # 接口层（只关心“业务接口”）
│  ├─ user/
│  │  ├─ api.ts             # 所有 user 接口
│  │  └─ types.ts           # UserInfo / DTO / Query
│  │  └─ constants.ts       # UserStatus 等枚举
│  │  └─ index.ts           # 统一出口
│  └─ index.ts              # 统一出口
│
├─ services/                # 基础服务层（infra）
│  ├─ http/
│  │  ├─ axios.ts           # axios 实例 + 拦截器
│  │  ├─ request.ts         # get / post / upload / download
│  │  ├─ types.ts           # RequestConfig / ApiResponse / PageResult
│  │  └─ index.ts           # 统一出口
│  └─ auth/                 # 可选：token / 登录态
│
├─ components/              # 通用组件
│
├─ views/                   # 页面级组件
│
├─ types/                   # 全局业务类型（非接口专属）
│  └─ common.ts
│
├─ utils/                   # 纯工具（无副作用）
│  ├─ date.ts
│  ├─ format.ts
│  └─ storage.ts
│
└─ main.ts
```



## Axios配置

### types.ts

```typescript
import type {AxiosRequestConfig} from "axios";

/**
 * 通用请求选项
 *
 * - params：URL 查询参数（会拼接到 ? 后面）
 * - data：请求体（POST / PUT / PATCH 等使用）
 * - config：Axios 原生配置（如 headers、timeout 等）
 */
export interface RequestOptions {
    params?: Record<string, any>
    data?: any
    config?: RequestConfig
}

/**
 * 扩展 AxiosRequestConfig
 * 用于支持内部自定义字段
 */
export interface RequestConfig extends AxiosRequestConfig {
    /**
     * 是否跳过 token 注入
     * @default false
     */
    skipAuth?: boolean
    /**
     * 是否返回原始响应
     * - true：不经过业务 code 处理
     * - false / undefined：正常业务处理
     * @default false
     */
    raw?: boolean,
    /**
     * 不走统一错误提示
     */
    skipErrorHandler?: boolean
}

export interface ApiResponse<T = any> {
    code: string
    msg: string
    data: T
}

export interface PageResult<T> {
    records: T[]
    total: number
}

export interface PageQuery {
    page: number
    size: number
}
```

### axios.ts

```typescript
import axios from 'axios'
import type {ApiResponse, RequestConfig} from './types'

const requestInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE,
    timeout: 10000
})

// 请求拦截器
requestInstance.interceptors.request.use((config) => {
    const requestConfig = config as RequestConfig

    // 如果显式声明 skipAuth，则直接跳过
    if (requestConfig.skipAuth) {
        return config
    }

    const token = localStorage.getItem('token')
    if (token) {
        config.headers = config.headers || {}
        ;(config.headers as any).Authorization = `Bearer ${token}`
    }

    return config
})

// 响应拦截器
requestInstance.interceptors.response.use(
    (response) => {
        const config = response.config as RequestConfig

        /**
         * 原始响应直通（下载 / 特殊接口）
         */
        if (config.raw === true) {
            return response
        }

        /**
         * 正常业务接口统一处理
         */
        const res = response.data as ApiResponse

        if (res.code !== '0') {
            if (!config.skipErrorHandler) {
                console.error(res.msg)
            }
            const error = new Error(res.msg)
            ;(error as any).response = res
            return Promise.reject(error)
        }

        return res.data
    },
    (error) => {
        /**
         * HTTP 状态码错误处理
         */
        const status = error?.response?.status

        if (status === 401) {
            console.error('未登录或登录过期')
        }

        if (status === 403) {
            console.error('无权限访问')
        }

        if (status >= 500) {
            console.error('服务器异常')
        }

        console.error('请求错误:', error)
        return Promise.reject(error)
    }
)

/**
 * 通用 request 方法
 */
export default function request<T = any>(
    config: RequestConfig
): Promise<T> {
    // 拦截器已经返回 T，这里直接返回
    return requestInstance.request<any, T>(config)
}
```

### request.ts

````typescript
import request from './axios'
import type {RequestOptions} from "./types";
import type {AxiosResponse} from "axios";


/**
 * GET 请求
 *
 * @param url 请求地址
 * @param options 请求选项
 * @param options.params 查询参数
 * @param options.config Axios 配置
 */
export const get = <T = any>(
    url: string,
    options?: Pick<RequestOptions, 'params' | 'config'>
) => {
    return request<T>({
        url,
        method: 'GET',
        params: options?.params,
        ...options?.config
    })
}

/**
 * POST 请求
 *
 * @param url 请求地址
 * @param options 请求选项
 * @param options.params 查询参数
 * @param options.data 请求体
 * @param options.config Axios 配置
 */
export const post = <T = any>(
    url: string,
    options?: RequestOptions
) => {
    return request<T>({
        url,
        method: 'POST',
        params: options?.params,
        data: options?.data,
        ...options?.config
    })
}

/**
 * PUT 请求
 *
 * @param url 请求地址
 * @param options 请求选项
 * @param options.params 查询参数
 * @param options.data 请求体（通常为完整更新）
 * @param options.config Axios 配置
 */
export const put = <T = any>(
    url: string,
    options?: RequestOptions
) => {
    return request<T>({
        url,
        method: 'PUT',
        params: options?.params,
        data: options?.data,
        ...options?.config
    })
}

/**
 * DELETE 请求
 *
 * @param url 请求地址
 * @param options 请求选项
 * @param options.params 查询参数
 * @param options.data 请求体（部分 DELETE 接口可能需要）
 * @param options.config Axios 配置
 */
export const del = <T = any>(
    url: string,
    options?: RequestOptions
) => {
    return request<T>({
        url,
        method: 'DELETE',
        params: options?.params,
        data: options?.data,
        ...options?.config
    })
}

/**
 * PATCH 请求
 *
 * @param url 请求地址
 * @param options 请求选项
 * @param options.params 查询参数
 * @param options.data 请求体（通常为部分更新）
 * @param options.config Axios 配置
 */
export const patch = <T = any>(
    url: string,
    options?: RequestOptions
) => {
    return request<T>({
        url,
        method: 'PATCH',
        params: options?.params,
        data: options?.data,
        ...options?.config
    })
}

/**
 * POST 表单请求（application/x-www-form-urlencoded）
 *
 * @param url 请求地址
 * @param options 请求选项
 * @param options.data 表单数据
 * @param options.params 查询参数
 * @param options.config Axios 配置
 */
export const postForm = <T = any>(
    url: string,
    options?: RequestOptions
) => {
    return request<T>({
        url,
        method: 'POST',
        params: options?.params,
        data: options?.data,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        ...options?.config
    })
}

/**
 * 文件上传请求（multipart/form-data）
 *
 * @param url 请求地址
 * @param options 请求选项
 * @param options.data FormData 对象
 * @param options.params 查询参数
 * @param options.config Axios 配置
 */
export const upload = <T = any>(
    url: string,
    options: Omit<RequestOptions, 'data'> & { data: FormData }
) => {
    return request<T>({
        url,
        method: 'POST',
        params: options.params,
        data: options.data,
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        ...options.config
    })
}

/**
 * 文件下载请求
 *
 * @param url 请求地址
 * @param options 请求选项
 * @param options.params 查询参数
 * @param options.config Axios 配置
 */
export const download = (
    url: string,
    options?: Pick<RequestOptions, 'params' | 'config'>
) => {
    return request<AxiosResponse<Blob>>({
        url,
        method: 'GET',
        params: options?.params,
        responseType: 'blob',
        raw: true,
        ...options?.config
    })
}

/**
 * 文件下载（自动触发浏览器下载）
 *
 * @param url 请求地址
 * @param options 请求选项
 * @param options.params 查询参数
 * @param options.config Axios 配置
 * @param fallbackName 兜底文件名（后端未返回时使用）
 */
export const downloadFile = async (
    url: string,
    options?: Pick<RequestOptions, 'params' | 'config'>,
    fallbackName = 'download'
) => {
    const response = await request<AxiosResponse<Blob>>({
        url,
        method: 'GET',
        params: options?.params,
        responseType: 'blob',
        raw: true,
        ...options?.config
    })

    const blob = response.data
    const headers = response.headers || {}

    /**
     * 后端异常兜底（返回 JSON）
     */
    if (blob.type?.includes('application/json')) {
        const text = await blob.text()
        const error = JSON.parse(text)
        throw new Error(error.msg || '文件下载失败')
    }

    /**
     * 解析文件名
     */
    const fileName = resolveFileName(headers, fallbackName, url)

    /**
     * 触发浏览器下载
     */
    const blobUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = blobUrl
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(blobUrl)
}

/**
 * 从响应头 / 请求路径中解析文件名
 *
 * 优先级：
 * 1. Content-Disposition header
 * 2. URL 中的文件名
 * 3. fallbackName（兜底）
 */
export function resolveFileName(
    headers: Record<string, any>,
    fallbackName: string,
    url?: string
): string {
    /**
     * Content-Disposition
     */
    const disposition =
        headers['content-disposition'] ||
        headers['Content-Disposition']

    if (disposition) {
        // RFC 5987 / 常规 filename
        const match =
            disposition.match(/filename\*=UTF-8''([^;]+)/i) ||
            disposition.match(/filename="?([^";]+)"?/i)

        if (match) {
            try {
                return decodeURIComponent(match[1])
            } catch {
                return match[1]
            }
        }
    }

    /**
     * 从 URL 推断文件名
     */
    if (url) {
        try {
            const pathname = new URL(url, window.location.origin).pathname
            const name = pathname.split('/').pop()
            if (name && name.includes('.')) {
                return name
            }
        } catch {
            // ignore
        }
    }

    /**
     * 兜底文件名
     */
    return fallbackName
}

/*
  使用示例
 ### ✔ 只传查询参数

```ts
get('/user/page', {
  params: { page: 1, size: 10 }
})
```

------

### ✔ POST 只传 body（最常见）

```ts
post('/user/add', {
  data: form
})
```

------

### ✔ 同时传 params + body

```ts
put('/user/update', {
  params: { id: 1 },
  data: form
})
```

------

### ✔ 自定义 header / timeout

```ts
post('/user/add', {
  data: form,
  config: {
    headers: {
      'X-Token': 'xxx'
    }
  }
})
```

### ✔ POST 表单请求

```ts
postForm('/login', {
  data: {
    username: 'admin',
    password: '123456'
  }
})
```

### ✔ 文件上传

```ts
const formData = new FormData()
formData.append('file', file)
formData.append('bizType', 'avatar')

upload('/file/upload', {
  data: formData
})

```

### ✔ 文件下载

```ts
const blob = await download('/file/export', {
  params: { type: 'user' }
})

const url = window.URL.createObjectURL(blob)
const link = document.createElement('a')
link.href = url
link.download = '用户数据.xlsx'
link.click()
window.URL.revokeObjectURL(url)

```

### ✔ 文件下载（直接下载）

```ts
downloadFile(
  '/file/export',
  {
    params: { type: 'user' }
  },
  '用户数据.xlsx'
)

```

 */
````

### index.ts

```typescript
/**
 * HTTP 模块统一出口
 * 业务层只允许从这里 import
 */

// axios 实例（default）
export { default as request } from './axios'

// 所有请求方法
export * from './request'

// 所有类型
export * from './types'
```

## 业务接口配置

### 用户接口 types.ts

src/api/user/types.ts

```typescript
import type {PageQuery} from "@/services/http";

export interface UserInfo {
    /** 用户ID */
    id: number

    /** 用户姓名 */
    name: string

    /** 用户年龄 */
    age: number

    /** 分数 */
    score: number

    /** 用户生日，ISO 字符串 */
    birthday: string

    /** 用户所在省份 */
    province: string

    /** 用户所在城市 */
    city: string
}

export interface UserPageQuery extends PageQuery {
    name?: string
    age?: number
}
```

### 用户接口  constants.ts 

src/api/user/constants.ts

```typescript
/**
 * 用户状态
 */
export enum UserStatus {
    DISABLED = 0,
    ENABLED = 1
}

/**
 * 性别
 */
export enum Gender {
    UNKNOWN = 0,
    MALE = 1,
    FEMALE = 2
}

/**
 * 账号来源
 */
export enum UserSource {
    LOCAL = 'LOCAL',
    LDAP = 'LDAP',
    OAUTH = 'OAUTH'
}

/**
 * 用户状态文案映射
 */
export const USER_STATUS_LABEL: Record<number, string> = {
    0: '禁用',
    1: '启用'
}

/**
 * 性别文案映射
 */
export const GENDER_LABEL: Record<number, string> = {
    0: '未知',
    1: '男',
    2: '女'
}
```

### 用户接口  api.ts 

src/api/user/api.ts

```typescript
import type {UserInfo, UserPageQuery} from './types'
import type {AxiosResponse} from "axios";
import type {PageResult} from "@/services/http";
import {request} from '@/services/http'

/**
 * 获取用户分页列表
 */
export function getUserPage(params: UserPageQuery): Promise<PageResult<UserInfo>> {
    return request<PageResult<UserInfo>>({
        url: '/user/page',
        method: 'GET',
        params: params
    })
}

/**
 * 获取用户列表
 */
export function getUserList(): Promise<UserInfo[]> {
    return request<UserInfo[]>({
        url: '/user/list',
        method: 'GET'
    })
}

/**
 * 获取单个用户详情
 */
export function getUserDetail(id: number | string): Promise<UserInfo> {
    return request<UserInfo>({
        url: `/user/${id}`,
        method: 'GET'
    })
}

/**
 * 创建用户
 */
export function createUser(data: Omit<UserInfo, "id">): Promise<void> {
    return request<void>({
        url: `/user/`,
        method: 'POST',
        data: data
    })
}

/**
 * 修改用户
 */
export function updateUser(id: number | string, data: UserInfo): Promise<void> {
    return request<void>({
        url: `/user/${id}`,
        method: 'PUT',
        data: data
    })
}

/**
 * 部分修改用户
 */
export function patchUser(id: number | string, data: Partial<UserInfo>): Promise<void> {
    return request<void>({
        url: `/user/${id}`,
        method: 'PATCH',
        data: data
    })
}

/**
 * 删除用户
 */
export function deleteUser(id: number | string): Promise<void> {
    return request<void>({
        url: `/user/${id}`,
        method: 'DELETE'
    })
}

/**
 * 请求外部接口
 */
export function getForExt(): Promise<AxiosResponse> {
    return request<AxiosResponse>({
        baseURL: "http://192.168.3.45:12007",
        timeout: 2000,
        url: `/user/1`,
        method: 'GET',
        skipAuth: true,
        raw: true,
    })
}

/**
 * 下载外部文件
 */
export function downloadFileForRustFS(): Promise<AxiosResponse<Blob>> {
    return request<AxiosResponse<Blob>>({
        timeout: 2000,
        url: `http://175.178.193.128:20034/kongyu/plugins/rabbitmq_delayed_message_exchange-4.0.2.ez`,
        method: 'GET',
        responseType: "blob",
        skipAuth: true,
        raw: true
    })
}
```

### 用户接口 index.ts

src/api/user/index.ts

```typescript
export * from './api'
export * from './types'
export * from './constants'
```

## 业务接口使用

### Page.vue

src/views/Page.vue

```vue

```

### Page.vue

src/views/Page.vue

```vue

```

### Page.vue

src/views/Page.vue

```vue

```

### Page.vue

src/views/Page.vue

```vue

```

### Page.vue

src/views/Page.vue

```vue

```

### Page.vue

src/views/Page.vue

```vue

```

