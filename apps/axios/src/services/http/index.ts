/**
 * HTTP 模块统一出口
 * 业务层只允许从这里 import
 */

// axios 实例（default）
export { default as request } from './axios'

// 所有请求方法
export * from './request'

// 所有类型
export * from './types'
