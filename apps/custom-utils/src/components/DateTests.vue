<script setup lang="ts">
import { formatDate } from '@/utils/date'

const createTime = '2025-12-30T08:30:00'

const text = formatDate(createTime, 'YYYY-MM-DD')

import { startOfDay, endOfDay } from '@/utils/date'

const date = new Date()

const params = {
  startTime: startOfDay(date)?.getTime(),
  endTime: endOfDay(date)?.getTime()
}

import { fromNow } from '@/utils/date'

const messageTime = Date.now() - 1000 * 60 * 5

const label = fromNow(messageTime)
// 5 分钟前

import { toTimestamp } from '@/utils/date'

const timestamp = toTimestamp('2025-12-30 10:00:00')


</script>

<template>

</template>

<style scoped>

</style>