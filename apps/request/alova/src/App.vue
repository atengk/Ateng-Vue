<!-- 按钮触发请求 -->
<script setup lang="ts">
/**
 * 手动触发请求示例
 * @author Ateng
 * @date 2026-04-08
 */
import { useRequest } from 'alova/client';
import { getPostList, type PostItem } from '@/api/modules/user';

const { data, loading, error, send } = useRequest(
    () => getPostList({ userId: 1 }),
    {
      immediate: false
    }
);

const handleFetch = async () => {
  await send();
};
</script>

<template>
  <div>
    <button :disabled="loading" @click="handleFetch">
      {{ loading ? '加载中...' : '加载数据' }}
    </button>

    <div v-if="error">请求失败</div>

    <ul v-if="data">
      <li v-for="item in data as PostItem[]" :key="item.id">
        {{ item.title }}
      </li>
    </ul>
  </div>
</template>