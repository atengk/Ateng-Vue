<template>
  <VChart autoresize :option="chartOption" class="chart" />
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
