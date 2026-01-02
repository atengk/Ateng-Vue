# vue-cropper

一个优雅的图片裁剪插件

- [官网地址](https://github.com/xyxiao001/vue-cropper)



## 基础配置

**安装依赖**

```
pnpm add vue-cropper@1.1.4
```



## 标准头像裁剪（1:1，Base64 预览）

```vue
<template>
  <div>
    <input type="file" accept="image/*" @change="onSelect" />

    <teleport to="body">
      <div v-if="visible" class="overlay">
        <div class="crop-dialog">
          <div class="header">
            <span>修改头像</span>
            <span class="close" @click="close">×</span>
          </div>

          <div class="body">
            <vue-cropper
              ref="cropperRef"
              :img="img"
              :autoCrop="true"
              :autoCropWidth="260"
              :autoCropHeight="260"
              :fixed="true"
              :fixedNumber="[1, 1]"
              :centerBox="true"
            />
          </div>

          <div class="footer">
            <button class="btn cancel" @click="close">取消</button>
            <button class="btn primary" @click="confirm">确认</button>
          </div>
        </div>
      </div>
    </teleport>

    <div v-if="cropped" style="margin-top: 16px">
      <p>裁剪结果：</p>
      <img :src="cropped" style="width: 120px; border-radius: 50%" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { VueCropper } from 'vue-cropper'
import 'vue-cropper/dist/index.css'

const visible = ref(false)
const img = ref('')
const cropped = ref<string | null>(null)
const cropperRef = ref<any>(null)

function onSelect(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return

  img.value = URL.createObjectURL(file)
  visible.value = true

  nextTick(() => {
    cropperRef.value?.refresh()
  })
}

function close() {
  visible.value = false
  img.value = ''
}

function confirm() {
  cropperRef.value.getCropData((data: string) => {
    cropped.value = data
    close()
  })
}
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}
.crop-dialog {
  width: 520px;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
}
.header {
  height: 48px;
  padding: 0 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
}
.close {
  cursor: pointer;
}
.body {
  height: 360px;
  padding: 12px;
}
.footer {
  padding: 12px 16px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  border-top: 1px solid #eee;
}
.btn {
  min-width: 72px;
  height: 32px;
}
.btn.primary {
  background: #409eff;
  color: #fff;
}
</style>
```

---

## 文章封面裁剪（16:9，横图）

> ✅ Banner / 封面 / 视频封面
> ✅ 只改比例，其余不动

```vue
<template>
  <div>
    <input type="file" accept="image/*" @change="onSelect" />

    <teleport to="body">
      <div v-if="visible" class="overlay">
        <div class="crop-dialog">
          <div class="header">
            <span>裁剪封面</span>
            <span class="close" @click="close">×</span>
          </div>

          <div class="body">
            <vue-cropper
                ref="cropperRef"
                :img="img"
                :autoCrop="true"
                :autoCropWidth="400"
                :autoCropHeight="225"
                :fixed="true"
                :fixedNumber="[16, 9]"
                :centerBox="true"
            />
          </div>

          <div class="footer">
            <button class="btn cancel" @click="close">取消</button>
            <button class="btn primary" @click="confirm">确认</button>
          </div>
        </div>
      </div>
    </teleport>

    <img
        v-if="cropped"
        :src="cropped"
        style="width: 320px; margin-top: 16px"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { VueCropper } from 'vue-cropper'
import 'vue-cropper/dist/index.css'

const visible = ref(false)
const img = ref('')
const cropped = ref<string | null>(null)
const cropperRef = ref<any>(null)

function onSelect(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return

  img.value = URL.createObjectURL(file)
  visible.value = true

  nextTick(() => cropperRef.value?.refresh())
}

function close() {
  visible.value = false
}

function confirm() {
  cropperRef.value.getCropData((data: string) => {
    cropped.value = data
    close()
  })
}
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}
.crop-dialog {
  width: 520px;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
}
.header {
  height: 48px;
  padding: 0 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
}
.close {
  cursor: pointer;
}
.body {
  height: 360px;
  padding: 12px;
}
.footer {
  padding: 12px 16px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  border-top: 1px solid #eee;
}
.btn {
  min-width: 72px;
  height: 32px;
}
.btn.primary {
  background: #409eff;
  color: #fff;
}
</style>
```

> 📌 `cropper-base.css` 可以直接复用示例一里的 style（完全一样）

---

## 裁剪后直接上传（Blob，生产必用）

> ✅ 不用 Base64
> ✅ 直接 `FormData` 上传

```vue
<template>
  <div>
    <input type="file" accept="image/*" @change="onSelect" />

    <teleport to="body">
      <div v-if="visible" class="overlay">
        <div class="crop-dialog">
          <div class="header">
            <span>裁剪并上传</span>
            <span class="close" @click="close">×</span>
          </div>

          <div class="body">
            <vue-cropper
                ref="cropperRef"
                :img="img"
                :autoCrop="true"
                :autoCropWidth="300"
                :autoCropHeight="300"
                :fixed="true"
                :fixedNumber="[1, 1]"
            />
          </div>

          <div class="footer">
            <button class="btn cancel" @click="close">取消</button>
            <button class="btn primary" @click="upload">上传</button>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { VueCropper } from 'vue-cropper'
import 'vue-cropper/dist/index.css'

const visible = ref(false)
const img = ref('')
const cropperRef = ref<any>(null)

function onSelect(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return

  img.value = URL.createObjectURL(file)
  visible.value = true

  nextTick(() => cropperRef.value?.refresh())
}

function close() {
  visible.value = false
}

function upload() {
  cropperRef.value.getCropBlob((blob: Blob) => {
    const form = new FormData()
    form.append('file', blob, 'image.png')

    fetch('/api/upload', {
      method: 'POST',
      body: form
    })

    close()
  })
}
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}
.crop-dialog {
  width: 520px;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
}
.header {
  height: 48px;
  padding: 0 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
}
.close {
  cursor: pointer;
}
.body {
  height: 360px;
  padding: 12px;
}
.footer {
  padding: 12px 16px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  border-top: 1px solid #eee;
}
.btn {
  min-width: 72px;
  height: 32px;
}
.btn.primary {
  background: #409eff;
  color: #fff;
}
</style>
```

---

## 导出为指定图片格式（JPEG / WEBP）

```vue
<template>
  <div>
    <input type="file" accept="image/*" @change="onSelect" />

    <teleport to="body">
      <div v-if="visible" class="overlay">
        <div class="crop-dialog">
          <div class="header">
            <span>导出指定格式</span>
            <span class="close" @click="close">×</span>
          </div>

          <div class="body">
            <vue-cropper
                ref="cropperRef"
                :img="img"
                :autoCrop="true"
                :autoCropWidth="300"
                :autoCropHeight="300"
                :fixed="true"
                :fixedNumber="[1, 1]"
                :centerBox="true"
                :outputType="outputType"
                :outputSize="outputSize"
            />
          </div>

          <div class="footer">
            <button class="btn cancel" @click="close">取消</button>
            <button class="btn primary" @click="toJpeg">导出 JPEG</button>
            <button class="btn primary" @click="toWebp">导出 WEBP</button>
          </div>
        </div>
      </div>
    </teleport>

    <div v-if="result" style="margin-top: 16px">
      <p>导出结果：</p>
      <img :src="result" style="width: 160px" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { VueCropper } from 'vue-cropper'
import 'vue-cropper/dist/index.css'

const visible = ref(false)
const img = ref('')
const result = ref<string | null>(null)
const cropperRef = ref<any>(null)

// 控制输出格式 & 压缩质量
const outputType = ref<'jpeg' | 'png' | 'webp'>('jpeg')
const outputSize = ref(1) // 0.1 ~ 1

function onSelect(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return

  img.value = URL.createObjectURL(file)
  visible.value = true

  nextTick(() => {
    cropperRef.value?.refresh()
  })
}

function close() {
  visible.value = false
}

function toJpeg() {
  outputType.value = 'jpeg'
  outputSize.value = 0.9
  cropAndGet()
}

function toWebp() {
  outputType.value = 'webp'
  outputSize.value = 0.8
  cropAndGet()
}

function cropAndGet() {
  cropperRef.value.getCropBlob((blob: Blob) => {
    if (!blob) return
    result.value = URL.createObjectURL(blob)
    close()
  })
}
</script>

<style scoped>
/* 与你的标准模板一致 */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}
.crop-dialog {
  width: 520px;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
}
.header {
  height: 48px;
  padding: 0 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
}
.close {
  cursor: pointer;
}
.body {
  height: 360px;
  padding: 12px;
}
.footer {
  padding: 12px 16px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  border-top: 1px solid #eee;
}
.btn {
  min-width: 72px;
  height: 32px;
}
.btn.primary {
  background: #409eff;
  color: #fff;
}
</style>
```

## 裁剪后压缩图片（限制最大宽度 + 质量）

```vue
<template>
  <div>
    <input type="file" accept="image/*" @change="onSelect" />

    <teleport to="body">
      <div v-if="visible" class="overlay">
        <div class="crop-dialog">
          <div class="header">
            <span>裁剪并压缩</span>
            <span class="close" @click="close">×</span>
          </div>

          <div class="body">
            <vue-cropper
                ref="cropperRef"
                :img="img"
                :autoCrop="true"
                :autoCropWidth="300"
                :autoCropHeight="300"
                :fixed="true"
                :fixedNumber="[1, 1]"
                :centerBox="true"
                :outputType="outputType"
                :outputSize="outputSize"
            />
          </div>

          <div class="footer">
            <button class="btn cancel" @click="close">取消</button>
            <button class="btn primary" @click="compress">压缩导出</button>
          </div>
        </div>
      </div>
    </teleport>

    <div v-if="result" style="margin-top: 16px">
      <p>压缩后图片：</p>
      <img :src="result" style="width: 160px" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { VueCropper } from 'vue-cropper'
import 'vue-cropper/dist/index.css'

const visible = ref(false)
const img = ref('')
const result = ref<string | null>(null)
const cropperRef = ref<any>(null)

/**
 * vue-cropper 官方压缩配置
 * outputSize：0.1 ~ 1
 */
const outputType = ref<'jpeg' | 'png' | 'webp'>('jpeg')
const outputSize = ref(0.75)

function onSelect(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return

  img.value = URL.createObjectURL(file)
  visible.value = true

  nextTick(() => {
    cropperRef.value?.refresh()
  })
}

function close() {
  visible.value = false
}

function compress() {
  cropperRef.value.getCropBlob((blob: Blob) => {
    if (!blob) return
    result.value = URL.createObjectURL(blob)
    close()
  })
}
</script>

<style scoped>
/* 仍然是你的标准模板样式 */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}
.crop-dialog {
  width: 520px;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
}
.header {
  height: 48px;
  padding: 0 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
}
.close {
  cursor: pointer;
}
.body {
  height: 360px;
  padding: 12px;
}
.footer {
  padding: 12px 16px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  border-top: 1px solid #eee;
}
.btn {
  min-width: 72px;
  height: 32px;
}
.btn.primary {
  background: #409eff;
  color: #fff;
}
</style>
```

