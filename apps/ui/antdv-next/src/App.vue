<script setup lang="ts">
import { reactive } from 'vue'
import { message } from 'antdv-next'

interface FormState {
  username: string
  password: string
}

const formState = reactive<FormState>({
  username: '',
  password: ''
})

const onSubmit = () => {
  message.success(`用户名：${formState.username}`)
}
</script>

<template>
  <a-form :model="formState" layout="vertical">
    <a-form-item label="用户名">
      <a-input v-model:value="formState.username" />
    </a-form-item>

    <a-form-item label="密码">
      <a-input-password v-model:value="formState.password" />
    </a-form-item>

    <a-form-item>
      <a-button type="primary" @click="onSubmit">
        提交
      </a-button>
    </a-form-item>
  </a-form>
</template>