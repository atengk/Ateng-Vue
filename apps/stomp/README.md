# STOMP

STOMP 是一种基于文本的简单消息传输协议，建立在 WebSocket 之上，用于实现前后端的实时双向通信。它通过“发布-订阅”模型，让客户端可以订阅主题、发送消息到指定地址，常与 Spring WebSocket 结合使用，适合聊天、通知、实时数据推送等场景，具有协议简单、生态成熟、易于集成的特点。

- [官网地址](https://stomp.github.io/)

- [后端参考](https://atengk.github.io/dev/#/work/Ateng-Java/realtime/stomp-cluster/)



## 基础配置

**安装依赖**

```
pnpm add @stomp/stompjs@7.2.1 sockjs-client@1.6.1 @types/sockjs-client
```

**修改 vite.config.ts**

解决 @stomp/stompjs 访问 global 报错

```ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        }
    },
    define: {
        global: 'window'
    }
});
```

## 创建组合式函数 `useStomp.ts`

```ts
// src/composables/useStomp.ts
import { ref, shallowRef, onUnmounted } from 'vue'
import {
    Client,
    type StompSubscription,
    type IMessage,
    type IFrame
} from '@stomp/stompjs'
import SockJS from 'sockjs-client'

export interface UseStompOptions {
    url: string

    /**
     * 连接时使用的 header，例如：
     * {
     *   Authorization: 'Bearer xxx',
     *   tenant: 'A001'
     * }
     */
    connectHeaders?: Record<string, string>

    /**
     * STOMP 自动重连间隔（ms）
     */
    reconnectDelay?: number

    /**
     * STOMP 协议级心跳（推荐开启）
     */
    heartbeatIncoming?: number
    heartbeatOutgoing?: number

    /**
     * 应用层心跳发送 destination，例如：
     * /app/heartbeat
     *
     * 不配置则不发送应用层心跳
     */
    heartbeatDestination?: string

    /**
     * 应用层心跳发送间隔（ms）
     */
    heartbeatSendInterval?: number

    debug?: boolean
}

export interface StompSubscribeOptions<T = any> {
    destination: string
    callback: (data: T, raw: IMessage) => void
    headers?: Record<string, string>
}

interface InnerSubscription {
    options: StompSubscribeOptions
    stompSub?: StompSubscription
}

export function useStomp(options: UseStompOptions) {
    const client = shallowRef<Client>()
    const connected = ref(false)
    const connecting = ref(false)
    const error = ref<Error | null>(null)

    /**
     * 应用层心跳发送定时器
     */
    let appHeartbeatTimer: number | null = null

    /**
     * 所有订阅缓存（用于断线重连自动恢复）
     */
    const subscriptions = new Map<string, InnerSubscription>()

    function log(...args: any[]) {
        if (options.debug) {
            console.log('[STOMP]', ...args)
        }
    }

    const debugFn = options.debug
        ? (msg: string) => console.log('[STOMP]', msg)
        : () => {}

    function createClient() {
        const stompClient = new Client({
            webSocketFactory: () => new SockJS(options.url),
            connectHeaders: options.connectHeaders,
            reconnectDelay: options.reconnectDelay ?? 5000,
            heartbeatIncoming: options.heartbeatIncoming ?? 10000,
            heartbeatOutgoing: options.heartbeatOutgoing ?? 10000,
            debug: debugFn
        })

        stompClient.onConnect = () => {
            log('Connected')
            connected.value = true
            connecting.value = false
            error.value = null

            restoreSubscriptions()
            startAppHeartbeat()
        }

        stompClient.onDisconnect = () => {
            log('Disconnected')
            connected.value = false
            stopAppHeartbeat()
        }

        stompClient.onStompError = (frame: IFrame) => {
            const msg = frame.headers['message'] || 'STOMP error'
            error.value = new Error(msg)
            console.error('[STOMP ERROR]', frame.body)
        }

        stompClient.onWebSocketClose = () => {
            log('WebSocket closed')
            connected.value = false
            connecting.value = false
            stopAppHeartbeat()
        }

        stompClient.onWebSocketError = (evt) => {
            console.error('[STOMP WS ERROR]', evt)
            error.value = new Error('WebSocket connection error')
        }

        client.value = stompClient
    }

    function connect() {
        if (connected.value || connecting.value) return

        if (!client.value) {
            createClient()
        }

        connecting.value = true
        client.value!.activate()
    }

    function disconnect() {
        stopAppHeartbeat()

        subscriptions.forEach((sub) => {
            sub.stompSub?.unsubscribe()
            sub.stompSub = undefined
        })

        if (client.value) {
            client.value.deactivate()
        }

        connected.value = false
        connecting.value = false
    }

    /**
     * 订阅（支持断线重连自动恢复）
     */
    function subscribe<T = any>(options: StompSubscribeOptions<T>) {
        const { destination } = options

        if (subscriptions.has(destination)) {
            log(`Already subscribed: ${destination}`)
            return
        }

        subscriptions.set(destination, { options })

        if (connected.value) {
            doSubscribe(destination)
        }
    }

    function doSubscribe(destination: string) {
        const item = subscriptions.get(destination)
        if (!item || !client.value) return

        const { options } = item

        item.stompSub = client.value.subscribe(
            options.destination,
            (message) => {
                let payload: any = message.body
                try {
                    payload = JSON.parse(message.body)
                } catch (_) {}

                options.callback(payload, message)
            },
            options.headers
        )

        log(`Subscribed: ${destination}`)
    }

    /**
     * 自动恢复订阅
     */
    function restoreSubscriptions() {
        subscriptions.forEach((_, destination) => {
            doSubscribe(destination)
        })
        log('Subscriptions restored')
    }

    function unsubscribe(destination: string) {
        const item = subscriptions.get(destination)
        if (!item) return

        item.stompSub?.unsubscribe()
        subscriptions.delete(destination)
        log(`Unsubscribed: ${destination}`)
    }

    function publish(destination: string, body: any, headers: Record<string, string> = {}) {
        if (!client.value || !connected.value) {
            throw new Error('STOMP client not connected')
        }

        const payload = typeof body === 'string' ? body : JSON.stringify(body)

        client.value.publish({
            destination,
            body: payload,
            headers
        })
    }

    /**
     * 应用层心跳（只用于后端 Redis 续期 / 在线态维护）
     */
    function startAppHeartbeat() {
        stopAppHeartbeat()

        const destination = options.heartbeatDestination
        if (!destination) {
            return
        }

        const interval = options.heartbeatSendInterval ?? 30000

        appHeartbeatTimer = window.setInterval(() => {
            if (!client.value || !connected.value) return

            client.value.publish({
                destination,
                body: ''
            })

            log('App heartbeat sent')
        }, interval)
    }

    function stopAppHeartbeat() {
        if (appHeartbeatTimer) {
            clearInterval(appHeartbeatTimer)
            appHeartbeatTimer = null
        }
    }

    onUnmounted(() => {
        disconnect()
    })

    return {
        connected,
        connecting,
        error,

        connect,
        disconnect,

        subscribe,
        unsubscribe,

        publish
    }
}

```

## 使用示例

```vue
<script setup lang="ts">
import { useStomp } from '@/composables/useStomp'
import { ref, onMounted, onUnmounted } from 'vue'

const stomp = useStomp({
  url: 'http://localhost:18002/ws'
})

const messages = ref<any[]>([])

onMounted(() => {
  stomp.connect()

  stomp.subscribe({
    destination: '/topic/public',
    callback: (data) => {
      console.log('收到消息:', data)
      messages.value.push(data)
    }
  })
})

const sendMessage = () => {
  stomp.publish('/app/public', {
    text: '你好！' + new Date().toLocaleTimeString()
  })
}

onUnmounted(() => {
  stomp.disconnect()
})
</script>

<template>
  <div>
    <button @click="sendMessage">发送消息</button>

    <h3>订阅收到的消息：</h3>
    <ul>
      <li v-for="(msg, index) in messages" :key="index">
        {{ msg }}
      </li>
    </ul>
  </div>
</template>
```

**useStomp 参数配置**

```ts
const stomp = useStomp({
  // WebSocket / SockJS 连接地址
  url: 'http://localhost:18002/ws',

  // 连接时携带的 Header（如果没有就给空对象，保持规范）
  connectHeaders: {
    Authorization: 'Bearer Admin@123',
    userId: '2385569970'
  },

  // 断线自动重连间隔（ms）
  reconnectDelay: 5000,

  // STOMP 心跳配置（与后端保持一致）
  // 客户端期望从服务端收到心跳的间隔
  heartbeatIncoming: 10000,

  // 客户端向服务端发送心跳的间隔
  heartbeatOutgoing: 10000,

  // 心跳超时判定时间（ms）
  // 超过这个时间没收到任何消息或心跳，就认为连接假死并重连
  heartbeatTimeout: 30000,

  // 是否开启调试日志
  debug: true
})
```



## 全局连接

### 创建 STOMP Provider

```ts
// src/composables/useStompProvider.ts
import { provide, inject } from 'vue'
import { useStomp, type UseStompOptions } from './useStomp'

const STOMP_KEY = Symbol('STOMP_KEY')

export type StompInstance = ReturnType<typeof useStomp>

// 全局唯一实例缓存
let globalStomp: StompInstance | null = null

/**
 * 创建或获取全局 STOMP 实例
 */
export function createStomp(options: UseStompOptions): StompInstance {
    if (globalStomp) {
        return globalStomp
    }

    const stomp = useStomp(options)
    stomp.connect()
    globalStomp = stomp

    return stomp
}

/**
 * 在根组件中调用，提供全局 STOMP 实例
 */
export function provideStomp(options: UseStompOptions): StompInstance {
    const stomp = createStomp(options)
    provide(STOMP_KEY, stomp)
    return stomp
}

/**
 * 在任意子组件中调用，获取全局 STOMP 实例
 */
export function useGlobalStomp(): StompInstance {
    const stomp = inject<StompInstance>(STOMP_KEY)
    if (!stomp) {
        throw new Error(
            '未找到 STOMP 全局实例，请确认是否已在 App.vue 中调用 provideStomp 进行初始化'
        )
    }
    return stomp
}
```

### 初始化连接

`App.vue`

```vue
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

import { provideStomp } from '@/composables/useStompProvider'

const stomp = provideStomp({
  url: 'http://localhost:18002/ws',

  connectHeaders: {
    Authorization: 'Bearer Admin@123',
    userId: '10001'
  },
  heartbeatIncoming: 10000,
  heartbeatOutgoing: 10000,
  reconnectDelay: 5000,

  // 应用层心跳（可选）
  heartbeatDestination: '/app/heartbeat',
  heartbeatSendInterval: 30000,

  debug: true
})

const messages = ref<any[]>([])

onMounted(() => {
  stomp.connect()

  stomp.subscribe({
    destination: '/topic/public',
    callback: (data) => {
      console.log('收到消息:', data)
      messages.value.push(data)
    }
  })
})

const sendMessage = () => {
  stomp.publish('/app/public.send', {
    text: '你好！' + new Date().toLocaleTimeString()
  })
}

onUnmounted(() => {
  stomp.disconnect()
})
</script>

<template>
  <div>
    <button @click="sendMessage">发送消息</button>

    <h3>订阅收到的消息：</h3>
    <ul>
      <li v-for="(msg, index) in messages" :key="index">
        {{ msg }}
      </li>
    </ul>
  </div>
</template>
```

可以将配置放到环境变量中

`.env.development`

```
VITE_STOMP_URL=http://localhost:18002/ws
VITE_STOMP_HEARTBEAT_IN=10000
VITE_STOMP_HEARTBEAT_OUT=10000
VITE_STOMP_RECONNECT_DELAY=5000
VITE_STOMP_HEARTBEAT_DESTINATION=/app/heartbeat
VITE_STOMP_HEARTBEAT_SEND_INTERVAL=30000
VITE_STOMP_DEBUG=true
```

使用环境变量

```
const stomp = provideStomp({
  url: import.meta.env.VITE_STOMP_URL
}
```



