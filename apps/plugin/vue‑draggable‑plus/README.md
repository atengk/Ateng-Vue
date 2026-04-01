# VueDraggablePlus

支持 Vue2 和 Vue3 的拖拽组件

- [官网地址](https://vue-draggable-plus.pages.dev/)



## 基础配置

**安装依赖**

```
pnpm add vue-draggable-plus@0.6.0
```



## 最小示例

### 组件方式

```vue
<template>
  <VueDraggable ref="el" v-model="list">
    <div v-for="item in list" :key="item.id">
      {{ item.name }}
    </div>
  </VueDraggable>
  <div>
    数据：{{list}}
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
const list = ref([
  {
    name: 'Joao',
    id: 1
  },
  {
    name: 'Jean',
    id: 2
  },
  {
    name: 'Johanna',
    id: 3
  },
  {
    name: 'Juan',
    id: 4
  }
])
</script>
```

### 函数方式

```vue
<template>
  <div ref="el">
    <div v-for="item in list" :key="item.id">
      {{ item.name }}
    </div>
  </div>
  <div>
    数据：{{list}}
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDraggable } from 'vue-draggable-plus'

const el = ref()

const list = ref([
  {
    name: 'Joao',
    id: 1
  },
  {
    name: 'Jean',
    id: 2
  },
  {
    name: 'Johanna',
    id: 3
  },
  {
    name: 'Juan',
    id: 4
  }
])
// 返回值是一个对象，包含了一些方法，比如 start、destroy、pause 等
const draggable = useDraggable(el, list, {
  animation: 150,
  onStart() {
    console.log('start')
  },
  onUpdate() {
    console.log('update')
  }
})
</script>
```



## 基础拖拽排序

```vue
<template>
  <div class="drag-demo">
    <h2>基础拖拽排序</h2>
    <div ref="dragContainer" class="drag-container">
      <div v-for="item in list" :key="item.id" class="drag-item">
        {{ item.name }}
      </div>
    </div>
    <h3>当前顺序：</h3>
    <pre>{{ list }}</pre>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDraggable } from 'vue-draggable-plus'

const list = ref([
  { id: 1, name: 'A' },
  { id: 2, name: 'B' },
  { id: 3, name: 'C' },
  { id: 4, name: 'D' }
])

const dragContainer = ref<HTMLElement | null>(null)

const draggable = useDraggable(dragContainer, list, {
  animation: 150,
  onStart() { console.log('start') },
  onUpdate() { console.log('update', list.value) }
})
</script>

<style scoped>
.drag-container { border: 1px solid #ccc; padding: 8px; border-radius: 4px; background: #f9f9f9; }
.drag-item { padding: 10px; margin-bottom: 6px; background: #fff; border: 1px solid #ddd; border-radius: 4px; cursor: grab; user-select: none; transition: background 0.2s; }
.drag-item:active { cursor: grabbing; background: #e6f7ff; }
</style>
```

## 双列表互拖

```vue
<template>
  <div class="drag-demo">
    <h2>双列表互拖</h2>
    <div class="dual-list">
      <div ref="listAEl" class="drag-container">
        <div v-for="item in listA" :key="item.id" class="drag-item">{{ item.name }}</div>
      </div>
      <div ref="listBEl" class="drag-container">
        <div v-for="item in listB" :key="item.id" class="drag-item">{{ item.name }}</div>
      </div>
    </div>
    <h3>列表A：</h3>
    <pre>{{ listA }}</pre>
    <h3>列表B：</h3>
    <pre>{{ listB }}</pre>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDraggable } from 'vue-draggable-plus'

const listA = ref([
  { id: 1, name: 'A1' },
  { id: 2, name: 'A2' }
])
const listB = ref([
  { id: 3, name: 'B1' },
  { id: 4, name: 'B2' }
])

const listAEl = ref<HTMLElement | null>(null)
const listBEl = ref<HTMLElement | null>(null)

useDraggable(listAEl, listA, { group: 'dual', animation: 150 })
useDraggable(listBEl, listB, { group: 'dual', animation: 150 })
</script>

<style scoped>
.dual-list { display: flex; gap: 16px; }
.drag-container { flex: 1; border: 1px solid #ccc; padding: 8px; border-radius: 4px; background: #f9f9f9; }
.drag-item { padding: 8px; margin-bottom: 4px; background: #fff; border: 1px solid #ddd; cursor: grab; user-select: none; }
.drag-item:active { cursor: grabbing; background: #e6f7ff; }
</style>
```

## 拖拽手柄

```vue
<template>
  <div class="drag-demo">
    <h2>拖拽手柄</h2>
    <div ref="dragContainer" class="drag-container">
      <div v-for="item in list" :key="item.id" class="drag-item">
        <span class="handle">☰</span> {{ item.name }}
      </div>
    </div>
    <h3>当前顺序：</h3>
    <pre>{{ list }}</pre>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDraggable } from 'vue-draggable-plus'

const list = ref([
  { id: 1, name: 'A' },
  { id: 2, name: 'B' },
  { id: 3, name: 'C' }
])
const dragContainer = ref<HTMLElement | null>(null)

useDraggable(dragContainer, list, {
  handle: '.handle',
  animation: 150
})
</script>

<style scoped>
.drag-container { border: 1px solid #ccc; padding: 8px; border-radius: 4px; background: #f9f9f9; }
.drag-item { padding: 8px; margin-bottom: 4px; background: #fff; border: 1px solid #ddd; display: flex; align-items: center; cursor: grab; user-select: none; }
.handle { cursor: grab; margin-right: 8px; }
.drag-item:active { cursor: grabbing; background: #e6f7ff; }
</style>
```

## 拖拽复制

```vue
<template>
  <div class="drag-copy-demo">
    <h2>拖拽复制示例</h2>

    <div class="dual-lists">
      <!-- 源列表 -->
      <h4>源列表</h4>
      <section ref="sourceEl" class="drag-container">
        <div
            v-for="item in source"
            :key="item.id"
            class="drag-item"
        >
          <span class="handle">⠿</span>
          {{ item.name }}
        </div>
      </section>

      <!-- 目标列表 -->
      <h4>目标列表</h4>
      <section ref="targetEl" class="drag-container target">
        <div
            v-for="item in target"
            :key="item.id"
            class="drag-item"
        >
          <span class="handle">⠿</span>
          {{ item.name }}
        </div>
      </section>
    </div>

    <h3>目标列表数据：</h3>
    <pre>{{ target }}</pre>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDraggable } from 'vue-draggable-plus'

// 源列表
const source = ref([
  { id: '1', name: 'Joao' },
  { id: '2', name: 'Jean' },
  { id: '3', name: 'Johanna' },
  { id: '4', name: 'Juan' }
])

// 目标列表初始为空
const target = ref<{ id: string; name: string }[]>([])

// DOM 引用
const sourceEl = ref<HTMLElement | null>(null)
const targetEl = ref<HTMLElement | null>(null)

/**
 * 源列表拖拽（复制）
 * - group pull: clone，sort false
 * - clone 回调生成唯一 ID
 */
useDraggable(sourceEl, source, {
  animation: 200,
  handle: '.handle',
  group: { name: 'people', pull: 'clone', put: false },
  sort: false,
  clone(original) {
    const len = target.value.length
    return {
      name: `${original.name}-copy-${len + 1}`,
      id: `${original.id}-copy-${Date.now()}-${Math.random()}`
    }
  }
})

// 目标列表接收克隆项
useDraggable(targetEl, target, {
  animation: 200,
  handle: '.handle',
  group: 'people'
})
</script>

<style scoped>
.drag-copy-demo {
  max-width: 700px;
  margin: 20px auto;
  font-family: sans-serif;
}

.dual-lists {
  display: flex;
  gap: 16px;
}

.drag-container {
  flex: 1;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 12px;
  background-color: #f0f4f8;
  min-height: 200px;
  max-height: 350px;
  overflow-y: auto;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}

.drag-container.target {
  background-color: #fdf6f0;
}

.drag-item {
  display: flex;
  align-items: center;
  padding: 10px;
  margin-bottom: 6px;
  background-color: #fff;
  border-radius: 6px;
  border: 1px solid #ddd;
  cursor: grab;
  user-select: none;
  transition: background 0.2s;
}

.drag-item:active {
  cursor: grabbing;
  background-color: #e6f7ff;
}

.handle {
  cursor: grab;
  margin-right: 8px;
  font-weight: bold;
}
</style>
```

## 拖拽过渡动画

```vue
<template>
  <div class="drag-demo">
    <h2>拖拽过渡动画示例</h2>

    <!-- 拖拽容器 -->
    <div ref="dragContainer" class="drag-container">
      <div
          v-for="item in list"
          :key="item.id"
          class="drag-item"
      >
        {{ item.name }}
      </div>
    </div>

    <h3>当前顺序：</h3>
    <pre>{{ list }}</pre>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDraggable } from 'vue-draggable-plus'

const list = ref([
  { id: '1', name: '任务 A' },
  { id: '2', name: '任务 B' },
  { id: '3', name: '任务 C' },
  { id: '4', name: '任务 D' }
])

const dragContainer = ref<HTMLElement | null>(null)

useDraggable(dragContainer, list, {
  animation: 300, // 拖拽过渡动画
  onStart() { console.log('start') },
  onUpdate() { console.log('update') }
})
</script>

<style scoped>
.drag-container {
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 8px;
  background-color: #f9f9f9;
  min-height: 150px;
}
.drag-item {
  padding: 10px 12px;
  margin-bottom: 6px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: grab;
  user-select: none;
}
.drag-item:active { cursor: grabbing; background-color: #e6f7ff; }
</style>
```

## 表格行拖拽

```vue3
<template>
  <div class="table-row-drag">
    <h2>表格行拖拽示例</h2>

    <table class="drag-table">
      <thead>
        <tr>
          <th>序号</th>
          <th>名称</th>
          <th>年龄</th>
        </tr>
      </thead>
      <tbody ref="tableBody">
        <tr v-for="item in list" :key="item.id" class="drag-row">
          <td>{{ item.id }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.age }}</td>
        </tr>
      </tbody>
    </table>

    <h3>当前顺序：</h3>
    <pre>{{ list }}</pre>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDraggable } from 'vue-draggable-plus'

// 表格数据
const list = ref([
  { id: '1', name: 'Joao', age: 28 },
  { id: '2', name: 'Jean', age: 32 },
  { id: '3', name: 'Johanna', age: 25 },
  { id: '4', name: 'Juan', age: 30 }
])

const tableBody = ref<HTMLElement | null>(null)

// 初始化行拖拽
useDraggable(tableBody, list, {
  animation: 200,
  handle: '', // 整行可拖
})
</script>

<style scoped>
.drag-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 16px;
}
.drag-table th,
.drag-table td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: left;
}
.drag-row {
  background-color: #fff;
  cursor: grab;
  transition: background 0.2s;
}
.drag-row:active {
  cursor: grabbing;
  background-color: #e6f7ff;
}
</style>
```

## 表格列拖拽

```vue
<template>
  <div class="table-col-drag">
    <h2>表格列拖拽示例</h2>

    <table class="drag-table">
      <thead>
      <tr ref="theadRow">
        <th v-for="col in columns" :key="col.key" class="drag-col">
          {{ col.label }}
        </th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="row in rows" :key="row.id">
        <td v-for="col in columns" :key="col.key">{{ (row as any)[col.key] }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDraggable } from 'vue-draggable-plus'

// 列定义
const columns = ref([
  { key: 'id', label: 'ID' },
  { key: 'name', label: '名称' },
  { key: 'age', label: '年龄' }
])

// 行数据
const rows = ref([
  { id: 1, name: 'Joao', age: 28 },
  { id: 2, name: 'Jean', age: 32 },
  { id: 3, name: 'Johanna', age: 25 },
  { id: 4, name: 'Juan', age: 30 }
])

const theadRow = ref<HTMLElement | null>(null)

// 初始化列拖拽
useDraggable(theadRow, columns, {
  animation: 200,
  draggable: 'th',
  onUpdate() {
    // 更新列顺序时同步 rows 的显示顺序
    rows.value = rows.value.map(row => {
      const newRow: Record<string, any> = {}
      columns.value.forEach(col => {
        newRow[col.key] = (row as any)[col.key]
      })
      return newRow
    }) as typeof rows.value
  }
})
</script>

<style scoped>
.drag-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 16px;
}
.drag-table th,
.drag-table td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: left;
}
.drag-col {
  background-color: #f0f4f8;
  cursor: grab;
  transition: background 0.2s;
}
.drag-col:active {
  cursor: grabbing;
  background-color: #e6f7ff;
}
</style>
```

