<!-- BaseList.vue -->
<template>
  <ul>
    <li v-for="item in list" :key="item.id">
      <slot :item="item" />
    </li>
  </ul>
</template>

<script setup lang="ts">
defineProps<{
  list: BaseListItem[]
}>()
export interface BaseListItem {
  id: number
  name: string
}
</script>