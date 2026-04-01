<script setup lang="ts">
interface Props {
  name: string
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
      :style="{ width: props.size + 'px', height: props.size + 'px', color: props.color }"
  >
    <!-- 直接引用 symbol -->
    <use :href="`#icon-${props.name}`" />
  </svg>
</template>

<style scoped>
.icon {
  display: inline-block;
  vertical-align: middle;
  fill: currentColor;
}
</style>