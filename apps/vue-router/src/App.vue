<script setup lang="ts">
</script>

<template>
  <nav>
    <router-link to="/">首页</router-link> |
    <router-link to="/about">关于</router-link> |
    <router-link :to="`/user/1`">用户1</router-link>
  </nav>

  <router-view />
</template>

<style scoped>
</style>
