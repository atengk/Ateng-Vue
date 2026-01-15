<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useMqttClientInject } from '@/composables/useMqttClientProvider'

// inject 全局 MQTT
const mqtt = useMqttClientInject()

const list = ref<string[]>([])

onMounted(() => {
  mqtt.subscribe('ateng/vue/mqtt/topic')

  mqtt.onMessage((topic, payload) => {
    list.value.unshift(`[${topic}] ${payload}`)
  })
})

const send = () => {
  mqtt.publish('ateng/vue/mqtt/topic', 'Hello MQTT!')
}
</script>

<template>
  <div>
    <h3>MQTT 状态：</h3>
    <p>
      连接状态：
      <span v-if="mqtt.isConnected">🟢 已连接</span>
      <span v-else>🔴 未连接</span>
    </p>

    <button @click="send" :disabled="!mqtt.isConnected">
      📤 发送测试消息
    </button>

    <h4>消息列表：</h4>
    <ul>
      <li v-for="(item, i) in list" :key="i">{{ item }}</li>
    </ul>
  </div>
</template>
