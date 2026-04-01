# Pinia

Pinia 是 Vue 官方推出的新一代状态管理方案，也是 Vue 3 时代的默认推荐选择。它基于 Composition API 设计，API 简洁直观，去除了 Vuex 中 mutation 的概念，使状态、计算属性和业务方法高度内聚，更贴近现代函数式与模块化开发方式。同时，Pinia 对 TypeScript 提供了一流支持，类型推导完整，能够显著降低大型项目中的维护成本。

在企业级应用中，Pinia 天然支持模块化拆分，每个 Store 都是一个独立、可组合的状态单元，便于按业务域进行管理和扩展。配合 Vue DevTools，状态变更清晰可追踪，并且可以通过插件机制实现持久化、重置等通用能力，非常适合中大型 Vue 3 项目的状态管理需求。

官网地址：[https://pinia.vuejs.org](https://pinia.vuejs.org/)

---

## 创建应用

按照首页工程化创建应用：apps/pinia



## 基础配置

安装 pinia 包

```
pnpm install pinia@3.0.4 --filter @apps/pinia
```

目录结构

```
src/
├─ stores/
│  ├─ modules/              # 业务域 Store
│  │  ├─ auth/              # 认证域
│  │  │  ├─ store.ts
│  │  │  ├─ types.ts
│  │  │  └─ index.ts
│  │  ├─ user/              # 用户域
│  │  │  ├─ store.ts
│  │  │  ├─ types.ts
│  │  │  └─ index.ts
│  │  ├─ permission/        # 权限域
│  │  │  ├─ store.ts
│  │  │  ├─ types.ts
│  │  │  └─ index.ts
│  │  └─ xxx/               # 其他业务模块
│  │
│  ├─ base/                 # 基础 / 横切 Store
│  │  ├─ app/               # UI / Layout / Theme
│  │  │  ├─ store.ts
│  │  │  ├─ types.ts
│  │  │  └─ index.ts
│  │  ├─ dict/              # 字典 / 枚举缓存
│  │  │  ├─ store.ts
│  │  │  ├─ types.ts
│  │  │  └─ index.ts
│  │
│  ├─ plugins/              # Pinia 插件
│  │  ├─ persist.ts
│  │  └─ reset.ts
│  │
│  └─ index.ts              # 统一导出
```



## Pinia 配置

在 Vue3 中注册 Pinia

main.ts

```ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const app = createApp(App)

const pinia = createPinia()

app.use(pinia)
app.mount('#app')
```

---



## 定义 Store

用户 Store 示例 `src/stores/modules/user/`

### types.ts

```ts
/**
 * 用户基础信息
 */
export interface UserProfile {
    id: string
    username: string
    nickname: string
    avatar?: string
    email?: string
    phone?: string
}

/**
 * 用户状态 State
 */
export interface UserState {
    profile: UserProfile | null
    loaded: boolean
}
```

### store.ts

```ts
import {defineStore} from 'pinia'
import {ref, computed} from 'vue'
import type {UserProfile} from './types'

export const useUserStore = defineStore('user', () => {
    /**
     * state
     */
    const profile = ref<UserProfile | null>(null)
    const loaded = ref<boolean>(false)

    /**
     * getters
     */
    const hasProfile = computed(() => profile.value !== null)

    /**
     * actions
     */
    function setProfile(user: UserProfile) {
        profile.value = user
        loaded.value = true
    }

    function clearProfile() {
        profile.value = null
        loaded.value = false
    }

    /**
     * 示例：从接口加载用户信息
     * 注意：不在 Store 内直接处理 UI、副作用
     */
    async function fetchProfile() {
        if (loaded.value) {
            return
        }

        // const res = await getUserProfileApi()
        // setProfile(res.data)

        loaded.value = true
    }

    return {
        profile,
        loaded,
        hasProfile,
        setProfile,
        clearProfile,
        fetchProfile
    }
})
```

### index.ts

```ts
export * from './store'
export * from './types'
```

### 全局 store/index.ts

```ts
export * from './modules/user'
export * from './base/app'
export * from './base/dict'
export * from './plugins/persist'
export * from './plugins/reset'
```



## 使用 Store

### User.vue

```vue
<script setup lang="ts">
import {storeToRefs} from 'pinia'
import {useUserStore} from '@/stores'

const userStore = useUserStore()

/**
 * 使用 storeToRefs 保持响应性
 */
const {profile, loaded} = storeToRefs(userStore)

/**
 * 保存用户信息（模拟）
 */
function handleSave() {
  userStore.setProfile({
    id: '1001',
    username: 'admin',
    nickname: '系统管理员',
    avatar: '',
    email: 'admin@example.com',
    phone: '13800000000'
  })
}

/**
 * 获取用户信息
 */
async function handleFetch() {
  await userStore.fetchProfile()
}

/**
 * 删除用户信息
 */
function handleClear() {
  userStore.clearProfile()
}
</script>

<template>
  <div style="padding: 16px;">
    <h2>User Store 完整示例</h2>

    <!-- 操作区 -->
    <div style="margin-bottom: 12px;">
      <button @click="handleSave">setProfile</button>
      <button @click="handleFetch" style="margin-left: 8px;">
        fetchProfile
      </button>
      <button @click="handleClear" style="margin-left: 8px;">
        clearProfile
      </button>
    </div>

    <!-- 状态区 -->
    <div style="margin-bottom: 12px;">
      <p><strong>loaded（state）：</strong>{{ loaded }}</p>
      <p><strong>hasProfile（getter）：</strong>{{ userStore.hasProfile }}</p>
    </div>

    <!-- 数据展示 -->
    <div>
      <p><strong>profile（state）：</strong></p>

      <pre v-if="profile">
        {{ profile}}
      </pre>

      <p v-else>暂无用户信息</p>
    </div>

    <!-- 调试区 -->
    <div style="margin-top: 16px;">
      <p><strong>store 实例（调试用）：</strong></p>
      <pre>
{{ userStore }}
      </pre>
    </div>
  </div>
</template>
```

### UserView.vue

```vue
<script setup lang="ts">
import {storeToRefs} from 'pinia'
import {useUserStore} from '@/stores'

const userStore = useUserStore()

/**
 * 使用 storeToRefs 保持响应性
 */
const {profile} = storeToRefs(userStore)
</script>

<template>
  <div style="padding: 16px;">
    <h2>User Store 视图示例</h2>

    <div>
      <pre v-if="profile">
        {{ profile }}
      </pre>

      <p v-else>暂无用户信息</p>
    </div>
  </div>
</template>
```

### App.vue

```vue
<script setup lang="ts">
import {ref} from 'vue'
import User from "@/views/User.vue";
import UserView from "@/views/UserView.vue";

const tab = ref<'user' | 'userView'>('user')
</script>

<template>
  <div class="tabs">
    <button @click="tab = 'user'">User</button>
    <button @click="tab = 'userView'">UserView</button>
  </div>

  <User v-if="tab === 'user'"/>
  <UserView v-else-if="tab === 'userView'"/>
  <User v-else/>
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

## 持久化（localStorage）

安装插件

```bash
pnpm install pinia-plugin-persistedstate@4.7.1 --filter @apps/pinia
```

main.ts 注册

```ts
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
```

Store 中使用

```ts
export const useUserStore = defineStore('user', () => {
  const token = ref('')

  return { token }
}, {
  persist: true
})
```

或精细化配置：

```ts
persist: {
  key: 'user',                 // storage 中的 key（默认是 store.$id）
  storage: localStorage,       // 使用 localStorage 持久化，可选：localStorage、sessionStorage
  pick: ['token', 'userInfo'], // 仅持久化 token 和 userInfo
  omit: ['tempFlag']           // 排除 tempFlag（⚠️与 pick 同时存在时不生效）
}
```

