<script setup lang="ts">

import {isEmail, isMobile} from '@/utils/validate'
import {reactive} from "vue";

const form = reactive({
  email: "",
  phone: "",
})

if (!isEmail(form.email)) {
  console.error('邮箱格式不正确')
}

if (!isMobile(form.phone)) {
  console.error('手机号格式不正确')
}

import { isInRange } from '@/utils/validate'

const score = 85

if (!isInRange(score, 0, 100)) {
  console.warn('分数不合法')
}

import { isUrl } from '@/utils/validate'

const input = ""
if (isUrl(input)) {
  window.open(input)
}




</script>

<template>

</template>

<style scoped>

</style>