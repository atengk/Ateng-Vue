<script setup lang="ts">
import { onMounted } from 'vue'
import { provideMqttClient } from '@/composables/useMqttClientProvider'
import MqttDemo from "@/views/MqttDemo.vue";

// 创建并 provide 全局 MQTT
const mqtt = provideMqttClient()

onMounted(() => {
  mqtt.connect({
    url: 'ws://192.168.1.12:8083/mqtt',
    username: 'admin',
    password: 'public',
    clientId: 'vue-' + Math.random().toString(16).slice(2),
    clean: true,
  })
})
</script>

<template>
  <MqttDemo />
</template>
