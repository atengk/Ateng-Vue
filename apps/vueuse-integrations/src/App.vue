<template>
  <div class="app">
    <h1>VueUse - useNProgress</h1>

    <button @click="load">模拟加载 2 秒</button>

    <p v-if="isLoading">加载中...</p>
  </div>
</template>

<script setup lang="ts">
import { useNProgress } from '@vueuse/integrations/useNProgress'

const { isLoading, start, done } = useNProgress()

async function load() {
  start()
  await new Promise(resolve => setTimeout(resolve, 2000))
  done()
}
</script>

<style scoped>
.app {
  padding: 24px;
  font-family: sans-serif;
}
button {
  padding: 8px 16px;
}
</style>