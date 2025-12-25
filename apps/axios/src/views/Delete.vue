<script setup lang="ts">
import {ref} from 'vue'
import {deleteUser} from '@/api'

const userId = ref<number | ''>('')

const handleDeleteUser = async () => {
  await deleteUser(userId.value)
}
</script>

<template>
  <div class="toolbar">
    <label>
      用户ID：
      <input type="number" v-model.number="userId"/>
    </label>

    <button @click="handleDeleteUser">删除</button>
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
