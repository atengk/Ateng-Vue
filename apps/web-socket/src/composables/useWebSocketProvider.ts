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