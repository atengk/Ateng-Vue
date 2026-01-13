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