/**
 * 基础校验工具方法集合
 * 提供常见格式与数值合法性的判断
 *
 * 注意：
 * 仅做“是否符合规则”的判断，不负责错误提示
 *
 * @author atengk
 */

/**
 * 判断是否为合法邮箱
 *
 * @param value 待校验值
 * @returns 是否合法
 */
export function isEmail(value: string): boolean {
    const regex =
        /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
    return regex.test(value)
}

/**
 * 判断是否为合法手机号（中国大陆）
 *
 * @param value 待校验值
 * @returns 是否合法
 */
export function isMobile(value: string): boolean {
    const regex = /^1[3-9]\d{9}$/
    return regex.test(value)
}

/**
 * 判断是否为合法 URL
 *
 * @param value 待校验值
 * @returns 是否合法
 */
export function isUrl(value: string): boolean {
    try {
        new URL(value)
        return true
    } catch {
        return false
    }
}

/**
 * 判断是否为合法身份证号（中国大陆 18 位）
 *
 * @param value 待校验值
 * @returns 是否合法
 */
export function isIdCard(value: string): boolean {
    const regex =
        /^[1-9]\d{5}(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/
    return regex.test(value)
}

/**
 * 判断数字是否在指定范围内（包含边界）
 *
 * @param value 待判断数值
 * @param min 最小值
 * @param max 最大值
 * @returns 是否在范围内
 */
export function isInRange(
    value: number,
    min: number,
    max: number
): boolean {
    return value >= min && value <= max
}
