<template>
  <n-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100"
  >
    <n-form-item label="姓名" path="name">
      <n-input v-model:value="form.name" placeholder="请输入姓名" />
    </n-form-item>

    <n-form-item label="邮箱" path="email">
      <n-input v-model:value="form.email" placeholder="请输入邮箱" />
    </n-form-item>

    <n-form-item label="性别" path="gender">
      <n-radio-group v-model:value="form.gender">
        <n-radio value="male">男</n-radio>
        <n-radio value="female">女</n-radio>
      </n-radio-group>
    </n-form-item>

    <n-form-item label="爱好" path="hobby">
      <n-checkbox-group v-model:value="form.hobby">
        <n-checkbox value="reading">阅读</n-checkbox>
        <n-checkbox value="traveling">旅游</n-checkbox>
        <n-checkbox value="coding">编程</n-checkbox>
      </n-checkbox-group>
    </n-form-item>

    <n-form-item>
      <n-button type="primary" @click="submitForm">提交</n-button>
      <n-button @click="resetForm" style="margin-left: 12px">重置</n-button>
    </n-form-item>
  </n-form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { type FormInst, type FormRules } from 'naive-ui'

interface FormModel {
  name: string
  email: string
  gender: string
  hobby: string[]
}

const formRef = ref<FormInst | null>(null)

const form = ref<FormModel>({
  name: '',
  email: '',
  gender: '',
  hobby: [],
})

const rules: FormRules = {
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' },
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' },
  ],
  gender: {
    required: true,
    message: '请选择性别',
    trigger: 'change',
  },
  hobby: {
    type: 'array',
    required: true,
    message: '请选择爱好',
    trigger: 'change',
  },
}

const submitForm = async () => {
  try {
    await formRef.value?.validate()
  } catch (err) {
  }
}

const resetForm = () => {
  formRef.value?.restoreValidation()
  form.value = {
    name: '',
    email: '',
    gender: '',
    hobby: [],
  }
}
</script>

<style scoped>
.n-form {
  max-width: 500px;
  margin: 20px auto;
}
</style>