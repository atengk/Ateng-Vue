import { ref, onBeforeUnmount } from 'vue'
import mqtt, { MqttClient, type IClientOptions } from 'mqtt'

interface ConnectOptions extends IClientOptions {
    url: string
}

export function useMqttClient() {
    const client = ref<MqttClient | null>(null)
    const isConnected = ref(false)

    const connect = (options: ConnectOptions) => {
        client.value = mqtt.connect(options.url, options)

        client.value.on('connect', () => {
            isConnected.value = true
            console.log('[MQTT] connected')
        })

        client.value.on('error', (err) => {
            console.error('[MQTT] error:', err)
        })

        client.value.on('close', () => {
            isConnected.value = false
            console.warn('[MQTT] disconnected')
        })
    }

    const publish = (topic: string, message: string | Buffer) => {
        if (client.value && isConnected.value) {
            client.value.publish(topic, message)
        }
    }

    const subscribe = (topic: string) => {
        if (client.value && isConnected.value) {
            client.value.subscribe(topic)
        }
    }

    const onMessage = (cb: (topic: string, payload: string) => void) => {
        if (!client.value) return
        client.value.on('message', (topic, message) => {
            cb(topic, message.toString())
        })
    }

    const disconnect = () => {
        client.value?.end()
    }

    onBeforeUnmount(() => disconnect())

    return {
        connect,
        publish,
        subscribe,
        onMessage,
        disconnect,
        isConnected,
    }
}
