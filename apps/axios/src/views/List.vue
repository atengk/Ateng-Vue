<script setup lang="ts">
import {ref} from 'vue'
import {getUserList} from "@/api";
import type {UserInfo} from "@/api";

const users = ref<UserInfo[]>([])

const loadData = async () => {
  const res = await getUserList()
  users.value = res
}

</script>

<template>
  <div class="toolbar">
    <button @click="loadData">查询</button>
  </div>

  <pre>{{ users }}</pre>
</template>

<style scoped>
.toolbar {
  margin-bottom: 12px;
}

.toolbar label {
  margin-right: 12px;
}
</style>
