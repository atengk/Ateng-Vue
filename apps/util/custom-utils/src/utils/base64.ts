/**
 * Base64 工具方法集合
 * 提供 Base64 编解码及与 Blob / File 的转换能力
 *
 * @author atengk
 */

/**
 * 将字符串编码为 Base64
 *
 * @param value 原始字符串
 * @returns Base64 字符串
 */
export function encodeBase64(value: string): string {
    const encoder = new TextEncoder()
    const bytes = encoder.encode(value)

    let binary = ''
    bytes.forEach(b => {
        binary += String.fromCharCode(b)
    })

    return btoa(binary)
}

/**
 * 将 Base64 解码为字符串
 *
 * @param base64 Base64 字符串
 * @returns 原始字符串
 */
export function decodeBase64(base64: string): string {
    const binary = atob(base64)
    const bytes = new Uint8Array(binary.length)

    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i)
    }

    const decoder = new TextDecoder()
    return decoder.decode(bytes)
}

/**
 * 将 Base64 转换为 Blob
 *
 * @param base64 Base64 字符串（可包含 data 前缀）
 * @returns Blob 对象
 */
export function base64ToBlob(base64: string): Blob {
    const parts = base64.split(',')

    const data: string =
        (parts.length > 1 ? parts[1] : parts[0]) ?? ''

    const mimeMatch = parts[0]?.match(/:(.*?);/)
    const mimeType = mimeMatch?.[1] ?? ''

    const binary = atob(data)
    const buffer = new Uint8Array(binary.length)

    for (let i = 0; i < binary.length; i++) {
        buffer[i] = binary.charCodeAt(i)
    }

    return new Blob([buffer], { type: mimeType })
}

/**
 * 将 Base64 转换为 File
 *
 * @param base64 Base64 字符串
 * @param filename 文件名
 * @returns File 对象
 */
export function base64ToFile(
    base64: string,
    filename: string
): File {
    const blob = base64ToBlob(base64)
    return new File([blob], filename, { type: blob.type })
}

/**
 * 将 File 转换为 Base64
 *
 * @param file File 对象
 * @returns Promise<Base64 字符串>
 */
export function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()

        reader.onload = () => {
            resolve(reader.result as string)
        }

        reader.onerror = () => {
            reject(new Error('File to Base64 failed'))
        }

        reader.readAsDataURL(file)
    })
}

/**
 * 将 Base64 字符串解码为对象数据
 *
 * 适用于后端将 JSON 数据进行 Base64 编码后返回的场景
 *
 * @param base64 Base64 字符串
 * @returns 解码后的对象
 * @throws 当解码或 JSON 解析失败时抛出异常
 */
export function decodeBase64ToObject<T = any>(base64: string): T {
    const json = decodeBase64(base64)
    return JSON.parse(json) as T
}
