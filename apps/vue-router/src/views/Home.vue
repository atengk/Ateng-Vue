<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function goAbout() {
  router.push('/about')
}
</script>

<template>
  <div>
    <h1>Home</h1>
    <button @click="goAbout">去 About</button>
  </div>
</template>
