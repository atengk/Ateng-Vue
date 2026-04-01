<script setup lang="ts">
import { isEmpty, trim } from '@/utils/string'

const form = {
  name: '  张三  ',
  remark: '   '
}

if (isEmpty(form.name)) {
  console.error('姓名不能为空')
}

const params = {
  ...form,
  name: trim(form.name),
  remark: trim(form.remark)
}

import { toCamelCase } from '@/utils/string'

const backendField = 'user_name'
const frontendField = toCamelCase(backendField)

console.log(frontendField)
// userName

import { truncate } from '@/utils/string'

const description = '这是一段非常非常长的描述内容'

const displayText = truncate(description, 10)

console.log(displayText)
// 这是一段非常非...

import { toStringSafe } from '@/utils/string'

const valueFromApi: string | null = null

const text = toStringSafe(valueFromApi)
// ''



</script>

<template>

</template>

<style scoped>

</style>