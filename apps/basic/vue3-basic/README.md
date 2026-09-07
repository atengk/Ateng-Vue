# Vue3 基础

## Vue3 项目基础

Vue3 项目基础主要用于说明 Vue3 的核心定位、项目目录组织方式，以及日常开发中最常使用的单文件组件写法。掌握这部分内容后，可以理解一个 Vue3 项目从入口文件、根组件到业务组件之间的基本关系。

### Vue3 简介

Vue3 是 Vue.js 的新一代主版本，主要用于构建现代化前端单页应用。相比 Vue2，Vue3 在响应式系统、组件组织方式、TypeScript 支持和性能方面都有明显提升。

Vue3 项目开发中通常会配合以下技术使用：

| 技术         | 作用                           |
| ------------ | ------------------------------ |
| Vue3         | 前端视图框架                   |
| Vite         | 项目构建和开发服务器           |
| TypeScript   | 提供类型约束，提升代码可维护性 |
| Vue Router   | 前端路由管理                   |
| Pinia        | 全局状态管理                   |
| Axios        | HTTP 请求封装                  |
| Element Plus | Vue3 常用 UI 组件库            |

Vue3 的核心特点包括：

1. 使用 Composition API 组织组件逻辑，使代码按功能聚合，而不是按 `data`、`methods`、`computed` 分散。
2. 对 TypeScript 支持更好，适合中大型前端项目。
3. 基于 Proxy 实现新的响应式系统，能力更完整。
4. 支持 `<script setup>` 语法，减少样板代码。
5. 配合 Vite 使用时，开发启动速度和热更新速度更快。

创建 Vue3 项目时，通常使用 Vite 初始化项目。

```bash
# 使用 Vite 创建 Vue3 项目
npm create vite@latest vue3-basic-demo

# 进入项目目录
cd vue3-basic-demo

# 安装依赖
npm install

# 启动开发服务
npm run dev
```

命令执行完成后，终端通常会输出本地访问地址，例如：

```bash
http://localhost:5173/
```

在浏览器访问该地址，如果页面正常显示，说明 Vue3 项目已经创建并启动成功。

### Vue3 项目结构

Vue3 项目一般由 Vite 生成基础结构。实际开发中，会在默认结构基础上增加 `api`、`router`、`stores`、`utils`、`types` 等目录，用于拆分接口、路由、状态、工具函数和类型声明。

常见项目结构如下：

```text
vue3-basic-demo
├── public
│   └── vite.svg
├── src
│   ├── api
│   │   └── user.ts
│   ├── assets
│   │   └── vue.svg
│   ├── components
│   │   └── UserCard.vue
│   ├── router
│   │   └── index.ts
│   ├── stores
│   │   └── user.ts
│   ├── types
│   │   └── user.ts
│   ├── utils
│   │   └── request.ts
│   ├── views
│   │   └── HomeView.vue
│   ├── App.vue
│   ├── main.ts
│   └── style.css
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

主要目录说明如下：

| 路径             | 说明                               |
| ---------------- | ---------------------------------- |
| `public`         | 存放不会被 Vite 编译处理的静态资源 |
| `src`            | 项目核心源码目录                   |
| `src/api`        | 接口请求模块                       |
| `src/assets`     | 图片、字体、样式等静态资源         |
| `src/components` | 通用组件目录                       |
| `src/router`     | Vue Router 路由配置                |
| `src/stores`     | Pinia 状态管理                     |
| `src/types`      | TypeScript 类型定义                |
| `src/utils`      | 工具函数、请求封装等               |
| `src/views`      | 页面级组件                         |
| `src/App.vue`    | 根组件                             |
| `src/main.ts`    | 项目入口文件                       |
| `vite.config.ts` | Vite 配置文件                      |

`main.ts` 是 Vue3 项目的入口文件，负责创建 Vue 应用实例，并挂载到页面中的 `#app` 节点。

文件位置：`src/main.ts`

```typescript
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

// 创建 Vue 应用实例
const app = createApp(App)

// 将 Vue 应用挂载到 index.html 中 id 为 app 的元素上
app.mount('#app')
```

`index.html` 中需要存在对应的挂载节点。

文件位置：`index.html`

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vue3 基础项目</title>
  </head>
  <body>
    <!-- Vue 应用挂载点 -->
    <div id="app"></div>

    <!-- Vite 项目入口脚本 -->
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

`App.vue` 是项目的根组件，通常用于组织整体页面结构，例如公共布局、路由出口或全局组件。

文件位置：`src/App.vue`

```vue
<template>
  <main class="app-container">
    <h1>Vue3 基础项目</h1>
    <p>当前页面由 App.vue 根组件渲染。</p>

    <UserCard username="Ateng" role="Java开发工程师" />
  </main>
</template>

<script setup lang="ts">
import UserCard from './components/UserCard.vue'
</script>

<style scoped>
.app-container {
  padding: 24px;
  font-family: Arial, sans-serif;
}
</style>
```

该文件中引入了 `UserCard.vue` 组件，并在模板中使用。实际项目中，根组件通常不会承载太多业务逻辑，而是负责组合页面布局和路由内容。

### 单文件组件

单文件组件是 Vue 项目中最常见的组件组织方式，文件后缀为 `.vue`。一个 `.vue` 文件通常由 `template`、`script` 和 `style` 三部分组成。

基本结构如下：

```vue
<template>
  <!-- 页面结构 -->
</template>

<script setup lang="ts">
// 组件逻辑
</script>

<style scoped>
/* 组件样式 */
</style>
```

三部分的作用如下：

| 区域           | 作用                                            |
| -------------- | ----------------------------------------------- |
| `template`     | 编写组件的 HTML 模板结构                        |
| `script setup` | 编写组件逻辑、变量、方法、Props、事件等         |
| `style scoped` | 编写组件样式，`scoped` 表示样式只作用于当前组件 |

下面是一个完整的用户卡片组件示例。

文件位置：`src/components/UserCard.vue`

```vue
<template>
  <section class="user-card">
    <h2 class="user-card__name">{{ username }}</h2>
    <p class="user-card__role">岗位：{{ role }}</p>

    <button class="user-card__button" type="button" @click="handleViewDetail">
      查看详情
    </button>
  </section>
</template>

<script setup lang="ts">
interface Props {
  username: string
  role: string
}

const props = defineProps<Props>()

const handleViewDetail = () => {
  // 实际项目中可以跳转详情页、打开弹窗或调用接口
  console.log(`查看用户详情：${props.username}`)
}
</script>

<style scoped>
.user-card {
  width: 320px;
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background-color: #ffffff;
}

.user-card__name {
  margin: 0 0 8px;
  font-size: 20px;
  font-weight: 600;
}

.user-card__role {
  margin: 0 0 16px;
  color: #666666;
}

.user-card__button {
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  color: #ffffff;
  background-color: #42b883;
  cursor: pointer;
}

.user-card__button:hover {
  background-color: #369b6f;
}
</style>
```

该组件通过 `defineProps` 接收父组件传入的 `username` 和 `role`，并在页面中渲染用户信息。按钮点击时会触发 `handleViewDetail` 方法。

父组件中可以这样使用：

文件位置：`src/App.vue`

```vue
<template>
  <main class="app-container">
    <UserCard username="Ateng" role="Java开发工程师" />
    <UserCard username="Tom" role="前端开发工程师" />
  </main>
</template>

<script setup lang="ts">
import UserCard from './components/UserCard.vue'
</script>

<style scoped>
.app-container {
  display: flex;
  gap: 16px;
  padding: 24px;
}
</style>
```

单文件组件开发时需要注意以下几点：

1. 组件名建议使用大驼峰命名，例如 `UserCard.vue`、`OrderList.vue`。
2. 页面级组件通常放在 `src/views` 目录。
3. 通用组件通常放在 `src/components` 目录。
4. 组件逻辑推荐使用 `<script setup lang="ts">`。
5. 样式建议加上 `scoped`，避免影响其他组件。
6. 组件内部只保留当前组件需要的逻辑，复杂业务逻辑可以抽离到组合式函数、状态管理或接口模块中。

完成以上内容后，可以通过以下命令验证项目是否正常运行：

```bash
npm run dev
```

如果页面中可以正常显示用户卡片，并且点击按钮后浏览器控制台输出用户信息，说明 Vue3 项目结构、入口文件和单文件组件使用方式已经验证通过。



## 模板语法

模板语法用于描述组件页面结构和数据展示方式。Vue3 会将组件中的响应式数据和模板绑定起来，当数据发生变化时，页面会自动更新。常用模板语法包括文本插值、属性绑定、条件渲染、列表渲染和事件绑定。

### 文本插值

文本插值用于在页面中显示变量内容，语法是双大括号 `{{ }}`。插值表达式中可以使用变量、简单计算、三元表达式和方法返回值，但不建议写复杂业务逻辑。

文件位置：`src/views/TemplateTextView.vue`

```vue
<template>
  <section class="page-container">
    <h2>{{ title }}</h2>

    <p>用户名：{{ username }}</p>
    <p>年龄：{{ age }}</p>
    <p>用户描述：{{ username }}，今年 {{ age }} 岁</p>
    <p>年龄阶段：{{ age >= 18 ? '成年人' : '未成年人' }}</p>
    <p>欢迎语：{{ getWelcomeText() }}</p>
  </section>
</template>

<script setup lang="ts">
const title = '文本插值示例'
const username = 'Ateng'
const age = 28

const getWelcomeText = () => {
  return `欢迎 ${username} 学习 Vue3`
}
</script>

<style scoped lang="scss">
.page-container {
  padding: 24px;
}
</style>
```

文本插值只适合展示文本内容。如果需要绑定 HTML 属性，例如 `src`、`href`、`class`、`style`，应该使用属性绑定，而不是直接写插值。

错误写法如下：

```vue
<img src="{{ imageUrl }}" alt="头像" />
```

正确写法如下：

```vue
<img :src="imageUrl" alt="头像" />
```

### 属性绑定

属性绑定用于将变量绑定到 HTML 属性或组件 Props 上。完整语法是 `v-bind:属性名`，简写语法是 `:属性名`。实际开发中通常使用简写形式。

文件位置：`src/views/TemplateBindView.vue`

```vue
<template>
  <section class="page-container">
    <h2>属性绑定示例</h2>

    <img class="avatar" :src="avatarUrl" :alt="username" />

    <a :href="websiteUrl" target="_blank">
      访问 Vue 官网
    </a>

    <button :disabled="disabled">
      {{ disabled ? '按钮已禁用' : '可以点击' }}
    </button>

    <div :class="{ active: isActive, disabled: disabled }">
      动态 class 绑定
    </div>

    <div :style="{ color: textColor, fontSize: fontSize + 'px' }">
      动态 style 绑定
    </div>
  </section>
</template>

<script setup lang="ts">
const username = 'Vue3'
const avatarUrl = 'https://vuejs.org/logo.svg'
const websiteUrl = 'https://vuejs.org/'
const disabled = false
const isActive = true
const textColor = '#42b883'
const fontSize = 18
</script>

<style scoped lang="scss">
.page-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
}

.avatar {
  width: 80px;
  height: 80px;
}

.active {
  color: #42b883;
  font-weight: 600;
}

.disabled {
  opacity: 0.5;
}
</style>
```

属性绑定常见使用场景包括图片地址、链接地址、按钮禁用状态、组件参数、动态样式和动态类名。

### 条件渲染

条件渲染用于根据数据状态控制页面内容是否显示。Vue3 常用的条件指令包括 `v-if`、`v-else-if`、`v-else` 和 `v-show`。

`v-if` 会真正创建或销毁 DOM，适合条件不频繁变化的场景。`v-show` 只控制 CSS 的 `display`，适合频繁切换显示隐藏的场景。

文件位置：`src/views/TemplateConditionView.vue`

```vue
<template>
  <section class="page-container">
    <h2>条件渲染示例</h2>

    <div v-if="loading" class="state-text">
      数据加载中...
    </div>

    <div v-else-if="errorMessage" class="state-text error-text">
      {{ errorMessage }}
    </div>

    <div v-else class="user-info">
      <p>用户名：{{ username }}</p>
      <p>角色：{{ role }}</p>
    </div>

    <button type="button" @click="togglePanel">
      {{ showPanel ? '隐藏面板' : '显示面板' }}
    </button>

    <div v-show="showPanel" class="panel">
      这是一个通过 v-show 控制的面板。
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const loading = ref(false)
const errorMessage = ref('')
const username = ref('Ateng')
const role = ref('Java开发工程师')
const showPanel = ref(true)

const togglePanel = () => {
  showPanel.value = !showPanel.value
}
</script>

<style scoped lang="scss">
.page-container {
  padding: 24px;
}

.state-text {
  margin-bottom: 12px;
}

.error-text {
  color: #ef4444;
}

.user-info {
  margin-bottom: 16px;
}

.panel {
  margin-top: 16px;
  padding: 16px;
  border: 1px solid #e5e7eb;
}
</style>
```

实际开发中，列表页通常会使用 `v-if` 处理加载中、接口异常、空数据和正常数据四种状态。弹窗、下拉面板、折叠区域等高频切换场景，则更适合使用 `v-show`。

### 列表渲染

列表渲染用于根据数组数据重复生成页面结构，常用指令是 `v-for`。使用 `v-for` 时必须绑定稳定的 `key`，便于 Vue 准确追踪每一项数据，提高页面更新效率。

文件位置：`src/views/TemplateListView.vue`

```vue
<template>
  <section class="page-container">
    <h2>列表渲染示例</h2>

    <ul class="user-list">
      <li v-for="user in userList" :key="user.id" class="user-item">
        <span>{{ user.name }}</span>
        <span>{{ user.role }}</span>
      </li>
    </ul>

    <div v-if="userList.length === 0" class="empty-text">
      暂无用户数据
    </div>
  </section>
</template>

<script setup lang="ts">
interface UserItem {
  id: number
  name: string
  role: string
}

const userList: UserItem[] = [
  { id: 1, name: 'Ateng', role: 'Java开发工程师' },
  { id: 2, name: 'Tom', role: '前端开发工程师' },
  { id: 3, name: 'Jerry', role: '测试工程师' },
]
</script>

<style scoped lang="scss">
.page-container {
  padding: 24px;
}

.user-list {
  padding: 0;
  list-style: none;
}

.user-item {
  display: flex;
  justify-content: space-between;
  width: 360px;
  padding: 12px;
  border-bottom: 1px solid #e5e7eb;
}

.empty-text {
  color: #999999;
}
</style>
```

如果需要获取数组下标，可以使用 `(item, index)` 的写法。

```vue
<li v-for="(user, index) in userList" :key="user.id">
  {{ index + 1 }}. {{ user.name }}
</li>
```

如果需要遍历对象，可以使用 `(value, key)` 的写法。

```vue
<p v-for="(value, key) in userInfo" :key="key">
  {{ key }}：{{ value }}
</p>
```

`key` 不建议使用数组下标，尤其是在列表存在新增、删除、排序时。优先使用后端返回的唯一 ID。

### 事件绑定

事件绑定用于监听用户操作，例如点击、输入、提交、键盘事件等。完整语法是 `v-on:事件名`，简写语法是 `@事件名`。实际开发中通常使用简写形式。

文件位置：`src/views/TemplateEventView.vue`

```vue
<template>
  <section class="page-container">
    <h2>事件绑定示例</h2>

    <p>当前数量：{{ count }}</p>

    <div class="button-group">
      <button type="button" @click="increase">
        加 1
      </button>

      <button type="button" @click="decrease">
        减 1
      </button>

      <button type="button" @click="resetCount">
        重置
      </button>
    </div>

    <input
      v-model="keyword"
      placeholder="请输入搜索关键字"
      @keyup.enter="handleSearch"
    />

    <p>搜索关键字：{{ keyword }}</p>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)
const keyword = ref('')

const increase = () => {
  count.value++
}

const decrease = () => {
  if (count.value <= 0) {
    return
  }

  count.value--
}

const resetCount = () => {
  count.value = 0
}

const handleSearch = () => {
  console.log('执行搜索：', keyword.value)
}
</script>

<style scoped lang="scss">
.page-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
}

.button-group {
  display: flex;
  gap: 12px;
}

input {
  width: 260px;
  padding: 8px;
}
</style>
```

常见事件写法如下：

| 写法                             | 说明                         |
| -------------------------------- | ---------------------------- |
| `@click="handleClick"`           | 点击事件                     |
| `@input="handleInput"`           | 输入事件                     |
| `@change="handleChange"`         | 值变化事件                   |
| `@submit.prevent="handleSubmit"` | 表单提交，并阻止默认提交行为 |
| `@keyup.enter="handleSearch"`    | 按下回车键触发               |
| `@click.stop="handleClick"`      | 阻止事件冒泡                 |

事件绑定中可以直接传参。

```vue
<button type="button" @click="removeUser(user.id)">
  删除
</button>
```

对应方法如下：

```typescript
const removeUser = (id: number) => {
  console.log('删除用户：', id)
}
```

## 响应式基础

响应式是 Vue3 的核心能力。组件中的数据被声明为响应式后，当数据发生变化时，Vue 会自动更新使用这些数据的页面内容。Vue3 中常用的响应式 API 包括 `ref`、`reactive`、`computed`、`watch` 和 `watchEffect`。

### ref

`ref` 用于声明响应式数据，适合基本数据类型，也可以保存对象、数组和 DOM 引用。在 `<script setup>` 中访问 `ref` 变量时需要使用 `.value`，在模板中使用时会自动解包，不需要写 `.value`。

文件位置：`src/views/ReactiveRefView.vue`

```vue
<template>
  <section class="page-container">
    <h2>ref 示例</h2>

    <p>当前数量：{{ count }}</p>
    <p>用户名：{{ username }}</p>

    <button type="button" @click="increase">
      数量加 1
    </button>

    <button type="button" @click="changeUsername">
      修改用户名
    </button>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)
const username = ref('Ateng')

const increase = () => {
  count.value++
}

const changeUsername = () => {
  username.value = 'Vue3 用户'
}
</script>

<style scoped lang="scss">
.page-container {
  padding: 24px;
}
</style>
```

`ref` 的使用重点是区分脚本和模板中的访问方式。

```typescript
// script 中需要使用 .value
count.value = count.value + 1
<!-- template 中不需要使用 .value -->
<p>{{ count }}</p>
```

一般情况下，基本数据类型优先使用 `ref`，例如字符串、数字、布尔值、选中值、输入框内容、加载状态等。

### reactive

`reactive` 用于声明响应式对象，适合管理多个相关字段。使用 `reactive` 后，在脚本和模板中访问属性都不需要 `.value`。

文件位置：`src/views/ReactiveObjectView.vue`

```vue
<template>
  <section class="page-container">
    <h2>reactive 示例</h2>

    <p>用户名：{{ userInfo.name }}</p>
    <p>年龄：{{ userInfo.age }}</p>
    <p>角色：{{ userInfo.role }}</p>

    <button type="button" @click="updateUserInfo">
      修改用户信息
    </button>
  </section>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

interface UserInfo {
  name: string
  age: number
  role: string
}

const userInfo = reactive<UserInfo>({
  name: 'Ateng',
  age: 28,
  role: 'Java开发工程师',
})

const updateUserInfo = () => {
  userInfo.name = 'Vue3 用户'
  userInfo.age = 30
  userInfo.role = '前端学习者'
}
</script>

<style scoped lang="scss">
.page-container {
  padding: 24px;
}
</style>
```

`reactive` 适合表单对象、查询参数对象、页面状态对象等场景。

例如查询条件可以这样定义：

```typescript
import { reactive } from 'vue'

const queryParams = reactive({
  keyword: '',
  status: '',
  pageNum: 1,
  pageSize: 10,
})
```

使用 `reactive` 时需要注意，不建议直接解构响应式对象，否则可能导致响应式丢失。

不推荐：

```typescript
const { name, age } = userInfo
```

推荐直接使用：

```typescript
userInfo.name
userInfo.age
```

如果确实需要解构，可以配合 `toRefs` 使用。

```typescript
import { reactive, toRefs } from 'vue'

const userInfo = reactive({
  name: 'Ateng',
  age: 28,
})

const { name, age } = toRefs(userInfo)
```

### computed

`computed` 用于声明计算属性。计算属性会根据依赖的响应式数据自动计算结果，并且具有缓存能力。只有依赖数据发生变化时，计算属性才会重新计算。

文件位置：`src/views/ReactiveComputedView.vue`

```vue
<template>
  <section class="page-container">
    <h2>computed 示例</h2>

    <p>商品名称：{{ product.name }}</p>
    <p>商品单价：{{ product.price }}</p>
    <p>购买数量：{{ product.count }}</p>
    <p>总价：{{ totalPrice }}</p>
    <p>折扣后价格：{{ discountPrice }}</p>

    <button type="button" @click="increaseCount">
      增加数量
    </button>
  </section>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'

const product = reactive({
  name: 'Vue3 实战课程',
  price: 99,
  count: 1,
  discount: 0.8,
})

const totalPrice = computed(() => {
  return product.price * product.count
})

const discountPrice = computed(() => {
  return totalPrice.value * product.discount
})

const increaseCount = () => {
  product.count++
}
</script>

<style scoped lang="scss">
.page-container {
  padding: 24px;
}
</style>
```

`computed` 适合处理从已有状态派生出来的数据，例如总价、筛选结果、格式化文本、按钮禁用状态、表单校验结果等。

例如根据关键字筛选列表：

```typescript
import { computed, ref } from 'vue'

const keyword = ref('')

const userList = ref([
  { id: 1, name: 'Ateng' },
  { id: 2, name: 'Tom' },
  { id: 3, name: 'Jerry' },
])

const filteredUserList = computed(() => {
  if (!keyword.value) {
    return userList.value
  }

  return userList.value.filter((item) => item.name.includes(keyword.value))
})
```

如果一个值可以根据已有响应式数据计算得到，优先考虑使用 `computed`，不要手动维护多个重复状态。

### watch

`watch` 用于监听指定响应式数据的变化，并在变化时执行副作用逻辑。常见场景包括监听搜索关键字、监听分页参数、监听路由参数、监听表单字段变化后调用接口等。

文件位置：`src/views/ReactiveWatchView.vue`

```vue
<template>
  <section class="page-container">
    <h2>watch 示例</h2>

    <input v-model="keyword" placeholder="请输入搜索关键字" />

    <p>当前关键字：{{ keyword }}</p>
    <p>搜索结果：{{ searchResult }}</p>

    <button type="button" @click="resetKeyword">
      重置关键字
    </button>
  </section>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const keyword = ref('')
const searchResult = ref('暂无搜索结果')

watch(keyword, (newValue, oldValue) => {
  console.log('关键字变化：', oldValue, '=>', newValue)

  if (!newValue) {
    searchResult.value = '暂无搜索结果'
    return
  }

  searchResult.value = `正在搜索：${newValue}`
})

const resetKeyword = () => {
  keyword.value = ''
}
</script>

<style scoped lang="scss">
.page-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
}

input {
  width: 260px;
  padding: 8px;
}
</style>
```

监听多个数据时，可以传入数组。

```typescript
import { ref, watch } from 'vue'

const pageNum = ref(1)
const pageSize = ref(10)

watch([pageNum, pageSize], ([newPageNum, newPageSize]) => {
  console.log('分页参数变化：', newPageNum, newPageSize)
})
```

监听对象内部属性时，可以使用函数返回值。

```typescript
import { reactive, watch } from 'vue'

const queryParams = reactive({
  keyword: '',
  status: '',
})

watch(
  () => queryParams.keyword,
  (newValue) => {
    console.log('关键字变化：', newValue)
  },
)
```

如果需要在监听创建后立即执行一次，可以使用 `immediate`。

```typescript
watch(
  keyword,
  (newValue) => {
    console.log('立即执行，并监听关键字：', newValue)
  },
  {
    immediate: true,
  },
)
```

如果需要深度监听对象，可以使用 `deep`，但应谨慎使用。深度监听会带来额外性能开销，实际开发中更推荐监听具体字段。

```typescript
watch(
  queryParams,
  (newValue) => {
    console.log('查询参数变化：', newValue)
  },
  {
    deep: true,
  },
)
```

### watchEffect

`watchEffect` 会自动收集回调函数中使用到的响应式依赖，并在依赖变化时重新执行。它不需要明确指定监听哪个数据，适合依赖较简单、逻辑直接的副作用场景。

文件位置：`src/views/ReactiveWatchEffectView.vue`

```vue
<template>
  <section class="page-container">
    <h2>watchEffect 示例</h2>

    <input v-model="keyword" placeholder="请输入关键字" />

    <select v-model="status">
      <option value="">全部</option>
      <option value="enabled">启用</option>
      <option value="disabled">禁用</option>
    </select>

    <p>查询条件：{{ queryText }}</p>
  </section>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'

const keyword = ref('')
const status = ref('')
const queryText = ref('')

watchEffect(() => {
  // 自动追踪 keyword 和 status 的变化
  queryText.value = `关键字：${keyword.value || '无'}，状态：${status.value || '全部'}`
})
</script>

<style scoped lang="scss">
.page-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
}

input,
select {
  width: 260px;
  padding: 8px;
}
</style>
```

`watch` 和 `watchEffect` 的区别如下：

| 对比项           | watch                  | watchEffect              |
| ---------------- | ---------------------- | ------------------------ |
| 依赖声明         | 需要明确指定监听源     | 自动收集依赖             |
| 是否默认立即执行 | 默认不立即执行         | 默认立即执行             |
| 是否能拿到旧值   | 可以拿到旧值           | 不能直接拿到旧值         |
| 适合场景         | 精确监听某个或某些数据 | 简单副作用、自动依赖收集 |
| 可控性           | 更强                   | 更简洁                   |

实际项目中，如果需要明确知道监听哪个字段、需要旧值、需要控制执行时机，优先使用 `watch`。如果只是根据响应式数据自动同步某些副作用逻辑，可以使用 `watchEffect`。

响应式基础部分可以按以下优先级理解：

1. 普通值、开关状态、输入框内容，优先使用 `ref`。
2. 多字段对象、表单对象、查询参数，优先使用 `reactive`。
3. 根据已有数据计算新值，使用 `computed`。
4. 监听指定数据变化并执行逻辑，使用 `watch`。
5. 自动收集依赖并执行副作用，使用 `watchEffect`。



## 组件基础

组件是 Vue3 项目的核心组织单元。一个页面通常由多个组件组合而成，组件可以拆分页面结构、复用业务逻辑，并通过 Props、Emits、Slots 等方式完成数据传递和内容扩展。

### 组件定义

组件定义是指创建一个可以被其他页面或组件复用的 `.vue` 文件。Vue3 中推荐使用单文件组件，也就是 `.vue` 文件，并配合 `<script setup lang="ts">` 编写组件逻辑。

下面定义一个基础的用户信息卡片组件。

文件位置：`src/components/UserProfile.vue`

```vue
<template>
  <section class="user-profile">
    <h3 class="user-profile__name">{{ username }}</h3>
    <p class="user-profile__role">岗位：{{ role }}</p>
    <p class="user-profile__desc">这是一个基础 Vue3 组件。</p>
  </section>
</template>

<script setup lang="ts">
const username = 'Ateng'
const role = 'Java开发工程师'
</script>

<style scoped lang="scss">
.user-profile {
  width: 320px;
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background-color: #ffffff;

  &__name {
    margin: 0 0 8px;
    font-size: 20px;
    font-weight: 600;
  }

  &__role {
    margin: 0 0 8px;
    color: #333333;
  }

  &__desc {
    margin: 0;
    color: #666666;
  }
}
</style>
```

该组件由三个部分组成：`template` 负责页面结构，`script setup` 负责组件数据和逻辑，`style scoped` 负责当前组件样式。实际开发中，页面中重复出现的卡片、表格、弹窗、搜索栏、按钮组等内容都可以抽离为组件。

### 组件注册

组件注册是指在其他组件中引入并使用已定义好的组件。Vue3 中常见注册方式有局部注册和全局注册。

局部注册适合大部分业务组件，在哪里使用就在哪里引入。

文件位置：`src/views/UserView.vue`

```vue
<template>
  <main class="page-container">
    <h2>用户页面</h2>

    <UserProfile />
  </main>
</template>

<script setup lang="ts">
import UserProfile from '@/components/UserProfile.vue'
</script>

<style scoped lang="scss">
.page-container {
  padding: 24px;
}
</style>
```

在 `<script setup>` 中，只要通过 `import` 引入组件，就可以直接在模板中使用，不需要再写 `components` 配置。

全局注册适合使用频率很高的基础组件，例如 `BaseButton`、`BaseDialog`、`BaseTable` 等。

文件位置：`src/components/BaseButton.vue`

```vue
<template>
  <button class="base-button" type="button">
    <slot />
  </button>
</template>

<script setup lang="ts">
// 基础按钮组件，通过 slot 接收按钮内容
</script>

<style scoped lang="scss">
.base-button {
  padding: 8px 14px;
  border: none;
  border-radius: 4px;
  color: #ffffff;
  background-color: #42b883;
  cursor: pointer;

  &:hover {
    background-color: #369b6f;
  }
}
</style>
```

在入口文件中进行全局注册。

文件位置：`src/main.ts`

```typescript
import { createApp } from 'vue'
import App from './App.vue'
import BaseButton from './components/BaseButton.vue'
import './style.css'

const app = createApp(App)

// 注册全局基础组件
app.component('BaseButton', BaseButton)

app.mount('#app')
```

注册完成后，任意组件中都可以直接使用 `BaseButton`。

```vue
<template>
  <BaseButton>提交</BaseButton>
</template>
```

实际项目中不建议将所有组件都注册为全局组件。业务组件建议局部注册，通用基础组件可以根据团队规范选择全局注册。

### 组件通信

组件通信用于在不同组件之间传递数据或触发行为。Vue3 中常见通信方式如下：

| 通信方式         | 适用场景                   |
| ---------------- | -------------------------- |
| Props            | 父组件向子组件传递数据     |
| Emits            | 子组件向父组件发送事件     |
| Slots            | 父组件向子组件传递模板内容 |
| provide / inject | 跨层级组件共享数据         |
| Pinia            | 多页面、多组件共享全局状态 |

最常见的组件通信是父子组件通信。父组件通过 Props 传递数据给子组件，子组件通过 Emits 通知父组件执行操作。

下面是一个用户列表和用户卡片组件配合使用的示例。

文件位置：`src/components/UserItem.vue`

```vue
<template>
  <div class="user-item">
    <div>
      <h3 class="user-item__name">{{ user.name }}</h3>
      <p class="user-item__role">{{ user.role }}</p>
    </div>

    <button type="button" @click="handleRemove">
      删除
    </button>
  </div>
</template>

<script setup lang="ts">
interface User {
  id: number
  name: string
  role: string
}

interface Props {
  user: User
}

const props = defineProps<Props>()

const emit = defineEmits<{
  remove: [id: number]
}>()

const handleRemove = () => {
  // 子组件通过事件把用户 ID 传递给父组件
  emit('remove', props.user.id)
}
</script>

<style scoped lang="scss">
.user-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 420px;
  padding: 12px;
  border-bottom: 1px solid #e5e7eb;

  &__name {
    margin: 0 0 4px;
    font-size: 16px;
  }

  &__role {
    margin: 0;
    color: #666666;
  }
}
</style>
```

父组件中使用子组件，并接收子组件触发的事件。

文件位置：`src/views/UserListView.vue`

```vue
<template>
  <main class="page-container">
    <h2>用户列表</h2>

    <UserItem
      v-for="user in userList"
      :key="user.id"
      :user="user"
      @remove="removeUser"
    />

    <p v-if="userList.length === 0" class="empty-text">
      暂无用户数据
    </p>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import UserItem from '@/components/UserItem.vue'

interface User {
  id: number
  name: string
  role: string
}

const userList = ref<User[]>([
  { id: 1, name: 'Ateng', role: 'Java开发工程师' },
  { id: 2, name: 'Tom', role: '前端开发工程师' },
  { id: 3, name: 'Jerry', role: '测试工程师' },
])

const removeUser = (id: number) => {
  // 根据子组件传递的 ID 删除用户
  userList.value = userList.value.filter((item) => item.id !== id)
}
</script>

<style scoped lang="scss">
.page-container {
  padding: 24px;
}

.empty-text {
  color: #999999;
}
</style>
```

这个示例中，父组件负责维护 `userList`，子组件只负责展示单个用户并触发删除事件。组件职责清晰，后续维护成本更低。

### Props

Props 用于父组件向子组件传递数据。Vue3 中推荐使用 TypeScript 定义 Props 类型，使组件入参更加清晰。

文件位置：`src/components/ProductCard.vue`

```vue
<template>
  <article class="product-card">
    <h3>{{ title }}</h3>
    <p>价格：￥{{ price }}</p>
    <p>库存：{{ stock }}</p>
    <p>状态：{{ stock > 0 ? '有库存' : '无库存' }}</p>
  </article>
</template>

<script setup lang="ts">
interface Props {
  title: string
  price: number
  stock?: number
}

withDefaults(defineProps<Props>(), {
  stock: 0,
})
</script>

<style scoped lang="scss">
.product-card {
  width: 280px;
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}
</style>
```

父组件中传递 Props。

文件位置：`src/views/ProductView.vue`

```vue
<template>
  <main class="page-container">
    <ProductCard title="Vue3 基础课程" :price="99" :stock="20" />
    <ProductCard title="TypeScript 入门课程" :price="79" />
  </main>
</template>

<script setup lang="ts">
import ProductCard from '@/components/ProductCard.vue'
</script>

<style scoped lang="scss">
.page-container {
  display: flex;
  gap: 16px;
  padding: 24px;
}
</style>
```

Props 使用时需要注意：子组件不应该直接修改 Props。Props 的数据来源属于父组件，子组件如果需要修改，应通过 Emits 通知父组件处理。

不推荐在子组件中直接修改 Props：

```typescript
props.title = '新的标题'
```

推荐通过事件通知父组件：

```typescript
emit('updateTitle', '新的标题')
```

### Emits

Emits 用于子组件向父组件发送事件。常见场景包括关闭弹窗、删除数据、提交表单、切换状态、通知父组件刷新列表等。

下面定义一个确认弹窗组件。子组件不直接处理业务数据，只负责把用户操作通知给父组件。

文件位置：`src/components/ConfirmDialog.vue`

```vue
<template>
  <div v-if="visible" class="dialog-mask">
    <div class="dialog">
      <h3>{{ title }}</h3>
      <p>{{ content }}</p>

      <div class="dialog__footer">
        <button type="button" @click="handleCancel">
          取消
        </button>
        <button type="button" @click="handleConfirm">
          确认
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  visible: boolean
  title: string
  content: string
}

defineProps<Props>()

const emit = defineEmits<{
  cancel: []
  confirm: []
}>()

const handleCancel = () => {
  // 通知父组件取消操作
  emit('cancel')
}

const handleConfirm = () => {
  // 通知父组件确认操作
  emit('confirm')
}
</script>

<style scoped lang="scss">
.dialog-mask {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgb(0 0 0 / 40%);
}

.dialog {
  width: 360px;
  padding: 20px;
  border-radius: 8px;
  background-color: #ffffff;

  &__footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 20px;
  }
}
</style>
```

父组件中接收子组件事件。

文件位置：`src/views/DialogView.vue`

```vue
<template>
  <main class="page-container">
    <button type="button" @click="openDialog">
      删除用户
    </button>

    <ConfirmDialog
      :visible="dialogVisible"
      title="删除确认"
      content="确定要删除该用户吗？"
      @cancel="closeDialog"
      @confirm="handleDelete"
    />
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'

const dialogVisible = ref(false)

const openDialog = () => {
  dialogVisible.value = true
}

const closeDialog = () => {
  dialogVisible.value = false
}

const handleDelete = () => {
  // 实际项目中可以在这里调用删除接口
  console.log('执行删除操作')
  dialogVisible.value = false
}
</script>

<style scoped lang="scss">
.page-container {
  padding: 24px;
}
</style>
```

Emits 的核心作用是让子组件保持通用性。子组件只描述“发生了什么”，父组件决定“具体怎么处理”。

### Slots

Slots 用于父组件向子组件传递模板内容。它适合封装通用容器、布局、弹窗、卡片、表格操作列等内容。

最基础的插槽是默认插槽。

文件位置：`src/components/BaseCard.vue`

```vue
<template>
  <section class="base-card">
    <slot />
  </section>
</template>

<script setup lang="ts">
// 默认插槽用于接收父组件传入的主体内容
</script>

<style scoped lang="scss">
.base-card {
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background-color: #ffffff;
}
</style>
```

父组件使用默认插槽。

文件位置：`src/views/SlotView.vue`

```vue
<template>
  <main class="page-container">
    <BaseCard>
      <h3>用户信息</h3>
      <p>姓名：Ateng</p>
      <p>岗位：Java开发工程师</p>
    </BaseCard>
  </main>
</template>

<script setup lang="ts">
import BaseCard from '@/components/BaseCard.vue'
</script>

<style scoped lang="scss">
.page-container {
  padding: 24px;
}
</style>
```

如果组件需要多个可扩展区域，可以使用具名插槽。

文件位置：`src/components/BasePanel.vue`

```vue
<template>
  <section class="base-panel">
    <header class="base-panel__header">
      <slot name="header" />
    </header>

    <main class="base-panel__body">
      <slot />
    </main>

    <footer class="base-panel__footer">
      <slot name="footer" />
    </footer>
  </section>
</template>

<script setup lang="ts">
// 具名插槽用于拆分头部、主体和底部内容区域
</script>

<style scoped lang="scss">
.base-panel {
  width: 420px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background-color: #ffffff;

  &__header,
  &__footer {
    padding: 12px 16px;
    background-color: #f9fafb;
  }

  &__body {
    padding: 16px;
  }
}
</style>
```

父组件使用具名插槽。

```vue
<template>
  <BasePanel>
    <template #header>
      <strong>面板标题</strong>
    </template>

    <p>这里是面板主体内容。</p>

    <template #footer>
      <button type="button">关闭</button>
      <button type="button">确认</button>
    </template>
  </BasePanel>
</template>
```

插槽可以让组件结构更灵活。组件负责统一外观和布局，父组件负责传入具体展示内容。

## Composition API

Composition API 是 Vue3 推荐的逻辑组织方式。它可以将同一业务功能相关的数据、计算属性、方法、监听逻辑和生命周期逻辑放在一起，使复杂组件更容易维护。

### setup

`setup` 是 Composition API 的入口函数。它会在组件创建之前执行，用于定义响应式数据、方法、计算属性和生命周期逻辑。

在普通 `setup` 写法中，需要手动返回模板中要使用的数据和方法。

文件位置：`src/views/SetupView.vue`

```vue
<template>
  <main class="page-container">
    <h2>{{ title }}</h2>
    <p>当前数量：{{ count }}</p>

    <button type="button" @click="increase">
      数量加 1
    </button>
  </main>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'SetupView',
  setup() {
    const title = ref('setup 基础示例')
    const count = ref(0)

    const increase = () => {
      count.value++
    }

    return {
      title,
      count,
      increase,
    }
  },
})
</script>

<style scoped lang="scss">
.page-container {
  padding: 24px;
}
</style>
```

普通 `setup` 写法可以清楚地看到组件向模板暴露了哪些数据，但代码相对繁琐。Vue3 项目中更推荐使用 `<script setup>`。

### `<script setup>`

`<script setup>` 是 Vue3 提供的编译时语法糖。它让 Composition API 写法更简洁，不需要手动 return，定义的变量、方法、导入的组件都可以直接在模板中使用。

文件位置：`src/views/ScriptSetupView.vue`

```vue
<template>
  <main class="page-container">
    <h2>{{ title }}</h2>
    <p>当前数量：{{ count }}</p>
    <p>数量状态：{{ countStatus }}</p>

    <button type="button" @click="increase">
      数量加 1
    </button>
  </main>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const title = 'script setup 示例'
const count = ref(0)

const countStatus = computed(() => {
  return count.value > 0 ? '已增加' : '初始状态'
})

const increase = () => {
  count.value++
}
</script>

<style scoped lang="scss">
.page-container {
  padding: 24px;
}
</style>
```

`<script setup>` 的常见特点如下：

| 特点              | 说明                                |
| ----------------- | ----------------------------------- |
| 不需要 `return`   | 顶层变量和方法可以直接在模板中使用  |
| 组件自动注册      | `import` 的组件可以直接在模板中使用 |
| TypeScript 支持好 | 可以直接定义 Props、Emits、类型接口 |
| 代码更少          | 适合绝大多数 Vue3 业务组件          |

实际开发中，建议统一使用 `<script setup lang="ts">`，除非项目中存在特殊 Options API 兼容需求。

### 生命周期钩子

生命周期钩子用于在组件不同阶段执行逻辑。Vue3 Composition API 中常用生命周期函数包括 `onMounted`、`onUpdated`、`onUnmounted` 等。

| 生命周期      | 执行时机                        | 常见用途                           |
| ------------- | ------------------------------- | ---------------------------------- |
| `onMounted`   | 组件挂载完成后                  | 调用接口、操作 DOM、初始化图表     |
| `onUpdated`   | 响应式数据更新并完成 DOM 更新后 | 处理依赖 DOM 更新后的逻辑          |
| `onUnmounted` | 组件卸载后                      | 清理定时器、移除事件监听、销毁实例 |

下面是一个定时器示例，演示组件挂载后启动定时器，组件卸载时清理定时器。

文件位置：`src/views/LifecycleView.vue`

```vue
<template>
  <main class="page-container">
    <h2>生命周期钩子示例</h2>
    <p>当前时间：{{ currentTime }}</p>
  </main>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const currentTime = ref('')
let timer: number | undefined

const updateTime = () => {
  currentTime.value = new Date().toLocaleString()
}

onMounted(() => {
  // 组件挂载后初始化数据，并启动定时器
  updateTime()
  timer = window.setInterval(updateTime, 1000)
})

onUnmounted(() => {
  // 组件卸载时清理定时器，避免内存泄漏
  if (timer) {
    window.clearInterval(timer)
  }
})
</script>

<style scoped lang="scss">
.page-container {
  padding: 24px;
}
</style>
```

接口请求也通常放在 `onMounted` 中执行。

```typescript
import { onMounted, ref } from 'vue'

interface User {
  id: number
  name: string
}

const userList = ref<User[]>([])
const loading = ref(false)

const loadUserList = async () => {
  loading.value = true

  try {
    // 实际项目中这里替换为 API 请求
    userList.value = [
      { id: 1, name: 'Ateng' },
      { id: 2, name: 'Tom' },
    ]
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadUserList()
})
```

生命周期中需要重点关注资源释放。凡是手动创建的定时器、事件监听、WebSocket、图表实例，都应该在组件卸载时清理。

### 模板引用

模板引用用于在组件逻辑中获取 DOM 元素或子组件实例。Vue3 中通过 `ref` 和模板上的 `ref` 属性配合使用。

下面示例演示获取输入框 DOM，并在按钮点击时让输入框自动聚焦。

文件位置：`src/views/TemplateRefView.vue`

```vue
<template>
  <main class="page-container">
    <h2>模板引用示例</h2>

    <input
      ref="keywordInputRef"
      v-model="keyword"
      placeholder="请输入关键字"
    />

    <button type="button" @click="focusInput">
      聚焦输入框
    </button>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const keyword = ref('')
const keywordInputRef = ref<HTMLInputElement | null>(null)

const focusInput = () => {
  // 获取输入框 DOM 后调用 focus 方法
  keywordInputRef.value?.focus()
}
</script>

<style scoped lang="scss">
.page-container {
  display: flex;
  gap: 12px;
  padding: 24px;
}

input {
  width: 260px;
  padding: 8px;
}
</style>
```

模板引用也可以用于调用子组件暴露的方法。子组件需要通过 `defineExpose` 明确暴露可被父组件访问的内容。

文件位置：`src/components/SearchForm.vue`

```vue
<template>
  <form class="search-form" @submit.prevent="handleSubmit">
    <input v-model="keyword" placeholder="请输入搜索关键字" />

    <button type="submit">
      搜索
    </button>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const keyword = ref('')

const reset = () => {
  keyword.value = ''
}

const handleSubmit = () => {
  console.log('提交搜索：', keyword.value)
}

// 明确暴露给父组件调用的方法
defineExpose({
  reset,
})
</script>

<style scoped lang="scss">
.search-form {
  display: flex;
  gap: 12px;
}

input {
  width: 260px;
  padding: 8px;
}
</style>
```

父组件中通过模板引用调用子组件方法。

文件位置：`src/views/SearchView.vue`

```vue
<template>
  <main class="page-container">
    <SearchForm ref="searchFormRef" />

    <button type="button" @click="resetSearchForm">
      重置搜索表单
    </button>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SearchForm from '@/components/SearchForm.vue'

const searchFormRef = ref<InstanceType<typeof SearchForm> | null>(null)

const resetSearchForm = () => {
  // 调用子组件通过 defineExpose 暴露的方法
  searchFormRef.value?.reset()
}
</script>

<style scoped lang="scss">
.page-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
}
</style>
```

模板引用适合少量 DOM 操作或调用子组件实例方法。常规数据传递仍然建议优先使用 Props 和 Emits。

### 依赖注入

依赖注入用于跨层级组件传递数据。父级组件通过 `provide` 提供数据，后代组件通过 `inject` 获取数据。它适合主题配置、权限信息、当前用户信息、表单上下文等跨层级共享场景。

下面示例演示父组件提供当前用户信息，深层子组件直接注入使用。

文件位置：`src/views/ProvideView.vue`

```vue
<template>
  <main class="page-container">
    <h2>依赖注入示例</h2>

    <UserInfoPanel />
  </main>
</template>

<script setup lang="ts">
import { provide, reactive } from 'vue'
import UserInfoPanel from '@/components/UserInfoPanel.vue'

export interface CurrentUser {
  id: number
  name: string
  role: string
}

const currentUser = reactive<CurrentUser>({
  id: 1,
  name: 'Ateng',
  role: 'Java开发工程师',
})

// 向后代组件提供当前用户信息
provide('currentUser', currentUser)
</script>

<style scoped lang="scss">
.page-container {
  padding: 24px;
}
</style>
```

后代组件中通过 `inject` 获取数据。

文件位置：`src/components/UserInfoPanel.vue`

```vue
<template>
  <section class="user-info-panel">
    <h3>当前用户</h3>

    <template v-if="currentUser">
      <p>用户 ID：{{ currentUser.id }}</p>
      <p>用户名：{{ currentUser.name }}</p>
      <p>角色：{{ currentUser.role }}</p>
    </template>

    <p v-else class="error-text">
      未获取到当前用户信息
    </p>
  </section>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import type { CurrentUser } from '@/views/ProvideView.vue'

const currentUser = inject<CurrentUser>('currentUser')
</script>

<style scoped lang="scss">
.user-info-panel {
  width: 320px;
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.error-text {
  color: #ef4444;
}
</style>
```

为了避免字符串 Key 写错，实际项目中更推荐把依赖注入的 Key 单独抽离出来。

文件位置：`src/types/injectionKeys.ts`

```typescript
import type { InjectionKey } from 'vue'

export interface CurrentUser {
  id: number
  name: string
  role: string
}

export const currentUserKey: InjectionKey<CurrentUser> = Symbol('currentUser')
```

父组件使用统一的 Key。

```typescript
import { provide, reactive } from 'vue'
import { currentUserKey, type CurrentUser } from '@/types/injectionKeys'

const currentUser = reactive<CurrentUser>({
  id: 1,
  name: 'Ateng',
  role: 'Java开发工程师',
})

provide(currentUserKey, currentUser)
```

子组件使用统一的 Key。

```typescript
import { inject } from 'vue'
import { currentUserKey } from '@/types/injectionKeys'

const currentUser = inject(currentUserKey)
```

依赖注入可以减少跨层级 Props 传递，但不适合替代所有状态管理。如果数据需要被多个页面共享、需要持久化或涉及复杂修改逻辑，建议使用 Pinia 管理。



## 表单与数据绑定

表单与数据绑定主要用于处理用户输入。Vue3 中通常使用 `v-model` 实现表单控件和响应式数据之间的双向绑定，当用户修改输入内容时，脚本中的数据会同步变化；当脚本中的数据变化时，页面表单也会自动更新。

### v-model 基础

`v-model` 是 Vue 中最常用的双向绑定指令，适用于输入框、文本域、单选框、复选框、下拉框以及自定义组件。它本质上是属性绑定和事件绑定的简写。

下面示例演示 `v-model` 的基础使用方式。

文件位置：`src/views/FormModelView.vue`

```vue
<template>
  <main class="page-container">
    <h2>v-model 基础示例</h2>

    <input v-model="username" placeholder="请输入用户名" />

    <p>当前输入的用户名：{{ username }}</p>

    <button type="button" @click="resetUsername">
      重置用户名
    </button>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const username = ref('Ateng')

const resetUsername = () => {
  username.value = ''
}
</script>

<style scoped lang="scss">
.page-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
}

input {
  width: 260px;
  padding: 8px;
}
</style>
```

`v-model` 等价于同时绑定 `value` 和监听 `input` 事件。

```vue
<input :value="username" @input="username = ($event.target as HTMLInputElement).value" />
```

在 Vue3 中，普通表单控件优先使用 `v-model`，这样可以减少手动读取输入值的代码。

### 输入框绑定

输入框绑定常用于登录表单、搜索表单、编辑表单和新增表单。Vue3 中可以通过 `v-model` 绑定普通文本、数字、文本域和下拉选择。

下面示例演示常见输入控件绑定方式，并包含 `trim`、`number` 和 `lazy` 修饰符。

文件位置：`src/views/FormInputView.vue`

```vue
<template>
  <main class="page-container">
    <h2>输入框绑定示例</h2>

    <label>
      用户名：
      <input v-model.trim="formData.username" placeholder="请输入用户名" />
    </label>

    <label>
      年龄：
      <input v-model.number="formData.age" type="number" placeholder="请输入年龄" />
    </label>

    <label>
      简介：
      <textarea v-model.lazy="formData.description" placeholder="请输入个人简介" />
    </label>

    <label>
      岗位：
      <select v-model="formData.role">
        <option value="">请选择岗位</option>
        <option value="Java开发工程师">Java开发工程师</option>
        <option value="前端开发工程师">前端开发工程师</option>
        <option value="测试工程师">测试工程师</option>
      </select>
    </label>

    <section class="preview-panel">
      <h3>表单预览</h3>
      <p>用户名：{{ formData.username }}</p>
      <p>年龄：{{ formData.age }}</p>
      <p>简介：{{ formData.description }}</p>
      <p>岗位：{{ formData.role || '未选择' }}</p>
    </section>
  </main>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

interface UserForm {
  username: string
  age: number | null
  description: string
  role: string
}

const formData = reactive<UserForm>({
  username: '',
  age: null,
  description: '',
  role: '',
})
</script>

<style scoped lang="scss">
.page-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
}

label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 320px;
}

input,
textarea,
select {
  padding: 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
}

textarea {
  min-height: 80px;
  resize: vertical;
}

.preview-panel {
  width: 320px;
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}
</style>
```

常用修饰符如下：

| 修饰符    | 说明                                         |
| --------- | -------------------------------------------- |
| `.trim`   | 自动去除输入内容首尾空格                     |
| `.number` | 自动将输入值转换为数字                       |
| `.lazy`   | 在 `change` 事件后同步，而不是每次输入都同步 |

实际开发中，用户名、手机号、搜索关键字等字段通常可以使用 `.trim`；数字输入框可以使用 `.number`；输入频率较高但不需要实时同步的字段可以使用 `.lazy`。

### 单选与多选绑定

单选和多选绑定主要用于性别、状态、角色、标签、权限等字段。单选框一般绑定字符串、数字或布尔值；多选框一般绑定数组。

下面示例演示单选框、单个复选框、多个复选框和多选下拉框的绑定方式。

文件位置：`src/views/FormChoiceView.vue`

```vue
<template>
  <main class="page-container">
    <h2>单选与多选绑定示例</h2>

    <section class="form-section">
      <h3>状态单选</h3>
      <label>
        <input v-model="formData.status" type="radio" value="enabled" />
        启用
      </label>
      <label>
        <input v-model="formData.status" type="radio" value="disabled" />
        禁用
      </label>
    </section>

    <section class="form-section">
      <h3>是否接收通知</h3>
      <label>
        <input v-model="formData.receiveNotice" type="checkbox" />
        接收系统通知
      </label>
    </section>

    <section class="form-section">
      <h3>技能多选</h3>
      <label>
        <input v-model="formData.skills" type="checkbox" value="Vue3" />
        Vue3
      </label>
      <label>
        <input v-model="formData.skills" type="checkbox" value="TypeScript" />
        TypeScript
      </label>
      <label>
        <input v-model="formData.skills" type="checkbox" value="Spring Boot" />
        Spring Boot
      </label>
    </section>

    <section class="form-section">
      <h3>角色多选</h3>
      <select v-model="formData.roles" multiple>
        <option value="admin">管理员</option>
        <option value="developer">开发人员</option>
        <option value="tester">测试人员</option>
      </select>
    </section>

    <section class="preview-panel">
      <h3>选择结果</h3>
      <p>状态：{{ formData.status }}</p>
      <p>接收通知：{{ formData.receiveNotice ? '是' : '否' }}</p>
      <p>技能：{{ formData.skills.join('、') || '未选择' }}</p>
      <p>角色：{{ formData.roles.join('、') || '未选择' }}</p>
    </section>
  </main>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

interface ChoiceForm {
  status: string
  receiveNotice: boolean
  skills: string[]
  roles: string[]
}

const formData = reactive<ChoiceForm>({
  status: 'enabled',
  receiveNotice: true,
  skills: ['Vue3'],
  roles: ['developer'],
})
</script>

<style scoped lang="scss">
.page-container {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 24px;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

select {
  width: 260px;
  min-height: 90px;
  padding: 8px;
}

.preview-panel {
  width: 360px;
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}
</style>
```

单选绑定时，同一组 `radio` 使用同一个 `v-model`。多选绑定时，同一组 `checkbox` 使用同一个数组变量。数组中保存的是被选中项的 `value`。

### 表单提交处理

表单提交处理通常包含数据绑定、前端校验、提交接口、加载状态和错误提示。Vue3 中可以使用 `@submit.prevent` 监听表单提交，并阻止浏览器默认刷新页面行为。

下面示例演示一个基础用户表单提交流程。

文件位置：`src/views/FormSubmitView.vue`

```vue
<template>
  <main class="page-container">
    <h2>表单提交处理示例</h2>

    <form class="user-form" @submit.prevent="handleSubmit">
      <label>
        用户名：
        <input v-model.trim="formData.username" placeholder="请输入用户名" />
      </label>

      <label>
        手机号：
        <input v-model.trim="formData.mobile" placeholder="请输入手机号" />
      </label>

      <label>
        岗位：
        <select v-model="formData.role">
          <option value="">请选择岗位</option>
          <option value="Java开发工程师">Java开发工程师</option>
          <option value="前端开发工程师">前端开发工程师</option>
          <option value="测试工程师">测试工程师</option>
        </select>
      </label>

      <p v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </p>

      <button type="submit" :disabled="submitting">
        {{ submitting ? '提交中...' : '提交' }}
      </button>
    </form>
  </main>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

interface UserForm {
  username: string
  mobile: string
  role: string
}

const formData = reactive<UserForm>({
  username: '',
  mobile: '',
  role: '',
})

const submitting = ref(false)
const errorMessage = ref('')

const validateForm = () => {
  if (!formData.username) {
    errorMessage.value = '请输入用户名'
    return false
  }

  if (!/^1[3-9]\d{9}$/.test(formData.mobile)) {
    errorMessage.value = '请输入正确的手机号'
    return false
  }

  if (!formData.role) {
    errorMessage.value = '请选择岗位'
    return false
  }

  errorMessage.value = ''
  return true
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  submitting.value = true

  try {
    // 实际项目中这里替换为接口请求，例如 await createUser(formData)
    console.log('提交表单数据：', {
      username: formData.username,
      mobile: formData.mobile,
      role: formData.role,
    })
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped lang="scss">
.page-container {
  padding: 24px;
}

.user-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 320px;
}

label {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

input,
select {
  padding: 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
}

button {
  padding: 8px 12px;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
}

.error-message {
  margin: 0;
  color: #ef4444;
}
</style>
```

实际项目中，表单提交一般需要注意以下几点：

1. 使用 `@submit.prevent` 阻止默认提交行为。
2. 提交前先做必要的前端校验。
3. 提交过程中使用 `submitting` 控制按钮禁用，避免重复提交。
4. 接口异常时显示错误提示。
5. 提交成功后根据业务需要重置表单、关闭弹窗或刷新列表。

## 样式处理

Vue3 支持普通 CSS、Sass、Less、CSS Modules、动态 class、动态 style、scoped 样式和 CSS 变量绑定。实际项目中，组件样式通常使用 `scoped` 控制作用域，并通过 class 绑定、style 绑定和 CSS 变量实现动态样式。

### class 绑定

class 绑定用于根据数据状态动态切换 CSS 类名。常见写法包括对象语法、数组语法和字符串语法。实际开发中，对象语法使用最频繁。

下面示例演示根据用户状态动态切换样式。

文件位置：`src/views/StyleClassView.vue`

```vue
<template>
  <main class="page-container">
    <h2>class 绑定示例</h2>

    <article
      class="user-card"
      :class="{
        'user-card--active': userInfo.active,
        'user-card--disabled': !userInfo.active,
        'user-card--vip': userInfo.vip,
      }"
    >
      <h3>{{ userInfo.name }}</h3>
      <p>状态：{{ userInfo.active ? '启用' : '禁用' }}</p>
      <p>会员：{{ userInfo.vip ? '是' : '否' }}</p>
    </article>

    <button type="button" @click="toggleActive">
      切换状态
    </button>

    <button type="button" @click="toggleVip">
      切换会员
    </button>
  </main>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const userInfo = reactive({
  name: 'Ateng',
  active: true,
  vip: false,
})

const toggleActive = () => {
  userInfo.active = !userInfo.active
}

const toggleVip = () => {
  userInfo.vip = !userInfo.vip
}
</script>

<style scoped lang="scss">
.page-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
}

.user-card {
  width: 320px;
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;

  &--active {
    border-color: #42b883;
    background-color: #f0fdf4;
  }

  &--disabled {
    color: #999999;
    background-color: #f3f4f6;
  }

  &--vip {
    box-shadow: 0 0 0 2px #f59e0b;
  }
}

button {
  width: 120px;
  padding: 8px 12px;
}
</style>
```

数组语法适合组合多个已有 class。

```vue
<div :class="['user-card', userInfo.active ? 'user-card--active' : 'user-card--disabled']">
  用户卡片
</div>
```

对象语法更适合多个状态并存的场景，例如启用、禁用、选中、错误、高亮等。

### style 绑定

style 绑定用于动态设置内联样式。它适合处理少量强动态样式，例如宽度、颜色、字体大小、进度条长度、坐标位置等。

下面示例演示根据响应式数据动态调整进度条样式。

文件位置：`src/views/StyleBindView.vue`

```vue
<template>
  <main class="page-container">
    <h2>style 绑定示例</h2>

    <div class="progress">
      <div
        class="progress__inner"
        :style="{
          width: progress + '%',
          backgroundColor: progressColor,
        }"
      />
    </div>

    <p>当前进度：{{ progress }}%</p>

    <button type="button" @click="increaseProgress">
      增加进度
    </button>

    <button type="button" @click="resetProgress">
      重置进度
    </button>
  </main>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const progress = ref(30)

const progressColor = computed(() => {
  if (progress.value >= 80) {
    return '#22c55e'
  }

  if (progress.value >= 50) {
    return '#f59e0b'
  }

  return '#3b82f6'
})

const increaseProgress = () => {
  progress.value = Math.min(progress.value + 10, 100)
}

const resetProgress = () => {
  progress.value = 0
}
</script>

<style scoped lang="scss">
.page-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
}

.progress {
  width: 360px;
  height: 14px;
  overflow: hidden;
  border-radius: 999px;
  background-color: #e5e7eb;

  &__inner {
    height: 100%;
    transition: width 0.2s ease;
  }
}

button {
  width: 120px;
  padding: 8px 12px;
}
</style>
```

style 绑定也可以绑定一个对象变量。

```typescript
const cardStyle = computed(() => {
  return {
    color: userInfo.active ? '#111827' : '#999999',
    backgroundColor: userInfo.active ? '#ffffff' : '#f3f4f6',
  }
})
```

模板中使用：

```vue
<div :style="cardStyle">
  用户信息
</div>
```

如果样式规则较多，建议优先使用 class 绑定；如果只有少量动态值，使用 style 绑定更直接。

### scoped 样式

`scoped` 用于限制样式只在当前组件内生效，避免组件样式污染其他页面或组件。Vue 单文件组件中，推荐给业务组件样式加上 `scoped`。

下面示例演示 `scoped` 样式的基本使用。

文件位置：`src/views/ScopedStyleView.vue`

```vue
<template>
  <main class="page-container">
    <h2>scoped 样式示例</h2>

    <section class="info-card">
      <h3 class="title">用户信息</h3>
      <p>用户名：Ateng</p>
      <p>岗位：Java开发工程师</p>
    </section>
  </main>
</template>

<script setup lang="ts">
// scoped 样式会限制当前组件中的 class 作用范围
</script>

<style scoped lang="scss">
.page-container {
  padding: 24px;
}

.info-card {
  width: 320px;
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.title {
  margin: 0 0 12px;
  color: #42b883;
}
</style>
```

在 `scoped` 样式中，如果需要影响子组件内部样式，可以使用 `:deep()`。

```vue
<style scoped lang="scss">
.page-container {
  :deep(.el-button) {
    border-radius: 6px;
  }
}
</style>
```

如果需要设置插槽传入内容的样式，可以使用 `:slotted()`。

```vue
<style scoped lang="scss">
:slotted(.slot-title) {
  font-weight: 600;
  color: #42b883;
}
</style>
```

如果确实需要写全局样式，可以使用 `:global()`，但应谨慎使用。

```vue
<style scoped lang="scss">
:global(body) {
  margin: 0;
}
</style>
```

实际项目中建议：

1. 页面组件和业务组件默认使用 `scoped`。
2. 全局基础样式放在 `src/styles` 或 `src/style.css`。
3. 修改第三方组件库内部样式时，优先限制在当前页面根 class 下使用 `:deep()`。
4. 不建议在业务组件中随意写全局样式。

### CSS 变量绑定

Vue3 支持在 `<style>` 中通过 `v-bind()` 绑定脚本中的变量。它适合处理主题色、动态尺寸、动态背景色等样式场景。

下面示例演示通过响应式数据动态修改卡片主题色。

文件位置：`src/views/CssVariableView.vue`

```vue
<template>
  <main class="page-container">
    <h2>CSS 变量绑定示例</h2>

    <section class="theme-card">
      <h3>{{ title }}</h3>
      <p>当前主题色会根据选择自动变化。</p>
    </section>

    <select v-model="themeColor">
      <option value="#42b883">绿色</option>
      <option value="#3b82f6">蓝色</option>
      <option value="#f59e0b">橙色</option>
    </select>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const title = 'Vue3 动态主题卡片'
const themeColor = ref('#42b883')
</script>

<style scoped lang="scss">
.page-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
}

.theme-card {
  width: 360px;
  padding: 16px;
  border: 1px solid v-bind(themeColor);
  border-radius: 8px;
  background-color: color-mix(in srgb, v-bind(themeColor) 10%, white);

  h3 {
    color: v-bind(themeColor);
  }
}

select {
  width: 160px;
  padding: 8px;
}
</style>
```

也可以使用计算属性生成动态样式值。

```typescript
import { computed, ref } from 'vue'

const size = ref(16)

const titleFontSize = computed(() => {
  return `${size.value}px`
})
```

样式中绑定：

```vue
<style scoped lang="scss">
.title {
  font-size: v-bind(titleFontSize);
}
</style>
```

CSS 变量绑定适合在样式中复用动态值。如果只是单个元素的简单样式，也可以直接使用 `:style`。

## 指令基础

指令是 Vue 模板中以 `v-` 开头的特殊属性，用于给 DOM 添加响应式行为。Vue 提供了很多内置指令，例如 `v-if`、`v-for`、`v-bind`、`v-on`、`v-model` 等。除了内置指令，也可以根据业务需要封装自定义指令。

### 内置指令

内置指令覆盖了 Vue 模板开发中的大多数场景，包括数据展示、属性绑定、事件监听、条件渲染、列表渲染、表单绑定和插槽内容。

常用内置指令如下：

| 指令      | 说明                           |
| --------- | ------------------------------ |
| `v-text`  | 设置元素文本内容               |
| `v-html`  | 设置元素 HTML 内容             |
| `v-if`    | 条件渲染，控制 DOM 创建和销毁  |
| `v-show`  | 条件显示，控制 `display` 样式  |
| `v-for`   | 列表渲染                       |
| `v-bind`  | 属性绑定，简写为 `:`           |
| `v-on`    | 事件绑定，简写为 `@`           |
| `v-model` | 表单双向绑定                   |
| `v-slot`  | 插槽绑定，简写为 `#`           |
| `v-pre`   | 跳过当前元素和子元素编译       |
| `v-once`  | 只渲染一次，后续不再更新       |
| `v-cloak` | 防止页面编译前显示未解析模板   |
| `v-memo`  | 缓存模板片段，优化部分列表渲染 |

下面示例集中演示部分常用内置指令。

文件位置：`src/views/BuiltInDirectiveView.vue`

```vue
<template>
  <main class="page-container">
    <h2 v-text="title" />

    <p>{{ description }}</p>

    <p v-if="loading">数据加载中...</p>

    <template v-else>
      <ul class="user-list">
        <li v-for="user in userList" :key="user.id">
          <span>{{ user.name }}</span>
          <span>{{ user.role }}</span>
        </li>
      </ul>
    </template>

    <p v-show="showTip" class="tip-text">
      这里是通过 v-show 控制显示的提示信息。
    </p>

    <input v-model="keyword" placeholder="请输入关键字" />

    <button type="button" :disabled="!keyword" @click="handleSearch">
      搜索
    </button>

    <p v-once>该内容只会渲染一次：{{ onceText }}</p>

    <p v-pre>{{ 这里的内容不会被 Vue 编译 }}</p>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface User {
  id: number
  name: string
  role: string
}

const title = '内置指令示例'
const description = '本示例演示 Vue3 常用内置指令的基础用法。'

const loading = ref(false)
const showTip = ref(true)
const keyword = ref('')
const onceText = ref('初始化内容')

const userList = ref<User[]>([
  { id: 1, name: 'Ateng', role: 'Java开发工程师' },
  { id: 2, name: 'Tom', role: '前端开发工程师' },
])

const handleSearch = () => {
  console.log('搜索关键字：', keyword.value)
}
</script>

<style scoped lang="scss">
.page-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
}

.user-list {
  width: 360px;
  padding: 0;
  list-style: none;

  li {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid #e5e7eb;
  }
}

.tip-text {
  color: #42b883;
}

input {
  width: 260px;
  padding: 8px;
}

button {
  width: 100px;
  padding: 8px 12px;
}
</style>
```

`v-html` 可以渲染 HTML 字符串，但它可能带来 XSS 风险。如果内容来自用户输入或外部接口，必须先进行安全过滤，不建议直接渲染。

```vue
<template>
  <div v-html="safeHtml" />
</template>

<script setup lang="ts">
const safeHtml = '<strong>仅渲染可信 HTML 内容</strong>'
</script>
```

实际开发中，优先使用文本插值 `{{ }}`。只有在确实需要渲染富文本内容时，才考虑使用 `v-html`。

### 自定义指令

自定义指令用于封装可复用的 DOM 行为，例如自动聚焦、权限控制、按钮防抖、图片懒加载、滚动加载等。Vue3 中可以在组件内定义局部指令，也可以在入口文件中注册全局指令。

下面示例演示局部自定义指令 `v-focus`，用于页面加载后自动聚焦输入框。

文件位置：`src/views/CustomDirectiveFocusView.vue`

```vue
<template>
  <main class="page-container">
    <h2>自定义指令 v-focus 示例</h2>

    <input v-focus v-model="keyword" placeholder="页面加载后自动聚焦" />

    <p>当前输入：{{ keyword }}</p>
  </main>
</template>

<script setup lang="ts">
import { ref, type Directive } from 'vue'

const keyword = ref('')

const vFocus: Directive<HTMLInputElement> = {
  mounted(el) {
    // 元素挂载完成后自动聚焦
    el.focus()
  },
}
</script>

<style scoped lang="scss">
.page-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
}

input {
  width: 280px;
  padding: 8px;
}
</style>
```

在 `<script setup>` 中，局部自定义指令变量必须以 `v` 开头，并使用驼峰命名。例如 `vFocus` 在模板中对应 `v-focus`。

下面示例演示一个简单的权限指令 `v-permission`。如果当前用户没有指定权限，则移除按钮。

文件位置：`src/views/CustomDirectivePermissionView.vue`

```vue
<template>
  <main class="page-container">
    <h2>自定义指令 v-permission 示例</h2>

    <button v-permission="'user:create'" type="button">
      新增用户
    </button>

    <button v-permission="'user:delete'" type="button">
      删除用户
    </button>
  </main>
</template>

<script setup lang="ts">
import type { Directive, DirectiveBinding } from 'vue'

const permissionList = ['user:create', 'user:update']

const hasPermission = (permission: string) => {
  return permissionList.includes(permission)
}

const vPermission: Directive<HTMLElement, string> = {
  mounted(el: HTMLElement, binding: DirectiveBinding<string>) {
    const permission = binding.value

    if (!hasPermission(permission)) {
      // 没有权限时移除元素
      el.parentNode?.removeChild(el)
    }
  },
}
</script>

<style scoped lang="scss">
.page-container {
  display: flex;
  gap: 12px;
  padding: 24px;
}

button {
  padding: 8px 12px;
}
</style>
```

如果某个指令需要在多个页面使用，可以注册为全局指令。

文件位置：`src/directives/focus.ts`

```typescript
import type { Directive } from 'vue'

export const focusDirective: Directive<HTMLInputElement> = {
  mounted(el) {
    // 元素挂载完成后自动聚焦
    el.focus()
  },
}
```

在入口文件中注册全局指令。

文件位置：`src/main.ts`

```typescript
import { createApp } from 'vue'
import App from './App.vue'
import { focusDirective } from './directives/focus'
import './style.css'

const app = createApp(App)

// 注册全局自定义指令，模板中使用 v-focus
app.directive('focus', focusDirective)

app.mount('#app')
```

任意组件中都可以直接使用：

```vue
<template>
  <input v-focus placeholder="自动聚焦输入框" />
</template>
```

自定义指令适合处理直接操作 DOM 的逻辑。如果逻辑主要是状态管理、接口请求、业务计算或组件通信，优先使用组合式函数、组件封装或 Pinia，而不是强行封装成指令。



## 组件复用

组件复用用于减少重复代码，提高页面开发效率。Vue3 中常见的复用方式包括组合式函数、通用组件封装和组件状态抽离。一般来说，视图结构复用优先封装组件，逻辑复用优先封装组合式函数，跨页面共享状态再考虑 Pinia。

### 组合式函数

组合式函数是 Vue3 中复用逻辑的常用方式，通常以 `use` 开头命名，例如 `useCounter`、`useUserList`、`useLoading`。它可以把响应式状态、计算属性、方法、监听逻辑和生命周期逻辑封装到独立文件中。

下面先封装一个计数器组合式函数。

文件位置：`src/composables/useCounter.ts`

```typescript
import { computed, ref } from 'vue'

export const useCounter = (initialValue = 0) => {
  const count = ref(initialValue)

  const isZero = computed(() => {
    return count.value === 0
  })

  const increase = () => {
    count.value++
  }

  const decrease = () => {
    if (count.value <= 0) {
      return
    }

    count.value--
  }

  const reset = () => {
    count.value = initialValue
  }

  return {
    count,
    isZero,
    increase,
    decrease,
    reset,
  }
}
```

在页面组件中使用该组合式函数。

文件位置：`src/views/ReuseCounterView.vue`

```vue
<template>
  <main class="page-container">
    <h2>组合式函数示例</h2>

    <p>当前数量：{{ count }}</p>
    <p>是否为初始状态：{{ isZero ? '是' : '否' }}</p>

    <div class="button-group">
      <button type="button" @click="increase">
        加 1
      </button>

      <button type="button" :disabled="isZero" @click="decrease">
        减 1
      </button>

      <button type="button" @click="reset">
        重置
      </button>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useCounter } from '@/composables/useCounter'

const { count, isZero, increase, decrease, reset } = useCounter(0)
</script>

<style scoped lang="scss">
.page-container {
  padding: 24px;
}

.button-group {
  display: flex;
  gap: 12px;
}

button {
  padding: 8px 12px;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
}
</style>
```

组合式函数更适合封装纯逻辑。例如分页、查询条件、弹窗显示隐藏、加载状态、接口请求、表格选择状态等，都可以抽离为组合式函数。

下面再封装一个列表查询相关的组合式函数，用于管理关键字、分页和查询方法。

文件位置：`src/composables/useUserQuery.ts`

```typescript
import { computed, reactive, ref } from 'vue'

interface UserItem {
  id: number
  name: string
  role: string
}

interface QueryParams {
  keyword: string
  pageNum: number
  pageSize: number
}

const mockUserList: UserItem[] = [
  { id: 1, name: 'Ateng', role: 'Java开发工程师' },
  { id: 2, name: 'Tom', role: '前端开发工程师' },
  { id: 3, name: 'Jerry', role: '测试工程师' },
]

export const useUserQuery = () => {
  const queryParams = reactive<QueryParams>({
    keyword: '',
    pageNum: 1,
    pageSize: 10,
  })

  const userList = ref<UserItem[]>([])

  const hasUser = computed(() => {
    return userList.value.length > 0
  })

  const queryUserList = () => {
    const keyword = queryParams.keyword.trim()

    if (!keyword) {
      userList.value = mockUserList
      return
    }

    userList.value = mockUserList.filter((item) => {
      return item.name.includes(keyword) || item.role.includes(keyword)
    })
  }

  const resetQuery = () => {
    queryParams.keyword = ''
    queryParams.pageNum = 1
    queryUserList()
  }

  return {
    queryParams,
    userList,
    hasUser,
    queryUserList,
    resetQuery,
  }
}
```

在页面中直接复用查询逻辑。

文件位置：`src/views/ReuseUserQueryView.vue`

```vue
<template>
  <main class="page-container">
    <h2>用户查询</h2>

    <div class="search-bar">
      <input v-model="queryParams.keyword" placeholder="请输入用户名或岗位" />

      <button type="button" @click="queryUserList">
        查询
      </button>

      <button type="button" @click="resetQuery">
        重置
      </button>
    </div>

    <ul v-if="hasUser" class="user-list">
      <li v-for="user in userList" :key="user.id">
        <span>{{ user.name }}</span>
        <span>{{ user.role }}</span>
      </li>
    </ul>

    <p v-else class="empty-text">
      暂无用户数据
    </p>
  </main>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useUserQuery } from '@/composables/useUserQuery'

const {
  queryParams,
  userList,
  hasUser,
  queryUserList,
  resetQuery,
} = useUserQuery()

onMounted(() => {
  queryUserList()
})
</script>

<style scoped lang="scss">
.page-container {
  padding: 24px;
}

.search-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

input {
  width: 260px;
  padding: 8px;
}

button {
  padding: 8px 12px;
}

.user-list {
  width: 420px;
  padding: 0;
  list-style: none;

  li {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid #e5e7eb;
  }
}

.empty-text {
  color: #999999;
}
</style>
```

组合式函数的重点不是“把代码移出去”，而是把可复用、可测试、和页面结构无关的逻辑沉淀出来。页面组件应该更关注模板结构和页面组合，复杂逻辑应逐步抽离到 `src/composables` 中。

### 通用组件封装

通用组件封装用于复用页面结构和交互样式。常见通用组件包括按钮、卡片、弹窗、表格、空状态、搜索表单、上传组件等。封装通用组件时，应尽量通过 Props 控制展示，通过 Emits 抛出事件，通过 Slots 扩展内容。

下面封装一个通用空状态组件。

文件位置：`src/components/common/BaseEmpty.vue`

```vue
<template>
  <section class="base-empty">
    <p class="base-empty__title">{{ title }}</p>
    <p v-if="description" class="base-empty__description">
      {{ description }}
    </p>

    <div v-if="$slots.default" class="base-empty__action">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  description?: string
}

withDefaults(defineProps<Props>(), {
  title: '暂无数据',
  description: '',
})
</script>

<style scoped lang="scss">
.base-empty {
  width: 100%;
  padding: 32px 16px;
  text-align: center;
  color: #666666;
  background-color: #f9fafb;
  border: 1px dashed #d1d5db;
  border-radius: 8px;

  &__title {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
  }

  &__description {
    margin: 8px 0 0;
    font-size: 14px;
    color: #999999;
  }

  &__action {
    margin-top: 16px;
  }
}
</style>
```

在页面中使用空状态组件。

文件位置：`src/views/BaseEmptyDemoView.vue`

```vue
<template>
  <main class="page-container">
    <h2>通用空状态组件示例</h2>

    <BaseEmpty
      title="暂无用户数据"
      description="请新增用户后再查看列表"
    >
      <button type="button" @click="handleCreate">
        新增用户
      </button>
    </BaseEmpty>
  </main>
</template>

<script setup lang="ts">
import BaseEmpty from '@/components/common/BaseEmpty.vue'

const handleCreate = () => {
  console.log('跳转新增用户页面')
}
</script>

<style scoped lang="scss">
.page-container {
  padding: 24px;
}

button {
  padding: 8px 12px;
}
</style>
```

下面再封装一个通用确认弹窗组件。它通过 Props 接收显示状态、标题和内容，通过 Emits 通知父组件取消或确认。

文件位置：`src/components/common/BaseConfirmDialog.vue`

```vue
<template>
  <div v-if="visible" class="dialog-mask">
    <section class="dialog">
      <header class="dialog__header">
        <h3>{{ title }}</h3>
      </header>

      <main class="dialog__body">
        <slot>
          <p>{{ content }}</p>
        </slot>
      </main>

      <footer class="dialog__footer">
        <button type="button" @click="handleCancel">
          {{ cancelText }}
        </button>

        <button class="primary-button" type="button" @click="handleConfirm">
          {{ confirmText }}
        </button>
      </footer>
    </section>
  </div>
</template>

<script setup lang="ts">
interface Props {
  visible: boolean
  title?: string
  content?: string
  cancelText?: string
  confirmText?: string
}

withDefaults(defineProps<Props>(), {
  title: '操作确认',
  content: '',
  cancelText: '取消',
  confirmText: '确认',
})

const emit = defineEmits<{
  cancel: []
  confirm: []
}>()

const handleCancel = () => {
  emit('cancel')
}

const handleConfirm = () => {
  emit('confirm')
}
</script>

<style scoped lang="scss">
.dialog-mask {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgb(0 0 0 / 40%);
}

.dialog {
  width: 380px;
  border-radius: 8px;
  background-color: #ffffff;
  overflow: hidden;

  &__header {
    padding: 16px;
    border-bottom: 1px solid #e5e7eb;

    h3 {
      margin: 0;
      font-size: 18px;
    }
  }

  &__body {
    padding: 16px;
    color: #333333;
  }

  &__footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding: 16px;
    border-top: 1px solid #e5e7eb;
  }
}

button {
  padding: 8px 12px;
  cursor: pointer;
}

.primary-button {
  color: #ffffff;
  border: none;
  background-color: #42b883;
}
</style>
```

在业务页面中使用通用确认弹窗。

文件位置：`src/views/BaseDialogDemoView.vue`

```vue
<template>
  <main class="page-container">
    <h2>通用确认弹窗示例</h2>

    <button type="button" @click="openDialog">
      删除用户
    </button>

    <BaseConfirmDialog
      :visible="dialogVisible"
      title="删除确认"
      content="确定要删除当前用户吗？删除后不可恢复。"
      @cancel="closeDialog"
      @confirm="handleConfirmDelete"
    />
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BaseConfirmDialog from '@/components/common/BaseConfirmDialog.vue'

const dialogVisible = ref(false)

const openDialog = () => {
  dialogVisible.value = true
}

const closeDialog = () => {
  dialogVisible.value = false
}

const handleConfirmDelete = () => {
  console.log('执行删除用户操作')
  dialogVisible.value = false
}
</script>

<style scoped lang="scss">
.page-container {
  padding: 24px;
}

button {
  padding: 8px 12px;
}
</style>
```

封装通用组件时需要注意：通用组件只处理通用交互，不应该耦合具体业务接口。例如确认弹窗只负责展示和触发确认事件，不应该直接调用删除用户接口。

### 组件状态抽离

组件状态抽离是指把页面中复杂的状态管理逻辑从 `.vue` 文件中拆出去，使页面组件更清晰。它通常使用组合式函数实现，适合处理搜索状态、分页状态、弹窗状态、选择状态、加载状态等。

下面示例先展示一个抽离前的页面，所有状态都写在页面组件中。

```typescript
const selectedUserIds = ref<number[]>([])
const allChecked = computed(() => selectedUserIds.value.length === userList.value.length)
const toggleSelect = (id: number) => {}
const clearSelected = () => {}
```

当选择逻辑变复杂后，可以抽离成独立组合式函数。

文件位置：`src/composables/useSelection.ts`

```typescript
import { computed, ref } from 'vue'

export const useSelection = <T extends string | number>() => {
  const selectedKeys = ref<T[]>([])

  const selectedCount = computed(() => {
    return selectedKeys.value.length
  })

  const hasSelected = computed(() => {
    return selectedKeys.value.length > 0
  })

  const isSelected = (key: T) => {
    return selectedKeys.value.includes(key)
  }

  const toggleSelect = (key: T) => {
    if (isSelected(key)) {
      selectedKeys.value = selectedKeys.value.filter((item) => item !== key)
      return
    }

    selectedKeys.value.push(key)
  }

  const selectAll = (keys: T[]) => {
    selectedKeys.value = [...keys]
  }

  const clearSelected = () => {
    selectedKeys.value = []
  }

  return {
    selectedKeys,
    selectedCount,
    hasSelected,
    isSelected,
    toggleSelect,
    selectAll,
    clearSelected,
  }
}
```

页面中只保留视图相关代码，把选择状态交给 `useSelection` 管理。

文件位置：`src/views/SelectionStateView.vue`

```vue
<template>
  <main class="page-container">
    <h2>组件状态抽离示例</h2>

    <div class="toolbar">
      <button type="button" @click="selectAll(userIds)">
        全选
      </button>

      <button type="button" :disabled="!hasSelected" @click="clearSelected">
        清空选择
      </button>

      <span>已选择：{{ selectedCount }} 项</span>
    </div>

    <ul class="user-list">
      <li v-for="user in userList" :key="user.id">
        <label>
          <input
            type="checkbox"
            :checked="isSelected(user.id)"
            @change="toggleSelect(user.id)"
          />
          {{ user.name }} - {{ user.role }}
        </label>
      </li>
    </ul>

    <p>已选择 ID：{{ selectedKeys.join('、') || '暂无' }}</p>
  </main>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useSelection } from '@/composables/useSelection'

interface UserItem {
  id: number
  name: string
  role: string
}

const userList = ref<UserItem[]>([
  { id: 1, name: 'Ateng', role: 'Java开发工程师' },
  { id: 2, name: 'Tom', role: '前端开发工程师' },
  { id: 3, name: 'Jerry', role: '测试工程师' },
])

const userIds = computed(() => {
  return userList.value.map((item) => item.id)
})

const {
  selectedKeys,
  selectedCount,
  hasSelected,
  isSelected,
  toggleSelect,
  selectAll,
  clearSelected,
} = useSelection<number>()
</script>

<style scoped lang="scss">
.page-container {
  padding: 24px;
}

.toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

button {
  padding: 8px 12px;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
}

.user-list {
  padding: 0;
  list-style: none;

  li {
    padding: 8px 0;
  }
}
</style>
```

状态抽离后，页面组件只需要关注“如何展示”，组合式函数负责“如何管理状态”。这种方式可以提升复杂页面的可读性，也方便多个页面复用同一套状态逻辑。

## 异步与状态处理

异步与状态处理主要用于管理接口请求过程中的数据、加载状态、错误信息和空数据状态。实际项目中，一个完整的异步流程通常包含：请求前设置加载状态，请求成功后更新数据，请求失败后记录错误，请求结束后关闭加载状态。

### 异步数据加载

异步数据加载通常在页面初始化时执行，也可以在用户点击查询、切换分页、修改筛选条件时执行。Vue3 中常用 `async / await` 编写异步逻辑，并配合 `onMounted` 在页面挂载后加载数据。

下面先定义一个模拟接口文件。

文件位置：`src/api/user.ts`

```typescript
export interface UserItem {
  id: number
  name: string
  role: string
}

export const getUserList = async (): Promise<UserItem[]> => {
  return new Promise((resolve) => {
    window.setTimeout(() => {
      resolve([
        { id: 1, name: 'Ateng', role: 'Java开发工程师' },
        { id: 2, name: 'Tom', role: '前端开发工程师' },
        { id: 3, name: 'Jerry', role: '测试工程师' },
      ])
    }, 800)
  })
}
```

页面中调用异步接口加载数据。

文件位置：`src/views/AsyncLoadView.vue`

```vue
<template>
  <main class="page-container">
    <h2>异步数据加载示例</h2>

    <ul class="user-list">
      <li v-for="user in userList" :key="user.id">
        <span>{{ user.name }}</span>
        <span>{{ user.role }}</span>
      </li>
    </ul>
  </main>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getUserList, type UserItem } from '@/api/user'

const userList = ref<UserItem[]>([])

const loadUserList = async () => {
  const result = await getUserList()
  userList.value = result
}

onMounted(() => {
  loadUserList()
})
</script>

<style scoped lang="scss">
.page-container {
  padding: 24px;
}

.user-list {
  width: 420px;
  padding: 0;
  list-style: none;

  li {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid #e5e7eb;
  }
}
</style>
```

上面的示例只演示了最基础的数据加载。实际项目中不建议只写成功路径，还需要补充加载状态、错误状态和空数据状态。

### 加载状态处理

加载状态用于告诉用户当前数据正在请求中，同时也可以避免重复点击或重复提交。常见状态包括页面加载、按钮提交中、局部区域刷新中等。

下面示例在异步加载用户列表时增加 `loading` 和空数据判断。

文件位置：`src/views/LoadingStateView.vue`

```vue
<template>
  <main class="page-container">
    <h2>加载状态处理示例</h2>

    <button type="button" :disabled="loading" @click="loadUserList">
      {{ loading ? '加载中...' : '重新加载' }}
    </button>

    <p v-if="loading" class="loading-text">
      数据加载中，请稍候...
    </p>

    <ul v-else-if="userList.length > 0" class="user-list">
      <li v-for="user in userList" :key="user.id">
        <span>{{ user.name }}</span>
        <span>{{ user.role }}</span>
      </li>
    </ul>

    <p v-else class="empty-text">
      暂无用户数据
    </p>
  </main>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getUserList, type UserItem } from '@/api/user'

const loading = ref(false)
const userList = ref<UserItem[]>([])

const loadUserList = async () => {
  loading.value = true

  try {
    userList.value = await getUserList()
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadUserList()
})
</script>

<style scoped lang="scss">
.page-container {
  padding: 24px;
}

button {
  margin-bottom: 16px;
  padding: 8px 12px;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
}

.loading-text {
  color: #3b82f6;
}

.empty-text {
  color: #999999;
}

.user-list {
  width: 420px;
  padding: 0;
  list-style: none;

  li {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid #e5e7eb;
  }
}
</style>
```

加载状态处理的关键点是使用 `finally` 关闭加载状态。无论请求成功还是失败，都应该结束 loading，避免页面一直停留在加载中。

实际开发中可以按以下方式拆分加载状态：

| 状态变量        | 适用场景     |
| --------------- | ------------ |
| `pageLoading`   | 页面首次加载 |
| `tableLoading`  | 表格数据刷新 |
| `submitLoading` | 表单提交     |
| `buttonLoading` | 某个按钮操作 |
| `uploadLoading` | 文件上传     |

如果一个页面中存在多个异步操作，不建议全部共用一个 `loading`，否则容易造成状态互相影响。

### 错误状态处理

错误状态处理用于在请求失败时给用户明确反馈，并提供重试能力。实际项目中，接口请求可能因为网络异常、权限不足、参数错误、服务端异常等原因失败，因此异步请求应尽量使用 `try / catch / finally` 结构。

下面先扩展一个可能失败的模拟接口。

文件位置：`src/api/user.ts`

```typescript
export interface UserItem {
  id: number
  name: string
  role: string
}

export const getUserList = async (): Promise<UserItem[]> => {
  return new Promise((resolve) => {
    window.setTimeout(() => {
      resolve([
        { id: 1, name: 'Ateng', role: 'Java开发工程师' },
        { id: 2, name: 'Tom', role: '前端开发工程师' },
        { id: 3, name: 'Jerry', role: '测试工程师' },
      ])
    }, 800)
  })
}

export const getUserListWithError = async (): Promise<UserItem[]> => {
  return new Promise((resolve, reject) => {
    window.setTimeout(() => {
      const success = Math.random() > 0.5

      if (success) {
        resolve([
          { id: 1, name: 'Ateng', role: 'Java开发工程师' },
          { id: 2, name: 'Tom', role: '前端开发工程师' },
        ])
        return
      }

      reject(new Error('用户列表加载失败，请稍后重试'))
    }, 800)
  })
}
```

页面中统一处理加载、错误、空数据和正常数据状态。

文件位置：`src/views/ErrorStateView.vue`

```vue
<template>
  <main class="page-container">
    <h2>错误状态处理示例</h2>

    <button type="button" :disabled="loading" @click="loadUserList">
      {{ loading ? '加载中...' : '加载用户列表' }}
    </button>

    <p v-if="loading" class="loading-text">
      数据加载中，请稍候...
    </p>

    <section v-else-if="errorMessage" class="error-panel">
      <p>{{ errorMessage }}</p>

      <button type="button" @click="loadUserList">
        重试
      </button>
    </section>

    <ul v-else-if="userList.length > 0" class="user-list">
      <li v-for="user in userList" :key="user.id">
        <span>{{ user.name }}</span>
        <span>{{ user.role }}</span>
      </li>
    </ul>

    <p v-else class="empty-text">
      暂无用户数据
    </p>
  </main>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getUserListWithError, type UserItem } from '@/api/user'

const loading = ref(false)
const errorMessage = ref('')
const userList = ref<UserItem[]>([])

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message
  }

  return '系统异常，请稍后重试'
}

const loadUserList = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    userList.value = await getUserListWithError()
  } catch (error) {
    userList.value = []
    errorMessage.value = getErrorMessage(error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadUserList()
})
</script>

<style scoped lang="scss">
.page-container {
  padding: 24px;
}

button {
  margin-bottom: 16px;
  padding: 8px 12px;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
}

.loading-text {
  color: #3b82f6;
}

.error-panel {
  width: 360px;
  padding: 16px;
  color: #b91c1c;
  border: 1px solid #fecaca;
  border-radius: 8px;
  background-color: #fef2f2;
}

.empty-text {
  color: #999999;
}

.user-list {
  width: 420px;
  padding: 0;
  list-style: none;

  li {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid #e5e7eb;
  }
}
</style>
```

错误状态处理需要注意以下几点：

1. 请求开始前清空上一次错误信息。
2. 请求失败时清空或保留旧数据，需要根据业务决定。
3. `catch` 中不要假设错误一定是 `Error` 类型，可以使用 `unknown` 处理。
4. `finally` 中关闭加载状态，避免页面卡住。
5. 错误区域最好提供重试按钮，方便用户重新发起请求。

异步状态可以抽离为组合式函数，避免多个页面重复写 `loading`、`errorMessage`、`try / catch / finally`。

文件位置：`src/composables/useAsyncState.ts`

```typescript
import { ref } from 'vue'

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message
  }

  return '系统异常，请稍后重试'
}

export const useAsyncState = <T>() => {
  const loading = ref(false)
  const errorMessage = ref('')
  const data = ref<T | null>(null)

  const execute = async (request: () => Promise<T>) => {
    loading.value = true
    errorMessage.value = ''

    try {
      data.value = await request()
    } catch (error) {
      data.value = null
      errorMessage.value = getErrorMessage(error)
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    errorMessage,
    data,
    execute,
  }
}
```

页面中使用通用异步状态函数。

文件位置：`src/views/AsyncStateReuseView.vue`

```vue
<template>
  <main class="page-container">
    <h2>异步状态抽离示例</h2>

    <button type="button" :disabled="loading" @click="loadUserList">
      {{ loading ? '加载中...' : '加载数据' }}
    </button>

    <p v-if="loading" class="loading-text">
      数据加载中...
    </p>

    <p v-else-if="errorMessage" class="error-text">
      {{ errorMessage }}
    </p>

    <ul v-else-if="data && data.length > 0" class="user-list">
      <li v-for="user in data" :key="user.id">
        <span>{{ user.name }}</span>
        <span>{{ user.role }}</span>
      </li>
    </ul>

    <p v-else class="empty-text">
      暂无用户数据
    </p>
  </main>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { getUserListWithError, type UserItem } from '@/api/user'
import { useAsyncState } from '@/composables/useAsyncState'

const {
  loading,
  errorMessage,
  data,
  execute,
} = useAsyncState<UserItem[]>()

const loadUserList = () => {
  execute(getUserListWithError)
}

onMounted(() => {
  loadUserList()
})
</script>

<style scoped lang="scss">
.page-container {
  padding: 24px;
}

button {
  margin-bottom: 16px;
  padding: 8px 12px;
}

.loading-text {
  color: #3b82f6;
}

.error-text {
  color: #ef4444;
}

.empty-text {
  color: #999999;
}

.user-list {
  width: 420px;
  padding: 0;
  list-style: none;

  li {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid #e5e7eb;
  }
}
</style>
```

在 Vue3 项目中，一个较完整的异步页面通常至少包含四类状态：加载中、加载失败、空数据和正常数据。这样页面不会只在接口成功时可用，也能覆盖真实项目中的异常场景。



## 项目开发实践

项目开发实践主要用于规范 Vue3 项目的目录组织、命名方式、组件拆分思路和基础调试方法。良好的项目规范可以降低后续维护成本，也能让多人协作时的代码结构更加统一。

### 目录组织

Vue3 项目通常以 `src` 作为核心源码目录。实际开发中，建议按功能职责划分目录，例如页面、组件、接口、状态、工具函数、类型声明、路由、样式等。

推荐目录结构如下：

```text
vue3-basic-demo
├── public
│   └── favicon.ico
├── src
│   ├── api
│   │   └── user.ts
│   ├── assets
│   │   └── images
│   ├── components
│   │   ├── common
│   │   │   ├── BaseEmpty.vue
│   │   │   └── BaseConfirmDialog.vue
│   │   └── user
│   │       ├── UserSearchForm.vue
│   │       └── UserTable.vue
│   ├── composables
│   │   ├── useAsyncState.ts
│   │   └── useSelection.ts
│   ├── directives
│   │   └── focus.ts
│   ├── router
│   │   └── index.ts
│   ├── stores
│   │   └── user.ts
│   ├── styles
│   │   ├── index.scss
│   │   └── variables.scss
│   ├── types
│   │   └── user.ts
│   ├── utils
│   │   └── request.ts
│   ├── views
│   │   └── user
│   │       └── UserListView.vue
│   ├── App.vue
│   └── main.ts
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

常见目录说明如下：

| 目录              | 说明                                   |
| ----------------- | -------------------------------------- |
| `src/api`         | 接口请求模块，按业务模块拆分           |
| `src/assets`      | 图片、字体、静态资源                   |
| `src/components`  | 组件目录，通用组件和业务组件可分层管理 |
| `src/composables` | 组合式函数目录，用于复用逻辑           |
| `src/directives`  | 自定义指令目录                         |
| `src/router`      | 路由配置                               |
| `src/stores`      | Pinia 状态管理                         |
| `src/styles`      | 全局样式、变量、重置样式               |
| `src/types`       | TypeScript 类型声明                    |
| `src/utils`       | 工具函数                               |
| `src/views`       | 页面级组件                             |

为了避免大量 `../../../` 相对路径，项目中通常会配置路径别名 `@` 指向 `src`。

文件位置：`vite.config.ts`

```typescript
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      // 使用 @ 指向 src 目录，简化模块导入路径
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
```

同时建议在 `tsconfig.json` 中配置路径提示，使 TypeScript 能识别 `@` 别名。

文件位置：`tsconfig.json`

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

配置完成后，组件中可以这样导入模块：

```typescript
import UserTable from '@/components/user/UserTable.vue'
import { getUserList } from '@/api/user'
import type { UserItem } from '@/types/user'
```

目录组织的基本原则是：页面放在 `views`，可复用组件放在 `components`，可复用逻辑放在 `composables`，接口请求放在 `api`，公共类型放在 `types`，不要把所有代码都堆在页面组件中。

### 命名规范

命名规范用于统一项目中目录、文件、组件、变量、函数和类型的命名方式。统一命名可以提高代码可读性，减少团队协作时的理解成本。

推荐命名规则如下：

| 类型         | 推荐命名                   | 示例                                 |
| ------------ | -------------------------- | ------------------------------------ |
| 页面组件     | 大驼峰 + `View`            | `UserListView.vue`                   |
| 普通组件     | 大驼峰                     | `UserTable.vue`                      |
| 基础组件     | `Base` 前缀                | `BaseEmpty.vue`                      |
| 组合式函数   | `use` 前缀                 | `useUserQuery.ts`                    |
| 接口文件     | 小驼峰或业务名             | `user.ts`、`order.ts`                |
| 类型文件     | 小驼峰或业务名             | `user.ts`                            |
| 变量         | 小驼峰                     | `userList`、`queryParams`            |
| 函数         | 动词开头                   | `loadUserList`、`handleSubmit`       |
| 布尔变量     | `is` / `has` / `show` 前缀 | `isLoading`、`hasData`、`showDialog` |
| 事件处理函数 | `handle` 前缀              | `handleDelete`、`handleSearch`       |

组件文件建议使用大驼峰命名。

```text
推荐：
UserTable.vue
UserSearchForm.vue
BaseConfirmDialog.vue

不推荐：
user-table.vue
user_search_form.vue
confirm.vue
```

组合式函数建议统一使用 `use` 前缀。

```text
推荐：
useUserQuery.ts
useAsyncState.ts
useSelection.ts

不推荐：
userQuery.ts
async.ts
selectionUtil.ts
```

变量和函数命名应体现业务含义，不要使用过于模糊的名称。

```typescript
// 推荐
const userList = ref<UserItem[]>([])
const loading = ref(false)
const loadUserList = async () => {}
const handleDeleteUser = (id: number) => {}

// 不推荐
const list = ref([])
const flag = ref(false)
const getData = async () => {}
const handleClick = () => {}
```

接口方法建议按业务动作命名。

```typescript
export const getUserList = async () => {}
export const getUserDetail = async (id: number) => {}
export const createUser = async () => {}
export const updateUser = async () => {}
export const deleteUser = async (id: number) => {}
```

事件命名应表达用户操作或业务动作。例如按钮点击可以叫 `handleSearch`、`handleReset`、`handleSubmit`，不建议统一写成 `handleClick`，否则页面复杂后很难判断方法用途。

### 组件拆分原则

组件拆分用于降低单个页面的复杂度。一个页面如果同时包含搜索表单、表格、分页、弹窗、详情、编辑表单等内容，应逐步拆分为多个组件，而不是全部写在一个 `.vue` 文件中。

常见拆分原则如下：

1. 页面级组件负责组织业务流程。
2. 搜索区、表格区、弹窗区、表单区可以拆成业务组件。
3. 按钮、空状态、确认弹窗、卡片等可以拆成通用组件。
4. 接口请求、分页、选择状态等逻辑可以抽离为组合式函数。
5. 子组件通过 Props 接收数据，通过 Emits 通知父组件，不直接修改父组件状态。

例如用户列表页面可以拆成以下结构：

```text
src/views/user/UserListView.vue
src/components/user/UserSearchForm.vue
src/components/user/UserTable.vue
src/components/common/BaseEmpty.vue
src/api/user.ts
src/types/user.ts
```

先定义用户类型。

文件位置：`src/types/user.ts`

```typescript
export interface UserItem {
  id: number
  username: string
  role: string
  status: 'enabled' | 'disabled'
}

export interface UserQueryParams {
  keyword: string
  status: string
}
```

用户搜索组件负责接收查询条件，并通知父组件查询或重置。

文件位置：`src/components/user/UserSearchForm.vue`

```vue
<template>
  <form class="search-form" @submit.prevent="handleSearch">
    <input v-model.trim="localQuery.keyword" placeholder="请输入用户名" />

    <select v-model="localQuery.status">
      <option value="">全部状态</option>
      <option value="enabled">启用</option>
      <option value="disabled">禁用</option>
    </select>

    <button type="submit">
      查询
    </button>

    <button type="button" @click="handleReset">
      重置
    </button>
  </form>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import type { UserQueryParams } from '@/types/user'

interface Props {
  queryParams: UserQueryParams
}

const props = defineProps<Props>()

const emit = defineEmits<{
  search: [queryParams: UserQueryParams]
  reset: []
}>()

const localQuery = reactive<UserQueryParams>({
  keyword: '',
  status: '',
})

// 同步父组件传入的查询条件，避免直接修改 Props
watch(
  () => props.queryParams,
  (value) => {
    localQuery.keyword = value.keyword
    localQuery.status = value.status
  },
  {
    immediate: true,
    deep: true,
  },
)

const handleSearch = () => {
  emit('search', {
    keyword: localQuery.keyword,
    status: localQuery.status,
  })
}

const handleReset = () => {
  localQuery.keyword = ''
  localQuery.status = ''
  emit('reset')
}
</script>

<style scoped lang="scss">
.search-form {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

input,
select {
  padding: 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
}

button {
  padding: 8px 12px;
}
</style>
```

用户表格组件只负责展示列表和抛出操作事件。

文件位置：`src/components/user/UserTable.vue`

```vue
<template>
  <table class="user-table">
    <thead>
      <tr>
        <th>用户ID</th>
        <th>用户名</th>
        <th>岗位</th>
        <th>状态</th>
        <th>操作</th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="user in userList" :key="user.id">
        <td>{{ user.id }}</td>
        <td>{{ user.username }}</td>
        <td>{{ user.role }}</td>
        <td>{{ user.status === 'enabled' ? '启用' : '禁用' }}</td>
        <td>
          <button type="button" @click="handleEdit(user)">
            编辑
          </button>

          <button type="button" @click="handleDelete(user.id)">
            删除
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import type { UserItem } from '@/types/user'

interface Props {
  userList: UserItem[]
}

defineProps<Props>()

const emit = defineEmits<{
  edit: [user: UserItem]
  delete: [id: number]
}>()

const handleEdit = (user: UserItem) => {
  emit('edit', user)
}

const handleDelete = (id: number) => {
  emit('delete', id)
}
</script>

<style scoped lang="scss">
.user-table {
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    padding: 10px;
    border: 1px solid #e5e7eb;
    text-align: left;
  }

  th {
    background-color: #f9fafb;
  }
}

button {
  margin-right: 8px;
  padding: 6px 10px;
}
</style>
```

页面组件负责组装搜索、列表和操作逻辑。

文件位置：`src/views/user/UserListView.vue`

```vue
<template>
  <main class="page-container">
    <h2>用户列表</h2>

    <UserSearchForm
      :query-params="queryParams"
      @search="handleSearch"
      @reset="handleReset"
    />

    <UserTable
      v-if="filteredUserList.length > 0"
      :user-list="filteredUserList"
      @edit="handleEdit"
      @delete="handleDelete"
    />

    <BaseEmpty
      v-else
      title="暂无用户数据"
      description="请调整查询条件后重试"
    />
  </main>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import BaseEmpty from '@/components/common/BaseEmpty.vue'
import UserSearchForm from '@/components/user/UserSearchForm.vue'
import UserTable from '@/components/user/UserTable.vue'
import type { UserItem, UserQueryParams } from '@/types/user'

const queryParams = reactive<UserQueryParams>({
  keyword: '',
  status: '',
})

const userList = ref<UserItem[]>([
  { id: 1, username: 'Ateng', role: 'Java开发工程师', status: 'enabled' },
  { id: 2, username: 'Tom', role: '前端开发工程师', status: 'disabled' },
  { id: 3, username: 'Jerry', role: '测试工程师', status: 'enabled' },
])

const filteredUserList = computed(() => {
  return userList.value.filter((item) => {
    const matchKeyword = !queryParams.keyword || item.username.includes(queryParams.keyword)
    const matchStatus = !queryParams.status || item.status === queryParams.status

    return matchKeyword && matchStatus
  })
})

const handleSearch = (value: UserQueryParams) => {
  queryParams.keyword = value.keyword
  queryParams.status = value.status
}

const handleReset = () => {
  queryParams.keyword = ''
  queryParams.status = ''
}

const handleEdit = (user: UserItem) => {
  console.log('编辑用户：', user)
}

const handleDelete = (id: number) => {
  userList.value = userList.value.filter((item) => item.id !== id)
}
</script>

<style scoped lang="scss">
.page-container {
  padding: 24px;
}
</style>
```

这个拆分方式让页面职责更加清晰：`UserListView.vue` 负责页面流程，`UserSearchForm.vue` 负责搜索条件，`UserTable.vue` 负责数据展示，`BaseEmpty.vue` 负责空状态展示。

### 基础调试方式

基础调试用于定位页面运行错误、数据异常、组件通信异常和接口请求异常。Vue3 项目中常用调试方式包括浏览器控制台、Vue DevTools、Network 面板、断点调试和临时页面状态展示。

常见调试入口如下：

| 调试方式       | 适用场景                         |
| -------------- | -------------------------------- |
| Console 控制台 | 查看报错、打印变量、定位基础问题 |
| Network 面板   | 查看接口请求、响应数据、状态码   |
| Vue DevTools   | 查看组件层级、Props、状态、事件  |
| Sources 断点   | 调试复杂逻辑执行顺序             |
| 页面临时输出   | 快速确认响应式数据是否正确       |

调试响应式数据时，可以先在关键操作中输出必要信息。

```typescript
const handleSearch = () => {
  console.log('查询参数：', {
    keyword: queryParams.keyword,
    status: queryParams.status,
  })
}
```

调试异步请求时，建议分别输出请求参数和响应结果。

```typescript
const loadUserList = async () => {
  console.log('开始加载用户列表，查询参数：', queryParams)

  try {
    const result = await getUserList()
    console.log('用户列表加载成功：', result)
    userList.value = result
  } catch (error) {
    console.error('用户列表加载失败：', error)
  }
}
```

调试页面数据渲染时，可以临时在模板中输出完整对象。

```vue
<template>
  <pre class="debug-panel">{{ queryParams }}</pre>
  <pre class="debug-panel">{{ userList }}</pre>
</template>
```

对应样式如下：

```vue
<style scoped lang="scss">
.debug-panel {
  padding: 12px;
  font-size: 12px;
  background-color: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  white-space: pre-wrap;
}
</style>
```

如果需要暂停代码执行，可以在关键位置使用 `debugger`。

```typescript
const handleDelete = (id: number) => {
  debugger
  userList.value = userList.value.filter((item) => item.id !== id)
}
```

使用 `debugger` 时，需要打开浏览器开发者工具。代码执行到该位置会暂停，可以查看当前作用域中的变量值和调用栈。

基础调试建议按以下顺序排查：

1. 先看 Console 是否有语法错误、运行时错误或组件警告。
2. 再看 Network 是否有接口失败、参数错误或响应异常。
3. 使用 Vue DevTools 查看组件 Props、响应式数据和事件是否正确。
4. 对复杂逻辑使用断点或 `debugger` 分步执行。
5. 修复后删除临时 `console.log`、`debugger` 和页面调试输出。

## 功能验证

功能验证用于确认页面是否可以正常运行，组件交互是否符合预期，数据是否正确渲染。前端功能验证不只看页面是否能打开，还需要覆盖加载、交互、异常、空数据等常见状态。

### 页面运行验证

页面运行验证主要确认项目能否正常启动、页面能否访问、构建是否通过、浏览器控制台是否无明显错误。

在项目根目录执行开发启动命令。

```bash
npm run dev
```

启动成功后，终端通常会输出本地访问地址。

```bash
http://localhost:5173/
```

浏览器访问页面后，需要检查以下内容：

| 验证项           | 预期结果                         |
| ---------------- | -------------------------------- |
| 页面是否能打开   | 页面正常显示，不是空白页         |
| 控制台是否报错   | Console 中没有红色错误           |
| 路由是否正常     | 访问页面路由时组件能正确渲染     |
| 静态资源是否加载 | 图片、样式、字体正常显示         |
| 热更新是否生效   | 修改代码后页面自动刷新或局部更新 |

如果需要验证生产构建，可以执行：

```bash
npm run build
```

构建成功后，再执行本地预览。

```bash
npm run preview
```

`npm run build` 用于检查项目是否能完成生产环境打包，`npm run preview` 用于预览打包后的页面效果。开发环境能运行不代表生产构建一定通过，因此提交代码前建议至少执行一次构建验证。

页面运行异常时，可以优先检查以下问题：

1. `main.ts` 是否正确挂载 `App.vue`。
2. `index.html` 是否存在 `<div id="app"></div>`。
3. 路由路径是否配置正确。
4. 组件导入路径是否正确。
5. TypeScript 是否存在类型错误。
6. 控制台是否提示依赖缺失或变量未定义。

### 组件交互验证

组件交互验证主要确认用户操作是否能正确触发事件，父子组件通信是否正常，页面状态是否按预期变化。

以用户列表页面为例，交互验证可以覆盖以下场景：

| 操作             | 预期结果                         |
| ---------------- | -------------------------------- |
| 输入用户名关键字 | 输入框内容正常变化               |
| 点击查询         | 列表按关键字过滤                 |
| 点击重置         | 查询条件清空，列表恢复           |
| 点击编辑         | 控制台输出当前用户或打开编辑弹窗 |
| 点击删除         | 当前用户从列表中移除             |
| 删除全部数据     | 显示空状态组件                   |

可以在关键方法中增加临时日志，确认事件是否触发。

```typescript
const handleSearch = (value: UserQueryParams) => {
  console.log('触发查询事件：', value)

  queryParams.keyword = value.keyword
  queryParams.status = value.status
}

const handleDelete = (id: number) => {
  console.log('触发删除事件，用户ID：', id)

  userList.value = userList.value.filter((item) => item.id !== id)
}
```

如果点击按钮后没有反应，可以按以下顺序排查：

1. 模板中事件名是否写正确，例如 `@search`、`@delete`。
2. 子组件是否通过 `defineEmits` 声明并调用了事件。
3. 父组件方法是否接收到了参数。
4. 状态是否被正确修改。
5. 修改后的状态是否参与了模板渲染。

例如子组件触发事件：

```typescript
const emit = defineEmits<{
  delete: [id: number]
}>()

const handleDelete = (id: number) => {
  emit('delete', id)
}
```

父组件接收事件：

```vue
<UserTable
  :user-list="filteredUserList"
  @delete="handleDelete"
/>
```

父组件处理事件：

```typescript
const handleDelete = (id: number) => {
  userList.value = userList.value.filter((item) => item.id !== id)
}
```

组件交互验证的核心是确认完整链路：用户操作触发 DOM 事件，子组件抛出事件，父组件接收事件，父组件修改状态，页面重新渲染。

### 数据渲染验证

数据渲染验证主要确认响应式数据、计算属性、列表渲染、条件渲染是否符合预期。实际项目中，接口返回数据后，需要确认数据结构正确、字段名正确、空数据处理正确、异常状态处理正确。

可以使用一组模拟数据验证列表渲染。

```typescript
const userList = ref<UserItem[]>([
  { id: 1, username: 'Ateng', role: 'Java开发工程师', status: 'enabled' },
  { id: 2, username: 'Tom', role: '前端开发工程师', status: 'disabled' },
])
```

模板中渲染列表。

```vue
<ul>
  <li v-for="user in userList" :key="user.id">
    {{ user.username }} - {{ user.role }}
  </li>
</ul>
```

需要重点检查字段名是否和数据结构一致。

```typescript
interface UserItem {
  id: number
  username: string
  role: string
  status: 'enabled' | 'disabled'
}
```

如果数据中字段是 `username`，模板中就不能写成 `user.name`。

```vue
<!-- 错误写法 -->
<p>{{ user.name }}</p>

<!-- 正确写法 -->
<p>{{ user.username }}</p>
```

对于接口数据，建议在接收后先确认数据结构。

```typescript
const loadUserList = async () => {
  const result = await getUserList()

  console.log('接口返回用户列表：', result)

  userList.value = result
}
```

数据渲染验证需要覆盖以下状态：

| 状态     | 验证内容                     |
| -------- | ---------------------------- |
| 正常数据 | 列表、字段、状态文案正常显示 |
| 空数据   | 显示空状态，不显示空表格     |
| 加载中   | 显示加载提示，按钮可禁用     |
| 请求失败 | 显示错误提示，提供重试入口   |
| 条件过滤 | 查询条件变化后结果正确更新   |

可以将完整的页面状态写成如下结构：

```vue
<template>
  <main class="page-container">
    <p v-if="loading">
      数据加载中...
    </p>

    <p v-else-if="errorMessage" class="error-text">
      {{ errorMessage }}
    </p>

    <ul v-else-if="userList.length > 0">
      <li v-for="user in userList" :key="user.id">
        {{ user.username }} - {{ user.role }}
      </li>
    </ul>

    <p v-else class="empty-text">
      暂无用户数据
    </p>
  </main>
</template>
```

数据渲染验证的判断标准是：页面不依赖单一成功场景，即使数据为空、接口失败或字段缺失，也应该有明确的页面反馈，而不是出现空白页、报错页或无响应状态。
