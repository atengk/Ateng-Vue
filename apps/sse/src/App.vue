<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useSSE } from '@/composables/useSSE';

interface PricePush {
  symbol: string;
  price: number;
  time: number;
}

// 页面展示数据
const latestPrice = ref<PricePush | null>(null);
const priceList = ref<PricePush[]>([]);

const { connect, close, isConnected } = useSSE<PricePush>();

onMounted(() => {

  // 示例 token（真实项目从 localStorage / pinia 获取）
  const token = localStorage.getItem('token') || 'mock-token-123';

  connect({
    url: 'http://localhost:18003/api/price-stream',
    headers: {
      Authorization: `Bearer ${token}`,
      'X-Client': 'WebApp', // 可选自定义请求头
    },
    parseMessage: (msg) => JSON.parse(msg.data) as PricePush,
    onMessage: (data) => {
      latestPrice.value = data; // 覆盖最新
      priceList.value.unshift(data); // 写入历史列表
      if (priceList.value.length > 100) {
        priceList.value.pop(); // 控制列表长度避免内存增长
      }
    },
    onError: (err) => {
      console.error('SSE Error:', err);
    },
  });
});

// 页面卸载断开 SSE
onBeforeUnmount(close);
</script>

<template>
  <div style="padding: 16px;">
    <h2>SSE Token Header 示例</h2>

    <p>
      状态：
      <strong :style="{ color: isConnected ? 'green' : 'red' }">
        {{ isConnected ? '已连接' : '未连接' }}
      </strong>
    </p>

    <button @click="close" style="margin-bottom: 12px;">关闭连接</button>

    <h3>最新价格</h3>
    <div v-if="latestPrice">
      <p>Symbol: {{ latestPrice.symbol }}</p>
      <p>Price: {{ latestPrice.price }}</p>
      <p>Time: {{ new Date(latestPrice.time).toLocaleString() }}</p>
    </div>
    <div v-else>
      无数据…
    </div>

    <h3 style="margin-top: 20px;">历史消息（最多100条）</h3>
    <ul>
      <li v-for="(item, index) in priceList" :key="index">
        {{ item.symbol }} — {{ item.price }} — {{ new Date(item.time).toLocaleString() }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
ul {
  padding-left: 18px;
}
li {
  margin-bottom: 4px;
  font-family: monospace;
}
</style>
