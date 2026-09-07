# Vue Router

## 路由模块概述

路由模块是 Vue3 前端项目中的基础模块，主要负责页面地址、页面组件和页面访问流程之间的映射关系。通过 Vue Router，项目可以根据不同的 URL 地址渲染不同的页面组件，实现单页应用中的页面跳转、参数传递、访问控制、菜单联动和页面状态管理。

在实际开发中，路由模块通常不是孤立存在的。它会和页面组件、Layout 布局、Pinia 状态管理、权限模块、菜单模块、标签页模块以及页面缓存机制配合使用，共同构成前端项目的页面访问体系。

### Vue Router 的作用

Vue Router 是 Vue 官方提供的路由管理工具，主要用于在 Vue 单页应用中管理页面之间的跳转关系。它可以根据浏览器地址栏中的路径，匹配对应的页面组件，并将该组件渲染到指定位置。

在 Vue3 项目中，Vue Router 主要有以下作用：

1. 管理页面访问路径

   Vue Router 可以通过路由配置定义页面访问路径，例如 `/login`、`/dashboard`、`/user/list`、`/order/detail/:id` 等。每个路径都可以对应一个具体的页面组件，用户访问不同地址时，系统会自动展示对应页面。

2. 实现页面无刷新跳转

   在单页应用中，页面跳转通常不需要重新加载整个 HTML 页面。Vue Router 会在前端内部完成组件切换，从而提升页面响应速度和用户体验。

3. 建立 URL 与组件的映射关系

   路由配置本质上是 URL 和 Vue 组件之间的映射表。例如访问 `/user/list` 时渲染用户列表组件，访问 `/role/list` 时渲染角色列表组件。这样可以让项目页面结构更加清晰。

4. 支持声明式和编程式导航

   Vue Router 支持通过 `<RouterLink>` 实现声明式跳转，也支持通过 `router.push()`、`router.replace()` 等方法在业务逻辑中进行编程式跳转。常见场景包括登录成功后跳转首页、保存成功后返回列表页、无权限时跳转错误页等。

5. 支持路由参数传递

   项目中经常需要通过路由传递参数，例如详情页 ID、列表页查询条件、分页参数、来源页面等。Vue Router 可以通过动态路由参数和 query 参数完成这些需求。

6. 支持路由守卫和权限控制

   Vue Router 提供路由守卫机制，可以在页面进入前、进入后或组件内部进行拦截处理。项目中常用它来完成登录校验、Token 校验、页面权限判断、动态路由加载和页面标题设置等功能。

7. 支持嵌套路由和多级页面结构

   后台管理系统通常存在主布局、侧边栏菜单、顶部导航和内容区域。Vue Router 可以通过嵌套路由实现 Layout 与子页面之间的层级关系，适合构建多级菜单和模块化页面结构。

### 路由在项目中的定位

在 Vue3 项目中，路由模块通常位于应用入口和页面组件之间，属于前端项目的基础架构层。它负责统一管理页面访问规则，是连接用户访问地址、页面组件、权限体系和导航菜单的重要中间层。

从项目结构上看，路由模块通常放在 `src/router` 目录中，例如：

```text
src
├── router
│   ├── index.ts
│   ├── routes.ts
│   ├── guard.ts
│   └── modules
│       ├── system.ts
│       ├── user.ts
│       └── order.ts
├── views
│   ├── login
│   ├── dashboard
│   ├── system
│   └── order
├── layouts
│   ├── BasicLayout.vue
│   └── BlankLayout.vue
└── stores
    ├── user.ts
    └── permission.ts
```

其中，`src/router/index.ts` 通常用于创建路由实例，`routes.ts` 用于维护基础路由配置，`guard.ts` 用于维护全局路由守卫，`modules` 目录用于按业务模块拆分路由配置。

在项目运行流程中，路由模块通常会在 `main.ts` 中注册到 Vue 应用实例中：

```typescript
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

// 注册路由实例，使整个应用具备路由能力
app.use(router)

app.mount('#app')
```

路由模块在项目中的定位可以从以下几个方面理解：

1. 页面调度中心

   用户访问某个 URL 时，路由模块会根据当前地址匹配对应页面组件，并将组件渲染到 `<RouterView />` 中。因此，路由模块是页面访问和页面渲染的调度入口。

2. 页面结构组织入口

   项目中的一级页面、二级页面、详情页、异常页、登录页等通常都需要通过路由统一组织。合理的路由结构可以让页面层级更加清晰，也方便后续维护。

3. 权限控制入口

   登录校验、角色校验、菜单权限、页面权限等逻辑通常会集中在路由守卫中处理。用户是否可以进入某个页面，往往由路由守卫结合用户状态和权限数据决定。

4. 菜单和面包屑的数据来源

   管理后台中，菜单、面包屑、页面标题、标签页等功能通常会读取路由配置中的 `meta` 信息。因此，路由配置不仅决定页面跳转，还会影响导航展示。

5. 页面状态管理的辅助模块

   列表查询条件、分页参数、详情页 ID 等状态可以通过路由参数保存。这样页面刷新、复制链接、浏览器回退时，仍然可以恢复到相对准确的业务状态。

在实际开发中，路由模块应保持职责清晰。路由文件主要负责页面路径、组件映射、元信息和访问规则配置，不建议在路由文件中编写大量复杂业务逻辑。复杂的权限判断、用户信息处理和接口请求应尽量封装到 Pinia Store、工具函数或业务服务中。

### 常见路由使用场景

Vue Router 在前端项目中的使用场景非常广泛，只要涉及页面访问、页面跳转、页面权限、页面层级和页面状态恢复，通常都会使用到路由能力。

1. 登录页与首页跳转

   用户访问系统时，如果未登录，通常会跳转到 `/login` 页面。登录成功后，再跳转到首页、工作台或用户原本想访问的页面。

   常见路径示例：

   ```text
   /login
   /dashboard
   /
   ```

2. 后台管理系统页面切换

   管理后台通常包含用户管理、角色管理、菜单管理、订单管理、系统配置等多个页面。这些页面一般都会通过路由进行统一管理。

   常见路径示例：

   ```text
   /system/user
   /system/role
   /system/menu
   /order/list
   /order/detail/1001
   ```

3. 详情页参数传递

   详情页通常需要根据 ID 查询具体数据。此时可以使用动态路由参数，例如 `/user/detail/:id`。

   示例：

   ```text
   /user/detail/1001
   /order/detail/202405210001
   ```

   页面中可以根据路由参数获取业务 ID，再调用接口查询详情数据。

4. 列表页查询条件保留

   列表页通常包含搜索条件、分页参数和排序参数。将这些信息放到 query 参数中，可以在刷新页面或复制链接后保留当前查询状态。

   示例：

   ```text
   /user/list?keyword=admin&page=1&pageSize=20
   /order/list?status=paid&startDate=2024-01-01&endDate=2024-01-31
   ```

5. 多级菜单和嵌套路由

   后台系统通常会有多级菜单，例如“系统管理 / 用户管理 / 用户详情”。这种结构一般通过嵌套路由实现，父级路由负责 Layout，子级路由负责具体业务页面。

   示例：

   ```text
   /system
   /system/user
   /system/role
   /system/menu
   ```

6. 权限路由控制

   不同角色可以访问的页面不同。例如管理员可以访问系统管理页面，普通用户只能访问业务页面。项目中通常会结合路由 `meta` 信息、用户角色和权限标识进行页面访问控制。

   示例：

   ```typescript
   {
     path: '/system/user',
     name: 'SystemUser',
     component: () => import('@/views/system/user/index.vue'),
     meta: {
       title: '用户管理',
       requiresAuth: true,
       permissions: ['system:user:list']
     }
   }
   ```

   该配置表示访问用户管理页面需要登录，并且需要具备 `system:user:list` 权限。

7. 页面标题和面包屑生成

   路由配置中的 `meta.title` 可以用于设置浏览器标题，也可以用于生成面包屑和菜单名称。

   示例：

   ```typescript
   {
     path: '/order/list',
     name: 'OrderList',
     component: () => import('@/views/order/list.vue'),
     meta: {
       title: '订单列表',
       breadcrumb: ['订单管理', '订单列表']
     }
   }
   ```

8. 404 和异常页面处理

   当用户访问不存在的页面时，系统通常会跳转到 404 页面。当用户没有权限访问某个页面时，可以跳转到 403 页面。

   常见路径示例：

   ```text
   /403
   /404
   /500
   ```

9. 标签页和页面缓存

   在后台管理系统中，用户经常会同时打开多个业务页面。路由信息可以用于生成标签页，同时结合 `<KeepAlive>` 实现页面缓存，避免用户在页面切换后丢失表单或列表状态。

10. 动态路由加载

    在权限复杂的系统中，前端可以根据后端返回的菜单和权限数据动态生成路由。用户登录后，系统根据用户角色加载可访问页面，未授权页面不会被注册到路由表中。

    这种方式适合菜单需要后台配置、不同角色页面差异较大、权限变更频繁的项目。

整体来看，Vue Router 不只是一个页面跳转工具，而是 Vue3 项目中组织页面结构、管理访问流程、实现权限控制和提升单页应用体验的核心模块。



## 路由环境准备

路由环境准备主要包括项目结构确认、依赖安装和路由目录规划。对于 Vue3 项目，建议在项目初始化阶段就规划好 `router`、`views`、`layouts`、`stores` 等目录，避免后续页面增多后路由配置混乱。

### Vue3 项目结构

Vue3 项目通常基于 Vite 创建，项目中与路由关系最密切的目录包括 `src/router`、`src/views`、`src/layouts` 和 `src/stores`。Vue Router 官方文档中也说明，路由配置用于告诉 Vue Router 每个 URL 路径应该展示哪个组件，匹配到的组件会渲染到 `<RouterView>` 中。([Vue Router](https://router.vuejs.org/guide/))

推荐项目结构如下：

```text
src
├── api
│   └── user.ts
├── assets
│   └── styles
├── components
│   └── common
├── layouts
│   ├── BasicLayout.vue
│   └── BlankLayout.vue
├── router
│   ├── index.ts
│   ├── routes.ts
│   ├── guard.ts
│   └── modules
│       ├── dashboard.ts
│       ├── system.ts
│       └── order.ts
├── stores
│   ├── user.ts
│   └── permission.ts
├── utils
│   └── auth.ts
├── views
│   ├── login
│   │   └── index.vue
│   ├── dashboard
│   │   └── index.vue
│   ├── system
│   │   ├── user
│   │   │   ├── index.vue
│   │   │   └── detail.vue
│   │   └── role
│   │       └── index.vue
│   └── error
│       ├── 403.vue
│       └── 404.vue
├── App.vue
└── main.ts
```

其中，`router` 目录负责维护路由配置和路由实例，`views` 目录负责存放页面级组件，`layouts` 目录负责存放页面布局组件，`stores` 目录负责存放用户状态、权限状态和菜单状态。

一般情况下，`views` 中的页面组件会直接与路由配置对应，而 `components` 中的组件更多是业务组件或通用组件，不建议直接作为一级路由页面使用。

### Vue Router 依赖安装

Vue3 项目需要使用 Vue Router 4。安装时可以根据项目使用的包管理工具选择对应命令。

在项目根目录执行以下命令安装 Vue Router：

```bash
# pnpm 项目推荐使用
pnpm add vue-router@4

# npm 项目使用
npm install vue-router@4

# yarn 项目使用
yarn add vue-router@4
```

安装完成后，可以在 `package.json` 中看到类似依赖：

```json
{
  "dependencies": {
    "vue": "^3.5.0",
    "vue-router": "^4.0.0"
  }
}
```

如果项目是通过 `create-vue` 创建的，也可以在初始化时直接选择启用 Vue Router。Vue Router 官方文档也提到，`create-vue` 脚手架可以创建包含 Vue Router 的示例项目。([Vue Router](https://router.vuejs.org/guide/))

### 路由目录规划

路由目录规划的目标是让路由配置清晰、模块边界明确，并方便后续扩展权限、菜单、标签页和页面缓存等功能。

推荐路由目录如下：

```text
src/router
├── index.ts          # 创建路由实例，导出 router
├── routes.ts         # 汇总基础路由、业务路由、异常页路由
├── guard.ts          # 全局路由守卫，例如登录校验、标题设置、权限判断
└── modules
    ├── dashboard.ts  # 工作台相关路由
    ├── system.ts     # 系统管理相关路由
    └── order.ts      # 订单管理相关路由
```

各文件职责建议如下：

| 文件             | 作用                                            |
| ---------------- | ----------------------------------------------- |
| `index.ts`       | 创建 `router` 实例，配置 history 模式和滚动行为 |
| `routes.ts`      | 汇总所有静态路由和业务模块路由                  |
| `guard.ts`       | 注册全局前置守卫、后置守卫和异常处理            |
| `modules/*.ts`   | 按业务模块拆分路由配置                          |
| `layouts/*.vue`  | 承载嵌套路由页面的布局组件                      |
| `views/**/*.vue` | 与路由路径直接对应的页面组件                    |

拆分路由文件时，建议按照业务模块拆分，而不是按照菜单层级随意拆分。例如用户管理、角色管理、菜单管理都属于系统管理，可以放在 `modules/system.ts` 中；订单列表、订单详情、订单审核属于订单模块，可以放在 `modules/order.ts` 中。

## 路由基础配置

路由基础配置包括创建路由实例、选择 history 模式，并将路由注册到 Vue 应用实例中。Vue Router 官方文档说明，路由实例通过 `createRouter()` 创建，`routes` 用于定义路径与组件之间的映射，`history` 用于控制 URL 与路由之间的映射方式。([Vue Router](https://router.vuejs.org/guide/))

### 创建路由实例

创建路由实例通常在 `src/router/index.ts` 中完成。该文件负责引入路由配置，创建 `router` 对象，并导出给 `main.ts` 使用。

文件位置：`src/router/index.ts`

```typescript
import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { routes } from './routes'

/**
 * 创建 Vue Router 实例
 *
 * history：配置路由模式
 * routes：配置路由规则
 * scrollBehavior：控制页面切换后的滚动位置
 */
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes as RouteRecordRaw[],
  scrollBehavior() {
    // 页面切换后回到顶部，避免新页面停留在旧页面滚动位置
    return {
      top: 0,
      left: 0
    }
  }
})

export default router
```

这里使用 `createWebHistory()` 创建 HTML5 history 模式。`import.meta.env.BASE_URL` 是 Vite 提供的基础路径，适合项目部署到子路径时统一处理路由前缀。

### 配置 history 模式

Vue Router 常见 history 模式包括 `createWebHistory()`、`createWebHashHistory()` 和 `createMemoryHistory()`。官方文档说明，`createWebHistory()` 是 HTML5 模式，URL 更正常；但由于单页应用由前端接管路由，直接访问深层路径时需要服务端配置 fallback，否则可能出现 404。([Vue Router](https://router.vuejs.org/guide/essentials/history-mode.html))

常见模式对比如下：

| 模式                     | 示例 URL           | 适用场景                         | 注意事项                         |
| ------------------------ | ------------------ | -------------------------------- | -------------------------------- |
| `createWebHistory()`     | `/system/user`     | 正式项目、后台系统、门户系统     | 需要 Nginx 或服务端配置 fallback |
| `createWebHashHistory()` | `/#/system/user`   | 静态部署、无服务端配置权限的项目 | URL 中带 `#`，观感较差           |
| `createMemoryHistory()`  | 不依赖浏览器地址栏 | SSR、测试环境、Node 环境         | 普通浏览器项目较少使用           |

生产项目通常推荐使用 `createWebHistory()`：

```typescript
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
```

如果项目部署后刷新 `/system/user` 页面出现 404，需要在 Nginx 中增加 history fallback 配置。Vue Router 官方文档给出的 Nginx 核心配置是 `try_files $uri $uri/ /index.html;`，即静态资源不存在时回退到单页应用入口文件。([Vue Router](https://router.vuejs.org/guide/essentials/history-mode.html))

文件位置：`/etc/nginx/conf.d/default.conf`

```nginx
server {
  listen 80;
  server_name localhost;

  root /usr/share/nginx/html;
  index index.html;

  location / {
    # 支持 Vue Router history 模式，刷新子路由时回退到 index.html
    try_files $uri $uri/ /index.html;
  }
}
```

如果项目部署环境无法配置 Nginx 或服务端 fallback，可以临时使用 hash 模式：

```typescript
import { createRouter, createWebHashHistory } from 'vue-router'
import { routes } from './routes'

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
```

### 注册路由到应用实例

创建路由实例后，需要在 `main.ts` 中通过 `app.use(router)` 注册到 Vue 应用实例。Vue Router 官方文档说明，和大多数 Vue 插件一样，`app.use(router)` 需要在 `app.mount()` 之前调用。注册后，应用中可以使用 `<RouterView>`、`<RouterLink>`、`useRouter()` 和 `useRoute()` 等能力。([Vue Router](https://router.vuejs.org/guide/))

文件位置：`src/main.ts`

```typescript
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// 引入全局样式
import './assets/styles/index.scss'

const app = createApp(App)

// 注册路由插件，必须在 mount 之前执行
app.use(router)

app.mount('#app')
```

根组件中需要放置 `<RouterView />`，用于渲染当前路由匹配到的页面组件。

文件位置：`src/App.vue`

```vue
<template>
  <RouterView />
</template>

<script setup lang="ts">
// 根组件只负责提供路由出口，页面结构交给 Layout 和具体页面组件处理
</script>
```

如果项目存在统一布局，通常会在路由配置中挂载 `BasicLayout.vue`，再由布局组件内部提供二级 `<RouterView />`。

文件位置：`src/layouts/BasicLayout.vue`

```vue
<template>
  <div class="basic-layout">
    <aside class="basic-layout__sidebar">
      <!-- 侧边栏菜单区域 -->
    </aside>

    <section class="basic-layout__main">
      <header class="basic-layout__header">
        <!-- 顶部导航区域 -->
      </header>

      <main class="basic-layout__content">
        <!-- 子路由页面出口 -->
        <RouterView />
      </main>
    </section>
  </div>
</template>

<script setup lang="ts">
// 基础布局组件用于承载后台系统主框架
</script>

<style scoped lang="scss">
.basic-layout {
  display: flex;
  min-height: 100vh;

  &__sidebar {
    width: 220px;
    border-right: 1px solid #e5e7eb;
  }

  &__main {
    flex: 1;
    min-width: 0;
  }

  &__header {
    height: 56px;
    border-bottom: 1px solid #e5e7eb;
  }

  &__content {
    padding: 16px;
  }
}
</style>
```

## 路由规则设计

路由规则设计决定了项目页面的访问路径、组件映射、页面层级、参数形式和默认跳转行为。设计路由时，需要兼顾可读性、可维护性、菜单生成、权限控制和页面刷新后的状态恢复。

### 基础路由配置

基础路由一般包括登录页、首页、工作台、异常页和根路径重定向。这些路由通常在项目启动时就固定存在，不依赖用户权限动态加载。

文件位置：`src/router/routes.ts`

```typescript
import type { RouteRecordRaw } from 'vue-router'
import BasicLayout from '@/layouts/BasicLayout.vue'
import { dashboardRoutes } from './modules/dashboard'
import { systemRoutes } from './modules/system'

/**
 * 静态基础路由
 *
 * 这类路由不依赖动态权限，应用启动时直接注册。
 */
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '登录',
      requiresAuth: false,
      hidden: true
    }
  },
  {
    path: '/',
    name: 'Root',
    component: BasicLayout,
    redirect: '/dashboard',
    meta: {
      title: '首页',
      requiresAuth: true
    },
    children: [
      ...dashboardRoutes,
      ...systemRoutes
    ]
  },
  {
    path: '/403',
    name: 'Forbidden',
    component: () => import('@/views/error/403.vue'),
    meta: {
      title: '无权限',
      hidden: true
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/error/404.vue'),
    meta: {
      title: '页面不存在',
      hidden: true
    }
  }
]

export const routes: RouteRecordRaw[] = [...constantRoutes]
```

这里的 `meta` 用于描述路由额外信息，例如页面标题、是否需要登录、是否在菜单中隐藏等。后续做菜单、权限、面包屑和标签页时，可以复用这些元信息。

基础路由配置建议遵循以下原则：

| 配置项              | 建议                                           |
| ------------------- | ---------------------------------------------- |
| `path`              | 使用小写路径，多个单词使用中划线或业务目录分层 |
| `name`              | 使用 PascalCase，保证全局唯一                  |
| `component`         | 页面组件使用懒加载                             |
| `redirect`          | 父级菜单或根路径建议配置默认跳转               |
| `meta.title`        | 用于菜单、标题、面包屑展示                     |
| `meta.requiresAuth` | 用于登录校验                                   |
| `meta.hidden`       | 用于控制菜单中是否展示                         |

### 嵌套路由配置

嵌套路由用于表达页面结构上的父子关系。Vue Router 官方文档说明，当组件内部包含自己的 `<router-view>` 时，可以通过 `children` 配置将子路由渲染到父组件内部。([Vue Router](https://router.vuejs.org/guide/essentials/nested-routes.html))

后台管理系统中最常见的嵌套路由是 `Layout + 子页面` 模式。例如 `/system` 使用基础布局，`/system/user`、`/system/role`、`/system/menu` 是布局中的业务页面。

文件位置：`src/router/modules/system.ts`

```typescript
import type { RouteRecordRaw } from 'vue-router'

/**
 * 系统管理路由
 *
 * 当前文件只维护系统管理模块下的页面路由。
 */
export const systemRoutes: RouteRecordRaw[] = [
  {
    path: 'system',
    name: 'System',
    redirect: '/system/user',
    meta: {
      title: '系统管理',
      icon: 'Setting',
      requiresAuth: true
    },
    children: [
      {
        path: 'user',
        name: 'SystemUser',
        component: () => import('@/views/system/user/index.vue'),
        meta: {
          title: '用户管理',
          requiresAuth: true,
          permissions: ['system:user:list']
        }
      },
      {
        path: 'user/detail/:id',
        name: 'SystemUserDetail',
        component: () => import('@/views/system/user/detail.vue'),
        meta: {
          title: '用户详情',
          requiresAuth: true,
          hidden: true,
          activeMenu: '/system/user',
          permissions: ['system:user:detail']
        }
      },
      {
        path: 'role',
        name: 'SystemRole',
        component: () => import('@/views/system/role/index.vue'),
        meta: {
          title: '角色管理',
          requiresAuth: true,
          permissions: ['system:role:list']
        }
      }
    ]
  }
]
```

需要注意的是，在嵌套路由中，子路由的 `path` 通常不要以 `/` 开头。Vue Router 官方文档说明，嵌套路由中以 `/` 开头的路径会被当作根路径处理。([Vue Router](https://router.vuejs.org/guide/essentials/nested-routes.html))

例如：

```typescript
{
  path: 'user'
}
```

最终路径是：

```text
/system/user
```

而下面这种写法：

```typescript
{
  path: '/user'
}
```

会被当作根路径：

```text
/user
```

### 动态路由配置

动态路由用于处理带有参数的路径，例如详情页、编辑页、预览页等。Vue Router 官方文档说明，动态路径参数使用冒号 `:` 声明，匹配到的参数会暴露到 `route.params` 中。([Vue Router](https://router.vuejs.org/guide/essentials/dynamic-matching.html))

常见动态路由如下：

```typescript
{
  path: 'user/detail/:id',
  name: 'SystemUserDetail',
  component: () => import('@/views/system/user/detail.vue'),
  meta: {
    title: '用户详情',
    hidden: true,
    activeMenu: '/system/user'
  }
}
```

访问路径示例：

```text
/system/user/detail/1001
```

页面中可以通过 `useRoute()` 获取参数。

文件位置：`src/views/system/user/detail.vue`

```vue
<template>
  <section class="user-detail">
    <h2>用户详情</h2>

    <div class="user-detail__info">
      当前用户 ID：{{ userId }}
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// 从动态路由参数中读取用户 ID
const userId = computed(() => String(route.params.id || ''))

watch(
  () => route.params.id,
  (id) => {
    // 同一个详情组件在不同 ID 间切换时，组件实例可能会复用，需要监听参数变化重新加载数据
    console.log('用户详情参数变化：', id)
  },
  {
    immediate: true
  }
)
</script>

<style scoped lang="scss">
.user-detail {
  &__info {
    margin-top: 16px;
  }
}
</style>
```

动态路由常用于以下场景：

| 场景     | 路由示例                  |
| -------- | ------------------------- |
| 用户详情 | `/system/user/detail/:id` |
| 订单详情 | `/order/detail/:orderNo`  |
| 商品编辑 | `/product/edit/:id`       |
| 文章预览 | `/article/preview/:id`    |
| 文件查看 | `/file/view/:fileId`      |

如果参数不是页面身份的一部分，而是筛选条件、分页条件或搜索条件，通常更推荐使用 query 参数，例如：

```text
/system/user?keyword=admin&page=1&pageSize=20
```

### 重定向与别名配置

重定向用于把一个路径跳转到另一个路径，常见于根路径跳转、父级菜单默认子页面跳转、旧路径兼容等场景。Vue Router 官方文档说明，重定向通过路由配置中的 `redirect` 完成，可以重定向到路径、命名路由，也可以使用函数动态返回目标位置。([Vue Router](https://router.vuejs.org/guide/essentials/redirect-and-alias.html))

基础重定向示例：

```typescript
{
  path: '/',
  redirect: '/dashboard'
}
```

父级菜单默认跳转示例：

```typescript
{
  path: 'system',
  name: 'System',
  redirect: '/system/user',
  meta: {
    title: '系统管理'
  },
  children: [
    {
      path: 'user',
      name: 'SystemUser',
      component: () => import('@/views/system/user/index.vue'),
      meta: {
        title: '用户管理'
      }
    }
  ]
}
```

旧路径兼容示例：

```typescript
{
  path: '/user/list',
  redirect: '/system/user'
}
```

函数式重定向示例：

```typescript
{
  path: '/search/:keyword',
  redirect: (to) => {
    return {
      path: '/search',
      query: {
        keyword: String(to.params.keyword || '')
      }
    }
  }
}
```

别名用于让多个路径匹配同一个路由组件，但访问时浏览器地址不会被替换。Vue Router 官方文档说明，`alias` 与 `redirect` 的区别是：重定向会替换 URL，而别名会保持用户访问的 URL 不变，但按目标路由进行匹配。([Vue Router](https://router.vuejs.org/guide/essentials/redirect-and-alias.html))

别名配置示例：

```typescript
{
  path: '/dashboard',
  name: 'Dashboard',
  alias: ['/home', '/workbench'],
  component: () => import('@/views/dashboard/index.vue'),
  meta: {
    title: '工作台',
    requiresAuth: true
  }
}
```

访问以下路径都会渲染工作台页面：

```text
/dashboard
/home
/workbench
```

重定向和别名的区别如下：

| 配置       | 是否改变地址栏 | 典型用途                                         |
| ---------- | -------------- | ------------------------------------------------ |
| `redirect` | 是             | 根路径跳转、父级菜单默认页、旧地址迁移           |
| `alias`    | 否             | 多地址访问同一页面、兼容历史入口、保留业务短链接 |

实际项目中，根路径和父级菜单默认页更适合使用 `redirect`；需要保留多个访问入口并且不希望改变地址栏时，才使用 `alias`。



## 页面组件与路由映射

页面组件与路由映射用于明确“访问哪个路径时渲染哪个页面组件”。在 Vue3 项目中，通常将页面级组件放在 `src/views` 目录，将通用组件放在 `src/components` 目录，路由配置只直接指向页面级组件。这样可以保持页面结构、路由配置和业务模块之间的对应关系清晰。

### 页面组件目录规范

页面组件目录建议按照业务模块划分，而不是把所有页面组件平铺在 `views` 目录下。页面数量较少时可以简单组织，页面数量较多时应按模块、功能、页面类型进一步拆分。

推荐目录结构如下：

```text
src
├── views
│   ├── login
│   │   └── index.vue
│   ├── dashboard
│   │   └── index.vue
│   ├── system
│   │   ├── user
│   │   │   ├── index.vue
│   │   │   ├── detail.vue
│   │   │   └── form.vue
│   │   ├── role
│   │   │   ├── index.vue
│   │   │   └── form.vue
│   │   └── menu
│   │       └── index.vue
│   ├── order
│   │   ├── list.vue
│   │   ├── detail.vue
│   │   └── audit.vue
│   └── error
│       ├── 403.vue
│       ├── 404.vue
│       └── 500.vue
```

常见页面命名建议如下：

| 页面类型         | 推荐命名     | 示例                           |
| ---------------- | ------------ | ------------------------------ |
| 模块首页或列表页 | `index.vue`  | `views/system/user/index.vue`  |
| 详情页           | `detail.vue` | `views/system/user/detail.vue` |
| 新增或编辑页     | `form.vue`   | `views/system/user/form.vue`   |
| 审核页           | `audit.vue`  | `views/order/audit.vue`        |
| 异常页           | 状态码命名   | `views/error/404.vue`          |

路由配置应尽量和页面目录保持一致。例如，`/system/user` 对应 `src/views/system/user/index.vue`，`/system/user/detail/:id` 对应 `src/views/system/user/detail.vue`。这种约定可以降低维护成本，后续排查页面、菜单、权限和路由问题时也更直观。

文件位置：`src/router/modules/system.ts`

```typescript
import type { RouteRecordRaw } from 'vue-router'

export const systemRoutes: RouteRecordRaw[] = [
  {
    path: 'system',
    name: 'System',
    redirect: '/system/user',
    meta: {
      title: '系统管理',
      icon: 'Setting',
      requiresAuth: true
    },
    children: [
      {
        path: 'user',
        name: 'SystemUser',
        component: () => import('@/views/system/user/index.vue'),
        meta: {
          title: '用户管理',
          requiresAuth: true,
          permissions: ['system:user:list']
        }
      },
      {
        path: 'user/detail/:id',
        name: 'SystemUserDetail',
        component: () => import('@/views/system/user/detail.vue'),
        meta: {
          title: '用户详情',
          requiresAuth: true,
          hidden: true,
          activeMenu: '/system/user',
          permissions: ['system:user:detail']
        }
      },
      {
        path: 'user/form',
        name: 'SystemUserForm',
        component: () => import('@/views/system/user/form.vue'),
        meta: {
          title: '用户表单',
          requiresAuth: true,
          hidden: true,
          activeMenu: '/system/user',
          permissions: ['system:user:add', 'system:user:update']
        }
      }
    ]
  }
]
```

这里的路由路径、组件路径和业务模块保持一致，便于后续根据菜单定位路由，根据路由定位页面，根据页面定位权限配置。

### 路由懒加载

路由懒加载是指只有在用户访问某个路由页面时，才加载该页面对应的组件代码。Vue Router 官方文档说明，路由组件可以使用动态导入，`component` 选项可以接收一个返回 Promise 的函数，并且通常建议路由组件使用动态导入，从而让构建工具自动进行代码分割。([Vue Router](https://router.vuejs.org/guide/advanced/lazy-loading.html))

不推荐在路由中静态导入大量页面组件：

```typescript
import UserList from '@/views/system/user/index.vue'

const routes = [
  {
    path: '/system/user',
    component: UserList
  }
]
```

推荐使用动态导入：

```typescript
const routes = [
  {
    path: '/system/user',
    name: 'SystemUser',
    component: () => import('@/views/system/user/index.vue')
  }
]
```

对于中大型管理后台，建议业务页面默认都使用懒加载。登录页、首页、异常页、业务详情页都可以通过动态导入配置，减少首屏 JavaScript 体积。

文件位置：`src/router/modules/order.ts`

```typescript
import type { RouteRecordRaw } from 'vue-router'

export const orderRoutes: RouteRecordRaw[] = [
  {
    path: 'order',
    name: 'Order',
    redirect: '/order/list',
    meta: {
      title: '订单管理',
      icon: 'Document',
      requiresAuth: true
    },
    children: [
      {
        path: 'list',
        name: 'OrderList',
        component: () => import('@/views/order/list.vue'),
        meta: {
          title: '订单列表',
          requiresAuth: true,
          permissions: ['order:list']
        }
      },
      {
        path: 'detail/:orderNo',
        name: 'OrderDetail',
        component: () => import('@/views/order/detail.vue'),
        meta: {
          title: '订单详情',
          requiresAuth: true,
          hidden: true,
          activeMenu: '/order/list',
          permissions: ['order:detail']
        }
      },
      {
        path: 'audit',
        name: 'OrderAudit',
        component: () => import('@/views/order/audit.vue'),
        meta: {
          title: '订单审核',
          requiresAuth: true,
          permissions: ['order:audit']
        }
      }
    ]
  }
]
```

路由懒加载需要注意以下几点：

| 注意项                             | 说明                                                         |
| ---------------------------------- | ------------------------------------------------------------ |
| 页面组件优先使用动态导入           | 例如 `component: () => import('@/views/xxx.vue')`            |
| 不要把路由组件写成异步组件包装形式 | Vue Router 官方文档说明，路由懒加载和 Vue 异步组件是不同能力，路由组件本身应直接使用返回 Promise 的函数 |
| 公共组件不一定需要路由懒加载       | 公共组件通常由页面组件内部引入                               |
| 首屏必要组件可以静态引入           | 例如主 Layout 可以根据项目实际情况静态引入                   |
| 页面过多时需要关注分包结果         | Vite 项目可以结合构建分析工具检查 chunk 体积                 |

### 路由元信息配置

路由元信息通过 `meta` 字段维护页面的扩展信息，例如页面标题、图标、是否需要登录、权限标识、是否隐藏菜单、是否缓存、激活菜单等。Vue Router 官方文档说明，可以通过 `meta` 给路由附加任意信息，并且这些信息可以在路由对象和导航守卫中访问。([Vue Router](https://router.vuejs.org/guide/advanced/meta.html))

常见 `meta` 字段建议如下：

| 字段           | 类型       | 说明                                   |
| -------------- | ---------- | -------------------------------------- |
| `title`        | `string`   | 页面标题，用于菜单、浏览器标题、面包屑 |
| `icon`         | `string`   | 菜单图标                               |
| `requiresAuth` | `boolean`  | 是否需要登录                           |
| `permissions`  | `string[]` | 页面访问权限标识                       |
| `roles`        | `string[]` | 可访问角色                             |
| `hidden`       | `boolean`  | 是否在菜单中隐藏                       |
| `activeMenu`   | `string`   | 详情页、表单页需要激活的左侧菜单       |
| `keepAlive`    | `boolean`  | 是否需要页面缓存                       |
| `breadcrumb`   | `boolean`  | 是否显示在面包屑中                     |

在 TypeScript 项目中，建议扩展 Vue Router 的 `RouteMeta` 类型，避免使用 `meta` 时缺少类型提示。

文件位置：`src/types/router.d.ts`

```typescript
import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    /**
     * 页面标题
     */
    title?: string

    /**
     * 菜单图标
     */
    icon?: string

    /**
     * 是否需要登录
     */
    requiresAuth?: boolean

    /**
     * 页面权限标识
     */
    permissions?: string[]

    /**
     * 角色标识
     */
    roles?: string[]

    /**
     * 是否隐藏菜单
     */
    hidden?: boolean

    /**
     * 当前页面需要激活的菜单路径
     */
    activeMenu?: string

    /**
     * 是否缓存页面
     */
    keepAlive?: boolean

    /**
     * 是否显示面包屑
     */
    breadcrumb?: boolean
  }
}
```

配置路由元信息示例：

```typescript
{
  path: 'user',
  name: 'SystemUser',
  component: () => import('@/views/system/user/index.vue'),
  meta: {
    title: '用户管理',
    icon: 'User',
    requiresAuth: true,
    permissions: ['system:user:list'],
    keepAlive: true,
    breadcrumb: true
  }
}
```

在全局守卫中读取 `meta` 信息，可以统一处理页面标题和登录校验。

文件位置：`src/router/guard.ts`

```typescript
import type { Router } from 'vue-router'

const DEFAULT_TITLE = '后台管理系统'

/**
 * 注册路由守卫
 */
export function setupRouterGuard(router: Router) {
  router.beforeEach((to) => {
    // 根据路由元信息设置浏览器标题
    document.title = to.meta.title ? `${to.meta.title} - ${DEFAULT_TITLE}` : DEFAULT_TITLE

    // 这里可以继续扩展登录校验、权限校验、动态路由加载等逻辑
    return true
  })
}
```

文件位置：`src/router/index.ts`

```typescript
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'
import { setupRouterGuard } from './guard'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return {
      top: 0,
      left: 0
    }
  }
})

// 注册全局路由守卫
setupRouterGuard(router)

export default router
```

`meta` 的设计要保持克制。建议只放与路由、页面展示、菜单、权限、缓存相关的信息，不要把复杂业务配置、接口参数或页面内部状态放入路由元信息中。

## 路由跳转

路由跳转分为声明式导航和编程式导航。声明式导航适合在模板中编写固定跳转入口，例如菜单、按钮、链接；编程式导航适合在业务逻辑中跳转，例如登录成功、保存成功、权限拦截、表单取消、详情页返回等。

### 声明式导航

声明式导航主要使用 `<RouterLink>` 组件。Vue Router 官方文档说明，点击 `<RouterLink :to="...">` 与调用 `router.push(...)` 的行为相当，都会进入新的路由地址。([Vue Router](https://router.vuejs.org/guide/essentials/navigation.html))

基础写法如下：

```vue
<template>
  <nav class="menu">
    <RouterLink to="/dashboard">工作台</RouterLink>
    <RouterLink to="/system/user">用户管理</RouterLink>
    <RouterLink to="/system/role">角色管理</RouterLink>
  </nav>
</template>
```

如果路由配置了 `name`，推荐使用命名路由跳转。Vue Router 官方文档说明，命名路由可以避免硬编码 URL、自动编码 `params`，并减少 URL 拼写错误。([Vue Router](https://router.vuejs.org/guide/essentials/named-routes.html))

```vue
<template>
  <nav class="menu">
    <RouterLink :to="{ name: 'Dashboard' }">工作台</RouterLink>
    <RouterLink :to="{ name: 'SystemUser' }">用户管理</RouterLink>
    <RouterLink :to="{ name: 'SystemRole' }">角色管理</RouterLink>
  </nav>
</template>
```

在菜单组件中，通常会结合路由配置动态生成导航。

文件位置：`src/components/layout/AppMenu.vue`

```vue
<template>
  <nav class="app-menu">
    <RouterLink
      v-for="item in menus"
      :key="item.path"
      :to="item.path"
      class="app-menu__item"
      active-class="app-menu__item--active"
    >
      {{ item.title }}
    </RouterLink>
  </nav>
</template>

<script setup lang="ts">
interface MenuItem {
  title: string
  path: string
}

defineProps<{
  menus: MenuItem[]
}>()
</script>

<style scoped lang="scss">
.app-menu {
  display: flex;
  flex-direction: column;
  gap: 4px;

  &__item {
    padding: 10px 12px;
    border-radius: 6px;
    color: #374151;
    text-decoration: none;

    &--active {
      color: #1677ff;
      background: #eaf3ff;
    }
  }
}
</style>
```

Vue Router 会给活跃的 `<RouterLink>` 添加激活类。官方文档说明，默认激活类包括 `router-link-active` 和 `router-link-exact-active`，也可以通过 `activeClass`、`exactActiveClass` 或路由实例配置进行调整。([Vue Router](https://router.vuejs.org/guide/essentials/active-links.html))

### 编程式导航

编程式导航适合在 JavaScript 或 TypeScript 逻辑中主动跳转页面。Vue Router 官方文档说明，可以使用路由实例方法进行编程式导航，Composition API 中可以通过 `useRouter()` 获取路由实例。([Vue Router](https://router.vuejs.org/guide/essentials/navigation.html))

文件位置：`src/views/login/index.vue`

```vue
<template>
  <section class="login-page">
    <form class="login-form" @submit.prevent="handleLogin">
      <input v-model="form.username" placeholder="请输入用户名" />
      <input v-model="form.password" type="password" placeholder="请输入密码" />

      <button type="submit">登录</button>
    </form>
  </section>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const form = reactive({
  username: '',
  password: ''
})

async function handleLogin() {
  // 实际项目中这里应调用登录接口，并保存 Token 和用户信息
  const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/dashboard'

  await router.replace(redirect)
}
</script>

<style scoped lang="scss">
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

.login-form {
  display: flex;
  flex-direction: column;
  width: 320px;
  gap: 12px;
}
</style>
```

常见编程式导航方法如下：

| 方法               | 说明                                   | 使用场景                 |
| ------------------ | -------------------------------------- | ------------------------ |
| `router.push()`    | 跳转到新页面，并新增一条浏览器历史记录 | 普通页面跳转、详情页跳转 |
| `router.replace()` | 跳转到新页面，但替换当前历史记录       | 登录成功跳转、重定向跳转 |
| `router.back()`    | 返回上一页                             | 详情页返回、表单取消     |
| `router.forward()` | 前进到下一页                           | 较少使用                 |
| `router.go(n)`     | 在历史记录中前进或后退指定步数         | 特殊历史栈控制           |

列表页跳转详情页示例：

```vue
<template>
  <section>
    <button @click="goDetail('1001')">查看用户 1001</button>
  </section>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function goDetail(id: string) {
  router.push({
    name: 'SystemUserDetail',
    params: {
      id
    }
  })
}
</script>
```

表单保存成功后返回列表页示例：

```typescript
import { useRouter } from 'vue-router'

const router = useRouter()

async function handleSubmit() {
  // 实际项目中这里应调用保存接口
  await router.replace({
    name: 'SystemUser'
  })
}
```

使用 `params` 时建议优先配合命名路由。Vue Router 官方文档说明，如果同时提供 `path` 和 `params`，`params` 会被忽略；如果需要使用参数，应使用 `name + params`，或者自行拼接完整路径。([Vue Router](https://router.vuejs.org/guide/essentials/navigation.html))

推荐写法：

```typescript
router.push({
  name: 'SystemUserDetail',
  params: {
    id: '1001'
  }
})
```

不推荐写法：

```typescript
router.push({
  path: '/system/user/detail',
  params: {
    id: '1001'
  }
})
```

### 路由参数传递

路由参数通常用于表示页面资源身份，例如用户 ID、订单号、文章 ID、文件 ID 等。Vue Router 官方文档说明，动态路由参数使用冒号 `:` 声明，匹配后的参数会暴露到 `route.params` 中。([Vue Router](https://router.vuejs.org/guide/essentials/dynamic-matching.html))

路由配置示例：

```typescript
{
  path: 'user/detail/:id',
  name: 'SystemUserDetail',
  component: () => import('@/views/system/user/detail.vue'),
  meta: {
    title: '用户详情',
    hidden: true,
    activeMenu: '/system/user'
  }
}
```

跳转时传递参数：

```typescript
router.push({
  name: 'SystemUserDetail',
  params: {
    id: '1001'
  }
})
```

页面中读取参数：

文件位置：`src/views/system/user/detail.vue`

```vue
<template>
  <section class="user-detail">
    <h2>用户详情</h2>

    <div class="user-detail__content">
      当前用户 ID：{{ userId }}
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const userId = computed(() => String(route.params.id || ''))

watch(
  () => route.params.id,
  (id) => {
    // 同一个详情组件在不同参数之间切换时，需要重新加载页面数据
    console.log('用户 ID 变化：', id)
  },
  {
    immediate: true
  }
)
</script>

<style scoped lang="scss">
.user-detail {
  &__content {
    margin-top: 16px;
  }
}
</style>
```

需要注意的是，当用户从 `/system/user/detail/1001` 跳转到 `/system/user/detail/1002` 时，Vue Router 可能会复用同一个组件实例。官方文档说明，这种情况下组件实例复用效率更高，但某些生命周期不会重新调用，因此需要监听 `route.params` 变化并重新加载数据。([Vue Router](https://router.vuejs.org/guide/essentials/dynamic-matching.html))

如果希望降低页面组件和路由对象的耦合，也可以通过 `props: true` 将路由参数传给组件。Vue Router 官方文档说明，使用 `props` 可以避免组件直接依赖 `$route` 或 `useRoute()`，从而让组件更容易复用和测试。([Vue Router](https://router.vuejs.org/guide/essentials/passing-props.html))

路由配置：

```typescript
{
  path: 'user/detail/:id',
  name: 'SystemUserDetail',
  component: () => import('@/views/system/user/detail.vue'),
  props: true,
  meta: {
    title: '用户详情'
  }
}
```

页面组件：

```vue
<template>
  <section>
    用户 ID：{{ id }}
  </section>
</template>

<script setup lang="ts">
defineProps<{
  id: string
}>()
</script>
```

这种方式适合详情页、预览页、编辑页等参数明确的页面。

### 查询参数传递

查询参数通常用于表示页面状态，而不是资源身份。例如列表页搜索关键字、分页页码、每页条数、排序字段、筛选状态、来源页面等，都适合使用 query 参数。Vue Router 的路由对象中也提供 `route.query` 用于读取 URL 中的查询参数。([Vue Router](https://router.vuejs.org/guide/essentials/dynamic-matching.html))

列表页跳转并携带查询条件：

```typescript
router.push({
  name: 'SystemUser',
  query: {
    keyword: 'admin',
    page: '1',
    pageSize: '20'
  }
})
```

对应 URL 示例：

```text
/system/user?keyword=admin&page=1&pageSize=20
```

页面中读取 query 参数：

文件位置：`src/views/system/user/index.vue`

```vue
<template>
  <section class="user-list">
    <form class="user-list__search" @submit.prevent="handleSearch">
      <input v-model="searchForm.keyword" placeholder="请输入用户名" />
      <button type="submit">查询</button>
      <button type="button" @click="handleReset">重置</button>
    </form>

    <div class="user-list__result">
      当前查询条件：{{ searchForm.keyword || '无' }}
    </div>
  </section>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const searchForm = reactive({
  keyword: '',
  page: 1,
  pageSize: 20
})

function syncQueryToForm() {
  searchForm.keyword = typeof route.query.keyword === 'string' ? route.query.keyword : ''
  searchForm.page = Number(route.query.page || 1)
  searchForm.pageSize = Number(route.query.pageSize || 20)
}

function handleSearch() {
  router.push({
    name: 'SystemUser',
    query: {
      keyword: searchForm.keyword || undefined,
      page: String(searchForm.page),
      pageSize: String(searchForm.pageSize)
    }
  })
}

function handleReset() {
  router.push({
    name: 'SystemUser',
    query: {
      page: '1',
      pageSize: '20'
    }
  })
}

watch(
  () => route.query,
  () => {
    syncQueryToForm()

    // 实际项目中这里应调用列表接口
    console.log('查询参数变化，重新加载用户列表：', route.query)
  },
  {
    immediate: true
  }
)
</script>

<style scoped lang="scss">
.user-list {
  &__search {
    display: flex;
    gap: 8px;
  }

  &__result {
    margin-top: 16px;
  }
}
</style>
```

`params` 和 `query` 的使用区别如下：

| 类型     | 适合内容                       | 示例                              | 刷新后是否保留 |
| -------- | ------------------------------ | --------------------------------- | -------------- |
| `params` | 资源身份、详情页主键           | `/user/detail/1001`               | 保留           |
| `query`  | 搜索条件、分页、排序、筛选状态 | `/user/list?page=1&keyword=admin` | 保留           |

实际项目中建议遵循以下规则：

1. 详情页 ID、订单号、文章 ID 等资源唯一标识使用 `params`。
2. 列表页搜索条件、分页参数、排序字段使用 `query`。
3. 登录后回跳地址可以使用 `query.redirect`。
4. 不要把敏感数据放到 `params` 或 `query` 中，例如 Token、密码、身份证号等。
5. query 参数读取出来通常是字符串或字符串数组，使用前需要自行转换类型。



## 路由守卫

路由守卫用于在路由跳转过程中执行拦截、校验和收尾逻辑。常见用途包括登录状态校验、页面权限判断、动态路由加载、页面标题设置、进度条控制、离开页面确认和参数变化处理等。

在 Vue3 项目中，路由守卫一般分为全局守卫、路由独享守卫和组件内守卫。全局守卫适合处理项目级逻辑，路由独享守卫适合处理某个页面的特殊访问规则，组件内守卫适合处理页面内部的数据加载、离开确认和参数变化。

### 全局前置守卫

全局前置守卫会在每次路由跳转前执行，适合统一处理登录校验、权限校验、动态路由加载和重定向逻辑。实际项目中，最常见的写法是在 `src/router/guard.ts` 中集中注册守卫。

文件位置：`src/utils/auth.ts`

```typescript
const TOKEN_KEY = 'ACCESS_TOKEN'

/**
 * 获取登录 Token
 */
export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

/**
 * 保存登录 Token
 */
export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token)
}

/**
 * 移除登录 Token
 */
export function removeToken() {
  localStorage.removeItem(TOKEN_KEY)
}

/**
 * 判断用户是否已登录
 */
export function isLogin() {
  return Boolean(getToken())
}
```

下面的代码用于注册全局前置守卫，统一完成页面标题设置、白名单放行、登录状态校验和权限校验。

文件位置：`src/router/guard.ts`

```typescript
import type { Router } from 'vue-router'
import { isLogin } from '@/utils/auth'
import { useUserStore } from '@/stores/user'
import { hasRoutePermission } from '@/utils/permission'

const DEFAULT_TITLE = '后台管理系统'

const WHITE_LIST = ['/login', '/403', '/404']

/**
 * 注册路由守卫
 */
export function setupRouterGuard(router: Router) {
  router.beforeEach(async (to) => {
    document.title = to.meta.title ? `${to.meta.title} - ${DEFAULT_TITLE}` : DEFAULT_TITLE

    // 白名单页面不需要登录校验
    if (WHITE_LIST.includes(to.path)) {
      return true
    }

    // 未登录访问受保护页面，跳转登录页并记录原始访问地址
    if (!isLogin()) {
      return {
        path: '/login',
        query: {
          redirect: to.fullPath
        },
        replace: true
      }
    }

    const userStore = useUserStore()

    // 刷新页面后 Pinia 状态会丢失，需要重新获取用户信息和权限数据
    if (!userStore.loaded) {
      await userStore.loadUserInfo()
    }

    // 页面权限校验
    if (!hasRoutePermission(to, userStore.permissions, userStore.roles)) {
      return {
        path: '/403',
        replace: true
      }
    }

    return true
  })
}
```

文件位置：`src/router/index.ts`

```typescript
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'
import { setupRouterGuard } from './guard'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return {
      top: 0,
      left: 0
    }
  }
})

// 注册全局路由守卫
setupRouterGuard(router)

export default router
```

全局前置守卫中不建议直接写大量业务逻辑。登录状态、用户信息、权限判断、动态菜单生成等逻辑应拆分到 `utils`、`stores` 或独立服务中，守卫只负责调度。

### 全局后置守卫

全局后置守卫会在路由跳转完成后执行，适合处理页面访问统计、关闭进度条、记录访问日志、更新标签页、恢复滚动状态等收尾逻辑。

如果项目使用进度条，可以在全局前置守卫中开启，在全局后置守卫中关闭。下面示例不强制依赖第三方库，只演示后置守卫的常见职责。

文件位置：`src/router/guard.ts`

```typescript
import type { Router } from 'vue-router'
import { isLogin } from '@/utils/auth'
import { useUserStore } from '@/stores/user'
import { hasRoutePermission } from '@/utils/permission'

const DEFAULT_TITLE = '后台管理系统'
const WHITE_LIST = ['/login', '/403', '/404']

/**
 * 注册路由守卫
 */
export function setupRouterGuard(router: Router) {
  router.beforeEach(async (to) => {
    document.title = to.meta.title ? `${to.meta.title} - ${DEFAULT_TITLE}` : DEFAULT_TITLE

    if (WHITE_LIST.includes(to.path)) {
      return true
    }

    if (!isLogin()) {
      return {
        path: '/login',
        query: {
          redirect: to.fullPath
        },
        replace: true
      }
    }

    const userStore = useUserStore()

    if (!userStore.loaded) {
      await userStore.loadUserInfo()
    }

    if (!hasRoutePermission(to, userStore.permissions, userStore.roles)) {
      return {
        path: '/403',
        replace: true
      }
    }

    return true
  })

  router.afterEach((to) => {
    // 可在这里记录页面访问行为，或更新标签页、面包屑、页面缓存状态
    console.log('路由跳转完成：', to.fullPath)
  })

  router.onError((error) => {
    // 路由懒加载失败、动态导入失败等异常可以在这里统一处理
    console.error('路由跳转异常：', error)
  })
}
```

全局后置守卫没有 `next` 或返回重定向的能力，它更适合做“跳转完成后”的处理。如果需要阻止页面访问或进行重定向，应放在全局前置守卫、路由独享守卫或组件内守卫中。

常见全局后置守卫使用场景如下：

| 场景         | 说明                                   |
| ------------ | -------------------------------------- |
| 访问日志     | 记录用户进入了哪个页面                 |
| 页面统计     | 上报埋点数据                           |
| 标签页更新   | 根据当前路由添加访问标签               |
| 进度条关闭   | 页面跳转完成后关闭加载进度             |
| 页面标题确认 | 某些场景下二次修正标题                 |
| 异常处理     | 结合 `router.onError()` 处理懒加载失败 |

### 路由独享守卫

路由独享守卫是配置在某个路由记录上的守卫，只对该路由生效。它适合处理单个页面或单个模块的特殊访问规则，例如某个页面必须是管理员访问、某个页面需要检查业务状态、某个详情页需要提前校验参数合法性。

文件位置：`src/router/modules/system.ts`

```typescript
import type { RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/stores/user'

export const systemRoutes: RouteRecordRaw[] = [
  {
    path: 'system',
    name: 'System',
    redirect: '/system/user',
    meta: {
      title: '系统管理',
      icon: 'Setting',
      requiresAuth: true
    },
    children: [
      {
        path: 'user',
        name: 'SystemUser',
        component: () => import('@/views/system/user/index.vue'),
        meta: {
          title: '用户管理',
          requiresAuth: true,
          permissions: ['system:user:list']
        }
      },
      {
        path: 'role',
        name: 'SystemRole',
        component: () => import('@/views/system/role/index.vue'),
        meta: {
          title: '角色管理',
          requiresAuth: true,
          permissions: ['system:role:list']
        },
        beforeEnter: () => {
          const userStore = useUserStore()

          // 角色管理页面只允许管理员角色访问
          if (!userStore.roles.includes('admin')) {
            return {
              path: '/403',
              replace: true
            }
          }

          return true
        }
      }
    ]
  }
]
```

路由独享守卫适合处理页面级特殊逻辑，但不建议滥用。如果多个页面都需要相同校验，应抽取到全局前置守卫或公共权限函数中，避免重复配置。

### 组件内守卫

组件内守卫写在页面组件中，适合处理与页面自身强相关的逻辑。Vue3 Composition API 中常用 `onBeforeRouteUpdate` 和 `onBeforeRouteLeave`。

`onBeforeRouteUpdate` 适合处理同一个组件被复用时的参数变化。例如从 `/system/user/detail/1001` 跳转到 `/system/user/detail/1002`，页面组件可能不会重新创建，此时需要监听路由参数变化并重新加载详情数据。

文件位置：`src/views/system/user/detail.vue`

```vue
<template>
  <section class="user-detail">
    <h2>用户详情</h2>

    <div class="user-detail__content">
      当前用户 ID：{{ userId }}
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onBeforeRouteUpdate, useRoute } from 'vue-router'

const route = useRoute()

const userId = ref(String(route.params.id || ''))

function loadUserDetail(id: string) {
  // 实际项目中这里调用用户详情接口
  userId.value = id
  console.log('加载用户详情：', id)
}

loadUserDetail(userId.value)

onBeforeRouteUpdate((to) => {
  const nextUserId = String(to.params.id || '')

  // 路由参数变化时重新加载详情
  loadUserDetail(nextUserId)
})
</script>

<style scoped lang="scss">
.user-detail {
  &__content {
    margin-top: 16px;
  }
}
</style>
```

`onBeforeRouteLeave` 适合处理离开页面前确认。例如表单页存在未保存内容时，提醒用户确认是否离开。

文件位置：`src/views/system/user/form.vue`

```vue
<template>
  <section class="user-form">
    <h2>用户表单</h2>

    <input v-model="form.username" placeholder="请输入用户名" />
    <input v-model="form.nickname" placeholder="请输入昵称" />
  </section>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'

const changed = ref(false)

const form = reactive({
  username: '',
  nickname: ''
})

watch(
  form,
  () => {
    changed.value = true
  },
  {
    deep: true
  }
)

onBeforeRouteLeave(() => {
  if (!changed.value) {
    return true
  }

  // 表单内容已修改，离开前提示用户确认
  return window.confirm('当前表单内容尚未保存，确认离开吗？')
})
</script>

<style scoped lang="scss">
.user-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
```

组件内守卫应只处理页面自身逻辑，不建议在组件内重复编写全局登录校验和通用权限校验。通用访问控制应放在全局守卫中统一维护。

## 权限控制

权限控制用于保证用户只能访问自己有权限的页面和功能。前端权限控制通常包括登录状态校验、页面访问权限控制、动态菜单生成和动态路由加载。需要注意的是，前端权限控制主要用于提升用户体验，不能替代后端接口权限校验。真正的数据安全必须由后端接口完成鉴权。

### 登录状态校验

登录状态校验通常通过 Token 或 Session 状态判断用户是否已经登录。对于前后端分离项目，前端常见做法是登录成功后保存 Token，后续进入受保护页面时在路由守卫中检查 Token 是否存在。

登录成功后保存 Token，并根据 `redirect` 参数跳转到用户原本想访问的页面。

文件位置：`src/views/login/index.vue`

```vue
<template>
  <section class="login-page">
    <form class="login-form" @submit.prevent="handleLogin">
      <input v-model="form.username" placeholder="请输入用户名" />
      <input v-model="form.password" type="password" placeholder="请输入密码" />
      <button type="submit">登录</button>
    </form>
  </section>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { setToken } from '@/utils/auth'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const form = reactive({
  username: '',
  password: ''
})

async function handleLogin() {
  // 实际项目中这里应调用登录接口
  const token = 'mock-token'

  setToken(token)

  // 登录后加载用户信息、角色和权限
  await userStore.loadUserInfo()

  const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/dashboard'

  await router.replace(redirect)
}
</script>

<style scoped lang="scss">
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

.login-form {
  display: flex;
  flex-direction: column;
  width: 320px;
  gap: 12px;
}
</style>
```

用户退出登录时，需要清理 Token、用户信息、权限数据，并跳转登录页。

文件位置：`src/stores/user.ts`

```typescript
import { defineStore } from 'pinia'
import { removeToken } from '@/utils/auth'

interface UserInfo {
  id: string
  username: string
  nickname: string
}

export const useUserStore = defineStore('user', {
  state: () => ({
    loaded: false,
    userInfo: null as UserInfo | null,
    roles: [] as string[],
    permissions: [] as string[]
  }),

  actions: {
    async loadUserInfo() {
      // 实际项目中这里应调用用户信息接口
      this.userInfo = {
        id: '1001',
        username: 'admin',
        nickname: '系统管理员'
      }

      this.roles = ['admin']

      this.permissions = [
        'dashboard:view',
        'system:user:list',
        'system:user:detail',
        'system:user:add',
        'system:user:update',
        'system:role:list'
      ]

      this.loaded = true
    },

    logout() {
      removeToken()

      this.loaded = false
      this.userInfo = null
      this.roles = []
      this.permissions = []
    }
  }
})
```

退出登录按钮示例：

```vue
<template>
  <button type="button" @click="handleLogout">退出登录</button>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

function handleLogout() {
  userStore.logout()

  router.replace('/login')
}
</script>
```

登录状态校验的一般流程如下：

1. 用户访问页面。
2. 路由守卫判断当前路径是否在白名单中。
3. 如果是白名单页面，直接放行。
4. 如果不是白名单页面，检查 Token 是否存在。
5. Token 不存在，跳转登录页，并携带 `redirect` 参数。
6. Token 存在，加载用户信息和权限数据。
7. 校验通过后进入目标页面。

### 页面访问权限控制

页面访问权限控制通常基于路由 `meta.permissions` 或 `meta.roles` 实现。每个路由配置当前页面需要的权限标识，用户登录后从后端获取自己的权限列表，路由守卫根据两者进行匹配。

文件位置：`src/utils/permission.ts`

```typescript
import type { RouteLocationNormalized } from 'vue-router'

/**
 * 判断当前路由是否有访问权限
 */
export function hasRoutePermission(
  route: RouteLocationNormalized,
  permissions: string[],
  roles: string[]
) {
  const routePermissions = route.meta.permissions || []
  const routeRoles = route.meta.roles || []

  // 未配置权限和角色，默认允许访问
  if (routePermissions.length === 0 && routeRoles.length === 0) {
    return true
  }

  // admin 角色默认拥有全部页面权限
  if (roles.includes('admin')) {
    return true
  }

  // 角色匹配则允许访问
  if (routeRoles.length > 0 && routeRoles.some((role) => roles.includes(role))) {
    return true
  }

  // 权限标识匹配则允许访问
  if (routePermissions.length > 0 && routePermissions.some((permission) => permissions.includes(permission))) {
    return true
  }

  return false
}
```

路由中配置页面权限：

```typescript
{
  path: 'user',
  name: 'SystemUser',
  component: () => import('@/views/system/user/index.vue'),
  meta: {
    title: '用户管理',
    requiresAuth: true,
    permissions: ['system:user:list']
  }
}
```

如果某个页面允许多个权限访问，可以配置多个权限标识：

```typescript
{
  path: 'user/form',
  name: 'SystemUserForm',
  component: () => import('@/views/system/user/form.vue'),
  meta: {
    title: '用户表单',
    requiresAuth: true,
    hidden: true,
    activeMenu: '/system/user',
    permissions: ['system:user:add', 'system:user:update']
  }
}
```

页面访问权限控制建议遵循以下规则：

| 规则                               | 说明                             |
| ---------------------------------- | -------------------------------- |
| 页面级权限放在 `meta.permissions`  | 用于控制能否进入页面             |
| 角色级权限放在 `meta.roles`        | 用于简单角色控制，例如管理员页面 |
| 按钮级权限不要直接写死在路由守卫中 | 应通过指令、函数或组件控制       |
| 前端权限不能替代后端权限           | 后端接口必须再次校验用户权限     |
| 无权限页面统一跳转 `/403`          | 方便用户理解访问失败原因         |

按钮级权限可以通过工具函数简单处理。

文件位置：`src/utils/permission.ts`

```typescript
import type { RouteLocationNormalized } from 'vue-router'

/**
 * 判断当前路由是否有访问权限
 */
export function hasRoutePermission(
  route: RouteLocationNormalized,
  permissions: string[],
  roles: string[]
) {
  const routePermissions = route.meta.permissions || []
  const routeRoles = route.meta.roles || []

  if (routePermissions.length === 0 && routeRoles.length === 0) {
    return true
  }

  if (roles.includes('admin')) {
    return true
  }

  if (routeRoles.length > 0 && routeRoles.some((role) => roles.includes(role))) {
    return true
  }

  if (routePermissions.length > 0 && routePermissions.some((permission) => permissions.includes(permission))) {
    return true
  }

  return false
}

/**
 * 判断是否拥有指定按钮权限
 */
export function hasPermission(userPermissions: string[], permission: string) {
  return userPermissions.includes(permission)
}
```

按钮中使用：

```vue
<template>
  <section>
    <button v-if="canAdd" type="button">新增用户</button>
    <button v-if="canDelete" type="button">删除用户</button>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { hasPermission } from '@/utils/permission'

const userStore = useUserStore()

const canAdd = computed(() => hasPermission(userStore.permissions, 'system:user:add'))
const canDelete = computed(() => hasPermission(userStore.permissions, 'system:user:delete'))
</script>
```

### 动态菜单与路由权限

动态菜单与路由权限通常用于后台管理系统。用户登录后，后端返回当前用户可访问的菜单、权限和角色，前端根据这些数据生成侧边栏菜单，并动态注册用户可访问的路由。

常见实现方式有两种：

| 方式                                       | 说明                                       | 适用场景                   |
| ------------------------------------------ | ------------------------------------------ | -------------------------- |
| 前端维护完整路由，后端返回权限标识         | 前端根据 `meta.permissions` 过滤路由和菜单 | 中小型后台、路由变化不频繁 |
| 后端返回菜单和路由结构，前端动态转换为路由 | 前端根据后端菜单生成路由配置               | 权限复杂、菜单需要后台配置 |

如果项目页面结构由前端维护，推荐使用“前端完整路由 + 后端权限过滤”的方式。这样类型更清晰，组件路径更可控，也更方便前端开发维护。

文件位置：`src/router/asyncRoutes.ts`

```typescript
import type { RouteRecordRaw } from 'vue-router'

export const asyncRoutes: RouteRecordRaw[] = [
  {
    path: '/system',
    name: 'System',
    redirect: '/system/user',
    meta: {
      title: '系统管理',
      icon: 'Setting',
      requiresAuth: true
    },
    children: [
      {
        path: '/system/user',
        name: 'SystemUser',
        component: () => import('@/views/system/user/index.vue'),
        meta: {
          title: '用户管理',
          icon: 'User',
          requiresAuth: true,
          permissions: ['system:user:list']
        }
      },
      {
        path: '/system/role',
        name: 'SystemRole',
        component: () => import('@/views/system/role/index.vue'),
        meta: {
          title: '角色管理',
          icon: 'Avatar',
          requiresAuth: true,
          permissions: ['system:role:list']
        }
      }
    ]
  },
  {
    path: '/order',
    name: 'Order',
    redirect: '/order/list',
    meta: {
      title: '订单管理',
      icon: 'Document',
      requiresAuth: true
    },
    children: [
      {
        path: '/order/list',
        name: 'OrderList',
        component: () => import('@/views/order/list.vue'),
        meta: {
          title: '订单列表',
          icon: 'List',
          requiresAuth: true,
          permissions: ['order:list']
        }
      }
    ]
  }
]
```

下面的代码根据用户权限过滤可访问路由，并生成菜单数据。

文件位置：`src/router/permission.ts`

```typescript
import type { RouteRecordRaw } from 'vue-router'

export interface MenuItem {
  title: string
  path: string
  icon?: string
  children?: MenuItem[]
}

/**
 * 判断路由是否有权限
 */
function hasPermission(route: RouteRecordRaw, permissions: string[], roles: string[]) {
  const routePermissions = route.meta?.permissions as string[] | undefined
  const routeRoles = route.meta?.roles as string[] | undefined

  if (roles.includes('admin')) {
    return true
  }

  if ((!routePermissions || routePermissions.length === 0) && (!routeRoles || routeRoles.length === 0)) {
    return true
  }

  if (routeRoles?.some((role) => roles.includes(role))) {
    return true
  }

  if (routePermissions?.some((permission) => permissions.includes(permission))) {
    return true
  }

  return false
}

/**
 * 根据权限过滤路由
 */
export function filterRoutesByPermission(
  routes: RouteRecordRaw[],
  permissions: string[],
  roles: string[]
): RouteRecordRaw[] {
  const result: RouteRecordRaw[] = []

  routes.forEach((route) => {
    if (!hasPermission(route, permissions, roles)) {
      return
    }

    const currentRoute: RouteRecordRaw = {
      ...route
    }

    if (route.children?.length) {
      currentRoute.children = filterRoutesByPermission(route.children, permissions, roles)
    }

    result.push(currentRoute)
  })

  return result
}

/**
 * 根据路由生成菜单
 */
export function buildMenusByRoutes(routes: RouteRecordRaw[]): MenuItem[] {
  return routes
    .filter((route) => !route.meta?.hidden)
    .map((route) => {
      const menu: MenuItem = {
        title: String(route.meta?.title || route.name || route.path),
        path: route.path,
        icon: route.meta?.icon as string | undefined
      }

      if (route.children?.length) {
        menu.children = buildMenusByRoutes(route.children)
      }

      return menu
    })
}
```

在 Pinia 中保存动态路由和菜单。

文件位置：`src/stores/permission.ts`

```typescript
import { defineStore } from 'pinia'
import type { RouteRecordRaw } from 'vue-router'
import { asyncRoutes } from '@/router/asyncRoutes'
import {
  buildMenusByRoutes,
  filterRoutesByPermission,
  type MenuItem
} from '@/router/permission'

export const usePermissionStore = defineStore('permission', {
  state: () => ({
    routes: [] as RouteRecordRaw[],
    menus: [] as MenuItem[],
    loaded: false
  }),

  actions: {
    generateRoutes(permissions: string[], roles: string[]) {
      const accessedRoutes = filterRoutesByPermission(asyncRoutes, permissions, roles)

      this.routes = accessedRoutes
      this.menus = buildMenusByRoutes(accessedRoutes)
      this.loaded = true

      return accessedRoutes
    },

    reset() {
      this.routes = []
      this.menus = []
      this.loaded = false
    }
  }
})
```

在路由守卫中动态注册路由。

文件位置：`src/router/guard.ts`

```typescript
import type { Router } from 'vue-router'
import { isLogin } from '@/utils/auth'
import { useUserStore } from '@/stores/user'
import { usePermissionStore } from '@/stores/permission'

const DEFAULT_TITLE = '后台管理系统'
const WHITE_LIST = ['/login', '/403', '/404']

/**
 * 注册路由守卫
 */
export function setupRouterGuard(router: Router) {
  router.beforeEach(async (to) => {
    document.title = to.meta.title ? `${to.meta.title} - ${DEFAULT_TITLE}` : DEFAULT_TITLE

    if (WHITE_LIST.includes(to.path)) {
      return true
    }

    if (!isLogin()) {
      return {
        path: '/login',
        query: {
          redirect: to.fullPath
        },
        replace: true
      }
    }

    const userStore = useUserStore()
    const permissionStore = usePermissionStore()

    if (!userStore.loaded) {
      await userStore.loadUserInfo()
    }

    if (!permissionStore.loaded) {
      const accessedRoutes = permissionStore.generateRoutes(userStore.permissions, userStore.roles)

      accessedRoutes.forEach((route) => {
        router.addRoute(route)
      })

      // 动态路由添加后，需要重新进入当前地址，确保新注册的路由可以被匹配
      return {
        ...to,
        replace: true
      }
    }

    return true
  })
}
```

动态菜单组件可以直接读取 `permissionStore.menus` 渲染。

文件位置：`src/components/layout/AppMenu.vue`

```vue
<template>
  <nav class="app-menu">
    <template v-for="item in menus" :key="item.path">
      <RouterLink
        v-if="!item.children?.length"
        :to="item.path"
        class="app-menu__item"
        active-class="app-menu__item--active"
      >
        {{ item.title }}
      </RouterLink>

      <div v-else class="app-menu__group">
        <div class="app-menu__group-title">{{ item.title }}</div>

        <RouterLink
          v-for="child in item.children"
          :key="child.path"
          :to="child.path"
          class="app-menu__item"
          active-class="app-menu__item--active"
        >
          {{ child.title }}
        </RouterLink>
      </div>
    </template>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePermissionStore } from '@/stores/permission'

const permissionStore = usePermissionStore()

const menus = computed(() => permissionStore.menus)
</script>

<style scoped lang="scss">
.app-menu {
  display: flex;
  flex-direction: column;
  gap: 4px;

  &__group {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &__group-title {
    padding: 10px 12px;
    font-weight: 600;
    color: #111827;
  }

  &__item {
    padding: 10px 12px;
    border-radius: 6px;
    color: #374151;
    text-decoration: none;

    &--active {
      color: #1677ff;
      background: #eaf3ff;
    }
  }
}
</style>
```

动态菜单与路由权限开发时需要注意以下几点：

1. 动态路由添加后，通常需要 `replace` 当前路由，否则刷新页面时可能出现路由未匹配。
2. 后端返回的权限标识应与前端 `meta.permissions` 保持一致。
3. 菜单隐藏不等于无权限，`meta.hidden` 只控制菜单显示，不应替代权限判断。
4. 详情页、表单页通常设置 `hidden: true`，但仍然需要配置权限。
5. 动态菜单只控制前端入口，后端接口必须独立做权限校验。
6. 用户退出登录时，需要清空 Token、用户信息、动态路由状态和菜单状态。



## 路由与状态管理

路由与状态管理主要解决页面访问状态、用户操作状态和全局业务状态之间的同步问题。在 Vue3 项目中，路由负责表达当前访问位置，Pinia 负责保存用户信息、权限数据、菜单数据、标签页数据和部分页面状态。两者配合使用，可以让页面刷新、回退、复制链接和重新进入时保持较好的状态一致性。

### 路由信息读取

在 Vue3 Composition API 中，页面组件通常通过 `useRoute()` 读取当前路由信息，通过 `useRouter()` 执行路由跳转。`useRoute()` 返回当前路由对象，可以读取 `path`、`fullPath`、`name`、`params`、`query` 和 `meta` 等信息。

常见路由信息如下：

| 属性             | 说明                       | 示例                              |
| ---------------- | -------------------------- | --------------------------------- |
| `route.path`     | 当前路由路径，不包含 query | `/system/user`                    |
| `route.fullPath` | 完整路径，包含 query       | `/system/user?page=1`             |
| `route.name`     | 当前路由名称               | `SystemUser`                      |
| `route.params`   | 动态路由参数               | `{ id: '1001' }`                  |
| `route.query`    | 查询参数                   | `{ page: '1', keyword: 'admin' }` |
| `route.meta`     | 路由元信息                 | `{ title: '用户管理' }`           |

文件位置：`src/views/system/user/detail.vue`

下面的页面示例用于读取详情页动态参数，并根据参数加载用户详情数据。

```vue
<template>
  <section class="user-detail">
    <h2>{{ pageTitle }}</h2>

    <div class="user-detail__content">
      <p>当前用户 ID：{{ userId }}</p>
      <p>当前路由路径：{{ route.path }}</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const userId = computed(() => String(route.params.id || ''))
const pageTitle = computed(() => String(route.meta.title || '用户详情'))

function loadUserDetail(id: string) {
  if (!id) {
    console.warn('用户 ID 为空，无法加载详情')
    return
  }

  // 实际项目中这里调用用户详情接口
  console.log('加载用户详情：', id)
}

watch(
  () => route.params.id,
  (id) => {
    loadUserDetail(String(id || ''))
  },
  {
    immediate: true
  }
)
</script>

<style scoped lang="scss">
.user-detail {
  &__content {
    margin-top: 16px;
  }
}
</style>
```

读取路由信息时需要注意，`params` 和 `query` 中的数据通常是字符串或字符串数组，使用前应进行类型转换。例如分页页码需要转成数字，布尔状态需要转成 `true` 或 `false`，日期范围需要校验格式。

### 路由状态同步

路由状态同步是指将页面中的查询条件、分页参数、排序字段、当前标签页等状态同步到 URL 或 Pinia 中。这样做可以让页面具备可刷新、可回退、可复制链接的能力。

对于列表页，推荐将搜索条件、分页参数和排序参数同步到 `query` 中。对于用户信息、权限、菜单、标签页等全局状态，推荐存储到 Pinia 中。

文件位置：`src/views/system/user/index.vue`

下面的页面示例用于将用户列表查询条件同步到路由 query 中，并在 query 变化时重新加载列表。

```vue
<template>
  <section class="user-list">
    <form class="user-list__search" @submit.prevent="handleSearch">
      <input v-model="searchForm.keyword" placeholder="请输入用户名" />

      <select v-model="searchForm.status">
        <option value="">全部状态</option>
        <option value="enabled">启用</option>
        <option value="disabled">禁用</option>
      </select>

      <button type="submit">查询</button>
      <button type="button" @click="handleReset">重置</button>
    </form>

    <div class="user-list__content">
      当前查询条件：{{ searchForm }}
    </div>
  </section>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const searchForm = reactive({
  keyword: '',
  status: '',
  page: 1,
  pageSize: 20
})

function syncQueryToForm() {
  searchForm.keyword = typeof route.query.keyword === 'string' ? route.query.keyword : ''
  searchForm.status = typeof route.query.status === 'string' ? route.query.status : ''
  searchForm.page = Number(route.query.page || 1)
  searchForm.pageSize = Number(route.query.pageSize || 20)
}

function loadUserList() {
  // 实际项目中这里调用用户列表接口
  console.log('加载用户列表：', {
    keyword: searchForm.keyword,
    status: searchForm.status,
    page: searchForm.page,
    pageSize: searchForm.pageSize
  })
}

function handleSearch() {
  router.push({
    name: 'SystemUser',
    query: {
      keyword: searchForm.keyword || undefined,
      status: searchForm.status || undefined,
      page: String(searchForm.page),
      pageSize: String(searchForm.pageSize)
    }
  })
}

function handleReset() {
  router.push({
    name: 'SystemUser',
    query: {
      page: '1',
      pageSize: '20'
    }
  })
}

watch(
  () => route.query,
  () => {
    syncQueryToForm()
    loadUserList()
  },
  {
    immediate: true
  }
)
</script>

<style scoped lang="scss">
.user-list {
  &__search {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  &__content {
    margin-top: 16px;
  }
}
</style>
```

路由状态同步建议遵循以下规则：

| 状态类型     | 推荐存储位置 | 示例                                   |
| ------------ | ------------ | -------------------------------------- |
| 详情页 ID    | `params`     | `/user/detail/1001`                    |
| 搜索条件     | `query`      | `?keyword=admin`                       |
| 分页参数     | `query`      | `?page=1&pageSize=20`                  |
| 排序参数     | `query`      | `?sortField=createTime&sortOrder=desc` |
| 登录用户信息 | Pinia        | `userStore.userInfo`                   |
| 用户权限     | Pinia        | `userStore.permissions`                |
| 动态菜单     | Pinia        | `permissionStore.menus`                |
| 多标签页     | Pinia        | `tabsStore.tabs`                       |

不建议把复杂对象直接放到 query 中。如果页面状态较复杂，可以只把核心检索条件放到 URL 中，复杂临时状态放在 Pinia 或页面组件内部。

### 页面刷新后的状态恢复

页面刷新后，Vue 组件状态和 Pinia 内存状态会重新初始化，但 URL 仍然保留。因此，页面刷新后的状态恢复通常依赖两类数据：一类是 URL 中的 `params` 和 `query`，另一类是本地持久化存储中的 Token、用户信息或缓存状态。

常见恢复流程如下：

1. 应用重新加载。
2. 路由实例初始化。
3. 全局前置守卫检查 Token。
4. Token 存在时，重新请求用户信息、角色和权限。
5. 重新生成动态路由和动态菜单。
6. 重新进入当前页面。
7. 页面根据 `params` 或 `query` 恢复查询条件并加载数据。

文件位置：`src/router/guard.ts`

下面的守卫示例用于在刷新页面后恢复用户信息和动态路由。

```typescript
import type { Router } from 'vue-router'
import { isLogin } from '@/utils/auth'
import { useUserStore } from '@/stores/user'
import { usePermissionStore } from '@/stores/permission'

const WHITE_LIST = ['/login', '/403', '/404']

export function setupRouterGuard(router: Router) {
  router.beforeEach(async (to) => {
    if (WHITE_LIST.includes(to.path)) {
      return true
    }

    if (!isLogin()) {
      return {
        path: '/login',
        query: {
          redirect: to.fullPath
        },
        replace: true
      }
    }

    const userStore = useUserStore()
    const permissionStore = usePermissionStore()

    if (!userStore.loaded) {
      await userStore.loadUserInfo()
    }

    if (!permissionStore.loaded) {
      const accessedRoutes = permissionStore.generateRoutes(userStore.permissions, userStore.roles)

      accessedRoutes.forEach((route) => {
        router.addRoute(route)
      })

      return {
        ...to,
        replace: true
      }
    }

    return true
  })
}
```

如果项目需要刷新后保留 Pinia 中的部分状态，可以使用本地存储进行持久化。例如用户主题、菜单折叠状态、标签页列表等可以保存到 `localStorage`。但用户权限、用户信息和菜单结构更建议刷新后重新从后端获取，避免本地缓存过期或被篡改。

## 路由开发规范

路由开发规范用于统一路径、命名、文件拆分、元信息和页面标题配置方式。规范的路由结构可以降低多人协作成本，也便于后续接入权限控制、动态菜单、面包屑、标签页和页面缓存。

### 路由命名规范

路由名称通过 `name` 字段定义，建议全局唯一，并使用 PascalCase 风格。命名时应体现模块和页面含义，避免使用过短、重复或无业务含义的名称。

推荐命名示例：

| 页面     | 推荐路由名称       |
| -------- | ------------------ |
| 工作台   | `Dashboard`        |
| 用户管理 | `SystemUser`       |
| 用户详情 | `SystemUserDetail` |
| 用户表单 | `SystemUserForm`   |
| 角色管理 | `SystemRole`       |
| 订单列表 | `OrderList`        |
| 订单详情 | `OrderDetail`      |

不推荐命名：

```typescript
{
  name: 'List'
}

{
  name: 'Detail'
}

{
  name: 'Page1'
}
```

推荐命名：

```typescript
{
  path: 'user',
  name: 'SystemUser',
  component: () => import('@/views/system/user/index.vue'),
  meta: {
    title: '用户管理'
  }
}
```

路由命名建议遵循以下规则：

1. 使用 PascalCase，例如 `SystemUserDetail`。
2. 名称应包含业务模块，例如 `System`、`Order`、`Product`。
3. 详情页使用 `Detail` 后缀。
4. 表单页使用 `Form`、`Create` 或 `Edit` 后缀。
5. 列表页可以使用 `List` 后缀，也可以使用模块名本身。
6. 不允许多个路由使用相同 `name`。
7. 编程式导航优先使用 `name + params`，减少硬编码路径。

### 路由路径规范

路由路径通过 `path` 字段定义，建议使用小写字母，并根据业务模块进行层级划分。路径应简洁、稳定、可读，不建议频繁变化。

推荐路径示例：

| 页面     | 推荐路径                  |
| -------- | ------------------------- |
| 工作台   | `/dashboard`              |
| 用户管理 | `/system/user`            |
| 用户详情 | `/system/user/detail/:id` |
| 用户表单 | `/system/user/form`       |
| 角色管理 | `/system/role`            |
| 订单列表 | `/order/list`             |
| 订单详情 | `/order/detail/:orderNo`  |

不推荐路径：

```text
/System/UserList
/userManagementPage
/page1
/detail
```

推荐路径：

```text
/system/user
/system/user/detail/:id
/order/detail/:orderNo
```

路径设计建议如下：

1. 全部使用小写字母。
2. 多个单词使用中划线或目录层级，不建议使用驼峰。
3. 一级路径表示业务域，例如 `/system`、`/order`、`/product`。
4. 二级路径表示业务资源，例如 `/system/user`、`/system/role`。
5. 详情页主键使用动态参数，例如 `/order/detail/:orderNo`。
6. 查询条件使用 query，不要强行塞进 path。
7. 已发布的路径不要随意修改，避免影响书签、外链和用户习惯。

### 路由文件拆分规范

当项目页面较少时，可以将路由统一写在 `src/router/routes.ts` 中。当项目页面逐渐增多后，应按业务模块拆分到 `src/router/modules` 目录，避免单个路由文件过长。

推荐目录结构：

```text
src/router
├── index.ts
├── routes.ts
├── guard.ts
├── permission.ts
└── modules
    ├── dashboard.ts
    ├── system.ts
    ├── order.ts
    ├── product.ts
    └── report.ts
```

文件职责建议如下：

| 文件            | 职责                                 |
| --------------- | ------------------------------------ |
| `index.ts`      | 创建并导出路由实例                   |
| `routes.ts`     | 汇总静态路由、模块路由、异常页路由   |
| `guard.ts`      | 注册全局路由守卫                     |
| `permission.ts` | 处理权限过滤、菜单生成、动态路由转换 |
| `modules/*.ts`  | 按业务模块维护路由配置               |

文件位置：`src/router/routes.ts`

下面的文件用于汇总各业务模块路由，并统一导出给路由实例使用。

```typescript
import type { RouteRecordRaw } from 'vue-router'
import BasicLayout from '@/layouts/BasicLayout.vue'
import { dashboardRoutes } from './modules/dashboard'
import { systemRoutes } from './modules/system'
import { orderRoutes } from './modules/order'

export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '登录',
      hidden: true
    }
  },
  {
    path: '/',
    name: 'Root',
    component: BasicLayout,
    redirect: '/dashboard',
    children: [
      ...dashboardRoutes,
      ...systemRoutes,
      ...orderRoutes
    ]
  },
  {
    path: '/403',
    name: 'Forbidden',
    component: () => import('@/views/error/403.vue'),
    meta: {
      title: '无权限',
      hidden: true
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/error/404.vue'),
    meta: {
      title: '页面不存在',
      hidden: true
    }
  }
]

export const routes: RouteRecordRaw[] = [...constantRoutes]
```

路由拆分时需要注意，模块文件只维护本模块页面，不要互相引用其他业务模块路由。公共路由、异常页路由和登录页路由应放在统一位置，避免分散维护。

### 页面标题与面包屑配置

页面标题和面包屑通常从路由 `meta` 中读取。这样可以保证路由、菜单、浏览器标题、面包屑和标签页使用同一份配置，减少重复维护。

推荐 `meta` 配置如下：

```typescript
{
  path: 'user/detail/:id',
  name: 'SystemUserDetail',
  component: () => import('@/views/system/user/detail.vue'),
  meta: {
    title: '用户详情',
    hidden: true,
    activeMenu: '/system/user',
    breadcrumb: [
      { title: '系统管理', path: '/system' },
      { title: '用户管理', path: '/system/user' },
      { title: '用户详情' }
    ]
  }
}
```

如果项目希望自动根据路由层级生成面包屑，可以使用 `route.matched`。`route.matched` 表示当前路径匹配到的所有路由记录，适合生成层级导航。

文件位置：`src/components/layout/AppBreadcrumb.vue`

下面的组件用于根据当前路由匹配记录自动生成面包屑。

```vue
<template>
  <nav class="app-breadcrumb">
    <RouterLink
      v-for="item in breadcrumbs"
      :key="item.path"
      :to="item.path"
      class="app-breadcrumb__item"
    >
      {{ item.title }}
    </RouterLink>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const breadcrumbs = computed(() => {
  return route.matched
    .filter((item) => item.meta?.title && item.meta?.breadcrumb !== false)
    .map((item) => ({
      title: String(item.meta.title),
      path: item.path
    }))
})
</script>

<style scoped lang="scss">
.app-breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;

  &__item {
    color: #374151;
    text-decoration: none;

    &::after {
      margin-left: 8px;
      content: '/';
      color: #9ca3af;
    }

    &:last-child::after {
      content: '';
    }
  }
}
</style>
```

页面标题可以在全局守卫中统一设置。

文件位置：`src/router/guard.ts`

```typescript
import type { Router } from 'vue-router'

const DEFAULT_TITLE = '后台管理系统'

export function setupTitleGuard(router: Router) {
  router.afterEach((to) => {
    document.title = to.meta.title ? `${to.meta.title} - ${DEFAULT_TITLE}` : DEFAULT_TITLE
  })
}
```

页面标题和面包屑配置建议如下：

1. 每个菜单页面必须配置 `meta.title`。
2. 详情页、表单页可以配置 `hidden: true`，但仍然需要配置 `title`。
3. 不希望展示在面包屑中的路由可以配置 `breadcrumb: false`。
4. 详情页需要左侧菜单高亮时，配置 `activeMenu`。
5. 页面标题、菜单名称、面包屑名称尽量共用 `meta.title`。

## 路由功能验证

路由功能验证用于确认路由配置、页面跳转、参数传递、权限拦截、刷新恢复和浏览器回退行为是否符合预期。路由验证不应只测试能否点击跳转，还要覆盖刷新、直接输入地址、无权限访问、参数变化和历史记录等场景。

### 基础跳转验证

基础跳转验证主要确认路由路径、组件映射、菜单跳转和浏览器地址栏变化是否正确。

推荐验证项如下：

| 验证项       | 操作               | 预期结果                                  |
| ------------ | ------------------ | ----------------------------------------- |
| 根路径访问   | 访问 `/`           | 自动跳转 `/dashboard`                     |
| 登录页访问   | 访问 `/login`      | 正常显示登录页                            |
| 菜单跳转     | 点击“用户管理”菜单 | 地址变为 `/system/user`，页面显示用户管理 |
| 异常页访问   | 访问不存在路径     | 显示 404 页面                             |
| 父级菜单跳转 | 访问 `/system`     | 自动跳转 `/system/user`                   |

开发环境可以直接启动项目验证：

```bash
pnpm dev
```

然后访问以下地址：

```text
http://localhost:5173/
http://localhost:5173/login
http://localhost:5173/dashboard
http://localhost:5173/system/user
http://localhost:5173/not-exist
```

验证基础跳转时，需要同时观察三个点：地址栏是否正确变化、页面组件是否正确渲染、控制台是否存在路由报错。

### 参数传递验证

参数传递验证主要确认 `params` 和 `query` 是否能正确传递、读取和刷新恢复。

动态参数验证：

| 操作                            | 预期结果                     |
| ------------------------------- | ---------------------------- |
| 访问 `/system/user/detail/1001` | 页面读取到 `id = 1001`       |
| 从用户 1001 切换到用户 1002     | 页面重新加载用户 1002 数据   |
| 刷新详情页                      | 页面仍然能读取 ID 并加载详情 |
| 访问缺少必要参数的路径          | 页面提示参数错误或跳转列表页 |

查询参数验证：

| 操作                                   | 预期结果                  |
| -------------------------------------- | ------------------------- |
| 访问 `/system/user?page=1&pageSize=20` | 页面分页参数正确恢复      |
| 输入关键字后点击查询                   | URL 中出现 `keyword` 参数 |
| 刷新列表页                             | 查询条件仍然保留          |
| 点击浏览器返回                         | 查询条件恢复到上一次状态  |

可以在页面中临时增加调试信息确认参数读取结果：

```vue
<template>
  <pre>{{ routeInfo }}</pre>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const routeInfo = computed(() => ({
  path: route.path,
  fullPath: route.fullPath,
  params: route.params,
  query: route.query,
  meta: route.meta
}))
</script>
```

参数传递验证时，需要特别关注 query 类型转换问题。例如 `page` 从 URL 中读取出来是字符串，调用接口前应转换成数字。

### 权限拦截验证

权限拦截验证主要确认未登录用户、已登录无权限用户、已登录有权限用户在访问页面时的表现是否正确。

推荐验证项如下：

| 场景                 | 操作                            | 预期结果                            |
| -------------------- | ------------------------------- | ----------------------------------- |
| 未登录访问受保护页面 | 访问 `/system/user`             | 跳转 `/login?redirect=/system/user` |
| 登录后回跳           | 登录成功                        | 自动跳回 `/system/user`             |
| 无权限访问页面       | 普通用户访问 `/system/role`     | 跳转 `/403`                         |
| 有权限访问页面       | 管理员访问 `/system/role`       | 正常进入角色管理                    |
| 隐藏菜单页面访问     | 访问 `/system/user/detail/1001` | 菜单不显示详情页，但页面可正常访问  |
| 动态路由刷新         | 刷新 `/system/user`             | 动态路由重新注册，页面正常显示      |

权限拦截验证时，需要区分“菜单不可见”和“页面不可访问”。菜单隐藏只表示入口不展示，不能代表用户没有访问权限。真正的页面访问权限必须通过路由守卫和后端接口共同控制。

可临时使用不同角色模拟权限：

```typescript
// 管理员
roles: ['admin']
permissions: ['system:user:list', 'system:role:list']

// 普通用户
roles: ['user']
permissions: ['system:user:list']
```

验证时分别访问：

```text
/system/user
/system/role
/system/user/detail/1001
/order/list
```

预期普通用户只能访问自己权限范围内的页面，访问未授权页面时跳转到 `/403`。

### 刷新与回退验证

刷新与回退验证主要确认使用 `createWebHistory()` 后，页面在刷新、直接访问深层路径、浏览器前进后退时是否正常。

推荐验证项如下：

| 验证项           | 操作                                | 预期结果               |
| ---------------- | ----------------------------------- | ---------------------- |
| 详情页刷新       | 刷新 `/system/user/detail/1001`     | 页面正常加载用户详情   |
| 列表页刷新       | 刷新 `/system/user?page=2`          | 查询条件和分页状态恢复 |
| 深层路径直接访问 | 浏览器直接输入 `/order/detail/1001` | 页面正常渲染           |
| 浏览器返回       | 从详情页返回列表页                  | 回到上一次列表状态     |
| 浏览器前进       | 返回后再前进                        | 进入之前的详情页       |
| 生产环境刷新     | Nginx 部署后刷新子路径              | 不出现 404             |

如果开发环境正常，但生产环境刷新子路由出现 404，通常是服务端没有配置 history fallback。Nginx 需要增加如下配置：

```nginx
server {
  listen 80;
  server_name localhost;

  root /usr/share/nginx/html;
  index index.html;

  location / {
    # Vue Router history 模式刷新子路径时回退到入口文件
    try_files $uri $uri/ /index.html;
  }
}
```

刷新与回退验证需要重点关注以下问题：

1. 动态路由是否在刷新后重新注册。
2. 用户信息和权限数据是否能重新加载。
3. 页面是否能根据 URL 参数恢复状态。
4. history 模式部署后服务端是否配置 fallback。
5. 浏览器返回列表页时，查询条件和分页状态是否保留。
6. 详情页参数变化时，组件是否重新请求数据。

完成以上验证后，基本可以确认 Vue Router 在项目中的基础配置、页面映射、参数传递、权限拦截和刷新恢复流程符合实际开发要求。