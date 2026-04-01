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
