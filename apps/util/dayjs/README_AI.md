# Day.js

## 技术概述

本节用于说明 Day.js 在 Vue3 + TypeScript 前端项目中的定位、适用场景，以及它与 JavaScript 原生 `Date` 的主要差异。Day.js 不是浏览器日期能力的替代标准，而是对常见日期创建、解析、格式化、计算、比较、国际化和时区处理进行工程化封装的轻量级工具库。

### Day.js 定位

Day.js 是一个轻量级 JavaScript 日期处理库，官方定位是 “2kB alternative to Moment.js”，并提供与 Moment.js 较为接近的 API 风格。它适合在前端项目中替代大量手写 `Date` 处理逻辑，用统一、链式、可读性更高的方式完成日期格式化、日期计算、日期比较和日期展示。([Day.js](https://day.js.org/))

在 Vue3 + TypeScript 项目中，Day.js 通常作为日期工具层使用，而不是直接散落在各个页面组件中。推荐将常用格式、日期转换、空值处理、范围计算等能力封装到 `src/utils/date.ts`、`src/composables/useDate.ts` 或业务工具模块中，避免不同页面重复实现同类逻辑。

Day.js 的一个重要特性是不可变性。对 Day.js 对象执行 `add`、`subtract`、`set` 等修改类操作时，返回的是新的 Day.js 实例，而不是直接修改原对象，这有助于减少前端状态管理、表单回显和组件响应式数据处理中因对象被意外修改导致的问题。([Day.js](https://day.js.org/))

同时，Day.js 的 TypeScript 支持较直接，官方 NPM 包内置类型声明。在 TypeScript 项目中安装 `dayjs` 后即可获得基本类型提示；在启用 `esModuleInterop` 和 `allowSyntheticDefaultImports` 的项目中，通常可以使用默认导入方式。([Day.js](https://day.js.org/docs/en/installation/typescript))

### 适用场景

Day.js 适用于前端项目中绝大多数“展示型”和“业务转换型”的日期处理场景。典型用法包括将后端返回的时间戳格式化为页面展示文本，将表单日期转换为接口需要的字符串格式，计算本周、本月、最近 7 天等查询范围，以及判断某个日期是否早于、晚于或等于另一个日期。

在 Vue3 项目中，常见适用场景包括：表格列日期展示、详情页创建时间展示、搜索表单日期范围处理、接口请求参数转换、倒计时或相对时间展示、活动开始结束时间判断、数据看板按日/月/季度统计、国际化日期文本展示等。Day.js 官方文档也将能力划分为 Parse、Get/Set、Manipulate、Display、Query、i18n、Plugins、Durations 和 Time Zone 等模块，基本覆盖前端业务中常见的日期处理分类。([Day.js](https://day.js.org/docs/en/parse/parse))

对于 Vue3 + TypeScript 项目，建议优先在以下场景使用 Day.js：

| 场景     | 说明                                                         |
| -------- | ------------------------------------------------------------ |
| 日期展示 | 将接口返回的 `string`、`number`、`Date` 转换为 `YYYY-MM-DD HH:mm:ss` 等统一格式 |
| 表单处理 | 将日期选择器结果转换为后端接口约定格式                       |
| 日期范围 | 计算今天、本周、本月、最近 N 天、开始时间和结束时间          |
| 日期比较 | 判断活动是否开始、是否过期、是否在某个时间范围内             |
| 相对时间 | 展示“几分钟前”“3 天前”等用户友好文本，通常需要 `relativeTime` 插件 |
| 国际化   | 根据当前语言环境展示中文、英文或其他语言的日期文本           |
| 时区处理 | 在跨地区业务中处理 UTC 时间、本地时间和指定时区时间，通常需要 `utc`、`timezone` 插件 |

不建议在项目中到处直接写 `new Date()`、`getFullYear()`、`getMonth()`、字符串拼接和手动补零逻辑。此类代码可读性较差，容易出现月份从 `0` 开始、时区偏移、空值异常、格式不一致等问题。更好的方式是通过 Day.js 统一封装日期输入、输出和异常兜底规则。

### 与原生 Date 的差异

JavaScript 原生 `Date` 表示的是一个具体时间点，其内部核心是从 UTC 纪元时间 `1970-01-01T00:00:00Z` 开始累计的毫秒数；本地时间、UTC 时间和格式化展示则由不同方法解释该时间戳。([MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)) Day.js 并没有抛弃原生 `Date`，而是在其外层创建包装对象，提供更一致、更易读的 API，并且 Day.js 对象默认是不可变的。([Day.js](https://day.js.org/docs/en/parse/parse))

| 对比项          | 原生 Date                                                    | Day.js                                                       |
| --------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| API 可读性      | 需要组合 `getFullYear()`、`getMonth()`、`getDate()` 等方法，格式化代码较繁琐 | 提供 `format()`、`add()`、`subtract()`、`startOf()`、`endOf()` 等链式 API |
| 可变性          | `setDate()`、`setMonth()`、`setFullYear()` 等方法会修改当前 `Date` 对象 | 修改类操作返回新的 Day.js 实例，默认不改变原实例             |
| 格式化          | 原生能力有限，复杂格式通常需要手写或依赖 `Intl`              | 常用格式可通过 `format('YYYY-MM-DD HH:mm:ss')` 统一处理      |
| 日期计算        | 加减天、月、年时需要手动处理边界                             | 可直接使用 `add(1, 'day')`、`subtract(1, 'month')`           |
| 日期比较        | 通常需要转换为时间戳后比较                                   | 提供 `isBefore()`、`isSame()`、`isAfter()` 等语义化方法      |
| 插件能力        | 原生对象能力固定                                             | 可按需引入插件，例如相对时间、UTC、时区、日期范围判断等      |
| TypeScript 体验 | 类型来自 JavaScript 标准库，业务语义较弱                     | NPM 包内置 TypeScript 类型声明，配合工具封装后类型约束更清晰 |
| 工程一致性      | 不同开发者容易写出不同格式和兜底逻辑                         | 可以通过统一工具方法、格式常量和插件初始化方式保持项目一致   |

例如，原生 `Date` 在处理“加一天”时通常需要先创建对象，再调用修改方法；这类 `set*` 方法会改变当前实例。MDN 对 `setDate()` 的描述表明它会改变指定 `Date` 实例的日期值。([MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/setDate))

下面示例对比了原生 `Date` 和 Day.js 的差异，重点体现可读性和不可变性。

```typescript
import dayjs from 'dayjs'

const nativeDate = new Date('2026-05-21 10:00:00')

// 原生 Date：setDate 会修改 nativeDate 本身
nativeDate.setDate(nativeDate.getDate() + 1)

const currentTime = dayjs('2026-05-21 10:00:00')

// Day.js：add 返回新实例，不会修改 currentTime
const nextDay = currentTime.add(1, 'day')

console.log(currentTime.format('YYYY-MM-DD HH:mm:ss')) // 2026-05-21 10:00:00
console.log(nextDay.format('YYYY-MM-DD HH:mm:ss'))     // 2026-05-22 10:00:00
```

在实际项目中，原生 `Date` 更适合作为底层时间对象或与浏览器 API、第三方组件交互的基础类型；Day.js 更适合作为业务代码中的日期处理工具。对于 Vue3 + TypeScript 项目，推荐将 Day.js 作为日期处理的统一入口，对外暴露明确的工具函数，例如 `formatDate()`、`formatDateTime()`、`getDateRange()`、`isExpired()`，从而降低页面组件中的日期处理复杂度。



## 项目环境准备

本节用于说明在 Vue3 + TypeScript 项目中引入 Day.js 的基础准备工作，包括依赖安装、TypeScript 类型支持方式，以及推荐的项目目录组织方式。Day.js 官方 NPM 包已经内置 TypeScript 类型声明，安装 `dayjs` 后即可在 TypeScript 文件中直接获得类型提示。([Day.js](https://day.js.org/docs/en/installation/typescript))

### 依赖安装

Day.js 作为前端运行时依赖安装即可，不需要额外安装 `@types/dayjs`。如果项目使用 Vite + Vue3 + TypeScript，推荐使用项目当前包管理器统一安装，避免混用 `npm`、`pnpm` 和 `yarn` 造成锁文件不一致。

使用 npm 安装：

```bash
# 安装 Day.js 运行时依赖
npm install dayjs
```

使用 pnpm 安装：

```bash
# 推荐在 pnpm 项目中使用
pnpm add dayjs
```

使用 yarn 安装：

```bash
# 适用于 yarn 项目
yarn add dayjs
```

安装完成后，可以在任意 TypeScript 文件或 Vue 单文件组件中导入使用。

```typescript
import dayjs from 'dayjs'

const now = dayjs().format('YYYY-MM-DD HH:mm:ss')

console.log(now)
```

在项目中不建议每个组件都重复初始化插件和语言包。插件注册、语言包配置和通用格式常量应集中放在统一文件中，例如 `src/plugins/dayjs.ts` 或 `src/utils/date.ts`，后续页面只调用封装后的工具函数。

### TypeScript 类型支持

Day.js 官方包内置 TypeScript 类型声明，因此安装 `dayjs` 后可以直接在 TypeScript 项目中使用。官方文档说明，如果 `tsconfig.json` 中启用了 `esModuleInterop` 和 `allowSyntheticDefaultImports`，可以使用 `import dayjs from 'dayjs'`；否则需要使用 `import * as dayjs from 'dayjs'` 的导入方式。([Day.js](https://day.js.org/docs/en/installation/typescript))

推荐配置如下。

文件位置：`tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "Bundler",

    // 允许默认导入 CommonJS 风格模块
    "esModuleInterop": true,

    // 允许从没有默认导出的模块中使用默认导入语法
    "allowSyntheticDefaultImports": true,

    // 启用严格类型检查
    "strict": true
  }
}
```

在启用上述配置后，推荐统一使用默认导入方式。

```typescript
import dayjs, { Dayjs } from 'dayjs'

const currentTime: Dayjs = dayjs()
const formattedTime: string = currentTime.format('YYYY-MM-DD HH:mm:ss')
```

如果项目没有启用 `esModuleInterop` 和 `allowSyntheticDefaultImports`，则使用以下写法。

```typescript
import * as dayjs from 'dayjs'

const currentTime = dayjs()
const formattedTime = currentTime.format('YYYY-MM-DD HH:mm:ss')
```

在业务代码中，建议不要直接到处声明复杂日期类型，而是先定义统一的日期入参类型，后续工具方法、组合式函数和业务组件都复用该类型。

```typescript
import type { Dayjs } from 'dayjs'

export type DateInput = string | number | Date | Dayjs | null | undefined
export type DateFormat = 'YYYY-MM-DD' | 'YYYY-MM-DD HH:mm:ss' | 'HH:mm:ss'
```

这种写法可以兼容接口返回的字符串、时间戳、原生 `Date`、Element Plus 日期选择器结果，以及已经转换过的 Day.js 对象。

### Vue3 项目目录建议

在 Vue3 + TypeScript 项目中，Day.js 建议按“插件初始化”和“业务工具封装”分开管理。插件初始化文件负责注册 Day.js 插件、语言包和全局配置；业务工具文件负责对外提供日期格式化、日期范围、日期比较等方法。

推荐目录结构如下。

```text
src
├── plugins
│   └── dayjs.ts              # Day.js 插件、语言包、全局配置
├── utils
│   └── date.ts               # 日期格式化、比较、计算等工具方法
├── composables
│   └── useDate.ts            # Vue 组合式日期能力封装
├── constants
│   └── date.ts               # 日期格式常量
└── views
    └── example
        └── DayjsExample.vue  # 页面调用示例
```

基础插件初始化文件可以先保持简单，只处理语言包和必要插件。官方文档说明，使用语言包和插件时需要先导入目标语言和插件，再通过 `dayjs.extend()` 注册插件，通过 `dayjs.locale()` 设置语言。([Day.js](https://day.js.org/docs/en/installation/typescript))

文件位置：`src/plugins/dayjs.ts`

```typescript
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import 'dayjs/locale/zh-cn'

// 支持按指定格式解析字符串日期
dayjs.extend(customParseFormat)

// 设置全局中文语言环境
dayjs.locale('zh-cn')

export default dayjs
export type { Dayjs } from 'dayjs'
```

统一日期格式常量建议单独维护，避免页面中反复写字符串。

文件位置：`src/constants/date.ts`

```typescript
export const DATE_FORMAT = {
  DATE: 'YYYY-MM-DD',
  DATETIME: 'YYYY-MM-DD HH:mm:ss',
  TIME: 'HH:mm:ss',
  MONTH: 'YYYY-MM'
} as const

export type DateFormatValue = (typeof DATE_FORMAT)[keyof typeof DATE_FORMAT]
```

基础工具文件可以统一从插件初始化文件中导入 Day.js，避免组件层重复注册插件。

文件位置：`src/utils/date.ts`

```typescript
import dayjs, { type Dayjs } from '@/plugins/dayjs'
import { DATE_FORMAT, type DateFormatValue } from '@/constants/date'

export type DateInput = string | number | Date | Dayjs | null | undefined

/**
 * 判断日期值是否有效
 */
export function isValidDate(value: DateInput): boolean {
  if (value === null || value === undefined || value === '') {
    return false
  }

  return dayjs(value).isValid()
}

/**
 * 格式化日期
 */
export function formatDate(
  value: DateInput,
  format: DateFormatValue = DATE_FORMAT.DATETIME,
  fallback = '-'
): string {
  if (!isValidDate(value)) {
    return fallback
  }

  return dayjs(value).format(format)
}
```

页面中使用时，只需要导入工具方法即可。

```typescript
import { formatDate } from '@/utils/date'

const createTimeText = formatDate('2026-05-21 10:30:00')
```

## 基础用法

本节介绍 Day.js 最常用的日期创建、格式化、解析、比较和计算能力。Day.js 的核心机制是对原生 `Date` 对象创建包装实例，调用 `dayjs()` 即可生成 Day.js 对象，并且修改类 API 会返回新的实例，而不是修改原实例。([Day.js](https://day.js.org/docs/en/parse/parse))

### 日期创建

日期创建是 Day.js 的基础入口。常用输入包括当前时间、字符串、时间戳、原生 `Date` 对象和已有 Day.js 对象。

```typescript
import dayjs from '@/plugins/dayjs'

// 当前时间
const now = dayjs()

// 字符串日期
const dateFromString = dayjs('2026-05-21')

// 字符串日期时间
const datetimeFromString = dayjs('2026-05-21 10:30:00')

// 毫秒时间戳
const dateFromTimestamp = dayjs(1779330600000)

// 原生 Date
const dateFromNativeDate = dayjs(new Date())

// Day.js 对象克隆
const clonedDate = dayjs(now)
```

常见业务封装可以对空值做统一处理，避免页面组件中反复判断 `null`、`undefined` 和空字符串。

```typescript
import dayjs, { type Dayjs } from '@/plugins/dayjs'

export type DateInput = string | number | Date | Dayjs | null | undefined

/**
 * 创建 Day.js 日期对象
 */
export function createDate(value?: DateInput): Dayjs | null {
  if (value === null || value === undefined || value === '') {
    return null
  }

  const date = dayjs(value)
  return date.isValid() ? date : null
}
```

调用示例：

```typescript
const date = createDate('2026-05-21 10:30:00')

if (date) {
  console.log(date.format('YYYY-MM-DD HH:mm:ss'))
}
```

### 日期格式化

日期格式化用于将接口返回值、时间戳或日期对象转换为页面展示文本。Day.js 使用 `format()` 方法根据格式字符串输出日期，官方格式化文档中列出了常用 token，例如 `YYYY` 表示四位年份，`MM` 表示两位月份，`DD` 表示两位日期，`HH` 表示两位小时，`mm` 表示两位分钟，`ss` 表示两位秒。([Day.js](https://day.js.org/docs/en/display/format))

常用格式如下。

| 格式                  | 示例                  | 说明     |
| --------------------- | --------------------- | -------- |
| `YYYY-MM-DD`          | `2026-05-21`          | 日期     |
| `YYYY-MM-DD HH:mm:ss` | `2026-05-21 10:30:00` | 日期时间 |
| `YYYY/MM/DD`          | `2026/05/21`          | 斜杠日期 |
| `HH:mm:ss`            | `10:30:00`            | 时间     |
| `YYYY-MM`             | `2026-05`             | 年月     |

基础格式化示例：

```typescript
import dayjs from '@/plugins/dayjs'

const value = '2026-05-21 10:30:00'

const dateText = dayjs(value).format('YYYY-MM-DD')
const datetimeText = dayjs(value).format('YYYY-MM-DD HH:mm:ss')
const timeText = dayjs(value).format('HH:mm:ss')

console.log(dateText)     // 2026-05-21
console.log(datetimeText) // 2026-05-21 10:30:00
console.log(timeText)     // 10:30:00
```

推荐在项目中封装统一格式化方法。

```typescript
import dayjs, { type Dayjs } from '@/plugins/dayjs'
import { DATE_FORMAT, type DateFormatValue } from '@/constants/date'

export type DateInput = string | number | Date | Dayjs | null | undefined

/**
 * 格式化日期
 */
export function formatDate(
  value: DateInput,
  format: DateFormatValue = DATE_FORMAT.DATETIME,
  fallback = '-'
): string {
  if (value === null || value === undefined || value === '') {
    return fallback
  }

  const date = dayjs(value)

  if (!date.isValid()) {
    return fallback
  }

  return date.format(format)
}
```

Vue 页面中使用：

```vue
<template>
  <div class="p-4">
    <p>创建时间：{{ createTimeText }}</p>
    <p>更新日期：{{ updateDateText }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { DATE_FORMAT } from '@/constants/date'
import { formatDate } from '@/utils/date'

const detail = {
  createTime: '2026-05-21 10:30:00',
  updateTime: '2026-05-22 09:15:00'
}

// 表格、详情页中推荐用 computed 统一处理展示文本
const createTimeText = computed(() => formatDate(detail.createTime))
const updateDateText = computed(() => formatDate(detail.updateTime, DATE_FORMAT.DATE))
</script>
```

### 日期解析

日期解析用于将字符串日期转换为 Day.js 对象。Day.js 默认支持常见日期字符串、时间戳和原生 `Date`。如果需要按照自定义格式解析字符串，例如 `2026年05月21日`、`21/05/2026`，需要注册 `customParseFormat` 插件。该插件用于扩展 `dayjs()` 构造函数，使其支持自定义格式字符串解析；严格解析可以通过第三个参数传入 `true`。([Day.js](https://day.js.org/docs/en/plugin/custom-parse-format))

文件位置：`src/plugins/dayjs.ts`

```typescript
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import 'dayjs/locale/zh-cn'

// 启用自定义格式解析能力
dayjs.extend(customParseFormat)

dayjs.locale('zh-cn')

export default dayjs
export type { Dayjs } from 'dayjs'
```

基础解析示例：

```typescript
import dayjs from '@/plugins/dayjs'

// 默认字符串解析
const date1 = dayjs('2026-05-21')

// 指定格式解析
const date2 = dayjs('2026年05月21日', 'YYYY年MM月DD日')

// 严格解析：格式和值都需要匹配
const date3 = dayjs('2026-05-21', 'YYYY-MM-DD', true)

console.log(date1.isValid()) // true
console.log(date2.isValid()) // true
console.log(date3.isValid()) // true
```

推荐封装解析方法，对无效日期统一返回 `null`。

```typescript
import dayjs, { type Dayjs } from '@/plugins/dayjs'

export type DateInput = string | number | Date | Dayjs | null | undefined

/**
 * 按指定格式解析日期
 */
export function parseDate(
  value: DateInput,
  format?: string,
  strict = true
): Dayjs | null {
  if (value === null || value === undefined || value === '') {
    return null
  }

  const date = typeof value === 'string' && format
    ? dayjs(value, format, strict)
    : dayjs(value)

  return date.isValid() ? date : null
}
```

调用示例：

```typescript
const date = parseDate('2026年05月21日', 'YYYY年MM月DD日')

if (date) {
  console.log(date.format('YYYY-MM-DD'))
}
```

### 日期比较

日期比较用于判断两个时间的先后关系，例如活动是否开始、优惠券是否过期、查询范围是否合法等。Day.js 提供 `isBefore()`、`isSame()` 和 `isAfter()` 等方法。比较方法默认按毫秒粒度比较，也可以传入第二个参数指定比较粒度，例如按 `day`、`month`、`year` 比较。([Day.js](https://day.js.org/docs/en/query/is-before))

基础比较示例：

```typescript
import dayjs from '@/plugins/dayjs'

const startTime = dayjs('2026-05-21 10:00:00')
const endTime = dayjs('2026-05-21 18:00:00')
const currentTime = dayjs('2026-05-21 12:00:00')

const beforeStart = currentTime.isBefore(startTime)
const afterEnd = currentTime.isAfter(endTime)
const sameDay = currentTime.isSame(startTime, 'day')

console.log(beforeStart) // false
console.log(afterEnd)    // false
console.log(sameDay)     // true
```

推荐封装业务语义更明确的方法。

```typescript
import dayjs, { type Dayjs } from '@/plugins/dayjs'

export type DateInput = string | number | Date | Dayjs | null | undefined

/**
 * 判断当前时间是否超过目标时间
 */
export function isExpired(value: DateInput): boolean {
  if (value === null || value === undefined || value === '') {
    return false
  }

  const date = dayjs(value)

  if (!date.isValid()) {
    return false
  }

  return dayjs().isAfter(date)
}

/**
 * 判断时间是否在开始和结束时间之间
 */
export function isInDateRange(
  value: DateInput,
  startTime: DateInput,
  endTime: DateInput
): boolean {
  const current = dayjs(value)
  const start = dayjs(startTime)
  const end = dayjs(endTime)

  if (!current.isValid() || !start.isValid() || !end.isValid()) {
    return false
  }

  return current.isAfter(start) && current.isBefore(end)
}
```

调用示例：

```typescript
const expired = isExpired('2026-05-21 10:00:00')

const available = isInDateRange(
  '2026-05-21 12:00:00',
  '2026-05-21 10:00:00',
  '2026-05-21 18:00:00'
)

console.log(expired)
console.log(available)
```

如果业务要求包含开始时间和结束时间，可以使用插件 `isSameOrAfter`、`isSameOrBefore`，或者在工具方法中组合 `isSame()`、`isAfter()`、`isBefore()` 实现闭区间判断。

### 日期计算

日期计算用于处理加减天数、月份、年份，获取某一天的开始时间或结束时间，以及计算业务查询范围。Day.js 的 `add()` 方法会返回增加指定时间后的克隆对象，原对象不会改变；`subtract()` 方法会返回减去指定时间后的克隆对象。两者都支持 `day`、`week`、`month`、`year`、`hour`、`minute`、`second`、`millisecond` 等单位。([Day.js](https://day.js.org/docs/en/manipulate/add))

基础计算示例：

```typescript
import dayjs from '@/plugins/dayjs'

const currentTime = dayjs('2026-05-21 10:30:00')

const nextDay = currentTime.add(1, 'day')
const previousWeek = currentTime.subtract(1, 'week')
const nextMonth = currentTime.add(1, 'month')
const previousYear = currentTime.subtract(1, 'year')

console.log(currentTime.format('YYYY-MM-DD HH:mm:ss')) // 2026-05-21 10:30:00
console.log(nextDay.format('YYYY-MM-DD HH:mm:ss'))     // 2026-05-22 10:30:00
console.log(previousWeek.format('YYYY-MM-DD'))         // 2026-05-14
console.log(nextMonth.format('YYYY-MM-DD'))            // 2026-06-21
console.log(previousYear.format('YYYY-MM-DD'))         // 2025-05-21
```

常见查询范围封装如下。

```typescript
import dayjs from '@/plugins/dayjs'
import { DATE_FORMAT } from '@/constants/date'

export interface DateRange {
  startTime: string
  endTime: string
}

/**
 * 获取今天的开始和结束时间
 */
export function getTodayRange(): DateRange {
  return {
    startTime: dayjs().startOf('day').format(DATE_FORMAT.DATETIME),
    endTime: dayjs().endOf('day').format(DATE_FORMAT.DATETIME)
  }
}

/**
 * 获取最近 N 天日期范围
 */
export function getRecentDayRange(days: number): DateRange {
  const safeDays = Number.isFinite(days) && days > 0 ? days : 1

  return {
    startTime: dayjs().subtract(safeDays - 1, 'day').startOf('day').format(DATE_FORMAT.DATETIME),
    endTime: dayjs().endOf('day').format(DATE_FORMAT.DATETIME)
  }
}

/**
 * 获取当前月份日期范围
 */
export function getCurrentMonthRange(): DateRange {
  return {
    startTime: dayjs().startOf('month').format(DATE_FORMAT.DATETIME),
    endTime: dayjs().endOf('month').format(DATE_FORMAT.DATETIME)
  }
}
```

Vue3 搜索表单中使用：

```vue
<template>
  <div class="p-4">
    <button type="button" @click="setToday">今天</button>
    <button type="button" @click="setRecent7Days">最近 7 天</button>
    <button type="button" @click="setCurrentMonth">本月</button>

    <pre>{{ queryForm }}</pre>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import {
  getTodayRange,
  getRecentDayRange,
  getCurrentMonthRange
} from '@/utils/date'

interface QueryForm {
  startTime: string
  endTime: string
}

const queryForm = reactive<QueryForm>({
  startTime: '',
  endTime: ''
})

// 设置今天查询范围
function setToday() {
  Object.assign(queryForm, getTodayRange())
}

// 设置最近 7 天查询范围
function setRecent7Days() {
  Object.assign(queryForm, getRecentDayRange(7))
}

// 设置本月查询范围
function setCurrentMonth() {
  Object.assign(queryForm, getCurrentMonthRange())
}
</script>
```

日期计算时需要注意，Day.js 的修改类 API 默认返回新实例。因此在业务代码中，以下写法不会改变 `baseTime`。

```typescript
import dayjs from '@/plugins/dayjs'

const baseTime = dayjs('2026-05-21 10:30:00')
const resultTime = baseTime.add(1, 'day')

console.log(baseTime.format('YYYY-MM-DD'))  // 2026-05-21
console.log(resultTime.format('YYYY-MM-DD')) // 2026-05-22
```

这种不可变行为适合 Vue3 响应式状态管理，可以减少日期对象被意外修改的问题。在表单、表格筛选、Pinia 状态和组合式函数中，建议始终把计算结果赋值给新的变量，而不是假设原日期对象会被修改。



## 插件使用

本节用于说明 Day.js 插件的选择、注册和 TypeScript 类型处理方式。Day.js 默认只包含核心能力，插件是独立模块，需要按需导入并通过 `dayjs.extend()` 注册后才能使用。官方文档明确说明，插件用于扩展 Day.js 的功能或新增 API，且默认不会自动安装所有插件。([Day.js](https://day.js.org/docs/en/plugin/plugin))

### 常用插件选择

在 Vue3 + TypeScript 项目中，不建议一次性引入大量插件。更推荐根据业务场景按需启用，常用插件可以集中放在 `src/plugins/dayjs.ts` 中统一注册。

| 插件                | 导入路径                         | 适用场景                                        |
| ------------------- | -------------------------------- | ----------------------------------------------- |
| `customParseFormat` | `dayjs/plugin/customParseFormat` | 按指定格式解析字符串日期，例如 `YYYY年MM月DD日` |
| `relativeTime`      | `dayjs/plugin/relativeTime`      | 展示“几分钟前”“3 天前”等相对时间                |
| `utc`               | `dayjs/plugin/utc`               | UTC 时间解析、转换和展示                        |
| `timezone`          | `dayjs/plugin/timezone`          | 指定时区解析、转换和展示                        |
| `isSameOrAfter`     | `dayjs/plugin/isSameOrAfter`     | 判断日期是否等于或晚于目标时间                  |
| `isSameOrBefore`    | `dayjs/plugin/isSameOrBefore`    | 判断日期是否等于或早于目标时间                  |
| `isBetween`         | `dayjs/plugin/isBetween`         | 判断日期是否处于某个范围内                      |
| `advancedFormat`    | `dayjs/plugin/advancedFormat`    | 支持更丰富的格式化 token                        |
| `localizedFormat`   | `dayjs/plugin/localizedFormat`   | 根据语言环境输出本地化日期格式                  |
| `duration`          | `dayjs/plugin/duration`          | 处理时间段，例如持续时长、倒计时、人性化时长    |
| `weekOfYear`        | `dayjs/plugin/weekOfYear`        | 获取日期处于一年中的第几周                      |
| `isoWeek`           | `dayjs/plugin/isoWeek`           | 按 ISO 周规则处理周相关逻辑                     |
| `minMax`            | `dayjs/plugin/minMax`            | 获取多个日期中的最小值或最大值                  |

相对时间插件会为 Day.js 增加 `.from()`、`.to()`、`.fromNow()`、`.toNow()` 等 API，用于输出相对时间字符串。([Day.js](https://day.js.org/docs/en/plugin/relative-time)) UTC 插件会增加 `.utc()`、`.local()`、`.isUTC()` 等 API；时区插件会增加 `dayjs.tz()`、`.tz()`、`dayjs.tz.guess()` 和 `dayjs.tz.setDefault()` 等 API，并且时区插件依赖 `utc` 插件，需要先注册 `utc` 再注册 `timezone`。([Day.js](https://day.js.org/docs/en/plugin/utc)) ([Day.js](https://day.js.org/docs/en/plugin/timezone))

### 插件注册方式

插件注册建议集中在一个初始化文件中完成，避免在多个组件或工具文件里重复 `extend()`。重复注册虽然通常不会直接导致严重错误，但会让项目初始化逻辑分散，不利于维护。

文件位置：`src/plugins/dayjs.ts`

下面代码集中注册 Day.js 常用插件、中文语言包和默认语言环境，后续项目中统一从该文件导入 `dayjs`。

```typescript
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import relativeTime from 'dayjs/plugin/relativeTime'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import isBetween from 'dayjs/plugin/isBetween'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import duration from 'dayjs/plugin/duration'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import isoWeek from 'dayjs/plugin/isoWeek'
import minMax from 'dayjs/plugin/minMax'
import 'dayjs/locale/zh-cn'

// 支持按指定格式解析字符串日期
dayjs.extend(customParseFormat)

// 支持相对时间，例如“几分钟前”“3 天前”
dayjs.extend(relativeTime)

// timezone 依赖 utc，需要先注册 utc，再注册 timezone
dayjs.extend(utc)
dayjs.extend(timezone)

// 支持边界比较和范围判断
dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)
dayjs.extend(isBetween)

// 支持增强格式化和本地化格式
dayjs.extend(advancedFormat)
dayjs.extend(localizedFormat)

// 支持时间段、周相关、最大最小日期计算
dayjs.extend(duration)
dayjs.extend(weekOfYear)
dayjs.extend(isoWeek)
dayjs.extend(minMax)

// 设置全局中文语言环境
dayjs.locale('zh-cn')

export default dayjs
export type { Dayjs, OpUnitType, ManipulateType } from 'dayjs'
```

在 `main.ts` 中只需要导入一次初始化文件即可。如果工具方法中统一从 `@/plugins/dayjs` 导入，也可以不在 `main.ts` 中额外导入。

文件位置：`src/main.ts`

```typescript
import { createApp } from 'vue'
import App from './App.vue'
import '@/plugins/dayjs'

const app = createApp(App)

app.mount('#app')
```

使用插件能力时，业务代码不再直接从 `dayjs` 包导入，而是统一从项目封装入口导入。

```typescript
import dayjs from '@/plugins/dayjs'

const createTime = dayjs('2026-05-21 10:30:00')
const relativeText = createTime.fromNow()
const inRange = createTime.isBetween('2026-05-01', '2026-06-01', 'day', '[]')

console.log(relativeText)
console.log(inRange)
```

### TypeScript 中的插件类型处理

Day.js NPM 包内置 TypeScript 类型声明，通常不需要额外安装 `@types/dayjs`。官方文档说明，如果 `tsconfig.json` 开启了 `esModuleInterop` 和 `allowSyntheticDefaultImports`，可以使用默认导入；否则需要使用 `import * as dayjs from 'dayjs'`。插件和语言包也需要先导入再使用。([Day.js](https://day.js.org/docs/en/installation/typescript))

推荐在 Vue3 + TypeScript 项目中使用以下配置。

文件位置：`tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,

    // 支持 import dayjs from 'dayjs'
    "esModuleInterop": true,

    // 支持默认导入语法
    "allowSyntheticDefaultImports": true,

    // 支持 @ 路径别名
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

插件导入后，Day.js 的类型声明通常会通过模块增强方式补充对应 API。例如注册 `isSameOrAfter` 后，可以直接调用 `isSameOrAfter()`；该插件的官方说明是新增 `.isSameOrAfter()` API，并返回布尔值。([Day.js](https://day.js.org/docs/en/plugin/is-same-or-after))

```typescript
import dayjs from '@/plugins/dayjs'

const startTime = dayjs('2026-05-21 10:00:00')
const currentTime = dayjs('2026-05-21 10:30:00')

const available: boolean = currentTime.isSameOrAfter(startTime)

console.log(available)
```

如果 TypeScript 提示 `Property 'xxx' does not exist on type 'Dayjs'`，通常需要检查以下几个点：插件是否已正确导入；是否调用了 `dayjs.extend(plugin)`；业务代码是否统一从 `@/plugins/dayjs` 导入；`tsconfig.json` 是否包含 `src/**/*.ts` 和 `src/**/*.vue`；编辑器 TypeScript 服务是否需要重启。

对于工具函数入参，建议封装统一类型，避免每个方法重复声明。

文件位置：`src/types/date.ts`

```typescript
import type { Dayjs } from 'dayjs'

export type DateInput = string | number | Date | Dayjs | null | undefined

export type DateRangeValue = [DateInput, DateInput]

export interface DateRange {
  startTime: string
  endTime: string
}
```

业务工具文件中复用该类型。

```typescript
import dayjs from '@/plugins/dayjs'
import type { DateInput } from '@/types/date'

export function isValidDate(value: DateInput): boolean {
  if (value === null || value === undefined || value === '') {
    return false
  }

  return dayjs(value).isValid()
}
```

## Vue3 集成方式

本节用于说明 Day.js 在 Vue3 项目中的几种集成方式。常见方式包括组件内直接使用、封装日期工具类、封装组合式函数，以及通过全局挂载提供 `$dayjs`。实际项目中推荐优先使用工具函数和组合式函数，全局挂载只作为模板层或旧代码迁移的补充方案。

### 在组件中直接使用

组件中直接使用适合简单页面、临时展示或演示场景。优点是代码直观，缺点是多个页面容易重复写格式化规则、空值处理和异常兜底逻辑。

文件位置：`src/views/example/DayjsDirectExample.vue`

下面组件演示在 Vue3 单文件组件中直接使用 Day.js 进行日期格式化、比较和相对时间展示。

```vue
<template>
  <div class="p-4">
    <p>当前时间：{{ nowText }}</p>
    <p>创建时间：{{ createTimeText }}</p>
    <p>相对时间：{{ relativeText }}</p>
    <p>是否已过期：{{ expired ? '是' : '否' }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import dayjs from '@/plugins/dayjs'

const createTime = '2026-05-21 10:30:00'
const expireTime = '2026-05-31 23:59:59'

const nowText = computed(() => dayjs().format('YYYY-MM-DD HH:mm:ss'))

const createTimeText = computed(() => {
  const date = dayjs(createTime)
  return date.isValid() ? date.format('YYYY-MM-DD HH:mm:ss') : '-'
})

const relativeText = computed(() => dayjs(createTime).fromNow())

const expired = computed(() => dayjs().isAfter(expireTime))
</script>
```

这种写法可以用于小范围页面，但不建议作为大型项目的主方案。大型项目中应把格式化、范围计算、相对时间、空值兜底等逻辑放入工具层统一维护。

### 封装日期工具类

日期工具类适合处理项目中的通用日期逻辑，例如统一格式化、时间戳转换、相对时间、范围计算和日期比较。页面组件只负责调用工具方法，不直接关心 Day.js 插件和格式细节。

文件位置：`src/utils/date.ts`

下面代码封装常用日期工具方法，用于页面、表格、表单和接口参数处理。

```typescript
import dayjs from '@/plugins/dayjs'
import type { Dayjs } from 'dayjs'

export const DATE_FORMAT = {
  DATE: 'YYYY-MM-DD',
  DATETIME: 'YYYY-MM-DD HH:mm:ss',
  TIME: 'HH:mm:ss',
  MONTH: 'YYYY-MM'
} as const

export type DateFormatValue = (typeof DATE_FORMAT)[keyof typeof DATE_FORMAT]
export type DateInput = string | number | Date | Dayjs | null | undefined

export interface DateRange {
  startTime: string
  endTime: string
}

/**
 * 判断日期是否有效
 */
export function isValidDate(value: DateInput): boolean {
  if (value === null || value === undefined || value === '') {
    return false
  }

  return dayjs(value).isValid()
}

/**
 * 格式化日期
 */
export function formatDate(
  value: DateInput,
  format: DateFormatValue = DATE_FORMAT.DATETIME,
  fallback = '-'
): string {
  if (!isValidDate(value)) {
    return fallback
  }

  return dayjs(value).format(format)
}

/**
 * 格式化时间戳
 */
export function formatTimestamp(
  value: number | string | null | undefined,
  format: DateFormatValue = DATE_FORMAT.DATETIME,
  fallback = '-'
): string {
  if (value === null || value === undefined || value === '') {
    return fallback
  }

  const timestamp = Number(value)

  if (!Number.isFinite(timestamp)) {
    return fallback
  }

  return formatDate(timestamp, format, fallback)
}

/**
 * 获取相对时间
 */
export function formatRelativeTime(value: DateInput, fallback = '-'): string {
  if (!isValidDate(value)) {
    return fallback
  }

  return dayjs(value).fromNow()
}

/**
 * 判断是否已过期
 */
export function isExpired(value: DateInput): boolean {
  if (!isValidDate(value)) {
    return false
  }

  return dayjs().isAfter(dayjs(value))
}

/**
 * 判断日期是否在范围内，包含开始和结束边界
 */
export function isInRange(value: DateInput, startTime: DateInput, endTime: DateInput): boolean {
  if (!isValidDate(value) || !isValidDate(startTime) || !isValidDate(endTime)) {
    return false
  }

  return dayjs(value).isBetween(dayjs(startTime), dayjs(endTime), 'second', '[]')
}

/**
 * 获取最近 N 天范围
 */
export function getRecentDayRange(days: number): DateRange {
  const safeDays = Number.isFinite(days) && days > 0 ? days : 1

  return {
    startTime: dayjs().subtract(safeDays - 1, 'day').startOf('day').format(DATE_FORMAT.DATETIME),
    endTime: dayjs().endOf('day').format(DATE_FORMAT.DATETIME)
  }
}

/**
 * 获取当前月份范围
 */
export function getCurrentMonthRange(): DateRange {
  return {
    startTime: dayjs().startOf('month').format(DATE_FORMAT.DATETIME),
    endTime: dayjs().endOf('month').format(DATE_FORMAT.DATETIME)
  }
}
```

页面中调用工具类时，只需要关注业务字段。

```typescript
import {
  formatDate,
  formatRelativeTime,
  getRecentDayRange,
  isExpired
} from '@/utils/date'

const createTimeText = formatDate('2026-05-21 10:30:00')
const relativeText = formatRelativeTime('2026-05-21 10:30:00')
const expired = isExpired('2026-05-31 23:59:59')
const range = getRecentDayRange(7)

console.log(createTimeText)
console.log(relativeText)
console.log(expired)
console.log(range)
```

### 封装组合式函数

组合式函数适合在 Vue3 页面中复用日期处理逻辑，尤其适合搜索表单、日期范围按钮、表格展示和响应式日期文本。它可以在工具方法基础上进一步封装页面状态和交互逻辑。

文件位置：`src/composables/useDate.ts`

下面代码基于 `src/utils/date.ts` 封装 Vue3 组合式函数，适合页面组件直接调用。

```typescript
import { computed, ref } from 'vue'
import {
  DATE_FORMAT,
  formatDate,
  formatRelativeTime,
  getCurrentMonthRange,
  getRecentDayRange,
  type DateInput,
  type DateRange,
  type DateFormatValue
} from '@/utils/date'

export function useDate() {
  const dateRange = ref<DateRange>({
    startTime: '',
    endTime: ''
  })

  const hasDateRange = computed(() => {
    return Boolean(dateRange.value.startTime && dateRange.value.endTime)
  })

  /**
   * 格式化日期
   */
  function toDateText(
    value: DateInput,
    format: DateFormatValue = DATE_FORMAT.DATETIME,
    fallback = '-'
  ): string {
    return formatDate(value, format, fallback)
  }

  /**
   * 格式化相对时间
   */
  function toRelativeText(value: DateInput, fallback = '-'): string {
    return formatRelativeTime(value, fallback)
  }

  /**
   * 设置最近 N 天范围
   */
  function setRecentDays(days: number): void {
    dateRange.value = getRecentDayRange(days)
  }

  /**
   * 设置当前月份范围
   */
  function setCurrentMonth(): void {
    dateRange.value = getCurrentMonthRange()
  }

  /**
   * 清空日期范围
   */
  function clearDateRange(): void {
    dateRange.value = {
      startTime: '',
      endTime: ''
    }
  }

  return {
    dateRange,
    hasDateRange,
    toDateText,
    toRelativeText,
    setRecentDays,
    setCurrentMonth,
    clearDateRange
  }
}
```

文件位置：`src/views/example/DayjsComposableExample.vue`

下面组件演示组合式函数在搜索条件区域中的使用方式。

```vue
<template>
  <div class="p-4">
    <div class="mb-4 flex gap-2">
      <button type="button" @click="setRecentDays(7)">最近 7 天</button>
      <button type="button" @click="setRecentDays(30)">最近 30 天</button>
      <button type="button" @click="setCurrentMonth">本月</button>
      <button type="button" @click="clearDateRange">清空</button>
    </div>

    <div class="mb-4">
      <p>开始时间：{{ dateRange.startTime || '-' }}</p>
      <p>结束时间：{{ dateRange.endTime || '-' }}</p>
      <p>是否已选择范围：{{ hasDateRange ? '是' : '否' }}</p>
    </div>

    <div>
      <p>创建时间：{{ toDateText(row.createTime) }}</p>
      <p>相对时间：{{ toRelativeText(row.createTime) }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDate } from '@/composables/useDate'

const {
  dateRange,
  hasDateRange,
  toDateText,
  toRelativeText,
  setRecentDays,
  setCurrentMonth,
  clearDateRange
} = useDate()

const row = {
  createTime: '2026-05-21 10:30:00'
}
</script>
```

组合式函数适合封装页面交互逻辑，工具类适合封装纯函数逻辑。一般建议将日期格式化、校验、范围计算放在 `src/utils/date.ts`，将响应式状态、按钮行为、页面联动放在 `src/composables/useDate.ts`。

### 全局挂载方案

全局挂载可以让组件通过 `$dayjs` 使用 Day.js。该方式适合模板层简单格式化或兼容旧项目，但新项目不建议大量依赖全局属性，因为它会降低代码显式性，也不利于单元测试和按模块维护。

文件位置：`src/plugins/dayjs-global.ts`

下面代码将已完成插件注册的 Day.js 实例挂载到 Vue 应用实例上。

```typescript
import type { App } from 'vue'
import dayjs from '@/plugins/dayjs'

export function setupDayjs(app: App): void {
  app.config.globalProperties.$dayjs = dayjs
}
```

文件位置：`src/types/vue.d.ts`

下面代码为 Vue 全局属性 `$dayjs` 增加 TypeScript 类型声明。

```typescript
import type dayjs from '@/plugins/dayjs'

declare module 'vue' {
  interface ComponentCustomProperties {
    $dayjs: typeof dayjs
  }
}

export {}
```

文件位置：`src/main.ts`

下面代码在应用启动时注册 `$dayjs` 全局属性。

```typescript
import { createApp } from 'vue'
import App from './App.vue'
import { setupDayjs } from '@/plugins/dayjs-global'

const app = createApp(App)

setupDayjs(app)

app.mount('#app')
```

在模板中可以直接使用 `$dayjs`。

```vue
<template>
  <div class="p-4">
    <p>当前时间：{{ $dayjs().format('YYYY-MM-DD HH:mm:ss') }}</p>
    <p>创建时间：{{ $dayjs(createTime).format('YYYY-MM-DD') }}</p>
  </div>
</template>

<script setup lang="ts">
const createTime = '2026-05-21 10:30:00'
</script>
```

全局挂载方案需要控制使用范围。对于复杂业务，仍然推荐使用 `formatDate()`、`useDate()` 这类显式方法，避免模板中堆叠过多日期处理逻辑。

## 常见业务场景

本节用于说明 Day.js 在实际 Vue3 项目中的典型业务用法，包括时间戳格式化、表格日期展示、表单日期处理、相对时间展示和日期范围计算。业务代码应优先调用统一封装方法，避免页面中重复写格式字符串、空值判断和日期边界逻辑。

### 时间戳格式化

后端接口常见时间字段可能是秒级时间戳、毫秒级时间戳或日期字符串。Day.js 支持毫秒时间戳直接解析；对于秒级时间戳，需要先乘以 `1000`，或者使用 Unix 秒级时间戳相关能力。项目中建议显式区分秒和毫秒，避免时间展示偏差。

文件位置：`src/utils/date.ts`

下面代码封装秒级和毫秒级时间戳格式化方法。

```typescript
import dayjs from '@/plugins/dayjs'
import { DATE_FORMAT, type DateFormatValue } from '@/utils/date'

/**
 * 格式化毫秒时间戳
 */
export function formatMillisecondTimestamp(
  value: number | string | null | undefined,
  format: DateFormatValue = DATE_FORMAT.DATETIME,
  fallback = '-'
): string {
  if (value === null || value === undefined || value === '') {
    return fallback
  }

  const timestamp = Number(value)

  if (!Number.isFinite(timestamp)) {
    return fallback
  }

  return dayjs(timestamp).format(format)
}

/**
 * 格式化秒级时间戳
 */
export function formatSecondTimestamp(
  value: number | string | null | undefined,
  format: DateFormatValue = DATE_FORMAT.DATETIME,
  fallback = '-'
): string {
  if (value === null || value === undefined || value === '') {
    return fallback
  }

  const timestamp = Number(value)

  if (!Number.isFinite(timestamp)) {
    return fallback
  }

  return dayjs(timestamp * 1000).format(format)
}
```

调用示例：

```typescript
import { formatMillisecondTimestamp, formatSecondTimestamp } from '@/utils/date'

const millisecondText = formatMillisecondTimestamp(1779330600000)
const secondText = formatSecondTimestamp(1779330600)

console.log(millisecondText)
console.log(secondText)
```

接口字段命名建议明确表达单位，例如 `createTime` 表示日期字符串，`createTimeMs` 表示毫秒时间戳，`createTimeSec` 表示秒级时间戳。不要让同一个字段在不同接口中混用秒和毫秒。

### 表格日期展示

表格日期展示是最常见的业务场景。推荐在表格列中调用统一格式化方法，并对空值、非法日期做兜底处理。如果项目使用 Element Plus，可以在 `el-table-column` 的默认插槽中调用 `formatDate()`。

文件位置：`src/views/order/OrderTable.vue`

下面组件演示在 Element Plus 表格中格式化创建时间、更新时间和过期状态。

```vue
<template>
  <el-table :data="tableData" border>
    <el-table-column prop="orderNo" label="订单号" min-width="160" />

    <el-table-column label="创建时间" min-width="180">
      <template #default="{ row }">
        {{ formatDate(row.createTime) }}
      </template>
    </el-table-column>

    <el-table-column label="更新时间" min-width="180">
      <template #default="{ row }">
        {{ formatDate(row.updateTime) }}
      </template>
    </el-table-column>

    <el-table-column label="过期状态" min-width="120">
      <template #default="{ row }">
        <el-tag :type="isExpired(row.expireTime) ? 'danger' : 'success'">
          {{ isExpired(row.expireTime) ? '已过期' : '有效' }}
        </el-tag>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import { formatDate, isExpired } from '@/utils/date'

interface OrderRow {
  orderNo: string
  createTime: string | null
  updateTime: string | null
  expireTime: string | null
}

const tableData: OrderRow[] = [
  {
    orderNo: 'SO202605210001',
    createTime: '2026-05-21 10:30:00',
    updateTime: '2026-05-21 11:20:00',
    expireTime: '2026-05-31 23:59:59'
  },
  {
    orderNo: 'SO202605210002',
    createTime: null,
    updateTime: '2026-05-22 09:15:00',
    expireTime: '2026-05-22 23:59:59'
  }
]
</script>
```

表格中不建议直接写 `dayjs(row.createTime).format(...)`，原因是每一列都会重复处理空值、非法日期和格式字符串。统一工具函数可以保证所有表格的日期展示规则一致。

### 表单日期处理

表单日期处理通常涉及日期选择器、查询参数和接口提交格式转换。前端页面中可以使用 `Date`、字符串或日期数组作为表单值，但提交给后端前应统一转换为接口约定格式，例如 `YYYY-MM-DD HH:mm:ss`。

文件位置：`src/views/order/OrderSearchForm.vue`

下面组件演示 Element Plus 日期范围选择器与接口查询参数之间的转换。

```vue
<template>
  <el-form :model="queryForm" label-width="90px">
    <el-form-item label="订单时间">
      <el-date-picker
        v-model="queryForm.dateRange"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
        value-format="YYYY-MM-DD HH:mm:ss"
      />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="handleSearch">查询</el-button>
      <el-button @click="handleReset">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

interface QueryForm {
  dateRange: [string, string] | []
}

interface OrderQueryParams {
  startTime?: string
  endTime?: string
}

const queryForm = reactive<QueryForm>({
  dateRange: []
})

function buildQueryParams(): OrderQueryParams {
  const [startTime, endTime] = queryForm.dateRange

  return {
    startTime,
    endTime
  }
}

// 查询前统一构造接口参数
function handleSearch() {
  const params = buildQueryParams()

  console.log('查询参数：', params)
}

// 重置表单日期
function handleReset() {
  queryForm.dateRange = []
}
</script>
```

如果日期选择器没有配置 `value-format`，组件值通常会是 `Date` 对象。此时应在提交前统一格式化。

```typescript
import { DATE_FORMAT, formatDate } from '@/utils/date'

interface QueryForm {
  dateRange: [Date, Date] | []
}

function buildQueryParams(form: QueryForm) {
  const [startTime, endTime] = form.dateRange

  return {
    startTime: startTime ? formatDate(startTime, DATE_FORMAT.DATETIME) : undefined,
    endTime: endTime ? formatDate(endTime, DATE_FORMAT.DATETIME) : undefined
  }
}
```

查询表单建议优先使用日期字符串作为接口参数，不建议把 `Date` 对象直接传给后端。这样可以减少序列化差异、时区偏移和后端解析不一致的问题。

### 相对时间展示

相对时间适合消息列表、通知中心、评论时间、动态流和操作日志等场景。启用 `relativeTime` 插件后，可以使用 `.fromNow()` 直接输出相对于当前时间的文本。相对时间插件提供 `.from()`、`.to()`、`.fromNow()` 和 `.toNow()` 等 API。([Day.js](https://day.js.org/docs/en/plugin/relative-time))

文件位置：`src/utils/date.ts`

下面代码封装相对时间展示方法。

```typescript
import dayjs from '@/plugins/dayjs'
import type { DateInput } from '@/types/date'

/**
 * 格式化相对时间
 */
export function formatRelativeTime(value: DateInput, fallback = '-'): string {
  if (value === null || value === undefined || value === '') {
    return fallback
  }

  const date = dayjs(value)

  if (!date.isValid()) {
    return fallback
  }

  return date.fromNow()
}

/**
 * 格式化相对目标时间
 */
export function formatRelativeFrom(
  value: DateInput,
  target: DateInput,
  withoutSuffix = false,
  fallback = '-'
): string {
  const date = dayjs(value)
  const targetDate = dayjs(target)

  if (!date.isValid() || !targetDate.isValid()) {
    return fallback
  }

  return date.from(targetDate, withoutSuffix)
}
```

文件位置：`src/views/message/MessageList.vue`

下面组件演示消息列表中的相对时间展示。

```vue
<template>
  <div class="p-4">
    <div
      v-for="item in messageList"
      :key="item.id"
      class="mb-3 rounded border p-3"
    >
      <div class="mb-1 font-medium">{{ item.title }}</div>
      <div class="text-sm text-gray-500">
        {{ formatRelativeTime(item.createTime) }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatRelativeTime } from '@/utils/date'

interface MessageItem {
  id: number
  title: string
  createTime: string
}

const messageList: MessageItem[] = [
  {
    id: 1,
    title: '订单已创建',
    createTime: '2026-05-21 10:30:00'
  },
  {
    id: 2,
    title: '订单已支付',
    createTime: '2026-05-21 10:35:00'
  }
]
</script>
```

中文相对时间展示依赖语言包配置，需要在 `src/plugins/dayjs.ts` 中导入 `dayjs/locale/zh-cn` 并调用 `dayjs.locale('zh-cn')`。官方 TypeScript 文档说明，语言包和插件都需要先导入再使用。([Day.js](https://day.js.org/docs/en/installation/typescript))

### 日期范围计算

日期范围计算常用于搜索表单快捷按钮，例如“今天”“昨天”“最近 7 天”“最近 30 天”“本月”“上月”。建议统一封装范围方法，并返回后端接口可直接接收的字符串格式。

文件位置：`src/utils/date-range.ts`

下面代码封装常用日期范围计算方法。

```typescript
import dayjs from '@/plugins/dayjs'
import { DATE_FORMAT } from '@/utils/date'

export interface DateRange {
  startTime: string
  endTime: string
}

/**
 * 获取今天范围
 */
export function getTodayRange(): DateRange {
  return {
    startTime: dayjs().startOf('day').format(DATE_FORMAT.DATETIME),
    endTime: dayjs().endOf('day').format(DATE_FORMAT.DATETIME)
  }
}

/**
 * 获取昨天范围
 */
export function getYesterdayRange(): DateRange {
  const yesterday = dayjs().subtract(1, 'day')

  return {
    startTime: yesterday.startOf('day').format(DATE_FORMAT.DATETIME),
    endTime: yesterday.endOf('day').format(DATE_FORMAT.DATETIME)
  }
}

/**
 * 获取最近 N 天范围，包含今天
 */
export function getRecentDayRange(days: number): DateRange {
  const safeDays = Number.isFinite(days) && days > 0 ? days : 1

  return {
    startTime: dayjs().subtract(safeDays - 1, 'day').startOf('day').format(DATE_FORMAT.DATETIME),
    endTime: dayjs().endOf('day').format(DATE_FORMAT.DATETIME)
  }
}

/**
 * 获取本月范围
 */
export function getCurrentMonthRange(): DateRange {
  return {
    startTime: dayjs().startOf('month').format(DATE_FORMAT.DATETIME),
    endTime: dayjs().endOf('month').format(DATE_FORMAT.DATETIME)
  }
}

/**
 * 获取上月范围
 */
export function getPreviousMonthRange(): DateRange {
  const previousMonth = dayjs().subtract(1, 'month')

  return {
    startTime: previousMonth.startOf('month').format(DATE_FORMAT.DATETIME),
    endTime: previousMonth.endOf('month').format(DATE_FORMAT.DATETIME)
  }
}
```

文件位置：`src/views/report/ReportSearch.vue`

下面组件演示日期范围快捷按钮在报表查询页面中的使用方式。

```vue
<template>
  <div class="p-4">
    <div class="mb-4 flex gap-2">
      <el-button @click="setRange(getTodayRange())">今天</el-button>
      <el-button @click="setRange(getYesterdayRange())">昨天</el-button>
      <el-button @click="setRange(getRecentDayRange(7))">最近 7 天</el-button>
      <el-button @click="setRange(getRecentDayRange(30))">最近 30 天</el-button>
      <el-button @click="setRange(getCurrentMonthRange())">本月</el-button>
      <el-button @click="setRange(getPreviousMonthRange())">上月</el-button>
    </div>

    <el-form :model="queryForm" label-width="90px">
      <el-form-item label="开始时间">
        <el-input v-model="queryForm.startTime" readonly />
      </el-form-item>

      <el-form-item label="结束时间">
        <el-input v-model="queryForm.endTime" readonly />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="handleSearch">查询</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import {
  getCurrentMonthRange,
  getPreviousMonthRange,
  getRecentDayRange,
  getTodayRange,
  getYesterdayRange,
  type DateRange
} from '@/utils/date-range'

interface QueryForm {
  startTime: string
  endTime: string
}

const queryForm = reactive<QueryForm>({
  startTime: '',
  endTime: ''
})

function setRange(range: DateRange): void {
  queryForm.startTime = range.startTime
  queryForm.endTime = range.endTime
}

function handleSearch(): void {
  console.log('报表查询参数：', {
    startTime: queryForm.startTime,
    endTime: queryForm.endTime
  })
}
</script>
```

日期范围计算需要提前和后端约定边界语义。常见规则是开始时间使用 `startOf('day')`，结束时间使用 `endOf('day')`；查询最近 7 天时通常包含今天，因此开始时间应为当前日期往前推 6 天的零点，结束时间为今天的最后一刻。



## 国际化与时区

本节用于说明 Day.js 在 Vue3 + TypeScript 项目中的语言环境、UTC 时间和时区转换处理方式。Day.js 默认只包含英文语言环境；如果需要中文或其他语言，需要按需导入对应语言包，并通过 `dayjs.locale()` 切换语言。官方文档也说明，修改全局语言不会影响已经创建的 Day.js 实例。([Day.js](https://day.js.org/docs/en/i18n/changing-locale))

### 中文语言包配置

中文语言包配置建议集中放在 `src/plugins/dayjs.ts` 中，避免每个组件单独导入语言包。项目初始化时导入 `dayjs/locale/zh-cn`，再调用 `dayjs.locale('zh-cn')` 即可让后续创建的 Day.js 实例默认使用中文语言环境。Day.js 官方 TypeScript 文档也说明，使用语言包和插件时，需要先导入目标语言和插件，再调用对应 API。([Day.js](https://day.js.org/docs/en/installation/typescript))

文件位置：`src/plugins/dayjs.ts`

下面代码用于注册 Day.js 常用插件，并设置中文语言环境。

```typescript
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import relativeTime from 'dayjs/plugin/relativeTime'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import 'dayjs/locale/zh-cn'

// 支持本地化格式，例如 L、LL、LLL、LLLL
dayjs.extend(localizedFormat)

// 支持相对时间，例如“几分钟前”“3 天前”
dayjs.extend(relativeTime)

// 支持 UTC 与时区转换
dayjs.extend(utc)
dayjs.extend(timezone)

// 设置全局中文语言环境
dayjs.locale('zh-cn')

export default dayjs
export type { Dayjs } from 'dayjs'
```

配置完成后，可以在页面或工具方法中直接使用中文语言环境。

```typescript
import dayjs from '@/plugins/dayjs'

const dateText = dayjs('2026-05-21 10:30:00').format('YYYY年MM月DD日 HH:mm:ss')
const relativeText = dayjs('2026-05-21 10:30:00').fromNow()
const localText = dayjs('2026-05-21 10:30:00').format('LLL')

console.log(dateText)
console.log(relativeText)
console.log(localText)
```

如果项目中需要相对时间展示，必须同时注册 `relativeTime` 插件和中文语言包。只导入中文语言包但未注册 `relativeTime` 插件时，`.fromNow()` 这类相对时间 API 不可用。

### 多语言切换

多语言切换适合后台管理系统、国际化官网、跨地区业务系统等场景。Day.js 支持全局语言切换和实例级语言切换。全局切换通过 `dayjs.locale(localeKey)` 完成；实例级切换通过 `dayjs(value).locale(localeKey)` 完成。官方文档说明，切换全局语言不会影响已经存在的 Day.js 实例，因此在 Vue 页面中建议通过响应式状态重新计算展示文本。([Day.js](https://day.js.org/docs/en/i18n/changing-locale))

文件位置：`src/plugins/dayjs-locale.ts`

下面代码使用显式映射加载语言包，适合 Vite 项目中按需切换语言。

```typescript
import dayjs from '@/plugins/dayjs'

export type DayjsLocale = 'zh-cn' | 'en' | 'ja'

const localeLoaders: Record<DayjsLocale, () => Promise<unknown>> = {
  'zh-cn': () => import('dayjs/locale/zh-cn'),
  en: () => Promise.resolve(),
  ja: () => import('dayjs/locale/ja')
}

/**
 * 切换 Day.js 全局语言环境
 */
export async function setDayjsLocale(locale: DayjsLocale): Promise<void> {
  const loader = localeLoaders[locale]

  await loader()

  dayjs.locale(locale)
}

/**
 * 获取当前 Day.js 语言环境
 */
export function getDayjsLocale(): string {
  return dayjs.locale()
}
```

文件位置：`src/composables/useDayjsLocale.ts`

下面代码封装 Vue3 中的 Day.js 语言切换逻辑。

```typescript
import { computed, ref } from 'vue'
import { getDayjsLocale, setDayjsLocale, type DayjsLocale } from '@/plugins/dayjs-locale'

export function useDayjsLocale() {
  const currentLocale = ref<DayjsLocale>((getDayjsLocale() || 'zh-cn') as DayjsLocale)
  const loading = ref(false)

  const localeText = computed(() => {
    const localeMap: Record<DayjsLocale, string> = {
      'zh-cn': '简体中文',
      en: 'English',
      ja: '日本語'
    }

    return localeMap[currentLocale.value]
  })

  /**
   * 切换语言环境
   */
  async function changeLocale(locale: DayjsLocale): Promise<void> {
    loading.value = true

    try {
      await setDayjsLocale(locale)
      currentLocale.value = locale
    } finally {
      loading.value = false
    }
  }

  return {
    currentLocale,
    localeText,
    loading,
    changeLocale
  }
}
```

文件位置：`src/views/example/DayjsLocaleExample.vue`

下面组件演示多语言切换后重新渲染日期文本。

```vue
<template>
  <div class="p-4">
    <div class="mb-4 flex gap-2">
      <el-button :loading="loading" @click="changeLocale('zh-cn')">中文</el-button>
      <el-button :loading="loading" @click="changeLocale('en')">English</el-button>
      <el-button :loading="loading" @click="changeLocale('ja')">日本語</el-button>
    </div>

    <p>当前语言：{{ localeText }}</p>
    <p>本地化日期：{{ localDateText }}</p>
    <p>相对时间：{{ relativeText }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import dayjs from '@/plugins/dayjs'
import { useDayjsLocale } from '@/composables/useDayjsLocale'

const { localeText, loading, changeLocale } = useDayjsLocale()

const dateValue = '2026-05-21 10:30:00'

const localDateText = computed(() => dayjs(dateValue).format('LLL'))
const relativeText = computed(() => dayjs(dateValue).fromNow())
</script>
```

多语言项目中，建议将 Day.js 的语言切换与 `vue-i18n` 的语言切换放在同一个入口方法中处理，避免页面文案已经切换，但日期、星期、月份或相对时间仍然使用旧语言。

### UTC 时间处理

UTC 时间处理适用于前后端统一使用 UTC 存储、跨时区系统、日志时间、审计时间和国际化业务。Day.js 默认按本地时间解析和展示；如果需要按 UTC 模式解析或展示，应使用 `dayjs.utc()` 或 `.utc()`。UTC 插件会为 Day.js 增加 `.utc()`、`.local()`、`.isUTC()` 和 `.utcOffset()` 等 API。([Day.js](https://day.js.org/docs/en/plugin/utc))

文件位置：`src/plugins/dayjs.ts`

下面代码注册 UTC 插件。

```typescript
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

export default dayjs
export type { Dayjs } from 'dayjs'
```

文件位置：`src/utils/date-utc.ts`

下面代码封装 UTC 与本地时间之间的常用转换方法。

```typescript
import dayjs from '@/plugins/dayjs'
import type { Dayjs } from 'dayjs'

export const UTC_DATE_FORMAT = {
  ISO: 'YYYY-MM-DDTHH:mm:ss[Z]',
  DATETIME: 'YYYY-MM-DD HH:mm:ss',
  DATE: 'YYYY-MM-DD'
} as const

export type UtcDateFormatValue = (typeof UTC_DATE_FORMAT)[keyof typeof UTC_DATE_FORMAT]
export type DateInput = string | number | Date | Dayjs | null | undefined

/**
 * 判断日期是否有效
 */
export function isValidUtcDate(value: DateInput): boolean {
  if (value === null || value === undefined || value === '') {
    return false
  }

  return dayjs(value).isValid()
}

/**
 * 将本地时间转换为 UTC 字符串
 */
export function toUtcText(
  value: DateInput,
  format: UtcDateFormatValue = UTC_DATE_FORMAT.ISO,
  fallback = '-'
): string {
  if (!isValidUtcDate(value)) {
    return fallback
  }

  return dayjs(value).utc().format(format)
}

/**
 * 将 UTC 时间转换为本地时间字符串
 */
export function utcToLocalText(
  value: DateInput,
  format: UtcDateFormatValue = UTC_DATE_FORMAT.DATETIME,
  fallback = '-'
): string {
  if (!isValidUtcDate(value)) {
    return fallback
  }

  return dayjs.utc(value).local().format(format)
}

/**
 * 判断当前日期对象是否处于 UTC 模式
 */
export function isUtcMode(value: DateInput): boolean {
  if (!isValidUtcDate(value)) {
    return false
  }

  return dayjs.utc(value).isUTC()
}
```

调用示例：

```typescript
import { toUtcText, utcToLocalText } from '@/utils/date-utc'

const localTime = '2026-05-21 10:30:00'

const utcText = toUtcText(localTime)
const localText = utcToLocalText('2026-05-21T01:30:00Z')

console.log(utcText)
console.log(localText)
```

UTC 处理需要明确数据语义。`dayjs(value).utc()` 表示先按本地时间理解 `value`，再转换为 UTC；`dayjs.utc(value)` 表示直接按 UTC 模式解析 `value`。如果后端返回的是 ISO UTC 字符串，例如 `2026-05-21T01:30:00Z`，前端展示本地时间时建议使用 `dayjs.utc(value).local()`。

### 时区转换处理

时区转换适用于跨地区会议、海外业务、国际化订单、全球运营看板和多地区日志展示。Day.js 的 `timezone` 插件依赖 `utc` 插件，必须先注册 `utc`，再注册 `timezone`。该插件会增加 `dayjs.tz()`、`.tz()`、`dayjs.tz.guess()` 和 `dayjs.tz.setDefault()` 等 API。([Day.js](https://day.js.org/docs/en/plugin/timezone))

文件位置：`src/plugins/dayjs.ts`

下面代码注册 UTC 和 timezone 插件。

```typescript
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

export default dayjs
export type { Dayjs } from 'dayjs'
```

文件位置：`src/utils/date-timezone.ts`

下面代码封装常见时区转换方法。

```typescript
import dayjs from '@/plugins/dayjs'
import type { Dayjs } from 'dayjs'

export const TIMEZONE = {
  SHANGHAI: 'Asia/Shanghai',
  TOKYO: 'Asia/Tokyo',
  NEW_YORK: 'America/New_York',
  LONDON: 'Europe/London',
  UTC: 'UTC'
} as const

export const TIMEZONE_DATE_FORMAT = {
  DATETIME: 'YYYY-MM-DD HH:mm:ss',
  ISO: 'YYYY-MM-DDTHH:mm:ssZ'
} as const

export type TimezoneValue = (typeof TIMEZONE)[keyof typeof TIMEZONE]
export type TimezoneDateFormatValue = (typeof TIMEZONE_DATE_FORMAT)[keyof typeof TIMEZONE_DATE_FORMAT]
export type DateInput = string | number | Date | Dayjs | null | undefined

/**
 * 获取用户当前时区
 */
export function getUserTimezone(): string {
  return dayjs.tz.guess()
}

/**
 * 将时间转换为指定时区展示
 */
export function formatTimezoneDate(
  value: DateInput,
  timezone: TimezoneValue | string = TIMEZONE.SHANGHAI,
  format: TimezoneDateFormatValue = TIMEZONE_DATE_FORMAT.DATETIME,
  fallback = '-'
): string {
  if (value === null || value === undefined || value === '') {
    return fallback
  }

  const date = dayjs(value)

  if (!date.isValid()) {
    return fallback
  }

  return date.tz(timezone).format(format)
}

/**
 * 按指定时区解析时间
 */
export function parseInTimezone(
  value: string,
  timezone: TimezoneValue | string = TIMEZONE.SHANGHAI,
  format = TIMEZONE_DATE_FORMAT.DATETIME
): string {
  const date = dayjs.tz(value, timezone)

  if (!date.isValid()) {
    return ''
  }

  return date.format(format)
}

/**
 * 设置默认时区
 */
export function setDefaultTimezone(timezone?: TimezoneValue | string): void {
  dayjs.tz.setDefault(timezone)
}
```

调用示例：

```typescript
import {
  TIMEZONE,
  formatTimezoneDate,
  getUserTimezone,
  parseInTimezone,
  setDefaultTimezone
} from '@/utils/date-timezone'

const userTimezone = getUserTimezone()

const tokyoText = formatTimezoneDate('2026-05-21T01:30:00Z', TIMEZONE.TOKYO)
const shanghaiText = formatTimezoneDate('2026-05-21T01:30:00Z', TIMEZONE.SHANGHAI)
const parsedText = parseInTimezone('2026-05-21 10:30:00', TIMEZONE.TOKYO)

setDefaultTimezone(TIMEZONE.SHANGHAI)

console.log(userTimezone)
console.log(tokyoText)
console.log(shanghaiText)
console.log(parsedText)
```

需要注意，Day.js 官方文档说明，即使设置了默认时区，`dayjs(dateValue)` 仍然使用本地时区；只有 `dayjs.tz(dateValue)` 在未显式传入第二个参数时才会使用默认时区。跨时区业务中，不建议隐式依赖默认时区，应优先在关键转换方法中显式传入目标时区。([Day.js](https://day.js.org/docs/en/plugin/timezone))

## TypeScript 开发规范

本节用于约定 Vue3 + TypeScript 项目中 Day.js 的类型定义、返回值约束、工具方法声明和空值异常处理规则。Day.js NPM 包内置 TypeScript 类型声明，不需要额外安装 `@types/dayjs`；如果项目启用了 `esModuleInterop` 和 `allowSyntheticDefaultImports`，可以使用 `import dayjs from 'dayjs'`，否则需要使用 `import * as dayjs from 'dayjs'`。([Day.js](https://day.js.org/docs/en/installation/typescript))

### 日期参数类型定义

日期工具方法的入参应覆盖项目中常见来源，包括接口字符串、时间戳、原生 `Date`、Day.js 对象、空值和未定义值。建议统一定义 `DateInput`，所有日期工具方法都复用该类型。

文件位置：`src/types/date.ts`

下面代码定义日期工具的基础类型。

```typescript
import type { Dayjs, ManipulateType, OpUnitType } from 'dayjs'

export type DateInput = string | number | Date | Dayjs | null | undefined

export type DateRangeInput = [DateInput, DateInput]

export type DateFormat = string

export type DateUnit = OpUnitType

export type DateManipulateUnit = ManipulateType

export interface DateRange {
  startTime: string
  endTime: string
}

export interface DateFormatOptions {
  format?: DateFormat
  fallback?: string
}

export interface DateRangeOptions {
  format?: DateFormat
  includeToday?: boolean
}
```

如果项目对格式要求严格，可以进一步把常用格式收敛为常量和联合类型。

文件位置：`src/constants/date.ts`

```typescript
export const DATE_FORMAT = {
  DATE: 'YYYY-MM-DD',
  DATETIME: 'YYYY-MM-DD HH:mm:ss',
  TIME: 'HH:mm:ss',
  MONTH: 'YYYY-MM',
  YEAR: 'YYYY',
  ISO_SECOND: 'YYYY-MM-DDTHH:mm:ssZ'
} as const

export type DateFormatValue = (typeof DATE_FORMAT)[keyof typeof DATE_FORMAT]
```

在业务工具中，推荐使用 `DateInput` 作为入参，使用 `DateFormatValue` 约束项目内置格式。

```typescript
import dayjs from '@/plugins/dayjs'
import { DATE_FORMAT, type DateFormatValue } from '@/constants/date'
import type { DateInput } from '@/types/date'

export function formatDate(
  value: DateInput,
  format: DateFormatValue = DATE_FORMAT.DATETIME,
  fallback = '-'
): string {
  if (value === null || value === undefined || value === '') {
    return fallback
  }

  const date = dayjs(value)

  return date.isValid() ? date.format(format) : fallback
}
```

对于通用基础设施代码，可以允许 `format` 使用 `string`；对于业务页面代码，建议优先使用 `DateFormatValue`，避免格式字符串散落在组件中。

### 返回值类型约束

日期工具方法应有明确返回值，不建议返回 `any` 或混合返回类型。格式化方法返回 `string`，判断方法返回 `boolean`，解析方法返回 `Dayjs | null`，范围方法返回结构化对象。这样可以减少 Vue 模板、表单参数和接口调用中的类型分支。

文件位置：`src/utils/date-return.ts`

下面代码展示常见日期工具方法的返回值约束方式。

```typescript
import dayjs from '@/plugins/dayjs'
import type { Dayjs } from 'dayjs'
import { DATE_FORMAT, type DateFormatValue } from '@/constants/date'
import type { DateInput, DateRange } from '@/types/date'

/**
 * 解析日期，失败时返回 null
 */
export function parseDate(value: DateInput): Dayjs | null {
  if (value === null || value === undefined || value === '') {
    return null
  }

  const date = dayjs(value)

  return date.isValid() ? date : null
}

/**
 * 格式化日期，失败时返回兜底文本
 */
export function toDateText(
  value: DateInput,
  format: DateFormatValue = DATE_FORMAT.DATETIME,
  fallback = '-'
): string {
  const date = parseDate(value)

  return date ? date.format(format) : fallback
}

/**
 * 判断日期是否已过期
 */
export function toExpired(value: DateInput): boolean {
  const date = parseDate(value)

  if (!date) {
    return false
  }

  return dayjs().isAfter(date)
}

/**
 * 获取今天的日期范围
 */
export function toTodayRange(): DateRange {
  return {
    startTime: dayjs().startOf('day').format(DATE_FORMAT.DATETIME),
    endTime: dayjs().endOf('day').format(DATE_FORMAT.DATETIME)
  }
}
```

推荐返回值规则如下。

| 方法类型       | 推荐返回值      | 示例                                     |
| -------------- | --------------- | ---------------------------------------- |
| 格式化         | `string`        | `formatDate()`、`formatRelativeTime()`   |
| 解析           | `Dayjs | null`  | `parseDate()`、`parseDateStrict()`       |
| 校验           | `boolean`       | `isValidDate()`、`isExpired()`           |
| 范围计算       | `DateRange`     | `getTodayRange()`、`getRecentDayRange()` |
| 转换为接口参数 | 明确的 DTO 类型 | `buildDateQueryParams()`                 |

不建议让一个工具方法同时返回 `string | null | undefined | Dayjs`。如果业务确实需要不同返回值，应拆成多个方法，例如 `parseDate()` 返回 `Dayjs | null`，`formatDate()` 返回 `string`。

### 工具方法类型声明

日期工具方法应尽量保持“纯函数”风格：输入明确，输出明确，不直接修改外部状态。涉及 Vue 响应式状态的逻辑放到 `composables` 中，涉及日期计算和格式化的逻辑放到 `utils` 中。

文件位置：`src/utils/date.ts`

下面代码给出一个较完整的 TypeScript 日期工具方法声明示例。

```typescript
import dayjs from '@/plugins/dayjs'
import type { Dayjs } from 'dayjs'
import { DATE_FORMAT, type DateFormatValue } from '@/constants/date'
import type { DateInput, DateRange } from '@/types/date'

/**
 * 判断日期是否有效
 */
export function isValidDate(value: DateInput): boolean {
  if (value === null || value === undefined || value === '') {
    return false
  }

  return dayjs(value).isValid()
}

/**
 * 解析日期
 */
export function parseDate(value: DateInput): Dayjs | null {
  if (!isValidDate(value)) {
    return null
  }

  return dayjs(value)
}

/**
 * 格式化日期
 */
export function formatDate(
  value: DateInput,
  format: DateFormatValue = DATE_FORMAT.DATETIME,
  fallback = '-'
): string {
  const date = parseDate(value)

  return date ? date.format(format) : fallback
}

/**
 * 格式化日期范围
 */
export function formatDateRange(
  startTime: DateInput,
  endTime: DateInput,
  format: DateFormatValue = DATE_FORMAT.DATETIME,
  fallback = '-'
): DateRange {
  return {
    startTime: formatDate(startTime, format, fallback),
    endTime: formatDate(endTime, format, fallback)
  }
}

/**
 * 判断日期是否处于闭区间范围内
 */
export function isBetweenDate(
  value: DateInput,
  startTime: DateInput,
  endTime: DateInput
): boolean {
  const current = parseDate(value)
  const start = parseDate(startTime)
  const end = parseDate(endTime)

  if (!current || !start || !end) {
    return false
  }

  return current.isBetween(start, end, 'second', '[]')
}

/**
 * 获取最近 N 天范围，包含今天
 */
export function getRecentDayRange(days: number): DateRange {
  const safeDays = Number.isFinite(days) && days > 0 ? days : 1

  return {
    startTime: dayjs().subtract(safeDays - 1, 'day').startOf('day').format(DATE_FORMAT.DATETIME),
    endTime: dayjs().endOf('day').format(DATE_FORMAT.DATETIME)
  }
}
```

文件位置：`src/composables/useDateFormatter.ts`

下面代码将工具方法封装为 Vue3 组合式函数，适合页面中复用。

```typescript
import { computed, type Ref } from 'vue'
import { DATE_FORMAT, type DateFormatValue } from '@/constants/date'
import { formatDate } from '@/utils/date'
import type { DateInput } from '@/types/date'

export function useDateFormatter(
  value: Ref<DateInput>,
  format: DateFormatValue = DATE_FORMAT.DATETIME,
  fallback = '-'
) {
  const dateText = computed(() => formatDate(value.value, format, fallback))

  return {
    dateText
  }
}
```

页面中调用时，组合式函数负责响应式计算，工具方法负责日期处理。

```vue
<template>
  <div class="p-4">
    <p>创建时间：{{ dateText }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDateFormatter } from '@/composables/useDateFormatter'

const createTime = ref('2026-05-21 10:30:00')

const { dateText } = useDateFormatter(createTime)
</script>
```

### 空值与异常处理

日期处理中的空值和异常值需要统一处理。接口字段可能返回 `null`、空字符串、非法字符串、秒级时间戳、毫秒级时间戳或不符合约定的日期格式。工具方法应在入口处统一判断，避免页面组件中反复写兜底逻辑。

文件位置：`src/utils/date-safe.ts`

下面代码提供空值、非法日期和时间戳单位的安全处理示例。

```typescript
import dayjs from '@/plugins/dayjs'
import { DATE_FORMAT, type DateFormatValue } from '@/constants/date'
import type { DateInput } from '@/types/date'

export type TimestampUnit = 'second' | 'millisecond'

/**
 * 判断值是否为空日期
 */
export function isEmptyDate(value: DateInput): boolean {
  return value === null || value === undefined || value === ''
}

/**
 * 安全格式化日期
 */
export function safeFormatDate(
  value: DateInput,
  format: DateFormatValue = DATE_FORMAT.DATETIME,
  fallback = '-'
): string {
  if (isEmptyDate(value)) {
    return fallback
  }

  const date = dayjs(value)

  if (!date.isValid()) {
    return fallback
  }

  return date.format(format)
}

/**
 * 安全格式化时间戳
 */
export function safeFormatTimestamp(
  value: number | string | null | undefined,
  unit: TimestampUnit = 'millisecond',
  format: DateFormatValue = DATE_FORMAT.DATETIME,
  fallback = '-'
): string {
  if (value === null || value === undefined || value === '') {
    return fallback
  }

  const timestamp = Number(value)

  if (!Number.isFinite(timestamp)) {
    return fallback
  }

  const millisecondTimestamp = unit === 'second' ? timestamp * 1000 : timestamp
  const date = dayjs(millisecondTimestamp)

  return date.isValid() ? date.format(format) : fallback
}

/**
 * 安全构建接口日期范围参数
 */
export function safeBuildDateRangeParams(
  range: [DateInput, DateInput] | null | undefined
): { startTime?: string; endTime?: string } {
  if (!range || range.length !== 2) {
    return {}
  }

  const [startTime, endTime] = range

  const startText = safeFormatDate(startTime)
  const endText = safeFormatDate(endTime)

  if (startText === '-' || endText === '-') {
    return {}
  }

  return {
    startTime: startText,
    endTime: endText
  }
}
```

文件位置：`src/views/example/DayjsSafeExample.vue`

下面组件演示空值和异常日期的页面兜底展示。

```vue
<template>
  <div class="p-4">
    <p>正常日期：{{ safeFormatDate(row.createTime) }}</p>
    <p>空日期：{{ safeFormatDate(row.emptyTime) }}</p>
    <p>非法日期：{{ safeFormatDate(row.errorTime) }}</p>
    <p>秒级时间戳：{{ safeFormatTimestamp(row.secondTimestamp, 'second') }}</p>
    <p>毫秒时间戳：{{ safeFormatTimestamp(row.millisecondTimestamp, 'millisecond') }}</p>
  </div>
</template>

<script setup lang="ts">
import { safeFormatDate, safeFormatTimestamp } from '@/utils/date-safe'

const row = {
  createTime: '2026-05-21 10:30:00',
  emptyTime: null,
  errorTime: 'invalid-date',
  secondTimestamp: 1779330600,
  millisecondTimestamp: 1779330600000
}
</script>
```

推荐约定如下：展示层无效日期统一返回 `'-'`；接口参数无效日期不传字段或传 `undefined`；解析方法失败返回 `null`；判断方法失败返回 `false`；范围方法失败返回空对象或默认范围。这样可以保持页面展示、接口请求和业务判断的一致性。



## Vue3 实战封装

本节给出一个可直接放入 Vue3 + TypeScript 项目的 Day.js 实战封装方案。整体思路是：插件只注册一次，格式常量统一维护，工具函数按职责拆分，页面组件只调用业务语义明确的方法。Day.js 的 `format()` 方法通过格式 token 输出日期文本，常用 token 包括 `YYYY`、`MM`、`DD`、`HH`、`mm`、`ss` 等；如果使用 `L`、`LL`、`LLL` 这类本地化格式，需要注册 `LocalizedFormat` 插件。([Day.js](https://day.js.org/docs/en/display/format))

### 日期格式化工具封装

日期格式化工具用于统一处理日期字符串、时间戳、`Date` 对象和 Day.js 对象，并对空值、非法日期进行兜底。项目中不建议在组件中重复写 `dayjs(value).format(...)`，应统一从工具函数入口调用。

推荐文件结构如下。

```text
src
├── constants
│   └── date.ts
├── plugins
│   └── dayjs.ts
├── types
│   └── date.ts
└── utils
    └── date-format.ts
```

文件位置：`src/constants/date.ts`

下面代码统一维护项目中的日期格式常量，避免格式字符串散落在页面组件中。

```typescript
export const DATE_FORMAT = {
  DATE: 'YYYY-MM-DD',
  DATETIME: 'YYYY-MM-DD HH:mm:ss',
  TIME: 'HH:mm:ss',
  MONTH: 'YYYY-MM',
  YEAR: 'YYYY',
  ISO_SECOND: 'YYYY-MM-DDTHH:mm:ssZ'
} as const

export type DateFormatValue = (typeof DATE_FORMAT)[keyof typeof DATE_FORMAT]
```

文件位置：`src/types/date.ts`

下面代码统一定义日期工具的入参类型和范围类型。

```typescript
import type { Dayjs } from 'dayjs'

export type DateInput = string | number | Date | Dayjs | null | undefined

export interface DateRange {
  startTime: string
  endTime: string
}

export type TimestampUnit = 'second' | 'millisecond'
```

文件位置：`src/plugins/dayjs.ts`

下面代码集中注册 Day.js 插件和中文语言包，后续业务代码统一从该文件导入。

```typescript
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import relativeTime from 'dayjs/plugin/relativeTime'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import isBetween from 'dayjs/plugin/isBetween'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import 'dayjs/locale/zh-cn'

// 支持按指定格式解析字符串日期
dayjs.extend(customParseFormat)

// 支持本地化格式，例如 L、LL、LLL、LLLL
dayjs.extend(localizedFormat)

// 支持相对时间，例如“几分钟前”“3 天前”
dayjs.extend(relativeTime)

// timezone 依赖 utc，需要先注册 utc
dayjs.extend(utc)
dayjs.extend(timezone)

// 支持日期范围和边界比较
dayjs.extend(isBetween)
dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)

// 设置默认中文语言环境
dayjs.locale('zh-cn')

export default dayjs
export type { Dayjs } from 'dayjs'
```

文件位置：`src/utils/date-format.ts`

下面代码封装日期有效性判断、日期格式化、时间戳格式化和接口日期文本转换。

```typescript
import dayjs from '@/plugins/dayjs'
import { DATE_FORMAT, type DateFormatValue } from '@/constants/date'
import type { DateInput, TimestampUnit } from '@/types/date'

/**
 * 判断日期值是否为空
 */
export function isEmptyDate(value: DateInput): boolean {
  return value === null || value === undefined || value === ''
}

/**
 * 判断日期值是否有效
 */
export function isValidDate(value: DateInput): boolean {
  if (isEmptyDate(value)) {
    return false
  }

  return dayjs(value).isValid()
}

/**
 * 格式化日期
 */
export function formatDate(
  value: DateInput,
  format: DateFormatValue = DATE_FORMAT.DATETIME,
  fallback = '-'
): string {
  if (!isValidDate(value)) {
    return fallback
  }

  return dayjs(value).format(format)
}

/**
 * 格式化日期为日期文本
 */
export function formatDateOnly(value: DateInput, fallback = '-'): string {
  return formatDate(value, DATE_FORMAT.DATE, fallback)
}

/**
 * 格式化日期为日期时间文本
 */
export function formatDateTime(value: DateInput, fallback = '-'): string {
  return formatDate(value, DATE_FORMAT.DATETIME, fallback)
}

/**
 * 格式化时间戳
 */
export function formatTimestamp(
  value: number | string | null | undefined,
  unit: TimestampUnit = 'millisecond',
  format: DateFormatValue = DATE_FORMAT.DATETIME,
  fallback = '-'
): string {
  if (value === null || value === undefined || value === '') {
    return fallback
  }

  const timestamp = Number(value)

  if (!Number.isFinite(timestamp)) {
    return fallback
  }

  const millisecondTimestamp = unit === 'second' ? timestamp * 1000 : timestamp

  return formatDate(millisecondTimestamp, format, fallback)
}

/**
 * 转换为接口日期时间字符串
 */
export function toApiDateTime(value: DateInput): string | undefined {
  if (!isValidDate(value)) {
    return undefined
  }

  return dayjs(value).format(DATE_FORMAT.DATETIME)
}
```

### 日期范围工具封装

日期范围工具用于处理查询表单中的快捷时间范围，例如今天、昨天、最近 7 天、本月和上月。范围工具应返回后端接口可直接接收的字符串，避免页面中重复调用 `startOf()`、`endOf()` 和 `format()`。

文件位置：`src/utils/date-range.ts`

下面代码封装常用日期范围计算和范围参数转换。

```typescript
import dayjs from '@/plugins/dayjs'
import { DATE_FORMAT } from '@/constants/date'
import type { DateInput, DateRange } from '@/types/date'
import { isValidDate } from '@/utils/date-format'

/**
 * 获取今天日期范围
 */
export function getTodayRange(): DateRange {
  return {
    startTime: dayjs().startOf('day').format(DATE_FORMAT.DATETIME),
    endTime: dayjs().endOf('day').format(DATE_FORMAT.DATETIME)
  }
}

/**
 * 获取昨天日期范围
 */
export function getYesterdayRange(): DateRange {
  const yesterday = dayjs().subtract(1, 'day')

  return {
    startTime: yesterday.startOf('day').format(DATE_FORMAT.DATETIME),
    endTime: yesterday.endOf('day').format(DATE_FORMAT.DATETIME)
  }
}

/**
 * 获取最近 N 天日期范围，包含今天
 */
export function getRecentDayRange(days: number): DateRange {
  const safeDays = Number.isFinite(days) && days > 0 ? Math.floor(days) : 1

  return {
    startTime: dayjs().subtract(safeDays - 1, 'day').startOf('day').format(DATE_FORMAT.DATETIME),
    endTime: dayjs().endOf('day').format(DATE_FORMAT.DATETIME)
  }
}

/**
 * 获取本月日期范围
 */
export function getCurrentMonthRange(): DateRange {
  return {
    startTime: dayjs().startOf('month').format(DATE_FORMAT.DATETIME),
    endTime: dayjs().endOf('month').format(DATE_FORMAT.DATETIME)
  }
}

/**
 * 获取上月日期范围
 */
export function getPreviousMonthRange(): DateRange {
  const previousMonth = dayjs().subtract(1, 'month')

  return {
    startTime: previousMonth.startOf('month').format(DATE_FORMAT.DATETIME),
    endTime: previousMonth.endOf('month').format(DATE_FORMAT.DATETIME)
  }
}

/**
 * 构建自定义日期范围
 */
export function buildDateRange(startTime: DateInput, endTime: DateInput): DateRange | null {
  if (!isValidDate(startTime) || !isValidDate(endTime)) {
    return null
  }

  return {
    startTime: dayjs(startTime).format(DATE_FORMAT.DATETIME),
    endTime: dayjs(endTime).format(DATE_FORMAT.DATETIME)
  }
}

/**
 * 判断目标时间是否在闭区间范围内
 */
export function isInClosedRange(value: DateInput, startTime: DateInput, endTime: DateInput): boolean {
  if (!isValidDate(value) || !isValidDate(startTime) || !isValidDate(endTime)) {
    return false
  }

  return dayjs(value).isBetween(dayjs(startTime), dayjs(endTime), 'second', '[]')
}
```

日期范围工具中，“最近 N 天”通常应包含今天。例如最近 7 天表示从今天往前推 6 天的 `00:00:00` 到今天的 `23:59:59`。这个约定需要在前后端接口文档中明确，避免统计口径不一致。

### 相对时间工具封装

相对时间工具用于消息、通知、动态流、评论、操作日志等场景。Day.js 的 `relativeTime` 插件会增加 `.from()`、`.to()`、`.fromNow()` 和 `.toNow()` 等 API，用于生成相对时间字符串。([Day.js](https://day.js.org/docs/en/plugin/relative-time))

文件位置：`src/utils/date-relative.ts`

下面代码封装相对时间展示、相对目标时间展示和超过指定分钟数判断。

```typescript
import dayjs from '@/plugins/dayjs'
import type { DateInput } from '@/types/date'
import { isValidDate } from '@/utils/date-format'

/**
 * 格式化为相对当前时间
 */
export function formatRelativeTime(value: DateInput, fallback = '-'): string {
  if (!isValidDate(value)) {
    return fallback
  }

  return dayjs(value).fromNow()
}

/**
 * 格式化为相对目标时间
 */
export function formatRelativeFrom(
  value: DateInput,
  target: DateInput,
  withoutSuffix = false,
  fallback = '-'
): string {
  if (!isValidDate(value) || !isValidDate(target)) {
    return fallback
  }

  return dayjs(value).from(dayjs(target), withoutSuffix)
}

/**
 * 判断是否超过指定分钟数
 */
export function isOverMinutes(value: DateInput, minutes: number): boolean {
  if (!isValidDate(value) || !Number.isFinite(minutes)) {
    return false
  }

  return dayjs().diff(dayjs(value), 'minute') > minutes
}
```

文件位置：`src/composables/useDate.ts`

下面代码将格式化、范围和相对时间工具整合为 Vue3 组合式函数，便于页面组件调用。

```typescript
import { computed, ref } from 'vue'
import { DATE_FORMAT, type DateFormatValue } from '@/constants/date'
import type { DateInput, DateRange } from '@/types/date'
import { formatDate, formatDateTime } from '@/utils/date-format'
import {
  getCurrentMonthRange,
  getRecentDayRange,
  getTodayRange,
  getYesterdayRange
} from '@/utils/date-range'
import { formatRelativeTime } from '@/utils/date-relative'

export function useDate() {
  const dateRange = ref<DateRange>({
    startTime: '',
    endTime: ''
  })

  const hasDateRange = computed(() => {
    return Boolean(dateRange.value.startTime && dateRange.value.endTime)
  })

  /**
   * 格式化日期
   */
  function toDateText(
    value: DateInput,
    format: DateFormatValue = DATE_FORMAT.DATETIME,
    fallback = '-'
  ): string {
    return formatDate(value, format, fallback)
  }

  /**
   * 格式化日期时间
   */
  function toDateTimeText(value: DateInput, fallback = '-'): string {
    return formatDateTime(value, fallback)
  }

  /**
   * 格式化相对时间
   */
  function toRelativeText(value: DateInput, fallback = '-'): string {
    return formatRelativeTime(value, fallback)
  }

  /**
   * 设置今天范围
   */
  function setTodayRange(): void {
    dateRange.value = getTodayRange()
  }

  /**
   * 设置昨天范围
   */
  function setYesterdayRange(): void {
    dateRange.value = getYesterdayRange()
  }

  /**
   * 设置最近 N 天范围
   */
  function setRecentDaysRange(days: number): void {
    dateRange.value = getRecentDayRange(days)
  }

  /**
   * 设置本月范围
   */
  function setCurrentMonthRange(): void {
    dateRange.value = getCurrentMonthRange()
  }

  /**
   * 清空日期范围
   */
  function clearDateRange(): void {
    dateRange.value = {
      startTime: '',
      endTime: ''
    }
  }

  return {
    dateRange,
    hasDateRange,
    toDateText,
    toDateTimeText,
    toRelativeText,
    setTodayRange,
    setYesterdayRange,
    setRecentDaysRange,
    setCurrentMonthRange,
    clearDateRange
  }
}
```

### 业务组件调用示例

业务组件应尽量调用 `useDate()` 或工具函数，而不是直接在模板中写大量 Day.js 逻辑。这样可以保证表格展示、查询参数、相对时间和日期范围的处理规则一致。

文件位置：`src/views/order/OrderList.vue`

下面组件演示订单列表中日期格式化、相对时间、过期状态和快捷日期范围查询的完整用法。

```vue
<template>
  <div class="p-4">
    <el-card shadow="never">
      <template #header>
        <div class="flex items-center justify-between">
          <span>订单列表</span>
          <span class="text-sm text-gray-500">
            当前查询范围：{{ dateRange.startTime || '-' }} 至 {{ dateRange.endTime || '-' }}
          </span>
        </div>
      </template>

      <el-form :model="queryForm" inline>
        <el-form-item label="订单号">
          <el-input v-model="queryForm.orderNo" placeholder="请输入订单号" clearable />
        </el-form-item>

        <el-form-item label="订单时间">
          <el-date-picker
            v-model="queryForm.dateRange"
            type="datetimerange"
            value-format="YYYY-MM-DD HH:mm:ss"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          />
        </el-form-item>

        <el-form-item>
          <el-button @click="setTodayRange">今天</el-button>
          <el-button @click="setRecentDaysRange(7)">最近 7 天</el-button>
          <el-button @click="setCurrentMonthRange">本月</el-button>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="tableData" border>
        <el-table-column prop="orderNo" label="订单号" min-width="160" />

        <el-table-column label="创建时间" min-width="180">
          <template #default="{ row }">
            {{ toDateTimeText(row.createTime) }}
          </template>
        </el-table-column>

        <el-table-column label="更新时间" min-width="180">
          <template #default="{ row }">
            {{ toRelativeText(row.updateTime) }}
          </template>
        </el-table-column>

        <el-table-column label="过期状态" min-width="120">
          <template #default="{ row }">
            <el-tag :type="row.expired ? 'danger' : 'success'">
              {{ row.expired ? '已过期' : '有效' }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import { useDate } from '@/composables/useDate'
import { isInClosedRange } from '@/utils/date-range'

interface QueryForm {
  orderNo: string
  dateRange: [string, string] | []
}

interface OrderRow {
  orderNo: string
  createTime: string
  updateTime: string
  expireTime: string
  expired: boolean
}

const {
  dateRange,
  toDateTimeText,
  toRelativeText,
  setTodayRange,
  setRecentDaysRange,
  setCurrentMonthRange,
  clearDateRange
} = useDate()

const queryForm = reactive<QueryForm>({
  orderNo: '',
  dateRange: []
})

const tableData: OrderRow[] = [
  {
    orderNo: 'SO202605210001',
    createTime: '2026-05-21 10:30:00',
    updateTime: '2026-05-21 11:20:00',
    expireTime: '2026-05-31 23:59:59',
    expired: false
  },
  {
    orderNo: 'SO202605210002',
    createTime: '2026-05-22 09:15:00',
    updateTime: '2026-05-22 09:35:00',
    expireTime: '2026-05-22 23:59:59',
    expired: true
  }
]

// 将快捷范围同步到日期选择器
watch(
  dateRange,
  value => {
    if (value.startTime && value.endTime) {
      queryForm.dateRange = [value.startTime, value.endTime]
    }
  },
  { deep: true }
)

function buildQueryParams() {
  const [startTime, endTime] = queryForm.dateRange

  return {
    orderNo: queryForm.orderNo || undefined,
    startTime,
    endTime
  }
}

function handleSearch(): void {
  const params = buildQueryParams()

  console.log('订单查询参数：', params)

  if (params.startTime && params.endTime) {
    const matched = tableData.filter(item => {
      return isInClosedRange(item.createTime, params.startTime, params.endTime)
    })

    console.log('命中订单数量：', matched.length)
  }
}

function handleReset(): void {
  queryForm.orderNo = ''
  queryForm.dateRange = []
  clearDateRange()
}
</script>
```

## 测试与验证

本节用于说明 Day.js 工具方法的单元测试方式。日期相关逻辑高度依赖“当前时间”，测试时应固定系统时间，避免测试结果随着日期变化而不稳定。Vitest 提供 `vi.useFakeTimers()` 和 `vi.setSystemTime()`，其中 `setSystemTime()` 可以模拟当前系统时间，影响 `new Date()`、`Date.now()` 等日期 API；测试结束后应调用 `vi.useRealTimers()` 恢复真实时间。([Vitest](https://vitest.dev/guide/mocking/dates))

### 工具函数单元测试

工具函数单元测试重点验证格式化、空值兜底、时间戳单位、日期范围和相对时间等逻辑。测试文件建议与工具文件放在同级 `__tests__` 目录中。

推荐安装 Vitest。

```bash
# 安装测试依赖
pnpm add -D vitest
```

文件位置：`package.json`

下面配置增加单元测试脚本。

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

文件位置：`src/utils/__tests__/date-format.test.ts`

下面测试验证日期格式化、空值兜底和秒级/毫秒级时间戳格式化。

```typescript
import { describe, expect, it } from 'vitest'
import { DATE_FORMAT } from '@/constants/date'
import {
  formatDate,
  formatDateOnly,
  formatTimestamp,
  isValidDate,
  toApiDateTime
} from '@/utils/date-format'

describe('date-format', () => {
  it('应该正确格式化日期时间', () => {
    expect(formatDate('2026-05-21 10:30:00')).toBe('2026-05-21 10:30:00')
    expect(formatDateOnly('2026-05-21 10:30:00')).toBe('2026-05-21')
    expect(formatDate('2026-05-21 10:30:00', DATE_FORMAT.MONTH)).toBe('2026-05')
  })

  it('空值和非法日期应该返回兜底文本', () => {
    expect(formatDate(null)).toBe('-')
    expect(formatDate(undefined)).toBe('-')
    expect(formatDate('')).toBe('-')
    expect(formatDate('invalid-date')).toBe('-')
  })

  it('应该正确判断日期有效性', () => {
    expect(isValidDate('2026-05-21')).toBe(true)
    expect(isValidDate(null)).toBe(false)
    expect(isValidDate('invalid-date')).toBe(false)
  })

  it('应该正确格式化秒级和毫秒级时间戳', () => {
    expect(formatTimestamp(1779330600, 'second')).toBe('2026-05-21 10:30:00')
    expect(formatTimestamp(1779330600000, 'millisecond')).toBe('2026-05-21 10:30:00')
  })

  it('接口日期时间转换失败时应该返回 undefined', () => {
    expect(toApiDateTime('2026-05-21 10:30:00')).toBe('2026-05-21 10:30:00')
    expect(toApiDateTime(null)).toBeUndefined()
  })
})
```

文件位置：`src/utils/__tests__/date-range.test.ts`

下面测试固定系统时间后验证日期范围计算。Vitest 的 `useFakeTimers()` 会包装后续的日期和定时器 API，直到调用 `useRealTimers()` 恢复。([Vitest](https://vitest.dev/api/vi.html))

```typescript
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  getCurrentMonthRange,
  getRecentDayRange,
  getTodayRange,
  getYesterdayRange,
  isInClosedRange
} from '@/utils/date-range'

describe('date-range', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-05-21T10:30:00+08:00'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('应该正确获取今天范围', () => {
    expect(getTodayRange()).toEqual({
      startTime: '2026-05-21 00:00:00',
      endTime: '2026-05-21 23:59:59'
    })
  })

  it('应该正确获取昨天范围', () => {
    expect(getYesterdayRange()).toEqual({
      startTime: '2026-05-20 00:00:00',
      endTime: '2026-05-20 23:59:59'
    })
  })

  it('应该正确获取最近 7 天范围', () => {
    expect(getRecentDayRange(7)).toEqual({
      startTime: '2026-05-15 00:00:00',
      endTime: '2026-05-21 23:59:59'
    })
  })

  it('应该正确获取本月范围', () => {
    expect(getCurrentMonthRange()).toEqual({
      startTime: '2026-05-01 00:00:00',
      endTime: '2026-05-31 23:59:59'
    })
  })

  it('应该正确判断闭区间范围', () => {
    expect(
      isInClosedRange(
        '2026-05-21 10:30:00',
        '2026-05-21 00:00:00',
        '2026-05-21 23:59:59'
      )
    ).toBe(true)

    expect(
      isInClosedRange(
        '2026-05-22 00:00:00',
        '2026-05-21 00:00:00',
        '2026-05-21 23:59:59'
      )
    ).toBe(false)
  })
})
```

### 边界日期测试

边界日期测试用于覆盖月末、年末、闰年、非法日期、开始结束时间相等、范围交叉等场景。此类测试可以减少统计报表、订单有效期、活动时间判断中的边界错误。

文件位置：`src/utils/__tests__/date-boundary.test.ts`

下面测试验证月末、闰年和范围边界行为。

```typescript
import { describe, expect, it } from 'vitest'
import dayjs from '@/plugins/dayjs'
import { formatDate } from '@/utils/date-format'
import { isInClosedRange } from '@/utils/date-range'

describe('date-boundary', () => {
  it('应该正确处理月末日期加减', () => {
    const value = dayjs('2026-01-31 10:00:00').add(1, 'month')

    expect(value.format('YYYY-MM-DD')).toBe('2026-02-28')
  })

  it('应该正确识别闰年日期', () => {
    expect(dayjs('2024-02-29').isValid()).toBe(true)
    expect(dayjs('2025-02-29').isValid()).toBe(true)
  })

  it('严格解析时应该识别非法日期', () => {
    const invalidDate = dayjs('2025-02-29', 'YYYY-MM-DD', true)

    expect(invalidDate.isValid()).toBe(false)
  })

  it('范围判断应该包含开始和结束边界', () => {
    expect(
      isInClosedRange(
        '2026-05-21 00:00:00',
        '2026-05-21 00:00:00',
        '2026-05-21 23:59:59'
      )
    ).toBe(true)

    expect(
      isInClosedRange(
        '2026-05-21 23:59:59',
        '2026-05-21 00:00:00',
        '2026-05-21 23:59:59'
      )
    ).toBe(true)
  })

  it('格式化非法日期时应该返回兜底文本', () => {
    expect(formatDate('not-a-date')).toBe('-')
    expect(formatDate(null)).toBe('-')
  })
})
```

上面需要注意一点：非严格解析下，Day.js 可能会对部分溢出日期做归一化处理；如果业务要求严格校验用户输入，应使用 `customParseFormat` 插件并传入严格解析参数 `true`。这个规则尤其适用于表单手动输入、导入 Excel 日期、后端字符串校验等场景。

### 时区与语言测试

时区与语言测试用于验证 UTC、指定时区展示、中文语言包和相对时间展示。Day.js 的 `timezone` 插件会增加 `dayjs.tz()`、`.tz()`、`dayjs.tz.guess()` 和 `dayjs.tz.setDefault()` 等 API，并且依赖 `utc` 插件，需要先注册 `utc` 再注册 `timezone`。同时，官方文档说明 `dayjs(dateValue)` 始终使用本地时区，即使设置了默认时区；只有 `dayjs.tz(dateValue)` 在未传入第二个时区参数时才使用默认时区。([Day.js](https://day.js.org/docs/en/plugin/timezone))

文件位置：`src/utils/__tests__/date-timezone-locale.test.ts`

下面测试验证时区转换和中文相对时间。

```typescript
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import dayjs from '@/plugins/dayjs'

describe('date-timezone-locale', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-05-21T10:30:00+08:00'))
    dayjs.locale('zh-cn')
  })

  afterEach(() => {
    vi.useRealTimers()
    dayjs.tz.setDefault()
  })

  it('应该正确将 UTC 时间转换为上海时间', () => {
    const text = dayjs.utc('2026-05-21 01:30:00').tz('Asia/Shanghai').format('YYYY-MM-DD HH:mm:ss')

    expect(text).toBe('2026-05-21 09:30:00')
  })

  it('应该正确将 UTC 时间转换为东京时间', () => {
    const text = dayjs.utc('2026-05-21 01:30:00').tz('Asia/Tokyo').format('YYYY-MM-DD HH:mm:ss')

    expect(text).toBe('2026-05-21 10:30:00')
  })

  it('应该支持中文相对时间展示', () => {
    const text = dayjs('2026-05-21 10:20:00').fromNow()

    expect(text).toContain('分钟前')
  })

  it('设置默认时区后 dayjs.tz 应该使用默认时区', () => {
    dayjs.tz.setDefault('Asia/Tokyo')

    const text = dayjs.tz('2026-05-21 10:30:00').format('YYYY-MM-DD HH:mm:ssZ')

    expect(text).toBe('2026-05-21 10:30:00+09:00')
  })
})
```

运行测试命令如下。

```bash
# 执行全部单元测试
pnpm test

# 监听模式执行测试
pnpm test:watch
```

如果测试环境所在机器的本地时区不同，直接使用 `dayjs()`、`new Date()` 和本地时区格式化可能产生不同结果。涉及时区的测试应尽量使用 `dayjs.utc()`、`dayjs.tz()` 和显式时区字符串，例如 `Asia/Shanghai`、`Asia/Tokyo`、`UTC`。

## 项目最佳实践

本节用于总结 Day.js 在 Vue3 + TypeScript 项目中的落地规范。核心目标是统一日期格式、统一插件注册、统一类型定义、统一接口约定，并减少组件层直接处理日期的代码。

### 统一日期格式常量

项目中应统一维护日期格式常量，不建议在页面中散落 `YYYY-MM-DD HH:mm:ss`、`YYYY/MM/DD`、`YYYY年MM月DD日` 等字符串。Day.js 的格式化能力依赖格式 token，集中维护可以减少格式拼写错误，也便于后续统一调整展示规范。([Day.js](https://day.js.org/docs/en/display/format))

文件位置：`src/constants/date.ts`

下面代码给出推荐的格式常量定义。

```typescript
export const DATE_FORMAT = {
  DATE: 'YYYY-MM-DD',
  DATETIME: 'YYYY-MM-DD HH:mm:ss',
  TIME: 'HH:mm:ss',
  MONTH: 'YYYY-MM',
  YEAR: 'YYYY',
  DISPLAY_DATE: 'YYYY年MM月DD日',
  DISPLAY_DATETIME: 'YYYY年MM月DD日 HH:mm:ss',
  API_DATETIME: 'YYYY-MM-DD HH:mm:ss',
  ISO_SECOND: 'YYYY-MM-DDTHH:mm:ssZ'
} as const

export type DateFormatValue = (typeof DATE_FORMAT)[keyof typeof DATE_FORMAT]
```

页面中使用常量，而不是直接写格式字符串。

```typescript
import { DATE_FORMAT } from '@/constants/date'
import { formatDate } from '@/utils/date-format'

const createTimeText = formatDate('2026-05-21 10:30:00', DATE_FORMAT.DISPLAY_DATETIME)
```

建议将格式分为三类：接口格式、页面展示格式、特殊业务格式。接口格式优先稳定，页面展示格式可以根据产品规范调整，特殊业务格式只在对应业务模块内维护。

### 避免重复注册插件

Day.js 插件应集中注册一次，不建议在组件、工具函数、组合式函数中反复 `dayjs.extend()`。插件注册散落会导致项目初始化逻辑难以追踪，也容易出现某个页面直接从 `dayjs` 包导入导致插件 API 不存在的问题。Day.js 插件本身用于扩展功能，例如 `relativeTime` 增加相对时间 API，`timezone` 增加时区 API，所以应统一在入口文件完成注册。([Day.js](https://day.js.org/docs/en/plugin/relative-time))

推荐做法如下。

```typescript
// 推荐：统一从项目插件入口导入
import dayjs from '@/plugins/dayjs'
```

不推荐做法如下。

```typescript
// 不推荐：组件中直接导入原始 dayjs，可能缺少项目已注册插件
import dayjs from 'dayjs'
```

如果团队需要强制统一导入路径，可以通过 ESLint 规则限制直接从 `dayjs` 导入，只允许 `src/plugins/dayjs.ts` 使用原始包。

```json
{
  "rules": {
    "no-restricted-imports": [
      "error",
      {
        "paths": [
          {
            "name": "dayjs",
            "message": "请从 @/plugins/dayjs 导入，避免绕过项目统一插件注册。"
          }
        ]
      }
    ]
  }
}
```

### 避免混用 Date 与字符串

Vue3 项目中常见日期来源包括 Element Plus 日期选择器、后端接口字符串、时间戳和浏览器原生 `Date`。如果组件状态中同时混用 `Date` 对象、字符串和时间戳，会增加序列化、比较、格式化和接口提交的复杂度。

推荐约定如下。

| 层级              | 推荐类型                       | 说明                                           |
| ----------------- | ------------------------------ | ---------------------------------------------- |
| 组件日期选择器    | `string` 或 `[string, string]` | 配置 `value-format` 后直接得到接口友好的字符串 |
| 接口请求参数      | `string`                       | 使用 `YYYY-MM-DD HH:mm:ss` 等约定格式          |
| 接口响应字段      | `string` 或 `number`           | 与后端约定字段单位和格式                       |
| 工具函数内部      | `Dayjs`                        | 只在工具层内部创建和计算                       |
| 与浏览器 API 交互 | `Date`                         | 仅在需要原生对象时转换                         |

Element Plus 日期选择器建议配置 `value-format`，让表单值直接变成字符串。

```vue
<template>
  <el-date-picker
    v-model="dateRange"
    type="datetimerange"
    value-format="YYYY-MM-DD HH:mm:ss"
    range-separator="至"
    start-placeholder="开始时间"
    end-placeholder="结束时间"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const dateRange = ref<[string, string] | []>([])
</script>
```

如果确实需要使用 `Date` 对象，应在提交接口前统一转换。

```typescript
import { toApiDateTime } from '@/utils/date-format'

function buildParams(startTime: Date | null, endTime: Date | null) {
  return {
    startTime: toApiDateTime(startTime),
    endTime: toApiDateTime(endTime)
  }
}
```

实际项目中，应避免同一个字段有时是字符串、有时是 `Date`、有时是时间戳。字段类型稳定后，表单校验、接口提交和单元测试都会更简单。

### 前后端日期格式约定

前后端日期格式必须提前约定，尤其是时间戳单位、时区语义、日期范围边界和空值规则。否则同一个时间字段可能在不同接口中出现秒级时间戳、毫秒级时间戳、本地时间字符串、UTC 字符串混用，导致前端展示偏差和查询范围错误。

建议接口约定如下。

| 项目         | 推荐约定                                                     |
| ------------ | ------------------------------------------------------------ |
| 普通日期     | `YYYY-MM-DD`                                                 |
| 普通日期时间 | `YYYY-MM-DD HH:mm:ss`                                        |
| UTC 时间     | ISO 8601，例如 `2026-05-21T01:30:00Z`                        |
| 时间戳       | 明确字段单位，建议字段名带 `Ms` 或 `Sec`                     |
| 日期范围开始 | `startTime`，包含边界                                        |
| 日期范围结束 | `endTime`，包含边界                                          |
| 空值         | 不传字段或传 `null`，不要传非法日期字符串                    |
| 时区         | 普通后台系统使用业务默认时区；跨地区系统显式传 UTC 或时区字段 |

推荐接口字段示例。

```json
{
  "orderNo": "SO202605210001",
  "createTime": "2026-05-21 10:30:00",
  "createTimeMs": 1779330600000,
  "startTime": "2026-05-01 00:00:00",
  "endTime": "2026-05-31 23:59:59",
  "timezone": "Asia/Shanghai"
}
```

接口请求参数构造示例如下。

```typescript
import type { DateRange } from '@/types/date'

interface OrderQueryForm {
  orderNo: string
  dateRange: [string, string] | []
}

interface OrderQueryParams {
  orderNo?: string
  startTime?: string
  endTime?: string
}

export function buildOrderQueryParams(form: OrderQueryForm): OrderQueryParams {
  const [startTime, endTime] = form.dateRange

  return {
    orderNo: form.orderNo || undefined,
    startTime,
    endTime
  }
}

export function buildOrderQueryParamsByRange(orderNo: string, range: DateRange): OrderQueryParams {
  return {
    orderNo: orderNo || undefined,
    startTime: range.startTime,
    endTime: range.endTime
  }
}
```

最终建议是：页面展示统一走 `formatDate()`，查询范围统一走 `date-range.ts`，相对时间统一走 `date-relative.ts`，插件注册统一走 `plugins/dayjs.ts`，接口日期格式统一写入前后端接口文档。这样可以避免日期处理逻辑在 Vue 组件、接口封装、表格列和表单提交中分散失控。