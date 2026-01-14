# WebSocket

WebSocket 是一种在单个 TCP 连接上进行全双工通信的协议，允许客户端与服务端实时交换数据，无需频繁轮询，适合聊天室、股票行情、大屏数据等场景。它相比 HTTP 延迟低、效率高，可实现推送与订阅模式。

- [官网地址](https://vueuse.org/core/useWebSocket])

- [后端参考](https://atengk.github.io/dev/#/work/Ateng-Java/realtime/websocket/)



## 基础配置

**安装依赖**

```
pnpm add @vueuse/core@14.1.0
```



## 最简示例

```vue
<script setup lang="ts">
import { onUnmounted, ref } from 'vue'
import { useWebSocket } from '@vueuse/core'

const WS_URL = 'wss://ws.postman-echo.com/raw'

const message = ref('')
const messages = ref<string[]>([])

const {
  status,
  send,
  open,
  close,
} = useWebSocket(WS_URL, {
  autoReconnect: {
    retries: -1,
    delay: 1000,
  },
  heartbeat: {
    message: 'ping',
    interval: 10000,
  },
  onMessage(_, event) {
    handleServerMessage(event.data)
  },
})

/**
 * 单独处理服务端消息的业务函数
 *
 * @param msg 服务端的消息
 */
function handleServerMessage(msg: string) {
  messages.value.push(`服务端：${msg}`)
}

/**
 * 发送消息
 */
const sendMessage = () => {
  if (!message.value) return
  send(message.value)
  messages.value.push(`我：${message.value}`)
  message.value = ''
}

/**
 * 主动断开
 */
const handleDisconnect = () => {
  close(1000, 'manual close')
}

onUnmounted(() => {
  close()
})
</script>

<template>
  <div class="container">
    <h1>useWebSocket（WebSocket 响应式通信）</h1>

    <div class="card">
      <h2>连接状态</h2>
      <p>
        当前状态：
        <span :class="{ open: status === 'OPEN', close: status !== 'OPEN' }">
          {{ status }}
        </span>
      </p>
      <button @click="open">手动连接</button>
      <button @click="handleDisconnect">断开连接</button>
    </div>

    <div class="card">
      <h2>发送消息</h2>
      <input
          v-model="message"
          placeholder="输入要发送的内容"
          class="input"
          @keyup.enter="sendMessage"
      />
      <button @click="sendMessage">发送</button>
    </div>

    <div class="card">
      <h2>消息记录</h2>
      <div class="log">
        <div v-for="(item, index) in messages" :key="index" class="log-item">
          {{ item }}
        </div>
      </div>
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

.open {
  color: #67c23a;
  font-weight: bold;
}

.close {
  color: #f56c6c;
  font-weight: bold;
}

.input {
  width: 70%;
  padding: 6px 10px;
  border: 1px solid #dcdcdc;
  border-radius: 4px;
  margin-right: 8px;
}

button {
  padding: 6px 14px;
  border: none;
  border-radius: 4px;
  background-color: #409eff;
  color: #ffffff;
  cursor: pointer;
}

button:hover {
  opacity: 0.9;
}

.log {
  max-height: 200px;
  overflow-y: auto;
  background-color: #f8f8f8;
  padding: 10px;
  border-radius: 4px;
}

.log-item {
  font-size: 14px;
  margin-bottom: 4px;
}

.tip {
  background-color: #f8f8f8;
}
</style>
```



## 详细版

```vue
<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import { useWebSocket } from '@vueuse/core'

const WS_URL = 'wss://ws.postman-echo.com/raw'

const message = ref('')
const logs = ref<string[]>([])

const {
  status,
  send,
  open,
  close,
} = useWebSocket(WS_URL, {
  // 初始化自动连接（默认 true）
  immediate: true,

  // 指定 WebSocket 子协议（常用于 JWT 或消息订阅协议）
  // protocols: ['token-xxxx', 'v1'],
  protocols: [],

  // 断线自动重连策略
  autoReconnect: {
    retries: -1,       // 最大重连次数
    delay: 1000,      // 固定延迟
    // 以下可实现指数退避策略：
    // delay: retryCount => Math.min(2000 * retryCount, 10000),
    onFailed() {
      appendLog('重连失败：已超过最大次数')
    },
  },

  // 心跳机制（Ping-Pong）
  heartbeat: {
    message: 'ping',
    interval: 8000,
  },

  // 打开连接回调
  onConnected(_) {
    appendLog('WebSocket 连接成功！')
  },

  // 关闭连接回调
  onDisconnected(_, event) {
    appendLog(`连接断开：code=${event.code} reason=${event.reason}`)
  },

  // 错误回调
  onError(_, event) {
    appendLog(`WebSocket 错误：${event}`)
  },

  // 收到消息
  onMessage(_, event) {
    handleServerMessage(event.data)
  },
})

/** 处理服务端消息 */
function handleServerMessage(msg: string) {
  if (msg === 'pong') {
    appendLog('收到心跳响应：pong')
    return
  }
  appendLog(`服务端：${msg}`)
}

/** 追加日志 */
function appendLog(text: string) {
  const time = new Date().toLocaleTimeString()
  logs.value.push(`[${time}] ${text}`)
  // 自动滚动到底部（可选）
  requestAnimationFrame(() => {
    const el = document.querySelector('.log')
    el && (el.scrollTop = el.scrollHeight)
  })
}

/** 手动发送 */
const sendMessage = () => {
  if (!message.value) return
  send(message.value)
  appendLog(`我：${message.value}`)
  message.value = ''
}

/** 手动断开 */
const handleDisconnect = () => {
  close(1000, 'manual close')
}

/** 连接状态友好提示 */
const statusText = computed(() => {
  switch (status.value) {
    case 'OPEN': return '🟢 已连接'
    case 'CONNECTING': return '🟡 连接中...'
    case 'CLOSED': return '🔴 已关闭'
    default: return status.value
  }
})

onUnmounted(() => {
  close()
})
</script>

<template>
  <div class="container">
    <h1>useWebSocket（高级配置版）</h1>

    <div class="card">
      <h2>连接状态</h2>
      <p>{{ statusText }}</p>
      <button @click="open">手动连接</button>
      <button @click="handleDisconnect">断开连接</button>
    </div>

    <div class="card">
      <h2>发送消息</h2>
      <input v-model="message" placeholder="输入内容 回车发送" @keyup.enter="sendMessage" class="input" />
      <button @click="sendMessage">发送</button>
    </div>

    <div class="card">
      <h2>消息日志</h2>
      <div class="log">
        <div v-for="(item, index) in logs" :key="index" class="log-item">
          {{ item }}
        </div>
      </div>
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
.input {
  width: 70%;
  padding: 6px 10px;
  border: 1px solid #dcdcdc;
  margin-right: 8px;
}
button {
  padding: 6px 14px;
  border: none;
  border-radius: 4px;
  background-color: #409eff;
  color: #fff;
  cursor: pointer;
}
button:hover {
  opacity: 0.9;
}
.log {
  height: 220px;
  overflow-y: auto;
  background-color: #f6f6f6;
  padding: 8px;
}
.log-item {
  font-size: 13px;
  margin-bottom: 4px;
  font-family: monospace;
}
</style>
```



## 全局连接

### 创建 Provider

`src/composables/useWebSocketProvider.ts`

```ts
import { provide, inject, ref } from 'vue'
import { useWebSocket, type UseWebSocketReturn } from '@vueuse/core'

const WS_KEY = Symbol('GLOBAL_WS')

/**
 * 服务端数据最大缓存长度
 * 超过该长度后会自动丢弃最旧的数据，防止内存无限增长
 */
const MAX_DATA_LENGTH = 100

/**
 * 扩展全局 WebSocket 类型
 * 在原有 UseWebSocketReturn 的基础上增加：
 * - latest：最新一条服务端数据
 * - dataList：最近 MAX_DATA_LENGTH 条服务端数据
 */
export interface GlobalWebSocket extends UseWebSocketReturn<any> {
  /**
   * 最新一条服务端推送的数据
   */
  latest: ReturnType<typeof ref<string | null>>

  /**
   * 最近 MAX_DATA_LENGTH 条服务端推送的数据
   */
  dataList: ReturnType<typeof ref<string[]>>
}

/**
 * 在 App.vue 中调用
 * 创建并提供全局 WebSocket 实例
 *
 * @param url WebSocket 服务端地址
 */
export function provideWebSocket(url: string) {
  console.info('[WebSocket] 开始初始化连接，地址：', url)

  /**
   * 最新一条数据
   */
  const latest = ref<string | null>(null)

  /**
   * 最近 MAX_DATA_LENGTH 条数据
   */
  const dataList = ref<string[]>([])

  const ws = useWebSocket(url, {
    autoReconnect: {
      retries: -1,
      delay: 1000,
    },
    heartbeat: {
      message: 'ping',
      interval: 8000,
    },

    onConnected() {
      console.info('[WebSocket] 🟢 连接成功')
    },

    onDisconnected(_, e) {
      console.warn(
        `[WebSocket] 🔴 连接已断开，状态码：${e.code}，原因：${e.reason || '无'}`
      )
    },

    onError(_, e) {
      console.error('[WebSocket] ❌ 发生错误：', e)
    },

    /**
     * 只处理服务端推送的数据
     * 不记录连接日志，不记录自己发送的数据
     */
    onMessage(_, e) {
      const data = e.data as string

      console.info('[WebSocket] 📩 收到服务端数据：', data)

      // 更新最新数据
      latest.value = data

      // 维护一个固定长度的滑动窗口数据队列
      dataList.value.push(data)
      if (dataList.value.length > MAX_DATA_LENGTH) {
        dataList.value.shift()
      }
    },
  })

  provide(WS_KEY, {
    ...ws,
    latest,
    dataList,
  })

  console.info('[WebSocket] 已通过 provide 注入为全局实例')
}

/**
 * 在任意页面中调用
 * 获取全局 WebSocket 实例
 */
export function useGlobalWebSocket(): GlobalWebSocket {
  const ws = inject<GlobalWebSocket>(WS_KEY)

  if (!ws) {
    console.error(
      '[WebSocket] ❌ 获取失败：未找到全局 WebSocket 实例，请确认已在 App.vue 中调用 provideWebSocket'
    )
    throw new Error(
      '未找到全局 WebSocket 实例，请先在 App.vue 中调用 provideWebSocket() 进行初始化'
    )
  }

  console.info('[WebSocket] 成功获取全局 WebSocket 实例')

  return ws
}
```

### 初始化连接

`App.vue`

```vue
<script setup lang="ts">
import { provideWebSocket } from '@/composables/useWebSocketProvider'

/**
 * 从环境变量中获取 WebSocket 基础地址
 */
const WS_URL = import.meta.env.VITE_WS_URL as string

/**
 * 从 localStorage 中读取 token
 * 建议统一约定 key，例如：ACCESS_TOKEN
 */
const TOKEN_KEY = 'ACCESS_TOKEN'
const token = localStorage.getItem(TOKEN_KEY)

/**
 * 拼接最终 WebSocket 连接地址
 */
let wsUrl = WS_URL

if (token) {
  wsUrl = `${WS_URL}?token=${encodeURIComponent(token)}`
  console.info('[WebSocket] 已从 localStorage 中读取到 Token，已拼接到连接地址')
} else {
  console.warn(
    `[WebSocket] 未在 localStorage 中找到 Token（key=${TOKEN_KEY}），将以匿名方式建立连接`
  )
}

console.info('[WebSocket] 最终连接地址：', wsUrl)

/**
 * 初始化并注入全局 WebSocket
 */
provideWebSocket(wsUrl)
</script>

<template>
  <router-view />
</template>
```

**环境变量**

.env.development

```
VITE_WS_URL=wss://ws.postman-echo.com/raw
```

.env.production

```
VITE_WS_URL=wss://your-prod-ws-server/ws
```

---

### 使用 WebSocket

`views/Demo.vue`

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useGlobalWebSocket } from '@/composables/useWebSocketProvider'

/**
 * 从全局 WebSocket 中获取：
 * - status：连接状态
 * - send / open / close：连接控制
 * - latest：最新一条服务端数据
 * - dataList：最近 100 条服务端数据
 */
const { status, send, open, close, latest, dataList } = useGlobalWebSocket()

const input = ref('')

/**
 * 只负责发送数据
 * 不在前端本地记录任何发送日志
 * 所有展示数据全部来自服务端 onMessage
 */
const sendMsg = () => {
  if (!input.value) return
  send(input.value)
  input.value = ''
}
</script>

<template>
  <div style="padding:20px">
    <h2>全局 WebSocket</h2>

    <p>
      当前状态：
      <b :style="{ color: status === 'OPEN' ? 'green' : 'red' }">
        {{ status }}
      </b>
    </p>

    <div>
      <button @click="open">连接</button>
      <button @click="close()">断开</button>
    </div>

    <div style="margin-top: 12px">
      <input v-model="input" placeholder="输入消息" />
      <button @click="sendMsg">发送</button>
    </div>

    <hr />

    <h3>最新一条服务端数据</h3>
    <div
      style="padding:8px;background:#e6f7ff;border-radius:4px;word-break:break-all"
    >
      {{ latest }}
    </div>

    <h3 style="margin-top: 16px">最近 100 条服务端数据</h3>
    <div
      style="margin-top:8px;background:#f6f6f6;max-height:200px;overflow:auto"
    >
      <div v-for="(item, i) in dataList" :key="i">
        {{ item }}
      </div>
    </div>
  </div>
</template>
```



## 其他参考

统一地址：

```ts
const WS_URL = 'wss://ws.postman-echo.com/raw'
```

---

#### 1. 只监听连接状态（最小监控型）

适合做：全局连接指示灯

```vue
<script setup lang="ts">
import { useWebSocket } from '@vueuse/core'

const { status } = useWebSocket(WS_URL)
</script>

<template>
  <div>
    WebSocket 状态：{{ status }}
  </div>
</template>
```

---

#### 2. 页面进入自动连接，离开自动关闭

适合：页面级 WebSocket

```vue
<script setup lang="ts">
import { onUnmounted } from 'vue'
import { useWebSocket } from '@vueuse/core'

const { close } = useWebSocket(WS_URL)

onUnmounted(() => {
  close()
})
</script>
```

---

#### 3. 只发不收（推送型）

适合：日志上报、埋点上报

```vue
<script setup lang="ts">
import { useWebSocket } from '@vueuse/core'

const { send } = useWebSocket(WS_URL)

send(JSON.stringify({
  type: 'report',
  data: 'something happened',
}))
</script>
```

---

#### 4. 只收不发（订阅型）

适合：行情推送、告警推送、大屏数据

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useWebSocket } from '@vueuse/core'

const lastMessage = ref('')

useWebSocket(WS_URL, {
  onMessage(_, e) {
    lastMessage.value = e.data
  },
})
</script>

<template>
  <div>最新数据：{{ lastMessage }}</div>
</template>
```

---

#### 5. JSON 消息自动解析

真实项目最常用

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useWebSocket } from '@vueuse/core'

const data = ref<any>(null)

useWebSocket(WS_URL, {
  onMessage(_, e) {
    try {
      data.value = JSON.parse(e.data)
    } catch {
      console.warn('非 JSON 消息')
    }
  },
})
</script>
```

---

#### 6. 带 Token 鉴权

真实后端几乎必用

```vue
<script setup lang="ts">
import { useWebSocket } from '@vueuse/core'

const token = 'Bearer xxx.yyy.zzz'

useWebSocket(`${WS_URL}?token=${token}`)
</script>
```

或协议方式：

```ts
useWebSocket(WS_URL, {
  protocols: [token],
})
```

---

#### 7. 心跳检测最小版

```vue
<script setup lang="ts">
import { useWebSocket } from '@vueuse/core'

useWebSocket(WS_URL, {
  heartbeat: {
    message: 'ping',
    interval: 5000,
  },
})
</script>
```

---

#### 8. 断线重连最小版

```vue
<script setup lang="ts">
import { useWebSocket } from '@vueuse/core'

useWebSocket(WS_URL, {
  autoReconnect: {
    retries: -1,
    delay: 1000,
  },
})
</script>
```

---

#### 9. 手动控制连接生命周期

```vue
<script setup lang="ts">
import { useWebSocket } from '@vueuse/core'

const { open, close } = useWebSocket(WS_URL, {
  immediate: false,
})
</script>

<template>
  <button @click="open">连接</button>
  <button @click="close()">断开</button>
</template>
```

---

#### 10. 多频道/多实例（最常见进阶）

例如：行情 + 通知

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useWebSocket } from '@vueuse/core'

const price = ref('')
const notice = ref('')

useWebSocket('wss://example.com/price', {
  onMessage(_, e) {
    price.value = e.data
  },
})

useWebSocket('wss://example.com/notice', {
  onMessage(_, e) {
    notice.value = e.data
  },
})
</script>
```

---

#### 11. 结合 Pinia 作为全局 WebSocket

这是实际项目非常标准的形态：

```ts
// stores/ws.ts
import { defineStore } from 'pinia'
import { useWebSocket } from '@vueuse/core'
import { ref } from 'vue'

export const useWsStore = defineStore('ws', () => {
  const messages = ref<string[]>([])

  const { send } = useWebSocket(WS_URL, {
    onMessage(_, e) {
      messages.value.push(e.data)
    },
  })

  return { messages, send }
})
```

---

#### 12. 大屏实时刷新（只关心最新值）

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useWebSocket } from '@vueuse/core'

const value = ref(0)

useWebSocket(WS_URL, {
  onMessage(_, e) {
    value.value = Number(e.data)
  },
})
</script>

<template>
  <h1>{{ value }}</h1>
</template>
```

---

