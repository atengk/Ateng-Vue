<template>
  <div class="app">
    <h1>用户信息</h1>

    <p v-if="payload">
      用户名：{{ payload.name }} <br />
      用户ID：{{ payload.userId }} <br />
      权限：{{ payload.role }} <br />
      Token 状态：
      <strong>{{ isExpired ? '已过期' : '有效' }}</strong>
    </p>

    <button @click="logout">清除 Token</button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCookies } from '@vueuse/integrations/useCookies'
import { useJwt } from '@vueuse/integrations/useJwt'

const cookies = useCookies()
const token = ref(cookies.get<string>('token') || '')

const { payload } = useJwt(token)

const now = computed(() => Math.floor(Date.now() / 1000))
const isExpired = computed(() => payload.value?.exp && payload.value.exp < now.value)

function logout() {
  cookies.remove('token', { path: '/' })
  token.value = ''
}
</script>

<style scoped>
.app {
  padding: 24px;
  font-family: sans-serif;
}
strong {
  color: #67c23a;
}
</style>