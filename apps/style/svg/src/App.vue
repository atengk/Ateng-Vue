<script setup lang="ts">
import SvgIcon from '@/components/SvgIcon.vue'
</script>

<template>
  <div class="demo">
    <SvgIcon name="user" :size="40" color="red" />
    <SvgIcon name="home" :size="60" color="#409eff" />
    <SvgIcon name="user" :size="80" color="#67c23a" />
  </div>
</template>

<style scoped>
.demo {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px;
  background-color: #f5f5f5;
}
</style>