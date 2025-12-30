/**
 * 字符串工具方法集合
 * 提供常用的字符串判空、格式化、转换等能力
 *
 * @author atengk
 */

/**
 * 判断字符串是否为空
 * 空字符串、null、undefined、仅包含空白字符都视为空
 *
 * @param value 待判断的字符串
 * @returns 是否为空
 */
export function isEmpty(value?: string | null): boolean {
    if (value === null || value === undefined) {
        return true
    }
    return value.trim().length === 0
}

/**
 * 判断字符串是否非空
 *
 * @param value 待判断的字符串
 * @returns 是否非空
 */
export function isNotEmpty(value?: string | null): boolean {
    return !isEmpty(value)
}

/**
 * 去除字符串首尾空白字符
 * 如果传入 null 或 undefined，则返回空字符串
 *
 * @param value 原始字符串
 * @returns 处理后的字符串
 */
export function trim(value?: string | null): string {
    if (value === null || value === undefined) {
        return ''
    }
    return value.trim()
}

/**
 * 将字符串的首字母转换为大写
 *
 * @param value 原始字符串
 * @returns 首字母大写后的字符串
 */
export function capitalize(value?: string | null): string {
    if (isEmpty(value)) {
        return ''
    }
    const str = trim(value)
    return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * 将字符串的首字母转换为小写
 *
 * @param value 原始字符串
 * @returns 首字母小写后的字符串
 */
export function uncapitalize(value?: string | null): string {
    if (isEmpty(value)) {
        return ''
    }
    const str = trim(value)
    return str.charAt(0).toLowerCase() + str.slice(1)
}

/**
 * 将下划线命名转换为驼峰命名
 * 例如：user_name -> userName
 *
 * @param value 下划线字符串
 * @returns 驼峰字符串
 */
export function toCamelCase(value?: string | null): string {
    if (isEmpty(value)) {
        return ''
    }
    return trim(value).replace(/_([a-zA-Z])/g, (_, letter: string) => {
        return letter.toUpperCase()
    })
}

/**
 * 将驼峰命名转换为下划线命名
 * 例如：userName -> user_name
 *
 * @param value 驼峰字符串
 * @returns 下划线字符串
 */
export function toSnakeCase(value?: string | null): string {
    if (isEmpty(value)) {
        return ''
    }
    return trim(value)
        .replace(/([A-Z])/g, '_$1')
        .toLowerCase()
}

/**
 * 截断字符串并追加省略号
 *
 * @param value 原始字符串
 * @param maxLength 最大长度
 * @param suffix 省略符号，默认 ...
 * @returns 截断后的字符串
 */
export function truncate(
    value?: string | null,
    maxLength = 0,
    suffix = '...'
): string {
    if (isEmpty(value)) {
        return ''
    }
    if (maxLength <= 0) {
        return trim(value)
    }

    const str = trim(value)
    if (str.length <= maxLength) {
        return str
    }
    return str.slice(0, maxLength) + suffix
}

/**
 * 安全转换为字符串
 * null / undefined 返回空字符串
 *
 * @param value 任意值
 * @returns 字符串
 */
export function toStringSafe(value: unknown): string {
    if (value === null || value === undefined) {
        return ''
    }
    return String(value)
}
