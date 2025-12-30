/**
 * DOM 工具方法集合
 * 提供常见的浏览器 DOM 操作能力
 *
 * @author atengk
 */

/**
 * 设置页面标题
 *
 * @param title 页面标题
 */
export function setTitle(title: string): void {
    if (typeof title !== 'string') {
        return
    }
    document.title = title
}

/**
 * 获取页面当前滚动位置
 *
 * @returns 滚动位置对象
 */
export function getScrollPosition(): {
    x: number
    y: number
} {
    return {
        x: window.pageXOffset || document.documentElement.scrollLeft || 0,
        y: window.pageYOffset || document.documentElement.scrollTop || 0
    }
}

/**
 * 滚动到指定位置
 *
 * @param x 横向位置
 * @param y 纵向位置
 * @param smooth 是否平滑滚动
 */
export function scrollTo(
    x = 0,
    y = 0,
    smooth = false
): void {
    window.scrollTo({
        left: x,
        top: y,
        behavior: smooth ? 'smooth' : 'auto'
    })
}

/**
 * 滚动到页面顶部
 *
 * @param smooth 是否平滑滚动
 */
export function scrollToTop(smooth = false): void {
    scrollTo(0, 0, smooth)
}

/**
 * 判断元素是否在视口中
 *
 * @param element 目标元素
 * @returns 是否在视口内
 */
export function isInViewport(element: HTMLElement): boolean {
    const rect = element.getBoundingClientRect()

    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <=
        (window.innerWidth || document.documentElement.clientWidth)
    )
}
