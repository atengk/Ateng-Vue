import { ref } from 'vue'
import type SignaturePad from 'signature_pad'
import type {
    PointGroup,
    FromDataOptions,
    FromDataUrlOptions,
    ToSVGOptions,
} from 'signature_pad'

/* ===================== 官方能力类型 ===================== */

export interface WaterMarkOption {
    text?: string
    font?: string
    style?: 'all' | 'stroke' | 'fill'
    fillStyle?: string
    strokeStyle?: string
    x?: number
    y?: number
    sx?: number
    sy?: number
}

export interface TrimResult {
    canvas: HTMLCanvasElement
    dataUrl: string
    bounds: { x: number; y: number; width: number; height: number }
}

export interface TrimOptions {
    format?: string
    encoderOptions?: number
    backgroundColor?: string
}

/**
 * Vue3Signature 对外暴露的实例（官方 README 能力全集）
 */
export interface Vue3SignatureInstance {
    save(format?: string, encoderOptions?: number): string
    toDataURL(format?: string, encoderOptions?: number): string
    toSVG(options?: ToSVGOptions): string
    clear(): void
    redraw(): void
    isEmpty(): boolean
    undo(steps?: number): void
    toData(): PointGroup[]
    fromData(data: PointGroup[], options?: FromDataOptions): void
    fromDataURL(url: string, options?: FromDataUrlOptions): Promise<void>
    addWaterMark(options: WaterMarkOption): void
    trim(options?: TrimOptions): TrimResult | null
    toTrimmedDataURL(format?: string, encoderOptions?: number): string
    enable(): void
    disable(): void
    addEventListener(
        type: string,
        listener: EventListenerOrEventListenerObject,
    ): void
    removeEventListener(
        type: string,
        listener: EventListenerOrEventListenerObject,
    ): void
    getInstance(): SignaturePad | undefined
}

/* ===================== 组合式函数 ===================== */

export function useSignaturePad() {
    const signatureRef = ref<Vue3SignatureInstance | null>(null)

    /* ---------- 基础控制 ---------- */

    const clear = (): void => {
        signatureRef.value?.clear()
    }

    const undo = (steps = 1): void => {
        signatureRef.value?.undo(steps)
    }

    const isEmpty = (): boolean => {
        return signatureRef.value?.isEmpty() ?? true
    }

    const enable = (): void => {
        signatureRef.value?.enable()
    }

    const disable = (): void => {
        signatureRef.value?.disable()
    }

    /* ---------- 导出 ---------- */

    const savePNG = (): string | null => {
        if (!signatureRef.value || isEmpty()) {
            return null
        }
        return signatureRef.value.save()
    }

    const saveJPEG = (quality = 0.92): string | null => {
        if (!signatureRef.value || isEmpty()) {
            return null
        }
        return signatureRef.value.save('image/jpeg', quality)
    }

    const saveSVG = (): string | null => {
        if (!signatureRef.value || isEmpty()) {
            return null
        }
        return signatureRef.value.save('image/svg+xml')
    }

    const downloadPNG = (filename = 'signature.png'): void => {
        const dataUrl = savePNG()
        if (!dataUrl) {
            return
        }

        const link = document.createElement('a')
        link.href = dataUrl
        link.download = filename
        link.click()
    }

    const saveTrimmed = (
        format = 'image/png',
        encoderOptions?: number,
    ): string | null => {
        if (!signatureRef.value || isEmpty()) {
            return null
        }
        return signatureRef.value.toTrimmedDataURL(format, encoderOptions)
    }

    /* ---------- 数据导入 / 导出 ---------- */

    const toData = (): PointGroup[] => {
        return signatureRef.value?.toData() ?? []
    }

    const fromData = (
        data: PointGroup[],
        options?: FromDataOptions,
    ): void => {
        signatureRef.value?.fromData(data, options)
    }

    const fromDataURL = async (
        url: string,
        options?: FromDataUrlOptions,
    ): Promise<void> => {
        if (!signatureRef.value) {
            return
        }
        await signatureRef.value.fromDataURL(url, options)
    }

    /* ---------- 水印 / 裁剪 ---------- */

    const addWaterMark = (options: WaterMarkOption): void => {
        signatureRef.value?.addWaterMark(options)
    }

    const trim = (options?: TrimOptions): TrimResult | null => {
        return signatureRef.value?.trim(options) ?? null
    }

    /* ---------- 底层实例 ---------- */

    const getInstance = (): SignaturePad | undefined => {
        return signatureRef.value?.getInstance()
    }

    return {
        signatureRef,

        clear,
        undo,
        isEmpty,
        enable,
        disable,

        savePNG,
        saveJPEG,
        saveSVG,
        saveTrimmed,

        downloadPNG,

        toData,
        fromData,
        fromDataURL,

        addWaterMark,
        trim,

        getInstance,
    }
}
