<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
</script>

<template>
  <div>
    <h1>User</h1>
    <p>用户ID：{{ route.params.id }}</p>
    <button @click="router.push('/')">回首页</button>
  </div>
</template>
