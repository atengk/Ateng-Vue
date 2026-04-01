<script setup lang="ts">
import {useRouter} from 'vue-router'

const router = useRouter()

function goHome() {
  router.push('/')
  /*router.push({
    name: 'Home'
  })*/
}

</script>

<template>
  <h1>About 页面</h1>
  <button @click="goHome">去 Home</button>
</template>
