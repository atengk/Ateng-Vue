# Axios

Axios 是一个基于 Promise 的 HTTP 客户端，常用于前端项目中与后端接口进行数据交互。它支持在浏览器和 Node.js 环境中使用，能够方便地发送 GET、POST 等多种请求，并支持请求与响应拦截、自动转换 JSON 数据、统一错误处理等功能，使接口调用更加规范和易维护。

在前端开发中，Axios 常与 Vue、React 等框架配合使用，通过统一封装请求逻辑来提升代码的可读性和可扩展性，是目前非常主流的网络请求方案之一。
官网地址：[https://axios-http.com](https://axios-http.com/)

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
                console.error(res.msg || '请求失败')
                //ElMessage.error(res.msg || '请求失败')
            }

            const error = new Error(res.msg || '请求失败')
            ;(error as any).response = res
            return Promise.reject(error)
        }

        return res.data
    },
    (error) => {
        const config = error?.config as RequestConfig | undefined

        /**
         * 显式跳过错误处理
         */
        if (config?.skipErrorHandler) {
            return Promise.reject(error)
        }

        /**
         * 网络错误（无 response）
         */
        if (!error.response) {
            if (error.message?.includes('Network Error')) {
                console.error('网络异常，请检查网络连接')
                //ElMessage.error('网络异常，请检查网络连接')
            } else if (error.code === 'ECONNABORTED') {
                console.error('请求超时，请稍后重试')
                //ElMessage.error('请求超时，请稍后重试')
            } else {
                console.error('请求失败，请稍后重试')
                //ElMessage.error('请求失败，请稍后重试')
            }

            return Promise.reject(error)
        }

        /**
         * HTTP 状态码错误
         */
        const status = error.response.status

        switch (status) {
            case 401:
                console.error('未登录或登录已过期')
                //ElMessage.error('未登录或登录已过期')
                break
            case 403:
                console.error('无权限访问')
                //ElMessage.error('无权限访问')
                break
            case 404:
                console.error('请求的资源不存在')
                //ElMessage.error('请求的资源不存在')
                break
            default:
                if (status >= 500) {
                    console.error('服务器异常，请稍后重试')
                    //ElMessage.error('服务器异常，请稍后重试')
                } else {
                    console.error('请求失败')
                    //ElMessage.error('请求失败')
                }
        }

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
<script setup lang="ts">
import {ref} from 'vue'
import {getUserPage} from "@/api";
import type {UserInfo, UserPageQuery} from "@/api";

const users = ref<UserInfo[]>([])
const total = ref(0)

const emptyQuery = (): UserPageQuery => ({
  page: 1,
  size: 10,
  name: undefined,
  age: undefined
})

const query = ref<UserPageQuery>(emptyQuery())

const loadData = async () => {
  const res = await getUserPage(query.value)
  users.value = res.records
  total.value = res.total
}

// 重置
const resetForm = () => {
  Object.assign(query.value, emptyQuery())
}

</script>

<template>
  <div class="toolbar">
    <label>
      姓名：
      <input v-model="query.name"/>
    </label>

    <label>
      年龄：
      <input type="number" v-model.number="query.age"/>
    </label>

    <label>
      page：
      <input type="number" v-model.number="query.page"/>
    </label>

    <label>
      size：
      <input type="number" v-model.number="query.size"/>
    </label>

    <div class="actions">
      <button @click="loadData">查询</button>
      <button @click="resetForm">重置</button>
    </div>
  </div>

  <div>总数：{{ total }}</div>
  <pre>{{ users }}</pre>
</template>

<style scoped>
.toolbar {
  margin-bottom: 12px;
}

.toolbar label {
  margin-right: 12px;
}

.actions {
  display: flex;
  gap: 8px;
}
</style>

```

### List.vue

src/views/List.vue

```vue
<script setup lang="ts">
import {ref} from 'vue'
import {getUserList} from "@/api";
import type {UserInfo} from "@/api";

const users = ref<UserInfo[]>([])

const loadData = async () => {
  const res = await getUserList()
  users.value = res
}

</script>

<template>
  <div class="toolbar">
    <button @click="loadData">查询</button>
  </div>

  <pre>{{ users }}</pre>
</template>

<style scoped>
.toolbar {
  margin-bottom: 12px;
}

.toolbar label {
  margin-right: 12px;
}
</style>

```

### Detail.vue

src/views/Detail.vue

```vue
<script setup lang="ts">
import {ref} from 'vue'
import {getUserDetail} from '@/api'
import type {UserInfo} from '@/api'

const userId = ref<number | ''>('')
const user = ref<UserInfo | null>(null)

const loadData = async () => {
  if (!userId.value) {
    user.value = null
    return
  }

  user.value = await getUserDetail(userId.value)
}
</script>

<template>
  <div class="toolbar">
    <label>
      用户ID：
      <input type="number" v-model.number="userId"/>
    </label>

    <button @click="loadData">查询</button>
  </div>

  <div v-if="user">
    <h4>用户信息</h4>
    <pre>{{ user }}</pre>
  </div>
</template>

<style scoped>
.toolbar {
  margin-bottom: 12px;
}

.toolbar label {
  margin-right: 12px;
}
</style>

```

### Create.vue

src/views/Create.vue

```vue
<script setup lang="ts">
import {ref} from 'vue'
import {createUser} from '@/api'
import type {UserInfo} from "@/api";

type CreateUser = Omit<UserInfo, 'id'>

const createEmptyForm = (): CreateUser => ({
  birthday: '',
  city: '',
  province: '',
  score: 0,
  name: '',
  age: 0
})

const form = ref<CreateUser>(createEmptyForm())

// 重置
const resetForm = () => {
  Object.assign(form.value, createEmptyForm())
}

const submit = async () => {
  await createUser(form.value)
}
</script>

<template>
  <div class="toolbar">
    <label>
      姓名：
      <input v-model="form.name"/>
    </label>

    <label>
      年龄：
      <input type="number" v-model.number="form.age"/>
    </label>

    <div class="actions">
      <button @click="submit">创建</button>
      <button @click="resetForm">重置</button>
    </div>
  </div>

  <pre>{{ form }}</pre>
</template>

<style scoped>
.toolbar {
  margin-bottom: 12px;
}

.toolbar label {
  margin-right: 12px;
}

.actions {
  display: flex;
  gap: 8px;
}
</style>

```

### Delete.vue

src/views/Delete.vue

```vue
<script setup lang="ts">
import {ref} from 'vue'
import {deleteUser} from '@/api'

const userId = ref<number | ''>('')

const handleDeleteUser = async () => {
  await deleteUser(userId.value)
}
</script>

<template>
  <div class="toolbar">
    <label>
      用户ID：
      <input type="number" v-model.number="userId"/>
    </label>

    <button @click="handleDeleteUser">删除</button>
  </div>

</template>

<style scoped>
.toolbar {
  margin-bottom: 12px;
}

.toolbar label {
  margin-right: 12px;
}
</style>

```

### Update.vue

src/views/Update.vue

```vue
<script setup lang="ts">
import {ref} from 'vue'
import {updateUser} from '@/api'
import type {UserInfo} from '@/api'

const userId = ref<number | ''>('')

const createEmptyForm = (): UserInfo => ({
  id: 0,
  birthday: '',
  city: '',
  province: '',
  score: 0,
  name: '',
  age: 0
})

const form = ref<UserInfo>(createEmptyForm())

// 重置
const resetForm = () => {
  Object.assign(form.value, createEmptyForm())
}

const submit = async () => {
  await updateUser(userId.value, form.value)
}
</script>

<template>
  <div class="toolbar">
    <label>
      id：
      <input type="number" v-model.number="userId"/>
    </label>

    <label>
      姓名：
      <input v-model="form.name"/>
    </label>

    <label>
      年龄：
      <input type="number" v-model.number="form.age"/>
    </label>

    <div class="actions">
      <button @click="submit">创建</button>
      <button @click="resetForm">重置</button>
    </div>
  </div>

  <pre>{{ form }}</pre>
</template>

<style scoped>
.toolbar {
  margin-bottom: 12px;
}

.toolbar label {
  margin-right: 12px;
}

.actions {
  display: flex;
  gap: 8px;
}
</style>

```

### Patch.vue

src/views/Patch.vue

```vue
<script setup lang="ts">
import {ref} from 'vue'
import {patchUser} from '@/api'
import type {UserInfo} from '@/api'

const userId = ref<number | ''>('')

type PatchUser = Partial<UserInfo>

const createEmptyForm = (): PatchUser => ({
  score: 0,
  name: '',
  age: 0
})

const form = ref<PatchUser>(createEmptyForm())

// 重置
const resetForm = () => {
  Object.assign(form.value, createEmptyForm())
}

const submit = async () => {
  await patchUser(userId.value, form.value)
}
</script>

<template>
  <div class="toolbar">
    <label>
      id：
      <input type="number" v-model.number="userId"/>
    </label>

    <label>
      姓名：
      <input v-model="form.name"/>
    </label>

    <label>
      年龄：
      <input type="number" v-model.number="form.age"/>
    </label>

    <div class="actions">
      <button @click="submit">创建</button>
      <button @click="resetForm">重置</button>
    </div>
  </div>

  <pre>{{ form }}</pre>
</template>

<style scoped>
.toolbar {
  margin-bottom: 12px;
}

.toolbar label {
  margin-right: 12px;
}

.actions {
  display: flex;
  gap: 8px;
}
</style>

```

### Custom.vue

src/views/Patch.vue

```vue
<script setup lang="ts">
import {ref} from 'vue'
import {downloadFileForRustFS, getForExt} from "@/api";

const data = ref<any>(null)

const loadData = async () => {
  const res = await getForExt()
  data.value = res.data
}

const download = async () => {
  const res = await downloadFileForRustFS()

  const url = window.URL.createObjectURL(res.data)
  const link = document.createElement('a')
  link.href = url
  link.download = 'download_file'
  link.click()
  window.URL.revokeObjectURL(url)
}

</script>

<template>
  <div class="actions">
    <button @click="loadData">查询</button>
    <button @click="download">下载</button>
  </div>

  <pre>{{ data }}</pre>
</template>

<style scoped>
.actions {
  display: flex;
  gap: 8px;
}
</style>

```

### App.vue

src/App.vue

```vue
<script setup lang="ts">
import {ref} from 'vue'
import List from '@/views/List.vue'
import Page from '@/views/Page.vue'
import Detail from "@/views/Detail.vue";
import Delete from "@/views/Delete.vue";
import Create from "@/views/Create.vue";
import Update from "@/views/Update.vue";
import Patch from "@/views/Patch.vue";
import Custom from "@/views/Custom.vue";

const tab = ref<'list' | 'page' | 'detail' | 'delete' | 'create' | 'update' | 'patch' | 'custom'>('list')
</script>

<template>
  <div class="tabs">
    <button @click="tab = 'list'">List</button>
    <button @click="tab = 'page'">Page</button>
    <button @click="tab = 'detail'">Detail</button>
    <button @click="tab = 'delete'">Delete</button>
    <button @click="tab = 'create'">Create</button>
    <button @click="tab = 'update'">Update</button>
    <button @click="tab = 'update'">Update</button>
    <button @click="tab = 'patch'">Patch</button>
    <button @click="tab = 'custom'">Custom</button>
  </div>

  <List v-if="tab === 'list'"/>
  <Detail v-else-if="tab === 'detail'"/>
  <Delete v-else-if="tab === 'delete'"/>
  <Create v-else-if="tab === 'create'"/>
  <Update v-else-if="tab === 'update'"/>
  <Patch v-else-if="tab === 'patch'"/>
  <Custom v-else-if="tab === 'custom'"/>
  <Page v-else/>
</template>

<style scoped>
.tabs {
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e5e7eb;
}

.tabs button {
  margin-right: 8px;
}
</style>
```



## Request 用法

该章节是直接使用的 src/service/http/axios.ts 的 request，没有经过封装。

---

### Request 简介

`request` 是基于 `axios` 的二次封装，用于统一处理：

* 接口基础地址与超时
* Token 自动注入
* 业务响应结构解包
* 业务错误与 HTTP 错误统一处理
* 外部接口 / 下载接口的原始响应支持

所有业务层 **必须通过 `@/services/http` 导出的方法调用接口**，禁止直接使用 `axios`。

---

### 基础用法

```ts
request<T>(config: RequestConfig): Promise<T>
```

* `T`：**最终业务数据类型**
* 返回值：`Promise<T>`
* 已自动解包 `ApiResponse.data`

#### 示例

```ts
request<UserInfo>({
    url: '/user/1',
    method: 'GET'
})
```

---

### 统一响应结构约定

后端接口需返回以下结构：

```ts
interface ApiResponse<T = any> {
    code: string
    msg: string
    data: T
}
```

处理规则：

* `code === '0'`：请求成功，返回 `data`
* `code !== '0'`：视为业务错误，返回 `Promise.reject`

---

### Token 自动注入规则

默认行为：

* 自动从 `localStorage` 读取 `token`
* 以 `Authorization: Bearer xxx` 形式注入请求头

```ts
Authorization: Bearer ${token}
```

---

### 跳过 Token（skipAuth）

当请求 **不需要登录态**（如外部接口、公共接口）时：

```ts
request({
    url: '/public/info',
    method: 'GET',
    skipAuth: true
})
```

* 不读取 `localStorage.token`
* 不注入 `Authorization` 请求头

---

### 业务错误处理（skipErrorHandler）

默认：

* `code !== '0'` 时自动打印异常

如需自行处理错误：

```ts
request({
    url: '/user/create',
    method: 'POST',
    data,
    skipErrorHandler: true
})
```

---

### 原始响应模式（raw）

当你需要：

* 文件下载
* 非标准接口
* 外部系统接口
* 自行处理 `AxiosResponse`

使用 `raw: true`

```ts
request({
    url: '/download',
    method: 'GET',
    raw: true
})
```

返回值：

```ts
Promise<AxiosResponse>
```

---

### 分页接口示例

```ts
export function getUserPage(
    params: UserPageQuery
): Promise<PageResult<UserInfo>> {
    return request<PageResult<UserInfo>>({
        url: '/user/page',
        method: 'GET',
        params
    })
}
```

说明：

* `params` 自动拼接为 query string
* 返回值直接是分页数据对象

---

### 普通列表接口示例

```ts
export function getUserList(): Promise<UserInfo[]> {
    return request<UserInfo[]>({
        url: '/user/list',
        method: 'GET'
    })
}
```

---

### RESTful 接口示例

#### 查询详情

```ts
export function getUserDetail(id: number | string): Promise<UserInfo> {
    return request<UserInfo>({
        url: `/user/${id}`,
        method: 'GET'
    })
}
```

#### 新增

```ts
export function createUser(
    data: Omit<UserInfo, 'id'>
): Promise<void> {
    return request<void>({
        url: '/user',
        method: 'POST',
        data
    })
}
```

#### 修改

```ts
export function updateUser(
    id: number | string,
    data: UserInfo
): Promise<void> {
    return request<void>({
        url: `/user/${id}`,
        method: 'PUT',
        data
    })
}
```

#### 局部更新

```ts
export function patchUser(
    id: number | string,
    data: Partial<UserInfo>
): Promise<void> {
    return request<void>({
        url: `/user/${id}`,
        method: 'PATCH',
        data
    })
}
```

#### 删除

```ts
export function deleteUser(id: number | string): Promise<void> {
    return request<void>({
        url: `/user/${id}`,
        method: 'DELETE'
    })
}
```

---

### 扩展示例

#### 请求外部接口

👉 特点：

- 不走你自己的 `baseURL`
- 不带 token
- 需要自定义 header
- 原始响应直通

```ts
/**
 * 请求 GitHub 外部接口（示例）
 */
export function getGithubRepo() {
    return request<any>({
        baseURL: 'https://api.github.com',
        url: '/repos/vuejs/core',
        method: 'GET',

        // 不带 token
        skipAuth: true,

        // 原始响应（不走 code/msg 解析）
        raw: true,

        // 自定义 header
        headers: {
            Accept: 'application/vnd.github+json'
        },

        // 超时覆盖
        timeout: 3000
    })
}
```

使用方式

```ts
const res = await getGithubRepo()
console.log(res.data.full_name)
```

------

#### 文件下载

👉 特点：

- `responseType: 'blob'`
- `raw: true`
- header 中带文件名
- 支持 params

```ts
/**
 * 导出用户数据（文件下载）
 */
export function exportUserFile(params: { type: string }) {
    return request<Blob>({
        url: '/file/export',
        method: 'GET',
        params,

        responseType: 'blob',
        raw: true,

        timeout: 60000
    })
}
```

页面调用

```ts
const blob = await exportUserFile({ type: 'user' })
downloadBlob(blob, '用户数据.xlsx')
```

------

#### params + data + 自定义 header 同时使用

👉 **这是你问的最多、也是企业里最常见的**

```ts
/**
 * 批量更新用户状态
 */
export function batchUpdateUserStatus(
    params: { force?: boolean },
    data: { ids: number[]; status: number }
) {
    return request<void>({
        url: '/user/batch/update',
        method: 'PUT',

        // URL 查询参数
        params,

        // 请求体
        data,

        // 自定义 header
        headers: {
            'X-Operate-Source': 'admin',
            'X-Trace-Id': crypto.randomUUID()
        },

        timeout: 10000
    })
}
```

实际请求效果

```http
PUT /user/batch/update?force=true
Headers:
  X-Operate-Source: admin
  X-Trace-Id: xxx

Body:
{
  "ids": [1,2,3],
  "status": 1
}
```

------

#### POST + params + data + 超时 + 关闭统一错误提示

👉 **适合表单 / 弹窗类操作**

```ts
/**
 * 创建用户（自定义错误处理）
 */
export function createUserWithOptions(
    params: { notify?: boolean },
    data: {
        name: string
        age: number
    }
) {
    return request<void>({
        url: '/user',
        method: 'POST',

        params,
        data,

        // 业务端自己提示错误
        skipErrorHandler: true,

        timeout: 5000
    })
}
```

页面用法（推荐）

```ts
try {
    await createUserWithOptions({ notify: true }, form)
    ElMessage.success('创建成功')
} catch (e: any) {
    ElMessage.error(e.message)
}
```

------

#### DELETE + params + data（特殊但真实存在）

```ts
/**
 * 删除用户（需要传原因）
 */
export function deleteUserWithReason(
    id: number,
    data: { reason: string }
) {
    return request<void>({
        url: `/user/${id}`,
        method: 'DELETE',

        data,

        timeout: 3000
    })
}
```

---

## Request 封装用法

该章节基于 `src/service/http/request.ts`，是对 `src/service/http/axios.ts` 中 `request` 的二次封装，目的是：

* 简化 HTTP 方法调用
* 统一参数结构
* 降低业务层心智负担
* 保持 request 层职责单一

---

### GET 请求

用于查询数据、分页列表、详情等只读操作。

```ts
import { get } from '@/services/http'

export function getUserDetail(id: number) {
    return get<UserInfo>(`/user/${id}`)
}
```

携带查询参数：

```ts
get<PageResult<UserInfo>>('/user/page', {
    params: {
        page: 1,
        size: 10
    }
})
```

---

### POST 请求

用于新增数据、提交表单等操作。

```ts
import { post } from '@/services/http'

export function createUser(data: CreateUser) {
    return post<void>('/user', {
        data
    })
}
```

同时携带 query 参数：

```ts
post<void>('/user', {
    params: { source: 'admin' },
    data: form
})
```

---

### PUT 请求

用于**整体更新**资源（RESTful 语义）。

```ts
import { put } from '@/services/http'

export function updateUser(id: number, data: UserInfo) {
    return put<void>(`/user/${id}`, {
        data
    })
}
```

---

### DELETE 请求

用于删除资源。

```ts
import { del } from '@/services/http'

export function deleteUser(id: number) {
    return del<void>(`/user/${id}`)
}
```

部分接口需要传 body：

```ts
del<void>('/user/batch', {
    data: {
        ids: [1, 2, 3]
    }
})
```

---

### PATCH 请求

用于**局部更新**资源。

```ts
import { patch } from '@/services/http'

export function patchUser(
    id: number,
    data: Partial<UserInfo>
) {
    return patch<void>(`/user/${id}`, {
        data
    })
}
```

---

### POST 表单请求（x-www-form-urlencoded）

适用于传统表单接口、部分第三方接口。

```ts
import { postForm } from '@/services/http'

postForm<void>('/login', {
    data: {
        username: 'admin',
        password: '123456'
    }
})
```

---

### 文件上传

用于上传文件（`multipart/form-data`）。

```ts
import { upload } from '@/services/http'

const formData = new FormData()
formData.append('file', file)

upload<void>('/file/upload', {
    data: formData
})
```

携带额外参数：

```ts
upload<void>('/file/upload', {
    params: { bizType: 'avatar' },
    data: formData
})
```

---

### 文件下载（返回 Blob）

用于**只获取 Blob 数据，不自动触发下载**。

```ts
import { download } from '@/services/http'

const response = await download('/file/export', {
    params: { type: 'excel' }
})

const blob = response.data
```

---

### 文件下载（自动触发浏览器下载）

推荐使用方式，自动解析文件名并下载。

```ts
import { downloadFile } from '@/services/http'

await downloadFile(
    '/file/export',
    {
        params: { type: 'excel' }
    },
    '用户列表.xlsx'
)
```

特点：

* 自动解析 `Content-Disposition`
* 后端异常 JSON 自动识别
* 支持兜底文件名

---

### 跳过默认错误提示

当业务层需要自行处理异常时，可通过 `config` 传递：

```ts
post<void>('/user', {
    data: form,
    config: {
        skipErrorHandler: true
    }
})
```

适用场景：

* 表单级校验提示
* 多步骤操作
* 特殊错误交互

---

### 请求外部接口

覆盖 `baseURL`，并跳过鉴权。

```ts
get<any>('/user/1', {
    config: {
        baseURL: 'http://192.168.3.45:12007',
        skipAuth: true,
        raw: true
    }
})
```

---

### 操作成功提示的处理位置

**成功提示不在 request 层处理**，应放在业务层或页面层：

```ts
try {
    await createUser(form)
    ElMessage.success('创建成功')
} catch (e) {
    // 失败提示已由 request 层兜底
}
```

---

很好，这一步**非常有文档价值** 👍
下面我给你 **两个「复杂 POST 请求」的完整示例**，都符合你现在这套 `post` / `RequestOptions` 的真实能力，**可以直接复制进文档**。

我会刻意覆盖：

* 多 query 参数
* 复杂 body（对象 + 数组 + 嵌套）
* 自定义 axios config
* 跳过默认错误处理

---

### 复杂 POST 示例一：分页 + 条件查询 + 行为控制参数

**场景说明**

* 查询用户分页列表
* query 中控制分页、排序
* body 中传复杂筛选条件
* 禁用默认错误提示，由页面自行处理

```ts
import { post } from '@/services/http'
import type { PageResult } from '@/services/http'

interface UserQueryCondition {
    keyword?: string
    statusList?: number[]
    deptCodes?: string[]
    createTimeRange?: [string, string]
}

interface UserPageResult {
    id: number
    name: string
    age: number
    status: number
    deptCode: string
}

export function queryUserPage(
    page: number,
    size: number,
    condition: UserQueryCondition
): Promise<PageResult<UserPageResult>> {
    return post<PageResult<UserPageResult>>('/user/page', {
        /**
         * Query 参数（拼接到 URL）
         */
        params: {
            page,
            size,
            orderBy: 'create_time',
            order: 'desc'
        },

        /**
         * 请求体（复杂查询条件）
         */
        data: {
            keyword: condition.keyword,
            statusList: condition.statusList,
            deptCodes: condition.deptCodes,
            createTimeRange: condition.createTimeRange
        },

        /**
         * Axios 级别配置
         */
        config: {
            timeout: 15000,
            skipErrorHandler: true
        }
    })
}
```

**使用示例**

```ts
const result = await queryUserPage(1, 10, {
    keyword: '张',
    statusList: [1, 2],
    deptCodes: ['D001', 'D002'],
    createTimeRange: ['2024-01-01', '2024-12-31']
})
```

---

### 复杂 POST 示例二：业务操作 + 行为选项 + 批量数据提交

**场景说明**

* 批量创建用户
* query 控制业务行为（是否通知、是否校验）
* body 包含数组 + 嵌套对象
* 自定义 headers + 超时

```ts
import { post } from '@/services/http'

interface CreateUserItem {
    name: string
    age: number
    deptCode: string
    roles: string[]
}

interface CreateUsersRequest {
    users: CreateUserItem[]
    operator: {
        id: number
        name: string
    }
    remark?: string
}

export function batchCreateUsers(
    data: CreateUsersRequest,
    options?: {
        notify?: boolean
        strictValidate?: boolean
    }
): Promise<void> {
    return post<void>('/user/batch-create', {
        /**
         * 行为控制参数（query）
         */
        params: {
            notify: options?.notify ?? false,
            strict: options?.strictValidate ?? true
        },

        /**
         * 批量业务数据
         */
        data: {
            users: data.users,
            operator: data.operator,
            remark: data.remark
        },

        /**
         * Axios 配置
         */
        config: {
            timeout: 20000,
            headers: {
                'X-Operate-Source': 'admin'
            }
        }
    })
}
```

**使用示例**

```ts
await batchCreateUsers(
    {
        users: [
            {
                name: '张三',
                age: 28,
                deptCode: 'D001',
                roles: ['ADMIN']
            },
            {
                name: '李四',
                age: 32,
                deptCode: 'D002',
                roles: ['USER']
            }
        ],
        operator: {
            id: 1001,
            name: '系统管理员'
        },
        remark: '年度人员初始化'
    },
    {
        notify: true,
        strictValidate: false
    }
)
```

---

