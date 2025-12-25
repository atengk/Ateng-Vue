下面给你一套 **Vue 3 + Pinia 的完整、规范用法**，从安装到进阶实践，直接可用（偏工程化，适合你现在这种项目结构）。

---

## 一、Pinia 是什么 & 为什么用它

Pinia 是 **Vue 官方推荐的状态管理库**（替代 Vuex）：

* 💡 API 更简单（Composition API 原生风格）
* ⚡ 天然支持 TypeScript
* 🧩 模块化（每个 store 就是一个独立模块）
* 🔥 DevTools 体验好
* 🚫 没有 mutation 的心智负担

---

## 二、安装 Pinia

```bash
pnpm install pinia@3.0.4 --filter @apps/pinia
```

---

## 三、在 Vue3 中注册 Pinia

### 1️⃣ main.ts

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

## 四、创建 Store（推荐结构）

### 📁 目录结构（推荐）

```txt
src/
 ├─ stores/
 │   ├─ user.ts
 │   ├─ app.ts
 │   └─ index.ts
```

---

## 五、定义 Store（组合式写法，强烈推荐）

### 1️⃣ 用户 Store 示例 `stores/user.ts`

```ts
import {defineStore} from 'pinia'
import {computed, ref} from "vue";

export const useUserStore = defineStore('user', () => {
    // state
    const token = ref<string>('')
    const userInfo = ref<any>(null)

    // getters
    const isLogin = computed(() => !!token.value)

    // actions
    function setToken(value: string) {
        token.value = value
    }

    function setUserInfo(info: any) {
        userInfo.value = info
    }

    function logout() {
        token.value = ''
        userInfo.value = null
    }

    return {
        token,
        userInfo,
        isLogin,
        setToken,
        setUserInfo,
        logout
    }
})
```

📌 特点：

* `ref / computed` 原生 Vue3 写法
* 没有 `mutation`
* action 中可直接写 async

---

## 六、在组件中使用 Pinia

### 1️⃣ 基础用法

```ts
<script setup lang="ts">
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

userStore.setToken('abc123')
</script>
```

---

### 2️⃣ 解构（⚠️ 正确姿势）

❌ 错误（会丢失响应性）：

```ts
const { token } = useUserStore()
```

✅ 正确（使用 `storeToRefs`）：

```ts
import { storeToRefs } from 'pinia'

const userStore = useUserStore()
const { token, userInfo, isLogin } = storeToRefs(userStore)
```

---

## 七、异步 Action（非常常见）

```ts
async function fetchUserInfo() {
  const res = await getUserInfoApi()
  userInfo.value = res.data
}
```

组件中：

```ts
await userStore.fetchUserInfo()
```

---

## 八、Pinia 持久化（localStorage）

### 方式一：插件（推荐）

```bash
pnpm add pinia-plugin-persistedstate
```

### main.ts 注册

```ts
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
```

### Store 中使用

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
  key: 'user',
  storage: localStorage,
  paths: ['token']
}
```

---

## 九、多个 Store 相互调用

```ts
import { useUserStore } from './user'

export const useAppStore = defineStore('app', () => {
  const userStore = useUserStore()

  function resetAll() {
    userStore.logout()
  }

  return { resetAll }
})
```

---

## 十、Pinia + Router / Axios 常见用法

### Axios 拦截器中使用 Store（⚠️ 重点）

```ts
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

axios.interceptors.request.use(config => {
  if (userStore.token) {
    config.headers!.Authorization = userStore.token
  }
  return config
})
```

📌 注意：**必须在 Pinia 注册之后使用**

---

## 十一、推荐的最佳实践

✅ Store 只管「状态 & 业务逻辑」
❌ 不直接写 DOM 相关逻辑

✅ 一个业务域一个 store
❌ 超级大 store

✅ 命名统一：`useXxxStore`
✅ Store 名和文件名一致

---

## 十二、你这个项目我建议的 Store 划分

结合你之前的项目结构（axios / request 封装）：

```txt
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
│  │  │  └─ index.ts
│  │  └─ xxx/               # 其他业务模块
│  │
│  ├─ base/                 # 基础 / 横切 Store
│  │  ├─ app/               # UI / Layout / Theme
│  │  │  ├─ store.ts
│  │  │  └─ index.ts
│  │  ├─ dict/              # 字典 / 枚举缓存
│  │  │  ├─ store.ts
│  │  │  └─ index.ts
│  │  └─ cache/             # 本地缓存状态
│  │     └─ store.ts
│  │
│  ├─ plugins/              # Pinia 插件
│  │  ├─ persist.ts
│  │  └─ reset.ts
│  │
│  └─ index.ts              # 统一导出
```

---

如果你愿意，下一步我可以直接帮你：

* 🔹 把 **你现有的 axios/request 封装 + Pinia 登录态**整合好
* 🔹 给你一个 **登录 → 刷新不丢 token → 权限控制** 的完整示例
* 🔹 或者 **对比 Vuex，帮你做迁移方案**

你直接说「下一步做哪块」就行 👍
