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

### Form 表单

参考文档：[链接](https://doc.vben.pro/components/common-ui/vben-form.html)

### Vxe Table 表格

参考文档：[链接](https://doc.vben.pro/components/common-ui/vben-vxe-table.html)

