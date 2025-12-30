/**
 * URL 与查询参数工具方法集合
 * 提供 URL 拼接、query 解析与序列化等能力
 *
 * @author atengk
 */

/**
 * 解析 URL 中的 query 参数
 *
 * @param url 完整 URL，可选，默认使用当前地址
 * @returns query 参数对象
 */
export function parseQuery(url?: string): Record<string, string> {
    const queryString = url
        ? url.split('?')[1] || ''
        : window.location.search.slice(1)

    const result: Record<string, string> = {}

    if (!queryString) {
        return result
    }

    queryString.split('&').forEach(pair => {
        const [key, value] = pair.split('=')
        if (key) {
            result[decodeURIComponent(key)] = decodeURIComponent(value || '')
        }
    })

    return result
}

/**
 * 将对象序列化为 query 字符串
 *
 * @param params 参数对象
 * @returns query 字符串
 */
export function stringifyQuery(
    params: Record<string, any>
): string {
    const parts: string[] = []

    Object.keys(params).forEach(key => {
        const value = params[key]
        if (value === null || value === undefined || value === '') {
            return
        }
        parts.push(
            `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
        )
    })

    return parts.join('&')
}

/**
 * 拼接 URL 与 query 参数
 *
 * @param url 基础 URL
 * @param params query 参数对象
 * @returns 完整 URL
 */
export function buildUrl(
    url: string,
    params?: Record<string, any>
): string {
    if (!params || Object.keys(params).length === 0) {
        return url
    }

    const query = stringifyQuery(params)
    if (!query) {
        return url
    }

    return url.includes('?')
        ? `${url}&${query}`
        : `${url}?${query}`
}

/**
 * 对 URL 进行编码
 *
 * @param url 原始 URL
 * @returns 编码后的 URL
 */
export function encodeUrl(url: string): string {
    return encodeURI(url)
}

/**
 * 对 URL 进行解码
 *
 * @param url 编码后的 URL
 * @returns 解码后的 URL
 */
export function decodeUrl(url: string): string {
    return decodeURI(url)
}
