<template>
  <el-container class="page-container">
    <el-main>
      <h3>Table + Pagination 联动示例</h3>

      <!-- 搜索条件 -->
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="姓名">
          <el-input v-model="searchForm.name" placeholder="请输入姓名" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 表格 -->
      <el-table
          :data="tableData"
          border
          stripe
          row-key="id"
          style="margin-top: 16px;"
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
          style="margin-top: 16px; text-align: right;"
      />
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'

// 搜索表单
const searchForm = reactive({
  name: ''
})

// 表格数据
const tableData = ref([] as any[])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)

// 模拟后端分页接口
const allData = Array.from({ length: 95 }).map((_, i) => ({
  id: i + 1,
  name: `用户${i + 1}`,
  email: `user${i + 1}@example.com`
}))

const fetchTableData = () => {
  // 模拟搜索过滤
  let filtered = allData.filter(item => item.name.includes(searchForm.name))
  total.value = filtered.length

  // 分页数据
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  tableData.value = filtered.slice(start, end)
}

// 页码/页大小改变
const handleCurrentChange = (page: number) => {
  currentPage.value = page
  fetchTableData()
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
  fetchTableData()
}

// 搜索
const search = () => {
  currentPage.value = 1
  fetchTableData()
}

// 重置
const reset = () => {
  searchForm.name = ''
  currentPage.value = 1
  fetchTableData()
}

// 初始化
fetchTableData()
</script>

<style scoped>
.page-container {
  padding: 16px;
}
.search-form {
  margin-bottom: 16px;
}
</style>