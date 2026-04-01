# Vue ECharts

Apache ECharts™ 的 Vue.js 组件。

- [官网地址](https://github.com/ecomfe/vue-echarts)
- [Apache EChart示例](https://echarts.apache.org/examples/zh/index.html)



## 基础配置

**安装依赖**

```
pnpm add echarts@6.0.0 vue-echarts@8.0.1
```

- `echarts` 是图表库核心
- `vue-echarts` 是官方的 Vue 3 组件封装（支持 TS）

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



## 最简示例

```vue
<template>
  <!-- VChart 是 vue-echarts 的主要组件 -->
  <VChart :option="chartOption" class="chart" />
</template>

<script setup lang="ts">
import {ref} from "vue";
import VChart from "vue-echarts";
import type {EChartsOption} from "echarts";

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

<style>
.chart {
  /* 必须指定高度，否则图表不会显示 */
  height: 400px;
}
</style>
```



## 基础图表类型（必做）

### 折线图 Line

---

#### 单折线图（最基础，出现频率最高）

```vue
<template>
  <VChart :option="chartOption" class="chart" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import VChart from "vue-echarts";
import type { EChartsOption } from "echarts";

const chartOption = ref<EChartsOption>({
  title: {
    text: "订单数量趋势",
    left: "center",
  },
  tooltip: {
    trigger: "axis",
  },
  xAxis: {
    type: "category",
    data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
  },
  yAxis: {
    type: "value",
  },
  series: [
    {
      name: "订单数",
      type: "line",
      data: [120, 200, 150, 80, 70, 110, 130],
    },
  ],
});
</script>

<style>
.chart {
  height: 400px;
}
</style>
```

📌 **典型用途**：

* 时间趋势
* 日 / 周 / 月统计

---

#### 多折线图（同比 / 环比 / 多指标对比）

```vue
<template>
  <VChart :option="chartOption" class="chart" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import VChart from "vue-echarts";
import type { EChartsOption } from "echarts";

const chartOption = ref<EChartsOption>({
  title: {
    text: "订单趋势对比",
    left: "center",
  },
  tooltip: {
    trigger: "axis",
  },
  legend: {
    bottom: 0,
  },
  xAxis: {
    type: "category",
    data: ["1月", "2月", "3月", "4月", "5月", "6月"],
  },
  yAxis: {
    type: "value",
  },
  series: [
    {
      name: "今年",
      type: "line",
      data: [820, 932, 901, 934, 1290, 1330],
    },
    {
      name: "去年",
      type: "line",
      data: [620, 732, 701, 734, 1090, 1130],
    },
  ],
});
</script>

<style>
.chart {
  height: 400px;
}
</style>
```

📌 **典型用途**：

* 同比 / 环比
* 多业务线对比

---

#### 平滑折线图（更偏视觉展示）

```vue
<template>
  <VChart :option="chartOption" class="chart" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import VChart from "vue-echarts";
import type { EChartsOption } from "echarts";

const chartOption = ref<EChartsOption>({
  title: {
    text: "访问量趋势（平滑）",
    left: "center",
  },
  tooltip: {
    trigger: "axis",
  },
  xAxis: {
    type: "category",
    data: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00"],
  },
  yAxis: {
    type: "value",
  },
  series: [
    {
      name: "访问量",
      type: "line",
      smooth: true,
      data: [120, 200, 150, 300, 280, 350],
    },
  ],
});
</script>

<style>
.chart {
  height: 400px;
}
</style>
```

📌 **常见于**：

* 大屏
* 实时监控
* 视觉型页面

---

#### 面积折线图（趋势感最强）

```vue
<template>
  <VChart :option="chartOption" class="chart" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import VChart from "vue-echarts";
import type { EChartsOption } from "echarts";

const chartOption = ref<EChartsOption>({
  title: {
    text: "用户增长趋势",
    left: "center",
  },
  tooltip: {
    trigger: "axis",
  },
  xAxis: {
    type: "category",
    boundaryGap: false,
    data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
  },
  yAxis: {
    type: "value",
  },
  series: [
    {
      name: "新增用户",
      type: "line",
      areaStyle: {},
      data: [120, 180, 260, 300, 380, 420, 500],
    },
  ],
});
</script>

<style>
.chart {
  height: 400px;
}
</style>
```

📌 **非常适合**：

* 增长曲线
* 累积趋势
* 数据看板

---

### 柱状图 Bar

---

#### 单柱状图（最基础）

```vue
<template>
  <VChart :option="chartOption" class="chart" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import VChart from "vue-echarts";
import type { EChartsOption } from "echarts";

const chartOption = ref<EChartsOption>({
  title: {
    text: "每日订单数量",
    left: "center",
  },
  tooltip: {
    trigger: "axis",
  },
  xAxis: {
    type: "category",
    data: ["周一", "周二", "周三", "周四", "周五"],
  },
  yAxis: {
    type: "value",
  },
  series: [
    {
      name: "订单数",
      type: "bar",
      data: [120, 200, 150, 80, 70],
    },
  ],
});
</script>

<style>
.chart {
  height: 400px;
}
</style>
```

🔑 关键参数说明

* `type: "bar"`
  👉 指定为柱状图
* `xAxis.type = "category"`
  👉 类目轴（字符串分类）
* `yAxis.type = "value"`
  👉 数值轴（自动刻度）

---

#### 分组柱状图（对比最常用）

```vue
<template>
  <VChart :option="chartOption" class="chart" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import VChart from "vue-echarts";
import type { EChartsOption } from "echarts";

const chartOption = ref<EChartsOption>({
  title: {
    text: "部门业绩对比",
    left: "center",
  },
  tooltip: {
    trigger: "axis",
  },
  legend: {
    bottom: 0,
  },
  xAxis: {
    type: "category",
    data: ["销售部", "技术部", "市场部"],
  },
  yAxis: {
    type: "value",
  },
  series: [
    {
      name: "今年",
      type: "bar",
      data: [320, 332, 301],
    },
    {
      name: "去年",
      type: "bar",
      data: [220, 182, 191],
    },
  ],
});
</script>

<style>
.chart {
  height: 400px;
}
</style>
```

🔑 关键参数说明

* `legend`
  👉 控制系列说明（可点选显示/隐藏）
* 多个 `series` 且 `type: "bar"`
  👉 **自动形成分组效果**
* `series[i].name`
  👉 与 legend 一一对应

---

#### 堆叠柱状图（结构 / 总量）

```vue
<template>
  <VChart :option="chartOption" class="chart" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import VChart from "vue-echarts";
import type { EChartsOption } from "echarts";

const chartOption = ref<EChartsOption>({
  title: {
    text: "订单来源构成",
    left: "center",
  },
  tooltip: {
    trigger: "axis",
  },
  legend: {
    bottom: 0,
  },
  xAxis: {
    type: "category",
    data: ["周一", "周二", "周三", "周四"],
  },
  yAxis: {
    type: "value",
  },
  series: [
    {
      name: "线上",
      type: "bar",
      stack: "total",
      data: [120, 132, 101, 134],
    },
    {
      name: "线下",
      type: "bar",
      stack: "total",
      data: [220, 182, 191, 234],
    },
  ],
});
</script>

<style>
.chart {
  height: 400px;
}
</style>
```

🔑 关键参数说明

* `stack: "total"`
  👉 **相同 stack 值的柱子会叠加**
* 用于：

  * 构成分析
  * 总量 + 明细

---

#### 横向柱状图（排行榜必用）

```vue
<template>
  <VChart :option="chartOption" class="chart" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import VChart from "vue-echarts";
import type { EChartsOption } from "echarts";

const chartOption = ref<EChartsOption>({
  title: {
    text: "销售排行榜",
    left: "center",
  },
  tooltip: {
    trigger: "axis",
  },
  xAxis: {
    type: "value",
  },
  yAxis: {
    type: "category",
    data: ["北京", "上海", "广州", "深圳"],
  },
  series: [
    {
      name: "销售额",
      type: "bar",
      data: [500, 420, 380, 300],
    },
  ],
});
</script>

<style>
.chart {
  height: 400px;
}
</style>
```

🔑 关键参数说明

* **横向的本质**
  * `xAxis.type = "value"`
  * `yAxis.type = "category"`
* 非常适合：

  * 排行榜
  * Top N

---

### 饼图 Pie

---

#### 基础饼图（结构 / 占比）

```vue
<template>
  <VChart :option="chartOption" class="chart" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import VChart from "vue-echarts";
import type { EChartsOption } from "echarts";

const chartOption = ref<EChartsOption>({
  title: {
    text: "访问来源占比",
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

<style>
.chart {
  height: 400px;
}
</style>
```

🔑 关键参数说明

* `type: "pie"`
  👉 指定饼图
* `radius: "50%"`
  👉 饼图半径（百分比相对于容器）
* `tooltip.trigger = "item"`
  👉 鼠标悬浮到“某一块”触发

---

#### 环形图（最常用版本）

```vue
<template>
  <VChart :option="chartOption" class="chart" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import VChart from "vue-echarts";
import type { EChartsOption } from "echarts";

const chartOption = ref<EChartsOption>({
  title: {
    text: "订单渠道占比",
    left: "center",
  },
  tooltip: {
    trigger: "item",
  },
  legend: {
    bottom: 0,
  },
  series: [
    {
      name: "渠道",
      type: "pie",
      radius: ["40%", "70%"],
      data: [
        { value: 500, name: "APP" },
        { value: 300, name: "小程序" },
        { value: 200, name: "PC" },
      ],
    },
  ],
});
</script>

<style>
.chart {
  height: 400px;
}
</style>
```

🔑 关键参数说明

* `radius: ["40%", "70%"]`
  👉

  * 内半径：40%
  * 外半径：70%
    → **形成中空的环形**
* 环形图比普通饼图：

  * 更现代
  * 更适合大屏 / 后台

---

#### 玫瑰图（南丁格尔图）

```vue
<template>
  <VChart :option="chartOption" class="chart" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import VChart from "vue-echarts";
import type { EChartsOption } from "echarts";

const chartOption = ref<EChartsOption>({
  title: {
    text: "用户活跃度分布",
    left: "center",
  },
  tooltip: {
    trigger: "item",
  },
  legend: {
    bottom: 0,
  },
  series: [
    {
      name: "活跃度",
      type: "pie",
      roseType: "radius",
      radius: ["20%", "70%"],
      data: [
        { value: 40, name: "极高" },
        { value: 33, name: "较高" },
        { value: 28, name: "一般" },
        { value: 22, name: "较低" },
        { value: 20, name: "很低" },
      ],
    },
  ],
});
</script>

<style>
.chart {
  height: 400px;
}
</style>
```

🔑 关键参数说明

* `roseType: "radius"`
  👉 用“半径大小”表示数值大小
* `roseType` 常见值：

  * `"radius"`：半径变化（最常用）
  * `"area"`：面积变化（不太常用）
* **更偏展示型图表**

  * 适合大屏
  * 不适合精确对比

---

### 散点图 Scatter

---

#### 普通散点图（分布 / 相关性）

```vue
<template>
  <VChart :option="chartOption" class="chart" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import VChart from "vue-echarts";
import type { EChartsOption } from "echarts";

const chartOption = ref<EChartsOption>({
  title: {
    text: "用户行为分布",
    left: "center",
  },
  tooltip: {
    trigger: "item",
  },
  xAxis: {
    type: "value",
    name: "访问次数",
  },
  yAxis: {
    type: "value",
    name: "停留时长（分钟）",
  },
  series: [
    {
      name: "用户",
      type: "scatter",
      data: [
        [10, 5],
        [20, 20],
        [30, 15],
        [40, 25],
        [50, 30],
      ],
    },
  ],
});
</script>

<style>
.chart {
  height: 400px;
}
</style>
```

🔑 关键参数说明

* `type: "scatter"`
  👉 散点图
* `data: [[x, y]]`
  👉 **每个点就是一组坐标**
* `xAxis / yAxis.type = "value"`
  👉 连续数值轴（散点图必备）

---

#### 气泡图（散点 + 大小维度）

```vue
<template>
  <VChart :option="chartOption" class="chart" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import VChart from "vue-echarts";
import type { EChartsOption } from "echarts";

const chartOption = ref<EChartsOption>({
  title: {
    text: "用户价值分布",
    left: "center",
  },
  tooltip: {
    trigger: "item",
    formatter: (params: any) => {
      const [x, y, size] = params.value;
      return `
        访问次数：${x}<br/>
        停留时长：${y} 分钟<br/>
        消费金额：${size} 元
      `;
    },
  },
  xAxis: {
    type: "value",
    name: "访问次数",
  },
  yAxis: {
    type: "value",
    name: "停留时长（分钟）",
  },
  series: [
    {
      name: "用户",
      type: "scatter",
      symbolSize: (value: number[]) => {
        return value[2] / 10;
      },
      data: [
        [10, 5, 100],
        [20, 20, 300],
        [30, 15, 500],
        [40, 25, 800],
        [50, 30, 1200],
      ],
    },
  ],
});
</script>

<style>
.chart {
  height: 400px;
}
</style>
```

🔑 关键参数说明

* `data: [[x, y, size]]`
  👉 第 3 个值用于控制气泡大小
* `symbolSize(value)`
  👉

  * `value[0]` → x
  * `value[1]` → y
  * `value[2]` → 气泡大小依据
* 气泡图常用于：

  * 用户价值分析
  * 多维度对比

---

## 通用组件（所有图表都会用）

> 说明：
> 下面示例统一用 **折线 / 柱状图**，因为这些组件与图表类型无关。

---

### 标题 Title

---

#### 主标题 + 副标题（居中）

```vue
<template>
  <VChart :option="chartOption" class="chart" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import VChart from "vue-echarts";
import type { EChartsOption } from "echarts";

const chartOption = ref<EChartsOption>({
  title: {
    text: "用户增长趋势",
    subtext: "近 7 天",
    left: "center",
  },
  xAxis: {
    type: "category",
    data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
  },
  yAxis: {
    type: "value",
  },
  series: [
    {
      type: "line",
      data: [120, 200, 150, 300, 280, 350, 400],
    },
  ],
});
</script>

<style>
.chart {
  height: 400px;
}
</style>
```

🔑 关键参数

* `title.text`：主标题
* `title.subtext`：副标题（时间范围、说明）
* `title.left = "center"`：整体居中（最常见）

---

#### 左对齐标题（后台系统更常见）

```ts
title: {
  text: "订单统计",
  left: "left"
}
```

📌 **经验结论**

* 后台 CRUD / 统计页：**左对齐**
* 大屏 / 看板：**居中**

---

### 提示框 Tooltip（⭐ 高频）

---

#### item 触发（饼图 / 散点）

```vue
<template>
  <VChart :option="chartOption" class="chart" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import VChart from "vue-echarts";
import type { EChartsOption } from "echarts";

const chartOption = ref<EChartsOption>({
  title: {
    text: "访问来源",
    left: "center",
  },
  tooltip: {
    trigger: "item",
  },
  series: [
    {
      type: "pie",
      radius: "50%",
      data: [
        { value: 40, name: "搜索引擎" },
        { value: 30, name: "直接访问" },
        { value: 20, name: "广告" },
        { value: 10, name: "其他" },
      ],
    },
  ],
});
</script>

<style>
.chart {
  height: 400px;
}
</style>
```

🔑 关键参数

* `trigger: "item"`
  👉 鼠标指到 **某一个数据项** 触发
* 常用于：饼图 / 散点 / 气泡

---

#### axis 触发（折线 / 柱状 ⭐最常用）

```vue
<template>
  <VChart :option="chartOption" class="chart" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import VChart from "vue-echarts";
import type { EChartsOption } from "echarts";

const chartOption = ref<EChartsOption>({
  title: {
    text: "订单趋势",
    left: "center",
  },
  tooltip: {
    trigger: "axis",
  },
  xAxis: {
    type: "category",
    data: ["周一", "周二", "周三", "周四"],
  },
  yAxis: {
    type: "value",
  },
  series: [
    { name: "订单数", type: "line", data: [120, 200, 150, 80] },
    { name: "支付数", type: "line", data: [100, 180, 130, 60] },
  ],
});
</script>

<style>
.chart {
  height: 400px;
}
</style>
```

🔑 关键参数

* `trigger: "axis"`
  👉 **同一 X 轴的所有系列一起显示**
* 多折线 / 分组柱 **必须用这个**

---

#### 自定义 formatter（真实业务必用）

```ts
tooltip: {
  trigger: "axis",
  formatter: (params: any[]) => {
    let result = `${params[0].axisValue}<br/>`;
    params.forEach(item => {
      result += `${item.marker}${item.seriesName}：${item.value}<br/>`;
    });
    return result;
  }
}
```

📌 用途：

* 单位转换
* 拼中文说明
* 接口字段不直观时

---

### 图例 Legend

---

#### 横向图例（默认）

```ts
legend: {
  bottom: 0
}
```

👉 多折线 / 多柱状 **90% 用这种**

---

#### 纵向图例（常配合饼图）

```ts
legend: {
  orient: "vertical",
  left: "left"
}
```

---

#### 滚动 Legend（数据多时）

```ts
legend: {
  type: "scroll",
  bottom: 0
}
```

🔑 关键点

* `type: "scroll"`
  👉 legend 太多时自动滚动
* legend 默认支持：

  * 点击显示 / 隐藏系列（**不用额外代码**）

---

### 坐标轴 Axis（非常重要）

---

#### 类目轴 + 数值轴（最常见）

```ts
xAxis: {
  type: "category",
  data: ["周一", "周二", "周三"]
},
yAxis: {
  type: "value"
}
```

🔑 含义

* `category`：字符串分类
* `value`：连续数值（自动刻度）

---

#### 双 Y 轴（左右）

```vue
<template>
  <VChart :option="chartOption" class="chart" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import VChart from "vue-echarts";
import type { EChartsOption } from "echarts";

const chartOption = ref<EChartsOption>({
  title: {
    text: "销售与转化率",
    left: "center",
  },
  tooltip: {
    trigger: "axis",
  },
  xAxis: {
    type: "category",
    data: ["1月", "2月", "3月", "4月"],
  },
  yAxis: [
    {
      type: "value",
      name: "销售额",
    },
    {
      type: "value",
      name: "转化率",
      axisLabel: {
        formatter: "{value} %",
      },
    },
  ],
  series: [
    {
      name: "销售额",
      type: "bar",
      yAxisIndex: 0,
      data: [500, 700, 600, 800],
    },
    {
      name: "转化率",
      type: "line",
      yAxisIndex: 1,
      data: [20, 25, 22, 30],
    },
  ],
});
</script>

<style>
.chart {
  height: 400px;
}
</style>
```

🔑 关键参数

* `yAxis: []`
  👉 多个 Y 轴
* `yAxisIndex`
  👉 指定用左轴还是右轴
* **典型组合**：柱 + 折线

---

## 交互能力（做完立刻「像产品」）

---

### 数据缩放 DataZoom（时间序列必备）

---

#### 滑块缩放（最常用）

```vue
<template>
  <VChart :option="chartOption" class="chart" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import VChart from "vue-echarts";
import type { EChartsOption } from "echarts";

const chartOption = ref<EChartsOption>({
  title: {
    text: "订单趋势（可缩放）",
    left: "center",
  },
  tooltip: {
    trigger: "axis",
  },
  xAxis: {
    type: "category",
    data: [
      "1月","2月","3月","4月","5月","6月",
      "7月","8月","9月","10月","11月","12月"
    ],
  },
  yAxis: {
    type: "value",
  },
  dataZoom: [
    {
      type: "slider",
      start: 0,
      end: 50,
    },
  ],
  series: [
    {
      name: "订单数",
      type: "line",
      data: [120, 200, 150, 80, 70, 110, 130, 160, 180, 220, 260, 300],
    },
  ],
});
</script>

<style>
.chart {
  height: 400px;
}
</style>
```

🔑 关键参数说明

* `dataZoom.type = "slider"`
  👉 底部显示拖动滑块
* `start / end`
  👉 初始显示百分比区间
* **非常适合**：

  * 时间跨度大
  * 数据点很多

---

#### 鼠标滚轮缩放（高级但常用）

```vue
<template>
  <VChart :option="chartOption" class="chart" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import VChart from "vue-echarts";
import type { EChartsOption } from "echarts";

const chartOption = ref<EChartsOption>({
  title: {
    text: "访问趋势（滚轮缩放）",
    left: "center",
  },
  tooltip: {
    trigger: "axis",
  },
  xAxis: {
    type: "category",
    data: Array.from({ length: 30 }, (_, i) => `第 ${i + 1} 天`),
  },
  yAxis: {
    type: "value",
  },
  dataZoom: [
    {
      type: "inside",
    },
  ],
  series: [
    {
      type: "line",
      data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 300)),
    },
  ],
});
</script>

<style>
.chart {
  height: 400px;
}
</style>
```

🔑 关键参数说明

* `type: "inside"`
  👉 鼠标滚轮缩放 + 拖拽
* 常与 `slider` **一起用**（一个看得见，一个好操作）

---

### 高亮 / 选中（几乎“白送”的交互）

---

#### 鼠标悬浮高亮（默认就有）

```ts
series: [
  {
    type: "line",
    emphasis: {
      focus: "series",
    },
    data: [120, 200, 150, 80],
  },
]
```

🔑 关键参数说明

* `emphasis.focus = "series"`
  👉 鼠标移上去时，高亮当前系列，弱化其他
* 非常适合：

  * 多折线
  * 多柱状图

---

#### 图例点击联动（无需写代码）

```ts
legend: {
  bottom: 0
}
```

📌 **重要认知**

* Legend 默认支持：

  * 点击显示 / 隐藏 series
* **这是 ECharts 自带行为**
* 实际项目中：

  * 很多“筛选需求”用 legend 就够了

---

### 图表事件（业务联动核心）

---

#### 点击事件（最常用）

```vue
<template>
  <VChart
    :option="chartOption"
    class="chart"
    @click="handleClick"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import VChart from "vue-echarts";
import type { EChartsOption } from "echarts";

const chartOption = ref<EChartsOption>({
  title: {
    text: "订单点击分析",
    left: "center",
  },
  xAxis: {
    type: "category",
    data: ["周一", "周二", "周三"],
  },
  yAxis: {
    type: "value",
  },
  series: [
    {
      type: "bar",
      data: [120, 200, 150],
    },
  ],
});

function handleClick(params: any) {
  console.log("点击数据：", params);
  console.log("类目：", params.name);
  console.log("值：", params.value);
}
</script>

<style>
.chart {
  height: 400px;
}
</style>
```

🔑 关键参数说明

* `@click`
  👉 直接监听图表点击
* `params.name`
  👉 X 轴类目
* `params.value`
  👉 当前值

📌 **真实用途**

* 点击跳转详情页
* 点击作为筛选条件

---

#### mouseover（悬浮联动）

```html
<VChart @mouseover="handleHover" />
```

```ts
function handleHover(params: any) {
  console.log("悬浮到：", params.seriesName);
}
```

👉 用于：

* 同步展示其他组件
* 悬浮联动表格

---

#### legendselectchanged（图例变化）

```vue
<VChart
  :option="chartOption"
  @legendselectchanged="handleLegendChange"
/>
```

```ts
function handleLegendChange(params: any) {
  console.log("当前选中状态：", params.selected);
}
```

🔑 关键参数说明

* `params.selected`
  👉 `{ 系列名: true | false }`
* 非常适合：

  * 自定义筛选逻辑
  * 联动其他图表

---

## 样式与视觉（大屏 / 设计稿必做）

---

### 颜色 Color

---

#### 全局调色板（推荐做法）

```vue
<template>
  <VChart :option="chartOption" class="chart" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import VChart from "vue-echarts";
import type { EChartsOption } from "echarts";

const chartOption = ref<EChartsOption>({
  color: ["#5470C6", "#91CC75", "#FAC858", "#EE6666"],
  title: {
    text: "订单趋势",
    left: "center",
  },
  tooltip: {
    trigger: "axis",
  },
  xAxis: {
    type: "category",
    data: ["周一", "周二", "周三", "周四"],
  },
  yAxis: {
    type: "value",
  },
  series: [
    { name: "下单", type: "line", data: [120, 200, 150, 80] },
    { name: "支付", type: "line", data: [100, 180, 130, 60] },
  ],
});
</script>

<style>
.chart {
  height: 400px;
}
</style>
```

🔑 关键参数说明

* `color: []`
  👉 **全局调色板**
* series 会按顺序自动取色
* **真实项目强烈建议统一维护一套**

---

#### 单 series 指定颜色

```ts
series: [
  {
    type: "bar",
    itemStyle: {
      color: "#73C0DE",
    },
    data: [120, 200, 150],
  },
]
```

👉 用于：

* 强调某条线
* 固定业务颜色（如“成功 / 失败”）

---

#### 状态颜色（hover 高亮）

```ts
series: [
  {
    type: "bar",
    itemStyle: {
      color: "#91CC75",
    },
    emphasis: {
      itemStyle: {
        color: "#5470C6",
      },
    },
    data: [120, 200, 150],
  },
]
```

🔑 说明

* `emphasis`
  👉 鼠标悬浮时的样式
* 常用于：

  * 大屏
  * 可点击图表

---

### 标签 Label

---

#### 显示 / 隐藏标签

```ts
series: [
  {
    type: "bar",
    label: {
      show: true,
    },
    data: [120, 200, 150],
  },
]
```

📌 **经验**

* 普通统计页：多半关
* 大屏 / KPI：常开

---

#### 内部 / 外部标签（饼图）

```vue
<template>
  <VChart :option="chartOption" class="chart" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import VChart from "vue-echarts";
import type { EChartsOption } from "echarts";

const chartOption = ref<EChartsOption>({
  title: {
    text: "渠道占比",
    left: "center",
  },
  series: [
    {
      type: "pie",
      radius: "50%",
      label: {
        position: "outside",
      },
      data: [
        { value: 40, name: "APP" },
        { value: 30, name: "小程序" },
        { value: 30, name: "PC" },
      ],
    },
  ],
});
</script>

<style>
.chart {
  height: 400px;
}
</style>
```

常用 `position`

* `"inside"`
* `"outside"`
* `"center"`（环形图）

---

#### 自定义格式（最实用）

```ts
label: {
  show: true,
  formatter: "{b}: {c} ({d}%)",
}
```

🔑 占位符

* `{b}`：名称
* `{c}`：值
* `{d}`：百分比（饼图）

---

### 网格 Grid（布局神器）

---

#### 控制图表边距

```ts
grid: {
  left: 40,
  right: 20,
  top: 60,
  bottom: 40,
}
```

📌 **解决的问题**

* 轴标签被裁剪
* 标题 / legend 挤在一起

---

#### 多图表布局对齐（核心）

```vue
<template>
  <VChart :option="chartOption" class="chart" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import VChart from "vue-echarts";
import type { EChartsOption } from "echarts";

const chartOption = ref<EChartsOption>({
  grid: [
    { top: 50, height: "35%" },
    { bottom: 40, height: "35%" },
  ],
  xAxis: [
    { type: "category", data: ["A", "B", "C"] },
    { type: "category", data: ["A", "B", "C"], gridIndex: 1 },
  ],
  yAxis: [
    { type: "value" },
    { type: "value", gridIndex: 1 },
  ],
  series: [
    { type: "bar", data: [120, 200, 150] },
    { type: "line", data: [80, 100, 90], xAxisIndex: 1, yAxisIndex: 1 },
  ],
});
</script>

<style>
.chart {
  height: 500px;
}
</style>
```

🔑 关键认知

* `grid / xAxis / yAxis / series` **一一对应**
* 多图同轴对齐的唯一正确方式

---

### 背景与边框

---

#### Chart 背景色（大屏必用）

```ts
backgroundColor: "#0f1c3c"
```

👉 直接加在 option 根节点

---

#### Tooltip 背景 & 边框

```ts
tooltip: {
  backgroundColor: "rgba(0,0,0,0.7)",
  borderColor: "#333",
  borderWidth: 1,
  textStyle: {
    color: "#fff",
  },
}
```

📌 **设计稿还原关键点**

* tooltip 不要默认白底
* 字体颜色必须对比明显

---

## 数据相关（真实业务一定会碰）

---

### 空数据处理

> **90% 业务 Bug 来自：接口返回空数组 / null**

---

#### 无数据占位（最推荐）

```vue
<template>
  <div class="chart-wrapper">
    <div v-if="!hasData" class="empty">暂无数据</div>
    <VChart v-else :option="chartOption" class="chart" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import VChart from "vue-echarts";
import type { EChartsOption } from "echarts";

const rawData = ref<number[]>([]);

const hasData = computed(() => rawData.value.length > 0);

const chartOption = computed<EChartsOption>(() => ({
  xAxis: {
    type: "category",
    data: ["A", "B", "C"],
  },
  yAxis: {
    type: "value",
  },
  series: [
    {
      type: "bar",
      data: rawData.value,
    },
  ],
}));
</script>

<style>
.chart-wrapper {
  position: relative;
  height: 400px;
}
.chart {
  height: 100%;
}
.empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #999;
  font-size: 14px;
}
</style>
```

🔑 关键点

* **不要让 ECharts 自己“空跑”**
* 空态交给 Vue 控制，最稳定
* 占位可以换成 Skeleton / Empty 组件

---

#### 数据为 0 的展示策略（很容易搞错）

```ts
const rawData = ref<number[]>([0, 0, 0]);
```

👉 **注意区分两种情况：**

| 情况      | 是否展示图表               |
| --------- | -------------------------- |
| `[]`      | ❌ 不展示                   |
| `[0,0,0]` | ✅ 展示（业务上是“有数据”） |

推荐判断逻辑

```ts
const hasData = computed(() =>
  rawData.value.length > 0
);
```

❌ 不要写成 `some(v > 0)`
否则 **全 0 会被误判为无数据**

---

### 动态更新数据

---

#### 接口返回后更新 option（核心）

```vue
<template>
  <VChart :option="chartOption" class="chart" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import VChart from "vue-echarts";
import type { EChartsOption } from "echarts";

const chartOption = ref<EChartsOption>({
  xAxis: {
    type: "category",
    data: [],
  },
  yAxis: {
    type: "value",
  },
  series: [
    {
      type: "line",
      data: [],
    },
  ],
});

function loadData() {
  // 模拟接口
  setTimeout(() => {
    chartOption.value = {
      ...chartOption.value,
      xAxis: {
        type: "category",
        data: ["周一", "周二", "周三"],
      },
      series: [
        {
          type: "line",
          data: [120, 200, 150],
        },
      ],
    };
  }, 1000);
}

loadData();
</script>

<style>
.chart {
  height: 400px;
}
</style>
```

🔑 核心认知

* **直接替换 option** 是最稳的
* vue-echarts 会自动 `setOption`

❌ 不推荐深层 `option.series[0].data.push`

---

#### 切换条件重新渲染（筛选 / Tab）

```vue
<template>
  <div>
    <button @click="changeType('week')">周</button>
    <button @click="changeType('month')">月</button>
    <VChart :option="chartOption" class="chart" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import VChart from "vue-echarts";
import type { EChartsOption } from "echarts";

const chartOption = ref<EChartsOption>({});
const type = ref<"week" | "month">("week");

function changeType(val: "week" | "month") {
  type.value = val;
  updateChart();
}

function updateChart() {
  chartOption.value =
    type.value === "week"
      ? {
          xAxis: { type: "category", data: ["周一", "周二"] },
          yAxis: { type: "value" },
          series: [{ type: "bar", data: [10, 20] }],
        }
      : {
          xAxis: { type: "category", data: ["1月", "2月"] },
          yAxis: { type: "value" },
          series: [{ type: "bar", data: [200, 300] }],
        };
}

updateChart();
</script>

<style>
.chart {
  height: 400px;
}
</style>
```

📌 **这就是 90% 筛选场景**

---

### Loading 状态

---

#### 数据加载中（推荐方案）

```vue
<template>
  <div class="chart-wrapper">
    <div v-if="loading" class="loading">加载中...</div>
    <VChart v-else :option="chartOption" class="chart" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import VChart from "vue-echarts";
import type { EChartsOption } from "echarts";

const loading = ref(true);

const chartOption = ref<EChartsOption>({
  xAxis: {
    type: "category",
    data: ["A", "B", "C"],
  },
  yAxis: {
    type: "value",
  },
  series: [
    {
      type: "bar",
      data: [120, 200, 150],
    },
  ],
});

setTimeout(() => {
  loading.value = false;
}, 1500);
</script>

<style>
.chart-wrapper {
  height: 400px;
  position: relative;
}
.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.chart {
  height: 100%;
}
</style>
```

🔑 原则

* **Loading 不交给 ECharts**
* 交给 Vue 控制最清晰

---

#### 请求失败兜底（必须有）

```vue
<template>
  <div class="chart-wrapper">
    <div v-if="error" class="error">数据加载失败</div>
    <VChart v-else :option="chartOption" class="chart" />
  </div>
</template>
```

```ts
const error = ref(false);

setTimeout(() => {
  error.value = true;
}, 1000);
```

📌 **真实项目一定要区分：**

* loading
* empty
* error

---

## 组合与进阶（后期再做）

---

### 混合图表（最常见的高级需求）

> **一个图表里展示不同维度**
> 👉 几乎所有 BI / 报表系统都会用

---

#### 折线 + 柱状图（同一 Y 轴）

```vue
<template>
  <VChart :option="chartOption" class="chart" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import VChart from "vue-echarts";
import type { EChartsOption } from "echarts";

const chartOption = ref<EChartsOption>({
  title: {
    text: "订单量 & 成交率",
    left: "center",
  },
  tooltip: {
    trigger: "axis",
  },
  legend: {
    bottom: 0,
  },
  xAxis: {
    type: "category",
    data: ["周一", "周二", "周三", "周四"],
  },
  yAxis: {
    type: "value",
  },
  series: [
    {
      name: "订单量",
      type: "bar",
      data: [120, 200, 150, 80],
    },
    {
      name: "成交率",
      type: "line",
      data: [20, 30, 25, 15],
    },
  ],
});
</script>

<style>
.chart {
  height: 400px;
}
</style>
```

🔑 关键点

* **不同 series 使用不同 type**
* tooltip 必须 `axis`
* legend 用于区分系列

---

#### 双 Y 轴混合（左数量 / 右百分比）

> **真实业务使用率极高**

```vue
<template>
  <VChart :option="chartOption" class="chart" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import VChart from "vue-echarts";
import type { EChartsOption } from "echarts";

const chartOption = ref<EChartsOption>({
  title: {
    text: "销售额 & 增长率",
    left: "center",
  },
  tooltip: {
    trigger: "axis",
  },
  legend: {
    bottom: 0,
  },
  xAxis: {
    type: "category",
    data: ["1月", "2月", "3月"],
  },
  yAxis: [
    {
      type: "value",
      name: "销售额",
    },
    {
      type: "value",
      name: "增长率",
      axisLabel: {
        formatter: "{value} %",
      },
    },
  ],
  series: [
    {
      name: "销售额",
      type: "bar",
      data: [500, 800, 600],
      yAxisIndex: 0,
    },
    {
      name: "增长率",
      type: "line",
      data: [10, 20, 15],
      yAxisIndex: 1,
    },
  ],
});
</script>

<style>
.chart {
  height: 400px;
}
</style>
```

🔑 核心参数

* `yAxis: []` → 多轴
* `yAxisIndex` → series 绑定哪根轴
* 百分比记得 formatter

---

### 大数据量优化（性能兜底）

> **不优化 = 页面卡死**

---

#### sampling（抽样显示）

```vue
<template>
  <VChart :option="chartOption" class="chart" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import VChart from "vue-echarts";
import type { EChartsOption } from "echarts";

const bigData = Array.from({ length: 5000 }, (_, i) => [
  i,
  Math.random() * 100,
]);

const chartOption = ref<EChartsOption>({
  xAxis: {
    type: "value",
  },
  yAxis: {
    type: "value",
  },
  series: [
    {
      type: "line",
      data: bigData,
      sampling: "lttb",
      showSymbol: false,
    },
  ],
});
</script>

<style>
.chart {
  height: 400px;
}
</style>
```

🔑 必懂参数

* `sampling: "lttb"`
  👉 **保趋势，丢细节**
* `showSymbol: false`
  👉 关掉点，性能暴涨

---

#### progressive（渐进渲染）

```ts
series: [
  {
    type: "scatter",
    data: bigData,
    progressive: 500,
    progressiveThreshold: 3000,
  },
];
```

🔑 含义

* `progressive`：每批渲染多少点
* `progressiveThreshold`：超过多少点才启用

📌 **10k+ 数据一定要加**

---

### 主题 Theme（大屏必做）

---

#### 使用暗色主题（全局）

```ts
import { use } from "echarts/core";
import darkTheme from "echarts/theme/dark";

use(darkTheme);
```

```vue
<VChart theme="dark" :option="chartOption" />
```

#### 统一大屏风格（推荐写法）

```ts
export const baseTheme = {
  backgroundColor: "#0f1c2d",
  textStyle: {
    color: "#fff",
  },
  title: {
    textStyle: {
      color: "#fff",
    },
  },
};
```

```ts
chartOption.value = {
  ...baseTheme,
  xAxis: { ... },
  yAxis: { ... },
};
```

🔑 实战经验

* **不要每个图单独配颜色**
* 大屏一定要统一 theme

---

## Vue ECharts 专属

> 这一章的目标只有一个：
> 👉 **让你在 Vue 项目里用 ECharts 用得“顺、稳、不出坑”**

---

### 组件使用方式（你现在这套）

---

基础用法回顾（标准模板）

```vue
<template>
  <VChart :option="chartOption" class="chart" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import VChart from "vue-echarts";
import type { EChartsOption } from "echarts";

const chartOption = ref<EChartsOption>({
  xAxis: {
    type: "category",
    data: ["A", "B", "C"],
  },
  yAxis: {
    type: "value",
  },
  series: [
    {
      type: "bar",
      data: [10, 20, 30],
    },
  ],
});
</script>

<style>
.chart {
  height: 400px;
}
</style>
```

✅ 这是 **vue-echarts 推荐 & 最稳** 的写法

你现在用的完全没问题 👍

---

### autoresize（自适应，必须加）

> **不加 = 页面 resize / 折叠布局后图表错位**

---

自动 resize（一行解决）

```vue
<VChart
  :option="chartOption"
  autoresize
  class="chart"
/>
```

🔑 原理

* 内部监听容器尺寸变化
* 自动调用 `chart.resize()`

📌 **99% 项目直接用 autoresize 就够**

---

### 访问实例（做交互必会）

> **点击 / 手动控制 / 高级交互**

---

获取 ECharts 实例

```vue
<template>
  <VChart
    ref="chartRef"
    :option="chartOption"
    class="chart"
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import VChart from "vue-echarts";
import type { EChartsType } from "echarts";

const chartRef = ref<InstanceType<typeof VChart>>();

onMounted(() => {
  const chart = chartRef.value?.getEchartsInstance();
  console.log(chart);
});
</script>
```

🔑 能干什么？

* `chart.resize()`
* `chart.dispatchAction()`
* `chart.on("click", ...)`

---

### 图表事件（Vue 写法）

> **这是你前面第 11️⃣ 章的 Vue 版**

---

click 事件

```vue
<template>
  <VChart
    :option="chartOption"
    @click="handleClick"
    class="chart"
  />
</template>

<script setup lang="ts">
function handleClick(params: any) {
  console.log("点击数据：", params);
}
</script>
```

📌 **比原生 chart.on 更推荐**

* 自动解绑
* 更 Vue

---

legendselectchanged

```vue
<VChart
  :option="chartOption"
  @legendselectchanged="handleLegendChange"
/>
```

```ts
function handleLegendChange(params: any) {
  console.log("图例变化", params.selected);
}
```

---

### option 更新策略（最容易踩坑）

> **vue-echarts ≠ 直接操作 echarts**

---

✅ 正确姿势（你前面一直在用）

```ts
chartOption.value = {
  ...chartOption.value,
  series: [
    {
      type: "line",
      data: [10, 30, 50],
    },
  ],
};
```

---

❌ 不推荐（容易不同步）

```ts
chartOption.value.series![0].data.push(100);
```

原因

* Vue 响应式 ≠ ECharts 内部状态
* 深层修改不一定触发 setOption

📌 **结论：始终整体替换 option**

---

### 手动控制 setOption 行为

> **性能 / 精细控制用**

---

```vue
<VChart
  :option="chartOption"
  :update-options="{ notMerge: true }"
  class="chart"
/>
```

🔑 常见配置

```ts
updateOptions: {
  notMerge: true,
  lazyUpdate: true,
}
```

含义

* `notMerge`：完全替换（推荐）
* `lazyUpdate`：延迟更新（性能）

---

### v-if / v-show 使用建议（血泪经验）

| 场景     | 推荐     |
| -------- | -------- |
| 切换 Tab | ❌ v-if   |
| Loading  | ❌ v-if   |
| 显示隐藏 | ✅ v-show |

推荐写法

```vue
<VChart v-show="visible" :option="chartOption" />
```

📌 v-if 会 **销毁实例**，重建成本高

---

### 组件拆分建议（开始工程化）

> **一个页面 ≥ 2 个图，就该拆**

---

推荐结构

```txt
components/
 └─ charts/
    ├─ BaseChart.vue
    ├─ LineChart.vue
    ├─ BarChart.vue
```

---

BaseChart.vue（骨架）

```vue
<template>
  <VChart
    :option="option"
    autoresize
    class="chart"
  />
</template>

<script setup lang="ts">
defineProps<{
  option: any;
}>();
</script>

<style>
.chart {
  height: 100%;
}
</style>
```

📌 **后面所有图都复用它**

---

