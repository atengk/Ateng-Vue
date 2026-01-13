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
