<script setup lang="ts">
import { ref, watch } from 'vue'
import { useGlobalWebSocket } from '@/composables/useWebSocketProvider'

const {
  status,
  send,
  open,
  close,
  latest,
  dataList,
} = useGlobalWebSocket()

const input = ref('')

const sendMsg = () => {
  if (!input.value) return
  send(input.value)
  input.value = ''
}
</script>

<template>
  <div style="padding:20px">
    <h2>全局 WebSocket（App 内直用版）</h2>

    <p>
      当前状态：
      <b :style="{ color: status === 'OPEN' ? 'green' : 'red' }">
        {{ status }}
      </b>
    </p>

    <div>
      <button @click="open">连接</button>
      <button @click="close()">断开</button>
    </div>

    <div style="margin-top:12px">
      <input v-model="input" placeholder="输入消息" />
      <button @click="sendMsg">发送</button>
    </div>

    <div style="margin-top:12px">
      <h4>最新一条数据：</h4>
      <pre>{{ latest }}</pre>
    </div>

    <div style="margin-top:12px;background:#f6f6f6;max-height:200px;overflow:auto">
      <h4>最近 100 条数据：</h4>
      <div v-for="(m, i) in dataList" :key="i">
        {{ m }}
      </div>
    </div>
  </div>
</template>
