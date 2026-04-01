<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

interface DetailQuery {
  id?: string
  name?: string
}

const route = useRoute()

const query = route.query as DetailQuery

const id = computed<string>(() => query.id ?? '')
const name = computed<string>(() => query.name ?? '')
</script>

<template>
  <h1>Detail 页面</h1>

  <p>id：{{ id }}</p>
  <p>name：{{ name }}</p>
</template>
