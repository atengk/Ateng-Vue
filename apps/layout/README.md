# Layout

Layout 是后台系统中用于**承载整体页面结构**的组件，本身不代表任何具体业务页面。它通常作为**父路由**存在，内部包含 Header、Sidebar 等固定区域，并通过一个 `<router-view>` 作为内容出口。所有实际页面都以**子路由**的形式渲染到这个出口中，从而实现页面切换时布局不变、内容变化的效果。通过这种设计，可以将结构与业务解耦，使页面组织更清晰，也为后续扩展菜单、权限、多布局等功能打下基础。

## 创建应用

按照首页工程化创建应用：apps/layout



## 基础配置

安装 vue-router 包

```
pnpm add vue-router@4.6.4 --filter @apps/layout
```

创建路由

```typescript
// router/index.ts
import {createRouter, createWebHistory, type RouteRecordRaw} from 'vue-router'

const routes: RouteRecordRaw[] = []

export default createRouter({
    history: createWebHistory(),
    routes
})
```

配置 main.ts

```typescript
import {createApp} from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router)

app.mount('#app')
```

目录结构（实际项目开发可供参考）

```
src/
├─ router/
│  ├─ index.ts                 # 创建 Router 实例
│  ├─ routes/
│  │  ├─ static/
│  │  │  ├─ auth.ts            # 登录 / 注册 路由
│  │  │  ├─ error.ts           # 404 / 403 错误页路由
│  │  │  └─ index.ts           # 静态路由汇总出口
│  │  ├─ dynamic/
│  │  │  ├─ dashboard.ts       # 工作台 / 首页模块路由
│  │  │  ├─ system.ts          # 系统管理模块路由
│  │  │  ├─ report.ts          # 报表模块路由
│  │  │  └─ index.ts           # 动态路由汇总出口
│  │  └─ index.ts              # 路由总汇（static + dynamic）
│  └─ guard/
│     └─ permission.ts         # 路由守卫（登录态 / 权限校验）
│
├─ views/
│  ├─ dashboard/
│  │  └─ index.vue             # 工作台页面
│  ├─ user/
│  │  └─ index.vue             # 用户页面
│  ├─ system/
│  │  └─ index.vue             # 系统管理页面
│  └─ error/
│     └─ 404.vue               # 404 页面
│
├─ layout/
│  └─ index.vue                # 系统基础布局（Layout 外壳）
│
├─ components/
│  ├─ layout/
│  │  ├─ AppHeader.vue         # 顶部栏组件
│  │  ├─ AppSidebar.vue        # 侧边菜单组件
│  │  ├─ AppBreadcrumb.vue     # 面包屑组件（基于路由 meta）
│  │  └─ AppTabs.vue           # 多页签组件
│  ├─ common/
│  │  ├─ SvgIcon.vue           # 通用 SVG 图标
│  │  ├─ PageHeader.vue        # 页面通用头部组件
│  │  └─ Empty.vue             # 空状态组件
│  └─ index.ts                 # 公共组件统一导出
│
├─ App.vue                     # 根组件
└─ main.ts                     # 应用入口
```



## Layout 最简配置

### Layout 的本质是什么？

在 Vue Router 中，**Layout 并不是特殊概念**，它只是一个普通组件。

👉 真正起作用的是这一点：

> **Layout 组件内部包含一个 `<router-view>`，用于渲染子路由**

因此，后台系统的页面结构，本质上就是 **“父路由 + 子路由嵌套”**。

---

### 系统页面结构说明

整个系统只做一件事：
**固定 Header + Sidebar，右侧内容区随路由变化**

```
┌───────────────────────────┐
│        AppHeader          │
├────────────┬──────────────┤
│ AppSidebar │  <router-view>
│            │   子路由页面
│            │
└────────────┴──────────────┘
```

### 设计原则

* `/` 路由使用 `Layout` 作为外壳
* `Layout` 内部负责整体结构
* **真正的页面交给子路由渲染**

---

### 路由实现

`router/index.ts`

```ts
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import Layout from '@/layout/index.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '',
        component: () => import('@/views/dashboard/index.vue')
      },
      {
        path: 'system',
        component: () => import('@/views/system/index.vue')
      }
    ]
  }
]

export default createRouter({
  history: createWebHistory(),
  routes
})
```

关键点说明

* `/` 是**父路由**，负责加载 Layout
* 子路由不会替换整个页面
* **只会渲染到 Layout 中的 `<router-view>`**

这正是后台 Layout 能“固定不动”的原因。

---

### Layout 外壳

`layout/index.vue`

```vue
<template>
  <div class="layout">
    <AppHeader />
    <div class="body">
      <AppSidebar />
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import AppHeader from '@/components/layout/AppHeader.vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'
</script>

<style scoped>
.layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.body {
  flex: 1;
  display: flex;
}
</style>
```

---

### Header

`components/layout/AppHeader.vue`

```vue
<template>
  <header class="header">Header</header>
</template>

<style scoped>
.header {
  height: 48px;
  line-height: 48px;
  padding-left: 12px;
  border-bottom: 1px solid #ddd;
}
</style>
```

---

### Sidebar

`components/layout/AppSidebar.vue`

```vue
<template>
  <aside class="sidebar">
    <router-link to="/">Dashboard</router-link>
    <router-link to="/system">System</router-link>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 160px;
  padding: 8px;
  border-right: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
</style>
```

---

### 页面（只做占位）

`views/dashboard/index.vue`

```vue
<template>
  <div class="page">Dashboard Page</div>
</template>

<style scoped>
.page {
  font-size: 18px;
  font-weight: 500;
}
</style>
```

`views/system/index.vue`

```vue
<template>
  <div class="page">System Page</div>
</template>

<style scoped>
.page {
  font-size: 18px;
  font-weight: 500;
}
</style>
```

---

### 入口文件

`main.ts`

```ts
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

createApp(App).use(router).mount('#app')
```

`App.vue`

```vue
<template>
  <router-view />
</template>
```

---

这一章你真正要让人“记住”的 3 件事

> 如果读者只记住这三句话，这一节就是成功的

1. **Layout 只是一个普通组件**
2. **Layout 能固定，是因为它包含 `<router-view>`**
3. **页面切换，本质是子路由在切换**



## 第二阶段：路由驱动视图（未完待续）

> 目标：让“路由成为核心数据源”

4. 使用 `meta.title` 描述页面信息
5. Sidebar 由路由配置自动生成
6. 页面标题从路由 `meta` 中读取

---

## 第三阶段：基础交互能力（未完待续）

> 目标：具备最基本的后台体验

7. 面包屑组件（基于 `route.matched`）
8. 页面级 KeepAlive 控制
9. 内容区 Loading 占位

---

## 第四阶段：多 Layout 体系（未完待续）

> 目标：适配不同页面形态

10. 拆分 `AdminLayout / BlankLayout`
11. 登录页独立布局
12. 错误页脱离主 Layout

---

## 第五阶段：权限与动态能力（未完待续）

> 目标：进入“企业级”范畴

13. 基于角色的路由控制
14. 动态注册路由
15. Sidebar 菜单权限过滤

---

## 第六阶段：复杂后台能力（进阶）（未完待续）

> 目标：大型系统常见能力

16. 多页签（Tabs）页面管理
17. 菜单折叠与响应式布局
18. 布局状态持久化（本地缓存）

