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