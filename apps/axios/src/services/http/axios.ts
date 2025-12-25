import axios from 'axios'
import type {ApiResponse, RequestConfig} from './types'

const requestInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE,
    timeout: 10000
})

// 请求拦截器
requestInstance.interceptors.request.use((config) => {
    const requestConfig = config as RequestConfig

    // 如果显式声明 skipAuth，则直接跳过
    if (requestConfig.skipAuth) {
        return config
    }

    const token = localStorage.getItem('token')
    if (token) {
        config.headers = config.headers || {}
        ;(config.headers as any).Authorization = `Bearer ${token}`
    }

    return config
})

// 响应拦截器
requestInstance.interceptors.response.use(
    (response) => {
        const config = response.config as RequestConfig

        /**
         * 原始响应直通（下载 / 特殊接口）
         */
        if (config.raw === true) {
            return response
        }

        /**
         * 正常业务接口统一处理
         */
        const res = response.data as ApiResponse

        if (res.code !== '0') {
            if (!config.skipErrorHandler) {
                console.error(res.msg)
            }
            const error = new Error(res.msg)
            ;(error as any).response = res
            return Promise.reject(error)
        }

        return res.data
    },
    (error) => {
        /**
         * HTTP 状态码错误处理
         */
        const status = error?.response?.status

        if (status === 401) {
            console.error('未登录或登录过期')
        }

        if (status === 403) {
            console.error('无权限访问')
        }

        if (status >= 500) {
            console.error('服务器异常')
        }

        console.error('请求错误:', error)
        return Promise.reject(error)
    }
)

/**
 * 通用 request 方法
 */
export default function request<T = any>(
    config: RequestConfig
): Promise<T> {
    // 拦截器已经返回 T，这里直接返回
    return requestInstance.request<any, T>(config)
}

