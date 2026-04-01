/**
 * Web Storage 工具方法集合
 * 对 localStorage 和 sessionStorage 进行统一封装
 *
 * 支持：
 * - 自动 JSON 序列化 / 反序列化
 * - 过期时间控制
 * - 异常兜底处理
 *
 * @author atengk
 */

interface StorageValue<T = any> {
    value: T
    expire?: number
}

/**
 * 设置 storage
 *
 * @param storage Storage 对象（localStorage / sessionStorage）
 * @param key 键名
 * @param value 存储值
 * @param expire 过期时间（毫秒），不传则永不过期
 */
function setItem<T>(
    storage: Storage,
    key: string,
    value: T,
    expire?: number
): void {
    const data: StorageValue<T> = {
        value
    }

    if (expire && expire > 0) {
        data.expire = Date.now() + expire
    }

    try {
        storage.setItem(key, JSON.stringify(data))
    } catch {
        // 忽略存储异常
    }
}

/**
 * 获取 storage
 *
 * @param storage Storage 对象
 * @param key 键名
 * @returns 存储值或 null
 */
function getItem<T>(
    storage: Storage,
    key: string
): T | null {
    const raw = storage.getItem(key)
    if (!raw) {
        return null
    }

    try {
        const data = JSON.parse(raw) as StorageValue<T>

        if (data.expire && Date.now() > data.expire) {
            storage.removeItem(key)
            return null
        }

        return data.value
    } catch {
        return null
    }
}

/**
 * 删除指定 storage 项
 *
 * @param storage Storage 对象
 * @param key 键名
 */
function removeItem(
    storage: Storage,
    key: string
): void {
    try {
        storage.removeItem(key)
    } catch {
        // 忽略异常
    }
}

/**
 * 清空 storage
 *
 * @param storage Storage 对象
 */
function clear(storage: Storage): void {
    try {
        storage.clear()
    } catch {
        // 忽略异常
    }
}

/* ======================== localStorage ======================== */

/**
 * 设置 localStorage
 *
 * @param key 键名
 * @param value 存储值
 * @param expire 过期时间（毫秒）
 */
export function setLocal<T>(
    key: string,
    value: T,
    expire?: number
): void {
    setItem(localStorage, key, value, expire)
}

/**
 * 获取 localStorage
 *
 * @param key 键名
 * @returns 存储值或 null
 */
export function getLocal<T>(key: string): T | null {
    return getItem<T>(localStorage, key)
}

/**
 * 删除 localStorage
 *
 * @param key 键名
 */
export function removeLocal(key: string): void {
    removeItem(localStorage, key)
}

/**
 * 清空 localStorage
 */
export function clearLocal(): void {
    clear(localStorage)
}

/* ======================== sessionStorage ======================== */

/**
 * 设置 sessionStorage
 *
 * @param key 键名
 * @param value 存储值
 * @param expire 过期时间（毫秒）
 */
export function setSession<T>(
    key: string,
    value: T,
    expire?: number
): void {
    setItem(sessionStorage, key, value, expire)
}

/**
 * 获取 sessionStorage
 *
 * @param key 键名
 * @returns 存储值或 null
 */
export function getSession<T>(key: string): T | null {
    return getItem<T>(sessionStorage, key)
}

/**
 * 删除 sessionStorage
 *
 * @param key 键名
 */
export function removeSession(key: string): void {
    removeItem(sessionStorage, key)
}

/**
 * 清空 sessionStorage
 */
export function clearSession(): void {
    clear(sessionStorage)
}
