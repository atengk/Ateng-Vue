/**
 * 文件工具方法集合
 * 提供常见的文件处理能力，如下载、大小格式化等
 *
 * @author atengk
 */

/**
 * 格式化文件大小
 *
 * @param size 文件大小（字节）
 * @returns 格式化后的大小字符串
 */
export function formatFileSize(size: number): string {
    if (size <= 0) {
        return '0 B'
    }

    const units = ['B', 'KB', 'MB', 'GB', 'TB']
    let index = 0
    let value = size

    while (value >= 1024 && index < units.length - 1) {
        value /= 1024
        index++
    }

    return `${value.toFixed(2)} ${units[index]}`
}

/**
 * 触发浏览器下载
 *
 * @param data Blob 数据
 * @param filename 文件名
 */
export function downloadBlob(data: Blob, filename: string): void {
    const url = URL.createObjectURL(data)
    const link = document.createElement('a')

    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()

    document.body.removeChild(link)
    URL.revokeObjectURL(url)
}

/**
 * 将 base64 字符串转换为 Blob
 *
 * @param base64 base64 字符串
 * @param mimeType MIME 类型
 * @returns Blob 对象
 */
export function base64ToBlob(
    base64: string,
    mimeType: string
): Blob {
    const binary = atob(base64)
    const length = binary.length
    const buffer = new Uint8Array(length)

    for (let i = 0; i < length; i++) {
        buffer[i] = binary.charCodeAt(i)
    }

    return new Blob([buffer], { type: mimeType })
}

/**
 * 将 Blob 转换为 File 对象
 *
 * @param blob Blob 对象
 * @param filename 文件名
 * @returns File 对象
 */
export function blobToFile(
    blob: Blob,
    filename: string
): File {
    return new File([blob], filename, { type: blob.type })
}
