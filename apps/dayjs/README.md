# Day.js

Day.js 是一个轻量级的 JavaScript 时间处理库，用于日期格式化、解析、计算和比较。API 设计与 Moment.js 相似，学习成本低，但体积更小、性能更好，支持插件机制按需扩展，常用于前端项目中的时间展示、倒计时、时间差计算等场景。

- [官网地址](https://day.js.org)



## 基础配置

**安装依赖**

```
pnpm add dayjs@1.11.19
```



## 基础日期能力

- 日期创建与获取
- 日期格式化
- 日期解析
- 获取时间戳
- 时间戳转日期
- 判断日期是否合法
- 序列化与反序列化（字符串 / 时间戳）

```vue
<template>
  <div class="app">
    <h1>Day.js 基础日期能力示例（严格 TS 类型版）</h1>

    <!-- 1. 日期创建与获取 -->
    <section>
      <h2>1. 日期创建与获取</h2>
      <p>当前时间：{{ now }}</p>
      <p>指定字符串创建：{{ fromString }}</p>
      <p>指定时间戳创建：{{ fromTimestamp }}</p>
    </section>

    <!-- 2. 日期格式化 -->
    <section>
      <h2>2. 日期格式化</h2>
      <p>YYYY-MM-DD：{{ formattedDate }}</p>
      <p>YYYY-MM-DD HH:mm:ss：{{ formattedDateTime }}</p>
    </section>

    <!-- 3. 日期解析 -->
    <section>
      <h2>3. 日期解析</h2>
      <p>解析字符串 "2026/01/13"：{{ parsedDate }}</p>
    </section>

    <!-- 4. 获取时间戳 -->
    <section>
      <h2>4. 获取时间戳</h2>
      <p>当前时间戳（毫秒）：{{ timestamp }}</p>
    </section>

    <!-- 5. 时间戳转日期 -->
    <section>
      <h2>5. 时间戳转日期</h2>
      <p>时间戳 {{ timestamp }} 转日期：{{ timestampToDate }}</p>
    </section>

    <!-- 6. 判断日期是否合法 -->
    <section>
      <h2>6. 判断日期是否合法</h2>
      <p>"2026-01-13" 是否合法：{{ validDate }}</p>
      <p>"invalid-date" 是否合法：{{ invalidDate }}</p>
    </section>

    <!-- 7. 序列化与反序列化 -->
    <section>
      <h2>7. 序列化与反序列化</h2>
      <p>序列化为字符串：{{ serializedString }}</p>
      <p>反序列化字符串后格式化：{{ deserializedFromString }}</p>

      <p>序列化为时间戳：{{ serializedTimestamp }}</p>
      <p>反序列化时间戳后格式化：{{ deserializedFromTimestamp }}</p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import dayjs, { Dayjs } from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)

/**
 * 统一的格式常量，避免魔法字符串
 */
type DateFormat = 'YYYY-MM-DD' | 'YYYY-MM-DD HH:mm:ss'
const DATE_FORMAT: DateFormat = 'YYYY-MM-DD'
const DATETIME_FORMAT: DateFormat = 'YYYY-MM-DD HH:mm:ss'

/**
 * 1. 日期创建与获取
 */
const nowDayjs: Dayjs = dayjs()
const now = ref<string>(nowDayjs.format(DATETIME_FORMAT))

const fromStringDayjs: Dayjs = dayjs('2026-01-13')
const fromString = ref<string>(fromStringDayjs.format(DATE_FORMAT))

const fromTimestampDayjs: Dayjs = dayjs(1700000000000)
const fromTimestamp = ref<string>(
  fromTimestampDayjs.format(DATETIME_FORMAT)
)

/**
 * 2. 日期格式化
 */
const formattedDate = ref<string>(nowDayjs.format(DATE_FORMAT))
const formattedDateTime = ref<string>(nowDayjs.format(DATETIME_FORMAT))

/**
 * 3. 日期解析
 */
const parsedDayjs: Dayjs = dayjs('2026/01/13', 'YYYY/MM/DD')
const parsedDate = ref<string>(parsedDayjs.format(DATE_FORMAT))

/**
 * 4. 获取时间戳
 */
const timestamp = ref<number>(nowDayjs.valueOf())

/**
 * 5. 时间戳转日期
 */
const timestampToDate = ref<string>(
  dayjs(timestamp.value).format(DATETIME_FORMAT)
)

/**
 * 6. 判断日期是否合法
 */
const validDate = ref<boolean>(dayjs('2026-01-13').isValid())
const invalidDate = ref<boolean>(dayjs('invalid-date').isValid())

/**
 * 7. 序列化与反序列化
 * 约定：
 * - 字符串序列化使用 ISO8601
 * - 时间戳序列化使用毫秒级 number
 */
const serializedString = ref<string>(nowDayjs.toISOString())

const deserializedFromString = ref<string>(
  dayjs(serializedString.value).format(DATETIME_FORMAT)
)

const serializedTimestamp = ref<number>(nowDayjs.valueOf())

const deserializedFromTimestamp = ref<string>(
  dayjs(serializedTimestamp.value).format(DATETIME_FORMAT)
)
</script>

<style scoped>
.app {
  padding: 20px;
  font-family: Arial, Helvetica, sans-serif;
}

section {
  margin-bottom: 20px;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
}

h1 {
  margin-bottom: 20px;
}

h2 {
  margin-bottom: 8px;
  font-size: 16px;
}

p {
  margin: 4px 0;
}
</style>
```

## 时间计算类

- 时间加减运算
- 时间差计算
- 倒计时与定时类时间计算
- 时间范围生成（时间区间数组）

```vue
<template>
  <div class="app">
    <h1>Day.js 时间计算类示例</h1>

    <!-- 1. 时间加减运算 -->
    <section>
      <h2>1. 时间加减运算</h2>
      <p>当前时间：{{ baseTime }}</p>
      <p>加 3 天：{{ addDays }}</p>
      <p>减 2 小时：{{ subtractHours }}</p>
    </section>

    <!-- 2. 时间差计算 -->
    <section>
      <h2>2. 时间差计算</h2>
      <p>开始时间：{{ startTime }}</p>
      <p>结束时间：{{ endTime }}</p>
      <p>相差天数：{{ diffDays }} 天</p>
      <p>相差小时：{{ diffHours }} 小时</p>
    </section>

    <!-- 3. 倒计时 -->
    <section>
      <h2>3. 倒计时与定时类时间计算</h2>
      <p>目标时间：{{ targetTime }}</p>
      <p>剩余秒数：{{ countdownSeconds }} 秒</p>
    </section>

    <!-- 4. 时间范围生成 -->
    <section>
      <h2>4. 时间范围生成（时间区间数组）</h2>
      <p>起始日期：{{ rangeStart }}</p>
      <p>结束日期：{{ rangeEnd }}</p>
      <ul>
        <li v-for="item in dateRange" :key="item">
          {{ item }}
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import dayjs, { Dayjs } from 'dayjs'

/**
 * 一、时间加减运算
 */
const baseDayjs: Dayjs = dayjs()
const baseTime = ref<string>(baseDayjs.format('YYYY-MM-DD HH:mm:ss'))

const addDays = ref<string>(
  baseDayjs.add(3, 'day').format('YYYY-MM-DD HH:mm:ss')
)

const subtractHours = ref<string>(
  baseDayjs.subtract(2, 'hour').format('YYYY-MM-DD HH:mm:ss')
)

/**
 * 二、时间差计算
 */
const start: Dayjs = dayjs('2026-01-01 08:00:00')
const end: Dayjs = dayjs('2026-01-03 14:00:00')

const startTime = ref<string>(start.format('YYYY-MM-DD HH:mm:ss'))
const endTime = ref<string>(end.format('YYYY-MM-DD HH:mm:ss'))

const diffDays = ref<number>(end.diff(start, 'day'))
const diffHours = ref<number>(end.diff(start, 'hour'))

/**
 * 三、倒计时与定时类时间计算
 */
const target: Dayjs = dayjs().add(1, 'minute')
const targetTime = ref<string>(target.format('YYYY-MM-DD HH:mm:ss'))

const countdownSeconds = ref<number>(target.diff(dayjs(), 'second'))

let timer: number | undefined

onMounted((): void => {
  timer = window.setInterval((): void => {
    const now: Dayjs = dayjs()
    const diff: number = target.diff(now, 'second')
    countdownSeconds.value = diff > 0 ? diff : 0
  }, 1000)
})

onUnmounted((): void => {
  if (timer !== undefined) {
    window.clearInterval(timer)
  }
})

/**
 * 四、时间范围生成（时间区间数组）
 */
const rangeStartDayjs: Dayjs = dayjs('2026-01-01')
const rangeEndDayjs: Dayjs = dayjs('2026-01-07')

const rangeStart = ref<string>(rangeStartDayjs.format('YYYY-MM-DD'))
const rangeEnd = ref<string>(rangeEndDayjs.format('YYYY-MM-DD'))

const dateRange = ref<string[]>([])

const buildDateRange = (
  startDate: Dayjs,
  endDate: Dayjs,
  unit: 'day' | 'month' | 'year' = 'day'
): string[] => {
  const result: string[] = []
  let current: Dayjs = startDate

  while (current.isBefore(endDate) || current.isSame(endDate, unit)) {
    result.push(current.format('YYYY-MM-DD'))
    current = current.add(1, unit)
  }

  return result
}

dateRange.value = buildDateRange(rangeStartDayjs, rangeEndDayjs)
</script>

<style scoped>
.app {
  padding: 20px;
  font-family: Arial, Helvetica, sans-serif;
}

section {
  margin-bottom: 20px;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
}

h1 {
  margin-bottom: 20px;
}

h2 {
  margin-bottom: 8px;
  font-size: 16px;
}

p {
  margin: 4px 0;
}

ul {
  padding-left: 20px;
}

li {
  line-height: 1.6;
}
</style>
```

## 时间对比与判断类

- 时间大小比较
- 时间是否相同判断
- 按时间单位比较（年 / 月 / 日等）
- 时间区间判断

```vue
<template>
  <div class="app">
    <h1>Day.js 时间对比与判断类示例</h1>

    <!-- 1. 时间大小比较 -->
    <section>
      <h2>1. 时间大小比较</h2>
      <p>时间 A：{{ timeA }}</p>
      <p>时间 B：{{ timeB }}</p>
      <p>A 是否早于 B：{{ isBefore }}</p>
      <p>A 是否晚于 B：{{ isAfter }}</p>
    </section>

    <!-- 2. 时间是否相同判断 -->
    <section>
      <h2>2. 时间是否相同判断</h2>
      <p>时间 C：{{ timeC }}</p>
      <p>时间 D：{{ timeD }}</p>
      <p>是否完全相同：{{ isSameExact }}</p>
    </section>

    <!-- 3. 按时间单位比较 -->
    <section>
      <h2>3. 按时间单位比较（年 / 月 / 日）</h2>
      <p>时间 E：{{ timeE }}</p>
      <p>时间 F：{{ timeF }}</p>
      <p>是否同一年：{{ isSameYear }}</p>
      <p>是否同一月：{{ isSameMonth }}</p>
      <p>是否同一天：{{ isSameDay }}</p>
    </section>

    <!-- 4. 时间区间判断 -->
    <section>
      <h2>4. 时间区间判断</h2>
      <p>区间开始：{{ rangeStart }}</p>
      <p>区间结束：{{ rangeEnd }}</p>
      <p>当前时间：{{ currentTime }}</p>
      <p>是否在区间内：{{ isInRange }}</p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import dayjs, { Dayjs } from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'

dayjs.extend(isBetween)

/**
 * 一、时间大小比较
 */
const timeADayjs: Dayjs = dayjs('2026-01-10 10:00:00')
const timeBDayjs: Dayjs = dayjs('2026-01-10 18:00:00')

const timeA = ref<string>(timeADayjs.format('YYYY-MM-DD HH:mm:ss'))
const timeB = ref<string>(timeBDayjs.format('YYYY-MM-DD HH:mm:ss'))

const isBefore = ref<boolean>(timeADayjs.isBefore(timeBDayjs))
const isAfter = ref<boolean>(timeADayjs.isAfter(timeBDayjs))

/**
 * 二、时间是否相同判断（精确到毫秒）
 */
const timeCDayjs: Dayjs = dayjs('2026-01-13 12:00:00')
const timeDDayjs: Dayjs = dayjs('2026-01-13 12:00:00')

const timeC = ref<string>(timeCDayjs.format('YYYY-MM-DD HH:mm:ss'))
const timeD = ref<string>(timeDDayjs.format('YYYY-MM-DD HH:mm:ss'))

const isSameExact = ref<boolean>(timeCDayjs.isSame(timeDDayjs))

/**
 * 三、按时间单位比较
 */
const timeEDayjs: Dayjs = dayjs('2026-01-13 08:00:00')
const timeFDayjs: Dayjs = dayjs('2026-01-13 20:00:00')

const timeE = ref<string>(timeEDayjs.format('YYYY-MM-DD HH:mm:ss'))
const timeF = ref<string>(timeFDayjs.format('YYYY-MM-DD HH:mm:ss'))

const isSameYear = ref<boolean>(timeEDayjs.isSame(timeFDayjs, 'year'))
const isSameMonth = ref<boolean>(timeEDayjs.isSame(timeFDayjs, 'month'))
const isSameDay = ref<boolean>(timeEDayjs.isSame(timeFDayjs, 'day'))

/**
 * 四、时间区间判断
 */
const rangeStartDayjs: Dayjs = dayjs('2026-01-13 09:00:00')
const rangeEndDayjs: Dayjs = dayjs('2026-01-13 18:00:00')
const currentDayjs: Dayjs = dayjs('2026-01-13 12:00:00')

const rangeStart = ref<string>(rangeStartDayjs.format('YYYY-MM-DD HH:mm:ss'))
const rangeEnd = ref<string>(rangeEndDayjs.format('YYYY-MM-DD HH:mm:ss'))
const currentTime = ref<string>(currentDayjs.format('YYYY-MM-DD HH:mm:ss'))

const isInRange = ref<boolean>(
  currentDayjs.isBetween(rangeStartDayjs, rangeEndDayjs, undefined, '[]')
)
</script>

<style scoped>
.app {
  padding: 20px;
  font-family: Arial, Helvetica, sans-serif;
}

section {
  margin-bottom: 20px;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
}

h1 {
  margin-bottom: 20px;
}

h2 {
  margin-bottom: 8px;
  font-size: 16px;
}

p {
  margin: 4px 0;
}
</style>
```

## 时间边界与周期类

- 获取时间起始点（一天开始、一月开始等）
- 获取时间结束点（一天结束、一月结束等）
- 周相关处理（本周、上周、周开始、周结束）
- 月相关处理（本月、上月、月初、月末）
- 年相关处理（今年、去年、年初、年末）

```vue
<template>
  <div class="app">
    <h1>Day.js 时间边界与周期类示例</h1>

    <!-- 1. 时间起始点 -->
    <section>
      <h2>1. 获取时间起始点</h2>
      <p>当前时间：{{ now }}</p>
      <p>当天开始：{{ startOfDay }}</p>
      <p>当月开始：{{ startOfMonth }}</p>
      <p>当年开始：{{ startOfYear }}</p>
    </section>

    <!-- 2. 时间结束点 -->
    <section>
      <h2>2. 获取时间结束点</h2>
      <p>当天结束：{{ endOfDay }}</p>
      <p>当月结束：{{ endOfMonth }}</p>
      <p>当年结束：{{ endOfYear }}</p>
    </section>

    <!-- 3. 周相关处理 -->
    <section>
      <h2>3. 周相关处理</h2>
      <p>本周开始：{{ thisWeekStart }}</p>
      <p>本周结束：{{ thisWeekEnd }}</p>
      <p>上周开始：{{ lastWeekStart }}</p>
      <p>上周结束：{{ lastWeekEnd }}</p>
    </section>

    <!-- 4. 月相关处理 -->
    <section>
      <h2>4. 月相关处理</h2>
      <p>本月开始：{{ thisMonthStart }}</p>
      <p>本月结束：{{ thisMonthEnd }}</p>
      <p>上月开始：{{ lastMonthStart }}</p>
      <p>上月结束：{{ lastMonthEnd }}</p>
    </section>

    <!-- 5. 年相关处理 -->
    <section>
      <h2>5. 年相关处理</h2>
      <p>今年开始：{{ thisYearStart }}</p>
      <p>今年结束：{{ thisYearEnd }}</p>
      <p>去年开始：{{ lastYearStart }}</p>
      <p>去年结束：{{ lastYearEnd }}</p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import dayjs, { Dayjs } from 'dayjs'
import isoWeek from 'dayjs/plugin/isoWeek'

dayjs.extend(isoWeek)

/**
 * 当前基准时间
 */
const nowDayjs: Dayjs = dayjs()
const now = ref<string>(nowDayjs.format('YYYY-MM-DD HH:mm:ss'))

/**
 * 一、时间起始点
 */
const startOfDay = ref<string>(
  nowDayjs.startOf('day').format('YYYY-MM-DD HH:mm:ss')
)
const startOfMonth = ref<string>(
  nowDayjs.startOf('month').format('YYYY-MM-DD HH:mm:ss')
)
const startOfYear = ref<string>(
  nowDayjs.startOf('year').format('YYYY-MM-DD HH:mm:ss')
)

/**
 * 二、时间结束点
 */
const endOfDay = ref<string>(
  nowDayjs.endOf('day').format('YYYY-MM-DD HH:mm:ss')
)
const endOfMonth = ref<string>(
  nowDayjs.endOf('month').format('YYYY-MM-DD HH:mm:ss')
)
const endOfYear = ref<string>(
  nowDayjs.endOf('year').format('YYYY-MM-DD HH:mm:ss')
)

/**
 * 三、周相关处理（以周一为一周开始，ISO 周标准）
 */
const thisWeekStartDayjs: Dayjs = nowDayjs.startOf('isoWeek')
const thisWeekEndDayjs: Dayjs = nowDayjs.endOf('isoWeek')

const lastWeekStartDayjs: Dayjs = nowDayjs.subtract(1, 'week').startOf('isoWeek')
const lastWeekEndDayjs: Dayjs = nowDayjs.subtract(1, 'week').endOf('isoWeek')

const thisWeekStart = ref<string>(
  thisWeekStartDayjs.format('YYYY-MM-DD HH:mm:ss')
)
const thisWeekEnd = ref<string>(
  thisWeekEndDayjs.format('YYYY-MM-DD HH:mm:ss')
)
const lastWeekStart = ref<string>(
  lastWeekStartDayjs.format('YYYY-MM-DD HH:mm:ss')
)
const lastWeekEnd = ref<string>(
  lastWeekEndDayjs.format('YYYY-MM-DD HH:mm:ss')
)

/**
 * 四、月相关处理
 */
const thisMonthStartDayjs: Dayjs = nowDayjs.startOf('month')
const thisMonthEndDayjs: Dayjs = nowDayjs.endOf('month')

const lastMonthStartDayjs: Dayjs = nowDayjs.subtract(1, 'month').startOf('month')
const lastMonthEndDayjs: Dayjs = nowDayjs.subtract(1, 'month').endOf('month')

const thisMonthStart = ref<string>(
  thisMonthStartDayjs.format('YYYY-MM-DD HH:mm:ss')
)
const thisMonthEnd = ref<string>(
  thisMonthEndDayjs.format('YYYY-MM-DD HH:mm:ss')
)
const lastMonthStart = ref<string>(
  lastMonthStartDayjs.format('YYYY-MM-DD HH:mm:ss')
)
const lastMonthEnd = ref<string>(
  lastMonthEndDayjs.format('YYYY-MM-DD HH:mm:ss')
)

/**
 * 五、年相关处理
 */
const thisYearStartDayjs: Dayjs = nowDayjs.startOf('year')
const thisYearEndDayjs: Dayjs = nowDayjs.endOf('year')

const lastYearStartDayjs: Dayjs = nowDayjs.subtract(1, 'year').startOf('year')
const lastYearEndDayjs: Dayjs = nowDayjs.subtract(1, 'year').endOf('year')

const thisYearStart = ref<string>(
  thisYearStartDayjs.format('YYYY-MM-DD HH:mm:ss')
)
const thisYearEnd = ref<string>(
  thisYearEndDayjs.format('YYYY-MM-DD HH:mm:ss')
)
const lastYearStart = ref<string>(
  lastYearStartDayjs.format('YYYY-MM-DD HH:mm:ss')
)
const lastYearEnd = ref<string>(
  lastYearEndDayjs.format('YYYY-MM-DD HH:mm:ss')
)
</script>

<style scoped>
.app {
  padding: 20px;
  font-family: Arial, Helvetica, sans-serif;
}

section {
  margin-bottom: 20px;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
}

h1 {
  margin-bottom: 20px;
}

h2 {
  margin-bottom: 8px;
  font-size: 16px;
}

p {
  margin: 4px 0;
}
</style>
```
## 时间结构操作类

* 日期组件获取（年、月、日、时、分、秒）
* 日期组件设置（修改年、月、日、时、分、秒）
* 是否闰年判断
* 当月天数获取
* 周几获取
```vue
<template>
  <div class="app">
    <h1>Day.js 时间结构操作类示例</h1>

    <!-- 1. 日期组件获取 -->
    <section>
      <h2>1. 日期组件获取</h2>
      <p>基准时间：{{ baseTime }}</p>
      <p>年：{{ year }}</p>
      <p>月：{{ month }}</p>
      <p>日：{{ day }}</p>
      <p>时：{{ hour }}</p>
      <p>分：{{ minute }}</p>
      <p>秒：{{ second }}</p>
    </section>

    <!-- 2. 日期组件设置 -->
    <section>
      <h2>2. 日期组件设置</h2>
      <p>原始时间：{{ baseTime }}</p>
      <p>修改年为 2030：{{ setYear }}</p>
      <p>修改月为 12 月：{{ setMonth }}</p>
      <p>修改日为 15 日：{{ setDay }}</p>
      <p>修改小时为 18：{{ setHour }}</p>
      <p>修改分钟为 30：{{ setMinute }}</p>
      <p>修改秒为 45：{{ setSecond }}</p>
    </section>

    <!-- 3. 是否闰年判断 -->
    <section>
      <h2>3. 是否闰年判断</h2>
      <p>年份 {{ leapYear }} 是否闰年：{{ isLeap }}</p>
    </section>

    <!-- 4. 当月天数获取 -->
    <section>
      <h2>4. 当月天数获取</h2>
      <p>当前月份：{{ currentMonth }}</p>
      <p>当月天数：{{ daysInMonth }}</p>
    </section>

    <!-- 5. 周几获取 -->
    <section>
      <h2>5. 周几获取</h2>
      <p>当前日期：{{ today }}</p>
      <p>星期数（0=周日, 6=周六）：{{ weekDayNumber }}</p>
      <p>星期中文：{{ weekDayText }}</p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import dayjs, { Dayjs } from 'dayjs'
import isLeapYear from 'dayjs/plugin/isLeapYear'

dayjs.extend(isLeapYear)

/**
 * 基准时间
 */
const baseDayjs: Dayjs = dayjs('2026-01-13 10:20:30')
const baseTime = ref<string>(baseDayjs.format('YYYY-MM-DD HH:mm:ss'))

/**
 * 一、日期组件获取
 */
const year = ref<number>(baseDayjs.year())
const month = ref<number>(baseDayjs.month() + 1)
const day = ref<number>(baseDayjs.date())
const hour = ref<number>(baseDayjs.hour())
const minute = ref<number>(baseDayjs.minute())
const second = ref<number>(baseDayjs.second())

/**
 * 二、日期组件设置
 * 注意：month 仍然是 0-11，这里演示时用人类习惯的 1-12，所以要 -1
 */
const setYear = ref<string>(baseDayjs.year(2030).format('YYYY-MM-DD HH:mm:ss'))
const setMonth = ref<string>(
    baseDayjs.month(11).format('YYYY-MM-DD HH:mm:ss')
)
const setDay = ref<string>(baseDayjs.date(15).format('YYYY-MM-DD HH:mm:ss'))
const setHour = ref<string>(baseDayjs.hour(18).format('YYYY-MM-DD HH:mm:ss'))
const setMinute = ref<string>(baseDayjs.minute(30).format('YYYY-MM-DD HH:mm:ss'))
const setSecond = ref<string>(baseDayjs.second(45).format('YYYY-MM-DD HH:mm:ss'))

/**
 * 三、是否闰年判断
 */
const leapYearDayjs: Dayjs = dayjs('2024-01-01')
const leapYear = ref<number>(leapYearDayjs.year())
const isLeap = ref<boolean>(leapYearDayjs.isLeapYear())

/**
 * 四、当月天数获取
 */
const currentMonthDayjs: Dayjs = dayjs()
const currentMonth = ref<string>(currentMonthDayjs.format('YYYY-MM'))
const daysInMonth = ref<number>(currentMonthDayjs.daysInMonth())

/**
 * 五、周几获取
 */
const todayDayjs: Dayjs = dayjs()
const today = ref<string>(todayDayjs.format('YYYY-MM-DD'))

const weekDayNumber = ref<number>(todayDayjs.day())

const weekMap: Record<number, string> = {
  0: '星期日',
  1: '星期一',
  2: '星期二',
  3: '星期三',
  4: '星期四',
  5: '星期五',
  6: '星期六'
}

const weekDayText = ref<string>(weekMap[weekDayNumber.value] ?? '')
</script>

<style scoped>
.app {
  padding: 20px;
  font-family: Arial, Helvetica, sans-serif;
}

section {
  margin-bottom: 20px;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
}

h1 {
  margin-bottom: 20px;
}

h2 {
  margin-bottom: 8px;
  font-size: 16px;
}

p {
  margin: 4px 0;
}
</style>
```
## 显示与用户体验类

* 多语言国际化
* 相对时间显示（几分钟前、几天后）
* 自然语言友好显示（今天、昨天、明天）
```vue
<template>
  <div class="app">
    <h1>Day.js 显示与用户体验类示例</h1>

    <!-- 1. 多语言国际化 -->
    <section>
      <h2>1. 多语言国际化</h2>
      <p>当前语言：{{ currentLocale }}</p>
      <p>当前时间显示：{{ localizedNow }}</p>
      <button @click="switchToChinese">切换为中文</button>
      <button @click="switchToEnglish">切换为英文</button>
    </section>

    <!-- 2. 相对时间显示 -->
    <section>
      <h2>2. 相对时间显示（几分钟前、几天后）</h2>
      <p>基准时间：{{ baseTime }}</p>
      <p>1 小时前：{{ oneHourAgo }}</p>
      <p>3 天后：{{ threeDaysLater }}</p>
    </section>

    <!-- 3. 自然语言友好显示 -->
    <section>
      <h2>3. 自然语言友好显示（今天、昨天、明天）</h2>
      <p>日期 A：{{ dateA }} → {{ naturalTextA }}</p>
      <p>日期 B：{{ dateB }} → {{ naturalTextB }}</p>
      <p>日期 C：{{ dateC }} → {{ naturalTextC }}</p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import dayjs, { Dayjs } from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'
import 'dayjs/locale/en'

dayjs.extend(relativeTime)

/**
 * 一、多语言国际化
 */
type LocaleType = 'zh-cn' | 'en'

const currentLocale = ref<LocaleType>('zh-cn')

const switchToChinese = (): void => {
  currentLocale.value = 'zh-cn'
  dayjs.locale('zh-cn')
}

const switchToEnglish = (): void => {
  currentLocale.value = 'en'
  dayjs.locale('en')
}

dayjs.locale(currentLocale.value)

const localizedNow = computed<string>(() => {
  const now: Dayjs = dayjs()
  return now.format('YYYY MMMM DD HH:mm:ss')
})

/**
 * 二、相对时间显示
 */
const baseDayjs: Dayjs = dayjs()
const baseTime = ref<string>(baseDayjs.format('YYYY-MM-DD HH:mm:ss'))

const oneHourAgo = computed<string>(() => {
  const time: Dayjs = baseDayjs.subtract(1, 'hour')
  return time.from(baseDayjs)
})

const threeDaysLater = computed<string>(() => {
  const time: Dayjs = baseDayjs.add(3, 'day')
  return time.from(baseDayjs)
})

/**
 * 三、自然语言友好显示（今天 / 昨天 / 明天）
 */
const formatNaturalDate = (date: Dayjs): string => {
  const today: Dayjs = dayjs().startOf('day')
  const target: Dayjs = date.startOf('day')

  if (target.isSame(today, 'day')) {
    return '今天'
  }

  if (target.isSame(today.subtract(1, 'day'), 'day')) {
    return '昨天'
  }

  if (target.isSame(today.add(1, 'day'), 'day')) {
    return '明天'
  }

  return date.format('YYYY-MM-DD')
}

const dateADayjs: Dayjs = dayjs()
const dateBDayjs: Dayjs = dayjs().subtract(1, 'day')
const dateCDayjs: Dayjs = dayjs().add(1, 'day')

const dateA = ref<string>(dateADayjs.format('YYYY-MM-DD'))
const dateB = ref<string>(dateBDayjs.format('YYYY-MM-DD'))
const dateC = ref<string>(dateCDayjs.format('YYYY-MM-DD'))

const naturalTextA = ref<string>(formatNaturalDate(dateADayjs))
const naturalTextB = ref<string>(formatNaturalDate(dateBDayjs))
const naturalTextC = ref<string>(formatNaturalDate(dateCDayjs))
</script>

<style scoped>
.app {
  padding: 20px;
  font-family: Arial, Helvetica, sans-serif;
}

section {
  margin-bottom: 20px;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
}

h1 {
  margin-bottom: 20px;
}

h2 {
  margin-bottom: 8px;
  font-size: 16px;
}

p {
  margin: 4px 0;
}

button {
  margin-right: 8px;
  padding: 4px 10px;
  cursor: pointer;
}
</style>
```
## 时区与标准时间类（中高级）

* UTC 时间处理
* 时区时间处理
* 与后端时间格式统一处理
```vue
<template>
  <div class="app">
    <h1>Day.js 时区与标准时间类示例</h1>

    <!-- 1. UTC 时间处理 -->
    <section>
      <h2>1. UTC 时间处理</h2>
      <p>本地当前时间：{{ localNow }}</p>
      <p>UTC 当前时间：{{ utcNow }}</p>
      <p>UTC 转为本地时间：{{ utcToLocal }}</p>
    </section>

    <!-- 2. 时区时间处理 -->
    <section>
      <h2>2. 时区时间处理</h2>
      <p>原始时间（UTC）：{{ baseUtcTime }}</p>
      <p>上海时间（Asia/Shanghai）：{{ shanghaiTime }}</p>
      <p>东京时间（Asia/Tokyo）：{{ tokyoTime }}</p>
      <p>纽约时间（America/New_York）：{{ newYorkTime }}</p>
    </section>

    <!-- 3. 与后端时间格式统一处理 -->
    <section>
      <h2>3. 与后端时间格式统一处理</h2>

      <p>后端返回时间（ISO/UTC）：{{ backendTime }}</p>
      <p>前端展示用本地时间：{{ frontendDisplayTime }}</p>

      <p>前端提交给后端（统一 UTC ISO）：{{ frontendSubmitTime }}</p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import dayjs, { Dayjs } from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

/**
 * 一、UTC 时间处理
 */
const localNowDayjs: Dayjs = dayjs()
const utcNowDayjs: Dayjs = dayjs().utc()

const localNow = ref<string>(localNowDayjs.format('YYYY-MM-DD HH:mm:ss'))
const utcNow = ref<string>(utcNowDayjs.format('YYYY-MM-DD HH:mm:ss [UTC]'))

const utcToLocal = ref<string>(
  utcNowDayjs.local().format('YYYY-MM-DD HH:mm:ss')
)

/**
 * 二、时区时间处理
 * 统一基准时间使用 UTC，避免跨系统时间偏差
 */
const baseUtcDayjs: Dayjs = dayjs.utc('2026-01-13T08:00:00Z')
const baseUtcTime = ref<string>(baseUtcDayjs.format())

const shanghaiTime = ref<string>(
  baseUtcDayjs.tz('Asia/Shanghai').format('YYYY-MM-DD HH:mm:ss')
)

const tokyoTime = ref<string>(
  baseUtcDayjs.tz('Asia/Tokyo').format('YYYY-MM-DD HH:mm:ss')
)

const newYorkTime = ref<string>(
  baseUtcDayjs.tz('America/New_York').format('YYYY-MM-DD HH:mm:ss')
)

/**
 * 三、与后端时间格式统一处理
 * 约定：
 * - 后端统一使用 UTC + ISO8601
 * - 前端展示转为本地时间
 * - 前端提交再转回 UTC
 */

// 模拟后端返回的时间（UTC ISO 格式）
const backendTime = ref<string>('2026-01-13T08:00:00Z')

// 前端解析后端时间并转为本地时间展示
const frontendDisplayTime = ref<string>(
  dayjs.utc(backendTime.value).local().format('YYYY-MM-DD HH:mm:ss')
)

// 前端用户编辑后的时间（假设是本地时间字符串）
const userInputLocalTime = '2026-01-13 20:00:00'

// 提交给后端时统一转为 UTC ISO 格式
const frontendSubmitTime = ref<string>(
  dayjs(userInputLocalTime).utc().toISOString()
)
</script>

<style scoped>
.app {
  padding: 20px;
  font-family: Arial, Helvetica, sans-serif;
}

section {
  margin-bottom: 20px;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
}

h1 {
  margin-bottom: 20px;
}

h2 {
  margin-bottom: 8px;
  font-size: 16px;
}

p {
  margin: 4px 0;
}
</style>
```
