# SSE（Server-Sent Events）

SSE（Server-Sent Events）是一种基于 HTTP 的服务器主动推送技术，客户端通过建立长连接持续接收服务器实时数据。它实现简单、性能稳定，适合日志推送、消息通知、任务进度、AI 流式输出等场景。

- [官网地址](https://developer.mozilla.org/zh-CN/docs/Web/API/EventSource)

- [后端参考](https://atengk.github.io/dev/#/work/Ateng-Java/realtime/sse/)



## 基础配置

**安装依赖**

```
pnpm add @microsoft/fetch-event-source@2.0.1
```



## 组合式函数

`src/composables/useSSE.ts`

```ts
import { ref, onBeforeUnmount } from 'vue';
import { fetchEventSource, type EventSourceMessage } from '@microsoft/fetch-event-source';

/**
 * SSE 默认消息结构
 */
interface BaseMessage {
    event?: string;
    data: string;
}

/**
 * useSSE 配置
 * T 为解析后消息的类型
 */
export interface UseSSEOptions<T> {
    /** SSE 服务端地址 */
    url: string;

    /** 可选请求头（如 Token） */
    headers?: Record<string, string>;

    /**
     * 自定义消息解析方法
     * @param msg SSE 原始消息对象
     * @returns 解析后的 T 类型对象
     */
    parseMessage?: (msg: EventSourceMessage) => T;

    /** 连接成功回调 */
    onOpen?: () => void;

    /** 收到消息的回调 */
    onMessage?: (data: T) => void;

    /** 连接关闭回调 */
    onClose?: () => void;

    /** 错误回调 */
    onError?: (err: any) => void;
}

/**
 * useSSE 组合式函数
 * - 使用 fetchEventSource 建立 SSE 长连接
 * - 支持 TypeScript 泛型
 * - 无自动重连 & 无心跳
 */
export function useSSE<T = BaseMessage>() {
    /** SSE 是否处于连接状态 */
    const isConnected = ref(false);

    /** 控制 SSE 取消的 abort 控制器 */
    let abortController: AbortController | null = null;

    /**
     * 建立 SSE 连接
     * @param options UseSSEOptions 配置项
     */
    const connect = (options: UseSSEOptions<T>) => {
        // 保证只有一个连接存在
        cleanup();

        abortController = new AbortController();

        const {
            url,
            headers,
            parseMessage = (msg => msg.data as any as T),
            onMessage,
            onOpen,
            onClose,
            onError
        } = options;

        fetchEventSource(url, {
            method: 'GET',
            headers,
            signal: abortController.signal,

            /**
             * onopen 在 HTTP 握手完成后触发
             * 可用于检查服务端状态码等
             */
            onopen: async (_resp: Response) => {
                isConnected.value = true;
                onOpen?.();
            },

            /**
             * onmessage 在服务端推送 event/data 时触发
             */
            onmessage: (msg) => {
                const parsed = parseMessage(msg);
                onMessage?.(parsed);
            },

            /**
             * onerror 在网络异常或 HTTP 非正常关闭时触发
             * 注意: fetch-event-source 需要 throw 才会中断流
             */
            onerror: (err) => {
                isConnected.value = false;
                onError?.(err);
                throw err; // 必须抛出以通知 fetchEventSource 中断
            },

            /**
             * onclose 在服务器主动关闭 SSE 时触发
             */
            onclose: () => {
                isConnected.value = false;
                onClose?.();
            }
        });
    };

    /**
     * 主动关闭连接
     */
    const close = () => cleanup();

    /**
     * 清理资源:
     * - 关闭 SSE
     * - 重置连接状态
     */
    const cleanup = () => {
        isConnected.value = false;
        abortController?.abort();
        abortController = null;
    };

    /**
     * 组件卸载时自动关闭 SSE，防止内存泄漏
     */
    onBeforeUnmount(() => cleanup());

    return {
        isConnected,
        connect,
        close
    };
}
```



## 基础示例

```vue
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
  connect({
    url: 'http://localhost:18003/api/price-stream',
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

// 组件卸载自动断开
onBeforeUnmount(close);
</script>

<template>
  <div style="padding: 16px;">
    <h2>SSE 价格推送示例</h2>

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
```



## 添加Header

```vue
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
```

