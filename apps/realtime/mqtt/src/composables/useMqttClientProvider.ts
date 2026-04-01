import { provide, inject, type InjectionKey } from 'vue'
import { useMqttClient } from './useMqttClient'

/**
 * 定义 MQTT Provider 类型（包含 useMqttClient 返回的内容）
 */
export type MqttClientContext = ReturnType<typeof useMqttClient>

/**
 * 创建全局唯一的 MQTT 注入 Key
 */
export const MQTT_KEY: InjectionKey<MqttClientContext> = Symbol('MQTT_KEY')

/**
 * Provider：在父级组件执行，用于全局提供 MQTT 客户端
 */
export function provideMqttClient() {
    const mqtt = useMqttClient()
    provide(MQTT_KEY, mqtt)
    return mqtt
}

/**
 * Inject：在任意子组件调用，用于获取 MQTT 客户端
 */
export function useMqttClientInject(): MqttClientContext {
    const mqtt = inject(MQTT_KEY)
    if (!mqtt) {
        throw new Error('[MQTT] inject 失败：请确保父级已调用 provideMqttClient()')
    }
    return mqtt
}
