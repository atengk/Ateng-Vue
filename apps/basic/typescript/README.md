# TypeScript

## TypeScript 基础类型

------

### 原始类型（Primitive Types）

#### `string / number / boolean`

这是 **最基础、但最容易被忽视“约束价值”的类型**。

使用场景（Vue3 中）

```ts
import { ref } from 'vue'

const username = ref<string>('admin')
const age = ref<number>(18)
const isLogin = ref<boolean>(false)
```

**关键理解点：**

- `ref<string>` 是在约束 **`.value` 的类型**
- 赋值错误会在**编码阶段**被拦截，而不是运行时报错

```ts
username.value = 123 // ❌ TS 报错
```

👉 **TS 的价值：把“可能的 bug”前移到编码期**

------

#### `null / undefined`

核心理解

- `undefined`：**还没赋值**
- `null`：**明确表示“没有”**

Vue 场景示例（接口数据未加载）

```ts
interface User {
  id: number
  name: string
}

const user = ref<User | null>(null)
// ❌ 直接使用会报错
user.value.name

// ✅ 必须做判空
if (user.value) {
  console.log(user.value.name)
}
```

👉 **TS 强制你“正视数据未就绪的阶段”**

------

####  `any` —— 逃生舱（不推荐）

核心结论

> **`any` = 关闭 TypeScript**

```ts
const data: any = getData()

data.foo.bar.baz() // TS 不报错，但运行期可能直接炸
```

在 Vue 项目中什么时候“可以用”

- 第三方库类型极不完整
- 临时调试
- 老代码迁移阶段

```ts
const legacyData: any = window['__OLD_DATA__']
```

⚠️ **必须有边界，不允许扩散**

------

####  `unknown` —— 更安全的 `any`

本质区别

| 类型      | 能否直接使用       |
| --------- | ------------------ |
| `any`     | ✅ 可以             |
| `unknown` | ❌ 不行，必须先校验 |

Vue 示例（接口返回不可信数据）

```ts
const response = ref<unknown>(null)
if (typeof response.value === 'string') {
  console.log(response.value.toUpperCase())
}
```

👉 **`unknown` 强迫你“验证数据再使用”**

------

####  `never` —— 不该发生的情况

核心用途

- **异常**
- **死分支**
- **兜底校验（exhaustive check）**

Vue 场景：状态兜底

```ts
type PageStatus = 'loading' | 'success' | 'error'

function handleStatus(status: PageStatus) {
  switch (status) {
    case 'loading':
      return '加载中'
    case 'success':
      return '成功'
    case 'error':
      return '失败'
    default:
      const _exhaustive: never = status
      return _exhaustive
  }
}
```

👉 **当你新增状态却忘记处理时，TS 会直接报错**

------

### 数组与元组

#### 数组类型：`string[]` vs `Array<number>`

```ts
const ids: number[] = [1, 2, 3]
const names: Array<string> = ['a', 'b']
```

实战建议

- **简单场景**：`T[]`
- **泛型场景 / 工具函数**：`Array<T>`

```ts
function useList<T>(list: Array<T>) {
  return list.length
}
```

------

#### 元组（Tuple）：固定结构的数据

典型接口返回值

```ts
type ApiResult = [number, string, boolean]
const result = ref<ApiResult>([200, 'ok', true])
```

为什么不用数组？

```ts
result.value[0] // number（状态码）
result.value[1] // string（消息）
result.value[2] // boolean（成功与否）
```

👉 **顺序 = 语义，类型系统直接帮你记住**

------

### 枚举（Enum）

#### 数字枚举 vs 字符串枚举

```ts
enum StatusCode {
  SUCCESS = 200,
  ERROR = 500
}
enum StatusText {
  SUCCESS = 'success',
  ERROR = 'error'
}
```

项目建议

| 场景       | 推荐       |
| ---------- | ---------- |
| 后端状态码 | 数字枚举   |
| 前端状态值 | 字符串枚举 |

------

#### `const enum` 的真实作用

```ts
const enum Role {
  ADMIN = 'admin',
  USER = 'user'
}
```

特点

- **编译后直接被内联**
- **不生成额外对象**
- 更小体积、更好性能

⚠️ **缺点**：调试时看不到 enum 对象

------

#### 枚举与后端状态码映射（高频）

```ts
enum ApiCode {
  OK = 0,
  FAIL = 1
}
const code = ref<ApiCode>(ApiCode.OK)

if (code.value === ApiCode.OK) {
  console.log('成功')
}
```

👉 **避免魔法数字，避免硬编码**

------

## 对象建模核心（最重要）

------

### 接口（interface）——对象世界的“结构契约”

#### 接口的本质

> **interface = 对“对象长什么样”的强约束描述**

它不是实现逻辑，而是 **定义数据结构的形状**。

最典型的使用场景

- 接口返回数据（DTO）
- 页面展示模型（VO）
- 表单数据模型
- Pinia / Vue 状态对象

```ts
interface User {
  id: number
  name: string
  age: number
}
const user = ref<User>({
  id: 1,
  name: 'Tom',
  age: 18
})
```

👉 **接口是前端与数据之间的“法律文本”**

------

#### 可选属性 `?` —— 不确定性显式化

```ts
interface User {
  id: number
  name: string
  avatar?: string
}
```

含义不是“可能为空”，而是：

> **这个字段“可能不存在”**

Vue 场景（接口字段非必返）

```ts
if (user.value.avatar) {
  console.log(user.value.avatar)
}
```

⚠️ **滥用 `?` 会削弱类型系统的约束力**
原则：

- 接口**一定会返回** → 不加 `?`
- 真实可能缺失 → 才加 `?`

------

#### 只读属性 `readonly` —— 防止“被意外修改”

```ts
interface User {
  readonly id: number
  name: string
}
user.value.id = 2 // ❌ TS 报错
```

适合的字段

- 主键 id
- 创建时间
- 后端生成、前端只读的数据

👉 **readonly 是“防御性编程”的一部分**

------

#### 接口继承 —— 结构复用，而不是复制

```ts
interface BaseEntity {
  id: number
  createdAt: string
}

interface User extends BaseEntity {
  name: string
}
```

Vue 项目价值

- 统一基础字段
- 避免字段定义分散
- 修改基础结构时，全局同步生效

👉 **interface 更适合“面向对象结构建模”**

------

### 类型别名（type）——更强的组合能力

#### 基本类型别名

```ts
type UserId = number
type Username = string
const id: UserId = 1
```

作用不是“换名字”，而是：

> **为类型引入语义**

------

#### 联合类型 `|` —— 多状态的真实表达

```ts
type RequestStatus = 'idle' | 'loading' | 'success' | 'error'
const status = ref<RequestStatus>('idle')
```

Vue 中的典型用途

- 页面状态
- 接口返回结果
- 权限、角色、模式切换

```ts
if (status.value === 'loading') {
  // 精确类型判断
}
```

👉 **联合类型是“枚举的轻量替代”**

------

#### 交叉类型 `&` —— 组合，而不是继承

```ts
type UserBase = {
  id: number
  name: string
}

type UserWithRole = UserBase & {
  role: 'admin' | 'user'
}
```

适合场景

- 接口返回拼装数据
- 动态增强对象能力
- 组合多个模型特性

👉 **`&` 是“类型层面的 mixin”**

------

#### `type` vs `interface` —— 取舍原则

核心结论（记住这一句就够了）

> **interface 用来“描述对象结构”，type 用来“表达类型关系”**

实践中的经验法则

- DTO / VO / 表单 / 状态对象 → **interface**
- 联合类型、交叉类型、工具类型 → **type**
- 能用 interface 的地方，优先 interface

👉 **不是谁更高级，而是“谁更合适”**

------

好的，这一节我继续 **严格对齐你前面的写作风格**，不做列表展开、不编号，用“概念 → 场景 → 示例 → 关键理解”的方式来讲。

------

## 函数与函数类型

------

### 函数声明 —— 行为的类型边界

#### 参数类型与返回值类型

> **函数是“输入 → 输出”的契约**

TypeScript 的核心价值就在于：
**让函数的输入和输出都变得可控、可推导、可验证**。

```ts
function sum(a: number, b: number): number {
  return a + b
}
sum(1, 2)     // ✅
sum('1', 2)   // ❌ TS 报错
```

关键理解点

- 参数类型约束 **调用方**
- 返回值类型约束 **实现方**

👉 **函数类型是双向约束，而不是“只给别人看”**

------

#### 可选参数 `?` 与默认参数

```ts
function greet(name: string, title?: string): string {
  return title ? `${title} ${name}` : name
}
```

可选参数的真实含义

> **调用时“可以不传”**

但在函数体内：

```ts
title.toUpperCase() // ❌ 可能是 undefined
```

必须先判断。

------

默认参数的区别

```ts
function greet(name: string, title = '先生'): string {
  return `${title} ${name}`
}
```

关键差异

- `?` → 类型是 `string | undefined`
- 默认参数 → 类型始终是 `string`

👉 **能用默认值，就不要用可选参数**

------

#### 剩余参数 `...args` —— 不定参数的建模

```ts
function sumAll(...nums: number[]): number {
  return nums.reduce((a, b) => a + b, 0)
}
```

Vue / 工具函数中的常见场景

```ts
function emit(event: string, ...args: unknown[]) {
  // 事件派发
}
```

当参数结构固定时，可以用元组增强语义

```ts
function log(...args: [string, number]) {
  const [msg, code] = args
}
```

👉 **`...args` 不是 `any[]` 的代名词**

------

### 函数类型定义 —— 把“行为”当成类型

#### 函数签名的抽象

```ts
type Formatter = (value: string) => string
const upper: Formatter = (v) => v.toUpperCase()
```

作用不是“少写代码”，而是：

> **统一一类函数的“行为形态”**

------

#### 回调函数类型 —— 最常见、也最容易写乱

```ts
type OnSuccess = (data: string) => void
function fetchData(onSuccess: OnSuccess) {
  onSuccess('ok')
}
```

Vue 中的真实场景

```ts
type SubmitHandler = (form: FormData) => Promise<void>
const onSubmit: SubmitHandler = async (form) => {
  // 表单提交逻辑
}
```

👉 **回调函数一定要有明确类型，否则会迅速退化成 `any`**

------

#### 高阶函数 —— 函数“吃函数”

> **高阶函数 = 参数或返回值是函数**

```ts
type Predicate<T> = (value: T) => boolean
function filterList<T>(
  list: T[],
  predicate: Predicate<T>
): T[] {
  return list.filter(predicate)
}
```

调用时的体验

```ts
filterList([1, 2, 3], n => n > 1)
```

关键理解点

- 类型在调用时 **自动推导**
- 泛型 + 函数类型 = 极强的表达能力

👉 **Vue、Pinia、Hooks 的底层，全是高阶函数**

------

好的，下面这一节我 **完全沿用你刚才的结构与语气**，重点放在「为什么要这样写」而不是堆概念。

------

## 联合、断言与类型收窄

------

### 联合类型（Union Types）

> **联合类型解决的是：“一个变量，在不同阶段可能长得不一样”**

#### 接口返回值的多状态建模（高频）

真实接口往往不是“永远成功”。

```ts
type ApiSuccess<T> = {
  code: 0
  data: T
}

type ApiFail = {
  code: 1
  message: string
}

type ApiResult<T> = ApiSuccess<T> | ApiFail
```

Vue3 场景使用

```ts
const result = ref<ApiResult<User> | null>(null)

if (result.value?.code === 0) {
  result.value.data.name
}
```

关键理解点

- **联合类型不是“随便多个类型”**
- 它是 **业务状态的建模工具**

👉 **好的联合类型 = 清晰的业务分支**

------

#### 表单值的多类型处理

```ts
type InputValue = string | number
const value = ref<InputValue>('')

if (typeof value.value === 'number') {
  value.value.toFixed(2)
}
```

适用场景

- 输入框
- 筛选条件
- URL 参数

👉 **只要你在心里想过“这里可能是 A，也可能是 B”——就该用联合类型**

------

### 类型断言（Type Assertion）

> **断言不是“让 TS 闭嘴”，而是“你比 TS 更确定”**

#### `as Type` 的合理使用场景

DOM 获取是最典型场景之一

```ts
const el = document.querySelector('#app') as HTMLDivElement
```

为什么必须断言？

- TS 不知道这个元素一定存在
- TS 也不知道它的具体类型

👉 **断言的前提：你有 100% 的确定性**

------

#### 非空断言 `!`

```ts
const input = ref<HTMLInputElement | null>(null)

input.value!.focus()
```

真实含义

> **“我保证这里不可能是 null”**

⚠️ 风险提示

- 生命周期不对
- 条件判断漏写
- 异步时序错误

👉 **`!` 是责任转移，不是安全保证**

------

#### 断言的安全边界（非常重要）

❌ 错误用法（绕过类型系统）

```ts
const data = {} as User
data.name.toUpperCase() // 运行期可能直接炸
```

✅ 正确心态

- 断言 ≠ 类型转换
- 断言 ≠ 修复类型设计

👉 **只在“外部世界 → TS 世界”的边界使用断言**

例如：

- DOM
- 接口原始数据
- 第三方库返回值

------

### 类型收窄（Type Narrowing）

> **TS 的智能，来自“判断之后，类型会变得更具体”**

#### `typeof` —— 基础类型收窄

```ts
function format(value: string | number) {
  if (typeof value === 'string') {
    return value.toUpperCase()
  }
  return value.toFixed(2)
}
```

特点

- 简单
- 高频
- 成本最低

------

#### `in` —— 对象结构判断

```ts
type Success = { data: string }
type Fail = { message: string }

function handle(result: Success | Fail) {
  if ('data' in result) {
    console.log(result.data)
  } else {
    console.log(result.message)
  }
}
```

适合场景

- 接口返回
- 配置对象
- 多结构对象

------

#### `instanceof` —— 类实例判断

```ts
function handleError(err: unknown) {
  if (err instanceof Error) {
    console.log(err.message)
  }
}
```

Vue 中常见于

- `try / catch`
- 第三方 SDK 错误处理

------

#### 自定义类型守卫（复杂逻辑必备）

> **当判断逻辑复杂到 if 看不懂时，就该抽成类型守卫**

```ts
function isSuccess<T>(
  result: ApiResult<T>
): result is ApiSuccess<T> {
  return result.code === 0
}
```

Vue 中的使用体验

```ts
if (isSuccess(result.value)) {
  result.value.data.name
}
```

关键价值

- 类型逻辑复用
- 代码更可读
- TS 推导能力直接拉满

👉 **类型守卫是“高级 TS 项目的标配”**

------

下面这一节我会 **明显放慢节奏**，因为泛型不是“看懂就会”，而是**要建立正确的设计直觉**。

------

## 泛型（TypeScript 的灵魂）

------

### 泛型基础

> **泛型解决的是：在不知道具体类型的前提下，保持类型信息不丢失**

#### 泛型函数（最常见起点）

```ts
function useValue<T>(value: T): T {
  return value
}
```

Vue3 中的直观体验

```ts
const name = useValue('admin')   // T 推导为 string
const age = useValue(18)         // T 推导为 number
```

关键理解点

- `T` 是**占位符**
- 调用时由 TS 自动推导
- **返回值类型与入参保持一致**

👉 **这就是“类型不丢失”**

------

#### 泛型接口

```ts
interface Box<T> {
  value: T
}
const userBox: Box<User> = {
  value: { id: 1, name: 'Tom' }
}
```

适用场景

- 接口返回值
- 状态容器
- 包装类结构

------

#### 泛型类型别名

```ts
type Wrapper<T> = {
  data: T
  loading: boolean
}
```

Vue 中常见用法

```ts
const state = ref<Wrapper<User>>({
  data: { id: 1, name: 'Tom' },
  loading: false
})
```

👉 **接口与类型别名都能写泛型，区别不在“能不能”，而在“语义”**

------

### 泛型约束（让泛型“可用”）

> **没有约束的泛型，只能传来又传回**

#### `extends` 的约束意义

```ts
function getId<T extends { id: number }>(obj: T) {
  return obj.id
}
getId({ id: 1, name: 'Tom' }) // ✅
getId({ name: 'Tom' })       // ❌
```

核心价值

- 限定 **T 至少具备某些能力**
- 同时 **不丢失具体类型**

👉 **约束不是限制，是“能力声明”**

------

#### 多泛型参数的设计场景

```ts
interface ApiResponse<T, E> {
  data: T
  error: E | null
}
const res: ApiResponse<User, string> = {
  data: { id: 1, name: 'Tom' },
  error: null
}
```

什么时候该用多个泛型？

- 输入与输出不是同一类型
- 成功与失败结构不同
- 数据与错误需要同时建模

------

#### 默认泛型参数（提升可用性）

```ts
interface Result<T = unknown> {
  data: T
}
const r1: Result = { data: null }
const r2: Result<User> = { data: { id: 1, name: 'Tom' } }
```

价值点

- 简单场景“开箱即用”
- 复杂场景“逐步增强”

👉 **优秀的泛型设计 = 低心智负担**

------

### 泛型实战（项目里真正用得到的）

#### 接口返回结构封装（高频）

```ts
interface ApiResult<T> {
  code: number
  message: string
  data: T
}
function fetchUser(): Promise<ApiResult<User>> {
  return request('/user')
}
```

Vue 中使用

```ts
const user = ref<User | null>(null)

fetchUser().then(res => {
  user.value = res.data
})
```

👉 **泛型让接口返回值“自动适配数据结构”**

------

#### 通用工具函数抽象

```ts
function first<T>(list: T[]): T | undefined {
  return list[0]
}
const id = first([1, 2, 3])       // number | undefined
const name = first(['a', 'b'])    // string | undefined
```

为什么不用 `any[]`？

- 会丢失返回值类型
- 会破坏后续链式调用的类型推导

------

#### 列表 / 分页模型建模（非常常见）

```ts
interface Page<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}
const pageData = ref<Page<User>>({
  list: [],
  total: 0,
  page: 1,
  pageSize: 10
})
```

优势

- **一套分页模型，适配所有实体**
- 自动推导 `list` 中的元素类型

👉 **这是泛型“工程价值”最直观的体现**

------

这一部分我们**不写“玩具函数”**，而是只写 **真实项目里会长期存在的工具函数**，并且**让 TypeScript 真正参与进来**，而不是“JS 外面套一层 TS”。

------

## 工具函数使用（Utility Functions）

------

### 字符串处理

#### 判空（高频）

```ts
export function isEmpty(value: unknown): value is '' | null | undefined {
  return value === '' || value === null || value === undefined
}
```

Vue 中使用

```ts
const keyword = ref<string>('')

if (isEmpty(keyword.value)) {
  console.log('请输入关键字')
}
```

关键点

- 使用 **类型守卫** 返回值
- 判空后，TS 会自动收窄类型

👉 **不是只返回 boolean，而是“带类型信息的判断”**

------

#### `trim`（安全版本）

```ts
export function safeTrim(value: unknown): string {
  if (typeof value !== 'string') return ''
  return value.trim()
}
const name = ref<unknown>(' admin ')
name.value = safeTrim(name.value)
```

价值

- 防止非字符串直接调用 `.trim()`
- 接口数据、表单输入都安全

------

#### 字符串截断（带省略号）

```ts
export function truncate(
  value: string,
  maxLength: number
): string {
  return value.length > maxLength
    ? value.slice(0, maxLength) + '...'
    : value
}
truncate('TypeScript is awesome', 10)
```

👉 **简单函数，明确入参和返回值，不留 any**

------

### 数值处理

#### 精度处理（避免浮点坑）

```ts
export function toFixed(
  value: number,
  digits = 2
): number {
  return Number(value.toFixed(digits))
}
toFixed(0.1 + 0.2) // 0.3
```

TS 价值点

- 明确返回 `number`
- 不返回字符串，避免二次转换

------

#### 范围限制（clamp）

```ts
export function clamp(
  value: number,
  min: number,
  max: number
): number {
  return Math.min(Math.max(value, min), max)
}
const page = ref<number>(1)
page.value = clamp(page.value, 1, 10)
```

👉 **数值约束 = 业务规则的一部分**

------

### 数组处理

#### 去重（保持类型）

```ts
export function unique<T>(list: T[]): T[] {
  return Array.from(new Set(list))
}
const ids = unique([1, 2, 2, 3]) // number[]
```

TS 价值

- 泛型保证元素类型不丢失
- 返回值仍然是 `T[]`

------

#### 分组（业务非常常见）

```ts
export function groupBy<T, K extends keyof any>(
  list: T[],
  key: (item: T) => K
): Record<K, T[]> {
  return list.reduce((acc, item) => {
    const groupKey = key(item)
    acc[groupKey] ||= []
    acc[groupKey].push(item)
    return acc
  }, {} as Record<K, T[]>)
}
groupBy(users, user => user.role)
```

👉 **类型正确的 `Record` 是分组函数的灵魂**

------

#### 扁平化（有限层级）

```ts
export function flatten<T>(list: T[][]): T[] {
  return list.reduce((acc, cur) => acc.concat(cur), [])
}
flatten([[1, 2], [3, 4]]) // number[]
```

------

### 对象处理

#### 深拷贝（明确边界）

```ts
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}
```

说明

- 只适合 **纯数据对象**
- 不支持函数 / Date / Map / Set

👉 **TS 能约束类型，但拷贝能力是运行时问题**

------

#### 对象合并（类型安全）

```ts
export function merge<T extends object, U extends object>(
  target: T,
  source: U
): T & U {
  return Object.assign({}, target, source)
}
const merged = merge({ a: 1 }, { b: 'x' })
// 类型：{ a: number } & { b: string }
```

------

#### 安全取值（防止 undefined 炸链）

```ts
export function get<T, K extends keyof T>(
  obj: T,
  key: K
): T[K] {
  return obj[key]
}
const userName = get(user, 'name')
```

👉 **比 `obj?.name` 更适合工具层复用**

------

好，这一节我们**只讲“项目里每天都在用”的工具类型**，不讲百科，不堆概念，所有例子都围绕 **真实 Vue3 + 业务模型**。

------

## 内置工具类型（项目效率神器）

------

### `Partial<T>` —— 让“完整模型”变成“可选模型”

核心含义

> **把 T 的所有属性变成可选**

```ts
interface User {
  id: number
  name: string
  age: number
}
type UserPatch = Partial<User>
```

Vue 表单场景

```ts
const form = ref<Partial<User>>({})
```

关键理解

- 适合 **编辑表单**
- 不适合 **最终提交数据**

👉 **`Partial` 是“中间态”，不是终态**

------

### `Required<T>` —— 把“可能缺失”强制补齐

```ts
type FullUser = Required<User>
```

使用场景

- 表单提交前
- 接口返回后做二次校验

```ts
function submit(user: Required<User>) {
  // 可以放心使用所有字段
}
```

👉 **`Required` 是对“完整性”的声明**

------

### `Readonly<T>` —— 防止误修改

```ts
type ReadonlyUser = Readonly<User>
const user = ref<ReadonlyUser>({
  id: 1,
  name: 'Tom',
  age: 18
})

user.value.age = 20 // ❌ TS 报错
```

使用建议

- 接口返回数据
- 全局状态快照
- 配置型对象

👉 **不可变数据，是“稳定系统”的基础**

------

### `Pick<T, K>` —— 精准选择字段

```ts
type UserBasic = Pick<User, 'id' | 'name'>
```

Vue 场景

```ts
const list = ref<UserBasic[]>([])
```

价值

- 不复制结构
- 避免“字段不一致”

👉 **Pick 是“裁剪”，不是“新建”**

------

### `Omit<T, K>` —— 精准排除字段

```ts
type UserWithoutId = Omit<User, 'id'>
```

新增接口场景

```ts
function createUser(data: UserWithoutId) {}
```

👉 **新增 ≠ 编辑，类型一定要区分**

------

### `Record<K, T>` —— 字典与映射结构

```ts
type Role = 'admin' | 'user'
const roleMap: Record<Role, string> = {
  admin: '管理员',
  user: '普通用户'
}
```

Vue 中的高频用法

```ts
const statusText: Record<number, string> = {
  0: '未开始',
  1: '进行中',
  2: '已完成'
}
```

👉 **`Record` 是“对象结构的 for 循环”**

------

### 工具类型的组合使用（这才是重点）

#### 表单模型派生

```ts
type UserForm = Partial<Omit<User, 'id'>>
```

含义拆解

- `Omit`：新增不需要 id
- `Partial`：表单未填完

👉 **组合 ≠ 复杂，组合 = 语义清晰**

------

#### 请求参数 / 返回值拆分

```ts
type UserQuery = Pick<User, 'name' | 'age'>
type UserResult = Readonly<User>
function fetchUser(params: UserQuery): Promise<UserResult> {}
```

效果

- 输入、输出角色明确
- 避免一个类型“到处乱用”

------

#### 前后端字段裁剪（非常常见）

```ts
interface ApiUser {
  id: number
  name: string
  password: string
}
type SafeUser = Omit<ApiUser, 'password'>
```

👉 **类型本身就是“安全策略的一部分”**

------

## 字面量与类型推导

------

### 字面量类型 —— 把“值”变成“类型”

#### 字符串字面量类型

```ts
type Status = 'loading' | 'success' | 'error'
```

Vue 场景

```ts
const status = ref<Status>('loading')
status.value = 'success' // ✅
status.value = 'done'    // ❌ TS 报错
```

关键理解

- 值的范围被**严格限制**
- 非法状态在**编码期直接被拦截**

👉 **字面量类型 = 枚举的轻量替代**

------

#### 数字字面量类型

```ts
type Code = 200 | 401 | 500
function handleCode(code: Code) {}
```

使用建议

- **有限、明确的数值集合**
- 状态码、步骤索引、等级值

👉 **比 `number` 更安全**

------

#### `as const` —— 锁定字面量

```ts
const roles = ['admin', 'user']
```

此时类型是：

```ts
string[]
```

使用 `as const`

```ts
const roles = ['admin', 'user'] as const
```

类型变为：

```ts
readonly ['admin', 'user']
```

进一步派生类型

```ts
type Role = typeof roles[number]
// 'admin' | 'user'
```

Vue 中的真实用途

```ts
const TABS = [
  { key: 'base', label: '基础信息' },
  { key: 'role', label: '角色信息' }
] as const
```

👉 **`as const` 是“数据驱动类型”的核心开关**

------

### 类型推导 —— TS 是如何“猜你想干什么的”

#### 自动推导规则（你每天都在用）

```ts
const count = ref(0)
```

TS 推导为：

```ts
Ref<number>
const list = ref([])
```

TS 推导为：

```ts
Ref<never[]>
```

⚠️ **这里已经埋雷了**

------

#### 显式声明 vs 隐式推导

隐式（推荐）

```ts
const age = ref(18)
```

显式（必要时）

```ts
const users = ref<User[]>([])
```

判断标准

- **值能表达完整类型 → 交给推导**
- **空值 / 容器 / 延迟赋值 → 必须声明**

👉 **“空”是推导失效的最大来源**

------

#### 推导失效的常见场景（高频踩坑）

空数组

```ts
const list = ref([]) // never[]
```

正确写法

```ts
const list = ref<number[]>([])
```

空对象

```ts
const form = ref({})
form.value.name = 'Tom' // ❌
```

正确写法

```ts
const form = ref<Partial<User>>({})
```

条件返回不同类型

```ts
function getValue(flag: boolean) {
  return flag ? 1 : 'a'
}
```

推导结果

```ts
number | string
```

👉 **推导不是失败，而是如实反映你的代码**

------

## 模块化与声明文件

------

### 模块系统 —— 代码与类型的边界

#### `import / export` 的本质

在 TypeScript 中：

> **模块 = 作用域 + 类型边界**

```ts
// user.ts
export interface User {
  id: number
  name: string
}
// useUser.ts
import type { User } from './user'
```

关键点

- `import type` **只引入类型**
- 不参与运行时
- 避免打包体积膨胀、循环依赖

👉 **类型和逻辑，要在意识上分层**

------

#### 默认导出 vs 命名导出

默认导出

```ts
export default function useUser() {}
```

命名导出

```ts
export function useUser() {}
export function useRole() {}
```

真实项目建议

- **工具函数 / Hooks**：命名导出
- **Vue 组件**：默认导出
- **类型定义**：命名导出

原因很简单：

> **类型需要被“精确引用”，而不是随意起名**

------

#### 模块边界与职责划分（非常重要）

错误示例（常见）

```ts
// user.ts
export interface User {}
export function fetchUser() {}
export function formatUser() {}
```

问题

- 类型、请求、业务逻辑混在一起
- 后期必乱

推荐拆分方式

```ts
types/user.ts      // 只放 interface / type
api/user.ts        // 只放接口请求
hooks/useUser.ts   // 组合逻辑
```

👉 **一个模块只回答一个问题**

------

### 声明文件（`.d.ts`）—— 类型世界的“外挂接口”

#### `.d.ts` 是什么

> **只存在于编译期，不生成 JS**

```ts
// global.d.ts
declare const __APP_VERSION__: string
```

你可以在任何地方直接用：

```ts
console.log(__APP_VERSION__)
```

------

#### 第三方库声明（高频）

当你遇到：

```ts
Could not find a declaration file for module 'xxx'
```

临时解决方案（兜底）

```ts
// types/xxx.d.ts
declare module 'xxx'
```

更好的方式（补充最小类型）

```ts
declare module 'xxx' {
  export function init(): void
}
```

👉 **不要一上来就 `declare module 'xxx': any`**

------

#### 全局类型声明（慎用，但必要）

```ts
// global.d.ts
interface PageResult<T> {
  list: T[]
  total: number
}
```

使用时无需 import

```ts
const result: PageResult<User>
```

使用原则

- **全局 ≠ 方便**
- 只放 **真正全局、稳定、不依赖业务的类型**

------

#### 扩展已有类型（非常容易写错）

典型场景：扩展 `Window`

```ts
// global.d.ts
declare global {
  interface Window {
    __TOKEN__: string
  }
}
```

⚠️ 必须注意

- 文件必须是 **模块**（至少有一个 `export {}`）
- 否则可能被 TS 忽略

```ts
export {}
```

👉 **扩展 ≠ 覆盖，是“合并声明”**

------

这一节我们**不鼓吹 Class，也不妖魔化 Class**，而是把它放在 **现代前端 TS 项目中“该在的位置”**。

------

## Class（了解即可，非核心）

------

### 类的基础能力 —— TS 对 OOP 的最小支持

#### `public / private / protected`

```ts
class User {
  public name: string
  private password: string
  protected role: string

  constructor(name: string, password: string, role: string) {
    this.name = name
    this.password = password
    this.role = role
  }
}
```

访问规则

- `public`：任何地方都能访问（默认）
- `private`：**类内部**
- `protected`：类内部 + 子类

```ts
const user = new User('Tom', '123456', 'admin')

user.name       // ✅
user.password   // ❌
```

👉 **访问修饰符是“意图声明”，不是安全防护**

------

#### 构造函数（constructor）

```ts
class Counter {
  count: number

  constructor(initial = 0) {
    this.count = initial
  }
}
```

Vue 中的现实情况

- **很少 new**
- 更多是 **函数式初始化**

👉 **构造函数在前端里，远不如后端重要**

------

#### 只读属性（readonly）

```ts
class Config {
  readonly appName = 'MyApp'
}
const cfg = new Config()
cfg.appName = 'Other' // ❌
```

意义

- 防止被误改
- 明确“初始化后不可变”

👉 **readonly 更像“约束约定”，不是强安全**

------

### 类与接口 —— “能不能做到” vs “长什么样”

#### `implements` 的意义

```ts
interface StorageService {
  get(key: string): string | null
  set(key: string, value: string): void
}
class LocalStorageService implements StorageService {
  get(key: string) {
    return localStorage.getItem(key)
  }
  set(key: string, value: string) {
    localStorage.setItem(key, value)
  }
}
```

关键理解

- `implements` 只校验 **结构**
- 不关心具体实现

👉 **接口是“能力合同”**

------

#### 抽象类（abstract）

```ts
abstract class BaseService {
  abstract fetch(): Promise<void>

  log() {
    console.log('fetching...')
  }
}
class UserService extends BaseService {
  async fetch() {
    // 实现具体逻辑
  }
}
```

使用场景

- 需要 **共享实现**
- 又要求子类 **必须实现某些方法**

👉 **抽象类 = 接口 + 部分实现**

------

### Class 在现代前端 TS 项目中的真实定位

现实结论（非常重要）

> **Class 不是前端主角**

在 Vue3 + Composition API 中：

- 状态 → `ref / reactive`
- 逻辑组合 → 函数 / hooks
- 复用 → 泛型 + 工具函数

Class 更适合：

- SDK 封装
- 服务层（如存储、通信）
- 需要实例化、有生命周期的对象

不适合：

- 页面状态
- 业务流程
- 表单逻辑

👉 **90% 的前端代码，用不到 Class**
