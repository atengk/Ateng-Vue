<!-- StatusTag.vue -->
<template>
  <slot :status="status" :text="text" />
</template>

<script setup lang="ts">
const props = defineProps<{
  status: 'success' | 'error'
}>()

const text = props.status === 'success' ? '成功' : '失败'
</script>