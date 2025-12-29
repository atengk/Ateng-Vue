<script setup lang="ts">
import { useCounter } from '@/composables/useCounter'

const { count, increment, decrement } = useCounter()
</script>

<template>
  <button @click="decrement">-</button>
  <span>{{ count }}</span>
  <button @click="increment">+</button>

</template>

<style scoped>
</style>
