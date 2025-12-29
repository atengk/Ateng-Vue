## 模板与渲染机制

### 模板与渲染机制

本章目标只有一个：

> **搞清楚：模板里能写什么、不能写什么、模板是怎么和 `setup` 连起来的**

不涉及组件拆分、不涉及响应式原理、不涉及 watch / computed。

------

### 模板语法基础

#### 插值表达式 `{{ }}`

插值表达式用于 **将数据渲染为文本**。

```vue
<script setup lang="ts">
const title = 'Hello Vue3'
const count = 1
</script>

<template>
  <h1>{{ title }}</h1>
  <p>{{ count }}</p>
</template>
```

特点：

- 只能出现在 **文本位置**
- 最终会被渲染成字符串
- 自动响应式更新（后面章节展开）

------

#### 模板中可使用的 JavaScript 表达式范围

✅ **可以使用：**

- 变量访问
- 运算表达式
- 三元表达式
- 方法调用

```vue
<script setup lang="ts">
const price = 100
const isVip = true

function formatPrice(value: number): string {
  return `￥${value}`
}
</script>

<template>
  <p>{{ price * 2 }}</p>
  <p>{{ isVip ? 'VIP 用户' : '普通用户' }}</p>
  <p>{{ formatPrice(price) }}</p>
</template>
```

❗ 模板里用的是 **表达式（expression）**，不是语句（statement）。

------

#### 模板中禁止的写法与常见错误

❌ **不能写：**

```vue
<!-- 语句 -->
{{ if (price > 100) { } }}

<!-- 赋值 -->
{{ count = 2 }}

<!-- 声明变量 -->
{{ const a = 1 }}

<!-- async / await -->
{{ await fetchData() }}
```

原因只有一句话：

> **模板不是 JS 执行环境，而是表达式求值环境**

------

#### 模板中访问 `setup` 中数据与方法的规则

在 `<script setup>` 中：

- 顶层声明的 **变量**
- 顶层声明的 **函数**

👉 **自动暴露给模板使用**

```vue
<script setup lang="ts">
const name = 'Ateng'

function sayHello(): string {
  return `Hello ${name}`
}
</script>

<template>
  <p>{{ name }}</p>
  <p>{{ sayHello() }}</p>
</template>
```

不需要 `return`，不需要 `this`，不需要额外配置。

------

### 指令系统

指令是 **以 `v-` 开头的特殊属性**，用于增强模板能力。

------

#### `v-text`

用于设置元素的 **文本内容**。

```vue
<script setup lang="ts">
const message = 'Hello'
</script>

<template>
  <p v-text="message"></p>
</template>
```

等价于：

```vue
<p>{{ message }}</p>
```

👉 实际开发中 **更推荐插值表达式**。

------

#### `v-html`（使用场景与安全风险认知）

用于渲染 **HTML 字符串**。

```vue
<script setup lang="ts">
const html = '<strong>加粗文本</strong>'
</script>

<template>
  <div v-html="html"></div>
</template>
```

⚠️ 注意：

- 会直接插入 DOM
- **有 XSS 风险**
- 不要渲染不可信内容

------

#### `v-bind`（`:属性`）的基本用法

用于 **绑定属性值**。

```vue
<script setup lang="ts">
const url = 'https://vuejs.org'
</script>

<template>
  <a :href="url">Vue 官网</a>
</template>
```

`:href` 是 `v-bind:href` 的简写。

------

#### `v-bind` 动态属性名与对象形式绑定

动态属性名

```vue
<script setup lang="ts">
const attrName = 'title'
const attrValue = '提示信息'
</script>

<template>
  <div :[attrName]="attrValue">Hover me</div>
</template>
```

------

对象形式绑定

```vue
<script setup lang="ts">
const attrs = {
  id: 'box',
  title: '提示',
}
</script>

<template>
  <div v-bind="attrs"></div>
</template>
```

常用于属性透传、批量绑定。

------

#### `v-on`（`@事件`）的基本使用

```vue
<script setup lang="ts">
function handleClick(): void {
  console.log('clicked')
}
</script>

<template>
  <button @click="handleClick">点击</button>
</template>
```

- `@click` 是 `v-on:click` 的简写
- 模板中 **不需要手动 bind this**

------

#### `v-model` 的基础双向绑定行为

```vue
<script setup lang="ts">
import { ref } from 'vue'

const name = ref<string>('')
</script>

<template>
  <input v-model="name" />
  <p>{{ name }}</p>
</template>
```

等价于：

```vue
<input :value="name" @input="name = $event.target.value" />
```

> 先记住结论：
> **`v-model` = 值绑定 + 事件监听**

------

## 响应式系统

### Composition API 与响应式基础

#### `setup()` 的作用与执行时机

在 Vue3 中，组件的逻辑入口是 **`setup` 阶段**。

在使用 `<script setup>` 时：

- `setup()` 被 **隐式调用**
- 组件 **创建之前执行**
- 在这里定义：
  - 响应式数据
  - 方法
  - 组合逻辑

```vue
<script setup lang="ts">
const message = 'hello'
</script>
```

等价认知（不需要你写）：

```ts
setup() {
  const message = 'hello'
  return { message }
}
```

关键认知一句话：

> **模板渲染所需的一切数据，必须在 setup 阶段准备好**

------

#### `ref` 的使用方式与 `.value` 的原因

`ref` 用于创建 **基本类型的响应式数据**。

```vue
<script setup lang="ts">
import { ref } from 'vue'

const count = ref<number>(0)

function increment(): void {
  count.value++
}
</script>

<template>
  <button @click="increment">
    {{ count }}
  </button>
</template>
```

##### 为什么 JS 中要 `.value`？

- `ref` 返回的是一个 **对象**
- 真正的值存放在 `.value` 中
- Vue 通过这个对象实现 **依赖追踪**

```ts
count.value = 1
```

##### 为什么模板里不用 `.value`？

这是 Vue 的 **模板自动解包机制**，后面会专门讲。

------

#### `reactive` 的使用方式与适用数据结构

`reactive` 用于 **对象 / 数组 / 复杂结构**。

```vue
<script setup lang="ts">
import { reactive } from 'vue'

const user = reactive({
  name: 'Ateng',
  age: 18,
})
</script>

<template>
  <p>{{ user.name }}</p>
  <p>{{ user.age }}</p>
</template>
```

特点：

- 返回的是 **Proxy 对象**
- 属性访问无需 `.value`
- 更符合“对象直觉”

------

#### `ref` 与 `reactive` 的选型原则

只记住这几条就够了：

- **基本类型** → `ref`
- **对象 / 数组** → `reactive`
- **需要整体替换的值** → `ref`
- **频繁修改内部属性** → `reactive`

```ts
// 推荐
const count = ref(0)
const form = reactive({ name: '', age: 0 })
```

------

#### `toRefs` 的使用场景

`toRefs` 用于 **保持响应式地解构对象**。

问题场景：

```ts
const state = reactive({ a: 1, b: 2 })
const { a, b } = state   // ❌ 响应式丢失
```

解决方式：

```ts
import { toRefs } from 'vue'

const state = reactive({ a: 1, b: 2 })
const { a, b } = toRefs(state)
```

此时：

- `a`、`b` 都是 `ref`
- 解构后 **依然响应式**

------

### 响应式行为认知

#### 响应式数据在模板中的自动解包

在模板中：

- `ref` 会 **自动读取 `.value`**
- 你写的还是变量名

```vue
<script setup lang="ts">
import { ref } from 'vue'
const count = ref(1)
</script>

<template>
  <p>{{ count }}</p>
</template>
```

但在 JS 中：

```ts
count.value
```

记忆口诀：

> **JS 中要 `.value`，模板中不用**

------

#### `reactive` 的局限性与不可代理的情况

`reactive` 只能作用于：

- 对象
- 数组
- Map / Set（有限支持）

❌ 以下情况不适用：

```ts
reactive(1)
reactive('abc')
reactive(true)
```

另外：

- **不能整体替换 reactive 对象**

```ts
user = { name: 'new' } // ❌ 失效
```

只能修改属性：

```ts
user.name = 'new'
```

------

#### 解构赋值导致响应式丢失的原因与规避方式

原因本质：

> **解构拿到的是“值”，不是“响应式引用”**

错误示例：

```ts
const user = reactive({ name: 'Ateng' })
const { name } = user
```

规避方式只有两个：

- 不解构，直接用 `user.name`
- 使用 `toRefs`

```ts
const { name } = toRefs(user)
```

------

#### `shallowRef` 的概念与使用场景（认知级）

`shallowRef` 是 **浅层响应式 ref**。

```ts
import { shallowRef } from 'vue'

const data = shallowRef({ count: 1 })
```

特点：

- 只监听 `.value` 的整体变化
- **不追踪内部属性变化**

适用认知场景：

- 大对象
- 外部库返回的数据
- 只关心“是否替换”，不关心内部变动

> 现在只需要“知道它存在”，不要求熟练使用。

------

## 条件与列表渲染

### 条件渲染

#### `v-if`、`v-else-if`、`v-else`

`v-if` 用于 **控制节点是否被创建与销毁**。

```vue
<script setup lang="ts">
import { ref } from 'vue'

const status = ref<'loading' | 'success' | 'error'>('loading')
</script>

<template>
  <p v-if="status === 'loading'">加载中...</p>
  <p v-else-if="status === 'success'">加载成功</p>
  <p v-else>加载失败</p>
</template>
```

关键认知：

- 条件不满足 → **DOM 不存在**
- 条件切换 → 节点会被 **重新创建**

------

#### `v-show`

`v-show` 用于 **控制元素显示与隐藏**。

```vue
<script setup lang="ts">
import { ref } from 'vue'

const visible = ref<boolean>(true)
</script>

<template>
  <p v-show="visible">这段文字可显示或隐藏</p>
</template>
```

底层行为：

- 元素始终存在于 DOM
- 通过 `display: none` 控制可见性

------

#### `v-if` 与 `v-show` 的渲染机制差异

核心区别只有一句话：

> **`v-if` 控制“有没有这个节点”，`v-show` 控制“显不显示”**

| 对比项          | v-if | v-show |
| --------------- | ---- | ------ |
| 是否创建 DOM    | 否   | 是     |
| 初始渲染开销    | 低   | 高     |
| 切换开销        | 高   | 低     |
| 是否支持 `else` | 支持 | 不支持 |

------

#### 条件渲染对 DOM 与性能的影响

经验法则：

- **条件很少变化** → 使用 `v-if`
- **频繁切换显示状态** → 使用 `v-show`

```vue
<!-- 适合 v-if -->
<p v-if="user">用户信息</p>

<!-- 适合 v-show -->
<p v-show="isOpen">展开内容</p>
```

------

### 列表渲染

#### `v-for` 的基本使用方式

`v-for` 用于 **根据数组渲染多条结构相同的节点**。

```vue
<script setup lang="ts">
import { ref } from 'vue'

interface User {
  id: number
  name: string
}

const users = ref<User[]>([
  { id: 1, name: 'Tom' },
  { id: 2, name: 'Jerry' },
])
</script>

<template>
  <ul>
    <li v-for="user in users" :key="user.id">
      {{ user.name }}
    </li>
  </ul>
</template>
```

------

#### `key` 的作用与最佳实践

`key` 用于 **标识节点的唯一身份**。

正确做法：

```vue
<li v-for="item in list" :key="item.id">
```

错误做法：

```vue
<li v-for="(item, index) in list" :key="index">
```

原因：

- `key` 决定 **DOM 复用策略**
- 使用 `index` 容易导致：
  - 状态错乱
  - 渲染异常

原则：

> **只要列表是可变的，就必须使用稳定唯一的 key**

------

#### 数组变更时的响应式更新表现

Vue 能追踪以下操作：

```ts
users.value.push(...)
users.value.splice(...)
users.value[0] = newUser
```

以及整体替换：

```ts
users.value = users.value.filter(u => u.id !== 1)
```

关键认知：

- Vue3 对数组 **索引赋值也是响应式的**
- 不需要再使用特殊 API

------

#### 使用 `template` 进行多节点列表渲染

当一个列表项需要渲染 **多个根节点** 时：

```vue
<template>
  <template v-for="user in users" :key="user.id">
    <h3>{{ user.name }}</h3>
    <hr />
  </template>
</template>
```

说明：

- 外层 `template` **不会渲染为 DOM**
- `key` 必须写在 `template` 上

------

#### `v-if` 与 `v-for` 的正确组合方式

❌ 错误写法：

```vue
<li v-for="user in users" v-if="user.active">
```

原因：

- `v-if` 优先级低
- 每次循环都要判断

✅ 正确写法一：提前过滤数据

```ts
const activeUsers = computed(() =>
  users.value.filter(u => u.active)
)
<li v-for="user in activeUsers" :key="user.id">
```

✅ 正确写法二：使用 `template`

```vue
<template v-for="user in users" :key="user.id">
  <li v-if="user.active">
    {{ user.name }}
  </li>
</template>
```

------

## 事件与表单处理

### 事件处理

#### 事件绑定与事件对象

事件通过 `v-on`（`@`）绑定。

```vue
<script setup lang="ts">
function handleClick(event: MouseEvent): void {
  console.log(event.clientX, event.clientY)
}
</script>

<template>
  <button @click="handleClick">点击</button>
</template>
```

关键认知：

- 模板中的事件参数，**默认就是原生 DOM 事件对象**
- Vue 不会包装或修改事件对象

------

#### 事件修饰符的使用

##### `.stop`

阻止事件冒泡：

```vue
<div @click="onOuter">
  <button @click.stop="onInner">点击</button>
</div>
```

##### `.prevent`

阻止默认行为：

```vue
<form @submit.prevent="onSubmit">
  <button type="submit">提交</button>
</form>
```

##### `.once`

事件只触发一次：

```vue
<button @click.once="onClick">只触发一次</button>
```

认知重点：

> 修饰符是在 **模板层面对事件行为的声明式控制**

------

#### 事件在 TypeScript 严格模式下的类型推断

当事件对象 **显式作为参数传入方法** 时：

```ts
function handleClick(event: MouseEvent): void {}
```

Vue 不会自动帮你推断事件类型，
**类型来自你函数参数的声明**。

------

#### 鼠标事件、键盘事件的类型标注方式

常见事件类型：

```ts
function onClick(event: MouseEvent): void {}

function onKeydown(event: KeyboardEvent): void {}
```

示例：

```vue
<script setup lang="ts">
function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'Enter') {
    console.log('回车')
  }
}
</script>

<template>
  <input @keydown="onKeydown" />
</template>
```

------

#### 模板中 `$event` 的真实类型来源

当你在模板中显式传 `$event`：

```vue
<button @click="handleClick($event)">点击</button>
```

此时：

- `$event` 的类型 = **该事件对应的 DOM Event 类型**
- 是否安全，取决于你在方法中如何声明参数类型

```ts
function handleClick(event: MouseEvent): void {}
```

------

### 表单输入绑定

#### `v-model` 在 `input` 中的行为

`v-model` 本质是：

```vue
:value="value"
@input="value = $event.target.value"
```

基础示例：

```vue
<script setup lang="ts">
import { ref } from 'vue'

const name = ref<string>('')
</script>

<template>
  <input v-model="name" />
  <p>{{ name }}</p>
</template>
```

认知重点：

- `v-model` 自动处理事件与赋值
- 类型来自 `ref` 的泛型

------

#### `v-model` 在 `checkbox`、`radio` 中的差异

##### checkbox（单个）

```ts
const checked = ref<boolean>(false)
<input type="checkbox" v-model="checked" />
```

##### radio（单选）

```ts
const gender = ref<'male' | 'female'>('male')
<input type="radio" value="male" v-model="gender" />
<input type="radio" value="female" v-model="gender" />
```

认知重点：

- checkbox → `boolean`
- radio → `value` 决定值

------

#### `v-model` 在 `select` 中的使用方式

```ts
const city = ref<string>('')
<select v-model="city">
  <option value="">请选择</option>
  <option value="beijing">北京</option>
  <option value="shanghai">上海</option>
</select>
```

TypeScript 关键点：

- `option value` 的类型决定最终类型
- 建议显式声明 `ref` 泛型

------

#### 表单值与 TypeScript 类型的一致性

正确做法：

```ts
const age = ref<number | null>(null)
<input type="number" v-model.number="age" />
```

关键认知：

- 表单输入 **天然是字符串**
- 必须主动处理类型一致性
- `.number` 修饰符是常见解决方案

------

#### 自定义表单行为的基础实现思路

当你不使用 `v-model` 时：

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref<string>('')

function onInput(event: Event): void {
  const target = event.target as HTMLInputElement
  value.value = target.value
}
</script>

<template>
  <input :value="value" @input="onInput" />
</template>
```

认知重点：

- `event.target` 需要类型断言
- 这是 `v-model` 的底层形态

------

## 计算与监听

### 计算属性

#### `computed` 的基本使用

`computed` 用于 **派生状态**，即由已有响应式数据计算得到的新值。

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'

const firstName = ref<string>('Ateng')
const lastName = ref<string>('Lee')

const fullName = computed(() => {
  return `${firstName.value} ${lastName.value}`
})
</script>

<template>
  <p>{{ fullName }}</p>
</template>
```

关键认知：

- `computed` 返回的是 **只读 ref**
- 只有依赖变化时才重新计算

------

#### 计算属性与方法的区别

```vue
<p>{{ fullName }}</p>
<p>{{ getFullName() }}</p>
function getFullName(): string {
  return `${firstName.value} ${lastName.value}`
}
```

本质区别：

| 对比点     | computed | 方法     |
| ---------- | -------- | -------- |
| 是否缓存   | 是       | 否       |
| 是否响应式 | 是       | 否       |
| 调用时机   | 依赖变化 | 每次渲染 |

结论：

> **模板中需要“计算结果”的地方，优先使用 computed**

------

#### 只读计算属性

最常见写法：

```ts
const total = computed(() => count.value * 2)
```

此时：

- `total.value` 可读
- 不允许赋值

```ts
total.value = 10 // ❌
```

这是 Vue 默认推荐用法。

------

#### 可写计算属性的实现方式

当你需要 **拦截赋值行为** 时：

```ts
const count = ref<number>(1)

const double = computed({
  get() {
    return count.value * 2
  },
  set(value: number) {
    count.value = value / 2
  },
})
```

认知重点：

- 本质仍然是 `ref`
- `set` 并不会直接修改计算值，而是反向影响依赖

------

#### `computed` 在 TypeScript 中的类型推断边界

通常情况下，类型可以自动推断：

```ts
const total = computed(() => 100)
```

但复杂场景建议显式声明：

```ts
const total = computed<number>(() => {
  return count.value * 2
})
```

可写计算属性时：

- `get` 返回值类型
- `set` 参数类型

必须一致，否则 TS 会报错

------

### 监听器

#### `watch` 的使用方式

`watch` 用于 **监听响应式数据的变化并执行副作用**。

```ts
import { ref, watch } from 'vue'

const count = ref<number>(0)

watch(count, (newValue, oldValue) => {
  console.log(newValue, oldValue)
})
```

认知重点：

- 第一个参数是 **响应式数据**
- 第二个参数是回调函数

------

#### `watchEffect` 的使用场景

`watchEffect` 自动追踪依赖：

```ts
import { ref, watchEffect } from 'vue'

const count = ref<number>(0)

watchEffect(() => {
  console.log(count.value)
})
```

适合：

- 不关心旧值
- 依赖较多、动态变化的场景

对比认知：

> `watch` 更精确，`watchEffect` 更自动

------

#### 深度监听与立即执行

##### 深度监听

```ts
watch(
  user,
  (newValue) => {
    console.log(newValue)
  },
  { deep: true }
)
```

##### 立即执行

```ts
watch(
  count,
  (value) => {
    console.log(value)
  },
  { immediate: true }
)
```

认知重点：

- `deep` 用于对象内部变化
- `immediate` 会在监听注册后立刻执行一次

------

#### 监听副作用的清理机制

`watch` 回调中可以返回清理逻辑：

```ts
watch(count, (value, oldValue, onCleanup) => {
  const timer = setInterval(() => {
    console.log(value)
  }, 1000)

  onCleanup(() => {
    clearInterval(timer)
  })
})
```

用途：

- 清除定时器
- 取消订阅
- 终止异步任务

------

#### `watch` 清理函数的执行时机

清理函数会在以下时机执行：

- 下一次监听触发之前
- 组件卸载时

一句话记忆：

> **新监听执行前，旧副作用先清理**

------

## 生命周期

### 生命周期钩子

#### `onMounted`

`onMounted` 在 **组件首次挂载到 DOM 后执行**。

```vue
<script setup lang="ts">
import { onMounted } from 'vue'

onMounted((): void => {
  console.log('组件已挂载')
})
</script>
```

典型使用场景：

- 访问真实 DOM
- 发起首次请求
- 初始化第三方库

------

#### `onUpdated`

`onUpdated` 在 **组件更新并重新渲染后执行**。

```vue
<script setup lang="ts">
import { ref, onUpdated } from 'vue'

const count = ref<number>(0)

onUpdated((): void => {
  console.log('组件已更新')
})
</script>

<template>
  <button @click="count++">{{ count }}</button>
</template>
```

认知重点：

- 只要 **响应式数据引起视图更新** 就会触发
- 不适合放高频逻辑

------

#### `onUnmounted`

`onUnmounted` 在 **组件卸载前执行清理逻辑**。

```vue
<script setup lang="ts">
import { onUnmounted } from 'vue'

onUnmounted((): void => {
  console.log('组件即将卸载')
})
</script>
```

典型用途：

- 清理定时器
- 解绑事件
- 释放资源

------

### 生命周期与 Composition API

#### 生命周期在 `setup` 中的注册方式

在 Vue3 中：

- 生命周期钩子 **只能在 setup 阶段注册**
- `<script setup>` 中直接调用即可

```ts
onMounted(() => {})
onUnmounted(() => {})
```

不需要 `this`，也不存在上下文丢失问题。

------

#### `setup` 与组件生命周期的执行顺序

执行顺序认知：

1. `setup` 执行
2. 创建响应式数据
3. 渲染模板
4. 挂载 DOM
5. 执行 `onMounted`

重要结论：

> **setup 比任何生命周期都早**

------

#### Vue3 中移除 `beforeCreate` 的原因

在 Vue3 中：

- `setup` 替代了 `beforeCreate`
- 响应式系统初始化 **提前完成**
- 不再需要区分「能不能访问 data」

认知简化一句话：

> **setup 本身就是最早的生命周期**

------

#### 生命周期钩子的合理使用边界

推荐原则：

- **能用响应式解决的，不用生命周期**
- 生命周期只处理：
  - 副作用
  - DOM
  - 外部资源

不推荐：

```ts
onMounted(() => {
  state.value = 1   // ❌ 不必要
})
```

推荐：

```ts
onMounted(() => {
  element.focus()   // ✅
})
```

------

## 自定义指令

### 自定义指令能解决什么问题

自定义指令用于 **直接操作 DOM 的场景**。

典型适用问题：

- 自动聚焦
- 滚动控制
- 第三方 DOM 库接入
- 需要直接访问元素的行为封装

核心判断标准：

> **如果逻辑必须依赖真实 DOM 元素，而不是状态 → 用指令**

不适合的场景：

- 业务逻辑
- 状态计算
- 数据派生
  这些应该交给 **响应式或 composable**

------

### 自定义指令的基本写法

在 Vue3 中，自定义指令本质是一个 **对象**。

```vue
<script setup lang="ts">
import type { Directive } from 'vue'

const vFocus: Directive = {
  mounted(el) {
    el.focus()
  },
}
</script>

<template>
  <input v-focus />
</template>
```

认知重点：

- 指令名使用 `v-xxx`
- 模板中使用时是 `v-xxx`
- `el` 就是真实 DOM 元素

------

### 指令的生命周期（`mounted / updated / unmounted`）

#### `mounted`

元素 **插入 DOM 后执行**：

```ts
mounted(el) {
  el.focus()
}
```

适合：

- DOM 初始化
- 第三方库初始化

------

#### `updated`

组件更新后执行：

```ts
updated(el) {
  console.log('元素已更新')
}
```

注意：

- 频繁触发
- 不适合高开销逻辑

------

#### `unmounted`

元素被移除时执行清理：

```ts
unmounted(el) {
  console.log('元素已卸载')
}
```

典型用途：

- 移除事件监听
- 销毁外部实例

------

### 全局自定义指令

**编写单个指令**

`src/directives/focus.ts`

```ts
import type { Directive } from 'vue'

const focus: Directive = {
  mounted(el: HTMLElement): void {
    el.focus()
  },
}

export default focus
```

认知点：

- 一个文件只做一件事
- 指令本身不关心“是否全局”

------

**统一注册全局指令**

`src/directives/index.ts`

```ts
import type { App } from 'vue'
import focus from './focus'

export function setupDirectives(app: App): void {
  app.directive('focus', focus)
}
```

认知点：

- 对外只暴露一个 `setupDirectives`
- 后续加指令 **不改 `main.ts`**

------

在 `main.ts` 中注册

`src/main.ts`

```ts
import { createApp } from 'vue'
import App from './App.vue'
import { setupDirectives } from './directives'

const app = createApp(App)

setupDirectives(app)

app.mount('#app')
```

此时 `main.ts` 非常干净。

------

**使用 Demo（组件中）**

```vue
<script setup lang="ts">
</script>

<template>
  <input v-focus />
</template>
```

不需要 import，不需要配置，直接使用。

好，进入**最后一章正文**。
下面内容 **只覆盖你列出的 3 个点**，不讲依赖注入、不讲抽象层设计，
目标是：**让你会写、会用、知道边界**。

------

## 自定义 Hooks / Composables

### Composable 是什么，用来干什么

> **在 Vue3 中：
>  Hooks ≈ Composables（同一个概念）**

但：

- **官方推荐叫法：Composable**
- **Hooks 是习惯性叫法**

在 Vue3 中，**Composable** 本质是一个 **使用 Composition API 的普通函数**。

它用来：

- 抽离可复用的逻辑
- 复用响应式状态
- 减少组件内部代码复杂度

最核心的一句话定义：

> **Composable = 可复用的 `setup` 逻辑函数**

它不是组件：

- 没有模板
- 不参与渲染
- 只负责“逻辑”

------

### 定义并返回响应式状态

一个最基础的 Composable 示例：

```ts
// src/composables/useCounter.ts
import { ref } from 'vue'

export function useCounter() {
  const count = ref<number>(0)

  function increment(): void {
    count.value++
  }

  function decrement(): void {
    count.value--
  }

  return {
    count,
    increment,
    decrement,
  }
}
```

认知重点：

- Composable 是普通函数
- 内部可以使用 `ref` / `computed` / `watch`
- 返回的都是 **响应式引用**

------

### 在组件中使用 Composable

在组件中直接调用即可：

```vue
<script setup lang="ts">
import { useCounter } from '@/composables/useCounter'

const { count, increment, decrement } = useCounter()
</script>

<template>
  <button @click="decrement">-</button>
  <span>{{ count }}</span>
  <button @click="increment">+</button>
</template>
```

行为认知：

- 每次调用 `useCounter()`
  → **得到一套独立的状态**
- 不同组件互不影响

------

