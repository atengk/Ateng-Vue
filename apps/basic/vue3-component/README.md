# Vue3 Component 组件

## Component 的角色认知（先建立正确心智）

在 Vue3 项目里，**Component 不是“随便拆的 UI 块”**，而是有明确分工的。
如果一开始角色认知是错的，后面一定会出现：组件臃肿、复用失败、维护成本爆炸。

------

### Component 在项目中的真实定位

在真实项目中，组件大致分为两类：

- **`views`：页面级组件**
  - 路由直接加载的组件
  - 代表一个“页面”或“业务入口”
- **`components`：可复用功能组件**
  - 被多个页面或模块使用
  - 封装明确的 UI + 行为能力

> 一个简单判断标准：
> **是否被 router 直接引用**，决定它是不是 `views`。

------

### 为什么 **views ≠ components**

这是很多新项目一开始就犯错的地方。

#### views 的本质：页面容器

- 承载路由
- 组织页面级数据
- 编排多个子组件
- 处理页面流程（加载、提交、跳转）

👉 views 更像是**“导演”**，而不是演员。

#### components 的本质：能力单元

- 解决一个明确问题
- 封装一段可复用逻辑
- 对外只暴露必要的 props / emits

👉 components 更像是**“零件”或“工具”**。

如果你发现某个组件：

- 既处理接口请求
- 又写了复杂 UI
- 还负责路由跳转

那它**99% 是被放错层级了**。

------

### 页面组件该做什么 / 不该做什么

#### 页面组件（views）应该做的事

- 页面级数据获取（接口请求）
- 业务流程控制
  - 提交
  - 跳转
  - 条件渲染
- 组件之间的数据证明与组合

```vue
<!-- views/UserList/index.vue -->
<UserSearch @search="onSearch" />
<UserTable :list="list" @edit="onEdit" />
<UserDialog v-model:visible="dialogVisible" />
```

这里 views 的职责是：**“把这些东西拼起来”**。

------

#### 页面组件（views）不该做的事

- 不该写复杂 UI 细节
- 不该关心按钮内部怎么布局
- 不该维护组件内部状态细节

如果你在 views 里看到：

- 大量样式
- 复杂 DOM 结构
- 组件内部逻辑判断

👉 说明这个逻辑**应该下沉到 components**。

------

### 常见目录结构（认知即可）

这是一个**被大量项目验证过的结构**，不追求花样，只追求清晰。

```text
src/
├─ views/
│  └─ user/
│     ├─ index.vue              页面入口（路由组件）
│     └─ components/            仅服务于该页面的私有组件
│        ├─ UserSearch.vue
│        └─ UserTable.vue
│
├─ components/
│  └─ common/
│     ├─ BaseButton.vue
│     ├─ BaseDialog.vue
│     └─ BaseTable.vue
```

#### 这里的关键认知

- `views/xxx/components`
  - **页面私有**
  - 不考虑跨页面复用
- `src/components/common`
  - **全项目可复用**
  - 设计要克制、接口要稳定

> 能放在 `views/xxx/components` 的，**不要急着抽成公共组件**。
> 这是很多项目过早抽象导致复杂度上升的根源。

------

## 最基础的 Component 使用（views 调 components）

这一部分的目标只有一个：
**让你在 views 里“自然地”使用组件，而不是把组件当成黑魔法。**

------

### 本地组件注册（最常见方式）

在真实项目中，**99% 的组件都是本地注册**，而不是全局注册。

```ts
import UserTable from '@/components/UserTable.vue'
```

在 `views` 中直接使用：

```vue
<UserTable :list="list" @edit="onEdit" />
```

这里有几个很重要的隐含规则：

- views 明确知道自己用了哪些组件
- 组件依赖是**显式的、可追踪的**
- 删除页面时，不会留下“幽灵组件依赖”

> 本地注册 ≠ 麻烦
> 本地注册 = **可维护性**

------

### 为什么 views 调 components 是最健康的结构

这种关系有几个天然优势：

- 页面结构一眼可读
- 组件来源清晰
- 不会出现“这个组件从哪来的？”的困惑

当你看到一个 views 文件顶部的 import：

```ts
import UserSearch from './components/UserSearch.vue'
import UserTable from './components/UserTable.vue'
```

你可以立刻判断：

- 这是一个页面
- 它由哪些功能模块组成
- 哪些组件是页面私有的

------

### 组件命名规范（不是为了好看）

#### 文件名使用 PascalCase

```text
UserTable.vue
UserSearchForm.vue
BaseDialog.vue
```

原因不是“官方推荐”，而是：

- 和组件本身是一个“类型”概念一致
- 在 IDE 中更容易区分普通文件与组件
- 和 TypeScript 类型命名习惯统一

------

#### 模板中支持 PascalCase / kebab-case

以下两种写法在 Vue3 中都是合法的：

```vue
<UserTable />
<user-table />
```

项目级推荐：

- **单文件组件内：使用 PascalCase**
- **模板片段 / 动态场景：kebab-case**

核心原则只有一个：
👉 **统一，不要混用。**

------

### `<script setup>` 下的组件使用规则

这是 Vue3 项目里最容易被误解的一点。

#### 不需要 `components: {}`

在 `<script setup>` 中：

```vue
<script setup lang="ts">
import UserTable from './components/UserTable.vue'
</script>

<template>
  <UserTable />
</template>
```

你并没有显式注册组件，但它却能用。

------

#### 为什么可以这样用（认知级）

原因只有一句话：

> **`<script setup>` 是编译期语法，不是运行期语法。**

Vue 在编译阶段会：

- 扫描 `import` 的组件
- 自动分析哪些变量被当作组件使用
- 注入到模板的组件上下文中

所以你写的不是：

```js
components: { UserTable }
```

而是：

> “**这个组件在这个文件里被使用了**”

------

### 这一步的正确心智模型

你需要建立的不是“注册组件”的概念，而是：

> **组件是一个普通模块，被 import 进来就能用。**

- 没有魔法
- 没有隐式全局状态
- 没有神秘注册表

这也是为什么 Vue3 + TypeScript 项目里，
**组件的使用方式越来越像普通 TS 模块**。

------

好，这一节是**Component 真正开始有“边界感”的地方**，我继续用**项目实战视角**来讲。

------

## Props：views 向 Component 传数据（核心）

一句话先立住心智：

> **Props 是父组件给子组件的“只读输入”。**
> 它不是状态，不是缓存，更不是临时变量。

------

### Props 基础用法

#### 基本类型 props

最常见、也是最安全的用法：

```vue
<UserCard name="Tom" :age="18" />
```

子组件接收：

```ts
const props = defineProps<{
  name: string
  age: number
}>()
```

这里已经体现出一个重要点：

- props 是**明确声明的**
- 不存在“随便传、随便用”

------

#### 复杂类型 props（object / array）

真实项目里，props 往往是对象或数组：

```vue
<UserTable :list="userList" />
interface User {
  id: number
  name: string
}

const props = defineProps<{
  list: User[]
}>()
```

这里的认知重点不是写法，而是：

- **组件不关心数据从哪来**
- 只关心“我接收的数据长什么样”

------

#### Boolean props 与默认值

Boolean props 在模板里经常被简写：

```vue
<BaseDialog visible />
```

等价于：

```vue
<BaseDialog :visible="true" />
```

如果你需要默认值：

```ts
const props = withDefaults(
  defineProps<{
    visible?: boolean
  }>(),
  {
    visible: false
  }
)
```

这在**基础组件**中非常常见。

------

### TypeScript + `defineProps`

这是 Vue3 项目和 Vue2 最大的断代差异之一。

------

#### `defineProps<T>()` 的核心价值

```ts
const props = defineProps<{
  title: string
  loading?: boolean
}>()
```

你立刻获得：

- 编译期类型校验
- 模板内自动类型提示
- 父组件传参错误即时暴露

> Props 是组件的 **API**，而不是“随便收参数”。

------

#### 必传与可选 props 的区分

```ts
defineProps<{
  id: number          // 必传
  disabled?: boolean // 可选
}>()
```

这在团队协作中非常重要：

- 必传 = 不给就报错
- 可选 = 组件内部要考虑默认行为

**不要滥用 `?`**，否则组件会变成“什么都能传，也什么都不保证”。

------

#### props 类型约束的推荐写法

项目级推荐顺序：

1. **优先 interface / type**
2. 再用于 `defineProps`

```ts
interface UserTableProps {
  list: User[]
  loading?: boolean
}

const props = defineProps<UserTableProps>()
```

好处是：

- 类型可复用
- 可读性强
- 更像“组件说明书”

------

### props 的单向数据流原则

这是很多 Vue 初学者**最容易踩坑**的地方。

------

#### 为什么不能直接修改 props

```ts
props.title = 'new title' // ❌
```

原因不是“Vue 不让你改”，而是：

- props 属于父组件
- 子组件修改会导致数据源混乱
- 页面状态不可预测

一句话总结：

> **谁创建数据，谁负责修改数据。**

------

### 正确的处理方式

#### 方式一：拷贝为本地状态

适合场景：

- 表单编辑
- 草稿态数据
- 需要临时修改但不立刻提交

```ts
const localForm = ref({ ...props.form })
```

注意：
这是“**一次性拷贝**”，不是双向绑定。

------

#### 方式二：通过 emit 通知父级

最推荐、也是最标准的方式：

```ts
const emit = defineEmits<{
  (e: 'update:title', value: string): void
}>()

emit('update:title', 'new title')
```

父组件决定：

- 是否接收
- 如何处理
- 是否更新 props

------

## Emits：Component 向 views 通知事件（核心）

先给一句**总原则**：

> **子组件不改数据，只表达“发生了什么”。**
> 改不改、怎么改，永远交给 views。

------

### 基础 emit 用法

#### `defineEmits`

在 `<script setup>` 中，子组件通过 `defineEmits` 声明自己**能抛出哪些事件**。

**不传参数的情况（只通知行为）：**

```ts
const emit = defineEmits<{
  (e: 'submit'): void
}>()
```

**传参数的情况（通知行为 + 携带结果）：**

```ts
const emit = defineEmits<{
  (e: 'change', value: string): void
}>()
```

这一步非常重要：

- 事件是**显式声明的**
- 事件名和参数在编译期就能校验
- views 中可以获得完整的类型提示
- **是否传参，与是否使用 `update:` 无关**

------

#### 子组件触发，views 监听

子组件中：

```ts
emit('submit')

// 有参数的情况
emit('change', value)
```

views 中监听：

```vue
<UserForm @submit="handleSubmit" />
const handleSubmit = () => {
  // 页面级逻辑
}
<UserInput @change="handleChange" />
const handleChange = (value: string) => {
  name.value = value
}
```

这里的分工非常清晰：

- **组件**：只负责抛出事件和数据
- **views**：决定是否修改状态、如何修改

> 这里即使传了参数，也**不需要**使用 `update:`。

------

### 事件命名规范

事件名不是随便起的，它直接决定组件的**语义清晰度与可维护性**。

------

#### `update:xxx`（状态同步专用）

`update:xxx` 是 Vue 的**约定写法**，**只用于一种场景**：

> **子组件想请求父组件同步某个 props 的值**

```ts
const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
}>()

emit('update:visible', false)
```

父组件中：

```vue
<BaseDialog v-model:visible="visible" />
```

等价于：

```vue
<BaseDialog
  :visible="visible"
  @update:visible="val => visible = val"
/>
```

这类事件的特点：

- 一定用于 **props / v-model**
- 一定携带新值作为参数
- 不表达业务含义
- **不等于子组件直接修改数据**

> 是否使用 `update:`
> **只取决于是不是在同步 props，而不是有没有参数。**

------

#### `submit / change` 等语义化命名

用于表达**行为或结果**，而不是状态同步：

```ts
const emit = defineEmits<{
  (e: 'submit', data: FormData): void
  (e: 'change', value: string): void
}>()
```

这种事件适合：

- 表单提交
- 输入变化
- 用户操作
- 业务行为通知

原则是：

> **事件名描述“发生了什么”，而不是“要父组件怎么做”。**

------

### 与 props 组合形成完整交互模型

这是组件设计中**最重要的一条心智模型**。

------

#### 父 → 子：数据下发（props）

```vue
<UserForm :model="formData" />
```

- 数据来源在父组件
- 子组件只读取，不直接修改

------

#### 子 → 父：事件通知（emit）

```ts
emit('submit', formValue)
```

- 子组件只表达结果
- 父组件决定是否更新状态、调用接口或跳转页面

------

#### 明确组件职责边界

一个健康的组件应该：

- 不持有页面级状态
- 不调用接口
- 不操作路由
- 不关心完整业务流程

而 views 负责：

- 状态管理
- 接口调用
- 路由跳转
- 组件之间的协作

------

## v-model 在 Component 中的使用（高频）

先给一句**核心认知**：

> **`v-model` 不是新机制，只是 `props + emit(update:xxx)` 的语法糖。**
> 你永远可以不用它，但理解它能让代码更干净。

------

### 单个 v-model

这是**最常见、最基础**的用法。

------

#### `modelValue`

当组件被使用成这样：

```vue
<BaseInput v-model="name" />
```

**Vue 会自动做三件事：**

```vue
<BaseInput
  :modelValue="name"
  @update:modelValue="val => name = val"
/>
```

所以在**子组件中**：

```ts
const props = defineProps<{
  modelValue: string
}>()
```

- `modelValue` 本质是一个 **props**
- 值来自父组件
- 子组件不能直接修改

------

#### `update:modelValue`

当子组件内部发生变化时：

```ts
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

emit('update:modelValue', newValue)
```

此时发生的事情是：

- 子组件 → 抛出新值
- 父组件 → 更新 `name`
- `name` 再作为 props 回流到子组件

> **这就是 v-model 的完整闭环。**

------

### 多个 v-model

当一个组件需要**同步多个状态**时，使用**具名 v-model**。

------

#### `v-model:title`

父组件中：

```vue
<BaseDialog v-model:title="title" />
```

等价于：

```vue
<BaseDialog
  :title="title"
  @update:title="val => title = val"
/>
```

子组件中：

```ts
const props = defineProps<{
  title: string
}>()

const emit = defineEmits<{
  (e: 'update:title', value: string): void
}>()
```

触发更新：

```ts
emit('update:title', '新标题')
```

------

#### `v-model:visible`

父组件中：

```vue
<BaseDialog v-model:visible="visible" />
```

子组件中：

```ts
const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
}>()
emit('update:visible', false)
```

这种写法的好处是：

- 每个状态语义清晰
- 不需要传一个“大对象”
- 特别适合 **弹窗 / 抽屉 / 表单组件**

------

### v-model 的本质认知

这一部分**非常重要**，决定你以后组件会不会写乱。

------

#### props + emit 的语法糖

以下两种写法**完全等价**：

```vue
<BaseInput v-model="name" />
<BaseInput
  :modelValue="name"
  @update:modelValue="val => name = val"
/>
```

所以结论是：

- `v-model` **没有魔法**
- 本质仍然是 **单向数据流**
- 子组件依然不能直接改 props

------

#### 什么时候适合用

适合使用 `v-model` 的场景：

- 表单输入组件（Input / Select / Checkbox）
- 弹窗、抽屉的显隐状态
- 组件“本身就是一个状态容器”

判断标准：

> **父组件关心“值”，而不是“过程”。**

------

#### 什么时候不该用

不推荐使用 `v-model` 的场景：

- 提交行为（submit）
- 点击事件（click）
- 业务动作（save / delete / confirm）
- 一次性通知类事件

这些场景更适合：

```ts
emit('submit')
emit('confirm')
emit('delete')
```

原因是：

- `v-model` 语义是「状态同步」
- 行为事件不是状态
- 强行用会让组件语义变得混乱

------

## Slot 插槽（让组件“可扩展”）

先给一句**直觉级理解**：

> **Props 解决“传什么数据”，Slot 解决“这里放什么内容”。**

当你发现组件**结构是固定的，但内容不固定**，Slot 就该登场了。

------

### 默认插槽

默认插槽是**最常用**、也是你第一个会遇到的。

------

#### 布局类组件

典型场景：页面布局、卡片、容器。

子组件（容器只负责结构）：

```vue
<!-- BaseCard.vue -->
<template>
  <div class="card">
    <slot />
  </div>
</template>
```

views 中使用：

```vue
<BaseCard>
  <h3>用户信息</h3>
  <p>{{ user.name }}</p>
</BaseCard>
```

这里的分工非常清楚：

- **组件**：只定义外壳
- **内容**：完全由使用方决定

------

#### 容器类组件

例如滚动容器、权限容器、占位容器：

```vue
<!-- ScrollContainer.vue -->
<template>
  <div class="scroll">
    <slot />
  </div>
</template>
<ScrollContainer>
  <UserList />
</ScrollContainer>
```

这种组件的特点是：

- 不关心内部是什么
- 只提供“能力”或“结构”

------

### 具名插槽

当组件**不止一个“可插入区域”**时，就需要具名插槽。

------

#### header / footer / actions

子组件：

```vue
<!-- BaseDialog.vue -->
<template>
  <div class="dialog">
    <header>
      <slot name="header" />
    </header>

    <main>
      <slot />
    </main>

    <footer>
      <slot name="footer" />
    </footer>
  </div>
</template>
```

views 中使用：

```vue
<BaseDialog>
  <template #header>
    <h3>编辑用户</h3>
  </template>

  <UserForm />

  <template #footer>
    <button @click="onCancel">取消</button>
    <button @click="onConfirm">确定</button>
  </template>
</BaseDialog>
```

这种写法的价值在于：

- 布局统一
- 行为、内容自由
- 不需要在组件里写业务按钮

------

### 作用域插槽（高频）

这是**很多人第一次看就懵的地方**，但在项目里非常常见。

先给一句**关键结论**：

> **作用域插槽 = 子组件把“内部数据”交给 views 来决定怎么渲染。**

------

#### 子组件向 views 暴露数据

子组件中：

```vue
<!-- StatusTag.vue -->
<template>
  <slot :status="status" :text="text" />
</template>

<script setup lang="ts">
const props = defineProps<{
  status: 'success' | 'error'
}>()

const text = props.status === 'success' ? '成功' : '失败'
</script>
```

views 中使用：

```vue
<StatusTag status="success">
  <template #default="{ status, text }">
    <span :class="status">{{ text }}</span>
  </template>
</StatusTag>
```

这里发生的事是：

- 子组件计算好数据
- views 决定最终 HTML 结构

------

#### 表格 / 列表 / 状态渲染场景

最典型的场景：**列表渲染控制权交给页面**。

子组件（只管遍历）：

```vue
<!-- BaseList.vue -->
<template>
  <ul>
    <li v-for="item in list" :key="item.id">
      <slot :item="item" />
    </li>
  </ul>
</template>

<script setup lang="ts">
defineProps<{
  list: { id: number; name: string }[]
}>()
</script>
```

views 中：

```vue
<BaseList :list="users">
  <template #default="{ item }">
    <span>{{ item.name }}</span>
    <button @click="edit(item)">编辑</button>
  </template>
</BaseList>
```

这种模式的优势是：

- 组件高度通用
- 不锁死 UI
- views 保留业务表达能力

------

### Slot 使用时的几个实战建议（很重要）

- **布局类组件一定优先用 Slot**
- 不要用 props 传一堆 HTML 结构
- Slot 是“扩展点”，不是“塞垃圾口”
- 当组件内部 `v-if` 越来越多，通常说明 Slot 设计不够好

------

## 组件通信进阶（views 参与）

这一章的关键词只有一个：

> **views 有时候需要“主动”，而不是只被动接收事件。**

但请记住：
**这是例外，不是常态。**

------

### `ref` + `defineExpose`

这是 Vue3 中**唯一官方支持的“父直接调子”方式**。

> **views 可以拿到子组件实例，并调用它暴露出来的方法。**

------

#### 基本使用方式

子组件中：
只暴露**允许被调用的能力**。

```vue
<!-- UserForm.vue -->
<script setup lang="ts">
const reset = () => {
  // 重置表单
}

const validate = () => {
  return true
}

defineExpose({
  reset,
  validate
})
</script>
```

views 中：

```vue
<script setup lang="ts">
import { ref } from 'vue'
import UserForm from './components/UserForm.vue'

const formRef = ref<InstanceType<typeof UserForm> | null>(null)

const onSubmit = () => {
  if (formRef.value?.validate()) {
    // 提交逻辑
  }
}
</script>

<template>
  <UserForm ref="formRef" />
</template>
```

关键点只有三个：

- 子组件**必须** `defineExpose`
- 父组件通过 `ref` 拿实例
- **没暴露的东西，父组件拿不到**

------

#### 典型场景一：弹窗组件

非常常见、非常合理的用法。

```ts
// 子组件
defineExpose({
  open,
  close
})
// views
const dialogRef = ref(null)

dialogRef.value?.open()
```

为什么合理？

- 弹窗本身就是“可控组件”
- open / close 是明确的组件能力
- 比一堆 `v-model + emit` 更清晰

------

#### 典型场景二：表单重置 / 校验

```ts
defineExpose({
  reset,
  validate
})
```

views 中统一控制：

```ts
const onReset = () => {
  formRef.value?.reset()
}
```

这类场景中：

- 表单内部状态复杂
- views 只关心“结果”
- 直接调方法比拆 props / emit 更干净

------

#### 使用边界（非常重要）

`defineExpose` **不要滥用**：

- ❌ 用来读子组件内部状态
- ❌ 用来改子组件数据
- ❌ 用来串联业务流程

只应该暴露：

- 行为（open / close）
- 操作（reset / validate）
- 明确的组件能力

------

### `provide / inject`

这是**解决“props 传不动了”的工具**。

> **页面级上下文下发，子组件按需取用。**

------

#### 页面级依赖下发

views 中提供：

```ts
import { provide } from 'vue'

provide('userId', userId)
provide('readonly', true)
```

子组件中注入：

```ts
import { inject } from 'vue'

const userId = inject<string>('userId')
const readonly = inject<boolean>('readonly')
```

这种方式适合：

- 页面范围内共享
- 多层组件嵌套
- 不想层层透传 props

------

#### 解决 props 层层传递问题

典型反例（不想看到的）：

```vue
<A :user="user">
  <B :user="user">
    <C :user="user" />
  </B>
</A>
```

使用 `provide / inject` 后：

- views 提供一次
- 任意层级组件直接使用
- 中间组件“无感知”

------

#### 使用边界与注意事项

`provide / inject` 很强，但也很危险。

请遵守这些原则：

- ✅ 只用于**页面级上下文**
- ✅ 适合“配置 / 权限 / 环境信息”
- ❌ 不用于高频变更的数据
- ❌ 不用于核心业务状态

如果你发现：

- 需要频繁 inject
- 依赖关系不清晰
- 看不出数据来源

那通常说明：

> **组件设计或状态归属出了问题。**

------

## 组件拆分与组织策略（非常重要）

先给一句总判断：

> **拆组件不是为了“复用”，而是为了“可维护”。**

------

### 页面组件拆分思路

先回答一个最常见的问题：

> **一个页面，到底该拆哪些组件？**

#### 页面组件（views）的本质

views 本身就是一个组件，但它的职责非常明确：

- 路由入口
- 数据获取
- 状态编排
- 业务流程控制

它**不是**用来写大量 UI 细节的地方。

------

#### 一个页面，通常可以拆这几类组件

以一个典型列表页为例：

- 页面容器（views）
- 查询区域组件
- 列表 / 表格组件
- 操作栏组件
- 弹窗 / 抽屉组件

拆分的判断标准不是“文件太大了没”，而是：

- 是否有**独立职责**
- 是否有**独立生命周期**
- 是否有**独立交互逻辑**

只要满足其中一条，就**值得拆**。

------

#### 什么情况下不该拆

非常重要，很多人恰恰拆在这里。

**不要拆的情况：**

- 只是几行模板
- 没有任何逻辑
- 不会被复用
- 拆了反而增加 props / emit 数量

例如：

```vue
<div class="title">{{ title }}</div>
```

这种为了“看起来整洁”而拆的组件：

- 增加认知成本
- 降低可读性
- 对维护没有任何帮助

判断一句话：

> **拆完之后，调用者更复杂了，那就是拆错了。**

------

### “业务组件”与“基础组件”的区分

这是**企业项目里最容易混乱的一层**。

------

#### 基础组件（Base Components）

特点非常清晰：

- 不包含具体业务
- 只关心 UI 和交互
- 可被任何页面使用

常见命名：

- `BaseButton`
- `BaseDialog`
- `BaseTable`
- `BaseFormItem`

它们通常放在：

```text
src/components/common/
```

或类似目录。

**Base 组件的铁律：**

- ❌ 不调用接口
- ❌ 不依赖业务数据结构
- ❌ 不知道“这是哪个页面”

------

#### 业务组件（Business Components）

业务组件一定是**带业务语义的**。

例如：

- `UserForm`
- `OrderTable`
- `RolePermissionPanel`

特点：

- 知道业务字段
- 知道业务规则
- 通常依赖接口数据结构

业务组件一般：

- 被某几个页面复用
- 或只服务于一个模块

------

#### views 应该依赖哪一层？

这是一个**非常关键的判断点**。

正确依赖关系应该是：

```text
views
  ↓
业务组件
  ↓
基础组件
```

也就是说：

- views **不直接拼大量基础组件**
- 复杂 UI 组合交给业务组件
- views 只做“编排”

如果你发现：

- views 里堆满 `BaseXXX`
- props、emit 成片出现

那通常说明：

> **你缺了一层业务组件。**

------

### views 下的私有 components

这是很多项目做得**非常好，但很少被讲清楚的实践**。

------

#### `views/xxx/components` 的意义

目录结构示例：

```text
views/
 └─ user/
    ├─ index.vue
    └─ components/
       ├─ UserSearch.vue
       ├─ UserTable.vue
       └─ UserDialog.vue
```

这些组件的特点：

- **只服务当前页面**
- 不追求跨页面复用
- 随页面一起演进

这类组件：

- 不放全局
- 不放 common
- 不考虑“以后会不会用到”

------

#### 为什么要避免滥用全局组件

全局组件的成本远比你想象的大：

- 命名冲突风险
- 隐式依赖
- 新人难以定位来源
- 重构成本极高

经验结论是：

> **一个项目中，全局组件应该是“可枚举”的。**

例如：

- Button
- Icon
- Dialog
- Empty

如果你需要“想一下它是不是全局组件”，
那它**大概率不是**。

------

## 全局组件的使用边界（谨慎）

先给一句**项目级结论**：

> **全局组件不是“方便”，而是“长期承诺”。**

一旦全局注册，就等于告诉所有开发者：

> **这个组件可以在任何地方被使用。**

------

### 什么样的组件适合做全局组件

不是“复用率高”就能做全局组件，**还要满足稳定性**。

适合全局的组件，通常同时满足：

- UI 形态高度统一
- 行为规则长期稳定
- 不依赖具体业务字段
- 不关心路由、接口、权限

典型示例：

- `BaseButton`
- `BaseIcon`
- `BaseDialog`
- `BaseEmpty`
- `BaseLoading`

一句话判断：

> **如果这个组件在“用户管理”和“订单管理”里语义完全一致，它才有资格全局。**

------

### 全局组件的注册方式（main.ts 级别）

全局组件只应该在**应用入口**统一注册。

```ts
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import BaseButton from '@/components/common/BaseButton.vue'

const app = createApp(App)

app.component('BaseButton', BaseButton)

app.mount('#app')
```

特点：

- 注册位置唯一
- 查找成本低
- 不依赖隐式插件行为

**不推荐：**

- 在业务模块里注册
- 在插件里“顺手注册一堆组件”
- 自动扫描注册所有组件（调试和维护成本极高）

------

### 全局组件的隐性成本

全局组件的问题，**从来不是当下**。

常见隐性成本包括：

- 命名冲突（迟早发生）
- 无法安全重构
- 新人不知道组件从哪来
- 用错场景但没人敢删

尤其在多人协作中：

> **“能不能全局”往往比“能不能复用”更重要。**

------

### 为什么不推荐“全局注册一切”

很多项目初期会这么做：

- 少 import
- 用着方便
- 看起来很爽

但半年后通常变成：

- 谁都不敢动
- 谁也不知道哪些地方在用
- 只能继续堆新组件

经验结论：

> **全局组件应该是“有限集”，而不是“增长集”。**

------

## 异步组件与性能（了解即可）

这一节的关键词不是“优化”，而是**边界感**。

------

### `defineAsyncComponent`

Vue3 提供了原生的异步组件能力：

```ts
import { defineAsyncComponent } from 'vue'

const UserDialog = defineAsyncComponent(
  () => import('./UserDialog.vue')
)
```

------

### 页面级组件懒加载

最典型的使用场景：

- 弹窗
- 抽屉
- 大型表单
- 不常用的配置页面

好处是：

- 首屏更轻
- 只在需要时加载

但要注意：

> **不要为了“看起来高级”而异步。**

如果组件：

- 体积很小
- 每次都会用到

那异步反而增加复杂度。

------

### 大组件拆分加载

当一个组件已经：

- 行数过多
- 职责复杂
- 首次加载明显变慢

优先考虑：

- 拆分组件职责
- 而不是一股脑异步

异步是**手段**，不是设计方案。

------

### `keep-alive` 与组件缓存

`keep-alive` 解决的是：

> **组件切换后状态是否保留的问题**

典型使用：

- 列表页切到详情页再返回
- 多标签页切换

```vue
<keep-alive :include="['UserList']">
  <router-view />
</keep-alive>
```

------

### `include / exclude` 的使用场景

- `include`：只缓存指定组件
- `exclude`：排除某些组件

判断原则：

- 表单类、列表类 → 适合缓存
- 强依赖实时数据的页面 → 不缓存

------

## 常见错误与推荐实践（经验向）

这一章基本就是“**踩坑合集**”。

------

### 常见踩坑

#### props 解构导致响应性丢失

```ts
const { title } = defineProps<{ title: string }>()
```

这是一个**高频坑点**。

问题是：

- 解构后不是响应式的

推荐写法：

```ts
const props = defineProps<{ title: string }>()
```

或使用 `toRefs`。

------

#### emit 名称不一致

```vue
<UserForm @submitForm="handleSubmit" />
emit('submit-form')
```

这种错误：

- 编译不报错
- 运行没反应
- 排查成本极高

原则：

> **事件名必须在子组件中“定义即文档”。**

------

#### v-model 滥用

常见错误：

- 所有输入都用 v-model
- 一个组件暴露多个 v-model
- v-model + 业务逻辑混在一起

判断一句话：

> **只有“状态同步”才用 v-model。**

------

### 项目级推荐实践

#### props 数量控制

不是硬性规则，但经验建议：

- 超过 5 个 props
- 通常意味着职责过重

这时更应该：

- 合并模型
- 或拆组件

------

#### 单一职责组件原则

一个组件只回答一个问题：

- 展示？
- 输入？
- 触发？

如果一个组件同时做三件事，
它迟早会失控。

------

#### views 中尽量保持“声明式写法”

views 最理想的状态是：

- 少逻辑
- 少判断
- 多组合

```vue
<UserSearch />
<UserTable />
<UserDialog />
```

如果 views 像 service 层一样复杂，
那一定是组件设计出了问题。

