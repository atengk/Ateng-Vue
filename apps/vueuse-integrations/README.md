# VueUse Integrations

`VueUse` 是 Vue 3 生态中**最受欢迎、最实用的工具库之一**，基本是做 Vue3 + TypeScript 项目的“标配”。

`@vueuse/core` 是 Vue 生态中最常用的工具函数库之一，提供大量基于 Composition API 的 `useXxx()` 组合式函数，用来处理浏览器能力、异步、事件、状态管理、动画、网络、存储等常见逻辑。它能显著减少业务代码量，提升开发效率和可读性，支持 Vue2/3、TypeScript、SSR，函数设计一致性强，也易于拓展，是前端现代 Vue 项目必备的实用工具集。

- [官网地址](https://vueuse.org/)



## 基础配置

**安装依赖**

```
pnpm add @vueuse/integrations@14.1.0
```



## 数据请求相关 (HTTP & Networking)

### HTTP 请求 `useAxios`

`useAxios` 是对 `axios` 的组合式封装，提供：

- 自动响应式状态管理：`data / isLoading / error`
- 自动取消请求
- 手动触发与自动请求两种模式
- 支持自定义 `axiosInstance`
- 支持 TypeScript 类型推导

适用于：

✔ 普通前后端 HTTP 接口请求
✔ 表单提交 + Loading 状态
✔ SSR + Suspense 数据请求
✔ 支持自动取消请求防止竞态问题（尤其在切换路由时）

------

**安装依赖**

```bash
pnpm add axios
```

如果你已经有 axios 则跳过。

------

**基本使用示例**

下面示例展示了最常见的 **自动请求模式**：

```vue
<template>
  <div class="app">
    <h1>VueUse - useAxios</h1>

    <div v-if="isLoading" class="loading">加载中...</div>
    <div v-else-if="error" class="error">请求出错：{{ error.message }}</div>

    <pre v-else>{{ data }}</pre>

    <button @click="execute()">重新加载</button>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios'
import { useAxios } from '@vueuse/integrations/useAxios'

/**
 * 这里直接传入 URL，会在组件初始化时自动发起请求
 * useAxios 的响应式返回值包括：
 * - data:       响应数据（Ref）
 * - isLoading:  加载状态（Ref<boolean>）
 * - error:      错误对象（Ref<Error | null>）
 * - execute:    手动执行请求的方法
 */
const {
  data,
  isLoading,
  error,
  execute,
} = useAxios('https://jsonplaceholder.typicode.com/todos/1', {
  method: 'GET',
})
</script>

<style scoped>
.app {
  padding: 24px;
  font-family: sans-serif;
}
.loading {
  color: #409eff;
}
.error {
  color: #f56c6c;
}
button {
  margin-top: 12px;
  padding: 6px 12px;
}
</style>
```

------

**创建 Axios 实例（推荐）**

通常生产环境都会配置 axios 实例，例如：

```ts
// api/http.ts
import axios from 'axios'

export const http = axios.create({
  baseURL: '/api',
  timeout: 5000,
})
```

然后配合 `useAxios` 使用：

```ts
import { useAxios } from '@vueuse/integrations/useAxios'
import { http } from '@/api/http'

const { data, isLoading, execute } = useAxios('/user/profile', { method: 'GET' }, http)
```

💡 这时会自动拼接 `baseURL`，并继承拦截器等配置。

------

**手动请求模式（适用于表单提交）**

```ts
const { execute, data, isLoading } = useAxios('/login', { method: 'POST' }, http, {
  immediate: false, // 禁止自动请求
})

function login() {
  execute({
    data: {
      username: 'admin',
      password: '123456',
    },
  })
}
```

适用于：

- 点击按钮提交
- 表单提交
- 搜索查询

------

**TypeScript 类型推断**

```ts
interface Todo {
  id: number
  title: string
  completed: boolean
}

const { data } = useAxios<Todo>('/todo/1', {}, http)

// data.value?.title → TS 自动提示
```

------

**返回值说明**

`useAxios` 返回一个对象，常见字段：

| 字段        | 类型                        | 含义         |
| ----------- | --------------------------- | ------------ |
| `data`      | `Ref<T | undefined>`        | 响应数据     |
| `isLoading` | `Ref<boolean>`              | 是否正在请求 |
| `error`     | `Ref<AxiosError | null>`    | 错误响应     |
| `execute`   | `(config?) => Promise<any>` | 触发请求     |
| `abort`     | `() => void`                | 取消当前请求 |

------

**注意事项**

⚠️ `immediate: true` 为默认值，会自动请求
⚠️ 路由切换时请确保未使用被卸载的响应数据
⚠️ SSR 场景需注意浏览器特定 API

------

### 数据获取与缓存：`useVueQuery`

`useVueQuery` 是 `@tanstack/vue-query` 在 VueUse Integration 中的封装，用来管理 **服务器状态（Server State）**，相比普通请求，它具有：

✔ 自动缓存与数据同步
✔ 请求重试与失败恢复
✔ 自动刷新（Refetch）
✔ 缓存失效机制（Stale-While-Revalidate）
✔ 后台重新请求
✔ 依赖变量动态请求
✔ 与 Suspense 一起使用 SSR 支持
✔ 强大的 TypeScript 类型支持

适用于：

- 表格列表分页
- 实时数据同步
- 下拉缓存复用（避免重复请求）
- 离线再上线自动刷新
- 前端缓存策略优化

------

**安装依赖**

```bash
pnpm add @tanstack/vue-query @vueuse/integrations axios
```

> 注意：`axios` 非必需，但常一起使用。

------

**VueQuery 基础配置（推荐）**

先在入口注册 `QueryClientProvider`：

```ts
// main.ts
import { createApp } from 'vue'
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'
import App from './App.vue'

const queryClient = new QueryClient()

createApp(App)
  .use(VueQueryPlugin, { queryClient })
  .mount('#app')
```

> 必须有这一步，否则 `useVueQuery` 无法工作。

------

**基本使用示例**

下面示例展示最典型的数据加载 + 响应式状态：

```vue
<template>
  <div class="app">
    <h1>VueUse - useVueQuery</h1>

    <div v-if="isLoading">加载中...</div>
    <div v-else-if="error">请求失败：{{ error.message }}</div>

    <pre>{{ data }}</pre>

    <button @click="refetch()">手动刷新</button>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios'
import { useVueQuery } from '@vueuse/integrations/useVueQuery'

/**
 * useVueQuery 支持类似 react-query 的 options 策略：
 * - queryKey: 缓存键（必需、用于数据区分）
 * - queryFn: 数据获取函数（必需）
 * - refetchOnWindowFocus: 窗口聚焦自动刷新
 * - staleTime: 数据过期时间
 * - cacheTime: 缓存保留时间
 */
const {
  data,
  error,
  isLoading,
  refetch,
} = useVueQuery({
  queryKey: ['todo', 1],
  queryFn: async () => {
    const res = await axios.get('https://jsonplaceholder.typicode.com/todos/1')
    return res.data
  },
  refetchOnWindowFocus: true,
})
</script>
```

------

**依赖参数请求（动态 queryKey）**

非常适合分页 / 搜索：

```ts
const page = ref(1)

const { data, isLoading } = useVueQuery({
  queryKey: ['todos', page],   // page 修改时自动刷新
  queryFn: () => axios.get(`/api/todos?page=${page.value}`)
})
```

> 修改 `page.value` 会自动触发新的请求并更新缓存。

------

**TypeScript 支持示例**

```ts
interface Todo {
  id: number
  title: string
  completed: boolean
}

const { data } = useVueQuery<Todo>({
  queryKey: ['todo', 1],
  queryFn: async () => {
    const res = await axios.get('/todo/1')
    return res.data
  },
})

// data.value?.title → 自动提示
```

------

**缓存 + 状态策略说明（核心优势）**

`vue-query` 的核心概念是 **Stale-While-Revalidate**：

| 状态         | 含义                                 |
| ------------ | ------------------------------------ |
| **fresh**    | 数据最新，无需请求                   |
| **stale**    | 数据过期，可显示旧数据，同时后台刷新 |
| **inactive** | 缓存保留，但无订阅                   |
| **gc**       | 缓存清理                             |

控制方式：

```ts
staleTime: 1000 * 60    // 1分钟不过期
cacheTime: 1000 * 60 * 5 // 5分钟清理缓存
```

------

**常用配置项**

| 配置项                 | 作用                 |
| ---------------------- | -------------------- |
| `queryKey`             | 缓存键（必需）       |
| `queryFn`              | 请求函数（必需）     |
| `staleTime`            | 数据多久变 stale     |
| `cacheTime`            | 缓存多久被清理       |
| `retry`                | 请求失败自动重试次数 |
| `refetchOnMount`       | 挂载自动刷新         |
| `refetchOnWindowFocus` | 聚焦刷新             |
| `enabled`              | 禁止自动请求         |
| `select`               | 数据加工管道         |

------

**表格场景示例（分页 + 缓存）**

```ts
const page = ref(1)

const { data, isLoading } = useVueQuery({
  queryKey: ['users', page],
  queryFn: () => axios.get(`/api/users?page=${page.value}`),
  keepPreviousData: true, // 保留上一页数据避免闪烁
})
```

非常适合后台管理场景！

------

**与 Axios 实例结合（推荐项目结构）**

```ts
import { http } from '@/api/http'

useVueQuery({
  queryKey: ['profile'],
  queryFn: () => http.get('/user/profile').then(r => r.data),
})
```

> 与 `useAxios` 的区别是：`useAxios` 是单请求，`useVueQuery` 是状态机+缓存。

------

**适用场景总结**

✔ 大部分需要缓存的接口请求
✔ 分页列表、图表数据、配置项加载
✔ 多 Tab 切换不重复请求
✔ 实时性要求（失效自动刷新）
✔ 离线再上线自动恢复
✔ SSR（服务端预取）

------

**注意事项**

⚠ `queryKey` 必须唯一，否则会出现缓存冲突
⚠ `queryKey` 中的 `ref` 会触发自动刷新
⚠ SSR 模式下需要 `dehydrate`
⚠ 适合服务端状态而非本地状态（local state 用 pinia 更合适）

---

## 数据处理 / 搜索匹配

------

### 模糊搜索：`useFuse`

`useFuse` 基于 `fuse.js` 的组合式封装，用于在前端执行高效的 **模糊搜索（Fuzzy Search）**。

它适用于：

✔ 输入框实时搜索
✔ 表格本地搜索（不打后端）
✔ 标签/用户名/文件名模糊匹配
✔ 权重搜索（可提升标题匹配优先级）
✔ 支持中文搜索（基于分词优化）

相比手写过滤逻辑，`useFuse` 支持：

✔ 评分排序
✔ 分词匹配
✔ 高亮位置（可以用于 UI 标注）
✔ 配置权重与阈值（控制匹配精度）
✔ TypeScript 类型推断

------

**安装依赖**

```bash
pnpm add fuse.js @vueuse/integrations
```

------

**基本示例：输入实时模糊搜索**

```vue
<template>
  <div class="app">
    <h1>VueUse - useFuse</h1>

    <input v-model="keyword" placeholder="搜索名字..." />

    <ul>
      <li v-for="item in results" :key="item.item.id">
        {{ item.item.name }}（得分：{{ item.score?.toFixed(3) }}）
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useFuse, type UseFuseOptions } from '@vueuse/integrations/useFuse'

interface User {
  id: number
  name: string
}

const users = ref<User[]>([
  { id: 1, name: 'Alice Johnson' },
  { id: 2, name: 'Alicia Keys' },
  { id: 3, name: 'Bob Smith' },
  { id: 4, name: '陈小明' },
])

const keyword = ref('')

const options: UseFuseOptions<User> = {
  fuseOptions: {
    keys: ['name'],
    threshold: 0.4,
  },
}

const { results } = useFuse(keyword, users, options)

</script>

<style scoped>
.app {
  padding: 24px;
  font-family: sans-serif;
}
input {
  padding: 6px 12px;
  margin-bottom: 12px;
}
</style>
```

------

**支持权重加成（提高某字段优先级）**

适用于“标题 > 描述”这种场景：

```ts
const articles = ref([
  { id: 1, title: 'VueUse Guide', description: 'Vue composition utilities' },
  { id: 2, title: 'React Query', description: 'Data fetching library' },
])

const { results } = useFuse(keyword, articles, {
  fuseOptions: {
    keys: [
      { name: 'title', weight: 0.7 },
      { name: 'description', weight: 0.3 },
    ],
  },
})
```

例如搜索 `vueuse`，标题匹配优先于描述匹配。

------

**返回搜索的高亮范围（可用于 UI 标注）**

`FuseResult` 中包含 `matches` 字段，可实现高亮：

```ts
results.value.forEach(r => {
  // r.matches 包含匹配段落范围
})
```

适合在 UI 中突出关键词效果，比如：

```
VueUse → <mark>Vue</mark>Use
```

------

**TypeScript 支持**

```ts
interface User {
  id: number
  name: string
}

const { results } = useFuse<User>(keyword, users, {
  fuseOptions: {
    keys: ['name'],
  },
})

// results.item 自动推断类型为 User
```

------

**配置项说明（常用）**

来自 fuse.js 原生配置：

| 配置项               | 作用                            |
| -------------------- | ------------------------------- |
| `keys`               | 搜索字段                        |
| `threshold`          | 模糊匹配阈值（0 严格 ~ 1 宽松） |
| `distance`           | 匹配距离                        |
| `ignoreLocation`     | 忽略匹配位置                    |
| `minMatchCharLength` | 最小匹配字符数                  |
| `useExtendedSearch`  | 开启扩展语法                    |
| `isCaseSensitive`    | 区分大小写                      |

默认 `threshold=0.6`，一般可调整至 `0.3~0.4` 以减少噪点。

------

**中文匹配提示**

`fuse.js` 支持中文 fuzzy，例如：

```
输入：xm
匹配：小明
```

如果需要 **拼音搜索** 则需要结合第三方库进行预处理（可扩展方案）。

------

**与列表/表格结合（本地搜索最佳实践）**

常用于 `el-table` / `vxe-table`：

```ts
const filteredList = computed(() =>
  keyword.value
    ? results.value.map(r => r.item)
    : users.value
)
```

直接绑定到 `table` 即可。

------

**适用场景总结**

✔ 本地模糊搜索
✔ 文件名/用户名搜索
✔ Tag/下拉框筛选
✔ 表格本地过滤
✔ 高亮搜索关键词
✔ 支持中文与权重
✔ 离线可用（不依赖网络）

不适用于：

❌ 大规模后端搜索（应交给 Elasticsearch / pg_trgm / DB LIKE）

------

**注意事项**

⚠ 权重搜索应确保 `weights` 总和合理
⚠ 大数据量（1w+项）建议进行 debounce 防抖
⚠ 拼音搜索需额外扩展
⚠ `threshold` 调整会强烈影响匹配体验（推荐范围 `0.3~0.6`）

------

### IndexedDB 包装：`useIDBKeyval`

`useIDBKeyval` 基于 `idb-keyval` 库封装，让你能在浏览器本地使用 **IndexedDB** 存储数据，并且具备：

✔ 异步存储（非阻塞 UI）
✔ 类型安全（TS 友好）
✔ 大容量（比 localStorage 大得多）
✔ 支持对象、Blob、ArrayBuffer 等类型
✔ 持久化缓存（浏览器关闭后仍存在）

适用场景：

✔ Web 应用本地数据缓存
✔ 大数据量浏览记录或会话存储
✔ 离线缓存（PWA）
✔ IndexedDB 替代 localStorage / sessionStorage
✔ 表格/请求数据本地持久化

------

**安装依赖**

```bash
pnpm add idb-keyval @vueuse/integrations
```

------

**基本示例：读写简单状态**

存储用户信息：

```vue
<template>
  <div class="app">
    <h1>VueUse - useIDBKeyval</h1>

    <input v-model="name" placeholder="输入用户名..." />
    <button @click="save">存储到 IndexedDB</button>
    <button @click="remove">删除 IndexedDB 中的数据</button>

    <p>读取结果：{{ storedName }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useIDBKeyval } from '@vueuse/integrations/useIDBKeyval'

const name = ref('')

/**
 * 这里把类型改成 string | null
 * 因为在你这个 VueUse 版本里：
 * data.value = null 会触发 idb-keyval 的 del(key)
 */
const { data: storedName, set } = useIDBKeyval<string | null>('username', null)

function save() {
  set(name.value)
}

function remove() {
  storedName.value = null
}
</script>

<style scoped>
.app {
  padding: 24px;
  font-family: sans-serif;
}
button {
  margin-left: 12px;
}
</style>
```

特点：

- 第一次加载会异步读取 IndexedDB
- `data` 是响应式的，UI 自动更新

------

**存储复杂对象（如 JSON）**

IndexedDB 支持存对象，这点 localStorage 做不到：

```ts
interface UserProfile {
  id: number
  name: string
  avatar: string
  tags: string[]
}

const defaultValue: UserProfile = {
  id: 0,
  name: '',
  avatar: '',
  tags: [],
}

const { data: profile, set } = useIDBKeyval<UserProfile>('profile', defaultValue)
```

写入：

```ts
set({
  id: 1,
  name: 'Blair',
  avatar: '/avatar.png',
  tags: ['vue', 'pwa'],
})
```

IndexedDB 支持二进制与对象存储，非常适合 PWA。

------

**存储大数据（如表格缓存）**

适用于分页表格缓存、离线页面等：

```ts
const { data: tableCache, set: setCache } = useIDBKeyval('table:project-list', [])
```

使用时：

```ts
// 写入缓存
setCache(projectList)

// 读取后，自动覆盖 data
console.log(tableCache.value)
```

可配合 debounce 避免频繁写入。

------

**TypeScript 类型支持**

```ts
interface Settings {
  darkMode: boolean
}

const { data } = useIDBKeyval<Settings>('app:settings', { darkMode: false })

// data.value 自动推断为 Settings
```

------

**与 `localStorage` 对比**

| 能力              | IndexedDB（useIDBKeyval） | localStorage |
| ----------------- | ------------------------- | ------------ |
| 容量              | 非常大（几十MB+）         | 5MB 左右     |
| 异步              | ✔                         | ✘（阻塞）    |
| 存储复杂对象      | ✔（存任意结构/Blob）      | ✘（需 JSON） |
| Web Worker 可访问 | ✔                         | ✘            |
| 键值操作简洁      | ✔                         | ✔            |

因此若数据偏大或需持久化，优先 IndexedDB。

------

**适用场景总结**

✔ 大容量缓存（如搜索缓存、分页数据）
✔ 用户偏好/设置持久化
✔ 离线缓存（PWA）
✔ Web Worker 数据共享
✔ 存储 Blob（图片、文件缓存）

不适用于：

❌ 跨设备同步（需服务端支持）
❌ 安全敏感数据（应使用后端或加密）

------

**注意事项**

⚠ 写入操作是异步的，可结合按钮禁用状态
⚠ 数据结构变更需考虑迁移策略
⚠ 二进制数据（Blob/File）需注意序列化
⚠ 若需观察键变化，可配合 `useStorage` 或事件系统

------

## UI/交互与第三方库融合

------

### 二维码生成：`useQRCode`

`useQRCode` 基于 `qrcode` 库封装，可以将字符串内容生成 **二维码图片（Base64 DataURL）**。

适用于：

✔ 登录扫码（如 PC 扫手机登录）
✔ 支付二维码（微信、支付宝等）
✔ 分享链接转二维码
✔ 邀请码 / 推荐码
✔ 小程序打开链接跳转
✔ 设备绑定二维码

相比自己调用 `QRCode.toDataURL()`，`useQRCode` 支持：

✔ 自动生成 DataURL
✔ 响应式实时更新
✔ 支持宽高配置
✔ 支持纠错级别
✔ TypeScript 类型推断
✔ 可直接用于 `<img>` 渲染

------

**安装依赖**

```bash
pnpm add qrcode @vueuse/integrations
```

------

**基本示例：输入实时生成二维码**

```vue
<template>
  <div class="app">
    <h1>VueUse - useQRCode</h1>

    <input v-model="text" placeholder="输入任意文本..." />

    <div class="preview" v-if="qrcode">
      <img :src="qrcode" alt="二维码" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useQRCode } from '@vueuse/integrations/useQRCode'

const text = ref('https://vueuse.org')

// useQRCode 会根据响应式文本自动更新二维码
const qrcode = useQRCode(text, {
  width: 200,        // 宽度（可选）
  margin: 1,         // 边距（可选）
  errorCorrectionLevel: 'M', // 纠错等级：L / M / Q / H
})
</script>

<style scoped>
.app {
  padding: 24px;
  font-family: sans-serif;
}
input {
  padding: 6px 12px;
  margin-bottom: 12px;
}
.preview img {
  margin-top: 12px;
  border: 1px solid #eee;
}
</style>
```

特点：

✔ 输入实时更新二维码
✔ `qrcode` 是 DataURL，可直接放 `<img>`
✔ 无需手动调用 `toDataURL()`
✔ 无需手工销毁或回收

------

**自定义配置示例（纠错、颜色、边距）**

```ts
const qrcode = useQRCode(text, {
  width: 256,
  margin: 2,
  color: {
    dark: '#333333',   // 前景色
    light: '#FFFFFF',  // 背景色
  },
  errorCorrectionLevel: 'H', // 高纠错（二维码容错能力最强）
})
```

高纠错适用于需要嵌 logo 的二维码场景（如微信/支付宝海报）。

------

**转换成 Blob / 下载二维码**

DataURL 可转成 Blob 用于上传或下载：

```ts
async function download() {
  const res = await fetch(qrcode.value!)
  const blob = await res.blob()
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = 'qrcode.png'
  a.click()

  URL.revokeObjectURL(url)
}
```

适用于导出分享、打印、存档等业务。

------

**登录扫码（PC 登录 + 手机确认）**

```
<template>
  <h2>扫码登录</h2>
  <img :src="qrcode" />

  <p>状态：{{ status }}</p>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useQRCode } from '@vueuse/integrations/useQRCode'

// 后端返回的登录 token（通常 30~60 秒有效）
const loginToken = ref('login:session:9fa231')

const status = ref('等待扫码...')

// 二维码内容通常是一个短期有效 URL
const qrcode = useQRCode(
  () => `https://api.example.com/login/qr?token=${loginToken.value}`,
  { width: 180 }
)
</script>
```

业务真实感直接拉满，这是 useQRCode 最常见用法。

------

**分享链接 / 邀请注册**

```
<template>
  <input v-model="inviteCode" placeholder="邀请码" />
  <img :src="qrcode" />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useQRCode } from '@vueuse/integrations/useQRCode'

const inviteCode = ref('A8F2K9')

const inviteUrl = computed(() => {
  return `https://app.example.com/register?code=${inviteCode.value}`
})

const qrcode = useQRCode(inviteUrl, { width: 200 })
</script>
```

非常典型的 C 端业务场景。

------

**支付 / 收款二维码（金额 + 订单号）**

```
<template>
  <h2>请扫码支付</h2>
  <p>订单号：{{ orderId }}</p>
  <p>金额：￥{{ amount }}</p>
  <img :src="qrcode" />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useQRCode } from '@vueuse/integrations/useQRCode'

const orderId = ref('ORD20260112001')
const amount = ref(199.00)

// 实际中这个 URL 一定来自后端
const payUrl = computed(() => {
  return `https://pay.example.com/qr?order=${orderId.value}&amount=${amount.value}`
})

const qrcode = useQRCode(payUrl, {
  width: 220,
  errorCorrectionLevel: 'H',
})
</script>
```

这个例子基本就是“商业级示例”。

------

**WiFi 配网二维码（IoT 场景很常见）**

```
<template>
  <input v-model="ssid" placeholder="WiFi 名称" />
  <input v-model="password" placeholder="WiFi 密码" type="password" />
  <img :src="qrcode" />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useQRCode } from '@vueuse/integrations/useQRCode'

const ssid = ref('')
const password = ref('')

// WiFi 标准二维码格式
const wifiText = computed(() => {
  return `WIFI:T:WPA;S:${ssid.value};P:${password.value};;`
})

const qrcode = useQRCode(wifiText, { width: 200 })
</script>
```

这是硬件配网场景中最经典的二维码用法。

------

**名片二维码（vCard）**

```
<template>
  <h3>{{ name }}</h3>
  <img :src="qrcode" />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useQRCode } from '@vueuse/integrations/useQRCode'

const name = ref('Blair Tony')
const phone = ref('13800000000')
const email = ref('demo@example.com')

const vcard = computed(() => `
BEGIN:VCARD
VERSION:3.0
FN:${name.value}
TEL:${phone.value}
EMAIL:${email.value}
END:VCARD
`)

const qrcode = useQRCode(vcard, { width: 200 })
</script>
```

手机一扫即可保存联系人，非常实用。

------

**调试用：JSON 数据二维码**

```
<template>
  <textarea v-model="json" rows="4"></textarea>
  <img :src="qrcode" />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useQRCode } from '@vueuse/integrations/useQRCode'

const json = ref(JSON.stringify({ id: 1, role: 'admin' }, null, 2))

const qrcode = useQRCode(
  () => json.value,
  { width: 200 }
)
</script>
```

前后端联调时非常好用。

---

**二维码 Logo**

```vue
<template>
  <div class="qr-wrapper">
    <!-- 二维码 -->
    <img :src="qrcode" class="qr-img" />

    <!-- 中间 Logo -->
    <img src="https://dummyimage.com/100x100/1677ff/ffffff&text=DEV" class="qr-logo" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useQRCode } from '@vueuse/integrations/useQRCode'

const text = ref('https://vueuse.org')

/**
 * 叠 Logo 一定要用 H 级纠错
 * 否则很容易扫不出来
 */
const qrcode = useQRCode(text, {
  width: 240,
  errorCorrectionLevel: 'H',
  margin: 1,
})
</script>

<style scoped>
.qr-wrapper {
  position: relative;
  width: 240px;
  height: 240px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
}

.qr-img {
  width: 100%;
  height: 100%;
}

/* 中间 Logo 样式 */
.qr-logo {
  position: absolute;
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background: #fff;
  padding: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
</style>
```

------

### 焦点管理与键盘无障碍：`useFocusTrap`

`useFocusTrap` 基于 `focus-trap` 库封装，用于将键盘焦点限制在指定区域内，避免 Tab 键跳出弹窗/侧边栏等组件。

适用于：

✔ Modal 弹窗
✔ Drawer / Sidebar 侧边栏
✔ Popover / ContextMenu
✔ Command Palette（VSCode 风格）
✔ 企业后台的无障碍 A11y
✔ 军工/政府标书的 WCAG 要求

优势：

✔ Tab / Shift+Tab 焦点循环
✔ 响应式激活/关闭
✔ 与 Teleport 完美兼容
✔ 无需手写焦点管理逻辑
✔ TypeScript 完整类型推断

------

**安装依赖**

```bash
pnpm add focus-trap @vueuse/integrations
```

------

**基本示例：Modal 内 Tab 键焦点循环**

> 打开弹窗后，通过 `Tab` 键只能在弹窗内部循环切换焦点

```vue
<template>
  <div class="app">
    <h1>VueUse - useFocusTrap</h1>

    <button @click="open = true">打开弹窗</button>

    <Teleport to="body">
      <div v-if="open" class="overlay">
        <div class="modal" ref="modalRef" role="dialog" aria-modal="true">
          <h2>设置</h2>
          <input placeholder="请输入内容..." />
          <button @click="onConfirm">确认</button>
          <button @click="open = false">关闭</button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useFocusTrap } from '@vueuse/integrations/useFocusTrap'

const open = ref(false)
const modalRef = ref<HTMLElement | null>(null)

const { activate, deactivate } = useFocusTrap(modalRef)

watch(open, (show) => {
  if (show) activate()
  else deactivate()
})

function onConfirm() {
  alert('已确认')
}
</script>

<style scoped>
.app {
  padding: 24px;
  font-family: sans-serif;
}

.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  padding: 20px;
  width: 280px;
  background: #fff;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
```

特点：

✔ 局部焦点循环
✔ 不跳出弹窗区域
✔ 支持键盘无障碍操作
✔ 与 Teleport 兼容
✔ A11y 语义支持 (`role="dialog"` + `aria-modal="true"`)

------

**自动激活示例：侧边栏焦点锁定**

无需 `watch`，`immediate: true` 会在挂载后自动启用焦点锁定：

```vue
<template>
  <div class="app">
    <h1>侧边栏焦点锁定示例</h1>
    <button @click="open = true">打开侧栏</button>

    <Teleport to="body">
      <div v-if="open" class="drawer" ref="drawerRef">
        <h3>侧栏菜单</h3>
        <button>菜单1</button>
        <button>菜单2</button>
        <button @click="open = false">关闭</button>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useFocusTrap } from '@vueuse/integrations/useFocusTrap'

const open = ref(false)
const drawerRef = ref<HTMLElement | null>(null)

const { activate, deactivate } = useFocusTrap(drawerRef, {
  immediate: false, // 手动控制
})

watch(open, (show) => {
  if (show) activate()
  else deactivate()
})
</script>

<style scoped>
.app {
  padding: 24px;
  font-family: sans-serif;
}

.drawer {
  position: fixed;
  top: 0;
  right: 0;
  width: 220px;
  height: 100vh;
  padding: 20px;
  background: #fff;
  border-left: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
```

适用于抽屉、工具栏、导航菜单等侧边控件。

------

**典型业务场景**

✔ 弹窗组件库（Dialog）
✔ 抽屉侧栏（Drawer）
✔ 命令面板（Command Palette）
✔ 表单向导（Wizard）
✔ 弹出菜单（Popover/Menu）
✔ Web A11y + WCAG 无障碍项目

------

**注意事项**

⚠ 容器内必须有可聚焦元素（input/button/a 等）
⚠ Modal 关闭时记得调用 `deactivate()`
⚠ 企业项目建议带 A11y 属性（`role="dialog"`）
⚠ 与 `outline: none` 搭配需谨慎，否则用户看不到焦点

------

### Cookie 读写：`useCookies`

`useCookies` 基于 `universal-cookie` 封装，提供 **响应式的 Cookie 操作能力**，支持浏览器、SSR、多终端情况下的 Cookie 管理。

适用于：

✔ 登录 Token / Session
✔ 主题偏好（浅色/深色）
✔ 语言国际化（i18n locale）
✔ A/B 测试标记
✔ 用户记住选项
✔ SSR / CSR 通用存储

优势：

✔ 读写 Cookie
✔ 删除 Cookie
✔ 响应式更新
✔ 支持 options（domain、path、expires 等）
✔ SSR 同构兼容（Nuxt、Next）

------

**安装依赖**

```bash
pnpm add universal-cookie @vueuse/integrations
```

------

**基本示例：存 Token / 取 Token**

> 用户登录后写 Cookie，刷新页面仍保留

```vue
<template>
  <div class="app">
    <h1>VueUse - useCookies</h1>

    <button @click="setToken">设置 Token</button>
    <button @click="removeToken" :disabled="!token">删除 Token</button>

    <p>当前 Token：{{ token || '（无）' }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCookies } from '@vueuse/integrations/useCookies'

const cookies = useCookies()

const token = computed(() => cookies.get('token'))

function setToken() {
  cookies.set('token', 'ABC-123-XYZ', {
    path: '/',
    maxAge: 3600, // 1小时有效
  })
}

function removeToken() {
  cookies.remove('token', { path: '/' })
}
</script>

<style scoped>
.app {
  padding: 24px;
  font-family: sans-serif;
}
button { margin-right: 8px; }
</style>
```

特点：

✔ Cookie 响应式
✔ `cookies.get()` 自动触发重新渲染
✔ 可设置 `maxAge`、`path`、`domain`

------

**记住用户主题（dark / light）示例**

> 刷新页面也记得用户选择的主题

```vue
<template>
  <div class="app" :class="theme">
    <h1>主题切换（Cookie 记住设置）</h1>

    <button @click="switchTheme">切换主题</button>
    <p>当前主题：{{ theme }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useCookies } from '@vueuse/integrations/useCookies'

const cookies = useCookies()
const theme = ref(cookies.get('theme') || 'light')

watch(theme, (val) => {
  cookies.set('theme', val, { path: '/', maxAge: 7 * 86400 }) // 保存7天
})

function switchTheme() {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}
</script>

<style scoped>
.app {
  padding: 24px;
  font-family: sans-serif;
}
.dark {
  background: #222;
  color: #fff;
}
.light {
  background: #fff;
  color: #000;
}
</style>
```

特点：

✔ 刷新不丢失主题
✔ 更新自动同步 Cookie
✔ 对 UI 用户体验友好

------

**SSR / Nuxt 使用示例（服务端 + 客户端通用）**

> 可在 Nuxt / SSR 场景中读取 request 中的 Cookie

```ts
import { useCookies } from '@vueuse/integrations/useCookies'

export default defineNuxtPlugin((nuxtApp) => {
  const cookies = useCookies(nuxtApp.ssrContext?.event?.req?.headers.cookie)

  console.log('Server cookies:', cookies.get('token'))
})
```

特点：

✔ 服务器正确解析 Cookie
✔ 客户端保持响应式
✔ 多终端同构渲染一致

------

**Cookie 配置项说明**

常用配置：

| key        | 说明                    |
| ---------- | ----------------------- |
| `path`     | Cookie 生效路径         |
| `domain`   | 域名（跨子域时必需）    |
| `expires`  | 过期时间（Date 对象）   |
| `maxAge`   | 秒级有效期（Node 友好） |
| `secure`   | 是否仅 HTTPS 传输       |
| `sameSite` | 防跨站攻击策略          |

示例：

```ts
cookies.set('session', 'xxx', {
  path: '/',
  domain: '.example.com',
  secure: true,
  sameSite: 'strict',
})
```

------

**典型业务场景**

✔ Token / Session 保存
✔ 国际化语言（如：`locale=en-US`）
✔ 记住登录信息
✔ 用户偏好存储（主题/布局/习惯）
✔ A/B 测试流量标记（如：`bucket=test`）
✔ SaaS 多租户识别（`tenantId`）

------

**注意事项**

⚠ Cookie 不适合存放敏感信息（如明文密码）
⚠ Token 建议设置 `httpOnly + secure + sameSite`（后端写入更安全）
⚠ 使用域名共享 Cookie 时记得配置：`.example.com`
⚠ SSR 需从 request 解析 Cookie，否则为空

------

## 校验 / 加密 / 工具集成

------

### JWT 解析：`useJwt`

`useJwt` 用于解析 **JWT（JSON Web Token）**，支持从 `header.payload.signature` 格式中解出：

✔ header 信息（算法、类型等）
✔ payload 信息（用户信息 / 权限 / exp 等）
✔ 过期时间计算
✔ 响应式监听 token 变化

适用于：

✔ 前端 SSR/CSR 解析用户信息
✔ 显示用户角色/权限/名称
✔ 检查 token 是否过期
✔ Single Page App 客户端校验
✔ 阅读 `exp` / `iat` / `nbf` 字段

相比手写 `atob()` + `JSON.parse()`：

✔ 处理异常
✔ 类型提示
✔ 响应式更新
✔ 提供过期状态计算

------

**基本示例：解析 JWT Payload**

> 输入一个 JWT 自动解析出 claims 信息

```vue
<template>
  <div class="app">
    <h1>VueUse - useJwt</h1>

    <textarea
      v-model="token"
      placeholder="请输入 JWT Token..."
      rows="3"
    />

    <div class="card" v-if="payload">
      <h3>Payload</h3>
      <pre>{{ payload }}</pre>
    </div>

    <div class="card" v-if="header">
      <h3>Header</h3>
      <pre>{{ header }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useJwt } from '@vueuse/integrations/useJwt'

const token = ref('')

// useJwt 自动解析 header 和 payload
const { header, payload } = useJwt(token)

// 示例默认 Token，可删
token.value = [
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  'eyJ1c2VySWQiOjEyMywibmFtZSI6IkJvYiIsImV4cCI6MTk5OTk5OTk5OX0',
  'mW1xaD6kOA1wz3kHa4QKDOBykoFbqG1Gk2zVpIv2Q2E'
].join('.')
</script>

<style scoped>
.app {
  padding: 24px;
  font-family: sans-serif;
}
textarea {
  width: 100%;
  font-family: monospace;
  margin-bottom: 16px;
  padding: 8px;
}
.card {
  background: #f6f8fa;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 12px;
}
pre {
  margin: 0;
  white-space: pre-wrap;
}
</style>
```

特点：

✔ 解析 `header`/`payload`
✔ 输入响应式解析
✔ 支持粘贴真实 JWT

------

**判断 Token 是否过期**

JWT 标准字段：

```
exp = 过期时间戳（秒）
iat = 签发时间戳（秒）
nbf = 不早于某时间（秒）
```

完整示例：

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'
import { useJwt } from '@vueuse/integrations/useJwt'

const token = ref('...')
const { payload } = useJwt(token)

// 当前时间戳（秒）
const now = computed(() => Math.floor(Date.now() / 1000))

const isExpired = computed(() => {
  if (!payload.value?.exp) return false
  return payload.value.exp < now.value
})
</script>

<template>
  <p>
    Token 状态：
    <strong>{{ isExpired ? '已过期' : '有效' }}</strong>
  </p>
</template>
```

适用于：

✔ 前端拦截路由
✔ 刷新 Token 策略
✔ Token 显示状态

------

**完整示例：登录后显示用户名 + 权限**

```vue
<template>
  <div class="app">
    <h1>用户信息</h1>

    <p v-if="payload">
      用户名：{{ payload.name }} <br />
      用户ID：{{ payload.userId }} <br />
      权限：{{ payload.role }} <br />
      Token 状态：
      <strong>{{ isExpired ? '已过期' : '有效' }}</strong>
    </p>

    <button @click="logout">清除 Token</button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCookies } from '@vueuse/integrations/useCookies'
import { useJwt } from '@vueuse/integrations/useJwt'

const cookies = useCookies()
const token = ref(cookies.get<string>('token') || '')

const { payload } = useJwt(token)

const now = computed(() => Math.floor(Date.now() / 1000))
const isExpired = computed(() => payload.value?.exp && payload.value.exp < now.value)

function logout() {
  cookies.remove('token', { path: '/' })
  token.value = ''
}
</script>

<style scoped>
.app {
  padding: 24px;
  font-family: sans-serif;
}
strong {
  color: #67c23a;
}
</style>
```

适用于 SPA 登录态展示场景。

------

**TypeScript 支持**

可为 Payload 定义类型：

```ts
interface MyPayload {
  userId: number
  name: string
  role: string
  exp: number
}

const { payload } = useJwt<MyPayload>(token)

// payload.value 自动推断为 MyPayload
```

------

**典型业务场景**

✔ 显示用户信息（无需后端查询）
✔ 拦截路由（判断 `exp` 是否过期）
✔ 解析权限字段（role / scope）
✔ 解析签发时间（`iat`）
✔ GraphQL / OAuth2 token 解析
✔ SSR 读取 JWT 并 hydrate 客户端

------

**注意事项**

⚠ `useJwt` **不会验证签名，只负责解析**
⚠ 不要依赖前端 Token 做权限校验
⚠ 安全校验必须在后端进行
⚠ Token 涉敏字段不要放太多（避免泄漏）

------

### 进度条集成：`useNProgress`

`useNProgress` 用于展示页面顶部的 **加载进度条**，基于 `nprogress` 库封装，支持：

✔ 手动触发和结束
✔ 自动监听状态启动
✔ 路由跳转自动加载
✔ 响应式进度值
✔ 配合请求流程使用

适用于：

✔ SPA 路由切换提示
✔ 异步请求全局 Loading
✔ 页面初始化加载指示
✔ 长耗时任务进度提示

相比手写 `NProgress.start()` / `done()`：

✔ 更适合组合式 API
✔ 更易与响应式状态绑定
✔ 更易集成 router/useFetch/useAxios
✔ 更方便抽象请求拦截

------

**安装依赖**

```bash
pnpm add nprogress @vueuse/integrations
```

CSS 必须引入（比如在 `main.ts`）：

```ts
import 'nprogress/nprogress.css'
```

------

**基本示例：按钮触发进度条**

> 手动触发 `start()` / `done()` 模拟加载状态。

```vue
<template>
  <div class="app">
    <h1>VueUse - useNProgress</h1>

    <button @click="load">模拟加载 2 秒</button>

    <p v-if="isLoading">加载中...</p>
  </div>
</template>

<script setup lang="ts">
import { useNProgress } from '@vueuse/integrations/useNProgress'

const { isLoading, start, done } = useNProgress()

async function load() {
  start()
  await new Promise(resolve => setTimeout(resolve, 2000))
  done()
}
</script>

<style scoped>
.app {
  padding: 24px;
  font-family: sans-serif;
}
button {
  padding: 8px 16px;
}
</style>
```

特点：

✔ 顶部进度条自动显示
✔ 用户可手动控制时机
✔ 适用于任意异步流程

------

**路由自动集成示例**（SPA 最常见）

> 切换路由时自动展示页面加载进度条。

`main.ts`：

```ts
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { useNProgress } from '@vueuse/integrations/useNProgress'
import 'nprogress/nprogress.css'

const app = createApp(App)
const { isLoading, start, done } = useNProgress()

router.beforeEach((_to, _from, next) => {
  start()
  next()
})

router.afterEach(() => {
  done()
})

app.use(router).mount('#app')
```

适用于：

✔ 多页面内容切换提示
✔ SEO 友好的 SSR/SPA 混合场景
✔ 异步路由组件加载

------

**与 Axios 配合示例**

> 将 NProgress 封装在 Axios 请求拦截器中。

```ts
import axios from 'axios'
import { useNProgress } from '@vueuse/integrations/useNProgress'

const { isLoading, start, done } = useNProgress()

const http = axios.create()

http.interceptors.request.use((config) => {
  start()
  return config
})

http.interceptors.response.use(
  (res) => {
    done()
    return res
  },
  (err) => {
    done()
    return Promise.reject(err)
  }
)

export default http
```

适用于：

✔ 抽象成全局 HTTP Loading
✔ 替代 Element Plus 的 LoadingBar
✔ 更轻量的进度条方案

------

**TypeScript 支持**

`progress` 暴露实时数值：

```ts
const { progress } = useNProgress()
// progress -> Ref<number>
```

可用于自定义进度条组件，比如顶部细条或圆形加载。

------

**典型业务场景**

✔ SPA 路由切换过渡动画
✔ 文件上传/下载进度展示
✔ 长耗时任务可视化
✔ 数据报表加载提示
✔ 表单提交 loading
✔ 全局异步统一 LoadingBar

------

**注意事项**

⚠ `useNProgress` 默认是全局单例效果
⚠ CSS 必须加载，否则看不到效果
⚠ 建议 SSR 场景中关闭路由进度条
⚠ 闪烁问题可通过 `NProgress.configure` 优化

------

### 拖拽排序集成：`useSortable`

`useSortable` 基于 **SortableJS** 封装，可让列表具备：

✔ 拖拽移动
✔ 排序重排
✔ 动画过渡
✔ 支持触摸屏
✔ 支持组之间拖拽（跨容器）
✔ 响应式数据绑定
✔ TypeScript 类型支持

适用于：

✔ 表格拖拽排序
✔ 看板（Trello/Jira 风格）
✔ 文件列表排序
✔ 菜单编辑器
✔ 可视化页面布局拖拽

相比自己手动用 SortableJS：

✔ 响应式绑定 `items`
✔ Vue 生命周期自动注册/解绑
✔ 类型约束更安全
✔ 更少样板代码

------

**安装依赖**

```bash
pnpm add sortablejs @vueuse/integrations
```

------

**基本示例：拖拽排序数组**

> 拖拽列表项后，数组会自动重新排序。

```vue
<template>
  <div class="app">
    <h1>VueUse - useSortable</h1>

    <ul ref="listRef">
      <li
          v-for="item in items"
          :key="item"
          class="list-item"
      >
        {{ item }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useSortable } from '@vueuse/integrations/useSortable'

const items = ref(['Vue', 'React', 'Svelte', 'Solid', 'Angular'])
const listRef = ref<HTMLElement | null>(null)

// useSortable 自动同步 items 顺序
useSortable(listRef, items, { animation: 150 })
</script>

<style scoped>
.app {
  padding: 24px;
  font-family: sans-serif;
}
ul {
  list-style: none;
  padding: 0;
  width: 200px;
}
.list-item {
  padding: 8px 12px;
  border: 1px solid #ddd;
  margin-bottom: 6px;
  background: #fafafa;
  cursor: move;
}
</style>
```

特点：

✔ 实时更新数据
✔ 自动排序同步
✔ 零手写逻辑
✔ 支持键盘/触摸拖拽

------

**高级示例：跨容器拖拽（看板风格）**

> `group` 设置允许多个区域拖拽互相放置。

```vue
<template>
  <div class="board">
    <div class="col">
      <h3>Todo</h3>
      <ul ref="todoRef">
        <li v-for="t in todos" :key="t">{{ t }}</li>
      </ul>
    </div>

    <div class="col">
      <h3>Done</h3>
      <ul ref="doneRef">
        <li v-for="d in dones" :key="d">{{ d }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useSortable } from '@vueuse/integrations/useSortable'

const todos = ref(['Task A', 'Task B', 'Task C'])
const dones = ref(['Task D'])

const todoRef = ref<HTMLElement | null>(null)
const doneRef = ref<HTMLElement | null>(null)

useSortable(todoRef, todos, {
  group: 'tasks',
  animation: 150,
})
useSortable(doneRef, dones, {
  group: 'tasks',
  animation: 150,
})
</script>

<style scoped>
.board {
  display: flex;
  gap: 24px;
  padding: 24px;
}
.col ul {
  list-style: none;
  padding: 0;
  width: 160px;
  min-height: 150px;
  border: 1px dashed #ddd;
}
li {
  background: #fafafa;
  border: 1px solid #ccc;
  padding: 6px;
  margin: 4px;
  cursor: move;
}
</style>
```

适用于：

✔ Trello/Jira 样式看板
✔ 拖拽状态流转
✔ 表单字段分组移动

------

示例：自定义拖拽句柄（handle）

> 只允许按住指定按钮拖拽，避免误触。

```vue
<template>
  <ul ref="listRef">
    <li v-for="user in users" :key="user.id" class="user-item">
      <span>{{ user.name }}</span>
      <button class="handle">拖拽</button>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useSortable } from '@vueuse/integrations/useSortable'

const users = ref([
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 3, name: 'Eve' },
])

const listRef = ref<HTMLElement | null>(null)

useSortable(listRef, users, {
  handle: '.handle', // 只允许拖拽按钮区域
  animation: 150
})
</script>

<style scoped>
.user-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px;
  background: #fff;
  border: 1px solid #ccc;
  margin-bottom: 4px;
}
.handle {
  cursor: grab;
}
</style>
```

------

回调监听示例

> 监听排序变化，用于保存后端或日志。

```ts
useSortable(listRef, items, {
  animation: 150,
  onEnd(evt) {
    console.log('拖拽结束：', evt.oldIndex, '->', evt.newIndex)
  },
})
```

典型场景：

✔ 保存排序到后端
✔ 上传素材排序
✔ 表格自定义列顺序

------

TypeScript 支持

可为数组定义类型：

```ts
interface Task {
  id: number
  title: string
}

const tasks = ref<Task[]>([])

useSortable(listRef, tasks)
```

------

典型业务场景

✔ CMS 模板拖拽排序
✔ 看板任务管理（Trello/Jira）
✔ 文件排序、菜单排序
✔ 页面组件拖拽布局
✔ 表单字段可视化编辑
✔ 电商后台商品排序
✔ Node/树形结构可视化

------

注意事项

⚠ `useSortable` 会修改原数组顺序
⚠ 每个容器必须有唯一 ref
⚠ 跨容器需设置 `group`
⚠ 若与虚拟滚动结合需注意 DOM 同步
⚠ SortableJS 不处理数据校验（需自行处理）

------

