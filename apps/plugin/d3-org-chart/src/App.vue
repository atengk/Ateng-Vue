<template>
  <div class="org-chart-page">
    <div class="toolbar">
      <button @click="expandAll">全部展开</button>
      <button @click="collapseAll">全部收起</button>
      <button @click="exportImg">导出图片</button>
      <button @click="fitNode('4')">聚焦经理</button>
    </div>

    <div ref="chartRef" class="chart-container"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useOrgChart, type OrgNode } from '@/composables/useOrgChart';

const rawData = ref<OrgNode[]>([
  { id: '1', name: '王大锤', title: 'CEO', image: 'https://i.pravatar.cc/150?u=1', department: '总裁办' },
  { id: '2', parentId: '1', name: '张三', title: 'CTO', image: 'https://i.pravatar.cc/150?u=2', department: '技术部' },
  { id: '3', parentId: '1', name: '李四', title: 'CFO', image: 'https://i.pravatar.cc/150?u=3', department: '财务部' },
  { id: '4', parentId: '2', name: '王五', title: '研发经理', image: 'https://i.pravatar.cc/150?u=4', department: '技术部' },
]);

const {
  chartRef,
  initChart,
  expandAll,
  collapseAll,
  fitNode,
  exportImg
} = useOrgChart({
  data: rawData,
  onNodeClick: (id) => {
    console.log('点击了节点：', id);
  }
});

onMounted(() => {
  // 可以在这里进行接口请求，请求完后再 init
  initChart();
});
</script>

<style scoped>
.org-chart-page {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
}
.toolbar {
  padding: 10px;
  background: #fff;
  border-bottom: 1px solid #eee;
  display: flex;
  gap: 10px;
}
.chart-container {
  flex: 1;
  background-color: #f8f9fa;
  overflow: hidden;
}
</style>