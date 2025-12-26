<script setup lang="ts">
import {storeToRefs} from 'pinia'
import {useUserStore} from '@/stores'

const userStore = useUserStore()

/**
 * 使用 storeToRefs 保持响应性
 */
const {profile, loaded} = storeToRefs(userStore)

/**
 * 保存用户信息（模拟）
 */
function handleSave() {
  userStore.setProfile({
    id: '1001',
    username: 'admin',
    nickname: '系统管理员',
    avatar: '',
    email: 'admin@example.com',
    phone: '13800000000'
  })
}

/**
 * 获取用户信息
 */
async function handleFetch() {
  await userStore.fetchProfile()
}

/**
 * 删除用户信息
 */
function handleClear() {
  userStore.clearProfile()
}
</script>

<template>
  <div style="padding: 16px;">
    <h2>User Store 完整示例</h2>

    <!-- 操作区 -->
    <div style="margin-bottom: 12px;">
      <button @click="handleSave">setProfile</button>
      <button @click="handleFetch" style="margin-left: 8px;">
        fetchProfile
      </button>
      <button @click="handleClear" style="margin-left: 8px;">
        clearProfile
      </button>
    </div>

    <!-- 状态区 -->
    <div style="margin-bottom: 12px;">
      <p><strong>loaded（state）：</strong>{{ loaded }}</p>
      <p><strong>hasProfile（getter）：</strong>{{ userStore.hasProfile }}</p>
    </div>

    <!-- 数据展示 -->
    <div>
      <p><strong>profile（state）：</strong></p>

      <pre v-if="profile">
        {{ profile}}
      </pre>

      <p v-else>暂无用户信息</p>
    </div>

    <!-- 调试区 -->
    <div style="margin-top: 16px;">
      <p><strong>store 实例（调试用）：</strong></p>
      <pre>
{{ userStore }}
      </pre>
    </div>
  </div>
</template>
