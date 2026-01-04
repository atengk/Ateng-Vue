<template>
  <el-container class="page-container">
    <el-main>
      <h3>Table + Pagination 联动示例</h3>

      <div v-if="getAllSelectedRows.length > 0" class="selected-tip">
        已选中 {{ getAllSelectedRows.length }} 条数据
        <el-button
            link
            type="danger"
            @click="clearSelection"
            style="margin-left: 8px"
        >
          清除
        </el-button>
      </div>

      <!-- 查询条件 -->
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="姓名">
          <el-input v-model="searchForm.name" placeholder="请输入姓名" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 数据表格 -->
      <el-table
          ref="tableRef"
          :data="tableData"
          row-key="id"
          border
          stripe
          @selection-change="handleSelectionChange"
          style="margin-top: 16px"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="email" label="邮箱" />
      </el-table>

      <!-- 分页 -->
      <el-pagination
          v-model:current-page="currentPage"
          :page-size="pageSize"
          :total="total"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          layout="prev, pager, next, sizes, ->, total"
          :page-sizes="[10, 20, 50]"
          style="margin-top: 16px; text-align: right"
      />
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { computed, nextTick, reactive, ref } from 'vue'
import type { ElTable } from 'element-plus'

/** 查询表单 */
const searchForm = reactive({ name: '' })

/** 表格与分页状态 */
const tableData = ref<any[]>([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)

const tableRef = ref<InstanceType<typeof ElTable>>()

/** 模拟后端数据 */
const allData = Array.from({ length: 95 }).map((_, i) => ({
  id: i + 1,
  name: `用户${i + 1}`,
  email: `user${i + 1}@example.com`
}))

/** 跨页选中数据（key 为 row-key） */
const selectedRowMap = ref<Map<number, any>>(new Map())

/** 标识当前是否处于选中恢复阶段 */
const isRestoringSelection = ref(false)

/** 加载分页数据并回显选中状态 */
const fetchTableData = async () => {
  isRestoringSelection.value = true

  const filtered = allData.filter(item =>
      item.name.includes(searchForm.name)
  )
  total.value = filtered.length

  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  tableData.value = filtered.slice(start, end)

  await nextTick()
  restoreSelection()
  isRestoringSelection.value = false
}

/** 根据全局选中数据回显当前页 */
const restoreSelection = () => {
  if (!tableRef.value) return

  tableRef.value.clearSelection()
  tableData.value.forEach(row => {
    if (selectedRowMap.value.has(row.id)) {
      tableRef.value!.toggleRowSelection(row, true)
    }
  })
}

/** 处理用户勾选变化 */
const handleSelectionChange = (selection: any[]) => {
  if (isRestoringSelection.value) return

  const currentPageIds = tableData.value.map(row => row.id)

  currentPageIds.forEach(id => {
    if (!selection.some(row => row.id === id)) {
      selectedRowMap.value.delete(id)
    }
  })

  selection.forEach(row => {
    selectedRowMap.value.set(row.id, row)
  })
}

/** 清空全部已选数据 */
const clearSelection = () => {
  selectedRowMap.value.clear()
  tableRef.value?.clearSelection()
}

/** 已选数据列表 */
const getAllSelectedRows = computed(() =>
    Array.from(selectedRowMap.value.values())
)

/** 分页与查询 */
const handleCurrentChange = (page: number) => {
  currentPage.value = page
  fetchTableData()
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
  fetchTableData()
}

const search = () => {
  currentPage.value = 1
  fetchTableData()
}

const reset = () => {
  searchForm.name = ''
  currentPage.value = 1
  fetchTableData()
}

fetchTableData()
</script>

<style scoped>
.page-container {
  padding: 16px;
}
.search-form {
  margin-bottom: 16px;
}
.selected-tip {
  margin: 12px 0;
}
</style>
