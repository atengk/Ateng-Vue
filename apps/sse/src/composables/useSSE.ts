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
