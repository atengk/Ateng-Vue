<script setup lang="ts">

import { setLocal, getLocal } from '@/utils/storage'

setLocal('token', 'xxx-token', 24 * 60 * 60 * 1000)

const token = getLocal<string>('token')


setLocal('userInfo', {
  id: 1,
  name: 'atengk'
})

const userInfo = getLocal<{ id: number; name: string }>('userInfo')

import { setSession, getSession } from '@/utils/storage'

setSession('tempData', { step: 2 })

const temp = getSession<{ step: number }>('tempData')

import { clearLocal, clearSession } from '@/utils/storage'

clearLocal()
clearSession()


</script>

<template>

</template>

<style scoped>

</style>