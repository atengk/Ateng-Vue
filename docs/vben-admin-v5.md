# Vben Admin 5 企业级管理系统框架

Vben Admin 5 是一套基于 Vue3、Vite、TypeScript 的现代化中后台管理框架，内置完善的权限体系、多主题布局、国际化、多标签页、数据展示组件等常用功能。项目采用模块化与配置化设计，支持快速二次开发，适合中后台系统、运营平台、管理控制台等场景。开发体验流畅、代码规范、生态完善。

- [官网地址](https://doc.vben.pro/)



## 当前环境

```
node: v22
pnpm: 10.12.4
```



## 启动项目

**获取源码**

```
git clone https://github.com/vbenjs/vue-vben-admin.git
cd vue-vben-admin
```

**切换到指定版本**

切换到 tag `v5.5.9` 并创建分支

```
git checkout -b v5.5.9_branch v5.5.9
```

**安装依赖**

如果已全局安装 pnpm：

```
pnpm install
```

> 💡 如果没有安装 pnpm，可以执行：
>
> ```
> corepack enable
> corepack prepare pnpm@10.12.4 --activate
> ```

**启动项目**

```
pnpm run dev:ele
```



## 应用精简

参考文档：[链接](https://doc.vben.pro/guide/introduction/thin.html)

**应用精简**

我这里使用的 UI 组件是 Element Plus，我先拷贝一份 `apps/web-ele` 应用为 `apps/ateng-web`

```
rm -rf apps/web-ele/node_modules
cp -r apps/web-ele apps/ateng-web
rm -rf apps/web-antd apps/web-ele apps/web-naive apps/web-tdesign 
```

修改应用名称

`apps/ateng-web/package.json`

```
"name": "@apps/ateng-web"
```

**其他精简**

如果你不需要演示代码，你可以直接删除 `playground` 文件夹。

```
rm -rf playground
```

如果你不需要文档，你可以直接删除`docs`文件夹。

```
rm -rf docs
```

如果你想更进一步精简，你可以删除参考以下文件或者文件夹的作用，判断自己是否需要，不需要删除即可：

```
rm -rf .changeset .github .vscode scripts/deploy
```

**命令调整**

在精简后，你可能需要根据你的项目调整命令，在根目录下的`package.json`文件中，你可以调整`scripts`字段，移除你不需要的命令。

```json
{
  "scripts": {
    "build:web": "pnpm run build --filter=@apps/ateng-web",
    "dev:web": "pnpm -F @apps/ateng-web run dev"
  }
}
```

**清理依赖**

```
pnpm prune
```

**安装依赖**

```
pnpm install
```

**启动项目**

```
pnpm run dev:web
```

![image-20260109075158376](./assets/image-20260109075158376.png)



## 添加页面

参考文档：[链接](https://doc.vben.pro/guide/essentials/route.html)

**添加页面**

`src/views/system/user/index.vue`

```vue
<script lang="ts" setup>
import { Page } from '@vben/common-ui';
</script>

<template>
  <Page title="用户管理" description="Hello World 示例">
    Hello, Vben Admin with Element Plus! 👋
  </Page>
</template>
```

**添加路由**

`src/router/routes/modules/system.ts`

```ts
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'ic:baseline-view-in-ar',
      keepAlive: true,
      order: 1000,
      title: '系统管理',
    },
    name: 'System',
    path: '/system',
    children: [
      {
        meta: {
          title: '用户管理',
        },
        name: 'user',
        path: '/system/user',
        component: () => import('#/views/system/user/index.vue'),
      },
    ],
  },
];

export default routes;
```



## 组件使用

### Page 常规页面组件

提供一个常规页面布局的组件，包括头部、内容区域、底部三个部分。

参考文档：[链接](https://doc.vben.pro/components/layout-ui/page.html)

#### 基础标题 + 描述 + 内容

```vue
<script setup lang="ts">
import { Page } from '@vben/common-ui';
</script>

<template>
  <Page title="用户管理" description="查看并操作用户信息">
    <div>
      这是主要内容。
    </div>
  </Page>
</template>
```

------

#### 头部右侧操作按钮（extra slot）

```vue
<script setup lang="ts">
import { Page } from '@vben/common-ui';
import { ElButton } from 'element-plus';

function handleAdd() {
  console.log('点击新增');
}
</script>

<template>
  <Page title="用户管理" description="带头部按钮">
    <template #extra>
      <ElButton type="primary" @click="handleAdd">新增用户</ElButton>
    </template>

    主体内容...
  </Page>
</template>
```

------

#### 自定义标题 / 描述 插槽

```vue
<script setup lang="ts">
import { Page } from '@vben/common-ui';
</script>

<template>
  <Page>
    <template #title>
      <span class="bg-indigo-600 text-white">📌 自定义标题</span>
    </template>
    <template #description>
      这里使用插槽定义了描述内容
    </template>

    页面内容
  </Page>
</template>
```

------

#### 底部 Footer 区域

设置了底部区域的插槽，主题内容区域的高度必须要有，不然部分内容会被覆盖

```vue
<script setup lang="ts">
import { Page } from '@vben/common-ui';

import { ElButton } from 'element-plus';
</script>

<template>
  <Page title="用户编辑" description="底部操作按钮示例">
    <div class="h-[400px] bg-blue-50">主体内容...</div>

    <template #footer>
      <div>
        <ElButton>取消</ElButton>
        <ElButton type="primary">保存</ElButton>
      </div>
    </template>
  </Page>
</template>
```

------

#### 不显示头部 — 纯内容

如果没有设置 `title`、`description` 或 `extra`，头部就不会渲染：

```vue
<script setup lang="ts">
import { Page } from '@vben/common-ui';
</script>

<template>
  <Page>
    纯内容页面，不渲染头部
  </Page>
</template>
```

------

#### Header 区域样式（`headerClass`）

用于给页面头部增加视觉强调，例如模块分隔、主题色块、信息提示等。

```vue
<script setup lang="ts">
import { Page } from '@vben/common-ui';
</script>

<template>
  <Page
    title="自定义 Header"
    description="用于强调标题和描述区域"
    header-class="bg-indigo-600 text-white px-6 py-4 shadow-lg rounded"
  >
    内容区域...
  </Page>
</template>
```

------

#### 内容区域样式（`contentClass`）

用于给内容区加背景、padding、卡片效果等，让主体内容更聚焦。

```vue
<script setup lang="ts">
import { Page } from '@vben/common-ui';
</script>

<template>
  <Page
    title="内容样式示例"
    content-class="p-8 bg-yellow-100 border-2 border-yellow-500 rounded-lg shadow-inner"
  >
    这是带背景 + 内边距 + 内阴影的内容区域
  </Page>
</template>
```

#### Footer 区域样式（`footerClass`）

常用于表单提交区域、审批确认按钮区、工具栏等底部操作区域。

```vue
<script setup lang="ts">
import { Page } from '@vben/common-ui';

import { ElButton } from 'element-plus';
</script>

<template>
  <Page
    title="底部操作示例"
    description="底部区域用于承载操作按钮"
    footer-class="bg-green-600 text-white px-6 py-3 flex justify-between items-center rounded shadow-md"
  >
    <div class="h-[400px] bg-blue-50">主体内容...</div>

    <template #footer>
      <span class="font-semibold">操作区：</span>
      <div class="space-x-2">
        <ElButton>取消</ElButton>
        <ElButton type="primary">确认</ElButton>
      </div>
    </template>
  </Page>
</template>
```

#### 自动撑满内容高度（autoContentHeight）

```vue
<script setup lang="ts">
import { Page } from '@vben/common-ui';
</script>

<template>
  <div class="h-[400px] border border-gray-300">
    <Page title="开启 autoContentHeight" auto-content-height>
      <div class="h-full bg-green-200">内容自动撑满高度</div>
    </Page>
  </div>
</template>
```

#### 双列布局（左右分栏）

```vue
<script setup lang="ts">
import { Page } from '@vben/common-ui';
</script>

<template>
  <Page title="双列布局示例" description="左侧为列表，右侧为详情">
    <div class="flex w-full gap-4">
      <!-- 左侧 -->
      <div
        class="min-h-[300px] w-1/3 rounded border border-gray-300 bg-gray-50 p-3"
      >
        <div class="mb-2 font-semibold">用户列表</div>
        <ul class="space-y-2">
          <li class="cursor-pointer rounded px-2 py-1 hover:bg-gray-200">
            用户 A
          </li>
          <li class="cursor-pointer rounded px-2 py-1 hover:bg-gray-200">
            用户 B
          </li>
          <li class="cursor-pointer rounded px-2 py-1 hover:bg-gray-200">
            用户 C
          </li>
        </ul>
      </div>

      <!-- 右侧 -->
      <div class="min-h-[300px] flex-1 rounded border border-gray-300 p-4">
        <div class="mb-2 font-semibold">详情区域</div>
        <p>在此显示用户的详细信息。</p>
      </div>
    </div>
  </Page>
</template>
```

------



### Form 表单

参考文档：[链接](https://doc.vben.pro/components/common-ui/vben-form.html)

### Vxe Table 表格

参考文档：[链接](https://doc.vben.pro/components/common-ui/vben-vxe-table.html)

### 🧰 核心基础

#### 基础表格渲染

支持普通列展示、列标题、自定义列字段等。

```vue
<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';

import { useVbenVxeGrid } from '#/adapter/vxe-table';

interface RowType {
  id: number;
  name: string;
  age: number;
  role: string;
}

const tableData: RowType[] = [
  { id: 1, name: '张三', age: 24, role: 'Admin' },
  { id: 2, name: '李四', age: 28, role: 'User' },
  { id: 3, name: '王五', age: 31, role: 'Guest' },
];

const gridOptions: VxeGridProps<RowType> = {
  columns: [
    { title: '序号', type: 'seq', width: 50 },
    { field: 'name', title: 'Name' },
    { field: 'age', title: 'Age' },
    { field: 'role', title: 'Role' },
  ],
  data: tableData,
  pagerConfig: { enabled: false },
};

const [Grid] = useVbenVxeGrid({ gridOptions });
</script>

<template>
  <div class="w-full">
    <Grid />
  </div>
</template>
```

#### 边框与样式控制

支持控制表格边框显示、斑马纹、对齐等样式项

```vue
<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';

import { ElButton } from 'element-plus';

import { useVbenVxeGrid } from '#/adapter/vxe-table';

interface RowType {
  id: number;
  name: string;
  age: number;
  role: string;
}

const tableData: RowType[] = [
  { id: 1, name: '张三', age: 24, role: 'Admin' },
  { id: 2, name: '李四', age: 28, role: 'User' },
  { id: 3, name: '王五', age: 31, role: 'Guest' },
];

const gridOptions: VxeGridProps<RowType> = {
  columns: [
    { title: '序号', type: 'seq', width: 50 },
    { field: 'name', title: 'Name' },
    { field: 'age', title: 'Age' },
    { field: 'role', title: 'Role' },
  ],
  data: tableData,
  border: true,
  stripe: true,
  align: 'center',
  pagerConfig: { enabled: false },
};

const [Grid, gridApi] = useVbenVxeGrid({ gridOptions });

function toggleBorder() {
  gridApi.setGridOptions({
    border: !gridApi.useStore((s) => s.gridOptions?.border).value,
  });
}

function toggleStripe() {
  gridApi.setGridOptions({
    stripe: !gridApi.useStore((s) => s.gridOptions?.stripe).value,
  });
}
</script>

<template>
  <div class="w-full">
    <Grid>
      <template #toolbar-tools>
        <ElButton size="small" class="mr-2" @click="toggleBorder">
          切换边框
        </ElButton>
        <ElButton size="small" class="mr-2" @click="toggleStripe">
          切换斑马纹
        </ElButton>
      </template>
    </Grid>
  </div>
</template>
```

#### Loading 状态控制

可通过 API 触发表格 loading 效果

```vue
<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';

import { ElButton } from 'element-plus';

import { useVbenVxeGrid } from '#/adapter/vxe-table';

interface RowType {
  id: number;
  name: string;
  age: number;
  role: string;
}

const tableData: RowType[] = [
  { id: 1, name: '张三', age: 24, role: 'Admin' },
  { id: 2, name: '李四', age: 28, role: 'User' },
  { id: 3, name: '王五', age: 31, role: 'Guest' },
];

const gridOptions: VxeGridProps<RowType> = {
  columns: [
    { title: '序号', type: 'seq', width: 50 },
    { field: 'name', title: 'Name' },
    { field: 'age', title: 'Age' },
    { field: 'role', title: 'Role' },
  ],
  data: tableData,
  pagerConfig: { enabled: false },
};

const [Grid, gridApi] = useVbenVxeGrid({ gridOptions });

function showLoading() {
  gridApi.setLoading(true);
  setTimeout(() => gridApi.setLoading(false), 1500);
}
</script>

<template>
  <div class="w-full">
    <Grid>
      <template #toolbar-tools>
        <ElButton size="small" class="mr-2" @click="showLoading">
          显示 Loading
        </ElButton>
      </template>
    </Grid>
  </div>
</template>
```

#### 分页（Pager）支持

内置分页能力，可开启/关闭分页、控制 total/当前页/页面大小等

```vue
<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';

import { useVbenVxeGrid } from '#/adapter/vxe-table';

interface RowType {
  id: number;
  name: string;
  age: number;
  role: string;
}

// 模拟全量数据（100条）
const fullTableData: RowType[] = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  name: `用户${i + 1}`,
  age: 20 + (i % 50),
  role: `角色${i + 1}`,
}));

const gridOptions: VxeGridProps<RowType> = {
  columns: [
    { title: '序号', type: 'seq', width: 60 },
    { field: 'name', title: 'Name' },
    { field: 'age', title: 'Age' },
    { field: 'role', title: 'Role' },
  ],
  pagerConfig: {
    enabled: true,
    pageSize: 10,
    pageSizes: [10, 20, 50, 100],
    total: 0, // 初始可为0，由 proxy 返回后自动更新
  },
  proxyConfig: {
    enabled: true,
    autoLoad: true,
    response: {
      result: 'items',
      total: 'total',
    },
    ajax: {
      query: async ({ page }) => {
        const currentPage = page?.currentPage || 1;
        const pageSize = page?.pageSize || 10;
        const start = (currentPage - 1) * pageSize;
        const end = start + pageSize;

        // 模拟异步延迟（可选）
        await new Promise((resolve) => setTimeout(resolve, 200));

        return {
          items: fullTableData.slice(start, end),
          total: fullTableData.length,
        };
      },
    },
  },
};

const [Grid] = useVbenVxeGrid({ gridOptions });
</script>

<template>
  <div class="w-full">
    <Grid />
  </div>
</template>
```

#### 排序配置

支持单列或多列排序并通过 `sortConfig` 控制行为

```vue
<script lang="ts" setup>
import type { VxeGridListeners, VxeGridProps } from '#/adapter/vxe-table';

import { ElMessage } from 'element-plus';

import { useVbenVxeGrid } from '#/adapter/vxe-table';

interface RowType {
  id: number;
  name: string;
  age: number;
  address: string;
}

// 模拟数据
const data: RowType[] = [
  { id: 1, name: '张三', age: 26, address: '北京' },
  { id: 2, name: '李四', age: 31, address: '上海' },
  { id: 3, name: '王五', age: 22, address: '杭州' },
];

const gridOptions: VxeGridProps<RowType> = {
  columns: [
    { title: '序号', type: 'seq', width: 60 },
    { field: 'name', title: '姓名' },
    { field: 'age', title: '年龄', sortable: true },
    { field: 'address', title: '地址', sortable: true },
  ],
  data,
  pagerConfig: { enabled: false },
  sortConfig: {
    remote: true,
    multiple: true,
  },
};

const gridEvents: VxeGridListeners<RowType> = {
  sortChange: async ({ sortList }) => {
    // sortList = [{ field: 'age', order: 'asc' }, { field: 'name', order: 'desc' }]
    if (sortList.length === 0) {
      ElMessage.info('排序已清空');
      // await remoteSortQuery([]);
      return;
    }

    // 传给后台的排序参数数组
    const orders = sortList
      .filter((item) => item.order)
      .map((item) => ({
        field: item.field,
        order: item.order,
      }));

    ElMessage.info(`远程多列排序: ${JSON.stringify(orders)}`);

    // 发给后端
    // await remoteSortQuery(orders);
  },
};

const [Grid] = useVbenVxeGrid({
  gridOptions,
  gridEvents,
});
</script>

<template>
  <div class="w-full">
    <Grid />
  </div>
</template>
```

#### 表头筛选功能

支持表头筛选条件（基于 vxe-table 原生筛选机制）

```vue
<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';

import { useVbenVxeGrid } from '#/adapter/vxe-table';

interface RowType {
  id: number;
  name: string;
  age: number;
  role: string;
}

const tableData: RowType[] = [
  { id: 1, name: '张三', age: 24, role: 'Admin' },
  { id: 2, name: '李四', age: 28, role: 'User' },
  { id: 3, name: '王五', age: 31, role: 'Guest' },
  { id: 4, name: '赵六', age: 28, role: 'User' },
];

const gridOptions: VxeGridProps<RowType> = {
  columns: [
    { title: '序号', type: 'seq', width: 50 },
    {
      field: 'name',
      title: 'Name',
      filters: [
        { label: '张三', value: '张三' },
        { label: '李四', value: '李四' },
        { label: '王五', value: '王五' },
      ],
      filterMethod({ option, row }) {
        return row.name === option.value;
      },
    },
    {
      field: 'role',
      title: 'Role',
      filters: [
        { label: 'Admin', value: 'Admin' },
        { label: 'User', value: 'User' },
        { label: 'Guest', value: 'Guest' },
      ],
      filterMultiple: true,
      filterMethod({ option, row }) {
        return row.role === option.value;
      },
    },
    { field: 'age', title: 'Age' },
  ],
  data: tableData,
  pagerConfig: { enabled: false },
};

const [Grid] = useVbenVxeGrid({ gridOptions });
</script>

<template>
  <div class="w-full">
    <Grid />
  </div>
</template>
```

#### 列表多选（Checkbox）

```vue

```

#### 固定表头 / 固定列

```vue

```

#### 树形表格

```vue

```



------

### 🗂 数据交互与远程数据

1. **远程加载（Proxy Config）**
   支持通过 `proxyConfig.ajax.query` 自动处理分页 & 远程数据接口。 ([Vben Admin](https://doc.vben.pro/components/common-ui/vben-vxe-table.html?utm_source=chatgpt.com))
2. **自动合并分页 & 搜索参数**
   封装好 grid + form 联动，可自动组合分页与表单查询条件。 ([Vben Admin](https://doc.vben.pro/components/common-ui/vben-vxe-table.html?utm_source=chatgpt.com))

------

### 📌 视图展示增强

1. **树形表格**
   支持树形结构数据展示，并配置 `treeConfig` 控制父子关系。 ([Vben Admin](https://doc.vben.pro/components/common-ui/vben-vxe-table.html?utm_source=chatgpt.com))
2. **固定表头 / 固定列**
   支持把列固定在左侧或右侧以便横向滚动时可见。 ([Vben Admin](https://doc.vben.pro/components/common-ui/vben-vxe-table.html?utm_source=chatgpt.com))
3. **自定义单元格 / 渲染器**
   通过 `slots` 或自定义 cell renderer 为单元格插槽内容。 ([Vben Admin](https://doc.vben.pro/components/common-ui/vben-vxe-table.html?utm_source=chatgpt.com))
4. **插槽自定义渲染（Action 列等）**
   支持通过 `#action`、`#image-url` 等命名插槽渲染操作按钮或组件。 ([Vben Admin](https://doc.vben.pro/components/common-ui/vben-vxe-table.html?utm_source=chatgpt.com))

------

### 🔍 搜索 & 表单联动

1. **搜索表单集成（Vben Form）**
   表格顶部可以与搜索表单联动，用于快速查询。 ([Vben Admin](https://doc.vben.pro/components/common-ui/vben-vxe-table.html?utm_source=chatgpt.com))
2. **搜索表单 UI 控制**
   允许配置是否显示搜索控制按钮及自定义分隔条样式。 ([Vben Admin](https://doc.vben.pro/components/common-ui/vben-vxe-table.html?utm_source=chatgpt.com))

------

### ✏️ 编辑能力

1. **单元格编辑**
   使用 `editConfig.mode = 'cell'` 支持单元格直接编辑。 ([Vben Admin](https://doc.vben.pro/components/common-ui/vben-vxe-table.html?utm_source=chatgpt.com))
2. **行编辑**
   使用 `editConfig.mode = 'row'` 支持整行级别编辑模式。 ([Vben Admin](https://doc.vben.pro/components/common-ui/vben-vxe-table.html?utm_source=chatgpt.com))

------

### 👩‍💻 性能与扩展

1. **虚拟滚动**
   当数据量大时可开启虚拟滚动（`scrollY.enabled` + `gt`）提升性能。 ([Vben Admin](https://doc.vben.pro/components/common-ui/vben-vxe-table.html?utm_source=chatgpt.com))

------

### 🧩 开发 & API 支持

1. **useVbenVxeGrid Hook**
   提供 `gridApi` 操作表格实例，例如：
   - `setLoading()`
   - `reload()` / `query()`
   - `setGridOptions()` 等方法控制表格行为。 ([Vben Admin](https://doc.vben.pro/components/common-ui/vben-vxe-table.html?utm_source=chatgpt.com))
2. **Slots 定制工具栏**
   - `toolbar-actions` 左侧按钮区
   - `toolbar-tools` 右侧按钮区
   - `table-title` 表格标题插槽等。 ([Vben Admin](https://doc.vben.pro/components/common-ui/vben-vxe-table.html?utm_source=chatgpt.com))
3. **Props 定制能力**
   可以通过传给 `useVbenVxeGrid` 的参数细粒度控制：
   - `gridOptions`
   - `gridEvents`
   - `formOptions`
   - `showSearchForm`, `separator` 等。 ([Vben Admin](https://doc.vben.pro/components/common-ui/vben-vxe-table.html?utm_source=chatgpt.com))

------

## 📌 功能点结构化总结

| 类别            | 功能点                                  |
| --------------- | --------------------------------------- |
| **基础展示**    | 基础渲染、边框/斑马纹、排序、筛选、分页 |
| **数据 & 交互** | 远程加载、分页参数组合、搜索联动        |
| **复杂表格**    | 树形结构、固定列/表头、虚拟滚动         |
| **渲染扩展**    | 插槽单元格、渲染器、自定义操作列        |
| **编辑能力**    | 单元格编辑、整行编辑                    |
| **API & 插槽**  | gridApi、工具栏插槽、配置 Prop 接口     |

------

如果你还想要把这些整理成 **Markdown 文档版本 + 对应 Element Plus 适配映射对照表**（即官方功能 vs Element Plus 如何实现），我也可以继续输出。
