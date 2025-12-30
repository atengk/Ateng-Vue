/**
 * 时间工具方法集合
 * 提供常用的时间格式化、转换、比较等能力
 *
 * @author atengk
 */

/**
 * 将任意可用值转换为 Date 对象
 *
 * @param value 时间值
 * @returns Date 对象或 null
 */
export function toDate(value?: string | number | Date | null): Date | null {
    if (value === null || value === undefined) {
        return null
    }

    if (value instanceof Date) {
        return isNaN(value.getTime()) ? null : value
    }

    const date = new Date(value)
    return isNaN(date.getTime()) ? null : date
}

/**
 * 格式化时间
 * 支持常见占位符：YYYY、MM、DD、HH、mm、ss
 *
 * @param value 时间值
 * @param format 格式模板
 * @returns 格式化后的字符串
 */
export function formatDate(
    value?: string | number | Date | null,
    format = 'YYYY-MM-DD HH:mm:ss'
): string {
    const date = toDate(value)
    if (!date) return ''

    const pad = (num: number) => String(num).padStart(2, '0')

    const map = {
        YYYY: String(date.getFullYear()),
        MM: pad(date.getMonth() + 1),
        DD: pad(date.getDate()),
        HH: pad(date.getHours()),
        mm: pad(date.getMinutes()),
        ss: pad(date.getSeconds())
    } as const

    return format.replace(
        /YYYY|MM|DD|HH|mm|ss/g,
        key => map[key as keyof typeof map]
    )
}

/**
 * 将时间转换为时间戳（毫秒）
 *
 * @param value 时间值
 * @returns 时间戳或 null
 */
export function toTimestamp(value?: string | number | Date | null): number | null {
    const date = toDate(value)
    return date ? date.getTime() : null
}

/**
 * 判断两个时间是否为同一天
 *
 * @param a 时间值
 * @param b 时间值
 * @returns 是否为同一天
 */
export function isSameDay(
    a?: string | number | Date | null,
    b?: string | number | Date | null
): boolean {
    const dateA = toDate(a)
    const dateB = toDate(b)

    if (!dateA || !dateB) {
        return false
    }

    return (
        dateA.getFullYear() === dateB.getFullYear() &&
        dateA.getMonth() === dateB.getMonth() &&
        dateA.getDate() === dateB.getDate()
    )
}

/**
 * 获取某一天的开始时间
 *
 * @param value 时间值
 * @returns 当天开始时间或 null
 */
export function startOfDay(value?: string | number | Date | null): Date | null {
    const date = toDate(value)
    if (!date) {
        return null
    }

    const result = new Date(date)
    result.setHours(0, 0, 0, 0)
    return result
}

/**
 * 获取某一天的结束时间
 *
 * @param value 时间值
 * @returns 当天结束时间或 null
 */
export function endOfDay(value?: string | number | Date | null): Date | null {
    const date = toDate(value)
    if (!date) {
        return null
    }

    const result = new Date(date)
    result.setHours(23, 59, 59, 999)
    return result
}

/**
 * 获取相对时间描述
 * 如：刚刚、5 分钟前、2 小时前、3 天前
 *
 * @param value 时间值
 * @returns 相对时间字符串
 */
export function fromNow(value?: string | number | Date | null): string {
    const date = toDate(value)
    if (!date) {
        return ''
    }

    const diff = Date.now() - date.getTime()
    const seconds = Math.floor(diff / 1000)

    if (seconds < 60) {
        return '刚刚'
    }

    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) {
        return `${minutes} 分钟前`
    }

    const hours = Math.floor(minutes / 60)
    if (hours < 24) {
        return `${hours} 小时前`
    }

    const days = Math.floor(hours / 24)
    return `${days} 天前`
}
