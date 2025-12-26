# Vue Router

Vue Router 是 Vue 3 官方提供的路由管理方案，用于构建单页面应用（SPA）。它通过 URL 与组件的映射关系，实现页面切换而无需整页刷新，提升用户体验与应用性能。

在 Vue 3 中，Vue Router 4 基于组合式 API 设计，支持动态路由、嵌套路由、路由守卫与懒加载，便于构建复杂且可维护的前端应用架构。

官网地址：https://router.vuejs.org/zh/

## 创建应用

按照首页工程化创建应用：apps/vue-router



## 基础配置

安装 vue-router 包

```
pnpm add vue-router@4.6.4 --filter @apps/vue-router
```

目录结构

```
src/
├─ router/
│  ├─ index.ts                 # 路由统一入口（创建 Router 实例）
│  ├─ routes/
│  │  ├─ static/               # 静态路由（系统级，始终存在）
│  │  │  ├─ auth.ts            # 认证相关路由（登录 / 注册）
│  │  │  ├─ error.ts           # 错误页路由（404 / 403）
│  │  │  └─ index.ts           # 静态路由汇总出口
│  │  ├─ dynamic/              # 动态路由（业务级，权限控制）
│  │  │  ├─ system.ts          # 系统管理模块
│  │  │  ├─ dashboard.ts       # 工作台 / 首页模块
│  │  │  ├─ report.ts          # 报表模块
│  │  │  └─ index.ts           # 动态路由汇总出口
│  │  └─ index.ts              # 路由总汇（static + dynamic）
│  └─ guard/
│     └─ permission.ts         # 路由守卫（登录态 / 权限校验）
├─ views/
│  ├─ login/                   # 登录页面
│  ├─ dashboard/               # 首页 / 工作台页面
│  └─ error/
│     └─ 404.vue               # 404 页面
├─ layout/
│  └─ index.vue                # 系统基础布局（Layout）
├─ store/                      # Pinia 状态管理
├─ main.ts                     # 应用入口
└─ App.vue                     # 根组件
```



## Vue Router配置

## 一、企业级（简化版）目录结构示例

```text
src/
├─ router/
│  ├─ index.ts              # 路由统一入口
│  ├─ routes/
│  │  ├─ constant.ts        # 静态路由（登录、404等）
│  │  ├─ async.ts           # 动态路由（权限相关）
│  │  └─ index.ts           # 路由汇总
│  └─ guard/
│     └─ permission.ts      # 路由守卫（登录、权限）
├─ views/
│  ├─ login/
│  ├─ dashboard/
│  └─ error/
│     └─ 404.vue
├─ layout/
│  └─ index.vue             # 基础布局
├─ store/                   # Pinia 状态管理
├─ main.ts
└─ App.vue
```

设计原则：**路由分层清晰、静态与动态解耦、守卫独立维护**，满足企业项目可扩展性但不过度复杂。

------

## 二、路由初始化（router/index.ts）

```ts
import { createRouter, createWebHistory } from 'vue-router'
import { constantRoutes } from './routes'
import './guard/permission'

const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes,
  scrollBehavior: () => ({ top: 0 })
})

export default router
```

------

## 三、静态路由定义（routes/constant.ts）

```ts
import type { RouteRecordRaw } from 'vue-router'

export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录', public: true }
  },
  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: '首页' }
      }
    ]
  }
]
```

------

## 四、动态路由（权限路由）设计思路

```ts
// routes/async.ts
export const asyncRoutes = [
  {
    path: '/system',
    meta: { role: ['admin'] },
    component: () => import('@/layout/index.vue'),
    children: [
      {
        path: 'user',
        component: () => import('@/views/system/user.vue'),
        meta: { title: '用户管理' }
      }
    ]
  }
]
```

常见做法：

- 后端返回 **菜单 / 权限码**
- 前端根据权限过滤 asyncRoutes
- 使用 `router.addRoute()` 动态注入

------

## 五、路由守卫（登录 & 权限控制）

```ts
// router/guard/permission.ts
import router from '@/router'
import { useUserStore } from '@/store/user'

router.beforeEach((to, _, next) => {
  const userStore = useUserStore()

  if (to.meta.public) {
    next()
    return
  }

  if (!userStore.token) {
    next('/login')
    return
  }

  next()
})
```

------

## 六、页面中使用路由的常规方式

```ts
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

router.push('/dashboard')
console.log(route.meta.title)
```

------

## 七、企业项目中的常见约定

- 路由 **不直接写在业务模块中**
- `meta` 统一承载：标题、权限、缓存、菜单显示
- 页面跳转 **禁止写死 URL**，统一用路由常量
- 动态路由只注入一次，刷新需重建

------

## 八、官方文档

Vue Router 官方文档（Vue 3）：
https://router.vuejs.org/zh/

如果你需要，我可以在这个结构上 **直接帮你对接 Pinia 权限 / 菜单生成 / keep-alive 缓存策略**，一步到位。
