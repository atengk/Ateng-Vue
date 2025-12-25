import request from './axios'
import type {RequestOptions} from "./types";
import type {AxiosResponse} from "axios";


/**
 * GET 请求
 *
 * @param url 请求地址
 * @param options 请求选项
 * @param options.params 查询参数
 * @param options.config Axios 配置
 */
export const get = <T = any>(
    url: string,
    options?: Pick<RequestOptions, 'params' | 'config'>
) => {
    return request<T>({
        url,
        method: 'GET',
        params: options?.params,
        ...options?.config
    })
}

/**
 * POST 请求
 *
 * @param url 请求地址
 * @param options 请求选项
 * @param options.params 查询参数
 * @param options.data 请求体
 * @param options.config Axios 配置
 */
export const post = <T = any>(
    url: string,
    options?: RequestOptions
) => {
    return request<T>({
        url,
        method: 'POST',
        params: options?.params,
        data: options?.data,
        ...options?.config
    })
}

/**
 * PUT 请求
 *
 * @param url 请求地址
 * @param options 请求选项
 * @param options.params 查询参数
 * @param options.data 请求体（通常为完整更新）
 * @param options.config Axios 配置
 */
export const put = <T = any>(
    url: string,
    options?: RequestOptions
) => {
    return request<T>({
        url,
        method: 'PUT',
        params: options?.params,
        data: options?.data,
        ...options?.config
    })
}

/**
 * DELETE 请求
 *
 * @param url 请求地址
 * @param options 请求选项
 * @param options.params 查询参数
 * @param options.data 请求体（部分 DELETE 接口可能需要）
 * @param options.config Axios 配置
 */
export const del = <T = any>(
    url: string,
    options?: RequestOptions
) => {
    return request<T>({
        url,
        method: 'DELETE',
        params: options?.params,
        data: options?.data,
        ...options?.config
    })
}

/**
 * PATCH 请求
 *
 * @param url 请求地址
 * @param options 请求选项
 * @param options.params 查询参数
 * @param options.data 请求体（通常为部分更新）
 * @param options.config Axios 配置
 */
export const patch = <T = any>(
    url: string,
    options?: RequestOptions
) => {
    return request<T>({
        url,
        method: 'PATCH',
        params: options?.params,
        data: options?.data,
        ...options?.config
    })
}

/**
 * POST 表单请求（application/x-www-form-urlencoded）
 *
 * @param url 请求地址
 * @param options 请求选项
 * @param options.data 表单数据
 * @param options.params 查询参数
 * @param options.config Axios 配置
 */
export const postForm = <T = any>(
    url: string,
    options?: RequestOptions
) => {
    return request<T>({
        url,
        method: 'POST',
        params: options?.params,
        data: options?.data,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        ...options?.config
    })
}

/**
 * 文件上传请求（multipart/form-data）
 *
 * @param url 请求地址
 * @param options 请求选项
 * @param options.data FormData 对象
 * @param options.params 查询参数
 * @param options.config Axios 配置
 */
export const upload = <T = any>(
    url: string,
    options: Omit<RequestOptions, 'data'> & { data: FormData }
) => {
    return request<T>({
        url,
        method: 'POST',
        params: options.params,
        data: options.data,
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        ...options.config
    })
}

/**
 * 文件下载请求
 *
 * @param url 请求地址
 * @param options 请求选项
 * @param options.params 查询参数
 * @param options.config Axios 配置
 */
export const download = (
    url: string,
    options?: Pick<RequestOptions, 'params' | 'config'>
) => {
    return request<AxiosResponse<Blob>>({
        url,
        method: 'GET',
        params: options?.params,
        responseType: 'blob',
        raw: true,
        ...options?.config
    })
}

/**
 * 文件下载（自动触发浏览器下载）
 *
 * @param url 请求地址
 * @param options 请求选项
 * @param options.params 查询参数
 * @param options.config Axios 配置
 * @param fallbackName 兜底文件名（后端未返回时使用）
 */
export const downloadFile = async (
    url: string,
    options?: Pick<RequestOptions, 'params' | 'config'>,
    fallbackName = 'download'
) => {
    const response = await request<AxiosResponse<Blob>>({
        url,
        method: 'GET',
        params: options?.params,
        responseType: 'blob',
        raw: true,
        ...options?.config
    })

    const blob = response.data
    const headers = response.headers || {}

    /**
     * 后端异常兜底（返回 JSON）
     */
    if (blob.type?.includes('application/json')) {
        const text = await blob.text()
        const error = JSON.parse(text)
        throw new Error(error.msg || '文件下载失败')
    }

    /**
     * 解析文件名
     */
    const fileName = resolveFileName(headers, fallbackName, url)

    /**
     * 触发浏览器下载
     */
    const blobUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = blobUrl
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(blobUrl)
}

/**
 * 从响应头 / 请求路径中解析文件名
 *
 * 优先级：
 * 1. Content-Disposition header
 * 2. URL 中的文件名
 * 3. fallbackName（兜底）
 */
export function resolveFileName(
    headers: Record<string, any>,
    fallbackName: string,
    url?: string
): string {
    /**
     * Content-Disposition
     */
    const disposition =
        headers['content-disposition'] ||
        headers['Content-Disposition']

    if (disposition) {
        // RFC 5987 / 常规 filename
        const match =
            disposition.match(/filename\*=UTF-8''([^;]+)/i) ||
            disposition.match(/filename="?([^";]+)"?/i)

        if (match) {
            try {
                return decodeURIComponent(match[1])
            } catch {
                return match[1]
            }
        }
    }

    /**
     * 从 URL 推断文件名
     */
    if (url) {
        try {
            const pathname = new URL(url, window.location.origin).pathname
            const name = pathname.split('/').pop()
            if (name && name.includes('.')) {
                return name
            }
        } catch {
            // ignore
        }
    }

    /**
     * 兜底文件名
     */
    return fallbackName
}

/*
  使用示例
 ### ✔ 只传查询参数

```ts
get('/user/page', {
  params: { page: 1, size: 10 }
})
```

------

### ✔ POST 只传 body（最常见）

```ts
post('/user/add', {
  data: form
})
```

------

### ✔ 同时传 params + body

```ts
put('/user/update', {
  params: { id: 1 },
  data: form
})
```

------

### ✔ 自定义 header / timeout

```ts
post('/user/add', {
  data: form,
  config: {
    headers: {
      'X-Token': 'xxx'
    }
  }
})
```

### ✔ POST 表单请求

```ts
postForm('/login', {
  data: {
    username: 'admin',
    password: '123456'
  }
})
```

### ✔ 文件上传

```ts
const formData = new FormData()
formData.append('file', file)
formData.append('bizType', 'avatar')

upload('/file/upload', {
  data: formData
})

```

### ✔ 文件下载

```ts
const blob = await download('/file/export', {
  params: { type: 'user' }
})

const url = window.URL.createObjectURL(blob)
const link = document.createElement('a')
link.href = url
link.download = '用户数据.xlsx'
link.click()
window.URL.revokeObjectURL(url)

```

### ✔ 文件下载（直接下载）

```ts
downloadFile(
  '/file/export',
  {
    params: { type: 'user' }
  },
  '用户数据.xlsx'
)

```

 */