<template>
  <div class="page">
    <h2>SnapDOM 正确的超长列表截图</h2>

    <!-- 外层：只负责滚动（不截图） -->
    <div class="table-scroll">
      <!-- 内层：真正的截图目标 -->
      <div ref="targetRef" class="table-content">
        <div class="row header">
          <span>ID</span>
          <span>模块名称</span>
          <span>状态</span>
        </div>

        <div
            class="row"
            v-for="item in list"
            :key="item.id"
        >
          <span>{{ item.id }}</span>
          <span>{{ item.name }}</span>
          <span>{{ item.status }}</span>
        </div>
      </div>
    </div>

    <button @click="download">下载完整列表 PNG</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { snapdom } from '@zumer/snapdom'

interface Item {
  id: number
  name: string
  status: string
}

const targetRef = ref<HTMLElement | null>(null)

const list: Item[] = Array.from({ length: 50 }).map((_, i) => ({
  id: i + 1,
  name: `模块-${i + 1}`,
  status: i % 2 ? '启用' : '禁用'
}))

const download = async () => {
  if (!targetRef.value) return

  await snapdom.download(targetRef.value, {
    type: 'png',
    scale: 2,
    backgroundColor: '#ffffff',
    filename: 'module-list.png'
  })
}
</script>

<style scoped>
.page {
  padding: 20px;
}

/* 👇 只给用户看的滚动容器 */
.table-scroll {
  width: 420px;
  height: 260px;
  overflow-y: auto;
  border: 1px solid #dcdfe6;
}

/* 👇 真正用于截图的内容层 */
.table-content {
  background: #ffffff;
}

/* 表格行 */
.row {
  display: grid;
  grid-template-columns: 60px 1fr 80px;
  padding: 8px 12px;
  border-bottom: 1px solid #ebeef5;
}

.header {
  background: #f5f7fa;
  font-weight: bold;
}
</style>
