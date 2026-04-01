/**
 * 数组工具方法集合
 * 提供常见的数组处理能力，如去重、分组、扁平化等
 *
 * @author atengk
 */

/**
 * 判断数组是否为空
 *
 * @param array 待判断数组
 * @returns 是否为空
 */
export function isEmpty<T>(array?: T[] | null): boolean {
    if (array === null || array === undefined) {
        return true
    }
    return array.length === 0
}

/**
 * 判断数组是否非空
 *
 * @param array 待判断数组
 * @returns 是否非空
 */
export function isNotEmpty<T>(array?: T[] | null): boolean {
    return !isEmpty(array)
}

/**
 * 数组去重（基于 Set）
 *
 * @param array 原始数组
 * @returns 去重后的新数组
 */
export function unique<T>(array: T[]): T[] {
    return Array.from(new Set(array))
}

/**
 * 根据指定 key 对对象数组去重
 *
 * @param array 对象数组
 * @param key 去重依据字段
 * @returns 去重后的数组
 */
export function uniqueBy<T extends Record<string, any>>(
    array: T[],
    key: keyof T
): T[] {
    const map = new Map<any, T>()
    array.forEach(item => {
        map.set(item[key], item)
    })
    return Array.from(map.values())
}

/**
 * 将数组按照指定规则进行分组
 *
 * @param array 原始数组
 * @param getter 分组规则函数
 * @returns 分组后的对象
 */
export function groupBy<T>(
    array: T[],
    getter: (item: T) => string
): Record<string, T[]> {
    return array.reduce<Record<string, T[]>>((result, item) => {
        const key = getter(item)
        if (!result[key]) {
            result[key] = []
        }
        result[key].push(item)
        return result
    }, {})
}

/**
 * 数组扁平化（指定层级）
 *
 * @param array 原始数组
 * @param depth 扁平化层级，默认 1
 * @returns 扁平化后的数组
 */
export function flatten<T>(array: any[], depth = 1): T[] {
    return array.flat(depth)
}

/**
 * 安全获取数组中的第一个元素
 *
 * @param array 数组
 * @returns 第一个元素或 undefined
 */
export function first<T>(array?: T[] | null): T | undefined {
    if (isEmpty(array)) {
        return undefined
    }
    return array![0]
}

/**
 * 安全获取数组中的最后一个元素
 *
 * @param array 数组
 * @returns 最后一个元素或 undefined
 */
export function last<T>(array?: T[] | null): T | undefined {
    if (isEmpty(array)) {
        return undefined
    }
    return array![array!.length - 1]
}

/**
 * 将树形结构数组扁平化
 *
 * @param tree 树形数组
 * @param childrenKey 子节点字段名
 * @returns 扁平化后的数组
 */
export function flattenTree<T extends Record<string, any>>(
    tree: T[],
    childrenKey: keyof T
): T[] {
    const result: T[] = []

    const traverse = (nodes: T[]) => {
        nodes.forEach(node => {
            result.push(node)
            const children = node[childrenKey] as T[] | undefined
            if (Array.isArray(children) && children.length > 0) {
                traverse(children)
            }
        })
    }

    traverse(tree)
    return result
}
