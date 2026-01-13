# Lodash ES

`lodash-es` 是 Lodash 的 ES Modules 版本，支持 Tree-shaking，常用于前端框架（如 Vue、React）中按需引入工具函数，减少打包体积、提升加载性能。提供数组、对象、函数式编程等便捷操作，是现代前端常用的工具库之一。

- [官网地址](https://lodash.com/)



## 基础配置

**安装依赖**

```
pnpm add lodash-es@4.17.22 @types/lodash-es@4.17.22
```

---

## 核心工具能力（最基础）

### 按需导入与 Tree-shaking 示例

说明：只导入 `cloneDeep`，不会把整个 Lodash 打包进来。

```vue
<template>
  <div>
    <h2>按需导入与 Tree-shaking 示例</h2>
    <p>原始对象：{{ obj }}</p>
    <p>克隆对象：{{ cloned }}</p>
  </div>
</template>

<script setup lang="ts">
import { cloneDeep } from 'lodash-es'

interface NestedData {
  a: number
  b: {
    c: number
  }
}

const obj: NestedData = { a: 1, b: { c: 2 } }
const cloned: NestedData = cloneDeep(obj)
</script>
```

------

### 函数式编程风格 + 可组合工具函数示例

说明：使用 `flow` 组合多个函数（如同 FP 管道）

```vue
<template>
  <div>
    <h2>函数式编程风格示例</h2>
    <p>源数据：{{ value }}</p>
    <p>结果：{{ result }}</p>
  </div>
</template>

<script setup lang="ts">
import { flow, add, multiply } from 'lodash-es'

const value: number = 5

// flow 等同于：multiply(add(x, 3), 10)
const calc = flow(
  (x: number): number => add(x, 3),
  (x: number): number => multiply(x, 10)
)

const result: number = calc(value)
</script>
```

------

### 深浅拷贝与对象处理基础示例

说明：`cloneDeep` 深拷贝，`merge` 合并对象

```vue
<template>
  <div>
    <h2>深浅拷贝与对象处理示例</h2>
    <p>源对象：{{ src }}</p>
    <p>合并后：{{ merged }}</p>
    <p>深拷贝：{{ deep }}</p>
  </div>
</template>

<script setup lang="ts">
import { cloneDeep, merge } from 'lodash-es'

interface BaseData {
  a: number
  b: {
    c: number
    d?: number
  }
  e?: number
}

const src: BaseData = { a: 1, b: { c: 2 } }
const extra: Partial<BaseData> = { b: { d: 3 }, e: 4 }

// merge 的返回类型不够严格，因此手动断言
const merged: BaseData = merge({}, src, extra)
const deep: BaseData = cloneDeep(src)
</script>
```

------

### 数组与集合基础操作示例

说明：演示 `map`、`filter`、`uniq`、`sortBy` 等常用集合方法

```vue
<template>
  <div>
    <h2>数组与集合基础操作示例</h2>

    <p>原始数组：{{ arr }}</p>
    <p>过滤偶数：{{ filtered }}</p>
    <p>平方映射：{{ mapped }}</p>
    <p>去重结果：{{ unique }}</p>
    <p>排序结果：{{ sorted }}</p>
  </div>
</template>

<script setup lang="ts">
import { filter, map, uniq, sortBy } from 'lodash-es'

const arr: number[] = [1, 2, 2, 3, 4, 4, 5]

const filtered: number[] = filter(arr, (x: number) => x % 2 === 0)
const mapped: number[] = map(arr, (x: number) => x * x)
const unique: number[] = uniq(arr)
const sorted: number[] = sortBy(arr)
</script>
```

------

## 对象处理能力

### 对象属性访问与安全取值（`get` / `set`）

说明：`get` 用于安全读取深层属性避免报错，`set` 用于安全写入深层属性。

```vue
<template>
  <div>
    <h2>对象属性访问与安全取值（get / set）</h2>
    <p>原始对象：{{ user }}</p>
    <p>安全读取：{{ city }}</p>
    <p>写入新字段：{{ updated }}</p>
  </div>
</template>

<script setup lang="ts">
import { get, set } from 'lodash-es'

interface User {
  name: string
  address?: {
    city?: string
    code?: number
  }
}

const user: User = {
  name: 'Alice',
  address: {
    city: 'Tokyo'
  }
}

// 安全取值，类型为 string | undefined
const city: string | undefined = get(user, 'address.city')

// 安全写入深层属性
const updated: User = { ...user }
set(updated, 'address.code', 10086)
</script>
```

------

### 对象属性判断与过滤

说明：使用 `has` 判断属性存在，用 `omit` / `pick` 对属性做过滤与筛选。

```vue
<template>
  <div>
    <h2>对象属性判断与过滤</h2>
    <p>原始对象：{{ obj }}</p>
    <p>是否存在 age 字段：{{ hasAge }}</p>
    <p>仅保留 name 字段：{{ picked }}</p>
    <p>去除 age 字段：{{ omitted }}</p>
  </div>
</template>

<script setup lang="ts">
import { has, pick, omit } from 'lodash-es'

interface Person {
  name: string
  age: number
  city: string
}

const obj: Person = {
  name: 'Tom',
  age: 22,
  city: 'Osaka'
}

const hasAge: boolean = has(obj, 'age')
const picked: Pick<Person, 'name'> = pick(obj, ['name'])
const omitted: Omit<Person, 'age'> = omit(obj, ['age']) as Omit<Person, 'age'>
</script>
```

------

### 对象合并、克隆与深度处理（`merge` / `cloneDeep`）

说明：`merge` 用于深合并对象，`cloneDeep` 用于深拷贝。

```vue
<template>
  <div>
    <h2>对象合并、克隆与深度处理（merge / cloneDeep）</h2>
    <p>源对象：{{ base }}</p>
    <p>合并后：{{ merged }}</p>
    <p>深拷贝：{{ copied }}</p>
  </div>
</template>

<script setup lang="ts">
import { merge, cloneDeep } from 'lodash-es'

interface Profile {
  id: number
  info: {
    name: string
    tags?: string[]
  }
}

const base: Profile = { id: 1, info: { name: 'Mike' } }
const extra: Partial<Profile> = { info: { name: 'Mike', tags: ['dev', 'js'] } }

// merge 返回类型不完全推断，因此使用断言
const merged: Profile = merge({}, base, extra)
const copied: Profile = cloneDeep(base)
</script>
```

------

### 对象键值转换与重塑（`mapKeys` / `mapValues`）

说明：`mapKeys` 修改对象键，`mapValues` 修改对象的值。

```vue
<template>
  <div>
    <h2>对象键值转换与重塑（mapKeys / mapValues）</h2>
    <p>原始对象：{{ raw }}</p>
    <p>键名转大写：{{ keyMapped }}</p>
    <p>值包装对象：{{ valueMapped }}</p>
  </div>
</template>

<script setup lang="ts">
import { mapKeys, mapValues } from 'lodash-es'

interface RawData {
  name: string
  age: number
}

const raw: RawData = {
  name: 'Lisa',
  age: 19
}

// mapKeys 无法自动推断键名类型，需要明确返回类型
const keyMapped: Record<string, number | string> = mapKeys(raw, (_v, k) => k.toUpperCase())

// mapValues 可推断值类型
const valueMapped: Record<keyof RawData, { value: RawData[keyof RawData] }> = mapValues(
  raw,
  (v) => ({ value: v })
)
</script>
```

------

## 数组与集合处理能力

### 查询与过滤（`filter` / `find` / `some` / `every`）

说明：对集合执行条件查询、匹配、判断。

```vue
<template>
  <div>
    <h2>查询与过滤（filter / find / some / every）</h2>
    <p>原始列表：{{ users }}</p>
    <p>年龄 > 20：{{ filtered }}</p>
    <p>查找 id = 2：{{ found }}</p>
    <p>是否存在年龄 < 18：{{ hasMinor }}</p>
    <p>是否所有用户已成年：{{ allAdult }}</p>
  </div>
</template>

<script setup lang="ts">
import { filter, find, some, every } from 'lodash-es'

interface User {
  id: number
  name: string
  age: number
}

const users: User[] = [
  { id: 1, name: 'Tom', age: 18 },
  { id: 2, name: 'Jerry', age: 22 },
  { id: 3, name: 'Anna', age: 16 }
]

const filtered: User[] = filter(users, (u: User) => u.age > 20)

const found: User | undefined = find(users, (u: User) => u.id === 2)

const hasMinor: boolean = some(users, (u: User) => u.age < 18)

const allAdult: boolean = every(users, (u: User) => u.age >= 18)
</script>
```

------

### 排序与分组（`sortBy` / `groupBy`）

说明：按字段排序、按字段分组。

```vue
<template>
  <div>
    <h2>排序与分组（sortBy / groupBy）</h2>
    <p>原始列表：{{ products }}</p>
    <p>按价格排序：{{ sorted }}</p>
    <p>按分类分组：{{ grouped }}</p>
  </div>
</template>

<script setup lang="ts">
import { sortBy, groupBy } from 'lodash-es'

interface Product {
  id: number
  name: string
  price: number
  category: 'Food' | 'Tech'
}

const products: Product[] = [
  { id: 1, name: 'Apple', price: 3, category: 'Food' },
  { id: 2, name: 'Keyboard', price: 120, category: 'Tech' },
  { id: 3, name: 'Banana', price: 2, category: 'Food' }
]

const sorted: Product[] = sortBy(products, (p: Product) => p.price)

const grouped: Record<string, Product[]> = groupBy(products, (p: Product) => p.category)
</script>
```

------

### 去重、扁平化（`uniq` / `flattenDeep`）

说明：去重数组、扁平化多层嵌套数组。

```vue
<template>
  <div>
    <h2>去重、扁平化（uniq / flattenDeep）</h2>
    <p>原始数组：{{ nums }}</p>
    <p>去重后：{{ unique }}</p>
    <p>原始嵌套数组：{{ nested }}</p>
    <p>扁平化后：{{ flat }}</p>
  </div>
</template>

<script setup lang="ts">
import { uniq, flattenDeep } from 'lodash-es'

const nums: number[] = [1, 2, 2, 3, 3, 4]
const unique: number[] = uniq(nums)

const nested: (number | (number | number[])[])[] = [1, [2, [3, 4]], 5]
const flat: number[] = flattenDeep(nested) as number[]
</script>
```

------

### 集合运算（交集并集差集）

说明：求交集、并集、差集的典型集合操作。

```vue
<template>
  <div>
    <h2>集合运算（交集并集差集）</h2>
    <p>集合 A：{{ a }}</p>
    <p>集合 B：{{ b }}</p>
    <p>交集（A ∩ B）：{{ intersect }}</p>
    <p>并集（A ∪ B）：{{ unionSet }}</p>
    <p>差集（A - B）：{{ diff }}</p>
  </div>
</template>

<script setup lang="ts">
import { intersection, union, difference } from 'lodash-es'

const a: number[] = [1, 2, 3, 4]
const b: number[] = [3, 4, 5, 6]

// 交集
const intersect: number[] = intersection(a, b)

// 并集
const unionSet: number[] = union(a, b)

// 差集
const diff: number[] = difference(a, b)
</script>
```

------

## 字符串与模板处理类

### 大小写转换（`camelCase` / `kebabCase`）

说明：用于处理变量命名风格转换（常用于前后端字段格式适配）。

```vue
<template>
  <div>
    <h2>大小写转换（camelCase / kebabCase）</h2>
    <p>原始字符串：{{ raw }}</p>
    <p>转换为 camelCase：{{ camel }}</p>
    <p>转换为 kebabCase：{{ kebab }}</p>
  </div>
</template>

<script setup lang="ts">
import { camelCase, kebabCase } from 'lodash-es'

const raw: string = 'hello_world_example'

// helloWorldExample
const camel: string = camelCase(raw)

// hello-world-example
const kebab: string = kebabCase(raw)
</script>
```

------

### 字符串分割与格式化（`split` / `trim`）

说明：用于数据清洗、输入处理、表单字段标准化。

```vue
<template>
  <div>
    <h2>字符串分割与格式化（split / trim）</h2>
    <p>原始字符串：{{ raw }}</p>
    <p>去除前后空格：{{ trimmed }}</p>
    <p>分割为数组：{{ parts }}</p>
  </div>
</template>

<script setup lang="ts">
import { split, trim } from 'lodash-es'

const raw: string = '  apple,banana,pear  '

const trimmed: string = trim(raw)

const parts: string[] = split(trimmed, ',')
</script>
```

------

### 模板渲染（`template`）

说明：用于文本渲染、系统通知、日志格式化等场景。

```vue
<template>
  <div>
    <h2>模板渲染（template）</h2>
    <p>模板文本：{{ tplSource }}</p>
    <p>渲染结果：{{ rendered }}</p>
  </div>
</template>

<script setup lang="ts">
import { template } from 'lodash-es'

interface RenderData {
  user: string
  count: number
}

const tplSource: string = 'Hello <%= user %>, you have <%= count %> messages.'

const compile = template(tplSource)

const data: RenderData = {
  user: 'Alice',
  count: 5
}

// 编译后的字符串
const rendered: string = compile(data)
</script>
```

------

## 数值与数学能力

### 基础数值计算（`sum` / `mean`）

说明：用于求和、平均值统计（常用于图表、统计、报表中）。

```vue
<template>
  <div>
    <h2>基础数值计算（sum / mean）</h2>
    <p>原始数据：{{ nums }}</p>
    <p>求和结果：{{ total }}</p>
    <p>平均值：{{ average }}</p>
  </div>
</template>

<script setup lang="ts">
import { sum, mean } from 'lodash-es'

const nums: number[] = [10, 20, 30, 40]

const total: number = sum(nums)
const average: number = mean(nums)
</script>
```

------

### 精度处理（`round` / `floor` / `ceil`）

说明：常用于金额保留小数、浮点计算处理、四舍五入等。

```vue
<template>
  <div>
    <h2>精度处理（round / floor / ceil）</h2>
    <p>原始数值：{{ raw }}</p>
    <p>四舍五入（保留两位）：{{ rounded }}</p>
    <p>向下取整：{{ floored }}</p>
    <p>向上取整：{{ ceiled }}</p>
  </div>
</template>

<script setup lang="ts">
import { round, floor, ceil } from 'lodash-es'

const raw: number = 3.1415926

// round(value, precision)
const rounded: number = round(raw, 2)  // 3.14

const floored: number = floor(raw)     // 3

const ceiled: number = ceil(raw)       // 4
</script>
```

------

### 范围处理（`clamp` / `inRange`）

说明：用于数值裁剪、输入合法范围限制、区间判断等业务场景。

```vue
<template>
  <div>
    <h2>范围处理（clamp / inRange）</h2>
    <p>原始值：{{ raw }}</p>
    <p>限制到区间 [0, 100]：{{ clamped }}</p>
    <p>50 是否在区间 [0, 100) 内：{{ isInRange }}</p>
  </div>
</template>

<script setup lang="ts">
import { clamp, inRange } from 'lodash-es'

const raw: number = 180

// 限制在 0 - 100 区间内
const clamped: number = clamp(raw, 0, 100)

// 判断 50 是否在区间 [0,100)
const isInRange: boolean = inRange(50, 0, 100)
</script>
```

------

## 函数控制类

### 节流与防抖（`throttle` / `debounce`）

说明：用于控制高频事件触发，防止性能浪费（如输入联想、滚动监听、窗口 resize 等）。

```vue
<template>
  <div style="height:1500px; padding: 20px;">
    <h2>节流与防抖（throttle / debounce）</h2>

    <h3>防抖输入（debounce）：停止输入后触发</h3>
    <input
      v-model="keyword"
      @input="onInput(keyword)"
      placeholder="快速输入看看"
    />
    <p>搜索内容：{{ result }}</p>

    <h3>节流监听（throttle）：滚动时限频更新</h3>
    <p>滚动位置：{{ scrollY }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { debounce, throttle } from 'lodash-es'

const keyword = ref<string>('')
const result = ref<string>('')
const scrollY = ref<number>(0)

// 防抖：停止 500ms 后触发
const onInput = debounce((text: string) => {
  result.value = `发送搜索请求：${text}`
}, 500)

// 节流：200ms 更新一次
const onScroll = throttle(() => {
  scrollY.value = window.scrollY
}, 200)

onMounted(() => window.addEventListener('scroll', onScroll))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>
```

------

### 偏应用与柯里化（`partial` / `curry`）

说明：用于函数复用、减少参数传递、增强函数式编程能力。

```vue
<template>
  <div>
    <h2>偏应用与柯里化（partial / curry）</h2>
    <p>偏应用结果 add5(10,20)：{{ partialResult }}</p>
    <p>柯里化 multiply(2)(5)(3)：{{ curryResult }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { partial, curry } from 'lodash-es'

// 原函数
function add(a: number, b: number, c: number): number {
  return a + b + c
}

// 偏应用：提前固定第一个参数
const add5 = partial(add, 5)
const partialResult = ref<number>(add5(10, 20)) // = 35

// 柯里化示例
function multiply(a: number, b: number, c: number): number {
  return a * b * c
}

const curried = curry(multiply)
const curryResult = ref<number>(curried(2)(5)(3)) // = 30
</script>
```

------

### 组合函数（`flow` / `flowRight`）

说明：通过函数管道简化复杂逻辑，常用于数据格式化、数学运算链式处理。

```vue
<template>
  <div>
    <h2>组合函数（flow / flowRight）</h2>
    <p>flow(add1,double,square)(2)：{{ leftToRight }}</p>
    <p>flowRight(square,double,add1)(2)：{{ rightToLeft }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { flow, flowRight } from 'lodash-es'

const add1 = (n: number): number => n + 1
const double = (n: number): number => n * 2
const square = (n: number): number => n * n

const f = flow(add1, double, square)         // 左 → 右
const g = flowRight(square, double, add1)    // 右 → 左

const leftToRight = ref<number>(f(2))        // (2+1)=3 → 3*2=6 → 6²=36
const rightToLeft = ref<number>(g(2))        // 同上结果 = 36
</script>
```

------

### 一次性执行（`once`）

说明：只执行一次，适合初始化逻辑、防重复提交、支付按钮等场景。

```vue
<template>
  <div>
    <h2>一次性执行（once）</h2>
    <button @click="handleClick">点击多次触发</button>
    <p>{{ info }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { once } from 'lodash-es'

let count = 0
const info = ref<string>('')

const init = once(() => {
  count++
  return `初始化执行次数：${count}`
})

function handleClick(): void {
  info.value = init()
}
</script>
```

------

## 类型与判断能力

### 类型判断（`isArray` / `isFunction` / `isEqual` 等）

说明：用于运行时类型检查、动态字段处理、通用工具库中常用。

```vue
<template>
  <div>
    <h2>类型判断（isArray / isFunction / isEqual）</h2>
    <p>arr 是否为数组：{{ isArr }}</p>
    <p>fn 是否为函数：{{ isFn }}</p>
    <p>objA 与 objB 是否深度相等：{{ isObjEqual }}</p>
  </div>
</template>

<script setup lang="ts">
import { isArray, isFunction, isEqual } from 'lodash-es'

const arr: unknown = [1, 2, 3]
const fn: unknown = () => {}
const objA = { a: 1, b: 2 }
const objB = { a: 1, b: 2 }

const isArr: boolean = isArray(arr)
const isFn: boolean = isFunction(fn)
const isObjEqual: boolean = isEqual(objA, objB)
</script>
```

------

### 空值判断（`isNil` / `isEmpty`）

说明：适用于接口数据处理、表单校验、容器判空、业务分支判断。

> `isNil` 判断 null 或 undefined
> `isEmpty` 判断对象、数组、字符串、Map、Set 是否为空

```vue
<template>
  <div>
    <h2>空值判断（isNil / isEmpty）</h2>
    <p>value 是否为 null 或 undefined：{{ isValueNil }}</p>
    <p>空数组 isEmpty([])：{{ isEmptyArray }}</p>
    <p>空对象 isEmpty({})：{{ isEmptyObject }}</p>
    <p>空字符串 isEmpty('')：{{ isEmptyStr }}</p>
  </div>
</template>

<script setup lang="ts">
import { isNil, isEmpty } from 'lodash-es'

const value: unknown = null

const isValueNil: boolean = isNil(value)
const isEmptyArray: boolean = isEmpty([])
const isEmptyObject: boolean = isEmpty({})
const isEmptyStr: boolean = isEmpty('')
</script>
```

------

### 深度比较（`isEqual`）

说明：用于深度对象比较，适合用于脏检查、表单变更检测、diff 逻辑等场景。

```vue
<template>
  <div>
    <h2>深度比较（isEqual）</h2>
    <p>对象 A：{{ a }}</p>
    <p>对象 B：{{ b }}</p>
    <p>isEqual(A, B)：{{ equal }}</p>
  </div>
</template>

<script setup lang="ts">
import { isEqual } from 'lodash-es'

interface User {
  name: string
  roles: string[]
}

const a: User = { name: 'Alice', roles: ['admin', 'editor'] }
const b: User = { name: 'Alice', roles: ['admin', 'editor'] }

const equal: boolean = isEqual(a, b) // true
</script>
```

------

## 数据转换与序列化类

### 映射与序列转换（`map` / `reduce`）

说明：用于数据加工、统计汇总、表格字段转换、图表序列生成等场景。

```vue
<template>
  <div>
    <h2>映射与序列转换（map / reduce）</h2>
    <p>原始数据：{{ nums }}</p>
    <p>平方映射结果：{{ squared }}</p>
    <p>reduce 求和结果：{{ total }}</p>
  </div>
</template>

<script setup lang="ts">
import { map, reduce } from 'lodash-es'

const nums: number[] = [1, 2, 3, 4, 5]

// 映射平方
const squared: number[] = map(nums, (n: number) => n * n)

// reduce 求和
const total: number = reduce(nums, (acc: number, n: number) => acc + n, 0)
</script>
```

------

### 结构转换（对象 ⇆ 数组）

说明：常用于后端字段格式不统一、key-value 转换、下拉列表数据处理等。

```vue
<template>
  <div>
    <h2>结构转换（对象 ⇆ 数组）</h2>
    <p>对象转数组：{{ keyValueArr }}</p>
    <p>数组转对象：{{ obj }}</p>
  </div>
</template>

<script setup lang="ts">
import { toPairs, fromPairs } from 'lodash-es'

const sourceObj = {
  id: 1,
  name: 'Alice',
  role: 'admin'
}

// 对象 -> 数组（键值对）
const keyValueArr: [string, unknown][] = toPairs(sourceObj)

// 数组 -> 对象（键值对）
const obj: Record<string, unknown> = fromPairs(keyValueArr)
</script>
```

------

### 查询结果序列化与反序列化

说明：常用于 URL 查询参数、表单参数、前后端 JSON 数据的序列化 / 反序列化。

```vue
<template>
  <div>
    <h2>查询结果序列化与反序列化</h2>
    <p>原始对象：{{ queryObj }}</p>
    <p>序列化字符串：{{ queryStr }}</p>
    <p>反序列化结果：{{ parsedObj }}</p>
  </div>
</template>

<script setup lang="ts">
import { toPairs, fromPairs } from 'lodash-es'

interface Query {
  page: number
  size: number
  keyword: string
}

const queryObj: Query = {
  page: 1,
  size: 20,
  keyword: 'apple'
}

// 对象 -> URL 查询参数字符串
const queryStr: string = toPairs(queryObj)
  .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
  .join('&')

// 字符串 -> 对象
const parsedObj: Record<string, string> = fromPairs(
  queryStr.split('&').map(pair => {
    const [k, v] = pair.split('=')
    return [decodeURIComponent(k), decodeURIComponent(v)]
  })
)
</script>
```

------

## 工程集成与开发体验类

### ES Modules + Tree-shaking 友好

说明：`lodash-es` 提供 ESM 构建，可被 Vite / Webpack / Rollup 等进行 Tree-shaking，从而避免整体打包进入 bundle。

```ts
// ❌ 不推荐：会打包整个 lodash
import _ from 'lodash'

// ✅ 推荐：仅引入所需函数（tree-shaking 有效）
import { cloneDeep, debounce } from 'lodash-es'
```

> 场景：前端工程性能优化、模块按需加载

------

### 与 Vue / React 按需加载与性能优化

说明：通过 `lodash-es` 搭配 UI/状态框架，仅带入必要能力，避免 bundle 过大。

```ts
// Vue 示例（组合式 API）
import { debounce } from 'lodash-es'
import { ref } from 'vue'

const keyword = ref('')
const onSearch = debounce((v: string) => {
  console.log('search:', v)
}, 400)
// React 示例（函数组件）
import { throttle } from 'lodash-es'
import { useState, useEffect } from 'react'

export function ScrollComp() {
  const [y, setY] = useState(0)

  useEffect(() => {
    const handler = throttle(() => setY(window.scrollY), 200)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return <div>scrollY: {y}</div>
}
```

> 特点：按需构建、SSR 友好、框架无入侵

------

### 服务端与浏览器通用兼容性

说明：`lodash-es` 在 Node + ESM 环境下可直接使用（如 `vite-ssr`、Cloudflare Workers、Bun、Deno）。

Node + ES Modules 示例：

```ts
// package.json 中开启： "type": "module"
import { merge } from 'lodash-es'

const a = { a: 1 }
const b = { b: 2 }
console.log(merge(a, b))
```

Cloudflare Workers 示例：

```ts
import { isEmpty } from 'lodash-es'

addEventListener('fetch', event => {
  const empty = isEmpty({})
  return event.respondWith(new Response(`isEmpty: ${empty}`))
})
```

> 适用场景：SSR、Edge Runtime、Serverless 环境

------

### Bundle 体积优化策略（避免整个 Lodash 打包）

说明：建议仅使用 `lodash-es` + ESM，避免：

- Tree-shaking 失效
- 打包引入全部模块
- 构建体积膨胀

示例：

```ts
// ❌ 坏例子：会引入整个 lodash
import _ from 'lodash'
_.pick(data, ['id'])

// ❌ 坏例子：lodash + lodash-es 混用，体积变大
import _ from 'lodash'
import { pick } from 'lodash-es'

// ✅ 好例子：只引入需要的函数，无副作用
import { pick } from 'lodash-es'
pick(data, ['id'])
```

> 实践总结：统一使用 `lodash-es` + 按需导入 = SSG + SSR + 浏览器三端兼容

------

### TypeScript 类型推导适配良好

说明：`lodash-es` 内置类型声明，可配合 TS 完成功能链式与泛型推导。

```ts
import { get } from 'lodash-es'

interface User {
  id: number
  profile: {
    nickname: string
  }
}

const user: User = {
  id: 1,
  profile: { nickname: 'Alice' }
}

// 自动推导类型为 string | undefined
const nickname = get(user, 'profile.nickname')
```

复杂结构推导示例（泛型配合）：

```ts
import { map } from 'lodash-es'

interface User {
  id: number
}

const users: User[] = [{ id: 1 }, { id: 2 }]

// 推导每一项为 number
const ids = map(users, u => u.id) // number[]
```

> 适用于：TS 重度项目、低耦合工具库、数据转换模块

------

