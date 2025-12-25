import type {AxiosRequestConfig} from "axios";

/**
 * 通用请求选项
 *
 * - params：URL 查询参数（会拼接到 ? 后面）
 * - data：请求体（POST / PUT / PATCH 等使用）
 * - config：Axios 原生配置（如 headers、timeout 等）
 */
export interface RequestOptions {
    params?: Record<string, any>
    data?: any
    config?: RequestConfig
}

/**
 * 扩展 AxiosRequestConfig
 * 用于支持内部自定义字段
 */
export interface RequestConfig extends AxiosRequestConfig {
    /**
     * 是否跳过 token 注入
     * @default false
     */
    skipAuth?: boolean
    /**
     * 是否返回原始响应
     * - true：不经过业务 code 处理
     * - false / undefined：正常业务处理
     * @default false
     */
    raw?: boolean,
    /**
     * 不走统一错误提示
     */
    skipErrorHandler?: boolean
}

export interface ApiResponse<T = any> {
    code: string
    msg: string
    data: T
}

export interface PageResult<T> {
    records: T[]
    total: number
}

export interface PageQuery {
    page: number
    size: number
}