<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

import { provideStomp } from '@/composables/useStompProvider'

const stomp = provideStomp({
  url: 'http://localhost:18002/ws',

  connectHeaders: {
    Authorization: 'Bearer Admin@123',
    userId: '10001'
  },
  heartbeatIncoming: 10000,
  heartbeatOutgoing: 10000,
  reconnectDelay: 5000,

  // 应用层心跳（可选）
  heartbeatDestination: '/app/heartbeat',
  heartbeatSendInterval: 30000,

  debug: true
})

const messages = ref<any[]>([])

onMounted(() => {
  stomp.connect()

  stomp.subscribe({
    destination: '/topic/public',
    callback: (data) => {
      console.log('收到消息:', data)
      messages.value.push(data)
    }
  })
})

const sendMessage = () => {
  stomp.publish('/app/public.send', {
    text: '你好！' + new Date().toLocaleTimeString()
  })
}

onUnmounted(() => {
  stomp.disconnect()
})
</script>

<template>
  <div>
    <button @click="sendMessage">发送消息</button>

    <h3>订阅收到的消息：</h3>
    <ul>
      <li v-for="(msg, index) in messages" :key="index">
        {{ msg }}
      </li>
    </ul>
  </div>
</template>
