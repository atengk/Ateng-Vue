<!--
基础虚拟列表示例：使用 RecycledScroller 渲染大数据列表
@author Ateng
@since 2026-04-09
-->
<template>
  <div class="container">
    <!--
      RecycleScroller 核心参数说明：
      items：数据源
      item-size：每一项的固定高度（必须准确，否则会出现滚动错位）
      key-field：每一项的唯一标识字段
      v-slot：作用域插槽，获取 item 和 index
    -->
    <RecycleScroller
        class="scroller"
        :items="list"
        :item-size="50"
        key-field="id"
        v-slot="{ item, index }"
    >
      <!-- 每一项的渲染 -->
      <div class="item">
        <span class="index">{{ index }}</span>
        <span class="text">{{ item.name }}</span>
      </div>
    </RecycleScroller>
  </div>
</template>

<script setup>
/**
 * 引入 RecycledScroller 组件
 */
import { RecycleScroller } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'

/**
 * 构造大数据列表（10000条）
 */
const list = Array.from({ length: 10000 }).map((_, i) => ({
  id: i,
  name: `用户-${i}`
}))
</script>

<style scoped>
.container {
  height: 500px;
  border: 1px solid #ddd;
}

/* 必须设置高度，否则不会出现滚动 */
.scroller {
  height: 100%;
}

.item {
  display: flex;
  align-items: center;
  height: 50px;
  padding: 0 12px;
  border-bottom: 1px solid #f0f0f0;
}

.index {
  width: 60px;
  color: #999;
}

.text {
  flex: 1;
}
</style>