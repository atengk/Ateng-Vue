# Alova.js

alova（读作 `/əˈləʊva/`）是一个面向 API 集成场景的请求工具集。它将请求、缓存、状态管理、重试、分页、串行请求等能力抽象为可复用的请求策略，适合 Vue3、React、Svelte 等前端工程化场景。

- 官网：https://alova.js.org/zh-CN/

## 基础配置

### 安装依赖

```bash
pnpm add alova@3.5.1
```

### Vue3 项目推荐初始化方式

在 Vue3 项目中，建议使用 `alova/vue` 提供的 `VueHook` 作为 `statesHook`，并使用 `alova/fetch` 作为请求适配器。

```ts
// src/api/alova.ts

/**
 * alova 实例基础封装
 * @author Ateng
 * @date 2026-04-08
 */
import { createAlova } from 'alova';
import adapterFetch from 'alova/fetch';
import VueHook from 'alova/vue';

export const alovaInstance = createAlova({
  statesHook: VueHook,
  requestAdapter: adapterFetch(),
  baseURL: 'https://jsonplaceholder.typicode.com',
  responded: response => response.json()
});
```

说明：`createAlova` 需要指定请求适配器；Vue3 场景应显式传入 `statesHook`，否则组件态管理无法正确工作。`alova/fetch` 适配器默认返回 `Response`，通常需要在 `responded` 中统一 `response.json()`。([alova.js.org](https://alova.js.org/tutorial/getting-started/quick-start/))

## 请求封装

### 统一请求实例

建议将业务请求统一封装到单独模块，集中管理 `baseURL`、`timeout`、请求头、响应处理等配置。

```ts
// src/api/alova.ts

/**
 * 统一请求实例封装
 * @author Ateng
 * @date 2026-04-08
 */
import { createAlova } from 'alova';
import adapterFetch from 'alova/fetch';
import VueHook from 'alova/vue';

const getToken = (): string => {
  return localStorage.getItem('token') || '';
};

export const alovaInstance = createAlova({
  statesHook: VueHook,
  requestAdapter: adapterFetch(),
  baseURL: 'https://jsonplaceholder.typicode.com',
  responded: response => response.json(),
  beforeRequest(method) {
    const token = getToken();

    if (token) {
      method.config.headers = {
        ...method.config.headers,
        Authorization: `Bearer ${token}`
      };
    }
  }
});
```

`beforeRequest` 可用于注入请求头；`responded` 可用于统一处理响应数据。使用 `alova/fetch` 时，`responded` 收到的是原始 `Response`，需要按项目数据格式自行解析。([alova.js.org](https://alova.js.org/tutorial/client/strategy/token-authentication/))

## 接口定义

### GET / POST 基础用法

`alovaInstance.Get` 和 `alovaInstance.Post` 返回的是 method instance，不是立即执行的普通函数。GET 请求通常通过 `params` 传递查询参数，POST 请求的第二个参数是请求体，第三个参数是配置项。([alova.js.org](https://alova.js.org/tutorial/getting-started/basic/method/))

```ts
// src/api/modules/user.ts

/**
 * 用户接口定义
 * @author Ateng
 * @date 2026-04-08
 */
import { alovaInstance } from '../alova';

export interface PostItem {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export const getPostList = (params: { userId?: number }) => {
  return alovaInstance.Get<PostItem[]>('/posts', {
    params
  });
};

export const getPostDetail = (id: number) => {
  return alovaInstance.Get<PostItem>(`/posts/${id}`);
};

export const createPost = (data: {
  title: string;
  body: string;
  userId: number;
}) => {
  return alovaInstance.Post<PostItem>('/posts', data);
};

export const createPostWithQuery = (
  query: { draft?: boolean },
  data: {
    title: string;
    body: string;
    userId: number;
  }
) => {
  return alovaInstance.Post<PostItem>('/posts', data, {
    params: query
  });
};
```

## 组件中使用请求

### 自动请求

在 Vue3 组件中，`useRequest` 应从 `alova/client` 引入。默认情况下，请求会在组件创建后自动发送。([alova.js.org](https://alova.js.org/release-notes-v3/?utm_source=chatgpt.com))

```vue
<!-- 文章列表页，自动拉取数据 -->
<script setup lang="ts">
/**
 * 自动请求示例
 * @author Ateng
 * @date 2026-04-08
 */
import { useRequest } from 'alova/client';
import { getPostList, type PostItem } from '@/api/modules/user';

const { data, loading, error } = useRequest(() => getPostList({ userId: 1 }));
</script>

<template>
  <div>
    <h2>文章列表</h2>

    <div v-if="loading">加载中...</div>
    <div v-else-if="error">请求失败</div>

    <ul v-else>
      <li v-for="item in (data || []) as PostItem[]" :key="item.id">
        {{ item.title }}
      </li>
    </ul>
  </div>
</template>
```

### 手动触发请求

将 `immediate` 设为 `false` 可关闭自动请求，再通过 `send` 手动触发。`send` 的参数会传递给方法工厂函数。([alova.js.org](https://alova.js.org/tutorial/client/strategy/use-request/))

```vue
<!-- 按钮触发请求 -->
<script setup lang="ts">
/**
 * 手动触发请求示例
 * @author Ateng
 * @date 2026-04-08
 */
import { useRequest } from 'alova/client';
import { getPostList, type PostItem } from '@/api/modules/user';

const { data, loading, error, send } = useRequest(
  () => getPostList({ userId: 1 }),
  {
    immediate: false
  }
);

const handleFetch = async () => {
  await send();
};
</script>

<template>
  <div>
    <button :disabled="loading" @click="handleFetch">
      {{ loading ? '加载中...' : '加载数据' }}
    </button>

    <div v-if="error">请求失败</div>

    <ul v-if="data">
      <li v-for="item in data as PostItem[]" :key="item.id">
        {{ item.title }}
      </li>
    </ul>
  </div>
</template>
```

### 请求状态管理

`useRequest` 会自动维护 `loading`、`data`、`error`，通常不需要再额外封装一套状态机。若要统一二次封装，建议返回 `send` 和标准状态即可。

```ts
// src/hooks/useRequestState.ts

/**
 * 通用请求状态封装
 * @author Ateng
 * @date 2026-04-08
 */
import { useRequest } from 'alova/client';

export function useRequestState<T>(requestFactory: () => any) {
  const { data, loading, error, send } = useRequest<T>(requestFactory, {
    immediate: false
  });

  const execute = async () => {
    await send();
  };

  return {
    data,
    loading,
    error,
    execute
  };
}
```

## 缓存与强制请求

### 缓存配置

alova 的缓存配置主要通过 method instance 的 `cacheFor` 控制。GET 请求默认有内存缓存，常见默认时长为 5 分钟；你也可以在方法级别显式指定缓存时间。([alova.js.org](https://alova.js.org/tutorial/cache/mode/))

```ts
/**
 * 带缓存的接口定义
 * @author Ateng
 * @date 2026-04-08
 */
import { alovaInstance } from '../alova';

export const getPostListWithCache = (params: { userId?: number }) => {
  return alovaInstance.Get('/posts', {
    params,
    cacheFor: 1000 * 60 * 5
  });
};
```

### 强制请求

当你需要绕过缓存重新拉取最新数据时，可以在 `send(true)` 中传入 `true`。([alova.js.org](https://alova.js.org/zh-CN/tutorial/cache/force-request/?utm_source=chatgpt.com))

```ts
const response = await alovaInstance.Get('/posts').send(true);
```

## 分页请求

分页场景建议直接使用 `usePagination`，而不是手写 `watch + useRequest` 组合。官方文档已经把分页作为独立策略提供，并且支持预加载、缓存、翻页状态管理等能力。([alova.js.org](https://alova.js.org/tutorial/client/strategy/use-pagination/?utm_source=chatgpt.com))

```vue
<!-- 分页列表页 -->
<script setup lang="ts">
/**
 * 分页请求示例
 * @author Ateng
 * @date 2026-04-08
 */
import { usePagination } from 'alova/client';
import { alovaInstance } from '@/api/alova';

const {
  data,
  loading,
  error,
  page,
  pageSize,
  total,
  send,
  refresh
} = usePagination(
  (page, size) =>
    alovaInstance.Get('/posts', {
      params: {
        _page: page,
        _limit: size
      }
    }),
  {
    initialPage: 1,
    initialPageSize: 10,
    immediate: true,
    preloadNextPage: true
  }
);

const handlePageChange = async (newPage: number) => {
  page.value = newPage;
  await send();
};

const handleSizeChange = async (newSize: number) => {
  pageSize.value = newSize;
  page.value = 1;
  await send();
};
</script>

<template>
  <div>
    <h2>文章列表</h2>

    <div v-if="loading">加载中...</div>
    <div v-else-if="error">请求失败</div>

    <ul v-else>
      <li v-for="item in data || []" :key="item.id">
        {{ item.title }}
      </li>
    </ul>

    <div style="margin-top: 12px; display: flex; gap: 8px; align-items: center;">
      <button :disabled="page <= 1 || loading" @click="handlePageChange(page - 1)">上一页</button>
      <span>第 {{ page }} 页</span>
      <button :disabled="loading" @click="handlePageChange(page + 1)">下一页</button>
      <select :value="pageSize" @change="handleSizeChange(Number(($event.target as HTMLSelectElement).value))">
        <option :value="5">5</option>
        <option :value="10">10</option>
        <option :value="20">20</option>
      </select>
      <button :disabled="loading" @click="refresh()">刷新</button>
    </div>

    <div style="margin-top: 8px;">总数：{{ total }}</div>
  </div>
</template>
```

## 串行请求与依赖请求

### 串行请求

多个请求按顺序执行，且后一个请求可以接收前一个请求的响应数据时，建议使用 `useSerialRequest`。官方文档明确说明它比自己手写串行流程更适合此类场景。([alova.js.org](https://alova.js.org/tutorial/client/strategy/use-serial-request/))

```ts
/**
 * 串行请求示例
 * @author Ateng
 * @date 2026-04-08
 */
import { useSerialRequest } from 'alova/client';
import { getPostList, getPostDetail } from '@/api/modules/user';

const { loading, data, error, send } = useSerialRequest(
  [
    () => getPostList({ userId: 1 }),
    (list) => getPostDetail(list?.[0]?.id)
  ],
  {
    immediate: false
  }
);
```

### 依赖请求

如果只是“先请求列表，再根据列表结果请求详情”，也可以直接在一个请求工厂里串起来，然后交给 `useRequest` 管理。

```ts
/**
 * 依赖请求示例
 * @author Ateng
 * @date 2026-04-08
 */
import { useRequest } from 'alova/client';
import { getPostList, getPostDetail } from '@/api/modules/user';

const { data, loading, error, send } = useRequest(async () => {
  const list = await getPostList({ userId: 1 });

  if (!list.length) {
    return null;
  }

  return getPostDetail(list[0].id);
}, {
  immediate: false
});
```

## 并发请求

alova 没有强制把并发请求包装成专门策略时，直接使用 `Promise.all` 即可。常规做法是让每个 method instance 自行发起请求，再在业务层合并结果。

```ts
/**
 * 并发请求示例
 * @author Ateng
 * @date 2026-04-08
 */
import { getPostList } from '@/api/modules/user';

const loadBatch = async () => {
  const [list1, list2] = await Promise.all([
    getPostList({ userId: 1 }),
    getPostList({ userId: 2 })
  ]);

  return [...list1, ...list2];
};
```

## Token 鉴权与自动刷新

### 推荐实现方式

Token 相关场景建议直接使用官方提供的 token authentication interceptor，而不是手写 401 队列重试。官方方案支持登录、登出、token 注入、token 刷新以及静默刷新。([alova.js.org](https://alova.js.org/tutorial/client/strategy/token-authentication/))

```ts
/**
 * Token 鉴权封装
 * @author Ateng
 * @date 2026-04-08
 */
import { createAlova } from 'alova';
import adapterFetch from 'alova/fetch';
import VueHook from 'alova/vue';
import { createClientTokenAuthentication } from 'alova/client';

const { onAuthRequired, onResponseRefreshToken } = createClientTokenAuthentication({
  assignToken: method => {
    const token = localStorage.getItem('access_token') || '';

    if (token) {
      method.config.headers = {
        ...method.config.headers,
        Authorization: `Bearer ${token}`
      };
    }
  },
  refreshToken: {
    isExpired: () => {
      const expireTime = Number(localStorage.getItem('access_token_expire_time') || '0');
      return expireTime > 0 && expireTime < Date.now();
    },
    handler: async () => {
      const refreshToken = localStorage.getItem('refresh_token') || '';

      const res = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refreshToken })
      });

      const data = await res.json();

      localStorage.setItem('access_token', data.accessToken);
      localStorage.setItem('refresh_token', data.refreshToken);
      localStorage.setItem('access_token_expire_time', String(data.expireTime));
    }
  }
});

export const alovaAuthInstance = createAlova({
  statesHook: VueHook,
  requestAdapter: adapterFetch(),
  baseURL: '/api',
  responded: onResponseRefreshToken(response => response.clone().json()),
  beforeRequest: onAuthRequired(method => method)
});
```

