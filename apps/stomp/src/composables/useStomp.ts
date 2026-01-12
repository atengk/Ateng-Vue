// src/composables/useStomp.ts
import { ref, shallowRef, onUnmounted } from 'vue'
import {Client, type  StompSubscription, type IMessage, type IFrame} from '@stomp/stompjs'
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
    reconnectDelay?: number
    heartbeatIncoming?: number
    heartbeatOutgoing?: number
    /**
     * 心跳超时时间，超过该时间未收到心跳认为连接已失效（ms）
     */
    heartbeatTimeout?: number
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
     * 最近一次收到服务端消息或心跳的时间戳
     */
    const lastHeartbeatTime = ref<number>(0)

    /**
     * 心跳检测定时器
     */
    let heartbeatTimer: number | null = null

    /**
     * 所有订阅的缓存，用于断线重连后自动恢复
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
            lastHeartbeatTime.value = Date.now()

            restoreSubscriptions()
            startHeartbeatCheck()
        }

        stompClient.onDisconnect = () => {
            log('Disconnected')
            connected.value = false
            stopHeartbeatCheck()
        }

        stompClient.onStompError = (frame: IFrame ) => {
            const msg = frame.headers['message'] || 'STOMP error'
            error.value = new Error(msg)
            console.error('[STOMP ERROR]', frame.body)
        }

        stompClient.onWebSocketClose = () => {
            log('WebSocket closed')
            connected.value = false
            connecting.value = false
            stopHeartbeatCheck()
        }

        stompClient.onWebSocketError = (evt) => {
            console.error('[STOMP WS ERROR]', evt)
            error.value = new Error('WebSocket connection error')
        }

        /**
         * 任何服务端数据帧都会更新心跳时间
         */
        const originOnUnhandledMessage = stompClient.onUnhandledMessage
        stompClient.onUnhandledMessage = (msg) => {
            lastHeartbeatTime.value = Date.now()
            originOnUnhandledMessage?.(msg)
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
        stopHeartbeatCheck()

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

        subscriptions.set(destination, {
            options
        })

        if (connected.value) {
            doSubscribe(destination)
        }
    }

    function doSubscribe(destination: string) {
        const item = subscriptions.get(destination)
        if (!item || !client.value) return

        const { options } = item

        const stompSub = client.value.subscribe(
            options.destination,
            (message) => {
                lastHeartbeatTime.value = Date.now()

                let payload: any = message.body
                try {
                    payload = JSON.parse(message.body)
                } catch (_) {}

                options.callback(payload, message)
            },
            options.headers
        )

        item.stompSub = stompSub
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
     * 心跳丢失检测
     */
    function startHeartbeatCheck() {
        stopHeartbeatCheck()

        const timeout = options.heartbeatTimeout ?? 30000

        heartbeatTimer = window.setInterval(() => {
            const now = Date.now()
            const diff = now - lastHeartbeatTime.value

            if (diff > timeout) {
                console.warn('[STOMP] Heartbeat lost, reconnecting...')
                error.value = new Error('Heartbeat timeout')

                stopHeartbeatCheck()

                if (client.value) {
                    client.value.deactivate()
                    client.value.activate()
                }
            }
        }, timeout / 2)
    }

    function stopHeartbeatCheck() {
        if (heartbeatTimer) {
            clearInterval(heartbeatTimer)
            heartbeatTimer = null
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
