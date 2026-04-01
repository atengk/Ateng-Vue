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
