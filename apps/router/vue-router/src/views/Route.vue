<script setup lang="ts">
import {computed, ref, watch} from 'vue'
import {useRoute, useRouter} from 'vue-router'

const route = useRoute()
const router = useRouter()

/**
 * =============================
 * query（响应式读取）
 * =============================
 */
const id = computed<string>(() => {
  const value = route.query.id
  return typeof value === 'string' ? value : ''
})

const name = computed<string>(() => {
  const value = route.query.name
  return typeof value === 'string' ? value : ''
})

/**
 * =============================
 * 页面可见的监听结果
 * =============================
 */
const queryLog = ref<string>('')
const pathLog = ref<string>('')

/**
 * 监听 query 变化
 */
watch(
    () => route.query,
    (newQuery, oldQuery) => {
      queryLog.value = `query 变化：${JSON.stringify(oldQuery)} → ${JSON.stringify(newQuery)}`
      console.log(queryLog.value)
    }
)

/**
 * 监听 path 变化
 */
watch(
    () => route.path,
    (newPath, oldPath) => {
      pathLog.value = `path 变化：${oldPath} → ${newPath}`
      console.log(pathLog.value)
    }
)

/**
 * =============================
 * 操作按钮（制造变化）
 * =============================
 */

/**
 * 修改 query（不换页面）
 */
function changeQuery(): void {
  router.push({
    path: route.path,
    query: {
      id: String(Date.now()),
      name: 'vue-router'
    }
  })
}

/**
 * 修改 path（同组件不同路径）
 */
function changePath(): void {
  router.push('/route/child')
}
</script>

<template>
  <h1>Route 页面</h1>

  <section>
    <h3>当前 query</h3>
    <p>id：{{ id }}</p>
    <p>name：{{ name }}</p>
  </section>

  <section>
    <h3>当前路由信息</h3>
    <p>path：{{ route.path }}</p>
    <p>fullPath：{{ route.fullPath }}</p>
    <p>name：{{ route.name }}</p>
    <p>hash：{{ route.hash }}</p>
  </section>

  <section>
    <h3>操作区</h3>
    <button @click="changeQuery">
      修改 query（不变 path）
    </button>
    |
    <button @click="changePath">
      修改 path
    </button>
  </section>

  <section>
    <h3>监听结果（可视化）</h3>
    <p>query 监听结果：{{ queryLog }}</p>
    <p>path 监听结果：{{ pathLog }}</p>
  </section>
</template>
