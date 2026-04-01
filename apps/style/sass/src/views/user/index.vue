<template>
  <div class="user-page">
    <h1>用户页面</h1>
    <div class="button-group">
      <button class="btn primary">主按钮</button>
      <button class="btn success">成功按钮</button>
      <button class="btn warning">警告按钮</button>
      <button class="btn error">错误按钮</button>
    </div>

    <div class="toggle-theme">
      <label>
        <input type="checkbox" v-model="darkMode" /> 暗黑模式
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const darkMode = ref(false);

watch(darkMode, (val) => {
  if (val) {
    document.body.classList.add('dark');
  } else {
    document.body.classList.remove('dark');
  }
});
</script>

<style lang="scss" scoped>
.user-page {
  padding: 16px;

  h1 {
    margin-bottom: 16px;
    font-size: 20px;
  }

  .button-group {
    display: flex;
    gap: 12px;
    margin-bottom: 16px;
  }

  .toggle-theme {
    margin-top: 12px;
  }
}
</style>