<script setup lang="ts">
import {storeToRefs} from 'pinia'
import {useUserStore} from '@/stores'

const userStore = useUserStore()

/**
 * 使用 storeToRefs 保持响应性
 */
const {profile} = storeToRefs(userStore)
</script>

<template>
  <div style="padding: 16px;">
    <h2>User Store 视图示例</h2>

    <div>
      <pre v-if="profile">
        {{ profile }}
      </pre>

      <p v-else>暂无用户信息</p>
    </div>
  </div>
</template>
