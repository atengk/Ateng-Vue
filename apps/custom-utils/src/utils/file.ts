/**
 * 文件工具方法集合
 * 提供常见的文件处理能力，如下载、大小格式化、类型检测等
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

/**
 * 获取文件类型信息
 *
 * @param file File 对象
 * @returns 包含文件类型信息的对象
 */
export function getFileType(file: File): {
    extension: string;
    mimeType: string;
    isImage: boolean;
    isVideo: boolean;
    isAudio: boolean;
    isText: boolean;
    isPdf: boolean;
    isArchive: boolean;
} {
    const name = file.name.toLowerCase();
    const type = file.type.toLowerCase();

    // 获取文件扩展名
    const extension = name.split('.').pop() || '';

    // 检查文件类型
    const isImage = type.startsWith('image/') || ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'].includes(`.${extension}`);
    const isVideo = type.startsWith('video/') || ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.mkv', '.webm'].includes(`.${extension}`);
    const isAudio = type.startsWith('audio/') || ['.mp3', '.wav', '.flac', '.aac', '.ogg', '.m4a'].includes(`.${extension}`);
    const isText = type.startsWith('text/') || ['.txt', '.csv', '.json', '.xml', '.html', '.htm', '.js', '.ts', '.css', '.md'].includes(`.${extension}`);
    const isPdf = type === 'application/pdf' || extension === 'pdf';
    const isArchive = ['.zip', '.rar', '.7z', '.tar', '.gz', '.bz2'].includes(`.${extension}`);

    return {
        extension,
        mimeType: file.type,
        isImage,
        isVideo,
        isAudio,
        isText,
        isPdf,
        isArchive
    };
}

/**
 * 获取文件详细信息
 *
 * @param file File 对象
 * @returns 包含文件详细信息的对象
 */
export function getFileInfo(file: File): {
    name: string;
    size: number;
    sizeFormatted: string;
    type: string;
    extension: string;
    lastModified: number;
    lastModifiedDate: Date;
} {
    const fileType = getFileType(file);

    return {
        name: file.name,
        size: file.size,
        sizeFormatted: formatFileSize(file.size),
        type: file.type,
        extension: fileType.extension,
        lastModified: file.lastModified,
        lastModifiedDate: new Date(file.lastModified)
    };
}

/**
 * 验证文件大小是否在限制范围内
 *
 * @param file File 对象
 * @param maxSize 最大文件大小（字节）
 * @returns 是否在限制范围内
 */
export function validateFileSize(file: File, maxSize: number): boolean {
    return file.size <= maxSize;
}

/**
 * 验证文件类型是否符合要求
 *
 * @param file File 对象
 * @param allowedTypes 允许的MIME类型数组或扩展名数组
 * @returns 是否符合要求
 */
export function validateFileType(file: File, allowedTypes: string[]): boolean {
    const fileType = getFileType(file);

    // 检查MIME类型或扩展名
    return allowedTypes.some(allowedType =>
        file.type.toLowerCase().startsWith(allowedType.toLowerCase()) ||
        fileType.extension.toLowerCase() === allowedType.toLowerCase().replace('.', '')
    );
}

/**
 * 从File对象获取Base64编码
 *
 * @param file File 对象
 * @returns Promise<string> Base64编码的字符串
 */
export function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            const result = reader.result as string;
            if (result) {
                const base64Content = result.split(',')[1];
                if (base64Content) {
                    resolve(base64Content);
                } else {
                    reject(new Error('无法提取Base64内容'));
                }
            } else {
                reject(new Error('读取文件失败'));
            }
        };

        reader.onerror = (error) => {
            reject(error);
        };

        reader.readAsDataURL(file);
    });
}

/**
 * 从File对象获取ArrayBuffer
 *
 * @param file File 对象
 * @returns Promise<ArrayBuffer> 文件的ArrayBuffer
 */
export function fileToArrayBuffer(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            resolve(reader.result as ArrayBuffer);
        };

        reader.onerror = (error) => {
            reject(error);
        };

        reader.readAsArrayBuffer(file);
    });
}

/**
 * 从File对象获取文本内容
 *
 * @param file File 对象
 * @returns Promise<string> 文件的文本内容
 */
export function fileToText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            resolve(reader.result as string);
        };

        reader.onerror = (error) => {
            reject(error);
        };

        reader.readAsText(file);
    });
}

/**
 * 检查文件是否为图片并验证其尺寸
 *
 * @param file File 对象
 * @param maxWidth 最大宽度
 * @param maxHeight 最大高度
 * @returns Promise<boolean> 是否符合尺寸要求
 */
export function validateImageDimensions(file: File, maxWidth: number, maxHeight: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
        if (!getFileType(file).isImage) {
            resolve(false);
            return;
        }

        const url = URL.createObjectURL(file);
        const img = new Image();

        img.onload = () => {
            const isValid = img.width <= maxWidth && img.height <= maxHeight;
            resolve(isValid);
            URL.revokeObjectURL(url);
        };

        img.onerror = (error) => {
            reject(error);
            URL.revokeObjectURL(url);
        };

        img.src = url;
    });
}

/**
 * 限制文件上传大小和类型
 *
 * @param file File 对象
 * @param maxSize 最大文件大小（字节）
 * @param allowedTypes 允许的MIME类型或扩展名数组
 * @returns 验证结果对象
 */
export function validateFile(file: File, maxSize: number, allowedTypes?: string[]): {
    isValid: boolean;
    errors: string[];
} {
    const errors: string[] = [];

    if (file.size > maxSize) {
        errors.push(`文件大小超过限制: ${formatFileSize(file.size)} > ${formatFileSize(maxSize)}`);
    }

    if (allowedTypes && allowedTypes.length > 0) {
        if (!validateFileType(file, allowedTypes)) {
            errors.push(`文件类型不被允许: ${getFileType(file).extension}`);
        }
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

/**
 * 从输入元素获取文件列表
 *
 * @param input HTMLInputElement 对象（type="file"）
 * @returns File[] 文件数组
 */
export function getFilesFromInput(input: HTMLInputElement): File[] {
    if (!input.files) {
        return [];
    }

    return Array.from(input.files);
}

/**
 * 创建文件选择对话框并获取文件
 *
 * @param accept 接受的文件类型（如 'image/*,.pdf'）
 * @param multiple 是否允许多选
 * @returns Promise<File[]> 选择的文件数组
 */
export function selectFiles(accept?: string, multiple: boolean = false): Promise<File[]> {
    return new Promise((resolve) => {
        const input = document.createElement('input');
        input.type = 'file';
        if (accept) input.accept = accept;
        input.multiple = multiple;

        input.onchange = (event) => {
            const files = (event.target as HTMLInputElement).files;
            if (files) {
                resolve(Array.from(files));
            } else {
                resolve([]);
            }
        };

        input.click();
    });
}
