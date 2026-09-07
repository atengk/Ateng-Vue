# Vue3 Component 组件

## 组件开发概述

Vue3 组件是前端项目中承载页面结构、交互逻辑、状态变化和业务展示的基础单元。组件开发的核心目标不是简单拆分页面，而是通过清晰的职责边界、稳定的输入输出、可复用的逻辑抽象和统一的代码规范，提升项目的可维护性、可扩展性和协作效率。

在 Vue3 项目中，组件通常优先使用组合式 API 与 `<script setup>` 编写。相比传统选项式 API，组合式 API 更适合复杂业务逻辑拆分、状态复用、类型推导和大型项目维护，尤其适合后台管理系统、中台系统、业务组件库和长期迭代的前端工程。

### 组件定位

组件定位用于明确当前组件在项目中的职责、边界和复用层级。一个组件在设计前应先判断它是基础组件、业务组件、页面组件，还是仅服务于某个页面的局部组件。

基础组件通常不直接绑定具体业务，例如按钮、输入框、弹窗、表格包装组件等，重点关注通用能力、参数稳定性和样式一致性。业务组件通常承载具体业务语义，例如用户选择器、部门树、订单状态标签、权限配置面板等，重点关注业务规则封装和接口适配。页面组件则用于组织页面整体结构、路由入口、数据加载和多个子组件之间的协作。

组件定位应遵循以下原则：

| 组件类型     | 定位说明                             | 示例                                            |
| ------------ | ------------------------------------ | ----------------------------------------------- |
| 基础展示组件 | 只负责展示，不直接处理复杂业务       | `StatusTag.vue`、`EmptyView.vue`                |
| 表单输入组件 | 封装输入、校验、格式化和回显逻辑     | `UserSelect.vue`、`DateRangePicker.vue`         |
| 业务组件     | 封装稳定业务能力，可在多个页面复用   | `RolePermissionTree.vue`、`OrderDetailCard.vue` |
| 页面局部组件 | 只服务于当前页面，降低页面文件复杂度 | `SearchPanel.vue`、`TableToolbar.vue`           |
| 页面组件     | 作为路由页面入口，负责页面级数据组织 | `UserList.vue`、`OrderManage.vue`               |

组件开发前应优先回答三个问题：这个组件解决什么问题，是否会被复用，它应该暴露哪些稳定能力。不能明确回答这些问题的组件，通常不适合过早抽象，应先作为页面局部组件存在。

### 适用场景

Vue3 组件适用于需要拆分页面结构、复用交互逻辑、隔离业务复杂度或统一展示规范的场景。组件不是越多越好，只有当拆分能够降低理解成本、复用成本或维护成本时，才应该进行组件化设计。

常见适用场景包括：

| 场景            | 说明                                                 | 处理方式                   |
| --------------- | ---------------------------------------------------- | -------------------------- |
| 页面结构复杂    | 单个页面包含搜索区、操作区、表格区、弹窗区等多个区域 | 拆分为局部组件             |
| 逻辑重复出现    | 多个页面存在相同筛选、选择、展示或交互逻辑           | 抽取为业务组件或组合式函数 |
| UI 风格需要统一 | 多处使用相同状态标签、空状态、弹窗布局               | 抽取为基础展示组件         |
| 表单逻辑复杂    | 表单包含联动、校验、回显、远程搜索                   | 抽取为表单组件             |
| 业务规则稳定    | 某类业务能力长期存在并被多个模块使用                 | 抽取为业务组件             |
| 状态需要隔离    | 某块功能有独立状态、加载、错误和重置逻辑             | 使用组件或 composable 隔离 |

不建议组件化的场景包括：只使用一次且逻辑极少的简单结构、为了减少行数而强行拆分的模板片段、职责不清且依赖大量外部状态的组件、内部逻辑频繁跟随单一页面变化的临时模块。

判断是否需要抽取组件，可以使用以下标准：当某段模板或逻辑在两个以上场景出现，或者单个页面文件已经明显影响阅读和维护时，就可以考虑组件化；当组件需要暴露大量临时参数才能适配不同页面时，说明抽象边界可能不合理。

### 组合式 API 优先原则

Vue3 项目中应优先使用组合式 API，推荐配合 `<script setup lang="ts">` 编写组件。组合式 API 可以按照功能维度组织代码，将同一业务逻辑相关的状态、计算属性、方法、监听器和生命周期放在一起，避免选项式 API 中数据、方法、监听器分散在不同配置项中的问题。

组合式 API 优先适用于以下情况：

| 使用场景                 | 推荐方式                                                   |
| ------------------------ | ---------------------------------------------------------- |
| 新增 Vue3 组件           | 默认使用 `<script setup>`                                  |
| 复杂页面逻辑             | 使用 `ref`、`reactive`、`computed`、`watch` 按业务模块组织 |
| 公共逻辑复用             | 抽取为 `useXxx` composable                                 |
| 需要 TypeScript 类型推导 | 使用 `defineProps`、`defineEmits`、接口类型                |
| 需要状态管理接入         | 在组合式函数或组件中接入 Pinia store                       |
| 需要生命周期处理         | 使用 `onMounted`、`onBeforeUnmount` 等组合式生命周期函数   |

推荐的组件组织顺序为：类型定义、Props、Emits、状态定义、计算属性、监听器、业务方法、生命周期。这样可以让组件逻辑从输入、状态、派生数据、行为到生命周期逐步展开，便于阅读和维护。

示例组件用于展示 `<script setup>` 下 Props、Emits、计算属性和事件触发的基础组织方式。

文件位置：`src/components/user/UserCard.vue`

```vue
<template>
  <div class="rounded-lg border p-4 shadow-sm">
    <div class="text-base font-medium">
      {{ displayName }}
    </div>

    <div class="mt-1 text-sm text-gray-500">
      {{ user.email || '暂无邮箱' }}
    </div>

    <button
      class="mt-3 rounded bg-blue-500 px-3 py-1 text-sm text-white"
      type="button"
      @click="handleEdit"
    >
      编辑用户
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface UserInfo {
  id: number
  name: string
  email?: string
}

const props = defineProps<{
  user: UserInfo
}>()

const emit = defineEmits<{
  edit: [user: UserInfo]
}>()

const displayName = computed(() => {
  return props.user.name || `用户-${props.user.id}`
})

const handleEdit = () => {
  emit('edit', props.user)
}
</script>
```

在实际项目中，组合式 API 不应只被理解为语法替换，而应该用于改善逻辑组织。对于复杂组件，应将可复用逻辑抽取到 `composables` 中，而不是把所有代码都堆放在一个 `.vue` 文件内。

示例组合式函数用于封装列表加载状态、异常处理和刷新逻辑，组件中只关注调用和展示。

文件位置：`src/composables/useUserList.ts`

```typescript
import { ref } from 'vue'

interface UserInfo {
  id: number
  name: string
  email?: string
}

export function useUserList() {
  const loading = ref(false)
  const userList = ref<UserInfo[]>([])

  const loadUserList = async () => {
    loading.value = true

    try {
      // 实际项目中这里替换为 API 请求
      userList.value = [
        { id: 1, name: '张三', email: 'zhangsan@example.com' },
        { id: 2, name: '李四' }
      ]
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    userList,
    loadUserList
  }
}
```

组合式 API 的使用应遵循以下约束：组件内部状态优先使用 `ref` 和 `reactive` 明确表达；派生数据使用 `computed`，避免在模板中堆放复杂表达式；副作用逻辑使用 `watch` 或生命周期函数集中处理；可复用逻辑必须抽取为 `useXxx` 命名的组合式函数；不要滥用全局状态，只有跨页面、跨模块共享的数据才接入 Pinia。

总体原则是：组件负责展示和交互，组合式函数负责复用逻辑，Pinia 负责跨组件共享状态，API 模块负责请求封装。这样可以避免组件膨胀，也能保持 Vue3 项目在长期迭代中的结构稳定性。



## 组件设计规范

组件设计规范用于统一组件的拆分方式、命名方式、目录组织、输入输出和扩展能力。规范的目标不是限制开发，而是让不同开发人员编写的组件在项目中保持一致的阅读方式、调用方式和维护方式。

### 组件职责划分

组件职责划分用于明确一个组件应该处理什么，不应该处理什么。Vue3 组件应尽量保持职责单一，避免一个组件同时承担页面布局、数据请求、表单校验、业务计算、权限控制和复杂交互等多种职责。

推荐按照以下层级划分组件：

| 组件类型   | 主要职责                                               | 不建议包含的内容           |
| ---------- | ------------------------------------------------------ | -------------------------- |
| 页面组件   | 路由入口、页面级数据组织、模块编排                     | 复杂 UI 细节、重复业务逻辑 |
| 业务组件   | 封装稳定业务能力，例如用户选择、权限配置、订单状态展示 | 页面路由逻辑、全局状态滥用 |
| 基础组件   | 封装通用 UI 能力，例如按钮、弹窗、标签、空状态         | 具体业务接口、业务状态判断 |
| 局部组件   | 拆分当前页面内部结构，降低页面复杂度                   | 跨模块复用逻辑             |
| Composable | 抽取可复用状态、请求、监听、计算逻辑                   | 模板结构和 UI 样式         |

组件职责应遵循“页面负责组织，组件负责封装，Composable 负责复用逻辑”的原则。页面组件可以调用接口、组织状态并传递参数；业务组件负责处理某一类稳定业务场景；基础组件只关注通用展示和交互；重复逻辑应优先抽取到 `composables` 中。

不推荐将以下内容全部写入同一个组件：接口请求、表格渲染、弹窗表单、权限判断、字段转换、事件总线监听、路由跳转和全局状态修改。此类组件后期通常难以测试、难以复用，也容易在需求变更时产生连锁影响。

### 组件命名规范

组件命名规范用于提升组件的可读性和可检索性。组件名称应表达业务含义或功能含义，避免使用过于宽泛的名称，例如 `List.vue`、`Form.vue`、`Dialog.vue`。

组件文件推荐使用 PascalCase 命名，组合式函数推荐使用 camelCase 且以 `use` 开头。

| 类型       | 命名规则               | 示例                                       |
| ---------- | ---------------------- | ------------------------------------------ |
| 页面组件   | 业务模块 + 页面含义    | `UserList.vue`、`OrderManage.vue`          |
| 基础组件   | 通用能力 + 组件类型    | `BaseDialog.vue`、`BaseTable.vue`          |
| 业务组件   | 业务对象 + 功能含义    | `UserSelect.vue`、`RolePermissionTree.vue` |
| 局部组件   | 页面区域 + 功能含义    | `SearchPanel.vue`、`TableToolbar.vue`      |
| Composable | `use` + 业务或功能名称 | `useUserList.ts`、`useTableQuery.ts`       |

命名时应避免使用无业务含义的缩写。对于业务组件，应优先体现业务对象，例如 `UserSelect` 比 `SelectUser` 更符合组件语义；对于弹窗组件，推荐使用业务对象加动作，例如 `UserEditDialog.vue`、`RoleAuthDialog.vue`。

组件在模板中使用时，推荐保持 PascalCase 风格：

```vue
<template>
  <UserSelect v-model="form.userId" />
  <RolePermissionTree :role-id="roleId" />
</template>
```

这种写法可以明显区分原生 HTML 标签和 Vue 组件，适合中大型 Vue3 项目统一使用。

### 目录结构规范

目录结构规范用于约束组件、页面、组合式函数、接口模块和状态模块的放置位置。目录结构应按照“通用能力”和“业务模块”分层，避免所有组件都堆放到同一个 `components` 目录下。

推荐目录结构如下：

```text
src
├── api
│   └── user
│       └── index.ts
├── components
│   ├── base
│   │   ├── BaseDialog.vue
│   │   └── BaseTable.vue
│   └── business
│       └── UserSelect.vue
├── composables
│   ├── useTableQuery.ts
│   └── useUserList.ts
├── stores
│   └── user.ts
├── views
│   └── user
│       ├── UserList.vue
│       └── components
│           ├── SearchPanel.vue
│           ├── UserEditDialog.vue
│           └── TableToolbar.vue
└── types
    └── user.ts
```

通用基础组件放在 `src/components/base`，跨页面复用的业务组件放在 `src/components/business`，只服务于某个页面的局部组件放在当前页面目录下的 `components` 中。接口类型、业务类型和请求参数类型可以放在 `src/types` 或模块内部的 `types.ts` 中，具体取决于项目规模。

页面局部组件不应直接放入全局 `components` 目录，否则会造成组件复用边界模糊。只有当局部组件被多个页面稳定复用时，才考虑提升到全局业务组件目录。

### Props 设计规范

Props 是组件的输入边界，应保持清晰、稳定、类型明确。组件不应依赖父组件的内部状态，而应通过 Props 接收必要数据，并通过 Emits 向外反馈用户行为或状态变化。

Props 设计应遵循以下原则：

| 原则         | 说明                                              |
| ------------ | ------------------------------------------------- |
| 类型明确     | 使用 TypeScript 接口定义 Props 类型               |
| 命名具体     | 避免 `data`、`info`、`options` 这类过于宽泛的名称 |
| 默认值清晰   | 可选值应使用 `withDefaults` 设置默认值            |
| 避免直接修改 | Props 只读，组件内部不应直接修改                  |
| 控制参数数量 | 参数过多时应考虑对象化或重新拆分组件              |

示例展示 Props 的推荐定义方式，适合表格、卡片、选择器等组件使用。

文件位置：`src/components/business/UserSelect.vue`

```vue
<template>
  <el-select
    :model-value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    filterable
    clearable
    @update:model-value="handleChange"
  >
    <el-option
      v-for="item in userOptions"
      :key="item.id"
      :label="item.name"
      :value="item.id"
    />
  </el-select>
</template>

<script setup lang="ts">
interface UserOption {
  id: number
  name: string
}

const props = withDefaults(
  defineProps<{
    modelValue?: number | null
    userOptions: UserOption[]
    placeholder?: string
    disabled?: boolean
  }>(),
  {
    modelValue: null,
    placeholder: '请选择用户',
    disabled: false
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: number | null]
  change: [value: number | null]
}>()

const handleChange = (value: number | null) => {
  emit('update:modelValue', value)
  emit('change', value)
}
</script>
```

Props 中不推荐直接传入不稳定的临时字段，例如 `isPageA`、`fromType`、`specialFlag`。如果组件需要根据多个场景变化行为，应优先设计为明确的业务参数，例如 `mode="create"`、`readonly`、`permission-code`，而不是使用含义模糊的布尔值堆叠。

### Emits 事件设计规范

Emits 是组件的输出边界，用于通知父组件用户行为或组件内部状态变化。事件名称应表达“发生了什么”，而不是表达“父组件应该做什么”。

推荐事件命名方式如下：

| 场景     | 推荐事件             | 不推荐事件     |
| -------- | -------------------- | -------------- |
| 值更新   | `update:modelValue`  | `setValue`     |
| 查询触发 | `search`             | `doSearch`     |
| 重置触发 | `reset`              | `clearAllData` |
| 保存成功 | `success` 或 `saved` | `reloadParent` |
| 弹窗关闭 | `close`              | `hideDialog`   |

Emits 应配合 TypeScript 定义事件参数，避免父组件使用时无法判断事件载荷结构。

示例用于展示搜索面板组件的事件设计方式。

文件位置：`src/views/user/components/SearchPanel.vue`

```vue
<template>
  <el-form :model="searchForm" inline>
    <el-form-item label="用户名">
      <el-input
        v-model="searchForm.keyword"
        placeholder="请输入用户名"
        clearable
      />
    </el-form-item>

    <el-form-item label="状态">
      <el-select
        v-model="searchForm.status"
        placeholder="请选择状态"
        clearable
        class="w-40"
      >
        <el-option label="启用" value="enabled" />
        <el-option label="禁用" value="disabled" />
      </el-select>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="handleSearch">查询</el-button>
      <el-button @click="handleReset">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

interface SearchForm {
  keyword: string
  status: string
}

const emit = defineEmits<{
  search: [params: SearchForm]
  reset: []
}>()

const searchForm = reactive<SearchForm>({
  keyword: '',
  status: ''
})

const handleSearch = () => {
  emit('search', { ...searchForm })
}

const handleReset = () => {
  searchForm.keyword = ''
  searchForm.status = ''
  emit('reset')
}
</script>
```

事件设计不应让子组件直接控制父组件行为。例如子组件不应触发 `reloadTable`、`openDetailPage` 这类强绑定父级实现的事件。更合理的方式是触发 `success`、`select`、`submit`、`close` 等语义事件，由父组件决定后续处理逻辑。

### Slots 插槽设计规范

Slots 用于增强组件扩展能力，适合封装布局结构固定但局部内容可变的组件。相比通过 Props 传递大量配置，Slots 更适合处理复杂模板、自定义按钮、自定义表格列、自定义弹窗底部等场景。

插槽设计应遵循以下原则：

| 插槽类型   | 适用场景           | 示例                          |
| ---------- | ------------------ | ----------------------------- |
| 默认插槽   | 主体内容自定义     | 卡片内容、弹窗主体            |
| 具名插槽   | 固定区域内容自定义 | `header`、`footer`、`toolbar` |
| 作用域插槽 | 向外暴露内部数据   | 表格行、列表项、选项数据      |

示例用于展示一个带 `header`、默认内容和 `footer` 插槽的基础卡片组件。

文件位置：`src/components/base/BaseCard.vue`

```vue
<template>
  <section class="rounded-lg border bg-white p-4 shadow-sm">
    <header v-if="$slots.header" class="mb-3 border-b pb-3">
      <slot name="header" />
    </header>

    <main>
      <slot />
    </main>

    <footer v-if="$slots.footer" class="mt-3 border-t pt-3">
      <slot name="footer" />
    </footer>
  </section>
</template>

<script setup lang="ts">
defineOptions({
  name: 'BaseCard'
})
</script>
```

使用方式如下：

```vue
<template>
  <BaseCard>
    <template #header>
      <div class="flex items-center justify-between">
        <span class="font-medium">用户信息</span>
        <el-button type="primary">新增用户</el-button>
      </div>
    </template>

    <div>这里展示用户基础信息。</div>

    <template #footer>
      <el-button>取消</el-button>
      <el-button type="primary">保存</el-button>
    </template>
  </BaseCard>
</template>
```

当组件需要向插槽暴露内部数据时，应使用作用域插槽。例如列表组件可以暴露当前项、索引和选中状态，由使用方决定具体展示内容。插槽暴露的数据应稳定，不要频繁变更字段名称，否则会影响所有调用方。

## 组件基础开发

组件基础开发主要覆盖 Vue3 单文件组件的基本结构、响应式数据、计算属性、监听器和生命周期处理。项目中应优先使用 `<script setup lang="ts">`，并使用组合式 API 组织组件逻辑。

### `<script setup>` 基本结构

<script setup> 是 Vue3 推荐的组件编写方式，语法更简洁，类型推导更直接，适合配合 TypeScript 使用。组件内部定义的变量、方法、计算属性可以直接在模板中使用，不需要手动 return。

推荐组件结构顺序如下：

```text
template
script setup
  类型定义
  Props 定义
  Emits 定义
  响应式状态
  计算属性
  监听器
  方法函数
  生命周期
style
```

示例展示一个标准 Vue3 组件基本结构。

文件位置：`src/views/user/components/UserStatusCard.vue`

```vue
<template>
  <div class="rounded-lg border p-4">
    <div class="text-base font-medium">{{ title }}</div>

    <div class="mt-2 text-sm text-gray-500">
      当前状态：{{ statusText }}
    </div>

    <el-button class="mt-3" type="primary" @click="handleRefresh">
      刷新
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type UserStatus = 'enabled' | 'disabled'

const props = withDefaults(
  defineProps<{
    title?: string
    status: UserStatus
  }>(),
  {
    title: '用户状态'
  }
)

const emit = defineEmits<{
  refresh: []
}>()

const statusText = computed(() => {
  const statusMap: Record<UserStatus, string> = {
    enabled: '启用',
    disabled: '禁用'
  }

  return statusMap[props.status]
})

const handleRefresh = () => {
  emit('refresh')
}
</script>

<style scoped lang="scss">
.status-card {
  min-height: 120px;
}
</style>
```

<script setup> 中不需要写 export default。如果需要定义组件名称，可以使用 defineOptions，主要用于调试、递归组件或需要固定组件名的场景。

```vue
<script setup lang="ts">
defineOptions({
  name: 'UserStatusCard'
})
</script>
```

### 响应式数据定义

响应式数据用于描述组件内部会变化的状态。Vue3 中常用 `ref` 和 `reactive` 定义响应式数据。简单类型、数组引用、接口返回列表通常使用 `ref`；表单对象、查询对象等结构化数据通常使用 `reactive`。

推荐使用方式如下：

| API        | 适用场景                               | 示例                                  |
| ---------- | -------------------------------------- | ------------------------------------- |
| `ref`      | 字符串、数字、布尔值、数组、可替换对象 | `const loading = ref(false)`          |
| `reactive` | 表单对象、查询条件、局部状态对象       | `const form = reactive({ name: '' })` |
| `toRef`    | 从对象中提取单个响应式字段             | `const name = toRef(form, 'name')`    |
| `toRefs`   | 解构响应式对象并保持响应性             | `const { name } = toRefs(form)`       |

示例展示表单组件中响应式数据的常用写法。

文件位置：`src/views/user/components/UserForm.vue`

```vue
<template>
  <el-form :model="form" label-width="80px">
    <el-form-item label="用户名">
      <el-input v-model="form.name" placeholder="请输入用户名" />
    </el-form-item>

    <el-form-item label="邮箱">
      <el-input v-model="form.email" placeholder="请输入邮箱" />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" :loading="submitLoading" @click="handleSubmit">
        提交
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

interface UserForm {
  name: string
  email: string
}

const emit = defineEmits<{
  submit: [form: UserForm]
}>()

const submitLoading = ref(false)

const form = reactive<UserForm>({
  name: '',
  email: ''
})

const handleSubmit = async () => {
  submitLoading.value = true

  try {
    emit('submit', { ...form })
  } finally {
    submitLoading.value = false
  }
}
</script>
```

`reactive` 对象不建议整体替换，例如不推荐 `form = newForm`。如果需要重置对象，应逐个字段赋值，或使用 `Object.assign(form, defaultForm)`。`ref` 在脚本中访问和修改时需要使用 `.value`，在模板中会自动解包。

### 计算属性使用

计算属性用于处理由已有状态派生出来的数据。只要某个值可以由已有状态计算得到，就不应该再定义一份额外状态手动维护，否则容易出现数据不同步的问题。

适合使用 `computed` 的场景包括：状态文本转换、按钮禁用条件、表格过滤结果、金额格式化、表单是否可提交、权限展示判断等。

示例展示根据用户状态和角色数量计算展示内容。

文件位置：`src/views/user/components/UserSummary.vue`

```vue
<template>
  <div class="rounded border p-4">
    <div class="font-medium">{{ user.name }}</div>
    <div class="mt-1 text-sm text-gray-500">{{ statusText }}</div>
    <div class="mt-1 text-sm text-gray-500">{{ roleSummary }}</div>

    <el-button class="mt-3" type="primary" :disabled="submitDisabled">
      保存
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface UserInfo {
  name: string
  status: 'enabled' | 'disabled'
  roles: string[]
}

const props = defineProps<{
  user: UserInfo
}>()

const statusText = computed(() => {
  return props.user.status === 'enabled' ? '账号已启用' : '账号已禁用'
})

const roleSummary = computed(() => {
  if (!props.user.roles.length) {
    return '暂未分配角色'
  }

  return `已分配 ${props.user.roles.length} 个角色`
})

const submitDisabled = computed(() => {
  return !props.user.name || props.user.status === 'disabled'
})
</script>
```

计算属性应保持纯粹，不建议在 `computed` 中发请求、修改状态、触发事件或操作 DOM。此类副作用逻辑应放到方法、监听器或生命周期函数中处理。

### 监听器使用

监听器用于响应某个状态变化并执行副作用逻辑，例如根据关键字变化触发查询、根据弹窗显示状态初始化数据、根据 Props 变化同步内部状态等。

常用监听方式包括 `watch` 和 `watchEffect`。业务开发中更推荐优先使用 `watch`，因为它的监听来源明确，可读性更好，也更容易控制执行时机。

示例展示根据弹窗显示状态初始化表单数据。

文件位置：`src/views/user/components/UserEditDialog.vue`

```vue
<template>
  <el-dialog
    :model-value="modelValue"
    title="编辑用户"
    width="520px"
    @close="handleClose"
  >
    <el-form :model="form" label-width="80px">
      <el-form-item label="用户名">
        <el-input v-model="form.name" placeholder="请输入用户名" />
      </el-form-item>

      <el-form-item label="邮箱">
        <el-input v-model="form.email" placeholder="请输入邮箱" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit">保存</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'

interface UserInfo {
  id: number
  name: string
  email: string
}

const props = defineProps<{
  modelValue: boolean
  user?: UserInfo | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  submit: [form: UserInfo]
}>()

const form = reactive<UserInfo>({
  id: 0,
  name: '',
  email: ''
})

watch(
  () => props.modelValue,
  visible => {
    if (!visible || !props.user) {
      return
    }

    // 弹窗打开时同步外部用户数据，避免直接修改 Props
    Object.assign(form, props.user)
  }
)

const handleClose = () => {
  emit('update:modelValue', false)
}

const handleSubmit = () => {
  emit('submit', { ...form })
}
</script>
```

监听器使用时应注意控制范围。不要为了省事监听整个大型对象，除非确实需要深度监听。对于表单、查询条件等对象，优先监听具体字段。深度监听 `deep: true` 成本较高，复杂页面中过度使用会影响性能和可维护性。

推荐写法：

```typescript
watch(
  () => form.keyword,
  keyword => {
    // 关键字变化后处理搜索逻辑
    console.log('搜索关键字变化：', keyword)
  }
)
```

不推荐写法：

```typescript
watch(
  form,
  value => {
    console.log('整个表单变化：', value)
  },
  {
    deep: true
  }
)
```

### 生命周期处理

生命周期用于处理组件挂载、更新、卸载等阶段的逻辑。Vue3 组合式 API 中常用生命周期函数包括 `onMounted`、`onUpdated`、`onBeforeUnmount` 等。

常见使用场景如下：

| 生命周期          | 适用场景                                 |
| ----------------- | ---------------------------------------- |
| `onMounted`       | 初始化请求、DOM 初始化、第三方组件初始化 |
| `onBeforeUnmount` | 清除定时器、取消监听、销毁实例           |
| `onUpdated`       | 响应 DOM 更新后的处理，使用频率较低      |
| `onActivated`     | `keep-alive` 组件激活时处理              |
| `onDeactivated`   | `keep-alive` 组件停用时处理              |

示例展示组件挂载时加载数据，卸载前清理定时器。

文件位置：`src/views/user/components/UserOnlineStatus.vue`

```vue
<template>
  <div class="rounded border p-4">
    <div class="font-medium">在线用户数</div>
    <div class="mt-2 text-2xl">{{ onlineCount }}</div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

const onlineCount = ref(0)
let timer: number | undefined

const loadOnlineCount = async () => {
  // 实际项目中这里替换为在线用户数接口
  onlineCount.value = Math.floor(Math.random() * 100)
}

onMounted(() => {
  loadOnlineCount()

  // 定时刷新在线人数
  timer = window.setInterval(() => {
    loadOnlineCount()
  }, 30000)
})

onBeforeUnmount(() => {
  if (timer) {
    window.clearInterval(timer)
  }
})
</script>
```

生命周期中应避免堆放大量业务逻辑。复杂初始化逻辑可以抽取为独立方法，例如 `initPage`、`loadData`、`initChart`。如果某段生命周期逻辑在多个组件中重复出现，例如窗口尺寸监听、滚动监听、定时刷新、WebSocket 连接管理，应抽取为 composable。

推荐抽取方式如下：

文件位置：`src/composables/useInterval.ts`

```typescript
import { onBeforeUnmount } from 'vue'

export function useInterval(callback: () => void, delay: number) {
  const timer = window.setInterval(callback, delay)

  onBeforeUnmount(() => {
    window.clearInterval(timer)
  })

  return {
    stop: () => window.clearInterval(timer)
  }
}
```

组件中使用：

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useInterval } from '@/composables/useInterval'

const count = ref(0)

useInterval(() => {
  count.value += 1
}, 1000)
</script>
```

生命周期的核心原则是：初始化逻辑放在 `onMounted`，资源释放放在 `onBeforeUnmount`，可复用副作用抽取为 composable，避免组件卸载后仍存在定时器、事件监听或异步回调导致内存泄漏。



## 组件通信方式

组件通信方式用于解决组件之间的数据传递、事件通知、状态同步和逻辑复用问题。Vue3 项目中应优先选择简单、明确、可追踪的通信方式，避免为了方便而引入隐式依赖，导致后期维护困难。

组件通信的基本选择原则是：父子组件使用 `props` 和 `emits`；兄弟组件优先通过共同父组件协调；跨层级组件使用 `provide/inject` 或 Pinia；可复用逻辑抽取为组合式函数。

### 父子组件通信

父子组件通信是 Vue 组件中最常见的通信方式。父组件通过 `props` 向子组件传递数据，子组件通过 `emits` 向父组件通知事件。数据流应保持单向：父组件负责传入状态，子组件负责触发变更事件，不应直接修改父组件传入的 Props。

常见父子通信方式如下：

| 通信方式             | 使用场景                       | 推荐程度 |
| -------------------- | ------------------------------ | -------- |
| `props`              | 父组件向子组件传递数据         | 推荐     |
| `emits`              | 子组件向父组件通知事件         | 推荐     |
| `v-model`            | 父子组件之间进行双向绑定       | 推荐     |
| `ref` 调用子组件方法 | 表单校验、弹窗打开等命令式操作 | 谨慎使用 |
| 直接修改 Props       | 子组件直接修改父组件传入数据   | 不推荐   |

推荐优先使用 `v-model` 封装表单类、选择类、弹窗类组件。Vue3 中组件的默认双向绑定字段为 `modelValue`，事件为 `update:modelValue`。

下面示例展示父组件通过 `v-model` 控制子组件弹窗显示，并通过 `submit` 接收子组件提交的数据。

文件位置：`src/views/user/UserList.vue`

```vue
<template>
  <div class="p-4">
    <el-button type="primary" @click="handleOpenDialog">
      新增用户
    </el-button>

    <UserEditDialog
      v-model="dialogVisible"
      :user="currentUser"
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import UserEditDialog from './components/UserEditDialog.vue'

interface UserForm {
  id?: number
  name: string
  email: string
}

const dialogVisible = ref(false)
const currentUser = ref<UserForm | null>(null)

const handleOpenDialog = () => {
  currentUser.value = null
  dialogVisible.value = true
}

const handleSubmit = (form: UserForm) => {
  console.log('提交用户数据：', form)
  dialogVisible.value = false
}
</script>
```

子组件接收 `modelValue` 控制弹窗显示，并通过 `update:modelValue` 通知父组件关闭弹窗。

文件位置：`src/views/user/components/UserEditDialog.vue`

```vue
<template>
  <el-dialog
    :model-value="modelValue"
    title="用户编辑"
    width="520px"
    @close="handleClose"
  >
    <el-form :model="form" label-width="80px">
      <el-form-item label="用户名">
        <el-input v-model="form.name" placeholder="请输入用户名" />
      </el-form-item>

      <el-form-item label="邮箱">
        <el-input v-model="form.email" placeholder="请输入邮箱" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit">保存</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'

interface UserForm {
  id?: number
  name: string
  email: string
}

const props = defineProps<{
  modelValue: boolean
  user?: UserForm | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  submit: [form: UserForm]
}>()

const form = reactive<UserForm>({
  name: '',
  email: ''
})

watch(
  () => props.modelValue,
  visible => {
    if (!visible) {
      return
    }

    // 弹窗打开时初始化表单，避免直接修改 Props
    Object.assign(form, props.user || { name: '', email: '' })
  }
)

const handleClose = () => {
  emit('update:modelValue', false)
}

const handleSubmit = () => {
  emit('submit', { ...form })
}
</script>
```

父子通信的核心要求是边界清晰。父组件不要过度干预子组件内部实现，子组件也不要直接依赖父组件状态。对于表单、弹窗、选择器这类组件，应优先设计稳定的 Props、Emits 和 `v-model` 接口。

### 兄弟组件通信

兄弟组件通信指两个没有直接父子关系，但处于同一父组件下的组件之间进行数据同步或行为联动。推荐方式是将共享状态提升到共同父组件，由父组件统一管理状态，再分别通过 Props 和 Emits 分发给子组件。

常见兄弟通信方式如下：

| 方式                | 适用场景                         | 说明               |
| ------------------- | -------------------------------- | ------------------ |
| 共同父组件中转      | 搜索区影响表格、工具栏影响弹窗   | 最推荐，数据流清晰 |
| Pinia 状态管理      | 多个页面或多个组件共享状态       | 适合跨模块共享     |
| Composable 共享逻辑 | 多组件复用相同逻辑，但状态可独立 | 适合逻辑复用       |
| 事件总线            | 临时事件通知                     | 不推荐作为默认方案 |

示例中，`SearchPanel` 和 `UserTable` 是兄弟组件。搜索组件只负责提交查询条件，父组件负责接收查询参数并传递给表格组件。

文件位置：`src/views/user/UserList.vue`

```vue
<template>
  <div class="p-4">
    <SearchPanel @search="handleSearch" @reset="handleReset" />

    <UserTable
      class="mt-4"
      :query-params="queryParams"
      @edit="handleEdit"
    />
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import SearchPanel from './components/SearchPanel.vue'
import UserTable from './components/UserTable.vue'

interface UserQueryParams {
  keyword: string
  status: string
}

interface UserInfo {
  id: number
  name: string
  email: string
}

const queryParams = reactive<UserQueryParams>({
  keyword: '',
  status: ''
})

const handleSearch = (params: UserQueryParams) => {
  Object.assign(queryParams, params)
}

const handleReset = () => {
  Object.assign(queryParams, {
    keyword: '',
    status: ''
  })
}

const handleEdit = (user: UserInfo) => {
  console.log('编辑用户：', user)
}
</script>
```

表格组件通过监听查询参数变化重新加载数据。

文件位置：`src/views/user/components/UserTable.vue`

```vue
<template>
  <el-table v-loading="loading" :data="tableData" border>
    <el-table-column prop="name" label="用户名" />
    <el-table-column prop="email" label="邮箱" />
    <el-table-column prop="status" label="状态" />

    <el-table-column label="操作" width="120">
      <template #default="{ row }">
        <el-button link type="primary" @click="handleEdit(row)">
          编辑
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface UserQueryParams {
  keyword: string
  status: string
}

interface UserInfo {
  id: number
  name: string
  email: string
  status: string
}

const props = defineProps<{
  queryParams: UserQueryParams
}>()

const emit = defineEmits<{
  edit: [user: UserInfo]
}>()

const loading = ref(false)
const tableData = ref<UserInfo[]>([])

const loadTableData = async () => {
  loading.value = true

  try {
    // 实际项目中这里替换为接口请求，并传入 props.queryParams
    tableData.value = [
      {
        id: 1,
        name: '张三',
        email: 'zhangsan@example.com',
        status: props.queryParams.status || 'enabled'
      }
    ]
  } finally {
    loading.value = false
  }
}

watch(
  () => ({ ...props.queryParams }),
  () => {
    loadTableData()
  },
  {
    immediate: true
  }
)

const handleEdit = (user: UserInfo) => {
  emit('edit', user)
}
</script>
```

兄弟组件通信不建议直接互相引用，也不建议通过全局变量临时传值。只要两个组件处于同一页面区域，优先由父组件统一协调，这样数据流最容易追踪。

### 跨层级组件通信

跨层级组件通信用于解决祖先组件和深层子组件之间的数据传递问题。常见方案包括 `provide/inject` 和 Pinia。前者适合局部组件树中的上下文传递，后者适合全局或跨页面共享状态。

`provide/inject` 适合以下场景：表单上下文、弹窗上下文、表格上下文、主题配置、权限上下文、局部模块状态等。它不适合替代 Pinia 管理全局业务状态。

推荐使用 TypeScript 的 `InjectionKey` 定义注入类型，避免注入数据失去类型约束。

下面示例展示父级组件提供用户上下文，深层子组件直接注入使用。

文件位置：`src/views/user/context/userContext.ts`

```typescript
import type { InjectionKey, Ref } from 'vue'

export interface UserContext {
  currentUserId: Ref<number | null>
  refreshUser: () => void
}

export const userContextKey: InjectionKey<UserContext> = Symbol('userContext')
```

父级页面通过 `provide` 提供上下文。

文件位置：`src/views/user/UserDetail.vue`

```vue
<template>
  <div class="p-4">
    <UserBaseInfo />
  </div>
</template>

<script setup lang="ts">
import { provide, ref } from 'vue'
import UserBaseInfo from './components/UserBaseInfo.vue'
import { userContextKey } from './context/userContext'

const currentUserId = ref<number | null>(1001)

const refreshUser = () => {
  console.log('刷新用户详情：', currentUserId.value)
}

provide(userContextKey, {
  currentUserId,
  refreshUser
})
</script>
```

深层子组件通过 `inject` 获取上下文。

文件位置：`src/views/user/components/UserBaseInfo.vue`

```vue
<template>
  <div class="rounded border p-4">
    <div>当前用户ID：{{ userContext.currentUserId.value }}</div>

    <el-button class="mt-3" type="primary" @click="userContext.refreshUser">
      刷新用户
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import { userContextKey } from '../context/userContext'

const userContext = inject(userContextKey)

if (!userContext) {
  throw new Error('UserBaseInfo 必须在 UserDetail 上下文中使用')
}
</script>
```

使用 `provide/inject` 时应避免注入过多无关内容。推荐只注入当前模块确实需要共享的数据和方法。如果某个状态需要被多个页面、路由或模块共享，应使用 Pinia，而不是继续扩大 `provide/inject` 的范围。

### 组合式函数抽取

组合式函数用于抽取可复用的状态逻辑和副作用逻辑。它不负责渲染模板，而是返回组件需要使用的状态、方法和计算结果。组合式函数推荐统一放在 `src/composables` 或业务模块内部的 `composables` 目录中。

适合抽取为组合式函数的逻辑包括：分页查询、表格加载、表单提交、窗口监听、防抖搜索、权限判断、定时刷新、文件上传、弹窗控制等。

命名应使用 `useXxx` 格式，例如 `useTableQuery`、`useDialog`、`useUserOptions`。

下面示例封装通用表格查询逻辑。

文件位置：`src/composables/useTableQuery.ts`

```typescript
import { reactive, ref } from 'vue'

interface PageParams {
  pageNum: number
  pageSize: number
}

interface PageResult<T> {
  records: T[]
  total: number
}

interface UseTableQueryOptions<T, Q extends object> {
  queryParams: Q
  request: (params: Q & PageParams) => Promise<PageResult<T>>
}

export function useTableQuery<T, Q extends object>(options: UseTableQueryOptions<T, Q>) {
  const loading = ref(false)
  const tableData = ref<T[]>([])
  const total = ref(0)

  const pageParams = reactive<PageParams>({
    pageNum: 1,
    pageSize: 10
  })

  const loadData = async () => {
    loading.value = true

    try {
      const result = await options.request({
        ...options.queryParams,
        ...pageParams
      })

      tableData.value = result.records
      total.value = result.total
    } finally {
      loading.value = false
    }
  }

  const resetPage = () => {
    pageParams.pageNum = 1
  }

  const reload = async () => {
    resetPage()
    await loadData()
  }

  return {
    loading,
    tableData,
    total,
    pageParams,
    loadData,
    reload
  }
}
```

页面中使用组合式函数时，只需要传入查询参数和请求函数。

```vue
<script setup lang="ts">
import { reactive } from 'vue'
import { useTableQuery } from '@/composables/useTableQuery'

interface UserInfo {
  id: number
  name: string
  email: string
}

interface UserQueryParams {
  keyword: string
  status: string
}

const queryParams = reactive<UserQueryParams>({
  keyword: '',
  status: ''
})

const queryUserPage = async () => {
  return {
    records: [
      { id: 1, name: '张三', email: 'zhangsan@example.com' }
    ],
    total: 1
  }
}

const {
  loading,
  tableData,
  total,
  pageParams,
  reload
} = useTableQuery<UserInfo, UserQueryParams>({
  queryParams,
  request: queryUserPage
})
</script>
```

组合式函数应保持输入输出清晰，不应在内部直接耦合某个具体页面组件。对于业务强相关的组合式函数，可以放在业务模块目录下；对于多个模块都能复用的能力，再提升到全局 `src/composables`。

## 组件状态管理

组件状态管理用于规范组件内部状态、表单状态、异步状态和全局共享状态的处理方式。状态管理的核心目标是让状态来源清晰、更新路径可控、异常处理统一。

在 Vue3 项目中，状态可以按照作用范围分为本地状态、组件间共享状态和全局状态。不是所有状态都需要放入 Pinia，只有跨页面、跨模块、需要缓存或需要统一管理的数据才适合进入全局状态。

### 本地状态管理

本地状态指只在当前组件内部使用的状态，例如加载状态、弹窗显示状态、当前选中项、临时输入值、局部开关等。此类状态应直接使用 `ref` 或 `reactive` 管理，不需要引入 Pinia。

常见本地状态包括：

| 状态类型 | 示例                                        |
| -------- | ------------------------------------------- |
| 布尔状态 | `loading`、`dialogVisible`、`submitLoading` |
| 当前数据 | `currentUser`、`selectedRow`                |
| 局部列表 | `tableData`、`options`                      |
| UI 状态  | `activeTab`、`expandedKeys`                 |

示例展示组件内部维护弹窗、当前行和加载状态。

文件位置：`src/views/user/UserList.vue`

```vue
<template>
  <div class="p-4">
    <el-button type="primary" @click="handleCreate">
      新增用户
    </el-button>

    <el-table v-loading="loading" class="mt-4" :data="tableData" border>
      <el-table-column prop="name" label="用户名" />
      <el-table-column prop="email" label="邮箱" />

      <el-table-column label="操作" width="120">
        <template #default="{ row }">
          <el-button link type="primary" @click="handleEdit(row)">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <UserEditDialog
      v-model="dialogVisible"
      :user="currentUser"
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import UserEditDialog from './components/UserEditDialog.vue'

interface UserInfo {
  id: number
  name: string
  email: string
}

const loading = ref(false)
const dialogVisible = ref(false)
const tableData = ref<UserInfo[]>([])
const currentUser = ref<UserInfo | null>(null)

const loadTableData = async () => {
  loading.value = true

  try {
    tableData.value = [
      { id: 1, name: '张三', email: 'zhangsan@example.com' }
    ]
  } finally {
    loading.value = false
  }
}

const handleCreate = () => {
  currentUser.value = null
  dialogVisible.value = true
}

const handleEdit = (row: UserInfo) => {
  currentUser.value = row
  dialogVisible.value = true
}

const handleSubmit = async () => {
  dialogVisible.value = false
  await loadTableData()
}

onMounted(() => {
  loadTableData()
})
</script>
```

本地状态不应被提升到全局状态中。过度使用 Pinia 会导致状态来源复杂，也会让组件之间产生不必要的耦合。

### 表单状态管理

表单状态通常包括表单数据、校验规则、提交状态、重置逻辑和回显逻辑。Vue3 中表单对象推荐使用 `reactive` 定义，提交状态使用 `ref` 定义。对于编辑表单，应在弹窗打开或数据变化时初始化表单，避免直接修改 Props。

表单状态管理应遵循以下原则：

| 原则             | 说明                                 |
| ---------------- | ------------------------------------ |
| 表单对象集中定义 | 使用 `reactive` 定义完整表单结构     |
| 默认值单独维护   | 使用函数返回默认值，避免对象引用污染 |
| 提交前复制数据   | 使用 `{ ...form }` 或结构化转换      |
| 回显时使用赋值   | 使用 `Object.assign` 同步数据        |
| 校验和提交分离   | 校验通过后再执行提交逻辑             |

下面示例展示表单默认值、回显、提交和重置的标准写法。

文件位置：`src/views/user/components/UserForm.vue`

```vue
<template>
  <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
    <el-form-item label="用户名" prop="name">
      <el-input v-model="form.name" placeholder="请输入用户名" />
    </el-form-item>

    <el-form-item label="邮箱" prop="email">
      <el-input v-model="form.email" placeholder="请输入邮箱" />
    </el-form-item>

    <el-form-item label="状态" prop="status">
      <el-radio-group v-model="form.status">
        <el-radio-button label="enabled">启用</el-radio-button>
        <el-radio-button label="disabled">禁用</el-radio-button>
      </el-radio-group>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" :loading="submitLoading" @click="handleSubmit">
        提交
      </el-button>
      <el-button @click="handleReset">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'

interface UserForm {
  id?: number
  name: string
  email: string
  status: 'enabled' | 'disabled'
}

const props = defineProps<{
  modelValue?: UserForm | null
}>()

const emit = defineEmits<{
  submit: [form: UserForm]
}>()

const formRef = ref<FormInstance>()
const submitLoading = ref(false)

const createDefaultForm = (): UserForm => ({
  name: '',
  email: '',
  status: 'enabled'
})

const form = reactive<UserForm>(createDefaultForm())

const rules: FormRules<UserForm> = {
  name: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
}

watch(
  () => props.modelValue,
  value => {
    Object.assign(form, createDefaultForm(), value || {})
  },
  {
    immediate: true
  }
)

const handleSubmit = async () => {
  if (!formRef.value) {
    return
  }

  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) {
    return
  }

  submitLoading.value = true

  try {
    emit('submit', { ...form })
  } finally {
    submitLoading.value = false
  }
}

const handleReset = () => {
  Object.assign(form, createDefaultForm())
  formRef.value?.clearValidate()
}
</script>
```

表单状态应避免多个来源同时修改。例如不要同时让父组件、子组件和 Pinia 都修改同一个表单对象。对于弹窗表单，推荐由弹窗内部维护临时表单状态，提交成功后再向父组件输出最终结果。

### 异步状态管理

异步状态主要包括请求中的加载状态、请求成功后的数据状态、请求失败后的异常状态和空数据状态。组件中处理异步逻辑时，应避免只有数据变量而没有加载和异常状态，否则页面无法准确展示当前状态。

推荐的异步状态结构如下：

| 状态       | 说明                           |
| ---------- | ------------------------------ |
| `loading`  | 请求是否正在执行               |
| `data`     | 请求成功后的数据               |
| `error`    | 请求失败时的错误信息           |
| `finished` | 是否完成过首次请求             |
| `empty`    | 是否为空数据，可由计算属性派生 |

下面示例封装通用异步请求状态。

文件位置：`src/composables/useAsyncState.ts`

```typescript
import { computed, ref } from 'vue'

export function useAsyncState<T>(request: () => Promise<T>) {
  const loading = ref(false)
  const data = ref<T | null>(null)
  const error = ref<unknown>(null)
  const finished = ref(false)

  const empty = computed(() => {
    if (Array.isArray(data.value)) {
      return finished.value && data.value.length === 0
    }

    return finished.value && !data.value
  })

  const execute = async () => {
    loading.value = true
    error.value = null

    try {
      data.value = await request()
    } catch (err) {
      error.value = err
      throw err
    } finally {
      loading.value = false
      finished.value = true
    }
  }

  return {
    loading,
    data,
    error,
    finished,
    empty,
    execute
  }
}
```

组件中使用异步状态时，可以统一处理加载、空数据和错误状态。

文件位置：`src/views/user/components/UserOptions.vue`

```vue
<template>
  <div>
    <el-skeleton v-if="loading" :rows="3" animated />

    <el-empty v-else-if="empty" description="暂无用户数据" />

    <el-alert
      v-else-if="error"
      title="用户数据加载失败"
      type="error"
      show-icon
    />

    <el-select v-else v-model="selectedUserId" placeholder="请选择用户">
      <el-option
        v-for="item in data || []"
        :key="item.id"
        :label="item.name"
        :value="item.id"
      />
    </el-select>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useAsyncState } from '@/composables/useAsyncState'

interface UserOption {
  id: number
  name: string
}

const selectedUserId = ref<number | null>(null)

const queryUserOptions = async (): Promise<UserOption[]> => {
  // 实际项目中这里替换为接口请求
  return [
    { id: 1, name: '张三' },
    { id: 2, name: '李四' }
  ]
}

const {
  loading,
  data,
  error,
  empty,
  execute
} = useAsyncState<UserOption[]>(queryUserOptions)

onMounted(() => {
  execute()
})
</script>
```

异步状态管理的关键是不要忽略异常和空状态。请求失败时应有明确反馈；首次加载、重新加载和提交中状态应区分清楚；组件卸载后仍可能返回的异步请求，需要根据业务复杂度考虑取消请求或忽略过期响应。

### Pinia 状态接入

Pinia 用于管理跨组件、跨页面或需要缓存的共享状态。它适合保存登录用户信息、权限信息、菜单数据、字典数据、主题配置、全局筛选条件等。组件内部临时状态不应放入 Pinia。

适合放入 Pinia 的状态包括：

| 状态类型       | 示例                             |
| -------------- | -------------------------------- |
| 用户状态       | 当前登录用户、token、角色、权限  |
| 系统状态       | 菜单、主题、语言、布局配置       |
| 字典缓存       | 状态字典、类型字典、枚举选项     |
| 跨页面共享状态 | 当前组织、当前项目、全局筛选条件 |

不适合放入 Pinia 的状态包括：弹窗显示状态、表单临时输入值、单个页面的加载状态、只在一个组件中使用的表格数据。

下面示例展示用户状态 Store 的基础写法。

文件位置：`src/stores/user.ts`

```typescript
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

interface LoginUser {
  id: number
  username: string
  nickname: string
  roles: string[]
  permissions: string[]
}

export const useUserStore = defineStore('user', () => {
  const token = ref('')
  const loginUser = ref<LoginUser | null>(null)

  const isLogin = computed(() => {
    return Boolean(token.value && loginUser.value)
  })

  const hasPermission = (permission: string) => {
    return Boolean(loginUser.value?.permissions.includes(permission))
  }

  const setToken = (value: string) => {
    token.value = value
  }

  const setLoginUser = (user: LoginUser) => {
    loginUser.value = user
  }

  const clearUser = () => {
    token.value = ''
    loginUser.value = null
  }

  return {
    token,
    loginUser,
    isLogin,
    hasPermission,
    setToken,
    setLoginUser,
    clearUser
  }
})
```

组件中使用 Pinia 时，应通过 Store 暴露的方法修改状态，不建议在多个组件中随意直接改写复杂状态。

文件位置：`src/views/user/components/UserPermissionButton.vue`

```vue
<template>
  <el-button
    v-if="canCreateUser"
    type="primary"
    @click="handleCreate"
  >
    新增用户
  </el-button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const canCreateUser = computed(() => {
  return userStore.hasPermission('user:create')
})

const handleCreate = () => {
  console.log('执行新增用户操作')
}
</script>
```

如果 Store 中包含异步请求，推荐将请求封装在 Store action 中，组件只负责调用 action 和展示状态。

文件位置：`src/stores/dict.ts`

```typescript
import { defineStore } from 'pinia'
import { ref } from 'vue'

interface DictItem {
  label: string
  value: string
}

export const useDictStore = defineStore('dict', () => {
  const userStatusOptions = ref<DictItem[]>([])
  const loading = ref(false)

  const loadUserStatusOptions = async () => {
    if (userStatusOptions.value.length) {
      return
    }

    loading.value = true

    try {
      // 实际项目中这里替换为字典接口请求
      userStatusOptions.value = [
        { label: '启用', value: 'enabled' },
        { label: '禁用', value: 'disabled' }
      ]
    } finally {
      loading.value = false
    }
  }

  return {
    userStatusOptions,
    loading,
    loadUserStatusOptions
  }
})
```

组件中接入字典 Store。

```vue
<template>
  <el-select
    v-model="status"
    :loading="dictStore.loading"
    placeholder="请选择用户状态"
    clearable
  >
    <el-option
      v-for="item in dictStore.userStatusOptions"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useDictStore } from '@/stores/dict'

const status = ref('')
const dictStore = useDictStore()

onMounted(() => {
  dictStore.loadUserStatusOptions()
})
</script>
```

Pinia 接入的核心原则是：全局共享状态放 Store，本地临时状态放组件，复用逻辑放 composable。Store 不应变成所有页面状态的集中垃圾桶，状态越全局，越需要稳定的命名、明确的更新方法和清晰的生命周期。



## 组件样式开发

组件样式开发用于规范 Vue3 组件中的样式组织、作用域隔离、主题变量和第三方组件样式覆盖方式。样式规范的目标是避免全局污染、降低样式冲突、提升组件复用稳定性，并保证项目在主题切换、暗黑模式或多端适配时具备扩展空间。

Vue3 项目中推荐优先使用 `scoped` 样式处理组件私有样式；对于需要强隔离类名的复杂组件，可以使用 CSS Modules；对于颜色、间距、圆角、字体等全局设计规范，应通过 CSS 变量或 Sass 变量统一维护。

### Scoped 样式使用

`scoped` 样式用于限制当前组件样式只作用于当前组件模板，适合大多数业务组件、页面局部组件和基础展示组件。使用 `scoped` 可以降低样式泄漏风险，避免不同组件之间因为类名相同产生冲突。

推荐写法如下：

文件位置：`src/components/base/BaseStatusTag.vue`

```vue
<template>
  <span class="base-status-tag" :class="statusClass">
    {{ text }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type StatusType = 'success' | 'warning' | 'danger' | 'info'

const props = withDefaults(
  defineProps<{
    text: string
    type?: StatusType
  }>(),
  {
    type: 'info'
  }
)

const statusClass = computed(() => {
  return `base-status-tag--${props.type}`
})
</script>

<style scoped lang="scss">
.base-status-tag {
  display: inline-flex;
  align-items: center;
  height: 24px;
  padding: 0 8px;
  border-radius: 12px;
  font-size: 12px;
  line-height: 1;
  white-space: nowrap;

  &--success {
    color: #15803d;
    background-color: #dcfce7;
  }

  &--warning {
    color: #b45309;
    background-color: #fef3c7;
  }

  &--danger {
    color: #b91c1c;
    background-color: #fee2e2;
  }

  &--info {
    color: #475569;
    background-color: #e2e8f0;
  }
}
</style>
```

`scoped` 样式适合组件内部类名控制，但不代表完全不能影响子组件。如果需要覆盖第三方组件内部样式，应使用 `:deep()`，并且限制覆盖范围，避免污染全局。

示例：

```vue
<style scoped lang="scss">
.user-edit-dialog {
  :deep(.el-dialog__body) {
    padding-top: 12px;
  }

  :deep(.el-form-item:last-child) {
    margin-bottom: 0;
  }
}
</style>
```

使用 `:deep()` 时应注意：必须通过当前组件的外层类名包裹覆盖范围，例如 `.user-edit-dialog :deep(...)`，不要在组件中直接写全局级别的 `:deep(.el-button)`，否则容易影响当前组件内所有同类第三方组件。

### CSS Modules 使用

CSS Modules 用于生成局部唯一类名，适合样式较复杂、类名冲突风险较高，或者需要在脚本中动态组合样式类的组件。相比 `scoped`，CSS Modules 对类名隔离更强，但模板写法会稍微复杂。

推荐在以下场景使用 CSS Modules：复杂卡片组件、可复用布局组件、多状态展示组件、需要通过脚本动态读取类名的组件。

示例组件用于展示 CSS Modules 的基本用法。

文件位置：`src/components/base/BaseInfoCard.vue`

```vue
<template>
  <section :class="$style.card">
    <header :class="$style.header">
      <span :class="$style.title">{{ title }}</span>

      <slot name="extra" />
    </header>

    <main :class="$style.body">
      <slot />
    </main>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<style module lang="scss">
.card {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 1px 2px rgb(0 0 0 / 5%);
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 1px solid #e5e7eb;
}

.title {
  font-size: 15px;
  font-weight: 600;
  color: #111827;
}

.body {
  padding: 16px;
}
</style>
```

CSS Modules 中的类名通过 `$style.xxx` 使用，不会直接暴露为全局类名。它适合组件内部强隔离，但不适合需要让外部使用方直接覆盖的样式。如果组件需要开放样式扩展能力，应通过 Props、Slots、CSS 变量或明确的外层类名实现。

当需要动态切换 CSS Modules 类名时，可以在脚本中使用 `useCssModule`。

```vue
<template>
  <span :class="tagClass">
    {{ text }}
  </span>
</template>

<script setup lang="ts">
import { computed, useCssModule } from 'vue'

const props = defineProps<{
  text: string
  active: boolean
}>()

const styles = useCssModule()

const tagClass = computed(() => {
  return props.active ? styles.activeTag : styles.normalTag
})
</script>

<style module lang="scss">
.normalTag {
  color: #64748b;
}

.activeTag {
  color: #2563eb;
  font-weight: 600;
}
</style>
```

### 变量与主题适配

变量与主题适配用于统一管理颜色、边框、圆角、间距、字体等设计规范。项目中不推荐在大量组件中直接硬编码主题色，否则后续调整品牌色、暗黑模式或多主题时维护成本较高。

推荐使用 CSS 变量定义主题基础值，再在组件样式中引用。

文件位置：`src/styles/theme.scss`

```scss
/* 全局主题变量，建议在应用入口统一引入 */
:root {
  --app-color-primary: #2563eb;
  --app-color-success: #16a34a;
  --app-color-warning: #d97706;
  --app-color-danger: #dc2626;

  --app-text-primary: #111827;
  --app-text-regular: #374151;
  --app-text-secondary: #6b7280;

  --app-border-color: #e5e7eb;
  --app-bg-page: #f8fafc;
  --app-bg-card: #ffffff;

  --app-radius-base: 6px;
  --app-radius-large: 10px;
}

/* 暗黑主题示例，可通过 html[data-theme='dark'] 切换 */
html[data-theme='dark'] {
  --app-text-primary: #f9fafb;
  --app-text-regular: #e5e7eb;
  --app-text-secondary: #9ca3af;

  --app-border-color: #374151;
  --app-bg-page: #111827;
  --app-bg-card: #1f2937;
}
```

组件中使用主题变量。

文件位置：`src/components/base/BasePanel.vue`

```vue
<template>
  <section class="base-panel">
    <header v-if="title" class="base-panel__header">
      {{ title }}
    </header>

    <main class="base-panel__body">
      <slot />
    </main>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  title?: string
}>()
</script>

<style scoped lang="scss">
.base-panel {
  border: 1px solid var(--app-border-color);
  border-radius: var(--app-radius-large);
  background-color: var(--app-bg-card);
  color: var(--app-text-primary);

  &__header {
    padding: 14px 16px;
    border-bottom: 1px solid var(--app-border-color);
    font-weight: 600;
  }

  &__body {
    padding: 16px;
  }
}
</style>
```

主题变量适合维护项目级统一样式，不建议把所有组件细节都抽成变量。只有高频、稳定、跨组件共享的值才适合放入主题变量，例如主色、文本色、边框色、页面背景、圆角、阴影和间距基准。

### 样式隔离与覆盖

样式隔离与覆盖用于处理组件内部样式、父组件传入类名、第三方组件样式和全局样式之间的关系。组件封装时应优先保证内部样式稳定，同时为外部提供必要的扩展入口。

推荐做法如下：

| 场景             | 推荐方式                              |
| ---------------- | ------------------------------------- |
| 组件内部私有样式 | 使用 `scoped` 或 CSS Modules          |
| 组件主题适配     | 使用 CSS 变量                         |
| 第三方组件覆盖   | 使用外层类名 + `:deep()`              |
| 外部布局调整     | 支持 `class` 透传或外层包裹           |
| 多状态样式       | 使用状态类名或计算类名                |
| 全局通用样式     | 放入 `src/styles`，避免写在业务组件中 |

示例展示对 Element Plus 表格样式的局部覆盖。

文件位置：`src/views/user/components/UserTable.vue`

```vue
<template>
  <div class="user-table">
    <el-table :data="tableData" border>
      <el-table-column prop="name" label="用户名" />
      <el-table-column prop="email" label="邮箱" />
    </el-table>
  </div>
</template>

<script setup lang="ts">
interface UserInfo {
  id: number
  name: string
  email: string
}

defineProps<{
  tableData: UserInfo[]
}>()
</script>

<style scoped lang="scss">
.user-table {
  :deep(.el-table__header-wrapper th) {
    background-color: #f8fafc;
    color: #111827;
    font-weight: 600;
  }

  :deep(.el-table__body td) {
    color: #374151;
  }
}
</style>
```

覆盖第三方组件样式时，不建议直接在全局样式中写 `.el-table th`、`.el-dialog__body` 这类选择器。除非是项目级统一覆盖，否则都应放在具体组件中，并通过当前组件的外层类名限制作用范围。

## 组件封装实践

组件封装实践用于指导项目中常见组件类型的设计方式，包括基础展示组件、表单输入组件、弹窗组件、表格组件和业务组件。封装组件时应优先明确组件边界：组件接收什么、输出什么、内部维护什么、外部可以定制什么。

封装组件不应只追求“少写代码”，更重要的是降低重复逻辑、统一交互规范、减少页面复杂度，并让业务开发者以稳定方式使用组件。

### 基础展示组件

基础展示组件用于封装无业务或弱业务的展示能力，例如状态标签、空状态、信息卡片、标题栏、图标文本、描述列表等。此类组件应尽量避免直接依赖接口、路由、Store 或具体业务枚举。

示例展示一个通用空状态组件，支持标题、描述和操作插槽。

文件位置：`src/components/base/BaseEmpty.vue`

```vue
<template>
  <div class="base-empty">
    <div class="base-empty__title">{{ title }}</div>
    <div v-if="description" class="base-empty__description">
      {{ description }}
    </div>

    <div v-if="$slots.action" class="base-empty__action">
      <slot name="action" />
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
    description?: string
  }>(),
  {
    title: '暂无数据',
    description: ''
  }
)
</script>

<style scoped lang="scss">
.base-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 180px;
  color: var(--app-text-secondary);

  &__title {
    font-size: 15px;
    color: var(--app-text-regular);
  }

  &__description {
    margin-top: 8px;
    font-size: 13px;
  }

  &__action {
    margin-top: 16px;
  }
}
</style>
```

使用方式：

```vue
<template>
  <BaseEmpty title="暂无用户" description="当前筛选条件下没有用户数据">
    <template #action>
      <el-button type="primary" @click="handleCreate">
        新增用户
      </el-button>
    </template>
  </BaseEmpty>
</template>
```

基础展示组件应保持通用，不要在组件内部写死业务文案、接口请求或权限判断。业务差异可以通过 Props 或 Slots 传入。

### 表单输入组件

表单输入组件用于封装选择器、输入框、日期范围、用户选择、部门选择等可复用表单能力。此类组件通常需要支持 `v-model`，并通过 Props 控制禁用、占位符、清空、远程加载等能力。

示例展示一个用户选择组件，支持 `v-model`、加载状态和用户列表传入。

文件位置：`src/components/business/UserSelect.vue`

```vue
<template>
  <el-select
    :model-value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    :loading="loading"
    filterable
    clearable
    class="user-select"
    @update:model-value="handleChange"
  >
    <el-option
      v-for="item in options"
      :key="item.id"
      :label="item.name"
      :value="item.id"
    />
  </el-select>
</template>

<script setup lang="ts">
interface UserOption {
  id: number
  name: string
}

withDefaults(
  defineProps<{
    modelValue?: number | null
    options: UserOption[]
    placeholder?: string
    disabled?: boolean
    loading?: boolean
  }>(),
  {
    modelValue: null,
    placeholder: '请选择用户',
    disabled: false,
    loading: false
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: number | null]
  change: [value: number | null]
}>()

const handleChange = (value: number | null) => {
  emit('update:modelValue', value)
  emit('change', value)
}
</script>

<style scoped lang="scss">
.user-select {
  width: 100%;
}
</style>
```

使用方式：

```vue
<template>
  <UserSelect
    v-model="form.userId"
    :options="userOptions"
    :loading="loading"
    @change="handleUserChange"
  />
</template>
```

表单输入组件应优先兼容 `v-model`，这样可以自然接入 `el-form`、表单校验和父组件状态。组件内部如果需要加载远程数据，可以根据复杂度决定是内部请求，还是由父组件传入数据；通用组件更推荐由外部传入数据，业务组件可以封装请求逻辑。

### 弹窗组件

弹窗组件用于封装新增、编辑、详情、确认、选择等交互场景。弹窗组件应统一支持 `v-model` 控制显示状态，通过 `submit`、`close`、`success` 等事件向外通知结果。

弹窗组件封装时应重点处理三类状态：显示状态、表单状态和提交状态。显示状态由父组件控制，表单状态由弹窗内部维护，提交成功后通过事件通知父组件刷新数据。

示例展示一个基础弹窗组件，提供标题、宽度、默认内容和底部按钮插槽。

文件位置：`src/components/base/BaseDialog.vue`

```vue
<template>
  <el-dialog
    :model-value="modelValue"
    :title="title"
    :width="width"
    destroy-on-close
    @close="handleClose"
  >
    <slot />

    <template v-if="$slots.footer" #footer>
      <slot name="footer" />
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue: boolean
    title: string
    width?: string
  }>(),
  {
    width: '520px'
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  close: []
}>()

const handleClose = () => {
  emit('update:modelValue', false)
  emit('close')
}
</script>
```

业务弹窗可以基于基础弹窗继续封装。

文件位置：`src/views/user/components/UserEditDialog.vue`

```vue
<template>
  <BaseDialog
    :model-value="modelValue"
    title="编辑用户"
    width="560px"
    @update:model-value="handleVisibleChange"
  >
    <el-form :model="form" label-width="90px">
      <el-form-item label="用户名">
        <el-input v-model="form.name" placeholder="请输入用户名" />
      </el-form-item>

      <el-form-item label="邮箱">
        <el-input v-model="form.email" placeholder="请输入邮箱" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="handleVisibleChange(false)">取消</el-button>
      <el-button type="primary" :loading="submitLoading" @click="handleSubmit">
        保存
      </el-button>
    </template>
  </BaseDialog>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import BaseDialog from '@/components/base/BaseDialog.vue'

interface UserForm {
  id?: number
  name: string
  email: string
}

const props = defineProps<{
  modelValue: boolean
  user?: UserForm | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  submit: [form: UserForm]
}>()

const submitLoading = ref(false)

const form = reactive<UserForm>({
  name: '',
  email: ''
})

watch(
  () => props.modelValue,
  visible => {
    if (!visible) {
      return
    }

    Object.assign(form, props.user || { name: '', email: '' })
  }
)

const handleVisibleChange = (visible: boolean) => {
  emit('update:modelValue', visible)
}

const handleSubmit = async () => {
  submitLoading.value = true

  try {
    emit('submit', { ...form })
  } finally {
    submitLoading.value = false
  }
}
</script>
```

弹窗组件不应在内部强制刷新父组件表格，也不应直接操作父组件状态。推荐由弹窗触发 `submit` 或 `success` 事件，父组件决定关闭弹窗、刷新列表或继续停留。

### 表格组件

表格组件用于封装列表展示、加载状态、空状态、分页、操作列等高频能力。表格封装需要谨慎，过度封装容易导致灵活性下降。推荐先封装项目内稳定共性的部分，例如加载、分页、空数据、列配置，再通过 Slots 暴露自定义列能力。

示例展示一个基础表格组件，支持列配置、加载状态和操作插槽。

文件位置：`src/components/base/BaseTable.vue`

```vue
<template>
  <el-table
    v-loading="loading"
    :data="data"
    border
    class="base-table"
  >
    <el-table-column
      v-for="column in columns"
      :key="column.prop"
      :prop="column.prop"
      :label="column.label"
      :width="column.width"
      :min-width="column.minWidth"
    />

    <el-table-column
      v-if="$slots.action"
      label="操作"
      width="160"
      fixed="right"
    >
      <template #default="{ row }">
        <slot name="action" :row="row" />
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
interface TableColumn {
  prop: string
  label: string
  width?: string | number
  minWidth?: string | number
}

withDefaults(
  defineProps<{
    data: Record<string, unknown>[]
    columns: TableColumn[]
    loading?: boolean
  }>(),
  {
    loading: false
  }
)
</script>

<style scoped lang="scss">
.base-table {
  width: 100%;

  :deep(.el-table__header-wrapper th) {
    background-color: #f8fafc;
    color: #111827;
  }
}
</style>
```

使用方式：

```vue
<template>
  <BaseTable
    :data="tableData"
    :columns="columns"
    :loading="loading"
  >
    <template #action="{ row }">
      <el-button link type="primary" @click="handleEdit(row)">
        编辑
      </el-button>
      <el-button link type="danger" @click="handleDelete(row)">
        删除
      </el-button>
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BaseTable from '@/components/base/BaseTable.vue'

const loading = ref(false)

const columns = [
  { prop: 'name', label: '用户名', minWidth: 120 },
  { prop: 'email', label: '邮箱', minWidth: 180 },
  { prop: 'status', label: '状态', width: 100 }
]

const tableData = ref([
  {
    id: 1,
    name: '张三',
    email: 'zhangsan@example.com',
    status: '启用'
  }
])

const handleEdit = (row: unknown) => {
  console.log('编辑数据：', row)
}

const handleDelete = (row: unknown) => {
  console.log('删除数据：', row)
}
</script>
```

表格组件封装应保留扩展能力。对于复杂列渲染，例如状态标签、头像、按钮组、开关、进度条等，推荐使用插槽而不是把所有渲染规则写入列配置中。列配置适合简单文本展示，插槽适合复杂业务展示。

### 业务组件

业务组件用于封装稳定业务场景，例如用户选择器、订单状态标签、权限树、组织选择、文件上传、审批流程节点等。业务组件可以依赖业务枚举、接口和 Store，但应控制依赖范围，避免变成页面逻辑的集合。

业务组件设计应遵循以下原则：

| 原则         | 说明                               |
| ------------ | ---------------------------------- |
| 业务语义明确 | 组件名称直接体现业务能力           |
| 输入输出稳定 | Props 和 Emits 不应频繁变化        |
| 内部封装规则 | 状态映射、字段转换、权限判断可内聚 |
| 保留扩展入口 | 通过 Slots 或 Props 支持展示差异   |
| 避免页面耦合 | 不直接依赖某个页面的局部状态       |

示例展示一个订单状态标签业务组件。

文件位置：`src/components/business/OrderStatusTag.vue`

```vue
<template>
  <BaseStatusTag :text="statusText" :type="statusType" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BaseStatusTag from '@/components/base/BaseStatusTag.vue'

type OrderStatus = 'pending' | 'paid' | 'shipped' | 'closed'
type StatusType = 'success' | 'warning' | 'danger' | 'info'

const props = defineProps<{
  status: OrderStatus
}>()

const statusText = computed(() => {
  const textMap: Record<OrderStatus, string> = {
    pending: '待支付',
    paid: '已支付',
    shipped: '已发货',
    closed: '已关闭'
  }

  return textMap[props.status]
})

const statusType = computed<StatusType>(() => {
  const typeMap: Record<OrderStatus, StatusType> = {
    pending: 'warning',
    paid: 'success',
    shipped: 'info',
    closed: 'danger'
  }

  return typeMap[props.status]
})
</script>
```

业务组件的价值在于封装重复业务规则。页面中不应到处写订单状态映射、用户状态映射、权限状态判断等重复逻辑，而应沉淀到业务组件、业务枚举或 composable 中。

## 组件复用与抽象

组件复用与抽象用于规范公共逻辑的沉淀方式。Vue3 中不应只通过组件复用模板，也应通过 composable 复用状态逻辑、请求逻辑、副作用逻辑和业务计算逻辑。

复用优先级建议如下：模板结构复用使用组件；状态逻辑复用使用 composable；跨页面共享数据使用 Pinia；纯函数转换使用 utils；业务常量和枚举放入 constants 或 types。

### Composables 抽取

Composables 是组合式 API 下的逻辑复用方式，通常以 `useXxx` 命名。它可以封装响应式状态、计算属性、方法、监听器和生命周期，但不直接包含模板。

适合抽取为 composable 的场景包括：弹窗显示控制、表格查询、分页逻辑、异步请求、窗口尺寸监听、定时器、文件上传、权限判断、防抖搜索等。

示例封装通用弹窗状态。

文件位置：`src/composables/useDialog.ts`

```typescript
import { ref } from 'vue'

export function useDialog() {
  const visible = ref(false)

  const openDialog = () => {
    visible.value = true
  }

  const closeDialog = () => {
    visible.value = false
  }

  const toggleDialog = () => {
    visible.value = !visible.value
  }

  return {
    visible,
    openDialog,
    closeDialog,
    toggleDialog
  }
}
```

组件中使用：

```vue
<template>
  <el-button type="primary" @click="openDialog">
    打开弹窗
  </el-button>

  <UserEditDialog v-model="visible" />
</template>

<script setup lang="ts">
import { useDialog } from '@/composables/useDialog'
import UserEditDialog from './components/UserEditDialog.vue'

const {
  visible,
  openDialog,
  closeDialog
} = useDialog()
</script>
```

Composables 抽取时应注意边界。只要逻辑依赖具体页面结构或具体组件模板，就不适合抽成全局 composable；如果逻辑可以通过参数传入并返回稳定状态，则适合抽取。

### Hooks 命名规范

在 Vue3 项目中，通常将组合式函数称为 Composables，也有团队习惯称为 Hooks。无论使用哪种命名，函数都应统一使用 `useXxx` 格式，文件名与函数名保持一致。

推荐命名规范如下：

| 类型       | 命名示例                          | 说明                     |
| ---------- | --------------------------------- | ------------------------ |
| 通用状态   | `useDialog`、`useLoading`         | 控制弹窗、加载等基础状态 |
| 请求逻辑   | `useRequest`、`useAsyncState`     | 封装异步请求状态         |
| 表格逻辑   | `useTableQuery`、`usePagination`  | 封装分页和查询           |
| 表单逻辑   | `useFormReset`、`useFormSubmit`   | 封装表单初始化和提交     |
| 浏览器能力 | `useWindowSize`、`useScroll`      | 封装窗口、滚动、事件监听 |
| 业务逻辑   | `useUserOptions`、`usePermission` | 封装业务数据或权限判断   |

不推荐的命名包括：`common.ts`、`helper.ts`、`data.ts`、`handler.ts`。这些名称无法表达复用逻辑的具体能力，后期容易变成杂物文件。

示例展示一个窗口尺寸监听 Hook。

文件位置：`src/composables/useWindowSize.ts`

```typescript
import { onBeforeUnmount, onMounted, ref } from 'vue'

export function useWindowSize() {
  const width = ref(0)
  const height = ref(0)

  const updateSize = () => {
    width.value = window.innerWidth
    height.value = window.innerHeight
  }

  onMounted(() => {
    updateSize()
    window.addEventListener('resize', updateSize)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', updateSize)
  })

  return {
    width,
    height
  }
}
```

Hooks 命名应表达“这个函数提供什么能力”，而不是表达“在哪里使用”。例如 `useUserOptions` 比 `useUserPageData` 更适合复用；`useTableQuery` 比 `useList` 更清晰。

### 公共逻辑复用

公共逻辑复用需要根据逻辑类型选择合适位置。不是所有重复代码都应该抽成组件，也不是所有公共代码都应该放入 `utils`。错误的抽象会增加理解成本，甚至让简单逻辑变得难以修改。

推荐分类如下：

| 逻辑类型       | 推荐位置               | 示例                   |
| -------------- | ---------------------- | ---------------------- |
| 模板和交互复用 | `components`           | 表格、弹窗、选择器     |
| 响应式状态复用 | `composables`          | 查询、分页、弹窗状态   |
| 纯函数复用     | `utils`                | 日期格式化、金额格式化 |
| 常量枚举复用   | `constants` 或 `types` | 状态枚举、类型映射     |
| 全局共享数据   | `stores`               | 登录用户、权限、字典   |
| 接口请求复用   | `api`                  | 用户接口、订单接口     |

示例展示纯函数工具与 composable 的边界。金额格式化不依赖 Vue 响应式系统，应放入 `utils`。

文件位置：`src/utils/format.ts`

```typescript
export function formatAmount(value: number | string | null | undefined) {
  if (value === null || value === undefined || value === '') {
    return '0.00'
  }

  const amount = Number(value)

  if (Number.isNaN(amount)) {
    return '0.00'
  }

  return amount.toFixed(2)
}
```

而依赖响应式状态、计算属性或生命周期的逻辑，应放入 composable。

文件位置：`src/composables/useAmountText.ts`

```typescript
import { computed, type Ref } from 'vue'
import { formatAmount } from '@/utils/format'

export function useAmountText(amount: Ref<number | string | null | undefined>) {
  const amountText = computed(() => {
    return `¥${formatAmount(amount.value)}`
  })

  return {
    amountText
  }
}
```

组件中使用：

```vue
<template>
  <span>{{ amountText }}</span>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAmountText } from '@/composables/useAmountText'

const amount = ref(128.5)

const { amountText } = useAmountText(amount)
</script>
```

公共逻辑复用应避免“万能函数”和“万能组件”。如果一个 composable 参数越来越多、返回值越来越杂，说明它可能承担了过多职责，应拆分为多个更小的组合式函数。

### 组件参数化设计

组件参数化设计用于提升组件复用能力。通过合理的 Props、Emits 和 Slots，可以让组件适配不同场景，而不需要为每个页面复制一份相似组件。

参数化设计应遵循以下原则：

| 原则             | 说明                              |
| ---------------- | --------------------------------- |
| 参数表达业务意图 | 避免使用含义模糊的 `flag`、`type` |
| 默认值稳定       | 可选参数必须有明确默认行为        |
| 参数数量受控     | 参数过多时考虑拆分组件            |
| 复杂内容用 Slots | 不要把复杂模板塞进配置对象        |
| 行为通过事件暴露 | 不要在组件内部强绑定父组件行为    |

示例展示一个参数化的操作栏组件，支持标题、按钮控制和右侧扩展插槽。

文件位置：`src/components/base/BaseToolbar.vue`

```vue
<template>
  <div class="base-toolbar">
    <div class="base-toolbar__left">
      <span v-if="title" class="base-toolbar__title">
        {{ title }}
      </span>

      <slot name="left" />
    </div>

    <div class="base-toolbar__right">
      <el-button
        v-if="showRefresh"
        @click="handleRefresh"
      >
        刷新
      </el-button>

      <el-button
        v-if="showCreate"
        type="primary"
        @click="handleCreate"
      >
        {{ createText }}
      </el-button>

      <slot name="right" />
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
    showRefresh?: boolean
    showCreate?: boolean
    createText?: string
  }>(),
  {
    title: '',
    showRefresh: true,
    showCreate: true,
    createText: '新增'
  }
)

const emit = defineEmits<{
  refresh: []
  create: []
}>()

const handleRefresh = () => {
  emit('refresh')
}

const handleCreate = () => {
  emit('create')
}
</script>

<style scoped lang="scss">
.base-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  &__left,
  &__right {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__title {
    font-size: 16px;
    font-weight: 600;
    color: var(--app-text-primary);
  }
}
</style>
```

使用方式：

```vue
<template>
  <BaseToolbar
    title="用户管理"
    create-text="新增用户"
    @refresh="loadTableData"
    @create="handleCreate"
  >
    <template #right>
      <el-button @click="handleExport">
        导出
      </el-button>
    </template>
  </BaseToolbar>
</template>
```

组件参数化并不是参数越多越好。当一个组件出现大量类似 `showA`、`showB`、`enableX`、`modeY` 的参数时，应重新评估组件职责。如果不同场景差异过大，拆分为多个组件通常比继续增加参数更容易维护。



## 组件测试与验证

组件测试与验证用于确保组件在不同输入、事件触发、插槽内容和用户交互下都能保持预期行为。Vue3 组件测试不应只验证页面是否能正常打开，还应覆盖 Props 渲染、Emits 事件、Slots 扩展内容和关键交互流程。

在 Vue3 项目中，推荐使用 `Vitest`、`@vue/test-utils` 和 `jsdom` 进行组件单元测试。对于业务复杂组件，可以结合接口 Mock、Pinia 测试环境和快照测试，但核心仍然是验证组件输入输出是否稳定。

测试文件推荐与组件同目录或统一放入 `__tests__` 目录中：

```text
src
└── components
    └── business
        ├── UserSelect.vue
        └── __tests__
            └── UserSelect.test.ts
```

### Props 渲染验证

Props 渲染验证用于确认组件在接收不同外部参数时，模板内容、状态样式、按钮状态和默认值是否符合预期。对于基础组件和业务组件，Props 测试是最基础也是最重要的测试内容。

测试重点包括：必填 Props 是否正确渲染、可选 Props 是否有默认值、不同状态 Props 是否展示不同样式、空数据或异常数据是否能正常处理。

下面组件用于演示 Props 渲染测试，组件根据 `type` 展示不同状态类名。

文件位置：`src/components/base/BaseStatusTag.vue`

```vue
<template>
  <span class="base-status-tag" :class="statusClass">
    {{ text }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type StatusType = 'success' | 'warning' | 'danger' | 'info'

const props = withDefaults(
  defineProps<{
    text: string
    type?: StatusType
  }>(),
  {
    type: 'info'
  }
)

const statusClass = computed(() => {
  return `base-status-tag--${props.type}`
})
</script>
```

下面测试文件用于验证 `BaseStatusTag` 的文本渲染、默认类型和状态类型类名。

文件位置：`src/components/base/__tests__/BaseStatusTag.test.ts`

```typescript
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseStatusTag from '../BaseStatusTag.vue'

describe('BaseStatusTag', () => {
  it('应该正确渲染文本内容', () => {
    const wrapper = mount(BaseStatusTag, {
      props: {
        text: '启用'
      }
    })

    expect(wrapper.text()).toContain('启用')
  })

  it('未传入 type 时应该使用默认 info 类型', () => {
    const wrapper = mount(BaseStatusTag, {
      props: {
        text: '未知'
      }
    })

    expect(wrapper.classes()).toContain('base-status-tag--info')
  })

  it('传入 success 类型时应该渲染 success 类名', () => {
    const wrapper = mount(BaseStatusTag, {
      props: {
        text: '成功',
        type: 'success'
      }
    })

    expect(wrapper.classes()).toContain('base-status-tag--success')
  })
})
```

Props 测试不需要覆盖所有无意义组合，但应覆盖默认值、边界值、常用状态和业务关键状态。对于状态组件、表单组件、表格组件，Props 渲染测试应作为基础测试项保留。

### Emits 事件验证

Emits 事件验证用于确认组件在用户操作或内部逻辑触发时，是否向父组件发送了正确事件和正确参数。对于表单输入组件、弹窗组件、选择器组件和按钮操作组件，事件测试是判断组件输出边界是否稳定的关键。

测试重点包括：事件是否被触发、事件名称是否正确、事件参数是否符合类型约定、同一次交互是否触发多个必要事件。

下面组件用于演示 `v-model` 和 `change` 事件测试。

文件位置：`src/components/business/UserSelect.vue`

```vue
<template>
  <select :value="modelValue ?? ''" @change="handleChange">
    <option value="">请选择用户</option>

    <option
      v-for="item in options"
      :key="item.id"
      :value="item.id"
    >
      {{ item.name }}
    </option>
  </select>
</template>

<script setup lang="ts">
interface UserOption {
  id: number
  name: string
}

defineProps<{
  modelValue?: number | null
  options: UserOption[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: number | null]
  change: [value: number | null]
}>()

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  const value = target.value ? Number(target.value) : null

  emit('update:modelValue', value)
  emit('change', value)
}
</script>
```

下面测试文件用于验证选择用户后是否触发 `update:modelValue` 和 `change` 事件。

文件位置：`src/components/business/__tests__/UserSelect.test.ts`

```typescript
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import UserSelect from '../UserSelect.vue'

describe('UserSelect', () => {
  it('选择用户时应该触发 update:modelValue 和 change 事件', async () => {
    const wrapper = mount(UserSelect, {
      props: {
        modelValue: null,
        options: [
          { id: 1, name: '张三' },
          { id: 2, name: '李四' }
        ]
      }
    })

    await wrapper.find('select').setValue('2')

    expect(wrapper.emitted('update:modelValue')).toEqual([[2]])
    expect(wrapper.emitted('change')).toEqual([[2]])
  })

  it('清空选择时应该触发 null 值', async () => {
    const wrapper = mount(UserSelect, {
      props: {
        modelValue: 1,
        options: [
          { id: 1, name: '张三' }
        ]
      }
    })

    await wrapper.find('select').setValue('')

    expect(wrapper.emitted('update:modelValue')).toEqual([[null]])
    expect(wrapper.emitted('change')).toEqual([[null]])
  })
})
```

事件测试应关注组件对外输出，而不是组件内部如何实现。父组件依赖的是事件名称和事件参数，因此事件测试能有效防止后续重构破坏调用方。

### Slots 内容验证

Slots 内容验证用于确认组件是否正确渲染外部传入的插槽内容。对于卡片、弹窗、表格、布局容器等组件，插槽是主要扩展点，因此需要验证默认插槽、具名插槽和作用域插槽是否可用。

测试重点包括：默认插槽是否渲染、具名插槽是否出现在正确区域、作用域插槽是否能接收到组件暴露的数据。

下面组件用于演示具名插槽和默认插槽。

文件位置：`src/components/base/BaseCard.vue`

```vue
<template>
  <section class="base-card">
    <header v-if="$slots.header" class="base-card__header">
      <slot name="header" />
    </header>

    <main class="base-card__body">
      <slot />
    </main>

    <footer v-if="$slots.footer" class="base-card__footer">
      <slot name="footer" />
    </footer>
  </section>
</template>

<script setup lang="ts">
defineOptions({
  name: 'BaseCard'
})
</script>
```

下面测试文件用于验证 `header`、默认插槽和 `footer` 是否正确渲染。

文件位置：`src/components/base/__tests__/BaseCard.test.ts`

```typescript
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseCard from '../BaseCard.vue'

describe('BaseCard', () => {
  it('应该正确渲染默认插槽内容', () => {
    const wrapper = mount(BaseCard, {
      slots: {
        default: '<div class="content">主体内容</div>'
      }
    })

    expect(wrapper.find('.content').exists()).toBe(true)
    expect(wrapper.text()).toContain('主体内容')
  })

  it('应该正确渲染 header 和 footer 插槽', () => {
    const wrapper = mount(BaseCard, {
      slots: {
        header: '<div class="header-content">标题区域</div>',
        default: '<div>主体内容</div>',
        footer: '<div class="footer-content">底部区域</div>'
      }
    })

    expect(wrapper.find('.header-content').exists()).toBe(true)
    expect(wrapper.find('.footer-content').exists()).toBe(true)
    expect(wrapper.text()).toContain('标题区域')
    expect(wrapper.text()).toContain('底部区域')
  })
})
```

对于作用域插槽，应验证插槽是否能接收到内部暴露的数据。例如表格组件向 `action` 插槽暴露 `row`，测试中应确认外部插槽可以读取 `row.name` 或 `row.id`。

### 交互行为验证

交互行为验证用于确认用户点击、输入、选择、提交、关闭等行为是否能触发正确结果。交互测试更接近真实使用场景，适合覆盖表单提交、弹窗关闭、按钮点击、搜索重置、分页切换等逻辑。

测试重点包括：点击按钮后状态是否变化、输入内容后是否更新、提交前是否校验、异步加载状态是否正确、异常分支是否能被处理。

下面组件用于演示搜索表单的交互行为测试。

文件位置：`src/views/user/components/SearchPanel.vue`

```vue
<template>
  <form @submit.prevent="handleSearch">
    <input
      v-model="form.keyword"
      class="keyword-input"
      placeholder="请输入用户名"
    />

    <button class="search-button" type="submit">
      查询
    </button>

    <button class="reset-button" type="button" @click="handleReset">
      重置
    </button>
  </form>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

interface SearchForm {
  keyword: string
}

const emit = defineEmits<{
  search: [params: SearchForm]
  reset: []
}>()

const form = reactive<SearchForm>({
  keyword: ''
})

const handleSearch = () => {
  emit('search', { ...form })
}

const handleReset = () => {
  form.keyword = ''
  emit('reset')
}
</script>
```

下面测试文件用于验证输入、查询和重置行为。

文件位置：`src/views/user/components/__tests__/SearchPanel.test.ts`

```typescript
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import SearchPanel from '../SearchPanel.vue'

describe('SearchPanel', () => {
  it('输入关键字后点击查询应该触发 search 事件', async () => {
    const wrapper = mount(SearchPanel)

    await wrapper.find('.keyword-input').setValue('张三')
    await wrapper.find('.search-button').trigger('click')

    expect(wrapper.emitted('search')).toEqual([
      [
        {
          keyword: '张三'
        }
      ]
    ])
  })

  it('点击重置后应该清空输入并触发 reset 事件', async () => {
    const wrapper = mount(SearchPanel)

    const input = wrapper.find<HTMLInputElement>('.keyword-input')
    await input.setValue('张三')
    await wrapper.find('.reset-button').trigger('click')

    expect(input.element.value).toBe('')
    expect(wrapper.emitted('reset')).toBeTruthy()
  })
})
```

交互行为测试应覆盖用户真实路径，而不是只检查内部变量。组件内部实现可能重构，但用户行为和对外结果应保持稳定。

## 组件文档与示例

组件文档与示例用于说明组件的使用方式、参数、事件、插槽和典型场景。对于基础组件、业务组件和组件库组件，文档是保证团队协作效率的重要部分。没有文档的组件即使实现可复用，也很难被其他开发者正确使用。

组件文档应至少包含：组件用途、引入方式、基础示例、Props 说明、Events 说明、Slots 说明和注意事项。对于复杂组件，还应包含异步加载示例、表单校验示例、权限控制示例或边界场景说明。

### 使用说明

使用说明用于介绍组件解决什么问题、适合在哪些场景使用、如何引入和注册。说明应简洁直接，避免只描述组件名称，不说明使用边界。

推荐文档结构如下：

~~~markdown
# UserSelect 用户选择组件

`UserSelect` 用于在表单或筛选区域中选择系统用户，支持 `v-model` 双向绑定、禁用状态、加载状态和用户选项传入。该组件只负责用户选项展示和选择事件输出，不负责用户数据请求。

## 基础用法

文件位置：`src/views/user/UserForm.vue`

```vue
<template>
  <UserSelect
    v-model="form.userId"
    :options="userOptions"
    placeholder="请选择负责人"
    @change="handleUserChange"
  />
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import UserSelect from '@/components/business/UserSelect.vue'

const form = reactive({
  userId: null as number | null
})

const userOptions = ref([
  { id: 1, name: '张三' },
  { id: 2, name: '李四' }
])

const handleUserChange = (userId: number | null) => {
  console.log('当前选择用户：', userId)
}
</script>
使用说明应明确组件是否内部请求数据。如果组件不负责请求，应说明调用方需要传入 `options`；如果组件内部请求，应说明请求时机、缓存策略和异常展示方式。

### 参数说明

参数说明用于列出组件支持的 Props。Props 文档应包含参数名、类型、默认值、是否必填和说明。对于业务枚举值，应列出可选值含义，避免使用方只能查看源码理解参数。

推荐 Props 说明格式如下：

| 参数名 | 类型 | 默认值 | 必填 | 说明 |
|---|---|---:|---|---|
| `modelValue` | `number \| null` | `null` | 否 | 当前选中的用户 ID |
| `options` | `UserOption[]` | `[]` | 是 | 用户选项列表 |
| `placeholder` | `string` | `请选择用户` | 否 | 选择框占位文本 |
| `disabled` | `boolean` | `false` | 否 | 是否禁用 |
| `loading` | `boolean` | `false` | 否 | 是否显示加载状态 |

类型定义建议同步写入文档，方便使用方直接理解数据结构。

```typescript id="u38nn1"
interface UserOption {
  id: number
  name: string
}
~~~

Props 文档应与组件源码保持一致。新增、删除或修改 Props 时，必须同步更新文档，避免文档示例和实际组件能力不一致。

### 事件说明

事件说明用于列出组件通过 Emits 向外暴露的事件。事件文档应包含事件名、触发时机、参数和使用说明。对于 `v-model` 组件，必须说明 `update:modelValue`。

推荐 Events 说明格式如下：

| 事件名              | 参数                   | 触发时机                 |
| ------------------- | ---------------------- | ------------------------ |
| `update:modelValue` | `value: number | null` | 用户选择或清空选项时触发 |
| `change`            | `value: number | null` | 选中值发生变化后触发     |
| `clear`             | 无                     | 用户清空选择时触发       |

事件示例：

```vue
<template>
  <UserSelect
    v-model="userId"
    :options="userOptions"
    @change="handleChange"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const userId = ref<number | null>(null)

const userOptions = [
  { id: 1, name: '张三' },
  { id: 2, name: '李四' }
]

const handleChange = (value: number | null) => {
  console.log('用户选择变化：', value)
}
</script>
```

事件命名应保持语义稳定。不要在文档中暴露组件内部实现细节，例如 `reloadParent`、`setDialogFalse` 这类事件名，应改为 `success`、`close`、`submit`、`change` 等外部语义。

### 插槽说明

插槽说明用于描述组件可以由外部自定义的区域。插槽文档应包含插槽名、说明、作用域参数和使用示例。对于表格、卡片、弹窗、列表类组件，插槽文档尤其重要。

推荐 Slots 说明格式如下：

| 插槽名    | 作用域参数 | 说明           |
| --------- | ---------- | -------------- |
| `default` | 无         | 默认内容区域   |
| `header`  | 无         | 头部扩展区域   |
| `footer`  | 无         | 底部操作区域   |
| `action`  | `{ row }`  | 表格行操作区域 |

作用域插槽示例：

```vue
<template>
  <BaseTable :data="tableData" :columns="columns">
    <template #action="{ row }">
      <el-button link type="primary" @click="handleEdit(row)">
        编辑
      </el-button>
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
const columns = [
  { prop: 'name', label: '用户名' },
  { prop: 'email', label: '邮箱' }
]

const tableData = [
  { id: 1, name: '张三', email: 'zhangsan@example.com' }
]

const handleEdit = (row: unknown) => {
  console.log('编辑行数据：', row)
}
</script>
```

插槽文档应明确哪些区域可以自定义，哪些区域不建议修改。如果组件的展示差异很大，应优先使用插槽扩展，而不是继续增加大量 Props 控制模板细节。

### 示例代码

示例代码用于展示组件在真实业务场景中的使用方式。示例应优先提供可复制、可运行、接近项目实际场景的代码，而不是只展示孤立标签。

推荐至少提供以下几类示例：基础使用、禁用状态、加载状态、插槽扩展、表单集成、事件处理。

下面示例展示用户选择组件在表单中的完整使用方式。

文件位置：`src/views/user/UserFormDemo.vue`

```vue
<template>
  <el-form :model="form" label-width="100px">
    <el-form-item label="负责人">
      <UserSelect
        v-model="form.ownerId"
        :options="userOptions"
        :loading="loading"
        placeholder="请选择负责人"
        @change="handleOwnerChange"
      />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="handleSubmit">
        提交
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import UserSelect from '@/components/business/UserSelect.vue'

interface UserOption {
  id: number
  name: string
}

const loading = ref(false)

const form = reactive({
  ownerId: null as number | null
})

const userOptions = ref<UserOption[]>([])

const loadUserOptions = async () => {
  loading.value = true

  try {
    // 实际项目中这里替换为用户列表接口
    userOptions.value = [
      { id: 1, name: '张三' },
      { id: 2, name: '李四' }
    ]
  } finally {
    loading.value = false
  }
}

const handleOwnerChange = (value: number | null) => {
  console.log('负责人变化：', value)
}

const handleSubmit = () => {
  console.log('提交表单：', { ...form })
}

onMounted(() => {
  loadUserOptions()
})
</script>
```

示例代码应跟随组件能力变化及时更新。组件文档中不建议保留已经废弃的 Props、事件或旧用法，否则会导致项目中出现多套调用风格。

## 组件发布与维护

组件发布与维护用于规范组件如何导出、如何记录变更、如何处理兼容性以及如何长期维护。对于基础组件和业务组件，开发完成并不代表结束，后续还需要持续维护文档、测试、版本变更和使用约束。

如果项目内部存在组件库，应制定统一导出方式和版本规范。如果只是业务项目中的内部组件，也应保持清晰的目录、命名和变更记录，避免公共组件被随意修改后影响多个页面。

### 组件导出方式

组件导出方式用于统一组件的引用入口。对于项目级公共组件，推荐在组件目录中提供 `index.ts` 统一导出，调用方通过稳定路径引入组件，避免直接依赖深层文件路径。

基础组件目录示例：

```text
src
└── components
    └── base
        ├── BaseCard.vue
        ├── BaseDialog.vue
        ├── BaseEmpty.vue
        ├── BaseTable.vue
        └── index.ts
```

统一导出基础组件。

文件位置：`src/components/base/index.ts`

```typescript
export { default as BaseCard } from './BaseCard.vue'
export { default as BaseDialog } from './BaseDialog.vue'
export { default as BaseEmpty } from './BaseEmpty.vue'
export { default as BaseTable } from './BaseTable.vue'
```

业务组件目录示例：

```text
src
└── components
    └── business
        ├── OrderStatusTag.vue
        ├── UserSelect.vue
        └── index.ts
```

统一导出业务组件。

文件位置：`src/components/business/index.ts`

```typescript
export { default as OrderStatusTag } from './OrderStatusTag.vue'
export { default as UserSelect } from './UserSelect.vue'
```

使用方式：

```vue
<script setup lang="ts">
import { BaseCard } from '@/components/base'
import { UserSelect } from '@/components/business'
</script>
```

统一导出可以降低调用方对组件内部文件结构的依赖。后续组件文件位置调整时，只要导出入口不变，调用方通常不需要修改。

### 版本变更记录

版本变更记录用于说明组件在迭代过程中发生了哪些变化，包括新增能力、问题修复、兼容性调整和破坏性变更。对于多人协作项目，公共组件变更必须可追踪，否则容易出现调用方不知道组件行为已变化的问题。

推荐在组件库或公共组件目录维护 `CHANGELOG.md`：

文件位置：`src/components/CHANGELOG.md`

```markdown
# 组件变更记录

## 1.2.0

### 新增

- `UserSelect` 新增 `loading` 参数，用于展示远程加载状态。
- `BaseTable` 新增 `action` 作用域插槽，用于自定义行操作区域。

### 修复

- 修复 `BaseDialog` 在关闭时未触发 `close` 事件的问题。

### 调整

- `BaseStatusTag` 的默认类型由 `success` 调整为 `info`。

## 1.1.0

### 新增

- 新增 `BaseEmpty` 空状态组件。
- 新增 `OrderStatusTag` 订单状态标签组件。
```

变更记录应区分新增、修复、调整和破坏性变更。对于破坏性变更，应明确迁移方式。

破坏性变更示例：

~~~markdown
## 2.0.0

### 破坏性变更

- `UserSelect` 的 `value` 参数已改为 `modelValue`，事件 `input` 已改为 `update:modelValue`。

迁移前：

```vue
<UserSelect :value="userId" @input="userId = $event" />
~~~

迁移后：

~~~vue
<UserSelect v-model="userId" />
变更记录不应只写“优化组件”“修复问题”这类模糊描述，应说明具体组件、具体变更点和影响范围。

### 兼容性处理

兼容性处理用于降低组件升级对已有业务页面的影响。公共组件一旦被多个页面使用，就不能随意删除 Props、修改事件名或改变默认行为。确实需要调整时，应提供过渡方案。

兼容性处理原则如下：

| 场景 | 推荐处理方式 |
|---|---|
| 新增能力 | 增加可选 Props 或 Slots，保持默认行为不变 |
| 修改默认行为 | 先提供开关参数，再逐步迁移 |
| 删除旧参数 | 保留一个版本并输出警告，后续再删除 |
| 事件名调整 | 新旧事件短期同时支持 |
| 样式调整 | 避免影响组件外部布局 |
| 类型调整 | 提供明确迁移说明 |

示例展示在组件中兼容旧参数 `value`，同时推荐使用 `modelValue`。

文件位置：`src/components/business/UserSelect.vue`

```vue id="q545c7"
<template>
  <select :value="currentValue ?? ''" @change="handleChange">
    <option value="">请选择用户</option>

    <option
      v-for="item in options"
      :key="item.id"
      :value="item.id"
    >
      {{ item.name }}
    </option>
  </select>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface UserOption {
  id: number
  name: string
}

const props = defineProps<{
  modelValue?: number | null
  value?: number | null
  options: UserOption[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: number | null]
  input: [value: number | null]
  change: [value: number | null]
}>()

const currentValue = computed(() => {
  return props.modelValue ?? props.value ?? null
})

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  const value = target.value ? Number(target.value) : null

  emit('update:modelValue', value)
  emit('input', value)
  emit('change', value)
}
</script>
~~~

这种兼容写法只适合迁移期使用。迁移完成后，应在变更记录中明确删除旧参数的版本，并清理兼容代码，避免长期维护双套 API。

### 维护规范

维护规范用于保证公共组件在长期迭代中保持稳定、清晰和可验证。组件维护不仅包括代码修改，还包括文档、测试、示例、类型定义和变更记录同步更新。

公共组件修改前应确认以下内容：

| 检查项                  | 说明                                |
| ----------------------- | ----------------------------------- |
| 是否影响已有调用方      | 检查组件被哪些页面或模块使用        |
| 是否改变 Props 默认行为 | 默认行为变化通常影响范围较大        |
| 是否改变 Emits 参数     | 事件参数变化会影响父组件逻辑        |
| 是否改变 Slots 结构     | 插槽结构变化会影响自定义渲染        |
| 是否需要补充测试        | 新能力和修复点都应有测试            |
| 是否更新文档            | Props、Events、Slots 和示例必须同步 |
| 是否记录变更            | 公共组件变更应写入 `CHANGELOG.md`   |

组件维护推荐流程如下：

```text
1. 确认组件使用范围
2. 判断是否属于破坏性变更
3. 修改组件实现
4. 补充或更新单元测试
5. 更新组件文档和示例
6. 更新变更记录
7. 回归使用该组件的关键页面
```

公共组件不建议为了某一个页面的临时需求直接增加强业务参数。如果需求只服务于单个页面，应优先在页面局部封装；如果需求具有通用价值，再设计为公共组件能力。

推荐维护标准如下：

| 组件类型 | 维护要求                                        |
| -------- | ----------------------------------------------- |
| 基础组件 | API 稳定、样式统一、测试覆盖核心 Props 和 Slots |
| 表单组件 | 支持 `v-model`、校验兼容、事件清晰              |
| 弹窗组件 | 支持显示控制、关闭事件、提交状态                |
| 表格组件 | 保留插槽扩展能力，避免过度配置化                |
| 业务组件 | 业务语义明确，接口和状态依赖可控                |

组件维护的核心原则是：公共组件优先保持稳定，新增能力优先保持向后兼容，复杂差异优先通过 Slots 扩展，破坏性调整必须提供迁移说明。
