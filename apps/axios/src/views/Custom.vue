<script setup lang="ts">
import {ref} from 'vue'
import {downloadFileForRustFS, getForExt} from "@/api";

const data = ref<any>(null)

const loadData = async () => {
  const res = await getForExt()
  data.value = res.data
}

const download = async () => {
  const res = await downloadFileForRustFS()

  const url = window.URL.createObjectURL(res.data)
  const link = document.createElement('a')
  link.href = url
  link.download = 'download_file'
  link.click()
  window.URL.revokeObjectURL(url)
}

</script>

<template>
  <div class="actions">
    <button @click="loadData">查询</button>
    <button @click="download">下载</button>
  </div>

  <pre>{{ data }}</pre>
</template>

<style scoped>
.actions {
  display: flex;
  gap: 8px;
}
</style>
