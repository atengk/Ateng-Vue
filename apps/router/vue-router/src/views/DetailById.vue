<script setup lang="ts">
import {computed} from 'vue'
import {useRoute} from 'vue-router'

const route = useRoute()

const id = computed<string>(() => {
  const param = route.params.id
  return typeof param === 'string' ? param : ''
})
</script>

<template>
  <h1>DetailById 页面（params）</h1>

  <p>当前 id：{{ id }}</p>
</template>