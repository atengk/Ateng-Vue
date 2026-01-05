<template>
  <el-form :model="form" label-width="100px">
    <el-form-item label="所属部门" prop="deptId">
      <el-cascader
          v-model="form.deptId"
          :options="options"
          :props="{ emitPath: false }"
          clearable
      />
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const form = reactive({
  deptId: null as string | null,
})

const options = [
  {
    value: '1',
    label: '总部',
    children: [
      { value: '11', label: '研发部' },
    ],
  },
]
</script>