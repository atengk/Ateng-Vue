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

## 8.1 基础表格

### 🎯 目标效果

- 渲染表格数据
- 带边框 / 斑马纹
- 指定 `row-key` 保持行唯一性

------

### ✅ App.vue 示例：基础表格

```vue
<template>
  <el-container class="page-container">
    <el-main>
      <h3>基础表格示例</h3>

      <el-table
        :data="tableData"
        border
        stripe
        style="width: 100%"
        row-key="id"
      >
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="name" label="姓名" min-width="120" />
        <el-table-column prop="email" label="邮箱" min-width="200" />
        <el-table-column prop="status" label="状态" width="100" />
      </el-table>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const tableData = reactive([
  { id: 1, name: '张三', email: 'zhangsan@example.com', status: '启用' },
  { id: 2, name: '李四', email: 'lisi@example.com', status: '禁用' },
  { id: 3, name: '王五', email: 'wangwu@example.com', status: '启用' }
])
</script>

<style scoped>
.page-container {
  padding: 16px;
}
</style>
```

------

### 📌 理论讲解

1. **`:data`** → 表格数据数组
2. **`border`** → 显示边框
3. **`stripe`** → 斑马纹
4. **`row-key`** → 每行唯一标识（必填，保证排序 / 选择 / 滚动正确）

------

## 8.2 列配置

- 控制列显示内容、宽度、对齐

```vue
<el-table-column prop="email" label="邮箱" min-width="200" align="center" />
```

- **prop** → 对应数据字段
- **label** → 列标题
- **width / min-width** → 固定或最小宽度
- **align** → 左 / 中 / 右对齐

------

## 8.3 插槽列（自定义渲染，非常常用）

- 自定义单元格内容
- 状态标签
- 操作按钮

```vue
<el-table-column label="状态" width="100">
  <template #default="{ row }">
    <el-tag type="success" v-if="row.status === '启用'">启用</el-tag>
    <el-tag type="info" v-else>禁用</el-tag>
  </template>
</el-table-column>

<el-table-column label="操作" width="160">
  <template #default="{ row }">
    <el-button type="primary" size="small" @click="editRow(row)">编辑</el-button>
    <el-button type="danger" size="small" @click="deleteRow(row)">删除</el-button>
  </template>
</el-table-column>
```

------

## 8.4 固定列 & 横向滚动

```vue
<el-table
  :data="tableData"
  style="width: 800px"
  height="300"
  border
  stripe
>
  <el-table-column fixed="left" prop="id" label="ID" width="60" />
  <el-table-column prop="name" label="姓名" width="120" />
  <el-table-column prop="email" label="邮箱" width="200" />
  <el-table-column prop="status" label="状态" width="100" />
  <el-table-column fixed="right" label="操作" width="160">
    <template #default="{ row }">
      <el-button size="small">查看</el-button>
    </template>
  </el-table-column>
</el-table>
```

- **fixed="left/right"** → 固定列
- **横向滚动** → 当总宽度大于容器时自动出现滚动条
- **height** → 指定表格高度可实现纵向滚动

------

## 8.5 表格选择（批量操作）

```vue
<el-table
  :data="tableData"
  border
  stripe
  row-key="id"
  @selection-change="handleSelectionChange"
>
  <el-table-column type="selection" width="55" />
  <el-table-column prop="name" label="姓名" />
  <el-table-column prop="email" label="邮箱" />
</el-table>

<el-button type="primary" @click="batchDelete">批量删除</el-button>
import { ref } from 'vue'

const selectedRows = ref<any[]>([])

const handleSelectionChange = (rows: any[]) => {
  selectedRows.value = rows
}

const batchDelete = () => {
  if (!selectedRows.value.length) return alert('请选择记录')
  alert('删除: ' + JSON.stringify(selectedRows.value))
}
```

- **type="selection"** → 显示复选框
- **@selection-change** → 获取选中行
- 可配合批量操作按钮

------

## 8.6 空数据 & Loading

```vue
<el-table
  :data="emptyData"
  border
  stripe
  empty-text="暂无数据"
  v-loading="loading"
  style="width: 100%"
>
  <el-table-column prop="name" label="姓名" />
  <el-table-column prop="email" label="邮箱" />
</el-table>
const emptyData: any[] = []
const loading = ref(false)
```

- **empty-text** → 自定义空数据提示
- **v-loading** → 表格加载中效果

------

## 9. Pagination 分页

## 9.1 基础分页

### 🎯 目标效果

- 显示页码
- 每页条数
- 总条数

------

### ✅ App.vue 示例：基础分页

```vue
<template>
  <el-container class="page-container">
    <el-main>
      <h3>基础分页示例</h3>

      <el-pagination
        v-model:current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        layout="prev, pager, next, jumper, ->, total"
      />
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(95) // 总条数
</script>

<style scoped>
.page-container {
  padding: 16px;
}
</style>
```

------

### 📌 理论讲解

1. **`current-page` / `v-model:current-page`**
   - 当前页码
   - 与后台请求页码绑定
2. **`page-size`**
   - 每页显示条数
   - 可配合 `@size-change` 动态修改
3. **`total`**
   - 总条数，用于计算页数
4. **`layout`**
   - 控制分页组件布局
   - 常用组合：
     - `prev, pager, next, jumper` → 前一页 / 页码 / 下一页 / 页码跳转
     - `->, total` → 右对齐显示总条数

------

## 9.2 常用事件

```vue
<el-pagination
  v-model:current-page="currentPage"
  :page-size="pageSize"
  :total="total"
  @current-change="handleCurrentChange"
  @size-change="handleSizeChange"
  layout="prev, pager, next, sizes, ->, total"
  :page-sizes="[10, 20, 50, 100]"
/>
const handleCurrentChange = (page: number) => {
  currentPage.value = page
  fetchTableData()
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1 // 页大小改变后重置页码
  fetchTableData()
}

// 模拟接口请求
const fetchTableData = () => {
  console.log('请求数据：页码', currentPage.value, '条数', pageSize.value)
}
```

------

### 📌 理论讲解

1. **`@current-change`** → 页码改变时触发
2. **`@size-change`** → 每页条数改变时触发
3. **重置页码**
   - 搜索条件改变或 pageSize 改变时，通常重置 `currentPage = 1`
   - 避免页码越界或查询结果不正确
4. **`page-sizes`**
   - 可配置用户可选的每页条数数组
   - 常用 `[10, 20, 50, 100]`

------

## 9.3 与 Table 联动（高频实战）

```vue
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
```

------

### 📌 理论讲解

1. **搜索 + 分页**
   - 搜索条件改变时 → `currentPage = 1`
   - 分页组件会触发 `@current-change` 重新拉取数据
2. **后端分页**
   - 后端返回总条数 `total`
   - 分页组件根据 `page-size` 计算页数
3. **前端分页**
   - 可以用 `slice()` 截取数据
   - `total` = 数据长度
4. **表格 + 复选框**
   - 批量操作 + 分页结合 → 需要考虑跨页选择逻辑

## 9.4 跨页选择

```vue
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
```

### 📌 理论讲解

1. **为什么默认不支持跨页选择**
   - `el-table` 的选中状态只和当前 `data` 绑定
   - 翻页后 `data` 变化，选中状态会被重置
2. **核心解决思路**
   - 将选中状态从 `el-table` 内部提升到业务层
   - 使用 `Map / Set` 以 `row-key` 作为唯一标识保存选中数据
3. **关键实现点**
   - `row-key` 必须唯一且稳定
   - 翻页加载数据后，手动回显当前页的选中状态
   - 恢复选中过程中，忽略 `selection-change` 事件
4. **为什么要使用恢复标识**
   - 翻页时 `el-table` 会自动触发一次 `selection-change`
   - 若不拦截，会误删其他页的选中数据
5. **适用场景**
   - 批量操作（删除、导出、审批）
   - 后端分页数据
   - 大数据列表（推荐只保存 ID）

------

## 四、反馈与交互

## 10. Dialog 弹窗（高频）

## 10.1 基础用法

### 🎯 使用场景

- 简单提示弹窗
- 信息展示
- 作为新增 / 编辑的容器

------

### ✅ App.vue 示例：基础 Dialog

```vue
<template>
  <el-container class="page-container">
    <el-main>
      <el-button type="primary" @click="dialogVisible = true">
        打开弹窗
      </el-button>

      <el-dialog
        v-model="dialogVisible"
        title="基础弹窗"
        width="500px"
      >
        <p>这是一个最基础的 Dialog 示例</p>
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const dialogVisible = ref(false)
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

- 控制弹窗显示 / 隐藏
- **必须是 boolean**
- 关闭弹窗时会自动变为 `false`

#### 2️⃣ `title`

- 弹窗标题
- 可动态绑定（新增 / 编辑切换）

#### 3️⃣ `width`

- 常用：`400px / 500px / 600px / 60%`
- 后台表单一般 **不要太窄**

------

## 10.2 底部操作区（footer 插槽）

### 🎯 使用场景

- 确认 / 取消按钮
- 提交表单
- 自定义操作区布局

------

### ✅ App.vue 示例：自定义 Footer

```vue
<el-dialog
  v-model="dialogVisible"
  title="带底部操作的弹窗"
  width="500px"
>
  <p>这里是弹窗内容</p>

  <template #footer>
    <span class="dialog-footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="handleConfirm">
        确认
      </el-button>
    </span>
  </template>
</el-dialog>
const handleConfirm = () => {
  console.log('点击确认')
  dialogVisible.value = false
}
```

------

### 📌 理论讲解

1. **`#footer` 插槽**
   - 完全接管底部区域
   - 官方按钮样式只是默认实现，**真实项目几乎都会自定义**
2. **按钮行为**
   - 取消：直接关闭弹窗
   - 确认：一般触发表单校验或接口请求
3. **常见样式**
   - 按钮右对齐（Element Plus 默认）
   - 主按钮 `type="primary"`

------

## 10.3 表单弹窗（新增 / 编辑共用，核心）

这是 **最重要的一节**。

### 🎯 目标效果

- 同一个 Dialog
- 同一份 Form
- 支持 **新增 / 编辑**
- 关闭前校验表单

------

### ✅ App.vue 示例：表单 Dialog（完整实战）

```vue
<template>
  <el-container class="page-container">
    <el-main>
      <el-button type="primary" @click="openAdd">新增</el-button>
      <el-button @click="openEdit">编辑</el-button>

      <el-dialog
          v-model="dialogVisible"
          :title="dialogTitle"
          width="600px"
          :before-close="handleBeforeClose"
      >
        <el-form
            ref="formRef"
            :model="form"
            :rules="rules"
            label-width="100px"
        >
          <el-form-item label="姓名" prop="name">
            <el-input v-model="form.name" />
          </el-form-item>

          <el-form-item label="邮箱" prop="email">
            <el-input v-model="form.email" />
          </el-form-item>
        </el-form>

        <template #footer>
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm">
            确认
          </el-button>
        </template>
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import {ref, reactive, nextTick} from 'vue'
import type { FormInstance, FormRules } from 'element-plus'

/** 弹窗状态 */
const dialogVisible = ref(false)
const dialogTitle = ref('')

/** 表单 */
const formRef = ref<FormInstance>()
const form = reactive({
  name: '',
  email: ''
})

/** 校验规则 */
const rules: FormRules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }]
}

/** 新增 */
const openAdd = async () => {
  dialogTitle.value = '新增用户'
  dialogVisible.value = true

  await nextTick()
  formRef.value?.resetFields()
}

/** 编辑 */
const openEdit = () => {
  dialogTitle.value = '编辑用户'
  form.name = '张三'
  form.email = 'zhangsan@example.com'
  dialogVisible.value = true
}

/** 提交 */
const submitForm = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    console.log('提交数据', form)
    dialogVisible.value = false
  } catch (err) {
    // 校验失败是正常业务，不要抛错
    console.warn('表单校验未通过', err)
  }
}

/** 关闭前校验 */
const handleBeforeClose = (done: () => void) => {
  // 这里可以弹确认框
  done()
}
</script>

<style scoped>
.page-container {
  padding: 16px;
}
</style>
```

------

### 📌 理论讲解（重点）

#### 1️⃣ 新增 / 编辑共用逻辑

- **新增**
  - 重置表单
  - title = 新增
- **编辑**
  - 回填数据
  - title = 编辑

> ⚠️ 真实项目：
> **不要复制两个 Dialog！一定要共用**

------

#### 2️⃣ 表单校验

- `formRef.validate()` → 校验通过才提交
- 校验失败会自动高亮错误项

------

#### 3️⃣ `before-close`（非常重要）

- 弹窗关闭前钩子
- 常用于：
  - 提示“是否确认关闭”
  - 阻止未保存数据丢失

```ts
const handleBeforeClose = (done) => {
  // confirm 弹窗
  done()
}
```

------

#### 4️⃣ 常见注意事项（项目经验）

✅ **关闭弹窗时是否重置表单**

- 新增：一定要 reset
- 编辑：视情况

✅ **表单 ref**

- 一定要 `ref<FormInstance>()`
- TS 项目必做

✅ **不要用 v-if 包 el-dialog**

- 会导致表单 ref 丢失
- 推荐用 `v-model` 控制显示

------

## 11. Drawer 抽屉

## 11.1 基础抽屉

### 🎯 使用场景

- 侧滑面板
- 不希望遮挡整个页面（对比 Dialog）
- 编辑 / 设置 / 快速操作

------

### ✅ App.vue 示例：基础 Drawer

```vue
<template>
  <el-container class="page-container">
    <el-main>
      <el-button type="primary" @click="drawerVisible = true">
        打开抽屉
      </el-button>

      <el-drawer
        v-model="drawerVisible"
        title="基础抽屉"
        direction="rtl"
        size="400px"
      >
        <p>这是一个基础 Drawer 示例</p>
      </el-drawer>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const drawerVisible = ref(false)
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

- 控制 Drawer 显示 / 隐藏
- 类型：`boolean`
- 关闭时自动变为 `false`

#### 2️⃣ `direction`

- 抽屉出现方向：
  - `rtl` → 右侧（最常用）
  - `ltr` → 左侧
  - `ttb` → 顶部
  - `btt` → 底部

> ✅ 后台系统 **90% 使用 `rtl`**

#### 3️⃣ `size`

- 抽屉宽度 / 高度
- 常用：
  - `300px / 400px / 500px`
  - `30% / 40%`

------

## 11.2 详情页展示（高频实战）

### 🎯 目标效果

- 点击表格“查看”
- 抽屉展示详情
- 表单 **只读**
- 内容超出可滚动

------

### ✅ App.vue 示例：详情 Drawer（推荐用法）

```vue
<template>
  <el-container class="page-container">
    <el-main>
      <el-button @click="openDetail">查看详情</el-button>

      <el-drawer
        v-model="drawerVisible"
        title="用户详情"
        direction="rtl"
        size="500px"
      >
        <el-form
          :model="detail"
          label-width="100px"
          class="detail-form"
        >
          <el-form-item label="姓名">
            <el-input v-model="detail.name" disabled />
          </el-form-item>

          <el-form-item label="邮箱">
            <el-input v-model="detail.email" disabled />
          </el-form-item>

          <el-form-item label="简介">
            <el-input
              v-model="detail.desc"
              type="textarea"
              :rows="6"
              disabled
            />
          </el-form-item>
        </el-form>
      </el-drawer>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

const drawerVisible = ref(false)

const detail = reactive({
  name: '',
  email: '',
  desc: ''
})

const openDetail = () => {
  // 模拟接口返回
  detail.name = '张三'
  detail.email = 'zhangsan@example.com'
  detail.desc =
    '这里是用户简介内容，通常会比较长。'.repeat(10)

  drawerVisible.value = true
}
</script>

<style scoped>
.page-container {
  padding: 16px;
}

/* 内容过长时滚动 */
.detail-form {
  padding-right: 16px;
}
</style>
```

------

### 📌 理论讲解（重点）

#### 1️⃣ Drawer vs Dialog（选型建议）

| 场景        | 推荐   |
| ----------- | ------ |
| 新增 / 编辑 | Dialog |
| 查看详情    | Drawer |
| 辅助操作    | Drawer |
| 强打断用户  | Dialog |

------

#### 2️⃣ 表单只读实现方式（推荐）

✅ **最简单稳定**

```vue
<el-input disabled />
```

❌ 不推荐：

- 自己写 div + span（样式不统一）
- 条件渲染两套模板

------

#### 3️⃣ 长内容滚动

- Drawer 默认内容区可滚动
- 表单内容建议：
  - 使用 `textarea`
  - 合理 `rows`
  - 留右侧 padding，避免滚动条压内容

------

#### 4️⃣ 实际项目常见增强点

- 顶部放状态 Tag
- 底部固定操作按钮（查看 → 编辑）
- Drawer 内嵌 Table / Timeline

------

### ⚠️ 常见坑 & 注意事项

1. **不要频繁销毁 Drawer**
   - 不用 `v-if`
   - 用 `v-model` 控制
2. **表单只读 ≠ disabled 整个 form**
   - 单项 disabled 更灵活
3. **抽屉太宽**
   - 会影响主页面感知
   - 一般不超过 40%

------

## 12. Message / MessageBox

## 12.1 Message（轻量提示）

### 🎯 使用场景

- 操作成功 / 失败提示
- 接口返回统一提示
- 非阻断式反馈（不打断用户）

------

### ✅ App.vue 示例：基础 Message

```vue
<template>
  <el-container class="page-container">
    <el-main>
      <el-button type="success" @click="showSuccess">
        成功
      </el-button>

      <el-button type="warning" @click="showWarning">
        警告
      </el-button>

      <el-button type="danger" @click="showError">
        错误
      </el-button>

      <el-button type="primary" @click="showWithVariable">
        变量提示
      </el-button>

      <el-button @click="showGroup">
        分组消息合并
      </el-button>

      <el-button @click="showSingle">
        防重复提示
      </el-button>

      <el-button @click="mockRequest">
        接口场景
      </el-button>

      <el-button :disabled="disabled" @click="handleClick">
        幂等按钮
      </el-button>

    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import {ref} from "vue";

/**
 * 基础成功提示
 */
const showSuccess = () => {
  ElMessage.success({
    message: '操作成功',
    showClose: true
  })
}

/**
 * 基础警告提示
 */
const showWarning = () => {
  ElMessage.warning({
    message: '请注意输入内容',
    showClose: true
  })
}

/**
 * 基础错误提示
 */
const showError = () => {
  ElMessage.error({
    message: '操作失败',
    showClose: true
  })
}

/**
 * 变量提示（高频）
 */
const showWithVariable = () => {
  const userName = '张三'
  const count = 3

  ElMessage.success({
    message: `用户 ${userName} 操作成功，共处理 ${count} 条数据`,
    showClose: true
  })
}

/**
 * 分组消息合并
 */
const showGroup = () => {
  ElMessage({
    message: '分组消息合并提示.',
    grouping: true,
    type: 'success',
  })
}

/**
 * 防止多次点击提示堆叠
 */
const showSingle = () => {
  ElMessage.closeAll()
  ElMessage.info({
    message: '当前只显示一条提示',
    duration: 2000
  })
}

/**
 * 模拟接口请求场景（成功 / 失败）
 */
const mockRequest = async () => {
  try {
    ElMessage.info({
      message: '正在提交...',
      duration: 1000
    })

    // 模拟接口延迟
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        Math.random() > 0.5 ? resolve(true) : reject(new Error())
      }, 1200)
    })

    ElMessage.success({
      message: '提交成功',
      showClose: true
    })
  } catch {
    ElMessage.error({
      message: '提交失败，请重试',
      showClose: true
    })
  }
}

const disabled = ref(false)
const handleClick = () => {
  if (disabled.value) return

  disabled.value = true
  ElMessage.success('操作生效')

  setTimeout(() => {
    disabled.value = false
  }, 1000)
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

#### 1️⃣ Message 的特点

- 非模态（不会阻断操作）
- 自动消失
- 适合**结果反馈**

#### 2️⃣ 常用类型

| 方法                | 场景            |
| ------------------- | --------------- |
| `ElMessage.success` | 新增 / 保存成功 |
| `ElMessage.warning` | 参数不合法      |
| `ElMessage.error`   | 接口异常        |
| `ElMessage.info`    | 普通提示        |

------

## 12.1（进阶）接口返回统一提示（非常常用）

```ts
const handleApiResponse = (res: { code: number; msg: string }) => {
  if (res.code === 0) {
    ElMessage.success(res.msg || '操作成功')
  } else {
    ElMessage.error(res.msg || '操作失败')
  }
}
```

📌 实战经验：

- **不要在每个页面都写一堆 Message**
- 一般在：
  - 请求拦截器
  - 业务统一方法
  - 提交成功回调
- 集中处理提示逻辑

------

## 12.2 MessageBox（确认框）

### 🎯 使用场景

- 删除确认
- 危险操作二次确认
- 防误操作

------

### ✅ App.vue 示例：删除确认（Promise 风格）

```vue
<template>
  <el-container class="page-container">
    <el-main>
      <el-button type="danger" @click="handleDelete">
        删除
      </el-button>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { ElMessageBox, ElMessage } from 'element-plus'

const handleDelete = async () => {
  try {
    await ElMessageBox.confirm(
      '此操作将永久删除该数据，是否继续？',
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    // 确认后执行
    ElMessage.success('删除成功')
  } catch {
    // 取消不需要提示
  }
}
</script>
```

------

### 📌 理论讲解

#### 1️⃣ `ElMessageBox.confirm`

- 返回 Promise
- 用户点击：
  - 确认 → resolve
  - 取消 / 关闭 → reject

#### 2️⃣ 常用参数

| 参数                | 说明                     |
| ------------------- | ------------------------ |
| `message`           | 提示内容                 |
| `title`             | 标题                     |
| `type`              | `warning / error / info` |
| `confirmButtonText` | 确认按钮文字             |
| `cancelButtonText`  | 取消按钮文字             |

------

## 12.2（进阶）危险操作二次确认

```ts
const handleDanger = async () => {
  try {
    await ElMessageBox.confirm(
      '该操作不可恢复，是否确认执行？',
      '高危操作',
      {
        type: 'error',
        confirmButtonText: '我已确认',
        cancelButtonText: '取消',
        closeOnClickModal: false
      }
    )
    ElMessage.success('操作已执行')
  } catch {}
}
```

📌 项目经验：

- **危险操作一定禁止点击遮罩关闭**

  ```ts
  closeOnClickModal: false
  ```

- 确认按钮文案要 **明确责任**

------

## 12.3 Message vs MessageBox（选型总结）

| 场景         | 推荐       |
| ------------ | ---------- |
| 操作结果反馈 | Message    |
| 是否继续？   | MessageBox |
| 删除 / 清空  | MessageBox |
| 成功 / 失败  | Message    |

------

### ⚠️ 常见坑 & 注意事项

1. **MessageBox 不要滥用**
   - 会打断用户流程
2. **取消操作不要提示“已取消”**
   - 会显得啰嗦
3. **接口异常**
   - 网络错误 → Message.error
   - 业务失败 → Message.warning / error

------

## 14. Notification 通知

## 14.1 基础通知

### 🎯 使用场景

- 系统级提示
- 后台任务完成通知
- 非当前操作触发的反馈

> 和 Message 的核心区别：
> **Notification 更“全局”，存在时间更长，不打断用户**

------

### ✅ App.vue 示例：基础 Notification

```vue
<template>
  <el-container class="page-container">
    <el-main>
      <el-button type="primary" @click="notifySuccess">
        成功通知
      </el-button>
      <el-button type="warning" @click="notifyWarning">
        警告通知
      </el-button>
      <el-button type="danger" @click="notifyError">
        错误通知
      </el-button>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { ElNotification } from 'element-plus'

const notifySuccess = () => {
  ElNotification({
    title: '成功',
    message: '数据已成功同步',
    type: 'success'
  })
}

const notifyWarning = () => {
  ElNotification({
    title: '警告',
    message: '部分数据未同步',
    type: 'warning'
  })
}

const notifyError = () => {
  ElNotification({
    title: '错误',
    message: '同步失败，请稍后重试',
    type: 'error'
  })
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

#### 1️⃣ Notification 特点

- 出现在页面角落（默认右上）
- 不阻断用户操作
- 显示时间比 Message 长
- 适合 **“你不一定立刻处理，但需要知道” 的信息**

#### 2️⃣ 常用类型

| type    | 使用场景     |
| ------- | ------------ |
| success | 后台任务完成 |
| warning | 异常但可继续 |
| error   | 系统级错误   |
| info    | 普通通知     |

------

## 14.2 常用配置参数（高频）

```ts
ElNotification({
  title: '任务完成',
  message: '导出任务已完成，请前往下载中心',
  type: 'success',
  duration: 4500,
  position: 'top-right',
  showClose: true
})
```

### 📌 参数说明

| 参数        | 说明               |
| ----------- | ------------------ |
| `title`     | 标题               |
| `message`   | 内容               |
| `type`      | 通知类型           |
| `duration`  | 自动关闭时间（ms） |
| `position`  | 出现位置           |
| `showClose` | 是否显示关闭按钮   |

------

## 14.3 手动关闭 / 持久通知

### 🎯 使用场景

- 必须用户明确知晓
- 系统异常 / 权限问题

------

### ✅ 示例：不会自动关闭的通知

```ts
ElNotification({
  title: '系统异常',
  message: '检测到异常状态，请立即处理',
  type: 'error',
  duration: 0 // 不自动关闭
})
```

📌 项目经验：

- `duration = 0` → 必须手动关闭
- **只用于重要通知，不能滥用**

------

## 14.4 Notification vs Message（关键区别）

| 维度     | Message  | Notification |
| -------- | -------- | ------------ |
| 出现位置 | 页面中间 | 页面角落     |
| 是否阻断 | 否       | 否           |
| 显示时间 | 短       | 长           |
| 适合场景 | 操作反馈 | 系统通知     |

✅ **简单规则**：

- 点击按钮后的结果 → **Message**
- 后台事件 / 系统状态 → **Notification**

------

## 14.5 实际项目高频场景示例

### 1️⃣ 导出完成通知

```ts
ElNotification({
  title: '导出完成',
  message: '文件已生成，可前往下载',
  type: 'success'
})
```

### 2️⃣ 权限变更通知

```ts
ElNotification({
  title: '权限变更',
  message: '你的权限已发生变更，请重新登录',
  type: 'warning',
  duration: 0
})
```

### 3️⃣ WebSocket / SSE 推送

- 新任务
- 新消息
- 审批结果

> Notification 是这类 **异步推送** 的最佳展示方式

------

## 14.6 常见坑 & 使用规范

### ⚠️ 常见问题

1. **Notification 太多**
   - 会堆满右上角
   - 用户会忽略
2. **和 Message 混用**
   - 场景不清晰，体验混乱

------

### ✅ 推荐规范（非常实用）

- 用户主动操作结果 → Message
- 系统异步 / 被动结果 → Notification
- 高危 / 必须确认 → MessageBox

------

## 13. Loading

## 13.1 指令方式（`v-loading`）

### 🎯 使用场景

- 表格加载
- 表单提交中
- 局部区域加载（推荐）

------

### ✅ App.vue 示例：局部 Loading（最常用）

```vue
<template>
  <el-container class="page-container">
    <el-main>
      <el-button type="primary" @click="loadData">
        加载数据
      </el-button>

      <el-table
        :data="tableData"
        border
        stripe
        v-loading="loading"
        style="margin-top: 16px;"
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="姓名" />
      </el-table>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const loading = ref(false)
const tableData = ref<any[]>([])

const loadData = () => {
  loading.value = true
  setTimeout(() => {
    tableData.value = [
      { id: 1, name: '张三' },
      { id: 2, name: '李四' }
    ]
    loading.value = false
  }, 1500)
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

#### 1️⃣ `v-loading`

- Element Plus 提供的 **指令**
- 值为 `boolean`
- `true` → 显示 Loading
- `false` → 隐藏 Loading

#### 2️⃣ 推荐使用位置

✅ 表格
✅ 表单容器
✅ Card / 区块容器

❌ 整个页面随便套（会影响体验）

------

### 📌 常用修饰参数（了解即可）

```vue
<div
  v-loading="loading"
  element-loading-text="加载中..."
  element-loading-background="rgba(255,255,255,0.8)"
>
```

- `element-loading-text` → 提示文字
- `element-loading-background` → 背景遮罩

------

## 13.2 全屏 Loading（请求期间锁屏）

### 🎯 使用场景

- 登录
- 系统初始化
- 高危 / 长耗时操作
- 全局接口拦截

------

### ✅ App.vue 示例：全屏 Loading

```vue
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
```

------

### 📌 理论讲解

#### 1️⃣ `ElLoading.service`

- 返回一个 Loading 实例
- **必须手动 `close()`**

#### 2️⃣ 常用参数

| 参数         | 说明                  |
| ------------ | --------------------- |
| `lock`       | 是否锁屏              |
| `text`       | 提示文本              |
| `background` | 遮罩层背景            |
| `fullscreen` | 是否全屏（默认 true） |

------

## 13.2（进阶）配合接口请求（真实项目）

```ts
let loadingInstance: any

const startLoading = () => {
  loadingInstance = ElLoading.service({ lock: true })
}

const endLoading = () => {
  loadingInstance?.close()
}
```

📌 常见做法：

- **请求开始** → `startLoading`
- **请求结束 / 异常** → `endLoading`
- 推荐放在：
  - axios 拦截器
  - 全局请求封装

------

## 13.3 Loading 使用规范（非常重要）

### ✅ 推荐

- 列表 → **表格 Loading**
- 表单提交 → **按钮 Loading / 局部 Loading**
- 系统级操作 → **全屏 Loading**

### ❌ 不推荐

- 每个请求都全屏 Loading
- Loading 时间 < 300ms 也强制显示（会闪）

------

## 13.4 常见坑 & 注意事项

1. **忘记 close()**
   - 页面会被永久锁死
2. **多次调用**
   - 需要统一管理 Loading 实例
3. **全屏 Loading + Dialog**
   - 注意遮罩层层级问题

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

