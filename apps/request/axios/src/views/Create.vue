<script setup lang="ts">
import {ref} from 'vue'
import {createUser} from '@/api'
import type {UserInfo} from "@/api";

type CreateUser = Omit<UserInfo, 'id'>

const createEmptyForm = (): CreateUser => ({
  birthday: '',
  city: '',
  province: '',
  score: 0,
  name: '',
  age: 0
})

const form = ref<CreateUser>(createEmptyForm())

// 重置
const resetForm = () => {
  Object.assign(form.value, createEmptyForm())
}

const submit = async () => {
  await createUser(form.value)
}
</script>

<template>
  <div class="toolbar">
    <label>
      姓名：
      <input v-model="form.name"/>
    </label>

    <label>
      年龄：
      <input type="number" v-model.number="form.age"/>
    </label>

    <div class="actions">
      <button @click="submit">创建</button>
      <button @click="resetForm">重置</button>
    </div>
  </div>

  <pre>{{ form }}</pre>
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
