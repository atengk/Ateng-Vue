<script setup lang="ts">
import {onMounted, ref} from 'vue'
import {createUserWithOptions, getUserList} from "@/api";
import type {UserInfo} from "@/api";

const users = ref<UserInfo[]>([])

const loadData = async () => {
  const res = await getUserList()
  users.value = res
}
onMounted(async () => {
  try {
    await createUserWithOptions({ notify: true }, {name: "ateng", age: 12})
    console.log('创建成功')
  } catch (e: any) {
    console.log('发生了错误---',e.message)
  }
})


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
