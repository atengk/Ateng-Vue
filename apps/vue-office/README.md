# vue-office

支持多种文件(**docx、excel、pdf、pptx**)预览的vue组件库，支持vue2/3。也支持非Vue框架的预览。

- 一站式：提供word(.docx)、pdf、excel(.xlsx, .xls)、ppt(.pptx)多种文档的在线预览方案，有它就够了
- 简单：只需提供文档的src(网络地址)即可完成文档预览
- 体验好：选择每个文档的最佳预览方案，保证用户体验和性能都达到最佳状态
- 性能好：针对数据量较大做了优化

- [官网地址](https://github.com/501351981/vue-office)


## docx文件预览

**安装依赖**

```vue
pnpm add @vue-office/docx vue-demi@0.14.10
```

**添加ts类型**

```typescript
// src/types/vue-office-docx.d.ts
declare module '@vue-office/docx/lib/v3/vue-office-docx' {
    import { DefineComponent } from 'vue'
    const VueOfficeDocx: DefineComponent<any, any, any>
    export default VueOfficeDocx
}

declare module '@vue-office/docx/lib/v3/index.css'
```

**预览文件**

```vue
<script setup lang="ts">
//引入VueOfficeDocx组件
import VueOfficeDocx from '@vue-office/docx/lib/v3/vue-office-docx'
//引入相关样式
import '@vue-office/docx/lib/v3/index.css'

const docx = 'http://175.178.193.128:20033/kongyu/demo.docx'

function renderedHandler() {
  console.log("渲染完成")
}

function errorHandler() {
  console.log("渲染失败")
}
</script>

<template>
  <VueOfficeDocx
      :src="docx"
      style="height: 100vh;"
      @rendered="renderedHandler"
      @error="errorHandler"
  />
</template>

<style scoped>
</style>
```



## xlsx文件预览

**安装依赖**

```vue
pnpm add @vue-office/excel vue-demi@0.14.10
```

**添加ts类型**

```typescript
// src/types/vue-office-excel.d.ts
declare module '@vue-office/excel/lib/v3/vue-office-excel' {
    import { DefineComponent } from 'vue'
    const VueOfficeExcel: DefineComponent<any, any, any>
    export default VueOfficeExcel
}

declare module '@vue-office/excel/lib/v3/index.css'
```

**预览文件**

```vue
<script setup lang="ts">
//引入VueOfficeExcel组件
import VueOfficeExcel from '@vue-office/excel/lib/v3/vue-office-excel'
//引入相关样式
import '@vue-office/excel/lib/v3/index.css'

const excel = 'http://175.178.193.128:20033/kongyu/demo.xlsx'

const options = {}

function renderedHandler() {
  console.log("渲染完成")
}

function errorHandler() {
  console.log("渲染失败")
}
</script>

<template>
  <VueOfficeExcel
      :src="excel"
      :options="options"
      style="height: 100vh;"
      @rendered="renderedHandler"
      @error="errorHandler"
  />
</template>

<style scoped>
</style>
```



## pptx文件预览

**安装依赖**

```vue
pnpm add @vue-office/pptx vue-demi@0.14.10
```

**添加ts类型**

```typescript
// src/types/vue-office-pptx.d.ts
declare module '@vue-office/pptx/lib/v3/vue-office-pptx' {
    import { DefineComponent } from 'vue'
    const VueOfficePptx: DefineComponent<any, any, any>
    export default VueOfficePptx 
}
```

**预览文件**

```vue
<script setup lang="ts">
//引入VueOfficePptx组件
import VueOfficePptx from '@vue-office/pptx/lib/v3/vue-office-pptx'

const ppt = 'http://175.178.193.128:20033/kongyu/demo.pptx'

function renderedHandler() {
  console.log("渲染完成")
}

function errorHandler() {
  console.log("渲染失败")
}
</script>

<template>
  <VueOfficePptx
      :src="ppt"
      style="height: 100vh;"
      @rendered="renderedHandler"
      @error="errorHandler"
  />
</template>

<style scoped>
</style>
```



## pdf文件预览

**安装依赖**

```vue
pnpm add @vue-office/pdf vue-demi@0.14.10
```

**添加ts类型**

```typescript
// src/types/vue-office-pdf.d.ts
declare module '@vue-office/pdf/lib/v3/vue-office-pdf' {
    import { DefineComponent } from 'vue'
    const VueOfficePdf: DefineComponent<any, any, any>
    export default VueOfficePdf  
}
```

**预览文件**

```vue
<script setup lang="ts">
//引入VueOfficePdf 组件
import VueOfficePdf from '@vue-office/pdf/lib/v3/vue-office-pdf'

const pdf = 'http://175.178.193.128:20033/kongyu/demo.pdf'

function renderedHandler() {
  console.log("渲染完成")
}

function errorHandler() {
  console.log("渲染失败")
}
</script>

<template>
  <VueOfficePdf
      :src="pdf"
      style="height: 100vh;"
      @rendered="renderedHandler"
      @error="errorHandler"
  />
</template>

<style scoped>
</style>
```



