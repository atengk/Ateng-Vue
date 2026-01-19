base < components < utilities
<script setup lang="ts">
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <div class="card">
      <h2 class="card-title">卡片标题</h2>
      <p class="card-desc">
        这个卡片样式来自 @layer components
      </p>
      <button class="btn-primary">
        按钮来自 @layer components
      </button>
    </div>
  </div>
</template>

<style>
/* Tailwind v4 中通常在全局 css 文件写，这里为示例写在 SFC 中 */

/* 1. 基础层：base */
@layer base {
  body {
    font-family: system-ui, sans-serif;
  }
}

/* 2. 组件层：components */
@layer components {
  .card {
    @apply bg-white p-6 rounded-lg shadow w-72;
  }

  .card-title {
    @apply text-lg font-bold mb-2;
  }

  .card-desc {
    @apply text-gray-500 text-sm mb-4;
  }

  .btn-primary {
    @apply px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition;
  }
}

/* 3. 工具层：utilities */
@layer utilities {
  .text-shadow {
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.4);
  }
}
</style>