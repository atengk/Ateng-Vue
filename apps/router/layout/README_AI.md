# Vue Router Layout

## 设计目标

本章节用于明确 Vue3 项目中 Layout 的设计方向。Layout 是页面结构、路由出口、导航区域和全局交互的承载层，它不应该和具体业务页面强绑定，而应该作为路由体系中的公共页面骨架存在。

在设计 Layout 时，需要重点解决三个问题：Layout 应该负责什么，页面结构和路由结构如何对应，以及项目中存在多个布局时应该如何规划。

### Layout 的职责边界

Layout 的核心职责是提供页面级公共结构，而不是处理具体业务逻辑。它主要负责页面骨架、导航区域、内容出口、菜单状态、面包屑、标签页、页面缓存和响应式布局等通用能力。

在后台管理系统中，Layout 通常会包含顶部栏、侧边栏、内容区域、底部区域、标签页和面包屑。具体业务页面则通过 `router-view` 渲染到内容区域中。

Layout 推荐负责以下内容：

| 职责         | 说明                                               |
| ------------ | -------------------------------------------------- |
| 页面骨架     | 统一组织 Header、Sidebar、Main、Footer 等公共区域  |
| 路由出口     | 通过 `router-view` 渲染当前路由对应的页面组件      |
| 菜单容器     | 根据路由或权限数据渲染菜单                         |
| 路由状态联动 | 处理菜单选中、菜单展开、面包屑、标签页等状态       |
| 页面缓存出口 | 结合 `keep-alive` 和路由 `meta` 控制页面缓存       |
| 布局交互     | 处理侧边栏折叠、移动端适配、内容区域滚动等布局行为 |
| 权限展示控制 | 根据权限结果控制菜单、入口和布局区域的显示         |

Layout 不推荐负责以下内容：

| 不推荐职责   | 原因                                                |
| ------------ | --------------------------------------------------- |
| 业务接口请求 | 会导致 Layout 与具体业务模块耦合                    |
| 表单校验     | 表单规则应由具体页面或业务组件维护                  |
| 表格查询     | 查询、分页、排序属于页面业务逻辑                    |
| 业务弹窗     | 新增、编辑、详情弹窗应放在业务页面中                |
| 业务状态管理 | 业务状态应放在页面组件或 Pinia Store 中             |
| 复杂权限计算 | Layout 可以消费权限结果，但不应直接计算完整权限规则 |

推荐的职责边界如下：

```text
Layout
├── 负责：页面骨架、导航区域、路由出口、布局交互
├── 依赖：路由配置、菜单数据、权限结果、全局状态
└── 不负责：业务查询、业务表单、业务弹窗、业务数据处理

Page View
├── 负责：具体页面业务、接口调用、表单校验、表格展示
├── 依赖：API 模块、业务 Store、业务组件
└── 不负责：公共页面骨架、全局导航结构

Router
├── 负责：访问路径、组件映射、Layout 绑定、meta 信息
├── 依赖：Layout 组件、页面组件
└── 不负责：页面内部业务逻辑
```

判断逻辑是否应该放入 Layout，可以使用一个简单标准：如果它服务于整个页面框架，并且多个页面都会复用，可以放在 Layout 或 Layout 子组件中；如果它只服务于某个业务页面，则应该放在对应页面组件中。

### 页面结构与路由结构的关系

页面结构和路由结构需要保持一致的层级关系。Vue Router 的父子路由非常适合表达 Layout 与页面之间的嵌套关系，通常采用“父路由绑定 Layout，子路由绑定业务页面”的方式。

推荐结构如下：

```text
访问路径
└── /system/user

路由结构
└── /system              -> MainLayout
    └── user             -> views/system/user/index.vue

页面结构
└── MainLayout
    ├── Header
    ├── Sidebar
    ├── Breadcrumb
    ├── Tabs
    └── RouterView
        └── UserPage
```

这种设计方式可以让同一组业务页面复用相同 Layout。用户从 `/system/user` 切换到 `/system/role` 时，主布局不需要重新创建，只需要替换内容区域中的页面组件。

典型路由配置如下：

```ts
{
  path: '/system',
  component: () => import('@/layouts/MainLayout.vue'),
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
        icon: 'User',
        keepAlive: true,
        permission: 'system:user:list'
      }
    },
    {
      path: 'role',
      name: 'SystemRole',
      component: () => import('@/views/system/role/index.vue'),
      meta: {
        title: '角色管理',
        icon: 'Avatar',
        keepAlive: true,
        permission: 'system:role:list'
      }
    }
  ]
}
```

该结构需要遵循以下原则：

第一，Layout 绑定在父级路由上。父级路由用于声明当前模块使用哪一种布局，例如后台主布局、空白布局或异常页布局。

第二，业务页面绑定在子路由上。子路由只负责具体页面组件、页面标题、权限标识、缓存配置等页面级信息。

第三，路由 `meta` 是 Layout 和页面联动的核心。菜单名称、图标、权限标识、缓存状态、隐藏状态、面包屑规则等都可以通过 `meta` 统一维护。

第四，页面目录结构应尽量与路由路径保持一致。这样可以根据访问路径快速定位页面文件，也可以根据页面目录反推路由配置。

推荐映射关系如下：

```text
路由路径：/system/user
页面文件：src/views/system/user/index.vue

路由路径：/system/role
页面文件：src/views/system/role/index.vue

路由路径：/monitor/login-log
页面文件：src/views/monitor/login-log/index.vue
```

需要避免以下设计问题：

| 问题                        | 影响                                    |
| --------------------------- | --------------------------------------- |
| 所有页面直接挂在一级路由下  | Layout 复用困难，菜单和面包屑层级不清晰 |
| 每个页面内部单独引入 Layout | 公共结构重复，维护成本高                |
| 路由层级过深                | 菜单、缓存、权限判断复杂度上升          |
| 路由路径和文件目录不一致    | 页面定位困难，团队协作成本增加          |
| `meta` 信息分散维护         | 菜单、权限、标题、缓存状态容易不一致    |

推荐的整体原则是：路由负责表达访问关系，Layout 负责表达页面承载结构，页面组件负责表达具体业务内容。

### 多布局场景规划

实际项目通常不会只有一种 Layout。后台管理系统至少会涉及登录页布局、后台主布局、空白页布局和异常页布局。不同布局的页面结构、权限要求和导航展示不同，因此需要在路由设计阶段提前规划。

常见 Layout 场景如下：

| Layout 类型     | 适用场景             | 典型页面                           | 是否需要登录   | 是否显示菜单 |
| --------------- | -------------------- | ---------------------------------- | -------------- | ------------ |
| LoginLayout     | 登录、注册、找回密码 | `/login`、`/register`              | 否             | 否           |
| MainLayout      | 后台管理主界面       | `/dashboard`、`/system/user`       | 是             | 是           |
| BlankLayout     | 无菜单的功能页       | `/profile`、`/redirect`、`/iframe` | 视情况而定     | 否           |
| ExceptionLayout | 异常页               | `/403`、`/404`、`/500`             | 否或视情况而定 | 否           |

多布局设计的关键是不要让一个 Layout 承担所有页面场景。如果登录页、后台主页、异常页、跳转页都使用同一个主布局，就会出现大量 `v-if` 判断，例如是否隐藏菜单、是否隐藏顶部栏、是否保留内容边距、是否加载用户信息等。随着场景增加，Layout 会逐渐变得臃肿。

推荐使用一级路由绑定不同 Layout：

```text
/
├── /login              -> LoginLayout
├── /dashboard          -> MainLayout
├── /system             -> MainLayout
│   ├── /system/user    -> 用户管理页面
│   └── /system/role    -> 角色管理页面
├── /profile            -> BlankLayout
├── /redirect           -> BlankLayout
├── /403                -> ExceptionLayout
├── /404                -> ExceptionLayout
└── /500                -> ExceptionLayout
```

示例路由分组如下：

```ts
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/layouts/LoginLayout.vue'),
    children: [
      {
        path: '',
        name: 'Login',
        component: () => import('@/views/login/index.vue'),
        meta: {
          title: '登录',
          hidden: true
        }
      }
    ]
  },
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    redirect: '/dashboard',
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: {
          title: '首页',
          icon: 'HomeFilled',
          affix: true,
          keepAlive: true
        }
      }
    ]
  },
  {
    path: '/blank',
    component: () => import('@/layouts/BlankLayout.vue'),
    children: [
      {
        path: 'redirect/:path(.*)',
        name: 'Redirect',
        component: () => import('@/views/redirect/index.vue'),
        meta: {
          title: '页面跳转',
          hidden: true
        }
      }
    ]
  },
  {
    path: '/exception',
    component: () => import('@/layouts/ExceptionLayout.vue'),
    children: [
      {
        path: '403',
        name: 'Forbidden',
        component: () => import('@/views/exception/403.vue'),
        meta: {
          title: '无权限',
          hidden: true
        }
      },
      {
        path: '404',
        name: 'NotFound',
        component: () => import('@/views/exception/404.vue'),
        meta: {
          title: '页面不存在',
          hidden: true
        }
      }
    ]
  }
]
```

多布局规划建议遵循以下规则：

第一，登录相关页面使用独立布局。登录页通常不需要顶部栏、侧边栏、面包屑和标签页，也不应该依赖后台主布局中的用户信息、菜单权限和动态路由状态。

第二，后台业务页面统一使用主布局。主布局负责承载登录后的核心功能，包括菜单、顶部栏、标签页、面包屑、内容区域和全局用户操作。

第三，跳转页、嵌入页、打印页等特殊页面可以使用空白布局。空白布局只提供最小页面容器，不渲染菜单和顶部栏。

第四，异常页可以使用独立异常布局。403、404、500 页面通常不需要完整后台框架，独立布局可以让异常展示更简洁，也能避免异常页依赖主布局数据。

第五，布局结构差异明显时，应拆分为不同 Layout，而不是在同一个 Layout 内写大量条件判断。少量显示控制可以通过路由 `meta` 实现，例如隐藏面包屑、隐藏标签页或隐藏菜单入口。

推荐目录结构如下：

```text
src/layouts
├── MainLayout.vue          # 后台主布局
├── LoginLayout.vue         # 登录页布局
├── BlankLayout.vue         # 空白布局
├── ExceptionLayout.vue     # 异常页布局
└── components
    ├── AppHeader.vue       # 顶部区域
    ├── AppSidebar.vue      # 侧边栏
    ├── AppBreadcrumb.vue   # 面包屑
    ├── AppTabs.vue         # 标签页
    └── AppMain.vue         # 内容区域
```

通过这种规划，路由、Layout 和页面组件的职责会更加清晰。路由决定当前页面使用哪一种布局，Layout 负责页面公共结构，页面组件只处理自己的业务内容。后续接入菜单权限、动态路由、页面缓存、标签页和响应式交互时，也可以在这个基础上继续扩展。

## 项目目录设计

本章节用于规范 Layout、路由模块和页面组件的目录组织方式。目录结构需要和路由结构、页面模块保持一致，避免后期出现页面难定位、路由配置分散、Layout 组件职责混乱等问题。目录设计应服务于长期维护，而不是只满足当前几个页面的开发。

### Layout 目录结构

Layout 目录用于存放项目级页面骨架组件。推荐将完整布局组件和布局内部子组件分开管理，外层 Layout 负责组织页面结构，内部 components 目录负责拆分 Header、Sidebar、Tabs、Breadcrumb、Main 等区域组件。

推荐目录结构如下：

```
src/layouts
├── MainLayout.vue              # 后台主布局
├── LoginLayout.vue             # 登录页布局
├── BlankLayout.vue             # 空白布局
├── ExceptionLayout.vue         # 异常页布局
└── components
    ├── AppHeader.vue           # 顶部区域
    ├── AppSidebar.vue          # 侧边栏区域
    ├── AppMenu.vue             # 菜单组件
    ├── AppBreadcrumb.vue       # 面包屑组件
    ├── AppTabs.vue             # 标签页组件
    ├── AppMain.vue             # 内容区域组件
    └── AppFooter.vue           # 底部区域组件
```

其中 `MainLayout.vue` 是后台管理系统的核心布局组件，通常用于登录后的业务页面。`LoginLayout.vue` 用于登录、注册、找回密码等无需后台框架的页面。`BlankLayout.vue` 用于跳转页、嵌入页、打印页等不需要菜单和顶部栏的页面。`ExceptionLayout.vue` 用于 403、404、500 等异常页面。

布局内部组件建议只处理布局级展示和交互，不直接写具体业务逻辑。例如 `AppSidebar.vue` 可以根据菜单数据渲染导航菜单，但不应该在组件内部直接请求业务接口；菜单数据可以来自路由配置、权限 Store 或后端动态路由结果。

推荐职责划分如下：

| 文件                           | 职责                                                         |
| ------------------------------ | ------------------------------------------------------------ |
| `MainLayout.vue`               | 组合后台主页面结构，承载 Header、Sidebar、Main、Footer 等区域 |
| `LoginLayout.vue`              | 提供登录相关页面的基础容器                                   |
| `BlankLayout.vue`              | 提供无菜单、无顶部栏的最小页面容器                           |
| `ExceptionLayout.vue`          | 提供异常页面的统一展示容器                                   |
| `components/AppHeader.vue`     | 处理顶部用户信息、折叠按钮、全屏、退出登录等布局操作         |
| `components/AppSidebar.vue`    | 处理侧边栏宽度、折叠状态、菜单容器                           |
| `components/AppMenu.vue`       | 根据路由或权限菜单渲染菜单项                                 |
| `components/AppBreadcrumb.vue` | 根据当前路由生成面包屑                                       |
| `components/AppTabs.vue`       | 处理标签页展示、关闭、刷新和缓存联动                         |
| `components/AppMain.vue`       | 承载 `router-view`、页面缓存和页面切换动画                   |
| `components/AppFooter.vue`     | 展示底部版权、版本号或系统信息                               |

### 路由模块目录结构

路由模块目录用于管理 Vue Router 的基础配置、静态路由、动态路由、路由守卫和模块化路由文件。随着项目规模扩大，不建议把所有路由都写在一个 `index.ts` 文件中，否则系统管理、监控管理、权限管理、业务模块等路由会混在一起，维护成本较高。

推荐目录结构如下：

```
src/router
├── index.ts                    # 创建 router 实例，注册基础路由
├── routes.ts                   # 汇总静态路由和模块路由
├── guard.ts                    # 全局路由守卫
├── helper.ts                   # 路由转换、菜单生成、权限过滤等工具方法
└── modules
    ├── dashboard.ts            # 首页路由
    ├── system.ts               # 系统管理路由
    ├── monitor.ts              # 监控管理路由
    └── exception.ts            # 异常页路由
```

`index.ts` 应只负责创建 Router 实例和注册必要配置，不建议堆放大量业务路由。业务模块路由应放在 `modules` 目录下，按照功能模块拆分。这样可以保证每个模块的路由配置相对独立，也便于后续做动态路由加载和权限过滤。

推荐路由文件职责如下：

| 文件           | 职责                                                     |
| -------------- | -------------------------------------------------------- |
| `index.ts`     | 创建并导出 Router 实例                                   |
| `routes.ts`    | 汇总常量路由、模块路由、异常路由                         |
| `guard.ts`     | 管理登录校验、权限校验、页面标题、进度条等路由守卫逻辑   |
| `helper.ts`    | 提供路由扁平化、菜单生成、权限过滤、面包屑生成等工具函数 |
| `modules/*.ts` | 按业务模块维护路由配置                                   |

文件位置：`src/router/index.ts`

```ts
import { createRouter, createWebHistory } from 'vue-router'
import { constantRoutes } from './routes'

// 创建 Vue Router 实例，统一使用 HTML5 History 模式
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: constantRoutes,
  scrollBehavior() {
    // 切换页面后回到顶部，避免内容区滚动位置残留
    return {
      top: 0,
      left: 0
    }
  }
})

export default router
```

文件位置：`src/router/routes.ts`

```ts
import type { RouteRecordRaw } from 'vue-router'
import dashboardRoutes from './modules/dashboard'
import systemRoutes from './modules/system'
import monitorRoutes from './modules/monitor'
import exceptionRoutes from './modules/exception'

// 静态路由：不依赖权限即可访问的路由
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    component: () => import('@/layouts/LoginLayout.vue'),
    children: [
      {
        path: '',
        name: 'Login',
        component: () => import('@/views/login/index.vue'),
        meta: {
          title: '登录',
          hidden: true
        }
      }
    ]
  },
  ...dashboardRoutes,
  ...exceptionRoutes
]

// 动态路由：通常需要根据角色、权限或后端菜单数据过滤后再注册
export const asyncRoutes: RouteRecordRaw[] = [
  ...systemRoutes,
  ...monitorRoutes
]
```

### 页面组件目录结构

页面组件目录用于存放具体业务页面。推荐 `views` 目录和路由路径保持一致，让开发人员可以通过访问路径快速定位页面文件。例如访问 `/system/user` 时，对应页面应优先放在 `src/views/system/user/index.vue`。

推荐目录结构如下：

```
src/views
├── login
│   └── index.vue               # 登录页
├── dashboard
│   └── index.vue               # 首页
├── system
│   ├── user
│   │   ├── index.vue           # 用户管理
│   │   ├── components          # 用户管理页面内部组件
│   │   │   ├── UserForm.vue
│   │   │   └── UserDetail.vue
│   │   └── hooks
│   │       └── useUserTable.ts
│   └── role
│       ├── index.vue           # 角色管理
│       └── components
│           └── RoleForm.vue
├── monitor
│   └── login-log
│       └── index.vue           # 登录日志
└── exception
    ├── 403.vue
    ├── 404.vue
    └── 500.vue
```

页面目录应遵循“模块目录 + 页面目录 + 页面入口”的方式。每个页面的入口文件建议统一命名为 `index.vue`，页面内部专属组件放在当前页面目录下的 `components` 中，页面内部组合逻辑可以放在 `hooks` 中。

推荐页面文件组织规则如下：

| 目录或文件                                    | 说明                               |
| --------------------------------------------- | ---------------------------------- |
| `views/system/user/index.vue`                 | 用户管理页面入口                   |
| `views/system/user/components/UserForm.vue`   | 用户新增、编辑表单组件             |
| `views/system/user/components/UserDetail.vue` | 用户详情组件                       |
| `views/system/user/hooks/useUserTable.ts`     | 用户表格查询、分页、刷新等组合逻辑 |
| `views/system/role/index.vue`                 | 角色管理页面入口                   |
| `views/exception/404.vue`                     | 404 异常页面                       |

页面组件不应直接承担 Layout 职责。例如用户管理页面不应该自己实现侧边栏、顶部栏、面包屑和标签页，而是只负责用户列表、查询条件、表单弹窗、接口调用等业务内容。

## 基础 Layout 设计

本章节用于说明后台管理主布局的基础结构。基础 Layout 需要提供稳定的页面骨架，使业务页面只关注内容区域的实现。一个常见的后台 Layout 通常由头部区域、侧边栏区域、内容区域和底部区域组成，复杂项目还会增加标签页、面包屑和页面缓存出口。

### 主布局结构

主布局是后台管理系统登录后的核心页面容器。它负责将 Header、Sidebar、Main、Footer 等区域组合起来，并在内容区域通过 `router-view` 渲染当前页面。

推荐主布局结构如下：

```
MainLayout
├── AppSidebar
│   └── AppMenu
├── LayoutContainer
│   ├── AppHeader
│   ├── AppBreadcrumb
│   ├── AppTabs
│   ├── AppMain
│   │   └── RouterView
│   └── AppFooter
```

文件位置：`src/layouts/MainLayout.vue`

```vue
<template>
  <div class="layout">
    <AppSidebar class="layout__sidebar" />

    <section class="layout__container">
      <AppHeader class="layout__header" />
      <AppBreadcrumb class="layout__breadcrumb" />
      <AppTabs class="layout__tabs" />
      <AppMain class="layout__main" />
      <AppFooter class="layout__footer" />
    </section>
  </div>
</template>

<script setup lang="ts">
import AppHeader from './components/AppHeader.vue'
import AppSidebar from './components/AppSidebar.vue'
import AppBreadcrumb from './components/AppBreadcrumb.vue'
import AppTabs from './components/AppTabs.vue'
import AppMain from './components/AppMain.vue'
import AppFooter from './components/AppFooter.vue'
</script>

<style scoped lang="scss">
.layout {
  display: flex;
  width: 100%;
  min-height: 100vh;
  background: #f5f7fa;

  &__sidebar {
    flex-shrink: 0;
  }

  &__container {
    display: flex;
    flex: 1;
    min-width: 0;
    min-height: 100vh;
    flex-direction: column;
  }

  &__header,
  &__breadcrumb,
  &__tabs,
  &__footer {
    flex-shrink: 0;
  }

  &__main {
    flex: 1;
    min-height: 0;
  }
}
</style>
```

主布局中需要注意 `min-width: 0` 和 `min-height: 0`。这两个样式可以避免 flex 布局中内容区域被子元素撑开，导致横向滚动或纵向滚动失控。后台系统页面表格较多，这类问题比较常见。

### 头部区域设计

头部区域用于承载系统标题、侧边栏折叠按钮、面包屑入口、用户信息、全屏按钮、主题切换、退出登录等全局操作。头部组件应只处理布局级操作，不应该放入某个业务模块的按钮。

文件位置：`src/layouts/components/AppHeader.vue`

```vue
<template>
  <header class="app-header">
    <div class="app-header__left">
      <el-button text @click="toggleSidebar">
        <el-icon>
          <Fold v-if="!appStore.sidebarCollapsed" />
          <Expand v-else />
        </el-icon>
      </el-button>

      <span class="app-header__title">后台管理系统</span>
    </div>

    <div class="app-header__right">
      <el-tooltip content="刷新页面" placement="bottom">
        <el-button text @click="refreshPage">
          <el-icon><Refresh /></el-icon>
        </el-button>
      </el-tooltip>

      <el-dropdown @command="handleCommand">
        <span class="app-header__user">
          {{ userStore.nickname }}
          <el-icon><ArrowDown /></el-icon>
        </span>

        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile">个人中心</el-dropdown-item>
            <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ArrowDown, Expand, Fold, Refresh } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/modules/app'
import { useUserStore } from '@/stores/modules/user'

const router = useRouter()
const appStore = useAppStore()
const userStore = useUserStore()

const toggleSidebar = () => {
  // 切换侧边栏折叠状态
  appStore.toggleSidebar()
}

const refreshPage = () => {
  // 简单刷新当前页面，复杂项目可结合 redirect 页面实现无感刷新
  router.go(0)
}

const handleCommand = async (command: string) => {
  if (command === 'profile') {
    await router.push('/profile')
    return
  }

  if (command === 'logout') {
    await userStore.logout()
    await router.replace('/login')
  }
}
</script>

<style scoped lang="scss">
.app-header {
  display: flex;
  height: 56px;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  background: #ffffff;
  border-bottom: 1px solid #ebeef5;

  &__left,
  &__right,
  &__user {
    display: flex;
    align-items: center;
  }

  &__title {
    margin-left: 12px;
    font-size: 16px;
    font-weight: 600;
  }

  &__right {
    gap: 12px;
  }

  &__user {
    gap: 4px;
    cursor: pointer;
  }
}
</style>
```

头部区域依赖的状态建议放在全局 Store 中，例如侧边栏折叠状态、用户昵称、头像、角色信息等。这样 Header、Sidebar、Tabs 等布局组件之间可以共享状态，避免通过多层组件传参。

### 侧边栏区域设计

侧边栏区域用于承载系统菜单。它通常需要支持展开折叠、路由跳转、当前菜单选中、父级菜单展开、权限过滤和移动端抽屉展示。侧边栏本身负责容器结构，菜单渲染建议拆分到 `AppMenu.vue`。

文件位置：`src/layouts/components/AppSidebar.vue`

```vue
<template>
  <aside
    class="app-sidebar"
    :class="{ 'app-sidebar--collapsed': appStore.sidebarCollapsed }"
  >
    <div class="app-sidebar__logo">
      <span v-if="!appStore.sidebarCollapsed">Admin</span>
      <span v-else>A</span>
    </div>

    <AppMenu />
  </aside>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/modules/app'
import AppMenu from './AppMenu.vue'

const appStore = useAppStore()
</script>

<style scoped lang="scss">
.app-sidebar {
  width: 220px;
  height: 100vh;
  overflow: hidden;
  background: #001529;
  transition: width 0.2s ease;

  &--collapsed {
    width: 64px;
  }

  &__logo {
    display: flex;
    height: 56px;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    font-size: 18px;
    font-weight: 600;
    border-bottom: 1px solid rgb(255 255 255 / 10%);
  }
}
</style>
```

文件位置：`src/layouts/components/AppMenu.vue`

```vue
<template>
  <el-scrollbar class="app-menu">
    <el-menu
      :default-active="activeMenu"
      :collapse="appStore.sidebarCollapsed"
      router
      background-color="#001529"
      text-color="#bfcbd9"
      active-text-color="#409eff"
    >
      <template v-for="item in menuRoutes" :key="item.path">
        <el-sub-menu
          v-if="item.children?.length"
          :index="item.path"
        >
          <template #title>
            <span>{{ item.meta?.title }}</span>
          </template>

          <el-menu-item
            v-for="child in item.children"
            :key="child.path"
            :index="resolvePath(item.path, child.path)"
          >
            {{ child.meta?.title }}
          </el-menu-item>
        </el-sub-menu>

        <el-menu-item
          v-else
          :index="item.path"
        >
          {{ item.meta?.title }}
        </el-menu-item>
      </template>
    </el-menu>
  </el-scrollbar>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores/modules/app'
import { usePermissionStore } from '@/stores/modules/permission'

const route = useRoute()
const appStore = useAppStore()
const permissionStore = usePermissionStore()

const menuRoutes = computed(() => {
  // 菜单数据建议由权限 Store 统一维护，避免组件内直接处理权限规则
  return permissionStore.menuRoutes
})

const activeMenu = computed(() => {
  // 支持通过 activeMenu 自定义菜单选中项，例如详情页选中列表菜单
  return route.meta.activeMenu || route.path
})

const resolvePath = (parentPath: string, childPath: string) => {
  if (childPath.startsWith('/')) {
    return childPath
  }

  return `${parentPath}/${childPath}`.replace(/\/+/g, '/')
}
</script>

<style scoped lang="scss">
.app-menu {
  height: calc(100vh - 56px);

  :deep(.el-menu) {
    border-right: none;
  }
}
</style>
```

侧边栏设计中建议将菜单数据来源统一到权限 Store 中。无论菜单来自本地路由还是后端接口，最终都应转换成统一结构后再交给菜单组件渲染。

### 内容区域设计

内容区域用于承载业务页面，是 Layout 中最核心的路由出口。内容区域通常需要结合 `router-view`、`keep-alive` 和 `transition` 实现页面渲染、缓存和切换动画。

文件位置：`src/layouts/components/AppMain.vue`

```vue
<template>
  <main class="app-main">
    <router-view v-slot="{ Component, route }">
      <transition name="fade-slide" mode="out-in">
        <keep-alive :include="cachedViews">
          <component
            :is="Component"
            :key="route.fullPath"
          />
        </keep-alive>
      </transition>
    </router-view>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTabsStore } from '@/stores/modules/tabs'

const tabsStore = useTabsStore()

const cachedViews = computed(() => {
  // keep-alive 的 include 需要匹配组件 name
  return tabsStore.cachedViews
})
</script>

<style scoped lang="scss">
.app-main {
  box-sizing: border-box;
  height: 100%;
  padding: 16px;
  overflow: auto;
  background: #f5f7fa;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.2s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(12px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-12px);
}
</style>
```

这里需要注意 `keep-alive` 的 `include` 匹配的是组件的 `name`，不是路由的 `name`。因此需要缓存的页面组件应显式定义组件名称。

文件位置：`src/views/system/user/index.vue`

```vue
<template>
  <div class="user-page">
    <el-card shadow="never">
      用户管理页面
    </el-card>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  // 该名称需要与 keep-alive 的 include 数据匹配
  name: 'SystemUser'
})
</script>

<style scoped lang="scss">
.user-page {
  min-height: 100%;
}
</style>
```

如果项目不需要页面缓存，可以先去掉 `keep-alive`，只保留 `router-view` 和页面切换动画。等标签页和缓存机制稳定后，再统一接入缓存策略。

### 底部区域设计

底部区域用于展示版权信息、系统版本号、构建时间、备案信息或技术支持信息。后台系统中 Footer 不是必须区域，如果页面空间紧张，也可以通过配置隐藏。

文件位置：`src/layouts/components/AppFooter.vue`

```vue
<template>
  <footer v-if="appStore.showFooter" class="app-footer">
    <span>Copyright © 2026 Admin</span>
    <span class="app-footer__version">Version {{ appVersion }}</span>
  </footer>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/modules/app'

const appStore = useAppStore()

const appVersion = import.meta.env.VITE_APP_VERSION || '1.0.0'
</script>

<style scoped lang="scss">
.app-footer {
  display: flex;
  height: 40px;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #909399;
  font-size: 13px;
  background: #ffffff;
  border-top: 1px solid #ebeef5;

  &__version {
    color: #c0c4cc;
  }
}
</style>
```

Footer 建议设计为可配置区域。对于数据密集型后台系统，可以默认隐藏 Footer，以便给表格和表单留出更多纵向空间。对于门户类后台或企业内部系统，可以保留 Footer 展示系统信息。

## 路由配置设计

本章节用于说明 Vue Router 中 Layout 与页面组件的绑定方式。路由配置不仅决定页面访问路径，也会影响菜单生成、权限控制、页面缓存、面包屑和标签页。因此路由配置需要在项目初期形成统一规范。

### 一级路由与 Layout 绑定

一级路由通常用于绑定 Layout。不同业务场景可以绑定不同 Layout，例如登录页绑定 `LoginLayout`，后台业务页面绑定 `MainLayout`，异常页绑定 `ExceptionLayout`。

推荐结构如下：

```
一级路由
├── /login       -> LoginLayout
├── /            -> MainLayout
├── /system      -> MainLayout
├── /monitor     -> MainLayout
├── /blank       -> BlankLayout
└── /exception   -> ExceptionLayout
```

文件位置：`src/router/modules/dashboard.ts`

```ts
import type { RouteRecordRaw } from 'vue-router'

const dashboardRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    redirect: '/dashboard',
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: {
          title: '首页',
          icon: 'HomeFilled',
          affix: true,
          keepAlive: true
        }
      }
    ]
  }
]

export default dashboardRoutes
```

一级路由绑定 Layout 时，需要注意不要把所有模块都强行挂在同一个父路由下。可以按照功能模块拆分一级路由，例如 `/system`、`/monitor`、`/tool` 等都绑定 `MainLayout`，这样路由结构与菜单模块会更清晰。

### 子路由与页面组件绑定

子路由用于绑定具体页面组件。页面组件应放在 `views` 目录下，并尽量与路由路径保持一致。子路由的 `meta` 信息用于描述页面标题、图标、权限标识、缓存配置、隐藏状态等页面属性。

文件位置：`src/router/modules/system.ts`

```ts
import type { RouteRecordRaw } from 'vue-router'

const systemRoutes: RouteRecordRaw[] = [
  {
    path: '/system',
    component: () => import('@/layouts/MainLayout.vue'),
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
          icon: 'User',
          keepAlive: true,
          permission: 'system:user:list'
        }
      },
      {
        path: 'role',
        name: 'SystemRole',
        component: () => import('@/views/system/role/index.vue'),
        meta: {
          title: '角色管理',
          icon: 'Avatar',
          keepAlive: true,
          permission: 'system:role:list'
        }
      }
    ]
  }
]

export default systemRoutes
```

子路由设计建议遵循以下规则：

| 规则                       | 说明                                       |
| -------------------------- | ------------------------------------------ |
| `path` 使用相对路径        | 子路由建议写 `user`，不要写 `/system/user` |
| `name` 保持唯一            | 便于缓存、标签页、权限和页面跳转           |
| `component` 指向页面入口   | 通常指向 `views/**/index.vue`              |
| `meta.title` 必填          | 菜单、面包屑、标签页都需要使用             |
| `meta.permission` 按需配置 | 需要权限控制的页面应配置权限标识           |
| `meta.keepAlive` 按需配置  | 需要缓存的页面设置为 `true`                |

如果存在详情页、编辑页等不需要显示在菜单中的页面，可以通过 `hidden` 和 `activeMenu` 控制。

```ts
{
  path: 'user/detail/:id',
  name: 'SystemUserDetail',
  component: () => import('@/views/system/user/detail.vue'),
  meta: {
    title: '用户详情',
    hidden: true,
    activeMenu: '/system/user',
    permission: 'system:user:detail'
  }
}
```

这里的 `hidden: true` 表示该路由不显示在菜单中，`activeMenu: '/system/user'` 表示访问详情页时，侧边栏仍然选中用户管理菜单。

### 路由重定向配置

路由重定向用于处理默认访问路径。常见场景包括访问根路径时跳转到首页，访问模块路径时跳转到模块默认页面，登录后根据权限跳转到第一个可访问页面等。

常见重定向设计如下：

| 场景         | 示例                                   | 说明                           |
| ------------ | -------------------------------------- | ------------------------------ |
| 根路径重定向 | `/` -> `/dashboard`                    | 访问系统根路径时进入首页       |
| 模块重定向   | `/system` -> `/system/user`            | 访问模块根路径时进入默认子页面 |
| 登录后重定向 | `/login?redirect=/system/user`         | 登录成功后返回原目标页面       |
| 404 重定向   | `/:pathMatch(.*)*` -> `/exception/404` | 未匹配路由进入 404 页面        |

文件位置：`src/router/modules/exception.ts`

```ts
import type { RouteRecordRaw } from 'vue-router'

const exceptionRoutes: RouteRecordRaw[] = [
  {
    path: '/exception',
    component: () => import('@/layouts/ExceptionLayout.vue'),
    children: [
      {
        path: '403',
        name: 'Forbidden',
        component: () => import('@/views/exception/403.vue'),
        meta: {
          title: '无权限',
          hidden: true
        }
      },
      {
        path: '404',
        name: 'NotFound',
        component: () => import('@/views/exception/404.vue'),
        meta: {
          title: '页面不存在',
          hidden: true
        }
      },
      {
        path: '500',
        name: 'ServerError',
        component: () => import('@/views/exception/500.vue'),
        meta: {
          title: '服务器错误',
          hidden: true
        }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/exception/404',
    meta: {
      hidden: true
    }
  }
]

export default exceptionRoutes
```

重定向配置需要注意顺序。通配符路由 `/:pathMatch(.*)*` 必须放在最后，否则会提前拦截其他正常路由。动态路由场景下，404 路由也可以在动态路由加载完成后再注册，避免刷新页面时尚未加载权限路由就进入 404。

登录重定向通常在路由守卫中处理：

```ts
import type { Router } from 'vue-router'
import { useUserStore } from '@/stores/modules/user'

export const setupRouterGuard = (router: Router) => {
  router.beforeEach(async (to) => {
    const userStore = useUserStore()

    if (to.path === '/login') {
      return true
    }

    if (!userStore.token) {
      return {
        path: '/login',
        query: {
          redirect: to.fullPath
        }
      }
    }

    return true
  })
}
```

这段守卫逻辑用于在用户未登录时跳转到登录页，并通过 `redirect` 参数记录原始访问地址。登录成功后，可以根据该参数跳回原页面。

### 路由元信息设计

路由元信息 `meta` 是 Layout、菜单、权限、缓存、面包屑和标签页之间的重要连接点。设计规范的 `meta` 字段可以减少组件之间的硬编码，让 Layout 组件通过统一规则读取页面配置。

推荐 `meta` 字段如下：

| 字段           | 类型      | 说明                                           |
| -------------- | --------- | ---------------------------------------------- |
| `title`        | `string`  | 页面标题，用于菜单、标签页、面包屑、浏览器标题 |
| `icon`         | `string`  | 菜单图标                                       |
| `requiresAuth` | `boolean` | 是否需要登录                                   |
| `permission`   | `string`  | 页面权限标识                                   |
| `hidden`       | `boolean` | 是否在菜单中隐藏                               |
| `keepAlive`    | `boolean` | 是否缓存页面                                   |
| `affix`        | `boolean` | 标签页是否固定                                 |
| `activeMenu`   | `string`  | 当前页面需要激活的菜单路径                     |
| `breadcrumb`   | `boolean` | 是否显示在面包屑中                             |
| `noCache`      | `boolean` | 是否强制不缓存                                 |
| `externalLink` | `string`  | 外链地址                                       |

为了让 TypeScript 正确识别自定义 `meta` 字段，建议扩展 Vue Router 类型。

文件位置：`src/types/router.d.ts`

```ts
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
    permission?: string

    /**
     * 是否在菜单中隐藏
     */
    hidden?: boolean

    /**
     * 是否缓存页面
     */
    keepAlive?: boolean

    /**
     * 标签页是否固定
     */
    affix?: boolean

    /**
     * 详情页等场景下需要激活的菜单路径
     */
    activeMenu?: string

    /**
     * 是否展示在面包屑中
     */
    breadcrumb?: boolean

    /**
     * 是否强制不缓存
     */
    noCache?: boolean

    /**
     * 外链地址
     */
    externalLink?: string
  }
}
```

一个完整的路由 `meta` 使用示例如下：

```ts
{
  path: 'user',
  name: 'SystemUser',
  component: () => import('@/views/system/user/index.vue'),
  meta: {
    title: '用户管理',
    icon: 'User',
    requiresAuth: true,
    permission: 'system:user:list',
    keepAlive: true,
    affix: false,
    hidden: false,
    breadcrumb: true
  }
}
```

路由元信息设计时需要保持字段语义稳定。不要在不同模块中让同一个字段表达不同含义，例如 `hidden` 在一个模块表示隐藏菜单，在另一个模块表示隐藏标签页，这会导致 Layout 组件判断逻辑混乱。推荐所有路由模块共用同一套 `meta` 规范。



## 多 Layout 方案

本章节用于说明不同页面场景下的 Layout 拆分方式。Vue3 后台管理项目不建议用一个 Layout 兼容所有页面，而是应该根据页面结构差异拆分为多个布局组件。这样可以减少主布局中的条件判断，也能让登录页、后台页、空白页和异常页的职责更加清晰。

### 登录页独立布局

登录页独立布局用于承载登录、注册、找回密码、验证码校验等不需要后台主框架的页面。这类页面通常不需要侧边栏、顶部栏、面包屑、标签页和权限菜单，因此不应该复用后台管理主布局。

推荐登录页路由结构如下：

```text
/login
└── LoginLayout
    └── LoginPage
```

文件位置：`src/layouts/LoginLayout.vue`

下面的组件用于提供登录页基础布局，页面内容通过 `router-view` 渲染。

```vue
<template>
  <div class="login-layout">
    <div class="login-layout__left">
      <div class="login-layout__brand">
        <h1>后台管理系统</h1>
        <p>统一权限、菜单、路由和页面布局管理</p>
      </div>
    </div>

    <div class="login-layout__right">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'LoginLayout'
})
</script>

<style scoped lang="scss">
.login-layout {
  display: flex;
  min-height: 100vh;
  background: #f5f7fa;

  &__left {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    background: linear-gradient(135deg, #1677ff, #001529);
  }

  &__right {
    display: flex;
    width: 460px;
    align-items: center;
    justify-content: center;
    padding: 32px;
    background: #ffffff;
  }

  &__brand {
    text-align: center;

    h1 {
      margin: 0 0 16px;
      font-size: 36px;
      font-weight: 600;
    }

    p {
      margin: 0;
      font-size: 16px;
      opacity: 0.85;
    }
  }
}
</style>
```

文件位置：`src/router/modules/login.ts`

下面的路由配置用于将登录页绑定到独立的 `LoginLayout`。

```ts
import type { RouteRecordRaw } from 'vue-router'

const loginRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    component: () => import('@/layouts/LoginLayout.vue'),
    meta: {
      hidden: true
    },
    children: [
      {
        path: '',
        name: 'Login',
        component: () => import('@/views/login/index.vue'),
        meta: {
          title: '登录',
          hidden: true,
          requiresAuth: false
        }
      }
    ]
  }
]

export default loginRoutes
```

登录页独立布局的核心原则是避免依赖用户登录后的全局数据。例如用户信息、权限菜单、动态路由、标签页缓存等都不应该作为登录页布局的前置条件，否则可能导致未登录状态下页面初始化异常。

### 后台管理主布局

后台管理主布局是登录后业务页面的主要承载结构。它通常包含侧边栏、顶部栏、面包屑、标签页、内容区和底部区域。大部分业务页面都应该挂载到主布局下面。

推荐后台主布局结构如下：

```text
MainLayout
├── AppSidebar
│   └── AppMenu
├── AppHeader
├── AppBreadcrumb
├── AppTabs
├── AppMain
│   └── RouterView
└── AppFooter
```

文件位置：`src/layouts/MainLayout.vue`

下面的组件用于组织后台管理系统的主页面结构。

```vue
<template>
  <div class="main-layout">
    <AppSidebar />

    <section class="main-layout__container">
      <AppHeader />
      <AppBreadcrumb />
      <AppTabs />
      <AppMain />
      <AppFooter />
    </section>
  </div>
</template>

<script setup lang="ts">
import AppHeader from './components/AppHeader.vue'
import AppSidebar from './components/AppSidebar.vue'
import AppBreadcrumb from './components/AppBreadcrumb.vue'
import AppTabs from './components/AppTabs.vue'
import AppMain from './components/AppMain.vue'
import AppFooter from './components/AppFooter.vue'

defineOptions({
  name: 'MainLayout'
})
</script>

<style scoped lang="scss">
.main-layout {
  display: flex;
  width: 100%;
  min-height: 100vh;
  background: #f5f7fa;

  &__container {
    display: flex;
    flex: 1;
    min-width: 0;
    min-height: 100vh;
    flex-direction: column;
  }
}
</style>
```

后台主布局的路由通常作为一级路由使用，业务页面作为它的子路由。

文件位置：`src/router/modules/system.ts`

下面的路由配置用于将系统管理模块绑定到后台主布局。

```ts
import type { RouteRecordRaw } from 'vue-router'

const systemRoutes: RouteRecordRaw[] = [
  {
    path: '/system',
    component: () => import('@/layouts/MainLayout.vue'),
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
          icon: 'User',
          permission: 'system:user:list',
          keepAlive: true
        }
      },
      {
        path: 'role',
        name: 'SystemRole',
        component: () => import('@/views/system/role/index.vue'),
        meta: {
          title: '角色管理',
          icon: 'Avatar',
          permission: 'system:role:list',
          keepAlive: true
        }
      }
    ]
  }
]

export default systemRoutes
```

后台主布局需要保持稳定，不建议在业务页面中重复实现 Header、Sidebar、Tabs 等结构。业务页面只应该关注自身内容，例如查询表单、数据表格、详情弹窗、编辑表单和接口调用。

### 空白页布局

空白页布局用于承载不需要完整后台框架，但仍然需要路由管理的页面。例如重定向页、iframe 页面、打印页、无菜单详情页、外链中转页等。空白页布局通常只保留最小的页面容器和 `router-view`。

推荐空白页结构如下：

```text
BlankLayout
└── RouterView
```

文件位置：`src/layouts/BlankLayout.vue`

下面的组件用于提供最小化页面布局，不显示菜单、顶部栏和底部栏。

```vue
<template>
  <div class="blank-layout">
    <router-view />
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'BlankLayout'
})
</script>

<style scoped lang="scss">
.blank-layout {
  width: 100%;
  min-height: 100vh;
  background: #ffffff;
}
</style>
```

文件位置：`src/router/modules/blank.ts`

下面的路由配置用于承载重定向、iframe 或打印等特殊页面。

```ts
import type { RouteRecordRaw } from 'vue-router'

const blankRoutes: RouteRecordRaw[] = [
  {
    path: '/blank',
    component: () => import('@/layouts/BlankLayout.vue'),
    meta: {
      hidden: true
    },
    children: [
      {
        path: 'redirect/:path(.*)',
        name: 'Redirect',
        component: () => import('@/views/redirect/index.vue'),
        meta: {
          title: '页面跳转',
          hidden: true,
          requiresAuth: true
        }
      },
      {
        path: 'iframe',
        name: 'IframePage',
        component: () => import('@/views/iframe/index.vue'),
        meta: {
          title: '内嵌页面',
          hidden: true,
          requiresAuth: true
        }
      }
    ]
  }
]

export default blankRoutes
```

空白页布局适合处理结构特殊但仍需要路由控制的页面。如果某个页面只是菜单中隐藏，但仍然属于后台内容区，例如用户详情页、订单详情页，则不一定要使用空白布局，可以继续挂在 `MainLayout` 下，并通过 `meta.hidden` 和 `meta.activeMenu` 控制菜单表现。

### 异常页布局

异常页布局用于承载 403、404、500 等异常页面。异常页通常不需要完整后台框架，尤其是 404 页面可能在用户未登录或路由未匹配时出现，因此独立布局更稳定。

推荐异常页结构如下：

```text
ExceptionLayout
└── RouterView
    ├── 403
    ├── 404
    └── 500
```

文件位置：`src/layouts/ExceptionLayout.vue`

下面的组件用于提供异常页统一容器。

```vue
<template>
  <div class="exception-layout">
    <router-view />
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'ExceptionLayout'
})
</script>

<style scoped lang="scss">
.exception-layout {
  display: flex;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
}
</style>
```

文件位置：`src/views/exception/404.vue`

下面的组件用于展示 404 页面，并提供返回首页操作。

```vue
<template>
  <div class="exception-page">
    <h1>404</h1>
    <p>页面不存在或已被移除</p>

    <el-button type="primary" @click="goHome">
      返回首页
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

defineOptions({
  name: 'NotFound'
})

const router = useRouter()

const goHome = () => {
  router.replace('/dashboard')
}
</script>

<style scoped lang="scss">
.exception-page {
  text-align: center;

  h1 {
    margin: 0;
    color: #303133;
    font-size: 96px;
    line-height: 1;
  }

  p {
    margin: 24px 0;
    color: #606266;
    font-size: 16px;
  }
}
</style>
```

文件位置：`src/router/modules/exception.ts`

下面的路由配置用于注册异常页和兜底 404 路由。

```ts
import type { RouteRecordRaw } from 'vue-router'

const exceptionRoutes: RouteRecordRaw[] = [
  {
    path: '/exception',
    component: () => import('@/layouts/ExceptionLayout.vue'),
    meta: {
      hidden: true
    },
    children: [
      {
        path: '403',
        name: 'Forbidden',
        component: () => import('@/views/exception/403.vue'),
        meta: {
          title: '无权限',
          hidden: true
        }
      },
      {
        path: '404',
        name: 'NotFound',
        component: () => import('@/views/exception/404.vue'),
        meta: {
          title: '页面不存在',
          hidden: true
        }
      },
      {
        path: '500',
        name: 'ServerError',
        component: () => import('@/views/exception/500.vue'),
        meta: {
          title: '服务器错误',
          hidden: true
        }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/exception/404',
    meta: {
      hidden: true
    }
  }
]

export default exceptionRoutes
```

通配符路由必须放在所有普通路由之后。如果项目使用动态路由，建议在动态路由加载完成后再注册 404 兜底路由，避免刷新页面时权限路由尚未加载就被误判为 404。

## 菜单与路由联动

本章节用于说明菜单、路由、面包屑之间的联动关系。后台管理系统中，菜单不建议单独维护一份完全独立的数据，而应该优先从路由配置或后端动态路由中生成。这样可以让访问路径、菜单标题、菜单图标、权限标识和页面缓存配置保持一致。

### 根据路由生成菜单

根据路由生成菜单的核心思想是：路由配置作为页面访问的基础数据，菜单只是路由数据的一种展示形式。通过读取路由中的 `meta.title`、`meta.icon`、`meta.hidden`、`children` 等字段，可以生成侧边栏菜单。

推荐路由到菜单的转换关系如下：

| 路由字段      | 菜单字段   | 说明                     |
| ------------- | ---------- | ------------------------ |
| `path`        | `path`     | 菜单跳转路径             |
| `name`        | `name`     | 菜单唯一标识             |
| `meta.title`  | `title`    | 菜单标题                 |
| `meta.icon`   | `icon`     | 菜单图标                 |
| `meta.hidden` | 是否隐藏   | 为 `true` 时不显示在菜单 |
| `children`    | `children` | 子菜单                   |

文件位置：`src/router/helper.ts`

下面的工具方法用于将路由配置转换为菜单数据，并过滤隐藏路由。

```ts
import type { RouteRecordRaw } from 'vue-router'

export interface MenuItem {
  path: string
  name?: string
  title: string
  icon?: string
  children?: MenuItem[]
}

/**
 * 根据父路径和子路径拼接完整路径
 */
const resolveRoutePath = (parentPath: string, routePath: string) => {
  if (routePath.startsWith('/')) {
    return routePath
  }

  return `${parentPath}/${routePath}`.replace(/\/+/g, '/')
}

/**
 * 将路由配置转换为菜单数据
 */
export const generateMenusByRoutes = (
  routes: RouteRecordRaw[],
  parentPath = ''
): MenuItem[] => {
  return routes
    .filter((route) => !route.meta?.hidden)
    .map((route) => {
      const fullPath = resolveRoutePath(parentPath, route.path)

      const children = route.children?.length
        ? generateMenusByRoutes(route.children, fullPath)
        : []

      return {
        path: fullPath,
        name: route.name?.toString(),
        title: route.meta?.title?.toString() || '',
        icon: route.meta?.icon?.toString(),
        children
      }
    })
    .filter((item) => item.title)
}
```

文件位置：`src/stores/modules/permission.ts`

下面的 Store 用于维护权限路由和菜单数据，菜单组件只消费转换后的菜单结果。

```ts
import { defineStore } from 'pinia'
import type { RouteRecordRaw } from 'vue-router'
import { asyncRoutes } from '@/router/routes'
import { generateMenusByRoutes, type MenuItem } from '@/router/helper'

interface PermissionState {
  routes: RouteRecordRaw[]
  menus: MenuItem[]
}

export const usePermissionStore = defineStore('permission', {
  state: (): PermissionState => ({
    routes: [],
    menus: []
  }),

  actions: {
    setRoutes(routes: RouteRecordRaw[]) {
      this.routes = routes
      this.menus = generateMenusByRoutes(routes)
    },

    async buildRoutes() {
      // 示例中直接使用本地动态路由，实际项目可在这里接入后端菜单和权限过滤
      this.setRoutes(asyncRoutes)
      return this.routes
    }
  }
})
```

文件位置：`src/layouts/components/AppMenu.vue`

下面的菜单组件用于读取权限 Store 中的菜单数据并渲染 Element Plus 菜单。

```vue
<template>
  <el-scrollbar class="app-menu">
    <el-menu
      :default-active="activeMenu"
      :default-openeds="defaultOpeneds"
      :collapse="appStore.sidebarCollapsed"
      router
      unique-opened
      background-color="#001529"
      text-color="#bfcbd9"
      active-text-color="#409eff"
    >
      <template v-for="item in menus" :key="item.path">
        <el-sub-menu v-if="item.children?.length" :index="item.path">
          <template #title>
            <span>{{ item.title }}</span>
          </template>

          <el-menu-item
            v-for="child in item.children"
            :key="child.path"
            :index="child.path"
          >
            {{ child.title }}
          </el-menu-item>
        </el-sub-menu>

        <el-menu-item v-else :index="item.path">
          {{ item.title }}
        </el-menu-item>
      </template>
    </el-menu>
  </el-scrollbar>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores/modules/app'
import { usePermissionStore } from '@/stores/modules/permission'

const route = useRoute()
const appStore = useAppStore()
const permissionStore = usePermissionStore()

const menus = computed(() => permissionStore.menus)

const activeMenu = computed(() => {
  return route.meta.activeMenu?.toString() || route.path
})

const defaultOpeneds = computed(() => {
  return route.matched
    .map((item) => item.path)
    .filter((path) => path && path !== route.path)
})
</script>

<style scoped lang="scss">
.app-menu {
  height: calc(100vh - 56px);

  :deep(.el-menu) {
    border-right: none;
  }
}
</style>
```

菜单生成逻辑建议集中在工具函数和权限 Store 中，不建议在 `AppMenu.vue` 中直接写复杂的数据转换逻辑。菜单组件只负责展示和交互，这样后续接入后端动态菜单时影响范围更小。

### 菜单选中状态处理

菜单选中状态应由当前路由决定，而不是由菜单组件内部手动维护。Element Plus 的 `el-menu` 可以通过 `default-active` 指定当前激活菜单项。推荐将菜单项的 `index` 设置为完整路由路径，这样可以直接使用 `route.path` 作为选中值。

普通页面的选中逻辑如下：

```ts
const activeMenu = computed(() => {
  return route.path
})
```

但是在详情页、编辑页、日志详情页等隐藏页面中，当前路径可能不在菜单中。例如访问 `/system/user/detail/1` 时，侧边栏中并不存在这个菜单项，此时应该让菜单继续选中 `/system/user`。

推荐通过 `meta.activeMenu` 处理这种场景：

```ts
const activeMenu = computed(() => {
  return route.meta.activeMenu?.toString() || route.path
})
```

对应路由配置如下：

```ts
{
  path: 'user/detail/:id',
  name: 'SystemUserDetail',
  component: () => import('@/views/system/user/detail.vue'),
  meta: {
    title: '用户详情',
    hidden: true,
    activeMenu: '/system/user',
    permission: 'system:user:detail'
  }
}
```

这种方式可以让隐藏页面仍然保持正确的菜单选中状态。推荐在以下场景配置 `activeMenu`：

| 场景     | 当前路由                      | 激活菜单             |
| -------- | ----------------------------- | -------------------- |
| 用户详情 | `/system/user/detail/1`       | `/system/user`       |
| 用户编辑 | `/system/user/edit/1`         | `/system/user`       |
| 角色授权 | `/system/role/auth/1`         | `/system/role`       |
| 日志详情 | `/monitor/login-log/detail/1` | `/monitor/login-log` |

菜单选中状态不建议通过点击事件手动维护。因为浏览器刷新、地址栏直接访问、权限路由动态加载、标签页切换等情况都会改变当前路由，如果菜单状态脱离路由，容易出现选中项不一致的问题。

### 菜单展开状态处理

菜单展开状态用于控制父级菜单是否展开。对于后台管理系统，推荐默认根据当前路由的 `matched` 记录自动展开父级菜单。这样用户刷新页面或直接访问深层路径时，侧边栏可以自动展开到当前页面所在模块。

推荐展开逻辑如下：

```ts
const defaultOpeneds = computed(() => {
  return route.matched
    .map((item) => item.path)
    .filter((path) => path && path !== route.path)
})
```

如果项目菜单层级较深，可以结合完整路径进行展开。例如当前路径为 `/system/user/detail/1`，它的父级菜单应该展开 `/system`，并选中 `/system/user`。

在 Element Plus 中，`default-openeds` 只在菜单初始化时生效。如果需要路由切换后实时更新展开状态，可以使用受控的 `openedMenus` 状态，并监听路由变化。

文件位置：`src/layouts/components/AppMenu.vue`

下面的代码用于在路由变化时同步菜单展开状态。

```vue
<template>
  <el-scrollbar class="app-menu">
    <el-menu
      :default-active="activeMenu"
      :default-openeds="openedMenus"
      :collapse="appStore.sidebarCollapsed"
      router
      unique-opened
      background-color="#001529"
      text-color="#bfcbd9"
      active-text-color="#409eff"
    >
      <template v-for="item in menus" :key="item.path">
        <el-sub-menu v-if="item.children?.length" :index="item.path">
          <template #title>
            <span>{{ item.title }}</span>
          </template>

          <el-menu-item
            v-for="child in item.children"
            :key="child.path"
            :index="child.path"
          >
            {{ child.title }}
          </el-menu-item>
        </el-sub-menu>

        <el-menu-item v-else :index="item.path">
          {{ item.title }}
        </el-menu-item>
      </template>
    </el-menu>
  </el-scrollbar>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores/modules/app'
import { usePermissionStore } from '@/stores/modules/permission'

const route = useRoute()
const appStore = useAppStore()
const permissionStore = usePermissionStore()

const openedMenus = ref<string[]>([])

const menus = computed(() => permissionStore.menus)

const activeMenu = computed(() => {
  return route.meta.activeMenu?.toString() || route.path
})

watch(
  () => route.path,
  () => {
    // 根据当前路由匹配记录展开父级菜单
    openedMenus.value = route.matched
      .map((item) => item.path)
      .filter((path) => path && path !== route.path)
  },
  {
    immediate: true
  }
)
</script>
```

菜单展开策略可以根据项目交互习惯选择：

| 策略             | 说明                                                     |
| ---------------- | -------------------------------------------------------- |
| `unique-opened`  | 同一时间只展开一个父级菜单，适合菜单较多的后台系统       |
| 多菜单展开       | 允许多个父级菜单同时展开，适合模块较少的系统             |
| 根据路由自动展开 | 页面刷新或直接访问时自动展开当前模块                     |
| 记忆展开状态     | 将展开菜单存入 Pinia 或 localStorage，适合用户自定义体验 |

如果启用侧边栏折叠，折叠状态下通常不需要维护展开菜单。恢复展开后，可以重新根据当前路由计算默认展开项。

### 面包屑生成设计

面包屑用于展示当前页面在路由层级中的位置。推荐根据 `route.matched` 自动生成面包屑，而不是每个页面单独手写。这样可以保证面包屑与路由结构保持一致。

面包屑生成规则如下：

| 规则                        | 说明                                 |
| --------------------------- | ------------------------------------ |
| 从 `route.matched` 读取层级 | 保持和当前路由匹配结果一致           |
| 过滤无标题路由              | 没有 `meta.title` 的路由不展示       |
| 过滤隐藏面包屑路由          | `meta.breadcrumb === false` 时不展示 |
| 最后一项不可点击            | 当前页面只展示文本，不执行跳转       |
| 支持重定向路径              | 父级菜单可跳转到默认子页面           |

文件位置：`src/layouts/components/AppBreadcrumb.vue`

下面的组件用于根据当前路由自动生成面包屑。

```vue
<template>
  <div class="app-breadcrumb">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item
        v-for="(item, index) in breadcrumbs"
        :key="item.path"
      >
        <span
          v-if="index === breadcrumbs.length - 1"
          class="app-breadcrumb__current"
        >
          {{ item.title }}
        </span>

        <a
          v-else
          href="javascript:void(0)"
          @click="handleClick(item)"
        >
          {{ item.title }}
        </a>
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

interface BreadcrumbItem {
  path: string
  title: string
  redirect?: string
}

const route = useRoute()
const router = useRouter()

const breadcrumbs = computed<BreadcrumbItem[]>(() => {
  return route.matched
    .filter((item) => item.meta?.title && item.meta?.breadcrumb !== false)
    .map((item) => ({
      path: item.path,
      title: item.meta.title?.toString() || '',
      redirect: typeof item.redirect === 'string' ? item.redirect : undefined
    }))
})

const handleClick = async (item: BreadcrumbItem) => {
  // 优先跳转 redirect，没有 redirect 时跳转 path
  await router.push(item.redirect || item.path)
}
</script>

<style scoped lang="scss">
.app-breadcrumb {
  display: flex;
  height: 40px;
  align-items: center;
  padding: 0 16px;
  background: #ffffff;
  border-bottom: 1px solid #ebeef5;

  &__current {
    color: #909399;
  }
}
</style>
```

对应路由配置示例如下：

```ts
{
  path: '/system',
  component: () => import('@/layouts/MainLayout.vue'),
  redirect: '/system/user',
  meta: {
    title: '系统管理',
    icon: 'Setting',
    breadcrumb: true
  },
  children: [
    {
      path: 'user',
      name: 'SystemUser',
      component: () => import('@/views/system/user/index.vue'),
      meta: {
        title: '用户管理',
        icon: 'User',
        breadcrumb: true
      }
    },
    {
      path: 'user/detail/:id',
      name: 'SystemUserDetail',
      component: () => import('@/views/system/user/detail.vue'),
      meta: {
        title: '用户详情',
        hidden: true,
        activeMenu: '/system/user',
        breadcrumb: true
      }
    }
  ]
}
```

当访问 `/system/user/detail/1` 时，面包屑可以生成如下结构：

```text
系统管理 / 用户详情
```

如果希望详情页面包屑展示为 `系统管理 / 用户管理 / 用户详情`，则需要将详情页设计为用户管理页面下的更深层子路由，或者在 `meta` 中扩展自定义面包屑字段。例如：

```ts
{
  path: 'user/detail/:id',
  name: 'SystemUserDetail',
  component: () => import('@/views/system/user/detail.vue'),
  meta: {
    title: '用户详情',
    hidden: true,
    activeMenu: '/system/user',
    breadcrumbItems: [
      {
        title: '系统管理',
        path: '/system'
      },
      {
        title: '用户管理',
        path: '/system/user'
      },
      {
        title: '用户详情'
      }
    ]
  }
}
```

如果项目中的详情页、编辑页较多，推荐扩展 `meta.breadcrumbItems`，用于处理非标准路由层级下的面包屑展示。标准列表页和模块页则继续使用 `route.matched` 自动生成，避免重复配置。



## 权限与 Layout 控制

本章节用于说明权限体系与 Layout、路由、菜单之间的协作方式。后台管理项目中，权限不应该只控制页面接口，也需要控制路由是否可访问、菜单是否可见、Layout 是否加载、页面缓存是否生效等前端行为。

权限设计建议以路由 `meta` 为核心，将页面权限标识、登录要求、菜单隐藏状态、缓存状态统一维护在路由配置中。Layout 组件不直接计算复杂权限，而是消费权限过滤后的路由和菜单数据。

### 路由权限标识设计

路由权限标识用于描述当前页面需要什么权限才能访问。常见方式是在路由 `meta` 中维护 `permission`、`roles`、`requiresAuth` 等字段。

推荐字段设计如下：

| 字段           | 类型       | 说明                                         |
| -------------- | ---------- | -------------------------------------------- |
| `requiresAuth` | `boolean`  | 是否需要登录                                 |
| `permission`   | `string`   | 页面权限标识，适合按钮级、菜单级权限统一管理 |
| `roles`        | `string[]` | 允许访问的角色编码                           |
| `hidden`       | `boolean`  | 是否在菜单中隐藏                             |
| `keepAlive`    | `boolean`  | 是否缓存页面                                 |
| `activeMenu`   | `string`   | 隐藏页面需要激活的菜单路径                   |

文件位置：`src/types/router.d.ts`

下面的类型声明用于扩展 Vue Router 的 `RouteMeta`，让 TypeScript 能识别自定义路由元信息。

```ts
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
    permission?: string

    /**
     * 允许访问的角色编码
     */
    roles?: string[]

    /**
     * 是否在菜单中隐藏
     */
    hidden?: boolean

    /**
     * 是否缓存页面
     */
    keepAlive?: boolean

    /**
     * 当前页面需要激活的菜单路径
     */
    activeMenu?: string

    /**
     * 是否展示在面包屑中
     */
    breadcrumb?: boolean
  }
}
```

路由配置示例如下：

```ts
{
  path: '/system',
  component: () => import('@/layouts/MainLayout.vue'),
  redirect: '/system/user',
  meta: {
    title: '系统管理',
    icon: 'Setting',
    requiresAuth: true,
    permission: 'system'
  },
  children: [
    {
      path: 'user',
      name: 'SystemUser',
      component: () => import('@/views/system/user/index.vue'),
      meta: {
        title: '用户管理',
        icon: 'User',
        requiresAuth: true,
        permission: 'system:user:list',
        keepAlive: true
      }
    },
    {
      path: 'role',
      name: 'SystemRole',
      component: () => import('@/views/system/role/index.vue'),
      meta: {
        title: '角色管理',
        icon: 'Avatar',
        requiresAuth: true,
        permission: 'system:role:list',
        keepAlive: true
      }
    },
    {
      path: 'user/detail/:id',
      name: 'SystemUserDetail',
      component: () => import('@/views/system/user/detail.vue'),
      meta: {
        title: '用户详情',
        hidden: true,
        activeMenu: '/system/user',
        requiresAuth: true,
        permission: 'system:user:detail'
      }
    }
  ]
}
```

权限标识建议采用分层命名方式，例如：

```text
system:user:list      # 用户列表
system:user:create    # 用户新增
system:user:update    # 用户修改
system:user:delete    # 用户删除
system:role:list      # 角色列表
system:role:grant     # 角色授权
```

这样可以让菜单权限、页面权限、按钮权限使用同一套编码体系。页面访问控制通常使用 `list`、`detail`、`page` 类权限，按钮控制通常使用 `create`、`update`、`delete`、`export` 类权限。

### 菜单权限过滤

菜单权限过滤用于根据当前用户权限，只展示用户可访问的菜单。推荐基于路由配置进行过滤：先过滤无权限路由，再将剩余路由转换为菜单数据。

文件位置：`src/router/helper.ts`

下面的工具方法用于判断用户是否拥有某个路由的访问权限，并递归过滤路由。

```ts
import type { RouteRecordRaw } from 'vue-router'

/**
 * 判断用户是否拥有指定路由权限
 */
export const hasRoutePermission = (
  route: RouteRecordRaw,
  permissions: string[],
  roles: string[]
) => {
  const routePermission = route.meta?.permission
  const routeRoles = route.meta?.roles

  if (routeRoles?.length) {
    return routeRoles.some((role) => roles.includes(role))
  }

  if (routePermission) {
    return permissions.includes(routePermission.toString())
  }

  return true
}

/**
 * 根据权限递归过滤路由
 */
export const filterRoutesByPermissions = (
  routes: RouteRecordRaw[],
  permissions: string[],
  roles: string[]
): RouteRecordRaw[] => {
  return routes
    .filter((route) => hasRoutePermission(route, permissions, roles))
    .map((route) => {
      const newRoute: RouteRecordRaw = {
        ...route,
        children: route.children
          ? filterRoutesByPermissions(route.children, permissions, roles)
          : undefined
      }

      return newRoute
    })
    .filter((route) => {
      // 父级路由没有页面组件但子路由全部被过滤时，不再保留该菜单分组
      if (route.children && route.children.length === 0 && route.redirect) {
        return false
      }

      return true
    })
}
```

文件位置：`src/router/menu.ts`

下面的工具方法用于将过滤后的路由转换为菜单数据。

```ts
import type { RouteRecordRaw } from 'vue-router'

export interface MenuItem {
  path: string
  name?: string
  title: string
  icon?: string
  children?: MenuItem[]
}

/**
 * 拼接父子路由路径
 */
const resolveRoutePath = (parentPath: string, routePath: string) => {
  if (routePath.startsWith('/')) {
    return routePath
  }

  return `${parentPath}/${routePath}`.replace(/\/+/g, '/')
}

/**
 * 根据路由生成菜单
 */
export const generateMenusByRoutes = (
  routes: RouteRecordRaw[],
  parentPath = ''
): MenuItem[] => {
  return routes
    .filter((route) => !route.meta?.hidden)
    .map((route) => {
      const fullPath = resolveRoutePath(parentPath, route.path)
      const children = route.children?.length
        ? generateMenusByRoutes(route.children, fullPath)
        : []

      return {
        path: fullPath,
        name: route.name?.toString(),
        title: route.meta?.title?.toString() || '',
        icon: route.meta?.icon?.toString(),
        children
      }
    })
    .filter((item) => item.title)
}
```

文件位置：`src/stores/modules/permission.ts`

下面的 Store 用于统一维护权限路由和菜单数据。

```ts
import { defineStore } from 'pinia'
import type { RouteRecordRaw } from 'vue-router'
import { asyncRoutes } from '@/router/routes'
import { filterRoutesByPermissions } from '@/router/helper'
import { generateMenusByRoutes, type MenuItem } from '@/router/menu'

interface PermissionState {
  routes: RouteRecordRaw[]
  menus: MenuItem[]
  isRoutesLoaded: boolean
}

export const usePermissionStore = defineStore('permission', {
  state: (): PermissionState => ({
    routes: [],
    menus: [],
    isRoutesLoaded: false
  }),

  actions: {
    /**
     * 根据用户权限生成可访问路由和菜单
     */
    generateRoutes(permissions: string[], roles: string[]) {
      const accessedRoutes = filterRoutesByPermissions(asyncRoutes, permissions, roles)

      this.routes = accessedRoutes
      this.menus = generateMenusByRoutes(accessedRoutes)
      this.isRoutesLoaded = true

      return accessedRoutes
    },

    /**
     * 重置权限路由
     */
    resetRoutes() {
      this.routes = []
      this.menus = []
      this.isRoutesLoaded = false
    }
  }
})
```

菜单组件只需要消费 `permissionStore.menus`，不需要关心权限过滤细节。这样可以保证菜单组件职责单一，后续切换为后端动态菜单时，也只需要调整权限 Store 和路由生成逻辑。

### 页面访问控制

页面访问控制用于防止用户通过地址栏直接访问无权限页面。菜单过滤只能控制“看不看得见”，路由守卫需要控制“能不能访问”。

推荐在全局前置守卫中处理登录状态、动态路由加载和权限校验。

文件位置：`src/router/guard.ts`

下面的守卫逻辑用于处理登录校验、动态路由加载和页面权限控制。

```ts
import type { Router, RouteLocationNormalized } from 'vue-router'
import { useUserStore } from '@/stores/modules/user'
import { usePermissionStore } from '@/stores/modules/permission'
import { hasRoutePermission } from '@/router/helper'

const whiteList = ['/login', '/exception/403', '/exception/404', '/exception/500']

/**
 * 判断目标路由是否在白名单中
 */
const isWhiteRoute = (to: RouteLocationNormalized) => {
  return whiteList.includes(to.path)
}

/**
 * 判断当前用户是否可以访问目标路由
 */
const canAccessRoute = (
  to: RouteLocationNormalized,
  permissions: string[],
  roles: string[]
) => {
  return to.matched.every((route) => {
    return hasRoutePermission(route, permissions, roles)
  })
}

/**
 * 注册全局路由守卫
 */
export const setupRouterGuard = (router: Router) => {
  router.beforeEach(async (to) => {
    const userStore = useUserStore()
    const permissionStore = usePermissionStore()

    if (isWhiteRoute(to)) {
      return true
    }

    if (!userStore.token) {
      return {
        path: '/login',
        query: {
          redirect: to.fullPath
        }
      }
    }

    if (!permissionStore.isRoutesLoaded) {
      const accessedRoutes = permissionStore.generateRoutes(
        userStore.permissions,
        userStore.roles
      )

      accessedRoutes.forEach((route) => {
        router.addRoute(route)
      })

      return {
        ...to,
        replace: true
      }
    }

    if (!canAccessRoute(to, userStore.permissions, userStore.roles)) {
      return {
        path: '/exception/403',
        replace: true
      }
    }

    return true
  })
}
```

文件位置：`src/router/index.ts`

下面的代码用于创建路由实例并注册路由守卫。

```ts
import { createRouter, createWebHistory } from 'vue-router'
import { constantRoutes } from './routes'
import { setupRouterGuard } from './guard'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: constantRoutes,
  scrollBehavior() {
    return {
      top: 0,
      left: 0
    }
  }
})

setupRouterGuard(router)

export default router
```

页面访问控制需要注意两点：第一，前端权限控制不能代替后端接口权限控制；第二，动态路由加载完成后需要使用 `replace: true` 重新进入当前地址，避免刷新页面时路由尚未注册导致匹配失败。

### 动态路由加载

动态路由加载用于在用户登录后，根据用户权限生成可访问路由，并通过 `router.addRoute` 注册到 Vue Router 中。动态路由通常来自两种方式：前端本地维护完整路由，再根据权限过滤；或者后端返回菜单和组件路径，前端转换为路由对象。

前端本地维护路由的方式更适合中小型后台系统，优点是组件路径明确、类型友好、开发调试简单。后端返回动态菜单的方式更适合多租户、低代码平台或权限配置高度动态的系统。

推荐动态加载流程如下：

```text
用户登录
└── 获取 token
    └── 获取用户信息、角色、权限标识
        └── 根据权限过滤 asyncRoutes
            └── router.addRoute 注册动态路由
                └── 生成菜单
                    └── 进入目标页面
```

文件位置：`src/router/routes.ts`

下面的路由文件将静态路由和动态路由分开维护。

```ts
import type { RouteRecordRaw } from 'vue-router'
import loginRoutes from './modules/login'
import dashboardRoutes from './modules/dashboard'
import exceptionRoutes from './modules/exception'
import systemRoutes from './modules/system'
import monitorRoutes from './modules/monitor'

export const constantRoutes: RouteRecordRaw[] = [
  ...loginRoutes,
  ...dashboardRoutes,
  ...exceptionRoutes
]

export const asyncRoutes: RouteRecordRaw[] = [
  ...systemRoutes,
  ...monitorRoutes
]
```

文件位置：`src/stores/modules/user.ts`

下面的 Store 示例用于维护用户 token、角色和权限标识。

```ts
import { defineStore } from 'pinia'

interface UserState {
  token: string
  nickname: string
  roles: string[]
  permissions: string[]
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    token: '',
    nickname: '',
    roles: [],
    permissions: []
  }),

  actions: {
    setToken(token: string) {
      this.token = token
    },

    setUserInfo(data: Partial<UserState>) {
      this.nickname = data.nickname || ''
      this.roles = data.roles || []
      this.permissions = data.permissions || []
    },

    async logout() {
      this.token = ''
      this.nickname = ''
      this.roles = []
      this.permissions = []
    }
  }
})
```

动态路由加载完成后，Layout 组件读取的是权限 Store 中的菜单数据，而不是原始 `asyncRoutes`。这样可以保证用户只能看到自己有权限访问的菜单。

## 页面缓存设计

本章节用于说明 Vue3 项目中页面缓存的设计方式。页面缓存通常基于 `keep-alive` 实现，适合列表页、查询页、标签页切换等场景。缓存设计需要和路由 `meta`、页面组件名称、标签页状态保持一致。

### keep-alive 使用场景

`keep-alive` 用于缓存组件实例，避免页面切换后组件被销毁。它适合缓存查询条件、分页状态、表格滚动位置、已加载数据等页面状态。

推荐使用缓存的场景如下：

| 场景       | 是否推荐缓存 | 说明                             |
| ---------- | ------------ | -------------------------------- |
| 用户列表   | 推荐         | 返回列表时保留查询条件和分页     |
| 角色列表   | 推荐         | 切换详情后回到列表保留状态       |
| 日志列表   | 视情况而定   | 数据实时性要求高时不建议缓存     |
| 表单新增页 | 不推荐       | 避免旧表单数据残留               |
| 编辑页     | 不推荐       | 不同 ID 页面容易出现缓存污染     |
| 详情页     | 视情况而定   | 详情数据稳定时可缓存，否则不建议 |
| Dashboard  | 视情况而定   | 图表实时性强时不建议缓存         |

文件位置：`src/layouts/components/AppMain.vue`

下面的内容区域组件通过 `keep-alive` 缓存指定页面组件。

```vue
<template>
  <main class="app-main">
    <router-view v-slot="{ Component, route }">
      <transition name="fade-slide" mode="out-in">
        <keep-alive :include="cachedViews">
          <component
            :is="Component"
            :key="route.name || route.fullPath"
          />
        </keep-alive>
      </transition>
    </router-view>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTabsStore } from '@/stores/modules/tabs'

const tabsStore = useTabsStore()

const cachedViews = computed(() => {
  return tabsStore.cachedViews
})
</script>

<style scoped lang="scss">
.app-main {
  box-sizing: border-box;
  flex: 1;
  min-height: 0;
  padding: 16px;
  overflow: auto;
  background: #f5f7fa;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.2s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(12px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-12px);
}
</style>
```

这里需要注意：`keep-alive` 的 `include` 匹配的是组件名称，而不是路由路径。因此需要缓存的页面必须定义组件名称。

文件位置：`src/views/system/user/index.vue`

下面的页面组件显式声明了组件名称，用于配合 `keep-alive` 缓存。

```vue
<template>
  <div class="user-page">
    <el-card shadow="never">
      用户管理页面
    </el-card>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'SystemUser'
})
</script>

<style scoped lang="scss">
.user-page {
  min-height: 100%;
}
</style>
```

如果页面没有定义组件名称，即使路由配置了 `keepAlive: true`，也可能无法正确进入缓存列表。

### 路由缓存标识设计

路由缓存标识建议统一放在 `meta.keepAlive` 中。页面是否缓存由路由配置决定，缓存组件名称由路由 `name` 或页面组件 `name` 统一约定。

推荐规则如下：

| 规则                                     | 说明                           |
| ---------------------------------------- | ------------------------------ |
| `meta.keepAlive = true`                  | 表示该页面允许缓存             |
| `route.name` 必须唯一                    | 作为缓存名称和标签页标识       |
| 页面组件 `name` 与 `route.name` 保持一致 | 方便 `keep-alive include` 匹配 |
| 动态详情页默认不缓存                     | 避免不同参数页面复用同一实例   |
| 关闭标签页时移除缓存                     | 防止缓存数据长期占用内存       |

路由配置示例如下：

```ts
{
  path: 'user',
  name: 'SystemUser',
  component: () => import('@/views/system/user/index.vue'),
  meta: {
    title: '用户管理',
    icon: 'User',
    permission: 'system:user:list',
    keepAlive: true
  }
}
```

页面组件名称对应如下：

```ts
defineOptions({
  name: 'SystemUser'
})
```

如果项目存在同一个组件被多个路由复用的情况，需要谨慎处理缓存名称。例如 `/report/day` 和 `/report/month` 如果共用同一个组件，组件名相同会导致缓存实例复用。此时建议拆分包装组件，或者使用不同页面组件名称。

不推荐缓存的路由可以明确设置：

```ts
{
  path: 'user/edit/:id',
  name: 'SystemUserEdit',
  component: () => import('@/views/system/user/edit.vue'),
  meta: {
    title: '编辑用户',
    hidden: true,
    activeMenu: '/system/user',
    permission: 'system:user:update',
    keepAlive: false
  }
}
```

### 标签页与缓存联动

标签页与缓存通常需要联动：打开一个可缓存页面时，将页面名称加入缓存列表；关闭标签页时，将页面名称从缓存列表中移除；刷新标签页时，先移除缓存再重新进入页面。

文件位置：`src/stores/modules/tabs.ts`

下面的 Store 用于维护已访问标签页和缓存页面名称。

```ts
import { defineStore } from 'pinia'
import type { RouteLocationNormalizedLoaded } from 'vue-router'

export interface TabItem {
  title: string
  path: string
  fullPath: string
  name?: string
  affix?: boolean
}

interface TabsState {
  visitedViews: TabItem[]
  cachedViews: string[]
}

export const useTabsStore = defineStore('tabs', {
  state: (): TabsState => ({
    visitedViews: [],
    cachedViews: []
  }),

  actions: {
    addView(route: RouteLocationNormalizedLoaded) {
      this.addVisitedView(route)
      this.addCachedView(route)
    },

    addVisitedView(route: RouteLocationNormalizedLoaded) {
      const name = route.name?.toString()
      const exists = this.visitedViews.some((item) => item.fullPath === route.fullPath)

      if (exists || !name) {
        return
      }

      this.visitedViews.push({
        title: route.meta.title?.toString() || '未命名页面',
        path: route.path,
        fullPath: route.fullPath,
        name,
        affix: Boolean(route.meta.affix)
      })
    },

    addCachedView(route: RouteLocationNormalizedLoaded) {
      const name = route.name?.toString()

      if (!name || !route.meta.keepAlive) {
        return
      }

      if (!this.cachedViews.includes(name)) {
        this.cachedViews.push(name)
      }
    },

    removeView(route: TabItem) {
      this.removeVisitedView(route)
      this.removeCachedView(route)
    },

    removeVisitedView(route: TabItem) {
      if (route.affix) {
        return
      }

      this.visitedViews = this.visitedViews.filter((item) => {
        return item.fullPath !== route.fullPath
      })
    },

    removeCachedView(route: TabItem) {
      if (!route.name) {
        return
      }

      this.cachedViews = this.cachedViews.filter((name) => {
        return name !== route.name
      })
    },

    removeAllViews() {
      this.visitedViews = this.visitedViews.filter((item) => item.affix)
      this.cachedViews = []
    }
  }
})
```

文件位置：`src/layouts/components/AppTabs.vue`

下面的标签页组件用于展示访问过的页面，并在关闭标签时同步移除缓存。

```vue
<template>
  <div class="app-tabs">
    <el-tabs
      v-model="activeTab"
      type="card"
      closable
      @tab-click="handleTabClick"
      @tab-remove="handleTabRemove"
    >
      <el-tab-pane
        v-for="item in tabsStore.visitedViews"
        :key="item.fullPath"
        :label="item.title"
        :name="item.fullPath"
        :closable="!item.affix"
      />
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import type { TabPaneName, TabsPaneContext } from 'element-plus'
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTabsStore, type TabItem } from '@/stores/modules/tabs'

const route = useRoute()
const router = useRouter()
const tabsStore = useTabsStore()

const activeTab = computed({
  get() {
    return route.fullPath
  },
  set(value: string) {
    router.push(value)
  }
})

watch(
  () => route.fullPath,
  () => {
    tabsStore.addView(route)
  },
  {
    immediate: true
  }
)

const handleTabClick = (pane: TabsPaneContext) => {
  if (pane.paneName) {
    router.push(pane.paneName.toString())
  }
}

const handleTabRemove = async (name: TabPaneName) => {
  const target = tabsStore.visitedViews.find((item) => item.fullPath === name)

  if (!target) {
    return
  }

  tabsStore.removeView(target)

  if (route.fullPath === target.fullPath) {
    const latestView = tabsStore.visitedViews.at(-1)
    await router.push(latestView?.fullPath || '/dashboard')
  }
}
</script>

<style scoped lang="scss">
.app-tabs {
  height: 40px;
  padding: 4px 8px 0;
  background: #ffffff;
  border-bottom: 1px solid #ebeef5;

  :deep(.el-tabs__header) {
    margin: 0;
  }
}
</style>
```

标签页和缓存联动时，建议用 `route.name` 作为缓存标识，用 `route.fullPath` 作为标签页唯一标识。这样可以区分同一路由不同参数的标签页，同时又能让缓存控制保持相对稳定。

## 响应式与交互设计

本章节用于说明 Layout 在不同屏幕尺寸和交互场景下的处理方式。后台管理系统虽然主要面向桌面端，但仍需要处理侧边栏折叠、移动端菜单、内容区域滚动、页面切换动画等基础体验。

### 侧边栏折叠

侧边栏折叠用于在内容区域空间不足时收起菜单宽度。折叠状态属于全局布局状态，推荐放在 Pinia Store 中维护，而不是由 `AppSidebar` 组件内部单独维护。

文件位置：`src/stores/modules/app.ts`

下面的 Store 用于维护侧边栏折叠状态、移动端状态和底部栏显示状态。

```ts
import { defineStore } from 'pinia'

interface AppState {
  sidebarCollapsed: boolean
  mobile: boolean
  mobileSidebarVisible: boolean
  showFooter: boolean
}

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    sidebarCollapsed: localStorage.getItem('sidebarCollapsed') === 'true',
    mobile: false,
    mobileSidebarVisible: false,
    showFooter: true
  }),

  actions: {
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed
      localStorage.setItem('sidebarCollapsed', String(this.sidebarCollapsed))
    },

    setSidebarCollapsed(value: boolean) {
      this.sidebarCollapsed = value
      localStorage.setItem('sidebarCollapsed', String(value))
    },

    setMobile(value: boolean) {
      this.mobile = value
    },

    openMobileSidebar() {
      this.mobileSidebarVisible = true
    },

    closeMobileSidebar() {
      this.mobileSidebarVisible = false
    }
  }
})
```

文件位置：`src/layouts/components/AppHeader.vue`

下面的头部按钮用于根据当前设备状态控制侧边栏。

```vue
<template>
  <header class="app-header">
    <el-button text @click="handleToggleSidebar">
      <el-icon>
        <Fold v-if="!appStore.sidebarCollapsed" />
        <Expand v-else />
      </el-icon>
    </el-button>

    <span class="app-header__title">后台管理系统</span>
  </header>
</template>

<script setup lang="ts">
import { Expand, Fold } from '@element-plus/icons-vue'
import { useAppStore } from '@/stores/modules/app'

const appStore = useAppStore()

const handleToggleSidebar = () => {
  if (appStore.mobile) {
    appStore.openMobileSidebar()
    return
  }

  appStore.toggleSidebar()
}
</script>

<style scoped lang="scss">
.app-header {
  display: flex;
  height: 56px;
  align-items: center;
  padding: 0 16px;
  background: #ffffff;
  border-bottom: 1px solid #ebeef5;

  &__title {
    margin-left: 12px;
    font-size: 16px;
    font-weight: 600;
  }
}
</style>
```

侧边栏折叠建议只影响 Layout 宽度和菜单展示，不应该影响路由结构和菜单数据。菜单数据仍然保持完整，只是展示方式从完整标题变成图标或弹出菜单。

### 移动端适配

移动端适配主要处理侧边栏展示方式。桌面端侧边栏可以固定在左侧，移动端建议改为抽屉菜单，避免挤压内容区域。

推荐响应式规则如下：

| 屏幕宽度               | 行为                         |
| ---------------------- | ---------------------------- |
| `>= 1200px`            | 展示完整侧边栏               |
| `>= 768px && < 1200px` | 默认折叠侧边栏               |
| `< 768px`              | 隐藏固定侧边栏，使用抽屉菜单 |

文件位置：`src/hooks/useResponsiveLayout.ts`

下面的组合函数用于监听窗口宽度并更新 Layout 状态。

```ts
import { onBeforeUnmount, onMounted } from 'vue'
import { useAppStore } from '@/stores/modules/app'

const MOBILE_WIDTH = 768
const COLLAPSE_WIDTH = 1200

export const useResponsiveLayout = () => {
  const appStore = useAppStore()

  const updateLayout = () => {
    const width = window.innerWidth
    const isMobile = width < MOBILE_WIDTH

    appStore.setMobile(isMobile)

    if (isMobile) {
      appStore.setSidebarCollapsed(true)
      appStore.closeMobileSidebar()
      return
    }

    if (width < COLLAPSE_WIDTH) {
      appStore.setSidebarCollapsed(true)
      return
    }

    appStore.setSidebarCollapsed(false)
  }

  onMounted(() => {
    updateLayout()
    window.addEventListener('resize', updateLayout)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', updateLayout)
  })
}
```

文件位置：`src/layouts/MainLayout.vue`

下面的主布局根据移动端状态切换固定侧边栏和抽屉侧边栏。

```vue
<template>
  <div class="main-layout">
    <AppSidebar
      v-if="!appStore.mobile"
      class="main-layout__sidebar"
    />

    <el-drawer
      v-model="appStore.mobileSidebarVisible"
      direction="ltr"
      size="220px"
      :with-header="false"
      class="main-layout__drawer"
    >
      <AppSidebar />
    </el-drawer>

    <section class="main-layout__container">
      <AppHeader />
      <AppBreadcrumb v-if="!appStore.mobile" />
      <AppTabs />
      <AppMain />
      <AppFooter v-if="!appStore.mobile" />
    </section>
  </div>
</template>

<script setup lang="ts">
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout'
import { useAppStore } from '@/stores/modules/app'
import AppHeader from './components/AppHeader.vue'
import AppSidebar from './components/AppSidebar.vue'
import AppBreadcrumb from './components/AppBreadcrumb.vue'
import AppTabs from './components/AppTabs.vue'
import AppMain from './components/AppMain.vue'
import AppFooter from './components/AppFooter.vue'

defineOptions({
  name: 'MainLayout'
})

const appStore = useAppStore()

useResponsiveLayout()
</script>

<style scoped lang="scss">
.main-layout {
  display: flex;
  width: 100%;
  min-height: 100vh;
  background: #f5f7fa;

  &__sidebar {
    flex-shrink: 0;
  }

  &__container {
    display: flex;
    flex: 1;
    min-width: 0;
    min-height: 100vh;
    flex-direction: column;
  }

  :deep(.main-layout__drawer .el-drawer__body) {
    padding: 0;
    background: #001529;
  }
}
</style>
```

移动端下，菜单点击后建议自动关闭抽屉，避免用户进入页面后菜单仍然遮挡内容区域。可以在 `AppMenu.vue` 的菜单选择事件中处理。

```ts
const handleSelect = () => {
  if (appStore.mobile) {
    appStore.closeMobileSidebar()
  }
}
```

### 内容区域滚动处理

内容区域滚动需要统一规划。后台系统中常见问题是页面整体滚动、内容区滚动、表格内部滚动混在一起，导致 Header、Sidebar、Tabs 无法固定，页面体验不稳定。

推荐布局滚动规则如下：

| 区域         | 滚动策略               |
| ------------ | ---------------------- |
| `body`       | 不滚动                 |
| `MainLayout` | 不滚动，只负责撑满屏幕 |
| `Sidebar`    | 内部菜单滚动           |
| `Header`     | 固定高度，不滚动       |
| `Tabs`       | 固定高度，不滚动       |
| `AppMain`    | 内容主滚动区域         |
| 页面内部表格 | 根据业务需要局部滚动   |

全局样式建议如下。

文件位置：`src/styles/global.scss`

```scss
html,
body,
#app {
  width: 100%;
  height: 100%;
  margin: 0;
  overflow: hidden;
}

* {
  box-sizing: border-box;
}
```

文件位置：`src/layouts/components/AppMain.vue`

下面的内容区域样式用于让主内容区成为唯一纵向滚动容器。

```vue
<template>
  <main class="app-main">
    <router-view v-slot="{ Component, route }">
      <component
        :is="Component"
        :key="route.name || route.fullPath"
      />
    </router-view>
  </main>
</template>

<script setup lang="ts">
defineOptions({
  name: 'AppMain'
})
</script>

<style scoped lang="scss">
.app-main {
  flex: 1;
  min-height: 0;
  padding: 16px;
  overflow: auto;
  background: #f5f7fa;
}
</style>
```

页面内部如果存在大表格，可以让页面容器继续使用 flex 布局，将表格区域设置为可伸缩区域。

文件位置：`src/views/system/user/index.vue`

下面的页面结构用于处理查询表单固定、表格区域自适应滚动的场景。

```vue
<template>
  <div class="user-page">
    <el-card class="user-page__search" shadow="never">
      查询表单区域
    </el-card>

    <el-card class="user-page__table" shadow="never">
      <el-table height="100%">
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="nickname" label="昵称" />
        <el-table-column prop="status" label="状态" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'SystemUser'
})
</script>

<style scoped lang="scss">
.user-page {
  display: flex;
  min-height: 100%;
  flex-direction: column;
  gap: 16px;

  &__search {
    flex-shrink: 0;
  }

  &__table {
    flex: 1;
    min-height: 0;

    :deep(.el-card__body) {
      height: 100%;
    }
  }
}
</style>
```

滚动设计的重点是避免多个父级同时滚动。推荐让浏览器窗口不滚动，只让 `AppMain` 或具体业务区域滚动，这样 Header、Sidebar、Tabs 可以稳定保持在页面框架内。

### 页面切换过渡

页面切换过渡用于提升路由切换时的视觉连续性。推荐在 `AppMain` 中统一处理页面过渡，而不是每个页面单独处理。常见过渡方式包括淡入淡出、轻微平移、缩放等。

文件位置：`src/layouts/components/AppMain.vue`

下面的内容区域组件统一处理页面切换动画和页面缓存。

```vue
<template>
  <main class="app-main">
    <router-view v-slot="{ Component, route }">
      <transition name="fade-slide" mode="out-in">
        <keep-alive :include="cachedViews">
          <component
            :is="Component"
            :key="route.name || route.fullPath"
          />
        </keep-alive>
      </transition>
    </router-view>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTabsStore } from '@/stores/modules/tabs'

defineOptions({
  name: 'AppMain'
})

const tabsStore = useTabsStore()

const cachedViews = computed(() => {
  return tabsStore.cachedViews
})
</script>

<style scoped lang="scss">
.app-main {
  flex: 1;
  min-height: 0;
  padding: 16px;
  overflow: auto;
  background: #f5f7fa;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(12px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-12px);
}
</style>
```

页面过渡需要注意以下问题：

| 问题                   | 处理建议                                             |
| ---------------------- | ---------------------------------------------------- |
| 页面切换闪烁           | 使用 `mode="out-in"` 控制先离开再进入                |
| 缓存页面动画异常       | 确保 `keep-alive` 包裹的是动态组件                   |
| 同一路由参数变化不刷新 | 合理设置 `:key`，详情页可使用 `route.fullPath`       |
| 列表页缓存被误销毁     | 使用 `route.name` 作为缓存 key，并维护 `cachedViews` |
| 动画影响性能           | 动画时间控制在 `0.2s` 左右，不使用复杂大范围动画     |

如果项目中页面表格较多、数据量较大，过渡动画应保持克制。推荐使用轻量的透明度和平移动画，不建议使用复杂缩放、旋转或大面积模糊效果。



## 实现步骤

本章节用于说明 Vue Router Layout 从目录创建到功能接入的实际落地流程。实现时建议按照“先布局、再路由、再菜单、再面包屑、最后权限”的顺序推进，避免一开始就把 Layout、权限、菜单、缓存全部耦合在一起，导致排查问题困难。

### 创建基础 Layout 组件

基础 Layout 组件是整个后台页面结构的入口。第一步应先创建主布局、登录布局、空白布局和异常布局，再根据主布局拆分 Header、Sidebar、Main、Footer 等子组件。

推荐先创建以下文件结构：

```text
src/layouts
├── MainLayout.vue
├── LoginLayout.vue
├── BlankLayout.vue
├── ExceptionLayout.vue
└── components
    ├── AppHeader.vue
    ├── AppSidebar.vue
    ├── AppMenu.vue
    ├── AppBreadcrumb.vue
    ├── AppTabs.vue
    ├── AppMain.vue
    └── AppFooter.vue
```

文件位置：`src/layouts/MainLayout.vue`

下面的组件用于搭建后台主布局的基本骨架，后续菜单、面包屑、标签页和内容区都挂在该布局中。

```vue
<template>
  <div class="main-layout">
    <AppSidebar class="main-layout__sidebar" />

    <section class="main-layout__container">
      <AppHeader />
      <AppBreadcrumb />
      <AppTabs />
      <AppMain />
      <AppFooter />
    </section>
  </div>
</template>

<script setup lang="ts">
import AppHeader from './components/AppHeader.vue'
import AppSidebar from './components/AppSidebar.vue'
import AppBreadcrumb from './components/AppBreadcrumb.vue'
import AppTabs from './components/AppTabs.vue'
import AppMain from './components/AppMain.vue'
import AppFooter from './components/AppFooter.vue'

defineOptions({
  name: 'MainLayout'
})
</script>

<style scoped lang="scss">
.main-layout {
  display: flex;
  width: 100%;
  min-height: 100vh;
  background: #f5f7fa;

  &__sidebar {
    flex-shrink: 0;
  }

  &__container {
    display: flex;
    flex: 1;
    min-width: 0;
    min-height: 100vh;
    flex-direction: column;
  }
}
</style>
```

文件位置：`src/layouts/components/AppMain.vue`

下面的内容区域组件用于承载业务页面，是 Layout 中最核心的路由出口。

```vue
<template>
  <main class="app-main">
    <router-view />
  </main>
</template>

<script setup lang="ts">
defineOptions({
  name: 'AppMain'
})
</script>

<style scoped lang="scss">
.app-main {
  flex: 1;
  min-height: 0;
  padding: 16px;
  overflow: auto;
  background: #f5f7fa;
}
</style>
```

文件位置：`src/layouts/LoginLayout.vue`

下面的登录布局用于承载登录页，不依赖后台主布局中的菜单、标签页和用户信息。

```vue
<template>
  <div class="login-layout">
    <router-view />
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'LoginLayout'
})
</script>

<style scoped lang="scss">
.login-layout {
  display: flex;
  width: 100%;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
}
</style>
```

文件位置：`src/layouts/BlankLayout.vue`

下面的空白布局用于重定向页、iframe 页面、打印页等特殊页面。

```vue
<template>
  <div class="blank-layout">
    <router-view />
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'BlankLayout'
})
</script>

<style scoped lang="scss">
.blank-layout {
  width: 100%;
  min-height: 100vh;
  background: #ffffff;
}
</style>
```

文件位置：`src/layouts/ExceptionLayout.vue`

下面的异常布局用于承载 403、404、500 等异常页面。

```vue
<template>
  <div class="exception-layout">
    <router-view />
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'ExceptionLayout'
})
</script>

<style scoped lang="scss">
.exception-layout {
  display: flex;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
}
</style>
```

基础 Layout 创建完成后，应先保证页面能正常渲染，再接入菜单、权限、缓存等复杂逻辑。这样可以明确问题边界，避免布局结构和路由权限问题混在一起。

### 配置嵌套路由

嵌套路由用于建立 Layout 与页面之间的父子关系。推荐一级路由绑定 Layout，子路由绑定具体页面组件。这样可以让同一组业务页面复用相同的页面骨架。

推荐创建以下路由文件：

```text
src/router
├── index.ts
├── routes.ts
└── modules
    ├── login.ts
    ├── dashboard.ts
    ├── system.ts
    ├── blank.ts
    └── exception.ts
```

文件位置：`src/router/modules/login.ts`

下面的路由配置用于注册登录页。

```ts
import type { RouteRecordRaw } from 'vue-router'

const loginRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    component: () => import('@/layouts/LoginLayout.vue'),
    meta: {
      hidden: true
    },
    children: [
      {
        path: '',
        name: 'Login',
        component: () => import('@/views/login/index.vue'),
        meta: {
          title: '登录',
          hidden: true,
          requiresAuth: false
        }
      }
    ]
  }
]

export default loginRoutes
```

文件位置：`src/router/modules/dashboard.ts`

下面的路由配置用于注册后台首页，并绑定后台主布局。

```ts
import type { RouteRecordRaw } from 'vue-router'

const dashboardRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    redirect: '/dashboard',
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: {
          title: '首页',
          icon: 'HomeFilled',
          requiresAuth: true,
          keepAlive: true,
          affix: true
        }
      }
    ]
  }
]

export default dashboardRoutes
```

文件位置：`src/router/modules/system.ts`

下面的路由配置用于注册系统管理模块，并通过子路由绑定具体页面。

```ts
import type { RouteRecordRaw } from 'vue-router'

const systemRoutes: RouteRecordRaw[] = [
  {
    path: '/system',
    component: () => import('@/layouts/MainLayout.vue'),
    redirect: '/system/user',
    meta: {
      title: '系统管理',
      icon: 'Setting',
      requiresAuth: true,
      permission: 'system'
    },
    children: [
      {
        path: 'user',
        name: 'SystemUser',
        component: () => import('@/views/system/user/index.vue'),
        meta: {
          title: '用户管理',
          icon: 'User',
          requiresAuth: true,
          permission: 'system:user:list',
          keepAlive: true
        }
      },
      {
        path: 'role',
        name: 'SystemRole',
        component: () => import('@/views/system/role/index.vue'),
        meta: {
          title: '角色管理',
          icon: 'Avatar',
          requiresAuth: true,
          permission: 'system:role:list',
          keepAlive: true
        }
      }
    ]
  }
]

export default systemRoutes
```

文件位置：`src/router/routes.ts`

下面的文件用于汇总静态路由和动态路由。

```ts
import type { RouteRecordRaw } from 'vue-router'
import loginRoutes from './modules/login'
import dashboardRoutes from './modules/dashboard'
import blankRoutes from './modules/blank'
import exceptionRoutes from './modules/exception'
import systemRoutes from './modules/system'

export const constantRoutes: RouteRecordRaw[] = [
  ...loginRoutes,
  ...dashboardRoutes,
  ...blankRoutes,
  ...exceptionRoutes
]

export const asyncRoutes: RouteRecordRaw[] = [
  ...systemRoutes
]
```

文件位置：`src/router/index.ts`

下面的文件用于创建 Vue Router 实例。

```ts
import { createRouter, createWebHistory } from 'vue-router'
import { constantRoutes } from './routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: constantRoutes,
  scrollBehavior() {
    return {
      top: 0,
      left: 0
    }
  }
})

export default router
```

嵌套路由配置完成后，应先访问 `/login`、`/dashboard`、`/system/user` 等路径，确认不同页面能正确进入对应 Layout。

### 接入菜单组件

菜单组件用于展示当前用户可访问的路由入口。推荐菜单数据从路由配置生成，而不是额外维护一份完全独立的菜单配置。这样可以减少菜单标题、路由路径、权限标识不一致的问题。

文件位置：`src/router/menu.ts`

下面的工具方法用于将路由转换成菜单数据，并自动过滤 `meta.hidden` 的路由。

```ts
import type { RouteRecordRaw } from 'vue-router'

export interface MenuItem {
  path: string
  name?: string
  title: string
  icon?: string
  children?: MenuItem[]
}

const resolveRoutePath = (parentPath: string, routePath: string) => {
  if (routePath.startsWith('/')) {
    return routePath
  }

  return `${parentPath}/${routePath}`.replace(/\/+/g, '/')
}

export const generateMenusByRoutes = (
  routes: RouteRecordRaw[],
  parentPath = ''
): MenuItem[] => {
  return routes
    .filter((route) => !route.meta?.hidden)
    .map((route) => {
      const fullPath = resolveRoutePath(parentPath, route.path)

      const children = route.children?.length
        ? generateMenusByRoutes(route.children, fullPath)
        : []

      return {
        path: fullPath,
        name: route.name?.toString(),
        title: route.meta?.title?.toString() || '',
        icon: route.meta?.icon?.toString(),
        children
      }
    })
    .filter((item) => item.title)
}
```

文件位置：`src/stores/modules/permission.ts`

下面的 Store 用于维护菜单数据。前期可以直接基于本地路由生成菜单，后期再接入接口权限过滤。

```ts
import { defineStore } from 'pinia'
import type { RouteRecordRaw } from 'vue-router'
import { asyncRoutes } from '@/router/routes'
import { generateMenusByRoutes, type MenuItem } from '@/router/menu'

interface PermissionState {
  routes: RouteRecordRaw[]
  menus: MenuItem[]
}

export const usePermissionStore = defineStore('permission', {
  state: (): PermissionState => ({
    routes: [],
    menus: []
  }),

  actions: {
    buildMenus() {
      this.routes = asyncRoutes
      this.menus = generateMenusByRoutes(asyncRoutes)
    }
  }
})
```

文件位置：`src/layouts/components/AppMenu.vue`

下面的组件用于渲染侧边栏菜单，并根据当前路由处理选中状态。

```vue
<template>
  <el-scrollbar class="app-menu">
    <el-menu
      :default-active="activeMenu"
      router
      background-color="#001529"
      text-color="#bfcbd9"
      active-text-color="#409eff"
    >
      <template v-for="item in menus" :key="item.path">
        <el-sub-menu v-if="item.children?.length" :index="item.path">
          <template #title>
            <span>{{ item.title }}</span>
          </template>

          <el-menu-item
            v-for="child in item.children"
            :key="child.path"
            :index="child.path"
          >
            {{ child.title }}
          </el-menu-item>
        </el-sub-menu>

        <el-menu-item v-else :index="item.path">
          {{ item.title }}
        </el-menu-item>
      </template>
    </el-menu>
  </el-scrollbar>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { usePermissionStore } from '@/stores/modules/permission'

const route = useRoute()
const permissionStore = usePermissionStore()

const menus = computed(() => permissionStore.menus)

const activeMenu = computed(() => {
  return route.meta.activeMenu?.toString() || route.path
})

onMounted(() => {
  if (!permissionStore.menus.length) {
    permissionStore.buildMenus()
  }
})
</script>

<style scoped lang="scss">
.app-menu {
  height: calc(100vh - 56px);

  :deep(.el-menu) {
    border-right: none;
  }
}
</style>
```

文件位置：`src/layouts/components/AppSidebar.vue`

下面的侧边栏组件用于承载菜单组件。

```vue
<template>
  <aside class="app-sidebar">
    <div class="app-sidebar__logo">
      Admin
    </div>

    <AppMenu />
  </aside>
</template>

<script setup lang="ts">
import AppMenu from './AppMenu.vue'

defineOptions({
  name: 'AppSidebar'
})
</script>

<style scoped lang="scss">
.app-sidebar {
  width: 220px;
  height: 100vh;
  overflow: hidden;
  background: #001529;

  &__logo {
    display: flex;
    height: 56px;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    font-size: 18px;
    font-weight: 600;
    border-bottom: 1px solid rgb(255 255 255 / 10%);
  }
}
</style>
```

菜单接入完成后，应检查菜单是否能正确跳转、刷新后是否能保持选中状态、隐藏路由是否不会出现在菜单中。

### 接入面包屑组件

面包屑组件用于展示当前页面在路由层级中的位置。推荐基于 `route.matched` 自动生成，不建议在每个页面手动维护面包屑。

文件位置：`src/layouts/components/AppBreadcrumb.vue`

下面的组件用于根据当前路由匹配记录生成面包屑。

```vue
<template>
  <div class="app-breadcrumb">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item
        v-for="(item, index) in breadcrumbs"
        :key="item.path"
      >
        <span
          v-if="index === breadcrumbs.length - 1"
          class="app-breadcrumb__current"
        >
          {{ item.title }}
        </span>

        <a
          v-else
          href="javascript:void(0)"
          @click="handleClick(item)"
        >
          {{ item.title }}
        </a>
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

interface BreadcrumbItem {
  path: string
  title: string
  redirect?: string
}

const route = useRoute()
const router = useRouter()

const breadcrumbs = computed<BreadcrumbItem[]>(() => {
  return route.matched
    .filter((item) => item.meta?.title && item.meta?.breadcrumb !== false)
    .map((item) => ({
      path: item.path,
      title: item.meta.title?.toString() || '',
      redirect: typeof item.redirect === 'string' ? item.redirect : undefined
    }))
})

const handleClick = async (item: BreadcrumbItem) => {
  await router.push(item.redirect || item.path)
}
</script>

<style scoped lang="scss">
.app-breadcrumb {
  display: flex;
  height: 40px;
  align-items: center;
  padding: 0 16px;
  background: #ffffff;
  border-bottom: 1px solid #ebeef5;

  &__current {
    color: #909399;
  }
}
</style>
```

路由配置中需要为参与面包屑展示的路由配置 `meta.title`。

```ts
{
  path: '/system',
  component: () => import('@/layouts/MainLayout.vue'),
  redirect: '/system/user',
  meta: {
    title: '系统管理',
    icon: 'Setting',
    breadcrumb: true
  },
  children: [
    {
      path: 'user',
      name: 'SystemUser',
      component: () => import('@/views/system/user/index.vue'),
      meta: {
        title: '用户管理',
        icon: 'User',
        breadcrumb: true
      }
    }
  ]
}
```

如果某个中间路由不希望展示在面包屑中，可以设置 `meta.breadcrumb = false`。如果详情页需要展示更复杂的层级，可以后续扩展 `meta.breadcrumbItems` 字段。

### 接入权限控制

权限控制用于处理用户登录状态、菜单过滤和页面访问限制。推荐先实现最小可用的路由守卫：未登录跳转登录页，已登录加载动态路由，无权限访问跳转 403 页面。

文件位置：`src/stores/modules/user.ts`

下面的 Store 用于维护用户登录状态、角色和权限标识。

```ts
import { defineStore } from 'pinia'

interface UserState {
  token: string
  nickname: string
  roles: string[]
  permissions: string[]
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    token: '',
    nickname: '',
    roles: [],
    permissions: []
  }),

  actions: {
    setToken(token: string) {
      this.token = token
    },

    setUserInfo(data: Partial<UserState>) {
      this.nickname = data.nickname || ''
      this.roles = data.roles || []
      this.permissions = data.permissions || []
    },

    logout() {
      this.token = ''
      this.nickname = ''
      this.roles = []
      this.permissions = []
    }
  }
})
```

文件位置：`src/router/permission.ts`

下面的工具方法用于根据用户权限过滤路由。

```ts
import type { RouteRecordRaw } from 'vue-router'

export const hasRoutePermission = (
  route: RouteRecordRaw,
  permissions: string[],
  roles: string[]
) => {
  const routePermission = route.meta?.permission
  const routeRoles = route.meta?.roles

  if (routeRoles?.length) {
    return routeRoles.some((role) => roles.includes(role))
  }

  if (routePermission) {
    return permissions.includes(routePermission.toString())
  }

  return true
}

export const filterRoutesByPermissions = (
  routes: RouteRecordRaw[],
  permissions: string[],
  roles: string[]
): RouteRecordRaw[] => {
  return routes
    .filter((route) => hasRoutePermission(route, permissions, roles))
    .map((route) => ({
      ...route,
      children: route.children
        ? filterRoutesByPermissions(route.children, permissions, roles)
        : undefined
    }))
}
```

文件位置：`src/stores/modules/permission.ts`

下面的 Store 用于根据用户权限生成可访问路由和菜单。

```ts
import { defineStore } from 'pinia'
import type { RouteRecordRaw } from 'vue-router'
import { asyncRoutes } from '@/router/routes'
import { filterRoutesByPermissions } from '@/router/permission'
import { generateMenusByRoutes, type MenuItem } from '@/router/menu'

interface PermissionState {
  routes: RouteRecordRaw[]
  menus: MenuItem[]
  isRoutesLoaded: boolean
}

export const usePermissionStore = defineStore('permission', {
  state: (): PermissionState => ({
    routes: [],
    menus: [],
    isRoutesLoaded: false
  }),

  actions: {
    generateRoutes(permissions: string[], roles: string[]) {
      const accessedRoutes = filterRoutesByPermissions(asyncRoutes, permissions, roles)

      this.routes = accessedRoutes
      this.menus = generateMenusByRoutes(accessedRoutes)
      this.isRoutesLoaded = true

      return accessedRoutes
    },

    resetRoutes() {
      this.routes = []
      this.menus = []
      this.isRoutesLoaded = false
    }
  }
})
```

文件位置：`src/router/guard.ts`

下面的路由守卫用于处理登录校验、动态路由注册和无权限访问控制。

```ts
import type { Router } from 'vue-router'
import { useUserStore } from '@/stores/modules/user'
import { usePermissionStore } from '@/stores/modules/permission'

const whiteList = ['/login', '/exception/403', '/exception/404', '/exception/500']

export const setupRouterGuard = (router: Router) => {
  router.beforeEach(async (to) => {
    const userStore = useUserStore()
    const permissionStore = usePermissionStore()

    if (whiteList.includes(to.path)) {
      return true
    }

    if (!userStore.token) {
      return {
        path: '/login',
        query: {
          redirect: to.fullPath
        }
      }
    }

    if (!permissionStore.isRoutesLoaded) {
      const accessedRoutes = permissionStore.generateRoutes(
        userStore.permissions,
        userStore.roles
      )

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

文件位置：`src/router/index.ts`

下面的代码用于注册路由守卫。

```ts
import { createRouter, createWebHistory } from 'vue-router'
import { constantRoutes } from './routes'
import { setupRouterGuard } from './guard'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: constantRoutes,
  scrollBehavior() {
    return {
      top: 0,
      left: 0
    }
  }
})

setupRouterGuard(router)

export default router
```

权限接入完成后，需要重点验证三类场景：未登录访问后台页面、已登录访问有权限页面、已登录访问无权限页面。前端权限控制只负责页面体验和入口控制，后端接口仍然必须做权限校验。

## 验证与测试

本章节用于说明 Layout、路由、菜单和权限接入后的验证方式。验证时建议按照“路由是否能访问、菜单是否联动、权限是否生效、多布局是否正确切换”的顺序进行。

### 路由跳转验证

路由跳转验证用于确认 Vue Router 的基础配置是否正确，包括一级路由、子路由、重定向、异常路由和刷新访问。

推荐验证以下路径：

| 验证路径       | 预期结果                           |
| -------------- | ---------------------------------- |
| `/login`       | 进入登录页布局，不显示后台菜单     |
| `/`            | 自动重定向到 `/dashboard`          |
| `/dashboard`   | 进入后台主布局，并显示首页         |
| `/system`      | 自动重定向到 `/system/user`        |
| `/system/user` | 进入后台主布局，并显示用户管理页面 |
| `/system/role` | 进入后台主布局，并显示角色管理页面 |
| `/unknown`     | 进入 404 异常页面                  |

可以在浏览器地址栏直接输入路径验证，也可以通过菜单点击验证。直接输入路径可以验证刷新场景，菜单点击可以验证前端跳转场景。

推荐检查项如下：

| 检查项          | 判断标准                             |
| --------------- | ------------------------------------ |
| 页面是否白屏    | 控制台无组件导入错误、路由匹配错误   |
| Layout 是否正确 | 登录页不显示主布局，后台页显示主布局 |
| 子页面是否渲染  | `router-view` 能正常显示业务页面     |
| 重定向是否生效  | `/`、`/system` 能进入默认页面        |
| 404 是否兜底    | 未匹配路径能进入异常页               |
| 刷新是否正常    | 直接刷新当前页面不丢失路由           |

如果部署到 Nginx 且使用 `createWebHistory`，需要配置前端路由回退，否则刷新子路径可能出现 404。

Nginx 配置示例如下：

```nginx
server {
    listen 80;
    server_name example.com;

    root /usr/share/nginx/html;
    index index.html;

    location / {
        # Vue Router history 模式需要回退到 index.html
        try_files $uri $uri/ /index.html;
    }
}
```

该配置用于让 `/system/user` 这类前端路由在刷新时仍然返回 `index.html`，再由 Vue Router 接管页面匹配。

### 菜单联动验证

菜单联动验证用于确认菜单生成、菜单跳转、菜单选中和菜单展开状态是否正确。菜单应始终以当前路由为准，而不是以点击事件内部状态为准。

推荐验证以下场景：

| 操作                | 预期结果                       |
| ------------------- | ------------------------------ |
| 访问 `/dashboard`   | 首页菜单高亮                   |
| 访问 `/system/user` | 系统管理展开，用户管理高亮     |
| 访问 `/system/role` | 系统管理展开，角色管理高亮     |
| 点击用户管理菜单    | 跳转到 `/system/user`          |
| 刷新 `/system/user` | 菜单仍然保持用户管理高亮       |
| 访问隐藏详情页      | 菜单仍然高亮对应列表页         |
| 折叠侧边栏          | 菜单数据不丢失，只改变展示方式 |

对于隐藏详情页，需要重点验证 `activeMenu` 是否生效。

路由配置示例如下：

```ts
{
  path: 'user/detail/:id',
  name: 'SystemUserDetail',
  component: () => import('@/views/system/user/detail.vue'),
  meta: {
    title: '用户详情',
    hidden: true,
    activeMenu: '/system/user',
    permission: 'system:user:detail'
  }
}
```

访问 `/system/user/detail/1` 时，菜单预期表现如下：

```text
当前路径：/system/user/detail/1
菜单高亮：/system/user
菜单显示：不出现“用户详情”菜单项
```

如果菜单不高亮，优先检查以下内容：

| 问题                          | 排查方式                                  |
| ----------------------------- | ----------------------------------------- |
| 菜单 `index` 和路由路径不一致 | 确认 `el-menu-item` 的 `index` 是完整路径 |
| `activeMenu` 未配置           | 隐藏详情页补充 `meta.activeMenu`          |
| 路由路径拼接错误              | 检查父子路径拼接函数                      |
| 菜单数据未加载                | 检查权限 Store 是否已生成 menus           |
| 菜单被 `hidden` 过滤          | 检查父级或子级路由的 `meta.hidden`        |

菜单联动的核心标准是：无论页面通过菜单点击、标签页切换、浏览器刷新还是地址栏访问进入，菜单状态都应由当前路由自动推导出来。

### 权限控制验证

权限控制验证用于确认不同用户只能访问自己有权限的页面和菜单。验证时需要准备至少两个账号或两组模拟权限，例如管理员账号和普通用户账号。

推荐权限数据如下：

```ts
const adminPermissions = [
  'system',
  'system:user:list',
  'system:user:detail',
  'system:role:list'
]

const normalPermissions = [
  'system',
  'system:user:list'
]
```

推荐验证场景如下：

| 用户类型   | 权限                                   | 预期菜单                                |
| ---------- | -------------------------------------- | --------------------------------------- |
| 管理员     | `system:user:list`、`system:role:list` | 显示用户管理、角色管理                  |
| 普通用户   | `system:user:list`                     | 只显示用户管理                          |
| 未登录用户 | 无 token                               | 访问后台页面跳转登录页                  |
| 无权限用户 | 无对应 permission                      | 不显示菜单，访问页面跳转 403 或无法匹配 |

未登录访问验证：

```text
操作：清空 token 后访问 /system/user
预期：跳转到 /login?redirect=/system/user
```

普通用户菜单验证：

```text
权限：system:user:list
访问：/system/user
预期：可访问用户管理

访问：/system/role
预期：无权限访问，跳转 403 或页面不存在
```

管理员菜单验证：

```text
权限：system:user:list、system:role:list
访问：/system/user
预期：可访问用户管理

访问：/system/role
预期：可访问角色管理
```

如果权限控制不生效，优先检查以下内容：

| 问题                   | 排查方式                                          |
| ---------------------- | ------------------------------------------------- |
| 权限标识不一致         | 检查用户权限数组和 `meta.permission` 是否完全一致 |
| 动态路由未注册         | 检查 `router.addRoute` 是否执行                   |
| 刷新后路由丢失         | 检查是否在守卫中重新加载动态路由                  |
| 菜单显示但页面不可访问 | 检查菜单过滤和路由过滤是否使用同一套权限逻辑      |
| 页面可访问但菜单不显示 | 检查 `meta.hidden` 和菜单生成逻辑                 |
| 403 未生效             | 检查路由守卫是否包含无权限判断                    |

权限验证时还需要检查退出登录流程。退出登录后，应清空 token、用户信息、权限路由、菜单数据和标签页缓存，避免下一个用户登录后看到上一个用户的页面状态。

### 多 Layout 切换验证

多 Layout 切换验证用于确认不同页面是否进入了正确的布局容器。重点验证登录布局、后台主布局、空白布局和异常布局之间是否相互独立。

推荐验证场景如下：

| 路径                          | 预期 Layout       | 预期表现                         |
| ----------------------------- | ----------------- | -------------------------------- |
| `/login`                      | `LoginLayout`     | 不显示菜单、顶部栏、标签页       |
| `/dashboard`                  | `MainLayout`      | 显示完整后台主框架               |
| `/system/user`                | `MainLayout`      | 显示菜单、面包屑、标签页和内容区 |
| `/blank/redirect/system/user` | `BlankLayout`     | 不显示菜单和顶部栏               |
| `/exception/403`              | `ExceptionLayout` | 显示异常页容器                   |
| `/exception/404`              | `ExceptionLayout` | 显示 404 页面                    |
| `/unknown`                    | `ExceptionLayout` | 进入 404 页面                    |

验证时可以通过 Vue DevTools 查看当前渲染的组件树，确认页面是否位于预期 Layout 下。

正常后台页面组件树应类似如下：

```text
App
└── RouterView
    └── MainLayout
        ├── AppSidebar
        ├── AppHeader
        ├── AppBreadcrumb
        ├── AppTabs
        ├── AppMain
        │   └── SystemUser
        └── AppFooter
```

登录页组件树应类似如下：

```text
App
└── RouterView
    └── LoginLayout
        └── Login
```

异常页组件树应类似如下：

```text
App
└── RouterView
    └── ExceptionLayout
        └── NotFound
```

如果多 Layout 切换异常，优先检查以下内容：

| 问题                     | 排查方式                                  |
| ------------------------ | ----------------------------------------- |
| 登录页显示了后台菜单     | 检查 `/login` 是否错误绑定到 `MainLayout` |
| 后台页面不显示菜单       | 检查业务路由是否没有挂到 `MainLayout` 下  |
| 空白页出现 Header        | 检查空白页是否误用了 `MainLayout`         |
| 404 页面没有进入异常布局 | 检查通配符路由是否指向 `/exception/404`   |
| 页面刷新后布局错误       | 检查动态路由加载时机和重定向配置          |
| 路由匹配不到组件         | 检查组件路径、文件名大小写和别名 `@` 配置 |

最终验收标准是：不同页面场景有明确 Layout，Layout 之间互不依赖；业务页面只负责内容，公共结构只由 Layout 负责；路由、菜单、权限、面包屑和缓存都可以基于同一套路由配置稳定联动。