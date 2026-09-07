# Pinia

## Pinia 概述

Pinia 是 Vue 官方推荐的状态管理库，主要用于 Vue3 项目中的全局状态管理。它可以将多个组件、多个页面之间需要共享的数据集中维护，避免通过多层 `props`、`emit` 或事件总线传递状态。

在 Vue3 项目中，Pinia 通常与组合式 API、TypeScript、Vue Router、Axios 等技术配合使用，用于管理用户信息、登录状态、权限菜单、系统配置、字典数据、业务缓存等全局状态。

### Pinia 的定位

Pinia 的定位是 Vue 应用中的轻量级全局状态管理方案。它主要解决组件之间状态共享、状态修改、业务逻辑复用和数据缓存的问题。

在普通组件中，状态通常通过 `ref`、`reactive` 定义。这类状态只适合当前组件内部使用。如果多个组件都需要访问同一份数据，例如用户信息、权限按钮、系统主题、菜单列表等，就需要将这些数据提升到全局状态中统一管理。

Pinia 通过 Store 管理状态。一个 Store 通常对应一个业务模块，例如用户模块、权限模块、字典模块、标签页模块等。每个 Store 内部可以包含状态数据、派生状态和业务方法。

Pinia 中常见的组成部分如下：

| 组成部分  | 说明                                           |
| --------- | ---------------------------------------------- |
| `state`   | 用于定义 Store 中维护的状态数据                |
| `getters` | 用于基于 `state` 计算派生数据，类似 `computed` |
| `actions` | 用于封装业务方法、接口请求和状态修改逻辑       |

在项目中使用 Pinia 时，需要注意它不是用来替代所有组件状态的。只有具备跨组件共享、跨页面复用、统一维护或本地持久化需求的状态，才适合放入 Pinia。

例如，当前页面表单中的临时输入值可以放在组件内部；而当前登录用户信息、系统菜单、按钮权限等数据更适合放在 Pinia 中统一管理。

### Pinia 与 Vuex 的区别

Vuex 是 Vue2 时代常用的状态管理方案，Pinia 是面向 Vue3 设计的状态管理库。两者都可以用于管理全局状态，但 Pinia 的 API 更简洁，对 TypeScript 和组合式 API 的支持也更自然。

| 对比项          | Vuex                                                  | Pinia                                |
| --------------- | ----------------------------------------------------- | ------------------------------------ |
| 适用生态        | 主要用于 Vue2，也支持 Vue3                            | 主要用于 Vue3                        |
| 官方推荐        | 旧版状态管理方案                                      | Vue 当前推荐的状态管理方案           |
| 核心概念        | `state`、`getters`、`mutations`、`actions`、`modules` | `state`、`getters`、`actions`        |
| 状态修改        | 通常通过 `mutation` 修改状态                          | 可以直接在 `action` 或组件中修改状态 |
| 模块化方式      | 通过 `modules` 配置模块                               | 每个 Store 天然就是独立模块          |
| TypeScript 支持 | 类型推导相对复杂                                      | 类型推导更自然                       |
| 代码复杂度      | 模板代码较多                                          | 写法更轻量                           |
| 组合式 API 适配 | 使用体验一般                                          | 与 `setup` 语法配合更直接            |

Pinia 相比 Vuex 最大的区别是取消了 `mutation`。在 Vuex 中，修改状态通常需要通过 `commit` 调用 `mutation`；如果是异步操作，还需要先通过 `dispatch` 调用 `action`，再由 `action` 提交 `mutation`。

Pinia 中没有 `mutation`，可以直接在 `actions` 中修改状态，也可以在组件中直接修改 Store 暴露出来的状态。这种方式减少了模板代码，使状态管理逻辑更加直观。

Vuex 的模块化依赖 `modules` 配置，复杂项目中还需要处理命名空间问题。Pinia 的模块化更加自然，一个 `defineStore` 就是一个独立 Store，只需要按照业务模块拆分文件即可。

在新建 Vue3 项目时，通常优先选择 Pinia。只有在维护老项目、项目仍然基于 Vue2，或者团队已有大量 Vuex 代码时，才需要继续使用 Vuex。

### 适用场景

Pinia 适合用于管理需要在多个组件、多个页面或多个业务流程之间共享的状态。它的核心价值是让全局状态有统一的来源、统一的修改方式和清晰的模块边界。

常见适用场景如下：

| 场景             | 说明                                           |
| ---------------- | ---------------------------------------------- |
| 用户登录状态     | 保存 `token`、用户信息、登录状态、退出登录逻辑 |
| 权限与菜单       | 保存角色权限、按钮权限、动态路由、侧边栏菜单   |
| 系统配置         | 保存主题、语言、布局模式、页面缓存配置         |
| 字典数据         | 缓存状态、类型、分类等通用字典，减少重复请求   |
| 业务缓存         | 缓存查询条件、分页参数、列表数据、详情数据     |
| 多组件通信       | 多个无直接父子关系的组件共享同一份状态         |
| 购物车或订单草稿 | 管理跨页面操作过程中的临时业务数据             |
| 标签页管理       | 管理后台系统中的多标签页、页面缓存和访问记录   |

在后台管理系统中，Pinia 常用于管理用户、权限、菜单、路由、字典、主题、标签页等模块。在业务型前端项目中，也可以用于管理订单流程、表单草稿、购物车、消息数量、业务筛选条件等状态。

不建议放入 Pinia 的状态如下：

1. 只在当前组件内部使用的表单字段。
2. 只影响当前弹窗或当前局部区域的临时状态。
3. 可以通过 `props` 简单传递的数据。
4. 不需要跨页面共享的数据。
5. 不需要缓存、不需要持久化、不需要统一维护的数据。

判断一个状态是否应该放入 Pinia，可以参考以下几个问题：

1. 这个状态是否会被多个组件使用？
2. 这个状态是否需要跨页面保留？
3. 这个状态是否和用户、权限、菜单、配置等全局业务有关？
4. 这个状态是否需要配合接口请求统一维护？
5. 这个状态是否需要持久化到本地存储？

如果多数答案是“是”，可以考虑使用 Pinia 管理。如果多数答案是“否”，则优先将状态保留在组件内部，避免 Store 过度膨胀。



## 环境准备

本节用于完成 Pinia 在 Vue3 项目中的基础接入，包括依赖安装、入口文件初始化，以及 Store 目录结构规划。环境准备完成后，后续页面组件就可以直接创建和使用 Store。

### 项目依赖安装

在 Vue3 项目中使用 Pinia，需要先安装 `pinia` 依赖。如果项目使用 TypeScript，Pinia 本身已经提供良好的类型支持，不需要额外安装类型声明包。

在项目根目录执行以下命令安装依赖。

```bash
# 使用 pnpm 安装
pnpm add pinia

# 使用 npm 安装
npm install pinia

# 使用 yarn 安装
yarn add pinia
```

如果项目还需要状态持久化，可以后续再安装 `pinia-plugin-persistedstate`。基础使用阶段只需要安装 `pinia` 即可。

安装完成后，可以在 `package.json` 中确认依赖是否存在。

```json
{
  "dependencies": {
    "pinia": "^2.1.7",
    "vue": "^3.4.0"
  }
}
```

实际版本号以项目安装结果为准，不需要强制和示例保持一致。对于新项目，建议使用当前稳定版本的 Vue3 和 Pinia。

### Pinia 初始化配置

Pinia 需要在 Vue 应用入口中创建实例，并通过 `app.use()` 注册到 Vue 应用中。通常配置位置为 `src/main.ts`。

文件位置：`src/main.ts`

```typescript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

const app = createApp(App)

// 创建 Pinia 实例
const pinia = createPinia()

// 注册 Pinia
app.use(pinia)

// 注册路由
app.use(router)

app.mount('#app')
```

如果项目规模较大，也可以将 Pinia 实例单独抽离到 `src/stores/index.ts` 中，避免入口文件配置过多。

文件位置：`src/stores/index.ts`

```typescript
import { createPinia } from 'pinia'

// 统一创建 Pinia 实例，后续可以在这里挂载插件
const pinia = createPinia()

export default pinia
```

然后在入口文件中直接引入。

文件位置：`src/main.ts`

```typescript
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from './stores'

const app = createApp(App)

app.use(pinia)
app.use(router)

app.mount('#app')
```

这种方式更适合中大型项目。后续如果需要配置持久化插件、日志插件或自定义 Pinia 插件，只需要在 `src/stores/index.ts` 中统一处理。

### Store 目录结构规划

Store 目录建议按照业务模块拆分，避免所有状态都写在一个文件中。每个 Store 文件只维护一个明确的业务领域，例如用户、权限、菜单、字典、标签页等。

推荐目录结构如下。

```text
src
├── stores
│   ├── index.ts
│   ├── modules
│   │   ├── user.ts
│   │   ├── permission.ts
│   │   ├── menu.ts
│   │   ├── dict.ts
│   │   └── tab.ts
│   └── types
│       ├── user.ts
│       └── menu.ts
```

各目录和文件的作用如下。

| 路径                               | 说明                               |
| ---------------------------------- | ---------------------------------- |
| `src/stores/index.ts`              | 创建并导出 Pinia 实例              |
| `src/stores/modules`               | 存放业务 Store 模块                |
| `src/stores/modules/user.ts`       | 用户登录态、用户信息、token 等状态 |
| `src/stores/modules/permission.ts` | 权限、角色、按钮权限等状态         |
| `src/stores/modules/menu.ts`       | 菜单、动态路由等状态               |
| `src/stores/types`                 | 存放 Store 相关 TypeScript 类型    |

Store 文件命名建议使用业务名，例如 `user.ts`、`permission.ts`、`dict.ts`。Store 的导出方法建议使用 `useXxxStore` 命名，例如 `useUserStore`、`usePermissionStore`，这样在组件中使用时语义更清晰。

## Store 基础使用

Store 是 Pinia 中管理状态的核心单元。一个 Store 通常包含 `state`、`getters` 和 `actions` 三部分，分别用于定义状态、派生状态和业务方法。

### 定义 Store

Pinia 通过 `defineStore()` 定义 Store。常见写法有两种：选项式写法和组合式写法。

选项式写法结构清晰，适合大多数业务模块。

文件位置：`src/stores/modules/user.ts`

```typescript
import { defineStore } from 'pinia'

interface UserInfo {
  id: number
  username: string
  nickname: string
  roles: string[]
}

interface UserState {
  token: string
  userInfo: UserInfo | null
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    token: '',
    userInfo: null
  }),

  getters: {
    isLogin: (state) => Boolean(state.token),
    nickname: (state) => state.userInfo?.nickname || '未登录用户'
  },

  actions: {
    setToken(token: string) {
      this.token = token
    },

    setUserInfo(userInfo: UserInfo) {
      this.userInfo = userInfo
    },

    logout() {
      this.token = ''
      this.userInfo = null
    }
  }
})
```

`defineStore()` 的第一个参数是 Store 的唯一标识，通常使用业务模块名。这个标识会显示在 Vue DevTools 中，也会被持久化插件用作存储 key 的一部分。

组合式写法更接近 Vue3 的 `setup()` 风格，适合需要大量使用 `ref`、`computed` 或复用组合式函数的场景。

文件位置：`src/stores/modules/counter.ts`

```typescript
import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)

  const doubleCount = computed(() => count.value * 2)

  const increment = () => {
    count.value++
  }

  const reset = () => {
    count.value = 0
  }

  return {
    count,
    doubleCount,
    increment,
    reset
  }
})
```

在后台管理系统或业务系统中，选项式写法更容易统一团队规范；在偏组合式封装的项目中，也可以使用组合式写法。两种方式可以共存，但同一个项目内建议保持风格统一。

### State 状态定义

`state` 用于定义 Store 中需要维护的数据。它必须是一个返回对象的函数，这样可以保证每个应用实例都有独立的状态对象，避免状态污染。

文件位置：`src/stores/modules/user.ts`

```typescript
import { defineStore } from 'pinia'

interface UserInfo {
  id: number
  username: string
  nickname: string
  avatar?: string
}

interface UserState {
  token: string
  userInfo: UserInfo | null
  permissions: string[]
  loading: boolean
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    token: '',
    userInfo: null,
    permissions: [],
    loading: false
  })
})
```

`state` 中的数据应当是当前 Store 负责维护的业务状态，不建议把所有页面状态都放到同一个 Store 中。

例如，用户 Store 可以维护 `token`、`userInfo`、`permissions`；菜单 Store 可以维护 `menus`、`activeMenu`、`collapse`；字典 Store 可以维护 `dictMap`、`loadedKeys` 等。

状态设计时需要注意以下几点：

| 规则             | 说明                                        |
| ---------------- | ------------------------------------------- |
| 状态名称语义清晰 | 例如 `token`、`userInfo`、`permissions`     |
| 避免无关状态混放 | 用户状态不要和菜单状态写在同一个 Store      |
| 初始值类型稳定   | 字符串用 `''`，数组用 `[]`，对象可用 `null` |
| 复杂对象定义类型 | 使用 `interface` 或 `type` 约束状态结构     |
| 不存放纯临时状态 | 单个组件内部使用的数据优先放在组件中        |

### Getter 派生状态

`getters` 用于根据 `state` 计算派生状态，作用类似组件中的 `computed`。当依赖的状态发生变化时，getter 会自动重新计算。

文件位置：`src/stores/modules/user.ts`

```typescript
import { defineStore } from 'pinia'

interface UserInfo {
  id: number
  username: string
  nickname: string
  roles: string[]
}

interface UserState {
  token: string
  userInfo: UserInfo | null
  permissions: string[]
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    token: '',
    userInfo: null,
    permissions: []
  }),

  getters: {
    isLogin: (state) => Boolean(state.token),

    nickname: (state) => state.userInfo?.nickname || '未登录用户',

    roleNames: (state) => state.userInfo?.roles.join(',') || '',

    hasPermission: (state) => {
      return (permission: string) => state.permissions.includes(permission)
    }
  }
})
```

普通 getter 可以直接返回计算结果；如果 getter 需要接收参数，可以返回一个函数。例如 `hasPermission` 可以根据传入的权限标识判断当前用户是否拥有权限。

组件中使用 getter 时，写法和读取普通状态类似。

```typescript
const userStore = useUserStore()

console.log(userStore.isLogin)
console.log(userStore.nickname)
console.log(userStore.hasPermission('system:user:add'))
```

Getter 适合处理以下逻辑：

| 场景         | 示例                         |
| ------------ | ---------------------------- |
| 登录状态判断 | 根据 `token` 判断是否登录    |
| 展示字段兜底 | 用户昵称为空时显示默认名称   |
| 数据格式转换 | 将角色数组转换成字符串       |
| 权限判断     | 根据权限数组判断按钮是否可见 |
| 统计计算     | 根据列表数据计算数量或金额   |

不建议在 getter 中执行接口请求、修改状态或编写复杂副作用逻辑。Getter 应保持为基于状态的派生计算。

### Action 业务方法

`actions` 用于封装业务方法，可以同步修改状态，也可以执行异步接口请求。它通常用于登录、退出、获取用户信息、刷新权限、加载字典等业务操作。

文件位置：`src/stores/modules/user.ts`

```typescript
import { defineStore } from 'pinia'

interface LoginParams {
  username: string
  password: string
}

interface UserInfo {
  id: number
  username: string
  nickname: string
  roles: string[]
}

interface UserState {
  token: string
  userInfo: UserInfo | null
  loading: boolean
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    token: '',
    userInfo: null,
    loading: false
  }),

  actions: {
    async login(params: LoginParams) {
      this.loading = true

      try {
        // 示例中使用模拟数据，实际项目中应替换为登录接口
        const token = `mock-token-${params.username}`

        this.token = token
        return token
      } finally {
        this.loading = false
      }
    },

    async loadUserInfo() {
      this.loading = true

      try {
        // 示例中使用模拟数据，实际项目中应替换为用户信息接口
        this.userInfo = {
          id: 1,
          username: 'admin',
          nickname: '管理员',
          roles: ['admin']
        }

        return this.userInfo
      } finally {
        this.loading = false
      }
    },

    logout() {
      this.token = ''
      this.userInfo = null
    }
  }
})
```

在实际项目中，`actions` 通常会调用封装好的 API 方法。

文件位置：`src/api/user.ts`

```typescript
import request from '@/utils/request'

export interface LoginParams {
  username: string
  password: string
}

export interface LoginResult {
  token: string
}

export interface UserInfo {
  id: number
  username: string
  nickname: string
  roles: string[]
}

export const loginApi = (data: LoginParams) => {
  return request.post<LoginResult>('/auth/login', data)
}

export const getUserInfoApi = () => {
  return request.get<UserInfo>('/auth/user-info')
}
```

Store 中调用接口并维护状态。

文件位置：`src/stores/modules/user.ts`

```typescript
import { defineStore } from 'pinia'
import { getUserInfoApi, loginApi, type LoginParams, type UserInfo } from '@/api/user'

interface UserState {
  token: string
  userInfo: UserInfo | null
  loading: boolean
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    token: '',
    userInfo: null,
    loading: false
  }),

  actions: {
    async login(params: LoginParams) {
      this.loading = true

      try {
        const res = await loginApi(params)
        this.token = res.data.token
        return this.token
      } finally {
        this.loading = false
      }
    },

    async loadUserInfo() {
      this.loading = true

      try {
        const res = await getUserInfoApi()
        this.userInfo = res.data
        return this.userInfo
      } finally {
        this.loading = false
      }
    },

    logout() {
      this.token = ''
      this.userInfo = null
    }
  }
})
```

Action 中可以直接通过 `this` 访问和修改当前 Store 的状态。与 Vuex 不同，Pinia 不需要通过 `commit` 提交 mutation。

Action 适合承载以下逻辑：

| 场景     | 说明                                   |
| -------- | -------------------------------------- |
| 修改状态 | 设置 token、清空用户信息、更新菜单     |
| 接口请求 | 登录、获取用户信息、加载字典           |
| 业务编排 | 登录后保存 token，再加载用户信息和权限 |
| 状态重置 | 退出登录时清空 Store                   |
| 异常处理 | 请求失败后恢复 loading 或清理无效状态  |

## 组件中使用 Store

Store 定义完成后，可以在 Vue 组件中通过 `useXxxStore()` 使用。组件中既可以读取 Store 状态，也可以调用 action 修改状态或执行业务逻辑。

### 在组合式 API 中使用

在 Vue3 项目中，推荐在 `setup` 或 `<script setup>` 中使用 Store。`<script setup>` 写法更简洁，是当前 Vue3 项目中常用的写法。

文件位置：`src/views/user/UserInfo.vue`

```vue
<template>
  <div class="p-4">
    <h2 class="text-lg font-bold">用户信息</h2>

    <div class="mt-4">
      <p>登录状态：{{ userStore.isLogin ? '已登录' : '未登录' }}</p>
      <p>用户昵称：{{ userStore.nickname }}</p>
    </div>

    <div class="mt-4 flex gap-2">
      <el-button type="primary" @click="handleLoadUserInfo">
        加载用户信息
      </el-button>

      <el-button type="danger" @click="handleLogout">
        退出登录
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/modules/user'

const userStore = useUserStore()

const handleLoadUserInfo = async () => {
  await userStore.loadUserInfo()
}

const handleLogout = () => {
  userStore.logout()
}
</script>
```

在组件中调用 `useUserStore()` 后，就可以直接访问 Store 中的 `state`、`getters` 和 `actions`。

例如：

| 写法                      | 说明        |
| ------------------------- | ----------- |
| `userStore.token`         | 读取 state  |
| `userStore.isLogin`       | 读取 getter |
| `userStore.login(params)` | 调用 action |
| `userStore.logout()`      | 调用 action |

### 状态读取与修改

Pinia 允许在组件中直接读取和修改 Store 状态。对于简单状态，可以直接赋值；对于复杂业务逻辑，建议通过 action 修改，保持业务规则集中。

直接修改状态的示例如下。

文件位置：`src/views/demo/TokenDemo.vue`

```vue
<template>
  <div class="p-4">
    <el-input v-model="userStore.token" placeholder="请输入 token" />

    <div class="mt-4">
      当前 token：{{ userStore.token }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/modules/user'

const userStore = useUserStore()
</script>
```

这种方式适合简单状态修改。但如果修改状态时需要同时处理接口请求、校验、缓存、跳转等逻辑，建议封装到 action 中。

通过 action 修改状态的示例如下。

文件位置：`src/views/login/LoginPage.vue`

```vue
<template>
  <div class="p-4">
    <el-form>
      <el-form-item label="用户名">
        <el-input v-model="form.username" />
      </el-form-item>

      <el-form-item label="密码">
        <el-input v-model="form.password" type="password" show-password />
      </el-form-item>

      <el-button type="primary" :loading="userStore.loading" @click="handleLogin">
        登录
      </el-button>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/modules/user'

const router = useRouter()
const userStore = useUserStore()

const form = reactive({
  username: '',
  password: ''
})

const handleLogin = async () => {
  if (!form.username || !form.password) {
    ElMessage.warning('请输入用户名和密码')
    return
  }

  await userStore.login({
    username: form.username,
    password: form.password
  })

  ElMessage.success('登录成功')
  await router.push('/')
}
</script>
```

在项目实践中，推荐遵循以下原则：

| 修改方式               | 适用场景                                     |
| ---------------------- | -------------------------------------------- |
| 组件中直接赋值         | 简单字段、临时开关、无额外业务规则           |
| 通过 action 修改       | 登录、退出、接口请求、权限变更、复杂业务状态 |
| 通过 `$patch` 批量修改 | 一次性更新多个状态字段                       |
| 通过 `$reset` 重置状态 | 将 Store 恢复到初始状态                      |

批量修改状态可以使用 `$patch()`。

```typescript
const userStore = useUserStore()

userStore.$patch({
  token: 'new-token',
  userInfo: {
    id: 1,
    username: 'admin',
    nickname: '管理员',
    roles: ['admin']
  }
})
```

如果使用选项式 Store，Pinia 默认支持 `$reset()` 重置状态。

```typescript
const userStore = useUserStore()

userStore.$reset()
```

### 解构 Store 的注意事项

在 Vue 组件中使用 Store 时，需要注意不要直接解构 Store 中的 state 和 getters，否则可能会丢失响应式。

错误示例如下。

```typescript
const userStore = useUserStore()

// 不推荐：直接解构会破坏响应式
const { token, userInfo, isLogin } = userStore
```

这样写得到的 `token`、`userInfo`、`isLogin` 只是普通变量，不会随着 Store 状态变化自动更新视图。

推荐写法是直接通过 Store 对象访问。

```typescript
const userStore = useUserStore()

console.log(userStore.token)
console.log(userStore.userInfo)
console.log(userStore.isLogin)
```

如果确实需要解构状态和 getter，应该使用 `storeToRefs()`。

```typescript
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/modules/user'

const userStore = useUserStore()

const { token, userInfo, isLogin } = storeToRefs(userStore)
```

需要注意，`storeToRefs()` 只适用于 state、getters 和插件添加的响应式属性。Action 不需要使用 `storeToRefs()`，可以直接从 Store 中解构。

```typescript
const userStore = useUserStore()

const { login, logout } = userStore
```

也可以结合使用。

```typescript
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/modules/user'

const userStore = useUserStore()

const { token, userInfo, isLogin } = storeToRefs(userStore)
const { login, logout } = userStore
```

这是一种常见写法：状态和 getter 使用 `storeToRefs()` 保持响应式，方法直接从 Store 对象中解构。

### storeToRefs 的使用

`storeToRefs()` 用于将 Store 中的 state 和 getters 转换成响应式 `ref`。它的主要作用是在解构 Store 时保留响应式。

文件位置：`src/views/user/UserProfile.vue`

```vue
<template>
  <div class="p-4">
    <h2 class="text-lg font-bold">个人中心</h2>

    <div class="mt-4">
      <p>登录状态：{{ isLogin ? '已登录' : '未登录' }}</p>
      <p>用户昵称：{{ nickname }}</p>
      <p>Token：{{ token }}</p>
    </div>

    <el-button class="mt-4" type="primary" @click="handleLoadUserInfo">
      刷新用户信息
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/modules/user'

const userStore = useUserStore()

// state 和 getters 使用 storeToRefs 保持响应式
const { token, isLogin, nickname } = storeToRefs(userStore)

// actions 可以直接解构
const { loadUserInfo } = userStore

const handleLoadUserInfo = async () => {
  await loadUserInfo()
}
</script>
```

使用 `storeToRefs()` 后，在 `<script setup>` 中访问这些变量时需要按照 `ref` 的方式处理；在模板中 Vue 会自动解包，所以可以直接使用。

例如在脚本中：

```typescript
console.log(token.value)
console.log(isLogin.value)
```

在模板中：

```vue
<p>{{ token }}</p>
<p>{{ isLogin }}</p>
```

`storeToRefs()` 常用于以下场景：

| 场景                       | 说明                       |
| -------------------------- | -------------------------- |
| 模板中需要频繁使用多个状态 | 避免反复写 `userStore.xxx` |
| 需要解构 Store 状态        | 保留响应式                 |
| 状态需要传给组合式函数     | 以 `ref` 形式传递更方便    |
| getter 需要保持响应式      | getter 转换后仍会自动更新  |

实际开发中建议采用以下规范：

1. 少量状态时，可以直接使用 `userStore.xxx`。
2. 多个状态需要在模板中展示时，使用 `storeToRefs()`。
3. Action 不需要使用 `storeToRefs()`。
4. 不要直接从 Store 中解构 state 和 getters。
5. 组件中复杂业务逻辑优先调用 Store 的 action，而不是在组件中大量修改状态。



## 模块化 Store 设计

模块化 Store 设计用于解决项目规模变大后状态集中堆积的问题。合理的模块拆分可以让每个 Store 只负责一个明确的业务领域，降低维护成本，也方便多人协作开发。

Pinia 官方建议可以定义多个 Store，并且每个 Store 单独放在不同文件中，这样可以获得更好的类型推导和更清晰的模块边界。`defineStore()` 的第一个参数是 Store 的唯一标识，通常也会用于 DevTools 识别 Store。([Pinia](https://pinia.vuejs.org/core-concepts/))

### 按业务模块拆分 Store

Store 应该按照业务职责拆分，而不是按照页面数量拆分。一个 Store 应该维护一类相关状态，例如用户、权限、菜单、字典、标签页、系统配置等。

推荐目录结构如下：

```text
src
├── stores
│   ├── index.ts
│   ├── modules
│   │   ├── user.ts
│   │   ├── permission.ts
│   │   ├── menu.ts
│   │   ├── dict.ts
│   │   ├── tab.ts
│   │   └── app.ts
│   └── types
│       ├── user.ts
│       ├── permission.ts
│       ├── menu.ts
│       └── dict.ts
```

各模块职责建议如下：

| Store 文件      | 主要职责                                   |
| --------------- | ------------------------------------------ |
| `user.ts`       | 管理 `token`、用户信息、登录状态、退出登录 |
| `permission.ts` | 管理角色权限、按钮权限、权限标识           |
| `menu.ts`       | 管理菜单列表、动态路由、当前激活菜单       |
| `dict.ts`       | 管理系统字典、枚举缓存、字典刷新           |
| `tab.ts`        | 管理后台多标签页、缓存页面、访问记录       |
| `app.ts`        | 管理主题、布局、侧边栏折叠、系统配置       |

文件位置：`src/stores/modules/user.ts`

以下代码定义用户 Store，负责维护登录凭证和当前用户信息。

```typescript
import { defineStore } from 'pinia'

export interface UserInfo {
  id: number
  username: string
  nickname: string
  avatar?: string
  roles: string[]
}

interface UserState {
  token: string
  userInfo: UserInfo | null
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    token: '',
    userInfo: null
  }),

  getters: {
    isLogin: (state) => Boolean(state.token),
    nickname: (state) => state.userInfo?.nickname || '未登录用户'
  },

  actions: {
    setToken(token: string) {
      this.token = token
    },

    setUserInfo(userInfo: UserInfo) {
      this.userInfo = userInfo
    },

    clearUser() {
      this.token = ''
      this.userInfo = null
    }
  }
})
```

文件位置：`src/stores/modules/menu.ts`

以下代码定义菜单 Store，负责维护后台系统中的菜单列表和当前激活菜单。

```typescript
import { defineStore } from 'pinia'

export interface MenuItem {
  path: string
  title: string
  icon?: string
  children?: MenuItem[]
}

interface MenuState {
  menus: MenuItem[]
  activeMenu: string
}

export const useMenuStore = defineStore('menu', {
  state: (): MenuState => ({
    menus: [],
    activeMenu: ''
  }),

  getters: {
    hasMenus: (state) => state.menus.length > 0
  },

  actions: {
    setMenus(menus: MenuItem[]) {
      this.menus = menus
    },

    setActiveMenu(path: string) {
      this.activeMenu = path
    },

    clearMenus() {
      this.menus = []
      this.activeMenu = ''
    }
  }
})
```

拆分 Store 时需要避免两个极端：一种是所有状态都堆在一个 `appStore` 中，导致 Store 过大；另一种是拆得过细，导致简单状态也分散到多个文件中，增加使用成本。通常以“是否属于同一个业务领域”为拆分依据。

### Store 命名规范

Store 命名需要同时关注文件名、Store ID、导出函数名和状态字段名。命名统一后，组件中使用 Store 时更容易理解，也方便后续排查问题。

推荐命名规则如下：

| 类型          | 规范                     | 示例                                           |
| ------------- | ------------------------ | ---------------------------------------------- |
| Store 文件名  | 使用业务名，小写或短横线 | `user.ts`、`permission.ts`、`system-config.ts` |
| Store ID      | 使用业务名，保持唯一     | `user`、`permission`、`menu`                   |
| Store 函数名  | 使用 `useXxxStore`       | `useUserStore`、`useMenuStore`                 |
| State 字段名  | 使用语义化名词           | `token`、`userInfo`、`menus`                   |
| Getter 字段名 | 使用状态判断或派生语义   | `isLogin`、`hasMenus`、`nickname`              |
| Action 方法名 | 使用动词或动宾结构       | `setToken`、`loadUserInfo`、`clearMenus`       |

推荐写法如下：

```typescript
export const useUserStore = defineStore('user', {
  state: () => ({
    token: '',
    userInfo: null
  })
})
```

不推荐写法如下：

```typescript
export const user = defineStore('store1', {
  state: () => ({
    data: '',
    info: null
  })
})
```

不推荐写法的问题是 Store ID 缺少业务含义，导出函数不符合组合式 API 的命名习惯，状态字段也不够明确。

实际项目中建议遵循以下约定：

1. Store ID 必须全局唯一。
2. Store 文件名与业务模块名保持一致。
3. Store 导出函数统一使用 `useXxxStore`。
4. Action 使用动词开头，例如 `load`、`set`、`clear`、`reset`、`refresh`。
5. 不要使用 `data`、`list`、`info` 这类过于宽泛的字段名，除非上下文非常明确。

### Store 间相互调用

在复杂业务中，一个 Store 可能需要访问另一个 Store。例如权限 Store 加载权限时需要读取用户 Store 中的 `token`，退出登录时用户 Store 需要清空菜单 Store 和标签页 Store。

Store 之间可以相互调用，但应避免形成复杂的循环依赖。推荐在 `actions` 方法内部调用其他 Store，而不是在模块顶层直接调用。

文件位置：`src/stores/modules/permission.ts`

以下代码在权限 Store 的 action 中调用用户 Store，用于根据当前登录状态加载权限信息。

```typescript
import { defineStore } from 'pinia'
import { useUserStore } from './user'

interface PermissionState {
  permissions: string[]
  loaded: boolean
}

export const usePermissionStore = defineStore('permission', {
  state: (): PermissionState => ({
    permissions: [],
    loaded: false
  }),

  getters: {
    hasPermission: (state) => {
      return (permission: string) => state.permissions.includes(permission)
    }
  },

  actions: {
    async loadPermissions() {
      const userStore = useUserStore()

      if (!userStore.token) {
        this.permissions = []
        this.loaded = false
        return
      }

      // 示例数据，实际项目中应替换为权限接口返回结果
      this.permissions = ['system:user:list', 'system:user:add', 'system:role:list']
      this.loaded = true
    },

    clearPermissions() {
      this.permissions = []
      this.loaded = false
    }
  }
})
```

文件位置：`src/stores/modules/user.ts`

以下代码在退出登录时清空用户状态、权限状态和菜单状态，适合后台管理系统退出登录场景。

```typescript
import { defineStore } from 'pinia'
import { useMenuStore } from './menu'
import { usePermissionStore } from './permission'

interface UserState {
  token: string
  userInfo: {
    id: number
    username: string
    nickname: string
  } | null
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    token: '',
    userInfo: null
  }),

  actions: {
    setToken(token: string) {
      this.token = token
    },

    logout() {
      const menuStore = useMenuStore()
      const permissionStore = usePermissionStore()

      this.token = ''
      this.userInfo = null

      menuStore.clearMenus()
      permissionStore.clearPermissions()
    }
  }
})
```

Store 间调用需要注意以下几点：

1. 避免在文件顶层执行 `const userStore = useUserStore()`。
2. 推荐在 `action` 内部按需获取其他 Store。
3. 避免两个 Store 的 action 相互调用形成循环。
4. 跨 Store 的复杂业务编排可以放在更高层的业务方法中处理。
5. 如果多个 Store 都依赖同一份基础数据，应该考虑将基础数据抽成独立 Store。

## 数据持久化

数据持久化用于解决页面刷新后状态丢失的问题。Pinia 默认状态保存在内存中，页面刷新后会重新初始化。如果登录凭证、主题配置、语言设置等状态需要刷新后仍然保留，就需要将部分 Store 状态保存到本地存储中。

常见做法是使用 `pinia-plugin-persistedstate` 插件。该插件支持按 Store 配置持久化，也支持自定义存储方式、序列化方式和持久化字段。官方文档显示，它兼容 `pinia>=2.0.0`，并通过在 Store 中配置 `persist` 开启持久化。([Prazdevs](https://prazdevs.github.io/pinia-plugin-persistedstate/guide/))

### 本地存储场景

不是所有 Store 状态都适合持久化。持久化的核心目标是保留刷新后仍然需要使用的数据，而不是把所有状态都写入 `localStorage`。

适合持久化的状态如下：

| 状态       | 建议存储位置                       | 说明                           |
| ---------- | ---------------------------------- | ------------------------------ |
| `token`    | `localStorage` 或 `sessionStorage` | 用于刷新后保持登录态           |
| 主题配置   | `localStorage`                     | 例如暗色模式、主题色、布局配置 |
| 语言设置   | `localStorage`                     | 例如 `zh-CN`、`en-US`          |
| 标签页记录 | `localStorage`                     | 后台系统多标签页刷新后恢复     |
| 字典缓存   | `localStorage`                     | 数据稳定时可缓存，减少重复请求 |
| 查询条件   | `sessionStorage`                   | 当前会话内保留筛选条件         |

不建议持久化的状态如下：

| 状态         | 原因                           |
| ------------ | ------------------------------ |
| `loading`    | 刷新后没有保留意义             |
| 弹窗显示状态 | 属于临时 UI 状态               |
| 接口错误信息 | 刷新后应重新计算               |
| 大量列表数据 | 可能导致本地存储过大或数据过期 |
| 敏感用户信息 | 本地存储存在被脚本读取的风险   |

持久化状态时需要重点控制字段范围。通常只持久化 `token`、主题、语言、必要配置等字段，不建议直接持久化整个 Store。

### pinia-plugin-persistedstate 使用

使用 `pinia-plugin-persistedstate` 前，需要先安装依赖。插件官方文档提供了 `pnpm`、`npm` 和 `yarn` 三种安装方式，并要求在 Pinia 实例上通过 `pinia.use()` 注册插件。([Prazdevs](https://prazdevs.github.io/pinia-plugin-persistedstate/guide/))

在项目根目录执行安装命令。

```bash
# 使用 pnpm 安装
pnpm add pinia-plugin-persistedstate

# 使用 npm 安装
npm i pinia-plugin-persistedstate

# 使用 yarn 安装
yarn add pinia-plugin-persistedstate
```

文件位置：`src/stores/index.ts`

以下代码创建 Pinia 实例，并注册持久化插件。

```typescript
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

// 创建 Pinia 实例
const pinia = createPinia()

// 注册持久化插件
pinia.use(piniaPluginPersistedstate)

export default pinia
```

文件位置：`src/main.ts`

以下代码在 Vue 应用入口中注册 Pinia 实例。

```typescript
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from './stores'

const app = createApp(App)

app.use(pinia)
app.use(router)

app.mount('#app')
```

文件位置：`src/stores/modules/app.ts`

以下代码通过 `persist: true` 开启整个 Store 的持久化。

```typescript
import { defineStore } from 'pinia'

interface AppState {
  theme: 'light' | 'dark'
  language: 'zh-CN' | 'en-US'
  sidebarCollapse: boolean
}

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    theme: 'light',
    language: 'zh-CN',
    sidebarCollapse: false
  }),

  actions: {
    setTheme(theme: AppState['theme']) {
      this.theme = theme
    },

    setLanguage(language: AppState['language']) {
      this.language = language
    },

    setSidebarCollapse(collapse: boolean) {
      this.sidebarCollapse = collapse
    }
  },

  persist: true
})
```

开启后，该 Store 的状态会按照插件默认配置进行持久化。插件默认使用 `localStorage`，默认存储 key 为 Store 的 `$id`，并默认持久化整个 state。([Prazdevs](https://prazdevs.github.io/pinia-plugin-persistedstate/guide/config.html))

### 持久化字段控制

实际项目中更推荐精确控制持久化字段，而不是直接持久化整个 Store。`pinia-plugin-persistedstate` 支持通过 `persist` 对象配置 `key`、`storage`、`pick`、`omit` 等选项，其中 `pick` 用于指定需要持久化的字段，`omit` 用于排除不需要持久化的字段。([Prazdevs](https://prazdevs.github.io/pinia-plugin-persistedstate/guide/config.html))

文件位置：`src/stores/modules/user.ts`

以下代码只持久化用户 Store 中的 `token`，不持久化 `userInfo` 和 `loading`。

```typescript
import { defineStore } from 'pinia'

interface UserInfo {
  id: number
  username: string
  nickname: string
  roles: string[]
}

interface UserState {
  token: string
  userInfo: UserInfo | null
  loading: boolean
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    token: '',
    userInfo: null,
    loading: false
  }),

  getters: {
    isLogin: (state) => Boolean(state.token)
  },

  actions: {
    setToken(token: string) {
      this.token = token
    },

    setUserInfo(userInfo: UserInfo) {
      this.userInfo = userInfo
    },

    clearUser() {
      this.token = ''
      this.userInfo = null
      this.loading = false
    }
  },

  persist: {
    key: 'app-user',
    storage: localStorage,
    pick: ['token']
  }
})
```

文件位置：`src/stores/modules/app.ts`

以下代码持久化主题、语言和侧边栏折叠状态，适合系统配置类 Store。

```typescript
import { defineStore } from 'pinia'

interface AppState {
  theme: 'light' | 'dark'
  language: 'zh-CN' | 'en-US'
  sidebarCollapse: boolean
  pageLoading: boolean
}

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    theme: 'light',
    language: 'zh-CN',
    sidebarCollapse: false,
    pageLoading: false
  }),

  actions: {
    setTheme(theme: AppState['theme']) {
      this.theme = theme
    },

    setLanguage(language: AppState['language']) {
      this.language = language
    },

    setSidebarCollapse(collapse: boolean) {
      this.sidebarCollapse = collapse
    },

    setPageLoading(loading: boolean) {
      this.pageLoading = loading
    }
  },

  persist: {
    key: 'app-config',
    storage: localStorage,
    pick: ['theme', 'language', 'sidebarCollapse']
  }
})
```

如果只想在当前浏览器会话中保留状态，可以使用 `sessionStorage`。

```typescript
persist: {
  key: 'app-search',
  storage: sessionStorage,
  pick: ['queryParams']
}
```

持久化字段控制建议如下：

1. 登录凭证可以持久化，但用户详情建议刷新后重新请求。
2. `loading`、`errorMessage`、弹窗开关等临时状态不要持久化。
3. 字典数据可以持久化，但需要设计过期或刷新策略。
4. 敏感信息不要直接保存到 `localStorage`。
5. Store 字段调整后，需要注意旧本地缓存与新数据结构是否兼容。

## 接口请求与状态管理

接口请求与状态管理通常会结合在 Store 的 `actions` 中处理。组件只负责触发动作和展示结果，Store 负责维护请求过程中的数据、加载状态、异常信息和刷新策略。

Pinia 的 `actions` 可以包含同步逻辑，也可以包含异步逻辑；在 action 中可以通过 `this` 访问和修改当前 Store 的状态。官方文档也将 actions 类比为 Store 中的 methods。([Pinia](https://pinia.vuejs.org/core-concepts/))

### Action 中封装接口调用

在项目中，接口请求建议先统一封装到 `src/api` 目录，再由 Store 的 action 调用。这样可以避免组件直接关心接口地址、请求参数转换和响应结构。

推荐结构如下：

```text
src
├── api
│   └── user.ts
├── stores
│   └── modules
│       └── user.ts
└── views
    └── login
        └── LoginPage.vue
```

文件位置：`src/api/user.ts`

以下代码封装用户登录和用户信息接口，供 Store 调用。

```typescript
import request from '@/utils/request'

export interface ApiResult<T> {
  code: number
  message: string
  data: T
}

export interface LoginParams {
  username: string
  password: string
}

export interface LoginResult {
  token: string
}

export interface UserInfo {
  id: number
  username: string
  nickname: string
  avatar?: string
  roles: string[]
}

export const loginApi = (data: LoginParams) => {
  return request.post<ApiResult<LoginResult>>('/auth/login', data)
}

export const getUserInfoApi = () => {
  return request.get<ApiResult<UserInfo>>('/auth/user-info')
}
```

文件位置：`src/stores/modules/user.ts`

以下代码在用户 Store 的 action 中封装登录、加载用户信息和退出登录逻辑。

```typescript
import { defineStore } from 'pinia'
import { getUserInfoApi, loginApi, type LoginParams, type UserInfo } from '@/api/user'

interface UserState {
  token: string
  userInfo: UserInfo | null
  loginLoading: boolean
  userInfoLoading: boolean
  errorMessage: string
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    token: '',
    userInfo: null,
    loginLoading: false,
    userInfoLoading: false,
    errorMessage: ''
  }),

  getters: {
    isLogin: (state) => Boolean(state.token),
    nickname: (state) => state.userInfo?.nickname || '未登录用户'
  },

  actions: {
    async login(params: LoginParams) {
      this.loginLoading = true
      this.errorMessage = ''

      try {
        const res = await loginApi(params)

        if (res.data.code !== 200) {
          this.errorMessage = res.data.message || '登录失败'
          throw new Error(this.errorMessage)
        }

        this.token = res.data.data.token
        return this.token
      } catch (error) {
        this.errorMessage = error instanceof Error ? error.message : '登录异常'
        throw error
      } finally {
        this.loginLoading = false
      }
    },

    async loadUserInfo() {
      this.userInfoLoading = true
      this.errorMessage = ''

      try {
        const res = await getUserInfoApi()

        if (res.data.code !== 200) {
          this.errorMessage = res.data.message || '获取用户信息失败'
          throw new Error(this.errorMessage)
        }

        this.userInfo = res.data.data
        return this.userInfo
      } catch (error) {
        this.errorMessage = error instanceof Error ? error.message : '获取用户信息异常'
        throw error
      } finally {
        this.userInfoLoading = false
      }
    },

    logout() {
      this.token = ''
      this.userInfo = null
      this.errorMessage = ''
    }
  },

  persist: {
    key: 'app-user',
    storage: localStorage,
    pick: ['token']
  }
})
```

组件调用时只需要关心 action，不需要直接处理 Store 内部状态变更。

```typescript
const userStore = useUserStore()

await userStore.login({
  username: 'admin',
  password: '123456'
})

await userStore.loadUserInfo()
```

这种方式可以让接口请求、状态修改、异常信息和加载状态集中在 Store 中维护，组件逻辑会更轻。

### Loading 状态管理

Loading 状态用于描述接口请求是否正在执行。对于简单 Store，可以使用一个统一的 `loading` 字段；对于多个请求并存的 Store，建议拆分为更明确的字段，例如 `loginLoading`、`userInfoLoading`、`listLoading`、`submitLoading`。

文件位置：`src/stores/modules/user.ts`

以下代码演示不同接口使用不同 loading 字段，避免多个请求互相影响。

```typescript
import { defineStore } from 'pinia'
import { getUserInfoApi, loginApi, type LoginParams, type UserInfo } from '@/api/user'

interface UserState {
  token: string
  userInfo: UserInfo | null
  loginLoading: boolean
  userInfoLoading: boolean
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    token: '',
    userInfo: null,
    loginLoading: false,
    userInfoLoading: false
  }),

  actions: {
    async login(params: LoginParams) {
      this.loginLoading = true

      try {
        const res = await loginApi(params)
        this.token = res.data.data.token
      } finally {
        this.loginLoading = false
      }
    },

    async loadUserInfo() {
      this.userInfoLoading = true

      try {
        const res = await getUserInfoApi()
        this.userInfo = res.data.data
      } finally {
        this.userInfoLoading = false
      }
    }
  }
})
```

文件位置：`src/views/login/LoginPage.vue`

以下代码在登录页面中使用 Store 的 `loginLoading` 控制按钮加载状态。

```vue
<template>
  <div class="p-4">
    <el-form label-width="80px">
      <el-form-item label="用户名">
        <el-input v-model="form.username" placeholder="请输入用户名" />
      </el-form-item>

      <el-form-item label="密码">
        <el-input v-model="form.password" type="password" show-password placeholder="请输入密码" />
      </el-form-item>

      <el-button type="primary" :loading="loginLoading" @click="handleLogin">
        登录
      </el-button>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/modules/user'

const userStore = useUserStore()
const { loginLoading } = storeToRefs(userStore)

const form = reactive({
  username: '',
  password: ''
})

const handleLogin = async () => {
  if (!form.username || !form.password) {
    ElMessage.warning('请输入用户名和密码')
    return
  }

  await userStore.login({
    username: form.username,
    password: form.password
  })

  ElMessage.success('登录成功')
}
</script>
```

Loading 状态管理建议如下：

1. 一个 Store 中只有一个主要请求时，可以使用 `loading`。
2. 多个请求可能同时发生时，应使用具体业务名命名 loading。
3. Loading 必须在 `finally` 中恢复，避免请求异常后页面一直加载。
4. 组件展示 loading，Store 维护 loading。
5. 不建议将 loading 持久化到本地存储。

### 异常信息处理

异常信息处理需要明确边界：Store 负责记录接口失败状态，组件负责决定如何展示错误提示。这样可以让 Store 保持业务状态完整，同时避免 Store 与 UI 组件强绑定。

文件位置：`src/stores/modules/user.ts`

以下代码在 Store 中维护 `errorMessage`，并在请求失败时抛出异常，交给组件决定是否弹出消息。

```typescript
import { defineStore } from 'pinia'
import { loginApi, type LoginParams } from '@/api/user'

interface UserState {
  token: string
  loginLoading: boolean
  errorMessage: string
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    token: '',
    loginLoading: false,
    errorMessage: ''
  }),

  actions: {
    async login(params: LoginParams) {
      this.loginLoading = true
      this.errorMessage = ''

      try {
        const res = await loginApi(params)

        if (res.data.code !== 200) {
          this.errorMessage = res.data.message || '登录失败'
          throw new Error(this.errorMessage)
        }

        this.token = res.data.data.token
        return this.token
      } catch (error) {
        this.errorMessage = error instanceof Error ? error.message : '登录请求异常'
        throw error
      } finally {
        this.loginLoading = false
      }
    },

    clearError() {
      this.errorMessage = ''
    }
  }
})
```

文件位置：`src/views/login/LoginPage.vue`

以下代码在组件中捕获 Store 抛出的异常，并使用 Element Plus 显示错误提示。

```vue
<template>
  <div class="p-4">
    <el-button type="primary" :loading="loginLoading" @click="handleLogin">
      登录
    </el-button>

    <p v-if="errorMessage" class="mt-3 text-red-500">
      {{ errorMessage }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/modules/user'

const userStore = useUserStore()
const { loginLoading, errorMessage } = storeToRefs(userStore)

const handleLogin = async () => {
  try {
    await userStore.login({
      username: 'admin',
      password: '123456'
    })

    ElMessage.success('登录成功')
  } catch (error) {
    const message = error instanceof Error ? error.message : '登录失败'
    ElMessage.error(message)
  }
}
</script>
```

异常处理建议如下：

| 处理方式                    | 适用场景                         |
| --------------------------- | -------------------------------- |
| Store 中记录 `errorMessage` | 页面需要展示错误区域             |
| Action 中 `throw error`     | 组件需要弹窗、跳转或执行额外逻辑 |
| 请求拦截器统一处理          | token 过期、权限不足、网络错误   |
| 组件局部处理                | 表单提交失败、按钮操作失败       |
| Store 中清理错误            | 页面切换、重新请求、关闭弹窗时   |

不建议在所有 Store action 中直接调用 `ElMessage`。如果 Store 直接依赖 UI 组件库，会降低 Store 的复用性。更推荐 Store 抛出异常或返回结果，由组件决定展示方式。

### 数据刷新策略

数据刷新策略用于控制 Store 中的数据什么时候请求、什么时候复用、什么时候清理。没有刷新策略时，容易出现重复请求、数据过期、页面状态不一致等问题。

常见刷新策略如下：

| 策略             | 说明                         | 适用场景             |
| ---------------- | ---------------------------- | -------------------- |
| 每次进入页面刷新 | 页面加载时总是请求最新数据   | 实时性要求高的数据   |
| 首次加载后缓存   | Store 中已有数据时不重复请求 | 菜单、字典、系统配置 |
| 手动刷新         | 用户点击刷新按钮后重新请求   | 列表页、统计卡片     |
| 按时间过期刷新   | 超过指定时间后重新请求       | 字典、配置、缓存数据 |
| 操作后刷新       | 新增、修改、删除后重新请求   | 表格列表、详情页     |

文件位置：`src/stores/modules/dict.ts`

以下代码在字典 Store 中使用 `loadedKeys` 避免同一个字典重复请求。

```typescript
import { defineStore } from 'pinia'

export interface DictItem {
  label: string
  value: string
}

interface DictState {
  dictMap: Record<string, DictItem[]>
  loadedKeys: string[]
  loading: boolean
}

export const useDictStore = defineStore('dict', {
  state: (): DictState => ({
    dictMap: {},
    loadedKeys: [],
    loading: false
  }),

  getters: {
    getDictList: (state) => {
      return (dictKey: string) => state.dictMap[dictKey] || []
    }
  },

  actions: {
    async loadDict(dictKey: string) {
      if (this.loadedKeys.includes(dictKey)) {
        return this.dictMap[dictKey]
      }

      this.loading = true

      try {
        // 示例数据，实际项目中应替换为字典接口
        const list: DictItem[] = [
          { label: '启用', value: '1' },
          { label: '禁用', value: '0' }
        ]

        this.dictMap[dictKey] = list
        this.loadedKeys.push(dictKey)

        return list
      } finally {
        this.loading = false
      }
    },

    refreshDict(dictKey: string) {
      delete this.dictMap[dictKey]
      this.loadedKeys = this.loadedKeys.filter((key) => key !== dictKey)

      return this.loadDict(dictKey)
    },

    clearDict() {
      this.dictMap = {}
      this.loadedKeys = []
    }
  },

  persist: {
    key: 'app-dict',
    storage: localStorage,
    pick: ['dictMap', 'loadedKeys']
  }
})
```

文件位置：`src/stores/modules/config.ts`

以下代码使用时间戳控制配置数据的过期刷新。

```typescript
import { defineStore } from 'pinia'

interface SystemConfig {
  siteName: string
  logo: string
  copyright: string
}

interface ConfigState {
  config: SystemConfig | null
  lastLoadTime: number
  loading: boolean
}

const CACHE_TIME = 5 * 60 * 1000

export const useConfigStore = defineStore('config', {
  state: (): ConfigState => ({
    config: null,
    lastLoadTime: 0,
    loading: false
  }),

  actions: {
    async loadConfig(force = false) {
      const now = Date.now()
      const isExpired = now - this.lastLoadTime > CACHE_TIME

      if (!force && this.config && !isExpired) {
        return this.config
      }

      this.loading = true

      try {
        // 示例数据，实际项目中应替换为系统配置接口
        this.config = {
          siteName: '后台管理系统',
          logo: '/logo.png',
          copyright: 'Copyright © 2026'
        }

        this.lastLoadTime = now
        return this.config
      } finally {
        this.loading = false
      }
    },

    refreshConfig() {
      return this.loadConfig(true)
    },

    clearConfig() {
      this.config = null
      this.lastLoadTime = 0
    }
  },

  persist: {
    key: 'app-config-cache',
    storage: localStorage,
    pick: ['config', 'lastLoadTime']
  }
})
```

数据刷新策略建议如下：

1. 用户信息刷新后应重新请求，避免只依赖本地缓存。
2. 菜单、权限、字典可以缓存，但需要提供刷新方法。
3. 列表页通常不建议长期缓存在 Store 中，除非有明确的返回保留需求。
4. 对时效性要求高的数据，不要长期持久化。
5. 新增、修改、删除成功后，应同步更新 Store 或重新请求列表。
6. 持久化缓存需要考虑版本升级和字段变更，否则可能出现旧缓存结构不兼容。



## TypeScript 支持

TypeScript 支持是 Vue3 + Pinia 项目中的重要能力。合理定义 Store 类型可以提升状态访问、业务方法调用、接口返回值处理和组件使用时的类型安全，减少字段拼写错误和数据结构不一致的问题。

Pinia 对 TypeScript 的支持比较自然，通常只需要为 `state`、接口参数、接口返回值和部分复杂 getter 明确声明类型即可。多数情况下，getter 和 action 的类型可以由 TypeScript 自动推导。

### State 类型定义

State 是 Store 中最核心的数据结构。对于简单状态，可以直接依靠 TypeScript 推导；对于对象、数组、接口返回值等复杂状态，建议使用 `interface` 或 `type` 明确声明。

文件位置：`src/stores/types/user.ts`

以下代码定义用户信息、角色信息和用户 Store 状态类型，供 Store 统一复用。

```typescript
export interface RoleInfo {
  id: number
  code: string
  name: string
}

export interface UserInfo {
  id: number
  username: string
  nickname: string
  avatar?: string
  roles: RoleInfo[]
  permissions: string[]
}

export interface UserState {
  token: string
  userInfo: UserInfo | null
  loading: boolean
  errorMessage: string
}
```

文件位置：`src/stores/modules/user.ts`

以下代码在用户 Store 中使用独立类型文件定义 State，适合中大型项目维护。

```typescript
import { defineStore } from 'pinia'
import type { UserInfo, UserState } from '@/stores/types/user'

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    token: '',
    userInfo: null,
    loading: false,
    errorMessage: ''
  }),

  actions: {
    setToken(token: string) {
      this.token = token
    },

    setUserInfo(userInfo: UserInfo) {
      this.userInfo = userInfo
    },

    clearUser() {
      this.token = ''
      this.userInfo = null
      this.loading = false
      this.errorMessage = ''
    }
  }
})
```

State 类型定义建议如下：

| 场景                     | 建议                                    |
| ------------------------ | --------------------------------------- |
| 简单字符串、数字、布尔值 | 可以直接推导，也可以统一写入 State 类型 |
| 对象状态                 | 使用 `interface` 明确字段结构           |
| 数组状态                 | 明确数组元素类型，例如 `MenuItem[]`     |
| 可能为空的数据           | 使用联合类型，例如 `UserInfo | null`    |
| 接口返回值               | 优先复用 API 层定义的类型               |
| 多个 Store 共享类型      | 放入 `src/stores/types` 或 `src/types`  |

需要注意，`state` 的初始值要和类型保持一致。比如 `userInfo` 如果接口加载后才有值，初始值可以定义为 `null`，类型写为 `UserInfo | null`。不要为了省事使用 `as any`，否则会失去 TypeScript 的约束价值。

### Getter 类型推导

Getter 通常可以根据 `state` 自动推导返回值类型。简单 getter 不需要额外标注类型，TypeScript 会根据返回表达式推导。

文件位置：`src/stores/modules/user.ts`

以下代码展示常见 getter 的类型推导方式，包括登录状态、用户昵称和权限判断。

```typescript
import { defineStore } from 'pinia'
import type { UserState } from '@/stores/types/user'

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    token: '',
    userInfo: null,
    loading: false,
    errorMessage: ''
  }),

  getters: {
    isLogin: (state) => Boolean(state.token),

    nickname: (state) => state.userInfo?.nickname || '未登录用户',

    roleNames: (state) => {
      return state.userInfo?.roles.map((role) => role.name).join('、') || ''
    },

    hasPermission: (state) => {
      return (permission: string) => {
        return state.userInfo?.permissions.includes(permission) || false
      }
    }
  }
})
```

对于普通 getter，例如 `isLogin`、`nickname`、`roleNames`，返回值类型可以自动推导为 `boolean` 或 `string`。

对于返回函数的 getter，例如 `hasPermission`，TypeScript 也可以推导参数和返回值，但为了提升可读性，也可以显式声明。

```typescript
getters: {
  hasPermission: (state): ((permission: string) => boolean) => {
    return (permission: string) => {
      return state.userInfo?.permissions.includes(permission) || false
    }
  }
}
```

在实际项目中，getter 类型声明建议如下：

| Getter 类型                | 是否需要显式声明     |
| -------------------------- | -------------------- |
| 简单布尔判断               | 通常不需要           |
| 字符串兜底展示             | 通常不需要           |
| 数组过滤、映射             | 复杂时可以声明       |
| 返回函数的 getter          | 建议声明，提升可读性 |
| 依赖其他 getter 的复杂逻辑 | 建议声明返回值类型   |

Getter 应保持为纯计算逻辑，不建议在 getter 中执行接口请求、修改 state 或产生副作用。需要修改状态或处理异步逻辑时，应放入 action。

### Action 参数与返回值类型

Action 通常用于封装业务方法、接口请求和状态修改。对于 action 的参数和返回值，建议结合 API 层类型统一定义，避免 Store 和接口封装之间出现结构不一致。

文件位置：`src/api/user.ts`

以下代码定义登录参数、登录返回值和用户信息接口类型。

```typescript
import request from '@/utils/request'

export interface ApiResult<T> {
  code: number
  message: string
  data: T
}

export interface LoginParams {
  username: string
  password: string
}

export interface LoginResult {
  token: string
}

export interface UserInfo {
  id: number
  username: string
  nickname: string
  avatar?: string
  roles: string[]
  permissions: string[]
}

export const loginApi = (data: LoginParams) => {
  return request.post<ApiResult<LoginResult>>('/auth/login', data)
}

export const getUserInfoApi = () => {
  return request.get<ApiResult<UserInfo>>('/auth/user-info')
}
```

文件位置：`src/stores/modules/user.ts`

以下代码在 action 中明确参数类型和返回值类型，适合登录、获取用户信息等核心业务方法。

```typescript
import { defineStore } from 'pinia'
import { getUserInfoApi, loginApi, type LoginParams, type UserInfo } from '@/api/user'

interface UserState {
  token: string
  userInfo: UserInfo | null
  loginLoading: boolean
  userInfoLoading: boolean
  errorMessage: string
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    token: '',
    userInfo: null,
    loginLoading: false,
    userInfoLoading: false,
    errorMessage: ''
  }),

  getters: {
    isLogin: (state) => Boolean(state.token),
    nickname: (state) => state.userInfo?.nickname || '未登录用户'
  },

  actions: {
    async login(params: LoginParams): Promise<string> {
      this.loginLoading = true
      this.errorMessage = ''

      try {
        const res = await loginApi(params)

        if (res.data.code !== 200) {
          this.errorMessage = res.data.message || '登录失败'
          throw new Error(this.errorMessage)
        }

        this.token = res.data.data.token
        return this.token
      } catch (error) {
        this.errorMessage = error instanceof Error ? error.message : '登录异常'
        throw error
      } finally {
        this.loginLoading = false
      }
    },

    async loadUserInfo(): Promise<UserInfo> {
      this.userInfoLoading = true
      this.errorMessage = ''

      try {
        const res = await getUserInfoApi()

        if (res.data.code !== 200) {
          this.errorMessage = res.data.message || '获取用户信息失败'
          throw new Error(this.errorMessage)
        }

        this.userInfo = res.data.data
        return this.userInfo
      } catch (error) {
        this.errorMessage = error instanceof Error ? error.message : '获取用户信息异常'
        throw error
      } finally {
        this.userInfoLoading = false
      }
    },

    logout(): void {
      this.token = ''
      this.userInfo = null
      this.errorMessage = ''
    }
  }
})
```

Action 类型设计建议如下：

| Action 场景  | 参数类型              | 返回值类型               |
| ------------ | --------------------- | ------------------------ |
| 登录         | `LoginParams`         | `Promise<string>`        |
| 获取用户信息 | 无参数                | `Promise<UserInfo>`      |
| 修改简单状态 | 基础类型              | `void`                   |
| 批量更新状态 | DTO 或 Partial 类型   | `void`                   |
| 查询列表     | 查询参数类型          | `Promise<PageResult<T>>` |
| 删除数据     | `id: number | string` | `Promise<void>`          |

组件调用 action 时可以直接获得类型提示。

```typescript
const userStore = useUserStore()

const token = await userStore.login({
  username: 'admin',
  password: '123456'
})

const userInfo = await userStore.loadUserInfo()

console.log(token)
console.log(userInfo.nickname)
```

对于核心业务 action，建议显式声明返回值类型。这样可以让调用方清楚知道 action 执行完成后能拿到什么数据，也便于后续重构。

### Store 类型复用

Store 类型复用主要用于组合式函数、工具函数、权限判断函数或测试代码中。通常可以使用 TypeScript 的 `ReturnType` 获取 Store 实例类型。

文件位置：`src/stores/modules/user.ts`

以下代码定义用户 Store，并导出 Store 实例类型。

```typescript
import { defineStore } from 'pinia'

interface UserState {
  token: string
  userInfo: {
    id: number
    username: string
    nickname: string
    permissions: string[]
  } | null
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    token: '',
    userInfo: null
  }),

  getters: {
    isLogin: (state) => Boolean(state.token)
  },

  actions: {
    setToken(token: string) {
      this.token = token
    }
  }
})

export type UserStore = ReturnType<typeof useUserStore>
```

文件位置：`src/composables/usePermission.ts`

以下代码在组合式函数中复用 `UserStore` 类型，避免参数使用 `any`。

```typescript
import type { UserStore } from '@/stores/modules/user'

export const usePermission = (userStore: UserStore) => {
  const hasPermission = (permission: string) => {
    return userStore.userInfo?.permissions.includes(permission) || false
  }

  const hasAnyPermission = (permissions: string[]) => {
    return permissions.some((permission) => hasPermission(permission))
  }

  return {
    hasPermission,
    hasAnyPermission
  }
}
```

文件位置：`src/views/system/UserButton.vue`

以下代码在组件中调用组合式函数，并传入用户 Store。

```vue
<template>
  <div class="p-4">
    <el-button v-if="hasPermission('system:user:add')" type="primary">
      新增用户
    </el-button>

    <el-button v-if="hasPermission('system:user:delete')" type="danger">
      删除用户
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/modules/user'
import { usePermission } from '@/composables/usePermission'

const userStore = useUserStore()

const { hasPermission } = usePermission(userStore)
</script>
```

Store 类型复用建议如下：

1. Store 实例类型可以使用 `ReturnType<typeof useXxxStore>`。
2. 接口响应类型应优先定义在 `src/api` 或 `src/types` 中。
3. Store State 类型建议放在 `src/stores/types` 中。
4. 组合式函数需要接收 Store 时，不要使用 `any`。
5. 不建议在全局大量导出复杂 Store 内部类型，避免外部模块过度依赖 Store 实现细节。

## 项目实践规范

项目实践规范用于统一团队中 Pinia 的使用方式。Store 设计不规范时，容易出现状态混乱、职责不清、组件和 Store 强耦合、状态过度持久化等问题。

在中大型 Vue3 项目中，Pinia 应该作为业务状态的集中管理层，而不是所有组件数据的容器。Store 的核心价值是让跨组件、跨页面、跨流程的状态有清晰的来源和可维护的修改入口。

### Store 职责边界

Store 的职责应该围绕某个业务领域展开。一个 Store 不应该同时维护多个无关业务模块的状态，也不应该承担过多 UI 细节逻辑。

合理的 Store 职责包括：

| 职责                       | 示例                                 |
| -------------------------- | ------------------------------------ |
| 管理全局业务状态           | 用户信息、权限、菜单、字典、系统配置 |
| 封装状态修改方法           | 设置 token、清空用户信息、刷新菜单   |
| 封装与状态强相关的接口请求 | 登录、获取用户信息、加载权限         |
| 缓存可复用数据             | 字典、菜单、基础配置                 |
| 维护跨页面流程状态         | 订单草稿、表单步骤、标签页记录       |

不建议放入 Store 的职责包括：

| 不建议职责             | 原因                      |
| ---------------------- | ------------------------- |
| 单个组件内部表单字段   | 组件内部即可维护          |
| 弹窗开关、局部 loading | 通常是局部 UI 状态        |
| 页面 DOM 操作          | 应由组件或指令处理        |
| 大量 UI 组件库逻辑     | 会导致 Store 与 UI 强耦合 |
| 无复用价值的临时变量   | 会让 Store 膨胀           |

例如，登录 Store 可以管理 `token`、`userInfo`、`loginLoading`、`errorMessage`，也可以封装 `login()` 和 `logout()`。但登录表单中的 `username`、`password` 输入值通常不需要放入 Store，因为它们只服务于登录页面。

推荐职责边界如下：

```text
组件负责：
- 表单输入
- 页面展示
- 用户交互
- 消息提示
- 页面跳转

Store 负责：
- 全局状态
- 状态修改
- 状态相关接口请求
- 数据缓存
- 跨页面状态复用

API 模块负责：
- 接口地址
- 请求方法
- 请求参数类型
- 响应数据类型
```

### 组件状态与全局状态区分

组件状态和全局状态的区分，是 Pinia 使用中最容易出问题的地方。不是所有状态都应该放入 Store，只有具备共享、复用、缓存或流程延续价值的状态才适合提升到 Store。

可以按照以下标准判断状态归属：

| 判断问题                           | 适合放入 Store | 适合放在组件 |
| ---------------------------------- | -------------- | ------------ |
| 是否被多个组件使用                 | 是             | 否           |
| 是否需要跨页面保留                 | 是             | 否           |
| 是否刷新后仍需要恢复               | 可能是         | 通常否       |
| 是否属于用户、权限、配置等全局业务 | 是             | 否           |
| 是否只是当前页面交互状态           | 否             | 是           |
| 是否只是当前组件表单输入           | 否             | 是           |

组件内部状态示例：

```vue
<template>
  <el-dialog v-model="visible" title="编辑用户">
    <el-form>
      <el-form-item label="昵称">
        <el-input v-model="form.nickname" />
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

const visible = ref(false)

const form = reactive({
  nickname: ''
})
</script>
```

上面的 `visible` 和 `form.nickname` 只影响当前组件，不需要放入 Store。

适合放入 Store 的状态示例：

```typescript
import { defineStore } from 'pinia'

interface AppState {
  theme: 'light' | 'dark'
  sidebarCollapse: boolean
  language: 'zh-CN' | 'en-US'
}

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    theme: 'light',
    sidebarCollapse: false,
    language: 'zh-CN'
  }),

  actions: {
    setTheme(theme: AppState['theme']) {
      this.theme = theme
    },

    setSidebarCollapse(collapse: boolean) {
      this.sidebarCollapse = collapse
    },

    setLanguage(language: AppState['language']) {
      this.language = language
    }
  },

  persist: {
    key: 'app-config',
    storage: localStorage,
    pick: ['theme', 'sidebarCollapse', 'language']
  }
})
```

上面的 `theme`、`sidebarCollapse`、`language` 可能被布局组件、菜单组件、设置面板等多个地方使用，适合放入 Store。

### 命名与目录规范

命名与目录规范可以减少团队协作中的理解成本。Pinia 项目中建议统一 Store 文件目录、类型文件目录、API 目录和组件调用方式。

推荐目录结构如下：

```text
src
├── api
│   ├── user.ts
│   ├── menu.ts
│   └── dict.ts
├── stores
│   ├── index.ts
│   ├── modules
│   │   ├── user.ts
│   │   ├── permission.ts
│   │   ├── menu.ts
│   │   ├── dict.ts
│   │   └── app.ts
│   └── types
│       ├── user.ts
│       ├── menu.ts
│       └── dict.ts
├── composables
│   ├── usePermission.ts
│   └── useDict.ts
└── views
    ├── login
    └── system
```

推荐命名规则如下：

| 类型         | 命名方式         | 示例                        |
| ------------ | ---------------- | --------------------------- |
| Store 文件   | 小写业务名       | `user.ts`、`dict.ts`        |
| Store ID     | 小写业务名，唯一 | `user`、`permission`        |
| Store 函数   | `useXxxStore`    | `useUserStore`              |
| State 类型   | `XxxState`       | `UserState`                 |
| API 参数类型 | `XxxParams`      | `LoginParams`               |
| API 返回类型 | `XxxResult`      | `LoginResult`               |
| Getter       | 名词或判断语义   | `nickname`、`isLogin`       |
| Action       | 动词开头         | `loadUserInfo`、`clearUser` |

推荐写法：

```typescript
export const useDictStore = defineStore('dict', {
  state: () => ({
    dictMap: {},
    loadedKeys: []
  }),

  actions: {
    async loadDict(dictKey: string) {
      // 加载字典数据
    },

    clearDict() {
      // 清空字典缓存
    }
  }
})
```

不推荐写法：

```typescript
export const useStore = defineStore('data', {
  state: () => ({
    list: [],
    info: {},
    flag: false
  })
})
```

不推荐写法的问题是 Store 名称、状态字段和 action 都缺少业务含义，后续维护时很难判断它们属于哪个模块。

### 常见反模式

反模式是指短期看起来方便，但长期会降低可维护性的写法。Pinia 使用中常见反模式主要集中在状态过度集中、职责混乱、响应式丢失、持久化滥用和接口调用分散。

常见反模式如下：

| 反模式                       | 问题                         | 建议                          |
| ---------------------------- | ---------------------------- | ----------------------------- |
| 所有状态写在一个 Store       | Store 过大，职责不清         | 按业务模块拆分                |
| 组件直接解构 state           | 可能丢失响应式               | 使用 `storeToRefs()`          |
| Store 中直接调用 UI 消息组件 | Store 与 UI 强耦合           | Store 抛异常，组件展示提示    |
| 所有状态都持久化             | 本地缓存臃肿，数据可能过期   | 只持久化必要字段              |
| 接口请求散落在组件中         | 状态修改不可控               | 与状态强相关的请求放入 action |
| getter 中修改 state          | 破坏 getter 纯计算职责       | 修改状态放入 action           |
| Store 间循环调用             | 逻辑难追踪，可能产生依赖问题 | 在更高层编排业务流程          |
| 使用 `any` 定义状态          | 失去类型保护                 | 使用明确的 interface 或 type  |

错误示例：直接解构 Store 状态。

```typescript
const userStore = useUserStore()

// 不推荐：state 和 getter 直接解构后可能丢失响应式
const { token, isLogin } = userStore
```

推荐写法：使用 `storeToRefs()`。

```typescript
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/modules/user'

const userStore = useUserStore()

const { token, isLogin } = storeToRefs(userStore)
const { logout } = userStore
```

错误示例：Store 中直接处理 UI 提示。

```typescript
import { ElMessage } from 'element-plus'

actions: {
  async login(params: LoginParams) {
    try {
      await loginApi(params)
      ElMessage.success('登录成功')
    } catch {
      ElMessage.error('登录失败')
    }
  }
}
```

推荐写法：Store 维护状态和抛出异常，组件负责展示。

```typescript
actions: {
  async login(params: LoginParams) {
    const res = await loginApi(params)

    if (res.data.code !== 200) {
      throw new Error(res.data.message || '登录失败')
    }

    this.token = res.data.data.token
  }
}
```

组件中处理提示：

```typescript
try {
  await userStore.login(form)
  ElMessage.success('登录成功')
} catch (error) {
  const message = error instanceof Error ? error.message : '登录失败'
  ElMessage.error(message)
}
```

## 调试与验证

调试与验证用于确认 Store 状态是否按预期变化、组件是否正确响应状态更新、接口请求是否正确落到 action 中。Pinia 项目中常用的调试方式包括 Vue DevTools、控制台日志、状态订阅和单元测试。

在项目开发阶段，建议优先使用 Vue DevTools 查看 Store 状态，再结合关键 action 的输入输出排查问题。对于核心 Store，例如用户、权限、菜单、字典等模块，可以补充单元测试保证基础逻辑稳定。

### Vue DevTools 调试

Vue DevTools 可以查看 Pinia Store 的状态、getter 和状态变更记录，是调试 Pinia 最常用的工具。只要项目正确注册了 Pinia，就可以在 DevTools 中看到对应 Store。

调试前需要确认入口文件已注册 Pinia。

文件位置：`src/main.ts`

```typescript
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from './stores'

const app = createApp(App)

app.use(pinia)
app.use(router)

app.mount('#app')
```

在 Vue DevTools 中通常可以检查以下内容：

| 调试项     | 说明                       |
| ---------- | -------------------------- |
| Store ID   | 确认 Store 是否正确注册    |
| State      | 查看当前状态值             |
| Getters    | 查看派生状态是否正确       |
| Actions    | 观察 action 调用和状态变化 |
| Timeline   | 排查状态变更发生的顺序     |
| 持久化状态 | 刷新页面后确认状态是否恢复 |

调试步骤建议如下：

1. 打开浏览器 Vue DevTools。
2. 找到 Pinia 面板或 Store 面板。
3. 选择目标 Store，例如 `user`、`menu`、`dict`。
4. 执行页面操作，例如登录、退出、刷新字典。
5. 观察 state 和 getter 是否按预期变化。
6. 如果使用持久化插件，刷新页面后确认持久化字段是否恢复。

如果 DevTools 中没有看到 Store，通常需要检查以下问题：

| 问题                         | 处理方式                            |
| ---------------------------- | ----------------------------------- |
| 没有执行 `app.use(pinia)`    | 检查 `src/main.ts`                  |
| 组件没有调用 `useXxxStore()` | Store 未被使用时可能不明显          |
| Store ID 重复                | 确认 `defineStore()` 第一个参数唯一 |
| 项目运行环境异常             | 重启开发服务后再检查                |
| 浏览器插件版本问题           | 更新 Vue DevTools                   |

### 状态变更排查

状态变更排查用于定位 Store 状态为什么没有更新、为什么更新后页面没有响应、为什么刷新后状态丢失等问题。排查时应从 Store 定义、组件使用方式、异步 action、持久化配置几个方向检查。

常见问题和排查方式如下：

| 现象                  | 可能原因                        | 排查方式                    |
| --------------------- | ------------------------------- | --------------------------- |
| 页面不更新            | 直接解构 state 导致响应式丢失   | 使用 `storeToRefs()`        |
| action 执行后状态没变 | 接口异常或赋值字段错误          | 检查 action 和接口返回结构  |
| 刷新后状态丢失        | 未配置持久化或字段未加入 `pick` | 检查 `persist` 配置         |
| loading 一直为 true   | 异常后未恢复                    | 使用 `finally` 重置 loading |
| getter 结果不正确     | state 初始值或空值判断错误      | 检查 getter 的空值处理      |
| 多个 Store 状态不一致 | Store 间调用顺序问题            | 检查 action 编排逻辑        |

排查响应式丢失问题时，重点检查是否出现以下写法。

```typescript
const userStore = useUserStore()

// 不推荐：直接解构 state 和 getter
const { token, isLogin } = userStore
```

正确写法如下：

```typescript
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/modules/user'

const userStore = useUserStore()

const { token, isLogin } = storeToRefs(userStore)
```

排查异步 action 时，建议统一使用 `try...catch...finally`。

```typescript
async loadUserInfo() {
  this.userInfoLoading = true
  this.errorMessage = ''

  try {
    const res = await getUserInfoApi()
    this.userInfo = res.data.data
  } catch (error) {
    this.errorMessage = error instanceof Error ? error.message : '获取用户信息失败'
    throw error
  } finally {
    this.userInfoLoading = false
  }
}
```

如果需要临时观察 Store 的状态变化，可以使用 `$subscribe()`。

```typescript
const userStore = useUserStore()

userStore.$subscribe((mutation, state) => {
  console.log('用户 Store 发生变化：', mutation)
  console.log('当前用户状态：', state)
})
```

`$subscribe()` 适合调试阶段观察状态变化，不建议在业务代码中滥用。如果需要长期监听某个状态，优先考虑 `watch()` 或在明确的 action 中处理。

### Store 单元测试思路

Store 单元测试用于验证 state 初始值、getter 计算结果和 action 状态变更是否符合预期。对于用户、权限、菜单、字典等核心 Store，建议至少覆盖基础状态和关键 action。

在 Vue3 项目中，可以使用 Vitest 测试 Pinia Store。测试时需要创建测试用 Pinia 实例，并在每个测试用例前重置状态，避免用例之间互相影响。

安装测试依赖：

```bash
pnpm add -D vitest @pinia/testing
```

如果项目已经通过 Vite 创建并集成 Vitest，则不需要重复安装 `vitest`。

文件位置：`src/stores/modules/user.ts`

以下代码是待测试的用户 Store 示例。

```typescript
import { defineStore } from 'pinia'

interface UserState {
  token: string
  userInfo: {
    id: number
    username: string
    nickname: string
  } | null
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    token: '',
    userInfo: null
  }),

  getters: {
    isLogin: (state) => Boolean(state.token),
    nickname: (state) => state.userInfo?.nickname || '未登录用户'
  },

  actions: {
    setToken(token: string) {
      this.token = token
    },

    setUserInfo(userInfo: UserState['userInfo']) {
      this.userInfo = userInfo
    },

    clearUser() {
      this.token = ''
      this.userInfo = null
    }
  }
})
```

文件位置：`src/stores/modules/user.test.ts`

以下代码测试用户 Store 的初始状态、getter 和 action。

```typescript
import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useUserStore } from './user'

describe('useUserStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('应该返回默认状态', () => {
    const userStore = useUserStore()

    expect(userStore.token).toBe('')
    expect(userStore.userInfo).toBeNull()
    expect(userStore.isLogin).toBe(false)
    expect(userStore.nickname).toBe('未登录用户')
  })

  it('设置 token 后应该变为已登录状态', () => {
    const userStore = useUserStore()

    userStore.setToken('mock-token')

    expect(userStore.token).toBe('mock-token')
    expect(userStore.isLogin).toBe(true)
  })

  it('设置用户信息后应该返回用户昵称', () => {
    const userStore = useUserStore()

    userStore.setUserInfo({
      id: 1,
      username: 'admin',
      nickname: '管理员'
    })

    expect(userStore.nickname).toBe('管理员')
  })

  it('清空用户信息后应该恢复默认状态', () => {
    const userStore = useUserStore()

    userStore.setToken('mock-token')
    userStore.setUserInfo({
      id: 1,
      username: 'admin',
      nickname: '管理员'
    })

    userStore.clearUser()

    expect(userStore.token).toBe('')
    expect(userStore.userInfo).toBeNull()
    expect(userStore.isLogin).toBe(false)
  })
})
```

执行测试命令：

```bash
pnpm vitest
```

也可以在 `package.json` 中配置测试脚本。

```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run"
  }
}
```

然后执行：

```bash
pnpm test
```

Store 单元测试建议优先覆盖以下内容：

| 测试内容    | 示例                                       |
| ----------- | ------------------------------------------ |
| 初始状态    | `token` 默认为空、`userInfo` 默认为 `null` |
| Getter      | `isLogin`、`nickname`、`hasPermission`     |
| 同步 action | `setToken`、`clearUser`                    |
| 异步 action | `login`、`loadUserInfo`                    |
| 异常分支    | 接口失败时是否恢复 loading                 |
| 状态重置    | 退出登录后是否清空相关状态                 |

对于异步 action，如果依赖接口请求，建议使用 mock 隔离外部接口，只测试 Store 本身的状态变化。不要在 Store 单元测试中依赖真实后端服务，否则测试会变得不稳定。
