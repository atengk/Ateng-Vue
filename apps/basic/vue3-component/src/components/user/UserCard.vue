<script setup lang="ts">
const props = defineProps<{
  name: string
  age: number,
  visible: boolean
}>()
const emit = defineEmits<{
  (e: 'submit'): void,
  (e: 'update:visible', value: boolean): void

}>()

import { inject } from 'vue'

const userId = inject<string>('userId')
const readonly = inject<boolean>('readonly')
</script>

<template>

  <h1>{{userId}}</h1>
  <h1>{{readonly}}</h1>
  <h1>{{props.age}}</h1>
  <h1>{{props.name}}</h1>

  <button @click="emit('submit')">
    提交
  </button>
  <button @click="emit('update:visible', false)">
    提交2
  </button>

  <div class="dialog">
    <header>
      <slot name="header" />
    </header>

    <main>
      <slot />
    </main>

    <footer>
      <slot name="footer" />
    </footer>
  </div>
</template>

<style scoped>

</style>