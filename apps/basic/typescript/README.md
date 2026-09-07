# TypeScript

## TypeScript 基础认知

TypeScript 是前端项目中常用的静态类型增强工具，它不是一门完全脱离 JavaScript 的新语言，而是在 JavaScript 基础上增加类型系统、接口、泛型、类型推断等能力。它的核心价值是让代码在开发阶段就能暴露更多问题，提升多人协作、代码维护、接口联调和大型项目重构的可靠性。

### TypeScript 与 JavaScript 的关系

TypeScript 可以理解为 JavaScript 的超集。也就是说，合法的 JavaScript 代码通常也是合法的 TypeScript 代码。TypeScript 在 JavaScript 的基础上增加了类型标注、类型检查、接口、泛型、枚举、类型别名等语法能力，最终仍然会被编译成 JavaScript 后在浏览器或 Node.js 环境中运行。

TypeScript 并不会改变 JavaScript 的运行机制。类型信息主要服务于开发阶段，在编译后会被移除。因此，TypeScript 解决的是开发期的代码可靠性和可维护性问题，而不是替代 JavaScript 的运行时行为。

下面的示例展示了 JavaScript 和 TypeScript 在写法上的区别。

```javascript
// JavaScript：参数类型没有限制，调用时传入错误类型也不会在开发阶段报错
function add(a, b) {
  return a + b
}

add(1, 2)
add('1', 2)
// TypeScript：通过类型标注限制参数和返回值，提前发现错误调用
function add(a: number, b: number): number {
  return a + b
}

add(1, 2)
// add('1', 2) // 类型错误：string 不能赋值给 number
```

在前端项目中，TypeScript 通常不会单独存在，而是与 Vue、React、Vite、Webpack、Pinia、Redux、Axios、Element Plus 等工具或框架一起使用。它主要负责描述数据结构、函数签名、组件属性、接口返回值和业务模型。

需要注意的是，TypeScript 类型检查发生在开发和构建阶段。如果接口返回的数据结构在运行时不符合类型定义，TypeScript 本身不会自动拦截，因此关键接口数据仍然需要配合运行时校验、默认值处理或异常兜底逻辑。

### 静态类型的作用

静态类型的主要作用是在代码运行之前发现潜在问题。对于前端项目来说，很多问题并不是语法错误，而是字段名称写错、接口结构理解错误、组件参数传错、函数返回值处理不完整等。TypeScript 可以在编码阶段提前暴露这些问题。

例如，接口返回用户信息时，类型定义可以明确字段结构。

```typescript
interface UserInfo {
  id: number
  username: string
  nickname?: string
  enabled: boolean
}

function renderUser(user: UserInfo): string {
  return user.nickname || user.username
}

const user: UserInfo = {
  id: 1,
  username: 'ateng',
  enabled: true
}

renderUser(user)
```

在这个示例中，`id`、`username` 和 `enabled` 是必填字段，`nickname` 是可选字段。调用 `renderUser` 时，编辑器和编译器都可以根据 `UserInfo` 判断传入对象是否符合要求。

静态类型在项目中的常见价值包括以下几个方面。

| 作用           | 说明                                                       |
| -------------- | ---------------------------------------------------------- |
| 提前发现错误   | 在开发阶段发现参数类型错误、字段缺失、返回值不匹配等问题   |
| 增强代码提示   | IDE 可以根据类型提供字段提示、方法提示和跳转能力           |
| 提升重构安全性 | 修改字段名、函数参数或接口结构时，可以快速定位受影响代码   |
| 约束协作边界   | 前后端接口、组件 Props、公共函数参数都可以通过类型形成约束 |
| 降低维护成本   | 新成员阅读代码时，可以通过类型快速理解数据结构和调用关系   |

静态类型并不意味着代码一定不会出错。它主要约束的是代码书写阶段可以推导出的结构问题。对于接口异常、空值、权限失败、网络错误、用户输入非法等运行时问题，仍然需要通过业务逻辑处理。

例如，下面的接口类型只能说明理想返回结构，不能保证后端一定返回该结构。

```typescript
interface ApiResult<T> {
  code: number
  message: string
  data: T
}

interface UserDetail {
  id: number
  username: string
  roles: string[]
}

async function getUserDetail(id: number): Promise<ApiResult<UserDetail>> {
  const response = await fetch(`/api/users/${id}`)
  return response.json()
}
```

在实际项目中，还需要处理请求失败、`data` 为空、字段缺失、权限不足等情况。

```typescript
async function loadUserDetail(id: number): Promise<UserDetail | null> {
  try {
    const result = await getUserDetail(id)

    if (result.code !== 200 || !result.data) {
      console.warn('获取用户详情失败：', result.message)
      return null
    }

    return result.data
  } catch (error) {
    console.error('请求用户详情异常：', error)
    return null
  }
}
```

### 前端项目中的使用场景

TypeScript 在前端项目中的使用范围比较广，通常会贯穿页面、组件、接口、状态管理、工具函数和构建配置。它的使用重点不是给所有变量机械地添加类型，而是优先为项目边界、业务模型和复用代码建立稳定的类型约束。

在 Vue 或 React 项目中，最常见的使用场景是组件 Props 类型定义。通过类型定义，可以明确组件需要接收哪些参数，哪些参数是必填的，哪些参数是可选的。

```typescript
interface UserCardProps {
  id: number
  username: string
  avatar?: string
  enabled: boolean
}
```

在 Vue 3 中，可以用于 `defineProps`。

```vue
<script setup lang="ts">
interface UserCardProps {
  id: number
  username: string
  avatar?: string
  enabled: boolean
}

defineProps<UserCardProps>()
</script>
```

在 React 中，可以用于组件参数。

```tsx
interface UserCardProps {
  id: number
  username: string
  avatar?: string
  enabled: boolean
}

function UserCard(props: UserCardProps) {
  return (
    <div>
      <span>{props.username}</span>
      <span>{props.enabled ? '启用' : '禁用'}</span>
    </div>
  )
}
```

接口请求类型也是 TypeScript 在前端项目中的核心使用场景。前端通常需要维护请求参数、响应结构、分页数据、错误信息等类型，这些类型可以减少接口联调中的字段误用问题。

```typescript
interface PageQuery {
  pageNum: number
  pageSize: number
  keyword?: string
}

interface PageResult<T> {
  list: T[]
  total: number
  pageNum: number
  pageSize: number
}

interface UserItem {
  id: number
  username: string
  nickname: string
  enabled: boolean
}

async function queryUserPage(params: PageQuery): Promise<PageResult<UserItem>> {
  const response = await fetch('/api/users/page', {
    method: 'POST',
    body: JSON.stringify(params)
  })

  return response.json()
}
```

状态管理也是常见场景。无论是 Pinia、Vuex、Redux 还是 Zustand，都可以通过 TypeScript 明确状态结构、更新方法参数和计算结果类型。

```typescript
interface UserState {
  token: string
  userInfo: {
    id: number
    username: string
    roles: string[]
  } | null
}

const state: UserState = {
  token: '',
  userInfo: null
}
```

表单数据也适合使用 TypeScript 进行约束，尤其是后台管理系统中的新增、编辑、查询表单。

```typescript
interface UserForm {
  username: string
  nickname: string
  mobile?: string
  enabled: boolean
  roleIds: number[]
}

const form: UserForm = {
  username: '',
  nickname: '',
  enabled: true,
  roleIds: []
}
```

工具函数和公共方法同样适合使用 TypeScript。对于复用频率高的函数，明确参数和返回值可以避免调用方误用。

```typescript
function formatUserStatus(enabled: boolean): string {
  return enabled ? '启用' : '禁用'
}

function getArrayFirst<T>(list: T[]): T | undefined {
  return list.length > 0 ? list[0] : undefined
}
```

在真实前端项目中，TypeScript 通常优先应用在以下位置。

| 使用位置 | 典型内容                                        |
| -------- | ----------------------------------------------- |
| 组件     | Props、Emits、Slots、组件实例类型               |
| API 模块 | 请求参数、响应结果、分页结构、错误结构          |
| 业务模型 | 用户、角色、菜单、订单、商品等实体类型          |
| 状态管理 | Store State、Getter、Action、Mutation 参数      |
| 表单     | 查询表单、新增表单、编辑表单、校验规则          |
| 路由     | 路由 Meta、权限标识、菜单结构                   |
| 工具函数 | 通用函数参数、返回值、泛型工具方法              |
| 第三方库 | Axios、Element Plus、ECharts、Day.js 等类型适配 |

落地时建议先从项目边界开始补充类型，例如接口响应、组件 Props、公共工具函数和状态管理。不要一开始追求所有代码都拥有复杂类型，否则容易增加维护成本。TypeScript 的目标是让项目更可靠、更容易协作，而不是让类型本身变成负担。



## 开发环境配置

开发环境配置决定了 TypeScript 在项目中的检查方式、编译目标、模块解析规则和编辑器提示效果。前端项目通常不直接使用 `tsc` 输出最终构建产物，而是由 Vite、Webpack、Vue CLI、Next.js 等构建工具集成 TypeScript 编译能力。

### TypeScript 安装与版本管理

TypeScript 一般作为项目开发依赖安装，而不是依赖全局安装。这样可以保证团队成员、CI 环境和生产构建环境使用同一个 TypeScript 版本，避免因为版本差异导致类型检查结果不一致。

在项目根目录安装 TypeScript。

```bash
# npm
npm install typescript -D

# pnpm
pnpm add typescript -D

# yarn
yarn add typescript -D
```

安装完成后，可以通过以下命令查看当前项目使用的 TypeScript 版本。

```bash
npx tsc --version
```

在实际前端项目中，建议把 TypeScript 版本固定在 `package.json` 中，并提交 `package-lock.json`、`pnpm-lock.yaml` 或 `yarn.lock` 文件。

```json
{
  "devDependencies": {
    "typescript": "5.4.5"
  }
}
```

不建议使用下面这种宽泛版本写法。

```json
{
  "devDependencies": {
    "typescript": "^5.4.5"
  }
}
```

`^5.4.5` 可能会在重新安装依赖时升级到兼容范围内的新版本。对于大型前端项目来说，TypeScript 小版本升级也可能带来更严格的类型检查，因此更推荐在团队项目中固定版本。

如果项目使用 `pnpm`，可以在 `package.json` 中声明包管理器版本。

```json
{
  "packageManager": "pnpm@9.12.0"
}
```

这样可以让团队成员明确项目使用的包管理器和版本，减少依赖安装差异。

### tsconfig.json 配置

`tsconfig.json` 是 TypeScript 项目的核心配置文件，用于声明编译目标、模块规范、类型检查严格程度、路径别名、包含文件范围等内容。前端项目中通常会根据运行环境拆分多个配置文件，例如 `tsconfig.json`、`tsconfig.app.json`、`tsconfig.node.json`。

一个常见的前端项目基础配置如下。

文件位置：`tsconfig.json`

```jsonc
{
  // 继承或引用其他 tsconfig 文件，适合大型项目拆分配置
  "references": [
    {
      "path": "./tsconfig.app.json"
    },
    {
      "path": "./tsconfig.node.json"
    }
  ],
  "files": []
}
```

应用代码的 TypeScript 配置可以放在 `tsconfig.app.json` 中。

文件位置：`tsconfig.app.json`

```jsonc
{
  "compilerOptions": {
    // 编译目标，现代前端项目通常使用 ES2020 或更高版本
    "target": "ES2020",

    // 使用的标准库类型，DOM 表示浏览器环境类型
    "lib": ["ES2020", "DOM", "DOM.Iterable"],

    // 模块格式，前端构建工具通常使用 ESNext
    "module": "ESNext",

    // 模块解析方式，适合 Vite、Webpack 等前端构建工具
    "moduleResolution": "Bundler",

    // 不输出编译文件，类型检查交给 TypeScript，打包交给构建工具
    "noEmit": true,

    // 开启严格模式，是 TypeScript 项目类型安全的基础
    "strict": true,

    // 禁止隐式 any，避免参数或变量失去类型约束
    "noImplicitAny": true,

    // 开启严格空值检查，避免 null 和 undefined 被随意使用
    "strictNullChecks": true,

    // 允许导入 JSON 文件
    "resolveJsonModule": true,

    // 允许默认导入 CommonJS 模块
    "esModuleInterop": true,

    // 保持 JSX 语法，由框架或构建工具继续处理
    "jsx": "preserve",

    // 路径别名基础路径
    "baseUrl": ".",

    // 路径别名配置，常用于 src 目录
    "paths": {
      "@/*": ["src/*"]
    },

    // 跳过第三方库声明文件检查，提升检查速度
    "skipLibCheck": true
  },
  "include": ["src/**/*.ts", "src/**/*.tsx", "src/**/*.vue"],
  "exclude": ["node_modules", "dist"]
}
```

Node 环境相关配置可以单独放在 `tsconfig.node.json` 中，主要用于 `vite.config.ts`、构建脚本等文件。

文件位置：`tsconfig.node.json`

```jsonc
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "types": ["node"],
    "noEmit": true,
    "strict": true,
    "skipLibCheck": true
  },
  "include": ["vite.config.ts"]
}
```

常用配置项说明如下。

| 配置项             | 作用                                   |
| ------------------ | -------------------------------------- |
| `target`           | 指定编译目标 JavaScript 版本           |
| `lib`              | 指定可用的标准库类型，例如 DOM、ES2020 |
| `module`           | 指定模块规范                           |
| `moduleResolution` | 指定模块解析方式                       |
| `strict`           | 开启严格类型检查                       |
| `noImplicitAny`    | 禁止隐式 `any`                         |
| `strictNullChecks` | 严格区分 `null` 和 `undefined`         |
| `baseUrl`          | 设置路径解析基础目录                   |
| `paths`            | 配置路径别名                           |
| `include`          | 指定参与类型检查的文件                 |
| `exclude`          | 排除不需要检查的目录                   |
| `noEmit`           | 只做类型检查，不输出文件               |

在新项目中建议开启 `strict`。如果是老项目迁移 TypeScript，可以先关闭部分严格配置，再逐步收紧。

```jsonc
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": false,
    "strictNullChecks": false
  }
}
```

这种方式适合 JavaScript 老项目渐进式迁移，但最终仍建议逐步开启完整严格检查。

### 构建工具集成

前端项目中，TypeScript 通常通过构建工具集成。构建工具负责模块打包、资源处理、热更新、代码压缩和产物输出，TypeScript 负责类型检查和语法转换。

以 Vite 项目为例，可以直接创建 Vue + TypeScript 项目。

```bash
pnpm create vite my-vue-app --template vue-ts
cd my-vue-app
pnpm install
pnpm dev
```

React + TypeScript 项目可以使用下面的模板。

```bash
pnpm create vite my-react-app --template react-ts
cd my-react-app
pnpm install
pnpm dev
```

Vite 配置中通常需要同步配置路径别名，保证构建工具和 TypeScript 的路径解析一致。

文件位置：`vite.config.ts`

```typescript
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
```

如果使用 React，则配置如下。

文件位置：`vite.config.ts`

```typescript
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
```

项目脚本通常会区分开发、构建、预览和类型检查。

文件位置：`package.json`

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc --noEmit && vite build",
    "preview": "vite preview",
    "type-check": "vue-tsc --noEmit"
  }
}
```

Vue 项目建议使用 `vue-tsc` 做类型检查，因为普通 `tsc` 无法完整理解 `.vue` 单文件组件中的模板类型。

```bash
pnpm add vue-tsc -D
```

React 项目通常可以直接使用 `tsc` 做类型检查。

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc --noEmit && vite build",
    "preview": "vite preview",
    "type-check": "tsc --noEmit"
  }
}
```

构建阶段建议始终执行类型检查。这样可以避免本地开发时忽略的类型错误进入生产构建。

### 编辑器与类型提示配置

TypeScript 的开发体验高度依赖编辑器类型提示。常用编辑器是 VS Code，它可以基于 `tsconfig.json` 提供类型提示、错误标记、自动补全、定义跳转、引用查找和重构能力。

Vue 项目建议安装 Vue 官方 TypeScript 插件，React 项目通常使用 VS Code 内置 TypeScript 支持即可。项目应优先使用工作区安装的 TypeScript 版本，而不是 VS Code 内置版本。

在 VS Code 中可以通过命令面板选择：

```text
TypeScript: Select TypeScript Version
```

然后选择：

```text
Use Workspace Version
```

为了保证团队编辑器配置一致，可以提交 `.vscode/settings.json`。

文件位置：`.vscode/settings.json`

```json
{
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```

如果项目使用 ESLint，还需要配合 TypeScript ESLint 解析器和规则。

```bash
pnpm add eslint typescript-eslint -D
```

基础 ESLint 配置示例如下。

文件位置：`eslint.config.js`

```javascript
import js from '@eslint/js'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx,vue}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn'
    }
  }
)
```

编辑器配置的目标不是替代 TypeScript，而是让类型问题在编码过程中尽早暴露。团队项目中建议把类型检查命令加入 CI 流程，避免只依赖个人编辑器提示。

## 基础类型使用

基础类型是 TypeScript 类型系统的入口。前端项目中的接口数据、组件参数、表单字段、状态对象和工具函数，大多都是由基础类型组合而来。掌握基础类型的目标不是记住所有语法，而是能够准确描述业务数据结构。

### 原始类型

TypeScript 中常见的原始类型包括 `string`、`number`、`boolean`、`null`、`undefined`、`symbol` 和 `bigint`。前端项目中最常用的是 `string`、`number` 和 `boolean`。

```typescript
const username: string = 'ateng'
const age: number = 18
const enabled: boolean = true
const emptyValue: null = null
const notDefined: undefined = undefined
```

在业务代码中，原始类型常用于表单字段、查询参数、开关状态和展示文本。

```typescript
interface UserQuery {
  keyword: string
  pageNum: number
  pageSize: number
  enabled: boolean
}

const query: UserQuery = {
  keyword: '',
  pageNum: 1,
  pageSize: 10,
  enabled: true
}
```

需要注意的是，`number` 同时表示整数和小数。TypeScript 不区分 `int`、`long`、`float`、`double`。

```typescript
const total: number = 100
const price: number = 99.99
```

对于可能为空的字段，应明确使用联合类型，而不是直接放任其为任意值。

```typescript
let token: string | null = null

token = 'access-token-value'
token = null
```

### 数组与元组

数组用于描述一组相同类型的数据。TypeScript 中数组类型有两种常见写法。

```typescript
const roleNames: string[] = ['admin', 'user']
const roleIds: Array<number> = [1, 2, 3]
```

在前端项目中，接口列表、表格数据、下拉选项、菜单树、权限标识等都经常使用数组类型。

```typescript
interface UserItem {
  id: number
  username: string
  enabled: boolean
}

const userList: UserItem[] = [
  {
    id: 1,
    username: 'admin',
    enabled: true
  },
  {
    id: 2,
    username: 'test',
    enabled: false
  }
]
```

元组用于描述固定长度、固定位置类型的数组。它适合表达位置含义明确的数据。

```typescript
const position: [number, number] = [120.15, 30.28]

const userEntry: [number, string, boolean] = [1, 'admin', true]
```

元组在普通业务代码中不要滥用，因为它依赖位置表达含义，可读性不如对象。如果字段含义复杂，更推荐使用对象。

```typescript
interface Position {
  longitude: number
  latitude: number
}

const positionInfo: Position = {
  longitude: 120.15,
  latitude: 30.28
}
```

数组和元组的选择原则是：列表数据使用数组，固定位置结构可以使用元组，业务字段较多时优先使用对象。

### 对象类型

对象类型用于描述具有固定字段结构的数据。前端项目中的接口响应、表单模型、组件参数、状态数据都大量使用对象类型。

可以直接使用对象类型标注变量。

```typescript
const user: {
  id: number
  username: string
  enabled: boolean
} = {
  id: 1,
  username: 'admin',
  enabled: true
}
```

但在实际项目中，更推荐使用 `interface` 或 `type` 提取对象类型，便于复用和维护。

```typescript
interface UserInfo {
  id: number
  username: string
  nickname?: string
  enabled: boolean
}

const user: UserInfo = {
  id: 1,
  username: 'admin',
  enabled: true
}
```

`nickname?: string` 表示可选属性。可选属性在读取时需要考虑 `undefined`。

```typescript
function getDisplayName(user: UserInfo): string {
  return user.nickname || user.username
}
```

如果对象中某些字段不允许被修改，可以使用 `readonly`。

```typescript
interface MenuItem {
  readonly id: number
  title: string
  path: string
}

const menu: MenuItem = {
  id: 1,
  title: '首页',
  path: '/home'
}

// menu.id = 2 // 类型错误：id 是只读属性
```

如果对象存在动态字段，可以使用索引签名。

```typescript
interface QueryParams {
  [key: string]: string | number | boolean | undefined
}

const params: QueryParams = {
  keyword: 'admin',
  pageNum: 1,
  pageSize: 10,
  enabled: true
}
```

索引签名适合描述动态参数，但不适合替代明确的业务类型。对于稳定的业务对象，应优先定义具体字段。

### 联合类型与字面量类型

联合类型表示一个值可以是多种类型之一。它适合描述状态、可空字段、接口差异结果等场景。

```typescript
let id: number | string = 1

id = 100
id = '100'
```

前端项目中更常见的是联合类型与字面量类型组合使用，用来限制状态值范围。

```typescript
type UserStatus = 'enabled' | 'disabled' | 'locked'

const status: UserStatus = 'enabled'

// const errorStatus: UserStatus = 'deleted' // 类型错误
```

字面量类型可以让状态值更可控，避免魔法字符串散落在项目中。

```typescript
type ThemeMode = 'light' | 'dark'

function switchTheme(mode: ThemeMode): void {
  document.documentElement.dataset.theme = mode
}

switchTheme('light')
switchTheme('dark')
```

接口返回结果也适合使用字面量类型描述业务状态。

```typescript
type ApiCode = 200 | 400 | 401 | 403 | 500

interface ApiResult<T> {
  code: ApiCode
  message: string
  data: T
}
```

如果需要根据不同类型处理不同逻辑，可以使用联合类型配合类型收窄。

```typescript
type ResponseResult =
  | {
      success: true
      data: string[]
    }
  | {
      success: false
      message: string
    }

function handleResult(result: ResponseResult): string[] {
  if (result.success) {
    return result.data
  }

  console.warn('请求失败：', result.message)
  return []
}
```

这种写法可以让 TypeScript 根据 `success` 字段自动判断当前分支中可访问的字段。

### 类型推断与类型注解

类型推断是 TypeScript 根据变量初始值、函数返回值、上下文自动判断类型的能力。类型注解是开发者显式指定类型。两者应该结合使用，而不是所有地方都强行写类型。

简单变量通常可以依赖类型推断。

```typescript
const username = 'admin'
const pageSize = 10
const enabled = true
```

上面的代码中，TypeScript 会自动推断：

```typescript
const username: string = 'admin'
const pageSize: number = 10
const enabled: boolean = true
```

函数参数通常应该显式标注类型，因为参数无法总是从上下文中可靠推断。

```typescript
function getUserLabel(username: string, enabled: boolean): string {
  return enabled ? `${username}（启用）` : `${username}（禁用）`
}
```

对象数据如果来自业务模型，建议使用类型注解。

```typescript
interface UserForm {
  username: string
  nickname: string
  enabled: boolean
}

const form: UserForm = {
  username: '',
  nickname: '',
  enabled: true
}
```

数组为空时，必须显式标注类型，否则 TypeScript 可能无法正确推断后续元素类型。

```typescript
const userList: UserInfo[] = []

userList.push({
  id: 1,
  username: 'admin',
  enabled: true
})
```

类型注解的使用建议如下。

| 场景       | 建议                 |
| ---------- | -------------------- |
| 简单常量   | 优先使用类型推断     |
| 函数参数   | 建议显式标注         |
| 函数返回值 | 公共函数建议显式标注 |
| 空数组     | 必须显式标注         |
| 接口数据   | 建议使用业务类型     |
| 组件 Props | 必须明确类型         |
| 工具函数   | 建议明确参数和返回值 |

不要为了形式统一给所有变量都写类型。TypeScript 的最佳实践是让推断处理简单场景，让类型注解约束关键边界。

## 函数类型设计

函数类型设计用于约束函数的参数、返回值、可选参数、默认值和回调函数。前端项目中，函数类型常用于工具函数、事件处理、接口请求、组件回调和状态更新方法。

### 函数参数类型

函数参数类型用于限制调用方必须传入符合要求的参数。参数类型越清晰，函数越容易复用，也越容易被编辑器提示。

```typescript
function formatAmount(amount: number): string {
  return `¥${amount.toFixed(2)}`
}

formatAmount(99.9)
// formatAmount('99.9') // 类型错误
```

多个参数时，应根据业务含义定义清楚类型。

```typescript
function buildUserQuery(keyword: string, pageNum: number, pageSize: number): string {
  const params = new URLSearchParams()

  params.set('keyword', keyword)
  params.set('pageNum', String(pageNum))
  params.set('pageSize', String(pageSize))

  return params.toString()
}
```

当参数较多时，不建议继续堆叠多个独立参数，而是使用对象参数。

```typescript
interface UserPageQuery {
  keyword?: string
  pageNum: number
  pageSize: number
  enabled?: boolean
}

function buildUserPageQuery(query: UserPageQuery): string {
  const params = new URLSearchParams()

  params.set('pageNum', String(query.pageNum))
  params.set('pageSize', String(query.pageSize))

  if (query.keyword) {
    params.set('keyword', query.keyword)
  }

  if (typeof query.enabled === 'boolean') {
    params.set('enabled', String(query.enabled))
  }

  return params.toString()
}
```

对象参数更适合前端查询、表单提交、接口请求等场景，因为它能清楚表达字段含义，也方便后续扩展。

### 函数返回值类型

函数返回值类型用于约束函数输出结果。对于简单内部函数，可以依赖类型推断；对于公共函数、工具函数、接口封装函数，建议显式声明返回值类型。

```typescript
function isEnabled(status: string): boolean {
  return status === 'enabled'
}
```

返回对象时，建议定义明确的返回类型。

```typescript
interface OptionItem {
  label: string
  value: string | number
}

function createStatusOptions(): OptionItem[] {
  return [
    {
      label: '启用',
      value: 'enabled'
    },
    {
      label: '禁用',
      value: 'disabled'
    }
  ]
}
```

异步函数的返回值应使用 `Promise<T>`。

```typescript
interface UserDetail {
  id: number
  username: string
  enabled: boolean
}

async function getUserDetail(id: number): Promise<UserDetail> {
  const response = await fetch(`/api/users/${id}`)
  return response.json()
}
```

如果函数可能没有结果，应在返回值中体现出来，而不是隐藏风险。

```typescript
function findUserById(list: UserDetail[], id: number): UserDetail | undefined {
  return list.find((item) => item.id === id)
}
```

调用方需要处理 `undefined`。

```typescript
const user = findUserById([], 1)

if (!user) {
  console.warn('未找到用户')
} else {
  console.log(user.username)
}
```

没有返回值的函数使用 `void`。

```typescript
function showMessage(message: string): void {
  console.log(message)
}
```

永远不会正常返回的函数可以使用 `never`，例如抛出异常。

```typescript
function throwBusinessError(message: string): never {
  throw new Error(message)
}
```

### 可选参数与默认参数

可选参数使用 `?` 表示，调用时可以不传。可选参数的本质是参数值可能为 `undefined`。

```typescript
function getUserDisplayName(username: string, nickname?: string): string {
  return nickname || username
}

getUserDisplayName('admin')
getUserDisplayName('admin', '管理员')
```

可选参数通常应该放在必填参数后面。

```typescript
function queryUser(keyword: string, enabled?: boolean): void {
  console.log(keyword, enabled)
}
```

默认参数用于给参数设置默认值。设置默认值后，调用方不传参数时会使用默认值。

```typescript
function createPageQuery(pageNum = 1, pageSize = 10): string {
  return `pageNum=${pageNum}&pageSize=${pageSize}`
}

createPageQuery()
createPageQuery(2)
createPageQuery(2, 20)
```

对象参数中也可以结合默认值使用。

```typescript
interface PageQuery {
  pageNum?: number
  pageSize?: number
  keyword?: string
}

function normalizePageQuery(query: PageQuery): Required<Pick<PageQuery, 'pageNum' | 'pageSize'>> & Pick<PageQuery, 'keyword'> {
  return {
    pageNum: query.pageNum ?? 1,
    pageSize: query.pageSize ?? 10,
    keyword: query.keyword
  }
}
```

对于表单、分页、查询条件等场景，默认值可以减少调用方重复传参。

```typescript
interface UserSearchParams {
  keyword?: string
  pageNum?: number
  pageSize?: number
  enabled?: boolean
}

function createUserSearchParams(params: UserSearchParams = {}): UserSearchParams {
  return {
    pageNum: 1,
    pageSize: 10,
    ...params
  }
}
```

可选参数和默认参数的区别如下。

| 类型         | 写法                  | 含义                            |
| ------------ | --------------------- | ------------------------------- |
| 可选参数     | `name?: string`       | 可以不传，值可能是 `undefined`  |
| 默认参数     | `pageNum = 1`         | 可以不传，不传时使用默认值      |
| 可选对象字段 | `keyword?: string`    | 对象中该字段可以不存在          |
| 空值联合类型 | `name: string | null` | 字段必须存在，但值可以是 `null` |

### 回调函数类型

回调函数类型用于约束传入函数的参数和返回值。前端项目中，事件处理、数组方法、异步请求、组件回调、弹窗确认、上传进度等都经常使用回调函数。

可以直接在参数位置声明回调函数类型。

```typescript
function handleEachUser(
  users: string[],
  callback: (username: string, index: number) => void
): void {
  users.forEach((username, index) => {
    callback(username, index)
  })
}
```

调用示例。

```typescript
handleEachUser(['admin', 'test'], (username, index) => {
  console.log(index, username)
})
```

如果回调函数会被多个地方复用，建议提取为类型别名。

```typescript
type UserSelectCallback = (id: number, username: string) => void

function onUserSelect(callback: UserSelectCallback): void {
  callback(1, 'admin')
}
```

对于接口请求完成后的回调，可以定义成功和失败函数。

```typescript
interface UserInfo {
  id: number
  username: string
  enabled: boolean
}

type SuccessCallback<T> = (data: T) => void
type ErrorCallback = (message: string) => void

function loadUser(
  id: number,
  onSuccess: SuccessCallback<UserInfo>,
  onError: ErrorCallback
): void {
  fetch(`/api/users/${id}`)
    .then((response) => response.json())
    .then((data: UserInfo) => {
      onSuccess(data)
    })
    .catch((error: unknown) => {
      const message = error instanceof Error ? error.message : '未知错误'
      onError(message)
    })
}
```

回调函数也可以用于组件事件。例如，表格选择用户时，可以通过回调函数把选中数据传递出去。

```typescript
interface UserRow {
  id: number
  username: string
}

type RowClickHandler = (row: UserRow, index: number) => void

function triggerRowClick(row: UserRow, index: number, handler: RowClickHandler): void {
  handler(row, index)
}
```

如果回调函数返回布尔值，可以用于控制后续流程。

```typescript
type BeforeSubmitHandler<T> = (form: T) => boolean

interface LoginForm {
  username: string
  password: string
}

function submitForm(form: LoginForm, beforeSubmit: BeforeSubmitHandler<LoginForm>): void {
  const canSubmit = beforeSubmit(form)

  if (!canSubmit) {
    console.warn('表单校验未通过')
    return
  }

  console.log('提交表单：', form)
}
```

回调函数类型设计的重点是明确三个内容：调用时机、参数结构和返回值含义。对于公共组件或公共工具函数，回调类型越清晰，调用方越不容易误用。



## 接口与类型别名

接口和类型别名都是 TypeScript 中用于描述类型结构的重要方式。前端项目中，接口常用于描述对象结构、组件 Props、接口响应数据和业务模型；类型别名更适合描述联合类型、字面量类型、工具类型组合和复杂类型表达式。

### interface 的使用

`interface` 主要用于描述对象的结构。它强调的是“一个对象应该具备哪些字段和方法”，因此非常适合定义接口响应、表单模型、组件 Props 和状态对象。

下面的代码定义了一个用户信息接口，用于约束对象字段。

```typescript
interface UserInfo {
  id: number
  username: string
  nickname?: string
  enabled: boolean
}

const user: UserInfo = {
  id: 1,
  username: 'admin',
  enabled: true
}
```

`nickname?: string` 表示可选属性。调用时可以不传，但读取时需要考虑它可能是 `undefined`。

```typescript
function getDisplayName(user: UserInfo): string {
  return user.nickname || user.username
}
```

`interface` 也可以描述函数结构，但在前端项目中，函数类型通常更常用 `type` 表达。

```typescript
interface FormatHandler {
  (value: string): string
}

const trimText: FormatHandler = (value) => {
  return value.trim()
}
```

`interface` 还可以定义对象中的方法。

```typescript
interface UserService {
  queryUserList(): Promise<UserInfo[]>
  getUserDetail(id: number): Promise<UserInfo>
}

const userService: UserService = {
  async queryUserList() {
    return []
  },

  async getUserDetail(id: number) {
    return {
      id,
      username: 'admin',
      enabled: true
    }
  }
}
```

在前端项目中，`interface` 的典型使用场景如下。

```typescript
interface LoginForm {
  username: string
  password: string
  rememberMe: boolean
}

interface MenuItem {
  id: number
  title: string
  path: string
  children?: MenuItem[]
}

interface UserCardProps {
  id: number
  username: string
  avatar?: string
  enabled: boolean
}
```

`interface` 的优势是结构清晰、可扩展性好，并且同名接口会自动合并。对于稳定的对象模型，优先使用 `interface` 通常更直观。

### type 的使用

`type` 用于给任意类型起别名。它不仅可以描述对象，还可以描述联合类型、字面量类型、函数类型、元组类型和复杂组合类型。相比 `interface`，`type` 的表达能力更灵活。

定义对象类型时，`type` 和 `interface` 类似。

```typescript
type UserInfo = {
  id: number
  username: string
  enabled: boolean
}

const user: UserInfo = {
  id: 1,
  username: 'admin',
  enabled: true
}
```

`type` 更常用于联合类型。

```typescript
type UserStatus = 'enabled' | 'disabled' | 'locked'

const status: UserStatus = 'enabled'
```

也可以用于定义接口状态码。

```typescript
type ApiCode = 200 | 400 | 401 | 403 | 500

interface ApiResult<T> {
  code: ApiCode
  message: string
  data: T
}
```

函数类型也适合使用 `type` 定义。

```typescript
type SubmitHandler<T> = (form: T) => Promise<void>

interface LoginForm {
  username: string
  password: string
}

const submitLogin: SubmitHandler<LoginForm> = async (form) => {
  console.log('提交登录表单：', form)
}
```

`type` 可以组合已有类型，适合构造新的业务类型。

```typescript
interface UserInfo {
  id: number
  username: string
  nickname: string
  enabled: boolean
}

type UserCreateForm = Omit<UserInfo, 'id'>

const form: UserCreateForm = {
  username: '',
  nickname: '',
  enabled: true
}
```

`type` 也可以描述元组。

```typescript
type Coordinate = [number, number]

const position: Coordinate = [120.15, 30.28]
```

对于状态值、事件名称、权限标识、接口状态码、函数签名等场景，`type` 往往比 `interface` 更合适。

### 接口扩展

接口扩展用于在已有类型基础上增加字段。前端项目中常见于基础模型扩展、分页结果扩展、组件 Props 扩展和业务详情类型扩展。

`interface` 可以通过 `extends` 扩展其他接口。

```typescript
interface BaseEntity {
  id: number
  createTime: string
  updateTime: string
}

interface UserInfo extends BaseEntity {
  username: string
  nickname: string
  enabled: boolean
}

const user: UserInfo = {
  id: 1,
  createTime: '2026-05-21 10:00:00',
  updateTime: '2026-05-21 10:30:00',
  username: 'admin',
  nickname: '管理员',
  enabled: true
}
```

一个接口可以同时扩展多个接口。

```typescript
interface PageQuery {
  pageNum: number
  pageSize: number
}

interface KeywordQuery {
  keyword?: string
}

interface UserPageQuery extends PageQuery, KeywordQuery {
  enabled?: boolean
}

const query: UserPageQuery = {
  pageNum: 1,
  pageSize: 10,
  keyword: 'admin',
  enabled: true
}
```

`type` 可以通过交叉类型实现类似扩展效果。

```typescript
type BaseEntity = {
  id: number
  createTime: string
  updateTime: string
}

type UserInfo = BaseEntity & {
  username: string
  nickname: string
  enabled: boolean
}
```

在组件 Props 中，也可以基于基础 Props 扩展业务 Props。

```typescript
interface BaseComponentProps {
  loading?: boolean
  disabled?: boolean
}

interface UserSelectProps extends BaseComponentProps {
  modelValue?: number
  placeholder?: string
  multiple?: boolean
}
```

接口扩展适合用于“新增字段”的场景。如果是“从已有类型中删除字段、挑选字段、修改字段”，通常更适合配合工具类型使用。

```typescript
interface UserInfo {
  id: number
  username: string
  nickname: string
  enabled: boolean
  createTime: string
}

type UserCreateForm = Omit<UserInfo, 'id' | 'createTime'>
type UserTableRow = Pick<UserInfo, 'id' | 'username' | 'enabled'>
```

扩展类型时需要避免过度继承。如果一个类型和另一个类型只是字段碰巧相似，而业务含义并不一致，不建议强行继承，否则后续修改会产生错误依赖。

### interface 与 type 的选择

`interface` 和 `type` 都能描述对象结构，但它们的侧重点不同。选择时不需要绝对化，关键是让团队在同一项目中保持一致。

一般建议如下。

| 场景         | 推荐方式    | 说明                                  |
| ------------ | ----------- | ------------------------------------- |
| 业务对象模型 | `interface` | 结构清晰，便于扩展                    |
| 接口响应对象 | `interface` | 适合描述稳定对象结构                  |
| 组件 Props   | `interface` | 可读性较好，便于扩展                  |
| 表单对象     | `interface` | 字段结构明确                          |
| 联合类型     | `type`      | `interface` 无法直接表达              |
| 字面量类型   | `type`      | 适合状态、枚举值、事件名              |
| 函数类型     | `type`      | 写法更简洁                            |
| 元组类型     | `type`      | 表达更直接                            |
| 工具类型组合 | `type`      | 适合 `Pick`、`Omit`、`Partial` 等组合 |

推荐规则可以简化为：对象结构优先使用 `interface`，类型组合优先使用 `type`。

```typescript
interface UserInfo {
  id: number
  username: string
  enabled: boolean
}

type UserStatus = 'enabled' | 'disabled'

type UserStatusFormatter = (status: UserStatus) => string
```

在大型前端项目中，可以统一约定：

```typescript
// 业务实体、接口响应、表单模型使用 interface
interface UserInfo {
  id: number
  username: string
}

// 状态值、函数类型、工具类型组合使用 type
type UserStatus = 'enabled' | 'disabled'
type UserForm = Omit<UserInfo, 'id'>
```

不要在同一个项目中随意混用。例如同类业务模型有的用 `interface`，有的用 `type`，会降低代码一致性。团队规范比单个语法选择更重要。

## 泛型应用

泛型用于在定义函数、接口、类型或组件时保留类型变量，让调用方在使用时再确定具体类型。它可以提高类型复用能力，避免为了不同数据类型重复编写相似代码。

### 泛型函数

泛型函数适合用于输入类型和输出类型存在关联的场景。例如传入什么类型，就返回什么类型。

```typescript
function getFirst<T>(list: T[]): T | undefined {
  return list.length > 0 ? list[0] : undefined
}

const firstName = getFirst<string>(['admin', 'test'])
const firstId = getFirst<number>([1, 2, 3])
```

多数情况下，TypeScript 可以自动推断泛型类型，不需要手动写 `<string>` 或 `<number>`。

```typescript
const firstName = getFirst(['admin', 'test'])
const firstId = getFirst([1, 2, 3])
```

泛型常用于公共工具函数，例如数组转换、数据查找、结果包装等。

```typescript
function wrapArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value]
}

const ids = wrapArray(1)
const names = wrapArray(['admin', 'test'])
```

泛型也可以用于接口请求方法，约束接口返回数据类型。

```typescript
interface ApiResult<T> {
  code: number
  message: string
  data: T
}

async function request<T>(url: string): Promise<ApiResult<T>> {
  const response = await fetch(url)
  return response.json()
}

interface UserInfo {
  id: number
  username: string
  enabled: boolean
}

async function getUserInfo(): Promise<UserInfo> {
  const result = await request<UserInfo>('/api/user/info')
  return result.data
}
```

这里的 `request<T>` 并不关心具体业务数据是什么，只负责保留响应数据的类型位置。调用方通过 `request<UserInfo>` 指定 `data` 的具体结构。

### 泛型接口

泛型接口适合描述结构固定但内部数据类型可变化的对象。前端项目中最常见的泛型接口是接口响应、分页数据、下拉选项和树形结构。

接口响应通常可以定义为泛型接口。

```typescript
interface ApiResult<T> {
  code: number
  message: string
  data: T
}
```

使用时传入具体业务类型。

```typescript
interface UserInfo {
  id: number
  username: string
  enabled: boolean
}

type UserInfoResult = ApiResult<UserInfo>
type UserListResult = ApiResult<UserInfo[]>
```

分页结果也很适合使用泛型。

```typescript
interface PageResult<T> {
  list: T[]
  total: number
  pageNum: number
  pageSize: number
}

interface UserItem {
  id: number
  username: string
  enabled: boolean
}

const pageResult: PageResult<UserItem> = {
  list: [
    {
      id: 1,
      username: 'admin',
      enabled: true
    }
  ],
  total: 1,
  pageNum: 1,
  pageSize: 10
}
```

下拉选项可以通过泛型约束 `value` 类型。

```typescript
interface OptionItem<T = string | number> {
  label: string
  value: T
  disabled?: boolean
}

const statusOptions: OptionItem<string>[] = [
  {
    label: '启用',
    value: 'enabled'
  },
  {
    label: '禁用',
    value: 'disabled'
  }
]

const roleOptions: OptionItem<number>[] = [
  {
    label: '管理员',
    value: 1
  },
  {
    label: '普通用户',
    value: 2
  }
]
```

树形结构也适合通过泛型复用。

```typescript
interface TreeNode<T> {
  id: number
  label: string
  data: T
  children?: TreeNode<T>[]
}

interface MenuData {
  path: string
  permission: string
}

const menuTree: TreeNode<MenuData>[] = [
  {
    id: 1,
    label: '系统管理',
    data: {
      path: '/system',
      permission: 'system:view'
    },
    children: []
  }
]
```

泛型接口的价值在于把稳定结构和变化数据分离。结构只定义一次，业务类型按场景传入。

### 泛型约束

泛型默认可以代表任意类型。如果函数内部需要访问某些字段或方法，就需要使用泛型约束。泛型约束通过 `extends` 实现。

下面的函数需要访问 `id` 字段，因此要求传入的数据必须包含 `id`。

```typescript
interface HasId {
  id: number
}

function findById<T extends HasId>(list: T[], id: number): T | undefined {
  return list.find((item) => item.id === id)
}

interface UserInfo {
  id: number
  username: string
}

const user = findById<UserInfo>(
  [
    {
      id: 1,
      username: 'admin'
    }
  ],
  1
)
```

如果没有 `extends HasId`，TypeScript 不知道 `T` 中一定存在 `id` 字段，因此会报错。

泛型约束也可以用于对象字段读取。

```typescript
function getValue<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}

const userInfo = {
  id: 1,
  username: 'admin',
  enabled: true
}

const username = getValue(userInfo, 'username')
// const errorValue = getValue(userInfo, 'nickname') // 类型错误
```

`keyof T` 表示获取对象类型 `T` 的所有键名，`K extends keyof T` 表示 `K` 必须是 `T` 的键之一。这个写法常用于表格字段、表单字段、对象工具函数等场景。

也可以限制泛型必须是指定联合类型中的一个。

```typescript
type Status = 'enabled' | 'disabled'

function formatStatus<T extends Status>(status: T): string {
  return status === 'enabled' ? '启用' : '禁用'
}

formatStatus('enabled')
// formatStatus('locked') // 类型错误
```

泛型约束的原则是：只有函数内部确实依赖某些字段或能力时，才添加约束。不要为了复杂而复杂。

### 前端组件中的泛型场景

前端组件中使用泛型，通常是为了让组件可以复用不同业务数据，同时保持类型安全。常见场景包括表格组件、选择器组件、列表组件、弹窗表单组件和 API 请求封装。

例如，一个通用表格列配置可以用泛型描述行数据。

```typescript
interface TableColumn<T> {
  title: string
  key: keyof T
  width?: number
  render?: (row: T) => string
}

interface UserRow {
  id: number
  username: string
  enabled: boolean
}

const columns: TableColumn<UserRow>[] = [
  {
    title: '用户名称',
    key: 'username'
  },
  {
    title: '状态',
    key: 'enabled',
    render: (row) => (row.enabled ? '启用' : '禁用')
  }
]
```

这里的 `key: keyof T` 可以限制列字段必须来自行数据，避免写错字段名。

选择器组件也适合使用泛型。不同业务的选项值可能是 `number`、`string` 或其他字面量类型。

```typescript
interface SelectOption<T = string | number> {
  label: string
  value: T
  disabled?: boolean
}

type StatusValue = 'enabled' | 'disabled'

const statusOptions: SelectOption<StatusValue>[] = [
  {
    label: '启用',
    value: 'enabled'
  },
  {
    label: '禁用',
    value: 'disabled'
  }
]
```

对于弹窗表单，可以使用泛型描述表单数据和提交函数。

```typescript
interface FormDialogProps<T> {
  visible: boolean
  title: string
  formData: T
  onSubmit: (data: T) => Promise<void>
  onCancel: () => void
}

interface UserForm {
  username: string
  nickname: string
  enabled: boolean
}

const userDialogProps: FormDialogProps<UserForm> = {
  visible: true,
  title: '新增用户',
  formData: {
    username: '',
    nickname: '',
    enabled: true
  },
  async onSubmit(data) {
    console.log('提交用户表单：', data)
  },
  onCancel() {
    console.log('取消提交')
  }
}
```

在 Vue 或 React 中，泛型更多会出现在类型文件、组件 Props 类型、表格列配置、请求封装和工具函数中，而不是所有组件都强行泛型化。只有组件确实需要承载多种业务数据结构时，才适合使用泛型。

## 前端项目类型组织

类型组织决定了 TypeScript 在项目中的可维护性。类型定义如果随意散落在页面和组件中，短期写起来方便，长期会导致重复定义、命名冲突、接口结构不一致和重构困难。前端项目应根据类型的使用范围进行分层组织。

### 类型文件目录规划

类型文件目录规划的目标是让类型定义有明确归属。页面私有类型可以放在页面附近，跨模块复用类型应放到统一目录，接口响应类型应靠近 API 模块或统一放到业务模型目录。

常见目录结构如下。

```text
src
├── api
│   ├── user.ts
│   └── role.ts
├── types
│   ├── api.ts
│   ├── common.ts
│   ├── user.ts
│   ├── role.ts
│   └── menu.ts
├── views
│   └── user
│       ├── UserList.vue
│       └── types.ts
└── components
    └── UserSelect
        ├── index.vue
        └── types.ts
```

不同文件的职责可以这样划分。

| 文件                         | 作用                             |
| ---------------------------- | -------------------------------- |
| `src/types/api.ts`           | 全局接口响应、分页结构、错误结构 |
| `src/types/common.ts`        | 通用选项、字典、树节点、状态类型 |
| `src/types/user.ts`          | 用户模块业务类型                 |
| `src/types/role.ts`          | 角色模块业务类型                 |
| `src/views/user/types.ts`    | 用户页面内部专用类型             |
| `src/components/**/types.ts` | 组件内部 Props、Emits、配置类型  |

全局通用类型可以放在 `src/types` 下，业务模块私有类型可以靠近业务代码。不要把所有类型都放进一个巨大的 `types.ts` 文件，否则后期会难以维护。

例如，通用类型文件可以这样设计。

文件位置：`src/types/common.ts`

```typescript
export interface OptionItem<T = string | number> {
  label: string
  value: T
  disabled?: boolean
}

export interface TreeNode<T = unknown> {
  id: number | string
  label: string
  data?: T
  children?: TreeNode<T>[]
}

export type StatusValue = 'enabled' | 'disabled'
```

接口响应类型可以单独放在 `api.ts`。

文件位置：`src/types/api.ts`

```typescript
export interface ApiResult<T> {
  code: number
  message: string
  data: T
}

export interface PageQuery {
  pageNum: number
  pageSize: number
}

export interface PageResult<T> {
  list: T[]
  total: number
  pageNum: number
  pageSize: number
}

export interface ApiError {
  code: number
  message: string
  detail?: string
}
```

业务类型按模块拆分。

文件位置：`src/types/user.ts`

```typescript
export interface UserInfo {
  id: number
  username: string
  nickname: string
  mobile?: string
  enabled: boolean
  roleIds: number[]
  createTime: string
}

export interface UserPageQuery {
  keyword?: string
  enabled?: boolean
  pageNum: number
  pageSize: number
}

export type UserCreateForm = Omit<UserInfo, 'id' | 'createTime'>

export type UserUpdateForm = Pick<UserInfo, 'id' | 'nickname' | 'mobile' | 'enabled' | 'roleIds'>
```

类型文件命名建议保持稳定，不要频繁变化。常见命名方式包括 `types.ts`、`user.ts`、`api.ts`、`model.ts`。团队内统一一种风格即可。

### 接口响应类型定义

接口响应类型是前端 TypeScript 项目中最重要的类型之一。它连接后端接口和前端页面，直接影响请求封装、数据渲染、错误处理和联调效率。

通常可以先定义统一响应结构。

```typescript
export interface ApiResult<T> {
  code: number
  message: string
  data: T
}
```

如果后端接口使用分页结构，可以继续定义分页响应。

```typescript
export interface PageResult<T> {
  list: T[]
  total: number
  pageNum: number
  pageSize: number
}
```

请求参数也应明确类型。

```typescript
export interface UserPageQuery {
  keyword?: string
  enabled?: boolean
  pageNum: number
  pageSize: number
}
```

业务列表项单独定义。

```typescript
export interface UserListItem {
  id: number
  username: string
  nickname: string
  enabled: boolean
  createTime: string
}
```

接口封装时可以组合这些类型。

文件位置：`src/api/user.ts`

```typescript
import type { ApiResult, PageResult } from '@/types/api'
import type { UserListItem, UserPageQuery } from '@/types/user'

export async function queryUserPage(
  params: UserPageQuery
): Promise<ApiResult<PageResult<UserListItem>>> {
  const response = await fetch('/api/users/page', {
    method: 'POST',
    body: JSON.stringify(params)
  })

  return response.json()
}
```

调用接口时，页面可以直接获得明确类型。

```typescript
import { queryUserPage } from '@/api/user'

async function loadUserList(): Promise<void> {
  const result = await queryUserPage({
    pageNum: 1,
    pageSize: 10,
    keyword: 'admin'
  })

  console.log(result.data.list)
}
```

对于可能为空的数据，需要在类型中体现。

```typescript
export interface UserDetail {
  id: number
  username: string
  nickname: string
  mobile?: string
  enabled: boolean
}

export type UserDetailResult = ApiResult<UserDetail | null>
```

如果后端接口有错误响应结构，也可以定义统一错误类型。

```typescript
export interface ApiErrorResponse {
  code: number
  message: string
  errors?: Record<string, string[]>
}
```

接口响应类型定义建议遵循以下原则：后端真实返回什么，前端类型就描述什么；不要为了页面使用方便而修改接口响应类型。如果页面需要转换结构，应额外定义页面视图类型。

### 业务模型类型定义

业务模型类型用于描述系统中的核心实体，例如用户、角色、菜单、订单、商品、部门等。它们通常不是某一个页面独有，而是会被接口、状态管理、组件和页面共同使用。

例如用户模型可以这样定义。

文件位置：`src/types/user.ts`

```typescript
export interface UserInfo {
  id: number
  username: string
  nickname: string
  avatar?: string
  mobile?: string
  email?: string
  enabled: boolean
  roleIds: number[]
  createTime: string
  updateTime: string
}
```

用户新增表单不需要 `id`、`createTime`、`updateTime`，可以基于业务模型派生。

```typescript
export type UserCreateForm = Omit<UserInfo, 'id' | 'createTime' | 'updateTime'>
```

用户编辑表单可能只允许编辑部分字段。

```typescript
export type UserUpdateForm = Pick<
  UserInfo,
  'id' | 'nickname' | 'avatar' | 'mobile' | 'email' | 'enabled' | 'roleIds'
>
```

用户列表可能不需要完整用户详情，可以单独定义列表项。

```typescript
export interface UserListItem {
  id: number
  username: string
  nickname: string
  enabled: boolean
  createTime: string
}
```

不要把所有用户相关场景都强行复用同一个 `UserInfo`。列表、详情、新增、编辑、查询通常有不同的数据结构，应按实际场景定义。

菜单模型示例。

文件位置：`src/types/menu.ts`

```typescript
export interface MenuItem {
  id: number
  parentId?: number
  title: string
  path: string
  icon?: string
  permission?: string
  visible: boolean
  children?: MenuItem[]
}
```

角色模型示例。

文件位置：`src/types/role.ts`

```typescript
export interface RoleInfo {
  id: number
  roleName: string
  roleCode: string
  enabled: boolean
  permissions: string[]
}

export interface RolePageQuery {
  keyword?: string
  enabled?: boolean
  pageNum: number
  pageSize: number
}
```

业务模型类型定义时要注意区分三类类型：

| 类型     | 说明                 | 示例                              |
| -------- | -------------------- | --------------------------------- |
| 实体类型 | 描述业务对象完整结构 | `UserInfo`、`RoleInfo`            |
| 请求类型 | 描述接口入参结构     | `UserPageQuery`、`UserCreateForm` |
| 视图类型 | 描述页面展示结构     | `UserListItem`、`MenuTreeNode`    |

实体类型不应承担所有职责。请求类型和视图类型可以基于实体类型派生，也可以单独定义。

### 公共类型复用

公共类型复用可以减少重复定义，提高项目类型一致性。适合复用的类型通常具有跨模块、跨页面、跨组件使用的特征，例如分页结构、接口响应、下拉选项、树节点、状态值、排序参数等。

通用分页查询类型可以这样定义。

文件位置：`src/types/api.ts`

```typescript
export interface PageQuery {
  pageNum: number
  pageSize: number
}

export interface PageResult<T> {
  list: T[]
  total: number
  pageNum: number
  pageSize: number
}
```

业务查询参数可以在分页基础上扩展。

```typescript
import type { PageQuery } from '@/types/api'

export interface UserPageQuery extends PageQuery {
  keyword?: string
  enabled?: boolean
}
```

通用下拉选项类型可以这样定义。

文件位置：`src/types/common.ts`

```typescript
export interface OptionItem<T = string | number> {
  label: string
  value: T
  disabled?: boolean
}
```

不同业务可以传入不同 `value` 类型。

```typescript
import type { OptionItem } from '@/types/common'

type UserStatus = 'enabled' | 'disabled'

const statusOptions: OptionItem<UserStatus>[] = [
  {
    label: '启用',
    value: 'enabled'
  },
  {
    label: '禁用',
    value: 'disabled'
  }
]

const roleOptions: OptionItem<number>[] = [
  {
    label: '管理员',
    value: 1
  },
  {
    label: '普通用户',
    value: 2
  }
]
```

排序参数也可以定义为公共类型。

```typescript
export type SortOrder = 'asc' | 'desc'

export interface SortQuery<T extends string = string> {
  field: T
  order: SortOrder
}
```

业务中使用时可以限制字段范围。

```typescript
import type { SortQuery } from '@/types/common'

type UserSortField = 'id' | 'username' | 'createTime'

const sortQuery: SortQuery<UserSortField> = {
  field: 'createTime',
  order: 'desc'
}
```

公共类型复用需要控制边界。只有真正跨模块稳定复用的类型才放到公共目录中。页面私有类型、临时转换类型、组件内部辅助类型不建议放到全局公共类型文件中。

推荐做法是：公共类型少而稳定，业务类型按模块拆分，页面私有类型就近维护。这样既能复用核心类型，又不会让全局类型目录变成杂乱的类型仓库。



## 框架中的 TypeScript 使用

TypeScript 在框架项目中的主要作用是约束组件参数、组件事件、状态数据、接口返回值和页面内部数据流。Vue 和 React 的写法不同，但核心目标一致：让组件输入、组件输出和业务状态都具备明确类型。

### Vue 项目中的 TypeScript

Vue 3 项目通常使用 Composition API 与 `<script setup lang="ts">` 结合 TypeScript。组件内部的响应式变量、Props、Emits、计算属性、接口数据都可以通过类型约束提升可维护性。

下面示例展示 Vue 3 单文件组件中如何定义响应式数据、Props 和事件。

文件位置：`src/components/UserCard.vue`

```vue
<template>
  <div class="rounded border p-4">
    <div class="text-base font-medium">{{ user.username }}</div>
    <div class="text-sm text-gray-500">{{ user.nickname || '未设置昵称' }}</div>

    <button
      class="mt-3 rounded bg-blue-500 px-3 py-1 text-white"
      :disabled="loading"
      @click="handleEdit"
    >
      编辑
    </button>
  </div>
</template>

<script setup lang="ts">
interface UserInfo {
  id: number
  username: string
  nickname?: string
  enabled: boolean
}

interface UserCardProps {
  user: UserInfo
  loading?: boolean
}

const props = withDefaults(defineProps<UserCardProps>(), {
  loading: false
})

const emit = defineEmits<{
  edit: [user: UserInfo]
}>()

function handleEdit(): void {
  emit('edit', props.user)
}
</script>
```

`defineProps<UserCardProps>()` 用于约束父组件传入的数据结构，`defineEmits` 用于约束组件向外抛出的事件名称和参数。这样父组件调用时可以获得明确的类型提示。

在 Vue 项目中，常见 TypeScript 使用位置如下。

| 位置                       | 类型内容                      |
| -------------------------- | ----------------------------- |
| `<script setup lang="ts">` | 开启组件内 TypeScript 支持    |
| `defineProps<T>()`         | 定义组件入参类型              |
| `defineEmits<T>()`         | 定义组件事件类型              |
| `ref<T>()`                 | 定义响应式基础数据类型        |
| `reactive<T>()`            | 定义响应式对象类型            |
| `computed<T>()`            | 定义计算属性返回值类型        |
| Pinia Store                | 定义状态、Getter、Action 类型 |
| API 模块                   | 定义请求参数和响应结果类型    |

响应式变量可以通过泛型声明类型。

```typescript
import { ref, reactive, computed } from 'vue'

interface UserInfo {
  id: number
  username: string
  enabled: boolean
}

const loading = ref<boolean>(false)
const userList = ref<UserInfo[]>([])

const queryForm = reactive({
  keyword: '',
  enabled: undefined as boolean | undefined,
  pageNum: 1,
  pageSize: 10
})

const enabledUserCount = computed<number>(() => {
  return userList.value.filter((item) => item.enabled).length
})
```

对于 `ref`，读取和修改值时需要通过 `.value`。对于 `reactive`，通常直接访问属性。复杂表单建议提前定义接口，避免字段不断增加后类型失控。

### React 项目中的 TypeScript

React 项目通常使用 `.tsx` 文件编写组件。TypeScript 主要用于约束组件 Props、事件对象、状态数据、Hooks 返回值和接口请求结果。

下面示例展示 React 函数组件中如何定义 Props、状态和事件。

文件位置：`src/components/UserCard.tsx`

```tsx
import { useState } from 'react'

interface UserInfo {
  id: number
  username: string
  nickname?: string
  enabled: boolean
}

interface UserCardProps {
  user: UserInfo
  loading?: boolean
  onEdit: (user: UserInfo) => void
}

export function UserCard(props: UserCardProps) {
  const { user, loading = false, onEdit } = props
  const [selected, setSelected] = useState<boolean>(false)

  function handleEdit(): void {
    setSelected(true)
    onEdit(user)
  }

  return (
    <div className="rounded border p-4">
      <div>{user.username}</div>
      <div>{user.nickname || '未设置昵称'}</div>
      <button disabled={loading} onClick={handleEdit}>
        编辑
      </button>
      {selected && <span>已选中</span>}
    </div>
  )
}
```

React 中不强制使用 `React.FC`。在多数项目中，直接给函数参数定义 Props 类型更清晰，也能避免 `children` 等隐式行为造成误解。

React Hooks 也可以配合泛型使用。

```tsx
import { useMemo, useState } from 'react'

interface UserInfo {
  id: number
  username: string
  enabled: boolean
}

const [userList, setUserList] = useState<UserInfo[]>([])
const [loading, setLoading] = useState<boolean>(false)

const enabledUsers = useMemo<UserInfo[]>(() => {
  return userList.filter((item) => item.enabled)
}, [userList])
```

React 事件对象需要根据元素类型定义。例如输入框事件使用 `React.ChangeEvent<HTMLInputElement>`。

```tsx
import type { ChangeEvent } from 'react'

function SearchInput() {
  const [keyword, setKeyword] = useState<string>('')

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    setKeyword(event.target.value)
  }

  return <input value={keyword} onChange={handleChange} />
}
```

React 项目中的 TypeScript 常见使用位置如下。

| 位置            | 类型内容               |
| --------------- | ---------------------- |
| 组件 Props      | 组件入参类型           |
| `useState<T>()` | 状态数据类型           |
| `useMemo<T>()`  | 缓存计算结果类型       |
| `useRef<T>()`   | DOM 或实例引用类型     |
| 事件处理函数    | DOM 事件对象类型       |
| 自定义 Hook     | 参数、返回值类型       |
| API 模块        | 请求参数、响应结果类型 |

### 组件 Props 类型定义

组件 Props 是组件对外暴露的输入边界，应当明确字段类型、必填字段、可选字段和回调函数。Props 类型越清晰，组件越容易复用。

Vue 组件 Props 类型定义示例。

```vue
<script setup lang="ts">
interface UserSelectOption {
  label: string
  value: number
  disabled?: boolean
}

interface UserSelectProps {
  modelValue?: number
  options: UserSelectOption[]
  placeholder?: string
  disabled?: boolean
}

withDefaults(defineProps<UserSelectProps>(), {
  modelValue: undefined,
  placeholder: '请选择用户',
  disabled: false
})
</script>
```

React 组件 Props 类型定义示例。

```tsx
interface UserSelectOption {
  label: string
  value: number
  disabled?: boolean
}

interface UserSelectProps {
  value?: number
  options: UserSelectOption[]
  placeholder?: string
  disabled?: boolean
  onChange: (value: number | undefined) => void
}

export function UserSelect(props: UserSelectProps) {
  const { value, options, placeholder = '请选择用户', disabled = false, onChange } = props

  return (
    <select
      value={value ?? ''}
      disabled={disabled}
      onChange={(event) => onChange(event.target.value ? Number(event.target.value) : undefined)}
    >
      <option value="">{placeholder}</option>
      {options.map((item) => (
        <option key={item.value} value={item.value} disabled={item.disabled}>
          {item.label}
        </option>
      ))}
    </select>
  )
}
```

Props 类型定义建议遵循以下原则。

| 场景         | 建议                     |
| ------------ | ------------------------ |
| 必传业务数据 | 使用必填属性             |
| 可配置项     | 使用可选属性并提供默认值 |
| 回调函数     | 明确参数和返回值         |
| 列表数据     | 使用数组类型             |
| 状态值       | 使用字面量联合类型       |
| 复杂对象     | 抽取为单独接口           |

对于公共组件，不建议 Props 中大量使用 `any`。如果暂时无法确定具体类型，可以使用泛型或 `unknown`，再在组件内部做类型判断。

### 组件事件类型定义

组件事件是组件向外传递数据的出口。TypeScript 可以约束事件名称、事件参数和回调函数结构，避免父子组件之间传错数据。

Vue 组件中可以使用 `defineEmits` 定义事件类型。

```vue
<script setup lang="ts">
interface UserInfo {
  id: number
  username: string
}

const emit = defineEmits<{
  select: [user: UserInfo]
  clear: []
  search: [keyword: string]
}>()

function handleSelect(user: UserInfo): void {
  emit('select', user)
}

function handleClear(): void {
  emit('clear')
}

function handleSearch(keyword: string): void {
  emit('search', keyword)
}
</script>
```

React 中通常通过 Props 回调函数表达组件事件。

```tsx
interface UserInfo {
  id: number
  username: string
}

interface UserTableProps {
  data: UserInfo[]
  onSelect: (user: UserInfo) => void
  onDelete: (id: number) => Promise<void>
}

export function UserTable(props: UserTableProps) {
  const { data, onSelect, onDelete } = props

  return (
    <div>
      {data.map((user) => (
        <div key={user.id}>
          <span onClick={() => onSelect(user)}>{user.username}</span>
          <button onClick={() => onDelete(user.id)}>删除</button>
        </div>
      ))}
    </div>
  )
}
```

组件事件类型设计时，应明确事件代表的业务含义。例如 `onChange` 适合普通值变更，`onSubmit` 适合提交，`onSelect` 适合选择数据，`onConfirm` 适合确认操作。不要使用含义模糊的事件名，例如 `onClick2`、`onDo`、`onHandler`。

### 状态管理类型定义

状态管理中的类型定义用于约束全局状态、局部模块状态、状态更新方法和异步 Action。Vue 项目常用 Pinia，React 项目可能使用 Redux Toolkit、Zustand 或 Context。

Pinia Store 类型定义示例。

文件位置：`src/stores/user.ts`

```typescript
import { defineStore } from 'pinia'

interface UserInfo {
  id: number
  username: string
  roles: string[]
}

interface UserState {
  token: string
  userInfo: UserInfo | null
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    token: '',
    userInfo: null
  }),

  getters: {
    isLogin: (state): boolean => {
      return Boolean(state.token)
    }
  },

  actions: {
    setToken(token: string): void {
      this.token = token
    },

    setUserInfo(userInfo: UserInfo | null): void {
      this.userInfo = userInfo
    },

    clearUser(): void {
      this.token = ''
      this.userInfo = null
    }
  }
})
```

React Zustand Store 类型定义示例。

文件位置：`src/stores/user.ts`

```typescript
import { create } from 'zustand'

interface UserInfo {
  id: number
  username: string
  roles: string[]
}

interface UserStore {
  token: string
  userInfo: UserInfo | null
  setToken: (token: string) => void
  setUserInfo: (userInfo: UserInfo | null) => void
  clearUser: () => void
}

export const useUserStore = create<UserStore>((set) => ({
  token: '',
  userInfo: null,

  setToken: (token) => {
    set({ token })
  },

  setUserInfo: (userInfo) => {
    set({ userInfo })
  },

  clearUser: () => {
    set({
      token: '',
      userInfo: null
    })
  }
}))
```

状态管理类型定义建议将状态对象和操作方法分开思考。状态对象描述“存什么”，操作方法描述“怎么改”。全局状态应避免直接使用松散对象，否则后续模块增加后会难以维护。

## API 请求类型设计

API 请求类型设计用于约束前后端交互边界。前端应明确请求参数、响应结果、分页结构和错误结构，避免接口字段使用混乱。TypeScript 类型不能替代接口联调，但可以显著降低字段误用和数据结构误判的概率。

### 请求参数类型

请求参数类型用于描述接口入参。常见请求参数包括查询条件、分页参数、详情 ID、新增表单、编辑表单和删除参数。

用户分页查询参数示例。

```typescript
export interface UserPageQuery {
  keyword?: string
  enabled?: boolean
  pageNum: number
  pageSize: number
}
```

新增用户参数示例。

```typescript
export interface UserCreateRequest {
  username: string
  nickname: string
  password: string
  roleIds: number[]
  enabled: boolean
}
```

编辑用户参数示例。

```typescript
export interface UserUpdateRequest {
  id: number
  nickname: string
  roleIds: number[]
  enabled: boolean
}
```

API 方法中使用请求参数类型。

文件位置：`src/api/user.ts`

```typescript
import type { UserCreateRequest, UserPageQuery, UserUpdateRequest } from '@/types/user'

export async function queryUserPage(params: UserPageQuery): Promise<Response> {
  return fetch('/api/users/page', {
    method: 'POST',
    body: JSON.stringify(params)
  })
}

export async function createUser(data: UserCreateRequest): Promise<Response> {
  return fetch('/api/users', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

export async function updateUser(data: UserUpdateRequest): Promise<Response> {
  return fetch(`/api/users/${data.id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  })
}
```

请求参数类型应尽量和后端接口文档保持一致。页面表单类型可以和请求参数类型不同，如果页面字段需要转换，应在提交前显式转换。

### 响应结果类型

响应结果类型用于描述后端返回的数据结构。多数项目会有统一响应包装，例如 `code`、`message`、`data`。

通用响应类型定义如下。

文件位置：`src/types/api.ts`

```typescript
export interface ApiResult<T> {
  code: number
  message: string
  data: T
}
```

业务响应类型可以通过泛型组合。

```typescript
export interface UserInfo {
  id: number
  username: string
  nickname: string
  enabled: boolean
}

export type UserInfoResult = ApiResult<UserInfo>
export type UserListResult = ApiResult<UserInfo[]>
```

API 请求函数中使用响应类型。

```typescript
import type { ApiResult } from '@/types/api'
import type { UserInfo } from '@/types/user'

export async function getUserDetail(id: number): Promise<ApiResult<UserInfo>> {
  const response = await fetch(`/api/users/${id}`)
  return response.json()
}
```

如果项目使用 Axios，可以封装统一请求方法。

文件位置：`src/utils/request.ts`

```typescript
import axios from 'axios'

export interface ApiResult<T> {
  code: number
  message: string
  data: T
}

const request = axios.create({
  baseURL: '/api',
  timeout: 10000
})

export async function httpGet<T>(url: string, params?: Record<string, unknown>): Promise<ApiResult<T>> {
  const response = await request.get<ApiResult<T>>(url, { params })
  return response.data
}

export async function httpPost<T, D = unknown>(url: string, data?: D): Promise<ApiResult<T>> {
  const response = await request.post<ApiResult<T>>(url, data)
  return response.data
}
```

业务 API 调用示例。

```typescript
import { httpGet, httpPost } from '@/utils/request'
import type { ApiResult } from '@/types/api'
import type { UserCreateRequest, UserInfo } from '@/types/user'

export function getUserDetail(id: number): Promise<ApiResult<UserInfo>> {
  return httpGet<UserInfo>(`/users/${id}`)
}

export function createUser(data: UserCreateRequest): Promise<ApiResult<UserInfo>> {
  return httpPost<UserInfo, UserCreateRequest>('/users', data)
}
```

响应结果类型应避免直接写成 `Promise<any>`。如果接口暂时无法确定结构，可以先使用 `unknown`，再在业务代码中逐步收窄。

### 分页数据类型

分页数据是后台管理系统和列表页面中最常见的数据结构。建议在项目中定义统一分页查询和分页结果类型。

分页查询类型示例。

```typescript
export interface PageQuery {
  pageNum: number
  pageSize: number
}
```

分页结果类型示例。

```typescript
export interface PageResult<T> {
  list: T[]
  total: number
  pageNum: number
  pageSize: number
}
```

业务分页查询可以扩展基础分页查询。

```typescript
import type { PageQuery } from '@/types/api'

export interface UserPageQuery extends PageQuery {
  keyword?: string
  enabled?: boolean
}
```

分页接口响应可以组合 `ApiResult` 和 `PageResult`。

```typescript
import type { ApiResult, PageResult } from '@/types/api'

export interface UserListItem {
  id: number
  username: string
  nickname: string
  enabled: boolean
  createTime: string
}

export type UserPageResult = ApiResult<PageResult<UserListItem>>
```

页面中使用分页类型。

```typescript
import { ref } from 'vue'
import type { PageResult } from '@/types/api'
import type { UserListItem } from '@/types/user'

const tableData = ref<UserListItem[]>([])
const total = ref<number>(0)

function handlePageResult(result: PageResult<UserListItem>): void {
  tableData.value = result.list
  total.value = result.total
}
```

分页类型应尽量统一，不建议每个接口都定义一套不同字段名。如果后端接口存在多套分页结构，前端可以通过适配函数转换成统一页面结构。

### 错误响应类型

错误响应类型用于描述请求失败、参数校验失败、权限不足、业务异常等情况。很多项目只定义成功响应类型，忽略错误结构，导致异常处理时大量使用 `any`。

常见错误响应类型如下。

```typescript
export interface ApiErrorResponse {
  code: number
  message: string
  detail?: string
  errors?: Record<string, string[]>
}
```

其中 `errors` 可以用于表单校验错误，例如用户名为空、手机号格式错误等。

```typescript
const errorResponse: ApiErrorResponse = {
  code: 400,
  message: '参数校验失败',
  errors: {
    username: ['用户名不能为空'],
    mobile: ['手机号格式不正确']
  }
}
```

请求错误处理函数可以使用 `unknown` 接收异常，再进行类型判断。

```typescript
import axios from 'axios'
import type { ApiErrorResponse } from '@/types/api'

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return error.response?.data?.message || '请求失败'
  }

  if (error instanceof Error) {
    return error.message
  }

  return '未知错误'
}
```

表单校验错误可以转换为前端字段错误。

```typescript
import type { ApiErrorResponse } from '@/types/api'

export function getFieldErrors(error: ApiErrorResponse): Record<string, string> {
  const fieldErrors: Record<string, string> = {}

  Object.entries(error.errors || {}).forEach(([field, messages]) => {
    fieldErrors[field] = messages[0] || '字段校验失败'
  })

  return fieldErrors
}
```

错误响应类型的价值在于让异常处理也具备结构约束。不要只给成功数据定义类型，而把错误处理全部留给 `any`。

## 表单与事件类型

表单和事件是前端项目中最容易产生类型混乱的部分。表单字段通常会经历初始化、输入、校验、提交、重置等过程；事件对象则和 DOM 元素类型密切相关。TypeScript 可以让这些数据流更加明确。

### 表单数据类型

表单数据类型用于约束页面中可编辑的数据结构。新增表单、编辑表单、查询表单应根据实际字段分别定义，不建议所有场景共用同一个实体类型。

用户查询表单示例。

```typescript
interface UserQueryForm {
  keyword: string
  enabled?: boolean
  pageNum: number
  pageSize: number
}

const queryForm: UserQueryForm = {
  keyword: '',
  enabled: undefined,
  pageNum: 1,
  pageSize: 10
}
```

用户新增表单示例。

```typescript
interface UserCreateForm {
  username: string
  nickname: string
  password: string
  mobile?: string
  enabled: boolean
  roleIds: number[]
}

const createForm: UserCreateForm = {
  username: '',
  nickname: '',
  password: '',
  mobile: undefined,
  enabled: true,
  roleIds: []
}
```

用户编辑表单示例。

```typescript
interface UserUpdateForm {
  id: number
  nickname: string
  mobile?: string
  enabled: boolean
  roleIds: number[]
}

const updateForm: UserUpdateForm = {
  id: 0,
  nickname: '',
  mobile: undefined,
  enabled: true,
  roleIds: []
}
```

如果表单类型和请求类型不一致，建议显式转换。

```typescript
interface UserCreateForm {
  username: string
  nickname: string
  password: string
  roleIds: number[]
  enabled: boolean
}

interface UserCreateRequest {
  username: string
  nickname: string
  password: string
  roleIds: number[]
  enabled: boolean
}

function toUserCreateRequest(form: UserCreateForm): UserCreateRequest {
  return {
    username: form.username.trim(),
    nickname: form.nickname.trim(),
    password: form.password,
    roleIds: form.roleIds,
    enabled: form.enabled
  }
}
```

表单类型设计应避免直接使用后端完整实体。新增和编辑通常不需要 `createTime`、`updateTime` 等字段，强行复用实体类型会导致无意义字段污染表单。

### DOM 事件类型

DOM 事件类型用于约束浏览器事件对象。Vue 和 React 的事件类型写法不同，但都应根据触发事件的元素选择合适类型。

原生 TypeScript 中，输入事件可以这样处理。

```typescript
function handleInput(event: Event): void {
  const target = event.target as HTMLInputElement
  console.log(target.value)
}
```

React 中输入框事件通常使用 `ChangeEvent<HTMLInputElement>`。

```tsx
import type { ChangeEvent } from 'react'

function handleInputChange(event: ChangeEvent<HTMLInputElement>): void {
  const value = event.target.value
  console.log(value)
}
```

React 表单提交事件使用 `FormEvent<HTMLFormElement>`。

```tsx
import type { FormEvent } from 'react'

function handleSubmit(event: FormEvent<HTMLFormElement>): void {
  event.preventDefault()
  console.log('提交表单')
}
```

React 鼠标事件可以使用 `MouseEvent<HTMLButtonElement>`。

```tsx
import type { MouseEvent } from 'react'

function handleButtonClick(event: MouseEvent<HTMLButtonElement>): void {
  event.preventDefault()
  console.log('点击按钮')
}
```

Vue 模板中事件通常不需要显式标注，但在函数中处理原生事件时可以标注。

```vue
<script setup lang="ts">
function handleInput(event: Event): void {
  const target = event.target as HTMLInputElement
  console.log(target.value)
}
</script>

<template>
  <input @input="handleInput" />
</template>
```

常见 DOM 事件类型如下。

| 场景       | React 类型                         | 原生 DOM 类型   |
| ---------- | ---------------------------------- | --------------- |
| 输入框变化 | `ChangeEvent<HTMLInputElement>`    | `Event`         |
| 表单提交   | `FormEvent<HTMLFormElement>`       | `SubmitEvent`   |
| 按钮点击   | `MouseEvent<HTMLButtonElement>`    | `MouseEvent`    |
| 键盘事件   | `KeyboardEvent<HTMLInputElement>`  | `KeyboardEvent` |
| 选择框变化 | `ChangeEvent<HTMLSelectElement>`   | `Event`         |
| 文本域变化 | `ChangeEvent<HTMLTextAreaElement>` | `Event`         |

DOM 事件类型的重点是元素类型。例如 `HTMLInputElement`、`HTMLSelectElement`、`HTMLTextAreaElement` 会影响 `target.value` 等属性是否可用。

### 自定义事件类型

自定义事件用于组件之间或模块之间传递业务数据。Vue 中通常通过 `emit` 定义组件自定义事件，React 中通常通过 Props 回调函数传递事件。

Vue 自定义事件示例。

```vue
<script setup lang="ts">
interface UserInfo {
  id: number
  username: string
}

const emit = defineEmits<{
  select: [user: UserInfo]
  remove: [id: number]
  refresh: []
}>()

function handleSelect(user: UserInfo): void {
  emit('select', user)
}

function handleRemove(id: number): void {
  emit('remove', id)
}

function handleRefresh(): void {
  emit('refresh')
}
</script>
```

React 自定义事件本质上是回调函数。

```tsx
interface UserInfo {
  id: number
  username: string
}

interface UserListProps {
  data: UserInfo[]
  onSelect: (user: UserInfo) => void
  onRemove: (id: number) => Promise<void>
  onRefresh: () => void
}

export function UserList(props: UserListProps) {
  const { data, onSelect, onRemove, onRefresh } = props

  return (
    <div>
      <button onClick={onRefresh}>刷新</button>

      {data.map((item) => (
        <div key={item.id}>
          <span onClick={() => onSelect(item)}>{item.username}</span>
          <button onClick={() => onRemove(item.id)}>删除</button>
        </div>
      ))}
    </div>
  )
}
```

如果项目中有事件总线，也应定义事件名称和事件参数类型。

```typescript
type AppEventMap = {
  'user:refresh': undefined
  'user:select': {
    id: number
    username: string
  }
  'theme:change': {
    mode: 'light' | 'dark'
  }
}

type AppEventName = keyof AppEventMap

function emitEvent<K extends AppEventName>(name: K, payload: AppEventMap[K]): void {
  console.log('触发事件：', name, payload)
}

emitEvent('user:select', {
  id: 1,
  username: 'admin'
})

emitEvent('theme:change', {
  mode: 'dark'
})
```

自定义事件类型设计时，应优先使用清晰的业务命名，例如 `select`、`remove`、`submit`、`refresh`、`confirm`。事件参数不要过多，如果参数较多，建议封装为对象。

### 表单校验类型

表单校验类型用于约束校验规则、校验结果和字段错误。不同 UI 框架有自己的校验类型，例如 Element Plus、Ant Design、React Hook Form 等。项目中也可以定义通用校验类型，降低业务代码耦合。

基础字段错误类型示例。

```typescript
type FieldErrorMap<T extends string = string> = Partial<Record<T, string>>

type UserFormField = 'username' | 'nickname' | 'password' | 'mobile'

const errors: FieldErrorMap<UserFormField> = {
  username: '用户名不能为空',
  password: '密码不能为空'
}
```

通用校验结果类型示例。

```typescript
interface ValidateResult<T extends string = string> {
  valid: boolean
  errors: Partial<Record<T, string>>
}
```

用户表单校验函数示例。

```typescript
interface UserCreateForm {
  username: string
  nickname: string
  password: string
  mobile?: string
  enabled: boolean
  roleIds: number[]
}

type UserCreateFormField = keyof UserCreateForm

interface ValidateResult<T extends string = string> {
  valid: boolean
  errors: Partial<Record<T, string>>
}

function validateUserCreateForm(form: UserCreateForm): ValidateResult<UserCreateFormField> {
  const errors: Partial<Record<UserCreateFormField, string>> = {}

  if (!form.username.trim()) {
    errors.username = '用户名不能为空'
  }

  if (!form.nickname.trim()) {
    errors.nickname = '昵称不能为空'
  }

  if (!form.password.trim()) {
    errors.password = '密码不能为空'
  }

  if (form.roleIds.length === 0) {
    errors.roleIds = '请至少选择一个角色'
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  }
}
```

使用校验结果时，可以根据 `valid` 判断是否继续提交。

```typescript
async function submitUserForm(form: UserCreateForm): Promise<void> {
  const validateResult = validateUserCreateForm(form)

  if (!validateResult.valid) {
    console.warn('表单校验失败：', validateResult.errors)
    return
  }

  console.log('提交用户表单：', form)
}
```

如果使用 Element Plus，可以结合其规则类型。

```typescript
import type { FormRules } from 'element-plus'

interface UserCreateForm {
  username: string
  nickname: string
  password: string
  roleIds: number[]
  enabled: boolean
}

const rules: FormRules<UserCreateForm> = {
  username: [
    {
      required: true,
      message: '用户名不能为空',
      trigger: 'blur'
    }
  ],
  nickname: [
    {
      required: true,
      message: '昵称不能为空',
      trigger: 'blur'
    }
  ],
  password: [
    {
      required: true,
      message: '密码不能为空',
      trigger: 'blur'
    }
  ],
  roleIds: [
    {
      required: true,
      type: 'array',
      message: '请至少选择一个角色',
      trigger: 'change'
    }
  ]
}
```

表单校验类型的重点是让字段名和表单模型保持一致。使用 `keyof UserCreateForm` 可以减少字段名写错的问题，也方便后续表单字段调整时统一重构。



## 常用工具类型

TypeScript 内置了很多工具类型，用于基于已有类型生成新类型。工具类型的价值在于减少重复定义，并让类型之间保持关联。前端项目中，工具类型常用于表单类型、接口参数类型、组件 Props 类型和异步返回值类型处理。

### Partial

`Partial<T>` 用于把类型 `T` 中的所有属性变成可选属性。它适合用于编辑表单、局部更新、搜索条件、配置覆盖等场景。

```typescript
interface UserInfo {
  id: number
  username: string
  nickname: string
  mobile: string
  enabled: boolean
}

type UserPatchForm = Partial<UserInfo>

const form: UserPatchForm = {
  nickname: '管理员',
  enabled: true
}
```

上面的 `UserPatchForm` 等价于：

```typescript
type UserPatchForm = {
  id?: number
  username?: string
  nickname?: string
  mobile?: string
  enabled?: boolean
}
```

在接口局部更新时，`Partial` 很常用。

```typescript
interface UserUpdatePayload {
  id: number
  data: Partial<{
    nickname: string
    mobile: string
    enabled: boolean
  }>
}

const payload: UserUpdatePayload = {
  id: 1,
  data: {
    nickname: '新昵称'
  }
}
```

`Partial` 不代表字段可以随意传，它只是把字段变成可选。如果某些字段不允许更新，应先用 `Pick` 或 `Omit` 限制范围，再配合 `Partial`。

```typescript
interface UserInfo {
  id: number
  username: string
  password: string
  nickname: string
  enabled: boolean
}

type UserEditableFields = Pick<UserInfo, 'nickname' | 'enabled'>

type UserUpdateForm = Partial<UserEditableFields>
```

这种写法比直接 `Partial<UserInfo>` 更安全，因为它不会把 `id`、`username`、`password` 等字段暴露为可更新字段。

### Pick

`Pick<T, K>` 用于从类型 `T` 中挑选指定属性组成新类型。它适合用于从完整实体中提取列表展示字段、表单字段、请求字段等。

```typescript
interface UserInfo {
  id: number
  username: string
  nickname: string
  mobile: string
  enabled: boolean
  createTime: string
  updateTime: string
}

type UserTableRow = Pick<UserInfo, 'id' | 'username' | 'nickname' | 'enabled'>

const row: UserTableRow = {
  id: 1,
  username: 'admin',
  nickname: '管理员',
  enabled: true
}
```

`Pick` 适合表达“只需要其中一部分字段”的场景。例如用户编辑表单只允许修改昵称、手机号和状态。

```typescript
type UserEditForm = Pick<UserInfo, 'id' | 'nickname' | 'mobile' | 'enabled'>

const editForm: UserEditForm = {
  id: 1,
  nickname: '系统管理员',
  mobile: '13800000000',
  enabled: true
}
```

组件 Props 中也可以使用 `Pick` 复用已有业务类型。

```typescript
interface UserInfo {
  id: number
  username: string
  avatar: string
  enabled: boolean
}

interface UserCardProps {
  user: Pick<UserInfo, 'id' | 'username' | 'avatar'>
  showAvatar?: boolean
}
```

`Pick` 的优点是和原始类型保持字段关联。如果 `UserInfo` 中字段类型变化，基于 `Pick` 派生出的类型也会同步变化。

### Omit

`Omit<T, K>` 用于从类型 `T` 中排除指定属性后组成新类型。它适合用于新增表单、提交参数、去除后端只读字段等场景。

```typescript
interface UserInfo {
  id: number
  username: string
  nickname: string
  enabled: boolean
  createTime: string
  updateTime: string
}

type UserCreateForm = Omit<UserInfo, 'id' | 'createTime' | 'updateTime'>

const createForm: UserCreateForm = {
  username: 'admin',
  nickname: '管理员',
  enabled: true
}
```

新增数据通常不需要 `id`、`createTime`、`updateTime`，因此用 `Omit` 比重新定义一遍字段更简洁。

`Omit` 也可以用于组件 Props 二次封装。例如封装一个输入组件时，去掉原生属性中的 `onChange`，改成项目自定义的事件形式。

```typescript
interface BaseInputProps {
  value: string
  disabled?: boolean
  placeholder?: string
  onChange: (value: string) => void
}

type ReadonlyInputProps = Omit<BaseInputProps, 'onChange'> & {
  readonly: true
}
```

`Omit` 适合排除少数字段。如果需要保留的字段比排除的字段少，优先使用 `Pick`，可读性更好。

```typescript
// 不推荐：排除字段太多，可读性差
type UserSimpleInfo = Omit<
  UserInfo,
  'mobile' | 'enabled' | 'createTime' | 'updateTime'
>

// 推荐：明确表达只需要哪些字段
type UserSimpleInfo = Pick<UserInfo, 'id' | 'username' | 'nickname'>
```

### Record

`Record<K, T>` 用于定义键和值类型固定的对象。它适合用于字典、映射表、状态文案、枚举配置、权限配置等场景。

```typescript
type UserStatus = 'enabled' | 'disabled' | 'locked'

const statusTextMap: Record<UserStatus, string> = {
  enabled: '启用',
  disabled: '禁用',
  locked: '锁定'
}
```

如果漏掉某个状态，TypeScript 会提示错误。

```typescript
type UserStatus = 'enabled' | 'disabled' | 'locked'

const statusTextMap: Record<UserStatus, string> = {
  enabled: '启用',
  disabled: '禁用',
  locked: '锁定'
}
```

`Record` 也可以用于状态配置。

```typescript
type UserStatus = 'enabled' | 'disabled' | 'locked'

interface StatusConfig {
  text: string
  color: string
  disabled: boolean
}

const statusConfigMap: Record<UserStatus, StatusConfig> = {
  enabled: {
    text: '启用',
    color: 'green',
    disabled: false
  },
  disabled: {
    text: '禁用',
    color: 'gray',
    disabled: true
  },
  locked: {
    text: '锁定',
    color: 'red',
    disabled: true
  }
}
```

接口错误字段也常用 `Record` 表达。

```typescript
type FieldErrorMap = Record<string, string[]>

const errors: FieldErrorMap = {
  username: ['用户名不能为空'],
  mobile: ['手机号格式不正确']
}
```

如果键名范围是固定的，建议使用字面量联合类型配合 `Record`，这样可以避免遗漏配置。

```typescript
type PermissionCode = 'user:list' | 'user:create' | 'user:update' | 'user:delete'

const permissionTextMap: Record<PermissionCode, string> = {
  'user:list': '用户查询',
  'user:create': '用户新增',
  'user:update': '用户编辑',
  'user:delete': '用户删除'
}
```

`Record` 适合键值映射，不适合替代所有对象类型。业务实体仍然建议使用 `interface` 明确定义字段。

### ReturnType

`ReturnType<T>` 用于获取函数类型的返回值类型。它适合用于复用已有函数的返回值结构，避免手动重复定义类型。

```typescript
function createUserQuery() {
  return {
    keyword: '',
    pageNum: 1,
    pageSize: 10,
    enabled: undefined as boolean | undefined
  }
}

type UserQuery = ReturnType<typeof createUserQuery>

const query: UserQuery = {
  keyword: '',
  pageNum: 1,
  pageSize: 10,
  enabled: true
}
```

当函数返回结构较复杂时，`ReturnType` 可以减少重复维护。

```typescript
function createTableState<T>() {
  return {
    loading: false,
    list: [] as T[],
    total: 0,
    pageNum: 1,
    pageSize: 10
  }
}

interface UserItem {
  id: number
  username: string
}

type UserTableState = ReturnType<typeof createTableState<UserItem>>
```

在状态管理中，也可以通过 `ReturnType` 获取 Store 初始化函数返回值。

```typescript
function createUserState() {
  return {
    token: '',
    userInfo: null as null | {
      id: number
      username: string
    }
  }
}

type UserState = ReturnType<typeof createUserState>
```

`ReturnType` 的适用前提是：函数返回值结构就是你希望复用的类型来源。如果类型本身是业务协议的一部分，例如接口响应、后端 DTO、表单提交参数，建议优先显式定义类型，而不是完全依赖函数反推。

### Awaited

`Awaited<T>` 用于获取 `Promise` 解析后的类型。它适合处理异步函数返回值、接口请求封装和多层 Promise 类型。

```typescript
async function getUserInfo() {
  return {
    id: 1,
    username: 'admin',
    enabled: true
  }
}

type UserInfo = Awaited<ReturnType<typeof getUserInfo>>

const user: UserInfo = {
  id: 1,
  username: 'admin',
  enabled: true
}
```

如果函数返回的是 `Promise<ApiResult<UserInfo>>`，可以结合 `Awaited` 和 `ReturnType` 获取完整响应类型。

```typescript
interface ApiResult<T> {
  code: number
  message: string
  data: T
}

interface UserInfo {
  id: number
  username: string
  enabled: boolean
}

async function getUserDetail(id: number): Promise<ApiResult<UserInfo>> {
  const response = await fetch(`/api/users/${id}`)
  return response.json()
}

type UserDetailResult = Awaited<ReturnType<typeof getUserDetail>>
```

上面的 `UserDetailResult` 等价于：

```typescript
type UserDetailResult = ApiResult<UserInfo>
```

如果只想获取 `data` 的类型，可以继续使用索引访问类型。

```typescript
type UserDetailData = Awaited<ReturnType<typeof getUserDetail>>['data']
```

`Awaited` 常用于封装通用异步工具函数。

```typescript
async function safeRequest<T extends (...args: never[]) => Promise<unknown>>(
  requestFn: T
): Promise<{
  data: Awaited<ReturnType<T>> | null
  error: unknown
}> {
  try {
    const data = await requestFn()
    return {
      data: data as Awaited<ReturnType<T>>,
      error: null
    }
  } catch (error) {
    return {
      data: null,
      error
    }
  }
}
```

`Awaited` 的主要价值是从异步函数中提取真实结果类型，避免手动维护重复类型。

## 类型安全实践

类型安全实践的目标不是让类型写得越复杂越好，而是让代码在关键边界上更稳定。前端项目中，应重点关注接口数据、表单数据、组件通信、状态管理、空值处理和异常处理。

### 避免滥用 any

`any` 会关闭 TypeScript 对该值的类型检查。使用 `any` 后，该变量可以调用任意属性和方法，TypeScript 不再帮助检查错误。

```typescript
function handleUser(user: any): string {
  return user.profile.name.toUpperCase()
}
```

上面的代码即使 `profile` 不存在，TypeScript 也不会报错，运行时可能直接崩溃。

更安全的做法是定义明确类型。

```typescript
interface UserInfo {
  profile?: {
    name?: string
  }
}

function handleUser(user: UserInfo): string {
  return user.profile?.name?.toUpperCase() || '未命名用户'
}
```

接口请求中也不建议直接使用 `any`。

```typescript
// 不推荐
async function request(url: string): Promise<any> {
  const response = await fetch(url)
  return response.json()
}
```

推荐使用泛型，让调用方指定数据类型。

```typescript
interface ApiResult<T> {
  code: number
  message: string
  data: T
}

async function request<T>(url: string): Promise<ApiResult<T>> {
  const response = await fetch(url)
  return response.json()
}
```

调用时指定业务类型。

```typescript
interface UserInfo {
  id: number
  username: string
  enabled: boolean
}

async function loadUser(): Promise<void> {
  const result = await request<UserInfo>('/api/user/info')
  console.log(result.data.username)
}
```

确实需要临时接收未知结构时，优先使用 `unknown`，而不是 `any`。`unknown` 会强制开发者在使用前进行类型判断。

`any` 可以在以下少数场景中短期使用：老项目迁移、第三方库类型缺失、历史接口结构混乱、临时调试代码。但应通过 ESLint 规则限制它的扩散。

```javascript
// eslint.config.js
export default [
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn'
    }
  }
]
```

### unknown 的使用

`unknown` 表示未知类型。它和 `any` 的区别是：`unknown` 不能直接访问属性、调用方法或赋值给具体类型，必须先进行类型收窄。

```typescript
function handleValue(value: unknown): string {
  if (typeof value === 'string') {
    return value.trim()
  }

  if (typeof value === 'number') {
    return String(value)
  }

  return ''
}
```

异常处理场景适合使用 `unknown`。因为 `catch` 捕获到的内容不一定是 `Error` 对象，也可能是字符串、对象或其他值。

```typescript
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  if (typeof error === 'string') {
    return error
  }

  return '未知错误'
}
```

接口返回数据结构不确定时，也可以先用 `unknown` 接收，再做类型判断。

```typescript
interface UserInfo {
  id: number
  username: string
}

function isUserInfo(value: unknown): value is UserInfo {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const user = value as Record<string, unknown>

  return typeof user.id === 'number' && typeof user.username === 'string'
}

function handleApiData(data: unknown): UserInfo | null {
  if (isUserInfo(data)) {
    return data
  }

  console.warn('用户数据结构不正确')
  return null
}
```

`value is UserInfo` 是类型谓词，用于告诉 TypeScript：如果函数返回 `true`，那么 `value` 就可以被认为是 `UserInfo`。

`unknown` 适合用于以下场景。

| 场景         | 说明                              |
| ------------ | --------------------------------- |
| `catch` 异常 | 捕获内容不一定是 `Error`          |
| 外部接口数据 | 后端返回结构可能不稳定            |
| 第三方库回调 | 参数结构不明确                    |
| 本地缓存数据 | `localStorage` 解析结果不可信     |
| 消息通信     | `postMessage`、事件总线等外部输入 |

`unknown` 的核心价值是保留类型安全边界：可以接收任何值，但不能不经判断就使用。

### 类型断言的使用边界

类型断言用于告诉 TypeScript：“我比编译器更清楚这个值的类型”。它的语法是 `as Type`。类型断言不会改变运行时数据，只会影响编译阶段的类型判断。

```typescript
const input = document.querySelector('#username') as HTMLInputElement

input.value = 'admin'
```

上面的代码告诉 TypeScript，查询到的元素是 `HTMLInputElement`。但如果页面中实际没有该元素，`input` 仍然可能是 `null`，运行时会报错。

更安全的写法是先判断空值。

```typescript
const input = document.querySelector('#username')

if (input instanceof HTMLInputElement) {
  input.value = 'admin'
}
```

类型断言适合在开发者确实掌握更多上下文时使用，例如 DOM 查询、第三方库返回值、JSON 解析后的已知结构等。

```typescript
interface UserInfo {
  id: number
  username: string
}

const jsonText = '{"id":1,"username":"admin"}'
const user = JSON.parse(jsonText) as UserInfo

console.log(user.username)
```

但这种写法并不安全，因为 `JSON.parse` 的结果是否符合 `UserInfo` 并没有被验证。更稳妥的方式是配合类型守卫。

```typescript
interface UserInfo {
  id: number
  username: string
}

function isUserInfo(value: unknown): value is UserInfo {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const data = value as Record<string, unknown>

  return typeof data.id === 'number' && typeof data.username === 'string'
}

const jsonText = '{"id":1,"username":"admin"}'
const parsedData: unknown = JSON.parse(jsonText)

if (isUserInfo(parsedData)) {
  console.log(parsedData.username)
}
```

不推荐使用双重断言强行绕过类型检查。

```typescript
// 不推荐
const value = '100' as unknown as number
```

这类写法会破坏类型系统，容易制造运行时错误。除非是在处理非常特殊的第三方库类型缺陷，否则不应使用。

类型断言的使用原则如下。

| 场景                 | 建议                       |
| -------------------- | -------------------------- |
| DOM 查询             | 优先使用 `instanceof` 判断 |
| JSON 解析            | 优先使用类型守卫校验       |
| 第三方库类型不完整   | 可以局部断言               |
| 为了绕过报错         | 不建议                     |
| 从完全不相关类型强转 | 避免双重断言               |
| 接口响应数据         | 优先用泛型和运行时校验     |

类型断言应该是局部、明确、可解释的。不要用断言替代类型定义，也不要用断言压制本应修复的类型错误。

### 空值与可选链处理

空值处理是 TypeScript 类型安全中非常重要的一部分。前端项目中，接口数据未返回、组件 Props 未传、状态未初始化、DOM 元素不存在、缓存数据为空等情况都可能产生 `null` 或 `undefined`。

建议在 `tsconfig.json` 中开启严格空值检查。

```jsonc
{
  "compilerOptions": {
    "strict": true,
    "strictNullChecks": true
  }
}
```

开启后，`null` 和 `undefined` 不能随意赋值给其他类型。

```typescript
let username: string = 'admin'

// username = null // 类型错误
```

如果字段确实可能为空，应显式声明。

```typescript
let token: string | null = null

token = 'access-token'
token = null
```

可选属性读取时，应使用可选链或空值合并。

```typescript
interface UserInfo {
  id: number
  username: string
  profile?: {
    nickname?: string
    avatar?: string
  }
}

function getNickname(user: UserInfo): string {
  return user.profile?.nickname ?? user.username
}
```

`?.` 是可选链，当左侧为 `null` 或 `undefined` 时，表达式返回 `undefined`，不会继续访问后续属性。

`??` 是空值合并运算符，只有左侧为 `null` 或 `undefined` 时才使用右侧默认值。

```typescript
const nickname = user.profile?.nickname ?? '未设置昵称'
```

不要把 `||` 和 `??` 混用。`||` 会把空字符串、`0`、`false` 都当作假值处理，而 `??` 只处理 `null` 和 `undefined`。

```typescript
const pageSize = 0

const value1 = pageSize || 10
const value2 = pageSize ?? 10

console.log(value1) // 10
console.log(value2) // 0
```

在分页、开关状态、数字输入等场景中，优先使用 `??`。

```typescript
interface PageQuery {
  pageNum?: number
  pageSize?: number
}

function normalizePageQuery(query: PageQuery): Required<PageQuery> {
  return {
    pageNum: query.pageNum ?? 1,
    pageSize: query.pageSize ?? 10
  }
}
```

处理数组时，也应考虑空值。

```typescript
interface UserInfo {
  id: number
  username: string
}

function getUsernames(list?: UserInfo[]): string[] {
  return list?.map((item) => item.username) ?? []
}
```

处理接口详情数据时，建议把未加载状态明确建模。

```typescript
interface UserDetail {
  id: number
  username: string
  enabled: boolean
}

const userDetail: UserDetail | null = null

function renderUsername(user: UserDetail | null): string {
  if (!user) {
    return '加载中'
  }

  return user.username
}
```

空值处理的核心原则是：可能为空就在类型上体现，使用前先判断，读取深层属性使用可选链，设置默认值优先使用 `??`。这样可以减少运行时的 `Cannot read properties of undefined` 错误。



## 项目规范

项目规范用于统一 TypeScript 在团队项目中的写法，减少类型命名混乱、重复定义、隐式 `any`、目录散乱和构建阶段才暴露问题的情况。TypeScript 项目规范不只是代码风格问题，更关系到接口联调、组件复用、模块边界和长期维护成本。

### 命名规范

命名规范的目标是让类型名称、接口名称、枚举值、函数名称和文件名称具备稳定含义。前端项目中，类型命名应尽量表达业务语义，而不是只描述技术结构。

业务实体类型建议使用清晰的名词，例如 `UserInfo`、`RoleInfo`、`MenuItem`、`OrderDetail`。

```typescript
interface UserInfo {
  id: number
  username: string
  nickname: string
  enabled: boolean
}

interface RoleInfo {
  id: number
  roleName: string
  roleCode: string
}
```

请求参数类型建议使用 `Request`、`Query`、`Params`、`Payload` 等后缀。

```typescript
interface UserPageQuery {
  keyword?: string
  enabled?: boolean
  pageNum: number
  pageSize: number
}

interface UserCreateRequest {
  username: string
  nickname: string
  password: string
  roleIds: number[]
}

interface UserUpdateRequest {
  id: number
  nickname: string
  enabled: boolean
  roleIds: number[]
}
```

响应数据类型建议使用 `Result`、`Response`、`VO`、`DTO` 等后缀，但前端项目中更推荐使用 `Result` 或具体业务名称，避免过度后端化。

```typescript
interface ApiResult<T> {
  code: number
  message: string
  data: T
}

interface PageResult<T> {
  list: T[]
  total: number
  pageNum: number
  pageSize: number
}
```

组件 Props 类型建议使用组件名加 `Props` 后缀。

```typescript
interface UserSelectProps {
  modelValue?: number
  disabled?: boolean
  placeholder?: string
}

interface UserTableProps {
  data: UserInfo[]
  loading?: boolean
}
```

回调函数类型建议使用 `Handler`、`Callback`、`Listener` 等后缀。

```typescript
type SubmitHandler<T> = (form: T) => Promise<void>

type UserSelectCallback = (user: UserInfo) => void

type RowClickHandler<T> = (row: T, index: number) => void
```

字面量联合类型建议使用业务名加 `Type`、`Status`、`Mode`、`Code` 等后缀。

```typescript
type UserStatus = 'enabled' | 'disabled' | 'locked'

type ThemeMode = 'light' | 'dark'

type PermissionCode = 'user:list' | 'user:create' | 'user:update' | 'user:delete'
```

常见命名建议如下。

| 类型       | 推荐命名                          | 示例                   |
| ---------- | --------------------------------- | ---------------------- |
| 业务实体   | `XxxInfo`、`XxxItem`、`XxxDetail` | `UserInfo`、`MenuItem` |
| 查询参数   | `XxxQuery`                        | `UserPageQuery`        |
| 新增请求   | `XxxCreateRequest`                | `UserCreateRequest`    |
| 更新请求   | `XxxUpdateRequest`                | `UserUpdateRequest`    |
| 组件 Props | `XxxProps`                        | `UserSelectProps`      |
| 回调函数   | `XxxHandler`、`XxxCallback`       | `SubmitHandler`        |
| 状态类型   | `XxxStatus`                       | `UserStatus`           |
| 模式类型   | `XxxMode`                         | `ThemeMode`            |
| 通用响应   | `ApiResult<T>`                    | `ApiResult<UserInfo>`  |
| 分页响应   | `PageResult<T>`                   | `PageResult<UserItem>` |

命名应避免使用无意义名称，例如 `DataType`、`ObjType`、`InfoType`、`MyType`、`TestType`。这些名称短期能用，长期会让类型含义变得模糊。

### 类型定义规范

类型定义规范用于约束 `interface`、`type`、泛型、工具类型、可选字段和导出方式的使用。规范的核心目标是让类型来源清晰、职责明确、复用边界合理。

对象结构优先使用 `interface`，类型组合优先使用 `type`。

```typescript
interface UserInfo {
  id: number
  username: string
  nickname: string
  enabled: boolean
}

type UserStatus = 'enabled' | 'disabled' | 'locked'

type UserCreateForm = Omit<UserInfo, 'id'>
```

接口响应、分页结构、下拉选项等通用结构建议使用泛型。

```typescript
interface ApiResult<T> {
  code: number
  message: string
  data: T
}

interface PageResult<T> {
  list: T[]
  total: number
  pageNum: number
  pageSize: number
}

interface OptionItem<T = string | number> {
  label: string
  value: T
  disabled?: boolean
}
```

字段是否可选应根据真实业务含义定义。不要为了少写初始化值，把所有字段都写成可选。

```typescript
// 推荐：只有确实可能不存在的字段才使用 ?
interface UserInfo {
  id: number
  username: string
  nickname?: string
  enabled: boolean
}
```

不推荐下面这种写法。

```typescript
// 不推荐：字段全部可选会导致类型约束失效
interface UserInfo {
  id?: number
  username?: string
  nickname?: string
  enabled?: boolean
}
```

接口返回结构和页面展示结构应分开。接口返回什么，就按接口结构定义；页面需要什么，就定义页面视图类型或转换函数。

```typescript
interface UserResponse {
  id: number
  username: string
  nickname: string | null
  enabled: boolean
}

interface UserTableRow {
  id: number
  displayName: string
  statusText: string
}

function toUserTableRow(user: UserResponse): UserTableRow {
  return {
    id: user.id,
    displayName: user.nickname ?? user.username,
    statusText: user.enabled ? '启用' : '禁用'
  }
}
```

类型导入应使用 `import type`，这样可以明确当前导入只在类型阶段使用，减少运行时代码干扰。

```typescript
import type { ApiResult, PageResult } from '@/types/api'
import type { UserInfo, UserPageQuery } from '@/types/user'
```

业务类型不应全部声明为全局类型。除非是项目确实广泛使用的环境类型，否则应优先通过模块导入导出维护依赖关系。

```typescript
// 推荐：显式导出
export interface UserInfo {
  id: number
  username: string
  enabled: boolean
}
```

全局声明文件适合放置环境变量、静态资源模块声明、框架扩展类型等内容。

文件位置：`src/types/env.d.ts`

```typescript
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_API_BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

类型定义应遵循以下原则：接口结构稳定、命名表达业务、可选字段谨慎使用、公共类型集中维护、私有类型就近定义、不要用 `any` 绕过问题。

### 目录组织规范

目录组织规范用于管理类型文件、接口文件、页面文件、组件文件和状态文件之间的关系。TypeScript 项目中，类型文件如果没有清晰归属，会很快出现重复定义和循环依赖。

推荐的前端项目目录结构如下。

```text
src
├── api
│   ├── user.ts
│   ├── role.ts
│   └── menu.ts
├── components
│   └── UserSelect
│       ├── index.vue
│       └── types.ts
├── stores
│   ├── user.ts
│   └── permission.ts
├── types
│   ├── api.ts
│   ├── common.ts
│   ├── user.ts
│   ├── role.ts
│   └── menu.ts
├── utils
│   ├── request.ts
│   └── format.ts
└── views
    └── user
        ├── UserList.vue
        ├── UserForm.vue
        └── types.ts
```

不同目录的职责建议如下。

| 目录                         | 说明                                             |
| ---------------------------- | ------------------------------------------------ |
| `src/types`                  | 跨模块复用类型，例如接口响应、业务模型、公共类型 |
| `src/api`                    | API 请求方法和请求参数、响应类型引用             |
| `src/views/**/types.ts`      | 页面内部专用类型                                 |
| `src/components/**/types.ts` | 组件内部 Props、Emits、配置类型                  |
| `src/stores`                 | 状态管理相关类型和 Store 定义                    |
| `src/utils`                  | 工具函数及其参数、返回值类型                     |

通用类型可以集中放在 `src/types` 中。

文件位置：`src/types/api.ts`

```typescript
export interface ApiResult<T> {
  code: number
  message: string
  data: T
}

export interface PageQuery {
  pageNum: number
  pageSize: number
}

export interface PageResult<T> {
  list: T[]
  total: number
  pageNum: number
  pageSize: number
}
```

业务类型按模块拆分。

文件位置：`src/types/user.ts`

```typescript
import type { PageQuery } from './api'

export interface UserInfo {
  id: number
  username: string
  nickname: string
  enabled: boolean
  createTime: string
}

export interface UserPageQuery extends PageQuery {
  keyword?: string
  enabled?: boolean
}

export type UserCreateRequest = Omit<UserInfo, 'id' | 'createTime'>

export type UserUpdateRequest = Pick<UserInfo, 'id' | 'nickname' | 'enabled'>
```

页面内部专用类型可以靠近页面文件维护。

文件位置：`src/views/user/types.ts`

```typescript
export interface UserSearchForm {
  keyword: string
  enabled?: boolean
}

export interface UserDialogState {
  visible: boolean
  title: string
  mode: 'create' | 'update'
}
```

不建议把所有类型都放到一个 `types.ts` 文件中。随着业务增长，单文件类型仓库会变得难以查找、难以拆分，也容易引起无意义的依赖。

### ESLint 与类型检查

ESLint 用于检查代码规范和潜在问题，TypeScript 编译器用于检查类型正确性。两者职责不同，应同时使用。ESLint 不应替代 `tsc` 或 `vue-tsc`，类型检查也不应替代代码风格检查。

基础依赖安装如下。

```bash
pnpm add eslint typescript typescript-eslint -D
```

Vue 项目还需要安装 Vue ESLint 相关依赖。

```bash
pnpm add eslint-plugin-vue vue-eslint-parser vue-tsc -D
```

React 项目通常需要安装 React Hooks 相关规则。

```bash
pnpm add eslint-plugin-react-hooks eslint-plugin-react-refresh -D
```

基础 ESLint 配置示例。

文件位置：`eslint.config.js`

```javascript
import js from '@eslint/js'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx,vue}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_'
        }
      ],
      '@typescript-eslint/consistent-type-imports': 'warn'
    }
  }
)
```

类型检查命令建议写入 `package.json`。

Vue 项目脚本示例。

```json
{
  "scripts": {
    "dev": "vite",
    "type-check": "vue-tsc --noEmit",
    "lint": "eslint .",
    "build": "vue-tsc --noEmit && vite build"
  }
}
```

React 项目脚本示例。

```json
{
  "scripts": {
    "dev": "vite",
    "type-check": "tsc --noEmit",
    "lint": "eslint .",
    "build": "tsc --noEmit && vite build"
  }
}
```

建议在提交代码前至少执行：

```bash
pnpm lint
pnpm type-check
```

如果项目接入 CI，应在构建流程中执行类型检查和 ESLint 检查，避免类型错误进入主分支。

## 开发与调试

TypeScript 的开发与调试重点不是运行时调试，而是定位类型错误、理解类型推断结果、检查编译配置、确认编辑器识别是否正确。熟悉这些方法可以显著提升排查效率。

### 类型错误排查

类型错误排查应先看错误位置，再看错误来源，最后看类型定义是否合理。不要一看到类型报错就使用 `as any` 或类型断言压制。

常见错误一：对象缺少必填字段。

```typescript
interface UserInfo {
  id: number
  username: string
  enabled: boolean
}

const user: UserInfo = {
  id: 1,
  username: 'admin'
}
```

上面的代码缺少 `enabled` 字段。修复方式是补全字段，或者确认该字段是否应该定义为可选。

```typescript
const user: UserInfo = {
  id: 1,
  username: 'admin',
  enabled: true
}
```

常见错误二：可选字段未判断就直接使用。

```typescript
interface UserInfo {
  id: number
  username: string
  nickname?: string
}

function formatNickname(user: UserInfo): string {
  return user.nickname.toUpperCase()
}
```

`nickname` 可能是 `undefined`，需要先做空值处理。

```typescript
function formatNickname(user: UserInfo): string {
  return user.nickname?.toUpperCase() ?? user.username
}
```

常见错误三：联合类型没有收窄。

```typescript
type ApiResult =
  | {
      success: true
      data: string[]
    }
  | {
      success: false
      message: string
    }

function handleResult(result: ApiResult): string[] {
  return result.data
}
```

需要先根据判别字段进行类型收窄。

```typescript
function handleResult(result: ApiResult): string[] {
  if (result.success) {
    return result.data
  }

  console.warn('请求失败：', result.message)
  return []
}
```

常见错误四：空数组无法正确推断类型。

```typescript
const userList = []

userList.push({
  id: 1,
  username: 'admin'
})
```

建议给空数组添加显式类型。

```typescript
interface UserInfo {
  id: number
  username: string
}

const userList: UserInfo[] = []

userList.push({
  id: 1,
  username: 'admin'
})
```

类型错误排查的基本顺序如下。

| 步骤         | 说明                                     |
| ------------ | ---------------------------------------- |
| 查看报错位置 | 确认是变量、函数、组件还是接口调用报错   |
| 查看期望类型 | 看 TypeScript 期望当前值是什么类型       |
| 查看实际类型 | 看当前传入值被推断成了什么类型           |
| 检查类型定义 | 判断字段是否缺失、可选、联合或不匹配     |
| 检查数据来源 | 判断是接口、表单、状态还是组件 Props     |
| 修复类型边界 | 优先修正类型定义或数据转换，不要直接断言 |

### 编译检查

编译检查用于确认整个项目是否存在类型错误。前端项目中，开发服务器能正常启动并不代表类型完全正确。特别是 Vite 在开发阶段更关注快速热更新，完整类型检查通常需要单独命令执行。

Vue 项目使用 `vue-tsc` 检查。

```bash
pnpm vue-tsc --noEmit
```

React 或普通 TypeScript 项目使用 `tsc` 检查。

```bash
pnpm tsc --noEmit
```

建议在 `package.json` 中统一脚本。

```json
{
  "scripts": {
    "type-check": "vue-tsc --noEmit"
  }
}
```

如果是 React 项目，则使用：

```json
{
  "scripts": {
    "type-check": "tsc --noEmit"
  }
}
```

`--noEmit` 表示只检查类型，不输出编译文件。前端项目的构建产物通常由 Vite 或 Webpack 输出，因此类型检查阶段不需要生成 JavaScript 文件。

如果项目中类型错误太多，可以先按模块逐步修复。常见迁移策略是：

| 阶段     | 处理方式                                |
| -------- | --------------------------------------- |
| 第一阶段 | 先保证新代码不增加 `any` 和明显类型错误 |
| 第二阶段 | 修复公共类型、API 类型、组件 Props 类型 |
| 第三阶段 | 修复页面表单、状态管理、工具函数类型    |
| 第四阶段 | 开启更严格的 TypeScript 配置            |
| 第五阶段 | 将类型检查加入 CI 和构建流程            |

对于老项目，不建议一次性把 `strict` 打开后强行修完所有问题。更稳妥的方式是按模块收敛类型边界。

### IDE 类型跳转

IDE 类型跳转用于快速理解类型来源、字段结构和函数调用关系。VS Code 对 TypeScript 的支持较完整，可以通过类型跳转提升阅读和排查效率。

常用操作包括：

| 功能                  | 作用                       |
| --------------------- | -------------------------- |
| Go to Definition      | 跳转到变量、函数或类型定义 |
| Go to Type Definition | 跳转到类型定义             |
| Find All References   | 查找所有引用               |
| Rename Symbol         | 安全重命名变量、字段或类型 |
| Peek Definition       | 在当前窗口预览定义         |
| Hover                 | 查看推断类型和注释         |

在复杂类型中，可以通过悬浮查看 TypeScript 推断结果。

```typescript
interface UserInfo {
  id: number
  username: string
  enabled: boolean
}

const userList: UserInfo[] = []

const enabledUsers = userList.filter((item) => item.enabled)
```

悬浮 `enabledUsers` 可以看到它被推断为 `UserInfo[]`。

如果路径别名无法跳转，通常需要检查 `tsconfig.json` 和构建工具配置是否一致。

文件位置：`tsconfig.json`

```jsonc
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

文件位置：`vite.config.ts`

```typescript
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
```

如果 VS Code 类型提示异常，可以尝试以下操作：

```text
TypeScript: Restart TS Server
```

或者确认当前项目使用的是工作区 TypeScript 版本。

```text
TypeScript: Select TypeScript Version
```

选择：

```text
Use Workspace Version
```

IDE 类型跳转不只是开发便利功能，它也是检查类型组织是否合理的重要方式。如果一个类型很难跳转、来源不明确、依赖关系复杂，通常说明类型组织需要调整。

### 构建阶段类型校验

构建阶段类型校验用于保证生产构建前没有类型错误。开发阶段可以临时容忍部分类型问题，但构建阶段应尽量阻止错误代码进入产物。

推荐构建脚本如下。

Vue 项目：

```json
{
  "scripts": {
    "build": "vue-tsc --noEmit && vite build"
  }
}
```

React 项目：

```json
{
  "scripts": {
    "build": "tsc --noEmit && vite build"
  }
}
```

这样可以先执行类型检查，类型检查通过后再执行打包。如果类型检查失败，构建会直接中断。

也可以将检查拆成多个脚本。

```json
{
  "scripts": {
    "lint": "eslint .",
    "type-check": "vue-tsc --noEmit",
    "build-only": "vite build",
    "build": "pnpm lint && pnpm type-check && pnpm build-only"
  }
}
```

CI 流程中也建议执行同样命令。

```bash
pnpm install
pnpm lint
pnpm type-check
pnpm build
```

对于大型项目，可以根据团队情况决定是否在本地构建时强制执行 ESLint。类型检查建议始终保留，因为它直接影响代码正确性。

如果构建阶段类型检查耗时较长，可以优化以下内容：

| 优化项           | 说明                             |
| ---------------- | -------------------------------- |
| `skipLibCheck`   | 跳过第三方库声明文件检查         |
| 拆分 tsconfig    | 区分应用代码和 Node 配置代码     |
| 减少全局类型     | 避免过多全局声明导致检查范围扩大 |
| 清理无用依赖     | 删除不再使用的类型包             |
| 避免复杂递归类型 | 减少类型系统计算压力             |

构建阶段类型校验的目标是让问题在发布前暴露，而不是让用户在浏览器运行时遇到错误。

## 实战总结

TypeScript 在前端项目中的落地重点是渐进式提升类型安全，而不是一次性写出复杂类型系统。实际开发中，应优先保护接口、组件、状态、表单和公共工具函数这些关键边界。

### 常见问题

问题一：什么时候该写类型注解？

简单变量可以依赖类型推断，函数参数、公共函数返回值、接口响应、组件 Props、表单模型和状态结构应显式定义类型。

```typescript
const username = 'admin'

function formatStatus(enabled: boolean): string {
  return enabled ? '启用' : '禁用'
}
```

问题二：`interface` 和 `type` 怎么选？

对象结构优先使用 `interface`，联合类型、字面量类型、函数类型和工具类型组合优先使用 `type`。

```typescript
interface UserInfo {
  id: number
  username: string
}

type UserStatus = 'enabled' | 'disabled'
```

问题三：接口返回类型是不是一定可信？

不一定。TypeScript 类型只在开发阶段生效，无法保证运行时后端一定返回正确结构。关键接口仍然需要空值处理、错误处理或运行时校验。

```typescript
function getUsername(user: UserInfo | null): string {
  return user?.username ?? '未知用户'
}
```

问题四：为什么不推荐大量使用 `any`？

`any` 会关闭类型检查，导致 TypeScript 无法发现字段错误、参数错误和返回值错误。确实不知道类型时，优先使用 `unknown`。

```typescript
function handleData(data: unknown): void {
  if (typeof data === 'string') {
    console.log(data.trim())
  }
}
```

问题五：为什么开发时没报错，构建时报错？

可能是开发工具只做了语法转换，没有执行完整类型检查。应在构建脚本中加入 `tsc --noEmit` 或 `vue-tsc --noEmit`。

```json
{
  "scripts": {
    "type-check": "vue-tsc --noEmit",
    "build": "vue-tsc --noEmit && vite build"
  }
}
```

问题六：为什么路径别名可以运行，但类型跳转失败？

通常是 `vite.config.ts` 中配置了别名，但 `tsconfig.json` 中没有同步配置 `paths`。

```jsonc
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

### 最佳实践

TypeScript 最佳实践应围绕项目边界展开。边界越清晰，类型价值越高；类型越接近真实业务，维护成本越低。

建议优先为以下位置建立类型：

| 位置       | 说明                                   |
| ---------- | -------------------------------------- |
| API 请求   | 请求参数、响应结果、分页结构、错误结构 |
| 组件 Props | 组件输入边界                           |
| 组件事件   | Vue Emits 或 React 回调函数            |
| 状态管理   | Store State、Getter、Action            |
| 表单模型   | 查询、新增、编辑、校验                 |
| 工具函数   | 参数和返回值                           |
| 字典配置   | 状态值、权限码、枚举映射               |

推荐做法如下。

第一，开启严格类型检查。

```jsonc
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

第二，接口请求使用泛型封装。

```typescript
interface ApiResult<T> {
  code: number
  message: string
  data: T
}

async function request<T>(url: string): Promise<ApiResult<T>> {
  const response = await fetch(url)
  return response.json()
}
```

第三，公共类型统一维护，业务类型按模块拆分。

```text
src/types
├── api.ts
├── common.ts
├── user.ts
├── role.ts
└── menu.ts
```

第四，组件 Props 和事件必须有明确类型。

```typescript
interface UserSelectProps {
  modelValue?: number
  disabled?: boolean
  onChange: (value: number | undefined) => void
}
```

第五，空值处理要体现在类型中。

```typescript
interface UserState {
  token: string
  userInfo: UserInfo | null
}
```

第六，优先使用 `unknown` 处理外部不可信数据。

```typescript
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  return '未知错误'
}
```

第七，不要用复杂类型炫技。类型系统的目标是服务业务代码，而不是增加理解成本。能用简单接口表达清楚的，不要强行写复杂条件类型。

### 项目落地建议

TypeScript 落地应根据项目阶段采用不同策略。新项目可以从一开始建立完整规范；老项目应采用渐进式迁移，先收紧关键边界，再逐步覆盖历史代码。

新项目建议直接采用以下策略：

```text
1. 使用 Vite 创建 TypeScript 项目
2. 开启 strict、noImplicitAny、strictNullChecks
3. 配置 ESLint 和类型检查命令
4. 建立 src/types 目录
5. API 请求统一封装泛型响应
6. 组件 Props、Emits、Store 必须定义类型
7. 构建阶段执行类型检查
```

老项目迁移建议按优先级逐步处理。

```text
1. 先安装 TypeScript 并允许 JS 与 TS 共存
2. 新增代码全部使用 TypeScript
3. 先定义 API 响应和请求参数类型
4. 再补充公共组件 Props 类型
5. 然后补充状态管理和表单类型
6. 最后逐步收紧 tsconfig 严格配置
```

迁移过程中，不建议一次性重写所有文件。更合理的方式是按模块逐步改造，例如先改用户模块，再改角色模块，再改菜单模块。

推荐的落地顺序如下。

| 阶段     | 目标         | 重点文件                                            |
| -------- | ------------ | --------------------------------------------------- |
| 第一阶段 | 建立基础环境 | `tsconfig.json`、`package.json`、`eslint.config.js` |
| 第二阶段 | 统一接口类型 | `src/types/api.ts`、`src/utils/request.ts`          |
| 第三阶段 | 建立业务模型 | `src/types/user.ts`、`src/types/role.ts`            |
| 第四阶段 | 改造页面表单 | `views/**/types.ts`、页面组件                       |
| 第五阶段 | 改造公共组件 | `components/**/types.ts`、Props、Emits              |
| 第六阶段 | 接入质量检查 | `lint`、`type-check`、CI 构建                       |

最终建议形成团队约定，例如：

```text
1. 禁止新增显式 any，特殊情况必须说明原因
2. API 请求必须定义请求参数和响应类型
3. 公共组件必须定义 Props 和事件类型
4. 表单类型不能直接滥用后端完整实体
5. 可空字段必须显式声明 null 或 undefined
6. 构建前必须通过类型检查
7. 公共类型放 src/types，页面私有类型就近维护
```

TypeScript 的价值来自长期一致使用。只在少数文件中使用类型，收益有限；在接口、组件、状态和表单这些关键位置持续建立类型边界，才能真正提升前端项目的可靠性和可维护性。
