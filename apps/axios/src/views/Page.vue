<script setup lang="ts">
import {ref} from 'vue'
import {getUserPage} from "@/api";
import type {UserInfo, UserPageQuery} from "@/api";

const users = ref<UserInfo[]>([])
const total = ref(0)

const emptyQuery = (): UserPageQuery => ({
  page: 1,
  size: 10,
  name: undefined,
  age: undefined
})

const query = ref<UserPageQuery>(emptyQuery())

const loadData = async () => {
  const res = await getUserPage(query.value)
  users.value = res.records
  total.value = res.total
}

// 重置
const resetForm = () => {
  Object.assign(query.value, emptyQuery())
}

</script>

<template>
  <div class="toolbar">
    <label>
      姓名：
      <input v-model="query.name"/>
    </label>

    <label>
      年龄：
      <input type="number" v-model.number="query.age"/>
    </label>

    <label>
      page：
      <input type="number" v-model.number="query.page"/>
    </label>

    <label>
      size：
      <input type="number" v-model.number="query.size"/>
    </label>

    <div class="actions">
      <button @click="loadData">查询</button>
      <button @click="resetForm">重置</button>
    </div>
  </div>

  <div>总数：{{ total }}</div>
  <pre>{{ users }}</pre>
</template>

<style scoped>
.toolbar {
  margin-bottom: 12px;
}

.toolbar label {
  margin-right: 12px;
}

.actions {
  display: flex;
  gap: 8px;
}
</style>
