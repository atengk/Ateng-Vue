/**
 * 日期工具类
 * 覆盖常见业务场景，不依赖第三方库
 *
 * @author Ateng
 */

export type DateInput = Date | string | number
type DateFormatKey = 'yyyy' | 'MM' | 'dd' | 'HH' | 'mm' | 'ss'


/**
 * 将输入统一转为 Date 对象
 */
export function toDate(input?: DateInput): Date {
    if (input == null) {
        return new Date()
    }

    if (input instanceof Date) {
        return input
    }

    return new Date(input)
}

/**
 * 日期格式化
 *
 * 支持格式：
 * yyyy-MM-dd
 * yyyy-MM-dd HH:mm:ss
 * yyyy/MM/dd
 * HH:mm:ss
 */
export function formatDate(
    input?: DateInput,
    format = 'yyyy-MM-dd HH:mm:ss'
): string {
    const date = toDate(input)

    const map: Record<DateFormatKey, number> = {
        yyyy: date.getFullYear(),
        MM: date.getMonth() + 1,
        dd: date.getDate(),
        HH: date.getHours(),
        mm: date.getMinutes(),
        ss: date.getSeconds()
    }

    return format.replace(/yyyy|MM|dd|HH|mm|ss/g, (key) => {
        const value = map[key as DateFormatKey]
        return value < 10 ? `0${value}` : String(value)
    })
}

/**
 * 获取时间戳（毫秒）
 */
export function timestamp(input?: DateInput): number {
    return toDate(input).getTime()
}

/**
 * 是否是今天
 */
export function isToday(input: DateInput): boolean {
    const date = toDate(input)
    const now = new Date()

    return (
        date.getFullYear() === now.getFullYear() &&
        date.getMonth() === now.getMonth() &&
        date.getDate() === now.getDate()
    )
}

/**
 * 是否是同一天
 */
export function isSameDay(a: DateInput, b: DateInput): boolean {
    const d1 = toDate(a)
    const d2 = toDate(b)

    return (
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate()
    )
}

/**
 * 获取今天的开始时间
 */
export function startOfToday(): Date {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
}

/**
 * 获取今天的结束时间
 */
export function endOfToday(): Date {
    const d = new Date()
    d.setHours(23, 59, 59, 999)
    return d
}

/**
 * 获取本周的开始时间（周一）
 */
export function startOfWeek(): Date {
    const d = new Date()
    const day = d.getDay() || 7
    d.setDate(d.getDate() - day + 1)
    d.setHours(0, 0, 0, 0)
    return d
}

/**
 * 获取本月的开始时间
 */
export function startOfMonth(): Date {
    const d = new Date()
    d.setDate(1)
    d.setHours(0, 0, 0, 0)
    return d
}

/**
 * 获取本月的结束时间
 */
export function endOfMonth(): Date {
    const d = new Date()
    d.setMonth(d.getMonth() + 1, 0)
    d.setHours(23, 59, 59, 999)
    return d
}

/**
 * 相对时间描述
 *
 * 示例：
 *  - 3分钟前
 *  - 2小时前
 *  - 5天前
 */
export function fromNow(input: DateInput): string {
    const diff = Date.now() - toDate(input).getTime()

    const minute = 60 * 1000
    const hour = 60 * minute
    const day = 24 * hour

    if (diff < minute) {
        return '刚刚'
    }
    if (diff < hour) {
        return `${Math.floor(diff / minute)}分钟前`
    }
    if (diff < day) {
        return `${Math.floor(diff / hour)}小时前`
    }

    return `${Math.floor(diff / day)}天前`
}

/*
  使用示例
import {
  formatDate,
  isToday,
  fromNow,
  startOfMonth
} from '@/utils/date'

formatDate(new Date())                     // 2025-01-01 10:00:00
formatDate(Date.now(), 'yyyy-MM-dd')       // 2025-01-01
isToday('2025-01-01')                      // true
fromNow('2025-01-01 09:50:00')              // 10分钟前
startOfMonth()                             // Date 对象

 */