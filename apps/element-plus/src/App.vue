<template>
  <div class="app-root">
    <h1>System Monitor</h1>
    <!-- 表格区 -->
    <div>
      <el-table
          :data="tableData"
          stripe
          border
          highlight-current-row
          height="360"
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="Service Name" />
        <el-table-column prop="status" label="Status" width="120">
          <template #default="{ row }">
            <el-tag
                :type="row.status === 'Running' ? 'success' : 'danger'"
                effect="dark"
            >
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="cpu" label="CPU (%)" width="120" />
        <el-table-column prop="memory" label="Memory (MB)" width="140" />
        <el-table-column label="Action" width="160">
          <template #default>
            <el-button size="small" type="primary">Detail</el-button>
            <el-button size="small" type="danger">Stop</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ServiceInfo {
  id: number
  name: string
  status: 'Running' | 'Stopped'
  cpu: number
  memory: number
}

const tableData: ServiceInfo[] = [
  { id: 1, name: 'Auth Service', status: 'Running', cpu: 12, memory: 256 },
  { id: 2, name: 'Gateway', status: 'Running', cpu: 28, memory: 512 },
  { id: 3, name: 'Order Service', status: 'Stopped', cpu: 0, memory: 0 },
  { id: 4, name: 'Message Queue', status: 'Running', cpu: 35, memory: 768 },
  { id: 5, name: 'File Storage', status: 'Running', cpu: 18, memory: 384 },
]
</script>

<style scoped>
</style>
