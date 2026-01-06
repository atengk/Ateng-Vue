import { ref } from 'vue'
import { renderMarkdown } from '@/utils/markdown'

/**
 * Markdown 流式渲染 composable
 */
export function useMarkdownStream(options?: {
    throttleMs?: number
    autoScroll?: boolean
}) {
    const source = ref('')
    const html = ref('')

    const throttleMs = options?.throttleMs ?? 50
    const autoScroll = options?.autoScroll ?? true

    let buffer = ''
    let timer: number | null = null

    /**
     * 启动节流渲染
     */
    function start() {
        stop()
        timer = window.setInterval(() => {
            if (!buffer) return
            source.value += buffer
            buffer = ''
            html.value = renderMarkdown(source.value)
            if (autoScroll) scrollToBottom()
        }, throttleMs)
    }

    /**
     * 停止流式
     */
    function stop() {
        if (timer) {
            clearInterval(timer)
            timer = null
        }
    }

    /**
     * 重置内容
     */
    function reset() {
        source.value = ''
        html.value = ''
        buffer = ''
    }

    /**
     * 追加流式内容
     */
    function append(chunk: string) {
        buffer += chunk
    }

    /**
     * 滚动到底部（ChatGPT 风格）
     */
    function scrollToBottom() {
        requestAnimationFrame(() => {
            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: 'smooth'
            })
        })
    }

    return {
        source,
        html,
        start,
        stop,
        reset,
        append
    }
}