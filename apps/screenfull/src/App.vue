<script setup lang="ts">
import { useFullscreen } from '@/composables/useFullscreen';

const { isFullscreen, toggle } = useFullscreen();

const handleToggle = () => {
  toggle();
};
</script>

<template>
  <div>
    <button @click="handleToggle">
      {{ isFullscreen ? '退出全屏' : '进入全屏' }}
    </button>

    <p style="margin-top:12px;">
      当前屏幕状态：
      <strong>{{ isFullscreen ? '全屏模式' : '普通模式' }}</strong>
    </p>
  </div>
</template>
