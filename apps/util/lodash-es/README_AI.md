# Lodash ES

Lodash ES 是 Lodash 提供的 ES Module 版本，适合在 Vue3、TypeScript、Vite 等现代前端项目中使用。相比传统 Lodash，Lodash ES 更适合按需引入，并且可以配合构建工具的 Tree Shaking 能力减少最终打包体积。

## 文档概述

本章节用于说明本文档的编写目的、适用范围以及相关技术栈背景，帮助开发人员在前端项目中明确 Lodash ES 的使用边界和落地方式。

### 编写目的

本文档用于规范前端项目中 Lodash ES 的使用方式，帮助开发人员在 Vue3 与 TypeScript 项目中合理使用常见工具函数，减少重复代码，提高数据处理逻辑的可读性、稳定性和可维护性。

在实际业务开发中，前端经常需要处理数组、对象、字符串、集合、类型判断、防抖节流、深拷贝等场景。如果所有逻辑都由业务代码手写实现，容易出现代码重复、边界处理不一致、类型不清晰等问题。通过引入 Lodash ES，可以在保证代码简洁的同时，提高通用数据处理逻辑的可靠性。

本文档主要用于解决以下问题：

- 统一 Lodash ES 在项目中的安装、引入和使用方式。
- 说明 Lodash ES 与传统 Lodash 在前端项目中的使用差异。
- 规范按需引入方式，避免不必要的全量导入。
- 结合 Vue3 和 TypeScript 给出常见业务场景示例。
- 降低深拷贝、防抖节流、对象处理等场景中的误用风险。
- 提高团队成员在工具函数使用上的一致性。

### 适用范围

本文档适用于基于 Vue3、TypeScript 和 Vite 构建的前端项目，尤其适用于中后台管理系统、数据看板、表单系统、列表检索页面、复杂表格页面以及需要频繁进行数据转换的业务模块。

适用场景包括但不限于：

- 数组数据的过滤、排序、分组、去重和分页处理。
- 对象字段的提取、合并、克隆和空值处理。
- 表单提交前的数据清洗和格式转换。
- 接口返回数据的结构转换和默认值处理。
- Vue3 响应式数据的安全拷贝。
- 搜索输入、按钮点击、窗口变化等交互场景中的防抖与节流。
- TypeScript 场景下的工具函数类型约束和泛型使用。

本文档不作为 Lodash ES 的完整 API 手册使用，也不重点讨论 Lodash 的源码实现原理。具体函数的完整参数说明、边界行为和版本差异，应以 Lodash 官方文档和项目实际封装规范为准。

### 技术栈说明

本文档默认项目使用 Vue3、TypeScript 和 Vite 作为基础技术栈，并采用 Lodash ES 作为通用工具函数库。Lodash ES 采用 ES Module 形式导出，适合现代前端构建工具进行静态分析和 Tree Shaking。

推荐技术栈如下：

| 技术         | 说明                                                         |
| ------------ | ------------------------------------------------------------ |
| Vue3         | 前端框架，推荐使用 Composition API 组织业务逻辑              |
| TypeScript   | 提供类型约束，提升工具函数调用的安全性                       |
| Vite         | 前端构建工具，支持 ES Module 和快速开发调试                  |
| Lodash ES    | Lodash 的 ES Module 版本，支持按需引入                       |
| Element Plus | 常见 Vue3 UI 组件库，可与 Lodash ES 配合处理表格、表单和列表数据 |
| Pinia        | Vue3 状态管理工具，可在状态数据处理时结合 Lodash ES 使用     |
| Axios        | HTTP 请求工具，可在接口数据清洗和结构转换时结合 Lodash ES 使用 |

在项目开发中，建议优先使用 Lodash ES 的按需导入方式，只引入当前业务模块需要的函数，避免直接引入整个工具库。这样可以减少无效代码进入最终构建产物，有利于控制生产环境包体积。

推荐使用方式：

```ts
import cloneDeep from 'lodash-es/cloneDeep'
import debounce from 'lodash-es/debounce'
import groupBy from 'lodash-es/groupBy'
import isEmpty from 'lodash-es/isEmpty'
```

不推荐使用方式：

```ts
import _ from 'lodash-es'
```

全量导入虽然使用方便，但容易造成构建产物中包含未使用的工具函数，不利于项目性能优化。对于中大型前端项目，应将 Lodash ES 的使用原则纳入团队代码规范，避免不同模块中出现导入方式不一致的问题。



## Lodash ES 基础

本章节用于说明 Lodash ES 的基础概念，包括它与传统 Lodash 的区别、推荐的引入方式，以及在现代前端构建工具中的 Tree Shaking 支持情况。

### Lodash ES 与 Lodash 的区别

Lodash ES 是 Lodash 的 ES Module 版本，包名为 `lodash-es`。它的核心能力与传统 `lodash` 基本一致，都提供数组、对象、字符串、集合、函数控制、类型判断等常用工具函数。

二者主要区别在于模块规范和构建优化方式不同：

| 对比项         | lodash                                      | lodash-es                        |
| -------------- | ------------------------------------------- | -------------------------------- |
| 包名           | `lodash`                                    | `lodash-es`                      |
| 模块规范       | CommonJS                                    | ES Module                        |
| 适用场景       | Node.js、传统构建项目、兼容性要求较高的项目 | Vue3、Vite、Rollup、现代前端项目 |
| Tree Shaking   | 支持效果依赖构建工具和导入方式              | 更适合 Tree Shaking              |
| 推荐导入方式   | 按函数路径导入                              | 按函数路径导入                   |
| 前端项目推荐度 | 可用，但不作为优先选择                      | 推荐                             |

在 Vue3 和 Vite 项目中，推荐优先使用 `lodash-es`。因为 Vite 默认基于 ES Module 进行开发和构建，`lodash-es` 的模块格式更符合现代前端工程的构建方式。

推荐使用：

```ts
import cloneDeep from 'lodash-es/cloneDeep'
import debounce from 'lodash-es/debounce'
import isEmpty from 'lodash-es/isEmpty'
```

不推荐在业务代码中直接全量导入：

```ts
import _ from 'lodash-es'
```

全量导入会降低代码可读性，也不利于明确当前模块实际依赖了哪些工具函数。即使构建工具能够进行优化，在团队协作中仍然建议使用更清晰的按函数导入方式。

### 按需引入方式

按需引入是 Lodash ES 在前端项目中的推荐使用方式。每个业务模块只导入当前实际使用的函数，可以减少无关依赖进入构建分析流程，也能提升代码的可维护性。

常见的按需引入方式如下：

```ts
import cloneDeep from 'lodash-es/cloneDeep'
import debounce from 'lodash-es/debounce'
import groupBy from 'lodash-es/groupBy'
import orderBy from 'lodash-es/orderBy'
import pick from 'lodash-es/pick'
```

在业务代码中使用时，应尽量让导入函数与当前业务逻辑保持直接关联。例如，在列表页面中处理分组、排序、筛选时，可以只引入对应函数。

```ts
import groupBy from 'lodash-es/groupBy'
import orderBy from 'lodash-es/orderBy'

interface UserItem {
  id: number
  name: string
  role: string
  score: number
}

const userList: UserItem[] = [
  { id: 1, name: '张三', role: 'admin', score: 92 },
  { id: 2, name: '李四', role: 'user', score: 85 },
  { id: 3, name: '王五', role: 'admin', score: 96 }
]

// 按角色分组
const roleGroup = groupBy(userList, 'role')

// 按分数倒序排序
const sortedList = orderBy(userList, ['score'], ['desc'])
```

如果多个页面频繁使用相同工具函数，可以在项目中建立统一的工具封装文件，但不建议将所有 Lodash ES 函数集中导出为一个大对象。过度封装会弱化按需导入的优势，也会增加维护成本。

示例：

```ts
// 文件位置：src/utils/lodash.ts

export { default as cloneDeep } from 'lodash-es/cloneDeep'
export { default as debounce } from 'lodash-es/debounce'
export { default as isEmpty } from 'lodash-es/isEmpty'
export { default as pick } from 'lodash-es/pick'
export { default as omit } from 'lodash-es/omit'
```

业务中使用：

```ts
import { cloneDeep, isEmpty } from '@/utils/lodash'
```

这种方式适合团队希望统一导入路径的场景，但需要控制导出范围，只暴露项目中确实高频使用的函数。

### Tree Shaking 支持

Tree Shaking 是现代构建工具用于移除未使用代码的一种优化能力。`lodash-es` 使用 ES Module 格式导出函数，更适合 Vite、Rollup、Webpack 等构建工具进行静态分析。

在 Vite 项目中，推荐使用以下方式提升 Tree Shaking 效果：

```ts
import cloneDeep from 'lodash-es/cloneDeep'
import isEmpty from 'lodash-es/isEmpty'
```

不建议使用以下方式：

```ts
import * as lodash from 'lodash-es'

const data = lodash.cloneDeep({})
```

虽然 ES Module 理论上支持 Tree Shaking，但具体效果仍然受到导入方式、构建配置、第三方插件和代码写法影响。为了降低不确定性，业务代码应始终优先使用按函数路径导入方式。

Tree Shaking 使用建议：

- 优先使用 `lodash-es/函数名` 的路径导入方式。
- 避免 `import _ from 'lodash-es'` 形式的全量导入。
- 避免将 Lodash ES 所有函数重新导出成统一对象。
- 对公共工具封装保持克制，只封装项目高频使用的函数。
- 打包体积异常时，通过构建分析工具确认 Lodash ES 是否被重复或全量引入。

对于中大型前端项目，建议在代码评审中关注 Lodash ES 的引入方式，避免因为局部代码便利性导致整体构建产物变大。

## 项目安装与配置

本章节用于说明在 Vue3、TypeScript 和 Vite 项目中如何安装 Lodash ES，并处理类型支持和构建配置相关注意事项。

### 依赖安装

在项目中使用 Lodash ES，需要安装 `lodash-es`。如果项目使用 TypeScript，还建议同时安装 `@types/lodash-es`，用于提供类型声明和编辑器提示。

使用 pnpm 安装：

```bash
# 安装 Lodash ES 运行时依赖
pnpm add lodash-es

# 安装 TypeScript 类型声明
pnpm add -D @types/lodash-es
```

使用 npm 安装：

```bash
# 安装 Lodash ES 运行时依赖
npm install lodash-es

# 安装 TypeScript 类型声明
npm install -D @types/lodash-es
```

使用 yarn 安装：

```bash
# 安装 Lodash ES 运行时依赖
yarn add lodash-es

# 安装 TypeScript 类型声明
yarn add -D @types/lodash-es
```

安装完成后，可以在业务代码中直接导入使用：

```ts
import cloneDeep from 'lodash-es/cloneDeep'
import isEmpty from 'lodash-es/isEmpty'

const source = {
  name: 'Vue3',
  config: {
    strict: true
  }
}

const target = cloneDeep(source)

console.log(isEmpty(target))
```

建议将 `lodash-es` 放在 `dependencies` 中，因为它会参与生产环境运行；将 `@types/lodash-es` 放在 `devDependencies` 中，因为它主要用于开发阶段的类型检查和编辑器提示。

### TypeScript 类型支持

在 TypeScript 项目中使用 Lodash ES 时，通常需要安装 `@types/lodash-es` 来获得完整的类型提示。安装后，常用函数可以自动推导参数类型和返回值类型。

示例：

```ts
import pick from 'lodash-es/pick'
import cloneDeep from 'lodash-es/cloneDeep'

interface UserInfo {
  id: number
  username: string
  nickname: string
  password: string
  enabled: boolean
}

const userInfo: UserInfo = {
  id: 1,
  username: 'admin',
  nickname: '管理员',
  password: '123456',
  enabled: true
}

// 提取需要提交或展示的字段
const submitData = pick(userInfo, ['id', 'username', 'enabled'])

// 深拷贝对象，避免直接修改原始数据
const copyData = cloneDeep(userInfo)
```

在使用 TypeScript 时，需要注意部分 Lodash ES 函数的返回值类型可能比较宽泛。对于复杂业务数据，建议主动声明接口类型，避免在后续逻辑中出现类型不明确的问题。

例如，接口数据分组时可以明确声明数据类型：

```ts
import groupBy from 'lodash-es/groupBy'

interface OrderItem {
  id: number
  status: 'pending' | 'paid' | 'closed'
  amount: number
}

const orderList: OrderItem[] = [
  { id: 1, status: 'pending', amount: 100 },
  { id: 2, status: 'paid', amount: 200 },
  { id: 3, status: 'paid', amount: 300 }
]

const orderGroup: Record<string, OrderItem[]> = groupBy(orderList, 'status')
```

对于泛型函数封装，应尽量保留原始数据类型：

```ts
import cloneDeep from 'lodash-es/cloneDeep'

function copyData<T>(data: T): T {
  return cloneDeep(data)
}

const copiedOrder = copyData<OrderItem>({
  id: 1,
  status: 'paid',
  amount: 200
})
```

TypeScript 使用建议：

- 安装 `@types/lodash-es`，保证类型提示完整。
- 复杂数据结构优先定义 `interface` 或 `type`。
- 对分组、映射、深拷贝等操作结果主动声明类型。
- 避免大量使用 `any`，必要时使用泛型保留类型信息。
- 对接口返回数据先进行类型定义，再使用 Lodash ES 处理。

### Vite 构建配置注意事项

在 Vite 项目中，`lodash-es` 通常不需要额外配置即可正常使用。Vite 默认对 ES Module 支持较好，可以直接识别 `lodash-es` 的模块结构。

常规使用方式如下：

```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'

export default defineConfig({
  plugins: [
    vue()
  ],
  resolve: {
    alias: {
      // 配置 @ 指向 src 目录，方便业务代码导入
      '@': path.resolve(__dirname, 'src')
    }
  }
})
```

如果项目中出现依赖预构建异常、开发环境启动慢、依赖解析异常等情况，可以根据实际情况在 `optimizeDeps` 中显式声明需要预构建的依赖。

```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'

export default defineConfig({
  plugins: [
    vue()
  ],
  resolve: {
    alias: {
      // 统一项目源码路径别名
      '@': path.resolve(__dirname, 'src')
    }
  },
  optimizeDeps: {
    include: [
      // 一般情况下无需配置，只有在依赖预构建异常时再显式添加
      'lodash-es'
    ]
  }
})
```

生产构建时，可以使用构建分析工具检查 Lodash ES 的实际打包情况。例如项目接入可视化分析插件后，可以查看是否存在全量引入或重复依赖。

Vite 构建注意事项：

- 正常情况下不需要为 `lodash-es` 添加特殊构建配置。
- 优先从业务代码层面保证按需导入。
- 如果开发环境依赖解析异常，再考虑配置 `optimizeDeps.include`。
- 构建体积异常时，应优先排查是否存在全量导入。
- 避免同时混用 `lodash` 和 `lodash-es`，防止重复依赖进入项目。

## 常用工具函数分类

本章节按照实际开发场景对 Lodash ES 常用函数进行分类说明。项目中不需要一次性掌握所有函数，应优先熟悉数组、对象、字符串、集合、函数控制和类型判断相关函数。

### 数组处理

数组处理是 Lodash ES 使用频率较高的场景，常用于接口数据转换、表格数据处理、下拉选项生成、数据去重、分组和排序。

常用函数包括：

| 函数           | 说明                                                         |
| -------------- | ------------------------------------------------------------ |
| `chunk`        | 将数组拆分为多个指定长度的小数组                             |
| `compact`      | 移除数组中的假值，如 `false`、`0`、`''`、`null`、`undefined`、`NaN` |
| `uniq`         | 数组去重                                                     |
| `uniqBy`       | 按指定字段或规则去重                                         |
| `flatten`      | 展开一层嵌套数组                                             |
| `flattenDeep`  | 深度展开嵌套数组                                             |
| `difference`   | 获取两个数组的差集                                           |
| `intersection` | 获取两个数组的交集                                           |
| `orderBy`      | 按一个或多个字段排序                                         |

示例：

```ts
import uniqBy from 'lodash-es/uniqBy'
import orderBy from 'lodash-es/orderBy'
import chunk from 'lodash-es/chunk'

interface ProductItem {
  id: number
  name: string
  category: string
  price: number
}

const productList: ProductItem[] = [
  { id: 1, name: '键盘', category: 'device', price: 199 },
  { id: 2, name: '鼠标', category: 'device', price: 99 },
  { id: 1, name: '键盘', category: 'device', price: 199 }
]

// 按 id 去重
const uniqueProducts = uniqBy(productList, 'id')

// 按价格倒序排序
const sortedProducts = orderBy(uniqueProducts, ['price'], ['desc'])

// 每页 10 条数据进行分组
const pageGroups = chunk(sortedProducts, 10)
```

数组处理使用建议：

- 简单的 `map`、`filter`、`reduce` 可以优先使用原生 JavaScript。
- 涉及去重、分组、多字段排序时，可以使用 Lodash ES 提升可读性。
- 处理接口数据时，应先判断数据是否为数组，避免异常数据导致页面报错。

### 对象处理

对象处理常用于接口参数组装、表单数据清洗、字段提取、对象合并、深拷贝和默认值处理。

常用函数包括：

| 函数        | 说明                     |
| ----------- | ------------------------ |
| `pick`      | 从对象中提取指定字段     |
| `omit`      | 从对象中排除指定字段     |
| `merge`     | 深度合并对象             |
| `assign`    | 浅合并对象               |
| `cloneDeep` | 深拷贝对象               |
| `get`       | 安全读取对象深层属性     |
| `set`       | 设置对象深层属性         |
| `has`       | 判断对象是否存在指定路径 |
| `defaults`  | 为对象设置默认值         |

示例：

```ts
import pick from 'lodash-es/pick'
import omit from 'lodash-es/omit'
import cloneDeep from 'lodash-es/cloneDeep'
import get from 'lodash-es/get'

interface UserForm {
  id?: number
  username: string
  nickname: string
  password?: string
  roleIds: number[]
}

const formData: UserForm = {
  id: 1,
  username: 'admin',
  nickname: '管理员',
  password: '123456',
  roleIds: [1, 2]
}

// 提交编辑接口时只保留需要的字段
const updateParams = pick(formData, ['id', 'username', 'nickname', 'roleIds'])

// 展示用户信息时排除敏感字段
const displayData = omit(formData, ['password'])

// 深拷贝表单数据，避免直接修改原对象
const copiedForm = cloneDeep(formData)

// 安全读取深层字段，避免空对象访问报错
const firstRoleId = get(formData, 'roleIds[0]', null)
```

对象处理使用建议：

- 表单提交前可以使用 `pick` 控制提交字段。
- 展示数据前可以使用 `omit` 排除敏感字段。
- 读取接口返回的深层嵌套字段时，可以使用 `get` 提高安全性。
- 深拷贝应控制使用范围，避免对大型数据频繁调用 `cloneDeep`。

### 字符串处理

字符串处理常用于搜索关键字处理、字段格式化、命名转换和用户输入清洗。

常用函数包括：

| 函数         | 说明                     |
| ------------ | ------------------------ |
| `trim`       | 去除字符串两端空白字符   |
| `toLower`    | 转小写                   |
| `toUpper`    | 转大写                   |
| `capitalize` | 首字母大写               |
| `camelCase`  | 转小驼峰命名             |
| `kebabCase`  | 转短横线命名             |
| `snakeCase`  | 转下划线命名             |
| `startsWith` | 判断是否以指定字符串开头 |
| `endsWith`   | 判断是否以指定字符串结尾 |

示例：

```ts
import trim from 'lodash-es/trim'
import toLower from 'lodash-es/toLower'
import camelCase from 'lodash-es/camelCase'
import kebabCase from 'lodash-es/kebabCase'

const keyword = '  Admin User  '

// 清理搜索关键字
const searchKeyword = toLower(trim(keyword))

// 转换为小驼峰字段名
const fieldName = camelCase('user_name')

// 转换为短横线命名，常用于 class、文件名或路由片段
const routeName = kebabCase('UserProfilePage')
```

字符串处理使用建议：

- 用户输入内容提交前，可以先使用 `trim` 清理空白字符。
- 搜索场景中，可以结合 `trim` 和 `toLower` 统一比较规则。
- 字段命名转换场景中，可以使用 `camelCase`、`kebabCase`、`snakeCase`。
- 简单字符串拼接、截取、包含判断可以优先使用原生方法。

### 集合处理

集合处理适用于数组对象的遍历、分组、统计、筛选和映射。相比原生方法，Lodash ES 在复杂数据转换场景中可读性更强。

常用函数包括：

| 函数        | 说明                                |
| ----------- | ----------------------------------- |
| `groupBy`   | 按字段或函数结果分组                |
| `keyBy`     | 将集合转换为以指定字段为 key 的对象 |
| `countBy`   | 按字段或函数结果统计数量            |
| `mapValues` | 转换对象中的每个值                  |
| `filter`    | 过滤集合                            |
| `find`      | 查找符合条件的第一项                |
| `some`      | 判断是否存在符合条件的数据          |
| `every`     | 判断是否全部符合条件                |

示例：

```ts
import groupBy from 'lodash-es/groupBy'
import keyBy from 'lodash-es/keyBy'
import countBy from 'lodash-es/countBy'

interface MenuItem {
  id: number
  name: string
  type: 'catalog' | 'menu' | 'button'
  parentId: number
}

const menuList: MenuItem[] = [
  { id: 1, name: '系统管理', type: 'catalog', parentId: 0 },
  { id: 2, name: '用户管理', type: 'menu', parentId: 1 },
  { id: 3, name: '新增用户', type: 'button', parentId: 2 }
]

// 按父级 ID 分组，常用于构建树结构前的数据准备
const parentGroup = groupBy(menuList, 'parentId')

// 按菜单 ID 转为对象，便于快速查找
const menuMap = keyBy(menuList, 'id')

// 按菜单类型统计数量
const typeCount = countBy(menuList, 'type')
```

集合处理使用建议：

- `groupBy` 适合处理分组展示、树结构构建、分类统计等场景。
- `keyBy` 适合将数组转换为字典，提高后续查询效率。
- `countBy` 适合做状态统计、分类统计、类型统计。
- 简单遍历可以使用原生 `map`、`forEach`，复杂转换再使用 Lodash ES。

### 函数控制

函数控制主要用于限制函数执行频率，常见于搜索输入、按钮重复点击、窗口变化、滚动监听等交互场景。

常用函数包括：

| 函数       | 说明                               |
| ---------- | ---------------------------------- |
| `debounce` | 防抖，在连续触发结束后延迟执行     |
| `throttle` | 节流，在固定时间间隔内最多执行一次 |
| `once`     | 函数只执行一次                     |
| `after`    | 函数在调用指定次数后执行           |
| `before`   | 函数在调用指定次数前执行           |

搜索输入防抖示例：

```ts
import debounce from 'lodash-es/debounce'

const handleSearch = debounce((keyword: string) => {
  // 用户停止输入后再触发搜索，减少接口请求次数
  console.log('搜索关键字：', keyword)
}, 300)
```

Vue3 中使用防抖时，应注意组件卸载时取消未执行的防抖任务，避免组件销毁后仍然触发逻辑。

```vue
<template>
  <el-input
    v-model="keyword"
    placeholder="请输入关键字"
    clearable
    @input="handleInput"
  />
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import debounce from 'lodash-es/debounce'

const keyword = ref('')

const searchData = (value: string) => {
  // 这里通常调用接口获取列表数据
  console.log('执行搜索：', value)
}

const handleInput = debounce((value: string) => {
  searchData(value)
}, 300)

onBeforeUnmount(() => {
  // 组件卸载时取消未执行的防抖任务
  handleInput.cancel()
})
</script>
```

滚动或窗口变化节流示例：

```ts
import throttle from 'lodash-es/throttle'

const handleResize = throttle(() => {
  // 限制窗口变化时的执行频率，避免频繁计算布局
  console.log('窗口尺寸发生变化')
}, 500)

window.addEventListener('resize', handleResize)
```

函数控制使用建议：

- 搜索输入、远程查询、表单联想推荐优先使用 `debounce`。
- 滚动监听、窗口变化、拖拽计算优先使用 `throttle`。
- Vue 组件中使用 `debounce` 或 `throttle` 时，应在组件卸载时清理。
- 不要在模板或频繁执行的方法中反复创建防抖函数，否则会导致防抖失效。

### 类型判断

类型判断常用于接口数据校验、表单值判断、异常数据兜底和通用工具函数封装。

常用函数包括：

| 函数            | 说明                             |
| --------------- | -------------------------------- |
| `isArray`       | 判断是否为数组                   |
| `isObject`      | 判断是否为对象                   |
| `isPlainObject` | 判断是否为普通对象               |
| `isString`      | 判断是否为字符串                 |
| `isNumber`      | 判断是否为数字                   |
| `isBoolean`     | 判断是否为布尔值                 |
| `isNil`         | 判断是否为 `null` 或 `undefined` |
| `isEmpty`       | 判断数组、对象、字符串等是否为空 |
| `isFunction`    | 判断是否为函数                   |
| `isDate`        | 判断是否为日期对象               |

示例：

```ts
import isArray from 'lodash-es/isArray'
import isEmpty from 'lodash-es/isEmpty'
import isNil from 'lodash-es/isNil'
import isPlainObject from 'lodash-es/isPlainObject'

interface ApiResult<T> {
  code: number
  message: string
  data: T
}

const normalizeList = <T>(value: unknown): T[] => {
  if (isArray(value)) {
    return value as T[]
  }

  return []
}

const isValidObject = (value: unknown): boolean => {
  return isPlainObject(value) && !isEmpty(value)
}

const getDefaultText = (value: unknown): string => {
  if (isNil(value)) {
    return '-'
  }

  return String(value)
}
```

在接口数据处理时，可以先使用类型判断函数进行兜底处理：

```ts
import isArray from 'lodash-es/isArray'
import isPlainObject from 'lodash-es/isPlainObject'

interface UserItem {
  id: number
  username: string
}

const handleUserResponse = (data: unknown): UserItem[] => {
  if (!isArray(data)) {
    return []
  }

  return data.filter((item): item is UserItem => {
    return isPlainObject(item)
      && typeof item.id === 'number'
      && typeof item.username === 'string'
  })
}
```

类型判断使用建议：

- 接口返回值不可信时，应先进行类型判断再执行业务逻辑。
- 判断 `null` 和 `undefined` 时，优先使用 `isNil`。
- 判断普通对象时，优先使用 `isPlainObject`，避免数组、函数、日期对象被误判。
- 使用 `isEmpty` 时要注意语义，它会认为空数组、空对象、空字符串都为空。
- 在 TypeScript 中，复杂数据校验仍应结合类型守卫或接口定义使用。



## Vue3 中的使用场景

本章节用于说明 Lodash ES 在 Vue3 项目中的典型使用方式，重点覆盖组件数据处理、表单数据清洗、列表过滤与排序、响应式数据拷贝、防抖与节流等高频业务场景。

### 组件数据处理

在 Vue3 组件中，Lodash ES 常用于处理接口返回数据、组件入参数据、下拉选项数据和表格展示数据。对于简单的 `map`、`filter`、`find` 等逻辑，可以优先使用原生 JavaScript；当涉及分组、排序、字段提取、深层属性读取等场景时，可以使用 Lodash ES 提高代码可读性。

文件位置：`src/views/user/UserList.vue`

以下示例用于在 Vue3 页面中处理用户列表数据，包括按状态分组、提取下拉选项和安全读取字段。

```vue
<template>
  <div class="p-4">
    <el-card>
      <template #header>
        <span>用户列表</span>
      </template>

      <el-space class="mb-4">
        <el-select v-model="currentStatus" placeholder="请选择状态" clearable>
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-space>

      <el-table :data="displayList" border>
        <el-table-column prop="id" label="ID" width="100" />
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="nickname" label="昵称" />
        <el-table-column prop="status" label="状态" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import groupBy from 'lodash-es/groupBy'
import get from 'lodash-es/get'
import uniqBy from 'lodash-es/uniqBy'

interface UserItem {
  id: number
  username: string
  nickname: string
  status: 'enabled' | 'disabled'
  profile?: {
    email?: string
  }
}

interface SelectOption {
  label: string
  value: string
}

const currentStatus = ref<string>()

const userList = ref<UserItem[]>([
  {
    id: 1,
    username: 'admin',
    nickname: '管理员',
    status: 'enabled',
    profile: {
      email: 'admin@example.com'
    }
  },
  {
    id: 2,
    username: 'test',
    nickname: '测试用户',
    status: 'disabled'
  }
])

// 按状态分组，适合后续统计或分组展示
const userGroup = computed(() => {
  return groupBy(userList.value, 'status')
})

// 生成状态下拉选项，并按状态去重
const statusOptions = computed<SelectOption[]>(() => {
  return uniqBy(userList.value, 'status').map((item) => {
    return {
      label: item.status === 'enabled' ? '启用' : '禁用',
      value: item.status
    }
  })
})

// 根据筛选条件展示数据
const displayList = computed(() => {
  if (!currentStatus.value) {
    return userList.value
  }

  return userList.value.filter((item) => item.status === currentStatus.value)
})

// 安全读取用户邮箱，避免 profile 为空时报错
const firstUserEmail = computed(() => {
  return get(userList.value, '[0].profile.email', '-')
})

console.log(userGroup.value, firstUserEmail.value)
</script>
```

组件数据处理时，应避免在模板中直接编写复杂的数据转换逻辑。推荐将数据处理放在 `computed`、工具函数或组合式函数中，保证模板结构清晰。

### 表单数据清洗

表单数据清洗通常发生在提交接口之前，用于移除无效字段、排除敏感字段、处理空字符串、控制提交字段范围等。Lodash ES 中的 `pick`、`omit`、`trim`、`isNil`、`cloneDeep` 等函数适合用于这类场景。

文件位置：`src/views/user/UserForm.vue`

以下示例用于提交用户表单前清洗数据，只保留后端接口需要的字段，并处理字符串前后空格。

```vue
<template>
  <div class="p-4">
    <el-card>
      <el-form :model="formData" label-width="100px">
        <el-form-item label="用户名">
          <el-input v-model="formData.username" placeholder="请输入用户名" />
        </el-form-item>

        <el-form-item label="昵称">
          <el-input v-model="formData.nickname" placeholder="请输入昵称" />
        </el-form-item>

        <el-form-item label="密码">
          <el-input v-model="formData.password" placeholder="请输入密码" show-password />
        </el-form-item>

        <el-form-item label="角色">
          <el-select v-model="formData.roleIds" multiple placeholder="请选择角色">
            <el-option label="管理员" :value="1" />
            <el-option label="普通用户" :value="2" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSubmit">提交</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import cloneDeep from 'lodash-es/cloneDeep'
import pick from 'lodash-es/pick'
import trim from 'lodash-es/trim'
import isNil from 'lodash-es/isNil'

interface UserForm {
  id?: number
  username: string
  nickname: string
  password?: string
  roleIds: number[]
  remark?: string
}

interface UserSubmitParams {
  id?: number
  username: string
  nickname: string
  password?: string
  roleIds: number[]
}

const formData = reactive<UserForm>({
  username: '',
  nickname: '',
  password: '',
  roleIds: []
})

const cleanFormData = (data: UserForm): UserSubmitParams => {
  const copiedData = cloneDeep(data)

  // 统一处理字符串空格，避免用户误输入影响接口数据
  copiedData.username = trim(copiedData.username)
  copiedData.nickname = trim(copiedData.nickname)

  if (!isNil(copiedData.password)) {
    copiedData.password = trim(copiedData.password)
  }

  // 只保留接口允许提交的字段
  return pick(copiedData, ['id', 'username', 'nickname', 'password', 'roleIds'])
}

const handleSubmit = async () => {
  const submitParams = cleanFormData(formData)

  // 这里通常调用接口，例如 await createUserApi(submitParams)
  console.log('提交参数：', submitParams)
}
</script>
```

表单数据清洗建议放在提交方法内部或单独的工具函数中，不建议直接修改原始表单对象。这样可以减少表单回显、重置、编辑状态切换时的数据污染问题。

### 列表过滤与排序

列表过滤与排序是中后台项目中非常常见的场景。Lodash ES 的 `orderBy`、`filter`、`includes`、`toLower`、`trim` 等函数可以用于实现本地搜索、多字段排序和条件过滤。

文件位置：`src/views/order/OrderList.vue`

以下示例用于实现订单列表的关键字过滤、状态过滤和多字段排序。

```vue
<template>
  <div class="p-4">
    <el-card>
      <el-space class="mb-4">
        <el-input
          v-model="queryParams.keyword"
          placeholder="请输入订单号"
          clearable
        />

        <el-select
          v-model="queryParams.status"
          placeholder="请选择状态"
          clearable
        >
          <el-option label="待支付" value="pending" />
          <el-option label="已支付" value="paid" />
          <el-option label="已关闭" value="closed" />
        </el-select>
      </el-space>

      <el-table :data="displayList" border>
        <el-table-column prop="orderNo" label="订单号" />
        <el-table-column prop="status" label="状态" />
        <el-table-column prop="amount" label="金额" />
        <el-table-column prop="createTime" label="创建时间" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import orderBy from 'lodash-es/orderBy'
import trim from 'lodash-es/trim'
import toLower from 'lodash-es/toLower'
import includes from 'lodash-es/includes'

interface OrderItem {
  id: number
  orderNo: string
  status: 'pending' | 'paid' | 'closed'
  amount: number
  createTime: string
}

interface QueryParams {
  keyword?: string
  status?: OrderItem['status']
}

const queryParams = reactive<QueryParams>({
  keyword: '',
  status: undefined
})

const orderList = ref<OrderItem[]>([
  {
    id: 1,
    orderNo: 'ORDER_20240501001',
    status: 'paid',
    amount: 299,
    createTime: '2024-05-01 10:00:00'
  },
  {
    id: 2,
    orderNo: 'ORDER_20240501002',
    status: 'pending',
    amount: 99,
    createTime: '2024-05-01 11:00:00'
  },
  {
    id: 3,
    orderNo: 'ORDER_20240501003',
    status: 'closed',
    amount: 199,
    createTime: '2024-05-01 12:00:00'
  }
])

const displayList = computed(() => {
  const keyword = toLower(trim(queryParams.keyword || ''))

  const filteredList = orderList.value.filter((item) => {
    const matchedKeyword = !keyword || includes(toLower(item.orderNo), keyword)
    const matchedStatus = !queryParams.status || item.status === queryParams.status

    return matchedKeyword && matchedStatus
  })

  // 先按创建时间倒序，再按金额倒序
  return orderBy(filteredList, ['createTime', 'amount'], ['desc', 'desc'])
})
</script>
```

对于数据量较小的本地列表，可以在前端完成过滤和排序；对于数据量较大的列表，应优先通过后端接口分页、过滤和排序，前端只负责参数组装和结果展示。

### 响应式数据拷贝

在 Vue3 中，`reactive` 和 `ref` 创建的数据具有响应式代理。如果直接对响应式对象使用深拷贝或传给第三方库处理，可能出现代理对象被保留、数据结构不符合预期等问题。

处理响应式数据拷贝时，推荐结合 Vue 的 `toRaw` 和 Lodash ES 的 `cloneDeep` 使用。

文件位置：`src/views/profile/ProfileEditor.vue`

以下示例用于在编辑弹窗中拷贝响应式数据，避免直接修改原始对象。

```vue
<template>
  <div class="p-4">
    <el-card>
      <el-descriptions title="用户信息" border>
        <el-descriptions-item label="用户名">
          {{ userInfo.username }}
        </el-descriptions-item>
        <el-descriptions-item label="昵称">
          {{ userInfo.nickname }}
        </el-descriptions-item>
      </el-descriptions>

      <el-button class="mt-4" type="primary" @click="openEditDialog">
        编辑
      </el-button>
    </el-card>

    <el-dialog v-model="dialogVisible" title="编辑用户" width="500px">
      <el-form :model="editForm" label-width="100px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" />
        </el-form-item>

        <el-form-item label="昵称">
          <el-input v-model="editForm.nickname" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, toRaw } from 'vue'
import cloneDeep from 'lodash-es/cloneDeep'
import assign from 'lodash-es/assign'

interface UserInfo {
  id: number
  username: string
  nickname: string
}

const dialogVisible = ref(false)

const userInfo = reactive<UserInfo>({
  id: 1,
  username: 'admin',
  nickname: '管理员'
})

const editForm = reactive<UserInfo>({
  id: 0,
  username: '',
  nickname: ''
})

const openEditDialog = () => {
  // 先通过 toRaw 获取原始对象，再进行深拷贝
  const copiedData = cloneDeep(toRaw(userInfo))

  assign(editForm, copiedData)
  dialogVisible.value = true
}

const handleConfirm = () => {
  // 确认时再写回原始响应式对象
  assign(userInfo, cloneDeep(toRaw(editForm)))
  dialogVisible.value = false
}
</script>
```

响应式数据拷贝使用建议：

- 不要直接把响应式对象作为接口提交参数，建议先转换为普通对象。
- 编辑弹窗、详情编辑、草稿数据等场景，推荐使用 `cloneDeep(toRaw(data))`。
- 深拷贝只在必要场景使用，避免对大型列表频繁执行。
- 对简单的一层对象，可以优先使用展开运算符或 `assign`。

### 防抖与节流处理

防抖和节流主要用于控制函数执行频率。防抖适用于搜索输入、远程联想、表单自动保存等场景；节流适用于滚动监听、窗口变化、拖拽计算等高频触发场景。

文件位置：`src/views/search/SearchPage.vue`

以下示例用于搜索输入防抖，在用户停止输入后再触发查询。

```vue
<template>
  <div class="p-4">
    <el-card>
      <el-input
        v-model="keyword"
        placeholder="请输入关键字"
        clearable
        @input="handleInput"
      />

      <el-table class="mt-4" :data="resultList" border>
        <el-table-column prop="id" label="ID" width="100" />
        <el-table-column prop="name" label="名称" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import debounce from 'lodash-es/debounce'

interface SearchItem {
  id: number
  name: string
}

const keyword = ref('')
const resultList = ref<SearchItem[]>([])

const searchData = async (value: string) => {
  // 这里通常调用远程搜索接口
  console.log('搜索关键字：', value)

  resultList.value = [
    {
      id: 1,
      name: `搜索结果：${value}`
    }
  ]
}

const handleInput = debounce((value: string) => {
  searchData(value)
}, 300)

onBeforeUnmount(() => {
  // 组件销毁时取消未执行的防抖任务
  handleInput.cancel()
})
</script>
```

文件位置：`src/views/dashboard/DashboardPage.vue`

以下示例用于窗口尺寸变化节流，避免频繁触发布局计算。

```vue
<template>
  <div class="p-4">
    <el-card>
      <p>窗口宽度：{{ windowWidth }}</p>
      <p>窗口高度：{{ windowHeight }}</p>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import throttle from 'lodash-es/throttle'

const windowWidth = ref(window.innerWidth)
const windowHeight = ref(window.innerHeight)

const updateWindowSize = throttle(() => {
  windowWidth.value = window.innerWidth
  windowHeight.value = window.innerHeight
}, 300)

onMounted(() => {
  window.addEventListener('resize', updateWindowSize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateWindowSize)
  updateWindowSize.cancel()
})
</script>
```

防抖与节流使用建议：

- 输入框远程搜索使用 `debounce`。
- 滚动、拖拽、窗口变化使用 `throttle`。
- 在 Vue 组件中，应在 `onBeforeUnmount` 中调用 `cancel()`。
- 不要在模板表达式或频繁执行的方法中动态创建防抖函数。
- 防抖函数应在组件初始化阶段创建，保证多次触发复用同一个函数实例。

## TypeScript 使用规范

本章节用于说明 Lodash ES 在 TypeScript 项目中的使用规范，包括函数参数类型声明、返回值类型推导、泛型场景处理以及类型安全注意事项。

### 函数参数类型声明

在 TypeScript 项目中使用 Lodash ES 时，应优先为业务数据定义明确的接口类型，避免直接使用 `any`。清晰的参数类型可以提升编辑器提示、减少运行时错误，并让数据转换逻辑更容易维护。

以下示例用于对用户列表进行分组，并通过接口声明约束入参结构。

```ts
import groupBy from 'lodash-es/groupBy'

interface UserItem {
  id: number
  username: string
  deptId: number
  enabled: boolean
}

const groupUserByDept = (userList: UserItem[]): Record<string, UserItem[]> => {
  return groupBy(userList, 'deptId')
}

const users: UserItem[] = [
  {
    id: 1,
    username: 'admin',
    deptId: 100,
    enabled: true
  },
  {
    id: 2,
    username: 'test',
    deptId: 200,
    enabled: false
  }
]

const userGroup = groupUserByDept(users)
```

如果函数参数来自接口返回值，建议先进行基础校验或兜底处理，再传入 Lodash ES 函数。

```ts
import isArray from 'lodash-es/isArray'
import orderBy from 'lodash-es/orderBy'

interface ProductItem {
  id: number
  name: string
  price: number
}

const sortProductList = (data: unknown): ProductItem[] => {
  if (!isArray(data)) {
    return []
  }

  return orderBy(data as ProductItem[], ['price'], ['desc'])
}
```

参数类型声明使用建议：

- 业务对象优先使用 `interface` 或 `type` 定义。
- 工具函数入参不要直接使用 `any`。
- 接口返回值如果类型不确定，可以先使用 `unknown`，再进行类型判断。
- 对外暴露的公共函数必须声明参数类型。
- 组件内部简单逻辑可以依赖类型推导，但核心数据结构仍建议显式声明。

### 返回值类型推导

Lodash ES 的部分函数可以根据入参自动推导返回值类型，例如 `cloneDeep`、`map`、`filter` 等。但在业务代码中，如果函数作为公共工具、组合式函数或接口数据转换函数使用，建议显式声明返回值类型。

以下示例用于清洗查询参数，并明确返回接口需要的参数结构。

```ts
import pickBy from 'lodash-es/pickBy'
import isNil from 'lodash-es/isNil'
import trim from 'lodash-es/trim'

interface UserQueryForm {
  username?: string
  status?: string
  pageNum: number
  pageSize: number
}

interface UserQueryParams {
  username?: string
  status?: string
  pageNum: number
  pageSize: number
}

const buildUserQueryParams = (form: UserQueryForm): UserQueryParams => {
  const params: UserQueryParams = {
    username: form.username ? trim(form.username) : undefined,
    status: form.status,
    pageNum: form.pageNum,
    pageSize: form.pageSize
  }

  return pickBy(params, (value) => !isNil(value) && value !== '') as UserQueryParams
}
```

以下示例用于深拷贝数据，返回值类型由泛型保留。

```ts
import cloneDeep from 'lodash-es/cloneDeep'

const copyValue = <T>(value: T): T => {
  return cloneDeep(value)
}

interface RoleItem {
  id: number
  roleName: string
}

const role: RoleItem = {
  id: 1,
  roleName: '管理员'
}

const copiedRole = copyValue(role)
```

返回值类型使用建议：

- 组件内部简单计算可以依赖 TypeScript 自动推导。
- 公共工具函数建议显式声明返回值类型。
- 涉及接口参数、接口响应、表单转换时，应明确返回结构。
- 使用 `pickBy`、`groupBy`、`keyBy` 等函数时，必要时补充类型声明。
- 不要为了省事直接将返回值声明为 `any`。

### 泛型场景处理

泛型适合用于封装通用数据处理函数，例如深拷贝、列表转 Map、字段提取、分页结果转换等。合理使用泛型可以在复用工具函数的同时保留业务数据类型。

以下示例用于封装通用深拷贝函数。

```ts
import cloneDeep from 'lodash-es/cloneDeep'

export const deepCopy = <T>(data: T): T => {
  return cloneDeep(data)
}
```

以下示例用于将数组按照指定字段转换为 Map 对象。

```ts
import keyBy from 'lodash-es/keyBy'

type PropertyKeyValue = string | number | symbol

export const listToMap = <T extends Record<string, unknown>>(
  list: T[],
  key: keyof T
): Record<PropertyKeyValue, T> => {
  return keyBy(list, key as string) as Record<PropertyKeyValue, T>
}

interface DictItem {
  id: number
  label: string
  value: string
}

const dictList: DictItem[] = [
  {
    id: 1,
    label: '启用',
    value: 'enabled'
  },
  {
    id: 2,
    label: '禁用',
    value: 'disabled'
  }
]

const dictMap = listToMap(dictList, 'id')
```

以下示例用于封装分页结果转换函数，保留列表项类型。

```ts
interface PageResult<T> {
  list: T[]
  total: number
  pageNum: number
  pageSize: number
}

interface PageResponse<T> {
  records?: T[]
  total?: number
  current?: number
  size?: number
}

export const normalizePageResult = <T>(response: PageResponse<T>): PageResult<T> => {
  return {
    list: response.records || [],
    total: response.total || 0,
    pageNum: response.current || 1,
    pageSize: response.size || 10
  }
}
```

泛型使用建议：

- 通用工具函数优先使用泛型保留入参与返回值类型。
- 泛型约束应尽量明确，不要无条件使用 `T extends any`。
- 对对象字段操作时，可以使用 `keyof T` 限制字段名。
- 对接口分页、字典、树结构等通用模型，可以通过泛型提高复用性。
- 如果类型断言不可避免，应控制在工具函数内部，不要扩散到业务代码中。

### 类型安全注意事项

Lodash ES 可以提高数据处理效率，但不能替代 TypeScript 类型系统，也不能替代接口数据校验。尤其是在处理后端接口返回值、用户输入、动态 JSON、缓存数据时，应先考虑数据是否可信。

以下示例用于处理不可信的接口数据，先判断类型，再进入业务逻辑。

```ts
import isArray from 'lodash-es/isArray'
import isPlainObject from 'lodash-es/isPlainObject'
import isString from 'lodash-es/isString'
import isNumber from 'lodash-es/isNumber'

interface UserItem {
  id: number
  username: string
}

const isUserItem = (value: unknown): value is UserItem => {
  if (!isPlainObject(value)) {
    return false
  }

  const item = value as Record<string, unknown>

  return isNumber(item.id) && isString(item.username)
}

const normalizeUserList = (data: unknown): UserItem[] => {
  if (!isArray(data)) {
    return []
  }

  return data.filter(isUserItem)
}
```

以下示例用于安全读取对象深层属性，同时给出默认值。

```ts
import get from 'lodash-es/get'

interface UserDetail {
  id: number
  username: string
  profile?: {
    email?: string
    phone?: string
  }
}

const getUserEmail = (user: UserDetail): string => {
  return get(user, 'profile.email', '-')
}
```

类型安全使用建议：

- 接口返回值不确定时，优先使用 `unknown` 而不是 `any`。
- 使用 Lodash ES 处理数据前，应确认数据结构是否符合预期。
- `get` 可以避免深层读取报错，但不能保证字段类型一定正确。
- `isEmpty` 判断范围较广，使用前要明确业务语义。
- `cloneDeep` 会复制数据，但不会修复错误的数据结构。
- 对复杂表单、动态 JSON 和后端不稳定字段，建议配合类型守卫或数据校验库使用。
- 在公共工具函数中使用类型断言时，应尽量将断言封装在内部，并提供稳定的返回类型。

在 TypeScript 项目中，Lodash ES 的定位应是辅助数据处理，而不是替代类型设计。推荐先定义清晰的数据结构，再使用 Lodash ES 完成数据转换、清洗、分组、排序和兜底处理。



## 实际开发示例

本章节结合 Vue3、TypeScript、Vite 和 Element Plus 项目中的常见业务场景，给出 Lodash ES 的实际使用示例。示例重点关注列表数据分组、对象字段提取、响应式数据深拷贝、搜索输入防抖和表格数据排序。

### 列表数据分组

列表数据分组常用于菜单分类、订单状态统计、用户部门分组、字典数据整理等场景。Lodash ES 的 `groupBy` 可以根据指定字段或函数返回值快速完成分组。

文件位置：`src/views/order/OrderGroupDemo.vue`

以下示例用于将订单列表按照订单状态进行分组，并统计不同状态下的订单数量。

```vue
<template>
  <div class="p-4">
    <el-card>
      <template #header>
        <span>订单分组统计</span>
      </template>

      <el-row :gutter="16">
        <el-col
          v-for="item in statusSummary"
          :key="item.status"
          :span="8"
        >
          <el-card shadow="hover">
            <div class="text-lg font-bold">{{ item.label }}</div>
            <div class="mt-2 text-gray-500">订单数量：{{ item.count }}</div>
          </el-card>
        </el-col>
      </el-row>

      <el-divider />

      <el-table :data="orderList" border>
        <el-table-column prop="orderNo" label="订单号" />
        <el-table-column prop="status" label="状态" />
        <el-table-column prop="amount" label="金额" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import groupBy from 'lodash-es/groupBy'

interface OrderItem {
  id: number
  orderNo: string
  status: 'pending' | 'paid' | 'closed'
  amount: number
}

interface StatusSummary {
  status: OrderItem['status']
  label: string
  count: number
}

const orderList = ref<OrderItem[]>([
  { id: 1, orderNo: 'ORDER_001', status: 'pending', amount: 100 },
  { id: 2, orderNo: 'ORDER_002', status: 'paid', amount: 200 },
  { id: 3, orderNo: 'ORDER_003', status: 'paid', amount: 300 },
  { id: 4, orderNo: 'ORDER_004', status: 'closed', amount: 400 }
])

const statusLabelMap: Record<OrderItem['status'], string> = {
  pending: '待支付',
  paid: '已支付',
  closed: '已关闭'
}

const statusSummary = computed<StatusSummary[]>(() => {
  const statusGroup = groupBy(orderList.value, 'status')

  return Object.entries(statusGroup).map(([status, list]) => {
    const orderStatus = status as OrderItem['status']

    return {
      status: orderStatus,
      label: statusLabelMap[orderStatus],
      count: list.length
    }
  })
})
</script>
```

在实际项目中，如果分组逻辑只用于当前页面，可以直接放在 `computed` 中；如果多个页面都需要使用同类分组逻辑，建议抽取为独立工具函数或组合式函数。

### 对象字段提取

对象字段提取常用于接口提交、详情展示、权限数据处理和敏感字段过滤。Lodash ES 的 `pick` 适合保留指定字段，`omit` 适合排除指定字段。

文件位置：`src/utils/user-data.ts`

以下示例用于清洗用户表单数据，只保留接口允许提交的字段，同时排除页面展示时不应该暴露的敏感字段。

```ts
import pick from 'lodash-es/pick'
import omit from 'lodash-es/omit'
import trim from 'lodash-es/trim'

export interface UserForm {
  id?: number
  username: string
  nickname: string
  password?: string
  phone?: string
  email?: string
  roleIds: number[]
  createTime?: string
  updateTime?: string
}

export interface UserSubmitParams {
  id?: number
  username: string
  nickname: string
  password?: string
  phone?: string
  email?: string
  roleIds: number[]
}

export const buildUserSubmitParams = (form: UserForm): UserSubmitParams => {
  const cleanedForm: UserForm = {
    ...form,
    username: trim(form.username),
    nickname: trim(form.nickname),
    password: form.password ? trim(form.password) : undefined,
    phone: form.phone ? trim(form.phone) : undefined,
    email: form.email ? trim(form.email) : undefined
  }

  return pick(cleanedForm, [
    'id',
    'username',
    'nickname',
    'password',
    'phone',
    'email',
    'roleIds'
  ])
}

export const buildUserDisplayData = (user: UserForm) => {
  return omit(user, ['password'])
}
```

文件位置：`src/views/user/UserSubmitDemo.vue`

以下示例用于在 Vue3 页面中调用字段提取工具函数，提交前生成干净的接口参数。

```vue
<template>
  <div class="p-4">
    <el-card>
      <el-form :model="formData" label-width="100px">
        <el-form-item label="用户名">
          <el-input v-model="formData.username" />
        </el-form-item>

        <el-form-item label="昵称">
          <el-input v-model="formData.nickname" />
        </el-form-item>

        <el-form-item label="手机号">
          <el-input v-model="formData.phone" />
        </el-form-item>

        <el-form-item label="邮箱">
          <el-input v-model="formData.email" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSubmit">提交</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { buildUserSubmitParams, type UserForm } from '@/utils/user-data'

const formData = reactive<UserForm>({
  username: '',
  nickname: '',
  password: '',
  phone: '',
  email: '',
  roleIds: []
})

const handleSubmit = async () => {
  const submitParams = buildUserSubmitParams(formData)

  // 这里通常调用接口，例如 await saveUserApi(submitParams)
  console.log('用户提交参数：', submitParams)
}
</script>
```

对象字段提取建议集中在提交参数构建阶段处理，不建议在接口调用处临时拼接大量字段。这样可以降低接口字段变更时的维护成本。

### 深拷贝响应式数据

在 Vue3 中，响应式对象通常由 `reactive` 或 `ref` 创建。如果直接修改响应式对象，可能影响原始数据、表单回显或列表状态。对于编辑弹窗、详情复制、草稿缓存等场景，可以使用 `toRaw` 配合 `cloneDeep` 生成独立数据副本。

文件位置：`src/views/user/UserEditDialogDemo.vue`

以下示例用于打开编辑弹窗时复制当前行数据，用户点击确定后再写回原始对象。

```vue
<template>
  <div class="p-4">
    <el-card>
      <el-table :data="userList" border>
        <el-table-column prop="id" label="ID" width="100" />
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="nickname" label="昵称" />
        <el-table-column label="操作" width="160">
          <template #default="{ row }">
            <el-button type="primary" link @click="openEditDialog(row)">
              编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" title="编辑用户" width="500px">
      <el-form :model="editForm" label-width="100px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" />
        </el-form-item>

        <el-form-item label="昵称">
          <el-input v-model="editForm.nickname" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, toRaw } from 'vue'
import cloneDeep from 'lodash-es/cloneDeep'
import assign from 'lodash-es/assign'
import findIndex from 'lodash-es/findIndex'

interface UserItem {
  id: number
  username: string
  nickname: string
}

const dialogVisible = ref(false)

const userList = ref<UserItem[]>([
  { id: 1, username: 'admin', nickname: '管理员' },
  { id: 2, username: 'test', nickname: '测试用户' }
])

const editForm = reactive<UserItem>({
  id: 0,
  username: '',
  nickname: ''
})

const openEditDialog = (row: UserItem) => {
  const copiedRow = cloneDeep(toRaw(row))

  assign(editForm, copiedRow)
  dialogVisible.value = true
}

const handleConfirm = () => {
  const index = findIndex(userList.value, { id: editForm.id })

  if (index === -1) {
    dialogVisible.value = false
    return
  }

  userList.value[index] = cloneDeep(toRaw(editForm))
  dialogVisible.value = false
}
</script>
```

深拷贝响应式数据时，需要注意 `cloneDeep` 只负责复制数据，不负责处理业务校验。对于表单提交，还应配合字段清洗、必填校验和接口参数转换。

### 搜索输入防抖

搜索输入防抖适用于远程搜索、表格查询、联想输入、下拉远程加载等场景。使用 `debounce` 可以避免用户每输入一个字符就触发一次接口请求。

文件位置：`src/views/product/ProductSearchDemo.vue`

以下示例用于实现商品名称远程搜索，输入停止 300 毫秒后再执行查询。

```vue
<template>
  <div class="p-4">
    <el-card>
      <el-input
        v-model="keyword"
        placeholder="请输入商品名称"
        clearable
        @input="handleInput"
        @clear="handleClear"
      />

      <el-table class="mt-4" :data="productList" border>
        <el-table-column prop="id" label="ID" width="100" />
        <el-table-column prop="name" label="商品名称" />
        <el-table-column prop="price" label="价格" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import debounce from 'lodash-es/debounce'
import trim from 'lodash-es/trim'

interface ProductItem {
  id: number
  name: string
  price: number
}

const keyword = ref('')
const productList = ref<ProductItem[]>([])

const searchProductList = async (value: string) => {
  const searchKeyword = trim(value)

  if (!searchKeyword) {
    productList.value = []
    return
  }

  // 这里通常调用接口，例如 await searchProductApi({ keyword: searchKeyword })
  productList.value = [
    {
      id: 1,
      name: `商品：${searchKeyword}`,
      price: 99
    }
  ]
}

const handleInput = debounce((value: string) => {
  searchProductList(value)
}, 300)

const handleClear = () => {
  handleInput.cancel()
  productList.value = []
}

onBeforeUnmount(() => {
  handleInput.cancel()
})
</script>
```

防抖函数应在组件初始化时创建，并在组件卸载时取消。不要在 `watch`、模板表达式或普通方法内部反复创建新的防抖函数实例，否则会导致防抖失效。

### 表格数据排序

表格数据排序常用于本地数据展示、报表页面、前端聚合数据和少量静态列表。Lodash ES 的 `orderBy` 支持多字段排序，也支持分别指定升序和降序。

文件位置：`src/views/product/ProductTableSortDemo.vue`

以下示例用于根据商品价格和库存进行本地排序。

```vue
<template>
  <div class="p-4">
    <el-card>
      <el-space class="mb-4">
        <el-select v-model="sortField" placeholder="排序字段">
          <el-option label="价格" value="price" />
          <el-option label="库存" value="stock" />
          <el-option label="创建时间" value="createTime" />
        </el-select>

        <el-select v-model="sortOrder" placeholder="排序方式">
          <el-option label="升序" value="asc" />
          <el-option label="降序" value="desc" />
        </el-select>
      </el-space>

      <el-table :data="sortedList" border>
        <el-table-column prop="id" label="ID" width="100" />
        <el-table-column prop="name" label="商品名称" />
        <el-table-column prop="price" label="价格" />
        <el-table-column prop="stock" label="库存" />
        <el-table-column prop="createTime" label="创建时间" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import orderBy from 'lodash-es/orderBy'

interface ProductItem {
  id: number
  name: string
  price: number
  stock: number
  createTime: string
}

type SortField = 'price' | 'stock' | 'createTime'
type SortOrder = 'asc' | 'desc'

const sortField = ref<SortField>('price')
const sortOrder = ref<SortOrder>('desc')

const productList = ref<ProductItem[]>([
  { id: 1, name: '键盘', price: 199, stock: 20, createTime: '2024-05-01 10:00:00' },
  { id: 2, name: '鼠标', price: 99, stock: 50, createTime: '2024-05-02 10:00:00' },
  { id: 3, name: '显示器', price: 899, stock: 10, createTime: '2024-05-03 10:00:00' }
])

const sortedList = computed(() => {
  return orderBy(productList.value, [sortField.value], [sortOrder.value])
})
</script>
```

对于后端分页表格，不建议在前端对当前页数据进行最终排序。应将排序字段和排序方向传给后端，由后端基于完整数据集排序后返回结果。

## 代码规范与最佳实践

本章节用于统一 Lodash ES 在团队项目中的使用规范，重点关注导入方式、打包体积、深拷贝边界和业务代码可读性。

### 优先按需引入

项目中应优先使用按函数路径引入方式，只导入当前文件实际使用的函数。

推荐写法：

```ts
import cloneDeep from 'lodash-es/cloneDeep'
import debounce from 'lodash-es/debounce'
import groupBy from 'lodash-es/groupBy'
import orderBy from 'lodash-es/orderBy'
```

这种方式可以让当前文件依赖关系更清晰，也更利于构建工具进行静态分析。代码评审时，应重点检查是否存在不必要的全量导入。

如果团队希望统一导入路径，可以建立轻量封装文件，但只建议导出项目高频使用的函数。

文件位置：`src/utils/lodash.ts`

以下示例用于统一导出项目常用 Lodash ES 函数，避免业务模块随意引入。

```ts
export { default as cloneDeep } from 'lodash-es/cloneDeep'
export { default as debounce } from 'lodash-es/debounce'
export { default as throttle } from 'lodash-es/throttle'
export { default as groupBy } from 'lodash-es/groupBy'
export { default as orderBy } from 'lodash-es/orderBy'
export { default as pick } from 'lodash-es/pick'
export { default as omit } from 'lodash-es/omit'
export { default as isEmpty } from 'lodash-es/isEmpty'
export { default as isNil } from 'lodash-es/isNil'
```

业务代码中可以这样使用：

```ts
import { cloneDeep, isEmpty } from '@/utils/lodash'
```

如果使用统一封装文件，需要避免将全部 Lodash ES 函数无差别导出，否则会削弱按需引入的管理价值。

### 避免全量导入

业务代码中不推荐全量导入 Lodash ES。

不推荐写法：

```ts
import _ from 'lodash-es'

const copiedData = _.cloneDeep({})
const empty = _.isEmpty([])
```

也不推荐使用命名空间导入：

```ts
import * as lodash from 'lodash-es'

const copiedData = lodash.cloneDeep({})
```

全量导入的问题主要包括：

- 当前文件实际使用的函数不清晰。
- 代码可读性和可维护性下降。
- Tree Shaking 效果容易受构建配置和写法影响。
- 容易让团队成员继续扩散 `_` 风格写法。
- 打包体积异常时排查成本更高。

推荐替换为：

```ts
import cloneDeep from 'lodash-es/cloneDeep'
import isEmpty from 'lodash-es/isEmpty'

const copiedData = cloneDeep({})
const empty = isEmpty([])
```

对于已有项目，如果历史代码中已经大量使用 `_`，建议逐步替换，不建议一次性大规模改动。可以优先处理核心页面、公共组件、构建体积敏感模块和新开发模块。

### 控制深拷贝使用范围

`cloneDeep` 使用方便，但不应滥用。深拷贝会递归复制对象内部结构，在数据量较大或调用频率较高时可能带来性能开销。

适合使用 `cloneDeep` 的场景：

- 编辑弹窗打开时复制当前行数据。
- 表单重置前保留初始快照。
- 提交前构建独立参数对象。
- 需要避免原始对象被修改的复杂嵌套数据。
- 响应式对象需要转换为普通数据副本。

不适合频繁使用 `cloneDeep` 的场景：

- 大型表格每次渲染时深拷贝全部数据。
- `computed` 中对大数组频繁深拷贝。
- 输入框每次输入时深拷贝整个表单。
- 简单一层对象也强制使用深拷贝。
- 可以通过不可变更新或局部复制解决的问题。

简单对象可以优先使用展开运算符：

```ts
const copiedUser = {
  ...userInfo
}
```

数组浅拷贝可以使用：

```ts
const copiedList = [...userList]
```

嵌套对象确实需要完整隔离时，再使用 `cloneDeep`：

```ts
import cloneDeep from 'lodash-es/cloneDeep'

const copiedData = cloneDeep(sourceData)
```

在 Vue3 中处理响应式对象时，推荐结合 `toRaw` 使用：

```ts
import { toRaw } from 'vue'
import cloneDeep from 'lodash-es/cloneDeep'

const copiedData = cloneDeep(toRaw(formData))
```

深拷贝的核心原则是按需使用。能用局部复制解决的问题，不要默认使用全量深拷贝。

### 保持业务逻辑可读性

Lodash ES 的作用是提升数据处理代码的可读性，而不是让业务逻辑变得更加抽象。使用工具函数时，应保证代码语义清楚、调用链可理解、数据转换过程可维护。

不推荐将多个复杂操作堆叠在一行：

```ts
const result = orderBy(groupBy(list.filter((item) => item.enabled), 'type').admin, ['sort'], ['asc'])
```

推荐拆分为多个有语义的变量：

```ts
import groupBy from 'lodash-es/groupBy'
import orderBy from 'lodash-es/orderBy'

const enabledList = list.filter((item) => item.enabled)
const typeGroup = groupBy(enabledList, 'type')
const adminList = typeGroup.admin || []
const sortedAdminList = orderBy(adminList, ['sort'], ['asc'])
```

拆分后的代码虽然行数更多，但每一步含义更清晰，后续排查问题也更方便。

业务逻辑可读性建议：

- 不要为了使用 Lodash ES 而替代所有原生方法。
- 简单 `map`、`filter`、`find` 可以优先使用原生写法。
- 复杂转换逻辑应拆分中间变量。
- 公共转换逻辑可以抽取为工具函数。
- 工具函数命名应体现业务语义，而不是只描述技术动作。
- 对关键数据转换可以添加简洁注释，说明业务目的。

## 常见问题

本章节整理项目中使用 Lodash ES 时常见的问题，包括打包体积过大、类型提示不完整、响应式数据被破坏和防抖函数失效。

### 打包体积过大

打包体积过大通常与导入方式不规范、同时引入 `lodash` 和 `lodash-es`、公共封装过度、构建配置异常有关。

常见原因：

- 使用了 `import _ from 'lodash-es'`。
- 使用了 `import * as lodash from 'lodash-es'`。
- 项目中同时存在 `lodash` 和 `lodash-es`。
- 公共工具文件一次性导出了大量函数。
- 第三方依赖间接引入了 `lodash`。
- 构建工具未正确进行 Tree Shaking。

建议优先检查依赖：

```bash
# 查看项目中是否同时安装 lodash 和 lodash-es
pnpm list lodash lodash-es
```

如果使用 npm：

```bash
npm list lodash lodash-es
```

如果需要分析构建产物，可以接入 `rollup-plugin-visualizer`。

```bash
pnpm add -D rollup-plugin-visualizer
```

文件位置：`vite.config.ts`

以下示例用于在 Vite 构建后生成包体积分析文件。

```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    vue(),
    visualizer({
      filename: 'dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true
    })
  ]
})
```

构建并查看分析结果：

```bash
pnpm build
```

构建完成后，打开 `dist/stats.html`，检查是否存在 Lodash ES 全量引入、重复依赖或异常模块体积。

处理建议：

- 统一使用 `lodash-es`，避免混用 `lodash`。
- 统一使用按函数路径导入。
- 对历史 `_` 写法逐步替换。
- 使用包体积分析工具定位异常来源。
- 对公共工具封装保持克制，不要一次性导出全部函数。

### 类型提示不完整

类型提示不完整通常是因为没有安装 `@types/lodash-es`，或者 TypeScript 配置、编辑器缓存存在问题。

优先安装类型依赖：

```bash
pnpm add -D @types/lodash-es
```

如果使用 npm：

```bash
npm install -D @types/lodash-es
```

安装后，检查 `package.json` 中是否包含相关依赖：

```json
{
  "dependencies": {
    "lodash-es": "^4.17.21"
  },
  "devDependencies": {
    "@types/lodash-es": "^4.17.12"
  }
}
```

如果仍然没有类型提示，可以检查 `tsconfig.json` 是否排除了类型文件。

文件位置：`tsconfig.json`

以下配置用于保证 TypeScript 正常解析项目源码和类型声明。

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "types": []
  },
  "include": [
    "src/**/*.ts",
    "src/**/*.tsx",
    "src/**/*.vue"
  ]
}
```

如果 `types` 被显式配置为某些固定类型包，需要确认没有错误限制 Lodash ES 类型解析。一般项目中可以不配置 `types`，让 TypeScript 自动发现类型声明。

处理建议：

- 确认已安装 `@types/lodash-es`。
- 重启 TypeScript Server 或重启编辑器。
- 检查 `tsconfig.json` 的 `include` 和 `types` 配置。
- 避免在项目中手写错误的 Lodash ES 声明文件。
- 对复杂返回值可以补充显式类型声明。

### 响应式数据被破坏

响应式数据被破坏通常发生在直接替换 `reactive` 对象、错误拷贝响应式代理、直接修改原始表格行数据等场景。

错误示例：

```ts
import cloneDeep from 'lodash-es/cloneDeep'

let formData = reactive({
  username: '',
  nickname: ''
})

const resetForm = () => {
  // 不推荐：直接替换 reactive 对象引用，可能导致响应式绑定失效
  formData = cloneDeep({
    username: '',
    nickname: ''
  })
}
```

推荐使用 `assign` 保持原有响应式引用：

```ts
import { reactive } from 'vue'
import assign from 'lodash-es/assign'

const formData = reactive({
  username: '',
  nickname: ''
})

const resetForm = () => {
  assign(formData, {
    username: '',
    nickname: ''
  })
}
```

如果需要从响应式对象生成普通数据副本，推荐使用 `toRaw` 和 `cloneDeep`：

```ts
import { reactive, toRaw } from 'vue'
import cloneDeep from 'lodash-es/cloneDeep'

const formData = reactive({
  username: 'admin',
  profile: {
    email: 'admin@example.com'
  }
})

const submitParams = cloneDeep(toRaw(formData))
```

处理建议：

- 不要直接替换 `reactive` 对象引用。
- 更新 `reactive` 对象时优先使用 `assign`。
- 复制响应式对象时使用 `cloneDeep(toRaw(data))`。
- 编辑表格行时先复制数据，确认后再写回。
- 对 `ref` 数组可以替换 `.value`，但要保证类型一致。

### 防抖函数失效

防抖函数失效通常是因为每次事件触发时都重新创建了 `debounce` 函数，导致上一次防抖状态无法复用。

错误示例：

```vue
<template>
  <el-input v-model="keyword" @input="handleInput" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import debounce from 'lodash-es/debounce'

const keyword = ref('')

const searchData = (value: string) => {
  console.log('搜索：', value)
}

const handleInput = (value: string) => {
  // 不推荐：每次输入都会创建新的防抖函数
  debounce(() => {
    searchData(value)
  }, 300)()
}
</script>
```

推荐在组件初始化阶段创建防抖函数：

```vue
<template>
  <el-input v-model="keyword" @input="handleInput" />
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import debounce from 'lodash-es/debounce'

const keyword = ref('')

const searchData = (value: string) => {
  console.log('搜索：', value)
}

const handleInput = debounce((value: string) => {
  searchData(value)
}, 300)

onBeforeUnmount(() => {
  handleInput.cancel()
})
</script>
```

如果需要在 `watch` 中使用防抖，也应先创建防抖函数，再在 `watch` 中调用。

```ts
import { onBeforeUnmount, ref, watch } from 'vue'
import debounce from 'lodash-es/debounce'

const keyword = ref('')

const searchData = (value: string) => {
  console.log('搜索：', value)
}

const debouncedSearch = debounce((value: string) => {
  searchData(value)
}, 300)

watch(keyword, (value) => {
  debouncedSearch(value)
})

onBeforeUnmount(() => {
  debouncedSearch.cancel()
})
```

处理建议：

- 防抖函数必须复用同一个函数实例。
- 不要在事件回调内部临时创建 `debounce`。
- 组件卸载时调用 `cancel()`。
- 输入框远程搜索优先使用 `debounce`。
- 高频滚动、窗口变化优先使用 `throttle`。

## 总结

本章节对 Lodash ES 在 Vue3、TypeScript 和 Vite 项目中的使用方式进行总结，重点强调按需引入、类型安全、响应式数据处理和团队代码规范。

### 使用建议

Lodash ES 适合作为现代前端项目中的通用工具函数库，用于补充原生 JavaScript 在复杂数据处理场景中的表达能力。在 Vue3 和 TypeScript 项目中，推荐将 Lodash ES 用于分组、排序、字段提取、深拷贝、防抖节流、类型判断等高频场景。

使用时建议遵循以下原则：

- 优先使用 `lodash-es`，不建议在 Vue3 + Vite 项目中优先使用传统 `lodash`。
- 优先按函数路径导入，例如 `lodash-es/cloneDeep`。
- 简单数组处理可以使用原生 JavaScript，不必强制使用 Lodash ES。
- 复杂分组、排序、对象处理可以使用 Lodash ES 提升可读性。
- 深拷贝只在必要场景使用，避免在大数据量和高频渲染中滥用。
- Vue3 响应式对象拷贝时，推荐使用 `cloneDeep(toRaw(data))`。
- TypeScript 项目中应安装 `@types/lodash-es`。
- 公共工具函数应明确参数类型和返回值类型。
- 代码评审时应关注是否存在全量导入和防抖函数误用。

Lodash ES 的价值不在于替代所有原生方法，而在于让复杂数据处理逻辑更加稳定、清晰和易维护。

### 项目落地要点

在团队项目中落地 Lodash ES 时，建议从依赖安装、导入规范、公共封装、代码评审和构建分析几个方面统一管理。

推荐落地方式：

- 在项目中统一安装 `lodash-es` 和 `@types/lodash-es`。
- 在代码规范中明确禁止 `import _ from 'lodash-es'`。
- 新代码统一使用按函数路径导入。
- 对历史代码中的全量导入逐步替换，不建议一次性大规模重构。
- 公共封装文件只导出项目高频使用函数。
- 对表单清洗、列表排序、数据分组等逻辑建立可复用工具函数。
- Vue3 组件中使用 `debounce`、`throttle` 时，统一在组件卸载时取消。
- 构建体积异常时，使用可视化分析工具检查 Lodash ES 引入情况。
- 在 TypeScript 中避免滥用 `any`，对复杂数据处理补充类型声明。

推荐项目约定示例：

```ts
// 推荐
import cloneDeep from 'lodash-es/cloneDeep'
import debounce from 'lodash-es/debounce'
import groupBy from 'lodash-es/groupBy'

// 不推荐
import _ from 'lodash-es'
import * as lodash from 'lodash-es'
```

推荐目录组织方式：

```text
src
├── utils
│   ├── lodash.ts
│   ├── user-data.ts
│   └── table-data.ts
├── views
│   ├── user
│   │   └── UserList.vue
│   └── order
│       └── OrderList.vue
└── types
    ├── user.ts
    └── order.ts
```

最终落地目标是让 Lodash ES 成为项目中的辅助工具，而不是形成新的复杂依赖层。项目中应通过统一导入方式、合理封装、类型约束和代码评审，保证它在提升开发效率的同时，不影响构建体积和业务代码可读性。
