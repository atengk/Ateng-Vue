<script setup lang="ts">

interface Props {
  size?: number
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 24,
  color: '#333'
})

</script>

<template>

  <svg
      class="icon"
      :style="{
      width: props.size + 'px',
      height: props.size + 'px',
      color: props.color
    }"
      viewBox="0 0 1024 1024"
  >
    <path d="M512 64L64 896h896z" />
  </svg>

</template>

<style scoped>

.icon {
  fill: currentColor;
  display: inline-block;
}

</style>