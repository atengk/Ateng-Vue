<template>
  <el-container class="page-container">
    <el-main>
      <el-button type="danger" @click="doHeavyTask">
        执行耗时操作
      </el-button>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { ElLoading } from 'element-plus'

const doHeavyTask = () => {
  const loading = ElLoading.service({
    lock: true,
    text: '处理中，请稍候...',
    background: 'rgba(0, 0, 0, 0.5)'
  })

  setTimeout(() => {
    loading.close()
  }, 2000)
}
</script>