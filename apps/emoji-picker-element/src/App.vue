<template>
  <div class="page">
    <div class="card">
      <h3 class="title">Emoji 输入示例</h3>

      <EmojiInput v-model="content" />

      <p class="label">当前内容：</p>
      <div class="preview">
        {{ content }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import EmojiInput from '@/components/EmojiInput.vue';

const content = ref<string>('');
</script>

<style scoped>
.page {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f5f7fa;
}

.card {
  width: 360px;
  padding: 20px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.title {
  margin-bottom: 12px;
  font-size: 16px;
  font-weight: 600;
  text-align: center;
}

.label {
  margin-top: 12px;
  font-size: 14px;
  color: #606266;
}

.preview {
  margin-top: 6px;
  padding: 8px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  min-height: 32px;
  background: #fafafa;
  word-break: break-all;
}
</style>
