<script setup lang="ts">
import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core'

/**
 * 弹窗是否显示
 */
const visible = ref(false)

/**
 * 弹窗 DOM 引用
 */
const popupRef = ref<HTMLElement | null>(null)

/**
 * 监听点击弹窗外部
 */
onClickOutside(popupRef, () => {
  visible.value = false
})
</script>

<template>
  <div class="container">
    <h1>onClickOutside（点击外部关闭组件）</h1>

    <button @click="visible = true">打开弹窗</button>

    <div
        v-if="visible"
        ref="popupRef"
        class="popup"
    >
      <h3>我是弹窗</h3>
      <p>点击弹窗外部区域会自动关闭</p>
    </div>
  </div>
</template>

<style scoped>
.container {
  padding: 24px;
}

button {
  padding: 6px 14px;
  border: none;
  background-color: #409eff;
  color: #ffffff;
  border-radius: 4px;
  cursor: pointer;
}

.popup {
  width: 260px;
  margin-top: 16px;
  padding: 16px;
  border: 1px solid #dcdcdc;
  border-radius: 6px;
  background-color: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
</style>