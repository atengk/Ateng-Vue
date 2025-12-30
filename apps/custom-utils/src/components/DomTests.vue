<script setup lang="ts">


import { onMounted } from 'vue'
import { setTitle } from '@/utils/dom'

onMounted(() => {
  setTitle('用户管理')
})

import { scrollToTop } from '@/utils/dom'

function handleBackTop() {
  scrollToTop(true)
}

import { isInViewport } from '@/utils/dom'

const el = document.getElementById('target')

if (el && isInViewport(el)) {
  console.log('元素已进入视口')
}

import { getScrollPosition } from '@/utils/dom'

const position = getScrollPosition()

console.log(position.y)


</script>

<template>

</template>

<style scoped>

</style>