# 组件封装



## 按钮封装

特点与企业级规范：

1. 完整支持 ElementPlus 所有常用按钮属性。
2. 避免 loading 或 disabled 状态下重复点击，防止业务异常。
3. 支持 slot 自定义文本，支持 icon 前置/圆形图标。
4. 类型和事件声明完整，符合 TypeScript 企业级规范。
5. 样式可扩展，通过 SCSS 全局覆盖或 scoped 自定义。

支持：

- `loading`（加载中状态）
- `disabled`（禁用状态）
- `icon`（前置/后置图标）
- `size`（按钮尺寸：`medium | small | mini`）
- `type`（按钮类型：`primary | success | warning | danger | info | text`）
- 支持自定义事件 `click`

------

**组件封装：BaseButton.vue**

```vue
<template>
  <el-button
    :type="type"                     <!-- ElementPlus 按钮类型 -->
    :size="size"                     <!-- 按钮尺寸 -->
    :loading="loading"               <!-- 是否显示加载动画 -->
    :disabled="disabled || loading"  <!-- 禁用状态，同时避免 loading 状态点击 -->
    :icon="icon"                     <!-- 前置图标 -->
    :plain="plain"                   <!-- 是否朴素按钮 -->
    :round="round"                   <!-- 是否圆角按钮 -->
    :circle="circle"                 <!-- 是否圆形按钮 -->
    @click="handleClick"
  >
    <slot />                         <!-- 按钮文本通过 slot 传入 -->
  </el-button>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue'

interface Props {
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'text'
  size?: 'medium' | 'small' | 'mini'
  loading?: boolean
  disabled?: boolean
  icon?: string
  plain?: boolean
  round?: boolean
  circle?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

/**
 * 点击事件封装
 * 避免在 loading 状态下重复触发
 */
function handleClick(event: MouseEvent) {
  if (!props.loading && !props.disabled) {
    emit('click', event)
  }
}
</script>

<style lang="scss" scoped>
/* 可扩展自定义按钮样式 */
</style>
```

------

**页面使用示例：DemoPage.vue**

```vue
<template>
  <div class="demo-buttons">
    <!-- 普通按钮 -->
    <BaseButton @click="handleClick">默认按钮</BaseButton>

    <!-- 主色按钮 -->
    <BaseButton type="primary" @click="handleClick">主色按钮</BaseButton>

    <!-- 带图标按钮 -->
    <BaseButton type="success" icon="Check" @click="handleClick">
      成功按钮
    </BaseButton>

    <!-- 加载中按钮 -->
    <BaseButton type="warning" :loading="loading" @click="startLoading">
      加载中按钮
    </BaseButton>

    <!-- 禁用按钮 -->
    <BaseButton type="danger" :disabled="true">禁用按钮</BaseButton>

    <!-- 小尺寸圆角按钮 -->
    <BaseButton type="info" size="small" round>小圆角按钮</BaseButton>

    <!-- 圆形按钮 -->
    <BaseButton type="primary" circle icon="el-icon-search" @click="handleClick" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import BaseButton from '@/components/BaseButton.vue'

const loading = ref(false)

function handleClick() {
  console.log('按钮点击事件触发')
}

/**
 * 模拟异步操作，触发 loading 状态
 */
function startLoading() {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    console.log('异步操作完成')
  }, 2000)
}
</script>

<style lang="scss" scoped>
.demo-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
</style>
```

------

## 输入框封装（有问题，封装了表单重置不生效）

✅ **企业级封装特点：**

1. 完整支持 ElementPlus 表单验证体系。
2. 双向绑定 `v-model`，兼容 Vue3 + TS。
3. 支持前置/后置图标、TextArea、清除按钮。
4. 可自定义错误提示或使用 Form 校验规则。
5. 易于在大型项目中复用，表单项统一样式和逻辑。

功能包括：

- 普通 Input / Textarea
- 前置/后置图标
- 表单校验（必填、正则、自定义校验）
- 自定义提示信息
- 支持 `v-model` 双向绑定

------

**组件封装：BaseInput.vue**

```vue
<template>
  <el-form-item
    :label="label"              <!-- 表单项标题 -->
    :prop="prop"                <!-- 用于 Form 校验规则 -->
    :rules="rules"              <!-- 校验规则数组 -->
  >
  <el-input
      v-model="inputValue"
      :type="type"              <!-- 输入类型 text/password/textarea 等 -->
      :placeholder="placeholder"
      :rows="rows"              <!-- textarea行数 -->
  :prefix-icon="prefixIcon"
  :suffix-icon="suffixIcon"
  :disabled="disabled"
  :clearable="clearable"
  @change="$emit('change', $event)"
  @focus="$emit('focus', $event)"
  @blur="$emit('blur', $event)"
  >
  </el-input>
  <!-- 自定义提示 -->
  <template #error>
    <span v-if="errorMessage" class="input-error">{{ errorMessage }}</span>
  </template>
  </el-form-item>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { FormItemRule } from 'element-plus'

/**
 * 组件 Props
 */
interface Props {
  modelValue: string | number
  label?: string
  prop?: string                // 用于 Form 校验
  placeholder?: string
  type?: 'text' | 'password' | 'textarea' | 'number'
  rows?: number                // textarea 行数
  prefixIcon?: string
  suffixIcon?: string
  disabled?: boolean
  clearable?: boolean
  rules?: FormItemRule[]       // element-plus 表单规则
  errorMessage?: string        // 自定义错误信息
}

const props = defineProps<Props>()

/**
 * 组件事件
 */
const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
  (e: 'change', value: string | number): void
  (e: 'focus', event: FocusEvent): void
  (e: 'blur', event: FocusEvent): void
}>()

/**
 * 双向绑定
 */
const inputValue = computed({
  get: () => props.modelValue,
  set: (val: string | number) => {
    emit('update:modelValue', val)
  }
})
</script>

<style lang="scss" scoped>
.input-error {
  color: #f56c6c;
  font-size: 12px;
}
</style>
```

------

**页面使用示例：DemoInputPage.vue**

```vue
<template>
  <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
  >
    <!-- 普通输入 -->
    <BaseInput
        v-model="formData.username"
        label="用户名"
        placeholder="请输入用户名"
        :rules="[ { required: true, message: '用户名不能为空', trigger: 'blur' } ]"
    />

    <!-- 密码输入 -->
    <BaseInput
        v-model="formData.password"
        label="密码"
        type="password"
        placeholder="请输入密码"
        :rules="[ { required: true, message: '密码不能为空', trigger: 'blur' } ]"
        suffix-icon="View"
    />

    <!-- 带前置图标输入 -->
    <BaseInput
        v-model="formData.email"
        label="邮箱"
        placeholder="请输入邮箱"
        prefix-icon="Message"
        :rules="[ { type: 'email', message: '邮箱格式不正确', trigger: 'blur' } ]"
    />

    <!-- 多行文本 -->
    <BaseInput
        v-model="formData.description"
        label="描述"
        type="textarea"
        :rows="3"
        placeholder="请输入描述"
    />

    <el-form-item>
      <el-button type="primary" @click="submitForm">提交</el-button>
      <el-button @click="resetForm">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import BaseInput from '@/components/BaseInput.vue'
import type { FormInstance } from 'element-plus'

const formRef = ref<FormInstance>()
const formData = ref({
  username: '',
  password: '',
  email: '',
  description: ''
})

const formRules = {
  username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
  password: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
  email: [{ type: 'email', message: '邮箱格式不正确', trigger: 'blur' }]
}

/**
 * 提交表单
 */
function submitForm() {
  formRef.value?.validate((valid) => {
    if (valid) {
      console.log('表单校验通过', formData.value)
    } else {
      console.log('表单校验失败')
    }
  })
}

/**
 * 重置表单
 */
function resetForm() {
  formRef.value?.resetFields()
}
</script>

<style lang="scss" scoped>
.el-form-item {
  margin-bottom: 16px;
}
</style>
```

------



## 弹窗封装

✅ **企业级封装特点：**

1. 完整支持 ElementPlus Dialog 属性，支持 destroyOnClose、宽度、点击遮罩关闭等。
2. 支持弹窗内容通过 slot 注入，自由嵌入表单或其他组件。
3. 支持 `v-model:modelValue` 双向控制显示。
4. 支持确定按钮 loading，防止重复提交。
5. 提供 cancel、confirm、close 三个事件，方便业务处理。
6. TS 类型完整，易于大型企业项目复用。

功能包括：

- 通用 Dialog 封装
- 可自定义标题
- 支持表单嵌入 slot
- 支持确认 / 取消事件
- 支持 `v-model:visible` 双向控制弹窗显示
- 支持确定按钮 loading 状态

------

**组件封装：BaseDialog.vue**

```vue
<template>
  <el-dialog
    :model-value="visible"             <!-- 弹窗显示控制 -->
    :title="title"                     <!-- 弹窗标题 -->
    :width="width"                     <!-- 弹窗宽度 -->
    :destroy-on-close="destroyOnClose" <!-- 关闭时销毁内容 -->
    :close-on-click-modal="closeOnClickModal"
    :before-close="handleBeforeClose"
    @close="onClose"
  >
    <!-- 弹窗内容插槽 -->
    <slot name="body" />

    <!-- 弹窗底部操作按钮 -->
    <template #footer>
      <el-button @click="handleCancel" :disabled="confirmLoading">取消</el-button>
      <el-button
        type="primary"
        :loading="confirmLoading"
        @click="handleConfirm"
      >
        确定
      </el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, ref } from 'vue'

interface Props {
  modelValue: boolean
  title?: string
  width?: string
  destroyOnClose?: boolean
  closeOnClickModal?: boolean
  confirmLoading?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm'): void
  (e: 'cancel'): void
  (e: 'close'): void
}>()

const visible = ref(props.modelValue)

/**
 * 同步外部 v-model
 */
watch(
  () => props.modelValue,
  (val) => {
    visible.value = val
  }
)

/**
 * 关闭前回调（ElementPlus 支持）
 */
function handleBeforeClose(done: () => void) {
  handleCancel()
  done()
}

/**
 * 点击取消
 */
function handleCancel() {
  emit('cancel')
  emit('update:modelValue', false)
}

/**
 * 点击确定
 */
function handleConfirm() {
  emit('confirm')
}

/**
 * 弹窗关闭事件
 */
function onClose() {
  emit('close')
}
</script>

<style lang="scss" scoped>
/* 可扩展自定义弹窗样式 */
</style>
```

------

**页面使用示例：DemoDialogPage.vue**

```vue
<template>
  <div class="demo-dialog">
    <el-button type="primary" @click="showDialog = true">打开弹窗</el-button>

    <!-- 弹窗封装组件 -->
    <BaseDialog
      v-model:modelValue="showDialog"
      title="编辑用户"
      :width="'500px'"
      :confirmLoading="loading"
      @confirm="submitForm"
      @cancel="handleCancel"
    >
      <!-- 弹窗内容插槽 -->
      <template #body>
        <el-form ref="formRef" :model="formData" label-width="100px">
          <BaseInput
            v-model="formData.username"
            label="用户名"
            placeholder="请输入用户名"
            :rules="[ { required: true, message: '用户名不能为空', trigger: 'blur' } ]"
          />
          <BaseInput
            v-model="formData.email"
            label="邮箱"
            placeholder="请输入邮箱"
            prefix-icon="Message"
            :rules="[ { type: 'email', message: '邮箱格式不正确', trigger: 'blur' } ]"
          />
        </el-form>
      </template>
    </BaseDialog>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import BaseDialog from '@/components/BaseDialog.vue'
import BaseInput from '@/components/BaseInput.vue'
import type { FormInstance } from 'element-plus'

const showDialog = ref(false)
const loading = ref(false)
const formRef = ref<FormInstance>()
const formData = ref({
  username: '',
  email: ''
})

/**
 * 弹窗确认事件
 */
function submitForm() {
  formRef.value?.validate((valid) => {
    if (valid) {
      loading.value = true
      setTimeout(() => {
        loading.value = false
        showDialog.value = false
        console.log('表单提交成功', formData.value)
      }, 1500)
    } else {
      console.log('表单校验失败')
    }
  })
}

/**
 * 弹窗取消事件
 */
function handleCancel() {
  console.log('弹窗已取消')
}
</script>

<style lang="scss" scoped>
.demo-dialog {
  .el-button {
    margin-bottom: 16px;
  }
}
</style>
```

------

## 表单封装 （从这里开始后面的都没验证了）

功能点如下：

- 动态表单项，可新增/删除行
- 支持表单校验（必填、正则、自定义）
- 支持 `v-model` 双向绑定整个表单数组
- 可自定义每行表单内容，通过 slot 插入
- 支持表单项序号显示

------

**组件封装：DynamicForm.vue**

```vue
<template>
  <div class="dynamic-form">
    <el-form
      :model="internalData"
      :rules="rules"
      ref="formRef"
      label-width="100px"
    >
      <div v-for="(item, index) in internalData" :key="item.id" class="form-row">
        <div class="row-index">{{ index + 1 }}</div>

        <!-- 每行表单内容插槽 -->
        <slot
          name="row"
          :item="item"
          :index="index"
          :update-item="updateItem"
        >
          <!-- 默认表单项示例 -->
          <el-form-item
            :prop="`${index}.name`"
            label="名称"
          >
            <el-input v-model="item.name" placeholder="请输入名称" />
          </el-form-item>
        </slot>

        <!-- 行操作 -->
        <div class="row-actions">
          <el-button type="danger" size="mini" @click="removeRow(index)">删除</el-button>
        </div>
      </div>

      <!-- 新增按钮 -->
      <el-form-item>
        <el-button type="primary" size="mini" @click="addRow">新增行</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, ref, reactive, watch } from 'vue'
import type { FormInstance } from 'element-plus'

interface ItemType {
  id: string
  [key: string]: any
}

interface Props {
  modelValue: ItemType[]
  rules?: Record<string, any>
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: ItemType[]): void
}>()

const formRef = ref<FormInstance>()
const internalData = reactive<ItemType[]>([])

/**
 * 初始化 internalData
 */
watch(
  () => props.modelValue,
  (val) => {
    internalData.splice(0, internalData.length, ...(val || []))
  },
  { immediate: true }
)

/**
 * 新增行
 */
function addRow() {
  const newItem: ItemType = { id: `${Date.now()}-${Math.random()}` }
  internalData.push(newItem)
  emit('update:modelValue', internalData)
}

/**
 * 删除行
 */
function removeRow(index: number) {
  internalData.splice(index, 1)
  emit('update:modelValue', internalData)
}

/**
 * 更新行数据（用于 slot 回调）
 */
function updateItem(index: number, newData: Partial<ItemType>) {
  internalData[index] = { ...internalData[index], ...newData }
  emit('update:modelValue', internalData)
}

/**
 * 校验表单
 */
function validate(callback: (valid: boolean) => void) {
  formRef.value?.validate(callback)
}

export { formRef, validate }
</script>

<style lang="scss" scoped>
.dynamic-form {
  .form-row {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 12px;

    .row-index {
      width: 24px;
      text-align: center;
      line-height: 32px;
    }

    .row-actions {
      display: flex;
      align-items: center;
      margin-top: 4px;
    }
  }
}
</style>
```

------

**页面使用示例：DemoDynamicFormPage.vue**

```vue
<template>
  <div class="demo-dynamic-form">
    <DynamicForm
      v-model="formData"
      :rules="formRules"
      ref="dynamicFormRef"
    >
      <template #row="{ item, index, updateItem }">
        <el-form-item
          :prop="`${index}.name`"
          label="名称"
        >
          <el-input
            v-model="item.name"
            placeholder="请输入名称"
            @input="val => updateItem(index, { name: val })"
          />
        </el-form-item>

        <el-form-item
          :prop="`${index}.email`"
          label="邮箱"
        >
          <el-input
            v-model="item.email"
            placeholder="请输入邮箱"
            @input="val => updateItem(index, { email: val })"
          />
        </el-form-item>
      </template>
    </DynamicForm>

    <el-button type="primary" @click="submitForm">提交表单</el-button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import DynamicForm from '@/components/DynamicForm.vue'
import type { FormInstance } from 'element-plus'

const dynamicFormRef = ref<FormInstance>()
const formData = ref([{ id: '1', name: '', email: '' }])

const formRules = {
  '0.name': [{ required: true, message: '名称不能为空', trigger: 'blur' }],
  '0.email': [{ type: 'email', message: '邮箱格式不正确', trigger: 'blur' }]
}

/**
 * 提交表单
 */
function submitForm() {
  dynamicFormRef.value?.validate((valid) => {
    if (valid) {
      console.log('动态表单数据:', formData.value)
    } else {
      console.log('动态表单校验失败')
    }
  })
}
</script>

<style lang="scss" scoped>
.demo-dynamic-form {
  .el-button {
    margin-top: 16px;
  }
}
</style>
```

------

✅ **企业级封装特点：**

1. 支持动态行增删，适合复杂表单场景（如联系人列表、商品规格等）。
2. 支持表单校验和 ElementPlus Form 规则结合使用。
3. 支持通过 slot 自定义每行表单项，灵活性高。
4. 使用 TS + reactive + v-model 完整双向绑定，类型安全。
5. 易于在大型项目中复用，结构清晰、操作统一。

------



## 表格封装

功能点如下：

- 动态列配置，可自定义列标题、字段、宽度
- 支持多表头（表头合并）
- 支持排序、筛选
- 支持分页
- 支持行操作按钮（编辑/删除等）
- 支持 `v-model:data` 双向绑定表格数据

------

**组件封装：BaseTable.vue**

```vue
<template>
  <div class="base-table">
    <el-table
      :data="data"
      border
      stripe
      style="width: 100%"
      @sort-change="handleSortChange"
      @filter-change="handleFilterChange"
    >
      <!-- 动态列渲染 -->
      <template v-for="col in columns">
        <el-table-column
          v-if="!col.children"
          :key="col.prop"
          :prop="col.prop"
          :label="col.label"
          :width="col.width"
          :sortable="col.sortable"
          :filters="col.filters"
          :filter-method="col.filterMethod"
        />
        <!-- 支持多表头（children） -->
        <el-table-column
          v-else
          :key="col.label"
          :label="col.label"
        >
          <el-table-column
            v-for="child in col.children"
            :key="child.prop"
            :prop="child.prop"
            :label="child.label"
            :width="child.width"
            :sortable="child.sortable"
            :filters="child.filters"
            :filter-method="child.filterMethod"
          />
        </el-table-column>
      </template>

      <!-- 行操作按钮插槽 -->
      <el-table-column label="操作" fixed="right" width="150">
        <template #default="{ row, $index }">
          <slot name="actions" :row="row" :index="$index">
            <!-- 默认操作 -->
            <el-button type="primary" size="mini" @click="editRow(row)">编辑</el-button>
            <el-button type="danger" size="mini" @click="deleteRow(row)">删除</el-button>
          </slot>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      v-if="pagination"
      class="mt-2"
      background
      layout="total, prev, pager, next, jumper"
      :page-size="pagination.pageSize"
      :current-page="pagination.currentPage"
      :total="pagination.total"
      @current-change="handlePageChange"
    />
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue'

interface ColumnType {
  label: string
  prop?: string
  width?: string | number
  sortable?: boolean
  filters?: { text: string; value: any }[]
  filterMethod?: (value: any, row: any, column: any) => boolean
  children?: ColumnType[]
}

interface PaginationType {
  currentPage: number
  pageSize: number
  total: number
}

interface Props {
  data: any[]
  columns: ColumnType[]
  pagination?: PaginationType
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'edit', row: any): void
  (e: 'delete', row: any): void
  (e: 'page-change', page: number): void
  (e: 'sort-change', sort: any): void
  (e: 'filter-change', filter: any): void
}>()

/**
 * 默认编辑行
 */
function editRow(row: any) {
  emit('edit', row)
}

/**
 * 默认删除行
 */
function deleteRow(row: any) {
  emit('delete', row)
}

/**
 * 分页变化
 */
function handlePageChange(page: number) {
  emit('page-change', page)
}

/**
 * 排序变化
 */
function handleSortChange(sort: any) {
  emit('sort-change', sort)
}

/**
 * 过滤变化
 */
function handleFilterChange(filter: any) {
  emit('filter-change', filter)
}
</script>

<style lang="scss" scoped>
.base-table {
  .mt-2 {
    margin-top: 12px;
  }
}
</style>
```

------

**页面使用示例：DemoTablePage.vue**

```vue
<template>
  <div class="demo-table">
    <BaseTable
      :data="tableData"
      :columns="tableColumns"
      :pagination="pagination"
      @edit="handleEdit"
      @delete="handleDelete"
      @page-change="handlePageChange"
      @sort-change="handleSortChange"
      @filter-change="handleFilterChange"
    >
      <template #actions="{ row }">
        <el-button type="primary" size="mini" @click="handleEdit(row)">编辑</el-button>
        <el-button type="danger" size="mini" @click="handleDelete(row)">删除</el-button>
      </template>
    </BaseTable>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import BaseTable from '@/components/BaseTable.vue'

const tableData = ref([
  { id: 1, name: '张三', age: 28, gender: '男' },
  { id: 2, name: '李四', age: 22, gender: '女' },
  { id: 3, name: '王五', age: 35, gender: '男' }
])

const tableColumns = ref([
  { label: 'ID', prop: 'id', width: 80 },
  { label: '姓名', prop: 'name', width: 120, sortable: true },
  { label: '年龄', prop: 'age', width: 100, sortable: true },
  {
    label: '性别信息',
    children: [
      { label: '性别', prop: 'gender', width: 100 },
      { label: '备注', prop: 'remark', width: 150 }
    ]
  }
])

const pagination = ref({
  currentPage: 1,
  pageSize: 10,
  total: 50
})

function handleEdit(row: any) {
  console.log('编辑行:', row)
}

function handleDelete(row: any) {
  console.log('删除行:', row)
}

function handlePageChange(page: number) {
  console.log('分页切换到第', page, '页')
}

function handleSortChange(sort: any) {
  console.log('排序变化:', sort)
}

function handleFilterChange(filter: any) {
  console.log('过滤变化:', filter)
}
</script>

<style lang="scss" scoped>
.demo-table {
  padding: 12px;
}
</style>
```

------

✅ **企业级封装特点：**

1. 完整支持动态列配置和多表头（children）
2. 支持排序、过滤事件回调
3. 支持分页，统一样式
4. 支持行操作按钮自定义插槽
5. TS 类型完整，易于在大型项目中复用
6. 适用于后台管理系统、数据统计、企业报表等场景

------

## 分页封装

功能点如下：

- 封装 ElementPlus Pagination
- 统一样式（背景色、间距、尺寸等）
- 支持当前页码、每页条数、总条数配置
- 支持 `page-change` 事件回调
- 支持跳转页码输入（jumper）
- 支持 `page-size-change` 事件（可选，每页条数变化）

------

**组件封装：BasePagination.vue**

```vue
<template>
  <div class="base-pagination">
    <el-pagination
      background
      layout="total, sizes, prev, pager, next, jumper"
      :current-page="currentPage"
      :page-size="pageSize"
      :total="total"
      :page-sizes="pageSizes"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, ref, watch } from 'vue'

interface Props {
  currentPage?: number
  pageSize?: number
  total?: number
  pageSizes?: number[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:currentPage', page: number): void
  (e: 'update:pageSize', size: number): void
  (e: 'page-change', page: number): void
  (e: 'size-change', size: number): void
}>()

const currentPage = ref(props.currentPage || 1)
const pageSize = ref(props.pageSize || 10)
const total = ref(props.total || 0)
const pageSizes = ref(props.pageSizes || [10, 20, 50, 100])

/**
 * 监听外部 props 变化
 */
watch(
  () => props.currentPage,
  (val) => {
    if (val !== undefined) currentPage.value = val
  }
)

watch(
  () => props.pageSize,
  (val) => {
    if (val !== undefined) pageSize.value = val
  }
)

watch(
  () => props.total,
  (val) => {
    if (val !== undefined) total.value = val
  }
)

/**
 * 当前页变化
 */
function handleCurrentChange(page: number) {
  currentPage.value = page
  emit('update:currentPage', page)
  emit('page-change', page)
}

/**
 * 每页条数变化
 */
function handleSizeChange(size: number) {
  pageSize.value = size
  emit('update:pageSize', size)
  emit('size-change', size)
}
</script>

<style lang="scss" scoped>
.base-pagination {
  display: flex;
  justify-content: flex-end;
  padding: 12px 0;

  .el-pagination {
    font-size: 14px;
  }
}
</style>
```

------

**页面使用示例：DemoPaginationPage.vue**

```vue
<template>
  <div class="demo-pagination">
    <BasePagination
      v-model:currentPage="pagination.currentPage"
      v-model:pageSize="pagination.pageSize"
      :total="pagination.total"
      @page-change="handlePageChange"
      @size-change="handleSizeChange"
    />

    <p>当前页: {{ pagination.currentPage }}</p>
    <p>每页条数: {{ pagination.pageSize }}</p>
    <p>总条数: {{ pagination.total }}</p>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import BasePagination from '@/components/BasePagination.vue'

const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 123
})

function handlePageChange(page: number) {
  console.log('切换到第', page, '页')
  pagination.currentPage = page
}

function handleSizeChange(size: number) {
  console.log('每页条数修改为', size)
  pagination.pageSize = size
}
</script>

<style lang="scss" scoped>
.demo-pagination {
  padding: 12px;
}
</style>
```

------

✅ **企业级封装特点：**

1. 完全封装 ElementPlus Pagination，统一布局和样式
2. 支持跳转页码输入、每页条数选择
3. TS 类型安全，支持 v-model 双向绑定
4. 提供 page-change 和 size-change 事件回调，方便业务逻辑处理
5. 易于在企业后台系统列表页中复用

------

## 下拉选择封装

功能点如下：

- 支持单选 / 多选
- 支持远程搜索（输入关键字请求数据）
- 支持动态加载选项（prop 数据驱动）
- 支持 placeholder、自定义清空按钮
- 支持 `v-model` 双向绑定值
- 支持事件回调：`change`、`search`

------

**组件封装：BaseSelect.vue**

```vue
<template>
  <el-select
    v-model="modelValue"
    :multiple="multiple"
    :placeholder="placeholder"
    :filterable="remote"
    :clearable="clearable"
    :loading="loading"
    @change="handleChange"
    @visible-change="handleVisibleChange"
    @clear="handleClear"
    @input="handleInput"
    style="width: 100%;"
  >
    <el-option
      v-for="option in optionsData"
      :key="option.value"
      :label="option.label"
      :value="option.value"
    />
  </el-select>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, ref, watch } from 'vue'

interface OptionType {
  label: string
  value: string | number
}

interface Props {
  modelValue: string | number | (string | number)[]
  options?: OptionType[]
  placeholder?: string
  multiple?: boolean
  remote?: boolean
  loading?: boolean
  clearable?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void
  (e: 'change', value: any): void
  (e: 'search', keyword: string): void
  (e: 'clear'): void
}>()

const modelValue = ref(props.modelValue)
const optionsData = ref<OptionType[]>(props.options || [])
const loading = ref(props.loading || false)

/**
 * 监听外部 modelValue 变化
 */
watch(
  () => props.modelValue,
  (val) => {
    modelValue.value = val
  }
)

/**
 * 监听外部 options 更新
 */
watch(
  () => props.options,
  (val) => {
    optionsData.value = val || []
  }
)

/**
 * 值变化
 */
function handleChange(value: any) {
  emit('update:modelValue', value)
  emit('change', value)
}

/**
 * 下拉框输入搜索关键字（远程搜索）
 */
function handleInput(keyword: string) {
  if (props.remote) {
    emit('search', keyword)
  }
}

/**
 * 可见性变化，用于懒加载
 */
function handleVisibleChange(visible: boolean) {
  // 可在 visible 为 true 时触发远程加载
}

/**
 * 清空
 */
function handleClear() {
  emit('clear')
}
</script>

<style lang="scss" scoped>
/* 可扩展自定义样式 */
</style>
```

------

**页面使用示例：DemoSelectPage.vue**

```vue
<template>
  <div class="demo-select">
    <!-- 普通单选 -->
    <BaseSelect
      v-model="selected"
      :options="options"
      placeholder="请选择"
      @change="handleChange"
    />

    <!-- 多选 -->
    <BaseSelect
      v-model="multiSelected"
      :options="options"
      placeholder="请选择多个"
      :multiple="true"
      @change="handleMultiChange"
    />

    <!-- 远程搜索 -->
    <BaseSelect
      v-model="remoteSelected"
      placeholder="输入搜索"
      :remote="true"
      :loading="loading"
      :options="remoteOptions"
      @search="handleSearch"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import BaseSelect from '@/components/BaseSelect.vue'

const options = ref([
  { label: '选项A', value: 'A' },
  { label: '选项B', value: 'B' },
  { label: '选项C', value: 'C' }
])

const selected = ref('')
const multiSelected = ref<string[]>([])

/** 远程搜索相关 */
const remoteSelected = ref('')
const remoteOptions = ref<{ label: string; value: string }[]>([])
const loading = ref(false)

/**
 * 远程搜索处理函数
 */
function handleSearch(keyword: string) {
  loading.value = true
  setTimeout(() => {
    remoteOptions.value = [
      { label: `${keyword} 1`, value: `${keyword}-1` },
      { label: `${keyword} 2`, value: `${keyword}-2` }
    ]
    loading.value = false
  }, 1000)
}

/** 单选/多选变化事件 */
function handleChange(value: any) {
  console.log('单选选中:', value)
}
function handleMultiChange(value: any) {
  console.log('多选选中:', value)
}
</script>

<style lang="scss" scoped>
.demo-select {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 300px;
}
</style>
```

------

✅ **企业级封装特点：**

1. 支持单选、多选和远程搜索，满足复杂业务需求
2. 支持动态 options，输入关键字触发远程加载
3. TS 类型完整，事件声明明确，易于大型项目复用
4. 统一样式和交互，兼容 ElementPlus 2.13.0
5. 支持清空、placeholder、loading 等常用属性

------

## 文件上传封装

功能点如下：

- 支持单文件 / 多文件上传
- 支持图片预览
- 支持文件类型、大小限制
- 支持上传状态（loading、成功、失败）
- 支持 `v-model` 双向绑定上传文件列表
- 支持事件回调：`success`、`error`、`remove`
- 支持 ElementPlus Upload 属性扩展

------

**组件封装：BaseUpload.vue**

```vue
<template>
  <el-upload
    class="base-upload"
    action=""                             <!-- 后端上传 URL，可通过 prop 或 slot 自定义 -->
    :file-list="fileList"
    :multiple="multiple"
    :limit="limit"
    :accept="accept"
    :on-preview="handlePreview"
    :on-remove="handleRemove"
    :on-success="handleSuccess"
    :on-error="handleError"
    :auto-upload="autoUpload"
    :before-upload="beforeUpload"
    list-type="picture-card"
  >
    <template #default>
      <el-button size="small" type="primary">上传文件</el-button>
    </template>
  </el-upload>

  <!-- 图片预览 -->
  <el-dialog :visible.sync="previewVisible" width="50%">
    <img width="100%" :src="previewImage" alt="预览" />
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, defineProps, defineEmits, watch } from 'vue'
import type { UploadFile } from 'element-plus'

interface Props {
  modelValue: UploadFile[]
  multiple?: boolean
  limit?: number
  accept?: string
  autoUpload?: boolean
  maxSizeMB?: number
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValue', fileList: UploadFile[]): void
  (e: 'success', file: UploadFile, response: any): void
  (e: 'error', file: UploadFile, err: any): void
  (e: 'remove', file: UploadFile, fileList: UploadFile[]): void
}>()

const fileList = ref<UploadFile[]>(props.modelValue || [])
const previewVisible = ref(false)
const previewImage = ref('')

/**
 * 监听外部 v-model 更新
 */
watch(
  () => props.modelValue,
  (val) => {
    fileList.value = val || []
  }
)

/**
 * 上传前校验文件大小
 */
function beforeUpload(file: UploadFile) {
  if (props.maxSizeMB && file.size / 1024 / 1024 > props.maxSizeMB) {
    ElMessage.error(`文件大小不能超过 ${props.maxSizeMB} MB`)
    return false
  }
  return true
}

/**
 * 文件上传成功
 */
function handleSuccess(file: UploadFile, response: any) {
  emit('success', file, response)
  emit('update:modelValue', fileList.value)
}

/**
 * 文件上传失败
 */
function handleError(file: UploadFile, err: any) {
  emit('error', file, err)
}

/**
 * 文件移除
 */
function handleRemove(file: UploadFile, fileListInner: UploadFile[]) {
  emit('remove', file, fileListInner)
  emit('update:modelValue', fileListInner)
}

/**
 * 预览图片
 */
function handlePreview(file: UploadFile) {
  if (file.url) {
    previewImage.value = file.url
    previewVisible.value = true
  } else if (file.raw) {
    previewImage.value = URL.createObjectURL(file.raw)
    previewVisible.value = true
  }
}
</script>

<style lang="scss" scoped>
.base-upload {
  .el-upload {
    width: 200px;
  }
}
</style>
```

------

**页面使用示例：DemoUploadPage.vue**

```vue
<template>
  <div class="demo-upload">
    <BaseUpload
      v-model="fileList"
      :multiple="true"
      :limit="5"
      accept=".jpg,.png,.pdf"
      :maxSizeMB="2"
      @success="handleSuccess"
      @error="handleError"
      @remove="handleRemove"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import BaseUpload from '@/components/BaseUpload.vue'
import type { UploadFile } from 'element-plus'

const fileList = ref<UploadFile[]>([])

function handleSuccess(file: UploadFile, response: any) {
  console.log('上传成功', file, response)
}

function handleError(file: UploadFile, err: any) {
  console.error('上传失败', file, err)
}

function handleRemove(file: UploadFile, fileListInner: UploadFile[]) {
  console.log('移除文件', file, fileListInner)
}
</script>

<style lang="scss" scoped>
.demo-upload {
  padding: 12px;
}
</style>
```

------

✅ **企业级封装特点：**

1. 支持单文件 / 多文件上传，支持 ElementPlus Upload 所有常用属性
2. 支持图片预览（本地或远程 URL）
3. 支持文件类型、文件大小限制
4. 支持上传状态回调（成功、失败、删除）
5. 支持 v-model 双向绑定上传列表
6. TS 类型安全，可在企业后台系统文件管理、商品图片上传等场景复用

------

## 日期选择封装

功能点如下：

- 支持单日期选择 `DatePicker`
- 支持日期范围选择 `RangePicker`
- 支持快捷选项（如今天、最近7天、最近30天）
- 支持禁用日期（`disabledDate`）
- 支持时间选择（可选）
- 支持 `v-model` 双向绑定值
- 支持事件回调：`change`、`clear`

------

**组件封装：BaseDatePicker.vue**

```vue
<template>
  <el-date-picker
    v-model="modelValue"
    :type="type"
    :placeholder="placeholder"
    :format="format"
    :value-format="valueFormat"
    :disabled-date="disabledDate"
    :shortcut="shortcuts"
    :clearable="clearable"
    :editable="editable"
    :picker-options="pickerOptions"
    style="width: 100%;"
    @change="handleChange"
    @clear="handleClear"
  />
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, ref, watch } from 'vue'
import type { Dayjs } from 'dayjs'

interface ShortcutType {
  text: string
  onClick: (picker: any) => void
}

interface Props {
  modelValue: string | [string, string] | null
  type?: 'date' | 'daterange' | 'datetime' | 'datetimerange'
  placeholder?: string
  format?: string
  valueFormat?: string
  shortcuts?: ShortcutType[]
  clearable?: boolean
  editable?: boolean
  pickerOptions?: Record<string, any>
  disabledDate?: (date: Date) => boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void
  (e: 'change', value: any): void
  (e: 'clear'): void
}>()

const modelValue = ref(props.modelValue)

/**
 * 监听外部 v-model 更新
 */
watch(
  () => props.modelValue,
  (val) => {
    modelValue.value = val
  }
)

/**
 * 值变化
 */
function handleChange(value: any) {
  emit('update:modelValue', value)
  emit('change', value)
}

/**
 * 清空事件
 */
function handleClear() {
  emit('clear')
}
</script>

<style lang="scss" scoped>
/* 可扩展自定义样式 */
</style>
```

------

**页面使用示例：DemoDatePickerPage.vue**

```vue
<template>
  <div class="demo-date-picker">
    <!-- 单日期 -->
    <BaseDatePicker
      v-model="singleDate"
      type="date"
      placeholder="请选择日期"
      :shortcuts="singleShortcuts"
    />

    <!-- 日期范围 -->
    <BaseDatePicker
      v-model="rangeDate"
      type="daterange"
      placeholder="请选择日期范围"
      :shortcuts="rangeShortcuts"
      :disabled-date="disabledFuture"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import BaseDatePicker from '@/components/BaseDatePicker.vue'
import dayjs from 'dayjs'

const singleDate = ref<string | null>(null)
const rangeDate = ref<[string, string] | null>(null)

/**
 * 单日期快捷选项
 */
const singleShortcuts = [
  {
    text: '今天',
    onClick: (picker: any) => {
      picker.$emit('pick', dayjs().format('YYYY-MM-DD'))
    }
  }
]

/**
 * 日期范围快捷选项
 */
const rangeShortcuts = [
  {
    text: '最近7天',
    onClick: (picker: any) => {
      const end = dayjs()
      const start = dayjs().subtract(6, 'day')
      picker.$emit('pick', [start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD')])
    }
  },
  {
    text: '最近30天',
    onClick: (picker: any) => {
      const end = dayjs()
      const start = dayjs().subtract(29, 'day')
      picker.$emit('pick', [start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD')])
    }
  }
]

/**
 * 禁用未来日期
 */
function disabledFuture(date: Date) {
  return date.getTime() > new Date().getTime()
}
</script>

<style lang="scss" scoped>
.demo-date-picker {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 300px;
}
</style>
```

------

✅ **企业级封装特点：**

1. 单日期和日期范围统一封装，方便在项目中复用
2. 支持快捷选项，可自定义最近7天、今天等业务快捷
3. 支持禁用特定日期（如未来日期、过去日期）
4. TS 类型完整，事件声明清晰
5. 支持 `v-model` 双向绑定，统一 ElementPlus DatePicker API
6. 易于在后台系统、报表筛选、数据分析页面中使用

------

## 开关封装

功能点如下：

- 封装 ElementPlus Switch
- 支持 `v-model` 双向绑定
- 支持禁用状态、大小、文本显示（on/off）
- 支持事件回调：`change`
- 支持统一样式，便于大型项目复用

------

**组件封装：BaseSwitch.vue**

```vue
<template>
  <el-switch
    v-model="modelValue"
    :disabled="disabled"
    :active-text="activeText"
    :inactive-text="inactiveText"
    :active-color="activeColor"
    :inactive-color="inactiveColor"
    :width="width"
    @change="handleChange"
  />
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, ref, watch } from 'vue'

interface Props {
  modelValue: boolean
  disabled?: boolean
  activeText?: string
  inactiveText?: string
  activeColor?: string
  inactiveColor?: string
  width?: number
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'change', value: boolean): void
}>()

const modelValue = ref(props.modelValue)

/**
 * 监听外部 v-model 更新
 */
watch(
  () => props.modelValue,
  (val) => {
    modelValue.value = val
  }
)

/**
 * 值变化
 */
function handleChange(value: boolean) {
  emit('update:modelValue', value)
  emit('change', value)
}
</script>

<style lang="scss" scoped>
/* 可统一样式 */
</style>
```

------

**页面使用示例：DemoSwitchPage.vue**

```vue
<template>
  <div class="demo-switch">
    <p>普通开关：</p>
    <BaseSwitch v-model="switchValue" @change="handleChange" />

    <p>禁用开关：</p>
    <BaseSwitch v-model="switchValueDisabled" :disabled="true" />

    <p>自定义文本与颜色：</p>
    <BaseSwitch
      v-model="switchCustom"
      active-text="开启"
      inactive-text="关闭"
      active-color="#13ce66"
      inactive-color="#ff4949"
      width="70"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import BaseSwitch from '@/components/BaseSwitch.vue'

const switchValue = ref(false)
const switchValueDisabled = ref(true)
const switchCustom = ref(false)

function handleChange(value: boolean) {
  console.log('开关状态:', value)
}
</script>

<style lang="scss" scoped>
.demo-switch {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 300px;
}
</style>
```

------

✅ **企业级封装特点：**

1. 完全封装 ElementPlus Switch，统一使用 v-model
2. 支持禁用状态、自定义宽度、文本、颜色
3. TS 类型安全，事件声明清晰
4. 统一样式，可在后台系统、表单、控制面板中复用
5. 支持 change 事件，方便业务逻辑处理

------

## 标签/状态封装

功能点如下：

- 封装 ElementPlus `Tag` 和 `Badge`
- 支持动态文本内容
- 支持颜色（状态颜色）
- 支持状态标识（例如 success / warning / error / info）
- 支持可关闭（Tag 可选）
- 支持事件回调：`close`

------

**组件封装：BaseTag.vue**

```vue
<template>
  <el-tag
    :type="type"
    :effect="effect"
    :closable="closable"
    :disable-transitions="disableTransitions"
    :hit="hit"
    :color="color"
    @close="handleClose"
  >
    <slot>{{ text }}</slot>
  </el-tag>

  <el-badge
    v-if="badgeCount !== undefined"
    :value="badgeCount"
    :type="badgeType"
    class="ml-2"
  />
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, ref, watch } from 'vue'

interface Props {
  text?: string                // 标签文本
  type?: 'success' | 'warning' | 'info' | 'danger' // 标签类型
  color?: string               // 自定义颜色
  effect?: 'dark' | 'light' | 'plain' // 标签效果
  closable?: boolean           // 是否可关闭
  disableTransitions?: boolean // 禁用动画
  hit?: boolean                // 高亮样式
  badgeCount?: number          // 徽标数量
  badgeType?: 'primary' | 'success' | 'warning' | 'danger' | 'info' // 徽标状态颜色
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'close'): void
}>()

const text = ref(props.text)
const type = ref(props.type || 'info')
const color = ref(props.color)
const effect = ref(props.effect || 'light')
const closable = ref(props.closable || false)
const disableTransitions = ref(props.disableTransitions || false)
const hit = ref(props.hit || false)
const badgeCount = ref(props.badgeCount)
const badgeType = ref(props.badgeType || 'primary')

/**
 * 关闭事件
 */
function handleClose() {
  emit('close')
}
</script>

<style lang="scss" scoped>
.ml-2 {
  margin-left: 8px;
}
</style>
```

------

**页面使用示例：DemoTagPage.vue**

```vue
<template>
  <div class="demo-tag">
    <!-- 普通状态标签 -->
    <BaseTag text="进行中" type="info" />

    <!-- 成功状态 -->
    <BaseTag text="完成" type="success" />

    <!-- 警告状态，可关闭 -->
    <BaseTag text="异常" type="warning" closable @close="handleClose" />

    <!-- 自定义颜色 -->
    <BaseTag text="自定义" color="#ff9900" />

    <!-- 带徽标 -->
    <BaseTag text="消息" type="primary" :badgeCount="5" badgeType="danger" />
  </div>
</template>

<script lang="ts" setup>
import BaseTag from '@/components/BaseTag.vue'

function handleClose() {
  console.log('标签已关闭')
}
</script>

<style lang="scss" scoped>
.demo-tag {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding: 12px;
}
</style>
```

------

✅ **企业级封装特点：**

1. 完全封装 ElementPlus Tag 和 Badge
2. 支持动态文本、状态颜色、徽标数量
3. 支持可关闭标签并触发事件
4. TS 类型安全，事件声明清晰
5. 统一样式，可在后台管理系统状态展示、消息通知、标签分类等场景复用

------

## 提示/消息封装

功能点如下：

- 封装 ElementPlus `Message`、`Notification`、`Tooltip`
- 支持统一调用方式（BaseMessage.show / BaseNotification.show / BaseTooltip）
- 支持不同类型（success / warning / info / error）
- 支持自定义标题、内容、持续时间
- 支持可关闭、全局样式统一
- 支持 TS 类型安全

------

**组件封装：BaseMessage.ts**

```ts
import { ElMessage, ElNotification } from 'element-plus'

type MessageType = 'success' | 'warning' | 'info' | 'error'

interface MessageOptions {
  message: string
  type?: MessageType
  duration?: number
  showClose?: boolean
}

/**
 * 全局消息提示封装
 */
export const BaseMessage = {
  show(options: MessageOptions) {
    ElMessage({
      message: options.message,
      type: options.type || 'info',
      duration: options.duration || 3000,
      showClose: options.showClose ?? true
    })
  },
  success(message: string, duration = 3000) {
    this.show({ message, type: 'success', duration })
  },
  warning(message: string, duration = 3000) {
    this.show({ message, type: 'warning', duration })
  },
  info(message: string, duration = 3000) {
    this.show({ message, type: 'info', duration })
  },
  error(message: string, duration = 3000) {
    this.show({ message, type: 'error', duration })
  }
}

/**
 * 全局通知封装
 */
export const BaseNotification = {
  show(options: MessageOptions & { title?: string }) {
    ElNotification({
      title: options.title || '提示',
      message: options.message,
      type: options.type || 'info',
      duration: options.duration || 4000,
      showClose: options.showClose ?? true
    })
  },
  success(title: string, message: string, duration = 4000) {
    this.show({ title, message, type: 'success', duration })
  },
  warning(title: string, message: string, duration = 4000) {
    this.show({ title, message, type: 'warning', duration })
  },
  info(title: string, message: string, duration = 4000) {
    this.show({ title, message, type: 'info', duration })
  },
  error(title: string, message: string, duration = 4000) {
    this.show({ title, message, type: 'error', duration })
  }
}
```

------

**Tooltip 封装组件：BaseTooltip.vue**

```vue
<template>
  <el-tooltip
    :content="content"
    :placement="placement"
    :effect="effect"
    :visible-arrow="visibleArrow"
  >
    <slot />
  </el-tooltip>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'

interface Props {
  content: string
  placement?: 'top' | 'bottom' | 'left' | 'right'
  effect?: 'dark' | 'light'
  visibleArrow?: boolean
}

const props = defineProps<Props>()

const placement = props.placement || 'top'
const effect = props.effect || 'dark'
const visibleArrow = props.visibleArrow ?? true
</script>

<style lang="scss" scoped>
/* 可统一样式 */
</style>
```

------

**页面使用示例：DemoMessagePage.vue**

```vue
<template>
  <div class="demo-message">
    <button @click="showMessage">Message 提示</button>
    <button @click="showNotification">Notification 提示</button>

    <BaseTooltip content="这是 Tooltip 提示" placement="top">
      <button>悬浮显示 Tooltip</button>
    </BaseTooltip>
  </div>
</template>

<script lang="ts" setup>
import { BaseMessage, BaseNotification } from '@/components/BaseMessage'
import BaseTooltip from '@/components/BaseTooltip.vue'

function showMessage() {
  BaseMessage.success('操作成功！')
  BaseMessage.warning('这是警告提示')
}

function showNotification() {
  BaseNotification.success('成功', '操作已完成')
  BaseNotification.error('错误', '操作失败，请重试')
}
</script>

<style lang="scss" scoped>
.demo-message {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
</style>
```

------

✅ **企业级封装特点：**

1. 全局统一调用方式，业务无需每次重复配置 ElementPlus API
2. 支持 Message、Notification、Tooltip 三类常用提示
3. 支持类型、标题、内容、持续时间、关闭按钮统一设置
4. TS 类型安全，事件调用清晰
5. 易于在后台系统操作反馈、报表提示、按钮操作反馈场景复用

------

## 加载/骨架封装

功能点如下：

- 封装 ElementPlus `Loading`（全屏/局部加载）
- 封装 ElementPlus `Skeleton`（骨架屏占位）
- 支持动态绑定显示状态
- 支持自定义样式、尺寸、数量
- 支持 TS 类型安全和事件回调

------

**组件封装：BaseLoading.vue**

```vue
<template>
  <el-skeleton
    v-if="!loaded"
    :rows="rows"
    :animated="animated"
    :loading="true"
    style="width: 100%;"
  >
    <slot />
  </el-skeleton>

  <div v-else>
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'

interface Props {
  loaded?: boolean        // 数据是否已加载
  rows?: number           // 骨架行数
  animated?: boolean      // 是否开启动画
}

const props = defineProps<Props>()

const loaded = props.loaded ?? false
const rows = props.rows ?? 3
const animated = props.animated ?? true
</script>

<style lang="scss" scoped>
/* 可扩展自定义骨架样式 */
</style>
```

------

**全局加载封装：BaseFullLoading.ts**

```ts
import { ElLoading } from 'element-plus'

let loadingInstance: ReturnType<typeof ElLoading.service> | null = null

interface LoadingOptions {
  text?: string
  fullscreen?: boolean
  lock?: boolean
  background?: string
}

export const BaseLoading = {
  /**
   * 显示全局或局部加载
   */
  show(options?: LoadingOptions) {
    loadingInstance = ElLoading.service({
      text: options?.text || '加载中...',
      fullscreen: options?.fullscreen ?? true,
      lock: options?.lock ?? true,
      background: options?.background || 'rgba(0, 0, 0, 0.3)'
    })
  },

  /**
   * 关闭加载
   */
  close() {
    if (loadingInstance) {
      loadingInstance.close()
      loadingInstance = null
    }
  }
}
```

------

**页面使用示例：DemoLoadingPage.vue**

```vue
<template>
  <div class="demo-loading">
    <p>骨架屏示例：</p>
    <BaseLoading :loaded="loaded" :rows="5">
      <div>
        <p v-for="i in 5" :key="i">这是加载完成后的真实内容第 {{ i }} 行</p>
      </div>
    </BaseLoading>

    <p>全局加载示例：</p>
    <button @click="showGlobalLoading">显示全局加载</button>
    <button @click="closeGlobalLoading">关闭全局加载</button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import BaseLoading from '@/components/BaseLoading.vue'
import { BaseLoading as BaseFullLoading } from '@/components/BaseFullLoading'

const loaded = ref(false)

/**
 * 模拟加载数据
 */
setTimeout(() => {
  loaded.value = true
}, 2000)

function showGlobalLoading() {
  BaseFullLoading.show({ text: '全局加载中...' })
  setTimeout(() => {
    BaseFullLoading.close()
  }, 3000)
}

function closeGlobalLoading() {
  BaseFullLoading.close()
}
</script>

<style lang="scss" scoped>
.demo-loading {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
```

------

✅ **企业级封装特点：**

1. 骨架屏与全局加载统一封装，方便在列表页、表单、详情页等复用
2. 支持动态显示状态（loaded）、动画效果、行数自定义
3. 全局加载支持文本、背景、锁屏、全屏配置
4. TS 类型安全，事件和状态清晰
5. 统一样式，易于企业后台系统、管理平台、大型前端应用使用

------

## 弹出框封装

**弹出框封装**

- 封装 `Popover / Dropdown`，统一触发方式、位置控制、菜单数据结构和样式。

------

组件封装代码：BasePopover.vue

```vue
<template>
  <!-- Popover 弹出框 -->
  <el-popover
    :placement="placement"      <!-- 弹出位置 -->
    :width="width"              <!-- 弹出宽度 -->
    :trigger="trigger"          <!-- 触发方式 -->
    :popper-class="popperClass" <!-- 自定义样式 -->
  >
    <!-- 弹出内容 -->
    <div class="popover-content">
      <slot name="content">
        {{ content }}
      </slot>
    </div>

    <!-- 触发元素 -->
    <template #reference>
      <slot />
    </template>
  </el-popover>
</template>

<script lang="ts" setup>
import { defineProps, withDefaults } from 'vue'

interface Props {
  content?: string
  width?: number | string
  trigger?: 'hover' | 'click' | 'focus' | 'contextmenu'
  placement?:
    | 'top'
    | 'top-start'
    | 'top-end'
    | 'bottom'
    | 'bottom-start'
    | 'bottom-end'
    | 'left'
    | 'right'
  popperClass?: string
}

withDefaults(defineProps<Props>(), {
  trigger: 'hover',
  width: 200,
  placement: 'top',
  popperClass: 'base-popover'
})
</script>

<style lang="scss" scoped>
.popover-content {
  font-size: 14px;     // 内容字体大小
  color: #606266;      // 文本颜色
  line-height: 1.6;    // 行高
  padding: 4px 0;      // 内边距
}
</style>
```

------

组件封装代码：BaseDropdown.vue

```vue
<template>
  <!-- 下拉菜单 -->
  <el-dropdown
    :trigger="trigger"        <!-- 触发方式 -->
    :placement="placement"    <!-- 弹出位置 -->
    @command="handleCommand"
  >
    <!-- 触发元素 -->
    <span class="dropdown-trigger">
      <slot />
    </span>

    <!-- 菜单列表 -->
    <template #dropdown>
      <el-dropdown-menu class="base-dropdown-menu">
        <el-dropdown-item
          v-for="item in options"
          :key="item.value"
          :command="item.value"
          :disabled="item.disabled"
        >
          {{ item.label }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, withDefaults } from 'vue'

interface DropdownOption {
  label: string
  value: string | number
  disabled?: boolean
}

interface Props {
  options: DropdownOption[]
  trigger?: 'hover' | 'click' | 'contextmenu'
  placement?: 'top' | 'bottom' | 'bottom-start' | 'bottom-end'
}

const props = withDefaults(defineProps<Props>(), {
  trigger: 'click',
  placement: 'bottom'
})

const emit = defineEmits<{
  (e: 'command', value: string | number): void
}>()

/**
 * 点击菜单项事件
 */
function handleCommand(command: string | number) {
  emit('command', command)
}
</script>

<style lang="scss" scoped>
.dropdown-trigger {
  cursor: pointer;      // 鼠标样式
  display: inline-flex; // 行内flex布局
  align-items: center;  // 垂直居中
}

.base-dropdown-menu {
  min-width: 120px; // 菜单最小宽度
}
</style>
```

------

页面使用代码：DemoPopoverDropdown.vue

```vue
<template>
  <div class="demo">

    <!-- Popover 示例 -->
    <BasePopover content="这是 Popover 提示" placement="top">
      <el-button type="primary">
        悬浮提示
      </el-button>
    </BasePopover>

    <!-- 自定义 Popover 内容 -->
    <BasePopover placement="bottom">
      <template #content>
        <div>
          <p>自定义内容</p>
          <el-button size="small">操作</el-button>
        </div>
      </template>

      <el-button>
        点击弹出
      </el-button>
    </BasePopover>

    <!-- Dropdown 示例 -->
    <BaseDropdown
      :options="menuList"
      @command="handleCommand"
    >
      <el-button type="success">
        操作菜单
      </el-button>
    </BaseDropdown>

  </div>
</template>

<script lang="ts" setup>
import BasePopover from '@/components/BasePopover.vue'
import BaseDropdown from '@/components/BaseDropdown.vue'

const menuList = [
  { label: '查看', value: 'view' },
  { label: '编辑', value: 'edit' },
  { label: '删除', value: 'delete' }
]

/**
 * 菜单点击回调
 */
function handleCommand(command: string | number) {
  console.log('选择操作:', command)
}
</script>

<style lang="scss" scoped>
.demo {
  display: flex; // flex布局
  gap: 16px;     // 间距
  padding: 20px; // 内边距
}
</style>
```

## 卡片封装

**卡片封装**

- 封装通用 `Card` 组件，支持标题区、内容区、操作区（header / default / footer），统一样式结构，适用于信息卡片、统计卡片、列表卡片等场景。

------

组件封装代码：BaseCard.vue

```vue
<template>
  <el-card
    class="base-card"
    :shadow="shadow"            <!-- 阴影效果 -->
    :body-style="bodyStyle"     <!-- 内容区域样式 -->
  >
    <!-- 标题区 -->
    <template v-if="title || $slots.header" #header>
      <div class="card-header">

        <!-- 标题 -->
        <div class="card-title">
          <slot name="header">
            {{ title }}
          </slot>
        </div>

        <!-- 操作区 -->
        <div v-if="$slots.action" class="card-actions">
          <slot name="action"></slot>
        </div>

      </div>
    </template>

    <!-- 内容区 -->
    <div class="card-body">
      <slot></slot>
    </div>

    <!-- 底部 -->
    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer"></slot>
    </div>

  </el-card>
</template>

<script lang="ts" setup>
import { defineProps, withDefaults, CSSProperties } from 'vue'

interface Props {
  title?: string                         // 卡片标题
  shadow?: 'always' | 'hover' | 'never'  // 阴影模式
  bodyStyle?: CSSProperties              // 内容区样式
}

withDefaults(defineProps<Props>(), {
  shadow: 'hover',
  bodyStyle: () => ({
    padding: '16px'
  })
})
</script>

<style lang="scss" scoped>
.base-card {
  border-radius: 6px; // 卡片圆角
}

/* 头部 */
.card-header {
  display: flex;                    // flex布局
  justify-content: space-between;   // 左右布局
  align-items: center;              // 垂直居中
}

/* 标题 */
.card-title {
  font-size: 16px;  // 标题大小
  font-weight: 500; // 字体加粗
  color: #303133;   // 标题颜色
}

/* 操作区 */
.card-actions {
  display: flex; // flex布局
  gap: 8px;      // 按钮间距
}

/* 内容区 */
.card-body {
  font-size: 14px; // 内容字体
  color: #606266;  // 内容颜色
}

/* 底部 */
.card-footer {
  margin-top: 12px;               // 上间距
  padding-top: 12px;              // 内边距
  border-top: 1px solid #ebeef5;  // 分割线
  display: flex;
  justify-content: flex-end;      // 右对齐
}
</style>
```

------

页面使用代码：DemoCard.vue

```vue
<template>
  <div class="card-demo">

    <!-- 基础卡片 -->
    <BaseCard title="用户信息">
      <p>姓名：张三</p>
      <p>部门：技术部</p>
      <p>职位：后端工程师</p>
    </BaseCard>

    <!-- 带操作区 -->
    <BaseCard title="订单信息">
      <template #action>
        <el-button size="small">编辑</el-button>
        <el-button size="small" type="danger">删除</el-button>
      </template>

      <p>订单号：A20240501</p>
      <p>金额：￥399</p>
    </BaseCard>

    <!-- 带底部操作 -->
    <BaseCard title="系统通知">
      <p>系统将在今晚 22:00 进行维护升级。</p>

      <template #footer>
        <el-button size="small">取消</el-button>
        <el-button size="small" type="primary">确认</el-button>
      </template>
    </BaseCard>

  </div>
</template>

<script lang="ts" setup>
import BaseCard from '@/components/BaseCard.vue'
</script>

<style lang="scss" scoped>
.card-demo {
  display: grid;                         // grid布局
  grid-template-columns: repeat(2, 1fr); // 两列布局
  gap: 20px;                             // 卡片间距
}
</style>
```