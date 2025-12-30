# Element Plus

Element Plus 是一套基于 Vue 3 的企业级 UI 组件库，由 Element UI 升级而来，采用 TypeScript 开发，风格简洁、组件丰富，适合中后台系统快速搭建。

它支持按需引入、主题定制和良好的类型提示，生态成熟，与 Vite、Pinia 等现代前端工具高度契合，能有效提升开发效率与代码质量。

官网地址：[https://element-plus.org](https://element-plus.org/)



## 基础配置

安装 element-plus 包

```
pnpm install element-plus@2.13.0 @element-plus/icons-vue@2.3.2 --filter @apps/element-plus
```

按需引入包

```
pnpm install unplugin-vue-components@30.0.0 unplugin-auto-import@20.3.0 --filter @apps/element-plus
```

---

## Element Plus 在整体架构中的角色定位

在 **Vue3 + TypeScript** 的工程体系中，Element Plus 的定位必须足够清晰，否则项目规模一旦上来，就会迅速陷入**组件滥用、样式失控、逻辑耦合**的问题。

一句话原则先给出来：

> **Element Plus 是 UI 基础设施，而不是业务能力提供者。**

------

### UI 框架的职责边界

在工程层面，UI 框架必须有非常明确的“能做什么 / 不能做什么”。

#### 只负责的事情（必须做、且只做到这里）

##### 基础交互能力

- 表单容器与基础控件
  - 输入框、选择器、单选、多选
- 弹窗与抽屉
  - 打开 / 关闭 / 遮罩 / 层级
- 表格与列表
  - 行列渲染、滚动、固定列
- 基础反馈
  - Message、Notification、Loading

> 这些能力**不涉及任何业务语义**，只解决「怎么交互」。

##### 视觉一致性

- 主题色、辅助色
- 字号、行高、间距
- 禁用 / 激活 / 错误状态
- Hover / Focus 等交互状态

Element Plus 在这里的价值是：

> **让整个系统“看起来像一个系统”**

而不是让页面“功能更强”。

------

#### 不负责的事情（原则上禁止）

下面这些事情，只要一旦出现在 Element Plus 组件使用层，就说明**架构已经开始变形**。

##### 业务逻辑

错误示例（概念）：

- 在 `ElDialog` 里写保存逻辑
- 在 `ElTable` 插槽中处理业务判断
- 在 `ElButton` 点击事件中直接调用接口并拼参数

UI 框架 **只关心交互，不关心业务结果**。

------

##### 接口封装

错误倾向：

- 表格组件内部直接发请求
- 表单组件直接 import request

正确做法：

- UI 层只接收：
  - `loading`
  - `data`
  - `onSubmit`
- 请求逻辑永远在 **业务层 / hooks 层**

------

##### 权限判断

典型错误：

- 在模板中大量出现
  `v-if="hasPermission('xxx')"`

Element Plus 不应该知道：

- 谁能点这个按钮
- 这个按钮为什么不能点

权限应该在：

- 指令层
- 业务组件层
- 菜单 / 路由控制层

------

##### 数据加工

错误示例：

- 在表格列中格式化复杂字段
- 在表单组件中拼装提交参数
- 在 UI 组件中做字段映射

UI 层只接收 **已经准备好的数据**。

------

### Element Plus ≠ 业务组件库

这是很多项目后期崩盘的根源。

#### 正确理解 Element Plus 的层级

在一个合理的前端架构中，层级应该是这样的：

```
业务页面（views）
   ↓
业务组件（components/business）
   ↓
基础组件（components/base）
   ↓
Element Plus
```

Element Plus **永远不应该被业务页面直接大量使用**。

------

#### Element Plus 是「基础 UI 层」

它解决的是：

- “这个按钮长什么样”
- “这个弹窗怎么弹”
- “这个表格怎么渲染”

它**不解决**：

- “这是新增还是编辑”
- “点确定后该干嘛”
- “这个表单代表什么业务含义”

------

#### 业务组件必须包一层

这是**硬性工程规范，不是建议**。

##### 为什么必须包？

1. **隔离 UI 框架变更风险**
   - Element Plus 升级
   - API 调整
   - 样式变量变化
2. **统一行为**
   - 表单提交方式
   - 弹窗关闭规则
   - 表格分页策略
3. **提升可维护性**
   - 页面更干净
   - 逻辑集中
   - 复用成本低

------

#### 禁止在业务页面直接堆 Element Plus 原子组件

以下行为在工程层面应该被视为 **反模式**：

- 一个 `view` 里出现大量：
  - `ElForm`
  - `ElFormItem`
  - `ElTable`
  - `ElDialog`
- 页面模板 300+ 行，全是 UI 细节
- 一个页面复制到另一个页面只能“整体复制”

正确的业务页面应该是：

- 结构清晰
- 语义明确
- 更像“拼装”，而不是“手写 UI”

------

## Element Plus 的工程化接入方式

这一部分关注的是：
**如何把 Element Plus 当成“基础设施”安全、可控地接进工程中**。

------

### 依赖安装与版本策略

#### 基础依赖

```bash
pnpm add element-plus @element-plus/icons-vue
```

> 不推荐 npm / yarn 混用，Vite 项目优先 pnpm。

------

#### 版本锁定策略（非常重要）

在 `package.json` 中，**避免使用模糊版本号**：

```json
{
  "dependencies": {
    "element-plus": "2.7.8",
    "@element-plus/icons-vue": "2.3.1"
  }
}
```

**不推荐**：

```json
"element-plus": "^2.7.8"
```

原因：

- Element Plus 属于 **强 UI 依赖**
- 小版本升级可能：
  - 改样式变量
  - 改默认行为
  - 改 TS 类型

> **UI 框架升级必须是“主动行为”**

------

### 全局注册策略（克制使用）

这一点是很多项目一开始就走歪的地方。

------

### 全量引入 vs 按需引入

#### 结论先行（Vite 项目）

> **Vite + Element Plus 默认就是按需 Tree Shaking，不需要额外插件**

------

#### 全量引入（不推荐，但要知道）

```ts
// main.ts
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import App from './App.vue'

const app = createApp(App)

app.use(ElementPlus)
app.mount('#app')
```

**问题：**

- 所有组件都可用，容易被滥用
- 业务页面直接写 ElTable / ElDialog
- 无法约束工程规范

------

#### 推荐做法：受控使用（不等于不用 app.use）

```ts
// main.ts
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import App from './App.vue'

const app = createApp(App)

app.use(ElementPlus, {
  size: 'default',
  zIndex: 3000
})

app.mount('#app')
```

说明：

- **只配置全局必要项**
- 不做业务层面的约定
- 行为约束交给 Base 层

------

### 为什么 Vite + Element Plus 不再需要 babel-plugin-import

这是很多老 Vue2 项目留下的“历史包袱”。

#### 过去（Vue2 + Webpack）

- Element UI 是 **非 ES Module**
- 必须靠 babel-plugin-import 做按需加载
- 手动维护组件与样式映射

#### 现在（Vue3 + Vite）

- Element Plus 是 **原生 ES Module**
- Vite 天然支持 Tree Shaking
- 未使用的组件会被自动移除

结论：

> **不要再引入 babel-plugin-import / unplugin-vue-components 这类“历史方案”**
> （除非你非常清楚自己在干什么）

------

### 图标是否全局注册的取舍

`@element-plus/icons-vue` 是一个**容易被滥用**的点。

------

#### 方案一：全局注册（简单但风险高）

```ts
// main.ts
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
```

**优点：**

- 使用方便
- 模板里直接写 `<Edit />`

**缺点（很关键）：**

- 所有图标被注册
- 团队成员随意使用
- 图标风格失控

------

#### 推荐方案：局部 + Base 封装

只在 **BaseIcon** 中使用 Element Plus 图标：

```ts
// components/base/BaseIcon.vue（示意）
<script setup lang="ts">
import { Edit, Delete, Plus } from '@element-plus/icons-vue'

defineProps<{
  name: 'edit' | 'delete' | 'plus'
}>()
</script>
```

业务层只关心：

```vue
<BaseIcon name="edit" />
```

好处：

- 图标来源统一
- 可随时替换 UI 框架
- 控制可用图标集合

------

### 工程级推荐结论

你可以直接写进团队规范：

- Element Plus 版本必须锁定
- Vite 项目不使用 babel-plugin-import
- 不鼓励全量图标注册
- UI 框架只在 Base 层被“消费”

------

## 样式体系设计（非常重要）

样式体系在 **Vue3 + Element Plus** 项目中属于基础设施级别内容，其目标不是“好看”，而是**长期可维护、可扩展、可约束**。

------

### 样式层级划分

在工程中，样式必须明确分层，禁止混用职责。推荐的层级如下（自下而上）：

- Element Plus 默认样式
- 主题变量（Design Token）
- 项目级全局样式
- 页面级样式
- 组件私有样式

------

#### Element Plus 默认样式

```ts
// main.ts
import 'element-plus/dist/index.css'
```

职责说明：

- 提供基础 UI 组件的默认外观与交互行为
- 作为整个系统的**样式基线**

约束规则：

- 不允许修改 `node_modules`
- 不允许在该层引入业务语义
- 不承担项目风格定制职责

------

#### 主题变量（Design Token）

主题变量是**整个样式体系的核心抽象层**，用于统一设计语言。

推荐目录结构：

```
src/styles/tokens/
├─ _color.scss
├─ _font.scss
├─ _space.scss
├─ _radius.scss
├─ _shadow.scss
└─ index.scss
```

示例（颜色 Token）：

```scss
// src/styles/tokens/_color.scss
$color-primary: #409eff;
$color-success: #67c23a;
$color-warning: #e6a23c;
$color-danger: #f56c6c;

$color-text-primary: #303133;
$color-text-regular: #606266;
$color-text-secondary: #909399;
```

统一出口：

```scss
// src/styles/tokens/index.scss
@forward 'color';
@forward 'font';
@forward 'space';
@forward 'radius';
@forward 'shadow';
```

约束规则：

- 只允许定义变量
- 不允许出现 class 或选择器
- 不允许编写具体组件或页面样式

------

#### 项目级全局样式

项目级全局样式用于定义**全项目通用行为与轻度覆盖**。

推荐目录结构：

```
src/styles/
├─ reset.scss
├─ base.scss
├─ element.scss
├─ index.scss
```

示例（Element Plus 轻度覆盖）：

```scss
// src/styles/element.scss
@use './tokens' as *;

.el-button {
  border-radius: $radius-base;
}
```

统一引入：

```scss
// src/styles/index.scss
@use './reset';
@use './base';
@use './element';
// main.ts
import '@/styles/index.scss'
```

约束规则：

- 只做基础行为或视觉微调
- 不编写业务语义样式
- 不使用复杂选择器覆盖 Element Plus

------

#### 页面级样式

页面级样式仅作用于单个 `view`，用于页面布局和结构调整。

示例：

```vue
<style scoped lang="scss">
.page-user {
  padding: 16px;
}
</style>
```

约束规则：

- 只处理当前页面结构
- 不编写通用组件样式
- 不直接覆盖 Element Plus 核心样式

------

#### 组件私有样式

组件私有样式用于 Base 组件或业务组件，是作用范围最小、自由度最高的一层。

示例：

```vue
<style scoped lang="scss">
.base-table {
  &__toolbar {
    margin-bottom: 12px;
  }
}
</style>
```

推荐做法：

- 使用 BEM 或等价命名方式
- 样式不依赖外部上下文
- 不影响组件外部结构

------

### SCSS 变量覆盖机制

在 **Vue3 + Element Plus** 项目中，必须使用现代 SCSS 模块机制。

------

#### 使用 `@forward` / `@use`

- 使用 `@forward` 统一暴露变量
- 使用 `@use` 按需引入变量

示例：

```scss
@use '@/styles/tokens' as *;
```

优势：

- 避免全局污染
- 明确变量来源
- 易于维护与重构

------

#### 不直接改 node_modules

禁止行为：

- 修改 Element Plus 源码样式
- 直接覆盖组件内部 SCSS 文件

原因：

- 升级不可控
- 隐式依赖严重
- 团队难以维护

------

#### Element Plus 主题定制的正确姿势

Element Plus 的主题定制应当：

- 通过变量覆盖
- 结合项目 Token
- 集中管理入口

核心原则：

> **Element Plus 接收你的设计系统，而不是反过来。**

------

### 与你现有样式体系的关系

Element Plus 并不是样式体系的“中心”，而是其中的一个组成部分。

------

#### Element Plus 只提供「基础皮肤」

Element Plus 负责：

- 默认组件外观
- 基础交互反馈
- 状态样式（hover / disabled 等）

它不负责：

- 项目品牌风格
- 业务语义颜色
- 页面布局规范

------

#### 项目色板 / 间距 / 字号依然由你自己掌控

项目应始终以 **Design Token** 为核心：

- Element Plus 使用 Token
- 自研组件使用 Token
- 页面样式使用 Token

最终目标是：

> **即使替换 Element Plus，项目的设计语言依然成立。**

------

## Element Plus 组件的二次封装原则

在 **Vue3 + TypeScript + Element Plus** 的工程体系中，**二次封装不是“优化项”，而是“基础约束”**。
是否进行二次封装，决定了项目在中后期是“可演进”，还是“只能推倒重来”。

------

### 为什么必须二次封装

#### 统一

##### 表单行为

不进行封装时，常见问题包括：

- 提交方式不统一（有的直接 submit，有的 emit）
- 校验时机不一致
- 重置逻辑分散在各个页面

通过封装后，表单应统一具备：

- 明确的 `model` 与 `rules`
- 统一的提交与重置行为
- 可复用的校验触发策略

------

##### 表格交互

未封装的 Element Plus 表格通常会导致：

- 分页、排序、加载状态重复实现
- 列配置散落在模板中
- 请求逻辑与 UI 强耦合

二次封装的目标是：

- 表格配置化
- 交互行为标准化
- 页面只关心“数据和意图”

------

##### 弹窗逻辑

常见混乱点：

- 打开 / 关闭方式不统一
- 关闭时是否清理状态不一致
- 确认 / 取消行为不明确

通过封装后，弹窗应具备：

- 明确的受控状态
- 统一的确认 / 取消语义
- 清晰的生命周期边界

------

#### 屏蔽

##### Element Plus API 变更

Element Plus 属于**高频迭代的 UI 框架**，风险包括：

- props 重命名
- 默认行为调整
- 类型定义变化

通过 Base 层封装：

- 业务层不直接依赖 Element Plus API
- 框架升级只影响 Base 层

------

##### 组件细节差异

直接使用 Element Plus 会导致：

- 同类组件在不同页面表现不一致
- 相同功能出现多种写法
- 难以制定统一规范

二次封装可以：

- 收敛使用方式
- 限制可选项
- 固化交互规范

------

### 推荐封装层级

推荐的组件封装层级如下：

```
components/
├─ base/        # 通用 UI 封装（Button、Dialog、Table）
├─ business/    # 业务组件
```

------

#### base 层职责

- 对 Element Plus 组件进行二次封装
- 不包含任何业务语义
- 可被所有业务模块复用

典型特征：

- props 通用
- 行为稳定
- 接口收敛

------

#### business 层职责

- 基于 base 组件组合
- 承载具体业务语义
- 与接口、权限、流程强相关

典型特征：

- 明确业务含义
- 复用范围有限
- 不向下渗透业务逻辑

------

### 示例（概念层）

以下示例用于说明**封装层级与职责边界**，不关注具体样式细节。

------

#### BaseButton（概念示例）

```vue
<script setup lang="ts">
import { ElButton } from 'element-plus'

defineProps<{
  type?: 'primary' | 'success' | 'warning' | 'danger'
  loading?: boolean
  disabled?: boolean
}>()

defineEmits<{
  (e: 'click'): void
}>()
</script>

<template>
  <ElButton
    :type="type"
    :loading="loading"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <slot />
  </ElButton>
</template>
```

业务层只关心语义：

```vue
<BaseButton type="primary" @click="onSubmit">
  保存
</BaseButton>
```

------

#### BaseDialog（概念示例）

```vue
<script setup lang="ts">
import { ElDialog } from 'element-plus'

defineProps<{
  modelValue: boolean
  title: string
}>()

defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()
</script>
```

职责明确：

- BaseDialog 只负责弹窗行为
- 业务逻辑由外部控制

------

#### BaseTable（概念说明）

BaseTable 的关注点应是：

- 列定义
- loading 状态
- 分页事件

而不是：

- 接口请求
- 数据转换
- 业务判断

------

#### BaseForm（概念说明）

BaseForm 应统一：

- 表单结构
- 校验触发方式
- 提交与重置流程

而不是关心：

- 提交到哪个接口
- 参数如何拼装

------

## 表单体系设计（重点）

表单是后台系统中**最复杂、最容易失控的交互单元**。
Element Plus 提供的是“表单能力”，但**完整的表单体系必须由工程层来约束**。

------

### Element Plus Form 的正确使用方式

#### 表单结构 ≠ 接口参数结构

常见错误做法：

- 表单 `model` 直接等于接口参数
- 编辑态直接回填接口返回对象
- 提交时在组件中拼装参数

推荐原则：

- 表单结构只服务于 **UI 展示与用户输入**
- 接口参数在 **提交阶段单独转换**

示例：

```ts
// 表单模型（UI 层）
interface UserFormModel {
  name: string
  age: number
  status: string
}
// 接口参数（业务层）
interface UserCreateParams {
  userName: string
  userAge: number
  enabled: boolean
}
```

两者通过 **提交逻辑解耦**，而不是强绑定。

------

#### 校验规则集中管理

禁止行为：

- 在每个页面重复写校验规则
- 校验规则散落在模板中

推荐做法：

- 校验规则独立定义
- 与表单结构一一对应
- 可复用、可维护

示例：

```ts
// forms/user.rules.ts
import type { FormRules } from 'element-plus'

export const userFormRules: FormRules = {
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' }
  ],
  age: [
    { required: true, message: '请输入年龄', trigger: 'change' }
  ]
}
```

页面只负责**引用规则**，而不定义规则。

------

#### 表单状态与业务状态分离

需要明确区分两类状态：

- 表单状态
  - 是否校验通过
  - 是否被修改
- 业务状态
  - 是否正在提交
  - 当前业务流程阶段

示例：

```ts
const loading = ref(false)     // 业务状态
const formRef = ref()          // 表单状态
```

禁止：

- 用 `loading` 判断表单是否可提交
- 用表单状态控制业务流程

------

### 推荐抽象

为了避免页面中重复编写表单控制逻辑，推荐进行 hooks 抽象。

------

#### useForm

负责：

- 表单模型初始化
- 表单引用管理

示例（概念）：

```ts
export function useForm<T>(initialValue: T) {
  const formRef = ref()
  const formModel = ref<T>({ ...initialValue })

  return {
    formRef,
    formModel
  }
}
```

------

#### useFormSubmit

负责：

- 校验触发
- 提交流程封装

示例（概念）：

```ts
export function useFormSubmit(
  formRef: Ref<any>,
  submitFn: () => Promise<void>
) {
  const submit = async () => {
    await formRef.value.validate()
    await submitFn()
  }

  return {
    submit
  }
}
```

页面不再关心校验细节，只关心**提交意图**。

------

#### useFormReset

负责：

- 表单重置
- 状态恢复

示例（概念）：

```ts
export function useFormReset<T>(
  formRef: Ref<any>,
  formModel: Ref<T>,
  initialValue: T
) {
  const reset = () => {
    formRef.value.resetFields()
    formModel.value = { ...initialValue }
  }

  return {
    reset
  }
}
```

------

### 表单在页面中的生命周期管理

表单并不是“一次性组件”，而是有明确生命周期的。

------

#### 新增 / 编辑 / 查看

推荐区分三种模式：

- 新增
  - 初始化空表单
  - 可编辑
- 编辑
  - 回填数据
  - 可编辑
- 查看
  - 回填数据
  - 禁用编辑

示例（模式控制）：

```ts
type FormMode = 'create' | 'edit' | 'view'

const mode = ref<FormMode>('create')
```

BaseForm / 业务组件根据 `mode` 控制：

- 是否禁用字段
- 是否显示操作按钮

------

#### 弹窗表单 vs 页面表单

##### 弹窗表单

特点：

- 生命周期短
- 打开即初始化
- 关闭即销毁或重置

推荐：

- 表单组件独立
- 关闭时统一 reset
- 不保留中间状态

------

##### 页面表单

特点：

- 生命周期长
- 与路由强相关
- 可能多次编辑

推荐：

- 初始化与路由参数绑定
- 提交后状态明确
- 离开页面时清理副作用

------

## 表格体系设计（重点）

在后台系统中，**表格是出现频率最高、也是最容易失控的组件**。
如果直接使用 Element Plus Table，项目规模一旦扩大，往往会出现大量重复代码和不可维护逻辑。

------

### Element Plus Table 的工程问题

#### 配置冗长

直接使用 `ElTable` 时，常见问题包括：

- 列定义全部写在模板中
- 每个页面都重复 `ElTableColumn`
- 配置与业务逻辑混杂

示意（不推荐）：

```vue
<ElTable :data="list" border>
  <ElTableColumn prop="name" label="姓名" />
  <ElTableColumn prop="age" label="年龄" />
  <ElTableColumn prop="status" label="状态">
    <template #default="{ row }">
      {{ row.status === 1 ? '启用' : '禁用' }}
    </template>
  </ElTableColumn>
</ElTable>
```

问题在于：

- 模板冗长
- 复用困难
- 难以统一规范

------

#### 插槽分散

未封装时：

- 单元格插槽
- 表头插槽
- 操作列插槽

往往分散在各个页面，导致：

- 同类交互写法不一致
- 维护成本高
- 新成员理解困难

------

#### 分页 / 排序 / 请求逻辑重复

常见现象：

- 每个页面都维护一套 `page / size`
- 排序参数格式各不相同
- 请求逻辑和 UI 强耦合

结果是：

- 表格代码复制粘贴
- 隐性 bug 多
- 修改成本高

------

### 推荐设计

#### 表格 = 配置驱动

核心思想：

> **表格只负责“如何展示”，不负责“数据从哪来”。**

推荐将列定义抽离为配置对象：

```ts
export interface TableColumn<T> {
  prop: keyof T
  label: string
  width?: number
  slot?: string
}
const columns: TableColumn<User>[] = [
  { prop: 'name', label: '姓名' },
  { prop: 'age', label: '年龄' },
  { prop: 'status', label: '状态', slot: 'status' }
]
```

BaseTable 负责：

- 渲染列
- 绑定插槽
- 处理基础交互

页面只传配置。

------

#### 请求逻辑外置

推荐将请求、分页、排序逻辑统一抽离。

示意：

```ts
export function useTableRequest<T>(fetchFn: Function) {
  const loading = ref(false)
  const data = ref<T[]>([])
  const page = ref(1)
  const size = ref(10)

  const load = async () => {
    loading.value = true
    data.value = await fetchFn({ page: page.value, size: size.value })
    loading.value = false
  }

  return {
    loading,
    data,
    page,
    size,
    load
  }
}
```

表格组件只接收：

- `data`
- `loading`
- `pagination`

------

#### 列配置强类型化

直接在模板中写 `prop="xxx"` 容易导致：

- 拼写错误
- 字段变更不易发现
- 类型缺失

推荐通过 TypeScript 约束：

```ts
interface User {
  name: string
  age: number
  status: number
}
const columns: TableColumn<User>[] = [
  { prop: 'name', label: '姓名' },
  { prop: 'age', label: '年龄' }
]
```

优势：

- 编译期校验
- IDE 智能提示
- 重构安全

------

## 弹窗与抽屉的统一管理

在后台系统中，弹窗（Dialog）和抽屉（Drawer）往往承载**表单、详情、确认等关键流程**。
如果缺乏统一管理，很容易演变成状态混乱、逻辑难以维护的重灾区。

------

### 常见问题

#### 多弹窗嵌套

常见场景：

- 列表页 → 编辑弹窗 → 选择弹窗
- 弹窗中再次打开弹窗

直接使用 Element Plus 时，容易出现：

- 多层 `v-model` 相互影响
- 弹窗层级（z-index）不可控
- 用户操作路径不清晰

------

#### 状态污染

典型问题包括：

- 关闭弹窗后，表单数据未清理
- 再次打开时残留上一次状态
- 编辑 / 新增数据混在一起

原因本质是：

> **弹窗被当成“临时视图”，而不是“独立组件”。**

------

#### 关闭时机混乱

常见错误：

- 点击“确认”立即关闭弹窗，但提交失败
- 点击遮罩关闭，但业务状态未处理
- 不同页面对“关闭”的理解不一致

结果是：

- 用户体验不一致
- 隐性 bug 难排查

------

### 推荐方案

#### 弹窗即组件

核心原则：

> **弹窗不是页面的一部分，而是一个完整的组件单元。**

推荐做法：

- 每一个弹窗 / 抽屉都是一个独立组件
- 内部维护自己的表单、状态和生命周期
- 外部只负责控制显示与接收结果

示意结构：

```
components/
├─ base/
│  ├─ BaseDialog.vue
│  └─ BaseDrawer.vue
├─ business/
│  └─ UserEditDialog.vue
```

------

#### 通过 props 控制

弹窗组件应是**完全受控组件**。

示例（概念）：

```ts
defineProps<{
  modelValue: boolean
  mode: 'create' | 'edit'
  data?: any
}>()
```

外部控制：

- 是否显示
- 当前模式
- 初始数据

弹窗内部不主动修改外部状态。

------

#### 通过 emit 反馈结果

弹窗的职责是：

- 执行业务操作
- 将结果告知外部

示例（概念）：

```ts
defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'success'): void
  (e: 'cancel'): void
}>()
```

推荐语义：

- `success`：操作成功（外部决定后续行为）
- `cancel`：用户主动取消
- `update:modelValue`：控制显示状态

------

### 统一关闭策略（关键约束）

推荐约定：

- **确认成功后再关闭**
- **失败不自动关闭**
- **取消即关闭并清理状态**

示意：

```ts
const handleConfirm = async () => {
  await submit()
  emit('success')
  emit('update:modelValue', false)
}
```

------

## 消息与反馈体系统一封装

消息与反馈属于**全局感知最强的交互能力**，如果缺乏统一封装，用户体验和工程质量都会迅速下降。

------

### Element Plus 提供的能力

Element Plus 提供了完整的基础反馈能力，但这些能力**不应被直接在业务中随意使用**。

------

#### ElMessage

用于：

- 操作结果提示
- 短时反馈

特点：

- 瞬时
- 非阻塞
- 易被滥用

------

#### ElMessageBox

用于：

- 确认 / 警告
- 关键操作二次确认

特点：

- 阻塞式
- 需要用户明确响应

------

#### ElNotification

用于：

- 全局通知
- 较长展示内容

特点：

- 不打断当前操作
- 展示时间较长

------

#### ElLoading

用于：

- 页面或局部加载态
- 阻止用户重复操作

特点：

- 强反馈
- 易产生“卡死感”

------

### 为什么要再包一层

#### 文案统一

未封装时的典型问题：

- 成功提示五花八门
- 同一操作不同页面文案不一致
- 错误信息直接透传后端

封装后的目标：

- 成功 / 失败文案统一
- 默认提示语集中管理
- 支持后期统一修改

示例（概念）：

```ts
message.success()
message.error('操作失败')
```

------

#### 默认行为统一

Element Plus 原生 API 提供大量可选项，但业务并不需要全部自由度。

封装可以统一：

- 显示时长
- 是否可关闭
- 是否重复显示

示意：

```ts
export function success(message?: string) {
  ElMessage({
    type: 'success',
    message: message || '操作成功',
    duration: 2000
  })
}
```

------

#### 防止滥用

常见滥用场景：

- 每个接口响应都弹 Message
- 页面一加载就弹 Notification
- loading 与 message 同时出现

通过封装可以：

- 限制使用入口
- 强制语义化调用
- 约束展示频率

------

### 推荐封装示例（概念）

```ts
// src/utils/feedback.ts
import { ElMessage, ElMessageBox, ElNotification, ElLoading } from 'element-plus'

export const message = {
  success(text?: string) {
    ElMessage.success(text || '操作成功')
  },
  error(text?: string) {
    ElMessage.error(text || '操作失败')
  }
}
```

业务层只使用统一出口：

```ts
import { message } from '@/utils/feedback'

message.success()
```

------

## 与路由 / 权限系统的协作

Element Plus 在这一层**不参与决策，只参与呈现**。
真正的控制权在 **路由系统 + 权限系统**。

------

### 菜单与 Element Plus 的关系

#### 菜单数据来源于权限

在工程中，菜单应满足：

- 来源于：
  - 后端权限接口
  - 或本地权限配置
- 与 UI 框架无关
- 可被路由、面包屑、Tab 等多处复用

推荐的数据模型示意：

```ts
export interface MenuItem {
  path: string
  name: string
  meta: {
    title: string
    icon?: string
    permission?: string
  }
  children?: MenuItem[]
}
```

------

#### UI 只做渲染

Element Plus 的 `ElMenu`：

- 只负责：
  - 展示结构
  - 高亮状态
  - 折叠 / 展开

不负责：

- 菜单过滤
- 权限判断
- 路由跳转逻辑

示意：

```vue
<el-menu>
  <el-menu-item
    v-for="item in menus"
    :key="item.path"
    :index="item.path"
  >
    {{ item.meta.title }}
  </el-menu-item>
</el-menu>
```

**menus 已经是“可展示的结果集”**。

------

### 权限指令与 Element Plus 组件

#### `v-permission` 与按钮组件结合

权限判断如果散落在模板中：

```vue
<el-button
  v-if="user.role === 'admin' && status === 1"
>
  删除
</el-button>
```

问题：

- 模板可读性极差
- 权限规则不可复用
- 后期无法统一修改

------

#### 推荐方式：权限指令

将权限判断下沉为**指令层**：

```ts
// directives/permission.ts
import type { Directive } from 'vue'

export const permission: Directive = {
  mounted(el, binding) {
    const hasPermission = checkPermission(binding.value)
    if (!hasPermission) {
      el.parentNode?.removeChild(el)
    }
  }
}
```

注册一次：

```ts
app.directive('permission', permission)
```

使用时：

```vue
<BaseButton v-permission="'user:delete'">
  删除
</BaseButton>
```

------

#### 与 Element Plus 组件结合的优势

- 不关心组件类型：
  - Button
  - Dropdown
  - MenuItem
- 不关心 UI 实现
- 权限规则集中维护

------

### 避免在模板中写复杂逻辑

**模板的职责应该只有三件事：**

1. 结构
2. 绑定
3. 事件

不应该出现：

- 多重条件判断
- 权限规则
- 业务分支

坏示例：

```vue
<el-button
  v-if="isAdmin && canEdit && status !== 'disabled'"
>
```

好示例：

```vue
<BaseButton v-permission="'user:edit'">
```

------

## 与 TypeScript 的深度结合

在 **Vue3 + Element Plus** 项目中，
TypeScript 不是“锦上添花”，而是**工程稳定性的核心支点**。

------

### 常见 TS 痛点

#### 表单 model 类型不严谨

典型问题：

- 表单直接 `ref({})`
- 任意字段随意添加
- 校验规则与字段脱节

坏示例：

```ts
const form = ref({})
```

后果：

- 提交时类型不可信
- 重构风险极高

------

#### 表格 row 类型丢失

常见写法：

```vue
<el-table :data="list">
  <el-table-column prop="name" />
</el-table>
```

问题：

- `list` 的 item 是 `any`
- 插槽参数无类型提示
- formatter 无法推断字段

------

#### emit / slot 类型缺失

典型问题：

- emit 事件名拼写错误
- slot 参数只能靠猜
- 父子组件协作成本高

------

### 推荐做法

TypeScript 的目标不是“类型完美”，而是：

> **让错误尽可能早地暴露在编译期**

------

### 所有 base 组件必须是泛型友好

#### BaseTable 示例（概念）

```ts
export interface BaseTableProps<T> {
  data: T[]
  columns: TableColumn<T>[]
}
```

使用时：

```ts
interface User {
  id: number
  name: string
  age: number
}

const columns: TableColumn<User>[] = [
  { prop: 'name', label: '姓名' },
  { prop: 'age', label: '年龄' }
]
```

收益：

- `prop` 自动校验
- 插槽参数类型可推断
- 重构安全

------

### 表单、表格配置全部类型驱动

#### 表单配置类型化

```ts
export interface FormField<T> {
  field: keyof T
  label: string
  component: 'input' | 'select'
}
```

使用：

```ts
interface UserForm {
  name: string
  age: number
}

const fields: FormField<UserForm>[] = [
  { field: 'name', label: '姓名', component: 'input' },
  { field: 'age', label: '年龄', component: 'input' }
]
```

------

#### 表格列配置类型化

```ts
export interface TableColumn<T> {
  prop: keyof T
  label: string
  formatter?: (row: T) => string
}
```

IDE 能直接提示：

```ts
formatter(row) {
  return row.name
}
```

------

### emit 类型约束（Base 组件）

```ts
const emit = defineEmits<{
  (e: 'submit', data: FormData): void
  (e: 'cancel'): void
}>()
```

收益：

- 父组件调用有提示
- 事件名不可写错

------

### slot 类型约束（概念）

```vue
<slot name="action" :row="row" />
```

配合文档与类型声明：

- slot 参数可推断
- 使用成本大幅降低

------

## 性能与体积控制

在 **Vite + Vue3 + Element Plus** 体系下，性能问题更多来自**使用方式错误**，而不是框架本身。

------

### 按需使用而不是全量依赖

#### 只用你需要的组件

推荐：

- 明确使用哪些组件
- 不做“习惯性全引入”

```ts
import { ElButton, ElDialog } from 'element-plus'
```

不推荐：

```ts
import ElementPlus from 'element-plus'
app.use(ElementPlus)
```

原因：

- 组件体积不可控
- 不利于 Tree Shaking
- 不利于后期审计

------

#### 图标按需

`@element-plus/icons-vue` 的常见误区：

```ts
import * as Icons from '@element-plus/icons-vue'
```

问题：

- 所有图标打包进来
- 实际只用 5–10 个

推荐：

```ts
import { Search, Edit, Delete } from '@element-plus/icons-vue'
```

并通过 BaseIcon 统一出口。

------

### 样式体积控制

#### 避免重复引入样式

常见错误：

- 在多个入口重复引入 element-plus 样式
- 在组件中单独 import 样式

原则：

- Element Plus 样式只在 **一个全局入口** 引入
- 主题变量只注入一次

------

#### 合理拆分页面

Element Plus 组件往往较重：

- 表格
- 树
- 级联选择

建议：

- 页面级懒加载
- 弹窗组件按需加载

```ts
const UserDialog = defineAsyncComponent(() => import('./UserDialog.vue'))
```

------

### 本节核心原则

- 不全引入
- 不滥用
- 不重复

------

------

## Element Plus 的升级与风险控制

Element Plus 升级**一定有风险**，区别只是你是否提前兜底。

------

### 升级风险点

#### 组件行为变化

- 默认值变更
- 交互细节调整
- 边界行为修复（但业务依赖了旧行为）

------

#### 样式变量变更

- SCSS 变量命名调整
- 默认值修改
- 主题覆盖失效

------

#### TS 类型变更

- Props 类型收紧
- emit 类型调整
- 泛型约束变化

------

### 应对策略

#### Base 层兜底

所有 Element Plus 使用必须经过 Base 层：

```
views → business components → base components → Element Plus
```

升级时：

- 只需要修改 Base 层
- 业务层零感知或最小感知

------

#### 锁版本

`package.json`：

```json
"element-plus": "2.7.x"
```

原则：

- 锁主版本
- 不自动升级

------

#### 小版本验证

升级策略：

1. 本地单独升级
2. 跑核心页面
3. 验证表单 / 表格 / 弹窗
4. 再合入主分支

**禁止线上直接升版本**

------

### 本节核心原则

- Element Plus 是外部依赖
- 必须假设它“会变”
- Base 层是你的安全网

------

------

## Element Plus 在团队中的规范约束

没有规范的 Element Plus，
最终会演变成 **“UI 混乱 + 难以维护”**。

------

### 推荐约定

#### 禁止在 views 直接使用 ElDialog / ElTable

原因：

- 强耦合
- 难以升级
- 逻辑分散

视图层允许：

- Base 组件
- 业务组件

------

#### 表单、表格必须使用 Base 封装

统一：

- 行为
- 风格
- 类型
- 交互模式

禁止：

- 页面级手写 ElForm / ElTable

------

#### 统一 Message 工具

规则：

- 不允许直接使用 ElMessage
- 所有提示走统一工具

收益：

- 文案一致
- 行为可控
- 易于审计

------

### 文档化建议

Element Plus 使用规范**必须文档化**，并成为团队共识。

至少写清楚：

- 什么时候用 Element Plus（Base 层）
- 什么时候用 Base 组件（业务开发）
- 什么时候新建业务组件（复杂复用）

建议文档位置：

```
docs/
└─ ui-guideline.md
```

------

## 少量实际使用示例（点到为止）

以下示例的目的只有一个：

> **证明这套架构“真的能用、好维护、可扩展”**

------

### 示例类型（后续可展开）

------

### 登录页表单

**关注点：**

- 使用 BaseForm
- 表单模型类型明确
- 提交逻辑外置

```ts
interface LoginForm {
  username: string
  password: string
}

const form = useForm<LoginForm>({
  username: '',
  password: ''
})
<BaseForm
  :model="form.model"
  :rules="loginRules"
  @submit="handleLogin"
/>
```

要点：

- 页面不关心 ElForm
- 表单行为统一
- 校验规则可复用

------

### CRUD 表格页

**关注点：**

- 配置驱动
- 请求逻辑外置
- 表格组件无业务感知

```ts
const columns = defineTableColumns<User>({
  { prop: 'name', label: '姓名' },
  { prop: 'age', label: '年龄' }
})
<BaseTable
  :columns="columns"
  :data="list"
  @edit="handleEdit"
  @delete="handleDelete"
/>
```

要点：

- 表格只关心“展示什么”
- 页面只处理“做什么”

------

### 编辑弹窗

**关注点：**

- 弹窗即组件
- props 驱动
- emit 返回结果

```vue
<UserEditDialog
  v-model:visible="visible"
  :data="currentRow"
  @success="reload"
/>
```

要点：

- 弹窗自管理生命周期
- 页面只接收结果

------

### 全局确认弹窗

**关注点：**

- 不直接使用 ElMessageBox
- 统一出口
- 统一文案风格

```ts
await confirm({
  title: '确认删除',
  content: '删除后不可恢复'
})
```

要点：

- 语义明确
- 行为统一
- 可集中修改

------

### 本节边界说明

- 不展示 Element Plus API 细节
- 不讨论组件属性大全
- 不解决“所有场景”

这些内容：

👉 **全部交给官方文档**

------

