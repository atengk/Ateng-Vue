<script setup lang="ts">

import { isNumber } from '@/utils/is'

function setPageSize(size: unknown) {
  if (!isNumber(size)) {
    return
  }
  console.log(size + 1)
}

import { isFunction } from '@/utils/is'

function execute(callback?: unknown) {
  if (isFunction(callback)) {
    callback()
  }
}

import { isPromise } from '@/utils/is'

const result = fetch('/api/test')

if (isPromise(result)) {
  result.then(res => console.log(res))
}
import { isPlainObject } from '@/utils/is'

isPlainObject({})           // true
isPlainObject(new Date())   // false
isPlainObject([])           // false




</script>

<template>

</template>

<style scoped>

</style>