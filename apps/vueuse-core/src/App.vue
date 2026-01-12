<script setup lang="ts">
import { ref } from 'vue'
import { useWebWorkerFn } from '@vueuse/core'

// 定义一个计算密集型函数（例如大数组求和）
function heavySum(n: number) {
  let sum = 0
  for (let i = 0; i < n; i++) {
    sum += i
  }
  return sum
}

// 将函数包装为 Web Worker 版本
const { workerFn } = useWebWorkerFn(heavySum)

const input = ref(100000000)
const result = ref<number | null>(null)
const loading = ref(false)

async function handleCompute() {
  loading.value = true
  result.value = await workerFn(input.value)
  loading.value = false
}
</script>

<template>
  <div class="container">
    <h1>useWebWorkerFn（Worker 多线程）</h1>

    <div class="card">
      <label>输入数字：</label>
      <input type="number" v-model.number="input" />

      <button @click="handleCompute" :disabled="loading">
        {{ loading ? '计算中...' : '开始计算' }}
      </button>

      <p v-if="result !== null">计算结果：{{ result }}</p>
    </div>

    <div class="card result">
      <h2>说明</h2>
      <p>heavySum 函数在 Web Worker 中执行，不阻塞主线程。</p>
      <p>即使计算大量数据，页面依然可以响应用户操作。</p>
    </div>
  </div>
</template>

<style scoped>
.container {
  padding: 24px;
  font-family: Arial, Helvetica, sans-serif;
}

.card {
  border: 1px solid #dcdcdc;
  border-radius: 6px;
  padding: 16px;
  margin-bottom: 16px;
}

input {
  width: 100%;
  padding: 6px 8px;
  margin: 8px 0;
  border-radius: 4px;
  border: 1px solid #dcdcdc;
}

button {
  margin-right: 6px;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  background-color: #409eff;
  color: #ffffff;
  cursor: pointer;
}

button:disabled {
  background-color: #a0cfff;
  cursor: not-allowed;
}

.result {
  background-color: #f8f8f8;
}
</style>