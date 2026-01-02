# Signature Pad

基于 HTML5 Canvas 的流畅签名绘制

- [官网地址](https://github.com/szimek/signature_pad)



## 基础配置

**安装依赖**

```
pnpm add signature_pad@5.1.3
```



## 最简示例

```vue
<template>
  <div class="signature-pad-container">
    <canvas ref="canvasRef" :width="width" :height="height"></canvas>

    <div class="controls">
      <button @click="clear" class="btn btn-danger">清除</button>
      <button @click="download" class="btn btn-primary">下载</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import SignaturePad from "signature_pad";

const canvasRef = ref(null);
const signaturePad = ref(null);
const width = 600;
const height = 300;

onMounted(() => {
  if (canvasRef.value) {
    signaturePad.value = new SignaturePad(canvasRef.value, {
      backgroundColor: "rgba(255, 255, 255, 1)",
      penColor: "rgb(0, 0, 0)",
      minWidth: 0.5,
      maxWidth: 2.5,
    });
  }
});

const clear = () => {
  if (signaturePad.value) {
    signaturePad.value.clear();
  }
};

const download = () => {
  const dataURL = signaturePad.value.toDataURL();
  const link = document.createElement("a");
  link.download = "signature.png";
  link.href = dataURL;
  link.click();
};
</script>
```



## 最基础示例 — 初始化并签名

```vue
<template>
  <div>
    <h3>基础签名板</h3>
    <canvas ref="canvasRef" :width="width" :height="height" style="border:1px solid #ccc;"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import SignaturePad from 'signature_pad'

const canvasRef = ref<HTMLCanvasElement | null>(null)
let signaturePad: SignaturePad | null = null
const width = 600;
const height = 300;

onMounted(() => {
  if (canvasRef.value) {
    signaturePad = new SignaturePad(canvasRef.value)
  }
})
</script>
```

✅ **特点**：只初始化，用户可以签名，但没有清除、保存功能。

---

## 添加清除和保存功能

```vue
<template>
  <div>
    <h3>签名板 + 清除 & 保存</h3>
    <canvas ref="canvasRef"  :width="width" :height="height"  style="border:1px solid #ccc;"></canvas>
    <div style="margin-top: 10px;">
      <button @click="clear">清除</button>
      <button @click="save">保存</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import SignaturePad from 'signature_pad'

const canvasRef = ref<HTMLCanvasElement | null>(null)
let signaturePad: SignaturePad | null = null
const width = 600;
const height = 300;

const clear = () => signaturePad?.clear()

const save = () => {
  if (signaturePad?.isEmpty()) {
    alert('签名为空')
    return
  }
  const dataUrl = signaturePad.toDataURL()
  console.log('签名 Base64:', dataUrl)
}

onMounted(() => {
  if (canvasRef.value) {
    signaturePad = new SignaturePad(canvasRef.value)
  }
})
</script>
```

✅ **特点**：用户可以签名、清除、保存 Base64 数据。

---

## 保存为 PNG / JPG / SVG 示例

```vue
<template>
  <div>
    <h3>签名保存多格式示例</h3>
    <canvas ref="canvasRef" :width="width" :height="height" class="signature-canvas"></canvas>

    <div style="margin-top: 10px;">
      <button @click="savePNG">保存 PNG</button>
      <button @click="saveJPG">保存 JPG</button>
      <button @click="saveSVG">保存 SVG</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import SignaturePad from 'signature_pad'

const canvasRef = ref<HTMLCanvasElement | null>(null)
let signaturePad: SignaturePad | null = null
const width = 600;
const height = 300;

onMounted(() => {
  if (canvasRef.value) {
    signaturePad = new SignaturePad(canvasRef.value)
  }
})

// 保存 PNG
const savePNG = () => {
  if (!signaturePad || signaturePad.isEmpty()) {
    alert('签名为空')
    return
  }
  const dataUrl = signaturePad.toDataURL('image/png')
  download(dataUrl, 'signature.png')
}

// 保存 JPG
function saveJPG() {
  if (!signaturePad || signaturePad.isEmpty()) {
    alert('签名为空')
    return
  }
  const canvas = canvasRef.value
  if (!canvas) return

  // 创建一个临时 canvas，用来绘制白色背景 + 原签名
  const tempCanvas = document.createElement('canvas')
  tempCanvas.width = canvas.width
  tempCanvas.height = canvas.height
  const ctx = tempCanvas.getContext('2d')
  if (!ctx) return

  // 白色背景
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height)

  // 绘制原签名
  ctx.drawImage(canvas, 0, 0)

  // 导出 JPG
  const dataUrl = tempCanvas.toDataURL('image/jpeg', 0.95)
  download(dataUrl, 'signature.jpg')
}

// 保存 SVG
const saveSVG = () => {
  if (!signaturePad || signaturePad.isEmpty()) {
    alert('签名为空')
    return
  }
  const dataUrl = signaturePad.toDataURL('image/svg+xml')
  download(dataUrl, 'signature.svg')
}

// 辅助下载函数
function download(dataUrl: string, filename: string) {
  console.log('下载文件，dataUrl=', dataUrl,'，filename=', filename)
  const link = document.createElement('a')
  link.href = dataUrl
  link.download = filename
  link.click()
}
</script>

<style scoped>
.signature-canvas {
  border: 1px solid #ccc;
  touch-action: none;
}
</style>
```

---

✅ 说明

| 功能     | 方法 / 参数                                       |
| -------- | ------------------------------------------------- |
| PNG 格式 | `signaturePad.toDataURL('image/png')`             |
| JPG 格式 | `signaturePad.toDataURL('image/jpeg', 0.95)`      |
| SVG 格式 | `signaturePad.toDataURL('image/svg+xml')`         |
| 下载文件 | 动态创建 `<a>` 标签 + `link.download` + `click()` |

> **注意**：SVG 格式生成的是矢量数据，可以无损缩放，PNG/JPG 是像素图。JPG **不支持透明通道**，导出时透明部分就会变成黑色，所以 PNG 可以正常显示（支持透明），但 JPG 会全黑。

---

## 3️⃣ 响应式 canvas & 高 DPI 适配

```vue
<template>
  <div>
    <h3>响应式签名板 + 高 DPI</h3>
    <canvas ref="canvasRef" :width="width" :height="height" style="border:1px solid #ccc;"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import SignaturePad from 'signature_pad'

const canvasRef = ref<HTMLCanvasElement | null>(null)
let signaturePad: SignaturePad | null = null
const width = 600;
const height = 300;

const resizeCanvas = () => {
  if (!canvasRef.value) return
  const canvas = canvasRef.value
  const ratio = Math.max(window.devicePixelRatio || 1, 1)
  canvas.width = canvas.offsetWidth * ratio
  canvas.height = canvas.offsetHeight * ratio
  canvas.getContext('2d')?.scale(ratio, ratio)
  signaturePad?.clear()
}

onMounted(() => {
  if (canvasRef.value) signaturePad = new SignaturePad(canvasRef.value)
  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeCanvas)
})
</script>
```

✅ **特点**：canvas 随容器大小自动调整，高 DPI 屏幕显示清晰。

---

## 设置笔触粗细、颜色 + 撤销

```vue
<template>
  <div>
    <h3>高级签名板</h3>
    <canvas ref="canvasRef" :width="width" :height="height"  style="border:1px solid #ccc;"></canvas>

    <div style="margin-top:10px;">
      <label>颜色: <input type="color" v-model="color"/></label>
      <label>粗细: <input type="range" min="1" max="10" v-model.number="lineWidth"/></label>
      <button @click="undo">撤销</button>
      <button @click="clear">清除</button>
      <button @click="save">保存</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import SignaturePad from 'signature_pad'

const canvasRef = ref<HTMLCanvasElement | null>(null)
let signaturePad: SignaturePad | null = null
const width = 600;
const height = 300;

const color = ref('#000000')
const lineWidth = ref(2)

onMounted(() => {
  if (canvasRef.value) {
    signaturePad = new SignaturePad(canvasRef.value, {
      penColor: color.value,
      minWidth: lineWidth.value,
      maxWidth: lineWidth.value,
    })
  }
})

watch([color, lineWidth], () => {
  if (signaturePad) {
    signaturePad.penColor = color.value
    signaturePad.minWidth = lineWidth.value
    signaturePad.maxWidth = lineWidth.value
  }
})

const clear = () => signaturePad?.clear()

const undo = () => {
  if (!signaturePad) return
  const data = signaturePad.toData()
  if (data.length) {
    data.pop()
    signaturePad.fromData(data)
  }
}

const save = () => {
  if (signaturePad?.isEmpty()) {
    alert('签名为空')
    return
  }
  console.log(signaturePad.toDataURL())
}
</script>
```

✅ **特点**：

* 可动态修改颜色和笔触粗细
* 支持撤销操作
* 保存签名为 Base64

---

## 加载签名 & Blob 导出 & 响应式 & 多设备支持

```vue
<template>
  <div>
    <h3>签名板 - 高级功能</h3>
    <div class="canvas-wrapper">
      <canvas ref="canvasRef" class="signature-canvas"></canvas>
    </div>

    <div class="controls">
      <button @click="clear">清除</button>
      <button @click="undo">撤销</button>
      <button @click="save">保存 (Base64)</button>
      <button @click="saveBlob">保存 (Blob)</button>
      <button @click="loadSample">加载示例签名</button>
      <label>
        颜色: <input type="color" v-model="color"/>
      </label>
      <label>
        粗细: <input type="range" min="1" max="10" v-model.number="lineWidth"/>
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import SignaturePad from 'signature_pad'

const canvasRef = ref<HTMLCanvasElement | null>(null)
let signaturePad: SignaturePad | null = null

// 笔颜色和粗细
const color = ref('#000000')
const lineWidth = ref(2)

// 调整 canvas 尺寸（响应式 + 高 DPI）
const resizeCanvas = () => {
  if (!canvasRef.value) return
  const canvas = canvasRef.value
  const ratio = Math.max(window.devicePixelRatio || 1, 1)
  canvas.width = canvas.offsetWidth * ratio
  canvas.height = canvas.offsetHeight * ratio
  const ctx = canvas.getContext('2d')
  ctx?.scale(ratio, ratio)
  signaturePad?.clear()
}

onMounted(() => {
  if (canvasRef.value) {
    signaturePad = new SignaturePad(canvasRef.value, {
      penColor: color.value,
      minWidth: lineWidth.value,
      maxWidth: lineWidth.value,
      velocityFilterWeight: 0.7, // 平滑曲线
    })
  }

  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)
})

onUnmounted(() => window.removeEventListener('resize', resizeCanvas))

// 动态更新笔属性
watch([color, lineWidth], () => {
  if (!signaturePad) return
  signaturePad.penColor = color.value
  signaturePad.minWidth = lineWidth.value
  signaturePad.maxWidth = lineWidth.value
})

// 清除签名
const clear = () => signaturePad?.clear()

// 撤销
const undo = () => {
  if (!signaturePad) return
  const data = signaturePad.toData()
  if (data.length) {
    data.pop()
    signaturePad.fromData(data)
  }
}

// 保存 Base64
const save = () => {
  if (!signaturePad || signaturePad.isEmpty()) {
    alert('签名为空')
    return
  }
  const dataUrl = signaturePad.toDataURL('image/png')
  console.log('Base64:', dataUrl)
}

// 保存 Blob
const saveBlob = () => {
  if (!signaturePad || signaturePad.isEmpty()) {
    alert('签名为空')
    return
  }
  canvasRef.value?.toBlob(blob => {
    if (blob) {
      console.log('Blob 对象:', blob)
      // 可直接上传 FormData
      // const formData = new FormData()
      // formData.append('file', blob, 'signature.png')
    }
  }, 'image/png')
}

// 加载已有签名（示例 Base64）
const loadSample = () => {
  if (!signaturePad) return
  const sampleBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...'
  signaturePad.fromDataURL(sampleBase64)
}
</script>

<style scoped>
.canvas-wrapper {
  width: 100%;
  max-width: 500px;
  height: 300px;
  border: 1px solid #ccc;
}
.signature-canvas {
  width: 100%;
  height: 100%;
  touch-action: none; /* 移动设备避免滚动冲突 */
}
.controls {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}
</style>
```

---

✅ 功能总结

| 功能                | 方法 / 实现                                   |
| ------------------- | --------------------------------------------- |
| 签名                | SignaturePad 初始化                           |
| 清除                | `signaturePad.clear()`                        |
| 撤销                | `signaturePad.toData()` + `fromData()`        |
| 保存 Base64         | `signaturePad.toDataURL()`                    |
| 保存 Blob           | `canvas.toBlob()`                             |
| 加载已有签名        | `signaturePad.fromDataURL(base64)`            |
| 响应式 & 高 DPI     | `canvas.width/height * devicePixelRatio`      |
| 多设备触控优化      | `touch-action: none` + `velocityFilterWeight` |
| 动态修改笔颜色/粗细 | `penColor` + `minWidth/maxWidth`              |

