# AMap 高德地图 JS API 2.0

地图 JS API 2.0 是高德开放平台免费提供的第四代 Web 地图渲染引擎， 以 WebGL 为主要绘图手段，本着“更轻、更快、更易用”的服务原则，广泛采用了各种前沿技术，交互体验、视觉体验大幅提升，同时提供了众多新增能力和特性。

- [官网地址](https://lbs.amap.com/api/javascript-api-v2/guide/abc/amap-vue)



## 基础配置

**获取 Key**

- 登录 [高德开放平台](https://console.amap.com/dev/key/app) ，获取 Key

![image-20260227160250795](./assets/image-20260227160250795.png)

**安装官方加载器**

```
pnpm add @amap/amap-jsapi-loader
pnpm add -D @amap/amap-jsapi-types
```

**配置 Key**

`.env.development`

```
VITE_API_BASE=http://localhost:8080
VITE_AMAP_KEY=1143xxxxx
VITE_AMAP_SECURITY_CODE=9a92xxxxx
```

**创建类型声明文件**

`src/types/amap.d.ts`

```ts
export {}

declare global {
    interface Window {
        _AMapSecurityConfig: {
            securityJsCode: string
        }
    }
}
```

**创建加载器**

`src/utils/amap.ts`

```ts
import AMapLoader from '@amap/amap-jsapi-loader'

let amapInstance: Promise<any> | null = null

export function loadAMap() {
    if (amapInstance) return amapInstance

    window._AMapSecurityConfig = {
        securityJsCode: import.meta.env.VITE_AMAP_SECURITY_CODE
    }

    amapInstance = AMapLoader.load({
        key: import.meta.env.VITE_AMAP_KEY,
        version: '2.0',
        plugins: []
    })

    return amapInstance
}
```



## 最简示例

```vue
<template>
  <div ref="containerRef" class="map"></div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { loadAMap } from '@/utils/amap'

const containerRef = ref<HTMLDivElement | null>(null)
let map: any = null

onMounted(async () => {
  const AMap = await loadAMap()

  map = new AMap.Map(containerRef.value!, {
    viewMode: '3D',
    zoom: 12,
    center: [106.551787,29.56268],
    resizeEnable: true
  })

  AMap.plugin(['AMap.Scale', 'AMap.ToolBar'], () => {
    map.addControl(new AMap.Scale())
    map.addControl(new AMap.ToolBar())
  })
})

onUnmounted(() => {
  map?.destroy()
})
</script>

<style scoped>
.map {
  width: 100%;
  height: 100vh;
}
</style>
```

## 添加 Marker 示例

```vue
<template>
  <div ref="containerRef" class="map"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { loadAMap } from '@/utils/amap'

const containerRef = ref<HTMLDivElement | null>(null)
let map: any = null

onMounted(async () => {
  const AMap = await loadAMap()

  map = new AMap.Map(containerRef.value!, {
    zoom: 13,
    center: [106.551787, 29.56268]
  })

  const marker = new AMap.Marker({
    position: [106.551787, 29.56268],
    title: '重庆'
  })

  map.add(marker)
})

onUnmounted(() => {
  map?.destroy()
})
</script>

<style scoped>
.map {
  width: 100%;
  height: 100vh;
}
</style>
```

------

## Marker + 信息窗体 示例

```vue
<template>
  <div ref="containerRef" class="map"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { loadAMap } from '@/utils/amap'

const containerRef = ref<HTMLDivElement | null>(null)
let map: any = null

onMounted(async () => {
  const AMap = await loadAMap()

  map = new AMap.Map(containerRef.value!, {
    zoom: 13,
    center: [106.55, 29.56]
  })

  const marker = new AMap.Marker({
    position: [106.55, 29.56]
  })

  const infoWindow = new AMap.InfoWindow({
    content: '<div>这里是重庆</div>',
    offset: new AMap.Pixel(0, -30)
  })

  marker.on('click', () => {
    infoWindow.open(map, marker.getPosition())
  })

  map.add(marker)
})

onUnmounted(() => {
  map?.destroy()
})
</script>

<style scoped>
.map {
  width: 100%;
  height: 100vh;
}
</style>
```

------

## 绘制圆形覆盖物

```vue
<template>
  <div ref="containerRef" class="map"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { loadAMap } from '@/utils/amap'

const containerRef = ref<HTMLDivElement | null>(null)
let map: any = null

onMounted(async () => {
  const AMap = await loadAMap()

  map = new AMap.Map(containerRef.value!, {
    zoom: 12,
    center: [106.55, 29.56]
  })

  const circle = new AMap.Circle({
    center: [106.55, 29.56],
    radius: 1000,
    fillColor: '#1791fc',
    strokeColor: '#0f5caa'
  })

  map.add(circle)
})

onUnmounted(() => {
  map?.destroy()
})
</script>

<style scoped>
.map {
  width: 100%;
  height: 100vh;
}
</style>
```

------

## 浏览器定位示例

```vue
<template>
  <div ref="containerRef" class="map"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { loadAMap } from '@/utils/amap'

const containerRef = ref<HTMLDivElement | null>(null)
let map: any = null

onMounted(async () => {
  const AMap = await loadAMap()

  map = new AMap.Map(containerRef.value!, {
    zoom: 13
  })

  AMap.plugin(['AMap.Geolocation'], () => {
    const geolocation = new AMap.Geolocation({
      enableHighAccuracy: true
    })

    map.addControl(geolocation)

    geolocation.getCurrentPosition((status: string, result: any) => {
      if (status === 'complete') {
        console.log('定位成功:', result.position)
      }
    })
  })
})

onUnmounted(() => {
  map?.destroy()
})
</script>

<style scoped>
.map {
  width: 100%;
  height: 100vh;
}
</style>
```

------

## 路径规划示例

```vue
<template>
  <div ref="containerRef" class="map"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { loadAMap } from '@/utils/amap'

const containerRef = ref<HTMLDivElement | null>(null)
let map: any = null

onMounted(async () => {
  const AMap = await loadAMap()

  map = new AMap.Map(containerRef.value!, {
    zoom: 12,
    center: [106.55, 29.56]
  })

  AMap.plugin(['AMap.Driving'], () => {
    const driving = new AMap.Driving({
      map
    })

    driving.search(
      [106.55, 29.56],
      [106.60, 29.58]
    )
  })
})

onUnmounted(() => {
  map?.destroy()
})
</script>

<style scoped>
.map {
  width: 100%;
  height: 100vh;
}
</style>
```

------

