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
