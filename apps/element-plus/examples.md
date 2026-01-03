# ElementPlus使用文档



## 一、布局与基础结构

## 1. Layout 布局（Container）

## 1.1 基本页面结构（Header 固定 + Main 滚动）

### 🎯 目标效果

- 页面 **高度撑满整个视口**
- Header 固定在顶部
- 内容区（Main）内部滚动
- Footer 可选

------

### ✅ App.vue 完整示例（可直接用）

```vue
<template>
  <el-container class="page-container">
    <!-- 顶部区域 -->
    <el-header class="page-header">
      <div class="header-left">后台管理系统</div>
      <div class="header-right">用户信息</div>
    </el-header>

    <!-- 主体内容 -->
    <el-main class="page-main">
      <div class="content">
        <p v-for="i in 50" :key="i">
          这是第 {{ i }} 行内容，用于测试 Main 区域滚动效果
        </p>
      </div>
    </el-main>

    <!-- 底部（可选） -->
    <el-footer class="page-footer">
      © 2026 Demo System
    </el-footer>
  </el-container>
</template>

<script setup lang="ts">
// 本示例无需任何逻辑
</script>

<style scoped>
/* 整个页面撑满视口 */
.page-container {
  height: 100vh;
}

/* Header 固定高度 */
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  background-color: #409eff;
  color: #fff;
  padding: 0 20px;
}

/* Main 区域可滚动 */
.page-main {
  padding: 16px;
  overflow: auto;
  background-color: #f5f7fa;
}

/* Footer */
.page-footer {
  height: 40px;
  text-align: center;
  line-height: 40px;
  color: #999;
  font-size: 12px;
}
</style>
```

------

### 📌 理论 & 关键点讲解

#### 1️⃣ `el-container`

- 本质是一个 **flex 容器**
- **默认是纵向布局**
- 高度不写是不会自动撑满屏幕的

👉 **必须显式写：**

```css
height: 100vh;
```

------

#### 2️⃣ `el-header / el-footer`

- 默认是 `flex: 0 0 auto`
- 高度建议**自己明确写死**
- 非常适合放：
  - Logo
  - 用户信息
  - 顶部操作按钮

------

#### 3️⃣ `el-main`（最容易踩坑）

- **不会自动滚动**
- 必须显式加：

```css
overflow: auto;
```

否则：

- 内容会把整个页面撑高
- 滚动条出现在 `body` 上 ❌

------

### ⚠️ 常见错误

| 错误                   | 结果         |
| ---------------------- | ------------ |
| 忘记 `height: 100vh`   | 页面高度塌陷 |
| `Main` 不加 `overflow` | 整页滚动     |
| Header 不写高度        | 布局不可控   |

------

## 1.2 左右布局（后台系统最常用）

这是 **后台管理系统的核心布局模型**。

------

### 🎯 目标效果

- 左侧：菜单栏（Aside）
- 右侧：Header + 内容
- Aside 固定宽度
- 内容区自适应
- 支持侧边栏折叠

------

### ✅ App.vue 完整示例（可直接用）

```vue
<template>
  <el-container class="layout-container">
    <!-- 左侧菜单 -->
    <el-aside
      class="layout-aside"
      :width="isCollapse ? '64px' : '200px'"
    >
      <div class="logo">
        {{ isCollapse ? 'LOGO' : '后台系统' }}
      </div>
    </el-aside>

    <!-- 右侧主体 -->
    <el-container>
      <el-header class="layout-header">
        <el-button size="small" @click="toggleCollapse">
          {{ isCollapse ? '展开菜单' : '折叠菜单' }}
        </el-button>
      </el-header>

      <el-main class="layout-main">
        <p v-for="i in 40" :key="i">
          主内容区域第 {{ i }} 行
        </p>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'

/**
 * 是否折叠菜单
 */
const isCollapse = ref(false)

const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}
</script>

<style scoped>
.layout-container {
  height: 100vh;
}

/* 左侧栏 */
.layout-aside {
  background-color: #001529;
  color: #fff;
  transition: width 0.2s;
}

/* Logo */
.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

/* 顶部 */
.layout-header {
  height: 60px;
  display: flex;
  align-items: center;
  background-color: #fff;
  border-bottom: 1px solid #ebeef5;
}

/* 主内容 */
.layout-main {
  padding: 16px;
  overflow: auto;
  background-color: #f5f7fa;
}
</style>
```

------

### 📌 理论 & 参数说明

#### 1️⃣ `el-aside`

```vue
<el-aside :width="isCollapse ? '64px' : '200px'" />
```

- `width` **必须是字符串**

- 不传时默认 `300px`

- 折叠菜单本质：

  > **只是改变宽度，并不是隐藏**

------

#### 2️⃣ 折叠菜单的核心思想

```ts
const isCollapse = ref(false)
```

- 控制宽度
- 控制 Logo 文案
- 后续可用于：
  - Menu 的 `collapse` 属性
  - Icon-only 模式

------

#### 3️⃣ 为什么要再嵌套一个 `el-container`

```vue
<el-container>
  <el-header />
  <el-main />
</el-container>
```

原因很重要 👇

- `Container` 的布局方向由 **子组件类型决定**
- 同级出现 `el-aside` → 横向布局
- 内层没有 `el-aside` → 自动纵向

👉 **这是 Element Plus Layout 的设计核心**

------

### ⚠️ 真实项目注意事项

1. **Aside 一定要固定宽度**
2. 折叠只做宽度变化，避免 `v-if`
3. 滚动永远放在 `el-main`
4. Header 高度统一（60px 是事实标准）

------

## 2. Grid 栅格（Row / Col）

> Element Plus 的 `Row / Col`
> 👉 本质：**24 栅格的响应式 Flex 布局系统**

------

## 2.1 基础栅格

### 🎯 目标效果

- 一行分成若干列
- 列宽按比例分配
- 列与列之间有间距（不贴边）

------

### ✅ App.vue 示例：基础栅格

```vue
<template>
  <el-container class="page-container">
    <el-main>
      <h3>基础栅格示例</h3>

      <el-row :gutter="20">
        <el-col :span="6">
          <div class="grid-item">span = 6</div>
        </el-col>
        <el-col :span="6">
          <div class="grid-item">span = 6</div>
        </el-col>
        <el-col :span="6">
          <div class="grid-item">span = 6</div>
        </el-col>
        <el-col :span="6">
          <div class="grid-item">span = 6</div>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
// 无逻辑
</script>

<style scoped>
.page-container {
  height: 100vh;
}

.grid-item {
  background-color: #409eff;
  color: #fff;
  text-align: center;
  padding: 16px 0;
  border-radius: 4px;
}
</style>
```

------

### 📌 理论讲解（非常关键）

#### 1️⃣ `span` 是什么？

```vue
<el-col :span="6" />
```

- 一行 **总共 24 份**
- `span = 6` → 占 `6 / 24 = 25%`
- 常见组合：

| 布局      | span          |
| --------- | ------------- |
| 一行 2 列 | 12 + 12       |
| 一行 3 列 | 8 + 8 + 8     |
| 一行 4 列 | 6 + 6 + 6 + 6 |

👉 **超过 24 会自动换行**

------

#### 2️⃣ `gutter` 是什么？

```vue
<el-row :gutter="20" />
```

- 列与列之间的 **水平间距（px）**
- 实现方式：
  - Row 加左右负 margin
  - Col 加左右 padding
- **必须写在 `el-row` 上**

常用值：

- `16`（紧凑）
- `20`（最常用）
- `24`（宽松）

------

### ⚠️ 常见坑

❌ 在 `el-col` 上写 `margin`
❌ 忘记加 `gutter` 导致内容贴边
❌ `span` 随便乱加导致换行错乱

------

## 2.2 响应式栅格

### 🎯 目标效果

- PC：一行多列
- 平板：一行 2 列
- 手机：一行 1 列

------

### ✅ App.vue 示例：响应式布局

```vue
<template>
  <el-container class="page-container">
    <el-main>
      <h3>响应式栅格</h3>

      <el-row :gutter="20">
        <el-col
          :xs="24"
          :sm="12"
          :md="8"
          :lg="6"
        >
          <div class="grid-item">响应式列 1</div>
        </el-col>

        <el-col
          :xs="24"
          :sm="12"
          :md="8"
          :lg="6"
        >
          <div class="grid-item">响应式列 2</div>
        </el-col>

        <el-col
          :xs="24"
          :sm="12"
          :md="8"
          :lg="6"
        >
          <div class="grid-item">响应式列 3</div>
        </el-col>

        <el-col
          :xs="24"
          :sm="12"
          :md="8"
          :lg="6"
        >
          <div class="grid-item">响应式列 4</div>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script setup lang="ts"></script>

<style scoped>
.page-container {
  height: 100vh;
}

.grid-item {
  background-color: #67c23a;
  color: #fff;
  text-align: center;
  padding: 16px 0;
  border-radius: 4px;
}
</style>
```

------

### 📌 响应式参数说明

| 参数 | 含义            |
| ---- | --------------- |
| `xs` | < 768px（手机） |
| `sm` | ≥ 768px         |
| `md` | ≥ 992px         |
| `lg` | ≥ 1200px        |
| `xl` | ≥ 1920px        |

👉 每个值本质上还是 **span**

```vue
:md="8"  // 中屏占 8 / 24
```

------

### ✅ 实战建议（非常重要）

- **后台系统可以不写 `xs`**
- 搜索区、表单强烈建议写响应式
- 列表区通常固定布局

------

## 2.3 常见表单 / 搜索布局（高频实战）

这是你 **项目里出现次数最多的 Grid 用法**。

------

### 🎯 目标效果

- 一行 3~4 个查询条件
- 最右侧：查询 / 重置按钮
- 小屏自动换行
- 按钮右对齐

------

### ✅ App.vue 示例：搜索区布局

```vue
<template>
  <el-container class="page-container">
    <el-main>
      <h3>搜索表单布局</h3>

      <el-form :inline="true" class="search-form">
        <el-row :gutter="20">
          <!-- 查询条件 -->
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="用户名">
              <el-input placeholder="请输入用户名" />
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="状态">
              <el-select placeholder="请选择状态" clearable>
                <el-option label="启用" value="1" />
                <el-option label="禁用" value="0" />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="日期">
              <el-date-picker type="date" placeholder="选择日期" />
            </el-form-item>
          </el-col>

          <!-- 操作按钮 -->
          <el-col
            :xs="24"
            :sm="24"
            :md="24"
            :lg="6"
            class="search-actions"
          >
            <el-button type="primary">查询</el-button>
            <el-button>重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-main>
  </el-container>
</template>

<script setup lang="ts"></script>

<style scoped>
.page-container {
  height: 100vh;
}

/* 操作按钮右对齐 */
.search-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>
```

------

### 📌 搜索布局核心思想（一定要记住）

#### 1️⃣ 一行 4 列的黄金比例

```ts
lg = 6   // 24 / 4 = 6
md = 8   // 24 / 3 = 8
sm = 12  // 24 / 2 = 12
xs = 24  // 1 行 1 个
```

👉 **这是后台搜索区的事实标准**

------

#### 2️⃣ 为什么按钮单独一列？

- 对齐好控制
- 不受 label 宽度影响
- 小屏时自然换行

------

#### 3️⃣ 为什么按钮列要 `24`？

```vue
:md="24"
```

- 确保：
  - 小屏换到下一行
  - 不挤占输入框空间

------

### ⚠️ 常见错误总结

❌ 所有列 span 写死
❌ 按钮和表单项混在一起
❌ 不写响应式导致小屏崩掉
❌ 用 `margin-left` 硬推按钮位置

------

# 二、表单与数据录入（高频核心）

## 3. Form 表单（el-form）

> `el-form` 本质是一个 **表单容器 + 校验系统**
> 子组件如 `el-input / el-select / el-date-picker` 等，都可以通过 `prop` 与 `rules` 绑定验证。

------

## 3.1 基础表单结构

### 🎯 目标效果

- 新增 / 编辑表单
- 有 label
- 统一宽度
- 可选择 label 位置（左 / 上 / 内联）

------

### ✅ App.vue 示例：基础表单

```vue
<template>
  <el-container class="page-container">
    <el-main>
      <h3>基础表单示例</h3>

      <el-form
        ref="formRef"
        :model="form"
        label-width="100px"
        label-position="right"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" />
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱" />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择状态" clearable>
            <el-option label="启用" value="1" />
            <el-option label="禁用" value="0" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm">提交</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { FormInstance } from 'element-plus'

/**
 * 表单数据
 */
const form = reactive({
  username: '',
  email: '',
  status: ''
})

/**
 * el-form 实例
 * 用于手动校验 / 重置
 */
const formRef = ref<FormInstance>()

/**
 * 提交
 */
const submitForm = () => {
  formRef.value?.validate((valid) => {
    if (valid) {
      alert('提交成功: ' + JSON.stringify(form))
    } else {
      alert('表单校验失败')
    }
  })
}

/**
 * 重置表单
 */
const resetForm = () => {
  formRef.value?.resetFields()
}
</script>

<style scoped>
.page-container {
  height: 100vh;
  padding: 16px;
}
</style>
```

------

### 📌 理论 & 参数说明

#### 1️⃣ `:model`

```ts
:form="form"
```

- **表单数据源**
- `el-input / el-select` 的 `v-model` 必须绑定到 `form` 的属性
- **响应式对象**（`reactive`）

------

#### 2️⃣ `label-width` & `label-position`

| 参数             | 含义                                             |
| ---------------- | ------------------------------------------------ |
| `label-width`    | label 固定宽度（px / auto）                      |
| `label-position` | `right` / `top` / `left`（右对齐、上方、左对齐） |

- 后台表单常用：`right` + `100px`
- 移动端 / 卡片表单：`top`

------

#### 3️⃣ `el-form-item` & `prop`

- `label` → 展示在左侧
- `prop` → 用于表单校验 **对应字段**
- 如果不做校验可以不写 `prop`，只是展示 label

------

## 3.2 表单校验（必用）

### 🎯 目标效果

- 必填
- 格式验证（邮箱、手机号）
- 触发方式：`blur / change`
- 手动校验

------

### ✅ App.vue 示例：表单校验

```vue
<template>
  <el-container class="page-container">
    <el-main>
      <h3>基础表单示例</h3>

      <el-form
          ref="formRef"
          :rules="rules"
          :model="form"
          label-width="100px"
          label-position="right"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" />
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱" />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择状态" clearable>
            <el-option label="启用" value="1" />
            <el-option label="禁用" value="0" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm">提交</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { FormInstance } from 'element-plus'

/**
 * 表单数据
 */
const form = reactive({
  username: '',
  email: '',
  status: ''
})

// 校验规则
const rules = {
  username: [
    { required: true, message: '用户名不能为空', trigger: 'blur' },
    { min: 3, max: 12, message: '长度在3~12个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '邮箱不能为空', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'change' }
  ]
}

/**
 * el-form 实例
 * 用于手动校验 / 重置
 */
const formRef = ref<FormInstance | null>(null)

/**
 * 提交
 */
const submitForm = () => {
  formRef.value?.validate((valid) => {
    if (valid) {
      alert('提交成功: ' + JSON.stringify(form))
    } else {
      alert('表单校验失败')
    }
  })
}

/**
 * 重置表单
 */
const resetForm = () => {
  formRef.value?.resetFields()
}

</script>

<style scoped>
.page-container {
  height: 100vh;
  padding: 16px;
}
</style>
```

------

### 📌 理论说明

#### 1️⃣ `:rules`

- 对象，键名 = form 属性名
- 值 = 校验规则数组
- 每条规则可设置：
  - `required`（必填）
  - `min / max`（长度）
  - `type`（email / number）
  - `message`（提示）
  - `trigger`（触发事件）

#### 2️⃣ `validate` 方法

```ts
formRef.value?.validate((valid) => { ... })
```

- 手动触发表单校验
- 回调 `valid` = true / false

#### 3️⃣ `resetFields` 方法

- 重置表单数据为初始值
- 清除校验状态

------

## 3.3 表单禁用 / 只读态

### 🎯 目标效果

- 查看详情页用同一个表单
- 禁止修改

------

### ✅ 示例

```vue
<el-form :model="form" :disabled="isDisabled" label-width="100px">
  <el-form-item label="用户名">
    <el-input v-model="form.username" />
  </el-form-item>

  <el-form-item label="邮箱">
    <el-input v-model="form.email" />
  </el-form-item>
</el-form>

<el-button @click="isDisabled = !isDisabled">
  切换禁用状态
</el-button>
<script setup lang="ts">
const isDisabled = ref(false)
</script>
```

------

### 📌 理论说明

- `:disabled` 会**递归禁用**表单内的所有输入控件
- 配合 **同一个表单组件**，可实现：
  - 新增：`disabled = false`
  - 查看详情：`disabled = true`
- ⚠️ 不会影响表单校验逻辑，仍然可以 `validate`

------

# 4. Input 输入类组件

## 4.1 el-input 基础使用

### 🎯 目标效果

- 普通文本输入
- 可清空
- 密码可切换显示
- 限制长度
- 显示输入字数

------

### ✅ App.vue 示例：基础 Input

```vue
<template>
  <el-container class="page-container">
    <el-main>
      <h3>基础 Input 示例</h3>

      <!-- 普通输入 -->
      <el-form-item label="用户名">
        <el-input
          v-model="form.username"
          placeholder="请输入用户名"
          clearable
          maxlength="20"
          show-word-limit
        />
      </el-form-item>

      <!-- 密码输入 -->
      <el-form-item label="密码">
        <el-input
          v-model="form.password"
          type="password"
          placeholder="请输入密码"
          show-password
        />
      </el-form-item>

      <!-- 多行文本 -->
      <el-form-item label="备注">
        <el-input
          type="textarea"
          v-model="form.remark"
          placeholder="请输入备注"
          :rows="4"
        />
      </el-form-item>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const form = reactive({
  username: '',
  password: '',
  remark: ''
})
</script>

<style scoped>
.page-container {
  padding: 16px;
}
</style>
```

------

### 📌 理论讲解

#### 1️⃣ `v-model`

- 双向绑定输入框值到数据源
- 输入改变时，`form.username` 自动更新
- 是表单数据绑定的基础

#### 2️⃣ `placeholder`

- 提示用户输入内容
- 不同于 `label`，只是灰色占位文字

#### 3️⃣ `clearable`

- 显示小叉号，点击清空输入
- 常用于搜索框 / 表单输入

#### 4️⃣ `show-password`

- 仅对 `type="password"` 有效
- 显示切换密码明文的小眼睛图标
- 对安全登录表单非常实用

#### 5️⃣ `maxlength / show-word-limit`

- 限制最大输入长度
- `show-word-limit` 显示右下角文字计数
- 例如 `3/20` 表示已输入 3 个字符，最大 20

------

## 4.2 前后缀插槽

### 🎯 目标效果

- 在输入框前后添加图标、文字或按钮
- 高频场景：
  - 搜索框前的 🔍
  - 后缀按钮：清空 / 搜索 / 日期选择

------

### ✅ App.vue 示例：前后缀

```vue
<template>
  <el-container class="page-container">
    <el-main>
      <h3>Input 前后缀示例</h3>

      <!-- 前缀 -->
      <el-form-item label="搜索用户">
        <el-input placeholder="请输入用户名" v-model="form.search">
          <template #prefix>
            <i class="el-icon-search"></i>
          </template>
        </el-input>
      </el-form-item>

      <!-- 后缀 -->
      <el-form-item label="邮箱">
        <el-input
          v-model="form.email"
          placeholder="请输入邮箱"
        >
          <template #suffix>
            <el-button size="mini" @click="clearEmail">清空</el-button>
          </template>
        </el-input>
      </el-form-item>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const form = reactive({
  search: '',
  email: ''
})

const clearEmail = () => {
  form.email = ''
}
</script>

<style scoped>
.page-container {
  padding: 16px;
}
</style>
```

------

### 📌 理论讲解

#### 1️⃣ 前缀 `#prefix`

- 显示在输入框最左侧
- 可放图标 / 文本 / 组件
- 常用场景：搜索图标、货币符号（¥）

#### 2️⃣ 后缀 `#suffix`

- 显示在输入框最右侧
- 可放按钮 / 清空 / 状态提示
- 常用场景：
  - 清空按钮
  - 输入验证状态（✔️ / ❌）
  - 日期选择按钮

#### 3️⃣ 注意事项

- 插槽本身不会改变输入框的 `v-model`
- 如果是按钮操作，需要手动操作数据
- 不要在 prefix/suffix 放复杂表单控件，会影响布局

------

## 5. Select 选择器

## 5.1 el-select + el-option 基础使用

### 🎯 目标效果

- 下拉选择
- 可清空
- 可搜索过滤
- 占位提示

------

### ✅ App.vue 示例：基础 Select

```vue
<template>
  <el-container class="page-container">
    <el-main>
      <h3>基础 Select 示例</h3>

      <el-form :model="form" label-width="100px">
        <!-- 普通下拉 -->
        <el-form-item label="状态">
          <el-select
            v-model="form.status"
            placeholder="请选择状态"
            clearable
          >
            <el-option label="启用" value="1" />
            <el-option label="禁用" value="0" />
          </el-select>
        </el-form-item>

        <!-- 可搜索过滤 -->
        <el-form-item label="国家">
          <el-select
            v-model="form.country"
            placeholder="请选择国家"
            filterable
            clearable
          >
            <el-option label="中国" value="CN" />
            <el-option label="美国" value="US" />
            <el-option label="日本" value="JP" />
            <el-option label="德国" value="DE" />
          </el-select>
        </el-form-item>

        <!-- 禁用选项 -->
        <el-form-item label="角色">
          <el-select
            v-model="form.role"
            placeholder="请选择角色"
            clearable
          >
            <el-option label="管理员" value="admin" />
            <el-option label="普通用户" value="user" />
            <el-option label="游客" value="guest" disabled />
          </el-select>
        </el-form-item>
      </el-form>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const form = reactive({
  status: '',
  country: '',
  role: ''
})
</script>

<style scoped>
.page-container {
  padding: 16px;
}
</style>
```

------

### 📌 理论讲解

#### 1️⃣ `v-model`

- 双向绑定选择器的值
- 对应 `el-option` 的 `value`
- 必须是响应式对象（`reactive` / `ref`）

#### 2️⃣ `placeholder`

- 占位提示文字
- 当 `v-model` 为空时显示

#### 3️⃣ `clearable`

- 右侧出现小叉号，点击清空选择
- 对于表单查询区非常常用

#### 4️⃣ `filterable`

- 允许输入过滤选项
- 对应后台搜索或字典选择非常实用
- 文字匹配规则：包含搜索词即可

#### 5️⃣ `disabled`

- 对单个选项禁用
- 适合灰掉不可选的枚举值

------

## 5.2 常见业务场景

### 1️⃣ 下拉字典（字典表 / 枚举）

```ts
const statusOptions = [
  { label: '启用', value: '1' },
  { label: '禁用', value: '0' }
]
<el-select v-model="form.status" placeholder="请选择状态" clearable>
  <el-option
    v-for="item in statusOptions"
    :key="item.value"
    :label="item.label"
    :value="item.value"
  />
</el-select>
```

> ✅ 优点：动态生成选项，可直接绑定接口返回的字典数据

------

### 2️⃣ 枚举映射

- 常见场景：接口返回 `status = 1 / 0`，前端显示“启用 / 禁用”
- 结合 `v-for` 渲染

```ts
const roleEnum = {
  admin: '管理员',
  user: '普通用户',
  guest: '游客'
}
<el-select v-model="form.role" placeholder="请选择角色">
  <el-option
    v-for="(label, value) in roleEnum"
    :key="value"
    :label="label"
    :value="value"
  />
</el-select>
```

> ✅ 优点：代码可维护，枚举值集中管理

------

### 3️⃣ 禁用选项

- 有些角色或状态不可选，用 `disabled` 控制

```vue
<el-option label="游客" value="guest" disabled />
```

- ⚠️ 注意：
  - `v-model` 不能绑定到禁用值，否则表单会报错
  - 建议在初始化时排除不可选值或提示用户

------

### 📌 实战注意事项

1. **动态数据必须保证 key 唯一**
2. **filterable 下拉与 clearable 一起用非常顺手**
3. **枚举映射 + v-for + :key = value 是标准写法**
4. **禁用选项不要做默认值**
5. **表单校验依然使用 prop 绑定 form 字段**

------

## 6. DatePicker 时间选择

## 6.1 单个时间选择

### 🎯 目标效果

- 单个日期或日期时间选择
- 可以自定义显示格式
- 可以绑定后端接口标准格式（如 `yyyy-MM-dd HH:mm:ss`）

------

### ✅ App.vue 示例：单日期 / 日期时间选择

```vue
<template>
  <el-container class="page-container">
    <el-main>
      <h3>单个时间选择</h3>

      <el-form :model="form" label-width="120px">
        <!-- 单日期 -->
        <el-form-item label="出生日期">
          <el-date-picker
            v-model="form.birthday"
            type="date"
            placeholder="请选择日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            clearable
          />
        </el-form-item>

        <!-- 日期时间 -->
        <el-form-item label="注册时间">
          <el-date-picker
            v-model="form.registerTime"
            type="datetime"
            placeholder="请选择日期时间"
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm:ss"
            clearable
          />
        </el-form-item>
      </el-form>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const form = reactive({
  birthday: '',
  registerTime: ''
})
</script>

<style scoped>
.page-container {
  padding: 16px;
}
</style>
```

------

### 📌 理论讲解

#### 1️⃣ `type`

- 常用类型：
  - `date` → 只选择日期
  - `datetime` → 日期 + 时间
  - `month` → 月
  - `year` → 年
  - `week` → 周
- 控制选择器 UI 和弹出控件

#### 2️⃣ `format` & `value-format`

| 属性           | 含义                                            |
| -------------- | ----------------------------------------------- |
| `format`       | 显示在输入框的格式（用户可读）                  |
| `value-format` | 绑定到 `v-model` 的实际值格式（通常是接口需要） |

> ⚠️ 如果不写 `value-format`，`v-model` 默认是 `Date` 对象

#### 3️⃣ `clearable`

- 右侧出现清空按钮
- 常用在搜索条件里

------

## 6.2 时间范围选择（高频使用）

### 🎯 目标效果

- 搜索区常用 “起止时间”
- 支持快捷选择（今天 / 本周 / 最近7天）
- 支持日期或日期时间范围

------

### ✅ App.vue 示例：时间范围选择

```vue
<template>
  <el-container class="page-container">
    <el-main>
      <h3>时间范围选择</h3>

      <el-form :model="form" label-width="120px">
        <el-form-item label="查询时间">
          <el-date-picker
            v-model="form.queryTime"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            clearable
            :shortcuts="shortcuts"
            style="width: 100%;"
          />
        </el-form-item>
      </el-form>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import dayjs from 'dayjs'

const form = reactive({
  queryTime: [] as string[] // 明确类型为字符串数组
})

/**
 * 快捷日期范围选项（Element Plus 写法）
 */
const shortcuts = [
  {
    text: '今天',
    value: () => {
      const start = dayjs().startOf('day').format('YYYY-MM-DD')
      const end = dayjs().endOf('day').format('YYYY-MM-DD')
      return [start, end]
    }
  },
  {
    text: '最近7天',
    value: () => {
      const start = dayjs().subtract(6, 'day').startOf('day').format('YYYY-MM-DD')
      const end = dayjs().endOf('day').format('YYYY-MM-DD')
      return [start, end]
    }
  },
  {
    text: '本月',
    value: () => {
      const start = dayjs().startOf('month').format('YYYY-MM-DD')
      const end = dayjs().endOf('month').format('YYYY-MM-DD')
      return [start, end]
    }
  }
]
</script>

<style scoped>
.page-container {
  padding: 16px;
}
</style>
```

------

### 📌 理论讲解

#### 1️⃣ `type="daterange" / "datetimerange"`

- `daterange` → 选择日期区间
- `datetimerange` → 选择日期 + 时间区间
- `v-model` 绑定 **数组** `[start, end]`

#### 2️⃣ `start-placeholder / end-placeholder`

- 分别控制开始、结束日期的占位文字
- 搜索表单 UX 必须写清楚

#### 3️⃣ `shortcuts`

- 自定义快捷选项按钮
- `text` + `value`
- 高频场景：
  - 今天 / 昨天 / 最近7天 / 本月 / 本季度

> ⚠️ 注意：
>
> - 绑定的值类型：如果写了 `value-format` → 会返回字符串
> - 如果没写 → 返回 `Date` 对象

------

## 7. Radio / Checkbox

## 7.1 el-radio-group 单选

### 🎯 目标效果

- 单选枚举
- 可选带边框按钮
- 常用场景：性别、状态、选项类型

------

### ✅ App.vue 示例：Radio 单选

```vue
<template>
  <el-container class="page-container">
    <el-main>
      <h3>Radio 单选示例</h3>

      <el-form :model="form" label-width="100px">
        <!-- 普通单选 -->
        <el-form-item label="性别">
          <el-radio-group v-model="form.gender">
            <el-radio label="male">男</el-radio>
            <el-radio label="female">女</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 带边框单选按钮 -->
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio label="1" border>启用</el-radio>
            <el-radio label="0" border>禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const form = reactive({
  gender: '',
  status: ''
})
</script>

<style scoped>
.page-container {
  padding: 16px;
}
</style>
```

------

### 📌 理论讲解

#### 1️⃣ `v-model`

- 双向绑定选中值
- `el-radio` 的 `label` 值对应 `v-model`

#### 2️⃣ `border`

- 外观带边框按钮风格
- 常用于状态 / 类型选择

#### 3️⃣ 注意事项

- `el-radio-group` 必须有 `v-model`
- 每个 `el-radio` 的 `label` 唯一
- 可与表单校验结合（`prop` + `rules`）

------

## 7.2 el-checkbox-group 多选

### 🎯 目标效果

- 多选字段
- 支持全选 / 反选
- 常用场景：权限分配、标签选择

------

### ✅ App.vue 示例：Checkbox 多选

```vue
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
```

------

### 📌 理论讲解

#### 1️⃣ `v-model`

- 多选绑定数组
- 数组内元素 = 被选中的 `label`

#### 2️⃣ 全选 / 反选逻辑

- `indeterminate` → 半选状态
- 单个选项变化时需要更新 `checkAll` 和 `indeterminate`
- 常用于权限、标签列表

#### 3️⃣ 注意事项

- `label` 唯一且对应 `v-model` 类型
- 数组操作时保持响应式，使用 `reactive` 或 `ref`
- 可结合表单校验（必选项 / 最少选项）

------

## 三、数据展示（**后台最核心**）

## 8. Table 表格（核心组件）

### 8.1 基础表格

- `:data`
- `border`
- `stripe`
- `row-key`

### 8.2 列配置

- `prop`
- `label`
- `width / min-width`
- `align`

### 8.3 插槽列（非常常用）

- 自定义展示
- 状态标签
- 操作按钮列

### 8.4 固定列 & 滚动

- `fixed="left/right"`
- 横向滚动

### 8.5 表格选择

- `type="selection"`
- 批量操作

### 8.6 空数据 & Loading

- `empty-text`
- `v-loading`

------

## 9. Pagination 分页

### 9.1 基础分页

- `current-page`
- `page-size`
- `total`

### 9.2 常用事件

- `@current-change`
- `@size-change`

### 9.3 与 Table 联动

- 后端分页
- 搜索 + 分页重置

------

## 四、反馈与交互

## 10. Dialog 弹窗（高频）

### 10.1 基础用法

- `v-model`
- `title`
- `width`

### 10.2 底部操作区

- `#footer`
- 确认 / 取消

### 10.3 表单弹窗

- 新增 / 编辑共用
- 关闭前校验

------

## 11. Drawer 抽屉

### 11.1 基础抽屉

- `v-model`
- `direction`
- `size`

### 11.2 详情页展示

- 表单只读
- 长内容滚动

------

## 12. Message / MessageBox

### 12.1 Message

- 成功 / 警告 / 错误提示
- 接口返回统一提示

### 12.2 MessageBox

- 删除确认
- 危险操作二次确认

------

## 13. Loading

### 13.1 指令方式

- `v-loading`

### 13.2 全屏 Loading

- 请求期间锁屏

------

## 五、导航与页面结构

## 14. Menu 菜单

### 14.1 基础菜单

- `el-menu`
- `el-menu-item`
- `el-sub-menu`

### 14.2 常用配置

- `default-active`
- `router`
- `collapse`

------

## 15. Tabs 标签页

### 15.1 基础 Tabs

- `v-model`
- `el-tab-pane`

### 15.2 常见场景

- 多状态切换
- 列表分类

------

## 六、其他高频组件

## 16. Tag 标签

### 16.1 状态展示

- `type`
- `effect`

### 16.2 可关闭

- `closable`
- `@close`

------

## 17. Button 按钮（组合使用）

### 17.1 常用类型

- `type`
- `plain`
- `link`

### 17.2 Loading 状态

- `:loading`

### 17.3 权限控制（逻辑层）

- 是否渲染
- 是否禁用

------

## 18. Tooltip / Popover

### 18.1 Tooltip

- 文本溢出提示
- 图标说明

### 18.2 Popover

- 更多操作
- 二级确认

------

## 七、组合型高频场景（真实项目）

## 19. 搜索表单 + 表格 + 分页（最常见）

### 19.1 搜索区域

- 内联表单
- 展开 / 收起

### 19.2 表格联动

- 搜索重置分页
- Loading 状态

------

## 20. 新增 / 编辑弹窗模式

### 20.1 表单复用

- 同一个 Form
- 根据模式切换标题

### 20.2 提交与校验

- 前端校验
- 接口成功后关闭

------

## 21. 详情页模式

### 21.1 描述型展示

- 表单禁用
- Label + Value

### 21.2 抽屉 / 弹窗查看

- 不影响列表操作

------

### 下一步建议（你可以直接选）

你可以直接告诉我：

- **“从 Table 开始，给我完整 App.vue 示例”**
- **“先做 搜索 + 表格 + 分页 组合”**
- **“按这个大纲，逐个组件补完整示例代码”**

我会**严格按这个大纲**，每个组件给你一个**可直接复制运行的 App.vue 示例**，并且用 **TypeScript + Element Plus 2.13 的最佳实践写法**。