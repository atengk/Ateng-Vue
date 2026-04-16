// src/composables/useFileview.ts
import { useClipboard, useStorage } from '@vueuse/core'
import { Base64 } from 'js-base64'

export type FileviewMode = 'normal' | 'embed'
export type FileviewSourceType = 'query' | 'data' | 'path'

export interface FileviewPreviewParams {
    url?: string
    path?: string
    fileName: string
    displayName?: string
    watermark?: string
    mode?: FileviewMode
}

export interface RecentPreviewItem {
    title: string
    url: string
    createdAt: string
}

const DEFAULT_BASE_URL = import.meta.env.VITE_FILEVIEW_BASE_URL ?? 'http://192.168.1.12:40045'
const RECENT_KEY = 'fileview:recent-preview'

function removeTrailingSlash(value: string): string {
    return value.replace(/\/+$/, '')
}

function appendIfNotEmpty(search: URLSearchParams, key: string, value?: string) {
    if (value !== undefined && value !== null && value !== '') {
        search.set(key, value)
    }
}

function requireValue(value: string | undefined, message: string): string {
    if (!value) {
        throw new Error(message)
    }
    return value
}

export function useFileview(baseUrl: string = DEFAULT_BASE_URL) {
    const recent = useStorage<RecentPreviewItem[]>(RECENT_KEY, [])
    const { copy, copied, isSupported } = useClipboard()

    const normalizedBaseUrl = removeTrailingSlash(baseUrl)
    const previewEntry = `${normalizedBaseUrl}/preview/view`

    function buildPreviewUrl(type: FileviewSourceType, params: FileviewPreviewParams): string {
        if (type === 'data') {
            const payload: Record<string, string> = {
                fileName: requireValue(params.fileName, 'data 模式必须提供 fileName'),
            }

            appendIfNotEmpty(new URLSearchParams(), 'noop', undefined)

            if (params.url) {
                payload.url = params.url
            }
            if (params.displayName) {
                payload.displayName = params.displayName
            }
            if (params.watermark) {
                payload.watermark = params.watermark
            }
            if (params.mode) {
                payload.mode = params.mode
            }

            return `${previewEntry}?data=${encodeURIComponent(Base64.encode(JSON.stringify(payload)))}`
        }

        const search = new URLSearchParams()

        if (type === 'path') {
            appendIfNotEmpty(search, 'path', requireValue(params.path, 'path 模式必须提供 path'))
        } else {
            appendIfNotEmpty(search, 'url', requireValue(params.url, 'query 模式必须提供 url'))
        }

        appendIfNotEmpty(search, 'fileName', params.fileName)
        appendIfNotEmpty(search, 'displayName', params.displayName)
        appendIfNotEmpty(search, 'watermark', params.watermark)
        appendIfNotEmpty(search, 'mode', params.mode)

        return `${previewEntry}?${search.toString()}`
    }

    function openPreview(url: string) {
        window.open(url, '_blank', 'noopener,noreferrer')
    }

    async function copyPreviewUrl(url: string) {
        await copy(url)
    }

    function pushRecent(title: string, url: string) {
        recent.value = [
            {
                title,
                url,
                createdAt: new Date().toISOString(),
            },
            ...recent.value,
        ].slice(0, 10)
    }

    return {
        recent,
        copied,
        isSupported,
        buildPreviewUrl,
        openPreview,
        copyPreviewUrl,
        pushRecent,
    }
}