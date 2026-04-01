// src/composables/useCounter.ts
import { ref } from 'vue'

export function useCounter() {
    const count = ref<number>(0)

    function increment(): void {
        count.value++
    }

    function decrement(): void {
        count.value--
    }

    return {
        count,
        increment,
        decrement,
    }
}