<script setup lang="ts">
import { formatFileSize } from '@/utils/file'

const size = 1024 * 1024 * 3.5

const text = formatFileSize(size)
// 3.50 MB

import { downloadBlob } from '@/utils/file'

function downloadFile(response: Blob) {
  downloadBlob(response, '报表.xlsx')
}

import { base64ToBlob, blobToFile } from '@/utils/file'

const base64 = 'iVBORw0KGgoAAAANSUhEUgAA...'

const blob = base64ToBlob(base64, 'image/png')
const file = blobToFile(blob, 'image.png')

function handleUpload(file: File) {
  console.log(file.name)
}



</script>

<template>

</template>

<style scoped>

</style>