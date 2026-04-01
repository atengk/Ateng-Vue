import { ref, onBeforeUnmount } from 'vue'
import mqtt, { type MqttClient, type IClientOptions } from 'mqtt'

interface ConnectOptions extends IClientOptions {
    url: string
}

export function useMqttClient() {
    const client = ref<MqttClient | null>(null)
    const isConnected = ref(false)

    const pendingTopics = new Set<string>()
    const messageHandlers = new Set<(topic: string, payload: string) => void>()

    let connectedOnce = false

    const connect = (options: ConnectOptions) => {
        if (client.value) return

        const { url, ...mqttOptions } = options
        client.value = mqtt.connect(url, mqttOptions)

        client.value.on('connect', () => {
            isConnected.value = true

            pendingTopics.forEach(topic => {
                client.value?.subscribe(topic)
            })

            connectedOnce = true
        })

        client.value.on('reconnect', () => {
            isConnected.value = false
        })

        client.value.on('close', () => {
            isConnected.value = false
        })

        client.value.on('error', () => {
            isConnected.value = false
        })

        client.value.on('message', (topic, message) => {
            const payload = message.toString()
            messageHandlers.forEach(cb => cb(topic, payload))
        })
    }

    const publish = (topic: string, message: string | Buffer) => {
        if (!client.value) return
        client.value.publish(topic, message, { qos: 1 })
    }

    const subscribe = (topic: string) => {
        pendingTopics.add(topic)

        if (client.value && isConnected.value) {
            client.value.subscribe(topic)
        }
    }

    const onMessage = (cb: (topic: string, payload: string) => void) => {
        messageHandlers.add(cb)
        return () => messageHandlers.delete(cb)
    }

    const disconnect = () => {
        client.value?.end(true)
        client.value = null
        isConnected.value = false
        pendingTopics.clear()
        messageHandlers.clear()
        connectedOnce = false
    }

    onBeforeUnmount(disconnect)

    return {
        connect,
        publish,
        subscribe,
        onMessage,
        disconnect,
        isConnected,
    }
}
