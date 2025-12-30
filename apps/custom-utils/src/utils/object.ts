/**
 * 对象工具方法集合
 * 提供常见的对象处理能力，如判空、深拷贝、字段清理等
 *
 * @author atengk
 */

/**
 * 判断对象是否为空对象
 * null、undefined、无自身可枚举属性均视为空
 *
 * @param obj 待判断对象
 * @returns 是否为空对象
 */
export function isEmpty(obj?: Record<string, any> | null): boolean {
    if (obj === null || obj === undefined) {
        return true
    }
    return Object.keys(obj).length === 0
}

/**
 * 判断对象是否非空
 *
 * @param obj 待判断对象
 * @returns 是否非空
 */
export function isNotEmpty(obj?: Record<string, any> | null): boolean {
    return !isEmpty(obj)
}

/**
 * 深拷贝对象
 * 适用于普通对象和数组
 *
 * @param source 原始对象
 * @returns 深拷贝后的新对象
 */
export function deepClone<T>(source: T): T {
    if (source === null || typeof source !== 'object') {
        return source
    }

    if (Array.isArray(source)) {
        return source.map(item => deepClone(item)) as unknown as T
    }

    const target: Record<string, any> = {}
    Object.keys(source).forEach(key => {
        target[key] = deepClone((source as Record<string, any>)[key])
    })

    return target as T
}

/**
 * 安全获取对象的嵌套属性值
 * 当中间属性不存在时，返回默认值
 *
 * @param obj 目标对象
 * @param path 属性路径，如 'user.profile.name'
 * @param defaultValue 默认值
 * @returns 获取到的值或默认值
 */
export function get<T = any>(
    obj: Record<string, any> | null | undefined,
    path: string,
    defaultValue?: T
): T | undefined {
    if (!obj || !path) {
        return defaultValue
    }

    const keys = path.split('.')
    let result: any = obj

    for (const key of keys) {
        if (result && typeof result === 'object' && key in result) {
            result = result[key]
        } else {
            return defaultValue
        }
    }

    return result as T
}

/**
 * 移除对象中值为空的字段
 * 空值包括：null、undefined、空字符串
 *
 * @param obj 原始对象
 * @returns 新对象
 */
export function removeEmptyFields<T extends Record<string, any>>(obj: T): Partial<T> {
    const result: Partial<T> = {}

    Object.keys(obj).forEach(key => {
        const value = obj[key]
        if (
            value !== null &&
            value !== undefined &&
            !(typeof value === 'string' && value.trim() === '')
        ) {
            result[key as keyof T] = value
        }
    })

    return result
}

/**
 * 合并多个对象
 * 后面的对象会覆盖前面的同名字段
 *
 * @param objects 多个对象
 * @returns 合并后的新对象
 */
export function merge<T extends Record<string, any>>(
    ...objects: Partial<T>[]
): T {
    return Object.assign({}, ...objects)
}
