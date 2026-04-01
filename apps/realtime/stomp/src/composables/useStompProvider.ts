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
