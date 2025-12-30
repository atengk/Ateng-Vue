/**
 * 类型判断工具方法集合
 * 提供对常见 JavaScript / TypeScript 类型的判断能力
 *
 * 建议作为 utils 层的基础依赖文件
 *
 * @author atengk
 */

/**
 * 判断值是否为 undefined
 *
 * @param value 待判断值
 * @returns 是否为 undefined
 */
export function isUndefined(value: unknown): value is undefined {
    return value === undefined
}

/**
 * 判断值是否为 null
 *
 * @param value 待判断值
 * @returns 是否为 null
 */
export function isNull(value: unknown): value is null {
    return value === null
}

/**
 * 判断值是否为 null 或 undefined
 *
 * @param value 待判断值
 * @returns 是否为 null 或 undefined
 */
export function isNil(value: unknown): value is null | undefined {
    return value === null || value === undefined
}

/**
 * 判断值是否为字符串
 *
 * @param value 待判断值
 * @returns 是否为字符串
 */
export function isString(value: unknown): value is string {
    return typeof value === 'string'
}

/**
 * 判断值是否为数字
 * NaN 不视为有效数字
 *
 * @param value 待判断值
 * @returns 是否为数字
 */
export function isNumber(value: unknown): value is number {
    return typeof value === 'number' && !Number.isNaN(value)
}

/**
 * 判断值是否为布尔值
 *
 * @param value 待判断值
 * @returns 是否为布尔值
 */
export function isBoolean(value: unknown): value is boolean {
    return typeof value === 'boolean'
}

/**
 * 判断值是否为函数
 *
 * @param value 待判断值
 * @returns 是否为函数
 */
export function isFunction(value: unknown): value is Function {
    return typeof value === 'function'
}

/**
 * 判断值是否为数组
 *
 * @param value 待判断值
 * @returns 是否为数组
 */
export function isArray(value: unknown): value is unknown[] {
    return Array.isArray(value)
}

/**
 * 判断值是否为对象（不包含 null）
 *
 * @param value 待判断值
 * @returns 是否为对象
 */
export function isObject(value: unknown): value is Record<string, any> {
    return typeof value === 'object' && value !== null
}

/**
 * 判断值是否为普通对象（Plain Object）
 * 即通过 {} 或 new Object() 创建的对象
 *
 * @param value 待判断值
 * @returns 是否为普通对象
 */
export function isPlainObject(value: unknown): value is Record<string, any> {
    if (!isObject(value)) {
        return false
    }
    const prototype = Object.getPrototypeOf(value)
    return prototype === Object.prototype || prototype === null
}

/**
 * 判断值是否为 Promise 对象
 *
 * @param value 待判断值
 * @returns 是否为 Promise
 */
export function isPromise<T = any>(value: unknown): value is Promise<T> {
    return (
        isObject(value) &&
        isFunction((value as any).then) &&
        isFunction((value as any).catch)
    )
}

/**
 * 判断值是否为 Date 对象
 *
 * @param value 待判断值
 * @returns 是否为 Date
 */
export function isDate(value: unknown): value is Date {
    return value instanceof Date
}
