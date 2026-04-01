<script setup lang="ts">
import { provideWebSocket } from '@/composables/useWebSocketProvider'
import WsDemo from '@/views/WsDemo.vue'

/**
 * 从环境变量中获取 WebSocket 基础地址
 */
const WS_URL = import.meta.env.VITE_WS_URL as string

/**
 * 从 localStorage 中读取 token
 * 建议统一约定 key，例如：ACCESS_TOKEN
 */
const TOKEN_KEY = 'ACCESS_TOKEN'
const token = localStorage.getItem(TOKEN_KEY)

/**
 * 拼接最终 WebSocket 连接地址
 */
let wsUrl = WS_URL

if (token) {
  wsUrl = `${WS_URL}?token=${encodeURIComponent(token)}`
  console.info('[WebSocket] 已从 localStorage 中读取到 Token，已拼接到连接地址')
} else {
  console.warn(
      `[WebSocket] 未在 localStorage 中找到 Token（key=${TOKEN_KEY}），将以匿名方式建立连接`
  )
}

console.info('[WebSocket] 最终连接地址：', wsUrl)
provideWebSocket(wsUrl)

</script>

<template>
  <WsDemo />

</template>