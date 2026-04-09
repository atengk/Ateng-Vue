<!--
子组件：列表项组件（可复用、可维护）
@author Ateng
@since 2026-04-09
-->
<template>
  <div class="item">
    <span class="index">{{ index }}</span>
    <span class="name">{{ item.name }}</span>
    <span class="age">{{ item.age }} 岁</span>
  </div>
</template>

<script setup>
/**
 * 定义 props
 */
defineProps({
  item: {
    type: Object,
    required: true
  },
  index: {
    type: Number,
    required: true
  }
})
</script>

<style scoped>
.item {
  display: flex;
  align-items: center;
  height: 60px;
  padding: 0 12px;
  border-bottom: 1px solid #f0f0f0;
}

.index {
  width: 60px;
  color: #999;
}

.name {
  flex: 1;
}

.age {
  color: #666;
}
</style>