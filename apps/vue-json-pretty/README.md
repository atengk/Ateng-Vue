# Vue Json Pretty

一个JSON树视图组件，易于使用，还支持数据选择。

- [官网地址](https://github.com/leezng/vue-json-pretty)



## 基础配置

**安装依赖**

```
pnpm add vue-json-pretty@2.6.0
```



## 最简示例

```vue
<template>
  <div style="padding: 20px;">
    <VueJsonPretty
        :data="jsonData"
        :indent="4"
        :showLineNumber="true"
        theme="light"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
// 引入组件与样式
import VueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css'

// TS 声明 JSON 数据
const jsonData = ref<Record<string, any>>({
  name: "Vue3 + TS",
  version: 1,
  list: [1, 2, 3],
  nested: { hello: "world" }
})
</script>
```



## 基础展示 + 样式控制

功能重点：`data`、`indent`、`showLineNumber`、`showLine`、`theme`、`showIcon`、`deep`

- **data**：展示的 JSON 数据对象，用于渲染内容（必填）
- **indent**：缩进空格数，控制层级缩进（默认 2）
- **showLineNumber**：是否显示行号，便于定位行（默认 false）
- **showLine**：是否显示层级连接线，使结构更清晰（默认 false）
- **theme**：主题模式，可选 `light` / `dark`（默认 light）
- **showIcon**：是否显示展开折叠图标，提升可读性（默认 true）
- **deep**：初始化展开深度（默认 1，设置 -1 表示全部展开）

```vue
<template>
  <div style="padding: 16px;">
    <VueJsonPretty
        :data="json"
        :indent="2"
        :showLine="true"
        :showLineNumber="true"
        :showIcon="true"
        :deep="2"
        theme="light"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import VueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css'

const json = ref<Record<string, any>>({
  name: "demo",
  version: 1,
  items: [1,2,3],
  nested: {
    hello: "world",
    deeper: {
      level: 3,
      text: "visible when deep >= 2"
    }
  }
})
</script>
```

------

## 交互事件（选择 + 点击节点）

功能重点：`v-model:selectedValue`、`selectedChange`、`nodeClick`、`selectableType`、`showSelectController`、`selectOnClickNode`

- **v-model:selectedValue**：绑定当前选中的节点路径（支持单选/多选）
- **selectedChange**：选中路径变化事件 `(newVal, oldVal)`，用于监听路径选择变更
- **nodeClick**：节点点击事件，返回节点信息，可用于交互行为（如展开、定位等）
- **selectableType**：选择模式，可选 `single` 或 `multiple`，默认 `single`
- **showSelectController**：是否显示选择控制 UI（如复选框），默认 `false`
- **selectOnClickNode**：点击节点是否自动选中该节点，默认 `false`

```vue
<template>
  <div style="padding: 16px;">
    <VueJsonPretty
        :data="json"
        v-model:selectedValue="selected"
        selectableType="single"
        :showSelectController="true"
        :selectOnClickNode="true"
        @selectedChange="onSelectedChange"
        @nodeClick="onNodeClick"
    />
    <div style="margin-top: 12px;">
      当前选中路径: {{ selected }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import VueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css'

// 示例 JSON
const json = ref<Record<string, any>>({
  user: {
    id: 1,
    name: "Tony",
    tags: ["vue", "ts"]
  }
})

// 当前选中路径（v-model:selectedValue 绑定）
const selected = ref<string | string[]>([])

// 当选中值改变时触发
function onSelectedChange(newVal: string | string[], oldVal: string | string[]) {
  console.log("selectedChange:", { newVal, oldVal })
  selected.value = newVal
}

// 当节点点击时触发
function onNodeClick(payload: any) {
  console.log("nodeClick:", payload)
}
</script>
```

------

## 插槽自定义渲染

功能重点：`renderNodeKey`、`renderNodeValue`、`renderNodeActions` 自定义展示与操作

- **renderNodeKey**：用于自定义每个键（key）的渲染 UI，例如加颜色、加图标、大小写转换等；
- **renderNodeValue**：用于自定义每个值（value）的渲染 UI，例如高亮数字、字符串、null、bool 等；
- **renderNodeActions**：用于扩展节点的交互按钮（比如复制、查看详情、跳转等）；
- **defaultKey / defaultValue / defaultActions**：组件内置的默认渲染，可以按需保留（用于组合增强而不是覆盖）；
- **node**：当前节点数据对象，包含类型、值、路径等信息，可用于逻辑处理与定制展示；
- **适用场景**：当你需要在 JSON 树上实现富交互（如可视化字段、跳转、复制、右键扩展等）时，这类能力非常关键；

```vue
<template>
  <div style="padding: 16px;">
    <VueJsonPretty :data="json">

      <!-- 自定义 key 渲染 -->
      <template #renderNodeKey="{ node, defaultKey }">
        <span style="color: #42b983; font-weight: bold">
          {{ defaultKey }}
        </span>
      </template>

      <!-- 自定义 value 渲染 -->
      <template #renderNodeValue="{ node, defaultValue }">
        <span style="color: #e91e63">
          {{ defaultValue }}
        </span>
      </template>

      <!-- 自定义操作按钮示例 -->
      <template #renderNodeActions="{ node, defaultActions }">
        <button
            style="margin-left: 8px; font-size: 12px;"
            @click="handleClick(node)"
        >
          查看
        </button>
        <!-- 保留原本默认 actions（可选） -->
        <!-- {{ defaultActions }} -->
      </template>
    </VueJsonPretty>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import VueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css'

const json = ref<Record<string, any>>({
  status: "success",
  code: 200,
  data: { message: "Hello World" }
})

function handleClick(node: any) {
  console.log("查看节点:", node)
}
</script>
```

------

## 性能模式（虚拟滚动）

功能重点：`virtual` 适合超大 JSON（几千行）

- **virtual**：开启虚拟滚动，仅渲染可视区域的节点，大幅提升性能；
- **渲染策略**：避免一次性渲染全部 DOM 节点，解决浏览器卡顿和掉帧问题；
- **适用场景**：大数组、大对象（JSON 日志、接口返回、埋点数据等）；
- **依赖高度容器**：需要为外层容器设定固定高度并滚动，否则无效果；
- **配合参数**：
- - **showLineNumber**：超大 JSON 排查问题时更方便；
  - **showIcon**：展开折叠更直观；
- **数据规模建议**：1000 行以上差异明显，5000+ 行效果最佳；
- **注意事项**：
- - 虚拟模式下 *scroll 与展开行为较频繁*；
  - 节点高度为固定值，不支持动态高度计算；

```vue
<template>
  <div style="padding: 16px; height: 400px; overflow: auto;">
    <VueJsonPretty
      :data="json"
      virtual
      :showLineNumber="true"
      :showIcon="true"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import VueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css'

// 模拟 5000 行数据
const bigArray = Array.from({ length: 5000 }).map((_, i) => ({ id: i, value: Math.random() }))
const json = ref({ list: bigArray })
</script>
```

---

## JSON 可编辑

功能重点：`editable`、`beforeRemoveNode`、`beforeAddNode`、`beforeChangeNode`、`onChange`

- **editable**：开启编辑模式（允许新增、删除、修改节点）
- **beforeRemoveNode**：拦截删除节点前事件，可用于二次确认
- **beforeAddNode**：拦截新增节点前事件，可动态决定允许与否
- **beforeChangeNode**：拦截值修改前事件，可校验合法性
- **onChange**：数据变更回调，可获取变更后的 JSON

```vue
<template>
  <div style="padding: 16px;">
    <VueJsonPretty
        v-model:data="json"
        editable
        editableTrigger="dblclick"
        :showLineNumber="true"
        :showIcon="true"
        @change="onChange"
    />

    <div style="margin-top: 12px;">
      <strong>最新 JSON:</strong>
      <pre>{{ json }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import VueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css'

const json = ref<any>({
  name: "demo",
  version: 1,
  tags: ["vue", "ts"],
  nested: { hello: "world" }
})

// 当用户编辑结构/值时触发
function onChange(updatedJson: any) {
  console.log("JSON 更新:", updatedJson)
}
</script>
```

------

