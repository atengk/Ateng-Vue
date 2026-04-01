<template>
  <div class="table-col-drag">
    <h2>表格列拖拽示例</h2>

    <table class="drag-table">
      <thead>
      <tr ref="theadRow">
        <th v-for="col in columns" :key="col.key" class="drag-col">
          {{ col.label }}
        </th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="row in rows" :key="row.id">
        <td v-for="col in columns" :key="col.key">{{ (row as any)[col.key] }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDraggable } from 'vue-draggable-plus'

// 列定义
const columns = ref([
  { key: 'id', label: 'ID' },
  { key: 'name', label: '名称' },
  { key: 'age', label: '年龄' }
])

// 行数据
const rows = ref([
  { id: 1, name: 'Joao', age: 28 },
  { id: 2, name: 'Jean', age: 32 },
  { id: 3, name: 'Johanna', age: 25 },
  { id: 4, name: 'Juan', age: 30 }
])

const theadRow = ref<HTMLElement | null>(null)

// 初始化列拖拽
useDraggable(theadRow, columns, {
  animation: 200,
  draggable: 'th',
  onUpdate() {
    // 更新列顺序时同步 rows 的显示顺序
    rows.value = rows.value.map(row => {
      const newRow: Record<string, any> = {}
      columns.value.forEach(col => {
        newRow[col.key] = (row as any)[col.key]
      })
      return newRow
    }) as typeof rows.value
  }
})
</script>

<style scoped>
.drag-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 16px;
}
.drag-table th,
.drag-table td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: left;
}
.drag-col {
  background-color: #f0f4f8;
  cursor: grab;
  transition: background 0.2s;
}
.drag-col:active {
  cursor: grabbing;
  background-color: #e6f7ff;
}
</style>
