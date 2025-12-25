<script setup lang="ts">
import {ref} from 'vue'
import {getUserDetail} from '@/api'
import type {UserInfo} from '@/api'

const userId = ref<number | ''>('')
const user = ref<UserInfo | null>(null)

const loadData = async () => {
  if (!userId.value) {
    user.value = null
    return
  }

  user.value = await getUserDetail(userId.value)
}
</script>

<template>
  <div class="toolbar">
    <label>
      用户ID：
      <input type="number" v-model.number="userId"/>
    </label>

    <button @click="loadData">查询</button>
  </div>

  <div v-if="user">
    <h4>用户信息</h4>
    <pre>{{ user }}</pre>
  </div>
</template>

<style scoped>
.toolbar {
  margin-bottom: 12px;
}

.toolbar label {
  margin-right: 12px;
}
</style>
