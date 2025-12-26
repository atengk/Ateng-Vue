<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <div>
    <h1>About</h1>
    <p>当前路径：{{ route.path }}</p>
    <router-link to="/">回首页</router-link>
  </div>
</template>
