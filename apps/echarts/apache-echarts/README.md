# Apache ECharts

Apache ECharts 是一个强大的、交互式的浏览器图表和数据可视化库

- [官网地址](https://echarts.apache.org/)
- [Apache EChart示例](https://echarts.apache.org/examples/zh/index.html)



## 基础配置

**安装依赖**

```
pnpm add echarts@6.0.0
```

## 引入模块

### 全部引入

`src/main.ts`

```ts
import "echarts";  // 引入整个 ECharts
```

### 指定组件引入

新建 ECharts 注册文件，`src/plugins/echarts.ts`

```ts
import { use } from "echarts/core";

/** 渲染器 */
import { CanvasRenderer } from "echarts/renderers";

/** 图表类型 */
import {
  LineChart,
  BarChart,
  PieChart,
  ScatterChart,
} from "echarts/charts";

/** 组件 */
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  DataZoomComponent,
} from "echarts/components";

/** 注册 */
use([
  CanvasRenderer,

  LineChart,
  BarChart,
  PieChart,
  ScatterChart,

  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  DataZoomComponent,
]);
```

`src/main.ts`

```ts
/** 注册 ECharts 模块 */
import "@/plugins/echarts";
```

## 封装组件

### BaseChart.vue

`src/components/charts/BaseChart.vue`

```vue
<template>
  <div ref="elRef" class="chart"></div>
</template>

<script setup lang="ts">
import {ref, onMounted, onUnmounted, watch, toRaw} from "vue";
import type { PropType } from "vue";
import * as echarts from "echarts";
import type { ECharts, EChartsOption } from "echarts";

/**
 * 图表配置项
 */
const props = defineProps({
  option: {
    type: Object as PropType<any>,
    required: true
  }
});

/**
 * DOM 引用
 */
const elRef = ref<HTMLDivElement | null>(null);

/**
 * ECharts 实例
 */
let chart: ECharts | null = null;

/**
 * ResizeObserver 实例
 */
let resizeObserver: ResizeObserver | null = null;

/**
 * 初始化图表
 */
function initChart() {
  if (!elRef.value) {
    return;
  }

  chart = echarts.init(elRef.value);
  chart.setOption(props.option);
}

/**
 * 监听容器尺寸变化（比 window.resize 更可靠）
 */
function initResizeObserver() {
  if (!elRef.value) {
    return;
  }

  resizeObserver = new ResizeObserver(() => {
    chart?.resize();
  });

  resizeObserver.observe(elRef.value);
}

onMounted(() => {
  initChart();
  initResizeObserver();
});

watch(
    () => props.option,
    (opt) => {
      chart?.setOption(toRaw(opt) as EChartsOption, true);
    },
    { deep: true }
);

onUnmounted(() => {
  resizeObserver?.disconnect();
  resizeObserver = null;

  chart?.dispose();
  chart = null;
});
</script>

<style scoped>
.chart {
  width: 100%;
  height: 100%;
}
</style>
```

### 统一导出

`src/components/charts/index.ts`

```
export { default as BaseChart } from "./BaseChart.vue";
```



## 最简示例

```vue
<template>
  <!-- 父容器必须给高度 -->
  <div style="height: 400px">
    <BaseChart :option="chartOption" />
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import type {EChartsOption} from "echarts";
import {BaseChart} from "@/component/charts";

// 图表配置项（可使用 ECharts 的类型辅助）
const chartOption = ref<EChartsOption>({
  title: {
    text: "示例饼图",
    left: "center",
  },
  tooltip: {
    trigger: "item",
  },
  legend: {
    orient: "vertical",
    left: "left",
  },
  series: [
    {
      name: "访问来源",
      type: "pie",
      radius: "50%",
      data: [
        { value: 1048, name: "搜索引擎" },
        { value: 735, name: "直接访问" },
        { value: 580, name: "邮件营销" },
        { value: 484, name: "联盟广告" },
        { value: 300, name: "视频广告" },
      ],
    },
  ],
});
</script>

<style scoped>
</style>
```


