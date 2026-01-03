<template>
  <el-container class="page-container">
    <el-main>
      <h3>Checkbox 多选示例</h3>

      <el-form :model="form" label-width="100px">
        <!-- 普通多选 -->
        <el-form-item label="爱好">
          <el-checkbox-group v-model="form.hobbies">
            <el-checkbox label="足球">足球</el-checkbox>
            <el-checkbox label="篮球">篮球</el-checkbox>
            <el-checkbox label="羽毛球">羽毛球</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <!-- 全选 / 反选 -->
        <el-form-item label="权限">
          <el-checkbox
              :indeterminate="isIndeterminate"
              v-model="checkAll"
              @change="handleCheckAllChange"
          >
            全选
          </el-checkbox>
          <el-checkbox-group v-model="form.permissions" @change="handleCheckedChange">
            <el-checkbox label="新增">新增</el-checkbox>
            <el-checkbox label="编辑">编辑</el-checkbox>
            <el-checkbox label="删除">删除</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

const form = reactive({
  hobbies: [] as string[],
  permissions: [] as string[]
})

/** 全选控制 */
const checkAll = ref(false)
const isIndeterminate = ref(false)

/** 全选逻辑 */
const handleCheckAllChange = (val: boolean) => {
  form.permissions = val ? ['新增', '编辑', '删除'] : []
  isIndeterminate.value = false
}

/** 单个选项变化 */
const handleCheckedChange = (val: string[]) => {
  const allLen = 3
  const checkedLen = val.length
  checkAll.value = checkedLen === allLen
  isIndeterminate.value = checkedLen > 0 && checkedLen < allLen
}
</script>

<style scoped>
.page-container {
  padding: 16px;
}

.el-checkbox-group {
  display: flex;
  gap: 16px;
  margin-top: 8px;
}
</style>