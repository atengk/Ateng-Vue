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

/**
 * 复制文本到剪贴板
 *
 * @param text 要复制的文本
 * @returns Promise<boolean> 是否复制成功
 */
export async function copyToClipboard(text: string): Promise<boolean> {
    try {
        if (navigator.clipboard && window.isSecureContext) {
            // 使用现代 Clipboard API
            await navigator.clipboard.writeText(text);
            return true;
        } else {
            // 降级到旧方法
            return copyTextToClipboardFallback(text);
        }
    } catch (err) {
        console.error('复制失败:', err);
        return false;
    }
}

/**
 * 复制文本到剪贴板的降级实现
 *
 * @param text 要复制的文本
 * @returns boolean 是否复制成功
 */
function copyTextToClipboardFallback(text: string): boolean {
    const textArea = document.createElement('textarea');
    textArea.value = text;

    // 避免滚动到底部
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    textArea.style.pointerEvents = 'none';
    textArea.style.zIndex = '-1000';

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        return successful;
    } catch (err) {
        console.error('降级复制失败:', err);
        document.body.removeChild(textArea);
        return false;
    }
}

/**
 * 获取元素的CSS样式值
 *
 * @param element 目标元素
 * @param property CSS属性名
 * @returns CSS属性值
 */
export function getStyle(element: HTMLElement, property: string): string {
    return window.getComputedStyle(element).getPropertyValue(property);
}

/**
 * 检查元素是否有指定的CSS类
 *
 * @param element 目标元素
 * @param className CSS类名
 * @returns 是否包含指定类
 */
export function hasClass(element: HTMLElement, className: string): boolean {
    return element.classList.contains(className);
}

/**
 * 为元素添加CSS类
 *
 * @param element 目标元素
 * @param className CSS类名
 */
export function addClass(element: HTMLElement, className: string): void {
    element.classList.add(className);
}

/**
 * 从元素移除CSS类
 *
 * @param element 目标元素
 * @param className CSS类名
 */
export function removeClass(element: HTMLElement, className: string): void {
    element.classList.remove(className);
}

/**
 * 切换元素的CSS类
 *
 * @param element 目标元素
 * @param className CSS类名
 * @returns 切换后是否包含该类
 */
export function toggleClass(element: HTMLElement, className: string): boolean {
    return element.classList.toggle(className);
}

/**
 * 获取元素相对于文档的偏移位置
 *
 * @param element 目标元素
 * @returns 偏移位置对象
 */
export function getOffset(element: HTMLElement): { top: number; left: number } {
    const rect = element.getBoundingClientRect();
    const scrollPos = getScrollPosition();

    return {
        top: rect.top + scrollPos.y,
        left: rect.left + scrollPos.x
    };
}

/**
 * 检查元素是否具有焦点
 *
 * @param element 目标元素
 * @returns 是否具有焦点
 */
export function hasFocus(element: HTMLElement): boolean {
    return document.activeElement === element;
}

/**
 * 获取当前页面URL参数
 *
 * @param name 参数名
 * @returns 参数值
 */
export function getUrlParam(name: string): string | null {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

/**
 * 设置当前页面URL参数
 *
 * @param name 参数名
 * @param value 参数值
 */
export function setUrlParam(name: string, value: string): void {
    const url = new URL(window.location.href);
    url.searchParams.set(name, value);
    window.history.replaceState({}, '', url);
}

/**
 * 删除当前页面URL参数
 *
 * @param name 参数名
 */
export function removeUrlParam(name: string): void {
    const url = new URL(window.location.href);
    url.searchParams.delete(name);
    window.history.replaceState({}, '', url);
}

/**
 * 获取元素的所有祖先元素
 *
 * @param element 目标元素
 * @returns 祖先元素数组
 */
export function getParents(element: HTMLElement): HTMLElement[] {
    const parents: HTMLElement[] = [];
    let parent = element.parentElement;

    while (parent) {
        parents.push(parent);
        parent = parent.parentElement;
    }

    return parents;
}

/**
 * 获取元素的祖先元素中第一个匹配选择器的元素
 *
 * @param element 目标元素
 * @param selector CSS选择器
 * @returns 匹配的祖先元素或null
 */
export function getClosestAncestor(element: HTMLElement, selector: string): HTMLElement | null {
    return element.closest(selector);
}

/**
 * 检查元素是否匹配指定的选择器
 *
 * @param element 目标元素
 * @param selector CSS选择器
 * @returns 是否匹配
 */
export function matchesSelector(element: HTMLElement, selector: string): boolean {
    return element.matches
        ? element.matches(selector)
        : (element as any).msMatchesSelector(selector);
}

/**
 * 在指定元素后插入HTML
 *
 * @param element 目标元素
 * @param html HTML字符串
 */
export function insertAfter(element: HTMLElement, html: string): void {
    element.insertAdjacentHTML('afterend', html);
}

/**
 * 在指定元素前插入HTML
 *
 * @param element 目标元素
 * @param html HTML字符串
 */
export function insertBefore(element: HTMLElement, html: string): void {
    element.insertAdjacentHTML('beforebegin', html);
}

/**
 * 获取元素的文本内容
 *
 * @param element 目标元素
 * @returns 文本内容
 */
export function getText(element: HTMLElement): string {
    return element.textContent || element.innerText || '';
}

/**
 * 设置元素的文本内容
 *
 * @param element 目标元素
 * @param text 文本内容
 */
export function setText(element: HTMLElement, text: string): void {
    element.textContent = text;
}

/**
 * 获取元素的HTML内容
 *
 * @param element 目标元素
 * @returns HTML内容
 */
export function getHtml(element: HTMLElement): string {
    return element.innerHTML;
}

/**
 * 设置元素的HTML内容
 *
 * @param element 目标元素
 * @param html HTML内容
 */
export function setHtml(element: HTMLElement, html: string): void {
    element.innerHTML = html;
}

/**
 * 检查元素是否可见
 *
 * @param element 目标元素
 * @returns 是否可见
 */
export function isVisible(element: HTMLElement): boolean {
    const style = window.getComputedStyle(element);
    return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
}

/**
 * 等待DOM元素出现
 *
 * @param selector CSS选择器
 * @param timeout 超时时间（毫秒）
 * @returns Promise<HTMLElement> 找到的元素
 */
export function waitForElement(selector: string, timeout: number = 5000): Promise<HTMLElement> {
    return new Promise((resolve, reject) => {
        const element = document.querySelector<HTMLElement>(selector);
        if (element) {
            resolve(element);
            return;
        }

        const observer = new MutationObserver(() => {
            const element = document.querySelector<HTMLElement>(selector);
            if (element) {
                resolve(element);
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        setTimeout(() => {
            observer.disconnect();
            reject(new Error(`元素 ${selector} 在 ${timeout}ms 内未出现`));
        }, timeout);
    });
}

/**
 * 获取元素的尺寸信息
 *
 * @param element 目标元素
 * @returns 尺寸信息对象
 */
export function getDimensions(element: HTMLElement): {
    width: number;
    height: number;
    offsetWidth: number;
    offsetHeight: number;
    scrollWidth: number;
    scrollHeight: number;
} {
    return {
        width: element.clientWidth,
        height: element.clientHeight,
        offsetWidth: element.offsetWidth,
        offsetHeight: element.offsetHeight,
        scrollWidth: element.scrollWidth,
        scrollHeight: element.scrollHeight
    };
}

/**
 * 滚动到指定元素
 *
 * @param element 目标元素
 * @param offset 偏移量
 * @param smooth 是否平滑滚动
 */
export function scrollToElement(element: HTMLElement, offset: number = 0, smooth: boolean = true): void {
    const elementTop = getOffset(element).top - offset;
    scrollTo(0, elementTop, smooth);
}

/**
 * 创建DOM元素
 *
 * @param tag 标签名
 * @param options 元素选项
 * @returns 创建的元素
 */
export function createElement(tag: string, options: {
    className?: string;
    id?: string;
    text?: string;
    html?: string;
    attributes?: { [key: string]: string };
    styles?: { [key: string]: string };
    children?: HTMLElement[];
} = {}): HTMLElement {
    const element = document.createElement(tag);

    if (options.className) element.className = options.className;
    if (options.id) element.id = options.id;
    if (options.text) element.textContent = options.text;
    if (options.html) element.innerHTML = options.html;

    if (options.attributes) {
        Object.entries(options.attributes).forEach(([key, value]) => {
            element.setAttribute(key, value);
        });
    }

    if (options.styles) {
        Object.entries(options.styles).forEach(([key, value]) => {
            (element.style as any)[key] = value;
        });
    }

    if (options.children) {
        options.children.forEach(child => element.appendChild(child));
    }

    return element;
}

/**
 * 从DOM中移除元素
 *
 * @param element 要移除的元素
 */
export function removeElement(element: HTMLElement): void {
    if (element.parentNode) {
        element.parentNode.removeChild(element);
    }
}

/**
 * 检查元素是否在DOM中
 *
 * @param element 要检查的元素
 * @returns 是否在DOM中
 */
export function isElementInDom(element: HTMLElement): boolean {
    return document.body.contains(element);
}

/**
 * 获取元素的祖先元素中第一个滚动容器
 *
 * @param element 目标元素
 * @returns 滚动容器元素或null
 */
export function getScrollParent(element: HTMLElement): HTMLElement | null {
    if (!element) return null;

    const style = window.getComputedStyle(element);
    const overflow = style.overflow + style.overflowX + style.overflowY;

    if (overflow.includes('auto') || overflow.includes('scroll')) {
        return element;
    }

    return getScrollParent(element.parentElement as HTMLElement);
}
