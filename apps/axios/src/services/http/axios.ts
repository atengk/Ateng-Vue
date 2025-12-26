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
                console.error(res.msg || '请求失败')
                //ElMessage.error(res.msg || '请求失败')
            }

            const error = new Error(res.msg || '请求失败')
            ;(error as any).response = res
            return Promise.reject(error)
        }

        return res.data
    },
    (error) => {
        const config = error?.config as RequestConfig | undefined

        /**
         * 显式跳过错误处理
         */
        if (config?.skipErrorHandler) {
            return Promise.reject(error)
        }

        /**
         * 网络错误（无 response）
         */
        if (!error.response) {
            if (error.message?.includes('Network Error')) {
                console.error('网络异常，请检查网络连接')
                //ElMessage.error('网络异常，请检查网络连接')
            } else if (error.code === 'ECONNABORTED') {
                console.error('请求超时，请稍后重试')
                //ElMessage.error('请求超时，请稍后重试')
            } else {
                console.error('请求失败，请稍后重试')
                //ElMessage.error('请求失败，请稍后重试')
            }

            return Promise.reject(error)
        }

        /**
         * HTTP 状态码错误
         */
        const status = error.response.status

        switch (status) {
            case 401:
                console.error('未登录或登录已过期')
                //ElMessage.error('未登录或登录已过期')
                break
            case 403:
                console.error('无权限访问')
                //ElMessage.error('无权限访问')
                break
            case 404:
                console.error('请求的资源不存在')
                //ElMessage.error('请求的资源不存在')
                break
            default:
                if (status >= 500) {
                    console.error('服务器异常，请稍后重试')
                    //ElMessage.error('服务器异常，请稍后重试')
                } else {
                    console.error('请求失败')
                    //ElMessage.error('请求失败')
                }
        }

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

