<script setup lang="ts">
import { onMounted } from 'vue'
import { provideMqttClient } from '@/composables/useMqttClientProvider'
import MqttDemo from "@/views/MqttDemo.vue";

// 创建并 provide 全局 MQTT
const mqtt = provideMqttClient()

onMounted(() => {
  mqtt.connect({
    url: 'ws://175.178.193.128:20014/ws',
    username: 'admin',
    password: 'Admin@123',
    clientId: 'vue-' + Math.random().toString(16).slice(2),
    clean: true,
  })
})
</script>

<template>
  <MqttDemo />
</template>
