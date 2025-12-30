<script setup lang="ts">

import { removeEmptyFields } from '@/utils/object'

const form = {
  name: '张三',
  age: null,
  remark: ''
}

const params = removeEmptyFields(form)

import { get } from '@/utils/object'

const response = {
  user: {
    profile: {
      nickname: 'atengk'
    }
  }
}

const nickname = get<string>(response, 'user.profile.nickname', '')

import { deepClone } from '@/utils/object'

const originData = {
  id: 1,
  name: '测试'
}

const editForm = deepClone(originData)

import { merge } from '@/utils/object'

const defaultConfig = {
  pageSize: 10,
  showHeader: true
}

const userConfig = {
  pageSize: 20
}

const config = merge(defaultConfig, userConfig)




</script>

<template>

</template>

<style scoped>

</style>