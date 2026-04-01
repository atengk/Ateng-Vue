<script setup lang="ts">

import { decodeBase64ToObject } from '@/utils/base64'

interface User {
  id: number
  name: string
}

const user = decodeBase64ToObject<User>(response.data)

console.log(user.id)
console.log(user.name)

import { encodeBase64, decodeBase64 } from '@/utils/base64'

const encoded = encodeBase64('hello world')
const decoded = decodeBase64(encoded)

import { base64ToBlob } from '@/utils/base64'

const blob = base64ToBlob(base64Image)
const url = URL.createObjectURL(blob)

import { fileToBase64 } from '@/utils/base64'

async function handleFile(file: File) {
  const base64 = await fileToBase64(file)
  console.log(base64)
}

import { base64ToFile } from '@/utils/base64'

const file = base64ToFile(base64, 'avatar.png')



</script>

<template>

</template>

<style scoped>

</style>