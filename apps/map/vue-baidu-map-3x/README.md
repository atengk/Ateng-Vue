# vue-baidu-map-3x

baidu-map的vue3/vue2版本（支持v2.0、v3.0和webGl api）我全都有。同时也是vue2-baidu-map的文档

- [官网地址](https://map.heifa.site/doc/index.html)



## 基础配置

**安装依赖**

```
pnpm add vue-baidu-map-3x@1.0.40
```

**添加ts声明文件**

```typescript
// src/types/vue-baidu-map-3x.d.ts
declare module 'vue-baidu-map-3x' {
    import { Plugin } from 'vue'
    const BaiduMap: Plugin
    export default BaiduMap
}
```

**全局注册**

```typescript
import { createApp } from 'vue'
import App from './App.vue'
import BaiduMap from 'vue-baidu-map-3x'

const app = createApp(App);

app.use(BaiduMap, {
  // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
  ak: '百度地图ak',
  // v:'2.0',  // 默认使用3.0
  // type: 'WebGL' // ||API 默认API  (使用此模式 BMap=BMapGL)
});
app.mount('#app');
```



## 最简示例

📌 **重要：地图容器必须指定宽高**，否则地图无法渲染。

```vue
<!-- MapView.vue -->
<template>
  <baidu-map
      class="map-container"
      :center="{ lng: 116.404, lat: 39.915 }"
      :zoom="15"
      :scroll-wheel-zoom="true"
      @ready="onMapReady"
  >
    <!-- 你可以添加标记、控件等 -->
  </baidu-map>
</template>

<script setup lang="ts">
const onMapReady = ({ BMap, map }: any) => {
  console.log("地图初始化成功", BMap, map);
  // BMap 是百度地图构造对象
};
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 400px; /* 地图必须有宽高，否则不显示 */
}
</style>
```

## 添加标记 Marker

```vue
<template>
  <baidu-map
    class="map-container"
    :center="{ lng: 116.404, lat: 39.915 }"
    :zoom="14"
  >
    <bm-marker
      :position="{ lng: 116.404, lat: 39.915 }"
      :title="'天安门'"
      @click="onMarkerClick"
    />
  </baidu-map>
</template>

<script setup lang="ts">
const onMarkerClick = (e: any) => {
  alert("你点击了标记！");
};
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 400px;
}
</style>
```

## 信息窗体 InfoWindow

```vue
<template>
  <baidu-map
      class="map-container"
      :center="{ lng: 116.404, lat: 39.915 }"
      :zoom="14"
  >
    <!-- 标记点 -->
    <bm-marker
        :position="{ lng: 116.404, lat: 39.915 }"
        @click="infoWinShow = true"
    />

    <!-- 信息窗体 -->
    <bm-info-window
        :position="{ lng: 116.404, lat: 39.915 }"
        :show="infoWinShow"
        title="天安门"
        @close="infoWinShow = false"
        @open="infoWinShow = true"
    >
      <div>
        <p>北京市中心 — 天安门广场</p>
        <p>这是一个用组件方式展示的 InfoWindow。</p>
      </div>
    </bm-info-window>
  </baidu-map>
</template>

<script setup lang="ts">
import { ref } from "vue";

const infoWinShow = ref(false);
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 400px;
}
</style>
```

---

## 绘制折线 Polyline

```vue
<template>
  <baidu-map
      class="map"
      :center="{ lng: 116.404, lat: 39.915 }"
      :zoom="14"
      @mousemove="syncPolyline"
      @click="paintPolyline"
      @rightclick="newPolyline"
  >
    <bm-control>
      <button @click.stop="toggle">
        {{ polyline.editing ? '停止绘制' : '开始绘制' }}
      </button>
    </bm-control>

    <bm-polyline
        v-for="(path, index) in polyline.paths"
        :key="index"
        :path="path"
    />
  </baidu-map>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { getConfig } from 'vue-baidu-map-3x'

type Point = {
  lng: number
  lat: number
}

const config = getConfig()

const polyline = ref<{
  editing: boolean
  paths: Point[][]
}>({
  editing: false,
  paths: []
})

const toggle = () => {
  polyline.value.editing = !polyline.value.editing
}

const getPoint = (e: any): Point => {
  return config.type === 'WebGL' ? e.latlng : e.point
}

const paintPolyline = (e: any) => {
  if (!polyline.value.editing) return

  if (!polyline.value.paths.length) {
    polyline.value.paths.push([])
  }

  polyline.value.paths.at(-1)!.push(getPoint(e))
}

const syncPolyline = (e: any) => {
  if (!polyline.value.editing) return
  if (!polyline.value.paths.length) return

  const path = polyline.value.paths.at(-1)!
  if (!path.length) return

  if (path.length === 1) {
    path.push(getPoint(e))
  }

  path[path.length - 1] = getPoint(e)
}

const newPolyline = () => {
  if (!polyline.value.editing) return

  if (!polyline.value.paths.length) {
    polyline.value.paths.push([])
  }

  const path = polyline.value.paths.at(-1)!
  path.pop()

  if (path.length) {
    polyline.value.paths.push([])
  }
}
</script>

<style scoped>
.map {
  width: 100%;
  height: 400px;
}
</style>
```

---

## 地图事件示例（点击获取经纬度）

```vue
<template>
  <baidu-map
    class="map-container"
    :center="{ lng: 116.404, lat: 39.915 }"
    :zoom="14"
    @ready="onMapReady"
    @click="onMapClick"
  >
  </baidu-map>
</template>

<script setup lang="ts">
let map: any;
const onMapReady = ({ BMap, map: m }: any) => {
  map = m;
};

const onMapClick = (e: any) => {
  console.log("点击坐标:", e.point.lng, e.point.lat);
};
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 400px;
}
</style>
```

---

