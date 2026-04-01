<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

/**
 * 全局返回
 */
function handleBack() {
  router.back()
}

/**
 * 全局前进
 */
function handleForward() {
  router.go(1)
}
</script>

<template>
  <nav>
    <button @click="handleBack">
      返回
    </button>
    |
    <button @click="handleForward">
      前进
    </button>
    |
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
  </nav>

  <router-view />
</template>
